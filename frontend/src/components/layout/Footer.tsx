import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'

/** Año calculado una sola vez al cargar el módulo */
const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {profile.role} e {profile.title.toLowerCase()} en {profile.location}. Construyo software a
            medida, plataformas SaaS multi-tenant y soluciones para el sector salud.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="font-display text-sm font-semibold">Navegación</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="transition hover:text-brand">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold">Contacto</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href={`mailto:${profile.email}`} className="transition hover:text-brand">
                {profile.email}
              </a>
            </li>
            <li>{profile.phoneDisplay}</li>
          </ul>
          <SocialLinks size="sm" className="mt-5 gap-2" />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {currentYear} {profile.fullName}. Todos los derechos reservados.
          </p>
          <p>Hecho con React, Tailwind CSS y mucho café ☕ desde Barranquilla.</p>
        </div>
      </div>
    </footer>
  )
}
