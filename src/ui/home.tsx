'use client'

import { ChevronRight, Gift, Shuffle, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import type { CategoryMeta } from '@/content/categories'
import { dateKeyRome } from '@/engine/daily'
import { ECONOMY } from '@/engine/economy'
import { chestAvailable, effectiveDayStreak } from '@/engine/progress'
import { play } from '@/lib/sound'
import { centerOf, useFx } from '@/store/fx'
import { useProfile } from '@/store/profile'
import { CategoryTile } from './CategoryIcon'
import { FlameIcon, GemIcon } from './icons'

const today = () => dateKeyRome(new Date())

/** Il forziere del giorno: si apre una volta al giorno. */
export function DailyChest() {
  const profile = useProfile()
  const openChest = useProfile((s) => s.openChest)
  const burst = useFx((s) => s.burst)
  const ref = useRef<HTMLButtonElement>(null)
  const [opening, setOpening] = useState(false)
  const [reward, setReward] = useState<number | null>(null)
  const t = today()
  const available = chestAvailable(profile, t)
  const day = effectiveDayStreak(profile, t)
  const preview = ECONOMY.chestRewards[Math.min(day, ECONOMY.chestRewards.length) - 1]

  if (!available && reward === null) return null

  const open = () => {
    if (opening || reward !== null) return
    setOpening(true)
    play('chest')
    setTimeout(() => {
      const r = openChest()
      if (r !== null) {
        setReward(r)
        burst(Math.min(r, 10), centerOf(ref.current))
      }
      setOpening(false)
      setTimeout(() => setReward(null), 2200)
    }, 650)
  }

  return (
    <AnimatePresence>
      <motion.button
        ref={ref}
        type="button"
        onClick={open}
        disabled={reward !== null}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-4 text-left text-[#3a2600] shadow-[0_10px_30px_-10px_rgba(255,170,30,0.7)]"
        style={{ background: 'linear-gradient(135deg, #FFE08A 0%, #FFC83D 45%, #FF9F43 100%)' }}
        aria-label={reward !== null ? `Hai vinto ${reward} gemme` : `Apri il premio del giorno: ${preview} gemme`}
      >
        <motion.span
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/45"
          animate={opening ? { rotate: [0, -14, 14, -10, 10, 0], scale: [1, 1.1, 1.1, 1.15, 1.2, 1.3] } : { rotate: [0, -6, 6, 0] }}
          transition={opening ? { duration: 0.65 } : { duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
        >
          <Gift className="size-8" strokeWidth={2.2} />
        </motion.span>
        <span className="flex-1">
          <span className="block font-display text-lg leading-tight font-extrabold">
            {reward !== null ? `+${reward} gemme!` : 'Premio del giorno'}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-sm font-semibold opacity-80">
            <FlameIcon className="size-4" /> Giorno {day} di fila · {preview}
            <GemIcon className="size-4" />
          </span>
        </span>
        {reward === null && (
          <span className="rounded-full bg-[#3a2600] px-3 py-1.5 text-sm font-bold text-[#FFE08A]">Apri</span>
        )}
      </motion.button>
    </AnimatePresence>
  )
}

/** Scheda della sfida del giorno. */
export function DailyChallengeCard() {
  const record = useProfile((s) => s.daily[today()])
  const answered = record?.results.length ?? 0
  const score = record?.results.filter(Boolean).length ?? 0
  const done = record?.done ?? false
  const status = done ? `Fatta: ${score}/${ECONOMY.dailyChallengeSize} · torna domani` : answered > 0 ? `In corso: ${answered}/${ECONOMY.dailyChallengeSize}` : `${ECONOMY.dailyChallengeSize} domande · +${ECONOMY.dailyChallengeReward}`

  return (
    <Link
      href="/app/sfida/"
      className="group relative flex items-center gap-4 overflow-hidden rounded-3xl p-4 text-white shadow-[0_14px_34px_-12px_rgba(71,87,236,0.8)]"
      style={{ background: 'linear-gradient(135deg, #6B78FF 0%, #2D3AD4 55%, #1E2690 100%)' }}
    >
      <span className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
        <Sun className="size-8 text-[#FFE08A]" strokeWidth={2.2} />
      </span>
      <span className="flex-1">
        <span className="block text-xs font-bold tracking-widest text-white/70 uppercase">Sfida del giorno</span>
        <span className="mt-0.5 block font-display text-lg leading-tight font-extrabold">
          {done ? 'Completata!' : answered > 0 ? 'Continua la sfida' : 'Uguale per tutti, oggi'}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
          {status}
          {!done && answered === 0 && <GemIcon className="size-4" />}
        </span>
      </span>
      <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

export function MixButton() {
  const best = useProfile((s) => s.stats.mix?.best ?? 0)
  return (
    <Link
      href="/app/gioca/?c=mix"
      className="btn-game btn-primary h-16 w-full justify-between rounded-2xl px-5 text-lg"
      onClick={() => play('tap')}
    >
      <span className="flex items-center gap-3">
        <Shuffle className="size-6" strokeWidth={2.5} />
        Gioca Mix Tutto
      </span>
      {best > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-sm">
          <FlameIcon className="size-4" /> {best}
        </span>
      )}
    </Link>
  )
}

export function CategoryCard({ category }: { category: CategoryMeta }) {
  const stats = useProfile((s) => s.stats[category.id])
  return (
    <Link
      href={`/app/gioca/?c=${category.id}`}
      onClick={() => play('tap')}
      className="card group flex flex-col gap-3 p-3.5 transition-transform active:scale-[0.97]"
    >
      <div className="flex items-start justify-between">
        <CategoryTile source={category.id} />
        {stats && stats.best > 0 ? (
          <span className="flex items-center gap-0.5 rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-fire" title="Record">
            <FlameIcon className="size-3.5" />
            {stats.best}
          </span>
        ) : (
          <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted uppercase">Nuova</span>
        )}
      </div>
      <div>
        <h3 className="font-display text-base leading-tight font-extrabold">{category.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{category.tagline}</p>
      </div>
    </Link>
  )
}
