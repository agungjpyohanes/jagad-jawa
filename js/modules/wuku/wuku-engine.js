/**
 * Jagad Jawa — Modul Domain: Wuku Engine (Ensiklopedia 30 Wuku Pawukon)
 * Pure lookup & filtering logic untuk data 30 Wuku Nusantara.
 * Bebas dari ketergantungan DOM.
 */

import { PAWUKON_LIST, getPawukonData } from '../../data/pawukon.js';
import {
  resolveWukuDewa,
  illustrationPath,
  dewaneIllustrationPath,
  wukuIllustrationPath,
  normalizeDewaName
} from '../../data/dewa-kanon.js';

/**
 * Mendapatkan daftar seluruh 30 wuku.
 * @returns {Array<Object>}
 */
export function getAllWuku() {
  const list = PAWUKON_LIST || (typeof window !== 'undefined' && window.PAWUKON_LIST) || 
               (typeof globalThis !== 'undefined' && globalThis.PAWUKON_LIST) || [];
  return list;
}

/**
 * Mendapatkan data wuku berdasarkan nomor urut (1 - 30).
 * @param {number} no 
 * @returns {Object|null}
 */
export function getWukuByNumber(no) {
  const num = parseInt(no, 10);
  if (isNaN(num) || num < 1 || num > 30) return null;
  const list = getAllWuku();
  return list.find(w => w.no_wuku === num) || null;
}

/**
 * Mendapatkan data wuku berdasarkan nama (misal: "Sinta", "Mandasiya", "Watugunung").
 * @param {string} name 
 * @returns {Object|null}
 */
export function getWukuByName(name) {
  if (!name || typeof name !== 'string') return null;
  const clean = name.trim().toLowerCase().replace(/\s+/g, '');
  const list = getAllWuku();
  return list.find(w => w.nama_wuku.toLowerCase().replace(/\s+/g, '') === clean) || null;
}

/**
 * Mencari wuku berdasarkan kata kunci pencarian (nama wuku, nama dewa, profesi, dll).
 * @param {string} query 
 * @returns {Array<Object>}
 */
export function searchWuku(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return getAllWuku();
  }
  const q = query.trim().toLowerCase();
  const list = getAllWuku();

  // Resolve alias → term kanon untuk pencarian lebih luas.
  // Contoh: user ketik "Nogogini" → normalizeDewaName → "Sang Hyang Kamajaya"
  // sehingga ketemu Galungan meski dewane sudah dikoreksi ke kanon.
  const canonicalized = normalizeDewaName(query.trim());
  const qCanon = canonicalized.toLowerCase();

  return list.filter(w => {
    // Cari di nama wuku, dewane kanon, watak, bilahi, profesi, donga
    const baseMatch =
      (w.nama_wuku && w.nama_wuku.toLowerCase().includes(q)) ||
      (w.dewane    && w.dewane.toLowerCase().includes(q))    ||
      (w.watek_budi_pangerti && w.watek_budi_pangerti.toLowerCase().includes(q)) ||
      (w.bilahi_bebaya && w.bilahi_bebaya.toLowerCase().includes(q)) ||
      (w.pangupaya_jiwa && w.pangupaya_jiwa.toLowerCase().includes(q)) ||
      (w.donga_slamet && w.donga_slamet.toLowerCase().includes(q)) ||
      (String(w.no_wuku) === q);

    if (baseMatch) return true;

    // Pencarian sekunder: coba via term yang sudah dinormalisasi (alias → kanon)
    if (qCanon !== q) {
      const canonMatch =
        (w.nama_wuku && w.nama_wuku.toLowerCase().includes(qCanon)) ||
        (w.dewane    && w.dewane.toLowerCase().includes(qCanon));
      if (canonMatch) return true;
    }

    // Pencarian tersier: cek aliases dari dewa-kanon.js (backward compat penuh)
    const dewaEntry = resolveWukuDewa(w.no_wuku);
    if (dewaEntry?.aliases) {
      return dewaEntry.aliases.some(alias => alias.toLowerCase().includes(q));
    }

    return false;
  });
}

/**
 * Menyusun ringkasan terstruktur mendalam dari sebuah wuku.
 * @param {string|number|Object} wukuInput 
 * @returns {Object|null}
 */
export function getWukuDetailSummary(wukuInput) {
  let data = null;
  if (typeof wukuInput === 'number') {
    data = getWukuByNumber(wukuInput);
  } else if (typeof wukuInput === 'string') {
    data = getWukuByName(wukuInput) || getWukuByNumber(parseInt(wukuInput, 10));
  } else if (wukuInput && typeof wukuInput === 'object' && wukuInput.nama_wuku) {
    data = wukuInput;
  }

  if (!data) return null;

  // ── Perkaya dengan data kanon dari dewa-kanon.js ──────────────────────────
  const dewaEntry = resolveWukuDewa(data.no_wuku);
  const dewaneKanon   = dewaEntry?.dewane   || data.dewane || '-';
  const dewaneSlug    = dewaEntry?.dewaneSlug || null;
  const dewaneAliases = dewaEntry?.aliases || [];

  // Path gambar (menggunakan file yang sudah ada di assets/)
  // Konvensi lama: assets/wuku/{NamaWuku}.jpg & assets/dewa-wuku/{Sang Hyang XXX}.jpg
  const wukuImagePath   = `assets/wuku/${data.nama_wuku}.jpg`;
  const dewaneImagePath = dewaneKanon !== '-'
    ? `assets/dewa-wuku/${dewaneKanon}.jpg`
    : null;
  // Path ilustrasi kanon (/assets/illustrations/)
  const imageWuku   = illustrationPath('wuku', data.nama_wuku);
  const imageDewane = illustrationPath('dewane', data.nama_wuku);
  const wukuIllPath   = imageWuku;
  const dewaneIllPath = imageDewane;

  return {
    no:       data.no_wuku,
    nama:     data.nama_wuku,
    // Dewane — selalu gunakan string kanon dari dewa-kanon.js jika tersedia
    dewane:        dewaneKanon,
    dewaneKanon,
    dewaneSlug,
    dewaneAliases,
    // Path gambar kanon
    imageWuku,
    imageDewane,
    // Path gambar (backward compat)
    wukuImagePath,
    dewaneImagePath,
    wukuIllPath,
    dewaneIllPath,
    // Data selamatan & ritual
    watak:    data.watek_budi_pangerti || '-',
    bilahi:   data.bilahi_bebaya || '-',
    sesaji:   data.sesaji_ruwat || '-',
    tindih:   data.tindih_ruwat || '-',
    sega:     data.selamatan_sega || '-',
    iwak:     data.selamatan_iwak || '-',
    salawat:  data.salawat || '-',
    donga:    data.donga_slamet || '-',
    pangupaya: data.pangupaya_jiwa || '-',
    tamba:    data.tamba_yen_lara || '-'
  };
}

/**
 * Re-export resolver dewa-kanon untuk konsumsi modul wuku lainnya.
 * Memungkinkan wuku-ui.js mengakses normalizeDewaName dan illustrationPath tanpa import langsung.
 */
export { resolveWukuDewa, illustrationPath, dewaneIllustrationPath, wukuIllustrationPath, normalizeDewaName };
