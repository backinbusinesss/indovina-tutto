'use client'

import { type ComponentType, createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

export type Placement = 'save-streak' | 'shop-gems'
export type AdResult = 'rewarded' | 'dismissed'

export interface AdsApi {
  /** Mostra un video premiato e dice se è stato guardato fino alla fine. */
  showRewarded(placement: Placement): Promise<AdResult>
}

export interface AdModalProps {
  placement: Placement
  onDone(result: AdResult): void
}

const AdsContext = createContext<AdsApi | null>(null)

/**
 * Presa dei video premiati. Oggi `Modal` è il video demo; domani la stessa interfaccia
 * si collega ad AdSense per i giochi H5 (web) o ad AdMob (webview).
 */
export function AdsProvider({ children, Modal }: { children: ReactNode; Modal: ComponentType<AdModalProps> }) {
  const [pending, setPending] = useState<{ placement: Placement; resolve(r: AdResult): void } | null>(null)

  const showRewarded = useCallback(
    (placement: Placement) => new Promise<AdResult>((resolve) => setPending({ placement, resolve })),
    [],
  )
  const api = useMemo(() => ({ showRewarded }), [showRewarded])

  return (
    <AdsContext.Provider value={api}>
      {children}
      {pending && (
        <Modal
          placement={pending.placement}
          onDone={(r) => {
            pending.resolve(r)
            setPending(null)
          }}
        />
      )}
    </AdsContext.Provider>
  )
}

export function useAds(): AdsApi {
  const ctx = useContext(AdsContext)
  if (!ctx) throw new Error('useAds va usato dentro AdsProvider')
  return ctx
}
