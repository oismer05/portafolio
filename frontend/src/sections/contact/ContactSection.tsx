import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { profile, whatsappUrl } from '@/data/profile'
import { ContactForm } from './ContactForm'

const contactChannels = [
  { label: 'Correo', value: profile.email, href: `mailto:${profile.email}`, icon: Mail, tone: 'bg-lavender-100 text-lavender-600 dark:bg-lavender-500/15 dark:text-lavender-300' },
  { label: 'WhatsApp', value: profile.phoneDisplay, href: whatsappUrl, icon: FaWhatsapp, tone: 'bg-mint-100 text-mint-600 dark:bg-mint-400/15 dark:text-mint-300' },
  { label: 'Ubicación', value: profile.location, href: undefined, icon: MapPin, tone: 'bg-peach-100 text-peach-600 dark:bg-peach-400/15 dark:text-peach-300' },
]

export function ContactSection() {
  return (
    <section id="contacto" className="relative overflow-hidden py-24 sm:py-32">
      {/* Manchas de color de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-40 size-[30rem] rounded-full bg-lavender-200/50 blur-3xl dark:bg-lavender-500/10" />
        <div className="absolute -right-40 bottom-0 size-[30rem] rounded-full bg-butter-100/70 blur-3xl dark:bg-lavender-700/10" />
      </div>

      <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            align="left"
            className="mb-8"
            eyebrow="Contacto"
            title={
              <>
                ¿Tienes un proyecto en mente? <span className="text-gradient">Hablemos</span>
              </>
            }
            description="Cuéntame qué necesitas y te responderé con una propuesta. Sin compromiso."
          />

          <ul className="space-y-4">
            {contactChannels.map(({ label, value, href, icon: Icon, tone }, index) => {
              const content = (
                <>
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-muted">{label}</span>
                    <span className="block truncate font-semibold">{value}</span>
                  </span>
                  {href && <ArrowUpRight className="size-5 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />}
                </>
              )
              const classes = 'group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-lavender-300 hover:shadow-lg hover:shadow-lavender-500/5'

              return (
                <Reveal as="li" key={label} delay={index * 0.08}>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={classes}>
                      {content}
                    </a>
                  ) : (
                    <div className={classes}>{content}</div>
                  )}
                </Reveal>
              )
            })}
          </ul>
        </div>

        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
