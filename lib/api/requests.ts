import { Prisma } from "@prisma/client"

export const requestInclude = {
  department: { select: { name: true } },
  profile: {
    include: {
      user: { select: { name: true, email: true } },
      department: { select: { name: true } },
    },
  },
} satisfies Prisma.EmployeeRequestInclude

export type RequestWithRelations = Prisma.EmployeeRequestGetPayload<{
  include: typeof requestInclude
}>

export const serializeRequest = (request: RequestWithRelations) => ({
  id: request.id,
  type: request.type.toLowerCase(),
  status: request.status,
  startDate: request.startDate?.toISOString() ?? null,
  endDate: request.endDate?.toISOString() ?? null,
  days: request.days,
  reason: request.reason ?? null,
  createdAt: request.createdAt.toISOString(),
  department: request.department?.name ?? request.profile?.department?.name ?? null,
  profile: request.profile
    ? {
        id: request.profile.id,
        name: request.profile.user?.name ?? null,
        email: request.profile.user?.email ?? null,
      }
    : null,
})
