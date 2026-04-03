const fs = require('fs');
const path = require('path');

function readLocalEnvValue(key) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      return '';
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = String(line || '').trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const currentKey = trimmed.slice(0, separatorIndex).trim();
      if (currentKey !== key) {
        continue;
      }

      return trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    return '';
  }

  return '';
}

function parseIntegerEnv(key, fallback) {
  const raw = process.env[key] || readLocalEnvValue(key);
  const parsed = Number.parseInt(String(raw || '').trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseListEnv(key, fallback = []) {
  const raw = process.env[key] || readLocalEnvValue(key) || '';
  const parsed = String(raw)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (parsed.length > 0) {
    return parsed;
  }

  return Array.isArray(fallback)
    ? fallback.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
}

function buildGeminiEndpoint(modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
}

function isQuotaExceededErrorMessage(message) {
  const normalized = String(message || '').toLowerCase();
  return normalized.includes('quota exceeded')
    || normalized.includes('exceeded your current quota')
    || normalized.includes('generate_content_free_tier_requests')
    || normalized.includes('free_tier_requests')
    || (normalized.includes('429') && normalized.includes('quota'));
}

function extractRetryAfterSeconds(details) {
  const message = String(details || '');
  const retryMatch = message.match(/retry in\s*([\d.]+)\s*s/i);
  if (retryMatch?.[1]) {
    const retrySeconds = Math.ceil(Number.parseFloat(retryMatch[1]));
    if (Number.isFinite(retrySeconds) && retrySeconds > 0) {
      return retrySeconds;
    }
  }

  const italianMatch = message.match(/riprova\s+tra\s+(?:circa\s+)?(\d+)\s+second/i);
  if (italianMatch?.[1]) {
    const retrySeconds = Number.parseInt(italianMatch[1], 10);
    if (Number.isFinite(retrySeconds) && retrySeconds > 0) {
      return retrySeconds;
    }
  }

  return 0;
}

const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY || readLocalEnvValue('GEMINI_API_KEY') || '').trim();
const GEMINI_BACKUP_API_KEY = String(process.env.GEMINI_BACKUP_API_KEY || readLocalEnvValue('GEMINI_BACKUP_API_KEY') || '').trim();
const GEMINI_MODEL = String(process.env.GEMINI_MODEL || readLocalEnvValue('GEMINI_MODEL') || 'gemini-2.0-flash').trim() || 'gemini-2.0-flash';
const GEMINI_FALLBACK_MODELS = parseListEnv('GEMINI_FALLBACK_MODELS', ['gemini-2.0-flash-lite', 'gemini-flash-lite-latest']);
const GEMINI_BACKUP_MODEL = String(process.env.GEMINI_BACKUP_MODEL || readLocalEnvValue('GEMINI_BACKUP_MODEL') || GEMINI_MODEL).trim() || GEMINI_MODEL;
const GEMINI_BACKUP_FALLBACK_MODELS = parseListEnv('GEMINI_BACKUP_FALLBACK_MODELS', GEMINI_FALLBACK_MODELS);
const GEMINI_TIMEOUT_MS = parseIntegerEnv('GEMINI_TIMEOUT_MS', 40000);
const GEMINI_MAX_RETRIES = parseIntegerEnv('GEMINI_MAX_RETRIES', 4);
const GEMINI_MODEL_FAILURE_COOLDOWN_MS = parseIntegerEnv('GEMINI_MODEL_FAILURE_COOLDOWN_MS', 20000);
const GEMINI_MODEL_QUOTA_COOLDOWN_MS = parseIntegerEnv('GEMINI_MODEL_QUOTA_COOLDOWN_MS', 90000);
const GEMINI_TOTAL_BUDGET_MS = parseIntegerEnv('GEMINI_TOTAL_BUDGET_MS', 25000);
const GEMINI_MAX_PROMPT_CHARS = parseIntegerEnv('GEMINI_MAX_PROMPT_CHARS', 120000);
const GEMINI_MAX_SYSTEM_PROMPT_CHARS = parseIntegerEnv('GEMINI_MAX_SYSTEM_PROMPT_CHARS', 20000);
const GEMINI_MAX_BODY_BYTES = parseIntegerEnv('GEMINI_MAX_BODY_BYTES', 250000);
const GEMINI_CORS_MODE = (process.env.GEMINI_CORS_MODE || readLocalEnvValue('GEMINI_CORS_MODE') || 'public').trim().toLowerCase();
const GEMINI_RATE_LIMIT_ENABLED = String(process.env.GEMINI_RATE_LIMIT_ENABLED || readLocalEnvValue('GEMINI_RATE_LIMIT_ENABLED') || 'true').trim().toLowerCase() !== 'false';
const GEMINI_RATE_LIMIT_WINDOW_MS = parseIntegerEnv('GEMINI_RATE_LIMIT_WINDOW_MS', 60000);
const GEMINI_RATE_LIMIT_MAX_REQUESTS = parseIntegerEnv('GEMINI_RATE_LIMIT_MAX_REQUESTS', 100);
const GEMINI_ALLOWED_ORIGINS = parseListEnv('GEMINI_ALLOWED_ORIGINS');
const GEMINI_MODEL_CANDIDATES = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS].filter((value, index, array) => value && array.indexOf(value) === index);
const GEMINI_BACKUP_MODEL_CANDIDATES = [GEMINI_BACKUP_MODEL, ...GEMINI_BACKUP_FALLBACK_MODELS].filter((value, index, array) => value && array.indexOf(value) === index);
const GEMINI_KEY_PLANS = [
  {
    slot: 'primary',
    apiKey: GEMINI_API_KEY,
    models: GEMINI_MODEL_CANDIDATES
  },
  ...(GEMINI_BACKUP_API_KEY
    ? [{
        slot: 'backup',
        apiKey: GEMINI_BACKUP_API_KEY,
        models: GEMINI_BACKUP_MODEL_CANDIDATES
      }]
    : [])
].filter((plan) => Boolean(plan.apiKey) && Array.isArray(plan.models) && plan.models.length > 0);
const RATE_LIMIT_STORE_KEY = '__nutrimeGeminiRateLimitStore';
const MODEL_COOLDOWN_STORE_KEY = '__nutrimeGeminiModelCooldownStore';
const rateLimitStore = globalThis[RATE_LIMIT_STORE_KEY] || new Map();
const modelCooldownStore = globalThis[MODEL_COOLDOWN_STORE_KEY] || new Map();

