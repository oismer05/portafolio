import { Sparkles } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { skillGroups, softSkills } from '@/data/skills'
import { accentStyles } from '@/lib/accents'
import { cn } from '@/lib/cn'

export function SkillsSection() {
  return (
    <section id="habilidades" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Habilidades"
          title={
            <>
              Mi <span className="text-gradient">caja de herramientas</span>
            </>
          }
          description="Elijo la tecnología según el problema, no al revés. Estas son las que uso con más frecuencia."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, index) => {
            const accent = accentStyles[group.accent]
            return (
              <Reveal key={group.title} delay={(index % 2) * 0.1}>
                <SpotlightCard className={cn('h-full p-7', accent.border)}>
                  <div className="flex items-center gap-3">
                    <span className={cn('size-2.5 rounded-full', accent.dot)} />
                    <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                    <span className="ml-auto font-mono text-xs text-muted">{group.skills.length}</span>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2.5">
                    {group.skills.map(({ name, icon: Icon }) => (
                      <li
                        key={name}
                        className="inline-flex items-center gap-2 rounded-xl border border-line bg-canvas px-3.5 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-lavender-300"
                      >
                        {Icon && <Icon className={cn('size-4', accent.icon)} />}
                        {name}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              <Sparkles className="size-4 text-brand" />
              También aporto:
            </span>
            {softSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
