import type { Transition, Variants } from 'motion/react'

/** Curva de animación suave usada en todo el sitio (ease-out-expo) */
export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

/** Aparición desde abajo con desvanecimiento */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
}

/** Contenedor que anima a sus hijos uno tras otro */
export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})
