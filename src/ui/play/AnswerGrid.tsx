'use client'

import { Check, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Option, OptionId, Question } from '@/engine/types'
import { assetUrl } from '@/lib/asset'
import { cx } from '@/lib/cx'

const LETTERS: Record<OptionId, string> = { a: 'A', b: 'B', c: 'C', d: 'D' }
const KEYS: Record<string, OptionId> = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' }

export interface AnswerGridProps {
  question: Question
  hidden: OptionId[]
  /** la risposta data (null = nessuna o tempo scaduto) */
  chosen: OptionId | null
  /** dopo la risposta: mostra giusta/sbagliata */
  revealed: boolean
  onAnswer(id: OptionId): void
}

type State = 'idle' | 'correct' | 'wrong' | 'dim'

function stateOf(o: Option, q: Question, chosen: OptionId | null, revealed: boolean): State {
  if (!revealed) return 'idle'
  if (o.id === q.correct) return 'correct'
  if (o.id === chosen) return 'wrong'
  return 'dim'
}

/** Le 4 risposte. Accetta un solo tocco per domanda e i tasti 1–4. */
export function AnswerGrid({ question, hidden, chosen, revealed, onAnswer }: AnswerGridProps) {
  const locked = useRef(false)
  const onAnswerRef = useRef(onAnswer)
  onAnswerRef.current = onAnswer

  useEffect(() => {
    locked.current = false
  }, [question.defId])

  const visible = question.options.filter((o) => !hidden.includes(o.id))

  const choose = (id: OptionId) => {
    if (locked.current || revealed || hidden.includes(id)) return
    locked.current = true
    onAnswerRef.current(id)
  }

  useEffect(() => {
    if (revealed) return
    const onKey = (e: KeyboardEvent) => {
      const id = KEYS[e.key]
      if (id) choose(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, question.defId, hidden.join()])

  if (question.layout === 'images') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((o) => {
          const st = stateOf(o, question, chosen, revealed)
          const isHidden = hidden.includes(o.id)
          return (
            <motion.button
              key={o.id}
              type="button"
              aria-label={`Opzione ${LETTERS[o.id]}`}
              disabled={isHidden || revealed}
              onClick={() => choose(o.id)}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: isHidden ? 0 : st === 'dim' ? 0.35 : 1, scale: st === 'correct' ? 1.04 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
              className={cx(
                'relative aspect-[4/3] overflow-hidden rounded-2xl border-4 bg-tile shadow-card transition-colors',
                isHidden && 'invisible',
                st === 'idle' && 'border-transparent hover:border-primary-2 active:scale-[0.97]',
                st === 'correct' && 'border-ok',
                st === 'wrong' && 'animate-shake border-bad',
                st === 'dim' && 'border-transparent',
              )}
            >
              {o.media && (
                <img
                  src={assetUrl(o.media.src)}
                  alt=""
                  className={cx('size-full', o.media.kind === 'flag' ? 'object-cover' : 'object-contain p-4 text-[#1a1916]')}
                  draggable={false}
                />
              )}
              <span className="absolute top-1.5 left-1.5 grid size-6 place-items-center rounded-lg bg-black/55 text-xs font-bold text-white">
                {LETTERS[o.id]}
              </span>
              {st === 'correct' && <ResultBadge ok />}
              {st === 'wrong' && <ResultBadge ok={false} />}
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-2.5">
      {visible.map((o, i) => {
        const st = stateOf(o, question, chosen, revealed)
        return (
          <motion.button
            key={o.id}
            type="button"
            disabled={revealed}
            onClick={() => choose(o.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: st === 'dim' ? 0.45 : 1, y: 0 }}
            transition={{ delay: revealed ? 0 : i * 0.05, type: 'spring', stiffness: 420, damping: 30 }}
            className={cx(
              'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left text-base font-semibold transition-colors',
              st === 'idle' && 'border-line bg-elev shadow-[0_3px_0_var(--surface-2)] hover:border-primary-2 active:translate-y-[3px] active:shadow-none',
              st === 'correct' && 'border-ok bg-ok text-white shadow-[0_3px_0_var(--ok-press)]',
              st === 'wrong' && 'animate-shake border-bad bg-bad text-white shadow-[0_3px_0_var(--bad-press)]',
              st === 'dim' && 'border-line bg-elev',
            )}
          >
            <span
              className={cx(
                'grid size-8 shrink-0 place-items-center rounded-xl text-sm font-extrabold',
                st === 'idle' || st === 'dim' ? 'bg-surface text-muted' : 'bg-white/25 text-white',
              )}
              aria-hidden="true"
            >
              {st === 'correct' ? <Check className="size-5" strokeWidth={3} /> : st === 'wrong' ? <X className="size-5" strokeWidth={3} /> : LETTERS[o.id]}
            </span>
            <span className="flex-1 leading-snug">{o.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

function ResultBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={cx(
        'absolute right-1.5 bottom-1.5 grid size-8 place-items-center rounded-full text-white shadow-lg',
        ok ? 'bg-ok' : 'bg-bad',
      )}
    >
      {ok ? <Check className="size-5" strokeWidth={3} /> : <X className="size-5" strokeWidth={3} />}
    </span>
  )
}
