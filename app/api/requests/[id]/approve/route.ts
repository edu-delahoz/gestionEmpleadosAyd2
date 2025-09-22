import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { approverId, comments, action } = await request.json()
    const requestId = params.id

    if (!approverId || !action) {
      return NextResponse.json({ error: "Datos requeridos faltantes" }, { status: 400 })
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
    }

    // In a real app, you'd:
    // 1. Validate the request exists
    // 2. Check approver permissions
    // 3. Update request status in database
    // 4. Send notifications to employee
    // 5. Update leave balances if approved

    const mockResponse = {
      requestId,
      status: action === "approve" ? "approved" : "rejected",
      approverId,
      comments: comments || "",
      processedAt: new Date().toISOString(),
      success: true,
    }

    return NextResponse.json({
      message: `Solicitud ${action === "approve" ? "aprobada" : "rechazada"} exitosamente`,
      approval: mockResponse,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
