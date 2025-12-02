import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDashboardRoute } from "@/lib/routes"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role) {
    redirect(getDashboardRoute(session.user.role))
  }
  redirect("/login")
}
