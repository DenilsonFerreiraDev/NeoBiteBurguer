"use client"

import { Plus } from "lucide-react"
import Image from "next/image"

export interface Burger {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface BurgerCardProps {
  burger: Burger
  onAddToCart: (burger: Burger) => void
}

export function BurgerCard({ burger, onAddToCart }: BurgerCardProps) {
  const formattedPrice = burger.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    <article className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      {/* Burger Image with Neon Hover Effect */}
      <div className="relative h-56 bg-muted overflow-hidden">
        <Image
          src={burger.image}
          alt={burger.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Neon Glow Border on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 border-2 border-primary/60 rounded-t-xl shadow-[inset_0_0_20px_rgba(0,255,255,0.3),0_0_20px_rgba(0,255,255,0.3)]" />
        </div>
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {burger.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {burger.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            {formattedPrice}
          </span>
          
          <button
            onClick={() => onAddToCart(burger)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            aria-label={`Adicionar ${burger.name} ao carrinho`}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-primary/50 to-transparent" />
      </div>
    </article>
  )
}
