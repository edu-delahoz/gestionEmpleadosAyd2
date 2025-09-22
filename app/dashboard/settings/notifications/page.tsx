"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Mail, MessageSquare, Slack, Send, TestTube } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettings {
  email: boolean
  push: boolean
  whatsapp: boolean
  slack: boolean
}

interface CategorySettings {
  payroll: NotificationSettings
  attendance: NotificationSettings
  requests: NotificationSettings
  system: NotificationSettings
}

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<CategorySettings>({
    payroll: { email: true, push: true, whatsapp: false, slack: true },
    attendance: { email: true, push: true, whatsapp: true, slack: false },
    requests: { email: true, push: true, whatsapp: false, slack: true },
    system: { email: false, push: true, whatsapp: false, slack: false },
  })

  const [integrations, setIntegrations] = useState({
    email: { enabled: true, address: "usuario@empresa.com" },
    whatsapp: { enabled: false, phone: "+57 300 123 4567" },
    slack: { enabled: true, webhook: "https://hooks.slack.com/services/..." },
  })

  const [testMessage, setTestMessage] = useState({
    channel: "email",
    subject: "Prueba de notificación",
    message: "Este es un mensaje de prueba del sistema de notificaciones.",
  })

  const updateCategorySetting = (
    category: keyof CategorySettings,
    channel: keyof NotificationSettings,
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value,
      },
    }))
  }

  const saveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Las preferencias de notificación han sido actualizadas.",
    })
  }

  const sendTestNotification = () => {
    toast({
      title: "Notificación de prueba enviada",
      description: `Mensaje enviado por ${testMessage.channel}`,
    })
  }

  const categories = [
    { key: "payroll", label: "Nómina y Beneficios", description: "Procesamiento de nómina, beneficios y pagos" },
    { key: "attendance", label: "Asistencia", description: "Registros de entrada/salida y turnos" },
    { key: "requests", label: "Solicitudes", description: "Vacaciones, permisos y aprobaciones" },
    { key: "system", label: "Sistema", description: "Actualizaciones y mantenimiento del sistema" },
  ]

  const channels = [
    { key: "email", label: "Email", icon: Mail },
    { key: "push", label: "Push", icon: Bell },
    { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { key: "slack", label: "Slack", icon: Slack },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Notificaciones</h1>
        <p className="text-gray-600 mt-1">Personaliza cómo y cuándo recibir notificaciones</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="test">Pruebas</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias por Categoría</CardTitle>
              <CardDescription>Configura qué canales usar para cada tipo de notificación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category) => (
                <div key={category.key} className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {channels.map((channel) => {
                      const IconComponent = channel.icon
                      return (
                        <div key={channel.key} className="flex items-center space-x-3">
                          <Switch
                            id={`${category.key}-${channel.key}`}
                            checked={
                              settings[category.key as keyof CategorySettings][
                                channel.key as keyof NotificationSettings
                              ]
                            }
                            onCheckedChange={(checked) =>
                              updateCategorySetting(
                                category.key as keyof CategorySettings,
                                channel.key as keyof NotificationSettings,
                                checked,
                              )
                            }
                          />
                          <Label
                            htmlFor={`${category.key}-${channel.key}`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span>{channel.label}</span>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={saveSettings}>Guardar Configuración</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuración de Email
                </CardTitle>
                <CardDescription>Configura las notificaciones por correo electrónico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar notificaciones por email</Label>
                  <Switch
                    checked={integrations.email.enabled}
                    onCheckedChange={(checked) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email-address">Dirección de correo</Label>
                  <Input
                    id="email-address"
                    value={integrations.email.address}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        email: { ...prev.email, address: e.target.value },
                      }))
                    }
                    placeholder="usuario@empresa.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Configuración de WhatsApp
                </CardTitle>
                <CardDescription>Configura las notificaciones por WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar notificaciones por WhatsApp</Label>
                  <Switch
                    checked={integrations.whatsapp.enabled}
                    onCheckedChange={(checked) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, enabled: checked },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp-phone">Número de teléfono</Label>
                  <Input
                    id="whatsapp-phone"
                    value={integrations.whatsapp.phone}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, phone: e.target.value },
                      }))
                    }
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Slack className="h-5 w-5" />
                  Configuración de Slack
                </CardTitle>
                <CardDescription>Configura las notificaciones para Slack/Teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar notificaciones en Slack</Label>
                  <Switch
                    checked={integrations.slack.enabled}
                    onCheckedChange={(checked) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        slack: { ...prev.slack, enabled: checked },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    value={integrations.slack.webhook}
                    onChange={(e) =>
                      setIntegrations((prev) => ({
                        ...prev,
                        slack: { ...prev.slack, webhook: e.target.value },
                      }))
                    }
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Enviar Notificación de Prueba
              </CardTitle>
              <CardDescription>Prueba la configuración de notificaciones enviando un mensaje de prueba</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-channel">Canal de prueba</Label>
                <Select
                  value={testMessage.channel}
                  onValueChange={(value) => setTestMessage((prev) => ({ ...prev, channel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test-subject">Asunto</Label>
                <Input
                  id="test-subject"
                  value={testMessage.subject}
                  onChange={(e) => setTestMessage((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Asunto del mensaje de prueba"
                />
              </div>
              <div>
                <Label htmlFor="test-message">Mensaje</Label>
                <Textarea
                  id="test-message"
                  value={testMessage.message}
                  onChange={(e) => setTestMessage((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Contenido del mensaje de prueba"
                  rows={4}
                />
              </div>
              <Button onClick={sendTestNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificación de Prueba
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
