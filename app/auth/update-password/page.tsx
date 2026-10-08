"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/neobite/auth-errors"
import { AuthShell, authButtonClass, authInputClass } from "@/components/auth/auth-shell"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(
        error.name === "AuthSessionMissingError"
          ? "Link expirado ou inválido. Solicite uma nova recuperação de senha."
          : authErrorMessage(error, "update"),
      )
      setIsLoading(false)
      return
    }

    router.push("/conta")
    router.refresh()
  }

  return (
    <AuthShell title="Definir nova senha" subtitle="Escolha uma nova senha para sua conta.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Nova senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            className={authInputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm text-muted-foreground">
            Confirmar nova senha
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={authInputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className={authButtonClass}
        >
          {isLoading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthShell>
  )
}