if (!globalThis[RATE_LIMIT_STORE_KEY]) {
  globalThis[RATE_LIMIT_STORE_KEY] = rateLimitStore;
}

if (!globalThis[MODEL_COOLDOWN_STORE_KEY]) {
  globalThis[MODEL_COOLDOWN_STORE_KEY] = modelCooldownStore;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeOrigin(origin) {
  return String(origin || '').trim();
}

function isRestrictedCorsMode() {
  return GEMINI_CORS_MODE === 'restricted';
}

function isOriginAllowed(origin) {
  if (!isRestrictedCorsMode()) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  if (GEMINI_ALLOWED_ORIGINS.length === 0) {
    return true;
  }

  return GEMINI_ALLOWED_ORIGINS.includes(normalizedOrigin);
}

function buildCorsHeaders(origin) {
  if (!isRestrictedCorsMode()) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const allowOrigin = normalizedOrigin && isOriginAllowed(normalizedOrigin)
    ? normalizedOrigin
    : (GEMINI_ALLOWED_ORIGINS.length === 0 ? '*' : 'null');

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin'
  };
}

function sendJson(res, statusCode, payload, origin, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...buildCorsHeaders(origin),
    ...extraHeaders
  };

  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.status(statusCode).send(JSON.stringify(payload));
}

function sanitizeGeminiErrorDetails(details) {
  if (!details) {
    return '';
  }

  if (typeof details === 'string') {
    return details.slice(0, 1000);
  }

  const message = details?.error?.message || details?.message || details?.details || '';
  return String(message || '').slice(0, 1000);
}

