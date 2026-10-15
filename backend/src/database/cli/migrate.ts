/**
 * CLI de migraciones (envuelve la API de Knex para que funcione con TypeScript y ESM).
 *
 *   npm run migrate              → aplica las migraciones pendientes
 *   npm run migrate:rollback     → revierte el último lote aplicado
 *   npm run migrate:status       → lista migraciones aplicadas y pendientes
 *   npm run migrate:make <nombre> → crea una migración nueva a partir de migration.stub
 */
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from '../connection.js'
import { migrationsDirectory } from '../knexConfig.js'

/** Plantilla base para las migraciones nuevas */
const stubPath = fileURLToPath(new URL('../migration.stub', import.meta.url))

/** Marca de tiempo AAAAMMDDHHmmss: hace que las migraciones se ejecuten en orden de creación */
const timestamp = () => new Date().toISOString().replace(/\D/g, '').slice(0, 14)

type Command = 'latest' | 'rollback' | 'status' | 'make'

const [command, migrationName] = process.argv.slice(2) as [Command | undefined, string | undefined]

async function run(): Promise<void> {
  switch (command) {
    case 'latest': {
      const [batch, applied] = await db.migrate.latest()
      if (applied.length === 0) console.log('✓ La base de datos ya está al día')
      else console.log(`✓ Lote ${batch}: ${applied.length} migración(es) aplicada(s)\n  - ${applied.join('\n  - ')}`)
      break
    }

    case 'rollback': {
      const [batch, reverted] = await db.migrate.rollback()
      if (reverted.length === 0) console.log('✓ No hay migraciones para revertir')
      else console.log(`✓ Lote ${batch} revertido:\n  - ${reverted.join('\n  - ')}`)
      break
    }

    case 'status': {
      const [completed, pending] = await db.migrate.list()
      console.log(`Aplicadas (${completed.length}):`)
      for (const migration of completed) console.log(`  ✓ ${migration.name}`)
      console.log(`Pendientes (${pending.length}):`)
      // Con la fuente personalizada, cada pendiente es el nombre del archivo
      for (const file of pending as string[]) console.log(`  • ${file}`)
      break
    }

    case 'make': {
      if (!migrationName) throw new Error('Indica un nombre: npm run migrate:make add_column_x_to_y')
      const fileName = `${timestamp()}_${migrationName.replace(/[^a-z0-9_]/gi, '_').toLowerCase()}.ts`
      const filePath = path.join(migrationsDirectory, fileName)
      await copyFile(stubPath, filePath)
      console.log(`✓ Migración creada: ${filePath}`)
      break
    }

    default:
      throw new Error(`Comando desconocido "${command ?? ''}". Usa: latest | rollback | status | make`)
  }
}

try {
  await run()
} catch (error) {
  console.error('❌', error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await db.destroy()
}
