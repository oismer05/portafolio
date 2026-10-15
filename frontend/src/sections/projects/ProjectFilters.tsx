import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

interface ProjectFiltersProps {
  options: string[]
  active: string
  onChange: (option: string) => void
}

/** Pestañas para filtrar proyectos por empresa, con indicador animado */
export function ProjectFilters({ options, active, onChange }: ProjectFiltersProps) {
  return (
    <div role="tablist" aria-label="Filtrar proyectos" className="inline-flex rounded-full border border-line bg-surface p-1">
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className={cn(
              'relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5',
              isActive ? 'text-canvas' : 'text-muted hover:text-ink',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="project-filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            {option}
          </button>
        )
      })}
    </div>
  )
}
