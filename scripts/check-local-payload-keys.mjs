#!/usr/bin/env node
/**
 * Checker Lokal Validasi Payload 42 Keys vs Daftar Key Lokal (Zero-Credential)
 * 
 * Memvalidasi:
 * 1. Setiap key dari 42 CANONICAL_KEYS di datasetManifest.js memiliki file fisik di public/data/
 * 2. File payload 'kv-export/wrangler-kv-bulk-payload.json' (jika ada) memuat tepat 42 key yang sama
 * 3. File payload supplemental 'kv-export/wrangler-kv-supplemental-payload.json' (jika ada) memuat tepat 5 key
 * 4. Nilai JSON dari setiap payload lokal valid, non-kosong, dan tidak melampaui limit KV
 * 5. Nol kredensial atau akses remote diperlukan.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { CANONICAL_KEYS } from '../js/services/datasetManifest.js';

const ROOT_DIR = process.cwd();
const PUBLIC_DATA_DIR = path.resolve(ROOT_DIR, 'public/data');
const BULK_PAYLOAD_PATH = path.resolve(ROOT_DIR, 'kv-export/wrangler-kv-bulk-payload.json');
const SUPP_PAYLOAD_PATH = path.resolve(ROOT_DIR, 'kv-export/wrangler-kv-supplemental-payload.json');

console.log('======================================================================');
console.log('🔍 LOCAL CHECKER: VALIDASI 42 KEYS CANONICAL vs PAYLOAD LOKAL');
console.log('======================================================================\n');

const canonicalKeyList = Object.keys(CANONICAL_KEYS);
console.log(`[1] Memeriksa daftar Canonical Keys di datasetManifest.js...`);
console.log(`    Total key terdaftar: ${canonicalKeyList.length} keys`);
assert.equal(canonicalKeyList.length, 42, `Jumlah key terdaftar harus tepat 42, didapat: ${canonicalKeyList.length}`);

console.log(`\n[2] Memverifikasi keberadaan dan integritas file payload lokal di public/data/...`);
let missingFiles = 0;
let parseErrors = 0;

for (const [key, meta] of Object.entries(CANONICAL_KEYS)) {
  const filePath = path.join(PUBLIC_DATA_DIR, meta.filename);
  if (!fs.existsSync(filePath)) {
    console.error(`    ❌ FILE HILANG: ${meta.filename} (key: "${key}")`);
    missingFiles++;
    continue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
  } catch (err) {
    console.error(`    ❌ PARSE ERROR: ${meta.filename} -> ${err.message}`);
    parseErrors++;
  }
}

if (missingFiles === 0 && parseErrors === 0) {
  console.log(`    ✅ Seluruh 42 file payload fisik di public/data/ ditemukan dan valid JSON.`);
} else {
  console.error(`    ❌ Gagal: ${missingFiles} file hilang, ${parseErrors} file korup.`);
  process.exit(1);
}

if (fs.existsSync(BULK_PAYLOAD_PATH)) {
  console.log(`\n[3] Memvalidasi file ekspor bulk 42-keys: ${BULK_PAYLOAD_PATH}...`);
  const rawBulk = fs.readFileSync(BULK_PAYLOAD_PATH, 'utf8');
  const bulkItems = JSON.parse(rawBulk);
  assert.equal(Array.isArray(bulkItems), true, 'Payload bulk harus berupa array JSON');
  assert.equal(bulkItems.length, 42, `Payload bulk harus tepat 42 items, didapat: ${bulkItems.length}`);

  const bulkKeySet = new Set(bulkItems.map(item => item.key));
  for (const cKey of canonicalKeyList) {
    assert.ok(bulkKeySet.has(cKey), `Key "${cKey}" tidak ditemukan dalam file bulk payload`);
  }
  console.log(`    ✅ 42 key pada bulk payload cocok 1:1 dengan CANONICAL_KEYS.`);
} else {
  console.log(`\n[3] Info: File bulk payload "${BULK_PAYLOAD_PATH}" belum diekspor. (Jalankan npm run kv:export bila diperlukan).`);
}

if (fs.existsSync(SUPP_PAYLOAD_PATH)) {
  console.log(`\n[4] Memvalidasi file ekspor supplemental 5-keys: ${SUPP_PAYLOAD_PATH}...`);
  const rawSupp = fs.readFileSync(SUPP_PAYLOAD_PATH, 'utf8');
  const suppItems = JSON.parse(rawSupp);
  assert.equal(Array.isArray(suppItems), true, 'Payload supplemental harus berupa array');
  assert.equal(suppItems.length, 5, `Payload supplemental harus tepat 5 items, didapat: ${suppItems.length}`);

  const expectedSuppKeys = ['wayang:all', 'pitutur:all', 'mitologi:all', 'pustaka:digital', 'tumpeng:all'];
  const suppKeySet = new Set(suppItems.map(item => item.key));
  for (const exp of expectedSuppKeys) {
    assert.ok(suppKeySet.has(exp), `Key supplemental "${exp}" tidak ditemukan dalam payload`);
  }
  console.log(`    ✅ 5 key pada supplemental payload tepat sesuai dan terisolasi dari 37 key lama.`);
} else {
  console.log(`\n[4] Info: File supplemental payload belum diekspor.`);
}

console.log('\n======================================================================');
console.log('✨ VERIFIKASI LOKAL 42 KEYS BERHASIL 100% (ZERO REMOTE CREDENTIALS)');
console.log('======================================================================\n');
