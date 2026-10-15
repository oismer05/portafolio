import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface RotatingWordsProps {
  words: string[]
  /** Milisegundos que permanece visible cada palabra */
  interval?: number
}

/** Muestra una palabra a la vez, cambiándola con una transición vertical */
export function RotatingWords({ words, interval = 2600 }: RotatingWordsProps) {
  // Posición de la palabra visible dentro de `words`
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % words.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [words.length, interval])

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[currentIndex]}
          className="inline-block font-semibold text-brand"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
