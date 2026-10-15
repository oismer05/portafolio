import type { Knex } from 'knex'

const TABLE = 'contact_messages'

/**
 * Registra cuándo salió cada correo de un mensaje de contacto.
 * NULL = el correo no se ha enviado (falló o el envío está en modo vista previa).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (table) => {
    table.timestamp('owner_notified_at').nullable().after('status').comment('Envío de la notificación al dueño')
    table.timestamp('confirmation_sent_at').nullable().after('owner_notified_at').comment('Envío de la confirmación al cliente')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (table) => {
    table.dropColumn('confirmation_sent_at')
    table.dropColumn('owner_notified_at')
  })
}
