import { EmploymentStatus, EmployeeRequestStatus, JobOpeningStatus } from "@prisma/client"

export type WorkforceSummary = {
  headcount: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
  employees: Array<{
    id: string
    name: string
    email: string | null
    department: string | null
    position: string | null
    status: EmploymentStatus
    startDate: string | null
    createdAt: string
  }>
  recentHires: Array<{
    id: string
    name: string
    department: string | null
    position: string | null
    startDate: string
    createdAt: string
  }>
  departments: Array<{
    id: string | null
    name: string
    employees: number
  }>
  openPositions: {
    totalRoles: number
    totalOpenings: number
    positions: Array<{
      id: string
      title: string
      department: string | null
      location: string | null
      employmentType: string | null
      status: JobOpeningStatus
      priority: string
      openings: number
      filled: number
      applications: number
      postedAt: string
    }>
  }
  requests: {
    total: number
    pending: number
    list: Array<{
      id: string
      employee: string
      type: string
      department: string | null
      status: EmployeeRequestStatus
      startDate: string | null
      endDate: string | null
    }>
  }
  satisfaction: {
    average: number
    responses: number
  }
  departmentsCatalog: Array<{
    id: string
    name: string
  }>
}
