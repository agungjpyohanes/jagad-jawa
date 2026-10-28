/**
 * Jagad Jawa — Engine Sasmitha (Tanda Alam & Tubuh)
 * Disarikan dari sasmitha_gabungan.xlsx & primbon tradisi
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
  SASMITHA_MERAPI,
  REF_SASI_JAWA
} from '../../data/sasmitha-db.js';

/**
 * Cache memori sesi (Map) untuk lazy loading dataset sasmitha,
 * mencegah re-fetch berulang dan menjaga efisiensi CPU/GPU ponsel.
 */
export const sasmithaSessionCache = new Map();

function norm(str) {
  if (typeof str === 'object' && str !== null) {
    return (String(str.jv || '') + ' ' + String(str.id || '')).trim().toLowerCase();
  }
  return String(str || '').trim().toLowerCase();
}

function normSasi(s) {
  return norm(s)
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const SASI_CANONICAL_INDEX = {
  sura: 1, suro: 1, muharram: 1,
  sapar: 2, safar: 2,
  mulud: 3, rabiulawal: 3,
  bakdamulud: 4, rabiulakhir: 4,
  jumadilawal: 5,
  jumadilakir: 6, jumadilakhir: 6,
  rejeb: 7, rajab: 7,
  ruwah: 8, syaban: 8,
  pasa: 9, poso: 9, siyam: 9, ramadan: 9,
  sawal: 10, syawal: 10,
  sela: 11, dulkangidah: 11, dulkaidah: 11, dzulqadah: 11, apit: 11,
  besar: 12, dzulhijjah: 12
};

function getSasiIndex(name) {
  if (!name) return 0;
  const raw = norm(name);
  // Cek kata kunci langsung
  for (const [key, idx] of Object.entries(SASI_CANONICAL_INDEX)) {
    if (raw.includes(key)) return idx;
  }
  return 0;
}

function matchSasi(target, candidate, alias = '') {
  if (!target) return false;
  const tIdx = getSasiIndex(target);
  const cIdx = getSasiIndex(candidate);
  const aIdx = getSasiIndex(alias);
  if (tIdx > 0 && (tIdx === cIdx || tIdx === aIdx)) return true;

  const tNorm = norm(target);
  const cNorm = norm(candidate);
  const aNorm = norm(alias);
  if (tNorm === cNorm || (aNorm && tNorm === aNorm)) return true;

  const tClean = normSasi(target);
  const cClean = normSasi(candidate);
  const aClean = normSasi(alias);
  if (tClean === cClean || (aClean && tClean === aClean)) return true;

  if (tClean.length >= 3 && (cClean.includes(tClean) || tClean.includes(cClean))) return true;
  if (aClean && tClean.length >= 3 && (aClean.includes(tClean) || tClean.includes(aClean))) return true;
  return false;
}

function getActiveDataset(sectionKey, fallback) {
  if (sasmithaSessionCache.has('sasmitha:all')) {
    const cached = sasmithaSessionCache.get('sasmitha:all');
    let val = cached[sectionKey];
    if (!val && sectionKey === 'gerhana') val = cached.gerahana_sasi;
    if (!val && sectionKey === 'lindu') val = cached.lindu_sasi;
    if (!val && sectionKey === 'tejo') val = cached.tejo_arah;
    if (!val && sectionKey === 'merapi') val = cached.sasmitha_merapi;
    if (Array.isArray(val) && val.length > 0) return val;
  }
  if (typeof globalThis !== 'undefined' && globalThis._currentSasmithaData) {
    const d = globalThis._currentSasmithaData;
    let val = d[sectionKey];
    if (!val && sectionKey === 'gerhana') val = d.gerahana_sasi || d.gerhana_sasi;
    if (!val && sectionKey === 'lindu') val = d.lindu_sasi;
    if (!val && sectionKey === 'tejo') val = d.tejo_arah;
    if (!val && sectionKey === 'merapi') val = d.sasmitha_merapi;
    if (Array.isArray(val) && val.length > 0) return val;
  }
  return fallback;
}

/**
 * Pemuatan data Sasmitha berbasis Lazy Load dengan Cache Memori Sesi (Map)
 * @param {object} [options]
 * @param {boolean} [options.forceRefresh]
 * @returns {Promise<object>}
 */
export async function loadSasmithaDatasetLazy(options = {}) {
  const cacheKey = 'sasmitha:all';
  if (!options.forceRefresh && sasmithaSessionCache.has(cacheKey)) {
    return sasmithaSessionCache.get(cacheKey);
  }

  let data = null;
  if (typeof fetch === 'function') {
    try {
      const res = await fetch('/data/20-sasmitha.json');
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      // offline fallback ke data JS lokal
    }
  }

  const effective = data || {};
  const fullPayload = {
    impen: Array.isArray(effective.impen) && effective.impen.length > 0 ? effective.impen : SASMITHA_IMPEN,
    kedut: Array.isArray(effective.kedut) && effective.kedut.length > 0 ? effective.kedut : SASMITHA_KEDUT,
    gerhana: Array.isArray(effective.gerhana) && effective.gerhana.length > 0
      ? effective.gerhana
      : (Array.isArray(effective.gerahana_sasi) && effective.gerahana_sasi.length > 0 ? effective.gerahana_sasi : SASMITHA_GERAHANA),
    gerahana_sasi: Array.isArray(effective.gerahana_sasi) && effective.gerahana_sasi.length > 0
      ? effective.gerahana_sasi
      : (Array.isArray(effective.gerhana) && effective.gerhana.length > 0 ? effective.gerhana : SASMITHA_GERAHANA),
    lindu: Array.isArray(effective.lindu) && effective.lindu.length > 0
      ? effective.lindu
      : (Array.isArray(effective.lindu_sasi) && effective.lindu_sasi.length > 0 ? effective.lindu_sasi : SASMITHA_LINDU),
    lindu_sasi: Array.isArray(effective.lindu_sasi) && effective.lindu_sasi.length > 0
      ? effective.lindu_sasi
      : (Array.isArray(effective.lindu) && effective.lindu.length > 0 ? effective.lindu : SASMITHA_LINDU),
    tejo: Array.isArray(effective.tejo) && effective.tejo.length > 0
      ? effective.tejo
      : (Array.isArray(effective.tejo_arah) && effective.tejo_arah.length > 0 ? effective.tejo_arah : SASMITHA_TEJO),
    tejo_arah: Array.isArray(effective.tejo_arah) && effective.tejo_arah.length > 0
      ? effective.tejo_arah
      : (Array.isArray(effective.tejo) && effective.tejo.length > 0 ? effective.tejo : SASMITHA_TEJO),
    merapi: Array.isArray(effective.merapi) && effective.merapi.length > 0
      ? effective.merapi
      : (Array.isArray(effective.sasmitha_merapi) && effective.sasmitha_merapi.length > 0 ? effective.sasmitha_merapi : SASMITHA_MERAPI),
    sasmitha_merapi: Array.isArray(effective.sasmitha_merapi) && effective.sasmitha_merapi.length > 0
      ? effective.sasmitha_merapi
      : (Array.isArray(effective.merapi) && effective.merapi.length > 0 ? effective.merapi : SASMITHA_MERAPI),
    ref_sasi_jawa: Array.isArray(effective.ref_sasi_jawa) && effective.ref_sasi_jawa.length > 0
      ? effective.ref_sasi_jawa
      : REF_SASI_JAWA
  };

  sasmithaSessionCache.set(cacheKey, fullPayload);
  if (typeof globalThis !== 'undefined') {
    globalThis._currentSasmithaData = fullPayload;
  }
  return fullPayload;
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
  const found = activeGerhana.find(g =>
    matchSasi(sasiName, g.sasi_jawa, g.alias_sumber)
  );
  return found ? { ...found } : (activeGerhana[0] ? { ...activeGerhana[0] } : null);
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
  const isWengi = norm(waktu) === 'wengi';

  let found = activeLindu.find(l =>
    matchSasi(sasiName, l.sasi_jawa, l.alias_sumber)
  );
  if (!found && activeLindu.length > 0) {
    found = activeLindu[0];
  }
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

/**
 * Ambil sasmitha erupsi & arah lahar Gunung Merapi (4 Kiblat Utama)
 * @param {Array} [customDataset]
 * @returns {Array}
 */
export function getMerapiList(customDataset = null) {
  const activeMerapi = customDataset || getActiveDataset('merapi', SASMITHA_MERAPI);
  return [...activeMerapi];
}

export {
  SASMITHA_IMPEN,
  SASMITHA_KEDUT,
  SASMITHA_GERAHANA,
  SASMITHA_LINDU,
  SASMITHA_TEJO,
  SASMITHA_MERAPI,
  REF_SASI_JAWA
};
