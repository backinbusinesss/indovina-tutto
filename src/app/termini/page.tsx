import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, OWNER } from '@/landing/LegalPage'

export const metadata: Metadata = { title: 'Termini d’uso' }

export default function Termini() {
  return (
    <LegalPage title="Termini d’uso" updated="13 novembre 2026">
      <p>
        Indovina Tutto è un gioco di quiz gratuito, parte del marchio carlarcade, offerto da {OWNER} (di seguito «noi»). Usando il
        sito e l’app accetti questi termini.
      </p>
      <h2>1. Il servizio</h2>
      <p>
        Il gioco è gratuito e non richiede registrazione. Puoi giocare senza limiti di partite. Ci impegniamo a mantenerlo
        disponibile, ma possiamo modificarlo, sospenderlo o interromperlo in qualsiasi momento.
      </p>
      <h2>2. Gemme e negozio</h2>
      <ul>
        <li>Le gemme sono una moneta virtuale del gioco: non hanno valore economico, non si convertono in denaro e non si trasferiscono.</li>
        <li>
          Il negozio è attualmente in <strong>modalità demo</strong>: nessun acquisto comporta un addebito. Se in futuro attiveremo
          pagamenti reali, li regoleremo con apposite condizioni di vendita, pubblicate prima dell’attivazione.
        </li>
        <li>I video premiati sono al momento dimostrativi e non contengono pubblicità.</li>
      </ul>
      <h2>3. Progressi</h2>
      <p>
        Gemme, record e impostazioni sono salvati solo nel browser del tuo dispositivo. Se cancelli i dati del browser o cambi
        dispositivo, i progressi vanno persi e non possiamo recuperarli.
      </p>
      <h2>4. Contenuti</h2>
      <p>
        Le domande sono scritte e verificate con cura, ma possono contenere imprecisioni: il gioco ha scopo di intrattenimento. Se
        trovi un errore scrivici a <a href="mailto:admin@carlhost.com">admin@carlhost.com</a>. Marchi e loghi citati appartengono ai
        rispettivi proprietari (vedi <Link href="/crediti/">Crediti e marchi</Link>).
      </p>
      <h2>5. Uso corretto</h2>
      <p>Non è consentito usare il gioco in modo da danneggiarne il funzionamento o copiarne in blocco i contenuti per altri servizi.</p>
      <h2>6. Responsabilità</h2>
      <p>
        Il gioco è fornito «così com’è». Nei limiti di legge non rispondiamo di danni derivanti dall’uso o dall’impossibilità di
        usarlo. Restano salvi i diritti del consumatore previsti dalla legge italiana.
      </p>
      <h2>7. Legge applicabile</h2>
      <p>Questi termini sono regolati dalla legge italiana. Possiamo aggiornarli: la data in alto indica l’ultima versione.</p>
    </LegalPage>
  )
}
