"use client"

import { useCallback, useEffect, useState } from "react"

import type { WorkforceSummary } from "@/types/dashboard"

export function useWorkforceSummary(scope: "hr" | "admin" = "hr") {
  const [data, setData] = useState<WorkforceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dashboard/summary?scope=${scope}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener las métricas")
      }

      const payload = (await response.json()) as WorkforceSummary
      setData(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [scope])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
