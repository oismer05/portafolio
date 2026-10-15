import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { easeOutExpo } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Retraso en segundos antes de animar */
  delay?: number
  /** Desplazamiento vertical inicial en píxeles */
  y?: number
  as?: 'div' | 'li' | 'article'
}

/** Muestra su contenido con un desvanecimiento hacia arriba la primera vez que entra en pantalla */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: easeOutExpo }}
    >
      {children}
    </MotionTag>
  )
}
