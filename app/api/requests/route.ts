import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, type, startDate, endDate, reason, attachment } = await request.json()

    if (!employeeId || !type || !startDate || !reason) {
      return NextResponse.json({ error: "Datos requeridos faltantes" }, { status: 400 })
    }

    // In a real app, you'd:
    // 1. Validate the employee exists
    // 2. Check business rules (available days, etc.)
    // 3. Save to database
    // 4. Notify approvers
    // 5. Handle file uploads

    const mockRequest = {
      id: `request-${Date.now()}`,
      employeeId,
      type,
      startDate,
      endDate: endDate || startDate,
      reason,
      status: "pending",
      createdAt: new Date().toISOString(),
      attachment: attachment ? `${attachment.name}` : null,
    }

    return NextResponse.json({
      message: "Solicitud creada exitosamente",
      request: mockRequest,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const status = searchParams.get("status")

    // Mock requests data - in real app, fetch from database
    const mockRequests = [
      {
        id: 1,
        employeeId: "EMP004",
        type: "vacation",
        startDate: "2024-02-01",
        endDate: "2024-02-05",
        days: 5,
        reason: "Vacaciones familiares",
        status: "pending",
        createdAt: "2024-01-15T10:00:00Z",
      },
      // Add more mock data as needed
    ]

    let filteredRequests = mockRequests

    if (employeeId) {
      filteredRequests = filteredRequests.filter((r) => r.employeeId === employeeId)
    }

    if (status) {
      filteredRequests = filteredRequests.filter((r) => r.status === status)
    }

    return NextResponse.json(filteredRequests)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
