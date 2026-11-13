'use client'

import { useEffect } from 'react'
import { assetUrl } from './asset'

/** Registra il service worker, solo nella build di produzione. */
export function registerSw() {
  if (process.env.NODE_ENV !== 'production') return
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  navigator.serviceWorker.register(assetUrl('sw.js'), { scope: assetUrl('') }).catch(() => {
    /* senza service worker il gioco funziona lo stesso, solo non offline */
  })
}

export function SwRegister() {
  useEffect(() => {
    if (document.readyState === 'complete') registerSw()
    else window.addEventListener('load', registerSw, { once: true })
  }, [])
  return null
}
