# Resumen
1. Obtener credenciales del proyecto Supabase (URL + keys). ([Supabase][2])
2. Poner variables de entorno en tu Next.js (`.env.local`).
3. Instalar `@supabase/supabase-js` (cliente) y, si necesitas SSR/Auth, instalar `@supabase/ssr` / helpers. ([Supabase][1])
4. (Opcional) Conectar Prisma a la base de datos de Supabase usando `DATABASE_URL`. ([Supabase][3])
5. Crear clients: cliente de navegador y cliente para server/SSR (App Router). ([Supabase][4])
6. Probar llamadas: un ejemplo client-side y otro server-side (App Router / getServerSideProps).
7. Seguridad: RLS, políticas y no exponer `service_role` en el cliente. ([Supabase][5])

---

# 1) Obtener las credenciales en Supabase

En la consola de Supabase (Dashboard → Settings → API) copia:

* `SUPABASE_URL` (p. ej. `https://xyz.supabase.co`)
* `SUPABASE_ANON_KEY` (anon/public key para frontend)
* `SUPABASE_SERVICE_ROLE_KEY` (solo para uso de servidor — **no** lo pongas en el frontend)

La doc oficial indica usar estas claves para crear el cliente. ([Supabase][2])

(ESTA PARTE YA TE LA PASÉ)
---

# 2) Variables de entorno en Next.js

Crea/edita `.env.local` en la raíz del proyecto Next.js:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
# SOLO EN SERVIDOR (no en el cliente)
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
# Si usas Prisma:
DATABASE_URL=postgresql://<usuario>:<password>@db.<...>.supabase.co:5432/postgres
```

> Usa `NEXT_PUBLIC_` para variables que deben estar disponibles en el cliente; NO pongas la `service_role` con `NEXT_PUBLIC_`. ([Supabase][2])

---

# 3) Instalar dependencias

En tu proyecto Next.js:

```bash
# cliente básico
npm install @supabase/supabase-js

# si vas a hacer Server-Side Auth con el App Router (Next 13+)
npm install @supabase/ssr
```

La librería oficial `@supabase/supabase-js` es el cliente recomendado y `@supabase/ssr` facilita la autenticación en server-side/edge. ([Supabase][1])

---

# 4) Crear un cliente isomórfico para el frontend

Archivo: `lib/supabaseClient.ts` (o `.js`)

```ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_* en .env.local');
}

export const supabase = createClient(url, anon);
```

Usa `supabase` directamente en componentes React para operaciones client-side (auth, realtime, storage, select/insert). ([Supabase][1])

(ESTO NO ES LO MAS SEGURO Y TAMPOCO ENCAJA EN TU ARQUITECTURA, ENTONCES PUEDES IGNORARLO, AUNQUE USALO EN CASO DE QUE LO CREAS NECESARIO)
---


# 5) Cliente/Helpers para Server (SSR / App Router)

Si necesitas leer datos en el servidor (p. ej. en `getServerSideProps`, Server Components o en API routes) configura un cliente de servidor. Para App Router y SSR Supabase recomienda usar `@supabase/ssr` (o usar createClient con service role en funciones server-only). Ejemplo con `@supabase/ssr`:

```ts
// lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Next 13 App Router, si aplica