function shouldRetryStatus(status) {
  return [429, 500, 502, 503, 504].includes(status);
}

function getHeaderValue(req, headerName) {
  const value = req?.headers?.[headerName];

  if (Array.isArray(value)) {
    return String(value[0] || '').trim();
  }

  return String(value || '').trim();
}

function getClientIdentifier(req) {
  const forwardedForCandidates = [
    getHeaderValue(req, 'x-forwarded-for'),
    getHeaderValue(req, 'x-real-ip'),
    getHeaderValue(req, 'cf-connecting-ip'),
    getHeaderValue(req, 'x-vercel-forwarded-for')
  ];

  for (const candidate of forwardedForCandidates) {
    const normalized = String(candidate || '').split(',')[0].trim();
    if (normalized) {
      return normalized;
    }
  }

  const forwardedHeader = getHeaderValue(req, 'forwarded');
  const forwardedMatch = forwardedHeader.match(/for=(?:"?)(\[[^\]]+\]|[^;,"]+)/i);
  if (forwardedMatch?.[1]) {
    return String(forwardedMatch[1]).trim();
  }

  const requestOrigin = normalizeOrigin(getHeaderValue(req, 'origin'));
  if (requestOrigin) {
    return `origin:${requestOrigin}`;
  }

  return 'anonymous';
}

function pruneRateLimitStore(now) {
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recent = Array.isArray(timestamps)
      ? timestamps.filter((timestamp) => now - timestamp < GEMINI_RATE_LIMIT_WINDOW_MS)
      : [];

    if (recent.length > 0) {
      rateLimitStore.set(key, recent);
    } else {
      rateLimitStore.delete(key);
    }
  }
}

function buildModelCooldownKey(keySlot, modelName) {
  return `${String(keySlot || '').trim()}:${String(modelName || '').trim()}`;
}

function pruneModelCooldownStore(now = Date.now()) {
  for (const [key, record] of modelCooldownStore.entries()) {
    const expiresAt = Number(record?.expiresAt || 0);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) {
      modelCooldownStore.delete(key);
    }
  }
}

function getModelCooldownInfo(keySlot, modelName, now = Date.now()) {
  pruneModelCooldownStore(now);

  const key = buildModelCooldownKey(keySlot, modelName);
  const record = modelCooldownStore.get(key);
  const expiresAt = Number(record?.expiresAt || 0);

  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    if (record) {
      modelCooldownStore.delete(key);
    }

    return {
      active: false,
      retryAfterSeconds: 0,
      reason: ''
    };
  }

  return {
    active: true,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
    reason: String(record?.reason || '').trim()
  };
}

function setModelCooldown(keySlot, modelName, cooldownMs, reason = '') {
  const normalizedCooldownMs = Number.parseInt(String(cooldownMs || 0), 10);
  if (!Number.isFinite(normalizedCooldownMs) || normalizedCooldownMs <= 0) {
    return;
  }

  modelCooldownStore.set(buildModelCooldownKey(keySlot, modelName), {
    expiresAt: Date.now() + normalizedCooldownMs,
    reason: String(reason || '').trim()
  });
}

function clearModelCooldown(keySlot, modelName) {
  modelCooldownStore.delete(buildModelCooldownKey(keySlot, modelName));
}

function getOrderedModelAttempts() {
  const now = Date.now();
  const available = [];
  const coolingDown = [];

  for (const keyPlan of GEMINI_KEY_PLANS) {
    const scopedModels = Array.isArray(keyPlan.models) ? keyPlan.models : [];

    for (const modelName of scopedModels) {
      const cooldownInfo = getModelCooldownInfo(keyPlan.slot, modelName, now);
      const candidate = {
        slot: keyPlan.slot,
        apiKey: keyPlan.apiKey,
        modelName,
        cooldownInfo
      };

      if (cooldownInfo.active) {
        coolingDown.push(candidate);
      } else {
        available.push(candidate);
      }
    }
  }

  if (available.length > 0) {
    return available;
  }

  return coolingDown.sort((left, right) => left.cooldownInfo.retryAfterSeconds - right.cooldownInfo.retryAfterSeconds);
}

