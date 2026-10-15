import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/sora'
import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './app/App'

const rootElement = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML viene pre-renderizado (bueno para SEO): React solo lo "hidrata".
// En desarrollo #root solo tiene el marcador <!--app-html--> y se renderiza desde cero.
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
