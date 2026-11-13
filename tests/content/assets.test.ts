import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import * as simpleIcons from 'simple-icons'
import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '@/content/countries'
import { LOGOS } from '@/content/logos'

const pub = (p: string) => join(process.cwd(), 'public', p)
const slugs = new Set(Object.values(simpleIcons as unknown as Record<string, { slug: string }>).map((i) => i.slug))

describe('immagini', () => {
  it("c'è una bandiera per ognuno dei 195 paesi", () => {
    const missing = COUNTRIES.filter((c) => !existsSync(pub(`flags/${c.iso2.toLowerCase()}.svg`))).map((c) => c.iso2)
    expect(missing).toEqual([])
  })

  it("c'è una sagoma per ogni paese con sagoma", () => {
    const missing = COUNTRIES.filter((c) => c.shape && !existsSync(pub(`shapes/${c.iso2.toLowerCase()}.svg`))).map(
      (c) => c.iso2,
    )
    expect(missing).toEqual([])
  })

  it('ogni sagoma ha un solo path ed è leggera', () => {
    for (const c of COUNTRIES.filter((x) => x.shape)) {
      const file = pub(`shapes/${c.iso2.toLowerCase()}.svg`)
      const svg = readFileSync(file, 'utf8')
      expect(svg.match(/<path/g)?.length, c.iso2).toBe(1)
      expect(statSync(file).size, c.iso2).toBeLessThan(40_000)
    }
  })

  it('almeno 120 loghi, slug e nomi unici, presenti in simple-icons', () => {
    expect(LOGOS.length).toBeGreaterThanOrEqual(120)
    expect(new Set(LOGOS.map((l) => l.slug)).size).toBe(LOGOS.length)
    expect(new Set(LOGOS.map((l) => l.name)).size).toBe(LOGOS.length)
    expect(LOGOS.filter((l) => !slugs.has(l.slug)).map((l) => l.slug)).toEqual([])
  })

  it("c'è un file per ogni logo", () => {
    expect(LOGOS.filter((l) => !existsSync(pub(`logos/${l.slug}.svg`))).map((l) => l.slug)).toEqual([])
  })

  it("ci sono le icone dell'app", () => {
    const files = [
      'brand/logo.svg',
      'icon.svg',
      'icons/icon-192.png',
      'icons/icon-512.png',
      'icons/icon-maskable-512.png',
      'icons/apple-touch-icon.png',
    ]
    for (const f of files) expect(existsSync(pub(f)), f).toBe(true)
  })
})
