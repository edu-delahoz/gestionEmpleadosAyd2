"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DollarSign, Users, Calculator, AlertTriangle, Play, Download, FileText } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function FinancePayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01")
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)

  // Mock payroll data
  const payrollSummary = {
    totalEmployees: 45,
    totalGross: 185000000,
    totalDeductions: 23500000,
    totalNet: 161500000,
    status: "draft", // draft, processing, completed
    period: "2024-01",
  }

  const departmentBreakdown = [
    { department: "Ventas", employees: 12, gross: 65000000, net: 55250000 },
    { department: "IT", employees: 8, gross: 48000000, net: 40800000 },
    { department: "Operaciones", employees: 14, gross: 42000000, net: 35700000 },
    { department: "Marketing", employees: 6, gross: 18000000, net: 15300000 },
    { department: "Finanzas", employees: 5, gross: 12000000, net: 10200000 },
  ]

  const payrollItems = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "Ana García",
      department: "Administración",
      baseSalary: 8000000,
      overtime: 0,
      bonuses: 200000,
      deductions: 1050000,
      netPay: 7150000,
      status: "calculated",
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Carlos Rodríguez",
      department: "Recursos Humanos",
      baseSalary: 6500000,
      overtime: 150000,
      bonuses: 100000,
      deductions: 850000,
      netPay: 5900000,
      status: "calculated",
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "María López",
      department: "Ventas",
      baseSalary: 5500000,
      overtime: 200000,
      bonuses: 300000,
      deductions: 720000,
      netPay: 5280000,
      status: "calculated",
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Juan Pérez",
      department: "Ventas",
      baseSalary: 3500000,
      overtime: 200000,
      bonuses: 150000,
      deductions: 450000,
      netPay: 3400000,
      status: "calculated",
    },
  ]

  const processingSteps = [
    "Calculando salarios base",
    "Procesando horas extra",
    "Aplicando bonificaciones",
    "Calculando deducciones",
    "Generando recibos",
    "Finalizando proceso",
  ]

  const handleProcessPayroll = () => {
    setIsProcessingDialogOpen(true)
    setProcessingStep(0)

    // Simulate processing steps
    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setIsProcessingDialogOpen(false)
            toast.success("Nómina procesada exitosamente")
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  const handleExportPayroll = (format: string) => {
    toast.success(`Exportando nómina en formato ${format.toUpperCase()}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>
      case "calculated":
        return <Badge className="bg-orange-100 text-orange-800">Calculado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Nómina</h1>
            <p className="text-muted-foreground">Procesa y gestiona la nómina mensual</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">Enero 2024</SelectItem>
                <SelectItem value="2023-12">Diciembre 2023</SelectItem>
                <SelectItem value="2023-11">Noviembre 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleProcessPayroll} disabled={payrollSummary.status === "completed"}>
              <Play className="mr-2 h-4 w-4" />
              Procesar Nómina
            </Button>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">En nómina</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(payrollSummary.totalGross)}</div>
              <p className="text-xs text-muted-foreground">Antes de deducciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deducciones</CardTitle>
              <Calculator className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(payrollSummary.totalDeductions)}</div>
              <p className="text-xs text-muted-foreground">Total deducido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Neto</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(payrollSummary.totalNet)}</div>
              <p className="text-xs text-muted-foreground">A pagar</p>
            </CardContent>
          </Card>
        </div>

        {/* Status and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estado de Nómina - {selectedPeriod}</CardTitle>
                <CardDescription>Gestiona el procesamiento de la nómina mensual</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(payrollSummary.status)}
                <Button variant="outline" onClick={() => handleExportPayroll("excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
                <Button variant="outline" onClick={() => handleExportPayroll("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Reporte PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {payrollSummary.status === "draft" && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">
                  La nómina está en borrador. Revisa los cálculos y procesa cuando esté lista.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList>
            <TabsTrigger value="breakdown">Por Departamento</TabsTrigger>
            <TabsTrigger value="employees">Por Empleado</TabsTrigger>
            <TabsTrigger value="parameters">Parámetros</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Departamento</CardTitle>
                <CardDescription>Costos de nómina agrupados por área</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentBreakdown.map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.employees} empleados</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(dept.net)}</p>
                        <p className="text-sm text-muted-foreground">Bruto: {formatCurrency(dept.gross)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalle por Empleado</CardTitle>
                <CardDescription>Cálculos individuales de nómina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.employeeId} • {item.department}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-green-600">{formatCurrency(item.netPay)}</p>
                        <p className="text-xs text-muted-foreground">
                          Base: {formatCurrency(item.baseSalary)} | Deduc: {formatCurrency(item.deductions)}
                        </p>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parámetros de Nómina</CardTitle>
                <CardDescription>Configuración de conceptos y deducciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Deducciones Obligatorias</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Salud</Label>
                        <Input className="w-20" value="4%" readOnly />
                      </div>
                      <div className="flex justify-between">
                        <Label>Pensión</Label>
                        <Input className="w-20" value="4%" readOnly />
                      </div>
                      <div className="flex justify-between">
                        <Label>Retención en la Fuente</Label>
                        <Input className="w-20" value="Variable" readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Conceptos Adicionales</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Auxilio de Transporte</Label>
                        <Input className="w-32" value="140606" readOnly />
                      </div>
                      <div className="flex justify-between">
                        <Label>Horas Extra (Recargo)</Label>
                        <Input className="w-20" value="25%" readOnly />
                      </div>
                      <div className="flex justify-between">
                        <Label>Horas Extra Nocturna</Label>
                        <Input className="w-20" value="75%" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Processing Dialog */}
        <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Procesando Nómina</DialogTitle>
              <DialogDescription>
                Por favor espera mientras procesamos la nómina del período {selectedPeriod}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {processingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      index <= processingStep ? "bg-primary" : "bg-muted"
                    } flex items-center justify-center`}
                  >
                    {index < processingStep && <span className="text-xs text-primary-foreground">✓</span>}
                    {index === processingStep && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className={`text-sm ${index <= processingStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsProcessingDialogOpen(false)}
                disabled={processingStep < processingSteps.length - 1}
              >
                {processingStep >= processingSteps.length - 1 ? "Cerrar" : "Cancelar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
