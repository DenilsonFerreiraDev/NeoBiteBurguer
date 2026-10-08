import Link from "next/link"
import { ArrowRight, CalendarClock, DollarSign, Receipt, Star } from "lucide-react"
import { getAdminOrders, getDashboardStats } from "@/lib/neobite/admin"
import { formatCurrency } from "@/lib/neobite/order-status"
import { StatCard } from "@/components/admin/stat-card"
import { OrdersTable } from "@/components/admin/orders-table"
import { AdminPageTitle } from "@/components/admin/admin-page-title"

export default async function AdminDashboardPage() {
  const [stats, { orders, failed }] = await Promise.all([getDashboardStats(), getAdminOrders()])

  return (
    <>
      <AdminPageTitle eyebrow="Painel de controle" title="Dashboard" />

      {stats ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total de pedidos" value={String(stats.totalOrders)} icon={Receipt} tone="primary" />
          <StatCard label="Pedidos hoje" value={String(stats.ordersToday)} icon={CalendarClock} tone="secondary" />
          <StatCard
            label="Faturamento total"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            tone="primary"
          />
          <StatCard
            label="Avaliações recebidas"
            value={String(stats.totalReviews)}
            hint={stats.totalReviews > 0 ? `Média ${stats.averageRating.toFixed(1)} / 5` : "Nenhuma ainda"}
            icon={Star}
            tone="secondary"
          />
        </dl>
      ) : (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-destructive">
          Não foi possível carregar as métricas.
        </p>
      )}

      <section aria-labelledby="ultimos-pedidos" className="mt-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 id="ultimos-pedidos" className="text-xl font-bold">
            Últimos pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-1 text-sm text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <OrdersTable orders={orders.slice(0, 5)} failed={failed} />
      </section>
    </>
  )
}
