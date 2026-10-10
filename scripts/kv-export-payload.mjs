/**
 * Jagad Jawa — Idempotent KV Export & Dry-Run Payload Tool
 * 
 * Fungsi:
 * 1. Membaca seluruh dataset JSON canonical dari public/data/.
 * 2. Memvalidasi parsing JSON, integritas data, dan batasan ukuran Cloudflare KV (maks 25 MB per nilai).
 * 3. Menghasilkan payload format resmi Wrangler bulk put:
 *    [{"key":"canonical-key","value":"JSON-serialized-string"}]
 * 4. Menyimpan payload ke folder gitignored 'kv-export/'.
 * 5. Melakukan Dry-Run lengkap: total keys, byte size per key, checksum SHA-256, dan validasi duplikasi.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { CANONICAL_KEYS } from '../js/services/datasetManifest.js';

const EXPORT_DIR = path.resolve(process.cwd(), 'kv-export');
const DATA_DIR = path.resolve(process.cwd(), 'public/data');
const MAX_KV_VALUE_BYTES = 25 * 1024 * 1024; // Limit 25 MB Cloudflare KV
const MAX_BULK_PAYLOAD_BYTES = 100 * 1024 * 1024; // 100 MB bulk batch threshold

console.log('═════════════════════════════════════════════════════════════════════════');
console.log('🚀 JAGAD JAWA — CLOUDFLARE KV BULK PAYLOAD EXPORTER & DRY-RUN');
console.log('═════════════════════════════════════════════════════════════════════════\n');

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

const isDryRun = process.argv.includes('--dry-run');
const entries = Object.entries(CANONICAL_KEYS);

console.log(`📋 Total Canonical Keys Terdaftar: ${entries.length}`);
console.log(`📁 Sumber Data: ${DATA_DIR}`);
console.log(`💾 Direktori Target: ${EXPORT_DIR}\n`);

const payload = [];
const tableAudit = [];
const seenKeys = new Set();
let totalPayloadBytes = 0;
let hasError = false;

for (const [canonicalKey, meta] of entries) {
  if (seenKeys.has(canonicalKey)) {
    console.error(`❌ DUPLICATE KEY DETECTED: "${canonicalKey}"`);
    hasError = true;
    continue;
  }
  seenKeys.add(canonicalKey);

  const filePath = path.join(DATA_DIR, meta.filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ FILE TIDAK DITEMUKAN: ${filePath} untuk key "${canonicalKey}"`);
    hasError = true;
    continue;
  }

  try {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    // Validasi parse JSON
    const parsedData = JSON.parse(rawContent);

    // Hitung SHA-256 dari raw content
    const sha256 = crypto.createHash('sha256').update(rawContent).digest('hex');
    
    // Serialisasi string compact untuk KV value
    const serializedValue = JSON.stringify(parsedData);
    const valueBytes = Buffer.byteLength(serializedValue, 'utf8');

    if (valueBytes > MAX_KV_VALUE_BYTES) {
      console.error(`❌ UKURAN MELEBIHI LIMIT KV (25MB): ${canonicalKey} (${valueBytes} bytes)`);
      hasError = true;
      continue;
    }

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
  } catch (parseErr) {
    console.error(`❌ PARSE ERROR pada ${meta.filename} (key: "${canonicalKey}"):`, parseErr.message);
    hasError = true;
  }
}

console.table(tableAudit);

console.log('─────────────────────────────────────────────────────────────────────────');
console.log(`📊 RINGKASAN DRY-RUN:`);
console.log(`   • Jumlah Key Berhasil Diproses : ${payload.length} / ${entries.length}`);
console.log(`   • Total Ukuran Payload Bersih : ${(totalPayloadBytes / 1024).toFixed(2)} KB (${totalPayloadBytes} bytes)`);
console.log(`   • Status Ambang Batas Bulk    : ${totalPayloadBytes < MAX_BULK_PAYLOAD_BYTES ? '✅ AMAN (< 100 MB)' : '⚠️ MELEBIHI'}`);
console.log('─────────────────────────────────────────────────────────────────────────\n');

console.log('⚠️ PERINGATAN INTEGRITAS NAMESPACE:');
console.log('   Payload 42-key ini dimaksudkan HANYA untuk backup lokal, verifikasi schema penuh, atau');
console.log('   inisialisasi namespace baru yang masih kosong.');
console.log('   JANGAN mengunggah payload 42-key ini ke remote namespace yang sudah berisi 37 key lama,');
console.log('   karena operasi bulk put akan MENIMPA (overwrite) seluruh record 37 key lama tersebut.');
console.log('   Untuk menambahkan data baru tanpa menimpa key lama, gunakan: npm run kv:export:supplemental\n');

if (hasError) {
  console.error('❌ Terjadi kesalahan validasi. Payload TIDAK diekspor.');
  process.exit(1);
}

const payloadFilePath = path.join(EXPORT_DIR, 'wrangler-kv-bulk-payload.json');
fs.writeFileSync(payloadFilePath, JSON.stringify(payload, null, 2), 'utf8');

console.log(`✅ File payload bulk put berhasil ditulis secara idempotent:`);
console.log(`   👉 ${payloadFilePath} (${(fs.statSync(payloadFilePath).size / 1024).toFixed(2)} KB)\n`);

console.log('💡 DOKUMENTASI POWERSHELL (VERIFIKASI & DRY-RUN LOKAL):');
console.log('   # 1. Verifikasi lokal tanpa upload:');
console.log('   node scripts/check-local-payload-keys.mjs');
console.log('   # 2. Untuk penambahan key supplemental ke remote yang sudah ada (5 keys saja):');
console.log('   npm run kv:dry-run:supplemental');
console.log('   # 3. JANGAN jalankan upload bulk 42 key ke remote yang aktif dengan 37 key.\n');
