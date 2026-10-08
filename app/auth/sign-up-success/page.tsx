import Link from "next/link"
import { MailCheck } from "lucide-react"
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell"

export default function SignUpSuccessPage() {
  return (
    <AuthShell title="Verifique seu e-mail">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,255,255,0.3)]">
          <MailCheck className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground text-pretty">
          Enviamos um link de confirmação. Abra-o para ativar sua conta e acessar seu histórico de
          pedidos.
        </p>
        <Link href="/auth/login" className={authLinkClass}>
          Ir para o login
        </Link>
      </div>
    </AuthShell>
  )
}
