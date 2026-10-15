import { Briefcase, Calendar, Check } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { formatDuration, formatMonthYear } from '@/lib/dates'
import type { ExperienceItem } from '@/types'

interface ExperienceCardProps {
  item: ExperienceItem
  index: number
}

/** Un empleo dentro de la línea de tiempo */
export function ExperienceCard({ item, index }: ExperienceCardProps) {
  const accent = accentStyles[item.accent]
  const period = `${formatMonthYear(item.startDate)} — ${item.endDate ? formatMonthYear(item.endDate) : 'Actualidad'}`

  return (
    <Reveal as="li" delay={index * 0.1} className="relative">
      {/* Nodo de la línea de tiempo */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-7 -left-8 grid size-6 place-items-center rounded-full border-4 border-canvas sm:-left-12 sm:size-10',
          accent.soft,
        )}
      >
        <Briefcase className={cn('hidden size-4 sm:block', accent.icon)} />
      </span>

      <article className="rounded-3xl border border-line bg-surface p-6 transition-shadow duration-500 hover:shadow-2xl hover:shadow-lavender-500/10 sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold sm:text-2xl">{item.role}</h3>
            <p className={cn('mt-1 font-semibold', accent.icon)}>{item.company}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted">
              <Calendar className="size-4" />
              {period}
            </span>
            <div className="flex flex-wrap gap-2">
              {!item.endDate && <Tag accent="mint">Actual · {formatDuration(item.startDate, item.endDate)}</Tag>}
              <Tag>{item.modality}</Tag>
            </div>
          </div>
        </header>

        <p className="mt-5 leading-relaxed text-muted">{item.summary}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
              <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full', accent.soft)}>
                <Check className={cn('size-3', accent.icon)} strokeWidth={3} />
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}
