"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { authErrorMessage } from "@/lib/neobite/auth-errors"
import { AuthShell, authButtonClass, authInputClass, authLinkClass } from "./auth-shell"

export function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      setError(authErrorMessage(error, "login"))
      setIsLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <AuthShell
      title="Acessar conta"
      subtitle="Entre para acompanhar seus pedidos do futuro."
      footer={
        <>
          Não tem conta?{" "}
          <Link href="/auth/sign-up" className={authLinkClass}>
            Cadastre-se
          </Link>
        </>
      }
    >
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm text-muted-foreground">
              Senha
            </label>
            <Link href="/auth/forgot-password" className={`text-xs ${authLinkClass}`}>
              Esqueci minha senha
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading || !email || !password} className={authButtonClass}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthShell>
  )
}
