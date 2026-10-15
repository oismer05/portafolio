import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { FaWhatsapp } from 'react-icons/fa6'
import { whatsappUrl } from '@/data/profile'
import { useScrolled } from '@/hooks/useScrolled'

/** Botones flotantes: WhatsApp (siempre visible) y volver arriba (tras hacer scroll) */
export function FloatingActions() {
  const showBackToTop = useScrolled(600)

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-center gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Volver arriba"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            className="grid size-11 place-items-center rounded-full border border-line bg-surface shadow-lg transition hover:-translate-y-0.5"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbeme por WhatsApp"
        className="relative grid size-14 place-items-center rounded-full bg-mint-300 text-[#14532d] shadow-xl shadow-mint-400/30 transition hover:scale-105"
      >
        {/* Onda que "late" para llamar la atención de forma sutil */}
        <span className="absolute inset-0 animate-ping rounded-full bg-mint-300 opacity-30" aria-hidden="true" />
        <FaWhatsapp className="relative size-7" />
      </a>
    </div>
  )
}
