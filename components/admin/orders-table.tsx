import Link from "next/link"
import { ChevronRight, Package } from "lucide-react"
import type { AdminOrder } from "@/lib/neobite/admin"
import { StatusBadge } from "@/components/admin/status-badge"
import { PAYMENT_LABELS, dateTimeFormatter, formatCurrency } from "@/lib/neobite/order-status"

export function OrdersTable({ orders, failed }: { orders: AdminOrder[]; failed: boolean }) {
  if (failed) {
    return (
      <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-destructive">
        Não foi possível carregar os pedidos.
      </p>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
        <Package className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-muted-foreground">Nenhum pedido encontrado.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="px-4 py-3 font-medium">Pedido</th>
            <th scope="col" className="px-4 py-3 font-medium">Data</th>
            <th scope="col" className="px-4 py-3 font-medium hidden md:table-cell">Itens</th>
            <th scope="col" className="px-4 py-3 font-medium hidden lg:table-cell">Pagamento</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium text-right">Total</th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Detalhes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0)
            return (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  <time dateTime={order.createdAt}>{dateTimeFormatter.format(new Date(order.createdAt))}</time>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "itens"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  {PAYMENT_LABELS[order.paymentMethod]}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.7)] transition-all"
                  >
                    <span className="hidden sm:inline">Detalhes</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">do pedido {order.id.slice(0, 8).toUpperCase()}</span>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
