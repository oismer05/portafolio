import { cn } from '@/lib/cn'

/** Clases compartidas por inputs, select y textarea del formulario */
export const inputClasses = (hasError: boolean) =>
  cn(
    'w-full rounded-xl border bg-canvas px-4 py-3 text-[15px] text-ink placeholder:text-muted/60',
    'transition-all duration-200 outline-none focus:bg-surface focus:ring-4',
    hasError
      ? 'border-peach-400 focus:ring-peach-200/50 dark:focus:ring-peach-400/20'
      : 'border-line focus:border-lavender-400 focus:ring-lavender-200/60 dark:focus:ring-lavender-500/20',
  )
