export const CONTACT_STATUSES = ['new', 'read', 'replied', 'archived'] as const
export type ContactStatus = (typeof CONTACT_STATUSES)[number]

/**
 * Servicios que se pueden elegir en el formulario.
 * Debe coincidir con los títulos de frontend/src/data/services.ts (+ "Otro").
 * Al ser una lista cerrada, nadie puede escribir texto arbitrario en este campo.
 */
export const SERVICE_OPTIONS = [
  'Aplicaciones web a medida',
  'SaaS multi-tenant y marca blanca',
  'Pasarelas de pago',
  'Software para el sector salud',
  'Landing pages y sitios corporativos',
  'APIs y backend',
  'Otro',
] as const

/** Columnas que registran el envío de cada correo */
export type EmailTrackingColumn = 'owner_notified_at' | 'confirmation_sent_at'

/** Fila tal como existe en la tabla contact_messages */
export interface ContactMessageRow {
  id: number
  full_name: string
  email: string
  phone: string | null
  company: string | null
  service: string
  message: string
  status: ContactStatus
  owner_notified_at: Date | null
  confirmation_sent_at: Date | null
  ip_address: string | null
  user_agent: string | null
  created_at: Date
  updated_at: Date
}

/** Datos necesarios para registrar un mensaje nuevo */
export type NewContactMessage = Pick<
  ContactMessageRow,
  'full_name' | 'email' | 'phone' | 'company' | 'service' | 'message' | 'ip_address' | 'user_agent'
>

/** Representación pública (camelCase) que devuelve la API */
export interface ContactMessageDto {
  id: number
  fullName: string
  email: string
  phone: string | null
  company: string | null
  service: string
  message: string
  status: ContactStatus
  ownerNotifiedAt: Date | null
  confirmationSentAt: Date | null
  createdAt: Date
  updatedAt: Date
}
