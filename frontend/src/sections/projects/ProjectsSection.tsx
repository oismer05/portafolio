import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { CarouselControls } from '@/components/ui/CarouselControls'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects } from '@/data/projects'
import { useCarousel } from '@/hooks/useCarousel'
import type { Project } from '@/types'
import { ProjectCard } from './ProjectCard'
import { ProjectFilters } from './ProjectFilters'
import { ProjectModal } from './ProjectModal'

const ALL_FILTER = 'Todos'
/** Pestañas: "Todos" + una por cada empresa (sin repetir) */
const filterOptions = [ALL_FILTER, ...new Set(projects.map((project) => project.company))]

export function ProjectsSection() {
  // Empresa seleccionada en las pestañas
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER)
  // Proyecto abierto en el modal (null = ninguno)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Lista visible: se recalcula solo cuando cambia el filtro
  const visibleProjects = useMemo(
    () => (activeFilter === ALL_FILTER ? projects : projects.filter((project) => project.company === activeFilter)),
    [activeFilter],
  )

  const { viewportRef, emblaApi, selectedIndex, snapCount, scrollPrev, scrollNext, scrollTo } = useCarousel({
    autoplayDelay: 5000,
  })

  // Al cambiar de filtro, el carrusel vuelve a la primera tarjeta
  useEffect(() => {
    emblaApi?.reInit()
    emblaApi?.scrollTo(0, true)
  }, [activeFilter, emblaApi])

  return (
    <section id="proyectos" className="relative overflow-hidden bg-surface-2/60 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Proyectos"
          title={
            <>
              Sistemas que <span className="text-gradient">están en uso</span>
            </>
          }
          description="Una selección de las plataformas y módulos que he desarrollado para Mired IPS y para los clientes de GreenApps."
        />

        <Reveal className="mb-10 flex justify-center">
          <ProjectFilters options={filterOptions} active={activeFilter} onChange={setActiveFilter} />
        </Reveal>

        <Reveal>
          {/* Embla controla el contenedor (.flex); la animación de entrada va en cada tarjeta */}
          <div ref={viewportRef} className="-mx-3 overflow-hidden py-4">
            <div className="flex">
              {visibleProjects.map((project, index) => (
                <div key={project.slug} className="min-w-0 flex-[0_0_100%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                  <motion.div
                    // La key incluye el filtro para repetir la animación cada vez que se cambia de pestaña
                    key={`${activeFilter}-${project.slug}`}
                    className="h-full"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectCard project={project} onOpen={setSelectedProject} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <CarouselControls
            className="mt-8"
            selectedIndex={selectedIndex}
            snapCount={snapCount}
            onPrev={scrollPrev}
            onNext={scrollNext}
            onSelect={scrollTo}
          />
        </Reveal>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
