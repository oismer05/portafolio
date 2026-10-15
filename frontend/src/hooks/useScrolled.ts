import { useEffect, useState } from 'react'

/** true cuando el usuario ha bajado más de `threshold` píxeles */
export function useScrolled(threshold = 16): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold)
    handleScroll() // estado correcto si la página se recarga a mitad de scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
