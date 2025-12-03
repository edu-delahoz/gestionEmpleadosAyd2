"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, DollarSign, FileText, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency, formatDate } from "@/lib/utils"

type EmployeeDashboardResponse = {
  profile: {
    name: string
    email: string | null
    position: string
    department: string
    startDate: string | null
    location: string | null
    salary: number | null
  }
  stats: {
    pendingRequests: number
    vacation: {
      total: number
      used: number
      available: number
    }
    lastPayroll: {
      amount: number
      period: string
      paidAt: string
    }
  }
  requests: Array<{
    id: string
    type: string
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
    department: string | null
    startDate: string | null
    endDate: string | null
    createdAt: string
    days: number | null
    reason: string | null
  }>
}

const requestStatusLabels: Record<EmployeeDashboardResponse["requests"][number]["status"], string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
}

const requestStatusVariant: Record<EmployeeDashboardResponse["requests"][number]["status"], "default" | "secondary" | "destructive"> =
  {
    APPROVED: "default",
    PENDING: "secondary",
    REJECTED: "destructive",
    CANCELLED: "secondary",
  }

const formatOptionalDate = (value: string | null) => (value ? formatDate(value) : "Sin registro")

export default function EmployeeDashboard() {
  const [data, setData] = useState<EmployeeDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/dashboard/employee", { cache: "no-store" })
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error ?? "No se pudo cargar tu información")
        }
        const payload = (await response.json()) as EmployeeDashboardResponse
        setData(payload)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const headerSubtitle = useMemo(() => {
    if (!data) return "Bienvenido a tu portal de empleado"
    return `${data.profile.position} · ${data.profile.department}`
  }, [data])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hola, {data?.profile.name ?? "Empleado"}</h1>
          <p className="text-muted-foreground">{headerSubtitle}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar tu información</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Salario mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.profile.salary != null ? formatCurrency(data.profile.salary) : "Sin registro"}
              </div>
              <p className="text-xs text-muted-foreground">Actualizado automáticamente desde nómina</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Solicitudes pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.pendingRequests ?? 0}</div>
              <p className="text-xs text-muted-foreground">En revisión por el equipo de RR.HH.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Vacaciones disponibles</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.vacation.available ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {data?.stats.vacation.used ?? 0} de {data?.stats.vacation.total ?? 0} usados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Último pago</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data?.stats.lastPayroll.amount ?? 0)}</div>
              <p className="text-xs text-muted-foreground">
                {data?.stats.lastPayroll.period ?? "Periodo no definido"} • {formatOptionalDate(data?.stats.lastPayroll.paidAt ?? null)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen personal</CardTitle>
              <CardDescription>Información básica de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Departamento</span>
                <span className="font-medium">{data?.profile.department ?? "Sin asignar"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Posición</span>
                <span className="font-medium">{data?.profile.position ?? "Sin definir"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Correo</span>
                <span className="font-medium">{data?.profile.email ?? "Sin correo"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ubicación</span>
                <span className="font-medium">{data?.profile.location ?? "No registrada"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Inicio</span>
                <span className="font-medium">{formatOptionalDate(data?.profile.startDate ?? null)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitudes recientes</CardTitle>
              <CardDescription>Últimos movimientos registrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando solicitudes...
                </div>
              )}
              {!loading && data?.requests.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no registras solicitudes recientes.</p>
              )}
              {data?.requests.map((request) => (
                <div key={request.id} className="flex flex-col gap-2 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{request.type.toLowerCase()}</p>
                    <Badge variant={requestStatusVariant[request.status]}>
                      {requestStatusLabels[request.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.department ?? "General"} • {formatOptionalDate(request.startDate)}{" "}
                    {request.endDate ? `→ ${formatOptionalDate(request.endDate)}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Registrada el {formatOptionalDate(request.createdAt)} {request.days ? `• ${request.days} días` : ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Gestiona tus solicitudes y pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/requests">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Nueva solicitud</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/employee/payroll">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Ver nómina</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
