import { ArrowRight, Download, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Button } from '@/components/ui/Button'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { siteConfig } from '@/config/site'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { allTechnologies } from '@/data/skills'
import { yearsSince } from '@/lib/dates'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { Stat } from '@/types'
import { HeroVisual } from './HeroVisual'
import { RotatingWords } from './RotatingWords'

const specialties = ['sector salud', 'SaaS multi-tenant', 'productos marca blanca', 'pasarelas de pago']

/** Cifras destacadas: se calculan a partir de los datos para que siempre estén al día */
const stats: Stat[] = [
  { value: yearsSince(profile.careerStartDate), label: 'años de experiencia' },
  { value: projects.length, suffix: '+', label: 'sistemas destacados' },
  { value: allTechnologies.length, suffix: '+', label: 'tecnologías' },
  { value: 2, label: 'empresas actuales' },
]

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      <HeroBackground />

      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <motion.div className="min-w-0" variants={staggerContainer(0.12, 0.1)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint-300/60 bg-mint-100 px-3.5 py-1.5 text-xs font-semibold text-mint-600 dark:bg-mint-400/10">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-mint-400" />
                <span className="relative size-2 rounded-full bg-mint-400" />
              </span>
              Disponible para nuevos proyectos
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <MapPin className="size-3.5" />
              {profile.location}
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-7 text-lg font-medium text-muted">
            Hola, soy <span className="text-ink">{profile.fullName}</span> 👋
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-[2.9rem] xl:text-[3.25rem]"
          >
            Desarrollador Full Stack que convierte procesos en{' '}
            <span className="text-gradient">software que funciona</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            Ingeniero de sistemas con experiencia en <RotatingWords words={specialties} />. Llevo procesos completos
            de una IPS a sistemas reales y construyo plataformas que cada empresa adapta a su marca.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#proyectos" size="lg">
              Ver proyectos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="#contacto" variant="secondary" size="lg">
              Hablemos
            </Button>
            <Button href={siteConfig.cvPath} variant="ghost" size="lg" download>
              <Download className="size-4" />
              Descargar CV
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9">
            <SocialLinks />
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>

      {/* Cifras destacadas */}
      <motion.dl
        className="container-page mt-24 grid grid-cols-2 gap-4 md:grid-cols-4"
        variants={staggerContainer(0.1, 0.6)}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="glass rounded-3xl px-6 py-5 text-center shadow-sm"
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-display text-3xl font-bold sm:text-4xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  )
}

/** Manchas de color pastel animadas + patrón de puntos */
function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -top-32 -left-24 size-[28rem] animate-blob rounded-full bg-lavender-200/70 blur-3xl dark:bg-lavender-500/20" />
      <div
        className="absolute top-20 -right-32 size-[26rem] animate-blob rounded-full bg-butter-100/80 blur-3xl dark:bg-lavender-700/20"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 size-[22rem] animate-blob rounded-full bg-lavender-100/80 blur-3xl dark:bg-lavender-500/10"
        style={{ animationDelay: '-12s' }}
      />
    </div>
  )
}
