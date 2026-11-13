import { describe, expect, it, vi } from 'vitest'
import { assetUrl } from '@/lib/asset'

describe('assetUrl', () => {
  it('aggiunge il prefisso di GitHub Pages', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/indovina-tutto')
    expect(assetUrl('flags/it.svg')).toBe('/indovina-tutto/flags/it.svg')
    expect(assetUrl('/flags/it.svg')).toBe('/indovina-tutto/flags/it.svg')
  })

  it('funziona senza prefisso', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '')
    expect(assetUrl('sw.js')).toBe('/sw.js')
  })
})
