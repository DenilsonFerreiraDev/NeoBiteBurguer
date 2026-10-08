import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { OrderLine } from "@/lib/neobite/orders"
import type { OrderStatus } from "@/lib/neobite/order-status"

export async function requireAdmin(nextPath = "/admin") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)

  const { data: isAdmin, error } = await supabase.rpc("is_admin")
  if (error || isAdmin !== true) notFound()

  return { supabase, user }
}

export async function isCurrentUserAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.rpc("is_admin")
  return data === true
}

export interface DashboardStats {
  totalOrders: number
  ordersToday: number
  totalRevenue: number
  totalReviews: number
  averageRating: number
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.rpc("admin_dashboard_stats")
  if (error || !data) {
    console.error("[neobite] admin_dashboard_stats failed:", error?.message)
    return null
  }
  return {
    totalOrders: Number(data.total_orders),
    ordersToday: Number(data.orders_today),
    totalRevenue: Number(data.total_revenue),
    totalReviews: Number(data.total_reviews),
    averageRating: Number(data.average_rating),
  }
}

export interface AdminProduct {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  isActive: boolean
  sortOrder: number
}

type ProductRow = {
  id: number | string
  name: string
  description: string
  price: number | string
  image_url: string
  is_active: boolean
  sort_order: number
}

const toProduct = (row: ProductRow): AdminProduct => ({
  id: Number(row.id),
  name: row.name,
  description: row.description,
  price: Number(row.price),
  imageUrl: row.image_url,
  isActive: row.is_active,
  sortOrder: row.sort_order,
})

const PRODUCT_COLUMNS = "id, name, description, price, image_url, is_active, sort_order"

export async function getAdminProducts() {
  const { supabase } = await requireAdmin("/admin/produtos")
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true })

  if (error) {
    console.error("[neobite] admin products failed:", error.message)
    return { products: [] as AdminProduct[], failed: true }
  }
  return { products: (data as ProductRow[]).map(toProduct), failed: false }
}

export async function getAdminProduct(id: number) {
  const { supabase } = await requireAdmin(`/admin/produtos/${id}`)
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle()

  if (error) console.error("[neobite] admin product failed:", error.message)
  return data ? toProduct(data as ProductRow) : null
}

export interface AdminOrder {
  id: string
  createdAt: string
  total: number
  paymentMethod: "pix" | "card" | "delivery"
  status: OrderStatus
  items: OrderLine[]
  hasAccount: boolean
  review: { rating: number; comment: string | null } | null
}

type OrderRow = {
  id: string
  created_at: string
  total: number | string
  payment_method: AdminOrder["paymentMethod"]
  status: OrderStatus
  items: OrderLine[]
  user_id: string | null
  reviews:
    | { rating: number; comment: string | null }
    | { rating: number; comment: string | null }[]
    | null
}

const ORDER_COLUMNS =
  "id, created_at, total, payment_method, status, items, user_id, reviews(rating, comment)"

const toOrder = (row: OrderRow): AdminOrder => ({
  id: row.id,
  createdAt: row.created_at,
  total: Number(row.total),
  paymentMethod: row.payment_method,
  status: row.status,
  items: Array.isArray(row.items) ? row.items : [],
  hasAccount: row.user_id !== null,
  review: Array.isArray(row.reviews) ? (row.reviews[0] ?? null) : row.reviews,
})

export async function getAdminOrders(status?: OrderStatus) {
  const { supabase } = await requireAdmin("/admin/pedidos")
  let query = supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(100)

  if (status) query = query.eq("status", status)

  const { data, error } = await query
  if (error) {
    console.error("[neobite] admin orders failed:", error.message)
    return { orders: [] as AdminOrder[], failed: true }
  }
  return { orders: (data as OrderRow[]).map(toOrder), failed: false }
}

export async function getAdminOrder(id: string) {
  const { supabase } = await requireAdmin(`/admin/pedidos/${id}`)
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", id)
    .maybeSingle()

  if (error) console.error("[neobite] admin order failed:", error.message)
  return data ? toOrder(data as OrderRow) : null
}
