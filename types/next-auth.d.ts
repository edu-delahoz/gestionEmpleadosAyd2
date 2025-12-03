import NextAuth, { DefaultSession } from "next-auth"
import type { Role } from "@/types"
import type { Role as PrismaRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: Role
    }
  }

  interface User {
    role: PrismaRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
    picture?: string | null
  }
}
