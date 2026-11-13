'use client'

import { Clapperboard } from 'lucide-react'
import { ECONOMY } from '@/engine/economy'
import { useCountdown } from '@/lib/countdown'
import { cx } from '@/lib/cx'
import { StreakFlame } from '../counters'
import { GameButton } from '../GameButton'
import { GemIcon } from '../icons'
import { Modal } from '../Overlay'

export interface SaveStreakModalProps {
  open: boolean
  streak: number
  /** costo in gemme di questo salvataggio */
  cost: number
  canVideo: boolean
  gems: number
  /** fermo mentre il video o il negozio sono aperti */
  paused: boolean
  onVideo(): void
  /** se le gemme non bastano, chi usa il componente apre il negozio */
  onGems(): void
  onDecline(): void
}

const TOTAL = ECONOMY.saveCountdownSec * 1000

function Countdown({ paused, onEnd }: { paused: boolean; onEnd(): void }) {
  const fraction = useCountdown(TOTAL, { onEnd, paused })
  const seconds = Math.ceil(fraction * ECONOMY.saveCountdownSec)
  return (
    <div className="mt-5 flex items-center gap-3" aria-label={`${seconds} secondi per decidere`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
        <div
          className={cx('h-full rounded-full transition-[width] duration-100 ease-linear', seconds <= 3 ? 'bg-bad' : 'bg-fire')}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span className="w-7 text-right text-sm font-bold text-muted tabular-nums">{seconds}s</span>
    </div>
  )
}

/** "Salva la streak!": video gratis una volta per partita, oppure gemme. */
export function SaveStreakModal({ open, streak, cost, canVideo, gems, paused, onVideo, onGems, onDecline }: SaveStreakModalProps) {
  const missing = Math.max(0, cost - gems)
  return (
    <Modal open={open} title="Salva la streak!">
      <div className="flex flex-col items-center text-center">
        <div className="mb-1 scale-150 py-3">
          <StreakFlame value={streak} />
        </div>
        <h2 className="mt-2 font-display text-2xl font-extrabold">Salva la streak!</h2>
        <p className="mt-1 text-sm text-muted">Hai sbagliato, ma puoi continuare senza perdere le tue risposte di fila.</p>
      </div>

      <div className="mt-5 grid gap-3">
        <GameButton variant="primary" size="lg" block disabled={!canVideo} onClick={onVideo} aria-label="Guarda un video, gratis">
          <Clapperboard className="size-5" />
          Guarda un video
          <span className="ml-1 rounded-md bg-white/25 px-1.5 py-0.5 text-xs font-extrabold tracking-wide">
            {canVideo ? 'GRATIS' : 'GIÀ USATO'}
          </span>
        </GameButton>
        <GameButton variant="gem" size="lg" block onClick={onGems} aria-label={`Usa ${cost} gemme`}>
          <GemIcon className="size-5" />
          Usa {cost} gemme
        </GameButton>
        {missing > 0 && (
          <p className="-mt-1 text-center text-xs text-muted">
            Te ne mancano {missing}: puoi prenderle nel negozio senza perdere la partita.
          </p>
        )}
        <GameButton variant="ghost" block onClick={onDecline}>
          Lascia perdere
        </GameButton>
      </div>

      {open && <Countdown paused={paused} onEnd={onDecline} />}
    </Modal>
  )
}
