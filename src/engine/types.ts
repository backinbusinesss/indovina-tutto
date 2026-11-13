export type CategoryId =
  | 'bandiere'
  | 'capitali'
  | 'sagome'
  | 'loghi'
  | 'fiumi'
  | 'monti'
  | 'laghi'
  | 'geografia'
  | 'monumenti'
  | 'valute'
  | 'cucina'
  | 'italia'

export type Source = CategoryId | 'mix'
export type Difficulty = 1 | 2 | 3

export interface Media {
  kind: 'flag' | 'shape' | 'logo'
  /** relativo a public/, es. 'flags/it.svg' */
  src: string
  alt: string
}

export interface OptionDef {
  label: string
  media?: Media
}

export interface QuestionDef {
  id: string
  category: CategoryId
  difficulty: Difficulty
  prompt: string
  media?: Media
  answer: OptionDef
  /** almeno 3 */
  distractors: OptionDef[]
  layout: 'text' | 'images'
}

export type OptionId = 'a' | 'b' | 'c' | 'd'

export interface Option {
  id: OptionId
  label: string
  media?: Media
}

export interface Question {
  defId: string
  category: CategoryId
  difficulty: Difficulty
  prompt: string
  media?: Media
  options: Option[]
  correct: OptionId
  layout: 'text' | 'images'
}

/** Numero pseudo-casuale in [0, 1). */
export type Rng = () => number
