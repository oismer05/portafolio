import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

/** Con `href` se renderiza un <a>; sin él, un <button> */
type ButtonProps =
  | (BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-canvas shadow-lg shadow-lavender-500/20 hover:shadow-xl hover:shadow-lavender-500/30 hover:-translate-y-0.5',
  secondary:
    'border border-line bg-surface text-ink hover:border-lavender-300 hover:bg-lavender-50 dark:hover:bg-lavender-500/10 hover:-translate-y-0.5',
  ghost: 'text-ink hover:bg-surface-2',
}

const sizeStyles: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap',
    'transition-all duration-300 disabled:pointer-events-none disabled:opacity-60',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  if (props.href !== undefined) {
    return (
      <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
