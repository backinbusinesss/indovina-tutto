# Indovina Tutto — progetto della versione giocabile

Data: 13 novembre 2026 · Stato: bozza da approvare

Le voci segnate **[scelta mia]** sono decisioni che ho preso io perché la richiesta non le fissava: si possono cambiare.

---

## 1. Perché esiste

Indovina Tutto è il primo gioco di **carlarcade.com**, il marchio di carlhost.com che raccoglie tutte le app. È un quiz su tutto: bandiere, capitali, geografia, fiumi, monti, laghi, loghi e altro. Si guadagna con le **gemme**: si possono comprare con soldi veri e servono a salvare la **streak** (la serie di risposte giuste di fila) quando si sbaglia. In alternativa la streak si salva guardando un video.

Il livello di qualità di riferimento è **Sbobina** (sbobina.carlarcade.com): pagina di presentazione molto curata, app installabile sul telefono, dettagli da prodotto finito. Indovina Tutto deve stare a quel livello ma con un'identità sua, da gioco: ogni app carlarcade ha un aspetto diverso.

**Perché adesso questa versione:** vuoi vederla online e provarla per capire come sta venendo, prima di investire in server, account, pagamenti e pubblicità veri.

## 2. Obiettivi di questa versione

1. **Sito di presentazione** su `/`, per convincere chi arriva a giocare.
2. **Web app** su `/app`, installabile sul telefono (PWA). Funziona anche senza connessione, è pensata prima di tutto per il telefono in verticale ed è pronta per essere messa dentro una webview in futuro.
3. **Gioco completo**: 12 categorie, oltre 1.500 domande, streak, gemme, negozio, video per salvare la streak, sfida del giorno e statistiche.
4. **Pubblicata su GitHub** nel tuo account e **online su GitHub Pages**, così la provi da qualsiasi telefono.
5. **Già predisposta** per aggiungere dopo account, pagamenti veri e pubblicità vera senza riscrivere il gioco (vedi §12).

## 3. Cosa NON fa questa versione

- Niente account: i progressi restano nel browser di chi gioca.
- Niente soldi veri: il negozio è **simulato** ("Modalità demo: nessun addebito") e le gemme vengono accreditate subito.
- Niente pubblicità vera: il video è un **video di prova** di 15 secondi, che funziona come quello vero.
- Niente classifiche online e niente sfide tra amici in tempo reale.
- Niente app negli store: la webview per Android/iOS arriverà dopo.
- Niente pagine legali definitive (privacy, condizioni di vendita, recesso): serviranno prima di attivare i pagamenti veri.

## 4. Cosa la farebbe fallire anche se "funziona"

- **Sembra un quiz qualsiasi**: aspetto da modello già visto, senza cura nelle animazioni e nei suoni.
- **Domande sbagliate**: una sola capitale o un solo fiume sbagliato fa perdere fiducia. Le domande devono essere verificate e i fatti stabili nel tempo.
- **Sensazione di trappola per soldi**: video obbligatori, pulsanti ingannevoli, gemme impossibili da guadagnare giocando. Si deve poter giocare bene anche senza pagare.
- **Lenta sul telefono**, oppure che si rompe senza connessione.
- **Copia di un gioco esistente** nel nome, nell'aspetto o nei personaggi.

## 5. Vincoli

- Lingua: **italiano**.
- Hosting gratuito su GitHub Pages: niente server né database, solo pagine statiche. Il repository dev'essere **pubblico**, come i tuoi altri siti.
- Indirizzo provvisorio: `https://backinbusinesss.github.io/indovina-tutto/`. Più avanti `indovinatutto.carlarcade.com` o il tuo server.
- Stessa base tecnica di Sbobina (Next.js), così il passaggio al tuo server è diretto.
- Immagini solo da fonti con licenza libera (vedi §11).
- I loghi sono marchi registrati: nella categoria compare la nota "I marchi appartengono ai rispettivi proprietari".

## 6. Approcci considerati

