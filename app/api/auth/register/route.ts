import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, department, position } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    // In a real app, you'd:
    // 1. Check if email already exists
    // 2. Hash the password
    // 3. Save to database
    // 4. Send verification email

    // Mock successful registration
    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: {
        id: `new-${Date.now()}`,
        name,
        email,
        department,
        position,
        role: "candidate", // New users start as candidates
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
