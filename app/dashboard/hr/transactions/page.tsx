"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Loader2, PackageOpen, Plus, RefreshCcw } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn, formatCurrency } from "@/lib/utils"

const MOVEMENTS_PER_PAGE = 8

type ApiResource = {
  id: string
  name: string
  slug: string
  description: string | null
  department: {
    id: string
    name: string
  } | null
  initialBalance: number
  currentBalance: number
  status: string
}

type MovementType = "ENTRY" | "EXIT" | "ADJUSTMENT"

type ApiMovement = {
  id: string
  resourceId: string
  movementType: MovementType
  quantity: number
  notes: string | null
  referencePeriod: string | null
  performedBy: {
    id: string
    name: string | null
    email: string | null
    role: string
  }
  createdAt: string
}

type MovementFormState = {
  movementType: MovementType
  quantity: string
  notes: string
  referencePeriod: string
}

const movementLabels: Record<MovementType, string> = {
  ENTRY: "Entrada",
  EXIT: "Salida",
  ADJUSTMENT: "Ajuste",
}

const movementVariants: Record<MovementType, "default" | "secondary" | "destructive"> = {
  ENTRY: "default",
  EXIT: "destructive",
  ADJUSTMENT: "secondary",
}

const initialMovementForm: MovementFormState = {
  movementType: "ENTRY",
  quantity: "",
  notes: "",
  referencePeriod: "",
}

