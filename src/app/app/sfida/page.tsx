'use client'

import { Sun, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { dailyQuestions, dateKeyRome } from '@/engine/daily'
import { ECONOMY } from '@/engine/economy'
import type { OptionId } from '@/engine/types'
import { useCountdown } from '@/lib/countdown'
import { cx } from '@/lib/cx'
import { vibrate } from '@/lib/haptics'
import { play } from '@/lib/sound'
import { centerOf, useFx } from '@/store/fx'
import { useProfile } from '@/store/profile'
import { DailyResult } from '@/ui/DailyResult'
import { AnswerGrid } from '@/ui/play/AnswerGrid'
import { TimerBar } from '@/ui/play/bits'
import { QuestionCard } from '@/ui/play/QuestionCard'

const SIZE = ECONOMY.dailyChallengeSize

export default function DailyPage() {
  // la data si fissa all'apertura: chi gioca a cavallo della mezzanotte finisce la sfida iniziata
  const [key] = useState(() => dateKeyRome(new Date()))
  const questions = useMemo(() => dailyQuestions(key), [key])
  const record = useProfile((s) => s.daily[key])
  const recordDailyAnswer = useProfile((s) => s.recordDailyAnswer)
  const finishDaily = useProfile((s) => s.finishDaily)
  const burst = useFx((s) => s.burst)

  const results = record?.results ?? []
  const answered = results.length
  // domanda appena risposta, mostrata ancora per un attimo con la soluzione
  const [reveal, setReveal] = useState<{ index: number; chosen: OptionId | null } | null>(null)
  const [reward, setReward] = useState(0)
  const finished = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const showIndex = reveal?.index ?? answered
  const complete = answered >= SIZE && !reveal

  useEffect(() => {
    if (!complete || finished.current) return
    finished.current = true
    const r = finishDaily(key)
    if (r > 0) {
      setReward(r)
      play('record')
      burst(10, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
  }, [complete, finishDaily, key, burst])

  const onAnswer = (choice: OptionId | null) => {
    if (reveal || answered >= SIZE) return
    const q = questions[answered]
    const ok = choice !== null && choice === q.correct
    recordDailyAnswer(key, ok)
    setReveal({ index: answered, chosen: choice })
    play(ok ? 'correct' : 'wrong')
    vibrate(ok ? 'ok' : 'bad')
    setTimeout(() => setReveal(null), ok ? 900 : 1500)
  }

  const fraction = useCountdown(ECONOMY.questionTimeSec * 1000, {
    onEnd: () => onAnswer(null),
    paused: !!reveal || complete,
    resetKey: showIndex,
  })

  if (complete) {
    return (
      <div className="flex flex-1 flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <DailyResult dateKey={key} results={results.slice(0, SIZE)} reward={reward} />
      </div>
    )
  }

  const q = questions[showIndex]
  return (
    <div className="flex flex-1 flex-col gap-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between gap-3">
        <Link
          href="/app/"
          className="grid size-10 place-items-center rounded-full bg-elev text-muted ring-1 ring-line hover:text-ink"
          aria-label="Esci: i progressi della sfida restano salvati"
        >
          <X className="size-5" />
        </Link>
        <div className="flex flex-1 flex-col items-center">
          <p className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-muted uppercase">
            <Sun className="size-4 text-gem" /> Sfida del giorno
          </p>
          <ol className="mt-1.5 flex gap-1" aria-label={`Domanda ${showIndex + 1} di ${SIZE}`}>
            {Array.from({ length: SIZE }, (_, i) => (
              <li
                key={i}
                className={cx(
                  'h-2 w-5 rounded-full',
                  i < results.length ? (results[i] ? 'bg-ok' : 'bg-bad') : i === showIndex ? 'bg-primary-2' : 'bg-surface',
                )}
              />
            ))}
          </ol>
        </div>
        <span className="w-10 text-right text-sm font-bold text-muted tabular-nums">
          {showIndex + 1}/{SIZE}
        </span>
      </header>

      <TimerBar fraction={reveal ? 0 : fraction} />

      <div ref={cardRef} className="flex flex-1 flex-col justify-center">
        <QuestionCard key={showIndex} question={q} />
      </div>

      <AnswerGrid
        key={`d${showIndex}`}
        question={q}
        hidden={[]}
        chosen={reveal?.chosen ?? null}
        revealed={!!reveal}
        onAnswer={onAnswer}
      />

      <p className="text-center text-xs text-muted">Niente aiuti né salvataggi: tutti giocano alle stesse condizioni.</p>
    </div>
  )
}
