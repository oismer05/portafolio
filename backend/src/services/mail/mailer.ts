import { env } from '../../config/env.js'
import { logger } from '../../shared/logger.js'
import { createBrevoProvider } from './providers/brevo.js'
import { createGoogleAppsScriptProvider } from './providers/googleAppsScript.js'
import { previewDirectory, previewProvider } from './providers/preview.js'
import { createResendProvider } from './providers/resend.js'
import { createSmtpProvider } from './providers/smtp.js'
import type { MailMessage, MailProvider, MailSender } from './providers/types.js'

export type { MailMessage } from './providers/types.js'
export { previewDirectory }

/**
 * Elige el proveedor según las variables de entorno (gana el primero configurado):
 *   RESEND_API_KEY → BREVO_API_KEY → GOOGLE_SCRIPT_URL + SECRET → SMTP_* → vista previa
 * Así en local puedes usar Gmail por SMTP y en producción un proveedor por HTTPS.
 */
function resolveProvider(): MailProvider {
  if (env.RESEND_API_KEY) return createResendProvider(env.RESEND_API_KEY)
  if (env.BREVO_API_KEY) return createBrevoProvider(env.BREVO_API_KEY)
  if (env.GOOGLE_SCRIPT_URL && env.GOOGLE_SCRIPT_SECRET) {
    return createGoogleAppsScriptProvider({ url: env.GOOGLE_SCRIPT_URL, secret: env.GOOGLE_SCRIPT_SECRET })
  }
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return createSmtpProvider({ host: env.SMTP_HOST, port: env.SMTP_PORT, user: env.SMTP_USER, pass: env.SMTP_PASS })
  }
  return previewProvider
}

const provider = resolveProvider()

/** Remitente: MAIL_FROM si existe; si no, la cuenta SMTP o tu propio correo */
const sender: MailSender = {
  name: env.MAIL_FROM_NAME,
  email: env.MAIL_FROM ?? env.SMTP_USER ?? env.MAIL_TO,
}

/** Nombre del proveedor activo (para los logs) */
export const mailProviderName = provider.name

/** true si los correos se entregan de verdad (no son solo vistas previas) */
export const deliversRealEmail = provider.deliversRealEmail

/**
 * Envía un correo con el proveedor activo.
 * Lanza un error si el envío falla: quien lo llama decide cómo manejarlo.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  await provider.send(message, sender)
}

/** Comprueba las credenciales del proveedor, si lo permite (SMTP). Nunca lanza */
export async function verifyMailer(): Promise<boolean> {
  try {
    await provider.verify?.()
    return true
  } catch (error) {
    logger.error(`No se pudo verificar el proveedor de correo (${provider.name})`, error)
    return false
  }
}
