"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Download, FileText, TrendingUp, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeePayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01")

  // Mock payroll data
  const payrollHistory = [
    {
      id: 1,
      period: "2024-01",
      baseSalary: 3500000,
      overtime: 200000,
      bonuses: 150000,
      deductions: 450000,
      netPay: 3400000,
      status: "paid",
      paidDate: "2024-01-31",
      details: {
        earnings: [
          { concept: "Salario Base", amount: 3500000 },
          { concept: "Horas Extra", amount: 200000 },
          { concept: "Bonificación", amount: 150000 },
        ],
        deductions: [
          { concept: "Salud (4%)", amount: 140000 },
          { concept: "Pensión (4%)", amount: 140000 },
          { concept: "Retención en la Fuente", amount: 170000 },
        ],
      },
    },
    {
      id: 2,
      period: "2023-12",
      baseSalary: 3500000,
      overtime: 150000,
      bonuses: 300000,
      deductions: 470000,
      netPay: 3480000,
      status: "paid",
      paidDate: "2023-12-31",
      details: {
        earnings: [
          { concept: "Salario Base", amount: 3500000 },
          { concept: "Horas Extra", amount: 150000 },
          { concept: "Prima Navideña", amount: 300000 },
        ],
        deductions: [
          { concept: "Salud (4%)", amount: 140000 },
          { concept: "Pensión (4%)", amount: 140000 },
          { concept: "Retención en la Fuente", amount: 190000 },
        ],
      },
    },
    {
      id: 3,
      period: "2023-11",
      baseSalary: 3500000,
      overtime: 100000,
      bonuses: 0,
      deductions: 430000,
      netPay: 3170000,
      status: "paid",
      paidDate: "2023-11-30",
      details: {
        earnings: [
          { concept: "Salario Base", amount: 3500000 },
          { concept: "Horas Extra", amount: 100000 },
        ],
        deductions: [
          { concept: "Salud (4%)", amount: 140000 },
          { concept: "Pensión (4%)", amount: 140000 },
          { concept: "Retención en la Fuente", amount: 150000 },
        ],
      },
    },
  ]

  const currentPayroll = payrollHistory.find((p) => p.period === selectedPeriod) || payrollHistory[0]

  const yearlyStats = {
    totalEarnings: 42000000,
    totalDeductions: 5400000,
    netIncome: 36600000,
    averageMonthly: 3050000,
  }

  const handleDownloadPayslip = (period: string) => {
    // Mock PDF download
    toast.success(`Descargando recibo de nómina para ${period}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nómina</h1>
            <p className="text-muted-foreground">Consulta tus recibos de pago y detalles salariales</p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              {payrollHistory.map((payroll) => (
                <SelectItem key={payroll.period} value={payroll.period}>
                  {payroll.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Yearly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(yearlyStats.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">Este año</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deducciones</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(yearlyStats.totalDeductions)}</div>
              <p className="text-xs text-muted-foreground">Total deducido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neto Anual</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(yearlyStats.netIncome)}</div>
              <p className="text-xs text-muted-foreground">Después de deducciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Mensual</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(yearlyStats.averageMonthly)}</div>
              <p className="text-xs text-muted-foreground">Neto promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Payroll Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recibo de Nómina - {currentPayroll.period}</CardTitle>
                <CardDescription>Detalles de tu pago mensual</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(currentPayroll.status)}
                <Button onClick={() => handleDownloadPayslip(currentPayroll.period)} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Ingresos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Salario Base</span>
                          <span className="font-medium">{formatCurrency(currentPayroll.baseSalary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Horas Extra</span>
                          <span className="font-medium">{formatCurrency(currentPayroll.overtime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonificaciones</span>
                          <span className="font-medium">{formatCurrency(currentPayroll.bonuses)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                          <span>Total Ingresos</span>
                          <span className="text-green-600">
                            {formatCurrency(
                              currentPayroll.baseSalary + currentPayroll.overtime + currentPayroll.bonuses,
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Deducciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Salud (4%)</span>
                          <span className="font-medium">{formatCurrency(140000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pensión (4%)</span>
                          <span className="font-medium">{formatCurrency(140000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Retención</span>
                          <span className="font-medium">{formatCurrency(170000)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                          <span>Total Deducciones</span>
                          <span className="text-red-600">{formatCurrency(currentPayroll.deductions)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Neto a Pagar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {formatCurrency(currentPayroll.netPay)}
                        </div>
                        <p className="text-sm text-muted-foreground">Pagado el {formatDate(currentPayroll.paidDate)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Ingresos Detallados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPayroll.details.earnings.map((earning, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span>{earning.concept}</span>
                            <span className="font-medium">{formatCurrency(earning.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Deducciones Detalladas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPayroll.details.deductions.map((deduction, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span>{deduction.concept}</span>
                            <span className="font-medium">-{formatCurrency(deduction.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payroll History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Nómina</CardTitle>
            <CardDescription>Tus últimos recibos de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollHistory.map((payroll) => (
                <div key={payroll.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nómina {payroll.period}</p>
                      <p className="text-sm text-muted-foreground">
                        Pagado el {formatDate(payroll.paidDate)} • {formatCurrency(payroll.netPay)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payroll.status)}
                    <Button size="sm" variant="outline" onClick={() => handleDownloadPayslip(payroll.period)}>
                      <Download className="h-4 w-4" />
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
