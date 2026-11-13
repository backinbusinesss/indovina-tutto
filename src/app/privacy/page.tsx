import type { Metadata } from 'next'
import { LegalPage, OWNER } from '@/landing/LegalPage'

export const metadata: Metadata = { title: 'Privacy' }

export default function Privacy() {
  return (
    <LegalPage title="Informativa sulla privacy" updated="13 novembre 2026">
      <p>
        In breve: <strong>Indovina Tutto non ti chiede dati personali</strong>. Non ci sono account, email, moduli o profilazione.
      </p>
      <h2>Titolare del trattamento</h2>
      <p>{OWNER}.</p>
      <h2>Quali dati e dove</h2>
      <ul>
        <li>
          <strong>Progressi di gioco</strong> (gemme, record, impostazioni, risultati della sfida del giorno): restano nel
          «localStorage» del tuo browser, sul tuo dispositivo. Non li riceviamo e non li vediamo.
        </li>
        <li>
          <strong>Dati tecnici di navigazione</strong>: il sito è ospitato su GitHub Pages (GitHub, Inc.), che per ragioni di
          sicurezza e funzionamento può registrare dati come l’indirizzo IP. Base giuridica: legittimo interesse a erogare il sito
          in sicurezza. Per i dettagli vedi l’informativa di GitHub.
        </li>
      </ul>
      <h2>Cosa non facciamo</h2>
      <ul>
        <li>Non usiamo cookie di profilazione né strumenti di analisi o pubblicità.</li>
        <li>Non vendiamo né cediamo dati a terzi.</li>
      </ul>
      <h2>Come cancellare i tuoi dati</h2>
      <p>
        Dall’app: Profilo → «Azzera i progressi». In alternativa cancella i dati del sito dalle impostazioni del browser.
      </p>
      <h2>I tuoi diritti</h2>
      <p>
        Puoi esercitare i diritti previsti dal GDPR (accesso, rettifica, cancellazione, opposizione…) scrivendo a{' '}
        <a href="mailto:admin@carlhost.com">admin@carlhost.com</a>, e proporre reclamo al Garante per la protezione dei dati
        personali.
      </p>
    </LegalPage>
  )
}
