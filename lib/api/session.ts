import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import type { SessionUser } from "@/lib/data/types"

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    role: session.user.role,
  }
}
