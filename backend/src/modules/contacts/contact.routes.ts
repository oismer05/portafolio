import { Router } from 'express'
import { adminLimiter, contactFormLimiter } from '../../middlewares/rateLimiters.js'
import { requireAdmin } from '../../middlewares/requireAdmin.js'
import { validate } from '../../middlewares/validate.js'
import { contactController } from './contact.controller.js'
import {
  contactIdParamsSchema,
  createContactSchema,
  listContactsQuerySchema,
  updateStatusSchema,
} from './contact.schema.js'

export const contactRouter = Router()

// Pública: la usa el formulario de la página
contactRouter.post('/', contactFormLimiter, validate(createContactSchema), contactController.create)

// Privadas: requieren Authorization: Bearer <ADMIN_API_KEY>
// adminLimiter va primero para frenar la fuerza bruta antes de comprobar la clave
contactRouter.use(adminLimiter, requireAdmin)
contactRouter.get('/', validate(listContactsQuerySchema, 'query'), contactController.list)
contactRouter.get('/:id', validate(contactIdParamsSchema, 'params'), contactController.getById)
contactRouter.patch(
  '/:id/status',
  validate(contactIdParamsSchema, 'params'),
  validate(updateStatusSchema),
  contactController.updateStatus,
)
