# Parte 3 – feature/resources-transactions-crud

## Objetivo
En el PDF original, “Maestro” se refiere al catálogo base del sistema. En nuestro portal RR.HH. lo llamaremos “Recurso estratégico” (ej. Bolsa de talento, cupos de onboarding, licencias disponibles). Los “Movimientos” son las entradas o salidas que afectan esos recursos. El objetivo es conectar ambos módulos a la base real (Supabase) con NextAuth activo, entregando un CRUD completo para HR/Admin y un flujo de movimientos para empleados/gerentes.

---

## Plan detallado (para ejecutar con otro Codex)

### 1. Infraestructura & datos (Prompt 1)
- Revisar models `MasterRecord` e `InventoryMovement`.
- Crear helpers en `lib`:
  - `lib/data/resources.ts`: funciones `listResources`, `createResource`, `updateResourceBalance`.
  - `lib/data/movements.ts`: `listMovementsByResource`, `createMovement`.
- Añadir etiquetas/`revalidatePath` si se usan Server Actions.
- Endpoint/API propuesto:
  - `app/api/resources/route.ts` → GET/POST para recursos.
  - `app/api/movements/route.ts` → GET (filtro por recurso) y POST.

### 2. CRUD de Recursos (Prompt 2)
- Página destino: `app/dashboard/hr/resources/page.tsx` (nueva) o reutilizar `.../hr/employees`.
- Componentes:
  - Tabla con nombre, departamento, saldo inicial/actual, creador.
  - Botón “Nuevo recurso” (solo roles `admin` y `hr`).
  - Modal con formulario → `POST /api/resources`.
  - Toasts de éxito/error; refrescar datos (SWR, server action, etc.).
- Validar en backend que solo HR/Admin crean/actualizan.

### 3. Movimientos / Transacciones (Prompt 3)
- Página: `app/dashboard/hr/transactions/page.tsx` (o `/finance/movements`).
- UI:
  - Dropdown para elegir recurso (cargar lista real).
  - Métricas: saldo inicial/actual, total movimientos.
  - Tabla paginada (fecha, tipo, cantidad, responsable, notas). Campos sensibles visibles solo HR/Admin.
  - Modal “Agregar movimiento”:
    - Tipo (Entry/Exit/Adjustment), cantidad, notas.
    - Loading states y `toast`.
  - Gráfica de evolución (usar `recharts` con datos reales).
- Lógica:
  - POST actualiza `InventoryMovement` y recalcula `MasterRecord.currentBalance`.
  - Roles `employee/manager/hr/admin` pueden crear movimientos; HR/Admin ven campos extra (ex. creador).

### 4. Seguridad y UX (Prompt 4)
- Asegurar que los botones se oculten según rol (utilizar `session.user.role`).
- Validar roles en la API (throw 403 si no corresponde).
- Añadir mensajes cuando no existan recursos/movimientos.
- Documentar en README cómo usar los nuevos endpoints.

### 5. WOW IA pendiente
- Reservar sección para “Talent Copilot” (no implementarlo aún). Ej. banner en transacciones que luego llamará al servicio de IA cuando esté listo.

---

## Recomendación de flujo (ejemplo prompts)
1. **Prompt 1:** “Implementa helpers y endpoints `/api/resources` y `/api/movements` conectados a Prisma/Supabase. Reglas: solo HR/Admin crean recursos; todos los roles pueden crear movimientos.”
2. **Prompt 2:** “Crea la página `app/dashboard/hr/resources/page.tsx` consumiendo los endpoints, con tabla, filtros y modal ‘Nuevo recurso’ (solo HR/Admin).”
3. **Prompt 3:** “Crea la página `app/dashboard/hr/transactions/page.tsx` con dropdown de recurso, tabla de movimientos, modal ‘Agregar movimiento’ y gráfica con datos reales.”
4. **Prompt 4:** “Añade validaciones de rol en UI/servidor, toasts, manejo de errores y actualiza README con instrucciones.”

Así podemos dividir el trabajo entre varios agentes manteniendo el contexto claro.
