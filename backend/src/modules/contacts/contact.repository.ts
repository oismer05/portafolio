import { db } from '../../database/connection.js'
import type { ContactMessageRow, ContactStatus, EmailTrackingColumn, NewContactMessage } from './contact.types.js'

const TABLE = 'contact_messages'

/**
 * Capa de acceso a datos: el ÚNICO lugar que conoce la tabla y sus columnas.
 * El resto de la aplicación trabaja con estas funciones, no con SQL.
 */
export const contactRepository = {
  async create(data: NewContactMessage): Promise<number> {
    const [id] = await db<ContactMessageRow>(TABLE).insert(data)
    return id
  },

  /** Mensajes enviados desde un correo a partir de una fecha (usa el índice email + created_at) */
  async countByEmailSince(email: string, since: Date): Promise<number> {
    const [result] = await db<ContactMessageRow>(TABLE)
      .where('email', email)
      .andWhere('created_at', '>=', since)
      .count<{ total: number }[]>({ total: '*' })
    return Number(result?.total ?? 0)
  },

  /** id de un mensaje idéntico (mismo correo y texto) enviado a partir de una fecha */
  async findDuplicateSince(email: string, message: string, since: Date): Promise<number | undefined> {
    const row = await db<ContactMessageRow>(TABLE)
      .select('id')
      .where({ email, message })
      .andWhere('created_at', '>=', since)
      .first()
    return row?.id
  },

  async findById(id: number): Promise<ContactMessageRow | undefined> {
    return db<ContactMessageRow>(TABLE).where({ id }).first()
  },

  async findMany(options: { status?: ContactStatus; limit: number; offset: number }) {
    const baseQuery = db<ContactMessageRow>(TABLE).modify((query) => {
      if (options.status) query.where('status', options.status)
    })

    // Se ejecutan en paralelo: la página de resultados y el total para la paginación
    const [rows, countResult] = await Promise.all([
      baseQuery.clone().orderBy('created_at', 'desc').limit(options.limit).offset(options.offset),
      baseQuery.clone().count<{ total: number }[]>({ total: '*' }),
    ])

    return { rows, total: Number(countResult[0]?.total ?? 0) }
  },

  async updateStatus(id: number, status: ContactStatus): Promise<boolean> {
    // updated_at se actualiza solo (ON UPDATE CURRENT_TIMESTAMP, ver la migración)
    const affectedRows = await db<ContactMessageRow>(TABLE).where({ id }).update({ status })
    return affectedRows > 0
  },

  /** Guarda la fecha en que salió un correo (notificación o confirmación) */
  async markEmailSent(id: number, column: EmailTrackingColumn): Promise<void> {
    await db<ContactMessageRow>(TABLE)
      .where({ id })
      .update({ [column]: db.fn.now() })
  },
}
