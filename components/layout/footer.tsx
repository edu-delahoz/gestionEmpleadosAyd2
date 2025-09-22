"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span>&copy; 2024 Portal RR.HH.</span>
            <Link href="/help" className="hover:text-foreground">
              Ayuda
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacidad
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span>v1.0.0</span>
            <Link href="/status" className="hover:text-foreground">
              Estado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
