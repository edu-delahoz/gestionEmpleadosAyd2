"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Clock, MapPin, CalendarIcon, TrendingUp } from "lucide-react"
import { formatTime, calculateHours } from "@/lib/utils"
import { toast } from "sonner"

export default function EmployeeAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isClocked, setIsClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<string | null>(null)

  // Mock attendance data
  const todayAttendance = {
    clockIn: "08:00",
    clockOut: null,
    breakStart: null,
    breakEnd: null,
    totalHours: 0,
    status: "present",
  }

  const weeklyStats = {
    totalHours: 32,
    targetHours: 40,
    averageArrival: "08:05",
    daysPresent: 4,
  }

  const recentAttendance = [
    { date: "2024-01-16", clockIn: "08:15", clockOut: "17:15", hours: 8, status: "late" },
    { date: "2024-01-15", clockIn: "08:00", clockOut: "17:00", hours: 8, status: "present" },
    { date: "2024-01-12", clockIn: "07:55", clockOut: "17:10", hours: 8.25, status: "present" },
    { date: "2024-01-11", clockIn: "08:30", clockOut: "17:30", hours: 8, status: "late" },
  ]

  const handleClockIn = () => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5)
    setClockInTime(timeString)
    setIsClocked(true)
    toast.success(`Entrada marcada a las ${timeString}`)
  }

  const handleClockOut = () => {
    if (clockInTime) {
      const now = new Date()
      const timeString = now.toTimeString().slice(0, 5)
      const hours = calculateHours(clockInTime, timeString)
      setIsClocked(false)
      setClockInTime(null)
      toast.success(`Salida marcada a las ${timeString}. Total: ${hours} horas`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>
      case "late":
        return <Badge className="bg-orange-100 text-orange-800">Tarde</Badge>
      case "absent":
        return <Badge variant="destructive">Ausente</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asistencia</h1>
          <p className="text-muted-foreground">Gestiona tu tiempo y asistencia</p>
        </div>

        {/* Clock In/Out Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Control de Tiempo
            </CardTitle>
            <CardDescription>Marca tu entrada y salida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Oficina Principal - Bogotá</span>
                </div>
                <div className="text-2xl font-bold">
                  {new Date().toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="space-y-2">
                {!isClocked ? (
                  <Button onClick={handleClockIn} size="lg" className="w-32">
                    Marcar Entrada
                  </Button>
                ) : (
                  <Button onClick={handleClockOut} variant="destructive" size="lg" className="w-32">
                    Marcar Salida
                  </Button>
                )}
                {clockInTime && <p className="text-sm text-muted-foreground text-center">Entrada: {clockInTime}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de la Semana</CardTitle>
                <CardDescription>Tu rendimiento semanal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{weeklyStats.totalHours}h</div>
                    <p className="text-sm text-muted-foreground">Horas Trabajadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{weeklyStats.daysPresent}</div>
                    <p className="text-sm text-muted-foreground">Días Presente</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{weeklyStats.averageArrival}</div>
                    <p className="text-sm text-muted-foreground">Llegada Promedio</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((weeklyStats.totalHours / weeklyStats.targetHours) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Cumplimiento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Historial Reciente</CardTitle>
                <CardDescription>Tus últimos registros de asistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(record.clockIn)} - {formatTime(record.clockOut)} ({record.hours}h)
                        </p>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendario
              </CardTitle>
              <CardDescription>Selecciona una fecha para ver detalles</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas relacionadas con asistencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Ver Reportes</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm">Solicitar Cambio</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Horas Extra</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Cambiar Ubicación</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
