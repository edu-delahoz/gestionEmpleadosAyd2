import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/mocks/data"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, any password works
    if (!password) {
      return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 })
    }

    // Return user data (in real app, you'd return a JWT token)
    return NextResponse.json({
      user,
      token: `mock-jwt-token-${user.id}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
