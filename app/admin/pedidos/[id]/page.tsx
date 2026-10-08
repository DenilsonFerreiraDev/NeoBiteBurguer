import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { getAdminOrder } from "@/lib/neobite/admin"
import { PAYMENT_LABELS, dateTimeFormatter, formatCurrency } from "@/lib/neobite/order-status"
import { StatusBadge } from "@/components/admin/status-badge"
import { OrderStatusForm } from "@/components/admin/order-status-form"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()

  const order = await getAdminOrder(id)
  if (!order) notFound()

  const code = order.id.slice(0, 8).toUpperCase()

  return (
    <>
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar para pedidos
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Detalhes do pedido</p>
          <h1 className="mt-1 text-3xl font-bold font-mono">#{code}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <time dateTime={order.createdAt}>{dateTimeFormatter.format(new Date(order.createdAt))}</time>
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="itens" className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 id="itens" className="text-lg font-bold mb-4">
            Itens
          </h2>
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image src={item.image_url} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-semibold">{item.quantity}x</span>{" "}
                    {formatCurrency(Number(item.unit_price))}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">
                  {formatCurrency(Number(item.unit_price) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.4)] tabular-nums">
              {formatCurrency(order.total)}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="status" className="rounded-xl border border-primary/30 bg-card p-6">
            <h2 id="status" className="text-lg font-bold mb-4">
              Alterar status
            </h2>
            {order.status === "cancelled" ? (
              <p className="text-sm text-muted-foreground">Pedidos cancelados não podem ter o status alterado.</p>
            ) : (
              <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            )}
          </section>

          <section aria-labelledby="info" className="rounded-xl border border-border bg-card p-6">
            <h2 id="info" className="text-lg font-bold mb-4">
              Informações
            </h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Pagamento</dt>
                <dd>{PAYMENT_LABELS[order.paymentMethod]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd>{order.hasAccount ? "Com conta" : "Visitante"}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="avaliacao" className="rounded-xl border border-secondary/30 bg-card p-6">
            <h2 id="avaliacao" className="text-lg font-bold mb-4">
              Avaliação
            </h2>
            {order.review ? (
              <>
                <p className="flex items-center gap-1" aria-label={`${order.review.rating} de 5 estrelas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={
                        i < order.review!.rating
                          ? "w-5 h-5 text-secondary fill-current drop-shadow-[0_0_6px_rgba(139,92,246,0.7)]"
                          : "w-5 h-5 text-muted-foreground"
                      }
                    />
                  ))}
                </p>
                {order.review.comment && (
                  <blockquote className="mt-3 text-sm text-muted-foreground border-l-2 border-secondary/50 pl-3 text-pretty">
                    {order.review.comment}
                  </blockquote>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sem avaliação.</p>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
