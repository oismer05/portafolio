/**
 * Herramientas para trabajar con los correos sin llenar el formulario.
 *
 *   npm run mail:preview  → genera los dos correos con datos de ejemplo en .mail-previews/
 *                           (ábrelos en el navegador para ver el diseño; no envía nada)
 *   npm run mail:test     → envía los dos correos de ejemplo a MAIL_TO con el proveedor configurado
 *                           (sirve para comprobar que el proveedor y sus credenciales funcionan)
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env.js'
import { buildClientConfirmationEmail } from '../modules/contacts/emails/clientConfirmation.email.js'
import type { ContactEmailData } from '../modules/contacts/emails/emailData.js'
import { buildOwnerNotificationEmail } from '../modules/contacts/emails/ownerNotification.email.js'
import { deliversRealEmail, mailProviderName, previewDirectory, sendMail, verifyMailer } from '../services/mail/mailer.js'

/** Mensaje ficticio para probar las plantillas */
const sampleContact: ContactEmailData = {
  id: 128,
  fullName: 'María Fernanda Rodríguez',
  email: 'maria.rodriguez@ejemplo.com',
  phone: '+57 300 123 4567',
  company: 'Clínica del Caribe',
  service: 'Software para el sector salud',
  message:
    'Hola Oismer, vi tu portafolio y me interesa digitalizar el registro de consentimientos informados de nuestra clínica.\n\n¿Podríamos agendar una llamada esta semana para contarte el proceso actual?',
  receivedAt: new Date(),
}

const [command] = process.argv.slice(2)

if (command === 'preview') {
  await mkdir(previewDirectory, { recursive: true })
  const files = {
    'notificacion-dueno.html': buildOwnerNotificationEmail(sampleContact).html,
    'confirmacion-cliente.html': buildClientConfirmationEmail(sampleContact).html,
  }
  for (const [fileName, html] of Object.entries(files)) {
    const filePath = path.join(previewDirectory, fileName)
    await writeFile(filePath, html, 'utf-8')
    console.log(`✓ ${filePath}`)
  }
  console.log('\nÁbrelos en el navegador para revisar el diseño.')
} else if (command === 'test') {
  if (!deliversRealEmail) {
    console.error('❌ No hay proveedor de correo configurado (Google Apps Script, Resend, Brevo o SMTP). Revisa .env')
    process.exit(1)
  }
  console.log(`Enviando con ${mailProviderName}...`)
  if (!(await verifyMailer())) process.exit(1)

  // Ambos correos llegan a TU bandeja (MAIL_TO) para que veas cómo los recibe el cliente
  await sendMail({ ...buildOwnerNotificationEmail(sampleContact), subject: '[PRUEBA] Notificación de nuevo contacto' })
  await sendMail({
    ...buildClientConfirmationEmail(sampleContact),
    to: env.MAIL_TO,
    subject: '[PRUEBA] Confirmación que recibe el cliente',
  })
  console.log(`✓ Se enviaron 2 correos de prueba a ${env.MAIL_TO}. Revisa tu bandeja (y la carpeta de spam).`)
} else {
  console.error('Uso: npm run mail:preview | npm run mail:test')
  process.exit(1)
}
