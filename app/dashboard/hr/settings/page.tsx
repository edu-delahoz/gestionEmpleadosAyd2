"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Bell, Calendar, FileText, Save } from "lucide-react"
import { toast } from "sonner"

export default function HRSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "Mi Empresa S.A.S",
    companyEmail: "rh@miempresa.com",
    timezone: "America/Bogota",
    language: "es",

    // HR Policies
    vacationDays: 15,
    sickDays: 5,
    workingHours: 8,
    probationPeriod: 90,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    slackIntegration: true,

    // Security
    passwordExpiry: 90,
    twoFactorAuth: true,
    sessionTimeout: 30,

    // Attendance
    flexibleHours: true,
    remoteWork: true,
    overtimeApproval: true,
  })

  const handleSave = () => {
    toast.success("Configuración guardada exitosamente")
  }

  const handleReset = () => {
    toast.info("Configuración restablecida a valores por defecto")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
            <p className="text-muted-foreground">Administra las configuraciones generales y políticas de RH</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Restablecer
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="policies">Políticas</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>Información básica de la empresa y configuraciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email Corporativo</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                        <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma del Sistema</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Políticas de Recursos Humanos
                </CardTitle>
                <CardDescription>Configuración de políticas y beneficios para empleados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vacationDays">Días de Vacaciones Anuales</Label>
                    <Input
                      id="vacationDays"
                      type="number"
                      value={settings.vacationDays}
                      onChange={(e) => setSettings({ ...settings, vacationDays: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sickDays">Días de Incapacidad</Label>
                    <Input
                      id="sickDays"
                      type="number"
                      value={settings.sickDays}
                      onChange={(e) => setSettings({ ...settings, sickDays: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Horas de Trabajo Diarias</Label>
                    <Input
                      id="workingHours"
                      type="number"
                      value={settings.workingHours}
                      onChange={(e) => setSettings({ ...settings, workingHours: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="probationPeriod">Período de Prueba (días)</Label>
                    <Input
                      id="probationPeriod"
                      type="number"
                      value={settings.probationPeriod}
                      onChange={(e) => setSettings({ ...settings, probationPeriod: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPolicies">Políticas de la Empresa</Label>
                  <Textarea
                    id="companyPolicies"
                    placeholder="Describe las políticas generales de la empresa..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>Gestiona cómo y cuándo recibir notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones importantes por correo electrónico
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-muted-foreground">Recibir alertas urgentes por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Integración con Slack</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificaciones al canal de Slack del equipo</p>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => setSettings({ ...settings, slackIntegration: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>Políticas de seguridad y acceso al sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({ ...settings, passwordExpiry: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Requerir verificación adicional para el acceso</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Configuración de Asistencia
                </CardTitle>
                <CardDescription>Políticas de horarios y asistencia laboral</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Horarios Flexibles</Label>
                    <p className="text-sm text-muted-foreground">Permitir horarios de entrada y salida flexibles</p>
                  </div>
                  <Switch
                    checked={settings.flexibleHours}
                    onCheckedChange={(checked) => setSettings({ ...settings, flexibleHours: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trabajo Remoto</Label>
                    <p className="text-sm text-muted-foreground">Habilitar opciones de trabajo desde casa</p>
                  </div>
                  <Switch
                    checked={settings.remoteWork}
                    onCheckedChange={(checked) => setSettings({ ...settings, remoteWork: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aprobación de Horas Extra</Label>
                    <p className="text-sm text-muted-foreground">Requerir aprobación previa para horas extra</p>
                  </div>
                  <Switch
                    checked={settings.overtimeApproval}
                    onCheckedChange={(checked) => setSettings({ ...settings, overtimeApproval: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
