import { z } from 'zod'
import { multilineText, optionalField, singleLineText } from '../../shared/validation.js'
import { CONTACT_STATUSES, SERVICE_OPTIONS } from './contact.types.js'

/** Cuerpo de POST /api/contacts (mismas reglas que el formulario del frontend) */
export const createContactSchema = z.object({
  name: singleLineText(2, 100, 'El nombre'),
  email: z.string().trim().toLowerCase().pipe(z.email('Correo electrónico inválido').max(254)),
  phone: optionalField(
    z
      .string()
      .trim()
      .max(20, 'El teléfono es demasiado largo')
      .regex(/^[+\d\s()-]+$/, 'El teléfono solo puede contener números, espacios y los signos + ( ) -'),
  ),
  company: optionalField(singleLineText(1, 120, 'El nombre de la empresa')),
  service: z.enum(SERVICE_OPTIONS, 'Selecciona un servicio de la lista'),
  message: multilineText(10, 2000, 'El mensaje'),

  // ─── Señales anti-bots (ver contact.antispam.ts) ───────────────
  /** Honeypot: las personas lo envían vacío; si trae algo, es un bot */
  website: z.string().max(500).optional(),
  /** Milisegundos entre que se mostró el formulario y se envió */
  elapsedMs: z.number().int().nonnegative().optional(),
  /** Token de Cloudflare Turnstile (solo si está activado) */
  turnstileToken: z.string().max(2048).optional(),
})

export type CreateContactInput = z.infer<typeof createContactSchema>

/** Query de GET /api/contacts */
export const listContactsQuerySchema = z.object({
  status: z.enum(CONTACT_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type ListContactsQuery = z.infer<typeof listContactsQuerySchema>

/** Parámetro :id de las rutas */
export const contactIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo'),
})

/** Cuerpo de PATCH /api/contacts/:id/status */
export const updateStatusSchema = z.object({
  status: z.enum(CONTACT_STATUSES, `Estado inválido. Usa: ${CONTACT_STATUSES.join(', ')}`),
})
