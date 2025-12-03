"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Moon, Sun, LogOut, User, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { getInitials } from "@/lib/utils"
import type { Session } from "next-auth"

interface HeaderProps {
  user: Session["user"]
  onLogout: () => void
}

const roleLabels = {
  candidate: "Candidato",
  employee: "Empleado",
  manager: "Gerente",
  hr: "Recursos Humanos",
  finance: "Finanzas",
  admin: "Administrador",
}

export function Header({ user, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications] = useState(3) // Mock notification count

  const getNotificationUrl = () => {
    return `/dashboard/${user.role}/notifications`
  }

  const getProfileUrl = () => {
    return `/dashboard/${user.role}/profile`
  }

  const avatarInitial = getInitials(user.name ?? "", user.email?.charAt(0) ?? undefined)

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Bienvenido, {user.name}</h1>
        <Badge variant="secondary" className="text-xs">
          {roleLabels[user.role]}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative" asChild>
          <Link href={getNotificationUrl()}>
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {notifications}
              </Badge>
            )}
          </Link>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Avatar className="h-8 w-8 cursor-pointer border border-border">
              {user.image && <AvatarImage src={user.image} alt={user.name ?? "Usuario"} />}
              <AvatarFallback className="text-xs">{avatarInitial}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
