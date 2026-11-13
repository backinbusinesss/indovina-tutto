'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { isCategoryId } from '@/content/categories'
import type { Source } from '@/engine/types'
import { PlayScreen } from '@/ui/play/PlayScreen'
import { ShopSheet } from '@/ui/shop/ShopSheet'

function Game() {
  const c = useSearchParams().get('c') ?? 'mix'
  const source: Source = c === 'mix' || isCategoryId(c) ? c : 'mix'
  return <PlayScreen key={source} source={source} renderShop={(p) => <ShopSheet {...p} />} />
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-6 h-96" aria-busy="true" />}>
      <Game />
    </Suspense>
  )
}
