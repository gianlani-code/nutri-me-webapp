const MAX_IMAGE_BASE64_LENGTH = 5_500_000; // ~4 MB raw
const AI_REQUEST_TIMEOUT_MS = 25_000;
const OFF_REQUEST_TIMEOUT_MS = 10_000;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function response(statusCode, body) {
    return {
        statusCode,
        headers: JSON_HEADERS,
        body: JSON.stringify(body)
    };
}

function extractJson(text) {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch {
                return null;
            }
        }
        return null;
    }
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function dedupe(values) {
    return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
}

function sanitizeNutriScore(value) {
    const raw = String(value || '').trim().toUpperCase();
    return /^[A-E]$/.test(raw) ? raw : '?';
}

function parseBarcodeDigits(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 14) {
        return '';
    }
    return digits;
}

function mapOffProductToResult(product, aiFallback) {
    const nutriments = product?.nutriments || {};

    const kcalFromKcal = toNumber(nutriments['energy-kcal_100g'] || nutriments['energy-kcal']);
    const energyKj = toNumber(nutriments.energy_100g || nutriments.energy);
    const kcalFromKj = energyKj > 0 ? energyKj / 4.184 : 0;
    const kcal = kcalFromKcal > 0 ? kcalFromKcal : kcalFromKj;

    const proteins = toNumber(nutriments.proteins_100g);
    const carbs = toNumber(nutriments.carbohydrates_100g);
    const sugars = toNumber(nutriments.sugars_100g);
    const fats = toNumber(nutriments.fat_100g);
    const saturated = toNumber(nutriments['saturated-fat_100g']);
    const fibers = toNumber(nutriments.fiber_100g);

    const sodiumDirectMg = toNumber(nutriments.sodium_100g) * 1000;
    const sodiumFromSaltMg = toNumber(nutriments.salt_100g) * 393;
    const sodiumMg = sodiumDirectMg > 0 ? sodiumDirectMg : sodiumFromSaltMg;

    const productName = String(product.product_name_it || product.product_name || aiFallback?.product_name || 'Alimento').trim();
    const brand = String(product.brands || '').trim();
    const nutriScore = sanitizeNutriScore(product.nutriscore_grade || aiFallback?.fallback_nutriscore);
    const code = String(product.code || '').trim();

    return {
        alimento: productName,
        descrizione: brand ? `Marca: ${brand}` : String(aiFallback?.category || '').trim(),
        per_100g: {
            kcal: Math.max(0, kcal),
            proteine: Math.max(0, proteins),
            carboidrati: Math.max(0, carbs),
            zuccheri: Math.max(0, sugars),
            grassi: Math.max(0, fats),
            grassi_saturi: Math.max(0, saturated),
            fibre: Math.max(0, fibers),
            sodio_mg: Math.max(0, sodiumMg)
        },
        nutriscore: nutriScore,
        note: code ? `Fonte OpenFoodFacts (barcode ${code})` : 'Fonte OpenFoodFacts',
        source: 'openfoodfacts'
    };
}

function mapAiFallbackResult(aiData) {
    const p100 = aiData?.fallback_nutrition || aiData?.per_100g || {};
    return {
        alimento: String(aiData?.product_name || aiData?.alimento || 'Alimento').slice(0, 120),
        descrizione: String(aiData?.category || aiData?.descrizione || '').slice(0, 200),
        per_100g: {
            kcal: Math.max(0, toNumber(p100.kcal)),
            proteine: Math.max(0, toNumber(p100.proteine)),
            carboidrati: Math.max(0, toNumber(p100.carboidrati)),
            zuccheri: Math.max(0, toNumber(p100.zuccheri)),
            grassi: Math.max(0, toNumber(p100.grassi)),
            grassi_saturi: Math.max(0, toNumber(p100.grassi_saturi)),
            fibre: Math.max(0, toNumber(p100.fibre)),
            sodio_mg: Math.max(0, toNumber(p100.sodio_mg))
        },
        nutriscore: sanitizeNutriScore(aiData?.fallback_nutriscore || aiData?.nutriscore),
        note: 'Stima AI: nessun match affidabile su OpenFoodFacts.',
        source: 'ai-fallback'
    };
}

async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchOffProductByCode(code) {
    const safeCode = encodeURIComponent(code);
    const urls = [
        `https://it.openfoodfacts.org/api/v0/product/${safeCode}.json`,
        `https://world.openfoodfacts.org/api/v0/product/${safeCode}.json`
    ];

    for (const url of urls) {
        try {
            const response = await fetchWithTimeout(url, OFF_REQUEST_TIMEOUT_MS);
            if (!response.ok) continue;
            const data = await response.json();
            if (data?.status === 1 && data.product) {
                return data.product;
            }
        } catch (error) {
            console.warn('OFF barcode lookup error', error && error.message ? error.message : error);
        }
    }

    return null;
}

