import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  optional?: boolean
  className?: string
  children: ReactNode
}

/** Envoltorio de un campo: etiqueta + control + mensaje de error animado */
export function FormField({ id, label, error, optional, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Opcional</span>}
      </label>
      {children}
      <p
        id={`${id}-error`}
        role="alert"
        className={cn('overflow-hidden text-xs text-peach-600 transition-all duration-300', error ? 'mt-1.5 max-h-10 opacity-100' : 'max-h-0 opacity-0')}
      >
        {error}
      </p>
    </div>
  )
}

