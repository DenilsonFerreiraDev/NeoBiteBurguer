import { createClient } from "@/lib/supabase/server"
import type { Burger } from "@/components/neobite/burger-card"

export async function getProducts(): Promise<{ products: Burger[]; failed: boolean }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[neobite] failed to load products:", error.message)
    return { products: [], failed: true }
  }

  return {
    products: (data ?? []).map((row) => ({
      id: Number(row.id),
      name: row.name,
      description: row.description,
      price: Number(row.price),
      image: row.image_url,
    })),
    failed: false,
  }
}
