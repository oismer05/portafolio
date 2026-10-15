import type { ReactNode } from 'react'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import type { AccentColor } from '@/types'

interface TagProps {
  children: ReactNode
  accent?: AccentColor
  className?: string
}

/** Etiqueta pequeña tipo "pill" para tecnologías y características */
export function Tag({ children, accent, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        accent ? [accentStyles[accent].soft, accentStyles[accent].icon] : 'bg-surface-2 text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
