import type { Rng } from './types'

/** mulberry32: veloce, deterministico, sufficiente per un gioco. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** cyrb53 ridotto a 32 bit. */
export function seedFromString(s: string): number {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (h1 ^ h2) >>> 0
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function pickWeighted<K extends string | number>(weights: Record<K, number>, rng: Rng): K {
  const entries = (Object.entries(weights) as [string, number][]).filter(([, w]) => w > 0)
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  // Le chiavi degli oggetti sono sempre stringhe: quelle numeriche tornano numeri.
  const asKey = (k: string) => (/^\d+$/.test(k) ? Number(k) : k) as K
  let r = rng() * total
  for (const [key, w] of entries) {
    r -= w
    if (r < 0) return asKey(key)
  }
  return asKey(entries[entries.length - 1][0])
}
