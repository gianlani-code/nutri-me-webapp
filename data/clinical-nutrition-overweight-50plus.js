(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.clinicalNutritionGuidance = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    return {
        insulinResistance: {
            priority: 120,
            profileLabel: 'Insulino-resistenza dichiarata',
            criteria: {
                pathologySignals: ['insulino', 'insulino-resist', 'resistenza insulin', 'insulin resistance', 'iperinsulin', 'homa'],
                imcMin: 0,
                targetCaloriesMin: 1200,
                targetCaloriesMax: 2600,
                goalSignals: ['dimagr', 'manten', 'ricompos']
            },
            macroSplit: '25% proteine, 30% grassi, 45% carboidrati con distribuzione piu regolare dei carboidrati',
            weightNote: 'I pesi si leggono a crudo e le quote glucidiche vanno distribuite con ordine, evitando grandi carichi concentrati nello stesso pasto.',
            proteinRotation: 'Distribuisci proteine e fibre in tutti i pasti principali, ruotando pesce, legumi, uova e carni magre con porzioni leggibili.',
            avoidFoods: 'Limitare bevande zuccherate, succhi, dolci frequenti, pane bianco in grandi quantita, snack ultraprocessati e pasti sbilanciati solo glucidici.',
            hungerStrategy: 'Per ridurre fame reattiva e oscillazioni energetiche, abbina sempre carboidrati a proteine, fibre e grassi misurati; verdure e legumi aiutano molto.',
            recipeTail: 'Per insulino-resistenza dichiarata il piatto deve ridurre i picchi inutili: carboidrati chiari ma non dominanti, fibra abbondante, proteina ben presente e condimenti misurati.',
            promptLines: [
                'se il paziente dichiara insulino-resistenza, applica una logica nutrizionale a carico glicemico piu controllato senza rendere il piano punitivo',
                'distribuisci i carboidrati con ordine nella giornata e preferisci pasti misti con proteine, fibre e grassi buoni ben misurati',
                'evita proposte basate su succhi, colazioni dolci isolate, grandi porzioni di pane bianco o snack molto raffinati da soli',
                'privilegia cereali integrali o quote amidacee leggibili, legumi, yogurt naturale, frutta intera e molte verdure',
                'negli spuntini usa strutture stabili sulla fame: frutta con grassi buoni, yogurt o kefir, oppure opzioni salate leggere',
                'a pranzo evita carichi glucidici troppo concentrati senza proteine o fibra di supporto',
                'a cena usa proteina chiara, verdure abbondanti e una quota glucidica semplice ma non eccessiva',
                'mantieni linguaggio pratico e molto aderente, con indicazioni facili da ripetere nella vita reale'
            ],
            breakfastOptions: [
                {
                    title: 'Yogurt greco leggero con frutta e semi',
                    items: ['170 g yogurt greco leggero', '120 g frutta intera', '10 g semi di chia o lino', '20 g fiocchi di avena se serve una quota amidacea'],
                    notes: ['Colazione piu stabile sulla fame', 'Evita una base solo zuccherina'],
                    macros: { kcal: 290, protein: 21, carbs: 24, fat: 10 }
                },
                {
                    title: 'Pane integrale e ricotta magra con frutta',
                    items: ['50 g pane integrale', '70 g ricotta magra o spalmabile light', '1 piccolo frutto intero'],
                    notes: ['Schema semplice e molto pratico', 'Distribuisce meglio carboidrati e proteine'],
                    macros: { kcal: 310, protein: 18, carbs: 30, fat: 10 }
                },
                {
                    title: 'Colazione salata leggera',
                    items: ['2 uova', '1 fetta pane integrale', 'pomodori o cetrioli a lato'],
                    notes: ['Utile se la mattina il dolce aumenta fame o sonnolenza', 'Opzione lineare e molto saziante'],
                    macros: { kcal: 300, protein: 20, carbs: 16, fat: 15 }
                }
            ],
            snackOptions: [
                {
                    title: 'Frutta intera e mandorle',
                    items: ['1 frutto medio', '10 g mandorle'],
                    notes: ['Riduce meglio la fame rispetto al frutto da solo'],
                    macros: { kcal: 125, protein: 3, carbs: 16, fat: 6 }
                },
                {
                    title: 'Kefir o yogurt naturale',
                    items: ['125-150 g kefir o yogurt naturale senza zuccheri aggiunti'],
                    notes: ['Piccola quota proteica facile da inserire'],
                    macros: { kcal: 85, protein: 8, carbs: 7, fat: 2 }
                },
                {
                    title: 'Crudite e hummus',
                    items: ['verdure crude a piacere', '30 g hummus'],
                    notes: ['Opzione salata utile contro fame nervosa o cali pomeridiani'],
                    macros: { kcal: 100, protein: 4, carbs: 10, fat: 5 }
                }
            ],
            dailyPattern: {
                breakfast: {
                    title: 'Yogurt greco leggero con frutta e semi',
                    whyItFits: 'Apre la giornata con una quota proteica vera e una gestione piu stabile dei carboidrati.',
                    items: ['170 g yogurt greco leggero', '1 frutto intero', '10 g semi di chia o lino', '20 g avena se utile'],
                    kcal: 290,
                    protein: 21,
                    carbs: 24,
                    fat: 10
                },
                morningSnack: {
                    title: 'Frutta intera e mandorle',
                    whyItFits: 'Aiuta a limitare la fame reattiva della tarda mattina.',
                    items: ['1 frutto medio', '10 g mandorle'],
                    kcal: 125,
                    protein: 3,
                    carbs: 16,
                    fat: 6
                },
                lunch: {
                    titleWorkday: 'Pranzo ordinato con carboidrato misurato, proteina e verdure',
                    titleFreeDay: 'Pranzo completo a carico glicemico piu controllato',
                    whyWorkday: 'Evita il pranzo solo glucidico e migliora stabilita energetica nel pomeriggio.',
                    whyFreeDay: 'Resta appagante ma protegge da sonnolenza e fame di rimbalzo.',
                    items: ['60-70 g cereale o pasta preferibilmente integrale', '120-150 g proteina magra oppure 120 g legumi cotti', 'verdure abbondanti', '10-15 g olio EVO a crudo'],
                    carbs: 45,
                    fat: 18
                },
                afternoonSnack: {
                    title: 'Kefir o yogurt naturale',
                    whyItFits: 'Aggiunge una quota proteica semplice prima della cena.',
                    items: ['125-150 g kefir o yogurt naturale senza zuccheri aggiunti'],
                    kcal: 85,
                    protein: 8,
                    carbs: 7,
                    fat: 2
                },
                dinner: {
                    title: 'Cena con proteina chiara, verdure e quota amidacea misurata',
                    whyItFits: 'Chiude la giornata con molta sazieta e una migliore leggibilita del carico glucidico.',
                    items: ['150 g pesce oppure 120-150 g pollo o tacchino oppure 2 uova oppure 130 g tofu', 'verdure abbondanti', '40 g pane integrale o semplice', '10 g olio EVO a crudo'],
                    carbs: 24,
                    fat: 16
                },
                notes: [
                    'La priorita e rendere i pasti misti, leggibili e ripetibili.',
                    'Frutta intera meglio dei succhi; pane e dolci da soli peggiorano piu facilmente fame e oscillazioni.',
                    'Il piano deve ridurre picchi inutili senza trasformarsi in una dieta punitiva o estrema.'
                ]
            },
            weeklyPattern: {
                title: 'Settimana alimentare per insulino-resistenza dichiarata',
                rationale: 'Settimana costruita per migliorare stabilita energetica, controllo della fame e distribuzione dei carboidrati, mantenendo il piano pratico e sostenibile.',
                notes: [
                    'La ripetizione intelligente e un vantaggio, non un limite.',
                    'I pasti principali devono avere sempre una quota proteica chiara e verdure presenti.',
                    'Il controllo glicemico pratico nasce dalla struttura del pasto, non da eliminazioni casuali.'
                ],
                days: [
                    { day: 'Lunedi', focus: 'ripartenza stabile senza cali', lunch: 'cereale integrale + proteina magra', dinnerProtein: 'pesce magro' },
                    { day: 'Martedi', focus: 'gestione fame di meta giornata', lunch: 'legumi + verdure + quota amidacea misurata', dinnerProtein: 'pollo o tacchino' },
                    { day: 'Mercoledi', focus: 'continuita e carico glicemico ordinato', lunch: 'insalata completa con cereale e proteina', dinnerProtein: 'uova o tofu' },
                    { day: 'Giovedi', focus: 'energia piu lineare nel pomeriggio', lunch: 'pasta integrale con verdure e legumi', dinnerProtein: 'pesce semigrasso' },
                    { day: 'Venerdi', focus: 'chiusura lavorativa senza rimbalzi di fame', lunch: 'riso integrale con verdure e proteina', dinnerProtein: 'legumi' },
                    { day: 'Sabato', focus: 'socialita gestita con struttura', lunch: 'piatto unico bilanciato', dinnerProtein: 'carne bianca magra' },
                    { day: 'Domenica', focus: 'appagamento ma ordine', lunch: 'pranzo curato con verdure e carboidrato misurato', dinnerProtein: 'pesce oppure uova' }
                ]
            }
        },
        menopauseOverweight: {
            priority: 90,
            profileLabel: 'Donna in menopausa con sovrappeso',
            criteria: {
                sexSignals: ['f', 'femmina', 'female', 'donna'],
                ageMin: 45,
                ageMax: 67,
                imcMin: 25,
                targetCaloriesMin: 1400,
                targetCaloriesMax: 1800,
                goalSignals: ['dimagr', 'manten', 'ricompos']
            },
            macroSplit: '25% proteine, 30% grassi, 45% carboidrati',
            weightNote: 'I pesi si leggono a crudo e al netto degli scarti; la quota amidacea va distribuita con ordine nella giornata.',
            proteinRotation: 'Ruota proteine magre e legumi durante la settimana, con pesce frequente, carne rossa rara e latticini solo ben misurati.',
            avoidFoods: 'Limitare alcol, dolci concentrati, snack ultraprocessati, salumi frequenti e grandi carichi di carboidrati tutti nello stesso pasto.',
            hungerStrategy: 'Per fame e sazieta, usa verdure voluminose, una buona quota proteica nei pasti principali e fibre distribuite senza saltare gli spuntini se servono.',
            recipeTail: 'Per un profilo femminile in menopausa con sovrappeso, il piatto punta su proteine distribuite bene, carboidrati leggibili, fibre abbondanti e densita energetica controllata senza diventare punitivo.',
            promptLines: [
                'se il profilo e compatibile con donna in menopausa con sovrappeso, usa un approccio semplice, aderente e con densita energetica controllata',
                'mantieni una logica intorno a 1500-1700 kcal se coerente con il profilo, con ripartizione orientativa circa 25% proteine, 30% grassi, 45% carboidrati',
                'privilegia proteine distribuite meglio nella giornata, fibre, verdure abbondanti e carboidrati chiari nelle quantita',
                'colazione con una quota proteica reale come yogurt greco leggero, skyr, latte ad alta quota proteica o ricotta magra ben dosata',
                'spuntini piccoli ma funzionali: frutta, yogurt naturale, kefir leggero, oppure frutta con una minima quota di grassi buoni se la fame e alta',
                'pranzo con cereale integrale o pasta in porzione ordinata, verdure e una quota proteica o legumi, evitando carichi glicemici inutilmente concentrati',
                'cena con proteina magra o legumi, molte verdure, pane semplice misurato e condimenti dichiarati',
                'considera alimenti utili per calcio e qualita proteica se tollerati, ma senza trasformare il piano in uno schema rigido o medicalizzato'
            ],
            breakfastOptions: [
                {
                    title: 'Skyr o yogurt greco leggero con avena e frutti di bosco',
                    items: ['170 g skyr oppure yogurt greco 0-2%', '30 g fiocchi di avena', '120 g frutti di bosco o altra frutta fresca', 'cannella o cacao amaro se graditi'],
                    notes: ['Colazione piu proteica e molto saziante', 'Aiuta a distribuire meglio le proteine fin dal mattino'],
                    macros: { kcal: 300, protein: 24, carbs: 31, fat: 6 }
                },
                {
                    title: 'Latte proteico, pane integrale e ricotta magra',
                    items: ['200 ml latte ad alta quota proteica o latte parzialmente scremato', '50 g pane integrale', '60 g ricotta magra o spalmabile light'],
                    notes: ['Schema domestico semplice', 'Buon compromesso tra praticita e controllo della fame'],
                    macros: { kcal: 320, protein: 23, carbs: 30, fat: 10 }
                },
                {
                    title: 'Porridge proteico leggero',
                    items: ['35 g avena', '150 ml latte o bevanda proteica senza zuccheri aggiunti', '100 g yogurt bianco magro', '1 kiwi o 1 piccolo frutto'],
                    notes: ['Alternativa calda e ordinata', 'Buona nei giorni in cui serve piu sazieta'],
                    macros: { kcal: 315, protein: 22, carbs: 36, fat: 7 }
                }
            ],
            snackOptions: [
                {
                    title: 'Frutta fresca e pochi grassi buoni',
                    items: ['150 g frutta fresca', '10 g mandorle o noci'],
                    notes: ['Piacevole e piu stabile sulla fame', 'Utile quando lo spuntino solo glucidico non basta'],
                    macros: { kcal: 120, protein: 2, carbs: 16, fat: 6 }
                },
                {
                    title: 'Yogurt naturale o kefir leggero',
                    items: ['125-150 g yogurt bianco naturale o kefir leggero'],
                    notes: ['Spuntino molto semplice', 'Aggiunge una piccola quota proteica senza appesantire'],
                    macros: { kcal: 85, protein: 8, carbs: 7, fat: 2 }
                },
                {
                    title: 'Verdure crude e hummus leggero',
                    items: ['crudite a piacere', '30 g hummus semplice'],
                    notes: ['Opzione salata', 'Funziona se nel pomeriggio c e piu fame nervosa che fame reale'],
                    macros: { kcal: 100, protein: 4, carbs: 10, fat: 5 }
                }
            ],
            dailyPattern: {
                breakfast: {
                    title: 'Skyr o yogurt greco leggero con avena e frutta',
                    whyItFits: 'Alza la quota proteica della colazione e rende la mattina piu stabile sulla fame.',
                    items: ['170 g skyr oppure yogurt greco leggero', '30 g avena', '1 porzione di frutta fresca'],
                    kcal: 300,
                    protein: 24,
                    carbs: 31,
                    fat: 6
                },
                morningSnack: {
                    title: 'Frutta fresca e 10 g frutta secca',
                    whyItFits: 'Spuntino breve ma piu robusto del solo frutto quando la fame e piu reattiva.',
                    items: ['150 g frutta fresca', '10 g mandorle o noci'],
                    kcal: 120,
                    protein: 2,
                    carbs: 16,
                    fat: 6
                },
                lunch: {
                    titleWorkday: 'Pranzo bilanciato con cereale integrale e quota proteica chiara',
                    titleFreeDay: 'Pranzo completo con base amidacea ordinata e verdure abbondanti',
                    whyWorkday: 'Evita i pasti sbilanciati da fame e aiuta a mantenere lucidita e continuita.',
                    whyFreeDay: 'Resta appagante ma tiene sotto controllo la densita energetica del pasto.',
                    items: ['70-80 g pasta o cereale preferibilmente integrale', '120 g legumi cotti oppure 120-150 g proteina magra', 'verdure abbondanti', '10-15 g olio EVO a crudo'],
                    carbs: 55,
                    fat: 18
                },
                afternoonSnack: {
                    title: 'Yogurt naturale o kefir leggero',
                    whyItFits: 'Aggiunge una seconda piccola quota proteica prima della cena e smorza la fame di rientro.',
                    items: ['125-150 g yogurt bianco naturale o kefir leggero'],
                    kcal: 85,
                    protein: 8,
                    carbs: 7,
                    fat: 2
                },
                dinner: {
                    title: 'Cena con proteina magra, verdure e pane semplice',
                    whyItFits: 'Chiude la giornata con molta sazieta e meno variabilita glicemica rispetto a una cena troppo amidacea.',
                    items: ['150 g pesce oppure 120-150 g pollo o tacchino oppure 2 uova oppure 130 g tofu', 'verdure abbondanti cotte o crude', '40-50 g pane semplice o integrale', '10 g olio EVO a crudo'],
                    carbs: 28,
                    fat: 16
                },
                notes: [
                    'Distribuire proteine e fibre in modo piu uniforme puo aiutare aderenza e sazieta nella fase peri o post-menopausale.',
                    'Le fonti di calcio possono comparire in modo intelligente e ben dosato se tollerate.',
                    'L obiettivo e rendere i pasti stabili e ripetibili, non perfetti.'
                ]
            },
            weeklyPattern: {
                title: 'Settimana alimentare per donna in menopausa con sovrappeso',
                rationale: 'Settimana costruita per migliorare sazieta, ordine dei carboidrati e distribuzione proteica, mantenendo il piano realistico e sostenibile.',
                notes: [
                    'Le colazioni possono ripetersi se aiutano continuita e gestione della fame.',
                    'Non serve cambiare tutto ogni giorno: la qualita della ripetizione conta.',
                    'La priorita resta la stabilita del comportamento alimentare piu che la complessita delle ricette.'
                ],
                days: [
                    { day: 'Lunedi', focus: 'ripartenza con alta sazieta', lunch: 'cereale integrale + legumi', dinnerProtein: 'pesce magro' },
                    { day: 'Martedi', focus: 'energia stabile in giornata lavorativa', lunch: 'pasta con verdure e proteina magra', dinnerProtein: 'pollo o tacchino' },
                    { day: 'Mercoledi', focus: 'controllo della fame pomeridiana', lunch: 'insalata completa con cereale e legumi', dinnerProtein: 'uova o tofu' },
                    { day: 'Giovedi', focus: 'continuita metabolica senza rigidita', lunch: 'farro o riso integrale con verdure', dinnerProtein: 'pesce semigrasso' },
                    { day: 'Venerdi', focus: 'chiusura ordinata della settimana attiva', lunch: 'pasta integrale con legumi', dinnerProtein: 'legumi' },
                    { day: 'Sabato', focus: 'giorno piu sociale ma controllato', lunch: 'piatto unico bilanciato', dinnerProtein: 'carne bianca magra' },
                    { day: 'Domenica', focus: 'appagamento senza eccessi', lunch: 'pranzo curato con verdure abbondanti', dinnerProtein: 'pesce oppure latticino magro ben misurato' }
                ]
            }
        },
        overweight50Plus: {
            priority: 50,
            profileLabel: 'Adulto 50+ in sovrappeso',
            criteria: {
                ageMin: 50,
                ageMax: 70,
                imcMin: 27,
                targetCaloriesMin: 1450,
                targetCaloriesMax: 1750,
                goalSignals: ['dimagr', 'manten']
            },
            macroSplit: '20% proteine, 30% grassi, 50% carboidrati',
            weightNote: 'I pesi vanno letti a crudo e al netto degli scarti.',
            proteinRotation: 'Rotazione consigliata: circa 3 volte pesce, 3 volte legumi, 3 volte carne con carne rossa massimo 1 volta; uova, formaggi e affettati magri solo occasionalmente.',
            avoidFoods: 'Limitare fritture, intingoli, carni grasse, insaccati, dolci frequenti, bibite zuccherate, liquori e aperitivi.',
            hungerStrategy: 'Per contenere la fame, aumentare il volume con verdure crude o cotte a basso impatto energetico.',
            recipeTail: 'Per un profilo adulto 50+ in sovrappeso con deficit moderato, il piatto privilegia verdure, condimenti misurati, olio EVO preferibilmente a crudo e una struttura anti-fame ma non pesante.',
            promptLines: [
                'se il profilo e compatibile con adulto 50+ in sovrappeso, usa una logica semplice, moderatamente ipocalorica e ad alta aderenza',
                'usa come riferimento un assetto vicino a 1600 kcal con macro circa 20% proteine, 30% grassi, 50% carboidrati, adattandolo al profilo reale',
                'colazione pratica: latte parzialmente scremato o equivalente leggero, 4 fette biscottate o quota amidacea simile, 30 g marmellata o composta',
                'spuntini di base soprattutto con frutta: dose standard 200 g, banana circa 120 g, cocomero circa 500 g',
                'pranzo con 80 g pasta, riso, farro o orzo e condimenti vegetali, oppure 40 g pasta + 50 g legumi secchi + piccolo supporto di parmigiano, con verdure e 20 g olio EVO a crudo',
                'cena con brodo o passato vegetale se utile, secondo piatto magro o legumi, verdure, 10 g olio EVO a crudo e 60 g pane semplice',
                'ruota le proteine nella settimana: circa 3 volte pesce, 3 legumi, 3 carne con carne rossa massimo 1; uova, formaggi e affettati magri solo occasionali',
                'evita fritture, intingoli, carni grasse, insaccati, dolci frequenti, bibite zuccherate, liquori e aperitivi; per la fame usa verdure crude o cotte'
            ],
            breakfastOptions: [
                {
                    title: 'Latte parzialmente scremato, fette biscottate e marmellata',
                    items: ['150 ml latte parzialmente scremato', '4 fette biscottate', '30 g marmellata', 'caffe, te o orzo senza zuccheri aggiunti se graditi'],
                    notes: ['Schema lineare e ripetibile', 'Utile quando serve aderenza e controllo delle porzioni'],
                    macros: { kcal: 280, protein: 11, carbs: 45, fat: 6 }
                },
                {
                    title: 'Yogurt bianco, frutta e quota amidacea semplice',
                    items: ['125-150 g yogurt bianco magro o greco leggero', '1 porzione di frutta', '3-4 fette biscottate semplici'],
                    notes: ['Alternativa pratica', 'Mantiene una logica clinico-pratica senza irrigidire lo schema'],
                    macros: { kcal: 300, protein: 14, carbs: 40, fat: 7 }
                },
                {
                    title: 'Porridge leggero con frutta',
                    items: ['35-40 g fiocchi di avena', '150 ml latte parzialmente scremato o bevanda equivalente', '1 porzione di frutta'],
                    notes: ['Piacevole nelle giornate fredde', 'Va bene quando serve una colazione leggermente piu saziante'],
                    macros: { kcal: 320, protein: 15, carbs: 43, fat: 8 }
                }
            ],
            snackOptions: [
                {
                    title: 'Frutta fresca di stagione',
                    items: ['200 g di frutta fresca'],
                    notes: ['Dose standard semplice da ricordare', 'Banana circa 120 g o cocomero circa 500 g come equivalenze'],
                    macros: { kcal: 80, protein: 1, carbs: 20, fat: 0 }
                },
                {
                    title: 'Frutta fresca nel pomeriggio',
                    items: ['200 g di frutta fresca'],
                    notes: ['Molto coerente con un piano ipocalorico moderato', 'Se la fame aumenta, abbina verdure crude fuori schema spuntino'],
                    macros: { kcal: 80, protein: 1, carbs: 20, fat: 0 }
                },
                {
                    title: 'Frutta ad alta idratazione',
                    items: ['500 g cocomero oppure 200 g arancia, mela, pera, pesca o frutti di bosco'],
                    notes: ['Opzione di volume', 'Coerente con fame da gestire senza alzare troppo le calorie'],
                    macros: { kcal: 70, protein: 1, carbs: 17, fat: 0 }
                }
            ],
            dailyPattern: {
                breakfast: {
                    title: 'Latte parzialmente scremato, fette biscottate e marmellata',
                    whyItFits: 'Apre la giornata con una struttura semplice, misurata e molto facile da mantenere nella routine.',
                    items: ['150 ml latte parzialmente scremato', '4 fette biscottate', '30 g marmellata', 'caffe, te o orzo a piacere senza eccessi zuccherini'],
                    kcal: 280,
                    protein: 11,
                    carbs: 45,
                    fat: 6
                },
                morningSnack: {
                    title: 'Frutta fresca',
                    whyItFits: 'Mantiene lo spuntino essenziale e controllato, utile per arrivare al pranzo con una fame piu gestibile.',
                    items: ['200 g di frutta fresca', 'banana circa 120 g o cocomero circa 500 g come equivalenze utili'],
                    kcal: 80,
                    protein: 1,
                    carbs: 20,
                    fat: 0
                },
                lunch: {
                    titleWorkday: 'Pranzo pratico con cereale, verdure e quota proteico-fibrosa',
                    titleFreeDay: 'Pranzo strutturato con base amidacea e condimenti vegetali',
                    whyWorkday: 'Resta leggibile, preparabile e gestibile anche in una giornata piu compressa.',
                    whyFreeDay: 'Tiene una struttura ordinata ma un po piu distesa, restando coerente con un piano ipocalorico moderato.',
                    items: ['80 g pasta o riso o farro o orzo con condimenti vegetali', 'in alternativa 40 g pasta + 50 g legumi secchi + 1 cucchiaino di parmigiano', 'verdura cotta o cruda a piacere', '20 g olio EVO preferibilmente a crudo', '20 g pane semplice senza sale'],
                    carbs: 62,
                    fat: 20
                },
                afternoonSnack: {
                    title: 'Frutta fresca',
                    whyItFits: 'Replica una struttura semplice e sostenibile che aiuta a contenere la fame prima della cena.',
                    items: ['200 g di frutta fresca'],
                    kcal: 80,
                    protein: 1,
                    carbs: 20,
                    fat: 0
                },
                dinner: {
                    title: 'Cena con proteina magra, verdure e pane',
                    whyItFits: 'Chiude la giornata con una struttura leggibile: apertura vegetale, proteina ruotabile, pane misurato e condimento dichiarato.',
                    items: ['brodo o passato di verdure senza patate o legumi a piacere', 'secondo piatto: 200 g carne magra oppure 300 g pesce magro oppure 180 g pesce semigrasso oppure 90 g legumi secchi oppure 2 uova', 'verdura cotta o cruda a piacere', '10 g olio EVO preferibilmente a crudo', '60 g pane semplice senza sale'],
                    carbs: 42,
                    fat: 16
                },
                notes: [
                    'Per la fame, le verdure crude possono essere usate liberamente come supporto di sazieta.',
                    'Uova, formaggi e affettati magri restano meglio come scelte occasionali e non quotidiane.',
                    'Associata al piano alimentare, almeno 30 minuti di attivita aerobica al giorno possono migliorare aderenza e progressione.'
                ]
            },
            weeklyPattern: {
                title: 'Settimana alimentare coerente con un metodo clinico-pratico',
                rationale: 'Settimana costruita per una persona adulta in sovrappeso con deficit moderato: struttura semplice, molta aderenza, colazione e spuntini lineari, pranzi leggibili e rotazione proteica ragionata nelle cene.',
                notes: [
                    'La settimana non va letta come prescrizione rigida ma come mappa organizzativa.',
                    'Le colazioni e gli spuntini possono ripetersi: la variabilita conta di piu tra pranzi e cene.',
                    'La rotazione proteica resta una guida settimanale e non un obbligo matematico sul singolo giorno.'
                ],
                days: [
                    { day: 'Lunedi', focus: 'ripartenza semplice e saziante', lunch: 'primo piatto vegetale', dinnerProtein: 'pesce magro' },
                    { day: 'Martedi', focus: 'gestione fame e continuita', lunch: 'cereale + legumi', dinnerProtein: 'carne bianca magra' },
                    { day: 'Mercoledi', focus: 'settimana centrale con quota proteica ordinata', lunch: 'primo piatto vegetale', dinnerProtein: 'legumi' },
                    { day: 'Giovedi', focus: 'energia stabile e digestione leggera', lunch: 'cereale + verdure', dinnerProtein: 'pesce semigrasso o magro' },
                    { day: 'Venerdi', focus: 'chiusura lavorativa ordinata', lunch: 'pasta + legumi', dinnerProtein: 'legumi' },
                    { day: 'Sabato', focus: 'giorno libero ma con struttura', lunch: 'pranzo un po piu disteso', dinnerProtein: 'carne rossa magra oppure uova occasionali' },
                    { day: 'Domenica', focus: 'settimana conclusa senza eccessi', lunch: 'pranzo vegetale curato', dinnerProtein: 'pesce oppure formaggio magro occasionale' }
                ]
            }
        }
    };
}));