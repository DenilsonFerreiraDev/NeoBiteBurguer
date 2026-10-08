import type { Metadata } from "next"
import { requireAdmin } from "@/lib/neobite/admin"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Admin | NeoBite Burgers",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />
      <main className="container mx-auto px-4 pt-32 md:pt-28 pb-16 max-w-6xl">{children}</main>
    </div>
  )
}
