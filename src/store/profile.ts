'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { dateKeyRome } from '@/engine/daily'
import * as P from '@/engine/progress'
import type { Profile, Settings } from '@/engine/progress'
import type { RunSummary } from '@/engine/run'
import { safeStorage } from '@/lib/storage'

export interface ProfileActions {
  addGems(n: number): void
  /** false se le gemme non bastano: in quel caso non cambia niente */
  spendGems(n: number): boolean
  applyRun(r: RunSummary): { newRecord: boolean; bonus: number }
  openChest(): number | null
  watchShopVideo(): boolean
  recordDailyAnswer(key: string, ok: boolean): void
  finishDaily(key: string): number
  updateSettings(patch: Partial<Settings>): void
  reset(): void
}

export type ProfileStore = Profile & ProfileActions

const today = () => dateKeyRome(new Date())

/** Solo i dati del profilo, senza le funzioni. */
export function profileOf(s: Profile): Profile {
  return {
    schemaVersion: s.schemaVersion,
    gems: s.gems,
    xp: s.xp,
    dayStreak: s.dayStreak,
    lastPlayedDay: s.lastPlayedDay,
    lastChestDay: s.lastChestDay,
    stats: s.stats,
    daily: s.daily,
    shopVideos: s.shopVideos,
    settings: s.settings,
  }
}

export const STORAGE_KEY = 'indovina-tutto:v1'

export const useProfile = create<ProfileStore>()(
  persist(
    (set, get) => {
      const current = () => profileOf(get())
      return {
        ...P.initialProfile(),
        addGems: (n) => set(P.addGems(current(), n)),
        spendGems: (n) => {
          const next = P.spendGems(current(), n)
          if (!next) return false
          set(next)
          return true
        },
        applyRun: (r) => {
          const { profile, newRecord, bonus } = P.applyRun(current(), r, today())
          set(profile)
          return { newRecord, bonus }
        },
        openChest: () => {
          const res = P.openChest(current(), today())
          if (!res) return null
          set(res.profile)
          return res.reward
        },
        watchShopVideo: () => {
          if (!P.canWatchShopVideo(current(), today())) return false
          set(P.watchShopVideo(current(), today()))
          return true
        },
        recordDailyAnswer: (key, ok) => set(P.recordDailyAnswer(current(), key, ok)),
        finishDaily: (key) => {
          const { profile, reward } = P.finishDaily(current(), key)
          set(profile)
          return reward
        },
        updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
        reset: () => set(P.initialProfile()),
      }
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => profileOf(s),
      // formato pronto per essere trasferito su un server: per ora la versione 1 si tiene così com'è
      migrate: (persisted) => persisted as Profile,
      merge: (persisted, currentState) => ({ ...currentState, ...(persisted as Partial<Profile>) }),
    },
  ),
)
