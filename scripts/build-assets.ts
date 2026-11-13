/**
 * Genera le immagini del gioco in public/:
 *   flags/   bandiere (flag-icons, MIT)
 *   logos/   loghi (simple-icons, CC0) colorati col colore del marchio
 *   shapes/  sagome dei paesi (world-atlas 1:50M, ISC) proiettate e semplificate
 *   brand/, icons/, icon.svg  logo e icone dell'app
 * Più due fogli di controllo in scripts/out/ da guardare a occhio.
 *
 * Uso: npm run assets
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { geoArea, geoCentroid, geoDistance, geoMercator } from 'd3-geo'
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson'
import sharp from 'sharp'
import * as simpleIcons from 'simple-icons'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { COUNTRIES } from '../src/content/countries'
import { LOGOS } from '../src/content/logos'

const require = createRequire(import.meta.url)
const root = process.cwd()
const pub = (...p: string[]) => join(root, 'public', ...p)
const out = (...p: string[]) => join(root, 'scripts', 'out', ...p)
const ensure = (file: string) => mkdirSync(dirname(file), { recursive: true })
const write = (file: string, data: string | Buffer) => {
  ensure(file)
  writeFileSync(file, data)
}

const EARTH_KM = 6371

// ---------------------------------------------------------------- bandiere
function buildFlags() {
  const dir = join(dirname(require.resolve('flag-icons/package.json')), 'flags', '4x3')
  for (const c of COUNTRIES) {
    const code = c.iso2.toLowerCase()
    const dest = pub('flags', `${code}.svg`)
    ensure(dest)
    copyFileSync(join(dir, `${code}.svg`), dest)
  }
  console.log(`bandiere: ${COUNTRIES.length}`)
}

// ---------------------------------------------------------------- loghi
function luminance(hex: string) {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function buildLogos() {
  const bySlug = new Map(
    Object.values(simpleIcons as unknown as Record<string, { slug: string; hex: string; path: string }>).map((i) => [
      i.slug,
      i,
    ]),
  )
  for (const logo of LOGOS) {
    const icon = bySlug.get(logo.slug)
    if (!icon) throw new Error(`logo mancante in simple-icons: ${logo.slug}`)
    // I loghi si mostrano su un riquadro bianco: i colori troppo chiari diventano quasi neri.
    const fill = luminance(icon.hex) > 0.6 ? '#111827' : `#${icon.hex}`
    write(
      pub('logos', `${logo.slug}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="${icon.path}"/></svg>\n`,
    )
  }
  console.log(`loghi: ${LOGOS.length}`)
}

// ---------------------------------------------------------------- sagome
type Poly = Position[][]

const areaKm2 = (p: Poly) => geoArea({ type: 'Polygon', coordinates: p }) * EARTH_KM ** 2
const centroid = (p: Poly) => geoCentroid({ type: 'Polygon', coordinates: p })

/**
 * Tiene il territorio "principale" del paese: scarta isolette e territori d'oltremare
 * (Alaska e Hawaii, Guyana francese, Svalbard, Canarie, Galápagos…).
 */
function mainPolygons(geom: Polygon | MultiPolygon): Poly[] {
  const polys: Poly[] = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
  const withArea = polys.map((p) => ({ p, area: areaKm2(p) }))
  const largest = withArea.reduce((a, b) => (b.area > a.area ? b : a))
  const c0 = centroid(largest.p)
  const reach = Math.max(...largest.p[0].map((pt) => geoDistance(c0, pt as [number, number]) * EARTH_KM))
  const maxDist = Math.max(1200, 1.3 * reach)
  const minArea = Math.max(0.005 * largest.area, 1000)
  return withArea
    .filter(({ p, area }) => {
      if (p === largest.p) return true
      if (area < minArea) return false
      const d = geoDistance(c0, centroid(p)) * EARTH_KM
      return d <= maxDist || area >= 0.3 * largest.area
    })
    .map(({ p }) => p)
}

function ringPath(ring: [number, number][]): string {
  const kept: [number, number][] = []
  for (const pt of ring) {
    const last = kept[kept.length - 1]
    if (!last || Math.hypot(pt[0] - last[0], pt[1] - last[1]) >= 0.8) kept.push(pt)
  }
  if (kept.length < 3) return ''
  return `M${kept.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`
}

