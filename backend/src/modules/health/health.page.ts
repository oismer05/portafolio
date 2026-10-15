import { owner } from '../../config/owner.js'
import { escapeHtml } from '../../shared/html.js'
import type { HealthReport } from './health.service.js'

/** Segundos entre recargas automáticas de la página */
const REFRESH_SECONDS = 30

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'America/Bogota',
})

/** 9240 → "2 h 34 min" */
function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  if (days > 0) return `${days} d ${hours} h`
  if (hours > 0) return `${hours} h ${minutes} min`
  if (minutes > 0) return `${minutes} min`
  return `${totalSeconds} s`
}

interface StatCard {
  label: string
  value: string
  detail: string
  tone: 'ok' | 'down' | 'neutral'
  icon: string
}

/** Íconos SVG en línea (trazos al estilo de lucide) */
const icons = {
  server:
    '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  commit: '<circle cx="12" cy="12" r="3.5"/><path d="M3 12h5.5M15.5 12H21"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
} as const

const svgIcon = (paths: string, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

/**
 * Página de estado que ve una persona al abrir la API en el navegador.
 * Sin JavaScript (compatible con la CSP de Helmet): se recarga sola con <meta refresh>.
 */
export function renderHealthPage(report: HealthReport): string {
  const isHealthy = report.status === 'ok'
  const siteHost = owner.siteUrl.replace(/^https?:\/\//, '')

  const cards: StatCard[] = [
    {
      label: 'API',
      value: 'En línea',
      detail: `Activa hace ${formatUptime(report.uptimeSeconds)}`,
      tone: 'ok',
      icon: icons.server,
    },
    {
      label: 'Base de datos',
      value: isHealthy ? 'MySQL conectado' : 'Sin conexión',
      detail: isHealthy ? `Responde en ${report.databaseLatencyMs} ms` : 'Reintentando automáticamente',
      tone: isHealthy ? 'ok' : 'down',
      icon: icons.database,
    },
    {
      label: 'Versión desplegada',
      value: report.version ? `#${report.version}` : 'Local',
      detail: report.versionMessage ?? 'Fuera de Railway',
      tone: 'neutral',
      icon: icons.commit,
    },
    {
      label: 'Entorno',
      value: report.environment === 'production' ? 'Producción' : report.environment,
      detail: `Desde ${dateFormatter.format(new Date(report.startedAt))}`,
      tone: 'neutral',
      icon: icons.globe,
    },
  ]

  const endpoints = [
    { method: 'GET', path: '/api/health', description: 'Estado del servicio', isPrivate: false },
    { method: 'POST', path: '/api/contacts', description: 'Formulario de contacto', isPrivate: false },
    { method: 'GET', path: '/api/contacts', description: 'Mensajes recibidos', isPrivate: true },
  ]

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="${REFRESH_SECONDS}">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#12111a">
  <link rel="icon" href="${faviconDataUri}">
  <title>${isHealthy ? 'Operativo' : 'Degradado'} · API del portafolio OSG</title>
  <style>${styles}</style>
</head>
<body>
  <div class="glow" aria-hidden="true"></div>
  <main class="shell">
    <header class="brand">
      ${logoSvg}
      <div>
        <p class="brand-name">${escapeHtml(owner.fullName)}</p>
        <p class="brand-tag">&lt;<span>API</span> /&gt; · Portafolio</p>
      </div>
    </header>

    <section class="hero">
      <span class="status ${isHealthy ? 'status-ok' : 'status-down'}">
        <span class="pulse" aria-hidden="true"></span>
        ${isHealthy ? 'Todos los sistemas operativos' : 'Servicio degradado'}
      </span>
      <h1>${isHealthy ? 'Todo funciona <em>correctamente</em>' : 'La base de datos <em>no responde</em>'}</h1>
      <p class="lead">
        Esta es la API que recibe los mensajes del formulario de contacto de
        <a href="${escapeHtml(owner.siteUrl)}">${escapeHtml(siteHost)}</a>, los guarda en MySQL
        y envía las notificaciones por correo.
      </p>
    </section>

    <section class="grid" aria-label="Estado de los componentes">
      ${cards
        .map(
          (card, index) => `
      <article class="card" style="animation-delay:${0.08 * index + 0.15}s">
        <div class="card-head">
          <span class="card-icon tone-${card.tone}">${svgIcon(card.icon)}</span>
          <span class="card-label">${escapeHtml(card.label)}</span>
        </div>
        <p class="card-value">${escapeHtml(card.value)}</p>
        <p class="card-detail" title="${escapeHtml(card.detail)}">${escapeHtml(card.detail)}</p>
      </article>`,
        )
        .join('')}
    </section>

    <section class="endpoints" aria-label="Endpoints disponibles">
      <h2>Endpoints</h2>
      <ul>
        ${endpoints
          .map(
            (endpoint) => `
        <li>
          <span class="method method-${endpoint.method.toLowerCase()}">${endpoint.method}</span>
          <code>${endpoint.path}</code>
          <span class="endpoint-desc">${endpoint.description}</span>
          ${endpoint.isPrivate ? `<span class="private">${svgIcon(icons.lock, 14)} Privado</span>` : '<span class="public">Público</span>'}
        </li>`,
          )
          .join('')}
      </ul>
    </section>

    <nav class="actions">
      <a class="btn btn-primary" href="${escapeHtml(owner.siteUrl)}">Ver el portafolio ${svgIcon(icons.arrow, 16)}</a>
      <a class="btn btn-ghost" href="/api/health?format=json">Ver JSON</a>
    </nav>

    <footer class="foot">
      Actualizado ${dateFormatter.format(new Date(report.timestamp))} (hora de Colombia) · se recarga cada ${REFRESH_SECONDS} s
    </footer>
  </main>
</body>
</html>`
}

/** Ícono de la pestaña: el isotipo OSG incrustado como data URI (la CSP de Helmet permite img data:) */
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#2e2668"/><g fill="none" stroke="#e2dcf9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="30" r="7"/><path d="M37 24.5C35.6 22.7 33.8 22 32 22c-3.3 0-5.5 1.9-5.5 4.3 0 4.7 11 2.7 11 7.5 0 2.4-2.2 4.2-5.5 4.2-2 0-4.2-.7-5.5-2.7"/><path d="M53.95 25.05A7 7 0 1 0 56 30h-6"/></g><rect x="8" y="44" width="14" height="3.5" rx="1.75" fill="#a3deca"/></svg>',
)}`

/** Isotipo OSG (el mismo del portafolio) */
const logoSvg = `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true">
  <defs><linearGradient id="osg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3b3182"/><stop offset="1" stop-color="#1e1b2e"/></linearGradient></defs>
  <rect width="64" height="64" rx="18" fill="url(#osg)"/>
  <rect x=".75" y=".75" width="62.5" height="62.5" rx="17.25" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>
  <g fill="none" stroke="#e2dcf9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="15" cy="30" r="7"/>
    <path d="M37 24.5C35.6 22.7 33.8 22 32 22c-3.3 0-5.5 1.9-5.5 4.3 0 4.7 11 2.7 11 7.5 0 2.4-2.2 4.2-5.5 4.2-2 0-4.2-.7-5.5-2.7"/>
    <path d="M53.95 25.05A7 7 0 1 0 56 30h-6"/>
  </g>
  <rect x="8" y="44" width="14" height="3.5" rx="1.75" fill="#a3deca"/>
</svg>`

const styles = `
  :root {
    --canvas: #12111a; --surface: #1b1a26; --line: #2e2c40;
    --ink: #eceaf5; --muted: #a19fb5; --brand: #a996e8;
    --mint: #a3deca; --mint-600: #74c7aa; --peach: #ee9f82;
    --font: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    --mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    min-height: 100vh; background: var(--canvas); color: var(--ink); font-family: var(--font);
    background-image: radial-gradient(var(--line) 1px, transparent 1px); background-size: 24px 24px;
    -webkit-font-smoothing: antialiased;
  }
  .glow {
    position: fixed; inset: -20% -10% auto; height: 70vh; pointer-events: none;
    background: radial-gradient(ellipse at 30% 20%, rgba(91,71,184,.35), transparent 60%),
                radial-gradient(ellipse at 80% 0%, rgba(46,38,104,.55), transparent 55%);
    filter: blur(20px);
  }
  .shell { position: relative; max-width: 880px; margin: 0 auto; padding: 48px 20px 40px; }
  a { color: var(--brand); text-decoration: none; }
  a:hover { text-decoration: underline; }

  .brand { display: flex; align-items: center; gap: 14px; animation: rise .7s cubic-bezier(.16,1,.3,1) both; }
  .logo { width: 48px; height: 48px; filter: drop-shadow(0 8px 24px rgba(91,71,184,.45)); }
  .brand-name { font-weight: 700; font-size: 16px; }
  .brand-tag { font-family: var(--mono); font-size: 12px; color: var(--muted); margin-top: 2px; }
  .brand-tag span { color: var(--brand); }

  .hero { margin: 56px 0 40px; animation: rise .8s .05s cubic-bezier(.16,1,.3,1) both; }
  .status {
    display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 999px;
    font-size: 13px; font-weight: 600; border: 1px solid;
  }
  .status-ok { color: var(--mint); background: rgba(163,222,202,.08); border-color: rgba(163,222,202,.25); }
  .status-down { color: var(--peach); background: rgba(238,159,130,.08); border-color: rgba(238,159,130,.3); }
  .pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
  .pulse::after {
    content: ''; position: absolute; inset: 0; border-radius: 50%; background: currentColor;
    animation: ping 1.8s cubic-bezier(0,0,.2,1) infinite;
  }
  h1 { margin-top: 20px; font-size: clamp(32px, 6vw, 52px); line-height: 1.08; letter-spacing: -.02em; font-weight: 800; }
  h1 em {
    font-style: normal; background: linear-gradient(115deg, #f1eefc, #cbbff3 50%, #a996e8);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .lead { margin-top: 16px; max-width: 620px; color: var(--muted); font-size: 17px; line-height: 1.7; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }
  .card {
    min-width: 0; padding: 20px; border-radius: 20px; background: rgba(27,26,38,.75);
    border: 1px solid var(--line); backdrop-filter: blur(8px);
    animation: rise .7s cubic-bezier(.16,1,.3,1) both; transition: transform .3s, border-color .3s;
  }
  .card:hover { transform: translateY(-3px); border-color: rgba(169,150,232,.45); }
  .card-head { display: flex; align-items: center; gap: 10px; }
  .card-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; }
  .tone-ok { color: var(--mint); background: rgba(163,222,202,.1); }
  .tone-down { color: var(--peach); background: rgba(238,159,130,.12); }
  .tone-neutral { color: var(--brand); background: rgba(169,150,232,.12); }
  .card-label { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .card-value { margin-top: 16px; font-size: 20px; font-weight: 700; }
  .card-detail { margin-top: 4px; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .endpoints {
    margin-top: 28px; padding: 22px; border-radius: 20px; border: 1px solid var(--line); background: rgba(27,26,38,.6);
    animation: rise .8s .45s cubic-bezier(.16,1,.3,1) both;
  }
  .endpoints h2 { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  .endpoints ul { list-style: none; padding: 0; margin-top: 12px; }
  .endpoints li {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 12px 0;
    border-top: 1px solid var(--line); font-size: 14px;
  }
  .endpoints li:first-child { border-top: 0; }
  .method { font-family: var(--mono); font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; min-width: 50px; text-align: center; }
  .method-get { color: var(--mint); background: rgba(163,222,202,.1); }
  .method-post { color: var(--brand); background: rgba(169,150,232,.14); }
  code { font-family: var(--mono); font-size: 13px; }
  .endpoint-desc { color: var(--muted); flex: 1; }
  .public, .private { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
  .private { color: var(--peach); }

  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; animation: rise .8s .55s cubic-bezier(.16,1,.3,1) both; }
  .btn {
    display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 22px; border-radius: 999px;
    font-weight: 600; font-size: 15px; transition: transform .25s, box-shadow .25s, background .25s;
  }
  .btn:hover { text-decoration: none; transform: translateY(-2px); }
  .btn-primary { background: var(--ink); color: var(--canvas); box-shadow: 0 10px 30px rgba(91,71,184,.35); }
  .btn-ghost { color: var(--ink); border: 1px solid var(--line); }
  .btn-ghost:hover { background: var(--surface); }

  .foot { margin-top: 36px; font-size: 12px; color: var(--muted); }

  @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes ping { 75%, 100% { transform: scale(2.6); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`
