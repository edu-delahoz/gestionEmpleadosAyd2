import { EmploymentStatus, EmployeeRequestStatus, JobOpeningStatus } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { WorkforceSummary } from "@/types/dashboard"

const DAYS_30 = 1000 * 60 * 60 * 24 * 30
const DAYS_90 = 1000 * 60 * 60 * 24 * 90

const formatDate = (value: Date | null) => (value ? value.toISOString() : null)

export async function fetchWorkforceSummary(): Promise<WorkforceSummary> {
  const now = Date.now()
  const lastMonth = new Date(now - DAYS_30)
  const lastQuarter = new Date(now - DAYS_90)

  const [profiles, jobOpenings, requests, surveys, departments] = await Promise.all([
    prisma.profile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        department: { select: { id: true, name: true } },
      },
    }),
    prisma.jobOpening.findMany({
      include: {
        department: { select: { name: true } },
      },
      orderBy: { postedAt: "desc" },
    }),
    prisma.employeeRequest.findMany({
      include: {
        profile: {
          include: {
            user: { select: { name: true } },
          },
        },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.satisfactionSurvey.findMany({
      select: { score: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.department.findMany({ select: { id: true, name: true } }),
  ])

  const employees = profiles.map((profile) => ({
    id: profile.id,
    name: profile.user?.name ?? "Colaborador",
    email: profile.user?.email ?? null,
    department: profile.department?.name ?? null,
    position: profile.position ?? null,
    status: profile.status,
    startDate: formatDate(profile.startDate ?? profile.createdAt),
    createdAt: profile.createdAt.toISOString(),
  }))

  const activeEmployees = employees.filter((employee) => employee.status === EmploymentStatus.ACTIVE)
  const newThisMonth = activeEmployees.filter((employee) => {
    const startDate = employee.startDate ? new Date(employee.startDate).getTime() : 0
    return startDate >= lastMonth.getTime()
  }).length

  const recencyValue = (employee: (typeof employees)[number]) => {
    const startDate = employee.startDate ? new Date(employee.startDate).getTime() : 0
    const createdAt = employee.createdAt ? new Date(employee.createdAt).getTime() : 0
    return Math.max(startDate, createdAt)
  }

  const recentHires = [...activeEmployees]
    .filter((employee) => recencyValue(employee) >= lastQuarter.getTime())
    .sort((a, b) => recencyValue(b) - recencyValue(a))
    .slice(0, 5)

  const departmentNameToId = new Map(departments.map((department) => [department.name, department.id]))
  const departmentsMap = new Map<string, { id: string | null; name: string; employees: number }>()

  for (const employee of activeEmployees) {
    const key = employee.department ?? "Sin departamento"
    const departmentId = employee.department ? departmentNameToId.get(employee.department) ?? null : null
    const existing = departmentsMap.get(key)

    if (existing) {
      existing.employees += 1
    } else {
      departmentsMap.set(key, {
        id: departmentId,
        name: key,
        employees: 1,
      })
    }
  }

  const openPositions = jobOpenings.map((opening) => ({
    id: opening.id,
    title: opening.title,
    department: opening.department?.name ?? null,
    location: opening.location,
    employmentType: opening.employmentType,
    status: opening.status,
    priority: opening.priority.toLowerCase(),
    openings: opening.openings,
    filled: opening.filled,
    applications: opening.applications,
    postedAt: opening.postedAt.toISOString(),
  }))

  const totalOpenRoles = openPositions.length
  const totalOpenings = openPositions
    .filter((opening) => opening.status === JobOpeningStatus.OPEN)
    .reduce((acc, opening) => acc + Math.max(opening.openings - opening.filled, 0), 0)

  const requestList = requests.map((request) => ({
    id: request.id,
    employee: request.profile?.user?.name ?? "Sin asignar",
    type: request.type.toLowerCase(),
    department: request.department?.name ?? null,
    status: request.status,
    startDate: formatDate(request.startDate ?? null),
    endDate: formatDate(request.endDate ?? null),
  }))

  const pendingRequests = requestList.filter((request) => request.status === EmployeeRequestStatus.PENDING)

  const satisfactionResponses = surveys.filter((survey) => survey.createdAt >= lastQuarter)
  const satisfactionAverageRaw =
    satisfactionResponses.reduce((sum, survey) => sum + survey.score, 0) / (satisfactionResponses.length || 1)
  const satisfactionAverage = satisfactionResponses.length ? satisfactionAverageRaw : 0

  return {
    headcount: {
      total: employees.length,
      active: activeEmployees.length,
      inactive: employees.length - activeEmployees.length,
      newThisMonth,
    },
    employees: [...activeEmployees].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6),
    recentHires,
    departments: Array.from(departmentsMap.values()).sort((a, b) => b.employees - a.employees),
    openPositions: {
      totalRoles: totalOpenRoles,
      totalOpenings,
      positions: openPositions.slice(0, 6),
    },
    requests: {
      total: requestList.length,
      pending: pendingRequests.length,
      list: pendingRequests.slice(0, 5),
    },
    satisfaction: {
      average: Number(satisfactionAverage.toFixed(2)),
      responses: satisfactionResponses.length,
    },
    departmentsCatalog: departments.map((department) => ({
      id: department.id,
      name: department.name,
    })),
  }
}
