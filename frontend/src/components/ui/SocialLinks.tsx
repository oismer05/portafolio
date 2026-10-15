import { socialLinks } from '@/data/profile'
import { cn } from '@/lib/cn'

interface SocialLinksProps {
  /** sm = pie de página; md = portada y menú móvil */
  size?: 'sm' | 'md'
  className?: string
}

const sizeStyles = {
  sm: { button: 'size-10', icon: 'size-4' },
  md: { button: 'size-11', icon: 'size-[18px]' },
} as const

/** Botones redondos de GitHub, LinkedIn y WhatsApp (se reutilizan en toda la página) */
export function SocialLinks({ size = 'md', className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              'grid place-items-center rounded-full border border-line bg-surface text-muted transition',
              'hover:-translate-y-0.5 hover:border-lavender-300 hover:text-brand',
              sizeStyles[size].button,
            )}
          >
            <Icon className={sizeStyles[size].icon} />
          </a>
        </li>
      ))}
    </ul>
  )
}
