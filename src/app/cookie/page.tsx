import type { Metadata } from 'next'
import { LegalPage } from '@/landing/LegalPage'

export const metadata: Metadata = { title: 'Cookie' }

export default function Cookie() {
  return (
    <LegalPage title="Cookie" updated="13 novembre 2026">
      <p>
        Indovina Tutto <strong>non usa cookie</strong>: né tecnici, né di analisi, né di profilazione. Per questo non ti mostriamo
        nessun banner.
      </p>
      <h2>Memoria locale del browser</h2>
      <p>
        Per ricordare gemme, record e impostazioni usiamo il «localStorage» del browser, e una cache (service worker) che permette
        di giocare offline. Sono strumenti strettamente necessari al funzionamento del gioco che hai scelto di usare, restano sul tuo
        dispositivo e non servono a tracciarti.
      </p>
      <h2>Come eliminarli</h2>
      <p>Dall’app (Profilo → «Azzera i progressi») oppure cancellando i dati del sito dalle impostazioni del browser.</p>
    </LegalPage>
  )
}
