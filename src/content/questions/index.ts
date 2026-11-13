import type { QuestionDef } from '@/engine/types'
import { QUESTIONS as animali } from './animali'
import { QUESTIONS as arte } from './arte'
import { QUESTIONS as cucina } from './cucina'
import { QUESTIONS as musica } from './musica'
import { QUESTIONS as scienza } from './scienza'
import { QUESTIONS as spazio } from './spazio'
import { QUESTIONS as sport } from './sport'
import { QUESTIONS as storia } from './storia'
import { QUESTIONS as fiumi } from './fiumi'
import { QUESTIONS as geografia } from './geografia'
import { QUESTIONS as italia } from './italia'
import { QUESTIONS as laghi } from './laghi'
import { QUESTIONS as monti } from './monti'
import { QUESTIONS as monumenti } from './monumenti'

/** Domande scritte a mano (fiumi, monti, laghi, geografia, monumenti, cucina, italia). */
export const HANDWRITTEN: readonly QuestionDef[] = [...fiumi, ...monti, ...laghi, ...geografia, ...monumenti, ...cucina, ...italia, ...animali, ...storia, ...scienza, ...spazio, ...sport, ...arte, ...musica]
