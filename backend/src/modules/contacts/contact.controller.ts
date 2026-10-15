import type { Request, Response } from 'express'
import type { z } from 'zod'
import type {
  contactIdParamsSchema,
  CreateContactInput,
  ListContactsQuery,
  updateStatusSchema,
} from './contact.schema.js'
import { contactService } from './contact.service.js'

type IdParams = z.infer<typeof contactIdParamsSchema>
type StatusBody = z.infer<typeof updateStatusSchema>

/**
 * Controladores HTTP: traducen la petición a una llamada al servicio y su resultado a JSON.
 * Los datos ya vienen validados por el middleware `validate` en res.locals.
 */
export const contactController = {
  /** POST /api/contacts — público */
  async create(req: Request, res: Response) {
    const input = res.locals.body as CreateContactInput
    await contactService.create(input, {
      ipAddress: req.ip ?? null,
      userAgent: req.get('user-agent') ?? null,
    })

    // Misma respuesta aunque el mensaje fuera spam: no se le da pistas al bot
    res.status(201).json({ message: '¡Gracias! Tu mensaje fue recibido.' })
  },

  /** GET /api/contacts — admin */
  async list(_req: Request, res: Response) {
    const query = res.locals.query as ListContactsQuery
    res.json(await contactService.list(query))
  },

  /** GET /api/contacts/:id — admin */
  async getById(_req: Request, res: Response) {
    const { id } = res.locals.params as IdParams
    res.json({ data: await contactService.getById(id) })
  },

  /** PATCH /api/contacts/:id/status — admin */
  async updateStatus(_req: Request, res: Response) {
    const { id } = res.locals.params as IdParams
    const { status } = res.locals.body as StatusBody
    res.json({ message: 'Estado actualizado', data: await contactService.updateStatus(id, status) })
  },
}
