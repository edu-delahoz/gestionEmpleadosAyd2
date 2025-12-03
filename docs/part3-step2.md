# Parte 3 · Paso 2 – UX, Roles y Documentación

## Cambios clave

1. **Controles de acceso visibles**
   - `app/dashboard/hr/resources/page.tsx`: ahora muestra un aviso cuando el rol no es `hr/admin` y oculta el modal “Nuevo recurso”. Los usuarios sin permisos siguen viendo el catálogo en modo lectura.
   - `app/dashboard/hr/transactions/page.tsx`: agrega un aviso similar para movimientos. Solo los roles permitidos ven el botón “Agregar movimiento”; el resto opera en modo consulta.

2. **Mejoras de UX**
   - Nuevos estados vacíos y mensajes de ayuda en recursos y movimientos para guiar al usuario cuando no hay datos o la carga falla.
   - Los selectores respetan el último recurso válido y recargan automáticamente cuando el catálogo cambia.

3. **Documentación**
   - `README.md` incluye la sección **“API de Recursos Estratégicos y Movimientos”** con ejemplos de uso para `/api/resources` y `/api/movements`.
   - Este archivo resume el alcance del paso y enlaza el contexto necesario para futuras fases.

## Próximos pasos sugeridos

- Añadir banner “Talent Copilot” en la página de transacciones (reservado para la fase WOW IA).
- Extender pruebas automatizadas o scripts de verificación para los endpoints recién documentados.