| Approccio | Pro | Contro |
|---|---|---|
| **A. Prima il gioco, poi il server** ← scelto da te | Online subito su GitHub Pages; il codice è già Next.js e passa sul tuo server senza rifare niente | Per ora non incassa |
| B. Tutto subito come Sbobina (account, database, Stripe) | Gemme salvate sul server, incassi veri | Da qui non posso pubblicarla sul tuo server; molto più tempo prima di vederla; negli store servono comunque gli acquisti di Google e Apple |
| C. Pagina HTML singola, senza Next.js | La più veloce da fare | Non regge un prodotto premium né il passaggio al server: andrebbe riscritta |

## 7. Il gioco

### 7.1 Categorie

| # | Categoria | Tipo | Domande (minimo) | Come nascono |
|---|---|---|---|---|
| 1 | **Bandiere** | immagine | 390 (195 paesi × 2 versi) | generate dai dati dei paesi |
| 2 | **Capitali** | testo | 390 (2 versi) | generate, nomi delle capitali in italiano scritti a mano |
| 3 | **Sagome dei paesi** | immagine | 150 | generate da una mappa del mondo |
| 4 | **Loghi** | immagine | 120 | selezione di marchi noti |
| 5 | **Fiumi** | testo | 60 | scritte a mano |
| 6 | **Monti e vulcani** | testo | 50 | scritte a mano |
| 7 | **Laghi e mari** | testo | 50 | scritte a mano |
| 8 | **Geografia** (continenti, confini, record) | testo | 150 | in parte generate (continente di ogni paese), in parte a mano |
| 9 | **Monumenti e città** | testo | 80 | scritte a mano |
| 10 | **Valute e lingue** | testo | 120 | generate + revisione |
| 11 | **Cucina dal mondo** | testo | 60 | scritte a mano |
| 12 | **Italia** (regioni, capoluoghi, curiosità) | testo | 100 | scritte a mano |

I paesi sono i **193 membri dell'ONU più Vaticano e Palestina** (osservatori ONU), cioè 195 **[scelta mia]**: si evitano le discussioni sui casi controversi.

Ogni domanda ha una **difficoltà da 1 a 3**. Per bandiere, capitali e sagome la difficoltà dipende da quanto è conosciuto il paese: Francia facile, Burkina Faso difficile.

**Solo fatti verificabili e stabili**: niente opinioni e niente numeri che cambiano ogni anno, come la popolazione esatta.

**Sagome dei paesi**: si usano solo i paesi con una forma riconoscibile. Sono esclusi i microstati (Vaticano, Monaco…) e gli arcipelaghi troppo frammentati, per questo il minimo è 150 e non 195. La mappa è quella a dettaglio medio (1:50 milioni), così le coste non sembrano spigolose.

**Valute e lingue**: i nomi delle valute in italiano non esistono già pronti in un pacchetto, quindi la tabella "paese → valuta, lingua" viene scritta a mano. Da quella si generano le domande.

### 7.2 Tipi di domanda

- **Immagine → 4 risposte di testo**: "Di quale paese è questa bandiera?"
- **Testo → 4 immagini**: "Qual è la bandiera del Perù?"
- **Testo → 4 risposte di testo**: "Qual è la capitale dell'Australia?"

Le risposte sbagliate sono **plausibili**: per una bandiera africana si propongono altri paesi africani, per un fiume si propongono altri fiumi. Le opzioni sono sempre 4, tutte diverse, e l'ordine cambia ogni volta.

### 7.3 La partita e la streak

- Si sceglie una categoria, oppure **Mix Tutto** (domande da tutte le categorie).
- Le domande arrivano una dopo l'altra. Ogni risposta giusta aumenta la **streak** 🔥.
- La difficoltà **sale con la streak**: dopo 10 giuste arrivano più domande di livello 2, dopo 25 di livello 3 **[scelta mia]**.
- **Timer di 20 secondi** per domanda: se scade, conta come risposta sbagliata **[scelta mia]**. Si può disattivare dalle impostazioni ("modalità rilassata").
- **Aiuti a pagamento in gemme**: **50/50** (toglie due risposte sbagliate) e **Salta** (passa alla prossima senza perdere la streak).
- La partita finisce con un errore, se non si salva la streak.
- Nella stessa partita una domanda non si ripete. Se le domande di una categoria finiscono, compare "Hai finito tutta la categoria!" e la partita continua con le domande mescolate da capo.
- **Mix Tutto** ha un record separato da quello delle singole categorie.

