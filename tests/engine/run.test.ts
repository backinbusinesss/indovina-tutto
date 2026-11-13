import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '@/content/categories'
import { getBank } from '@/engine/bank'
import { DIFFICULTY_WEIGHTS, ECONOMY, GEM_PACKS, saveCost } from '@/engine/economy'
import { pickNext } from '@/engine/picker'
import { createRng } from '@/engine/rng'
import {
  answer,
  canVideoSave,
  createRun,
  endRun,
  fiftyFifty,
  next,
  type RunState,
  saveWithGems,
  saveWithVideo,
  skip,
  statsKey,
  summarize,
  toSaveOffer,
} from '@/engine/run'
import type { OptionId } from '@/engine/types'

const rng = createRng(123)
const wrongOf = (s: RunState): OptionId => s.question.options.find((o) => o.id !== s.question.correct)!.id
const right = (s: RunState) => answer(s, s.question.correct).state

/** risponde giusto n volte di fila, passando ogni volta alla domanda dopo */
function streakOf(n: number, start = createRun('bandiere', rng)) {
  let s = start
  const events = []
  for (let i = 0; i < n; i++) {
    const r = answer(s, s.question.correct)
    events.push(...r.events)
    s = next(r.state, rng).state
  }
  return { s, events }
}

describe('economia', () => {
  it('i numeri del progetto', () => {
    expect(ECONOMY.welcomeGems).toBe(50)
    expect(ECONOMY.fiftyFiftyCost).toBe(5)
    expect(ECONOMY.skipCost).toBe(8)
    expect(ECONOMY.questionTimeSec).toBe(20)
    expect(ECONOMY.saveCountdownSec).toBe(10)
    expect(ECONOMY.videoAdSec).toBe(15)
    expect(GEM_PACKS.map((p) => [p.gems, p.priceCents])).toEqual([
      [120, 99],
      [650, 499],
      [1400, 999],
      [3000, 1999],
    ])
  })

  it('il salvataggio con gemme raddoppia: 10, 20, 40, 80', () => {
    expect([0, 1, 2, 3].map(saveCost)).toEqual([10, 20, 40, 80])
  })

  it('la difficoltà sale con la streak', () => {
    expect(DIFFICULTY_WEIGHTS(0)[1]).toBeGreaterThan(DIFFICULTY_WEIGHTS(0)[3])
    expect(DIFFICULTY_WEIGHTS(30)[3]).toBeGreaterThan(DIFFICULTY_WEIGHTS(30)[1])
  })
})

describe('pickNext', () => {
  it('con streak 30 almeno il 35% delle domande è difficile', () => {
    const r = createRng(9)
    let hard = 0
    for (let i = 0; i < 1000; i++) if (pickNext('capitali', new Set(), 30, r).def.difficulty === 3) hard++
    expect(hard).toBeGreaterThanOrEqual(350)
  })

  it('Mix Tutto pesca da tutte le 12 categorie', () => {
    const r = createRng(4)
    const seen = new Set<string>()
    for (let i = 0; i < 500; i++) seen.add(pickNext('mix', new Set(), 0, r).def.category)
    expect(seen.size).toBe(CATEGORIES.length)
  })

  it('segnala quando la categoria è esaurita', () => {
    const all = new Set(getBank('laghi').map((d) => d.id))
    const r = pickNext('laghi', all, 0, createRng(1))
    expect(r.exhausted).toBe(true)
    expect(r.def.category).toBe('laghi')
  })
})

