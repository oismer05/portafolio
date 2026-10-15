import { CircleAlert, CircleCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'

export type SubmitStatus = 'idle' | 'success' | 'error'

interface SubmitFeedbackProps {
  status: SubmitStatus
  /** Mensaje a mostrar cuando status es 'error' */
  errorMessage: string
}

/** Aviso animado con el resultado del envío del formulario */
export function SubmitFeedback({ status, errorMessage }: SubmitFeedbackProps) {
  const isSuccess = status === 'success'
  const Icon = isSuccess ? CircleCheck : CircleAlert

  return (
    <AnimatePresence mode="wait">
      {status !== 'idle' && (
        <motion.div
          key={status}
          role="status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm',
            isSuccess
              ? 'bg-mint-100 text-mint-600 dark:bg-mint-400/10 dark:text-mint-300'
              : 'bg-peach-100 text-peach-600 dark:bg-peach-400/10 dark:text-peach-300',
          )}
        >
          <Icon className="size-5 shrink-0" />
          {isSuccess ? '¡Gracias! Recibí tu mensaje y te responderé lo antes posible.' : errorMessage}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
