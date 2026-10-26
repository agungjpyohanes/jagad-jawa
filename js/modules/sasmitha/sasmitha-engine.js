/**
 * Jagad Jawa — Engine Sasmitha (Tanda Alam & Tubuh)
 * Disarikan dari sasmitha_gabungan.xlsx
 * 
 * POSISI & SIFAT MODUL:
 * Modul ini diposisikan sebagai sasmitha / tanda alam & tubuh tradisi
 * (bukan nujum matrix atau ramalan pasti, melainkan baca tradisi dan sastra budaya).
 */

import {
  SASMITHA_IMPEN,
  SASMITHA_KEDUT,
  SASMITHA_GERAHANA,
  SASMITHA_LINDU,
  SASMITHA_TEJO,
  REF_SASI_JAWA
} from '../../data/sasmitha-db.js';

function norm(str) {
  if (typeof str === 'object' && str !== null) {
    return (String(str.jv || '') + ' ' + String(str.id || '')).trim().toLowerCase();
  }
  return String(str || '').trim().toLowerCase();
}

function getActiveDataset(sectionKey, fallback) {
  if (typeof globalThis !== 'undefined' && globalThis._currentSasmithaData) {
    const val = globalThis._currentSasmithaData[sectionKey];
    if (Array.isArray(val) && val.length > 0) return val;
  }
  return fallback;
}

/**
 * Cari tanda impen (mimpi) berdasarkan kata kunci
 * @param {string} query
 * @param {Array} [customDataset]
 * @returns {Array}
 */
export function searchImpen(query = '', customDataset = null) {
  const activeImpen = customDataset || getActiveDataset('impen', SASMITHA_IMPEN);
  const q = norm(query);
  if (!q) return [...activeImpen];
  return activeImpen.filter(im =>
    norm(im.yen_ngimpi).includes(q) || norm(im.pratanda).includes(q)
  );
}

/**
 * Ambil daftar kedutan badan dengan opsi kategori & privasi mode pemula
 * @param {object} options
 * @param {string} [options.query]
 * @param {string} [options.kategori]
 * @param {boolean} [options.includeSensitive]
 * @param {Array} [options.customDataset]
 * @returns {Array}
 */
export function getKedutList({ query = '', kategori = '', includeSensitive = false, customDataset = null } = {}) {
  const activeKedut = customDataset || getActiveDataset('kedut', SASMITHA_KEDUT);
  const q = norm(query);
  const k = norm(kategori);

  return activeKedut.filter(kd => {
    // Sembunyikan item sensitif jika includeSensitive false
    if (!includeSensitive && kd.is_sensitive) return false;

    // Filter kategori
    if (k && norm(kd.kategori) !== k) return false;

    // Filter teks pencarian
    if (q) {
      const matchPart = norm(kd.bagian_badan).includes(q);
      const matchWahana = norm(kd.wahanane).includes(q);
      if (!matchPart && !matchWahana) return false;
    }

    return true;
  });
}

/**
 * Ambil sasmitha gerhana menurut sasi Jawa (12 Sasi)
 * @param {string} sasiName
 * @param {Array} [customDataset]
 * @returns {object|null}
 */
export function getGerhanaBySasi(sasiName, customDataset = null) {
  if (!sasiName) return null;
  const activeGerhana = customDataset || getActiveDataset('gerhana', SASMITHA_GERAHANA);
  const nS = norm(sasiName);
  const found = activeGerhana.find(g =>
    norm(g.sasi_jawa) === nS ||
    norm(g.alias_sumber) === nS ||
    norm(g.sasi_jawa).includes(nS)
  );
  return found ? { ...found } : null;
}

/**
 * Ambil sasmitha lindu (gempa) menurut sasi Jawa dan waktu (Awan vs Wengi)
 * @param {string} sasiName
 * @param {'awan'|'wengi'} waktu
 * @param {Array} [customDataset]
 * @returns {object|null}
 */
export function getLinduBySasi(sasiName, waktu = 'awan', customDataset = null) {
  if (!sasiName) return null;
  const activeLindu = customDataset || getActiveDataset('lindu', SASMITHA_LINDU);
  const nS = norm(sasiName);
  const isWengi = norm(waktu) === 'wengi';

  const found = activeLindu.find(l =>
    norm(l.sasi_jawa) === nS ||
    norm(l.sasi_jawa).includes(nS)
  );
  if (!found) return null;

  return {
    ...found,
    waktuPilihan: isWengi ? 'Wengi' : 'Awan',
    ngalamatPilihan: isWengi ? found.ngalamat_wengi : found.ngalamat_awan,
    disclaimer_bmkg: 'Pènget Kaslametan: Petung lindu tradisional punika kearifan kultural kanggé nggugah raos eling lan waspada ing jaman kina, sanès ramalan utawi deteksi seismik ilmiah. Kanggé pèngetan lindu resmi lan langkah mitigasi bencana, tansah tutna pitedah saking BMKG lan BPBD.'
  };
}

/**
 * Ambil semua data tejo arah (7 Arah)
 * @param {Array} [customDataset]
 * @returns {Array}
 */
export function getTejoList(customDataset = null) {
  const activeTejo = customDataset || getActiveDataset('tejo', SASMITHA_TEJO);
  return [...activeTejo];
}

/**
 * Ambil data tejo berdasarkan arah
 * @param {string} arah
 * @param {Array} [customDataset]
 * @returns {object|null}
 */
export function getTejoByArah(arah, customDataset = null) {
  if (!arah) return null;
  const list = getTejoList(customDataset);
  const nA = norm(arah);
  const found = list.find(t =>
    norm(t.arah_jawa) === nA ||
    norm(t.arah_id) === nA ||
    norm(t.arah_jawa).includes(nA) ||
    norm(t.arah_id).includes(nA)
  );
  return found ? { ...found } : null;
}

export {
  SASMITHA_IMPEN,
  SASMITHA_KEDUT,
  SASMITHA_GERAHANA,
  SASMITHA_LINDU,
  SASMITHA_TEJO,
  REF_SASI_JAWA
};
