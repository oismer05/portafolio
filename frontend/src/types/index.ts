import type { LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons'

/** Colores pastel disponibles para acentuar tarjetas, proyectos y servicios */
export type AccentColor = 'lavender' | 'mint' | 'peach' | 'sky' | 'butter'

export interface NavItem {
  /** id de la sección destino (sin #) */
  id: string
  label: string
}

export interface SocialLink {
  label: string
  href: string
  icon: IconType
}

export interface Stat {
  value: number
  suffix?: string
  label: string
}

export interface Service {
  title: string
  description: string
  icon: LucideIcon
  accent: AccentColor
}

export interface ExperienceItem {
  company: string
  role: string
  location: string
  modality: string
  /** Fecha de inicio en formato ISO (AAAA-MM-DD) */
  startDate: string
  /** null = empleo actual */
  endDate: string | null
  summary: string
  highlights: string[]
  accent: AccentColor
}

export type ProjectCompany = 'Mired IPS' | 'GreenApps'

export interface Project {
  /** Identificador único; también es el nombre de la carpeta de imágenes en public/projects */
  slug: string
  name: string
  company: ProjectCompany
  /** Producto o plataforma a la que pertenece (ej. PlataformaMired) */
  platform?: string
  tagline: string
  description: string
  features: string[]
  /** Etiquetas cortas que resaltan lo técnico (multi-tenant, pasarela de pagos...) */
  tags: string[]
  /** Tecnologías usadas. Opcional: solo se muestran si se definen */
  stack?: string[]
  /** Rutas de capturas (ej. /projects/turnopro/1.webp). Vacío = se muestra un mockup ilustrado */
  images: string[]
  icon: LucideIcon
  accent: AccentColor
  /** URL pública del producto, si existe */
  url?: string
}

export interface SkillGroup {
  title: string
  accent: AccentColor
  skills: { name: string; icon?: IconType }[]
}

export interface EducationItem {
  degree: string
  institution: string
  startYear: number
  endYear: number
}

export interface ProcessStep {
  title: string
  description: string
  icon: LucideIcon
}
