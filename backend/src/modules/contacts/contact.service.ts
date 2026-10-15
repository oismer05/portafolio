import { HttpError } from '../../shared/HttpError.js'
import { logger } from '../../shared/logger.js'
import { evaluateSubmission } from './contact.antispam.js'
import { sendContactEmails } from './contact.notifications.js'
import { contactRepository } from './contact.repository.js'
import type { CreateContactInput, ListContactsQuery } from './contact.schema.js'
import type { ContactMessageDto, ContactMessageRow, ContactStatus } from './contact.types.js'

/** Datos de la petición que se guardan para detectar abuso */
interface RequestMetadata {
  ipAddress: string | null
  userAgent: string | null
}

/** Convierte la fila de la base de datos (snake_case) al formato de la API (camelCase) */
function toDto(row: ContactMessageRow): ContactMessageDto {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    service: row.service,
    message: row.message,
    status: row.status,
    ownerNotifiedAt: row.owner_notified_at,
    confirmationSentAt: row.confirmation_sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Reglas de negocio de los mensajes de contacto */
export const contactService = {
  /**
   * Registra un mensaje nuevo y envía los correos de notificación y confirmación.
   * Devuelve null si el envío se descartó por ser de un bot.
   */
  async create(input: CreateContactInput, metadata: RequestMetadata): Promise<number | null> {
    const verdict = await evaluateSubmission(input, metadata.ipAddress)

    if (verdict.action === 'discard') {
      logger.warn(`Envío descartado como bot (${verdict.reason})`, { ip: metadata.ipAddress })
      return null
    }
    if (verdict.action === 'duplicate') {
      logger.info(`Envío duplicado ignorado (ya existe #${verdict.existingId})`)
      return verdict.existingId
    }

    const id = await contactRepository.create({
      full_name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      service: input.service,
      message: input.message,
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent?.slice(0, 255) ?? null,
    })

    logger.info(`Nuevo mensaje de contacto #${id} (${input.service})`)

    // Sin await: el visitante recibe su respuesta al instante y los correos salen en segundo plano
    void sendContactEmails({
      id,
      fullName: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      service: input.service,
      message: input.message,
      receivedAt: new Date(),
    })

    return id
  },

  async list({ status, page, limit }: ListContactsQuery) {
    const { rows, total } = await contactRepository.findMany({ status, limit, offset: (page - 1) * limit })
    return {
      data: rows.map(toDto),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  },

  async getById(id: number): Promise<ContactMessageDto> {
    const row = await contactRepository.findById(id)
    if (!row) throw HttpError.notFound(`No existe el mensaje #${id}`)
    return toDto(row)
  },

  async updateStatus(id: number, status: ContactStatus): Promise<ContactMessageDto> {
    const updated = await contactRepository.updateStatus(id, status)
    if (!updated) throw HttpError.notFound(`No existe el mensaje #${id}`)
    return this.getById(id)
  },
}
