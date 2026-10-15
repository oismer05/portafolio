/**
 * Prueba de humo de la API (la ejecuta GitHub Actions en cada push).
 * Hace preguntas básicas a una API real conectada a MySQL:
 * ¿responde?, ¿valida?, ¿frena bots?, ¿protege las rutas de admin?
 *
 * Uso: API_URL=http://localhost:4000/api ADMIN_API_KEY=... node scripts/smoke-test.mjs
 */
const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? ''
const runId = Date.now()

const contact = (overrides = {}) => ({
  name: 'Prueba Automatizada',
  email: `ci-${runId}@example.com`,
  phone: '',
  company: '',
  service: 'Otro',
  message: 'Mensaje enviado por la prueba de humo del CI.',
  website: '',
  elapsedMs: 8000,
  ...overrides,
})

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  })
  return { status: response.status, json: await response.json().catch(() => null) }
}

const checks = [
  ['La API y MySQL responden', async () => {
    const { status, json } = await request('/health')
    return status === 200 && json?.database === 'up'
  }],
  ['Rechaza datos inválidos (400)', async () => (await request('/contacts', { method: 'POST', body: { name: 'A' } })).status === 400],
  ['Rechaza peticiones gigantes (413)', async () =>
    (await request('/contacts', { method: 'POST', body: contact({ message: 'x'.repeat(50_000) }) })).status === 413],
  ['Bloquea saltos de línea en el nombre (400)', async () =>
    (await request('/contacts', { method: 'POST', body: contact({ name: 'Ana\r\nBcc: x@y.com' }) })).status === 400],
  ['Acepta un mensaje legítimo (201)', async () => (await request('/contacts', { method: 'POST', body: contact() })).status === 201],
  ['Bot con honeypot: responde 201 sin guardar', async () =>
    (await request('/contacts', { method: 'POST', body: contact({ email: `bot-${runId}@example.com`, website: 'spam' }) })).status === 201],
  ['Rutas de admin sin clave (401)', async () => (await request('/contacts')).status === 401],
  ['Admin ve el mensaje legítimo y no el del bot', async () => {
    const { status, json } = await request('/contacts?limit=100', { headers: { Authorization: `Bearer ${ADMIN_API_KEY}` } })
    const emails = (json?.data ?? []).map((message) => message.email)
    return status === 200 && emails.includes(`ci-${runId}@example.com`) && !emails.includes(`bot-${runId}@example.com`)
  }],
]

let failures = 0
for (const [name, check] of checks) {
  const passed = await check().catch((error) => {
    console.error(`   ${error.message}`)
    return false
  })
  console.log(`${passed ? '✓' : '✗'} ${name}`)
  if (!passed) failures++
}

console.log(failures === 0 ? '\nTodas las pruebas pasaron.' : `\n${failures} prueba(s) fallaron.`)
process.exit(failures === 0 ? 0 : 1)
