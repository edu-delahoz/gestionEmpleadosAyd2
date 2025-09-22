"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { getInitials, formatDate } from "@/lib/utils"

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      employee: "Juan Pérez",
      avatar: "/professional-man-employee.jpg",
      type: "vacation",
      status: "pending",
      days: 5,
      startDate: "2024-02-01",
      reason: "Vacaciones familiares",
      submittedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      employee: "María García",
      avatar: "/professional-woman-diverse.png",
      type: "sick",
      status: "approved",
      days: 1,
      startDate: "2024-01-18",
      reason: "Cita médica",
      submittedAt: "2024-01-16T14:30:00Z",
    },
    {
      id: 3,
      employee: "Carlos López",
      avatar: "/professional-man.jpg",
      type: "personal",
      status: "pending",
      days: 2,
      startDate: "2024-02-05",
      reason: "Asuntos personales",
      submittedAt: "2024-01-20T09:15:00Z",
    },
  ])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vacation":
        return "Vacaciones"
      case "sick":
        return "Incapacidad"
      case "personal":
        return "Permiso Personal"
      default:
        return type
    }
  }

  const handleApproveRequest = (requestId: number) => {
    console.log("[v0] Approving request:", requestId)
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))
  }

  const handleRejectRequest = (requestId: number) => {
    console.log("[v0] Rejecting request:", requestId)
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
  }

  const handleViewDetails = (requestId: number) => {
    console.log("[v0] Viewing request details:", requestId)
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Solicitudes</h1>
          <p className="text-muted-foreground">Administra todas las solicitudes de empleados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Todas las solicitudes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.employee} />
                      <AvatarFallback>{getInitials(request.employee)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(request.type)} - {request.days} días
                      </p>
                      <p className="text-sm text-muted-foreground">Desde: {formatDate(request.startDate)}</p>
                      <p className="text-xs text-muted-foreground">Motivo: {request.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {request.status === "pending"
                        ? "Pendiente"
                        : request.status === "approved"
                          ? "Aprobada"
                          : "Rechazada"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles de Solicitud</DialogTitle>
                          <DialogDescription>Información completa de la solicitud</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <strong>Empleado:</strong> {request.employee}
                          </div>
                          <div>
                            <strong>Tipo:</strong> {getTypeLabel(request.type)}
                          </div>
                          <div>
                            <strong>Días solicitados:</strong> {request.days}
                          </div>
                          <div>
                            <strong>Fecha de inicio:</strong> {formatDate(request.startDate)}
                          </div>
                          <div>
                            <strong>Motivo:</strong> {request.reason}
                          </div>
                          <div>
                            <strong>Fecha de solicitud:</strong> {formatDate(request.submittedAt)}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                          Rechazar
                        </Button>
                        <Button size="sm" onClick={() => handleApproveRequest(request.id)}>
                          Aprobar
                        </Button>
                      </div>
                    )}
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
