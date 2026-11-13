# Indovina Tutto — piano di lavoro

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Obiettivo:** costruire il quiz Indovina Tutto (sito su `/` e app installabile su `/app`) con streak, gemme, negozio demo, video demo e sfida del giorno, e pubblicarlo su GitHub Pages.

**Architettura:** Next.js esportato come sito statico. Il "motore" del gioco è fatto di funzioni pure in TypeScript (domande, partita, economia, progressi), testate con Vitest. Lo stato del giocatore sta in uno store Zustand salvato nel browser. Video e pagamenti passano da due "prese" (provider React) che oggi mostrano la versione demo. Le immagini (bandiere, sagome, loghi) vengono generate da pacchetti con licenza libera tramite uno script e salvate nel repository.

**Tecnologie:** Node.js LTS, Next.js (ultima stabile, App Router, `output: 'export'`), React 19, TypeScript, Tailwind CSS v4, Zustand, motion, canvas-confetti, lucide-react, @fontsource-variable (Bricolage Grotesque, Inter), Vitest + Testing Library. Per le immagini: flag-icons, simple-icons, world-atlas, d3-geo, topojson-client, i18n-iso-countries, sharp.

**Progetto di riferimento:** `docs/superpowers/specs/2026-11-13-indovina-tutto-design.md`

## Vincoli globali

- Tutti i testi visibili sono in **italiano**.
- Cartella del progetto: `indovina-tutto/`. Repository `backinbusinesss/indovina-tutto`, **pubblico**, ramo `main`.
- URL provvisorio: `https://backinbusinesss.github.io/indovina-tutto/`. Il prefisso viene da `NEXT_PUBLIC_BASE_PATH`: `/indovina-tutto` in produzione, vuoto in sviluppo.
- Next.js con `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. Niente funzioni server, niente route dinamiche senza `generateStaticParams`.
- Ogni percorso di un file in `public/` passa da `assetUrl()`; mai `"/flags/…"` scritto a mano.
- Numeri del gioco presi dal progetto, tutti in `src/engine/economy.ts`:
  - regalo di benvenuto 50; +1 gemma ogni 5 risposte giuste di fila; +5 per un nuovo record;
  - forziere 10→30; sfida del giorno +15; video nel negozio +5, massimo 3 al giorno;
  - 50/50 costa 5, Salta costa 8; salvataggio 10·2ⁿ; un solo salvataggio con video per partita;
  - conto alla rovescia del salvataggio 10 s; timer della domanda 20 s; video demo 15 s;
  - difficoltà più alta dopo 10 e dopo 25 risposte di fila.
- Pacchetti del negozio: 120 💎 a 0,99 €; 650 💎 a 4,99 € "+10%"; 1.400 💎 a 9,99 € "Il più scelto"; 3.000 💎 a 19,99 € "Miglior valore". Sempre con la scritta **"Modalità demo: nessun addebito"**.
- Paesi: i 193 membri dell'ONU più Vaticano (VA) e Palestina (PS) = 195.
- Nota sui marchi visibile nella categoria Loghi e nel fondo del sito: "I marchi appartengono ai rispettivi proprietari."
- Contatto nel fondo pagina: admin@carlhost.com.
- Animazioni disattivate o ridotte con `prefers-reduced-motion`. Su computer si risponde con i tasti 1–4.
- Commit piccoli e frequenti. Ogni messaggio di commit termina con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Rischi da coprire con test (Review Focus)

1. **Il browser non permette di salvare** (navigazione privata, webview con lo storage disattivato): il gioco deve funzionare senza errori, senza salvare. → test nel Compito 9.
2. **Doppio tocco**: due risposte toccate di fila, o "Usa 10 gemme" premuto due volte. Deve contare solo il primo tocco e le gemme non devono mai andare sotto zero. → test nei Compiti 7 e 9.
3. **App in secondo piano durante una domanda** (telefono bloccato, cambio di app): il timer deve fermarsi, non scadere. → test nel Compito 12.
4. **Mezzanotte e cambi d'ora**: chi gioca alle 23:59 e alle 00:01 (ora di Roma) guadagna un giorno di fila, non lo perde; un giorno saltato azzera la serie; l'orologio messo indietro non rompe niente. → test nel Compito 8.
5. **Prefisso di GitHub Pages**: con `/indovina-tutto` davanti, immagini, manifest e service worker devono caricarsi lo stesso. → test nel Compito 1 e verifica sulla build di produzione nel Compito 17.

---

### Task 1: Base del progetto

**File:**
- Crea: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx` (provvisoria), `src/app/globals.css`, `src/lib/asset.ts`, `src/lib/storage.ts`
- Test: `tests/lib/asset.test.ts`, `tests/lib/storage.test.ts`

**Interfacce prodotte:**
- `assetUrl(path: string): string`: aggiunge `process.env.NEXT_PUBLIC_BASE_PATH ?? ''` e toglie la `/` iniziale doppia. `assetUrl('flags/it.svg')` dà `'/indovina-tutto/flags/it.svg'`.
- `safeStorage: { getItem(k): string | null; setItem(k, v): void; removeItem(k): void }`: usa `localStorage` dentro try/catch e, se fallisce, passa a una Map in memoria.

- [ ] **Passo 1:** installa Node.js LTS con `winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements --silent`, poi controlla con `& "C:\Program Files\nodejs\node.exe" --version`. Nelle shell di questa sessione aggiungi `C:\Program Files\nodejs` al PATH.
- [ ] **Passo 2:** crea `package.json` a mano con questi script:
  - `dev` = `next dev`
  - `build` = `next build`. Nel Compito 16 diventa `next build && node scripts/generate-sw.mjs`.
  - `test` = `vitest run`
  - `assets` = `tsx scripts/build-assets.ts`
  - `typecheck` = `tsc --noEmit`

  Installa le dipendenze del progetto con `npm install` (ultime stabili) e scrivi le versioni esatte risolte.
- [ ] **Passo 3:** `next.config.ts` con `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`, `basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined`. Tailwind v4 via `@tailwindcss/postcss`. Vitest con ambiente `jsdom` e alias `@/` → `src/`.
- [ ] **Passo 4: test che falliscono**

