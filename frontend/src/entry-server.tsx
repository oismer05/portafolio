import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './app/App'

/**
 * Punto de entrada usado SOLO durante el build (scripts/prerender.mjs).
 * Genera el HTML completo de la página para que los buscadores lean todo
 * el contenido sin tener que ejecutar JavaScript.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
