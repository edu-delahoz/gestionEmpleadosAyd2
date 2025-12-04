"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { formatCurrency, formatDate } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

type PayrollSummary = {
  totalPayroll: number
  employeeCount: number
  avgSalary: number
  processedCycles: number
  pendingCycles: number
  latestPeriod: string | null
}

type PayrollCycleRow = {
  id: string
  period: string
  status: string
  totalGross: number
  totalDeductions: number
  totalNet: number
  processedAt: string | null
  processedBy: string | null
  entriesCount: number
}

type PayrollEntryRow = {
  id: string
  employeeName: string
  employeeEmail: string
  department: string
  netPay: number
  period: string
  status: string
  paidAt: string
}

type AdminPayrollResponse = {
  summary: PayrollSummary
  cycles: PayrollCycleRow[]
  entries: PayrollEntryRow[]
}

const statusMeta: Record<string, { label: string; variant: BadgeVariant }> = {
  processed: { label: "Procesada", variant: "default" },
  paid: { label: "Pagada", variant: "default" },
  processing: { label: "En proceso", variant: "secondary" },
  draft: { label: "Borrador", variant: "outline" },
}

const periodFormatter = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" })

const formatPeriodLabel = (period: string | null) => {
  if (!period) return "Sin periodo"
  const [year, month] = period.split("-").map((value) => Number(value))
  if (!Number.isFinite(year) || !Number.isFinite(month)) return period
  return periodFormatter.format(new Date(year, month - 1, 1))
}

const getStatusMeta = (status: string) => statusMeta[status] ?? { label: status, variant: "outline" }

export default function AdminPayrollPage() {
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [payrollData, setPayrollData] = useState<AdminPayrollResponse | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setLoadingData(true)
      try {
        const response = await fetch("/api/admin/payroll", { cache: "no-store" })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? "No se pudo cargar la nómina")
        }

        const payload = (await response.json()) as AdminPayrollResponse
        if (isMounted) {
          setPayrollData(payload)
          setError(null)
        }
      } catch (loadError) {
        console.error("[admin payroll] load error", loadError)
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la nómina")
        }
      } finally {
        if (isMounted) {
          setLoadingData(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [refreshIndex])

  const summary =
    payrollData?.summary ?? ({
      totalPayroll: 0,
      employeeCount: 0,
      avgSalary: 0,
      processedCycles: 0,
      pendingCycles: 0,
      latestPeriod: null,
    } as PayrollSummary)

  const cycles = payrollData?.cycles ?? []
  const entries = payrollData?.entries ?? []

  const refreshPayrollData = () => setRefreshIndex((previous) => previous + 1)

  const handleProcessPayroll = () => {
    console.log("[v0] Processing payroll for month:", selectedMonth)
    setIsProcessingPayroll(true)
    setTimeout(() => {
      setIsProcessingPayroll(false)
      refreshPayrollData()
      alert("Nómina procesada exitosamente")
    }, 2000)
  }

  const handleGenerateReport = () => {
    console.log("[v0] Generating payroll report")
    setIsGeneratingReport(true)
    setTimeout(() => {
      setIsGeneratingReport(false)
      alert("Reporte generado y descargado")
    }, 1500)
  }

  const handleManageSalaries = () => {
    console.log("[v0] Opening salary management")
  }

  const handleViewCalendar = () => {
    console.log("[v0] Opening payroll calendar")
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

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingData ? "..." : formatCurrency(summary.totalPayroll)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.latestPeriod ? formatPeriodLabel(summary.latestPeriod) : "Sin periodos procesados"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingData ? "..." : summary.employeeCount}</div>
              <p className="text-xs text-muted-foreground">Total activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingData ? "..." : formatCurrency(summary.avgSalary)}
              </div>
              <p className="text-xs text-muted-foreground">Por empleado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loadingData ? "..." : summary.processedCycles}
              </div>
              <p className="text-xs text-muted-foreground">
                {loadingData ? "..." : `${summary.pendingCycles} pendientes`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Procesamiento de Nómina</CardTitle>
              <CardDescription>Estado actual del procesamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingData && <p className="text-sm text-muted-foreground">Cargando periodos...</p>}
                {!loadingData && cycles.length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay ciclos registrados.</p>
                )}
                {cycles.slice(0, 4).map((cycle) => {
                  const meta = getStatusMeta(cycle.status)
                  return (
                    <div key={cycle.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">Periodo {cycle.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {cycle.processedAt
                            ? `Procesada el ${formatDate(cycle.processedAt)}`
                            : "Sin fecha de procesamiento"}
                        </p>
                        {cycle.processedBy && (
                          <p className="text-xs text-muted-foreground">Por {cycle.processedBy}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(cycle.totalNet)}</p>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                    </div>
                  )
                })}
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
              {loadingData && <p className="text-sm text-muted-foreground">Cargando transacciones...</p>}
              {!loadingData && entries.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay pagos registrados en la base de datos.</p>
              )}
              {entries.map((entry) => {
                const meta = getStatusMeta(entry.status)
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg gap-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{entry.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.department} · {formatPeriodLabel(entry.period)}
                        </p>
                        {entry.employeeEmail && (
                          <p className="text-xs text-muted-foreground">{entry.employeeEmail}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(entry.netPay)}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.paidAt)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
