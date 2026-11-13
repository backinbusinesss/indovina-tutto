import type { CategoryId } from '@/engine/types'

export interface CategoryMeta {
  id: CategoryId
  name: string
  tagline: string
  /** nome dell'icona lucide-react */
  icon: string
  /** colore della scheda */
  color: string
  /** esempio mostrato sul sito */
  example: string
}

export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'bandiere', name: 'Bandiere', tagline: 'Tutte le 195 bandiere del mondo', icon: 'Flag', color: '#FF5C7A', example: 'Di quale paese è questa bandiera?' },
  { id: 'capitali', name: 'Capitali', tagline: 'Da Roma a Ulan Bator', icon: 'Landmark', color: '#7C8CFF', example: "Qual è la capitale dell'Australia?" },
  { id: 'sagome', name: 'Sagome dei paesi', tagline: 'Lo riconosci dalla forma?', icon: 'Map', color: '#2ED4C8', example: 'Di quale paese è questa sagoma?' },
  { id: 'loghi', name: 'Loghi', tagline: 'Marchi famosi, senza il nome', icon: 'BadgeCheck', color: '#FFC83D', example: 'Di quale marchio è questo logo?' },
  { id: 'animali', name: 'Animali', tagline: 'Dal ghepardo alla balenottera', icon: 'PawPrint', color: '#8BC34A', example: "Qual è l'animale terrestre più veloce?" },
  { id: 'geografia', name: 'Geografia', tagline: 'Continenti, confini e record', icon: 'Globe2', color: '#3DA5FF', example: 'Quale di questi paesi si trova in Africa?' },
  { id: 'fiumi', name: 'Fiumi', tagline: 'Dal Po al Mekong', icon: 'Waves', color: '#2F8CFF', example: 'Quale fiume attraversa Vienna?' },
  { id: 'monti', name: 'Monti e vulcani', tagline: 'Vette, catene e crateri', icon: 'Mountain', color: '#9AA7C7', example: 'In quale paese si trova il Kilimangiaro?' },
  { id: 'laghi', name: 'Laghi e mari', tagline: 'Acque dolci e salate', icon: 'Droplets', color: '#22C1E6', example: 'Qual è il lago più grande d’Italia?' },
  { id: 'monumenti', name: 'Monumenti e città', tagline: 'Meraviglie da tutto il mondo', icon: 'Castle', color: '#FF9F43', example: 'In quale città si trova la Sagrada Família?' },
  { id: 'storia', name: 'Storia', tagline: 'Dai Romani ai giorni nostri', icon: 'ScrollText', color: '#C08A3E', example: 'In che anno è caduto il Muro di Berlino?' },
  { id: 'scienza', name: 'Scienza e corpo umano', tagline: 'Chimica, fisica e biologia', icon: 'FlaskConical', color: '#14B8A6', example: "Qual è l'organo più grande del corpo umano?" },
  { id: 'spazio', name: 'Spazio', tagline: 'Pianeti, stelle e astronauti', icon: 'Rocket', color: '#6366F1', example: 'Qual è il pianeta più grande del Sistema solare?' },
  { id: 'sport', name: 'Sport', tagline: 'Calcio, tennis, motori e Olimpiadi', icon: 'Trophy', color: '#EF4444', example: "Quante volte l'Italia ha vinto i Mondiali?" },
  { id: 'arte', name: 'Arte e letteratura', tagline: 'Capolavori, pittori e scrittori', icon: 'Palette', color: '#EC4899', example: 'Chi dipinse la Gioconda?' },
  { id: 'musica', name: 'Musica e cinema', tagline: 'Da Verdi ai Måneskin, da Fellini a Spielberg', icon: 'Music', color: '#A855F7', example: 'Chi compose «Le quattro stagioni»?' },
  { id: 'valute', name: 'Valute e lingue', tagline: 'Soldi e parole del mondo', icon: 'Coins', color: '#2ED47A', example: 'Qual è la valuta del Giappone?' },
  { id: 'cucina', name: 'Cucina dal mondo', tagline: 'Piatti tipici e ingredienti', icon: 'UtensilsCrossed', color: '#FF7A1A', example: 'Da quale paese viene la paella?' },
  { id: 'italia', name: 'Italia', tagline: 'Regioni, città e curiosità', icon: 'Heart', color: '#18B26B', example: 'Qual è il capoluogo della Basilicata?' },
]

const byId = new Map(CATEGORIES.map((c) => [c.id, c]))

export function categoryById(id: CategoryId): CategoryMeta {
  const c = byId.get(id)
  if (!c) throw new Error(`categoria sconosciuta: ${id}`)
  return c
}

export const isCategoryId = (s: string): s is CategoryId => byId.has(s as CategoryId)
