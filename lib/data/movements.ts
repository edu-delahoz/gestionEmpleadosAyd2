import { MovementType, Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { SessionUser } from "@/lib/data/types"
import { updateBalance } from "@/lib/data/masters"

export const MOVEMENTS_CACHE_TAG = "movements"

export const movementTag = (masterId?: string) => (masterId ? `${MOVEMENTS_CACHE_TAG}:${masterId}` : MOVEMENTS_CACHE_TAG)

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
  masterId: string
  movementType: MovementType
  quantity: Prisma.Decimal.Value
  notes?: string | null
  referencePeriod?: string | null
  metadata?: Prisma.JsonValue
}

export async function listMovementsByMaster(masterId: string) {
  if (!masterId) {
    throw new Error("Debes indicar el maestro a consultar")
  }

  return prisma.inventoryMovement.findMany({
    where: { masterId },
    include: movementInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function createMovement(input: CreateMovementInput, user: SessionUser) {
  if (!MOVEMENT_ROLES.has(user.role)) {
    throw new Error("No tienes permisos para crear movimientos")
  }

  if (!input.masterId) {
    throw new Error("El maestro es obligatorio")
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
    await updateBalance(input.masterId, delta, tx)

    return tx.inventoryMovement.create({
      data: {
        masterId: input.masterId,
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
