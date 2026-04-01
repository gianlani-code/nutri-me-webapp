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

function parseListEnv(key) {
  const raw = process.env[key] || readLocalEnvValue(key) || '';
  return String(raw)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || readLocalEnvValue('GEMINI_API_KEY') || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || readLocalEnvValue('GEMINI_MODEL') || 'gemini-2.5-flash';
const GEMINI_TIMEOUT_MS = parseIntegerEnv('GEMINI_TIMEOUT_MS', 25000);
const GEMINI_MAX_RETRIES = parseIntegerEnv('GEMINI_MAX_RETRIES', 2);
const GEMINI_MAX_PROMPT_CHARS = parseIntegerEnv('GEMINI_MAX_PROMPT_CHARS', 120000);
const GEMINI_MAX_SYSTEM_PROMPT_CHARS = parseIntegerEnv('GEMINI_MAX_SYSTEM_PROMPT_CHARS', 20000);
const GEMINI_MAX_BODY_BYTES = parseIntegerEnv('GEMINI_MAX_BODY_BYTES', 250000);
const GEMINI_ALLOWED_ORIGINS = parseListEnv('GEMINI_ALLOWED_ORIGINS');
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeOrigin(origin) {
  return String(origin || '').trim();
}

function isOriginAllowed(origin) {
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

function sendJson(res, statusCode, payload, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...buildCorsHeaders(origin)
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

async function callGeminiWithRetry(payload) {
  let lastResponsePayload = null;
  let lastStatusCode = 500;
  let lastNetworkError = null;

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
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
        return {
          ok: true,
          status: response.status,
          data: responseJson
        };
      }

      lastStatusCode = response.status;
      lastResponsePayload = responseJson || responseText;

      if (!shouldRetryStatus(response.status) || attempt === GEMINI_MAX_RETRIES) {
        break;
      }

      await sleep(350 * (attempt + 1));
    } catch (error) {
      clearTimeout(timeout);
      lastNetworkError = error;

      if (attempt === GEMINI_MAX_RETRIES) {
        break;
      }

      await sleep(350 * (attempt + 1));
    }
  }

  if (lastNetworkError) {
    return {
      ok: false,
      status: 504,
      error: lastNetworkError.name === 'AbortError'
        ? `Timeout Gemini dopo ${GEMINI_TIMEOUT_MS} ms`
        : String(lastNetworkError.message || lastNetworkError || 'Errore di rete verso Gemini')
    };
  }

  return {
    ok: false,
    status: lastStatusCode,
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

  if (GEMINI_ALLOWED_ORIGINS.length > 0 && requestOrigin && !isOriginAllowed(requestOrigin)) {
    return sendJson(res, 403, { error: 'Origin not allowed' }, requestOrigin);
  }

  if (!GEMINI_API_KEY) {
    return sendJson(res, 500, {
      error: 'Missing GEMINI_API_KEY',
      details: 'Imposta GEMINI_API_KEY nelle environment variables di Vercel.'
    }, requestOrigin);
  }

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBody.length > GEMINI_MAX_BODY_BYTES) {
    return sendJson(res, 413, {
      error: 'Request body too large',
      details: `Riduci il payload sotto ${GEMINI_MAX_BODY_BYTES} byte.`
    }, requestOrigin);
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) {
    return sendJson(res, 415, {
      error: 'Unsupported Content-Type',
      details: 'Invia application/json.'
    }, requestOrigin);
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
    return sendJson(res, 400, { error: 'Invalid JSON body' }, requestOrigin);
  }

  const prompt = String(body.prompt || '').trim();
  const systemPrompt = String(body.systemPrompt || '').trim();
  if (!prompt) {
    return sendJson(res, 400, { error: 'Missing prompt parameter' }, requestOrigin);
  }

  if (prompt.length > GEMINI_MAX_PROMPT_CHARS) {
    return sendJson(res, 413, {
      error: 'Prompt too large',
      details: `Riduci il prompt sotto ${GEMINI_MAX_PROMPT_CHARS} caratteri.`
    }, requestOrigin);
  }

  if (systemPrompt.length > GEMINI_MAX_SYSTEM_PROMPT_CHARS) {
    return sendJson(res, 413, {
      error: 'System prompt too large',
      details: `Riduci il systemPrompt sotto ${GEMINI_MAX_SYSTEM_PROMPT_CHARS} caratteri.`
    }, requestOrigin);
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
    return sendJson(res, geminiResult.status, {
      error: 'Errore da Gemini',
      details: geminiResult.error
    }, requestOrigin);
  }

  const responseJson = geminiResult.data || {};
  const text = responseJson?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('').trim() || '';

  return sendJson(res, 200, {
    text,
    candidates: responseJson?.candidates || [],
    usageMetadata: responseJson?.usageMetadata || null,
    model: GEMINI_MODEL,
    raw: responseJson
  }, requestOrigin);
};
