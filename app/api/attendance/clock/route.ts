import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, action, timestamp, location } = await request.json()

    if (!employeeId || !action || !timestamp) {
      return NextResponse.json({ error: "Datos requeridos faltantes" }, { status: 400 })
    }

    // In a real app, you'd:
    // 1. Validate the employee exists
    // 2. Check if they're already clocked in/out
    // 3. Save to database
    // 4. Update attendance record

    const mockResponse = {
      id: `attendance-${Date.now()}`,
      employeeId,
      action, // 'clock-in' or 'clock-out'
      timestamp,
      location: location || "Oficina Principal",
      success: true,
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
