# Entrega 3 – Parte 1 (Esquema y entregables para Supabase)

## Resumen del trabajo realizado

1. **Modelo de datos con Prisma (`prisma/schema.prisma`)**
   - Incluye enums de negocio (roles, estados laborales, tipos de movimiento, estados de nómina, categorías de notificaciones e insights de IA).
   - Modelos para autenticación (User, Account, Session, VerificationToken) compatibles con NextAuth + Prisma Adapter.
   - Entidades funcionales:
     - `Profile`, `Department` para información laboral.
     - `MasterRecord` y `InventoryMovement` para catálogos y movimientos solicitados en la entrega.
     - `PayrollCycle` + `PayrollEntry` para cálculos de nómina.
     - `Notification` y `AIInsight` para el centro de alertas y la funcionalidad WOW con IA.
2. **Seed inicial (`prisma/seed.ts`)**
   - Prepara departamentos base (RH, Finanzas, Tecnología).
   - Usuarios de referencia con dominios `@udea.edu.co` (admin + RH) y sus perfiles.
   - Catálogos y movimientos de ejemplo, además de un ciclo de nómina procesado.
3. **Plantilla de variables de entorno (`.env.example`)**
   - Variables para conexión a Supabase/PostgreSQL, NextAuth, OAuth de Google (dominio `udea.edu.co`), SMTP opcional y API de IA.

## Información para el compañero (Supabase)

1. **Variables requeridas**
   - `DATABASE_URL`, `DIRECT_URL` (cadena de conexión de Supabase, formato `postgresql://...`).
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`.
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (OAuth con restricción de dominio `udea.edu.co`).
   - Opcional: `EMAIL_SERVER`, `EMAIL_FROM`, `OPENAI_API_KEY`.
2. **Pasos para levantar el esquema**
   1. Colocar las variables en un archivo `.env`.
   2. Ejecutar `npm install` (por si no están las dependencias de Prisma).
   3. Correr `npx prisma migrate dev --name init-schema` (o `prisma migrate deploy` en Supabase) para crear todas las tablas.
   4. (Opcional) Ejecutar `npx prisma db seed` para insertar los datos iniciales.
3. **Consideraciones de Supabase**
   - Crear proyecto con DB Postgres 15+.
   - Habilitar NextAuth adapter utilizando la tabla `Session` (ya parte del schema).
   - Configurar proveedor de Google en Supabase Auth/NextAuth permitiendo únicamente correos `@udea.edu.co`.
   - Definir políticas RLS:
     - `users`, `profiles`, `departments`: solo lectura para roles autenticados, escritura restringida a ADMIN/HR.
     - `master_records`, `inventory_movements`: lectura para HR/MANAGER/EMPLOYEE, escritura para HR/ADMIN.
     - `payroll_cycles/entries`: lectura HR/FINANCE/ADMIN; escritura HR/FINANCE.
     - `notifications`, `ai_insights`: lectura por `userId` correspondiente, escritura por servicios internos.
4. **Recursos extra**
   - Seeder provee datos para validar dashboards rápidamente (admin `admin@udea.edu.co`, rh `rrhh@udea.edu.co`).
   - `AIInsight` servirá para la funcionalidad WOW (endpoints podrán asociar insights a un `PayrollCycle` o `MasterRecord`).

> Con esto tu compañero puede crear la base en Supabase mientras continuamos con la integración en el código. Cualquier ajuste en modelos deberá pasar nuevamente por `prisma/schema.prisma`.
