import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { logger } from '../../../shared/logger.js'
import type { MailProvider } from './types.js'

/** Carpeta donde se guardan las vistas previas (está en .gitignore) */
export const previewDirectory = path.resolve(process.cwd(), '.mail-previews')

/** "Nuevo contacto: Ana — Pagos" → "nuevo-contacto-ana-pagos" */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase()
}

/** Sin proveedor configurado: cada correo se guarda como .html para revisarlo en el navegador */
export const previewProvider: MailProvider = {
  name: 'vista previa',
  deliversRealEmail: false,
  async send(message) {
    await mkdir(previewDirectory, { recursive: true })
    const filePath = path.join(previewDirectory, `${Date.now()}-${slugify(message.subject)}.html`)
    await writeFile(filePath, message.html, 'utf-8')
    logger.info(`📨 [vista previa] "${message.subject}" → ${message.to}\n   ${filePath}`)
  },
}
