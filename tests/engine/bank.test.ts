import { describe, expect, it } from 'vitest'
import { CATEGORIES, categoryById } from '@/content/categories'
import { getAllDefs, getBank } from '@/engine/bank'

describe('CATEGORIES', () => {
  it('sono le 19 categorie, in ordine, con id unici', () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual(['bandiere','capitali','sagome','loghi','animali','geografia','fiumi','monti','laghi','monumenti','storia','scienza','spazio','sport','arte','musica','valute','cucina','italia'])
    expect(categoryById('sagome').name).toBe('Sagome dei paesi')
    for (const c of CATEGORIES) {
      expect(c.tagline.trim()).not.toBe('')
      expect(c.color).toMatch(/^#[0-9A-F]{6}$/i)
    }
  })
})

describe('banca delle domande', () => {
  it('ogni categoria restituisce solo domande sue', () => {
    for (const c of CATEGORIES) {
      for (const d of getBank(c.id)) expect(d.category).toBe(c.id)
    }
  })

  it('è calcolata una volta sola', () => {
    expect(getBank('bandiere')).toBe(getBank('bandiere'))
    expect(getAllDefs()).toBe(getAllDefs())
  })

  it('getAllDefs contiene tutte le categorie', () => {
    const total = CATEGORIES.reduce((n, c) => n + getBank(c.id).length, 0)
    expect(getAllDefs().length).toBe(total)
    expect(getBank('bandiere').length).toBe(390)
  })
})
