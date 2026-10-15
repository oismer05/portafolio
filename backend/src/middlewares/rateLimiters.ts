import { rateLimit } from 'express-rate-limit'
import { env } from '../config/env.js'

/** Límite general para toda la API: protege contra ráfagas de peticiones */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiadas peticiones. Inténtalo de nuevo en un momento.' },
})

/**
 * Protección contra fuerza bruta en las rutas de administración:
 * 10 intentos FALLIDOS cada 15 minutos por IP (los exitosos no cuentan).
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos fallidos. Inténtalo más tarde.' },
})

/** Límite estricto para el formulario de contacto: evita spam desde una misma IP */
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Has enviado varios mensajes seguidos. Espera unos minutos e inténtalo otra vez.' },
})
