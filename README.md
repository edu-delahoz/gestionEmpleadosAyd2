# Sistema de Gestión de Empleados AYD2

**Repositorio:** [edu-delahoz/gestionEmpleadosAyd2](https://github.com/edu-delahoz/gestionEmpleadosAyd2)  
**Autores:** Eduardo De La Hoz, Juan David Rojas, Juan Barrientos, Juan  
**Materia:** Análisis y Diseño de Sistemas 2  
**Universidad:** Universidad de antioquia.

---

## Descripción General

Este proyecto es un **Sistema Integral de Gestión de Recursos Humanos** orientado a facilitar la administración de empleados, nómina, solicitudes, reportes y otras operaciones empresariales. Su arquitectura modular permite que distintos roles (Administrador, Gerente, Finanzas, Recursos Humanos, etc.) gestionen información relevante de manera eficiente y centralizada.

El sistema está desarrollado con tecnologías modernas de frontend (React/Next.js) y una lógica de backend orientada a servicios, permitiendo escalabilidad, mantenibilidad y una excelente experiencia de usuario.

---

## Características Principales

- **Gestión de Empleados:**  
  - Visualización de equipos y perfiles individuales.
  - Supervisión de desempeño, proyectos y habilidades.
  - Contacto directo con miembros del equipo.

- **Nómina:**  
  - Procesamiento automático de nómina mensual.
  - Generación de reportes y desglose por departamentos.
  - Simulación de deducciones, pagos y generación de comprobantes.

- **Solicitudes RR.HH.:**  
  - Registro y aprobación/rechazo de solicitudes (vacaciones, incapacidades, permisos).
  - Seguimiento de estado de cada solicitud.
  - Notificaciones y alertas.

- **Reportes Analíticos:**  
  - Informes de nómina, desempeño, diversidad y otros indicadores clave.
  - Exportación de reportes en varios formatos.
  - Filtros por departamento y tipo de reporte.

- **Paneles Personalizados:**  
  - Dashboard para cada rol (Administrador, Gerente, Finanzas, RR.HH.).
  - Estadísticas rápidas y métricas relevantes.

- **Recuperación de Cuenta:**  
  - Flujo de recuperación de contraseña vía correo electrónico.

- **Registro de Usuarios:**  
  - Alta de nuevos empleados con asignación de rol, departamento y cargo.

---

## Módulos del Sistema

### 1. Panel de Administrador (`app/dashboard/admin`)
- Visualiza estadísticas generales del sistema.
- Monitorea la salud de componentes críticos (base de datos, servidor, email).
- Procesa la nómina mensual y revisa alertas de seguridad.

### 2. Panel de Gerente (`app/dashboard/manager`)
- Gestiona el equipo de trabajo: perfil, proyectos, habilidades y desempeño.
- Consulta reportes de productividad, asistencia y cumplimiento de metas.

### 3. Panel de Finanzas (`app/dashboard/finance`)
- Controla el presupuesto, gastos y pagos pendientes.
- Desglosa la nómina por departamento y calcula costos por empleado.

### 4. Panel de Recursos Humanos (`app/dashboard/hr`)
- Administra solicitudes de empleados.
- Genera y exporta reportes de nómina, desempeño y diversidad.

---

## Estructura del Proyecto

```
gestionEmpleadosAyd2/
│
├── app/
│   ├── dashboard/
│   │   ├── admin/         # Panel administrador
│   │   ├── manager/       # Panel gerencial
│   │   ├── finance/       # Panel financiero
│   │   ├── hr/            # Panel de recursos humanos
│   ├── api/               # Endpoints para procesamiento (e.g. nómina)
│   ├── register/          # Registro de usuarios
│   ├── recover/           # Recuperación de cuenta
│   ├── layout.tsx         # Layout principal
│
├── lib/                   # Utilidades y helpers
├── hooks/                 # Custom hooks (e.g. notificaciones)
├── public/                # Recursos estáticos
└── ...                    # Otros archivos de configuración y estilos
```

---

## Tecnologías Utilizadas

- **Frontend:** React, Next.js, TypeScript
- **Backend:** API REST (simulada en Next.js)
- **Estilos:** Tailwind CSS
- **Icons & UI:** Lucide-react, componentes personalizados
- **Gestión de estado y notificaciones:** React hooks, Sonner (toast)

---

## Instalación y Ejecución

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/edu-delahoz/gestionEmpleadosAyd2.git
   cd gestionEmpleadosAyd2
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Ejecuta el proyecto en modo desarrollo:**
   ```bash
   npm run dev
   ```
4. Accede a la aplicación en `http://localhost:3000`

## Usuarios de prueba

Después de correr `npx prisma db seed`, tendrás estas cuentas disponibles para iniciar sesión con correo/contraseña:

| Rol           | Correo                | Contraseña    |
|---------------|-----------------------|---------------|
| Administrador | `admin@udea.edu.co`   | `Admin123*`   |
| Recursos Humanos | `rrhh@udea.edu.co` | `Rh123*`      |
| Gerente       | `manager@udea.edu.co` | `Manager123*` |
| Empleado      | `employee@udea.edu.co`| `Employee123*`|

También puedes usar el botón “Continuar con Google” si tienes un cliente OAuth configurado en `.env`.
Si necesitas otro rol con credenciales propias, visita `/register` y genera una cuenta indicando el rol deseado.

---

## Créditos

Desarrollado por:

- **Eduardo De La Hoz**
- **Juan David Rojas**
- **Juan Barrientos**
- **Juan**

Proyecto académico para la materia **Análisis y Diseño de Sistemas 2**.

---

## Notas Adicionales

Este proyecto es una simulación académica. Para consultas contactame a través de GitHub (edu-delahoz).

---

## API de Recursos Estratégicos y Movimientos

- **`POST /api/resources`**: crea un recurso estratégico (solo roles `hr` y `admin`). Requiere campos `name` e `initialBalance`. Opcionales: `description`, `departmentId`, `status`.
- **`GET /api/resources`**: devuelve el catálogo completo con saldos actual/ inicial, departamento y creador.
- **`POST /api/movements`**: registra entradas, salidas o ajustes para un recurso. Cualquier rol autenticado (`employee`, `manager`, `hr`, `admin`) puede enviar `resourceId`, `movementType` (`ENTRY`, `EXIT`, `ADJUSTMENT`), `quantity`, `notes?`, `referencePeriod?`.
- **`GET /api/movements?resourceId=...`**: lista el historial de movimientos del recurso indicado.

> Recomendación: primero crea recursos desde `/dashboard/hr/resources`, luego usa `/dashboard/hr/transactions` para monitorear y registrar movimientos. Las acciones sensibles se ocultan automáticamente si tu rol no tiene permisos.
