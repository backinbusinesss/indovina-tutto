import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialProfile } from '@/engine/progress'
import { profileOf, useProfile } from '@/store/profile'

beforeEach(() => {
  useProfile.getState().reset()
})

describe('store del giocatore', () => {
  it('parte dal profilo iniziale', () => {
    expect(profileOf(useProfile.getState())).toEqual(initialProfile())
  })

  it('doppio tocco su "Usa 10 gemme": la seconda volta non spende', () => {
    useProfile.setState({ gems: 15 })
    const { spendGems } = useProfile.getState()
    expect(spendGems(10)).toBe(true)
    expect(spendGems(10)).toBe(false)
    expect(useProfile.getState().gems).toBe(5)
  })

  it('funziona anche se il browser blocca il salvataggio', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const before = useProfile.getState().gems
    expect(() => useProfile.getState().addGems(10)).not.toThrow()
    expect(useProfile.getState().gems).toBe(before + 10)
  })

  it('salva nel browser con la chiave prevista', () => {
    useProfile.getState().addGems(7)
    const saved = JSON.parse(localStorage.getItem('indovina-tutto:v1') ?? '{}')
    expect(saved.state.gems).toBe(57)
    expect(saved.state.addGems).toBeUndefined()
  })

  it('reset riporta al profilo iniziale', () => {
    useProfile.getState().addGems(100)
    useProfile.getState().updateSettings({ sound: false })
    useProfile.getState().reset()
    expect(profileOf(useProfile.getState())).toEqual(initialProfile())
  })

  it('le impostazioni si aggiornano senza perdere le altre', () => {
    useProfile.getState().updateSettings({ theme: 'light' })
    expect(useProfile.getState().settings).toEqual({ sound: true, haptics: true, timer: true, theme: 'light' })
  })
})
