"use client"

import { useState } from "react"
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
    type: "warning",
    category: "requests",
    title: "Solicitud de vacaciones pendiente",
    message: "María González ha solicitado vacaciones del 15-20 de enero. Requiere aprobación.",
    timestamp: "2024-01-10T09:30:00Z",
    read: false,
    actionRequired: true,
  },
  {
    id: "2",
    type: "info",
    category: "payroll",
    title: "Nómina procesada",
    message: "La nómina de enero ha sido procesada exitosamente para 150 empleados.",
    timestamp: "2024-01-10T08:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "error",
    category: "attendance",
    title: "Registro de asistencia faltante",
    message: "Carlos Ruiz no ha registrado salida el 9 de enero.",
    timestamp: "2024-01-09T18:30:00Z",
    read: true,
  },
  {
    id: "4",
    type: "success",
    category: "system",
    title: "Backup completado",
    message: "Respaldo automático de datos completado exitosamente.",
    timestamp: "2024-01-09T02:00:00Z",
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
  info: "bg-blue-100 text-blue-800 border-blue-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
}

export default function NotificationsPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus notificaciones y comunicaciones</p>
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
          <TabsTrigger value="action">Acción requerida</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          <TabsTrigger value="payroll">Nómina</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                    <p className="text-gray-500">No tienes notificaciones en esta categoría.</p>
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
                      !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
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
                              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Acción requerida
                                </Badge>
                              )}
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <p className="text-sm text-gray-500">
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
  )
}
