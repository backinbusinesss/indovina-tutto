import { describe, expect, it } from 'vitest'
import { QUESTIONS as animali } from '@/content/questions/animali'
import { QUESTIONS as arte } from '@/content/questions/arte'
import { QUESTIONS as natura } from '@/content/questions/natura'
import { QUESTIONS as motori } from '@/content/questions/motori'
import { QUESTIONS as videogiochi } from '@/content/questions/videogiochi'
import { QUESTIONS as tavola } from '@/content/questions/tavola'
import { QUESTIONS as citta } from '@/content/questions/citta'
import { QUESTIONS as feste } from '@/content/questions/feste'
import { QUESTIONS as calcio } from '@/content/questions/calcio'
import { QUESTIONS as invenzioni } from '@/content/questions/invenzioni'
import { QUESTIONS as lingua } from '@/content/questions/lingua'
import { QUESTIONS as matematica } from '@/content/questions/matematica'
import { QUESTIONS as mitologia } from '@/content/questions/mitologia'
import { QUESTIONS as personaggi } from '@/content/questions/personaggi'
import { QUESTIONS as tv } from '@/content/questions/tv'
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
  ['calcio', calcio, 40],
  ['mitologia', mitologia, 40],
  ['invenzioni', invenzioni, 40],
  ['lingua', lingua, 40],
  ['matematica', matematica, 40],
  ['tv', tv, 40],
  ['personaggi', personaggi, 40],
  ['natura', natura, 40],
  ['motori', motori, 40],
  ['videogiochi', videogiochi, 40],
  ['tavola', tavola, 40],
  ['citta', citta, 40],
  ['feste', feste, 40],
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
  it('nessun id ripetuto e nessuna domanda malformata in tutta la banca', () => {
    const all = getAllDefs()
    expect(new Set(all.map((d) => d.id)).size).toBe(all.length)
    for (const d of all) {
      const labels = [d.answer.label, ...d.distractors.map((x) => x.label)].map((l) => l.trim().toLowerCase())
      expect(new Set(labels).size, d.id).toBe(labels.length)
      expect(d.distractors.length, d.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('nessuna domanda con lo stesso testo e la stessa risposta nella stessa categoria', () => {
    const seen = new Set<string>()
    const dup: string[] = []
    for (const d of getAllDefs()) {
      if (!/:\d{3}$/.test(d.id)) continue
      const k = d.category + '|' + d.prompt.trim().toLowerCase()
      if (seen.has(k)) dup.push(d.id)
      seen.add(k)
    }
    expect(dup).toEqual([])
  })

  it('geografia arriva ad almeno 150 domande', () => {
    expect(getBank('geografia').length).toBeGreaterThanOrEqual(150)
  })

  it('in tutto almeno 3.700 domande', () => {
    expect(getAllDefs().length).toBeGreaterThanOrEqual(3700)
  })
})
