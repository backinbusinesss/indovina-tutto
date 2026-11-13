'use client'

import { assetUrl } from './asset'

/** Indirizzo pubblico del sito, per i testi da condividere. */
export function siteUrl(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${assetUrl('')}`
}

/** Usa il pulsante Condividi del telefono se c'è, altrimenti copia il testo. */
export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ text })
      return 'shared'
    }
  } catch (e) {
    if ((e as DOMException)?.name === 'AbortError') return 'failed'
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
