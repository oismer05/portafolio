import { postJson } from './httpRequest.js'
import type { MailProvider } from './types.js'

/**
 * Brevo (https://www.brevo.com): API HTTPS, 300 correos/día gratis.
 * Permite enviar desde un correo verificado (ej. Gmail) sin tener dominio propio.
 */
export function createBrevoProvider(apiKey: string): MailProvider {
  return {
    name: 'Brevo',
    deliversRealEmail: true,
    async send(message, sender) {
      await postJson(
        'Brevo',
        'https://api.brevo.com/v3/smtp/email',
        { 'api-key': apiKey },
        {
          sender: { name: sender.name, email: sender.email },
          to: [{ email: message.to }],
          subject: message.subject,
          htmlContent: message.html,
          textContent: message.text,
          replyTo: message.replyTo ? { email: message.replyTo } : undefined,
        },
      )
    },
  }
}
