import type { MailProvider } from './types.js'

interface GoogleScriptConfig {
  /** URL de la aplicación web del script (termina en /exec) */
  url: string
  /** Clave compartida: debe coincidir con RELAY_SECRET en las propiedades del script */
  secret: string
}

interface GoogleScriptResponse {
  ok: boolean
  error?: string
}

/**
 * Google Apps Script como puente: la API envía el correo por HTTPS al script
 * (backend/google-apps-script/Code.gs) y Google lo entrega con tu propio Gmail.
 * Gratis, sin dominio propio y funciona aunque la plataforma bloquee SMTP.
 */
export function createGoogleAppsScriptProvider({ url, secret }: GoogleScriptConfig): MailProvider {
  return {
    name: 'Google Apps Script (Gmail)',
    deliversRealEmail: true,
    async send(message, sender) {
      // Google responde con una redirección a la respuesta real; fetch la sigue automáticamente
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
          replyTo: message.replyTo,
          fromName: sender.name,
        }),
        signal: AbortSignal.timeout(20_000), // Apps Script puede tardar unos segundos en "despertar"
      })

      const result = (await response.json().catch(() => null)) as GoogleScriptResponse | null
      if (!response.ok || !result?.ok) {
        throw new Error(`Google Apps Script no envió el correo: ${result?.error ?? `HTTP ${response.status}`}`)
      }
    },
  }
}
