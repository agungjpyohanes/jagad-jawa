/**
 * Jagad Jawa — Supplemental-Only KV Export & Dry-Run Payload Tool
 * 
 * Khusus mengekspor 5 key baru:
 * 1. wayang:all
 * 2. pitutur:all
 * 3. mitologi:all
 * 4. pustaka:digital
 * 5. tumpeng:all
 * 
 * BATASAN KETAT:
 * - Tidak boleh memuat 37 key lama yang sudah ada di remote JAGAD_JAWA_DATA.
 * - Memiliki assertions ketat untuk menjamin tepat 5 key supplemental dan 0 key lama.
 * - Format output: [{"key":"canonical-key","value":"JSON-serialized-string"}]
 * - Lokasi output: kv-export/wrangler-kv-supplemental-payload.json
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import assert from 'assert';
import { CANONICAL_KEYS } from '../js/services/datasetManifest.js';

const EXPORT_DIR = path.resolve(process.cwd(), 'kv-export');
const DATA_DIR = path.resolve(process.cwd(), 'public/data');
const MAX_KV_VALUE_BYTES = 25 * 1024 * 1024; // 25 MB Cloudflare KV limit

export const SUPPLEMENTAL_KEYS = [
  'wayang:all',
  'pitutur:all',
  'mitologi:all',
  'pustaka:digital',
  'tumpeng:all'
];

export const OLD_37_KEYS = [
  'kalender:constants',
  'wuku:ensiklopedia',
  'bincil:arti',
  'dino:rules',
  'pranata:mangsa',
  'bincil:matrix',
  'zodiak:all',
  'sasi:jawa',
  'shio:wuxing',
  'pasaran:watak',
  'perjodohan:pitung',
  'karakter:dasar',
  'pekerjaan:weton',
  'selametan:rules',
  'ijab:all',
  'perjodohan:pitung-alt',
  'aksara:perjodohan',
  'selametan:rules-alt',
  'ijab:alt',
  'sasmitha:all',
  'petung:tetanen',
  'petung:ternak',
  'omah:all',
  'wuku:petenget',
  'siklus:padewan',
  'palenggahan:all',
  'bincil:arti-bilingual',
  'marriage:hasil-bilingual',
  'sasi:jawa-alt',
  'aksara:nglegena',
  'dino:gede',
  'sirikan:adhep',
  'kamus:jawa',
  'kamus:sanskerta',
  'pustaka:dongo',
  'pustaka:jawa',
  'sinengker:khusus'
];

console.log('═════════════════════════════════════════════════════════════════════════');
console.log('🚀 JAGAD JAWA — SUPPLEMENTAL-ONLY KV EXPORTER & DRY-RUN (5 KEYS)');
console.log('═════════════════════════════════════════════════════════════════════════\n');

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

// 1. Verifikasi definisi key
const old37Set = new Set(OLD_37_KEYS);
assert.strictEqual(OLD_37_KEYS.length, 37, 'Daftar OLD_37_KEYS harus tepat 37 key.');
assert.strictEqual(SUPPLEMENTAL_KEYS.length, 5, 'Daftar SUPPLEMENTAL_KEYS harus tepat 5 key.');

// Pastikan tidak ada overlap sama sekali
for (const suppKey of SUPPLEMENTAL_KEYS) {
  assert(!old37Set.has(suppKey), `PELANGGARAN: Supplemental key "${suppKey}" terdapat di 37 key lama!`);
}

console.log(`📋 Target Supplemental Keys : ${SUPPLEMENTAL_KEYS.length} keys`);
console.log(`🛡️ Assertion Guard          : 37 key lama diblokir penuh dari payload ini.`);
console.log(`📁 Sumber Data              : ${DATA_DIR}`);
console.log(`💾 Direktori Target          : ${EXPORT_DIR}\n`);

const payload = [];
const tableAudit = [];
let totalPayloadBytes = 0;

const seenSuppKeys = new Set();
for (const canonicalKey of SUPPLEMENTAL_KEYS) {
  assert(!seenSuppKeys.has(canonicalKey), `DUPLIKAT KEY TERDETEKSI: "${canonicalKey}"`);
  seenSuppKeys.add(canonicalKey);

  const meta = CANONICAL_KEYS[canonicalKey];
  assert(meta, `Key supplemental "${canonicalKey}" harus terdaftar di CANONICAL_KEYS.`);

  const filePath = path.join(DATA_DIR, meta.filename);
  assert(fs.existsSync(filePath), `File tidak ditemukan: ${filePath}`);

  const rawContent = fs.readFileSync(filePath, 'utf8');
  assert(rawContent && rawContent.trim().length > 0, `File tidak boleh kosong: ${filePath}`);

  const parsedData = JSON.parse(rawContent);
  assert(parsedData !== null && typeof parsedData === 'object', `Schema dasar tidak valid: ${canonicalKey}`);

  // Schema assert per supplemental key
  if (canonicalKey === 'wayang:all') {
    assert(Array.isArray(parsedData) || Array.isArray(parsedData.wayang_list), `Schema wayang:all harus berupa array atau memiliki wayang_list`);
  } else if (canonicalKey === 'pitutur:all') {
    assert(Array.isArray(parsedData) || Array.isArray(parsedData.pitutur_list), `Schema pitutur:all harus berupa array atau memiliki pitutur_list`);
  } else if (canonicalKey === 'mitologi:all') {
    assert(typeof parsedData === 'object', `Schema mitologi:all harus berupa object/array`);
  } else if (canonicalKey === 'pustaka:digital') {
    assert(typeof parsedData === 'object', `Schema pustaka:digital harus berupa object`);
  } else if (canonicalKey === 'tumpeng:all') {
    assert(Array.isArray(parsedData) || typeof parsedData === 'object', `Schema tumpeng:all harus berupa array/object`);
  }

  const sha256 = crypto.createHash('sha256').update(rawContent).digest('hex');
  assert.strictEqual(sha256.length, 64, `SHA-256 hash harus valid 64 hex characters: ${canonicalKey}`);

  const serializedValue = JSON.stringify(parsedData);
  const valueBytes = Buffer.byteLength(serializedValue, 'utf8');

  assert(valueBytes > 0, `Nilai serialized tidak boleh 0 byte: ${canonicalKey}`);
  assert(valueBytes <= MAX_KV_VALUE_BYTES, `Ukuran melebihi limit KV: ${canonicalKey}`);
  totalPayloadBytes += valueBytes;

  payload.push({
    key: canonicalKey,
    value: serializedValue
  });

  tableAudit.push({
    Key: canonicalKey,
    File: meta.filename,
    Bytes: valueBytes,
    'SHA-256 (Depan..Belakang)': `${sha256.slice(0, 8)}...${sha256.slice(-6)}`
  });
}

console.table(tableAudit);

// ASSERTIONS SEBELUM PENULISAN FILE
assert.strictEqual(payload.length, 5, 'Payload supplemental HARUS tepat 5 key.');
for (const item of payload) {
  assert(!old37Set.has(item.key), `ASSERTION FAILED: Key lama "${item.key}" ditemukan dalam payload supplemental!`);
  assert(SUPPLEMENTAL_KEYS.includes(item.key), `ASSERTION FAILED: Key "${item.key}" bukan bagian dari SUPPLEMENTAL_KEYS!`);
}

const isDryRun = process.argv.includes('--dry-run');

console.log('─────────────────────────────────────────────────────────────────────────');
console.log(`📊 RINGKASAN SUPPLEMENTAL DRY-RUN:`);
console.log(`   • Jumlah Key Diproses       : ${payload.length} / 5`);
console.log(`   • Key Lama Terdeteksi       : 0 (Terverifikasi Bersih via Assertion)`);
console.log(`   • Total Ukuran Nilai KV     : ${(totalPayloadBytes / 1024).toFixed(2)} KB (${totalPayloadBytes} bytes)`);
console.log('─────────────────────────────────────────────────────────────────────────\n');

const payloadFilePath = path.join(EXPORT_DIR, 'wrangler-kv-supplemental-payload.json');
if (!isDryRun) {
  fs.writeFileSync(payloadFilePath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`✅ File payload supplemental berhasil ditulis:`);
  console.log(`   👉 ${payloadFilePath} (${(fs.statSync(payloadFilePath).size / 1024).toFixed(2)} KB)\n`);
} else {
  console.log(`ℹ️ Mode Dry-Run aktif: File ${payloadFilePath} diverifikasi dan tidak diubah.\n`);
}

console.log('💡 DOKUMENTASI POWERSHELL OLEH PEMILIK (PILIHAN MANUAL):');
console.log('   # 1. Pastikan terautentikasi dan periksa namespace ID');
console.log('   npx wrangler kv namespace list');
console.log('');
console.log('   # 2. [MANUAL OWNER PENDING] Unggah HANYA 5 key supplemental tanpa menyentuh 37 key lama:');
console.log('   npx wrangler kv bulk put kv-export/wrangler-kv-supplemental-payload.json --namespace-id <KV_NAMESPACE_ID> --remote');
console.log('');
console.log('   # 3. Verifikasi salah satu key supplemental yang baru:');
console.log('   npx wrangler kv key get "wayang:all" --namespace-id <KV_NAMESPACE_ID> --remote --text');
console.log('');
