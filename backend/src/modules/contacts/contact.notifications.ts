import { mailMode, sendMail } from '../../services/mail/mailer.js'
import { logger } from '../../shared/logger.js'
import { contactRepository } from './contact.repository.js'
import { buildClientConfirmationEmail } from './emails/clientConfirmation.email.js'
import type { ContactEmailData } from './emails/emailData.js'
import { buildOwnerNotificationEmail } from './emails/ownerNotification.email.js'

/**
 * Envía los dos correos de un mensaje nuevo:
 *  1. Notificación para mí con toda la información del formulario.
 *  2. Confirmación para la persona que escribió.
 *
 * Se envían en paralelo y por separado: si uno falla, el otro sale igual.
 * Cuando un correo se envía de verdad (modo SMTP), se registra la fecha en la base de datos.
 * Nunca lanza errores: un problema con el correo no debe afectar al visitante.
 */
export async function sendContactEmails(contact: ContactEmailData): Promise<void> {
  const deliveries = [
    { column: 'owner_notified_at', label: 'notificación al dueño', message: buildOwnerNotificationEmail(contact) },
    { column: 'confirmation_sent_at', label: 'confirmación al cliente', message: buildClientConfirmationEmail(contact) },
  ] as const

  const results = await Promise.allSettled(deliveries.map(({ message }) => sendMail(message)))

  for (const [index, result] of results.entries()) {
    const { column, label } = deliveries[index]!

    if (result.status === 'rejected') {
      logger.error(`No se pudo enviar la ${label} del mensaje #${contact.id}`, result.reason)
      continue
    }

    if (mailMode === 'smtp') {
      await contactRepository.markEmailSent(contact.id, column).catch((error: unknown) => {
        logger.error(`No se pudo registrar el envío (${column}) del mensaje #${contact.id}`, error)
      })
    }
  }
}
