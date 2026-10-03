/**
 * Jagad Jawa — Modul UI: i18n (Internationalization / Dwibahasa)
 * Branch: jawa-v12
 *
 * Tanggung Jawab:
 * 1. Mengatur mode dwibahasa antarmuka (Bahasa Indonesia / 'id' & Basa Jawi / 'jv').
 * 2. Menyimpan preferensi bahasa pengguna di localStorage ('app_language' & 'jagad_jawa_lang').
 * 3. FULL BILINGUAL (ID & JV) MENYELURUH:
 *    Tombol switch bahasa memengaruhi SELURUH bagian aplikasi secara menyeluruh:
 *    - Menu Navigasi Utama & Sub-menu
 *    - Judul modul, header, dan label tombol
 *    - Seluruh isi konten, narasi, dan deskripsi dinamis
 * 4. KAMUS TERPUSAT (src/locales/id.js & src/locales/jv.js):
 *    - Mode ID: 100% Bahasa Indonesia yang baik dan benar, istilah budaya baku dipertahankan.
 *    - Mode JV: 100% Basa Jawi otentik ragam Krama/Madya.
 * 5. Menjaga integritas data matematis:
 *    Semua key kalkulasi (dino, pas, wuku, neptu, formula JDN) 100% tidak diubah.
 */

import { id } from '../../src/locales/id.js';
import { jv } from '../../src/locales/jv.js';

export const LOCALES = { id, jv };

export const STORAGE_KEY = 'app_language';
export const STORAGE_KEY_LEGACY = 'jagad_jawa_lang';

export const SUPPORTED_LANGUAGES = ['id', 'jv'];
export const DEFAULT_LANGUAGE = 'id';

/**
 * ─── KAMUS TERPUSAT GABUNGAN ────────────────────────────────────────────────
 * Dibangun dari src/locales/id.js dan src/locales/jv.js untuk konsistensi penuh.
 */
export const DICTIONARY = {};
export const NAV_DICTIONARY = {};
export const CONTENT_DICTIONARY = {};

// Bangun dictionary terpadu dengan pasangan { id, jv }
for (const key of Object.keys(id)) {
  const entry = {
    id: id[key],
    jv: jv[key] !== undefined ? jv[key] : id[key]
  };
  DICTIONARY[key] = entry;

  if (
    key.startsWith('nav_') ||
    key.startsWith('brand_') ||
    key.startsWith('lang_toggle_') ||
    key.startsWith('mode_') ||
    key.startsWith('bottomnav_')
  ) {
    NAV_DICTIONARY[key] = entry;
  } else {
    CONTENT_DICTIONARY[key] = entry;
  }
}

let currentLang = 'id';

/**
 * Memeriksa apakah suatu key merupakan bagian dari Menu Navigasi Utama.
 * @param {string} key
 * @returns {boolean}
 */
export function isMenuKey(key) {
  if (!key || typeof key !== 'string') return false;
  return (
    key.startsWith('nav_') ||
    key.startsWith('bottomnav_') ||
    Object.prototype.hasOwnProperty.call(NAV_DICTIONARY, key)
  );
}

/**
 * Mendapatkan bahasa antarmuka saat ini ('id' atau 'jv') dari localStorage.
 * Mendukung 'app_language' sebagai kunci utama dan 'jagad_jawa_lang' sebagai backward-compatibility.
 * @returns {'id'|'jv'}
 */
export function getLanguage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY_LEGACY);
      if (saved === 'id' || saved === 'jv') {
        currentLang = saved;
      }
    } catch {
      // LocalStorage tidak tersedia / di-block, gunakan default 'id'
    }
  }
  return currentLang;
}

/**
 * Menerapkan terjemahan pada seluruh elemen DOM.
 * FULL BILINGUAL (ID / JV):
 * Menyeluruh ke Menu Navigasi Utama, Sub-menu, Judul Modul, Header,
 * Label Tombol, serta Deskripsi Dinamis mengikuti preferensi bahasa.
 *
 * @param {'id'|'jv'} [lang=currentLang]
 */
export function applyLanguage(lang = currentLang) {
  currentLang = (lang === 'jv') ? 'jv' : 'id';

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
      localStorage.setItem(STORAGE_KEY_LEGACY, currentLang);
    } catch (e) {
      console.warn('[i18n] Gagal menyimpan preferensi bahasa di localStorage:', e);
    }
  }

  if (typeof document === 'undefined') return;

  // Sinkronisasi atribut lang HTML secara dinamis (A11y Requirement 7 & Strict Bilingual Spec 3)
  if (document.documentElement) {
    document.documentElement.setAttribute('lang', currentLang === 'jv' ? 'jv' : 'id');
  }

  // 1. Perbarui teks seluruh elemen bertanda data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key || !DICTIONARY[key]) return;

    const targetLang = currentLang;
    if (DICTIONARY[key][targetLang] !== undefined) {
      el.textContent = DICTIONARY[key][targetLang];
    } else if (DICTIONARY[key].id !== undefined) {
      el.textContent = DICTIONARY[key].id;
    }
  });

  // 2. Perbarui atribut title elemen bertanda data-i18n-title
  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key || !DICTIONARY[key]) return;
    const targetLang = currentLang;
    const txt = DICTIONARY[key][targetLang] || DICTIONARY[key].id;
    if (txt) el.setAttribute('title', txt);
  });

  // 3. Perbarui atribut placeholder elemen bertanda data-i18n-placeholder
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key || !DICTIONARY[key]) return;
    const targetLang = currentLang;
    const txt = DICTIONARY[key][targetLang] || DICTIONARY[key].id;
    if (txt) el.setAttribute('placeholder', txt);
  });

  // 4. Perbarui atribut aria-label elemen bertanda data-i18n-aria-label
  const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key || !DICTIONARY[key]) return;
    const targetLang = currentLang;
    const txt = DICTIONARY[key][targetLang] || DICTIONARY[key].id;
    if (txt) el.setAttribute('aria-label', txt);
  });

  // 5. Update indikator tombol switch bahasa di header, drawer, & pengaturan
  const toggleBadges = document.querySelectorAll('.lang-toggle-short, #langToggleBadge');
  toggleBadges.forEach((el) => {
    el.textContent = currentLang === 'jv' ? 'JV' : 'ID';
  });

  const toggleTexts = document.querySelectorAll('.lang-toggle-text');
  toggleTexts.forEach((el) => {
    el.textContent = currentLang === 'jv' ? 'JV (Basa Jawa)' : 'ID (Bhs Indonesia)';
  });

  const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.setAttribute('title', currentLang === 'jv'
      ? 'Mode Basa Jawi aktif (Klik kagem gantos dhateng Bahasa Indonesia)'
      : 'Mode Bahasa Indonesia aktif (Klik untuk beralih ke Basa Jawa)');
    btn.setAttribute('aria-label', `Mode Bahasa: ${currentLang.toUpperCase()}`);
  });

  // 6. Picu custom event 'language-changed' agar seluruh modul aktif langsung me-render ulang
  if (typeof window !== 'undefined') {
    window.currentLanguage = currentLang;
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: currentLang } }));
  }
}

