import { siteConfig } from '@/config/site'
import type { ContactFormValues } from '@/schemas/contactSchema'

/** Error con un mensaje apto para mostrar al usuario */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface CreateContactResponse {
  message: string
  data: { id: number }
}

/** Lo que se envía al backend: los campos del formulario + señales anti-bots */
export interface ContactPayload extends ContactFormValues {
  /** Milisegundos que tardó la persona en llenar el formulario */
  elapsedMs: number
  /** Token de Cloudflare Turnstile, si está activado */
  turnstileToken?: string
}

/** Envía el formulario de contacto al backend (POST /api/contacts) */
export async function sendContactMessage(payload: ContactPayload): Promise<CreateContactResponse> {
  let response: Response

  try {
    response = await fetch(`${siteConfig.apiUrl}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Sin conexión o servidor caído
    throw new ApiError('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.', 0)
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const fallback =
      response.status === 429
        ? 'Has enviado varios mensajes seguidos. Espera unos minutos e inténtalo otra vez.'
        : 'Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo más tarde.'
    throw new ApiError(body?.message ?? fallback, response.status)
  }

  return body as CreateContactResponse
}
