"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Download, TrendingUp, Users, Clock } from "lucide-react"

export default function ManagerReportsPage() {
  const teamReports = [
    { name: "Rendimiento del Equipo", description: "Métricas de productividad mensual", type: "performance" },
    { name: "Asistencia del Equipo", description: "Reporte de asistencia y puntualidad", type: "attendance" },
    { name: "Solicitudes Procesadas", description: "Aprobaciones y rechazos del mes", type: "approvals" },
    { name: "Objetivos y Metas", description: "Progreso hacia objetivos trimestrales", type: "goals" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes del Equipo</h1>
          <p className="text-muted-foreground">Análisis y métricas de tu equipo de trabajo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendimiento Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className="text-xs text-muted-foreground">+5% vs mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">96%</div>
              <p className="text-xs text-muted-foreground">Promedio del equipo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">En tu equipo</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
            <CardDescription>Genera reportes específicos de tu equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamReports.map((report, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Generar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Métricas Rápidas</CardTitle>
              <CardDescription>Resumen del rendimiento del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Productividad General</span>
                  <span className="font-bold text-green-600">Excelente</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cumplimiento de Objetivos</span>
                  <span className="font-bold text-blue-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Satisfacción del Equipo</span>
                  <span className="font-bold text-green-600">4.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tiempo Promedio de Respuesta</span>
                  <span className="font-bold">2.3h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Herramientas de análisis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Dashboard</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Tendencias</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Comparativas</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Exportar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
