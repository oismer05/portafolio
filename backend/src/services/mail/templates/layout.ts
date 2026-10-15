/**
 * Piezas base para construir correos HTML.
 *
 * Los clientes de correo (Gmail, Outlook, Apple Mail) NO soportan CSS moderno:
 * por eso todo se maqueta con <table> y estilos en línea. Cada función devuelve
 * un fragmento HTML listo para combinar dentro de `emailLayout`.
 */
import { owner } from '../../../config/owner.js'
import { escapeHtml } from '../../../shared/html.js'

/** Paleta de la marca (la misma de la página web) */
export const colors = {
  canvas: '#f4f2ee',
  surface: '#ffffff',
  ink: '#1e1b2e',
  inkDeep: '#2e2668',
  muted: '#625f75',
  line: '#ece9f2',
  brand: '#5b47b8',
  lavender50: '#f8f6fe',
  lavender100: '#f1eefc',
  lavender200: '#e2dcf9',
  mint: '#a3deca',
  mint100: '#e6f6f0',
  mint600: '#3a8f73',
} as const

const fontStack = "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif"
const monoStack = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"

interface LayoutOptions {
  /** Texto corto que se ve junto al asunto en la bandeja de entrada */
  preheader: string
  /** Etiqueta pequeña sobre el título (ej. "Nuevo mensaje · #12") */
  eyebrow: string
  title: string
  subtitle: string
  /** Contenido principal (HTML ya escapado) */
  body: string
  /** Texto del pie de página (HTML ya escapado) */
  footer: string
}

/** Estructura completa del correo: logo, banda de título, tarjeta de contenido y pie */
export function emailLayout({ preheader, eyebrow, title, subtitle, body, footer }: LayoutOptions): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .stack { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; }
      .title { font-size: 24px !important; }
    }
    a { color: ${colors.brand}; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${colors.canvas}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.canvas}">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- Logo -->
          <tr>
            <td style="padding:0 8px 20px 8px;">${brandHeader()}</td>
          </tr>

          <!-- Banda de título -->
          <tr>
            <td class="px" bgcolor="${colors.inkDeep}" style="background-color:${colors.inkDeep}; background-image:linear-gradient(135deg, ${colors.inkDeep} 0%, ${colors.ink} 100%); border-radius:20px 20px 0 0; padding:36px 40px 32px 40px;">
              <span style="display:inline-block; font-family:${fontStack}; font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:${colors.mint}; background-color:rgba(163,222,202,0.12); border-radius:999px; padding:6px 12px;">${escapeHtml(eyebrow)}</span>
              <h1 class="title" style="margin:16px 0 0 0; font-family:${fontStack}; font-size:28px; line-height:1.25; font-weight:700; color:#ffffff;">${escapeHtml(title)}</h1>
              <p style="margin:10px 0 0 0; font-family:${fontStack}; font-size:15px; line-height:1.6; color:${colors.lavender200};">${escapeHtml(subtitle)}</p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td class="px" bgcolor="${colors.surface}" style="background-color:${colors.surface}; border-radius:0 0 20px 20px; padding:36px 40px 40px 40px; font-family:${fontStack}; color:${colors.ink};">
              ${body}
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:24px 16px 0 16px; text-align:center; font-family:${fontStack}; font-size:12px; line-height:1.7; color:${colors.muted};">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Isotipo "OSG" construido en HTML (las imágenes SVG no se muestran en Gmail) */
function brandHeader(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="44" height="44" align="center" valign="middle" bgcolor="${colors.inkDeep}" style="width:44px; height:44px; background-color:${colors.inkDeep}; border-radius:12px;">
        <span style="display:block; font-family:${fontStack}; font-size:14px; font-weight:800; letter-spacing:0.02em; color:${colors.lavender200}; line-height:14px; padding-top:4px;">OSG</span>
        <span style="display:block; width:12px; height:3px; margin:5px 0 0 9px; background-color:${colors.mint}; border-radius:2px; font-size:0; line-height:0;">&nbsp;</span>
      </td>
      <td style="padding-left:12px;">
        <span style="display:block; font-family:${fontStack}; font-size:15px; font-weight:700; color:${colors.ink};">${escapeHtml(owner.fullName)}</span>
        <span style="display:block; font-family:${monoStack}; font-size:12px; color:${colors.muted};">&lt;<span style="color:${colors.brand};">FullStack</span> /&gt;</span>
      </td>
    </tr>
  </table>`
}

/** Párrafo estándar */
export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px 0; font-family:${fontStack}; font-size:15px; line-height:1.7; color:${colors.ink};">${html}</p>`
}

/** Subtítulo de una sección dentro del correo */
export function sectionTitle(text: string): string {
  return `<p style="margin:28px 0 12px 0; font-family:${fontStack}; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${colors.muted};">${escapeHtml(text)}</p>`
}

interface ButtonOptions {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}

/** Botón "a prueba de balas": funciona incluso en Outlook */
export function button({ href, label, variant = 'primary' }: ButtonOptions): string {
  const isPrimary = variant === 'primary'
  const background = isPrimary ? colors.ink : colors.surface
  const textColor = isPrimary ? '#ffffff' : colors.ink
  const border = isPrimary ? colors.ink : colors.line

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
    <tr>
      <td bgcolor="${background}" style="background-color:${background}; border:1px solid ${border}; border-radius:999px;">
        <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block; padding:13px 24px; font-family:${fontStack}; font-size:14px; font-weight:600; color:${textColor}; text-decoration:none; border-radius:999px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`
}

/** Fila de botones que se apilan en el celular */
export function buttonRow(buttons: string[]): string {
  const cells = buttons
    .map((html, index) => `<td class="stack" style="padding:0 ${index < buttons.length - 1 ? '10px' : '0'} 0 0;">${html}</td>`)
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px 0;"><tr>${cells}</tr></table>`
}

/** Tabla de datos etiqueta → valor (el valor debe venir escapado) */
export function detailsTable(rows: { label: string; value: string }[]): string {
  const body = rows
    .map(
      ({ label, value }, index) => `<tr>
        <td width="34%" style="padding:12px 16px; ${index > 0 ? `border-top:1px solid ${colors.line};` : ''} font-family:${fontStack}; font-size:13px; color:${colors.muted}; vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:12px 16px; ${index > 0 ? `border-top:1px solid ${colors.line};` : ''} font-family:${fontStack}; font-size:14px; font-weight:600; color:${colors.ink}; vertical-align:top; word-break:break-word;">${value}</td>
      </tr>`,
    )
    .join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${colors.line}; border-radius:14px; border-collapse:separate;">${body}</table>`
}

/** Bloque destacado para citar un mensaje (el contenido debe venir escapado) */
export function quoteBlock(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="${colors.lavender50}" style="background-color:${colors.lavender50}; border-left:4px solid ${colors.brand}; border-radius:0 14px 14px 0; padding:18px 20px; font-family:${fontStack}; font-size:15px; line-height:1.7; color:${colors.ink};">${html}</td>
    </tr>
  </table>`
}

/** Etiqueta tipo "pill" (texto plano, se escapa aquí) */
export function pill(text: string): string {
  return `<span style="display:inline-block; background-color:${colors.lavender100}; color:${colors.brand}; border-radius:999px; padding:4px 12px; font-size:13px; font-weight:600;">${escapeHtml(text)}</span>`
}

/** Lista de pasos numerados */
export function steps(items: { title: string; text: string }[]): string {
  const rows = items
    .map(
      (item, index) => `<tr>
        <td width="40" valign="top" style="padding:0 0 18px 0;">
          <span style="display:inline-block; width:28px; height:28px; line-height:28px; text-align:center; border-radius:999px; background-color:${colors.mint100}; color:${colors.mint600}; font-family:${fontStack}; font-size:13px; font-weight:700;">${index + 1}</span>
        </td>
        <td valign="top" style="padding:3px 0 18px 0; font-family:${fontStack};">
          <span style="display:block; font-size:15px; font-weight:600; color:${colors.ink};">${escapeHtml(item.title)}</span>
          <span style="display:block; margin-top:2px; font-size:14px; line-height:1.6; color:${colors.muted};">${escapeHtml(item.text)}</span>
        </td>
      </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`
}

/** Línea divisoria */
export function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:28px 0 0 0; border-bottom:1px solid ${colors.line}; font-size:0; line-height:0;">&nbsp;</td></tr></table>`
}

/** Firma personal con datos de contacto */
export function signature(): string {
  const link = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" target="_blank" style="color:${colors.brand}; text-decoration:none; font-weight:600;">${label}</a>`

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
    <tr>
      <td style="font-family:${fontStack};">
        <span style="display:block; font-size:16px; font-weight:700; color:${colors.ink};">${escapeHtml(owner.fullName)}</span>
        <span style="display:block; margin-top:2px; font-size:14px; color:${colors.muted};">${escapeHtml(owner.role)} · ${escapeHtml(owner.location)}</span>
        <span style="display:block; margin-top:10px; font-size:14px; color:${colors.muted};">${escapeHtml(owner.phoneDisplay)} · ${link(`mailto:${owner.email}`, escapeHtml(owner.email))}</span>
        <span style="display:block; margin-top:6px; font-size:14px;">
          ${link(owner.siteUrl, 'Portafolio')} &nbsp;·&nbsp; ${link(owner.linkedinUrl, 'LinkedIn')} &nbsp;·&nbsp; ${link(owner.githubUrl, 'GitHub')}
        </span>
      </td>
    </tr>
  </table>`
}
