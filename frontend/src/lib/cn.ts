import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Une clases de Tailwind de forma condicional y resuelve conflictos:
 * cn('inline-flex', 'hidden') → 'hidden' (gana la última, como se espera).
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes))
}
