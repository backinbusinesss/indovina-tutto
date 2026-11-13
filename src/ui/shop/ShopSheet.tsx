'use client'

import { Sheet } from '../Overlay'

/** Negozio sopra la partita (il contenuto vero arriva con il negozio). */
export function ShopSheet({ open, onClose }: { open: boolean; onClose(): void }) {
  return (
    <Sheet open={open} title="Negozio" onClose={onClose}>
      <p className="py-8 text-center text-muted">Negozio in arrivo</p>
    </Sheet>
  )
}
