/**
 * Configuración global del sitio.
 * Los valores sensibles al entorno se leen de variables VITE_* (ver .env.example).
 */
export const siteConfig = {
  /** Dominio público definitivo. Se usa en SEO (canonical, Open Graph, sitemap) */
  url: import.meta.env.VITE_SITE_URL ?? 'https://www.oismersehuanes.com',
  /** Base de la API del backend. En desarrollo Vite redirige /api al servidor local */
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  /** Clave pública de Cloudflare Turnstile (anti-bots). Vacía = desactivado */
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || null,
  /** Ruta del CV descargable dentro de /public */
  cvPath: '/cv/Oismer-Sehuanes-Guzman-CV.pdf',
} as const
