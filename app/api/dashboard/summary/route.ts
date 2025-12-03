import { NextResponse } from "next/server"

import { getSessionUser } from "@/lib/api/session"
import { fetchWorkforceSummary } from "@/lib/data/dashboard-summary"
import { buildErrorResponse } from "@/lib/api/errors"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    const summary = await fetchWorkforceSummary()
    return NextResponse.json(summary)
  } catch (error) {
    return buildErrorResponse(error)
  }
}
