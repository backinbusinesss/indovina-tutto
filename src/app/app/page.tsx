'use client'

import { GameButton } from '@/ui/GameButton'

export default function AppHome() {
  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-3xl font-extrabold">Ciao!</h1>
      <div className="card p-5">Home in costruzione</div>
      <GameButton block size="lg">Gioca Mix Tutto</GameButton>
      <GameButton block variant="secondary">Secondario</GameButton>
      <GameButton block variant="gem">Gemme</GameButton>
    </div>
  )
}
