"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, AlertTriangle, Info, CheckCircle, Users, Calendar, FileText, Shield } from "lucide-react"

export default function HRNotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "security",
      title: "Intento de acceso no autorizado",
      message:
        "Se detectó un intento de acceso desde una ubicación no reconocida para el usuario carlos.mendoza@company.com",
      time: "Hace 5 minutos",
      priority: "high",
      read: false,
      icon: Shield,
    },
    {
      id: 2,
      type: "request",
      title: "Nueva solicitud de vacaciones",
      message: "Ana Rodríguez ha solicitado vacaciones del 25 al 29 de enero (5 días)",
      time: "Hace 15 minutos",
      priority: "medium",
      read: false,
      icon: Calendar,
    },
    {
      id: 3,
      type: "system",
      title: "Backup completado exitosamente",
      message: "El backup automático de la base de datos se completó sin errores",
      time: "Hace 1 hora",
      priority: "low",
      read: true,
      icon: CheckCircle,
    },
    {
      id: 4,
      type: "hr",
      title: "Nuevo empleado registrado",
      message: "Diego Ramírez ha sido agregado al sistema como Diseñador UX en el departamento de Marketing",
      time: "Hace 2 horas",
      priority: "medium",
      read: false,
      icon: Users,
    },
    {
      id: 5,
      type: "compliance",
      title: "Revisión de políticas requerida",
      message: "Las políticas de trabajo remoto requieren actualización según nuevas regulaciones",
      time: "Hace 3 horas",
      priority: "high",
      read: true,
      icon: FileText,
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Espacio de almacenamiento bajo",
      message: "El servidor de archivos está al 85% de capacidad",
      severity: "medium",
    },
    {
      id: 2,
      type: "error",
      title: "Fallo en sincronización de nómina",
      message: "Error al sincronizar datos con el sistema de nómina externo",
      severity: "high",
    },
    {
      id: 3,
      type: "info",
      title: "Mantenimiento programado",
      message: "Mantenimiento del sistema programado para el domingo 21 de enero",
      severity: "low",
    },
  ]

  const complianceAlerts = [
    {
      id: 1,
      title: "Certificaciones vencidas",
      message: "3 empleados tienen certificaciones que vencen en los próximos 30 días",
      count: 3,
      urgency: "medium",
    },
    {
      id: 2,
      title: "Evaluaciones de desempeño pendientes",
      message: "12 evaluaciones de desempeño están pendientes de completar",
      count: 12,
      urgency: "high",
    },
    {
      id: 3,
      title: "Capacitaciones obligatorias",
      message: "5 empleados no han completado las capacitaciones de seguridad",
      count: 5,
      urgency: "high",
    },
  ]

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    high: notifications.filter((n) => n.priority === "high").length,
    security: notifications.filter((n) => n.type === "security").length,
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "security":
        return Shield
      case "request":
        return Calendar
      case "system":
        return CheckCircle
      case "hr":
        return Users
      case "compliance":
        return FileText
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notificaciones de RH</h1>
            <p className="text-muted-foreground">Centro de notificaciones y alertas del sistema</p>
          </div>
          <Button variant="outline">Marcar todas como leídas</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Notificaciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <p className="text-xs text-muted-foreground">Urgentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seguridad</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.security}</div>
              <p className="text-xs text-muted-foreground">Alertas de seguridad</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Notificaciones</CardTitle>
                <CardDescription>Lista completa de notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon
                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 p-4 border rounded-lg ${!notification.read ? "bg-muted/30" : ""}`}
                      >
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)} bg-muted`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {notification.priority === "high"
                                  ? "Alta"
                                  : notification.priority === "medium"
                                    ? "Media"
                                    : "Baja"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {notification.read ? "Marcar como no leída" : "Marcar como leída"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertas del Sistema</CardTitle>
                <CardDescription>Notificaciones técnicas y de infraestructura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            alert.type === "error"
                              ? "text-red-600 bg-red-100"
                              : alert.type === "warning"
                                ? "text-orange-600 bg-orange-100"
                                : "text-blue-600 bg-blue-100"
                          }`}
                        >
                          {alert.type === "error" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : alert.type === "warning" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Info className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        <Button variant="outline" size="sm">
                          Resolver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Cumplimiento</CardTitle>
                <CardDescription>Notificaciones relacionadas con políticas y regulaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            alert.urgency === "high" ? "text-red-600 bg-red-100" : "text-orange-600 bg-orange-100"
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <Badge variant="outline" className="mt-1">
                            {alert.count} elemento(s)
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.urgency === "high" ? "destructive" : "default"}>
                          {alert.urgency === "high" ? "Urgente" : "Importante"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
