import { NextResponse } from "next/server"
import { EmployeeRequestStatus, EmployeeRequestType } from "@prisma/client"

import { getSessionUser } from "@/lib/api/session"
import { prisma } from "@/lib/prisma"

const VACATION_ALLOWANCE_DAYS = 15

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        department: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    const [pendingRequests, vacationHistory, recentRequests, lastPayrollEntry] = await Promise.all([
      prisma.employeeRequest.count({
        where: {
          profileId: profile.id,
          status: EmployeeRequestStatus.PENDING,
        },
      }),
      prisma.employeeRequest.findMany({
        where: {
          profileId: profile.id,
          type: EmployeeRequestType.VACATION,
          status: EmployeeRequestStatus.APPROVED,
        },
        select: {
          days: true,
        },
      }),
      prisma.employeeRequest.findMany({
        where: { profileId: profile.id },
        include: {
          department: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.payrollEntry.findFirst({
        where: { profileId: profile.id },
        include: {
          cycle: { select: { period: true, processedAt: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const usedVacationDays = vacationHistory.reduce((total, request) => total + (request.days ?? 0), 0)
    const availableVacationDays = Math.max(VACATION_ALLOWANCE_DAYS - usedVacationDays, 0)

    const lastPayroll = lastPayrollEntry
      ? {
          amount: Number(lastPayrollEntry.netPay),
          period: lastPayrollEntry.cycle?.period ?? "Periodo no definido",
          paidAt: lastPayrollEntry.cycle?.processedAt?.toISOString() ?? lastPayrollEntry.createdAt.toISOString(),
        }
      : {
          amount: profile.salary ? Number(profile.salary) : 0,
          period: "Salario actual",
          paidAt: profile.updatedAt.toISOString(),
        }

    return NextResponse.json({
      profile: {
        name: profile.user?.name ?? "Colaborador",
        email: profile.user?.email ?? null,
        position: profile.position ?? "Sin posición",
        department: profile.department?.name ?? "Sin departamento",
        startDate: profile.startDate?.toISOString() ?? null,
        location: profile.location ?? null,
        salary: profile.salary ? Number(profile.salary) : null,
        status: profile.status,
      },
      stats: {
        pendingRequests,
        vacation: {
          total: VACATION_ALLOWANCE_DAYS,
          used: usedVacationDays,
          available: availableVacationDays,
        },
        lastPayroll,
      },
      requests: recentRequests.map((request) => ({
        id: request.id,
        type: request.type,
        status: request.status,
        department: request.department?.name ?? null,
        startDate: request.startDate?.toISOString() ?? null,
        endDate: request.endDate?.toISOString() ?? null,
        createdAt: request.createdAt.toISOString(),
        days: request.days ?? null,
        reason: request.reason ?? null,
      })),
    })
  } catch (error) {
    console.error("[employee dashboard] error", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
