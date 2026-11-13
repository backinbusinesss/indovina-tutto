'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'
import { applyTheme } from '@/lib/theme'
import { useProfile } from '@/store/profile'
import { useHydrated } from '@/store/useHydrated'
import { GemBurstLayer } from './GemBurstLayer'
import { BottomNav, normalizePath, TopBar } from './Nav'

/** Schermate "a tutto schermo", senza barra in alto né menu: la partita e la sfida. */
const IMMERSIVE = ['/app/gioca', '/app/sfida']

export function AppShell({ children }: { children: ReactNode }) {
  const path = normalizePath(usePathname())
  const theme = useProfile((s) => s.settings.theme)
  const hydrated = useHydrated()
  const immersive = IMMERSIVE.includes(path)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
      {!immersive && <TopBar />}
      <main className={immersive ? 'flex flex-1 flex-col' : 'flex-1 pb-28'}>
        {hydrated ? children : <ShellSkeleton />}
      </main>
      {!immersive && <BottomNav />}
      <GemBurstLayer />
    </div>
  )
}

function ShellSkeleton() {
  return (
    <div className="space-y-4 pt-2" aria-busy="true" aria-label="Caricamento">
      <div className="skeleton h-28" />
      <div className="skeleton h-14" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
    </div>
  )
}
