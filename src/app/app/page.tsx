'use client'

import { CATEGORIES } from '@/content/categories'
import { CategoryCard, DailyChallengeCard, DailyChest, MixButton } from '@/ui/home'
import { InstallHint } from '@/ui/InstallHint'

export default function AppHome() {
  return (
    <div className="space-y-4 pt-1">
      <p className="eyebrow">pronto a giocare?</p>
      <DailyChest />
      <DailyChallengeCard />
      <MixButton />
      <InstallHint />
      <section aria-labelledby="cat-title" className="pt-2">
        <h2 id="cat-title" className="mb-3 text-xl font-extrabold">
          Categorie
        </h2>
        <ul className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <CategoryCard category={c} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
