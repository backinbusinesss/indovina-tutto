'use client'

import { Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { shareText } from '@/engine/daily'
import { shareOrCopy, siteUrl } from '@/lib/share'
import { cx } from '@/lib/cx'
import { GameButton } from './GameButton'
import { GemIcon } from './icons'

/** Tempo che manca alla mezzanotte italiana. */
function untilRomeMidnight(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  const left = 86_400 - (get('hour') * 3600 + get('minute') * 60 + get('second'))
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  return `${h} h ${String(m).padStart(2, '0')} min`
}

export function DailyResult({ dateKey, results, reward }: { dateKey: string; results: boolean[]; reward: number }) {
  const score = results.filter(Boolean).length
  const [left, setLeft] = useState(() => untilRomeMidnight())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setLeft(untilRomeMidnight()), 30_000)
    return () => clearInterval(t)
  }, [])

  const share = async () => {
    const r = await shareOrCopy(shareText(dateKey, results, siteUrl()))
    if (r === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const verdict = score === 10 ? 'Perfetto!' : score >= 8 ? 'Grandioso!' : score >= 5 ? 'Bel lavoro!' : 'Domani andrà meglio!'

  return (
    <motion.div className="flex flex-1 flex-col items-center justify-center py-6 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-sm font-bold tracking-widest text-muted uppercase">Sfida del giorno</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">{verdict}</h1>
      <p className="mt-4 font-display text-6xl font-extrabold tabular-nums">
        {score}
        <span className="text-3xl text-muted">/{results.length}</span>
      </p>

      <ol className="mt-5 flex gap-1.5" aria-label="Risultati domanda per domanda">
        {results.map((ok, i) => (
          <motion.li
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 400, damping: 18 }}
            className={cx('size-7 rounded-lg', ok ? 'bg-ok' : 'bg-bad')}
            aria-label={`Domanda ${i + 1}: ${ok ? 'giusta' : 'sbagliata'}`}
          />
        ))}
      </ol>

      {reward > 0 && (
        <p className="mt-5 flex items-center gap-1.5 rounded-full bg-gem/15 px-4 py-1.5 font-bold text-gem-ink">
          +{reward} <GemIcon className="size-5" /> per aver completato la sfida
        </p>
      )}

      <p className="mt-5 text-sm text-muted">
        Prossima sfida tra <span className="font-semibold text-ink">{left}</span>
      </p>

      <div className="mt-8 grid w-full gap-3">
        <GameButton size="lg" block onClick={share}>
          <Share2 className="size-5" /> {copied ? 'Copiato!' : 'Condividi il risultato'}
        </GameButton>
        <Link href="/app/" className="btn-game btn-secondary h-12 w-full px-4 text-base">
          Torna alla home
        </Link>
      </div>
    </motion.div>
  )
}
