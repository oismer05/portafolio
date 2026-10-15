import { postJson } from './httpRequest.js'
import type { MailProvider } from './types.js'

/**
 * Resend (https://resend.com): API HTTPS, 3.000 correos/mes gratis.
 * Para escribir a cualquier destinatario hay que verificar un dominio propio.
 */
export function createResendProvider(apiKey: string): MailProvider {
  return {
    name: 'Resend',
    deliversRealEmail: true,
    async send(message, sender) {
      await postJson(
        'Resend',
        'https://api.resend.com/emails',
        { Authorization: `Bearer ${apiKey}` },
        {
          from: `${sender.name} <${sender.email}>`,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          reply_to: message.replyTo,
        },
      )
    },
  }
}
