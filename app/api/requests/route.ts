import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { EmployeeRequestStatus, EmployeeRequestType } from "@prisma/client"

import { getSessionUser } from "@/lib/api/session"
import { prisma } from "@/lib/prisma"
import { requestInclude, serializeRequest } from "@/lib/api/requests"

const requestSchema = z.object({
  type: z.enum(["vacation", "other"]),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  reason: z.string().min(5, "Describe brevemente el motivo"),
})

const canViewAll = (role: string) => role === "hr" || role === "admin"

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, departmentId: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    const { startDate, endDate, type, reason } = parsed.data
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : start

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "Fechas inválidas" }, { status: 400 })
    }

    if (end < start) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la de inicio" }, { status: 400 })
    }

    const ONE_DAY = 1000 * 60 * 60 * 24
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / ONE_DAY) + 1)

    const newRequest = await prisma.employeeRequest.create({
      data: {
        profileId: profile.id,
        departmentId: profile.departmentId,
        type: type.toUpperCase() as EmployeeRequestType,
        reason: reason.trim(),
        status: EmployeeRequestStatus.PENDING,
        startDate: start,
        endDate: end,
        days,
      },
      include: requestInclude,
    })

    return NextResponse.json({ message: "Solicitud creada exitosamente", request: serializeRequest(newRequest) }, { status: 201 })
  } catch (error) {
    console.error("[requests] POST", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get("status")
  const profileIdQuery = searchParams.get("profileId")
  const includeAll = searchParams.get("all") === "true"

  try {
    const where: Record<string, unknown> = {}

    if (statusParam) {
      const normalized = statusParam.toUpperCase() as EmployeeRequestStatus
      if (!Object.values(EmployeeRequestStatus).includes(normalized)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
      }
      where.status = normalized
    }

    if (canViewAll(user.role) && (includeAll || profileIdQuery)) {
      if (profileIdQuery) {
        where.profileId = profileIdQuery
      }
    } else {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      })

      if (!profile) {
        return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
      }

      where.profileId = profile.id
    }

    const requests = await prisma.employeeRequest.findMany({
      where,
      include: requestInclude,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(requests.map(serializeRequest))
  } catch (error) {
    console.error("[requests] GET", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
