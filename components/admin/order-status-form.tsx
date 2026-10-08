"use client"

import { useActionState } from "react"
import { Check, Loader2 } from "lucide-react"
import { updateOrderStatus, type StatusFormState } from "@/lib/neobite/admin-actions"
import { ADMIN_ORDER_STATUSES, ORDER_STATUS_STYLES, type AdminOrderStatus } from "@/lib/neobite/order-status"
import { cn } from "@/lib/utils"

const initialState: StatusFormState = { error: null, success: false }

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: AdminOrderStatus }) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <fieldset className="flex flex-col gap-2" disabled={pending}>
        <legend className="sr-only">Status do pedido</legend>
        {ADMIN_ORDER_STATUSES.map((status) => (
          <label
            key={status}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300",
              "border-border bg-background/60 hover:border-primary/50",
              "has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:shadow-[0_0_15px_rgba(0,255,255,0.2)]",
            )}
          >
            <input
              type="radio"
              name="status"
              value={status}
              defaultChecked={status === currentStatus}
              className="accent-[#00ffff]"
            />
            <span className="text-sm">{ORDER_STATUS_STYLES[status].label}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {pending ? "Salvando..." : "Salvar status"}
      </button>

      <div aria-live="polite" className="min-h-5 text-sm">
        {state.error && <p className="text-destructive">{state.error}</p>}
        {state.success && !pending && (
          <p className="flex items-center gap-1 text-emerald-400">
            <Check className="w-4 h-4" aria-hidden="true" />
            Status atualizado.
          </p>
        )}
      </div>
    </form>
  )
}
