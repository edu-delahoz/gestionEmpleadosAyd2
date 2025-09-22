"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Users, TrendingUp, Calendar, Download, FileText } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function AdminPayrollPage() {
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  const payrollStats = {
    totalPayroll: 185000000,
    employeeCount: 45,
    avgSalary: 4111111,
    processed: 42,
    pending: 3,
  }

  const handleProcessPayroll = () => {
    console.log("[v0] Processing payroll for month:", selectedMonth)
    setIsProcessingPayroll(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessingPayroll(false)
      alert("Nómina procesada exitosamente")
    }, 2000)
  }

  const handleGenerateReport = () => {
    console.log("[v0] Generating payroll report")
    setIsGeneratingReport(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)
      alert("Reporte generado y descargado")
    }, 1500)
  }

  const handleManageSalaries = () => {
    console.log("[v0] Opening salary management")
    // Navigate to salary management page
  }

  const handleViewCalendar = () => {
    console.log("[v0] Opening payroll calendar")
    // Navigate to payroll calendar
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Nómina</h1>
            <p className="text-muted-foreground">Administra los pagos y salarios de empleados</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Procesar Nómina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Procesar Nómina</DialogTitle>
                <DialogDescription>Selecciona el período para procesar la nómina</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="month">Mes y Año</Label>
                  <Input
                    id="month"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleProcessPayroll} disabled={isProcessingPayroll}>
                    {isProcessingPayroll ? "Procesando..." : "Procesar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(payrollStats.totalPayroll)}</div>
              <p className="text-xs text-muted-foreground">Enero 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payrollStats.employeeCount}</div>
              <p className="text-xs text-muted-foreground">Total activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(payrollStats.avgSalary)}</div>
              <p className="text-xs text-muted-foreground">Por empleado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{payrollStats.processed}</div>
              <p className="text-xs text-muted-foreground">{payrollStats.pending} pendientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Procesamiento de Nómina</CardTitle>
              <CardDescription>Estado actual del procesamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Nómina de Enero 2024</span>
                  <Badge>Procesada</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bonificaciones</span>
                  <Badge variant="secondary">Pendiente</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deducciones</span>
                  <Badge>Completada</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reportes fiscales</span>
                  <Badge>Completada</Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGeneratingReport ? "Generando..." : "Descargar Reporte"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Herramientas de gestión de nómina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={handleProcessPayroll}
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Generar Nómina</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={handleManageSalaries}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Gestionar Salarios</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={handleGenerateReport}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Reportes</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={handleViewCalendar}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Calendario</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
            <CardDescription>Últimos movimientos de nómina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nómina Enero 2024</p>
                    <p className="text-sm text-muted-foreground">45 empleados procesados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(payrollStats.totalPayroll)}</p>
                  <Badge>Completada</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Bonificaciones Q4 2023</p>
                    <p className="text-sm text-muted-foreground">42 empleados elegibles</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(25000000)}</p>
                  <Badge>Completada</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
