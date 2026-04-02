// Mostra/nasconde il campo sport in base al numero di allenamenti
document.addEventListener('DOMContentLoaded', function() {
    var workoutsInput = document.getElementById('wizard-workouts');
    var sportDetails = document.getElementById('wizard-sport-details');
    if (workoutsInput && sportDetails) {
        function toggleSportField() {
            if (parseInt(workoutsInput.value, 10) >= 1) {
                sportDetails.style.display = 'block';
            } else {
                sportDetails.style.display = 'none';
                document.getElementById('wizard-sport-name').value = '';
            }
        }
        workoutsInput.addEventListener('input', toggleSportField);
        toggleSportField();
    }

    // --- TIPO DI PASTO SOLO SE "RICETTA SU MISURA" ---
    var aiModeSelector = document.getElementById('ai-mode-selector');
    var mealTypeGroup = document.getElementById('chef-mode-meal-type-group');
    function toggleMealTypeGroup() {
        if (aiModeSelector && mealTypeGroup) {
            if (aiModeSelector.value === 'recipe') {
                mealTypeGroup.style.display = '';
            } else {
                mealTypeGroup.style.display = 'none';
                // opzionale: resetta la selezione
                var hiddenMealType = document.getElementById('chef-recipe-meal-type');
                if (hiddenMealType) hiddenMealType.value = '';
                // rimuovi highlight dai chip
                var chips = mealTypeGroup.querySelectorAll('.chip');
                chips.forEach(function(chip) { chip.classList.remove('selected'); });
            }
        }
    }
    if (aiModeSelector && mealTypeGroup) {
        aiModeSelector.addEventListener('change', toggleMealTypeGroup);
        // anche click sui chip che cambiano il valore
        var aiModeChips = document.querySelectorAll('.chip[data-value="recipe"], .chip[data-value="daily"], .chip[data-value="weekly"]');
        aiModeChips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                setTimeout(toggleMealTypeGroup, 0);
            });
        });
        // inizializza stato
        toggleMealTypeGroup();
    }
});
// --- MODAL INFO PRODOTTO SCANSIONATO ---
function formatScanMacroValue(value, unit, decimals = 1) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
        return `0 ${unit}`;
    }

    if (decimals === 0) {
        return `${Math.round(numericValue)} ${unit}`;
    }

    return `${numericValue.toFixed(decimals)} ${unit}`;
}

function closeProductInfoModal() {
    const modal = document.getElementById('product-info-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openScannedProductAddPanel() {
    if (!selectedFood) {
        closeProductInfoModal();
        return;
    }

    const addPanel = document.getElementById('add-panel');
    const selectedName = document.getElementById('selected-name');
    const qty = document.getElementById('qty');

    if (addPanel) {
        addPanel.style.display = 'block';
    }

    if (selectedName) {
        selectedName.innerText = selectedFood.nome || 'Prodotto scannerizzato';
    }

    if (qty) {
        qty.value = 100;
    }

    updateSelectedFoodPreview();
    closeProductInfoModal();
}

function showProductInfoModal(scanResult) {
    if (!scanResult || typeof scanResult !== 'object') {
        return;
    }

    let modal = document.getElementById('product-info-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-info-modal';
        modal.className = 'product-info-overlay';
        modal.innerHTML = '<div class="product-info-box" id="product-info-box"></div>';
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeProductInfoModal();
        });
        document.body.appendChild(modal);
    }

    const box = document.getElementById('product-info-box');
    const ns = String(scanResult.nutriscore || '?').toUpperCase();
    const nutrients = scanResult.per_100g || {};
    const metaItems = [
        scanResult.brand ? `<span class="product-info-meta-pill">Marca: ${escapeHtml(scanResult.brand)}</span>` : '',
        scanResult.barcode ? `<span class="product-info-meta-pill">Barcode: ${escapeHtml(scanResult.barcode)}</span>` : '',
        scanResult.quantity ? `<span class="product-info-meta-pill">Formato: ${escapeHtml(scanResult.quantity)}</span>` : '',
        scanResult.category ? `<span class="product-info-meta-pill">Categoria: ${escapeHtml(scanResult.category)}</span>` : '',
        scanResult.sourceLabel ? `<span class="product-info-meta-pill">Fonte: ${escapeHtml(scanResult.sourceLabel)}</span>` : ''
    ].filter(Boolean).join('');

    box.innerHTML =
        '<button class="scan-ai-close" onclick="closeProductInfoModal()">✕</button>' +
        (scanResult.imageUrl ? `<img src="${escapeHtml(scanResult.imageUrl)}" alt="${escapeHtml(scanResult.alimento || 'Prodotto')}" class="product-info-image">` : '') +
        `<h3 class="scan-ai-title">${escapeHtml(scanResult.alimento || scanResult.nome || 'Prodotto')}</h3>` +
        (scanResult.descrizione ? `<p class="scan-ai-desc">${escapeHtml(scanResult.descrizione)}</p>` : '') +
        '<div class="nutriscore-wrap">' +
        '<span class="nutriscore-label">NutriScore</span>' +
        `<span class="nutriscore-badge nutriscore-${ns.toLowerCase()}">${escapeHtml(ns)}</span>` +
        '</div>' +
        (metaItems ? `<div class="product-info-meta">${metaItems}</div>` : '') +
        '<table class="scan-ai-table">' +
        '<thead><tr><th>Nutriente</th><th>per 100 g</th></tr></thead>' +
        '<tbody>' +
        `<tr><td>Energia</td><td>${formatScanMacroValue(nutrients.kcal, 'kcal', 0)}</td></tr>` +
        `<tr><td>Proteine</td><td>${formatScanMacroValue(nutrients.proteine, 'g')}</td></tr>` +
        `<tr><td>Carboidrati</td><td>${formatScanMacroValue(nutrients.carboidrati, 'g')}</td></tr>` +
        `<tr class="indent-row"><td>&nbsp;&nbsp;di cui zuccheri</td><td>${formatScanMacroValue(nutrients.zuccheri, 'g')}</td></tr>` +
        `<tr><td>Grassi</td><td>${formatScanMacroValue(nutrients.grassi, 'g')}</td></tr>` +
        `<tr class="indent-row"><td>&nbsp;&nbsp;di cui saturi</td><td>${formatScanMacroValue(nutrients.grassi_saturi, 'g')}</td></tr>` +
        `<tr><td>Fibre</td><td>${formatScanMacroValue(nutrients.fibre, 'g')}</td></tr>` +
        `<tr><td>Sodio</td><td>${formatScanMacroValue(nutrients.sodio_mg, 'mg', 0)}</td></tr>` +
        '</tbody></table>' +
        (scanResult.ingredients ? `<div class="product-info-section"><strong>Ingredienti</strong><p>${escapeHtml(scanResult.ingredients)}</p></div>` : '') +
        (scanResult.note ? `<p class="scan-ai-note">${escapeHtml(scanResult.note)}</p>` : '') +
        '<div class="product-info-actions">' +
        '<button type="button" class="btn-main" onclick="openScannedProductAddPanel()">Aggiungi al diario</button>' +
        '<button type="button" class="btn-secondary" onclick="closeProductInfoModal()">Chiudi</button>' +
        '</div>' +
        `<p class="scan-ai-disclaimer">${escapeHtml(scanResult.source === 'kaggle' ? 'Valori nutrizionali e dati prodotto recuperati dal dataset locale.' : 'Valori nutrizionali e dati prodotto recuperati da OpenFoodFacts.')}</p>`;

    modal.style.display = 'flex';
}
// --- FINE MODAL ---
// --- ESEMPI PRATICI DI UTILIZZO ---

const GEMINI_PROCEDURE_STYLE_GUIDE = `
Standard obbligatorio per il campo procedimento:
- il procedimento deve imitare il tono e la precisione di una vera scheda ricetta italiana;
- ogni step deve essere autosufficiente, operativo e specifico;
- ogni step deve iniziare con un verbo guida o un'etichetta d'azione, ad esempio: Prepara:, Trita:, Cuoci:, Sciacqua:, Frulla:, Stendi:, Assembla:, Inforna:, Manteca:, Servi:;
- ogni step deve includere almeno due tra questi elementi concreti: utensile o recipiente, taglio o lavorazione, intensita della fiamma o temperatura, tempo indicativo, segnale visivo o tattile corretto;
- non usare step riassuntivi o vaghi come "cuoci e servi", "prepara gli ingredienti", "assembla il piatto";
- se la ricetta e di livello facile, gli step devono essere brevi ma molto pratici;
- se la ricetta e di livello difficile, gli step devono includere preparazioni separate, riposi, assemblaggio e cottura finale quando necessario.

Esempi di stile da imitare:
1. "Prepara: Sbatti le uova con sale, pepe e un cucchiaio di latte in una ciotola ampia, finche il composto risulta uniforme e leggermente spumoso."
2. "Scalda: Versa le verdure gia cotte in una padella da 24 cm con un filo d'olio e falle insaporire per 2 minuti a fuoco medio, mescolando per distribuire bene l'umidita residua."
3. "Cuoci: Versa le uova sulle verdure, copri con coperchio e lascia rassodare a fuoco basso per 5-6 minuti; gira la frittata aiutandoti con il coperchio e completa la cottura per altri 2 minuti."
4. "Manteca: Scola la pasta molto al dente direttamente nella padella, aggiungi poca acqua di cottura alla volta e fai saltare per 1 minuto, poi unisci l'olio restante fuori dal fuoco per ottenere una salsa lucida e cremosa."
5. "Inforna: Cuoci in forno statico preriscaldato a 200 gradi per circa 30 minuti, finche la superficie appare asciutta e dorata ai bordi; sforna e lascia assestare 10 minuti prima di tagliare."
`;

const GEMINI_MASTER_CHEF_SYSTEM_PROMPT = `Sei un Master Chef esperto in nutrizione, specializzato in ricette sane, svuota-frigo e anti-spreco. Il tuo compito e generare ricette intelligenti, realistiche e fattibili, abbinando gli ingredienti in modo logico e gustoso.

REGOLE FONDAMENTALI:
1. Non inventare passaggi impossibili o tempi di cottura irreali.
2. Usa misurazioni precise (grammi, cucchiai).
3. Se la ricetta e "Salvafrigo", suggerisci come riutilizzare gli scarti in modo creativo.
4. DEVI RISPETTARE TASSATIVAMENTE IL SEGUENTE FORMATO, senza aggiungere testo introduttivo o conclusivo fuori dal template:

[NOME RICETTA IN MAIUSCOLO]
Difficolta: [SEMPLICE / CHEF / INTERMEDIA] - [Categoria: es. SALVAFRIGO / PRANZO O CENA]
[Breve descrizione o scopo della ricetta, max 2 righe]
Ingredienti: [Elenco separato da virgole con quantita precise. Se appropriato includi i macro-nutrienti principali]
Tempi: [es. 15 min preparazione + 20 min cottura]
[Azione 1 es. Trita/Prepara/Metti in Ammollo o l azione specifica per quell alimento]: [Spiegazione del passaggio]
[Azione 2 es. Cuoci]: [Spiegazione del passaggio]
[Azione 3 es. Servi]: [Spiegazione del passaggio]
Conservazione: [Come conservarlo e per quanto tempo]
Consiglio: [Un suggerimento tecnico o nutrizionale]

Compatibilita applicativa obbligatoria:
- se la richiesta operativa dell applicazione impone JSON o un formato dati strutturato, mantieni tutte le regole qualitative sopra ma rispondi esattamente nel formato richiesto dall applicazione;
- non aggiungere testo fuori dal formato richiesto;
- le istruzioni di dominio da Master Chef hanno priorita sullo stile, ma il formato richiesto dall applicazione ha priorita sull impaginazione finale.`;

const PROMPT_RICETTA_SU_MISURA = `
Sei lo Chef-Nutrizionista ufficiale di NUTRI-ME.
Devi ragionare internamente in piu passaggi come chef e nutrizionista, ma non devi mai mostrare il ragionamento. Niente spiegazioni fuori dal JSON finale.

Compito:
- crea una ricetta su misura partendo da dati utente, target calorico e proteico, dieta, allergie, intolleranze, patologie, ingrediente o pasto guida;
- rispetta rigorosamente i vincoli clinici e dietetici;
- proponi una tecnica di cottura sensata, domestica ma precisa, con attenzione a sapore, digeribilita e controllo calorico;
- inserisci sempre una cottura_consigliata concreta e coerente con la ricetta;
- inserisci sempre un tip_antispreco utile e realistico;
- inserisci sempre un bioavailability_tip utile e concreto.

Regole obbligatorie:
- restituisci solo JSON valido, senza markdown, senza prefazioni, senza commenti;
- la ricetta deve essere realistica, cucinabile e coerente con il tipo di pasto richiesto;
- gli ingredienti devono avere grammature o quantita leggibili;
- inserisci sempre una sezione valori_nutrizionali completa con kcal, proteine, carboidrati, zuccheri, fibre, grassi, grassi_saturi e sale riferiti all'intera ricetta, non alla singola porzione;
- il procedimento deve essere un array di step reali, concreti e operativi, non generici, scritto nello stile della guida esempi sotto;
- il procedimento deve contenere almeno 5 step e al massimo 8 step per Pranzo o Cena; almeno 4 step per Colazione o Spuntino;
- il procedimento deve coprire l intero flusso del piatto: preparazione ingredienti, cottura principale, eventuale mantecatura o assemblaggio finale, servizio o rifinitura finale;
- il procedimento deve includere obbligatoriamente: uno step di preparazione ingredienti, almeno uno step di cottura, uno step di finitura o regolazione finale, uno step di servizio o impiattamento;
- almeno 3 step devono contenere tempi, temperatura o intensita della fiamma;
- almeno 2 step devono citare esplicitamente utensili o recipienti;
- ogni step deve dire cosa fare davvero: taglio, recipiente, intensita di fiamma o forno, ordine dei passaggi, minuti indicativi o segnali pratici di cottura;
- ogni step deve iniziare con un verbo guida o etichetta d'azione come negli esempi;
- evita formule vaghe come "cuoci fino a pronto" o "assembla il piatto": sii specifico;
- calorie e macronutrienti devono essere numeri plausibili per l intera ricetta o porzione richiesta;
- usa sempre una chiave annidata macro con proteine, carbo e grassi;
- se un ingrediente non e compatibile coi vincoli, sostituiscilo senza discutere.

Guida di stile obbligatoria per il procedimento:
${GEMINI_PROCEDURE_STYLE_GUIDE}

Output JSON obbligatorio, con queste sole chiavi:
{
  "titolo": "string",
  "tempo_prep": "string o numero in minuti",
    "tipo_pasto": "Colazione | Pranzo | Cena | Spuntino",
    "difficolta": "Facile | Media | Difficile",
  "calorie": number,
    "macro": {
        "proteine": number,
        "carbo": number,
        "grassi": number
    },
    "valori_nutrizionali": {
                "kcal": number,
                "proteine": number,
                "carboidrati": number,
                "zuccheri": number,
                "fibre": number,
                "grassi": number,
                "grassi_saturi": number,
                "sale": number
        },
  "ingredienti": ["string", "string"],
  "procedimento": ["step 1", "step 2"],
    "cottura_consigliata": "string",
    "tip_antispreco": "string",
  "bioavailability_tip": "string"
}
`;

const PROMPT_PIANO_GIORNALIERO = `
Sei lo Chef-Nutrizionista ufficiale di NUTRI-ME.
Devi ragionare internamente in piu passaggi come nutrizionista clinico e chef organizzatore, ma non devi mai mostrare il ragionamento. Niente testo fuori dal JSON finale.

Compito:
- genera un piano giornaliero coerente con profilo, stile di vita, dieta, allergie, intolleranze, patologie, target calorico e macro;
- applica la crononutrizione: colazione piu densa e utile, pranzo energetico e funzionale, cena piu leggera e digeribile;
- costruisci un filo logico anti-spreco tra i pasti quando possibile;
- ogni pasto deve essere una vera mini-ricetta coerente con il momento della giornata.

Regole obbligatorie:
- restituisci solo JSON valido, senza markdown, senza commenti, senza testo extra;
- l array pasti deve essere in ordine logico: Colazione, Spuntino, Pranzo, Cena; se serve un secondo spuntino, integralo nel piano ma mantieni ordine chiaro;
- ogni elemento di pasti deve rispettare esattamente il formato JSON della singola ricetta;
- ogni ricetta deve usare la chiave macro con proteine, carbo e grassi;
- ogni ricetta deve includere valori_nutrizionali con kcal, proteine, carboidrati, zuccheri, fibre, grassi, grassi_saturi e sale;
- i procedimenti devono essere reali e collegati tra loro: se riusi una base o un ingrediente tra pranzo e cena, rendilo evidente nei passaggi;
- ogni procedimento deve seguire la guida di stile sotto e usare step concreti con verbi guida, tempi, utensili e segnali di cottura;
- daily_theme deve essere una stringa sintetica ma significativa;
- evita combinazioni casuali: ogni giornata deve sembrare progettata da uno chef-nutrizionista.

Guida di stile obbligatoria per i procedimenti:
${GEMINI_PROCEDURE_STYLE_GUIDE}

Output JSON obbligatorio:
{
  "daily_theme": "string",
  "pasti": [
    {
      "titolo": "string",
      "tempo_prep": "string o numero in minuti",
            "tipo_pasto": "Colazione | Pranzo | Cena | Spuntino",
            "difficolta": "Facile | Media | Difficile",
      "calorie": number,
            "macro": {
                "proteine": number,
                "carbo": number,
                "grassi": number
            },
    "valori_nutrizionali": {
            "kcal": number,
            "proteine": number,
            "carboidrati": number,
            "zuccheri": number,
            "fibre": number,
            "grassi": number,
            "grassi_saturi": number,
            "sale": number
        },
      "ingredienti": ["string"],
      "procedimento": ["string"],
            "cottura_consigliata": "string",
            "tip_antispreco": "string",
      "bioavailability_tip": "string"
    }
  ]
}
`;

const PROMPT_PIANO_SETTIMANALE = `
Sei lo Chef-Nutrizionista ufficiale di NUTRI-ME.
Devi ragionare internamente in piu passaggi come strategist nutrizionale e chef meal planner, ma non devi mai mostrare il ragionamento. Niente testo fuori dal JSON finale.

Compito:
- genera una strategia alimentare settimanale da Lunedi a Domenica;
- rispetta target, dieta, allergie, intolleranze, patologie e numero di pasti al giorno;
- applica rotazione proteica sensata e distribuzione coerente dei macro su base settimanale;
- mantieni logica anti-spreco, continuita di dispensa e realismo domestico.

Regole obbligatorie:
- restituisci solo JSON valido, senza markdown, senza commenti, senza testo extra;
- weekly_strategy deve essere una spiegazione di due righe, sintetica ma professionale;
- giorni deve contenere 7 elementi, in ordine da Lunedi a Domenica;
- ogni giorno deve avere almeno: giorno, daily_theme, pasti;
- ogni elemento di pasti deve rispettare esattamente il formato JSON della singola ricetta;
- ogni ricetta deve usare la chiave macro con proteine, carbo e grassi;
- ogni ricetta deve includere valori_nutrizionali con kcal, proteine, carboidrati, zuccheri, fibre, grassi, grassi_saturi e sale;
- i procedimenti devono sembrare quelli di un vero piano cucinabile in casa, non titoli astratti travestiti da ricette;
- ogni procedimento deve seguire la guida di stile sotto e usare step concreti con verbi guida, tempi, utensili e segnali di cottura;
- la settimana deve sembrare progettata da un vero professionista, non da un generatore casuale.

Guida di stile obbligatoria per i procedimenti:
${GEMINI_PROCEDURE_STYLE_GUIDE}

Output JSON obbligatorio:
{
  "weekly_strategy": "string",
  "giorni": [
    {
      "giorno": "Lunedi",
      "daily_theme": "string",
      "pasti": [
        {
          "titolo": "string",
          "tempo_prep": "string o numero in minuti",
                    "tipo_pasto": "Colazione | Pranzo | Cena | Spuntino",
                    "difficolta": "Facile | Media | Difficile",
          "calorie": number,
                    "macro": {
                        "proteine": number,
                        "carbo": number,
                        "grassi": number
                    },
          "valori_nutrizionali": {
                        "kcal": number,
                        "proteine": number,
                        "carboidrati": number,
                        "zuccheri": number,
                        "fibre": number,
                        "grassi": number,
                        "grassi_saturi": number,
                        "sale": number
                    },
          "ingredienti": ["string"],
          "procedimento": ["string"],
                    "cottura_consigliata": "string",
                    "tip_antispreco": "string",
          "bioavailability_tip": "string"
        }
      ]
    }
  ]
}
`;

const GEMINI_PROMPT_MAP = {
    'ricetta-su-misura': PROMPT_RICETTA_SU_MISURA,
    'piano-giornaliero': PROMPT_PIANO_GIORNALIERO,
    'piano-settimanale': PROMPT_PIANO_SETTIMANALE
};

function buildGeminiRecipeRequestPayload(profile, request) {
    return {
        profilo_utente: {
            kcal_target: Math.round(profile.targetCalories || 0),
            proteine_target_g: Math.round(profile.proteinTargetGrams || 0),
            carbo_target_g: Math.round(profile.carbsTargetGrams || 0),
            grassi_target_g: Math.round(profile.fatTargetGrams || 0),
            dieta: profile.diet || 'non specificata',
            allergie: profile.allergies || 'nessuna indicata',
            intolleranze: profile.intolerances || 'nessuna indicata',
            patologie: profile.otherPathologies || 'nessuna indicata',
            obiettivo: profile.goal || 'mantenere',
            stile_di_vita: profile.jobType || 'moderato'
        },
        richiesta_ricetta: {
            ...request,
            requisiti_output: [
                'procedimento dettagliato passo per passo come una ricetta reale italiana',
                'il procedimento deve avere minimo 5 e massimo 8 step per pranzo o cena; minimo 4 step per colazione o spuntino',
                'il procedimento deve contenere almeno uno step di preparazione ingredienti, uno di cottura, uno di finitura e uno di servizio',
                'almeno 3 step devono riportare tempi, temperatura o intensita della fiamma',
                'almeno 2 step devono nominare utensili o recipienti',
                'il procedimento deve chiudere davvero il piatto con finitura finale, regolazione del condimento o servizio',
                'ogni step deve iniziare con un verbo guida tipo Prepara:, Cuoci:, Manteca:, Inforna:',
                'ogni step deve contenere utensile o recipiente, tempo o temperatura, e un segnale pratico di corretta esecuzione',
                'cottura_consigliata sempre valorizzata',
                'tip_antispreco sempre valorizzato',
                'bioavailability_tip in chiusura'
            ],
            esempi_stile_procedimento: [
                'Prepara: Sbatti le uova con sale, pepe e un cucchiaio di latte in una ciotola ampia finche il composto risulta uniforme e leggermente spumoso.',
                'Cuoci: Versa le uova sulle verdure, copri con coperchio e lascia rassodare a fuoco basso per 5-6 minuti; gira la frittata con il coperchio e completa per altri 2 minuti.',
                'Manteca: Scola la pasta molto al dente nella padella, aggiungi poca acqua di cottura alla volta e fai saltare per 1 minuto, poi unisci l olio restante fuori dal fuoco.',
                'Servi: Impiatta subito il piatto ben caldo, regola con un ultimo filo di condimento a crudo e completa con l erba aromatica prevista.'
            ]
        }
    };
}

function buildGeminiDailyPlanRequestPayload(profile, request) {
    return {
        profilo_utente: {
            username: profile.username || '',
            lifestyle: profile.jobType || 'moderato',
            workout_settimanali: Number(profile.workoutsPerWeek || 0),
            dieta: profile.diet || 'non specificata',
            allergie: profile.allergies || 'nessuna indicata',
            intolleranze: profile.intolerances || 'nessuna indicata',
            patologie: profile.otherPathologies || 'nessuna indicata',
            target_calorico: Math.round(profile.targetCalories || 0),
            macro_target: {
                proteine: Math.round(profile.proteinTargetGrams || 0),
                carbo: Math.round(profile.carbsTargetGrams || 0),
                grassi: Math.round(profile.fatTargetGrams || 0)
            },
            acqua_litri: Number(profile.waterTargetLiters || 0).toFixed(1)
        },
        richiesta_piano_giornaliero: {
            ...request,
            requisiti_output: [
                'ogni pasto deve avere procedimento reale e concreto',
                'ogni step deve iniziare con un verbo guida e includere dettagli pratici di esecuzione',
                'evidenziare riuso intelligente degli ingredienti tra pranzo e cena',
                'cottura_consigliata e tip_antispreco sempre presenti per ogni ricetta'
            ],
            esempi_stile_procedimento: [
                'Sciacqua: Se usi legumi in scatola, sciacquali bene sotto acqua corrente e lasciali sgocciolare 2 minuti.',
                'Frulla: Metti tutto nel mixer e aggiungi un cucchiaio di acqua calda alla volta fino a ottenere una crema liscia ma sostenuta.',
                'Inforna: Cuoci in forno statico preriscaldato a 200 gradi finche la superficie appare asciutta e dorata ai bordi.'
            ]
        }
    };
}

function buildGeminiWeeklyPlanRequestPayload(profile, request) {
    return {
        profilo_utente: {
            lifestyle: profile.jobType || 'moderato',
            obiettivo: profile.goal || 'mantenere',
            dieta: profile.diet || 'non specificata',
            allergie: profile.allergies || 'nessuna indicata',
            intolleranze: profile.intolerances || 'nessuna indicata',
            patologie: profile.otherPathologies || 'nessuna indicata',
            target_calorico: Math.round(profile.targetCalories || 0),
            macro_target: {
                proteine: Math.round(profile.proteinTargetGrams || 0),
                carbo: Math.round(profile.carbsTargetGrams || 0),
                grassi: Math.round(profile.fatTargetGrams || 0)
            },
            pasti_al_giorno: Number(profile.mealsPerDay || 4)
        },
        richiesta_piano_settimanale: {
            ...request,
            requisiti_output: [
                'rotazione proteica sensata sui 7 giorni',
                'procedimenti realmente cucinabili in casa',
                'ogni step deve iniziare con un verbo guida e includere dettagli pratici di esecuzione',
                'cottura_consigliata e tip_antispreco sempre presenti per ogni ricetta'
            ],
            esempi_stile_procedimento: [
                'Prepara: Taglia le verdure in pezzi regolari su un tagliere ampio cosi cuociono in modo uniforme.',
                'Cuoci: Scalda una padella antiaderente a fuoco medio, aggiungi il condimento e fai insaporire per 2-3 minuti prima di unire la base.',
                'Servi: Lascia assestare 2 minuti fuori dal fuoco prima di impiattare, cosi i sapori restano piu definiti.'
            ]
        }
    };
}

function buildGeminiChefPrompt(mode, payload) {
    const systemPrompt = GEMINI_PROMPT_MAP[mode];
    if (!systemPrompt) {
        throw new Error(`Modalita Gemini non supportata: ${mode}`);
    }

    return [
        systemPrompt.trim(),
        'DATI DINAMICI UTENTE E RICHIESTA OPERATIVA:',
        JSON.stringify(payload, null, 2),
        'Restituisci esclusivamente JSON valido. Non usare blocchi markdown. Non aggiungere testo prima o dopo il JSON.'
    ].join('\n\n');
}

function extractGeminiText(data) {
    if (!data || typeof data !== 'object') return '';

    if (typeof data.text === 'string') return data.text;
    if (typeof data.output === 'string') return data.output;
    if (typeof data.response === 'string') return data.response;

    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
        return parts.map((part) => part?.text || '').join('').trim();
    }

    return '';
}

function extractBalancedJsonBlock(rawText) {
    const text = String(rawText || '').trim();
    if (!text) return '';

    const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidateText = fencedMatch?.[1]?.trim() || text;
    const startIndex = candidateText.search(/[\[{]/);
    if (startIndex === -1) {
        return '';
    }

    const openingChar = candidateText[startIndex];
    const closingChar = openingChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let isEscaped = false;

    for (let index = startIndex; index < candidateText.length; index += 1) {
        const char = candidateText[index];

        if (inString) {
            if (isEscaped) {
                isEscaped = false;
                continue;
            }

            if (char === '\\') {
                isEscaped = true;
                continue;
            }

            if (char === '"') {
                inString = false;
            }
            continue;
        }

        if (char === '"') {
            inString = true;
            continue;
        }

        if (char === openingChar) {
            depth += 1;
        } else if (char === closingChar) {
            depth -= 1;
            if (depth === 0) {
                return candidateText.slice(startIndex, index + 1);
            }
        }
    }

    return '';
}

function parseGeminiJsonResponse(rawText) {
    const trimmedText = String(rawText || '').trim();
    if (!trimmedText) {
        throw new Error('Gemini non ha restituito testo utile.');
    }

    try {
        return JSON.parse(trimmedText);
    } catch (error) {
        const extractedJson = extractBalancedJsonBlock(trimmedText);
        if (!extractedJson) {
            throw new Error('Impossibile estrarre un JSON valido dalla risposta di Gemini.');
        }

        return JSON.parse(extractedJson);
    }
}

function normalizeGeminiRecipeDifficulty(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized.includes('chef') || normalized.includes('difficile')) return 'Difficile';
    if (normalized.includes('intermedia') || normalized.includes('media')) return 'Media';
    return 'Facile';
}

function deriveMealTypeFromGeminiText(text) {
    const normalized = String(text || '').toLowerCase();
    if (normalized.includes('colazione')) return 'Colazione';
    if (normalized.includes('spuntino')) return 'Spuntino';
    if (normalized.includes('cena')) return 'Cena';
    if (normalized.includes('pranzo')) return 'Pranzo';
    return 'Pranzo';
}

function deriveCookingTechniqueFromSteps(steps, fallback = '') {
    const joined = (Array.isArray(steps) ? steps : []).join(' ').toLowerCase();
    if (/forno|inforna|statico|ventilato/.test(joined)) return 'Forno controllato con temperatura gia impostata';
    if (/padella|salta|rosola|manteca|fuoco/.test(joined)) return 'Padella a fuoco medio con controllo progressivo della cottura';
    if (/pentola|bollore|lessa/.test(joined)) return 'Cottura in pentola con bollore regolare';
    if (/mixer|frulla|frullatore/.test(joined)) return 'Preparazione a freddo con rifinitura al mixer';
    return fallback || 'Cottura domestica semplice e controllata';
}

function deriveBioavailabilityTipFromRecipeText(text, ingredients = []) {
    const normalized = `${String(text || '')} ${(Array.isArray(ingredients) ? ingredients.join(' ') : '')}`.toLowerCase();
    if (/limone|agrumi|vitamina c|prezzemolo/.test(normalized)) {
        return 'Aggiungi una fonte di vitamina C a fine preparazione per favorire l assorbimento di ferro e composti antiossidanti.';
    }
    if (/olio evo|olio extravergine|olio d'oliva|olio d oliva/.test(normalized)) {
        return 'Una piccola quota di olio EVO a crudo aiuta l assorbimento dei composti liposolubili presenti nelle verdure.';
    }
    if (/legumi|ceci|lenticchie|fagioli|spinaci/.test(normalized)) {
        return 'Abbina erbe fresche o ortaggi ricchi di vitamina C per migliorare l utilizzo del ferro vegetale.';
    }
    return 'Completa il piatto con un contorno vegetale fresco per migliorare densita micronutrizionale e biodisponibilita complessiva.';
}

function parseGeminiRecipeTextResponse(rawText) {
    const trimmedText = String(rawText || '').trim();
    if (!trimmedText) {
        return null;
    }

    const lines = trimmedText
        .split(/\r?\n/)
        .map((line) => String(line || '').trim())
        .filter(Boolean);

    if (lines.length < 4) {
        return null;
    }

    const difficultyIndex = lines.findIndex((line) => /^difficolt/i.test(line));
    const ingredientsIndex = lines.findIndex((line) => /^ingredienti\s*:/i.test(line));
    const timesIndex = lines.findIndex((line) => /^tempi\s*:/i.test(line));
    const conservationIndex = lines.findIndex((line) => /^conservazione\s*:/i.test(line));
    const adviceIndex = lines.findIndex((line) => /^consiglio\s*:/i.test(line));

    if (difficultyIndex === -1 || ingredientsIndex === -1 || timesIndex === -1) {
        return null;
    }

    const title = String(lines[0] || 'Ricetta su misura')
        .replace(/^\[|\]$/g, '')
        .replace(/^["']|["']$/g, '')
        .trim();
    const difficultyLine = lines[difficultyIndex];
    const difficultyMatch = difficultyLine.match(/^difficolt[aà]\s*:\s*([^\-]+?)(?:\s*-\s*(.+))?$/i);
    const difficultyText = String(difficultyMatch?.[1] || '').trim();
    const categoryText = String(difficultyMatch?.[2] || '').trim();
    const description = lines.slice(difficultyIndex + 1, ingredientsIndex).join(' ').trim();
    const ingredientsText = String(lines[ingredientsIndex] || '').replace(/^ingredienti\s*:/i, '').trim();
    const timeText = String(lines[timesIndex] || '').replace(/^tempi\s*:/i, '').trim();

    const sectionEndCandidates = [conservationIndex, adviceIndex].filter((index) => index > timesIndex);
    const stepsEndIndex = sectionEndCandidates.length > 0 ? Math.min(...sectionEndCandidates) : lines.length;
    const rawSteps = lines.slice(timesIndex + 1, stepsEndIndex);
    const steps = [];

    rawSteps.forEach((line) => {
        const normalizedLine = String(line || '').replace(/\s+/g, ' ').trim();
        if (!normalizedLine || /^preparazione\s*:?$/i.test(normalizedLine)) {
            return;
        }

        const isNewStep = /^[A-Za-zÀ-ÿ][^:]{1,24}:/.test(normalizedLine);
        if (isNewStep || steps.length === 0) {
            steps.push(normalizedLine);
            return;
        }

        steps[steps.length - 1] = `${steps[steps.length - 1]} ${normalizedLine}`.trim();
    });

    const conservationText = conservationIndex !== -1 ? String(lines[conservationIndex] || '').replace(/^conservazione\s*:/i, '').trim() : '';
    const adviceText = adviceIndex !== -1 ? String(lines[adviceIndex] || '').replace(/^consiglio\s*:/i, '').trim() : '';
    const ingredients = ingredientsText
        .split(/\s*,\s*/)
        .map((item) => item.trim())
        .filter(Boolean);

    const calorie = extractMacroNumberFromText(trimmedText, ['energia kcal', 'kcal', 'calorie']);
    const proteine = extractMacroNumberFromText(trimmedText, ['proteine', 'protein']);
    const carbo = extractMacroNumberFromText(trimmedText, ['carboidrati', 'carbo', 'carbs']);
    const grassi = extractMacroNumberFromText(trimmedText, ['grassi', 'fat']);
    const antiWasteText = adviceText || conservationText || (categoryText.toLowerCase().includes('salvafrigo') ? 'Riutilizza gli ingredienti gia pronti o gli scarti puliti per limitare gli sprechi.' : 'Conserva gli avanzi in frigorifero e riutilizzali entro 24-48 ore in una preparazione simile.');
    const bioavailabilityTip = /assorb|vitamina|ferro|prote/i.test(adviceText.toLowerCase())
        ? adviceText
        : deriveBioavailabilityTipFromRecipeText(trimmedText, ingredients);

    return {
        titolo: title || 'Ricetta su misura',
        tempo_prep: timeText || '20 minuti',
        tipo_pasto: deriveMealTypeFromGeminiText(categoryText || description || trimmedText),
        difficolta: normalizeGeminiRecipeDifficulty(difficultyText),
        calorie: Number.isFinite(calorie) ? calorie : 0,
        macro: {
            proteine: Number.isFinite(proteine) ? proteine : 0,
            carbo: Number.isFinite(carbo) ? carbo : 0,
            grassi: Number.isFinite(grassi) ? grassi : 0
        },
        ingredienti: ingredients,
        procedimento: steps,
        cottura_consigliata: deriveCookingTechniqueFromSteps(steps, categoryText),
        tip_antispreco: antiWasteText,
        bioavailability_tip: bioavailabilityTip,
        descrizione: description
    };
}

function parseGeminiModelResponse(rawText, mode = 'generic') {
    try {
        return parseGeminiJsonResponse(rawText);
    } catch (error) {
        if (mode === 'ricetta-su-misura') {
            const parsedRecipe = parseGeminiRecipeTextResponse(rawText);
            if (parsedRecipe) {
                return parsedRecipe;
            }
        }

        throw error;
    }
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function coerceFiniteNumber(value, fallback = 0) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.replace(',', '.').replace(/[^0-9.-]/g, '').trim();
        const parsed = Number(normalized);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return fallback;
}

function extractMacroNumberFromText(text, labels = []) {
    const source = String(text || '');
    for (const label of labels) {
        const pattern = new RegExp(`${label}[^0-9-]*([0-9]+(?:[.,][0-9]+)?)`, 'i');
        const match = source.match(pattern);
        if (match?.[1]) {
            return coerceFiniteNumber(match[1], Number.NaN);
        }
    }

    return Number.NaN;
}

function getObjectValueCaseInsensitive(source, keys = []) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
        return undefined;
    }

    const entries = Object.entries(source);
    for (const candidateKey of keys) {
        const match = entries.find(([currentKey]) => String(currentKey || '').trim().toLowerCase() === String(candidateKey || '').trim().toLowerCase());
        if (match) {
            return match[1];
        }
    }

    return undefined;
}

function normalizeGeminiMacroShape(macro, recipe = {}) {
    const source = macro && typeof macro === 'object' && !Array.isArray(macro) ? macro : {};
    const macroText = typeof macro === 'string' ? macro : '';
    return {
        proteine: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['proteine', 'protein'])
            ?? recipe.proteine ?? recipe.protein
            ?? extractMacroNumberFromText(macroText, ['proteine', 'protein']),
            0
        ),
        carbo: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['carbo', 'carboidrati', 'carbs'])
            ?? recipe.carboidrati ?? recipe.carbs
            ?? extractMacroNumberFromText(macroText, ['carboidrati', 'carbo', 'carbs']),
            0
        ),
        grassi: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['grassi', 'fat'])
            ?? recipe.grassi ?? recipe.fat
            ?? extractMacroNumberFromText(macroText, ['grassi', 'fat']),
            0
        )
    };
}

function normalizeGeminiNutritionDetails(nutrition, recipe = {}) {
    const source = nutrition && typeof nutrition === 'object' && !Array.isArray(nutrition) ? nutrition : {};
    const macro = normalizeGeminiMacroShape(recipe.macro, recipe);

    return {
        kcal: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['kcal', 'calorie', 'energia'])
            ?? recipe.calorie ?? recipe.kcal,
            0
        ),
        proteine: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['proteine', 'protein'])
            ?? macro.proteine,
            0
        ),
        carboidrati: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['carboidrati', 'carbo', 'carbs'])
            ?? macro.carbo,
            0
        ),
        zuccheri: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['zuccheri', 'sugars']),
            0
        ),
        fibre: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['fibre', 'fibra', 'fiber']),
            0
        ),
        grassi: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['grassi', 'fat']),
            macro.grassi
        ),
        grassi_saturi: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['grassi_saturi', 'saturi', 'saturated_fat']),
            0
        ),
        sale: coerceFiniteNumber(
            getObjectValueCaseInsensitive(source, ['sale', 'salt']),
            0
        )
    };
}

function getGeminiRecipeDifficultyLabel(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized.includes('chef') || normalized.includes('diffic')) return 'Difficile';
    if (normalized.includes('media')) return 'Media';
    if (normalized.includes('salvafrigo')) return 'Facile';
    return 'Facile';
}

function assertGeminiRecipeSchema(recipe, contextLabel = 'ricetta') {
    if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) {
        throw new Error(`Schema Gemini non valido: ${contextLabel} assente o non oggetto.`);
    }

    const requiredStringKeys = ['titolo', 'difficolta', 'cottura_consigliata', 'tip_antispreco', 'bioavailability_tip'];
    const requiredMacroKeys = ['proteine', 'carbo', 'grassi'];

    requiredStringKeys.forEach((key) => {
        if (!isNonEmptyString(recipe[key])) {
            throw new Error(`Schema Gemini non valido: campo ${key} mancante in ${contextLabel}.`);
        }
    });

    if (!isFiniteNumber(coerceFiniteNumber(recipe.calorie, Number.NaN))) {
        throw new Error(`Schema Gemini non valido: campo numerico calorie mancante in ${contextLabel}.`);
    }

    if (!recipe.macro || typeof recipe.macro !== 'object' || Array.isArray(recipe.macro)) {
        throw new Error(`Schema Gemini non valido: macro mancante in ${contextLabel}.`);
    }

    requiredMacroKeys.forEach((key) => {
        if (!isFiniteNumber(coerceFiniteNumber(recipe.macro[key], Number.NaN))) {
            throw new Error(`Schema Gemini non valido: macro.${key} mancante in ${contextLabel}.`);
        }
    });

    if (!(typeof recipe.tempo_prep === 'string' || isFiniteNumber(recipe.tempo_prep))) {
        throw new Error(`Schema Gemini non valido: campo tempo_prep mancante in ${contextLabel}.`);
    }

    if (!Array.isArray(recipe.ingredienti) || recipe.ingredienti.length === 0 || !recipe.ingredienti.every((item) => isNonEmptyString(typeof item === 'string' ? item : String(item?.nome || item?.name || '')))) {
        throw new Error(`Schema Gemini non valido: ingredienti non validi in ${contextLabel}.`);
    }

    if (!Array.isArray(recipe.procedimento) || recipe.procedimento.length === 0 || !recipe.procedimento.every((step) => isNonEmptyString(String(step || '')))) {
        throw new Error(`Schema Gemini non valido: procedimento non valido in ${contextLabel}.`);
    }

    assertGeminiProcedureQuality(recipe.procedimento, contextLabel);

    return true;
}

function scoreGeminiProcedureStep(step) {
    const text = String(step || '').trim();
    const normalized = text.toLowerCase();

    const hasActionLabel = /^[A-Za-zÀ-ÿ][^:]{1,24}:/.test(text);
    const hasTimeOrTemperature = /(\b\d+\s*(min|minuti|secondi|ore)\b|\b\d+\s*°|gradi|fuoco\s+(basso|medio|alto)|forno\s+(statico|ventilato)|bollore)/i.test(text);
    const hasToolOrContainer = /(padella|pentola|forno|teglia|ciotola|mixer|frullatore|coperchio|tagliere|coltello|planetaria|spatola|casseruola)/i.test(text);
    const hasTechnique = /(trita|taglia|mescola|sbatti|versa|scola|manteca|stendi|inforna|salta|frulla|copri|rosola|lessa|scalda|aggiungi|distribuisci|ung[e]?|raffredda|strizza|impiatta|guarnisci|rifinisci|condisci|spolvera|completa|servi)/i.test(text);
    const hasSensoryCue = /(finche|fino a quando|quando .* risulta|dorato|cremos|asciutt|tener|lucid|spumos|uniforme|rigid|morb|ben caldo|assorb)/i.test(text);
    const hasFinishingCue = /(impiatta|guarnisci|rifinisci|servi|a crudo|ultimo giro|spolvera|completa con|ben caldo|subito|immediatamente)/i.test(text);
    const hasPreparationCue = /(prepara|trita|taglia|sbuccia|lava|sciacqua|pela|sbatti|metti in ammollo|monda)/i.test(text);
    const hasCookingCue = /(cuoci|scalda|rosola|salta|lessa|manteca|inforna|stufa|fai sobbollire|porta a bollore)/i.test(text);
    const isTooGeneric = /(prepara gli ingredienti|assembla il piatto|cuoci e servi|procedi con la cottura|completa la ricetta|impiatta e servi|quanto basta|cuoci fino a pronto)/i.test(normalized);

    const score = [hasActionLabel, hasTimeOrTemperature, hasToolOrContainer, hasTechnique, hasSensoryCue]
        .filter(Boolean)
        .length;

    return {
        text,
        score,
        hasActionLabel,
        hasFinishingCue,
        hasPreparationCue,
        hasCookingCue,
        hasTimeOrTemperature,
        hasToolOrContainer,
        isTooGeneric
    };
}

function assertGeminiProcedureQuality(steps, contextLabel = 'ricetta') {
    const normalizedSteps = (Array.isArray(steps) ? steps : []).map((step) => String(step || '').trim()).filter(Boolean);
    const contextText = String(contextLabel || '').trim();
    const requiredStepCount = /^ricetta\b/i.test(contextText) ? 5 : 3;
    if (normalizedSteps.length < requiredStepCount) {
        throw new Error(`Procedimento Gemini troppo debole in ${contextLabel}: servono almeno ${requiredStepCount} step reali.`);
    }

    const evaluations = normalizedSteps.map(scoreGeminiProcedureStep);
    const weakSteps = evaluations.filter((entry, index) => {
        const isLastStep = index === evaluations.length - 1;
        const minimumScore = isLastStep && entry.hasFinishingCue ? 2 : 3;
        return entry.isTooGeneric || !entry.hasActionLabel || entry.score < minimumScore;
    });

    const hasPreparationStep = evaluations.some((entry) => entry.hasPreparationCue);
    const hasCookingStep = evaluations.some((entry) => entry.hasCookingCue);
    const hasFinishingStep = evaluations.some((entry) => entry.hasFinishingCue);
    const timedSteps = evaluations.filter((entry) => entry.hasTimeOrTemperature).length;
    const tooLessTools = evaluations.filter((entry) => entry.hasToolOrContainer).length;

    if (/^ricetta\b/i.test(contextText)) {
        if (!hasPreparationStep) {
            throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: manca uno step reale di preparazione ingredienti.`);
        }
        if (!hasCookingStep) {
            throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: manca uno step reale di cottura.`);
        }
        if (!hasFinishingStep) {
            throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: manca uno step reale di finitura o servizio.`);
        }
        if (timedSteps < 3) {
            throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: servono almeno 3 step con tempi o temperatura.`);
        }
        if (tooLessTools < 2) {
            throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: servono almeno 2 step con utensili o recipienti.`);
        }
    }

    if (weakSteps.length > 0) {
        const example = weakSteps[0]?.text || 'step generico';
        throw new Error(`Procedimento Gemini troppo generico in ${contextLabel}: ${example}`);
    }

    return true;
}

function collectGeminiRecipesForQualityCheck(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return [];
    }

    if (Array.isArray(payload.procedimento) && Array.isArray(payload.ingredienti)) {
        return [{ recipe: payload, contextLabel: 'ricetta' }];
    }

    if (Array.isArray(payload.pasti)) {
        return payload.pasti.map((meal, index) => ({
            recipe: meal,
            contextLabel: `pasto ${index + 1}`
        }));
    }

    if (Array.isArray(payload.giorni)) {
        return payload.giorni.flatMap((day, dayIndex) => {
            const dayLabel = String(day?.giorno || `giorno ${dayIndex + 1}`).trim();
            return (Array.isArray(day?.pasti) ? day.pasti : []).map((meal, mealIndex) => ({
                recipe: meal,
                contextLabel: `${dayLabel} pasto ${mealIndex + 1}`
            }));
        });
    }

    return [];
}

function assertGeminiPayloadProcedureQuality(payload) {
    const recipes = collectGeminiRecipesForQualityCheck(payload);
    recipes.forEach(({ recipe, contextLabel }) => {
        if (recipe?.procedimento) {
            assertGeminiProcedureQuality(recipe.procedimento, contextLabel);
        }
    });
    return true;
}

function getConfiguredGeminiEndpointOverride() {
    try {
        if (typeof window !== 'undefined') {
            const configOverride = String(window.NUTRIME_CONFIG?.geminiFunctionUrl || '').trim();
            if (configOverride) {
                return configOverride;
            }

            const windowOverride = String(window.NUTRIME_GEMINI_FUNCTION_URL || '').trim();
            if (windowOverride) {
                return windowOverride;
            }

            const storedOverride = String(window.localStorage?.getItem('nutrime_gemini_function_url') || '').trim();
            if (storedOverride) {
                return storedOverride;
            }
        }
    } catch (error) {
        return '';
    }

    return '';
}

function getConfiguredGeminiModelOverride() {
    try {
        if (typeof window !== 'undefined') {
            const configModel = String(window.NUTRIME_CONFIG?.geminiModel || '').trim();
            if (configModel) {
                return configModel;
            }

            const windowModel = String(window.NUTRIME_GEMINI_MODEL || '').trim();
            if (windowModel) {
                return windowModel;
            }

            const storedModel = String(window.localStorage?.getItem('nutrime_gemini_model') || '').trim();
            if (storedModel) {
                return storedModel;
            }
        }
    } catch (error) {
        return '';
    }

    return 'gemini-2.0-flash';
}

function isGeminiQuotaExceededMessage(message) {
    const normalized = String(message || '').toLowerCase();
    return normalized.includes('quota exceeded')
        || normalized.includes('generate_content_free_tier_requests')
        || normalized.includes('free_tier_requests')
        || (normalized.includes('429') && normalized.includes('quota'));
}

function extractRetryAfterSecondsFromText(message) {
    const normalized = String(message || '').trim();
    const retryMatch = normalized.match(/retry in\s*([\d.]+)\s*s/i);
    if (retryMatch?.[1]) {
        const retrySeconds = Math.ceil(Number.parseFloat(retryMatch[1]));
        if (Number.isFinite(retrySeconds) && retrySeconds > 0) {
            return retrySeconds;
        }
    }

    const italianMatch = normalized.match(/riprova\s+tra\s+(?:circa\s+)?(\d+)\s+second/i);
    if (italianMatch?.[1]) {
        const retrySeconds = Number.parseInt(italianMatch[1], 10);
        if (Number.isFinite(retrySeconds) && retrySeconds > 0) {
            return retrySeconds;
        }
    }

    return 0;
}

function buildGeminiUserFacingErrorMessage(errorLike) {
    const rawMessage = String(errorLike?.message || errorLike || '').trim();
    const retryAfterSeconds = extractRetryAfterSecondsFromText(rawMessage);

    if (isGeminiQuotaExceededMessage(rawMessage)) {
        return retryAfterSeconds > 0
            ? `Gemini e temporaneamente in quota. Riprova tra circa ${retryAfterSeconds} secondi.`
            : 'Gemini e temporaneamente in quota. Riprova tra poco.';
    }

    return rawMessage || 'Gemini non disponibile al momento. Riprova tra poco.';
}

function removeRetryAfterHintFromMessage(message) {
    return String(message || '')
        .replace(/\s*riprova\s+tra\s+circa\s+\d+\s+secondi\.?/i, '')
        .replace(/\s*retry in\s*[\d.]+\s*s\.?/i, '')
        .trim();
}

function formatAIRetryCountdownLabel(seconds) {
    const safeSeconds = Math.max(0, Number.parseInt(String(seconds || 0), 10) || 0);
    if (safeSeconds <= 0) {
        return 'Puoi riprovare ora.';
    }

    return `Nuovo tentativo live tra ${safeSeconds} ${safeSeconds === 1 ? 'secondo' : 'secondi'}.`;
}

function buildAIRetryCountdownHtml(message, className = 'ai-retry-countdown') {
    const retryAfterSeconds = extractRetryAfterSecondsFromText(message);
    if (retryAfterSeconds <= 0) {
        return '';
    }

    return `<p class="${escapeHtml(className)}" data-ai-retry-countdown="${retryAfterSeconds}">${escapeHtml(formatAIRetryCountdownLabel(retryAfterSeconds))}</p>`;
}

function activateAIRetryCountdown(rootElement) {
    if (!rootElement) return;

    const countdownElements = rootElement.querySelectorAll('[data-ai-retry-countdown]');
    countdownElements.forEach((element) => {
        const existingInterval = Number.parseInt(String(element.dataset.aiRetryCountdownInterval || ''), 10);
        if (Number.isFinite(existingInterval) && existingInterval > 0) {
            window.clearInterval(existingInterval);
        }

        let remainingSeconds = Number.parseInt(String(element.getAttribute('data-ai-retry-countdown') || '0'), 10);
        if (!Number.isFinite(remainingSeconds) || remainingSeconds <= 0) {
            element.textContent = formatAIRetryCountdownLabel(0);
            return;
        }

        element.textContent = formatAIRetryCountdownLabel(remainingSeconds);

        const intervalId = window.setInterval(() => {
            remainingSeconds -= 1;
            element.textContent = formatAIRetryCountdownLabel(remainingSeconds);

            if (remainingSeconds <= 0) {
                window.clearInterval(intervalId);
                delete element.dataset.aiRetryCountdownInterval;
            }
        }, 1000);

        element.dataset.aiRetryCountdownInterval = String(intervalId);
    });
}

function isLocalNetworkHostname(hostname) {
    const normalized = String(hostname || '').trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    return normalized === 'localhost'
        || normalized === '127.0.0.1'
        || normalized === '0.0.0.0'
        || /^192\.168\./.test(normalized)
        || /^10\./.test(normalized)
        || /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
        || normalized.endsWith('.local');
}

function buildGeminiEndpointCandidates() {
    const candidates = [];
    const pushCandidate = (value) => {
        const normalized = String(value || '').trim();
        if (normalized && !candidates.includes(normalized)) {
            candidates.push(normalized);
        }
    };

    const override = getConfiguredGeminiEndpointOverride();
    if (override) {
        pushCandidate(override);
        return candidates;
    }

    if (typeof window !== 'undefined') {
        const protocol = String(window.location?.protocol || '').toLowerCase();
        const origin = String(window.location?.origin || '').trim();
        const hostname = String(window.location?.hostname || '').trim();
        const port = String(window.location?.port || '').trim();

        if (protocol === 'http:' || protocol === 'https:') {
            pushCandidate(new URL('/.netlify/functions/gemini', window.location.href).toString());
        }

        if (protocol === 'http:' && isLocalNetworkHostname(hostname) && port !== '8888') {
            pushCandidate(`http://${hostname}:8888/.netlify/functions/gemini`);
        }

        if (protocol === 'file:' || /localhost|127\.0\.0\.1/i.test(origin)) {
            pushCandidate('http://localhost:8888/.netlify/functions/gemini');
            pushCandidate('http://127.0.0.1:8888/.netlify/functions/gemini');
        }
    }

    pushCandidate('/.netlify/functions/gemini');
    return candidates;
}

async function readGeminiErrorDetails(response) {
    try {
        const retryAfterHeader = Number.parseInt(String(response?.headers?.get('Retry-After') || '').trim(), 10);
        const text = await response.text();
        if (!text) {
            return {
                details: '',
                retryAfterSeconds: Number.isFinite(retryAfterHeader) && retryAfterHeader > 0 ? retryAfterHeader : 0
            };
        }

        try {
            const parsed = JSON.parse(text);
            const details = parsed?.details?.error?.message
                || parsed?.details?.message
                || parsed?.details
                || parsed?.error
                || text;

            return {
                details,
                retryAfterSeconds: Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
                    ? retryAfterHeader
                    : extractRetryAfterSecondsFromText(details)
            };
        } catch (error) {
            return {
                details: text,
                retryAfterSeconds: Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
                    ? retryAfterHeader
                    : extractRetryAfterSecondsFromText(text)
            };
        }
    } catch (error) {
        return {
            details: '',
            retryAfterSeconds: 0
        };
    }
}

async function fetchGeminiJsonPayload(prompt, mode = 'generic') {
    const configuredEndpointOverride = getConfiguredGeminiEndpointOverride();
    const endpoints = buildGeminiEndpointCandidates();
    let lastError = 'Servizio Gemini non raggiungibile.';

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: GEMINI_MASTER_CHEF_SYSTEM_PROMPT,
                    prompt
                })
            });

            if (!res.ok) {
                const errorInfo = await readGeminiErrorDetails(res);
                const details = errorInfo.details;
                if (res.status === 404 || res.status === 405) {
                    lastError = `Endpoint Gemini non disponibile su ${endpoint} (${res.status}).`;
                    continue;
                }

                if (res.status === 429) {
                    const quotaMessage = errorInfo.retryAfterSeconds > 0
                        ? `Gemini temporaneamente in quota. Riprova tra circa ${errorInfo.retryAfterSeconds} secondi.`
                        : buildGeminiUserFacingErrorMessage(details || 'Gemini temporaneamente in quota.');
                    throw new Error(quotaMessage);
                }

                throw new Error(details ? `Errore Gemini ${res.status}: ${details}` : `Errore Gemini ${res.status}`);
            }

            const data = await res.json();
            const rawText = extractGeminiText(data);
            return parseGeminiModelResponse(rawText, mode);
        } catch (error) {
            const message = String(error?.message || error || '').trim();
            lastError = message ? `${message} [endpoint: ${endpoint}]` : `NetworkError [endpoint: ${endpoint}]`;
            continue;
        }
    }

    if (configuredEndpointOverride) {
        if (isGeminiQuotaExceededMessage(lastError)) {
            throw new Error(lastError);
        }

        throw new Error(`${lastError} Controlla che la function pubblica configurata sia raggiungibile, che l'origin sia autorizzato e che la quota Gemini non sia esaurita.`);
    }

    throw new Error(`${lastError} Avvia Netlify Dev su porta 8888, oppure configura window.NUTRIME_GEMINI_FUNCTION_URL / localStorage.nutrime_gemini_function_url o window.NUTRIME_CONFIG.geminiFunctionUrl con l'URL assoluto della tua function pubblica.`);
}

function assertGeminiDailyPlanSchema(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Schema Gemini non valido: piano giornaliero assente o non oggetto.');
    }

    if (!isNonEmptyString(payload.daily_theme)) {
        throw new Error('Schema Gemini non valido: daily_theme mancante nel piano giornaliero.');
    }

    if (!Array.isArray(payload.pasti) || payload.pasti.length < 4) {
        throw new Error('Schema Gemini non valido: il piano giornaliero deve contenere almeno 4 pasti.');
    }

    payload.pasti.forEach((meal, index) => assertGeminiRecipeSchema(meal, `pasto giornaliero ${index + 1}`));
    return true;
}

function assertGeminiWeeklyPlanSchema(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Schema Gemini non valido: piano settimanale assente o non oggetto.');
    }

    if (!isNonEmptyString(payload.weekly_strategy)) {
        throw new Error('Schema Gemini non valido: weekly_strategy mancante nel piano settimanale.');
    }

    if (!Array.isArray(payload.giorni) || payload.giorni.length !== 7) {
        throw new Error('Schema Gemini non valido: il piano settimanale deve contenere 7 giorni.');
    }

    payload.giorni.forEach((day, dayIndex) => {
        if (!day || typeof day !== 'object' || Array.isArray(day)) {
            throw new Error(`Schema Gemini non valido: giorno ${dayIndex + 1} non valido.`);
        }

        if (!isNonEmptyString(day.giorno)) {
            throw new Error(`Schema Gemini non valido: campo giorno mancante alla posizione ${dayIndex + 1}.`);
        }

        if (!isNonEmptyString(day.daily_theme)) {
            throw new Error(`Schema Gemini non valido: daily_theme mancante per ${day.giorno || `giorno ${dayIndex + 1}`}.`);
        }

        if (!Array.isArray(day.pasti) || day.pasti.length === 0) {
            throw new Error(`Schema Gemini non valido: pasti mancanti per ${day.giorno || `giorno ${dayIndex + 1}`}.`);
        }

        day.pasti.forEach((meal, mealIndex) => assertGeminiRecipeSchema(meal, `${day.giorno || `giorno ${dayIndex + 1}`} pasto ${mealIndex + 1}`));
    });

    return true;
}

async function generaRicettaGemini(promptConfig) {
    const mode = typeof promptConfig === 'string' ? 'generic' : promptConfig.mode;
    const prompt = typeof promptConfig === 'string'
        ? promptConfig
        : buildGeminiChefPrompt(promptConfig.mode, promptConfig.payload);

    try {
        const firstAttempt = await fetchGeminiJsonPayloadWithRetry(prompt, mode, 2);
        assertGeminiPayloadProcedureQuality(firstAttempt);
        return firstAttempt;
    } catch (firstError) {
        const retryPrompt = [
            prompt,
            'CORREZIONE OBBLIGATORIA DEL PROCEDIMENTO:',
            '- rigenera da zero il JSON;',
            '- il procedimento precedente e stato rifiutato perche troppo generico;',
            '- il procedimento deve avere almeno 5 step completi per una ricetta pranzo o cena;',
            '- devi descrivere il piatto dall inizio alla fine: preparazione ingredienti, cottura, eventuale assemblaggio o mantecatura, rifinitura e servizio;',
            '- inserisci obbligatoriamente almeno uno step di preparazione ingredienti, uno di cottura, uno di finitura e uno di servizio;',
            '- almeno 3 step devono contenere tempi, temperatura o intensita della fiamma;',
            '- almeno 2 step devono nominare utensili o recipienti;',
            '- ogni step deve iniziare con una etichetta d azione tipo Prepara:, Cuoci:, Manteca:, Inforna:, Servi:;',
            '- ogni step deve includere dettagli pratici: utensile o recipiente, tempo o temperatura, tecnica e segnale finale corretto;',
            '- non usare step riassuntivi o vaghi;',
            '- mantieni identico il formato JSON richiesto.'
        ].join('\n');

        const secondAttempt = await fetchGeminiJsonPayloadWithRetry(retryPrompt, mode, 2);
        assertGeminiPayloadProcedureQuality(secondAttempt);
        return secondAttempt;
    }
}

function normalizeGeminiIngredientList(items) {
    return (Array.isArray(items) ? items : []).map((item) => {
        if (typeof item === 'string') {
            return item.trim();
        }

        if (!item || typeof item !== 'object') {
            return '';
        }

        const quantity = String(item.quantita || item.qty || item.quantity || '').trim();
        const unit = String(item.unita || item.unit || '').trim();
        const name = String(item.nome || item.name || item.ingrediente || '').trim();
        return [quantity, unit, name].filter(Boolean).join(' ').trim();
    }).filter(Boolean);
}

function normalizeGeminiSteps(items) {
    return (Array.isArray(items) ? items : []).map((step) => String(step || '').trim()).filter(Boolean);
}

function normalizeGeminiMinutes(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(1, Math.round(value));
    }

    const text = String(value || '').trim();
    const match = text.match(/\d+/);
    return match ? Math.max(1, Number(match[0])) : 20;
}

function buildGeminiTargets(profile) {
    return {
        maintenanceCalories: Math.round(profile.maintenanceCalories || 0),
        targetCalories: Math.round(profile.targetCalories || 0),
        deltaCalories: Math.round(profile.goalCalorieDelta || 0),
        proteinGrams: Math.round(profile.proteinTargetGrams || 0),
        proteinPerKg: Number(profile.proteinTargetPerKg || 0).toFixed(1),
        carbsGrams: Math.round(profile.carbsTargetGrams || 0),
        fatGrams: Math.round(profile.fatTargetGrams || 0),
        fiberGrams: Math.round(profile.fiberTargetGrams || 0),
        hydrationLiters: Number(profile.waterTargetLiters || 0).toFixed(1)
    };
}

function normalizeGeminiRecipeShape(recipe) {
    const normalizedRecipe = recipe && typeof recipe === 'object' ? recipe : {};
    const mergedRecipe = {
        ...normalizedRecipe,
        ingredienti: normalizedRecipe.ingredienti || normalizedRecipe.ingredients,
        procedimento: normalizedRecipe.procedimento || normalizedRecipe.steps
    };

    assertGeminiRecipeSchema({
        ...mergedRecipe,
        titolo: String(mergedRecipe.titolo || mergedRecipe.title || mergedRecipe.nome_ricetta || 'Ricetta su misura').trim(),
        difficolta: String(mergedRecipe.difficolta || 'Facile').trim(),
        calorie: coerceFiniteNumber(mergedRecipe.calorie ?? mergedRecipe.kcal, 0),
        macro: normalizeGeminiMacroShape(mergedRecipe.macro, mergedRecipe),
        cottura_consigliata: String(mergedRecipe.cottura_consigliata || mergedRecipe.tecnica_cottura || mergedRecipe.chef_note || '').trim(),
        tip_antispreco: String(mergedRecipe.tip_antispreco || mergedRecipe.anti_spreco || mergedRecipe.wasteTip || '').trim(),
        bioavailability_tip: String(mergedRecipe.bioavailability_tip || '').trim(),
        tempo_prep: mergedRecipe.tempo_prep || mergedRecipe.tempo_prep_min || 20,
        ingredienti: normalizeGeminiIngredientList(mergedRecipe.ingredienti),
        procedimento: normalizeGeminiSteps(mergedRecipe.procedimento)
    });

    return {
        titolo: String(mergedRecipe.titolo || mergedRecipe.title || mergedRecipe.nome_ricetta || 'Ricetta su misura').trim(),
        tempo_prep: mergedRecipe.tempo_prep || mergedRecipe.tempo_prep_min || 20,
        tipo_pasto: String(mergedRecipe.tipo_pasto || mergedRecipe.meal_type || '').trim(),
        difficolta: String(mergedRecipe.difficolta || 'Facile').trim(),
        calorie: coerceFiniteNumber(mergedRecipe.calorie ?? mergedRecipe.kcal, 0),
        macro: normalizeGeminiMacroShape(mergedRecipe.macro, mergedRecipe),
        valori_nutrizionali: normalizeGeminiNutritionDetails(mergedRecipe.valori_nutrizionali || mergedRecipe.nutrition || mergedRecipe.nutritional_values, mergedRecipe),
        ingredienti: normalizeGeminiIngredientList(mergedRecipe.ingredienti),
        procedimento: normalizeGeminiSteps(mergedRecipe.procedimento),
        cottura_consigliata: String(mergedRecipe.cottura_consigliata || mergedRecipe.tecnica_cottura || mergedRecipe.chef_note || '').trim(),
        tip_antispreco: String(mergedRecipe.tip_antispreco || mergedRecipe.anti_spreco || mergedRecipe.wasteTip || '').trim(),
        bioavailability_tip: String(mergedRecipe.bioavailability_tip || '').trim()
    };
}

function adaptGeminiRecipeToCard(recipe, metadata = {}) {
    const normalizedRecipe = normalizeGeminiRecipeShape(recipe);
    const requestedMode = normalizeAIRecipeRequestedMode(metadata.difficulty);
    const slot = AI_RECIPE_MODE_SLOTS.find((item) => item.key === requestedMode) || AI_RECIPE_MODE_SLOTS[0];
    const nutritionDetails = normalizedRecipe.valori_nutrizionali;

    return {
        id: metadata.id || 'GEM-1',
        title: normalizedRecipe.titolo,
        nome_ricetta: normalizedRecipe.titolo,
        mode_key: slot.key,
        mode_label: slot.label,
        difficolta: normalizedRecipe.difficolta || slot.difficulty,
        style: slot.label,
        ingredients: normalizedRecipe.ingredienti,
        procedimento: normalizedRecipe.procedimento,
        steps: normalizedRecipe.procedimento,
        tempo_prep_min: normalizeGeminiMinutes(normalizedRecipe.tempo_prep),
        tipo_pasto: normalizedRecipe.tipo_pasto || metadata.mealType || 'Pranzo',
        bioavailability_tip: normalizedRecipe.bioavailability_tip,
        tecnica_cottura: normalizedRecipe.cottura_consigliata,
        anti_spreco: normalizedRecipe.tip_antispreco,
        nutrition: {
            ingredients: [{
                name: 'Totale ricetta',
                kcal: Math.round(nutritionDetails.kcal || 0),
                protein: Number(nutritionDetails.proteine || 0).toFixed(1),
                carbs: Number(nutritionDetails.carboidrati || 0).toFixed(1),
                fat: Number(nutritionDetails.grassi || 0).toFixed(1)
            }],
            total: {
                kcal: Math.round(nutritionDetails.kcal || 0),
                protein: Number(nutritionDetails.proteine || 0).toFixed(1),
                carbs: Number(nutritionDetails.carboidrati || 0).toFixed(1),
                fat: Number(nutritionDetails.grassi || 0).toFixed(1)
            },
            details: {
                kcal: Math.round(nutritionDetails.kcal || 0),
                proteine: Number(nutritionDetails.proteine || 0).toFixed(1),
                carboidrati: Number(nutritionDetails.carboidrati || 0).toFixed(1),
                zuccheri: Number(nutritionDetails.zuccheri || 0).toFixed(1),
                fibre: Number(nutritionDetails.fibre || 0).toFixed(1),
                grassi: Number(nutritionDetails.grassi || 0).toFixed(1),
                grassi_saturi: Number(nutritionDetails.grassi_saturi || 0).toFixed(1),
                sale: Number(nutritionDetails.sale || 0).toFixed(1)
            }
        }
    };
}

function renderAIRecipeNutritionDetails(recipe) {
    const details = recipe?.nutrition?.details;
    if (!details) return '';

    const rows = [
        ['Kcal intera ricetta', `${escapeHtml(details.kcal)} kcal`],
        ['Proteine', `${escapeHtml(details.proteine)} g`],
        ['Carboidrati', `${escapeHtml(details.carboidrati)} g`],
        ['Zuccheri', `${escapeHtml(details.zuccheri)} g`],
        ['Fibre', `${escapeHtml(details.fibre)} g`],
        ['Grassi', `${escapeHtml(details.grassi)} g`],
        ['Grassi saturi', `${escapeHtml(details.grassi_saturi)} g`],
        ['Sale', `${escapeHtml(details.sale)} g`]
    ];

    return `
        <details class="ai-nutrition-details">
            <summary>Valori nutrizionali</summary>
            <p class="ai-nutrition-footnote">Tutti i valori mostrati qui sotto, incluse le kcal, sono riferiti all'intera ricetta.</p>
            <div class="ai-nutrition-table-wrap">
                <table class="ai-nutrition-table">
                    <thead>
                        <tr>
                            <th>Voce</th>
                            <th>Valore</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(([label, value]) => `
                            <tr>
                                <td class="ai-nutrition-cell-main">${escapeHtml(label)}</td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </details>
    `;
}

const GEMINI_DAILY_SLOTS = ['Colazione', 'Spuntino', 'Pranzo', 'Cena'];
const GEMINI_WEEK_DAYS = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'];

function adaptGeminiMealToPlanEntry(recipe, slotLabel) {
    const normalizedRecipe = normalizeGeminiRecipeShape(recipe);

    return {
        slot: slotLabel,
        title: normalizedRecipe.titolo,
        whyItFits: normalizedRecipe.descrizione || normalizedRecipe.chef_note,
        items: normalizedRecipe.ingredienti,
        kcal: Math.round(normalizedRecipe.calorie || 0),
        protein: Number(normalizedRecipe.macro?.proteine || 0).toFixed(1),
        carbs: Number(normalizedRecipe.macro?.carbo || 0).toFixed(1),
        fat: Number(normalizedRecipe.macro?.grassi || 0).toFixed(1),
        notes: [normalizedRecipe.chef_note, normalizedRecipe.bioavailability_tip].filter(Boolean)
    };
}

function adaptGeminiDailyPlan(payload, profile, context = {}) {
    assertGeminiDailyPlanSchema(payload);
    const meals = (Array.isArray(payload?.pasti) ? payload.pasti : []).map((meal, index) => adaptGeminiMealToPlanEntry(meal, GEMINI_DAILY_SLOTS[index] || `Pasto ${index + 1}`));
    const notes = (Array.isArray(payload?.pasti) ? payload.pasti : [])
        .flatMap((meal) => {
            const normalizedRecipe = normalizeGeminiRecipeShape(meal);
            return [normalizedRecipe.chef_note, normalizedRecipe.bioavailability_tip];
        })
        .filter(Boolean);

    return {
        plan: {
            title: 'Piano giornaliero su misura',
            daily_theme: String(payload?.daily_theme || '').trim(),
            rationale: `Crononutrizione applicata al tuo profilo con focus su ${String(payload?.daily_theme || 'equilibrio energetico').trim().toLowerCase()}.`,
            lunchContext: context.lunchContext || 'workday',
            targets: buildGeminiTargets(profile),
            meals,
            notes: [...new Set(notes)]
        },
        meta: {
            source: 'gemini'
        }
    };
}

function adaptGeminiWeeklyPlan(payload, profile, context = {}) {
    assertGeminiWeeklyPlanSchema(payload);
    const inputDays = Array.isArray(payload?.giorni) ? payload.giorni : [];
    const days = inputDays.map((day, dayIndex) => {
        const meals = (Array.isArray(day?.pasti) ? day.pasti : []).map((meal, mealIndex) => adaptGeminiMealToPlanEntry(meal, GEMINI_DAILY_SLOTS[mealIndex] || `Pasto ${mealIndex + 1}`));
        const notes = (Array.isArray(day?.pasti) ? day.pasti : []).flatMap((meal) => {
            const normalizedRecipe = normalizeGeminiRecipeShape(meal);
            return [normalizedRecipe.chef_note, normalizedRecipe.bioavailability_tip];
        }).filter(Boolean);

        return {
            day: String(day?.giorno || GEMINI_WEEK_DAYS[dayIndex] || `Giorno ${dayIndex + 1}`).trim(),
            daily_theme: String(day?.daily_theme || '').trim(),
            focus: String(day?.daily_theme || 'Struttura del giorno').trim(),
            meals,
            notes: [...new Set(notes)]
        };
    });

    return {
        week: {
            title: 'Piano settimanale su misura',
            rationale: String(payload?.weekly_strategy || '').trim(),
            targets: buildGeminiTargets(profile),
            days,
            notes: [
                String(payload?.weekly_strategy || '').trim(),
                context.preferences ? `Preferenze considerate: ${context.preferences}` : ''
            ].filter(Boolean)
        },
        meta: {
            source: 'gemini'
        }
    };
}
const wizardJobLabels = {
    sedentario: 'Sedentario',
    moderato: 'Moderato',
    attivo: 'Attivo'
};

const wizardGoalLabels = {
    dimagrire: 'Perdere peso',
    mantenere: 'Mantenere pesoforma',
    massa: 'Aumentare massa muscolare',
    benessere: 'Benessere generale'
};

const avatarMoodLabels = {
    'avatars/1.jpg': 'determinato e pronto a partire con energia',
    'avatars/2.jpg': 'sereno e concentrato sul tuo benessere',
    'avatars/3.jpg': 'carico e con una bella spinta positiva',
    'avatars/4.jpg': 'equilibrato e motivato a fare bene',
    'avatars/5.jpg': 'grintoso e pieno di voglia di rimetterti in gioco',
    'avatars/6.jpg': 'lucido e pronto a dare continuita alle tue abitudini',
    'avatars/7.jpg': 'riflessivo ma con la giusta energia per iniziare',
    'avatars/8.jpg': 'positivo e deciso a prenderti cura di te'
};

function getWizardJobLabel(value) {
    return wizardJobLabels[value] || value || 'Non specificato';
}

function getWizardJobDescription(value) {
    const descriptions = {
        sedentario: 'passi la maggior parte del tuo tempo lavorativo seduto',
        moderato: 'alterni momenti di attivita e momenti di sedentarieta',
        attivo: 'passi la maggior parte del tuo tempo lavorativo in piedi o in modo attivo'
    };

    return descriptions[value] || 'non hai specificato il tuo tipo di lavoro';
}

function getWizardGoalLabel(value) {
    return wizardGoalLabels[value] || value || 'Non specificato';
}

function formatSportLabel(name) {
    const cleanName = (name || '').toString().trim();

    if (cleanName) {
        return cleanName;
    }

    return '-';
}

function getAvatarMoodLabel(path) {
    return avatarMoodLabels[normalizeAvatarPath(path)] || 'positivo e pronto a iniziare questo percorso';
}

function getDietNarrative(diet) {
    if (!diet || diet === 'regime alimentare non specificato') {
        return 'un regime alimentare non ancora specificato';
    }

    return `un regime alimentare ${diet}`;
}

function getAllergyNarrative(allergies, intolerances) {
    const hasAllergies = allergies && allergies !== 'non allergico a sostanze o alimenti';
    const hasIntolerances = intolerances && intolerances !== 'non intollerante ad alimenti';

    if (hasAllergies && hasIntolerances) {
        return `Hai indicato allergie a ${allergies} e intolleranze a ${intolerances}`;
    }

    if (hasAllergies) {
        return `Hai indicato allergie a ${allergies}, mentre non hai segnalato intolleranze`;
    }

    if (hasIntolerances) {
        return `Non hai segnalato allergie, ma hai indicato intolleranze a ${intolerances}`;
    }

    return 'Non hai indicato allergie o intolleranze';
}

function getOtherPathologiesNarrative(otherPathologies) {
    const text = String(otherPathologies || '').trim();

    if (!text || text === 'non specificato') {
        return 'Non hai indicato altre patologie';
    }

    return `Hai indicato queste altre patologie o condizioni cliniche: ${text}`;
}

function getSmokeNarrative(smoke) {
    const smokeLabels = {
        si: 'Hai indicato di fumare attualmente.',
        no: 'Hai indicato di non fumare.',
        qualche_volta: 'Hai indicato di fumare qualche volta.'
    };

    return smokeLabels[smoke] || 'Non hai specificato il tuo rapporto con il fumo.';
}

function getMotivationNarrative(motivation) {
    if (!motivation || motivation === 'non specificato') {
        return 'Stai ancora definendo la motivazione principale che ti spinge a intraprendere questo percorso.';
    }

    return `La motivazione che ti spinge a intraprendere questo percorso e: ${motivation}.`;
}

function buildLifestyleGuidanceContent(draftProfile) {
    const weight = Number(draftProfile?.weight) || 0;
    const workouts = Number(draftProfile?.workoutsPerWeek) || 0;
    const goal = draftProfile?.goal || 'mantenere';
    const diet = (draftProfile?.diet || '').toString().toLowerCase();
    const waterTarget = Number(draftProfile?.acquaObiettivo) > 0
        ? `${draftProfile.acquaObiettivo} L`
        : '2,5-3 L';
    const waterFocus = workouts >= 4
        ? 'Con la tua frequenza di allenamento conviene stare nella parte alta del target, distribuendo bene l acqua tra mattina, pre workout e recupero.'
        : workouts >= 2
            ? 'Nei giorni di allenamento concentrane una quota tra mattina, pre allenamento e ore successive allo sforzo.'
            : 'La priorita resta la costanza quotidiana, evitando di concentrare tutta l acqua nelle ore serali.';
    const sodiumFocus = workouts >= 4
        ? 'Con una sudorazione piu frequente, un piccolo pizzico di sale marino integrale per pietanza puo migliorare anche tolleranza e recupero.'
        : 'Un piccolo pizzico di sale marino integrale per pietanza puo essere una strategia semplice per migliorare gusto e aderenza al piano.';

    let goalFocus = 'Mantieni una struttura alimentare regolare e sostenibile, usando i pasti liberi come flessibilita e non come compensazione.';
    let creatineFocus = 'La creatina puo restare a 3-5 g quotidiani al mattino come supporto pratico a energia muscolare e recupero.';

    if (goal === 'dimagrire') {
        goalFocus = 'Nel tuo caso il pasto libero va gestito con lucidita: meglio 1-2 pasti liberi veri, ma senza trasformarli in un intero weekend fuori traccia, cosi proteggi deficit, sazieta e continuita.';
        creatineFocus = 'La creatina puo restare a 3-5 g quotidiani al mattino anche in fase di dimagrimento, per proteggere performance, tono e massa magra.';
    } else if (goal === 'massa') {
        goalFocus = 'Se il focus e aumentare massa muscolare, anche il pasto libero dovrebbe mantenere una base proteica chiara e una quota energetica utile, senza diventare disordinato o casuale.';
        creatineFocus = 'La creatina a 3-5 g quotidiani al mattino e particolarmente sensata se il focus e performance, recupero e crescita muscolare.';
    }

    const caffeineFocus = weight >= 85 || workouts >= 4
        ? 'Limita comunque il caffe a 2 massimo 3 al giorno, concentrandolo nella prima parte della giornata per non peggiorare recupero e sonno.'
        : 'Anche se ben tollerato, il caffe resta piu utile se contenuto entro 2 massimo 3 al giorno e concentrato nella prima parte della giornata.';
    const fatigueFocus = workouts >= 3
        ? 'Nei periodi di stanchezza marcata, turni notturni o jet lag si puo valutare un breve carico di creatina da 15-20 g al giorno in 4 dosi per 5-7 giorni.'
        : 'Nei periodi di stanchezza marcata, turni notturni o jet lag si puo comunque valutare un breve carico di creatina da 15-20 g al giorno in 4 dosi per 5-7 giorni.';
    const b12Focus = /vegan|vegano|vegetarian|vegetariano/.test(diet)
        ? 'Con un regime vegetale o vegetariano, la regolarita dell integrazione di vitamina B12 merita ancora piu attenzione.'
        : 'Anche in un regime onnivoro la vitamina B12 puo rimanere utile se gia prevista dal protocollo che stai seguendo.';

    return {
        summary: {
            hydration: `Per il tuo profilo il riferimento idrico realistico e vicino a <strong>${escapeHtml(waterTarget)}</strong> al giorno, una quota coerente con il tuo peso corporeo e utile anche per una migliore funzionalita intestinale. ${waterFocus} Durante i pasti conviene bere poco: 2 bicchieri 15-20 minuti prima e di nuovo dopo circa 30 minuti.`,
            meals: `A tavola puoi usare liberamente erbe aromatiche e spezie, con ottime rotazioni come cannella, curcuma e zenzero. ${sodiumFocus} Evita succhi di frutta, te confezionati, bibite e alcolici. ${caffeineFocus}`,
            supplements: `${goalFocus} Sul piano integrativo, la vitamina B12 puo restare su 1 compressa al giorno oppure B12 50 mcg LongLife 1 al giorno. ${creatineFocus} ${fatigueFocus}`
        },
        cards: [
            {
                title: 'Apporto idrico e salino',
                text: `${sodiumFocus} Le spezie restano una leva libera e intelligente per dare gusto senza appesantire la giornata: cannella, curcuma e zenzero sono ottime rotazioni.`
            },
            {
                title: 'Acqua durante la giornata',
                text: `Per il tuo profilo il riferimento pratico e circa ${waterTarget} al giorno. ${waterFocus} Durante i pasti mantieni una quota piu contenuta: 2 bicchieri 15-20 minuti prima e poi di nuovo dopo circa 30 minuti.`
            },
            {
                title: 'Bevande da limitare',
                text: `Evita succhi di frutta, te confezionati, bibite e alcolici, perche le calorie liquide peggiorano facilmente fame e controllo. ${caffeineFocus}`
            },
            {
                title: 'Pasti liberi gestiti bene',
                text: goalFocus
            },
            {
                title: 'Vitamina B12',
                text: `${b12Focus} Se gia prevista, puoi mantenere 1 compressa al giorno oppure B12 50 mcg LongLife 1 al giorno.`
            },
            {
                title: 'Creatina',
                text: `${creatineFocus} ${fatigueFocus}`
            }
        ]
    };
}

function getLifestyleGuidanceNarrative(draftProfile) {
    return buildLifestyleGuidanceContent(draftProfile).summary;
}

function renderLifestyleGuidancePanel(profileData) {
    const guidanceGrid = document.getElementById('lifestyle-guidance-grid');

    if (!guidanceGrid) {
        return;
    }

    const sourceProfile = profileData || JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {};
    const guidanceCards = buildLifestyleGuidanceContent(sourceProfile).cards;

    guidanceGrid.innerHTML = guidanceCards.map((card) => `
        <article class="chef-mode-guide-card">
            <strong>${escapeHtml(card.title)}</strong>
            <p>${escapeHtml(card.text)}</p>
        </article>
    `).join('');
}

function isVegetarianPlanning(profile) {
    const signals = normalizePlanningText(`${profile?.diet || ''} ${profile?.otherPathologies || ''}`);
    return !shouldUseVeganPlanning(profile, signals)
        && (signals.includes('vegetarian') || signals.includes('vegetariano') || signals.includes('vegetariana'));
}

function getWeeklyGuidanceDietLabel(profile) {
    const rawDiet = String(profile?.diet || '').trim();

    if (!rawDiet || normalizePlanningText(rawDiet).includes('non specificato')) {
        return 'regime alimentare non specificato';
    }

    return rawDiet;
}

function getPlanningDietMode(profile) {
    if (shouldUseVeganPlanning(profile)) {
        return 'vegan';
    }

    if (isVegetarianPlanning(profile)) {
        return 'vegetarian';
    }

    return 'omnivore';
}

function buildGenericWeeklyGuidancePlan(profile, lunchContext = 'workday') {
    const dietMode = getPlanningDietMode(profile);
    const goal = profile?.goal || 'mantenere';
    const lunchContextLabel = getLunchContextLabel(lunchContext).toLowerCase();
    const breakfastRotation = dietMode === 'vegan'
        ? (goal === 'massa'
            ? [
                {
                    title: 'Yogurt di soia con avena, semi e doppia frutta',
                    items: ['170 g yogurt di soia naturale', '40 g avena', '10 g semi di chia o lino', '1-2 porzioni di frutta fresca']
                },
                {
                    title: 'Pane integrale con crema 100% frutta secca e bevanda vegetale',
                    items: ['60 g pane integrale', '20 g crema 100% frutta secca', '200 ml bevanda vegetale senza zuccheri', '1 frutto']
                },
                {
                    title: 'Porridge vegetale piu energetico',
                    items: ['40 g avena', 'bevanda di soia', 'semi misti', '1 frutto piccolo']
                }
            ]
            : [
                {
                    title: 'Yogurt di soia con avena e frutta fresca',
                    items: ['125-170 g yogurt di soia naturale', '30 g avena o muesli senza zuccheri', '1 porzione di frutta fresca']
                },
                {
                    title: 'Pane integrale con crema 100% frutta secca',
                    items: ['50 g pane integrale', '15-20 g crema 100% frutta secca', '1 frutto di stagione']
                },
                {
                    title: 'Porridge semplice con semi e frutta',
                    items: ['35 g avena', 'bevanda vegetale senza zuccheri', 'semi di chia o lino', '1 frutto piccolo']
                }
            ])
        : dietMode === 'vegetarian'
            ? (goal === 'dimagrire'
                ? [
                    {
                        title: 'Yogurt greco con avena e frutta fresca',
                        items: ['150-170 g yogurt greco', '25-30 g avena', '1 porzione di frutta fresca']
                    },
                    {
                        title: 'Pane integrale tostato con ricotta leggera',
                        items: ['50 g pane integrale', '60 g ricotta leggera', '1 frutto di stagione']
                    },
                    {
                        title: 'Porridge leggero con quota proteica',
                        items: ['30-35 g avena', 'latte o yogurt bianco', '1 frutto piccolo']
                    }
                ]
                : [
                    {
                        title: 'Yogurt bianco o greco con avena e frutta fresca',
                        items: ['125-170 g yogurt bianco o greco', '30 g avena o muesli senza zuccheri', '1 porzione di frutta fresca']
                    },
                    {
                        title: 'Pane integrale con ricotta o crema di frutta secca',
                        items: ['50-60 g pane integrale', 'ricotta leggera oppure crema 100% frutta secca', '1 frutto']
                    },
                    {
                        title: 'Pancake o porridge integrale ben strutturato',
                        items: ['base integrale semplice', '1 porzione di frutta fresca', 'eventuale yogurt o latte']
                    }
                ])
            : (goal === 'massa'
                ? [
                    {
                        title: 'Yogurt greco con avena, frutta e semi',
                        items: ['170 g yogurt greco', '40 g avena', '1 porzione abbondante di frutta', '10 g semi']
                    },
                    {
                        title: 'Pane integrale, ricotta e frutta',
                        items: ['60 g pane integrale', '70 g ricotta', '1 frutto', 'eventuale bevanda a lato']
                    },
                    {
                        title: 'Pancake integrali con yogurt',
                        items: ['pancake integrali semplici', 'yogurt bianco', '1 frutto di stagione']
                    }
                ]
                : [
                    {
                        title: 'Yogurt bianco o greco con avena e frutta fresca',
                        items: ['125-170 g yogurt bianco o greco', '30 g avena o muesli senza zuccheri', '1 porzione di frutta fresca']
                    },
                    {
                        title: 'Pane integrale tostato con ricotta o marmellata senza zuccheri',
                        items: ['50 g pane integrale', 'ricotta magra oppure marmellata senza zuccheri', '1 frutto di stagione']
                    },
                    {
                        title: 'Pancake o porridge integrale ben strutturato',
                        items: ['base integrale semplice', '1 porzione di frutta fresca', 'eventuale quota proteica come yogurt o latte']
                    }
                ]);
    const snackItems = goal === 'dimagrire'
        ? ['frutta fresca di stagione', 'crudite senza sale oppure 10 g frutta secca se serve piu sazieta', 'spuntini brevi e protettivi, senza trasformarli in mini pasti casuali']
        : (goal === 'massa'
            ? ['frutta fresca di stagione', 'yogurt, kefir o bevanda proteica se utile', '10-20 g frutta secca o semi per aumentare energia e continuita']
            : ['frutta fresca di stagione', 'yogurt naturale, crudite o 10 g frutta secca secondo fame e giornata']);
    const lunchBases = dietMode === 'vegan'
        ? [
            'bowl vegetale con cereale integrale, legumi e ortaggi',
            'piatto unico con riso o farro, tofu o tempeh e verdure',
            'insalatona completa con cereali, legumi e semi',
            'pasta integrale con verdure e legumi',
            'zuppa o minestrone con legumi e pane integrale',
            'pranzo piu disteso con base amidacea e proteina vegetale chiara',
            'piatto della domenica vegetale con struttura completa'
        ]
        : dietMode === 'vegetarian'
            ? [
                'piatto unico con cereale integrale, ortaggi e proteina vegetariana',
                'pasta integrale con verdure e uova o legumi',
                'insalatona completa con cereali, legumi o formaggio fresco leggero',
                'orzotto o riso con verdure e quota proteica vegetariana',
                'piatto semplice con pane, ortaggi e proteina vegetariana chiara',
                'pranzo piu disteso ma sempre leggibile e bilanciato',
                'domenica con primo ordinato e secondo vegetariano leggero'
            ]
            : [
                'pasta o cereale integrale con verdure di stagione',
                'piatto unico con cereale, verdure e proteina leggibile',
                'insalatona completa con cereali e ortaggi',
                'orzotto, riso o zuppa con base vegetale',
                'riso, farro o pasta con ortaggi e condimento semplice',
                'pranzo piu disteso ma con struttura chiara',
                'pranzo della domenica piu curato ma equilibrato'
            ];
    const dinnerProteins = dietMode === 'vegan'
        ? ['legumi', 'tofu o tempeh', 'burger vegetali o seitan', 'legumi', 'tofu o tempeh', 'burger vegetali', 'legumi o tofu']
        : dietMode === 'vegetarian'
            ? ['legumi', 'uova', 'tofu o tempeh', 'ricotta o formaggio fresco leggero', 'legumi', 'uova', 'tofu o formaggio fresco leggero']
            : ['pesce', 'carne bianca', 'uova', 'pesce', 'legumi', 'carne bianca', 'pesce o formaggio fresco leggero'];
    const goalFocusMap = {
        dimagrire: ['controllo della fame e densita energetica', 'continuita senza eccessi', 'volume del piatto e sazieta', 'ordine nei carboidrati', 'chiusura di settimana pulita', 'socialita gestita bene', 'appagamento senza perdere struttura'],
        massa: ['energia stabile e recupero', 'quota proteica ben distribuita', 'continuita calorica ordinata', 'carboidrati utili all allenamento', 'giornata piena ma leggibile', 'pranzo piu ricco ben gestito', 'recupero e struttura'],
        mantenere: ['equilibrio e continuita', 'varieta e praticita', 'rotazione proteica semplice', 'energia stabile', 'leggerezza sostenibile', 'flessibilita del weekend', 'chiusura settimanale ordinata']
    };
    const days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'].map((day, index) => {
        const breakfast = breakfastRotation[index % breakfastRotation.length];
        const lunchGoalHint = goal === 'massa'
            ? 'con quota amidacea piena e proteina ben leggibile per sostenere energia e recupero'
            : (goal === 'dimagrire'
                ? 'con quota amidacea misurata, alto volume vegetale e proteina chiara per aumentare sazieta'
                : 'con equilibrio semplice e ripetibile tra energia, proteina e verdure');
        const dinnerCarbHint = goal === 'massa'
            ? 'quota glucidica di supporto ben dichiarata come riso, pane, cereali o patate'
            : (goal === 'dimagrire'
                ? 'quota glucidica semplice ma misurata, anche piu contenuta se la giornata e stata piu ricca'
                : (index >= 5 ? 'quota glucidica semplice ma non eccessiva' : 'pane o patate in quota leggibile'));
        const lunchCompletion = completePlanMealItems(
            'Pranzo',
            [
                lunchBases[index],
                index >= 5 && lunchContext === 'free-day'
                    ? 'porzione piu distesa ma senza perdere equilibrio'
                    : `struttura facile da gestire in un ${lunchContextLabel}`,
                lunchGoalHint,
                'verdure presenti in modo chiaro',
                '10-15 g olio EVO preferibilmente a crudo'
            ],
            {
                protein: dietMode === 'vegan'
                    ? 'aggiungi una proteina vegetale ben leggibile come legumi, tofu o tempeh'
                    : (dietMode === 'vegetarian'
                        ? 'aggiungi una proteina chiara come legumi, uova, tofu o formaggio fresco leggero'
                        : 'aggiungi una fonte proteica leggibile come pesce, legumi, uova o carne bianca'),
                cereal: 'completa con una base amidacea chiara come riso, farro, pasta, pane o patate',
                vegetables: 'assicurati che sia presente una quota di verdure ben visibile',
                healthyFat: 'dichiara una quota misurata di grassi buoni, preferibilmente olio EVO'
            }
        );
        const dinnerCompletion = completePlanMealItems(
            'Cena',
            [
                `fonte proteica principale: ${dinnerProteins[index]}`,
                dinnerCarbHint,
                '10 g olio EVO preferibilmente a crudo'
            ],
            {
                protein: `aggiungi una proteina coerente con la rotazione del giorno: ${dinnerProteins[index]}`,
                cereal: 'se manca, completa con una base semplice come pane, riso, cereale o patate',
                vegetables: 'aggiungi una quota ben visibile di verdure',
                healthyFat: 'dichiara una quota misurata di grassi buoni, preferibilmente olio EVO'
            }
        );

        return {
            day,
            focus: goalFocusMap[goal]?.[index] || 'equilibrio e continuita',
            meals: [
                {
                    slot: 'Colazione',
                    title: breakfast.title,
                    items: breakfast.items
                },
                {
                    slot: 'Spuntini',
                    title: 'Spuntini flessibili ma ordinati',
                    items: snackItems
                },
                {
                    slot: 'Pranzo',
                    title: lunchBases[index],
                    items: lunchCompletion.items
                },
                {
                    slot: 'Cena',
                    title: `Cena con ${dinnerProteins[index]}`,
                    items: dinnerCompletion.items
                }
            ],
            notes: [
                index >= 5
                    ? 'Nel weekend il menu puo essere piu rilassato, ma resta utile mantenere una struttura leggibile.'
                    : `In un ${lunchContextLabel} conviene mantenere il pranzo pratico e ripetibile.`,
                goal === 'dimagrire'
                    ? 'Tieni alta la presenza di verdure e proteine, e usa i carboidrati in modo piu misurato ma non punitivo.'
                    : (goal === 'massa'
                        ? 'Distribuisci bene energia e proteine nella giornata, con quote amidacee piu dichiarate attorno ai pasti principali.'
                        : 'La priorita resta una routine semplice, varia e sostenibile.'),
                dietMode === 'vegan'
                    ? 'Controlla due volte al giorno la presenza di proteine vegetali chiare e usa semi, frutta secca e olio EVO con misura.'
                    : (dietMode === 'vegetarian'
                        ? 'Alterna legumi, uova, tofu e latticini leggeri senza appoggiarti sempre alla stessa fonte proteica.'
                        : 'Ruota pesce, legumi, uova e carni bianche con piu continuita, lasciando la carne rossa piu sporadica.')
            ]
        };
    });

    const titleMap = {
        dimagrire: {
            vegan: 'Menu settimanale vegano orientato al dimagrimento',
            vegetarian: 'Menu settimanale vegetariano orientato al dimagrimento',
            omnivore: 'Menu settimanale orientato al dimagrimento'
        },
        massa: {
            vegan: 'Menu settimanale vegano per supporto a massa e recupero',
            vegetarian: 'Menu settimanale vegetariano per supporto a massa e recupero',
            omnivore: 'Menu settimanale per supporto a massa e recupero'
        },
        mantenere: {
            vegan: 'Menu settimanale vegano di equilibrio e continuita',
            vegetarian: 'Menu settimanale vegetariano di equilibrio e continuita',
            omnivore: 'Menu settimanale di equilibrio e continuita'
        }
    };
    const rationaleMap = {
        dimagrire: `Schema costruito per aumentare sazieta, leggibilita del pasto e continuita, con carboidrati piu ordinati e densita energetica meglio controllata nel contesto ${lunchContextLabel}.`,
        massa: `Schema costruito per sostenere energia, recupero e quota proteica distribuita, con una presenza amidacea piu esplicita e una struttura facile da mantenere nel contesto ${lunchContextLabel}.`,
        mantenere: `Schema costruito per dare varieta, stabilita e una buona rotazione dei pasti senza irrigidire troppo la settimana nel contesto ${lunchContextLabel}.`
    };

    return {
        title: titleMap[goal]?.[dietMode] || 'Menu settimanale flessibile costruito sul tuo profilo',
        rationale: rationaleMap[goal] || `Schema orientativo costruito in base al tuo obiettivo, al tuo regime alimentare e al contesto pranzo ${lunchContextLabel}.`,
        notes: [
            'Questo schema funziona come traccia pratica: puoi scambiare i pasti tra giorni diversi mantenendo la stessa logica nutrizionale.',
            'Per ogni pasto principale controlla la presenza di verdure, una proteina chiara, una base amidacea leggibile e grassi buoni ben misurati.',
            goal === 'dimagrire'
                ? 'Quando vuoi alleggerire il piano, riduci prima extras, condimenti e porzioni amidacee troppo abbondanti, non le verdure e non la quota proteica.'
                : (goal === 'massa'
                    ? 'Quando vuoi sostenere meglio allenamento e recupero, alza in modo ordinato quota amidacea e proteica invece di aggiungere calorie casuali.'
                    : 'Se aggiorni profilo, obiettivo o preferenze, anche questo menu guida va reinterpretato di conseguenza.'),
            dietMode === 'vegan'
                ? 'Nel profilo vegano la settimana deve rendere sempre leggibile la presenza di legumi, tofu, tempeh, seitan o altre proteine vegetali strutturate.'
                : (dietMode === 'vegetarian'
                    ? 'Nel profilo vegetariano conviene alternare davvero le fonti proteiche, senza concentrare tutto su latticini e formaggi.'
                    : 'Nel profilo onnivoro il valore aggiunto sta soprattutto nella rotazione intelligente delle proteine e nella presenza costante delle verdure.')
        ],
        days
    };
}

function buildWeeklyGuidanceContent(profile) {
    const sourceProfile = profile || {};
    const lunchContext = sourceProfile?.lunchContextPreference === 'free-day' ? 'free-day' : 'workday';
    const clinicalContext = getClinicalNutritionContext(sourceProfile);
    const week = clinicalContext.applicable
        ? getAIWeeklyPlanFallback(sourceProfile, '', lunchContext)
        : buildGenericWeeklyGuidancePlan(sourceProfile, lunchContext);
    const goalLabel = getWizardGoalLabel(sourceProfile?.goal || 'mantenere');
    const dietLabel = getWeeklyGuidanceDietLabel(sourceProfile);
    const dinnerPreferenceLabel = getDinnerProteinPreferenceLabel(sourceProfile?.dinnerProteinPreference || 'variata');
    const profileLabel = clinicalContext.applicable
        ? clinicalContext.profileLabel
        : 'Profilo generale senza pattern clinico specifico';
    const cards = [
        {
            title: week.title || 'Menu settimanale su misura',
            bodyHtml: `
                <p>Questo e il contenitore unico dei menu settimanali del chef nutrizionista: la struttura si aggiorna in base alle informazioni che l'utente ha scelto, cosi i piani restano intercambiabili ma coerenti con il profilo.</p>
                ${week.rationale ? `<p>${escapeHtml(week.rationale)}</p>` : ''}
            `
        },
        {
            title: 'Profilo considerato',
            bodyHtml: `
                <p><strong>Obiettivo:</strong> ${escapeHtml(goalLabel)}</p>
                <p><strong>Regime alimentare:</strong> ${escapeHtml(dietLabel)}</p>
                <p><strong>Contesto pranzo:</strong> ${escapeHtml(getLunchContextLabel(lunchContext))}</p>
                <p><strong>Rotazione proteica serale:</strong> ${escapeHtml(dinnerPreferenceLabel)}</p>
                <p><strong>Pattern riconosciuto:</strong> ${escapeHtml(profileLabel)}</p>
            `
        },
        ...((Array.isArray(week.days) ? week.days : []).map((day) => ({
            title: day.day || 'Giorno',
            bodyHtml: `
                ${day.focus ? `<p><strong>Focus:</strong> ${escapeHtml(day.focus)}</p>` : ''}
                ${(Array.isArray(day.meals) ? day.meals : []).map((meal) => `
                    <p><strong>${escapeHtml(meal.slot || 'Pasto')}:</strong> ${escapeHtml(meal.title || '')}</p>
                    ${(Array.isArray(meal.items) && meal.items.length > 0) ? `<ul class="ai-plan-note-list">${renderAICardList(meal.items)}</ul>` : ''}
                `).join('')}
                ${(Array.isArray(day.notes) && day.notes.length > 0) ? `<ul class="ai-plan-note-list">${renderAICardList(day.notes)}</ul>` : ''}
            `
        }))),
        ...((Array.isArray(week.notes) && week.notes.length > 0)
            ? [{
                title: 'Note della settimana',
                bodyHtml: `<ul class="ai-plan-note-list">${renderAICardList(week.notes)}</ul>`
            }]
            : [])
    ];

    return { cards };
}

function renderWeeklyGuidancePanel(profileData) {
    const weeklyGuidanceGrid = document.getElementById('weekly-guidance-grid');

    if (!weeklyGuidanceGrid) {
        return;
    }

    const sourceProfile = profileData || JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {};
    const weeklyCards = buildWeeklyGuidanceContent(sourceProfile).cards;

    weeklyGuidanceGrid.innerHTML = weeklyCards.map((card) => `
        <article class="chef-mode-guide-card">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.bodyHtml || `<p>${escapeHtml(card.text || '')}</p>`}
        </article>
    `).join('');
}

function buildSmartRecipeGuidanceContent(profile) {
    const sourceProfile = profile || {};
    const dietMode = getPlanningDietMode(sourceProfile);
    const goal = sourceProfile?.goal || 'mantenere';
    const goalLabel = getWizardGoalLabel(goal);
    const dietLabel = getWeeklyGuidanceDietLabel(sourceProfile);
    const recipes = [];

    recipes.push({
        title: 'Hummus di pomodori secchi e capperi',
        bodyHtml: `
            <p><strong>Perche lo stai vedendo:</strong> e una proposta molto trasversale, adatta a quasi tutti i profili e particolarmente utile quando servono praticita, sapore e buona sazieta con una base vegetale chiara.</p>
            <p><strong>Quando usarlo nel tuo profilo:</strong> ${goal === 'dimagrire'
                ? 'puo funzionare bene come pranzo leggero o cena smart se abbini crudite e tieni la piadina in quota leggibile.'
                : (goal === 'massa'
                    ? 'puo diventare un ottimo supporto se lo abbini a una quota amidacea piu piena o a un contorno che aumenti energia e completezza del pasto.'
                    : 'puo essere usato come aperitivo evoluto, pranzo leggero o cena veloce ben organizzata.')}</p>
            <p><strong>Ingredienti per 2 persone:</strong> olio EVO 15g; ceci cotti 250g; pomodori secchi e capperi sott'olio 100g; succo di limone 30g; capperi 15g; basilico fresco 5g; piadina 240g.</p>
            <p><strong>Procedimento:</strong></p>
            <ul class="ai-plan-note-list">${renderAICardList([
                'Versa nel frullatore pomodori secchi e capperi sott olio, ceci, succo di limone, un pizzico di sale e 15g di olio EVO, poi frulla fino a ottenere una crema liscia e omogenea.',
                'Scalda una padella antiaderente e tosta i capperi per pochi secondi, finche diventano croccanti.',
                'Riscalda la piadina su una piastra calda per circa 1 minuto per lato.',
                'Taglia la piadina a spicchi e distribuisci l hummus in una ciotola o in piccoli piatti individuali.',
                'Completa con i capperi tostati, il basilico fresco e un filo di olio EVO a crudo tenuto dai 15g totali.'
            ])}</ul>
        `
    });

    if (dietMode === 'vegan') {
        recipes.push({
            title: 'Hummus di spinaci in versione vegetale',
            bodyHtml: `
                <p><strong>Perche lo stai vedendo:</strong> nel tuo profilo la ricetta viene adattata in chiave 100% vegetale, cosi resta coerente con il regime scelto ma continua a essere cremosa, pratica e appagante.</p>
                <p><strong>Quando usarlo nel tuo profilo:</strong> ${goal === 'dimagrire'
                    ? 'funziona bene come cena leggera se aumenti la quota di verdure e mantieni semplice la base amidacea.'
                    : (goal === 'massa'
                        ? 'puo diventare piu solido se lo abbini a una piadina piena, a pane integrale o a un cereale semplice di accompagnamento.'
                        : 'e una proposta vegetale comoda per brunch, pranzo rapido o cena smart.')}</p>
                <p><strong>Ingredienti per 2 persone:</strong> olio EVO 15g; ceci cotti 250g; succo di limone 30g; spinaci 200g; crema vegetale 140g; pinoli tostati 20g; piadina 240g.</p>
                <p><strong>Procedimento:</strong></p>
                <ul class="ai-plan-note-list">${renderAICardList([
                    'Sbollenta gli spinaci in acqua bollente per circa 7 minuti, fino a 10 minuti se li preferisci piu morbidi.',
                    'Trasferiscili subito in acqua e ghiaccio, poi scolali e strizzali molto bene.',
                    'Frulla spinaci, ceci cotti, succo di limone, un pizzico di sale e 15g di olio EVO fino a ottenere una consistenza liscia e vellutata.',
                    'Scalda la piadina in padella antiaderente per circa 3 minuti per lato, finche diventa ben dorata.',
                    'Taglia la piadina a spicchi, servi l hummus e completa con crema vegetale, pinoli tostati e l eventuale olio EVO rimasto a crudo.'
                ])}</ul>
            `
        });
    } else {
        recipes.unshift({
            title: 'Hummus di spinaci e stracciatella',
            bodyHtml: `
                <p><strong>Perche lo stai vedendo:</strong> ${dietMode === 'vegetarian'
                    ? 'e una proposta molto coerente con un profilo vegetariano, perche unisce ceci, spinaci e una componente lattiero-casearia in una ricetta facile e soddisfacente.'
                    : 'e una proposta morbida e appagante che puo stare bene in una routine onnivora quando vuoi alleggerire la cucina senza rinunciare al gusto.'}</p>
                <p><strong>Quando usarlo nel tuo profilo:</strong> ${goal === 'dimagrire'
                    ? 'puo essere molto utile se tieni la stracciatella in una quota chiara e aumenti il volume con verdure o crudite di accompagnamento.'
                    : (goal === 'massa'
                        ? 'puo diventare piu completo se lo abbini a una base amidacea ben dichiarata e a una porzione leggermente piu generosa di piadina o pane.'
                        : 'si inserisce bene come brunch, cena leggera o pranzo veloce ma curato.')}</p>
                <p><strong>Adattabilita:</strong> se vuoi una variante senza lattosio o piu vegetale, puoi sostituire la stracciatella con una crema vegetale.</p>
                <p><strong>Ingredienti per 2 persone:</strong> olio EVO 15g; ceci cotti 250g; succo di limone 30g; spinaci 200g; stracciatella 150g; pinoli tostati 20g; piadina 240g.</p>
                <p><strong>Procedimento:</strong></p>
                <ul class="ai-plan-note-list">${renderAICardList([
                    'Sbollenta gli spinaci in acqua bollente per circa 7 minuti, fino a 10 minuti se li preferisci piu morbidi.',
                    'Trasferiscili subito in acqua e ghiaccio per mantenere il colore brillante, poi scolali e strizzali molto bene.',
                    'Frulla spinaci, ceci cotti, succo di limone, un pizzico di sale e 15g di olio EVO fino a ottenere una consistenza liscia e vellutata.',
                    'Scalda la piadina in padella antiaderente per circa 3 minuti per lato, finche diventa ben dorata.',
                    'Taglia la piadina a spicchi, servi accanto o spalma l hummus e aggiungi al centro un cucchiaio abbondante di stracciatella.',
                    'Completa con pinoli tostati e l eventuale olio EVO rimasto a crudo.'
                ])}</ul>
            `
        });
    }

    return {
        cards: [
            {
                title: 'Ricette smart costruite sul tuo profilo',
                bodyHtml: `
                    <p>Le ricette smart non sono piu statiche: ora vengono ordinate o adattate in base alle informazioni inserite dall utente, cosi restano coerenti con obiettivo, regime alimentare e stile di vita.</p>
                    <p><strong>Obiettivo:</strong> ${escapeHtml(goalLabel)}<br><strong>Regime alimentare:</strong> ${escapeHtml(dietLabel)}</p>
                `
            },
            ...recipes
        ]
    };
}

function renderSmartRecipeGuidancePanel(profileData) {
    const smartRecipesGrid = document.getElementById('smart-recipes-guidance-grid');

    if (!smartRecipesGrid) {
        return;
    }

    const sourceProfile = profileData || JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {};
    const recipeCards = buildSmartRecipeGuidanceContent(sourceProfile).cards;

    smartRecipesGrid.innerHTML = recipeCards.map((card) => `
        <article class="chef-mode-guide-card">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.bodyHtml || `<p>${escapeHtml(card.text || '')}</p>`}
        </article>
    `).join('');
}

function calculateImc(weight, heightCm) {
    if (!(weight > 0) || !(heightCm > 0)) {
        return 0;
    }

    const heightMeters = heightCm / 100;
    return weight / (heightMeters * heightMeters);
}

function getImcCategory(imc) {
    if (!(imc > 0)) {
        return 'non disponibile';
    }

    if (imc < 18.5) {
        return 'sottopeso';
    }

    if (imc < 25) {
        return 'normopeso';
    }

    if (imc < 30) {
        return 'sovrappeso';
    }

    return 'obesita';
}

function getImcAdjustmentFactor(imc) {
    if (!(imc > 0)) {
        return 1;
    }

    if (imc < 18.5) {
        return 1.06;
    }

    if (imc >= 30) {
        return 0.94;
    }

    if (imc >= 25) {
        return 0.97;
    }

    return 1;
}

function getProteinTargetPerKg(profile, imc) {
    const activityTier = getActivityTier(profile);

    if (profile.goal === 'massa') {
        if (activityTier === 'high') {
            return 2.0;
        }

        if (activityTier === 'medium') {
            return 1.8;
        }

        return 1.6;
    }

    if (profile.goal === 'dimagrire') {
        if (activityTier === 'high') {
            return 1.8;
        }

        if (activityTier === 'medium') {
            return 1.6;
        }

        if (imc >= 30) {
            return 1.3;
        }

        if (imc >= 25) {
            return 1.2;
        }

        return 1.4;
    }

    if (activityTier === 'high') {
        return 1.6;
    }

    if (activityTier === 'medium') {
        return 1.4;
    }

    if (imc < 18.5) {
        return 1.3;
    }

    if (imc >= 25) {
        return 1.2;
    }

    return 1.2;
}

function getActivityTier(profile) {
    const workouts = Number(profile.workoutsPerWeek || 0);

    if (workouts >= 5 || profile.jobType === 'attivo') {
        return 'high';
    }

    if (workouts >= 3 || profile.jobType === 'moderato') {
        return 'medium';
    }

    return 'low';
}

function getGoalCalorieAdjustment(profile, maintenanceCalories, imc) {
    const activityTier = getActivityTier(profile);

    if (profile.goal === 'massa') {
        let surplus = 250;

        if (activityTier === 'high') {
            surplus = 350;
        } else if (activityTier === 'medium') {
            surplus = 300;
        }

        if (imc >= 25) {
            surplus = Math.max(150, surplus - 100);
        }

        return surplus;
    }

    if (profile.goal === 'dimagrire') {
        let deficit = maintenanceCalories >= 2800 ? 500 : (maintenanceCalories >= 2200 ? 400 : 300);

        if (activityTier === 'high') {
            deficit -= 100;
        } else if (activityTier === 'low') {
            deficit += 50;
        }

        if (imc >= 30) {
            deficit += 100;
        } else if (imc >= 25) {
            deficit += 50;
        }

        return -Math.min(700, Math.max(200, deficit));
    }

    return 0;
}

function getFatTargetRatio(profile) {
    if (profile.goal === 'massa') {
        return 0.28;
    }

    if (profile.goal === 'dimagrire') {
        return 0.3;
    }

    return 0.3;
}

function calculateEnergyProfile(profile) {
    const weight = Number(profile.weight || 0);
    const height = Number(profile.height || 0);
    const age = Number(profile.age || 0);
    const workouts = Number(profile.workoutsPerWeek || 0);
    const imc = calculateImc(weight, height);

    const baseActivityFactor = {
        sedentario: 1.2,
        moderato: 1.55,
        attivo: 1.725
    }[profile.jobType] || 1.2;

    let activityFactor = baseActivityFactor;
    if (workouts >= 5) {
        activityFactor = Math.min(1.9, baseActivityFactor + 0.05);
    } else if (workouts >= 3) {
        activityFactor = Math.min(1.7, baseActivityFactor + 0.03);
    }

    const imcAdjustmentFactor = getImcAdjustmentFactor(imc);
    const proteinTargetPerKg = getProteinTargetPerKg(profile, imc);
    const fatTargetRatio = getFatTargetRatio(profile);
    const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + (profile.sex === 'uomo' ? 5 : -161));
    const maintenanceCalories = Math.max(1200, Math.round(bmr * activityFactor * imcAdjustmentFactor));
    const goalCalorieDelta = getGoalCalorieAdjustment(profile, maintenanceCalories, imc);
    const goalMultiplier = maintenanceCalories > 0
        ? Number(((maintenanceCalories + goalCalorieDelta) / maintenanceCalories).toFixed(3))
        : 1;
    const planCalories = Math.max(1200, maintenanceCalories + goalCalorieDelta);
    const proteinTarget = Math.round(weight * proteinTargetPerKg);
    const fatTarget = Math.round((planCalories * fatTargetRatio) / 9);
    const remainingCalories = Math.max(0, planCalories - (proteinTarget * 4) - (fatTarget * 9));
    const carbsTarget = Math.round(remainingCalories / 4);

    return {
        imc: Number(imc.toFixed(1)),
        imcCategory: getImcCategory(imc),
        imcAdjustmentFactor,
        maintenanceCalories,
        planCalories,
        goalCalorieDelta,
        bmr,
        activityFactor,
        goalMultiplier,
        proteinTargetPerKg: Number(proteinTargetPerKg.toFixed(1)),
        fatTargetRatio: Number(fatTargetRatio.toFixed(2)),
        target: planCalories,
        carbsTarget,
        proteinTarget,
        fatTarget
    };
}

function buildWizardProfileDraft() {
    const weight = parseFloat(document.getElementById('wizard-weight').value);
    const height = parseFloat(document.getElementById('wizard-height').value);
    const age = parseInt(document.getElementById('wizard-age').value, 10);

    const profile = {
        username: document.getElementById('username').value,
        sex: document.getElementById('user-sex').value,
        age: age,
        weight: weight,
        height: height,
        jobType: document.getElementById('wizard-job').value,
        workoutsPerWeek: parseInt(document.getElementById('wizard-workouts').value, 10),
        sportPreference: document.getElementById('wizard-sport-toggle')?.value || 'non specificato',
        sportName: document.getElementById('wizard-sport-name')?.value.trim() || 'non specificato',
        goal: document.getElementById('wizard-goal').value,
        diet: document.getElementById('wizard-diet').value || 'regime alimentare non specificato',
        allergies: document.getElementById('wizard-allergies').value || 'non allergico a sostanze o alimenti',
        intolerances: document.getElementById('wizard-intolerances').value || 'non intollerante ad alimenti',
        otherPathologies: document.getElementById('wizard-other-pathologies').value.trim(),
        mealsPerDay: parseInt(document.getElementById('wizard-meals').value, 10) || 0,
        weakPoint: document.getElementById('wizard-weakpoint').value || 'non specificato',
        smoke: document.getElementById('wizard-smoke').value || 'non specificato',
        motivation: document.getElementById('wizard-motivation').value || 'non specificato',
        waterIntake: parseFloat(document.getElementById('wizard-water').value),
        lunchContextPreference: 'workday',
        dinnerProteinPreference: 'variata',
        dinnerProteinFrequency: 'libera'
    };

    profile.acquaObiettivo = parseFloat((weight * 0.035).toFixed(1));
    const energyProfile = calculateEnergyProfile(profile);

    return {
        ...profile,
        ...energyProfile,
        acquaTarget: profile.acquaObiettivo * 1000,
        micronutrients: {
            fe: 14,
            ca: 1000,
            mg: 350,
            b12: 2.4,
            fol: 400
        }
    };
}

// --- Step 8: Riepilogo ---
function mostraRiepilogo() {
        // Abilita il pulsante Indietro nello step 6
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.disabled = wizardCurrentStep === 1;
            prevBtn.onclick = function() {
                prevStep();
            };
        }
    const draftProfile = buildWizardProfileDraft();
    const username = draftProfile.username;
    const avatarUrl = selectedAvatarPath || 'avatars/1.jpg';
    const avatarMood = getAvatarMoodLabel(avatarUrl);
    const dietNarrative = getDietNarrative(draftProfile.diet);
    const allergyNarrative = getAllergyNarrative(draftProfile.allergies, draftProfile.intolerances);
    const pathologyNarrative = getOtherPathologiesNarrative(draftProfile.otherPathologies);
    const trainingNarrative = draftProfile.workoutsPerWeek > 0
        ? `Nell'ultimo periodo segui uno stile di vita ${getWizardJobLabel(draftProfile.jobType).toLowerCase()}, ${getWizardJobDescription(draftProfile.jobType)}. Ti alleni ${draftProfile.workoutsPerWeek} volte a settimana${draftProfile.sportName !== 'non specificato' ? ` e hai indicato come attivita principale ${formatSportLabel(draftProfile.sportName)}` : ''}.`
        : `Nell'ultimo periodo segui uno stile di vita ${getWizardJobLabel(draftProfile.jobType).toLowerCase()}, ${getWizardJobDescription(draftProfile.jobType)}, e al momento non hai indicato allenamenti settimanali.`;
    const mealsNarrative = draftProfile.mealsPerDay > 0
        ? `Hai indicato ${draftProfile.mealsPerDay} pasti giornalieri. Il tuo fabbisogno calorico giornaliero stimato e di ${draftProfile.maintenanceCalories} kcal, mentre il piano iniziale e impostato su circa ${draftProfile.target} kcal al giorno.`
        : `Non hai ancora indicato quanti pasti fai al giorno, ma il tuo fabbisogno calorico giornaliero stimato e di ${draftProfile.maintenanceCalories} kcal e il piano iniziale e impostato su circa ${draftProfile.target} kcal al giorno.`;
    const smokeNarrative = getSmokeNarrative(draftProfile.smoke);
    const motivationNarrative = getMotivationNarrative(draftProfile.motivation);
    const imcNarrative = draftProfile.imc > 0
        ? `Il tuo IMC stimato e <strong>${escapeHtml(draftProfile.imc)}</strong>, in fascia <strong>${escapeHtml(draftProfile.imcCategory)}</strong>. Questo valore viene considerato nel calcolo del tuo fabbisogno energetico.`
        : 'Il tuo IMC non e disponibile, quindi non viene applicata alcuna correzione al fabbisogno energetico.';
    const proteinNarrative = draftProfile.proteinTargetPerKg > 0
        ? `L apporto proteico di riferimento e <strong>${escapeHtml(draftProfile.proteinTargetPerKg)} g/kg</strong>, pari a circa <strong>${escapeHtml(draftProfile.proteinTarget)} g</strong> di proteine al giorno.`
        : 'Non e stato possibile stimare un apporto proteico personalizzato.';
    const lifestyleGuidance = getLifestyleGuidanceNarrative(draftProfile);
    const frase = `Ciao <b>${escapeHtml(username)}</b>, sono felice che oggi ti senti ${escapeHtml(avatarMood)}.`;

    const dati = `
        <div class="wizard-summary-copy">
            <p>Nei tuoi dati hai raccontato di avere <strong>${escapeHtml(draftProfile.age)}</strong> anni, di essere alto <strong>${escapeHtml(draftProfile.height)} cm</strong> e di avere attualmente un peso di <strong>${escapeHtml(draftProfile.weight)} kg</strong>.</p>
            <p>Segui ${escapeHtml(dietNarrative)}. ${escapeHtml(allergyNarrative)}. ${escapeHtml(pathologyNarrative)}. Al momento hai indicato di bere <strong>${escapeHtml(draftProfile.waterIntake)} L</strong> di acqua al giorno, mentre per il tuo profilo il target consigliato e di circa <strong>${escapeHtml(draftProfile.acquaObiettivo)} L</strong> al giorno.</p>
            <p>${escapeHtml(trainingNarrative)} Il tuo obiettivo attuale e <strong>${escapeHtml(getWizardGoalLabel(draftProfile.goal).toLowerCase())}</strong>.</p>
            <p>${imcNarrative}</p>
            <p>${proteinNarrative}</p>
            <p>${escapeHtml(mealsNarrative)} ${escapeHtml(smokeNarrative)} ${escapeHtml(motivationNarrative)}</p>
            <p>${lifestyleGuidance.hydration}</p>
            <p>${lifestyleGuidance.meals}</p>
            <p>${lifestyleGuidance.supplements}</p>
        </div>`;

    // Mostra step 6 senza nascondere la barra dei tasti
    document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
    const step6 = document.querySelector('.wizard-step[data-step="6"]');
    if (step6) {
        // Mostra solo se siamo effettivamente nello step 6
        if (wizardCurrentStep === 6) {
            step6.style.display = 'block';
            document.getElementById('riepilogo-frase').innerHTML = frase;
            document.getElementById('riepilogo-dati').innerHTML = dati;
            // Gestione avatar: se avatarUrl è vuoto, mostra avatar di default
            const avatarElem = document.getElementById('riepilogo-avatar');
            if (avatarUrl && avatarUrl.trim() !== '') {
                avatarElem.dataset.avatarPath = normalizeAvatarPath(avatarUrl);
                avatarElem.src = resolveAvatarUrl(avatarUrl);
                bindAvatarFallback(avatarElem, avatarUrl);
                avatarElem.style.display = 'block';
            } else {
                avatarElem.dataset.avatarPath = 'avatars/1.jpg';
                avatarElem.src = resolveAvatarUrl('avatars/1.jpg'); // avatar di default
                bindAvatarFallback(avatarElem, 'avatars/1.jpg');
                avatarElem.style.display = 'block';
            }
        } else {
            step6.style.display = 'none';
        }
        // Aggiungi handler per "Modifica risposte"
        const editBtn = document.getElementById('edit-answers-btn');
        if (editBtn) {
            editBtn.onclick = function() {
                wizardCurrentStep = 1;
                // Svuota il riepilogo (frase, dati, avatar)
                document.getElementById('riepilogo-frase').innerHTML = '';
                document.getElementById('riepilogo-dati').innerHTML = '';
                const avatarElem = document.getElementById('riepilogo-avatar');
                avatarElem.src = '';
                avatarElem.style.display = 'none';
                // Nascondi il contenitore riepilogo
                if (step6) step6.style.display = 'none';
                // Mostra lo step corrente (step 1)
                showWizardStep(wizardCurrentStep);
            };
        }
    }
    // Assicura che la barra dei tasti sia visibile
    const wizardControls = document.querySelector('.wizard-controls');
    if (wizardControls) wizardControls.style.display = 'flex';
}

// Esegui mostraRiepilogo() dopo la selezione avatar e la pressione di 'Completa'
// Esempio: aggiungi mostraRiepilogo() alla funzione finalizzaProfilo()
// Avatar generator logic for wizard step 7

// --- Avatar Selection Logic ---
let selectedAvatarPath = "";
const avatarAssetVersion = '20260315-3';

const defaultEmbeddedAvatarAssets = {
    'avatars/1.jpg': createInlineAvatarFallback('1', '#4f8cff'),
    'avatars/2.jpg': createInlineAvatarFallback('2', '#2fbf71'),
    'avatars/3.jpg': createInlineAvatarFallback('3', '#ff8a3d'),
    'avatars/4.jpg': createInlineAvatarFallback('4', '#9b6bff'),
    'avatars/5.jpg': createInlineAvatarFallback('5', '#ff5d73'),
    'avatars/6.jpg': createInlineAvatarFallback('6', '#00a7b7'),
    'avatars/7.jpg': createInlineAvatarFallback('7', '#6d7c8f'),
    'avatars/8.jpg': createInlineAvatarFallback('8', '#f0b429')
};

const embeddedAvatarAssets = window.AVATAR_DATA_URIS || {};

const avatarFallbacks = {
    ...defaultEmbeddedAvatarAssets
};

function createInlineAvatarFallback(label, color) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
            <rect width="120" height="120" rx="26" fill="${color}" />
            <circle cx="60" cy="44" r="22" fill="rgba(255,255,255,0.92)" />
            <path d="M28 101c5-18 18-28 32-28s27 10 32 28" fill="rgba(255,255,255,0.92)" />
            <text x="60" y="112" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="16" font-weight="700" fill="rgba(255,255,255,0.96)">Avatar ${label}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeAvatarPath(path) {
    if (!path) return 'avatars/1.jpg';

    const rawPath = String(path);

    if (rawPath.startsWith('data:image/')) {
        return 'avatars/1.jpg';
    }

    const normalized = rawPath.replace(/\\/g, '/').split('?')[0].split('#')[0];
    const avatarsIndex = normalized.toLowerCase().lastIndexOf('avatars/');

    if (avatarsIndex !== -1) {
        return normalized.slice(avatarsIndex);
    }

    return normalized;
}

function resolveAvatarUrl(path) {
    const normalizedPath = normalizeAvatarPath(path);
    return `${normalizedPath}?v=${avatarAssetVersion}`;
}

function getAvatarChoicePath(element) {
    if (!element) return 'avatars/1.jpg';
    return normalizeAvatarPath(element.dataset.avatarPath || element.getAttribute('src'));
}

function getAvatarFallback(path) {
    const normalizedPath = normalizeAvatarPath(path);
    return embeddedAvatarAssets[normalizedPath] || avatarFallbacks[normalizedPath] || avatarFallbacks['avatars/1.jpg'];
}

function bindAvatarFallback(img, preferredPath) {
    if (!img) return;

    const avatarPath = normalizeAvatarPath(preferredPath || img.dataset.avatarPath || img.getAttribute('src'));
    img.dataset.avatarPath = avatarPath;
    img.onerror = () => {
        img.onerror = null;
        img.src = getAvatarFallback(avatarPath);
    };

    if (img.complete && img.naturalWidth === 0) {
        img.src = getAvatarFallback(avatarPath);
        return;
    }

    img.src = resolveAvatarUrl(avatarPath);
}

function syncHomeBadgeAvatar(src) {
    const homeBadgeAvatar = document.querySelector('.profile-badge img');
    if (!homeBadgeAvatar) return;

    const normalizedSrc = normalizeAvatarPath(src);
    homeBadgeAvatar.dataset.avatarPath = normalizedSrc;
    homeBadgeAvatar.src = resolveAvatarUrl(normalizedSrc);
    bindAvatarFallback(homeBadgeAvatar, normalizedSrc);
}

function setupAvatarFallbacks() {
    document.querySelectorAll('img[src^="avatars/"]').forEach((img) => {
        bindAvatarFallback(img);
    });

    const homeBadgeAvatar = document.querySelector('.profile-badge img');
    if (homeBadgeAvatar) {
        syncHomeBadgeAvatar(selectedAvatarPath || 'avatars/1.jpg');
    }
}

function aggiornaAvatarProfilo(src) {
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const navAvatar = document.getElementById('user-nav-photo');
    const normalizedSrc = normalizeAvatarPath(src);
    if (avatarPreview && normalizedSrc) {
        avatarPreview.dataset.avatarPath = normalizedSrc;
        avatarPreview.src = resolveAvatarUrl(normalizedSrc);
        bindAvatarFallback(avatarPreview, normalizedSrc);
    }
    if (navAvatar && normalizedSrc) {
        navAvatar.dataset.avatarPath = normalizedSrc;
        navAvatar.src = resolveAvatarUrl(normalizedSrc);
        bindAvatarFallback(navAvatar, normalizedSrc);
    }

    syncHomeBadgeAvatar(normalizedSrc);
}

function selectAvatar(element) {
    // Rimuove selezione da altri
    document.querySelectorAll('.avatar-selection-grid img').forEach(img => img.classList.remove('selected'));
    // Aggiunge selezione a questo
    element.classList.add('selected');
    selectedAvatarPath = getAvatarChoicePath(element);
    aggiornaAvatarProfilo(selectedAvatarPath);
    // Salva nel profilo locale
    const profilo = JSON.parse(localStorage.getItem('nv_profilo')) || {};
    profilo.avatarUrl = selectedAvatarPath;
    localStorage.setItem('nv_profilo', JSON.stringify(profilo));
}

// Chiama questa funzione quando carichi l'app per impostare la foto salvata
function loadSavedAvatar() {
    const profilo = JSON.parse(localStorage.getItem('nv_profilo'));
    if (profilo && profilo.avatarUrl) {
        selectedAvatarPath = normalizeAvatarPath(profilo.avatarUrl);
        profilo.avatarUrl = selectedAvatarPath;
        localStorage.setItem('nv_profilo', JSON.stringify(profilo));
        aggiornaAvatarProfilo(selectedAvatarPath);

    } else {
        aggiornaAvatarProfilo('avatars/1.jpg');
    }
}

// Enforce avatar creation before dashboard access
function isAvatarComplete() {
    // Controlla se è stato selezionato un avatar dalla griglia
    return !!selectedAvatarPath;
}

// Override nextStep to enforce avatar completion on step 7
// Patch nextStep only if it exists, otherwise fallback to function override
if (typeof window.nextStep === 'function') {
    const originalNextStep = window.nextStep;
    window.nextStep = function() {
        const currentStep = typeof getCurrentStep === 'function' ? getCurrentStep() : wizardCurrentStep;
        if (currentStep === 7) {
            if (!isAvatarComplete()) {
                alert('VAI! Seleziona il tuo avatar per accedere alla dashboard!');
                return;
            }
        }
        originalNextStep();
    };
} else {
    // Fallback: override global nextStep directly
    window.nextStep = function() {
        const currentStep = typeof getCurrentStep === 'function' ? getCurrentStep() : wizardCurrentStep;
        if (currentStep === 7) {
            if (!isAvatarComplete()) {
                alert('Completa il tuo avatar per accedere alla dashboard!');
                return;
            }
        }
        if (typeof nextStep === 'function') {
            nextStep();
        }
    };
}
const datiAlimenti = `
1) Bresaola di Tacchino: 110 kcal, 1,5 g grassi, 0,5 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 23,0 g proteine, 3,50 g sale.
2) Culatello (di Zibello): 225 kcal, 12,5 g grassi, 4,2 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,00 g sale.
4) Prosciutto Cotto Alta QualitÃ : 130 kcal, 5,0 g grassi, 1,8 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,00 g sale.
5) Prosciutto Cotto Scelto: 145 kcal, 7,5 g grassi, 2,5 g grassi saturi, 1,5 g carboidrati, 1,2 g zuccheri, 0 g fibre, 18,0 g proteine, 2,20 g sale.
6) Prosciutto Cotto di Praga (affumicato): 155 kcal, 8,5 g grassi, 3,0 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 19,0 g proteine, 2,30 g sale.
7) Fesa di Tacchino Arrosto: 105 kcal, 1,5 g grassi, 0,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 21,5 g proteine, 2,10 g sale.
9) Carpaccio di Manzo (confezionato/salume): 120 kcal, 3,0 g grassi, 1,2 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,5 g proteine, 2,50 g sale.
10) Salame Milano: 385 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,0 g proteine, 3,80 g sale.
11) Salame Ungherese: 405 kcal, 35,0 g grassi, 12,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 21,5 g proteine, 4,00 g sale.
12) Salame Felino IGP: 365 kcal, 29,0 g grassi, 10,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 25,5 g proteine, 3,50 g sale.
13) Salame Piccante (tipo Napoli/Calabrese): 410 kcal, 36,0 g grassi, 13,0 g grassi saturi, 1,8 g carboidrati, 1,0 g zuccheri, 0 g fibre, 20,0 g proteine, 4,20 g sale.
14) Salame di Mugnano: 390 kcal, 33,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,0 g proteine, 3,90 g sale.
15) Cacciatorino (Salamini Italiani alla Cacciatora DOP): 415 kcal, 35,5 g grassi, 13,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,0 g proteine, 4,10 g sale.
16) Chorizo (salame spagnolo alla paprica): 450 kcal, 38,0 g grassi, 14,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 24,0 g proteine, 3,50 g sale.
18) Mortadella Bologna IGP: 288 kcal, 25,0 g grassi, 9,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 15,5 g proteine, 2,20 g sale.
19) Mortadella di Pollo/Tacchino: 175 kcal, 11,0 g grassi, 3,8 g grassi saturi, 3,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,0 g proteine, 2,40 g sale.
20) Pancetta Arrotolata: 455 kcal, 45,0 g grassi, 16,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,5 g proteine, 3,50 g sale.
21) Pancetta Affumicata (Bacon): 470 kcal, 47,0 g grassi, 17,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 11,5 g proteine, 4,00 g sale.
22) Guanciale (stagionato): 655 kcal, 70,0 g grassi, 25,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 6,5 g proteine, 3,00 g sale.
23) Lardo di Colonnata IGP: 890 kcal, 98,0 g grassi, 35,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 1,5 g proteine, 2,50 g sale.
24) Coppa (Capocollo): 395 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,0 g proteine, 4,50 g sale.
25) Zampone di Modena IGP (cotto): 320 kcal, 26,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,10 g sale.
26) Cotechino di Modena IGP (cotto): 310 kcal, 25,0 g grassi, 9,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,00 g sale.
27) Gocciole Chocolate (Pavesi): 486 kcal, 22,0 g grassi, 6,2 g grassi saturi, 62,2 g carboidrati, 24,0 g zuccheri, 4,4 g fibre, 7,5 g proteine, 0,53 g sale.
28) Pan di Stelle (Mulino Bianco): 483 kcal, 20,5 g grassi, 7,8 g grassi saturi, 65,0 g carboidrati, 23,5 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,48 g sale.
29) Macine (Mulino Bianco): 482 kcal, 20,0 g grassi, 3,3 g grassi saturi, 68,0 g carboidrati, 19,0 g zuccheri, 2,8 g fibre, 6,0 g proteine, 0,83 g sale.
30) Oro Saiwa (Saiwa): 417 kcal, 8,3 g grassi, 0,8 g grassi saturi, 76,0 g carboidrati, 20,0 g zuccheri, 3,4 g fibre, 8,3 g proteine, 0,62 g sale.
31) GranTurchese (Colussi): 454 kcal, 14,0 g grassi, 1,6 g grassi saturi, 72,0 g carboidrati, 26,0 g zuccheri, 2,4 g fibre, 8,7 g proteine, 0,63 g sale.
32) Galletti (Mulino Bianco): 474 kcal, 18,2 g grassi, 1,9 g grassi saturi, 68,5 g carboidrati, 19,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,73 g sale.
33) Tarallucci (Mulino Bianco): 471 kcal, 18,5 g grassi, 2,0 g grassi saturi, 67,5 g carboidrati, 20,5 g zuccheri, 3,0 g fibre, 7,0 g proteine, 0,68 g sale.
34) Bucaneve (Doria): 465 kcal, 16,5 g grassi, 8,3 g grassi saturi, 70,7 g carboidrati, 23,5 g zuccheri, 2,5 g fibre, 7,1 g proteine, 0,65 g sale.
35) Abbracci (Mulino Bianco): 485 kcal, 21,5 g grassi, 10,2 g grassi saturi, 63,5 g carboidrati, 24,0 g zuccheri, 3,3 g fibre, 7,2 g proteine, 0,63 g sale.
36) Campagnole (Mulino Bianco): 468 kcal, 17,5 g grassi, 3,0 g grassi saturi, 68,5 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,3 g proteine, 0,78 g sale.
37) Ringo Vaniglia (Pavesi): 486 kcal, 21,0 g grassi, 9,5 g grassi saturi, 67,0 g carboidrati, 31,0 g zuccheri, 2,5 g fibre, 6,0 g proteine, 0,45 g sale.
38) Baiocchi (Mulino Bianco): 511 kcal, 26,0 g grassi, 10,5 g grassi saturi, 59,5 g carboidrati, 25,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,45 g sale.
39) Krumiri (Bistefani): 475 kcal, 19,0 g grassi, 10,0 g grassi saturi, 68,0 g carboidrati, 24,0 g zuccheri, 2,0 g fibre, 7,0 g proteine, 0,55 g sale.
40) Batticuori (Mulino Bianco): 472 kcal, 19,0 g grassi, 8,8 g grassi saturi, 65,7 g carboidrati, 23,5 g zuccheri, 4,5 g fibre, 7,3 g proteine, 0,50 g sale.
42) Rigoli (Mulino Bianco): 463 kcal, 16,0 g grassi, 1,5 g grassi saturi, 70,5 g carboidrati, 21,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,70 g sale.
43) Nascondini (Mulino Bianco): 480 kcal, 21,0 g grassi, 10,0 g grassi saturi, 63,4 g carboidrati, 24,0 g zuccheri, 3,3 g fibre, 7,6 g proteine, 0,48 g sale.
44) Molinetto (Mulino Bianco): 482 kcal, 20,5 g grassi, 5,5 g grassi saturi, 65,0 g carboidrati, 22,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,75 g sale.
45) Spicchi di Sole (Mulino Bianco): 472 kcal, 18,5 g grassi, 1,9 g grassi saturi, 68,0 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,0 g proteine, 0,73 g sale.
46) Pannocchie (Mulino Bianco): 471 kcal, 18,5 g grassi, 1,9 g grassi saturi, 67,5 g carboidrati, 20,5 g zuccheri, 4,0 g fibre, 6,5 g proteine, 0,78 g sale.
47) Buongrano (Mulino Bianco): 464 kcal, 18,5 g grassi, 1,9 g grassi saturi, 63,5 g carboidrati, 21,0 g zuccheri, 6,5 g fibre, 7,5 g proteine, 0,70 g sale.
48) Cuor di Mela (Mulino Bianco): 427 kcal, 15,0 g grassi, 7,3 g grassi saturi, 66,2 g carboidrati, 31,5 g zuccheri, 2,8 g fibre, 5,5 g proteine, 0,33 g sale.
49) Primizie (Mulino Bianco): 470 kcal, 18,5 g grassi, 1,9 g grassi saturi, 67,2 g carboidrati, 19,5 g zuccheri, 4,0 g fibre, 6,8 g proteine, 0,75 g sale.
50) Ritornelli (Mulino Bianco): 479 kcal, 20,0 g grassi, 5,3 g grassi saturi, 66,0 g carboidrati, 25,0 g zuccheri, 3,3 g fibre, 7,0 g proteine, 0,53 g sale.
idrati, 25,0 g zuccheri, 3,3 g fibre, 7,0 g proteine, 0,53 g sale.
51) Scacchieri (Mulino Bianco): 485 kcal, 22,0 g grassi, 9,8 g grassi saturi, 62,5 g carboidrati, 23,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,45 g sale.
52) Osvego (Gentilini): 450 kcal, 13,8 g grassi, 8,5 g grassi saturi, 71,5 g carboidrati, 22,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,65 g sale.
53) Novellini (Gentilini): 465 kcal, 16,5 g grassi, 11,0 g grassi saturi, 70,0 g carboidrati, 25,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,55 g sale.
54) Marie (Saiwa): 435 kcal, 11,0 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 21,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,85 g sale.
55) Nocciolini (Lazzaroni): 460 kcal, 17,0 g grassi, 2,0 g grassi saturi, 69,0 g carboidrati, 30,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,60 g sale.
56) Oswego (Colussi): 440 kcal, 12,0 g grassi, 1,3 g grassi saturi, 73,0 g carboidrati, 21,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,70 g sale.
57) Zuppalatte (Colussi): 436 kcal, 10,0 g grassi, 1,1 g grassi saturi, 77,0 g carboidrati, 22,0 g zuccheri, 2,5 g fibre, 8,0 g proteine, 0,85 g sale.
58) Frollini con Gocce Cioccolato (Esselunga): 480 kcal, 21,0 g grassi, 10,5 g grassi saturi, 64,0 g carboidrati, 24,0 g zuccheri, 3,5 g fibre, 6,8 g proteine, 0,55 g sale.
59) Biscotti della Salute (Monviso): 405 kcal, 6,5 g grassi, 0,8 g grassi saturi, 74,0 g carboidrati, 15,0 g zuccheri, 6,0 g fibre, 10,0 g proteine, 0,40 g sale.
61) Grancereale Classico (Mulino Bianco): 466 kcal, 19,0 g grassi, 2,0 g grassi saturi, 61,5 g carboidrati, 17,5 g zuccheri, 10,0 g fibre, 8,0 g proteine, 0,75 g sale.
62) Grancereale Croccante (Mulino Bianco): 474 kcal, 20,5 g grassi, 2,2 g grassi saturi, 61,0 g carboidrati, 19,0 g zuccheri, 9,0 g fibre, 7,0 g proteine, 0,65 g sale.
63) Grancereale Cioccolato (Mulino Bianco): 477 kcal, 21,0 g grassi, 4,5 g grassi saturi, 60,0 g carboidrati, 21,0 g zuccheri, 9,5 g fibre, 7,5 g proteine, 0,70 g sale.
64) Grancereale Frutta (Mulino Bianco): 457 kcal, 17,5 g grassi, 1,8 g grassi saturi, 64,0 g carboidrati, 23,0 g zuccheri, 8,5 g fibre, 6,5 g proteine, 0,65 g sale.
65) Privolat Gocce Cioccolato (Misura): 458 kcal, 17,0 g grassi, 4,6 g grassi saturi, 67,0 g carboidrati, 22,0 g zuccheri, 4,5 g fibre, 7,0 g proteine, 0,55 g sale.
66) Fibrextra Integrale (Misura): 434 kcal, 15,0 g grassi, 1,5 g grassi saturi, 60,0 g carboidrati, 18,0 g zuccheri, 14,0 g fibre, 8,0 g proteine, 0,75 g sale.
67) Dolcesenza Senza Zuccheri (Misura): 433 kcal, 15,0 g grassi, 1,6 g grassi saturi, 70,0 g carboidrati, 1,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,80 g sale.
68) Multigrain (Kellogg's): 446 kcal, 15,0 g grassi, 1,8 g grassi saturi, 66,0 g carboidrati, 19,0 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,55 g sale.
69) Pavesini Classici (Pavesi): 392 kcal, 3,5 g grassi, 1,1 g grassi saturi, 81,3 g carboidrati, 48,0 g zuccheri, 2,3 g fibre, 7,8 g proteine, 0,50 g sale.
70) Magretti (Galbusera): 416 kcal, 9,5 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 21,5 g zuccheri, 4,0 g fibre, 8,5 g proteine, 0,75 g sale.
71) Turchese PiÃ¹ Integrale (Colussi): 445 kcal, 14,5 g grassi, 1,5 g grassi saturi, 65,0 g carboidrati, 20,0 g zuccheri, 9,0 g fibre, 9,0 g proteine, 0,60 g sale.
73) Oreo Original (Nabisco): 474 kcal, 19,0 g grassi, 5,2 g grassi saturi, 68,0 g carboidrati, 38,0 g zuccheri, 2,7 g fibre, 5,4 g proteine, 0,74 g sale.
74) Oreo Golden (Nabisco): 482 kcal, 20,0 g grassi, 5,5 g grassi saturi, 69,0 g carboidrati, 36,0 g zuccheri, 1,2 g fibre, 4,8 g proteine, 0,55 g sale.
75) Loacker Wafer Napolitaner: 511 kcal, 25,0 g grassi, 21,0 g grassi saturi, 61,0 g carboidrati, 30,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,35 g sale.
76) Nutella Biscuits (Ferrero): 513 kcal, 24,5 g grassi, 11,8 g grassi saturi, 63,3 g carboidrati, 34,7 g zuccheri, 3,4 g fibre, 6,3 g proteine, 0,53 g sale.
77) Kinder Cards (Ferrero): 510 kcal, 25,8 g grassi, 15,2 g grassi saturi, 55,5 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 12,8 g proteine, 0,42 g sale.
78) Mikado Latte (Mondelez): 481 kcal, 19,0 g grassi, 11,0 g grassi saturi, 68,0 g carboidrati, 35,0 g zuccheri, 3,1 g fibre, 7,3 g proteine, 0,70 g sale.
79) Lotus Biscoff (Lotus): 484 kcal, 19,0 g grassi, 8,0 g grassi saturi, 72,6 g carboidrati, 38,1 g zuccheri, 1,3 g fibre, 4,9 g proteine, 0,92 g sale.
80) GrisbÃ¬ Cioccolato (Vicenzi): 534 kcal, 31,0 g grassi, 13,0 g grassi saturi, 56,0 g carboidrati, 30,0 g zuccheri, 3,5 g fibre, 6,0 g proteine, 0,45 g sale.
81) GrisbÃ¬ Nocciola (Vicenzi): 540 kcal, 32,0 g grassi, 14,0 g grassi saturi, 55,0 g carboidrati, 28,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,40 g sale.
82) Krumiri con Gocce (Bistefani): 485 kcal, 21,0 g grassi, 11,5 g grassi saturi, 66,0 g carboidrati, 26,0 g zuccheri, 2,5 g fibre, 6,8 g proteine, 0,50 g sale.
83) Togo Latte (Pavesi): 508 kcal, 24,5 g grassi, 14,5 g grassi saturi, 64,5 g carboidrati, 35,5 g zuccheri, 2,5 g fibre, 6,0 g proteine, 0,45 g sale.
84) Wafer Classic Cacao (Loacker): 513 kcal, 25,0 g grassi, 21,0 g grassi saturi, 60,0 g carboidrati, 26,0 g zuccheri, 4,5 g fibre, 8,5 g proteine, 0,38 g sale.
85) Biscotti Digestive (McVitie's): 483 kcal, 21,3 g grassi, 10,1 g grassi saturi, 62,8 g carboidrati, 15,1 g zuccheri, 3,8 g fibre, 6,9 g proteine, 1,3 g sale.
86) Digestive ai Frutti Rossi (McVitie's): 472 kcal, 19,5 g grassi, 9,2 g grassi saturi, 65,0 g carboidrati, 20,5 g zuccheri, 4,5 g fibre, 6,5 g proteine, 1,1 g sale.
87) Digestive al Cioccolato al Latte (McVitie's): 493 kcal, 23,6 g grassi, 12,3 g grassi saturi, 61,7 g carboidrati, 28,5 g zuccheri, 3,0 g fibre, 6,7 g proteine, 0,94 g sale.
89) Plasmon (Biscotto dei bambini): 412 kcal, 8,0 g grassi, 3,5 g grassi saturi, 75,0 g carboidrati, 23,0 g zuccheri, 2,5 g fibre, 8,8 g proteine, 0,50 g sale.
90) Mellin (Biscotto primi mesi): 410 kcal, 8,2 g grassi, 3,7 g grassi saturi, 74,5 g carboidrati, 22,5 g zuccheri, 2,0 g fibre, 9,0 g proteine, 0,45 g sale.
91) Humana (Biscotto biologico): 415 kcal, 8,5 g grassi, 4,0 g grassi saturi, 73,0 g carboidrati, 21,0 g zuccheri, 2,2 g fibre, 9,5 g proteine, 0,40 g sale.
92) Biscotto Coop (linea Crescendo): 408 kcal, 7,5 g grassi, 3,2 g grassi saturi, 76,0 g carboidrati, 24,0 g zuccheri, 2,0 g fibre, 8,5 g proteine, 0,55 g sale.
93) Ami di Pane (Pavesi): 425 kcal, 9,0 g grassi, 1,2 g grassi saturi, 78,0 g carboidrati, 22,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,80 g sale.
94) Pavesini al Cacao (Pavesi): 388 kcal, 3,8 g grassi, 1,3 g grassi saturi, 79,0 g carboidrati, 45,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,48 g sale.
95) Magretti Gocce Cioccolato (Galbusera): 428 kcal, 11,0 g grassi, 2,5 g grassi saturi, 70,0 g carboidrati, 23,0 g zuccheri, 5,0 g fibre, 9,0 g proteine, 0,70 g sale.
97) Cantuccini alla Mandorla (Sapori): 450 kcal, 15,0 g grassi, 3,0 g grassi saturi, 68,0 g carboidrati, 35,0 g zuccheri, 4,5 g fibre, 9,0 g proteine, 0,15 g sale.
98) Amaretti di Saronno (Lazzaroni): 433 kcal, 10,5 g grassi, 1,0 g grassi saturi, 77,0 g carboidrati, 75,0 g zuccheri, 3,0 g fibre, 6,5 g proteine, 0,10 g sale.
99) Savoiardi (Vicenzi): 378 kcal, 3,8 g grassi, 1,1 g grassi saturi, 76,5 g carboidrati, 42,0 g zuccheri, 2,0 g fibre, 8,5 g proteine, 0,22 g sale.
100) Lingue di Gatto (Vicenzi): 460 kcal, 15,0 g grassi, 9,0 g grassi saturi, 72,0 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 8,5 g proteine, 0,35 g sale.
101) Ricciarelli di Siena (Sapori): 445 kcal, 22,0 g grassi, 2,0 g grassi saturi, 50,0 g carboidrati, 48,0 g zuccheri, 6,0 g fibre, 9,5 g proteine, 0,05 g sale.
102) Canestrelli (Vicenzi): 520 kcal, 28,0 g grassi, 18,0 g grassi saturi, 60,0 g carboidrati, 22,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 0,30 g sale.
103) Baci di Dama (Artigianali/GDO): 550 kcal, 35,0 g grassi, 15,0 g grassi saturi, 52,0 g carboidrati, 28,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,10 g sale.
104) Torcetti al Burro (Monviso): 495 kcal, 22,0 g grassi, 14,0 g grassi saturi, 68,0 g carboidrati, 25,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 0,45 g sale.
106) Colussi Senza Zuccheri Aggiunti: 430 kcal, 14,0 g grassi, 1,5 g grassi saturi, 70,0 g carboidrati, 0,5 g zuccheri, 6,0 g fibre, 9,5 g proteine, 0,75 g sale.
107) Misura Fibrextra Miele: 438 kcal, 15,5 g grassi, 1,6 g grassi saturi, 61,0 g carboidrati, 19,0 g zuccheri, 13,0 g fibre, 8,2 g proteine, 0,72 g sale.
108) Galbusera BuoniCosÃ¬ (Senza Zucchero): 435 kcal, 16,0 g grassi, 1,8 g grassi saturi, 68,0 g carboidrati, 1,0 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,85 g sale.
109) Galbusera RisosuRiso: 455 kcal, 15,0 g grassi, 1,7 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 4,5 g fibre, 8,5 g proteine, 0,80 g sale.
110) Zerograno Frollini (Galbusera - Senza Glutine): 465 kcal, 18,0 g grassi, 8,5 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 3,0 g fibre, 4,5 g proteine, 0,60 g sale.
111) BioSottile (Probios): 410 kcal, 9,5 g grassi, 1,2 g grassi saturi, 72,0 g carboidrati, 18,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,50 g sale.
112) Sfornatini Integrali (Mulino Bianco): 440 kcal, 15,0 g grassi, 1,6 g grassi saturi, 63,0 g carboidrati, 18,5 g zuccheri, 10,0 g fibre, 8,5 g proteine, 0,95 g sale.
114) Frollini con Nocciole (Esselunga Top): 505 kcal, 26,0 g grassi, 12,0 g grassi saturi, 58,0 g carboidrati, 25,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,40 g sale.
115) Shortbread (Walkers): 533 kcal, 30,3 g grassi, 18,9 g grassi saturi, 58,4 g carboidrati, 16,2 g zuccheri, 2,1 g fibre, 5,6 g proteine, 0,70 g sale.
116) Choco Leibniz (Bahlsen): 491 kcal, 22,0 g grassi, 14,0 g grassi saturi, 64,0 g carboidrati, 35,0 g zuccheri, 2,8 g fibre, 7,8 g proteine, 0,48 g sale.
117) Pick Up! (Bahlsen): 511 kcal, 26,0 g grassi, 15,0 g grassi saturi, 61,0 g carboidrati, 35,0 g zuccheri, 2,5 g fibre, 6,7 g proteine, 0,45 g sale.
118) Oreo Double Stuff: 502 kcal, 25,0 g grassi, 7,5 g grassi saturi, 65,0 g carboidrati, 45,0 g zuccheri, 1,5 g fibre, 3,8 g proteine, 0,60 g sale.
119) Milka Sensations (Choco Inside): 510 kcal, 27,0 g grassi, 13,0 g grassi saturi, 60,0 g carboidrati, 38,0 g zuccheri, 1,8 g fibre, 5,3 g proteine, 0,85 g sale.
120) Cookie Classico (McEnnedy/Lidl): 495 kcal, 24,0 g grassi, 12,0 g grassi saturi, 62,0 g carboidrati, 34,0 g zuccheri, 3,0 g fibre, 6,0 g proteine, 0,65 g sale.
121) GrisbÃ¬ al Limone (Vicenzi): 530 kcal, 30,0 g grassi, 13,0 g grassi saturi, 58,0 g carboidrati, 31,0 g zuccheri, 2,0 g fibre, 5,5 g proteine, 0,45 g sale.
122) Knoten (Biscotti al burro danesi): 505 kcal, 25,0 g grassi, 16,0 g grassi saturi, 64,0 g carboidrati, 24,0 g zuccheri, 1,5 g fibre, 5,5 g proteine, 0,50 g sale.
124) Settembrini (Mulino Bianco): 431 kcal, 15,0 g grassi, 7,0 g grassi saturi, 66,5 g carboidrati, 33,0 g zuccheri, 3,3 g fibre, 5,8 g proteine, 0,40 g sale.
125) Tenerezze al Limone (Mulino Bianco): 470 kcal, 20,0 g grassi, 9,5 g grassi saturi, 66,5 g carboidrati, 25,5 g zuccheri, 1,8 g fibre, 5,2 g proteine, 0,45 g sale.
126) Gemme di Albicocca (Mulino Bianco): 435 kcal, 16,0 g grassi, 7,5 g grassi saturi, 66,0 g carboidrati, 32,0 g zuccheri, 2,5 g fibre, 5,5 g proteine, 0,42 g sale.
127) Cioccograno (Mulino Bianco): 475 kcal, 20,5 g grassi, 9,0 g grassi saturi, 62,0 g carboidrati, 21,5 g zuccheri, 6,2 g fibre, 7,5 g proteine, 0,65 g sale.
128) Rigoli Integrali (Mulino Bianco): 450 kcal, 16,0 g grassi, 1,6 g grassi saturi, 64,0 g carboidrati, 19,0 g zuccheri, 9,5 g fibre, 8,0 g proteine, 0,75 g sale.
129) Ringo Cacao (Pavesi): 488 kcal, 21,5 g grassi, 9,8 g grassi saturi, 66,0 g carboidrati, 32,0 g zuccheri, 3,0 g fibre, 6,2 g proteine, 0,48 g sale.
130) Togo Fondente (Pavesi): 505 kcal, 25,0 g grassi, 15,0 g grassi saturi, 62,0 g carboidrati, 33,0 g zuccheri, 4,0 g fibre, 6,5 g proteine, 0,40 g sale.
131) Marie Integrali (Saiwa): 425 kcal, 11,5 g grassi, 1,2 g grassi saturi, 68,0 g carboidrati, 19,0 g zuccheri, 10,0 g fibre, 9,0 g proteine, 0,80 g sale.
132) Vitasnella Frollini ai Cereali: 435 kcal, 13,0 g grassi, 1,5 g grassi saturi, 69,0 g carboidrati, 19,0 g zuccheri, 8,0 g fibre, 8,0 g proteine, 0,75 g sale.
133) Biscottone (Mulino Bianco): 477 kcal, 19,5 g grassi, 2,5 g grassi saturi, 66,2 g carboidrati, 21,5 g zuccheri, 4,0 g fibre, 7,2 g proteine, 0,75 g sale.
134) Zenzerini (Galbusera): 445 kcal, 15,0 g grassi, 1,7 g grassi saturi, 70,0 g carboidrati, 22,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,80 g sale.
135) Belvita Breakfast Miele e Cereali: 450 kcal, 15,0 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 20,0 g zuccheri, 7,0 g fibre, 7,5 g proteine, 0,40 g sale.
136) Belvita Breakfast Cioccolato: 460 kcal, 16,0 g grassi, 4,0 g grassi saturi, 66,0 g carboidrati, 25,0 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,45 g sale.
137) Biscotti Farro e Gocce (Esselunga Bio): 465 kcal, 18,0 g grassi, 8,5 g grassi saturi, 65,0 g carboidrati, 24,0 g zuccheri, 5,0 g fibre, 8,5 g proteine, 0,55 g sale.
138) Novellini al Latte e Miele (Campiello): 470 kcal, 17,0 g grassi, 8,5 g grassi saturi, 71,0 g carboidrati, 25,0 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,60 g sale.
139) Ottimini Integrali (Divella): 448 kcal, 16,5 g grassi, 2,0 g grassi saturi, 65,0 g carboidrati, 18,0 g zuccheri, 8,5 g fibre, 8,0 g proteine, 0,70 g sale.
140) Ottimini al Cacao (Divella): 465 kcal, 18,5 g grassi, 8,5 g grassi saturi, 66,0 g carboidrati, 24,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,65 g sale.
141) Ottimini con Gocce di Cioccolato (Divella): 475 kcal, 20,0 g grassi, 9,5 g grassi saturi, 65,0 g carboidrati, 23,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,60 g sale.
142) Digestive (Conad): 480 kcal, 21,0 g grassi, 10,0 g grassi saturi, 63,0 g carboidrati, 16,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 1,2 g sale.
143) Frollini ai Cereali (Carrefour Bio): 455 kcal, 17,0 g grassi, 1,8 g grassi saturi, 65,0 g carboidrati, 20,0 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,65 g sale.
144) Petit Beurre (LU): 440 kcal, 12,0 g grassi, 7,5 g grassi saturi, 74,0 g carboidrati, 23,0 g zuccheri, 2,2 g fibre, 8,0 g proteine, 0,70 g sale.
145) Bastoncini (Balocco): 468 kcal, 17,0 g grassi, 2,5 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 0,75 g sale.
146) Mondine (Balocco): 472 kcal, 18,5 g grassi, 2,8 g grassi saturi, 68,0 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,80 g sale.
147) Paste di Meliga (Monviso): 510 kcal, 26,0 g grassi, 16,0 g grassi saturi, 62,0 g carboidrati, 22,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,40 g sale.
149) Petto di pollo: kcal 165, proteine 31.0g, grassi 3.6g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Niacina, Selenio
150) Coscia di pollo (senza pelle): kcal 119, proteine 20.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Zinco, Vitamina B12
151) Petto di tacchino: kcal 104, proteine 24.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Fosforo
152) Filetto di manzo: kcal 250, proteine 26.0g, grassi 15.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro emico, Zinco, Vitamina B12
153) Girello di manzo: kcal 137, proteine 22.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
154) Macinato di manzo (magro 5%): kcal 137, proteine 21.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B3
155) Lonza di maiale: kcal 143, proteine 21.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Tiamina (B1), Selenio
156) Braciola di maiale: kcal 197, proteine 20.0g, grassi 12.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Zinco
157) Fegato di bovino: kcal 135, proteine 20.0g, grassi 3.6g, carboidrati 3.9g, fibre 0.0g, micronutrienti: Vitamina A, Ferro, Rame
158) Carne di cavallo: kcal 133, proteine 21.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
159) Bresaola: kcal 151, proteine 32.0g, grassi 2.6g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Potassio, Ferro
160) Prosciutto crudo (magro): kcal 235, proteine 28.0g, grassi 13.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B1
161) Prosciutto cotto: kcal 215, proteine 20.0g, grassi 14.0g, carboidrati 1.0g, fibre 0.0g, micronutrienti: Sodio, Fosforo
162) Agnello (costolette): kcal 377, proteine 15.0g, grassi 35.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
163) Coniglio: kcal 136, proteine 33.0g, grassi 5.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Selenio
165) Salmone (Atlantico): kcal 208, proteine 20.0g, grassi 13.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3, Vitamina D
166) Tonno (fresco): kcal 144, proteine 23.0g, grassi 4.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Vitamina B12, Niacina
167) Tonno (scatola, al naturale): kcal 116, proteine 26.0g, grassi 0.8g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Magnesio
169) Prosciutto Crudo di Parma DOP (stagionato 18 mesi): 265 kcal, 18,5 g grassi, 6,2 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 26,0 g proteine, 4,50 g sale.
170) Prosciutto Crudo Sgrassato (solo parte magra): 175 kcal, 4,5 g grassi, 1,5 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33,0 g proteine, 5,00 g sale.
171) Prosciutto San Daniele DOP: 272 kcal, 19,0 g grassi, 6,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,5 g proteine, 4,30 g sale.
172) Speck dell'Alto Adige IGP: 300 kcal, 20,0 g grassi, 7,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 28,0 g proteine, 5,20 g sale.
173) Bresaola della Valtellina IGP (Punta d'Anca): 151 kcal, 2,0 g grassi, 0,7 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 32,0 g proteine, 3,80 g sale
174) Physalis (Alkekengi): kcal 53, proteine 1.9g, grassi 0.7g, carboidrati 11.2g, fibre 0.0g, micronutrienti: Vitamina A, Niacina
175) Platano (Verde): kcal 122, proteine 1.3g, grassi 0.4g, carboidrati 31.9g, fibre 2.3g, micronutrienti: Vitamina B6, Potassio
176) Salak (Frutto serpente): kcal 82, proteine 0.8g, grassi 0.4g, carboidrati 21.0g, fibre 0.5g, micronutrienti: Ferro, Vitamina C
177) Santu: kcal 50, proteine 0.7g, grassi 0.2g, carboidrati 13.0g, fibre 1.5g, micronutrienti: Vitamina C, Calcio
178) Spaghetti (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
179) Penne Rigate (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
180) Fusilli (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
181) Rigatoni (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
182) Farfalle (confezionati): 357 kcal, 1,5 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,01 g sale.
183) Linguine (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
184) Mezze Maniche (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
185) Tortiglioni (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
186) Bucatini (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
187) Orecchiette secche (confezionati): 352 kcal, 1,3 g grassi, 0,3 g grassi saturi, 71,5 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 0,01 g sale.
188) Paccheri (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
189) Ziti (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
190) Ditalini (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
191) Stelline/Pastina (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
192) Cannelloni secchi (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
193) Lasagne secche di semola (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
194) Pasta Integrale (confezionati): 348 kcal, 2,5 g grassi, 0,5 g grassi saturi, 64,0 g carboidrati, 3,3 g zuccheri, 8,0 g fibre, 13,5 g proteine, 0,01 g sale.
195) Pasta di Farro (confezionati): 340 kcal, 2,5 g grassi, 0,4 g grassi saturi, 63,0 g carboidrati, 2,5 g zuccheri, 7,0 g fibre, 13,0 g proteine, 0,01 g sale.
196) Pasta di Kamut/Khorasan (confezionati): 357 kcal, 2,1 g grassi, 0,4 g grassi saturi, 67,0 g carboidrati, 2,8 g zuccheri, 6,5 g fibre, 14,5 g proteine, 0,01 g sale.
197) Pasta d'Orzo (confezionati): 345 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 2,0 g zuccheri, 6,0 g fibre, 11,0 g proteine, 0,01 g sale.
198) Pasta di Segale (confezionati): 335 kcal, 1,8 g grassi, 0,3 g grassi saturi, 66,0 g carboidrati, 2,0 g zuccheri, 12,0 g fibre, 9,5 g proteine, 0,01 g sale.
199) Pasta di Lenticchie Rosse (confezionati): 335 kcal, 1,7 g grassi, ,4 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 11,0 g fibre, 25,0 g proteine, 0,01 g sale.
200) Pasta di Ceci (confezionati): 355 kcal, 4,5 g grassi, 0,6 g grassi saturi, 49,0 g carboidrati, 2,0 g zuccheri, 13,0 g fibre, 22,0 g proteine, 0,01 g sale.
201) Pasta di Piselli Verdi (confezionati): 340 kcal, 1,5 g grassi, 0,3 g grassi saturi, 54,0 g carboidrati, 2,5 g zuccheri, 10,0 g fibre, 20,0 g proteine, 0,01 g sale.
202) Pasta di Fagioli Neri (confezionati): 325 kcal, 2,5 g grassi, 0,5 g grassi saturi, 40,0 g carboidrati, 2,5 g zuccheri, 15,0 g fibre, 28,0 g proteine, 0,01 g sale.
203) Tagliatelle all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
204) Pappardelle all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
205) Fettuccine all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
206) Lasagne all'uovo secche (confezionati): 380 kcal, 4,0 g grassi, 1,3 g grassi saturi, 69,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 14,5 g proteine, 0,10 g sale.
207) Tagliatelle fresche all'uovo (confezionati/banco frigo): 285 kcal, 4,0 g grassi, 1,2 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 11,0 g proteine, 0,20 g sale.
208) Passatelli freschi (confezionati/banco frigo): 310 kcal, 12,0 g grassi, 5,0 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 18,0 g proteine, 1,20 g sale.
209) Tortellini alla carne (confezionati): 295 kcal, 8,5 g grassi, 3,5 g grassi saturi, 40,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 13,5 g proteine, 1,10 g sale.
210) Ravioli ricotta e spinaci (confezionati): 245 kcal, 7,0 g grassi, 3,8 g grassi saturi, 34,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,5 g proteine, 0,95 g sale.
211) Cappelletti al prosciutto crudo (confezionati): 305 kcal, 9,0 g grassi, 4,0 g grassi saturi, 41,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 14,0 g proteine, 1,20 g sale.
212) Tortelloni ai funghi porcini (confezionati): 260 kcal, 7,5 g grassi, 2,5 g grassi saturi, 38,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 9,0 g proteine, 1,00 g sale.
213) Ravioli al branzino/pesce (confezionati): 235 kcal, 6,5 g grassi, 2,0 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 11,0 g proteine, 1,10 g sale.
214) Agnolotti piemontesi (confezionati): 280 kcal, 9,0 g grassi, 3,5 g grassi saturi, 35,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 13,5 g proteine, 1,00 g sale.
215) Culurgiones (confezionati): 220 kcal, 6,0 g grassi, 3,0 g grassi saturi, 33,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 7,5 g proteine, 0,90 g sale.
216) Gnocchi di patate (confezionati/freschi): 160 kcal, 0,5 g grassi, 0,1 g grassi saturi, 34,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale.
217) Gnocchi di patate ripieni di formaggio (confezionati): 195 kcal, 4,5 g grassi, 2,5 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 5,5 g proteine, 1,20 g sale.
218) Chicche di patate (confezionati): 165 kcal, 0,5 g grassi, 0,1 g grassi saturi, 35,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale.
219) Gnocchi alla romana (confezionati/pronti): 185 kcal, 9,0 g grassi, 5,5 g grassi saturi, 19,0 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 6,5 g proteine, 1,30 g sale.
220) Trofie fresche (confezionati): 270 kcal, 1,0 g grassi, 0,2 g grassi saturi, 56,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 8,5 g proteine, 0,10 g sale.
221) Strozzapreti (confezionati): 285 kcal, 1,2 g grassi, 0,3 g grassi saturi, 58,0 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 9,0 g proteine, 0,10 g sale.
222) Cavallucci/Gnocchetti sardi secchi (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
223) Pici toscani secchi (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,01 g sale.
224) Scialatielli freschi (confezionati): 265 kcal, 1,5 g grassi, 0,4 g grassi saturi, 54,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,20 g sale
225) Pasta di Mais (confezionati): 360 kcal, 1,5 g grassi, 0,3 g grassi saturi, 78,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 7,0 g proteine, 0,01 g sale.
226) Pasta di Riso (confezionati): 355 kcal, 1,0 g grassi, 0,3 g grassi saturi, 79,0 g carboidrati, 0,2 g zuccheri, 1,5 g fibre, 7,0 g proteine, 0,01 g sale.
227) Pasta di Mais e Riso (confezionati): 358 kcal, 1,3 g grassi, 0,3 g grassi saturi, 78,5 g carboidrati, 0,4 g zuccheri, 1,8 g fibre, 7,0 g proteine, 0,01 g sale.
228) Finocchiona IGP (Toscana): 380 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,0 g proteine, 4,00 g sale.
229) Soppressata di Calabria DOP: 410 kcal, 35,0 g grassi, 12,5 g grassi saturi, 1,5 g carboidrati, 0,8 g zuccheri, 0 g fibre, 22,5 g proteine, 4,20 g sale.
230) 'Nduja di Spilinga (Calabria): 520 kcal, 50,0 g grassi, 18,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 15,0 g proteine, 3,50 g sale.
231) Salame Cremona IGP: 375 kcal, 30,0 g grassi, 10,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,0 g proteine, 3,80 g sale.
232) Salame d'Oca di Mortara IGP: 340 kcal, 28,0 g grassi, 9,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 20,0 g proteine, 3,20 g sale.
233) Salame di Varzi DOP: 390 kcal, 31,5 g grassi, 11,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 26,0 g proteine, 3,60 g sale.
234) Salame Brianza DOP: 385 kcal, 31,0 g grassi, 11,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 3,70 g sale.
235) Salame Piacentino DOP: 405 kcal, 34,0 g grassi, 12,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 24,0 g proteine, 3,90 g sale.
236) Pancetta Piacentina DOP: 460 kcal, 46,0 g grassi, 16,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,0 g proteine, 3,80 g sale.
237) Coppa Piacentina DOP: 398 kcal, 33,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 4,60 g sale.
238) Salame Sant'Angelo di Brolo IGP: 360 kcal, 28,0 g grassi, 9,8 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 27,0 g proteine, 3,50 g sale.
239) Porchetta di Ariccia IGP: 250 kcal, 18,0 g grassi, 6,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,20 g sale.
240) Coppa di Parma IGP: 325 kcal, 24,0 g grassi, 8,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,5 g proteine, 4,40 g sale.
241) Lonzino (Lombo stagionato): 210 kcal, 9,0 g grassi, 3,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 31,0 g proteine, 4,50 g sale.
242) Pancetta tesa piccante: 480 kcal, 48,0 g grassi, 17,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 11,0 g proteine, 4,20 g sale.
243) Slinzega (tipo bresaola piccola): 180 kcal, 4,5 g grassi, 1,8 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 34,0 g proteine, 4,80 g sale.
244) Mocetta (Valle d'Aosta): 190 kcal, 5,5 g grassi, 2,2 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 34,0 g proteine, 4,50 g sale.
246) Salame di Cinghiale: 355 kcal, 26,0 g grassi, 9,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,10 g sale.
247) Salame di Cervo: 330 kcal, 22,0 g grassi, 8,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31,0 g proteine, 4,00 g sale.
248) Salame di Capriolo: 325 kcal, 21,5 g grassi, 7,8 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31,0 g proteine, 4,00 g sale.
249) Bresaola di Cavallo: 145 kcal, 2,5 g grassi, 1,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 29,0 g proteine, 3,90 g sale.
250) Salame di Asino: 345 kcal, 25,0 g grassi, 8,8 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,20 g sale.
251) Violino di Capra (prosciutto di capra): 240 kcal, 14,0 g grassi, 5,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 27,5 g proteine, 4,80 g sale.
252) Prosciutto di Petto d'Anatra (affumicato): 380 kcal, 34,0 g grassi, 11,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,0 g proteine, 3,50 g sale.
254) Jamon Iberico de Bellota (Spagna): 375 kcal, 28,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 30,0 g proteine, 3,80 g sale.
255) Jamon Serrano: 240 kcal, 13,0 g grassi, 4,5 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 30,0 g proteine, 4,50 g sale.
256) Pastrami di Manzo (affettato): 145 kcal, 6,0 g grassi, 2,5 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,80 g sale.
257) Salami Pepperoni (tipo USA): 495 kcal, 44,0 g grassi, 17,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 22,0 g proteine, 4,50 g sale.
258) Leberwurst (patÃ© di fegato in budello): 325 kcal, 28,0 g grassi, 10,0 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,0 g proteine, 1,80 g sale.
259) SchwarzwÃ¤lder Schinken (Prosciutto Foresta Nera): 245 kcal, 14,0 g grassi, 5,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 28,5 g proteine, 5,50 g sale.
261) Bratwurst di Vitello: 260 kcal, 22,0 g grassi, 8,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 14,5 g proteine, 2,10 g sale.
262) Bratwurst di Suino: 295 kcal, 26,0 g grassi, 10,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 13,5 g proteine, 2,20 g sale.
263) Weisswurst (Salsiccia bianca di Monaco): 255 kcal, 22,0 g grassi, 8,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,5 g proteine, 1,90 g sale.
264) Salsiccia fresca di Suino: 310 kcal, 27,0 g grassi, 9,8 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,0 g proteine, 2,20 g sale.
265) Salsiccia di Pollo e Tacchino fresca: 165 kcal, 11,0 g grassi, 3,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 15,5 g proteine, 2,00 g sale.
266) Salsiccia di fegato: 380 kcal, 33,0 g grassi, 12,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 18,0 g proteine, 2,10 g sale.
267) Cervellata (Salsiccia tipica pugliese): 290 kcal, 24,0 g grassi, 9,0 g grassi saturi, 1,2 g carboidrati, 0,5 g zuccheri, 0 g fibre, 17,0 g proteine, 2,30 g sale.
268) Luganega (Salsiccia lunga): 300 kcal, 25,5 g grassi, 9,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,5 g proteine, 2,20 g sale.
270) Bastoncini di salame (Snack tipo Mini-Salami): 510 kcal, 45,0 g grassi, 17,5 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 24,0 g proteine, 4,20 g sale.
271) Beef Jerky (Manzo essiccato): 280 kcal, 4,0 g grassi, 1,8 g grassi saturi, 11,0 g carboidrati, 9,0 g zuccheri, 0 g fibre, 50,0 g proteine, 5,00 g sale.
272) Affettato Vegano (base soia/glutine): 185 kcal, 9,0 g grassi, 1,2 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 21,0 g proteine, 2,10 g sale.
273) Fettine di Bresaola sgrassata: 148 kcal, 1,8 g grassi, 0,6 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 33,0 g proteine, 3,90 g sale.
274) Prosciutto Cotto Light (-50% grassi): 95 kcal, 2,5 g grassi, 0,9 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 17,0 g proteine, 1,90 g sale.
275) Mortadella Light: 180 kcal, 12,0 g grassi, 4,2 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,0 g proteine, 2,10 g sale.
276) WÃ¼rstel di Suino (classico): 270 kcal, 24,0 g grassi, 9,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,0 g proteine, 2,30 g sale.
277) WÃ¼rstel di Pollo e Tacchino: 220 kcal, 17,0 g grassi, 5,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 14,0 g proteine, 2,50 g sale.
278) WÃ¼rstel con Formaggio: 295 kcal, 26,0 g grassi, 10,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 13,5 g proteine, 2,40 g sale.
279) Merluzzo: kcal 82, proteine 18.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Selenio, Potassio
280) Spigola (Branzino): kcal 97, proteine 18.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Vitamina B6
281) Orata: kcal 115, proteine 20.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Omega-3
282) Sgombro: kcal 305, proteine 19.0g, grassi 25.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Vitamina B12, Omega-3
283) Sardine (fresche): kcal 208, proteine 20.0g, grassi 14.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Ferro, Vitamina D
284) Alici (Acciughe): kcal 131, proteine 20.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Omega-3
285) Polpo: kcal 82, proteine 15.0g, grassi 1.0g, carboidrati 2.2g, fibre 0.0g, micronutrienti: Ferro, Selenio, Vitamina B12
286) Calamaro: kcal 92, proteine 16.0g, grassi 1.4g, carboidrati 3.1g, fibre 0.0g, micronutrienti: Rame, Zinco
287) Gamberi: kcal 99, proteine 24.0g, grassi 0.3g, carboidrati 0.2g, fibre 0.0g, micronutrienti: Selenio, Iodio
288) Cozze: kcal 172, proteine 24.0g, grassi 4.5g, carboidrati 7.4g, fibre 0.0g, micronutrienti: Manganese, Ferro emico
289) Vongole: kcal 148, proteine 26.0g, grassi 2.0g, carboidrati 5.1g, fibre 0.0g, micronutrienti: Ferro, Vitamina C
290) Ostriche: kcal 81, proteine 9.0g, grassi 2.3g, carboidrati 4.9g, fibre 0.0g, micronutrienti: Zinco (altissimo), Rame
292) Uovo di gallina (intero): kcal 155, proteine 13.0g, grassi 11.0g, carboidrati 1.1g, fibre 0.0g, micronutrienti: Colina, Vitamina A, Riboflavina
293) Albume d'uovo: kcal 52, proteine 11.0g, grassi 0.2g, carboidrati 0.7g, fibre 0.0g, micronutrienti: Selenio, Riboflavina
294) Tuorlo d'uovo: kcal 322, proteine 16.0g, grassi 27.0g, carboidrati 3.6g, fibre 0.0g, micronutrienti: Vitamina A, Vitamina D, Ferro
295) Semi di Chia: kcal 486, proteine 17.0g, grassi 31.0g, carboidrati 42.0g, fibre 34.0g, micronutrienti: Omega-3, Calcio, Manganese
296) Semi di Lino: kcal 534, proteine 18.0g, grassi 42.0g, carboidrati 29.0g, fibre 27.0g, micronutrienti: Omega-3, Magnesio
297) Semi di Zucca: kcal 559, proteine 30.0g, grassi 49.0g, carboidrati 11.0g, fibre 6.0g, micronutrienti: Zinco, Magnesio
299) Anatra (petto senza pelle): kcal 140, proteine 20.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Rame, Vitamina B3
300) Oca (carne senza pelle): kcal 161, proteine 22.0g, grassi 7.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Fosforo
301) Quaglia (carne magra): kcal 134, proteine 22.0g, grassi 4.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Zinco
302) Vitello (fesa): kcal 107, proteine 21.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Potassio
303) Pancetta di maiale (tesa): kcal 418, proteine 14.0g, grassi 39.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Selenio
304) Salame (tipo Milano): kcal 336, proteine 22.0g, grassi 27.0g, carboidrati 1.0g, fibre 0.0g, micronutrienti: Sodio, Zinco, Tiamina
305) Mortadella: kcal 311, proteine 16.0g, grassi 28.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B12
306) Speck: kcal 300, proteine 30.0g, grassi 20.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
307) Guanciale: kcal 655, proteine 4.0g, grassi 69.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Grassi saturi
308) Salsiccia di maiale (fresca): kcal 346, proteine 14.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Tiamina, Fosforo
309) Wurstel (suino): kcal 269, proteine 13.0g, grassi 23.0g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B12
310) Trippa di bovino: kcal 94, proteine 16.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Vitamina B12
311) Roast beef: kcal 111, proteine 22.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Zinco
312) Faraona: kcal 134, proteine 23.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B6
313) Tacchino (fesa a fette, salume): kcal 104, proteine 24.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Sodio
315) Pesce spada: kcal 144, proteine 20.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Selenio
316) Trota (salmonata): kcal 148, proteine 21.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3, Vitamina B12
317) Anguilla: kcal 236, proteine 15.0g, grassi 19.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Vitamina B12
318) Rana pescatrice (coda di rospo): kcal 76, proteine 14.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Selenio
319) Sogliola: kcal 86, proteine 15.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Selenio
320) Platessa: kcal 86, proteine 15.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B12, Iodio
321) Astice: kcal 90, proteine 19.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Rame, Zinco, Selenio
322) Granchio: kcal 84, proteine 18.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
323) Scampi: kcal 85, proteine 17.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Iodio
324) Capesante: kcal 69, proteine 12.0g, grassi 1.0g, carboidrati 3.0g, fibre 0.0g, micronutrienti: Magnesio, Potassio
325) Seppia: kcal 79, proteine 16.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Rame, Fosforo
326) Aringa: kcal 158, proteine 18.0g, grassi 9.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Omega-3
327) Triglia: kcal 117, proteine 19.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Vitamina D
328) Carpa: kcal 127, proteine 18.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Vitamina B12
329) Caviale: kcal 264, proteine 25.0g, grassi 18.0g, carboidrati 4.0g, fibre 0.0g, micronutrienti: Vitamina B12, Ferro, Magnesio
331) Pecorino Romano: kcal 387, proteine 26.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Calcio
333) Cuore di bovino: kcal 112, proteine 17.0g, grassi 3.9g, carboidrati 0.1g, fibre 0.0g, micronutrienti: Vitamina B12, Riboflavina, Ferro
334) Lingua di bovino: kcal 224, proteine 15.0g, grassi 16.0g, carboidrati 3.7g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
335) Rognone di bovino (rene): kcal 103, proteine 17.0g, grassi 3.0g, carboidrati 0.9g, fibre 0.0g, micronutrienti: Selenio (altissimo), Vitamina A
336) Polmone di bovino: kcal 92, proteine 16.0g, grassi 2.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina C
337) Cervello di bovino: kcal 143, proteine 11.0g, grassi 10.0g, carboidrati 1.5g, fibre 0.0g, micronutrienti: Colina, Vitamina B12
338) Carne di struzzo: kcal 114, proteine 25.0g, grassi 1.2g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
339) Carne di cervo: kcal 120, proteine 23.0g, grassi 2.4g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Niacina
340) Carne di cinghiale: kcal 122, proteine 21.0g, grassi 3.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Selenio
341) Piccione (carne): kcal 142, proteine 17.5g, grassi 7.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Rame
342) Midollo osseo: kcal 786, proteine 6.7g, grassi 84.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Fosforo
343) Animelle (timo/pancrÃ©as): kcal 240, proteine 15.0g, grassi 20.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina C, Potassio
344) Cotechino (fresco): kcal 450, proteine 17.0g, grassi 42.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Tiamina
345) Zampone: kcal 360, proteine 19.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Ferro
346) Sanguinaccio: kcal 379, proteine 15.0g, grassi 34.0g, carboidrati 1.3g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
347) Carne di capra: kcal 109, proteine 20.0g, grassi 2.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
349) Luccio: kcal 88, proteine 19.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Vitamina B12
350) Persico reale: kcal 91, proteine 19.0g, grassi 0.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Manganese, Vitamina B12
351) Cernia: kcal 92, proteine 19.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Potassio, Selenio
352) Dentice: kcal 100, proteine 20.0g, grassi 1.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Fosforo
353) Gallinella di mare: kcal 101, proteine 19.0g, grassi 2.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Potassio, Iodio
354) Razza: kcal 78, proteine 18.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Magnesio, Vitamina B12
355) Pagello: kcal 101, proteine 21.0g, grassi 1.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Potassio
356) Sarago: kcal 103, proteine 20.0g, grassi 2.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Fosforo
357) Mormora: kcal 97, proteine 20.0g, grassi 1.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Niacina
358) Bottarga (muggine): kcal 400, proteine 35.0g, grassi 25.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Omega-3, Sodio
359) BaccalÃ  (ammollato): kcal 95, proteine 21.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Iodio
360) Stoccafisso (secco): kcal 350, proteine 80.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B12, Selenio
361) Lumache di terra: kcal 90, proteine 16.0g, grassi 1.4g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Magnesio, Ferro
362) Moscardini: kcal 72, proteine 15.0g, grassi 1.0g, carboidrati 0.7g, fibre 0.0g, micronutrienti: Vitamina B12, Selenio
363) Panocchie (Canocchie): kcal 69, proteine 13.0g, grassi 1.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Iodio
365) Crusca di frumento: kcal 216, proteine 15.0g, grassi 4.3g, carboidrati 64.0g, fibre 42.0g, micronutrienti: Magnesio, Manganese
366) Germe di grano: kcal 360, proteine 23.0g, grassi 10.0g, carboidrati 52.0g, fibre 13.0g, micronutrienti: Vitamina E, Zinco, Folati
367) Grano spezzato (Cracked wheat): kcal 340, proteine 12.0g, grassi 2.0g, carboidrati 71.0g, fibre 12.0g, micronutrienti: Selenio, Magnesio
368) Pane di Altamura: kcal 280, proteine 10.0g, grassi 1.5g, carboidrati 57.0g, fibre 3.0g, micronutrienti: Potassio, Fosforo
369) Crackers (integrali): kcal 430, proteine 10.0g, grassi 15.0g, carboidrati 65.0g, fibre 8.0g, micronutrienti: Manganese, Niacina
370) Fette biscottate: kcal 408, proteine 11.0g, grassi 6.0g, carboidrati 75.0g, fibre 4.0g, micronutrienti: Ferro, Tiamina
371) Polenta (farina di mais gialla): kcal 362, proteine 8.0g, grassi 2.8g, carboidrati 77.0g, fibre 7.0g, micronutrienti: Vitamina A, Magnesio
372) Gnocchi di patate: kcal 150, proteine 3.5g, grassi 0.5g, carboidrati 33.0g, fibre 1.0g, micronutrienti: Potassio, Vitamina B6
373) Tortellini (freschi, ripieno carne): kcal 295, proteine 14.0g, grassi 8.0g, carboidrati 41.0g, fibre 1.5g, micronutrienti: Sodio, Selenio
374) Fregola (sarda): kcal 350, proteine 12.0g, grassi 1.5g, carboidrati 72.0g, fibre 3.0g, micronutrienti: Tiamina, Niacina
376) Agretti (Barba di frate): kcal 17, proteine 1.8g, grassi 0.2g, carboidrati 2.2g, fibre 2.1g, micronutrienti: Vitamina A, Calcio
377) Ortica (foglie): kcal 42, proteine 2.7g, grassi 0.1g, carboidrati 7.0g, fibre 6.9g, micronutrienti: Calcio (altissimo), Ferro, Vitamina K
378) Cicoria di campo: kcal 23, proteine 1.7g, grassi 0.3g, carboidrati 4.7g, fibre 4.0g, micronutrienti: Inulina, Vitamina A
379) Tarassaco (foglie): kcal 45, proteine 2.7g, grassi 0.7g, carboidrati 9.0g, fibre 3.5g, micronutrienti: Vitamina A, Vitamina K, Potassio
380) Cime di rapa: kcal 22, proteine 2.9g, grassi 0.3g, carboidrati 2.0g, fibre 2.9g, micronutrienti: Folati, Calcio
381) Verza: kcal 27, proteine 2.0g, grassi 0.1g, carboidrati 6.0g, fibre 2.5g, micronutrienti: Vitamina K, Vitamina C
382) Cavolo nero: kcal 35, proteine 3.3g, grassi 0.7g, carboidrati 6.0g, fibre 2.0g, micronutrienti: Vitamina C, Vitamina K
383) Pak Choi (Bok Choy): kcal 13, proteine 1.5g, grassi 0.2g, carboidrati 2.2g, fibre 1.0g, micronutrienti: Vitamina A, Vitamina C
384) Daikon (ravanello bianco): kcal 18, proteine 0.6g, grassi 0.1g, carboidrati 4.1g, fibre 1.6g, micronutrienti: Vitamina C, Enzimi digestivi
385) Scorzonera (radice): kcal 82, proteine 3.3g, grassi 0.2g, carboidrati 18.0g, fibre 3.3g, micronutrienti: Ferro, Potassio
386) Topinambur: kcal 73, proteine 2.0g, grassi 0.0g, carboidrati 17.0g, fibre 1.6g, micronutrienti: Inulina, Ferro
387) Cardo: kcal 17, proteine 0.7g, grassi 0.1g, carboidrati 4.0g, fibre 1.6g, micronutrienti: Potassio, Magnesio
388) Portulaca: kcal 16, proteine 1.3g, grassi 0.1g, carboidrati 3.4g, fibre 1.0g, micronutrienti: Omega-3, Vitamina C
389) Okra (Gombo): kcal 33, proteine 1.9g, grassi 0.2g, carboidrati 7.0g, fibre 3.2g, micronutrienti: Vitamina K, Manganese
390) Germogli di soia (Mung): kcal 30, proteine 3.0g, grassi 0.2g, carboidrati 6.0g, fibre 1.8g, micronutrienti: Vitamina C, Folati
392) Guava: kcal 68, proteine 2.6g, grassi 1.0g, carboidrati 14.0g, fibre 5.4g, micronutrienti: Vitamina C (altissima), Licopene
393) Litchi: kcal 66, proteine 0.8g, grassi 0.4g, carboidrati 16.5g, fibre 1.3g, micronutrienti: Vitamina C, Potassio
394) Maracuja (Frutto della passione): kcal 97, proteine 2.2g, grassi 0.7g, carboidrati 23.0g, fibre 10.4g, micronutrienti: Vitamina C, Ferro, Vitamina A
395) Dragon Fruit (Pitaya): kcal 50, proteine 1.2g, grassi 0.4g, carboidrati 11.0g, fibre 3.0g, micronutrienti: Magnesio, Vitamina C
396) Carambola: kcal 31, proteine 1.0g, grassi 0.3g, carboidrati 6.7g, fibre 2.8g, micronutrienti: Vitamina C, Potassio
397) Jackfruit (Pane di scimmia): kcal 95, proteine 1.7g, grassi 0.6g, carboidrati 23.2g, fibre 1.5g, micronutrienti: Potassio, Vitamina B6
398) Durian: kcal 147, proteine 1.5g, grassi 5.3g, carboidrati 27.0g, fibre 3.8g, micronutrienti: Vitamina C, Tiamina
399) Rambutan: kcal 82, proteine 0.6g, grassi 0.2g, carboidrati 20.0g, fibre 0.9g, micronutrienti: Manganese, Vitamina C
400) Nespole (del Giappone): kcal 47, proteine 0.4g, grassi 0.2g, carboidrati 12.0g, fibre 1.7g, micronutrienti: Vitamina A, Potassio
401) Ribes rosso: kcal 56, proteine 1.4g, grassi 0.2g, carboidrati 13.8g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
402) Ribes nero: kcal 63, proteine 1.4g, grassi 0.4g, carboidrati 15.4g, fibre 6.8g, micronutrienti: Vitamina C (altissima), Antociani
403) Uva spina: kcal 44, proteine 0.9g, grassi 0.6g, carboidrati 10.0g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
404) Giuggiole (fresche): kcal 79, proteine 1.2g, grassi 0.2g, carboidrati 20.0g, fibre 3.0g, micronutrienti: Vitamina C, Potassio
405) Amarene: kcal 50, proteine 1.0g, grassi 0.3g, carboidrati 12.0g, fibre 1.6g, micronutrienti: Vitamina A, Melatonina naturale
406) Kumquat (Mandarino cinese): kcal 71, proteine 1.9g, grassi 0.9g, carboidrati 16.0g, fibre 6.5g, micronutrienti: Vitamina C, Calcio
408) Olio di cocco: kcal 862, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Acidi grassi a catena media (MCT)
409) Olio di lino: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3 (ALA), Vitamina E
410) Olio di avocado: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina E, Grassi monoinsaturi
411) Olio di semi di zucca: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina E, Fitosteroli
412) Aceto di mele: kcal 21, proteine 0.0g, grassi 0.0g, carboidrati 0.9g, fibre 0.0g, micronutrienti: Potassio, Acido acetico
413) Lievito alimentare (in scaglie): kcal 375, proteine 50.0g, grassi 4.0g, carboidrati 35.0g, fibre 25.0g, micronutrienti: Complesso Vitamine B, Zinco
414) Alga Spirulina (essiccata): kcal 290, proteine 57.0g, grassi 7.7g, carboidrati 24.0g, fibre 3.6g, micronutrienti: Ferro, Vitamina B12 (analogo), Ficocianina
415) Alga Nori: kcal 35, proteine 5.8g, grassi 0.3g, carboidrati 5.0g, fibre 0.3g, micronutrienti: Iodio, Vitamina A
416) Alga Wakame: kcal 45, proteine 3.0g, grassi 0.6g, carboidrati 9.0g, fibre 0.5g, micronutrienti: Iodio, Magnesio
417) Miso (pasta di soia): kcal 198, proteine 12.0g, grassi 6.0g, carboidrati 25.0g, fibre 5.0g, micronutrienti: Sodio, Probiotici
418) Abiu: kcal 60, proteine 1.0g, grassi 0.4g, carboidrati 14.5g, fibre 2.0g, micronutrienti: Vitamina C, Niacina
419) Cherimoya (Cirimoia): kcal 75, proteine 1.6g, grassi 0.7g, carboidrati 17.7g, fibre 3.0g, micronutrienti: Vitamina B6, Potassio
420) CupuaÃ§u: kcal 72, proteine 0.8g, grassi 1.2g, carboidrati 14.0g, fibre 2.0g, micronutrienti: Vitamina C, Polifenoli
421) Jujube (Dattero cinese secco): kcal 287, proteine 3.7g, grassi 1.1g, carboidrati 73.0g, fibre 6.0g, micronutrienti: Vitamina C, Potassio
422) Longan (Occhio di drago): kcal 60, proteine 1.3g, grassi 0.1g, carboidrati 15.1g, fibre 1.1g, micronutrienti: Vitamina C, Rame
423) Lucuma (polvere): kcal 329, proteine 4.0g, grassi 1.0g, carboidrati 80.0g, fibre 20.0g, micronutrienti: Zinco, Ferro, Niacina
424) Noni: kcal 15, proteine 0.5g, grassi 0.1g, carboidrati 3.4g, fibre 1.0g, micronutrienti: Vitamina C, Potassio
425) Pepino (Melone-pera): kcal 25, proteine 0.4g, grassi 0.1g, carboidrati 6.0g, fibre 1.5g, micronutrienti: Vitamina C, Vitamina A
426) Pasta di Quinoa e Riso (confezionati): 362 kcal, 2,0 g grassi, 0,4 g grassi saturi, 75,0 g carboidrati, 0,8 g zuccheri, 3,0 g fibre, 9,0 g proteine, 0,01 g sale.
427) Mozzarella di vacca (confezionata): 250 kcal, 18,0 g grassi, 12,5 g grassi saturi, 1,5 g carboidrati, 1,2 g zuccheri, 0 g fibre, 20,0 g proteine, 0,70 g sale.
428) Mozzarella di vacca SL (confezionata): 245 kcal, 18,0 g grassi, 12,5 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 19,5 g proteine, 0,70 g sale.
429) Ricotta vaccina (confezionata): 150 kcal, 11,0 g grassi, 7,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,30 g sale.
430) Ricotta vaccina SL (confezionata): 145 kcal, 10,5 g grassi, 7,2 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,5 g proteine, 0,35 g sale.
431) Stracchino / Crescenza (confezionata): 285 kcal, 24,0 g grassi, 16,5 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 15,0 g proteine, 0,90 g sale.
432) Stracchino / Crescenza SL (confezionata): 280 kcal, 23,5 g grassi, 16,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 14,5 g proteine, 0,95 g sale.
433) Fiocchi di latte (Cottage cheese) (confezionata): 95 kcal, 4,5 g grassi, 3,0 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 0 g fibre, 11,0 g proteine, 0,75 g sale.
434) Fiocchi di latte SL (confezionata): 92 kcal, 4,3 g grassi, 2,8 g grassi saturi, 3,2 g carboidrati, 3,2 g zuccheri, 0 g fibre, 10,5 g proteine, 0,80 g sale.
435) Formaggio spalmabile classico (tipo Philadelphia) (confezionata): 240 kcal, 22,0 g grassi, 14,5 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 5,5 g proteine, 0,75 g sale.
436) Formaggio spalmabile SL (confezionata): 235 kcal, 21,5 g grassi, 14,0 g grassi saturi, 5,0 g carboidrati, 4,5 g zuccheri, 0 g fibre, 5,2 g proteine, 0,80 g sale.
437) Mascarpone (confezionato): 445 kcal, 47,0 g grassi, 32,0 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 4,5 g proteine, 0,10 g sale.
438) Mascarpone SL (confezionato): 440 kcal, 46,5 g grassi, 31,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 4,2 g proteine, 0,11 g sale
439) Parmigiano Reggiano 24 mesi: 402 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 32,0 g proteine, 1,60 g sale. (Naturalmente SL)
440) Parmigiano Reggiano SL (certificato): 402 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 32,0 g proteine, 1,60 g sale.
441) Grana Padano: 398 kcal, 29,0 g grassi, 18,5 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33,0 g proteine, 1,50 g sale. (Naturalmente SL)
442) Pecorino Romano: 390 kcal, 32,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 25,0 g proteine, 4,50 g sale.
443) Pecorino SL (confezionato): 385 kcal, 31,5 g grassi, 17,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 4,20 g sale.
444) Emmental (confezionato): 370 kcal, 30,0 g grassi, 19,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 27,0 g proteine, 0,50 g sale.
445) Emmental SL (confezionato): 368 kcal, 29,5 g grassi, 18,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,5 g proteine, 0,55 g sale.
446) Edamer (confezionato): 310 kcal, 24,0 g grassi, 15,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 24,0 g proteine, 1,80 g sale.
447) Edamer SL (confezionato): 308 kcal, 23,5 g grassi, 15,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,5 g proteine, 1,85 g sale.
448) Gorgonzola Dolce: 320 kcal, 27,0 g grassi, 18,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 19,0 g proteine, 1,80 g sale. (Naturalmente povero di lattosio)
449) Gorgonzola SL (certificato): 315 kcal, 26,5 g grassi, 18,0 g grassi saturi, 0,8 g carboidrati, 0,8 g zuccheri, 0 g fibre, 18,5 g proteine, 1,85 g sale.
450) Taleggio: 300 kcal, 25,0 g grassi, 17,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 18,5 g proteine, 2,00 g sale.
451) Taleggio SL (confezionato): 295 kcal, 24,5 g grassi, 16,5 g grassi saturi, 0,9 g carboidrati, 0,9 g zuccheri, 0 g fibre, 18,0 g proteine, 2,10 g sale.
452) Asiago pressato: 310 kcal, 24,0 g grassi, 16,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,0 g proteine, 1,70 g sale.
453) Asiago SL (confezionato): 305 kcal, 23,5 g grassi, 15,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 22,5 g proteine, 1,75 g sale.
454) Fontina DOP: 345 kcal, 27,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,0 g proteine, 1,90 g sale.
455) Sottilette / Formaggio a fette fuso (confezionato): 260 kcal, 18,0 g grassi, 11,5 g grassi saturi, 6,0 g carboidrati, 6,0 g zuccheri, 0 g fibre, 18,0 g proteine, 2,80 g sale.
456) Sottilette SL (confezionato): 255 kcal, 17,5 g grassi, 11,0 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 17,5 g proteine, 2,90 g sale.
457) Yogurt bianco intero (confezionato): 63 kcal, 3,5 g grassi, 2,3 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,4 g proteine, 0,11 g sale.
458) Yogurt bianco intero SL (confezionato): 63 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,4 g proteine, 0,11 g sale.
459) Yogurt greco 0% grassi (confezionato): 55 kcal, 0 g grassi, 0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 10,0 g proteine, 0,10 g sale.
460) Yogurt greco 0% SL (confezionato): 57 kcal, 0 g grassi, 0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,11 g sale
461) Yogurt greco intero (confezionato): 95 kcal, 5,0 g grassi, 3,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,10 g sale.
462) Kefir (confezionato): 50 kcal, 2,0 g grassi, 1,3 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,10 g sale.
463) Kefir SL (confezionato): 50 kcal, 2,0 g grassi, 1,3 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
465) Mozzarella di Bufala Campana DOP (confezionata): 288 kcal, 24,5 g grassi, 17,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 16,5 g proteine, 0,60 g sale.
466) Mozzarella di Bufala SL (confezionata): 285 kcal, 24,0 g grassi, 16,8 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,2 g proteine, 0,65 g sale.
467) Ricotta di Bufala (confezionata): 210 kcal, 17,5 g grassi, 12,0 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 8,5 g proteine, 0,40 g sale.
468) Feta Greca (confezionata): 275 kcal, 23,0 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,5 g proteine, 2,50 g sale.
469) Feta Greca SL (confezionata): 270 kcal, 22,5 g grassi, 15,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,0 g proteine, 2,60 g sale.
470) Caprino fresco (vaccino/caprino) (confezionato): 240 kcal, 20,0 g grassi, 14,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 12,5 g proteine, 0,80 g sale.
471) Caprino fresco SL (confezionato): 235 kcal, 19,5 g grassi, 13,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 12,0 g proteine, 0,85 g sale.
472) Tronchetto di Capra stagionato (confezionato): 295 kcal, 24,0 g grassi, 17,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 18,5 g proteine, 1,50 g sale.
473) Ricotta di pecora (confezionata): 165 kcal, 13,0 g grassi, 9,0 g grassi saturi, 3,8 g carboidrati, 3,8 g zuccheri, 0 g fibre, 9,5 g proteine, 0,45 g sale.
474) Burrata (confezionata): 260 kcal, 23,0 g grassi, 15,5 g grassi saturi, 2,0 g carboidrati, 1,8 g zuccheri, 0 g fibre, 11,5 g proteine, 0,60 g sale.
475) Burrata SL (confezionata): 255 kcal, 22,5 g grassi, 15,0 g grassi saturi, 2,5 g carboidrati, 2,2 g zuccheri, 0 g fibre, 11,0 g proteine, 0,65 g sale.
476) Scamorza bianca (confezionata): 210 kcal, 14,0 g grassi, 9,5 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 19,0 g proteine, 1,20 g sale.
477) Scamorza bianca SL (confezionata): 208 kcal, 13,8 g grassi, 9,2 g grassi saturi, 2,0 g carboidrati, 1,8 g zuccheri, 0 g fibre, 18,5 g proteine, 1,25 g sale.
478) Scamorza affumicata (confezionata): 212 kcal, 14,5 g grassi, 9,8 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 19,5 g proteine, 1,30 g sale.
479) Caciotta vaccina (confezionata): 265 kcal, 21,0 g grassi, 14,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 18,0 g proteine, 1,10 g sale.
480) Caciotta SL (confezionata): 260 kcal, 20,5 g grassi, 14,0 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 17,5 g proteine, 1,15 g sale.
481) Squacquerone (confezionato): 245 kcal, 21,5 g grassi, 15,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 10,5 g proteine, 0,80 g sale.
482) Quark (confezionato): 70 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 12,0 g proteine, 0,10 g sale.
483) Quark SL (confezionato): 70 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 11,5 g proteine, 0,11 g sale.
484) Camembert / Brie (confezionato): 290 kcal, 24,0 g grassi, 16,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 18,0 g proteine, 1,60 g sale.
485) Brie SL (confezionato): 285 kcal, 23,5 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,5 g proteine, 1,65 g sale.
487) Mozzarella Light (confezionata): 165 kcal, 9,0 g grassi, 6,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 19,5 g proteine, 0,80 g sale.
488) Mozzarella Light SL (confezionata): 162 kcal, 8,8 g grassi, 5,8 g grassi saturi, 1,8 g carboidrati, 1,2 g zuccheri, 0 g fibre, 19,0 g proteine, 0,85 g sale.
489) Formaggio spalmabile Light (confezionato): 155 kcal, 11,0 g grassi, 7,5 g grassi saturi, 6,0 g carboidrati, 5,5 g zuccheri, 0 g fibre, 8,0 g proteine, 0,85 g sale.
490) Formaggio spalmabile Light SL (confezionato): 150 kcal, 10,5 g grassi, 7,0 g grassi saturi, 6,5 g carboidrati, 6,0 g zuccheri, 0 g fibre, 7,5 g proteine, 0,90 g sale.
491) Ricotta Light (confezionata): 120 kcal, 8,0 g grassi, 5,5 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,40 g sale.
492) Ricotta Light SL (confezionata): 115 kcal, 7,5 g grassi, 5,0 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 7,5 g proteine, 0,45 g sale.
493) Leerdammer / Formaggio a fette Light (confezionato): 270 kcal, 17,0 g grassi, 11,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 29,0 g proteine, 1,50 g sale.
494) Skyr bianco naturale (confezionato): 65 kcal, 0,2 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 11,5 g proteine, 0,10 g sale. (Simile allo yogurt ma tecnicamente un formaggio fresco).
495) Pasta di Grano Saraceno (confezionati): 345 kcal, 2,5 g grassi, 0,5 g grassi saturi, 67,0 g carboidrati, 1,0 g zuccheri, 4,5 g fibre, 11,0 g proteine, 0,01 g sale.
496) Noodles di frumento (confezionati/secchi): 360 kcal, 1,5 g grassi, 0,3 g grassi saturi, 73,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 12,0 g proteine, 0,50 g sale.
497) Noodles di riso (confezionati/secchi): 350 kcal, 0,5 g grassi, 0,1 g grassi saturi, 80,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,0 g proteine, 0,10 g sale.
498) Ramen precotti in tazza (confezionati - solo pasta): 440 kcal, 18,0 g grassi, 8,5 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 3,50 g sale (alto perchÃ© spesso pre-fritti).
499) Soba (Grano saraceno e frumento): 350 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 14,0 g proteine, 0,60 g sale.
500) Udon freschi (confezionati): 130 kcal, 0,5 g grassi, 0,1 g grassi saturi, 27,0 g carboidrati, 0,5 g zuccheri, 1,0 g fibre, 4,0 g proteine, 0,40 g sale.
501) Shirataki di Konjac (confezionati/in acqua): 10 kcal, 0,0 g grassi, 0,0 g grassi saturi, 0,5 g carboidrati, 0,0 g zuccheri, 3,5 g fibre, 0,1 g proteine, 0,01 g sale.
502) Pasta proteica a base di soia (confezionata): 330 kcal, 6,0 g grassi, 1,0 g grassi saturi, 15,0 g carboidrati, 4,0 g zuccheri, 20,0 g fibre, 45,0 g proteine, 0,02 g sale.
503) Pasta proteica con albume d'uovo (confezionata): 350 kcal, 2,5 g grassi, 0,8 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 6,0 g fibre, 30,0 g proteine, 0,15 g sale.
504) Pasta di farina di lupini (confezionata): 325 kcal, 7,0 g grassi, 1,0 g grassi saturi, 12,0 g carboidrati, 3,0 g zuccheri, 30,0 g fibre, 38,0 g proteine, 0,05 g sale.
505) Fusilli proteici ai piselli e proteine del grano (confezionata): 345 kcal, 3,0 g grassi, 0,5 g grassi saturi, 45,0 g carboidrati, 2,5 g zuccheri, 8,0 g fibre, 32,0 g proteine, 0,10 g sale.
506) Pasta al peperoncino (confezionata): 355 kcal, 1,6 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 13,0 g proteine, 0,02 g sale.
507) Pasta agli spinaci (confezionata): 350 kcal, 1,5 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,2 g zuccheri, 4,0 g fibre, 12,5 g proteine, 0,05 g sale.
508) Pasta al nero di seppia (confezionata): 358 kcal, 1,8 g grassi, 0,4 g grassi saturi, 69,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 14,0 g proteine, 0,50 g sale.
509) Pasta al limone e pepe (confezionata): 352 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,02 g sale.
510) Pasta al tartufo (confezionata): 360 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 13,5 g proteine, 0,10 g sale.
511) Pasta alla barbabietola (confezionata): 350 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 4,0 g zuccheri, 4,0 g fibre, 12,0 g proteine, 0,05 g sale.
512) Pasta alla curcuma e zenzero (confezionata): 355 kcal, 1,7 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,5 g fibre, 12,8 g proteine, 0,02 g sale.
513) Pasta tricolore (pomodoro/spinaci/semola) (confezionata): 353 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,2 g fibre, 12,5 g proteine, 0,03 g sale.
514) Gnocchi di patate surgelati (confezionati): 155 kcal, 0,4 g grassi, 0,1 g grassi saturi, 33,0 g carboidrati, 1,0 g zuccheri, 1,8 g fibre, 3,5 g proteine, 1,00 g sale.
515) Ravioli surgelati ai quattro formaggi (confezionati): 270 kcal, 11,0 g grassi, 6,0 g grassi saturi, 32,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 10,0 g proteine, 1,10 g sale.
516) Tortellini alla carne surgelati (confezionati): 285 kcal, 8,0 g grassi, 3,0 g grassi saturi, 39,0 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 13,0 g proteine, 1,20 g sale.
517) Penne all'arrabbiata surgelate (piatto pronto) (confezionati): 140 kcal, 4,5 g grassi, 0,7 g grassi saturi, 19,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 4,5 g proteine, 0,90 g sale.
518) Tagliatelle ai funghi surgelate (piatto pronto) (confezionati): 155 kcal, 7,0 g grassi, 3,5 g grassi saturi, 17,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 5,0 g proteine, 1,00 g sale.
519) Lasagne alla bolognese surgelate (confezionati): 165 kcal, 8,5 g grassi, 4,2 g grassi saturi, 14,0 g carboidrati, 2,8 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,95 g sale.
520) Cannelloni ricotta e spinaci surgelati (confezionati): 150 kcal, 7,5 g grassi, 4,0 g grassi saturi, 13,0 g carboidrati, 2,5 g zuccheri, 1,8 g fibre, 6,8 g proteine, 0,85 g sale.
521) Pasta di mais viola (confezionata): 355 kcal, 1,8 g grassi, 0,4 g grassi saturi, 76,0 g carboidrati, 0,8 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,01 g sale.
522) Pasta di canapa (confezionata): 345 kcal, 4,0 g grassi, 0,6 g grassi saturi, 60,0 g carboidrati, 2,0 g zuccheri, 9,0 g fibre, 16,0 g proteine, 0,02 g sale.
523) Pasta di teff (confezionata): 340 kcal, 2,2 g grassi, 0,5 g grassi saturi, 68,0 g carboidrati, 1,5 g zuccheri, 7,5 g fibre, 11,0 g proteine, 0,02 g sale.
524) Anelletti siciliani (secca) (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
525) Fregola sarda tostata (secca) (confezionata): 358 kcal, 1,6 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 3,2 g zuccheri, 3,5 g fibre, 12,5 g proteine, 0,02 g sale.
526) SpÃ¤tzle tirolesi agli spinaci (freschi) (confezionati): 180 kcal, 3,5 g grassi, 1,0 g grassi saturi, 30,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 6,0 g proteine, 1,20 g sale.
527) Pane comune (tipo 0): 265 kcal, 1,3 g grassi, 0,3 g grassi saturi, 54,0 g carboidrati, 2,5 g zuccheri, 2,7 g fibre, 8,5 g proteine, 1,50 g sale.
528) Pane di grano duro (tipo Altamura): 275 kcal, 1,5 g grassi, 0,3 g grassi saturi, 56,0 g carboidrati, 2,0 g zuccheri, 3,2 g fibre, 9,5 g proteine, 1,40 g sale.
529) Pane integrale fresco: 245 kcal, 2,0 g grassi, 0,4 g grassi saturi, 46,0 g carboidrati, 2,2 g zuccheri, 6,5 g fibre, 9,0 g proteine, 1,30 g sale.
530) Pane di segale (Nero): 230 kcal, 1,5 g grassi, 0,2 g grassi saturi, 45,0 g carboidrati, 2,0 g zuccheri, 8,0 g fibre, 7,5 g proteine, 1,40 g sale.
531) Pane ai cereali: 270 kcal, 4,5 g grassi, 0,8 g grassi saturi, 48,0 g carboidrati, 2,5 g zuccheri, 5,5 g fibre, 10,0 g proteine, 1,40 g sale.
532) Pane all'olio: 305 kcal, 6,5 g grassi, 1,2 g grassi saturi, 53,0 g carboidrati, 3,0 g zuccheri, 2,5 g fibre, 8,0 g proteine, 1,60 g sale.
533) Pane al latte: 315 kcal, 7,5 g grassi, 4,5 g grassi saturi, 52,0 g carboidrati, 5,5 g zuccheri, 2,2 g fibre, 9,0 g proteine, 1,50 g sale.
534) Pane di mais: 280 kcal, 3,0 g grassi, 0,5 g grassi saturi, 55,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 1,40 g sale.
535) Pane di farro: 260 kcal, 2,2 g grassi, 0,4 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 5,0 g fibre, 10,5 g proteine, 1,35 g sale.
536) Pane azzimo (senza lievito): 365 kcal, 1,2 g grassi, 0,2 g grassi saturi, 77,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 11,0 g proteine, 0,05 g sale.
537) Pane di zucca: 260 kcal, 3,5 g grassi, 0,6 g grassi saturi, 48,0 g carboidrati, 4,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 1,30 g sale.
538) Michetta / Rosetta: 275 kcal, 1,0 g grassi, 0,2 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,55 g sale.
539) Baguette: 285 kcal, 1,2 g grassi, 0,3 g grassi saturi, 59,0 g carboidrati, 3,0 g zuccheri, 2,8 g fibre, 8,5 g proteine, 1,60 g sale.
540) Focaccia liscia (fresca): 310 kcal, 10,0 g grassi, 1,5 g grassi saturi, 48,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 7,5 g proteine, 2,20 g sale.
541) Pan Bauletto Bianco (confezionato): 265 kcal, 3,5 g grassi, 0,8 g grassi saturi, 49,0 g carboidrati, 5,5 g zuccheri, 2,5 g fibre, 8,0 g proteine, 1,30 g sale.
542) Pan Bauletto Integrale (confezionato): 255 kcal, 4,0 g grassi, 0,6 g grassi saturi, 42,0 g carboidrati, 5,0 g zuccheri, 7,5 g fibre, 9,5 g proteine, 1,20 g sale.
543) Pan Bauletto ai Cereali e Semi (confezionato): 285 kcal, 7,5 g grassi, 1,0 g grassi saturi, 41,0 g carboidrati, 4,5 g zuccheri, 6,5 g fibre, 10,5 g proteine, 1,25 g sale.
544) Pane per Tramezzini (senza crosta) (confezionato): 275 kcal, 5,0 g grassi, 1,5 g grassi saturi, 48,0 g carboidrati, 6,0 g zuccheri, 2,2 g fibre, 8,5 g proteine, 1,40 g sale.
545) Pane Americano (Sandwich) (confezionato): 280 kcal, 5,5 g grassi, 2,0 g grassi saturi, 47,0 g carboidrati, 7,0 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,50 g sale.
546) Pane di Segale confezionato (tipo Pumpernickel): 210 kcal, 1,2 g grassi, 0,2 g grassi saturi, 38,0 g carboidrati, 3,5 g zuccheri, 9,5 g fibre, 6,0 g proteine, 1,20 g sale.
547) PancarrÃ© classico (confezionato): 285 kcal, 4,5 g grassi, 1,2 g grassi saturi, 52,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 1,50 g sale.
548) Burger Buns (Pane per Hamburger) (confezionato): 295 kcal, 6,5 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 8,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 1,35 g sale.
549) Hot Dog Rolls (confezionato): 300 kcal, 7,0 g grassi, 2,8 g grassi saturi, 51,0 g carboidrati, 9,0 g zuccheri, 2,3 g fibre, 9,0 g proteine, 1,40 g sale.
550) Piadina Romagnola all'olio (confezionata): 310 kcal, 9,0 g grassi, 1,2 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 7,5 g proteine, 1,80 g sale.
551) Piadina Romagnola allo strutto (confezionata): 340 kcal, 14,0 g grassi, 5,5 g grassi saturi, 46,0 g carboidrati, 1,5 g zuccheri, 2,2 g fibre, 7,0 g proteine, 1,90 g sale.
552) Piadina integrale (confezionata): 290 kcal, 8,5 g grassi, 1,0 g grassi saturi, 44,0 g carboidrati, 2,2 g zuccheri, 6,5 g fibre, 8,5 g proteine, 1,70 g sale.
553) Piadina al farro (confezionata): 300 kcal, 9,5 g grassi, 1,2 g grassi saturi, 46,0 g carboidrati, 1,8 g zuccheri, 5,0 g fibre, 9,0 g proteine, 1,80 g sale.
554) Tortilla di frumento (confezionata): 315 kcal, 8,5 g grassi, 3,5 g grassi saturi, 51,0 g carboidrati, 3,0 g zuccheri, 2,8 g fibre, 8,0 g proteine, 1,90 g sale.
555) Tortilla di mais (messicana): 220 kcal, 3,0 g grassi, 0,5 g grassi saturi, 44,0 g carboidrati, 1,5 g zuccheri, 5,5 g fibre, 5,5 g proteine, 0,20 g sale.
556) Pane Arabo / Pita: 275 kcal, 1,2 g grassi, 0,2 g grassi saturi, 56,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,30 g sale.
557) Pane Naan (confezionato): 310 kcal, 8,5 g grassi, 3,5 g grassi saturi, 50,0 g carboidrati, 4,0 g zuccheri, 2,2 g fibre, 9,0 g proteine, 1,40 g sale.
558) Grissini torinesi (confezionati): 420 kcal, 9,5 g grassi, 1,5 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 11,0 g proteine, 2,20 g sale.
559) Grissini integrali (confezionati): 395 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 3,0 g zuccheri, 9,0 g fibre, 12,0 g proteine, 2,10 g sale.
560) Cracker salati (confezionati): 440 kcal, 14,0 g grassi, 3,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,0 g proteine, 2,80 g sale.
561) Cracker integrali (confezionati): 420 kcal, 12,5 g grassi, 2,0 g grassi saturi, 62,0 g carboidrati, 2,8 g zuccheri, 9,5 g fibre, 11,5 g proteine, 2,30 g sale.
562) Gallette di riso: 385 kcal, 2,8 g grassi, 0,6 g grassi saturi, 81,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 8,0 g proteine, 0,10 g sale.
563) Gallette di mais: 375 kcal, 1,5 g grassi, 0,3 g grassi saturi, 82,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,0 g proteine, 0,40 g sale.
564) Fette biscottate classiche: 390 kcal, 5,5 g grassi, 2,5 g grassi saturi, 72,0 g carboidrati, 7,0 g zuccheri, 4,5 g fibre, 11,5 g proteine, 1,40 g sale.
565) Taralli pugliesi all'olio (confezionati): 460 kcal, 19,0 g grassi, 2,8 g grassi saturi, 62,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 2,50 g sale.
566) Pane croccante (tipo Wasa): 335 kcal, 1,5 g grassi, 0,3 g grassi saturi, 62,0 g carboidrati, 1,5 g zuccheri, 19,0 g fibre, 10,0 g proteine, 1,20 g sale.
567) Cracker non salati in superficie: 435 kcal, 13,0 g grassi, 1,8 g grassi saturi, 69,0 g carboidrati, 2,2 g zuccheri, 3,2 g fibre, 10,0 g proteine, 1,40 g sale.
568) Cracker al riso suffiato: 410 kcal, 8,5 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 8,5 g proteine, 1,80 g sale.
569) Cracker alla soia: 425 kcal, 14,5 g grassi, 2,1 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 5,5 g fibre, 14,0 g proteine, 2,10 g sale.
570) Cracker senza glutine (riso/mais): 450 kcal, 15,0 g grassi, 1,8 g grassi saturi, 75,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 4,0 g proteine, 2,50 g sale.
571) Cracker ai cereali antichi (quinoa/semi di chia): 438 kcal, 16,0 g grassi, 2,0 g grassi saturi, 59,0 g carboidrati, 3,0 g zuccheri, 7,0 g fibre, 11,5 g proteine, 2,00 g sale.
572) Sfogliatine croccanti al rosmarino: 460 kcal, 18,0 g grassi, 2,5 g grassi saturi, 65,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 9,0 g proteine, 2,40 g sale.
573) Cracker con farina di ceci: 415 kcal, 12,0 g grassi, 1,5 g grassi saturi, 54,0 g carboidrati, 2,2 g zuccheri, 9,0 g fibre, 18,0 g proteine, 1,90 g sale.
574) Gallette di farro: 370 kcal, 2,5 g grassi, 0,4 g grassi saturi, 72,0 g carboidrati, 1,0 g zuccheri, 7,0 g fibre, 12,0 g proteine, 0,05 g sale.
575) Gallette di grano saraceno: 380 kcal, 3,0 g grassi, 0,6 g grassi saturi, 75,0 g carboidrati, 0,8 g zuccheri, 4,5 g fibre, 11,5 g proteine, 0,02 g sale.
576) Gallette di quinoa: 390 kcal, 5,5 g grassi, 0,7 g grassi saturi, 70,0 g carboidrati, 1,2 g zuccheri, 6,0 g fibre, 13,0 g proteine, 0,10 g sale.
577) Gallette di legumi (lenticchie/piselli): 345 kcal, 2,0 g grassi, 0,3 g grassi saturi, 55,0 g carboidrati, 2,0 g zuccheri, 10,0 g fibre, 22,0 g proteine, 0,80 g sale.
578) Pani di segale croccanti (tipo Svedese sottile): 340 kcal, 1,5 g grassi, 0,3 g grassi saturi, 64,0 g carboidrati, 1,5 g zuccheri, 20,0 g fibre, 9,5 g proteine, 1,25 g sale.
579) Mini gallette di mais al formaggio (snack): 465 kcal, 18,0 g grassi, 2,5 g grassi saturi, 68,0 g carboidrati, 3,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 2,20 g sale.
580) Schiacciatine mantovane (secche): 455 kcal, 16,0 g grassi, 2,3 g grassi saturi, 66,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 10,0 g proteine, 2,60 g sale.
581) Bruschette chips (aglio e olio): 480 kcal, 21,0 g grassi, 3,0 g grassi saturi, 62,0 g carboidrati, 3,5 g zuccheri, 4,0 g fibre, 8,5 g proteine, 2,10 g sale.
582) Tarallini al peperoncino: 465 kcal, 20,0 g grassi, 2,9 g grassi saturi, 60,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 9,0 g proteine, 2,40 g sale.
583) Tarallini ai semi di finocchio: 462 kcal, 19,5 g grassi, 2,8 g grassi saturi, 61,0 g carboidrati, 1,2 g zuccheri, 3,2 g fibre, 9,2 g proteine, 2,30 g sale.
584) Tarallini integrali: 445 kcal, 18,0 g grassi, 2,5 g grassi saturi, 56,0 g carboidrati, 2,0 g zuccheri, 8,0 g fibre, 11,0 g proteine, 2,10 g sale.
585) Pretzel / Brezel secchi: 380 kcal, 3,5 g grassi, 1,5 g grassi saturi, 75,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,0 g proteine, 3,50 g sale.
586) Crostoni di pane per zuppa (fritti): 520 kcal, 28,0 g grassi, 4,5 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 3,5 g fibre, 7,5 g proteine, 2,00 g sale.
587) Fette biscottate integrali: 375 kcal, 5,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 6,5 g zuccheri, 11,0 g fibre, 12,5 g proteine, 1,20 g sale.
588) Fette biscottate ai cereali: 395 kcal, 7,0 g grassi, 1,5 g grassi saturi, 67,0 g carboidrati, 7,5 g zuccheri, 6,5 g fibre, 12,0 g proteine, 1,30 g sale.
589) Fette biscottate malto d'orzo: 405 kcal, 6,5 g grassi, 2,8 g grassi saturi, 73,0 g carboidrati, 9,0 g zuccheri, 4,0 g fibre, 11,0 g proteine, 1,15 g sale.
590) Crostini dorati (confezionati): 430 kcal, 12,0 g grassi, 1,8 g grassi saturi, 68,0 g carboidrati, 4,5 g zuccheri, 4,0 g fibre, 11,5 g proteine, 2,00 g sale.
591) Pan fette senza glutine (tostato): 390 kcal, 8,0 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 5,0 g zuccheri, 5,0 g fibre, 3,5 g proteine, 1,60 g sale.
592) Grissini al sesamo: 435 kcal, 13,0 g grassi, 2,0 g grassi saturi, 64,0 g carboidrati, 3,0 g zuccheri, 4,5 g fibre, 12,5 g proteine, 2,20 g sale.
593) Grissini con farina di mais: 415 kcal, 9,0 g grassi, 1,3 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 10,0 g proteine, 2,10 g sale.
594) Grissini ricoperti di cioccolato (snack): 510 kcal, 25,0 g grassi, 14,0 g grassi saturi, 62,0 g carboidrati, 35,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,60 g sale.
595) Grissini al formaggio: 450 kcal, 16,0 g grassi, 6,0 g grassi saturi, 61,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 13,0 g proteine, 2,50 g sale.
596) Cornflakes classici (confezionati): 380 kcal, 0,9 g grassi, 0,2 g grassi saturi, 84,0 g carboidrati, 8,0 g zuccheri, 3,0 g fibre, 7,0 g proteine, 1,80 g sale.
597) Cornflakes integrali (confezionati): 365 kcal, 2,0 g grassi, 0,4 g grassi saturi, 75,0 g carboidrati, 6,0 g zuccheri, 9,0 g fibre, 8,5 g proteine, 1,20 g sale.
598) Bastoncini di crusca di frumento (confezionati): 335 kcal, 3,5 g grassi, 0,6 g grassi saturi, 48,0 g carboidrati, 14,0 g zuccheri, 27,0 g fibre, 14,0 g proteine, 0,90 g sale.
599) Riso soffiato semplice (confezionati): 385 kcal, 1,0 g grassi, 0,2 g grassi saturi, 86,0 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,02 g sale.
600) Anellini di avena al miele (confezionati): 395 kcal, 5,0 g grassi, 1,0 g grassi saturi, 75,0 g carboidrati, 25,0 g zuccheri, 6,0 g fibre, 9,0 g proteine, 1,00 g sale.
601) Palline di riso e mais al cioccolato (confezionati): 390 kcal, 4,0 g grassi, 2,0 g grassi saturi, 78,0 g carboidrati, 28,0 g zuccheri, 4,5 g fibre, 7,5 g proteine, 0,80 g sale.
602) Muesli croccante (Granola) classico (confezionati): 450 kcal, 16,0 g grassi, 7,0 g grassi saturi, 63,0 g carboidrati, 22,0 g zuccheri, 7,0 g fibre, 8,5 g proteine, 0,10 g sale.
603) Muesli croccante al cioccolato (confezionati): 470 kcal, 19,0 g grassi, 9,0 g grassi saturi, 61,0 g carboidrati, 25,0 g zuccheri, 7,5 g fibre, 9,0 g proteine, 0,15 g sale.
604) Muesli classico (non croccante) con frutta secca (confezionati): 370 kcal, 8,0 g grassi, 1,5 g grassi saturi, 60,0 g carboidrati, 18,0 g zuccheri, 9,5 g fibre, 10,0 g proteine, 0,05 g sale.
605) Fiocchi d'avena integrali (confezionati): 375 kcal, 7,0 g grassi, 1,3 g grassi saturi, 59,0 g carboidrati, 1,0 g zuccheri, 10,0 g fibre, 13,5 g proteine, 0,01 g sale.
606) Fiocchi di farro (confezionati): 345 kcal, 2,5 g grassi, 0,4 g grassi saturi, 65,0 g carboidrati, 1,5 g zuccheri, 8,0 g fibre, 12,0 g proteine, 0,01 g sale.
607) Riso Arborio/Carnaroli (confezionati): 345 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
608) Riso Basmati (confezionati): 350 kcal, 0,5 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,2 g zuccheri, 1,2 g fibre, 8,5 g proteine, 0,01 g sale.
609) Riso Integrale (confezionati): 340 kcal, 2,5 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 7,5 g proteine, 0,01 g sale.
610) Riso Rosso (confezionati): 355 kcal, 2,5 g grassi, 0,5 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,01 g sale.
611) Riso Venere (Nero) (confezionati): 350 kcal, 2,2 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 0,7 g zuccheri, 4,0 g fibre, 9,0 g proteine, 0,01 g sale.
612) Riso Parboiled (confezionati): 352 kcal, 0,8 g grassi, 0,2 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,01 g sale.
613) Quinoa (a crudo) (confezionati): 368 kcal, 6,0 g grassi, 0,7 g grassi saturi, 64,0 g carboidrati, 1,5 g zuccheri, 7,0 g fibre, 14,0 g proteine, 0,01 g sale.
614) Bulgur (Grano spezzato) (confezionati): 342 kcal, 1,3 g grassi, 0,2 g grassi saturi, 63,0 g carboidrati, 0,4 g zuccheri, 12,5 g fibre, 12,0 g proteine, 0,01 g sale.
615) Cous cous di semola (a crudo) (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 2,0 g zuccheri, 3,5 g fibre, 12,5 g proteine, 0,01 g sale.
616) Cous cous integrale (a crudo) (confezionati): 348 kcal, 2,2 g grassi, 0,5 g grassi saturi, 64,0 g carboidrati, 1,8 g zuccheri, 8,5 g fibre, 13,0 g proteine, 0,01 g sale.
617) Miglio (a crudo) (confezionati): 360 kcal, 3,9 g grassi, 0,6 g grassi saturi, 69,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 11,0 g proteine, 0,01 g sale.
618) Orzo perlato (a crudo) (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 9,0 g fibre, 10,0 g proteine, 0,01 g sale.
619) Grano saraceno in chicchi (confezionati): 343 kcal, 3,4 g grassi, 0,7 g grassi saturi, 62,0 g carboidrati, 0,0 g zuccheri, 10,0 g fibre, 13,0 g proteine, 0,01 g sale.
620) Risotto alla milanese (preparato secco busta): 360 kcal, 3,5 g grassi, 1,8 g grassi saturi, 72,0 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 8,0 g proteine, 2,50 g sale.
621) Paella surgelata (piatto pronto) (confezionati): 145 kcal, 5,5 g grassi, 1,2 g grassi saturi, 17,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 6,5 g proteine, 1,10 g sale.
622) Riso con verdure surgelato (da saltare) (confezionati): 120 kcal, 2,5 g grassi, 0,4 g grassi saturi, 20,0 g carboidrati, 1,8 g zuccheri, 2,2 g fibre, 3,0 g proteine, 0,80 g sale.
623) Riso Vialone Nano (confezionato): 348 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,2 g proteine, 0,01 g sale.
624) Riso Roma (confezionato): 350 kcal, 0,6 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
625) Riso Ribe (confezionati): 352 kcal, 0,7 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
626) Riso Originario (per minestre/dolci) (confezionati): 345 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,5 g carboidrati, 0,3 g zuccheri, 0,8 g fibre, 6,8 g proteine, 0,01 g sale.
627) Riso Thai Jasmine (confezionati): 355 kcal, 0,5 g grassi, 0,1 g grassi saturi, 80,0 g carboidrati, 0,2 g zuccheri, 1,0 g fibre, 7,5 g proteine, 0,01 g sale.
628) Riso Integrale Selvaggio (Zizania aquatica) (confezionati): 357 kcal, 1,1 g grassi, 0,2 g grassi saturi, 72,0 g carboidrati, 0,5 g zuccheri, 6,0 g fibre, 14,5 g proteine, 0,01 g sale.
629) Riso Glutinoso (per cucina asiatica) (confezionati): 365 kcal, 0,6 g grassi, 0,1 g grassi saturi, 82,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,5 g proteine, 0,01 g sale.
630) Riso Sushi (Arborio a chicco corto) (confezionati): 350 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,5 g proteine, 0,01 g sale.
631) Riso Ermes (Rosso integrale aromatico) (confezionati): 352 kcal, 2,3 g grassi, 0,5 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 3,8 g fibre, 8,5 g proteine, 0,01 g sale.
632) Riso Basmati cotto a vapore (in busta microondabile) (confezionati): 155 kcal, 2,5 g grassi, 0,3 g grassi saturi, 29,0 g carboidrati, 0,2 g zuccheri, 1,2 g fibre, 3,5 g proteine, 0,40 g sale.
633) Riso integrale e Quinoa cotto (in busta) (confezionati): 165 kcal, 3,5 g grassi, 0,5 g grassi saturi, 28,0 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 4,5 g proteine, 0,50 g sale.
634) Riso per insalate (Pezzi precotti/3 minuti) (confezionati): 350 kcal, 0,8 g grassi, 0,2 g grassi saturi, 77,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 7,5 g proteine, 0,01 g sale.
635) Tagliatelle di riso integrale (confezionate): 350 kcal, 2,8 g grassi, 0,6 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,05 g sale.
636) Vermicelli di riso (confezionati): 355 kcal, 0,5 g grassi, 0,1 g grassi saturi, 81,0 g carboidrati, 0,2 g zuccheri, 1,0 g fibre, 6,0 g proteine, 0,10 g sale.
637) Penne di riso nero (confezionate): 345 kcal, 2,2 g grassi, 0,5 g grassi saturi, 71,0 g carboidrati, 0,7 g zuccheri, 4,5 g fibre, 8,0 g proteine, 0,01 g sale.
638) Mix 5 cereali (riso, farro, orzo, avena, segale) (confezionati): 350 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 1,2 g zuccheri, 7,0 g fibre, 11,5 g proteine, 0,01 g sale.
639) Latte intero (confezionato): 64 kcal, 3,6 g grassi, 2,3 g grassi saturi, 4,8 g carboidrati, 4,8 g zuccheri, 0 g fibre, 3,3 g proteine, 0,10 g sale.
640) Latte intero SL (confezionato): 64 kcal, 3,6 g grassi, 2,3 g grassi saturi, 4,9 g carboidrati, 4,9 g zuccheri, 0 g fibre, 3,3 g proteine, 0,10 g sale.
641) Latte parzialmente scremato (confezionato): 46 kcal, 1,6 g grassi, 1,0 g grassi saturi, 4,9 g carboidrati, 4,9 g zuccheri, 0 g fibre, 3,4 g proteine, 0,10 g sale.
642) Latte parzialmente scremato SL (confezionato): 46 kcal, 1,6 g grassi, 1,0 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,4 g proteine, 0,10 g sale.
643) Latte scremato (confezionato): 34 kcal, 0,2 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
644) Latte scremato SL (confezionato): 34 kcal, 0,2 g grassi, 0,1 g grassi saturi, 5,1 g carboidrati, 5,1 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
645) Panna da cucina (confezionata): 220 kcal, 21,5 g grassi, 14,0 g grassi saturi, 3,8 g carboidrati, 3,5 g zuccheri, 0 g fibre, 3,0 g proteine, 0,10 g sale.
646) Panna da cucina SL (confezionata): 218 kcal, 21,5 g grassi, 14,0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 3,0 g proteine, 0,10 g sale.
647) Besciamella pronta (confezionata): 160 kcal, 10,0 g grassi, 6,5 g grassi saturi, 13,0 g carboidrati, 4,5 g zuccheri, 0,5 g fibre, 4,5 g proteine, 0,80 g sale.
648) Besciamella pronta SL (confezionata): 155 kcal, 9,5 g grassi, 6,0 g grassi saturi, 14,0 g carboidrati, 5,0 g zuccheri, 0,5 g fibre, 4,2 g proteine, 0,85 g sale.
649) Yogurt greco alla frutta (confezionato): 110 kcal, 4,0 g grassi, 2,8 g grassi saturi, 12,0 g carboidrati, 11,0 g zuccheri, 0,5 g fibre, 7,5 g proteine, 0,12 g sale.
650) Yogurt greco alla frutta SL (confezionato): 108 kcal, 4,0 g grassi, 2,8 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0,5 g fibre, 7,0 g proteine, 0,12 g sale.
651) Yogurt da bere (confezionato): 75 kcal, 1,5 g grassi, 1,0 g grassi saturi, 12,0 g carboidrati, 11,5 g zuccheri, 0 g fibre, 2,8 g proteine, 0,11 g sale.
652) Yogurt da bere SL (confezionato): 75 kcal, 1,5 g grassi, 1,0 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0 g fibre, 2,8 g proteine, 0,11 g sale.
653) Fontal (confezionato): 340 kcal, 26,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 1,60 g sale.
654) Fontal SL (confezionato): 335 kcal, 25,5 g grassi, 17,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,65 g sale.
655) Montasio DOP: 370 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 25,0 g proteine, 1,70 g sale.
656) Puzzone di Moena: 350 kcal, 28,0 g grassi, 19,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,90 g sale.
657) Provolone Dolce (confezionato): 365 kcal, 28,5 g grassi, 19,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 2,00 g sale.
658) Provolone Dolce SL (confezionato): 360 kcal, 28,0 g grassi, 18,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 25,0 g proteine, 2,10 g sale.
659) Provolone Piccante: 375 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 26,0 g proteine, 2,50 g sale.
660) Cheddar (confezionato): 400 kcal, 33,0 g grassi, 21,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,0 g proteine, 1,80 g sale.
661) Cheddar SL (confezionato): 395 kcal, 32,5 g grassi, 20,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,85 g sale.
662) Gouda (confezionato): 350 kcal, 27,0 g grassi, 18,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,0 g proteine, 1,90 g sale.
663) Gouda SL (confezionato): 345 kcal, 26,5 g grassi, 17,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,95 g sale.
664) Bra Duro DOP: 375 kcal, 29,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 28,0 g proteine, 2,20 g sale.
665) Castelmagno DOP: 380 kcal, 30,0 g grassi, 21,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 24,0 g proteine, 2,00 g sale.
666) Primo Sale (confezionato): 245 kcal, 19,0 g grassi, 13,0 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 16,5 g proteine, 1,30 g sale.
667) Primo Sale SL (confezionato): 240 kcal, 18,5 g grassi, 12,5 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 16,0 g proteine, 1,35 g sale.
668) Tomino da piastra (confezionato): 280 kcal, 23,0 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,0 g proteine, 1,10 g sale.
669) Tomino da piastra SL (confezionato): 275 kcal, 22,5 g grassi, 15,5 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,5 g proteine, 1,15 g sale.
670) Formaggino classico (confezionato): 230 kcal, 17,0 g grassi, 11,0 g grassi saturi, 6,0 g carboidrati, 6,0 g zuccheri, 0 g fibre, 13,0 g proteine, 2,20 g sale.
671) Formaggino SL (confezionato): 225 kcal, 16,5 g grassi, 10,5 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 12,5 g proteine, 2,30 g sale.
672) Giuncata (fresca): 180 kcal, 14,0 g grassi, 9,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 11,0 g proteine, 0,60 g sale.
673) Robiola vaccina (confezionata): 310 kcal, 30,0 g grassi, 21,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 8,5 g proteine, 0,80 g sale.
674) Robiola SL (confezionata): 305 kcal, 29,5 g grassi, 20,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,85 g sale.
675) Yogurt greco ai cereali (confezionato): 120 kcal, 3,5 g grassi, 2,0 g grassi saturi, 14,0 g carboidrati, 11,0 g zuccheri, 1,0 g fibre, 7,5 g proteine, 0,15 g sale.
676) Yogurt greco ai cereali SL (confezionato): 118 kcal, 3,5 g grassi, 2,0 g grassi saturi, 15,0 g carboidrati, 13,0 g zuccheri, 1,0 g fibre, 7,2 g proteine, 0,16 g sale.
677) Yogurt greco al caffÃ¨ (confezionato): 105 kcal, 4,0 g grassi, 2,8 g grassi saturi, 10,0 g carboidrati, 9,5 g zuccheri, 0 g fibre, 7,0 g proteine, 0,12 g sale.
678) Yogurt greco al caffÃ¨ SL (confezionato): 105 kcal, 4,0 g grassi, 2,8 g grassi saturi, 11,0 g carboidrati, 10,5 g zuccheri, 0 g fibre, 7,0 g proteine, 0,12 g sale.
679) Yogurt bifidus bianco (confezionato): 65 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
680) Yogurt bifidus bianco SL (confezionato): 65 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,5 g carboidrati, 5,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
681) Bitto DOP (formaggio valtellinese): 395 kcal, 32 g grassi, 22 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 26 g proteine, 1,80 g sale.
682) Bitto SL (confezionato): 390 kcal, 31,5 g grassi, 21,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 1,85 g sale.
683) Caciocavallo Silano DOP: 438 kcal, 34 g grassi, 22 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31 g proteine, 2,00 g sale.
684) Caciocavallo SL (confezionato): 432 kcal, 33,5 g grassi, 21,5 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 30,5 g proteine, 2,10 g sale.
685) Casatella Trevigiana DOP: 246 kcal, 20 g grassi, 14 g grassi saturi, 2,8 g carboidrati, 2,8 g zuccheri, 0 g fibre, 14 g proteine, 0,80 g sale.
686) Casatella SL (confezionata): 242 kcal, 19,5 g grassi, 13,5 g grassi saturi, 3,2 g carboidrati, 3,2 g zuccheri, 0 g fibre, 13,5 g proteine, 0,85 g sale.
687) Piave DOP (Vecchio): 450 kcal, 35 g grassi, 24 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33 g proteine, 1,90 g sale.
688) Piave SL (confezionato): 445 kcal, 34,5 g grassi, 23,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 32,5 g proteine, 1,95 g sale.
689) Quartirolo Lombardo DOP: 295 kcal, 25 g grassi, 17 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 17 g proteine, 1,50 g sale.
690) Quartirolo SL (confezionato): 290 kcal, 24,5 g grassi, 16,5 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 16,5 g proteine, 1,55 g sale.
691) Ragusano DOP: 390 kcal, 31 g grassi, 21 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 28 g proteine, 2,20 g sale.
692) Ragusano SL (confezionato): 385 kcal, 30,5 g grassi, 20,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 27,5 g proteine, 2,25 g sale.
693) Bra DOP (Tenero): 345 kcal, 27 g grassi, 18 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24 g proteine, 1,60 g sale.
694) Bra SL (confezionato): 340 kcal, 26,5 g grassi, 17,5 g grassi saturi, 1,2 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,65 g sale.
695) Roquefort (erborinato francese): 369 kcal, 30,6 g grassi, 19,5 g grassi saturi, 2,0 g carboidrati, 0 g zuccheri, 0 g fibre, 21,5 g proteine, 3,50 g sale.
696) Roquefort SL (certificato): 365 kcal, 30,0 g grassi, 19,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 21,0 g proteine, 3,60 g sale.
697) Le GruyÃ¨re (Groviera svizzera): 413 kcal, 32,3 g grassi, 19 g grassi saturi, 0,4 g carboidrati, 0,1 g zuccheri, 0 g fibre, 29,8 g proteine, 1,50 g sale.
698) Le GruyÃ¨re SL (confezionato): 410 kcal, 32,0 g grassi, 18,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 29,0 g proteine, 1,55 g sale.
699) Manchego (pecora spagnolo): 420 kcal, 35,5 g grassi, 23,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 1,80 g sale.
700) Manchego SL (confezionato): 415 kcal, 35,0 g grassi, 23,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,85 g sale.
701) Halloumi (da griglia): 320 kcal, 24,0 g grassi, 16,0 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 22,0 g proteine, 2,80 g sale.
702) Halloumi SL (confezionato): 315 kcal, 23,5 g grassi, 15,5 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 21,5 g proteine, 2,90 g sale.
703) Caciotta di Capra stagionata: 398 kcal, 32,0 g grassi, 22,0 g grassi saturi, 0,9 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,0 g proteine, 1,60 g sale.
704) Caciotta di Capra SL (confezionata): 392 kcal, 31,5 g grassi, 21,5 g grassi saturi, 1,4 g carboidrati, 1,0 g zuccheri, 0 g fibre, 25,5 g proteine, 1,65 g sale.
705) Cacioricotta: 280 kcal, 22,0 g grassi, 15,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 17,0 g proteine, 2,50 g sale.
706) Cacioricotta SL (confezionata): 275 kcal, 21,5 g grassi, 14,5 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 16,5 g proteine, 2,60 g sale.
707) Ricotta Salata: 290 kcal, 23,0 g grassi, 16,0 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 18,0 g proteine, 4,00 g sale.
708) Ricotta Salata SL (confezionata): 285 kcal, 22,5 g grassi, 15,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 17,5 g proteine, 4,10 g sale.
709) Fiocchi di latte alle verdure: 95 kcal, 4,2 g grassi, 2,8 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0,5 g fibre, 10,9 g proteine, 0,80 g sale.
710) Fiocchi di latte alle verdure SL (confezionati): 92 kcal, 4,0 g grassi, 2,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0,5 g fibre, 10,5 g proteine, 0,85 g sale.
711) Mousse di formaggio fresco Light: 140 kcal, 8,0 g grassi, 5,5 g grassi saturi, 6,5 g carboidrati, 6,0 g zuccheri, 0 g fibre, 9,5 g proteine, 0,80 g sale.
712) Mousse di formaggio fresco Light SL (confezionata): 135 kcal, 7,5 g grassi, 5,0 g grassi saturi, 7,0 g carboidrati, 6,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,85 g sale.
713) Yogurt al malto e miele (confezionato): 110 kcal, 3,2 g grassi, 2,1 g grassi saturi, 16,0 g carboidrati, 15,5 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
714) Yogurt al malto e miele SL (confezionato): 110 kcal, 3,2 g grassi, 2,1 g grassi saturi, 17,0 g carboidrati, 16,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,13 g sale.
715) Kefir aromatizzato alla fragola (confezionato): 85 kcal, 1,5 g grassi, 1,0 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0,2 g fibre, 3,2 g proteine, 0,10 g sale.
716) Kefir alla fragola SL (confezionato): 85 kcal, 1,5 g grassi, 1,0 g grassi saturi, 14,0 g carboidrati, 13,5 g zuccheri, 0,2 g fibre, 3,0 g proteine, 0,11 g sale.
717) Budino al cioccolato (confezionato): 130 kcal, 3,5 g grassi, 2,3 g grassi saturi, 21,0 g carboidrati, 18,0 g zuccheri, 0,8 g fibre, 3,5 g proteine, 0,15 g sale.
718) Budino al cioccolato SL (confezionato): 125 kcal, 3,2 g grassi, 2,1 g grassi saturi, 22,0 g carboidrati, 19,0 g zuccheri, 0,8 g fibre, 3,3 g proteine, 0,16 g sale.
719) Budino alla vaniglia (confezionato): 115 kcal, 3,0 g grassi, 2,0 g grassi saturi, 19,0 g carboidrati, 16,0 g zuccheri, 0 g fibre, 3,2 g proteine, 0,14 g sale.
720) Budino alla vaniglia SL (confezionato): 112 kcal, 2,8 g grassi, 1,8 g grassi saturi, 20,0 g carboidrati, 17,5 g zuccheri, 0 g fibre, 3,0 g proteine, 0,15 g sale.
721) Mousse al latte (confezionata): 160 kcal, 10,0 g grassi, 7,0 g grassi saturi, 14,0 g carboidrati, 13,0 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
722) Mousse al latte SL (confezionata): 158 kcal, 9,8 g grassi, 6,8 g grassi saturi, 15,0 g carboidrati, 14,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,13 g sale.
723) Panna spray (confezionata): 260 kcal, 25,0 g grassi, 17,0 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 2,2 g proteine, 0,10 g sale.
724) Panna spray SL (confezionata): 255 kcal, 24,5 g grassi, 16,5 g grassi saturi, 8,0 g carboidrati, 8,0 g zuccheri, 0 g fibre, 2,0 g proteine, 0,10 g sale.
725) Budino proteico al cioccolato (confezionato): 80 kcal, 1,5 g grassi, 1,0 g grassi saturi, 6,0 g carboidrati, 4,5 g zuccheri, 0,5 g fibre, 10,0 g proteine, 0,15 g sale.
726) Budino proteico al cioccolato SL (confezionato): 80 kcal, 1,5 g grassi, 1,0 g grassi saturi, 6,5 g carboidrati, 4,8 g zuccheri, 0,5 g fibre, 10,0 g proteine, 0,15 g sale.
727) Budino proteico alla vaniglia (confezionato): 75 kcal, 1,2 g grassi, 0,8 g grassi saturi, 5,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,14 g sale.
728) Budino proteico al caramello SL (confezionato): 78 kcal, 1,4 g grassi, 0,9 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 0 g fibre, 10,0 g proteine, 0,15 g sale.
729) Bevanda proteica al latte (Milkshake) (confezionata): 60 kcal, 0,8 g grassi, 0,5 g grassi saturi, 5,0 g carboidrati, 4,8 g zuccheri, 0 g fibre, 8,0 g proteine, 0,10 g sale.
730) Bevanda proteica al latte SL (confezionata): 60 kcal, 0,8 g grassi, 0,5 g grassi saturi, 5,2 g carboidrati, 5,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,11 g sale.
731) Latte di capra intero (confezionato): 69 kcal, 4,1 g grassi, 2,7 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,12 g sale.
732) Latte di capra parzialmente scremato (confezionato): 48 kcal, 1,8 g grassi, 1,2 g grassi saturi, 4,6 g carboidrati, 4,6 g zuccheri, 0 g fibre, 3,4 g proteine, 0,12 g sale.
733) Latte di pecora (fresco/confezionato): 108 kcal, 7,0 g grassi, 4,8 g grassi saturi, 5,4 g carboidrati, 5,4 g zuccheri, 0 g fibre, 6,0 g proteine, 0,15 g sale.
734) Latte condensato zuccherato (confezionato): 320 kcal, 8,0 g grassi, 5,5 g grassi saturi, 55,0 g carboidrati, 55,0 g zuccheri, 0 g fibre, 7,5 g proteine, 0,25 g sale.
735) Latte condensato SL (confezionato): 315 kcal, 8,0 g grassi, 5,5 g grassi saturi, 56,0 g carboidrati, 56,0 g zuccheri, 0 g fibre, 7,2 g proteine, 0,26 g sale.
736) Latte evaporato (non zuccherato) (confezionato): 135 kcal, 7,5 g grassi, 5,0 g grassi saturi, 10,0 g carboidrati, 10,0 g zuccheri, 0 g fibre, 7,0 g proteine, 0,20 g sale.
737) Yogurt di capra bianco (confezionato): 72 kcal, 4,2 g grassi, 2,8 g grassi saturi, 4,2 g carboidrati, 4,2 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
738) Labneh (formaggio di yogurt): 160 kcal, 12,0 g grassi, 8,0 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,5 g proteine, 0,80 g sale.
739) Formaggio spalmabile alle erbe (confezionato): 235 kcal, 21,5 g grassi, 14,5 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 0,5 g fibre, 5,5 g proteine, 1,10 g sale.
740) Formaggio spalmabile alle erbe SL (confezionato): 230 kcal, 21,0 g grassi, 14,0 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0,5 g fibre, 5,2 g proteine, 1,15 g sale.
741) Mousse di formaggio fresco (confezionata): 250 kcal, 23,0 g grassi, 16,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 6,5 g proteine, 0,90 g sale.
742) Tonno all'olio di oliva sgocciolato (confezionati): 190 kcal, 10,0 g grassi, 1,6 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 25,0 g proteine, 1,10 g sale.
743) Tonno al naturale sgocciolato (confezionati): 102 kcal, 0,6 g grassi, 0,1 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 24,0 g proteine, 1,20 g sale.
744) Sgombro all'olio di oliva sgocciolato (confezionati): 210 kcal, 13,5 g grassi, 3,0 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 22,0 g proteine, 1,20 g sale.
745) Sardine sott'olio sgocciolate (confezionati): 208 kcal, 11,5 g grassi, 2,8 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 25,0 g proteine, 1,30 g sale.
746) Acciughe sott'olio sgocciolate (confezionati): 210 kcal, 10,0 g grassi, 2,2 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 28,0 g proteine, 12,0 g sale.
747) Pomodoro da insalata: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
748) Pomodorino Ciliegino: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
749) Zucchina scura: 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
750) Melanzana: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 1,0 g proteine, 0,01 g sale.
751) Peperone Rosso: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 2,1 g fibre, 1,0 g proteine, 0,01 g sale.
752) Peperone Giallo: 27 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,4 g carboidrati, 4,0 g zuccheri, 1,9 g fibre, 1,0 g proteine, 0,01 g sale.
753) Peperone Verde: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,6 g carboidrati, 2,4 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,01 g sale.
754) Cetriolo: 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,7 g zuccheri, 0,5 g fibre, 0,7 g proteine, 0,01 g sale.
755) Carota: 41 kcal, 0,2 g grassi, 0,0 g grassi saturi, 9,6 g carboidrati, 4,7 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,07 g sale.
756) Zucca Gialla: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
757) Rapanello: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,9 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,04 g sale.
758) Lattuga Romana: 17 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 1,2 g proteine, 0,02 g sale.
759) Iceberg: 14 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,03 g sale.
760) Spinaci freschi: 23 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 0,4 g zuccheri, 2,2 g fibre, 2,9 g proteine, 0,08 g sale.
761) Rucola: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,7 g carboidrati, 2,0 g zuccheri, 1,6 g fibre, 2,6 g proteine, 0,03 g sale.
762) Bietola da coste: 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,20 g sale.
763) Radicchio Rosso: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 0,6 g zuccheri, 0,9 g fibre, 1,4 g proteine, 0,01 g sale.
764) Indivia Belga: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
765) Scarola: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 0,3 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,02 g sale.
766) Cavolo Nero: 49 kcal, 0,9 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 2,3 g zuccheri, 3,6 g fibre, 4,3 g proteine, 0,04 g sale.
767) Cicoria: 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 0,7 g zuccheri, 4,0 g fibre, 1,7 g proteine, 0,04 g sale.
768) Broccolo: 34 kcal, 0,4 g grassi, 0,0 g grassi saturi, 6,6 g carboidrati, 1,7 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,03 g sale.
769) Cavolfiore: 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,9 g zuccheri, 2,0 g fibre, 1,9 g proteine, 0,03 g sale.
770) Cavolini di Bruxelles: 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 9,0 g carboidrati, 2,2 g zuccheri, 3,8 g fibre, 3,4 g proteine, 0,02 g sale.
771) Verza: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,02 g sale.
772) Cavolo Cappuccio: 25 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,8 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 1,3 g proteine, 0,02 g sale.
773) Cime di Rapa: 22 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,0 g proteine, 0,03 g sale.
774) Cavolo Romanesco: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,3 g carboidrati, 2,1 g zuccheri, 2,2 g fibre, 2,3 g proteine, 0,04 g sale.
775) Patata comune: 77 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 0,8 g zuccheri, 2,2 g fibre, 2,0 g proteine, 0,01 g sale.
776) Patata Dolce (Americana): 86 kcal, 0,1 g grassi, 0,0 g grassi saturi, 20,1 g carboidrati, 4,2 g zuccheri, 3,0 g fibre, 1,6 g proteine, 0,05 g sale.
777) Cipolla Bianca: 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 9,3 g carboidrati, 4,2 g zuccheri, 1,7 g fibre, 1,1 g proteine, 0,01 g sale.
778) Cipolla Rossa: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
779) Scalogno: 72 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,8 g carboidrati, 7,9 g zuccheri, 3,2 g fibre, 2,5 g proteine, 0,01 g sale.
780) Aglio (100g): 149 kcal, 0,5 g grassi, 0,1 g grassi saturi, 33,0 g carboidrati, 1,0 g zuccheri, 2,1 g fibre, 6,4 g proteine, 0,02 g sale.
781) Porro: 61 kcal, 0,3 g grassi, 0,0 g grassi saturi, 14,0 g carboidrati, 3,9 g zuccheri, 1,8 g fibre, 1,5 g proteine, 0,02 g sale.
782) Finocchio: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,3 g carboidrati, 3,9 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,05 g sale.
783) Sedano: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,8 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,08 g sale.
784) Asparago: 20 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 1,9 g zuccheri, 2,1 g fibre, 2,2 g proteine, 0,01 g sale.
785) Carciofo: 47 kcal, 0,2 g grassi, 0,0 g grassi saturi, 10,5 g carboidrati, 1,0 g zuccheri, 5,4 g fibre, 3,3 g proteine, 0,09 g sale.
786) Topinambur: 73 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,4 g carboidrati, 9,6 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
787) Barbabietola Rossa: 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 10,0 g carboidrati, 6,8 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,08 g sale.
788) Fagiolini: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 3,3 g zuccheri, 3,4 g fibre, 1,8 g proteine, 0,01 g sale.
789) Piselli freschi: 81 kcal, 0,4 g grassi, 0,1 g grassi saturi, 14,5 g carboidrati, 5,7 g zuccheri, 5,1 g fibre, 5,4 g proteine, 0,01 g sale.
790) Fave fresche: 88 kcal, 0,7 g grassi, 0,1 g grassi saturi, 17,6 g carboidrati, 4,9 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,01 g sale.
791) Taccole: 42 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 4,0 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,01 g sale.
792) Funghi Champignon: 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 2,0 g zuccheri, 1,0 g fibre, 3,1 g proteine, 0,01 g sale.
793) Funghi Porcini: 26 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 2,5 g fibre, 3,9 g proteine, 0,01 g sale.
794) Funghi Pleurotus: 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
795) Sedano Rapa: 42 kcal, 0,3 g grassi, 0,1 g grassi saturi, 9,2 g carboidrati, 1,8 g zuccheri, 1,8 g fibre, 1,5 g proteine, 0,10 g sale.
796) Pastinaca: 75 kcal, 0,3 g grassi, 0,1 g grassi saturi, 18,0 g carboidrati, 4,8 g zuccheri, 4,9 g fibre, 1,2 g proteine, 0,01 g sale.
797) Zenzero fresco: 80 kcal, 0,8 g grassi, 0,2 g grassi saturi, 17,8 g carboidrati, 1,7 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
798) Daikon (Rafano bianco): 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,1 g carboidrati, 2,5 g zuccheri, 1,6 g fibre, 0,6 g proteine, 0,02 g sale.
799) Rapa bianca: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,4 g carboidrati, 3,8 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,06 g sale.
800) Cetriolino sott'aceto: 11 kcal, 0,2 g grassi, 0,1 g grassi saturi, 2,3 g carboidrati, 1,1 g zuccheri, 1,2 g fibre, 0,5 g proteine, 1,20 g sale.
801) Mais dolce (pannocchia): 86 kcal, 1,2 g grassi, 0,2 g grassi saturi, 19,0 g carboidrati, 6,3 g zuccheri, 2,7 g fibre, 3,2 g proteine, 0,01 g sale.
802) Germogli di soia: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,0 g zuccheri, 1,8 g fibre, 3,0 g proteine, 0,01 g sale.
803) BambÃ¹ (germogli): 27 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,2 g carboidrati, 3,0 g zuccheri, 2,2 g fibre, 2,6 g proteine, 0,01 g sale.
804) Okra (Gombo): 33 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 1,5 g zuccheri, 3,2 g fibre, 1,9 g proteine, 0,01 g sale.
805) Agretti (Barba di frate): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 2,2 g fibre, 1,8 g proteine, 0,05 g sale.
806) Cardo: 17 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,17 g sale.
807) Valeriana (Songino): 21 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,0 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,01 g sale.
808) Crescione: 11 kcal, 0,1 g grassi, 0,0 g grassi saturi, 1,3 g carboidrati, 0,2 g zuccheri, 0,5 g fibre, 2,3 g proteine, 0,04 g sale.
809) Radicchio di Treviso: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,4 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,4 g proteine, 0,01 g sale.
810) Puntarelle (Cicoria di catalogna): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,8 g carboidrati, 0,7 g zuccheri, 2,1 g fibre, 1,5 g proteine, 0,03 g sale.
811) Pak Choi (Cavolo cinese): 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
812) Verza Viola: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,4 g carboidrati, 3,8 g zuccheri, 2,1 g fibre, 1,4 g proteine, 0,03 g sale.
813) Lollo Rossa (Insalata): 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,9 g carboidrati, 1,1 g zuccheri, 1,3 g fibre, 1,3 g proteine, 0,02 g sale.
814) Friarielli: 25 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 0,6 g zuccheri, 2,8 g fibre, 2,9 g proteine, 0,03 g sale.
815) Truffle (Tartufo nero): 31 kcal, 0,7 g grassi, 0,1 g grassi saturi, 0,7 g carboidrati, 0,5 g zuccheri, 8,0 g fibre, 6,0 g proteine, 0,05 g sale.
816) Bok Choy: 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
817) Radice di Loto: 74 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,2 g carboidrati, 0,5 g zuccheri, 4,9 g fibre, 2,6 g proteine, 0,04 g sale.
818) Chayote (Zucchina spinosa): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
819) Alga Nori (secca): 35 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 0,5 g fibre, 5,8 g proteine, 0,05 g sale.
820) Alga Wakame (fresca): 45 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,1 g carboidrati, 0,6 g zuccheri, 0,5 g fibre, 3,0 g proteine, 0,80 g sale.
821) Rabarbaro: 21 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,1 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,01 g sale.
822) Cavolo riccio (Kale): 49 kcal, 0,9 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 2,3 g zuccheri, 3,6 g fibre, 4,3 g proteine, 0,04 g sale.
823) Portulaca: 16 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,4 g carboidrati, 0,1 g zuccheri, 0,0 g fibre, 1,3 g proteine, 0,04 g sale.
824) Borragine: 21 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 0,1 g zuccheri, 0,0 g fibre, 1,8 g proteine, 0,08 g sale.
825) Tarassaco (foglie): 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
826) Ortica: 42 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,1 g carboidrati, 0,1 g zuccheri, 6,9 g fibre, 2,7 g proteine, 0,01 g sale.
827) Peperoncino piccante rosso: 40 kcal, 0,4 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 5,3 g zuccheri, 1,5 g fibre, 1,9 g proteine, 0,01 g sale.
828) Rafano (radice): 48 kcal, 0,7 g grassi, 0,1 g grassi saturi, 11,3 g carboidrati, 8,0 g zuccheri, 3,3 g fibre, 1,2 g proteine, 0,01 g sale.
829) Cipollotto fresco: 32 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,3 g carboidrati, 2,3 g zuccheri, 2,6 g fibre, 1,8 g proteine, 0,02 g sale.
830) Scalogno fresco: 72 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,8 g carboidrati, 7,9 g zuccheri, 3,2 g fibre, 2,5 g proteine, 0,01 g sale.
831) Scorzonera: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
832) Patata Novella: 70 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,0 g carboidrati, 1,0 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,01 g sale.
833) Zucca Butternut: 45 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,7 g carboidrati, 2,2 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
834) Zucca Delica: 35 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
835) Peperone Friggitello: 25 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 2,8 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,01 g sale.
836) Insalata Belga Rossa: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
837) Lattughino da taglio: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,02 g sale.
838) Carciofino sott'olio (sgocciolato): 90 kcal, 7,5 g grassi, 1,0 g grassi saturi, 3,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 2,5 g proteine, 0,80 g sale.
839) Pomodori Secchi (non sott'olio): 258 kcal, 3,0 g grassi, 0,4 g grassi saturi, 55,7 g carboidrati, 37,6 g zuccheri, 12,3 g fibre, 14,1 g proteine, 0,25 g sale.
840) Cuore di Palma: 28 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 2,0 g zuccheri, 2,4 g fibre, 2,5 g proteine, 0,40 g sale.
841) Wasabi (radice fresca): 109 kcal, 0,6 g grassi, 0,1 g grassi saturi, 23,5 g carboidrati, 7,8 g zuccheri, 7,8 g fibre, 4,8 g proteine, 0,01 g sale.
842) Lichene Islandico: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 0,1 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,05 g sale.
843) Samphire (Asparago di mare): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,1 g zuccheri, 1,5 g fibre, 1,2 g proteine, 1,50 g sale.
844) Broccolo Ramoso: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,03 g sale.
845) Foglie di Vite: 93 kcal, 2,1 g grassi, 0,3 g grassi saturi, 17,3 g carboidrati, 6,3 g zuccheri, 11,0 g fibre, 5,6 g proteine, 0,01 g sale.
846) Pomodoro Cuore di Bue: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
847) Pomodoro San Marzano: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 2,8 g zuccheri, 1,4 g fibre, 1,0 g proteine, 0,01 g sale.
848) Pomodoro Nero di Crimea: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,2 g zuccheri, 1,3 g fibre, 1,1 g proteine, 0,01 g sale.
849) Pomodoro Datterino: 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 4,1 g zuccheri, 1,5 g fibre, 1,1 g proteine, 0,01 g sale.
850) Melanzana Bianca: 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,8 g carboidrati, 3,3 g zuccheri, 3,0 g fibre, 1,1 g proteine, 0,01 g sale.
851) Melanzana Perlina: 26 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 3,6 g zuccheri, 3,2 g fibre, 1,2 g proteine, 0,01 g sale.
852) Melanzana Tonda Sfumata Rosa: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,9 g carboidrati, 3,4 g zuccheri, 3,1 g fibre, 1,0 g proteine, 0,01 g sale.
854) Radice di Prezzemolo: 55 kcal, 0,6 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 1,5 g zuccheri, 4,3 g fibre, 2,3 g proteine, 0,01 g sale.
855) Manioca (Yuca): 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,0 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
856) Yam (Igname): 118 kcal, 0,2 g grassi, 0,0 g grassi saturi, 27,9 g carboidrati, 0,5 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
857) Taro: 112 kcal, 0,2 g grassi, 0,0 g grassi saturi, 26,5 g carboidrati, 0,4 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
858) Jicama (Rapa messicana): 38 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 1,8 g zuccheri, 4,9 g fibre, 0,7 g proteine, 0,01 g sale.
859) Rutabaga: 37 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,6 g carboidrati, 4,5 g zuccheri, 2,3 g fibre, 1,1 g proteine, 0,01 g sale.
860) Arracacha: 130 kcal, 0,3 g grassi, 0,1 g grassi saturi, 31,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
861) Oca (Tubero andino): 60 kcal, 0,1 g grassi, 0,0 g grassi saturi, 13,0 g carboidrati, 4,0 g zuccheri, 1,5 g fibre, 1,1 g proteine, 0,01 g sale.
862) Mashua: 52 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,5 g carboidrati, 3,5 g zuccheri, 1,2 g fibre, 1,5 g proteine, 0,01 g sale.
863) Ulluco: 50 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,0 g carboidrati, 2,5 g zuccheri, 1,0 g fibre, 1,3 g proteine, 0,01 g sale.
865) Senape Indiana (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
866) Amaranto (foglie): 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,0 g zuccheri, 2,1 g fibre, 2,5 g proteine, 0,02 g sale.
867) Fico d'India (Cladodi/Nopales): 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,1 g zuccheri, 2,2 g fibre, 1,3 g proteine, 0,02 g sale.
868) Malva (foglie): 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
869) Piantaggine: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 1,2 g zuccheri, 2,8 g fibre, 2,5 g proteine, 0,01 g sale.
870) Farinello (Spinacio selvatico): 43 kcal, 0,8 g grassi, 0,1 g grassi saturi, 7,3 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 4,2 g proteine, 0,01 g sale.
871) Silene (Strigoli): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,5 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,01 g sale.
872) Scolymo (Cardo mariano): 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 1,5 g proteine, 0,05 g sale.
873) Luppolo selvatico (Bruscandoli): 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,5 g proteine, 0,01 g sale.
874) Papavero (foglie giovani): 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,01 g sale.
876) Kohlrabi (Cavolo Rapa) Verde: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 2,6 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
877) Kohlrabi Viola: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,4 g carboidrati, 2,7 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
878) Momordica (Amante amaro/Bitter Melon): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,0 g proteine, 0,01 g sale.
879) Luffa (fresca): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
880) Chayote (foglie): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 4,0 g proteine, 0,01 g sale.
881) Zucchina gialla: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 2,2 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,01 g sale.
882) Patisson (Zucca castagna): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,01 g sale.
884) Funghi Shiitake: 34 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,8 g carboidrati, 2,4 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
885) Funghi Cantarelli (Finferli): 32 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,9 g carboidrati, 1,2 g zuccheri, 3,8 g fibre, 1,5 g proteine, 0,01 g sale.
886) Funghi Enoki: 37 kcal, 0,3 g grassi, 0,0 g grassi saturi, 7,8 g carboidrati, 0,2 g zuccheri, 2,7 g fibre, 2,7 g proteine, 0,01 g sale.
887) Funghi Spugnole (Morchelle): 31 kcal, 0,6 g grassi, 0,1 g grassi saturi, 5,1 g carboidrati, 0,6 g zuccheri, 2,8 g fibre, 3,1 g proteine, 0,01 g sale.
888) Funghi Galletti: 15 kcal, 0,5 g grassi, 0,1 g grassi saturi, 0,6 g carboidrati, 0,5 g zuccheri, 3,2 g fibre, 1,5 g proteine, 0,01 g sale.
889) Funghi Pioppini: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 2,2 g fibre, 2,5 g proteine, 0,01 g sale.
891) Batavia (Insalata): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 1,3 g fibre, 1,3 g proteine, 0,02 g sale.
892) Mizuna: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
893) Komatsuna: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,4 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,05 g sale.
894) Perilla (Shiso): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 2,5 g proteine, 0,01 g sale.
895) Tatsoi: 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,04 g sale.
896) Bietola Rossa (foglie): 22 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,1 g zuccheri, 3,7 g fibre, 2,2 g proteine, 0,23 g sale.
897) Minutina (Erba stella): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,02 g sale.
898) Portulaca di mare: 18 kcal, 0,3 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 0,2 g zuccheri, 1,5 g fibre, 1,5 g proteine, 1,20 g sale.
899) Nasturzio (foglie): 30 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
900) Elicriso (foglie): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 1,2 g proteine, 0,01 g sale.
902) Peperoncino Habanero: 45 kcal, 0,5 g grassi, 0,1 g grassi saturi, 9,5 g carboidrati, 5,0 g zuccheri, 1,8 g fibre, 2,0 g proteine, 0,01 g sale.
903) Peperoncino JalapeÃ±o: 29 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 4,1 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,01 g sale.
904) Peperoncino Serrano: 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 4,5 g zuccheri, 3,7 g fibre, 1,7 g proteine, 0,01 g sale.
905) Peperoncino Thai (Bird's Eye): 40 kcal, 0,4 g grassi, 0,1 g grassi saturi, 9,0 g carboidrati, 5,0 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,01 g sale.
906) Pimento (Peperone dolce): 26 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,0 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
907) Trinidad Scorpion: 48 kcal, 0,6 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 5,5 g zuccheri, 2,0 g fibre, 2,2 g proteine, 0,01 g sale.
908) Carolina Reaper: 50 kcal, 0,7 g grassi, 0,1 g grassi saturi, 10,5 g carboidrati, 6,0 g zuccheri, 2,0 g fibre, 2,3 g proteine, 0,01 g sale.
910) Acetosa: 22 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 0,5 g zuccheri, 2,9 g fibre, 2,0 g proteine, 0,01 g sale.
911) Agretto di scoglio: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,6 g proteine, 0,80 g sale.
912) Amaranto selvatico (Gallega): 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,2 g carboidrati, 0,0 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,02 g sale.
913) Asfodelo (germogli): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
914) Balsamina (foglie): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,2 g proteine, 0,01 g sale.
915) Barbarea (Erba di Santa Barbara): 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
916) Bieta Svizzera: 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,21 g sale.
917) Borsa del Pastore: 33 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,01 g sale.
918) Caccialepre: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 1,8 g proteine, 0,01 g sale.
919) Cardamine: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
920) Cardoncelli (Funghi): 38 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 1,2 g zuccheri, 3,5 g fibre, 3,8 g proteine, 0,01 g sale.
921) Carota Nera: 35 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,0 g zuccheri, 3,0 g fibre, 1,0 g proteine, 0,05 g sale.
922) Carota Viola: 38 kcal, 0,2 g grassi, 0,0 g grassi saturi, 9,0 g carboidrati, 4,5 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,06 g sale.
923) Cavolo Abissino: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,8 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,03 g sale.
924) Cavolo di Pechino (Napa): 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,2 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,02 g sale.
925) Centocchio (Stellaria): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,01 g sale.
926) Cerfoglio: 50 kcal, 0,6 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 3,5 g proteine, 0,08 g sale.
927) Chenopodio (Buon Enrico): 32 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 3,5 g proteine, 0,01 g sale.
928) Chrysanthemum coronarium (foglie commestibili): 24 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,3 g proteine, 0,04 g sale.
929) Cicerchia (fresca): 95 kcal, 0,8 g grassi, 0,1 g grassi saturi, 15,0 g carboidrati, 2,5 g zuccheri, 6,0 g fibre, 8,5 g proteine, 0,01 g sale.
930) Cicoria di Bruxelles: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
931) Cicoria Witloof: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,2 g proteine, 0,01 g sale.
932) Crespigno: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,2 g fibre, 2,4 g proteine, 0,01 g sale.
933) Dente di Leone (fiori): 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
934) Dolcetta: 21 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 1,2 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,01 g sale.
935) Enula Campana (radice): 40 kcal, 0,3 g grassi, 0,0 g grassi saturi, 9,5 g carboidrati, 1,0 g zuccheri, 4,0 g fibre, 1,2 g proteine, 0,01 g sale.
936) Erba Cipollina: 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,4 g carboidrati, 1,9 g zuccheri, 2,5 g fibre, 3,3 g proteine, 0,01 g sale.
937) Erba Medica (foglie): 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 4,0 g proteine, 0,01 g sale.
938) Farfaraccio: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 1,5 g proteine, 0,01 g sale.
939) Fiori di Zucca: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
940) Foglie di Amaranto: 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 2,5 g proteine, 0,02 g sale.
941) Foglie di Barbabietola: 22 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,1 g zuccheri, 3,7 g fibre, 2,2 g proteine, 0,22 g sale.
942) Foglie di Coriandolo: 23 kcal, 0,5 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 0,9 g zuccheri, 2,8 g fibre, 2,1 g proteine, 0,05 g sale.
943) Foglie di Rafano: 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
944) Foglie di Senape: 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
945) Friggitelli Rossi: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 2,1 g fibre, 1,1 g proteine, 0,01 g sale.
946) Funghi Maitake: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 2,1 g zuccheri, 2,7 g fibre, 1,9 g proteine, 0,01 g sale.
947) Funghi Orecchioni: 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
948) Funghi Shimeji: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,5 g proteine, 0,01 g sale.
949) Grespino: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,8 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 2,5 g proteine, 0,01 g sale.
950) Indivia Ricciuta: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 0,3 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,03 g sale.
951) Kailan (Broccolo Cinese): 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 1,1 g proteine, 0,03 g sale.
952) Laminaria (Alga Kombu fresca): 43 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,5 g carboidrati, 0,5 g zuccheri, 1,3 g fibre, 1,7 g proteine, 2,30 g sale.
953) Lapsana (Erba dei capezzoli): 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
954) Lattuga Asparago (Celtuce): 18 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 1,3 g zuccheri, 1,7 g fibre, 0,9 g proteine, 0,01 g sale.
955) Lichene Mannaro: 35 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 0,1 g zuccheri, 4,0 g fibre, 2,0 g proteine, 0,05 g sale.
956) Luffa Cilindrica: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
957) Lupino fresco (ammollato): 119 kcal, 2,9 g grassi, 0,4 g grassi saturi, 9,9 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 15,6 g proteine, 0,01 g sale.
958) Mizuna Viola: 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
959) Ononide: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 1,2 g proteine, 0,01 g sale.
960) Ortica Bianca: 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 0,1 g zuccheri, 6,5 g fibre, 2,5 g proteine, 0,01 g sale.
961) Palmito: 28 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 2,0 g zuccheri, 2,4 g fibre, 2,5 g proteine, 0,43 g sale.
962) Panicaut (Calcatreppola): 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,0 g proteine, 0,01 g sale.
963) Pastinaca Selvatica: 75 kcal, 0,3 g grassi, 0,1 g grassi saturi, 18,0 g carboidrati, 4,8 g zuccheri, 4,9 g fibre, 1,2 g proteine, 0,01 g sale.
964) Pimpinella: 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
965) Pirolino: 25 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
966) Pomodoro Giallo: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
967) Porro Selvatico: 60 kcal, 0,3 g grassi, 0,0 g grassi saturi, 14,0 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
968) Prezzemolo (foglie): 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,9 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,06 g sale.
969) Quinoa (foglie): 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,0 g proteine, 0,02 g sale.
970) Radicchio di Gorizia: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,4 g proteine, 0,01 g sale.
971) Radicchio di Lusia: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,8 g fibre, 1,2 g proteine, 0,01 g sale.
972) Radice di Bardana: 72 kcal, 0,2 g grassi, 0,0 g grassi saturi, 17,3 g carboidrati, 2,9 g zuccheri, 3,3 g fibre, 1,5 g proteine, 0,01 g sale.
973) Radice di Cicoria: 72 kcal, 0,2 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 8,7 g zuccheri, 2,0 g fibre, 1,4 g proteine, 0,05 g sale.
974) Raperonzolo (radice): 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 9,0 g carboidrati, 3,0 g zuccheri, 2,5 g fibre, 1,0 g proteine, 0,01 g sale.
975) Raperonzolo (foglie): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,01 g sale.
976) Rapini: 22 kcal, 0,5 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 0,4 g zuccheri, 2,7 g fibre, 3,2 g proteine, 0,03 g sale.
977) Ravanello Lungo: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,9 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,04 g sale.
978) Ravanello Nero: 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 0,8 g proteine, 0,04 g sale.
979) Romice: 22 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 0,5 g zuccheri, 2,9 g fibre, 2,0 g proteine, 0,01 g sale.
980) Salsifis (Orecchia di lepre): 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
981) Sanicula: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
982) Saponaria: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
983) Scolymo Ispanico: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 1,5 g proteine, 0,05 g sale.
984) Scorzonera Bianca: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
985) Sedano d'acqua: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,0 g zuccheri, 1,2 g fibre, 0,8 g proteine, 0,15 g sale.
986) Senape Nera (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
987) Silene Vulgaris (Carletti): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,5 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,01 g sale.
988) Spinacio d'acqua (Kangkong): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,1 g carboidrati, 0,5 g zuccheri, 2,1 g fibre, 2,6 g proteine, 0,11 g sale.
989) Spinacio della Nuova Zelanda: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 0,6 g fibre, 1,5 g proteine, 0,13 g sale.
990) Spinacio Gigante: 23 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 0,4 g zuccheri, 2,2 g fibre, 2,9 g proteine, 0,08 g sale.
991) Talegua: 30 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,5 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
992) Tamarindo (foglie): 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
993) Tarassaco Rosso: 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
994) Tuberina (Crosne): 75 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 2,5 g proteine, 0,01 g sale.
995) Verza di Piacenza: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,02 g sale.
996) Viperina: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 1,8 g proteine, 0,01 g sale.
997) Zucca MusquÃ©e de Provence: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
998) Zucchina con fiore: 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
1000) Germogli di Alfalfa (Erba medica): 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1001) Germogli di Broccoli: 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 3,5 g proteine, 0,02 g sale.
1002) Germogli di Crescione: 32 kcal, 0,7 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 1,1 g fibre, 2,6 g proteine, 0,01 g sale.
1003) Germogli di Daikon: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,02 g sale.
1004) Germogli di Fagiolo Mungo (Soy sprouts): 30 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,9 g carboidrati, 4,1 g zuccheri, 1,8 g fibre, 3,0 g proteine, 0,01 g sale.
1005) Germogli di Fenugreco: 33 kcal, 0,6 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 4,5 g proteine, 0,01 g sale.
1006) Germogli di Frumento: 198 kcal, 1,3 g grassi, 0,2 g grassi saturi, 42,5 g carboidrati, 0,0 g zuccheri, 1,1 g fibre, 7,5 g proteine, 0,01 g sale.
1007) Germogli di Girasole: 45 kcal, 2,5 g grassi, 0,3 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 3,5 g proteine, 0,01 g sale.
1008) Germogli di Lenticchie: 106 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,1 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 9,0 g proteine, 0,01 g sale.
1009) Germogli di Piselli: 124 kcal, 0,7 g grassi, 0,1 g grassi saturi, 25,0 g carboidrati, 4,5 g zuccheri, 3,0 g fibre, 8,8 g proteine, 0,01 g sale.
1010) Germogli di Porro: 35 kcal, 0,3 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 2,5 g proteine, 0,01 g sale.
1011) Germogli di Radis: 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 1,9 g zuccheri, 2,5 g fibre, 3,8 g proteine, 0,01 g sale.
1012) Germogli di Rapa: 28 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 3,0 g proteine, 0,02 g sale.
1013) Germogli di Rucola: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,7 g carboidrati, 2,0 g zuccheri, 1,6 g fibre, 2,6 g proteine, 0,03 g sale.
1014) Germogli di Senape: 27 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
1015) Germogli di Trifoglio: 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1016) Micro-bietola: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,20 g sale.
1017) Micro-cavolo nero: 45 kcal, 0,8 g grassi, 0,1 g grassi saturi, 8,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 4,0 g proteine, 0,04 g sale.
1018) Micro-cilantro: 23 kcal, 0,5 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 0,9 g zuccheri, 2,8 g fibre, 2,1 g proteine, 0,05 g sale.
1019) Micro-prezzemolo: 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,9 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,06 g sale.
1021) Ceci freschi (verdi): 164 kcal, 2,6 g grassi, 0,3 g grassi saturi, 27,4 g carboidrati, 4,8 g zuccheri, 7,6 g fibre, 8,9 g proteine, 0,01 g sale.
1022) Lenticchie fresche: 116 kcal, 0,4 g grassi, 0,1 g grassi saturi, 20,1 g carboidrati, 1,8 g zuccheri, 7,9 g fibre, 9,0 g proteine, 0,01 g sale.
1023) Fagioli Borlotti freschi: 142 kcal, 0,8 g grassi, 0,2 g grassi saturi, 23,2 g carboidrati, 1,5 g zuccheri, 7,0 g fibre, 10,2 g proteine, 0,01 g sale.
1024) Fagioli Cannellini freschi: 138 kcal, 0,6 g grassi, 0,1 g grassi saturi, 22,5 g carboidrati, 1,2 g zuccheri, 6,5 g fibre, 9,5 g proteine, 0,01 g sale.
1025) Fagioli di Lima freschi: 113 kcal, 0,4 g grassi, 0,1 g grassi saturi, 20,2 g carboidrati, 1,5 g zuccheri, 4,9 g fibre, 6,8 g proteine, 0,01 g sale.
1026) Fagioli Mungo freschi: 105 kcal, 0,4 g grassi, 0,1 g grassi saturi, 19,2 g carboidrati, 2,0 g zuccheri, 7,6 g fibre, 7,0 g proteine, 0,01 g sale.
1027) Fagioli Neri freschi: 132 kcal, 0,5 g grassi, 0,1 g grassi saturi, 23,7 g carboidrati, 1,0 g zuccheri, 8,7 g fibre, 8,9 g proteine, 0,01 g sale.
1028) Fagioli Rossi freschi: 127 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,8 g carboidrati, 1,1 g zuccheri, 7,4 g fibre, 8,7 g proteine, 0,01 g sale.
1029) Fagioli Azuki freschi: 128 kcal, 0,5 g grassi, 0,1 g grassi saturi, 24,0 g carboidrati, 2,0 g zuccheri, 7,0 g fibre, 7,5 g proteine, 0,01 g sale.
1030) Fagioli dall'occhio freschi: 118 kcal, 0,5 g grassi, 0,1 g grassi saturi, 21,0 g carboidrati, 2,5 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,01 g sale.
1031) Soia Edamame (fresca nel baccello): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 10,5 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1032) Lupini freschi (in salamoia): 116 kcal, 2,5 g grassi, 0,3 g grassi saturi, 9,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 14,0 g proteine, 2,50 g sale.
1033) Cicerchie (secche ammollate): 130 kcal, 1,2 g grassi, 0,2 g grassi saturi, 20,0 g carboidrati, 1,5 g zuccheri, 8,0 g fibre, 11,0 g proteine, 0,01 g sale.
1034) Piselli Proteici: 85 kcal, 0,5 g grassi, 0,1 g grassi saturi, 15,0 g carboidrati, 5,5 g zuccheri, 5,5 g fibre, 6,5 g proteine, 0,01 g sale.
1035) Fave fresche piccole: 88 kcal, 0,7 g grassi, 0,1 g grassi saturi, 17,6 g carboidrati, 4,9 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,01 g sale.
1037) Agriao (Crescione brasiliano): 11 kcal, 0,1 g grassi, 0,0 g grassi saturi, 1,3 g carboidrati, 0,2 g zuccheri, 0,5 g fibre, 2,3 g proteine, 0,04 g sale.
1038) Alga Arame (reidratata): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 0,1 g zuccheri, 2,0 g fibre, 1,2 g proteine, 1,10 g sale.
1039) Alga Hijiki (reidratata): 30 kcal, 0,3 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 0,1 g zuccheri, 2,5 g fibre, 1,5 g proteine, 1,20 g sale.
1040) Alga Spirulina (fresca): 26 kcal, 0,4 g grassi, 0,1 g grassi saturi, 2,4 g carboidrati, 0,3 g zuccheri, 0,5 g fibre, 5,9 g proteine, 0,10 g sale.
1041) Arakacha (Radice): 130 kcal, 0,3 g grassi, 0,1 g grassi saturi, 31,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
1042) BambÃ¹ (germogli in scatola): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 1,7 g proteine, 0,25 g sale.
1043) Banana da cottura (Platano verde): 122 kcal, 0,4 g grassi, 0,1 g grassi saturi, 31,9 g carboidrati, 15,0 g zuccheri, 2,3 g fibre, 1,3 g proteine, 0,01 g sale.
1044) Basella (Spinacio di Malabar): 19 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,4 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,8 g proteine, 0,02 g sale.
1045) Bietola Cinese: 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
1046) Calabash (Zucca a fiasco): 14 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 0,6 g proteine, 0,01 g sale.
1047) Cardo Gobbo: 17 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,17 g sale.
1048) Carosello (Cetriolo-pugliese): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,8 g zuccheri, 0,8 g fibre, 0,7 g proteine, 0,01 g sale.
1049) Cassava (foglie): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 3,7 g proteine, 0,01 g sale.
1050) Chayote (Sechium edule): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
1051) Cipolla di Tropea: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
1052) Cipolla Egiziana (Bulbilli): 45 kcal, 0,1 g grassi, 0,0 g grassi saturi, 10,0 g carboidrati, 5,0 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
1053) Daikon Rosso: 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,1 g carboidrati, 2,5 g zuccheri, 1,6 g fibre, 0,6 g proteine, 0,02 g sale.
1054) Durian (usato come verdura acerba): 147 kcal, 5,3 g grassi, 1,0 g grassi saturi, 27,1 g carboidrati, 10,0 g zuccheri, 3,8 g fibre, 1,5 g proteine, 0,01 g sale.
1055) Fagiolo serpente (Yardlong bean): 47 kcal, 0,4 g grassi, 0,1 g grassi saturi, 8,4 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 2,8 g proteine, 0,01 g sale.
1056) Fiori di Banana: 51 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,9 g carboidrati, 1,1 g zuccheri, 5,7 g fibre, 1,6 g proteine, 0,01 g sale.
1057) Gai Lan (Broccolo cinese): 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 1,1 g proteine, 0,03 g sale.
1058) Galanga (radice fresca): 71 kcal, 1,0 g grassi, 0,2 g grassi saturi, 15,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,01 g sale.
1059) Jicama (Radice): 38 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 1,8 g zuccheri, 4,9 g fibre, 0,7 g proteine, 0,01 g sale.
1060) Karela (Bitter Melon): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,0 g proteine, 0,01 g sale.
1061) Kimchi (Verdura fermentata): 15 kcal, 0,5 g grassi, 0,1 g grassi saturi, 2,4 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,1 g proteine, 1,20 g sale.
1062) Luffa acutangula: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
1063) Malanga: 142 kcal, 0,4 g grassi, 0,1 g grassi saturi, 34,0 g carboidrati, 0,5 g zuccheri, 5,1 g fibre, 1,5 g proteine, 0,01 g sale.
1064) Manioca (radice cruda): 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,1 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
1065) Mizuna Verde: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
1066) Morella (foglie): 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
1067) Moringa (foglie): 64 kcal, 1,4 g grassi, 0,4 g grassi saturi, 8,3 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 9,4 g proteine, 0,01 g sale.
1068) Moringa (baccelli/Drumsticks): 37 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,2 g zuccheri, 3,2 g fibre, 2,1 g proteine, 0,01 g sale.
1069) Nappa Cabbage: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,2 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,02 g sale.
1070) Nelumbo nucifera (Radice di loto): 74 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,2 g carboidrati, 0,5 g zuccheri, 4,9 g fibre, 2,6 g proteine, 0,04 g sale.
1071) Okra Rossa: 33 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 1,5 g zuccheri, 3,2 g fibre, 1,9 g proteine, 0,01 g sale.
1072) Pak Choi Piccolo (Baby Pak Choi): 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
1073) Papaya verde (usata come verdura): 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 10,8 g carboidrati, 7,8 g zuccheri, 1,7 g fibre, 0,5 g proteine, 0,01 g sale.
1074) Patata Blu (Vitelotte): 75 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
1075) Patata Ratte: 78 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,8 g carboidrati, 0,8 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,01 g sale.
1076) Patisson Giallo: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,01 g sale.
1077) Peperoncino Shishito: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
1078) Pomodoro Camone: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
1079) Pomodoro Piennolo: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
1080) Radice di Manioca: 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,0 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
1081) Radice di Wasabi: 109 kcal, 0,6 g grassi, 0,1 g grassi saturi, 23,5 g carboidrati, 7,8 g zuccheri, 7,8 g fibre, 4,8 g proteine, 0,01 g sale.
1082) Salicornia (Asparago di mare): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,1 g zuccheri, 1,5 g fibre, 1,2 g proteine, 1,50 g sale.
1083) Salsifis Nero: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
1084) Sechium edule (Chayote): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
1085) Shiso (Perilla): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 2,5 g proteine, 0,01 g sale.
1086) Soca (foglie commestibili): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
1087) Soya verde (Edamame): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 10,5 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1088) Tatsoi (foglie): 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,04 g sale.
1089) Taro (radice): 112 kcal, 0,2 g grassi, 0,0 g grassi saturi, 26,5 g carboidrati, 0,4 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
1090) Topinambur Bianco: 73 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,4 g carboidrati, 9,6 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
1091) Topinambur Rosso: 75 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,6 g carboidrati, 9,8 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
1092) Truffle Bianco (Alba): 35 kcal, 0,8 g grassi, 0,1 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 8,5 g fibre, 6,5 g proteine, 0,05 g sale.
1093) Truffle Estivo (Scorzone): 30 kcal, 0,6 g grassi, 0,1 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 8,0 g fibre, 6,0 g proteine, 0,05 g sale.
1094) Yam (Igname africano): 118 kcal, 0,2 g grassi, 0,0 g grassi saturi, 27,9 g carboidrati, 0,5 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
1095) Yam Viola (Ube): 120 kcal, 0,2 g grassi, 0,0 g grassi saturi, 28,5 g carboidrati, 1,5 g zuccheri, 4,0 g fibre, 1,6 g proteine, 0,01 g sale.
1096) Zucca Kabocha: 35 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
1097) Zucca Spaghetti: 31 kcal, 0,6 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 2,8 g zuccheri, 1,5 g fibre, 0,6 g proteine, 0,01 g sale.
1098) Zucca Hokkaido: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 3,5 g zuccheri, 1,8 g fibre, 1,3 g proteine, 0,01 g sale.
1099) Zucca Mantovana: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
1100) Zucca Marina di Chioggia: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 3,0 g zuccheri, 0,6 g fibre, 1,1 g proteine, 0,01 g sale.
1101) Zucca Turbante Turco: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 3,2 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,01 g sale.
1102) Zucchina Napoletana (Lunga): 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
1103) Zucchina Romanesca: 17 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 1,3 g proteine, 0,02 g sale.
1104) Zucchina Tonda di Piacenza: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 2,5 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,02 g sale.
1105) Zucchina Trombetta d'Albenga: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 2,2 g zuccheri, 1,0 g fibre, 1,1 g proteine, 0,02 g sale
1107) Ceci in scatola (confezionati): 120 kcal, 2,2 g grassi, 0,3 g grassi saturi, 15,0 g carboidrati, 0,8 g zuccheri, 5,5 g fibre, 7,0 g proteine, 0,80 g sale.
1108) Fagioli Borlotti in scatola (confezionati): 95 kcal, 0,6 g grassi, 0,1 g grassi saturi, 13,5 g carboidrati, 0,5 g zuccheri, 6,2 g fibre, 7,0 g proteine, 0,75 g sale.
1109) Fagioli Cannellini in scatola (confezionati): 85 kcal, 0,5 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 0,5 g zuccheri, 5,8 g fibre, 6,5 g proteine, 0,70 g sale.
1110) Fagioli Rossi Kidney in scatola (confezionati): 105 kcal, 0,5 g grassi, 0,1 g grassi saturi, 15,5 g carboidrati, 1,0 g zuccheri, 6,5 g fibre, 7,5 g proteine, 0,80 g sale.
1111) Fagioli Neri in scatola (confezionati): 110 kcal, 0,6 g grassi, 0,1 g grassi saturi, 16,0 g carboidrati, 0,8 g zuccheri, 7,0 g fibre, 8,0 g proteine, 0,85 g sale.
1112) Lenticchie in scatola (confezionati): 82 kcal, 0,5 g grassi, 0,1 g grassi saturi, 11,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 6,5 g proteine, 0,75 g sale.
1113) Piselli fini in scatola (confezionati): 75 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 2,5 g zuccheri, 5,0 g fibre, 5,5 g proteine, 0,70 g sale.
1114) Fave in scatola (confezionati): 80 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,5 g carboidrati, 1,5 g zuccheri, 6,0 g fibre, 6,0 g proteine, 0,80 g sale.
1115) Lupini in salamoia (confezionati): 115 kcal, 2,4 g grassi, 0,3 g grassi saturi, 9,2 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 14,0 g proteine, 2,80 g sale.
1116) Misto legumi per insalata (confezionati): 98 kcal, 0,7 g grassi, 0,1 g grassi saturi, 13,0 g carboidrati, 0,8 g zuccheri, 6,0 g fibre, 7,2 g proteine, 0,78 g sale.
1118) Passata di pomodoro (confezionati): 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 1,2 g fibre, 1,3 g proteine, 0,50 g sale.
1119) Polpa di pomodoro in pezzi (confezionati): 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 3,2 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,40 g sale.
1120) Pelati in scatola (confezionati): 21 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 3,0 g zuccheri, 1,0 g fibre, 1,1 g proteine, 0,30 g sale.
1121) Concentrato di pomodoro (confezionati): 82 kcal, 0,5 g grassi, 0,1 g grassi saturi, 14,5 g carboidrati, 12,0 g zuccheri, 4,5 g fibre, 4,3 g proteine, 1,50 g sale.
1122) Pomodori secchi sott'olio (confezionati): 250 kcal, 18,0 g grassi, 2,5 g grassi saturi, 15,0 g carboidrati, 10,0 g zuccheri, 6,0 g fibre, 5,5 g proteine, 3,00 g sale.
1124) Mais dolce in scatola (confezionati): 80 kcal, 1,2 g grassi, 0,2 g grassi saturi, 14,0 g carboidrati, 5,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,60 g sale.
1125) Asparagi in vetro (confezionati): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,90 g sale.
1126) Cuori di carciofo al naturale (confezionati): 45 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 1,0 g zuccheri, 5,0 g fibre, 2,5 g proteine, 0,85 g sale.
1127) Carciofini sott'olio (confezionati): 190 kcal, 17,5 g grassi, 2,0 g grassi saturi, 4,5 g carboidrati, 1,2 g zuccheri, 4,0 g fibre, 2,2 g proteine, 1,20 g sale.
1128) Funghi champignon al naturale (confezionati): 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 2,2 g fibre, 2,3 g proteine, 0,80 g sale.
1129) Fagiolini al naturale (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 1,5 g proteine, 0,75 g sale.
1130) Barbabietole precotte sottovuoto (confezionati): 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 7,0 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,15 g sale.
1131) Crauti al naturale (confezionati): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 2,5 g fibre, 1,1 g proteine, 1,50 g sale.
1132) Olive verdi in salamoia (confezionati): 145 kcal, 15,0 g grassi, 2,4 g grassi saturi, 1,0 g carboidrati, 0,1 g zuccheri, 3,0 g fibre, 1,0 g proteine, 3,50 g sale.
1133) Olive nere in salamoia (confezionati): 165 kcal, 17,0 g grassi, 2,8 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 2,5 g fibre, 1,2 g proteine, 3,20 g sale.
1134) Cetriolini sott'aceto (confezionati): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 0,8 g proteine, 2,00 g sale.
1135) Cipolline sott'aceto (confezionati): 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,5 g carboidrati, 4,8 g zuccheri, 1,5 g fibre, 0,8 g proteine, 1,80 g sale.
1136) Giardiniera in agrodolce (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 1,50 g sale.
1137) Peperoni grigliati sott'olio (confezionati): 140 kcal, 12,5 g grassi, 1,5 g grassi saturi, 5,2 g carboidrati, 4,0 g zuccheri, 2,0 g fibre, 1,0 g proteine, 1,10 g sale.
1138) Germogli di soia in scatola (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 1,8 g fibre, 2,8 g proteine, 0,65 g sale.
1140) Capperi sotto sale (da sciacquare): 40 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 2,5 g proteine, 20,00 g sale.
1141) Capperi sott'aceto: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,0 g carboidrati, 0,4 g zuccheri, 3,2 g fibre, 2,0 g proteine, 3,00 g sale.
1142) Cetriolini sott'aceto: 15 kcal, 0,2 g grassi, 0,1 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 1,0 g proteine, 2,00 g sale.
1143) Cipolline sott'aceto: 35 kcal, 0,1 g grassi, 0 g grassi saturi, 7,0 g carboidrati, 5,5 g zuccheri, 1,5 g fibre, 0,8 g proteine, 1,80 g sale.
1144) Olive Verdi in salamoia: 145 kcal, 15,0 g grassi, 2,2 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 1,0 g proteine, 3,50 g sale.
1145) Olive Nere in salamoia: 235 kcal, 24,0 g grassi, 3,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 1,5 g proteine, 3,00 g sale.
1146) Olive Nere greche (tipo Kalamata): 260 kcal, 26,0 g grassi, 4,0 g grassi saturi, 2,0 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 2,0 g proteine, 4,50 g sale.
1147) Peperoncini sott'aceto: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 2,50 g sale.
1148) Giardiniera sott'aceto: 18 kcal, 0,2 g grassi, 0 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 1,8 g fibre, 0,8 g proteine, 2,20 g sale.
1149) Pasta d'acciughe (tubetto): 160 kcal, 10,0 g grassi, 2,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 17,0 g proteine, 15,00 g sale.
1151) Pepe Nero macinato: 250 kcal, 3,3 g grassi, 1,0 g grassi saturi, 64,0 g carboidrati, 0,6 g zuccheri, 25,0 g fibre, 10,5 g proteine, 0,05 g sale.
1152) Peperoncino in polvere: 280 kcal, 14,0 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 10,0 g zuccheri, 27,0 g fibre, 13,0 g proteine, 0,08 g sale.
1153) Curcuma in polvere: 312 kcal, 3,3 g grassi, 1,8 g grassi saturi, 67,0 g carboidrati, 3,2 g zuccheri, 21,0 g fibre, 9,5 g proteine, 0,07 g sale.
1154) Curry in polvere (mix): 325 kcal, 14,0 g grassi, 2,2 g grassi saturi, 55,0 g carboidrati, 2,5 g zuccheri, 33,0 g fibre, 14,0 g proteine, 0,13 g sale.
1155) Paprica dolce: 290 kcal, 13,0 g grassi, 2,1 g grassi saturi, 53,0 g carboidrati, 10,0 g zuccheri, 35,0 g fibre, 14,5 g proteine, 0,08 g sale.
1156) Paprica affumicata: 285 kcal, 12,5 g grassi, 2,0 g grassi saturi, 52,0 g carboidrati, 9,5 g zuccheri, 34,0 g fibre, 14,0 g proteine, 0,10 g sale.
1157) Zenzero in polvere: 335 kcal, 4,2 g grassi, 1,4 g grassi saturi, 71,0 g carboidrati, 3,4 g zuccheri, 14,0 g fibre, 9,0 g proteine, 0,08 g sale.
1158) Cannella in polvere: 247 kcal, 1,2 g grassi, 0,3 g grassi saturi, 80,0 g carboidrati, 2,2 g zuccheri, 53,0 g fibre, 4,0 g proteine, 0,02 g sale.
1159) Cumino in polvere: 375 kcal, 22,0 g grassi, 1,5 g grassi saturi, 44,0 g carboidrati, 2,2 g zuccheri, 10,0 g fibre, 18,0 g proteine, 0,40 g sale.
1160) Chiodi di garofano macinati: 274 kcal, 13,0 g grassi, 4,0 g grassi saturi, 65,0 g carboidrati, 2,4 g zuccheri, 34,0 g fibre, 6,0 g proteine, 0,25 g sale.
1161) Noce moscata: 525 kcal, 36,0 g grassi, 26,0 g grassi saturi, 49,0 g carboidrati, 28,0 g zuccheri, 21,0 g fibre, 6,0 g proteine, 0,04 g sale.
1162) Zafferano (pistilli o polvere): 310 kcal, 6,0 g grassi, 1,6 g grassi saturi, 65,0 g carboidrati, 0 g zuccheri, 4,0 g fibre, 11,5 g proteine, 0,35 g sale.
1164) Origano secco: 265 kcal, 4,3 g grassi, 1,5 g grassi saturi, 69,0 g carboidrati, 4,0 g zuccheri, 42,0 g fibre, 9,0 g proteine, 0,06 g sale.
1165) Rosmarino secco: 330 kcal, 15,0 g grassi, 7,0 g grassi saturi, 64,0 g carboidrati, 0 g zuccheri, 42,0 g fibre, 5,0 g proteine, 0,13 g sale.
1166) Salvia secca: 315 kcal, 13,0 g grassi, 7,0 g grassi saturi, 60,0 g carboidrati, 1,7 g zuccheri, 40,0 g fibre, 10,5 g proteine, 0,03 g sale.
1167) Timo secco: 276 kcal, 7,4 g grassi, 2,7 g grassi saturi, 64,0 g carboidrati, 1,7 g zuccheri, 37,0 g fibre, 9,0 g proteine, 0,14 g sale.
1168) Maggiorana secca: 270 kcal, 7,0 g grassi, 0,5 g grassi saturi, 60,0 g carboidrati, 4,0 g zuccheri, 40,0 g fibre, 12,5 g proteine, 0,20 g sale.
1169) Alloro secco: 313 kcal, 8,4 g grassi, 2,3 g grassi saturi, 75,0 g carboidrati, 0 g zuccheri, 26,0 g fibre, 7,5 g proteine, 0,06 g sale.
1171) Basilico fresco: 23 kcal, 0,6 g grassi, 0,1 g grassi saturi, 2,7 g carboidrati, 0,3 g zuccheri, 1,6 g fibre, 3,2 g proteine, 0,01 g sale.
1172) Prezzemolo fresco: 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,8 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,14 g sale.
1173) Menta fresca: 70 kcal, 0,9 g grassi, 0,2 g grassi saturi, 15,0 g carboidrati, 0 g zuccheri, 8,0 g fibre, 3,8 g proteine, 0,08 g sale.
1174) Erba cipollina fresca: 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,4 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 3,3 g proteine, 0,01 g sale.
1175) Dill (Aneto) fresco: 43 kcal, 1,1 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0 g zuccheri, 2,1 g fibre, 3,5 g proteine, 0,15 g sale.
1177) Maionese classica: 680 kcal, 75,0 g grassi, 11,5 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 0 g fibre, 1,0 g proteine, 1,50 g sale.
1178) Maionese Light: 250 kcal, 22,0 g grassi, 3,5 g grassi saturi, 12,0 g carboidrati, 5,0 g zuccheri, 0,2 g fibre, 0,5 g proteine, 1,80 g sale.
1179) Ketchup: 100 kcal, 0,1 g grassi, 0 g grassi saturi, 23,0 g carboidrati, 22,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 2,50 g sale.
1180) Senape delicata: 90 kcal, 5,0 g grassi, 0,3 g grassi saturi, 5,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 6,0 g proteine, 3,00 g sale.
1181) Senape di Digione: 150 kcal, 11,0 g grassi, 0,8 g grassi saturi, 5,5 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 7,0 g proteine, 5,50 g sale.
1182) Salsa BBQ: 170 kcal, 0,5 g grassi, 0,1 g grassi saturi, 40,0 g carboidrati, 35,0 g zuccheri, 1,0 g fibre, 1,5 g proteine, 2,80 g sale.
1183) Salsa di Soia (Shoyu): 55 kcal, 0,1 g grassi, 0 g grassi saturi, 6,0 g carboidrati, 0,5 g zuccheri, 0,8 g fibre, 8,0 g proteine, 14,00 g sale.
1184) Salsa di Soia Tamari (Senza Glutine): 60 kcal, 0,1 g grassi, 0 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 0,8 g fibre, 10,0 g proteine, 13,50 g sale.
1185) Tabasco (Salsa di peperoncino): 12 kcal, 0,5 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0 g zuccheri, 0,5 g fibre, 1,0 g proteine, 1,80 g sale.
1186) Pesto alla Genovese (confezionato): 520 kcal, 52,0 g grassi, 8,5 g grassi saturi, 5,5 g carboidrati, 3,5 g zuccheri, 2,5 g fibre, 5,0 g proteine, 3,20 g sale.
1187) Pesto Rosso (confezionato): 380 kcal, 35,0 g grassi, 5,5 g grassi saturi, 12,0 g carboidrati, 6,5 g zuccheri, 3,0 g fibre, 4,5 g proteine, 3,00 g sale.
1188) Anice Stellato (intero): 337 kcal, 16,0 g grassi, 0,6 g grassi saturi, 50,0 g carboidrati, 0 g zuccheri, 15,0 g fibre, 18,0 g proteine, 0,04 g sale.
1189) Semi di Finocchio: 345 kcal, 15,0 g grassi, 0,5 g grassi saturi, 52,0 g carboidrati, 0 g zuccheri, 40,0 g fibre, 16,0 g proteine, 0,22 g sale.
1190) Semi di Coriandolo: 298 kcal, 17,8 g grassi, 1,0 g grassi saturi, 55,0 g carboidrati, 0 g zuccheri, 42,0 g fibre, 12,0 g proteine, 0,09 g sale.
1191) Semi di Cumino Nero (Nigella): 345 kcal, 15,0 g grassi, 0,5 g grassi saturi, 52,0 g carboidrati, 0 g zuccheri, 40,0 g fibre, 16,0 g proteine, 0,20 g sale.
1192) Cardamomo (semi in polvere): 311 kcal, 6,7 g grassi, 0,7 g grassi saturi, 68,0 g carboidrati, 0 g zuccheri, 28,0 g fibre, 11,0 g proteine, 0,04 g sale.
1193) Semi di Papavero: 525 kcal, 41,5 g grassi, 4,5 g grassi saturi, 28,0 g carboidrati, 3,0 g zuccheri, 19,5 g fibre, 18,0 g proteine, 0,06 g sale.
1194) Semi di Sesamo Bianchi: 573 kcal, 49,5 g grassi, 7,0 g grassi saturi, 23,5 g carboidrati, 0,3 g zuccheri, 11,8 g fibre, 17,7 g proteine, 0,03 g sale.
1195) Semi di Sesamo Neri: 565 kcal, 48,0 g grassi, 6,8 g grassi saturi, 25,0 g carboidrati, 0,5 g zuccheri, 14,0 g fibre, 18,0 g proteine, 0,03 g sale.
1196) Fieno Greco (semi): 323 kcal, 6,4 g grassi, 0,7 g grassi saturi, 58,0 g carboidrati, 0 g zuccheri, 24,5 g fibre, 23,0 g proteine, 0,17 g sale.
1197) Semi di Sedano (macinati): 392 kcal, 25,0 g grassi, 2,2 g grassi saturi, 41,0 g carboidrati, 0,7 g zuccheri, 12,0 g fibre, 18,0 g proteine, 0,40 g sale.
1199) Garam Masala (mix indiano): 340 kcal, 12,0 g grassi, 1,5 g grassi saturi, 58,0 g carboidrati, 2,0 g zuccheri, 30,0 g fibre, 13,0 g proteine, 0,15 g sale.
1200) Ras el Hanout (mix nordafricano): 330 kcal, 11,0 g grassi, 1,8 g grassi saturi, 55,0 g carboidrati, 3,0 g zuccheri, 28,0 g fibre, 12,0 g proteine, 0,20 g sale.
1201) Spezie per Tacos (mix messicano): 280 kcal, 8,0 g grassi, 1,2 g grassi saturi, 45,0 g carboidrati, 15,0 g zuccheri, 10,0 g fibre, 10,0 g proteine, 15,00 g sale.
1202) Baharat (mix mediorientale): 315 kcal, 10,0 g grassi, 1,4 g grassi saturi, 52,0 g carboidrati, 2,5 g zuccheri, 25,0 g fibre, 11,0 g proteine, 0,12 g sale.
1203) Spezie per Vin BrulÃ© (mix intero): 260 kcal, 4,0 g grassi, 0,8 g grassi saturi, 65,0 g carboidrati, 10,0 g zuccheri, 35,0 g fibre, 5,0 g proteine, 0,05 g sale.
1204) Shichimi Togarashi (mix giapponese): 380 kcal, 15,0 g grassi, 2,2 g grassi saturi, 48,0 g carboidrati, 5,0 g zuccheri, 18,0 g fibre, 14,0 g proteine, 1,50 g sale.
1205) Za'atar (mix con sesamo e timo): 410 kcal, 28,0 g grassi, 4,0 g grassi saturi, 35,0 g carboidrati, 1,5 g zuccheri, 15,0 g fibre, 12,0 g proteine, 3,50 g sale.
1206) Cinque Spezie Cinesi: 320 kcal, 9,0 g grassi, 1,2 g grassi saturi, 60,0 g carboidrati, 1,5 g zuccheri, 32,0 g fibre, 10,0 g proteine, 0,10 g sale.
1208) Pepe Verde (in salamoia): 85 kcal, 2,0 g grassi, 0,5 g grassi saturi, 15,0 g carboidrati, 0,5 g zuccheri, 5,0 g fibre, 2,0 g proteine, 4,50 g sale.
1209) Pepe Rosa (bacche intere): 320 kcal, 14,0 g grassi, 2,5 g grassi saturi, 45,0 g carboidrati, 5,0 g zuccheri, 12,0 g fibre, 10,0 g proteine, 0,02 g sale.
1210) Pepe Bianco macinato: 296 kcal, 2,1 g grassi, 0,6 g grassi saturi, 68,0 g carboidrati, 0,1 g zuccheri, 26,0 g fibre, 10,4 g proteine, 0,02 g sale.
1211) Zenzero fresco (radice): 80 kcal, 0,8 g grassi, 0,2 g grassi saturi, 18,0 g carboidrati, 1,7 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
1212) Rafano fresco (radice): 48 kcal, 0,7 g grassi, 0,1 g grassi saturi, 11,0 g carboidrati, 8,0 g zuccheri, 3,3 g fibre, 1,2 g proteine, 0,01 g sale.
1213) Wasabi in polvere (preparato): 350 kcal, 10,0 g grassi, 1,5 g grassi saturi, 55,0 g carboidrati, 20,0 g zuccheri, 8,0 g fibre, 12,0 g proteine, 1,20 g sale.
1214) Galanga (essiccata): 310 kcal, 2,5 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 2,0 g zuccheri, 12,0 g fibre, 6,0 g proteine, 0,08 g sale.
1215) Lemongrass (fresco): 99 kcal, 0,5 g grassi, 0,1 g grassi saturi, 25,0 g carboidrati, 0 g zuccheri, 0 g fibre, 1,8 g proteine, 0,01 g sale.
1216) Sommacco (Sumac) in polvere: 240 kcal, 12,0 g grassi, 2,0 g grassi saturi, 38,0 g carboidrati, 2,0 g zuccheri, 15,0 g fibre, 6,0 g proteine, 1,50 g sale.
1217) Pimento (Allspice) macinato: 263 kcal, 8,7 g grassi, 2,5 g grassi saturi, 72,0 g carboidrati, 0 g zuccheri, 21,6 g fibre, 6,1 g proteine, 0,19 g sale.
1218) Mace (Fiori di Noce Moscata): 475 kcal, 32,0 g grassi, 10,0 g grassi saturi, 50,0 g carboidrati, 25,0 g zuccheri, 20,0 g fibre, 6,7 g proteine, 0,20 g sale.
1219) Aglio in polvere: 330 kcal, 0,7 g grassi, 0,2 g grassi saturi, 72,0 g carboidrati, 24,0 g zuccheri, 9,0 g fibre, 16,5 g proteine, 0,15 g sale.
1221) Sale Rosa dell'Himalaya: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 97,00 g sale.
1222) Sale Marino Integrale: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 94,00 g sale.
1223) Sale Affumicato: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 96,00 g sale.
1224) Sale di Sedano (mix): 15 kcal, 0,5 g grassi, 2,0 g carboidrati, 1,0 g proteine, 75,00 g sale.
1226) Peperoncino Chipotle (affumicato): 280 kcal, 13,0 g grassi, 2,2 g grassi saturi, 50,0 g carboidrati, 8,0 g zuccheri, 28,0 g fibre, 12,0 g proteine, 0,15 g sale.
1227) Peperoncino Ancho (dolce/fruttato): 285 kcal, 12,0 g grassi, 2,0 g grassi saturi, 52,0 g carboidrati, 12,0 g zuccheri, 25,0 g fibre, 11,5 g proteine, 0,10 g sale.
1228) Peperoncino Cayenne in polvere: 318 kcal, 17,0 g grassi, 3,2 g grassi saturi, 56,0 g carboidrati, 10,0 g zuccheri, 27,0 g fibre, 12,0 g proteine, 0,08 g sale.
1229) Peperoncino Habanero (estremamente piccante): 310 kcal, 15,0 g grassi, 2,5 g grassi saturi, 54,0 g carboidrati, 9,0 g zuccheri, 26,0 g fibre, 13,0 g proteine, 0,05 g sale.
1230) Fiocchi di Peperoncino (Crushed Red Pepper): 300 kcal, 14,0 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 7,0 g zuccheri, 30,0 g fibre, 12,0 g proteine, 0,10 g sale.
1231) Peperoncino Aleppino (Pul Biber): 320 kcal, 16,0 g grassi, 2,8 g grassi saturi, 48,0 g carboidrati, 9,0 g zuccheri, 22,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso contiene sale aggiunto).
1233) Vaniglia in bacca (semi interni): 288 kcal, 12,0 g grassi, 2,5 g grassi saturi, 12,0 g carboidrati, 12,0 g zuccheri, 25,0 g fibre, 4,0 g proteine, 0,02 g sale.
1234) Estratto di Vaniglia (liquido): 250 kcal, 0,1 g grassi, 0 g grassi saturi, 12,0 g carboidrati, 12,0 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1235) Vanillina (sintetica): 390 kcal, 0 g grassi, 0 g grassi saturi, 98,0 g carboidrati, 98,0 g zuccheri, 0 g fibre, 0 g proteine, 0 g sale.
1236) Fava Tonka (grattugiata): 450 kcal, 25,0 g grassi, 10,0 g grassi saturi, 45,0 g carboidrati, 5,0 g zuccheri, 15,0 g fibre, 8,0 g proteine, 0,01 g sale.
1237) Lavanda alimentare (fiori secchi): 49 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 0 g zuccheri, 8,0 g fibre, 1,0 g proteine, 0,05 g sale.
1238) Liquirizia in polvere (pura): 320 kcal, 0,5 g grassi, 0,1 g grassi saturi, 75,0 g carboidrati, 15,0 g zuccheri, 5,0 g fibre, 4,0 g proteine, 0,10 g sale.
1240) Semi di Chia: 486 kcal, 31,0 g grassi, 3,3 g grassi saturi, 42,0 g carboidrati, 0 g zuccheri, 34,0 g fibre, 16,5 g proteine, 0,04 g sale.
1241) Semi di Zucca (decorticati): 559 kcal, 49,0 g grassi, 8,7 g grassi saturi, 10,7 g carboidrati, 1,4 g zuccheri, 6,0 g fibre, 30,0 g proteine, 0,02 g sale.
1242) Semi di Girasole: 584 kcal, 51,0 g grassi, 4,5 g grassi saturi, 20,0 g carboidrati, 2,6 g zuccheri, 8,6 g fibre, 21,0 g proteine, 0,03 g sale.
1243) Semi di Canapa (decorticati): 553 kcal, 48,0 g grassi, 4,5 g grassi saturi, 8,0 g carboidrati, 1,5 g zuccheri, 4,0 g fibre, 31,0 g proteine, 0,01 g sale.
1244) Semi di Senape Nera: 508 kcal, 36,0 g grassi, 2,0 g grassi saturi, 28,0 g carboidrati, 6,8 g zuccheri, 12,0 g fibre, 26,0 g proteine, 0,03 g sale.
1245) Semi di Senape Bianca: 470 kcal, 29,0 g grassi, 1,5 g grassi saturi, 35,0 g carboidrati, 7,0 g zuccheri, 15,0 g fibre, 25,0 g proteine, 0,03 g sale.
1247) Tandoori Masala (mix indiano): 320 kcal, 10,0 g grassi, 1,5 g grassi saturi, 50,0 g carboidrati, 5,0 g zuccheri, 25,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso salato).
1248) Dukkah (mix egiziano con frutta secca): 520 kcal, 42,0 g grassi, 5,5 g grassi saturi, 22,0 g carboidrati, 3,0 g zuccheri, 12,0 g fibre, 18,0 g proteine, 1,50 g sale.
1249) Jerk Seasoning (mix giamaicano): 250 kcal, 6,0 g grassi, 1,0 g grassi saturi, 45,0 g carboidrati, 20,0 g zuccheri, 10,0 g fibre, 8,0 g proteine, 10,00 g sale.
1250) Furikake (condimento riso giapponese): 400 kcal, 18,0 g grassi, 3,0 g grassi saturi, 40,0 g carboidrati, 15,0 g zuccheri, 5,0 g fibre, 20,0 g proteine, 8,00 g sale.
1251) Advieh (mix persiano): 310 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 5,0 g zuccheri, 30,0 g fibre, 7,0 g proteine, 0,05 g sale.
1253) Cipolla in fiocchi (essiccata): 340 kcal, 0,5 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 6,0 g zuccheri, 9,0 g fibre, 9,0 g proteine, 0,05 g sale.
1254) Ciboulette (Erba cipollina secca): 210 kcal, 3,5 g grassi, 0,6 g grassi saturi, 64,0 g carboidrati, 4,5 g zuccheri, 26,0 g fibre, 21,0 g proteine, 0,10 g sale.
1255) Dragoncello (Estragone) secco: 295 kcal, 7,0 g grassi, 1,8 g grassi saturi, 50,0 g carboidrati, 0 g zuccheri, 7,0 g fibre, 23,0 g proteine, 0,15 g sale.
1256) Cervoglio secco: 237 kcal, 3,9 g grassi, 0,2 g grassi saturi, 49,0 g carboidrati, 0 g zuccheri, 11,0 g fibre, 23,0 g proteine, 0,20 g sale.
1257) Kaffir Lime (foglie secche): 300 kcal, 5,0 g grassi, 1,0 g grassi saturi, 60,0 g carboidrati, 0 g zuccheri, 35,0 g fibre, 10,0 g proteine, 0,02 g sale.
1258) Pandan (foglie in polvere): 320 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 5,0 g zuccheri, 15,0 g fibre, 6,0 g proteine, 0,05 g sale.
1259) Assafetida (polvere): 295 kcal, 1,0 g grassi, 0,2 g grassi saturi, 68,0 g carboidrati, 0 g zuccheri, 4,0 g fibre, 4,0 g proteine, 0,03 g sale.
1260) Uovo di gallina sodo: 155 kcal, 10,6 g grassi, 3,3 g grassi saturi, 1,1 g carboidrati, 1,1 g zuccheri, 0 g fibre, 12,6 g proteine, 0,30 g sale.
1261) Uovo di gallina alla coque: 143 kcal, 9,5 g grassi, 3,1 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 12,6 g proteine, 0,32 g sale
1263) Uovo di quaglia (intero): 158 kcal, 11,0 g grassi, 3,5 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 13,0 g proteine, 0,35 g sale.
1264) Uovo di anatra (intero): 185 kcal, 13,8 g grassi, 3,7 g grassi saturi, 1,5 g carboidrati, 0,9 g zuccheri, 0 g fibre, 12,8 g proteine, 0,36 g sale.
1265) Uovo di oca (intero): 185 kcal, 13,3 g grassi, 3,6 g grassi saturi, 1,3 g carboidrati, 1,0 g zuccheri, 0 g fibre, 13,9 g proteine, 0,35 g sale.
1266) Uovo di tacchino (intero): 171 kcal, 11,9 g grassi, 3,6 g grassi saturi, 1,1 g carboidrati, 1,1 g zuccheri, 0 g fibre, 13,7 g proteine, 0,38 g sale.
1267) Uovo in polvere (intero disidratato): 595 kcal, 44,0 g grassi, 13,5 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 45,0 g proteine, 1,20 g sale.
1268) Albume in polvere (disidratato): 370 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 82,0 g proteine, 3,10 g sale.
1269) Tuorlo in polvere (disidratato): 660 kcal, 57,0 g grassi, 21,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 32,0 g proteine, 0,50 g sale.
1271) Olio Extravergine di Oliva (EVO): 899 kcal, 99,9 g grassi, 14,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1272) Olio di Oliva (comune): 899 kcal, 99,9 g grassi, 13,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1273) Olio di Girasole: 884 kcal, 100,0 g grassi, 11,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1274) Olio di Girasole Alto Oleico: 884 kcal, 100,0 g grassi, 8,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1275) Olio di Mais: 884 kcal, 100,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1276) Olio di Arachidi: 884 kcal, 100,0 g grassi, 17,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1277) Olio di Soia: 884 kcal, 100,0 g grassi, 15,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1278) Olio di Riso: 884 kcal, 100,0 g grassi, 19,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1279) Olio di Vinaccioli (semi d'uva): 884 kcal, 100,0 g grassi, 10,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1280) Olio di Lino (uso alimentare): 884 kcal, 100,0 g grassi, 9,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1281) Olio di Cocco (solido/liquido): 862 kcal, 99,0 g grassi, 86,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1282) Olio di Avocado: 884 kcal, 100,0 g grassi, 11,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1283) Olio di Sesamo: 884 kcal, 100,0 g grassi, 14,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1284) Olio di Noce: 884 kcal, 100,0 g grassi, 9,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1285) Olio di Nocciola: 884 kcal, 100,0 g grassi, 7,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1286) Olio di Semi di Zucca: 884 kcal, 100,0 g grassi, 18,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1287) Olio di Palma (grezzo): 884 kcal, 100,0 g grassi, 49,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1289) Burro chiarificato (Ghee): 876 kcal, 99,0 g grassi, 62,0 g grassi saturi, 0,5 g carboidrati, 0,5 g proteine, 0 g sale.
1290) Strutto (Grasso di suino): 892 kcal, 99,0 g grassi, 39,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1291) Sego (Grasso di bovino): 900 kcal, 100,0 g grassi, 50,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1292) Margarina vegetale (100% vegetale): 715 kcal, 80,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0,2 g proteine, 0,50 g sale.
1293) Margarina vegetale Light (40% grassi): 360 kcal, 40,0 g grassi, 10,0 g grassi saturi, 1,5 g carboidrati, 0,2 g proteine, 0,60 g sale.
1295) Aceto di Vino Bianco: 18 kcal, 0 g grassi, 0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1296) Aceto di Vino Rosso: 19 kcal, 0 g grassi, 0 g grassi saturi, 0,3 g carboidrati, 0,3 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1297) Aceto di Mele: 21 kcal, 0 g grassi, 0 g grassi saturi, 0,9 g carboidrati, 0,4 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1298) Aceto Balsamico di Modena IGP: 120 kcal, 0 g grassi, 0 g grassi saturi, 25,0 g carboidrati, 25,0 g zuccheri, 0 g fibre, 0,5 g proteine, 0,10 g sale.
1299) Glassa all'Aceto Balsamico: 220 kcal, 0 g grassi, 0 g grassi saturi, 52,0 g carboidrati, 48,0 g zuccheri, 0 g fibre, 0,5 g proteine, 0,15 g sale.
1300) Aceto di Riso: 18 kcal, 0 g grassi, 0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1301) Aceto di Alcool (per conserve): 15 kcal, 0 g grassi, 0 g grassi saturi, 0,1 g carboidrati, 0 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1302) Succo di Limone (fresco): 22 kcal, 0,2 g grassi, 0 g grassi saturi, 6,9 g carboidrati, 2,5 g zuccheri, 0,3 g fibre, 0,4 g proteine, 0,01 g sale.
1303) Succo di Lime (fresco): 30 kcal, 0,2 g grassi, 0 g grassi saturi, 10,5 g carboidrati, 1,7 g zuccheri, 0,4 g fibre, 0,7 g proteine, 0,01 g sale.
1305) Tahina (crema di sesamo): 595 kcal, 54,0 g grassi, 8,0 g grassi saturi, 21,0 g carboidrati, 0,5 g zuccheri, 9,0 g fibre, 17,0 g proteine, 0,30 g sale.
1306) Pasta d'Aglio: 150 kcal, 0,5 g grassi, 0,1 g grassi saturi, 30,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 6,0 g proteine, 1,50 g sale.
1307) Pasta di Wasabi (tubetto): 290 kcal, 9,0 g grassi, 1,3 g grassi saturi, 46,0 g carboidrati, 18,0 g zuccheri, 5,0 g fibre, 5,0 g proteine, 3,50 g sale.
1308) Miso Chiaro (pasta di soia): 198 kcal, 6,0 g grassi, 1,0 g grassi saturi, 25,0 g carboidrati, 6,0 g zuccheri, 5,0 g fibre, 12,0 g proteine, 11,50 g sale.
1309) Miso Scuro: 190 kcal, 6,0 g grassi, 1,0 g grassi saturi, 20,0 g carboidrati, 2,0 g zuccheri, 5,0 g fibre, 14,0 g proteine, 12,50 g sale.
1311) Burro Salato: 717 kcal, 81,0 g grassi, 51,0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,8 g proteine, 2,00 g sale.
1312) Burro di Centrifuga (Alta QualitÃ ): 750 kcal, 83,0 g grassi, 53,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1313) Burro Alleggerito (metÃ  grassi): 380 kcal, 41,0 g grassi, 26,0 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 1,0 g proteine, 0,10 g sale.
1314) Burro alle Erbe (confezionato): 680 kcal, 74,0 g grassi, 46,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 1,2 g proteine, 1,50 g sale.
1315) Burro all'Aglio: 690 kcal, 75,0 g grassi, 47,0 g grassi saturi, 3,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 1,5 g proteine, 1,40 g sale.
1316) Burro di Bufala: 740 kcal, 82,0 g grassi, 55,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,8 g proteine, 0,05 g sale.
1317) Burro di Capra: 735 kcal, 81,5 g grassi, 54,0 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 0,9 g proteine, 0,05 g sale.
1319) Margarina con Fitosteroli (per il colesterolo): 450 kcal, 50,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,45 g sale.
1320) Margarina per Sfoglia (professionale): 720 kcal, 80,0 g grassi, 45,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0,1 g proteine, 0,10 g sale.
1321) Margarina al Mais: 710 kcal, 79,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0,2 g proteine, 0,50 g sale.
1322) Margarina senza Olio di Palma: 630 kcal, 70,0 g grassi, 15,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,40 g sale.
1323) Shortening vegetale (Grasso vegetale puro): 884 kcal, 100,0 g grassi, 50,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1325) Olio di Mandorle (uso alimentare): 884 kcal, 100,0 g grassi, 8,2 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1326) Olio di Pistacchio: 884 kcal, 100,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1327) Olio di Argan (uso alimentare): 884 kcal, 100,0 g grassi, 19,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1328) Olio di Canola (Colza a basso acido erucico): 884 kcal, 100,0 g grassi, 7,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1329) Olio di Cotone: 884 kcal, 100,0 g grassi, 26,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1330) Olio di Cartamo: 884 kcal, 100,0 g grassi, 6,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1331) Olio di Macadamia: 884 kcal, 100,0 g grassi, 12,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1332) Olio di Neem (tracce in integratori): 884 kcal, 100,0 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1334) Olio Extravergine Spray (1 secondo di erogazione ~1,8ml): 820 kcal (valore teorico per 100ml), 91,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1335) Olio al Peperoncino (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0,2 g fibre, 0,1 g proteine, 0,01 g sale.
1336) Olio al Limone (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,8 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1337) Olio al Basilico (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1339) Grasso d'Anatra (Duck Fat): 882 kcal, 99,8 g grassi, 33,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1340) Grasso d'Oca (Goose Fat): 895 kcal, 99,5 g grassi, 28,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1341) Grasso di Pollo (Schmaltz): 898 kcal, 99,8 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1342) Pane Grattugiato e Preparati per Panatura (Valori per 100 g)
1343) Pane grattugiato classico (di grano tenero): 350 kcal, 1,5 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 4,5 g fibre, 12,0 g proteine, 1,50 g sale.
1344) Pane grattugiato integrale: 325 kcal, 2,5 g grassi, 0,6 g grassi saturi, 60,0 g carboidrati, 3,0 g zuccheri, 11,0 g fibre, 13,5 g proteine, 1,30 g sale.
1345) Panko (pane grattugiato giapponese): 365 kcal, 2,0 g grassi, 0,5 g grassi saturi, 75,0 g carboidrati, 4,0 g zuccheri, 2,5 g fibre, 11,0 g proteine, 1,10 g sale.
1346) Pane grattugiato senza glutine (riso/mais): 360 kcal, 2,2 g grassi, 0,5 g grassi saturi, 78,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 1,40 g sale.
1347) Pane grattugiato aromatizzato (erbe e aglio): 355 kcal, 3,5 g grassi, 0,8 g grassi saturi, 68,0 g carboidrati, 3,2 g zuccheri, 4,2 g fibre, 11,5 g proteine, 2,20 g sale.
1348) Pane grattugiato di mais (per panature croccanti): 370 kcal, 1,2 g grassi, 0,2 g grassi saturi, 80,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,05 g sale.
1349) Farina di Galletta (pane grattugiato finissimo): 380 kcal, 4,0 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 1,80 g sale.
1351) Confettura di Fragole: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 1 g proteine, 0,02 g sale.
1352) Confettura di Fragole Extra (piÃ¹ frutta): 190 kcal, 0 g grassi, 45 g carboidrati, 42 g zuccheri, 0,8 g proteine, 0,01 g sale.
1353) Confettura di Albicocche: 245 kcal, 0 g grassi, 60 g carboidrati, 57 g zuccheri, 0,7 g proteine, 0,02 g sale.
1354) Marmellata di Arance (con scorzette): 250 kcal, 0 g grassi, 61 g carboidrati, 58 g zuccheri, 0,5 g proteine, 0,03 g sale.
1355) Marmellata di Arance Amare: 260 kcal, 0 g grassi, 63 g carboidrati, 60 g zuccheri, 0,4 g proteine, 0,03 g sale.
1356) Confettura di Ciliegie: 255 kcal, 0,2 g grassi, 62 g carboidrati, 59 g zuccheri, 0,8 g proteine, 0,02 g sale.
1357) Confettura di Amarene: 260 kcal, 0 g grassi, 63 g carboidrati, 60 g zuccheri, 1 g proteine, 0,02 g sale.
1358) Confettura di Pesche: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 0,6 g proteine, 0,02 g sale.
1359) Confettura di Frutti di Bosco: 245 kcal, 0,3 g grassi, 59 g carboidrati, 56 g zuccheri, 1,1 g proteine, 0,02 g sale.
1360) Confettura di Lamponi: 240 kcal, 0,3 g grassi, 57 g carboidrati, 54 g zuccheri, 1,2 g proteine, 0,01 g sale.
1361) Confettura di Mirtilli: 235 kcal, 0,2 g grassi, 56 g carboidrati, 53 g zuccheri, 0,7 g proteine, 0,01 g sale.
1362) Confettura di More: 230 kcal, 0,2 g grassi, 55 g carboidrati, 52 g zuccheri, 1,3 g proteine, 0,01 g sale.
1363) Confettura di Prugne/Susine: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 0,6 g proteine, 0,02 g sale.
1364) Confettura di Fichi: 265 kcal, 0,2 g grassi, 64 g carboidrati, 61 g zuccheri, 0,9 g proteine, 0,03 g sale.
1365) Confettura di Pere: 230 kcal, 0 g grassi, 56 g carboidrati, 53 g zuccheri, 0,4 g proteine, 0,02 g sale.
1366) Confettura di Mele e Cannella: 220 kcal, 0,1 g grassi, 54 g carboidrati, 51 g zuccheri, 0,3 g proteine, 0,02 g sale.
1367) Confettura di Cotogne (Cotognata): 280 kcal, 0 g grassi, 68 g carboidrati, 65 g zuccheri, 0,4 g proteine, 0,05 g sale.
1368) Marmellata di Limoni: 245 kcal, 0 g grassi, 60 g carboidrati, 57 g zuccheri, 0,5 g proteine, 0,04 g sale.
1370) Confettura 100% frutta (solo zuccheri della frutta): 150 kcal, 0,2 g grassi, 35 g carboidrati, 33 g zuccheri, 0,8 g proteine, 0,01 g sale.
1371) Confettura Light (ridotto contenuto calorico/dolcificanti): 80 kcal, 0 g grassi, 18 g carboidrati, 15 g zuccheri, 0,5 g proteine, 0,05 g sale.
1372) Confettura di Castagne (Crema di Marroni): 275 kcal, 1,2 g grassi, 62 g carboidrati, 55 g zuccheri, 1,5 g proteine, 0,03 g sale.
1373) Confettura di Pomodori Verdi: 230 kcal, 0,1 g grassi, 55 g carboidrati, 53 g zuccheri, 1,2 g proteine, 0,10 g sale.
1374) Confettura di Peperoncino: 260 kcal, 0,3 g grassi, 63 g carboidrati, 60 g zuccheri, 0,8 g proteine, 0,25 g sale.
1375) Confettura di Cipolle Rosse: 210 kcal, 0,1 g grassi, 50 g carboidrati, 48 g zuccheri, 1,1 g proteine, 0,30 g sale.
1377) Crema spalmabile Nocciole e Cacao (tipo Nutella): 539 kcal, 30,9 g grassi, 10,6 g grassi saturi, 57,5 g carboidrati, 56,3 g zuccheri, 6,3 g proteine, 0,10 g sale.
1378) Crema di Nocciole 100% (pura): 650 kcal, 60 g grassi, 4,5 g grassi saturi, 10 g carboidrati, 4 g zuccheri, 15 g proteine, 0,01 g sale.
1379) Crema di Pistacchio (dolce): 580 kcal, 38 g grassi, 12 g grassi saturi, 48 g carboidrati, 45 g zuccheri, 8 g proteine, 0,15 g sale.
1380) Crema di Pistacchio 100% (pura): 610 kcal, 50 g grassi, 6 g grassi saturi, 12 g carboidrati, 5 g zuccheri, 20 g proteine, 0,02 g sale.
1381) Crema di Mandorle (dolce): 570 kcal, 35 g grassi, 4 g grassi saturi, 52 g carboidrati, 48 g zuccheri, 9 g proteine, 0,10 g sale.
1382) Crema di Mandorle 100% (pura): 620 kcal, 52 g grassi, 4 g grassi saturi, 10 g carboidrati, 4 g zuccheri, 22 g proteine, 0,01 g sale.
1383) Crema di Arachidi (Burro d'Arachidi "Creamy"): 588 kcal, 50 g grassi, 10 g grassi saturi, 20 g carboidrati, 9 g zuccheri, 25 g proteine, 0,40 g sale.
1384) Burro d'Arachidi "Crunchy" (con pezzi): 590 kcal, 50 g grassi, 10 g grassi saturi, 19 g carboidrati, 8 g zuccheri, 24 g proteine, 0,45 g sale.
1385) Burro d'Arachidi 100% (senza sale/zuccheri aggiunti): 600 kcal, 51 g grassi, 8 g grassi saturi, 12 g carboidrati, 5 g zuccheri, 28 g proteine, 0,01 g sale.
1386) Crema spalmabile al Cioccolato Bianco: 570 kcal, 36 g grassi, 12 g grassi saturi, 55 g carboidrati, 55 g zuccheri, 5 g proteine, 0,20 g sale.
1387) Crema spalmabile al Cioccolato Fondente: 540 kcal, 35 g grassi, 14 g grassi saturi, 45 g carboidrati, 42 g zuccheri, 6 g proteine, 0,05 g sale.
1388) Crema spalmabile al Caramello Salato: 450 kcal, 25 g grassi, 15 g grassi saturi, 55 g carboidrati, 52 g zuccheri, 2 g proteine, 1,20 g sale.
1389) Crema Lotus (Biscoff - biscotti caramellati): 584 kcal, 38 g grassi, 7 g grassi saturi, 57 g carboidrati, 36 g zuccheri, 3 g proteine, 0,50 g sale.
1390) Crema al Gianduia (Artigianale): 560 kcal, 36 g grassi, 9 g grassi saturi, 48 g carboidrati, 44 g zuccheri, 9 g proteine, 0,08 g sale.
1392) Miele (Millefiori/Acacia/Castagno): 304 kcal, 0 g grassi, 82 g carboidrati, 80 g zuccheri, 0,3 g proteine, 0,01 g sale.
1393) Sciroppo d'Acero: 260 kcal, 0 g grassi, 67 g carboidrati, 60 g zuccheri, 0 g proteine, 0,03 g sale.
1394) Sciroppo d'Agave: 310 kcal, 0,5 g grassi, 76 g carboidrati, 68 g zuccheri, 0 g proteine, 0,01 g sale.
1395) Melassa: 290 kcal, 0,1 g grassi, 75 g carboidrati, 70 g zuccheri, 0 g proteine, 0,10 g sale.
1396) Malto d'Orzo: 315 kcal, 0 g grassi, 77 g carboidrati, 50 g zuccheri, 4 g proteine, 0,15 g sale.
1397) Malto di Riso: 320 kcal, 0 g grassi, 80 g carboidrati, 55 g zuccheri, 1 g proteine, 0,10 g sale.
1399) Dulce de Leche (crema di latte): 315 kcal, 7 g grassi, 4 g grassi saturi, 55 g carboidrati, 52 g zuccheri, 6 g proteine, 0,30 g sale.
1400) Marmite (estratto di lievito - UK): 260 kcal, 0,5 g grassi, 30 g carboidrati, 1,2 g zuccheri, 34 g proteine, 10,80 g sale.
1401) Vegemite (estratto di lievito - Australia): 180 kcal, 0,5 g grassi, 20 g carboidrati, 2,5 g zuccheri, 25 g proteine, 8,50 g sale.
1402) Lemon Curd (crema di limone inglese): 300 kcal, 12 g grassi, 7 g grassi saturi, 45 g carboidrati, 42 g zuccheri, 2 g proteine, 0,20 g sale.
1403) Marshmallow Fluff (crema di marshmallow): 330 kcal, 0 g grassi, 84 g carboidrati, 50 g zuccheri, 1 g proteine, 0,10 g sale.
1404) Crema di Cocco (spalmabile dolce): 450 kcal, 30 g grassi, 26 g grassi saturi, 40 g carboidrati, 38 g zuccheri, 3 g proteine, 0,10 g sale.
1405) Nutella (Ferrero): 539 kcal, 30,9 g grassi, 10,6 g grassi saturi, 57,5 g carboidrati, 56,3 g zuccheri, 6,3 g proteine, 0,10 g sale.
1406) Crema Novi (45% nocciole): 546 kcal, 37,0 g grassi, 5,5 g grassi saturi, 41,0 g carboidrati, 38,0 g zuccheri, 10,0 g proteine, 0,05 g sale.
1407) Nocciolata Rigoni di Asiago (Classica): 533 kcal, 30,0 g grassi, 6,0 g grassi saturi, 54,0 g carboidrati, 51,0 g zuccheri, 8,2 g proteine, 0,11 g sale.
1408) Nocciolata Rigoni di Asiago (Senza Latte/Vegan): 536 kcal, 31,0 g grassi, 5,7 g grassi saturi, 53,0 g carboidrati, 51,0 g zuccheri, 6,0 g proteine, 0 g sale.
1409) Pan di Stelle Crema (Barilla): 527 kcal, 30,2 g grassi, 5,3 g grassi saturi, 53,1 g carboidrati, 51,0 g zuccheri, 8,3 g proteine, 0,11 g sale.
1410) Crema Valsoia (100% vegetale): 535 kcal, 32,0 g grassi, 5,6 g grassi saturi, 54,0 g carboidrati, 52,0 g zuccheri, 5,5 g proteine, 0,08 g sale.
1411) Lindt Crema Spalmabile Fondente: 550 kcal, 38,0 g grassi, 11,0 g grassi saturi, 44,0 g carboidrati, 40,0 g zuccheri, 5,4 g proteine, 0,10 g sale.
1412) Ovomaltine Crunchy Cream: 545 kcal, 32,0 g grassi, 7,1 g grassi saturi, 59,5 g carboidrati, 54,5 g zuccheri, 3,8 g proteine, 0,25 g sale.
1414) Santa Rosa (Albicocche - Confettura classica): 190 kcal, 0,1 g grassi, 46,0 g carboidrati, 43,0 g zuccheri, 0,4 g proteine, 0,02 g sale.
1415) Zuegg 100% da Frutta (Fragole): 141 kcal, 0,2 g grassi, 32,0 g carboidrati, 30,0 g zuccheri, 0,7 g proteine, 0,06 g sale.
1416) Fiordifrutta Rigoni di Asiago (Frutti di Bosco): 159 kcal, 0 g grassi, 38,0 g carboidrati, 35,0 g zuccheri, 0,7 g proteine, 0,05 g sale.
1417) Hero Light (Ciliegie - con dolcificanti): 71 kcal, 0,2 g grassi, 20,0 g carboidrati, 5,0 g zuccheri, 0,5 g proteine, 0,01 g sale.
1418) Marmellata di Arance Amare McVitie's: 255 kcal, 0,1 g grassi, 62,0 g carboidrati, 55,0 g zuccheri, 0,3 g proteine, 0,10 g sale.
1419) D'Arbo Naturrein (Lamponi - Extra): 191 kcal, 0,1 g grassi, 45,0 g carboidrati, 45,0 g zuccheri, 0,6 g proteine, 0 g sale.
1420) Bonne Maman (Confettura di Pesche): 241 kcal, 0,1 g grassi, 59,0 g carboidrati, 59,0 g zuccheri, 0,4 g proteine, 0 g sale.
1422) Lotus Biscoff Spalmabile (Originale): 584 kcal, 38,1 g grassi, 7,6 g grassi saturi, 57,0 g carboidrati, 36,8 g zuccheri, 2,9 g proteine, 0,54 g sale.
1423) Peanut Butter CalvÃ© (Classico): 647 kcal, 54,0 g grassi, 9,5 g grassi saturi, 11,0 g carboidrati, 6,4 g zuccheri, 21,0 g proteine, 0,58 g sale.
1424) Skippy Peanut Butter (Creamy): 588 kcal, 50,0 g grassi, 10,0 g grassi saturi, 20,0 g carboidrati, 10,0 g zuccheri, 23,0 g proteine, 1,20 g sale.
1425) Prozis Choco Butter (Alto proteico): 520 kcal, 36,0 g grassi, 8,0 g grassi saturi, 30,0 g carboidrati, 2,5 g zuccheri (polioli), 24,0 g proteine, 0,10 g sale.
1426) Crema di Arachidi Fiorentini (100% arachidi): 601 kcal, 48,9 g grassi, 6,4 g grassi saturi, 8,4 g carboidrati, 4,9 g zuccheri, 27,6 g proteine, 0,01 g sale.
1428) Mielizia Miele di Castagno: 304 kcal, 0 g grassi, 82,0 g carboidrati, 80,0 g zuccheri, 0,3 g proteine, 0,01 g sale.
1429) Sciroppo d'Acero MapleFarm (Grado A): 260 kcal, 0 g grassi, 67,0 g carboidrati, 60,0 g zuccheri, 0 g proteine, 0,03 g sale.
1430) Dulce de Leche Mardel: 310 kcal, 6,0 g grassi, 4,1 g grassi saturi, 57,0 g carboidrati, 55,0 g zuccheri, 7,0 g proteine, 0,30 g sale.
1431) Fluff Marshmallow Spread: 330 kcal, 0 g grassi, 84,0 g carboidrati, 50,0 g zuccheri, 1,0 g proteine, 0,10 g sale.
1432) Giraudi Crema Giacometta (32% Nocciole): 572 kcal, 40,0 g grassi, 12,0 g grassi saturi, 44,0 g carboidrati, 41,0 g zuccheri, 7,5 g proteine, 0,05 g sale.
1434) Foodspring Protein Cream (Nocciola): 519 kcal, 37,0 g grassi, 8,5 g grassi saturi, 33,0 g carboidrati, 7,2 g zuccheri (contiene polioli), 21,0 g proteine, 0,20 g sale.
1435) Prozis Whey Choco (Burro di arachidi e cioccolato): 540 kcal, 40,0 g grassi, 9,5 g grassi saturi, 25,0 g carboidrati, 2,2 g zuccheri, 25,0 g proteine, 0,15 g sale.
1436) Enervit Protein Cream (Fondente): 495 kcal, 35,0 g grassi, 11,0 g grassi saturi, 30,0 g carboidrati, 1,5 g zuccheri, 22,0 g proteine, 0,10 g sale.
1437) Crema Proteica MyProtein (Cioccolato Bianco): 525 kcal, 38,0 g grassi, 9,0 g grassi saturi, 32,0 g carboidrati, 6,5 g zuccheri, 20,0 g proteine, 0,15 g sale.
1438) Grenade Carb Killa Spread (Hazel Nutter): 520 kcal, 38,0 g grassi, 9,0 g grassi saturi, 33,0 g carboidrati, 5,6 g zuccheri, 20,0 g proteine, 0,25 g sale.
1439) Crema spalmabile "Zero" (senza zuccheri aggiunti - generica): 480 kcal, 35,0 g grassi, 8,0 g grassi saturi, 45,0 g carboidrati, 2,0 g zuccheri, 6,0 g proteine, 0,10 g sale.
1441) Burro di Mandorle Pelate (Damiano/Bio): 635 kcal, 56,0 g grassi, 4,5 g grassi saturi, 5,0 g carboidrati, 4,0 g zuccheri, 11,0 g fibre, 23,0 g proteine, 0,01 g sale.
1442) Crema di Anacardi 100%: 590 kcal, 47,0 g grassi, 9,0 g grassi saturi, 22,0 g carboidrati, 5,5 g zuccheri, 3,0 g fibre, 18,0 g proteine, 0,02 g sale.
1443) Crema di Noci 100%: 680 kcal, 65,0 g grassi, 6,0 g grassi saturi, 12,0 g carboidrati, 2,5 g zuccheri, 6,5 g fibre, 15,0 g proteine, 0,01 g sale.
1444) Tahin (Crema di Sesamo Bio - Scuri): 610 kcal, 55,0 g grassi, 8,5 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 14,0 g fibre, 21,0 g proteine, 0,05 g sale.
1445) Burro di Macadamia 100%: 725 kcal, 75,0 g grassi, 12,0 g grassi saturi, 13,0 g carboidrati, 4,5 g zuccheri, 8,5 g fibre, 8,0 g proteine, 0,01 g sale.
1446) Crema di Pinoli 100%: 675 kcal, 68,0 g grassi, 5,0 g grassi saturi, 13,0 g carboidrati, 3,5 g zuccheri, 3,8 g fibre, 14,0 g proteine, 0,01 g sale.
1448) Crema Galak (NestlÃ© - Cioccolato Bianco): 565 kcal, 35,5 g grassi, 10,5 g grassi saturi, 56,5 g carboidrati, 56,0 g zuccheri, 4,5 g proteine, 0,25 g sale.
1449) Crema Baci Perugina: 545 kcal, 33,0 g grassi, 8,5 g grassi saturi, 52,0 g carboidrati, 50,0 g zuccheri, 7,0 g proteine, 0,10 g sale.
1450) Crema Twix (con biscotto e caramello): 560 kcal, 35,0 g grassi, 9,5 g grassi saturi, 57,0 g carboidrati, 54,0 g zuccheri, 3,0 g proteine, 0,40 g sale.
1451) Crema Bounty (al cocco): 585 kcal, 39,0 g grassi, 15,0 g grassi saturi, 54,0 g carboidrati, 54,0 g zuccheri, 2,5 g proteine, 0,20 g sale.
1452) Maltesers Teasers Spread: 545 kcal, 32,0 g grassi, 10,0 g grassi saturi, 59,0 g carboidrati, 54,0 g zuccheri, 4,0 g proteine, 0,35 g sale.
1453) Venchi Crema Suprema (XV - 0% Olio di Palma): 560 kcal, 37,0 g grassi, 6,5 g grassi saturi, 45,0 g carboidrati, 41,0 g zuccheri, 8,5 g proteine, 0,05 g sale.
1454) Pernigotti Crema Gianduia (Nera): 540 kcal, 34,0 g grassi, 6,0 g grassi saturi, 48,0 g carboidrati, 45,0 g zuccheri, 9,5 g proteine, 0,05 g sale.
1455) Babbi Cremadelizia (Cacao/Nocciola): 545 kcal, 35,0 g grassi, 9,0 g grassi saturi, 50,0 g carboidrati, 48,0 g zuccheri, 8,0 g proteine, 0,10 g sale.
1457) Marshmallow Fluff (Strawberry): 330 kcal, 0 g grassi, 84,0 g carboidrati, 45,0 g zuccheri, 1,0 g proteine, 0,10 g sale.
1458) Cadbury Milk Chocolate Spread: 560 kcal, 35,0 g grassi, 8,5 g grassi saturi, 56,0 g carboidrati, 55,0 g zuccheri, 4,0 g proteine, 0,15 g sale.
1459) Jif Peanut Butter (USA): 595 kcal, 50,0 g grassi, 10,5 g grassi saturi, 22,0 g carboidrati, 10,0 g zuccheri, 23,0 g proteine, 1,30 g sale.
1460) GoÃ»t de Caramel (Crema di caramello salato francese): 430 kcal, 22,0 g grassi, 14,0 g grassi saturi, 58,0 g carboidrati, 55,0 g zuccheri, 1,5 g proteine, 1,10 g sale.
1461) Kaya (Crema di cocco e uova del Sud-Est Asiatico): 320 kcal, 14,0 g grassi, 11,0 g grassi saturi, 45,0 g carboidrati, 40,0 g zuccheri, 4,0 g proteine, 0,15 g sale.
1463) Uovo di quaglia (intero): 158 kcal, 11,0 g grassi, 3,5 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 13,0 g proteine, 0,35 g sale.
1464) Lingue di Gatto (Vicenzi): 460 kcal, 15,0 g grassi, 9,0 g grassi saturi, 72,0 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 8,5 g proteine, 0,35 g sale
1465) BioSottile (Probios): 410 kcal, 9,5 g grassi, 1,2 g grassi saturi, 72,0 g carboidrati, 18,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,50 g sale
1466) Bresaola della Valtellina IGP (Punta d'Anca): 151 kcal, 2,0 g grassi, 0,7 g grassi saturi, 0,5 g carboidrati, 0,5 g uccheri, 0 g fibre, 32,0 g proteine, 3,80 g sale.
1467) Uova spina: kcal 44, proteine 0.9g, grassi 0.6g, carboidrati 10.0g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
1468) Wurstel (suino): kcal 269, proteine 13.0g, grassi 23.0g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B1
1469) Zampone di Modena IGP (cotto): 320 kcal, 26,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,10 g sale
1472) Pasta di Lenticchie Rosse (confezionati): 335 kcal, 1,7 g grassi, 0,4 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 11,0 g fibre, 25,0 g proteine, 0,01 g sale.
1476) Chicche di patate (confezionati): 165 kcal, 0,5 g grassi, 0,1 g grassi saturi, 35,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale
1477) Scialatielli freschi (confezionati): 265 kcal, 1,5 g grassi, 0,4 g grassi saturi, 54,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,20 g sale.
1481) Pasta al tartufo (confezionata): 360 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 13,5 g proteine, 0,10 g sale
1484) Muesli croccante al cioccolato (confezionati): 470 kcal, 19,0 g grassi, 9,0 g grasi saturi, 61,0 g carboidrati, 25,0 g zuccheri, 7,5 g fibre, 9,0 g proteine, 0,15 g sale.
1486) Riso Arborio/Carnaroli (confezionati): 345 kcal, 0,6 g grassi, 0,1g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
1487) Orzo perlato (a crudo) (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 9,0 g fibre, 10,0 g proteine, 0,01 g sale
1488) Tagliatelle di riso integrale (confezionate): 350 kcal, 2,8 g grassi, 0,6 g grasi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,05 g sale.
1489) Malto d'Orzo: 315 kcal, 0 g grassi, 77 g carboidrati, 50 g zuccheri, 4 g proteine, 0,15 g sale
1490) Pepe Verde (in salamoia): 85 kcal, 2,0 g grassi,0,5 g grassi saturi, 15,0 g carboidrati, 0,5 g zuccheri, 5,0 g fibre, 2,0 g proteine, 4,50 g sale.
1491) Peperoncino Aleppino (Pul Biber): 320 kcal, 16,0 g grassi, 2,8 g grassi saturi, 48,0 g carboidrati, 9,0 g zuccheri, 22,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso contiene sale aggiunto)
1492) Advieh (mix persiano): 310 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 5,0 g zuccheri, 30,0 g fibre, 7,0 g proteine, 0,05 g sale
1493) Mascarpone SL (confezionato): 440 kcal, 46,5 g grassi, 31,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 4,2 g proteine, 0,11 g sale.
1494) Yogurt greco 0% grassi (confezionato): 55 kcal, 0 g grassi, 0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 10,0 g proteine, 0,10 g sal.
1495) Yogurt greco 0% SL (confezionato): 57 kcal, 0 g grassi, 0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,11 g sale.
1496) Mozzarella di Bufala Campana DOP (confezionaa): 288 kcal, 24,5 g grassi, 17,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 16,5 g proteine, 0,60 g sale.
1497) Burro tradizionale (confezionato): 717 kcal, 80,0 g grassi, 52,0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1498) Burro SL (confezionato): 717 kcal, 80,0 g grassi, 52,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1499) Burro chiarificato (Ghee) (confezionato): 895 kcal, 99,5 g grassi, 65,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale. (Naturalmente SL)
1500) Burro Light (a ridotto contenuto di grassi) (confezionato): 380 kcal, 40,0 g grassi, 26,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 2,0 g proteine, 0,10 g sale.
1501) Yogurt greco alla frutta (confezionato): 110 kcal, 4,0 g grassi, 2,8 g grassi satur 12,0 g carboidrati, 11,0 g zuccheri, 0,5 g fibre, 7,5 g proteine, 0,12 g sale.
1502) Formaggi a Pasta Semidura e Dura (Varianti Regionali e Estere)
1503) Formaggi Freschissimi e Formaggi "a Pasta Cruda"
1504) Yogurt, Latti Fermentati e Dessert (Banco Frigo)
1511) Uovo di gallina alla coque: 143 kcal, 9,5 g grassi, 3,1 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 12,6 g proteine, 0,32 g sale.
1515) Margarina con Fitosteroli: 450 kcal, 50,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,45 g sale.
1516) Oli di Semi e Frutta a Guscio
1517) Olio di Canola (Colza): 884 kcal, 100,0 g grassi, 7,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1518) Olio di Neem (tracce): 884 kcal, 100,0 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1519) Condimenti Grassi Spray e Infusi
1520) Olio Extravergine Spray (teorico): 820 kcal, 91,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1521) Olio al Peperoncino: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0,2 g fibre, 0,1 g proteine, 0,01 g sale.
1522) Olio al Limone: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,8 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1523) Olio al Basilico: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1524) Pane Grattugiato e Panature
1525) Pane grattugiato classico: 350 kcal, 1,5 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 4,5 g fibre, 12,0 g proteine, 1,50 g sale.
1526) Panko: 365 kcal, 2,0 g grassi, 0,5 g grassi saturi, 75,0 g carboidrati, 4,0 g zuccheri, 2,5 g fibre, 11,0 g proteine, 1,10 g sale.
1527) Pane grattugiato senza glutine: 360 kcal, 2,2 g grassi, 0,5 g grassi saturi, 78,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 1,40 g sale.
1528) Pane grattugiato aromatizzato: 355 kcal, 3,5 g grassi, 0,8 g grassi saturi, 68,0 g carboidrati, 3,2 g zuccheri, 4,2 g fibre, 11,5 g proteine, 2,20 g sale.
1529) Pane grattugiato di mais: 370 kcal, 1,2 g grassi, 0,2 g grassi saturi, 80,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,05 g sale.
1530) Farina di Galletta: 380 kcal, 4,0 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 1,80 g sale.
1531) Pomodoro da insalata: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
1532) Lattuga Romana: 17 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 1,2 g proteine, 0,02 g sale.
1533) Cavoli e Crocifere Broccolo: 34 kcal, 0,4 g grassi, 0,0 g grassi saturi, 6,6 g carboidrati, 1,7 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,03 g sale.
1534) Fusti, Bulbi e Tuberi (Patate e affini) Patata comune: 77 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 0,8 g zuccheri, 2,2 g fibre, 2,0 g proteine, 0,01 g sale.
1535) Radici, Tuberi e Bulbi Rari Radice di Prezzemolo: 55 kcal, 0,6 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 1,5 g zuccheri, 4,3 g fibre, 2,3 g proteine, 0,01 g sale.
1536) Verdure a Foglia e Erbe Alimurgiche (Spontanee) Senape Indiana (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
1537) Ortaggi Internazionali e Insoliti Kohlrabi (Cavolo Rapa) Verde: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 2,6 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
1538) Funghi Shiitake: 34 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,8 g carboidrati, 2,4 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
1539) Funghi Chiodini: 15 kcal, 0,4 g grassi, 0,1 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 2,1 g fibre, 2,0 g proteine, 0,01 g sale.
1540) Funghi Orecchioni (Pleurotus): 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
1541) Funghi Prataioli: 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 2,0 g zuccheri, 1,0 g fibre, 3,1 g proteine, 0,01 g sale.
1542) Funghi Pioppini: 20 kcal, 0,4 g grassi, 0,1 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
1543) Funghi Trombetta dei Morti: 15 kcal, 0,3 g grassi, 0,1 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 4,0 g fibre, 2,0 g proteine, 0,01 g sale.
1544) Funghi Mazza di Tamburo: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 2,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,01 g sale.
1545) Funghi Ovuli (freschi): 20 kcal, 0,3 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
1546) Germogli e Legumi Freschi Germogli di Erba Medica (Alfalfa): 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1547) Germogli di Ravanello: 43 kcal, 2,5 g grassi, 0,3 g grassi saturi, 3,6 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 3,8 g proteine, 0,01 g sale.
1548) Germogli di Girasole: 45 kcal, 3,0 g grassi, 0,5 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 1,0 g fibre, 3,5 g proteine, 0,01 g sale.
1549) Germogli di Lenticchie: 106 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,0 g carboidrati, 2,0 g zuccheri, 3,5 g fibre, 9,0 g proteine, 0,01 g sale.
1550) Germogli di Piselli: 124 kcal, 0,7 g grassi, 0,1 g grassi saturi, 22,5 g carboidrati, 3,5 g zuccheri, 4,0 g fibre, 8,8 g proteine, 0,01 g sale.
1551) Germogli di Broccolo: 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 4,0 g proteine, 0,02 g sale.
1552) Germogli di Cipolla: 30 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,02 g sale.
1553) Lupini deamarizzati (in salamoia): 116 kcal, 2,4 g grassi, 0,3 g grassi saturi, 7,2 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 16,4 g proteine, 2,50 g sale.
1554) Soia Edamame (bollita): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 8,9 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1555) Barbabietole cotte sottovuoto (confezionati): 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 7,0 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,15 g sale.
1556) Cetriolini sott'aceto (confezionati): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 0,5 g proteine, 1,80 g sale.

`;

const generaDatabase = (testo) => {
    return testo.trim().split('\n').map(riga => {
        try {
            const matchRiga = riga.match(/^\s*\d+\)\s*(.+?):\s*(.+)$/);
            if (!matchRiga) {
                return null;
            }

            const nome = matchRiga[1].trim();
            const valori = matchRiga[2].trim();

            const estrai = (...patterns) => {
                for (const pattern of patterns) {
                    const match = valori.match(pattern);
                    if (match) {
                        return parseFloat(match[1].replace(',', '.'));
                    }
                }
                return 0;
            };

            const kcal = estrai(/(?:^|,\s*)(\d+(?:,\d+)?)\s*kcal/i, /(?:^|,\s*)kcal\s*(\d+(?:,\d+)?)/i);
            if (!nome || kcal <= 0) {
                return null;
            }

            return {
                nome: nome,
                kcal: kcal,
                grassi: estrai(/(\d+(?:,\d+)?)\s*g grassi/i, /grassi\s*(\d+(?:,\d+)?)g?/i),
                saturi: estrai(/(\d+(?:,\d+)?)\s*g grassi saturi/i, /grassi saturi\s*(\d+(?:,\d+)?)g?/i),
                carboidrati: estrai(/(\d+(?:,\d+)?)\s*g carboidrati/i, /carboidrati\s*(\d+(?:,\d+)?)g?/i),
                zuccheri: estrai(/(\d+(?:,\d+)?)\s*g zuccheri/i, /zuccheri\s*(\d+(?:,\d+)?)g?/i),
                fibre: estrai(/(\d+(?:,\d+)?)\s*g fibre/i, /fibre\s*(\d+(?:,\d+)?)g?/i),
                proteine: estrai(/(\d+(?:,\d+)?)\s*g proteine/i, /proteine\s*(\d+(?:,\d+)?)g?/i),
                sale: estrai(/(\d+(?:,\d+)?)\s*g sale/i, /sale\s*(\d+(?:,\d+)?)g?/i),
                // Default per micronutrienti per non rompere il design dei grafici
                fe: 0, ca: 0, mg: 0, k: 0, b12: 0, fol: 0
            };
        } catch (e) { return null; }
    }).filter(a => a !== null);
};

const db = generaDatabase(datiAlimenti);


function parseLegacyIngredientQuantity(text) {
    const normalized = String(text || '').trim().replace(',', '.');
    if (!normalized) {
        return 0;
    }

    const directMatch = normalized.match(/(\d+(?:\.\d+)?)\s*g\b/i);
    if (directMatch) {
        return Number(Number(directMatch[1]).toFixed(1));
    }

    const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*g\b/i);
    if (rangeMatch) {
        return Number(Number(rangeMatch[2]).toFixed(1));
    }

    return 0;
}

function stripLegacyIngredientQuantity(text) {
    return String(text || '')
        .replace(/^(\d+(?:[.,]\d+)?(?:\s*-\s*\d+(?:[.,]\d+)?)?)\s*g\s*(?:di\s+)?/i, '')
        .replace(/\b(\d+(?:[.,]\d+)?(?:\s*-\s*\d+(?:[.,]\d+)?)?)\s*g\b/gi, '')
        .replace(/^di\s+/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function normalizeSavedRecipeItem(item) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
        const sourceName = String(item.n || item.name || item.ingredient || '').trim();
        const parsedQty = parseLegacyIngredientQuantity(sourceName);
        const normalizedQty = Number(item.qty || 0) > 0 ? Number(item.qty || 0) : parsedQty;
        const normalizedName = stripLegacyIngredientQuantity(sourceName) || sourceName;

        return {
            ...item,
            n: normalizedName,
            qty: normalizedQty,
            k: Number(item.k || item.kcal || 0),
            p: Number(item.p || item.protein || 0),
            c: Number(item.c || item.carbs || 0),
            g: Number(item.g || item.fat || 0),
            fe: Number(item.fe || 0),
            ca: Number(item.ca || 0),
            b12: Number(item.b12 || 0)
        };
    }

    const sourceName = String(item || '').trim();
    return {
        n: stripLegacyIngredientQuantity(sourceName) || sourceName,
        qty: parseLegacyIngredientQuantity(sourceName),
        k: 0,
        p: 0,
        c: 0,
        g: 0,
        fe: 0,
        ca: 0,
        b12: 0
    };
}

function normalizeSavedRecipesCollection(recipes) {
    const sourceRecipes = Array.isArray(recipes) ? recipes : [];
    let changed = false;

    const normalizedRecipes = sourceRecipes.map((recipe) => {
        const normalizedItems = Array.isArray(recipe?.items)
            ? recipe.items.map((item) => normalizeSavedRecipeItem(item))
            : [];

        const normalizedRecipe = {
            ...recipe,
            items: normalizedItems
        };

        if (JSON.stringify(recipe) !== JSON.stringify(normalizedRecipe)) {
            changed = true;
        }

        return normalizedRecipe;
    });

    return { recipes: normalizedRecipes, changed };
}



let profilo = JSON.parse(localStorage.getItem('nv_profilo')) || null;
let diario = JSON.parse(localStorage.getItem('nv_diario')) || [];
let acqua = parseInt(localStorage.getItem('nv_acqua')) || 0;
let ciboSelezionato = null;
let tempRecipe = { items: [], k: 0, p: 0, c: 0, g: 0, fe: 0, ca: 0, b12: 0 };

// 2. STATO DEL DIARIO/CALENDARIO
let log = JSON.parse(localStorage.getItem('nv_log')) || {};
const normalizedSavedRecipesState = normalizeSavedRecipesCollection(JSON.parse(localStorage.getItem('nv_ricette')) || []);
let ricetteSalvate = normalizedSavedRecipesState.recipes;
if (normalizedSavedRecipesState.changed) {
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
}
let activeDate = formatLocalIsoDate(new Date());
let currentMonth = new Date();
let currentMealType = null;
let selectedFood = null;
let aiSelectedIngredients = [];
let aiGeneratedRecipes = [];
let barcodeScanner = null;
let barcodeScannerActive = false;
let barcodeScanLocked = false;
let latestSmartScanFood = null;
let smartScanFallbackTimer = null;

function syncAISelectedIngredientsInput() {
    const discoverInput = document.getElementById('discover-ingredients');
    if (discoverInput) {
        discoverInput.value = aiSelectedIngredients.join(', ');
    }
}

function renderAISelectedIngredients() {
    const list = document.getElementById('ai-ingredient-list');
    if (!list) return;

    if (aiSelectedIngredients.length === 0) {
        list.innerHTML = '';
        syncAISelectedIngredientsInput();
        return;
    }

    list.innerHTML = aiSelectedIngredients.map((item) => `
        <li class="ai-ingredient-chip-item">
            <span class="ai-ingredient-chip">${escapeHtml(item)}</span>
            <button type="button" class="ai-ingredient-chip-remove" onclick="removeAISelectedIngredient(decodeURIComponent('${encodeURIComponent(item)}'))" aria-label="Rimuovi ${escapeHtml(item)}">×</button>
        </li>
    `).join('');

    syncAISelectedIngredientsInput();
}

function removeAISelectedIngredient(ingredientName) {
    const normalizedName = String(ingredientName || '').trim();
    aiSelectedIngredients = aiSelectedIngredients.filter((item) => item !== normalizedName);
    renderAISelectedIngredients();
}

function formatLocalIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseIsoDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getCalendarDayState(dayLog, targetKcal) {
    if (!dayLog || !Array.isArray(dayLog.items) || dayLog.items.length === 0) {
        return 'empty';
    }

    if (targetKcal > 0 && dayLog.k > targetKcal) {
        return 'exceeded';
    }

    return 'has-meals';
}

function isPastDay(dateIso) {
    return parseIsoDate(dateIso).getTime() < parseIsoDate(formatLocalIsoDate(new Date())).getTime();
}

function isFutureDay(dateIso) {
    return parseIsoDate(dateIso).getTime() > parseIsoDate(formatLocalIsoDate(new Date())).getTime();
}

function isToday(dateIso) {
    return dateIso === formatLocalIsoDate(new Date());
}

const diaryBlockedMessage = 'seleziona la data di oggi o precedente';

function getDiaryDateErrorMessage(dateIso) {
    if (isFutureDay(dateIso)) {
        return diaryBlockedMessage;
    }

    return '';
}

function getDayProgress(dayLog, targetKcal) {
    if (!dayLog || !Array.isArray(dayLog.items) || dayLog.items.length === 0 || targetKcal <= 0) {
        return 0;
    }

    return Math.min((dayLog.k / targetKcal) * 100, 100);
}

function resetMealSelection() {
    currentMealType = null;
    document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
}

function closeAddPanel() {
    selectedFood = null;
    const addPanel = document.getElementById('add-panel');
    const searchResults = document.getElementById('search-results');
    const foodSearch = document.getElementById('food-search');
    const qtyInput = document.getElementById('qty');

    if (addPanel) addPanel.style.display = 'none';
    if (searchResults) searchResults.innerHTML = '';
    if (foodSearch) foodSearch.value = '';
    if (qtyInput) qtyInput.value = 100;
}

function finishMealEntry() {
    closeAddPanel();
    resetMealSelection();
}

function updateDiaryAddAvailability() {
    const isEditableDate = !isFutureDay(activeDate);
    const dateErrorMessage = getDiaryDateErrorMessage(activeDate);
    const foodSearch = document.getElementById('food-search');
    const selectedDayLabel = document.getElementById('selected-day-label');
    const futureDateNote = document.getElementById('future-date-note');

    document.querySelectorAll('.chip').forEach(chip => {
        chip.disabled = !isEditableDate;
        chip.classList.toggle('is-disabled', !isEditableDate);
    });

    if (foodSearch) {
        foodSearch.readOnly = isFutureDay(activeDate);
        foodSearch.disabled = false;
        foodSearch.value = isFutureDay(activeDate) ? dateErrorMessage : '';
        foodSearch.placeholder = dateErrorMessage || 'Cerca cibo o ricetta...';
        foodSearch.classList.toggle('diary-search-blocked', isFutureDay(activeDate));
    }

    if (!isEditableDate) {
        closeAddPanel();
        resetMealSelection();
    }

    if (selectedDayLabel) {
        const formattedDate = parseIsoDate(activeDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });
        selectedDayLabel.innerText = formattedDate;
    }

    if (futureDateNote) {
        futureDateNote.style.display = isFutureDay(activeDate) ? 'block' : 'none';
    }
}

function normalizeMealType(type) {
    const normalized = (type || '').trim().toLowerCase();
    if (normalized === 'colazione') return 'Colazione';
    if (normalized === 'pranzo') return 'Pranzo';
    if (normalized === 'cena') return 'Cena';
    if (normalized === 'spuntino' || normalized === 'snack') return 'Spuntino';
    return null;
}

function getFoodPreviewTotals(food, qty) {
    const ratio = qty / 100;
    return {
        kcal: (food.kcal ?? food.k ?? 0) * ratio,
        proteins: (food.proteine ?? food.p ?? 0) * ratio,
        carbs: (food.carboidrati ?? food.c ?? 0) * ratio,
        fats: (food.grassi ?? food.g ?? 0) * ratio
    };
}

function updateSelectedFoodPreview() {
    const kcalPreview = document.getElementById('selected-kcal-preview');
    const macrosPreview = document.getElementById('selected-macros-preview');
    const qtyInput = document.getElementById('qty');

    if (!kcalPreview || !macrosPreview || !qtyInput || !selectedFood) return;

    const qty = parseFloat(qtyInput.value);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
    const totals = getFoodPreviewTotals(selectedFood, safeQty);

    kcalPreview.innerText = `${Math.round(totals.kcal)} kcal totali`;
    macrosPreview.innerText = `P ${totals.proteins.toFixed(1)} g • C ${totals.carbs.toFixed(1)} g • G ${totals.fats.toFixed(1)} g`;
}

function findFoodSourceByName(name) {
    return [...db, ...ricetteSalvate.filter((item) => !item.aiGenerated)].find(item => (item.nome || item.n) === name) || null;
}

function getEntryReferenceValues(entry) {
    const source = findFoodSourceByName(entry.n);
    const qty = entry.qty || 100;
    const ratio = qty / 100;

    return {
        k: entry.baseK ?? source?.kcal ?? source?.k ?? (ratio > 0 ? entry.k / ratio : entry.k),
        p: entry.baseP ?? source?.proteine ?? source?.p ?? (ratio > 0 ? entry.p / ratio : entry.p),
        c: entry.baseC ?? source?.carboidrati ?? source?.c ?? (ratio > 0 ? entry.c / ratio : entry.c),
        g: entry.baseG ?? source?.grassi ?? source?.g ?? (ratio > 0 ? entry.g / ratio : entry.g),
        fe: entry.baseFe ?? source?.fe ?? (ratio > 0 ? entry.fe / ratio : entry.fe),
        ca: entry.baseCa ?? source?.ca ?? (ratio > 0 ? entry.ca / ratio : entry.ca),
        b12: entry.baseB12 ?? source?.b12 ?? (ratio > 0 ? entry.b12 / ratio : entry.b12)
    };
}

function buildDiaryEntry(sourceFood, qty, mealType, nameOverride) {
    const ratio = qty / 100;
    const baseValues = {
        k: sourceFood.kcal ?? sourceFood.k ?? 0,
        p: sourceFood.proteine ?? sourceFood.p ?? 0,
        c: sourceFood.carboidrati ?? sourceFood.c ?? 0,
        g: sourceFood.grassi ?? sourceFood.g ?? 0,
        fe: sourceFood.fe ?? 0,
        ca: sourceFood.ca ?? 0,
        b12: sourceFood.b12 ?? 0
    };

    return {
        n: nameOverride || sourceFood.nome || sourceFood.n,
        t: mealType,
        qty,
        baseK: baseValues.k,
        baseP: baseValues.p,
        baseC: baseValues.c,
        baseG: baseValues.g,
        baseFe: baseValues.fe,
        baseCa: baseValues.ca,
        baseB12: baseValues.b12,
        k: baseValues.k * ratio,
        p: baseValues.p * ratio,
        c: baseValues.c * ratio,
        g: baseValues.g * ratio,
        fe: baseValues.fe * ratio,
        ca: baseValues.ca * ratio,
        b12: baseValues.b12 * ratio
    };
}

function modificaPasto(index) {
    if (!log[activeDate] || !log[activeDate].items || !log[activeDate].items[index]) return;

    const currentEntry = log[activeDate].items[index];
    const qtyValue = prompt('Nuova quantità in grammi', currentEntry.qty || 100);
    if (qtyValue === null) return;

    const newQty = parseFloat(String(qtyValue).replace(',', '.'));
    if (isNaN(newQty) || newQty <= 0) {
        alert('Inserisci una quantità valida in grammi');
        return;
    }

    const mealValue = prompt('Pasto (Colazione, Pranzo, Cena o Spuntino)', currentEntry.t || '');
    if (mealValue === null) return;

    const newMealType = normalizeMealType(mealValue);
    if (!newMealType) {
        alert('Devi selezionare un pasto valido: Colazione, Pranzo, Cena o Spuntino');
        return;
    }

    const referenceValues = getEntryReferenceValues(currentEntry);
    const updatedEntry = buildDiaryEntry(referenceValues, newQty, newMealType, currentEntry.n);

    aggiornaTotaliGiorno(log[activeDate], currentEntry, -1);
    log[activeDate].items[index] = updatedEntry;
    aggiornaTotaliGiorno(log[activeDate], updatedEntry, 1);

    localStorage.setItem('nv_log', JSON.stringify(log));
    renderCalendar();
    aggiornaUI();
}

let wizardCurrentStep = 1;
const wizardTotalSteps = 6;
let userProfile = {};

const isFirstAccess = () => localStorage.getItem('isFirstAccess') !== 'false';
const setFirstAccess = (val) => localStorage.setItem('isFirstAccess', val ? 'true' : 'false');

function initApp(profile) {
    profilo = profile;
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    setupAvatarFallbacks();
    loadSavedAvatar();
    applyLunchContextPreference(profile);
    renderUserProfileSummary();
    renderLifestyleGuidancePanel(profile);
    renderWeeklyGuidancePanel(profile);
    renderSmartRecipeGuidancePanel(profile);
    mostraSezione('home');
    aggiornaUI();
    aggiornaListaRicetteSalvate();
    toggleAiMode();
}

window.onload = () => {
    // Restore saved theme (dark/light)
    const savedTheme = localStorage.getItem('nv_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        const icon = document.querySelector('#mini-theme-toggle [data-lucide]');
        if (icon) icon.setAttribute('data-lucide', 'sun');
    }
    // Initialise Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setupAvatarFallbacks();
    setupWizardNumericFieldFeedback();
    setupWizardStepThreeLogic();
    const storedProfile = JSON.parse(localStorage.getItem('nv_profilo'));
    if (!storedProfile || isFirstAccess()) {
        document.getElementById('setup-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        showWizardStep(wizardCurrentStep);
        setFirstAccess(false);
        return;
    }

    initApp(storedProfile);
    toggleAiMode();
};

function salvaProfilo() {
    finalizzaProfilo();
}

function initWizard() {
    wizardCurrentStep = 1;
    showWizardStep(wizardCurrentStep);
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
}

function updateWizardNumericFieldState(input) {
    if (!input) return;

    const rawValue = (input.value || '').trim();
    const errorEl = document.getElementById(`${input.id}-error`);
    const hasBadInput = Boolean(input.validity && input.validity.badInput);

    if (hasBadInput) {
        input.classList.add('wizard-input-invalid');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) {
            errorEl.textContent = 'Inserisci solo valori numerici.';
            errorEl.classList.add('visible');
        }
        return;
    }

    if (rawValue === '') {
        input.classList.remove('wizard-input-invalid');
        input.removeAttribute('aria-invalid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
        return;
    }

    const numericValue = Number(rawValue);
    const minAttr = input.getAttribute('min');
    const maxAttr = input.getAttribute('max');
    const isBelowMin = minAttr !== null && numericValue < Number(minAttr);
    const isAboveMax = maxAttr !== null && numericValue > Number(maxAttr);
    const hasInvalidValue = !isFinite(numericValue) || isBelowMin || isAboveMax;
    let errorMessage = '';

    if (!isFinite(numericValue)) {
        errorMessage = 'Valore non valido.';
    } else if (isBelowMin || isAboveMax) {
        if (minAttr !== null && maxAttr !== null) {
            errorMessage = `Valore non valido. Inserisci un numero tra ${minAttr} e ${maxAttr}.`;
        } else if (minAttr !== null) {
            errorMessage = `Valore non valido. Inserisci un numero maggiore o uguale a ${minAttr}.`;
        } else if (maxAttr !== null) {
            errorMessage = `Valore non valido. Inserisci un numero minore o uguale a ${maxAttr}.`;
        }
    }

    input.classList.toggle('wizard-input-invalid', hasInvalidValue);
    input.toggleAttribute('aria-invalid', hasInvalidValue);

    if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.classList.toggle('visible', hasInvalidValue && errorMessage !== '');
    }
}

function setupWizardNumericFieldFeedback() {
    const constrainedFields = document.querySelectorAll('#wizard-age, #wizard-weight, #wizard-height, #wizard-water');

    constrainedFields.forEach((input) => {
        let errorEl = document.getElementById(`${input.id}-error`);
        if (!errorEl) {
            errorEl = document.createElement('small');
            errorEl.id = `${input.id}-error`;
            errorEl.className = 'wizard-input-error';
            input.insertAdjacentElement('afterend', errorEl);
        }

        input.addEventListener('input', () => updateWizardNumericFieldState(input));
        input.addEventListener('blur', () => updateWizardNumericFieldState(input));
        updateWizardNumericFieldState(input);
    });
}

function updateWizardSportFieldState() {
    const workoutsInput = document.getElementById('wizard-workouts');
    const sportDetails = document.getElementById('wizard-sport-details');
    const sportToggle = document.getElementById('wizard-sport-toggle');
    const sportNameWrap = document.getElementById('wizard-sport-name-wrap');
    const sportNameInput = document.getElementById('wizard-sport-name');

    if (!workoutsInput || !sportDetails || !sportToggle || !sportNameWrap || !sportNameInput) return;

    const workoutsValue = Number(workoutsInput.value);
    const shouldShowSportQuestion = Number.isFinite(workoutsValue) && workoutsValue >= 1;

    sportDetails.style.display = shouldShowSportQuestion ? 'block' : 'none';

    if (!shouldShowSportQuestion) {
        sportToggle.value = '';
        sportNameInput.value = '';
        sportNameWrap.style.display = 'none';
        return;
    }

    const shouldShowSportName = sportToggle.value === 'si';
    sportNameWrap.style.display = shouldShowSportName ? 'block' : 'none';

    if (!shouldShowSportName) {
        sportNameInput.value = '';
    }
}

function setupWizardStepThreeLogic() {
    const workoutsInput = document.getElementById('wizard-workouts');
    const sportToggle = document.getElementById('wizard-sport-toggle');

    if (workoutsInput) {
        workoutsInput.addEventListener('input', updateWizardSportFieldState);
        workoutsInput.addEventListener('blur', updateWizardSportFieldState);
    }

    if (sportToggle) {
        sportToggle.addEventListener('change', updateWizardSportFieldState);
    }

    updateWizardSportFieldState();
}

function showWizardStep(step) {
    document.querySelectorAll('.wizard-step').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const current = document.querySelector(`.wizard-step[data-step='${step}']`);
    if (current) {
        current.classList.add('active');
        current.style.display = 'block';
    }

    const progress = document.getElementById('wizard-progress');
    if (progress) {
        progress.style.width = `${Math.round((step - 1) / (wizardTotalSteps - 1) * 100)}%`;
    }

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const skipBtn = document.getElementById('skip-btn');

    if (prevBtn) prevBtn.disabled = step === 1;
    if (nextBtn) nextBtn.textContent = step === wizardTotalSteps ? 'VAI!' : 'Avanti';

    // Step opzionali: 2 e 4
    if (skipBtn) {
        if (step === 2 || step === 4) {
            skipBtn.style.display = 'inline-block';
        } else {
            skipBtn.style.display = 'none';
        }
    }
}


function validateStep(step) {
    const stepEl = document.querySelector(`.wizard-step[data-step='${step}']`);
    if (!stepEl) return true;

    if (step === 5 && !selectedAvatarPath) {
        alert('Seleziona un avatar prima di procedere.');
        return false;
    }

    const mandatorySteps = [1, 3, 5, 6];
    const isMandatory = mandatorySteps.includes(step);
    const inputs = stepEl.querySelectorAll('input, select');

    if (step === 2 || step === 4) {
        // Step 2 e 4: possono procedere anche senza risposte
        return true;
    }

    if (!isMandatory) {
        return true;
    }

    for (const input of inputs) {
        const value = (input.value || '').toString().trim();

        if (input.disabled) {
            continue;
        }

        if (input.dataset.optional === 'true' && value === '') {
            continue;
        }

        if (input.type === 'number' && input.validity && input.validity.badInput) {
            alert('Inserisci solo valori numerici.');
            input.focus();
            return false;
        }

        if (value === '') {
            alert('Compila tutti i campi obbligatori prima di procedere.');
            input.focus();
            return false;
        }
        if (input.type === 'number' && !isFinite(Number(input.value))) {
            alert('Inserisci un numero valido.');
            input.focus();
            return false;
        }
        if (input.type === 'number') {
            const numericValue = Number(input.value);
            const minAttr = input.getAttribute('min');
            const maxAttr = input.getAttribute('max');

            if (minAttr !== null && numericValue < Number(minAttr)) {
                alert(`Il valore minimo consentito e ${minAttr}.`);
                input.focus();
                return false;
            }

            if (maxAttr !== null && numericValue > Number(maxAttr)) {
                alert(`Il valore massimo consentito e ${maxAttr}.`);
                input.focus();
                return false;
            }
        }
    }
    return true;
}


function nextStep() {
    if (!validateStep(wizardCurrentStep)) return;

    if (wizardCurrentStep < wizardTotalSteps) {
        wizardCurrentStep += 1;
        showWizardStep(wizardCurrentStep);
        if (wizardCurrentStep === 6) {
            mostraRiepilogo();
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) {
                nextBtn.textContent = 'Entra nella dashboard';
                nextBtn.onclick = function() {
                    finalizzaProfilo();
                };
            }
        }
    }
}

function skipStep() {
    if (wizardCurrentStep < wizardTotalSteps) {
        wizardCurrentStep += 1;
        showWizardStep(wizardCurrentStep);
        if (wizardCurrentStep === 6) {
            mostraRiepilogo();
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) {
                nextBtn.textContent = 'Entra nella dashboard';
                nextBtn.onclick = function() {
                    finalizzaProfilo();
                };
            }
        }
    }
}

function prevStep() {
    if (wizardCurrentStep > 1) {
        wizardCurrentStep -= 1;
        showWizardStep(wizardCurrentStep);
        // Se si torna indietro dallo step 6, svuota il riepilogo
        if (wizardCurrentStep < 6) {
            document.getElementById('riepilogo-frase').innerHTML = '';
            document.getElementById('riepilogo-dati').innerHTML = '';
            const avatarElem = document.getElementById('riepilogo-avatar');
            avatarElem.src = '';
            avatarElem.style.display = 'none';
            // Nascondi il contenitore riepilogo
            const step6 = document.querySelector('.wizard-step[data-step="6"]');
            if (step6) step6.style.display = 'none';
            // Mostra lo step corrente
            showWizardStep(wizardCurrentStep);
        }
        // Restore nextBtn behavior if non step 6
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            if (wizardCurrentStep === wizardTotalSteps) {
                nextBtn.textContent = 'VAI!';
            } else if (wizardCurrentStep === 6) {
                nextBtn.textContent = 'Entra nella dashboard';
                nextBtn.onclick = function() {
                    finalizzaProfilo();
                };
            } else {
                nextBtn.textContent = 'Avanti';
                nextBtn.onclick = function() {
                    nextStep();
                };
            }
        }
    }
}

function finalizzaProfilo() {
    const newProfile = buildWizardProfileDraft();

    userProfile = newProfile;
    localStorage.setItem('nv_profilo', JSON.stringify(newProfile));

    const infoUtente = {
        dataCreazione: new Date().toLocaleDateString(),
        profilo: {...newProfile}
    };
    localStorage.setItem('userDiaryProfile', JSON.stringify(infoUtente));

    setFirstAccess(false);
    initApp(newProfile);
    updateHomeStats();
}

function caricaDatiProfilo() {
    const datiProfilo = JSON.parse(localStorage.getItem('nv_profilo'));
    if (!datiProfilo) return;

    const setValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value ?? '';
        }
    };

    setValue('profilo-username', datiProfilo.username);
    setValue('profilo-sex', datiProfilo.sex);
    setValue('profilo-age', datiProfilo.age);
    setValue('profilo-weight', datiProfilo.weight);
    setValue('profilo-height', datiProfilo.height);
    setValue('profilo-job', datiProfilo.jobType);
    setValue('profilo-workouts', datiProfilo.workoutsPerWeek);
    setValue('profilo-goal', datiProfilo.goal);
    setValue('profilo-diet', datiProfilo.diet);
    setValue('profilo-allergies', datiProfilo.allergies);
    setValue('profilo-intolerances', datiProfilo.intolerances);
    setValue('profilo-other-pathologies', datiProfilo.otherPathologies);
    setValue('profilo-meals', datiProfilo.mealsPerDay);
    setValue('profilo-dinner-protein-preference', normalizeDinnerProteinPreference(datiProfilo.dinnerProteinPreference));
    setValue('profilo-dinner-protein-frequency', normalizeDinnerProteinFrequency(datiProfilo.dinnerProteinFrequency));
    setValue('profilo-weakpoint', datiProfilo.weakPoint);
    setValue('profilo-water', datiProfilo.waterIntake);
    applyLunchContextPreference(datiProfilo);

    const summary = document.getElementById('profilo-summary-content');
    if (summary) {
        summary.innerHTML = `
            <div><strong>Nome:</strong> ${escapeHtml(datiProfilo.username || '-')}</div>
            <div><strong>Età:</strong> ${escapeHtml(datiProfilo.age || '-')} anni</div>
            <div><strong>Peso:</strong> ${escapeHtml(datiProfilo.weight || '-')} kg</div>
            <div><strong>Altezza:</strong> ${escapeHtml(datiProfilo.height || '-')} cm</div>
            <div><strong>IMC:</strong> ${escapeHtml(datiProfilo.imc || '-')} ${datiProfilo.imcCategory ? `(${escapeHtml(datiProfilo.imcCategory)})` : ''}</div>
            <div><strong>Fabbisogno:</strong> ${escapeHtml(datiProfilo.maintenanceCalories || '-')} kcal</div>
            <div><strong>Piano calorico:</strong> ${escapeHtml(datiProfilo.target || '-')} kcal</div>
            <div><strong>Proteine:</strong> ${escapeHtml(datiProfilo.proteinTargetPerKg || '-')} g/kg (${escapeHtml(datiProfilo.proteinTarget || '-')} g)</div>
            <div><strong>Obiettivo:</strong> ${escapeHtml(getWizardGoalLabel(datiProfilo.goal))}</div>
            <div><strong>Attività:</strong> ${escapeHtml(getWizardJobLabel(datiProfilo.jobType))}</div>
            <div><strong>Allenamenti:</strong> ${escapeHtml(datiProfilo.workoutsPerWeek ?? '-')} / settimana</div>
            <div><strong>Sport:</strong> ${escapeHtml(formatSportLabel(datiProfilo.sportName))}</div>
            <div><strong>Altre patologie:</strong> ${escapeHtml(datiProfilo.otherPathologies || '-')}</div>
            <div><strong>Motivazione:</strong> ${escapeHtml(datiProfilo.motivation || '-')}</div>
            <div><strong>Acqua:</strong> ${escapeHtml(datiProfilo.waterIntake || '-')} L</div>
            <div><strong>Pranzo preferito:</strong> ${escapeHtml(getLunchContextLabel(datiProfilo.lunchContextPreference || 'workday'))}</div>
            <div><strong>Rotazione proteica cena:</strong> ${escapeHtml(getDinnerProteinPreferenceLabel(datiProfilo.dinnerProteinPreference || 'variata'))}</div>
            <div><strong>Frequenza cena suggerita:</strong> ${escapeHtml(getDinnerProteinFrequencyLabel(datiProfilo.dinnerProteinFrequency || 'libera'))}</div>
        `;
    }

    selectedAvatarPath = normalizeAvatarPath(datiProfilo.avatarUrl || selectedAvatarPath);
    aggiornaAvatarProfilo(selectedAvatarPath || 'avatars/1.jpg');
    document.querySelectorAll('.avatar-selection-grid img').forEach((img) => {
        img.classList.toggle('selected', !!selectedAvatarPath && getAvatarChoicePath(img) === selectedAvatarPath);
    });
}

function salvaModificheProfilo() {
    const weight = parseFloat(document.getElementById('profilo-weight').value);
    const height = parseFloat(document.getElementById('profilo-height').value);
    const age = parseInt(document.getElementById('profilo-age').value, 10);
    const currentProfile = JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {};

    const profile = {
        ...currentProfile,
        username: document.getElementById('profilo-username').value,
        sex: document.getElementById('profilo-sex').value,
        age: age,
        weight: weight,
        height: height,
        jobType: document.getElementById('profilo-job').value,
        workoutsPerWeek: parseInt(document.getElementById('profilo-workouts').value, 10),
        goal: document.getElementById('profilo-goal').value,
        diet: document.getElementById('profilo-diet').value,
        allergies: document.getElementById('profilo-allergies').value,
        intolerances: document.getElementById('profilo-intolerances').value,
        otherPathologies: document.getElementById('profilo-other-pathologies').value.trim(),
        mealsPerDay: parseInt(document.getElementById('profilo-meals').value, 10),
        dinnerProteinPreference: normalizeDinnerProteinPreference(document.getElementById('profilo-dinner-protein-preference')?.value),
        dinnerProteinFrequency: normalizeDinnerProteinFrequency(document.getElementById('profilo-dinner-protein-frequency')?.value),
        weakPoint: document.getElementById('profilo-weakpoint').value,
        waterIntake: parseFloat(document.getElementById('profilo-water').value),
        lunchContextPreference: document.getElementById('day-plan-lunch-context')?.value === 'free-day'
            ? 'free-day'
            : (currentProfile.lunchContextPreference || 'workday')
    };

    profile.acquaObiettivo = parseFloat((weight * 0.035).toFixed(1));
    const energyProfile = calculateEnergyProfile(profile);

    const profiloAggiornato = {
        ...profile,
        ...energyProfile,
        acquaTarget: profile.acquaObiettivo * 1000,
        micronutrients: {
            fe: 14,
            ca: 1000,
            mg: 350,
            b12: 2.4,
            fol: 400
        }
    };

    profilo = profiloAggiornato;
    userProfile = profiloAggiornato;

    localStorage.setItem('nv_profilo', JSON.stringify(profiloAggiornato));
    localStorage.setItem('userDiaryProfile', JSON.stringify({
        dataCreazione: new Date().toLocaleDateString(),
        profilo: { ...profiloAggiornato }
    }));

    updateHomeStats();
    caricaDatiProfilo();
    renderUserProfileSummary();
    alert('Profilo aggiornato con successo');
}

function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
}

function mostraSezione(tabId) {
    const target = document.getElementById(tabId);
    if (!target) return;

    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    target.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const btn = document.querySelector(`.nav-item[onclick="mostraSezione('${tabId}')"]`);
    if (btn) btn.classList.add('active');

    if (tabId === 'diario') {
        renderCalendar();
        aggiornaUI();
    }
    if (tabId === 'cronologia') {
        renderCronologia();
    }
    if (tabId === 'home') {
        renderUserProfileSummary();
        aggiornaUI();
    }
    if (tabId === 'pasti-rapidi') {
        aggiornaListaRicetteSalvate();
        renderWeeklyGuidancePanel(JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {});
        renderSmartRecipeGuidancePanel(JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || {});
        toggleAiMode();
    }
    if (tabId === 'profilo') {
        caricaDatiProfilo();
        renderCronologia();
    }
}

function apriGiornoCronologia(dateIso) {
    activeDate = dateIso;
    currentMonth = new Date(parseIsoDate(dateIso).getFullYear(), parseIsoDate(dateIso).getMonth(), 1);
    mostraSezione('diario');
}

function renderCronologia() {
    const chronologyList = document.getElementById('chronology-list');
    if (!chronologyList) return;

    const dateKeys = Object.keys(log)
        .filter(dateIso => log[dateIso] && Array.isArray(log[dateIso].items) && log[dateIso].items.length > 0)
        .sort((left, right) => parseIsoDate(right).getTime() - parseIsoDate(left).getTime());

    if (dateKeys.length === 0) {
        chronologyList.innerHTML = `
            <div class="chronology-empty">
                <strong>Nessun pasto salvato</strong>
                <p>Quando aggiungi pasti nel Diario li troverai qui, organizzati per giorno.</p>
            </div>
        `;
        return;
    }

    chronologyList.innerHTML = dateKeys.map(dateIso => {
        const dayLog = log[dateIso];
        const formattedDate = parseIsoDate(dateIso).toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const itemsMarkup = dayLog.items.map(item => `
            <li class="chronology-item-row">
                <div class="chronology-item-main">
                    <strong>${item.t || 'Pasto'}</strong>
                    <span>${item.n}</span>
                </div>
                <div class="chronology-item-meta">
                    <span>${Math.round(item.qty || 100)} g</span>
                    <strong>${Math.round(item.k)} kcal</strong>
                </div>
            </li>
        `).join('');

        return `
            <article class="chronology-card">
                <div class="chronology-card-top">
                    <div>
                        <h3>${formattedDate}</h3>
                        <p>${dayLog.items.length} ${dayLog.items.length === 1 ? 'voce salvata' : 'voci salvate'}</p>
                    </div>
                    <div class="chronology-total">${Math.round(dayLog.k || 0)} kcal</div>
                </div>
                <ul class="chronology-day-list">${itemsMarkup}</ul>
                <button type="button" class="btn-secondary chronology-open-btn" onclick="apriGiornoCronologia('${dateIso}')">Apri nel Diario</button>
            </article>
        `;
    }).join('');
}

function cambiaMese(offset) {
    currentMonth.setMonth(currentMonth.getMonth() + offset);
    renderCalendar();
}

function renderUserProfileSummary() {
    const homeProfileSummary = document.getElementById('home-profile-summary');
    const diaryData = JSON.parse(localStorage.getItem('userDiaryProfile'));
    const activeProfile = diaryData?.profilo || profilo || userProfile || {};

    if (!homeProfileSummary) return;

    renderLifestyleGuidancePanel(activeProfile);
    renderWeeklyGuidancePanel(activeProfile);
    renderSmartRecipeGuidancePanel(activeProfile);

    if (diaryData && diaryData.profilo) {
        const dinnerPreferenceLabel = getDinnerProteinPreferenceLabel(diaryData.profilo.dinnerProteinPreference || 'variata');
        const dinnerFrequencyLabel = getDinnerProteinFrequencyLabel(diaryData.profilo.dinnerProteinFrequency || 'libera');
        homeProfileSummary.innerHTML = `
            <div style="margin-bottom: 10px; padding: 10px 12px; background: #f4f9ff; border: 1px solid #dce9f5; border-radius: 14px; text-align: center;">
                <strong>${escapeHtml(diaryData.profilo.username || 'Utente')}</strong> • ${escapeHtml(diaryData.profilo.sex || '-')} • ${escapeHtml(diaryData.profilo.age || '-')} anni • IMC: ${escapeHtml(diaryData.profilo.imc || '-')} • Fabbisogno: ${escapeHtml(diaryData.profilo.maintenanceCalories || '-')} kcal • Piano: ${escapeHtml(diaryData.profilo.target || '-')} kcal • Preferenza serale: ${escapeHtml(dinnerPreferenceLabel)} • Uso suggerito: ${escapeHtml(dinnerFrequencyLabel)}
            </div>
        `;
        return;
    }

    homeProfileSummary.innerHTML = '';
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('currentMonthYear');
    if (!grid || !title) return;

    grid.innerHTML = '';
    title.innerText = currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    renderUserProfileSummary();

    const primoGiorno = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const giorniMese = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    const emptyDays = primoGiorno === 0 ? 6 : primoGiorno - 1;
    for (let i = 0; i < emptyDays; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'cal-empty';
        grid.appendChild(emptyDiv);
    }

    const todayIso = formatLocalIsoDate(new Date());

    for (let d = 1; d <= giorniMese; d++) {
        const dataIso = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const div = document.createElement('div');
        div.className = 'cal-day';
        const targetKcal = profilo?.target || 0;
        const dayLog = log[dataIso];
        const dayState = getCalendarDayState(dayLog, targetKcal);
        const progress = getDayProgress(dayLog, targetKcal);

        if (dataIso === activeDate) {
            div.classList.add('active');
        }

        if (dataIso === todayIso && dayState === 'empty') {
            div.classList.add('today');
        }

        if (dayState === 'has-meals') {
            div.classList.add('has-meals');
            div.style.background = `linear-gradient(to top, var(--primary) 0%, var(--primary) ${progress}%, #ffffff ${progress}%, #ffffff 100%)`;
            div.style.color = progress >= 45 ? '#ffffff' : 'var(--text)';
        }

        if (dayState === 'exceeded') {
            div.classList.add('exceeded');
            div.style.background = '#dc3545';
            div.style.color = '#ffffff';
        }

        if (dayState === 'empty' && isPastDay(dataIso)) {
            div.style.background = '#ffffff';
            div.style.color = 'var(--text)';
        }

        div.innerText = d;
        div.onclick = () => {
            activeDate = dataIso;
            renderCalendar();
            aggiornaUI();
        };
        grid.appendChild(div);
    }
}

function selectMealType(type, btn) {
    if (isFutureDay(activeDate)) {
        alert(getDiaryDateErrorMessage(activeDate));
        return;
    }
    currentMealType = type;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function selezionaOpzioneChip(btn, hiddenInputId, value) {
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!hiddenInput) {
        return;
    }

    hiddenInput.value = value;

    const chipGroup = btn?.closest('.chip-group') || hiddenInput.closest('.chip-group') || hiddenInput.parentElement;
    if (chipGroup) {
        chipGroup.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
    }

    if (btn) {
        btn.classList.add('active');
    }

    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
}

window.selezionaOpzioneChip = selezionaOpzioneChip;

function aggiornaTotaliGiorno(giorno, entry, segno) {
    giorno.k += (entry.k * segno);
    giorno.p += (entry.p * segno);
    giorno.c += (entry.c * segno);
    giorno.g += (entry.g * segno);
    giorno.fe += (entry.fe * segno);
    giorno.ca += (entry.ca * segno);
    giorno.b12 += (entry.b12 * segno);
}

function rimuoviPasto(index) {
    if (!log[activeDate] || !log[activeDate].items || !log[activeDate].items[index]) return;
    const entry = log[activeDate].items[index];
    aggiornaTotaliGiorno(log[activeDate], entry, -1);
    log[activeDate].items.splice(index, 1);

    if (log[activeDate].items.length === 0) {
        delete log[activeDate];
    }

    localStorage.setItem('nv_log', JSON.stringify(log));
    renderCalendar();
    aggiornaUI();
}

async function cercaAlimentoOFF(query) {
    const url = `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return (Array.isArray(data.products) ? data.products : []).map((product) => ({
            nome: (product.product_name_it || product.product_name || 'Prodotto OFF') + (product.brands ? ` (${product.brands})` : ''),
            kcal: product.nutriments?.['energy-kcal_100g'] || 0,
            proteine: product.nutriments?.proteins_100g || 0,
            carboidrati: product.nutriments?.carbohydrates_100g || 0,
            grassi: product.nutriments?.fat_100g || 0,
            fe: 0,
            ca: 0,
            b12: 0,
            isOFF: true
        })).filter((product) => product.kcal > 0);
    } catch (error) {
        console.error('Errore nella comunicazione con Open Food Facts:', error);
        return [];
    }
}

let timeoutRicerca;
let latestSearchRequestId = 0;

function getSearchResultsContainerId(context) {
    if (context === 'main') return 'search-results';
    if (context === 'ricetta') return 'recipe-results';
    if (context === 'ai') return 'ai-results';
    return '';
}

function normalizeFoodResultKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\([^)]*\)/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\bprodotto off\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function dedupeFoodResults(results) {
    const seen = new Set();

    return results.filter((item) => {
        const rawName = item.nome || item.n || '';
        const key = normalizeFoodResultKey(rawName);
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function sortFoodResultsAlphabetically(results) {
    return [...results].sort((left, right) => {
        const leftName = String(left.nome || left.n || '').trim();
        const rightName = String(right.nome || right.n || '').trim();
        return leftName.localeCompare(rightName, 'it', { sensitivity: 'base' });
    });
}

function closeFoodSearchDropdown(context, clearInput = false) {
    const resultsId = getSearchResultsContainerId(context);
    const resDiv = document.getElementById(resultsId);
    if (resDiv) {
        resDiv.innerHTML = '';
    }

    if (!clearInput) {
        return;
    }

    const inputId = context === 'main'
        ? 'food-search'
        : (context === 'ricetta' ? 'recipe-search' : (context === 'ai' ? 'discover-search' : ''));

    if (!inputId) {
        return;
    }

    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
    }
}

function renderFoodSearchResults(results, resDiv, context, inputElement) {
    resDiv.innerHTML = '';

    if (!Array.isArray(results) || results.length === 0) {
        resDiv.innerHTML = "<div class='search-item' style='color:#dc3545; text-align:center;'>Nessun risultato trovato</div>";
        return;
    }

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'search-dropdown-close';
    closeButton.setAttribute('aria-label', 'Chiudi risultati ricerca');
    closeButton.innerText = 'x';
    closeButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeFoodSearchDropdown(context);
    };
    resDiv.appendChild(closeButton);

    results.forEach((f) => {
        const div = document.createElement('div');
        div.className = 'search-item';
        const nomeCibo = f.nome || f.n;
        const kcalCibo = f.kcal || f.k;

        div.innerHTML = `<span>${nomeCibo}</span> <small>${Math.round(kcalCibo)} kcal/100g</small>`;

        div.onclick = () => {
            selectedFood = f;
            if (context === 'main') {
                if (isFutureDay(activeDate)) {
                    alert(getDiaryDateErrorMessage(activeDate));
                    return;
                }
                document.getElementById('add-panel').style.display = 'block';
                document.getElementById('selected-name').innerText = nomeCibo;
                document.getElementById('qty').value = 100;
                updateSelectedFoodPreview();
            } else if (context === 'ricetta') {
                document.getElementById('recipe-add-panel').style.display = 'flex';
                document.getElementById('recipe-selected-name').innerText = nomeCibo;
                document.getElementById('recipe-qty').focus();
            } else if (context === 'ai') {
                if (!aiSelectedIngredients.includes(nomeCibo)) {
                    aiSelectedIngredients.push(nomeCibo);
                }
                renderAISelectedIngredients();
            }
            closeFoodSearchDropdown(context);
            inputElement.value = '';
        };

        resDiv.appendChild(div);
    });
}

async function cercaAlimento(e, context) {
    if (context === 'main' && isFutureDay(activeDate)) {
        e.target.value = '';
        return;
    }

    const query = e.target.value.toLowerCase().trim();
    const resultsId = getSearchResultsContainerId(context);

    const resDiv = document.getElementById(resultsId);
    if (!resDiv) return;

    if (query.length < 2) {
        clearTimeout(timeoutRicerca);
        resDiv.innerHTML = '';
        return;
    }

    clearTimeout(timeoutRicerca);

    const requestId = ++latestSearchRequestId;

    timeoutRicerca = setTimeout(async () => {
        const fullDb = [...db, ...ricetteSalvate.filter((item) => !item.aiGenerated)];
        const localResults = fullDb.filter((food) =>
            (food.nome && food.nome.toLowerCase().includes(query))
            || (food.n && food.n.toLowerCase().includes(query))
        );

        const sortedLocalResults = sortFoodResultsAlphabetically(localResults).slice(0, 15);
        renderFoodSearchResults(sortedLocalResults, resDiv, context, e.target);

        if (requestId !== latestSearchRequestId) {
            return;
        }

        const offResults = await cercaAlimentoOFF(query);

        if (requestId !== latestSearchRequestId) {
            return;
        }

        const combinedResults = sortFoodResultsAlphabetically(
            dedupeFoodResults([...localResults, ...offResults])
        ).slice(0, 15);
        renderFoodSearchResults(combinedResults, resDiv, context, e.target);
    }, 500);
}

function selezionaCibo(alimento) {
    ciboSelezionato = alimento;
    document.getElementById('selected-food-name').innerText = alimento.nome;
    document.getElementById('add-panel').style.display = 'flex';
    document.getElementById('search-results').innerHTML = '';
}

function salvaPasto() {
    if (isFutureDay(activeDate)) {
        alert(getDiaryDateErrorMessage(activeDate));
        return;
    }

    const qty = parseFloat(document.getElementById('qty').value);
    if (!selectedFood || isNaN(qty)) return;
    if (!currentMealType) {
        alert('Devi selezionare un pasto: Colazione, Pranzo, Cena o Spuntino');
        return;
    }

    const entry = buildDiaryEntry(selectedFood, qty, currentMealType);

    if (!log[activeDate]) {
        log[activeDate] = { k:0, p:0, c:0, g:0, w:0, fe:0, ca:0, b12:0, items: [] };
    }

    log[activeDate].items.push(entry);
    aggiornaTotaliGiorno(log[activeDate], entry, 1);

    localStorage.setItem('nv_log', JSON.stringify(log));
    closeAddPanel();
    renderCalendar();
    aggiornaUI();
}

function aggiungiIngredienteRicetta() {
    if (!selectedFood) {
        alert('Seleziona prima un ingrediente!');
        return;
    }

    const qty = parseFloat(document.getElementById('recipe-qty').value);
    if (isNaN(qty) || qty <= 0) {
        alert('Inserisci una quantità valida');
        document.getElementById('recipe-qty').focus();
        return;
    }

    const ratio = qty / 100;
    const item = {
        n: selectedFood.nome || selectedFood.n,
        k: (selectedFood.kcal || selectedFood.k) * ratio,
        p: (selectedFood.proteine || selectedFood.p) * ratio,
        c: (selectedFood.carboidrati || selectedFood.c) * ratio,
        g: (selectedFood.grassi || selectedFood.g) * ratio,
        fe: (selectedFood.fe || 0) * ratio,
        ca: (selectedFood.ca || 0) * ratio,
        b12: (selectedFood.b12 || 0) * ratio,
        qty
    };

    tempRecipe.items.push(item);
    tempRecipe.k += item.k;
    tempRecipe.p += item.p;
    tempRecipe.c += item.c;
    tempRecipe.g += item.g;
    tempRecipe.fe += item.fe;
    tempRecipe.ca += item.ca;
    tempRecipe.b12 += item.b12;

    renderTempRecipe();
    document.getElementById('recipe-search').focus();
    document.getElementById('recipe-qty').value = 100;
    document.getElementById('recipe-search').value = '';
    document.getElementById('recipe-results').innerHTML = '';
}

function confermaAggiunta() {
    const qty = parseFloat(document.getElementById('food-qty').value);
    const entry = {
        nome: ciboSelezionato.nome,
        kcal: Math.round((ciboSelezionato.kcal * qty) / 100),
        p: ((ciboSelezionato.proteine * qty) / 100).toFixed(1),
        c: ((ciboSelezionato.carboidrati * qty) / 100).toFixed(1),
        g: ((ciboSelezionato.grassi * qty) / 100).toFixed(1),
        qty: qty
    };
    diario.push(entry);
    localStorage.setItem('nv_diario', JSON.stringify(diario));
    document.getElementById('add-panel').style.display = 'none';
    aggiornaUI();
}

function renderTempRecipe() {
    const list = document.getElementById('current-recipe-items');
    if (!list) return;

    list.innerHTML = tempRecipe.items.map((item, idx) => `
        <li style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#f8f9fd;border-radius:12px;margin: 6px 0;">
            <span style="font-family:'Inter',sans-serif;">${formatIngredientDisplay(item)}</span>
            <span style="font-weight:700;">${Math.round(item.k)} kcal</span>
            <button onclick="rimuoviIngredienteRicetta(${idx})" style="background:#ff9800;border:none;color:white;border-radius:8px;padding:4px 10px;cursor:pointer;">×</button>
        </li>
    `).join('');

    const summary = document.getElementById('recipe-summary');
    if (summary) {
        summary.style.display = 'block';
        summary.innerHTML = `
            <strong>Analisi per porzione:</strong><br>
            Kcal: ${Math.round(tempRecipe.k)} | P: ${tempRecipe.p.toFixed(1)}g | C: ${tempRecipe.c.toFixed(1)}g | G: ${tempRecipe.g.toFixed(1)}g
        `;
    }
}

function rimuoviIngredienteRicetta(index) {
    const item = tempRecipe.items[index];
    if (!item) return;
    tempRecipe.k -= item.k;
    tempRecipe.p -= item.p;
    tempRecipe.c -= item.c;
    tempRecipe.g -= item.g;
    tempRecipe.fe -= item.fe;
    tempRecipe.ca -= item.ca;
    tempRecipe.b12 -= item.b12;
    tempRecipe.items.splice(index, 1);
    renderTempRecipe();
}

function formatIngredientQtyLabel(value) {
    const qty = Number(value || 0);
    if (!Number.isFinite(qty) || qty <= 0) {
        return '';
    }

    return Number.isInteger(qty) ? `${qty}g` : `${qty.toFixed(1).replace(/\.0$/, '')}g`;
}

function formatIngredientDisplay(item) {
    if (item && typeof item === 'object') {
        const name = String(item.n || item.name || item.ingredient || '').trim();
        const qtyLabel = formatIngredientQtyLabel(item.qty);
        return qtyLabel ? `${name} ${qtyLabel}`.trim() : name;
    }

    return String(item || '').trim();
}

function salvaRicettaDefinitiva() {
    const nome = document.getElementById('recipe-name').value.trim();
    if (!nome || tempRecipe.items.length === 0) {
        alert('Inserisci un nome e almeno un ingrediente!');
        return;
    }

    const nomeFormattato = nome;
    const nuovaRicetta = {
        n: nomeFormattato,
        k: tempRecipe.k,
        p: tempRecipe.p,
        c: tempRecipe.c,
        g: tempRecipe.g,
        fe: tempRecipe.fe,
        ca: tempRecipe.ca,
        b12: tempRecipe.b12,
        items: [...tempRecipe.items]
    };

    ricetteSalvate.push(nuovaRicetta);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));

    tempRecipe = { items: [], k: 0, p: 0, c: 0, g: 0, fe: 0, ca: 0, b12: 0 };
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-search').value = '';
    document.getElementById('recipe-results').innerHTML = '';
    document.getElementById('recipe-summary').style.display = 'none';
    document.getElementById('current-recipe-items').innerHTML = '';

    aggiornaListaRicetteSalvate();
    alert('Ricetta salvata con successo!');
}

function modificaRicetta(idx) {
    const r = ricetteSalvate[idx];
    if (!r) return;

    document.getElementById('recipe-name').value = r.n;
    tempRecipe = {
        items: r.items ? [...r.items] : [],
        k: r.k || 0,
        p: r.p || 0,
        c: r.c || 0,
        g: r.g || 0,
        fe: r.fe || 0,
        ca: r.ca || 0,
        b12: r.b12 || 0
    };

    ricetteSalvate.splice(idx, 1);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
    renderTempRecipe();
    aggiornaListaRicetteSalvate();
    document.getElementById('recipe-search').focus();
}

function eliminaRicetta(idx) {
    if (!confirm('Vuoi davvero eliminare questa ricetta?')) return;
    ricetteSalvate.splice(idx, 1);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
    aggiornaListaRicetteSalvate();
}

function updateAiModeResultsVisibility(activeResultId) {
    const resultsWrap = document.getElementById('chef-mode-results');
    const resultIds = ['ai-recipe-result', 'ai-day-plan-result'];
    let visibleResultFound = false;

    resultIds.forEach((resultId) => {
        const resultEl = document.getElementById(resultId);
        if (!resultEl) return;

        const hasContent = resultEl.innerHTML.trim().length > 0;
        const shouldShow = resultId === activeResultId && hasContent;
        resultEl.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) visibleResultFound = true;
    });

    if (resultsWrap) {
        resultsWrap.style.display = visibleResultFound ? 'block' : 'none';
    }
}

function getChipGroupForHiddenInput(hiddenInput) {
    if (!hiddenInput) return null;

    const nextElement = hiddenInput.nextElementSibling;
    if (nextElement?.classList?.contains('chip-group')) {
        return nextElement;
    }

    return hiddenInput.parentElement?.querySelector('.chip-group') || null;
}

function clearChipInputSelection(hiddenInputId) {
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!hiddenInput) return;

    hiddenInput.value = '';
    const chipGroup = getChipGroupForHiddenInput(hiddenInput);
    chipGroup?.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
}

function toggleChefModeRecipeFlow() {
    const selector = document.getElementById('ai-mode-selector');
    const mealTypeInput = document.getElementById('chef-recipe-meal-type');
    const mealTypeGroup = document.getElementById('chef-mode-meal-type-group');
    const difficultyGroup = document.getElementById('chef-mode-difficulty-group');
    const isRecipeMode = selector?.value === 'recipe';
    const hasMealType = Boolean(mealTypeInput?.value);

    if (!isRecipeMode) {
        clearChipInputSelection('chef-recipe-meal-type');
        clearChipInputSelection('chef-recipe-difficulty');
    }

    if (mealTypeGroup) {
        mealTypeGroup.style.display = isRecipeMode ? 'flex' : 'none';
    }

    if (difficultyGroup) {
        difficultyGroup.style.display = isRecipeMode && hasMealType ? 'flex' : 'none';
    }

    if (!isRecipeMode || !hasMealType) {
        clearChipInputSelection('chef-recipe-difficulty');
    }
}

function toggleAiMode() {
    const selector = document.getElementById('ai-mode-selector');
    if (!selector) return;

    const mode = selector.value || '';
    const fieldGroups = {
        recipe: document.getElementById('ai-mode-recipes-fields'),
        daily: document.getElementById('ai-mode-daily-fields'),
        weekly: document.getElementById('ai-mode-weekly-fields')
    };
    const resultByMode = {
        recipe: 'ai-recipe-result',
        daily: 'ai-day-plan-result',
        weekly: 'ai-day-plan-result'
    };
    const recipeOptions = document.getElementById('chef-mode-recipe-options');
    const dailyButton = document.getElementById('chef-generate-daily-btn');
    const weeklyButton = document.getElementById('chef-generate-weekly-btn');
    const dailyNotes = document.getElementById('day-plan-ai-notes');
    const weeklyNotes = document.getElementById('weekly-plan-ai-notes');
    const dailyLunchContext = document.getElementById('day-plan-lunch-context');
    const weeklyLunchContext = document.getElementById('weekly-plan-lunch-context');

    Object.entries(fieldGroups).forEach(([key, element]) => {
        if (!element) return;
        element.style.display = key === mode && Boolean(mode) ? 'flex' : 'none';
    });

    if (recipeOptions) {
        recipeOptions.style.display = mode === 'recipe' ? 'flex' : 'none';
    }

    toggleChefModeRecipeFlow();

    if (dailyButton) {
        dailyButton.style.display = mode === 'daily' ? 'block' : 'none';
    }

    if (weeklyButton) {
        weeklyButton.style.display = mode === 'weekly' ? 'block' : 'none';
    }

    if (mode === 'weekly' && dailyNotes && weeklyNotes) {
        dailyNotes.value = weeklyNotes.value;
    }

    if (mode === 'weekly' && dailyLunchContext && weeklyLunchContext) {
        dailyLunchContext.value = weeklyLunchContext.value;
    }

    updateAiModeResultsVisibility(resultByMode[mode]);
}

window.toggleChefModeRecipeFlow = toggleChefModeRecipeFlow;
window.toggleAiMode = toggleAiMode;

function aggiornaListaRicetteSalvate() {
    const list = document.getElementById('preset-list');
    const panel = document.getElementById('saved-recipes-panel');
    if (!list) return;

    const hasSavedRecipes = Array.isArray(ricetteSalvate) && ricetteSalvate.length > 0;
    if (panel) {
        panel.style.display = hasSavedRecipes ? 'block' : 'none';
    }

    if (!hasSavedRecipes) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = ricetteSalvate.map((r, i) => `
        <li style="background:#fff;margin-bottom:8px;padding:10px;border-radius:15px;box-shadow:0 6px 14px rgba(31,57,87,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong style="font-family:'Poppins',sans-serif;">${r.n}</strong><br>
                    <small style="color:#7f8c8d;">${r.aiGenerated ? 'AI Mode salvata come ispirazione' : `${Math.round(r.k)} kcal / porzione`}</small>
                    ${Array.isArray(r.items) && r.items.length > 0 ? `<br><small style="color:#51606f;display:block;margin-top:4px;">${escapeHtml(r.items.slice(0, 4).map((item) => formatIngredientDisplay(item)).filter(Boolean).join(', '))}${r.items.length > 4 ? '...' : ''}</small>` : ''}
                </div>
                <div style="display:flex;gap:6px;">
                    ${r.aiGenerated ? '' : `<button onclick="modificaRicetta(${i})" style="background:#34b27f;color:white;border:none;border-radius:10px;padding:5px 8px;">✎</button>`}
                    <button onclick="eliminaRicetta(${i})" style="background:#ff9800;color:white;border:none;border-radius:10px;padding:5px 8px;">🗑</button>
                </div>
            </div>
        </li>
    `).join('');
}

function aggiornaUI() {
    if (!profilo) return;

    const giorno = log[activeDate] || { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };

    updateHomeStats();

    const feTarget = 14; const caTarget = 1000; const b12Target = 2.4;
    const fePerc = Math.min(100, (giorno.fe / feTarget) * 100);
    const caPerc = Math.min(100, (giorno.ca / caTarget) * 100);
    const b12Perc = Math.min(100, (giorno.b12 / b12Target) * 100);

    const feBar = document.getElementById('bar-fe');
    const caBar = document.getElementById('bar-ca');
    const b12Bar = document.getElementById('bar-b12');

    if (feBar) feBar.style.width = `${fePerc}%`;
    if (caBar) caBar.style.width = `${caPerc}%`;
    if (b12Bar) b12Bar.style.width = `${b12Perc}%`;

    const txtFe = document.getElementById('txt-fe');
    const txtCa = document.getElementById('txt-ca');
    const txtB12 = document.getElementById('txt-b12');

    if (txtFe) txtFe.innerText = `${giorno.fe.toFixed(1)} / ${feTarget}mg (${Math.round(fePerc)}%)`;
    if (txtCa) txtCa.innerText = `${giorno.ca.toFixed(1)} / ${caTarget}mg (${Math.round(caPerc)}%)`;
    if (txtB12) txtB12.innerText = `${giorno.b12.toFixed(2)} / ${b12Target}µg (${Math.round(b12Perc)}%)`;

    const list = document.getElementById('day-log-list');
    if (list) {
        list.innerHTML = giorno.items.map((item, idx) => `
            <li class="pasto-item">
                <div class="pasto-main">
                    <span><strong>${item.t || ''}</strong> ${item.n}</span>
                    <small>${Math.round(item.qty || 100)} g • ${Math.round(item.k)} kcal</small>
                </div>
                <div class="pasto-actions">
                    <button type="button" class="pasto-edit-btn" onclick="modificaPasto(${idx})">Modifica</button>
                    <button type="button" class="pasto-delete-btn" onclick="rimuoviPasto(${idx})">×</button>
                </div>
            </li>
        `).join('');
    }

    const dateTitle = document.getElementById('date-title-pretty');
    if (dateTitle) {
        dateTitle.innerText = 'OGGI HO MANGIATO:';
    }

    updateDiaryAddAvailability();

    updateHomeStats();
}


function aggiornaBarra(id, attuale, target) {
    const perc = Math.min((attuale / target) * 100, 100);
    document.getElementById(`${id}-bar`).style.width = perc + '%';
    document.getElementById(`${id}-val`).innerText = `${Math.round(attuale)} / ${target}g`;
}

function aggiornaRaccomandazioneAcqua(pesoUtenteKg) {
    const waterElement = document.getElementById('water-liters-target');
    if (!waterElement) {
        return;
    }

    const peso = Number(pesoUtenteKg);
    if (!(peso > 0)) {
        waterElement.innerText = '--';
        return;
    }

    const litriConsigliati = ((peso * 30) / 1000).toFixed(1);
    waterElement.innerText = litriConsigliati;

    const homeWater = document.getElementById('home-water');
    if (homeWater) {
        homeWater.innerText = `${litriConsigliati} L`;
    }

    const waterGoalDisplay = document.getElementById('water-goal-display');
    if (waterGoalDisplay) {
        waterGoalDisplay.innerText = `${litriConsigliati} L`;
    }
}

function aggiornaAcqua(v) {
    acqua = Math.max(0, acqua + v);
    localStorage.setItem('nv_acqua', acqua);
    aggiornaUI();
}

function rimuovi(index) {
    diario.splice(index, 1);
    localStorage.setItem('nv_diario', JSON.stringify(diario));
    aggiornaUI();
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getAIProfilePayload() {
    const storedProfile = JSON.parse(localStorage.getItem('nv_profilo')) || profilo || {};

    return {
        username: storedProfile.username || '',
        goal: storedProfile.goal || '',
        diet: storedProfile.diet || '',
        allergies: storedProfile.allergies || '',
        intolerances: storedProfile.intolerances || '',
        otherPathologies: storedProfile.otherPathologies || '',
        jobType: storedProfile.jobType || '',
        workoutsPerWeek: storedProfile.workoutsPerWeek || 0,
        weight: storedProfile.weight || 0,
        height: storedProfile.height || 0,
        age: storedProfile.age || 0,
        sex: storedProfile.sex || '',
        imc: storedProfile.imc || 0,
        imcCategory: storedProfile.imcCategory || '',
        maintenanceCalories: storedProfile.maintenanceCalories || storedProfile.target || 0,
        targetCalories: storedProfile.target || 0,
        goalCalorieDelta: storedProfile.goalCalorieDelta || 0,
        proteinTargetPerKg: storedProfile.proteinTargetPerKg || 0,
        proteinTargetGrams: storedProfile.proteinTarget || 0,
        carbsTargetGrams: storedProfile.carbsTarget || 0,
        fatTargetGrams: storedProfile.fatTarget || 0,
        fiberTargetGrams: storedProfile.fiberTarget || 0,
        mealsPerDay: storedProfile.mealsPerDay || 0,
        waterIntake: storedProfile.waterIntake || 0,
        waterTargetLiters: storedProfile.acquaObiettivo || 0,
        lunchContextPreference: storedProfile.lunchContextPreference === 'free-day' ? 'free-day' : 'workday',
        dinnerProteinPreference: normalizeDinnerProteinPreference(storedProfile.dinnerProteinPreference),
        dinnerProteinFrequency: normalizeDinnerProteinFrequency(storedProfile.dinnerProteinFrequency)
    };
}

function formatDeltaKcal(value) {
    const numeric = Number(value || 0);
    if (!numeric) {
        return '0 kcal';
    }

    return `${numeric > 0 ? '+' : ''}${Math.round(numeric)} kcal`;
}

function renderAICardList(items) {
    return (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

let lastWeeklyPlanPayload = null;

function normalizePlanningText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function shouldUseVeganPlanning(profile, extraSignals = '') {
    const signals = normalizePlanningText(`${extraSignals} ${profile?.diet || ''} ${profile?.goal || ''} ${profile?.otherPathologies || ''}`);
    return signals.includes('vegano')
        || signals.includes('vegan')
        || signals.includes('100% vegetale')
        || signals.includes('100 vegetale')
        || signals.includes('plant based')
        || signals.includes('plant-based')
        || signals.includes('totalmente vegetale');
}

function hasPlanningKeyword(text, keywords) {
    const normalized = normalizePlanningText(text);
    return (keywords || []).some((keyword) => normalized.includes(normalizePlanningText(keyword)));
}

function uniquePlanningStrings(values) {
    return [...new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function completePlanMealItems(slot, items, fallbacks) {
    const baseItems = Array.isArray(items) ? items.filter(Boolean) : [];
    const text = baseItems.join(' | ');
    const slotNormalized = normalizePlanningText(slot);
    const completedItems = [...baseItems];
    const addedComponents = [];

    if (!['pranzo', 'cena'].includes(slotNormalized)) {
        return { items: uniquePlanningStrings(completedItems), addedComponents };
    }

    const needsProtein = !hasPlanningKeyword(text, ['legumi', 'ceci', 'lenticchie', 'fagioli', 'edamame', 'pesce', 'salmone', 'sgombro', 'acciugh', 'tonno', 'carne', 'pollo', 'tacchino', 'uova', 'uovo', 'tofu', 'tempeh', 'ricotta', 'formaggio', 'grana', 'mozzarella', 'seitan', 'burger']);
    const needsCereal = !hasPlanningKeyword(text, ['pasta', 'riso', 'farro', 'orzo', 'quinoa', 'cous', 'grano saraceno', 'pane', 'cracker', 'patate', 'gnocchi', 'miglio']);
    const needsVegetables = !hasPlanningKeyword(text, ['verdur', 'insalata', 'carota', 'finocchio', 'zucchina', 'broccoli', 'spinaci', 'radicchio', 'bieta', 'cavolo', 'pomodoro', 'orto']);
    const needsHealthyFat = !hasPlanningKeyword(text, ['olio evo', 'olio extravergine', 'olio', 'frutta secca', 'semi', 'grassi buoni', 'avocado']);

    if (needsProtein && fallbacks?.protein) {
        completedItems.push(fallbacks.protein);
        addedComponents.push('proteine');
    }
    if (needsCereal && fallbacks?.cereal) {
        completedItems.push(fallbacks.cereal);
        addedComponents.push('cereali');
    }
    if (needsVegetables && fallbacks?.vegetables) {
        completedItems.push(fallbacks.vegetables);
        addedComponents.push('verdure');
    }
    if (needsHealthyFat && fallbacks?.healthyFat) {
        completedItems.push(fallbacks.healthyFat);
        addedComponents.push('grassi buoni');
    }

    return {
        items: uniquePlanningStrings(completedItems),
        addedComponents
    };
}

function tokenizePantryInput(value) {
    return uniquePlanningStrings(String(value || '').split(/[;,\n|]+/).map((item) => item.trim()))
        .map((item) => ({ raw: item, normalized: normalizePlanningText(item) }))
        .filter((item) => item.normalized.length >= 2);
}

const SHOPPING_ITEM_RULES = [
    { label: 'verdure di stagione', category: 'produce', keywords: ['verdure di stagione', 'verdure miste', 'verdure', 'orto'] },
    { label: 'insalata', category: 'produce', keywords: ['insalata mista', 'insalata'] },
    { label: 'pomodori', category: 'produce', keywords: ['pomodorini', 'pomodori', 'pomodoro'] },
    { label: 'rucola', category: 'produce', keywords: ['rucola'] },
    { label: 'avocado', category: 'produce', keywords: ['avocado'] },
    { label: 'zucchine', category: 'produce', keywords: ['zucchine', 'zucchina'] },
    { label: 'carote', category: 'produce', keywords: ['carote', 'carota'] },
    { label: 'spinaci', category: 'produce', keywords: ['spinaci', 'spinacio'] },
    { label: 'broccoli', category: 'produce', keywords: ['broccoli', 'broccolo'] },
    { label: 'cavolo nero', category: 'produce', keywords: ['cavolo nero'] },
    { label: 'melanzane', category: 'produce', keywords: ['melanzane', 'melanzana'] },
    { label: 'peperoni', category: 'produce', keywords: ['peperoni', 'peperone'] },
    { label: 'cetrioli', category: 'produce', keywords: ['cetrioli', 'cetriolo'] },
    { label: 'finocchi', category: 'produce', keywords: ['finocchi', 'finocchio'] },
    { label: 'cipolle', category: 'produce', keywords: ['cipolle', 'cipolla'] },
    { label: 'aglio', category: 'produce', keywords: ['aglio'] },
    { label: 'limoni', category: 'produce', keywords: ['limone', 'limoni'] },
    { label: 'frutta fresca', category: 'produce', keywords: ['frutta fresca', 'frutta', 'banana', 'mela', 'pere', 'pera', 'frutti di bosco', 'agrumi'] },
    { label: 'patate', category: 'produce', keywords: ['patate', 'patata'] },
    { label: 'ceci', category: 'legumes-plant-proteins', keywords: ['ceci'] },
    { label: 'lenticchie', category: 'legumes-plant-proteins', keywords: ['lenticchie', 'lenticchia'] },
    { label: 'fagioli', category: 'legumes-plant-proteins', keywords: ['fagioli', 'fagiolo', 'cannellini', 'borlotti'] },
    { label: 'piselli', category: 'legumes-plant-proteins', keywords: ['piselli', 'pisello'] },
    { label: 'edamame', category: 'legumes-plant-proteins', keywords: ['edamame'] },
    { label: 'tofu', category: 'legumes-plant-proteins', keywords: ['tofu'] },
    { label: 'tempeh', category: 'legumes-plant-proteins', keywords: ['tempeh'] },
    { label: 'hummus', category: 'legumes-plant-proteins', keywords: ['hummus'] },
    { label: 'burger vegetali', category: 'legumes-plant-proteins', keywords: ['burger vegetali', 'burger di lupini', 'burger'] },
    { label: 'yogurt di soia', category: 'legumes-plant-proteins', keywords: ['yogurt di soia'] },
    { label: 'bevanda di soia', category: 'legumes-plant-proteins', keywords: ['bevanda di soia', 'latte di soia'] },
    { label: 'pasta', category: 'grains-bakery', keywords: ['pasta'] },
    { label: 'riso', category: 'grains-bakery', keywords: ['riso'] },
    { label: 'quinoa', category: 'grains-bakery', keywords: ['quinoa'] },
    { label: 'farro', category: 'grains-bakery', keywords: ['farro'] },
    { label: 'orzo', category: 'grains-bakery', keywords: ['orzo'] },
    { label: 'cous cous', category: 'grains-bakery', keywords: ['cous cous', 'cous-cous'] },
    { label: 'polenta', category: 'grains-bakery', keywords: ['polenta'] },
    { label: 'miglio', category: 'grains-bakery', keywords: ['miglio'] },
    { label: 'avena', category: 'grains-bakery', keywords: ['avena'] },
    { label: 'pane', category: 'grains-bakery', keywords: ['pane', 'crostini', 'bruschette', 'bruschetta'] },
    { label: 'piadina', category: 'grains-bakery', keywords: ['piadina'] },
    { label: 'crackers integrali', category: 'grains-bakery', keywords: ['crackers', 'cracker'] },
    { label: 'feta', category: 'fridge-fresh', keywords: ['feta'] },
    { label: 'ricotta', category: 'fridge-fresh', keywords: ['ricotta'] },
    { label: 'mozzarella', category: 'fridge-fresh', keywords: ['mozzarella'] },
    { label: 'yogurt', category: 'fridge-fresh', keywords: ['yogurt greco', 'skyr', 'yogurt'] },
    { label: 'uova', category: 'fish-meat-eggs', keywords: ['uova', 'uovo'] },
    { label: 'pollo', category: 'fish-meat-eggs', keywords: ['pollo', 'tacchino'] },
    { label: 'manzo', category: 'fish-meat-eggs', keywords: ['manzo', 'ragu di manzo', 'carne'] },
    { label: 'branzino', category: 'fish-meat-eggs', keywords: ['branzino'] },
    { label: 'orata', category: 'fish-meat-eggs', keywords: ['orata'] },
    { label: 'merluzzo', category: 'fish-meat-eggs', keywords: ['merluzzo', 'baccala'] },
    { label: 'salmone', category: 'fish-meat-eggs', keywords: ['salmone'] },
    { label: 'olio EVO', category: 'condiments-pantry', keywords: ['olio evo', 'olio extravergine', 'olio'] },
    { label: 'olive', category: 'condiments-pantry', keywords: ['olive'] },
    { label: 'semi di lino o chia', category: 'condiments-pantry', keywords: ['semi di lino', 'semi di chia', 'chia', 'lino'] },
    { label: 'semi di girasole', category: 'condiments-pantry', keywords: ['semi di girasole'] },
    { label: 'frutta secca', category: 'condiments-pantry', keywords: ['frutta secca', 'noci', 'mandorle'] },
    { label: 'tahina', category: 'condiments-pantry', keywords: ['tahina'] },
    { label: 'paprika', category: 'condiments-pantry', keywords: ['paprika'] },
    { label: 'curry', category: 'condiments-pantry', keywords: ['curry'] },
    { label: 'erbe aromatiche', category: 'condiments-pantry', keywords: ['aromi', 'rosmarino', 'basilico', 'erbe aromatiche'] }
];

function cleanShoppingPhrase(value) {
    return String(value || '')
        .replace(/\([^)]*\)/g, ' ')
        .replace(/\b(inizio con|apertura con|eventuale|contorno di|quota|fonte proteica prioritaria|come base proteica|come scelta principale|come quota glucidica|di accompagnamento|di supporto|ben dichiarat[oaie]|preferibilmente a crudo|struttura facile da preparare o portare fuori casa)\b/gi, ' ')
        .replace(/\b(al cartoccio|al forno|al vapore|in padella|tostat[oaie]|grigliat[oaie]|semplice|semplici|legger[oaie]|cott[oaie]|crud[oaie])\b/gi, ' ')
        .replace(/[.:]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractShoppingItemsFromText(value) {
    const normalized = normalizePlanningText(value);
    if (!normalized || hasPlanningKeyword(normalized, ['eventuale', 'controllo', 'focus del giorno'])) {
        return [];
    }

    const matched = SHOPPING_ITEM_RULES
        .filter((rule) => hasPlanningKeyword(normalized, rule.keywords))
        .map((rule) => rule.label);

    if (matched.length > 0) {
        return uniquePlanningStrings(matched);
    }

    return uniquePlanningStrings(
        cleanShoppingPhrase(value)
            .split(/,|;|\/|\boppure\b|\be\b/gi)
            .map((item) => item.trim())
            .filter((item) => item.length >= 3 && !hasPlanningKeyword(item, ['fame', 'giornata', 'profilo', 'rotazione', 'struttura']))
            .slice(0, 3)
    );
}

function buildWeeklyShoppingInsights(week, pantryRaw) {
    const pantryTokens = tokenizePantryInput(pantryRaw);
    const allItems = uniquePlanningStrings((Array.isArray(week?.days) ? week.days : []).flatMap((day) =>
        (Array.isArray(day?.meals) ? day.meals : []).flatMap((meal) => (Array.isArray(meal?.items) ? meal.items : []))
    ));
    const extractedItems = uniquePlanningStrings(allItems.flatMap((item) => extractShoppingItemsFromText(item)));
    const alreadyCovered = [];
    const toBuy = [];

    extractedItems.forEach((item) => {
        const normalizedItem = normalizePlanningText(item);
        const hasMatch = pantryTokens.some((token) => normalizedItem.includes(token.normalized) || token.normalized.includes(normalizedItem));
        if (hasMatch) {
            alreadyCovered.push(item);
        } else {
            toBuy.push(item);
        }
    });

    return {
        pantryLabels: pantryTokens.map((token) => token.raw),
        alreadyCovered: uniquePlanningStrings(alreadyCovered),
        toBuy: uniquePlanningStrings(toBuy)
    };
}

function getShoppingCategoryLabel(key) {
    return {
        produce: 'Ortofrutta',
        'legumes-plant-proteins': 'Legumi e proteine vegetali',
        'grains-bakery': 'Cereali, pane e forno',
        'fridge-fresh': 'Banco frigo e freschi',
        'fish-meat-eggs': 'Pescheria, carni e uova',
        'condiments-pantry': 'Dispensa, condimenti e semi',
        other: 'Altro'
    }[key] || 'Altro';
}

function categorizeShoppingItem(item) {
    const normalized = normalizePlanningText(item);
    const matchedRule = SHOPPING_ITEM_RULES.find((rule) => normalizePlanningText(rule.label) === normalized || hasPlanningKeyword(normalized, rule.keywords));

    if (matchedRule) {
        return matchedRule.category;
    }

    if (hasPlanningKeyword(normalized, ['verdur', 'insalata', 'pomodor', 'rucola', 'avocado', 'zucchine', 'carote', 'spinaci', 'olive', 'radicchio', 'stagione', 'frutta', 'patate'])) {
        return 'produce';
    }

    if (hasPlanningKeyword(normalized, ['ceci', 'lenticchie', 'fagioli', 'piselli', 'edamame', 'tofu', 'tempeh', 'hummus', 'burger vegetali'])) {
        return 'legumes-plant-proteins';
    }

    if (hasPlanningKeyword(normalized, ['pasta', 'riso', 'quinoa', 'farro', 'polenta', 'piadina', 'pane', 'cous cous', 'cous-cous', 'tagliatelle', 'miglio', 'avena'])) {
        return 'grains-bakery';
    }

    if (hasPlanningKeyword(normalized, ['feta', 'ricotta', 'mozzarella', 'yogurt', 'skyr'])) {
        return 'fridge-fresh';
    }

    if (hasPlanningKeyword(normalized, ['pesce', 'branzino', 'orata', 'merluzzo', 'pollo', 'manzo', 'uova', 'uovo'])) {
        return 'fish-meat-eggs';
    }

    if (hasPlanningKeyword(normalized, ['olio', 'semi', 'girasole', 'aromi', 'rosmarino', 'paprika', 'limone', 'curry', 'tahina'])) {
        return 'condiments-pantry';
    }

    return 'other';
}

function groupShoppingItemsByCategory(items) {
    const groups = {
        produce: [],
        'legumes-plant-proteins': [],
        'grains-bakery': [],
        'fridge-fresh': [],
        'fish-meat-eggs': [],
        'condiments-pantry': [],
        other: []
    };

    (items || []).forEach((item) => {
        groups[categorizeShoppingItem(item)].push(item);
    });

    return Object.entries(groups)
        .filter(([, values]) => values.length > 0)
        .map(([key, values]) => ({
            key,
            label: getShoppingCategoryLabel(key),
            items: uniquePlanningStrings(values)
        }));
}

function refreshWeeklyPlanDerivedViews() {
    if (lastWeeklyPlanPayload) {
        renderAIWeeklyPlanResults(lastWeeklyPlanPayload);
    }
}

function getLunchContextLabel(value) {
    return value === 'free-day' ? 'Giorno libero' : 'Giorno lavorativo';
}

function normalizeDinnerProteinPreference(value) {
    return ['uova', 'tofu-tempeh', 'latticini-light', 'burger-vegetali'].includes(value)
        ? value
        : 'variata';
}

function normalizeDinnerProteinFrequency(value) {
    return ['1-2', '2-3', '3-4', '5+'].includes(value)
        ? value
        : 'libera';
}

function getDinnerProteinPreferenceLabel(value) {
    const normalized = normalizeDinnerProteinPreference(value);

    return {
        variata: 'Rotazione serale varia',
        uova: 'Preferenza serale per uova',
        'tofu-tempeh': 'Preferenza serale per tofu o tempeh',
        'latticini-light': 'Preferenza serale per latticini light',
        'burger-vegetali': 'Preferenza serale per burger vegetali o lupini'
    }[normalized] || 'Rotazione serale varia';
}

function getDinnerProteinFrequencyLabel(value) {
    const normalized = normalizeDinnerProteinFrequency(value);

    return {
        libera: 'Libero durante la settimana',
        '1-2': 'Circa 1-2 cene a settimana',
        '2-3': 'Circa 2-3 cene a settimana',
        '3-4': 'Circa 3-4 cene a settimana',
        '5+': 'Quasi ogni sera'
    }[normalized] || 'Libero durante la settimana';
}

function getDinnerProteinPreferencePrompt(value) {
    const normalized = normalizeDinnerProteinPreference(value);

    return {
        variata: 'mantieni una rotazione flessibile tra fonti proteiche serali diverse',
        uova: 'puoi dare priorita alle uova come opzione serale piu spontanea, senza renderle obbligatorie',
        'tofu-tempeh': 'puoi dare priorita a tofu o tempeh come base proteica serale, richiamando tecniche semplici ma identitarie',
        'latticini-light': 'puoi dare priorita a ricotta light, feta light o mozzarella proteica come opzioni serali pratiche',
        'burger-vegetali': 'puoi dare priorita a burger vegetali proteici o burger di lupini come soluzione serale pratica'
    }[normalized] || 'mantieni una rotazione flessibile tra fonti proteiche serali diverse';
}

function getDinnerProteinFrequencyPrompt(value) {
    const normalized = normalizeDinnerProteinFrequency(value);

    return {
        libera: 'usa la preferenza serale come orientamento morbido, senza trasformarla in una frequenza obbligatoria',
        '1-2': 'mantieni questa scelta serale solo in circa 1 o 2 cene settimanali, lasciando ampia rotazione nelle altre',
        '2-3': 'mantieni questa scelta serale in circa 2 o 3 cene settimanali, distinguendo chiaramente preferenza e frequenza d uso',
        '3-4': 'puoi usare questa scelta serale come asse di circa 3 o 4 cene settimanali, senza renderla esclusiva',
        '5+': 'puoi usare questa scelta serale molto spesso durante la settimana, pur lasciando piccole variazioni utili'
    }[normalized] || 'usa la preferenza serale come orientamento morbido, senza trasformarla in una frequenza obbligatoria';
}

function buildDinnerPreferencePlanNote(profile) {
    return `Preferenza proteica serale considerata: ${getDinnerProteinPreferenceLabel(profile?.dinnerProteinPreference || 'variata')}. Frequenza suggerita: ${getDinnerProteinFrequencyLabel(profile?.dinnerProteinFrequency || 'libera')}.`;
}

function cloneClinicalGuidanceValue(value) {
    return JSON.parse(JSON.stringify(value));
}

function getClinicalGuidanceProfiles() {
    return Object.entries(window.clinicalNutritionGuidance || {})
        .map(([key, profile]) => ({ key, ...(profile || {}) }))
        .sort((left, right) => Number(right.priority || 0) - Number(left.priority || 0));
}

function matchesClinicalGuidanceCriteria(profile, criteria) {
    const age = Number(profile?.age || 0);
    const imc = Number(profile?.imc || 0);
    const targetCalories = Number(profile?.targetCalories || 0);
    const goal = String(profile?.goal || '').toLowerCase();
    const sex = String(profile?.sex || '').toLowerCase();
    const otherPathologies = String(profile?.otherPathologies || '').toLowerCase();
    const signals = Array.isArray(criteria?.goalSignals) ? criteria.goalSignals : [];
    const sexSignals = Array.isArray(criteria?.sexSignals) ? criteria.sexSignals : [];
    const pathologySignals = Array.isArray(criteria?.pathologySignals) ? criteria.pathologySignals : [];

    return age >= Number(criteria?.ageMin || 0)
        && age <= Number(criteria?.ageMax || 200)
        && imc >= Number(criteria?.imcMin || 0)
        && (criteria?.imcMax == null || imc <= Number(criteria.imcMax))
        && (targetCalories === 0 || ((criteria?.targetCaloriesMin == null || targetCalories >= Number(criteria.targetCaloriesMin))
            && (criteria?.targetCaloriesMax == null || targetCalories <= Number(criteria.targetCaloriesMax))))
        && (!signals.length || signals.some((signal) => goal.includes(String(signal).toLowerCase())) || !goal)
        && (!sexSignals.length || sexSignals.some((signal) => sex.includes(String(signal).toLowerCase())) || !sex)
        && (!pathologySignals.length || pathologySignals.some((signal) => otherPathologies.includes(String(signal).toLowerCase())));
}

function getClinicalNutritionContext(profile) {
    const profiles = getClinicalGuidanceProfiles();
    const match = profiles.find((source) => matchesClinicalGuidanceCriteria(profile, source.criteria || {}));

    if (!match) {
        return { applicable: false };
    }

    return {
        ...cloneClinicalGuidanceValue(match),
        applicable: true,
        selectedProfileKey: match.key
    };
}

function getLunchContextRecipeNote(value) {
    return value === 'free-day'
        ? 'Il tuo profilo indica un pranzo da giorno libero: qui la proposta puo essere un po piu distesa e piacevole, senza perdere struttura nutrizionale.'
        : 'Il tuo profilo indica un pranzo da giorno lavorativo: qui la proposta resta pratica, leggibile e facile da inserire nella routine.';
}

function getLunchContextSnackStrategy(value) {
    if (value === 'free-day') {
        return {
            morningTitle: 'Spuntino mattina leggero e ordinato',
            morningWhy: 'Tiene ordinata la fame senza caricare troppo una giornata in cui il pranzo puo essere piu comodo o piu ricco.',
            morningItems: ['1 yogurt proteico leggero oppure kefir', 'frutto piccolo solo se serve'],
            morningFat: 1,
            afternoonTitle: 'Spuntino pomeriggio leggero di riequilibrio',
            afternoonWhy: 'Aiuta a non spostare troppa fame sulla cena dopo un pranzo piu disteso, ma senza aggiungere peso inutile.',
            afternoonItems: ['1 frutto oppure yogurt greco piccolo', 'eventuale tisana o bevanda non zuccherata'],
            afternoonFat: 4,
            guidance: 'Con pranzo da giorno libero gli spuntini restano piu leggeri e di riequilibrio.'
        };
    }

    return {
        morningTitle: 'Spuntino mattina pratico e protettivo',
        morningWhy: 'Aiuta a distribuire fame e proteine in una giornata in cui il pranzo deve restare rapido e funzionale.',
        morningItems: ['1 yogurt proteico o skyr', 'frutto piccolo se serve'],
        morningFat: 2,
        afternoonTitle: 'Spuntino pomeriggio ponte verso la cena',
        afternoonWhy: 'Serve a non arrivare scarico a cena e a mantenere stabilita in una giornata piu compressa.',
        afternoonItems: ['1 frutto', 'yogurt greco oppure piccola quota di frutta secca'],
        afternoonFat: 6,
        guidance: 'Con pranzo da giorno lavorativo gli spuntini restano piu pratici e protettivi.'
    };
}

function getLunchContextDinnerStrategy(value, dinnerProteinPreference = 'variata') {
    const normalizedPreference = normalizeDinnerProteinPreference(dinnerProteinPreference);

    if (value === 'free-day') {
        return {
            title: 'Cena con apertura vegetale e proteina vegetale o uova',
            why: 'Dopo un pranzo piu disteso, la cena puo restare piu pulita ma strutturata: apertura con verdure crude, proteina ben leggibile, carboidrato semplice e frutta solo se serve davvero.',
            items: ['Inizio con insalata oppure carota o finocchio da sgranocchiare', normalizedPreference === 'tofu-tempeh' ? '250 g tofu oppure 150 g tempeh come base proteica, con idea guida tipo tofu limone e pepe rosa o tempeh tahina e limone' : (normalizedPreference === 'uova' ? '3 uova intere come base proteica, anche in frittata con contorno vegetale' : (normalizedPreference === 'latticini-light' ? '150 g ricotta light oppure feta light o mozzarella proteica come base proteica' : (normalizedPreference === 'burger-vegetali' ? '2 burger vegetali proteici oppure burger di lupini come base proteica' : '250 g tofu oppure 150 g tempeh, oppure 3 uova intere come base proteica'))), '1 patata americana oppure 2 patate medio-grandi come quota glucidica', 'verdure di accompagnamento', '2 cucchiai di olio EVO ben dichiarati', 'eventuale 1 porzione di frutta a fine pasto se coerente con fame e giornata'],
            carbs: 34,
            fat: 14
        };
    }

    return {
        title: 'Cena pratica con apertura vegetale e quota proteica ruotabile',
        why: 'Dopo un pranzo piu pratico e rapido, la cena puo restare organizzabile ma completa: apertura vegetale, proteina chiara, carboidrato semplice e condimento dichiarato.',
        items: ['Inizio con insalata oppure carota o finocchio da sgranocchiare', normalizedPreference === 'tofu-tempeh' ? 'Tofu o tempeh come scelta principale, con idea guida tipo tofu limone e pepe rosa oppure polpette di tofu e spinaci' : (normalizedPreference === 'uova' ? '3 uova intere come scelta principale, anche in frittata pratica' : (normalizedPreference === 'latticini-light' ? 'Ricotta light, feta light o mozzarella proteica come scelta principale' : (normalizedPreference === 'burger-vegetali' ? '2 burger vegetali proteici oppure burger di lupini come scelta principale' : '3 uova intere oppure tofu/tempeh, oppure ricotta light o burger vegetali proteici come alternativa'))), '60 g riso a chicco lungo o altri cereali gia pronti, oppure 2-3 fette di pane scuro', 'verdure cotte o crude di accompagnamento', '2 cucchiai di olio EVO ben dichiarati', 'eventuale 1 porzione di frutta a fine pasto se coerente con il profilo'],
        carbs: 40,
        fat: 16
    };
}

function getSnackContextBadge(value) {
    return value === 'free-day'
        ? { label: 'Riequilibrio giorno libero', className: 'ai-recipe-tag-free-day' }
        : { label: 'Snack giorno lavorativo', className: 'ai-recipe-tag-workday' };
}

function applyLunchContextPreference(profileData) {
    const lunchContextSelect = document.getElementById('day-plan-lunch-context');
    if (!lunchContextSelect) return;

    lunchContextSelect.value = profileData?.lunchContextPreference === 'free-day' ? 'free-day' : 'workday';
}

function persistLunchContextPreference(lunchContext) {
    const normalizedLunchContext = lunchContext === 'free-day' ? 'free-day' : 'workday';
    const currentProfile = JSON.parse(localStorage.getItem('nv_profilo')) || userProfile || null;
    if (!currentProfile) return normalizedLunchContext;

    const updatedProfile = {
        ...currentProfile,
        lunchContextPreference: normalizedLunchContext
    };

    profilo = updatedProfile;
    userProfile = updatedProfile;
    localStorage.setItem('nv_profilo', JSON.stringify(updatedProfile));

    const diaryProfile = JSON.parse(localStorage.getItem('userDiaryProfile')) || {};
    localStorage.setItem('userDiaryProfile', JSON.stringify({
        ...diaryProfile,
        dataCreazione: diaryProfile.dataCreazione || new Date().toLocaleDateString(),
        profilo: {
            ...(diaryProfile.profilo || {}),
            ...updatedProfile
        }
    }));

    return normalizedLunchContext;
}

const AI_RECIPE_MODE_SLOTS = [
    { key: 'base', label: 'Cucina base', difficulty: 'Semplice' },
    { key: 'media', label: 'Cucina media', difficulty: 'Media' },
    { key: 'chef', label: 'Chef mode', difficulty: 'Chef' },
    { key: 'salvafrigo', label: 'Salvafrigo', difficulty: 'Salvafrigo' }
];

const AI_DAILY_RECIPE_GUARANTEE_LIMIT = 5;
const AI_DAILY_RECIPE_USAGE_STORAGE_KEY = 'nv_ai_recipe_daily_usage_v1';
const GEMINI_CACHE_STORAGE_KEY = 'nv_gemini_response_cache_v1';
const GEMINI_CACHE_MAX_ENTRIES_PER_MODE = 8;

function getLocalIsoDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getAiRecipeUserUsageKey(profile = {}) {
    const username = String(profile?.username || profile?.name || 'utente').trim().toLowerCase();
    const age = String(profile?.age || '').trim();
    const sex = String(profile?.sex || '').trim().toLowerCase();
    return [username || 'utente', sex || 'na', age || 'na'].join('|');
}

function readAiDailyRecipeUsageState() {
    try {
        const raw = window.localStorage?.getItem(AI_DAILY_RECIPE_USAGE_STORAGE_KEY) || '{}';
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
        return {};
    }
}

function writeAiDailyRecipeUsageState(state) {
    try {
        window.localStorage?.setItem(AI_DAILY_RECIPE_USAGE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // no-op
    }
}

function getAiDailyRecipeGuaranteeInfo(profile = {}) {
    const state = readAiDailyRecipeUsageState();
    const userKey = getAiRecipeUserUsageKey(profile);
    const todayKey = getLocalIsoDateKey();
    const entry = state[userKey] || {};
    const used = entry.date === todayKey ? Math.min(AI_DAILY_RECIPE_GUARANTEE_LIMIT, Number(entry.count || 0)) : 0;
    return {
        userKey,
        dateKey: todayKey,
        used,
        remaining: Math.max(0, AI_DAILY_RECIPE_GUARANTEE_LIMIT - used),
        limit: AI_DAILY_RECIPE_GUARANTEE_LIMIT,
        guaranteeActive: used < AI_DAILY_RECIPE_GUARANTEE_LIMIT
    };
}

function consumeAiDailyRecipeGuarantee(profile = {}) {
    const info = getAiDailyRecipeGuaranteeInfo(profile);
    const state = readAiDailyRecipeUsageState();
    state[info.userKey] = {
        date: info.dateKey,
        count: Math.min(info.limit, info.used + 1)
    };
    writeAiDailyRecipeUsageState(state);
    return getAiDailyRecipeGuaranteeInfo(profile);
}

function delayMs(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeGeminiCacheMode(mode) {
    const normalized = String(mode || '').trim().toLowerCase();
    if (normalized === 'ricetta-su-misura') return 'recipe';
    if (normalized === 'piano-giornaliero') return 'daily';
    if (normalized === 'piano-settimanale') return 'weekly';
    return normalized || 'generic';
}

function readGeminiCacheState() {
    try {
        const raw = window.localStorage?.getItem(GEMINI_CACHE_STORAGE_KEY) || '{}';
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
        return {};
    }
}

function writeGeminiCacheState(state) {
    try {
        window.localStorage?.setItem(GEMINI_CACHE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // no-op
    }
}

function buildGeminiCacheKey(mode, payload = {}) {
    return JSON.stringify({
        mode: normalizeGeminiCacheMode(mode),
        payload
    });
}

function persistGeminiCacheEntry(mode, payload, responsePayload, metadata = {}) {
    const normalizedMode = normalizeGeminiCacheMode(mode);
    const state = readGeminiCacheState();
    const key = buildGeminiCacheKey(normalizedMode, payload);
    const existingEntries = Array.isArray(state[normalizedMode]) ? state[normalizedMode] : [];
    const nextEntry = {
        key,
        savedAt: Date.now(),
        payload,
        responsePayload,
        metadata
    };

    state[normalizedMode] = [nextEntry, ...existingEntries.filter((entry) => entry?.key !== key)].slice(0, GEMINI_CACHE_MAX_ENTRIES_PER_MODE);
    writeGeminiCacheState(state);
}

function loadGeminiCacheEntry(mode, payload, matcher = null) {
    const normalizedMode = normalizeGeminiCacheMode(mode);
    const state = readGeminiCacheState();
    const entries = Array.isArray(state[normalizedMode]) ? state[normalizedMode] : [];
    const exactKey = buildGeminiCacheKey(normalizedMode, payload);
    const exactEntry = entries.find((entry) => entry?.key === exactKey);

    if (exactEntry) {
        return exactEntry;
    }

    if (typeof matcher === 'function') {
        return entries.find((entry) => matcher(entry)) || null;
    }

    return entries[0] || null;
}

function normalizeGeminiCacheText(value) {
    return String(value || '').trim().toLowerCase();
}

function extractGeminiRecipeCacheContext(payload = {}) {
    const profile = payload?.profilo_utente || {};
    const request = payload?.richiesta_ricetta || {};
    const rawIngredients = normalizeGeminiCacheText(request.ingrediente_o_base || '');
    const ingredientTokens = rawIngredients
        .split(/[;,]/)
        .map((item) => normalizeGeminiCacheText(item))
        .filter(Boolean);

    return {
        mealType: normalizeGeminiCacheText(request.tipo_pasto || ''),
        requestedMode: normalizeAIRecipeRequestedMode(request.modalita_ui || request.difficolta || ''),
        goal: normalizeGeminiCacheText(profile.obiettivo || ''),
        diet: normalizeGeminiCacheText(profile.dieta || ''),
        people: Number(request.persone || 0),
        ingredientTokens
    };
}

function countGeminiIngredientOverlap(leftTokens = [], rightTokens = []) {
    if (!Array.isArray(leftTokens) || !Array.isArray(rightTokens) || leftTokens.length === 0 || rightTokens.length === 0) {
        return 0;
    }

    const rightSet = new Set(rightTokens);
    return leftTokens.filter((token) => rightSet.has(token)).length;
}

function scoreGeminiRecipeCacheEntry(entry, payload, mealType, requestedMode) {
    const currentContext = extractGeminiRecipeCacheContext(payload);
    const normalizedMealType = String(mealType || '').trim().toLowerCase();
    const normalizedMode = normalizeAIRecipeRequestedMode(requestedMode);
    const entryMealType = String(entry?.metadata?.mealType || '').trim().toLowerCase();
    const entryMode = normalizeAIRecipeRequestedMode(entry?.metadata?.requestedMode || '');
    const entryContext = extractGeminiRecipeCacheContext(entry?.payload || {});
    let score = 0;

    if (entryMealType && normalizedMealType && entryMealType === normalizedMealType) {
        score += 6;
    }

    if (entryMode && normalizedMode && entryMode === normalizedMode) {
        score += 4;
    }

    if (entryMealType && normalizedMealType && entryMealType.includes(normalizedMealType)) {
        score += 1;
    }

    if (entryMode && normalizedMode && entryMode.includes(normalizedMode)) {
        score += 1;
    }

    if (entryContext.goal && currentContext.goal && entryContext.goal === currentContext.goal) {
        score += 2;
    }

    if (entryContext.diet && currentContext.diet && entryContext.diet === currentContext.diet) {
        score += 2;
    }

    if (entryContext.people > 0 && currentContext.people > 0 && entryContext.people === currentContext.people) {
        score += 1;
    }

    score += Math.min(4, countGeminiIngredientOverlap(entryContext.ingredientTokens, currentContext.ingredientTokens));

    return score;
}

function loadBestGeminiRecipeCacheEntry(payload, mealType, requestedMode) {
    const exactEntry = loadGeminiCacheEntry('recipe', payload);
    if (exactEntry) {
        return exactEntry;
    }

    const state = readGeminiCacheState();
    const entries = Array.isArray(state.recipe) ? state.recipe : [];
    if (entries.length === 0) {
        return null;
    }

    return [...entries]
        .map((entry) => ({ entry, score: scoreGeminiRecipeCacheEntry(entry, payload, mealType, requestedMode) }))
        .filter((candidate) => candidate.score > 0)
        .sort((left, right) => right.score - left.score || Number(right.entry?.savedAt || 0) - Number(left.entry?.savedAt || 0))[0]?.entry || null;
}

function shouldRetryGeminiClientError(error) {
    const message = String(error?.message || error || '').toLowerCase();
    return message.includes('429')
        || message.includes('quota')
        || message.includes('temporaneamente')
        || message.includes('timeout')
        || message.includes('networkerror')
        || message.includes('non raggiungibile')
        || message.includes('errore gemini 500')
        || message.includes('errore gemini 502')
        || message.includes('errore gemini 503')
        || message.includes('errore gemini 504');
}

async function fetchGeminiJsonPayloadWithRetry(prompt, mode = 'generic', maxRetries = 2) {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
            return await fetchGeminiJsonPayload(prompt, mode);
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries || !shouldRetryGeminiClientError(error)) {
                throw error;
            }

            await delayMs(900 * (attempt + 1));
        }
    }

    throw lastError || new Error('Richiesta Gemini non completata.');
}

function buildAiRecipeDiagnosticText(metadata = {}) {
    const guaranteeInfo = metadata.guaranteeInfo || null;
    const guaranteeSuffix = guaranteeInfo
        ? ` Ricette garantite oggi: ${guaranteeInfo.used}/${guaranteeInfo.limit}.`
        : '';

    if (metadata.source === 'guaranteed-fallback') {
        return `Ricetta garantita del giorno generata con il motore locale.${guaranteeSuffix}`;
    }

    if (metadata.source === 'gemini') {
        return `Ricetta generata da Gemini.${guaranteeSuffix}`;
    }

    if (metadata.source === 'gemini-cache') {
        return `Ricetta recuperata dalla cache Gemini.${guaranteeSuffix}`;
    }

    if (metadata.sourceReason) {
        return `Ricetta fallback locale. Motivo fallback: ${metadata.sourceReason}${guaranteeSuffix}`;
    }

    return `Ricetta fallback locale.${guaranteeSuffix}`;
}

function buildAiSourceBannerHtml(metadata = {}) {
    const source = String(metadata?.source || 'fallback').trim().toLowerCase();
    const reason = String(metadata?.sourceReason || metadata?.reason || '').trim();
    const descriptionOverride = String(metadata?.description || '').trim();
    const retryCountdownHtml = buildAIRetryCountdownHtml(reason, 'ai-source-banner-retry');
    let className = 'ai-source-banner-fallback';
    let badge = 'Fallback locale';
    let title = 'Risposta non generata live da Gemini';
    let description = descriptionOverride || 'Il contenuto mostrato usa il motore locale di backup per mantenere l app disponibile anche quando Gemini o la function non rispondono.';

    if (source === 'gemini') {
        className = 'ai-source-banner-live';
        badge = 'Gemini live';
        title = 'Risposta generata in tempo reale da Gemini';
        description = descriptionOverride || 'La chiamata live a Gemini e andata a buon fine e questo contenuto arriva dal modello remoto.';
    } else if (source === 'gemini-cache') {
        className = 'ai-source-banner-example';
        badge = 'Gemini cache';
        title = 'Risposta Gemini recuperata dalla cache';
        description = descriptionOverride || 'Gemini non era disponibile in questo momento, quindi l app sta mostrando una risposta valida generata in precedenza da Gemini.';
    } else if (source === 'guaranteed-fallback') {
        className = 'ai-source-banner-fallback';
        badge = 'Fallback garantito';
        title = 'Risposta servita dal motore locale garantito';
        description = descriptionOverride || 'Per garantire continuita operativa l app ha usato il motore locale invece della risposta live di Gemini.';
    } else if (source === 'example') {
        className = 'ai-source-banner-example';
        badge = 'Schema statico';
        title = 'Stai vedendo un esempio precaricato';
        description = descriptionOverride || 'Questo contenuto non arriva da Gemini: e uno schema statico usato come riferimento o demo.';
    }

    return `
        <div class="ai-source-banner ${escapeHtml(className)}" role="status" aria-live="polite">
            <div class="ai-source-banner-top">
                <span class="ai-source-banner-badge">${escapeHtml(badge)}</span>
                <strong>${escapeHtml(title)}</strong>
            </div>
            <p class="ai-source-banner-copy">${escapeHtml(description)}</p>
            ${reason ? `<p class="ai-source-banner-detail"><strong>Dettaglio tecnico:</strong> ${escapeHtml(reason)}</p>` : ''}
            ${retryCountdownHtml}
        </div>
    `;
}

function normalizeAIRecipeRequestedMode(value) {
    const normalized = String(value || '').trim().toLowerCase();

    if (normalized.includes('salvafrigo')) return 'salvafrigo';
    if (normalized.includes('chef')) return 'chef';
    if (normalized.includes('media')) return 'media';
    return 'base';
}

function getAIRecipeModeSlot(recipe, requestedMode) {
    const requestedSlot = AI_RECIPE_MODE_SLOTS.find((slot) => slot.key === normalizeAIRecipeRequestedMode(requestedMode));
    const recipeSignals = [
        String(recipe?.mode_key || recipe?.modeKey || ''),
        String(recipe?.mode_label || recipe?.modeLabel || ''),
        String(recipe?.difficolta || ''),
        String(recipe?.style || '')
    ].join(' ').toLowerCase();

    return requestedSlot
        || AI_RECIPE_MODE_SLOTS.find((slot) => recipeSignals.includes(slot.key) || recipeSignals.includes(slot.label.toLowerCase()) || recipeSignals.includes(slot.difficulty.toLowerCase()))
        || AI_RECIPE_MODE_SLOTS[0];
}

const AI_NUTRITION_METHODOLOGY = {
    summary: [
        'I valori nutrizionali mostrati sono medie di riferimento indicative e non assolute: stagione, acqua, crescita, conservazione, lavorazione e cottura possono cambiare il profilo reale dell alimento.',
        'Per prodotti trasformati e ricette i dati si riferiscono a una preparazione specifica, campionata e studiata secondo protocolli standardizzati.',
        'Quando possibile i dati sono riferiti a 100 g di parte edibile; per alcune preparazioni conta anche la porzione e la variazione di peso dopo cottura.',
        'In queste schede i valori mancanti possono essere completati da riferimenti nutrizionali compatibili, senza sovrascrivere valori gia presenti e plausibili.'
    ],
    energyFactors: [
        ['Proteine', '4 kcal/g'],
        ['Lipidi', '9 kcal/g'],
        ['Carboidrati disponibili', '3,75 kcal/g'],
        ['Amido', '4,13 kcal/g'],
        ['Fibra', '2 kcal/g'],
        ['Alcol etilico', '7 kcal/g'],
        ['Conversione energia', '1 kcal = 4,184 kJ']
    ],
    proteinFactors: [
        ['Latte e derivati', '6,38'],
        ['Farina di frumento e soia', '5,70'],
        ['Frumento, orzo, avena', '5,83'],
        ['Segale, farine integrali, riso', '5,95'],
        ['Mandorle', '5,18'],
        ['Noci e nocciole', '5,30'],
        ['Arachidi', '5,46'],
        ['Gelatina', '5,55'],
        ['Tutti gli altri alimenti', '6,25']
    ],
    carbohydrateFactors: [
        ['Disaccaridi in monosaccaridi', '1,05'],
        ['Polisaccaridi in monosaccaridi', '1,10']
    ],
    vitaminConversions: [
        ['Vitamina E', 'alfa-tocoferolo x 1,0; beta x 0,1; gamma x 0,4'],
        ['Vitamina A', '1 retinolo equivalente = 1 ug retinolo = 6 ug beta-carotene = 3,33 U.I.']
    ],
    aminoPattern: [
        ['Istidina', '1,5 g/100 g proteine'],
        ['Isoleucina', '3,0 g/100 g proteine'],
        ['Leucina', '5,9 g/100 g proteine'],
        ['Lisina', '4,5 g/100 g proteine'],
        ['Metionina + cistina', '2,2 g/100 g proteine'],
        ['Fenilalanina + tirosina', '3,8 g/100 g proteine'],
        ['Treonina', '2,3 g/100 g proteine'],
        ['Triptofano', '0,6 g/100 g proteine'],
        ['Valina', '3,9 g/100 g proteine']
    ],
    yieldExamples: [
        ['Pasta di semola secca, bollitura', 'Y.F. 3,0'],
        ['Riso basmati, bollitura', 'Y.F. 3,0'],
        ['Quinoa, bollitura', 'Y.F. 3,1'],
        ['Ceci secchi, bollitura', 'Y.F. 2,9'],
        ['Lenticchie secche, bollitura', 'Y.F. 2,5'],
        ['Pollo petto, bollitura', 'Y.F. 0,9'],
        ['Spigola al forno', 'Y.F. 0,8'],
        ['Zucchine a fette in padella', 'Y.F. 0,8']
    ]
};

function renderAINutritionMethodologyTable(rows) {
    return `
        <table class="ai-methodology-table">
            <tbody>
                ${rows.map(([label, value]) => `
                    <tr>
                        <td>${escapeHtml(label)}</td>
                        <td>${escapeHtml(value)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderAINutritionMethodology() {
    return `
        <details class="ai-nutrition-methodology">
            <summary>Metodologia e fattori di calcolo</summary>
            <div class="ai-nutrition-methodology-content">
                <ul class="ai-nutrition-methodology-list">
                    ${AI_NUTRITION_METHODOLOGY.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
                <div class="ai-methodology-grid">
                    <section>
                        <h6>Tabella A: energia</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.energyFactors)}
                    </section>
                    <section>
                        <h6>Azoto totale in proteine</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.proteinFactors)}
                    </section>
                    <section>
                        <h6>Carboidrati come monosaccaridi</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.carbohydrateFactors)}
                    </section>
                    <section>
                        <h6>Conversioni vitaminiche</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.vitaminConversions)}
                    </section>
                    <section>
                        <h6>Pattern aminoacidico WHO/FAO/UNU</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.aminoPattern)}
                    </section>
                    <section>
                        <h6>Tabella C: esempi di yield factor</h6>
                        ${renderAINutritionMethodologyTable(AI_NUTRITION_METHODOLOGY.yieldExamples)}
                    </section>
                </div>
            </div>
        </details>
    `;
}

function normalizeAIRecipeMealType(value) {
    const normalized = String(value || '').trim().toLowerCase();

    if (['colazione', 'pranzo', 'cena', 'spuntino'].includes(normalized)) {
        return normalized;
    }

    return 'pranzo';
}

function getAIRecipeMealTypeMeta(value) {
    const mealType = normalizeAIRecipeMealType(value);

    if (mealType === 'colazione') {
        return {
            label: 'Colazione',
            tone: 'mattutina, pratica e pulita',
            className: 'ai-recipe-mealtype-breakfast'
        };
    }

    if (mealType === 'spuntino') {
        return {
            label: 'Spuntino',
            tone: 'breve, porzionabile e non invadente',
            className: 'ai-recipe-mealtype-snack'
        };
    }

    if (mealType === 'cena') {
        return {
            label: 'Cena',
            tone: 'serale, ordinata e piu leggera nella struttura',
            className: 'ai-recipe-mealtype-dinner'
        };
    }

    return {
        label: 'Pranzo',
        tone: 'centrale, saziante e da piatto portante',
        className: 'ai-recipe-mealtype-lunch'
    };
}

function getCompactAIRecipeTitle(recipe, mealType, modeLabel = '') {
    const rawTitle = String(recipe?.nome_ricetta || recipe?.title || '').trim();
    if (!rawTitle) {
        return 'Ricetta su misura';
    }

    const normalizedMealType = normalizeAIRecipeMealType(mealType);
    const normalizedTitle = rawTitle.toLowerCase();
    const removablePrefixes = [
        `${normalizedMealType} base con `,
        `${normalizedMealType} media con `,
        `${normalizedMealType} chef con `,
        `${normalizedMealType} con `,
        'chef breakfast con ',
        'salvafrigo breakfast con ',
        'salvafrigo snack con ',
        'salvafrigo cena con ',
        'salvafrigo pranzo con ',
        'snack chef con ',
        'pranzo chef con ',
        'cena chef con ',
        'colazione media con ',
        'spuntino media consistenza con ',
        'pranzo media con ',
        'cena media con ',
        'colazione base con ',
        'spuntino base con ',
        'pranzo base con ',
        'cena base con ',
        'versione media con ',
        'chef mode con ',
        'salvafrigo di ',
        'pasta o padellata base con '
    ];

    const matchedPrefix = removablePrefixes.find((prefix) => normalizedTitle.startsWith(prefix));
    if (!matchedPrefix) {
        return rawTitle;
    }

    const compactTail = rawTitle.slice(matchedPrefix.length).trim();
    if (!compactTail) {
        return rawTitle;
    }

    const normalizedMode = String(modeLabel || '').trim().toLowerCase();
    const intro = normalizedMode.includes('chef')
        ? 'Interpretazione'
        : normalizedMode.includes('salvafrigo')
            ? 'Da'
            : 'Con';

    if (intro === 'Da') {
        return `Da ${compactTail}`;
    }

    return `${intro} ${compactTail}`;
}

function decorateAIRecipeModes(recipes) {
    return AI_RECIPE_MODE_SLOTS.map((slot, index) => {
        const recipe = Array.isArray(recipes) ? recipes[index] : null;
        if (!recipe) return null;

        return {
            ...recipe,
            mode_key: recipe.mode_key || recipe.modeKey || slot.key,
            mode_label: recipe.mode_label || recipe.modeLabel || slot.label,
            difficolta: recipe.difficolta || slot.difficulty,
            style: recipe.style || slot.label
        };
    }).filter(Boolean);
}

function getFallbackRecipePrepTime(mealType, modeKey) {
    const presets = {
        colazione: { base: 8, media: 12, chef: 18, salvafrigo: 6 },
        spuntino: { base: 6, media: 10, chef: 14, salvafrigo: 4 },
        cena: { base: 18, media: 26, chef: 34, salvafrigo: 10 },
        pranzo: { base: 20, media: 30, chef: 35, salvafrigo: 12 }
    };

    return presets[mealType]?.[modeKey] || 20;
}

function buildFallbackIngredientTable(items, mealType, modeKey) {
    const quantityPresets = {
        colazione: {
            base: [170, 40, 120, 150, 30],
            media: [160, 45, 120, 80, 35],
            chef: [150, 60, 100, 25, 15],
            salvafrigo: [140, 35, 100, 120]
        },
        spuntino: {
            base: [130, 125, 15],
            media: [120, 80, 20, 15],
            chef: [100, 40, 12],
            salvafrigo: [100, 25, 15]
        },
        cena: {
            base: [180, 200, 12, 120, 60],
            media: [180, 220, 12, 8, 80],
            chef: [180, 160, 20, 15, 80],
            salvafrigo: [170, 180, 10, 100]
        },
        pranzo: {
            base: [140, 80, 150, 12, 8, 10],
            media: [160, 90, 140, 20, 12, 8],
            chef: [150, 70, 20, 8, 12],
            salvafrigo: [140, 120, 150, 10, 50]
        }
    };

    const preset = quantityPresets[mealType]?.[modeKey] || [120, 80, 150, 12, 10];

    return (Array.isArray(items) ? items : []).map((name, index) => ({
        n: String(name || '').trim(),
        qty: preset[index] || preset[preset.length - 1] || 60,
        k: 0,
        p: 0,
        c: 0,
        g: 0
    })).filter((row) => row.n);
}

function getFallbackRecipeTechnique(mealType, modeKey, goal) {
    const modeLabel = modeKey === 'chef'
        ? 'tecnica piu precisa'
        : modeKey === 'media'
            ? 'cottura controllata ma domestica'
            : modeKey === 'salvafrigo'
                ? 'assemblaggio o rigenerazione rapida'
                : 'tecnica semplice e leggibile';

    if (mealType === 'cena') {
        return `${modeLabel} con gestione delicata delle cotture per favorire digeribilita serale e controllo dei grassi, in coerenza con l'obiettivo ${goal || 'mantenere'}.`;
    }

    if (mealType === 'colazione') {
        return `${modeLabel} pensata per preservare leggibilita, praticita mattutina e una quota proteica facile da distribuire.`;
    }

    if (mealType === 'spuntino') {
        return `${modeLabel} breve e porzionabile, cosi lo snack resta compatto, credibile e coerente con il profilo.`;
    }

    return `${modeLabel} con struttura da piatto centrale, utile a mantenere sazieta e gestione energetica nella parte attiva della giornata.`;
}

function getFallbackChefNote(mealType, modeKey, goal) {
    if (modeKey === 'chef') {
        return mealType === 'cena'
            ? `Ho scelto una finitura piu precisa e una cottura controllata per aumentare l'appetibilita senza appesantire la digestione serale in fase di ${goal || 'mantenimento'}.`
            : `Ho scelto una tecnica piu precisa e una finitura netta per rendere il piatto piu appagante e coerente con l'obiettivo ${goal || 'mantenimento'}.`;
    }

    if (modeKey === 'salvafrigo') {
        return 'Ho tenuto una tecnica breve e una sola base dominante per ridurre spreco, attrito decisionale e passaggi inutili.';
    }

    return mealType === 'cena'
        ? 'Ho privilegiato una cottura pulita e poco aggressiva per tenere il pasto serale piu digeribile e ordinato.'
        : 'Ho privilegiato una tecnica semplice ma controllata per tenere appetibilita, ripetibilita e coerenza nutrizionale nello stesso piatto.';
}

function getFallbackBioavailabilityTip(mealType, modeKey) {
    if (mealType === 'colazione') {
        return 'La presenza di una quota proteica insieme ai carboidrati aiuta a rendere la colazione piu stabile sul piano della sazieta e della risposta energetica.';
    }

    if (mealType === 'spuntino') {
        return 'Ho mantenuto una porzione compatta e con abbinamenti semplici per favorire tollerabilita digestiva e continuita tra un pasto e l altro.';
    }

    if (modeKey === 'chef') {
        return 'Una componente acida o ricca di vitamina C puo aiutare l assorbimento del ferro vegetale e rendere il piatto piu leggibile anche sul piano sensoriale.';
    }

    return mealType === 'cena'
        ? 'Ho evitato combinazioni troppo dense e tenuto una quota di grassi misurata per favorire digestione e tollerabilita serale.'
        : 'L abbinamento tra verdure, fonte proteica e una quota di grassi buoni aiuta disponibilita dei micronutrienti e maggiore sazieta del pasto.';
}

function buildFallbackRecipeCard(config) {
    return {
        title: config.title,
        nome_ricetta: config.title,
        style: config.style,
        mode_key: config.modeKey,
        summary: config.summary,
        whyItFits: config.whyItFits,
        ingredients: config.ingredients,
        ingredienti_tabella: buildFallbackIngredientTable(config.ingredients, config.mealType, config.modeKey),
        procedimento: config.steps,
        steps: config.steps,
        tempo_prep_min: getFallbackRecipePrepTime(config.mealType, config.modeKey),
        tecnica_cottura: getFallbackRecipeTechnique(config.mealType, config.modeKey, config.goalTag),
        chef_note: getFallbackChefNote(config.mealType, config.modeKey, config.goalTag),
        bioavailability_tip: getFallbackBioavailabilityTip(config.mealType, config.modeKey),
        wasteTip: config.wasteTip,
        anti_spreco: config.wasteTip,
        goalTag: config.goalTag || 'mantenere'
    };
}

function getAIFallbackRecipes(ingredients, people, profile, mealType = 'pranzo') {
    const safeIngredients = ingredients.length > 0 ? ingredients : ['verdure miste'];
    const lead = safeIngredients.slice(0, 3);
    const leadText = lead.join(', ');
    const goal = profile.goal || 'mantenere';
    const diet = profile.diet || 'equilibrato';
    const jobType = profile.jobType || 'moderato';
    const normalizedMealType = ['colazione', 'pranzo', 'cena', 'spuntino'].includes(String(mealType || '').toLowerCase())
        ? String(mealType).toLowerCase()
        : 'pranzo';
    const lunchContext = profile.lunchContextPreference === 'free-day' ? 'free-day' : 'workday';
    const lunchContextNote = getLunchContextRecipeNote(lunchContext);
    const clinicalContext = getClinicalNutritionContext(profile);
    const clinicalRecipeTail = clinicalContext.applicable
        ? ` ${clinicalContext.recipeTail}`
        : '';

    const goalHintMap = {
        dimagrire: 'con porzioni sazianti e una struttura leggera',
        mantenere: 'con un equilibrio semplice tra energia e sazieta',
        massa: 'con una spinta proteica e carboidrati utili al recupero'
    };

    const dietHint = diet && diet !== 'regime alimentare non specificato'
        ? `Compatibile con un approccio ${diet}.`
        : 'Pensata per adattarsi facilmente a una dispensa quotidiana.';

    const jobHintMap = {
        sedentario: 'Richiede poco tempo e sporca il minimo indispensabile.',
        moderato: 'Sta bene in una routine settimanale normale.',
        attivo: 'Funziona bene anche come pasto post giornata intensa.'
    };

    const mealTypeConfig = normalizedMealType === 'colazione'
        ? {
            baseTitle: `Colazione base con ${lead[0] || 'yogurt'} e ${lead[1] || 'cereali'}`,
            mediumTitle: `Colazione media con ${lead[0] || 'avena'} e ${lead[1] || 'frutta'}`,
            chefTitle: `Chef breakfast con ${lead[0] || 'frutta'}`,
            salvageTitle: `Salvafrigo breakfast con ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
            baseSummary: `Una colazione semplice per ${people} ${people === 1 ? 'persona' : 'persone'} che resta davvero mattutina, pratica e leggibile.`,
            mediumSummary: 'Una colazione un po piu costruita della base, ma ancora rapida e coerente con il formato breakfast.',
            chefSummary: 'Una colazione piu curata e precisa, con due texture chiare ma senza sembrare un pranzo o un dessert pesante.',
            salvageSummary: 'La modalita piu rapida e anti-spreco per costruire una colazione utile con quello che c e gia aperto.',
            baseWhy: `Tiene il tono della colazione: pratica, controllata e coerente con l'obiettivo ${goal}. ${dietHint}`,
            mediumWhy: `Aggiunge un po piu di struttura senza perdere il formato da colazione. ${lunchContextNote}${clinicalRecipeTail}`,
            chefWhy: `Alza il livello della colazione senza farla sembrare un pranzo nascosto. ${lunchContextNote}${clinicalRecipeTail}`,
            salvageWhy: `Riduce spreco e attrito decisionale nella mattina, restando coerente col profilo. ${lunchContextNote}${clinicalRecipeTail}`,
            baseIngredients: [...lead, 'yogurt o latte', 'cereale semplice'],
            mediumIngredients: [...safeIngredients.slice(0, 3), 'uova o yogurt', 'avena o farina'],
            chefIngredients: [...safeIngredients.slice(0, 3), 'base cremosa', 'elemento croccante'],
            salvageIngredients: [...safeIngredients.slice(0, 3), 'base rapida'],
            baseSteps: [
                'Prepara una base rapida e molto leggibile.',
                'Bilancia carboidrati e quota proteica senza appesantire il piatto.',
                'Servi subito con una finitura minima.'
            ],
            mediumSteps: [
                'Costruisci una base piu ricca ma semplice, come porridge, pancake o coppa.',
                'Mantieni porzione e densita sotto controllo.',
                'Chiudi con topping essenziale e coerente col mattino.'
            ],
            chefSteps: [
                'Costruisci due texture nette.',
                'Mantieni dolcezza e grassi sotto controllo.',
                'Chiudi con una finitura pulita e chiaramente da breakfast.'
            ],
            salvageSteps: [
                'Recupera gli ingredienti gia aperti.',
                'Combinali in modo lineare e rapido.',
                'Mantieni il risultato molto leggibile e mattutino.'
            ],
            wasteTip: 'Frutta matura, yogurt aperto o cereali gia iniziati si recuperano molto bene in questo formato.'
        }
        : normalizedMealType === 'spuntino'
            ? {
                baseTitle: `Spuntino base con ${lead[0] || 'frutta'} e ${lead[1] || 'supporto proteico'}`,
                mediumTitle: `Spuntino media consistenza con ${lead[0] || 'frutta'} e ${lead[1] || 'cremosita'}`,
                chefTitle: `Snack chef con ${lead[0] || 'contrasto'}`,
                salvageTitle: `Salvafrigo snack con ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                baseSummary: 'Spuntino semplice, rapido e controllato, pensato per stare davvero tra due pasti.',
                mediumSummary: 'Uno spuntino un po piu costruito, ma ancora molto chiaro, porzionabile e contenuto.',
                chefSummary: 'Piccolo snack piu curato, ma ancora credibile come spuntino e non come dessert completo.',
                salvageSummary: 'Snack rapidissimo e utile, pensato per non sprecare e non complicare la giornata.',
                baseWhy: `Controlla fame e aderenza senza trasformarsi in un pranzo nascosto. ${goalHintMap[goal] || goalHintMap.mantenere}. ${clinicalRecipeTail}`,
                mediumWhy: `Utile quando serve qualcosa di piu stabile di un semplice frutto, ma senza sfondare la logica dello snack. ${clinicalRecipeTail}`,
                chefWhy: `Aggiunge precisione e piacere senza perdere il controllo del formato e della funzione dello spuntino. ${clinicalRecipeTail}`,
                salvageWhy: `Riduce spreco e decisioni superflue, restando coerente con il ruolo di uno spuntino. ${clinicalRecipeTail}`,
                baseIngredients: [...lead.slice(0, 2), 'yogurt o frutta secca'],
                mediumIngredients: [...safeIngredients.slice(0, 2), 'base cremosa', 'elemento saziante'],
                chefIngredients: [...safeIngredients.slice(0, 2), 'finitura tecnica'],
                salvageIngredients: [...safeIngredients.slice(0, 2), 'elemento rapido'],
                baseSteps: [
                    'Prepara una porzione breve.',
                    'Evita eccessi di volume e condimenti.',
                    'Servi o porta con te facilmente.'
                ],
                mediumSteps: [
                    'Lavora su una consistenza piacevole.',
                    'Non appesantire con troppe componenti.',
                    'Chiudi in formato piccolo e leggibile.'
                ],
                chefSteps: [
                    'Mantieni il formato piccolo.',
                    'Evita accumuli calorici inutili.',
                    'Rendi il gesto tecnico breve ma visibile.'
                ],
                salvageSteps: [
                    'Usa solo il necessario.',
                    'Non costruire un piatto completo.',
                    'Chiudi in forma molto pratica.'
                ],
                wasteTip: 'Perfetto per finire piccole quantita senza farle diventare un pasto intero.'
            }
            : normalizedMealType === 'cena'
                ? {
                    baseTitle: `Cena base con ${lead[0] || 'proteina'} e ${lead[1] || 'verdure'}`,
                    mediumTitle: `Cena media con ${lead[0] || 'ingrediente principale'} e contorno strutturato`,
                    chefTitle: `Cena chef con ${lead[0] || 'proteina guida'}`,
                    salvageTitle: `Salvafrigo cena con ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                    baseSummary: `Cena base per ${people} ${people === 1 ? 'persona' : 'persone'}, con struttura serale chiara: proteina, verdure e chiusura leggera.`,
                    mediumSummary: 'Cena intermedia con secondo e contorno ben distinti, adatta a una routine serale piu ordinata.',
                    chefSummary: 'Cena piu precisa e tecnica, pensata come secondo elegante con vegetali e finitura controllata.',
                    salvageSummary: 'Cena essenziale e anti-spreco, con struttura chiara e poco attrito decisionale.',
                    baseWhy: `Mantiene la cena leggibile e anti-fame senza trasformarla in un pranzo travestito. ${goalHintMap[goal] || goalHintMap.mantenere}. ${clinicalRecipeTail}`,
                    mediumWhy: `Distingue meglio la cena dal pranzo: meno piatto unico centrale, piu struttura proteina piu vegetali. ${clinicalRecipeTail}`,
                    chefWhy: `Alza il livello senza spostare il formato verso un primo importante o un piatto da brunch. ${clinicalRecipeTail}`,
                    salvageWhy: `Aiuta a chiudere la giornata con una cena utile, leggibile e coerente col profilo. ${clinicalRecipeTail}`,
                    baseIngredients: [...lead, 'olio EVO', 'verdura di supporto'],
                    mediumIngredients: [...safeIngredients.slice(0, 4), 'olio EVO', 'erbe aromatiche'],
                    chefIngredients: [...safeIngredients.slice(0, 3), 'finitura tecnica', 'contrasto vegetale'],
                    salvageIngredients: [...safeIngredients.slice(0, 3), 'olio EVO', 'verdura rapida'],
                    baseSteps: [
                        'Costruisci il piatto attorno a una proteina centrale.',
                        'Tieni le verdure come apertura o accompagnamento ben separato.',
                        'Usa una quota amidacea piccola solo se migliora equilibrio e sazieta.'
                    ],
                    mediumSteps: [
                        'Cuoci la proteina come centro del piatto.',
                        'Costruisci un contorno riconoscibile e non accessorio.',
                        'Mantieni l insieme serale, pulito e non eccessivo.'
                    ],
                    chefSteps: [
                        'Tieni la proteina come asse dominante.',
                        'Usa il contrasto vegetale per leggerezza e profondita, non come riempitivo.',
                        'Mantieni il piatto raffinato ma ancora chiaramente serale.'
                    ],
                    salvageSteps: [
                        'Usa un solo centro proteico.',
                        'Abbina una verdura che alleggerisca il piatto.',
                        'Evita di accumulare pane, pasta e condimenti superflui tutti insieme.'
                    ],
                    wasteTip: 'Funziona bene con proteine gia cotte, verdure avanzate e piccole basi da finire senza appesantire la cena.'
                }
                : {
                    baseTitle: `Pranzo base con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'base portante'}`,
                    mediumTitle: `Pranzo media con ${lead[0] || 'ingrediente principale'} e accompagnamento`,
                    chefTitle: `Pranzo chef con ${lead[0] || 'ingrediente guida'}`,
                    salvageTitle: `Salvafrigo pranzo con ${lead[0] || 'avanzi utili'} e ${lead[1] || 'dispensa'}`,
                    baseSummary: `Pranzo centrale per ${people} ${people === 1 ? 'persona' : 'persone'}, pensato come primo completo o piatto unico ordinato.`,
                    mediumSummary: 'Una ricetta pranzo piu costruita della base, con elemento principale e accompagnamento ma ancora pienamente domestica.',
                    chefSummary: 'Una proposta pranzo piu tecnica e precisa, pensata come piatto centrale raffinato e non come cena di sola proteina.',
                    salvageSummary: 'La versione pranzo piu semplice e diretta: poca tecnica, pochi passaggi, massima utilita e buona sazieta.',
                    baseWhy: `Ideata per l'obiettivo ${goal} ${goalHintMap[goal] || goalHintMap.mantenere}. ${dietHint} ${jobHintMap[jobType] || jobHintMap.moderato} ${lunchContextNote}${clinicalRecipeTail}`,
                    mediumWhy: `Rende il pranzo piu articolato senza spostarlo sulla logica del secondo serale. ${clinicalRecipeTail}`,
                    chefWhy: `Alza davvero il livello del pranzo mantenendo un anima da piatto portante e strutturato. ${clinicalRecipeTail}`,
                    salvageWhy: `Resta un pranzo vero, non solo un assemblaggio casuale: usa quello che c e ma con un centro chiaro. ${clinicalRecipeTail}`,
                    baseIngredients: [...lead, 'olio EVO', 'base amidacea o legumi', 'erbe aromatiche'],
                    mediumIngredients: [...safeIngredients.slice(0, 4), 'pangrattato o semi', 'olio EVO', 'spezie a piacere'],
                    chefIngredients: [...safeIngredients.slice(0, 3), 'elemento croccante', 'finitura aromatica'],
                    salvageIngredients: [...safeIngredients.slice(0, 3), 'condimento essenziale', 'pane, riso o legumi se servono'],
                    baseSteps: [
                        'Tieni una base portante ben evidente.',
                        'Fai convergere il resto del piatto su quella base senza frammentarlo.',
                        'Chiudi in modo pratico e saziante, adatto alla fascia centrale della giornata.'
                    ],
                    mediumSteps: [
                        'Prepara un asse centrale piu curato rispetto alla versione base.',
                        'Abbinalo a un supporto leggibile, ma non farlo diventare una cena a due tempi.',
                        'Tieni il pranzo coeso, pratico e trasportabile se serve.'
                    ],
                    chefSteps: [
                        'Gestisci un piatto principale con controllo tecnico vero.',
                        'Usa una seconda componente come supporto strutturale e non come semplice contorno.',
                        'Impiatta in modo rigoroso ma ancora coerente con un pranzo reale.'
                    ],
                    salvageSteps: [
                        'Metti insieme una sola base portante con gli ingredienti da finire.',
                        'Evita di disperdere il piatto in troppi elementi slegati.',
                        'Servi subito come pranzo rapido ma con logica nutrizionale leggibile.'
                    ],
                    wasteTip: 'Ottimo per riusare sughi leggeri, cereali cotti o verdure avanzate dentro un piatto unico.'
                };

    return decorateAIRecipeModes([
        buildFallbackRecipeCard({
            title: mealTypeConfig.baseTitle,
            style: 'Cucina base',
            modeKey: 'base',
            mealType: normalizedMealType,
            summary: mealTypeConfig.baseSummary,
            whyItFits: mealTypeConfig.baseWhy,
            ingredients: mealTypeConfig.baseIngredients,
            steps: mealTypeConfig.baseSteps,
            wasteTip: mealTypeConfig.wasteTip,
            goalTag: goal || 'mantenere'
        }),
        buildFallbackRecipeCard({
            title: mealTypeConfig.mediumTitle,
            style: 'Cucina media',
            modeKey: 'media',
            mealType: normalizedMealType,
            summary: mealTypeConfig.mediumSummary,
            whyItFits: mealTypeConfig.mediumWhy,
            ingredients: mealTypeConfig.mediumIngredients,
            steps: mealTypeConfig.mediumSteps,
            wasteTip: mealTypeConfig.wasteTip,
            goalTag: goal || 'mantenere'
        }),
        buildFallbackRecipeCard({
            title: mealTypeConfig.chefTitle,
            style: 'Chef mode',
            modeKey: 'chef',
            mealType: normalizedMealType,
            summary: mealTypeConfig.chefSummary,
            whyItFits: mealTypeConfig.chefWhy,
            ingredients: mealTypeConfig.chefIngredients,
            steps: mealTypeConfig.chefSteps,
            wasteTip: mealTypeConfig.wasteTip,
            goalTag: goal || 'mantenere'
        }),
        buildFallbackRecipeCard({
            title: mealTypeConfig.salvageTitle,
            style: 'Salvafrigo',
            modeKey: 'salvafrigo',
            mealType: normalizedMealType,
            summary: mealTypeConfig.salvageSummary,
            whyItFits: mealTypeConfig.salvageWhy,
            ingredients: mealTypeConfig.salvageIngredients,
            steps: mealTypeConfig.salvageSteps,
            wasteTip: mealTypeConfig.wasteTip,
            goalTag: goal || 'mantenere'
        })
    ]);
}

function renderAIRecipeResults(recipes, metadata = {}) {
    const resultBox = document.getElementById('ai-recipe-result');
    if (!resultBox) return;

    const safeRecipes = Array.isArray(recipes) ? recipes.filter(Boolean) : [];
    const requestedMode = normalizeAIRecipeRequestedMode(metadata.requestedMode || metadata.difficulty);
    const isSingleRecipe = safeRecipes.length === 1;
    const diagnosticText = buildAiRecipeDiagnosticText(metadata);

    aiGeneratedRecipes = isSingleRecipe
        ? safeRecipes.map((recipe) => {
            const slot = getAIRecipeModeSlot(recipe, requestedMode);

            return {
                ...recipe,
                mode_key: recipe.mode_key || recipe.modeKey || slot.key,
                mode_label: recipe.mode_label || recipe.modeLabel || slot.label,
                difficolta: recipe.difficolta || slot.difficulty,
                style: recipe.style || slot.label
            };
        })
        : decorateAIRecipeModes(safeRecipes);

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        ${buildAiSourceBannerHtml({
            ...metadata,
            description: diagnosticText
        })}
        <div class="ai-recipe-grid">
            ${aiGeneratedRecipes.map((recipe, index) => `
                <article class="ai-recipe-card">
                    <div class="ai-recipe-card-top">
                        <span class="ai-recipe-index">${escapeHtml(recipe.tipo_pasto || metadata.mealType || `Ricetta ${index + 1}`)}</span>
                        <span class="ai-recipe-tag">${escapeHtml(recipe.difficolta || recipe.style || 'Ricetta')}</span>
                    </div>
                    <h5>${escapeHtml(recipe.nome_ricetta || recipe.title || `Ricetta ${index + 1}`)}</h5>
                    <p class="ai-recipe-fit"><strong>Tempo di cottura:</strong> ${escapeHtml(recipe.tempo_prep_min || 0)} min</p>
                    <div class="ai-recipe-section">
                        <strong>Ingredienti</strong>
                        <ul>
                            ${((recipe.ingredienti_tabella && recipe.ingredienti_tabella.length > 0)
                                ? recipe.ingredienti_tabella.map((item) => formatIngredientDisplay(item))
                                : (recipe.ingredients || [])).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="ai-recipe-section">
                        <strong>Procedimento</strong>
                        <ol>
                            ${(recipe.procedimento || recipe.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
                        </ol>
                    </div>
                    ${(recipe.tecnica_cottura || recipe.healthyCooking) ? `
                        <p class="ai-recipe-fit"><strong>Cottura consigliata:</strong> ${escapeHtml(recipe.tecnica_cottura || recipe.healthyCooking)}</p>
                    ` : ''}
                    <p class="ai-recipe-waste"><strong>Tip anti-spreco:</strong> ${escapeHtml(recipe.anti_spreco || recipe.wasteTip || '')}</p>
                    ${renderAIRecipeNutritionDetails(recipe)}
                    ${recipe.bioavailability_tip ? `
                        <div class="ai-recipe-insight ai-recipe-insight-bio">
                            <strong>Bioavailability tip</strong>
                            <p>${escapeHtml(recipe.bioavailability_tip)}</p>
                        </div>
                    ` : ''}
                </article>
            `).join('')}
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility('ai-recipe-result');
}

function renderAIRecipeLoading(ingredients, people) {
    const resultBox = document.getElementById('ai-recipe-result');
    if (!resultBox) return;

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-mode-loading">
            <h4 class="ai-mode-title">Sto costruendo la ricetta per te...</h4>
            <p class="ai-mode-subtitle">Ingredienti analizzati: <strong>${escapeHtml(ingredients.join(', ') || 'dispensa di casa')}</strong> per <strong>${people}</strong> ${people === 1 ? 'persona' : 'persone'}.</p>
        </div>
    `;
    updateAiModeResultsVisibility('ai-recipe-result');
}

function renderAIRecipeError(message) {
    const resultBox = document.getElementById('ai-recipe-result');
    if (!resultBox) return;

    aiGeneratedRecipes = [];

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-mode-error">
            <h4 class="ai-mode-title">AI Mode non disponibile</h4>
            <p class="ai-mode-subtitle">${escapeHtml(removeRetryAfterHintFromMessage(message) || message)}</p>
            ${buildAIRetryCountdownHtml(message)}
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility('ai-recipe-result');
}

async function generaRicettaAI() {
    const ingredienti = aiSelectedIngredients.length > 0
        ? [...aiSelectedIngredients]
        : (document.getElementById('discover-ingredients').value || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const persone = parseInt(document.getElementById('discover-people').value, 10) || 1;
    const mealType = document.getElementById('chef-recipe-meal-type')?.value || '';
    const difficulty = document.getElementById('chef-recipe-difficulty')?.value || '';
    const profilePayload = getAIProfilePayload();

    if (persone < 1) {
        alert('Inserisci un numero di persone valido!');
        return;
    }

    if (ingredienti.length === 0) {
        alert('Aggiungi almeno un ingrediente per attivare AI Mode.');
        return;
    }

    if (!mealType) {
        alert('Seleziona prima il tipo di pasto.');
        return;
    }

    if (!difficulty) {
        alert('Seleziona la difficolta dopo aver scelto il tipo di pasto.');
        return;
    }

    const recipeRequestPayload = buildGeminiRecipeRequestPayload(profilePayload, {
        tipo_pasto: mealType,
        difficolta: getGeminiRecipeDifficultyLabel(difficulty),
        modalita_ui: difficulty,
        kcal_target: Math.round(profilePayload.targetCalories || 0),
        allergie: profilePayload.allergies || 'nessuna indicata',
        ingrediente_o_base: ingredienti.join(', '),
        persone,
        richiesta_base: `Voglio un ${mealType} con ${ingredienti.join(', ')}`
    });

    renderAIRecipeLoading(ingredienti, persone);

    try {
        const geminiPayload = await generaRicettaGemini({
            mode: 'ricetta-su-misura',
            payload: recipeRequestPayload
        });

        if (!geminiPayload || typeof geminiPayload !== 'object' || !Array.isArray(geminiPayload.ingredienti) || geminiPayload.ingredienti.length === 0) {
            throw new Error('Gemini ha restituito una ricetta senza ingredienti validi.');
        }

        const normalizedRecipe = adaptGeminiRecipeToCard(geminiPayload, {
            id: 'GEM-1',
            difficulty,
            people: persone,
            profile: profilePayload
        });

        const guaranteeInfo = consumeAiDailyRecipeGuarantee(profilePayload);

        renderAIRecipeResults([normalizedRecipe], {
            source: 'gemini',
            sourceReason: '',
            guaranteeInfo,
            people: persone,
            mealType,
            requestedMode: difficulty,
            lunchContext: profilePayload.lunchContextPreference
        });
        persistGeminiCacheEntry('recipe', recipeRequestPayload, {
            recipes: [normalizedRecipe]
        }, {
            mealType,
            requestedMode: difficulty,
            people: persone
        });
    } catch (error) {
        console.error('AI Mode error:', error);
        const userFacingError = buildGeminiUserFacingErrorMessage(error);
        const cachedRecipeEntry = loadBestGeminiRecipeCacheEntry(recipeRequestPayload, mealType, difficulty);

        if (cachedRecipeEntry?.responsePayload?.recipes?.length) {
            renderAIRecipeResults(cachedRecipeEntry.responsePayload.recipes, {
                source: 'gemini-cache',
                sourceReason: userFacingError,
                people: persone,
                mealType,
                requestedMode: difficulty,
                lunchContext: profilePayload.lunchContextPreference,
                description: 'Gemini live non e disponibile in questo momento: sto mostrando una ricetta compatibile gia generata in precedenza da Gemini.'
            });
            return;
        }

        renderAIRecipeError(userFacingError || 'Gemini non disponibile. Nessuna ricetta locale verra mostrata: riprova tra poco.');
    }
}

window.generaRicettaAI = generaRicettaAI;

function getAIBreakfastSnackFallback(profile, preferences) {
    const proteinTarget = Number(profile.proteinTargetGrams || 0);
    const breakfastProtein = proteinTarget > 0 ? Math.max(20, Math.round(proteinTarget * 0.22)) : 25;
    const snackProtein = proteinTarget > 0 ? Math.max(12, Math.round(proteinTarget * 0.12)) : 15;
    const preferenceNote = preferences ? `Ho considerato questa preferenza: ${preferences}.` : 'Le proposte restano flessibili e adattabili alla tua routine reale.';
    const lunchContext = profile.lunchContextPreference === 'free-day' ? 'free-day' : 'workday';
    const snackStrategy = getLunchContextSnackStrategy(lunchContext);
    const clinicalContext = getClinicalNutritionContext(profile);

    if (clinicalContext.applicable) {
        const breakfastOptions = cloneClinicalGuidanceValue(clinicalContext.breakfastOptions || []);
        const snackOptions = cloneClinicalGuidanceValue(clinicalContext.snackOptions || []);

        return {
            breakfastOptions: breakfastOptions.map((option, index) => ({
                ...option,
                whyItFits: index === 0
                    ? `Riprende una struttura classica, semplice e sostenibile per un profilo adulto con deficit moderato. ${preferenceNote}`
                    : (index === 1
                        ? 'Versione equivalente piu fresca ma sempre ordinata sul piano calorico e sulla sazieta.'
                        : 'Utile se preferisci una colazione calda ma con densita energetica ancora controllata.'),
                macros: {
                    ...option.macros,
                    protein: index === 0 ? 11 : (index === 1 ? Math.max(10, breakfastProtein - 4) : Math.max(10, breakfastProtein - 3))
                }
            })),
            snackOptions: snackOptions.map((option, index) => ({
                ...option,
                whyItFits: index === 0
                    ? snackStrategy.morningWhy
                    : (index === 1
                        ? 'Spuntino essenziale che aiuta ad arrivare alla cena con piu controllo e meno fame impulsiva.'
                        : (lunchContext === 'free-day'
                            ? 'Alternativa utile quando vuoi uno spuntino piu leggero e voluminoso.'
                            : 'Alternativa utile quando cerchi leggerezza e idratazione senza appesantire il pomeriggio.'))
            })),
            guidance: [
                `Schema clinico-pratico attivato: circa 1600 kcal con ripartizione orientativa ${clinicalContext.macroSplit}.`,
                clinicalContext.weightNote,
                'Gli spuntini possono restare semplici, con frutta come base e verdure crude come supporto se compare fame extra.',
                'L olio EVO e preferibile a crudo e i condimenti restano misurati.',
                clinicalContext.avoidFoods
            ]
        };
    }

    return {
        breakfastOptions: [
            {
                title: 'Yogurt greco, cereali controllati e frutta',
                whyItFits: `Tiene una quota proteica solida al mattino senza appesantire. ${preferenceNote}`,
                items: ['150-170 g yogurt greco 0%', '35-45 g granola o fiocchi a basso contenuto di zuccheri', '1 porzione di frutta'],
                notes: ['Opzione pratica e veloce', 'Buona se vuoi sazieta e continuita'],
                macros: { kcal: 320, protein: breakfastProtein, carbs: 34, fat: 7 }
            },
            {
                title: 'Yogurt greco, frutta e frutta secca',
                whyItFits: 'Equilibrio semplice tra proteine, fibra e grassi buoni, utile quando vuoi una colazione ordinata e sostenibile.',
                items: ['150 g yogurt greco 0%', '1 porzione di frutta', '15-20 g frutta secca'],
                notes: ['Piacevole anche fuori casa', 'Aiuta a non concentrare tutti i carboidrati all inizio della giornata'],
                macros: { kcal: 300, protein: breakfastProtein - 2, carbs: 24, fat: 11 }
            },
            {
                title: 'Porridge proteico con avena e albume',
                whyItFits: 'Molto utile quando vuoi una colazione piu calda, saziante e con un controllo migliore della quota proteica.',
                items: ['40 g fiocchi di avena', '80 ml albume', '1 frutto o mela a pezzi', '1 cucchiaino crema 100% di frutta secca'],
                notes: ['Versione piu cremosa e saziante', 'Adatta quando hai piu fame o vuoi un ritmo piu regolare'],
                macros: { kcal: 340, protein: breakfastProtein + 2, carbs: 36, fat: 9 }
            }
        ],
        snackOptions: [
            {
                title: snackStrategy.morningTitle,
                whyItFits: snackStrategy.morningWhy,
                items: snackStrategy.morningItems,
                notes: ['Molto pratico', 'Buono anche pre o post allenamento leggero'],
                macros: { kcal: lunchContext === 'free-day' ? 145 : 170, protein: snackProtein, carbs: lunchContext === 'free-day' ? 10 : 18, fat: snackStrategy.morningFat }
            },
            {
                title: 'Frutta secca e frutto fresco',
                whyItFits: lunchContext === 'free-day'
                    ? 'Spuntino semplice e molto misurato, utile quando il pranzo della giornata e stato piu disteso.'
                    : 'Spuntino semplice e gestibile se il pasto successivo non e troppo lontano.',
                items: ['1 porzione di frutta', '15-20 g frutta secca'],
                notes: ['Piacevole e rapido', 'Meno proteico, ma utile in giornate piu leggere'],
                macros: { kcal: lunchContext === 'free-day' ? 160 : 180, protein: 5, carbs: 18, fat: lunchContext === 'free-day' ? 8 : 10 }
            },
            {
                title: snackStrategy.afternoonTitle,
                whyItFits: snackStrategy.afternoonWhy,
                items: snackStrategy.afternoonItems,
                notes: ['Piacevole anche come spuntino serale', 'Molto utile in fasi di dimagrimento'],
                macros: { kcal: lunchContext === 'free-day' ? 125 : 140, protein: snackProtein, carbs: lunchContext === 'free-day' ? 8 : 9, fat: snackStrategy.afternoonFat }
            }
        ],
        guidance: [
            `Fabbisogno stimato: ${Math.round(profile.maintenanceCalories || 0)} kcal; piano attuale: ${Math.round(profile.targetCalories || 0)} kcal (${formatDeltaKcal(profile.goalCalorieDelta)}).`,
            `Target proteico: ${Number(profile.proteinTargetPerKg || 0).toFixed(1)} g/kg, circa ${Math.round(profile.proteinTargetGrams || 0)} g al giorno.`,
            `Preferenza pranzo considerata: ${getLunchContextLabel(lunchContext)}. ${snackStrategy.guidance}`,
            'Le opzioni sono equivalenti come logica nutrizionale, non copie rigide da seguire sempre nello stesso modo.'
        ]
    };
}

function getAIDailyPlanFallback(profile, preferences, lunchContext = 'workday') {
    const goal = profile.goal || 'mantenere';
    const targetCalories = Math.round(profile.targetCalories || 0);
    const proteinGrams = Math.round(profile.proteinTargetGrams || 0);
    const breakfastKcal = Math.round(targetCalories * 0.22);
    const lunchKcal = Math.round(targetCalories * 0.3);
    const dinnerKcal = Math.round(targetCalories * 0.28);
    const snackKcal = Math.max(120, Math.round((targetCalories - breakfastKcal - lunchKcal - dinnerKcal) / 2));
    const isFreeDayLunch = lunchContext === 'free-day';
    const snackStrategy = getLunchContextSnackStrategy(lunchContext);
    const dinnerStrategy = getLunchContextDinnerStrategy(lunchContext, profile.dinnerProteinPreference);
    const clinicalContext = getClinicalNutritionContext(profile);
    const lunchCompletion = completePlanMealItems(
        'Pranzo',
        isFreeDayLunch
            ? ['Inizio con verdure crude semplici come insalata, carota o finocchio', 'base amidacea come farro, riso integrale, pasta, quinoa o cous-cous', 'legumi gia cotti o edamame come quota proteico-fibrosa', 'verdure cotte o crude piu presenti', 'olio EVO ben dichiarato', 'eventuale piccola nota dolce finale solo se coerente con il profilo']
            : ['Inizio con verdure crude semplici se praticabile', 'base amidacea come farro, riso integrale, pasta, quinoa o cous-cous', 'legumi gia cotti o edamame come quota proteico-fibrosa', 'verdure di accompagnamento', 'olio EVO ben dichiarato', 'struttura facile da preparare o portare fuori casa'],
        {
            protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova, tofu o carne bianca',
            cereal: 'completa con una base amidacea chiara come riso, farro, pasta o pane integrale',
            vegetables: 'assicurati che ci sia una quota di verdure ben leggibile',
            healthyFat: 'dichiara una quota di grassi buoni come olio EVO o semi'
        }
    );
    const dinnerCompletion = completePlanMealItems(
        'Cena',
        dinnerStrategy.items,
        {
            protein: 'aggiungi una fonte proteica chiara coerente con la serata',
            cereal: 'se manca, completa con pane, cereale semplice o patate',
            vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
            healthyFat: 'dichiara una quota misurata di grassi buoni come olio EVO'
        }
    );

    if (clinicalContext.applicable) {
        const dailyPattern = cloneClinicalGuidanceValue(clinicalContext.dailyPattern || {});

        return {
            title: 'Giornata alimentare ispirata a uno schema clinico-pratico personalizzato',
            daily_theme: isFreeDayLunch ? 'Giornata: Strategia Clinica e Recupero Disteso' : 'Giornata: Strategia Clinica e Continuita Energetica',
            rationale: `Esempio di giornata per profilo adulto in sovrappeso con deficit moderato, costruito distinguendo fabbisogno e piano calorico e mantenendo una struttura semplice e aderente nel tempo.${preferences ? ` Nota considerata: ${preferences}.` : ''}`,
            lunchContext,
            targets: {
                maintenanceCalories: Math.round(profile.maintenanceCalories || 0),
                targetCalories,
                deltaCalories: Math.round(profile.goalCalorieDelta || 0),
                proteinGrams,
                proteinPerKg: Number(profile.proteinTargetPerKg || 0).toFixed(1),
                hydrationLiters: Number(profile.waterTargetLiters || 0).toFixed(1)
            },
            meals: [
                {
                    slot: 'Colazione',
                    ...dailyPattern.breakfast
                },
                {
                    slot: 'Spuntino mattina',
                    ...dailyPattern.morningSnack
                },
                {
                    slot: 'Pranzo',
                    title: isFreeDayLunch ? dailyPattern.lunch.titleFreeDay : dailyPattern.lunch.titleWorkday,
                    whyItFits: isFreeDayLunch ? dailyPattern.lunch.whyFreeDay : dailyPattern.lunch.whyWorkday,
                    items: completePlanMealItems('Pranzo', dailyPattern.lunch.items, {
                        protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova o carne bianca',
                        cereal: 'completa con una base amidacea chiara come riso, farro, pasta o pane semplice',
                        vegetables: 'assicurati che sia presente una quota di verdure ben leggibile',
                        healthyFat: 'dichiara una quota misurata di grassi buoni come olio EVO a crudo'
                    }).items,
                    kcal: lunchKcal || 520,
                    protein: Math.max(24, Math.round(proteinGrams * 0.3)),
                    carbs: dailyPattern.lunch.carbs,
                    fat: dailyPattern.lunch.fat
                },
                {
                    slot: 'Spuntino pomeriggio',
                    ...dailyPattern.afternoonSnack,
                    items: [...(dailyPattern.afternoonSnack.items || []), clinicalContext.hungerStrategy]
                },
                {
                    slot: 'Cena',
                    ...dailyPattern.dinner,
                    items: completePlanMealItems('Cena', dailyPattern.dinner.items, {
                        protein: 'aggiungi una fonte proteica chiara coerente con il pasto serale',
                        cereal: 'se manca, completa con pane semplice, cereale o patate',
                        vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
                        healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO a crudo'
                    }).items,
                    kcal: dinnerKcal || 470,
                    protein: Math.max(28, Math.round(proteinGrams * 0.28)),
                    carbs: dailyPattern.dinner.carbs,
                    fat: dailyPattern.dinner.fat
                }
            ],
            notes: [
                clinicalContext.weightNote,
                'Per la fame, le verdure crude possono essere usate liberamente come supporto di sazieta.',
                clinicalContext.proteinRotation,
                'Controllo completezza attivo anche nel fallback: pranzo e cena vengono verificati per proteine, cereali, verdure e grassi buoni.',
                ...(dailyPattern.notes || []),
                clinicalContext.avoidFoods,
            ]
        };
    }

    return {
        title: 'Giornata alimentare ragionata sul tuo profilo',
        daily_theme: isFreeDayLunch ? 'Giornata: Recupero, Distensione e Sazieta Pulita' : 'Giornata: Focus Energetico e Ritmo Sostenibile',
        rationale: `Esempio di giornata costruito per l obiettivo ${goal}, distinguendo fabbisogno, piano calorico e distribuzione della quota proteica, con pranzo da ${getLunchContextLabel(lunchContext).toLowerCase()}. ${preferences ? `Nota considerata: ${preferences}.` : ''}`.trim(),
        lunchContext,
        targets: {
            maintenanceCalories: Math.round(profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(profile.proteinTargetPerKg || 0).toFixed(1),
            hydrationLiters: Number(profile.waterTargetLiters || 0).toFixed(1)
        },
        meals: [
            {
                slot: 'Colazione',
                title: 'Yogurt greco, avena e frutta',
                whyItFits: 'Apre la giornata con una quota proteica ordinata e una struttura facile da mantenere.',
                items: ['Yogurt greco 0%', 'fiocchi di avena o cereali semplici', '1 porzione di frutta'],
                kcal: breakfastKcal,
                protein: Math.max(20, Math.round(proteinGrams * 0.22)),
                carbs: 35,
                fat: 8
            },
            {
                slot: 'Spuntino mattina',
                title: snackStrategy.morningTitle,
                whyItFits: snackStrategy.morningWhy,
                items: snackStrategy.morningItems,
                kcal: isFreeDayLunch ? Math.max(110, snackKcal - 20) : snackKcal,
                protein: Math.max(12, Math.round(proteinGrams * 0.1)),
                carbs: isFreeDayLunch ? 10 : 14,
                fat: snackStrategy.morningFat
            },
            {
                slot: 'Pranzo',
                title: isFreeDayLunch
                    ? 'Pranzo da giorno libero con apertura vegetale e piatto piu disteso'
                    : 'Pranzo da giorno lavorativo pratico e strutturato',
                whyItFits: isFreeDayLunch
                    ? 'Sfrutta un ritmo piu calmo e una struttura piu curata, senza perdere coerenza con il piano.'
                    : 'Tiene insieme energia, sazieta e praticita in una pausa pranzo piu rapida e gestibile.',
                items: lunchCompletion.items,
                kcal: lunchKcal,
                protein: Math.max(28, Math.round(proteinGrams * 0.3)),
                carbs: 55,
                fat: 16
            },
            {
                slot: 'Spuntino pomeriggio',
                title: snackStrategy.afternoonTitle,
                whyItFits: snackStrategy.afternoonWhy,
                items: snackStrategy.afternoonItems,
                kcal: isFreeDayLunch ? Math.max(110, snackKcal - 15) : snackKcal,
                protein: Math.max(10, Math.round(proteinGrams * 0.1)),
                carbs: isFreeDayLunch ? 12 : 16,
                fat: snackStrategy.afternoonFat
            },
            {
                slot: 'Cena',
                title: dinnerStrategy.title,
                whyItFits: dinnerStrategy.why,
                items: dinnerCompletion.items,
                kcal: dinnerKcal,
                protein: Math.max(28, Math.round(proteinGrams * 0.28)),
                carbs: dinnerStrategy.carbs,
                fat: dinnerStrategy.fat
            }
        ],
        notes: [
            'Le porzioni reali vanno adattate ai cibi scelti e alla tua routine del giorno.',
            'Il piano non e una prescrizione clinica: e un esempio ragionato coerente con il profilo inserito.',
            'Se la fame al mattino e bassa, una parte dell energia puo essere spostata tra colazione e spuntino.',
            isFreeDayLunch
                ? 'Nel giorno libero il pranzo puo essere un po piu disteso e curato, ma non deve perdere struttura nutrizionale.'
                : 'Nel giorno lavorativo il pranzo deve restare pratico, digeribile e sostenibile anche fuori casa.',
            lunchCompletion.addedComponents.length > 0
                ? `Controllo pranzo completato: integrate ${lunchCompletion.addedComponents.join(', ')}.`
                : 'Controllo pranzo completato: struttura gia completa e leggibile.',
            dinnerCompletion.addedComponents.length > 0
                ? `Controllo cena completato: integrate ${dinnerCompletion.addedComponents.join(', ')}.`
                : 'Controllo cena completato: struttura gia completa e leggibile.',
            `Preferenza proteica serale considerata: ${getDinnerProteinPreferenceLabel(profile.dinnerProteinPreference || 'variata')}.`
            ,`Frequenza serale suggerita: ${getDinnerProteinFrequencyLabel(profile.dinnerProteinFrequency || 'libera')}.`
        ]
    };
}

function renderAIBoxLoading(resultId, title, subtitle) {
    const resultBox = document.getElementById(resultId);
    if (!resultBox) return;

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-mode-loading">
            <h4 class="ai-mode-title">${escapeHtml(title)}</h4>
            <p class="ai-mode-subtitle">${escapeHtml(subtitle)}</p>
        </div>
    `;
    updateAiModeResultsVisibility(resultId);
}

function renderAIBoxError(resultId, title, message) {
    const resultBox = document.getElementById(resultId);
    if (!resultBox) return;

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-mode-error">
            <h4 class="ai-mode-title">${escapeHtml(title)}</h4>
            <p class="ai-mode-subtitle">${escapeHtml(removeRetryAfterHintFromMessage(message) || message)}</p>
            ${buildAIRetryCountdownHtml(message)}
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility(resultId);
}

function renderAIBreakfastSnackResults(payload) {
    const resultBox = document.getElementById('ai-breakfast-result');
    if (!resultBox) return;

    const breakfastOptions = Array.isArray(payload.breakfastOptions) ? payload.breakfastOptions : [];
    const snackOptions = Array.isArray(payload.snackOptions) ? payload.snackOptions : [];
    const guidance = Array.isArray(payload.guidance) ? payload.guidance : [];
    const lunchContext = payload?.meta?.lunchContext === 'free-day' ? 'free-day' : 'workday';
    const snackBadge = getSnackContextBadge(lunchContext);
    const breakfastMealTypeMeta = getAIRecipeMealTypeMeta('colazione');
    const snackMealTypeMeta = getAIRecipeMealTypeMeta('spuntino');
    const sourceNote = buildAiSourceBannerHtml({
        ...(payload?.meta || {}),
        description: payload?.meta?.source === 'fallback'
            ? 'Le opzioni mostrate arrivano dal motore di backup locale, non da Gemini live.'
            : 'AI live attiva: le opzioni mostrate arrivano dal motore remoto disponibile in questo momento.'
    });
    const lunchContextNote = `<p class="ai-mode-subtitle"><strong>Contesto profilo:</strong> ${escapeHtml(getLunchContextRecipeNote(lunchContext))}</p>`;

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-plan-block">
            <div class="ai-mode-header">
                <div>
                    <h4 class="ai-mode-title">Colazioni e spuntini su misura</h4>
                    ${sourceNote}
                    ${lunchContextNote}
                </div>
            </div>

            <div class="ai-recipe-grid">
                ${breakfastOptions.map((option, index) => `
                    <article class="ai-recipe-card">
                        <div class="ai-recipe-card-top">
                            <span class="ai-recipe-index">Colazione ${index + 1}</span>
                            <span class="ai-recipe-tag">Opzione equivalente</span>
                        </div>
                        <div class="ai-recipe-card-meta-row">
                            <span class="ai-recipe-mealtype ${escapeHtml(breakfastMealTypeMeta.className)}">${escapeHtml(breakfastMealTypeMeta.label)}</span>
                            <span class="ai-recipe-mealtype-note">${escapeHtml(breakfastMealTypeMeta.tone)}</span>
                        </div>
                        <h5>${escapeHtml(getCompactAIRecipeTitle({ title: option.title || `Colazione ${index + 1}` }, 'colazione', 'equivalente'))}</h5>
                        <p class="ai-recipe-fit"><strong>Perche ti puo aiutare:</strong> ${escapeHtml(option.whyItFits || '')}</p>
                        <div class="ai-recipe-section">
                            <strong>Componenti</strong>
                            <ul>${renderAICardList(option.items || [])}</ul>
                        </div>
                        ${(option.notes && option.notes.length > 0) ? `
                            <div class="ai-recipe-section">
                                <strong>Note pratiche</strong>
                                <ul>${renderAICardList(option.notes)}</ul>
                            </div>
                        ` : ''}
                        ${option.macros ? `<p class="ai-recipe-fit"><strong>Stima:</strong> ${escapeHtml(option.macros.kcal)} kcal • P ${escapeHtml(option.macros.protein)} g • C ${escapeHtml(option.macros.carbs)} g • G ${escapeHtml(option.macros.fat)} g</p>` : ''}
                    </article>
                `).join('')}
            </div>

            <div class="ai-recipe-grid">
                ${snackOptions.map((option, index) => `
                    <article class="ai-recipe-card">
                        <div class="ai-recipe-card-top">
                            <span class="ai-recipe-index">Spuntino ${index + 1}</span>
                            <span class="ai-recipe-tag ${escapeHtml(snackBadge.className)}">${escapeHtml(snackBadge.label)}</span>
                        </div>
                        <div class="ai-recipe-card-meta-row">
                            <span class="ai-recipe-mealtype ${escapeHtml(snackMealTypeMeta.className)}">${escapeHtml(snackMealTypeMeta.label)}</span>
                            <span class="ai-recipe-mealtype-note">${escapeHtml(snackMealTypeMeta.tone)}</span>
                        </div>
                        <h5>${escapeHtml(getCompactAIRecipeTitle({ title: option.title || `Spuntino ${index + 1}` }, 'spuntino', snackBadge.label))}</h5>
                        <p class="ai-recipe-fit"><strong>Perche ti puo aiutare:</strong> ${escapeHtml(option.whyItFits || '')}</p>
                        <div class="ai-recipe-section">
                            <strong>Componenti</strong>
                            <ul>${renderAICardList(option.items || [])}</ul>
                        </div>
                        ${(option.notes && option.notes.length > 0) ? `
                            <div class="ai-recipe-section">
                                <strong>Note pratiche</strong>
                                <ul>${renderAICardList(option.notes)}</ul>
                            </div>
                        ` : ''}
                        ${option.macros ? `<p class="ai-recipe-fit"><strong>Stima:</strong> ${escapeHtml(option.macros.kcal)} kcal • P ${escapeHtml(option.macros.protein)} g • C ${escapeHtml(option.macros.carbs)} g • G ${escapeHtml(option.macros.fat)} g</p>` : ''}
                    </article>
                `).join('')}
            </div>

            ${(guidance.length > 0) ? `
                <div class="ai-recipe-card">
                    <h5>Logica usata</h5>
                    <ul class="ai-plan-note-list">${renderAICardList(guidance)}</ul>
                </div>
            ` : ''}
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility('ai-breakfast-result');
}

function renderAIDailyPlanResults(payload) {
    const resultBox = document.getElementById('ai-day-plan-result');
    if (!resultBox) return;

    const plan = payload.plan || payload;
    const profilePayload = getAIProfilePayload();
    const targets = plan.targets || {};
    const meals = Array.isArray(plan.meals) ? plan.meals : [];
    const notes = Array.isArray(plan.notes) ? [...plan.notes] : [];
    const lunchContext = plan.lunchContext || 'workday';
    const dinnerPreferenceNote = buildDinnerPreferencePlanNote(profilePayload);
    const dinnerProfileContext = `Contesto serale del profilo: ${dinnerPreferenceNote}`;
    if (!notes.includes(dinnerPreferenceNote)) {
        notes.push(dinnerPreferenceNote);
    }
    const rationale = [plan.rationale, dinnerPreferenceNote].filter(Boolean).join(' ');
    const sourceNote = buildAiSourceBannerHtml({
        ...(payload?.meta || {}),
        description: payload?.meta?.source === 'fallback'
            ? 'Il piano mostrato non arriva da Gemini live: l app sta usando il fallback locale per non interrompere l esperienza.'
            : payload?.meta?.source === 'gemini-cache'
                ? 'Gemini non era disponibile in questo momento: sto mostrando un piano giornaliero valido gia generato in precedenza da Gemini.'
            : 'AI live attiva: il piano mostrato arriva da Gemini ed e organizzato come una giornata completa.'
    });
    const dailyTheme = String(plan.daily_theme || plan.dailyTheme || '').trim();

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-plan-block">
            <div class="ai-mode-header">
                <div>
                    <h4 class="ai-mode-title">${escapeHtml(plan.title || 'Piano giornaliero su misura')}</h4>
                    ${sourceNote}
                    ${dailyTheme ? `<p class="ai-plan-theme ai-plan-theme-main">${escapeHtml(dailyTheme)}</p>` : ''}
                    <p class="ai-mode-subtitle"><strong>Contesto serale:</strong> ${escapeHtml(dinnerProfileContext)}</p>
                </div>
            </div>

            ${rationale ? `<p class="ai-recipe-fit"><strong>Ragionamento:</strong> ${escapeHtml(rationale)}</p>` : ''}

            <div class="ai-plan-meta">
                <div class="ai-plan-stat"><strong>Fabbisogno</strong><span>${escapeHtml(targets.maintenanceCalories || 0)} kcal</span></div>
                <div class="ai-plan-stat"><strong>Piano</strong><span>${escapeHtml(targets.targetCalories || 0)} kcal</span></div>
                <div class="ai-plan-stat"><strong>Delta</strong><span>${escapeHtml(formatDeltaKcal(targets.deltaCalories || 0))}</span></div>
                <div class="ai-plan-stat"><strong>Proteine</strong><span>${escapeHtml(targets.proteinGrams || 0)} g (${escapeHtml(targets.proteinPerKg || 0)} g/kg)</span></div>
                <div class="ai-plan-stat"><strong>Acqua</strong><span>${escapeHtml(targets.hydrationLiters || 0)} L</span></div>
                <div class="ai-plan-stat"><strong>Pranzo</strong><span>${escapeHtml(getLunchContextLabel(lunchContext))}</span></div>
            </div>

            <div class="ai-recipe-grid">
                ${meals.map((meal) => `
                    <article class="ai-plan-day">
                        <div class="ai-plan-day-top">
                            <span class="ai-recipe-index">${escapeHtml(meal.slot || 'Pasto')}</span>
                            <span class="ai-recipe-tag">${escapeHtml(meal.kcal || 0)} kcal</span>
                        </div>
                        <h5>${escapeHtml(meal.title || 'Pasto')}</h5>
                        <p class="ai-recipe-fit"><strong>Perche ti puo aiutare:</strong> ${escapeHtml(meal.whyItFits || '')}</p>
                        <ul class="ai-plan-items">${renderAICardList(meal.items || [])}</ul>
                        <p class="ai-recipe-fit"><strong>Stima:</strong> P ${escapeHtml(meal.protein || 0)} g • C ${escapeHtml(meal.carbs || 0)} g • G ${escapeHtml(meal.fat || 0)} g</p>
                    </article>
                `).join('')}
            </div>

            ${(notes.length > 0) ? `
                <div class="ai-recipe-card">
                    <h5>Note del piano</h5>
                    <ul class="ai-plan-note-list">${renderAICardList(notes)}</ul>
                </div>
            ` : ''}
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility('ai-day-plan-result');
}

function getAIWeeklyPlanFallback(profile, preferences, lunchContext = 'workday') {
    const clinicalContext = getClinicalNutritionContext(profile);
    const weeklyPattern = cloneClinicalGuidanceValue(clinicalContext.weeklyPattern || {});
    const dailyPattern = cloneClinicalGuidanceValue(clinicalContext.dailyPattern || {});
    const targetCalories = Math.round(profile.targetCalories || 0);
    const proteinGrams = Math.round(profile.proteinTargetGrams || 0);
    const carbsGrams = Math.round(profile.carbsTargetGrams || 0);
    const fatGrams = Math.round(profile.fatTargetGrams || 0);

    const days = (weeklyPattern.days || []).map((day, index) => {
        const lunchCompletion = completePlanMealItems(
            'Pranzo',
            index === 5 || index === 6
                ? [
                    '80 g pasta o riso o farro o orzo con condimenti vegetali',
                    'verdure cotte o crude a piacere',
                    '20 g olio EVO preferibilmente a crudo',
                    '20 g pane semplice senza sale'
                ]
                : (dailyPattern.lunch?.items || []),
            {
                protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova o carne bianca secondo la rotazione della settimana',
                cereal: 'completa con una base amidacea chiara come farro, riso, pasta, pane o orzo',
                vegetables: 'assicurati che siano presenti verdure di contorno o apertura vegetale',
                healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO a crudo'
            }
        );
        const dinnerCompletion = completePlanMealItems(
            'Cena',
            [
                'brodo o passato di verdure senza patate o legumi a piacere',
                `fonte proteica prioritaria: ${day.dinnerProtein}`,
                'verdura cotta o cruda a piacere',
                '10 g olio EVO preferibilmente a crudo',
                '60 g pane semplice senza sale'
            ],
            {
                protein: 'aggiungi una proteina chiara coerente con la rotazione settimanale',
                cereal: 'se manca, completa con una quota semplice di pane, cereale o patate',
                vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
                healthyFat: 'dichiara sempre una quota misurata di grassi buoni, preferibilmente olio EVO'
            }
        );

        return {
            day: day.day,
            daily_theme: `${day.day}: ${day.focus}`,
            focus: day.focus,
            meals: [
                {
                    slot: 'Colazione',
                    title: dailyPattern.breakfast?.title || 'Colazione semplice',
                    items: dailyPattern.breakfast?.items || []
                },
                {
                    slot: 'Spuntini',
                    title: 'Frutta fresca come base degli spuntini',
                    items: ['Mattina: 200 g frutta fresca', 'Pomeriggio: 200 g frutta fresca', clinicalContext.hungerStrategy || 'Aumenta il volume con verdure se serve sazieta extra']
                },
                {
                    slot: 'Pranzo',
                    title: day.lunch,
                    items: lunchCompletion.items
                },
                {
                    slot: 'Cena',
                    title: `Cena con ${day.dinnerProtein}`,
                    items: dinnerCompletion.items
                }
            ],
            notes: [
                `Focus del giorno: ${day.focus}`,
                index === 5 || index === 6
                    ? 'Nel fine settimana la struttura puo essere un po piu distesa, ma senza perdere ordine nutrizionale.'
                    : `Nel contesto ${getLunchContextLabel(lunchContext).toLowerCase()} la priorita resta la praticita.`,
                lunchCompletion.addedComponents.length > 0
                    ? `Controllo pranzo completato: integrate ${lunchCompletion.addedComponents.join(', ')}.`
                    : 'Controllo pranzo completato: struttura gia completa e leggibile.',
                dinnerCompletion.addedComponents.length > 0
                    ? `Controllo cena completato: integrate ${dinnerCompletion.addedComponents.join(', ')}.`
                    : 'Controllo cena completato: struttura gia completa e leggibile.'
            ]
        };
    });

    return {
        title: weeklyPattern.title || 'Settimana alimentare coerente con il profilo',
        rationale: `${weeklyPattern.rationale || 'Schema settimanale costruito per dare continuita e organizzazione.'}${preferences ? ` Nota considerata: ${preferences}.` : ''}`,
        targets: {
            maintenanceCalories: Math.round(profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(profile.proteinTargetPerKg || 0).toFixed(1),
            carbsGrams,
            fatGrams,
            fiberGrams: Math.round(profile.fiberTargetGrams || 0),
            hydrationLiters: Number(profile.waterTargetLiters || 0).toFixed(1)
        },
        days,
        notes: [
            clinicalContext.weightNote,
            clinicalContext.proteinRotation,
            'Il menu settimanale resta uno strumento flessibile: puoi modificare i singoli pasti in base a impegni, pasti fuori casa e desideri senza perdere il filo nutrizionale.',
            'Per ogni pasto controlla la completezza della struttura: cereale o altra base amidacea, proteina, verdure e grassi buoni quando coerenti con il profilo.',
            ...(weeklyPattern.notes || []),
            clinicalContext.avoidFoods
        ]
    };
}

function renderAIWeeklyPlanResults(payload) {
    const resultBox = document.getElementById('ai-day-plan-result');
    if (!resultBox) return;

    lastWeeklyPlanPayload = payload;

    const profilePayload = getAIProfilePayload();
    const week = payload.week || payload;
    const targets = week.targets || {};
    const days = Array.isArray(week.days) ? week.days : [];
    const notes = Array.isArray(week.notes) ? week.notes : [];
    const pantryRaw = document.getElementById('weekly-plan-pantry')?.value || '';
    const shoppingInsights = buildWeeklyShoppingInsights(week, pantryRaw);
    const shoppingGroups = groupShoppingItemsByCategory(shoppingInsights.toBuy);
    const sourceNote = buildAiSourceBannerHtml({
        ...(payload?.meta || {}),
        description: payload?.meta?.source === 'fallback'
            ? 'Il piano settimanale mostrato usa il fallback locale: Gemini live non ha restituito una risposta valida in questo tentativo.'
            : payload?.meta?.source === 'gemini-cache'
                ? 'Gemini non era disponibile in questo momento: sto mostrando un piano settimanale valido gia generato in precedenza da Gemini.'
            : payload?.meta?.source === 'example'
                ? 'Stai vedendo uno schema settimanale statico caricato manualmente e non una risposta live di Gemini.'
                : 'AI live attiva: il piano settimanale mostrato arriva da Gemini ed e coerente con il profilo.'
    });
    const proteinStat = targets.proteinLabel
        ? escapeHtml(targets.proteinLabel)
        : (targets.proteinGrams || targets.proteinPerKg)
            ? `${escapeHtml(targets.proteinGrams || 0)} g (${escapeHtml(targets.proteinPerKg || 0)} g/kg)`
            : '-';
    const carbsStat = targets.carbsLabel
        ? escapeHtml(targets.carbsLabel)
        : (targets.carbsGrams ? `${escapeHtml(targets.carbsGrams)} g` : '-');
    const fatStat = targets.fatLabel
        ? escapeHtml(targets.fatLabel)
        : (targets.fatGrams ? `${escapeHtml(targets.fatGrams)} g` : '-');
    const fiberStat = targets.fiberLabel
        ? escapeHtml(targets.fiberLabel)
        : (targets.fiberGrams ? `${escapeHtml(targets.fiberGrams)} g` : '-');
    const hydrationStat = targets.hydrationLabel
        ? escapeHtml(targets.hydrationLabel)
        : (targets.hydrationLiters ? `${escapeHtml(targets.hydrationLiters)} L` : '-');
    const weeklyGuide = shouldUseVeganPlanning(profilePayload)
        ? [
            'In un menu 100% vegetale fai comparire cereali o derivati a ogni pasto principale e legumi o altre proteine vegetali almeno due volte al giorno.',
            'A pranzo e cena tieni abbondanti le verdure; distribuisci frutta 2-3 volte al giorno e usa semi, frutta secca e olio EVO con misura nel corso della giornata.',
            'Controlla piu volte al giorno la presenza di cibi vegetali ricchi di calcio e decidi dove inserire semi di lino o chia per il capitolo Omega 3.',
            'Usa il piano come traccia flessibile e mediterranea: molte ricette italiane sono gia naturalmente vegetali e non richiedono sostituzioni complicate.',
            'Quando hai finito, confronta il menu con dispensa, frigo e freezer e organizza la spesa per corsie, non come elenco casuale di piatti.'
        ]
        : [
            'Parti dalle proteine dei pasti principali e verifica la rotazione della settimana: legumi, pesce, carne, uova e formaggi vanno alternati con buon senso.',
            'Completa poi ogni pranzo e ogni cena con cereali o altra base amidacea, verdure e una quota dichiarata di grassi buoni.',
            'Usa il piano come traccia flessibile: puoi spostare o sostituire pasti in base a lavoro, famiglia, mensa, uscite e weekend.',
            'Quando hai finito, evidenzia quello che hai gia in dispensa, frigo o freezer e scrivi la spesa solo per cio che manca.',
            'Procedi per piccoli passi: un menu semplice ma ripetibile vale piu di una settimana perfetta ma difficile da mantenere.'
        ];

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="ai-plan-block">
            <div class="ai-mode-header">
                <div>
                    <h4 class="ai-mode-title">${escapeHtml(week.title || 'Piano settimanale su misura')}</h4>
                    ${sourceNote}
                </div>
            </div>

            ${week.rationale ? `<p class="ai-recipe-fit"><strong>Ragionamento:</strong> ${escapeHtml(week.rationale)}</p>` : ''}

            <div class="ai-plan-meta">
                <div class="ai-plan-stat"><strong>Fabbisogno</strong><span>${escapeHtml(targets.maintenanceCalories || 0)} kcal</span></div>
                <div class="ai-plan-stat"><strong>Piano</strong><span>${escapeHtml(targets.targetCalories || 0)} kcal</span></div>
                <div class="ai-plan-stat"><strong>Delta</strong><span>${escapeHtml(formatDeltaKcal(targets.deltaCalories || 0))}</span></div>
                <div class="ai-plan-stat"><strong>Proteine</strong><span>${proteinStat}</span></div>
                <div class="ai-plan-stat"><strong>Carboidrati</strong><span>${carbsStat}</span></div>
                <div class="ai-plan-stat"><strong>Grassi</strong><span>${fatStat}</span></div>
                <div class="ai-plan-stat"><strong>Fibra</strong><span>${fiberStat}</span></div>
                <div class="ai-plan-stat"><strong>Acqua</strong><span>${hydrationStat}</span></div>
                <div class="ai-plan-stat"><strong>Giorni</strong><span>${escapeHtml(days.length || 0)}</span></div>
            </div>

            <div class="ai-recipe-grid">
                ${days.map((day) => `
                    <article class="ai-plan-day">
                        <div class="ai-plan-day-top">
                            <span class="ai-recipe-index">${escapeHtml(day.day || 'Giorno')}</span>
                            <span class="ai-recipe-tag">Settimana</span>
                        </div>
                        ${day.daily_theme ? `<p class="ai-plan-theme">${escapeHtml(day.daily_theme)}</p>` : ''}
                        <h5>${escapeHtml(day.focus || 'Struttura del giorno')}</h5>
                        ${(Array.isArray(day.meals) ? day.meals : []).map((meal) => `
                            <div class="ai-recipe-section">
                                <strong>${escapeHtml(meal.slot || 'Pasto')}</strong>
                                <p class="ai-recipe-fit">${escapeHtml(meal.title || '')}</p>
                                <ul>${renderAICardList(meal.items || [])}</ul>
                            </div>
                        `).join('')}
                        ${(Array.isArray(day.notes) && day.notes.length > 0) ? `<ul class="ai-plan-note-list">${renderAICardList(day.notes)}</ul>` : ''}
                    </article>
                `).join('')}
            </div>

            ${(notes.length > 0) ? `
                <div class="ai-recipe-card">
                    <h5>Note della settimana</h5>
                    <ul class="ai-plan-note-list">${renderAICardList(notes)}</ul>
                </div>
            ` : ''}

            <div class="ai-recipe-card">
                <h5>Come usare il meal plan</h5>
                <ul class="ai-plan-note-list">${renderAICardList(weeklyGuide)}</ul>
            </div>

            <div class="ai-recipe-card">
                <h5>Dispensa riconosciuta</h5>
                <ul class="ai-plan-note-list">${renderAICardList(shoppingInsights.pantryLabels.length > 0 ? shoppingInsights.pantryLabels : ['Non hai ancora indicato ingredienti gia presenti in casa.'])}</ul>
            </div>

            <div class="ai-recipe-card">
                <h5>Lista della spesa suggerita</h5>
                ${shoppingGroups.length > 0 ? shoppingGroups.map((group) => `
                    <div class="ai-recipe-section">
                        <strong>${escapeHtml(group.label)}</strong>
                        <ul class="ai-plan-note-list">${renderAICardList(group.items)}</ul>
                    </div>
                `).join('') : `<ul class="ai-plan-note-list">${renderAICardList(['In base alla dispensa indicata non emergono componenti mancanti da acquistare.'])}</ul>`}
                ${shoppingInsights.alreadyCovered.length > 0 ? `<p class="ai-recipe-fit"><strong>Gia coperti in casa:</strong> ${escapeHtml(shoppingInsights.alreadyCovered.join(', '))}</p>` : ''}
            </div>
        </div>
    `;
    activateAIRetryCountdown(resultBox);
    updateAiModeResultsVisibility('ai-day-plan-result');
}

async function generaColazioniSpuntiniAI() {
    const profilePayload = getAIProfilePayload();
    const preferences = (document.getElementById('breakfast-ai-notes')?.value || '').trim();

    renderAIBoxLoading(
        'ai-breakfast-result',
        'Sto preparando colazioni e spuntini...',
        'Uso il tuo profilo per costruire opzioni equivalenti e sostenibili.'
    );

    console.error('AI breakfast mode disabled: this deploy only allows Gemini-backed generation.');
    renderAIBoxError(
        'ai-breakfast-result',
        'Colazioni e spuntini non disponibili',
        'Questa modalita non e attiva in questo deploy perche qui sono consentite solo generazioni collegate a Gemini.'
    );
}

async function generaPianoGiornalieroAI() {
    const profilePayload = getAIProfilePayload();
    const preferences = (document.getElementById('day-plan-ai-notes')?.value || '').trim();
    const lunchContext = persistLunchContextPreference(document.getElementById('day-plan-lunch-context')?.value || 'workday');
    const dailyPlanRequestPayload = buildGeminiDailyPlanRequestPayload(profilePayload, {
        preferenze: preferences,
        contesto_pranzo: lunchContext,
        crononutrizione: 'Colazione densa, pranzo per energia, cena leggera e digeribile',
        logica_zero_sprechi: 'Riutilizza ingredienti compatibili tra pranzo e cena quando sensato',
        ordine_atteso_pasti: GEMINI_DAILY_SLOTS
    });

    renderAIBoxLoading(
        'ai-day-plan-result',
        'Sto costruendo il piano giornaliero...',
        `Distinguo fabbisogno, piano calorico, quota proteica e pranzo da ${getLunchContextLabel(lunchContext).toLowerCase()}.`
    );

    try {
        const geminiPayload = await generaRicettaGemini({
            mode: 'piano-giornaliero',
            payload: dailyPlanRequestPayload
        });

        if (!geminiPayload || !Array.isArray(geminiPayload.pasti) || geminiPayload.pasti.length === 0) {
            throw new Error('Gemini ha restituito un piano giornaliero senza pasti validi.');
        }

        const adaptedDailyPlan = adaptGeminiDailyPlan(geminiPayload, profilePayload, {
            preferences,
            lunchContext
        });
        renderAIDailyPlanResults(adaptedDailyPlan);
        persistGeminiCacheEntry('daily', dailyPlanRequestPayload, adaptedDailyPlan, {
            lunchContext,
            preferences
        });
    } catch (error) {
        console.error('AI daily plan error:', error);
        const userFacingError = buildGeminiUserFacingErrorMessage(error);
        const cachedDailyPlan = loadGeminiCacheEntry('daily', dailyPlanRequestPayload, (entry) => String(entry?.metadata?.lunchContext || '') === String(lunchContext || ''));
        if (cachedDailyPlan?.responsePayload) {
            renderAIDailyPlanResults({
                ...cachedDailyPlan.responsePayload,
                meta: {
                    ...(cachedDailyPlan.responsePayload.meta || {}),
                    source: 'gemini-cache',
                    reason: userFacingError
                }
            });
            return;
        }
        renderAIBoxError(
            'ai-day-plan-result',
            'Piano giornaliero non disponibile',
            userFacingError || 'Gemini non ha risposto. Nessun piano locale verra mostrato.'
        );
    }
}

async function generaPianoSettimanaleAI() {
    const profilePayload = getAIProfilePayload();
    const preferences = (document.getElementById('weekly-plan-ai-notes')?.value || '').trim();
    const lunchContext = document.getElementById('weekly-plan-lunch-context')?.value === 'free-day' ? 'free-day' : 'workday';
    const weeklyPlanRequestPayload = buildGeminiWeeklyPlanRequestPayload(profilePayload, {
        preferenze: preferences,
        contesto_pranzo: lunchContext,
        pasti_al_giorno: profilePayload.mealsPerDay,
        obiettivo_settimanale: profilePayload.goal || 'mantenere',
        rotazione_proteica: 'Distribuisci fonti proteiche in modo sensato senza ripetizioni monotone',
        giorni_attesi: GEMINI_WEEK_DAYS,
        ordine_atteso_pasti: GEMINI_DAILY_SLOTS
    });

    renderAIBoxLoading(
        'ai-day-plan-result',
        'Sto costruendo il piano settimanale...',
        'Organizzo la settimana con una logica clinico-pratica, distinguendo struttura quotidiana e rotazione proteica.'
    );

    try {
        const geminiPayload = await generaRicettaGemini({
            mode: 'piano-settimanale',
            payload: weeklyPlanRequestPayload
        });

        if (!geminiPayload || !Array.isArray(geminiPayload.giorni) || geminiPayload.giorni.length === 0) {
            throw new Error('Gemini ha restituito un piano settimanale senza giorni validi.');
        }

        const adaptedWeeklyPlan = adaptGeminiWeeklyPlan(geminiPayload, profilePayload, {
            preferences,
            lunchContext
        });
        renderAIWeeklyPlanResults(adaptedWeeklyPlan);
        persistGeminiCacheEntry('weekly', weeklyPlanRequestPayload, adaptedWeeklyPlan, {
            lunchContext,
            preferences
        });
    } catch (error) {
        console.error('AI weekly plan error:', error);
        const userFacingError = buildGeminiUserFacingErrorMessage(error);
        const cachedWeeklyPlan = loadGeminiCacheEntry('weekly', weeklyPlanRequestPayload, (entry) => String(entry?.metadata?.lunchContext || '') === String(lunchContext || ''));
        if (cachedWeeklyPlan?.responsePayload) {
            renderAIWeeklyPlanResults({
                ...cachedWeeklyPlan.responsePayload,
                meta: {
                    ...(cachedWeeklyPlan.responsePayload.meta || {}),
                    source: 'gemini-cache',
                    reason: userFacingError
                }
            });
            return;
        }
        renderAIBoxError(
            'ai-day-plan-result',
            'Piano settimanale non disponibile',
            userFacingError || 'Gemini non ha risposto. Nessun piano locale verra mostrato.'
        );
    }
}

let kcalChart;

function renderChart(totalCalories, remaining) {
    const chartEl = document.getElementById('kcalChart');
    if (!chartEl || !chartEl.getContext) return;

    const ctx = chartEl.getContext('2d');
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#34b27f';
    const neutral = '#E5E7EB';

    if (kcalChart) {
        kcalChart.data.datasets[0].data = [totalCalories, remaining];
        kcalChart.update();
        return;
    }

    kcalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumate', 'Rimanenti'],
            datasets: [{
                data: [totalCalories, remaining],
                backgroundColor: [primary, neutral],
                borderWidth: 0,
                borderRadius: 20
            }]
        },
        options: {
            cutout: '85%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateHomeStats() {
    const giorno = log[activeDate] || { k: 0, p: 0, c: 0, g: 0, w: 0, items: [] };
    const totalCalories = Math.round(giorno.k || 0);
    const carbs = Math.round(giorno.c || 0);
    const protein = Math.round(giorno.p || 0);
    const fats = Math.round(giorno.g || 0);

    const goal = (profilo && profilo.target) ? Math.round(profilo.target) : 2200;
    const remaining = Math.max(0, goal - totalCalories);

    const centerDisplay = document.getElementById('center-kcal-value');
    if (centerDisplay) centerDisplay.innerText = remaining;

    const intakeDisplay = document.getElementById('home-kcal-intake');
    if (intakeDisplay) intakeDisplay.innerText = `${totalCalories} kcal`;

    const goalDisplay = document.getElementById('home-kcal-goal');
    if (goalDisplay) goalDisplay.innerText = `${goal} kcal`;

    const carbDisplay = document.getElementById('home-carb');
    const protDisplay = document.getElementById('home-prot');
    const fatDisplay = document.getElementById('home-fat');
    const carbTarget = (profilo && profilo.carbsTarget) ? profilo.carbsTarget : 85;
    const protTarget = (profilo && profilo.proteinTarget) ? profilo.proteinTarget : 360;
    const fatTarget = (profilo && profilo.fatTarget) ? profilo.fatTarget : 180;

    if (carbDisplay) carbDisplay.innerText = `${carbs}/${carbTarget} g`;
    if (protDisplay) protDisplay.innerText = `${protein}/${protTarget} g`;
    if (fatDisplay) fatDisplay.innerText = `${fats}/${fatTarget} g`;

    const barCarb = document.getElementById('bar-carb');
    const barProt = document.getElementById('bar-prot');
    const barFat = document.getElementById('bar-fat');

    if (barCarb) barCarb.style.width = `${Math.min(100, (carbs / carbTarget) * 100)}%`;
    if (barProt) barProt.style.width = `${Math.min(100, (protein / protTarget) * 100)}%`;
    if (barFat) barFat.style.width = `${Math.min(100, (fats / fatTarget) * 100)}%`;

    aggiornaRaccomandazioneAcqua((profilo && profilo.weight) || (userProfile && userProfile.weight) || 0);

    const valFe = document.getElementById('val-fe');
    if (valFe) valFe.innerText = `${(giorno.fe||0).toFixed(1)} / 14 mg`;
    const valCa = document.getElementById('val-ca');
    if (valCa) valCa.innerText = `${(giorno.ca||0).toFixed(1)} / 1000 mg`;
    const valMg = document.getElementById('val-mg');
    if (valMg) valMg.innerText = `${(giorno.mg||0).toFixed(1)} / 300 mg`;
    const valK = document.getElementById('val-k');
    if (valK) valK.innerText = `${(giorno.k||0).toFixed(1)} / 3500 mg`;
    const valB12 = document.getElementById('val-b12');
    if (valB12) valB12.innerText = `${(giorno.b12||0).toFixed(1)} / 2.4 µg`;
    const valFol = document.getElementById('val-fol');
    if (valFol) valFol.innerText = `${(giorno.fol||0).toFixed(1)} / 400 µg`;

    const barFe = document.getElementById('bar-fe');
    if (barFe) barFe.style.width = `${Math.min(100, ((giorno.fe||0)/14)*100)}%`;
    const barCa = document.getElementById('bar-ca');
    if (barCa) barCa.style.width = `${Math.min(100, ((giorno.ca||0)/1000)*100)}%`;
    const barMg = document.getElementById('bar-mg');
    if (barMg) barMg.style.width = `${Math.min(100, ((giorno.mg||0)/300)*100)}%`;
    const barK = document.getElementById('bar-k');
    if (barK) barK.style.width = `${Math.min(100, ((giorno.k||0)/3500)*100)}%`;
    const barB12 = document.getElementById('bar-b12');
    if (barB12) barB12.style.width = `${Math.min(100, ((giorno.b12||0)/2.4)*100)}%`;
    const barFol = document.getElementById('bar-fol');
    if (barFol) barFol.style.width = `${Math.min(100, ((giorno.fol||0)/400)*100)}%`;

    renderChart(totalCalories, remaining);
}

function logout() {
    localStorage.clear();
    location.reload();
}

function apriConfermaResetProfilo() {
    const modal = document.getElementById('reset-profile-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function chiudiConfermaResetProfilo() {
    const modal = document.getElementById('reset-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function eseguiResetProfilo() {
    chiudiConfermaResetProfilo();
    logout();
}

function salvaRicettaAI(index) {
    const recipe = aiGeneratedRecipes[index];
    if (!recipe) return;

    const recipeName = String(recipe.nome_ricetta || recipe.title || '').trim();
    if (!recipeName) {
        alert('Questa ricetta AI non puo essere salvata.');
        return;
    }

    const alreadySaved = ricetteSalvate.some((item) => (item.n || '').toLowerCase() === recipeName.toLowerCase());
    if (alreadySaved) {
        alert('Questa ricetta e gia presente nei tuoi piatti salvati.');
        return;
    }

    const savedRecipe = {
        n: recipeName,
        k: 0,
        p: 0,
        c: 0,
        g: 0,
        fe: 0,
        ca: 0,
        b12: 0,
        items: (Array.isArray(recipe.ingredienti_tabella) && recipe.ingredienti_tabella.length > 0
            ? recipe.ingredienti_tabella
            : (recipe.ingredients || []).map((ingredient) => ({ n: ingredient, qty: 0, k: 0, p: 0, c: 0, g: 0 }))).map((ingredient) => ({
                n: String(ingredient.n || ingredient.name || ingredient.ingredient || ingredient || '').trim(),
                qty: Number(ingredient.qty || 0),
                k: Number(ingredient.k || ingredient.kcal || 0),
                p: Number(ingredient.p || ingredient.protein || 0),
                c: Number(ingredient.c || ingredient.carbs || 0),
                g: Number(ingredient.g || ingredient.fat || 0),
                fe: 0,
                ca: 0,
                b12: 0
            })),
        aiGenerated: true,
        aiId: recipe.id || '',
        aiDifficulty: recipe.difficolta || '',
        aiPrepTimeMin: Number(recipe.tempo_prep_min || 0),
        aiExcludedAllergens: Array.isArray(recipe.allergeni_esclusi) ? [...recipe.allergeni_esclusi] : [],
        aiStyle: recipe.style || '',
        aiSummary: recipe.summary || '',
        aiWhyItFits: recipe.whyItFits || '',
        aiSubstitutions: Array.isArray(recipe.substitutions) ? [...recipe.substitutions] : [],
        aiHealthyCooking: recipe.tecnica_cottura || recipe.healthyCooking || '',
        aiSteps: Array.isArray(recipe.procedimento) ? [...recipe.procedimento] : (Array.isArray(recipe.steps) ? [...recipe.steps] : []),
        aiWasteTip: recipe.anti_spreco || recipe.wasteTip || '',
        aiNutrition: recipe.nutrition || null
    };

    ricetteSalvate.push(savedRecipe);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
    aggiornaListaRicetteSalvate();
    alert('Ricetta AI salvata nei tuoi piatti!');
}

function setScannerVisibility(visible) {
    const reader = document.getElementById('reader');
    if (reader) {
        reader.style.display = visible ? 'block' : 'none';
    }

    const scanButton = document.querySelector('.scan-trigger-btn');
    if (scanButton) {
        scanButton.textContent = visible ? 'Chiudi scanner' : '📷 Scansiona';
    }
}

async function fermaScanner() {
    barcodeScanLocked = false;

    if (smartScanFallbackTimer) {
        clearTimeout(smartScanFallbackTimer);
        smartScanFallbackTimer = null;
    }

    if (barcodeScanner) {
        if (barcodeScannerActive) {
            try {
                await barcodeScanner.stop();
            } catch (error) {
                console.warn('Stop scanner warning:', error);
            }
        }

        try {
            await barcodeScanner.clear();
        } catch (error) {
            console.warn('Clear scanner warning:', error);
        }
    }

    barcodeScannerActive = false;
    barcodeScanner = null;
    setScannerVisibility(false);
}

function mapOpenFoodFactsProduct(product, fallbackCode = '') {
    if (!product || typeof product !== 'object') {
        return null;
    }

    const nutriments = product.nutriments || {};
    const kcalValue = Number(
        nutriments['energy-kcal_100g']
        || nutriments['energy-kcal']
        || 0
    );
    const kjValue = Number(nutriments.energy_100g || nutriments.energy || 0);
    const kcalFromKj = kjValue > 0 ? (kjValue / 4.184) : 0;
    const kcal = kcalValue > 0 ? kcalValue : kcalFromKj;
    const scanResult = mapOpenFoodFactsScanResult(product, `Fonte OpenFoodFacts (barcode ${fallbackCode || 'n/d'})`);

    return {
        nome: String(product.product_name_it || product.product_name || `Prodotto ${fallbackCode || 'scannerizzato'}`).trim(),
        kcal: Number.isFinite(kcal) ? kcal : 0,
        proteine: Number(nutriments.proteins_100g || 0),
        carboidrati: Number(nutriments.carbohydrates_100g || 0),
        grassi: Number(nutriments.fat_100g || 0),
        fe: 0,
        ca: 0,
        b12: 0,
        isOFF: true,
        scanResult
    };
}

const KAGGLE_DATASET_ENDPOINTS = [
    '/data/kaggle-products.json',
    'data/kaggle-products.json',
    '/kaggle-products.json',
    'kaggle-products.json'
];

let kaggleBarcodeIndex = new Map();
let kaggleProductsCache = [];
let kaggleDatasetLoadAttempted = false;

function toNumberSafe(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

    const normalized = String(value)
        .replace(/,/g, '.')
        .replace(/[^0-9.-]/g, '')
        .trim();

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

function pickFirstDefined(obj, keys, fallback = '') {
    for (const key of keys) {
        if (!obj || !(key in obj)) continue;
        const value = obj[key];
        if (value === null || value === undefined) continue;
        if (typeof value === 'string' && value.trim() === '') continue;
        return value;
    }
    return fallback;
}

function collectKaggleBarcodes(product) {
    const rawValues = [
        pickFirstDefined(product, ['code']),
        pickFirstDefined(product, ['barcode']),
        pickFirstDefined(product, ['barcodes']),
        pickFirstDefined(product, ['ean']),
        pickFirstDefined(product, ['ean13']),
        pickFirstDefined(product, ['upc']),
        pickFirstDefined(product, ['gtin'])
    ].filter(Boolean);

    const parsed = [];
    rawValues.forEach((raw) => {
        const pieces = String(raw).split(/[|,;\s]+/g).filter(Boolean);
        pieces.forEach((piece) => {
            const digits = String(piece).replace(/\D/g, '');
            if (digits.length >= 7) parsed.push(digits);
        });
    });

    return [...new Set(parsed)];
}

function mapKaggleProductToScanResult(product, note = 'Fonte dataset Kaggle (locale)') {
    const nutriScoreRaw = pickFirstDefined(product, ['nutriscore_grade', 'nutriscore', 'nutri_score_grade'], '?');
    const nutriScore = String(nutriScoreRaw || '?').toUpperCase().replace(/[^A-E]/g, '') || '?';
    const barcode = collectKaggleBarcodes(product)[0] || '';
    const brand = String(pickFirstDefined(product, ['brands', 'brand', 'brand_name', 'brand_owner', 'marca'], '')).trim();
    const category = String(pickFirstDefined(product, ['food_category', 'category', 'categories', 'food_type'], '')).trim();
    const quantity = String(pickFirstDefined(product, ['quantity', 'serving_size', 'package_size'], '')).trim();
    const ingredients = String(pickFirstDefined(product, ['ingredients_text', 'ingredients', 'ingredienti'], '')).trim();
    const imageUrl = String(pickFirstDefined(product, ['image_url', 'image_front_url', 'image_front_small_url'], '')).trim();

    const sodiumMgDirect = toNumberSafe(pickFirstDefined(product, ['sodium_mg_100g', 'sodium_mg']));
    const sodiumG = toNumberSafe(pickFirstDefined(product, ['sodium_100g', 'sodium']));
    const saltG = toNumberSafe(pickFirstDefined(product, ['salt_100g', 'salt']));
    const sodiumMg = sodiumMgDirect > 0
        ? sodiumMgDirect
        : (sodiumG > 0 ? sodiumG * 1000 : (saltG > 0 ? saltG * 393 : 0));

    return {
        alimento: String(pickFirstDefined(product, ['product_name_it', 'product_name', 'food_name', 'name', 'title'], 'Alimento')).trim(),
        descrizione: String(brand || category).trim(),
        brand,
        category,
        quantity,
        ingredients,
        imageUrl,
        barcode,
        per_100g: {
            kcal: toNumberSafe(pickFirstDefined(product, ['energy-kcal_100g', 'energy_kcal_100g', 'kcal_100g', 'kcal', 'energy_kcal', 'calories'])),
            proteine: toNumberSafe(pickFirstDefined(product, ['proteins_100g', 'proteine_100g', 'protein_100g', 'proteins', 'proteine', 'protein_g'])),
            carboidrati: toNumberSafe(pickFirstDefined(product, ['carbohydrates_100g', 'carboidrati_100g', 'carbs_100g', 'carbohydrates', 'carboidrati', 'available_carbohydrates', 'carbs_g'])),
            zuccheri: toNumberSafe(pickFirstDefined(product, ['sugars_100g', 'zuccheri_100g', 'sugars', 'zuccheri', 'soluble_sugars', 'sugar_g'])),
            grassi: toNumberSafe(pickFirstDefined(product, ['fat_100g', 'grassi_100g', 'fats_100g', 'fat', 'grassi', 'lipids', 'fat_g'])),
            grassi_saturi: toNumberSafe(pickFirstDefined(product, ['saturated-fat_100g', 'saturated_fat_100g', 'grassi_saturi_100g', 'saturated_fat', 'grassi_saturi', 'saturated_fat_g'])),
            fibre: toNumberSafe(pickFirstDefined(product, ['fiber_100g', 'fibre_100g', 'fibra_100g', 'fiber', 'fibre', 'fibra', 'total_fiber', 'fiber_g'])),
            sodio_mg: sodiumMg
        },
        nutriscore: nutriScore,
        note,
        source: 'kaggle',
        sourceLabel: 'Dataset locale Kaggle'
    };
}

function mapKaggleProductToFoodEntry(product, fallbackCode = '') {
    const scanResult = mapKaggleProductToScanResult(product, `Fonte dataset Kaggle (barcode ${fallbackCode || 'n/d'})`);
    return {
        nome: scanResult.alimento,
        kcal: Number(scanResult.per_100g.kcal || 0),
        proteine: Number(scanResult.per_100g.proteine || 0),
        carboidrati: Number(scanResult.per_100g.carboidrati || 0),
        grassi: Number(scanResult.per_100g.grassi || 0),
        fe: 0,
        ca: 0,
        b12: 0,
        isOFF: false,
        scanResult
    };
}

async function ensureKaggleBarcodeIndexLoaded() {
    if (kaggleDatasetLoadAttempted) {
        return kaggleBarcodeIndex;
    }

    kaggleDatasetLoadAttempted = true;

    for (const endpoint of KAGGLE_DATASET_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, { cache: 'no-store' });
            if (!response.ok) continue;

            const payload = await response.json();
            const rows = Array.isArray(payload)
                ? payload
                : (Array.isArray(payload?.products) ? payload.products : (Array.isArray(payload?.rows) ? payload.rows : []));

            if (!Array.isArray(rows) || rows.length === 0) {
                continue;
            }

            kaggleProductsCache = rows;
            const index = new Map();

            rows.forEach((row) => {
                if (!row || typeof row !== 'object') return;
                const barcodes = collectKaggleBarcodes(row);
                barcodes.forEach((barcode) => {
                    if (!index.has(barcode)) {
                        index.set(barcode, row);
                    }
                });
            });

            kaggleBarcodeIndex = index;
            console.info(`Kaggle dataset caricato: ${rows.length} record, ${index.size} barcode indicizzati da ${endpoint}`);
            break;
        } catch (error) {
            console.warn('Impossibile caricare dataset Kaggle:', endpoint, error);
        }
    }

    return kaggleBarcodeIndex;
}

async function findKaggleProductByBarcodeCandidates(codeCandidates) {
    const index = await ensureKaggleBarcodeIndexLoaded();
    if (!index || index.size === 0) return null;

    for (const candidate of codeCandidates) {
        const digits = String(candidate || '').replace(/\D/g, '');
        if (!digits) continue;

        if (index.has(digits)) {
            return { product: index.get(digits), code: digits };
        }
    }

    return null;
}

function scoreKaggleProductAgainstOcr(product, normalizedOcr, terms) {
    const name = normalizeOcrText(pickFirstDefined(product, ['product_name_it', 'product_name', 'food_name', 'name', 'title']));
    const brand = normalizeOcrText(pickFirstDefined(product, ['brands', 'brand', 'brand_name', 'brand_owner']));
    if (!name && !brand) return 0;

    let score = 0;
    if (name && normalizedOcr.includes(name)) score += 40;
    if (brand && normalizedOcr.includes(brand)) score += 22;

    const sourceTerms = Array.isArray(terms) ? terms : [];
    sourceTerms.forEach((term) => {
        const t = normalizeOcrText(term);
        if (!t || t.length < 3) return;
        if (name.includes(t)) score += 6;
        if (brand.includes(t)) score += 3;
    });

    if (toNumberSafe(product?.energy_kcal_100g || product?.calories) > 0) score += 2;
    return score;
}

async function findKaggleProductByOcrText(ocrText, terms) {
    await ensureKaggleBarcodeIndexLoaded();
    if (!Array.isArray(kaggleProductsCache) || kaggleProductsCache.length === 0) {
        return null;
    }

    const normalizedOcr = normalizeOcrText(ocrText);
    if (!normalizedOcr) return null;

    let bestProduct = null;
    let bestScore = 0;

    for (const product of kaggleProductsCache) {
        const score = scoreKaggleProductAgainstOcr(product, normalizedOcr, terms);
        if (score > bestScore) {
            bestScore = score;
            bestProduct = product;
        }
    }

    if (bestProduct && bestScore >= 12) {
        return { product: bestProduct, score: bestScore };
    }

    return null;
}

function getBarcodeCandidates(barcode) {
    const raw = String(barcode || '').trim();
    const digitsOnly = raw.replace(/\D/g, '');
    const candidates = new Set();

    if (raw) candidates.add(raw);
    if (digitsOnly) candidates.add(digitsOnly);

    // UPC-A (12) spesso va cercato come EAN-13 con zero iniziale.
    if (digitsOnly.length === 12) {
        candidates.add(`0${digitsOnly}`);
    }

    // A volte un EAN-13 con zero iniziale corrisponde a UPC-A nel DB.
    if (digitsOnly.length === 13 && digitsOnly.startsWith('0')) {
        candidates.add(digitsOnly.slice(1));
    }

    const upcaFromUpce = convertUpceLikeCodeToUpca(digitsOnly);
    if (upcaFromUpce) {
        candidates.add(upcaFromUpce);
        candidates.add(`0${upcaFromUpce}`);
    }

    // Alcuni lettori restituiscono EAN-8 senza check o con prefissi strani.
    if (digitsOnly.length === 7) {
        candidates.add(`0${digitsOnly}`);
    }

    return [...candidates];
}

function computeUpcaCheckDigit(upca11) {
    if (!/^\d{11}$/.test(upca11)) {
        return '';
    }

    let oddSum = 0;
    let evenSum = 0;

    for (let i = 0; i < upca11.length; i += 1) {
        const n = Number(upca11[i]);
        if ((i + 1) % 2 === 1) {
            oddSum += n;
        } else {
            evenSum += n;
        }
    }

    const total = (oddSum * 3) + evenSum;
    const check = (10 - (total % 10)) % 10;
    return String(check);
}

function convertUpceLikeCodeToUpca(digits) {
    // Supporta UPC-E a 6 cifre, 7 cifre (NS+6) o 8 cifre (NS+6+check).
    if (!/^\d{6,8}$/.test(digits)) {
        return '';
    }

    let numberSystem = '0';
    let upceBody = '';
    let checkDigit = '';

    if (digits.length === 8) {
        numberSystem = digits[0];
        upceBody = digits.slice(1, 7);
        checkDigit = digits[7];
    } else if (digits.length === 7) {
        numberSystem = digits[0];
        upceBody = digits.slice(1);
    } else {
        upceBody = digits;
    }

    if (!/^[01]$/.test(numberSystem) || !/^\d{6}$/.test(upceBody)) {
        return '';
    }

    const [d1, d2, d3, d4, d5, d6] = upceBody.split('');
    let upca11 = '';

    if (d6 === '0' || d6 === '1' || d6 === '2') {
        upca11 = `${numberSystem}${d1}${d2}${d6}0000${d3}${d4}${d5}`;
    } else if (d6 === '3') {
        upca11 = `${numberSystem}${d1}${d2}${d3}00000${d4}${d5}`;
    } else if (d6 === '4') {
        upca11 = `${numberSystem}${d1}${d2}${d3}${d4}00000${d5}`;
    } else {
        upca11 = `${numberSystem}${d1}${d2}${d3}${d4}${d5}0000${d6}`;
    }

    if (!/^\d{11}$/.test(upca11)) {
        return '';
    }

    const finalCheck = checkDigit || computeUpcaCheckDigit(upca11);
    return finalCheck ? `${upca11}${finalCheck}` : '';
}

async function fetchOpenFoodFactsProductByCode(code) {
    const safeCode = encodeURIComponent(code);
    const endpoints = [
        `https://it.openfoodfacts.org/api/v0/product/${safeCode}.json`,
        `https://world.openfoodfacts.org/api/v0/product/${safeCode}.json`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            if (data?.status === 1 && data.product) {
                return data.product;
            }
        } catch (error) {
            console.warn('Errore lookup OpenFoodFacts:', endpoint, error);
        }
    }

    return null;
}

async function searchOpenFoodFactsByCodeText(code) {
    const safeCode = encodeURIComponent(code);
    const endpoints = [
        `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${safeCode}&search_simple=1&action=process&json=1&page_size=1`,
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${safeCode}&search_simple=1&action=process&json=1&page_size=1`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            if (Array.isArray(data?.products) && data.products.length > 0) {
                return data.products[0];
            }
        } catch (error) {
            console.warn('Errore text search OpenFoodFacts:', endpoint, error);
        }
    }

    return null;
}

async function gestisciBarcodeScansionato(barcode) {
    const codeCandidates = getBarcodeCandidates(barcode);
    if (codeCandidates.length === 0) {
        alert('Codice a barre non valido.');
        return;
    }

    try {
        let mappedFood = null;
        let usedCode = codeCandidates[0];

        const kaggleMatch = await findKaggleProductByBarcodeCandidates(codeCandidates);
        if (kaggleMatch?.product) {
            usedCode = kaggleMatch.code || usedCode;
            mappedFood = mapKaggleProductToFoodEntry(kaggleMatch.product, usedCode);
        }

        if (!mappedFood) {
            let foundProduct = null;

            for (const candidate of codeCandidates) {
                const product = await fetchOpenFoodFactsProductByCode(candidate);
                if (product) {
                    foundProduct = product;
                    usedCode = candidate;
                    break;
                }

                const searchedProduct = await searchOpenFoodFactsByCodeText(candidate);
                if (searchedProduct) {
                    foundProduct = searchedProduct;
                    usedCode = candidate;
                    break;
                }
            }

            mappedFood = foundProduct ? mapOpenFoodFactsProduct(foundProduct, usedCode) : null;
        }

        if (!mappedFood) {
            console.warn('Nessun match Kaggle/OpenFoodFacts per codici candidati', codeCandidates);
            alert('Prodotto non trovato su dataset Kaggle/OpenFoodFacts. Prova con un altro barcode o usa AI Foto.');
            return;
        }

        selectedFood = mappedFood;
        // Mostra schermata info nutrizionali prodotto
        showProductInfoModal(mappedFood.scanResult || mappedFood);
        // Se vuoi anche mostrare il pannello aggiunta, decommenta le righe sotto:
        // document.getElementById('add-panel').style.display = 'block';
        // document.getElementById('selected-name').innerText = mappedFood.nome;
        // document.getElementById('qty').value = 100;
        // updateSelectedFoodPreview();
    } catch (error) {
        console.error('Errore nel recupero prodotto scannerizzato:', error);
        alert('Errore durante il recupero del prodotto.');
    }
}

async function avviaScanner() {
    // Compatibilita: inoltra al nuovo flusso unico foto+AI+OFF.
    return avviaScansioneIntelligente();
}

async function avviaScansioneIntelligente() {
    if (isFutureDay(activeDate)) {
        alert(getDiaryDateErrorMessage(activeDate));
        return;
    }

    if (barcodeScannerActive) {
        await fermaScanner();
        return;
    }

    if (typeof Html5Qrcode === 'undefined') {
        avviaRiconoscimentoAI();
        return;
    }

    const reader = document.getElementById('reader');
    if (!reader) {
        avviaRiconoscimentoAI();
        return;
    }

    setScannerVisibility(true);
    barcodeScanner = new Html5Qrcode('reader');
    barcodeScanLocked = false;

    try {
        await barcodeScanner.start(
            { facingMode: 'environment' },
            {
                fps: 12,
                qrbox: { width: 280, height: 150 },
                aspectRatio: 1.777,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128
                ]
            },
            async (decodedText) => {
                if (barcodeScanLocked) {
                    return;
                }

                barcodeScanLocked = true;
                await fermaScanner();
                await gestisciBarcodeScansionato(decodedText);
            },
            () => {}
        );

        barcodeScannerActive = true;

        // Fallback automatico: se il codice non viene letto in tempo, passa alla foto prodotto.
        smartScanFallbackTimer = setTimeout(async () => {
            if (!barcodeScannerActive || barcodeScanLocked) {
                return;
            }

            barcodeScanLocked = true;
            await fermaScanner();
            avviaRiconoscimentoAI();
        }, 9000);
    } catch (error) {
        console.error('Errore avvio scanner intelligente:', error);
        await fermaScanner();
        avviaRiconoscimentoAI();
    }
}

function applySmartScanResultToAddPanel(scanResult) {
    if (!scanResult || !scanResult.per_100g) {
        return;
    }

    const nutrients = scanResult.per_100g;
    const mappedFood = {
        nome: String(scanResult.alimento || 'Alimento scansionato').trim(),
        kcal: Number(nutrients.kcal || 0),
        proteine: Number(nutrients.proteine || 0),
        carboidrati: Number(nutrients.carboidrati || 0),
        grassi: Number(nutrients.grassi || 0),
        fe: 0,
        ca: 0,
        b12: 0,
        isOFF: scanResult.source === 'openfoodfacts'
    };

    latestSmartScanFood = mappedFood;
    selectedFood = mappedFood;

    const addPanel = document.getElementById('add-panel');
    if (addPanel) {
        addPanel.style.display = 'block';
    }

    const selectedName = document.getElementById('selected-name');
    if (selectedName) {
        selectedName.innerText = mappedFood.nome;
    }

    const qty = document.getElementById('qty');
    if (qty) {
        qty.value = 100;
    }

    updateSelectedFoodPreview();
}

// --- AI Camera Food Recognition ---

function avviaRiconoscimentoAI() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.capture = 'environment';

    input.onchange = async () => {
        const file = input.files && input.files[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert('Immagine troppo grande (max 4 MB). Riprova con una foto più piccola.');
            return;
        }

        mostraModalScanAI('caricamento');

        try {
            const result = await riconosciProdottoDaFotoGratis(file);
            if (!result) {
                chiudiModalScanAI();
                alert('Prodotto non trovato. Prova a inquadrare meglio etichetta o barcode.');
                return;
            }

            applySmartScanResultToAddPanel(result);
            mostraModalScanAI('risultato', result);
        } catch (err) {
            console.error('Errore scansione foto gratuita:', err);
            chiudiModalScanAI();
            alert('Errore durante la scansione foto. Riprova.');
        }
    };

    input.click();
}

function normalizeOcrText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildSearchTermsFromOcr(ocrText) {
    const lines = String(ocrText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length >= 3);

    const cleanLines = lines
        .map((line) => normalizeOcrText(line))
        .filter((line) => line.length >= 4 && !/^\d+$/.test(line));

    const tokens = normalizeOcrText(ocrText)
        .split(' ')
        .filter((token) => token.length >= 4 && !/^\d+$/.test(token));

    const unique = [...new Set([...cleanLines.slice(0, 8), ...tokens.slice(0, 8)])];
    return unique.slice(0, 8);
}

function mapOpenFoodFactsScanResult(product, note = 'Fonte OpenFoodFacts') {
    const nutriments = product?.nutriments || {};
    const barcode = String(product?.code || '').trim();
    const brand = String(product?.brands || '').trim();
    const category = String(product?.categories_tags?.[0] || product?.categories || '').replace(/^en:/i, '').trim();
    const quantity = String(product?.quantity || '').trim();
    const ingredients = String(product?.ingredients_text_it || product?.ingredients_text || '').trim();
    const imageUrl = getProductImageUrl(product);

    const energyKcal = Number(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0);
    const energyKj = Number(nutriments.energy_100g || nutriments.energy || 0);
    const kcal = energyKcal > 0 ? energyKcal : (energyKj > 0 ? energyKj / 4.184 : 0);

    const sodiumFromSalt = Number(nutriments.salt_100g || 0) * 393;
    const sodiumDirect = Number(nutriments.sodium_100g || 0) * 1000;

    return {
        alimento: String(product.product_name_it || product.product_name || 'Alimento').trim(),
        descrizione: brand,
        brand,
        category,
        quantity,
        ingredients,
        imageUrl,
        barcode,
        per_100g: {
            kcal: Number(kcal || 0),
            proteine: Number(nutriments.proteins_100g || 0),
            carboidrati: Number(nutriments.carbohydrates_100g || 0),
            zuccheri: Number(nutriments.sugars_100g || 0),
            grassi: Number(nutriments.fat_100g || 0),
            grassi_saturi: Number(nutriments['saturated-fat_100g'] || 0),
            fibre: Number(nutriments.fiber_100g || 0),
            sodio_mg: Number((sodiumDirect > 0 ? sodiumDirect : sodiumFromSalt) || 0)
        },
        nutriscore: String(product.nutriscore_grade || '?').toUpperCase().replace(/[^A-E]/g, '') || '?',
        note,
        source: 'openfoodfacts',
        sourceLabel: 'OpenFoodFacts'
    };
}

function scoreProductAgainstOcr(product, normalizedText) {
    const name = normalizeOcrText(product?.product_name_it || product?.product_name);
    const brand = normalizeOcrText(product?.brands);
    if (!name && !brand) return 0;

    let score = 0;

    if (name && normalizedText.includes(name)) score += 40;
    if (brand && normalizedText.includes(brand)) score += 30;

    const nameTokens = name.split(' ').filter((token) => token.length >= 4);
    nameTokens.slice(0, 6).forEach((token) => {
        if (normalizedText.includes(token)) score += 6;
    });

    if (product?.nutriments) score += 5;
    if (product?.nutriscore_grade) score += 4;

    return score;
}

function getProductImageUrl(product) {
    return String(
        product?.image_front_small_url
        || product?.image_small_url
        || product?.image_front_url
        || product?.image_url
        || ''
    ).trim();
}

async function loadImageForHash(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function computeImageAHashFromElement(imageEl) {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '';

    ctx.drawImage(imageEl, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;

    const grays = [];
    for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114);
        grays.push(gray);
    }

    const avg = grays.reduce((sum, value) => sum + value, 0) / grays.length;
    return grays.map((value) => (value >= avg ? '1' : '0')).join('');
}

async function computeImageAHashFromFile(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return '';

        ctx.drawImage(bitmap, 0, 0, 8, 8);
        const data = ctx.getImageData(0, 0, 8, 8).data;

        const grays = [];
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114);
            grays.push(gray);
        }

        const avg = grays.reduce((sum, value) => sum + value, 0) / grays.length;
        return grays.map((value) => (value >= avg ? '1' : '0')).join('');
    } catch (error) {
        console.warn('Impossibile calcolare hash immagine file:', error);
        return '';
    }
}

function hammingDistance(hashA, hashB) {
    if (!hashA || !hashB || hashA.length !== hashB.length) return 64;
    let diff = 0;
    for (let i = 0; i < hashA.length; i += 1) {
        if (hashA[i] !== hashB[i]) diff += 1;
    }
    return diff;
}

async function scoreProductWithVisualPackaging(product, fileHash) {
    const imageUrl = getProductImageUrl(product);
    if (!imageUrl || !fileHash) return 0;

    try {
        const imageEl = await loadImageForHash(imageUrl);
        const productHash = await computeImageAHashFromElement(imageEl);
        if (!productHash) return 0;

        const distance = hammingDistance(fileHash, productHash);
        // 0 diff -> 30 punti, 32 diff -> 0 punti
        return Math.max(0, 30 - (distance * 0.94));
    } catch {
        return 0;
    }
}

async function searchOpenFoodFactsByText(term) {
    const query = encodeURIComponent(term);
    const fields = encodeURIComponent('code,product_name,product_name_it,brands,nutriscore_grade,nutriments,image_front_small_url,image_small_url,image_front_url,image_url');
    const endpoints = [
        `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=6&fields=${fields}`,
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=6&fields=${fields}`
    ];

    const found = [];
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) continue;
            const data = await response.json();
            if (Array.isArray(data?.products)) {
                found.push(...data.products);
            }
        } catch (error) {
            console.warn('Errore ricerca OFF da OCR:', endpoint, error);
        }
    }

    const deduped = new Map();
    found.forEach((product) => {
        const code = String(product?.code || '').trim();
        const key = code || `${product?.product_name || ''}|${product?.brands || ''}`;
        if (!deduped.has(key)) deduped.set(key, product);
    });

    return [...deduped.values()];
}

function extractBarcodeFromOcrText(ocrText) {
    const matches = String(ocrText || '').match(/\b\d{8,14}\b/g) || [];
    if (matches.length === 0) return '';
    return matches.sort((a, b) => b.length - a.length)[0];
}

async function riconosciProdottoDaFotoGratis(file) {
    if (typeof Tesseract === 'undefined') {
        throw new Error('Tesseract non disponibile');
    }

    const ocr = await Tesseract.recognize(file, 'ita+eng');
    const ocrText = String(ocr?.data?.text || '').trim();
    const normalizedOcr = normalizeOcrText(ocrText);
    const terms = buildSearchTermsFromOcr(ocrText);

    const barcodeFromText = extractBarcodeFromOcrText(ocrText);
    if (barcodeFromText) {
        const barcodeCandidates = getBarcodeCandidates(barcodeFromText);
        const kaggleMatch = await findKaggleProductByBarcodeCandidates(barcodeCandidates);
        if (kaggleMatch?.product) {
            return mapKaggleProductToScanResult(kaggleMatch.product, `Fonte dataset Kaggle (barcode ${kaggleMatch.code || barcodeFromText})`);
        }

        const byBarcode = await fetchOpenFoodFactsProductByCode(barcodeFromText);
        if (byBarcode) {
            return mapOpenFoodFactsScanResult(byBarcode, `Fonte OpenFoodFacts (barcode ${barcodeFromText})`);
        }
    }

    const kaggleTextMatch = await findKaggleProductByOcrText(ocrText, terms);
    if (kaggleTextMatch?.product) {
        return mapKaggleProductToScanResult(kaggleTextMatch.product, 'Fonte dataset Kaggle (match OCR nome prodotto)');
    }

    const candidates = [];
    const fileHash = await computeImageAHashFromFile(file);

    for (const term of terms) {
        const products = await searchOpenFoodFactsByText(term);
        candidates.push(...products);
        if (candidates.length >= 24) break;
    }

    let bestProduct = null;
    let bestScore = 0;
    const scoredCandidates = [];

    for (const product of candidates) {
        const textScore = scoreProductAgainstOcr(product, normalizedOcr);
        const visualScore = await scoreProductWithVisualPackaging(product, fileHash);
        const score = textScore + visualScore;
        scoredCandidates.push({ product, score, textScore, visualScore });

        if (score > bestScore) {
            bestScore = score;
            bestProduct = product;
        }
    }

    if (!bestProduct && scoredCandidates.length > 0) {
        scoredCandidates.sort((a, b) => b.score - a.score);
        bestProduct = scoredCandidates[0].product;
        bestScore = scoredCandidates[0].score;
    }

    if (bestProduct && bestScore >= 14) {
        return mapOpenFoodFactsScanResult(bestProduct, 'Fonte OpenFoodFacts (match foto confezione + OCR)');
    }

    return null;
}

function mostraModalScanAI(stato, dati) {
    let modal = document.getElementById('scan-ai-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'scan-ai-modal';
        modal.className = 'scan-ai-overlay';
        modal.innerHTML = '<div class="scan-ai-box" id="scan-ai-box"></div>';
        modal.addEventListener('click', (e) => {
            if (e.target === modal) chiudiModalScanAI();
        });
        document.body.appendChild(modal);
    }

    const box = document.getElementById('scan-ai-box');

    if (stato === 'caricamento') {
        box.innerHTML =
            '<div class="scan-ai-loading">' +
            '<span class="skeleton-block shimmer-skeleton tall"></span>' +
            '<span class="skeleton-block shimmer-skeleton"></span>' +
            '<span class="skeleton-block shimmer-skeleton medium"></span>' +
            '<span class="skeleton-block shimmer-skeleton short"></span>' +
            '<span class="skeleton-block shimmer-skeleton"></span>' +
            '</div>';
        modal.style.display = 'flex';
        return;
    }

    if (stato === 'risultato' && dati) {
        const ns = String(dati.nutriscore || '?').toUpperCase();
        const p = dati.per_100g || {};

        box.innerHTML =
            '<button class="scan-ai-close" onclick="chiudiModalScanAI()">✕</button>' +
            '<h3 class="scan-ai-title">' + escapeHtml(dati.alimento || 'Alimento') + '</h3>' +
            (dati.descrizione ? '<p class="scan-ai-desc">' + escapeHtml(dati.descrizione) + '</p>' : '') +
            '<div class="nutriscore-wrap">' +
            '<span class="nutriscore-label">NutriScore</span>' +
            '<span class="nutriscore-badge nutriscore-' + ns.toLowerCase() + '">' + ns + '</span>' +
            '</div>' +
            '<table class="scan-ai-table">' +
            '<thead><tr><th>Nutriente</th><th>per 100 g</th></tr></thead>' +
            '<tbody>' +
            '<tr><td>Energia</td><td>' + Math.round(p.kcal || 0) + ' kcal</td></tr>' +
            '<tr><td>Proteine</td><td>' + (+p.proteine || 0).toFixed(1) + ' g</td></tr>' +
            '<tr><td>Carboidrati</td><td>' + (+p.carboidrati || 0).toFixed(1) + ' g</td></tr>' +
            '<tr class="indent-row"><td>&nbsp;&nbsp;di cui zuccheri</td><td>' + (+p.zuccheri || 0).toFixed(1) + ' g</td></tr>' +
            '<tr><td>Grassi</td><td>' + (+p.grassi || 0).toFixed(1) + ' g</td></tr>' +
            '<tr class="indent-row"><td>&nbsp;&nbsp;di cui saturi</td><td>' + (+p.grassi_saturi || 0).toFixed(1) + ' g</td></tr>' +
            '<tr><td>Fibre</td><td>' + (+p.fibre || 0).toFixed(1) + ' g</td></tr>' +
            '<tr><td>Sodio</td><td>' + Math.round(p.sodio_mg || 0) + ' mg</td></tr>' +
            '</tbody></table>' +
            (dati.note ? '<p class="scan-ai-note">ℹ️ ' + escapeHtml(dati.note) + '</p>' : '') +
            '<p class="scan-ai-disclaimer">' +
            (dati.source === 'kaggle'
                ? 'Valori da dataset Kaggle locale.'
                : 'Valori da OpenFoodFacts quando disponibili.') +
            '</p>';

        modal.style.display = 'flex';
    }
}

function chiudiModalScanAI() {
    const modal = document.getElementById('scan-ai-modal');
    if (modal) modal.style.display = 'none';
}
/* ================================================================
   2026 UI Utilities � Typewriter � Shimmer � Dark Mode Toggle
   ================================================================ */

/**
 * Types text into an element character-by-character (typewriter effect).
 * @param {HTMLElement} element  Target DOM element (textContent is set)
 * @param {string}      text     Text to animate
 * @param {number}      speed    Milliseconds per character (default 28)
 * @returns {Promise<void>}      Resolves when typing is complete
 */
function typeWriterEffect(element, text, speed = 28) {
    return new Promise(resolve => {
        element.textContent = '';
        let i = 0;
        const tick = () => {
            if (i >= text.length) { resolve(); return; }
            element.textContent += text[i++];
            setTimeout(tick, speed);
        };
        tick();
    });
}

/**
 * Replaces a container's children with shimmering skeleton rows.
 * The original innerHTML is stored in dataset.originalContent.
 * Call hideShimmerSkeleton() to restore it.
 * @param {HTMLElement} container
 * @param {number}      rows  Number of skeleton lines (default 3)
 */
function showShimmerSkeleton(container, rows = 3) {
    if (!container) return;
    container.dataset.originalContent = container.innerHTML;
    const widths = ['100%', '80%', '60%', '90%', '50%'];
    const heights = ['48px', '14px', '14px', '14px', '14px'];
    container.innerHTML = Array.from({ length: rows }, (_, i) =>
        `<span class="skeleton-block shimmer-skeleton" style="width:${widths[i % widths.length]};height:${heights[i % heights.length]};margin-bottom:12px;display:block;"></span>`
    ).join('');
}

/**
 * Restores content previously replaced by showShimmerSkeleton().
 * @param {HTMLElement} container
 */
function hideShimmerSkeleton(container) {
    if (!container || container.dataset.originalContent === undefined) return;
    container.innerHTML = container.dataset.originalContent;
    delete container.dataset.originalContent;
}

/**
 * Toggles between light and dark theme.
 * Persists preference to localStorage under key 'nv_theme'.
 */
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('nv_theme', next);

    // Flip icon on the mini profile button
    const miniBtn = document.getElementById('mini-theme-toggle');
    if (miniBtn) {
        const icon = miniBtn.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
            if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [icon] });
        }
    }
}
