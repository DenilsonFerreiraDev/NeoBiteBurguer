import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAdminProduct } from "@/lib/neobite/admin"
import { updateProduct } from "@/lib/neobite/admin-actions"
import { ProductForm } from "@/components/admin/product-form"
import { AdminPageTitle } from "@/components/admin/admin-page-title"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId) || productId <= 0) notFound()

  const product = await getAdminProduct(productId)
  if (!product) notFound()

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar para produtos
      </Link>
      <AdminPageTitle eyebrow="Catálogo" title={`Editar ${product.name}`} />
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} submitLabel="Salvar alterações" />
    </div>
  )
}
