/** Logger mínimo con fecha y nivel. Suficiente para una API pequeña; reemplazable por pino si crece */
function write(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta?: unknown): void {
  const line = `[${new Date().toISOString()}] ${level} ${message}`
  const output = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log
  if (meta === undefined) output(line)
  else output(line, meta)
}

export const logger = {
  info: (message: string, meta?: unknown) => write('INFO', message, meta),
  warn: (message: string, meta?: unknown) => write('WARN', message, meta),
  error: (message: string, meta?: unknown) => write('ERROR', message, meta),
}
