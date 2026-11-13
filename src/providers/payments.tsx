'use client'

import { type ComponentType, createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { GEM_PACKS, type GemPack, type PackId } from '@/engine/economy'
import { useProfile } from '@/store/profile'

export type PurchaseResult = 'success' | 'cancelled'

export interface PaymentsApi {
  purchase(packId: PackId): Promise<PurchaseResult>
}

export interface CheckoutProps {
  pack: GemPack
  onDone(result: PurchaseResult): void
}

const PaymentsContext = createContext<PaymentsApi | null>(null)

/**
 * Presa dei pagamenti. Oggi `Checkout` è il pagamento demo (nessun addebito);
 * domani la stessa interfaccia si collega a Stripe/PayPal sul web e agli acquisti
 * in-app di Google e Apple nella webview. Le gemme le aggiunge la presa, non la pagina.
 */
export function PaymentsProvider({ children, Checkout }: { children: ReactNode; Checkout: ComponentType<CheckoutProps> }) {
  const [pending, setPending] = useState<{ pack: GemPack; resolve(r: PurchaseResult): void } | null>(null)

  const purchase = useCallback((packId: PackId) => {
    const pack = GEM_PACKS.find((p) => p.id === packId)
    if (!pack) return Promise.resolve<PurchaseResult>('cancelled')
    return new Promise<PurchaseResult>((resolve) => setPending({ pack, resolve }))
  }, [])
  const api = useMemo(() => ({ purchase }), [purchase])

  return (
    <PaymentsContext.Provider value={api}>
      {children}
      {pending && (
        <Checkout
          pack={pending.pack}
          onDone={(r) => {
            if (r === 'success') useProfile.getState().addGems(pending.pack.gems)
            pending.resolve(r)
            setPending(null)
          }}
        />
      )}
    </PaymentsContext.Provider>
  )
}

export function usePayments(): PaymentsApi {
  const ctx = useContext(PaymentsContext)
  if (!ctx) throw new Error('usePayments va usato dentro PaymentsProvider')
  return ctx
}
