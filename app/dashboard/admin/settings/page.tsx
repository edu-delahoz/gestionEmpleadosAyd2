"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Shield, Database, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Administra la configuración global del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>Configuraciones básicas del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input id="company-name" defaultValue="Mi Empresa S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Input id="timezone" defaultValue="America/Bogota" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma del Sistema</Label>
                <Input id="language" defaultValue="Español" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>Configuraciones de seguridad y acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">Requerir 2FA para administradores</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Bloqueo por Intentos Fallidos</Label>
                  <p className="text-sm text-muted-foreground">Bloquear después de 5 intentos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              <Button>Actualizar Seguridad</Button>
            </CardContent>
          </Card>

          {/* Database Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración de Base de Datos
              </CardTitle>
              <CardDescription>Configuraciones de respaldo y mantenimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Respaldo Automático</Label>
                  <p className="text-sm text-muted-foreground">Respaldo diario a las 2:00 AM</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="backup-retention">Retención de Respaldos (días)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Crear Respaldo</Button>
                <Button variant="outline">Restaurar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Configuraciones de alertas y notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar alertas críticas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones en tiempo real</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email de Administrador</Label>
                <Input id="admin-email" type="email" defaultValue="admin@empresa.com" />
              </div>
              <Button>Guardar Notificaciones</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
