import { addDays } from './daily'
import { ECONOMY } from './economy'
import { type RunSummary, statsKey } from './run'

export interface Settings {
  sound: boolean
  haptics: boolean
  timer: boolean
  theme: 'system' | 'dark' | 'light'
}

export interface CategoryStats {
  best: number
  runs: number
  correct: number
  answered: number
}

export interface DailyRecord {
  results: boolean[]
  done: boolean
  rewarded: boolean
}

export interface Profile {
  schemaVersion: 1
  gems: number
  xp: number
  dayStreak: number
  lastPlayedDay: string | null
  lastChestDay: string | null
  /** chiave: categoria, oppure categoria@livello per i livelli fissi */
  stats: Partial<Record<string, CategoryStats>>
  daily: Record<string, DailyRecord>
  shopVideos: { day: string; count: number }
  settings: Settings
}

export function initialProfile(): Profile {
  return {
    schemaVersion: 1,
    gems: ECONOMY.welcomeGems,
    xp: 0,
    dayStreak: 0,
    lastPlayedDay: null,
    lastChestDay: null,
    stats: {},
    daily: {},
    shopVideos: { day: '', count: 0 },
    settings: { sound: true, haptics: true, timer: true, theme: 'system' },
  }
}

export function addGems(p: Profile, n: number): Profile {
  return { ...p, gems: Math.max(0, p.gems + n) }
}

/** null se le gemme non bastano. */
export function spendGems(p: Profile, n: number): Profile | null {
  return p.gems >= n ? { ...p, gems: p.gems - n } : null
}

/** Segna che oggi si è giocato. Le date sono 'YYYY-MM-DD' e si confrontano come stringhe. */
export function touchDay(p: Profile, today: string): Profile {
  const last = p.lastPlayedDay
  if (last === today) return p
  if (last !== null && last > today) return p // orologio messo indietro
  const dayStreak = last === addDays(today, -1) ? p.dayStreak + 1 : 1
  return { ...p, dayStreak, lastPlayedDay: today }
}

/** I giorni di fila che si avrebbero giocando oggi. */
export function effectiveDayStreak(p: Profile, today: string): number {
  if (p.lastPlayedDay === today) return Math.max(1, p.dayStreak)
  if (p.lastPlayedDay === addDays(today, -1)) return p.dayStreak + 1
  return 1
}

export function chestAvailable(p: Profile, today: string): boolean {
  return p.lastChestDay === null || p.lastChestDay < today
}

export function openChest(p: Profile, today: string): { profile: Profile; reward: number } | null {
  if (!chestAvailable(p, today)) return null
  const rewards = ECONOMY.chestRewards
  const reward = rewards[Math.min(effectiveDayStreak(p, today), rewards.length) - 1]
  return { profile: { ...addGems(p, reward), lastChestDay: today }, reward }
}

export function applyRun(
  p: Profile,
  r: RunSummary,
  today: string,
): { profile: Profile; newRecord: boolean; bonus: number } {
  const key = statsKey(r.source, r.level)
  const prev = p.stats[key] ?? { best: 0, runs: 0, correct: 0, answered: 0 }
  const newRecord = r.streak > prev.best && r.streak >= ECONOMY.recordMinStreak
  const bonus = newRecord ? ECONOMY.recordBonus : 0
  let profile: Profile = {
    ...p,
    xp: p.xp + r.correct,
    stats: {
      ...p.stats,
      [key]: {
        best: Math.max(prev.best, r.streak),
        runs: prev.runs + 1,
        correct: prev.correct + r.correct,
        answered: prev.answered + r.answered,
      },
    },
  }
  if (r.answered > 0) profile = touchDay(profile, today)
  return { profile: addGems(profile, bonus), newRecord, bonus }
}

export function canWatchShopVideo(p: Profile, today: string): boolean {
  return p.shopVideos.day !== today || p.shopVideos.count < ECONOMY.shopVideosPerDay
}

export function watchShopVideo(p: Profile, today: string): Profile {
  if (!canWatchShopVideo(p, today)) return p
  const count = p.shopVideos.day === today ? p.shopVideos.count + 1 : 1
  return { ...addGems(p, ECONOMY.shopVideoReward), shopVideos: { day: today, count } }
}

export function recordDailyAnswer(p: Profile, key: string, correct: boolean): Profile {
  const rec = p.daily[key] ?? { results: [], done: false, rewarded: false }
  if (rec.done || rec.results.length >= ECONOMY.dailyChallengeSize) return p
  return { ...p, daily: { ...p.daily, [key]: { ...rec, results: [...rec.results, correct] } } }
}

/** Chiude la sfida: +15 gemme una volta sola. Tiene solo gli ultimi 30 giorni. */
export function finishDaily(p: Profile, key: string): { profile: Profile; reward: number } {
  const rec = p.daily[key]
  if (!rec || rec.rewarded) return { profile: p, reward: 0 }
  const kept = Object.keys(p.daily)
    .sort()
    .slice(-30)
    .reduce<Record<string, DailyRecord>>((acc, k) => ({ ...acc, [k]: p.daily[k] }), {})
  const reward = ECONOMY.dailyChallengeReward
  const profile = touchDay(
    { ...addGems(p, reward), daily: { ...kept, [key]: { ...rec, done: true, rewarded: true } } },
    key,
  )
  return { profile, reward }
}

/** Per passare dal livello n al n+1 servono 50 + 25·(n−1) punti esperienza. */
export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  let level = 1
  let left = xp
  let needed = 50
  while (left >= needed) {
    left -= needed
    level++
    needed = 50 + 25 * (level - 1)
  }
  return { level, into: left, needed }
}
