import { useCallback, useSyncExternalStore } from 'react'
import { getServerTheme, getTheme, setTheme, subscribeToTheme } from '@/lib/theme'

/** Tema actual + función para alternarlo. Todos los componentes que lo usan se mantienen sincronizados */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme)

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return { theme, toggleTheme }
}
