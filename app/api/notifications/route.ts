import { type NextRequest, NextResponse } from "next/server"

// Mock notifications data
const notifications = [
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
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const unreadOnly = searchParams.get("unread") === "true"

  let filteredNotifications = notifications

  if (category && category !== "all") {
    filteredNotifications = filteredNotifications.filter((n) => n.category === category)
  }

  if (unreadOnly) {
    filteredNotifications = filteredNotifications.filter((n) => !n.read)
  }

  return NextResponse.json({
    success: true,
    data: filteredNotifications,
    total: filteredNotifications.length,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, category, title, message, actionRequired } = body

  const newNotification = {
    id: Date.now().toString(),
    type,
    category,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    actionRequired: actionRequired || false,
  }

  notifications.unshift(newNotification)

  return NextResponse.json({
    success: true,
    data: newNotification,
    message: "Notificación creada exitosamente",
  })
}
