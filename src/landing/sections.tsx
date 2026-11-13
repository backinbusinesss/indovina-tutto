import { BarChart3, Check, Clapperboard, Moon, Plus, ShieldCheck, Sun, WifiOff } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CATEGORIES } from '@/content/categories'
import { getAllDefs, getBank } from '@/engine/bank'
import { ECONOMY } from '@/engine/economy'
import { CategoryTile } from '@/ui/CategoryIcon'
import { FlameIcon, GemIcon } from '@/ui/icons'
import { Logo, LogoMark } from '@/ui/Logo'
import { DemoQuestion } from './DemoQuestion'

const fmt = (n: number) => n.toLocaleString('it-IT', { useGrouping: true })
/** numero arrotondato per difetto alle centinaia, per i titoli ("oltre 2.400") */
const roundDown = (n: number) => Math.floor(n / 100) * 100
const total = () => roundDown(getAllDefs().length)

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-hand text-2xl text-primary-2">{children}</p>
}

function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-1 font-display text-4xl font-extrabold text-balance sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-lg text-muted">{children}</p>}
    </div>
  )
}

export const btnPrimary =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(71,87,236,0.7)] transition hover:bg-primary-press active:scale-[0.98]'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Indovina Tutto, home" className="group">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex" aria-label="Sezioni">
          <a href="/#come-funziona" className="hover:text-ink">Come funziona</a>
          <a href="/#categorie" className="hover:text-ink">Categorie</a>
          <a href="/#gemme" className="hover:text-ink">Gemme</a>
          <a href="/#domande" className="hover:text-ink">Domande</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/app/sfida/" className="hidden text-sm font-semibold hover:text-primary-2 sm:inline">
            Sfida del giorno
          </Link>
          <Link href="/app/" className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-press">
            Gioca gratis
          </Link>
        </div>
      </Container>
    </header>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-14 pt-14 pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-24 lg:pb-24">
        <div className="anim-fade-up text-center lg:text-left">
          <Eyebrow>per chi pensa di sapere tutto ✎</Eyebrow>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl">
            Quanto ne sai, <span className="marker anim-marker">davvero</span>?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted lg:mx-0">
            Bandiere, capitali, sagome dei paesi, loghi, animali, storia, scienza, sport e molto altro. Oltre {fmt(total())}{' '}
            domande in {CATEGORIES.length} categorie: allunga la tua streak e non fermarti.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/app/" className={`${btnPrimary} w-full sm:w-auto`}>
              Gioca gratis
            </Link>
            <a href="#come-funziona" className="font-semibold text-ink hover:text-primary-2">
              Guarda come funziona ↓
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted lg:justify-start">
            {['Gratis, senza account', 'Funziona anche offline', 'Una sfida nuova ogni giorno'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-ok" strokeWidth={3} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="anim-fade-up relative [--d:0.15s]">
          <p className="absolute -top-8 right-4 hidden rotate-[-4deg] font-hand text-xl text-muted lg:block">gioca da solo, guarda ↓</p>
          <DemoQuestion />
        </div>
      </Container>
      <CategoryStrip />
    </section>
  )
}

/** Striscia "si gioca con →" con le categorie, come in Sbobina. */
function CategoryStrip() {
  return (
    <div className="border-y border-line bg-elev/50 py-4">
      <Container className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
        <span className="font-hand text-xl text-primary-2">si gioca con →</span>
        {CATEGORIES.slice(0, 10).map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />
            {c.name}
          </span>
        ))}
        <span>…e altre {CATEGORIES.length - 10}</span>
      </Container>
    </div>
  )
}

