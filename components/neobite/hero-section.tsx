"use client"

export function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/20" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-medium">
          Bem-vindo ao Futuro
        </p>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
          <span className="text-foreground">Sabores que </span>
          <span className="text-primary drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">
            transcendem
          </span>
          <br />
          <span className="text-foreground">o </span>
          <span className="text-secondary drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
            tempo
          </span>
        </h2>
        
        <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
          Experimente hambúrgueres artesanais com tecnologia de sabor avançada. 
          Onde tradição encontra inovação.
        </p>
        
        <button
          onClick={scrollToMenu}
          className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
        >
          <span className="relative z-10">Ver Cardápio</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
