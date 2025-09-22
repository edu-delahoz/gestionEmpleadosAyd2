"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, FileText, DollarSign, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function EmployeeDashboard() {
  // Mock data for employee dashboard
  const employeeStats = {
    hoursThisMonth: 168,
    targetHours: 176,
    pendingRequests: 2,
    lastPayroll: 3400000,
    vacationDays: 15,
    usedVacationDays: 5,
  }

  const recentActivity = [
    { id: 1, type: "attendance", description: "Marcaste entrada a las 8:00 AM", time: "Hoy" },
    { id: 2, type: "request", description: "Solicitud de vacaciones aprobada", time: "Ayer" },
    { id: 3, type: "payroll", description: "Recibo de nómina disponible", time: "2 días" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Reunión de equipo", date: "2024-01-20", time: "10:00 AM" },
    { id: 2, title: "Evaluación de desempeño", date: "2024-01-25", time: "2:00 PM" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido a tu portal de empleado</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Este Mes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.hoursThisMonth}h</div>
              <Progress value={(employeeStats.hoursThisMonth / employeeStats.targetHours) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {employeeStats.targetHours - employeeStats.hoursThisMonth}h restantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">En revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Pago</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(employeeStats.lastPayroll)}</div>
              <p className="text-xs text-muted-foreground">Enero 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacaciones</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.vacationDays - employeeStats.usedVacationDays}</div>
              <p className="text-xs text-muted-foreground">
                {employeeStats.usedVacationDays} de {employeeStats.vacationDays} usados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Tu calendario de actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.date)} - {event.time}
                      </p>
                    </div>
                    <Badge variant="outline">Próximo</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes que puedes realizar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/attendance">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Marcar Entrada</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/requests">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Nueva Solicitud</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/payroll">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Ver Nómina</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/requests">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Solicitar Vacaciones</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
