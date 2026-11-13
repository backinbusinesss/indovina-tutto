'use client'

import { create } from 'zustand'

export interface Burst {
  id: number
  count: number
  x: number
  y: number
}

interface FxState {
  bursts: Burst[]
  /** fa volare `count` gemme dal punto indicato fino al contatore delle gemme */
  burst(count: number, from: { x: number; y: number }): void
  done(id: number): void
}

let nextId = 1

export const useFx = create<FxState>((set) => ({
  bursts: [],
  burst: (count, from) =>
    set((s) => ({ bursts: [...s.bursts, { id: nextId++, count: Math.max(1, Math.min(count, 12)), ...from }] })),
  done: (id) => set((s) => ({ bursts: s.bursts.filter((b) => b.id !== id) })),
}))

/** Il centro di un elemento, come punto di partenza delle gemme. */
export function centerOf(el: Element | null | undefined): { x: number; y: number } {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}
