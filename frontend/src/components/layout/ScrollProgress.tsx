import { motion, useScroll, useSpring } from 'motion/react'

/** Barra fina en la parte superior que indica cuánto se ha recorrido la página */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  // El resorte suaviza el avance para que no se vea "a saltos"
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-brand-gradient"
    />
  )
}
