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
        difficulty: 'Semplice',
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

    const goalBonus = goal.includes('massa')
        ? (totalProtein >= 25 ? 3 : 0)
        : (goal.includes('dimagr')
            ? ((totalCalories > 0 && totalCalories <= 650) ? 3 : 0)
            : ((totalCalories >= 350 && totalCalories <= 750) ? 1 : 0));

    const dietPenalty = templateConflictsWithDiet(template, diet) ? -25 : 0;

    return overlapScore + exclusionScore + difficultyBonus + archetypeBonus + restrictionCompatibilityBonus + dietBonus + premiumBonus + goalBonus + dietPenalty;
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
    const clinicalContext = getClinicalNutritionContext(payload.profile);
    const clinicalTail = clinicalContext.applicable
        ? ` ${clinicalContext.recipeTail || 'Per un profilo adulto 50+ in sovrappeso con deficit moderato, il piatto privilegia verdure, condimenti misurati, olio EVO preferibilmente a crudo e una struttura anti-fame ma non pesante.'}`
        : '';

    return [
        withRecipeSlot({
            id: 'R001',
            nome_ricetta: `Pasta o padellata base con ${lead[0] || 'stagione'} e ${lead[1] || 'dispensa'}`,
            difficolta: 'Semplice',
            tempo_prep_min: 20,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Tecnica base riconoscibile: soffritto leggero o cottura diretta in padella con un solo passaggio principale.',
            anti_spreco: 'Le parti meno belle possono diventare un soffritto o una base per una crema il giorno dopo.',
            ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'aglio o cipolla', 'erbe aromatiche'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Taglia gli ingredienti in pezzi simili e tieni da parte eventuali gambi o foglie tenere.',
                'Rosola in padella con poco olio partendo dagli ingredienti piu duri e aggiungendo dopo quelli piu delicati.',
                'Completa con spezie, erbe e una base a scelta come pane, cereali o legumi gia pronti.'
            ],
            title: `Pasta o padellata base con ${lead[0] || 'stagione'} e ${lead[1] || 'dispensa'}`,
            style: 'Cucina base',
            summary: `Ricetta fondamentale e molto semplice per ${payload.people} ${peopleLabel}, pensata per usare subito ${lead.slice(0, 3).join(', ')} con una tecnica sola.`,
            whyItFits: `Questa proposta ${goalHint(goal)} e ${dietHint(diet)}. Si abbina bene a uno stile di vita ${activity}.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'olio EVO', 'aglio o cipolla', 'erbe aromatiche'],
            steps: [
                'Prepara un fondo semplice oppure una cottura diretta senza costruire piu componenti.',
                'Cuoci l ingrediente principale con un solo passaggio chiaro e leggibile.',
                'Chiudi il piatto in modo essenziale, senza salse complesse o impiattamenti tecnici.'
            ],
            wasteTip: 'Le parti meno belle possono diventare un soffritto o una base per una crema il giorno dopo.',
            goalTag: goal
        }, 'base', 0),
        withRecipeSlot({
            id: 'R002',
            nome_ricetta: `Versione media con ${lead[0] || 'ingrediente principale'} e accompagnamento`,
            difficolta: 'Media',
            tempo_prep_min: 30,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Piatto composto ma domestico: una preparazione principale con salsa, crema o contorno di supporto.',
            anti_spreco: 'Le porzioni avanzate si conservano bene e si trasformano facilmente in pranzo da portare.',
            ingredienti_tabella: [...lead.slice(0, 4), 'olio EVO', 'spezie', 'pangrattato o semi'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Disponi tutto in teglia, condisci bene e crea una superficie croccante con semi o pangrattato.',
                'Cuoci fino a doratura, mescolando a meta cottura se serve.',
                'Servi in piatto unico o come ripieno per piadine, panini o bowl del giorno dopo.'
            ],
            title: `Versione media con ${lead[0] || 'ingrediente principale'} e accompagnamento`,
            style: 'Cucina media',
            summary: 'Una proposta intermedia, con piatto principale piu accompagnamento o crema, ma ancora pienamente da cucina di casa.',
            whyItFits: `Aiuta a cucinare una volta sola per ${payload.people} ${peopleLabel} con un minimo di tecnica in piu e senza sprechi.${clinicalTail}`,
            ingredients: [...lead.slice(0, 4), 'olio EVO', 'spezie', 'pangrattato o semi'],
            steps: [
                'Prepara un elemento principale con una lavorazione in piu rispetto alla base.',
                'Abbinalo a una crema, salsa o verdura di accompagnamento ben distinta.',
                'Servi le due componenti in modo ordinato ma ancora semplice e domestico.'
            ],
            wasteTip: 'Le porzioni avanzate si conservano bene e si trasformano facilmente in pranzo da portare.',
            goalTag: goal
        }, 'media', 1),
        withRecipeSlot({
            id: 'R003',
            nome_ricetta: `Chef mode con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'contrasti'}`,
            difficolta: 'Chef',
            tempo_prep_min: 35,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Costruzione tecnica in piu componenti con almeno due decisioni critiche: tempi, texture, finitura o salsa.',
            anti_spreco: 'Anche in una proposta piu curata, rifilature e fondi possono diventare salse, garnish o basi aromatiche.',
            ingredienti_tabella: [...lead.slice(0, 3), 'elemento croccante', 'finitura aromatica'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Cuoci separatamente l elemento principale, gestendo bene colore e succosita.',
                'Prepara una seconda componente di contrasto, croccante o cremosa a seconda degli ingredienti disponibili.',
                'Chiudi il piatto con una finitura aromatica e una presentazione piu pulita e precisa.'
            ],
            title: `Chef mode con ${lead[0] || 'ingrediente guida'} e ${lead[1] || 'contrasti'}`,
            style: 'Chef mode',
            summary: 'Una proposta che mette davvero alla prova: piu tecnica, piu precisa e meno perdonante della modalita media.',
            whyItFits: `Alza davvero il livello della richiesta e usa gli ingredienti per una ricetta che richiede attenzione, controllo e mano.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'elemento croccante', 'finitura aromatica'],
            steps: [
                'Cuoci separatamente l elemento principale con un controllo preciso di tempo e temperatura.',
                'Aggiungi almeno una seconda componente tecnica, come crema, salsa, crosta o guarnizione strutturale.',
                'Chiudi con una finitura coerente e un impiattamento piu rigoroso del solito.'
            ],
            wasteTip: 'Anche in una proposta piu curata, rifilature e fondi possono diventare salse, garnish o basi aromatiche.',
            goalTag: goal
        }, 'chef', 2),
        withRecipeSlot({
            id: 'R004',
            nome_ricetta: `Salvafrigo di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
            difficolta: 'Semplice',
            tempo_prep_min: 12,
            allergeni_esclusi: [...toList(payload.profile.allergies), ...toList(payload.profile.intolerances)],
            tecnica_cottura: 'Assemblaggio o cottura minima con la soluzione piu facile e immediata.',
            anti_spreco: 'Questa modalita nasce per finire ingredienti aperti e parti meno nobili ma ancora buone.',
            ingredienti_tabella: [...lead.slice(0, 3), 'olio EVO', 'sale', 'erbe o spezie'].map((item) => ({ n: item, qty: 100, k: 0, p: 0, c: 0, g: 0 })),
            totale_piatto: { k: 0, p: 0, c: 0, g: 0 },
            procedimento: [
                'Riunisci gli ingredienti gia pronti o piu facili da trattare senza costruire troppi passaggi.',
                'Usa una sola padella oppure assembla tutto a freddo se gli ingredienti lo permettono.',
                'Condisci in modo essenziale e servi subito come soluzione rapida anti-spreco.'
            ],
            title: `Salvafrigo di ${lead[0] || 'frigo'} e ${lead[1] || 'dispensa'}`,
            style: 'Salvafrigo',
            summary: 'La versione piu semplice e diretta: poca tecnica, pochi passaggi, massima utilita per usare quello che hai.',
            whyItFits: `E la modalita piu banale in senso utile: entra in cucina, usa quello che c e e non spreca tempo ne ingredienti.${clinicalTail}`,
            ingredients: [...lead.slice(0, 3), 'olio EVO', 'sale', 'erbe o spezie'],
            steps: [
                'Riunisci gli ingredienti gia pronti o piu facili da trattare senza costruire troppi passaggi.',
                'Usa una sola padella oppure assembla tutto a freddo se gli ingredienti lo permettono.',
                'Condisci in modo essenziale e servi subito come soluzione rapida anti-spreco.'
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

    return RECIPE_SLOT_CONFIG
        .map((slot) => selectedBySlot.get(slot.key) || genericBySlot.get(slot.key))
        .filter(Boolean);
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
        payload.profile.jobType,
        payload.profile.username
    ].join(' | '));
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
    return selectRecipeTemplatesBySlot(payload).map((entry) => ({
        slot_key: entry.slot.key,
        slot_label: entry.slot.label,
        target_difficulty: entry.slot.difficulty,
        slot_brief: entry.slot.brief,
        slot_examples: entry.slot.examples,
        template: summarizeTemplateForPrompt(entry.template)
    }));
}

function assignRecipeSlots(recipes) {
    return RECIPE_SLOT_CONFIG.map((slot, index) => {
        const recipe = recipes[index];
        if (!recipe) return null;
        return withRecipeSlot({
            ...recipe,
            mode_key: recipe.mode_key || recipe.modeKey || slot.key,
            mode_label: recipe.mode_label || recipe.modeLabel || slot.label,
            difficolta: recipe.difficolta || slot.difficulty
        }, slot.key, index);
    }).filter(Boolean);
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
            .slice(0, 8)
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
            qty: Number(row.qty || 0),
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

    const systemPrompt = [
        'Sei uno Chef stellato esperto in nutrizione clinica e cucina anti-spreco.',
        'L utente ti fornira Ingredienti disponibili, Numero Persone, Allergie/Intolleranze, Obiettivo e dati di profilo utili.',
        'Devi comportarti come uno chef reale che possiede una base di conoscenza culinaria ampia, concreta e anti-spreco.',
        'Quando il profilo include dati nutrizionali personalizzati, devi ragionare come una nutrizionista: interpreta prima IMC e contesto corporeo, distingui fabbisogno calorico e piano calorico, poi usa il target proteico in g/kg per orientare la struttura del piatto.',
        'IMC, fabbisogno, piano calorico e proteine in g/kg non sono regole fisse universali: sono parametri del singolo utente e vanno letti come guida personalizzata e variabile.',
        'Quando ricevi esempi di piano nutrizionale professionale, devi assorbirne il metodo di ragionamento e non copiarne il testo o trasformarlo in schema universale.',
        'Se l esempio riguarda colazioni o alternative di pasto, eredita soprattutto questi principi: personalizzazione, opzioni equivalenti, quota proteica ragionata, praticita reale, sazieta e aderenza nel tempo.',
        'Se l esempio riguarda il pranzo, puoi ereditare questi principi: possibile apertura con verdure crude, piatto principale leggibile con base amidacea modulabile, quota proteico-fibrosa da legumi o alternative compatibili, verdure sempre presenti e condimento esplicitato.',
        'Se l esempio riguarda la cena, puoi ereditare questi principi: apertura con verdure crude, fonte proteica ruotabile e leggibile, quota glucidica semplice e modulata, verdure sempre presenti, olio EVO dichiarato e frutta finale solo se contestualmente sensata.',
        'Se il profilo esprime una preferenza proteica serale, trattala come priorita morbida: deve orientare la scelta della fonte proteica quando coerente con ingredienti e profilo, senza diventare un obbligo meccanico.',
        'Se il profilo indica un pranzo abituale da giorno lavorativo, nel whyItFits fai emergere praticita, digeribilita, organizzazione e sostenibilita nella routine. Se indica un giorno libero, fai emergere una struttura piu distesa, piacevole e curata, ma sempre coerente con il piano calorico.',
        'Applica la stessa distinzione anche al summary: nel giorno lavorativo usa un tono piu pratico, agile e organizzabile; nel giorno libero usa un tono piu disteso, piacevole e curato.',
        'Se il profilo somiglia a un adulto 50+ in sovrappeso con deficit moderato, privilegia ricette scientificamente sobrie: verdure presenti, cotture semplici, olio EVO a crudo quando sensato, porzioni leggibili, niente fritture o intingoli come asse centrale della proposta.',
        'Usa la knowledge base interna come contesto tecnico e culturale: non trattarla come una lista di obblighi da applicare sempre, ma come sapere professionale da richiamare solo quando pertinente alla ricetta.',
        'Vincoli davvero obbligatori:',
        '1. Se ci sono allergie o intolleranze, escludi tassativamente quegli ingredienti e proponi sostituti compatibili se servono.',
        '2. Genera esattamente 4 ricette diverse fra loro per livello e struttura.',
        '3. L ordine e obbligatorio: prima Cucina base, seconda Cucina media, terza Chef mode, quarta Salvafrigo.',
        '4. La prima deve essere cucina fondamentale e riconoscibile, come una pasta ben costruita ma semplice, un sugo leggibile, una padellata o un piatto base con una sola tecnica principale.',
        '5. La seconda deve essere una vera cucina media: piatto principale piu accompagnamento, oppure polpette o proteina con crema, salsa o verdura di supporto.',
        '6. La terza deve essere davvero Chef mode: deve mettere alla prova l utente con piu decisioni tecniche, tempi da controllare, texture da gestire e un risultato meno banale della media.',
        '7. La quarta deve essere la piu facile e anti-spreco.',
        '8. Includi una tabella nutrizionale leggibile per ingredienti principali e totale piatto.',
        '9. Le quantita in ingredienti_tabella e i totali nutrizionali devono essere proporzionati esattamente al Numero Persone richiesto.',
        '10. Restituisci solo JSON valido nello schema richiesto.',
        '11. Evita ricette generiche o intercambiabili: se gli ingredienti permettono un piatto specifico, proponilo.',
        '12. Ogni ricetta deve mostrare almeno una decisione tecnica concreta derivata dagli ingredienti, dal profilo o dalla knowledge base selezionata.',
        '13. Il campo tecnica_cottura deve spiegare la scelta tecnica reale, non una formula vaga.',
        '14. Nel campo whyItFits spiega in modo breve ma concreto come la ricetta si inserisce nel metodo nutrizionale del profilo: IMC contestualizzato, differenza tra fabbisogno e piano, e quota proteica quando utile.',
        'Restituisci ESCLUSIVAMENTE JSON valido con questo shape: {"recipes":[{"id":"R001","mode_key":"base|media|chef|salvafrigo","mode_label":"Cucina base|Cucina media|Chef mode|Salvafrigo","nome_ricetta":"Nome del piatto","difficolta":"Semplice|Media|Chef","tempo_prep_min":20,"allergeni_esclusi":["Lattosio","Glutine"],"tecnica_cottura":"Descrizione della tecnica principale","anti_spreco":"Come usare gli scarti","ingredienti_tabella":[{"n":"Ingrediente 1","qty":100,"k":150,"p":10,"c":20,"g":3}],"totale_piatto":{"k":450,"p":30,"c":60,"g":10},"procedimento":["Step 1","Step 2"],"summary":"","whyItFits":"","substitutions":[""]}]}'
    ].join(' ');

    const userPrompt = [
        `Ingredienti disponibili: ${payload.ingredients.join(', ') || 'nessuno specificato'}`,
        `Numero Persone: ${payload.people}`,
        `Allergie/Intolleranze: ${payload.profile.allergies || 'nessuna'} | ${payload.profile.intolerances || 'nessuna'}`,
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
        `Contesto pranzo abituale del profilo: ${getLunchContextLabel(payload.profile.lunchContextPreference)}`,
        `Preferenza proteica serale del profilo: ${getDinnerProteinPreferenceLabel(payload.profile.dinnerProteinPreference)}`,
        `Ingredienti esclusi a monte: ${payload.excludedIngredients.join(', ') || 'nessuno'}`,
        `Archetipi di piatto piu promettenti per questa richiesta: ${JSON.stringify(relevantKnowledge.dishArchetypes)}`,
        `Slot obbligatori e template interni da usare come ispirazione strutturale, non da copiare parola per parola: ${JSON.stringify(selectedTemplates)}`,
        `Moduli di knowledge base realmente rilevanti per questa richiesta: ${JSON.stringify(relevantKnowledge.modules)}`,
        `Riferimenti CREA su ingredienti e valori nutrizionali compatibili con questa richiesta: ${JSON.stringify(relevantKnowledge.foodCompositionRefs)}`,
        `Riferimenti CREA Tabella C su resa e variazione peso in cottura: ${JSON.stringify(relevantKnowledge.yieldFactorRefs)}`,
        `Segnali nutrizionali CREA utili per orientare le scelte: ${JSON.stringify(relevantKnowledge.nutritionSignals)}`,
        `Schema clinico-pratico aggiuntivo: ${JSON.stringify(clinicalContext.recipePromptLines)}`,
        'Genera 4 ricette realistiche e diverse fra loro, nell ordine obbligatorio base, media, chef, salvafrigo.',
        'Per Cucina base: resta su ricette fondamentali e leggibili, con pochi passaggi e una sola tecnica dominante.',
        'Per Cucina media: costruisci un piatto domestico con almeno due elementi coerenti tra loro, per esempio proteina o polpetta piu crema, salsa o verdura.',
        'Per Chef mode: scegli la ricetta piu sfidante che gli ingredienti consentono davvero, sfruttando i seed caricati e la knowledge base tecnica; non deve sembrare una media con nome piu elegante.',
        'Se sono presenti IMC, fabbisogno, piano calorico e proteine g/kg, usali come struttura del ragionamento: non limitarti a citare i numeri, fai in modo che influenzino porzioni, densita energetica, scelta della proteina e composizione del piatto.',
        'Distingui chiaramente il fabbisogno di mantenimento dall apporto del piano: una ricetta non deve per forza coprire tutto il fabbisogno, ma deve essere coerente con il piano giornaliero e con la quota proteica del profilo.',
        'Se la richiesta o gli ingredienti fanno pensare a una colazione o a un pasto rapido, puoi usare la logica professionale delle alternative equivalenti: una base proteica, una quota carboidrati selezionata, eventuale frutta o grassi buoni, e almeno 2-3 varianti coerenti nello stesso ragionamento.',
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
        'La quarta ricetta Salvafrigo puo essere la piu banale, ma deve essere la piu utile e chiaramente anti-spreco.'
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
    const recipes = Array.isArray(parsed?.recipes)
        ? assignRecipeSlots(parsed.recipes.map((recipe, index) => normalizeRecipe(recipe, index, relevantKnowledge.foodCompositionRefs)).filter(Boolean).slice(0, 4))
            .map((recipe) => applyLunchContextToneToRecipe(recipe, payload.profile.lunchContextPreference))
        : [];

    if (recipes.length !== 4) {
        throw new Error('AI returned an invalid recipes payload');
    }

    return {
        recipes,
        meta: {
            source: 'ai',
            model,
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
                excludedIngredients: payload.excludedIngredients,
                lunchContext: payload.profile.lunchContextPreference
            }
        });
    }
};