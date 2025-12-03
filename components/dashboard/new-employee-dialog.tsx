"use client"

import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export type DepartmentOption = {
  id: string
  name: string
}

export type NewEmployeeDialogProps = {
  departments: DepartmentOption[]
  onCreated?: (result: { temporaryPassword: string; employee: { id: string; name: string | null; email: string | null } }) => void
  trigger: ReactNode
}

const initialFormState = {
  name: "",
  email: "",
  position: "",
  departmentId: "",
  startDate: "",
  salary: "",
}

export function NewEmployeeDialog({ departments, onCreated, trigger }: NewEmployeeDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.position.trim() || !form.departmentId) {
      toast({
        title: "Faltan datos",
        description: "Completa nombre, correo, posición y departamento",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          position: form.position.trim(),
          departmentId: form.departmentId,
          startDate: form.startDate || undefined,
          salary: form.salary ? Number(form.salary) : undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo crear el empleado")
      }

      const payload = await response.json()

      toast({
        title: "Empleado creado",
        description: `Contraseña temporal: ${payload.temporaryPassword}`,
      })

      setForm(initialFormState)
      setOpen(false)
      onCreated?.({
        temporaryPassword: payload.temporaryPassword,
        employee: {
          id: payload.employee.id,
          name: payload.employee.name ?? null,
          email: payload.employee.email ?? null,
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear empleado"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo empleado</DialogTitle>
          <DialogDescription>Registra rápidamente a un nuevo colaborador en la base de datos.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-employee-name">Nombre completo</Label>
            <Input
              id="new-employee-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ana Rodríguez"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-employee-email">Correo corporativo</Label>
            <Input
              id="new-employee-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="ana@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-employee-position">Posición</Label>
            <Input
              id="new-employee-position"
              value={form.position}
              onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
              placeholder="Analista de datos"
            />
          </div>
          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select
              value={form.departmentId}
              onValueChange={(value) => setForm((prev) => ({ ...prev, departmentId: value }))}
              disabled={!departments.length}
            >
              <SelectTrigger id="new-employee-department">
                <SelectValue placeholder={departments.length ? "Selecciona" : "No hay departamentos"} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-employee-start-date">Fecha de ingreso</Label>
            <Input
              id="new-employee-start-date"
              type="date"
              value={form.startDate}
              onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-employee-salary">Salario mensual (COP)</Label>
            <Input
              id="new-employee-salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={(event) => setForm((prev) => ({ ...prev, salary: event.target.value }))}
              placeholder="4500000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !departments.length}>
            {isSubmitting ? "Creando..." : "Crear empleado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
