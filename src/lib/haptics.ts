'use client'

import { useProfile } from '@/store/profile'

const PATTERNS = { ok: 15, bad: [40, 40, 60], tap: 8 } as const

/** Vibrazione breve dove il telefono la supporta (Android). Su iPhone non fa nulla. */
export function vibrate(kind: keyof typeof PATTERNS) {
  if (!useProfile.getState().settings.haptics) return
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(PATTERNS[kind] as number | number[])
  } catch {
    /* non essenziale */
  }
}
