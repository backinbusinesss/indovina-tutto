import { COUNTRIES, type Continent, type Country } from '@/content/countries'
import { ofCountry } from '@/content/grammar'
import { LOGOS } from '@/content/logos'
import { createRng, seedFromString, shuffle } from './rng'
import type { Media, OptionDef, QuestionDef } from './types'

const MAX_DISTRACTORS = 8

/**
 * Sceglie i distrattori: prima quelli "vicini" (stessa regione o settore), poi gli altri.
 * Etichette tutte diverse e mai uguali alla risposta. Deterministico per id.
 */
function pickDistractors<T>(
  id: string,
  answerLabel: string,
  pool: readonly T[],
  label: (t: T) => string,
  near: (t: T) => boolean,
  toOption: (t: T) => OptionDef = (t) => ({ label: label(t) }),
): OptionDef[] {
  const rng = createRng(seedFromString(id))
  const seen = new Set([answerLabel])
  const ordered = [...shuffle(pool.filter(near), rng), ...shuffle(pool.filter((t) => !near(t)), rng)]
  const out: OptionDef[] = []
  for (const t of ordered) {
    const l = label(t)
    if (seen.has(l)) continue
    seen.add(l)
    out.push(toOption(t))
    if (out.length === MAX_DISTRACTORS) break
  }
  return out
}

const code = (c: Country) => c.iso2.toLowerCase()
const flag = (c: Country, alt: string): Media => ({ kind: 'flag', src: `flags/${code(c)}.svg`, alt })

export function generateFlagQuestions(): QuestionDef[] {
  return COUNTRIES.flatMap((c): QuestionDef[] => {
    const sameRegion = (o: Country) => o.region === c.region && o !== c
    const imgId = `bandiere:img:${c.iso2}`
    const pickId = `bandiere:pick:${c.iso2}`
    return [
      {
        id: imgId,
        category: 'bandiere',
        difficulty: c.fame,
        prompt: 'Di quale paese è questa bandiera?',
        media: flag(c, 'Bandiera da indovinare'),
        answer: { label: c.name },
        distractors: pickDistractors(imgId, c.name, COUNTRIES, (o) => o.name, sameRegion),
        layout: 'text',
      },
      {
        id: pickId,
        category: 'bandiere',
        difficulty: c.fame,
        prompt: `Qual è la bandiera ${ofCountry(c)}?`,
        answer: { label: c.name, media: flag(c, 'Bandiera') },
        distractors: pickDistractors(pickId, c.name, COUNTRIES, (o) => o.name, sameRegion, (o) => ({
          label: o.name,
          media: flag(o, 'Bandiera'),
        })),
        layout: 'images',
      },
    ]
  })
}

export function generateCapitalQuestions(): QuestionDef[] {
  const pool = COUNTRIES.filter((c) => c.capitalQuiz)
  return pool.flatMap((c): QuestionDef[] => {
    const sameRegion = (o: Country) => o.region === c.region && o !== c
    const ofId = `capitali:of:${c.iso2}`
    const isId = `capitali:is:${c.iso2}`
    return [
      {
        id: ofId,
        category: 'capitali',
        difficulty: c.fame,
        prompt: `Qual è la capitale ${ofCountry(c)}?`,
        answer: { label: c.capital },
        distractors: pickDistractors(ofId, c.capital, pool, (o) => o.capital, sameRegion),
        layout: 'text',
      },
      {
        id: isId,
        category: 'capitali',
        difficulty: c.fame,
        prompt: `${c.capital} è la capitale di quale paese?`,
        answer: { label: c.name },
        distractors: pickDistractors(isId, c.name, pool, (o) => o.name, sameRegion),
        layout: 'text',
      },
    ]
  })
}

export function generateShapeQuestions(): QuestionDef[] {
  const withShape = COUNTRIES.filter((c) => c.shape)
  const shape = (o: Country, alt: string): Media => ({ kind: 'shape', src: `shapes/${code(o)}.svg`, alt })
  const pick = withShape.map((c): QuestionDef => {
    const id = `sagome:pick:${c.iso2}`
    return {
      id,
      category: 'sagome',
      difficulty: c.fame,
      prompt: `Qual è la sagoma ${ofCountry(c)}?`,
      answer: { label: c.name, media: shape(c, 'Sagoma') },
      distractors: pickDistractors(id, c.name, withShape, (o) => o.name, (o) => o.region === c.region && o !== c, (o) => ({ label: o.name, media: shape(o, 'Sagoma') })),
      layout: 'images',
    }
  })
  return [...pick, ...withShape.map((c): QuestionDef => {
    const id = `sagome:img:${c.iso2}`
    return {
      id,
      category: 'sagome',
      difficulty: c.fame,
      prompt: 'Di quale paese è questa sagoma?',
      media: { kind: 'shape', src: `shapes/${code(c)}.svg`, alt: 'Sagoma da indovinare' },
      answer: { label: c.name },
      distractors: pickDistractors(id, c.name, COUNTRIES, (o) => o.name, (o) => o.region === c.region && o !== c),
      layout: 'text',
    }
  })]
}

