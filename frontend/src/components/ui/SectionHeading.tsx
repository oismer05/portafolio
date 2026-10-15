import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  /** Texto corto sobre el título (ej. "Experiencia") */
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Encabezado uniforme para todas las secciones (etiqueta + h2 + descripción) */
export function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  const isCentered = align === 'center'

  return (
    <Reveal className={cn('mb-14 max-w-2xl', isCentered && 'mx-auto text-center', className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase">
        <span className="size-1.5 rounded-full bg-brand" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">{description}</p>
      )}
    </Reveal>
  )
}
