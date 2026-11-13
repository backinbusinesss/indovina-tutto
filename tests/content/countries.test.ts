import { describe, expect, it } from 'vitest'
import isoCountries from 'i18n-iso-countries'
import { COUNTRIES, type Continent, type Region } from '@/content/countries'

const REGION_CONTINENT: Record<Region, Continent> = {
  europa: 'Europa',
  asia: 'Asia',
  africa: 'Africa',
  'nord-america': 'America',
  'centro-america-caraibi': 'America',
  'sud-america': 'America',
  oceania: 'Oceania',
}

const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('COUNTRIES', () => {
  it('sono 195: i 193 membri ONU più Vaticano e Palestina', () => {
    expect(COUNTRIES).toHaveLength(195)
    expect(COUNTRIES.some((c) => c.iso2 === 'VA')).toBe(true)
    expect(COUNTRIES.some((c) => c.iso2 === 'PS')).toBe(true)
  })

  it('codici, nomi e capitali sono tutti diversi', () => {
    expect(unique(COUNTRIES.map((c) => c.iso2))).toBe(true)
    expect(unique(COUNTRIES.map((c) => c.name))).toBe(true)
    expect(unique(COUNTRIES.map((c) => c.capital))).toBe(true)
  })

  it('il codice numerico ISO corrisponde al codice a due lettere', () => {
    const wrong = COUNTRIES.filter((c) => isoCountries.alpha2ToNumeric(c.iso2) !== c.num).map((c) => `${c.iso2}:${c.num}`)
    expect(wrong).toEqual([])
  })

  it('regione e continente sono coerenti (tranne i paesi a cavallo di due continenti)', () => {
    const wrong = COUNTRIES.filter((c) => !c.transcontinental && REGION_CONTINENT[c.region] !== c.continent).map((c) => c.iso2)
    expect(wrong).toEqual([])
  })

  it('i paesi a cavallo di due continenti sono quelli previsti', () => {
    expect(COUNTRIES.filter((c) => c.transcontinental).map((c) => c.iso2).sort()).toEqual(
      ['AM', 'AZ', 'CY', 'EG', 'GE', 'KZ', 'RU', 'TR'],
    )
  })

  it('tra 45 e 65 paesi famosi', () => {
    const famous = COUNTRIES.filter((c) => c.fame === 1).length
    expect(famous).toBeGreaterThanOrEqual(45)
    expect(famous).toBeLessThanOrEqual(65)
  })

  it('almeno 150 sagome riconoscibili', () => {
    expect(COUNTRIES.filter((c) => c.shape).length).toBeGreaterThanOrEqual(150)
  })

  it('niente domanda sulla capitale per i paesi con capitale contesa o non ufficiale', () => {
    expect(COUNTRIES.filter((c) => !c.capitalQuiz).map((c) => c.iso2).sort()).toEqual(['IL', 'NR', 'PS'])
  })

  it('campi testuali non vuoti', () => {
    for (const c of COUNTRIES) {
      expect(c.name.trim()).not.toBe('')
      expect(c.capital.trim()).not.toBe('')
      expect(c.currency.trim()).not.toBe('')
      if (c.language !== null) expect(c.language.trim()).not.toBe('')
    }
  })
})
