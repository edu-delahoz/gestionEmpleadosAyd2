import { MovementType, Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { SessionUser } from "@/lib/data/types"
import { updateResourceBalance } from "@/lib/data/resources"

export const MOVEMENTS_CACHE_TAG = "movements"

export const movementTag = (resourceId?: string) =>
  resourceId ? `${MOVEMENTS_CACHE_TAG}:${resourceId}` : MOVEMENTS_CACHE_TAG

const MOVEMENT_ROLES = new Set<SessionUser["role"]>(["employee", "manager", "hr", "admin"])

const movementInclude = {
  master: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  performedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.InventoryMovementInclude

export type MovementWithRelations = Prisma.InventoryMovementGetPayload<{
  include: typeof movementInclude
}>

export type CreateMovementInput = {
  resourceId: string
  movementType: MovementType
  quantity: Prisma.Decimal.Value
  notes?: string | null
  referencePeriod?: string | null
  metadata?: Prisma.JsonValue
}

export async function listMovementsByResource(resourceId: string) {
  if (!resourceId) {
    throw new Error("Debes indicar el recurso a consultar")
  }

  return prisma.inventoryMovement.findMany({
    where: { masterId: resourceId },
    include: movementInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function createMovement(input: CreateMovementInput, user: SessionUser) {
  if (!MOVEMENT_ROLES.has(user.role)) {
    throw new Error("No tienes permisos para crear movimientos")
  }

  if (!input.resourceId) {
    throw new Error("El recurso es obligatorio")
  }

  const rawQuantity = new Prisma.Decimal(input.quantity ?? 0)
  if (rawQuantity.isZero()) {
    throw new Error("La cantidad debe ser distinta de cero")
  }

  if (input.movementType !== MovementType.ADJUSTMENT && rawQuantity.lt(0)) {
    throw new Error("Las entradas y salidas deben ser cantidades positivas")
  }

  const normalizedQuantity = rawQuantity.abs()

  let delta: Prisma.Decimal
  let storedQuantity: Prisma.Decimal

  switch (input.movementType) {
    case MovementType.ENTRY: {
      delta = normalizedQuantity
      storedQuantity = normalizedQuantity
      break
    }
    case MovementType.EXIT: {
      delta = normalizedQuantity.neg()
      storedQuantity = normalizedQuantity
      break
    }
    case MovementType.ADJUSTMENT: {
      delta = rawQuantity
      storedQuantity = rawQuantity
      break
    }
    default: {
      throw new Error("Tipo de movimiento inválido")
    }
  }

  return prisma.$transaction(async (tx) => {
    await updateResourceBalance(input.resourceId, delta, tx)

    return tx.inventoryMovement.create({
      data: {
        masterId: input.resourceId,
        performedById: user.id,
        movementType: input.movementType,
        quantity: storedQuantity,
        notes: input.notes?.trim() || null,
        referencePeriod: input.referencePeriod?.trim() || null,
        metadata: input.metadata ?? undefined,
      },
      include: movementInclude,
    })
  })
}
