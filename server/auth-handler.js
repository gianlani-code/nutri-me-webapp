const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { BlobPreconditionFailedError, del, get, put } = require('@vercel/blob');

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

function parseIntegerEnv(key, fallback) {
  const raw = process.env[key] || readLocalEnvValue(key) || '';
  const parsed = Number.parseInt(String(raw).trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const AUTH_KV_REST_URL = String(process.env.AUTH_KV_REST_URL || readLocalEnvValue('AUTH_KV_REST_URL') || '').trim();
const AUTH_KV_REST_TOKEN = String(process.env.AUTH_KV_REST_TOKEN || readLocalEnvValue('AUTH_KV_REST_TOKEN') || '').trim();
const BLOB_READ_WRITE_TOKEN = String(process.env.BLOB_READ_WRITE_TOKEN || readLocalEnvValue('BLOB_READ_WRITE_TOKEN') || '').trim();
const AUTH_TOKEN_SECRET = String(process.env.AUTH_TOKEN_SECRET || readLocalEnvValue('AUTH_TOKEN_SECRET') || 'dev-only-auth-secret-change-me').trim();
const AUTH_CORS_MODE = String(process.env.AUTH_CORS_MODE || readLocalEnvValue('AUTH_CORS_MODE') || process.env.GEMINI_CORS_MODE || readLocalEnvValue('GEMINI_CORS_MODE') || 'public').trim().toLowerCase();
const AUTH_ALLOWED_ORIGINS = parseListEnv('AUTH_ALLOWED_ORIGINS', parseListEnv('GEMINI_ALLOWED_ORIGINS'));
const AUTH_USERNAME_MIN_LENGTH = parseIntegerEnv('AUTH_USERNAME_MIN_LENGTH', 3);
const AUTH_USERNAME_MAX_LENGTH = parseIntegerEnv('AUTH_USERNAME_MAX_LENGTH', 32);
const AUTH_PASSWORD_MIN_LENGTH = parseIntegerEnv('AUTH_PASSWORD_MIN_LENGTH', 6);
const FILE_STORE_PATH = path.resolve(process.cwd(), 'data', '.auth-store.json');
const FILE_STORE_DEFAULT = {
  usersByUsername: {},
  users: {},
  userData: {}
};

function normalizeOrigin(origin) {
  return String(origin || '').trim();
}

function isRestrictedCorsMode() {
  return AUTH_CORS_MODE === 'restricted';
}

function isOriginAllowed(origin) {
  if (!isRestrictedCorsMode()) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  if (AUTH_ALLOWED_ORIGINS.length === 0) {
    return true;
  }

  return AUTH_ALLOWED_ORIGINS.includes(normalizedOrigin);
}

function buildCorsHeaders(origin) {
  if (!isRestrictedCorsMode()) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const allowOrigin = normalizedOrigin && isOriginAllowed(normalizedOrigin)
    ? normalizedOrigin
    : (AUTH_ALLOWED_ORIGINS.length === 0 ? '*' : 'null');

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
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

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function normalizeUsernameKey(username) {
  return String(username || '').trim().toLowerCase();
}

function buildUserId(username) {
  const usernameKey = normalizeUsernameKey(username).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `user_${usernameKey || crypto.randomUUID()}`;
}

function sanitizeUsername(username) {
  return String(username || '').trim();
}

function validateCredentials(username, password) {
  const trimmedUsername = sanitizeUsername(username);
  const normalizedPassword = String(password || '');

  if (!trimmedUsername || !normalizedPassword) {
    throw new Error('Username e password sono obbligatori.');
  }

  if (trimmedUsername.length < AUTH_USERNAME_MIN_LENGTH || trimmedUsername.length > AUTH_USERNAME_MAX_LENGTH) {
    throw new Error(`Lo username deve contenere tra ${AUTH_USERNAME_MIN_LENGTH} e ${AUTH_USERNAME_MAX_LENGTH} caratteri.`);
  }

  if (/\s{2,}/.test(trimmedUsername) || /[\r\n\t]/.test(trimmedUsername)) {
    throw new Error('Lo username contiene caratteri non validi.');
  }

  if (normalizedPassword.length < AUTH_PASSWORD_MIN_LENGTH) {
    throw new Error(`La password deve contenere almeno ${AUTH_PASSWORD_MIN_LENGTH} caratteri.`);
  }

  return {
    username: trimmedUsername,
    usernameKey: normalizeUsernameKey(trimmedUsername),
    password: normalizedPassword
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const digest = crypto.scryptSync(String(password || ''), salt, 64).toString('hex');
  return `${salt}:${digest}`;
}

function verifyPassword(password, storedHash) {
  const [salt, digest] = String(storedHash || '').split(':');
  if (!salt || !digest) {
    return false;
  }

  const candidate = crypto.scryptSync(String(password || ''), salt, 64).toString('hex');
  const left = Buffer.from(candidate, 'hex');
  const right = Buffer.from(digest, 'hex');

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function base64UrlEncode(value) {
  return Buffer.from(String(value || ''), 'utf8').toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(String(value || ''), 'base64url').toString('utf8');
}

function signToken(encodedPayload) {
  return crypto.createHmac('sha256', AUTH_TOKEN_SECRET).update(encodedPayload).digest('base64url');
}

function createSessionToken(user) {
  const payload = {
    userId: user.userId,
    username: user.username,
    usernameKey: user.usernameKey,
    issuedAt: new Date().toISOString()
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${signToken(encodedPayload)}`;
}

function verifySessionToken(token) {
  const [encodedPayload, providedSignature] = String(token || '').split('.');
  if (!encodedPayload || !providedSignature) {
    throw new Error('Sessione non valida.');
  }

  const expectedSignature = signToken(encodedPayload);
  const left = Buffer.from(providedSignature, 'utf8');
  const right = Buffer.from(expectedSignature, 'utf8');

  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    throw new Error('Sessione non valida.');
  }

  const payload = safeJsonParse(base64UrlDecode(encodedPayload), null);
  if (!payload?.userId || !payload?.usernameKey) {
    throw new Error('Sessione non valida.');
  }

  return payload;
}

function getAuthTokenFromRequest(req) {
  const authorizationHeader = String(req.headers?.authorization || '').trim();
  if (!authorizationHeader.toLowerCase().startsWith('bearer ')) {
    return '';
  }

  return authorizationHeader.slice(7).trim();
}

function ensureFileStore() {
  const directory = path.dirname(FILE_STORE_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(FILE_STORE_PATH)) {
    fs.writeFileSync(FILE_STORE_PATH, JSON.stringify(FILE_STORE_DEFAULT, null, 2), 'utf8');
  }
}

function readFileStore() {
  ensureFileStore();
  const content = fs.readFileSync(FILE_STORE_PATH, 'utf8');
  const parsed = safeJsonParse(content, FILE_STORE_DEFAULT);
  return {
    usersByUsername: parsed?.usersByUsername && typeof parsed.usersByUsername === 'object' ? parsed.usersByUsername : {},
    users: parsed?.users && typeof parsed.users === 'object' ? parsed.users : {},
    userData: parsed?.userData && typeof parsed.userData === 'object' ? parsed.userData : {}
  };
}

function writeFileStore(store) {
  ensureFileStore();
  fs.writeFileSync(FILE_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function hasBlobStore() {
  return Boolean(BLOB_READ_WRITE_TOKEN);
}

function hasRedisStore() {
  return Boolean(AUTH_KV_REST_URL && AUTH_KV_REST_TOKEN);
}

function encodeBlobSegment(value) {
  return encodeURIComponent(String(value || '').trim());
}

function getBlobPathForUsername(usernameKey) {
  return `nutrime-auth/usernames/${encodeBlobSegment(usernameKey)}.json`;
}

function getBlobPathForUser(userId) {
  return `nutrime-auth/users/${encodeBlobSegment(userId)}.json`;
}

function getBlobPathForUserData(userId) {
  return `nutrime-auth/user-data/${encodeBlobSegment(userId)}.json`;
}

async function readBlobJson(blobPath, fallback = null) {
  try {
    const response = await get(blobPath, {
      access: 'private',
      token: BLOB_READ_WRITE_TOKEN,
      useCache: false
    });

    if (!response) {
      return {
        data: fallback,
        etag: null
      };
    }

    const raw = await new Response(response.stream).text();
    return {
      data: safeJsonParse(raw, fallback),
      etag: response.blob?.etag || null
    };
  } catch (error) {
    const message = String(error?.message || '');
    if (message.includes('does not exist') || message.includes('not found')) {
      return {
        data: fallback,
        etag: null
      };
    }

    throw error;
  }
}

async function writeBlobJson(blobPath, payload, options = {}) {
  const normalizedPayload = payload === undefined ? null : payload;
  return put(blobPath, JSON.stringify(normalizedPayload), {
    access: 'private',
    token: BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    contentType: 'application/json',
    ...options
  });
}

async function redisRequest(command, args = [], searchParams = null) {
  const commandPath = [command, ...args.map((arg) => encodeURIComponent(String(arg)))].join('/');
  const requestUrl = new URL(commandPath, AUTH_KV_REST_URL.endsWith('/') ? AUTH_KV_REST_URL : `${AUTH_KV_REST_URL}/`);

  if (searchParams && typeof searchParams === 'object') {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        requestUrl.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AUTH_KV_REST_TOKEN}`
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.error) {
    throw new Error(payload?.error || 'Archivio utenti remoto non disponibile.');
  }

  return payload?.result;
}

async function getUserByUsername(usernameKey) {
  if (hasBlobStore()) {
    const mappingResult = await readBlobJson(getBlobPathForUsername(usernameKey), null);
    const userId = mappingResult.data?.userId;
    if (!userId) {
      return null;
    }

    const userResult = await readBlobJson(getBlobPathForUser(userId), null);
    return userResult.data || null;
  }

  if (hasRedisStore()) {
    const userId = await redisRequest('get', [`nutrime:auth:user-by-username:${usernameKey}`]);
    if (!userId) {
      return null;
    }

    const serializedUser = await redisRequest('get', [`nutrime:auth:user:${userId}`]);
    return safeJsonParse(serializedUser, null);
  }

  const store = readFileStore();
  const userId = store.usersByUsername[usernameKey];
  return userId ? store.users[userId] || null : null;
}

async function createUserRecord(username, password) {
  const { username: trimmedUsername, usernameKey, password: normalizedPassword } = validateCredentials(username, password);
  const userId = buildUserId(trimmedUsername);
  const usernamePath = getBlobPathForUsername(usernameKey);
  const userPath = getBlobPathForUser(userId);
  const userDataPath = getBlobPathForUserData(userId);
  const userRecord = {
    userId,
    username: trimmedUsername,
    usernameKey,
    passwordHash: hashPassword(normalizedPassword),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (hasBlobStore()) {
    try {
      await writeBlobJson(usernamePath, { userId }, { allowOverwrite: false });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError || String(error?.message || '').includes('Precondition failed')) {
        throw new Error('Questo username e gia registrato.');
      }

      throw error;
    }

    try {
      await writeBlobJson(userPath, userRecord, { allowOverwrite: false });
      await writeBlobJson(userDataPath, {}, { allowOverwrite: false });
      return userRecord;
    } catch (error) {
      await Promise.allSettled([
        del(usernamePath, { token: BLOB_READ_WRITE_TOKEN }),
        del(userPath, { token: BLOB_READ_WRITE_TOKEN }),
        del(userDataPath, { token: BLOB_READ_WRITE_TOKEN })
      ]);
      throw error;
    }
  }

  if (hasRedisStore()) {
    const lockResult = await redisRequest('set', [`nutrime:auth:user-by-username:${usernameKey}`, userId], { NX: 'true' });
    if (lockResult !== 'OK') {
      throw new Error('Questo username e gia registrato.');
    }

    await redisRequest('set', [`nutrime:auth:user:${userId}`, JSON.stringify(userRecord)]);
    await redisRequest('set', [`nutrime:auth:data:${userId}`, JSON.stringify({})]);
    return userRecord;
  }

  const store = readFileStore();
  if (store.usersByUsername[usernameKey]) {
    throw new Error('Questo username e gia registrato.');
  }

  store.usersByUsername[usernameKey] = userId;
  store.users[userId] = userRecord;
  store.userData[userId] = {};
  writeFileStore(store);
  return userRecord;
}

async function loadStoredUserData(userId) {
  if (hasBlobStore()) {
    const dataResult = await readBlobJson(getBlobPathForUserData(userId), {});
    return dataResult.data && typeof dataResult.data === 'object' ? dataResult.data : {};
  }

  if (hasRedisStore()) {
    const serializedData = await redisRequest('get', [`nutrime:auth:data:${userId}`]);
    return safeJsonParse(serializedData, {}) || {};
  }

  const store = readFileStore();
  return store.userData[userId] && typeof store.userData[userId] === 'object' ? store.userData[userId] : {};
}

async function saveStoredUserData(userId, data) {
  const normalizedData = data && typeof data === 'object' ? data : {};

  if (hasBlobStore()) {
    const blobPath = getBlobPathForUserData(userId);
    const existing = await readBlobJson(blobPath, null);

    try {
      await writeBlobJson(blobPath, normalizedData, existing.etag
        ? { allowOverwrite: true, ifMatch: existing.etag }
        : { allowOverwrite: false });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) {
        const latest = await readBlobJson(blobPath, null);
        await writeBlobJson(blobPath, normalizedData, latest.etag
          ? { allowOverwrite: true, ifMatch: latest.etag }
          : { allowOverwrite: false });
      } else {
        throw error;
      }
    }

    return normalizedData;
  }

  if (hasRedisStore()) {
    await redisRequest('set', [`nutrime:auth:data:${userId}`, JSON.stringify(normalizedData)]);
    return normalizedData;
  }

  const store = readFileStore();
  store.userData[userId] = normalizedData;
  writeFileStore(store);
  return normalizedData;
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return safeJsonParse(req.body, {});
  }

  return new Promise((resolve) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      resolve(safeJsonParse(raw, {}));
    });

    req.on('error', () => {
      resolve({});
    });
  });
}

