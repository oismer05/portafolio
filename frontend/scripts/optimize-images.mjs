/**
 * Optimiza las capturas de los proyectos.
 *
 * Uso:
 *   1. Copia tus capturas (PNG o JPG) en  public/projects/<slug>/   (ej. public/projects/turnopro/)
 *   2. Ejecuta:  npm run images
 *
 * Cada imagen se redimensiona a máx. 1600px de ancho, se convierte a WebP (mucho más liviano)
 * y se elimina el original. Al final se imprimen las rutas listas para pegar en src/data/projects.ts
 */
import { readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectsDir = fileURLToPath(new URL('../public/projects', import.meta.url))
const MAX_WIDTH = 1600
const convertible = /\.(png|jpe?g)$/i

const slugs = (await readdir(projectsDir, { withFileTypes: true })).filter((entry) => entry.isDirectory())

if (slugs.length === 0) {
  console.log('No hay carpetas en public/projects. Crea una por proyecto (ej. public/projects/turnopro/)')
}

for (const { name: slug } of slugs) {
  const folder = path.join(projectsDir, slug)
  const files = (await readdir(folder)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const file of files.filter((f) => convertible.test(f))) {
    const source = path.join(folder, file)
    const target = source.replace(convertible, '.webp')
    const before = (await stat(source)).size

    await sharp(source).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target)
    await rm(source)

    const after = (await stat(target)).size
    console.log(`✓ ${slug}/${file} → ${path.basename(target)}  (${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB)`)
  }

  const webps = (await readdir(folder)).filter((f) => f.endsWith('.webp')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  if (webps.length > 0) {
    console.log(`\n  ${slug} → images: [${webps.map((f) => `'/projects/${slug}/${f}'`).join(', ')}]\n`)
  }
}
