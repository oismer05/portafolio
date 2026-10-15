import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CarouselControlsProps {
  selectedIndex: number
  snapCount: number
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
  className?: string
}

/** Flechas + indicadores de posición para cualquier carrusel basado en useCarousel */
export function CarouselControls({
  selectedIndex,
  snapCount,
  onPrev,
  onNext,
  onSelect,
  className,
}: CarouselControlsProps) {
  if (snapCount <= 1) return null

  const arrowClasses =
    'grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-all hover:border-lavender-300 hover:bg-lavender-50 active:scale-95 dark:hover:bg-lavender-500/10'

  return (
    <div className={cn('flex items-center justify-between gap-6', className)}>
      <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar diapositiva">
        {Array.from({ length: snapCount }, (_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              index === selectedIndex ? 'w-8 bg-lavender-500' : 'w-2 bg-line hover:bg-lavender-300',
            )}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onPrev} className={arrowClasses} aria-label="Anterior">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={onNext} className={arrowClasses} aria-label="Siguiente">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
