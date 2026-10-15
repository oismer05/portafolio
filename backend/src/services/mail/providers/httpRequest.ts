/**
 * POST JSON a la API de un proveedor de correo, con tiempo máximo.
 * Si responde con error, lanza una excepción con su mensaje para que quede en los logs.
 */
export async function postJson(providerName: string, url: string, headers: Record<string, string>, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`${providerName} respondió ${response.status}: ${detail.slice(0, 300)}`)
  }
}