function getQuotaCooldownMs(retryAfterSeconds) {
  const reportedRetryMs = Math.max(0, Number.parseInt(String(retryAfterSeconds || 0), 10) || 0) * 1000;
  return Math.max(reportedRetryMs, GEMINI_MODEL_QUOTA_COOLDOWN_MS);
}

function shouldCooldownModelForStatus(status) {
  return status === 404 || status === 429 || shouldRetryStatus(status);
}

function getRemainingBudgetMs(startedAt) {
  return Math.max(0, GEMINI_TOTAL_BUDGET_MS - (Date.now() - startedAt));
}

function getAttemptTimeoutMs(startedAt) {
  const remainingBudgetMs = getRemainingBudgetMs(startedAt);
  if (remainingBudgetMs <= 750) {
    return 0;
  }

  return Math.max(500, Math.min(GEMINI_TIMEOUT_MS, remainingBudgetMs - 250));
}

function getRetryDelayMs(startedAt, suggestedDelayMs) {
  const remainingBudgetMs = getRemainingBudgetMs(startedAt);
  if (remainingBudgetMs <= 500) {
    return 0;
  }

  return Math.min(Math.max(0, suggestedDelayMs), Math.max(0, remainingBudgetMs - 250));
}

function buildRateLimitHeaders(rateLimitInfo) {
  return {
    'X-RateLimit-Limit': String(rateLimitInfo.limit),
    'X-RateLimit-Remaining': String(Math.max(0, rateLimitInfo.remaining)),
    'X-RateLimit-Reset': String(rateLimitInfo.resetAt)
  };
}

function checkRateLimit(req) {
  if (!GEMINI_RATE_LIMIT_ENABLED) {
    return {
      allowed: true,
      limit: 0,
      remaining: 0,
      resetAt: 0,
      retryAfterSeconds: 0
    };
  }

  const now = Date.now();
  pruneRateLimitStore(now);

  const clientId = getClientIdentifier(req);
  const timestamps = rateLimitStore.get(clientId) || [];
  const recent = timestamps.filter((timestamp) => now - timestamp < GEMINI_RATE_LIMIT_WINDOW_MS);
  const resetAt = recent.length > 0 ? recent[0] + GEMINI_RATE_LIMIT_WINDOW_MS : now + GEMINI_RATE_LIMIT_WINDOW_MS;

  if (recent.length >= GEMINI_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      limit: GEMINI_RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000))
    };
  }

  recent.push(now);
  rateLimitStore.set(clientId, recent);

  return {
    allowed: true,
    limit: GEMINI_RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, GEMINI_RATE_LIMIT_MAX_REQUESTS - recent.length),
    resetAt: recent[0] + GEMINI_RATE_LIMIT_WINDOW_MS,
    retryAfterSeconds: 0
  };
}

