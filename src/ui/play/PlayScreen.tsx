'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ECONOMY, saveCost } from '@/engine/economy'
import { createRng } from '@/engine/rng'
import {
  answer,
  canVideoSave,
  createRun,
  endRun,
  fiftyFifty,
  next,
  type RunEvent,
  type RunState,
  saveWithGems,
  saveWithVideo,
  skip,
  summarize,
  toSaveOffer,
} from '@/engine/run'
import type { Level, OptionId, Source } from '@/engine/types'
import { useCountdown } from '@/lib/countdown'
import { vibrate } from '@/lib/haptics'
import { play } from '@/lib/sound'
import { useAds } from '@/providers/ads'
import { centerOf, useFx } from '@/store/fx'
import { useProfile } from '@/store/profile'
import { StreakFlame, GemCounter } from '../counters'
import { GameButton } from '../GameButton'
import { levelName } from '../LevelSheet'
import { Modal } from '../Overlay'
import { AnswerGrid } from './AnswerGrid'
import { HintBar, TimerBar } from './bits'
import { QuestionCard } from './QuestionCard'
import { type RunResult, RunSummary } from './RunSummary'
import { SaveStreakModal } from './SaveStreakModal'

const CORRECT_DELAY = 800
const WRONG_DELAY = 1200
const newRng = () => createRng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0)

export interface PlayScreenProps {
  source: Source
  level?: Level
  /** il negozio da aprire sopra la partita quando le gemme non bastano */
  renderShop?: (props: { open: boolean; onClose(): void }) => ReactNode
}

