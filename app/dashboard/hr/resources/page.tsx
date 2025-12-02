"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { useToast } from "@/components/ui/use-toast"
import { cn, formatCurrency } from "@/lib/utils"
import { Loader2, PackageOpen, Plus, RefreshCcw, Search } from "lucide-react"

type ApiResource = {
  id: string
  slug: string
  name: string
  description: string | null
  departmentId: string | null
  department: {
    id: string
    name: string
  } | null
  initialBalance: number
  currentBalance: number
  status: string
  createdBy: {
    id: string
    name: string | null
    email: string | null
    role: string
  }
  createdAt: string
  updatedAt: string
  movementsCount: number
}

type ResourceFormState = {
  name: string
  description: string
  departmentId: string
  initialBalance: string
  status: string
}

const initialFormState: ResourceFormState = {
  name: "",
  description: "",
  departmentId: "",
  initialBalance: "",
  status: "active",
}

export default function StrategicResourcesPage() {
  const [resources, setResources] = useState<ApiResource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formState, setFormState] = useState<ResourceFormState>(initialFormState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { data: session } = useSession()
  const { toast } = useToast()

  const canManageResources = session?.user?.role === "hr" || session?.user?.role === "admin"

  const fetchResources = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch("/api/resources", { cache: "no-store" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener los recursos")
      }

      const payload = (await response.json()) as ApiResource[]
      setResources(payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido al cargar recursos"
      setErrorMessage(message)
      toast({
        title: "Error al cargar recursos",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesStatus = statusFilter === "all" || resource.status.toLowerCase() === statusFilter
      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !query ||
        resource.name.toLowerCase().includes(query) ||
        resource.slug.toLowerCase().includes(query) ||
        (resource.department?.name?.toLowerCase().includes(query) ?? false)

      return matchesStatus && matchesSearch
    })
  }, [resources, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const totalInitial = resources.reduce((acc, resource) => acc + resource.initialBalance, 0)
    const totalCurrent = resources.reduce((acc, resource) => acc + resource.currentBalance, 0)
    const variance = totalCurrent - totalInitial
    return {
      count: resources.length,
      totalInitial,
      totalCurrent,
      variance,
    }
  }, [resources])

  const knownDepartments = useMemo(() => {
    const map = new Map<string, string>()
    resources.forEach((resource) => {
      if (resource.departmentId && resource.department?.name) {
        map.set(resource.departmentId, resource.department.name)
      }
    })
    return Array.from(map.entries())
  }, [resources])

  const resetForm = () => {
    setFormState(initialFormState)
  }

  const handleCreateResource = async () => {
    if (!canManageResources) return
    if (!formState.name.trim()) {
      toast({
        title: "Nombre obligatorio",
        description: "Debes ingresar un nombre para el recurso.",
        variant: "destructive",
      })
      return
    }

    if (!formState.initialBalance) {
      toast({
        title: "Saldo inicial requerido",
        description: "Ingresa el saldo inicial antes de guardar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
          departmentId: formState.departmentId.trim() || null,
          initialBalance: Number(formState.initialBalance),
          status: formState.status,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo crear el recurso")
      }

      toast({
        title: "Recurso creado",
        description: `${formState.name} ahora está disponible en el catálogo.`,
      })
      setIsDialogOpen(false)
      resetForm()
      fetchResources()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al crear recurso"
      toast({
        title: "No se pudo crear el recurso",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (errorMessage || filteredResources.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title={errorMessage ? "No pudimos cargar recursos" : "Sin recursos registrados"}
          description={
            errorMessage
              ? `${errorMessage}. Intenta de nuevo en unos segundos.`
              : "Todavía no se han configurado recursos estratégicos en el sistema."
          }
          action={
            canManageResources
              ? {
                  label: "Crear recurso",
                  onClick: () => setIsDialogOpen(true),
                }
              : undefined
          }
        />
      )
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead className="text-right">Saldo inicial</TableHead>
              <TableHead className="text-right">Saldo actual</TableHead>
              <TableHead className="text-right">Var.</TableHead>
              <TableHead>Movimientos</TableHead>
              <TableHead>Creado por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((resource) => {
              const variance = resource.currentBalance - resource.initialBalance

              return (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.slug}</p>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {resource.department ? (
                      <div>
                        <p className="font-medium">{resource.department.name}</p>
                        <p className="text-xs text-muted-foreground">{resource.departmentId}</p>
                      </div>
                    ) : (
                      <Badge variant="outline">General</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(resource.initialBalance)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(resource.currentBalance)}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        variance > 0 ? "text-emerald-600" : variance < 0 ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {variance === 0 ? "—" : formatCurrency(Math.abs(variance))}
                      {variance !== 0 && <span className="ml-1 text-xs">{variance > 0 ? "↑" : "↓"}</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{resource.movementsCount} mov.</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{resource.createdBy.name ?? resource.createdBy.email ?? "Usuario"}</p>
                      <p className="text-xs uppercase text-muted-foreground">{resource.createdBy.role}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recursos estratégicos</h1>
            <p className="text-muted-foreground">Catálogo conectado a la base real. Gestiona saldos y responsables.</p>
          </div>
          {canManageResources && (
            <Dialog open={isDialogOpen} onOpenChange={(open) => !isSubmitting && setIsDialogOpen(open)}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo recurso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Crear recurso estratégico</DialogTitle>
                  <DialogDescription>
                    Define el recurso estratégico que quieres controlar. El slug se genera automáticamente.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="resource-name">Nombre</Label>
                    <Input
                      id="resource-name"
                      autoFocus
                      value={formState.name}
                      onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                      placeholder="Bolsa de Talento"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource-balance">Saldo inicial</Label>
                    <Input
                      id="resource-balance"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formState.initialBalance}
                      onChange={(event) => setFormState((state) => ({ ...state, initialBalance: event.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource-department">Departamento (opcional)</Label>
                    <Input
                      id="resource-department"
                      value={formState.departmentId}
                      onChange={(event) => setFormState((state) => ({ ...state, departmentId: event.target.value }))}
                      placeholder="ID del departamento"
                    />
                    {knownDepartments.length > 0 && (
                      <div className="rounded-md border bg-muted/40 p-3">
                        <p className="text-xs font-medium text-muted-foreground">Departamentos detectados:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {knownDepartments.map(([id, name]) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setFormState((state) => ({ ...state, departmentId: id }))}
                              className="rounded-md border bg-background px-2 py-1 text-left text-xs hover:bg-muted"
                            >
                              <span className="block font-semibold text-foreground">{name}</span>
                              <span className="text-[10px] uppercase text-muted-foreground">{id}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource-status">Estado</Label>
                    <div className="flex gap-2">
                      {["active", "paused", "archived"].map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={formState.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFormState((state) => ({ ...state, status }))}
                        >
                          {status === "active" ? "Activo" : status === "paused" ? "Pausado" : "Archivado"}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource-description">Descripción</Label>
                    <Textarea
                      id="resource-description"
                      value={formState.description}
                      onChange={(event) => setFormState((state) => ({ ...state, description: event.target.value }))}
                      rows={4}
                      placeholder="Notas o contexto (opcional)"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateResource} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear recurso
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recursos activos</CardTitle>
              <CardDescription>Recursos registrados en el catálogo</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{stats.count}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saldo inicial</CardTitle>
              <CardDescription>Total configurado al inicio</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(stats.totalInitial)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saldo actual</CardTitle>
              <CardDescription>Diferencia vs. saldo inicial</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalCurrent)}</p>
              <p
                className={cn(
                  "text-sm",
                  stats.variance > 0 ? "text-emerald-600" : stats.variance < 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {stats.variance === 0
                  ? "Sin cambios"
                  : `${stats.variance > 0 ? "+" : "-"}${formatCurrency(Math.abs(stats.variance))}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Catálogo de recursos</CardTitle>
                <CardDescription>Revisa el saldo y responsable de cada recurso estratégico.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchResources}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Actualizar
                </Button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre o departamento"
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Todos", value: "all" },
                  { label: "Activos", value: "active" },
                  { label: "Pausados", value: "paused" },
                  { label: "Archivados", value: "archived" },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    size="sm"
                    type="button"
                    variant={statusFilter === filter.value ? "default" : "outline"}
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderTable()}</CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
