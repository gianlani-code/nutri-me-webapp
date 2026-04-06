# Deploy e test di NUTRI-ME

## Cosa e stato preparato

- `avatar-assets.js`: file caricato prima di `script.js`. Se contiene avatar incorporati, l'app usa quelli.
- `scripts/generate-avatar-assets.ps1`: converte gli avatar reali in data URI dentro `avatar-assets.js`.
- `scripts/export-github-pages.ps1`: crea una cartella separata con solo i file necessari da caricare su GitHub Pages, evitando `node_modules` e gli altri file di sviluppo.
- `netlify.toml`: configurazione pronta per Netlify.
- `.nojekyll`: utile per GitHub Pages statico.
- `app-config.example.js`: esempio di configurazione frontend condivisa per puntare tutti i dispositivi alla stessa function pubblica.
- `app-config.js`: puo essere pubblicato nel repository o insieme ai file statici, perche contiene solo gli URL pubblici del backend e non segreti.
- `api/auth.js`: endpoint backend per registrazione, login e salvataggio dati profilo condivisi tra dispositivi.

## 0. Problema dei piu di 100 file su GitHub

Se provi a caricare l'intera cartella `APP +` dal browser, il numero di file sale facilmente oltre 100 soprattutto a causa di `node_modules/` e di file di sviluppo che non servono al frontend pubblicato.

Per GitHub Pages non devi caricare l'intero progetto: ti basta una versione ridotta del frontend.

Usa questo comando PowerShell dalla cartella del progetto:

```powershell
Set-Location "c:\Users\gianl\OneDrive\Desktop\APP +"
.\scripts\export-github-pages.ps1
```

Lo script genera una cartella separata chiamata `APP+-github-upload` sul Desktop con solo i file necessari al funzionamento dell'app su GitHub Pages.

In questo modo:

- non carichi `node_modules/`;
- resti ampiamente sotto il limite dei file;
- lasci inalterate le funzionalita del frontend;
- mantieni gli avatar reali perche vengono incorporati anche in `avatar-assets.js`.

## Nota costi

L'architettura prevista qui resta gratuita finche resti nei limiti dei piani free usati:

- hosting statico: GitHub Pages oppure Netlify free;
- backend function: Netlify Functions free tier;
- modello AI: Gemini con quota gratuita disponibile sul tuo account Google AI Studio.

Per ridurre i 429 sul free tier, il backend puo usare un modello primario, fallback automatici su piu modelli Gemini e anche una seconda chiave/progetto Gemini separata come backup operativo.

La chiave Gemini non viene distribuita al browser: resta lato server nella function.

## 1. Versione con avatar incorporati

Dopo aver cambiato una o piu foto dentro `avatars/`, esegui PowerShell nella cartella del progetto:

```powershell
Set-Location "c:\Users\gianl\OneDrive\Desktop\APP +"
.\scripts\generate-avatar-assets.ps1
```

Questo aggiorna `avatar-assets.js` con le immagini reali incorporate. Dopo il deploy o l'apertura della pagina, il telefono non dipendera piu dal download separato di `avatars/*.jpg`.

## 2. Pubblicazione su GitHub Pages

1. Crea un repository GitHub e carica questi file:
   - `index.html`
   - `style.css`
   - `script.js`
   - `avatar-assets.js`
   - `avatars/`
   - `.nojekyll`
2. Vai in `Settings > Pages`.
3. In `Build and deployment`, scegli `Deploy from a branch`.
4. Seleziona branch `main` e folder `/ (root)`.
5. Salva e attendi l'URL pubblicato.

Nota: se usi `avatar-assets.js` aggiornato, anche se la cartella `avatars` avesse problemi, gli avatar incorporati continueranno a funzionare.

### Backend condiviso da GitHub Pages o da altri host statici

GitHub Pages non esegue funzioni serverless. Se il frontend viene pubblicato li, devi puntare la UI a endpoint pubblici gia deployati altrove.

