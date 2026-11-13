'use client'

import { Download, Plus, Share, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { safeStorage } from '@/lib/storage'
import { useProfile } from '@/store/profile'
import { GameButton } from './GameButton'
import { LogoMark } from './Logo'

const DISMISS_KEY = 'indovina-tutto:install-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
  })
}

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true)
const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

/** Invito a installare l'app: compare una volta, dopo la seconda partita, e si può chiudere. */
export function InstallHint() {
  const runs = useProfile((s) => Object.values(s.stats).reduce((n, x) => n + (x?.runs ?? 0), 0))
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'prompt' | 'ios' | null>(null)

  useEffect(() => {
    if (runs < 2 || isStandalone() || safeStorage.getItem(DISMISS_KEY)) return
    if (deferred) setMode('prompt')
    else if (isIos()) setMode('ios')
    else return
    setVisible(true)
  }, [runs])

  const dismiss = () => {
    safeStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  const install = async () => {
    if (!deferred) return dismiss()
    await deferred.prompt()
    await deferred.userChoice.catch(() => null)
    deferred = null
    dismiss()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="card relative flex gap-3 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, padding: 0 }}
          role="region"
          aria-label="Installa l'app"
        >
          <button type="button" onClick={dismiss} className="absolute top-3 right-3 text-muted hover:text-ink" aria-label="Chiudi">
            <X className="size-4" />
          </button>
          <LogoMark className="size-12 shrink-0" />
          <div className="flex-1 pr-4">
            <p className="font-display font-extrabold">Installa Indovina Tutto</p>
            {mode === 'ios' ? (
              <p className="mt-1 text-sm text-muted">
                Tocca <Share className="inline size-4 text-primary-2" /> Condividi e poi{' '}
                <Plus className="inline size-4 text-primary-2" /> «Aggiungi alla schermata Home». Funziona anche offline.
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted">Aprila con un tocco dalla schermata Home, anche senza connessione.</p>
                <GameButton size="sm" className="mt-3" onClick={install}>
                  <Download className="size-4" /> Installa
                </GameButton>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
