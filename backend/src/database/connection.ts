import knex from 'knex'
import { knexConfig } from './knexConfig.js'

/** Única instancia de conexión (pool) compartida por toda la aplicación */
export const db = knex(knexConfig)

/** Comprueba que MySQL responde. Se usa en /api/health y al arrancar */
export async function isDatabaseReachable(): Promise<boolean> {
  try {
    await db.raw('SELECT 1')
    return true
  } catch {
    return false
  }
}
