const recipeTemplates = require('../data/recipe-templates.json');
const chefKnowledge = require('../data/chef-knowledge.json');
const chefTechniques = require('../data/chef-techniques.json');
const chefSubstitutions = require('../data/chef-substitutions.json');
const chefTextureBalance = require('../data/chef-texture-balance.json');
const chefColdKitchen = require('../data/chef-cold-kitchen.json');
const chefScrapReuse = require('../data/chef-scrap-reuse.json');
const chefIngredientSafety = require('../data/chef-ingredient-safety.json');
const chefFermentation = require('../data/chef-fermentation.json');
const chefYeastCivilization = require('../data/chef-yeast-civilization.json');
const chefAcidityPh = require('../data/chef-acidity-ph.json');
const chefMaltDiastic = require('../data/chef-malt-diastic.json');
const chefVegetableScience = require('../data/chef-vegetable-science.json');
const chefEggStorage = require('../data/chef-egg-storage.json');
const chefEggCooking = require('../data/chef-egg-cooking.json');
const chefProteinPlanning = require('../data/chef-protein-planning.json');
const chefPanVegetableFlatbreads = require('../data/chef-pan-vegetable-flatbreads.json');
const chefAmatricianaTraditional = require('../data/chef-amatriciana-traditional.json');
const chefLowFodmap = require('../data/chef-low-fodmap.json');
const chefPlantBasedRawPattern = require('../data/chef-plant-based-raw-pattern.json');
const nutritionCounselingBreakfastPatterns = require('../data/nutrition-counseling-breakfast-patterns.json');
const nutritionCounselingDinnerPatterns = require('../data/nutrition-counseling-dinner-patterns.json');
const nutritionCounselingDinnerTemplates = require('../data/nutrition-counseling-dinner-templates.json');
const nutritionCounselingLunchPatterns = require('../data/nutrition-counseling-lunch-patterns.json');
const nutritionCounselingWeeklyMenuPatterns = require('../data/nutrition-counseling-weekly-menu-patterns.json');
const nutritionCounselingAntiAgePatterns = require('../data/nutrition-counseling-anti-age-patterns.json');
const nutritionCounselingVeganMenuPatterns = require('../data/nutrition-counseling-vegan-menu-patterns.json');
const premiumSeedManifest = require('../data/recipe-seed-premium.json');
const chefFoodCompositionCrea = require('../data/chef-food-composition-crea.json');
const chefFoodSynonyms = require('../data/chef-food-synonyms.json');
const chefFoodYieldFactors = require('../data/chef-food-yield-factors.json');
const clinicalNutritionGuidance = require('../data/clinical-nutrition-overweight-50plus.js');

const premiumSeedIds = new Set(
    Array.isArray(premiumSeedManifest?.templates)
        ? premiumSeedManifest.templates.map((template) => String(template.id || '').trim()).filter(Boolean)
        : []
);

const RECIPE_SLOT_CONFIG = [
    {
        key: 'base',
        label: 'Cucina base',
        difficulty: 'Semplice',
        brief: 'piatto fondamentale, riconoscibile e lineare, con una tecnica principale sola',
        examples: ['soffritto', 'sugo per pasta', 'padellata semplice', 'insalata classica']
    },
    {
        key: 'media',
        label: 'Cucina media',
        difficulty: 'Media',
        brief: 'piatto domestico ma piu costruito, con componente principale e accompagnamento o salsa',
        examples: ['polpette con crema e verdura', 'secondo con contorno', 'forno strutturato']
    },
    {
        key: 'chef',
        label: 'Chef mode',
        difficulty: 'Chef',
        brief: 'piatto che mette alla prova l utente con piu decisioni tecniche e una struttura piu ambiziosa',
        examples: ['doppia cottura', 'mantecatura precisa', 'crosta o salsa tecnica', 'impiattamento piu curato']
    },
    {
        key: 'salvafrigo',
        label: 'Salvafrigo',
        difficulty: 'Salvafrigo',
        brief: 'soluzione piu facile e anti-spreco, utile prima di tutto',
        examples: ['padella unica', 'assemblaggio rapido', 'uso ingredienti aperti']
    }
];

const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const MAX_REQUEST_BODY_LENGTH = 20_000;
const MAX_INGREDIENTS = 20;
const MAX_INGREDIENT_LENGTH = 80;
const MAX_USERNAME_LENGTH = 60;
const MAX_PROFILE_FIELD_LENGTH = 120;
const MAX_LIST_FIELD_LENGTH = 240;
const AI_REQUEST_TIMEOUT_MS = 20_000;

