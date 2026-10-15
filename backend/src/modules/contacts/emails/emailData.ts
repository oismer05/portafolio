/** Datos de un mensaje de contacto que necesitan las plantillas de correo */
export interface ContactEmailData {
  id: number
  fullName: string
  email: string
  phone: string | null
  company: string | null
  service: string
  message: string
  receivedAt: Date
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
})

/** "14 de octubre de 2026, 3:45 p. m." en hora de Colombia */
export function formatReceivedAt(date: Date): string {
  return dateFormatter.format(date)
}

/**
 * Primer nombre "limpio" para saludar: solo letras, máximo 30 caracteres.
 * Al dejar solo letras, nadie puede usar el campo nombre para colar enlaces o
 * texto publicitario en el correo de confirmación que se envía a un tercero.
 */
export function safeFirstName(fullName: string): string {
  const firstWord = fullName.trim().split(/\s+/)[0] ?? ''
  const lettersOnly = firstWord.replace(/[^\p{L}'-]/gu, '').slice(0, 30)
  if (!lettersOnly) return ''
  return lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
}

/** Solo dígitos, para armar enlaces de WhatsApp y llamadas */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}
