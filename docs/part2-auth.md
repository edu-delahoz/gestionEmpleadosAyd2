# Entrega 3 – Parte 2 (Autenticación real)

## Cambios principales

1. **NextAuth + Prisma Adapter**
   - Instalé `next-auth`, `@auth/prisma-adapter` y `nodemailer`.
   - Creé `lib/prisma.ts` para compartir una única instancia de Prisma.
   - Reemplacé el antiguo `lib/auth.ts` por la configuración oficial de NextAuth con Adapter, session strategy `database` y proveedores de Google + Email (enlace mágico).
   - Exposé `authOptions` para usar en rutas, middleware y componentes server.
2. **API & Middleware**
   - Nueva ruta App Router `app/api/auth/[...nextauth]/route.ts`.
   - Middleware ahora delega en `next-auth/middleware` y solo protege `/dashboard/**`, mostrando `/login` como página de acceso.
3. **Tipado y helpers**
   - Extensión de tipos de NextAuth (`types/next-auth.d.ts`) para incluir `user.id` y `role`.
   - Helper `lib/routes.ts` con `getDashboardRoute()` para centralizar el routing por rol.
   - Nuevo `AuthProvider` (SessionProvider) importado en `app/layout.tsx`.
4. **Vistas y componentes**
   - `DashboardLayout` y `Header` consumen sesiones reales (`useSession` + `signOut`).
   - Páginas de perfil leen datos del usuario autenticado.
   - Eliminé el `RoleSwitcher` y el mock de `getCurrentUser`.
   - `/login`, `/register` y `/recover` ahora usan los proveedores de Google o credenciales (`signIn`) y muestran mensajes de estado. Desde `/register` se pueden crear cuentas nuevas eligiendo rol y contraseña para pruebas.
   - La raíz (`app/page.tsx`) redirige según la sesión (`getServerSession`).

## Variables necesarias

Las variables ya estaban definidas en `.env`, pero son indispensables para NextAuth:

```
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_SERVER=smtp://user:pass@host:port
EMAIL_FROM=portal-rh@udea.edu.co
```

## Flujo actualizado

1. El usuario entra a `/login` y selecciona:
   - **Google**: botón OAuth directo.
   - **Correo**: formulario que envía un enlace mágico mediante el provider de Email.
2. Una vez autenticado el usuario, NextAuth persiste la sesión en la tabla `Session` y la UI consulta `useSession`.
3. El middleware bloquea cualquier `/dashboard/**` si no existe sesión; NextAuth redirige automáticamente a `/login`.
4. `DashboardLayout` obtiene el usuario autenticado, muestra la información y el botón de cerrar sesión (`signOut`).

## Cómo probar

1. Levanta el proyecto: `npm run dev`.
2. Abre `http://localhost:3000/login`:
   - Pulsa "Continuar con Google" y accede con cualquier cuenta configurada en la consola de Google.
   - O ingresa el correo corporativo y recibe el enlace mágico (usa Mailtrap/SMTP configurado).
3. Tras el login, deberías ser dirigido automáticamente a `/dashboard/<rol>` de acuerdo con el rol almacenado en la tabla `users`.
4. Para cerrar sesión, usa el menú del Header; volverás a `/login`.

## Notas

- Los usuarios que se creen vía Google quedan registrados en la tabla `users` con rol `CANDIDATE`. Se puede actualizar la columna `role` desde la BD para asignar dashboards específicos (ej. `ADMIN`, `HR`).
- Si necesitas un demo más rápido, ejecuta `npx prisma db seed` para crear usuarios `admin@udea.edu.co` y `rrhh@udea.edu.co` y luego loguea con esos correos empleando el proveedor de Email (Mailtrap).