function response(statusCode, body) {
    return {
        statusCode,
        headers: JSON_HEADERS,
        body: JSON.stringify(body)
    };
}

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function toList(value) {
    return String(value || '')
        .split(/[,;|/\n]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function uniqueStrings(values) {
    return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
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
    const goal = normalizeText(profile?.goal || '');
    const sex = normalizeText(profile?.sex || '');
    const otherPathologies = normalizeText(profile?.otherPathologies || '');
    const signals = Array.isArray(criteria?.goalSignals) ? criteria.goalSignals : [];
    const sexSignals = Array.isArray(criteria?.sexSignals) ? criteria.sexSignals : [];
    const pathologySignals = Array.isArray(criteria?.pathologySignals) ? criteria.pathologySignals : [];

    return age >= Number(criteria?.ageMin || 0)
        && age <= Number(criteria?.ageMax || 200)
        && imc >= Number(criteria?.imcMin || 0)
        && (criteria?.imcMax == null || imc <= Number(criteria.imcMax))
        && (targetCalories === 0 || ((criteria?.targetCaloriesMin == null || targetCalories >= Number(criteria.targetCaloriesMin))
            && (criteria?.targetCaloriesMax == null || targetCalories <= Number(criteria.targetCaloriesMax))))
        && (!signals.length || signals.some((signal) => goal.includes(normalizeText(signal))) || !goal)
        && (!sexSignals.length || sexSignals.some((signal) => sex.includes(normalizeText(signal))) || !sex)
        && (!pathologySignals.length || pathologySignals.some((signal) => otherPathologies.includes(normalizeText(signal))));
}

function buildSynonymLookup() {
    const groups = Array.isArray(chefFoodSynonyms?.groups) ? chefFoodSynonyms.groups : [];
    const lookup = new Map();

    groups.forEach((group) => {
        const aliases = uniqueStrings([group.canonical, ...(Array.isArray(group.aliases) ? group.aliases : [])])
            .map((item) => normalizeText(item))
            .filter(Boolean);

        aliases.forEach((alias) => {
            lookup.set(alias, aliases);
        });
    });

    return lookup;
}

const foodSynonymLookup = buildSynonymLookup();

const CREA_NUTRITION_METHOD = {
    energyFactors: {
        proteinKcalPerG: 4,
        fatKcalPerG: 9,
        availableCarbKcalPerG: 3.75,
        starchKcalPerG: 4.13,
        fiberKcalPerG: 2,
        alcoholKcalPerG: 7,
        kjPerKcal: 4.184
    }
};

const YIELD_NUMERIC_FIELDS = [
    'energy_kcal',
    'proteins',
    'lipids',
    'available_carbohydrates',
    'total_fiber',
    'water',
    'cholesterol',
    'sodium_mg',
    'potassium_mg',
    'calcium_mg',
    'phosphorus_mg',
    'magnesium_mg',
    'iron_mg',
    'zinc_mg',
    'folate_ug',
    'vitamin_b12_ug',
    'vitamin_c_mg',
    'vitamin_a_re_ug',
    'lactose_g',
    'glucose_g',
    'fructose_g',
    'soluble_sugars_g',
    'starch_g',
    'saturated_fatty_acids_g',
    'monounsaturated_fatty_acids_g',
    'polyunsaturated_fatty_acids_g'
];

function buildYieldFactorEntries() {
    const items = Array.isArray(chefFoodYieldFactors?.items) ? chefFoodYieldFactors.items : [];

    return items.map((item) => ({
        ...item,
        normalizedAliases: uniqueStrings([item.food_name, ...(Array.isArray(item.aliases) ? item.aliases : [])])
            .map((alias) => normalizeText(alias))
            .filter(Boolean)
    }));
}

const foodYieldFactorEntries = buildYieldFactorEntries();

function limitString(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function limitNumber(value, fallback = 0, min = 0, max = 10_000) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(max, Math.max(min, numeric));
}

function normalizeDinnerProteinPreference(value) {
    return ['uova', 'tofu-tempeh', 'latticini-light', 'burger-vegetali'].includes(value)
        ? value
        : 'variata';
}

function normalizeRequestedRecipeMode(value) {
    const normalized = normalizeText(value);

    if (normalized.includes('salvafrigo')) return 'salvafrigo';
    if (normalized.includes('chef')) return 'chef';
    if (normalized.includes('media')) return 'media';
    return 'base';
}

function getRequestedRecipeSlotConfig(value) {
    const requestedMode = normalizeRequestedRecipeMode(value);
    return RECIPE_SLOT_CONFIG.find((slot) => slot.key === requestedMode) || RECIPE_SLOT_CONFIG[0];
}

function normalizeRecipeMealType(value) {
    const normalized = normalizeText(value);

    if (normalized.includes('colaz')) return 'colazione';
    if (normalized.includes('spunt') || normalized.includes('snack')) return 'spuntino';
    if (normalized.includes('cena')) return 'cena';
    return 'pranzo';
}

function getRecipeMealTypeLabel(value) {
    return {
        colazione: 'Colazione',
        pranzo: 'Pranzo',
        cena: 'Cena',
        spuntino: 'Spuntino'
    }[normalizeRecipeMealType(value)] || 'Pranzo';
}

function getRecipeMealTypePromptBlock(value) {
    const mealType = normalizeRecipeMealType(value);

    if (mealType === 'colazione') {
        return [
            'La ricetta deve comportarsi davvero come una colazione: preparazione rapida o molto gestibile, quota energetica controllata, tono mattutino e ingredienti plausibili per l inizio giornata.',
            'Privilegia basi come yogurt, latte, avena, cereali semplici, pane o fette biscottate, frutta, frutta secca, uova o pancake coerenti col profilo.',
            'Evita di generare piatti da pranzo o cena travestiti da colazione.'
        ];
    }

    if (mealType === 'spuntino') {
        return [
            'La ricetta deve essere davvero da spuntino: breve, essenziale, facilmente porzionabile e con pochi ingredienti.',
            'Privilegia soluzioni pratiche, trasportabili o veloci da assemblare, senza trasformarle in un pasto completo mascherato.',
            'La quota proteica puo essere presente ma senza caricare troppo volume, grassi o complessita tecnica.'
        ];
    }

    if (mealType === 'cena') {
        return [
            'La ricetta deve comportarsi davvero come una cena: nucleo proteico leggibile, verdure ben presenti, densita energetica ordinata e chiusura serale coerente col profilo.',
            'Se il profilo ha una preferenza proteica serale, qui conta ancora di piu e deve orientare in modo visibile la proposta.',
            'Evita proposte da brunch o da colazione, anche se gli ingredienti lo permetterebbero.'
        ];
    }

    return [
        'La ricetta deve comportarsi davvero come un pranzo: piatto centrale della giornata, leggibile, saziante e compatibile con il contesto lavorativo o libero del profilo.',
        'Privilegia struttura da piatto unico o piatto principale con buona tenuta di sazieta e organizzazione.',
        'Evita soluzioni troppo piccole o troppo da snack.'
    ];
}

function buildRestrictionTokens(profile) {
    return uniqueStrings([
        ...toList(profile.allergies),
        ...toList(profile.intolerances)
    ])
        .map((item) => normalizeText(item))
        .filter((item) => item.length >= 3);
}

function sanitizeInput(body) {
    const profile = body && typeof body.profile === 'object' ? body.profile : {};
    const rawIngredients = (Array.isArray(body.ingredients) ? body.ingredients : toList(body.ingredients))
        .slice(0, MAX_INGREDIENTS)
        .map((item) => limitString(item, MAX_INGREDIENT_LENGTH));
    const people = Math.min(8, Math.max(1, parseInt(body.people, 10) || 1));
    const restrictionTokens = buildRestrictionTokens(profile);

    const ingredients = uniqueStrings(rawIngredients).filter((ingredient) => {
        const normalized = normalizeText(ingredient);
        return normalized && !restrictionTokens.some((token) => normalized.includes(token));
    });

    const excludedIngredients = uniqueStrings(rawIngredients).filter((ingredient) => !ingredients.includes(ingredient));

    return {
        ingredients: ingredients.slice(0, MAX_INGREDIENTS),
        people,
        requestedMode: normalizeRequestedRecipeMode(body?.difficulty),
        mealType: normalizeRecipeMealType(body?.mealType),
        profile: {
            username: limitString(profile.username, MAX_USERNAME_LENGTH),
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
            workoutsPerWeek: limitNumber(profile.workoutsPerWeek, 0, 0, 14),
            maintenanceCalories: limitNumber(profile.maintenanceCalories, 0, 0, 10000),
            targetCalories: limitNumber(profile.targetCalories, 0, 0, 10000),
            goalCalorieDelta: limitNumber(profile.goalCalorieDelta, 0, -2000, 2000),
            proteinTargetPerKg: limitNumber(profile.proteinTargetPerKg, 0, 0, 4),
            proteinTargetGrams: limitNumber(profile.proteinTargetGrams, 0, 0, 400),
            carbsTargetGrams: limitNumber(profile.carbsTargetGrams, 0, 0, 600),
            fatTargetGrams: limitNumber(profile.fatTargetGrams, 0, 0, 250),
            fiberTargetGrams: limitNumber(profile.fiberTargetGrams, 0, 0, 100),
            lunchContextPreference: profile?.lunchContextPreference === 'free-day' ? 'free-day' : 'workday',
            dinnerProteinPreference: normalizeDinnerProteinPreference(profile?.dinnerProteinPreference)
        },
        excludedIngredients: excludedIngredients.slice(0, MAX_INGREDIENTS)
    };
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

function getLunchContextSummaryTail(value) {
    return value === 'free-day'
        ? 'Il tono del piatto resta un po piu disteso, piacevole e curato, coerente con un giorno libero.'
        : 'Il tono del piatto resta pratico, organizzabile e sostenibile dentro una giornata lavorativa.';
}

function applyLunchContextToneToRecipe(recipe, lunchContext) {
    if (!recipe || typeof recipe !== 'object') {
        return recipe;
    }

    const normalizedLunchContext = lunchContext === 'free-day' ? 'free-day' : 'workday';
    const summaryTail = getLunchContextSummaryTail(normalizedLunchContext);
    const summaryText = String(recipe.summary || '').trim();
    const normalizedSummary = normalizeText(summaryText);
    const alreadyContextualized = normalizedLunchContext === 'free-day'
        ? hasSignal(normalizedSummary, ['giorno libero', 'piu distes', 'piu curat', 'piu calmo', 'piacevole'])
        : hasSignal(normalizedSummary, ['giorno lavorativo', 'routine', 'pratic', 'organizz', 'sostenibile']);

    return {
        ...recipe,
        summary: summaryText
            ? (alreadyContextualized ? summaryText : `${summaryText} ${summaryTail}`.trim())
            : summaryTail
    };
}

function buildNutritionMethodSummary(profile) {
    const parts = [];

    if (Number(profile.imc || 0) > 0) {
        parts.push(`IMC ${profile.imc}${profile.imcCategory ? ` (${profile.imcCategory})` : ''}`);
    }

    if (Number(profile.maintenanceCalories || 0) > 0) {
        parts.push(`fabbisogno ${profile.maintenanceCalories} kcal`);
    }

    if (Number(profile.targetCalories || 0) > 0) {
        parts.push(`piano ${profile.targetCalories} kcal`);
    }

    if (Number(profile.goalCalorieDelta || 0) !== 0) {
        parts.push(`delta ${profile.goalCalorieDelta > 0 ? '+' : ''}${profile.goalCalorieDelta} kcal`);
    }

    if (Number(profile.proteinTargetPerKg || 0) > 0) {
        const proteinText = `${profile.proteinTargetPerKg} g/kg`;
        parts.push(Number(profile.proteinTargetGrams || 0) > 0
            ? `proteine ${proteinText} (~${profile.proteinTargetGrams} g)`
            : `proteine ${proteinText}`);
    }

    if (Number(profile.carbsTargetGrams || 0) > 0) {
        parts.push(`carboidrati ~${profile.carbsTargetGrams} g`);
    }

    if (Number(profile.fatTargetGrams || 0) > 0) {
        parts.push(`grassi ~${profile.fatTargetGrams} g`);
    }

    if (Number(profile.fiberTargetGrams || 0) > 0) {
        parts.push(`fibra ~${profile.fiberTargetGrams} g`);
    }

    parts.push(`pranzo abituale da ${getLunchContextLabel(profile.lunchContextPreference)}`);
    parts.push(`rotazione proteica cena: ${getDinnerProteinPreferenceLabel(profile.dinnerProteinPreference)}`);

    return parts.length > 0 ? parts.join(' | ') : 'metodo nutrizionale non disponibile';
}

function getClinicalNutritionContext(profile) {
    const match = getClinicalGuidanceProfiles().find((source) => matchesClinicalGuidanceCriteria(profile, source.criteria || {}));

    if (!match) {
        return { applicable: false };
    }

    return {
        ...cloneClinicalGuidanceValue(match),
        applicable: true,
        selectedProfileKey: match.key,
        recipePromptLines: cloneClinicalGuidanceValue(match.recipePromptLines || match.promptLines || [])
    };
}

function getRecipeReferenceExamples() {
    return [
        {
            label: 'settimana-riferimento-2000-kcal',
            kcal: 2000,
            macroSplit: '19% proteine, 30% lipidi, 52% carboidrati di cui 16% semplici, 32 g fibra',
            corePatterns: [
                'giornate organizzate in 5 momenti: colazione, spuntino mattina, pranzo, merenda, cena',
                'colazioni semplici con latte o yogurt, cereali o fette biscottate e piccola quota dolce misurata',
                'spuntini con frutta come base e piccoli supporti pratici come yogurt, frutta secca o gallette',
                'pranzi con cereale o pasta, verdure, condimento dichiarato e proteina chiara o latticino magro',
                'cene con zuppe o primi leggeri, proteina leggibile, verdure e quota semplice di pane o cracker'
            ],
            usefulSignals: [
                'orzo primavera, minestrone di riso, risotto ai carciofi, cous cous di verdure',
                'pollo, merluzzo, salmone, baccala, ricotta, Grana Padano',
                'fine settimana piu disteso ma senza perdere ordine nutrizionale'
            ]
        },
        {
            label: 'settimana-riferimento-1600-kcal',
            kcal: 1600,
            macroSplit: '19% proteine, 33% lipidi, 48% glucidi di cui 14% semplici, 26 g fibra',
            corePatterns: [
                'giornate organizzate in 5 momenti: colazione, spuntino mattina, pranzo, merenda, cena',
                'spuntini fissi con 150 g di frutta fresca sia al mattino sia al pomeriggio',
                'colazioni sobrie con caffe o te, yogurt o latte, biscotti, muesli o fette biscottate',
                'pranzi con pasta, riso, farro o orzo, verdure e fonte proteica magra o uova',
                'cene piu leggere con passato di verdure, pesce, bresaola, Grana Padano o hamburger al forno'
            ],
            usefulSignals: [
                'bigoli integrali alle verdure con coniglio, orzotto con uova, riso con crema di ceci',
                'rana pescatrice, calamaretti, sogliola, spigola, bresaola',
                'zucchero molto controllato e alcol solo limitato e contestualizzato'
            ]
        },
        {
            label: 'settimana-riferimento-domestica-organizzata',
            corePatterns: [
                'settimana costruita per ridurre il carico mentale della scelta quotidiana e limitare il ricorso a piatti pronti o processati',
                'riuso intelligente degli ingredienti in piu ricette per contenere spreco e spesa',
                'alternanza domestica tra cereali, legumi, pesce, pollo, uova, formaggi e carne senza perdere leggibilita del pasto'
            ],
            usefulSignals: [
                'quinoa con fagioli rossi, avocado e verdure di stagione',
                'insalata di farro con pomodorini, rucola, feta e olive',
                'bastoncini di polenta con ragu di lenticchie',
                'piadina con hummus di ceci e verdure grigliate',
                'merluzzo con pomodorini e olive, insalata e pane',
                'uova strapazzate con spinaci e pane bruschettato al rosmarino'
            ]
        },
        {
            label: 'settimana-riferimento-vegetale-mediterranea',
            corePatterns: [
                'settimana 100% vegetale con cereali o derivati a ogni pasto principale e legumi o altre proteine vegetali almeno due volte al giorno',
                'uso della tradizione italiana naturalmente vegetale prima di ricorrere a sostituzioni artificiose',
                'spesa organizzata per corsie e ingredienti riusati in piu ricette per ridurre spreco e carico mentale'
            ],
            usefulSignals: [
                'bruschetta al pomodoro, ribollita, panzanella, minestrone, caponata',
                'yogurt di soia con avena e frutta, pane integrale con crema di frutta secca',
                'cous cous con ceci e verdure, farro con lenticchie, pasta e fagioli, tofu al forno con verdure',
                'semi di lino o chia, frutta secca, olio EVO, cibi vegetali ricchi di calcio'
            ]
        }
    ];
}

function getMealTypeReferenceExamples(mealType) {
    const normalizedMealType = normalizeRecipeMealType(mealType);

    if (normalizedMealType === 'colazione') {
        return [
            {
                label: 'colazione-proteica-semplice',
                patterns: [
                    'yogurt o latte come base, cereale semplice o fette biscottate, frutta o piccola quota dolce misurata',
                    'pancake o uova solo se restano rapidi, leggibili e coerenti con la mattina',
                    'tono leggero, gestibile e ripetibile nella routine'
                ]
            },
            {
                label: 'colazione-ipocalorica-ordinata',
                patterns: [
                    'densita energetica controllata, volume ragionevole, quota proteica non trascurata',
                    'evitare piatti troppo salati, troppo pesanti o da pranzo travestiti',
                    'favorire semplicita di esecuzione e ingredienti plausibili per l inizio giornata'
                ]
            }
        ];
    }

    if (normalizedMealType === 'spuntino') {
        return [
            {
                label: 'spuntino-pratico-proteico',
                patterns: [
                    'spuntino breve, facilmente porzionabile e trasportabile',
                    'yogurt, frutta, frutta secca, mini pancake, pudding o crema rapida sono formati plausibili',
                    'deve controllare fame e aderenza senza diventare un pasto completo'
                ]
            },
            {
                label: 'spuntino-leggero-di-riequilibrio',
                patterns: [
                    'quando il profilo e piu ipocalorico, restare su pochi ingredienti e volume ordinato',
                    'proteine presenti se utili, ma senza eccesso di grassi o complessita tecnica',
                    'tono rapido, utile e ripetibile'
                ]
            }
        ];
    }

    if (normalizedMealType === 'cena') {
        return [
            {
                label: 'cena-proteina-leggibile',
                patterns: [
                    'verdure evidenti, fonte proteica chiara, struttura serale ordinata',
                    'quota glucidica semplice e misurata se presente',
                    'evitare formati da snack o da colazione'
                ]
            }
        ];
    }

    return [
        {
            label: 'pranzo-piatto-centrale',
            patterns: [
                'piatto unico o piatto principale con buona tenuta di sazieta',
                'base amidacea o struttura portante piu chiara rispetto a colazione e spuntino',
                'tono pratico o piu disteso in base al contesto del profilo'
            ]
        }
    ];
}

function goalHint(goal) {
    if (goal === 'dimagrire') return 'mantiene il piatto leggero ma saziante';
    if (goal === 'massa') return 'spinge un po di piu su energia e recupero';
    return 'resta equilibrata e facile da inserire nella routine';
}

function dietHint(diet) {
    if (!diet || diet === 'regime alimentare non specificato') return 'usa ingredienti facili da adattare';
    return `resta coerente con un approccio ${diet}`;
}

function getTemplateIngredientNames(template) {
    return Array.isArray(template.ingredienti_tabella)
        ? template.ingredienti_tabella.map((row) => String(row.n || '').trim()).filter(Boolean)
        : [];
}

function getTemplateTitle(template) {
    return String(template?.nome_ricetta || template?.title || '').trim();
}

function getTemplateSignals(template) {
    return normalizeText([
        getTemplateTitle(template),
        ...getTemplateIngredientNames(template),
        ...(Array.isArray(template?.archetypes) ? template.archetypes : []),
        ...(Array.isArray(template?.tags) ? template.tags : [])
    ].join(' | '));
}

function inferTemplateArchetypes(template) {
    const explicit = Array.isArray(template?.archetypes) ? template.archetypes.map(String) : [];
    const signalText = getTemplateSignals(template);
    const archetypes = [...explicit];

    if (hasSignal(signalText, ['amatriciana', 'spaghetti', 'bucatini', 'rigatoni', 'pasta'])) {
        archetypes.push('pasta');
    }
    if (hasSignal(signalText, ['risotto'])) {
        archetypes.push('risotto');
    }
    if (hasSignal(signalText, ['riso', 'quinoa', 'farro', 'bowl'])) {
        archetypes.push('grain-bowl');
    }
    if (hasSignal(signalText, ['zuppa', 'crema', 'vellutata'])) {
        archetypes.push('soup');
    }
    if (hasSignal(signalText, ['focacc', 'focaccine', 'piadina', 'flatbread'])) {
        archetypes.push('flatbread');
    }
    if (hasSignal(signalText, ['barrette', 'biscotti', 'tiramisu', 'dessert', 'dolce'])) {
        archetypes.push('snack-dessert');
    }
    if (hasSignal(signalText, ['forno', 'teglia', 'patate dolci'])) {
        archetypes.push('oven-roast');
    }
    if (hasSignal(signalText, ['uovo', 'uova', 'omelette', 'frittata'])) {
        archetypes.push('egg-dish');
    }
    if (hasSignal(signalText, ['orata', 'salmone', 'branzino', 'sgombro', 'tonno', 'gamberi', 'pollo', 'tempeh', 'tofu'])) {
        archetypes.push('protein-main');
    }

    return uniqueStrings(archetypes);
}

function inferTemplateKnowledgeKeys(template) {
    const explicit = Array.isArray(template?.knowledgeKeys) ? template.knowledgeKeys.map(String) : [];
    const signalText = getTemplateSignals(template);
    const keys = [...explicit];

    if (hasSignal(signalText, ['pomodoro', 'zucchina', 'zucca', 'carota', 'melanz', 'peperon', 'patate', 'fung'])) {
        keys.push('vegetableScience');
    }
    if (hasSignal(signalText, ['uovo', 'uova', 'omelette', 'frittata'])) {
        keys.push('eggCooking', 'eggStorage');
    }
    if (hasSignal(signalText, ['yogurt', 'kefir', 'kombucha', 'ferment', 'lievito', 'pasta madre'])) {
        keys.push('fermentation');
    }
    if (hasSignal(signalText, ['pane', 'focacc', 'focaccine', 'impasto', 'lievito', 'malto'])) {
        keys.push('yeastCivilization');
    }
    if (hasSignal(signalText, ['malto', 'grande lievitato'])) {
        keys.push('maltDiastic');
    }
    if (hasSignal(signalText, ['pomodoro', 'aceto', 'limone', 'yogurt', 'marmellata'])) {
        keys.push('acidityPh');
    }
    if (hasSignal(signalText, ['pollo', 'pesce', 'tempeh', 'tofu', 'uova', 'lenticchie', 'ceci', 'prote'])) {
        keys.push('proteinPlanning');
    }
    if (hasSignal(signalText, ['focacc', 'focaccine', 'padella'])) {
        keys.push('panVegetableFlatbreads');
    }
    if (hasSignal(signalText, ['amatriciana', 'guanciale', 'pecorino', 'bucatini'])) {
        keys.push('amatricianaTraditional');
    }
    if (hasSignal(signalText, ['low fodmap', 'ibs', 'intestino', 'zucchine', 'carote', 'quinoa']) && hasSignal(signalText, ['no aglio', 'no cipolla', 'fodmap'])) {
        keys.push('lowFodmap');
    }
    if (hasSignal(signalText, ['vegano', 'vegetale', 'integrale', 'crudo', 'banana', 'avena', 'datteri', 'carruba'])) {
        keys.push('plantBasedRawPattern');
    }
    if (hasSignal(signalText, ['bowl', 'insalata', 'fredd', 'tiepido'])) {
        keys.push('coldKitchen');
    }

    return uniqueStrings(keys);
}

function templateConflictsWithDiet(template, diet) {
    const normalizedDiet = normalizeText(diet);
    if (!normalizedDiet) return false;

    const signalText = getTemplateSignals(template);
    const animalSignals = ['pollo', 'carne', 'salumi', 'guanciale', 'orata', 'salmone', 'pesce', 'tonno', 'sgombro', 'branzino', 'gamberi'];
    const dairyEggSignals = ['latte', 'pecorino', 'parmigiano', 'ricotta', 'yogurt', 'uovo', 'uova', 'burro'];

    if (normalizedDiet.includes('vegano') || normalizedDiet.includes('vegan')) {
        return hasSignal(signalText, [...animalSignals, ...dairyEggSignals]);
    }

    if (normalizedDiet.includes('vegetar')) {
        return hasSignal(signalText, animalSignals);
    }

    return false;
}

function normalizeDifficulty(value) {
    const normalized = normalizeText(value);
    if (normalized.includes('chef')) return 'Chef';
    if (normalized.includes('media')) return 'Media';
    return 'Semplice';
}

function getSlotConfig(slotKey) {
    return RECIPE_SLOT_CONFIG.find((slot) => slot.key === slotKey) || RECIPE_SLOT_CONFIG[0];
}

function getTemplateStepCount(template) {
    return Array.isArray(template?.procedimento) ? template.procedimento.length : 0;
}

function getTemplateIngredientCount(template) {
    return Array.isArray(template?.ingredienti_tabella) ? template.ingredienti_tabella.length : 0;
}

function isHighComplexityTemplate(template) {
    const signals = getTemplateSignals(template);
    return getTemplateStepCount(template) >= 4
        || getTemplateIngredientCount(template) >= 6
        || hasSignal(signals, ['mantec', 'bisque', 'riduz', 'crosta', 'doppia cottura', 'emulsion', 'polvere', 'carpaccio', 'confit']);
}

function getSlotScoreBonus(template, slotKey) {
    const difficulty = normalizeDifficulty(template?.difficolta);
    const templateSignals = getTemplateSignals(template);
    const isPremium = premiumSeedIds.has(String(template?.id || '').trim());
    const hasAntiWasteNote = normalizeText(template?.anti_spreco).length > 20;
    const isColdOrSimpleFormat = hasSignal(templateSignals, ['insalata', 'bowl', 'padell', 'teglia', 'frittata', 'zucchine', 'pomodoro']);
    const stepCount = getTemplateStepCount(template);
    const ingredientCount = getTemplateIngredientCount(template);
    const isHighComplexity = isHighComplexityTemplate(template);
    const hasBaseSignals = hasSignal(templateSignals, ['soffritt', 'sugo', 'pomodoro', 'spaghetti', 'pasta', 'padella', 'frittata', 'uovo', 'insalata', 'pollo', 'riso']);
    const hasMediumSignals = hasSignal(templateSignals, ['polpett', 'crema', 'pure', 'vellutata', 'forno', 'contorno', 'verdure', 'ripien', 'arrosto', 'salsa']);
    const hasChefSignals = hasSignal(templateSignals, ['mantec', 'bisque', 'riduz', 'crosta', 'doppia cottura', 'emulsion', 'tartufo', 'zafferano', 'sale', 'carpaccio', 'luciana', 'confit']);

    if (slotKey === 'base') {
        return (difficulty === 'Semplice' ? 12 : 0)
            + (difficulty === 'Media' ? 2 : 0)
            + (difficulty === 'Chef' ? -10 : 0)
            + (hasBaseSignals ? 8 : 0)
            + (!isHighComplexity && stepCount <= 4 ? 5 : 0)
            + (ingredientCount > 0 && ingredientCount <= 6 ? 3 : 0)
            + (isPremium ? -2 : 0);
    }

    if (slotKey === 'media') {
        return (difficulty === 'Media' ? 13 : 0)
            + (difficulty === 'Chef' ? 2 : 0)
            + (difficulty === 'Semplice' ? -4 : 0)
            + (hasMediumSignals ? 8 : 0)
            + (ingredientCount >= 5 && ingredientCount <= 9 ? 4 : 0)
            + (stepCount >= 3 && stepCount <= 5 ? 4 : 0);
    }

    if (slotKey === 'chef') {
        return (difficulty === 'Chef' ? 18 : 0)
            + (difficulty === 'Media' ? 2 : 0)
            + (difficulty === 'Semplice' ? -12 : 0)
            + (isPremium ? 9 : 0)
            + (hasChefSignals ? 10 : 0)
            + (isHighComplexity ? 7 : -4)
            + (stepCount >= 4 ? 4 : 0)
            + (ingredientCount >= 6 ? 3 : 0);
    }

    if (slotKey === 'salvafrigo') {
        return (difficulty === 'Semplice' ? 8 : 0) + (hasAntiWasteNote ? 7 : 0) + (isColdOrSimpleFormat ? 4 : 0) + (isPremium ? -7 : 0);
    }

    return 0;
}

function withRecipeSlot(recipe, slotKey, index = 0) {
    const slot = getSlotConfig(slotKey);

    return {
        ...recipe,
        mode_key: slot.key,
        mode_label: slot.label,
        slot_order: index + 1,
        difficolta: recipe.difficolta || slot.difficulty,
        style: recipe.style || slot.label,
        title: recipe.title || recipe.nome_ricetta
    };
}

function rankRecipeTemplates(payload, limit = recipeTemplates.length) {
    return recipeTemplates
        .map((template) => ({
            template,
            score: scoreRecipeTemplate(template, payload)
        }))
        .sort((left, right) => right.score - left.score)
        .slice(0, limit);
}

function scoreRecipeTemplate(template, payload) {
    const availableIngredients = payload.ingredients.map(normalizeText);
    const templateIngredients = getTemplateIngredientNames(template).map(normalizeText);
    const templateSignals = getTemplateSignals(template);
    const templateArchetypes = inferTemplateArchetypes(template);
    const requestedArchetypes = inferRequestedArchetypes(payload);
    const excludedAllergens = Array.isArray(template.allergeni_esclusi)
        ? template.allergeni_esclusi.map(normalizeText)
        : [];
    const restrictions = buildRestrictionTokens(payload.profile);
    const goal = normalizeText(payload.profile.goal);
    const diet = normalizeText(payload.profile.diet);
    const totalProtein = Number(template?.totale_piatto?.p || 0);
    const totalCalories = Number(template?.totale_piatto?.k || 0);

    const overlapScore = templateIngredients.reduce((score, ingredient) => {
        return score + (availableIngredients.some((item) => ingredient.includes(item) || item.includes(ingredient)) ? 5 : 0);
    }, 0);

    const exclusionScore = restrictions.reduce((score, token) => {
        return score + (excludedAllergens.some((item) => item.includes(token) || token.includes(item)) ? 3 : 0);
    }, 0);

    const difficultyBonus = template.difficolta === 'Semplice'
        ? 2
        : (template.difficolta === 'Media' ? 1 : 0);

    const archetypeBonus = requestedArchetypes.reduce((score, archetype) => {
        return score + (templateArchetypes.includes(archetype) ? 4 : 0);
    }, 0);

    const restrictionCompatibilityBonus = restrictions.reduce((score, token) => {
        if (token.includes('glutine') && hasSignal(templateSignals, ['senza-glutine', 'gluten free', 'grano saraceno', 'farina di riso'])) {
            return score + 8;
        }
        if ((token.includes('lattos') || token.includes('latte')) && hasSignal(templateSignals, ['senza-lattosio', 'delattosato', 'vegano'])) {
            return score + 5;
        }
        if (token.includes('fodmap') && hasSignal(templateSignals, ['low-fodmap'])) {
            return score + 8;
        }
        return score;
    }, 0);

    const dietBonus = diet.includes('vegano') || diet.includes('vegan')
        ? (hasSignal(templateSignals, ['vegano', 'vegan']) ? 10 : 0)
        : (diet.includes('vegetar')
            ? (hasSignal(templateSignals, ['vegetariano', 'vegano', 'vegan']) ? 6 : 0)
            : 0);

    const premiumBonus = premiumSeedIds.has(String(template.id || '').trim()) ? 4 : 0;

    const mealType = normalizeRecipeMealType(payload.mealType);
    const mealTypeBonus = mealType === 'colazione'
        ? (
            hasSignal(templateSignals, ['colazione', 'yogurt', 'latte', 'pancake', 'porridge', 'muesli', 'granola', 'fette biscottate', 'biscotti'])
                ? 12
                : (hasSignal(templateSignals, ['arrosto', 'ragu', 'bistecca', 'filetto', 'burger']) ? -10 : -2)
        )
        : mealType === 'spuntino'
            ? (
                hasSignal(templateSignals, ['spuntino', 'snack', 'barrette', 'biscotti', 'pudding', 'yogurt', 'smoothie', 'frutta']) || templateArchetypes.includes('snack-dessert')
                    ? 12
                    : (templateArchetypes.includes('pasta') || templateArchetypes.includes('protein-main') ? -10 : -2)
            )
            : mealType === 'cena'
                ? (
                    templateArchetypes.includes('protein-main') || templateArchetypes.includes('egg-dish') || templateArchetypes.includes('soup')
                        ? 8
                        : (templateArchetypes.includes('snack-dessert') ? -12 : 0)
                )
                : (
                    templateArchetypes.includes('pasta') || templateArchetypes.includes('grain-bowl') || templateArchetypes.includes('protein-main') || templateArchetypes.includes('baked-pasta')
                        ? 8
                        : (templateArchetypes.includes('snack-dessert') ? -10 : 0)
                );

    const goalBonus = goal.includes('massa')
        ? (totalProtein >= 25 ? 3 : 0)
        : (goal.includes('dimagr')
            ? ((totalCalories > 0 && totalCalories <= 650) ? 3 : 0)
            : ((totalCalories >= 350 && totalCalories <= 750) ? 1 : 0));

    const dietPenalty = templateConflictsWithDiet(template, diet) ? -25 : 0;

    return overlapScore + exclusionScore + difficultyBonus + archetypeBonus + restrictionCompatibilityBonus + dietBonus + premiumBonus + mealTypeBonus + goalBonus + dietPenalty;
}

function normalizeTemplateRecipe(template) {
    return normalizeRecipe({
        ...template,
        title: template.nome_ricetta,
        style: template.difficolta,
        steps: template.procedimento,
        ingredients: getTemplateIngredientNames(template),
        healthyCooking: template.tecnica_cottura,
        wasteTip: template.anti_spreco,
        nutrition: {
            ingredients: (template.ingredienti_tabella || []).map((row) => ({
                name: row.n,
                kcal: row.k,
                protein: row.p,
                carbs: row.c,
                fat: row.g
            })),
            total: template.totale_piatto ? {
                kcal: template.totale_piatto.k,
                protein: template.totale_piatto.p,
                carbs: template.totale_piatto.c,
                fat: template.totale_piatto.g
            } : null
        }
    }, 0);
}

function selectRecipeTemplatesBySlot(payload) {
    const rankedTemplates = rankRecipeTemplates(payload, recipeTemplates.length);
    const usedTemplateIds = new Set();

    return RECIPE_SLOT_CONFIG.map((slot, index) => {
        const match = rankedTemplates
            .map((entry) => ({
                ...entry,
                slotScore: entry.score + getSlotScoreBonus(entry.template, slot.key)
            }))
            .filter((entry) => !usedTemplateIds.has(String(entry.template?.id || '').trim()))
            .sort((left, right) => right.slotScore - left.slotScore)[0];

        if (!match) {
            return null;
        }

        usedTemplateIds.add(String(match.template?.id || '').trim());

        return {
            slot,
            template: match.template,
            normalizedRecipe: withRecipeSlot(normalizeTemplateRecipe(match.template), slot.key, index)
        };
    }).filter(Boolean);
}

function buildGenericFallbackRecipes(payload) {
    const ingredients = payload.ingredients.length > 0 ? payload.ingredients : ['verdure miste'];
    const lead = ingredients.slice(0, 4);
    const peopleLabel = payload.people === 1 ? 'persona' : 'persone';
    const goal = payload.profile.goal || 'mantenere';
    const diet = payload.profile.diet || 'equilibrato';
    const activity = payload.profile.jobType || 'moderato';
    const mealType = normalizeRecipeMealType(payload.mealType);
    const useVeganGuidance = shouldApplyVeganGuidance(payload.profile, buildTextSignals(payload));
    const clinicalContext = getClinicalNutritionContext(payload.profile);
    const clinicalTail = clinicalContext.applicable
        ? ` ${clinicalContext.recipeTail || 'Per un profilo adulto 50+ in sovrappeso con deficit moderato, il piatto privilegia verdure, condimenti misurati, olio EVO preferibilmente a crudo e una struttura anti-fame ma non pesante.'}`
        : '';

    if (mealType === 'colazione') {
        return [
            withRecipeSlot({
                id: 'R001',
                nome_ricetta: `Colazione base con ${lead[0] || 'yogurt'} e ${lead[1] || 'cereali'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 8,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Assemblaggio rapido o cottura brevissima, con struttura davvero adatta alla mattina.',
                anti_spreco: 'Frutta matura, yogurt aperto o cereali avanzati si integrano bene in una colazione semplice e misurata.',
                ingredienti_tabella: [...lead.slice(0, 3), useVeganGuidance ? 'yogurt o bevanda di soia' : 'yogurt o latte', 'cereale semplice'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: [
                    'Scegli una base lattiero-casearia o equivalente vegetale coerente col profilo.',
                    'Aggiungi una quota di cereali semplice e la frutta o l ingrediente principale disponibile.',
                    'Completa con una finitura leggera, senza trasformare la colazione in un pasto pesante.'
                ],
                title: `Colazione base con ${lead[0] || 'yogurt'} e ${lead[1] || 'cereali'}`,
                style: 'Cucina base',
                summary: `Colazione molto semplice per ${payload.people} ${peopleLabel}, costruita per essere davvero gestibile al mattino.`,
                whyItFits: `Tiene il tono della colazione: pratica, controllata e coerente con il profilo. ${goalHint(goal)} e ${dietHint(diet)}.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), useVeganGuidance ? 'yogurt o bevanda di soia' : 'yogurt o latte', 'cereale semplice'],
                steps: [
                    'Prepara una base rapida e molto leggibile.',
                    'Bilancia carboidrati e quota proteica senza appesantire il piatto.',
                    'Servi subito con una finitura minima.'
                ],
                wasteTip: 'Frutta molto matura o yogurt aperto si usano bene qui senza spreco.',
                goalTag: goal
            }, 'base', 0),
            withRecipeSlot({
                id: 'R002',
                nome_ricetta: `Colazione media con ${lead[0] || 'avena'} e ${lead[1] || 'frutta'}`,
                difficolta: 'Media',
                tempo_prep_min: 12,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Cottura breve o assemblaggio strutturato, mantenendo un formato chiaramente da colazione.',
                anti_spreco: 'L impasto o la base puo diventare una seconda porzione per il giorno dopo.',
                ingredienti_tabella: [...lead.slice(0, 3), useVeganGuidance ? 'yogurt di soia o semi di lino' : 'uova o yogurt', 'avena o farina'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Prepara una base da pancake, porridge o coppa strutturata.', 'Cuoci o assembla in pochi minuti.', 'Completa con topping misurato e coerente.'],
                title: `Colazione media con ${lead[0] || 'avena'} e ${lead[1] || 'frutta'}`,
                style: 'Cucina media',
                summary: 'Una colazione un po piu costruita ma ancora assolutamente mattutina e ripetibile.',
                whyItFits: `Aggiunge un po piu di struttura senza perdere il formato da colazione. Si abbina bene a uno stile di vita ${activity}.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), useVeganGuidance ? 'yogurt di soia o semi di lino' : 'uova o yogurt', 'avena o farina'],
                steps: ['Costruisci una base piu ricca ma semplice.', 'Mantieni porzione e densita sotto controllo.', 'Servi con finitura essenziale.'],
                wasteTip: 'Ottima anche come base da preparare in anticipo per il mattino seguente.',
                goalTag: goal
            }, 'media', 1),
            withRecipeSlot({
                id: 'R003',
                nome_ricetta: `Chef breakfast con ${lead[0] || 'frutta'} e ${lead[1] || 'cremosita'}`,
                difficolta: 'Chef',
                tempo_prep_min: 18,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Tecnica breve ma piu curata, con texture o finitura elegante pur restando nel perimetro della colazione.',
                anti_spreco: 'Riduzioni leggere, frutta molto matura o creme residue possono diventare finiture da breakfast.',
                ingredienti_tabella: [...lead.slice(0, 3), 'base cremosa', 'elemento croccante'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Prepara una base morbida o cremosa.', 'Aggiungi un contrasto croccante o una finitura fruttata.', 'Impiatta con precisione ma senza uscire dal formato breakfast.'],
                title: `Chef breakfast con ${lead[0] || 'frutta'} e ${lead[1] || 'cremosita'}`,
                style: 'Chef mode',
                summary: 'Versione breakfast piu curata, con piu precisione tecnica ma ancora plausibile al mattino.',
                whyItFits: `Alza il livello della colazione senza farla sembrare un dessert o un pranzo.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), 'base cremosa', 'elemento croccante'],
                steps: ['Costruisci due texture nette.', 'Mantieni dolcezza e grassi sotto controllo.', 'Chiudi con finitura pulita e mattutina.'],
                wasteTip: 'Componenti avanzate si riusano bene in coppette o overnight breakfast.',
                goalTag: goal
            }, 'chef', 2),
            withRecipeSlot({
                id: 'R004',
                nome_ricetta: `Salvafrigo breakfast di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 5,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Assemblaggio immediato, pensato per usare poco tempo e ingredienti gia aperti.',
                anti_spreco: 'Formato ideale per recuperare piccole quantita di yogurt, frutta, latte o cereali aperti.',
                ingredienti_tabella: [...lead.slice(0, 3), 'base rapida'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Assembla tutto in una ciotola o bicchiere.', 'Bilancia rapidamente consistenza e dolcezza.', 'Servi subito senza passaggi inutili.'],
                title: `Salvafrigo breakfast di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                style: 'Salvafrigo',
                summary: 'La versione piu immediata e utile possibile per una colazione rapida e anti-spreco.',
                whyItFits: `Riduce spreco e attrito decisionale nella mattina, restando coerente con il profilo.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), 'base rapida'],
                steps: ['Recupera gli ingredienti aperti.', 'Combinali in modo lineare.', 'Mantieni il risultato molto leggibile.'],
                wasteTip: 'Perfetta per finire piccole porzioni senza accumulare avanzi inutili.',
                goalTag: goal
            }, 'salvafrigo', 3)
        ];
    }

    if (mealType === 'spuntino') {
        return [
            withRecipeSlot({
                id: 'R001',
                nome_ricetta: `Spuntino base con ${lead[0] || 'frutta'} e ${lead[1] || 'supporto proteico'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 6,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Assemblaggio rapido o preparazione minima, in formato davvero da spuntino.',
                anti_spreco: 'Ottimo per usare piccole quantita residue senza creare un pasto in piu.',
                ingredienti_tabella: [...lead.slice(0, 2), useVeganGuidance ? 'yogurt di soia o frutta secca' : 'yogurt o frutta secca'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Scegli una base breve e porzionabile.', 'Aggiungi solo gli elementi necessari a sazieta e praticita.', 'Mantieni il formato compatto.'],
                title: `Spuntino base con ${lead[0] || 'frutta'} e ${lead[1] || 'supporto proteico'}`,
                style: 'Cucina base',
                summary: 'Spuntino semplice, rapido e controllato, pensato per stare davvero tra due pasti.',
                whyItFits: `Controlla fame e aderenza senza trasformarsi in un pranzo nascosto. ${goalHint(goal)}.${clinicalTail}`,
                ingredients: [...lead.slice(0, 2), useVeganGuidance ? 'yogurt di soia o frutta secca' : 'yogurt o frutta secca'],
                steps: ['Prepara una porzione breve.', 'Evita eccessi di volume e condimenti.', 'Servi o porta con te facilmente.'],
                wasteTip: 'Utile per finire piccole quantita di frutta, yogurt o creme residue.',
                goalTag: goal
            }, 'base', 0),
            withRecipeSlot({
                id: 'R002',
                nome_ricetta: `Spuntino media consistenza con ${lead[0] || 'frutta'} e ${lead[1] || 'cremosita'}`,
                difficolta: 'Media',
                tempo_prep_min: 10,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Preparazione breve ma un po piu costruita, come coppetta, mini pancake o crema densa.',
                anti_spreco: 'Le porzioni si preparano bene in anticipo e si consumano anche il giorno dopo.',
                ingredienti_tabella: [...lead.slice(0, 2), 'base cremosa', 'elemento saziante'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Crea una base compatta e porzionata.', 'Aggiungi un contrasto lieve.', 'Mantieni la proposta sotto il livello di un pasto completo.'],
                title: `Spuntino media consistenza con ${lead[0] || 'frutta'} e ${lead[1] || 'cremosita'}`,
                style: 'Cucina media',
                summary: 'Uno spuntino un po piu costruito, ma ancora molto chiaro e contenuto.',
                whyItFits: `Utile quando serve qualcosa di piu stabile di un semplice frutto, ma senza sfondare la logica dello snack.${clinicalTail}`,
                ingredients: [...lead.slice(0, 2), 'base cremosa', 'elemento saziante'],
                steps: ['Lavora su una consistenza piacevole.', 'Non appesantire con troppe componenti.', 'Chiudi in formato piccolo e leggibile.'],
                wasteTip: 'Si presta bene al batch piccolo e al recupero di ingredienti gia aperti.',
                goalTag: goal
            }, 'media', 1),
            withRecipeSlot({
                id: 'R003',
                nome_ricetta: `Snack chef con ${lead[0] || 'contrasto'} e ${lead[1] || 'finitura'}`,
                difficolta: 'Chef',
                tempo_prep_min: 14,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Mini preparazione tecnica con formato piccolo, elegante e coerente con uno spuntino.',
                anti_spreco: 'Anche qui le piccole componenti residue possono diventare topping o finiture.',
                ingredienti_tabella: [...lead.slice(0, 2), 'finitura tecnica'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Crea un piccolo formato preciso.', 'Gioca su due texture al massimo.', 'Chiudi con una finitura pulita senza trasformarlo in dessert da ristorante.'],
                title: `Snack chef con ${lead[0] || 'contrasto'} e ${lead[1] || 'finitura'}`,
                style: 'Chef mode',
                summary: 'Piccolo snack piu curato, ma ancora credibile come spuntino.',
                whyItFits: `Aggiunge precisione e piacere senza perdere il controllo del formato e della funzione dello spuntino.${clinicalTail}`,
                ingredients: [...lead.slice(0, 2), 'finitura tecnica'],
                steps: ['Mantieni il formato piccolo.', 'Evita accumuli calorici inutili.', 'Rendi il gesto tecnico breve ma visibile.'],
                wasteTip: 'Finiture e topping possono nascere da piccole quantita avanzate.',
                goalTag: goal
            }, 'chef', 2),
            withRecipeSlot({
                id: 'R004',
                nome_ricetta: `Salvafrigo snack di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 4,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Nessuna vera cottura o una sola micro-preparazione, per uno snack immediato.',
                anti_spreco: 'Formato ideale per piccole quantita che da sole non diventerebbero un pasto.',
                ingredienti_tabella: [...lead.slice(0, 2), 'elemento rapido'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: ['Recupera ingredienti aperti.', 'Assembla in una porzione piccola.', 'Servi subito o porta via facilmente.'],
                title: `Salvafrigo snack di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                style: 'Salvafrigo',
                summary: 'Snack rapidissimo e utile, pensato per non sprecare e non complicare la giornata.',
                whyItFits: `Riduce spreco e decisioni superflue, restando coerente con il ruolo di uno spuntino.${clinicalTail}`,
                ingredients: [...lead.slice(0, 2), 'elemento rapido'],
                steps: ['Usa solo il necessario.', 'Non costruire un piatto completo.', 'Chiudi in forma molto pratica.'],
                wasteTip: 'Perfetto per finire porzioni piccole senza lasciarle in frigo.',
                goalTag: goal
            }, 'salvafrigo', 3)
        ];
    }

    if (mealType === 'cena') {
        return [
            withRecipeSlot({
                id: 'R001',
                nome_ricetta: `Cena base con ${lead[0] || 'proteina'} e ${lead[1] || 'verdure'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 18,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Secondo piatto serale con tecnica semplice e contorno leggibile, senza deriva da pranzo pesante.',
                anti_spreco: 'Le verdure gia cotte o la proteina avanzata del giorno si recuperano bene in una cena ordinata.',
                ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'verdura di supporto'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: [
                    'Scegli una fonte proteica chiara come asse del piatto.',
                    'Cuoci o rigenera le verdure in modo semplice, tenendole ben riconoscibili.',
                    'Chiudi con un condimento misurato e, solo se utile, una piccola quota glucidica laterale.'
                ],
                title: `Cena base con ${lead[0] || 'proteina'} e ${lead[1] || 'verdure'}`,
                style: 'Cucina base',
                summary: `Cena base per ${payload.people} ${peopleLabel}, con struttura serale chiara: proteina, verdure e chiusura leggera.`,
                whyItFits: `Mantiene la cena leggibile e anti-fame senza trasformarla in un pranzo travestito. ${goalHint(goal)} e ${dietHint(diet)}.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), 'olio EVO', 'verdura di supporto'],
                steps: [
                    'Costruisci il piatto attorno a una proteina centrale.',
                    'Tieni le verdure come apertura o accompagnamento ben separato.',
                    'Usa una quota amidacea piccola solo se migliora equilibrio e sazieta.'
                ],
                wasteTip: 'Funziona bene per riutilizzare verdure grigliate, legumi gia pronti o proteine cotte in anticipo.',
                goalTag: goal
            }, 'base', 0),
            withRecipeSlot({
                id: 'R002',
                nome_ricetta: `Cena media con ${lead[0] || 'ingrediente principale'} e contorno strutturato`,
                difficolta: 'Media',
                tempo_prep_min: 26,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Cena domestica piu costruita: secondo ben definito, contorno o crema vegetale e chiusura ordinata.',
                anti_spreco: 'Il contorno o la crema possono nascere da verdure residue e tornare utili anche il giorno dopo.',
                ingredienti_tabella: [...lead.slice(0, 4), 'olio EVO', 'erbe aromatiche'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: [
                    'Prepara la componente proteica con una cottura pulita e leggibile.',
                    'Affianca una verdura piu costruita, come crema, teglia o padellata.',
                    'Bilancia il piatto senza sommare troppi elementi amidacei o grassi.'
                ],
                title: `Cena media con ${lead[0] || 'ingrediente principale'} e contorno strutturato`,
                style: 'Cucina media',
                summary: 'Cena intermedia con secondo e contorno ben distinti, adatta a una routine serale piu ordinata.',
                whyItFits: `Distingue meglio la cena dal pranzo: meno piatto unico centrale, piu struttura proteina piu vegetali.${clinicalTail}`,
                ingredients: [...lead.slice(0, 4), 'olio EVO', 'erbe aromatiche'],
                steps: [
                    'Cuoci la proteina come centro del piatto.',
                    'Costruisci un contorno riconoscibile e non accessorio.',
                    'Mantieni l insieme serale, pulito e non eccessivo.'
                ],
                wasteTip: 'Contorni e creme serali si prestano bene al recupero intelligente del frigo.',
                goalTag: goal
            }, 'media', 1),
            withRecipeSlot({
                id: 'R003',
                nome_ricetta: `Cena chef con ${lead[0] || 'proteina guida'} e ${lead[1] || 'contrasto vegetale'}`,
                difficolta: 'Chef',
                tempo_prep_min: 34,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Cena piu tecnica con controllo di cotture, salsa o finitura, ma ancora coerente con un formato serale.',
                anti_spreco: 'Rifilature e fondi possono diventare glasse leggere, creme o finiture aromatiche da cena.',
                ingredienti_tabella: [...lead.slice(0, 3), 'finitura tecnica', 'contrasto vegetale'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: [
                    'Gestisci con precisione la cottura della componente proteica.',
                    'Crea un contrasto vegetale o una salsa leggera che accompagni senza coprire.',
                    'Chiudi con una finitura netta e un impiattamento da cena curata, non da degustazione dispersiva.'
                ],
                title: `Cena chef con ${lead[0] || 'proteina guida'} e ${lead[1] || 'contrasto vegetale'}`,
                style: 'Chef mode',
                summary: 'Cena piu precisa e tecnica, pensata come secondo elegante con vegetali e finitura controllata.',
                whyItFits: `Alza il livello senza spostare il formato verso un primo importante o un piatto da brunch.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), 'finitura tecnica', 'contrasto vegetale'],
                steps: [
                    'Tieni la proteina come asse dominante.',
                    'Usa il contrasto vegetale per leggerezza e profondita, non come riempitivo.',
                    'Mantieni il piatto raffinato ma ancora chiaramente serale.'
                ],
                wasteTip: 'Fondi, erbe e verdure gia cotte possono diventare finiture intelligenti senza spreco.',
                goalTag: goal
            }, 'chef', 2),
            withRecipeSlot({
                id: 'R004',
                nome_ricetta: `Salvafrigo cena di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                difficolta: 'Semplice',
                tempo_prep_min: 10,
                allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
                tecnica_cottura: 'Cena rapida di recupero, con un solo asse proteico e pochi passaggi utili.',
                anti_spreco: 'Pensata per chiudere la giornata usando bene quello che resta senza improvvisare un piatto confuso.',
                ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'verdura rapida'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
                totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
                procedimento: [
                    'Recupera la fonte proteica gia pronta o piu veloce da preparare.',
                    'Abbina una sola verdura o una base vegetale molto rapida.',
                    'Condisci in modo pulito e servi senza creare un piatto eccessivamente ricco.'
                ],
                title: `Salvafrigo cena di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
                style: 'Salvafrigo',
                summary: 'Cena essenziale e anti-spreco, con struttura chiara e poco attrito decisionale.',
                whyItFits: `Aiuta a chiudere la giornata con una cena utile, leggibile e coerente col profilo.${clinicalTail}`,
                ingredients: [...lead.slice(0, 3), 'olio EVO', 'verdura rapida'],
                steps: [
                    'Usa un solo centro proteico.',
                    'Abbina una verdura che alleggerisca il piatto.',
                    'Evita di accumulare pane, pasta e condimenti superflui tutti insieme.'
                ],
                wasteTip: 'Perfetta per proteine avanzate, verdure cotte e piccole basi da finire.',
                goalTag: goal
            }, 'salvafrigo', 3)
        ];
    }

    return [
        withRecipeSlot({
            id: 'R001',
            nome_ricetta: `Pranzo base con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'base portante'}`,
            difficolta: 'Semplice',
            tempo_prep_min: 20,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Pranzo a piatto centrale: primo completo o piatto unico con base amidacea ben leggibile e condimento semplice.',
            anti_spreco: 'Le parti meno belle possono diventare una base aromatica o un condimento espresso per il pranzo del giorno dopo.',
            ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'base amidacea o legumi', 'erbe aromatiche'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Costruisci il pranzo attorno a una base portante chiara come pasta, riso, pane o legumi.',
                'Sviluppa il condimento con pochi passaggi netti e una buona leggibilita del piatto.',
                'Chiudi come piatto unico o primo completo, senza disperdere il risultato in troppi elementi separati.'
            ],
            title: `Pranzo base con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'base portante'}`,
            style: 'Cucina base',
            summary: `Pranzo semplice e centrale per ${payload.people} ${peopleLabel}, pensato come primo completo o piatto unico ordinato.`,
            whyItFits: `Tiene il pranzo su una struttura piu portante e continua, utile a sazieta e praticita. ${goalHint(goal)} e ${dietHint(diet)}.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'olio EVO', 'base amidacea o legumi', 'erbe aromatiche'],
            steps: [
                'Tieni una base portante ben evidente.',
                'Fai convergere il resto del piatto su quella base senza frammentarlo.',
                'Chiudi in modo pratico e saziante, adatto alla fascia centrale della giornata.'
            ],
            wasteTip: 'Ottimo per riusare sughi leggeri, cereali cotti o verdure avanzate dentro un piatto unico.',
            goalTag: goal
        }, 'base', 0),
        withRecipeSlot({
            id: 'R002',
            nome_ricetta: `Pranzo media con ${lead[0] || 'ingrediente principale'} e accompagnamento`,
            difficolta: 'Media',
            tempo_prep_min: 30,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Pranzo domestico piu costruito: primo o piatto unico con accompagnamento, crema o contorno di supporto.',
            anti_spreco: 'Le porzioni avanzate si conservano bene e si trasformano facilmente in pranzo da portare.',
            ingredienti_tabella: [...lead.slice(0, 4), 'olio EVO', 'spezie', 'pangrattato o semi'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Prepara un piatto principale piu strutturato della base, con una crema, salsa o accompagnamento leggibile.',
                'Mantieni comunque il cuore del pranzo su un asse centrale e saziante.',
                'Organizza la porzione anche in ottica meal prep o pranzo del giorno dopo.'
            ],
            title: `Pranzo media con ${lead[0] || 'ingrediente principale'} e accompagnamento`,
            style: 'Cucina media',
            summary: 'Una proposta intermedia da pranzo, con piatto principale piu accompagnamento ma ancora pienamente domestica.',
            whyItFits: `Rende il pranzo piu articolato senza spostarlo sulla logica del secondo serale.${clinicalTail}`,
            ingredients: [...lead.slice(0, 4), 'olio EVO', 'spezie', 'pangrattato o semi'],
            steps: [
                'Prepara un asse centrale piu curato rispetto alla versione base.',
                'Abbinalo a un supporto leggibile, ma non farlo diventare una cena a due tempi.',
                'Tieni il pranzo coeso, pratico e trasportabile se serve.'
            ],
            wasteTip: 'Le porzioni avanzate si conservano bene e si trasformano facilmente in pranzo da portare.',
            goalTag: goal
        }, 'media', 1),
        withRecipeSlot({
            id: 'R003',
            nome_ricetta: `Pranzo chef con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'contrasti'}`,
            difficolta: 'Chef',
            tempo_prep_min: 35,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Pranzo tecnico in piu componenti, piu vicino a un primo evoluto o a un piatto unico raffinato che a una cena da secondo.',
            anti_spreco: 'Anche in una proposta piu curata, rifilature e fondi possono diventare salse, garnish o basi aromatiche.',
            ingredienti_tabella: [...lead.slice(0, 3), 'elemento croccante', 'finitura aromatica'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Sviluppa un piatto centrale con una gerarchia chiara di componenti.',
                'Usa contrasti e finiture per dare precisione, ma mantieni il baricentro sul pranzo come piatto portante.',
                'Chiudi con una finitura pulita che valorizzi il piatto senza farlo sembrare una cena da secondo classico.'
            ],
            title: `Pranzo chef con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'contrasti'}`,
            style: 'Chef mode',
            summary: 'Una proposta pranzo piu tecnica e precisa, pensata come piatto centrale raffinato e non come cena di sola proteina.',
            whyItFits: `Alza davvero il livello del pranzo mantenendo un anima da piatto portante e strutturato.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'elemento croccante', 'finitura aromatica'],
            steps: [
                'Gestisci un piatto principale con controllo tecnico vero.',
                'Usa una seconda componente come supporto strutturale e non come semplice contorno.',
                'Impiatta in modo rigoroso ma ancora coerente con un pranzo reale.'
            ],
            wasteTip: 'Anche in una proposta piu curata, rifilature e fondi possono diventare salse, garnish o basi aromatiche.',
            goalTag: goal
        }, 'chef', 2),
        withRecipeSlot({
            id: 'R004',
            nome_ricetta: `Salvafrigo pranzo di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
            difficolta: 'Semplice',
            tempo_prep_min: 12,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Pranzo rapido di recupero, con un piatto unico semplice o un primo espresso molto leggibile.',
            anti_spreco: 'Questa modalita nasce per finire ingredienti aperti e parti meno nobili ma ancora buone.',
            ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'sale', 'erbe o spezie'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Riunisci ingredienti gia pronti o facili da trattare in un unico asse di pranzo.',
                'Usa una sola padella oppure un assemblaggio freddo, ma mantieni l idea di piatto centrale.',
                'Condisci in modo essenziale e servi subito come pranzo utile e anti-spreco.'
            ],
            title: `Salvafrigo pranzo di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
            style: 'Salvafrigo',
            summary: 'La versione pranzo piu semplice e diretta: poca tecnica, pochi passaggi, massima utilita e buona sazieta.',
            whyItFits: `Resta un pranzo vero, non solo un assemblaggio casuale: usa quello che c e ma con un centro chiaro.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'olio EVO', 'sale', 'erbe o spezie'],
            steps: [
                'Metti insieme una sola base portante con gli ingredienti da finire.',
                'Evita di disperdere il piatto in troppi elementi slegati.',
                'Servi subito come pranzo rapido ma con logica nutrizionale leggibile.'
            ],
            wasteTip: 'Questa modalita nasce per finire ingredienti aperti e parti meno nobili ma ancora buone.',
            goalTag: goal
        }, 'salvafrigo', 3)
    ];
}

