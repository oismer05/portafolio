import knex from 'knex'
import { knexConfig } from './knexConfig.js'

/** Única instancia de conexión (pool) compartida por toda la aplicación */
export const db = knex(knexConfig)

/**
 * Mide cuánto tarda MySQL en responder.
 * Devuelve los milisegundos, o null si la base de datos no responde.
 */
export async function pingDatabase(): Promise<number | null> {
  const startedAt = performance.now()
  try {
    await db.raw('SELECT 1')
    return Math.round(performance.now() - startedAt)
  } catch {
    return null
  }
}

/** Comprueba que MySQL responde. Se usa al arrancar el servidor */
export async function isDatabaseReachable(): Promise<boolean> {
  return (await pingDatabase()) !== null
}