function buildShapes(): string[] {
  const topo = JSON.parse(
    readFileSync(join(dirname(require.resolve('world-atlas/package.json')), 'countries-50m.json'), 'utf8'),
  ) as Topology<{ countries: GeometryCollection }>
  const fc = feature(topo, topo.objects.countries)
  // Alcuni codici compaiono più volte (es. 036 = Australia e isole Ashmore e Cartier): vince la forma più grande.
  const byId = new Map<string, (typeof fc.features)[number]>()
  for (const f of fc.features) {
    const id = String(f.id).padStart(3, '0')
    const prev = byId.get(id)
    if (!prev || geoArea(f) > geoArea(prev)) byId.set(id, f)
  }
  const done: string[] = []
  for (const c of COUNTRIES.filter((x) => x.shape)) {
    const f = byId.get(c.num) as Feature<Polygon | MultiPolygon> | undefined
    if (!f) throw new Error(`sagoma mancante in world-atlas: ${c.iso2} (${c.num})`)
    const polys = mainPolygons(f.geometry)
    const main: Feature<MultiPolygon> = { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: polys } }
    const [lon] = geoCentroid(main)
    const projection = geoMercator()
      .rotate([-lon, 0])
      .fitExtent(
        [
          [8, 8],
          [248, 248],
        ],
        main,
      )
    const d = polys
      .flatMap((poly) => poly.map((ring) => ringPath(ring.map((pt) => projection(pt as [number, number]) as [number, number]))))
      .join('')
    write(
      pub('shapes', `${c.iso2.toLowerCase()}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`,
    )
    done.push(c.iso2)
  }
  console.log(`sagome: ${done.length}`)
  return done
}

// ---------------------------------------------------------------- logo e icone
const LOGO_MARK = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B6CFF"/>
      <stop offset="1" stop-color="#4B2FD6"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE08A"/>
      <stop offset="1" stop-color="#FFB21A"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="10">
    <circle cx="256" cy="256" r="150"/>
    <ellipse cx="256" cy="256" rx="62" ry="150"/>
    <path d="M110 206h292M110 306h292"/>
  </g>
  <path d="M206 210a50 50 0 1 1 74 44c-16 9-24 19-24 36v14" fill="none" stroke="url(#gold)" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="354" r="22" fill="url(#gold)"/>`

const logoSvg = (rounded: boolean) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
  `<rect width="512" height="512" ${rounded ? 'rx="116"' : ''} fill="url(#bg)"/>${LOGO_MARK}</svg>\n`

async function buildBrand() {
  const rounded = logoSvg(true)
  const square = logoSvg(false)
  write(pub('brand', 'logo.svg'), rounded)
  write(pub('icon.svg'), rounded)
  const png = (svg: string, size: number) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()
  write(pub('icons', 'icon-192.png'), await png(rounded, 192))
  write(pub('icons', 'icon-512.png'), await png(rounded, 512))
  // maskable: sfondo pieno, il disegno resta nella zona sicura centrale
  write(pub('icons', 'icon-maskable-512.png'), await png(square, 512))
  write(pub('icons', 'apple-touch-icon.png'), await png(square, 180))
  console.log('icone: ok')
}

// ---------------------------------------------------------------- fogli di controllo
async function contactSheet(file: string, items: { label: string; svg: string }[], cell = 120) {
  const cols = 12
  const rowsN = Math.ceil(items.length / cols)
  const w = cols * cell
  const h = rowsN * (cell + 18)
  const body = items
    .map((it, i) => {
      const x = (i % cols) * cell
      const y = Math.floor(i / cols) * (cell + 18)
      const inner = it.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
      const vb = it.svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 256 256'
      return `<g transform="translate(${x},${y})"><rect x="4" y="4" width="${cell - 8}" height="${cell - 8}" rx="10" fill="#fff"/><svg x="14" y="14" width="${cell - 28}" height="${cell - 28}" viewBox="${vb}" color="#1C2350">${inner}</svg><text x="${cell / 2}" y="${cell + 12}" font-size="12" font-family="Arial" text-anchor="middle" fill="#fff">${it.label}</text></g>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#0B0F2A"/>${body}</svg>`
  write(file, await sharp(Buffer.from(svg)).png().toBuffer())
}

async function main() {
  buildFlags()
  buildLogos()
  const shapes = buildShapes()
  await buildBrand()
  await contactSheet(
    out('shapes-preview.png'),
    shapes.map((iso) => ({ label: iso, svg: readFileSync(pub('shapes', `${iso.toLowerCase()}.svg`), 'utf8') })),
  )
  await contactSheet(
    out('logos-preview.png'),
    LOGOS.map((l) => ({ label: l.slug.slice(0, 14), svg: readFileSync(pub('logos', `${l.slug}.svg`), 'utf8') })),
  )
  console.log('fogli di controllo in scripts/out/')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
