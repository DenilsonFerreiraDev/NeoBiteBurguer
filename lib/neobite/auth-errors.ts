import type { AuthError } from "@supabase/supabase-js"

export function authErrorMessage(error: AuthError, context: "login" | "signup" | "reset" | "update") {
  switch (error.code) {
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."
    case "weak_password":
      return "Senha muito fraca. Use pelo menos 8 caracteres combinando letras e números."
    case "same_password":
      return "A nova senha precisa ser diferente da atual."
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente."
    case "email_address_invalid":
      return "Endereço de e-mail inválido."
    case "invalid_credentials":
      return "E-mail ou senha inválidos."
  }

  if (context === "login" && error.status === 400) return "E-mail ou senha inválidos."
  console.error("[neobite] auth error:", error.code, error.message)
  return "Ocorreu um erro inesperado. Tente novamente."
}
