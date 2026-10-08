import Image from "next/image"
import Link from "next/link"
import { Package, Pencil, Plus } from "lucide-react"
import { getAdminProducts } from "@/lib/neobite/admin"
import { formatCurrency } from "@/lib/neobite/order-status"
import { AdminPageTitle } from "@/components/admin/admin-page-title"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

const FEEDBACK: Record<string, { text: string; tone: "ok" | "error" }> = {
  created: { text: "Produto criado com sucesso.", tone: "ok" },
  updated: { text: "Produto atualizado com sucesso.", tone: "ok" },
  deleted: { text: "Produto excluído.", tone: "ok" },
  delete: { text: "Não foi possível excluir o produto.", tone: "error" },
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  const { ok, error } = await searchParams
  const feedback = FEEDBACK[ok ?? error ?? ""]
  const { products, failed } = await getAdminProducts()

  return (
    <>
      <AdminPageTitle
        eyebrow="Catálogo"
        title="Produtos"
        action={
          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Novo produto
          </Link>
        }
      />

      {feedback && (
        <p
          role="status"
          className={
            feedback.tone === "ok"
              ? "mb-6 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400"
              : "mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          }
        >
          {feedback.text}
        </p>
      )}

      {failed ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-6 text-destructive">
          Não foi possível carregar os produtos.
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Package className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-muted-foreground">Nenhum produto cadastrado.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
            >
              <div className="relative h-40 bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                {!product.isActive && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background/80 border border-border text-xs text-muted-foreground">
                    Oculto
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold">{product.name}</h2>
                  <p className="font-bold text-primary tabular-nums">{formatCurrency(product.price)}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 text-pretty">{product.description}</p>
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/40 text-sm text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)] transition-all"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                    Editar
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
