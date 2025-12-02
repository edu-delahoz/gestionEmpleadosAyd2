"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Breadcrumbs } from "./breadcrumbs"
import { Footer } from "./footer" // Imported Footer component

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  if (!mounted || status === "loading" || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role={user.role} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} />
        <Breadcrumbs />

        <main className="flex-1 overflow-auto p-6">{children}</main>

        <Footer />
      </div>
    </div>
  )
}
