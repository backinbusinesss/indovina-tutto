import { CATEGORIES } from '@/content/categories'
import { getBank } from './bank'
import { DIFFICULTY_WEIGHTS } from './economy'
import { pickWeighted } from './rng'
import type { Difficulty, QuestionDef, Rng, Source } from './types'

/** Ordine di ripiego quando nella difficoltà estratta non restano domande. */
const FALLBACK: Record<Difficulty, Difficulty[]> = { 1: [1, 2, 3], 2: [2, 1, 3], 3: [3, 2, 1] }

const pickFrom = <T>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)]

function pickInPool(pool: readonly QuestionDef[], streak: number, rng: Rng): QuestionDef {
  const target = pickWeighted(DIFFICULTY_WEIGHTS(streak), rng)
  for (const d of FALLBACK[target]) {
    const candidates = pool.filter((q) => q.difficulty === d)
    if (candidates.length) return pickFrom(candidates, rng)
  }
  return pickFrom(pool, rng)
}

/**
 * Sceglie la prossima domanda non ancora vista.
 * Mix Tutto: prima una categoria a caso (tutte con la stessa probabilità), poi la domanda.
 * Se non resta nulla da vedere: exhausted = true e il chiamante azzera l'elenco delle viste.
 */
export function pickNext(
  source: Source,
  seen: ReadonlySet<string>,
  streak: number,
  rng: Rng,
): { def: QuestionDef; exhausted: boolean } {
  const unseen = (bank: readonly QuestionDef[]) => bank.filter((q) => !seen.has(q.id))

  if (source === 'mix') {
    const withUnseen = CATEGORIES.map((c) => unseen(getBank(c.id))).filter((b) => b.length > 0)
    if (withUnseen.length === 0) {
      const bank = getBank(pickFrom(CATEGORIES, rng).id)
      return { def: pickInPool(bank, streak, rng), exhausted: true }
    }
    return { def: pickInPool(pickFrom(withUnseen, rng), streak, rng), exhausted: false }
  }

  const bank = getBank(source)
  const left = unseen(bank)
  if (left.length === 0) return { def: pickInPool(bank, streak, rng), exhausted: true }
  return { def: pickInPool(left, streak, rng), exhausted: false }
}
