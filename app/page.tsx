import { NeoBiteApp } from "@/components/neobite/neobite-app"
import { getProducts } from "@/lib/neobite/products"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()
  const [{ products, failed }, { data: userData }] = await Promise.all([
    getProducts(),
    supabase.auth.getUser(),
  ])

  return <NeoBiteApp products={products} loadFailed={failed} isLoggedIn={Boolean(userData.user)} />
}
