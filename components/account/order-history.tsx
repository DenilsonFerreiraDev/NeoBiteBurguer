import Image from "next/image"
import Link from "next/link"
import { Package, Star } from "lucide-react"
import type { OrderSummary } from "@/lib/neobite/orders"
import { ORDER_STATUS_STYLES } from "@/lib/neobite/order-status"

const PAYMENT_LABELS: Record<OrderSummary["paymentMethod"], string> = {
  pix: "Pix",
  card: "Cartão de crédito",
  delivery: "Pagamento na entrega",
}

const STATUS_STYLES = ORDER_STATUS_STYLES

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})

export function OrderHistory({ orders, failed }: { orders: OrderSummary[]; failed: boolean }) {
  return (
    <section aria-labelledby="historico" className="mt-10">
      <h2 id="historico" className="text-xl font-bold mb-4">
        Histórico de pedidos
      </h2>

      {failed ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-destructive">
          Não foi possível carregar seus pedidos. Tente novamente mais tarde.
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Package className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-muted-foreground">Você ainda não fez nenhum pedido.</p>
          <Link
            href="/#cardapio"
            className="inline-block mt-5 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all"
          >
            Ver cardápio
          </Link>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status]
            return (
              <li
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-sm">
                      <time dateTime={order.createdAt}>
                        {dateFormatter.format(new Date(order.createdAt))}
                      </time>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <ul className="mt-4 flex flex-col gap-3">
                  {order.items.map((item) => (
                    <li key={item.product_id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.image_url}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <p className="flex-1 min-w-0 text-sm truncate">
                        <span className="text-primary font-semibold">{item.quantity}x</span>{" "}
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currency(Number(item.unit_price) * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
                    {order.review && (
                      <span className="flex items-center gap-1 text-secondary">
                        <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                        <span>
                          {order.review.rating}/5
                          <span className="sr-only"> estrelas na sua avaliação</span>
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="font-bold">
                    Total <span className="text-primary">{currency(order.total)}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
