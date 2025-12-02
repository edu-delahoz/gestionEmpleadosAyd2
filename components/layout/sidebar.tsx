"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Clock,
  FileText,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  Home,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCcw,
} from "lucide-react"
import type { Role } from "@/types"

interface SidebarProps {
  role: Role
  collapsed?: boolean
  onToggle?: () => void
}

const menuItems = {
  candidate: [
    { icon: Home, label: "Dashboard", href: "/dashboard/candidate" },
    { icon: FileText, label: "Aplicaciones", href: "/dashboard/candidate/applications" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/candidate/notifications" },
  ],
  employee: [
    { icon: Home, label: "Dashboard", href: "/dashboard/employee" },
    { icon: Clock, label: "Asistencia", href: "/dashboard/employee/attendance" },
    { icon: FileText, label: "Solicitudes", href: "/dashboard/employee/requests" },
    { icon: DollarSign, label: "Nómina", href: "/dashboard/employee/payroll" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/employee/notifications" },
  ],
  manager: [
    { icon: Home, label: "Dashboard", href: "/dashboard/manager" },
    { icon: Users, label: "Mi Equipo", href: "/dashboard/manager/team" },
    { icon: FileText, label: "Aprobaciones", href: "/dashboard/manager/approvals" },
    { icon: BarChart3, label: "Reportes", href: "/dashboard/manager/reports" },
    { icon: Clock, label: "Asistencia", href: "/dashboard/manager/attendance" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/manager/notifications" },
  ],
  hr: [
    { icon: Home, label: "Dashboard", href: "/dashboard/hr" },
    { icon: Users, label: "Empleados", href: "/dashboard/hr/employees" },
    { icon: Package, label: "Recursos", href: "/dashboard/hr/resources" },
    { icon: RefreshCcw, label: "Movimientos", href: "/dashboard/hr/transactions" },
    { icon: UserCheck, label: "Reclutamiento", href: "/dashboard/hr/recruitment" },
    { icon: FileText, label: "Solicitudes", href: "/dashboard/hr/requests" },
    { icon: Clock, label: "Asistencia", href: "/dashboard/hr/attendance" },
    { icon: BarChart3, label: "Reportes", href: "/dashboard/hr/reports" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/hr/notifications" },
    { icon: Settings, label: "Configuración", href: "/dashboard/hr/settings" },
  ],
  finance: [
    { icon: Home, label: "Dashboard", href: "/dashboard/finance" },
    { icon: DollarSign, label: "Nómina", href: "/dashboard/finance/payroll" },
    { icon: BarChart3, label: "Reportes", href: "/dashboard/finance/reports" },
    { icon: FileText, label: "Gastos", href: "/dashboard/finance/expenses" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/finance/notifications" },
    { icon: Settings, label: "Configuración", href: "/dashboard/finance/settings" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "Empleados", href: "/dashboard/admin/employees" },
    { icon: Clock, label: "Asistencia", href: "/dashboard/admin/attendance" },
    { icon: FileText, label: "Solicitudes", href: "/dashboard/admin/requests" },
    { icon: DollarSign, label: "Nómina", href: "/dashboard/admin/payroll" },
    { icon: BarChart3, label: "Reportes", href: "/dashboard/admin/reports" },
    { icon: Bell, label: "Notificaciones", href: "/dashboard/admin/notifications" },
    { icon: Settings, label: "Configuración", href: "/dashboard/admin/settings" },
  ],
}

export function Sidebar({ role, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[role] || []

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">Portal RH</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                    collapsed && "px-2",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
