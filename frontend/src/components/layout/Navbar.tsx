import { Menu } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { navItems } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { MobileMenu } from './MobileMenu'

// Se calcula una sola vez: la lista de secciones no cambia
const sectionIds = navItems.map((item) => item.id)

/** Barra superior fija: se vuelve "vidrio" al hacer scroll y resalta la sección visible */
export function Navbar() {
  const isScrolled = useScrolled()
  const activeId = useActiveSection(sectionIds)
  // Controla la apertura del menú en pantallas pequeñas
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <nav
          aria-label="Navegación principal"
          className={cn(
            'mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-5',
            isScrolled ? 'glass shadow-lg shadow-lavender-500/5' : 'border border-transparent',
          )}
        >
          <a href="#inicio" aria-label="Ir al inicio">
            <Logo />
          </a>

          {/* Enlaces de escritorio con "pill" animada que sigue a la sección activa */}
          <ul className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'relative isolate rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    activeId === item.id ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {activeId === item.id && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-lavender-100 dark:bg-lavender-500/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button href="#contacto" className="hidden sm:inline-flex">
              Hablemos
            </Button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              className="grid size-10 place-items-center rounded-full border border-line bg-surface xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu isOpen={isMenuOpen} activeId={activeId} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
