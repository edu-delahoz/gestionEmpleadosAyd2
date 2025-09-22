"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserCog } from "lucide-react"
import type { Role } from "@/types"
import { getCurrentUser, setCurrentUser } from "@/lib/auth"
import { mockUsers } from "@/mocks/data"

const roleLabels = {
  candidate: "Candidato",
  employee: "Empleado",
  manager: "Gerente",
  hr: "Recursos Humanos",
  finance: "Finanzas",
  admin: "Administrador",
}

export function RoleSwitcher() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const currentUser = getCurrentUser()

  if (!currentUser) return null

  const handleRoleSwitch = async (role: Role) => {
    setLoading(true)

    // Find a user with the target role
    const targetUser = mockUsers.find((user) => user.role === role)

    if (targetUser) {
      setCurrentUser(targetUser)
      router.push(`/dashboard/${role}`)
    }

    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <UserCog className="mr-2 h-4 w-4" />
          Cambiar Rol
          <Badge variant="secondary" className="ml-2">
            {roleLabels[currentUser.role]}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Roles de Prueba</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {Object.entries(roleLabels).map(([role, label]) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleSwitch(role as Role)}
            disabled={currentUser.role === role}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span>{label}</span>
              {currentUser.role === role && (
                <Badge variant="default" className="text-xs">
                  Actual
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
