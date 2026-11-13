'use client'

import { Sheet } from '../Overlay'
import { Shop } from './Shop'

/** Negozio sopra la partita: dopo un acquisto si chiude e si torna a "Salva la streak!". */
export function ShopSheet({ open, onClose }: { open: boolean; onClose(): void }) {
  return (
    <Sheet open={open} title="Ti servono gemme" onClose={onClose}>
      <Shop onPurchased={onClose} />
    </Sheet>
  )
}
