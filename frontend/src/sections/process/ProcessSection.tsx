import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { processSteps } from '@/data/process'

/** Cómo trabajo con un cliente, en 4 pasos */
export function ProcessSection() {
  return (
    <section aria-labelledby="proceso-titulo" className="bg-surface-2/60 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Cómo trabajo"
          title={
            <span id="proceso-titulo">
              Un proceso claro, <span className="text-gradient">sin sorpresas</span>
            </span>
          }
          description="Sabrás en todo momento en qué punto está tu proyecto y qué viene después."
        />

        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Línea punteada que conecta los pasos en escritorio */}
          <span
            aria-hidden="true"
            className="absolute top-8 right-[12%] left-[12%] hidden border-t-2 border-dashed border-line lg:block"
          />
          {processSteps.map(({ title, description, icon: Icon }, index) => (
            <Reveal as="li" key={title} delay={index * 0.12} className="relative text-center">
              <div className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-line bg-surface shadow-lg shadow-lavender-500/5">
                <Icon className="size-7 text-brand" />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-ink font-mono text-[11px] font-bold text-canvas">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
