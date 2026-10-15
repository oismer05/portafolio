import {
  ChartColumnBig,
  ClipboardCheck,
  FilePenLine,
  HeartHandshake,
  PenLine,
  Ticket,
} from 'lucide-react'
import type { Project } from '@/types'

/**
 * Proyectos destacados.
 *
 * Para agregar capturas:
 *  1. Guarda las imágenes en  public/projects/<slug>/  (ej. public/projects/turnopro/1.webp)
 *  2. Agrega las rutas en `images`:  images: ['/projects/turnopro/1.webp', '/projects/turnopro/2.webp']
 * Mientras `images` esté vacío se muestra un mockup ilustrado con el color del proyecto.
 */
export const projects: Project[] = [
  {
    slug: 'v-ai',
    name: 'v.ai',
    company: 'GreenApps',
    tagline: 'Tus tableros de BI, con tu marca, en un solo lugar',
    description:
      'Aplicación web de marca blanca para registrar y centralizar tableros de control de Power BI, Tableau y otras herramientas. Cada cliente opera en su propio subdominio y adapta la plataforma a la identidad visual de su empresa.',
    features: [
      'Arquitectura multi-tenant por subdominio',
      'Marca blanca: logo, colores e identidad de cada empresa',
      'Registro de tableros de Power BI, Tableau y otras herramientas',
      'Pasarela de pagos integrada',
      'Landing page comercial del producto',
      'Aplicación web de soporte para los clientes',
    ],
    tags: ['Multi-tenant', 'Marca blanca', 'Pasarela de pagos', 'SaaS'],
    images: [],
    icon: ChartColumnBig,
    accent: 'peach',
  },
  {
    slug: 'turnopro',
    name: 'TurnoPro',
    company: 'GreenApps',
    tagline: 'Sistema de turnos que cada empresa configura a su medida',
    description:
      'Sistema de gestión de turnos de marca blanca. Cada empresa adapta su identidad visual y parametriza todo el sistema: servicios, prioridades, sedes y más, sin depender de cambios en el código.',
    features: [
      'Arquitectura multi-tenant por subdominio',
      'Marca blanca adaptable a cada empresa',
      'Parametrización de servicios, prioridades y sedes',
      'Pasarela de pagos integrada',
      'Landing page comercial del producto',
      'Sistema de soporte para los clientes',
    ],
    tags: ['Multi-tenant', 'Marca blanca', 'Pasarela de pagos', 'SaaS'],
    images: [],
    icon: Ticket,
    accent: 'lavender',
  },
  {
    slug: 'contratos',
    name: 'Contratos',
    company: 'Mired IPS',
    platform: 'PlataformaMired',
    tagline: 'El ciclo de vida completo de cada contrato',
    description:
      'Módulo donde se registran todos los contratos de Mired IPS y se gestiona cada etapa: desde su creación hasta su finalización, con control de adiciones, obligaciones y pagos.',
    features: [
      'Registro centralizado de contratos',
      'Gestión de adiciones',
      'Seguimiento de obligaciones contractuales',
      'Control de pagos',
      'Finalización de contratos',
    ],
    tags: ['Sector salud', 'Gestión contractual'],
    images: [],
    icon: FilePenLine,
    accent: 'sky',
  },
  {
    slug: 'aliados',
    name: 'Aliados',
    company: 'Mired IPS',
    platform: 'PlataformaMired',
    tagline: 'Talento humano de las empresas aliadas, bajo control',
    description:
      'Mired IPS trabaja con bolsas de empleo aliadas que aportan gran parte de su personal. Este módulo centraliza la información de esos trabajadores por empresa aliada.',
    features: [
      'Registro de empresas aliadas (bolsas de empleo)',
      'Registro de empleados por empresa aliada',
      'Gestión de los contratos de cada empleado',
      'Cuadros de turnos por empresa aliada',
    ],
    tags: ['Sector salud', 'Talento humano', 'Turnos'],
    images: [],
    icon: HeartHandshake,
    accent: 'mint',
  },
  {
    slug: 'consentimiento-informado',
    name: 'Consentimiento informado',
    company: 'Mired IPS',
    platform: 'PlataformaMired',
    tagline: 'Consentimientos de odontología, digitales y organizados',
    description:
      'Módulo para registrar todos los consentimientos informados del servicio de odontología de Mired IPS, reemplazando el manejo en papel por un registro digital consultable.',
    features: [
      'Registro digital de consentimientos informados',
      'Enfocado en el servicio de odontología',
      'Consulta centralizada del historial',
    ],
    tags: ['Sector salud', 'Odontología'],
    images: [],
    icon: ClipboardCheck,
    accent: 'butter',
  },
  {
    slug: 'confordcare',
    name: 'ConfordCare',
    company: 'GreenApps',
    tagline: 'Trazabilidad de la atención con firma de salida',
    description:
      'Aplicación web para registrar la información de los usuarios de una IPS y mantener la trazabilidad de su atención, incluyendo la firma del usuario a la hora de salida.',
    features: [
      'Registro de usuarios de la IPS',
      'Trazabilidad de la atención',
      'Firma del usuario a la hora de salida',
    ],
    tags: ['Sector salud', 'Trazabilidad', 'Firma digital'],
    images: [],
    icon: PenLine,
    accent: 'peach',
  },
]
