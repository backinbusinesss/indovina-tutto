import { describe, expect, it } from 'vitest'
import { materialize } from '@/engine/materialize'
import { createRng } from '@/engine/rng'
import type { QuestionDef } from '@/engine/types'

const def: QuestionDef = {
  id: 'capitali:of:IT',
  category: 'capitali',
  difficulty: 1,
  prompt: "Qual è la capitale dell'Italia?",
  answer: { label: 'Roma' },
  distractors: [{ label: 'Milano' }, { label: 'Parigi' }, { label: 'Madrid' }, { label: 'Berlino' }, { label: 'Vienna' }],
  layout: 'text',
}

describe('materialize', () => {
  it('produce 4 opzioni diverse con la risposta giusta inclusa', () => {
    const q = materialize(def, createRng(1))
    expect(q.options).toHaveLength(4)
    expect(q.options.map((o) => o.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(new Set(q.options.map((o) => o.label)).size).toBe(4)
    expect(q.options.find((o) => o.id === q.correct)?.label).toBe('Roma')
    expect(q.defId).toBe(def.id)
    expect(q.prompt).toBe(def.prompt)
  })

  it('mette la risposta giusta in tutte le posizioni, cambiando seme', () => {
    const positions = new Set<string>()
    for (let seed = 1; seed <= 50; seed++) positions.add(materialize(def, createRng(seed)).correct)
    expect(positions).toEqual(new Set(['a', 'b', 'c', 'd']))
  })

  it('stesso seme, stessa domanda', () => {
    expect(materialize(def, createRng(9))).toEqual(materialize(def, createRng(9)))
  })
})