async function requireAuthenticatedUser(req) {
  const token = getAuthTokenFromRequest(req);
  const session = verifySessionToken(token);
  const user = await getUserByUsername(session.usernameKey);

  if (!user || user.userId !== session.userId) {
    throw new Error('Sessione non valida.');
  }

  return {
    token,
    session,
    user
  };
}

function createAuthHandler() {
  return async function handler(req, res) {
    const origin = normalizeOrigin(req.headers?.origin || '');

    if (req.method === 'OPTIONS') {
      Object.entries(buildCorsHeaders(origin)).forEach(([key, value]) => res.setHeader(key, value));
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'Metodo non consentito.' }, origin);
      return;
    }

    try {
      const body = await readRequestBody(req);
      const action = String(body?.action || '').trim();

      if (!action) {
        throw new Error('Azione autenticazione mancante.');
      }

      if (action === 'register') {
        const user = await createUserRecord(body.username, body.password);
        const token = createSessionToken(user);

        sendJson(res, 200, {
          ok: true,
          user: {
            userId: user.userId,
            username: user.username,
            usernameKey: user.usernameKey,
            createdAt: user.createdAt
          },
          session: {
            token,
            userId: user.userId,
            username: user.username,
            createdAt: new Date().toISOString()
          }
        }, origin);
        return;
      }

      if (action === 'login') {
        const { usernameKey, password } = validateCredentials(body.username, body.password);
        const user = await getUserByUsername(usernameKey);

        if (!user || !verifyPassword(password, user.passwordHash)) {
          sendJson(res, 401, { ok: false, error: 'Credenziali non valide.' }, origin);
          return;
        }

        const token = createSessionToken(user);
        sendJson(res, 200, {
          ok: true,
          user: {
            userId: user.userId,
            username: user.username,
            usernameKey: user.usernameKey,
            createdAt: user.createdAt
          },
          session: {
            token,
            userId: user.userId,
            username: user.username,
            createdAt: new Date().toISOString()
          }
        }, origin);
        return;
      }

      if (action === 'loadUserData') {
        const { user } = await requireAuthenticatedUser(req);
        const data = await loadStoredUserData(user.userId);
        sendJson(res, 200, { ok: true, data }, origin);
        return;
      }

      if (action === 'saveUserData') {
        const { user } = await requireAuthenticatedUser(req);
        const data = body?.data && typeof body.data === 'object' ? body.data : {};
        const savedData = await saveStoredUserData(user.userId, data);
        sendJson(res, 200, { ok: true, data: savedData }, origin);
        return;
      }

      if (action === 'session') {
        const { user } = await requireAuthenticatedUser(req);
        sendJson(res, 200, {
          ok: true,
          user: {
            userId: user.userId,
            username: user.username,
            usernameKey: user.usernameKey,
            createdAt: user.createdAt
          }
        }, origin);
        return;
      }

      sendJson(res, 400, { ok: false, error: 'Azione autenticazione non supportata.' }, origin);
    } catch (error) {
      const message = String(error?.message || 'Operazione autenticazione non riuscita.');
      const statusCode = message === 'Sessione non valida.' ? 401 : 400;
      sendJson(res, statusCode, { ok: false, error: message }, origin);
    }
  };
}

module.exports = {
  createAuthHandler
};