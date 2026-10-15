import { z } from 'zod'

/** Texto opcional: una variable vacía en el .env (ej. "SMTP_HOST=") se trata como no definida */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)

/**
 * Variables de entorno validadas al arrancar.
 * Si falta algo obligatorio o tiene un formato incorrecto, la API no inicia
 * y muestra exactamente qué variable revisar (mejor fallar pronto que en producción).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  /** Orígenes permitidos por CORS, separados por coma */
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),

  /** Número de proxies delante de la API (Nginx, Render, Railway...). Necesario para leer la IP real */
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  // Base de datos MySQL
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1, 'DB_USER es obligatorio'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1, 'DB_NAME es obligatorio'),

  // ─── Anti-bots ─────────────────────────────────────────────────
  /** Máximo de envíos del formulario por IP cada 15 minutos */
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  /** Máximo de mensajes por correo electrónico en 24 horas */
  MAX_MESSAGES_PER_EMAIL_PER_DAY: z.coerce.number().int().positive().default(3),
  /** Tiempo mínimo (ms) para llenar el formulario; más rápido = bot */
  MIN_FORM_FILL_MS: z.coerce.number().int().nonnegative().default(3000),
  /** Clave secreta de Cloudflare Turnstile. Vacía = Turnstile desactivado */
  TURNSTILE_SECRET_KEY: optionalText,

  /** Clave para consultar los mensajes recibidos (cabecera Authorization: Bearer <clave>) */
  ADMIN_API_KEY: z.string().min(24, 'ADMIN_API_KEY debe tener al menos 24 caracteres'),

  /** URL pública del portafolio: se usa en los enlaces de los correos */
  SITE_URL: z.url('SITE_URL debe ser una URL válida').default('http://localhost:5173'),

  // ─── Correo (SMTP) ─────────────────────────────────────────────
  // Si SMTP_HOST está vacío, los correos NO se envían: se guardan como HTML en .mail-previews/
  SMTP_HOST: optionalText,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: optionalText,
  SMTP_PASS: optionalText,
  /** Nombre que verá el destinatario como remitente */
  MAIL_FROM_NAME: z.string().default('Oismer Sehuanes'),
  /** Bandeja donde llegan las notificaciones de nuevos mensajes (la tuya) */
  MAIL_TO: z.email('MAIL_TO debe ser un correo válido').default('oismer3405@gmail.com'),
})

/** Valores de ejemplo que nunca deben llegar a producción */
const PLACEHOLDER_ADMIN_KEY = 'cambia-esta-clave-por-una-larga-y-aleatoria'

/** En producción se exige una configuración segura: mejor no arrancar que arrancar vulnerable */
const productionSafeEnvSchema = envSchema.superRefine((config, ctx) => {
  if (config.NODE_ENV !== 'production') return

  if (config.ADMIN_API_KEY === PLACEHOLDER_ADMIN_KEY || config.ADMIN_API_KEY.length < 32) {
    ctx.addIssue({ code: 'custom', path: ['ADMIN_API_KEY'], message: 'usa una clave aleatoria de al menos 32 caracteres' })
  }
  if (/localhost|127\.0\.0\.1/.test(config.SITE_URL)) {
    ctx.addIssue({ code: 'custom', path: ['SITE_URL'], message: 'debe ser el dominio público del portafolio' })
  }
  if (config.CORS_ORIGINS.some((origin) => origin.includes('localhost'))) {
    ctx.addIssue({ code: 'custom', path: ['CORS_ORIGINS'], message: 'no debe incluir localhost en producción' })
  }
})

const parsed = productionSafeEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:')
  for (const issue of parsed.error.issues) {
    console.error(`   • ${issue.path.join('.')}: ${issue.message}`)
  }
  console.error('   Revisa tu archivo .env (puedes partir de .env.example)')
  process.exit(1)
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'

// En plataformas como Railway la base de datos solo es accesible por su red privada,
// por eso usar root no bloquea el arranque, pero se recomienda un usuario con permisos mínimos
if (isProduction && env.DB_USER === 'root') {
  console.warn('⚠️  DB_USER=root en producción: considera un usuario de MySQL con permisos limitados (ver README)')
}
