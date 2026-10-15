import type { ErrorRequestHandler, RequestHandler } from 'express'
import { isProduction } from '../config/env.js'
import { HttpError } from '../shared/HttpError.js'
import { logger } from '../shared/logger.js'

/** Mensajes claros para los errores que lanza express.json() */
const REQUEST_ERROR_MESSAGES: Record<string, string> = {
  'entity.parse.failed': 'El cuerpo de la petición no es un JSON válido',
  'entity.too.large': 'El contenido enviado es demasiado grande',
  'charset.unsupported': 'Codificación de caracteres no soportada',
  'encoding.unsupported': 'Codificación de contenido no soportada',
  'request.aborted': 'La petición se interrumpió',
}

function getRequestErrorMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('type' in error) || !('status' in error)) return null
  const { type, status } = error as { type: unknown; status: unknown }
  if (typeof status !== 'number' || status >= 500 || typeof type !== 'string') return null
  return REQUEST_ERROR_MESSAGES[type] ?? 'Petición inválida'
}

/** Responde 404 a cualquier ruta que no exista */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  // Se recorta la ruta: no tiene sentido devolver URLs gigantes que envíe un atacante
  next(HttpError.notFound(`La ruta ${req.method} ${req.path.slice(0, 100)} no existe`))
}

/**
 * Manejador central de errores (Express 5 envía aquí también los errores de funciones async).
 * Los errores esperados (HttpError) se devuelven tal cual; los inesperados se registran
 * y se responden con un mensaje genérico para no filtrar detalles internos.
 */
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.details })
    return
  }

  // Errores del lector de JSON de Express: son culpa de la petición (4xx), no del servidor
  const requestErrorMessage = getRequestErrorMessage(error)
  if (requestErrorMessage) {
    res.status(error.status).json({ message: requestErrorMessage })
    return
  }

  logger.error(`Error no controlado en ${req.method} ${req.originalUrl}`, error)
  res.status(500).json({
    message: 'Ocurrió un error interno. Inténtalo más tarde.',
    ...(isProduction ? {} : { debug: error instanceof Error ? error.message : String(error) }),
  })
}
