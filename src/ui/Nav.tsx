'use client'

import { Gamepad2, ShoppingBag, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from '@/lib/cx'
import { useProfile } from '@/store/profile'
import { useHydrated } from '@/store/useHydrated'
import { DayStreak, GemCounter } from './counters'
import { Logo } from './Logo'

export const normalizePath = (p: string | null) => (p ?? '/').replace(/\/+$/, '') || '/'

export function TopBar() {
  const gems = useProfile((s) => s.gems)
  const dayStreak = useProfile((s) => s.dayStreak)
  // finché il salvataggio non è stato letto, i numeri sarebbero quelli di partenza: meglio non mostrarli
  const hydrated = useHydrated()
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-2 flex items-center justify-between bg-gradient-to-b from-bg via-bg/90 to-transparent px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <Link href="/app/" aria-label="Indovina Tutto, home dell'app">
        <Logo />
      </Link>
      <div className={cx('flex items-center gap-2 transition-opacity', hydrated ? 'opacity-100' : 'opacity-0')}>
        <DayStreak value={dayStreak} />
        <GemCounter value={gems} href="/app/negozio/" />
      </div>
    </header>
  )
}

const ITEMS = [
  { href: '/app/', path: '/app', label: 'Gioca', Icon: Gamepad2 },
  { href: '/app/negozio/', path: '/app/negozio', label: 'Negozio', Icon: ShoppingBag },
  { href: '/app/profilo/', path: '/app/profilo', label: 'Profilo', Icon: UserRound },
]

export function BottomNav() {
  const path = normalizePath(usePathname())
  return (
    <nav
      aria-label="Menu principale"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line bg-bg/85 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl"
    >
      <ul className="grid grid-cols-3">
        {ITEMS.map(({ href, path: p, label, Icon }) => {
          const active = path === p
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex flex-col items-center gap-1 py-2 text-xs font-semibold transition-colors',
                  active ? 'text-primary-2' : 'text-muted hover:text-ink',
                )}
              >
                <span className={cx('grid h-8 w-14 place-items-center rounded-full transition-colors', active && 'bg-primary/15')}>
                  <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
