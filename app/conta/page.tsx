import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserOrders } from "@/lib/neobite/orders"
import { isCurrentUserAdmin } from "@/lib/neobite/admin"
import { AccountHeader } from "@/components/account/account-header"
import { OrderHistory } from "@/components/account/order-history"

export const metadata: Metadata = { title: "Minha Conta | NeoBite Burgers" }

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?next=/conta")

  const [{ orders, failed }, isAdmin] = await Promise.all([getUserOrders(user.id), isCurrentUserAdmin()])
  const name = (user.user_metadata?.full_name as string | undefined)?.trim() || null
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((acc, order) => acc + order.total, 0)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AccountHeader isAdmin={isAdmin} />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <section className="relative overflow-hidden bg-card border border-primary/30 rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-secondary/15 blur-3xl"
          />
          <p className="text-xs uppercase tracking-widest text-primary">Área do usuário</p>
          <h1 className="mt-2 text-3xl font-bold text-balance">
            {name ? `Olá, ${name}` : "Sua conta"}
          </h1>
          <p className="mt-1 text-muted-foreground break-all">{user.email}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-background/60 border border-border p-4">
              <dt className="text-xs text-muted-foreground">Pedidos</dt>
              <dd className="mt-1 text-2xl font-bold text-primary">{orders.length}</dd>
            </div>
            <div className="rounded-lg bg-background/60 border border-border p-4">
              <dt className="text-xs text-muted-foreground">Total investido</dt>
              <dd className="mt-1 text-2xl font-bold text-secondary">
                {totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </dd>
            </div>
          </dl>
        </section>

        <OrderHistory orders={orders} failed={failed} />
      </div>
    </main>
  )
}
