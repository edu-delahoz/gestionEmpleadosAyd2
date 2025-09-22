"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { getInitials } from "@/lib/utils"

export default function ManagerAttendancePage() {
  const teamAttendance = [
    {
      id: 1,
      employee: "Juan Pérez",
      avatar: "/professional-man-employee.jpg",
      checkIn: "08:00",
      checkOut: "17:30",
      status: "present",
      hours: "9.5",
      location: "Oficina",
    },
    {
      id: 2,
      employee: "María García",
      avatar: "/professional-woman-diverse.png",
      checkIn: "08:15",
      checkOut: "17:45",
      status: "late",
      hours: "9.5",
      location: "Remoto",
    },
    {
      id: 3,
      employee: "Carlos López",
      avatar: "/professional-man.jpg",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      hours: "0",
      location: "Vacaciones",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asistencia del Equipo</h1>
          <p className="text-muted-foreground">Monitorea la asistencia de tu equipo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">7</div>
              <p className="text-xs text-muted-foreground">87% del equipo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-xs text-muted-foreground">13% del equipo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Justificado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.9</div>
              <p className="text-xs text-muted-foreground">Por miembro</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia de Hoy</CardTitle>
            <CardDescription>Estado actual de los miembros de tu equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.employee} />
                      <AvatarFallback>{getInitials(record.employee)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        Entrada: {record.checkIn} | Salida: {record.checkOut}
                      </p>
                      <p className="text-sm text-muted-foreground">Ubicación: {record.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{record.hours}h</span>
                    <Badge
                      variant={
                        record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"
                      }
                    >
                      {record.status === "present" ? "Presente" : record.status === "late" ? "Tardanza" : "Ausente"}
                    </Badge>
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
