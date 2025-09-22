"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Mail, Phone, MapPin, Calendar, Eye, MessageCircle } from "lucide-react"
import { getInitials } from "@/lib/utils"

export default function ManagerTeamPage() {
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const teamMembers = [
    {
      id: 1,
      name: "Juan Pérez",
      position: "Ejecutivo de Ventas",
      email: "juan.perez@company.com",
      phone: "+57 300 123 4567",
      status: "active",
      avatar: "/professional-man-employee.jpg",
      startDate: "2023-01-15",
      location: "Bogotá",
      performance: 95,
      department: "Ventas",
      salary: "$4,500,000",
      projects: ["Proyecto Alpha", "Cliente Premium"],
      skills: ["Ventas", "Negociación", "CRM"],
      lastActivity: "Hace 2 horas",
    },
    {
      id: 2,
      name: "María García",
      position: "Analista de Marketing",
      email: "maria.garcia@company.com",
      phone: "+57 301 234 5678",
      status: "active",
      avatar: "/professional-woman-diverse.png",
      startDate: "2023-03-20",
      location: "Medellín",
      performance: 88,
      department: "Marketing",
      salary: "$3,800,000",
      projects: ["Campaña Q1", "Social Media"],
      skills: ["Marketing Digital", "Analytics", "SEO"],
      lastActivity: "Hace 1 hora",
    },
    {
      id: 3,
      name: "Carlos López",
      position: "Coordinador de Ventas",
      email: "carlos.lopez@company.com",
      phone: "+57 302 345 6789",
      status: "vacation",
      avatar: "/professional-man.jpg",
      startDate: "2022-11-10",
      location: "Cali",
      performance: 92,
      department: "Ventas",
      salary: "$4,200,000",
      projects: ["Expansión Regional", "Training Program"],
      skills: ["Liderazgo", "Ventas", "Capacitación"],
      lastActivity: "Hace 3 días",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge>Activo</Badge>
      case "vacation":
        return <Badge variant="secondary">Vacaciones</Badge>
      case "sick":
        return <Badge variant="destructive">Incapacidad</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewProfile = (member: any) => {
    console.log("[v0] Viewing profile for:", member.name)
    setSelectedMember(member)
    setIsProfileOpen(true)
  }

  const handleContact = (member: any) => {
    console.log("[v0] Contacting:", member.name)
    // Open email client or messaging system
    window.location.href = `mailto:${member.email}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Equipo</h1>
          <p className="text-muted-foreground">Gestiona y supervisa a los miembros de tu equipo</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">En tu equipo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter((m) => m.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Trabajando hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendimiento Promedio</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Este trimestre</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros del Equipo</CardTitle>
            <CardDescription>Información detallada de cada miembro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.position}</p>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{member.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Desde {member.startDate}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rendimiento</span>
                        <span className="text-sm font-bold text-green-600">{member.performance}%</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewProfile(member)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleContact(member)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Perfil del Empleado</DialogTitle>
              <DialogDescription>Información detallada de {selectedMember?.name}</DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedMember.avatar || "/placeholder.svg"} alt={selectedMember.name} />
                    <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                    <p className="text-muted-foreground">{selectedMember.position}</p>
                    {getStatusBadge(selectedMember.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Email:</strong> {selectedMember.email}
                      </div>
                      <div>
                        <strong>Teléfono:</strong> {selectedMember.phone}
                      </div>
                      <div>
                        <strong>Ubicación:</strong> {selectedMember.location}
                      </div>
                      <div>
                        <strong>Fecha de ingreso:</strong> {selectedMember.startDate}
                      </div>
                      <div>
                        <strong>Departamento:</strong> {selectedMember.department}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Información Profesional</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Salario:</strong> {selectedMember.salary}
                      </div>
                      <div>
                        <strong>Rendimiento:</strong> {selectedMember.performance}%
                      </div>
                      <div>
                        <strong>Última actividad:</strong> {selectedMember.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Proyectos Actuales</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projects?.map((project: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => handleContact(selectedMember)}>Contactar</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
