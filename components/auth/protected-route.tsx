"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, canAccess } from "@/lib/auth"
import type { Role } from "@/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles: Role[]
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRoles, fallbackPath = "/login" }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.push(fallbackPath)
      return
    }

    if (!canAccess(user, requiredRoles)) {
      // Redirect to their appropriate dashboard
      router.push(`/dashboard/${user.role}`)
      return
    }

    setIsAuthorized(true)
  }, [requiredRoles, fallbackPath, router])

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
