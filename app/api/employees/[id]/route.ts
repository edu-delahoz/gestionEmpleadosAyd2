import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/api/session"
import { buildErrorResponse } from "@/lib/api/errors"
import { employeeInclude, serializeEmployee } from "@/lib/api/employees"

const UPDATE_ROLES = new Set(["admin"])
const DELETE_ROLES = new Set(["admin"])

const updateEmployeeSchema = z.object({
  position: z.string().min(2).max(120).optional(),
  departmentId: z.string().optional().nullable(),
  salary: z.coerce.number().nonnegative().optional().nullable(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!UPDATE_ROLES.has(user.role)) {
    return NextResponse.json({ error: "No tienes permisos para editar empleados" }, { status: 403 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = updateEmployeeSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: params.id },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    const data = parsed.data
    const updateData: Prisma.ProfileUpdateInput = {}

    if (data.position !== undefined) {
      updateData.position = data.position.trim()
    }

    if (data.salary !== undefined) {
      updateData.salary = data.salary != null ? new Prisma.Decimal(data.salary) : null
    }

    if (data.departmentId !== undefined) {
      if (data.departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: data.departmentId },
          select: { id: true },
        })

        if (!department) {
          return NextResponse.json({ error: "Departamento no encontrado" }, { status: 404 })
        }

        updateData.department = { connect: { id: department.id } }
      } else {
        updateData.department = { disconnect: true }
      }
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    })

    const updated = await prisma.user.findUnique({
      where: { id: params.id },
      include: employeeInclude,
    })

    if (!updated) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json(serializeEmployee(updated))
  } catch (error) {
    return buildErrorResponse(error)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!DELETE_ROLES.has(user.role)) {
    return NextResponse.json({ error: "No tienes permisos para eliminar empleados" }, { status: 403 })
  }

  if (user.id === params.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 })
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    await prisma.profile.delete({ where: { userId: params.id } }).catch(() => null)
    await prisma.user.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
