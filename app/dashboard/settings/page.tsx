"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Bell, Shield, Palette, Database, LinkIcon } from "lucide-react"
import Link from "next/link"

const settingsCategories = [
  {
    title: "Notificaciones",
    description: "Configura cómo y cuándo recibir notificaciones",
    icon: Bell,
    href: "/dashboard/settings/notifications",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Integraciones",
    description: "Conecta y configura servicios externos",
    icon: LinkIcon,
    href: "/dashboard/settings/integrations",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Seguridad",
    description: "Gestiona la seguridad de tu cuenta",
    icon: Shield,
    href: "/dashboard/settings/security",
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Apariencia",
    description: "Personaliza la interfaz y tema",
    icon: Palette,
    href: "/dashboard/settings/appearance",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Datos",
    description: "Exportar y gestionar tus datos",
    icon: Database,
    href: "/dashboard/settings/data",
    color: "bg-orange-100 text-orange-600",
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia en el portal</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.href} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={category.href}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
