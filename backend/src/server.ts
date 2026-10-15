import { createApp } from './app.js'
import { env } from './config/env.js'
import { db, isDatabaseReachable } from './database/connection.js'
import { mailMode, previewDirectory, verifyMailer } from './services/mail/mailer.js'
import { logger } from './shared/logger.js'

const app = createApp()

const server = app.listen(env.PORT, async () => {
  logger.info(`🚀 API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`)

  const databaseUp = await isDatabaseReachable()
  if (databaseUp) logger.info(`🗄️  MySQL conectado (${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME})`)
  else logger.warn('⚠️  No se pudo conectar a MySQL. Revisa las variables DB_* y que el servidor esté encendido')

  if (mailMode === 'smtp') {
    const smtpReady = await verifyMailer()
    if (smtpReady) logger.info(`📧 Correo activo: se enviarán notificaciones a ${env.MAIL_TO}`)
  } else {
    logger.info(`📧 Correo en modo vista previa (sin SMTP): los correos se guardan en ${previewDirectory}`)
  }
})

// Tiempos máximos por conexión: evitan que clientes lentos (ataque "slowloris") acaparen el servidor
server.headersTimeout = 10_000
server.requestTimeout = 15_000

// Errores que escaparon a todo manejo: se registran siempre
process.on('unhandledRejection', (reason) => logger.error('Promesa rechazada sin manejar', reason))
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada: el proceso se reiniciará', error)
  process.exit(1) // el gestor de procesos (PM2, Docker, la plataforma) lo vuelve a levantar
})

/** Cierre ordenado: deja de aceptar peticiones y libera las conexiones a la base de datos */
async function shutdown(signal: string) {
  logger.info(`${signal} recibido, cerrando servidor...`)
  server.close(async () => {
    await db.destroy()
    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
