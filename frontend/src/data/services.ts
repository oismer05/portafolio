import { Building, CreditCard, HeartPulse, Layers, MonitorSmartphone, ServerCog } from 'lucide-react'
import type { Service } from '@/types'

/**
 * Servicios que ofrezco a clientes. También alimentan el selector del formulario de contacto.
 * ⚠️ Si cambias un título, actualiza también SERVICE_OPTIONS en backend/src/modules/contacts/contact.types.ts
 */
export const services: Service[] = [
  {
    title: 'Aplicaciones web a medida',
    description:
      'Convierto los procesos de tu empresa en sistemas funcionales: módulos, roles, flujos de aprobación y reportes pensados para quien los usa a diario.',
    icon: Building,
    accent: 'lavender',
  },
  {
    title: 'SaaS multi-tenant y marca blanca',
    description:
      'Plataformas donde cada cliente tiene su propio subdominio, su identidad visual y su configuración, todo sobre una sola base de código.',
    icon: Layers,
    accent: 'mint',
  },
  {
    title: 'Pasarelas de pago',
    description:
      'Integración de cobros en línea y suscripciones para que tu producto digital empiece a generar ingresos de forma segura.',
    icon: CreditCard,
    accent: 'peach',
  },
  {
    title: 'Software para el sector salud',
    description:
      'Experiencia real en IPS: contratos, consentimientos informados, trazabilidad de pacientes, turnos y gestión del talento humano.',
    icon: HeartPulse,
    accent: 'sky',
  },
  {
    title: 'Landing pages y sitios corporativos',
    description:
      'Sitios rápidos, modernos y optimizados para buscadores que presentan tu marca y convierten visitas en clientes.',
    icon: MonitorSmartphone,
    accent: 'butter',
  },
  {
    title: 'APIs y backend',
    description:
      'Servicios robustos con Node.js, NestJS, Laravel o FastAPI, bases de datos bien modeladas e integraciones con otros sistemas.',
    icon: ServerCog,
    accent: 'lavender',
  },
]
