'use client'

import { motion } from 'motion/react'
import type { Question } from '@/engine/types'
import { assetUrl } from '@/lib/asset'
import { cx } from '@/lib/cx'
import { CategoryTile, sourceMeta } from '../CategoryIcon'

function Media({ question }: { question: Question }) {
  const m = question.media
  if (!m) return null
  const src = assetUrl(m.src)
  if (m.kind === 'flag') {
    return (
      <img
        src={src}
        alt={m.alt}
        draggable={false}
        className="mx-auto aspect-[4/3] w-full max-w-[15rem] rounded-2xl object-cover shadow-[0_14px_30px_-10px_rgba(0,0,0,0.55)] ring-1 ring-black/10"
      />
    )
  }
  if (m.kind === 'logo') {
    return (
      <div className="mx-auto grid size-40 place-items-center rounded-3xl bg-tile p-7 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)]">
        <img src={src} alt={m.alt} draggable={false} className="size-full object-contain" />
      </div>
    )
  }
  // sagoma: un'immagine usata come maschera, colorata col colore della categoria
  const { color } = sourceMeta(question.category)
  return (
    <div className="mx-auto grid size-48 place-items-center rounded-3xl bg-surface/70 ring-1 ring-line">
      <div
        role="img"
        aria-label={m.alt}
        className="size-40"
        style={{
          background: `linear-gradient(160deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))`,
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
    </div>
  )
}

export function QuestionCard({ question }: { question: Question }) {
  const { name } = sourceMeta(question.category)
  return (
    <motion.section
      key={`${question.defId}-${question.options.map((o) => o.label).join()}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      className="flex flex-col gap-4"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-elev py-1 pr-3 pl-1 text-xs font-bold ring-1 ring-line">
          <CategoryTile source={question.category} className="size-6 rounded-full" iconClass="size-3.5" />
          {name}
        </span>
        <span className="flex gap-1" aria-label={`Difficoltà ${question.difficulty} su 3`} title="Difficoltà">
          {[1, 2, 3].map((d) => (
            <span key={d} className={cx('h-1.5 w-4 rounded-full', d <= question.difficulty ? 'bg-primary-2' : 'bg-surface')} />
          ))}
        </span>
      </div>
      <Media question={question} />
      <h1 className="text-center font-display text-[1.45rem] leading-tight font-extrabold text-balance">{question.prompt}</h1>
    </motion.section>
  )
}
