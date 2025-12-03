import { NextResponse } from "next/server"

import { getSessionUser } from "@/lib/api/session"
import { prisma } from "@/lib/prisma"

const MONTHS_TO_INCLUDE = 12

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, salary: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    const entries = await prisma.payrollEntry.findMany({
      where: { profileId: profile.id },
      include: {
        cycle: {
          select: {
            period: true,
            processedAt: true,
            status: true,
          },
        },
      },
      orderBy: [
        { cycle: { processedAt: "desc" } },
        { createdAt: "desc" },
      ],
      take: 24,
    })

    const normalizedEntries = entries.map((entry) => {
      const periodDate = entry.cycle?.processedAt ?? entry.createdAt
      return {
        id: entry.id,
        period: entry.cycle?.period ?? "Periodo sin definir",
        baseSalary: Number(entry.baseSalary),
        overtime: Number(entry.overtime),
        bonuses: Number(entry.bonuses),
        deductions: Number(entry.deductions),
        netPay: Number(entry.netPay),
        status: entry.cycle?.status?.toLowerCase() ?? "paid",
        paidDate: periodDate.toISOString(),
      }
    })

    const referenceEntries = normalizedEntries.slice(0, MONTHS_TO_INCLUDE)

    const totals = referenceEntries.reduce(
      (acc, entry) => {
        acc.earnings += entry.baseSalary + entry.overtime + entry.bonuses
        acc.deductions += entry.deductions
        acc.net += entry.netPay
        return acc
      },
      { earnings: 0, deductions: 0, net: 0 },
    )

    const stats = {
      totalEarnings: totals.earnings,
      totalDeductions: totals.deductions,
      netIncome: totals.net,
      averageMonthly: referenceEntries.length ? totals.net / referenceEntries.length : profile.salary ? Number(profile.salary) : 0,
    }

    return NextResponse.json({
      entries: normalizedEntries,
      stats,
      fallbackSalary: profile.salary ? Number(profile.salary) : null,
    })
  } catch (error) {
    console.error("[employee payroll] error", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
