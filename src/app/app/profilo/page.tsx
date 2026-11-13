'use client'

import { LevelBadge, QuickStats, ResetProgress, SettingsList, StatsTable } from '@/ui/profile'

export default function ProfilePage() {
  return (
    <div className="space-y-5 pt-1">
      <h1 className="text-3xl font-extrabold">Profilo</h1>
      <LevelBadge />
      <QuickStats />
      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="mb-2 text-lg font-extrabold">
          Record per categoria
        </h2>
        <StatsTable />
      </section>
      <section aria-labelledby="settings-title">
        <h2 id="settings-title" className="mb-2 text-lg font-extrabold">
          Impostazioni
        </h2>
        <SettingsList />
      </section>
      <ResetProgress />
      <p className="pb-2 text-center text-xs text-muted">
        Indovina Tutto · un gioco carlarcade
        <br />I marchi appartengono ai rispettivi proprietari.
      </p>
    </div>
  )
}
