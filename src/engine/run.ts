import { ECONOMY } from './economy'
import { materialize } from './materialize'
import { pickNext } from './picker'
import { shuffle } from './rng'
import type { OptionId, Question, Rng, Source } from './types'

export type RunPhase = 'question' | 'correct' | 'wrong' | 'save-offer' | 'ended'

export interface RunState {
  source: Source
  phase: RunPhase
  question: Question
  streak: number
  correctCount: number
  answeredCount: number
  /** salvataggi pagati con gemme in questa partita */
  saves: number
  videoSaveUsed: boolean
  gemsEarned: number
  /** opzioni nascoste dal 50/50 */
  hidden: OptionId[]
  fiftyUsed: boolean
  seen: string[]
  /** la domanda attuale arriva dopo aver finito tutte quelle della categoria */
  exhausted: boolean
  chosen: OptionId | null
}

export type RunEvent = { type: 'gem'; amount: number } | { type: 'exhausted' }

export interface RunSummary {
  source: Source
  streak: number
  correct: number
  answered: number
  gemsEarned: number
}

function withNewQuestion(s: RunState, rng: Rng): RunState {
  const { def, exhausted } = pickNext(s.source, new Set(s.seen), s.streak, rng)
  return {
    ...s,
    phase: 'question',
    question: materialize(def, rng),
    hidden: [],
    fiftyUsed: false,
    chosen: null,
    seen: exhausted ? [def.id] : [...s.seen, def.id],
    exhausted,
  }
}

export function createRun(source: Source, rng: Rng): RunState {
  const empty = {
    source,
    phase: 'question',
    streak: 0,
    correctCount: 0,
    answeredCount: 0,
    saves: 0,
    videoSaveUsed: false,
    gemsEarned: 0,
    hidden: [],
    fiftyUsed: false,
    seen: [],
    exhausted: false,
    chosen: null,
  } as unknown as RunState
  return withNewQuestion(empty, rng)
}

/**
 * Risposta (null = tempo scaduto). Fuori dalla fase "question" non succede niente:
 * è la difesa dal doppio tocco.
 */
export function answer(s: RunState, choice: OptionId | null): { state: RunState; events: RunEvent[] } {
  if (s.phase !== 'question') return { state: s, events: [] }
  const answeredCount = s.answeredCount + 1
  if (choice !== null && choice === s.question.correct) {
    const streak = s.streak + 1
    const gem = streak % ECONOMY.gemEveryStreak === 0
    return {
      state: {
        ...s,
        phase: 'correct',
        chosen: choice,
        streak,
        correctCount: s.correctCount + 1,
        answeredCount,
        gemsEarned: s.gemsEarned + (gem ? 1 : 0),
      },
      events: gem ? [{ type: 'gem', amount: 1 }] : [],
    }
  }
  return { state: { ...s, phase: 'wrong', chosen: choice, answeredCount }, events: [] }
}

/** Dopo una risposta giusta, passa alla domanda successiva. */
export function next(s: RunState, rng: Rng): { state: RunState; events: RunEvent[] } {
  if (s.phase !== 'correct') return { state: s, events: [] }
  const state = withNewQuestion(s, rng)
  return { state, events: state.exhausted ? [{ type: 'exhausted' }] : [] }
}

export function toSaveOffer(s: RunState): RunState {
  return s.phase === 'wrong' ? { ...s, phase: 'save-offer' } : s
}

export function canVideoSave(s: RunState): boolean {
  return s.phase === 'save-offer' && !s.videoSaveUsed
}

export function saveWithGems(s: RunState, rng: Rng): RunState {
  if (s.phase !== 'save-offer') return s
  return withNewQuestion({ ...s, saves: s.saves + 1 }, rng)
}

export function saveWithVideo(s: RunState, rng: Rng): RunState {
  if (!canVideoSave(s)) return s
  return withNewQuestion({ ...s, videoSaveUsed: true }, rng)
}

export function fiftyFifty(s: RunState, rng: Rng): RunState {
  if (s.phase !== 'question' || s.fiftyUsed) return s
  const wrong = s.question.options.filter((o) => o.id !== s.question.correct).map((o) => o.id)
  return { ...s, fiftyUsed: true, hidden: shuffle(wrong, rng).slice(0, 2) }
}

export function skip(s: RunState, rng: Rng): RunState {
  if (s.phase !== 'question') return s
  return withNewQuestion(s, rng)
}

export function endRun(s: RunState): RunState {
  return s.phase === 'ended' ? s : { ...s, phase: 'ended' }
}

export function summarize(s: RunState): RunSummary {
  return {
    source: s.source,
    streak: s.streak,
    correct: s.correctCount,
    answered: s.answeredCount,
    gemsEarned: s.gemsEarned,
  }
}
