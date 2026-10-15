import type { Knex } from 'knex'

const TABLE = 'contact_messages'

/**
 * Reemplaza el índice por email por uno compuesto (email + created_at).
 * Las validaciones anti-spam buscan "mensajes de este correo en las últimas 24 h":
 * con este índice MySQL resuelve esa consulta sin recorrer la tabla, aunque crezca mucho.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (table) => {
    table.index(['email', 'created_at'], 'contact_messages_email_created_at_index')
    table.dropIndex(['email'], 'contact_messages_email_index')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (table) => {
    table.index(['email'], 'contact_messages_email_index')
    table.dropIndex(['email', 'created_at'], 'contact_messages_email_created_at_index')
  })
}
