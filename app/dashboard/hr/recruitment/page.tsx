"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Briefcase, Calendar, Users, Clock, CheckCircle, XCircle, Edit, Eye, Video } from "lucide-react"

export default function HRRecruitmentPage() {
  const [selectedPosition, setSelectedPosition] = useState<any>(null)
  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isCandidatesOpen, setIsCandidatesOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<any>(null)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

  const openPositions = [
    {
      id: 1,
      title: "Desarrollador Full Stack",
      department: "IT",
      location: "Bogotá",
      type: "Tiempo completo",
      posted: "2024-01-10",
      applications: 24,
      status: "active",
      priority: "high",
      description: "Desarrollador con experiencia en React y Node.js",
      requirements: ["React", "Node.js", "TypeScript", "MongoDB"],
    },
    {
      id: 2,
      title: "Diseñador UX/UI",
      department: "Marketing",
      location: "Medellín",
      type: "Tiempo completo",
      posted: "2024-01-08",
      applications: 18,
      status: "active",
      priority: "medium",
      description: "Diseñador con experiencia en productos digitales",
      requirements: ["Figma", "Adobe Creative Suite", "Prototipado", "User Research"],
    },
    {
      id: 3,
      title: "Analista de Datos",
      department: "IT",
      location: "Remoto",
      type: "Tiempo completo",
      posted: "2024-01-05",
      applications: 31,
      status: "paused",
      priority: "low",
      description: "Analista para procesamiento y visualización de datos",
      requirements: ["Python", "SQL", "Power BI", "Excel Avanzado"],
    },
  ]

  const candidates = [
    {
      id: 1,
      name: "Andrea Morales",
      position: "Desarrollador Full Stack",
      stage: "Entrevista técnica",
      score: 85,
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "2024-01-12",
      nextStep: "Entrevista final",
      email: "andrea.morales@email.com",
      phone: "+57 300 123 4567",
      experience: "5 años",
    },
    {
      id: 2,
      name: "Diego Ramírez",
      position: "Diseñador UX/UI",
      stage: "Revisión de portafolio",
      score: 78,
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "2024-01-11",
      nextStep: "Primera entrevista",
      email: "diego.ramirez@email.com",
      phone: "+57 301 234 5678",
      experience: "3 años",
    },
    {
      id: 3,
      name: "Sofia Castillo",
      position: "Analista de Datos",
      stage: "Prueba técnica",
      score: 92,
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "2024-01-09",
      nextStep: "Entrevista con equipo",
      email: "sofia.castillo@email.com",
      phone: "+57 302 345 6789",
      experience: "4 años",
    },
  ]

  const interviews = [
    {
      id: 1,
      candidate: "Andrea Morales",
      position: "Desarrollador Full Stack",
      date: "2024-01-20",
      time: "10:00 AM",
      interviewer: "Carlos Tech Lead",
      type: "Técnica",
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: 2,
      candidate: "Diego Ramírez",
      position: "Diseñador UX/UI",
      date: "2024-01-21",
      time: "2:00 PM",
      interviewer: "Ana Design Manager",
      type: "Primera entrevista",
      meetingLink: "https://meet.google.com/xyz-uvwx-yz",
    },
  ]

  const stats = {
    openPositions: openPositions.length,
    totalApplications: openPositions.reduce((sum, pos) => sum + pos.applications, 0),
    scheduledInterviews: interviews.length,
    avgTimeToHire: 21,
  }

  const handleEditPosition = (position: any) => {
    console.log("[v0] Editing position:", position.title)
    setSelectedPosition(position)
    setIsEditPositionOpen(true)
  }

  const handleViewCandidates = (position: any) => {
    console.log("[v0] Viewing candidates for:", position.title)
    setSelectedPosition(position)
    setIsCandidatesOpen(true)
  }

  const handleRescheduleInterview = (interview: any) => {
    console.log("[v0] Rescheduling interview for:", interview.candidate)
    setSelectedInterview(interview)
    setIsRescheduleOpen(true)
  }

  const handleJoinInterview = (interview: any) => {
    console.log("[v0] Joining interview with:", interview.candidate)
    window.open(interview.meetingLink, "_blank")
  }

  const handleSavePosition = () => {
    console.log("[v0] Saving position changes")
    setIsEditPositionOpen(false)
    alert("Posición actualizada exitosamente")
  }

  const handleConfirmReschedule = () => {
    console.log("[v0] Confirming interview reschedule")
    setIsRescheduleOpen(false)
    alert("Entrevista reprogramada exitosamente")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reclutamiento</h1>
            <p className="text-muted-foreground">Gestiona posiciones abiertas y candidatos</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nueva Posición
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posiciones Abiertas</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openPositions}</div>
              <p className="text-xs text-muted-foreground">Activas en el portal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">Candidatos interesados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entrevistas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledInterviews}</div>
              <p className="text-xs text-muted-foreground">Programadas esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgTimeToHire} días</div>
              <p className="text-xs text-muted-foreground">Para contratar</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="positions">Posiciones Abiertas</TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="interviews">Entrevistas</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posiciones Abiertas</CardTitle>
                <CardDescription>Vacantes activas y en proceso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {openPositions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{position.title}</h3>
                          <Badge variant={position.status === "active" ? "default" : "secondary"}>
                            {position.status === "active" ? "Activa" : "Pausada"}
                          </Badge>
                          <Badge
                            variant={
                              position.priority === "high"
                                ? "destructive"
                                : position.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {position.priority === "high" ? "Alta" : position.priority === "medium" ? "Media" : "Baja"}{" "}
                            prioridad
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {position.department} • {position.location} • {position.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Publicada: {position.posted} • {position.applications} aplicaciones
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewCandidates(position)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Candidatos
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditPosition(position)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Candidatos en Proceso</CardTitle>
                <CardDescription>Candidatos activos en diferentes etapas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.position}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">Etapa: {candidate.stage}</span>
                            <span className="text-xs text-muted-foreground">Aplicó: {candidate.appliedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs">Puntuación:</span>
                            <Progress value={candidate.score} className="w-20 h-2" />
                            <span className="text-xs font-medium">{candidate.score}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">{candidate.nextStep}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Aprobar
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="mr-1 h-3 w-3" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Entrevistas Programadas</CardTitle>
                <CardDescription>Próximas entrevistas con candidatos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{interview.candidate}</h3>
                        <p className="text-sm text-muted-foreground">{interview.position}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {interview.date} - {interview.time}
                          </span>
                          <span>Entrevistador: {interview.interviewer}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{interview.type}</Badge>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handleRescheduleInterview(interview)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Reprogramar
                          </Button>
                          <Button size="sm" onClick={() => handleJoinInterview(interview)}>
                            <Video className="mr-2 h-4 w-4" />
                            Unirse
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditPositionOpen} onOpenChange={setIsEditPositionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Posición</DialogTitle>
              <DialogDescription>Modifica los detalles de la posición</DialogDescription>
            </DialogHeader>
            {selectedPosition && (
              <div className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input defaultValue={selectedPosition.title} />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Input defaultValue={selectedPosition.description} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditPositionOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePosition}>Guardar Cambios</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reprogramar Entrevista</DialogTitle>
              <DialogDescription>Selecciona nueva fecha y hora para la entrevista</DialogDescription>
            </DialogHeader>
            {selectedInterview && (
              <div className="space-y-4">
                <div>
                  <Label>Candidato</Label>
                  <Input value={selectedInterview.candidate} disabled />
                </div>
                <div>
                  <Label>Nueva Fecha</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Nueva Hora</Label>
                  <Input type="time" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmReschedule}>Reprogramar</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
