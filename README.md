# Indovina Tutto

Il quiz su tutto di **carlarcade**: bandiere, capitali, sagome dei paesi, loghi, animali, storia, scienza, spazio, sport, arte, musica e cinema, geografia, fiumi, monti, laghi, monumenti, valute, cucina e Italia. Oltre 2.400 domande in 19 categorie, con streak, gemme, negozio, video premiati e sfida del giorno.

- Sito: `/` · App: `/app/` (installabile, funziona offline)
- Online: https://backinbusinesss.github.io/indovina-tutto/

## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # test automatici
npm run build      # sito statico in out/ (+ service worker)
npm run assets     # rigenera bandiere, sagome, loghi, icone e anteprima social
```

Per una build sotto un sottopercorso (come GitHub Pages) imposta `NEXT_PUBLIC_BASE_PATH=/indovina-tutto`.

## Dove si cambia cosa

- Numeri del gioco (gemme, costi, timer, pacchetti): `src/engine/economy.ts`
- Domande scritte a mano: `src/content/questions/*.ts` · paesi: `src/content/countries.ts` · loghi: `src/content/logos.ts`
- Categorie (nome, colore, icona): `src/content/categories.ts`

## Prese da collegare per la versione completa

| Presa | Oggi | Domani |
|---|---|---|
| Video premiati (`src/providers/ads.tsx`) | video demo di 15 s | AdSense per giochi H5 / AdMob nella webview |
| Pagamenti (`src/providers/payments.tsx`) | negozio demo, nessun addebito | Stripe/PayPal sul web, Google Play Billing e Apple In-App negli store |
| Profilo (`src/store/profile.ts`) | salvato nel browser | account e gemme sul server |

## Licenze delle immagini

Bandiere: [flag-icons](https://github.com/lipis/flag-icons) (MIT) · Loghi: [Simple Icons](https://simpleicons.org) (CC0) · Mappe: [world-atlas](https://github.com/topojson/world-atlas) / Natural Earth (ISC, pubblico dominio).
I marchi appartengono ai rispettivi proprietari.
