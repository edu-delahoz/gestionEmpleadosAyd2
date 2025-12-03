"use client"

import { useMemo, useState } from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { useRequests, type RequestRecord } from "@/hooks/use-requests"
import { toast } from "sonner"

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
}

const typeLabels: Record<string, string> = {
  vacation: "Vacaciones",
  other: "Otro",
}

const formatOptionalDate = (value: string | null) => (value ? formatDate(value) : "Sin asignar")

const getStatusBadge = (status: RequestRecord["status"]) => {
  switch (status) {
    case "APPROVED":
      return <Badge variant="default">{statusLabels[status]}</Badge>
    case "PENDING":
      return <Badge variant="secondary">{statusLabels[status]}</Badge>
    case "REJECTED":
      return <Badge variant="destructive">{statusLabels[status]}</Badge>
    case "CANCELLED":
      return <Badge variant="secondary">{statusLabels[status]}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function HRRequestsPage() {
  const { requests, loading, error, refresh } = useRequests({ includeAll: true })
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter
      const matchesType = typeFilter === "all" || request.type === typeFilter
      return matchesStatus && matchesType
    })
  }, [requests, statusFilter, typeFilter])

  const stats = useMemo(() => {
    const total = requests.length
    const pending = requests.filter((r) => r.status === "PENDING").length
    const approved = requests.filter((r) => r.status === "APPROVED").length
    const rejected = requests.filter((r) => r.status === "REJECTED").length
    return { total, pending, approved, rejected }
  }, [requests])

  const handleUpdateStatus = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(requestId)
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo actualizar la solicitud")
      }

      toast.success(`Solicitud ${status === "APPROVED" ? "aprobada" : "rechazada"}`)
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitudes de empleados</h1>
            <p className="text-muted-foreground">Supervisa y prioriza las solicitudes en curso</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar las solicitudes</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Solicitudes registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Requieren revisión</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">En ejecución</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Últimos registros</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refina la búsqueda por estado o tipo</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendientes</SelectItem>
                <SelectItem value="APPROVED">Aprobadas</SelectItem>
                <SelectItem value="REJECTED">Rechazadas</SelectItem>
                <SelectItem value="CANCELLED">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="vacation">Vacaciones</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes recientes</CardTitle>
            <CardDescription>Se muestran las solicitudes enviadas por los empleados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>}
            {!loading && filteredRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay solicitudes que coincidan con los filtros.</p>
            )}
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(request.profile?.name ?? "??")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{request.profile?.name ?? "Empleado"}</p>
                      <p className="text-sm text-muted-foreground">
                        {typeLabels[request.type] ?? request.type} • {request.days ?? 1}{" "}
                        {request.days === 1 ? "día" : "días"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-sm">{request.reason ?? "Sin motivo especificado"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 text-xs text-muted-foreground gap-2">
                  <span>Departamento: {request.department ?? "General"}</span>
                  <span>Registrada el {formatDate(request.createdAt)}</span>
                  <span>Desde {formatOptionalDate(request.startDate)}</span>
                  <span>Hasta {formatOptionalDate(request.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === request.id}
                    onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === request.id}
                    onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
