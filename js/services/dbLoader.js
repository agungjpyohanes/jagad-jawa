/**
 * Jagad Jawa — Centralized Database Loader (Data Service)
 * Branch: jawa-v11
 * 
 * Tanggung Jawab:
 * 1. Menjadi pintu gerbang tunggal pemuatan seluruh database JSON di folder `./data/` & `public/data/`.
 * 2. Menyediakan fungsi pemetaan (Key Mapping & Structure Normalization) agar perbedaan
 *    nama property (misal id vs kode, nama vs title, dino vs dina, dsb.) tersinkronisasi mulus.
 * 3. Menyediakan migrasi bertahap asinkron per domain modul (`loadDomainData(domain)`).
 * 4. Menyediakan sistem caching memori + deduplikasi request inflight + fallback resilien
 *    agar UI tidak pernah blank saat terjadi kendala jaringan atau kegagalan pemuatan parsial.
 * 5. Menjaga 100% keakuratan rumus inti tanpa mengubah formula hitungan sedikit pun.
 */

import { getLanguage, getBilingualText, resolveBilingualRecord } from '../ui/i18n.js';
export { getBilingualText, resolveBilingualRecord };

// ─── IMPORT STATIC FALLBACKS (RESILIENCE: ZERO BLANK GUARANTEE) ─────────────
import * as fallbackCalendar from '../data/calendar.js';
import * as fallbackPawukon from '../data/pawukon.js';
import * as fallbackMarriage from '../data/marriage.js';
import * as fallbackSelametan from '../data/selametan.js';
import * as fallbackIjab from '../data/ijab-db.js';
import * as fallbackOmah from '../data/omah-db.js';
import * as fallbackTernak from '../data/petung-ternak-loro-geblak.js';
import * as fallbackSasmitha from '../data/sasmitha-db.js';
import * as fallbackNujumMatrix from '../data/nujum-matrix.js';
import * as fallbackPersonality from '../data/personality.js';
import * as fallbackTetanen from '../data/petung-tetanen-db.js';
import * as fallbackWukuPetenget from '../data/wuku-petenget-db.js';

export const DB_FILES = {
  '01': '01-kalender-constants.json',
  '02': '02-wuku-ensiklopedia.json',
  '03': '03-bincil-arti.json',
  '04': '04-dino-rules.json',
  '05': '05-pranata-mangsa.json',
  '06': '06-bincil-matrix-bilingual.json',
  '07': '07-zodiak-bilingual.json',
  '08': '08-sasi-jawa-bilingual.json',
  '09': '09-shio-wuxing-bilingual.json',
  '10': '10-pasaran-watak-bilingual.json',
  '11': '11-pitung-perjodohan-bilingual.json',
  '12': '12-karakter-dasar-bilingual.json',
  '13': '13-pekerjaan-weton-bilingual.json',
  '14': '14-selametan-rules.json',
  '15': '15-ijab-bilingual.json',
  '16': '16-pitung-perjodohan.json',
  '17': '17-aksara-perjodohan.json',
  '18': '18-selametan-rules.json',
  '19': '19-ijab.json',
  '20': '20-sasmitha.json',
  '21': '21-petung-tetanen-bilingual.json',
  '22': '22-petung-ternak-bilingual.json',
  '23': '23-omah-bilingual.json',
  '24': '24-wuku-petenget-bilingual.json',
  '25': '25-siklus-padewan-bilingual.json',
  '26': '26-palenggahan-bilingual.json',
  '27': '27-bincil-arti-bilingual.json',
  '28': '28-marriage-hasil-bilingual.json',
  '29': '29-sasi-jawa-bilingual.json',
  '30': '30-aksara-nglegena-bilingual.json',
  '31': '31-dino-gede-bilingual.json',
  '32': '32-dino-sirikan-adhep-bilingual.json',
  '33': '33-kamus-jawa.json',
  '34': '34-kamus-sansakerta.json',
  '35': '35-pustaka-dongo.json',
  '36': '36-pustaka-jawa.json',
  '37': '37-sinengker-khusus.json'
};

export const DB_ALIASES = {
  kalenderConstants: '01-kalender-constants.json',
  wukuEnsiklopedia: '02-wuku-ensiklopedia.json',
  bincilArti: '03-bincil-arti.json',
  dinoRules: '04-dino-rules.json',
  pranataMangsa: '05-pranata-mangsa.json',
  bincilMatrix: '06-bincil-matrix-bilingual.json',
  zodiak: '07-zodiak-bilingual.json',
  sasiJawa: '08-sasi-jawa-bilingual.json',
  shioWuxing: '09-shio-wuxing-bilingual.json',
  pasaranWatak: '10-pasaran-watak-bilingual.json',
  pitungPerjodohan: '11-pitung-perjodohan-bilingual.json',
  karakterDasar: '12-karakter-dasar-bilingual.json',
  pekerjaanWeton: '13-pekerjaan-weton-bilingual.json',
  selametanRules: '14-selametan-rules.json',
  ijab: '15-ijab-bilingual.json',
  pitungPerjodohanAlt: '16-pitung-perjodohan.json',
  aksaraPerjodohan: '17-aksara-perjodohan.json',
  selametanRulesAlt: '18-selametan-rules.json',
  ijabAlt: '19-ijab.json',
  sasmitha: '20-sasmitha.json',
  petungTetanen: '21-petung-tetanen-bilingual.json',
  petungTernak: '22-petung-ternak-bilingual.json',
  omah: '23-omah-bilingual.json',
  wukuPetenget: '24-wuku-petenget-bilingual.json',
  siklusPadewan: '25-siklus-padewan-bilingual.json',
  palenggahan: '26-palenggahan-bilingual.json',
  bincilArtiAlt: '27-bincil-arti-bilingual.json',
  marriageHasil: '28-marriage-hasil-bilingual.json',
  sasiJawaAlt: '29-sasi-jawa-bilingual.json',
  aksaraNglegena: '30-aksara-nglegena-bilingual.json',
  dinoGede: '31-dino-gede-bilingual.json',
  dinoSirikanAdhep: '32-dino-sirikan-adhep-bilingual.json',
  kamusJawa: '33-kamus-jawa.json',
  kamusSansakerta: '34-kamus-sansakerta.json',
  pustakaDongo: '35-pustaka-dongo.json',
  pustakaJawa: '36-pustaka-jawa.json',
  sinengkerKhusus: '37-sinengker-khusus.json'
};

