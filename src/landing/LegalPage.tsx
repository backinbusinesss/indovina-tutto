import type { ReactNode } from 'react'
import { Container, Footer, LandingNav } from './sections'

/** Impaginazione comune dei documenti (termini, privacy, cookie, crediti). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <LandingNav />
      <main className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p className="font-hand text-2xl text-primary-2">documenti</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">Ultimo aggiornamento: {updated}</p>
          <div className="legal mt-10 space-y-5 text-[17px] leading-relaxed text-ink/90 [&_a]:font-semibold [&_a]:text-primary-2 [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export const OWNER = (
  <>
    <strong>CarlHost di Ulivi Nicolò</strong>, Via Ventisette Novembre 1, Parabiago (MI), P.IVA IT14943820960, email e PEC{' '}
    <a href="mailto:admin@carlhost.com">admin@carlhost.com</a>
  </>
)
