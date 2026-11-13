'use client'

import { Check, Info, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import type { CheckoutProps } from '@/providers/payments'
import { GameButton } from '../GameButton'
import { GemIcon } from '../icons'
import { Modal } from '../Overlay'
import { formatPrice } from './format'

/** Pagamento DEMO: sembra vero, ma non addebita nulla. */
export function CheckoutDemoModal({ pack, onDone }: CheckoutProps) {
  const [step, setStep] = useState<'review' | 'paying' | 'done'>('review')

  const confirm = () => {
    if (step !== 'review') return
    setStep('paying')
    setTimeout(() => {
      setStep('done')
      setTimeout(() => onDone('success'), 700)
    }, 1200)
  }

  return (
    <Modal open title="Conferma acquisto" onClose={step === 'review' ? () => onDone('cancelled') : undefined} z={70}>
      <div className="text-center">
        <p className="text-xs font-bold tracking-widest text-muted uppercase">Riepilogo</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <GemIcon className="size-9" />
          <span className="font-display text-4xl font-extrabold tabular-nums">{pack.gems.toLocaleString('it-IT')}</span>
        </div>
        <p className="mt-1 text-sm text-muted">gemme{pack.badge ? ` · ${pack.badge}` : ''}</p>
      </div>

      <dl className="mt-5 space-y-2 rounded-2xl bg-surface p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Prezzo</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(pack.priceCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Addebito</dt>
          <dd className="font-semibold text-ok">0,00 €</dd>
        </div>
      </dl>

      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-primary/12 p-3 text-xs text-ink ring-1 ring-primary/30">
        <Info className="mt-0.5 size-4 shrink-0 text-primary-2" />
        <span>
          <strong>Modalità demo: nessun addebito.</strong> I pagamenti veri arriveranno con la versione completa.
        </span>
      </p>

      <div className="mt-5 grid gap-3">
        <GameButton variant="gem" size="lg" block onClick={confirm} disabled={step !== 'review'}>
          {step === 'review' && 'Conferma acquisto'}
          {step === 'paying' && (
            <>
              <Loader2 className="size-5 animate-spin" /> Elaborazione…
            </>
          )}
          {step === 'done' && (
            <motion.span className="flex items-center gap-2" initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
              <Check className="size-5" strokeWidth={3} /> Fatto!
            </motion.span>
          )}
        </GameButton>
        {step === 'review' && (
          <GameButton variant="ghost" block onClick={() => onDone('cancelled')}>
            Annulla
          </GameButton>
        )}
      </div>
    </Modal>
  )
}
