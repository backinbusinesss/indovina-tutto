import { CATEGORIES } from '@/content/categories'
import { getBank } from './bank'
import { ECONOMY } from './economy'
import { materialize } from './materialize'
import { createRng, seedFromString, shuffle } from './rng'
import type { Difficulty, Question } from './types'

const romeFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Rome',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** La data di oggi in Italia, 'YYYY-MM-DD'. */
export function dateKeyRome(now: Date): string {
  return romeFormat.format(now)
}

/** Somma giorni a una data 'YYYY-MM-DD' (in UTC, così il cambio d'ora non conta). */
export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10)
}

const DAILY_DIFFICULTIES: Difficulty[] = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3]
const NEAREST: Record<Difficulty, Difficulty[]> = { 1: [1, 2, 3], 2: [2, 1, 3], 3: [3, 2, 1] }

/** Le 10 domande del giorno: uguali per tutti, dalla più facile alla più difficile. */
export function dailyQuestions(key: string): Question[] {
  const rng = createRng(seedFromString(`daily:${key}`))
  const categories = shuffle(CATEGORIES, rng).slice(0, ECONOMY.dailyChallengeSize)
  return DAILY_DIFFICULTIES.map((target, i) => {
    const bank = getBank(categories[i].id)
    const pool = NEAREST[target].map((d) => bank.filter((q) => q.difficulty === d)).find((p) => p.length > 0) ?? bank
    const def = pool[Math.floor(rng() * pool.length)]
    return materialize(def, rng)
  })
}

export function shareText(key: string, results: boolean[], url: string): string {
  const [y, m, d] = key.split('-')
  const squares = results.map((ok) => (ok ? '🟩' : '🟥')).join('')
  const score = results.filter(Boolean).length
  return `Indovina Tutto — Sfida del ${d}/${m}/${y}\n${squares} ${score}/${results.length}\n${url}`
}