### 7.4 Salvare la streak

Quando sbagli compare la schermata **"Salva la streak!"**, con un conto alla rovescia di 10 secondi:

```
┌─────────────────────────────┐
│        🔥 23 di fila         │
│     Non perdere la streak!   │
│                              │
│  [▶ Guarda un video  GRATIS] │  ← una volta per partita
│  [💎 Usa 10 gemme          ] │  ← 10, poi 20, poi 40… nella stessa partita
│                              │
│        Lascia perdere        │
│  ━━━━━━━━━━━━━━━━━━━━  8s    │
└─────────────────────────────┘
```

- **Video**: gratis, **una volta per partita** **[scelta mia]**. In questa versione è un video di prova di 15 secondi che non si può saltare.
- **Gemme**: il costo **raddoppia** a ogni salvataggio nella stessa partita: 10 → 20 → 40 → 80 **[scelta mia]**.
- Se non hai abbastanza gemme, il pulsante apre il negozio sopra la partita. Il conto alla rovescia si ferma mentre sei nel negozio e, dopo l'acquisto, torni a "Salva la streak!".
- Dopo il salvataggio si riparte da una domanda nuova con la streak intatta.

### 7.5 Gemme 💎

Tutti i valori stanno in **un solo file di configurazione**, così si possono regolare senza toccare il resto **[scelta mia per tutti i numeri]**.

| Come si guadagnano | Quante |
|---|---|
| Regalo di benvenuto | 50 |
| Ogni 5 risposte giuste di fila | +1 |
| Nuovo record in una categoria | +5 |
| Premio giornaliero (aumenta con i giorni di fila, fino a 30) | 10–30 |
| Sfida del giorno completata | +15 |
| Video nel negozio (massimo 3 al giorno) | +5 |

| Come si spendono | Quante |
|---|---|
| Salvare la streak | 10, 20, 40, 80… |
| 50/50 | 5 |
| Salta | 8 |

**Negozio (simulato)**:

| Pacchetto | Prezzo mostrato | Etichetta |
|---|---|---|
| 120 💎 | 0,99 € | |
| 650 💎 | 4,99 € | +10% |
| 1.400 💎 | 9,99 € | Il più scelto |
| 3.000 💎 | 19,99 € | Miglior valore |

Quando si compra compare una schermata che sembra un vero pagamento ma dice chiaramente **"Modalità demo: nessun addebito"**. Poi le gemme vengono accreditate con un'animazione.

### 7.6 Sfida del giorno

- **10 domande miste, uguali per tutti** nello stesso giorno, scelte in base alla data italiana (fuso di Roma). Il timer resta attivo, aiuti e salvataggi no: tutti giocano alle stesse condizioni. Non finisce al primo errore: si rispondono tutte e 10 e conta il punteggio su 10.
- Si gioca una volta al giorno. Il risultato si **condivide** come testo con quadratini 🟩🟥, come nei giochi a parola del giorno, tramite il pulsante Condividi del telefono.
- Completarla vale +15 💎.

### 7.7 Giorni di fila, livello e statistiche

- **Giorni di fila**: si conta un giorno se giochi almeno una partita. È mostrato con la fiammella accanto alle gemme e fa crescere il premio giornaliero **[scelta mia]**.
- **Premio giornaliero**: un forziere in cima alla home, che si apre una volta al giorno con un'animazione e dà da 10 gemme (primo giorno) fino a 30 (dal settimo giorno di fila in poi).
- **Livello**: 1 punto esperienza per ogni risposta giusta, con livelli a soglie crescenti. È solo per la soddisfazione: niente si sblocca col livello **[scelta mia]**.
- **Statistiche per categoria**: record di streak, percentuale di risposte giuste, partite giocate.

