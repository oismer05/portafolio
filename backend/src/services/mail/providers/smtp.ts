import nodemailer from 'nodemailer'
import type { MailProvider } from './types.js'

interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
}

/**
 * SMTP (ej. Gmail con contraseña de aplicación). Ideal en local.
 * Ojo: varias plataformas (Railway Trial/Hobby, entre otras) bloquean el SMTP saliente;
 * en producción conviene un proveedor por API (Resend o Brevo).
 */
export function createSmtpProvider({ host, port, user, pass }: SmtpConfig): MailProvider {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL directo; 587 = STARTTLS
    // Reutiliza conexiones abiertas en lugar de abrir una por correo (evita cuellos de botella)
    pool: true,
    maxConnections: 3,
    auth: { user, pass },
  })

  return {
    name: `SMTP (${host})`,
    deliversRealEmail: true,
    async send(message, sender) {
      await transporter.sendMail({ from: { name: sender.name, address: sender.email }, ...message })
    },
    async verify() {
      await transporter.verify()
    },
  }
}