export function createSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // o usa cookies para sesión
  return createServerClient({ supabaseUrl, supabaseKey }, { cookies });
}
```

O, en un API route server-only, puedes crear `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` y ejecutarlo (recuerda **no exponer** la service key). ([Supabase][4])

---

# 6) Ejemplos de uso: client-side y server-side

**Client-side (componente React):**

```tsx
// app/page.tsx o components/ProfilesList.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfilesList() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) console.error(error);
      else setProfiles(data || []);
    }
    load();
  }, []);

  return (
    <div>
      <h2>Perfiles</h2>
      <ul>
        {profiles.map(p => <li key={p.id}>{p.employee_code} — {p.position}</li>)}
      </ul>
    </div>
  );
}
```

**Server-side (API route usando service role o conexión segura):**

```ts
// pages/api/profiles.ts (Next API routes)
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('profiles').select('*').limit(100);
  if (error) return res.status(500).json({ error });
  res.status(200).json({ data });
}
```

> Si usas App Router y `@supabase/ssr`, crea el client con cookies para respetar sesión del usuario. ([Supabase][4])

---

# 7) Conectar Prisma (si lo usas)

Si quieres que Prisma use la misma base de Supabase establece `DATABASE_URL` con la connection string que Supabase te da y en `schema.prisma` pon:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Luego `npx prisma generate` y `npx prisma db pull` (o usar migraciones si deseas controlarlas). La documentación de Supabase + Prisma explica pasos y recomendaciones (p. ej. desactivar PostgREST si sólo vas a usar Prisma). ([Supabase][3])

---

# 8) Seguridad — Row Level Security (RLS) y policies

* Por defecto Supabase crea `auth.users` y permite RLS. Si vas a exponer tablas al frontend usando la anon key, **habilita RLS** y crea policies que controlen SELECT/INSERT/UPDATE según `auth.uid()` y roles. ([Supabase][5])
* Si necesitas operaciones administrativas desde el servidor (p. ej. actualizar saldos, inserciones masivas), hazlas con la `service_role` key **únicamente en funciones server-side** (API routes, Edge Functions). Nunca en el cliente.

---

# 9) Pruebas y pasos rápidos para verificar

1. Arranca tu Next.js: `npm run dev`.
2. Llama al endpoint server: `http://localhost:3000/api/profiles` → debería devolver los `profiles`.
3. En el cliente, abre la página que usa `ProfilesList` y confirma que muestra datos.
4. Si obtienes errores 401/403 revisa RLS/policies en Supabase Studio → Auth → Policies. ([Supabase][5])

---

# 10) Recomendaciones prácticas y problemas comunes

* **No** expongas la `service_role` en `NEXT_PUBLIC_`. Usa `SUPABASE_SERVICE_ROLE_KEY` en servidor. (doc). ([Supabase][2])
* Para autenticación y sesiones en Next 13 App Router usa `@supabase/ssr` (recomendado) o `@supabase/auth-helpers-nextjs` si tu versión de Next lo requiere. ([Supabase][4])
* Si usas Prisma para migraciones, ten en cuenta la interacción con Supabase (migrations vs Supabase SQL editor). La doc de Supabase + Prisma lo explica. ([Supabase][3])

---

# Recursos oficiales que consulté

* Instalación `@supabase/supabase-js`. ([Supabase][1])
* Auth helpers / `@supabase/ssr` y creación de cliente para SSR. ([Supabase][4])
* Quickstart / Next.js examples en docs de Supabase. ([Supabase][5])
* Conectar Prisma a Supabase. ([Supabase][3])
* Cómo conectarte a Postgres desde Supabase (API & keys). ([Supabase][2])

---

Si quieres, ahora hago **uno de estos tres** (elige uno) y te lo doy ya listo para pegar en tu repo:

1. Crear `lib/supabaseClient.ts` + `lib/supabaseServer.ts` completos (con tipos TS) y ejemplo de uso en una página Next.js.
2. Configuración completa de Prisma (`schema.prisma` + .env + comandos`) para que Prisma use tu base de Supabase.
3. Ejemplos RLS (políticas) para que `profiles` sea accesible solo por su dueño (SQL para RLS).

Dime cuál prefieres y te lo genero completo. (No hace falta que subas nada más — uso lo que ya me dijiste).

[1]: https://supabase.com/docs/reference/javascript/installing?utm_source=chatgpt.com "JavaScript: Installing | Supabase Docs"
[2]: https://supabase.com/docs/guides/database/connecting-to-postgres?utm_source=chatgpt.com "Connect to your database | Supabase Docs"
[3]: https://supabase.com/docs/guides/database/prisma?utm_source=chatgpt.com "Prisma | Supabase Docs"
[4]: https://supabase.com/docs/guides/auth/server-side/creating-a-client?utm_source=chatgpt.com "Creating a Supabase client for SSR"
[5]: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs?utm_source=chatgpt.com "Use Supabase with Next.js"
