"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import type { Burger } from "./burger-card"

export interface CartItem extends Burger {
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: number, delta: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Seu Pedido
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </header>

          {items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Carrinho vazio
              </h3>
              <p className="text-muted-foreground text-sm">
                Adicione itens do cardapio para comecar seu pedido
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted rounded-lg p-4 border border-border"
                  >
                    <div className="flex gap-3 mb-3">
                      {/* Item Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-foreground truncate pr-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                            aria-label={`Remover ${item.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-primary font-medium text-sm">
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-card rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="font-semibold text-foreground">
                        {(item.price * item.quantity).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Total and Checkout */}
              <footer className="p-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                    {formattedTotal}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
                >
                  Finalizar Pedido
                </button>
              </footer>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
