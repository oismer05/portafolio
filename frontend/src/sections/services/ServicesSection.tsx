import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { services } from '@/data/services'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'

export function ServicesSection() {
  return (
    <section id="servicios" className="relative bg-surface-2/60 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Servicios"
          title={
            <>
              ¿En qué puedo <span className="text-gradient">ayudarte</span>?
            </>
          }
          description="Desde una landing page hasta una plataforma SaaS completa. Te acompaño en todo el camino: idea, diseño, desarrollo y lanzamiento."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon, accent }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.1}>
              <SpotlightCard className={cn('h-full p-7', accentStyles[accent].border)}>
                <div className="flex items-start justify-between">
                  <span className={cn('grid size-13 place-items-center rounded-2xl', accentStyles[accent].soft, accentStyles[accent].icon)}>
                    <Icon className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted opacity-0 transition-all duration-300 group-hover/spotlight:translate-x-0.5 group-hover/spotlight:-translate-y-0.5 group-hover/spotlight:opacity-100" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
