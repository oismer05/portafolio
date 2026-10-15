# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv
# (Las directivas deben ir primero. Se omite ese aviso porque la Site Key de Turnstile
#  es PÚBLICA: viaja al navegador, no es un secreto.)

# ─────────────────────────────────────────────────────────────
# Imagen del frontend: build con Node → servido por Nginx sin root.
# Se usa para el entorno local completo (docker compose) o un VPS.
# En producción el frontend vive en Vercel (ver vercel.json).
# ─────────────────────────────────────────────────────────────

# 1. Build (pre-renderizado incluido)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Las variables VITE_* quedan "grabadas" en el build: se pasan como argumentos
ARG VITE_SITE_URL=http://localhost:8080
ARG VITE_API_URL=/api
ARG VITE_TURNSTILE_SITE_KEY=
ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_API_URL=$VITE_API_URL \
    VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
RUN npm run build

# 2. Servidor web liviano que corre sin privilegios (puerto 8080)
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ > /dev/null || exit 1
