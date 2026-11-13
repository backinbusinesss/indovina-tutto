import { Apple, Check, Clapperboard, Plus, Share, Smartphone, Sparkles, Sun, Target, WifiOff } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CATEGORIES } from '@/content/categories'
import { getAllDefs, getBank } from '@/engine/bank'
import { ECONOMY } from '@/engine/economy'
import { CategoryTile } from '@/ui/CategoryIcon'
import { FlameIcon, GemIcon } from '@/ui/icons'
import { Logo } from '@/ui/Logo'
import { DemoQuestion } from './DemoQuestion'

const fmt = (n: number) => n.toLocaleString('it-IT')
/** numero arrotondato per difetto alle centinaia, per i titoli ("oltre 1.900") */
const roundDown = (n: number) => Math.floor(n / 100) * 100

function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
}

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold tracking-[0.2em] text-primary-2 uppercase">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-extrabold text-balance sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </div>
  )
}

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Indovina Tutto, home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex" aria-label="Sezioni">
          <a href="#categorie" className="hover:text-ink">Categorie</a>
          <a href="#come-funziona" className="hover:text-ink">Come funziona</a>
          <a href="#gemme" className="hover:text-ink">Gemme</a>
          <a href="#domande" className="hover:text-ink">Domande</a>
        </nav>
        <Link href="/app/" className="btn-game btn-primary h-10 px-4 text-sm">
          Gioca gratis
        </Link>
      </Container>
    </header>
  )
}

