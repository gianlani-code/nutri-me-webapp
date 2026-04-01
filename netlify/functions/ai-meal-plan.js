const chefProteinPlanning = require('../data/chef-protein-planning.json');
const nutritionCounselingBreakfastPatterns = require('../data/nutrition-counseling-breakfast-patterns.json');
const nutritionCounselingDailyPlanPatterns = require('../data/nutrition-counseling-daily-plan-patterns.json');
const nutritionCounselingDinnerPatterns = require('../data/nutrition-counseling-dinner-patterns.json');
const nutritionCounselingDinnerTemplates = require('../data/nutrition-counseling-dinner-templates.json');
const nutritionCounselingLunchPatterns = require('../data/nutrition-counseling-lunch-patterns.json');
const nutritionCounselingLunchContexts = require('../data/nutrition-counseling-lunch-contexts.json');
const nutritionCounselingWeeklyMenuPatterns = require('../data/nutrition-counseling-weekly-menu-patterns.json');
const nutritionCounselingAntiAgePatterns = require('../data/nutrition-counseling-anti-age-patterns.json');
const nutritionCounselingVeganMenuPatterns = require('../data/nutrition-counseling-vegan-menu-patterns.json');
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

function buildDefaultDailyTheme(context = 'workday', title = '', rationale = '') {
    const base = String(title || rationale || '').trim().toLowerCase();

    if (base.includes('vegetale') || base.includes('vegan')) {
        return context === 'free-day'
            ? 'Giornata: Vegetale, Respiro e Recupero'
            : 'Giornata: Vegetale, Energia Pulita e Continuita';
    }

    return context === 'free-day'
        ? 'Giornata: Equilibrio, Recupero e Ritmo Disteso'
        : 'Giornata: Focus Energetico e Continuita';
}

function normalizeDailyPlanTheme(plan, lunchContext = 'workday') {
    if (!plan || typeof plan !== 'object') {
        return plan;
    }

    return {
        ...plan,
        daily_theme: String(plan.daily_theme || plan.dailyTheme || buildDefaultDailyTheme(lunchContext, plan.title, plan.rationale)).trim()
    };
}

