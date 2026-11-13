'use client'

import { Check } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { assetUrl } from '@/lib/asset'
import { cx } from '@/lib/cx'
import { StreakFlame } from '@/ui/counters'
import { GemIcon } from '@/ui/icons'

interface Sample {
  category: string
  color: string
  prompt: string
  media?: { kind: 'flag' | 'logo' | 'shape'; src: string }
  options: string[]
  correct: number
}

const SAMPLES: Sample[] = [
  { category: 'Bandiere', color: '#FF5C7A', prompt: 'Di quale paese è questa bandiera?', media: { kind: 'flag', src: 'flags/br.svg' }, options: ['Portogallo', 'Brasile', 'Argentina', 'Colombia'], correct: 1 },
  { category: 'Capitali', color: '#7C5CFF', prompt: "Qual è la capitale dell'Australia?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2 },
  { category: 'Loghi', color: '#FFC83D', prompt: 'Di quale marchio è questo logo?', media: { kind: 'logo', src: 'logos/ferrari.svg' }, options: ['Ferrari', 'Lamborghini', 'Maserati', 'Porsche'], correct: 0 },
  { category: 'Sagome dei paesi', color: '#2ED4C8', prompt: 'Di quale paese è questa sagoma?', media: { kind: 'shape', src: 'shapes/it.svg' }, options: ['Grecia', 'Croazia', 'Spagna', 'Italia'], correct: 3 },
]

function Media({ s }: { s: Sample }) {
  if (!s.media) return <div className="h-4" />
  const src = assetUrl(s.media.src)
  if (s.media.kind === 'flag') return <img src={src} alt="" className="mx-auto h-24 rounded-xl shadow-lg ring-1 ring-black/10" />
  if (s.media.kind === 'logo')
    return (
      <div className="mx-auto grid size-24 place-items-center rounded-2xl bg-white p-4 shadow-lg">
        <img src={src} alt="" className="size-full object-contain" />
      </div>
    )
  return (
    <div
      className="mx-auto size-24"
      style={{
        background: `linear-gradient(160deg, ${s.color}, #fff)`,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

/** Un telefono finto che gioca da solo: risponde, la streak sale, arrivano le gemme. */
export function DemoQuestion() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [streak, setStreak] = useState(7)
  const [gems, setGems] = useState(120)

  useEffect(() => {
    if (reduce) return
    const t1 = setTimeout(() => {
      setAnswered(true)
      setStreak((s) => s + 1)
      setGems((g) => g + 1)
    }, 1500)
    const t2 = setTimeout(() => {
      setAnswered(false)
      setI((n) => (n + 1) % SAMPLES.length)
    }, 2700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [i, reduce])

  const s = SAMPLES[i]
  return (
    <div className="relative mx-auto w-full max-w-[20rem]" aria-hidden="true">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(124,92,255,0.45),transparent)] blur-2xl" />
      <div className="rounded-[2.4rem] border border-line-strong bg-bg/95 p-3 shadow-[0_30px_80px_-20px_rgba(10,8,40,0.8)]">
        <div className="rounded-[1.9rem] border border-line bg-[linear-gradient(180deg,var(--bg-elev),var(--bg))] px-4 pt-4 pb-5">
          <div className="mb-3 flex items-center justify-between">
            <StreakFlame value={streak} />
            <span className="inline-flex h-8 items-center gap-1 rounded-full border border-line bg-elev px-2.5 text-sm font-bold text-gem-ink tabular-nums">
              <GemIcon className="size-4" /> {gems}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-elev px-2.5 py-1 text-[11px] font-bold ring-1 ring-line">
                <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                {s.category}
              </span>
              <Media s={s} />
              <p className="mt-3 mb-3 text-center font-display text-base leading-snug font-extrabold">{s.prompt}</p>
              <div className="grid gap-2">
                {s.options.map((o, k) => {
                  const ok = answered && k === s.correct
                  return (
                    <div
                      key={o}
                      className={cx(
                        'flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-sm font-semibold transition-colors duration-300',
                        ok ? 'border-ok bg-ok text-white' : 'border-line bg-elev',
                        answered && !ok && 'opacity-50',
                      )}
                    >
                      <span className={cx('grid size-6 place-items-center rounded-lg text-[11px] font-extrabold', ok ? 'bg-white/25' : 'bg-surface text-muted')}>
                        {ok ? <Check className="size-4" strokeWidth={3} /> : 'ABCD'[k]}
                      </span>
                      {o}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
