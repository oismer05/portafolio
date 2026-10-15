/**
 * Error con código HTTP. Lánzalo desde cualquier capa y el middleware
 * errorHandler lo convertirá en la respuesta JSON adecuada.
 */
export class HttpError extends Error {
  readonly statusCode: number
  readonly details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.details = details
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, message, details)
  }

  static unauthorized(message = 'No autorizado') {
    return new HttpError(401, message)
  }

  static notFound(message = 'Recurso no encontrado') {
    return new HttpError(404, message)
  }
}
