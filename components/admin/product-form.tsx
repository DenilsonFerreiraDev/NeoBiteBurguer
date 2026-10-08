"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import type { ProductFormState } from "@/lib/neobite/admin-actions"
import type { AdminProduct } from "@/lib/neobite/admin"

type ProductAction = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

const initialState: ProductFormState = { error: null }

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,255,255,0.25)] transition-all aria-[invalid=true]:border-destructive"

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: ProductAction
  product?: AdminProduct
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const errors = state.fieldErrors ?? {}

  const field = (name: keyof NonNullable<ProductFormState["fieldErrors"]>) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  })

  const fieldError = (name: keyof NonNullable<ProductFormState["fieldErrors"]>) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1 text-xs text-destructive">
        {errors[name]}
      </p>
    ) : null

  return (
    <form action={formAction} className="rounded-xl border border-primary/30 bg-card p-6 md:p-8 flex flex-col gap-5">
      <fieldset disabled={pending} className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nome
          </label>
          <input id="name" name="name" required maxLength={120} defaultValue={product?.name} className={inputClass} {...field("name")} />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={1000}
            defaultValue={product?.description}
            className={`${inputClass} resize-none`}
            {...field("description")}
          />
          {fieldError("description")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Preço (R$)
            </label>
            <input
              id="price"
              name="price"
              inputMode="decimal"
              required
              placeholder="42,90"
              defaultValue={product ? product.price.toFixed(2).replace(".", ",") : undefined}
              className={inputClass}
              {...field("price")}
            />
            {fieldError("price")}
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium mb-2">
              Ordem no cardápio
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              max={9999}
              step={1}
              defaultValue={product?.sortOrder ?? 0}
              className={inputClass}
              {...field("sortOrder")}
            />
            {fieldError("sortOrder")}
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
            URL da imagem
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            placeholder="https://..."
            defaultValue={product?.imageUrl}
            className={inputClass}
            {...field("imageUrl")}
          />
          {fieldError("imageUrl")}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.isActive ?? true}
            className="w-4 h-4 accent-[#00ffff]"
          />
          <span className="text-sm">Visível no cardápio</span>
        </label>
      </fieldset>

      <div aria-live="polite">
        {state.error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Link
          href="/admin/produtos"
          className="px-5 py-3 rounded-lg border border-border text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {pending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
