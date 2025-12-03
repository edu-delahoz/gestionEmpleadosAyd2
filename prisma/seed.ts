import {
  PrismaClient,
  Role,
  EmploymentStatus,
  MovementType,
  PayrollStatus,
  JobOpeningStatus,
  JobPriority,
  EmployeeRequestType,
  EmployeeRequestStatus,
} from "@prisma/client"
import bcrypt from "bcryptjs"


const prisma = new PrismaClient()

async function main() {
  // Upsert base departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: "Recursos Humanos" },
      update: {},
      create: { name: "Recursos Humanos", description: "Operaciones de talento y cultura" },
    }),
    prisma.department.upsert({
      where: { name: "Finanzas" },
      update: {},
      create: { name: "Finanzas", description: "Control de nómina y presupuestos" },
    }),
    prisma.department.upsert({
      where: { name: "Tecnología" },
      update: {},
      create: { name: "Tecnología", description: "Producto y plataformas" },
    }),
  ])

  // Seed users with basic roles (passwords handled by NextAuth providers)
  const adminPassword = await bcrypt.hash("Admin123*", 10)
  const hrPassword = await bcrypt.hash("Rh123*", 10)
  const managerPassword = await bcrypt.hash("Manager123*", 10)
  const employeePassword = await bcrypt.hash("Employee123*", 10)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@udea.edu.co" },
    update: {},
    create: {
      name: "Admin RH",
      email: "admin@udea.edu.co",
      role: Role.ADMIN,
      passwordHash: adminPassword,
    },
  })

  const hrUser = await prisma.user.upsert({
    where: { email: "rrhh@udea.edu.co" },
    update: {},
    create: {
      name: "Coordinador RH",
      email: "rrhh@udea.edu.co",
      role: Role.HR,
      passwordHash: hrPassword,
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: "manager@udea.edu.co" },
    update: {},
    create: {
      name: "Líder Comercial",
      email: "manager@udea.edu.co",
      role: Role.MANAGER,
      passwordHash: managerPassword,
    },
  })

  const employeeUser = await prisma.user.upsert({
    where: { email: "employee@udea.edu.co" },
    update: {},
    create: {
      name: "Ejecutivo Ventas",
      email: "employee@udea.edu.co",
      role: Role.EMPLOYEE,
      passwordHash: employeePassword,
    },
  })

  // Profiles linked to seeded users
  const [hrDepartment, financeDepartment, techDepartment] = departments

  const adminProfile = await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      employeeCode: "EMP-001",
      position: "Administrador General",
      departmentId: hrDepartment.id,
      status: EmploymentStatus.ACTIVE,
    },
  })

  const hrProfile = await prisma.profile.upsert({
    where: { userId: hrUser.id },
    update: {},
    create: {
      userId: hrUser.id,
      employeeCode: "EMP-002",
      position: "Coordinador RH",
      departmentId: hrDepartment.id,
      status: EmploymentStatus.ACTIVE,
    },
  })

  const managerProfile = await prisma.profile.upsert({
    where: { userId: managerUser.id },
    update: {},
    create: {
      userId: managerUser.id,
      employeeCode: "EMP-003",
      position: "Gerente Comercial",
      departmentId: hrDepartment.id,
      status: EmploymentStatus.ACTIVE,
    },
  })

  const employeeProfile = await prisma.profile.upsert({
    where: { userId: employeeUser.id },
    update: {},
    create: {
      userId: employeeUser.id,
      employeeCode: "EMP-004",
      position: "Ejecutivo de Ventas",
      departmentId: hrDepartment.id,
      status: EmploymentStatus.ACTIVE,
    },
  })

  // Master catalog examples
  const talentPool = await prisma.masterRecord.upsert({
    where: { slug: "talent-pool" },
    update: {},
    create: {
      slug: "talent-pool",
      name: "Bolsa de Talento",
      description: "Candidatos preseleccionados disponibles",
      departmentId: hrDepartment.id,
      initialBalance: 25,
      currentBalance: 25,
      createdById: adminUser.id,
    },
  })

  const onboardingQuota = await prisma.masterRecord.upsert({
    where: { slug: "onboarding-quota" },
    update: {},
    create: {
      slug: "onboarding-quota",
      name: "Cupos de Ingreso",
      description: "Capacidad mensual de onboarding",
      departmentId: hrDepartment.id,
      initialBalance: 10,
      currentBalance: 8,
      createdById: hrUser.id,
    },
  })

  // Starter inventory movements
  await prisma.inventoryMovement.createMany({
    data: [
      {
        masterId: talentPool.id,
        performedById: hrUser.id,
        movementType: MovementType.ENTRY,
        quantity: 5,
        notes: "Ingreso de nuevos candidatos de Universidad",
      },
      {
        masterId: onboardingQuota.id,
        performedById: adminUser.id,
        movementType: MovementType.EXIT,
        quantity: 2,
        notes: "Asignación de cupos a equipo de Tecnología",
      },
    ],
    skipDuplicates: true,
  })

  // Seed payroll cycle stub
  await prisma.payrollCycle.upsert({
    where: { period: "2024-01" },
    update: {},
    create: {
      period: "2024-01",
      status: PayrollStatus.PROCESSED,
      totalGross: 100000000,
      totalDeductions: 15000000,
      totalNet: 85000000,
      processedById: adminUser.id,
    },
  })

  const jobOpeningsData = [
    {
      id: "opening-fullstack",
      title: "Desarrollador Full Stack",
      departmentId: techDepartment.id,
      status: JobOpeningStatus.OPEN,
      priority: JobPriority.HIGH,
      location: "Medellín",
      employmentType: "Tiempo completo",
      openings: 2,
      filled: 1,
      applications: 18,
    },
    {
      id: "opening-analista-datos",
      title: "Analista de Datos",
      departmentId: techDepartment.id,
      status: JobOpeningStatus.OPEN,
      priority: JobPriority.MEDIUM,
      location: "Remoto",
      employmentType: "Tiempo completo",
      openings: 1,
      filled: 0,
      applications: 12,
    },
    {
      id: "opening-finanzas-jr",
      title: "Analista Financiero Junior",
      departmentId: financeDepartment.id,
      status: JobOpeningStatus.PAUSED,
      priority: JobPriority.LOW,
      location: "Bogotá",
      employmentType: "Híbrido",
      openings: 1,
      filled: 0,
      applications: 7,
    },
  ] as const

  for (const opening of jobOpeningsData) {
    const { id, ...rest } = opening
    await prisma.jobOpening.upsert({
      where: { id },
      update: rest,
      create: { id, ...rest },
    })
  }

  const employeeRequestsData = [
    {
      id: "request-vacaciones-emp",
      profileId: employeeProfile.id,
      departmentId: hrDepartment.id,
      type: EmployeeRequestType.VACATION,
      status: EmployeeRequestStatus.PENDING,
      reason: "Vacaciones programadas",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-05"),
      days: 5,
    },
    {
      id: "request-remote-manager",
      profileId: managerProfile.id,
      departmentId: hrDepartment.id,
      type: EmployeeRequestType.REMOTE,
      status: EmployeeRequestStatus.APPROVED,
      reason: "Trabajo remoto durante visita comercial",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-19"),
      days: 5,
    },
    {
      id: "request-capacitacion-hr",
      profileId: hrProfile.id,
      departmentId: hrDepartment.id,
      type: EmployeeRequestType.TRAINING,
      status: EmployeeRequestStatus.PENDING,
      reason: "Certificación en gestión del cambio",
      startDate: new Date("2024-02-10"),
      endDate: new Date("2024-02-12"),
      days: 3,
    },
  ] as const

  for (const request of employeeRequestsData) {
    const { id, ...rest } = request
    await prisma.employeeRequest.upsert({
      where: { id },
      update: rest,
      create: { id, ...rest },
    })
  }

  const satisfactionSurveys = [
    {
      id: "survey-admin",
      profileId: adminProfile.id,
      score: 5,
      comment: "Excelente clima laboral",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: "survey-hr",
      profileId: hrProfile.id,
      score: 4,
      comment: "Carga alta pero manejable",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      id: "survey-employee",
      profileId: employeeProfile.id,
      score: 3,
      comment: "Buscando crecimiento profesional",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
  ] as const

  for (const survey of satisfactionSurveys) {
    const { id, ...rest } = survey
    await prisma.satisfactionSurvey.upsert({
      where: { id },
      update: rest,
      create: { id, ...rest },
    })
  }

  console.log("Seed completed")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