describe('partita', () => {
  it('inizia con una domanda', () => {
    const s = createRun('capitali', rng)
    expect(s.phase).toBe('question')
    expect(s.streak).toBe(0)
    expect(s.question.category).toBe('capitali')
  })

  it('ogni 5 risposte giuste di fila arriva una gemma', () => {
    const { s, events } = streakOf(10)
    expect(events).toEqual([
      { type: 'gem', amount: 1 },
      { type: 'gem', amount: 1 },
    ])
    expect(s.streak).toBe(10)
    expect(s.gemsEarned).toBe(2)
  })

  it('doppio tocco: la seconda risposta non cambia niente', () => {
    const s0 = createRun('bandiere', rng)
    const first = answer(s0, s0.question.correct)
    const second = answer(first.state, wrongOf(s0))
    expect(second.state).toBe(first.state)
    expect(second.events).toEqual([])
  })

  it('tempo scaduto = risposta sbagliata', () => {
    const s = answer(createRun('bandiere', rng), null).state
    expect(s.phase).toBe('wrong')
    expect(s.chosen).toBeNull()
  })

  it('sbagliando si passa all’offerta di salvataggio', () => {
    const s0 = streakOf(3).s
    const wrong = answer(s0, wrongOf(s0)).state
    expect(wrong.phase).toBe('wrong')
    expect(wrong.streak).toBe(3)
    expect(toSaveOffer(wrong).phase).toBe('save-offer')
  })

  it('saveWithGems fuori dalla fase giusta non cambia niente', () => {
    const s = createRun('bandiere', rng)
    expect(saveWithGems(s, rng)).toBe(s)
  })

  it('salvataggio con gemme: streak intatta, nuova domanda, contatore salvataggi', () => {
    const s0 = streakOf(4).s
    const offer = toSaveOffer(answer(s0, wrongOf(s0)).state)
    const saved = saveWithGems(offer, rng)
    expect(saved.phase).toBe('question')
    expect(saved.streak).toBe(4)
    expect(saved.saves).toBe(1)
    expect(saved.question.defId).not.toBe(offer.question.defId)
    // un secondo tocco sullo stesso pulsante non conta
    expect(saveWithGems(saved, rng)).toBe(saved)
  })

  it('video: una sola volta per partita', () => {
    const s0 = createRun('bandiere', rng)
    const offer = toSaveOffer(answer(s0, wrongOf(s0)).state)
    expect(canVideoSave(offer)).toBe(true)
    const saved = saveWithVideo(offer, rng)
    expect(saved.videoSaveUsed).toBe(true)
    const offer2 = toSaveOffer(answer(saved, wrongOf(saved)).state)
    expect(canVideoSave(offer2)).toBe(false)
    expect(saveWithVideo(offer2, rng)).toBe(offer2)
  })

  it('50/50 nasconde esattamente 2 risposte sbagliate, una volta per domanda', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const s = createRun('capitali', createRng(seed))
      const half = fiftyFifty(s, createRng(seed))
      expect(half.hidden).toHaveLength(2)
      expect(half.hidden).not.toContain(s.question.correct)
      expect(new Set(half.hidden).size).toBe(2)
      expect(fiftyFifty(half, createRng(seed))).toBe(half)
    }
  })

  it('Salta cambia domanda senza toccare la streak', () => {
    const s0 = streakOf(2).s
    const skipped = skip(s0, rng)
    expect(skipped.streak).toBe(2)
    expect(skipped.phase).toBe('question')
    expect(skipped.question.defId).not.toBe(s0.question.defId)
  })

  it('in una partita nessuna domanda si ripete finché la categoria non è finita', () => {
    const size = getBank('laghi').length
    let s = createRun('laghi', createRng(77))
    const ids = [s.question.defId]
    for (let i = 1; i < size; i++) {
      s = next(right(s), rng).state
      ids.push(s.question.defId)
    }
    expect(new Set(ids).size).toBe(size)
    const after = next(right(s), rng)
    expect(after.events).toContainEqual({ type: 'exhausted' })
    expect(after.state.exhausted).toBe(true)
  })

  it('fine partita e riepilogo', () => {
    const s0 = streakOf(6).s
    const ended = endRun(toSaveOffer(answer(s0, wrongOf(s0)).state))
    expect(ended.phase).toBe('ended')
    expect(summarize(ended)).toEqual({ source: 'bandiere', level: 'auto', streak: 6, correct: 6, answered: 7, gemsEarned: 1 })
  })
})

describe('livelli', () => {
  it('con un livello fisso escono solo domande di quel livello', () => {
    for (const level of [1, 2, 3] as const) {
      const r = createRng(level)
      let s = createRun('capitali', r, level)
      expect(s.level).toBe(level)
      for (let i = 0; i < 30; i++) {
        expect(s.question.difficulty).toBe(level)
        s = next(right(s), r).state
      }
    }
  })

  it('Mix Tutto difficile pesca solo domande difficili, da più categorie', () => {
    const r = createRng(8)
    const cats = new Set<string>()
    for (let i = 0; i < 200; i++) {
      const { def } = pickNext('mix', new Set(), 0, r, 3)
      expect(def.difficulty).toBe(3)
      cats.add(def.category)
    }
    expect(cats.size).toBeGreaterThan(15)
  })

  it('il riepilogo riporta il livello e il livello ha il suo record', () => {
    const s = createRun('bandiere', rng, 3)
    expect(summarize(endRun(s)).level).toBe(3)
    expect(statsKey('bandiere', 'auto')).toBe('bandiere')
    expect(statsKey('bandiere', 3)).toBe('bandiere@3')
  })

  it('ogni categoria ha almeno 12 domande per livello', () => {
    for (const c of CATEGORIES) {
      for (const d of [1, 2, 3]) {
        expect(getBank(c.id).filter((q) => q.difficulty === d).length, `${c.id} livello ${d}`).toBeGreaterThanOrEqual(12)
      }
    }
  })
})
