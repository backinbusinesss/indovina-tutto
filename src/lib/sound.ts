'use client'

import { useProfile } from '@/store/profile'

export type SoundName = 'tap' | 'correct' | 'wrong' | 'gem' | 'record' | 'tick' | 'chest'

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx ??= new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Una nota breve con inviluppo morbido. */
function tone(ac: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + start)
  g.gain.setValueAtTime(0.0001, ac.currentTime + start)
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + dur + 0.05)
}

const SOUNDS: Record<SoundName, (ac: AudioContext) => void> = {
  tap: (ac) => tone(ac, 660, 0, 0.06, 'triangle', 0.08),
  tick: (ac) => tone(ac, 1200, 0, 0.04, 'square', 0.04),
  correct: (ac) => {
    tone(ac, 660, 0, 0.12, 'triangle')
    tone(ac, 990, 0.08, 0.18, 'triangle')
  },
  wrong: (ac) => {
    tone(ac, 220, 0, 0.18, 'sawtooth', 0.09)
    tone(ac, 165, 0.12, 0.25, 'sawtooth', 0.08)
  },
  gem: (ac) => {
    tone(ac, 1318, 0, 0.08, 'sine', 0.14)
    tone(ac, 1760, 0.06, 0.12, 'sine', 0.12)
  },
  chest: (ac) => [523, 659, 784, 1046].forEach((f, i) => tone(ac, f, i * 0.07, 0.2, 'triangle', 0.14)),
  record: (ac) => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(ac, f, i * 0.09, 0.28, 'triangle', 0.15)),
}

export function play(name: SoundName) {
  if (!useProfile.getState().settings.sound) return
  const ac = audio()
  if (!ac) return
  try {
    SOUNDS[name](ac)
  } catch {
    /* l'audio non è essenziale */
  }
}
