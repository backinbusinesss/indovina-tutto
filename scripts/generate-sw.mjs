/**
 * Genera out/sw.js dopo `next build`: il service worker che rende il gioco
 * disponibile anche senza connessione.
 *
 * - all'installazione mette in cache tutti i file del sito (pagine, script, immagini);
 * - per le pagine prova prima la rete (così gli aggiornamenti arrivano) e poi la copia;
 * - per tutto il resto usa prima la copia salvata;
 * - quando cambia anche un solo file cambia il nome della cache e le vecchie si cancellano.
 *
 * Uso: node scripts/generate-sw.mjs [cartella]   (prefisso da NEXT_PUBLIC_BASE_PATH)
 */
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Caratteri di alfabeti che il gioco (in italiano) non usa: si scaricano solo se servono. */
const SKIP = [/(^|\/)sw\.js$/, /\.map$/, /cyrillic|greek|vietnamese/i, /(^|\/)og\.png$/]

function walk(dir, root = dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full, root) : [relative(root, full).split(sep).join('/')]
  })
}

/** @param {{ path: string, hash: string }[]} files @param {string} base */
export function buildServiceWorker(files, base) {
  const prefix = base.replace(/\/+$/, '')
  const kept = files.filter((f) => !SKIP.some((re) => re.test(f.path)))
  const urls = new Set()
  for (const f of kept) {
    urls.add(`${prefix}/${f.path}`)
    // le pagine si aprono anche come cartella: /app/ oltre a /app/index.html
    if (f.path === 'index.html') urls.add(`${prefix}/`)
    else if (f.path.endsWith('/index.html')) urls.add(`${prefix}/${f.path.slice(0, -'index.html'.length)}`)
  }
  const version = createHash('sha256')
    .update(kept.map((f) => `${f.path}:${f.hash}`).sort().join('\n'))
    .digest('hex')
    .slice(0, 12)
  const list = [...urls].sort().map((u) => `  '${u}',`).join('\n')

  return `/* generato da scripts/generate-sw.mjs: non modificare a mano */
const CACHE = 'it-${version}'
const BASE = '${prefix}'
const PRECACHE = [
${list}
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('it-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function save(request, response) {
  if (response && response.ok && response.type === 'basic') {
    const copy = response.clone()
    caches.open(CACHE).then((cache) => cache.put(request, copy))
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // pagine: prima la rete, poi la copia salvata, infine la home dell'app
    event.respondWith(
      fetch(request)
        .then((response) => save(request, response))
        .catch(() =>
          caches
            .match(request, { ignoreSearch: true })
            .then((cached) => cached || caches.match(BASE + '/app/'))
            .then((cached) => cached || caches.match(BASE + '/')),
        ),
    )
    return
  }

  // tutto il resto: prima la copia salvata
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request).then((response) => save(request, response))),
  )
})
`
}

/** Legge la cartella della build e scrive sw.js. */
export function generateServiceWorker(outDir, base) {
  const files = walk(outDir).map((path) => ({
    path,
    hash: createHash('sha1').update(readFileSync(join(outDir, path))).digest('hex').slice(0, 10),
  }))
  const sw = buildServiceWorker(files, base)
  writeFileSync(join(outDir, 'sw.js'), sw)
  return sw
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const outDir = process.argv[2] ?? 'out'
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const sw = generateServiceWorker(outDir, base)
  const count = (sw.match(/^ {2}'/gm) ?? []).length
  console.log(`sw.js: ${count} file in cache (prefisso "${base || '/'}")`)
}
