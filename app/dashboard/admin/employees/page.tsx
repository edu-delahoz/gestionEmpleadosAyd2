"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Edit, Loader2, MapPin, Phone, Plus, RefreshCcw, Trash2, Users } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NewEmployeeDialog } from "@/components/dashboard/new-employee-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
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

export default function AdminEmployeesPage() {
  const { employees, departments, loading, error, refresh } = useEmployees()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null)
  const NO_DEPARTMENT = "__none__"
  const [editForm, setEditForm] = useState({ position: "", departmentId: NO_DEPARTMENT, salary: "" })

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

  const handleOpenDelete = (employeeId: string) => {
    setDeleteEmployeeId(employeeId)
    setIsDeleteOpen(true)
  }

  const handleOpenEdit = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId)
    if (!employee) return
    setEditEmployeeId(employee.id)
    setEditForm({
      position: employee.position ?? "",
      departmentId: employee.departmentId ?? NO_DEPARTMENT,
      salary: employee.salary ? String(employee.salary) : "",
    })
    setIsEditOpen(true)
  }

  const handleDeleteEmployee = async () => {
    if (!deleteEmployeeId) return

    try {
      const response = await fetch(`/api/employees/${deleteEmployeeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo eliminar al empleado")
      }

      toast({ title: "Empleado eliminado" })
      setIsDeleteOpen(false)
      setDeleteEmployeeId(null)
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  const handleUpdateEmployee = async () => {
    if (!editEmployeeId) return

    try {
      const response = await fetch(`/api/employees/${editEmployeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: editForm.position || undefined,
          departmentId: editForm.departmentId === NO_DEPARTMENT ? null : editForm.departmentId,
          salary: editForm.salary ? Number(editForm.salary) : null,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo actualizar al empleado")
      }

      toast({ title: "Empleado actualizado" })
      setIsEditOpen(false)
      setEditEmployeeId(null)
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

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
            <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
            <p className="text-muted-foreground">Control administrativo de la nómina activa</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={refresh} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Actualizar
            </Button>
            <NewEmployeeDialog departments={departments} trigger={newEmployeeTrigger} onCreated={refresh} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Hubo un problema</AlertTitle>
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
              <p className="text-xs text-muted-foreground">Registros activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <Badge variant="outline">{stats.active}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <Badge variant="secondary">{stats.inactive}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">Baja temporal o definitiva</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos (30 días)</CardTitle>
              <Badge variant="outline">{stats.newThisMonth}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">Seguimiento de onboarding</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Busca por nombre, correo, departamento o estado</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
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
                <SelectItem value="all">Todos</SelectItem>
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
            <CardTitle>Listado</CardTitle>
            <CardDescription>Elimina cuentas inactivas para mantener el directorio ordenado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando empleados...
              </div>
            )}
            {!loading && filteredEmployees.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay empleados que coincidan con los filtros seleccionados.</p>
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
                  <div className="flex items-center gap-2">
                    <Badge variant={employee.status === "ACTIVE" ? "default" : "secondary"}>
                      {statusLabels[employee.status as (typeof statusOptions)[number]] ?? employee.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Ingreso: {formatDate(employee.startDate)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleOpenEdit(employee.id)}>
                      <Edit className="h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleOpenDelete(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar empleado</DialogTitle>
              <DialogDescription>Modifica la posición, el departamento o el salario mensual.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Posición</Label>
                <Input
                  value={editForm.position}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, position: event.target.value }))}
                  placeholder="Ej. Coordinador de ventas"
                />
              </div>
              <div>
                <Label>Departamento</Label>
                <Select
                  value={editForm.departmentId}
                  onValueChange={(value) => setEditForm((prev) => ({ ...prev, departmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_DEPARTMENT}>Sin departamento</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Salario mensual (COP)</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.salary}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, salary: event.target.value }))}
                  placeholder="4500000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateEmployee} disabled={!editEmployeeId}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este empleado?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer y removerá el acceso del colaborador seleccionado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteEmployee} className="bg-red-600 hover:bg-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Alert variant="secondary">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Consejo</AlertTitle>
          <AlertDescription>
            Antes de eliminar un colaborador verifica que sus solicitudes, nómina y accesos hayan sido cerrados.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  )
}