export function Hero() {
  const total = roundDown(getAllDefs().length)
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-12 pt-12 pb-16 lg:grid-cols-[1.15fr_1fr] lg:pt-20 lg:pb-24">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elev/70 px-3 py-1 text-xs font-bold text-muted">
            <Sparkles className="size-3.5 text-gem" /> Un gioco carlarcade
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Quanto ne sai,{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-primary-2 via-[#FF8FB1] to-gem bg-clip-text text-transparent">davvero</span>
            </span>
            ?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted lg:mx-0">
            Bandiere, capitali, sagome dei paesi, loghi, fiumi, monti e molto altro. Oltre {fmt(total)} domande in{' '}
            {CATEGORIES.length} categorie: allunga la tua streak e non fermarti.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/app/" className="btn-game btn-primary h-14 w-full px-8 text-lg sm:w-auto">
              Gioca gratis
            </Link>
            <Link href="/app/sfida/" className="btn-game btn-secondary h-14 w-full px-6 text-base sm:w-auto">
              <Sun className="size-5 text-gem" /> Sfida del giorno
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted lg:justify-start">
            {['Gratis, senza registrazione', 'Funziona anche offline', "Si installa come un'app"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-ok" strokeWidth={3} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <DemoQuestion />
      </Container>
    </section>
  )
}

export function CategoryShowcase() {
  return (
    <section id="categorie" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow={`${CATEGORIES.length} categorie`} title="Indovina davvero tutto">
          Dal tricolore al Kilimangiaro, dal logo della Ferrari alla sagoma del Cile.
        </SectionTitle>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/app/gioca/?c=${c.id}`}
                className="card group flex h-full flex-col gap-3 p-4 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <CategoryTile source={c.id} />
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted tabular-nums">
                    {fmt(getBank(c.id).length)} domande
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg leading-tight font-extrabold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">{c.example}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    { Icon: Target, title: 'Rispondi', text: 'Quattro risposte, una sola giusta. Hai 20 secondi: pensaci, ma non troppo.', color: '#7C5CFF' },
    { Icon: () => <FlameIcon className="size-7" />, title: 'Allunga la streak', text: 'Ogni risposta giusta fa crescere la fiamma. Più vai avanti, più le domande si fanno difficili.', color: '#FF7A1A' },
    { Icon: Clapperboard, title: 'Salvala quando sbagli', text: 'Un errore non è la fine: guarda un video o usa le gemme e riparti da dove eri.', color: '#2ED47A' },
  ]
  return (
    <section id="come-funziona" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow="Come funziona" title="Una regola sola: non fermarti" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ Icon, title, text, color }, i) => (
            <li key={title} className="card relative overflow-hidden p-6">
              <span className="absolute top-4 right-5 font-display text-6xl font-extrabold text-surface-2" aria-hidden="true">
                {i + 1}
              </span>
              <span className="relative grid size-14 place-items-center rounded-2xl text-white" style={{ background: color, boxShadow: `0 10px 24px -10px ${color}` }}>
                <Icon className="size-7" />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-extrabold">{title}</h3>
              <p className="relative mt-2 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

export function DailyTeaser() {
  const squares = [true, true, false, true, true, true, true, false, true, true]
  return (
    <section className="py-8">
      <Container>
        <div
          className="relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12"
          style={{ background: 'linear-gradient(135deg, #8B6CFF 0%, #5B3FE0 50%, #2F2A8F 100%)' }}
        >
          <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                <Sun className="size-4 text-[#FFE08A]" /> Sfida del giorno
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">10 domande, uguali per tutti, ogni giorno.</h2>
              <p className="mt-3 max-w-lg text-white/80">
                Una sola possibilità al giorno, dalla più facile alla più difficile. Poi confronta il punteggio con gli amici: si
                condivide con un tocco, senza svelare le risposte.
              </p>
              <Link href="/app/sfida/" className="btn-game btn-gem mt-6 h-12 px-6">
                Gioca la sfida di oggi
              </Link>
            </div>
            <div className="rounded-3xl bg-black/20 p-5 ring-1 ring-white/15 backdrop-blur">
              <p className="text-sm font-semibold text-white/80">Indovina Tutto — Sfida del giorno</p>
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Esempio di risultato: 8 su 10">
                {squares.map((ok, i) => (
                  <span key={i} className={`size-7 rounded-lg ${ok ? 'bg-ok' : 'bg-bad'}`} />
                ))}
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold">8/10</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function GemsExplainer() {
  const earn = [
    ['Regalo di benvenuto', `${ECONOMY.welcomeGems}`],
    [`Ogni ${ECONOMY.gemEveryStreak} risposte giuste di fila`, '+1'],
    ['Nuovo record in una categoria', `+${ECONOMY.recordBonus}`],
    ['Premio giornaliero', `${ECONOMY.chestRewards[0]}–${ECONOMY.chestRewards[ECONOMY.chestRewards.length - 1]}`],
    ['Sfida del giorno completata', `+${ECONOMY.dailyChallengeReward}`],
    [`Video nel negozio (max ${ECONOMY.shopVideosPerDay} al giorno)`, `+${ECONOMY.shopVideoReward}`],
  ]
  const spend = [
    ['Salvare la streak', `${ECONOMY.saveBaseCost}, poi ${ECONOMY.saveBaseCost * 2}, ${ECONOMY.saveBaseCost * 4}…`],
    ['50/50: via due risposte sbagliate', `${ECONOMY.fiftyFiftyCost}`],
    ['Salta la domanda', `${ECONOMY.skipCost}`],
  ]
  const Table = ({ rows, title }: { rows: string[][]; title: string }) => (
    <div className="card p-6">
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
      <ul className="mt-4 divide-y divide-line">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-center justify-between gap-4 py-3">
            <span className="text-muted">{label}</span>
            <span className="flex shrink-0 items-center gap-1 font-bold text-gem-ink tabular-nums">
              {value} <GemIcon className="size-4" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <section id="gemme" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow="Gemme" title="Si guadagnano giocando">
          Le gemme servono a salvare la streak e per gli aiuti. Puoi giocare benissimo senza spendere nulla.
        </SectionTitle>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Table title="Come si guadagnano" rows={earn} />
          <Table title="Come si usano" rows={spend} />
        </div>
      </Container>
    </section>
  )
}

export function InstallGuide() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle eyebrow="Sul telefono" title="Installala come un'app">
          Niente store, niente download pesanti: si aggiunge alla schermata Home e funziona anche senza connessione.
        </SectionTitle>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-xl font-extrabold">
              <Apple className="size-5" /> iPhone
            </h3>
            <ol className="mt-4 space-y-3 text-muted">
              <li className="flex gap-3"><b className="text-ink">1.</b> Apri il sito in Safari</li>
              <li className="flex gap-3">
                <b className="text-ink">2.</b> Tocca <Share className="inline size-4 text-primary-2" /> Condividi
              </li>
              <li className="flex gap-3">
                <b className="text-ink">3.</b> Scegli <Plus className="inline size-4 text-primary-2" /> «Aggiungi alla schermata Home»
              </li>
            </ol>
          </div>
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-xl font-extrabold">
              <Smartphone className="size-5" /> Android
            </h3>
            <ol className="mt-4 space-y-3 text-muted">
              <li className="flex gap-3"><b className="text-ink">1.</b> Apri il sito in Chrome</li>
              <li className="flex gap-3"><b className="text-ink">2.</b> Tocca «Installa app» quando compare, oppure il menu ⋮</li>
              <li className="flex gap-3">
                <b className="text-ink">3.</b> <WifiOff className="inline size-4 text-primary-2" /> Da lì in poi funziona anche offline
              </li>
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

const FAQ: [string, string][] = [
  ['È gratis?', 'Sì. Si gioca gratis, senza registrazione. Le gemme si guadagnano giocando; comprarle è solo una scorciatoia.'],
  ['Cosa sono le gemme?', 'La moneta del gioco: servono a salvare la streak quando sbagli e per gli aiuti 50/50 e Salta.'],
  [
    'Cosa succede se sbaglio?',
    'Puoi salvare la streak guardando un video (gratis, una volta per partita) o usando le gemme. Altrimenti la partita finisce e riparti da zero.',
  ],
  ['Funziona senza connessione?', 'Sì: dopo la prima apertura il gioco resta disponibile anche offline, con tutte le domande e le immagini.'],
  [
    'Dove vengono salvati i miei progressi?',
    'Nel tuo browser, su questo dispositivo. Non creiamo account e non raccogliamo dati personali.',
  ],
  [
    'Le gemme si pagano davvero?',
    'Non ancora: questa è una versione di prova e il negozio è in modalità demo, senza alcun addebito.',
  ],
]

export function Faq() {
  return (
    <section id="domande" className="scroll-mt-20 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionTitle eyebrow="Domande frequenti" title="Tutto quello che c'è da sapere" />
        <div className="mt-10 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold">
                {q}
                <Plus className="size-5 shrink-0 text-primary-2 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="py-16 text-center sm:py-24">
      <Container>
        <p className="mx-auto mb-4 inline-flex items-center gap-2 text-fire">
          <FlameIcon className="size-8" />
        </p>
        <h2 className="font-display text-4xl font-extrabold text-balance sm:text-5xl">La prossima domanda ti aspetta.</h2>
        <Link href="/app/" className="btn-game btn-primary mt-8 h-14 px-10 text-lg">
          Inizia a giocare
        </Link>
      </Container>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-center gap-4 text-center text-sm text-muted md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p>Un gioco carlarcade.</p>
        </div>
        <div className="space-y-1">
          <p>
            Contatti: <a href="mailto:admin@carlhost.com" className="font-semibold text-ink hover:underline">admin@carlhost.com</a>
          </p>
          <p className="text-xs">I marchi appartengono ai rispettivi proprietari.</p>
          <p className="text-xs">Bandiere: flag-icons (MIT) · Loghi: Simple Icons (CC0) · Mappe: Natural Earth / world-atlas</p>
        </div>
      </Container>
    </footer>
  )
}