/**
 * Mengubah bahasa ke bahasa yang ditentukan
 * @param {'id'|'jv'} lang
 */
export function setLanguage(lang) {
  applyLanguage(lang);
}

/**
 * Melakukan toggle bolak-balik antara Bahasa Indonesia ('id') dan Basa Jawi ('jv')
 * @returns {'id'|'jv'} Bahasa yang aktif sekarang
 */
export function toggleLanguage() {
  const nextLang = currentLang === 'id' ? 'jv' : 'id';
  applyLanguage(nextLang);
  return nextLang;
}

/**
 * Helper Dwibahasa: Membaca teks berdasarkan bahasa aktif ('id' atau 'jv')
 * Mendukung objek berbentuk `{ id: '...', jv: '...' }`, string biasa, angka, array, dsb.
 * @param {string|object|number|Array} val
 * @param {'id'|'jv'} [lang]
 * @returns {string}
 */
export function getBilingualText(val, lang = null) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val.map(item => getBilingualText(item, lang)).join(', ');
  }
  if (typeof val === 'object') {
    const targetLang = (lang === 'jv' || lang === 'id') ? lang : getLanguage();
    if (val[targetLang] !== undefined && val[targetLang] !== null) {
      return getBilingualText(val[targetLang], targetLang);
    }
    if (val.id !== undefined && val.id !== null && typeof val.id === 'string') return val.id;
    if (val.jv !== undefined && val.jv !== null && typeof val.jv === 'string') return val.jv;
    if (val.id !== undefined && val.id !== null) return String(val.id);
    if (val.jv !== undefined && val.jv !== null) return String(val.jv);
  }
  return String(val);
}

/**
 * Menyelesaikan seluruh properti dwibahasa `{ id, jv }` dalam objek atau array rekursif.
 * @param {object|Array} record
 * @param {'id'|'jv'} [lang]
 * @returns {object|Array}
 */
export function resolveBilingualRecord(record, lang = null) {
  if (!record || typeof record !== 'object') return record;
  if (Array.isArray(record)) {
    return record.map(item => resolveBilingualRecord(item, lang));
  }
  if (('id' in record || 'jv' in record) && Object.keys(record).every(k => k === 'id' || k === 'jv')) {
    return getBilingualText(record, lang);
  }
  const resolved = {};
  for (const [key, val] of Object.entries(record)) {
    if (val && typeof val === 'object' && ('id' in val || 'jv' in val) && (typeof val.id === 'string' || typeof val.jv === 'string') && Object.keys(val).every(k => k === 'id' || k === 'jv')) {
      resolved[key] = getBilingualText(val, lang);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      resolved[key] = resolveBilingualRecord(val, lang);
    } else if (Array.isArray(val)) {
      resolved[key] = val.map(item => resolveBilingualRecord(item, lang));
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * Menerjemahkan key kamus DICTIONARY ke bahasa aktif.
 * Mengembalikan teks sesuai bahasa target ('id' atau 'jv') atau bahasa aktif.
 *
 * @param {string} key
 * @param {'id'|'jv'} [lang]
 * @returns {string}
 */
export function t(key, lang = null) {
  const targetLang = (lang === 'jv' || lang === 'id')
    ? lang
    : getLanguage();

  if (DICTIONARY[key] && DICTIONARY[key][targetLang] !== undefined) {
    return DICTIONARY[key][targetLang];
  }
  if (DICTIONARY[key]) {
    return DICTIONARY[key].id || DICTIONARY[key].jv || key;
  }
  return key;
}

/**
 * Inisialisasi awal modul i18n
 */
export function initI18n() {
  const lang = getLanguage();
  applyLanguage(lang);
}

// Window attachments untuk interoperabilitas modul browser & handler inline
if (typeof window !== 'undefined') {
  window.currentLanguage = currentLang;
  window.getLanguage = getLanguage;
  window.setLanguage = setLanguage;
  window.toggleLanguage = toggleLanguage;
  window.applyLanguage = applyLanguage;
  window.getBilingualText = getBilingualText;
  window.resolveBilingualRecord = resolveBilingualRecord;
  window.isMenuKey = isMenuKey;
  window.LOCALES = LOCALES;
  window.NAV_DICTIONARY = NAV_DICTIONARY;
  window.CONTENT_DICTIONARY = CONTENT_DICTIONARY;
  window.DICTIONARY = DICTIONARY;
  window.t = t;
}
