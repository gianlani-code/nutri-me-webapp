# Deploy e test di NUTRI-ME

## Cosa e stato preparato

- `avatar-assets.js`: file caricato prima di `script.js`. Se contiene avatar incorporati, l'app usa quelli.
- `scripts/generate-avatar-assets.ps1`: converte gli avatar reali in data URI dentro `avatar-assets.js`.
- `netlify.toml`: configurazione pronta per Netlify.
- `.nojekyll`: utile per GitHub Pages statico.
- `app-config.example.js`: esempio di configurazione frontend condivisa per puntare tutti i dispositivi alla stessa function pubblica.

## Nota costi

L'architettura prevista qui resta gratuita finche resti nei limiti dei piani free usati:

- hosting statico: GitHub Pages oppure Netlify free;
- backend function: Netlify Functions free tier;
- modello AI: Gemini con quota gratuita disponibile sul tuo account Google AI Studio.

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

### Gemini da GitHub Pages o da altri host statici

GitHub Pages non esegue Netlify Functions. Se il frontend viene pubblicato li, devi puntare la UI a una function pubblica gia deployata altrove.

1. Crea un file `app-config.js` nella root del progetto partendo da `app-config.example.js`.
2. Imposta `geminiFunctionUrl` con l'URL assoluto della function pubblica, ad esempio `https://tuo-sito.netlify.app/.netlify/functions/gemini`.
3. Pubblica anche `app-config.js` insieme agli altri file statici.

In questo modo ogni dispositivo che apre il sito usa lo stesso backend Gemini, senza configurazioni manuali nel browser.

Per il frontend pubblicato su `https://gianlani-code.github.io/nutri-me-webapp/`, l'origin da autorizzare lato backend e `https://gianlani-code.github.io`.

## 3. Pubblicazione su Netlify

### Drag and drop

1. Esegui prima `./scripts/generate-avatar-assets.ps1`.
2. Apri Netlify.
3. Trascina dentro l'intera cartella `APP +`.
4. Attendi l'URL finale.

5. In `Site configuration > Environment variables`, imposta `GEMINI_API_KEY`.
6. Facoltativo ma consigliato: imposta `GEMINI_ALLOWED_ORIGINS` con gli URL consentiti separati da virgola, ad esempio `https://tuo-sito.netlify.app,https://tuo-frontend.pages.dev`.
7. Facoltativo: regola `GEMINI_TIMEOUT_MS` e `GEMINI_MAX_RETRIES` se vuoi aumentare tolleranza ai timeout o ai 429.
8. Questo e il setup gratuito consigliato: non richiede servizi a pagamento ne configurazioni per singolo dispositivo.

### Da repository Git

1. Carica il progetto su GitHub.
2. In Netlify scegli `Add new site > Import an existing project`.
3. Seleziona il repository.
4. Publish directory: `.`
5. Deploy.
6. In `Site configuration > Environment variables`, imposta `GEMINI_API_KEY`.
7. Facoltativo ma consigliato: imposta `GEMINI_ALLOWED_ORIGINS` con la lista degli origin autorizzati.

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

- Backend Gemini: una Netlify Function pubblica con `GEMINI_API_KEY` lato server.
- Frontend: puo stare sullo stesso sito Netlify oppure su un altro host statico.
- Se il frontend non sta su Netlify: usa `app-config.js` per puntare tutti i client alla stessa function pubblica.

Questa resta la soluzione corretta se non vuoi rendere visibile la chiave nel client.

## 8. Alternativa gratuita consigliata: Vercel per la sola function

Se il provider attuale chiede un upgrade per le environment variables, puoi pubblicare solo la function Gemini su Vercel free e lasciare il frontend su GitHub Pages.

1. Pubblica questo progetto o una copia minima su Vercel.
2. Imposta su Vercel le environment variables: `GEMINI_API_KEY`, opzionalmente `GEMINI_ALLOWED_ORIGINS=https://gianlani-code.github.io`.
3. Usa l'endpoint pubblico Vercel, ad esempio `https://tuo-progetto.vercel.app/api/gemini`.
4. Nel frontend crea `app-config.js` e imposta `geminiFunctionUrl` verso quell'endpoint.
5. Per il tuo frontend GitHub Pages `https://gianlani-code.github.io/nutri-me-webapp/`, l'origin da mettere in allowlist resta `https://gianlani-code.github.io`.

In questo schema il frontend resta gratuito su GitHub Pages e la chiave continua a restare solo lato server.
