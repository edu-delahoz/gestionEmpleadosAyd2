"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  employee: "Empleado",
  manager: "Gerente",
  hr: "Recursos Humanos",
  finance: "Finanzas",
  admin: "Administrador",
  candidate: "Candidato",
  attendance: "Asistencia",
  requests: "Solicitudes",
  payroll: "Nómina",
  reports: "Reportes",
  notifications: "Notificaciones",
  settings: "Configuración",
  employees: "Empleados",
  team: "Mi Equipo",
  approvals: "Aprobaciones",
  recruitment: "Reclutamiento",
  expenses: "Gastos",
  applications: "Aplicaciones",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground px-6 py-3 border-b border-border">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const label = pathLabels[segment] || segment
        const isLast = index === segments.length - 1

        // If this is the dashboard segment and not the last one, don't make it clickable
        const isDashboardSegment = segment === "dashboard" && !isLast

        return (
          <div key={segment} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            {isLast || isDashboardSegment ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
