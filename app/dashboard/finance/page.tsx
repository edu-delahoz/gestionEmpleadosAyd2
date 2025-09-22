"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Calculator, FileText, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function FinanceDashboard() {
  const financeStats = {
    monthlyPayroll: 185000000,
    pendingPayments: 12,
    budgetUtilization: 78,
    costPerEmployee: 4111111,
    yearToDateExpenses: 2220000000,
    savingsTarget: 50000000,
  }

  const payrollBreakdown = [
    { department: "Ventas", amount: 65000000, percentage: 35 },
    { department: "IT", amount: 48000000, percentage: 26 },
    { department: "Operaciones", amount: 42000000, percentage: 23 },
    { department: "Marketing", amount: 18000000, percentage: 10 },
    { department: "Finanzas", amount: 12000000, percentage: 6 },
  ]

  const pendingApprovals = [
    { id: 1, type: "Gastos de viaje", employee: "María López", amount: 850000, date: "2024-01-15" },
    { id: 2, type: "Bonificación", employee: "Carlos Rodríguez", amount: 500000, date: "2024-01-16" },
    { id: 3, type: "Reembolso", employee: "Ana García", amount: 320000, date: "2024-01-16" },
  ]

  const financialAlerts = [
    { id: 1, type: "warning", message: "Presupuesto de IT al 95% de utilización", severity: "medium" },
    { id: 2, type: "info", message: "Nómina de enero lista para procesamiento", severity: "low" },
    { id: 3, type: "error", message: "Discrepancia en gastos de diciembre", severity: "high" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Finanzas</h1>
          <p className="text-muted-foreground">Gestión financiera y control de costos</p>
        </div>

        {/* Finance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financeStats.monthlyPayroll)}</div>
              <p className="text-xs text-muted-foreground">Enero 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{financeStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">Requieren aprobación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilización Presupuesto</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeStats.budgetUtilization}%</div>
              <Progress value={financeStats.budgetUtilization} className="mt-2" />
              <p className="text-xs text-muted-foreground">22% restante</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costo por Empleado</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financeStats.costPerEmployee)}</div>
              <p className="text-xs text-muted-foreground">Promedio mensual</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payroll Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Nómina</CardTitle>
              <CardDescription>Costos por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollBreakdown.map((dept) => (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-sm font-medium">{formatCurrency(dept.amount)}</span>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{dept.percentage}% del total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Aprobaciones Pendientes</CardTitle>
              <CardDescription>Gastos que requieren autorización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{approval.type}</p>
                      <p className="text-sm text-muted-foreground">{approval.employee}</p>
                      <p className="text-xs text-muted-foreground">Fecha: {approval.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(approval.amount)}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          Rechazar
                        </Button>
                        <Button size="sm">Aprobar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Financieras</CardTitle>
            <CardDescription>Notificaciones importantes sobre el estado financiero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle
                      className={`h-4 w-4 ${
                        alert.severity === "high"
                          ? "text-red-600"
                          : alert.severity === "medium"
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">Severidad: {alert.severity}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes de finanzas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">Procesar Nómina</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Aprobar Gastos</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Reportes</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calculator className="h-5 w-5" />
                <span className="text-sm">Presupuestos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
