"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/neobite/admin"
import { ADMIN_ORDER_STATUSES } from "@/lib/neobite/order-status"

export interface ProductFormState {
  error: string | null
  fieldErrors?: Partial<Record<"name" | "description" | "price" | "imageUrl" | "sortOrder", string>>
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120, "Máximo de 120 caracteres."),
  description: z.string().trim().max(1000, "Máximo de 1000 caracteres."),
  price: z.coerce
    .number({ invalid_type_error: "Preço inválido." })
    .positive("O preço deve ser maior que zero.")
    .max(9999.99, "Preço muito alto.")
    .transform((v) => Math.round(v * 100) / 100),
  imageUrl: z
    .string()
    .trim()
    .url("Informe uma URL válida.")
    .refine((v) => v.startsWith("https://"), "A URL deve usar https://."),
  sortOrder: z.coerce.number().int("Use um número inteiro.").min(0).max(9999),
  isActive: z.boolean(),
})

function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? "",
    price: String(formData.get("price") ?? "").replace(",", "."),
    imageUrl: formData.get("imageUrl") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  })
}

function toFieldErrors(error: z.ZodError): ProductFormState["fieldErrors"] {
  const fieldErrors: ProductFormState["fieldErrors"] = {}
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof NonNullable<ProductFormState["fieldErrors"]>
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

function revalidateProducts() {
  revalidatePath("/")
  revalidatePath("/admin", "layout")
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin("/admin/produtos")
  const parsed = parseProduct(formData)
  if (!parsed.success) return { error: "Revise os campos destacados.", fieldErrors: toFieldErrors(parsed.error) }

  const { name, description, price, imageUrl, sortOrder, isActive } = parsed.data
  const { error } = await supabase.from("products").insert({
    name,
    description,
    price,
    image_url: imageUrl,
    sort_order: sortOrder,
    is_active: isActive,
  })

  if (error) {
    console.error("[neobite] createProduct failed:", error.message)
    return { error: "Não foi possível criar o produto. Tente novamente." }
  }

  revalidateProducts()
  redirect("/admin/produtos?ok=created")
}

export async function updateProduct(
  productId: number,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin(`/admin/produtos/${productId}`)
  if (!Number.isInteger(productId) || productId <= 0) return { error: "Produto inválido." }

  const parsed = parseProduct(formData)
  if (!parsed.success) return { error: "Revise os campos destacados.", fieldErrors: toFieldErrors(parsed.error) }

  const { name, description, price, imageUrl, sortOrder, isActive } = parsed.data
  const { data, error } = await supabase
    .from("products")
    .update({ name, description, price, image_url: imageUrl, sort_order: sortOrder, is_active: isActive })
    .eq("id", productId)
    .select("id")

  if (error || !data?.length) {
    console.error("[neobite] updateProduct failed:", error?.message ?? "no rows")
    return { error: "Não foi possível salvar o produto. Tente novamente." }
  }

  revalidateProducts()
  redirect("/admin/produtos?ok=updated")
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin("/admin/produtos")
  const productId = Number(formData.get("productId"))
  if (!Number.isInteger(productId) || productId <= 0) redirect("/admin/produtos?error=delete")

  const { data, error } = await supabase.from("products").delete().eq("id", productId).select("id")
  if (error || !data?.length) {
    console.error("[neobite] deleteProduct failed:", error?.message ?? "no rows")
    redirect("/admin/produtos?error=delete")
  }

  revalidateProducts()
  redirect("/admin/produtos?ok=deleted")
}

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(ADMIN_ORDER_STATUSES),
})

export interface StatusFormState {
  error: string | null
  success: boolean
}

export async function updateOrderStatus(
  _prev: StatusFormState,
  formData: FormData,
): Promise<StatusFormState> {
  const { supabase } = await requireAdmin("/admin/pedidos")
  const parsed = statusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  })
  if (!parsed.success) return { error: "Status inválido.", success: false }

  const { error } = await supabase.rpc("admin_update_order_status", {
    p_order_id: parsed.data.orderId,
    p_status: parsed.data.status,
  })

  if (error) {
    console.error("[neobite] updateOrderStatus failed:", error.message)
    return { error: "Não foi possível atualizar o status. Tente novamente.", success: false }
  }

  revalidatePath("/admin", "layout")
  revalidatePath("/conta")
  return { error: null, success: true }
}
