"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, CheckCircle, AlertCircle, Briefcase, Calendar } from "lucide-react"

export default function CandidateDashboard() {
  const candidateStats = {
    applicationsSubmitted: 3,
    interviewsScheduled: 1,
    profileCompletion: 85,
    responseRate: 67,
  }

  const applications = [
    {
      id: 1,
      position: "Desarrollador Frontend",
      department: "IT",
      status: "interview",
      appliedDate: "2024-01-10",
      interviewDate: "2024-01-22",
    },
    {
      id: 2,
      position: "Analista de Marketing",
      department: "Marketing",
      status: "review",
      appliedDate: "2024-01-12",
    },
    {
      id: 3,
      position: "Ejecutivo de Ventas",
      department: "Ventas",
      status: "rejected",
      appliedDate: "2024-01-08",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Entrevista - Desarrollador Frontend",
      date: "2024-01-22",
      time: "10:00 AM",
      type: "interview",
    },
    {
      id: 2,
      title: "Feria de empleo virtual",
      date: "2024-01-25",
      time: "2:00 PM",
      type: "event",
    },
  ]

  const profileTasks = [
    { task: "Completar información personal", completed: true },
    { task: "Subir CV actualizado", completed: true },
    { task: "Agregar referencias laborales", completed: false },
    { task: "Completar perfil de habilidades", completed: false },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "interview":
        return <Badge className="bg-blue-100 text-blue-800">Entrevista</Badge>
      case "review":
        return <Badge variant="secondary">En Revisión</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Candidato</h1>
          <p className="text-muted-foreground">Gestiona tus aplicaciones y oportunidades</p>
        </div>

        {/* Candidate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidateStats.applicationsSubmitted}</div>
              <p className="text-xs text-muted-foreground">Enviadas este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entrevistas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{candidateStats.interviewsScheduled}</div>
              <p className="text-xs text-muted-foreground">Programadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Completo</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidateStats.profileCompletion}%</div>
              <Progress value={candidateStats.profileCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidateStats.responseRate}%</div>
              <p className="text-xs text-muted-foreground">De tus aplicaciones</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Status */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Aplicaciones</CardTitle>
              <CardDescription>Estado de tus postulaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{app.position}</p>
                      <p className="text-sm text-muted-foreground">{app.department}</p>
                      <p className="text-xs text-muted-foreground">
                        Aplicado: {app.appliedDate}
                        {app.interviewDate && ` | Entrevista: ${app.interviewDate}`}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(app.status)}
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Completar Perfil</CardTitle>
              <CardDescription>Mejora tus oportunidades completando tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
                    )}
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.task}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">Completar Perfil</Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Entrevistas y eventos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {event.type === "interview" ? (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} - {event.time}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">{event.type === "interview" ? "Preparar" : "Registrarse"}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes para candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm">Buscar Empleos</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Actualizar CV</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Ver Entrevistas</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Completar Perfil</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
