import type { Metadata } from 'next'
import { LegalPage } from '@/landing/LegalPage'

export const metadata: Metadata = { title: 'Crediti e marchi' }

export default function Crediti() {
  return (
    <LegalPage title="Crediti e marchi" updated="13 novembre 2026">
      <h2>Marchi</h2>
      <p>
        I marchi e i loghi mostrati nella categoria «Loghi» appartengono ai rispettivi proprietari e sono usati al solo scopo di
        riconoscerli nel quiz. Indovina Tutto non è affiliato né sponsorizzato da nessuno di essi. Se sei titolare di un marchio e
        preferisci che non compaia, scrivici a <a href="mailto:admin@carlhost.com">admin@carlhost.com</a> e lo togliamo.
      </p>
      <h2>Immagini e dati</h2>
      <ul>
        <li>Bandiere: <a href="https://github.com/lipis/flag-icons">flag-icons</a>, licenza MIT.</li>
        <li>Loghi: <a href="https://simpleicons.org">Simple Icons</a>, licenza CC0.</li>
        <li>Sagome dei paesi: <a href="https://github.com/topojson/world-atlas">world-atlas</a> (dati Natural Earth, pubblico dominio).</li>
        <li>Icone dell’interfaccia: <a href="https://lucide.dev">Lucide</a>, licenza ISC.</li>
        <li>Caratteri: Bricolage Grotesque, Inter e Caveat, licenza SIL Open Font.</li>
      </ul>
    </LegalPage>
  )
}
