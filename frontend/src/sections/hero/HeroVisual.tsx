import { CreditCard, HeartPulse, Layers, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Chips flotantes alrededor del editor: resumen visual de las especialidades */
const floatingChips = [
  { label: 'Multi-tenant', icon: Layers, position: '-top-6 -left-4 sm:-left-10', tone: 'bg-mint-100 text-mint-600', delay: '0s' },
  { label: 'Pasarelas de pago', icon: CreditCard, position: 'top-1/3 -right-3 sm:-right-12', tone: 'bg-peach-100 text-peach-600', delay: '1.2s' },
  { label: 'Sector salud', icon: HeartPulse, position: '-bottom-6 left-6', tone: 'bg-sky-soft-100 text-sky-soft-600', delay: '2.4s' },
]

/**
 * Tarjeta tipo editor de código con efecto 3D:
 * se inclina siguiendo la posición del cursor (valores de movimiento, sin re-render).
 */
export function HeroVisual() {
  // Posición normalizada del cursor dentro de la tarjeta (-0.5 a 0.5)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  // Inclinación suavizada con resortes
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetTilt = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md min-w-0 [perspective:1200px]"
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        {/* Resplandor pastel detrás de la tarjeta */}
        <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-lavender-300/60 to-lavender-100/40 blur-2xl dark:from-lavender-500/25 dark:to-lavender-700/10" />

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-surface/90 shadow-2xl shadow-lavender-500/15 backdrop-blur dark:border-white/10">
          {/* Barra de la ventana */}
          <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
            <span className="size-3 rounded-full bg-peach-300" />
            <span className="size-3 rounded-full bg-butter-300" />
            <span className="size-3 rounded-full bg-mint-300" />
            <span className="ml-3 font-mono text-xs text-muted">oismer.ts</span>
          </div>

          <pre className="overflow-hidden px-5 py-5 font-mono text-[12.5px] leading-6 sm:text-[13px]">
            <code>
              <Line n={1}>
                <K>const</K> <V>oismer</V> = {'{'}
              </Line>
              <Line n={2} indent>
                <P>rol</P>: <S>'Full Stack Developer'</S>,
              </Line>
              <Line n={3} indent>
                <P>base</P>: <S>'Barranquilla, CO'</S>,
              </Line>
              <Line n={4} indent>
                <P>stack</P>: [<S>'React'</S>, <S>'Node'</S>, <S>'Laravel'</S>],
              </Line>
              <Line n={5} indent>
                <P>experto</P>: [<S>'SaaS'</S>, <S>'multi-tenant'</S>],
              </Line>
              <Line n={6} indent>
                <P>disponible</P>: <K>true</K>,
              </Line>
              <Line n={7}>{'}'}</Line>
              <Line n={8}> </Line>
              <Line n={9}>
                <V>oismer</V>.<Fn>construir</Fn>(<V>tuIdea</V>)
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-lavender-400" />
              </Line>
            </code>
          </pre>
        </div>

        {floatingChips.map(({ label, icon: Icon, position, tone, delay }) => (
          <div
            key={label}
            className={cn('absolute animate-float [transform:translateZ(40px)]', position)}
            style={{ animationDelay: delay }}
          >
            <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-ink shadow-xl shadow-lavender-500/10">
              <span className={cn('grid size-7 place-items-center rounded-lg', tone)}>
                <Icon className="size-4" />
              </span>
              {label}
            </div>
          </div>
        ))}

        <div className="absolute -right-2 -bottom-8 animate-float sm:-right-6" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-canvas shadow-xl">
            <Sparkles className="size-3.5 text-butter-300" />
            IA bajo mi revisión
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* --- Piezas mínimas para colorear la sintaxis del snippet --- */

function Line({ n, indent, children }: { n: number; indent?: boolean; children: ReactNode }) {
  return (
    <span className="block whitespace-pre">
      <span className="mr-4 inline-block w-4 text-right text-muted/50 select-none">{n}</span>
      {indent && '  '}
      {children}
    </span>
  )
}
const K = ({ children }: { children: ReactNode }) => <span className="text-lavender-600 dark:text-lavender-300">{children}</span>
const V = ({ children }: { children: ReactNode }) => <span className="text-ink">{children}</span>
const P = ({ children }: { children: ReactNode }) => <span className="text-sky-soft-600 dark:text-sky-soft-300">{children}</span>
const S = ({ children }: { children: ReactNode }) => <span className="text-mint-600 dark:text-mint-300">{children}</span>
const Fn = ({ children }: { children: ReactNode }) => <span className="text-peach-600 dark:text-peach-300">{children}</span>
