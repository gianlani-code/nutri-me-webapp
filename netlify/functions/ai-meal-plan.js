const chefProteinPlanning = require('../data/chef-protein-planning.json');
const nutritionCounselingBreakfastPatterns = require('../data/nutrition-counseling-breakfast-patterns.json');
const nutritionCounselingDailyPlanPatterns = require('../data/nutrition-counseling-daily-plan-patterns.json');
const nutritionCounselingDinnerPatterns = require('../data/nutrition-counseling-dinner-patterns.json');
const nutritionCounselingDinnerTemplates = require('../data/nutrition-counseling-dinner-templates.json');
const nutritionCounselingLunchPatterns = require('../data/nutrition-counseling-lunch-patterns.json');
const nutritionCounselingLunchContexts = require('../data/nutrition-counseling-lunch-contexts.json');
const clinicalNutritionGuidance = require('../data/clinical-nutrition-overweight-50plus.js');

const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const MAX_REQUEST_BODY_LENGTH = 20_000;
const MAX_PROFILE_FIELD_LENGTH = 160;
const MAX_LIST_FIELD_LENGTH = 320;
const AI_REQUEST_TIMEOUT_MS = 20_000;

function response(statusCode, body) {
    return {
        statusCode,
        headers: JSON_HEADERS,
        body: JSON.stringify(body)
    };
}

function limitString(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function limitNumber(value, fallback = 0, min = 0, max = 10_000) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(max, Math.max(min, numeric));
}

function cloneClinicalGuidanceValue(value) {
    return JSON.parse(JSON.stringify(value));
}