// Cache memori lokal
const dbCache = new Map();
const inflightPromises = new Map();
const domainCache = new Map();

export const isNodeEnvironment = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process.versions?.node);

let nodeFs = null;
let nodePath = null;
if (isNodeEnvironment) {
  try {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const { createRequire } = await dynamicImport('node:module');
    const req = createRequire(process.cwd() + '/package.json');
    nodeFs = req('fs');
    nodePath = req('path');

    const dataDir = nodePath.resolve(process.cwd(), 'public/data');
    if (nodeFs.existsSync(dataDir)) {
      for (const file of Object.values(DB_FILES)) {
        try {
          const p = nodePath.join(dataDir, file);
          if (nodeFs.existsSync(p)) {
            dbCache.set(file, JSON.parse(nodeFs.readFileSync(p, 'utf8')));
          }
        } catch (_) {}
      }
    }
  } catch (_) {}
}

/**
 * Normalisasi identifier / alias menjadi nama file fisik di folder ./data/
 * @param {string|number} key
 * @returns {string} Nama file JSON
 */
export function resolveDbFilename(key) {
  if (typeof key === 'number') {
    const padKey = String(key).padStart(2, '0');
    return DB_FILES[padKey] || `${padKey}.json`;
  }
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.endsWith('.json')) {
    return trimmed;
  }
  const padKey = trimmed.padStart(2, '0');
  if (DB_FILES[padKey]) {
    return DB_FILES[padKey];
  }
  if (DB_ALIASES[trimmed]) {
    return DB_ALIASES[trimmed];
  }
  const lower = trimmed.toLowerCase();
  for (const [alias, file] of Object.entries(DB_ALIASES)) {
    if (alias.toLowerCase() === lower) return file;
  }
  return `${trimmed}.json`;
}

/**
 * Mengambil path URL statis atau relative yang sesuai lingkungan
 * @param {string} filename 
 * @returns {string}
 */
