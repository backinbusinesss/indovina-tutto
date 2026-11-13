'use client'

import { Divide, SkipForward, Timer } from 'lucide-react'
import { ECONOMY } from '@/engine/economy'
import { cx } from '@/lib/cx'
import { GemIcon } from '../icons'

export function TimerBar({ fraction }: { fraction: number }) {
  const seconds = Math.ceil(fraction * ECONOMY.questionTimeSec)
  const urgent = fraction <= 0.25
  return (
    <div className="flex items-center gap-2" aria-label={`${seconds} secondi rimasti`}>
      <Timer className={cx('size-4', urgent ? 'text-bad' : 'text-muted')} />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
        <div
          className={cx(
            'h-full rounded-full transition-[width,background-color] duration-100 ease-linear',
            urgent ? 'bg-bad' : fraction <= 0.5 ? 'bg-fire' : 'bg-primary-2',
          )}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span className={cx('w-6 text-right text-xs font-bold tabular-nums', urgent ? 'text-bad' : 'text-muted')}>{seconds}</span>
    </div>
  )
}

function HintButton({
  icon,
  label,
  cost,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  cost: number
  disabled: boolean
  onClick(): void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${label}, costa ${cost} gemme`}
      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-elev text-sm font-bold shadow-[0_3px_0_var(--surface-2)] transition active:translate-y-[3px] active:shadow-none disabled:opacity-40"
    >
      {icon}
      {label}
      <span className="flex items-center gap-0.5 text-gem-ink">
        <GemIcon className="size-4" />
        {cost}
      </span>
    </button>
  )
}

export function HintBar({
  canFifty,
  canSkip,
  onFifty,
  onSkip,
}: {
  canFifty: boolean
  canSkip: boolean
  onFifty(): void
  onSkip(): void
}) {
  return (
    <div className="flex gap-3">
      <HintButton icon={<Divide className="size-4" />} label="50/50" cost={ECONOMY.fiftyFiftyCost} disabled={!canFifty} onClick={onFifty} />
      <HintButton icon={<SkipForward className="size-4" />} label="Salta" cost={ECONOMY.skipCost} disabled={!canSkip} onClick={onSkip} />
    </div>
  )
}
