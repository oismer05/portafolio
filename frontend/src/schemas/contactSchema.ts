import { z } from 'zod'
import { services } from '@/data/services'

/** Opciones del selector "¿Qué necesitas?" */
export const serviceOptions = [...services.map((service) => service.title), 'Otro'] as const

/**
 * Longitud máxima de cada campo. Se usa en la validación y en el atributo maxLength
 * de los inputs, así el navegador ni siquiera deja escribir de más.
 * Debe coincidir con backend/src/modules/contacts/contact.schema.ts
 */
export const FIELD_MAX_LENGTH = {
  name: 100,
  email: 254,
  phone: 20,
  company: 120,
  message: 2000,
} as const

/**
 * Reglas de validación del formulario de contacto.
 * El backend aplica las mismas reglas (y más): nunca se confía solo en el navegador.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Escribe tu nombre (mínimo 2 caracteres)')
    .max(FIELD_MAX_LENGTH.name, 'El nombre es demasiado largo'),
  email: z.string().trim().pipe(z.email('Ingresa un correo válido').max(FIELD_MAX_LENGTH.email)),
  phone: z
    .string()
    .trim()
    .max(FIELD_MAX_LENGTH.phone, 'El teléfono es demasiado largo')
    .regex(/^[+\d\s()-]*$/, 'Solo números, espacios y los signos + ( ) -'),
  company: z.string().trim().max(FIELD_MAX_LENGTH.company, 'El nombre de la empresa es demasiado largo'),
  service: z.enum(serviceOptions, 'Selecciona un servicio'),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntame un poco más (mínimo 10 caracteres)')
    .max(FIELD_MAX_LENGTH.message, `El mensaje no puede superar ${FIELD_MAX_LENGTH.message} caracteres`),
  /** Campo trampa (honeypot): invisible para personas, los bots suelen llenarlo */
  website: z.string().max(0),
})

export type ContactFormValues = z.infer<typeof contactSchema>
