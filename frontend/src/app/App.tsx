import { FloatingActions } from '@/components/layout/FloatingActions'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { AboutSection } from '@/sections/about/AboutSection'
import { ContactSection } from '@/sections/contact/ContactSection'
import { EducationSection } from '@/sections/education/EducationSection'
import { ExperienceSection } from '@/sections/experience/ExperienceSection'
import { HeroSection } from '@/sections/hero/HeroSection'
import { ProcessSection } from '@/sections/process/ProcessSection'
import { ProjectsSection } from '@/sections/projects/ProjectsSection'
import { ServicesSection } from '@/sections/services/ServicesSection'
import { SkillsSection } from '@/sections/skills/SkillsSection'
import { TechMarquee } from '@/sections/tech-marquee/TechMarquee'

/** Composición de la página: el orden de las secciones es el orden del recorrido */
export function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Navbar />

      <main id="contenido">
        <HeroSection />
        <TechMarquee />
        <AboutSection />
        <ServicesSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ProcessSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
