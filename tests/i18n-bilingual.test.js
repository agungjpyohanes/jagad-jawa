/**
 * Jagad Jawa — Unit Test: Arsitektur Kamus Terpusat & Sistem Bilingual Penuh (ID/JV)
 * Memverifikasi:
 *   1. Keberadaan dan integritas modul kamus terpusat di src/locales/id.js dan src/locales/jv.js
 *   2. Konsistensi kunci (100% key parity) antara kamus ID dan JV (tidak ada key tertinggal)
 *   3. Aturan Ketat Pemilihan Bahasa (Strict Bilingual): Mode ID Bahasa Indonesia, Mode JV Basa Jawi
 *   4. Integrasi State localStorage ('app_language' = 'id' | 'jv') & Sinkronisasi <html lang>
 *   5. Interoperabilitas fungsi i18n (t, getLanguage, setLanguage, toggleLanguage, getBilingualText)
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { id } from '../src/locales/id.js';
import { jv } from '../src/locales/jv.js';
import {
  DICTIONARY,
  NAV_DICTIONARY,
  CONTENT_DICTIONARY,
  getLanguage,
  setLanguage,
  toggleLanguage,
  applyLanguage,
  t,
  getBilingualText,
  resolveBilingualRecord,
  STORAGE_KEY,
  STORAGE_KEY_LEGACY
} from '../js/ui/i18n.js';

describe('Sistem Bilingual Penuh (100% ID vs 100% JV) & Arsitektur Kamus Terpusat', () => {
  beforeEach(() => {
    // Reset bahasa aktif ke 'id'
    setLanguage('id');
  });

  test('1. Integritas Modul Kamus Terpusat (src/locales/id.js & src/locales/jv.js)', () => {
    assert.ok(id && typeof id === 'object', 'src/locales/id.js harus mengekspor objek kamus');
    assert.ok(jv && typeof jv === 'object', 'src/locales/jv.js harus mengekspor objek kamus');

    const idKeys = Object.keys(id);
    const jvKeys = Object.keys(jv);

    assert.ok(idKeys.length > 250, `Kamus ID harus memiliki lebih dari 250 entri (aktual: ${idKeys.length})`);
    assert.ok(jvKeys.length > 250, `Kamus JV harus memiliki lebih dari 250 entri (aktual: ${jvKeys.length})`);
  });

  test('2. Konsistensi Kunci 100% (Key Parity) Antara Kamus ID dan JV', () => {
    const idKeys = Object.keys(id);
    const jvKeys = Object.keys(jv);

    const missingInJv = idKeys.filter(k => !(k in jv));
    const missingInId = jvKeys.filter(k => !(k in id));

    assert.deepEqual(missingInJv, [], 'Tidak boleh ada kunci ID yang tidak memiliki terjemahan di JV');
    assert.deepEqual(missingInId, [], 'Tidak boleh ada kunci JV yang tidak memiliki pasangan di ID');

    // Setiap nilai tidak boleh kosong (empty string)
    for (const key of idKeys) {
      assert.ok(id[key] && id[key].trim().length > 0, `Nilai ID untuk kunci "${key}" tidak boleh kosong`);
      assert.ok(jv[key] && jv[key].trim().length > 0, `Nilai JV untuk kunci "${key}" tidak boleh kosong`);
    }
  });

  test('3. Mode ID: 100% Bahasa Indonesia baku dengan pelestarian istilah budaya', () => {
    setLanguage('id');
    assert.strictEqual(getLanguage(), 'id');

    // Navigasi & menu
    assert.strictEqual(t('nav_beranda'), 'Beranda');
    assert.strictEqual(t('nav_kalender'), 'Kalender Jawa');
    assert.strictEqual(t('cal_btn_reset_today'), 'Hari Ini');
    assert.strictEqual(t('menu_card_kalender_title'), 'Kalender Jawa');
    assert.strictEqual(t('menu_card_nujum_title'), 'Nujum Kepribadian');
    assert.strictEqual(t('hero_status_gede'), 'Hari Besar (Sakral)');
    assert.strictEqual(t('hero_status_becik'), 'Hari Baik (Rahayu)');
    assert.strictEqual(t('hero_status_ala'), 'Hari Pantangan (Waspada)');

    // Form inputs
    assert.strictEqual(t('nujum_label_tgl_lahir'), 'Tanggal Lahir (Masehi)');
    assert.strictEqual(t('jodoh_label_status'), 'Status Hubungan Pasangan:');
    assert.strictEqual(t('selametan_warning_title'), 'Penting — Pergantian Hari Jawa:');
    assert.strictEqual(t('saya_pref_title'), 'Preferensi Tampilan & Bahasa');
  });

  test('4. Mode JV: 100% Basa Jawi Krama/Madya otentik', () => {
    setLanguage('jv');
    assert.strictEqual(getLanguage(), 'jv');

    // Navigasi & menu
    assert.strictEqual(t('nav_beranda'), 'Pambuka');
    assert.strictEqual(t('nav_kalender'), 'Kalendher Jawi');
    assert.strictEqual(t('cal_btn_reset_today'), 'Dinten Punika');
    assert.strictEqual(t('menu_card_kalender_title'), 'Kalendher Jawi');
    assert.strictEqual(t('menu_card_nujum_title'), 'Nujum Pribadhi');
    assert.strictEqual(t('hero_status_gede'), 'Dino Gede (Sakral)');
    assert.strictEqual(t('hero_status_becik'), 'Dina Becik (Rahayu)');
    assert.strictEqual(t('hero_status_ala'), 'Dina Awon (Prayitna)');

    // Form inputs
    assert.strictEqual(t('nujum_label_tgl_lahir'), 'Tanggal Miyos (Masehi)');
    assert.strictEqual(t('jodoh_label_status'), 'Status Sesambetan Pasangan:');
    assert.strictEqual(t('selametan_warning_title'), 'Wigati — Gantos Dina Jawi:');
    assert.strictEqual(t('saya_pref_title'), 'Preferensi Tampilan & Basa');
  });

  test('5. Integrasi Penyimpanan State localStorage (app_language = "id" | "jv")', () => {
    // Mode ID
    setLanguage('id');
    assert.strictEqual(getLanguage(), 'id');
    if (typeof localStorage !== 'undefined') {
      assert.strictEqual(localStorage.getItem(STORAGE_KEY), 'id');
      assert.strictEqual(localStorage.getItem(STORAGE_KEY_LEGACY), 'id');
    }

    // Toggle ke JV
    const switched = toggleLanguage();
    assert.strictEqual(switched, 'jv');
    assert.strictEqual(getLanguage(), 'jv');
    if (typeof localStorage !== 'undefined') {
      assert.strictEqual(localStorage.getItem(STORAGE_KEY), 'jv');
      assert.strictEqual(localStorage.getItem(STORAGE_KEY_LEGACY), 'jv');
    }

    // Toggle kembali ke ID
    const switchedBack = toggleLanguage();
    assert.strictEqual(switchedBack, 'id');
    assert.strictEqual(getLanguage(), 'id');
    if (typeof localStorage !== 'undefined') {
      assert.strictEqual(localStorage.getItem(STORAGE_KEY), 'id');
    }
  });

  test('6. Dynamic <html lang> Synchronization', () => {
    if (typeof document !== 'undefined' && document.documentElement) {
      setLanguage('id');
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'id');

      setLanguage('jv');
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'jv');
    }
  });

  test('7. Helper Dwibahasa (getBilingualText & resolveBilingualRecord)', () => {
    const bilingualData = {
      id: 'Selamat datang',
      jv: 'Sugeng rawuh'
    };

    setLanguage('id');
    assert.strictEqual(getBilingualText(bilingualData), 'Selamat datang');
    assert.strictEqual(getBilingualText(bilingualData, 'jv'), 'Sugeng rawuh');

    setLanguage('jv');
    assert.strictEqual(getBilingualText(bilingualData), 'Sugeng rawuh');
    assert.strictEqual(getBilingualText(bilingualData, 'id'), 'Selamat datang');

    // Nested record resolution
    const complexRecord = {
      title: { id: 'Judul', jv: 'Irah-irahan' },
      counter: 42,
      tags: [{ id: 'Seni', jv: 'Kagunan' }]
    };

    const resolvedJv = resolveBilingualRecord(complexRecord, 'jv');
    assert.strictEqual(resolvedJv.title, 'Irah-irahan');
    assert.strictEqual(resolvedJv.tags[0], 'Kagunan');
    assert.strictEqual(resolvedJv.counter, 42);
  });
});