function buildFallbackRecipes(payload) {
    const selectedTemplates = selectRecipeTemplatesBySlot(payload);
    const selectedBySlot = new Map(selectedTemplates.map((entry) => [entry.slot.key, entry.normalizedRecipe]));
    const genericBySlot = new Map(buildGenericFallbackRecipes(payload).map((recipe) => [recipe.mode_key, recipe]));
    const requestedSlot = getRequestedRecipeSlotConfig(payload.requestedMode);

    return [selectedBySlot.get(requestedSlot.key) || genericBySlot.get(requestedSlot.key)].filter(Boolean);
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
        const priorityKeys = [
            'summary',
            'focus',
            'core_principle',
            'core_principles',
            'practical_meaning',
            'principles',
            'key_points',
            'effects',
            'patterns',
            'notes',
            'examples',
            'steps'
        ];

        priorityKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                collectPromptLines(value[key], lines, seen);
            }
        });

        Object.keys(value).forEach((key) => {
            if (!priorityKeys.includes(key)) {
                collectPromptLines(value[key], lines, seen);
            }
        });
    }

    return lines;
}

function buildTextSignals(payload) {
    return normalizeText([
        ...payload.ingredients,
        payload.profile.goal,
        payload.profile.diet,
        payload.profile.allergies,
        payload.profile.intolerances,
        payload.profile.otherPathologies,
        payload.profile.jobType,
        payload.profile.username
    ].join(' | '));
}

