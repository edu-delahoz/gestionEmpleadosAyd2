"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Eye } from "lucide-react"

export default function HRRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [requests, setRequests] = useState([
    {
      id: 1,
      employee: "Ana Rodríguez",
      type: "Vacaciones",
      description: "Solicitud de vacaciones del 25 al 29 de enero",
      startDate: "2024-01-25",
      endDate: "2024-01-29",
      days: 5,
      status: "pending",
      priority: "medium",
      submittedDate: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      reason: "Vacaciones familiares programadas",
      department: "IT",
    },
    {
      id: 2,
      employee: "Carlos Mendoza",
      type: "Permiso",
      description: "Cita médica especializada",
      startDate: "2024-01-22",
      endDate: "2024-01-22",
      days: 0.5,
      status: "approved",
      priority: "high",
      submittedDate: "2024-01-14",
      avatar: "/placeholder.svg?height=40&width=40",
      reason: "Cita médica que no se puede reprogramar",
      department: "Ventas",
    },
    {
      id: 3,
      employee: "María González",
      type: "Trabajo remoto",
      description: "Trabajo desde casa por mudanza",
      startDate: "2024-01-20",
      endDate: "2024-01-24",
      days: 5,
      status: "pending",
      priority: "low",
      submittedDate: "2024-01-13",
      avatar: "/placeholder.svg?height=40&width=40",
      reason: "Mudanza de residencia",
      department: "Marketing",
    },
    {
      id: 4,
      employee: "Luis Herrera",
      type: "Licencia",
      description: "Licencia de paternidad",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      days: 15,
      status: "rejected",
      priority: "high",
      submittedDate: "2024-01-12",
      avatar: "/placeholder.svg?height=40&width=40",
      reason: "Nacimiento de hijo",
      department: "Finanzas",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [comments, setComments] = useState("")

  const requestTypes = ["Vacaciones", "Permiso", "Trabajo remoto", "Licencia", "Capacitación"]

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    return matchesStatus && matchesType
  })

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Aprobada
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge variant="default">Media</Badge>
      case "low":
        return <Badge variant="secondary">Baja</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const handleViewDetails = (request: any) => {
    console.log("[v0] Viewing request details:", request.id)
    setSelectedRequest(request)
    setIsDetailsOpen(true)
  }

  const handleApproveRequest = (requestId: number) => {
    console.log("[v0] Approving request:", requestId)
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))
    alert("Solicitud aprobada exitosamente")
  }

  const handleRejectRequest = (requestId: number) => {
    console.log("[v0] Rejecting request:", requestId)
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
    alert("Solicitud rechazada")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Solicitudes</h1>
          <p className="text-muted-foreground">Revisa y gestiona todas las solicitudes de empleados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
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
              <p className="text-xs text-muted-foreground">Procesadas exitosamente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">No aprobadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="approved">Aprobadas</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {requestTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes ({filteredRequests.length})</CardTitle>
            <CardDescription>Lista de todas las solicitudes filtradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.employee} />
                      <AvatarFallback>
                        {request.employee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{request.employee}</h3>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>
                      <p className="text-sm font-medium">{request.type}</p>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.startDate} - {request.endDate}
                        </span>
                        <span>{request.days} día(s)</span>
                        <span>Enviada: {request.submittedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Aprobar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                      <Eye className="mr-1 h-3 w-3" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de Solicitud</DialogTitle>
              <DialogDescription>Información completa de la solicitud</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Empleado</Label>
                    <p>{selectedRequest.employee}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Departamento</Label>
                    <p>{selectedRequest.department}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Tipo de Solicitud</Label>
                    <p>{selectedRequest.type}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Estado</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <Label className="font-semibold">Fecha de Inicio</Label>
                    <p>{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Fecha de Fin</Label>
                    <p>{selectedRequest.endDate}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Días Solicitados</Label>
                    <p>{selectedRequest.days}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Prioridad</Label>
                    <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Motivo</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequest.reason}</p>
                </div>
                <div>
                  <Label className="font-semibold">Descripción</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequest.description}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Cerrar
                  </Button>
                  {selectedRequest.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 bg-transparent"
                        onClick={() => {
                          handleRejectRequest(selectedRequest.id)
                          setIsDetailsOpen(false)
                        }}
                      >
                        Rechazar
                      </Button>
                      <Button
                        onClick={() => {
                          handleApproveRequest(selectedRequest.id)
                          setIsDetailsOpen(false)
                        }}
                      >
                        Aprobar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
