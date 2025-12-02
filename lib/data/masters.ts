import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { SessionUser } from "@/lib/data/types"

export const MASTER_CACHE_TAG = "masters"

const masterInclude = {
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  _count: {
    select: {
      movements: true,
    },
  },
} satisfies Prisma.MasterRecordInclude

export type MasterWithRelations = Prisma.MasterRecordGetPayload<{
  include: typeof masterInclude
}>

const MANAGE_ROLES = new Set<SessionUser["role"]>(["admin", "hr"])

export type CreateMasterInput = {
  name: string
  slug?: string | null
  description?: string | null
  departmentId?: string | null
  initialBalance: Prisma.Decimal.Value
  status?: string
}

const baseSlug = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

async function ensureUniqueSlug(nameOrSlug: string) {
  const normalized = baseSlug(nameOrSlug)
  if (!normalized) {
    throw new Error("El nombre o slug del maestro no es válido")
  }

  let candidate = normalized
  let suffix = 1

  while (true) {
    const existing = await prisma.masterRecord.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }

    candidate = `${normalized}-${suffix}`
    suffix += 1
  }
}

export async function listMasters() {
  return prisma.masterRecord.findMany({
    include: masterInclude,
    orderBy: { createdAt: "desc" },
  })
}

export async function createMaster(input: CreateMasterInput, user: SessionUser) {
  if (!MANAGE_ROLES.has(user.role)) {
    throw new Error("No tienes permisos para crear recursos maestros")
  }

  const name = input.name?.trim()
  if (!name) {
    throw new Error("El nombre del maestro es obligatorio")
  }

  const initialBalance = new Prisma.Decimal(input.initialBalance ?? 0)
  if (initialBalance.lt(0)) {
    throw new Error("El saldo inicial debe ser mayor o igual a cero")
  }

  const slug = await ensureUniqueSlug(input.slug?.trim() || name)

  return prisma.masterRecord.create({
    data: {
      slug,
      name,
      description: input.description?.trim() || null,
      departmentId: input.departmentId || null,
      initialBalance,
      currentBalance: initialBalance,
      createdById: user.id,
      status: input.status?.trim() || "active",
    },
    include: masterInclude,
  })
}

export async function updateBalance(masterId: string, delta: Prisma.Decimal.Value, tx?: Prisma.TransactionClient) {
  const amount = new Prisma.Decimal(delta)
  const client = tx ?? prisma

  const master = await client.masterRecord.findUnique({
    where: { id: masterId },
    select: { id: true, currentBalance: true },
  })

  if (!master) {
    throw new Error("Maestro no encontrado")
  }

  const currentBalance = new Prisma.Decimal(master.currentBalance)
  const nextBalance = currentBalance.plus(amount)

  if (nextBalance.lt(0)) {
    throw new Error("El saldo no puede ser negativo")
  }

  return client.masterRecord.update({
    where: { id: masterId },
    data: {
      currentBalance: nextBalance,
    },
    include: masterInclude,
  })
}
