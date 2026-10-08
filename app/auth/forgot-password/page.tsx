"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient, authRedirectUrl } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/neobite/auth-errors"
import {
  AuthShell,
  authButtonClass,
  authInputClass,
  authLinkClass,
} from "@/components/auth/auth-shell"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authRedirectUrl("/auth/update-password"),
    })

    setIsLoading(false)
    if (error) {
      setError(authErrorMessage(error, "reset"))
      return
    }
    setSent(true)
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos um link para redefinir sua senha."
      footer={
        <Link href="/auth/login" className={authLinkClass}>
          Voltar para o login
        </Link>
      }
    >
      {sent ? (
        <p role="status" className="text-sm text-muted-foreground text-pretty">
          Se existir uma conta com esse e-mail, você receberá um link de redefinição em instantes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className={authInputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button type="submit" disabled={isLoading || !email} className={authButtonClass}>
            {isLoading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
