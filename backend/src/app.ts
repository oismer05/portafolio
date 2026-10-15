import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { z } from 'zod'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import { apiLimiter } from './middlewares/rateLimiters.js'
import { contactRouter } from './modules/contacts/contact.routes.js'
import { healthRouter, sendHealth } from './modules/health/health.routes.js'

// Mensajes de validación de Zod en español (ej. "campo obligatorio" en vez de "Invalid input")
z.config(z.locales.es())

/** Construye la aplicación Express (separada de server.ts para poder probarla sin abrir un puerto) */
export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', env.TRUST_PROXY) // IP real del visitante detrás de un proxy

  // Seguridad y parseo
  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGINS, methods: ['GET', 'POST', 'PATCH'] }))
  app.use(express.json({ limit: '20kb' }))
  app.use('/api', apiLimiter)

  // Rutas
  app.get('/', apiLimiter, sendHealth) // la raíz muestra la misma página de estado
  app.use('/api/health', healthRouter)
  app.use('/api/contacts', contactRouter)

  // Manejo de errores (siempre al final)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
