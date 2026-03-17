#!/usr/bin/env node

/*
 * Convert Kaggle / Open Food Facts CSV datasets to data/kaggle-products.json
 * Usage:
 *   node scripts/kaggle-csv-to-json.js <input.csv> [output.json] [--max N]
 *
 * Supports:
 *   - Open Food Facts CSV (tab-separated, columns: code, product_name, brands,
 *     nutriscore_grade, energy-kcal_100g, energy_100g, fat_100g, …)
 *   - USDA comprehensive foods CSV (comma-separated)
 *   - Any Kaggle nutrition CSV with barcode / ean / upc columns
 *
 * Large files (> 150 MB) are processed line-by-line to avoid memory issues.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function detectDelimiter(text) {
  const firstLine = (text.split(/\r?\n/).find((line) => line.trim().length > 0) || '').trim();
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount >= commaCount && tabCount >= semicolonCount) return '\t';
  if (semicolonCount >= commaCount) return ';';
  return ',';
}

function parseCsv(text, delimiter) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === delimiter) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && next === '\n') {
        i += 1;
      }

      row.push(cell);
      cell = '';

      const hasAny = row.some((part) => String(part).trim().length > 0);
      if (hasAny) rows.push(row);
      row = [];
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  const hasAny = row.some((part) => String(part).trim().length > 0);
  if (hasAny) rows.push(row);

  return rows;
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
}

function normalizeText(value) {
  return String(value == null ? '' : value).trim();
}

function toNumberSafe(value) {
  const raw = normalizeText(value);
  if (!raw) return 0;
  const normalized = raw.replace(/,/g, '.').replace(/[^0-9.+-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pickValue(row, aliases) {
  for (const alias of aliases) {
    if (!(alias in row)) continue;
    const value = normalizeText(row[alias]);
    if (value) return value;
  }
  return '';
}

function collectBarcodeList(row) {
  const fields = [
    'code',
    'barcode',
    'barcodes',
    'ean',
    'ean13',
    'upc',
    'gtin',
    'product_code'
  ];

  const parts = [];
  fields.forEach((field) => {
    const raw = pickValue(row, [field]);
    if (!raw) return;
    raw.split(/[|,;\s]+/g).forEach((piece) => {
      const digits = piece.replace(/\D/g, '');
      if (digits.length >= 7) parts.push(digits);
    });
  });

  return [...new Set(parts)];
}

function normalizeNutriScore(value) {
  const s = normalizeText(value).toUpperCase().replace(/[^A-E]/g, '');
  return s || '';
}

function mapRow(row) {
  const barcodes = collectBarcodeList(row);
  const fallbackCode = pickValue(row, ['fdc_id', 'food_code', 'id']);
  const code = barcodes[0] || fallbackCode;

  if (!code) return null;

  const name = pickValue(row, ['product_name_it', 'product_name', 'food_name', 'name', 'title']);
  if (!name) return null; // skip stub entries with no name

  // kJ → kcal fallback (Open Food Facts stores energy in kJ as energy_100g / energy-kj_100g)
  let kcal = toNumberSafe(pickValue(row, ['energy-kcal_100g', 'energy_kcal_100g', 'kcal_100g', 'kcal', 'energy_kcal', 'calories']));
  if (!kcal) {
    const kj = toNumberSafe(pickValue(row, ['energy_100g', 'energy-kj_100g', 'energy_kj_100g', 'energy']));
    if (kj > 0) kcal = Math.round((kj / 4.184) * 10) / 10;
  }

  const proteins = toNumberSafe(pickValue(row, ['proteins_100g', 'protein_100g', 'proteine_100g', 'proteins', 'proteine', 'protein_g']));
  const carbs = toNumberSafe(pickValue(row, ['carbohydrates_100g', 'carbs_100g', 'carboidrati_100g', 'carbohydrates', 'carboidrati', 'available_carbohydrates', 'carbs_g']));
  const fat = toNumberSafe(pickValue(row, ['fat_100g', 'fats_100g', 'grassi_100g', 'fat', 'grassi', 'lipids', 'fat_g']));

  // skip rows with absolutely no nutritional data
  if (!kcal && !proteins && !carbs && !fat) return null;

  return {
    code,
    barcodes: barcodes.join('|'),
    product_name_it: name,
    product_name: pickValue(row, ['product_name', 'food_name', 'name', 'title', 'product_name_it']) || name,
    brands: pickValue(row, ['brands', 'brand', 'brand_name', 'brand_owner', 'marca']),
    food_category: pickValue(row, ['categories_en', 'main_category_en', 'food_category', 'category', 'food_type']),
    nutriscore_grade: normalizeNutriScore(pickValue(row, ['nutriscore_grade', 'nutriscore', 'nutri_score_grade'])),
    health_score: toNumberSafe(pickValue(row, ['health_score'])),
    energy_kcal_100g: kcal,
    proteins_100g: proteins,
    carbohydrates_100g: carbs,
    sugars_100g: toNumberSafe(pickValue(row, ['sugars_100g', 'zuccheri_100g', 'sugars', 'zuccheri', 'soluble_sugars', 'sugar_g'])),
    fat_100g: fat,
    saturated_fat_100g: toNumberSafe(pickValue(row, ['saturated-fat_100g', 'saturated_fat_100g', 'grassi_saturi_100g', 'saturated_fat', 'grassi_saturi', 'saturated_fat_g'])),
    fiber_100g: toNumberSafe(pickValue(row, ['fiber_100g', 'fibre_100g', 'fibra_100g', 'fiber', 'fibre', 'fibra', 'total_fiber', 'fiber_g'])),
    salt_100g: toNumberSafe(pickValue(row, ['salt_100g', 'salt'])),
    sodium_100g: toNumberSafe(pickValue(row, ['sodium_100g', 'sodium'])),
    sodium_mg_100g: toNumberSafe(pickValue(row, ['sodium_mg_100g', 'sodium_mg'])),
    calcium_mg_100g: toNumberSafe(pickValue(row, ['calcium_mg_100g', 'calcium_mg'])),
    iron_mg_100g: toNumberSafe(pickValue(row, ['iron_mg_100g', 'iron_mg']))
  };
}

// Split a single CSV line respecting quoted fields (no embedded newlines assumed)
function splitLine(line, delimiter) {
  const result = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cell += '"'; i += 1; }
      else inQuotes = !inQuotes;
    } else if (!inQuotes && ch === delimiter) {
      result.push(cell); cell = '';
    } else {
      cell += ch;
    }
  }
  result.push(cell);
  return result;
}

function buildRows(rows) {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  const mapped = [];
  const seenCodes = new Set();

  for (let i = 1; i < rows.length; i += 1) {
    const rawRow = rows[i];
    const rowObject = {};
    headers.forEach((header, idx) => {
      if (!header) return;
      rowObject[header] = rawRow[idx] != null ? String(rawRow[idx]).trim() : '';
    });
    const product = mapRow(rowObject);
    if (!product || seenCodes.has(product.code)) continue;
    seenCodes.add(product.code);
    mapped.push(product);
  }
  return mapped;
}

// Streaming processor for large files (> 150 MB): reads line-by-line
async function buildRowsStreaming(inputPath, delimiter, maxProducts) {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath, { encoding: 'utf8' }),
    crlfDelay: Infinity
  });

  let lineNum = 0;
  let headers = null;
  const products = [];
  const seenCodes = new Set();
  let totalLines = 0;

  for await (const rawLine of rl) {
    totalLines += 1;
    const line = lineNum === 0
      ? (rawLine.charCodeAt(0) === 0xfeff ? rawLine.slice(1) : rawLine)
      : rawLine;

    if (lineNum === 0) {
      headers = line.split(delimiter).map(normalizeHeader);
      lineNum += 1;
      continue;
    }

    const values = splitLine(line, delimiter);
    const rowObject = {};
    headers.forEach((h, i) => {
      if (h) rowObject[h] = values[i] != null ? String(values[i]).trim() : '';
    });

    const product = mapRow(rowObject);
    if (product && !seenCodes.has(product.code)) {
      seenCodes.add(product.code);
      products.push(product);
      if (maxProducts && products.length >= maxProducts) break;
    }

    lineNum += 1;

    if (lineNum % 100000 === 0) {
      process.stdout.write(`  … processed ${lineNum.toLocaleString()} lines, ${products.length.toLocaleString()} products so far\r`);
    }
  }

  process.stdout.write('\n');
  return { products, rowCount: totalLines };
}

async function main() {
  const args = process.argv.slice(2);
  const maxIdx = args.indexOf('--max');
  const maxProducts = maxIdx !== -1 ? parseInt(args[maxIdx + 1], 10) : 0;
  const positional = args.filter((a) => !a.startsWith('--') && a !== String(maxProducts));

  const [inputPathArg, outputPathArg] = positional;
  if (!inputPathArg) {
    console.log('Usage: node scripts/kaggle-csv-to-json.js <input.csv> [output.json] [--max N]');
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), inputPathArg);
  const outputPath = outputPathArg
    ? path.resolve(process.cwd(), outputPathArg)
    : path.resolve(process.cwd(), 'data', 'kaggle-products.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`Input CSV not found: ${inputPath}`);
    process.exit(1);
  }

  const fileSizeMB = fs.statSync(inputPath).size / (1024 * 1024);
  const LARGE_THRESHOLD_MB = 150;
  const raw = fileSizeMB <= LARGE_THRESHOLD_MB ? stripBom(fs.readFileSync(inputPath, 'utf8')) : null;
  const delimiter = raw ? detectDelimiter(raw) : detectDelimiter(stripBom(fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' }).slice(0, 4096)));

  console.log(`File size: ${fileSizeMB.toFixed(1)} MB`);
  console.log(`Delimiter: ${delimiter === '\t' ? 'TAB' : delimiter}`);
  console.log(`Mode: ${fileSizeMB > LARGE_THRESHOLD_MB ? 'streaming (large file)' : 'in-memory'}`);
  if (maxProducts) console.log(`Max products: ${maxProducts.toLocaleString()}`);

  let products;
  let rowCount;

  if (fileSizeMB > LARGE_THRESHOLD_MB) {
    const result = await buildRowsStreaming(inputPath, delimiter, maxProducts || 0);
    products = result.products;
    rowCount = result.rowCount;
  } else {
    const parsedRows = parseCsv(raw, delimiter);
    rowCount = parsedRows.length;
    const all = buildRows(parsedRows);
    products = maxProducts ? all.slice(0, maxProducts) : all;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');

  const withBarcodes = products.filter((p) => String(p.barcodes || '').trim().length > 0).length;
  const withNutri = products.filter((p) => String(p.nutriscore_grade || '').trim().length > 0).length;
  const withKcal = products.filter((p) => Number(p.energy_kcal_100g || 0) > 0).length;

  console.log(`Rows parsed: ${rowCount.toLocaleString()}`);
  console.log(`Products exported: ${products.length.toLocaleString()}`);
  console.log(`  with barcodes: ${withBarcodes.toLocaleString()}`);
  console.log(`  with nutriscore: ${withNutri.toLocaleString()}`);
  console.log(`  with kcal: ${withKcal.toLocaleString()}`);
  console.log(`Output: ${outputPath}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
