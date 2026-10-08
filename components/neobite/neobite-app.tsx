"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/neobite/header"
import { HeroSection } from "@/components/neobite/hero-section"
import { MenuSection } from "@/components/neobite/menu-section"
import { CartSidebar, type CartItem } from "@/components/neobite/cart-sidebar"
import { CheckoutScreen } from "@/components/neobite/checkout-screen"
import { SuccessScreen } from "@/components/neobite/success-screen"
import type { Burger } from "@/components/neobite/burger-card"
import { createOrder, type PaymentMethod } from "@/lib/neobite/actions"

type AppView = "menu" | "checkout" | "success"

interface NeoBiteAppProps {
  products: Burger[]
  loadFailed: boolean
  isLoggedIn: boolean
}

export function NeoBiteApp({ products, loadFailed, isLoggedIn }: NeoBiteAppProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentView, setCurrentView] = useState<AppView>("menu")
  const [checkoutKey, setCheckoutKey] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleAddToCart = useCallback((burger: Burger) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === burger.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === burger.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...burger, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const handleUpdateQuantity = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const handleRemoveItem = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleGoToCheckout = useCallback(() => {
    setIsCartOpen(false)
    setCheckoutKey(crypto.randomUUID())
    setCurrentView("checkout")
  }, [])

  const handleBackToMenu = useCallback(() => {
    setCurrentView("menu")
  }, [])

  const handleConfirmPayment = useCallback(
    async (paymentMethod: PaymentMethod) => {
      const idempotencyKey = checkoutKey ?? crypto.randomUUID()
      setCheckoutKey(idempotencyKey)

      const result = await createOrder(
        cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
        paymentMethod,
        idempotencyKey,
      )

      if (!result.ok) return result.error

      setOrderId(result.data.orderId)
      setCheckoutKey(null)
      setCartItems([])
      setCurrentView("success")
      return null
    },
    [cartItems, checkoutKey],
  )

  const handleCancelAndExit = useCallback(() => {
    // Aqui voce pode rastrear a desistencia para medir taxa de abandono
    setCurrentView("menu")
  }, [])

  const handleSuccessClose = useCallback(() => {
    setOrderId(null)
    setCurrentView("menu")
  }, [])

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  // Checkout Screen
  if (currentView === "checkout") {
    return (
      <CheckoutScreen
        items={cartItems}
        onBack={handleBackToMenu}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelAndExit}
      />
    )
  }

  // Success Screen
  if (currentView === "success" && orderId) {
    return (
      <SuccessScreen
        orderId={orderId}
        onClose={handleSuccessClose}
      />
    )
  }

  // Main Menu View
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header cartCount={cartCount} onCartClick={handleCartClick} isLoggedIn={isLoggedIn} />
      
      <HeroSection />
      
      <MenuSection burgers={products} loadFailed={loadFailed} onAddToCart={handleAddToCart} />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={handleCartClose}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleGoToCheckout}
      />

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            2026 NeoBite Burgers. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2">
            O sabor do futuro, hoje.
          </p>
        </div>
      </footer>
    </main>
  )
}
