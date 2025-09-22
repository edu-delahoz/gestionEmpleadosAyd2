import type { User, Role } from "@/types"

// Mock current user - in real app this would come from session/JWT
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("currentUser")
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const hasRole = (user: User | null, roles: Role[]): boolean => {
  if (!user) return false
  return roles.includes(user.role)
}

export const canAccess = (user: User | null, requiredRoles: Role[]): boolean => {
  return hasRole(user, requiredRoles)
}

// Role hierarchy for permissions
export const roleHierarchy: Record<Role, number> = {
  candidate: 0,
  employee: 1,
  manager: 2,
  hr: 3,
  finance: 3,
  admin: 4,
}

export const hasMinimumRole = (user: User | null, minRole: Role): boolean => {
  if (!user) return false
  return roleHierarchy[user.role] >= roleHierarchy[minRole]
}
