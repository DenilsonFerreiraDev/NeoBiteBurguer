"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Truck, QrCode, X } from "lucide-react"
import Image from "next/image"
import type { CartItem } from "./cart-sidebar"

type PaymentMethod = "pix" | "card" | "delivery" | null

interface CheckoutScreenProps {
  items: CartItem[]
  onBack: () => void
  onConfirm: (paymentMethod: Exclude<PaymentMethod, null>) => Promise<string | null>
  onCancel: () => void
}

export function CheckoutScreen({
  items,
  onBack,
  onConfirm,
  onCancel,
}: CheckoutScreenProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!selectedPayment || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const error = await onConfirm(selectedPayment)
      if (error) setSubmitError(error)
    } catch {
      setSubmitError("Não foi possível finalizar o pedido. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    cvv: "",
  })

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const canConfirm = selectedPayment !== null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Cardápio</span>
          </button>
          <h1 className="text-xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            Checkout
          </h1>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-destructive transition-colors text-sm"
          >
            Cancelar e Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                1
              </span>
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-primary">
                    {(item.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formattedTotal}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Taxa de entrega</span>
                <span className="text-primary">Gratis</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  {formattedTotal}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                2
              </span>
              Forma de Pagamento
            </h2>

            <div className="space-y-3">
              {/* PIX Option */}
              <button
                onClick={() => setSelectedPayment("pix")}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  selectedPayment === "pix"
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "pix"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Pix</h3>
                  <p className="text-sm text-muted-foreground">
                    Aprovacao instantanea
                  </p>
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => setSelectedPayment("card")}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  selectedPayment === "card"
                    ? "border-secondary bg-secondary/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "card"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">
                    Cartao de Credito
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Parcele em ate 3x sem juros
                  </p>
                </div>
              </button>

              {/* Delivery Payment Option */}
              <button
                onClick={() => setSelectedPayment("delivery")}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  selectedPayment === "delivery"
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "delivery"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">
                    Pagamento na Entrega
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dinheiro ou cartao
                  </p>
                </div>
              </button>
            </div>

            {/* Card Form (shown when card is selected) */}
            {selectedPayment === "card" && (
              <div className="mt-6 space-y-4 p-4 bg-muted rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome no Cartao
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) =>
                      setCardData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="NOME COMPLETO"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Numero do Cartao
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }))
                      }
                      placeholder="000"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            {submitError && (
              <p role="alert" className="mt-6 text-sm text-destructive text-center">
                {submitError}
              </p>
            )}
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isSubmitting}
              aria-busy={isSubmitting}
              className={`w-full mt-6 py-4 font-bold rounded-xl transition-all duration-300 ${
                canConfirm && !isSubmitting
                  ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Processando pedido..." : "Confirmar e Pagar"}
            </button>

            {/* Cancel Link */}
            <button
              onClick={onCancel}
              className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Cancelar e Sair
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}
