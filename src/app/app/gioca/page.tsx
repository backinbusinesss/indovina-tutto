'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { isCategoryId } from '@/content/categories'
import type { Level, Source } from '@/engine/types'
import { PlayScreen } from '@/ui/play/PlayScreen'
import { ShopSheet } from '@/ui/shop/ShopSheet'

function Game() {
  const params = useSearchParams()
  const c = params.get('c') ?? 'mix'
  const source: Source = c === 'mix' || isCategoryId(c) ? c : 'mix'
  const l = Number(params.get('l'))
  const level: Level = l === 1 || l === 2 || l === 3 ? l : 'auto'
  return <PlayScreen key={source + level} source={source} level={level} renderShop={(p) => <ShopSheet {...p} />} />
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="skeleton mt-6 h-96" aria-busy="true" />}>
      <Game />
    </Suspense>
  )
}