async function searchOffProducts(query) {
    const normalizedQuery = String(query || '').trim();
    if (!normalizedQuery) return [];

    const encoded = encodeURIComponent(normalizedQuery);
    const fields = encodeURIComponent('code,product_name,product_name_it,brands,nutriscore_grade,nutriments');

    const urls = [
        `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=20&fields=${fields}`,
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=20&fields=${fields}`
    ];

    const allProducts = [];

    for (const url of urls) {
        try {
            const response = await fetchWithTimeout(url, OFF_REQUEST_TIMEOUT_MS);
            if (!response.ok) continue;
            const data = await response.json();
            if (Array.isArray(data?.products)) {
                allProducts.push(...data.products);
            }
        } catch (error) {
            console.warn('OFF text search error', error && error.message ? error.message : error);
        }
    }

    const byCode = new Map();
    allProducts.forEach((product) => {
        const code = String(product?.code || '').trim();
        const key = code || JSON.stringify([product?.product_name, product?.brands]).slice(0, 120);
        if (!byCode.has(key)) {
            byCode.set(key, product);
        }
    });

    return [...byCode.values()];
}

function scoreOffProduct(product, aiGuess) {
    const nameNorm = normalizeText(product?.product_name_it || product?.product_name);
    const brandNorm = normalizeText(product?.brands);
    const targetName = normalizeText(aiGuess?.product_name);
    const targetBrand = normalizeText(aiGuess?.brand);
    const targetCategory = normalizeText(aiGuess?.category);

    let score = 0;

    if (targetName && nameNorm.includes(targetName)) {
        score += 35;
    }

    if (targetName && targetName.includes(nameNorm) && nameNorm.length > 6) {
        score += 20;
    }

    if (targetBrand && brandNorm && brandNorm.includes(targetBrand)) {
        score += 25;
    }

    const nameTokens = targetName.split(' ').filter((t) => t.length > 2);
    nameTokens.forEach((token) => {
        if (nameNorm.includes(token)) {
            score += 6;
        }
    });

    if (targetCategory && nameNorm.includes(targetCategory)) {
        score += 8;
    }

    if (product?.nutriments) {
        score += 6;
    }

    if (product?.nutriscore_grade) {
        score += 4;
    }

    return score;
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: JSON_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return response(405, { error: 'Method not allowed' });
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return response(400, { error: 'Invalid JSON body' });
    }

    const { image, mimeType } = body;

    if (!image || typeof image !== 'string' || image.trim().length === 0) {
        return response(400, { error: 'Missing or empty image field' });
    }

    if (image.length > MAX_IMAGE_BASE64_LENGTH) {
        return response(400, { error: 'Image too large. Maximum 4 MB.' });
    }

    const safeMimeType = ALLOWED_MIME_TYPES.has(mimeType) ? mimeType : 'image/jpeg';

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return response(500, { error: 'AI service not configured' });
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const systemPrompt =
        'Analizza foto di alimenti confezionati e restituisci indizi utili per cercare su OpenFoodFacts. ' +
        'Devi rispondere SOLO con JSON valido e senza testo extra. ' +
        'Schema obbligatorio: ' +
        '{"product_name":"","brand":"","category":"","barcode":"","confidence":0.0,' +
        '"fallback_nutrition":{"kcal":0,"proteine":0,"carboidrati":0,"zuccheri":0,"grassi":0,"grassi_saturi":0,"fibre":0,"sodio_mg":0},' +
        '"fallback_nutriscore":"?"}. ' +
        'Se non sei sicuro, lascia stringhe vuote e confidence bassa (<0.5). ' +
        'Non includere testo fuori dal JSON.';

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
                temperature: 0.2,
                max_tokens: 600,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${safeMimeType};base64,${image}`,
                                    detail: 'low'
                                }
                            },
                            {
                                type: 'text',
                                text: 'Riconosci prodotto, marca, eventuale barcode visibile e categoria. Fornisci anche fallback nutrizionale per 100g.'
                            }
                        ]
                    }
                ]
            })
        });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            return response(504, { error: 'AI request timed out. Riprova.' });
        }
        return response(500, { error: 'AI service unavailable' });
    } finally {
        clearTimeout(timeout);
    }

    if (!completion.ok) {
        const errText = await completion.text().catch(() => '');
        console.error('OpenAI error', completion.status, errText.slice(0, 400));
        return response(502, { error: 'AI service error. Riprova tra qualche secondo.' });
    }

    let data;
    try {
        data = await completion.json();
    } catch {
        return response(502, { error: 'Invalid response from AI service' });
    }

    const content = data?.choices?.[0]?.message?.content;
    const parsed = extractJson(content);

    if (!parsed || typeof parsed !== 'object') {
        return response(502, { error: 'AI returned incomplete data' });
    }

    const aiGuess = {
        product_name: String(parsed.product_name || parsed.alimento || '').trim(),
        brand: String(parsed.brand || '').trim(),
        category: String(parsed.category || parsed.descrizione || '').trim(),
        barcode: parseBarcodeDigits(parsed.barcode),
        confidence: Math.max(0, Math.min(1, toNumber(parsed.confidence))),
        fallback_nutrition: parsed.fallback_nutrition || parsed.per_100g || {},
        fallback_nutriscore: sanitizeNutriScore(parsed.fallback_nutriscore || parsed.nutriscore)
    };

    if (aiGuess.barcode) {
        const productByCode = await fetchOffProductByCode(aiGuess.barcode);
        if (productByCode) {
            return response(200, { result: mapOffProductToResult(productByCode, aiGuess) });
        }
    }

    const searchQueries = dedupe([
        `${aiGuess.brand} ${aiGuess.product_name}`.trim(),
        aiGuess.product_name,
        `${aiGuess.category} ${aiGuess.product_name}`.trim(),
        aiGuess.category
    ]).filter((query) => query.length >= 3);

    const candidates = [];
    for (const query of searchQueries.slice(0, 4)) {
        const products = await searchOffProducts(query);
        candidates.push(...products);
    }

    let bestProduct = null;
    let bestScore = -1;
    candidates.forEach((product) => {
        const score = scoreOffProduct(product, aiGuess);
        if (score > bestScore) {
            bestScore = score;
            bestProduct = product;
        }
    });

    if (bestProduct && bestScore >= 16) {
        return response(200, { result: mapOffProductToResult(bestProduct, aiGuess) });
    }

    return response(200, { result: mapAiFallbackResult(aiGuess) });
};
