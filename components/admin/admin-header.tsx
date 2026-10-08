import Link from "next/link"
import { LogOut, Store } from "lucide-react"
import { signOut } from "@/lib/neobite/auth-actions"
import { AdminNav } from "@/components/admin/admin-nav"

export function AdminHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 max-w-6xl flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 md:h-16 md:py-0">
        <Link href="/admin" className="flex items-baseline gap-2 text-2xl font-bold tracking-tight">
          <span>
            <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">Neo</span>
            <span className="text-foreground">Bite</span>
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-secondary drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2 md:order-last">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Store className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ver loja</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm hover:border-destructive/60 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>

        <AdminNav />
      </div>
    </header>
  )
}
