'use client'

import { Clapperboard, Info } from 'lucide-react'
import { useRef, useState } from 'react'
import { dateKeyRome } from '@/engine/daily'
import { ECONOMY, GEM_PACKS, type GemPack } from '@/engine/economy'
import { cx } from '@/lib/cx'
import { useAds } from '@/providers/ads'
import { usePayments } from '@/providers/payments'
import { centerOf, useFx } from '@/store/fx'
import { useProfile } from '@/store/profile'
import { GameButton } from '../GameButton'
import { GemIcon } from '../icons'
import { formatPrice } from './format'

const TIER_GEMS = [1, 2, 3, 5]

function GemPackCard({ pack, tier, onBuy }: { pack: GemPack; tier: number; onBuy(el: HTMLElement): void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const featured = pack.badge === 'Il più scelto'
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ref.current && onBuy(ref.current)}
      className={cx(
        'card relative flex flex-col items-center gap-1 overflow-hidden px-3 pt-6 pb-3 text-center transition-transform active:scale-[0.97]',
        featured && 'ring-2 ring-gem',
      )}
      aria-label={`${pack.gems} gemme a ${formatPrice(pack.priceCents)}`}
    >
      {pack.badge && (
        <span
          className={cx(
            'absolute top-0 inset-x-0 py-0.5 text-[10px] font-extrabold tracking-wider uppercase',
            featured ? 'bg-gem text-[#3a2600]' : 'bg-primary text-white',
          )}
        >
          {pack.badge}
        </span>
      )}
      <span className="relative flex h-14 items-end justify-center" aria-hidden="true">
        {Array.from({ length: TIER_GEMS[tier] }, (_, i) => (
          <GemIcon
            key={i}
            className={cx('drop-shadow-[0_4px_10px_rgba(255,200,61,0.45)]', i === 0 ? 'size-11' : 'size-7 -ml-3')}
          />
        ))}
      </span>
      <span className="font-display text-2xl font-extrabold tabular-nums">{pack.gems.toLocaleString('it-IT')}</span>
      <span className="text-xs text-muted">gemme</span>
      <span className="btn-game btn-gem mt-2 h-9 w-full rounded-xl text-sm">{formatPrice(pack.priceCents)}</span>
    </button>
  )
}

/** Il negozio: usato nella pagina e nel pannello che si apre sopra la partita. */
export function Shop({ onPurchased }: { onPurchased?: () => void }) {
  const gems = useProfile((s) => s.gems)
  const shopVideos = useProfile((s) => s.shopVideos)
  const watchShopVideo = useProfile((s) => s.watchShopVideo)
  const { purchase } = usePayments()
  const { showRewarded } = useAds()
  const burst = useFx((s) => s.burst)
  const videoRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  const today = dateKeyRome(new Date())
  const watched = shopVideos.day === today ? shopVideos.count : 0
  const videosLeft = ECONOMY.shopVideosPerDay - watched

  const buy = async (pack: GemPack, el: HTMLElement) => {
    if (busy) return
    setBusy(true)
    const r = await purchase(pack.id)
    setBusy(false)
    if (r === 'success') {
      burst(12, centerOf(el))
      onPurchased?.()
    }
  }

  const video = async () => {
    if (busy || videosLeft <= 0) return
    setBusy(true)
    const r = await showRewarded('shop-gems')
    setBusy(false)
    if (r === 'rewarded' && watchShopVideo()) burst(ECONOMY.shopVideoReward, centerOf(videoRef.current))
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center gap-3 p-4">
        <GemIcon className="size-10" />
        <div className="flex-1">
          <p className="text-xs font-bold tracking-widest text-muted uppercase">Le tue gemme</p>
          <p className="font-display text-3xl font-extrabold text-gem-ink tabular-nums">{gems.toLocaleString('it-IT')}</p>
        </div>
      </div>

      <div ref={videoRef} className="card flex items-center gap-3 p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary-2">
          <Clapperboard className="size-6" />
        </span>
        <div className="flex-1">
          <p className="flex items-center gap-1 font-bold">
            Guarda un video: +{ECONOMY.shopVideoReward} <GemIcon className="size-4" />
          </p>
          <p className="text-xs text-muted">
            {videosLeft > 0 ? `${watched}/${ECONOMY.shopVideosPerDay} oggi` : 'Torna domani per altri video'}
          </p>
        </div>
        <GameButton size="sm" onClick={video} disabled={busy || videosLeft <= 0}>
          Guarda
        </GameButton>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GEM_PACKS.map((p, i) => (
          <GemPackCard key={p.id} pack={p} tier={i} onBuy={(el) => buy(p, el)} />
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-2xl bg-surface p-3 text-xs text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-primary-2" />
        <span>
          <strong className="text-ink">Modalità demo: nessun addebito.</strong> Le gemme si guadagnano anche giocando: ogni{' '}
          {ECONOMY.gemEveryStreak} risposte giuste di fila, con i record, il premio giornaliero e la sfida del giorno.
        </span>
      </p>
    </div>
  )
}