## 8. Schermate dell'app

**Home dell'app**
```
┌─────────────────────────────┐
│ Indovina Tutto    🔥5   💎120│
│                              │
│ ┌──────────────────────────┐ │
│ │ ☀ SFIDA DEL GIORNO        │ │
│ │ 10 domande · +15 💎  [▶]  │ │
│ └──────────────────────────┘ │
│ [  ▶  GIOCA MIX TUTTO      ] │
│                              │
│ ┌────────┐ ┌────────┐        │
│ │🏳 Band. │ │🏛 Capit.│  ...  │
│ │rec. 34 │ │rec. 12 │        │
│ └────────┘ └────────┘        │
├─────────────────────────────┤
│  Gioca   Negozio   Profilo   │
└─────────────────────────────┘
```

**Domanda**
```
┌─────────────────────────────┐
│ ✕        🔥 12          💎120│
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← timer
│      ┌────────────────┐      │
│      │   [bandiera]   │      │
│      └────────────────┘      │
│ Di quale paese è questa      │
│ bandiera?                    │
│ [ Romania               ]    │
│ [ Ciad                  ]    │
│ [ Andorra               ]    │
│ [ Moldavia              ]    │
│     [½ 50/50 · 5💎] [⏭ Salta · 8💎] │
└─────────────────────────────┘
```

- **Risposta giusta**: il pulsante diventa verde, si sente un suono, il contatore 🔥 "salta", e dopo 0,8 secondi arriva la domanda successiva.
- **Risposta sbagliata**: il pulsante diventa rosso e trema, quello giusto si illumina, poi compare "Salva la streak!".

**Fine partita**: streak raggiunta, eventuale **NUOVO RECORD** con coriandoli, gemme guadagnate, percentuale di risposte giuste, e i pulsanti [Gioca ancora] [Cambia categoria] [Condividi].

**Negozio**: i pacchetti di gemme, il video per +5 💎 e la nota sulla modalità demo.

**Profilo**: livello, giorni di fila, statistiche per categoria. Impostazioni: suoni, vibrazione, timer sì/no, tema chiaro/scuro/automatico, azzera i progressi (con conferma).

## 9. Sito di presentazione (`/`)

Stessa struttura di Sbobina, con un linguaggio da gioco:

1. **In alto**: titolo forte ("Quanto ne sai, davvero?"), sottotitolo, pulsante **Gioca gratis**. A destra una **domanda animata** che si risponde da sola e fa salire la streak, come il foglio di appunti animato di Sbobina.
2. **Le categorie**: griglia con un'anteprima di ogni categoria.
3. **Come funziona**: Rispondi → Allunga la streak → Salvala quando sbagli.
4. **Sfida del giorno**: cos'è e perché tornare ogni giorno.
5. **Gemme**: cosa sono e come si guadagnano anche senza pagare.
6. **Installala sul telefono**: istruzioni per iPhone e Android, come in Sbobina.
7. **Domande frequenti**.
8. **Fondo pagina**: "Un gioco carlarcade", contatto (lo stesso indirizzo di Sbobina, admin@carlhost.com) **[scelta mia]** e nota sui marchi.

## 10. Aspetto e sensazione

- **Identità propria [scelta mia]**: fondo blu notte profondo, accento **viola elettrico** per i pulsanti, **oro** per le gemme, **arancio-fuoco** per la streak, verde e rosso per giusto e sbagliato. Tema scuro di partenza, tema chiaro disponibile.
- **Caratteri**: Bricolage Grotesque per i titoli (lo stesso di Sbobina, così si sente la "famiglia" carlarcade) e Inter per i testi. Inclusi nel sito, senza dipendere da Google Fonts.
- **Pulsanti "da gioco"**: arrotondati e con spessore, si abbassano quando li premi.
- **Movimento**: transizioni tra le domande, il contatore 🔥 che pulsa e cresce con la streak, coriandoli sui record, gemme che volano nel contatore quando le guadagni. Tutto rispetta l'impostazione "riduci movimento" del telefono.
- **Suoni**: generati dal codice (giusto, sbagliato, gemme, record), senza file audio. Si possono disattivare.
- **Vibrazione**: breve su giusto/sbagliato, dove il telefono la supporta (Android).
- **Logo [scelta mia]**: un simbolo semplice in SVG, un punto interrogativo dentro un globo stilizzato. Da sostituire se ne hai già uno.
- **Tastiera**: su computer si risponde con i tasti 1–4.