async function callGeminiWithRetry(payload) {
  const startedAt = Date.now();
  let lastResponsePayload = null;
  let lastStatusCode = 500;
  let lastNetworkError = null;
  let lastModelName = GEMINI_MODEL;
  let lastKeySlot = 'primary';
  let lastRetryAfterSeconds = 0;
  const attemptedModels = [];
  const orderedAttempts = getOrderedModelAttempts();

  for (const candidate of orderedAttempts) {
    const modelName = candidate.modelName;
    attemptedModels.push(`${candidate.slot}:${modelName}`);

    for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt += 1) {
      const attemptTimeoutMs = getAttemptTimeoutMs(startedAt);
      if (attemptTimeoutMs <= 0) {
        return {
          ok: false,
          status: 504,
          model: lastModelName,
          keySlot: lastKeySlot,
          attemptedModels,
          retryAfterSeconds: 0,
          error: `Budget totale Gemini esaurito dopo ${GEMINI_TOTAL_BUDGET_MS} ms`
        };
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), attemptTimeoutMs);

      try {
        const response = await fetch(buildGeminiEndpoint(modelName), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': candidate.apiKey
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        const responseText = await response.text();
        let responseJson = null;

        try {
          responseJson = JSON.parse(responseText);
        } catch (error) {
          responseJson = null;
        }

        clearTimeout(timeout);

        if (response.ok) {
          clearModelCooldown(candidate.slot, modelName);
          return {
            ok: true,
            status: response.status,
            data: responseJson,
            model: modelName,
            keySlot: candidate.slot,
            attemptedModels
          };
        }

        lastModelName = modelName;
        lastKeySlot = candidate.slot;
        lastStatusCode = response.status;
        lastResponsePayload = responseJson || responseText;
        lastRetryAfterSeconds = extractRetryAfterSeconds(sanitizeGeminiErrorDetails(lastResponsePayload));

        if (response.status === 429) {
          setModelCooldown(candidate.slot, modelName, getQuotaCooldownMs(lastRetryAfterSeconds), 'quota');
          break;
        }

        if (!shouldRetryStatus(response.status) || attempt === GEMINI_MAX_RETRIES) {
          if (shouldCooldownModelForStatus(response.status)) {
            setModelCooldown(candidate.slot, modelName, GEMINI_MODEL_FAILURE_COOLDOWN_MS, `status:${response.status}`);
          }
          break;
        }

        await sleep(350 * (attempt + 1));
      } catch (error) {
        clearTimeout(timeout);
        lastModelName = modelName;
        lastKeySlot = candidate.slot;
        lastNetworkError = error;

        if (attempt === GEMINI_MAX_RETRIES) {
          setModelCooldown(candidate.slot, modelName, GEMINI_MODEL_FAILURE_COOLDOWN_MS, error?.name === 'AbortError' ? 'timeout' : 'network-error');
          break;
        }
      }

      const interAttemptDelayMs = getRetryDelayMs(startedAt, 350 * (attempt + 1));
      if (interAttemptDelayMs <= 0) {
        break;
      }

      await sleep(interAttemptDelayMs);
    }
  }

  if (lastNetworkError) {
    return {
      ok: false,
      status: 504,
      model: lastModelName,
      keySlot: lastKeySlot,
      attemptedModels,
      retryAfterSeconds: 0,
      error: lastNetworkError.name === 'AbortError'
        ? `Timeout Gemini dopo ${Math.min(GEMINI_TIMEOUT_MS, GEMINI_TOTAL_BUDGET_MS)} ms`
        : String(lastNetworkError.message || lastNetworkError || 'Errore di rete verso Gemini')
    };
  }

  return {
    ok: false,
    status: lastStatusCode,
    model: lastModelName,
    keySlot: lastKeySlot,
    attemptedModels,
    retryAfterSeconds: lastRetryAfterSeconds,
    error: sanitizeGeminiErrorDetails(lastResponsePayload) || 'Errore Gemini non dettagliato'
  };
}

