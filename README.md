# Portafolio · Oismer Sehuanes Guzmán

Sitio web personal para presentar mi experiencia como **Desarrollador Full Stack** y recibir solicitudes de clientes.

```
curriculum virtual/
├── frontend/            → React 19 + Vite 8 + Tailwind CSS 4 (sitio pre-renderizado para SEO) · Dockerfile + Nginx
├── backend/             → Node.js + TypeScript + Express 5 + MySQL (API con migraciones) · Dockerfile
├── .github/workflows/   → Integración continua (GitHub Actions)
└── docker-compose.yml   → Entorno completo en contenedores
```

**Producción:** frontend en **Vercel** · backend + MySQL en **Railway** · código en **GitHub** con CI.

---

## 🚀 Puesta en marcha (desarrollo)

Requisitos: **Node.js 20.19+** y **MySQL 8** (o MariaDB 10.4+, por ejemplo el de XAMPP).

### 1. Base de datos

Opción A — XAMPP: enciende MySQL desde el panel de XAMPP y crea la base de datos:

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Opción B — Docker (sin instalar MySQL): desde la raíz, `docker compose up -d mysql` (queda en el puerto **3307**; usa `DB_PORT=3307` en `backend/.env`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # luego ajusta DB_USER, DB_PASSWORD y ADMIN_API_KEY
npm run migrate           # crea las tablas
npm run dev               # API en http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # ajusta VITE_SITE_URL cuando tengas dominio
npm run dev               # sitio en http://localhost:5173
```

En desarrollo, Vite redirige automáticamente `/api` → `http://localhost:4000`.

---

## 🖼️ Cómo agregar las capturas de tus proyectos

Cada proyecto tiene su carpeta en `frontend/public/projects/`:

| Proyecto                 | Carpeta                                   |
| ------------------------ | ----------------------------------------- |
| v.ai                     | `public/projects/v-ai/`                   |
| TurnoPro                 | `public/projects/turnopro/`               |
| Contratos                | `public/projects/contratos/`              |
| Aliados                  | `public/projects/aliados/`                |
| Consentimiento informado | `public/projects/consentimiento-informado/` |
| ConfordCare              | `public/projects/confordcare/`            |

1. Toma capturas a pantalla completa (ideal **1600×1000 px**, formato 16:10, PNG o JPG).
2. **Oculta o difumina datos reales** (nombres de pacientes, documentos, valores de contratos…).
3. Nómbralas en orden: `1.png`, `2.png`, `3.png`… (la `1` es la portada de la tarjeta).
4. Ejecuta `npm run images` dentro de `frontend/`: las convierte a WebP livianas y te imprime las rutas.
5. Pega esas rutas en `images: [...]` del proyecto en `src/data/projects.ts`.

Mientras un proyecto no tenga imágenes, se muestra un mockup ilustrado con su color.

---

## 🔍 SEO incluido

- HTML **pre-renderizado** en el build (`npm run build`): Google lee todo el contenido sin ejecutar JavaScript.
- Título, descripción y palabras clave orientadas a "desarrollador full stack Barranquilla / Colombia".
- **Datos estructurados** (Schema.org: `Person`, `ProfessionalService`, `WebSite`).
- Open Graph + Twitter Cards con imagen (`og-image.png`) para que el enlace se vea bien al compartirlo.
- `sitemap.xml` y `robots.txt` generados automáticamente con tu dominio.
- Fuentes auto-alojadas, una sola `<h1>`, HTML semántico, textos alternativos y modo oscuro.

**Para posicionar en Google, después de publicar:**

1. Compra un dominio y ponlo en `VITE_SITE_URL` (frontend/.env) antes de hacer el build.
2. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y envía `https://tudominio.com/sitemap.xml`.
3. Crea tu **Perfil de Empresa en Google** (Google Business Profile) como desarrollador en Barranquilla.
4. Enlaza el sitio desde LinkedIn, GitHub y tus redes: los enlaces entrantes son clave para subir posiciones.

---

## 🧭 Estructura del frontend

```
frontend/src/
├── app/              App.tsx: orden de las secciones
├── components/
│   ├── layout/       Navbar, menú móvil, footer, barra de progreso, botones flotantes
│   └── ui/           Piezas reutilizables: Button, Logo, Modal, Reveal, SectionHeading, Marquee...
├── sections/         Una carpeta por sección (hero, about, services, experience, projects...)
├── data/             ✏️ TODO el contenido editable: perfil, experiencia, proyectos, servicios, habilidades
├── hooks/            Lógica reutilizable (carrusel, tema, sección activa, scroll)
├── lib/              Utilidades (cn, fechas, animaciones, colores de acento, tema)
├── schemas/          Validación del formulario (Zod)
├── services/         Llamadas a la API
├── styles/           Tailwind + sistema de diseño (paleta pastel, modo oscuro)
├── main.tsx          Entrada del navegador
└── entry-server.tsx  Entrada del pre-renderizado (solo build)
```

> Para cambiar textos, proyectos o experiencia **solo edita los archivos de `src/data/`**.

## 🧭 Estructura del backend

```
backend/src/
├── config/env.ts            Variables de entorno validadas (falla al arrancar si falta algo)
├── database/
│   ├── migrations/          Migraciones (Knex) — historial versionado de la base de datos
│   ├── cli/migrate.ts       Comandos: migrate, migrate:rollback, migrate:status, migrate:make
│   ├── connection.ts        Pool de conexiones MySQL
│   └── knexConfig.ts
├── modules/contacts/        routes → controller → service → repository (+ schema y types)
├── middlewares/             Validación, auth admin, rate limit, manejo de errores
├── services/mailer.ts       Aviso por correo opcional (SMTP)
├── app.ts                   Configuración de Express
└── server.ts                Arranque y cierre ordenado
```

### Endpoints

| Método  | Ruta                         | Acceso  | Descripción                               |
| ------- | ---------------------------- | ------- | ----------------------------------------- |
| `GET`   | `/api/health`                | Público | Estado de la API y de MySQL               |
| `POST`  | `/api/contacts`              | Público | Registra un mensaje (máx. 5 cada 15 min por IP) |
| `GET`   | `/api/contacts?status&page&limit` | Admin | Lista los mensajes recibidos           |
| `GET`   | `/api/contacts/:id`          | Admin   | Detalle de un mensaje                     |
| `PATCH` | `/api/contacts/:id/status`   | Admin   | Cambia el estado: `new`, `read`, `replied`, `archived` |

Las rutas de admin requieren la cabecera `Authorization: Bearer <ADMIN_API_KEY>`. Ejemplo:

```bash
curl http://localhost:4000/api/contacts -H "Authorization: Bearer TU_ADMIN_API_KEY"
```

### Migraciones

```bash
npm run migrate                       # aplica las pendientes
npm run migrate:status                # muestra aplicadas / pendientes
npm run migrate:rollback              # revierte el último lote
npm run migrate:make add_campo_x      # crea una migración nueva en src/database/migrations
```

### Correos del formulario

Cada mensaje del formulario envía **dos correos** con el diseño de la marca:

| Correo | Para | Contenido |
| ------ | ---- | --------- |
| Notificación | Tú (`MAIL_TO`) | Todos los datos del formulario y botones para responder por correo o WhatsApp. Al darle "Responder", le escribes directo al cliente. |
| Confirmación | Quien escribió | Agradecimiento, aviso de que lo contactarás pronto, próximos pasos y tu firma. |

Las plantillas están en `backend/src/modules/contacts/emails/` y las piezas visuales en `backend/src/services/mail/templates/layout.ts`.

**Proveedores de correo** (`backend/src/services/mail/providers/`). Se usa el primero que esté configurado:

| Proveedor | Variables | Cuándo usarlo |
| --------- | --------- | ------------- |
| Resend | `RESEND_API_KEY`, `MAIL_FROM` | Con dominio propio (100 correos/día gratis) |
| Brevo | `BREVO_API_KEY`, `MAIL_FROM` | Con dominio propio (300 correos/día gratis) |
| **Google Apps Script** | `GOOGLE_SCRIPT_URL`, `GOOGLE_SCRIPT_SECRET` | **Producción en Railway sin dominio** (gratis, ~100 destinatarios/día) |
| SMTP (Gmail) | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Desarrollo local (Railway Trial/Hobby bloquea SMTP) |
| Vista previa | — | Sin proveedor: guarda los correos como HTML en `backend/.mail-previews/` |

**Activar Google Apps Script (producción):**

1. Genera una clave secreta: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. Entra a [script.google.com](https://script.google.com) con tu Gmail → **Nuevo proyecto** → pega el contenido de
   `backend/google-apps-script/Code.gs` y guarda.
3. **Configuración del proyecto** (ícono ⚙️) → **Propiedades del script** → agrega `RELAY_SECRET` con la clave del paso 1.
4. **Implementar → Nueva implementación** → tipo **Aplicación web** → *Ejecutar como:* **Yo** ·
   *Quién tiene acceso:* **Cualquier usuario** → **Implementar** y autoriza el permiso de enviar correos.
5. Copia la URL que termina en `/exec` y en Railway agrega:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   GOOGLE_SCRIPT_SECRET=<la clave del paso 1>
   ```

> Si cambias `Code.gs`, crea una **nueva versión** de la implementación (Implementar → Gestionar implementaciones → editar → Nueva versión): la URL se mantiene.

**Gmail por SMTP (desarrollo local):** activa la [verificación en 2 pasos](https://myaccount.google.com/signinoptions/two-step-verification),
crea una [contraseña de aplicación](https://myaccount.google.com/apppasswords) y completa `SMTP_HOST=smtp.gmail.com`,
`SMTP_USER` y `SMTP_PASS` en `backend/.env`.

`npm run mail:test` envía los dos correos de ejemplo a tu bandeja con el proveedor activo;
`npm run mail:preview` los genera como HTML para revisar el diseño sin enviar nada.

La base de datos registra cuándo salió cada correo (`owner_notified_at` y `confirmation_sent_at`).

---

## 🛡️ Seguridad y anti-bots

**Formulario de contacto: defensa en capas** (`backend/src/modules/contacts/contact.antispam.ts`)

| Capa | Qué detiene | Respuesta |
| ---- | ----------- | --------- |
| Honeypot (campo invisible) | Bots que llenan todos los campos | "Éxito" falso, no se guarda nada |
| Trampa de tiempo (< 3 s) | Bots que envían al instante o llaman la API directo | "Éxito" falso, no se guarda nada |
| Cloudflare Turnstile (opcional) | Bots avanzados / navegadores automatizados | 400 con mensaje claro |
| Máx. 2 enlaces por mensaje | Spam publicitario | 400 con mensaje claro |
| Duplicados en 24 h | Doble clic, reenvíos | Se ignora sin reenviar correos |
| Máx. 3 mensajes por correo / 24 h | Bombardeo de confirmaciones a una víctima | 429 |
| Máx. 5 envíos por IP / 15 min | Ráfagas desde una misma IP | 429 |

**API:** Helmet (cabeceras seguras), CORS restringido, límite de 20 KB por petición, validación estricta con Zod
(bloquea saltos de línea y caracteres invisibles en nombres), consultas parametrizadas (sin inyección SQL),
clave de admin comparada en tiempo constante y con límite de 10 intentos fallidos / 15 min,
tiempos máximos por conexión (anti *slowloris*) y errores internos que nunca exponen detalles en producción.

**Sitio web:** el build inserta en el HTML una **Content-Security-Policy** estricta (solo se ejecuta
JavaScript propio; el único script en línea se autoriza por su hash). Las demás cabeceras (HSTS,
anti-*clickjacking*, caché inmutable) están en `frontend/vercel.json` y en `frontend/nginx.conf` para Docker.

### Activar Cloudflare Turnstile (recomendado en producción)

1. Crea un widget gratis en [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) con tu dominio.
2. Frontend `.env`: `VITE_TURNSTILE_SITE_KEY=<site key>` · Backend `.env`: `TURNSTILE_SECRET_KEY=<secret key>`.
3. Vuelve a hacer el build del frontend. Para pruebas locales Cloudflare ofrece claves de prueba
   (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`).

### ✅ Lista de chequeo antes de publicar

- [ ] `NODE_ENV=production` (la API se niega a arrancar si detecta configuración insegura).
- [ ] `ADMIN_API_KEY` aleatoria de 32+ caracteres: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- [ ] `SITE_URL` y `CORS_ORIGINS` con tu dominio real (sin `localhost`).
- [ ] `TRUST_PROXY=1` si la API está detrás de un proxy (Nginx, Render, Railway…); si no, el límite por IP no funciona bien.
- [ ] Usuario de MySQL con permisos mínimos (no `root`):
  ```sql
  CREATE USER 'portfolio_app'@'%' IDENTIFIED BY 'una-contraseña-larga';
  GRANT SELECT, INSERT, UPDATE, CREATE, ALTER, INDEX, DROP, REFERENCES ON portfolio.* TO 'portfolio_app'@'%';
  ```
- [ ] HTTPS activo en el sitio y en la API.
- [ ] Turnstile configurado (opcional pero muy recomendado).

---

## 🐳 Docker: todo el proyecto con un comando

```bash
cp .env.example .env        # completa DB_PASSWORD, MYSQL_ROOT_PASSWORD y ADMIN_API_KEY
docker compose up --build   # MySQL + API + sitio
```

Abre **http://localhost:8080**. Las migraciones se aplican solas al arrancar la API.

| Contenedor | Imagen | Detalles |
| ---------- | ------ | -------- |
| `frontend` | Nginx sin privilegios (~77 MB) | Sirve el sitio y redirige `/api` al backend |
| `backend` | Node 22 Alpine, usuario `node` | Migraciones + API, con chequeo de salud |
| `mysql` | MySQL 8.4 | Datos en el volumen `mysql_data`; solo accesible desde tu PC en el puerto 3307 |

`docker compose down` lo apaga y conserva los datos; con `docker compose down -v` también los borra.

---

## 🔄 Integración continua (GitHub Actions)

`.github/workflows/ci.yml` se ejecuta en cada push y pull request a `main`:

1. **Frontend:** lint, tipos, build con pre-renderizado y auditoría de dependencias.
2. **Backend:** tipos, build, auditoría, migraciones (aplicar → revertir → aplicar) contra un **MySQL real**
   y las **pruebas de humo** (`backend/scripts/smoke-test.mjs`) contra la API corriendo.
3. **Docker:** construye las dos imágenes (solo si los pasos anteriores pasan).

**Dependabot** (`.github/dependabot.yml`) abre pull requests semanales con actualizaciones de dependencias;
cada uno pasa por el CI antes de que decidas fusionarlo.

---

## 🚀 Despliegue

### 1. GitHub
1. Crea un repositorio vacío (sin README) en [github.com/new](https://github.com/new).
   Puede ser **público**: no contiene secretos (los `.env` nunca se suben) y sirve como muestra de tu trabajo.
2. Conéctalo y sube el código:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. Protege `main`: *Settings → Rules → Rulesets → New branch ruleset* → aplica a `main` y activa
   **Require status checks to pass** con los checks del CI. Así nada llega a producción sin pasar las pruebas.
   (En el plan gratuito de GitHub esta protección solo está disponible para repositorios públicos.)

### 2. Backend + MySQL en Railway
1. En [railway.com](https://railway.com) → *New Project → Deploy from GitHub repo* → elige el repositorio.
2. En el servicio creado: *Settings → Root Directory* = `backend` (usa `backend/railway.json` y el `Dockerfile`).
   Activa **Wait for CI** para que solo despliegue cuando GitHub Actions pase.
3. *New → Database → MySQL* en el mismo proyecto.
4. Variables del servicio backend (*Variables*):
   ```
   NODE_ENV=production
   TRUST_PROXY=1
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   ADMIN_API_KEY=<clave aleatoria de 64 caracteres>
   SITE_URL=https://tu-dominio.com
   CORS_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=oismer3405@gmail.com
   SMTP_PASS=<contraseña de aplicación de Gmail>
   MAIL_TO=oismer3405@gmail.com
   TURNSTILE_SECRET_KEY=<secret key de Cloudflare>
   ```
5. *Settings → Networking → Generate Domain* (o agrega `api.tu-dominio.com`). Comprueba `https://<dominio>/api/health`.

### 3. Frontend en Vercel
1. En [vercel.com/new](https://vercel.com/new) importa el repositorio.
2. **Root Directory** = `frontend` (Vercel detecta Vite y usa `frontend/vercel.json`).
3. Variables de entorno (*Settings → Environment Variables*):
   ```
   VITE_SITE_URL=https://tu-dominio.com
   VITE_API_URL=https://api.tu-dominio.com/api
   VITE_TURNSTILE_SITE_KEY=<site key de Cloudflare>
   ```
4. Agrega tu dominio en *Settings → Domains*.

Desde ahora: **cada push a `main` publica el sitio y la API**, y cada pull request genera una
**vista previa** del sitio en Vercel. `vercel.json` evita reconstruir el frontend cuando solo cambió el backend.

> Si cambias una variable `VITE_*` en Vercel, vuelve a desplegar: quedan grabadas en el build.
