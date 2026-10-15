import { env } from '../../config/env.js'
import { verifyTurnstileToken } from '../../services/turnstile.js'
import { HttpError } from '../../shared/HttpError.js'
import { countLinks } from '../../shared/validation.js'
import { contactRepository } from './contact.repository.js'
import type { CreateContactInput } from './contact.schema.js'

/** Máximo de enlaces permitidos en un mensaje (el spam suele traer muchos) */
const MAX_LINKS_PER_MESSAGE = 2
/** Ventana para los límites por correo y la detección de duplicados */
const ONE_DAY_MS = 24 * 60 * 60 * 1000

/**
 * Veredicto sobre un envío:
 * - accept:    es legítimo, se guarda y se envían los correos.
 * - discard:   es un bot; se responde "éxito" para no darle pistas, pero no se guarda nada.
 * - duplicate: el mismo mensaje ya llegó hoy; no se guarda ni se reenvían correos.
 */
export type SpamVerdict =
  | { action: 'accept' }
  | { action: 'discard'; reason: string }
  | { action: 'duplicate'; existingId: number }

/**
 * Defensa en capas contra bots y abuso del formulario.
 * Las señales de bot se descartan en silencio; los casos en que una persona real
 * podría equivocarse (enlaces, límite diario, verificación) responden con un error claro.
 *
 * Además de estas capas, la ruta tiene un límite de envíos por IP (rateLimiters.ts).
 */
export async function evaluateSubmission(input: CreateContactInput, ipAddress: string | null): Promise<SpamVerdict> {
  // 1. Honeypot: campo invisible que solo llenan los bots
  if (input.website) return { action: 'discard', reason: 'honeypot' }

  // 2. Trampa de tiempo: una persona no llena el formulario en menos de unos segundos,
  //    y un bot que llama a la API directamente ni siquiera envía este dato
  if (input.elapsedMs === undefined || input.elapsedMs < env.MIN_FORM_FILL_MS) {
    return { action: 'discard', reason: `tiempo de llenado ${input.elapsedMs ?? 'ausente'} ms` }
  }

  // 3. Cloudflare Turnstile (si está activado)
  if (!(await verifyTurnstileToken(input.turnstileToken, ipAddress))) {
    throw HttpError.badRequest('No pudimos verificar que eres una persona. Recarga la página e inténtalo de nuevo.')
  }

  // 4. Exceso de enlaces
  if (countLinks(input.message) > MAX_LINKS_PER_MESSAGE) {
    throw HttpError.badRequest(`Por seguridad, el mensaje no puede contener más de ${MAX_LINKS_PER_MESSAGE} enlaces.`)
  }

  const since = new Date(Date.now() - ONE_DAY_MS)

  // 5. Mismo mensaje repetido (doble clic, reenvío del navegador)
  const duplicateId = await contactRepository.findDuplicateSince(input.email, input.message, since)
  if (duplicateId !== undefined) return { action: 'duplicate', existingId: duplicateId }

  // 6. Límite diario por correo: impide usar el formulario para bombardear
  //    de confirmaciones la bandeja de otra persona, aunque el atacante cambie de IP
  const sentToday = await contactRepository.countByEmailSince(input.email, since)
  if (sentToday >= env.MAX_MESSAGES_PER_EMAIL_PER_DAY) {
    throw new HttpError(429, 'Ya recibí varios mensajes desde este correo hoy. Te responderé pronto, ¡gracias por tu paciencia!')
  }

  return { action: 'accept' }
}
