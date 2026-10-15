import { ArrowUpRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Tag } from '@/components/ui/Tag'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import type { Project } from '@/types'
import { ProjectGallery } from './ProjectGallery'

interface ProjectModalProps {
  /** Proyecto a mostrar; null = modal cerrado */
  project: Project | null
  onClose: () => void
}

/** Detalle completo de un proyecto: galería, descripción, funcionalidades y etiquetas */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <Modal isOpen={project !== null} onClose={onClose} label={project ? `Detalle de ${project.name}` : 'Proyecto'}>
      {project && <ProjectDetail project={project} />}
    </Modal>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  const accent = accentStyles[project.accent]

  return (
    <>
      <ProjectGallery project={project} />

      <div className="grid gap-10 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className={cn('text-sm font-semibold', accent.icon)}>
            {project.company}
            {project.platform && ` · ${project.platform}`}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold">{project.name}</h3>
          <p className="mt-2 text-lg text-muted">{project.tagline}</p>
          <p className="mt-6 leading-relaxed">{project.description}</p>

          {project.url && (
            <Button href={project.url} target="_blank" rel="noopener noreferrer" className="mt-8">
              Visitar sitio <ArrowUpRight className="size-4" />
            </Button>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-muted uppercase">Lo que construí</h4>
            <ul className="mt-4 space-y-3">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm">
                  <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full', accent.soft)}>
                    <Check className={cn('size-3', accent.icon)} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest text-muted uppercase">Características</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} accent={project.accent}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {project.stack && project.stack.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-muted uppercase">Tecnologías</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
