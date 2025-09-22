"use client"

import type React from "react"

import { useState } from "react"
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
import { FileText, Plus, Calendar, Clock, DollarSign, FileCheck } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeeRequestsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [requestForm, setRequestForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null as File | null,
  })

  // Mock requests data
  const requests = [
    {
      id: 1,
      type: "vacation",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      days: 5,
      reason: "Vacaciones familiares",
      status: "pending",
      createdAt: "2024-01-15T10:00:00Z",
      approver: "María López",
    },
    {
      id: 2,
      type: "sick",
      startDate: "2024-01-10",
      endDate: "2024-01-10",
      days: 1,
      reason: "Cita médica",
      status: "approved",
      createdAt: "2024-01-08T09:00:00Z",
      approver: "María López",
      approvedAt: "2024-01-09T15:30:00Z",
    },
    {
      id: 3,
      type: "personal",
      startDate: "2024-01-05",
      endDate: "2024-01-05",
      days: 1,
      reason: "Trámites personales",
      status: "rejected",
      createdAt: "2024-01-03T14:00:00Z",
      approver: "María López",
      rejectedAt: "2024-01-04T11:00:00Z",
    },
  ]

  const requestTypes = [
    { value: "vacation", label: "Vacaciones", icon: Calendar },
    { value: "sick", label: "Incapacidad", icon: FileCheck },
    { value: "personal", label: "Permiso Personal", icon: Clock },
    { value: "maternity", label: "Licencia de Maternidad", icon: FileText },
    { value: "paternity", label: "Licencia de Paternidad", icon: FileText },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    const requestType = requestTypes.find((t) => t.value === type)
    if (requestType) {
      const Icon = requestType.icon
      return <Icon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getTypeLabel = (type: string) => {
    const requestType = requestTypes.find((t) => t.value === type)
    return requestType?.label || type
  }

  const handleSubmitRequest = () => {
    if (!requestForm.type || !requestForm.startDate || !requestForm.reason) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    // Mock submission
    toast.success("Solicitud enviada exitosamente")
    setIsDialogOpen(false)
    setRequestForm({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      attachment: null,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRequestForm({ ...requestForm, attachment: file })
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
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva Solicitud</DialogTitle>
                <DialogDescription>Completa el formulario para enviar tu solicitud</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Solicitud</Label>
                  <Select onValueChange={(value) => setRequestForm({ ...requestForm, type: value })}>
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
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={requestForm.startDate}
                      onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={requestForm.endDate}
                      onChange={(e) => setRequestForm({ ...requestForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe el motivo de tu solicitud..."
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Adjunto (Opcional)</Label>
                  <Input id="attachment" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
                  {requestForm.attachment && (
                    <p className="text-sm text-muted-foreground">Archivo: {requestForm.attachment.name}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSubmitRequest}>
                  Enviar Solicitud
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Request Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">Este año</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">En revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <FileCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground">Autorizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días Disponibles</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">15</div>
              <p className="text-xs text-muted-foreground">Vacaciones restantes</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Solicitudes</CardTitle>
            <CardDescription>Historial de todas tus solicitudes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(request.type)}
                    <div>
                      <p className="font-medium">{getTypeLabel(request.type)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(request.startDate)}
                        {request.endDate !== request.startDate && ` - ${formatDate(request.endDate)}`} ({request.days}{" "}
                        {request.days === 1 ? "día" : "días"})
                      </p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        Enviado: {formatDate(request.createdAt)} | Revisor: {request.approver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getStatusBadge(request.status)}
                    <div>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Solicitudes comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Vacaciones</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <FileCheck className="h-5 w-5" />
                <span className="text-sm">Incapacidad</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Permiso Personal</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">Reembolso</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
