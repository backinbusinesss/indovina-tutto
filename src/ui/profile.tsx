'use client'

import { Monitor, Moon, RotateCcw, Sun, Timer, Vibrate, Volume2 } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { CATEGORIES } from '@/content/categories'
import { levelFromXp, type Settings } from '@/engine/progress'
import type { Source } from '@/engine/types'
import { cx } from '@/lib/cx'
import { useProfile } from '@/store/profile'
import { CategoryTile, sourceMeta } from './CategoryIcon'
import { GameButton } from './GameButton'
import { FlameIcon } from './icons'
import { Modal } from './Overlay'

export function LevelBadge() {
  const xp = useProfile((s) => s.xp)
  const { level, into, needed } = levelFromXp(xp)
  const pct = Math.round((into / needed) * 100)
  return (
    <div className="card flex items-center gap-4 p-4">
      <div
        className="grid size-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-extrabold text-white"
        style={{ background: 'linear-gradient(145deg, #8B6CFF, #5B3FE0)', boxShadow: '0 8px 22px -8px #7C5CFF' }}
        aria-hidden="true"
      >
        {level}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold tracking-widest text-muted uppercase">Livello</p>
        <p className="font-display text-xl font-extrabold">Livello {level}</p>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface"
          role="progressbar"
          aria-valuenow={into}
          aria-valuemin={0}
          aria-valuemax={needed}
          aria-label="Esperienza verso il prossimo livello"
        >
          <div className="h-full rounded-full bg-gradient-to-r from-primary-2 to-primary transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted">
          {into}/{needed} punti per il livello {level + 1}
        </p>
      </div>
    </div>
  )
}

export function QuickStats() {
  const dayStreak = useProfile((s) => s.dayStreak)
  const stats = useProfile((s) => s.stats)
  const all = Object.values(stats)
  const correct = all.reduce((n, s) => n + (s?.correct ?? 0), 0)
  const best = Math.max(0, ...all.map((s) => s?.best ?? 0))
  const items = [
    { label: 'Giorni di fila', value: dayStreak },
    { label: 'Risposte giuste', value: correct.toLocaleString('it-IT') },
    { label: 'Streak migliore', value: best },
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((i) => (
        <div key={i.label} className="card p-3 text-center">
          <p className="font-display text-2xl font-extrabold tabular-nums">{i.value}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-muted">{i.label}</p>
        </div>
      ))}
    </div>
  )
}

export function StatsTable() {
  const stats = useProfile((s) => s.stats)
  const rows: Source[] = ['mix', ...CATEGORIES.map((c) => c.id)]
  return (
    <ul className="card divide-y divide-line">
      {rows.map((id) => {
        const s = stats[id]
        const pct = s && s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : null
        return (
          <li key={id} className="flex items-center gap-3 px-4 py-3">
            <CategoryTile source={id} className="size-9 rounded-xl" iconClass="size-4.5" />
            <span className="flex-1 truncate font-semibold">{sourceMeta(id).name}</span>
            <span className="w-14 text-right text-sm text-muted tabular-nums" title="Risposte giuste">
              {pct === null ? '—' : `${pct}%`}
            </span>
            <span
              className={cx('flex w-12 items-center justify-end gap-0.5 font-bold tabular-nums', s?.best ? 'text-fire' : 'text-muted')}
              title="Record"
            >
              <FlameIcon className="size-4" lit={!!s?.best} />
              {s?.best ?? 0}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange(v: boolean): void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-surface-2')}
    >
      <span className={cx('absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
    </button>
  )
}

function Row({ icon, title, hint, children }: { icon: ReactNode; title: string; hint?: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <span className="grid size-9 place-items-center rounded-xl bg-surface text-primary-2">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      {children}
    </li>
  )
}

const THEMES: { value: Settings['theme']; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'Auto', Icon: Monitor },
  { value: 'dark', label: 'Scuro', Icon: Moon },
  { value: 'light', label: 'Chiaro', Icon: Sun },
]

export function SettingsList() {
  const settings = useProfile((s) => s.settings)
  const update = useProfile((s) => s.updateSettings)
  return (
    <ul className="card divide-y divide-line">
      <Row icon={<Volume2 className="size-5" />} title="Suoni">
        <Switch label="Suoni" checked={settings.sound} onChange={(sound) => update({ sound })} />
      </Row>
      <Row icon={<Vibrate className="size-5" />} title="Vibrazione" hint="Sui telefoni che la supportano">
        <Switch label="Vibrazione" checked={settings.haptics} onChange={(haptics) => update({ haptics })} />
      </Row>
      <Row icon={<Timer className="size-5" />} title="Timer di 20 secondi" hint={settings.timer ? 'Attivo' : 'Modalità rilassata'}>
        <Switch label="Timer" checked={settings.timer} onChange={(timer) => update({ timer })} />
      </Row>
      <li className="px-4 py-3.5">
        <p className="mb-2 font-semibold">Tema</p>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1" role="radiogroup" aria-label="Tema">
          {THEMES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={settings.theme === value}
              onClick={() => update({ theme: value })}
              className={cx(
                'flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition-colors',
                settings.theme === value ? 'bg-elev text-ink shadow' : 'text-muted',
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </li>
    </ul>
  )
}

export function ResetProgress() {
  const [open, setOpen] = useState(false)
  const reset = useProfile((s) => s.reset)
  return (
    <>
      <GameButton variant="ghost" block onClick={() => setOpen(true)} className="text-bad">
        <RotateCcw className="size-4" /> Azzera i progressi
      </GameButton>
      <Modal open={open} title="Azzerare i progressi?" onClose={() => setOpen(false)}>
        <h2 className="text-center font-display text-xl font-extrabold">Azzerare i progressi?</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Perderai gemme, record, livello e giorni di fila. Non si può annullare.
        </p>
        <div className="mt-5 grid gap-3">
          <GameButton
            variant="primary"
            className="[--btn-bg:var(--bad)] [--btn-press:var(--bad-press)]"
            onClick={() => {
              reset()
              setOpen(false)
            }}
          >
            Sì, azzera tutto
          </GameButton>
          <GameButton variant="secondary" onClick={() => setOpen(false)}>
            Annulla
          </GameButton>
        </div>
      </Modal>
    </>
  )
}
