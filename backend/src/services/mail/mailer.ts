import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '../../config/env.js'
import { logger } from '../../shared/logger.js'

/** Un correo listo para enviar */
export interface MailMessage {
  to: string
  subject: string
  html: string
  /** Versión en texto plano: la usan clientes sin HTML y mejora la entrega (menos spam) */
  text: string
  replyTo?: string
}

/**
 * Modo de funcionamiento:
 * - 'smtp':    los correos se envían de verdad (SMTP_HOST, SMTP_USER y SMTP_PASS configurados).
 * - 'preview': no se envía nada; cada correo se guarda como .html en .mail-previews/ para revisarlo.
 */
export const mailMode: 'smtp' | 'preview' = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS ? 'smtp' : 'preview'

/** Carpeta donde se guardan las vistas previas (está en .gitignore) */
export const previewDirectory = path.resolve(process.cwd(), '.mail-previews')

const transporter: Transporter | null =
  mailMode === 'smtp'
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // 465 = SSL directo; 587 = STARTTLS
        // Reutiliza conexiones SMTP abiertas en lugar de abrir una por correo (evita cuellos de botella)
        pool: true,
        maxConnections: 3,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null

/** El remitente debe ser la misma cuenta autenticada (Gmail lo exige) */
const sender = { name: env.MAIL_FROM_NAME, address: env.SMTP_USER ?? env.MAIL_TO }

/**
 * Envía un correo (o lo guarda como vista previa).
 * Lanza un error si el envío falla: quien lo llama decide cómo manejarlo.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  if (transporter) {
    await transporter.sendMail({ from: sender, ...message })
    return
  }

  await mkdir(previewDirectory, { recursive: true })
  const slug = message.subject
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase()
  const filePath = path.join(previewDirectory, `${Date.now()}-${slug}.html`)
  await writeFile(filePath, message.html, 'utf-8')
  logger.info(`📨 [vista previa] "${message.subject}" → ${message.to}\n   ${filePath}`)
}

/** Comprueba la conexión y las credenciales SMTP (útil al arrancar y en el comando de prueba) */
export async function verifyMailer(): Promise<boolean> {
  if (!transporter) return false
  try {
    await transporter.verify()
    return true
  } catch (error) {
    logger.error('No se pudo conectar al servidor SMTP. Revisa SMTP_HOST, SMTP_USER y SMTP_PASS', error)
    return false
  }
}
