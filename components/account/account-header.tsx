import Link from "next/link"
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react"
import { signOut } from "@/lib/neobite/auth-actions"

export function AccountHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Neo</span>
          <span className="text-foreground">Bite</span>
          <span className="text-secondary drop-shadow-[0_0_10px_rgba(139,92,246,0.7)]"> Burgers</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cardápio</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary/50 text-sm hover:border-secondary hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-secondary" aria-hidden="true" />
              Admin
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm hover:border-destructive/60 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sair
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
