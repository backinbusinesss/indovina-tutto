'use client'

import confetti from 'canvas-confetti'
import { RotateCcw, Share2 } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { RunSummary as Summary } from '@/engine/run'
import { shareOrCopy, siteUrl } from '@/lib/share'
import { play } from '@/lib/sound'
import { useProfile } from '@/store/profile'
import { sourceMeta } from '../CategoryIcon'
import { StreakFlame } from '../counters'
import { GameButton } from '../GameButton'
import { GemIcon } from '../icons'

export interface RunResult {
  summary: Summary
  newRecord: boolean
  bonus: number
}

function Confetti() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const colors = ['#4757EC', '#FFC83D', '#FF7A1A', '#2ED47A', '#FF5C7A', '#3DA5FF']
    confetti({ particleCount: 110, spread: 75, startVelocity: 45, origin: { y: 0.35 }, colors, disableForReducedMotion: true })
    const t = setTimeout(
      () => confetti({ particleCount: 70, spread: 120, origin: { y: 0.3 }, colors, disableForReducedMotion: true }),
      350,
    )
    return () => clearTimeout(t)
  }, [reduce])
  return null
}

export function RunSummary({ result, onAgain }: { result: RunResult; onAgain(): void }) {
  const { summary, newRecord, bonus } = result
  const best = useProfile((s) => s.stats[summary.source]?.best ?? 0)
  const [copied, setCopied] = useState(false)
  const { name } = sourceMeta(summary.source)
  const pct = summary.answered > 0 ? Math.round((summary.correct / summary.answered) * 100) : 0

  useEffect(() => {
    if (newRecord) play('record')
  }, [newRecord])

  const share = async () => {
    const text = `🔥 Ho fatto una streak di ${summary.streak} in ${name} su Indovina Tutto! Riesci a battermi?\n${siteUrl()}`
    const r = await shareOrCopy(text)
    if (r === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center py-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {newRecord && <Confetti />}
      {newRecord ? (
        <motion.p
          className="mb-3 rounded-full bg-gradient-to-r from-gem to-fire px-4 py-1.5 text-sm font-extrabold tracking-widest text-[#3a1a00] uppercase"
          initial={{ scale: 0.5, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        >
          Nuovo record!
        </motion.p>
      ) : (
        <p className="mb-3 text-sm font-bold tracking-widest text-muted uppercase">Partita finita</p>
      )}
      <div className="scale-[2.2] py-6">
        <StreakFlame value={summary.streak} />
      </div>
      <p className="mt-2 text-muted">
        di fila in <span className="font-semibold text-ink">{name}</span>
      </p>

      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        <div className="card p-3">
          <p className="font-display text-xl font-extrabold tabular-nums">
            {summary.correct}/{summary.answered}
          </p>
          <p className="text-[11px] text-muted">giuste ({pct}%)</p>
        </div>
        <div className="card p-3">
          <p className="flex items-center justify-center gap-1 font-display text-xl font-extrabold text-gem-ink tabular-nums">
            +{summary.gemsEarned + bonus}
            <GemIcon className="size-4" />
          </p>
          <p className="text-[11px] text-muted">{bonus > 0 ? `${bonus} di bonus record` : 'gemme guadagnate'}</p>
        </div>
        <div className="card p-3">
          <p className="font-display text-xl font-extrabold text-fire tabular-nums">{best}</p>
          <p className="text-[11px] text-muted">il tuo record</p>
        </div>
      </div>

      <div className="mt-8 grid w-full gap-3">
        <GameButton size="lg" block onClick={onAgain} autoFocus>
          <RotateCcw className="size-5" /> Gioca ancora
        </GameButton>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/" className="btn-game btn-secondary h-12 px-4 text-base">
            Cambia categoria
          </Link>
          <GameButton variant="secondary" onClick={share}>
            <Share2 className="size-4" /> {copied ? 'Copiato!' : 'Condividi'}
          </GameButton>
        </div>
      </div>
    </motion.div>
  )
}
