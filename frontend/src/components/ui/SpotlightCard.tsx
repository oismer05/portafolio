import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

/**
 * Tarjeta con un halo de luz que sigue al cursor.
 * La posición se escribe en variables CSS (--x, --y) directamente sobre el elemento,
 * así el efecto no provoca re-renderizados de React.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group/spotlight relative overflow-hidden rounded-3xl border border-line bg-surface',
        'transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lavender-500/10',
        className,
      )}
    >
      {/* Halo: solo visible al pasar el cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--color-lavender-300) 28%, transparent), transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
