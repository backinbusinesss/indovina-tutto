import { describe, expect, it } from 'vitest'
import { addDays, dailyQuestions, dateKeyRome, shareText } from '@/engine/daily'
import {
  applyRun,
  canWatchShopVideo,
  chestAvailable,
  finishDaily,
  initialProfile,
  levelFromXp,
  openChest,
  type Profile,
  recordDailyAnswer,
  spendGems,
  touchDay,
  watchShopVideo,
} from '@/engine/progress'

const withStreak = (dayStreak: number, lastPlayedDay: string | null): Profile => ({
  ...initialProfile(),
  dayStreak,
  lastPlayedDay,
})

describe('date (ora di Roma)', () => {
  it('a mezzanotte di Roma cambia il giorno', () => {
    expect(dateKeyRome(new Date('2026-11-13T22:59:00Z'))).toBe('2026-11-13')
    expect(dateKeyRome(new Date('2026-11-13T23:01:00Z'))).toBe('2026-11-14')
  })

  it("d'estate (ora legale) la mezzanotte è alle 22:00 UTC", () => {
    expect(dateKeyRome(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01')
    expect(dateKeyRome(new Date('2026-07-01T22:01:00Z'))).toBe('2026-07-02')
  })

  it('addDays funziona a cavallo del cambio d’ora e dei mesi', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29')
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30')
    expect(addDays('2026-10-25', -1)).toBe('2026-10-24')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('giorni di fila', () => {
  it('giocare il giorno dopo allunga la serie', () => {
    expect(touchDay(withStreak(3, '2026-11-13'), '2026-11-14').dayStreak).toBe(4)
  })

  it('23:59 e 00:01 contano come due giorni consecutivi', () => {
    const p1 = touchDay(withStreak(3, '2026-11-12'), dateKeyRome(new Date('2026-11-13T22:59:00Z')))
    const p2 = touchDay(p1, dateKeyRome(new Date('2026-11-13T23:01:00Z')))
    expect(p1.dayStreak).toBe(4)
    expect(p2.dayStreak).toBe(5)
  })

  it('giocare due volte lo stesso giorno non cambia niente', () => {
    const p = withStreak(3, '2026-11-13')
    expect(touchDay(p, '2026-11-13')).toEqual(p)
  })

  it('un giorno saltato azzera la serie', () => {
    expect(touchDay(withStreak(3, '2026-11-13'), '2026-11-16').dayStreak).toBe(1)
  })

  it("l'orologio messo indietro non rompe niente", () => {
    const p = withStreak(3, '2026-11-13')
    expect(touchDay(p, '2026-11-10')).toEqual(p)
  })
})

describe('gemme', () => {
  it('si parte con 50 gemme di benvenuto', () => {
    expect(initialProfile().gems).toBe(50)
  })

  it('non si spende più di quanto si ha', () => {
    expect(spendGems({ ...initialProfile(), gems: 5 }, 10)).toBeNull()
    expect(spendGems({ ...initialProfile(), gems: 15 }, 10)?.gems).toBe(5)
  })
})

describe('forziere', () => {
  it('il primo giorno dà 10 gemme, una volta sola', () => {
    const p = initialProfile()
    const r = openChest(p, '2026-11-13')!
    expect(r.reward).toBe(10)
    expect(r.profile.gems).toBe(60)
    expect(chestAvailable(r.profile, '2026-11-13')).toBe(false)
    expect(openChest(r.profile, '2026-11-13')).toBeNull()
    expect(chestAvailable(r.profile, '2026-11-14')).toBe(true)
  })

  it('dal settimo giorno di fila dà 30 gemme', () => {
    expect(openChest(withStreak(6, '2026-11-12'), '2026-11-13')!.reward).toBe(30)
    expect(openChest(withStreak(20, '2026-11-13'), '2026-11-13')!.reward).toBe(30)
  })

  it('se la serie è interrotta riparte da 10', () => {
    expect(openChest(withStreak(9, '2026-11-01'), '2026-11-13')!.reward).toBe(10)
  })
})

describe('fine partita', () => {
  const run = (streak: number) => ({ source: 'bandiere' as const, streak, correct: streak, answered: streak + 1, gemsEarned: 0 })

  it('nuovo record: +5 gemme, solo da 3 in su', () => {
    const p0 = initialProfile()
    const a = applyRun(p0, run(2), '2026-11-13')
    expect(a.newRecord).toBe(false)
    expect(a.bonus).toBe(0)
    const b = applyRun(a.profile, run(7), '2026-11-13')
    expect(b.newRecord).toBe(true)
    expect(b.bonus).toBe(5)
    expect(b.profile.gems).toBe(55)
    const c = applyRun(b.profile, run(7), '2026-11-13')
    expect(c.newRecord).toBe(false)
  })

  it('aggiorna statistiche, esperienza e giorni di fila', () => {
    const r = applyRun(initialProfile(), run(4), '2026-11-13').profile
    expect(r.stats.bandiere).toEqual({ best: 4, runs: 1, correct: 4, answered: 5 })
    expect(r.xp).toBe(4)
    expect(r.dayStreak).toBe(1)
    expect(r.lastPlayedDay).toBe('2026-11-13')
  })
})

describe('video nel negozio', () => {
  it('massimo 3 al giorno', () => {
    let p = initialProfile()
    for (let i = 0; i < 3; i++) p = watchShopVideo(p, '2026-11-13')
    expect(p.gems).toBe(65)
    expect(canWatchShopVideo(p, '2026-11-13')).toBe(false)
    expect(watchShopVideo(p, '2026-11-13')).toBe(p)
    expect(canWatchShopVideo(p, '2026-11-14')).toBe(true)
  })
})

describe('livelli', () => {
  it('servono 50 XP per il livello 2 e 75 per il 3', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, into: 0, needed: 50 })
    expect(levelFromXp(49).level).toBe(1)
    expect(levelFromXp(50)).toEqual({ level: 2, into: 0, needed: 75 })
    expect(levelFromXp(125)).toEqual({ level: 3, into: 0, needed: 100 })
  })
})

describe('sfida del giorno', () => {
  it('stessa data, stesse domande e stesse opzioni', () => {
    const a = dailyQuestions('2026-11-13')
    const b = dailyQuestions('2026-11-13')
    expect(a).toEqual(b)
    expect(a).toHaveLength(10)
  })

  it('date diverse danno domande diverse', () => {
    const a = dailyQuestions('2026-11-13').map((q) => q.defId)
    const b = dailyQuestions('2026-11-14').map((q) => q.defId)
    expect(a).not.toEqual(b)
  })

  it('4 facili, 4 medie, 2 difficili, da almeno 6 categorie', () => {
    const q = dailyQuestions('2026-11-13')
    const count = (d: number) => q.filter((x) => x.difficulty === d).length
    expect([count(1), count(2), count(3)]).toEqual([4, 4, 2])
    expect(new Set(q.map((x) => x.category)).size).toBeGreaterThanOrEqual(6)
  })

  it('le risposte si salvano una alla volta e la ricompensa arriva una volta sola', () => {
    let p = initialProfile()
    for (let i = 0; i < 10; i++) p = recordDailyAnswer(p, '2026-11-13', i % 3 !== 0)
    expect(p.daily['2026-11-13'].results).toHaveLength(10)
    // un'undicesima risposta viene ignorata
    expect(recordDailyAnswer(p, '2026-11-13', true).daily['2026-11-13'].results).toHaveLength(10)
    const f = finishDaily(p, '2026-11-13')
    expect(f.reward).toBe(15)
    expect(f.profile.gems).toBe(65)
    expect(f.profile.daily['2026-11-13'].done).toBe(true)
    expect(finishDaily(f.profile, '2026-11-13').reward).toBe(0)
  })

  it('testo da condividere', () => {
    const results = [true, true, false, true, true, true, false, true, true, true]
    expect(shareText('2026-11-13', results, 'https://esempio.it/')).toBe(
      'Indovina Tutto — Sfida del 13/11/2026\n🟩🟩🟥🟩🟩🟩🟥🟩🟩🟩 8/10\nhttps://esempio.it/',
    )
  })
})
