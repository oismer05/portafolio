import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { easeOutExpo } from '@/lib/motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Texto para lectores de pantalla */
  label: string
  children: ReactNode
}

/** Ventana modal animada. Se cierra con Escape, clic en el fondo o el botón X */
export function Modal({ isOpen, onClose, label, children }: ModalProps) {
  useLockBodyScroll(isOpen)

  // Cerrar con la tecla Escape mientras el modal esté abierto
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fondo oscuro desenfocado */}
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-line bg-surface shadow-2xl sm:rounded-3xl"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full border border-line bg-surface/80 backdrop-blur transition hover:rotate-90 hover:bg-surface-2"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
