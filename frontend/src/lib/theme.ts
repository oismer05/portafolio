/**
 * Almacén mínimo del tema (claro/oscuro).
 *
 * La fuente de verdad es la clase .dark en <html>, que el script inline de index.html
 * aplica antes de pintar (evita el parpadeo). React se suscribe a este almacén
 * mediante useSyncExternalStore (ver hooks/useTheme.ts).
 */
export type Theme = 'light' | 'dark'

/** Clave en localStorage donde se recuerda la preferencia del visitante */
export const THEME_STORAGE_KEY = 'osg-theme'

/** Componentes suscritos que deben re-renderizarse cuando cambie el tema */
const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** En el pre-renderizado (Node) no existe document: se asume tema claro */
export function getServerTheme(): Theme {
  return 'light'
}

export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Navegación privada o almacenamiento bloqueado: el tema cambia igual, solo no se recuerda
  }
  listeners.forEach((notify) => notify())
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
