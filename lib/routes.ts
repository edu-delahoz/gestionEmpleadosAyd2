import type { Role } from "@/types"

export const getDashboardRoute = (role?: Role | null) => {
  if (!role) return "/dashboard/employee"
  return `/dashboard/${role}`
}
