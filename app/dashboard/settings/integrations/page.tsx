"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Shield, Zap, Calendar, Mail, CreditCard, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Integration {
  id: string
  name: string
  description: string
  category: "database" | "auth" | "communication" | "productivity" | "finance"
  icon: any
  status: "connected" | "disconnected" | "error"
  enabled: boolean
  config?: Record<string, any>
}

const mockIntegrations: Integration[] = [
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Sincronización de usuarios y calendario",
    category: "productivity",
    icon: Calendar,
    status: "connected",
    enabled: true,
    config: { domain: "empresa.com", syncCalendar: true },
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    description: "Integración con Active Directory y Teams",
    category: "productivity",
    icon: Cloud,
    status: "disconnected",
    enabled: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Notificaciones y comunicación en tiempo real",
    category: "communication",
    icon: Zap,
    status: "connected",
    enabled: true,
    config: { webhook: "https://hooks.slack.com/...", channel: "#rrhh" },
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    description: "Notificaciones por WhatsApp",
    category: "communication",
    icon: Mail,
    status: "error",
    enabled: false,
  },
  {
    id: "banco-popular",
    name: "Banco Popular",
    description: "Procesamiento de nómina y pagos",
    category: "finance",
    icon: CreditCard,
    status: "connected",
    enabled: true,
    config: { accountNumber: "****1234", apiKey: "****" },
  },
  {
    id: "sso-provider",
    name: "SSO Provider",
    description: "Autenticación única empresarial",
    category: "auth",
    icon: Shield,
    status: "connected",
    enabled: true,
    config: { provider: "SAML", domain: "empresa.com" },
  },
]

const categoryLabels = {
  database: "Base de Datos",
  auth: "Autenticación",
  communication: "Comunicación",
  productivity: "Productividad",
  finance: "Finanzas",
}

const statusColors = {
  connected: "bg-green-100 text-green-800 border-green-200",
  disconnected: "bg-gray-100 text-gray-800 border-gray-200",
  error: "bg-red-100 text-red-800 border-red-200",
}

const statusIcons = {
  connected: CheckCircle,
  disconnected: AlertCircle,
  error: AlertCircle,
}

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration,
      ),
    )

    const integration = integrations.find((i) => i.id === id)
    toast({
      title: integration?.enabled ? "Integración deshabilitada" : "Integración habilitada",
      description: `${integration?.name} ha sido ${integration?.enabled ? "deshabilitada" : "habilitada"}.`,
    })
  }

  const connectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, status: "connected" as const, enabled: true } : integration,
      ),
    )

    const integration = integrations.find((i) => i.id === id)
    toast({
      title: "Integración conectada",
      description: `${integration?.name} se ha conectado exitosamente.`,
    })
  }

  const filteredIntegrations = integrations.filter(
    (integration) => activeCategory === "all" || integration.category === activeCategory,
  )

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integraciones</h1>
        <p className="text-gray-600 mt-1">Conecta y configura servicios externos para automatizar procesos</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {categoryLabels[category]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredIntegrations.map((integration) => {
              const IconComponent = integration.icon
              const StatusIcon = statusIcons[integration.status]

              return (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription className="mt-1">{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[integration.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {integration.status === "connected"
                            ? "Conectado"
                            : integration.status === "error"
                              ? "Error"
                              : "Desconectado"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {integration.config && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Configuración</Label>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          {Object.entries(integration.config).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                          disabled={integration.status === "disconnected"}
                        />
                        <Label className="text-sm">{integration.enabled ? "Habilitado" : "Deshabilitado"}</Label>
                      </div>

                      <div className="flex space-x-2">
                        {integration.status === "disconnected" && (
                          <Button size="sm" onClick={() => connectIntegration(integration.id)}>
                            Conectar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Seguridad</CardTitle>
          <CardDescription>Configuraciones globales de seguridad para integraciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="encryption">Nivel de cifrado</Label>
              <Input id="encryption" value="AES-256" readOnly />
            </div>
            <div>
              <Label htmlFor="retention">Retención de datos (días)</Label>
              <Input id="retention" value="2555" type="number" />
            </div>
            <div>
              <Label htmlFor="backup-frequency">Frecuencia de backup</Label>
              <Input id="backup-frequency" value="Diario a las 2:00 AM" readOnly />
            </div>
            <div>
              <Label htmlFor="access-logs">Logs de acceso</Label>
              <Input id="access-logs" value="Habilitado - 90 días" readOnly />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button>Guardar Configuración de Seguridad</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
