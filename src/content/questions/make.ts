import type { CategoryId, Difficulty, QuestionDef } from '@/engine/types'

/** [difficoltà, domanda, risposta giusta, risposte sbagliate (3–5)] */
export type Row = [difficulty: Difficulty, prompt: string, answer: string, distractors: string[]]

export function make(category: CategoryId, rows: Row[]): QuestionDef[] {
  return rows.map(([difficulty, prompt, answer, distractors], i) => ({
    id: `${category}:${String(i + 1).padStart(3, '0')}`,
    category,
    difficulty,
    prompt,
    answer: { label: answer },
    distractors: distractors.map((label) => ({ label })),
    layout: 'text',
  }))
}
