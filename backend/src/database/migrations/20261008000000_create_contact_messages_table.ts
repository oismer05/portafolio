import type { Knex } from 'knex'

const TABLE = 'contact_messages'

/** Crea la tabla donde se guardan los mensajes del formulario de contacto */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE, (table) => {
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')

    table.increments('id').primary()
    table.string('full_name', 100).notNullable()
    table.string('email', 254).notNullable()
    table.string('phone', 20).nullable()
    table.string('company', 120).nullable()
    table.string('service', 100).notNullable().comment('Servicio de interés elegido en el formulario')
    table.text('message').notNullable()
    table
      .enum('status', ['new', 'read', 'replied', 'archived'])
      .notNullable()
      .defaultTo('new')
      .comment('Seguimiento: nuevo → leído → respondido / archivado')

    // Metadatos para detectar abuso o spam
    table.string('ip_address', 45).nullable()
    table.string('user_agent', 255).nullable()

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    // MySQL actualiza esta columna automáticamente cada vez que cambia la fila
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    table.index(['status', 'created_at'], 'contact_messages_status_created_at_index')
    table.index(['email'], 'contact_messages_email_index')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE)
}