module.exports = async function handler(req, res) {
  const requestOrigin = req.headers.origin || '';

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true }, requestOrigin);
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' }, requestOrigin);
  }

  if (isRestrictedCorsMode() && GEMINI_ALLOWED_ORIGINS.length > 0 && requestOrigin && !isOriginAllowed(requestOrigin)) {
    return sendJson(res, 403, { error: 'Origin not allowed' }, requestOrigin);
  }

  const rateLimitInfo = checkRateLimit(req);
  const rateLimitHeaders = buildRateLimitHeaders(rateLimitInfo);

  if (!rateLimitInfo.allowed) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded',
      details: `Troppi tentativi ravvicinati. Riprova tra circa ${rateLimitInfo.retryAfterSeconds} secondi.`
    }, requestOrigin, {
      ...rateLimitHeaders,
      'Retry-After': String(rateLimitInfo.retryAfterSeconds)
    });
  }

  if (GEMINI_KEY_PLANS.length === 0) {
    return sendJson(res, 500, {
      error: 'Missing Gemini API key',
      details: 'Imposta GEMINI_API_KEY oppure GEMINI_BACKUP_API_KEY nelle environment variables di Vercel.'
    }, requestOrigin, rateLimitHeaders);
  }

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBody.length > GEMINI_MAX_BODY_BYTES) {
    return sendJson(res, 413, {
      error: 'Request body too large',
      details: `Riduci il payload sotto ${GEMINI_MAX_BODY_BYTES} byte.`
    }, requestOrigin, rateLimitHeaders);
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) {
    return sendJson(res, 415, {
      error: 'Unsupported Content-Type',
      details: 'Invia application/json.'
    }, requestOrigin, rateLimitHeaders);
  }

  const body = typeof req.body === 'object' && req.body !== null
    ? req.body
    : (() => {
        try {
          return JSON.parse(rawBody || '{}');
        } catch (error) {
          return null;
        }
      })();

  if (!body) {
    return sendJson(res, 400, { error: 'Invalid JSON body' }, requestOrigin, rateLimitHeaders);
  }

  const prompt = String(body.prompt || '').trim();
  const systemPrompt = String(body.systemPrompt || '').trim();
  if (!prompt) {
    return sendJson(res, 400, { error: 'Missing prompt parameter' }, requestOrigin, rateLimitHeaders);
  }

  if (prompt.length > GEMINI_MAX_PROMPT_CHARS) {
    return sendJson(res, 413, {
      error: 'Prompt too large',
      details: `Riduci il prompt sotto ${GEMINI_MAX_PROMPT_CHARS} caratteri.`
    }, requestOrigin, rateLimitHeaders);
  }

  if (systemPrompt.length > GEMINI_MAX_SYSTEM_PROMPT_CHARS) {
    return sendJson(res, 413, {
      error: 'System prompt too large',
      details: `Riduci il systemPrompt sotto ${GEMINI_MAX_SYSTEM_PROMPT_CHARS} caratteri.`
    }, requestOrigin, rateLimitHeaders);
  }

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      topP: 0.9,
      topK: 32,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    }
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const geminiResult = await callGeminiWithRetry(payload);

  if (!geminiResult.ok) {
    const responseHeaders = { ...rateLimitHeaders };
    const quotaExceeded = geminiResult.status === 429 || isQuotaExceededErrorMessage(geminiResult.error);

    if (geminiResult.retryAfterSeconds > 0) {
      responseHeaders['Retry-After'] = String(geminiResult.retryAfterSeconds);
    }

    return sendJson(res, geminiResult.status, {
      error: 'Errore da Gemini',
      details: quotaExceeded
        ? `Quota Gemini temporaneamente esaurita sui modelli disponibili. Riprova tra circa ${geminiResult.retryAfterSeconds > 0 ? geminiResult.retryAfterSeconds : 20} secondi.`
        : geminiResult.error,
      technicalDetails: geminiResult.error,
      attemptedModels: geminiResult.attemptedModels || GEMINI_MODEL_CANDIDATES,
      model: geminiResult.model || GEMINI_MODEL,
      keySlot: geminiResult.keySlot || 'primary'
    }, requestOrigin, responseHeaders);
  }

  const responseJson = geminiResult.data || {};
  const text = responseJson?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('').trim() || '';

  return sendJson(res, 200, {
    text,
    candidates: responseJson?.candidates || [],
    usageMetadata: responseJson?.usageMetadata || null,
    model: geminiResult.model || GEMINI_MODEL,
    attemptedModels: geminiResult.attemptedModels || GEMINI_MODEL_CANDIDATES,
    keySlot: geminiResult.keySlot || 'primary',
    raw: responseJson
  }, requestOrigin, {
    ...rateLimitHeaders,
    'X-Gemini-Model': String(geminiResult.model || GEMINI_MODEL),
    'X-Gemini-Key-Slot': String(geminiResult.keySlot || 'primary')
  });
};
