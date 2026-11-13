'use client'

import { ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES } from '@/content/categories'
import { bankFor } from '@/engine/picker'
import { statsKey } from '@/engine/run'
import type { Level, Source } from '@/engine/types'
import { cx } from '@/lib/cx'
import { play } from '@/lib/sound'
import { useProfile } from '@/store/profile'
import { CategoryTile, sourceMeta } from './CategoryIcon'
import { FlameIcon } from './icons'
import { Sheet } from './Overlay'

export const LEVELS: { level: Level; name: string; hint: string; color: string }[] = [
  { level: 'auto', name: 'Progressivo', hint: 'Parte facile e sale con la streak', color: 'var(--primary)' },
  { level: 1, name: 'Facile', hint: 'Per scaldarsi', color: 'var(--ok)' },
  { level: 2, name: 'Medio', hint: 'Serve un po’ di memoria', color: '#E0A100' },
  { level: 3, name: 'Difficile', hint: 'Solo per veri esperti', color: 'var(--bad)' },
]

export const levelName = (level: Level) => LEVELS.find((l) => l.level === level)?.name ?? ''

function count(source: Source, level: Level): number {
  if (source === 'mix') return CATEGORIES.reduce((n, c) => n + bankFor(c.id, level).length, 0)
  return bankFor(source, level).length
}

function Bars({ level }: { level: Level }) {
  if (level === 'auto') return <TrendingUp className="size-5" strokeWidth={2.5} />
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((d) => (
        <span key={d} className={cx('w-1.5 rounded-sm bg-white', d <= level ? 'opacity-100' : 'opacity-30')} style={{ height: 6 + d * 4 }} />
      ))}
    </span>
  )
}

/** Scelta del livello prima di iniziare una partita. */
export function LevelSheet({ source, onClose }: { source: Source | null; onClose(): void }) {
  const stats = useProfile((s) => s.stats)
  const meta = source ? sourceMeta(source) : null
  return (
    <Sheet open={source !== null} onClose={onClose} title={meta ? `${meta.name}: scegli il livello` : undefined}>
      {source && (
        <>
          <div className="mb-4 flex justify-center">
            <CategoryTile source={source} className="size-14" iconClass="size-7" />
          </div>
          <ul className="grid gap-2.5">
            {LEVELS.map(({ level, name, hint, color }) => {
              const best = stats[statsKey(source, level)]?.best ?? 0
              return (
                <li key={String(level)}>
                  <Link
                    href={`/app/gioca/?c=${source}${level === 'auto' ? '' : `&l=${level}`}`}
                    onClick={() => play('tap')}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-elev p-3 shadow-[0_3px_0_var(--surface-2)] transition active:translate-y-[3px] active:shadow-none"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: color }}>
                      <Bars level={level} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-lg leading-tight font-extrabold">{name}</span>
                      <span className="block text-xs text-muted">
                        {hint} · {count(source, level).toLocaleString('it-IT')} domande
                      </span>
                    </span>
                    {best > 0 && (
                      <span className="flex items-center gap-0.5 text-sm font-bold text-fire" title="Record">
                        <FlameIcon className="size-4" /> {best}
                      </span>
                    )}
                    <ChevronRight className="size-5 text-muted" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Sheet>
  )
}
