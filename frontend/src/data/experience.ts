import type { ExperienceItem } from '@/types'

/** Experiencia laboral, de la más reciente a la más antigua */
export const experience: ExperienceItem[] = [
  {
    company: 'Mired IPS',
    role: 'Desarrollador de Nuevas Tecnologías',
    location: 'Barranquilla',
    modality: 'Tiempo completo',
    startDate: '2022-04-10',
    endDate: null,
    summary:
      'Responsable de llevar los procesos de la IPS a sistemas funcionales dentro de PlataformaMired, la plataforma que reúne todos los módulos desarrollados para la organización.',
    highlights: [
      'Módulo de Contratos: registro y gestión completa del ciclo de vida de cada contrato.',
      'Módulo de Aliados: empleados, contratos y cuadros de turnos de las empresas aliadas.',
      'Módulo de Consentimiento informado para el servicio de odontología.',
      'Mención de honor (dic. 2025) por aportes en desarrollos para la gestión del talento humano.',
    ],
    accent: 'lavender',
  },
  {
    company: 'GreenApps',
    role: 'Desarrollador de Software',
    location: 'Barranquilla',
    modality: 'Prestación de servicios',
    startDate: '2021-11-08',
    endDate: null,
    summary:
      'Desarrollo de software a medida para los clientes de la fábrica de software, participando en múltiples productos desde la arquitectura hasta la puesta en producción.',
    highlights: [
      'v.ai: plataforma marca blanca para centralizar tableros de Power BI, Tableau y más.',
      'TurnoPro: sistema de turnos marca blanca totalmente parametrizable por empresa.',
      'Arquitectura multi-tenant por subdominio, pasarelas de pago, landing pages y apps de soporte.',
      'ConfordCare: trazabilidad de la atención de usuarios de una IPS con firma de salida.',
    ],
    accent: 'mint',
  },
]
