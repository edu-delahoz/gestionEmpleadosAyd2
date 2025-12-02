"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, AlertTriangle, Server, Shield, BarChart3, Settings } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export default function AdminDashboard() {
  const systemStats = {
    totalUsers: 45,
    activeUsers: 42,
    systemUptime: 99.8,
    monthlyPayroll: 185000000,
    pendingApprovals: 8,
    securityAlerts: 2,
  }

  const systemHealth = [
    { component: "Base de Datos", status: "healthy", uptime: 99.9 },
    { component: "Servidor Web", status: "healthy", uptime: 99.8 },
    { component: "Sistema de Archivos", status: "warning", uptime: 98.5 },
    { component: "Servicios de Email", status: "healthy", uptime: 99.7 },
  ]

  const recentActivities = [
    { id: 1, user: "Carlos Rodríguez", action: "Procesó nómina de enero", time: "2 horas" },
    { id: 2, user: "María López", action: "Aprobó 5 solicitudes de vacaciones", time: "4 horas" },
    { id: 3, user: "Ana García", action: "Creó nuevo usuario", time: "6 horas" },
  ]

  const criticalAlerts = [
    { id: 1, type: "security", message: "Intento de acceso no autorizado detectado", severity: "high" },
    { id: 2, type: "system", message: "Espacio en disco bajo en servidor principal", severity: "medium" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Administrador</h1>
          <p className="text-muted-foreground">Control total del sistema y operaciones</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{systemStats.activeUsers} activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(systemStats.monthlyPayroll)}</div>
              <p className="text-xs text-muted-foreground">Enero 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Actividad</CardTitle>
              <Server className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}%</div>
              <Progress value={systemStats.systemUptime} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Seguridad</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.securityAlerts}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Monitoreo de componentes críticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((component, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{component.component}</p>
                      <p className="text-sm text-muted-foreground">Uptime: {component.uptime}%</p>
                    </div>
                    <Badge
                      variant={
                        component.status === "healthy"
                          ? "default"
                          : component.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {component.status === "healthy"
                        ? "Saludable"
                        : component.status === "warning"
                          ? "Advertencia"
                          : "Error"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Acciones importantes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">Hace {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Críticas</CardTitle>
            <CardDescription>Problemas que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle
                      className={`h-4 w-4 ${alert.severity === "high" ? "text-red-600" : "text-orange-600"}`}
                    />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {alert.type} | Severidad: {alert.severity}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant={alert.severity === "high" ? "destructive" : "outline"}>
                    Resolver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Administrador</CardTitle>
            <CardDescription>Herramientas de gestión del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/admin/employees">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Gestionar Usuarios</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/admin/settings">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Seguridad</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/admin/reports">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Reportes</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/admin/settings">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Configuración</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
