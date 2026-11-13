import { CATEGORIES } from '@/content/categories'
import { getBank } from './bank'
import { DIFFICULTY_WEIGHTS } from './economy'
import { pickWeighted } from './rng'
import type { Difficulty, Level, QuestionDef, Rng, Source } from './types'

/** Ordine di ripiego quando nella difficoltà estratta non restano domande. */
const FALLBACK: Record<Difficulty, Difficulty[]> = { 1: [1, 2, 3], 2: [2, 1, 3], 3: [3, 2, 1] }

const pickFrom = <T>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)]

function pickInPool(pool: readonly QuestionDef[], streak: number, rng: Rng, level: Level): QuestionDef {
  if (level !== 'auto') return pickFrom(pool, rng)
  const target = pickWeighted(DIFFICULTY_WEIGHTS(streak), rng)
  for (const d of FALLBACK[target]) {
    const candidates = pool.filter((q) => q.difficulty === d)
    if (candidates.length) return pickFrom(candidates, rng)
  }
  return pickFrom(pool, rng)
}

/** Le domande di una categoria per il livello scelto ('auto' = tutte, con difficoltà che sale). */
export function bankFor(category: Exclude<Source, 'mix'>, level: Level): readonly QuestionDef[] {
  const bank = getBank(category)
  return level === 'auto' ? bank : bank.filter((q) => q.difficulty === level)
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
  level: Level = 'auto',
): { def: QuestionDef; exhausted: boolean } {
  const unseen = (bank: readonly QuestionDef[]) => bank.filter((q) => !seen.has(q.id))

  if (source === 'mix') {
    const banks = CATEGORIES.map((c) => bankFor(c.id, level)).filter((b) => b.length > 0)
    const withUnseen = banks.map(unseen).filter((b) => b.length > 0)
    if (withUnseen.length === 0) return { def: pickInPool(pickFrom(banks, rng), streak, rng, level), exhausted: true }
    return { def: pickInPool(pickFrom(withUnseen, rng), streak, rng, level), exhausted: false }
  }

  const bank = bankFor(source, level)
  const left = unseen(bank)
  if (left.length === 0) return { def: pickInPool(bank, streak, rng, level), exhausted: true }
  return { def: pickInPool(left, streak, rng, level), exhausted: false }
}
