import { Bot, CreditCard, HeartPulse, Languages, Layers, Mail, MapPin } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { profile } from '@/data/profile'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'
import type { AccentColor } from '@/types'
import type { LucideIcon } from 'lucide-react'

/** Fortalezas resumidas en tarjetas pequeñas */
const strengths: { title: string; text: string; icon: LucideIcon; accent: AccentColor }[] = [
  { title: 'Sector salud', text: 'Procesos reales de una IPS llevados a software.', icon: HeartPulse, accent: 'sky' },
  { title: 'Multi-tenant', text: 'Un subdominio y una marca por cliente.', icon: Layers, accent: 'mint' },
  { title: 'Pagos en línea', text: 'Pasarelas integradas en productos SaaS.', icon: CreditCard, accent: 'peach' },
  { title: 'IA con criterio', text: 'Acelero con IA, siempre bajo mi revisión.', icon: Bot, accent: 'lavender' },
]

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 sm:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <ProfileCard />

        <div>
          <SectionHeading
            align="left"
            className="mb-8"
            eyebrow="Sobre mí"
            title={
              <>
                Tecnología al servicio de <span className="text-gradient">procesos reales</span>
              </>
            }
          />
          <Reveal>
            <p className="text-lg leading-relaxed text-pretty text-muted">{profile.summary}</p>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{profile.workStyle}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {strengths.map(({ title, text, icon: Icon, accent }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lavender-500/5">
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', accentStyles[accent].soft, accentStyles[accent].icon)}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Tarjeta de perfil: foto (o iniciales) + datos rápidos de contacto */
function ProfileCard() {
  const quickFacts = [
    { icon: MapPin, label: profile.location },
    { icon: Mail, label: profile.email },
    { icon: Languages, label: profile.languages.join(', ') },
  ]

  return (
    <Reveal className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-lavender-200 to-lavender-50 dark:from-lavender-500/20 dark:to-lavender-500/5" />
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-2xl shadow-lavender-500/10">
        <div className="group relative aspect-[4/4.2] overflow-hidden bg-gradient-to-br from-lavender-100 to-surface dark:from-lavender-500/10 dark:to-surface">
          {profile.photo ? (
            <>
              <img
                src={profile.photo}
                alt={`${profile.fullName}, ${profile.role.toLowerCase()} en Barranquilla`}
                // El punto de enfoque (60% 25%) mantiene el rostro centrado al recortar
                className="size-full object-cover object-[60%_25%] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={800}
                height={800}
              />
              {/* Sombra inferior para que la etiqueta del rol siempre se lea bien */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" />
            </>
          ) : (
            <div className="grid size-full place-items-center">
              <span className="font-display text-8xl font-bold tracking-tighter text-gradient">
                {profile.initials}
              </span>
            </div>
          )}
          <span className="absolute bottom-4 left-4 rounded-full bg-ink px-3.5 py-1.5 font-mono text-xs text-canvas">
            {profile.role}
          </span>
        </div>
        <ul className="space-y-3 p-6 text-sm">
          {quickFacts.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-muted">
              <Icon className="size-4 shrink-0 text-brand" />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
