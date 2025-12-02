import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { Role, EmploymentStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"

const allowedRoles = ["candidate", "employee", "manager", "hr", "finance", "admin"] as const

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, department, position, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const normalizedRole = (role?.toLowerCase() ?? "candidate") as (typeof allowedRoles)[number]
    if (!allowedRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 })
    }

    let departmentRecord = null
    if (department) {
      departmentRecord = await prisma.department.upsert({
        where: { name: department },
        update: {},
        create: {
          name: department,
          description: `${department} (creado desde formulario)`,
        },
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: normalizedRole.toUpperCase() as Role,
        passwordHash,
        profile: {
          create: {
            employeeCode: `EMP-${Math.floor(Math.random() * 9000 + 1000)}`,
            position: position || "Sin asignar",
            departmentId: departmentRecord?.id,
            status: EmploymentStatus.ACTIVE,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(
      {
        message: "Cuenta creada exitosamente. Ya puedes iniciar sesión con tus credenciales.",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
