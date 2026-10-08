import { ORDER_STATUS_STYLES, type OrderStatus } from "@/lib/neobite/order-status"

export function StatusBadge({ status }: { status: OrderStatus }) {
  const style = ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.received
  return (
    <span className={`inline-block whitespace-nowrap px-3 py-1 rounded-full border text-xs font-medium ${style.className}`}>
      {style.label}
    </span>
  )
}