function shouldApplyAntiAgeGuidance(profile, signalText = '') {
    const age = Number(profile?.age || 0);
    const signals = normalizeText(`${signalText} ${profile?.goal || ''} ${profile?.otherPathologies || ''} ${profile?.diet || ''}`);
    return age >= 45 || hasSignal(signals, ['anti age', 'antiage', 'anti aging', 'antiaging', 'omega 3', 'polifenoli', 'stress ossidativo']);
}

function shouldApplyVeganGuidance(profile, signalText = '') {
    const signals = normalizeText(`${signalText} ${profile?.diet || ''} ${profile?.goal || ''} ${profile?.otherPathologies || ''}`);
    return hasSignal(signals, ['vegano', 'vegan', '100 vegetale', '100% vegetale', 'plant based', 'plant-based', 'totalmente vegetale']);
}

function inferRequestedArchetypes(payload) {
    const signalText = buildTextSignals(payload);
    const archetypes = [];

    if (hasSignal(signalText, ['spaghetti', 'bucatini', 'tagliatelle', 'orecchiette', 'pasta', 'gnocchi', 'passatelli'])) {
        archetypes.push('pasta');
    }
    if (hasSignal(signalText, ['risotto', 'carnaroli', 'arborio'])) {
        archetypes.push('risotto');
    }
    if (hasSignal(signalText, ['riso', 'basmati', 'quinoa', 'farro', 'orzo', 'miglio', 'amaranto'])) {
        archetypes.push('grain-bowl');
    }
    if (hasSignal(signalText, ['lasagna', 'lasagne', 'sfoglia', 'crepes'])) {
        archetypes.push('baked-pasta');
    }
    if (hasSignal(signalText, ['orata', 'spigola', 'manzo', 'vitello', 'pollo', 'ossobuco', 'moscardini', 'carpaccio', 'cavolfiore'])) {
        archetypes.push('protein-main');
    }
    if (hasSignal(signalText, ['dolce', 'dessert', 'tiramisu', 'caprese', 'sorbetto', 'mousse', 'barrette'])) {
        archetypes.push('snack-dessert');
    }
    if (hasSignal(signalText, ['uovo', 'uova', 'tuorlo', 'albume', 'albumi'])) {
        archetypes.push('egg-dish');
    }
    if (hasSignal(signalText, ['focaccia', 'focaccine', 'piadina', 'impasto'])) {
        archetypes.push('flatbread');
    }
    if (hasSignal(signalText, ['forno', 'teglia', 'melanzane', 'zucca', 'patate'])) {
        archetypes.push('oven-roast');
    }
    if (hasSignal(signalText, ['brodo', 'zuppa'])) {
        archetypes.push('soup');
    }

    return uniqueStrings(archetypes);
}

