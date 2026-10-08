import { createClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/lib/neobite/order-status"

export interface OrderLine {
  product_id: number
  name: string
  unit_price: number
  quantity: number
  image_url: string
}

export interface OrderSummary {
  id: string
  createdAt: string
  total: number
  paymentMethod: "pix" | "card" | "delivery"
  status: OrderStatus
  items: OrderLine[]
  review: { rating: number; comment: string | null } | null
}

type OrderRow = {
  id: string
  created_at: string
  total: number | string
  payment_method: OrderSummary["paymentMethod"]
  status: OrderSummary["status"]
  items: OrderLine[]
  reviews:
    | { rating: number; comment: string | null }
    | { rating: number; comment: string | null }[]
    | null
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, total, payment_method, status, items, reviews(rating, comment)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[neobite] getUserOrders failed:", error.message)
    return { orders: [] as OrderSummary[], failed: true }
  }

  const orders = (data as OrderRow[]).map((row) => {
    const review = Array.isArray(row.reviews) ? (row.reviews[0] ?? null) : row.reviews
    return {
      id: row.id,
      createdAt: row.created_at,
      total: Number(row.total),
      paymentMethod: row.payment_method,
      status: row.status,
      items: Array.isArray(row.items) ? row.items : [],
      review,
    } satisfies OrderSummary
  })

  return { orders, failed: false }
}
