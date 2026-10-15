import { env } from '../../config/env.js'
import { pingDatabase } from '../../database/connection.js'

/** Momento en que arrancó este proceso (sirve para calcular el tiempo en línea) */
const processStartedAt = new Date()

export interface HealthReport {
  status: 'ok' | 'degraded'
  database: 'up' | 'down'
  databaseLatencyMs: number | null
  uptimeSeconds: number
  startedAt: string
  environment: string
  /** Commit desplegado (7 caracteres) o null fuera de Railway */
  version: string | null
  versionMessage: string | null
  timestamp: string
}

/** Estado actual de la API y sus dependencias */
export async function getHealthReport(): Promise<HealthReport> {
  const databaseLatencyMs = await pingDatabase()
  const databaseUp = databaseLatencyMs !== null

  return {
    status: databaseUp ? 'ok' : 'degraded',
    database: databaseUp ? 'up' : 'down',
    databaseLatencyMs,
    uptimeSeconds: Math.floor(process.uptime()),
    startedAt: processStartedAt.toISOString(),
    environment: env.NODE_ENV,
    version: env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    // Solo la primera línea del mensaje del commit
    versionMessage: env.RAILWAY_GIT_COMMIT_MESSAGE?.split('\n')[0] ?? null,
    timestamp: new Date().toISOString(),
  }
}
