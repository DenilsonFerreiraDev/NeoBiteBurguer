"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package, exact: false },
  { href: "/admin/pedidos", label: "Pedidos", icon: Receipt, exact: false },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Administração" className="w-full md:w-auto">
      <ul className="flex items-center gap-1">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300",
                  active
                    ? "bg-primary/10 text-primary border border-primary/40 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                    : "text-muted-foreground border border-transparent hover:text-primary",
                )}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
