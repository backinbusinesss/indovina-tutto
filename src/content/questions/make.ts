import type { CategoryId, Difficulty, QuestionDef } from '@/engine/types'

/** [difficoltà, domanda, risposta giusta, risposte sbagliate (3–5)] */
export type Row = [difficulty: Difficulty, prompt: string, answer: string, distractors: string[]]

/** `start` sposta la numerazione degli id (per i file di domande aggiuntive). */
export function make(category: CategoryId, rows: Row[], start = 0): QuestionDef[] {
  return rows.map(([difficulty, prompt, answer, distractors], i) => ({
    id: `${category}:${String(start + i + 1).padStart(3, '0')}`,
    category,
    difficulty,
    prompt,
    answer: { label: answer },
    distractors: distractors.map((label) => ({ label })),
    layout: 'text',
  }))
}