export function generateLogoQuestions(): QuestionDef[] {
  const logo = (o: (typeof LOGOS)[number], alt: string): Media => ({ kind: 'logo', src: `logos/${o.slug}.svg`, alt })
  const pick = LOGOS.map((l): QuestionDef => {
    const id = `loghi:pick:${l.slug}`
    return {
      id,
      category: 'loghi',
      difficulty: l.fame,
      prompt: `Qual è il logo di ${l.name}?`,
      answer: { label: l.name, media: logo(l, 'Logo') },
      distractors: pickDistractors(id, l.name, LOGOS, (o) => o.name, (o) => o.sector === l.sector && o !== l, (o) => ({ label: o.name, media: logo(o, 'Logo') })),
      layout: 'images',
    }
  })
  return [...pick, ...LOGOS.map((l): QuestionDef => {
    const id = `loghi:img:${l.slug}`
    return {
      id,
      category: 'loghi',
      difficulty: l.fame,
      prompt: 'Di quale marchio è questo logo?',
      media: { kind: 'logo', src: `logos/${l.slug}.svg`, alt: 'Logo da indovinare' },
      answer: { label: l.name },
      distractors: pickDistractors(id, l.name, LOGOS, (o) => o.name, (o) => o.sector === l.sector && o !== l),
      layout: 'text',
    }
  })]
}

const IN_CONTINENT: Record<Continent, string> = {
  Europa: 'in Europa',
  Asia: 'in Asia',
  Africa: 'in Africa',
  America: 'in America',
  Oceania: 'in Oceania',
}

const CONTINENTS: Continent[] = ['Europa', 'Asia', 'Africa', 'America', 'Oceania']

export function generateContinentQuestions(): QuestionDef[] {
  const pool = COUNTRIES.filter((c) => !c.transcontinental)
  const where = pool.map((c): QuestionDef => ({
    id: `geografia:where:${c.iso2}`,
    category: 'geografia',
    difficulty: c.fame,
    prompt: `In quale continente si trova ${c.name}?`,
    answer: { label: c.continent },
    distractors: CONTINENTS.filter((x) => x !== c.continent).map((label) => ({ label })),
    layout: 'text',
  }))
  return [...where, ...pool.map((c): QuestionDef => {
    const id = `geografia:cont:${c.iso2}`
    const others = pool.filter((o) => o.continent !== c.continent)
    return {
      id,
      category: 'geografia',
      difficulty: c.fame,
      prompt: `Quale di questi paesi si trova ${IN_CONTINENT[c.continent]}?`,
      answer: { label: c.name },
      // distrattori di fama simile, così la domanda non si risolve per esclusione
      distractors: pickDistractors(id, c.name, others, (o) => o.name, (o) => o.fame === c.fame),
      layout: 'text',
    }
  })]
}

export function generateCurrencyLanguageQuestions(): QuestionDef[] {
  const currency = COUNTRIES.map((c): QuestionDef => {
    const id = `valute:cur:${c.iso2}`
    return {
      id,
      category: 'valute',
      difficulty: c.fame,
      prompt: `Qual è la valuta ${ofCountry(c)}?`,
      answer: { label: c.currency },
      distractors: pickDistractors(id, c.currency, COUNTRIES, (o) => o.currency, (o) => o.region === c.region),
      layout: 'text',
    }
  })
  const withLanguage = COUNTRIES.filter((c) => c.language !== null)
  const language = withLanguage.map((c): QuestionDef => {
    const id = `valute:lang:${c.iso2}`
    const answer = c.language as string
    return {
      id,
      category: 'valute',
      difficulty: c.fame,
      prompt: `Qual è la lingua principale ${ofCountry(c)}?`,
      answer: { label: answer },
      distractors: pickDistractors(id, answer, withLanguage, (o) => o.language as string, (o) => o.region === c.region),
      layout: 'text',
    }
  })
  const uses = new Map<string, number>()
  for (const c of COUNTRIES) uses.set(c.currency, (uses.get(c.currency) ?? 0) + 1)
  const reverse = COUNTRIES.filter((c) => uses.get(c.currency) === 1).map((c): QuestionDef => {
    const id = `valute:rev:${c.iso2}`
    return {
      id,
      category: 'valute',
      difficulty: c.fame,
      prompt: `Di quale paese è la valuta «${c.currency}»?`,
      answer: { label: c.name },
      distractors: pickDistractors(id, c.name, COUNTRIES, (o) => o.name, (o) => o.region === c.region && o !== c),
      layout: 'text',
    }
  })
  return [...currency, ...language, ...reverse]
}
