# Parte 3 · Paso 1 – Infraestructura y API

Este resumen documenta los cambios realizados para implementar la capa de datos y los endpoints solicitados en el Paso 1 del plan (`docs/part3-plan.md`).

## 1. Helpers para catálogos maestros

**Archivo:** `lib/data/masters.ts`
- Nueva constante `MASTER_CACHE_TAG` para centralizar la invalidación de caché (usada por futuras server actions o fetch cache).
- `masterInclude` define las relaciones mínimas a traer (departamento, creador y conteo de movimientos) para evitar sobrefetching en cada consulta.
- `CreateMasterInput` describe los campos requeridos al crear un recurso.
- `ensureUniqueSlug()` genera slugs normalizados y únicos en la base; evita colisiones incluso si dos recursos tienen nombres similares.
- `listMasters()` retorna los registros con las relaciones mencionadas.
- `createMaster()` valida:
  - Rol del usuario (solo `admin`/`hr` crean).
  - Nombre obligatorio y saldo inicial no negativo.
  - Slug único (usando el helper anterior).
  - Inicializa `currentBalance` con el saldo inicial.
- `updateBalance()` acepta un delta `Decimal`, recupera el maestro y asegura que el saldo no quede negativo antes de persistir el nuevo balance. Puede recibir un cliente transaccional para coordinarse con `createMovement`.

## 2. Helpers para movimientos

**Archivo:** `lib/data/movements.ts`
- Constantes `MOVEMENTS_CACHE_TAG` y `movementTag(masterId)` para granularidad en la revalidación.
- `CreateMovementInput` y `MovementWithRelations` definen los datos esperados y el shape de respuesta.
- `listMovementsByMaster(masterId)` exige el ID del maestro y ordena por fecha descendente.
- `createMovement()`:
  - Restringe roles válidos (`employee`, `manager`, `hr`, `admin`).
  - Normaliza cantidades según el tipo (`ENTRY` suma, `EXIT` resta, `ADJUSTMENT` puede sumar/restar).
  - Ejecuta una transacción Prisma: primero actualiza el saldo vía `updateBalance()`, luego crea el movimiento con notas, periodo y metadata opcionales.

## 3. Utilidades compartidas

- `lib/data/types.ts`: define `SessionUser` (id + role) para compartir entre helpers y APIs, alineado con `types/next-auth.d.ts`.
- `lib/api/session.ts`: expone `getSessionUser()` reutilizable en cualquier route handler para obtener ID/rol del usuario autenticado con NextAuth.
- `lib/api/errors.ts`: función `buildErrorResponse()` centraliza la traducción de errores conocidos (permisos, validaciones, Prisma) a respuestas HTTP consistentes.

## 4. Endpoints REST

### `/api/masters`
**Archivo:** `app/api/masters/route.ts`
- `GET`: requiere sesión, llama `listMasters()` y serializa los decimales/fechas para el cliente.
- `POST`: valida payload con Zod, delega en `createMaster()`, y luego ejecuta `revalidateTag(MASTER_CACHE_TAG)` para refrescar vistas que dependan de la lista.
- Mensajes de error estandarizados vía `buildErrorResponse()`.

### `/api/movements`
**Archivo:** `app/api/movements/route.ts`
- `GET`: obliga a enviar `masterId` por querystring y responde con la lista ordenada.
- `POST`: valida con Zod (tipo, cantidad, notas) y crea el movimiento.
- Tras un POST, se revalidan dos tags: `masters` (para balances) y `movements:<masterId>` (para la tabla de movimientos).

## 5. Uso de Zod

- Ambos endpoints (`app/api/masters/route.ts`, `app/api/movements/route.ts`) usan **Zod** para validar el cuerpo de la petición antes de llamar a los helpers.  
- El paquete `zod` ya estaba presente en `package.json` (`"zod": "3.25.67"`), por lo que **no necesitas instalar nada adicional**.  
- Tipos relevantes:
  - `createMasterSchema`: `name`, `slug?`, `description?`, `departmentId?`, `initialBalance`, `status?`.
  - `createMovementSchema`: `masterId`, `movementType` (`MovementType` enum Prisma), `quantity`, `notes?`, `referencePeriod?`, `metadata?`.

## 6. Próximos pasos sugeridos

1. Consumir estos endpoints desde las vistas de HR (maestros y movimientos) usando fetch/SWR/Server Actions.
2. Añadir toasts y manejo de error en la UI.
3. Documentar flujos de uso en el README una vez que las pantallas queden listas.
