import { shuffle } from './rng'
import type { Option, OptionId, Question, QuestionDef, Rng } from './types'

const IDS: OptionId[] = ['a', 'b', 'c', 'd']

/** Trasforma la definizione in una domanda giocabile: 3 distrattori a caso e 4 opzioni mescolate. */
export function materialize(def: QuestionDef, rng: Rng): Question {
  const wrong = shuffle(def.distractors, rng).slice(0, 3)
  const all = shuffle([{ ...def.answer, correct: true }, ...wrong.map((d) => ({ ...d, correct: false }))], rng)
  const options: Option[] = all.map((o, i) => ({ id: IDS[i], label: o.label, ...(o.media ? { media: o.media } : {}) }))
  const correctIndex = all.findIndex((o) => o.correct)
  return {
    defId: def.id,
    category: def.category,
    difficulty: def.difficulty,
    prompt: def.prompt,
    ...(def.media ? { media: def.media } : {}),
    options,
    correct: IDS[correctIndex],
    layout: def.layout,
  }
}
