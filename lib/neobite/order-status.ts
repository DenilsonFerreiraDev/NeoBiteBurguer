export const ADMIN_ORDER_STATUSES = ["received", "preparing", "out_for_delivery", "delivered"] as const

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number]
export type OrderStatus = AdminOrderStatus | "cancelled"

export const ORDER_STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  received: { label: "Recebido", className: "text-primary border-primary/40 bg-primary/10" },
  preparing: { label: "Em preparo", className: "text-secondary border-secondary/40 bg-secondary/10" },
  out_for_delivery: { label: "Em entrega", className: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
  delivered: { label: "Entregue", className: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
  cancelled: { label: "Cancelado", className: "text-destructive border-destructive/40 bg-destructive/10" },
}

export const PAYMENT_LABELS: Record<"pix" | "card" | "delivery", string> = {
  pix: "Pix",
  card: "Cartão de crédito",
  delivery: "Pagamento na entrega",
}

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})
