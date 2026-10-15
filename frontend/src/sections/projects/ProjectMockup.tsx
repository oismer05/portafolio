import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import type { Project } from '@/types'

interface ProjectMockupProps {
  project: Project
  className?: string
}

/**
 * Ilustración tipo "ventana de aplicación" que se muestra mientras
 * el proyecto no tenga capturas reales. Usa el color de acento del proyecto.
 */
export function ProjectMockup({ project, className }: ProjectMockupProps) {
  const accent = accentStyles[project.accent]
  const Icon = project.icon
  const breadcrumb = project.platform ? `${project.platform} / ${project.name}` : project.name

  return (
    <div
      aria-hidden="true"
      className={cn('relative flex size-full items-end justify-center overflow-hidden bg-gradient-to-br p-5 pb-0 sm:p-7 sm:pb-0', accent.gradient, 'dark:from-surface-2 dark:via-surface dark:to-surface-2', className)}
    >
      <div className="bg-dots absolute inset-0 opacity-60" />

      {/* Ventana del navegador */}
      <div className="relative w-full overflow-hidden rounded-t-2xl border border-b-0 border-white/80 bg-surface/95 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2 dark:border-white/10">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-peach-300" />
          <span className="size-2 rounded-full bg-butter-300" />
          <span className="size-2 rounded-full bg-mint-300" />
          <span className="ml-2 truncate rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
            {breadcrumb}
          </span>
        </div>

        <div className="flex gap-3 p-3">
          {/* Barra lateral */}
          <div className="hidden w-1/4 space-y-2 sm:block">
            <div className={cn('h-2.5 w-3/4 rounded-full', accent.dot)} />
            {[80, 65, 70, 55].map((width) => (
              <div key={width} className="h-2 rounded-full bg-surface-2" style={{ width: `${width}%` }} />
            ))}
          </div>

          {/* Contenido principal */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn('grid size-10 place-items-center rounded-xl', accent.soft, accent.icon)}>
                <Icon className="size-5" />
              </span>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-1/2 rounded-full bg-ink/15" />
                <div className="h-2 w-1/3 rounded-full bg-surface-2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((cell) => (
                <div key={cell} className="space-y-1.5 rounded-lg border border-line p-2">
                  <div className={cn('h-1.5 w-1/2 rounded-full', cell === 0 ? accent.dot : 'bg-surface-2')} />
                  <div className="h-3 w-3/4 rounded-full bg-ink/10" />
                </div>
              ))}
            </div>
            <div className="flex h-14 items-end gap-1.5 rounded-lg border border-line p-2">
              {[40, 65, 50, 80, 60, 90, 70, 55].map((height, bar) => (
                <div
                  key={bar}
                  className={cn('flex-1 rounded-sm', bar % 3 === 0 ? accent.dot : 'bg-surface-2')}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
