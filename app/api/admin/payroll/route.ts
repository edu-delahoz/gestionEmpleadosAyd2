import { NextResponse } from "next/server"
import { PayrollStatus } from "@prisma/client"

import { getSessionUser } from "@/lib/api/session"
import { prisma } from "@/lib/prisma"

const PROCESSED_STATUSES = [PayrollStatus.PROCESSED, PayrollStatus.PAID]
const PENDING_STATUSES = [PayrollStatus.DRAFT, PayrollStatus.PROCESSING]

export async function GET() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  try {
    const [employeeCount, salaryAggregate, processedCycles, pendingCycles, cycles, recentEntries] = await Promise.all([
      prisma.profile.count(),
      prisma.profile.aggregate({
        _avg: { salary: true },
        where: { salary: { not: null } },
      }),
      prisma.payrollCycle.count({
        where: { status: { in: PROCESSED_STATUSES } },
      }),
      prisma.payrollCycle.count({
        where: { status: { in: PENDING_STATUSES } },
      }),
      prisma.payrollCycle.findMany({
        orderBy: { period: "desc" },
        include: {
          processedBy: {
            select: { id: true, name: true },
          },
          _count: {
            select: { entries: true },
          },
        },
        take: 6,
      }),
      prisma.payrollEntry.findMany({
        include: {
          profile: {
            select: {
              user: { select: { name: true, email: true } },
              department: { select: { name: true } },
            },
          },
          cycle: {
            select: {
              period: true,
              status: true,
              processedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ])

    const latestCycle = cycles[0] ?? null
    const avgSalary = salaryAggregate._avg.salary ? Number(salaryAggregate._avg.salary) : 0
    const totalPayroll = latestCycle ? Number(latestCycle.totalNet ?? latestCycle.totalGross) : 0

    const normalizedCycles = cycles.map((cycle) => ({
      id: cycle.id,
      period: cycle.period,
      status: cycle.status.toLowerCase(),
      totalGross: Number(cycle.totalGross),
      totalDeductions: Number(cycle.totalDeductions),
      totalNet: Number(cycle.totalNet),
      processedAt: cycle.processedAt ? cycle.processedAt.toISOString() : null,
      processedBy: cycle.processedBy?.name ?? null,
      entriesCount: cycle._count.entries,
    }))

    const normalizedEntries = recentEntries.map((entry) => ({
      id: entry.id,
      employeeName: entry.profile.user?.name ?? "Empleado sin nombre",
      employeeEmail: entry.profile.user?.email ?? "",
      department: entry.profile.department?.name ?? "Sin departamento",
      netPay: Number(entry.netPay),
      period: entry.cycle?.period ?? "Periodo sin definir",
      status: (entry.cycle?.status ?? PayrollStatus.PROCESSED).toLowerCase(),
      paidAt: (entry.cycle?.processedAt ?? entry.createdAt).toISOString(),
    }))

    return NextResponse.json({
      summary: {
        totalPayroll,
        employeeCount,
        avgSalary,
        processedCycles,
        pendingCycles,
        latestPeriod: latestCycle?.period ?? null,
      },
      cycles: normalizedCycles,
      entries: normalizedEntries,
    })
  } catch (error) {
    console.error("[admin payroll] error", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
