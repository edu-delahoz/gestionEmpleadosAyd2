# Resumen de cambios recientes

1. **Dashboards conectados a datos reales**: Los tableros de HR y Admin consumen `/api/dashboard/summary`, mostrando headcount, contrataciones recientes, posiciones abiertas y solicitudes verdaderas, además de estadísticas por departamento y acciones urgentes.
2. **Gestión de empleados centralizada**: Las vistas `/dashboard/hr/employees` y `/dashboard/admin/employees` ahora usan datos de Prisma mediante `/api/employees`, incluyendo filtros por departamento/estado, métricas y sincronización con el diálogo "Nuevo empleado".
3. **Permisos por rol**: HR puede consultar el estado actual del personal sin editar, mientras que Admin cuenta con controles para actualizar posición, departamento y salario o eliminar colaboradores con confirmación.
4. **API reforzada**: Se añadieron `GET /api/employees`, `PATCH /api/employees/[id]` y `DELETE /api/employees/[id]`, con validaciones Zod, normalización de datos y restricciones de seguridad por rol.
5. **Datos de soporte**: Prisma incluye modelos/seed para vacantes, solicitudes y encuestas de satisfacción, habilitando las métricas utilizadas por los dashboards.
