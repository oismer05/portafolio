import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface MarqueeProps {
  children: ReactNode
  className?: string
  /** Invierte la dirección del desplazamiento */
  reverse?: boolean
}

/**
 * Carrusel infinito de desplazamiento continuo.
 * El contenido se duplica y la animación recorre exactamente la mitad (-50%),
 * de modo que el salto al reiniciar es imperceptible. Se pausa al pasar el cursor.
 */
export function Marquee({ children, className, reverse = false }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden',
        // Desvanece los bordes para un acabado más limpio
        '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
