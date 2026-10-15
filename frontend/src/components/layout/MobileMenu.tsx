import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { navItems } from '@/data/navigation'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/cn'

interface MobileMenuProps {
  isOpen: boolean
  activeId: string
  onClose: () => void
}

/** Menú a pantalla completa para móviles y tablets */
export function MobileMenu({ isOpen, activeId, onClose }: MobileMenuProps) {
  useLockBodyScroll(isOpen)

  /**
   * Cierra el menú y luego desplaza hasta la sección.
   * El desplazamiento se hace después de liberar el bloqueo de scroll del body;
   * si se hiciera antes, el navegador lo ignoraría.
   */
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', `#${sectionId}`)
    }, 50)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col bg-canvas/95 px-6 pt-6 pb-10 backdrop-blur-xl xl:hidden"
          initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
          animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
          exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="grid size-10 place-items-center rounded-full border border-line bg-surface"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="mt-12 flex-1">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavigate(event, item.id)}
                    className={cn(
                      'flex items-center gap-4 py-2 font-display text-3xl font-semibold transition-colors',
                      activeId === item.id ? 'text-brand' : 'text-ink/80',
                    )}
                  >
                    <span className="font-mono text-sm text-muted">0{index + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6">
            <Button href="#contacto" onClick={(event) => handleNavigate(event, 'contacto')} size="lg" className="w-full">
              Hablemos de tu proyecto
            </Button>
            <SocialLinks className="justify-center" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
