'use client'

import { useEffect, useRef, useState } from 'react'

export interface Countdown {
  start(): void
  pause(): void
  resume(): void
  stop(): void
  remainingMs(): number
}

/** Conto alla rovescia che si può mettere in pausa. `now` è iniettabile per i test. */
export function createCountdown(totalMs: number, onEnd: () => void, now: () => number = () => performance.now()): Countdown {
  let remaining = totalMs
  let startedAt: number | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let finished = false

  const clear = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }
  const left = () => (startedAt === null ? remaining : Math.max(0, remaining - (now() - startedAt)))
  const schedule = () => {
    clear()
    timer = setTimeout(check, Math.max(0, left()) + 5)
  }
  function check() {
    if (finished || startedAt === null) return
    if (left() <= 0) {
      finished = true
      remaining = 0
      startedAt = null
      clear()
      onEnd()
    } else schedule()
  }

  return {
    start() {
      if (finished || startedAt !== null) return
      startedAt = now()
      schedule()
    },
    pause() {
      if (startedAt === null) return
      remaining = left()
      startedAt = null
      clear()
    },
    resume() {
      this.start()
    },
    stop() {
      finished = true
      startedAt = null
      clear()
    },
    remainingMs: left,
  }
}

const isHidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden'

/**
 * Conto alla rovescia per l'interfaccia: restituisce la frazione di tempo rimasta (1 → 0).
 * Si ferma da solo quando l'app va in secondo piano (telefono bloccato, cambio di app).
 */
export function useCountdown(
  totalMs: number,
  { onEnd, paused = false, resetKey }: { onEnd: () => void; paused?: boolean; resetKey?: unknown },
): number {
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd
  const cdRef = useRef<Countdown | null>(null)
  const [fraction, setFraction] = useState(1)
  const [hidden, setHidden] = useState(isHidden)

  // un nuovo conto alla rovescia per ogni resetKey
  useEffect(() => {
    const cd = createCountdown(totalMs, () => {
      setFraction(0)
      onEndRef.current()
    })
    cdRef.current = cd
    setFraction(1)
    const tick = setInterval(() => setFraction(cd.remainingMs() / totalMs), 100)
    return () => {
      clearInterval(tick)
      cd.stop()
      cdRef.current = null
    }
  }, [totalMs, resetKey])

  useEffect(() => {
    const onVis = () => setHidden(isHidden())
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const cd = cdRef.current
    if (!cd) return
    if (paused || hidden) cd.pause()
    else cd.resume()
  }, [paused, hidden, resetKey, totalMs])

  return fraction
}