1. Crea o aggiorna `app-config.js` nella root del progetto partendo da `app-config.example.js`.
2. Imposta `authFunctionUrl` e `geminiFunctionUrl` con URL assoluti pubblici, ad esempio `https://tuo-progetto.vercel.app/api/auth` e `https://tuo-progetto.vercel.app/api/gemini`.
3. Pubblica anche `app-config.js` insieme agli altri file statici oppure versionalo nel repository, dato che non contiene segreti.

In questo modo ogni dispositivo che apre il sito usa lo stesso backend condiviso sia per Gemini sia per autenticazione, senza configurazioni manuali nel browser.

Come rete di sicurezza, il client include anche un endpoint pubblico di fallback integrato: se `app-config.js` non viene caricato, continua comunque a tentare il backend pubblico condiviso.

Per rendere Gemini disponibile a qualunque dispositivo o utente, lascia la function in modalita pubblica con `GEMINI_CORS_MODE=public`. Solo se vuoi restringere gli accessi devi usare una allowlist con `GEMINI_CORS_MODE=restricted` e `GEMINI_ALLOWED_ORIGINS`.

## 3. Pubblicazione su Netlify

### Drag and drop

1. Esegui prima `./scripts/generate-avatar-assets.ps1`.
2. Apri Netlify.
3. Trascina dentro l'intera cartella `APP +`.
4. Attendi l'URL finale.

5. In `Site configuration > Environment variables`, imposta `GEMINI_API_KEY`.
6. Per accesso pubblico da qualunque dispositivo, imposta `GEMINI_CORS_MODE=public` oppure non impostarlo affatto.
7. Usa `GEMINI_ALLOWED_ORIGINS` solo se vuoi una allowlist volontaria con `GEMINI_CORS_MODE=restricted`.
8. Facoltativo: regola `GEMINI_TIMEOUT_MS` e `GEMINI_MAX_RETRIES` se vuoi aumentare tolleranza ai timeout o ai 429.
9. Se noti che alcuni modelli vanno spesso in quota o degradano la latenza, puoi anche usare `GEMINI_MODEL_FAILURE_COOLDOWN_MS` e `GEMINI_MODEL_QUOTA_COOLDOWN_MS` per saltarli temporaneamente nelle richieste successive.
10. Per evitare che la function serverless esaurisca il tempo massimo di esecuzione, puoi regolare anche `GEMINI_TOTAL_BUDGET_MS`: il backend interrompe in modo controllato i tentativi prima che Vercel tronchi la richiesta.
11. Per ridurre i 429 sul free tier, imposta `GEMINI_MODEL=gemini-2.0-flash` e `GEMINI_FALLBACK_MODELS=gemini-2.0-flash-lite,gemini-flash-lite-latest`.
12. Se vuoi un backup reale su un secondo progetto Gemini, aggiungi anche `GEMINI_BACKUP_API_KEY`, `GEMINI_BACKUP_MODEL` e `GEMINI_BACKUP_FALLBACK_MODELS`.
13. Questo e il setup gratuito consigliato: non richiede servizi a pagamento ne configurazioni per singolo dispositivo.

### Da repository Git

1. Carica il progetto su GitHub.
2. In Netlify scegli `Add new site > Import an existing project`.
3. Seleziona il repository.
4. Publish directory: `.`
5. Deploy.
6. In `Site configuration > Environment variables`, imposta `GEMINI_API_KEY`.
7. Se vuoi l'endpoint pubblico per tutti i dispositivi, imposta `GEMINI_CORS_MODE=public` oppure non impostarlo.
8. Usa `GEMINI_ALLOWED_ORIGINS` solo se scegli esplicitamente `GEMINI_CORS_MODE=restricted`.
9. Per ridurre i 429 sul free tier, imposta `GEMINI_MODEL=gemini-2.0-flash` e `GEMINI_FALLBACK_MODELS=gemini-2.0-flash-lite,gemini-flash-lite-latest`.
10. Se noti che alcuni modelli iniziali rallentano spesso la catena di fallback, puoi impostare anche `GEMINI_MODEL_FAILURE_COOLDOWN_MS` e `GEMINI_MODEL_QUOTA_COOLDOWN_MS` per metterli temporaneamente in cooldown.
11. Se vuoi un backup reale su un secondo progetto Gemini, aggiungi anche `GEMINI_BACKUP_API_KEY`, `GEMINI_BACKUP_MODEL` e `GEMINI_BACKUP_FALLBACK_MODELS`.

