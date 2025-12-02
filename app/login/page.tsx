"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Lock, LogIn } from "lucide-react"
import { getDashboardRoute } from "@/lib/routes"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role) {
      router.push(getDashboardRoute(session.user.role))
    }
  }, [session, router])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.")
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard/employee" })
    setLoading(false)
  }

  const isAuthenticating = loading || status === "loading"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Portal RH</CardTitle>
          <CardDescription>Inicia sesión con Google o solicita un enlace seguro.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full flex items-center gap-2" variant="outline" onClick={handleGoogleSignIn} disabled={isAuthenticating}>
            <LogIn className="h-4 w-4" />
            Continuar con Google
          </Button>

          <div className="text-center text-xs uppercase tracking-wide text-muted-foreground">o usa tu correo</div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full flex items-center gap-2" disabled={isAuthenticating}>
              <Lock className="h-4 w-4" />
              {isAuthenticating ? "Validando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Solicita acceso aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
