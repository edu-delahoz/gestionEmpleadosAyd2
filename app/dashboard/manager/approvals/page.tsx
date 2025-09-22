"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, FileText, Calendar, User } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { toast } from "sonner"

export default function ManagerApprovalsPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [comments, setComments] = useState("")

  // Mock pending approvals
  const pendingApprovals = [
    {
      id: 1,
      employee: {
        name: "Juan Pérez",
        avatar: "/professional-man-employee.jpg",
        position: "Ejecutivo de Ventas",
        employeeId: "EMP004",
      },
      type: "vacation",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      days: 5,
      reason: "Vacaciones familiares programadas desde hace varios meses",
      submittedAt: "2024-01-15T10:00:00Z",
      priority: "normal",
      attachment: "vacation-request.pdf",
    },
    {
      id: 2,
      employee: {
        name: "María García",
        avatar: "/professional-woman-diverse.png",
        position: "Analista de Marketing",
        employeeId: "EMP006",
      },
      type: "sick",
      startDate: "2024-01-18",
      endDate: "2024-01-18",
      days: 1,
      reason: "Cita médica especializada que no se pudo programar fuera del horario laboral",
      submittedAt: "2024-01-16T14:30:00Z",
      priority: "urgent",
      attachment: "medical-appointment.pdf",
    },
    {
      id: 3,
      employee: {
        name: "Carlos López",
        avatar: "/professional-man.jpg",
        position: "Coordinador de Ventas",
        employeeId: "EMP007",
      },
      type: "overtime",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      hours: 4,
      reason: "Finalización de proyecto crítico para cliente importante",
      submittedAt: "2024-01-16T18:00:00Z",
      priority: "normal",
    },
  ]

  const recentlyProcessed = [
    {
      id: 4,
      employee: {
        name: "Ana Martínez",
        avatar: "/professional-woman-finance.png",
        position: "Especialista en Finanzas",
      },
      type: "personal",
      days: 1,
      status: "approved",
      processedAt: "2024-01-15T16:00:00Z",
      comments: "Aprobado. Permiso justificado.",
    },
    {
      id: 5,
      employee: {
        name: "Luis Rodríguez",
        avatar: "/placeholder.svg",
        position: "Desarrollador",
      },
      type: "vacation",
      days: 3,
      status: "rejected",
      processedAt: "2024-01-14T11:00:00Z",
      comments: "Rechazado. Período de alta demanda, reprogramar para el próximo mes.",
    },
  ]

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "vacation":
        return { label: "Vacaciones", icon: Calendar, color: "text-blue-600" }
      case "sick":
        return { label: "Incapacidad", icon: FileText, color: "text-red-600" }
      case "personal":
        return { label: "Permiso Personal", icon: User, color: "text-green-600" }
      case "overtime":
        return { label: "Horas Extra", icon: Clock, color: "text-orange-600" }
      default:
        return { label: type, icon: FileText, color: "text-gray-600" }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>
      case "normal":
        return <Badge variant="secondary">Normal</Badge>
      default:
        return <Badge variant="outline">Baja</Badge>
    }
  }

  const handleAction = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setIsDialogOpen(true)
  }

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return

    const actionText = actionType === "approve" ? "aprobada" : "rechazada"
    toast.success(`Solicitud ${actionText} exitosamente`)

    setIsDialogOpen(false)
    setSelectedRequest(null)
    setActionType(null)
    setComments("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aprobaciones</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de tu equipo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</div>
              <p className="text-xs text-muted-foreground">Requieren tu atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pendingApprovals.filter((r) => r.priority === "urgent").length}
              </div>
              <p className="text-xs text-muted-foreground">Prioridad alta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procesadas Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">Para procesar</p>
            </CardContent>
          </Card>
        </div>

        {/* Approvals Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pendientes ({pendingApprovals.length})</TabsTrigger>
            <TabsTrigger value="processed">Procesadas ({recentlyProcessed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApprovals.map((request) => {
              const typeInfo = getTypeInfo(request.type)
              const Icon = typeInfo.icon

              return (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={request.employee.avatar || "/placeholder.svg"}
                            alt={request.employee.name}
                          />
                          <AvatarFallback>{getInitials(request.employee.name)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                            <h3 className="font-semibold">{typeInfo.label}</h3>
                            {getPriorityBadge(request.priority)}
                          </div>
                          <div>
                            <p className="font-medium">{request.employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.employee.position} • {request.employee.employeeId}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>Período:</strong> {formatDate(request.startDate)}
                              {request.endDate !== request.startDate && ` - ${formatDate(request.endDate)}`}
                              {request.days && ` (${request.days} ${request.days === 1 ? "día" : "días"})`}
                              {request.hours && ` (${request.hours} horas)`}
                            </p>
                            <p className="text-sm">
                              <strong>Motivo:</strong> {request.reason}
                            </p>
                            <p className="text-sm text-muted-foreground">Enviado: {formatDate(request.submittedAt)}</p>
                            {request.attachment && <p className="text-sm text-blue-600">📎 {request.attachment}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(request, "reject")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                        <Button size="sm" onClick={() => handleAction(request, "approve")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprobar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {recentlyProcessed.map((request) => {
              const typeInfo = getTypeInfo(request.type)
              const Icon = typeInfo.icon

              return (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={request.employee.avatar || "/placeholder.svg"} alt={request.employee.name} />
                        <AvatarFallback>{getInitials(request.employee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                            <h3 className="font-semibold">{typeInfo.label}</h3>
                            <Badge variant={request.status === "approved" ? "default" : "destructive"}>
                              {request.status === "approved" ? "Aprobada" : "Rechazada"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDate(request.processedAt)}</p>
                        </div>
                        <div>
                          <p className="font-medium">{request.employee.name}</p>
                          <p className="text-sm text-muted-foreground">{request.employee.position}</p>
                        </div>
                        {request.comments && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">
                              <strong>Comentarios:</strong> {request.comments}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType === "approve" ? "Aprobar" : "Rechazar"} Solicitud</DialogTitle>
              <DialogDescription>
                {selectedRequest && (
                  <>
                    {actionType === "approve" ? "Aprobar" : "Rechazar"} la solicitud de{" "}
                    <strong>{selectedRequest.employee.name}</strong> para{" "}
                    <strong>{getTypeInfo(selectedRequest.type).label.toLowerCase()}</strong>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Comentarios (opcional)</label>
                <Textarea
                  placeholder="Agrega comentarios sobre tu decisión..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmAction} variant={actionType === "approve" ? "default" : "destructive"}>
                {actionType === "approve" ? "Aprobar" : "Rechazar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
