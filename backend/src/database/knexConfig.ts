import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Knex } from 'knex'
import { env } from '../config/env.js'
import { ExtensionAgnosticMigrationSource } from './migrationSource.js'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)

/**
 * En desarrollo (tsx) se ejecutan los archivos .ts de src/;
 * en producción, los .js compilados en dist/. Las migraciones deben coincidir.
 */
const runtimeExtension = path.extname(currentFile) === '.ts' ? '.ts' : '.js'

/** Carpeta de las migraciones (src/database/migrations o dist/database/migrations) */
export const migrationsDirectory = path.join(currentDir, 'migrations')

type RawConnection = { query: (sql: string, callback: (error: Error | null) => void) => void }

/**
 * Cada conexión nueva trabaja en UTC, sin importar la zona horaria del servidor MySQL.
 * Así CURRENT_TIMESTAMP y las fechas que lee Node significan lo mismo.
 */
function useUtcTimeZone(connection: RawConnection, done: (error: Error | null, connection: RawConnection) => void) {
  connection.query("SET time_zone = '+00:00'", (error) => done(error, connection))
}

export const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    charset: 'utf8mb4', // soporta tildes, ñ y emojis
    timezone: 'Z', // fechas en UTC
  },
  pool: {
    min: 0,
    max: 10,
    afterCreate: useUtcTimeZone,
  },
  migrations: {
    tableName: 'knex_migrations',
    migrationSource: new ExtensionAgnosticMigrationSource(migrationsDirectory, runtimeExtension),
  },
}
