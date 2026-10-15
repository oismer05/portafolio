import { env } from './env.js'

/**
 * Datos del dueño del portafolio que aparecen en los correos (firma, botones, enlaces).
 * Si cambias tu número, redes o rol, actualízalos aquí.
 */
export const owner = {
  fullName: 'Oismer Sehuanes Guzmán',
  firstName: 'Oismer',
  role: 'Desarrollador Full Stack',
  location: 'Barranquilla, Colombia',
  email: env.MAIL_TO,
  phoneDisplay: '+57 302 410 2301',
  /** Número en formato internacional sin "+" ni espacios, para enlaces de WhatsApp */
  whatsappNumber: '573024102301',
  siteUrl: env.SITE_URL.replace(/\/$/, ''),
  linkedinUrl: 'https://www.linkedin.com/in/oismer-sehuanes-guzman-38904b20a',
  githubUrl: 'https://github.com/Oismer05',
} as const
