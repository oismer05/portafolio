import { createHash, timingSafeEqual } from 'node:crypto'
import type { RequestHandler } from 'express'
import { env } from '../config/env.js'
import { HttpError } from '../shared/HttpError.js'

/** Huella SHA-256: permite comparar en tiempo constante aunque las longitudes difieran */
const fingerprint = (value: string) => createHash('sha256').update(value).digest()
const expectedKey = fingerprint(env.ADMIN_API_KEY)

/**
 * Protege las rutas de administración.
 * Requiere la cabecera:  Authorization: Bearer <ADMIN_API_KEY>
 */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')

  // timingSafeEqual evita ataques que adivinan la clave midiendo tiempos de respuesta
  const isValid = scheme === 'Bearer' && token !== undefined && timingSafeEqual(fingerprint(token), expectedKey)

  if (!isValid) return next(HttpError.unauthorized())
  next()
}
