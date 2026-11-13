'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { cx } from '@/lib/cx'
import { FlameIcon, GemIcon } from './icons'

const pill = 'inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-elev/80 px-3 font-bold tabular-nums backdrop-blur'

/** Contatore delle gemme: il numero scorre quando cambia. È anche il bersaglio delle gemme che volano. */
export function GemCounter({ value, href }: { value: number; href?: string }) {
  const inner = (
    <>
      <GemIcon className="size-5" />
      <span className="relative inline-block min-w-[2ch] overflow-hidden text-right">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="inline-block"
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {value.toLocaleString('it-IT')}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
  return href ? (
    <Link id="gem-counter" href={href} className={cx(pill, 'text-gem-ink')} aria-label={`${value} gemme, apri il negozio`}>
      {inner}
    </Link>
  ) : (
    <span id="gem-counter" className={cx(pill, 'text-gem-ink')} aria-label={`${value} gemme`}>
      {inner}
    </span>
  )
}

/** Giorni di fila. */
export function DayStreak({ value }: { value: number }) {
  return (
    <span className={cx(pill, value > 0 ? 'text-fire' : 'text-muted')} aria-label={`${value} giorni di fila`} title="Giorni di fila">
      <FlameIcon className="size-5" lit={value > 0} />
      {value}
    </span>
  )
}

/** La fiamma della streak: cresce a 5, 10, 25 e 50 e "salta" a ogni risposta giusta. */
export function StreakFlame({ value }: { value: number }) {
  const size = value >= 50 ? 'size-10' : value >= 25 ? 'size-9' : value >= 10 ? 'size-8' : value >= 5 ? 'size-7' : 'size-6'
  return (
    <div className="flex items-center gap-1.5" aria-live="polite" aria-label={`Streak: ${value}`}>
      <motion.span
        key={value}
        initial={{ scale: value > 0 ? 1.5 : 1, rotate: value > 0 ? -12 : 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        className={cx('inline-flex', value > 0 && 'animate-flicker')}
      >
        <FlameIcon className={size} lit={value > 0} />
      </motion.span>
      <span className={cx('font-display text-2xl font-extrabold tabular-nums', value > 0 ? 'text-fire' : 'text-muted')}>
        {value}
      </span>
    </div>
  )
}
