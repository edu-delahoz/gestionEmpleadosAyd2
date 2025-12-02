import { PrismaClient, Role, EmploymentStatus, MovementType, PayrollStatus } from "@prisma/client"

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
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@udea.edu.co" },
    update: {},
    create: {
      name: "Admin RH",
      email: "admin@udea.edu.co",
      role: Role.ADMIN,
    },
  })

  const hrUser = await prisma.user.upsert({
    where: { email: "rrhh@udea.edu.co" },
    update: {},
    create: {
      name: "Coordinador RH",
      email: "rrhh@udea.edu.co",
      role: Role.HR,
    },
  })

  // Profiles linked to seeded users
  const [hrDepartment] = departments

  await prisma.profile.upsert({
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

  await prisma.profile.upsert({
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
