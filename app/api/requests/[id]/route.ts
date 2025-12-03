import { NextResponse } from "next/server"
import { z } from "zod"
import { EmployeeRequestStatus } from "@prisma/client"

import { getSessionUser } from "@/lib/api/session"
import { prisma } from "@/lib/prisma"
import { requestInclude, serializeRequest } from "@/lib/api/requests"

const updateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED", "PENDING"]),
})

const MANAGE_ROLES = new Set(["hr", "admin"])

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!MANAGE_ROLES.has(sessionUser.role)) {
    return NextResponse.json({ error: "No tienes permisos para actualizar solicitudes" }, { status: 403 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = updateSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const updated = await prisma.employeeRequest.update({
      where: { id: params.id },
      data: { status: parsed.data.status as EmployeeRequestStatus },
      include: requestInclude,
    })

    return NextResponse.json(serializeRequest(updated))
  } catch (error) {
    console.error("[requests] PATCH", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
