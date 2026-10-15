import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import type { SocialLink } from '@/types'

/** Información personal y de contacto. Es la fuente única que usan Hero, Contacto, Footer y SEO */
export const profile = {
  fullName: 'Oismer Sehuanes Guzmán',
  shortName: 'Oismer Sehuanes',
  initials: 'OSG',
  role: 'Desarrollador Full Stack',
  title: 'Ingeniero de Sistemas',
  location: 'Barranquilla, Atlántico · Colombia',
  email: 'oismer3405@gmail.com',
  phoneDisplay: '+57 302 410 2301',
  phoneRaw: '573024102301',
  /** Fecha del primer empleo como desarrollador; se usa para calcular los años de experiencia */
  careerStartDate: '2021-11-08',
  /** Ruta a una foto en /public (ej. '/images/profile.webp'). null = se muestran las iniciales */
  photo: '/images/oismer-sehuanes-desarrollador-full-stack.webp' as string | null,
  summary:
    'Desarrollador Full Stack con cerca de 5 años de experiencia construyendo aplicaciones web para el sector salud y para clientes de una fábrica de software. He llevado procesos completos de una IPS a sistemas funcionales y he desarrollado productos de marca blanca con arquitectura multi-tenant por subdominio y pasarelas de pago.',
  workStyle:
    'Trabajo bien en equipo y uso herramientas de inteligencia artificial para acelerar el desarrollo, siempre bajo mi revisión: cada línea que entrego la entiendo y la respaldo.',
  languages: ['Español (nativo)'],
}

export const whatsappUrl = `https://wa.me/${profile.phoneRaw}?text=${encodeURIComponent(
  'Hola Oismer, vi tu portafolio y me gustaría hablar sobre un proyecto.',
)}`

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/Oismer05', icon: FaGithub },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/oismer-sehuanes-guzman-38904b20a',
    icon: FaLinkedinIn,
  },
  { label: 'WhatsApp', href: whatsappUrl, icon: FaWhatsapp },
]
