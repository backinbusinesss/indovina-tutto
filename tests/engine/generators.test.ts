import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '@/content/countries'
import { ofCountry } from '@/content/grammar'
import {
  generateCapitalQuestions,
  generateContinentQuestions,
  generateCurrencyLanguageQuestions,
  generateFlagQuestions,
  generateLogoQuestions,
  generateShapeQuestions,
} from '@/engine/generators'
import type { QuestionDef } from '@/engine/types'

const all: Record<string, QuestionDef[]> = {
  bandiere: generateFlagQuestions(),
  capitali: generateCapitalQuestions(),
  sagome: generateShapeQuestions(),
  loghi: generateLogoQuestions(),
  geografia: generateContinentQuestions(),
  valute: generateCurrencyLanguageQuestions(),
}
const every = Object.values(all).flat()

describe('ofCountry (preposizione articolata)', () => {
  it.each([
    ['IT', "dell'Italia"],
    ['FR', 'della Francia'],
    ['PE', 'del Perù'],
    ['US', 'degli Stati Uniti'],
    ['NL', 'dei Paesi Bassi'],
    ['PH', 'delle Filippine'],
    ['YE', 'dello Yemen'],
    ['CU', 'di Cuba'],
    ['KE', 'del Kenya'],
    ['ZA', 'del Sudafrica'],
    ['HN', "dell'Honduras"],
    ['CI', "della Costa d'Avorio"],
    ['VA', 'della Città del Vaticano'],
    ['CA', 'del Canada'],
  ])('%s → %s', (iso, expected) => {
    const c = COUNTRIES.find((x) => x.iso2 === iso)!
    expect(ofCountry(c)).toBe(expected)
  })
})

describe('domande generate', () => {
  it('raggiungono i minimi del progetto', () => {
    expect(all.bandiere.length).toBeGreaterThanOrEqual(390)
    expect(all.capitali.length).toBeGreaterThanOrEqual(384)
    expect(all.sagome.length).toBeGreaterThanOrEqual(150)
    expect(all.loghi.length).toBeGreaterThanOrEqual(120)
    expect(all.valute.length).toBeGreaterThanOrEqual(120)
    expect(all.geografia.length).toBeGreaterThanOrEqual(110)
  })

  it('ogni domanda è ben formata', () => {
    for (const d of every) {
      expect(d.distractors.length, d.id).toBeGreaterThanOrEqual(3)
      const labels = [d.answer.label, ...d.distractors.map((x) => x.label)]
      expect(new Set(labels).size, d.id).toBe(labels.length)
      expect(d.id.startsWith(`${d.category}:`), d.id).toBe(true)
      expect(d.prompt.trim(), d.id).not.toBe('')
    }
  })

  it('gli id sono tutti diversi', () => {
    expect(new Set(every.map((d) => d.id)).size).toBe(every.length)
  })

  it('il testo alternativo delle immagini non svela mai la risposta', () => {
    for (const d of every) {
      const alts = [d.media?.alt, d.answer.media?.alt, ...d.distractors.map((x) => x.media?.alt)].filter(Boolean)
      for (const alt of alts) expect(alt!.toLowerCase(), d.id).not.toContain(d.answer.label.toLowerCase())
    }
  })

  it('ogni immagine esiste in public/', () => {
    const srcs = new Set(
      every.flatMap((d) => [d.media?.src, d.answer.media?.src, ...d.distractors.map((x) => x.media?.src)]).filter(Boolean),
    )
    const missing = [...srcs].filter((s) => !existsSync(join(process.cwd(), 'public', s!)))
    expect(missing).toEqual([])
  })

  it('le domande sui continenti escludono i paesi a cavallo di due continenti', () => {
    const trans = new Set(COUNTRIES.filter((c) => c.transcontinental).map((c) => c.name))
    for (const d of all.geografia) {
      expect(trans.has(d.answer.label), d.id).toBe(false)
      for (const x of d.distractors) expect(trans.has(x.label), d.id).toBe(false)
    }
  })

  it('i distrattori dei continenti sono di altri continenti', () => {
    const byName = new Map(COUNTRIES.map((c) => [c.name, c]))
    for (const d of all.geografia) {
      const cont = byName.get(d.answer.label)!.continent
      for (const x of d.distractors) expect(byName.get(x.label)!.continent, d.id).not.toBe(cont)
    }
  })

  it('le bandiere da scegliere sono mostrate come immagini', () => {
    const pick = all.bandiere.filter((d) => d.id.startsWith('bandiere:pick:'))
    expect(pick.length).toBe(195)
    for (const d of pick) {
      expect(d.layout).toBe('images')
      expect(d.answer.media?.kind).toBe('flag')
    }
  })

  it('niente domande sulle capitali di Israele, Palestina e Nauru', () => {
    expect(all.capitali.some((d) => /:(IL|PS|NR)$/.test(d.id))).toBe(false)
  })
})
