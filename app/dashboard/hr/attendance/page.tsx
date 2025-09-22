"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, TrendingUp, AlertTriangle, Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function HRAttendancePage() {
  const attendanceData = [
    { day: "Lun", present: 45, late: 3, absent: 2 },
    { day: "Mar", present: 47, late: 2, absent: 1 },
    { day: "Mié", present: 46, late: 4, absent: 0 },
    { day: "Jue", present: 48, late: 1, absent: 1 },
    { day: "Vie", present: 44, late: 5, absent: 1 },
  ]

  const monthlyTrend = [
    { month: "Ene", attendance: 94.2 },
    { month: "Feb", attendance: 95.8 },
    { month: "Mar", attendance: 93.5 },
    { month: "Abr", attendance: 96.1 },
    { month: "May", attendance: 94.7 },
    { month: "Jun", attendance: 95.3 },
  ]

  const departmentAttendance = [
    { department: "IT", present: 95, late: 3, absent: 2 },
    { department: "Ventas", present: 92, late: 5, absent: 3 },
    { department: "Marketing", present: 97, late: 2, absent: 1 },
    { department: "Finanzas", present: 98, late: 1, absent: 1 },
    { department: "Operaciones", present: 89, late: 7, absent: 4 },
  ]

  const lateEmployees = [
    { name: "Carlos Mendoza", department: "Ventas", lateCount: 5, avgDelay: "15 min" },
    { name: "Ana Rodríguez", department: "IT", lateCount: 3, avgDelay: "8 min" },
    { name: "Luis Herrera", department: "Finanzas", lateCount: 2, avgDelay: "12 min" },
  ]

  const stats = {
    totalEmployees: 50,
    presentToday: 47,
    lateToday: 2,
    absentToday: 1,
    avgAttendance: 95.3,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Control de Asistencia</h1>
            <p className="text-muted-foreground">Monitorea la asistencia y puntualidad del equipo</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>Generar Reporte</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">En la organización</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes Hoy</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lateToday}</div>
              <p className="text-xs text-muted-foreground">Llegaron tarde hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absentToday}</div>
              <p className="text-xs text-muted-foreground">No han marcado entrada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">Últimos 30 días</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Vista Diaria</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="departments">Por Departamento</TabsTrigger>
            <TabsTrigger value="issues">Problemas</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asistencia Semanal</CardTitle>
                <CardDescription>Resumen de asistencia, tardanzas y ausencias por día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="Presentes" />
                    <Bar dataKey="late" fill="#f59e0b" name="Tardanzas" />
                    <Bar dataKey="absent" fill="#ef4444" name="Ausentes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia Mensual de Asistencia</CardTitle>
                <CardDescription>Evolución del porcentaje de asistencia en los últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Asistencia"]} />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asistencia por Departamento</CardTitle>
                <CardDescription>Comparación de asistencia entre departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentAttendance.map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            Presentes: {dept.present}%
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            Tardanzas: {dept.late}%
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            Ausentes: {dept.absent}%
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={dept.present >= 95 ? "default" : dept.present >= 90 ? "secondary" : "destructive"}
                      >
                        {dept.present >= 95 ? "Excelente" : dept.present >= 90 ? "Bueno" : "Necesita atención"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Empleados con Tardanzas Frecuentes</CardTitle>
                <CardDescription>Empleados que han llegado tarde más de 2 veces este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lateEmployees.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Tardanzas: {employee.lateCount}</span>
                          <span>Retraso promedio: {employee.avgDelay}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{employee.lateCount} tardanzas</Badge>
                        <Button variant="outline" size="sm">
                          Contactar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
