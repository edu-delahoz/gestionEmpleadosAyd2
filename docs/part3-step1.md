# Parte 3 · Paso 1 – Infraestructura y API

Este resumen documenta los cambios realizados para implementar la capa de datos y los endpoints solicitados en el Paso 1 del plan (`docs/part3-plan.md`).

## 1. Helpers para catálogos de recursos

**Archivo:** `lib/data/resources.ts`
- Nueva constante `RESOURCES_CACHE_TAG` para centralizar la invalidación de caché (usada por futuras server actions o fetch cache).
- `resourceInclude` define las relaciones mínimas a traer (departamento, creador y conteo de movimientos) para evitar sobrefetching en cada consulta.
- `CreateResourceInput` describe los campos requeridos al crear un recurso.
- `ensureUniqueSlug()` genera slugs normalizados y únicos en la base; evita colisiones incluso si dos recursos tienen nombres similares.
- `listResources()` retorna los registros con las relaciones mencionadas.
- `createResource()` valida:
  - Rol del usuario (solo `admin`/`hr` crean).
  - Nombre obligatorio y saldo inicial no negativo.
  - Slug único (usando el helper anterior).
  - Inicializa `currentBalance` con el saldo inicial.
- `updateResourceBalance()` acepta un delta `Decimal`, recupera el recurso y asegura que el saldo no quede negativo antes de persistir el nuevo balance. Puede recibir un cliente transaccional para coordinarse con `createMovement`.

## 2. Helpers para movimientos

**Archivo:** `lib/data/movements.ts`
- Constantes `MOVEMENTS_CACHE_TAG` y `movementTag(resourceId)` para granularidad en la revalidación.
- `CreateMovementInput` y `MovementWithRelations` definen los datos esperados y el shape de respuesta.
- `listMovementsByResource(resourceId)` exige el ID del recurso y ordena por fecha descendente.
- `createMovement()`:
  - Restringe roles válidos (`employee`, `manager`, `hr`, `admin`).
  - Normaliza cantidades según el tipo (`ENTRY` suma, `EXIT` resta, `ADJUSTMENT` puede sumar/restar).
  - Ejecuta una transacción Prisma: primero actualiza el saldo vía `updateResourceBalance()`, luego crea el movimiento con notas, periodo y metadata opcionales.

## 3. Utilidades compartidas

- `lib/data/types.ts`: define `SessionUser` (id + role) para compartir entre helpers y APIs, alineado con `types/next-auth.d.ts`.
- `lib/api/session.ts`: expone `getSessionUser()` reutilizable en cualquier route handler para obtener ID/rol del usuario autenticado con NextAuth.
- `lib/api/errors.ts`: función `buildErrorResponse()` centraliza la traducción de errores conocidos (permisos, validaciones, Prisma) a respuestas HTTP consistentes.

## 4. Endpoints REST

### `/api/resources`
**Archivo:** `app/api/resources/route.ts`
- `GET`: requiere sesión, llama `listResources()` y serializa los decimales/fechas para el cliente.
- `POST`: valida payload con Zod, delega en `createResource()`, y luego ejecuta `revalidateTag(RESOURCES_CACHE_TAG)` para refrescar vistas que dependan de la lista.
- Mensajes de error estandarizados vía `buildErrorResponse()`.

### `/api/movements`
**Archivo:** `app/api/movements/route.ts`
- `GET`: obliga a enviar `resourceId` (o `masterId` para compatibilidad) por querystring y responde con la lista ordenada.
- `POST`: valida con Zod (tipo, cantidad, notas) y crea el movimiento.
- Tras un POST, se revalidan dos tags: `resources` (para balances) y `movements:<resourceId>` (para la tabla de movimientos).

## 5. Uso de Zod

- Ambos endpoints (`app/api/resources/route.ts`, `app/api/movements/route.ts`) usan **Zod** para validar el cuerpo de la petición antes de llamar a los helpers.  
- El paquete `zod` ya estaba presente en `package.json` (`"zod": "3.25.67"`), por lo que **no necesitas instalar nada adicional**.  
- Tipos relevantes:
  - `createResourceSchema`: `name`, `slug?`, `description?`, `departmentId?`, `initialBalance`, `status?`.
  - `createMovementSchema`: `resourceId` (o `masterId` legacy), `movementType` (`MovementType`), `quantity`, `notes?`, `referencePeriod?`, `metadata?`.

## 6. Próximos pasos sugeridos

1. Consumir estos endpoints desde las vistas de HR (recursos y movimientos) usando fetch/SWR/Server Actions.
2. Añadir toasts y manejo de error en la UI.
3. Documentar flujos de uso en el README una vez que las pantallas queden listas.
