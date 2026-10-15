import type { RequestHandler } from 'express'
import { z } from 'zod'
import { HttpError } from '../shared/HttpError.js'

type RequestPart = 'body' | 'query' | 'params'

/**
 * Valida una parte de la petición con un esquema de Zod.
 * Si es válida, guarda el resultado ya limpio (trim, tipos convertidos) en `res.locals[part]`;
 * si no, responde 400 con la lista de errores por campo.
 *
 * Nota: en Express 5 `req.query` es de solo lectura, por eso se usa res.locals.
 */
export function validate(schema: z.ZodType, part: RequestPart = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[part])

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      return next(HttpError.badRequest('Revisa los datos enviados', fieldErrors))
    }

    res.locals[part] = result.data
    next()
  }
}
