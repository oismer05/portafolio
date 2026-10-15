import { Marquee } from '@/components/ui/Marquee'
import { allTechnologies } from '@/data/skills'

/** Franja con las tecnologías que domino, en desplazamiento infinito */
export function TechMarquee() {
  return (
    <section aria-label="Tecnologías" className="border-y border-line bg-surface/60 py-8">
      <p className="mb-6 text-center text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Tecnologías con las que construyo
      </p>
      <Marquee>
        {allTechnologies.map(({ name, icon: Icon }) => (
          <span
            key={name}
            className="mx-3 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-ink"
          >
            {Icon && <Icon className="size-[18px]" />}
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
