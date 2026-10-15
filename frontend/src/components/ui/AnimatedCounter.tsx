import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  /** Duración de la animación en segundos */
  duration?: number
}

/** Número que cuenta desde 0 hasta `value` cuando aparece en pantalla */
export function AnimatedCounter({ value, suffix = '', duration = 1.8 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  // Valor mostrado: arranca en el final para que el HTML pre-renderizado (SEO) tenga la cifra real
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  )
}
