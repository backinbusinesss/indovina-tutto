import { describe, expect, it } from 'vitest'
import { createRng, pickWeighted, seedFromString, shuffle } from '@/engine/rng'

describe('createRng', () => {
  it('con lo stesso seme dà la stessa sequenza', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).toEqual(seqB)
    seqA.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
    })
  })

  it('semi diversi danno sequenze diverse', () => {
    expect(createRng(1)()).not.toBe(createRng(2)())
  })
})

describe('seedFromString', () => {
  it('è stabile e cambia con il testo', () => {
    expect(seedFromString('2026-11-13')).toBe(seedFromString('2026-11-13'))
    expect(seedFromString('2026-11-13')).not.toBe(seedFromString('2026-11-14'))
    expect(Number.isInteger(seedFromString('x'))).toBe(true)
  })
})

describe('shuffle', () => {
  it('non perde né duplica elementi e non tocca l’originale', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8]
    const out = shuffle(src, createRng(7))
    expect([...out].sort((x, y) => x - y)).toEqual(src)
    expect(src).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})

describe('pickWeighted', () => {
  it('rispetta i pesi', () => {
    const rng = createRng(3)
    const counts = { a: 0, b: 0 }
    for (let i = 0; i < 2000; i++) counts[pickWeighted({ a: 0.9, b: 0.1 }, rng)]++
    expect(counts.a).toBeGreaterThan(1600)
    expect(counts.b).toBeGreaterThan(100)
  })

  it('non sceglie mai una chiave con peso zero', () => {
    const rng = createRng(5)
    for (let i = 0; i < 200; i++) expect(pickWeighted({ x: 0, y: 1 }, rng)).toBe('y')
  })
})

describe('pickWeighted con chiavi numeriche', () => {
  it('restituisce un numero, non una stringa', () => {
    const k = pickWeighted({ 1: 0, 2: 1, 3: 0 } as Record<1 | 2 | 3, number>, createRng(1))
    expect(k).toBe(2)
  })
})
