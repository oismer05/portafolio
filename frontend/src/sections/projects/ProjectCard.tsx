import { ArrowRight, Images } from 'lucide-react'
import { Tag } from '@/components/ui/Tag'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import type { Project } from '@/types'
import { ProjectMockup } from './ProjectMockup'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

/** Tarjeta de proyecto dentro del carrusel. Al hacer clic abre el detalle en un modal */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const accent = accentStyles[project.accent]
  const coverImage = project.images[0]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lavender-500/10">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative aspect-[16/10] w-full overflow-hidden text-left"
        aria-label={`Ver detalles de ${project.name}`}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={`Captura de ${project.name}`}
            loading="lazy"
            className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ProjectMockup project={project} />
        )}
        {project.images.length > 1 && (
          <span className="glass absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <Images className="size-3.5" /> {project.images.length}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={cn('size-2 rounded-full', accent.dot)} />
          <span className="text-muted">
            {project.company}
            {project.platform && ` · ${project.platform}`}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold">{project.name}</h3>
        <p className="mt-2 leading-relaxed text-muted">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} accent={project.accent}>
              {tag}
            </Tag>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onOpen(project)}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-ink transition-colors hover:text-brand"
        >
          Ver detalles
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  )
}