## 11. Tecnica

- **Next.js + TypeScript + Tailwind CSS**, esportato come **sito statico** per GitHub Pages. Il prefisso `/indovina-tutto` si imposta da una variabile, così con un dominio proprio basta toglierlo.
- **Stato del gioco**: Zustand, salvato nel browser. Il formato dei dati ha un **numero di versione**, così si potrà trasferire su un server in futuro. Se il browser non permette di salvare, il gioco funziona lo stesso e non salva i progressi.
- **App installabile**: manifest con icone, colori e scorciatoie, più un service worker che rende tutto disponibile senza connessione.
- **Immagini (tutte con licenza libera)**:
  - bandiere: pacchetto `flag-icons` (licenza MIT), file SVG;
  - loghi: pacchetto `simple-icons` (licenza CC0), solo una selezione;
  - sagome dei paesi: mappa `world-atlas` (licenza ISC), trasformata in SVG quando si costruisce il sito.
- **Nomi dei paesi in italiano**: pacchetto `i18n-iso-countries`. Le capitali in italiano sono scritte a mano (Londra, Mosca, Pechino…).
- **Pubblicazione**: repository pubblico `backinbusinesss/indovina-tutto`. A ogni modifica sul ramo principale, una GitHub Action costruisce il sito e lo pubblica su Pages.

## 12. Pronti per dopo (punti di aggancio)

Tre "prese" nel codice, ognuna con la versione di prova oggi e quella vera domani:

| Presa | Oggi | Domani |
|---|---|---|
| **Video premiati** | video di prova | Google AdSense per i giochi H5 sul web, AdMob nella webview |
| **Pagamenti** | negozio demo | Stripe/PayPal sul web (come Sbobina), Google Play Billing e Apple In-App negli store |
| **Profilo e gemme** | salvati nel browser | account e database sul tuo server, con le gemme controllate dal server |

## 13. Verifiche

- **Test automatici del motore**: ogni domanda ha 4 opzioni diverse con quella giusta inclusa; i costi dei salvataggi raddoppiano; la sfida del giorno è uguale per la stessa data; le gemme non vanno mai sotto zero.
- **Test sui contenuti**: ogni bandiera, sagoma e logo ha il suo file; nessuna domanda doppia; ogni categoria raggiunge il numero minimo di domande.
- **Prova reale**: build statica avviata e partita giocata nel browser, sia su schermo da telefono sia da computer, prima di pubblicare.
- **Controllo dei fatti**: le domande scritte a mano vengono ricontrollate una per una.

## 14. Scelte mie da controllare mentre leggi

1. Timer di 20 secondi, disattivabile.
2. Video gratis **una volta per partita**; con le gemme il costo raddoppia (10 → 20 → 40…).
3. Tutti i numeri delle gemme (§7.5) e i prezzi dei pacchetti.
4. Le 12 categorie e i 195 paesi.
5. Colori: blu notte, viola, oro, fuoco. Caratteri presi da Sbobina.
6. Giorni di fila e livello inclusi, ma il livello non sblocca nulla.
7. Repository pubblico `indovina-tutto` su GitHub Pages.
8. Sfida del giorno: 10 domande tutte da rispondere, con il timer, senza aiuti né salvataggi.
9. Contatto nel fondo pagina: admin@carlhost.com.

## 15. Lasciato a chi costruisce

Struttura delle cartelle, nomi dei componenti, curve esatte delle animazioni, soglie dei livelli, testi delle domande frequenti, ordine delle categorie nella home e scelta dei loghi da includere (marchi noti in Italia, vari per settore).
