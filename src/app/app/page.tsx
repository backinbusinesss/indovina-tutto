'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/content/categories'
import type { Source } from '@/engine/types'
import { CategoryCard, DailyChallengeCard, DailyChest, MixButton } from '@/ui/home'
import { InstallHint } from '@/ui/InstallHint'
import { LevelSheet } from '@/ui/LevelSheet'

export default function AppHome() {
  const [picked, setPicked] = useState<Source | null>(null)
  return (
    <div className="space-y-4 pt-1">
      <DailyChest />
      <DailyChallengeCard />
      <MixButton onPick={setPicked} />
      <InstallHint />
      <section aria-labelledby="cat-title" className="pt-2">
        <h2 id="cat-title" className="mb-3 text-xl font-extrabold">
          Categorie <span className="text-sm font-semibold text-muted">· {CATEGORIES.length}</span>
        </h2>
        <ul className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <CategoryCard category={c} onPick={setPicked} />
            </li>
          ))}
        </ul>
      </section>
      <LevelSheet source={picked} onClose={() => setPicked(null)} />
    </div>
  )
}
