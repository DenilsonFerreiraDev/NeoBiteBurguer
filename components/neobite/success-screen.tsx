"use client"

import { useState } from "react"
import { CheckCircle, Gift, Star, X, Send } from "lucide-react"
import { submitReview } from "@/lib/neobite/actions"

interface SuccessScreenProps {
  orderId: string
  onClose: () => void
}

export function SuccessScreen({ orderId, onClose }: SuccessScreenProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmitFeedback = async () => {
    if (rating === 0 || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitReview(orderId, rating, comment)
      if (!result.ok) {
        setSubmitError(result.error)
        return
      }
      setFeedbackSent(true)
      setReviewSubmitted(true)
      setTimeout(() => {
        setShowFeedback(false)
        setFeedbackSent(false)
        setRating(0)
        setComment("")
      }, 2000)
    } catch {
      setSubmitError("Não foi possível enviar sua avaliação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setShowFeedback(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {feedbackSent ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Obrigado!</h3>
              <p className="text-muted-foreground">
                Seu cupom de <span className="text-primary font-bold">10% OFF</span> foi enviado por e-mail.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Avalie sua <span className="text-primary">experiencia</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Ganhe <span className="text-secondary font-bold">10% de desconto</span> no proximo pedido!
                </p>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3 text-center">Como foi sua experiencia?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Deixe um comentario (opcional)
                </label>
                <textarea
                  value={comment}
                  maxLength={1000}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte-nos sobre sua experiencia..."
                  className="w-full h-24 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Submit Button */}
              {submitError && (
                <p role="alert" className="mb-4 text-sm text-destructive text-center">
                  {submitError}
                </p>
              )}
              <button
                onClick={handleSubmitFeedback}
                disabled={rating === 0 || isSubmitting}
                aria-busy={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-secondary to-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                Enviar Avaliacao e Ganhar Desconto
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_60px_rgba(0,255,255,0.4)] animate-pulse">
            <CheckCircle className="w-16 h-16 text-primary drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
          </div>
          {/* Decorative Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-primary/20 animate-ping" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Pedido realizado com{" "}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
            sucesso!
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Seu lanche esta sendo preparado no futuro.
        </p>
        <p className="text-secondary font-medium mb-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
          Tempo estimado: 25-35 min
        </p>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedback(true)}
          disabled={reviewSubmitted}
          className="w-full py-5 px-6 bg-gradient-to-r from-secondary to-primary text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)] flex items-center justify-center gap-3 mb-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Gift className="w-6 h-6" />
          {reviewSubmitted ? "Avaliação Enviada" : "Avaliar Experiencia (Ganhe Desconto)"}
        </button>

        {/* Back to Menu */}
        <button
          onClick={onClose}
          className="w-full py-3 text-muted-foreground hover:text-primary transition-colors border border-border rounded-xl hover:border-primary/50"
        >
          Voltar ao Cardapio
        </button>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
