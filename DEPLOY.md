# Deploy e test di NUTRI-ME

## Cosa e stato preparato

- `avatar-assets.js`: file caricato prima di `script.js`. Se contiene avatar incorporati, l'app usa quelli.
- `scripts/generate-avatar-assets.ps1`: converte gli avatar reali in data URI dentro `avatar-assets.js`.
- `netlify.toml`: configurazione pronta per Netlify.
- `.nojekyll`: utile per GitHub Pages statico.

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

## 3. Pubblicazione su Netlify

### Drag and drop

1. Esegui prima `./scripts/generate-avatar-assets.ps1`.
2. Apri Netlify.
3. Trascina dentro l'intera cartella `APP +`.
4. Attendi l'URL finale.

### Da repository Git

1. Carica il progetto su GitHub.
2. In Netlify scegli `Add new site > Import an existing project`.
3. Seleziona il repository.
4. Publish directory: `.`
5. Deploy.

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
3. Pubblica su GitHub Pages o Netlify.
4. Apri l'URL pubblico dal telefono.