function getClinicalGuidanceProfiles() {
    return Object.entries(clinicalNutritionGuidance || {})
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

function getDinnerProteinFrequencyLabel(value) {
    const normalized = normalizeDinnerProteinFrequency(value);
    return {
        libera: 'frequenza libera, senza obiettivo settimanale fisso',
        '1-2': 'circa 1-2 volte a settimana',
        '2-3': 'circa 2-3 volte a settimana',
        '3-4': 'circa 3-4 volte a settimana',
        '5+': 'quasi ogni giorno'
    }[normalized] || 'frequenza libera, senza obiettivo settimanale fisso';
}

function getDinnerProteinFrequencyPrompt(value) {
    const normalized = normalizeDinnerProteinFrequency(value);
    return {
        libera: 'usa la preferenza serale come orientamento morbido, senza imporre una frequenza fissa',
        '1-2': 'mantieni questa scelta serale solo in circa 1 o 2 cene settimanali',
        '2-3': 'mantieni questa scelta serale in circa 2 o 3 cene settimanali',
        '3-4': 'usa questa scelta serale in circa 3 o 4 cene settimanali',
        '5+': 'puoi usare questa scelta serale quasi ogni giorno, lasciando comunque piccole variazioni utili'
    }[normalized] || 'usa la preferenza serale come orientamento morbido, senza imporre una frequenza fissa';
}

function collectPromptLines(value, lines = [], seen = new Set()) {
    if (lines.length >= 8 || value == null) {
        return lines;
    }

    if (typeof value === 'string') {
        const text = value.trim();
        if (text && !seen.has(text)) {
            seen.add(text);
            lines.push(text);
        }
        return lines;
    }

    if (Array.isArray(value)) {
        value.forEach((entry) => collectPromptLines(entry, lines, seen));
        return lines;
    }

    if (typeof value === 'object') {
        Object.keys(value).forEach((key) => collectPromptLines(value[key], lines, seen));
    }

    return lines;
}

function extractJson(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return null;

    try {
        return JSON.parse(trimmed);
    } catch (error) {
        const match = trimmed.match(/\{[\s\S]*\}/);
        if (!match) return null;
        try {
            return JSON.parse(match[0]);
        } catch (innerError) {
            return null;
        }
    }
}

function sanitizeInput(body) {
    const profile = body && typeof body.profile === 'object' ? body.profile : {};
    const mode = ['breakfast-snacks', 'daily-plan', 'weekly-plan'].includes(body?.mode) ? body.mode : 'breakfast-snacks';
    const lunchContext = body?.lunchContext === 'free-day'
        ? 'free-day'
        : (profile?.lunchContextPreference === 'free-day' ? 'free-day' : 'workday');

    return {
        mode,
        lunchContext,
        preferences: limitString(body?.preferences, MAX_LIST_FIELD_LENGTH),
        profile: {
            username: limitString(profile.username, MAX_PROFILE_FIELD_LENGTH),
            goal: limitString(profile.goal, MAX_PROFILE_FIELD_LENGTH),
            diet: limitString(profile.diet, MAX_PROFILE_FIELD_LENGTH),
            allergies: limitString(profile.allergies, MAX_LIST_FIELD_LENGTH),
            intolerances: limitString(profile.intolerances, MAX_LIST_FIELD_LENGTH),
            otherPathologies: limitString(profile.otherPathologies, MAX_LIST_FIELD_LENGTH),
            jobType: limitString(profile.jobType, MAX_PROFILE_FIELD_LENGTH),
            sex: limitString(profile.sex, MAX_PROFILE_FIELD_LENGTH),
            age: limitNumber(profile.age, 0, 0, 120),
            weight: limitNumber(profile.weight, 0, 0, 400),
            height: limitNumber(profile.height, 0, 0, 260),
            imc: limitNumber(profile.imc, 0, 0, 80),
            imcCategory: limitString(profile.imcCategory, MAX_PROFILE_FIELD_LENGTH),
            maintenanceCalories: limitNumber(profile.maintenanceCalories, 0, 0, 10000),
            targetCalories: limitNumber(profile.targetCalories, 0, 0, 10000),
            goalCalorieDelta: limitNumber(profile.goalCalorieDelta, 0, -2000, 2000),
            proteinTargetPerKg: limitNumber(profile.proteinTargetPerKg, 0, 0, 4),
            proteinTargetGrams: limitNumber(profile.proteinTargetGrams, 0, 0, 400),
            mealsPerDay: limitNumber(profile.mealsPerDay, 0, 0, 10),
            waterTargetLiters: limitNumber(profile.waterTargetLiters, 0, 0, 20),
            lunchContextPreference: profile?.lunchContextPreference === 'free-day' ? 'free-day' : 'workday',
            dinnerProteinPreference: normalizeDinnerProteinPreference(profile?.dinnerProteinPreference),
            dinnerProteinFrequency: normalizeDinnerProteinFrequency(profile?.dinnerProteinFrequency)
        }
    };
}

function formatDeltaKcal(value) {
    const numeric = Number(value || 0);
    if (!numeric) return '0 kcal';
    return `${numeric > 0 ? '+' : ''}${Math.round(numeric)} kcal`;
}

function getProteinPlanningGuidance() {
    return collectPromptLines(chefProteinPlanning).slice(0, 6);
}

function getBreakfastGuidance() {
    return collectPromptLines(nutritionCounselingBreakfastPatterns).slice(0, 8);
}

function getDailyPlanGuidance() {
    return collectPromptLines(nutritionCounselingDailyPlanPatterns).slice(0, 8);
}

function getDinnerGuidance() {
    return collectPromptLines(nutritionCounselingDinnerPatterns).slice(0, 8);
}

function getDinnerTemplateGuidance() {
    return collectPromptLines(nutritionCounselingDinnerTemplates).slice(0, 8);
}

function getLunchGuidance() {
    return collectPromptLines(nutritionCounselingLunchPatterns).slice(0, 8);
}

function getLunchContextGuidance() {
    return collectPromptLines(nutritionCounselingLunchContexts).slice(0, 8);
}

function getLunchContextLabel(value) {
    return value === 'free-day' ? 'giorno libero' : 'giorno lavorativo';
}

function getDinnerProteinPreferenceLabel(value) {
    const normalized = normalizeDinnerProteinPreference(value);
    return {
        variata: 'rotazione serale varia',
        uova: 'preferenza serale per uova',
        'tofu-tempeh': 'preferenza serale per tofu o tempeh',
        'latticini-light': 'preferenza serale per latticini light',
        'burger-vegetali': 'preferenza serale per burger vegetali o lupini'
    }[normalized] || 'rotazione serale varia';
}

function getClinicalNutritionContext(profile) {
    const match = getClinicalGuidanceProfiles().find((source) => matchesClinicalGuidanceCriteria(profile, source.criteria || {}));

    if (!match) {
        return { applicable: false };
    }

    return {
        ...cloneClinicalGuidanceValue(match),
        applicable: true,
        selectedProfileKey: match.key
    };
}

function buildBreakfastFallback(payload) {
    const proteinTarget = Number(payload.profile.proteinTargetGrams || 0);
    const breakfastProtein = proteinTarget > 0 ? Math.max(20, Math.round(proteinTarget * 0.22)) : 25;
    const snackProtein = proteinTarget > 0 ? Math.max(12, Math.round(proteinTarget * 0.12)) : 15;
    const clinicalContext = getClinicalNutritionContext(payload.profile);

    if (clinicalContext.applicable) {
        const breakfastOptions = cloneClinicalGuidanceValue(clinicalContext.breakfastOptions || []);
        const snackOptions = cloneClinicalGuidanceValue(clinicalContext.snackOptions || []);

        return {
            breakfastOptions: breakfastOptions.map((option, index) => ({
                ...option,
                whyItFits: option.whyItFits || (index === 0
                    ? 'Schema semplice e molto aderente, utile quando l obiettivo principale e la continuita.'
                    : (index === 1
                        ? 'Alternativa equivalente un po piu fresca ma ancora semplice e misurata.'
                        : 'Versione piu calda e saziante, senza perdere controllo sulla densita energetica.')),
                macros: {
                    ...(option.macros || {}),
                    protein: Number(option?.macros?.protein || 0) || Math.max(10, breakfastProtein - Math.max(0, index * 2))
                }
            })),
            snackOptions: snackOptions.map((option) => ({
                ...option,
                whyItFits: option.whyItFits || 'Spuntino essenziale, leggero e molto facile da ripetere.'
            })),
            guidance: [
                `Schema clinico-pratico attivato: circa 1600 kcal con macro orientative ${clinicalContext.macroSplit || '20% proteine, 30% grassi, 50% carboidrati'}.`,
                clinicalContext.weightNote || 'I pesi si intendono a crudo e al netto degli scarti quando applicabile.',
                'L olio EVO e preferibile a crudo e i condimenti restano misurati.',
                'Per contenere la fame, le verdure possono aiutare piu di snack dolci o liquidi calorici.',
                clinicalContext.avoidFoods || 'Da limitare: fritture, intingoli, carni grasse, insaccati, dolci frequenti e bibite zuccherate.'
            ]
        };
    }

    return {
        breakfastOptions: [
            {
                title: 'Yogurt greco, cereali semplici e frutta',
                whyItFits: 'Dà una quota proteica concreta all inizio della giornata e resta facile da ripetere nella routine.',
                items: ['150-170 g yogurt greco 0%', '35-45 g granola o fiocchi a ridotto contenuto di zuccheri', '1 porzione di frutta'],
                notes: ['Struttura semplice', 'Utile per sazieta e praticita'],
                macros: { kcal: 320, protein: breakfastProtein, carbs: 34, fat: 7 }
            },
            {
                title: 'Yogurt greco, frutta e frutta secca',
                whyItFits: 'Alternativa equivalente ma con una quota di grassi buoni che aumenta piacevolezza e continuita.',
                items: ['150 g yogurt greco 0%', '1 porzione di frutta', '15-20 g frutta secca'],
                notes: ['Più flessibile fuori casa', 'Utile se vuoi una colazione meno rigida'],
                macros: { kcal: 300, protein: breakfastProtein - 2, carbs: 24, fat: 11 }
            },
            {
                title: 'Porridge proteico con avena e albume',
                whyItFits: 'Più caldo e saziante, utile quando la mattina richiede una struttura leggermente più corposa.',
                items: ['40 g fiocchi di avena', '80 ml albume', '1 frutto', '1 cucchiaino crema 100% di frutta secca'],
                notes: ['Opzione cremosa e molto gestibile', 'Adatta a giornate con più fame o più movimento'],
                macros: { kcal: 340, protein: breakfastProtein + 2, carbs: 36, fat: 9 }
            }
        ],
        snackOptions: [
            {
                title: 'Skyr o yogurt proteico con frutta',
                whyItFits: 'Aiuta a distribuire la quota proteica senza appesantire troppo lo spuntino.',
                items: ['1 vasetto di skyr o yogurt proteico', '1 frutto piccolo'],
                notes: ['Molto pratico', 'Buono anche post allenamento leggero'],
                macros: { kcal: 170, protein: snackProtein, carbs: 18, fat: 1 }
            },
            {
                title: 'Frutto fresco e frutta secca',
                whyItFits: 'Funziona quando serve uno spuntino agile e non troppo costruito.',
                items: ['1 porzione di frutta', '15-20 g frutta secca'],
                notes: ['Piacevole e veloce', 'Adatto se il pasto successivo non è troppo lontano'],
                macros: { kcal: 180, protein: 5, carbs: 18, fat: 10 }
            },
            {
                title: 'Yogurt greco essenziale',
                whyItFits: 'Versione molto semplice, utile quando vuoi restare ordinato sul piano calorico.',
                items: ['125-150 g yogurt greco 0%', 'cannella o cacao amaro', 'eventuale frutto piccolo'],
                notes: ['Molto controllabile', 'Utile anche in fase di dimagrimento'],
                macros: { kcal: 140, protein: snackProtein, carbs: 9, fat: 1 }
            }
        ],
        guidance: [
            `Fabbisogno stimato ${Math.round(payload.profile.maintenanceCalories || 0)} kcal, piano ${Math.round(payload.profile.targetCalories || 0)} kcal (${formatDeltaKcal(payload.profile.goalCalorieDelta)}).`,
            `Quota proteica di riferimento ${Number(payload.profile.proteinTargetPerKg || 0).toFixed(1)} g/kg, circa ${Math.round(payload.profile.proteinTargetGrams || 0)} g al giorno.`,
            payload.preferences ? `Preferenza considerata: ${payload.preferences}.` : 'Le opzioni sono equivalenti per logica, non rigide o obbligatorie.'
        ]
    };
}

function buildDailyPlanFallback(payload) {
    const targetCalories = Math.round(payload.profile.targetCalories || 0);
    const proteinGrams = Math.round(payload.profile.proteinTargetGrams || 0);
    const breakfastKcal = Math.round(targetCalories * 0.22);
    const lunchKcal = Math.round(targetCalories * 0.3);
    const dinnerKcal = Math.round(targetCalories * 0.28);
    const snackKcal = Math.max(120, Math.round((targetCalories - breakfastKcal - lunchKcal - dinnerKcal) / 2));
    const isFreeDayLunch = payload.lunchContext === 'free-day';
    const dinnerProteinOption = isFreeDayLunch
        ? '250 g tofu oppure 150 g tempeh come fonte proteica principale'
        : '3 uova intere oppure tofu/tempeh come fonte proteica principale';
    const dinnerCarbOption = isFreeDayLunch
        ? '1 patata americana oppure 2 patate medio-grandi'
        : '60 g riso a chicco lungo o altri cereali gia pronti, oppure 2-3 fette di pane scuro';
    const clinicalContext = getClinicalNutritionContext(payload.profile);

    if (clinicalContext.applicable) {
        const dailyPattern = cloneClinicalGuidanceValue(clinicalContext.dailyPattern || {});
        return {
            title: 'Giornata alimentare ispirata a un metodo clinico-pratico',
            rationale: `Esempio di giornata per adulto in sovrappeso con deficit moderato, costruito per massimizzare aderenza, semplicita e coerenza con il piano calorico.${payload.preferences ? ` Preferenza considerata: ${payload.preferences}.` : ''}`,
            lunchContext: payload.lunchContext,
            targets: {
                maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
                targetCalories,
                deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
                proteinGrams,
                proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
                hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
            },
            meals: [
                {
                    slot: 'Colazione',
                    title: dailyPattern.breakfast?.title || 'Latte parzialmente scremato, fette biscottate e marmellata',
                    whyItFits: dailyPattern.breakfast?.whyItFits || 'Base ordinata e facilmente ripetibile, utile quando serve continuita prima ancora che creativita.',
                    items: dailyPattern.breakfast?.items || ['150 ml latte parzialmente scremato', '4 fette biscottate', '30 g marmellata', 'caffe, te o orzo a piacere'],
                    kcal: dailyPattern.breakfast?.kcal || 280,
                    protein: dailyPattern.breakfast?.protein || 11,
                    carbs: dailyPattern.breakfast?.carbs || 45,
                    fat: dailyPattern.breakfast?.fat || 6
                },
                {
                    slot: 'Spuntino mattina',
                    title: dailyPattern.morningSnack?.title || 'Frutta fresca',
                    whyItFits: dailyPattern.morningSnack?.whyItFits || 'Spuntino leggero e lineare, utile per gestire meglio fame e aderenza.',
                    items: dailyPattern.morningSnack?.items || ['200 g frutta fresca', 'banana circa 120 g o cocomero circa 500 g come equivalenze'],
                    kcal: dailyPattern.morningSnack?.kcal || 80,
                    protein: dailyPattern.morningSnack?.protein || 1,
                    carbs: dailyPattern.morningSnack?.carbs || 20,
                    fat: dailyPattern.morningSnack?.fat || 0
                },
                {
                    slot: 'Pranzo',
                    title: isFreeDayLunch ? (dailyPattern.lunch?.titleFreeDay || 'Pranzo strutturato con base amidacea e condimenti vegetali') : (dailyPattern.lunch?.titleWorkday || 'Pranzo pratico con cereale, verdure e condimento dichiarato'),
                    whyItFits: isFreeDayLunch
                        ? (dailyPattern.lunch?.whyFreeDay || 'Tiene una struttura clinicamente ordinata ma un po piu distesa e piacevole.')
                        : (dailyPattern.lunch?.whyWorkday || 'Mantiene praticita e leggibilita anche in una giornata lavorativa piu compressa.'),
                    items: dailyPattern.lunch?.items || ['80 g pasta o riso o farro o orzo con condimenti vegetali', 'oppure 40 g pasta + 50 g legumi secchi + 1 cucchiaino di parmigiano', 'verdura cotta o cruda a piacere', '20 g olio EVO preferibilmente a crudo', '20 g pane semplice senza sale'],
                    kcal: lunchKcal || 520,
                    protein: Math.max(24, Math.round(proteinGrams * 0.3)),
                    carbs: dailyPattern.lunch?.carbs || 62,
                    fat: dailyPattern.lunch?.fat || 20
                },
                {
                    slot: 'Spuntino pomeriggio',
                    title: dailyPattern.afternoonSnack?.title || 'Frutta fresca',
                    whyItFits: dailyPattern.afternoonSnack?.whyItFits || 'Replica una struttura semplice e sostenibile per non arrivare troppo affamati alla sera.',
                    items: [...(dailyPattern.afternoonSnack?.items || ['200 g frutta fresca']), 'se la fame aumenta, meglio verdure crude di supporto che snack densi e ultraprocessati'],
                    kcal: dailyPattern.afternoonSnack?.kcal || 80,
                    protein: dailyPattern.afternoonSnack?.protein || 1,
                    carbs: dailyPattern.afternoonSnack?.carbs || 20,
                    fat: dailyPattern.afternoonSnack?.fat || 0
                },
                {
                    slot: 'Cena',
                    title: dailyPattern.dinner?.title || 'Cena con proteina magra, verdure e pane',
                    whyItFits: dailyPattern.dinner?.whyItFits || 'Chiude la giornata con struttura leggibile, rotazione proteica e condimento dichiarato.',
                    items: dailyPattern.dinner?.items || ['brodo o passato di verdure senza legumi e patate a piacere', 'secondo piatto: 200 g carne magra oppure 300 g pesce magro oppure 180 g pesce semigrasso oppure 90 g legumi secchi oppure 2 uova', 'verdura cotta o cruda a piacere', '10 g olio EVO preferibilmente a crudo', '60 g pane semplice senza sale'],
                    kcal: dinnerKcal || 470,
                    protein: Math.max(28, Math.round(proteinGrams * 0.28)),
                    carbs: dailyPattern.dinner?.carbs || 42,
                    fat: dailyPattern.dinner?.fat || 16
                }
            ],
            notes: [
                clinicalContext.weightNote || 'I pesi si intendono a crudo e al netto degli scarti.',
                'Per contenere la fame, le verdure crude o cotte possono essere usate come supporto di sazieta.',
                clinicalContext.proteinRotation || 'Rotazione proteica consigliata: circa 3 volte pesce, 3 legumi, 3 carne con carne rossa massimo 1 volta; uova, formaggi e affettati magri solo occasionalmente.',
                'L olio EVO e preferibile a crudo e i condimenti restano misurati.',
                clinicalContext.avoidFoods || 'Da limitare: fritture, intingoli, carni grasse, insaccati, dolci frequenti, bibite zuccherate, liquori e aperitivi.',
                ...(dailyPattern.notes || [])
            ]
        };
    }

    return {
        title: 'Giornata alimentare costruita sul tuo profilo',
        rationale: `Esempio di giornata completa che distingue fabbisogno, piano calorico e distribuzione della quota proteica, con pranzo da ${getLunchContextLabel(payload.lunchContext)}.${payload.preferences ? ` Preferenza considerata: ${payload.preferences}.` : ''}`,
        lunchContext: payload.lunchContext,
        targets: {
            maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
            hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
        },
        meals: [
            {
                slot: 'Colazione',
                title: 'Base proteica con frutta e carboidrato semplice',
                whyItFits: 'Aiuta a iniziare con una quota proteica leggibile e sostenibile.',
                items: ['Yogurt greco o skyr', 'fiocchi di avena o cereali semplici', '1 porzione di frutta'],
                kcal: breakfastKcal,
                protein: Math.max(20, Math.round(proteinGrams * 0.22)),
                carbs: 35,
                fat: 8
            },
            {
                slot: 'Spuntino mattina',
                title: 'Spuntino proteico leggero',
                whyItFits: 'Utile se serve distribuire fame e quota proteica nella prima parte della giornata.',
                items: ['Yogurt proteico oppure skyr', 'frutto piccolo se necessario'],
                kcal: snackKcal,
                protein: Math.max(12, Math.round(proteinGrams * 0.1)),
                carbs: 14,
                fat: 2
            },
            {
                slot: 'Pranzo',
                title: isFreeDayLunch
                    ? 'Pranzo da giorno libero con apertura vegetale e struttura piu distesa'
                    : 'Pranzo da giorno lavorativo pratico e leggibile',
                whyItFits: isFreeDayLunch
                    ? 'Riprende il metodo professionale del pranzo ma con piu agio, una struttura leggermente piu curata e una fruizione piu calma.'
                    : 'Riprende il metodo professionale del pranzo ma in forma piu pratica, trasportabile e sostenibile dentro una giornata di lavoro.',
                items: isFreeDayLunch
                    ? ['Inizio con verdure crude semplici come insalata, carota o finocchio', 'base amidacea come farro, riso integrale, pasta, quinoa, cous-cous o gnocchi', 'legumi gia cotti o edamame come quota proteica e di fibra', 'verdure piu presenti o piatto un po piu curato', 'olio EVO ben dichiarato', 'eventuale piccola nota dolce finale solo se davvero coerente con il profilo']
                    : ['Inizio con verdure crude semplici se praticabile', 'base amidacea come farro, riso integrale, pasta, quinoa, cous-cous o gnocchi', 'legumi gia cotti o edamame come quota proteica e di fibra', 'verdure di accompagnamento', 'olio EVO ben dichiarato', 'struttura facile da preparare in anticipo o portare fuori casa'],
                kcal: lunchKcal,
                protein: Math.max(28, Math.round(proteinGrams * 0.3)),
                carbs: 55,
                fat: 16
            },
            {
                slot: 'Spuntino pomeriggio',
                title: 'Frutta e quota proteica o grassa leggera',
                whyItFits: 'Aiuta a non arrivare troppo scarico o troppo affamato alla cena.',
                items: ['1 frutto', 'yogurt greco oppure piccola quota di frutta secca'],
                kcal: snackKcal,
                protein: Math.max(10, Math.round(proteinGrams * 0.1)),
                carbs: 16,
                fat: 6
            },
            {
                slot: 'Cena',
                title: isFreeDayLunch
                    ? 'Cena con apertura vegetale e proteina vegetale piu strutturata'
                    : 'Cena pratica con apertura vegetale e nucleo proteico leggibile',
                whyItFits: isFreeDayLunch
                    ? 'Riprende il metodo professionale della cena: apertura con verdure crude, proteina ben leggibile, quota glucidica semplice e chiusura eventualmente completata con frutta.'
                    : 'Chiude la giornata con una struttura concreta e organizzabile: verdure crude in apertura, fonte proteica chiara, carboidrato modulato e olio EVO dichiarato.',
                items: ['Inizio con insalata oppure carota o finocchio da sgranocchiare', dinnerProteinOption, dinnerCarbOption, 'verdure cotte o crude di accompagnamento', '2 cucchiai di olio EVO ben dichiarati', 'eventuale 1 porzione di frutta a fine pasto se coerente con fame e giornata'],
                kcal: dinnerKcal,
                protein: Math.max(28, Math.round(proteinGrams * 0.28)),
                carbs: isFreeDayLunch ? 34 : 40,
                fat: 16
            }
        ],
        notes: [
            'Le porzioni reali dipendono dagli alimenti scelti e dalla routine del giorno.',
            'Il piano è un esempio ragionato, non una prescrizione clinica personalizzata.',
            'Se la fame mattutina è bassa, una parte dell energia può essere spostata tra colazione e spuntino.',
            isFreeDayLunch
                ? 'Nel giorno libero il pranzo puo essere piu disteso e leggermente piu curato, ma senza perdere struttura nutrizionale.'
                : 'Nel giorno lavorativo il pranzo deve restare pratico, digeribile e facile da organizzare.',
            'La cena puo ruotare tra uova, tofu, tempeh, latticini light o burger vegetali proteici: la frequenza settimanale serve come logica di varieta, non come regola rigida del singolo output.',
            'Se esiste l abitudine al dolce a fine pasto, una piccola quota di cioccolato fondente può essere usata in modo occasionale e non quotidiano come leva di disabitudine.'
        ]
    };
}

function buildWeeklyPlanFallback(payload) {
    const clinicalContext = getClinicalNutritionContext(payload.profile);
    const weeklyPattern = cloneClinicalGuidanceValue(clinicalContext.weeklyPattern || {});
    const dailyPattern = cloneClinicalGuidanceValue(clinicalContext.dailyPattern || {});
    const targetCalories = Math.round(payload.profile.targetCalories || 0);
    const proteinGrams = Math.round(payload.profile.proteinTargetGrams || 0);

    const days = (weeklyPattern.days || []).map((day, index) => ({
        day: day.day,
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
                items: index === 5 || index === 6
                    ? ['80 g pasta o riso o farro o orzo con condimenti vegetali', 'verdure cotte o crude a piacere', '20 g olio EVO preferibilmente a crudo', '20 g pane semplice senza sale']
                    : (dailyPattern.lunch?.items || [])
            },
            {
                slot: 'Cena',
                title: `Cena con ${day.dinnerProtein}`,
                items: ['brodo o passato di verdure senza patate o legumi a piacere', `fonte proteica prioritaria: ${day.dinnerProtein}`, 'verdura cotta o cruda a piacere', '10 g olio EVO preferibilmente a crudo', '60 g pane semplice senza sale']
            }
        ],
        notes: [
            `Focus del giorno: ${day.focus}`,
            index === 5 || index === 6
                ? 'Nel fine settimana la struttura puo essere un po piu distesa, ma senza perdere ordine nutrizionale.'
                : `Nel contesto ${getLunchContextLabel(payload.lunchContext).toLowerCase()} la priorita resta la praticita.`
        ]
    }));

    return {
        title: weeklyPattern.title || 'Settimana alimentare coerente con il profilo',
        rationale: `${weeklyPattern.rationale || 'Schema settimanale costruito per dare continuita e organizzazione.'}${payload.preferences ? ` Nota considerata: ${payload.preferences}.` : ''}`,
        targets: {
            maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
            hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
        },
        days,
        notes: [
            clinicalContext.weightNote || 'I pesi si intendono a crudo e al netto degli scarti.',
            clinicalContext.proteinRotation || 'Rotazione proteica consigliata lungo la settimana.',
            ...(weeklyPattern.notes || []),
            clinicalContext.avoidFoods || 'Da limitare: fritture, intingoli, carni grasse, insaccati, dolci frequenti e bibite zuccherate.'
        ]
    };
}

