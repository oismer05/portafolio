/** Un correo listo para enviar */
export interface MailMessage {
  to: string
  subject: string
  html: string
  /** Versión en texto plano: la usan clientes sin HTML y mejora la entrega (menos spam) */
  text: string
  replyTo?: string
}

/** Quién envía el correo (nombre visible + dirección) */
export interface MailSender {
  name: string
  email: string
}

/**
 * Contrato que cumple cada proveedor de correo.
 * Agregar uno nuevo (Postmark, SES...) es crear un archivo que implemente esta interfaz.
 */
export interface MailProvider {
  /** Nombre legible para los logs */
  readonly name: string
  /** false = solo guarda vistas previas, no entrega correos reales */
  readonly deliversRealEmail: boolean
  send(message: MailMessage, sender: MailSender): Promise<void>
  /** Comprobación opcional de credenciales al arrancar */
  verify?(): Promise<void>
}
