#!/usr/bin/env node
/*
 * Download Italian food products from the Open Food Facts API.
 * Saves to data/kaggle-products.json (same format used by the app).
 *
 * Usage:
 *   node scripts/fetch-off-italy.js [--max N] [--output path.json]
 *
 * Defaults: max 50 000 products, output → data/kaggle-products.json
 */

const fs   = require('fs');
const path = require('path');

// ─── configuration ────────────────────────────────────────────────────────────
const FIELDS = [
  'code',
  'product_name',
  'product_name_it',
  'brands',
  'categories_en',
  'nutriscore_grade',
  'energy-kcal_100g',
  'energy_100g',
  'proteins_100g',
  'carbohydrates_100g',
  'sugars_100g',
  'fat_100g',
  'saturated-fat_100g',
  'fiber_100g',
  'salt_100g',
  'sodium_100g',
].join(',');

const PAGE_SIZE    = 1000;   // max allowed by OFF API
const CONCURRENCY  = 3;      // parallel page requests (reduced for stability)
const RETRY_DELAY  = 3000;   // ms to wait before retrying a failed page
const MAX_RETRIES  = 3;
const MAX_RAW_PAGES = 200;   // fetch at most X pages regardless of --max

// ─── helpers ─────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function n(value) {
  const v = parseFloat(value);
  return Number.isFinite(v) ? v : 0;
}

function buildUrl(page) {
  return (
    'https://world.openfoodfacts.org/cgi/search.pl' +
    '?action=process' +
    '&tagtype_0=countries&tag_contains_0=contains&tag_0=italy' +
    `&json=1&page_size=${PAGE_SIZE}&page=${page}` +
    `&fields=${encodeURIComponent(FIELDS)}`
  );
}

// Manual timeout wrapper — avoids AbortSignal.timeout() Node version issues
function fetchWithTimeout(url, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    fetch(url, options)
      .then(r => { clearTimeout(timer); resolve(r); })
      .catch(e => { clearTimeout(timer); reject(e); });
  });
}

async function fetchPage(page, attempt = 1) {
  try {
    const res = await fetchWithTimeout(
      buildUrl(page),
      { headers: { 'User-Agent': 'NutriMeApp/1.0 (data build script)' } },
      45_000
    );
    if (res.status === 429) {
      if (attempt <= MAX_RETRIES) { await sleep(RETRY_DELAY * attempt * 2); return fetchPage(page, attempt + 1); }
      return null;
    }
    if (!res.ok) return null;
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
  } catch (err) {
    if (attempt <= MAX_RETRIES) { await sleep(RETRY_DELAY * attempt); return fetchPage(page, attempt + 1); }
    return null;
  }
}

function mapProduct(p) {
  let kcal = n(p['energy-kcal_100g']);
  if (!kcal) {
    const kj = n(p['energy_100g']);
    if (kj > 0) kcal = Math.round((kj / 4.184) * 10) / 10;
  }

  const name = (p.product_name_it || p.product_name || '').trim();
  const code = String(p.code || '').replace(/\D/g, '');
  if (!code || !name) return null;

  const proteins = n(p.proteins_100g);
  const carbs    = n(p.carbohydrates_100g);
  const fat      = n(p.fat_100g);
  if (!kcal && !proteins && !carbs && !fat) return null;   // no nutritional data

  return {
    code,
    barcodes: code,
    product_name_it: name,
    product_name:    (p.product_name || name).trim(),
    brands:          (p.brands || '').trim(),
    food_category:   (p.categories_en || '').split(',')[0].trim(),
    nutriscore_grade: (p.nutriscore_grade || '').toUpperCase().replace(/[^A-E]/g, ''),
    energy_kcal_100g:    kcal,
    proteins_100g:       proteins,
    carbohydrates_100g:  carbs,
    sugars_100g:         n(p.sugars_100g),
    fat_100g:            fat,
    saturated_fat_100g:  n(p['saturated-fat_100g']),
    fiber_100g:          n(p.fiber_100g),
    salt_100g:           n(p.salt_100g),
    sodium_100g:         n(p.sodium_100g),
  };
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const maxIdx = args.indexOf('--max');
  const maxProducts = maxIdx !== -1 ? parseInt(args[maxIdx + 1], 10) : 50_000;
  const outIdx = args.indexOf('--output');
  const outputPath = outIdx !== -1
    ? path.resolve(process.cwd(), args[outIdx + 1])
    : path.resolve(process.cwd(), 'data', 'kaggle-products.json');

  console.log('Fetching Italian products from Open Food Facts API...');
  console.log(`Target: ${maxProducts.toLocaleString()} products  →  ${outputPath}`);

  // ── step 1: probe first page to get total count ──
  const first = await fetchPage(1);
  if (!first || !first.products) {
    console.error('ERROR: Could not reach the Open Food Facts API. Check internet connection.');
    process.exit(1);
  }

  const totalAvailable = first.count || 0;
  const totalPages = Math.min(
    MAX_RAW_PAGES,
    Math.ceil(totalAvailable / PAGE_SIZE)
  );

  console.log(`Products available in Italy on OFF: ${totalAvailable.toLocaleString()}`);
  console.log(`Pages to fetch: ${totalPages} (${PAGE_SIZE}/page, ${CONCURRENCY} parallel)`);

  const seenCodes = new Set();
  const products  = [];

  function ingest(rawList) {
    for (const p of rawList) {
      const mapped = mapProduct(p);
      if (!mapped || seenCodes.has(mapped.code)) continue;
      seenCodes.add(mapped.code);
      products.push(mapped);
    }
  }

  ingest(first.products);

  // ── step 2: fetch remaining pages in batches ──
  for (let startPage = 2; startPage <= totalPages; startPage += CONCURRENCY) {
    const batch = [];
    for (let p = startPage; p < startPage + CONCURRENCY && p <= totalPages; p++) {
      batch.push(fetchPage(p));
    }
    const results = await Promise.all(batch);
    for (const r of results) {
      if (r && r.products) ingest(r.products);
    }

    process.stdout.write(
      `  Page ${Math.min(startPage + CONCURRENCY - 1, totalPages)}/${totalPages} — ` +
      `${products.length.toLocaleString()} products collected\r`
    );

    if (products.length >= maxProducts) break;

    // Small polite pause every 20 pages to avoid hammering the API
    if ((startPage - 2) % 20 === 0 && startPage > 2) await sleep(500);
  }

  process.stdout.write('\n');

  // ── step 3: write output ──
  const final = products.slice(0, maxProducts);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(final, null, 2) + '\n', 'utf8');

  const withBarcodes = final.filter(p => p.barcodes).length;
  const withNutri    = final.filter(p => p.nutriscore_grade).length;
  const withKcal     = final.filter(p => p.energy_kcal_100g > 0).length;

  console.log('─'.repeat(50));
  console.log(`Products saved     : ${final.length.toLocaleString()}`);
  console.log(`  with barcodes    : ${withBarcodes.toLocaleString()}`);
  console.log(`  with Nutri-Score : ${withNutri.toLocaleString()}`);
  console.log(`  with kcal        : ${withKcal.toLocaleString()}`);
  console.log(`Output             : ${outputPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });