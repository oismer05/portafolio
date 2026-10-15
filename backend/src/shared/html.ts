const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escapa texto para insertarlo de forma segura en HTML.
 * Imprescindible con datos que escribe el visitante: evita que inyecte etiquetas o enlaces en los correos.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char)
}

/** Escapa y conserva los saltos de línea del texto original */
export function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}
