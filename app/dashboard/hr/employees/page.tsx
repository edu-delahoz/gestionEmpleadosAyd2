"use client"

import { useMemo, useState } from "react"
import { Loader2, MapPin, Phone, Plus, RefreshCcw, Search, Users } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NewEmployeeDialog } from "@/components/dashboard/new-employee-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEmployees } from "@/hooks/use-employees"

const formatDate = (value: string | null) => {
  if (!value) return "Sin registro"
  try {
    return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(value))
  } catch (error) {
    return value
  }
}

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30
const statusOptions = ["ACTIVE", "INACTIVE", "TERMINATED"] as const
const statusLabels: Record<(typeof statusOptions)[number], string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  TERMINATED: "Retirado",
}

export default function HREmployeesPage() {
  const { employees, departments, loading, error, refresh } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.position ?? "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || employee.departmentId === departmentFilter
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [departmentFilter, employees, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const active = employees.filter((employee) => employee.status === "ACTIVE").length
    const inactive = employees.length - active
    const newThisMonth = employees.filter((employee) => {
      const value = employee.startDate ? new Date(employee.startDate).getTime() : new Date(employee.createdAt).getTime()
      return value >= Date.now() - THIRTY_DAYS
    }).length

    return {
      total: employees.length,
      active,
      inactive,
      newThisMonth,
    }
  }, [employees])

  const newEmployeeTrigger = (
    <Button className="gap-2" disabled={loading}>
      <Plus className="h-4 w-4" />
      Nuevo empleado
    </Button>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de empleados</h1>
            <p className="text-muted-foreground">Consulta y edita la información del equipo actual</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={refresh} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Actualizar
            </Button>
            <NewEmployeeDialog
              departments={departments}
              trigger={newEmployeeTrigger}
              onCreated={() => {
                refresh()
              }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos cargar los empleados</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Colaboradores con perfil</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <Badge variant="outline">{stats.active}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Disponibles actualmente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <Badge variant="secondary">{stats.inactive}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos</CardTitle>
              <Badge variant="outline">30 días</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">Incorporados recientemente</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refina la búsqueda por nombre, departamento o estado</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, correo o posición"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empleados</CardTitle>
            <CardDescription>Mantén sus datos actualizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando empleados...
              </div>
            )}
            {!loading && filteredEmployees.length === 0 && (
              <p className="text-sm text-muted-foreground">No se encontraron empleados con los filtros aplicados.</p>
            )}
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex flex-col gap-4 border rounded-lg p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={employee.avatar ?? undefined} alt={employee.name} />
                    <AvatarFallback>{employee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.email ?? "Sin correo"}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.position ?? "Posición sin definir"} · {employee.department ?? "Sin departamento"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                      {employee.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {employee.phone}
                        </span>
                      )}
                      {employee.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {employee.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <Badge variant={employee.status === "ACTIVE" ? "default" : "secondary"}>
                    {statusLabels[employee.status as (typeof statusOptions)[number]] ?? employee.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Ingreso: {formatDate(employee.startDate)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
