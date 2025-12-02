import { EmploymentStatus, Prisma } from "@prisma/client"

export const employeeInclude = {
  profile: {
    include: {
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.UserInclude

export type EmployeeWithRelations = Prisma.UserGetPayload<{
  include: typeof employeeInclude
}>

export function serializeEmployee(user: EmployeeWithRelations) {
  const profile = user.profile
  return {
    id: user.id,
    name: user.name ?? "Sin nombre",
    email: user.email ?? null,
    avatar: user.image ?? null,
    role: user.role.toLowerCase(),
    createdAt: user.createdAt.toISOString(),
    employeeCode: profile?.employeeCode ?? null,
    position: profile?.position ?? null,
    departmentId: profile?.department?.id ?? null,
    department: profile?.department?.name ?? null,
    status: profile?.status ?? EmploymentStatus.ACTIVE,
    startDate: profile?.startDate?.toISOString() ?? null,
    phone: profile?.phone ?? null,
    location: profile?.location ?? null,
    salary: profile?.salary ? Number(profile.salary) : null,
  }
}