function hasSignal(text, keywords) {
    return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function summarizeTemplateForPrompt(template) {
    return {
        id: template.id,
        nome_ricetta: template.nome_ricetta,
        difficolta: template.difficolta,
        tecnica_cottura: template.tecnica_cottura,
        anti_spreco: template.anti_spreco,
        archetypes: inferTemplateArchetypes(template),
        ingredienti_chiave: getTemplateIngredientNames(template).slice(0, 6)
    };
}

function buildIngredientSearchTerms(payload, rankedTemplates = []) {
    const terms = [
        ...payload.ingredients,
        ...rankedTemplates.flatMap((entry) => getTemplateIngredientNames(entry.template).slice(0, 4))
    ];

    return uniqueStrings(terms)
        .flatMap((item) => {
            const raw = String(item).trim();
            const normalized = normalizeText(item);
            const aliases = foodSynonymLookup.get(normalized) || [normalized];

            return uniqueStrings([normalized, ...aliases]).map((variant) => ({
                raw,
                normalized: variant
            }));
        })
        .filter((item) => item.normalized.length >= 3);
}

function expandIngredientAliases(value) {
    const normalized = normalizeText(value);
    if (!normalized) {
        return [];
    }

    const aliases = new Set([normalized]);

    foodSynonymLookup.forEach((group, alias) => {
        if (normalized.includes(alias)) {
            group.forEach((entry) => aliases.add(entry));
        }
    });

    return [...aliases];
}

function inferPreparationProfile(value) {
    const normalized = normalizeText(value);
    const methodKey = hasSignal(normalized, ['bollit', 'less', 'vapore'])
        ? 'bollitura'
        : hasSignal(normalized, ['padella', 'saltat', 'rosolat', 'tegamino'])
            ? 'padella_olio'
            : hasSignal(normalized, ['grigli', 'forno', 'arrost'])
                ? 'arrostimento'
                : hasSignal(normalized, ['microond'])
                    ? 'microonde'
                    : '';
    const isRaw = hasSignal(normalized, ['crudo', 'cruda', 'crudi', 'crude']);
    const isCooked = !isRaw && (Boolean(methodKey) || hasSignal(normalized, ['cotto', 'cotta', 'cotti', 'cotte', 'fritta', 'frittata']));

    return {
        normalized,
        methodKey,
        isRaw,
        isCooked
    };
}

function summarizeYieldFactorEntry(entry) {
    return {
        method_key: entry.method_key,
        method_label: entry.method_label,
        category: entry.category,
        food_name: entry.food_name,
        cooked_weight_g_per_100g_raw: Number(entry.cooked_weight_g_per_100g_raw || 0),
        yield_factor: Number(entry.yield_factor || 0)
    };
}

function selectRelevantYieldFactors(payload, rankedTemplates = [], limit = 10) {
    const searchTerms = buildIngredientSearchTerms(payload, rankedTemplates);

    if (foodYieldFactorEntries.length === 0 || searchTerms.length === 0) {
        return [];
    }

    return foodYieldFactorEntries
        .map((entry) => {
            const score = searchTerms.reduce((total, term) => {
                if (entry.normalizedAliases.includes(term.normalized)) return total + 10;
                if (entry.normalizedAliases.some((alias) => alias.includes(term.normalized) || term.normalized.includes(alias))) return total + 6;
                return total;
            }, 0);

            return { entry, score };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map((item) => summarizeYieldFactorEntry(item.entry));
}

function findBestYieldFactorEntry(ingredientName, matchedFood = null) {
    const ingredientProfile = inferPreparationProfile(ingredientName);
    const foodProfile = inferPreparationProfile(`${matchedFood?.name || ''} ${matchedFood?.info || ''}`);
    const aliases = uniqueStrings([
        ...expandIngredientAliases(ingredientName),
        ...expandIngredientAliases(matchedFood?.name || '')
    ]).map((entry) => normalizeText(entry));

    return foodYieldFactorEntries
        .map((entry) => {
            const aliasScore = aliases.reduce((total, alias) => {
                if (entry.normalizedAliases.includes(alias)) return total + 12;
                if (entry.normalizedAliases.some((item) => item.includes(alias) || alias.includes(item))) return total + 7;
                return total;
            }, 0);
            const methodScore = ingredientProfile.methodKey && ingredientProfile.methodKey === entry.method_key ? 5 : 0;
            const cookedScore = ingredientProfile.isCooked && foodProfile.isRaw ? 2 : 0;
            const rawScore = ingredientProfile.isRaw && foodProfile.isCooked ? 2 : 0;

            return {
                entry,
                score: aliasScore + methodScore + cookedScore + rawScore
            };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)[0]?.entry || null;
}

function adaptFoodCompositionByYieldFactor(food, ingredientName) {
    if (!food || !ingredientName) {
        return food;
    }

    const ingredientProfile = inferPreparationProfile(ingredientName);
    const foodProfile = inferPreparationProfile(`${food.name || ''} ${food.info || ''}`);

    if ((!ingredientProfile.isCooked && !ingredientProfile.isRaw) || (!foodProfile.isCooked && !foodProfile.isRaw)) {
        return food;
    }

    const direction = ingredientProfile.isCooked && foodProfile.isRaw
        ? 'raw-to-cooked'
        : (ingredientProfile.isRaw && foodProfile.isCooked ? 'cooked-to-raw' : '');

    if (!direction) {
        return food;
    }

    const yieldEntry = findBestYieldFactorEntry(ingredientName, food);
    const factor = Number(yieldEntry?.yield_factor || 0);
    if (!Number.isFinite(factor) || factor <= 0) {
        return food;
    }

    const multiplier = direction === 'raw-to-cooked' ? (1 / factor) : factor;
    const adaptedFood = { ...food };

    YIELD_NUMERIC_FIELDS.forEach((field) => {
        if (Number.isFinite(Number(adaptedFood[field]))) {
            adaptedFood[field] = Number((Number(adaptedFood[field]) * multiplier).toFixed(2));
        }
    });

    if (Number.isFinite(Number(adaptedFood.portion_g))) {
        adaptedFood.portion_g = Number((Number(adaptedFood.portion_g) * (direction === 'raw-to-cooked' ? factor : multiplier)).toFixed(1));
    }

    adaptedFood.yield_applied = {
        direction,
        method_key: yieldEntry.method_key,
        food_name: yieldEntry.food_name,
        yield_factor: factor
    };

    return adaptedFood;
}

function findBestFoodCompositionMatch(ingredientName, candidateFoods) {
    const foods = Array.isArray(candidateFoods) ? candidateFoods : [];
    if (!ingredientName || foods.length === 0) {
        return null;
    }

    const normalizedIngredient = normalizeText(ingredientName);
    const aliasTerms = foodSynonymLookup.get(normalizedIngredient) || [normalizedIngredient];

    return foods
        .map((food) => {
            const normalizedName = normalizeText(food.name);
            const score = aliasTerms.reduce((total, term) => {
                if (normalizedName === term) return total + 15;
                if (normalizedName.includes(term) || term.includes(normalizedName)) return total + 10;
                if (normalizedName.split(',').some((part) => part.trim() === term)) return total + 8;
                return total;
            }, 0);

            return { food, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score)[0]?.food || null;
}

function completeMacroFromFood(currentValue, per100Value, qty) {
    const current = normalizeNutritionNumber(currentValue);
    if (current > 0) {
        return current;
    }

    const per100 = Number(per100Value || 0);
    const quantity = Number(qty || 0);

    if (!Number.isFinite(per100) || per100 <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
        return 0;
    }

    return normalizeNutritionNumber((per100 * quantity) / 100);
}

function estimateCaloriesFromMacros(protein, carbs, fat) {
    const proteinValue = Number(protein || 0);
    const carbValue = Number(carbs || 0);
    const fatValue = Number(fat || 0);

    const estimated =
        (proteinValue * CREA_NUTRITION_METHOD.energyFactors.proteinKcalPerG)
        + (carbValue * CREA_NUTRITION_METHOD.energyFactors.availableCarbKcalPerG)
        + (fatValue * CREA_NUTRITION_METHOD.energyFactors.fatKcalPerG);

    return normalizeNutritionNumber(estimated);
}

function completeCaloriesFromFood(currentValue, row, matchedFood) {
    const current = normalizeNutritionNumber(currentValue);
    if (current > 0) {
        return current;
    }

    const fromFood = matchedFood
        ? completeMacroFromFood(0, matchedFood.energy_kcal, row.qty)
        : 0;

    if (fromFood > 0) {
        return fromFood;
    }

    return estimateCaloriesFromMacros(row.p, row.c, row.g);
}

function collectCompletedNutritionFields(originalRow, completedRow) {
    const fieldMap = [
        ['k', 'kcal'],
        ['p', 'proteine'],
        ['c', 'carboidrati'],
        ['g', 'grassi']
    ];

    return fieldMap
        .filter(([key]) => normalizeNutritionNumber(originalRow[key]) <= 0 && normalizeNutritionNumber(completedRow[key]) > 0)
        .map(([, label]) => label);
}

function buildNutritionRowMeta(originalRow, completedRow, matchedFood, adaptedFood) {
    const completedFields = collectCompletedNutritionFields(originalRow, completedRow);
    const meta = {
        source: completedFields.length > 0 ? (matchedFood ? 'crea-completed' : 'estimated') : 'original',
        completed_fields: completedFields,
        matched_food_name: matchedFood ? String(matchedFood.name || '').trim() : '',
        yield_applied: adaptedFood?.yield_applied || null
    };

    if (meta.source === 'original' && !meta.yield_applied) {
        return null;
    }

    return meta;
}

function formatNutritionRowMeta(meta) {
    if (!meta || typeof meta !== 'object') {
        return null;
    }

    const notes = [];

    if (Array.isArray(meta.completed_fields) && meta.completed_fields.length > 0) {
        if (meta.source === 'estimated') {
            notes.push(`campi stimati: ${meta.completed_fields.join(', ')}`);
        } else {
            notes.push(`campi completati: ${meta.completed_fields.join(', ')}`);
        }
    }

    if (meta.yield_applied?.direction === 'raw-to-cooked') {
        notes.push(`adattamento crudo -> cotto (${meta.yield_applied.method_key}, Y.F. ${meta.yield_applied.yield_factor})`);
    } else if (meta.yield_applied?.direction === 'cooked-to-raw') {
        notes.push(`adattamento cotto -> crudo (${meta.yield_applied.method_key}, Y.F. ${meta.yield_applied.yield_factor})`);
    }

    return notes.length > 0 ? notes.join(' | ') : null;
}

function completeIngredientRowsWithFoodComposition(ingredientRows, candidateFoods) {
    return ingredientRows.map((row) => {
        const matchedFood = findBestFoodCompositionMatch(row.n, candidateFoods);
        const adaptedFood = matchedFood ? adaptFoodCompositionByYieldFactor(matchedFood, row.n) : null;
        if (!matchedFood) {
            const estimatedCalories = completeCaloriesFromFood(row.k, row, null);

            return {
                ...row,
                k: estimatedCalories,
                nutrition_meta: buildNutritionRowMeta(row, { ...row, k: estimatedCalories }, null, null)
            };
        }

        const completedRow = {
            ...row,
            p: completeMacroFromFood(row.p, adaptedFood.proteins, row.qty),
            c: completeMacroFromFood(row.c, adaptedFood.available_carbohydrates, row.qty),
            g: completeMacroFromFood(row.g, adaptedFood.lipids, row.qty)
        };

        return {
            ...completedRow,
            k: completeCaloriesFromFood(row.k, completedRow, adaptedFood),
            nutrition_meta: buildNutritionRowMeta(
                row,
                {
                    ...completedRow,
                    k: completeCaloriesFromFood(row.k, completedRow, adaptedFood)
                },
                matchedFood,
                adaptedFood
            )
        };
    });
}

function computeTotalPlateFromRows(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    return rows.reduce((total, row) => ({
        k: normalizeNutritionNumber(total.k + Number(row.k || 0)),
        p: normalizeNutritionNumber(total.p + Number(row.p || 0)),
        c: normalizeNutritionNumber(total.c + Number(row.c || 0)),
        g: normalizeNutritionNumber(total.g + Number(row.g || 0))
    }), { k: 0, p: 0, c: 0, g: 0 });
}

function completePlateTotals(totalPlate, ingredientRows) {
    const computed = computeTotalPlateFromRows(ingredientRows);
    if (!computed) {
        return totalPlate;
    }

    if (!totalPlate) {
        return computed;
    }

    return {
        k: normalizeNutritionNumber(totalPlate.k || computed.k || estimateCaloriesFromMacros(totalPlate.p, totalPlate.c, totalPlate.g)),
        p: normalizeNutritionNumber(totalPlate.p || computed.p),
        c: normalizeNutritionNumber(totalPlate.c || computed.c),
        g: normalizeNutritionNumber(totalPlate.g || computed.g)
    };
}

function inferNutritionSignalsFromFoodRefs(foodRefs) {
    const refs = Array.isArray(foodRefs) ? foodRefs : [];

    return {
        highProteinFoods: refs.filter((food) => Number(food.proteins || 0) >= 15).slice(0, 5).map((food) => food.name),
        highFiberFoods: refs.filter((food) => Number(food.total_fiber || 0) >= 6).slice(0, 5).map((food) => food.name),
        lowLactoseFoods: refs.filter((food) => Number(food.lactose_g || 0) <= 0.5).slice(0, 5).map((food) => food.name),
        sodiumAwareFoods: refs.filter((food) => Number(food.sodium_mg || 0) >= 400).slice(0, 5).map((food) => food.name)
    };
}

function summarizeFoodCompositionEntry(food) {
    return {
        food_code: food.food_code,
        name: food.name,
        category: food.category,
        portion_g: Number(food.portion_g || 0),
        energy_kcal: Number(food.energy_kcal || 0),
        proteins: Number(food.proteins || 0),
        lipids: Number(food.lipids || 0),
        available_carbohydrates: Number(food.available_carbohydrates || 0),
        total_fiber: Number(food.total_fiber || 0),
        sodium_mg: Number(food.sodium_mg || 0),
        potassium_mg: Number(food.potassium_mg || 0),
        calcium_mg: Number(food.calcium_mg || 0),
        iron_mg: Number(food.iron_mg || 0),
        folate_ug: Number(food.folate_ug || 0),
        vitamin_b12_ug: Number(food.vitamin_b12_ug || 0),
        lactose_g: Number(food.lactose_g || 0),
        starch_g: Number(food.starch_g || 0),
        soluble_sugars_g: Number(food.soluble_sugars_g || 0),
        limiting_amino_acid: String(food.limiting_amino_acid || '').trim()
    };
}

function selectRelevantFoodComposition(payload, rankedTemplates = [], limit = 10) {
    const foods = Array.isArray(chefFoodCompositionCrea?.foods) ? chefFoodCompositionCrea.foods : [];
    const searchTerms = buildIngredientSearchTerms(payload, rankedTemplates);

    if (foods.length === 0 || searchTerms.length === 0) {
        return [];
    }

    return foods
        .map((food) => {
            const normalizedName = normalizeText(food.name);
            const normalizedCategory = normalizeText(food.category);

            const score = searchTerms.reduce((total, term) => {
                if (normalizedName === term.normalized) return total + 12;
                if (normalizedName.includes(term.normalized) || term.normalized.includes(normalizedName)) return total + 8;
                if (normalizedName.split(',').some((part) => part.trim() === term.normalized)) return total + 7;
                if (normalizedCategory.includes(term.normalized)) return total + 2;
                return total;
            }, 0);

            return {
                food,
                score
            };
        })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map((entry) => summarizeFoodCompositionEntry(entry.food));
}

function summarizeTemplateSlotsForPrompt(payload) {
    return selectRecipeTemplatesBySlot(payload)
        .filter((entry) => entry.slot.key === payload.requestedMode)
        .map((entry) => ({
        slot_key: entry.slot.key,
        slot_label: entry.slot.label,
        target_difficulty: entry.slot.difficulty,
        slot_brief: entry.slot.brief,
        slot_examples: entry.slot.examples,
        template: summarizeTemplateForPrompt(entry.template)
        }));
}

function assignRecipeToRequestedSlot(recipe, requestedMode) {
    if (!recipe) return null;

    const slot = getRequestedRecipeSlotConfig(requestedMode);

    return withRecipeSlot({
        ...recipe,
        mode_key: recipe.mode_key || recipe.modeKey || slot.key,
        mode_label: recipe.mode_label || recipe.modeLabel || slot.label,
        difficolta: recipe.difficolta || slot.difficulty
    }, slot.key, 0);
}

function selectRelevantKnowledge(payload, rankedTemplates = []) {
    const signalText = buildTextSignals(payload);
    const requestedArchetypes = inferRequestedArchetypes(payload);
    const topTemplates = rankedTemplates.map((entry) => entry.template).slice(0, 4);
    const matchedArchetypes = uniqueStrings([
        ...requestedArchetypes,
        ...topTemplates.flatMap((template) => inferTemplateArchetypes(template))
    ]);
    const matchedKnowledgeKeys = new Set(topTemplates.flatMap((template) => inferTemplateKnowledgeKeys(template)));

    const hasArchetype = (value) => matchedArchetypes.includes(value);
    const hasTemplateKnowledge = (value) => matchedKnowledgeKeys.has(value);
    const hasVegetableSignal = hasSignal(signalText, [
        'zucchina', 'carota', 'melanz', 'peperon', 'pomodor', 'zucca', 'asparag', 'patat', 'fung', 'cavol', 'broccoli', 'cipoll', 'aglio', 'radicch', 'biet', 'finocch'
    ]);
    const hasEggSignal = hasSignal(signalText, ['uovo', 'uova', 'omelette', 'frittata', 'coque', 'bazzotto']);
    const hasFermentationSignal = hasSignal(signalText, ['yogurt', 'kefir', 'kombucha', 'ferment', 'aceto', 'vino', 'birra', 'pasta madre', 'lievito']);
    const hasDoughSignal = hasSignal(signalText, ['farina', 'impasto', 'pane', 'pizza', 'focaccia', 'focaccine', 'panettone', 'colomba', 'malto', 'lievito']);
    const hasProteinSignal = payload.profile.workoutsPerWeek > 0 || hasSignal(signalText, ['massa', 'dimagr', 'prote', 'pollo', 'pesce', 'tofu', 'tempeh', 'uova', 'skyr', 'legumi']);
    const hasLowFodmapSignal = hasSignal(signalText, ['fodmap', 'ibs', 'colon irritabile', 'intestino', 'gonfiore', 'reflusso']);
    const hasPlantSignal = hasSignal(signalText, ['vegano', 'vegetar', 'plant', 'integrale', 'crudo', 'raw', 'fruttar']);
    const hasRomanSignal = hasSignal(signalText, ['amatriciana', 'guanciale', 'pecorino', 'bucatini', 'rigatoni', 'spaghetti']);
    const hasAciditySignal = hasSignal(signalText, ['limone', 'aceto', 'pomodoro', 'ferment', 'pectina', 'marmellata', 'yogurt']);
    const hasFlatbreadSignal = hasSignal(signalText, ['focacc', 'padella', 'zucchina', 'carota', 'yogurt', 'ricotta', 'peperone']);
    const hasAntiAgeSignal = shouldApplyAntiAgeGuidance(payload.profile, signalText);
    const hasVeganSignal = shouldApplyVeganGuidance(payload.profile, signalText);
    const relevantFoodComposition = selectRelevantFoodComposition(payload, rankedTemplates);
    const relevantYieldFactors = selectRelevantYieldFactors(payload, rankedTemplates);

    const modules = [
        {
            key: 'coreKnowledge',
            title: 'Fondamenti di cucina consapevole',
            reason: 'base tecnica e anti-spreco da usare sempre',
            data: chefKnowledge,
            include: true
        },
        {
            key: 'techniques',
            title: 'Tecniche di cottura',
            reason: 'serve per scegliere tecniche coerenti e non generiche',
            data: chefTechniques,
            include: true
        },
        {
            key: 'substitutions',
            title: 'Sostituzioni intelligenti',
            reason: 'utile per adattare ricette a allergie, intolleranze e dieta',
            data: chefSubstitutions,
            include: true
        },
        {
            key: 'textureBalance',
            title: 'Equilibrio di texture e gusto',
            reason: 'aiuta a evitare piatti piatti o monotoni',
            data: chefTextureBalance,
            include: true
        },
        {
            key: 'scrapReuse',
            title: 'Anti-spreco pratico',
            reason: 'serve a dare valore reale agli ingredienti e agli avanzi',
            data: chefScrapReuse,
            include: true
        },
        {
            key: 'ingredientSafety',
            title: 'Sicurezza ingredienti',
            reason: 'serve quando tecnica e ingredienti lo richiedono',
            data: chefIngredientSafety,
            include: true
        },
        {
            key: 'nutritionCounseling',
            title: 'Ragionamento nutrizionale professionale',
            reason: 'serve a trasformare esempi clinici in metodo adattabile al singolo utente, non in regole fisse',
            data: nutritionCounselingBreakfastPatterns,
            include: true
        },
        {
            key: 'nutritionCounselingLunch',
            title: 'Ragionamento professionale sul pranzo',
            reason: 'utile per trasformare un esempio di pranzo in logica adattabile su cereali, legumi, verdure, condimento e sazieta',
            data: nutritionCounselingLunchPatterns,
            include: hasSignal(signalText, ['pranzo', 'pasta', 'riso', 'farro', 'orzo', 'quinoa', 'cous', 'gnocchi', 'legumi', 'edamame']) || hasArchetype('pasta') || hasArchetype('grain-bowl')
        },
        {
            key: 'nutritionCounselingDinner',
            title: 'Ragionamento professionale sulla cena',
            reason: 'utile per trasformare un esempio di cena in logica adattabile su apertura vegetale, rotazione proteica, quota glucidica e condimento',
            data: nutritionCounselingDinnerPatterns,
            include: hasSignal(signalText, ['cena', 'uova', 'tofu', 'tempeh', 'ricotta', 'feta', 'mozzarella', 'certosa', 'burger', 'lupini', 'patata', 'pane scuro', 'riso']) || hasArchetype('protein-main') || hasArchetype('egg-dish')
        },
        {
            key: 'nutritionCounselingDinnerTemplates',
            title: 'Mini-template tecnici cena tofu-tempeh',
            reason: 'utile per rendere piu precise alcune cene vegetali con tofu o tempeh attraverso strutture tecniche gia collaudate',
            data: nutritionCounselingDinnerTemplates,
            include: hasSignal(signalText, ['tofu', 'tempeh', 'spinaci', 'tahina', 'limone', 'pepe rosa', 'pomodori secchi']) || payload.profile.dinnerProteinPreference === 'tofu-tempeh'
        },
        {
            key: 'nutritionCounselingWeeklyMenu',
            title: 'Ragionamento professionale sul menu settimanale',
            reason: 'utile per far nascere ricette che si inseriscono in una settimana credibile, completa nei pasti e coerente con praticita, varieta e anti-spreco',
            data: nutritionCounselingWeeklyMenuPatterns,
            include: true
        },
        {
            key: 'nutritionCounselingAntiAge',
            title: 'Ragionamento professionale anti-age',
            reason: 'utile per privilegiare idratazione, polifenoli, Omega 3, verdure e una rotazione piu sobria delle proteine animali quando il profilo lo rende pertinente',
            data: nutritionCounselingAntiAgePatterns,
            include: hasAntiAgeSignal
        },
        {
            key: 'nutritionCounselingVeganMenu',
            title: 'Ragionamento professionale sul menu vegetale',
            reason: 'utile per piatti 100% vegetali completi, mediterranei e organizzabili nella settimana reale, ma anche come ispirazione per spingere piu in alto la quota vegetale di altri profili',
            data: nutritionCounselingVeganMenuPatterns,
            include: hasVeganSignal
        },
        {
            key: 'vegetableScience',
            title: 'Scienza delle verdure',
            reason: 'gli ingredienti indicano che la gestione degli ortaggi puo migliorare il risultato',
            data: chefVegetableScience,
            include: hasVegetableSignal || hasTemplateKnowledge('vegetableScience') || hasArchetype('oven-roast')
        },
        {
            key: 'eggStorage',
            title: 'Conservazione delle uova',
            reason: 'rilevante solo se le uova sono coinvolte',
            data: chefEggStorage,
            include: hasEggSignal || hasTemplateKnowledge('eggStorage')
        },
        {
            key: 'eggCooking',
            title: 'Cottura delle uova',
            reason: 'rilevante solo se le uova sono coinvolte',
            data: chefEggCooking,
            include: hasEggSignal || hasTemplateKnowledge('eggCooking') || hasArchetype('egg-dish')
        },
        {
            key: 'fermentation',
            title: 'Fermentazione',
            reason: 'serve se compaiono ingredienti o tecniche fermentate',
            data: chefFermentation,
            include: hasFermentationSignal || hasTemplateKnowledge('fermentation')
        },
        {
            key: 'yeastCivilization',
            title: 'Lievito e cultura alimentare',
            reason: 'utile per impasti, pane, vino, birra e fermentazioni tradizionali',
            data: chefYeastCivilization,
            include: hasDoughSignal || hasFermentationSignal || hasTemplateKnowledge('yeastCivilization') || hasArchetype('flatbread')
        },
        {
            key: 'maltDiastic',
            title: 'Malto e potere diastasico',
            reason: 'utile solo con impasti e lievitati',
            data: chefMaltDiastic,
            include: hasDoughSignal || hasTemplateKnowledge('maltDiastic')
        },
        {
            key: 'acidityPh',
            title: 'Acidi e pH',
            reason: 'rilevante per acidita, pomodoro, fermentazioni e gelificazione',
            data: chefAcidityPh,
            include: hasAciditySignal || hasTemplateKnowledge('acidityPh') || hasArchetype('pasta') || hasArchetype('risotto')
        },
        {
            key: 'proteinPlanning',
            title: 'Pianificazione proteica',
            reason: 'rilevante per obiettivi corporei o piatti ad alta quota proteica',
            data: chefProteinPlanning,
            include: hasProteinSignal || hasTemplateKnowledge('proteinPlanning') || hasArchetype('protein-main')
        },
        {
            key: 'panVegetableFlatbreads',
            title: 'Focaccine di verdure in padella',
            reason: 'utile per impasti rapidi in padella con verdure',
            data: chefPanVegetableFlatbreads,
            include: hasFlatbreadSignal || hasTemplateKnowledge('panVegetableFlatbreads') || hasArchetype('flatbread')
        },
        {
            key: 'amatricianaTraditional',
            title: 'Amatriciana tradizionale',
            reason: 'utile solo se la richiesta richiama il piatto o i suoi ingredienti identitari',
            data: chefAmatricianaTraditional,
            include: hasRomanSignal || hasTemplateKnowledge('amatricianaTraditional')
        },
        {
            key: 'lowFodmap',
            title: 'Low FODMAP',
            reason: 'utile se profilo o richiesta parlano di sensibilita intestinali o low FODMAP',
            data: chefLowFodmap,
            include: hasLowFodmapSignal || hasTemplateKnowledge('lowFodmap')
        },
        {
            key: 'plantBasedRawPattern',
            title: 'Cucina vegetale integrale e crudo',
            reason: 'utile per ricette plant-based, integrali o raw-oriented',
            data: chefPlantBasedRawPattern,
            include: hasPlantSignal || hasTemplateKnowledge('plantBasedRawPattern') || hasArchetype('snack-dessert')
        },
        {
            key: 'coldKitchen',
            title: 'Cucina fredda e tiepida',
            reason: 'utile per bowl, insalate, piatti assemblati e preparazioni fredde',
            data: chefColdKitchen,
            include: hasSignal(signalText, ['insalata', 'bowl', 'fredd', 'tiepid', 'crudo']) || hasTemplateKnowledge('coldKitchen') || hasArchetype('grain-bowl')
        }
    ];

    const nutritionSignals = inferNutritionSignalsFromFoodRefs(relevantFoodComposition);

    return {
        dishArchetypes: matchedArchetypes.slice(0, 5),
        foodCompositionRefs: relevantFoodComposition,
        yieldFactorRefs: relevantYieldFactors,
        nutritionSignals,
        modules: modules
            .filter((module) => module.include)
            .slice(0, 10)
            .map((module) => ({
                key: module.key,
                title: module.title,
                reason: module.reason,
                guidance: collectPromptLines(module.data).slice(0, 5)
            }))
    };
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

function normalizeNutritionNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Number(numeric.toFixed(1)) : 0;
}

function parseIngredientQuantity(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Number(value.toFixed(1));
    }

    const text = String(value || '').trim().replace(',', '.');
    if (!text) {
        return 0;
    }

    const directNumber = Number(text);
    if (Number.isFinite(directNumber)) {
        return Number(directNumber.toFixed(1));
    }

    const match = text.match(/\d+(?:\.\d+)?/);
    if (!match) {
        return 0;
    }

    return Number(Number(match[0]).toFixed(1));
}

function normalizeNutrition(nutrition) {
    if (!nutrition || typeof nutrition !== 'object') {
        return null;
    }

    const ingredientRows = Array.isArray(nutrition.ingredients)
        ? nutrition.ingredients
            .map((row) => {
                if (!row || typeof row !== 'object') return null;
                const name = String(row.name || row.ingredient || '').trim();
                if (!name) return null;

                return {
                    name,
                    kcal: normalizeNutritionNumber(row.kcal),
                    protein: normalizeNutritionNumber(row.protein ?? row.proteine),
                    carbs: normalizeNutritionNumber(row.carbs ?? row.carbohydrates ?? row.carboidrati),
                    fat: normalizeNutritionNumber(row.fat ?? row.grassi),
                    note: formatNutritionRowMeta(row.note ? { source: 'original', completed_fields: [], matched_food_name: '', yield_applied: null, note: row.note } : row.nutrition_meta || row.meta || null)
                };
            })
            .filter(Boolean)
        : [];

    const total = nutrition.total && typeof nutrition.total === 'object'
        ? {
            kcal: normalizeNutritionNumber(nutrition.total.kcal),
            protein: normalizeNutritionNumber(nutrition.total.protein ?? nutrition.total.proteine),
            carbs: normalizeNutritionNumber(nutrition.total.carbs ?? nutrition.total.carbohydrates ?? nutrition.total.carboidrati),
            fat: normalizeNutritionNumber(nutrition.total.fat ?? nutrition.total.grassi)
        }
        : null;

    if (ingredientRows.length === 0 && !total) {
        return null;
    }

    return {
        ingredients: ingredientRows,
        total
    };
}

function normalizeRecipe(recipe, index, candidateFoods = []) {
    if (!recipe || typeof recipe !== 'object') return null;

    const baseIngredientRows = Array.isArray(recipe.ingredienti_tabella)
        ? recipe.ingredienti_tabella.map((row) => ({
            n: String(row.n || row.name || row.ingredient || '').trim(),
            qty: parseIngredientQuantity(row.qty),
            k: normalizeNutritionNumber(row.k ?? row.kcal),
            p: normalizeNutritionNumber(row.p ?? row.protein ?? row.proteine),
            c: normalizeNutritionNumber(row.c ?? row.carbs ?? row.carboidrati),
            g: normalizeNutritionNumber(row.g ?? row.fat ?? row.grassi)
        })).filter((row) => row.n)
        : [];

    const ingredientRows = completeIngredientRowsWithFoodComposition(baseIngredientRows, candidateFoods);

    const baseTotalPlate = recipe.totale_piatto && typeof recipe.totale_piatto === 'object'
        ? {
            k: normalizeNutritionNumber(recipe.totale_piatto.k ?? recipe.totale_piatto.kcal),
            p: normalizeNutritionNumber(recipe.totale_piatto.p ?? recipe.totale_piatto.protein ?? recipe.totale_piatto.proteine),
            c: normalizeNutritionNumber(recipe.totale_piatto.c ?? recipe.totale_piatto.carbs ?? recipe.totale_piatto.carboidrati),
            g: normalizeNutritionNumber(recipe.totale_piatto.g ?? recipe.totale_piatto.fat ?? recipe.totale_piatto.grassi)
        }
        : null;

    const totalPlate = completePlateTotals(baseTotalPlate, ingredientRows);

    const normalized = {
        id: String(recipe.id || `R${String(index + 1).padStart(3, '0')}`).trim(),
        nome_ricetta: String(recipe.nome_ricetta || recipe.title || `Ricetta ${index + 1}`).trim(),
        difficolta: String(recipe.difficolta || 'Semplice').trim(),
        tempo_prep_min: Number(recipe.tempo_prep_min || 20),
        allergeni_esclusi: Array.isArray(recipe.allergeni_esclusi) ? recipe.allergeni_esclusi.map(String).filter(Boolean) : [],
        tecnica_cottura: String(recipe.tecnica_cottura || recipe.healthyCooking || '').trim(),
        anti_spreco: String(recipe.anti_spreco || recipe.wasteTip || recipe.antiWasteTip || '').trim(),
        ingredienti_tabella: ingredientRows,
        totale_piatto: totalPlate,
        procedimento: Array.isArray(recipe.procedimento) ? recipe.procedimento.map(String).filter(Boolean) : [],
        title: String(recipe.title || `Ricetta ${index + 1}`).trim(),
        style: String(recipe.style || 'Idea personalizzata').trim(),
        summary: String(recipe.summary || '').trim(),
        whyItFits: String(recipe.whyItFits || recipe.why || '').trim(),
        chef_note: String(recipe.chef_note || recipe.chefNote || '').trim(),
        bioavailability_tip: String(recipe.bioavailability_tip || recipe.bioavailabilityTip || '').trim(),
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(String).filter(Boolean) : ingredientRows.map((row) => row.n),
        steps: Array.isArray(recipe.steps) ? recipe.steps.map(String).filter(Boolean) : (Array.isArray(recipe.procedimento) ? recipe.procedimento.map(String).filter(Boolean) : []),
        wasteTip: String(recipe.wasteTip || recipe.antiWasteTip || '').trim(),
        goalTag: String(recipe.goalTag || '').trim(),
        substitutions: Array.isArray(recipe.substitutions) ? recipe.substitutions.map(String).filter(Boolean) : [],
        healthyCooking: String(recipe.healthyCooking || recipe.tecnica_cottura || '').trim(),
        nutrition: (ingredientRows.length > 0 || totalPlate ? {
            ingredients: ingredientRows.map((row) => ({
                name: row.n,
                kcal: row.k,
                protein: row.p,
                carbs: row.c,
                fat: row.g,
                note: formatNutritionRowMeta(row.nutrition_meta)
            })),
            total: totalPlate ? {
                kcal: totalPlate.k,
                protein: totalPlate.p,
                carbs: totalPlate.c,
                fat: totalPlate.g
            } : null
        } : normalizeNutrition(recipe.nutrition))
    };

    if (!normalized.title || normalized.ingredients.length === 0 || normalized.steps.length === 0) {
        return null;
    }

    return normalized;
}

function recipeHasQuantifiedIngredients(recipe) {
    const rows = Array.isArray(recipe?.ingredienti_tabella) ? recipe.ingredienti_tabella : [];

    return rows.length > 0 && rows.every((row) => Number(row?.qty || 0) > 0);
}

function recipeHasPrepTime(recipe) {
    return Number(recipe?.tempo_prep_min || 0) > 0;
}

function recipeHasStepByStepProcedure(recipe, minSteps = 2) {
    const steps = Array.isArray(recipe?.procedimento)
        ? recipe.procedimento
        : (Array.isArray(recipe?.steps) ? recipe.steps : []);

    return steps.length >= minSteps && steps.every((step) => String(step || '').trim().length > 0);
}

function validateRecipeForRequestedMode(recipe, requestedMode) {
    if (!recipe || typeof recipe !== 'object') {
        return false;
    }

    const normalizedMode = normalizeRequestedRecipeMode(requestedMode);
    const minSteps = normalizedMode === 'chef' ? 3 : 2;

    return recipeHasQuantifiedIngredients(recipe)
        && recipeHasPrepTime(recipe)
        && recipeHasStepByStepProcedure(recipe, minSteps);
}

async function generateRecipesWithAI(payload) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY');
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

    const rankedTemplates = rankRecipeTemplates(payload, 6);
    const selectedTemplates = summarizeTemplateSlotsForPrompt(payload);
    const relevantKnowledge = selectRelevantKnowledge(payload, rankedTemplates);
    const clinicalContext = getClinicalNutritionContext(payload.profile);
    const recipeReferenceExamples = getRecipeReferenceExamples();
    const mealTypeReferenceExamples = getMealTypeReferenceExamples(payload.mealType);
    const antiAgeGuidance = shouldApplyAntiAgeGuidance(payload.profile, buildTextSignals(payload)) ? collectPromptLines(nutritionCounselingAntiAgePatterns).slice(0, 8) : [];
    const veganGuidance = shouldApplyVeganGuidance(payload.profile, buildTextSignals(payload)) ? collectPromptLines(nutritionCounselingVeganMenuPatterns).slice(0, 8) : [];
    const requestedSlot = getRequestedRecipeSlotConfig(payload.requestedMode);
    const requestedMealType = getRecipeMealTypeLabel(payload.mealType);
    const mealTypePromptBlock = getRecipeMealTypePromptBlock(payload.mealType);

    const systemPrompt = [
        'Sei NUTRI-ME Chef-Nutrizionista: un modello che unisce logica da chef, nutrizione clinica, crononutrizione e cucina anti-spreco.',
        'Devi ragionare in privato e non mostrare mai il chain of thought. Prima di generare il JSON devi seguire questo Protocollo obbligatorio.',
        'Protocollo obbligatorio.',
        'Fase 1, Analisi metabolica e vincoli: leggi targetCalories, proteinTargetGrams o proteinGrams, proteinTargetPerKg, allergies, intolerances, otherPathologies, diet, obiettivo, contesto corporeo e persone. Elimina subito ingredienti incompatibili con allergie, intolleranze, patologie, dieta o vincoli clinici.',
        'Fase 2, Crononutrizione: adatta struttura, densita energetica, tecniche e digeribilita al mealType. Colazione piu proteica e leggibile, pranzo centrale e saziante, cena piu digeribile e ordinata, spuntino breve e porzionabile.',
        'Fase 3, Strategia da chef e nutrizionista: scegli la tecnica di cottura in base all obiettivo metabolico, alla digeribilita, alla texture e alla praticita reale. Usa conoscenza tecnica concreta, non formule vaghe.',
        'Fase 4, Bioavailability thinking: valuta se una combinazione puo migliorare assorbimento di ferro, calcio, vitamine liposolubili o tollerabilita digestiva e sintetizzala in modo breve e scientifico.',
        'Fase 5, Output: restituisci una sola ricetta coerente con il profilo e con la modalita richiesta, senza mostrare le fasi di ragionamento.',
        'Quando il profilo include dati nutrizionali personalizzati, comportati come una nutrizionista: distingui sempre fabbisogno e piano calorico e usa la quota proteica come guida del piatto, non come slogan.',
        'Se la dieta e vegana o 100% vegetale, escludi completamente ingredienti di origine animale e privilegia basi mediterranee vegetali complete, sazianti e realistiche.',
        'Il tipo di pasto richiesto e un vincolo sostanziale: colazione, pranzo, cena e spuntino hanno struttura, densita energetica, tono e ingredienti plausibili diversi.',
        'Se il profilo esprime una preferenza proteica serale, trattala come priorita morbida: deve orientare la scelta della fonte proteica quando coerente con ingredienti e profilo, senza diventare un obbligo meccanico.',
        'Se il profilo indica un pranzo abituale da giorno lavorativo, nel whyItFits fai emergere praticita, digeribilita, organizzazione e sostenibilita nella routine. Se indica un giorno libero, fai emergere una struttura piu distesa, piacevole e curata, ma sempre coerente con il piano calorico.',
        'Applica la stessa distinzione anche al summary: nel giorno lavorativo usa un tono piu pratico, agile e organizzabile; nel giorno libero usa un tono piu disteso, piacevole e curato.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, privilegia ricette scientificamente sobrie: verdure presenti, cotture semplici, olio EVO a crudo quando sensato, porzioni leggibili, niente fritture o intingoli come asse centrale della proposta.',
        'Usa la knowledge base interna come contesto tecnico e culturale: non trattarla come una lista di obblighi da applicare sempre, ma come sapere professionale da richiamare solo quando pertinente alla ricetta.',
        'Vincoli davvero obbligatori:',
        '1. Se ci sono allergie, intolleranze, incompatibilita con otherPathologies o limiti di dieta, escludi tassativamente quegli ingredienti e proponi sostituti compatibili se servono.',
        '2. Genera esattamente 1 ricetta, non una lista di modalita alternative.',
        '3. Genera solo la ricetta coerente con la modalita richiesta dall utente.',
        '4. Se la modalita richiesta e Salvafrigo, dai priorita assoluta agli ingredienti disponibili e all utilita anti-spreco.',
        '5. Tutte le ricette, in qualunque modalita, devono riportare ogni ingrediente realmente usato in ingredienti_tabella con qty numerica espressa in grammi.',
        '6. Non usare q.b., quanto basta, cucchiai, tazze, pezzi, fette, unita vaghe o ingredienti senza peso: converti sempre tutto in grammi.',
        '7. Tutte le ricette devono compilare tempo_prep_min con il tempo totale realistico di preparazione e cottura espresso in minuti.',
        '8. Tutte le ricette devono compilare procedimento come sequenza passo per passo concreta, ordinata ed eseguibile.',
        '9. Se la modalita richiesta e Chef, includi anche un tocco gourmet reale e una nota concreta di impiattamento o finitura.',
        '10. In Chef mode il procedimento deve avere almeno 3 step e l ultimo step deve chiudere con finitura, impiattamento o servizio.',
        '11. Includi una tabella nutrizionale leggibile per ingredienti principali e totale piatto.',
        '12. Le quantita in ingredienti_tabella e i totali nutrizionali devono essere proporzionati esattamente al Numero Persone richiesto.',
        '13. Il campo tecnica_cottura deve spiegare la scelta tecnica reale, non una formula vaga.',
        '14. Il campo chef_note deve spiegare in una frase la tecnica scelta collegandola a obiettivo, digeribilita o appetibilita.',
        '15. Il campo bioavailability_tip deve spiegare in una frase un abbinamento o una scelta utile per assorbimento, tollerabilita o utilizzo dei nutrienti.',
        '16. Nel campo whyItFits spiega in modo breve ma concreto come la ricetta si inserisce nel metodo nutrizionale del profilo: IMC contestualizzato, differenza tra fabbisogno e piano, e quota proteica quando utile.',
        '17. Restituisci solo JSON valido nello schema richiesto.',
        '18. Evita ricette generiche o intercambiabili: se gli ingredienti permettono un piatto specifico, proponilo.',
        '19. La ricetta deve mostrare almeno una decisione tecnica concreta derivata dagli ingredienti, dal profilo o dalla knowledge base selezionata.',
        '20. Restituisci ESCLUSIVAMENTE JSON valido con questo shape: {"recipes":[{"id":"R001","mode_key":"base|media|chef|salvafrigo","mode_label":"Cucina base|Cucina media|Chef mode|Salvafrigo","nome_ricetta":"Nome del piatto","difficolta":"Semplice|Media|Chef|Salvafrigo","tempo_prep_min":20,"allergeni_esclusi":["Lattosio","Glutine"],"tecnica_cottura":"Descrizione della tecnica principale","chef_note":"Nota tecnica da chef nutrizionista","bioavailability_tip":"Nota scientifica su assorbimento o tollerabilita","anti_spreco":"Come usare gli scarti","ingredienti_tabella":[{"n":"Ingrediente 1","qty":100,"k":150,"p":10,"c":20,"g":3}],"totale_piatto":{"k":450,"p":30,"c":60,"g":10},"procedimento":["Step 1","Step 2"],"summary":"","whyItFits":"","substitutions":[""]}]}',
    ].join(' ');

    const userPrompt = [
        `Ingredienti disponibili: ${payload.ingredients.join(', ') || 'nessuno specificato'}`,
        `Numero Persone: ${payload.people}`,
        `Allergie/Intolleranze: ${payload.profile.allergies || 'nessuna'} | ${payload.profile.intolerances || 'nessuna'}`,
        `Patologie o incompatibilita cliniche: ${payload.profile.otherPathologies || 'nessuna'}`,
        `Obiettivo: ${payload.profile.goal || 'mantenere'}`,
        `Regime alimentare: ${payload.profile.diet || 'non specificato'}`,
        `Stile di vita: ${payload.profile.jobType || 'non specificato'}`,
        `Allenamenti settimanali: ${payload.profile.workoutsPerWeek || 0}`,
        `Metodo nutrizionale personalizzato: ${buildNutritionMethodSummary(payload.profile)}`,
        `Dati corporei: sesso ${payload.profile.sex || 'non specificato'} | eta ${payload.profile.age || 0} | peso ${payload.profile.weight || 0} kg | altezza ${payload.profile.height || 0} cm`,
        `IMC e contesto: ${payload.profile.imc || 0} | fascia ${payload.profile.imcCategory || 'non specificata'}`,
        `Fabbisogno calorico giornaliero: ${payload.profile.maintenanceCalories || 0}`,
        `Calorie target: ${payload.profile.targetCalories || 0}`,
        `Delta calorico del piano: ${payload.profile.goalCalorieDelta || 0}`,
        `Apporto proteico target: ${payload.profile.proteinTargetPerKg || 0} g/kg | ${payload.profile.proteinTargetGrams || 0} g/die`,
        `Target carboidrati: ${payload.profile.carbsTargetGrams || 0} g/die`,
        `Target grassi: ${payload.profile.fatTargetGrams || 0} g/die`,
        `Target fibra: ${payload.profile.fiberTargetGrams || 0} g/die`,
        `Tipo di pasto richiesto: ${requestedMealType}`,
        `Contesto pranzo abituale del profilo: ${getLunchContextLabel(payload.profile.lunchContextPreference)}`,
        `Preferenza proteica serale del profilo: ${getDinnerProteinPreferenceLabel(payload.profile.dinnerProteinPreference)}`,
        `Modalita richiesta: ${requestedSlot.label} (${requestedSlot.difficulty})`,
        `Ingredienti esclusi a monte: ${payload.excludedIngredients.join(', ') || 'nessuno'}`,
        `Archetipi di piatto piu promettenti per questa richiesta: ${JSON.stringify(relevantKnowledge.dishArchetypes)}`,
        `Slot obbligatori e template interni da usare come ispirazione strutturale, non da copiare parola per parola: ${JSON.stringify(selectedTemplates)}`,
        `Moduli di knowledge base realmente rilevanti per questa richiesta: ${JSON.stringify(relevantKnowledge.modules)}`,
        `Riferimenti CREA su ingredienti e valori nutrizionali compatibili con questa richiesta: ${JSON.stringify(relevantKnowledge.foodCompositionRefs)}`,
        `Riferimenti CREA Tabella C su resa e variazione peso in cottura: ${JSON.stringify(relevantKnowledge.yieldFactorRefs)}`,
        `Segnali nutrizionali CREA utili per orientare le scelte: ${JSON.stringify(relevantKnowledge.nutritionSignals)}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.recipePromptLines)}`,
        antiAgeGuidance.length > 0 ? `Metodo anti-age: ${JSON.stringify(antiAgeGuidance)}` : '',
        veganGuidance.length > 0 ? `Metodo menu vegetale 100% plant-based: ${JSON.stringify(veganGuidance)}` : '',
        `Esempi interni di riferimento da usare solo come metodo invisibile: ${JSON.stringify(recipeReferenceExamples)}`,
        `Esempi interni specifici per il tipo di pasto richiesto: ${JSON.stringify(mealTypeReferenceExamples)}`,
        `Vincoli specifici del tipo di pasto: ${JSON.stringify(mealTypePromptBlock)}`,
        'Genera una sola ricetta realistica e coerente con la modalita richiesta, senza proporre le altre modalita.',
        'Applica il Protocollo in silenzio: analisi metabolica e vincoli, crononutrizione, scelta tecnica da chef, rifinitura nutrizionale, poi output JSON.',
        'Fai in modo che la ricetta possa inserirsi bene in un menu settimanale reale: deve essere organizzabile, abbastanza varia, sensata rispetto alla stagionalita e utile anche per ridurre sprechi o semplificare la spesa quando possibile.',
        'Se il tipo di pasto lo consente, rendi leggibile la struttura del piatto con base amidacea o cereale, fonte proteica, verdure e grassi buoni, senza trasformare questa logica in una formula meccanica.',
        'In qualsiasi modalita: indica il peso in grammi di ogni ingrediente realmente usato dentro ingredienti_tabella, senza q.b. o misure vaghe.',
        'In qualsiasi modalita: compila tempo_prep_min con il tempo totale realistico in minuti.',
        'In qualsiasi modalita: scrivi il procedimento come sequenza passo per passo concreta, non come descrizione generica o riassunto.',
        'In qualsiasi modalita: compila chef_note con una breve nota tecnica da chef-nutrizionista e bioavailability_tip con una breve nota scientifica sugli abbinamenti o sulla tollerabilita.',
        'Se la modalita e Cucina base: resta su ricette fondamentali e leggibili, con pochi passaggi e una sola tecnica dominante.',
        'Se la modalita e Cucina media: costruisci un piatto domestico con almeno due elementi coerenti tra loro, per esempio proteina o polpetta piu crema, salsa o verdura.',
        'Se la modalita e Chef mode: scegli la ricetta piu sfidante che gli ingredienti consentono davvero, sfruttando i seed caricati e la knowledge base tecnica; aggiungi un tocco gourmet reale e una chiusura di impiattamento.',
        'Se la modalita e Chef mode: scrivi il procedimento con almeno 3 passaggi concreti e un ultimo passaggio dedicato a finitura o impiattamento.',
        'Se la modalita e Salvafrigo: usa come priorita assoluta gli ingredienti disponibili e la riduzione dello spreco, anche a costo di rinunciare a complessita estetica.',
        'La ricetta deve sembrare davvero appartenere al tipo di pasto richiesto: non produrre una cena che sembra uno snack, una colazione che sembra un pranzo, o uno spuntino che sembra un piatto completo.',
        'Se sono presenti IMC, fabbisogno, piano calorico e proteine g/kg, usali come struttura del ragionamento: non limitarti a citare i numeri, fai in modo che influenzino porzioni, densita energetica, scelta della proteina e composizione del piatto.',
        'Distingui chiaramente il fabbisogno di mantenimento dall apporto del piano: una ricetta non deve per forza coprire tutto il fabbisogno, ma deve essere coerente con il piano giornaliero e con la quota proteica del profilo.',
        'Se la richiesta o gli ingredienti fanno pensare a una colazione o a un pasto rapido, puoi usare la logica professionale delle alternative equivalenti: una base proteica, una quota carboidrati selezionata, eventuale frutta o grassi buoni, e almeno 2-3 varianti coerenti nello stesso ragionamento.',
        'Gli esempi interni settimanali non devono comparire nella risposta finale: servono solo per orientare struttura, ingredienti, combinazioni e buon senso nutrizionale.',
        'Gli esempi interni specifici del tipo di pasto servono a evitare errori di formato: per esempio colazioni che sembrano pranzi o spuntini che sembrano cene.',
        'Non trattare supplementi, attesa della fame o equivalenze di frutta come obblighi: usali solo come spunti contestualizzati, prudenti e coerenti con il profilo.',
        'Se il contesto suggerisce un pranzo o piatto unico, puoi usare la logica professionale del pranzo: ordine del pasto, cereali o pasta o equivalenti, legumi o edamame o altra quota compatibile, verdure e olio EVO dichiarato. L eventuale nota dolce finale non e mai automatica.',
        'Se il contesto suggerisce una cena o un secondo piatto, puoi usare la logica professionale della cena: apertura con verdure crude, nucleo proteico scelto in una famiglia ruotabile tra uova, tofu, tempeh, latticini light o burger vegetali proteici, quota glucidica semplice e olio EVO dichiarato.',
        'Se la preferenza serale privilegia tofu o tempeh, puoi richiamare mini-template tecnici come tofu limone e pepe rosa, tempeh tahina e limone o polpette di tofu e spinaci, adattandoli agli ingredienti reali senza copiarli in modo rigido.',
        'Nel campo whyItFits non fermarti al riepilogo nutrizionale: collega anche la ricetta al contesto pranzo abituale del profilo, distinguendo in modo naturale tra giorno lavorativo e giorno libero quando questo rende la proposta piu coerente.',
        'Anche il campo summary deve riflettere quel contesto: non deve essere un riassunto neutro o intercambiabile se il profilo suggerisce un tono piu pratico oppure piu disteso.',
        'Usa archetipi e moduli rilevanti qui sopra e trasformali in decisioni concrete: taglio, tecnica, sostituzione, gestione dell umidita, sicurezza, equilibrio nutrizionale, anti-spreco.',
        'Se i riferimenti CREA contengono ingredienti pertinenti, usali come ancore nutrizionali e di identita dell ingrediente senza copiare dati irrilevanti o incompatibili.',
        'Se i riferimenti di resa indicano una variazione peso per bollitura, padella, forno, griglia o microonde, usali per non confondere crudo e cotto nella stima dei nutrienti.',
        'Tratta i valori CREA come medie di riferimento indicative: stagione, acqua, crescita, lavorazione e cottura possono spostare i numeri reali.',
        'Completa le tabelle nutrizionali quando mancano dati, ma non correggere o sovrascrivere valori gia plausibili presenti nella ricetta.',
        'Ogni ricetta deve essere dimensionata per il Numero Persone indicato sopra: non dare porzioni standard da 1 se l utente ha chiesto 2, 3 o 4 persone.',
        'Se il profilo non richiede approcci specialistici, non forzare riferimenti a low FODMAP, fermentazioni, amatriciana o altri temi non pertinenti.',
        'Evita nomi vaghi come bowl creativa, teglia furba o padellata smart se puoi proporre un piatto piu riconoscibile e utile.',
        'Restituisci solo il JSON finale, senza introduzioni, commenti o testo extra.'
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
            temperature: 0.55,
            max_tokens: 1800,
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
        const errorText = await completion.text();
        console.error('AI request failed', completion.status, errorText.slice(0, 500));
        throw new Error('AI service temporarily unavailable');
    }

    const data = await completion.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = extractJson(content);
    const normalizedRecipes = Array.isArray(parsed?.recipes)
        ? parsed.recipes.map((recipe, index) => normalizeRecipe(recipe, index, relevantKnowledge.foodCompositionRefs)).filter(Boolean)
        : [];

    const assignedRecipe = assignRecipeToRequestedSlot(normalizedRecipes[0], payload.requestedMode);
    if (!validateRecipeForRequestedMode(assignedRecipe, payload.requestedMode)) {
        throw new Error('AI returned recipe without required grams, prep time, or step-by-step procedure');
    }

    const recipes = assignedRecipe
        ? [applyLunchContextToneToRecipe(assignedRecipe, payload.profile.lunchContextPreference)]
        : [];

    if (recipes.length !== 1) {
        throw new Error('AI returned an invalid recipes payload');
    }

    return {
        recipes,
        meta: {
            source: 'ai',
            model,
            requestedMode: payload.requestedMode,
            lunchContext: payload.profile.lunchContextPreference
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

    if (payload.ingredients.length === 0 && payload.excludedIngredients.length === 0) {
        return response(400, { error: 'At least one ingredient is required' });
    }

    try {
        const aiResult = await generateRecipesWithAI(payload);
        return response(200, {
            ...aiResult,
            meta: {
                ...aiResult.meta,
                excludedIngredients: payload.excludedIngredients
            }
        });
    } catch (error) {
        console.error('AI mode fallback activated:', error && error.message ? error.message : error);
        return response(200, {
            recipes: buildFallbackRecipes(payload),
            meta: {
                source: 'fallback',
                reason: 'AI live temporaneamente non disponibile',
                requestedMode: payload.requestedMode,
                excludedIngredients: payload.excludedIngredients,
                lunchContext: payload.profile.lunchContextPreference
            }
        });
    }
};