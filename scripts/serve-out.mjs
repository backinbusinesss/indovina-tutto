/**
 * Piccolo server statico per provare la build di produzione sotto /indovina-tutto/,
 * come su GitHub Pages. Uso: node scripts/serve-out.mjs (porta 3124)
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'out')
const base = '/indovina-tutto'
const port = Number(process.env.PORT ?? 3124)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' }

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x')
  if (url.pathname === '/') { res.writeHead(302, { location: `${base}/` }); return res.end() }
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end('404') }
  let file = join(root, decodeURIComponent(url.pathname.slice(base.length)))
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) { res.writeHead(404, { 'content-type': 'text/html' }); return createReadStream(join(root, '404.html')).pipe(res) }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`http://localhost:${port}${base}/`))
