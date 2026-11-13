import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createCountdown, useCountdown } from '@/lib/countdown'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('createCountdown', () => {
  it('in pausa il tempo non scorre', () => {
    const onEnd = vi.fn()
    const c = createCountdown(20_000, onEnd, () => Date.now())
    c.start()
    vi.advanceTimersByTime(10_000)
    c.pause()
    vi.advanceTimersByTime(30_000)
    expect(c.remainingMs()).toBe(10_000)
    expect(onEnd).not.toHaveBeenCalled()
    c.resume()
    vi.advanceTimersByTime(9_000)
    expect(onEnd).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1_100)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('stop impedisce la fine', () => {
    const onEnd = vi.fn()
    const c = createCountdown(1_000, onEnd, () => Date.now())
    c.start()
    c.stop()
    vi.advanceTimersByTime(5_000)
    expect(onEnd).not.toHaveBeenCalled()
  })
})

describe('useCountdown', () => {
  afterEach(() => setVisibility('visible'))

  it('si ferma quando l’app va in secondo piano', () => {
    const onEnd = vi.fn()
    renderHook(() => useCountdown(20_000, { onEnd }))
    act(() => vi.advanceTimersByTime(5_000))
    act(() => setVisibility('hidden'))
    act(() => vi.advanceTimersByTime(60_000))
    expect(onEnd).not.toHaveBeenCalled()
    act(() => setVisibility('visible'))
    act(() => vi.advanceTimersByTime(15_500))
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('con paused non scade', () => {
    const onEnd = vi.fn()
    renderHook(() => useCountdown(1_000, { onEnd, paused: true }))
    act(() => vi.advanceTimersByTime(10_000))
    expect(onEnd).not.toHaveBeenCalled()
  })

  it('cambiando resetKey riparte da capo', () => {
    const onEnd = vi.fn()
    const { rerender } = renderHook(({ k }) => useCountdown(10_000, { onEnd, resetKey: k }), { initialProps: { k: 'a' } })
    act(() => vi.advanceTimersByTime(8_000))
    rerender({ k: 'b' })
    act(() => vi.advanceTimersByTime(8_000))
    expect(onEnd).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(2_500))
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
})
