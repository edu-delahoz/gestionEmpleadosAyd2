"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, FileText, TrendingUp, AlertCircle, Calendar, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function HRDashboard() {
  const hrStats = {
    totalEmployees: 45,
    newHires: 3,
    openPositions: 7,
    pendingRequests: 12,
    turnoverRate: 8.5,
    satisfactionScore: 4.2,
  }

  const recentHires = [
    { id: 1, name: "Ana Rodríguez", position: "Desarrolladora", department: "IT", startDate: "2024-01-15" },
    { id: 2, name: "Luis Martín", position: "Analista", department: "Finanzas", startDate: "2024-01-10" },
    { id: 3, name: "Carmen Silva", position: "Diseñadora", department: "Marketing", startDate: "2024-01-08" },
  ]

  const urgentTasks = [
    { id: 1, task: "Revisar solicitudes de vacaciones", priority: "high", count: 8 },
    { id: 2, task: "Procesar nuevas contrataciones", priority: "medium", count: 3 },
    { id: 3, task: "Actualizar políticas de empresa", priority: "low", count: 1 },
  ]

  const departmentStats = [
    { name: "Ventas", employees: 12, growth: "+2" },
    { name: "IT", employees: 8, growth: "+1" },
    { name: "Marketing", employees: 6, growth: "0" },
    { name: "Finanzas", employees: 5, growth: "+1" },
    { name: "Operaciones", employees: 14, growth: "-1" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Recursos Humanos</h1>
          <p className="text-muted-foreground">Gestiona el talento y las operaciones de RH</p>
        </div>

        {/* HR Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">+{hrStats.newHires} este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posiciones Abiertas</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.openPositions}</div>
              <p className="text-xs text-muted-foreground">En proceso de reclutamiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Requieren revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.satisfactionScore}/5</div>
              <Progress value={hrStats.satisfactionScore * 20} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Hires */}
          <Card>
            <CardHeader>
              <CardTitle>Nuevas Contrataciones</CardTitle>
              <CardDescription>Empleados que se unieron recientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHires.map((hire) => (
                  <div key={hire.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{hire.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {hire.position} - {hire.department}
                      </p>
                      <p className="text-xs text-muted-foreground">Inicio: {hire.startDate}</p>
                    </div>
                    <Badge variant="outline">Nuevo</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Departamento</CardTitle>
              <CardDescription>Distribución de empleados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.employees} empleados</p>
                    </div>
                    <Badge
                      variant={
                        dept.growth.startsWith("+") ? "default" : dept.growth === "0" ? "secondary" : "destructive"
                      }
                    >
                      {dept.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas Urgentes</CardTitle>
            <CardDescription>Actividades que requieren atención prioritaria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle
                      className={`h-4 w-4 ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-muted-foreground">{task.count} elementos</p>
                    </div>
                  </div>
                  <Button size="sm">Ver</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes de recursos humanos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/hr/employees">
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Nuevo Empleado</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/hr/requests">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Revisar Solicitudes</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/hr/reports">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Reportes</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/hr/recruitment">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Programar Entrevista</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
