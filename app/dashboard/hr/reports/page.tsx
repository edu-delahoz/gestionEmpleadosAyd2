"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { BarChart3, Download, Filter, Calendar, Users, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function HRReportsPage() {
  const [reportType, setReportType] = useState("headcount")
  const [dateRange, setDateRange] = useState("last-month")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data for charts
  const headcountData = [
    { month: "Ene", employees: 42, hires: 3, terminations: 1 },
    { month: "Feb", employees: 44, hires: 2, terminations: 0 },
    { month: "Mar", employees: 45, hires: 1, terminations: 0 },
    { month: "Abr", employees: 47, hires: 3, terminations: 1 },
    { month: "May", employees: 48, hires: 2, terminations: 1 },
    { month: "Jun", employees: 50, hires: 3, terminations: 1 },
  ]

  const departmentData = [
    { name: "Ventas", value: 12, color: "#3b82f6" },
    { name: "IT", value: 8, color: "#10b981" },
    { name: "Operaciones", value: 14, color: "#f59e0b" },
    { name: "Marketing", value: 6, color: "#ef4444" },
    { name: "Finanzas", value: 5, color: "#8b5cf6" },
  ]

  const attendanceData = [
    { department: "Ventas", present: 95, late: 3, absent: 2 },
    { department: "IT", present: 98, late: 1, absent: 1 },
    { department: "Operaciones", present: 92, late: 5, absent: 3 },
    { department: "Marketing", present: 96, late: 2, absent: 2 },
    { department: "Finanzas", present: 99, late: 1, absent: 0 },
  ]

  const turnoverData = [
    { month: "Ene", rate: 8.5 },
    { month: "Feb", rate: 7.2 },
    { month: "Mar", rate: 6.8 },
    { month: "Abr", rate: 9.1 },
    { month: "May", rate: 7.5 },
    { month: "Jun", rate: 6.9 },
  ]

  const reportTemplates = [
    { id: "headcount", name: "Headcount", description: "Número de empleados por período" },
    { id: "attendance", name: "Asistencia", description: "Reportes de asistencia y puntualidad" },
    { id: "turnover", name: "Rotación", description: "Análisis de rotación de personal" },
    { id: "payroll", name: "Nómina", description: "Costos y distribución salarial" },
    { id: "performance", name: "Desempeño", description: "Evaluaciones y métricas de rendimiento" },
    { id: "diversity", name: "Diversidad", description: "Análisis de diversidad e inclusión" },
  ]

  const departments = ["Ventas", "IT", "Operaciones", "Marketing", "Finanzas", "Administración"]

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("Reporte generado exitosamente")
    }, 2000)
  }

  const handleExportReport = (format: string) => {
    toast.success(`Exportando reporte en formato ${format.toUpperCase()}`)
  }

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, department])
    } else {
      setSelectedDepartments(selectedDepartments.filter((d) => d !== department))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Analítica</h1>
          <p className="text-muted-foreground">Genera reportes personalizados y analiza métricas de RH</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Builder */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Constructor de Reportes
              </CardTitle>
              <CardDescription>Personaliza tu reporte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Última semana</SelectItem>
                    <SelectItem value="last-month">Último mes</SelectItem>
                    <SelectItem value="last-quarter">Último trimestre</SelectItem>
                    <SelectItem value="last-year">Último año</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Desde</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hasta</Label>
                    <Input type="date" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Departamentos</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept}
                        checked={selectedDepartments.includes(dept)}
                        onCheckedChange={(checked) => handleDepartmentChange(dept, checked as boolean)}
                      />
                      <Label htmlFor={dept} className="text-sm">
                        {dept}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generando..." : "Generar Reporte"}
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportReport("excel")} className="flex-1">
                    <Download className="mr-1 h-3 w-3" />
                    Excel
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExportReport("pdf")} className="flex-1">
                    <Download className="mr-1 h-3 w-3" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <div className="lg:col-span-3">
            <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="headcount">Headcount</TabsTrigger>
                <TabsTrigger value="attendance">Asistencia</TabsTrigger>
                <TabsTrigger value="turnover">Rotación</TabsTrigger>
              </TabsList>

              <TabsContent value="headcount" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolución de Empleados</CardTitle>
                      <CardDescription>Crecimiento del equipo en el tiempo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={headcountData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="employees" fill="#3b82f6" name="Empleados" />
                          <Bar dataKey="hires" fill="#10b981" name="Contrataciones" />
                          <Bar dataKey="terminations" fill="#ef4444" name="Terminaciones" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Departamento</CardTitle>
                      <CardDescription>Empleados por área</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Asistencia por Departamento</CardTitle>
                    <CardDescription>Porcentajes de asistencia, tardanzas y ausencias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={attendanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="department" type="category" />
                        <Tooltip />
                        <Bar dataKey="present" stackId="a" fill="#10b981" name="Presente" />
                        <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Tarde" />
                        <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Ausente" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="turnover" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasa de Rotación</CardTitle>
                    <CardDescription>Evolución mensual de la rotación de personal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={turnoverData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, "Tasa de Rotación"]} />
                        <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50</div>
              <p className="text-xs text-muted-foreground">+3 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Rotación</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">6.9%</div>
              <p className="text-xs text-muted-foreground">-0.6% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">96%</div>
              <p className="text-xs text-muted-foreground">+1% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costo Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(4111111)}</div>
              <p className="text-xs text-muted-foreground">Por empleado/mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Programados</CardTitle>
            <CardDescription>Reportes que se generan automáticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Reporte Mensual de Headcount", frequency: "Mensual", nextRun: "2024-02-01", status: "active" },
                {
                  name: "Análisis de Asistencia Semanal",
                  frequency: "Semanal",
                  nextRun: "2024-01-22",
                  status: "active",
                },
                { name: "Dashboard Ejecutivo", frequency: "Diario", nextRun: "2024-01-18", status: "paused" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.frequency} • Próxima ejecución: {report.nextRun}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === "active" ? "default" : "secondary"}>
                      {report.status === "active" ? "Activo" : "Pausado"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Configurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
