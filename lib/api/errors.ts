import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

export function buildErrorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: "Error al guardar en la base de datos", details: error.message },
      { status: 400 },
    )
  }

  if (error instanceof Error) {
    const message = error.message || "Error inesperado"
    const lower = message.toLowerCase()

    if (lower.includes("permiso") || lower.includes("autoriz")) {
      return NextResponse.json({ error: message }, { status: 403 })
    }

    if (
      lower.includes("obligatorio") ||
      lower.includes("válido") ||
      lower.includes("saldo") ||
      lower.includes("cantidad")
    ) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    if (lower.includes("no encontrado") || lower.includes("no existe")) {
      return NextResponse.json({ error: message }, { status: 404 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
}
