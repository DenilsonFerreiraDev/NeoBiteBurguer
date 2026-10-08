"use client"

import { BurgerCard, type Burger } from "./burger-card"

interface MenuSectionProps {
  burgers: Burger[]
  loadFailed?: boolean
  onAddToCart: (burger: Burger) => void
}

export function MenuSection({ burgers, loadFailed = false, onAddToCart }: MenuSectionProps) {
  return (
    <section id="cardapio" className="py-20 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-secondary text-sm uppercase tracking-[0.3em] font-medium">
            Nosso Menu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Cardápio{" "}
            <span className="text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
              Digital
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Selecione seus favoritos e monte o pedido perfeito
          </p>
        </div>

        {burgers.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-xl bg-card/50">
            <p className="text-muted-foreground">
              {loadFailed
                ? "Não foi possível carregar o cardápio. Tente novamente em instantes."
                : "Nenhum lanche disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {burgers.map((burger) => (
              <BurgerCard
                key={burger.id}
                burger={burger}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
