"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, CheckCircle, Shield } from "lucide-react"
import { getDashboardRoute } from "@/lib/routes"

const departments = ["Ventas", "Marketing", "Finanzas", "Recursos Humanos", "Tecnología", "Operaciones"]
const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "hr", label: "Recursos Humanos" },
  { value: "manager", label: "Gerente" },
  { value: "finance", label: "Finanzas" },
  { value: "employee", label: "Empleado" },
  { value: "candidate", label: "Candidato" },
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    role: "employee",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<{ email: string; role: string } | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.role) {
      router.push(getDashboardRoute(session.user.role))
    }
  }, [session, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          position: formData.position,
          role: formData.role,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "No pudimos crear la cuenta")
      }

      setCreatedUser({ email: data.user.email, role: data.user.role })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  if (createdUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md text-center space-y-4">
          <CardContent className="pt-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">¡Cuenta creada!</h2>
            <p className="text-muted-foreground">
              {createdUser.email} fue registrada con rol <span className="font-semibold">{createdUser.role}</span>. Inicia
              sesión con tu correo y contraseña para revisar el dashboard.
            </p>
            <Button onClick={() => router.push("/login")}>Ir al inicio de sesión</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Crear cuenta de prueba</CardTitle>
          <CardDescription>Configura el rol y la contraseña para evaluar cada escenario.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo / puesto</Label>
              <Input
                id="position"
                placeholder="Ej. Líder de Producto"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full flex items-center gap-2" disabled={loading}>
              <Shield className="h-4 w-4" />
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes acceso?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
