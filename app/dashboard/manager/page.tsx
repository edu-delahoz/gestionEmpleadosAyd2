"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getInitials } from "@/lib/utils"
import Link from "next/link"

export default function ManagerDashboard() {
  const teamStats = {
    totalEmployees: 8,
    presentToday: 7,
    pendingApprovals: 5,
    teamPerformance: 92,
  }

  const pendingApprovals = [
    { id: 1, employee: "Juan Pérez", type: "Vacaciones", days: 3, submitted: "2024-01-15" },
    { id: 2, employee: "María García", type: "Licencia", days: 1, submitted: "2024-01-16" },
    { id: 3, employee: "Carlos López", type: "Horas Extra", hours: 4, submitted: "2024-01-16" },
  ]

  const teamMembers = [
    {
      id: 1,
      name: "Juan Pérez",
      position: "Ejecutivo de Ventas",
      status: "present",
      avatar: "/professional-man-employee.jpg",
    },
    { id: 2, name: "María García", position: "Analista", status: "present", avatar: "/professional-woman-diverse.png" },
    { id: 3, name: "Carlos López", position: "Coordinador", status: "absent", avatar: "/professional-man.jpg" },
    {
      id: 4,
      name: "Ana Martínez",
      position: "Especialista",
      status: "present",
      avatar: "/professional-woman-finance.png",
    },
  ]

  const recentAlerts = [
    { id: 1, type: "warning", message: "Carlos López llegó tarde hoy", time: "8:30 AM" },
    { id: 2, type: "info", message: "Nueva solicitud de María García", time: "9:15 AM" },
    { id: 3, type: "success", message: "Equipo cumplió meta mensual", time: "Ayer" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Gerente</h1>
          <p className="text-muted-foreground">Gestiona tu equipo y supervisa el rendimiento</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">En tu equipo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teamStats.presentToday}</div>
              <p className="text-xs text-muted-foreground">
                {teamStats.totalEmployees - teamStats.presentToday} ausentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobaciones Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{teamStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Requieren tu atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendimiento del Equipo</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teamStats.teamPerformance}%</div>
              <p className="text-xs text-muted-foreground">+5% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Aprobaciones Pendientes</CardTitle>
              <CardDescription>Solicitudes que requieren tu aprobación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{approval.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.type} - {approval.days ? `${approval.days} días` : `${approval.hours} horas`}
                      </p>
                      <p className="text-xs text-muted-foreground">Enviado: {approval.submitted}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Rechazar
                      </Button>
                      <Button size="sm">Aprobar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Equipo</CardTitle>
              <CardDescription>Asistencia y estado actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                    <Badge variant={member.status === "present" ? "default" : "secondary"}>
                      {member.status === "present" ? "Presente" : "Ausente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
            <CardDescription>Notificaciones importantes del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-4">
                  {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                  {alert.type === "info" && <Clock className="h-4 w-4 text-blue-600" />}
                  {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes de gestión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/manager/team">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Ver Equipo</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/manager/approvals">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Aprobaciones</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/manager/reports">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Reportes</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/manager/attendance">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Asistencia</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
