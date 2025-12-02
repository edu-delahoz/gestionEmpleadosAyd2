import { MovementType } from "@prisma/client"
import { NextResponse, type NextRequest } from "next/server"
import { revalidateTag } from "next/cache"
import { z } from "zod"

import { getSessionUser } from "@/lib/api/session"
import { buildErrorResponse } from "@/lib/api/errors"
import { MASTER_CACHE_TAG } from "@/lib/data/masters"
import {
  createMovement,
  listMovementsByMaster,
  movementTag,
  type MovementWithRelations,
} from "@/lib/data/movements"

const createMovementSchema = z.object({
  masterId: z.string().min(1, "El maestro es obligatorio"),
  movementType: z.nativeEnum(MovementType, {
    errorMap: () => ({ message: "Tipo de movimiento inválido" }),
  }),
  quantity: z
    .coerce.number()
    .refine((value) => Number.isFinite(value) && value !== 0, "La cantidad debe ser distinta de cero"),
  notes: z
    .string()
    .max(500, "Las notas no deben superar 500 caracteres")
    .optional()
    .nullable(),
  referencePeriod: z
    .string()
    .max(50, "El periodo de referencia es muy largo")
    .optional()
    .nullable(),
  metadata: z.record(z.any()).optional(),
})

const serializeMovement = (movement: MovementWithRelations) => ({
  id: movement.id,
  masterId: movement.masterId,
  master: movement.master
    ? {
        id: movement.master.id,
        name: movement.master.name,
        slug: movement.master.slug,
      }
    : null,
  movementType: movement.movementType,
  quantity: Number(movement.quantity),
  notes: movement.notes,
  referencePeriod: movement.referencePeriod,
  metadata: movement.metadata,
  performedBy: {
    id: movement.performedBy.id,
    name: movement.performedBy.name,
    email: movement.performedBy.email,
    role: movement.performedBy.role.toLowerCase(),
  },
  createdAt: movement.createdAt.toISOString(),
})

export async function GET(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const masterId = searchParams.get("masterId")

  if (!masterId) {
    return NextResponse.json({ error: "Debes indicar el maestro" }, { status: 400 })
  }

  try {
    const movements = await listMovementsByMaster(masterId)
    return NextResponse.json(movements.map(serializeMovement))
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
  const parsed = createMovementSchema.safeParse(body)

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
    const movement = await createMovement(parsed.data, user)
    revalidateTag(MASTER_CACHE_TAG)
    revalidateTag(movementTag(parsed.data.masterId))
    return NextResponse.json(serializeMovement(movement), { status: 201 })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