export function HowItWorks() {
  const steps = [
    { title: 'Scegli', text: `Una delle ${CATEGORIES.length} categorie, oppure Mix Tutto per un po' di tutto.` },
    { title: 'Rispondi', text: 'Quattro risposte, una sola giusta. Hai 20 secondi, e più vai avanti più si fa difficile.' },
    { title: 'Non fermarti', text: 'Ogni risposta giusta allunga la streak. Se sbagli, la salvi con un video o con le gemme.' },
  ]
  return (
    <section id="come-funziona" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionTitle
          title={
            <>
              Tre mosse, <span className="scribble">zero noia</span>
            </>
          }
        />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <span className="absolute top-10 right-[16%] left-[16%] hidden border-t-2 border-dashed border-line-strong md:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <span className="relative mx-auto grid size-20 place-items-center rounded-full border-2 border-primary bg-bg font-hand text-4xl text-primary-2">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl font-extrabold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

export function CategoryShowcase() {
  return (
    <section id="categorie" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionTitle
          eyebrow={`${CATEGORIES.length} categorie`}
          title={
            <>
              Indovina <span className="marker marker-green">davvero tutto</span>
            </>
          }
        >
          Dal tricolore al Kilimangiaro, dal logo della Ferrari alla sagoma del Cile, da Dante alla Luna.
        </SectionTitle>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/app/gioca/?c=${c.id}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-elev p-4 transition hover:-translate-y-0.5 hover:border-line-strong"
              >
                <div className="flex items-start justify-between">
                  <CategoryTile source={c.id} className="size-11" iconClass="size-5" />
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted tabular-nums">
                    {fmt(getBank(c.id).length)}
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

export function Features() {
  const items = [
    { Icon: FlameIcon, title: 'La streak', text: 'Il cuore del gioco: risposte giuste di fila. La fiamma cresce a 5, 10, 25 e 50.' },
    { Icon: Sun, title: 'Sfida del giorno', text: '10 domande uguali per tutti, una volta al giorno. Il risultato si condivide a quadratini.' },
    { Icon: GemIcon, title: 'Gemme e aiuti', text: '50/50 per togliere due risposte, Salta per cambiare domanda, salvataggi quando sbagli.' },
    { Icon: WifiOff, title: 'Anche offline', text: 'Si installa come un’app e funziona in metro, in aereo, in montagna.' },
    { Icon: BarChart3, title: 'Record e livelli', text: 'Il tuo record in ogni categoria, la percentuale di risposte giuste, il livello che sale.' },
    { Icon: Moon, title: 'Chiaro o scuro', text: 'Tema automatico, suoni e vibrazione regolabili, timer disattivabile per giocare rilassati.' },
  ]
  const trust = [
    { Icon: ShieldCheck, title: 'Niente account, niente dati', text: 'Non chiediamo email né registrazioni. I progressi restano sul tuo dispositivo.' },
    { Icon: Check, title: 'Domande verificate', text: 'Solo fatti stabili e controllati: niente domande ambigue o risposte discutibili.' },
    { Icon: null, title: 'Pensato in italiano', text: 'Nomi, capitali e domande come si dicono in Italia, con una categoria tutta dedicata all’Italia.' },
  ]
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionTitle
          title={
            <>
              Tutto quello che serve per <span className="marker marker-blue">non smettere più</span>.
            </>
          }
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, title, text }) => (
            <li key={title} className="rounded-3xl border border-line bg-elev p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary-2">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-extrabold">{title}</h3>
              <p className="mt-2 text-muted">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {trust.map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ok">
                {Icon ? <Icon className="size-5" /> : <span className="text-xl">🇮🇹</span>}
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function DailyTeaser() {
  const squares = [true, true, false, true, true, true, true, false, true, true]
  return (
    <section className="py-8">
      <Container>
        <div className="grid items-center gap-10 rounded-[2rem] border border-line bg-elev p-8 sm:p-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>ogni giorno a mezzanotte ✦</Eyebrow>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-balance">
              La <span className="marker">sfida del giorno</span>, uguale per tutti.
            </h2>
            <p className="mt-4 max-w-lg text-muted">
              Dieci domande, dalla più facile alla più difficile, una sola possibilità. Poi confronta il punteggio con gli amici: si
              condivide con un tocco, senza svelare le risposte.
            </p>
            <Link href="/app/sfida/" className={`${btnPrimary} mt-7`}>
              Gioca la sfida di oggi
            </Link>
          </div>
          <div className="paper rotate-[1.5deg] rounded-2xl border border-line p-6 pl-14 shadow-card">
            <p className="font-hand text-xl text-primary-2">Indovina Tutto — Sfida del giorno</p>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Esempio di risultato: 8 su 10">
              {squares.map((ok, i) => (
                <span key={i} className={`size-7 rounded-md ${ok ? 'bg-ok' : 'bg-bad'}`} />
              ))}
            </div>
            <p className="mt-3 font-display text-4xl font-extrabold">8/10</p>
            <p className="font-hand text-lg text-muted">batti questo, se ci riesci</p>
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
  return (
    <section id="gemme" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionTitle
          title={
            <>
              Gratis. <span className="marker">Davvero.</span>
            </>
          }
        >
          Si gioca senza pagare e senza limiti di partite. Le gemme servono a salvare la streak e per gli aiuti, e si guadagnano
          giocando.
        </SectionTitle>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-elev p-7">
            <p className="text-sm font-semibold text-muted">Gioco completo</p>
            <p className="mt-1 font-display text-5xl font-extrabold">0 €</p>
            <p className="text-sm text-muted">per sempre</p>
            <ul className="mt-6 space-y-3">
              {[
                `Tutte le ${CATEGORIES.length} categorie e oltre ${fmt(total())} domande`,
                'Partite illimitate e Mix Tutto',
                'Sfida del giorno',
                'Un video gratis per salvare la streak in ogni partita',
                'Statistiche, record e livelli',
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-ok" strokeWidth={3} /> {t}
                </li>
              ))}
            </ul>
            <Link href="/app/" className={`${btnPrimary} mt-7 w-full`}>
              Inizia a giocare
            </Link>
          </div>
          <div className="rounded-3xl border-2 border-gem/60 bg-elev p-7">
            <p className="flex items-center gap-2 text-sm font-semibold text-gem-ink">
              <GemIcon className="size-5" /> Gemme, guadagnate giocando
            </p>
            <ul className="mt-4 divide-y divide-line">
              {earn.map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-muted">{label}</span>
                  <span className="flex shrink-0 items-center gap-1 font-bold text-gem-ink tabular-nums">
                    {value} <GemIcon className="size-4" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <Clapperboard className="mt-0.5 size-4 shrink-0 text-primary-2" />
              Chi va di fretta può prenderle nel negozio: per ora in modalità demo, senza alcun addebito.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

const FAQ: [string, string][] = [
  ['È gratis?', 'Sì, completamente. Si gioca senza registrazione e senza limiti. Le gemme si guadagnano giocando; comprarle è solo una scorciatoia.'],
  ['Cosa sono le gemme?', 'La moneta del gioco: servono a salvare la streak quando sbagli e per gli aiuti 50/50 e Salta.'],
  [
    'Cosa succede se sbaglio?',
    'Puoi salvare la streak guardando un video (gratis, una volta per partita) o usando le gemme: 10, poi 20, poi 40 nella stessa partita. Altrimenti la partita finisce e riparti da zero.',
  ],
  [
    'Funziona dal telefono?',
    'Sì. Su iPhone apri il sito in Safari, tocca Condividi → Aggiungi alla schermata Home. Su Android Chrome ti propone di installarla. Da lì funziona anche offline.',
  ],
  [
    'Dove vengono salvati i miei progressi?',
    'Solo nel browser del tuo dispositivo. Non creiamo account e non raccogliamo dati personali. Dal profilo puoi azzerare tutto quando vuoi.',
  ],
  ['Le domande sono affidabili?', 'Le abbiamo scritte e verificate una per una, scegliendo solo fatti stabili. Se trovi un errore scrivici: lo correggiamo subito.'],
  ['Le gemme si pagano davvero?', 'Non ancora: il negozio è in modalità demo e non addebita nulla.'],
]

export function Faq() {
  return (
    <section id="domande" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionTitle title="Domande frequenti" />
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <Plus className="size-5 shrink-0 text-muted transition-transform group-open:rotate-45" />
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
    <section className="py-20 text-center sm:py-28">
      <Container>
        <Eyebrow>la prossima domanda non aspetta</Eyebrow>
        <h2 className="mt-2 font-display text-4xl font-extrabold text-balance sm:text-6xl">
          Inizia a giocare <span className="rounded-lg bg-[#ffe14d] px-2 text-[#1a1916]">adesso</span>.
        </h2>
        <Link href="/app/" className={`${btnPrimary} mt-8 h-14 px-10 text-lg`}>
          Gioca gratis
        </Link>
        <p className="mt-4 text-sm text-muted">nessun account · nessuna carta · funziona offline</p>
      </Container>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-elev/40 text-sm text-muted">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="font-display text-lg font-extrabold text-ink">Indovina Tutto</span>
          </Link>
          <p className="mt-3 max-w-xs">Il quiz su tutto: bandiere, capitali, loghi, animali, storia, scienza e molto altro.</p>
          <p className="mt-3 font-hand text-xl text-primary-2">un gioco carlarcade ✦</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Gioco</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/app/" className="hover:text-ink">Gioca</Link></li>
            <li><Link href="/app/sfida/" className="hover:text-ink">Sfida del giorno</Link></li>
            <li><Link href="/app/negozio/" className="hover:text-ink">Negozio</Link></li>
            <li><a href="mailto:admin@carlhost.com" className="hover:text-ink">Assistenza</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink">Documenti</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/termini/" className="hover:text-ink">Termini d’uso</Link></li>
            <li><Link href="/privacy/" className="hover:text-ink">Privacy</Link></li>
            <li><Link href="/cookie/" className="hover:text-ink">Cookie</Link></li>
            <li><Link href="/crediti/" className="hover:text-ink">Crediti e marchi</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="border-t border-line py-6 text-xs">
        © 2026 Nicolò Ulivi · CarlHost di Ulivi Nicolò · Via Ventisette Novembre 1, Parabiago (MI) · P.IVA IT14943820960 · PEC
        admin@carlhost.com
      </Container>
    </footer>
  )
}
