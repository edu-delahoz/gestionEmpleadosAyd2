import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { revalidateTag } from "next/cache"

import {
  MASTER_CACHE_TAG,
  createMaster,
  listMasters,
  type MasterWithRelations,
} from "@/lib/data/masters"
import { getSessionUser } from "@/lib/api/session"
import { buildErrorResponse } from "@/lib/api/errors"

const createMasterSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(80, "El slug es demasiado largo")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(500, "La descripción no debe superar 500 caracteres")
    .optional()
    .nullable(),
  departmentId: z.string().optional().nullable(),
  initialBalance: z.coerce.number().nonnegative("El saldo inicial debe ser positivo"),
  status: z.string().max(30).optional().nullable(),
})

const serializeMaster = (master: MasterWithRelations) => ({
  id: master.id,
  slug: master.slug,
  name: master.name,
  description: master.description,
  departmentId: master.departmentId,
  department: master.department
    ? {
        id: master.department.id,
        name: master.department.name,
      }
    : null,
  initialBalance: Number(master.initialBalance),
  currentBalance: Number(master.currentBalance),
  status: master.status,
  createdBy: {
    id: master.createdBy.id,
    name: master.createdBy.name,
    email: master.createdBy.email,
    role: master.createdBy.role.toLowerCase(),
  },
  createdAt: master.createdAt.toISOString(),
  updatedAt: master.updatedAt.toISOString(),
  movementsCount: master._count?.movements ?? 0,
})

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const masters = await listMasters()
    return NextResponse.json(masters.map(serializeMaster))
  } catch (error) {
    return buildErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createMasterSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  try {
    const master = await createMaster(parsed.data, user)
    revalidateTag(MASTER_CACHE_TAG)
    return NextResponse.json(serializeMaster(master), { status: 201 })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
