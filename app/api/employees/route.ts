import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"
import { EmploymentStatus, Prisma, Role } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/api/session"
import { buildErrorResponse } from "@/lib/api/errors"
import { employeeInclude, serializeEmployee } from "@/lib/api/employees"

const createEmployeeSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("El correo no es válido"),
  position: z.string().min(2, "La posición es obligatoria"),
  departmentId: z.string().min(1, "Selecciona un departamento"),
  startDate: z.string().optional().nullable(),
  salary: z.coerce.number().nonnegative("El salario debe ser positivo").optional().nullable(),
  role: z.enum(["employee", "manager", "finance", "hr", "admin"]).optional().default("employee"),
})

const MANAGE_ROLES = new Set(["hr", "admin"])
const LIST_ROLES = new Set(["hr", "admin"])

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!LIST_ROLES.has(user.role)) {
    return NextResponse.json({ error: "No tienes permisos para ver empleados" }, { status: 403 })
  }

  try {
    const [users, departments] = await Promise.all([
      prisma.user.findMany({
        where: { profile: { isNot: null } },
        include: employeeInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.department.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ])

    return NextResponse.json({
      employees: users.map(serializeEmployee),
      departments: departments.map((department) => ({ id: department.id, name: department.name })),
    })
  } catch (error) {
    return buildErrorResponse(error)
  }
}

async function generateEmployeeCode(attempt = 0): Promise<string> {
  if (attempt > 5) {
    return `EMP-${Date.now().toString().slice(-4)}`
  }

  const candidate = `EMP-${Math.floor(1000 + Math.random() * 9000)}`
  const existing = await prisma.profile.findFirst({
    where: { employeeCode: candidate },
    select: { id: true },
  })

  if (existing) {
    return generateEmployeeCode(attempt + 1)
  }

  return candidate
}

function generateTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#"
  let password = ""
  for (let i = 0; i < 10; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length)
    password += alphabet[index]
  }
  return password
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!MANAGE_ROLES.has(user.role)) {
    return NextResponse.json({ error: "No tienes permisos para crear empleados" }, { status: 403 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = createEmployeeSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const data = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 })
    }

    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
      select: { id: true },
    })

    if (!department) {
      return NextResponse.json({ error: "Departamento no encontrado" }, { status: 404 })
    }

    const employeeCode = await generateEmployeeCode()
    const startDate = data.startDate ? new Date(data.startDate) : new Date()
    const password = generateTemporaryPassword()
    const passwordHash = await bcrypt.hash(password, 10)
    const role = (data.role?.toUpperCase() as Role) ?? Role.EMPLOYEE

    const newEmployee = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role,
        passwordHash,
        profile: {
          create: {
            employeeCode,
            position: data.position,
            departmentId: data.departmentId,
            status: EmploymentStatus.ACTIVE,
            startDate,
            salary: data.salary != null ? new Prisma.Decimal(data.salary) : null,
          },
        },
      },
      include: {
        profile: {
          include: {
            department: { select: { id: true, name: true } },
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Empleado creado exitosamente",
        employee: {
          id: newEmployee.id,
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role.toLowerCase(),
        },
        profile: {
          id: newEmployee.profile?.id,
          employeeCode: newEmployee.profile?.employeeCode,
          department: newEmployee.profile?.department?.name ?? null,
          position: newEmployee.profile?.position ?? null,
          startDate: newEmployee.profile?.startDate?.toISOString() ?? null,
        },
        temporaryPassword: password,
      },
      { status: 201 },
    )
  } catch (error) {
    return buildErrorResponse(error)
  }
}
