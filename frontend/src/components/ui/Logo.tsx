import { useId } from 'react'
import { cn } from '@/lib/cn'

interface LogoMarkProps {
  className?: string
}

/**
 * Isotipo propio: monograma "OSG" trazado a mano sobre un cuadrado de "tinta" índigo.
 * La línea inferior en menta evoca el cursor de una terminal (_).
 * Es el mismo diseño de public/favicon.svg.
 */
export function LogoMark({ className }: LogoMarkProps) {
  // id único para que el degradado no choque si el logo aparece varias veces
  const gradientId = useId()

  return (
    <svg viewBox="0 0 64 64" className={cn('size-10', className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b3182" />
          <stop offset="1" stopColor="#1e1b2e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${gradientId})`} />
      {/* Borde interior sutil: mantiene el contorno visible también en modo oscuro */}
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="17.25" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.5" />
      <g fill="none" stroke="#e2dcf9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* O */}
        <circle cx="15" cy="30" r="7" />
        {/* S */}
        <path d="M37 24.5C35.6 22.7 33.8 22 32 22c-3.3 0-5.5 1.9-5.5 4.3 0 4.7 11 2.7 11 7.5 0 2.4-2.2 4.2-5.5 4.2-2 0-4.2-.7-5.5-2.7" />
        {/* G */}
        <path d="M53.95 25.05A7 7 0 1 0 56 30h-6" />
      </g>
      {/* Cursor de terminal */}
      <rect x="8" y="44" width="14" height="3.5" rx="1.75" fill="#a3deca" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** Oculta el texto y deja solo el isotipo */
  compact?: boolean
}

/** Logotipo completo: isotipo + nombre + etiqueta de rol */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark className="size-10 shrink-0 drop-shadow-sm" />
      {!compact && (
        <span className="flex flex-col leading-none whitespace-nowrap">
          <span className="font-display text-[15px] font-bold tracking-tight text-ink">
            Oismer Sehuanes
          </span>
          <span className="mt-1 font-mono text-[11px] text-muted">
            {'<'}
            <span className="text-brand">FullStack</span>
            {' />'}
          </span>
        </span>
      )}
    </span>
  )
}
