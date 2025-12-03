"use client"

import { useCallback, useEffect, useState } from "react"

export type RequestRecord = {
  id: string
  type: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  startDate: string | null
  endDate: string | null
  days: number | null
  reason: string | null
  createdAt: string
  department: string | null
  profile: {
    id: string
    name: string | null
    email: string | null
  } | null
}

export type UseRequestsOptions = {
  includeAll?: boolean
  status?: string | null
  profileId?: string | null
}

export function useRequests(options: UseRequestsOptions = {}) {
  const { includeAll, status, profileId } = options
  const [requests, setRequests] = useState<RequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (includeAll) params.set("all", "true")
      if (status) params.set("status", status)
      if (profileId) params.set("profileId", profileId)

      const url = params.size ? `/api/requests?${params.toString()}` : "/api/requests"
      const response = await fetch(url, { cache: "no-store" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener las solicitudes")
      }
      const payload = (await response.json()) as RequestRecord[]
      setRequests(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [includeAll, status, profileId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { requests, loading, error, refresh }
}
