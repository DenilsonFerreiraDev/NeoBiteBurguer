import Link from "next/link"
import { getAdminOrders } from "@/lib/neobite/admin"
import { ADMIN_ORDER_STATUSES, ORDER_STATUS_STYLES, type OrderStatus } from "@/lib/neobite/order-status"
import { OrdersTable } from "@/components/admin/orders-table"
import { AdminPageTitle } from "@/components/admin/admin-page-title"
import { cn } from "@/lib/utils"

const FILTERS: (OrderStatus | "all")[] = ["all", ...ADMIN_ORDER_STATUSES]

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: rawStatus } = await searchParams
  const status = (ADMIN_ORDER_STATUSES as readonly string[]).includes(rawStatus ?? "")
    ? (rawStatus as OrderStatus)
    : undefined
  const { orders, failed } = await getAdminOrders(status)

  return (
    <>
      <AdminPageTitle eyebrow="Operação" title="Pedidos" />

      <nav aria-label="Filtrar por status" className="mb-6 overflow-x-auto">
        <ul className="flex gap-2">
          {FILTERS.map((filter) => {
            const active = (filter === "all" && !status) || filter === status
            return (
              <li key={filter}>
                <Link
                  href={filter === "all" ? "/admin/pedidos" : `/admin/pedidos?status=${filter}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-block whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-all duration-300",
                    active
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {filter === "all" ? "Todos" : ORDER_STATUS_STYLES[filter].label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <OrdersTable orders={orders} failed={failed} />
      {orders.length === 100 && (
        <p className="mt-3 text-xs text-muted-foreground">Exibindo os 100 pedidos mais recentes.</p>
      )}
    </>
  )
}
