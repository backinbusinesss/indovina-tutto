'use client'

import { useEffect, useState } from 'react'
import { useProfile } from './profile'

/** Vero dopo che il profilo salvato è stato letto: prima si mostra uno scheletro di caricamento. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (useProfile.persist.hasHydrated()) setHydrated(true)
    return useProfile.persist.onFinishHydration(() => setHydrated(true))
  }, [])
  return hydrated
}
