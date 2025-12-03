"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, DollarSign, Download, FileText, TrendingUp } from "lucide-react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency, formatDate } from "@/lib/utils"

type PayrollEntry = {
  id: string
  period: string
  baseSalary: number
  overtime: number
  bonuses: number
  deductions: number
  netPay: number
  status: string
  paidDate: string
}

type PayrollResponse = {
  entries: PayrollEntry[]
  stats: {
    totalEarnings: number
    totalDeductions: number
    netIncome: number
    averageMonthly: number
  }
  fallbackSalary: number | null
}

const statusLabel: Record<string, string> = {
  processed: "Procesado",
  paid: "Pagado",
  pending: "Pendiente",
  draft: "Borrador",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  processed: "default",
  paid: "default",
  pending: "secondary",
  draft: "secondary",
}

const usePayrollData = () => {
  const [data, setData] = useState<PayrollResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayroll = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/employee/payroll", { cache: "no-store" })
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error ?? "No se pudo cargar la nómina")
        }
        const payload = (await response.json()) as PayrollResponse
        setData(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchPayroll()
  }, [])

  return { data, loading, error }
}

export default function EmployeePayrollPage() {
  const { data, loading, error } = usePayrollData()
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  useEffect(() => {
    if (data?.entries.length && !selectedPeriod) {
      setSelectedPeriod(data.entries[0].period)
    }
  }, [data, selectedPeriod])

  const currentPayroll = useMemo<PayrollEntry | null>(() => {
    if (!data) return null
    if (data.entries.length === 0 && data.fallbackSalary != null) {
      return {
        id: "preview",
        period: "Salario actual",
        baseSalary: data.fallbackSalary,
        overtime: 0,
        bonuses: 0,
        deductions: 0,
        netPay: data.fallbackSalary,
        status: "processed",
        paidDate: new Date().toISOString(),
      }
    }

    if (!selectedPeriod) {
      return data.entries[0] ?? null
    }

    return data.entries.find((entry) => entry.period === selectedPeriod) ?? data.entries[0] ?? null
  }, [data, selectedPeriod])

  const handleDownloadPayslip = (period: string) => {
    toast.success(`Descargando recibo de nómina para ${period}`)
  }

  const formatOptionalDate = (value?: string) => (value ? formatDate(value) : "Sin registro")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nómina</h1>
            <p className="text-muted-foreground">Consulta tus recibos y descárgalos cuando los necesites</p>
          </div>
          {data?.entries.length ? (
            <Select value={selectedPeriod ?? undefined} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                {data.entries.map((entry) => (
                  <SelectItem key={entry.id} value={entry.period}>
                    {entry.period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar la nómina</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data?.stats.totalEarnings ?? currentPayroll?.baseSalary ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Últimos 12 pagos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deducciones</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data?.stats.totalDeductions ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Seguridad social e impuestos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neto acumulado</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(data?.stats.netIncome ?? currentPayroll?.netPay ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Después de deducciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio mensual</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data?.stats.averageMonthly ?? currentPayroll?.netPay ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">Neto estimado</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Recibo de nómina</CardTitle>
                <CardDescription>
                  {currentPayroll ? `${currentPayroll.period} • Pagado ${formatOptionalDate(currentPayroll.paidDate)}` : "Sin registros aún"}
                </CardDescription>
              </div>
              {currentPayroll && (
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[currentPayroll.status] ?? "secondary"}>
                    {statusLabel[currentPayroll.status] ?? currentPayroll.status}
                  </Badge>
                  <Button onClick={() => handleDownloadPayslip(currentPayroll.period)} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentPayroll ? (
              <Tabs defaultValue="summary" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="summary">Resumen</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Pago neto</p>
                      <p className="text-2xl font-bold">{formatCurrency(currentPayroll.netPay)}</p>
                      <p className="text-xs text-muted-foreground">Base + horas extras + bonos - deducciones</p>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Deducciones</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(currentPayroll.deductions)}</p>
                      <p className="text-xs text-muted-foreground">Incluye seguridad social e impuestos</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Ingresos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Salario base</span>
                        <span className="font-medium">{formatCurrency(currentPayroll.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Horas extra</span>
                        <span className="font-medium">{formatCurrency(currentPayroll.overtime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonificaciones</span>
                        <span className="font-medium">{formatCurrency(currentPayroll.bonuses)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Deducciones</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="flex justify-between">
                        <span>Total deducido</span>
                        <span className="font-medium">{formatCurrency(currentPayroll.deductions)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        El detalle exacto depende de las tablas de seguridad social configuradas por RR.HH.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no tienes recibos registrados. Tu salario base se mostrará aquí tan pronto como RR.HH. procese tu primer pago.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
            <CardDescription>Consulta periodos anteriores y descárgalos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <p className="text-sm text-muted-foreground">Cargando historial...</p>
            )}
            {!loading && data?.entries.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay registros de nómina aún.</p>
            )}
            {data?.entries.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-3 border rounded-lg p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">Nómina {entry.period}</p>
                  <p className="text-sm text-muted-foreground">
                    Pagado {formatOptionalDate(entry.paidDate)} • Neto {formatCurrency(entry.netPay)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[entry.status] ?? "secondary"}>
                    {statusLabel[entry.status] ?? entry.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPayslip(entry.period)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Recibo
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Necesitas ajustar tus datos?</CardTitle>
            <CardDescription>Contacta al equipo de RR.HH. para correcciones o novedades</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/employee/requests">Crear solicitud</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
