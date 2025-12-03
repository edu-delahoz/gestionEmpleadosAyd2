"use client"

import Link from "next/link"
import { Briefcase, ClipboardList, FileText, Loader2, RefreshCcw, TrendingUp, UserPlus, Users } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NewEmployeeDialog } from "@/components/dashboard/new-employee-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useWorkforceSummary } from "@/hooks/use-workforce-summary"

const dateFormatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" })

const formatDate = (value: string | null) => {
  if (!value) return "Sin fecha"
  try {
    return dateFormatter.format(new Date(value))
  } catch (error) {
    return value
  }
}

const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
}

export default function AdminDashboardPage() {
  const { data, loading, error, refresh } = useWorkforceSummary("admin")

  const stats = [
    {
      key: "employees",
      label: "Colaboradores activos",
      icon: Users,
      value: data?.headcount.active ?? 0,
      subtext: `+${data?.headcount.newThisMonth ?? 0} este mes`,
    },
    {
      key: "openings",
      label: "Posiciones abiertas",
      icon: Briefcase,
      value: data?.openPositions.totalOpenings ?? 0,
      subtext: `${data?.openPositions.totalRoles ?? 0} roles activos`,
    },
    {
      key: "requests",
      label: "Solicitudes pendientes",
      icon: FileText,
      value: data?.requests.pending ?? 0,
      subtext: `${data?.requests.total ?? 0} totales`,
    },
    {
      key: "satisfaction",
      label: "Satisfacción",
      icon: TrendingUp,
      value: data ? `${data.satisfaction.average.toFixed(1)}/5` : "--",
      subtext: `${data?.satisfaction.responses ?? 0} respuestas`,
      progress: (data?.satisfaction.average ?? 0) * 20,
    },
  ]

  const newEmployeeTrigger = (
    <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" disabled={!data || loading}>
      <UserPlus className="h-5 w-5" />
      <span className="text-sm">Nuevo empleado</span>
    </Button>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel administrativo</h1>
            <p className="text-muted-foreground">Supervisa el estado de la organización y toma acciones inmediatas</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading} className="w-full lg:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            <span className="ml-2">Actualizar</span>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ocurrió un error al cargar la información</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={refresh}>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading && !data ? <Loader2 className="h-5 w-5 animate-spin" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                {stat.progress !== undefined && <Progress value={stat.progress} className="mt-3" />}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contrataciones recientes</CardTitle>
              <CardDescription>Integraciones completadas en el trimestre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data && loading && <p className="text-sm text-muted-foreground">Cargando información...</p>}
              {data && data.recentHires.length === 0 && (
                <p className="text-sm text-muted-foreground">No se registran nuevas contrataciones en el periodo.</p>
              )}
              {data?.recentHires.map((hire) => (
                <div key={hire.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-medium">{hire.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {hire.position ?? "Sin posición"} · {hire.department ?? "Sin departamento"}
                    </p>
                  </div>
                  <Badge variant="outline">{formatDate(hire.startDate)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen por departamento</CardTitle>
              <CardDescription>Headcount por unidad organizacional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data && loading && <p className="text-sm text-muted-foreground">Calculando headcount...</p>}
              {data && data.departments.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no hay departamentos con personal.</p>
              )}
              {data?.departments.map((department) => (
                <div key={department.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{department.name}</p>
                    <p className="text-sm text-muted-foreground">{department.employees} empleados</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vacantes activas</CardTitle>
              <CardDescription>Seguimiento de roles estratégicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data && loading && <p className="text-sm text-muted-foreground">Consultando vacantes...</p>}
              {data && data.openPositions.positions.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay posiciones registradas.</p>
              )}
              {data?.openPositions.positions.map((position) => (
                <div key={position.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{position.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {position.department ?? "Sin departamento"} · {position.location ?? "N/A"}
                      </p>
                    </div>
                    <Badge variant={priorityVariant[position.priority] ?? "secondary"}>{position.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {position.openings - position.filled} cupos disponibles ({position.openings} totales)
                    </span>
                    <span>{position.applications} postulaciones</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Solicitudes críticas</CardTitle>
                <CardDescription>Prioriza aprobaciones pendientes</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/requests">Ver solicitudes</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data && loading && <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>}
              {data && data.requests.list.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
              )}
              {data?.requests.list.map((request) => (
                <div key={request.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{request.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.type} · {request.department ?? "Sin departamento"}
                      </p>
                    </div>
                    <Badge variant="secondary">Pendiente</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipo activo</CardTitle>
            <CardDescription>Colaboradores disponibles para reasignaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!data && loading && <p className="text-sm text-muted-foreground">Obteniendo empleados...</p>}
            {data && data.employees.length === 0 && (
              <p className="text-sm text-muted-foreground">Aún no se registran empleados en la base de datos.</p>
            )}
            {data?.employees.map((employee) => (
              <div key={employee.id} className="flex flex-col gap-1 border rounded-lg p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.position ?? "Sin posición"} · {employee.department ?? "Sin departamento"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Inicio: {formatDate(employee.startDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Operaciones esenciales del administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NewEmployeeDialog
                departments={data?.departmentsCatalog ?? []}
                onCreated={() => {
                  refresh()
                }}
                trigger={newEmployeeTrigger}
              />
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/dashboard/admin/requests">
                  <ClipboardList className="h-5 w-5" />
                  <span className="text-sm">Revisar solicitudes</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
