import type { Difficulty } from './types'

/** Tutti i numeri del gioco in un posto solo: si regolano da qui. */
export const ECONOMY = {
  welcomeGems: 50,
  /** +1 gemma ogni N risposte giuste di fila */
  gemEveryStreak: 5,
  recordBonus: 5,
  /** sotto questa streak un "record" non dà bonus */
  recordMinStreak: 3,
  /** forziere: dal 1° al 7°+ giorno di fila */
  chestRewards: [10, 12, 15, 18, 21, 25, 30] as const,
  dailyChallengeReward: 15,
  dailyChallengeSize: 10,
  shopVideoReward: 5,
  shopVideosPerDay: 3,
  fiftyFiftyCost: 5,
  skipCost: 8,
  saveBaseCost: 10,
  videoSavesPerRun: 1,
  saveCountdownSec: 10,
  questionTimeSec: 20,
  videoAdSec: 15,
} as const

export type PackId = 'p120' | 'p650' | 'p1400' | 'p3000'

export interface GemPack {
  id: PackId
  gems: number
  priceCents: number
  badge?: string
}

export const GEM_PACKS: readonly GemPack[] = [
  { id: 'p120', gems: 120, priceCents: 99 },
  { id: 'p650', gems: 650, priceCents: 499, badge: '+10%' },
  { id: 'p1400', gems: 1400, priceCents: 999, badge: 'Il più scelto' },
  { id: 'p3000', gems: 3000, priceCents: 1999, badge: 'Miglior valore' },
]

/** Costo in gemme del salvataggio numero `savesUsed + 1` nella stessa partita. */
export function saveCost(savesUsed: number): number {
  return ECONOMY.saveBaseCost * 2 ** savesUsed
}

/** Più la streak è lunga, più arrivano domande difficili. */
export function DIFFICULTY_WEIGHTS(streak: number): Record<Difficulty, number> {
  if (streak >= 25) return { 1: 0.15, 2: 0.35, 3: 0.5 }
  if (streak >= 10) return { 1: 0.3, 2: 0.5, 3: 0.2 }
  return { 1: 0.7, 2: 0.25, 3: 0.05 }
}
