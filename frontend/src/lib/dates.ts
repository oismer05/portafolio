const monthFormatter = new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' })

/** "2022-04-10" -> "abr 2022" */
export function formatMonthYear(isoDate: string): string {
  // Se fija el mediodía para evitar desfases de zona horaria
  return monthFormatter.format(new Date(`${isoDate}T12:00:00`)).replace('.', '')
}

/** Años transcurridos desde una fecha, redondeados al entero más cercano */
export function yearsSince(isoDate: string): number {
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25
  return Math.round((Date.now() - new Date(isoDate).getTime()) / msPerYear)
}

/** Duración legible entre dos fechas: "4 años 6 meses" */
export function formatDuration(startIso: string, endIso: string | null): string {
  const start = new Date(startIso)
  const end = endIso ? new Date(endIso) : new Date()
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: string[] = []

  if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`)

  return parts.join(' ') || 'menos de un mes'
}
