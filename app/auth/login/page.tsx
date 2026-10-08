import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Entrar | NeoBite Burgers" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/conta"
  return <LoginForm next={safeNext} />
}
