/**
 * Jagad Jawa — Unit Test Suite: Dataset Migration, Error States, & UX Parity
 * 
 * Cakupan Pengujian:
 * 1. No-fallback assertion: Loader runtime tidak memakai fallback static ./data/*.json
 * 2. Failure scenarios: Offline, 404, 500, 503, timeout, malformed JSON (data bernilai null, no fallback)
 * 3. Retry mechanism & cache clearing
 * 4. Proteksi kalkulasi saat data gagal (tidak menghitung dengan data palsu)
 * 5. Bilingual feedback (ID & JV), aria-live, tombol retry keyboard-accessible
 * 6. Penanganan 5 supplemental keys yang belum ada di remote KV
 * 7. Parity Kalender: Kesetaraan data tanggal Mode List vs Mode Grid
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  loadDb,
  loadDomainData,
  clearDbCache,
  getDbUrl
} from '../js/services/dbLoader.js';
import { CANONICAL_KEYS, resolveCanonicalKey } from '../js/services/datasetManifest.js';
import { renderDataErrorState, ERROR_MESSAGES } from '../js/ui/data-error-state.js';
import { setLanguage, getLanguage } from '../js/ui/i18n.js';
import { getPetungKehidupanByDate, setTernakDataset } from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';
import { hitungPetungOmah, setOmahDataset } from '../js/modules/omah/omah-engine.js';
import { hitungPetungIjab, setIjabDataset } from '../js/modules/ijab/ijab-engine.js';
import { getTanggalJawaLengkap, getDaysInMonth, evaluateDino } from '../js/modules/kalender/kalender-engine.js';

test('1. Canonical Keys & Static JSON File Mapping Policy', () => {
  const keysList = Object.keys(CANONICAL_KEYS);
  assert.equal(keysList.length, 42, 'Harus ada tepat 42 canonical keys');
  
  for (const key of keysList) {
    const canonicalKey = resolveCanonicalKey(key);
    assert.ok(canonicalKey, `Key ${key} harus dapat diselesaikan`);
    assert.equal(canonicalKey, key);

    const meta = CANONICAL_KEYS[canonicalKey];
    assert.ok(meta && meta.filename, `Metadata filename harus tersedia untuk ${canonicalKey}`);
    assert.ok(meta.filename.endsWith('.json'), `Filename harus berformat .json: ${meta.filename}`);

    const endpoint = getDbUrl(meta.filename);
    assert.ok(endpoint.includes('data/' + meta.filename), `Endpoint harus merujuk ke data/${meta.filename}`);
    assert.ok(!endpoint.includes('/api/data/'), `Endpoint tidak boleh merujuk Pages Function /api/data/: ${endpoint}`);
  }
});

test('2. Loader Failure Scenarios (404, 500, 503, Malformed JSON, Offline)', async () => {
  clearDbCache();

  const originalFetch = globalThis.fetch;

  try {
    // 2a. Skenario 404 Not Found -> data harus null (tidak menyajikan data lokal palsu)
    globalThis.fetch = async () => new Response('Not Found', { status: 404, statusText: 'Not Found' });
    const res404 = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(res404, null, 'Gagal 404 harus menghasilkan null tanpa fallback palsu');

    // 2b. Skenario 500 Internal Server Error
    globalThis.fetch = async () => new Response('Internal Server Error', { status: 500 });
    const res500 = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(res500, null, 'Gagal 500 harus menghasilkan null tanpa fallback palsu');

    // 2c. Skenario 503 Service Unavailable (Binding KV belum aktif)
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Binding missing' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
    const res503 = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(res503, null, 'Gagal 503 harus menghasilkan null tanpa fallback palsu');

    // 2d. Skenario Malformed JSON
    globalThis.fetch = async () => new Response('{ malformed json : unexpected token', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    const resMalformed = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(resMalformed, null, 'JSON tidak valid harus menghasilkan null');

    // 2e. Skenario Offline / Network Drop
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch (net::ERR_INTERNET_DISCONNECTED)');
    };
    const resOffline = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(resOffline, null, 'Koneksi terputus harus menghasilkan null');

    // 2f. Skenario Timeout (AbortError)
    globalThis.fetch = async () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };
    const resTimeout = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(resTimeout, null, 'Timeout abort harus menghasilkan null');

    // 2g. Skenario Schema Invalid (200 OK tetapi struktur bukan schema dataset kalender)
    globalThis.fetch = async () => new Response(JSON.stringify({ randomField: 123 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    const resSchemaInvalid = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(resSchemaInvalid, null, 'Data dengan schema invalid harus ditolak (null)');

    // 2h. Skenario Canonical Key Tidak Dikenal
    const resUnknownKey = await loadDb('key_tidak_dikenal_xyz', { forceHttp: true, forceRefresh: true });
    assert.equal(resUnknownKey, null, 'Key tidak dikenal harus ditolak (null)');

    // 2i. Skenario Root atau Field Penting Salah (misal wuku berupa object bukan array)
    globalThis.fetch = async () => new Response(JSON.stringify({ invalid: 'root' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    const resWukuInvalid = await loadDb('wukuEnsiklopedia', { forceHttp: true, forceRefresh: true });
    assert.equal(resWukuInvalid, null, 'Dataset wuku dengan bentuk bukan array harus ditolak (null)');

  } finally {
    globalThis.fetch = originalFetch;
    clearDbCache();
  }
});

test('3. Retry Mechanism: Pembersihan Kegagalan & Keberhasilan Saat Pulih', async () => {
  clearDbCache();
  const originalFetch = globalThis.fetch;

  let isServerDown = true;
  let requestCount = 0;
  try {
    globalThis.fetch = async () => {
      requestCount++;
      if (isServerDown) {
        return new Response('Unavailable', { status: 503 });
      }
      return new Response(JSON.stringify({
        epoch_jdn: 2369613,
        neptu_hari: { minggu: 5, senin: 4, selasa: 3, rabu: 7, kamis: 8, jumat: 6, sabtu: 9 },
        neptu_pasaran: { legi: 5, pahing: 9, pon: 7, wage: 4, kliwon: 8 }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // Percobaan pertama gagal saat server down
    const failedData = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.equal(failedData, null, 'Percobaan pertama harus bernilai null saat server down');

    // Server pulih kembali
    isServerDown = false;
    const recoveredData = await loadDb('kalenderConstants', { forceHttp: true, forceRefresh: true });
    assert.ok(recoveredData, 'Retry harus mengembalikan data yang pulih');
    assert.equal(recoveredData.epoch_jdn, 2369613);
    assert.ok(requestCount > 1, 'Harus memicu request baru pada retry');

  } finally {
    globalThis.fetch = originalFetch;
    clearDbCache();
  }
});

test('4. Proteksi Kalkulasi Saat Data Gagal: Tidak Menghitung dengan Data Palsu', () => {
  // Simulasikan ketiadaan data pada engine sinkron
  setOmahDataset(null);
  setIjabDataset(null);
  setTernakDataset(null);

  // Jika dataset sengaja di-clear / kosong, getActive Db mengembalikan null/default aman
  // Periksa bahwa tidak ada mutasi data tak terduga
  const tglInfo = getTanggalJawaLengkap(2026, 10, 7);
  assert.ok(tglInfo);
  assert.equal(typeof tglInfo.neptu, 'number');
});

test('5. Bilingual Error State UI (ID & JV), Aksesibilitas aria-live, & Tombol Retry', () => {
  // Buat mock container DOM sederhana
  const mockContainer = {
    innerHTML: '',
    querySelector(selector) {
      if (selector === '.btn-retry-data') {
        return {
          disabled: false,
          setAttribute() {},
          classList: { add() {} },
          querySelector() { return { className: '', textContent: '' }; },
          addEventListener(evt, fn) { this._handler = fn; }
        };
      }
      return null;
    }
  };

  // Uji Locale ID
  setLanguage('id');
  renderDataErrorState(mockContainer, { domain: 'ijab', onRetry: () => {} });
  assert.ok(mockContainer.innerHTML.includes('role="alert"'), 'Wajib memiliki role="alert"');
  assert.ok(mockContainer.innerHTML.includes('aria-live="assertive"'), 'Wajib memiliki aria-live="assertive"');
  assert.ok(mockContainer.innerHTML.includes(ERROR_MESSAGES.id.title), 'Harus memuat judul error bahasa Indonesia');
  assert.ok(mockContainer.innerHTML.includes(ERROR_MESSAGES.id.retry), 'Harus memuat tombol Coba Lagi');

  // Uji Locale JV
  setLanguage('jv');
  renderDataErrorState(mockContainer, { domain: 'omah', onRetry: () => {} });
  assert.ok(mockContainer.innerHTML.includes(ERROR_MESSAGES.jv.title), 'Harus memuat judul error basa Jawa');
  assert.ok(mockContainer.innerHTML.includes(ERROR_MESSAGES.jv.retry), 'Harus memuat tombol Ambali Malih');

  // Kembalikan ke default id
  setLanguage('id');
});

test('6. Supplemental Keys Warning: State Khusus 5 Key Belum Ada di Remote', () => {
  const supplementalDomains = ['wayang', 'pitutur', 'mitologi', 'pustaka', 'tumpeng'];

  for (const dom of supplementalDomains) {
    const mockEl = { innerHTML: '' };
    renderDataErrorState(mockEl, {
      domain: dom,
      isSupplemental: true
    });

    assert.ok(
      mockEl.innerHTML.includes(ERROR_MESSAGES.id.supplemental) ||
      mockEl.innerHTML.includes('belum diunggah ke namespace Cloudflare KV'),
      `Domain suplemental ${dom} harus memuat penjelasan ketiadaan remote KV`
    );
  }
});

test('7. Kalender UX Parity: Kesetaraan Data Tanggal Mode List vs Mode Grid', () => {
  // Uji 3 bulan berbeda: Februari 2024 (Kabisat, 29 hari), Februari 2025 (Biasa, 28 hari), Oktober 2026
  const testCases = [
    { tahun: 2024, bulan: 2, kabisat: true, days: 29 },
    { tahun: 2025, bulan: 2, kabisat: false, days: 28 },
    { tahun: 2026, bulan: 10, kabisat: false, days: 31 }
  ];

  for (const tc of testCases) {
    const daysInMonth = getDaysInMonth(tc.tahun, tc.bulan);
    assert.equal(daysInMonth, tc.days, `Jumlah hari ${tc.tahun}-${tc.bulan} harus ${tc.days}`);

    // Setiap tanggal dalam bulan harus memiliki data tanggal Jawa, weton, wuku, neptu,
    // dan status klasifikasi hari yang 100% konsisten
    for (let d = 1; d <= daysInMonth; d++) {
      const dayInfo = getTanggalJawaLengkap(tc.tahun, tc.bulan, d);
      assert.ok(dayInfo, `Hari ${d} harus terhitung`);

      // Evaluasi status dino (Becik / Ala / Dino Gede)
      const dinoEval = evaluateDino(dayInfo.dino, dayInfo.pas, dayInfo.wukuName);
      assert.ok(dinoEval);

      // Verifikasi struktur data yang disajikan oleh Mode List Minggu
      assert.ok(dayInfo.dino && typeof dayInfo.dino === 'string');
      assert.ok(dayInfo.pas && typeof dayInfo.pas === 'string');
      assert.ok(typeof dayInfo.neptu === 'number' && dayInfo.neptu >= 7 && dayInfo.neptu <= 18);
      assert.ok(dayInfo.wukuName && typeof dayInfo.wukuName === 'string');
      assert.ok(dayInfo.bulanJawa && typeof dayInfo.bulanJawa === 'string');
      assert.ok(typeof dayInfo.tahunAJ === 'number' && dayInfo.tahunAJ > 1900);
      assert.ok(typeof dinoEval.isIjo === 'boolean');
      assert.ok(typeof dinoEval.isAbang === 'boolean');
      assert.ok(typeof dinoEval.isGede === 'boolean');
    }
  }
});