export function getDbUrl(filename) {
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}data/${filename}`;
}

/**
 * Pemuat JSON terpusat dengan caching & deduplikasi request inflight
 * @param {string|number} key - Nama file, nomor (1-37), atau nama alias
 * @returns {Promise<any>}
 */
export async function loadDb(key) {
  const filename = resolveDbFilename(key);
  if (!filename) {
    throw new Error(`[dbLoader] Identifier database tidak valid: ${key}`);
  }

  // 1. Cek cache memori
  if (dbCache.has(filename)) {
    return dbCache.get(filename);
  }

  // 2. Cek request yang sedang berjalan (inflight dedup)
  if (inflightPromises.has(filename)) {
    return inflightPromises.get(filename);
  }

  const promise = (async () => {
    try {
      let data = null;

      // Lingkungan Node.js (Unit Test runner)
      if (isNodeEnvironment) {
        try {
          if (nodeFs && nodePath) {
            const candidatePaths = [
              nodePath.resolve(process.cwd(), 'public/data', filename),
              nodePath.resolve(process.cwd(), 'data', filename)
            ];
            for (const p of candidatePaths) {
              if (nodeFs.existsSync(p)) {
                const raw = nodeFs.readFileSync(p, 'utf8');
                data = JSON.parse(raw);
                break;
              }
            }
          }
        } catch (nodeErr) {
          if (typeof fetch === 'function') {
            const url = getDbUrl(filename);
            const res = await fetch(url);
            if (res.ok) data = await res.json();
          }
        }
      } else {
        // Lingkungan Browser (Vite / Cloudflare Pages / Preview)
        const candidates = [];
        const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
          ? import.meta.env.BASE_URL
          : './';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        
        candidates.push(`${cleanBase}data/${filename}`);
        if (!candidates.includes(`./data/${filename}`)) candidates.push(`./data/${filename}`);
        if (!candidates.includes(`/data/${filename}`)) candidates.push(`/data/${filename}`);
        if (!candidates.includes(`data/${filename}`)) candidates.push(`data/${filename}`);

        let lastErr = null;
        for (const candidateUrl of candidates) {
          try {
            const res = await fetch(candidateUrl);
            if (res.ok) {
              data = await res.json();
              break;
            }
          } catch (e) {
            lastErr = e;
          }
        }

        if (!data) {
          console.warn(`[dbLoader] Tidak dapat memuat ${filename} dari kandidat URL:`, candidates, lastErr);
          data = null;
        }
      }

      if (data) {
        dbCache.set(filename, data);
      }
      return data;
    } finally {
      inflightPromises.delete(filename);
    }
  })();

  inflightPromises.set(filename, promise);
  return promise;
}

/**
 * Pemuatan sinkron (dari memory cache atau fs lokal Node.js)
 * @param {string|number} key
 * @returns {any}
 */
export function getDbSync(key) {
  const filename = resolveDbFilename(key);
  if (dbCache.has(filename)) return dbCache.get(filename);
  if (isNodeEnvironment && nodeFs && nodePath) {
    try {
      const candidatePaths = [
        nodePath.resolve(process.cwd(), 'public/data', filename),
        nodePath.resolve(process.cwd(), 'data', filename)
      ];
      for (const p of candidatePaths) {
        if (nodeFs.existsSync(p)) {
          const raw = nodeFs.readFileSync(p, 'utf8');
          const data = JSON.parse(raw);
          dbCache.set(filename, data);
          return data;
        }
      }
    } catch (_) {}
  }
  return null;
}

export const loadDbSync = getDbSync;

export function setDbCache(key, data) {
  const filename = resolveDbFilename(key);
  dbCache.set(filename, data);
}

export function clearDbCache() {
  dbCache.clear();
  inflightPromises.clear();
  domainCache.clear();
}

export async function preloadDatabases(keys) {
  return Promise.all(keys.map(k => loadDb(k)));
}

// ─── KEY MAPPING & STRUCTURE NORMALIZATION (BAGIAN 1) ───────────────────────

/**
 * Normalisasi nilai teks dari format string atau objek dwibahasa { id, jv }
 * @param {any} val 
 * @param {'id'|'jv'} [preferredLang='id']
 * @returns {string}
 */
export function extractText(val, preferredLang = 'id') {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val[preferredLang] || val.id || val.jv || '';
  }
  return String(val);
}

/**
 * Pemetaan record generik untuk menyinkronkan properti sinonim
 * @param {Object} item 
 * @param {Object<string, string[]>} aliasMap
 * @returns {Object}
 */
export function mapRecordAliases(item, aliasMap = {}) {
  if (!item || typeof item !== 'object') return item;
  const mapped = { ...item };
  for (const [canonical, aliases] of Object.entries(aliasMap)) {
    if (mapped[canonical] === undefined) {
      for (const alias of aliases) {
        if (mapped[alias] !== undefined) {
          mapped[canonical] = mapped[alias];
          break;
        }
      }
    } else {
      for (const alias of aliases) {
        if (mapped[alias] === undefined) {
          mapped[alias] = mapped[canonical];
        }
      }
    }
  }
  return mapped;
}

/**
 * Mapper Entri Ensiklopedia Wuku (02-wuku-ensiklopedia.json)
 * Menyinkronkan perbedaan key:
 * - no_wuku <-> id <-> no
 * - nama_wuku <-> nama <-> title
 * - dewane <-> dewa <-> batara
 * - watek_budi_pangerti <-> watek <-> watak
 * - bilahi_bebaya <-> bilahi
 * dsb.
 * @param {Object} item 
 * @returns {Object}
 */
export function mapWukuItem(item) {
  if (!item || typeof item !== 'object') return item;
  const no = item.no_wuku || item.id || item.no || 0;
  const namaStr = extractText(item.nama_wuku || item.nama || item.title || '');
  const dewaStr = extractText(item.dewane || item.dewa || item.batara || '');
  const watekStr = extractText(item.watek_budi_pangerti || item.watek || item.watak || '');
  const bilahiStr = extractText(item.bilahi_bebaya || item.bilahi || '');
  const pangupayaStr = extractText(item.pangupaya_jiwa || item.pangupajiwa || '');
  const dongaStr = extractText(item.donga_slamet || item.dongaSlamet || '');
  const sesajiStr = extractText(item.sesaji_ruwat || item.sesajiRuwat || '');
  const segaStr = extractText(item.selamatan_sega || item.sega || '');
  const iwakStr = extractText(item.selamatan_iwak || item.iwak || '');
  const tambaStr = extractText(item.tamba_yen_lara || item.tamba || '');

  return {
    ...item,
    no_wuku: no,
    id: no,
    no: no,
    nama_wuku: namaStr,
    nama: typeof item.nama === 'object' ? item.nama : namaStr,
    title: namaStr,
    dewane: dewaStr,
    dewa: typeof item.dewa === 'object' ? item.dewa : dewaStr,
    watek_budi_pangerti: watekStr,
    watek: typeof item.watek === 'object' ? item.watek : watekStr,
    watak: watekStr,
    bilahi_bebaya: bilahiStr,
    bilahi: typeof item.bilahi === 'object' ? item.bilahi : bilahiStr,
    pangupaya_jiwa: typeof item.pangupaya_jiwa === 'object' ? item.pangupaya_jiwa : pangupayaStr,
    donga_slamet: typeof item.donga_slamet === 'object' ? item.donga_slamet : dongaStr,
    sesaji_ruwat: typeof item.sesaji_ruwat === 'object' ? item.sesaji_ruwat : sesajiStr,
    tindih_ruwat: item.tindih_ruwat || '',
    selamatan_sega: typeof item.selamatan_sega === 'object' ? item.selamatan_sega : segaStr,
    selamatan_iwak: typeof item.selamatan_iwak === 'object' ? item.selamatan_iwak : iwakStr,
    salawat: item.salawat || '',
    tamba_yen_lara: typeof item.tamba_yen_lara === 'object' ? item.tamba_yen_lara : tambaStr,
    keterangan_barang_salawat: item.keterangan_barang_salawat || ''
  };
}

/**
 * Mapper Konstanta Kalender (01-kalender-constants.json)
 * @param {Object} raw 
 * @returns {Object}
 */
export function mapKalenderConstants(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      HARI: fallbackCalendar.HARI,
      PASARAN: fallbackCalendar.PASARAN,
      NEPTU_HARI: fallbackCalendar.NEPTU_HARI,
      NEPTU_PASARAN: fallbackCalendar.NEPTU_PASARAN,
      WUKU: fallbackCalendar.WUKU,
      BULAN_JAWA: fallbackCalendar.BULAN_JAWA,
      BULAN_MASEHI: fallbackCalendar.BULAN_MASEHI,
      WINDU: fallbackCalendar.WINDU,
      EPOCH_JDN: fallbackCalendar.EPOCH_JDN,
      GRID: fallbackCalendar.GRID,
      KETERANGAN: fallbackCalendar.KETERANGAN
    };
  }

  const hariList = raw.nama_hari || raw.HARI || fallbackCalendar.HARI;
  const pasaranList = raw.nama_pasaran || raw.PASARAN || fallbackCalendar.PASARAN;
  const wukuList = raw.nama_wuku || raw.WUKU || fallbackCalendar.WUKU;
  const bulanJawaList = raw.nama_bulan_jawa || raw.BULAN_JAWA || fallbackCalendar.BULAN_JAWA;
  const winduList = raw.nama_windu || raw.WINDU || fallbackCalendar.WINDU;

  // Neptu array & map conversion
  let neptuHariArr = Array.isArray(raw.NEPTU_HARI) ? raw.NEPTU_HARI : null;
  if (!neptuHariArr && raw.neptu_hari) {
    neptuHariArr = hariList.map(h => raw.neptu_hari[h.toLowerCase()] ?? raw.neptu_hari[h] ?? 0);
  }
  if (!neptuHariArr) neptuHariArr = fallbackCalendar.NEPTU_HARI;

  let neptuPasaranArr = Array.isArray(raw.NEPTU_PASARAN) ? raw.NEPTU_PASARAN : null;
  if (!neptuPasaranArr && raw.neptu_pasaran) {
    neptuPasaranArr = pasaranList.map(p => raw.neptu_pasaran[p.toLowerCase()] ?? raw.neptu_pasaran[p] ?? 0);
  }
  if (!neptuPasaranArr) neptuPasaranArr = fallbackCalendar.NEPTU_PASARAN;

  const epochJdn = raw.epoch_pawukon?.jdn || raw.EPOCH_JDN || fallbackCalendar.EPOCH_JDN;

  return {
    ...raw,
    HARI: hariList,
    nama_hari: hariList,
    PASARAN: pasaranList,
    nama_pasaran: pasaranList,
    NEPTU_HARI: neptuHariArr,
    neptu_hari: raw.neptu_hari || { minggu: 5, senin: 4, selasa: 3, rabu: 7, kamis: 8, jumat: 6, sabtu: 9 },
    NEPTU_PASARAN: neptuPasaranArr,
    neptu_pasaran: raw.neptu_pasaran || { legi: 5, pahing: 9, pon: 7, wage: 4, kliwon: 8 },
    WUKU: wukuList,
    nama_wuku: wukuList,
    BULAN_JAWA: bulanJawaList,
    nama_bulan_jawa: bulanJawaList,
    BULAN_MASEHI: raw.BULAN_MASEHI || fallbackCalendar.BULAN_MASEHI,
    WINDU: winduList,
    nama_windu: winduList,
    EPOCH_JDN: epochJdn,
    GRID: raw.GRID || fallbackCalendar.GRID,
    KETERANGAN: raw.KETERANGAN || fallbackCalendar.KETERANGAN
  };
}

/**
 * Mapper Dino Rules (04-dino-rules.json / 31-dino-gede-bilingual.json)
 * @param {Object} raw 
 * @returns {Object}
 */
export function mapDinoRules(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const mapList = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => ({
      ...item,
      hari: item.hari || item.dino || item.dina || '',
      dino: item.dino || item.hari || item.dina || '',
      dina: item.dina || item.hari || item.dino || '',
      pasaran: item.pasaran || item.pas || '',
      pas: item.pas || item.pasaran || '',
      wuku: item.wuku || item.wukuName || '',
      wukuName: item.wukuName || item.wuku || ''
    }));
  };

  return {
    ...raw,
    dino_gede: mapList(raw.dino_gede || []),
    dino_ijo: mapList(raw.dino_ijo || [])
  };
}

/**
 * Mapper Pitung Perjodohan (11-pitung-perjodohan-bilingual.json, 16-pitung-perjodohan.json, 17-aksara-perjodohan.json)
 * @param {Object} rawBilingual 
 * @param {Array} raw16 
 * @param {Array} raw17 
 * @returns {Object}
 */
export function mapPitungPerjodohan(rawBilingual, raw16, raw17) {
  const result = {
    AKSARA_PERJODOHAN: fallbackMarriage.AKSARA_PERJODOHAN,
    HASIL_I_JODOH: fallbackMarriage.HASIL_I_JODOH,
    HASIL_II_JODOH: fallbackMarriage.HASIL_II_JODOH,
    HASIL_III_JODOH: fallbackMarriage.HASIL_III_JODOH,
    HASIL_IV_JODOH: fallbackMarriage.HASIL_IV_JODOH,
    HASIL_V_JODOH: fallbackMarriage.HASIL_V_JODOH,
    HASIL_VI_JODOH: fallbackMarriage.HASIL_VI_JODOH,
    rawBilingual: rawBilingual || null
  };

  if (Array.isArray(raw17)) {
    result.AKSARA_PERJODOHAN = raw17.map(item => ({
      kode: item.kode || item.id || '',
      iv: item.iv || item.neptu || 3,
      vvi: item.vvi || item.neptu || 1
    }));
  }

  // Helper konversi list hasil [{ sisa, nama, arti, status }] -> map { 0: {...}, 1: {...} }
  const toLookupMap = (hasilArr, defaultMap) => {
    if (!Array.isArray(hasilArr)) return defaultMap;
    const map = {};
    for (const h of hasilArr) {
      const sisa = (h.sisa !== undefined) ? h.sisa : h.id;
      map[sisa] = {
        nama: h.nama || '',
        arti: typeof h.arti === 'object' ? (h.arti.jv || h.arti.id || '') : (h.arti || ''),
        artiBilingual: typeof h.arti === 'object' ? h.arti : { id: h.arti, jv: h.arti },
        status: h.status || 'campur'
      };
    }
    return map;
  };

  if (rawBilingual) {
    if (rawBilingual.metode_I_panca_suda?.hasil) {
      result.HASIL_I_JODOH = toLookupMap(rawBilingual.metode_I_panca_suda.hasil, fallbackMarriage.HASIL_I_JODOH);
    }
    if (rawBilingual.metode_II_pancawardhana?.hasil) {
      result.HASIL_II_JODOH = toLookupMap(rawBilingual.metode_II_pancawardhana.hasil, fallbackMarriage.HASIL_II_JODOH);
    }
    if (rawBilingual.metode_III_petung_salaki_rabi?.hasil) {
      result.HASIL_III_JODOH = toLookupMap(rawBilingual.metode_III_petung_salaki_rabi.hasil, fallbackMarriage.HASIL_III_JODOH);
    }
    if (rawBilingual.metode_IV_aksara_penganten?.hasil) {
      result.HASIL_IV_JODOH = toLookupMap(rawBilingual.metode_IV_aksara_penganten.hasil, fallbackMarriage.HASIL_IV_JODOH);
    }
  }

  return result;
}

/**
 * Mapper Selametan (14-selametan-rules.json)
 * @param {Object} raw 
 * @returns {Object}
 */
export function mapSelametanRules(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      TARGET_HARI_SELAMETAN: fallbackSelametan.TARGET_HARI_SELAMETAN,
      TARGET_PASARAN_SELAMETAN: fallbackSelametan.TARGET_PASARAN_SELAMETAN,
      JENIS_SELAMETAN: fallbackSelametan.JENIS_SELAMETAN
    };
  }

  const hariOrder = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  let targetHariMatrix = [];
  if (raw.target_hari_berdasarkan_wafat) {
    targetHariMatrix = hariOrder.map(h => raw.target_hari_berdasarkan_wafat[h] || []);
  } else {
    targetHariMatrix = fallbackSelametan.TARGET_HARI_SELAMETAN;
  }

  const targetPasaran = {};
  if (raw.target_pasaran_berdasarkan_wafat) {
    for (const [k, v] of Object.entries(raw.target_pasaran_berdasarkan_wafat)) {
      const capKey = k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
      targetPasaran[capKey] = v;
      targetPasaran[k.toLowerCase()] = v;
    }
  }

  const jenisList = Array.isArray(raw.jenis_selametan)
    ? raw.jenis_selametan.map((item, idx) => ({
        ...item,
        idx: item.idx !== undefined ? item.idx : idx,
        nama: typeof item.nama === 'object' ? (item.nama.id || item.nama.jv) : item.nama,
        approx: item.hari_ke || item.approx || 0
      }))
    : fallbackSelametan.JENIS_SELAMETAN;

  return {
    ...raw,
    TARGET_HARI_SELAMETAN: targetHariMatrix,
    TARGET_PASARAN_SELAMETAN: Object.keys(targetPasaran).length > 0 ? targetPasaran : fallbackSelametan.TARGET_PASARAN_SELAMETAN,
    JENIS_SELAMETAN: jenisList
  };
}

/**
 * Mapper Petung Ijab (15-ijab-bilingual.json)
 * @param {Object} raw 
 * @returns {Object}
 */
export function mapPetungIjab(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      NEPTU_IJAB_DINA: fallbackIjab.NEPTU_IJAB_DINA,
      NEPTU_IJAB_PASARAN: fallbackIjab.NEPTU_IJAB_PASARAN,
      WUKU_IJAB: fallbackIjab.IJAB_WUKU || [],
      SASI_IJAB: fallbackIjab.IJAB_SASI || [],
      SURASA_WETON_IJAB: fallbackIjab.KAMUS_SURASA_IJAB || []
    };
  }

  const dinaList = Array.isArray(raw.neptu_ijab_dina)
    ? raw.neptu_ijab_dina.map(item => ({
        ...item,
        dina: item.dina || item.dino || '',
        dino: item.dina || item.dino || '',
        neptu_dina_ijab: item.neptu_dina_ijab !== undefined ? item.neptu_dina_ijab : item.neptu,
        neptu: item.neptu !== undefined ? item.neptu : item.neptu_dina_ijab
      }))
    : fallbackIjab.NEPTU_IJAB_DINA;

  const pasaranList = Array.isArray(raw.neptu_ijab_pasaran)
    ? raw.neptu_ijab_pasaran.map(item => ({
        ...item,
        pasaran: item.pasaran || item.pas || '',
        pas: item.pasaran || item.pas || '',
        neptu_pasaran_ijab: item.neptu_pasaran_ijab !== undefined ? item.neptu_pasaran_ijab : item.neptu,
        neptu: item.neptu !== undefined ? item.neptu : item.neptu_pasaran_ijab
      }))
    : fallbackIjab.NEPTU_IJAB_PASARAN;

  const wukuList = Array.isArray(raw.wuku_ijab)
    ? raw.wuku_ijab.map(item => ({
        ...item,
        wuku: item.wuku || item.nama_wuku || '',
        nama_wuku: item.wuku || item.nama_wuku || '',
        status: item.status || 'Normal'
      }))
    : (fallbackIjab.IJAB_WUKU || []);

  const sasiList = Array.isArray(raw.sasi_ijab)
    ? raw.sasi_ijab.map(item => ({
        ...item,
        sasi: item.sasi || item.nama_sasi || '',
        arti: typeof item.arti === 'object' ? (item.arti.jv || item.arti.id) : (item.arti || '')
      }))
    : (fallbackIjab.IJAB_SASI || []);

  return {
    ...raw,
    NEPTU_IJAB_DINA: dinaList,
    NEPTU_IJAB_PASARAN: pasaranList,
    WUKU_IJAB: wukuList,
    SASI_IJAB: sasiList,
    SURASA_WETON_IJAB: raw.surasa_weton_ijab || fallbackIjab.KAMUS_SURASA_IJAB || []
  };
}

/**
 * Mapper Petung Omah (23-omah-bilingual.json)
 * @param {Object} raw 
 * @returns {Object}
 */
export function mapPetungOmah(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      cempuri_lawangan: fallbackOmah.CEMPURI_LAWANGAN || {},
      raw: fallbackOmah
    };
  }

  const cempuri = raw.cempuri_lawangan || {};
  const normalizeDir = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => ({
      ...item,
      id: item.id !== undefined ? item.id : (item.no || 0),
      no: item.no !== undefined ? item.no : (item.id || 0),
      arti: typeof item.arti === 'object' ? (item.arti.jv || item.arti.id || '') : (item.arti || '')
    }));
  };

  return {
    ...raw,
    cempuri_lawangan: {
      utara: normalizeDir(cempuri.utara),
      timur: normalizeDir(cempuri.timur),
      selatan: normalizeDir(cempuri.selatan),
      barat: normalizeDir(cempuri.barat)
    }
  };
}

/**
 * Mapper Petung Kehidupan (Ternak, Loro, Geblak) (22-petung-ternak-bilingual.json)
 * @param {Array|Object} raw 
 * @returns {Object}
 */
export function mapPetungKehidupan(raw) {
  const wetonMap = { ...fallbackTernak.weton_35 };
  const wetonList = [];

  const rawList = Array.isArray(raw) ? raw : (raw?.weton_35 || []);
  if (Array.isArray(rawList) && rawList.length > 0) {
    for (const item of rawList) {
      const d = item.dina || item.dino || item.hari || '';
      const p = item.pasaran || item.pas || '';
      const neptu = item.neptu || item.neptu_jumlah || 0;
      
      const mappedItem = {
        ...item,
        dina: d,
        dino: d,
        pasaran: p,
        neptu_jumlah: neptu,
        neptu: neptu,
        wiwit_ternak: item.wiwit_ternak || item.ternak,
        ternak: item.ternak || item.wiwit_ternak,
        jalaran_loro: item.jalaran_loro || item.loro,
        loro: item.loro || item.jalaran_loro,
        petung_geblak: item.petung_geblak || item.geblak,
        geblak: item.geblak || item.petung_geblak
      };

      wetonList.push(mappedItem);

      if (d && p) {
        if (!wetonMap[d]) wetonMap[d] = {};
        wetonMap[d][p] = {
          ...(wetonMap[d][p] || {}),
          ...mappedItem
        };
      }
    }
  }

  return {
    weton_35: wetonMap,
    wetonList: wetonList.length > 0 ? wetonList : Object.values(fallbackTernak.weton_35).flatMap(o => Object.values(o))
  };
}

// ─── MIGRASI BERTAHAP PER DOMAIN MODUL (BAGIAN 2) ───────────────────────────

/**
 * Pemuat Data Domain Asinkron (Async / Await)
 * Mendukung domain:
 * - 'kalender'
 * - 'wuku'
 * - 'jodoh' / 'perjodohan'
 * - 'nujum'
 * - 'selametan'
 * - 'ijab'
 * - 'omah'
 * - 'petung-kehidupan' / 'ternak'
 * - 'sapa-dina'
 * - 'sasmitha'
 * - 'aksara'
 * - 'pustaka'
 * - 'sinengker'
 * 
 * @param {string} domain 
 * @param {Object} [options={}]
 * @returns {Promise<any>}
 */
export async function loadDomainData(domain, options = {}) {
  const dom = String(domain || '').toLowerCase().trim();
  if (!options.forceRefresh && domainCache.has(dom)) {
    return domainCache.get(dom);
  }

  try {
    let result = null;

    switch (dom) {
      case 'kalender': {
        const [rawConst, rawDino, rawMangsa, rawTetanen, rawPetenget, rawGede] = await Promise.all([
          loadDb('kalenderConstants').catch(() => null),
          loadDb('dinoRules').catch(() => null),
          loadDb('pranataMangsa').catch(() => null),
          loadDb('petungTetanen').catch(() => null),
          loadDb('wukuPetenget').catch(() => null),
          loadDb('dinoGede').catch(() => null)
        ]);

        const constants = mapKalenderConstants(rawConst);
        const dinoRules = mapDinoRules(rawDino || { dino_gede: rawGede });

        result = {
          constants,
          dinoRules,
          pranataMangsa: rawMangsa || [],
          petungTetanen: rawTetanen || fallbackTetanen.PETUNG_TETANEN_LIST,
          wukuPetenget: rawPetenget || fallbackWukuPetenget.WUKU_PETENGET_LIST
        };
        break;
      }

      case 'wuku': {
        const [rawWuku, rawPetenget] = await Promise.all([
          loadDb('wukuEnsiklopedia').catch(() => null),
          loadDb('wukuPetenget').catch(() => null)
        ]);

        let rawList = Array.isArray(rawWuku) ? rawWuku : (rawWuku?.wuku || fallbackPawukon.PAWUKON_LIST);
        const pawukonList = (rawList || fallbackPawukon.PAWUKON_LIST).map(mapWukuItem);

        result = {
          pawukonList,
          petengetList: rawPetenget || fallbackWukuPetenget.WUKU_PETENGET_LIST
        };
        break;
      }

      case 'jodoh':
      case 'perjodohan': {
        const [rawBilingual, rawAlt, rawAksara] = await Promise.all([
          loadDb('pitungPerjodohan').catch(() => null),
          loadDb('pitungPerjodohanAlt').catch(() => null),
          loadDb('aksaraPerjodohan').catch(() => null)
        ]);

        result = mapPitungPerjodohan(rawBilingual, rawAlt, rawAksara);
        break;
      }

      case 'nujum': {
        const [rawBincil, rawZodiak, rawShio, rawSasi, rawPasaran, rawKarakter, rawPekerjaan, rawPadewan] = await Promise.all([
          loadDb('bincilMatrix').catch(() => null),
          loadDb('zodiak').catch(() => null),
          loadDb('shioWuxing').catch(() => null),
          loadDb('sasiJawa').catch(() => null),
          loadDb('pasaranWatak').catch(() => null),
          loadDb('karakterDasar').catch(() => null),
          loadDb('pekerjaanWeton').catch(() => null),
          loadDb('siklusPadewan').catch(() => null)
        ]);

        result = {
          bincilMatrix: rawBincil || fallbackNujumMatrix.bincilDatabase,
          ketBincil: fallbackNujumMatrix.KET_BINCIL,
          zodiak: rawZodiak || [],
          shioWuxing: rawShio || [],
          sasiJawa: rawSasi || [],
          pasaranWatak: rawPasaran || [],
          karakterDasar: rawKarakter || [],
          pekerjaanWeton: rawPekerjaan || [],
          siklusPadewan: rawPadewan || []
        };
        break;
      }

      case 'selametan': {
        const rawSelametan = await loadDb('selametanRules').catch(() => null);
        result = mapSelametanRules(rawSelametan);
        break;
      }

      case 'ijab': {
        const rawIjab = await loadDb('ijab').catch(() => null);
        result = mapPetungIjab(rawIjab);
        break;
      }

      case 'omah': {
        const rawOmah = await loadDb('omah').catch(() => null);
        result = mapPetungOmah(rawOmah);
        break;
      }

      case 'petung-kehidupan':
      case 'ternak': {
        const rawTernak = await loadDb('petungTernak').catch(() => null);
        result = mapPetungKehidupan(rawTernak);
        break;
      }

      case 'sapa-dina': {
        const [rawTetanen, rawMangsa] = await Promise.all([
          loadDb('petungTetanen').catch(() => null),
          loadDb('pranataMangsa').catch(() => null)
        ]);
        result = {
          petungTetanen: rawTetanen || fallbackTetanen.PETUNG_TETANEN_LIST,
          pranataMangsa: rawMangsa || []
        };
        break;
      }

      case 'sasmitha': {
        const rawSasmitha = await loadDb('sasmitha').catch(() => null);
        result = rawSasmitha || {
          impen: fallbackSasmitha.SASMITHA_IMPEN,
          kedut: fallbackSasmitha.SASMITHA_KEDUT,
          gerhana: fallbackSasmitha.SASMITHA_GERAHANA,
          lindu: fallbackSasmitha.SASMITHA_LINDU,
          tejo: fallbackSasmitha.SASMITHA_TEJO
        };
        break;
      }

      case 'aksara': {
        const rawAksara = await loadDb('aksaraNglegena').catch(() => null);
        result = rawAksara || [];
        break;
      }

      case 'pustaka': {
        const [rawDongo, rawJawa] = await Promise.all([
          loadDb('pustakaDongo').catch(() => null),
          loadDb('pustakaJawa').catch(() => null)
        ]);
        result = {
          pustakaDongo: rawDongo || {},
          pustakaJawa: rawJawa || {}
        };
        break;
      }

      case 'sinengker': {
        const rawSinengker = await loadDb('sinengkerKhusus').catch(() => null);
        result = rawSinengker || {};
        break;
      }

      default:
        console.warn(`[dbLoader] Domain tidak terdaftar: "${domain}"`);
        return null;
    }

    if (result) {
      domainCache.set(dom, result);
    }
    return result;
  } catch (err) {
    console.warn(`[dbLoader] Gagal memuat domain "${domain}", menggunakan data cadangan:`, err);
    const fallback = getDomainFallback(dom);
    if (fallback) domainCache.set(dom, fallback);
    return fallback;
  }
}

/**
 * Mengambil fallback aman untuk domain jika fetch gagal (Zero Blank guarantee)
 * @param {string} domain 
 * @returns {any}
 */
export function getDomainFallback(domain) {
  const dom = String(domain || '').toLowerCase().trim();
  switch (dom) {
    case 'kalender':
      return {
        constants: mapKalenderConstants(null),
        dinoRules: mapDinoRules(null),
        pranataMangsa: [],
        petungTetanen: fallbackTetanen.PETUNG_TETANEN_LIST,
        wukuPetenget: fallbackWukuPetenget.WUKU_PETENGET_LIST
      };
    case 'wuku':
      return {
        pawukonList: (fallbackPawukon.PAWUKON_LIST || []).map(mapWukuItem),
        petengetList: fallbackWukuPetenget.WUKU_PETENGET_LIST
      };
    case 'jodoh':
    case 'perjodohan':
      return mapPitungPerjodohan(null, null, null);
    case 'nujum':
      return {
        bincilMatrix: fallbackNujumMatrix.bincilDatabase,
        ketBincil: fallbackNujumMatrix.KET_BINCIL,
        zodiak: [],
        shioWuxing: [],
        sasiJawa: [],
        pasaranWatak: [],
        karakterDasar: [],
        pekerjaanWeton: [],
        siklusPadewan: []
      };
    case 'selametan':
      return mapSelametanRules(null);
    case 'ijab':
      return mapPetungIjab(null);
    case 'omah':
      return mapPetungOmah(null);
    case 'petung-kehidupan':
    case 'ternak':
      return mapPetungKehidupan(null);
    case 'sapa-dina':
      return {
        petungTetanen: fallbackTetanen.PETUNG_TETANEN_LIST,
        pranataMangsa: []
      };
    case 'sasmitha':
      return {
        impen: fallbackSasmitha.SASMITHA_IMPEN,
        kedut: fallbackSasmitha.SASMITHA_KEDUT,
        gerhana: fallbackSasmitha.SASMITHA_GERAHANA,
        lindu: fallbackSasmitha.SASMITHA_LINDU,
        tejo: fallbackSasmitha.SASMITHA_TEJO
      };
    default:
      return null;
  }
}

/**
 * Mengambil domain data secara sinkron dari cache lokal jika sudah tersedia
 * @param {string} domain 
 * @returns {any}
 */
export function getDomainDataSync(domain) {
  const dom = String(domain || '').toLowerCase().trim();
  if (domainCache.has(dom)) return domainCache.get(dom);
  return getDomainFallback(dom);
}

// ─── WINDOW EXPORTS UNTUK INTEGRASI WEB ─────────────────────────────────────
if (typeof window !== 'undefined') {
  window.dbLoader = {
    load: loadDb,
    loadSync: loadDbSync,
    loadDb,
    loadDbSync,
    getDbSync,
    getDb: loadDb,
    loadDomainData,
    getDomainDataSync,
    getDomainFallback,
    clearCache: clearDbCache,
    preload: preloadDatabases,
    getBilingualText,
    mapWukuItem,
    mapRecordAliases,
    DB_FILES,
    DB_ALIASES
  };
}

export default {
  load: loadDb,
  loadSync: loadDbSync,
  loadDb,
  loadDbSync,
  getDbSync,
  getDb: loadDb,
  loadDomainData,
  getDomainDataSync,
  getDomainFallback,
  clearCache: clearDbCache,
  preload: preloadDatabases,
  getBilingualText,
  mapWukuItem,
  mapRecordAliases,
  mapKalenderConstants,
  mapDinoRules,
  mapPitungPerjodohan,
  mapSelametanRules,
  mapPetungIjab,
  mapPetungOmah,
  mapPetungKehidupan,
  DB_FILES,
  DB_ALIASES
};
