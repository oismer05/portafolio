import { Router, type Request, type Response } from 'express'
import { renderHealthPage } from './health.page.js'
import { getHealthReport } from './health.service.js'

export const healthRouter = Router()

/**
 * Estado del servicio, con negociación de contenido:
 * - Navegadores (Accept: text/html) → página de estado con diseño.
 * - Railway, Docker, el CI y cualquier cliente de API → JSON.
 * Con ?format=json se fuerza el JSON también desde el navegador.
 */
export async function sendHealth(req: Request, res: Response) {
  const report = await getHealthReport()
  const statusCode = report.status === 'ok' ? 200 : 503
  const wantsHtml = req.query.format !== 'json' && req.accepts(['json', 'html']) === 'html'

  res.setHeader('Cache-Control', 'no-store') // el estado siempre debe ser actual
  if (wantsHtml) res.status(statusCode).type('html').send(renderHealthPage(report))
  else res.status(statusCode).json(report)
}

healthRouter.get('/', sendHealth)
