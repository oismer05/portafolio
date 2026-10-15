import { useEffect, useRef } from 'react'

/** API mínima que expone el script de Cloudflare Turnstile en window.turnstile */
interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Carga el script de Turnstile una sola vez, aunque haya varios widgets */
let scriptPromise: Promise<TurnstileApi> | null = null
function loadTurnstile(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile no disponible')))
    script.onerror = () => {
      scriptPromise = null // permite reintentar más tarde
      reject(new Error('No se pudo cargar Turnstile'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

interface TurnstileWidgetProps {
  siteKey: string
  /** Recibe el token cuando la verificación pasa, o null si expira o falla */
  onTokenChange: (token: string | null) => void
}

/**
 * Verificación anti-bots de Cloudflare (casi siempre invisible para las personas).
 * Cada token sirve una sola vez: para pedir uno nuevo, el padre cambia la `key` del componente.
 */
export function TurnstileWidget({ siteKey, onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Referencia estable al callback para no volver a crear el widget en cada render
  const onTokenChangeRef = useRef(onTokenChange)
  useEffect(() => {
    onTokenChangeRef.current = onTokenChange
  }, [onTokenChange])

  useEffect(() => {
    let widgetId: string | null = null
    let isCancelled = false

    loadTurnstile()
      .then((turnstile) => {
        if (isCancelled || !containerRef.current) return
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language: 'es',
          theme: 'auto',
          callback: (token: string) => onTokenChangeRef.current(token),
          'expired-callback': () => onTokenChangeRef.current(null),
          'error-callback': () => onTokenChangeRef.current(null),
        })
      })
      .catch(() => onTokenChangeRef.current(null))

    return () => {
      isCancelled = true
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [siteKey])

  return <div ref={containerRef} className="min-h-[65px]" />
}
