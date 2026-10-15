import { CodeXml, Compass, PenTool, Rocket } from 'lucide-react'
import type { ProcessStep } from '@/types'

/** Pasos de mi forma de trabajar con un cliente */
export const processSteps: ProcessStep[] = [
  {
    title: 'Descubrimiento',
    description:
      'Entiendo tu proceso actual, quién lo usa y qué problema quieres resolver antes de escribir una sola línea de código.',
    icon: Compass,
  },
  {
    title: 'Diseño y arquitectura',
    description:
      'Defino módulos, modelo de datos y la arquitectura adecuada (por ejemplo multi-tenant) para que el sistema crezca contigo.',
    icon: PenTool,
  },
  {
    title: 'Desarrollo iterativo',
    description:
      'Entregas frecuentes que puedes probar. Ajustamos sobre la marcha con tu retroalimentación.',
    icon: CodeXml,
  },
  {
    title: 'Lanzamiento y soporte',
    description:
      'Despliegue a producción, acompañamiento a los usuarios y mejoras continuas cuando el negocio lo necesite.',
    icon: Rocket,
  },
]