export default function TransactionsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [resources, setResources] = useState<ApiResource[]>([])
  const [selectedResourceId, setSelectedResourceId] = useState<string>("")
  const [isResourcesLoading, setIsResourcesLoading] = useState(true)
  const [resourcesError, setResourcesError] = useState<string | null>(null)

  const [movements, setMovements] = useState<ApiMovement[]>([])
  const [isMovementsLoading, setIsMovementsLoading] = useState(false)
  const [movementsError, setMovementsError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [movementForm, setMovementForm] = useState<MovementFormState>(initialMovementForm)

  const canCreateMovements = useMemo(() => {
    const allowed = new Set(["admin", "hr", "manager", "employee"])
    return allowed.has(session?.user?.role ?? "")
  }, [session?.user?.role])
  const showLimitedAccess = !canCreateMovements

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === selectedResourceId) ?? null,
    [resources, selectedResourceId],
  )

  const fetchResources = useCallback(async () => {
    setIsResourcesLoading(true)
    setResourcesError(null)
    try {
      const response = await fetch("/api/resources", { cache: "no-store" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener los recursos")
      }
      const data = (await response.json()) as ApiResource[]
      setResources(data)
      if (data.length > 0) {
        setSelectedResourceId((prev) => {
          if (prev && data.some((resource) => resource.id === prev)) {
            return prev
          }
          return data[0]?.id ?? ""
        })
      } else {
        setSelectedResourceId("")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido al cargar recursos"
      setResourcesError(message)
      toast({
        title: "Error al cargar recursos",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsResourcesLoading(false)
    }
  }, [selectedResourceId, toast])

  const fetchMovements = useCallback(
    async (resourceId: string) => {
      if (!resourceId) return
      setIsMovementsLoading(true)
      setMovementsError(null)
      try {
        const response = await fetch(`/api/movements?resourceId=${resourceId}`, { cache: "no-store" })
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error ?? "No se pudieron obtener los movimientos")
        }
        const data = (await response.json()) as ApiMovement[]
        setMovements(data)
        setCurrentPage(1)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido al cargar movimientos"
        setMovementsError(message)
        toast({
          title: "Error al cargar movimientos",
          description: message,
          variant: "destructive",
        })
      } finally {
        setIsMovementsLoading(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  useEffect(() => {
    if (selectedResourceId) {
      fetchMovements(selectedResourceId)
    } else {
      setMovements([])
    }
  }, [selectedResourceId, fetchMovements])

  const movementStats = useMemo(() => {
    let entries = 0
    let exits = 0
    let adjustments = 0
    movements.forEach((movement) => {
      if (movement.movementType === "ENTRY") {
        entries += movement.quantity
      } else if (movement.movementType === "EXIT") {
        exits += movement.quantity
      } else {
        adjustments += movement.quantity
      }
    })
    return {
      total: movements.length,
      entries,
      exits,
      adjustments,
    }
  }, [movements])

  const chartData = useMemo(() => {
    if (!selectedResource) {
      return []
    }
    let runningBalance = selectedResource.initialBalance
    const sorted = [...movements].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    const points = sorted.map((movement) => {
      let delta = movement.quantity
      if (movement.movementType === "EXIT") {
        delta = -movement.quantity
      } else if (movement.movementType === "ADJUSTMENT") {
        delta = movement.quantity
      }
      runningBalance += delta
      return {
        date: new Date(movement.createdAt).toLocaleDateString("es-CO", { month: "short", day: "numeric" }),
        balance: runningBalance,
      }
    })

    return [
      { date: "Inicial", balance: selectedResource.initialBalance },
      ...points,
    ]
  }, [movements, selectedResource])

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * MOVEMENTS_PER_PAGE
    return movements.slice(start, start + MOVEMENTS_PER_PAGE)
  }, [movements, currentPage])

  const totalPages = Math.max(1, Math.ceil(movements.length / MOVEMENTS_PER_PAGE))

  const handleCreateMovement = async () => {
    if (!selectedResourceId) {
      toast({
        title: "Selecciona un recurso",
        description: "Debes elegir un recurso antes de registrar un movimiento.",
        variant: "destructive",
      })
      return
    }

    const quantityValue = Number(movementForm.quantity)
    if (!Number.isFinite(quantityValue) || quantityValue === 0) {
      toast({
        title: "Cantidad inválida",
        description: "Ingresa un número distinto de cero.",
        variant: "destructive",
      })
      return
    }

    if (movementForm.movementType !== "ADJUSTMENT" && quantityValue < 0) {
      toast({
        title: "Cantidad inválida",
        description: "Para entradas y salidas usa cantidades positivas.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: selectedResourceId,
          movementType: movementForm.movementType,
          quantity: quantityValue,
          notes: movementForm.notes.trim() || undefined,
          referencePeriod: movementForm.referencePeriod.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudo registrar el movimiento")
      }

      toast({
        title: "Movimiento registrado",
        description: "El saldo se actualizó correctamente.",
      })
      setIsDialogOpen(false)
      setMovementForm(initialMovementForm)
      fetchResources()
      fetchMovements(selectedResourceId)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al crear el movimiento"
      toast({
        title: "No se pudo crear el movimiento",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderMovementsTable = () => {
    if (isMovementsLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (movementsError || movements.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title={movementsError ? "No pudimos cargar movimientos" : "Sin movimientos"}
          description={
            movementsError
              ? `${movementsError}. Intenta nuevamente.`
              : "Todavía no hay movimientos asociados al recurso seleccionado."
          }
          action={
            canCreateMovements && selectedResourceId
              ? {
                  label: "Registrar movimiento",
                  onClick: () => setIsDialogOpen(true),
                }
              : undefined
          }
        />
      )
    }

    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMovements.map((movement) => {
                const sign =
                  movement.movementType === "ENTRY"
                    ? "+"
                    : movement.movementType === "EXIT"
                      ? "-"
                      : movement.quantity >= 0
                        ? "+"
                        : "-"
                const displayAmount =
                  movement.movementType === "EXIT"
                    ? -movement.quantity
                    : movement.movementType === "ADJUSTMENT"
                      ? movement.quantity
                      : movement.quantity

                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(movement.createdAt).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        {movement.referencePeriod && (
                          <p className="text-xs text-muted-foreground">Periodo: {movement.referencePeriod}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={movementVariants[movement.movementType]}>{movementLabels[movement.movementType]}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <span className={cn(sign.startsWith("-") && "text-destructive")}>
                        {sign}
                        {formatCurrency(Math.abs(displayAmount))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {movement.performedBy.name ?? movement.performedBy.email ?? "Usuario"}
                        </p>
                        <p className="text-xs uppercase text-muted-foreground">{movement.performedBy.role}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {movement.notes ?? "Sin notas"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || movements.length === 0}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isResourcesLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (resourcesError || resources.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title={resourcesError ? "No pudimos cargar recursos" : "Sin recursos configurados"}
          description={
            resourcesError
              ? `${resourcesError}.`
              : "Aún no has creado recursos estratégicos. Empieza desde la pestaña Recursos."
          }
          action={
            resourcesError
              ? {
                  label: "Reintentar",
                  onClick: fetchResources,
                }
              : undefined
          }
        />
      )
    }

    return (
      <>
        {showLimitedAccess && (
          <Alert>
            <AlertTitle>Acceso limitado</AlertTitle>
            <AlertDescription>
              Puedes consultar la actividad histórica pero las nuevas transacciones están restringidas según tu rol.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Recurso seleccionado</CardTitle>
              <CardDescription>Saldo actual vs. inicial</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{selectedResource?.name}</p>
              <p className="text-3xl font-bold">{formatCurrency(selectedResource?.currentBalance ?? 0)}</p>
              <p className="text-xs text-muted-foreground">
                Inicial: {formatCurrency(selectedResource?.initialBalance ?? 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Entradas</CardTitle>
              <CardDescription>Total de ingresos registrados</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{formatCurrency(movementStats.entries)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Salidas</CardTitle>
              <CardDescription>Total egresado del recurso</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-destructive">
              {formatCurrency(movementStats.exits)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Movimientos</CardTitle>
              <CardDescription>Total histórico</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{movementStats.total}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Actividad del recurso</CardTitle>
              <CardDescription>Visualiza la evolución y registra nuevos movimientos.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Selecciona un recurso" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => selectedResourceId && fetchMovements(selectedResourceId)}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
              {canCreateMovements && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => !isSubmitting && setIsDialogOpen(open)}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar movimiento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Registrar movimiento</DialogTitle>
                      <DialogDescription>
                        Actualiza el saldo del recurso seleccionando el tipo de movimiento y la cantidad.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Tipo</Label>
                        <Select
                          value={movementForm.movementType}
                          onValueChange={(value: MovementType) =>
                            setMovementForm((state) => ({ ...state, movementType: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de movimiento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ENTRY">Entrada</SelectItem>
                            <SelectItem value="EXIT">Salida</SelectItem>
                            <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="movement-quantity">Cantidad</Label>
                        <Input
                          id="movement-quantity"
                          type="number"
                          value={movementForm.quantity}
                          onChange={(event) =>
                            setMovementForm((state) => ({ ...state, quantity: event.target.value }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="movement-periodo">Periodo de referencia (opcional)</Label>
                        <Input
                          id="movement-periodo"
                          value={movementForm.referencePeriod}
                          onChange={(event) =>
                            setMovementForm((state) => ({ ...state, referencePeriod: event.target.value }))
                          }
                          placeholder="Enero 2025"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="movement-notes">Notas</Label>
                        <Textarea
                          id="movement-notes"
                          rows={4}
                          value={movementForm.notes}
                          onChange={(event) =>
                            setMovementForm((state) => ({ ...state, notes: event.target.value }))
                          }
                          placeholder="Motivo del movimiento, responsables, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateMovement} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar movimiento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <div className="h-72">
                  {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-lg border">
                      <p className="text-sm text-muted-foreground">
                        Registra movimientos para visualizar la evolución del recurso.
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip />
                        <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#colorBalance)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div className="space-y-4 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo actual</CardTitle>
                    <CardDescription>Después de últimos movimientos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(selectedResource?.currentBalance ?? 0)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ajustes</CardTitle>
                    <CardDescription>Impacto acumulado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(movementStats.adjustments)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de movimientos</CardTitle>
            <CardDescription>Detalle de entradas, salidas y ajustes.</CardDescription>
          </CardHeader>
          <CardContent>{renderMovementsTable()}</CardContent>
        </Card>
      </>
    )
  }

  return <DashboardLayout>{renderContent()}</DashboardLayout>
}