```ts
// tests/lib/asset.test.ts
it('aggiunge il prefisso', () => { vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/indovina-tutto'); expect(assetUrl('flags/it.svg')).toBe('/indovina-tutto/flags/it.svg'); expect(assetUrl('/flags/it.svg')).toBe('/indovina-tutto/flags/it.svg') })
it('senza prefisso', () => { vi.stubEnv('NEXT_PUBLIC_BASE_PATH', ''); expect(assetUrl('sw.js')).toBe('/sw.js') })
// tests/lib/storage.test.ts
it('funziona se localStorage lancia errori', () => { vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') }); safeStorage.setItem('k', 'v'); expect(safeStorage.getItem('k')).toBe('v') })
```

- [ ] **Passo 5:** `npm test`: deve fallire. Scrivi `asset.ts` e `storage.ts`, poi `npm test`: deve passare.
- [ ] **Passo 6:** `npm run build`. Deve creare `out/index.html`.
- [ ] **Passo 7:** `git init -b main`, commit "chore: base del progetto Next.js statico". Nello stesso commit copia `docs/` (progetto e piano).

### Task 2: Tipi, generatore casuale e domande "materializzate"

**File:** Crea `src/engine/types.ts`, `src/engine/rng.ts`, `src/engine/materialize.ts` · Test `tests/engine/rng.test.ts`, `tests/engine/materialize.test.ts`

**Interfacce prodotte:**

```ts
export type CategoryId = 'bandiere'|'capitali'|'sagome'|'loghi'|'fiumi'|'monti'|'laghi'|'geografia'|'monumenti'|'valute'|'cucina'|'italia'
export type Source = CategoryId | 'mix'
export type Difficulty = 1 | 2 | 3
export interface Media { kind: 'flag' | 'shape' | 'logo'; src: string /* relativo a public/, es. 'flags/it.svg' */; alt: string }
export interface OptionDef { label: string; media?: Media }
export interface QuestionDef { id: string; category: CategoryId; difficulty: Difficulty; prompt: string; media?: Media; answer: OptionDef; distractors: OptionDef[] /* ≥3 */; layout: 'text' | 'images' }
export type OptionId = 'a' | 'b' | 'c' | 'd'
export interface Option { id: OptionId; label: string; media?: Media }
export interface Question { defId: string; category: CategoryId; difficulty: Difficulty; prompt: string; media?: Media; options: Option[] /* 4 */; correct: OptionId; layout: 'text' | 'images' }
export type Rng = () => number // [0,1)
```

