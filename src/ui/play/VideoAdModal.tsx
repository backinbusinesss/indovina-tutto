'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ECONOMY } from '@/engine/economy'
import { useCountdown } from '@/lib/countdown'
import type { AdModalProps } from '@/providers/ads'
import { GameButton } from '../GameButton'
import { LogoMark } from '../Logo'

const TOTAL = ECONOMY.videoAdSec * 1000
const R = 44
const CIRC = 2 * Math.PI * R

/**
 * Video premiato DEMO: 15 secondi da guardare fino in fondo.
 * Al suo posto arriverà la pubblicità vera (AdSense per i giochi H5 / AdMob).
 */
export function VideoAdModal({ placement, onDone }: AdModalProps) {
  const [finished, setFinished] = useState(false)
  const fraction = useCountdown(TOTAL, { onEnd: () => setFinished(true) })
  const seconds = Math.ceil(fraction * ECONOMY.videoAdSec)

  if (typeof document === 'undefined') return null
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-[#05071a] px-6 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-label="Video premiato"
    >
      <motion.div
        className="pointer-events-none absolute -inset-1/2"
        style={{
          background:
            'radial-gradient(40rem 30rem at 20% 20%, rgba(71,87,236,0.45), transparent 60%), radial-gradient(40rem 30rem at 80% 80%, rgba(255,122,26,0.35), transparent 60%)',
        }}
        animate={{ rotate: [0, 8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      {!finished && (
        <button
          type="button"
          onClick={() => onDone('dismissed')}
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70"
        >
          Salta e rinuncia al premio
        </button>
      )}
      <p className="relative mb-6 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/70 uppercase">
        Spazio video — demo
      </p>
      <div className="relative grid size-40 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="url(#ad-ring)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * fraction}
          />
          <defs>
            <linearGradient id="ad-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFC83D" />
              <stop offset="1" stopColor="#FF7A1A" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <LogoMark className="size-20" />
        </motion.div>
      </div>
      <p className="relative mt-6 font-display text-2xl font-extrabold">
        {finished ? 'Premio sbloccato!' : `Ancora ${seconds} secondi`}
      </p>
      <p className="relative mt-2 max-w-xs text-sm text-white/70">
        Qui comparirà la pubblicità vera. Per ora goditi una pausa:{' '}
        {placement === 'save-streak' ? 'alla fine la tua streak è salva.' : 'alla fine ricevi 5 gemme.'}
      </p>
      <div className="relative mt-8 w-full max-w-xs">
        <GameButton variant="ok" size="lg" block disabled={!finished} onClick={() => onDone('rewarded')}>
          {finished ? 'Riscuoti il premio' : 'Attendi la fine del video'}
        </GameButton>
      </div>
    </motion.div>,
    document.body,
  )
}
