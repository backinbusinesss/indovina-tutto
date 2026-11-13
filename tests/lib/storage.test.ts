import { describe, expect, it, vi } from 'vitest'
import { safeStorage } from '@/lib/storage'

describe('safeStorage', () => {
  it('salva e rilegge normalmente', () => {
    safeStorage.setItem('prova', 'uno')
    expect(safeStorage.getItem('prova')).toBe('uno')
  })

  it('funziona anche se localStorage lancia errori', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    safeStorage.setItem('k', 'v')
    expect(safeStorage.getItem('k')).toBe('v')
    safeStorage.removeItem('k')
    expect(safeStorage.getItem('k')).toBeNull()
  })
})