- `createRng(seed: number): Rng` (mulberry32) · `seedFromString(s: string): number` (cyrb53 ridotto a 32 bit) · `shuffle<T>(a: readonly T[], rng: Rng): T[]` (Fisher–Yates, non modifica l'array originale) · `pickWeighted<K extends string|number>(w: Record<K, number>, rng: Rng): K`
- `materialize(def: QuestionDef, rng: Rng): Question`: sceglie a caso 3 distrattori tra quelli disponibili, mescola le 4 opzioni e assegna gli id a–d in ordine.

- [ ] **Passo 1: test**
  - `createRng(42)` dà la stessa sequenza a ogni chiamata;
  - `shuffle` non perde né duplica elementi;
  - `materialize` restituisce 4 opzioni con etichette tutte diverse, `options.find(o => o.id === correct).label === def.answer.label`, e sullo stesso def con 50 semi diversi la risposta giusta finisce almeno una volta in ognuna delle 4 posizioni.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare. Commit "feat: tipi e generatore casuale del motore".

### Task 3: I 195 paesi

**File:** Crea `src/content/countries.ts` · Test `tests/content/countries.test.ts` · Dipendenza di sviluppo: `i18n-iso-countries`

**Interfacce prodotte:**

```ts
export type Region = 'europa' | 'asia' | 'africa' | 'nord-america' | 'centro-america-caraibi' | 'sud-america' | 'oceania'
export type Continent = 'Europa' | 'Asia' | 'Africa' | 'America' | 'Oceania'
export interface Country { iso2: string; num: string; name: string; capital: string; capitalQuiz: boolean; region: Region; continent: Continent; transcontinental: boolean; currency: string; language: string | null; fame: Difficulty; shape: boolean }
export const COUNTRIES: readonly Country[]
```

Regole per scrivere i dati (dati scritti a mano, in italiano corrente):
- **Nomi** come si dicono in Italia: "Stati Uniti", "Regno Unito", "Corea del Sud", "Costa d'Avorio", "Città del Vaticano".
- **Capitali** con il nome italiano quando esiste: Londra, Parigi, Mosca, Pechino, Varsavia, Città del Messico. `capitalQuiz: false` solo per Israele e Palestina, la cui capitale è contesa. Bolivia → Sucre, Sudafrica → Pretoria, Paesi Bassi → Amsterdam.
- **`transcontinental: true`** per Russia, Turchia, Egitto, Kazakistan, Georgia, Azerbaigian, Armenia e Cipro.
- **`language`** solo quando c'è una lingua principale chiara. `null` per Svizzera, Belgio, India, Sudafrica, Canada e simili.
- **`currency`** è il nome comune in italiano ("euro", "dollaro statunitense", "franco CFA").
- **`fame`:**
  - 1 = circa 55 paesi che ogni italiano conosce (tutta l'UE, i G20, i vicini);
  - 2 = circa 70 paesi;
  - 3 = il resto.
- **`shape: false`** per i microstati e gli arcipelaghi frammentati (circa 45 paesi).

- [ ] **Passo 1: test**
  - ci sono 195 paesi;
  - `iso2`, `name` e `capital` sono tutti diversi;
  - `countries.alpha2ToNumeric(iso2)` (da `i18n-iso-countries`) è uguale a `num` per tutti, tranne PS, da verificare a mano;
  - ogni `region` è coerente con il suo `continent`;
  - i paesi con `fame === 1` sono tra 45 e 65;
  - i paesi con `shape === true` sono almeno 150;
  - i paesi con `capitalQuiz === false` sono esattamente `['IL', 'PS']`.
- [ ] **Passo 2:** esegui i test: devono fallire. Scrivi i dati. Esegui di nuovo: devono passare. Commit "feat: dati dei 195 paesi".

### Task 4: Immagini (bandiere, sagome, loghi) e icone

**File:** Crea `scripts/build-assets.ts`, `src/content/logos.ts`, `public/flags/*.svg`, `public/shapes/*.svg`, `public/logos/*.svg` · Test `tests/content/assets.test.ts`

**Interfacce prodotte:**

```ts
export type Sector = 'tech' | 'auto' | 'moda' | 'cibo' | 'sport' | 'media' | 'viaggi' | 'altro'
export interface Logo { slug: string /* simple-icons */; name: string; sector: Sector; fame: Difficulty }
export const LOGOS: readonly Logo[] // ≥120
```

Cosa fa lo script `npm run assets`:
1. **Bandiere:** copia `flag-icons/flags/4x3/<iso2>.svg` in `public/flags/<iso2 minuscolo>.svg` per i 195 paesi.
2. **Loghi:** per ogni `LOGOS[i]`, prende il path SVG da `simple-icons` e scrive `public/logos/<slug>.svg` con `viewBox="0 0 24 24"` e `fill` uguale al colore del marchio. Se il colore è troppo chiaro (luminanza > 0,85), usa `#111827`, perché i loghi si mostrano su un riquadro bianco.
3. **Sagome:** carica `world-atlas/countries-50m.json` e associa ogni forma al paese tramite `num`. Per ogni paese con `shape: true`:
   - tiene solo le parti con area ≥ 0,5% della parte più grande e con il centro entro 1.500 km dal centro di quella parte (così spariscono Alaska e Guyana francese, e restano Sicilia e Corsica);
   - proietta con `geoEqualEarth().rotate([-lon, 0])` centrata sul paese, poi `fitExtent([[8, 8], [248, 248]], feature)`;
   - scrive `public/shapes/<iso2>.svg` di 256×256 con un unico `<path fill="currentColor">`.
4. **Pagina di controllo:** scrive `scripts/out/shapes-preview.html`, con tutte le sagome affiancate per il controllo a occhio. È ignorata da git.

Il logo dell'app (`public/brand/logo.svg`: un punto interrogativo dentro un globo stilizzato) e le icone PNG dell'app (192, 512 e 512 "maskable", fatte con `sharp`) li genera lo stesso script.

- [ ] **Passo 1:** scrivi `LOGOS`: 120 marchi noti in Italia, vari per settore, tutti presenti nella versione installata di `simple-icons`.
- [ ] **Passo 2: test**
  - esiste un file in `public/flags/` per ognuno dei 195 paesi;
  - esiste un file in `public/shapes/` per ogni paese con `shape`;
  - esiste un file in `public/logos/` per ogni logo;
  - gli slug dei loghi sono tutti diversi e ce ne sono almeno 120;
  - ogni SVG delle sagome contiene un solo `<path` ed è più leggero di 40 KB.
- [ ] **Passo 3:** esegui i test: devono fallire. Scrivi lo script, poi lancia `npm run assets` e i test: devono passare.
- [ ] **Passo 4:** apri `scripts/out/shapes-preview.html` nel browser. Ogni sagoma deve essere riconoscibile. Correggi `shape` in `countries.ts` per quelle che non lo sono, ma restando ad almeno 150.
- [ ] **Passo 5:** commit "feat: bandiere, sagome, loghi e icone".

### Task 5: Domande generate (6 categorie)

**File:** Crea `src/engine/generators.ts`, `src/content/categories.ts`, `src/engine/bank.ts` · Test `tests/engine/generators.test.ts`, `tests/engine/bank.test.ts`

**Interfacce prodotte:**
- `CATEGORIES: readonly CategoryMeta[]` con `{ id: CategoryId; name: string; tagline: string; icon: string /* nome lucide */; color: string /* var CSS */ }`. È in ordine di visualizzazione e i nomi sono quelli del progetto (§7.1).
- `generateFlagQuestions(): QuestionDef[]`, nei due versi:
  - `'Di quale paese è questa bandiera?'` con la bandiera come immagine e 4 nomi come risposte;
  - `'Qual è la bandiera di <Nome>?'` con 4 bandiere come risposte (`layout: 'images'`).
- `generateCapitalQuestions()`, nei due versi:
  - `'Qual è la capitale di <Nome>?'`;
  - `'<Capitale> è la capitale di…'`.
- `generateShapeQuestions()`: `'Di quale paese è questa sagoma?'`.
- `generateLogoQuestions()`: `'Di quale marchio è questo logo?'`.
- `generateContinentQuestions()` (vanno in geografia): `'Quale di questi paesi si trova in <Continente>?'`. Tra risposta e distrattori esclude i paesi con `transcontinental`, e i distrattori sono di altri continenti.
- `generateCurrencyLanguageQuestions()` (vanno in valute):
  - `'Qual è la valuta di <Nome>?'`;
  - `'Qual è la lingua principale di <Nome>?'`, solo quando `language` non è null.
- `getBank(category: CategoryId): readonly QuestionDef[]` · `getAllDefs(): readonly QuestionDef[]`. Il risultato è calcolato una volta sola e poi riusato.

Regole comuni:
- **Difficoltà:** quella del paese (`fame`) o del marchio.
- **Distrattori:** nell'ordine della lista ci sono prima quelli della stessa `region` (o dello stesso settore per i loghi), poi gli altri; in tutto da 6 a 8 per domanda, con etichette tutte diverse. Per le valute, niente distrattori con la stessa valuta della risposta.
- **id:** `<categoria>:<verso>:<chiave>`, per esempio `bandiere:img:IT`, `bandiere:pick:IT`, `capitali:of:IT`.
- **Testo alternativo delle immagini:** `'Bandiera da indovinare'`, `'Sagoma da indovinare'`, `'Logo da indovinare'`. Non deve mai contenere la risposta.

- [ ] **Passo 1: test**
  - le domande di ogni categoria sono almeno quante dice il progetto: bandiere 390, capitali 386, sagome 150, loghi 120, valute 120;
  - per ogni def: c'è la risposta, i distrattori sono almeno 3, nessun distrattore ha la stessa etichetta della risposta, nessuna etichetta è ripetuta;
  - nessun `media.alt` contiene `answer.label`;
  - gli id sono tutti diversi;
  - ogni `media.src` punta a un file che esiste in `public/`.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare. Commit "feat: domande generate".

### Task 6: Domande scritte a mano (7 file)

**File:** Crea `src/content/questions/{fiumi,monti,laghi,geografia,monumenti,cucina,italia}.ts`, ognuno con `export const QUESTIONS: QuestionDef[]` · Modifica `src/engine/bank.ts` per includerli · Test `tests/content/handwritten.test.ts`

Quante domande come minimo:

| File | Minimo |
|---|---|
| fiumi | 60 |
| monti | 50 |
| laghi | 50 |
| geografia | 40, che si aggiungono alle generate |
| monumenti | 80 |
| cucina | 60 |
| italia | 100 |

Regole:
- Solo fatti stabili e verificabili, come previsto nel progetto (§7.1).
- Da 3 a 5 distrattori plausibili dello stesso tipo: fiumi con fiumi, città con città.
- Difficoltà distribuita più o meno così: 40% livello 1, 40% livello 2, 20% livello 3.
- id `<categoria>:<numero a 3 cifre>`.
- Niente risposte del tipo "Tutte le precedenti".

- [ ] **Passo 1: test** (generico, ripetuto per ogni file)
  - ogni file raggiunge il suo minimo;
  - gli id sono diversi e cominciano con la categoria giusta;
  - i distrattori sono almeno 3 e diversi dalla risposta;
  - nessun prompt è ripetuto;
  - per ogni file, la quota di domande di livello 1 sta tra il 25% e il 60%;
  - `getBank('geografia').length >= 150`;
  - `getAllDefs().length >= 1500`.
- [ ] **Passo 2:** esegui il test: deve fallire. Scrivi un file alla volta e committa a ogni file ("feat: domande fiumi", …).
- [ ] **Passo 3:** rilettura dei fatti, una domanda alla volta. Correggi tutto ciò che non è certo o è ambiguo. Per esempio, la lunghezza esatta del Nilo rispetto al Rio delle Amazzoni è contestata: niente domande su quale sia il più lungo.

### Task 7: Motore della partita ed economia

**File:** Crea `src/engine/economy.ts`, `src/engine/picker.ts`, `src/engine/run.ts` · Test `tests/engine/economy.test.ts`, `tests/engine/picker.test.ts`, `tests/engine/run.test.ts`

**Interfacce prodotte:**

```ts
// economy.ts: tutti i numeri del gioco (vedi Vincoli globali)
export const ECONOMY: { welcomeGems: 50; gemEveryStreak: 5; recordBonus: 5; recordMinStreak: 3; chestRewards: readonly [10, 12, 15, 18, 21, 25, 30]; dailyChallengeReward: 15; shopVideoReward: 5; shopVideosPerDay: 3; fiftyFiftyCost: 5; skipCost: 8; saveBaseCost: 10; videoSavesPerRun: 1; saveCountdownSec: 10; questionTimeSec: 20; videoAdSec: 15 }
export const GEM_PACKS: readonly { id: 'p120' | 'p650' | 'p1400' | 'p3000'; gems: number; priceCents: number; badge?: string }[]
export function saveCost(savesUsed: number): number // 10 · 2^savesUsed
export const DIFFICULTY_WEIGHTS: (streak: number) => Record<Difficulty, number> // <10: {1:.7,2:.25,3:.05}; 10–24: {1:.3,2:.5,3:.2}; ≥25: {1:.15,2:.35,3:.5}

// picker.ts
export function pickNext(source: Source, seen: ReadonlySet<string>, streak: number, rng: Rng): { def: QuestionDef; exhausted: boolean }
//  'mix': prima sceglie una categoria a caso (tutte con la stessa probabilità), poi la domanda.
//  Se nella difficoltà estratta non restano domande non viste, passa alla difficoltà più vicina.
//  Se la fonte è esaurita: exhausted = true e il chiamante azzera seen.

// run.ts
export type RunPhase = 'question' | 'correct' | 'wrong' | 'save-offer' | 'ended'
export interface RunState { source: Source; phase: RunPhase; question: Question; streak: number; correctCount: number; answeredCount: number; saves: number; videoSaveUsed: boolean; gemsEarned: number; hidden: OptionId[]; fiftyUsed: boolean; seen: string[]; chosen: OptionId | null }
export type RunEvent = { type: 'gem'; amount: number } | { type: 'exhausted' }
export function createRun(source: Source, rng: Rng): RunState
export function answer(s: RunState, choice: OptionId | null /* null = tempo scaduto */): { state: RunState; events: RunEvent[] }
export function next(s: RunState, rng: Rng): { state: RunState; events: RunEvent[] } // da 'correct' a 'question'
export function toSaveOffer(s: RunState): RunState                                   // da 'wrong' a 'save-offer'
export function canVideoSave(s: RunState): boolean
export function saveWithGems(s: RunState, rng: Rng): RunState                         // solo in 'save-offer': saves+1, nuova domanda, streak invariata
export function saveWithVideo(s: RunState, rng: Rng): RunState                        // solo se canVideoSave
export function fiftyFifty(s: RunState, rng: Rng): RunState                           // solo in 'question' e se !fiftyUsed: nasconde 2 risposte sbagliate
export function skip(s: RunState, rng: Rng): RunState                                 // solo in 'question': nuova domanda, streak invariata
export function endRun(s: RunState): RunState
export interface RunSummary { source: Source; streak: number; correct: number; answered: number; gemsEarned: number }
export function summarize(s: RunState): RunSummary
```

Ogni funzione chiamata nella fase sbagliata restituisce lo stato **invariato**: è la difesa dal doppio tocco. Le gemme vere le scala lo store, non il motore.

- [ ] **Passo 1: test**
  - `saveCost(0..3)` dà `[10, 20, 40, 80]`;
  - dopo 5 risposte giuste di fila arriva un evento `{type: 'gem', amount: 1}`, alla decima un altro;
  - `answer` chiamata due volte di fila: la seconda non cambia niente;
  - `saveWithGems` fuori da `save-offer` non cambia niente;
  - `canVideoSave` è falso dopo un salvataggio con video;
  - `fiftyFifty` nasconde esattamente 2 risposte sbagliate e mai quella giusta; la seconda chiamata sulla stessa domanda non cambia niente;
  - `skip` lascia la streak invariata;
  - dopo `answer(null)` la fase è `'wrong'`;
  - in una partita non si ripete nessuna domanda finché la fonte non è esaurita;
  - `pickNext` con streak 30: su 1.000 estrazioni almeno il 35% è di livello 3;
  - `pickNext('mix')`: ogni categoria esce almeno una volta su 500 estrazioni.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare. Commit "feat: motore della partita ed economia".

### Task 8: Progressi e sfida del giorno

**File:** Crea `src/engine/progress.ts`, `src/engine/daily.ts` · Test `tests/engine/progress.test.ts`, `tests/engine/daily.test.ts`

**Interfacce prodotte:**

```ts
// progress.ts (funzioni pure, nessun accesso al browser)
export interface Settings { sound: boolean; haptics: boolean; timer: boolean; theme: 'system' | 'dark' | 'light' }
export interface CategoryStats { best: number; runs: number; correct: number; answered: number }
export interface DailyRecord { results: boolean[]; done: boolean; rewarded: boolean }
export interface Profile { schemaVersion: 1; gems: number; xp: number; dayStreak: number; lastPlayedDay: string | null; lastChestDay: string | null; stats: Partial<Record<Source, CategoryStats>>; daily: Record<string, DailyRecord>; shopVideos: { day: string; count: number }; settings: Settings }
export function initialProfile(): Profile // gems = ECONOMY.welcomeGems
export function addGems(p: Profile, n: number): Profile
export function spendGems(p: Profile, n: number): Profile | null // null se non bastano
export function touchDay(p: Profile, today: string): Profile // stesso giorno: invariato; ieri: +1; altrimenti 1; data precedente all'ultima: invariato
export function effectiveDayStreak(p: Profile, today: string): number
export function chestAvailable(p: Profile, today: string): boolean
export function openChest(p: Profile, today: string): { profile: Profile; reward: number } | null // reward = chestRewards[min(effectiveDayStreak,7)-1]
export function applyRun(p: Profile, r: RunSummary, today: string): { profile: Profile; newRecord: boolean; bonus: number } // stats, xp += correct, touchDay, record se streak > best e streak ≥ 3 → +5. Non riaggiunge r.gemsEarned
export function canWatchShopVideo(p: Profile, today: string): boolean
export function watchShopVideo(p: Profile, today: string): Profile // +5, massimo 3 al giorno
export function recordDailyAnswer(p: Profile, dateKey: string, correct: boolean): Profile
export function finishDaily(p: Profile, dateKey: string): { profile: Profile; reward: number } // +15 una volta sola, e conta come partita per touchDay
export function levelFromXp(xp: number): { level: number; into: number; needed: number } // per passare dal livello n al n+1 servono 50 + 25·(n−1) XP

// daily.ts
export function dateKeyRome(now: Date): string // 'YYYY-MM-DD' con Intl e timeZone 'Europe/Rome'
export function addDays(key: string, delta: number): string
export function dailyQuestions(key: string): Question[] // 10 domande, stessa data = stesse domande e stesso ordine delle opzioni; difficoltà 4×1, 4×2, 2×3; almeno 6 categorie diverse
export function shareText(key: string, results: boolean[], url: string): string
// "Indovina Tutto — Sfida del 13/11/2026\n🟩🟩🟥…  8/10\n<url>"
```

- [ ] **Passo 1: test**
  - **Mezzanotte e cambi d'ora:**
    - `dateKeyRome(new Date('2026-11-13T22:59:00Z'))` dà `'2026-11-13'` e `…T23:01:00Z` dà `'2026-11-14'`;
    - a cavallo del cambio d'ora del 29 marzo 2026 `addDays` resta corretto;
    - `touchDay` da `'2026-11-13'` a `'2026-11-14'` porta la serie da 3 a 4, a `'2026-11-16'` la riporta a 1, a `'2026-11-10'` (orologio indietro) la lascia invariata.
  - **Gemme:** `spendGems(p con 5, 10)` dà `null`.
  - **Forziere:** dà 10 il primo giorno e 30 dal settimo giorno di fila; aperto due volte nello stesso giorno, la seconda dà `null`.
  - **Record:** `applyRun` dà il bonus solo se la streak supera il record precedente ed è almeno 3.
  - **Video nel negozio:** il quarto video dello stesso giorno non dà gemme.
  - **Sfida del giorno:**
    - `dailyQuestions('2026-11-13')` dà lo stesso risultato se chiamata due volte;
    - date diverse danno domande diverse;
    - `finishDaily` dà la ricompensa una volta sola.
  - **Condivisione:** `shareText` produce esattamente la stringa d'esempio.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare. Commit "feat: progressi e sfida del giorno".

### Task 9: Store del giocatore e "prese" per video e pagamenti

**File:** Crea `src/store/profile.ts`, `src/store/useHydrated.ts`, `src/providers/ads.tsx`, `src/providers/payments.tsx` · Test `tests/store/profile.test.ts`

**Interfacce prodotte:**
- `useProfile`: store Zustand con `persist` (chiave `'indovina-tutto:v1'`, storage `createJSONStorage(() => safeStorage)`, `version: 1`, `migrate` che restituisce lo stato così com'è). Stato: `Profile`. Azioni (ognuna chiama la funzione pura del Compito 8 con `today = dateKeyRome(new Date())`):
  - `addGems(n)`;
  - `spendGems(n): boolean`;
  - `applyRun(r): { newRecord; bonus }`;
  - `openChest(): number | null`;
  - `watchShopVideo(): boolean`;
  - `recordDailyAnswer(key, ok)`;
  - `finishDaily(key): number`;
  - `updateSettings(p: Partial<Settings>)`;
  - `reset()`.
- `useHydrated(): boolean`: è vero dopo che lo store ha letto il salvataggio. Finché è falso, le schermate dell'app mostrano uno scheletro di caricamento.
- `AdsProvider` e `useAds(): { showRewarded(placement: 'save-streak' | 'shop-gems'): Promise<'rewarded' | 'dismissed'> }`. La versione demo apre `VideoAdModal` (Compito 12).
- `PaymentsProvider` e `usePayments(): { purchase(packId): Promise<'success' | 'cancelled'> }`. La versione demo apre `CheckoutDemoModal` (Compito 13) e, se va a buon fine, aggiunge le gemme.

- [ ] **Passo 1: test**
  - `spendGems` chiamata due volte di fila con 15 gemme e costo 10: la prima dà `true`, la seconda `false`, e il saldo resta 5;
  - con `localStorage` che lancia errori a ogni chiamata, `addGems(10)` funziona e il saldo in memoria sale di 10;
  - `reset()` riporta a `initialProfile()`.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare. Commit "feat: store del giocatore e prese demo".

### Task 10: Aspetto, componenti base e guscio dell'app

**File:**
- Modifica `src/app/globals.css`, `src/app/layout.tsx`
- Crea:
  - `src/app/app/layout.tsx`
  - `src/ui/{GameButton,GemCounter,StreakFlame,DayStreak,BottomNav,TopBar,Logo,Sheet,Modal}.tsx`
  - `src/lib/sound.ts`, `src/lib/haptics.ts`, `src/lib/theme.ts`
- Test: `tests/ui/GameButton.test.tsx`

**Colori** (variabili CSS su `:root[data-theme=dark]`, tema scuro di partenza):

| Variabile | Scuro | Chiaro |
|---|---|---|
| `--bg` | `#0B0F2A` | `#F6F5FF` |
| `--bg-elev` | `#141A3D` | `#FFFFFF` |
| `--surface` | `#1C2350` | `#ECEEFF` |
| `--text` | `#F2F4FF` | `#12163A` |
| `--muted` | `#A3A9D1` | `#5A6090` |
| `--primary` | `#7C5CFF` | come lo scuro |
| `--primary-press` | `#5B3FE0` | come lo scuro |
| `--gem` | `#FFC83D` | come lo scuro |
| `--fire` | `#FF7A1A` | come lo scuro |
| `--ok` | `#2ED47A` | `#18A85B` |
| `--bad` | `#FF4D5E` | `#E5354A` |

Un piccolo script in linea nel `<head>` imposta `data-theme` prima che la pagina venga disegnata, leggendo le impostazioni salvate (dentro try/catch) e la preferenza di sistema.

**Caratteri:** `@fontsource-variable/bricolage-grotesque` per i titoli e `@fontsource-variable/inter` per i testi.

**Componenti:**
- `GameButton({ variant: 'primary' | 'secondary' | 'gem' | 'ghost', size, ...props })`: ha un "bordo" sotto di 4 px che va a 0 quando si preme.
- `GemCounter({ value })`: il numero si anima quando cambia.
- `StreakFlame({ value })`: la fiamma cresce a 5, 10, 25 e 50.
- `BottomNav`: tre voci, Gioca (`/app/`), Negozio (`/app/negozio/`), Profilo (`/app/profilo/`).

**Suoni e vibrazione:**
- `sound.ts`: `play(name: 'tap' | 'correct' | 'wrong' | 'gem' | 'record' | 'tick' | 'chest')`, suoni sintetizzati con Web Audio. L'AudioContext si crea al primo tocco ed è muto se `settings.sound` è falso.
- `haptics.ts`: `vibrate(kind: 'ok' | 'bad')`, che non fa nulla se `navigator.vibrate` manca o se `settings.haptics` è falso.

- [ ] **Passo 1: test.** `GameButton` disabilitato non chiama `onClick`.
- [ ] **Passo 2:** esegui il test: deve fallire. Implementa. Esegui di nuovo: deve passare.
- [ ] **Passo 3:** controlla nel browser `/app/` con `npm run dev`: il guscio si vede sia col tema scuro sia col chiaro.
- [ ] **Passo 4:** commit "feat: aspetto e componenti base".

### Task 11: Home dell'app e Profilo

**File:**
- Crea `src/app/app/page.tsx`, `src/app/app/profilo/page.tsx`
- Crea `src/ui/{DailyChest,DailyChallengeCard,CategoryCard,StatsTable,SettingsList,LevelBadge}.tsx`

**Home dell'app**, dall'alto in basso:
1. `TopBar` con giorni di fila e gemme;
2. `DailyChest`, solo se `chestAvailable`: tocco → animazione di apertura → `openChest()` → gemme che volano nel contatore;
3. `DailyChallengeCard`, con lo stato "Da giocare", "Fatta: 8/10" o "Torna domani";
4. pulsante grande "Gioca Mix Tutto";
5. griglia di `CategoryCard`, ognuna con nome, icona, colore e record personale.

Il link di ogni scheda è `/app/gioca/?c=<id>`.

**Profilo:**
- `LevelBadge`, con la barra dei punti esperienza;
- giorni di fila;
- `StatsTable`, con record e percentuale per categoria;
- `SettingsList`: suoni, vibrazione, timer (attivo o "modalità rilassata"), tema;
- "Azzera i progressi", con un `Modal` di conferma;
- la nota sui marchi.

- [ ] **Passo 1:** implementa, poi verifica nel browser:
  - il forziere si apre una volta sola e dà 10 gemme il primo giorno;
  - le impostazioni restano dopo aver ricaricato la pagina;
  - l'azzeramento chiede conferma.
- [ ] **Passo 2:** `npm run typecheck && npm test`, poi commit "feat: home dell'app e profilo".

### Task 12: Schermata di gioco, salvataggio della streak, fine partita

**File:**
- Crea `src/app/app/gioca/page.tsx`, che legge `?c=` con `useSearchParams` dentro `<Suspense>`; con un valore non valido usa `'mix'`
- Crea `src/ui/{QuestionCard,AnswerGrid,TimerBar,HintBar,SaveStreakModal,VideoAdModal,RunSummary,Confetti}.tsx`
- Crea `src/lib/countdown.ts`, `src/lib/share.ts`
- Test: `tests/lib/countdown.test.ts`, `tests/ui/SaveStreakModal.test.tsx`, `tests/ui/AnswerGrid.test.tsx`

**Interfacce prodotte:**
- `shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'>`: usa `navigator.share` se c'è, altrimenti `navigator.clipboard.writeText`. Si usa anche nel Compito 14.
- `createCountdown(totalMs: number, onEnd: () => void, now = () => performance.now())`, che restituisce `{ start(); pause(); resume(); stop(); remainingMs(): number }`.
- `useCountdown(totalMs, { paused, onEnd })`: usa `createCountdown` e chiama `pause` quando `document.visibilityState === 'hidden'`.

**Flusso della partita**, guidato dalle funzioni del Compito 7:
1. **Domanda:** la `TimerBar` dura 20 s se `settings.timer` è attivo.
2. **Risposta:** con `answer()` il pulsante diventa verde o rosso.
   - **Giusta:** suono, vibrazione, la fiamma pulsa, eventuali gemme volano nel contatore; dopo 800 ms `next()`.
   - **Sbagliata:** il pulsante trema e quello giusto si illumina; dopo 1.200 ms `toSaveOffer()`.
3. **`SaveStreakModal`:**
   - conto alla rovescia di 10 s;
   - "Guarda un video GRATIS", attivo solo se `canVideoSave`, che chiama `useAds().showRewarded('save-streak')` e, se l'esito è `'rewarded'`, `saveWithVideo`;
   - "Usa N gemme" (con N = `saveCost(saves)`), che chiama `spendGems(N)` e, se va bene, `saveWithGems`; se le gemme non bastano apre il negozio come `Sheet` sopra la partita e mette il conto alla rovescia in pausa;
   - "Lascia perdere", che chiama `endRun`. Quando il conto arriva a 0 succede la stessa cosa.
4. **`RunSummary`:**
   - chiama `applyRun` una volta sola e mostra streak, eventuale "NUOVO RECORD!" con `Confetti` e il suono `record`, gemme guadagnate più il bonus, percentuale;
   - pulsanti [Gioca ancora] [Cambia categoria] [Condividi]. Condividi manda con `shareOrCopy` il testo `"🔥 Ho fatto una streak di N in <Categoria> su Indovina Tutto! Riesci a battermi?\n<url del sito>"`.
5. **Aiuti:** la `HintBar` mostra 50/50 (5 gemme) e Salta (8 gemme), disattivati se le gemme non bastano.
6. **Avvisi:** l'evento `exhausted` mostra il messaggio "Hai finito tutta la categoria!".
7. **Tastiera:** i tasti 1–4 scelgono la risposta e Invio continua.

**`VideoAdModal`** (demo):
- è a schermo intero;
- ha un riquadro animato con il logo dell'app e la scritta "Spazio video — demo";
- ha un anello di 15 s e il pulsante "Chiudi" attivo solo alla fine;
- se lo chiudi prima, l'esito è `'dismissed'`.

- [ ] **Passo 1: test**
  - `createCountdown` con un orologio finto: avanzando di 10 s, poi `pause()`, poi altri 30 s, restano 10 s;
  - con `visibilitychange` su hidden il tempo non scorre;
  - `SaveStreakModal` mostra "Usa 20 gemme" con `saves = 1`;
  - il pulsante del video è disattivato con `videoSaveUsed`;
  - con i timer finti, a 10 s viene chiamato `onDecline`;
  - con `paused` attivo, `onDecline` non viene chiamato;
  - in `AnswerGrid`, premendo il tasto "2" viene chiamato `onAnswer('b')`; due tocchi rapidi chiamano `onAnswer` una volta sola.
- [ ] **Passo 2:** esegui i test: devono fallire. Implementa. Esegui di nuovo: devono passare.
- [ ] **Passo 3:** verifica nel browser una partita intera di Bandiere:
  - con una risposta sbagliata salvi la streak col video;
  - con una seconda risposta sbagliata la salvi con 10 gemme;
  - alla terza il costo mostrato è 20.
- [ ] **Passo 4:** commit "feat: schermata di gioco e salvataggio della streak".

### Task 13: Negozio

**File:** Crea `src/app/app/negozio/page.tsx`, `src/ui/{Shop,GemPackCard,CheckoutDemoModal}.tsx`. `Shop` si usa sia nella pagina sia nello `Sheet` aperto dalla partita.

**`Shop`:**
- in alto c'è il saldo;
- le 4 schede di `GEM_PACKS` mostrano il prezzo formattato con `Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })` e l'etichetta, se c'è;
- la scheda "Guarda un video: +5 💎" mostra "N/3 oggi" e passa da `showRewarded('shop-gems')`;
- sotto c'è la riga "Modalità demo: nessun addebito".

**`CheckoutDemoModal`:**
- riepilogo con pacchetto e prezzo;
- la nota "Modalità demo: nessun addebito";
- [Conferma acquisto] → animazione di 1,2 s → "Fatto!" → le gemme vengono aggiunte con l'animazione del contatore;
- [Annulla].

- [ ] **Passo 1:** implementa, poi verifica nel browser:
  - comprare 650 gemme aumenta il saldo esattamente di 650;
  - il quarto video del giorno è disattivato;
  - aperto dalla partita, dopo l'acquisto si torna a "Salva la streak!" con il conto alla rovescia che riparte da dove si era fermato.
- [ ] **Passo 2:** commit "feat: negozio demo".

### Task 14: Sfida del giorno

**File:** Crea `src/app/app/sfida/page.tsx`, `src/ui/DailyResult.tsx`

**Svolgimento:**
- usa `dailyQuestions(dateKeyRome(new Date()))`;
- il timer resta attivo, ma non ci sono aiuti né salvataggi;
- le risposte sbagliate non fanno finire la sfida;
- ogni risposta viene salvata subito con `recordDailyAnswer`, così ricaricando la pagina si riparte dalla domanda successiva e non si può rigiocare.

**Alla fine:**
- `finishDaily` aggiunge +15 gemme;
- `DailyResult` mostra la griglia 🟩🟥, il punteggio e "Prossima sfida tra hh:mm";
- [Condividi] usa `shareOrCopy(shareText(...))` e, se il testo è stato copiato, mostra "Copiato!".

- [ ] **Passo 1:** implementa, poi verifica nel browser:
  - ricaricando a metà sfida si riparte dalla domanda giusta;
  - a sfida finita la home mostra "Fatta: N/10";
  - il testo copiato è uguale a quello di `shareText`.
- [ ] **Passo 2:** commit "feat: sfida del giorno".

### Task 15: Sito di presentazione

**File:** Modifica `src/app/page.tsx` · Crea `src/landing/{Hero,DemoQuestion,CategoryShowcase,HowItWorks,DailyTeaser,GemsExplainer,InstallGuide,Faq,Footer,LandingNav}.tsx`

**Sezioni, nell'ordine del progetto (§9):**
1. **`Hero`:** titolo "Quanto ne sai, davvero?" e un sottotitolo sulle 12 categorie e le oltre 1.500 domande; [Gioca gratis] porta a `/app/`.
2. **`DemoQuestion`:** sulla destra, 4 domande d'esempio (con bandiera, capitale, logo e sagoma) si rispondono da sole ogni 2,5 s e la fiamma sale; con `prefers-reduced-motion` resta ferma.
3. **`CategoryShowcase`:** le 12 schede di `CATEGORIES`, ognuna con un esempio.
4. **`HowItWorks`:** i 3 passi Rispondi → Allunga la streak → Salvala.
5. **`DailyTeaser`.**
6. **`GemsExplainer`:** la tabella dei modi per guadagnare gemme, presa da `ECONOMY`.
7. **`InstallGuide`:** le istruzioni per iPhone (Safari → Condividi → Aggiungi alla schermata Home) e Android.
8. **`Faq`:** 6 domande con `<details>`:
   - È gratis?
   - Cosa sono le gemme?
   - Cosa succede se sbaglio?
   - Funziona senza connessione?
   - Dove vengono salvati i miei progressi?
   - Le gemme si pagano davvero?

   La risposta a quest'ultima: per ora è una demo e non si paga nulla.
9. **`Footer`:** "Un gioco carlarcade", admin@carlhost.com e la nota sui marchi.

**Metadati:** titolo, descrizione, Open Graph con un'immagine 1200×630 generata da `scripts/build-assets.ts`, e theme-color.

- [ ] **Passo 1:** implementa, poi verifica nel browser:
  - a 375 px di larghezza non c'è scorrimento orizzontale;
  - a 1.280 px il layout è a due colonne nell'Hero;
  - tutti i link portano a `/app/`.
- [ ] **Passo 2:** commit "feat: sito di presentazione".

### Task 16: App installabile e funzionante senza connessione

**File:** Crea `src/app/manifest.ts`, `scripts/generate-sw.mjs`, `src/ui/InstallHint.tsx`, `src/lib/registerSw.ts` · Test `tests/scripts/generate-sw.test.ts`

**Script di build:** in `package.json`, `build` diventa `next build && node scripts/generate-sw.mjs`.

**Manifest:**
- `name`: "Indovina Tutto", `short_name`: "Indovina";
- `start_url` e `id`: `${base}/app/`, `scope`: `${base}/`;
- `display`: standalone, `orientation`: portrait, `lang`: it;
- colori `#0B0F2A`;
- le icone del Compito 4;
- scorciatoie per "Sfida del giorno" e "Mix Tutto".

**`generate-sw.mjs`**, che gira dopo `next build`:
- elenca i file in `out/`, escluso `sw.js`;
- scrive `out/sw.js` con:
  - `CACHE = 'it-' + <hash dell'elenco>`;
  - all'installazione, il precaricamento di tutti i file;
  - per le navigazioni, prima la rete e poi la copia salvata;
  - per tutto il resto, prima la copia salvata;
  - all'attivazione, la rimozione delle copie vecchie.

  I percorsi tengono conto di `NEXT_PUBLIC_BASE_PATH`.

**Registrazione e invito a installare:**
- `registerSw()` registra `assetUrl('sw.js')` solo in produzione;
- `InstallHint` raccoglie `beforeinstallprompt` su Android e su iOS mostra le istruzioni. Compare una volta, dopo la seconda partita, e si può chiudere.

- [ ] **Passo 1: test.** `generate-sw.mjs`, lanciato su una cartella finta con due file e `NEXT_PUBLIC_BASE_PATH=/indovina-tutto`, produce un `sw.js` che contiene `'/indovina-tutto/index.html'`, e il nome della cache cambia se cambia l'elenco dei file.
- [ ] **Passo 2:** esegui il test: deve fallire. Implementa. Esegui di nuovo: deve passare.
- [ ] **Passo 3:** commit "feat: app installabile e offline".

### Task 17: Verifica completa

- [ ] **Passo 1:** `npm run typecheck && npm test`. Tutto deve essere verde.
- [ ] **Passo 2:** fai la build di produzione con `NEXT_PUBLIC_BASE_PATH=/indovina-tutto`. Poi servi `out/` sotto `/indovina-tutto/` con un piccolo server statico (`scripts/serve-out.mjs`), avviato da `.claude/launch.json`, e aprilo nel browser integrato.
- [ ] **Passo 3:** prova nel browser a 375×812 e a 1.280×800:
  - sito e app;
  - una partita per ognuna delle 12 categorie;
  - Mix Tutto;
  - i due modi di salvare la streak;
  - un acquisto;
  - la sfida del giorno;
  - il tema chiaro e quello scuro;
  - il funzionamento senza connessione dopo il primo caricamento (con `navigator.serviceWorker.controller` presente).

  Nella console non devono esserci errori, e nella rete nessuna richiesta 404.
- [ ] **Passo 4:** rileggi un campione di 50 domande a caso tra tutte le categorie e correggi gli errori.
- [ ] **Passo 5:** commit delle correzioni.

### Task 18: Pubblicazione su GitHub Pages

**File:** Crea `.github/workflows/deploy.yml`, `README.md`

**Workflow:**
- parte a ogni push su `main` e anche a mano;
- passi:
  1. `actions/checkout@v4`;
  2. `actions/setup-node@v4` con `node-version: lts/*` e la cache di npm;
  3. `npm ci`;
  4. `npm test`;
  5. `npm run build` con `NEXT_PUBLIC_BASE_PATH=/indovina-tutto`;
  6. `actions/upload-pages-artifact@v3` con `path: out`;
  7. `actions/deploy-pages@v4`;
- permessi: `pages: write` e `id-token: write`.

**README:**
- cos'è il progetto;
- come avviarlo (`npm i`, `npm run dev`);
- come rigenerare le immagini (`npm run assets`);
- dove si cambiano i numeri del gioco (`src/engine/economy.ts`);
- le prese da collegare per video, pagamenti e account;
- le licenze di flag-icons, simple-icons e world-atlas, con la nota sui marchi.

- [ ] **Passo 1:** crea il repository con `gh repo create backinbusinesss/indovina-tutto --public --source . --remote origin --description "Indovina Tutto — il quiz su tutto di carlarcade"`.
- [ ] **Passo 2:** attiva Pages da workflow con `gh api -X POST repos/backinbusinesss/indovina-tutto/pages -f build_type=workflow`.
- [ ] **Passo 3:** `git push -u origin main`, poi controlla l'esecuzione con `gh run watch`: deve finire in verde.
- [ ] **Passo 4:** apri `https://backinbusinesss.github.io/indovina-tutto/` nel browser integrato. Il sito si carica, `/app/` funziona e le bandiere si vedono.
