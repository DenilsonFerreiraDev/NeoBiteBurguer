"use server"

import { createClient } from "@/lib/supabase/server"

export type PaymentMethod = "pix" | "card" | "delivery"

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function createOrder(
  items: { productId: number; quantity: number }[],
  paymentMethod: PaymentMethod,
  idempotencyKey: string,
): Promise<ActionResult<{ orderId: string }>> {
  if (!UUID_PATTERN.test(idempotencyKey)) {
    return { ok: false, error: "Requisição inválida." }
  }
  if (!["pix", "card", "delivery"].includes(paymentMethod)) {
    return { ok: false, error: "Forma de pagamento inválida." }
  }
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some(
      (item) =>
        !Number.isInteger(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 20,
    )
  ) {
    return { ok: false, error: "Itens do pedido inválidos." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("create_order", {
    p_items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
    p_payment_method: paymentMethod,
    p_idempotency_key: idempotencyKey,
  })

  if (error || !data) {
    console.error("[neobite] create_order failed:", error?.message)
    if (error?.message?.includes("quantity limit")) {
      return { ok: false, error: "Limite de quantidade excedido (máx. 20 por item, 50 no total)." }
    }
    return { ok: false, error: "Não foi possível finalizar o pedido. Tente novamente." }
  }

  return { ok: true, data: { orderId: data as string } }
}

export async function submitReview(
  orderId: string,
  rating: number,
  comment: string,
): Promise<ActionResult<{ reviewId: string }>> {
  if (!UUID_PATTERN.test(orderId)) {
    return { ok: false, error: "Pedido inválido." }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Selecione uma nota de 1 a 5." }
  }
  const trimmedComment = comment.trim().slice(0, 1000)

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("submit_review", {
    p_order_id: orderId,
    p_rating: rating,
    p_comment: trimmedComment || null,
  })

  if (error || !data) {
    console.error("[neobite] submit_review failed:", error?.message)
    if (error?.message?.includes("already submitted")) {
      return { ok: false, error: "Este pedido já foi avaliado." }
    }
    return { ok: false, error: "Não foi possível enviar sua avaliação. Tente novamente." }
  }

  return { ok: true, data: { reviewId: data as string } }
}
