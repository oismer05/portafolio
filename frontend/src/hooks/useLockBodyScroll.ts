import { useEffect } from 'react'

/** Bloquea el scroll del body mientras `isLocked` sea true (menús y modales abiertos) */
export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLocked])
}
