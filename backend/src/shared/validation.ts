import { z } from 'zod'

/**
 * Caracteres de control (\0, \r, \n, \t...) y de formato invisibles
 * (espacios de ancho cero, marcas de dirección RTL/LTR).
 * En un nombre no tienen uso legítimo y sirven para engañar o inyectar cabeceras de correo.
 */
const CONTROL_OR_INVISIBLE = /[\p{Cc}\p{Cf}]/u

/**
 * En textos largos se permiten saltos de línea y tabulaciones, pero no el resto de controles
 * ni las marcas que invierten la dirección del texto (usadas para disfrazar enlaces).
 * Los emojis compuestos (que usan ‍) siguen funcionando.
 */
const UNSAFE_IN_MULTILINE = /[\p{Cc}‪-‮⁦-⁩]/u
const ALLOWED_WHITESPACE = /[\n\r\t]/g

/** Texto de una sola línea (nombre, empresa): sin caracteres de control ni invisibles */
export const singleLineText = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} es demasiado largo`)
    .refine((value) => !CONTROL_OR_INVISIBLE.test(value), `${label} contiene caracteres no permitidos`)

/** Texto de varias líneas (mensaje): admite saltos de línea, bloquea controles peligrosos */
export const multilineText = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} es demasiado largo`)
    .refine(
      (value) => !UNSAFE_IN_MULTILINE.test(value.replace(ALLOWED_WHITESPACE, '')),
      `${label} contiene caracteres no permitidos`,
    )

/** Campo opcional del formulario: vacío o solo espacios se guarda como null */
export const optionalField = <T extends z.ZodType<string>>(schema: T) =>
  z
    .preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), schema.optional())
    .transform((value) => value ?? null)

/** Cuenta los enlaces de un texto (http://, https:// o www.) */
export function countLinks(text: string): number {
  return text.match(/https?:\/\/|www\./gi)?.length ?? 0
}
