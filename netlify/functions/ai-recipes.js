const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

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
    const rawIngredients = Array.isArray(body.ingredients) ? body.ingredients : toList(body.ingredients);
    const people = Math.min(8, Math.max(1, parseInt(body.people, 10) || 1));
    const restrictionTokens = buildRestrictionTokens(profile);

    const ingredients = uniqueStrings(rawIngredients).filter((ingredient) => {
        const normalized = normalizeText(ingredient);
        return normalized && !restrictionTokens.some((token) => normalized.includes(token));
    });

    const excludedIngredients = uniqueStrings(rawIngredients).filter((ingredient) => !ingredients.includes(ingredient));

    return {
        ingredients,
        people,
        profile: {
            username: String(profile.username || '').trim(),
            goal: String(profile.goal || '').trim(),
            diet: String(profile.diet || '').trim(),
            allergies: String(profile.allergies || '').trim(),
            intolerances: String(profile.intolerances || '').trim(),
            jobType: String(profile.jobType || '').trim(),
            workoutsPerWeek: Number(profile.workoutsPerWeek || 0),
            targetCalories: Number(profile.targetCalories || 0)
        },
        excludedIngredients
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

function buildFallbackRecipes(payload) {
    const ingredients = payload.ingredients.length > 0 ? payload.ingredients : ['verdure miste'];
    const lead = ingredients.slice(0, 4);
    const peopleLabel = payload.people === 1 ? 'persona' : 'persone';
    const goal = payload.profile.goal || 'mantenere';
    const diet = payload.profile.diet || 'equilibrato';
    const activity = payload.profile.jobType || 'moderato';

    return [
        {
            title: `Padellata svuotafrigo di ${lead[0] || 'stagione'} e ${lead[1] || 'dispensa'}`,
            style: 'Svuotafrigo express',
            summary: `Ricetta rapida per ${payload.people} ${peopleLabel}, pensata per usare subito ${lead.slice(0, 3).join(', ')}.`,
            whyItFits: `Questa proposta ${goalHint(goal)} e ${dietHint(diet)}. Si abbina bene a uno stile di vita ${activity}.`,
            ingredients: [...lead.slice(0, 3), 'olio EVO', 'aglio o cipolla', 'erbe aromatiche'],
            steps: [
                'Taglia gli ingredienti in pezzi simili e tieni da parte eventuali gambi o foglie tenere.',
                'Rosola in padella con poco olio partendo dagli ingredienti piu duri e aggiungendo dopo quelli piu delicati.',
                'Completa con spezie, erbe e una base a scelta come pane, cereali o legumi gia pronti.'
            ],
            wasteTip: 'Le parti meno belle possono diventare un soffritto o una base per una crema il giorno dopo.',
            goalTag: goal
        },
        {
            title: `Teglia furba al forno con ${lead[0] || 'ingredienti di casa'}`,
            style: 'Forno zero stress',
            summary: `Una seconda idea piu confortevole, con poco lavoro attivo e ottima resa anche da riscaldare.`,
            whyItFits: `Aiuta a cucinare una volta sola per ${payload.people} ${peopleLabel} e a non sprecare ingredienti gia aperti.`,
            ingredients: [...lead.slice(0, 4), 'olio EVO', 'spezie', 'pangrattato o semi'],
            steps: [
                'Disponi tutto in teglia, condisci bene e crea una superficie croccante con semi o pangrattato.',
                'Cuoci fino a doratura, mescolando a meta cottura se serve.',
                'Servi in piatto unico o come ripieno per piadine, panini o bowl del giorno dopo.'
            ],
            wasteTip: 'Le porzioni avanzate si conservano bene e si trasformano facilmente in pranzo da portare.',
            goalTag: goal
        },
        {
            title: `Bowl creativa anti-spreco con ${lead[0] || 'avanzi intelligenti'}`,
            style: 'Componibile',
            summary: 'Terza proposta diversa dalle altre: piu fresca, modulabile e perfetta per unire piccoli avanzi.',
            whyItFits: `Ti lascia adattare la quota proteica o di carboidrati in base al tuo obiettivo ${goal || 'mantenere'}.`,
            ingredients: [...lead.slice(0, 3), 'base a scelta: riso, patate, pane o legumi', 'salsa leggera o crema'],
            steps: [
                'Prepara una base neutra gia presente in casa oppure usa un avanzo del giorno prima.',
                'Aggiungi gli ingredienti principali cotti o crudi in contrasto di consistenze.',
                'Chiudi con una salsa semplice e un tocco aromatico per cambiare profilo di gusto senza comprare altro.'
            ],
            wasteTip: 'La bowl e ideale per recuperare mezze porzioni: anche poco diventa utile se combinato bene.',
            goalTag: goal
        }
    ];
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

function normalizeRecipe(recipe, index) {
    if (!recipe || typeof recipe !== 'object') return null;

    const normalized = {
        title: String(recipe.title || `Ricetta ${index + 1}`).trim(),
        style: String(recipe.style || 'Idea personalizzata').trim(),
        summary: String(recipe.summary || '').trim(),
        whyItFits: String(recipe.whyItFits || recipe.why || '').trim(),
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(String).filter(Boolean) : [],
        steps: Array.isArray(recipe.steps) ? recipe.steps.map(String).filter(Boolean) : [],
        wasteTip: String(recipe.wasteTip || recipe.antiWasteTip || '').trim(),
        goalTag: String(recipe.goalTag || '').trim()
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

    const systemPrompt = [
        'Sei un assistente nutrizionale che genera ricette anti-spreco.',
        'Devi proporre esattamente 3 ricette diverse fra loro.',
        'Devi rispettare allergie, intolleranze, dieta, stile di vita e obiettivo.',
        'Devi privilegiare l uso degli ingredienti disponibili, ammettendo solo pochi extra di dispensa comuni.',
        'Rispondi solo con JSON valido con questo shape: {"recipes":[{"title":"","style":"","summary":"","whyItFits":"","ingredients":[""],"steps":[""],"wasteTip":"","goalTag":""}]}'
    ].join(' ');

    const userPrompt = {
        availableIngredients: payload.ingredients,
        people: payload.people,
        profile: payload.profile,
        excludedIngredients: payload.excludedIngredients,
        constraints: [
            'Le 3 ricette devono essere realmente diverse come tecnica o formato.',
            'Ogni ricetta deve avere 3-6 step.',
            'Ogni ricetta deve includere un tip anti-spreco.',
            'Mantieni tono pratico e ingredienti realistici per una cucina domestica italiana.'
        ]
    };

    const completion = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            temperature: 0.8,
            max_tokens: 1400,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(userPrompt) }
            ]
        })
    });

    if (!completion.ok) {
        const errorText = await completion.text();
        throw new Error(`AI request failed: ${completion.status} ${errorText}`);
    }

    const data = await completion.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = extractJson(content);
    const recipes = Array.isArray(parsed?.recipes)
        ? parsed.recipes.map(normalizeRecipe).filter(Boolean).slice(0, 3)
        : [];

    if (recipes.length !== 3) {
        throw new Error('AI returned an invalid recipes payload');
    }

    return {
        recipes,
        meta: {
            source: 'ai',
            model
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
        return response(200, {
            recipes: buildFallbackRecipes(payload),
            meta: {
                source: 'fallback',
                reason: error.message,
                excludedIngredients: payload.excludedIngredients
            }
        });
    }
};