Se pubblichi frontend e function sullo stesso sito Netlify, la generazione Gemini diventa disponibile da qualunque dispositivo tramite l'URL pubblico del sito.

## 4. Prova corretta in LAN

Funziona solo se telefono e PC sono nella stessa rete Wi-Fi.

### Server locale con Python

```powershell
Set-Location "c:\Users\gianl\OneDrive\Desktop\APP +"
python -m http.server 8000 --bind 0.0.0.0
```

Poi apri dal telefono:

```text
http://IP_DEL_PC:8000
```

Per trovare l'IP del PC:

```powershell
ipconfig
```

Usa l'indirizzo IPv4 della scheda Wi-Fi, per esempio `192.168.1.25`, quindi dal telefono apri:

```text
http://192.168.1.25:8000
```

## 5. Perche da rete diversa non si vedono

Se il telefono e su una rete diversa dal PC, un server locale del PC non e pubblicamente raggiungibile a meno di configurare port forwarding, DNS o un tunnel pubblico. In quel caso serve una pubblicazione vera su GitHub Pages o Netlify.

## 6. Flusso consigliato

1. Cambia le foto dentro `avatars/`.
2. Esegui `./scripts/generate-avatar-assets.ps1`.
3. Se usi Netlify, configura `GEMINI_API_KEY` nelle variabili ambiente del sito.
4. Se usi un host statico diverso da Netlify, crea `app-config.js` con l'URL assoluto della function pubblica.
5. Pubblica frontend e backend.
6. Apri l'URL pubblico dal telefono o da qualunque altro dispositivo.

## 7. Architettura consigliata per tutti i dispositivi

- Backend auth: endpoint `api/auth` pubblicato su Vercel e collegato a un archivio condiviso.
- Backend Gemini: una Netlify Function pubblica con `GEMINI_API_KEY` lato server.
- Frontend: puo stare sullo stesso sito Netlify oppure su un altro host statico.
- Se il frontend non sta sullo stesso host del backend: usa `app-config.js` per puntare tutti i client agli stessi endpoint pubblici.

Questa resta la soluzione corretta se non vuoi rendere visibile la chiave nel client.

## 8. Username unici tra dispositivi

Con la sola `localStorage`, username e password restano salvati soltanto nel browser che ha creato l'account. Per renderli davvero unici tra tutti i dispositivi serve un archivio centrale.

Questa versione dell'app supporta due modalita:

- senza backend auth configurato: fallback locale, utile solo per sviluppo o prove sullo stesso device;
- con backend auth configurato: registrazione e login passano da `api/auth`, quindi lo username viene bloccato globalmente dal primo utilizzo.

### Archivio remoto consigliato gratuito

Per rendere persistenti gli utenti del backend `api/auth`, configura un database Redis REST gratuito su Upstash:

1. Crea un database Redis su Upstash.
2. Copia `REST URL` e `REST TOKEN`.
3. In Vercel imposta queste environment variables:
   - `AUTH_KV_REST_URL`
   - `AUTH_KV_REST_TOKEN`
   - `AUTH_TOKEN_SECRET`
   - `AUTH_CORS_MODE=public`
4. Ridistribuisci il progetto.

Con questa configurazione:

- se un utente registra `Davide`, nessun altro potra piu registrare `Davide` o `davide`;
- i dati profilo e diario vengono caricati da backend su qualsiasi dispositivo;
- la sessione resta memorizzata sul singolo device, ma l'account esiste globalmente.

## 9. Alternativa gratuita consigliata: Vercel per la sola function

Se il provider attuale chiede un upgrade per le environment variables, puoi pubblicare solo la function Gemini su Vercel free e lasciare il frontend su GitHub Pages.

