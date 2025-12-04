import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { ArrowRight, Building2, ShieldCheck, Users, LineChart, Clock, Sparkles } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { getDashboardRoute } from "@/lib/routes"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Automatiza tu nómina",
    description: "Procesos seguros, conciliación automática y reportes instantáneos.",
    icon: DollarIcon,
  },
  {
    title: "Talento en tiempo real",
    description: "Seguimiento de desempeño, clima laboral y solicitudes desde un mismo panel.",
    icon: Users,
  },
  {
    title: "Analítica accionable",
    description: "KPIs de rotación, costos y productividad listos para tus decisiones.",
    icon: LineChart,
  },
]

const highlights = [
  { label: "Equipos centralizados", value: "45+" },
  { label: "Procesos mensuales", value: "180K" },
  { label: "Integraciones", value: "12" },
]

function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Sparkles {...props} />
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role) {
    redirect(getDashboardRoute(session.user.role))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%)]" />
        <div className="container mx-auto px-6 py-16 sm:py-24 lg:py-28 relative z-10">
          <header className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm text-slate-200 mb-6">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Plataforma segura para equipos de RR.HH.
            </div>
            <div className="flex items-center gap-3 text-slate-300 uppercase tracking-[0.35em] text-xs mb-6">
              <div className="rounded-full bg-primary/20 p-2 text-primary-foreground">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              Portal RH
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Gestiona talento, nómina y decisiones estratégicas desde un solo lugar.
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Automatiza procesos, anticipa necesidades y ofrece experiencias memorables a tu equipo con una suite
              diseñada para los nuevos desafíos del capital humano.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/login" className={buttonVariants({ size: "lg" })}>
                Ingresar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/40 text-white hover:bg-white/10")}
              >
                Solicitar demo
              </Link>
            </div>
          </header>
          <section className="mt-20 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-foreground">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </section>
          <section className="mt-16 grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Impacto medible</p>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Insights accionables para Administradores, Finanzas y Recursos Humanos.
              </h2>
              <p className="mt-4 text-slate-300">
                Conecta nómina, desempeño y bienestar con tableros en tiempo real. Prioriza lo importante gracias a IA
                contextual y flujos aprobatorios inteligentes.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-300">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-300">Alertas en vivo</p>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "Ciclo de nómina listo para aprobación.",
                  "Nuevas solicitudes de vacaciones en finanzas.",
                  "Tendencia de rotación disminuye 12% este trimestre.",
                ].map((alert) => (
                  <div key={alert} className="rounded-xl border border-white/5 bg-slate-800/60 px-4 py-3 text-sm text-slate-200">
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
