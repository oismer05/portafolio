# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────
# Imagen del backend (API + migraciones)
# Etapas: deps → build → runtime. La imagen final solo lleva el
# JavaScript compilado y las dependencias de producción.
# ─────────────────────────────────────────────────────────────

ARG NODE_VERSION=22-alpine

# 1. Dependencias completas (incluye TypeScript para compilar)
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Compilación de TypeScript → dist/
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 3. Imagen final: liviana y sin privilegios
FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Única carpeta con escritura: vistas previas de correos (modo sin SMTP)
RUN mkdir .mail-previews && chown node:node .mail-previews

# Se ejecuta con el usuario "node" (no root): si alguien comprometiera la app, tendría permisos mínimos
USER node
EXPOSE 4000

# Docker (y docker compose) consultan este endpoint para saber si el contenedor está sano
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" > /dev/null || exit 1

# Aplica las migraciones pendientes y arranca la API.
# "exec" deja a Node como proceso principal para que reciba las señales de apagado (cierre ordenado).
CMD ["sh", "-c", "node dist/database/cli/migrate.js latest && exec node dist/server.js"]
