import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'
import { useCallback, useEffect, useState } from 'react'

interface UseCarouselOptions extends EmblaOptionsType {
  /** Milisegundos entre cada desplazamiento automático. Omitir = sin autoplay */
  autoplayDelay?: number
}

/**
 * Envuelve Embla Carousel y expone todo lo necesario para pintar
 * flechas y puntos de navegación sin repetir lógica en cada carrusel.
 */
export function useCarousel({ autoplayDelay, ...options }: UseCarouselOptions = {}) {
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: true, ...options },
    autoplayDelay
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })]
      : [],
  )

  // Índice de la diapositiva visible: controla qué punto se resalta
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Posiciones a las que se puede saltar: una por cada punto
  const [snapCount, setSnapCount] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const syncState = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setSnapCount(emblaApi.scrollSnapList().length)
    }

    syncState()
    emblaApi.on('select', syncState).on('reInit', syncState)
    return () => {
      emblaApi.off('select', syncState).off('reInit', syncState)
    }
  }, [emblaApi])

  return { viewportRef, emblaApi, selectedIndex, snapCount, scrollPrev, scrollNext, scrollTo }
}
