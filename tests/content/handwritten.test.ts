import { describe, expect, it } from 'vitest'
import { QUESTIONS as animali } from '@/content/questions/animali'
import { QUESTIONS as arte } from '@/content/questions/arte'
import { QUESTIONS as cucina } from '@/content/questions/cucina'
import { QUESTIONS as musica } from '@/content/questions/musica'
import { QUESTIONS as scienza } from '@/content/questions/scienza'
import { QUESTIONS as spazio } from '@/content/questions/spazio'
import { QUESTIONS as sport } from '@/content/questions/sport'
import { QUESTIONS as storia } from '@/content/questions/storia'
import { QUESTIONS as fiumi } from '@/content/questions/fiumi'
import { QUESTIONS as geografia } from '@/content/questions/geografia'
import { QUESTIONS as italia } from '@/content/questions/italia'
import { QUESTIONS as laghi } from '@/content/questions/laghi'
import { QUESTIONS as monti } from '@/content/questions/monti'
import { QUESTIONS as monumenti } from '@/content/questions/monumenti'
import { getAllDefs, getBank } from '@/engine/bank'
import type { QuestionDef } from '@/engine/types'

const files: [string, readonly QuestionDef[], number][] = [
  ['fiumi', fiumi, 60],
  ['monti', monti, 50],
  ['laghi', laghi, 50],
  ['geografia', geografia, 40],
  ['monumenti', monumenti, 80],
  ['cucina', cucina, 60],
  ['italia', italia, 100],
  ['animali', animali, 40],
  ['storia', storia, 40],
  ['scienza', scienza, 40],
  ['spazio', spazio, 40],
  ['sport', sport, 40],
  ['arte', arte, 40],
  ['musica', musica, 40],
]

describe.each(files)('domande scritte a mano: %s', (category, questions, min) => {
  it(`almeno ${min} domande`, () => {
    expect(questions.length).toBeGreaterThanOrEqual(min)
  })

  it('id unici, con il prefisso della categoria', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
    for (const q of questions) {
      expect(q.id).toMatch(new RegExp(`^${category}:\\d{3}$`))
      expect(q.category).toBe(category)
    }
  })

  it('almeno 3 distrattori, diversi dalla risposta e tra loro', () => {
    for (const q of questions) {
      expect(q.distractors.length, q.id).toBeGreaterThanOrEqual(3)
      const labels = [q.answer.label, ...q.distractors.map((d) => d.label)].map((l) => l.trim().toLowerCase())
      expect(new Set(labels).size, `${q.id}: ${labels.join(' | ')}`).toBe(labels.length)
    }
  })

  it('nessun prompt ripetuto', () => {
    const prompts = questions.map((q) => q.prompt.trim().toLowerCase())
    const dup = prompts.filter((p, i) => prompts.indexOf(p) !== i)
    expect(dup).toEqual([])
  })

  it('niente risposte del tipo "tutte le precedenti"', () => {
    for (const q of questions) {
      for (const l of [q.answer.label, ...q.distractors.map((d) => d.label)]) {
        expect(l.toLowerCase(), q.id).not.toMatch(/tutte le precedenti|nessuna delle/)
      }
    }
  })

  it('tra il 25% e il 60% di domande facili', () => {
    const easy = questions.filter((q) => q.difficulty === 1).length / questions.length
    expect(easy).toBeGreaterThanOrEqual(0.25)
    expect(easy).toBeLessThanOrEqual(0.6)
  })
})

describe('totali', () => {
  it('geografia arriva ad almeno 150 domande', () => {
    expect(getBank('geografia').length).toBeGreaterThanOrEqual(150)
  })

  it('in tutto almeno 2.300 domande', () => {
    expect(getAllDefs().length).toBeGreaterThanOrEqual(2300)
  })
})
