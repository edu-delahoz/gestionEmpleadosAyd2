import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { Role as PrismaRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { Role } from "@/types"
import bcrypt from "bcrypt"

const normalizeRole = (role?: PrismaRole): Role => {
  const fallback: Role = "candidate"
  if (!role) return fallback
  return role.toLowerCase() as Role
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = normalizeRole(user.role as PrismaRole)
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || session.user.id
        session.user.role = (token.role as Role) ?? session.user.role ?? "candidate"
        session.user.image = (token.picture as string) ?? session.user.image
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
