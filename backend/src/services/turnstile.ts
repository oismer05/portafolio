import { env } from '../config/env.js'
import { logger } from '../shared/logger.js'

/**
 * Cloudflare Turnstile: verificación anti-bots gratuita y casi invisible (alternativa a reCAPTCHA).
 * Se activa definiendo TURNSTILE_SECRET_KEY en el backend y VITE_TURNSTILE_SITE_KEY en el frontend.
 * Documentación: https://developers.cloudflare.com/turnstile/
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const isTurnstileEnabled = Boolean(env.TURNSTILE_SECRET_KEY)

interface SiteVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

/**
 * Pregunta a Cloudflare si el token que generó el navegador es válido.
 * Si Turnstile está desactivado devuelve true. Si Cloudflare no responde, falla de forma
 * segura (false): es preferible pedir reintentar que dejar pasar bots.
 */
export async function verifyTurnstileToken(token: string | undefined, remoteIp: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) })
    const result = (await response.json()) as SiteVerifyResponse
    if (!result.success) logger.warn('Turnstile rechazó un envío', result['error-codes'])
    return result.success === true
  } catch (error) {
    logger.error('No se pudo contactar a Cloudflare Turnstile', error)
    return false
  }
}
