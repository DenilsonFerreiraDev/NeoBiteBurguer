import Link from "next/link"
import type { ReactNode } from "react"

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold tracking-tight mb-8">
          <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Neo</span>
          <span className="text-foreground">Bite</span>
          <span className="text-secondary drop-shadow-[0_0_10px_rgba(139,92,246,0.7)]"> Burgers</span>
        </Link>

        <section className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-balance">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{subtitle}</p>
            )}
          </header>
          {children}
        </section>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}

export const authInputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"

export const authButtonClass =
  "w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"

export const authLinkClass = "text-primary hover:underline underline-offset-4"
