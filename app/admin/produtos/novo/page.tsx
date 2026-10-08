import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createProduct } from "@/lib/neobite/admin-actions"
import { ProductForm } from "@/components/admin/product-form"
import { AdminPageTitle } from "@/components/admin/admin-page-title"

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar para produtos
      </Link>
      <AdminPageTitle eyebrow="Catálogo" title="Novo produto" />
      <ProductForm action={createProduct} submitLabel="Criar produto" />
    </div>
  )
}
