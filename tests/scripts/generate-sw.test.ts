import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
// @ts-expect-error modulo JavaScript senza tipi
import { buildServiceWorker, generateServiceWorker } from '../../scripts/generate-sw.mjs'

describe('generate-sw', () => {
  it('scrive sw.js con i percorsi sotto il prefisso di GitHub Pages', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sw-'))
    writeFileSync(join(dir, 'index.html'), '<html></html>')
    mkdirSync(join(dir, 'app'))
    writeFileSync(join(dir, 'app', 'index.html'), '<html></html>')
    generateServiceWorker(dir, '/indovina-tutto')
    const sw = readFileSync(join(dir, 'sw.js'), 'utf8')
    expect(sw).toContain("'/indovina-tutto/index.html'")
    expect(sw).toContain("'/indovina-tutto/app/index.html'")
    expect(sw).toContain("'/indovina-tutto/'")
    expect(sw).toContain("'/indovina-tutto/app/'")
    expect(sw).not.toContain("'/indovina-tutto/sw.js'")
  })

  it('il nome della cache cambia se cambiano i file', () => {
    const a = buildServiceWorker([{ path: 'index.html', hash: 'aaa' }], '')
    const b = buildServiceWorker([{ path: 'index.html', hash: 'bbb' }], '')
    const name = (s: string) => s.match(/const CACHE = '([^']+)'/)?.[1]
    expect(name(a)).toBeTruthy()
    expect(name(a)).not.toBe(name(b))
  })

  it('senza prefisso i percorsi partono dalla radice', () => {
    const sw = buildServiceWorker([{ path: 'flags/it.svg', hash: 'x' }], '')
    expect(sw).toContain("'/flags/it.svg'")
  })

  it('non mette in cache i caratteri di alfabeti che non servono', () => {
    const sw = buildServiceWorker(
      [
        { path: '_next/static/media/inter-latin.woff2', hash: '1' },
        { path: '_next/static/media/inter-cyrillic.woff2', hash: '2' },
      ],
      '',
    )
    expect(sw).toContain('inter-latin')
    expect(sw).not.toContain('inter-cyrillic')
  })
})