async function generateBreakfastSnacksWithAI(payload) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY');
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const clinicalContext = getClinicalNutritionContext(payload.profile);

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi generare colazioni e spuntini equivalenti, non regole universali.',
        'Usa IMC, fabbisogno, piano calorico e quota proteica come contesto del singolo utente.',
        'Considera anche il contesto pranzo abituale del profilo: se e da giorno lavorativo, tieni snack piu pratici e protettivi; se e da giorno libero, puoi renderli piu leggeri e di riequilibrio.',
        'Quando usi esempi professionali, assorbine il metodo e non copiare il testo.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, privilegia aderenza, semplicita, frutta come base degli spuntini e una colazione sobria e ripetibile.',
        'Restituisci solo JSON valido con shape {"breakfastOptions":[{"title":"","whyItFits":"","items":[""],"notes":[""],"macros":{"kcal":0,"protein":0,"carbs":0,"fat":0}}],"snackOptions":[{"title":"","whyItFits":"","items":[""],"notes":[""],"macros":{"kcal":0,"protein":0,"carbs":0,"fat":0}}],"guidance":[""]}',
        'Genera 3 colazioni e 3 spuntini.'
    ].join(' ');

    const userPrompt = [
        `Profilo: IMC ${payload.profile.imc || 0} (${payload.profile.imcCategory || 'non specificato'})`,
        `Fabbisogno: ${payload.profile.maintenanceCalories || 0} kcal`,
        `Piano calorico: ${payload.profile.targetCalories || 0} kcal`,
        `Delta del piano: ${payload.profile.goalCalorieDelta || 0} kcal`,
        `Proteine target: ${payload.profile.proteinTargetPerKg || 0} g/kg, circa ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Obiettivo: ${payload.profile.goal || 'mantenere'}`,
        `Dieta: ${payload.profile.diet || 'non specificata'}`,
        `Allergie: ${payload.profile.allergies || 'nessuna'}`,
        `Intolleranze: ${payload.profile.intolerances || 'nessuna'}`,
        `Pasti al giorno: ${payload.profile.mealsPerDay || 0}`,
        `Preferenza pranzo profilo: ${getLunchContextLabel(payload.profile.lunchContextPreference)}`,
        `Contesto pranzo applicato: ${getLunchContextLabel(payload.lunchContext)}`,
        `Preferenze utente: ${payload.preferences || 'nessuna'}`,
        `Metodo colazione: ${JSON.stringify(getBreakfastGuidance())}`,
        `Metodo contesto pranzo: ${JSON.stringify(getLunchContextGuidance())}`,
        `Metodo proteico: ${JSON.stringify(getProteinPlanningGuidance())}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.promptLines)}`,
        'Costruisci opzioni equivalenti, realistiche, sostenibili e con quota proteica ragionata.',
        'Rendi esplicito nel testo del perche ti puo aiutare o nelle note pratiche se lo snack e pensato per una giornata lavorativa piu compressa oppure per riequilibrare un giorno libero.'
    ].join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    let completion;
    try {
        completion = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            signal: controller.signal,
            body: JSON.stringify({
                model,
                temperature: 0.45,
                max_tokens: 1600,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            throw new Error('AI request timed out');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }

    if (!completion.ok) {
        throw new Error('AI service temporarily unavailable');
    }

    const data = await completion.json();
    const parsed = extractJson(data?.choices?.[0]?.message?.content);
    if (!Array.isArray(parsed?.breakfastOptions) || !Array.isArray(parsed?.snackOptions)) {
        throw new Error('Invalid AI breakfast payload');
    }

    return {
        breakfastOptions: parsed.breakfastOptions.slice(0, 3),
        snackOptions: parsed.snackOptions.slice(0, 3),
        guidance: Array.isArray(parsed.guidance) ? parsed.guidance.slice(0, 5) : [],
        meta: {
            source: 'ai',
            model,
            lunchContext: payload.lunchContext
        }
    };
}

async function generateDailyPlanWithAI(payload) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY');
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const clinicalContext = getClinicalNutritionContext(payload.profile);

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi costruire un esempio di piano giornaliero coerente con il profilo del singolo utente.',
        'Distingui sempre fabbisogno, piano calorico e ruolo dei singoli pasti.',
        'Usa il target proteico in g/kg per distribuire la quota proteica nella giornata in modo sensato.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, puoi usare un pattern semplice e molto aderente: colazione sobria, frutta come spuntino base, pranzo con cereale e condimenti vegetali, cena con proteina magra, verdure, pane e olio EVO a crudo.',
        'Non copiare esempi professionali: usane il metodo.',
        'Restituisci solo JSON valido con shape {"plan":{"title":"","rationale":"","targets":{"maintenanceCalories":0,"targetCalories":0,"deltaCalories":0,"proteinGrams":0,"proteinPerKg":0,"hydrationLiters":0},"meals":[{"slot":"","title":"","whyItFits":"","items":[""],"kcal":0,"protein":0,"carbs":0,"fat":0}],"notes":[""]}}',
        'Genera una giornata completa con almeno 5 momenti: colazione, spuntino mattina, pranzo, spuntino pomeriggio, cena.'
    ].join(' ');

    const userPrompt = [
        `Profilo: IMC ${payload.profile.imc || 0} (${payload.profile.imcCategory || 'non specificato'})`,
        `Fabbisogno: ${payload.profile.maintenanceCalories || 0} kcal`,
        `Piano calorico: ${payload.profile.targetCalories || 0} kcal`,
        `Delta del piano: ${payload.profile.goalCalorieDelta || 0} kcal`,
        `Proteine target: ${payload.profile.proteinTargetPerKg || 0} g/kg, circa ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Obiettivo: ${payload.profile.goal || 'mantenere'}`,
        `Dieta: ${payload.profile.diet || 'non specificata'}`,
        `Allergie: ${payload.profile.allergies || 'nessuna'}`,
        `Intolleranze: ${payload.profile.intolerances || 'nessuna'}`,
        `Pasti al giorno dichiarati: ${payload.profile.mealsPerDay || 0}`,
        `Acqua target: ${payload.profile.waterTargetLiters || 0} L`,
        `Preferenza pranzo profilo: ${getLunchContextLabel(payload.profile.lunchContextPreference)}`,
        `Preferenza proteica serale: ${getDinnerProteinPreferenceLabel(payload.profile.dinnerProteinPreference)}`,
        `Frequenza proteica serale suggerita: ${getDinnerProteinFrequencyLabel(payload.profile.dinnerProteinFrequency)}`,
        `Contesto pranzo richiesto: ${getLunchContextLabel(payload.lunchContext)}`,
        `Preferenze utente: ${payload.preferences || 'nessuna'}`,
        `Metodo piano giornaliero: ${JSON.stringify(getDailyPlanGuidance())}`,
        `Metodo cena: ${JSON.stringify(getDinnerGuidance())}`,
        `Mini-template cena: ${JSON.stringify(getDinnerTemplateGuidance())}`,
        `Metodo pranzo: ${JSON.stringify(getLunchGuidance())}`,
        `Metodo contesto pranzo: ${JSON.stringify(getLunchContextGuidance())}`,
        `Metodo proteico: ${JSON.stringify(getProteinPlanningGuidance())}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.promptLines)}`,
        'Costruisci un esempio di giornata completo, leggibile, realistico e coerente con il profilo.',
        'Nel testo finale fai comparire in modo esplicito la preferenza proteica serale e l eventuale frequenza settimanale suggerita, non solo come ragionamento implicito.',
        'Per il pranzo puoi usare la logica professionale di apertura con verdure crude, base amidacea modulabile, legumi o edamame come quota proteico-fibrosa, verdure e olio EVO dichiarato.',
        'Per la cena puoi usare la logica professionale di apertura con verdure crude, fonte proteica ruotabile tra uova, tofu, tempeh, latticini light o alternative vegetali proteiche, quota glucidica semplice e olio EVO dichiarato; la frutta finale resta opzionale e contestualizzata.',
        'Se la preferenza serale privilegia tofu o tempeh, puoi richiamare mini-template concreti come tofu limone e pepe rosa, tempeh tahina e limone o polpette di tofu e spinaci, adattandoli al profilo e agli ingredienti.',
        `Indicazione operativa sulla frequenza serale: ${getDinnerProteinFrequencyPrompt(payload.profile.dinnerProteinFrequency)}.`,
        'Distingui esplicitamente il pranzo da giorno lavorativo e il pranzo da giorno libero: nel primo caso privilegia praticita, trasportabilita e comfort nel pomeriggio; nel secondo puoi permettere una struttura un po piu calma e curata, senza perdere coerenza col piano.',
        'L eventuale nota dolce finale va trattata solo come strategia comportamentale contestualizzata, non come automatismo. Se compare, puo essere una piccola quota di cioccolato fondente solo quando coerente con il profilo e con la gestione dell abitudine al dolce.'
    ].join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    let completion;
    try {
        completion = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            signal: controller.signal,
            body: JSON.stringify({
                model,
                temperature: 0.4,
                max_tokens: 1900,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            throw new Error('AI request timed out');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }

    if (!completion.ok) {
        throw new Error('AI service temporarily unavailable');
    }

    const data = await completion.json();
    const parsed = extractJson(data?.choices?.[0]?.message?.content);
    if (!parsed?.plan || !Array.isArray(parsed.plan.meals)) {
        throw new Error('Invalid AI daily plan payload');
    }

    parsed.plan.lunchContext = parsed.plan.lunchContext === 'free-day' ? 'free-day' : payload.lunchContext;

    return {
        plan: parsed.plan,
        meta: {
            source: 'ai',
            model
        }
    };
}

async function generateWeeklyPlanWithAI(payload) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY');
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const clinicalContext = getClinicalNutritionContext(payload.profile);

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi costruire un piano settimanale realistico, leggibile e sostenibile per il profilo del singolo utente.',
        'Non scrivere una prescrizione clinica rigida: costruisci una mappa organizzativa coerente con obiettivo, fame, aderenza e rotazione proteica.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, privilegia una settimana molto semplice: colazioni sobrie, spuntini di frutta, pranzi leggibili e cene con rotazione proteica chiara.',
        'Restituisci solo JSON valido con shape {"week":{"title":"","rationale":"","targets":{"maintenanceCalories":0,"targetCalories":0,"deltaCalories":0,"proteinGrams":0,"proteinPerKg":0,"hydrationLiters":0},"days":[{"day":"","focus":"","meals":[{"slot":"","title":"","items":[""]}],"notes":[""]}],"notes":[""]}}',
        'Genera 7 giorni completi.'
    ].join(' ');

    const userPrompt = [
        `Profilo: IMC ${payload.profile.imc || 0} (${payload.profile.imcCategory || 'non specificato'})`,
        `Fabbisogno: ${payload.profile.maintenanceCalories || 0} kcal`,
        `Piano calorico: ${payload.profile.targetCalories || 0} kcal`,
        `Delta del piano: ${payload.profile.goalCalorieDelta || 0} kcal`,
        `Proteine target: ${payload.profile.proteinTargetPerKg || 0} g/kg, circa ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Obiettivo: ${payload.profile.goal || 'mantenere'}`,
        `Dieta: ${payload.profile.diet || 'non specificata'}`,
        `Allergie: ${payload.profile.allergies || 'nessuna'}`,
        `Intolleranze: ${payload.profile.intolerances || 'nessuna'}`,
        `Acqua target: ${payload.profile.waterTargetLiters || 0} L`,
        `Contesto pranzo richiesto: ${getLunchContextLabel(payload.lunchContext)}`,
        `Preferenze utente: ${payload.preferences || 'nessuna'}`,
        `Metodo piano giornaliero: ${JSON.stringify(getDailyPlanGuidance())}`,
        `Metodo pranzo: ${JSON.stringify(getLunchGuidance())}`,
        `Metodo cena: ${JSON.stringify(getDinnerGuidance())}`,
        `Metodo contesto pranzo: ${JSON.stringify(getLunchContextGuidance())}`,
        `Metodo proteico: ${JSON.stringify(getProteinPlanningGuidance())}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.promptLines || [])}`,
        'Costruisci 7 giorni con colazione, spuntini, pranzo e cena.',
        'Mantieni alta la ripetibilita: le colazioni e gli spuntini possono ripetersi, mentre la variabilita maggiore deve stare in pranzi e cene.',
        'Fai emergere una rotazione proteica settimanale coerente, con carne rossa solo occasionale e piu spazio a pesce, legumi e proteine magre.'
    ].join('\n');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    let completion;
    try {
        completion = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            signal: controller.signal,
            body: JSON.stringify({
                model,
                temperature: 0.4,
                max_tokens: 2200,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            throw new Error('AI request timed out');
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }

    if (!completion.ok) {
        throw new Error('AI service temporarily unavailable');
    }

    const data = await completion.json();
    const parsed = extractJson(data?.choices?.[0]?.message?.content);
    if (!parsed?.week || !Array.isArray(parsed.week.days)) {
        throw new Error('Invalid AI weekly plan payload');
    }

    return {
        week: parsed.week,
        meta: {
            source: 'ai',
            model,
            lunchContext: payload.lunchContext
        }
    };
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: JSON_HEADERS,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return response(405, { error: 'Method not allowed' });
    }

    let body;
    try {
        if ((event.body || '').length > MAX_REQUEST_BODY_LENGTH) {
            return response(413, { error: 'Payload too large' });
        }
        body = JSON.parse(event.body || '{}');
    } catch (error) {
        return response(400, { error: 'Invalid JSON payload' });
    }

    const payload = sanitizeInput(body);

    try {
        if (payload.mode === 'daily-plan') {
            const aiResult = await generateDailyPlanWithAI(payload);
            return response(200, aiResult);
        }

        if (payload.mode === 'weekly-plan') {
            const aiResult = await generateWeeklyPlanWithAI(payload);
            return response(200, aiResult);
        }

        const aiResult = await generateBreakfastSnacksWithAI(payload);
        return response(200, aiResult);
    } catch (error) {
        console.error('AI meal plan fallback activated:', error && error.message ? error.message : error);

        if (payload.mode === 'daily-plan') {
            return response(200, {
                plan: buildDailyPlanFallback(payload),
                meta: {
                    source: 'fallback',
                    reason: 'AI live temporaneamente non disponibile'
                }
            });
        }

        if (payload.mode === 'weekly-plan') {
            return response(200, {
                week: buildWeeklyPlanFallback(payload),
                meta: {
                    source: 'fallback',
                    reason: 'AI live temporaneamente non disponibile',
                    lunchContext: payload.lunchContext
                }
            });
        }

        return response(200, {
            ...buildBreakfastFallback(payload),
            meta: {
                source: 'fallback',
                reason: 'AI live temporaneamente non disponibile'
            }
        });
    }
};