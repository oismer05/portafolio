import { Award, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { award, education } from '@/data/education'

/** Formación académica + reconocimiento recibido */
export function EducationSection() {
  return (
    <section id="formacion" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Formación y logros"
          title={
            <>
              Base sólida, <span className="text-gradient">aprendizaje constante</span>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            {education.map((item, index) => (
              <Reveal key={item.degree} delay={index * 0.1}>
                <article className="flex gap-5 rounded-3xl border border-line bg-surface p-6 transition hover:shadow-xl hover:shadow-lavender-500/5 sm:p-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lavender-100 text-lavender-600 dark:bg-lavender-500/15 dark:text-lavender-300">
                    <GraduationCap className="size-6" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted">
                      {item.startYear} — {item.endYear}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{item.degree}</h3>
                    <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Tarjeta destacada del reconocimiento con borde degradado */}
          <Reveal delay={0.2}>
            <article className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-butter-300 to-butter-100 p-[1.5px] dark:from-butter-300/40 dark:to-butter-300/5">
              <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-surface p-7 sm:p-8">
                <div className="absolute -top-16 -right-16 size-48 rounded-full bg-butter-200/60 blur-3xl dark:bg-butter-300/10" aria-hidden="true" />
                <span className="relative grid size-14 place-items-center rounded-2xl bg-butter-100 text-butter-600 dark:bg-butter-300/15 dark:text-butter-300">
                  <Award className="size-7" />
                </span>
                <p className="relative mt-6 font-mono text-xs text-muted">
                  {award.date} · {award.organization}
                </p>
                <h3 className="relative mt-1 font-display text-2xl font-bold">{award.title}</h3>
                <p className="relative mt-3 leading-relaxed text-muted">{award.description}</p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
