import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección que está visible en pantalla.
 * Se usa para resaltar el enlace correspondiente en la barra de navegación.
 */
export function useActiveSection(sectionIds: string[]): string {
  // Sección visible actualmente; empieza en la primera (Inicio)
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      // Una sección se considera "activa" cuando cruza la franja central de la pantalla
      { rootMargin: '-45% 0px -50% 0px' },
    )

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
