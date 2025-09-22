"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, Calendar, DollarSign, Users, Settings, Check, X } from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  category: "payroll" | "attendance" | "requests" | "system" | "communication"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    category: "payroll",
    title: "Recibo de nómina disponible",
    message: "Tu recibo de nómina de enero ya está disponible para descarga.",
    timestamp: "2024-01-10T09:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "success",
    category: "requests",
    title: "Solicitud de vacaciones aprobada",
    message: "Tu solicitud de vacaciones del 15-20 de enero ha sido aprobada.",
    timestamp: "2024-01-10T08:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    category: "attendance",
    title: "Recordatorio de registro",
    message: "No olvides registrar tu salida al finalizar tu jornada laboral.",
    timestamp: "2024-01-09T18:30:00Z",
    read: true,
  },
  {
    id: "4",
    type: "info",
    category: "communication",
    title: "Reunión de equipo programada",
    message: "Se ha programado una reunión de equipo para el 20 de enero a las 10:00 AM.",
    timestamp: "2024-01-09T14:00:00Z",
    read: true,
  },
]

const categoryIcons = {
  payroll: DollarSign,
  attendance: Calendar,
  requests: Users,
  system: Settings,
  communication: MessageSquare,
}

const typeColors = {
  info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  warning:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  success:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
}

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.read
    if (activeTab === "action") return notif.actionRequired
    return notif.category === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Notificaciones</h1>
            <p className="text-muted-foreground mt-1">Mantente al día con tus actividades y comunicaciones</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {unreadCount} sin leer
            </Badge>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">Sin leer</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="payroll">Nómina</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="communication">Comunicación</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No hay notificaciones</h3>
                      <p className="text-muted-foreground">No tienes notificaciones en esta categoría.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = categoryIcons[notification.category]
                  return (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md ${
                        !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`p-2 rounded-lg ${typeColors[notification.type]}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{notification.title}</h3>
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Acción requerida
                                  </Badge>
                                )}
                                {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                              </div>
                              <p className="text-muted-foreground mb-2">{notification.message}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleString("es-ES")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
