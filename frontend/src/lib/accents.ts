import type { AccentColor } from '@/types'

/**
 * Clases de Tailwind por color de acento.
 * Se escriben completas (no concatenadas) para que Tailwind las detecte al compilar.
 */
export const accentStyles: Record<
  AccentColor,
  { soft: string; icon: string; border: string; gradient: string; dot: string }
> = {
  lavender: {
    soft: 'bg-lavender-100 dark:bg-lavender-500/15',
    icon: 'text-lavender-600 dark:text-lavender-300',
    border: 'hover:border-lavender-300 dark:hover:border-lavender-500/40',
    gradient: 'from-lavender-200 to-lavender-50',
    dot: 'bg-lavender-400',
  },
  mint: {
    soft: 'bg-mint-100 dark:bg-mint-400/15',
    icon: 'text-mint-600 dark:text-mint-300',
    border: 'hover:border-mint-300 dark:hover:border-mint-400/40',
    gradient: 'from-mint-200 to-mint-100',
    dot: 'bg-mint-400',
  },
  peach: {
    soft: 'bg-peach-100 dark:bg-peach-400/15',
    icon: 'text-peach-600 dark:text-peach-300',
    border: 'hover:border-peach-300 dark:hover:border-peach-400/40',
    gradient: 'from-peach-200 to-peach-100',
    dot: 'bg-peach-400',
  },
  sky: {
    soft: 'bg-sky-soft-100 dark:bg-sky-soft-400/15',
    icon: 'text-sky-soft-600 dark:text-sky-soft-300',
    border: 'hover:border-sky-soft-300 dark:hover:border-sky-soft-400/40',
    gradient: 'from-sky-soft-200 to-sky-soft-100',
    dot: 'bg-sky-soft-400',
  },
  butter: {
    soft: 'bg-butter-100 dark:bg-butter-300/15',
    icon: 'text-butter-600 dark:text-butter-300',
    border: 'hover:border-butter-300 dark:hover:border-butter-300/40',
    gradient: 'from-butter-200 to-butter-100',
    dot: 'bg-butter-300',
  },
}
