"use client"

import { useCallback, useEffect, useState } from "react"
import type { EmploymentStatus } from "@prisma/client"

import type { DepartmentOption } from "@/components/dashboard/new-employee-dialog"

export type EmployeeRecord = {
  id: string
  name: string
  email: string | null
  avatar: string | null
  role: string
  createdAt: string
  employeeCode: string | null
  position: string | null
  departmentId: string | null
  department: string | null
  status: EmploymentStatus
  startDate: string | null
  phone: string | null
  location: string | null
  salary: number | null
}

type EmployeesResponse = {
  employees: EmployeeRecord[]
  departments: DepartmentOption[]
}

export function useEmployees() {
  const [data, setData] = useState<EmployeesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/employees", { cache: "no-store" })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? "No se pudieron obtener los empleados")
      }

      const payload = (await response.json()) as EmployeesResponse
      setData(payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    employees: data?.employees ?? [],
    departments: data?.departments ?? [],
    loading,
    error,
    refresh,
  }
}
