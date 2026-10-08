"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  isLoggedIn: boolean
}

export function Header({ cartCount, onCartClick, isLoggedIn }: HeaderProps) {
  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
            Neo
          </span>
          <span className="text-foreground">Bite</span>
          <span className="text-secondary drop-shadow-[0_0_10px_rgba(139,92,246,0.7)]">
            {" "}Burgers
          </span>
        </h1>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <button
            onClick={scrollToMenu}
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Cardápio
          </button>

          {isLoggedIn ? (
            <Link
              href="/conta"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <User className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Minha conta</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-secondary/50 text-sm text-foreground hover:border-secondary hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300"
            >
              Entrar
            </Link>
          )}

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-lg bg-card hover:bg-card/80 border border-border hover:border-primary/50 transition-all duration-300 group"
            aria-label={`Carrinho com ${cartCount} itens`}
          >
            <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
