"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Plus, Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

type RequestRecord = {
  id: string
  type: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  startDate: string | null
  endDate: string | null
  days: number | null
  reason: string | null
  createdAt: string
  department: string | null
}

const requestTypes = [
  { value: "vacation", label: "Vacaciones", icon: Calendar },
  { value: "other", label: "Otro", icon: FileText },
]

const statusConfig: Record<RequestRecord["status"], { label: string; variant: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  APPROVED: { label: "Aprobada", variant: "default" },
  REJECTED: { label: "Rechazada", variant: "destructive" },
  CANCELLED: { label: "Cancelada", variant: "secondary" },
}

const formatOptionalDate = (value: string | null) => (value ? formatDate(value) : "Sin asignar")

export default function EmployeeRequestsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requests, setRequests] = useState<RequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestForm, setRequestForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/requests", { cache: "no-store" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener tus solicitudes")
      }
      const payload = (await response.json()) as RequestRecord[]
      setRequests(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const stats = useMemo(() => {
    const pending = requests.filter((request) => request.status === "PENDING").length
    const approved = requests.filter((request) => request.status === "APPROVED").length
    const rejected = requests.filter((request) => request.status === "REJECTED").length
    return {
      total: requests.length,
      pending,
      approved,
      rejected,
    }
  }, [requests])

  const getStatusBadge = (status: RequestRecord["status"]) => {
    const config = statusConfig[status]
    return <Badge variant={config?.variant ?? "secondary"}>{config?.label ?? status}</Badge>
  }

  const getTypeIcon = (type: string) => {
    const requestType = requestTypes.find((t) => t.value === type)
    const Icon = requestType?.icon ?? FileText
    return <Icon className="h-4 w-4" />
  }

  const getTypeLabel = (type: string) => requestTypes.find((t) => t.value === type)?.label ?? type

  const handleSubmitRequest = async () => {
    if (!requestForm.type || !requestForm.startDate || !requestForm.reason) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: requestForm.type,
          startDate: requestForm.startDate,
          endDate: requestForm.endDate || undefined,
          reason: requestForm.reason.trim(),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo enviar la solicitud")
      }

      toast.success("Solicitud enviada exitosamente")
      setIsDialogOpen(false)
      setRequestForm({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      })
      fetchRequests()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitudes</h1>
            <p className="text-muted-foreground">Gestiona tus permisos y licencias</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva solicitud</DialogTitle>
                <DialogDescription>Completa el formulario para enviar tu solicitud.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de solicitud</Label>
                  <Select value={requestForm.type} onValueChange={(value) => setRequestForm((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={requestForm.startDate}
                      onChange={(event) => setRequestForm((prev) => ({ ...prev, startDate: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={requestForm.endDate}
                      onChange={(event) => setRequestForm((prev) => ({ ...prev, endDate: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    value={requestForm.reason}
                    onChange={(event) => setRequestForm((prev) => ({ ...prev, reason: event.target.value }))}
                    placeholder="Describe brevemente la razón de tu solicitud"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar tus solicitudes</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de solicitudes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Historial completo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">En revisión por RR.HH.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Listas para programar</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de solicitudes</CardTitle>
            <CardDescription>Revisa tus solicitudes enviadas y su estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>}
            {!loading && requests.length === 0 && <p className="text-sm text-muted-foreground">Aún no has enviado solicitudes.</p>}
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">{getTypeIcon(request.type)}</div>
                    <div>
                      <p className="font-medium">{getTypeLabel(request.type)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatOptionalDate(request.startDate)} • {request.days ?? 1} {request.days === 1 ? "día" : "días"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-sm">{request.reason ?? "Sin motivo especificado"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 text-xs text-muted-foreground gap-2">
                  <span>Registrada: {formatDate(request.createdAt)}</span>
                  <span>Departamento: {request.department ?? "General"}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
