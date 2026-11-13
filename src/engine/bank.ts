import { CATEGORIES } from '@/content/categories'
import { HANDWRITTEN } from '@/content/questions'
import {
  generateCapitalQuestions,
  generateContinentQuestions,
  generateCurrencyLanguageQuestions,
  generateFlagQuestions,
  generateLogoQuestions,
  generateShapeQuestions,
} from './generators'
import type { CategoryId, QuestionDef } from './types'

let cache: Map<CategoryId, readonly QuestionDef[]> | null = null
let all: readonly QuestionDef[] | null = null

function build(): Map<CategoryId, readonly QuestionDef[]> {
  const generated = [
    ...generateFlagQuestions(),
    ...generateCapitalQuestions(),
    ...generateShapeQuestions(),
    ...generateLogoQuestions(),
    ...generateContinentQuestions(),
    ...generateCurrencyLanguageQuestions(),
  ]
  const every = [...generated, ...HANDWRITTEN]
  return new Map(CATEGORIES.map((c) => [c.id, every.filter((d) => d.category === c.id)]))
}

export function getBank(category: CategoryId): readonly QuestionDef[] {
  cache ??= build()
  return cache.get(category) ?? []
}

export function getAllDefs(): readonly QuestionDef[] {
  all ??= CATEGORIES.flatMap((c) => getBank(c.id))
  return all
}
