import { CarouselControls } from '@/components/ui/CarouselControls'
import { useCarousel } from '@/hooks/useCarousel'
import type { Project } from '@/types'
import { ProjectMockup } from './ProjectMockup'

/** Carrusel de capturas dentro del modal de un proyecto */
export function ProjectGallery({ project }: { project: Project }) {
  const { viewportRef, selectedIndex, snapCount, scrollPrev, scrollNext, scrollTo } = useCarousel({
    align: 'center',
  })

  if (project.images.length === 0) {
    return (
      <div className="group aspect-[16/9] overflow-hidden rounded-t-3xl">
        <ProjectMockup project={project} />
      </div>
    )
  }

  return (
    <div>
      <div ref={viewportRef} className="overflow-hidden rounded-t-3xl bg-surface-2">
        <div className="flex">
          {project.images.map((image, index) => (
            <div key={image} className="min-w-0 flex-[0_0_100%]">
              <img
                src={image}
                alt={`${project.name} — captura ${index + 1} de ${project.images.length}`}
                className="aspect-[16/9] w-full object-cover object-top"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
      <CarouselControls
        className="px-6 pt-5 sm:px-8"
        selectedIndex={selectedIndex}
        snapCount={snapCount}
        onPrev={scrollPrev}
        onNext={scrollNext}
        onSelect={scrollTo}
      />
    </div>
  )
}