function normalizeWeeklyDayThemes(days, lunchContext = 'workday') {
    return (Array.isArray(days) ? days : []).map((day, index) => ({
        ...day,
        daily_theme: String(day?.daily_theme || day?.dailyTheme || `${day?.day || `Giorno ${index + 1}`}: ${day?.focus || buildDefaultDailyTheme(lunchContext)}`).trim()
    }));
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
            carbsTargetGrams: limitNumber(profile.carbsTargetGrams, 0, 0, 600),
            fatTargetGrams: limitNumber(profile.fatTargetGrams, 0, 0, 250),
            fiberTargetGrams: limitNumber(profile.fiberTargetGrams, 0, 0, 100),
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

function normalizePlanningText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function hasPlanningKeyword(text, keywords) {
    const normalized = normalizePlanningText(text);
    return keywords.some((keyword) => normalized.includes(normalizePlanningText(keyword)));
}

function uniquePlanningStrings(values) {
    return [...new Set((Array.isArray(values) ? values : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function completeWeeklyMealItems(slot, items, fallbacks) {
    const baseItems = Array.isArray(items) ? items.filter(Boolean) : [];
    const text = baseItems.join(' | ');
    const completedItems = [...baseItems];
    const addedComponents = [];

    const needsProtein = ['pranzo', 'cena'].includes(normalizePlanningText(slot))
        && !hasPlanningKeyword(text, ['legumi', 'ceci', 'lenticchie', 'fagioli', 'edamame', 'pesce', 'salmone', 'merluzzo', 'sgombro', 'tonno', 'carne', 'pollo', 'tacchino', 'uova', 'uovo', 'tofu', 'tempeh', 'ricotta', 'formaggio', 'grana', 'mozzarella', 'bresaola', 'lupini']);
    const needsCereal = ['pranzo', 'cena'].includes(normalizePlanningText(slot))
        && !hasPlanningKeyword(text, ['pasta', 'riso', 'farro', 'orzo', 'quinoa', 'cous', 'grano saraceno', 'pane', 'cracker', 'patate', 'base amidacea', 'gnocchi']);
    const needsVegetables = ['pranzo', 'cena'].includes(normalizePlanningText(slot))
        && !hasPlanningKeyword(text, ['verdur', 'insalata', 'carota', 'finocchio', 'zucchina', 'broccoli', 'spinaci', 'cavolfiore', 'pomodoro', 'radicchio', 'orto']);
    const needsHealthyFat = ['pranzo', 'cena'].includes(normalizePlanningText(slot))
        && !hasPlanningKeyword(text, ['olio evo', 'olio extravergine', 'olio', 'frutta secca', 'semi', 'grassi buoni']);

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

function getWeeklyMenuGuidance() {
    return collectPromptLines(nutritionCounselingWeeklyMenuPatterns).slice(0, 12);
}

function getAntiAgeGuidance() {
    return collectPromptLines(nutritionCounselingAntiAgePatterns).slice(0, 10);
}

function getVeganMenuGuidance() {
    return collectPromptLines(nutritionCounselingVeganMenuPatterns).slice(0, 12);
}

function shouldApplyAntiAgeGuidance(profile) {
    const age = Number(profile?.age || 0);
    const signals = normalizePlanningText(`${profile?.goal || ''} ${profile?.otherPathologies || ''} ${profile?.diet || ''}`);
    return age >= 45 || signals.includes('anti age') || signals.includes('antiage') || signals.includes('anti aging') || signals.includes('antiaging');
}

function shouldApplyVeganGuidance(profile, extraSignals = '') {
    const signals = normalizePlanningText(`${extraSignals} ${profile?.diet || ''} ${profile?.goal || ''} ${profile?.otherPathologies || ''}`);
    return signals.includes('vegano')
        || signals.includes('vegan')
        || signals.includes('100% vegetale')
        || signals.includes('100 vegetale')
        || signals.includes('plant based')
        || signals.includes('plant-based')
        || signals.includes('totalmente vegetale');
}

function getVeganDinnerProteinText() {
    return 'tofu, tempeh, ceci, lenticchie, fagioli, edamame o burger vegetali proteici come nucleo del pasto';
}

function getWeeklyProteinFrequencyGuidance() {
    return [
        'Frequenze orientative secondi piatti per dieta onnivora: legumi circa 3-5 volte a settimana, pesce almeno 3, carne al massimo 3 con carne rossa circa 1 volta, formaggi 1-2 e uova 1-2.',
        'La rotazione delle fonti proteiche conta piu della ripetizione dello stesso alimento.',
        'Se scambi due fonti proteiche nello stesso pasto, puoi dimezzare la porzione di ciascuna mantenendo il piatto bilanciato.'
    ];
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

function getDailyPlanReferenceExamples() {
    return [
        {
            label: 'giornata-riferimento-2000-kcal',
            kcal: 2000,
            macroSplit: '19% proteine, 30% lipidi, 52% carboidrati di cui 16% semplici, 32 g fibra',
            structure: [
                '5 momenti: colazione, spuntino mattina, pranzo, merenda, cena',
                'colazione sobria con latte o yogurt, cereale semplice e piccola quota dolce misurata',
                'spuntini con frutta come base e supporti leggeri come yogurt, frutta secca o gallette',
                'pranzo con cereale o pasta, verdure, condimento dichiarato e proteina chiara o latticino magro',
                'cena con primo leggero o zuppa, proteina leggibile, verdure e quota semplice di pane o cracker'
            ]
        },
        {
            label: 'giornata-riferimento-1600-kcal',
            kcal: 1600,
            macroSplit: '19% proteine, 33% lipidi, 48% glucidi di cui 14% semplici, 26 g fibra',
            structure: [
                '5 momenti: colazione, spuntino mattina, pranzo, merenda, cena',
                'spuntini fissi e molto semplici con 150 g di frutta fresca',
                'colazione sobria con caffe o te, yogurt o latte, biscotti, muesli o fette biscottate',
                'pranzo con pasta, riso, farro o orzo, verdure e proteina magra o uova',
                'cena piu leggera con passato di verdure, pesce, bresaola, Grana Padano o hamburger al forno'
            ]
        }
    ];
}

function getWeeklyPlanReferenceExamples() {
    return [
        {
            label: 'esempio-base-2000-kcal',
            kcal: 2000,
            macroSplit: '19% proteine, 30% lipidi, 52% carboidrati di cui 16% semplici, 32 g fibra',
            recurringStructure: [
                '5 momenti giornalieri: colazione, spuntino mattina, pranzo, merenda, cena',
                'colazioni semplici con latte o yogurt, fette biscottate o cereali, piccola quota dolce misurata',
                'spuntini misti tra frutta e piccoli supporti come yogurt, frutta secca o gallette',
                'pranzi con cereale principale, verdure e fonte proteica chiara oppure latticino magro',
                'cene con zuppe o primi leggeri, proteina leggibile, verdure e piccola quota di pane o cracker'
            ],
            patternDays: [
                'lunedi: orzo primavera a pranzo, minestrone di riso e pollo a cena',
                'mercoledi: farfalle integrali con Grana Padano a pranzo, cous cous di verdure con baccala a cena',
                'venerdi: risotto ai carciofi con ricotta a pranzo, salmone al forno con patate a cena',
                'domenica: pranzo piu disteso con pasta e hamburger, cena piu pulita con crema di cavolfiore e frittata'
            ]
        },
        {
            label: 'esempio-ipocalorico-1600-kcal',
            kcal: 1600,
            macroSplit: '19% proteine, 33% lipidi, 48% glucidi di cui 14% semplici, 26 g fibra',
            recurringStructure: [
                '5 momenti giornalieri: colazione, spuntino mattina, pranzo, merenda, cena',
                'spuntini fissi tutti i giorni con 150 g di frutta fresca al mattino e al pomeriggio',
                'colazioni sobrie con caffe o te, yogurt o latte, biscotti, muesli o fette biscottate',
                'pranzi con pasta, riso, farro o orzo, sempre con verdure e una fonte proteica magra o uova',
                'cene piu leggere con passato di verdure, pesce, bresaola, Grana Padano o hamburger al forno'
            ],
            patternDays: [
                'lunedi: bigoli integrali alle verdure con coniglio a pranzo, passato di verdure con pasta e rana pescatrice a cena',
                'mercoledi: riso con crema di ceci a pranzo, riso con lenticchie rosse e spinaci filanti a cena',
                'venerdi: fusilli integrali con fagiolini e sogliola a pranzo, tostata integrale con crema di carciofi e bresaola a cena',
                'domenica: lasagne di verdura con spigola a pranzo, riso con crema di asparagi e Grana Padano a cena'
            ],
            behavioralRules: [
                'massimo 2 cucchiaini di zucchero al giorno',
                'alcol molto limitato e sempre contestualizzato'
            ]
        },
        {
            label: 'esempio-organizzazione-domestica-varia',
            recurringStructure: [
                'pranzi e cene alternano cereali, legumi, pesce, pollo, uova, formaggi e carne senza diventare monotoni',
                'la settimana riusa ingredienti compatibili in piu piatti per limitare spreco e spesa impulsiva',
                'i pasti restano domestici, pratici e leggibili, con equilibrio tra fantasia e gestione reale della cucina'
            ],
            patternDays: [
                'lunedi: quinoa con fagioli rossi, avocado e verdure di stagione; branzino al cartoccio con aromi, pane e insalata mista con semi di girasole',
                'martedi: insalata di farro con pomodorini, rucola, feta e olive; straccetti di pollo al limone con contorno di insalata e pane',
                'mercoledi: bastoncini di polenta con ragu di lenticchie e insalata; orata al forno con patate e verdure di stagione',
                'giovedi: piadina con hummus di ceci e verdure grigliate; pasta con ricotta e zucchine',
                'venerdi: crocchette di miglio con piselli e carote; crema di verdure alla paprika con pane tostato e uova in camicia',
                'sabato: cous cous con ceci e verdure al curry; merluzzo con pomodorini e olive, insalata e pane',
                'domenica: tagliatelle al ragu di manzo e verdure di stagione; uova strapazzate con spinaci e pane bruschettato al rosmarino'
            ],
            behavioralRules: [
                'il menu riduce il carico mentale della scelta quotidiana',
                'sapere cosa cucinare in anticipo riduce processati, asporto e acquisti inutili'
            ]
        },
        {
            label: 'esempio-settimana-vegetale-mediterranea',
            recurringStructure: [
                'cereali o derivati compaiono a ogni pasto principale e legumi o altre proteine vegetali almeno due volte al giorno',
                'la settimana usa piatti italiani gia naturalmente vegetali prima di ricorrere a sostituzioni complesse',
                'spesa e meal prep sono pensati per corsie, riuso ingredienti e riduzione del carico mentale'
            ],
            patternDays: [
                'lunedi: porridge con bevanda di soia, mela e noci; pasta al pomodoro con ceci e insalata; ribollita con cavolo nero e pane tostato',
                'martedi: pane integrale con crema di frutta secca e frutta; insalata di farro con lenticchie, pomodorini e rucola; caponata con hummus e pane',
                'mercoledi: yogurt di soia con avena e frutti di bosco; panzanella con fagioli bianchi; zuppa di orzo e piselli con verdure di stagione',
                'giovedi: chia pudding con pera e semi di zucca; cous cous con ceci e verdure al curry; polpette di lenticchie con contorno di broccoli e pane',
                'venerdi: pancake senza uova con banana e yogurt di soia; pasta e fagioli con verdure; teglia di patate, tofu, cipolle e rosmarino'
            ],
            behavioralRules: [
                'la tradizione italiana vegetale puo sostenere un menu vegan credibile, saziante e poco artificioso',
                'controllare calcio, semi ricchi di Omega 3 e varietà dei legumi migliora la completezza della settimana'
            ]
        }
    ];
}

function buildVeganBreakfastFallback(payload) {
    const proteinTarget = Number(payload.profile.proteinTargetGrams || 0);
    const breakfastProtein = proteinTarget > 0 ? Math.max(18, Math.round(proteinTarget * 0.22)) : 22;
    const snackProtein = proteinTarget > 0 ? Math.max(10, Math.round(proteinTarget * 0.12)) : 12;
    const lunchContext = payload.lunchContext === 'free-day' ? 'free-day' : 'workday';

    return {
        breakfastOptions: [
            {
                title: 'Yogurt di soia, avena e frutta',
                whyItFits: 'Tiene una struttura mattutina semplice, completamente vegetale e con quota proteica leggibile.',
                items: ['150-180 g yogurt di soia', '35-45 g fiocchi di avena o muesli semplice', '1 porzione di frutta', 'eventuali semi di chia o lino macinati'],
                notes: ['Facile da ripetere', 'Utile anche per inserire calcio e Omega 3 vegetali'],
                macros: { kcal: 320, protein: breakfastProtein, carbs: 36, fat: 9 }
            },
            {
                title: 'Porridge con bevanda di soia, banana e frutta secca',
                whyItFits: 'Colazione vegetale piu calda e saziante, utile quando vuoi una partenza piu morbida ma ordinata.',
                items: ['40 g avena', '200 ml bevanda di soia senza zuccheri', '1/2 banana o altra frutta', '15 g frutta secca'],
                notes: ['Buona per meal prep breve', 'Resta pienamente vegetale senza sostituzioni complesse'],
                macros: { kcal: 340, protein: Math.max(16, breakfastProtein - 2), carbs: 38, fat: 11 }
            },
            {
                title: 'Pane integrale con crema 100% di frutta secca e frutta fresca',
                whyItFits: 'Versione molto pratica per chi vuole una colazione mediterranea vegetale e poco macchinosa.',
                items: ['2-3 fette di pane integrale', '1 cucchiaino abbondante di crema 100% di frutta secca', '1 porzione di frutta', 'eventuale yogurt di soia piccolo a supporto'],
                notes: ['Utile anche fuori casa', 'Puoi ruotare pane, frutta e crema senza cambiare logica'],
                macros: { kcal: 330, protein: Math.max(14, breakfastProtein - 4), carbs: 40, fat: 12 }
            }
        ],
        snackOptions: [
            {
                title: lunchContext === 'free-day' ? 'Spuntino leggero con frutta e semi' : 'Spuntino pratico con frutta e yogurt di soia',
                whyItFits: lunchContext === 'free-day'
                    ? 'Tiene ordinata la fame senza appesantire una giornata piu distesa.'
                    : 'Aiuta a distribuire fame e proteine in una giornata piu compressa.',
                items: lunchContext === 'free-day'
                    ? ['1 frutto', '1 cucchiaio di semi o 10-15 g frutta secca']
                    : ['1 yogurt di soia', '1 frutto piccolo'],
                notes: ['Formato semplice', 'Resta coerente con una giornata 100% vegetale'],
                macros: { kcal: lunchContext === 'free-day' ? 150 : 170, protein: snackProtein, carbs: 16, fat: lunchContext === 'free-day' ? 7 : 4 }
            },
            {
                title: 'Frutta fresca e frutta secca',
                whyItFits: 'Spuntino essenziale, mediterraneo e facile da ripetere senza dipendere da prodotti confezionati.',
                items: ['1 porzione di frutta', '15-20 g frutta secca'],
                notes: ['Molto rapido', 'Utile come base standard della settimana'],
                macros: { kcal: 180, protein: 5, carbs: 18, fat: 10 }
            },
            {
                title: 'Hummus veloce con crackers integrali o verdure crude',
                whyItFits: 'Aggiunge una quota leguminosa e rende piu facile arrivare a due momenti proteici vegetali al giorno.',
                items: ['2 cucchiai di hummus', 'crackers integrali oppure carote e finocchi'],
                notes: ['Molto utile nei pomeriggi lunghi', 'Aiuta anche a riusare preparazioni gia aperte'],
                macros: { kcal: 170, protein: snackProtein, carbs: 16, fat: 7 }
            }
        ],
        guidance: [
            'Nel vegan i pasti principali possono restare mediterranei e molto semplici: cereale, legume o proteina vegetale, verdure, frutta e grassi vegetali ben scelti.',
            'Controlla che legumi o altre proteine vegetali compaiano almeno due volte al giorno e che cereali o derivati siano presenti a ogni pasto principale.',
            'Distribuisci semi di lino, chia o frutta secca nella giornata per completare meglio il profilo lipidico.',
            'La settimana deve restare pratica: ripeti alcune basi utili e varia soprattutto pranzi e cene.'
        ]
    };
}

function buildVeganDailyPlanFallback(payload) {
    const targetCalories = Math.round(payload.profile.targetCalories || 0);
    const proteinGrams = Math.round(payload.profile.proteinTargetGrams || 0);
    const isFreeDayLunch = payload.lunchContext === 'free-day';
    const breakfastKcal = Math.round(targetCalories * 0.22);
    const lunchKcal = Math.round(targetCalories * 0.3);
    const dinnerKcal = Math.round(targetCalories * 0.28);
    const snackKcal = Math.max(120, Math.round((targetCalories - breakfastKcal - lunchKcal - dinnerKcal) / 2));
    const lunchCompletion = completeWeeklyMealItems(
        'Pranzo',
        isFreeDayLunch
            ? ['base amidacea come farro, riso integrale, pasta, quinoa o cous cous', 'ceci, lenticchie o fagioli come quota proteica principale', 'verdure crude e cotte ben presenti', 'olio EVO dichiarato', 'eventuale frutta a fine pasto']
            : ['base amidacea come farro, riso integrale, pasta, quinoa o cous cous', 'legumi gia cotti o tofu come quota proteica', 'verdure di accompagnamento', 'olio EVO dichiarato', 'struttura facile da preparare o portare fuori casa'],
        {
            protein: 'aggiungi una fonte proteica vegetale leggibile come legumi, tofu, tempeh o edamame',
            cereal: 'completa con una base amidacea chiara come riso, farro, pasta o pane integrale',
            vegetables: 'assicurati che ci sia una quota di verdure ben leggibile',
            healthyFat: 'dichiara una quota di grassi buoni come olio EVO, semi o frutta secca'
        }
    );
    const dinnerCompletion = completeWeeklyMealItems(
        'Cena',
        ['apertura con insalata, carota o finocchio', getVeganDinnerProteinText(), isFreeDayLunch ? 'patate o pane integrale come quota glucidica semplice' : 'riso, pane o patate in quota semplice', 'verdure cotte o crude di accompagnamento', 'olio EVO ben dichiarato', 'eventuale frutta se coerente con fame e giornata'],
        {
            protein: 'aggiungi una fonte proteica vegetale chiara coerente con la cena',
            cereal: 'se manca, completa con pane, cereale semplice o patate',
            vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
            healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO o semi'
        }
    );

    return {
        title: 'Giornata alimentare vegetale costruita sul tuo profilo',
        daily_theme: isFreeDayLunch ? 'Giornata: Vegetale, Recupero e Distensione' : 'Giornata: Vegetale, Energia Pulita e Focus',
        rationale: `Esempio di giornata 100% vegetale costruito per mantenere equilibrio, praticita e buona distribuzione della quota proteica.${payload.preferences ? ` Nota considerata: ${payload.preferences}.` : ''}`,
        lunchContext: payload.lunchContext,
        targets: {
            maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
            carbsGrams: Math.round(payload.profile.carbsTargetGrams || 0),
            fatGrams: Math.round(payload.profile.fatTargetGrams || 0),
            fiberGrams: Math.round(payload.profile.fiberTargetGrams || 0),
            hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
        },
        meals: [
            {
                slot: 'Colazione',
                title: 'Yogurt di soia, avena e frutta',
                whyItFits: 'Apre la giornata con una struttura vegetale semplice, ripetibile e facile da completare con calcio e fibra.',
                items: ['yogurt di soia o bevanda di soia', 'avena o cereali semplici', '1 porzione di frutta', 'eventuali semi di lino o chia'],
                kcal: breakfastKcal,
                protein: Math.max(18, Math.round(proteinGrams * 0.22)),
                carbs: 36,
                fat: 9
            },
            {
                slot: 'Spuntino mattina',
                title: 'Frutta e piccola quota di semi o yogurt di soia',
                whyItFits: 'Aiuta a distribuire energia e a far comparire frutta 2-3 volte al giorno senza appesantire.',
                items: ['1 frutto', 'piccola quota di semi, frutta secca o yogurt di soia'],
                kcal: snackKcal,
                protein: Math.max(10, Math.round(proteinGrams * 0.1)),
                carbs: 16,
                fat: 6
            },
            {
                slot: 'Pranzo',
                title: isFreeDayLunch ? 'Pranzo vegetale da giorno libero piu disteso' : 'Pranzo vegetale pratico e strutturato',
                whyItFits: isFreeDayLunch
                    ? 'Tiene una struttura mediterranea vegetale piu calma ma ancora ben organizzata.'
                    : 'Resta facile da preparare o portare fuori casa senza perdere completezza.',
                items: lunchCompletion.items,
                kcal: lunchKcal,
                protein: Math.max(24, Math.round(proteinGrams * 0.3)),
                carbs: 56,
                fat: 16
            },
            {
                slot: 'Spuntino pomeriggio',
                title: 'Spuntino di riequilibrio con frutta e base vegetale',
                whyItFits: 'Aiuta a non arrivare scarichi alla cena e rende piu facile distribuire frutta, legumi o soia nella giornata.',
                items: ['1 frutto oppure verdure crude', 'hummus, yogurt di soia o piccola quota di frutta secca'],
                kcal: snackKcal,
                protein: Math.max(10, Math.round(proteinGrams * 0.1)),
                carbs: 15,
                fat: 7
            },
            {
                slot: 'Cena',
                title: 'Cena con proteina vegetale leggibile e verdure',
                whyItFits: 'Chiude la giornata con una fonte proteica vegetale chiara, verdure abbondanti e una quota glucidica semplice e misurata.',
                items: dinnerCompletion.items,
                kcal: dinnerKcal,
                protein: Math.max(24, Math.round(proteinGrams * 0.28)),
                carbs: isFreeDayLunch ? 34 : 40,
                fat: 16
            }
        ],
        notes: [
            'Nel menu vegetale controlla che cereali o derivati compaiano in ogni pasto principale e che legumi o altre proteine vegetali ricorrano almeno due volte al giorno.',
            'Verdure abbondanti a pranzo e cena, frutta 2-3 volte al giorno e grassi vegetali distribuiti con misura aiutano equilibrio e aderenza.',
            'Verifica durante la giornata la presenza di cibi vegetali ricchi di calcio e decidi dove inserire semi di lino o chia per il capitolo Omega 3.',
            lunchCompletion.addedComponents.length > 0
                ? `Controllo pranzo completato: integrate ${lunchCompletion.addedComponents.join(', ')}.`
                : 'Controllo pranzo completato: struttura gia completa e leggibile.',
            dinnerCompletion.addedComponents.length > 0
                ? `Controllo cena completato: integrate ${dinnerCompletion.addedComponents.join(', ')}.`
                : 'Controllo cena completato: struttura gia completa e leggibile.'
        ]
    };
}

function buildVeganWeeklyPlanFallback(payload) {
    const targetCalories = Math.round(payload.profile.targetCalories || 0);
    const proteinGrams = Math.round(payload.profile.proteinTargetGrams || 0);
    const weeklyDays = [
        { day: 'Lunedi', focus: 'Partenza semplice con soia, ceci e verdure', lunch: 'Pasta al pomodoro con ceci e insalata', dinner: 'Ribollita con cavolo nero e pane tostato' },
        { day: 'Martedi', focus: 'Farro e lenticchie per un pranzo da batch cooking', lunch: 'Insalata di farro con lenticchie, pomodorini e rucola', dinner: 'Caponata con hummus e pane integrale' },
        { day: 'Mercoledi', focus: 'Piatto freddo a pranzo e zuppa di cereali la sera', lunch: 'Panzanella con fagioli bianchi e cetrioli', dinner: 'Zuppa di orzo e piselli con verdure di stagione' },
        { day: 'Giovedi', focus: 'Rotazione tra ceci, cous cous e verdure grigliate', lunch: 'Cous cous con ceci e verdure al curry', dinner: 'Verdure grigliate, tofu al forno e pane' },
        { day: 'Venerdi', focus: 'Lenticchie e tofu per mantenere la doppia quota proteica vegetale', lunch: 'Pasta e fagioli con contorno di verdure', dinner: 'Teglia di patate, tofu, cipolle e rosmarino' },
        { day: 'Sabato', focus: 'Weekend pratico ma ancora ordinato', lunch: 'Riso integrale con edamame e zucchine', dinner: 'Minestrone con crostini e crema di cannellini' },
        { day: 'Domenica', focus: 'Tradizione italiana vegetale e preparazioni condivisibili', lunch: 'Lasagne vegetali o pasta al forno di verdure e legumi', dinner: 'Bruschette, verdure grigliate e crema di ceci o cannellini' }
    ];

    const days = weeklyDays.map((day, index) => {
        const lunchCompletion = completeWeeklyMealItems(
            'Pranzo',
            [day.lunch, 'verdure abbondanti', 'olio EVO dichiarato'],
            {
                protein: 'aggiungi una fonte proteica vegetale leggibile come legumi, tofu, tempeh o edamame',
                cereal: 'completa con una base amidacea chiara come farro, riso, pasta, pane o cous cous',
                vegetables: 'assicurati che siano presenti verdure di contorno o apertura vegetale',
                healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO, semi o frutta secca'
            }
        );
        const dinnerCompletion = completeWeeklyMealItems(
            'Cena',
            [day.dinner, 'verdure cotte o crude di supporto', 'olio EVO dichiarato'],
            {
                protein: 'aggiungi una proteina vegetale chiara coerente con la rotazione settimanale',
                cereal: 'se manca, completa con una quota semplice di pane, cereale o patate',
                vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
                healthyFat: 'dichiara sempre una quota misurata di grassi buoni, preferibilmente olio EVO o semi'
            }
        );

        return {
            day: day.day,
            daily_theme: `${day.day}: ${day.focus}`,
            focus: day.focus,
            meals: [
                {
                    slot: 'Colazione',
                    title: index % 2 === 0 ? 'Yogurt di soia, avena e frutta' : 'Pane integrale con crema di frutta secca e frutta fresca',
                    items: index % 2 === 0
                        ? ['yogurt di soia', 'avena o cereali semplici', '1 porzione di frutta', 'eventuali semi di lino o chia']
                        : ['pane integrale', 'crema 100% di frutta secca', '1 porzione di frutta', 'eventuale bevanda di soia']
                },
                {
                    slot: 'Spuntini',
                    title: 'Frutta come base degli spuntini con supporti vegetali semplici',
                    items: ['Mattina: frutta fresca con semi o yogurt di soia', 'Pomeriggio: frutta, hummus o piccola quota di frutta secca']
                },
                {
                    slot: 'Pranzo',
                    title: day.lunch,
                    items: lunchCompletion.items
                },
                {
                    slot: 'Cena',
                    title: day.dinner,
                    items: dinnerCompletion.items
                }
            ],
            notes: [
                `Focus del giorno: ${day.focus}`,
                index >= 5
                    ? 'Nel fine settimana il piano puo essere piu condivisibile e conviviale, ma senza perdere equilibrio.'
                    : `Nel contesto ${getLunchContextLabel(payload.lunchContext)} la priorita resta la praticita reale della giornata.`,
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
        title: 'Settimana alimentare 100% vegetale coerente con il profilo',
        rationale: `Schema settimanale vegetale costruito per unire completezza, tradizione mediterranea, praticita domestica e spesa piu ordinata.${payload.preferences ? ` Nota considerata: ${payload.preferences}.` : ''}`,
        targets: {
            maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
            carbsGrams: Math.round(payload.profile.carbsTargetGrams || 0),
            fatGrams: Math.round(payload.profile.fatTargetGrams || 0),
            fiberGrams: Math.round(payload.profile.fiberTargetGrams || 0),
            hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
        },
        days,
        notes: [
            'Nel menu vegetale usa cereali o derivati a ogni pasto principale e fai comparire legumi o altre proteine vegetali almeno due volte al giorno.',
            'Verdure abbondanti a pranzo e cena, frutta 2-3 volte al giorno e grassi vegetali distribuiti con misura rendono la settimana piu completa e piu sostenibile.',
            'Controlla piu volte al giorno cibi vegetali ricchi di calcio e decidi in quali piatti inserire semi di lino, chia o olio di lino per il capitolo Omega 3.',
            'La lista della spesa va costruita dopo avere controllato dispensa, frigo e freezer e conviene ordinarla per corsie del supermercato.',
            'La tradizione italiana offre gia molti piatti vegetali naturali: non serve trasformare tutto in sostituzioni complicate.'
        ]
    };
}

function buildBreakfastFallback(payload) {
    if (shouldApplyVeganGuidance(payload.profile, payload.preferences)) {
        return buildVeganBreakfastFallback(payload);
    }

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
    if (shouldApplyVeganGuidance(payload.profile, payload.preferences)) {
        return buildVeganDailyPlanFallback(payload);
    }

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
        const lunchCompletion = completeWeeklyMealItems(
            'Pranzo',
            dailyPattern.lunch?.items || ['80 g pasta o riso o farro o orzo con condimenti vegetali', 'oppure 40 g pasta + 50 g legumi secchi + 1 cucchiaino di parmigiano', 'verdura cotta o cruda a piacere', '20 g olio EVO preferibilmente a crudo', '20 g pane semplice senza sale'],
            {
                protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova o carne bianca',
                cereal: 'completa con una base amidacea chiara come riso, farro, pasta o pane semplice',
                vegetables: 'assicurati che sia presente una quota di verdure ben leggibile',
                healthyFat: 'dichiara una quota misurata di grassi buoni come olio EVO a crudo'
            }
        );
        const dinnerCompletion = completeWeeklyMealItems(
            'Cena',
            dailyPattern.dinner?.items || ['brodo o passato di verdure senza legumi e patate a piacere', 'secondo piatto: 200 g carne magra oppure 300 g pesce magro oppure 180 g pesce semigrasso oppure 90 g legumi secchi oppure 2 uova', 'verdura cotta o cruda a piacere', '10 g olio EVO preferibilmente a crudo', '60 g pane semplice senza sale'],
            {
                protein: 'aggiungi una fonte proteica chiara coerente con il pasto serale',
                cereal: 'se manca, completa con pane semplice, cereale o patate',
                vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
                healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO a crudo'
            }
        );
        return {
            title: 'Giornata alimentare ispirata a un metodo clinico-pratico',
            daily_theme: isFreeDayLunch ? 'Giornata: Gestione Clinica e Recupero Disteso' : 'Giornata: Gestione Clinica e Continuita Energetica',
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
                    items: lunchCompletion.items,
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
                    items: dinnerCompletion.items,
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
                lunchCompletion.addedComponents.length > 0
                    ? `Controllo pranzo completato: integrate ${lunchCompletion.addedComponents.join(', ')}.`
                    : 'Controllo pranzo completato: struttura gia completa e leggibile.',
                dinnerCompletion.addedComponents.length > 0
                    ? `Controllo cena completato: integrate ${dinnerCompletion.addedComponents.join(', ')}.`
                    : 'Controllo cena completato: struttura gia completa e leggibile.',
                clinicalContext.avoidFoods || 'Da limitare: fritture, intingoli, carni grasse, insaccati, dolci frequenti, bibite zuccherate, liquori e aperitivi.',
                ...(dailyPattern.notes || [])
            ]
        };
    }

    const lunchCompletion = completeWeeklyMealItems(
        'Pranzo',
        isFreeDayLunch
            ? ['Inizio con verdure crude semplici come insalata, carota o finocchio', 'base amidacea come farro, riso integrale, pasta, quinoa, cous-cous o gnocchi', 'legumi gia cotti o edamame come quota proteica e di fibra', 'verdure piu presenti o piatto un po piu curato', 'olio EVO ben dichiarato', 'eventuale piccola nota dolce finale solo se davvero coerente con il profilo']
            : ['Inizio con verdure crude semplici se praticabile', 'base amidacea come farro, riso integrale, pasta, quinoa, cous-cous o gnocchi', 'legumi gia cotti o edamame come quota proteica e di fibra', 'verdure di accompagnamento', 'olio EVO ben dichiarato', 'struttura facile da preparare in anticipo o portare fuori casa'],
        {
            protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova, tofu o carne bianca',
            cereal: 'completa con una base amidacea chiara come riso, farro, pasta o pane integrale',
            vegetables: 'assicurati che sia presente una quota di verdure ben leggibile',
            healthyFat: 'dichiara una quota misurata di grassi buoni come olio EVO o semi'
        }
    );
    const dinnerCompletion = completeWeeklyMealItems(
        'Cena',
        ['Inizio con insalata oppure carota o finocchio da sgranocchiare', dinnerProteinOption, dinnerCarbOption, 'verdure cotte o crude di accompagnamento', '2 cucchiai di olio EVO ben dichiarati', 'eventuale 1 porzione di frutta a fine pasto se coerente con fame e giornata'],
        {
            protein: 'aggiungi una fonte proteica chiara coerente con la cena',
            cereal: 'se manca, completa con una quota semplice di pane, cereale o patate',
            vegetables: 'aggiungi una quota di verdure cotte o crude ben leggibile',
            healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO a crudo'
        }
    );

    return {
        title: 'Giornata alimentare costruita sul tuo profilo',
        daily_theme: isFreeDayLunch ? 'Giornata: Equilibrio Disteso e Recupero' : 'Giornata: Focus Energetico e Ritmo Sostenibile',
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
                    items: lunchCompletion.items,
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
                    items: dinnerCompletion.items,
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
            lunchCompletion.addedComponents.length > 0
                ? `Controllo pranzo completato: integrate ${lunchCompletion.addedComponents.join(', ')}.`
                : 'Controllo pranzo completato: struttura gia completa e leggibile.',
            dinnerCompletion.addedComponents.length > 0
                ? `Controllo cena completato: integrate ${dinnerCompletion.addedComponents.join(', ')}.`
                : 'Controllo cena completato: struttura gia completa e leggibile.',
            'La cena puo ruotare tra uova, tofu, tempeh, latticini light o burger vegetali proteici: la frequenza settimanale serve come logica di varieta, non come regola rigida del singolo output.',
            'Se esiste l abitudine al dolce a fine pasto, una piccola quota di cioccolato fondente può essere usata in modo occasionale e non quotidiano come leva di disabitudine.'
        ]
    };
}

function buildWeeklyPlanFallback(payload) {
    if (shouldApplyVeganGuidance(payload.profile, payload.preferences)) {
        return buildVeganWeeklyPlanFallback(payload);
    }

    const clinicalContext = getClinicalNutritionContext(payload.profile);
    const weeklyPattern = cloneClinicalGuidanceValue(clinicalContext.weeklyPattern || {});
    const dailyPattern = cloneClinicalGuidanceValue(clinicalContext.dailyPattern || {});
    const targetCalories = Math.round(payload.profile.targetCalories || 0);
    const proteinGrams = Math.round(payload.profile.proteinTargetGrams || 0);
    const carbsGrams = Math.round(payload.profile.carbsTargetGrams || 0);
    const fatGrams = Math.round(payload.profile.fatTargetGrams || 0);

    const days = (weeklyPattern.days || []).map((day, index) => {
        const lunchCompletion = completeWeeklyMealItems(
            'Pranzo',
            index === 5 || index === 6
                ? ['80 g pasta o riso o farro o orzo con condimenti vegetali', 'verdure cotte o crude a piacere', '20 g olio EVO preferibilmente a crudo', '20 g pane semplice senza sale']
                : (dailyPattern.lunch?.items || []),
            {
                protein: 'aggiungi una fonte proteica leggibile come legumi, pesce, uova o carne bianca secondo la rotazione della settimana',
                cereal: 'completa con una base amidacea chiara come farro, riso, pasta, pane o orzo',
                vegetables: 'assicurati che siano presenti verdure di contorno o apertura vegetale',
                healthyFat: 'mantieni una quota dichiarata di grassi buoni come olio EVO a crudo'
            }
        );
        const dinnerCompletion = completeWeeklyMealItems(
            'Cena',
            ['brodo o passato di verdure senza patate o legumi a piacere', `fonte proteica prioritaria: ${day.dinnerProtein}`, 'verdura cotta o cruda a piacere', '10 g olio EVO preferibilmente a crudo', '60 g pane semplice senza sale'],
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
                    : `Nel contesto ${getLunchContextLabel(payload.lunchContext).toLowerCase()} la priorita resta la praticita.`,
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
        rationale: `${weeklyPattern.rationale || 'Schema settimanale costruito per dare continuita e organizzazione.'}${payload.preferences ? ` Nota considerata: ${payload.preferences}.` : ''}`,
        targets: {
            maintenanceCalories: Math.round(payload.profile.maintenanceCalories || 0),
            targetCalories,
            deltaCalories: Math.round(payload.profile.goalCalorieDelta || 0),
            proteinGrams,
            proteinPerKg: Number(payload.profile.proteinTargetPerKg || 0).toFixed(1),
            carbsGrams,
            fatGrams,
            fiberGrams: Math.round(payload.profile.fiberTargetGrams || 0),
            hydrationLiters: Number(payload.profile.waterTargetLiters || 0).toFixed(1)
        },
        days,
        notes: [
            clinicalContext.weightNote || 'I pesi si intendono a crudo e al netto degli scarti.',
            clinicalContext.proteinRotation || 'Rotazione proteica consigliata lungo la settimana.',
            ...getWeeklyProteinFrequencyGuidance(),
            'Il menu settimanale resta uno strumento flessibile: puoi modificare i singoli pasti in base a impegni, pasti fuori casa e desideri senza perdere il filo nutrizionale.',
            'Per ogni pasto controlla la completezza della struttura: cereale o altra base amidacea, proteina, verdure e grassi buoni quando coerenti con il profilo.',
            'Una volta chiuso il menu, evidenzia cio che hai gia in dispensa, frigo o freezer e costruisci la lista della spesa solo su quello che manca.',
            'Procedi per piccoli passi: meglio una pianificazione semplice e fattibile che un piano perfetto ma difficile da mantenere.',
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
    const antiAgeGuidance = shouldApplyAntiAgeGuidance(payload.profile) ? getAntiAgeGuidance() : [];
    const veganGuidance = shouldApplyVeganGuidance(payload.profile, payload.preferences) ? getVeganMenuGuidance() : [];

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi generare colazioni e spuntini equivalenti, non regole universali.',
        'Usa IMC, fabbisogno, piano calorico e quota proteica come contesto del singolo utente.',
        'Se la dieta e vegana o 100% vegetale, escludi completamente alimenti di origine animale e costruisci proposte con basi vegetali realistiche, sazianti e mediterranee.',
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
        antiAgeGuidance.length > 0 ? `Metodo anti-age: ${JSON.stringify(antiAgeGuidance)}` : '',
        veganGuidance.length > 0 ? `Metodo vegetale 100% plant-based: ${JSON.stringify(veganGuidance)}` : '',
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
    const dailyReferenceExamples = getDailyPlanReferenceExamples();
    const antiAgeGuidance = shouldApplyAntiAgeGuidance(payload.profile) ? getAntiAgeGuidance() : [];
    const veganGuidance = shouldApplyVeganGuidance(payload.profile, payload.preferences) ? getVeganMenuGuidance() : [];

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi costruire un esempio di piano giornaliero coerente con il profilo del singolo utente.',
        'Ragiona in privato e non mostrare il chain of thought. Prima dell output segui questo protocollo: analisi metabolica e vincoli, crononutrizione dei pasti, scelta tecnica e digestiva, poi sintesi del filo conduttore della giornata.',
        'Distingui sempre fabbisogno, piano calorico e ruolo dei singoli pasti.',
        'Se la dieta e vegana o 100% vegetale, escludi completamente gli alimenti di origine animale e distribuisci cereali, legumi o altre proteine vegetali, verdure, frutta e grassi vegetali con logica mediterranea.',
        'Usa il target proteico in g/kg per distribuire la quota proteica nella giornata in modo sensato.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, puoi usare un pattern semplice e molto aderente: colazione sobria, frutta come spuntino base, pranzo con cereale e condimenti vegetali, cena con proteina magra, verdure, pane e olio EVO a crudo.',
        'Assorbi il metodo di due esempi giornalieri interni di riferimento, uno piu vicino a 2000 kcal e uno ipocalorico intorno a 1600 kcal: non copiarli, usali per struttura, densita energetica, semplicita e ripetibilita.',
        'Non copiare esempi professionali: usane il metodo.',
        'Restituisci solo JSON valido con shape {"plan":{"title":"","daily_theme":"","rationale":"","targets":{"maintenanceCalories":0,"targetCalories":0,"deltaCalories":0,"proteinGrams":0,"proteinPerKg":0,"carbsGrams":0,"fatGrams":0,"fiberGrams":0,"hydrationLiters":0},"meals":[{"slot":"","title":"","whyItFits":"","items":[""],"kcal":0,"protein":0,"carbs":0,"fat":0}],"notes":[""]}}',
        'Genera una giornata completa con almeno 5 momenti: colazione, spuntino mattina, pranzo, spuntino pomeriggio, cena.'
    ].join(' ');

    const userPrompt = [
        `Profilo: IMC ${payload.profile.imc || 0} (${payload.profile.imcCategory || 'non specificato'})`,
        `Fabbisogno: ${payload.profile.maintenanceCalories || 0} kcal`,
        `Piano calorico: ${payload.profile.targetCalories || 0} kcal`,
        `Delta del piano: ${payload.profile.goalCalorieDelta || 0} kcal`,
        `Proteine target: ${payload.profile.proteinTargetPerKg || 0} g/kg, circa ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Carboidrati target: ${payload.profile.carbsTargetGrams || 0} g/die`,
        `Grassi target: ${payload.profile.fatTargetGrams || 0} g/die`,
        `Fibra target: ${payload.profile.fiberTargetGrams || 0} g/die`,
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
        antiAgeGuidance.length > 0 ? `Metodo anti-age: ${JSON.stringify(antiAgeGuidance)}` : '',
        veganGuidance.length > 0 ? `Metodo menu vegetale 100% plant-based: ${JSON.stringify(veganGuidance)}` : '',
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.promptLines)}`,
        `Esempi giornalieri interni di riferimento: ${JSON.stringify(dailyReferenceExamples)}`,
        'Costruisci un esempio di giornata completo, leggibile, realistico e coerente con il profilo.',
        'Genera anche daily_theme: una frase breve che riassume il filo conduttore della giornata, per esempio Lunedi: Detox e Focus Energetico oppure Giornata: Sazieta Pulita e Recupero.',
            'Nel testo finale devi far comparire in modo esplicito la preferenza proteica serale del profilo e l eventuale frequenza settimanale suggerita, non solo come ragionamento implicito.',
            'Nel blocco Cena nomina chiaramente la fonte proteica coerente con la preferenza serale, rendendola visibile nel titolo del piatto, negli ingredienti o nella spiegazione del perche funziona.',
            'Se e presente una frequenza settimanale suggerita, dichiarala in modo breve e leggibile nel piano o nel rationale, distinguendola chiaramente dalla preferenza serale.',
        'Per il pranzo puoi usare la logica professionale di apertura con verdure crude, base amidacea modulabile, legumi o edamame come quota proteico-fibrosa, verdure e olio EVO dichiarato.',
        'Per la cena puoi usare la logica professionale di apertura con verdure crude, fonte proteica ruotabile tra uova, tofu, tempeh, latticini light o alternative vegetali proteiche, quota glucidica semplice e olio EVO dichiarato; la frutta finale resta opzionale e contestualizzata.',
        'Se la preferenza serale privilegia tofu o tempeh, puoi richiamare mini-template concreti come tofu limone e pepe rosa, tempeh tahina e limone o polpette di tofu e spinaci, adattandoli al profilo e agli ingredienti.',
        `Indicazione operativa sulla frequenza serale: ${getDinnerProteinFrequencyPrompt(payload.profile.dinnerProteinFrequency)}.`,
        'Distingui esplicitamente il pranzo da giorno lavorativo e il pranzo da giorno libero: nel primo caso privilegia praticita, trasportabilita e comfort nel pomeriggio; nel secondo puoi permettere una struttura un po piu calma e curata, senza perdere coerenza col piano.',
        'L eventuale nota dolce finale va trattata solo come strategia comportamentale contestualizzata, non come automatismo. Se compare, puo essere una piccola quota di cioccolato fondente solo quando coerente con il profilo e con la gestione dell abitudine al dolce.',
        'Nel blocco targets restituisci anche carboidrati, grassi e fibra in grammi, non solo proteine e calorie.',
        'Gli esempi giornalieri interni non devono mai comparire nella risposta finale: servono solo come riferimento invisibile per migliorare struttura e coerenza del piano.'
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
    parsed.plan = normalizeDailyPlanTheme(parsed.plan, payload.lunchContext);

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
    const weeklyReferenceExamples = getWeeklyPlanReferenceExamples();
    const antiAgeGuidance = shouldApplyAntiAgeGuidance(payload.profile) ? getAntiAgeGuidance() : [];
    const veganGuidance = shouldApplyVeganGuidance(payload.profile, payload.preferences) ? getVeganMenuGuidance() : [];

    const systemPrompt = [
        'Sei un nutrizionista clinico con approccio pratico e non prescrittivo.',
        'Devi costruire un piano settimanale realistico, leggibile e sostenibile per il profilo del singolo utente.',
        'Ragiona in privato e non mostrare il chain of thought. Prima dell output segui questo protocollo: analisi metabolica e vincoli, crononutrizione della settimana, rotazione proteica, poi definizione del daily_theme di ogni giorno.',
        'Se la dieta e vegana o 100% vegetale, escludi completamente gli alimenti di origine animale e costruisci una settimana mediterranea con cereali, legumi o altre proteine vegetali, verdure, frutta e grassi vegetali.',
        'Non scrivere una prescrizione clinica rigida: costruisci una mappa organizzativa coerente con obiettivo, fame, aderenza e rotazione proteica.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, privilegia una settimana molto semplice: colazioni sobrie, spuntini di frutta, pranzi leggibili e cene con rotazione proteica chiara.',
        'Assorbi il metodo di due esempi settimanali di riferimento, uno da 2000 kcal e uno ipocalorico da 1600 kcal: non copiarli, ma usali per struttura, densita dei pasti, ripetibilita e rotazione della settimana.',
        'Restituisci solo JSON valido con shape {"week":{"title":"","rationale":"","targets":{"maintenanceCalories":0,"targetCalories":0,"deltaCalories":0,"proteinGrams":0,"proteinPerKg":0,"carbsGrams":0,"fatGrams":0,"fiberGrams":0,"hydrationLiters":0},"days":[{"day":"","daily_theme":"","focus":"","meals":[{"slot":"","title":"","items":[""]}],"notes":[""]}],"notes":[""]}}',
        'Genera 7 giorni completi.'
    ].join(' ');

    const userPrompt = [
        `Profilo: IMC ${payload.profile.imc || 0} (${payload.profile.imcCategory || 'non specificato'})`,
        `Fabbisogno: ${payload.profile.maintenanceCalories || 0} kcal`,
        `Piano calorico: ${payload.profile.targetCalories || 0} kcal`,
        `Delta del piano: ${payload.profile.goalCalorieDelta || 0} kcal`,
        `Proteine target: ${payload.profile.proteinTargetPerKg || 0} g/kg, circa ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Carboidrati target: ${payload.profile.carbsTargetGrams || 0} g/die`,
        `Grassi target: ${payload.profile.fatTargetGrams || 0} g/die`,
        `Fibra target: ${payload.profile.fiberTargetGrams || 0} g/die`,
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
        `Metodo menu settimanale: ${JSON.stringify(getWeeklyMenuGuidance())}`,
        `Metodo proteico: ${JSON.stringify(getProteinPlanningGuidance())}`,
        antiAgeGuidance.length > 0 ? `Metodo anti-age: ${JSON.stringify(antiAgeGuidance)}` : '',
        veganGuidance.length > 0 ? `Metodo menu vegetale 100% plant-based: ${JSON.stringify(veganGuidance)}` : '',
        `Frequenze orientative fonti proteiche: ${JSON.stringify(getWeeklyProteinFrequencyGuidance())}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.promptLines || [])}`,
        `Esempi settimanali di riferimento: ${JSON.stringify(weeklyReferenceExamples)}`,
        'Costruisci 7 giorni con colazione, spuntini, pranzo e cena.',
        'Per ogni giorno genera anche daily_theme: una frase breve che faccia da filo conduttore, per esempio Lunedi: Detox e Focus Energetico.',
        'Mantieni alta la ripetibilita: le colazioni e gli spuntini possono ripetersi, mentre la variabilita maggiore deve stare in pranzi e cene.',
        'Fai emergere una rotazione proteica settimanale coerente, con carne rossa solo occasionale e piu spazio a pesce, legumi e proteine magre.',
        'Tratta il piano come una mappa agile: deve aiutare a semplificare la settimana, ridurre sprechi, guidare una spesa intelligente e restare modificabile giorno per giorno.',
        'Quando descrivi i pasti principali, verifica una struttura completa e leggibile: cereali o altra base amidacea, proteine, verdure e grassi buoni quando coerenti con il profilo.',
        'Per costruire i pasti procedi in ordine chiaro: prima proteine, poi cereali o basi amidacee, infine verdura abbondante variando colore e stagionalita.',
        'Se due fonti proteiche vengono scambiate o accostate nello stesso pasto, mantieni l equilibrio dimezzando la porzione di ciascuna.',
        'Dopo avere generato la settimana, accompagna implicitamente il ragionamento verso il controllo della dispensa e della lista della spesa, senza trasformare il piano in un testo logistico eccessivo.',
        'Se compaiono riferimenti divulgativi a medie caloriche o a ripartizioni macro semplificate, trattali solo come contesto grezzo e non come schema universale.',
        'Considera stagionalita, praticita e differenza tra giorni piu compressi e weekend piu distesi, senza perdere equilibrio complessivo.',
        'Se il profilo e piu vicino a un piano ipocalorico intorno a 1600 kcal, prendi come base il riferimento da 1600 kcal; se e piu alto o piu neutro, puoi avvicinarti alla logica del riferimento da 2000 kcal.',
        'Nel blocco targets restituisci anche carboidrati, grassi e fibra in grammi, non solo proteine e calorie.'
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

    parsed.week.days = normalizeWeeklyDayThemes(parsed.week.days, payload.lunchContext);

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