import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { experience } from '@/data/experience'
import { ExperienceCard } from './ExperienceCard'

export function ExperienceSection() {
  const timelineRef = useRef<HTMLOListElement>(null)
  // Progreso del scroll dentro de la línea de tiempo: hace "crecer" la línea vertical
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 60%'] })
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section id="experiencia" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experiencia"
          title={
            <>
              Donde he puesto mi <span className="text-gradient">código a trabajar</span>
            </>
          }
          description="Dos empresas, un mismo enfoque: entender el negocio primero y construir software que la gente realmente use."
        />

        <ol ref={timelineRef} className="relative mx-auto max-w-4xl space-y-10 pl-8 sm:pl-12">
          {/* Línea base + línea de progreso animada */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-0.5 rounded-full bg-line sm:left-[19px]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute top-2 bottom-2 left-[11px] w-0.5 origin-top rounded-full bg-gradient-to-b from-lavender-700 via-lavender-500 to-lavender-300 sm:left-[19px]"
          />

          {experience.map((item, index) => (
            <ExperienceCard key={item.company} item={item} index={index} />
          ))}
        </ol>
      </div>
    </section>
  )
}
