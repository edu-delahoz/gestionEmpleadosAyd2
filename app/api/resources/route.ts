import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { revalidateTag } from "next/cache"

import {
  RESOURCES_CACHE_TAG,
  createResource,
  listResources,
  type ResourceWithRelations,
} from "@/lib/data/resources"
import { getSessionUser } from "@/lib/api/session"
import { buildErrorResponse } from "@/lib/api/errors"

const createResourceSchema = z.object({
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

const serializeResource = (resource: ResourceWithRelations) => ({
  id: resource.id,
  slug: resource.slug,
  name: resource.name,
  description: resource.description,
  departmentId: resource.departmentId,
  department: resource.department
    ? {
        id: resource.department.id,
        name: resource.department.name,
      }
    : null,
  initialBalance: Number(resource.initialBalance),
  currentBalance: Number(resource.currentBalance),
  status: resource.status,
  createdBy: {
    id: resource.createdBy.id,
    name: resource.createdBy.name,
    email: resource.createdBy.email,
    role: resource.createdBy.role.toLowerCase(),
  },
  createdAt: resource.createdAt.toISOString(),
  updatedAt: resource.updatedAt.toISOString(),
  movementsCount: resource._count?.movements ?? 0,
})

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const resources = await listResources()
    return NextResponse.json(resources.map(serializeResource))
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
  const parsed = createResourceSchema.safeParse(body)

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
    const resource = await createResource(parsed.data, user)
    revalidateTag(RESOURCES_CACHE_TAG)
    return NextResponse.json(serializeResource(resource), { status: 201 })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