export function PlayScreen({ source, level = 'auto', renderShop }: PlayScreenProps) {
  const router = useRouter()
  const ads = useAds()
  const burst = useFx((s) => s.burst)
  const gems = useProfile((s) => s.gems)
  const timerOn = useProfile((s) => s.settings.timer)
  const { addGems, spendGems, applyRun } = useProfile.getState()

  const rng = useRef(newRng())
  const [run, setRun] = useState<RunState>(() => createRun(source, rng.current, level))
  const runRef = useRef(run)
  const [result, setResult] = useState<RunResult | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const commit = useCallback((s: RunState) => {
    runRef.current = s
    setRun(s)
  }, [])
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const showToast = (text: string) => {
    setToast(text)
    later(() => setToast(null), 2600)
  }
  const handleEvents = (events: RunEvent[]) => {
    for (const e of events) {
      if (e.type === 'gem') {
        addGems(e.amount)
        burst(e.amount * 3, centerOf(cardRef.current))
      }
      if (e.type === 'exhausted') showToast('Hai finito tutta la categoria! Si ricomincia da capo.')
    }
  }
  const afterNewQuestion = (s: RunState) => {
    if (s.exhausted) showToast('Hai finito tutta la categoria! Si ricomincia da capo.')
  }

  // ---------------------------------------------------------------- risposta
  const onAnswer = (choice: OptionId | null) => {
    const r = answer(runRef.current, choice)
    if (r.state === runRef.current) return
    commit(r.state)
    if (r.state.phase === 'correct') {
      play('correct')
      vibrate('ok')
      handleEvents(r.events)
      later(() => {
        const n = next(runRef.current, rng.current)
        commit(n.state)
        handleEvents(n.events)
      }, CORRECT_DELAY)
    } else {
      play('wrong')
      vibrate('bad')
      later(() => {
        // con la streak a zero non c'è niente da salvare
        commit(runRef.current.streak > 0 ? toSaveOffer(runRef.current) : endRun(runRef.current))
      }, WRONG_DELAY)
    }
  }

  const timerPaused = run.phase !== 'question' || exitOpen || shopOpen || !timerOn
  const fraction = useCountdown(ECONOMY.questionTimeSec * 1000, {
    onEnd: () => {
      if (runRef.current.phase === 'question' && useProfile.getState().settings.timer) onAnswer(null)
    },
    paused: timerPaused,
    resetKey: run.question,
  })

  // ---------------------------------------------------------------- salvataggi e aiuti
  const cost = saveCost(run.saves)
  const onVideo = async () => {
    setVideoOpen(true)
    const res = await ads.showRewarded('save-streak')
    setVideoOpen(false)
    if (res === 'rewarded') {
      const s = saveWithVideo(runRef.current, rng.current)
      commit(s)
      afterNewQuestion(s)
    }
  }
  const onGems = () => {
    if (runRef.current.phase !== 'save-offer') return
    if (!spendGems(saveCost(runRef.current.saves))) {
      setShopOpen(true)
      return
    }
    play('gem')
    const s = saveWithGems(runRef.current, rng.current)
    commit(s)
    afterNewQuestion(s)
  }
  const onDecline = () => {
    if (runRef.current.phase === 'save-offer') commit(endRun(runRef.current))
  }
  const onFifty = () => {
    if (runRef.current.phase !== 'question' || runRef.current.fiftyUsed) return
    if (!spendGems(ECONOMY.fiftyFiftyCost)) return setShopOpen(true)
    play('tap')
    commit(fiftyFifty(runRef.current, rng.current))
  }
  const onSkip = () => {
    if (runRef.current.phase !== 'question') return
    if (!spendGems(ECONOMY.skipCost)) return setShopOpen(true)
    play('tap')
    const s = skip(runRef.current, rng.current)
    commit(s)
    afterNewQuestion(s)
  }

  // ---------------------------------------------------------------- fine partita
  const recorded = useRef(false)
  useEffect(() => {
    if (run.phase !== 'ended' || recorded.current) return
    recorded.current = true
    const summary = summarize(run)
    const { newRecord, bonus } = applyRun(summary)
    setResult({ summary, newRecord, bonus })
    if (bonus > 0) burst(bonus, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }, [run, applyRun, burst])

  const playAgain = () => {
    recorded.current = false
    setResult(null)
    commit(createRun(source, rng.current, level))
  }

  const onExit = () => {
    const s = runRef.current
    if (s.phase === 'ended' || s.answeredCount === 0) return router.push('/app/')
    setExitOpen(true)
  }

  // ---------------------------------------------------------------- vista
  if (result) {
    return (
      <div className="flex flex-1 flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <RunSummary result={result} onAgain={playAgain} />
      </div>
    )
  }

  const revealed = run.phase !== 'question'
  return (
    <div className="flex flex-1 flex-col gap-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="grid size-10 place-items-center rounded-full bg-elev text-muted ring-1 ring-line hover:text-ink"
          aria-label="Esci dalla partita"
        >
          <X className="size-5" />
        </button>
        <div className="flex flex-col items-center">
          <StreakFlame value={run.streak} />
          {level !== 'auto' && (
            <span className="text-[10px] font-bold tracking-widest text-muted uppercase">{levelName(level)}</span>
          )}
        </div>
        <GemCounter value={gems} />
      </header>

      {timerOn && <TimerBar fraction={run.phase === 'question' ? fraction : 0} />}

      <AnimatePresence>
        {toast && (
          <motion.p
            className="mx-auto rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

      <div ref={cardRef} className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <QuestionCard key={run.question.defId + run.answeredCount + run.seen.length} question={run.question} />
        </AnimatePresence>
      </div>

      <AnswerGrid
        key={run.question.defId + run.seen.length}
        question={run.question}
        hidden={run.hidden}
        chosen={run.chosen}
        revealed={revealed}
        onAnswer={onAnswer}
      />

      <HintBar
        canFifty={run.phase === 'question' && !run.fiftyUsed}
        canSkip={run.phase === 'question'}
        onFifty={onFifty}
        onSkip={onSkip}
      />

      <SaveStreakModal
        open={run.phase === 'save-offer' && !videoOpen}
        streak={run.streak}
        cost={cost}
        canVideo={canVideoSave(run)}
        gems={gems}
        paused={videoOpen || shopOpen}
        onVideo={onVideo}
        onGems={onGems}
        onDecline={onDecline}
      />

      <Modal open={exitOpen} title="Uscire dalla partita?" onClose={() => setExitOpen(false)}>
        <h2 className="text-center font-display text-xl font-extrabold">Uscire dalla partita?</h2>
        <p className="mt-2 text-center text-sm text-muted">
          {run.streak > 0 ? `La tua streak di ${run.streak} finirà qui.` : 'La partita finirà qui.'}
        </p>
        <div className="mt-5 grid gap-3">
          <GameButton variant="secondary" onClick={() => setExitOpen(false)} autoFocus>
            Continua a giocare
          </GameButton>
          <GameButton
            variant="ghost"
            onClick={() => {
              setExitOpen(false)
              commit(endRun(runRef.current))
            }}
          >
            Esci e chiudi la partita
          </GameButton>
        </div>
      </Modal>

      {renderShop?.({ open: shopOpen, onClose: () => setShopOpen(false) })}
    </div>
  )
}
