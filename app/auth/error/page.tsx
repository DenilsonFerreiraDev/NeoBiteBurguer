import Link from "next/link"
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell"

export default function AuthErrorPage() {
  return (
    <AuthShell
      title="Falha na autenticação"
      subtitle="O link pode ter expirado ou já ter sido usado."
    >
      <div className="flex flex-col gap-3 text-sm">
        <Link href="/auth/login" className={authLinkClass}>
          Voltar para o login
        </Link>
        <Link href="/auth/forgot-password" className={authLinkClass}>
          Solicitar nova recuperação de senha
        </Link>
      </div>
    </AuthShell>
  )
}
