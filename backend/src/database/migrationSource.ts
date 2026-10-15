import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Knex } from 'knex'

/**
 * Fuente de migraciones personalizada.
 *
 * Problema que resuelve: en desarrollo se ejecutan archivos .ts y en producción los .js
 * compilados. Knex guarda el nombre con extensión, así que una misma base de datos
 * creería que son migraciones distintas. Aquí el nombre se registra SIN extensión
 * (ej. "20261008000000_create_contact_messages_table") y funciona en ambos entornos.
 */
export class ExtensionAgnosticMigrationSource implements Knex.MigrationSource<string> {
  private readonly directory: string
  private readonly extension: '.ts' | '.js'

  constructor(directory: string, extension: '.ts' | '.js') {
    this.directory = directory
    this.extension = extension
  }

  /** Archivos de migración ordenados por nombre (el prefijo de fecha garantiza el orden) */
  async getMigrations(): Promise<string[]> {
    const files = await readdir(this.directory)
    return files.filter((file) => file.endsWith(this.extension) && !file.endsWith('.d.ts')).sort()
  }

  getMigrationName(file: string): string {
    return path.basename(file, this.extension)
  }

  async getMigration(file: string): Promise<Knex.Migration> {
    return import(pathToFileURL(path.join(this.directory, file)).href)
  }
}