1. Vai su Vercel e scegli `Add New > Project`.
2. Importa il repository GitHub che contiene questo progetto.
3. Alla schermata `Configure Project`, lascia framework auto-detected oppure `Other` se non viene rilevato nulla.
4. Apri la sezione `Environment Variables` prima del primo deploy.
5. Inserisci queste variabili:
   - `AUTH_KV_REST_URL` = REST URL del tuo database Upstash Redis;
   - `AUTH_KV_REST_TOKEN` = REST TOKEN del tuo database Upstash Redis;
   - `AUTH_TOKEN_SECRET` = una stringa lunga e casuale per firmare le sessioni;
   - `AUTH_CORS_MODE` = `public`;
   - `GEMINI_API_KEY` = la tua chiave Gemini ruotata e valida;
   - `GEMINI_BACKUP_API_KEY` = opzionale, seconda chiave Gemini su un progetto separato solo per backup;
   - `GEMINI_MODEL` = `gemini-2.0-flash`;
   - `GEMINI_FALLBACK_MODELS` = `gemini-2.0-flash-lite,gemini-flash-lite-latest`;
   - `GEMINI_BACKUP_MODEL` = `gemini-2.0-flash`;
   - `GEMINI_BACKUP_FALLBACK_MODELS` = `gemini-2.0-flash-lite,gemini-flash-lite-latest`;
   - `GEMINI_CORS_MODE` = `public`;
   - `GEMINI_TIMEOUT_MS` = `40000`;
   - `GEMINI_MAX_RETRIES` = `4`;
   - `GEMINI_TOTAL_BUDGET_MS` = `25000`;
   - `GEMINI_RATE_LIMIT_ENABLED` = `true`;
   - `GEMINI_RATE_LIMIT_WINDOW_MS` = `60000`;
   - `GEMINI_RATE_LIMIT_MAX_REQUESTS` = `100`.
   - `GEMINI_MODEL_FAILURE_COOLDOWN_MS` = `20000` opzionale;
   - `GEMINI_MODEL_QUOTA_COOLDOWN_MS` = `90000` opzionale.
6. Lascia vuota `GEMINI_ALLOWED_ORIGINS` se vuoi accesso pubblico da qualsiasi device. Compilala solo se in futuro torni a `GEMINI_CORS_MODE=restricted`.
7. Completa il deploy con `Deploy`.
8. Quando il progetto e online, apri `Settings > Domains` e copia il dominio Vercel finale, ad esempio `https://tuo-progetto.vercel.app`.
9. Verifica gli endpoint pubblici finali: `https://tuo-progetto.vercel.app/api/auth` e `https://tuo-progetto.vercel.app/api/gemini`.
10. Nel frontend crea o aggiorna `app-config.js` impostando `authFunctionUrl` e `geminiFunctionUrl` verso quegli endpoint.
11. Pubblica o aggiorna il frontend statico.
12. Apri il frontend da telefono, desktop e tablet: con `GEMINI_CORS_MODE=public` non serve aggiungere origin manualmente.

In questo schema il frontend resta gratuito su GitHub Pages e la chiave continua a restare solo lato server.

## 10. Strategia gratuita anti-abuso

La function ora include un rate limiting gratuito e leggero, senza servizi esterni.

- Il limite e best-effort per client e finestra temporale, utile per frenare spam o tap ripetuti.
- Su serverless non e una protezione assoluta contro abuso distribuito su molte IP o molte istanze, ma resta la difesa gratuita piu semplice da mantenere.
- Se vuoi piu margine per utenti reali, aumenta `GEMINI_RATE_LIMIT_MAX_REQUESTS`.
- Se vuoi piu protezione, abbassa `GEMINI_RATE_LIMIT_MAX_REQUESTS` o alza `GEMINI_RATE_LIMIT_WINDOW_MS`.

Valori consigliati per partire gratis:

- `GEMINI_RATE_LIMIT_ENABLED=true`
- `GEMINI_RATE_LIMIT_WINDOW_MS=60000`
- `GEMINI_RATE_LIMIT_MAX_REQUESTS=100`

Se vedi ancora 429 in uso normale, controlla prima la quota Gemini e solo dopo valuta un limite ancora piu alto del throttling locale.
