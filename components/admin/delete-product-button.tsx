"use client"

import { useFormStatus } from "react-dom"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProduct } from "@/lib/neobite/admin-actions"

function ConfirmButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all disabled:opacity-60"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  )
}

export function DeleteProductButton({ productId, productName }: { productId: number; productName: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-lg border border-border text-muted-foreground hover:border-destructive/60 hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Excluir {productName}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-destructive/40">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            O produto sairá do cardápio permanentemente. Pedidos antigos continuam com o registro do item. Para
            apenas esconder temporariamente, edite e desmarque &quot;Visível no cardápio&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteProduct}>
            <input type="hidden" name="productId" value={productId} />
            <ConfirmButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
