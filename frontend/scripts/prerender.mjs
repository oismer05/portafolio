/**
 * Pre-renderizado para SEO y seguridad.
 *
 * Después de `vite build` (cliente) y `vite build --ssr` (servidor), este script:
 *  1. Renderiza <App /> a HTML con React en Node y lo inserta en dist/index.html.
 *  2. Inserta la Content-Security-Policy como <meta> (funciona igual en Vercel, Docker o cualquier hosting).
 *  3. Genera dist/sitemap.xml y dist/robots.txt con el dominio configurado.
 *
 * Resultado: los buscadores reciben la página completa sin ejecutar JavaScript,
 * y el navegador bloquea cualquier script que no sea propio.
 */
import { createHash } from 'node:crypto'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const distDir = `${root}dist`
const ssrDir = `${root}dist-ssr`
const templatePath = `${distDir}/index.html`

// Variables VITE_* del .env o del entorno (Vercel, Docker, GitHub Actions)
const env = { ...loadEnv('production', root, 'VITE_'), ...pickViteVariables(process.env) }
const siteUrl = (env.VITE_SITE_URL || 'https://www.oismersehuanes.com').replace(/\/$/, '')

// 1. Renderizar la app e insertarla en la plantilla generada por Vite
const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href)
const appHtml = render()

const template = await readFile(templatePath, 'utf-8')
if (!template.includes('<!--app-html-->')) {
  throw new Error('No se encontró el marcador <!--app-html--> en dist/index.html')
}
let html = template.replace('<!--app-html-->', appHtml)

// 2. Content-Security-Policy, justo después de <meta charset> (antes de cualquier script)
html = html.replace(/(<meta charset="UTF-8" \/>)/i, `$1\n    <meta http-equiv="Content-Security-Policy" content="${buildContentSecurityPolicy(html)}" />`)
await writeFile(templatePath, html)

// 3. sitemap.xml y robots.txt
const today = new Date().toISOString().slice(0, 10)
await writeFile(
  `${distDir}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
)
await writeFile(
  `${distDir}/robots.txt`,
  `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
)

// El bundle de servidor ya no se necesita
await rm(ssrDir, { recursive: true, force: true })

console.log(`✓ Pre-renderizado completo (${(appHtml.length / 1024).toFixed(1)} KB de HTML) → ${siteUrl}`)

/**
 * Content-Security-Policy estricta: solo se ejecuta JavaScript propio.
 * El único script en línea (el que aplica el modo oscuro antes de pintar) se autoriza por su hash,
 * así que cualquier script inyectado por un atacante sería bloqueado por el navegador.
 *
 * Nota: frame-ancestors no funciona en <meta>; la protección contra iframes va en las
 * cabeceras HTTP (vercel.json y nginx.conf).
 */
function buildContentSecurityPolicy(pageHtml) {
  const inlineScripts = [...pageHtml.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
  const scriptHashes = inlineScripts.map(([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`)

  // Si la API vive en otro dominio (ej. Railway), el navegador debe poder llamarla
  const apiOrigin = /^https?:\/\//.test(env.VITE_API_URL ?? '') ? new URL(env.VITE_API_URL).origin : ''
  const turnstile = env.VITE_TURNSTILE_SITE_KEY ? 'https://challenges.cloudflare.com' : ''
  const isHttpsSite = siteUrl.startsWith('https://')

  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')} ${turnstile}`,
    "style-src 'self' 'unsafe-inline'", // estilos en línea de las animaciones (no ejecutan código)
    "img-src 'self' data:",
    "font-src 'self' data:", // Vite incrusta como data: las fuentes muy pequeñas
    `connect-src 'self' ${apiOrigin}`,
    `frame-src ${turnstile || "'none'"}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    isHttpsSite ? 'upgrade-insecure-requests' : '', // en local (http) rompería las peticiones
  ]
    .filter(Boolean)
    .map((directive) => directive.replace(/\s+/g, ' ').trim())
    .join('; ')
}

/** Solo las variables VITE_* del entorno del proceso */
function pickViteVariables(source) {
  return Object.fromEntries(Object.entries(source).filter(([key]) => key.startsWith('VITE_')))
}
