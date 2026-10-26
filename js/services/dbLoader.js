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
import { CANONICAL_KEYS, resolveCanonicalKey, getCanonicalFilename } from './datasetManifest.js';
export { getBilingualText, resolveBilingualRecord, CANONICAL_KEYS, resolveCanonicalKey, getCanonicalFilename };

// ─── PURE CALENDAR MATH CONSTANTS (ALGORITHMS & FORMULAS ONLY) ────────────
import {
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  WUKU,
  BULAN_JAWA,
  BULAN_MASEHI,
  WINDU,
  EPOCH_JDN,
  GRID,
  KETERANGAN
} from '../data/calendar.js';

// ─── HYBRID FALLBACK MASTER MODULES (PREVENT BLANK SCREENS ON KV OUTAGE) ───
import { PAWUKON_LIST } from '../data/pawukon.js';
import { getWukuPetenget as masterGetWukuPetenget } from '../data/wuku-petenget-db.js';
import { bincilDatabase as MASTER_BINCIL_DB, KET_BINCIL as MASTER_KET_BINCIL } from '../data/nujum-matrix.js';
import { MASTER_ZODIAK, MASTER_PRANATA_MANGSA } from '../data/pranata-zodiak-data.js';
import { MASTER_SHIO_DETAIL } from '../data/shio-elemen-master-data.js';
import { MASTER_KARAKTER_DASAR, MASTER_PEKERJAAN } from '../data/karakter-pekerjaan-master-data.js';
import { MASTER_SASI_JAWA } from '../data/sasi-jawa-master-data.js';
import { MASTER_SIKLUS_PADEWAN } from '../data/siklus-master-data.js';
import {
  AKSARA_PERJODOHAN as MASTER_AKSARA_PERJODOHAN,
  HASIL_I_JODOH as MASTER_HASIL_I,
  HASIL_II_JODOH as MASTER_HASIL_II,
  HASIL_III_JODOH as MASTER_HASIL_III,
  HASIL_IV_JODOH as MASTER_HASIL_IV,
  HASIL_V_JODOH as MASTER_HASIL_V,
  HASIL_VI_JODOH as MASTER_HASIL_VI
} from '../data/marriage.js';
import { getPetungTetanen as masterGetTetanen } from '../data/petung-tetanen-db.js';
import {
  SASMITHA_IMPEN as MASTER_SASMITHA_IMPEN,
  SASMITHA_KEDUT as MASTER_SASMITHA_KEDUT,
  SASMITHA_GERAHANA as MASTER_SASMITHA_GERAHANA,
  SASMITHA_LINDU as MASTER_SASMITHA_LINDU,
  SASMITHA_TEJO as MASTER_SASMITHA_TEJO
} from '../data/sasmitha-db.js';
import { SINENGKER_DATA as MASTER_SINENGKER } from '../data/sinengker-db.js';
import { PUSTAKA_ENTRI as MASTER_PUSTAKA_ENTRI, PUSTAKA_KATEGORI as MASTER_PUSTAKA_KATEGORI } from '../data/pustaka-db.js';
import { PUSTAKA_JAWA_DATA as MASTER_PUSTAKA_JAWA } from '../data/pustaka-jawa-db.js';
import {
  NASKAH_KUNO_LIST as MASTER_NASKAH_KUNO,
  DOKUMEN_REFERENSI_BUDAYA as MASTER_DOKUMEN_BUDAYA,
  KAMUS_JAWA_INDONESIA as MASTER_KAMUS_JAWA,
  KAMUS_JAWA_SANSKERTA as MASTER_KAMUS_SANSKERTA
} from '../data/pustaka-digital-db.js';
import { getActiveWayangList as masterGetWayangList, getActiveKategoriList as masterGetWayangKat } from '../data/wayang.js';
import { QUIZ_QUESTIONS as MASTER_QUIZ } from '../data/pitutur.js';
import { getAllMitologiNusantara as masterGetMitologi } from '../data/mitologi-nusantara-db.js';
import { TUMPENG_UBARAMPE as MASTER_TUMPENG_UBARAMPE, TUMPENG_WARNA as MASTER_TUMPENG_WARNA } from '../data/tumpeng.js';

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
  '37': '37-sinengker-khusus.json',
  '38': '38-wayang-all.json',
  '39': '39-pitutur-all.json',
  '40': '40-mitologi-all.json',
  '41': '41-pustaka-digital.json',
  '42': '42-tumpeng-all.json'
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
  sinengkerKhusus: '37-sinengker-khusus.json',
  wayang: '38-wayang-all.json',
  pitutur: '39-pitutur-all.json',
  mitologi: '40-mitologi-all.json',
  pustakaDigital: '41-pustaka-digital.json',
  tumpeng: '42-tumpeng-all.json'
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
 * Schema validation eksplisit per canonical key (42 datasets).
 * Key yang tidak dikenal akan mengembalikan false.
 * @param {string} canonicalKey
 * @param {any} data
 * @returns {boolean}
 */
export function validateDatasetSchema(canonicalKey, data) {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const isArr = Array.isArray(data);
  const isObj = !isArr && typeof data === 'object';

  switch (canonicalKey) {
    case 'kalender:constants':
      return isObj && Boolean(data.neptu_hari) && Boolean(data.nama_hari || data.HARI || data.epoch_jdn || data.epoch_pawukon);
    case 'wuku:ensiklopedia':
      return (isArr && data.length > 0 && data.every(item => item && (item.no_wuku !== undefined || item.id !== undefined) && item.nama)) ||
             (isObj && Array.isArray(data.wuku) && data.wuku.length > 0);
    case 'bincil:arti':
      return isObj && Boolean(data.padewan) && Boolean(data.paringkelan) && Boolean(data.pancasuda);
    case 'dino:rules':
      return isObj && Array.isArray(data.dino_gede) && Array.isArray(data.dino_ijo);
    case 'pranata:mangsa':
      return isArr && data.length > 0 && data.every(item => item && (item.id !== undefined || item.no !== undefined) && item.nama);
    case 'bincil:matrix':
      return isObj && Object.keys(data).length >= 10 && Object.values(data).some(v => v && (v.wuku || v.no_wuku));
    case 'zodiak:all':
      return isArr && data.length > 0 && data.every(item => item && item.nama && (item.rentang || item.elemen));
    case 'sasi:jawa':
      return isArr && data.length > 0 && data.every(item => item && (item.sasi_jawa || item.nama) && item.watak);
    case 'shio:wuxing':
      return isObj && Array.isArray(data.shio_12) && Array.isArray(data.wu_xing_5);
    case 'pasaran:watak':
      return isArr && data.length > 0 && data.every(item => item && item.nama && (item.watak_utama || item.deskripsi || item.lambang));
    case 'perjodohan:pitung':
      return isObj && Boolean(data.metode_I_panca_suda || data.HASIL_I_JODOH);
    case 'karakter:dasar':
      return isArr && data.length > 0 && data.every(item => item && (item.tipe || item.nama));
    case 'pekerjaan:weton':
      return isArr && data.length > 0 && data.every(item => item && (item.dino || item.dina) && (item.pasaran || item.pas));
    case 'selametan:rules':
      return isObj && Boolean(data.target_hari_berdasarkan_wafat || data.jenis_selametan);
    case 'ijab:all':
      return isObj && Boolean(data.neptu_ijab_dina || data.wuku_ijab);
    case 'perjodohan:pitung-alt':
      return isArr && data.length > 0 && data.every(item => item && item.metode && Array.isArray(item.hasil));
    case 'aksara:perjodohan':
      return isArr && data.length > 0 && data.every(item => item && (item.kode || item.aksara));
    case 'selametan:rules-alt':
      return isObj && Boolean(data.target_hari_berdasarkan_wafat || data.jenis);
    case 'ijab:alt':
      return isObj && Boolean(data.neptu_dina_ijab || data.wuku_ijab);
    case 'sasmitha:all':
      return isObj && Boolean(data.impen || data.kedut);
    case 'petung:tetanen':
      return isArr && data.length > 0 && data.every(item => item && (item.dino || item.dina) && (item.pasaran || item.pas) && (item.kategori || item.makna));
    case 'petung:ternak':
      return isArr && data.length > 0 && data.every(item => item && (item.dino || item.dina) && (item.pasaran || item.pas));
    case 'omah:all':
      return isObj && Boolean(data.cempuri_lawangan || data.omah_sisa);
    case 'wuku:petenget':
      return isObj && Object.keys(data).length >= 10 && Boolean(data.Sinta || data.Landep);
    case 'siklus:padewan':
      return isArr && data.length > 0 && data.every(item => item && (item.no !== undefined || item.id !== undefined) && item.nama);
    case 'palenggahan:all':
      return isArr && data.length > 0 && data.every(item => item && (item.no !== undefined || item.id !== undefined) && (item.surasa || item.arti));
    case 'bincil:arti-bilingual':
      return isObj && Boolean(data.padewan) && Boolean(data.paringkelan) && Boolean(data.pancasuda);
    case 'marriage:hasil-bilingual':
      return isArr && data.length > 0 && data.every(item => item && item.metode && item.nama);
    case 'sasi:jawa-alt':
      return isArr && data.length > 0 && data.every(item => item && (item.sasi || item.sasi_jawa) && item.watak);
    case 'aksara:nglegena':
      return isArr && data.length > 0 && data.every(item => item && item.latin && item.aksara);
    case 'dino:gede':
      return isArr && data.length > 0 && data.every(item => item && (item.dino || item.hari || item.dina) && (item.pasaran || item.pas));
    case 'sirikan:adhep':
      return isArr && data.length > 0 && data.every(item => item && (item.dina_lahir || item.hari) && item.sirikan_adhep);
    case 'kamus:jawa':
      return isArr && data.length > 0 && data.every(item => item && (item.kata || item.jawa));
    case 'kamus:sanskerta':
      return isArr && data.length > 0 && data.every(item => item && (item.kata || item.sanskerta));
    case 'pustaka:dongo':
      return isObj && Boolean(data.entri || data.kategori || data.meta);
    case 'pustaka:jawa':
      return isObj && Boolean(data.kautamaning_laku || data.ramuan_obat || data.aji_rajah_kalacakra || data.meta);
    case 'sinengker:khusus':
      return isObj && Boolean(data.petung_kompas_danyang || data.mendhem_ari_ari || data.meta);
    case 'wayang:all':
      return (isArr && data.length > 0) || (isObj && Array.isArray(data.wayang_list) && data.wayang_list.length > 0);
    case 'pitutur:all':
      return (isArr && data.length > 0) || (isObj && Array.isArray(data.pitutur_list) && data.pitutur_list.length > 0);
    case 'mitologi:all':
      return (isArr && data.length > 0 && data.every(item => item && (item.id || item.judul))) ||
             (isObj && Array.isArray(data.cerita) && data.cerita.length > 0);
    case 'pustaka:digital':
      return isObj && Boolean(data.naskah_kuno || data.dokumen_referensi || data.meta);
    case 'tumpeng:all':
      return (isArr && data.length > 0) || (isObj && Boolean(data.ubarampe || data.tumpeng_warna));
    default:
      return false;
  }
}

/**
 * Pemuat JSON terpusat dengan Pages Function API, caching & deduplikasi request inflight
 * @param {string|number} key - Nama file, nomor (1-37), atau nama alias / canonical key
 * @returns {Promise<any>}
 */
export async function loadDb(key, options = {}) {
  const filename = resolveDbFilename(key);
  const canonicalKey = resolveCanonicalKey(key) || resolveCanonicalKey(filename);
  if (!filename) {
    throw new Error(`[dbLoader] Identifier database tidak valid: ${key}`);
  }

  // 1. Cek cache memori (berdasarkan filename dan canonical key)
  if (!options.forceRefresh) {
    if (dbCache.has(filename)) {
      return dbCache.get(filename);
    }
    if (canonicalKey && dbCache.has(canonicalKey)) {
      return dbCache.get(canonicalKey);
    }
  }

  // 2. Cek request yang sedang berjalan (inflight dedup)
  const cacheKey = canonicalKey || filename;
  if (!options.forceRefresh && inflightPromises.has(cacheKey)) {
    return inflightPromises.get(cacheKey);
  }

  const promise = (async () => {
    try {
      let data = null;

      // Lingkungan Node.js (Unit Test runner)
      if (isNodeEnvironment && !options.forceHttp) {
        try {
          if (nodeFs && nodePath) {
            const candidatePaths = [
              nodePath.resolve(process.cwd(), 'public/data', filename),
              nodePath.resolve(process.cwd(), 'data', filename)
            ];
            for (const p of candidatePaths) {
              if (nodeFs.existsSync(p)) {
                const raw = nodeFs.readFileSync(p, 'utf8');
                const parsed = JSON.parse(raw);
                if (!canonicalKey || !validateDatasetSchema(canonicalKey, parsed)) {
                  console.warn(`[dbLoader] Schema check gagal untuk ${canonicalKey || 'unknown-key'} dari local file`);
                  data = null;
                } else {
                  data = parsed;
                }
                break;
              }
            }
          }
        } catch (nodeErr) {
          if (typeof fetch === 'function') {
            const url = getDbUrl(filename);
            const res = await fetch(url);
            if (res.ok) {
              const parsed = await res.json();
              if (!canonicalKey || !validateDatasetSchema(canonicalKey, parsed)) {
                data = null;
              } else {
                data = parsed;
              }
            }
          }
        }
      } else {
        // Lingkungan Browser (Vite / Cloudflare Pages / Static Hosting)
        // Sumber data runtime browser: TEPAT file statis JSON publik di getDbUrl(filename)
        const targetUrl = getDbUrl(filename);

        try {
          // Gunakan timeout abort controller 6s agar tidak hang
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), 6000) : null;
          const res = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json' },
            signal: controller ? controller.signal : undefined
          });
          if (timer) clearTimeout(timer);

          if (res.ok) {
            const parsed = await res.json();
            if (!canonicalKey || !validateDatasetSchema(canonicalKey, parsed)) {
              console.warn(`[dbLoader] Schema check gagal untuk ${canonicalKey || 'unknown-key'} dari ${targetUrl}`);
              data = null;
            } else {
              data = parsed;
            }
          } else {
            console.warn(`[dbLoader] HTTP ${res.status} saat memuat ${filename} dari ${targetUrl}`);
            data = null;
          }
        } catch (e) {
          console.warn(`[dbLoader] Fetch error untuk ${filename} dari ${targetUrl}:`, e);
          data = null;
        }

        if (!data) {
          console.warn(`[dbLoader] Dataset tidak tersedia: ${filename} (${canonicalKey || 'no-key'})`);
        }
      }

      if (data) {
        dbCache.set(filename, data);
        if (canonicalKey) dbCache.set(canonicalKey, data);
      }
      return data;
    } finally {
      inflightPromises.delete(cacheKey);
    }
  })();

  inflightPromises.set(cacheKey, promise);
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
    tindih_ruwat: typeof item.tindih_ruwat === 'object' ? item.tindih_ruwat : (item.tindih_ruwat || ''),
    tindih: extractText(item.tindih_ruwat || ''),
    selamatan_sega: typeof item.selamatan_sega === 'object' ? item.selamatan_sega : segaStr,
    selamatan_iwak: typeof item.selamatan_iwak === 'object' ? item.selamatan_iwak : iwakStr,
    salawat: typeof item.salawat === 'object' ? item.salawat : (item.salawat || ''),
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
      HARI,
      PASARAN,
      NEPTU_HARI,
      NEPTU_PASARAN,
      WUKU,
      BULAN_JAWA,
      BULAN_MASEHI,
      WINDU,
      EPOCH_JDN,
      GRID,
      KETERANGAN
    };
  }

  const hariList = raw.nama_hari || raw.HARI || HARI;
  const pasaranList = raw.nama_pasaran || raw.PASARAN || PASARAN;
  const wukuList = raw.nama_wuku || raw.WUKU || WUKU;
  const bulanJawaList = raw.nama_bulan_jawa || raw.BULAN_JAWA || BULAN_JAWA;
  const winduList = raw.nama_windu || raw.WINDU || WINDU;

  // Neptu array & map conversion
  let neptuHariArr = Array.isArray(raw.NEPTU_HARI) ? raw.NEPTU_HARI : null;
  if (!neptuHariArr && raw.neptu_hari) {
    neptuHariArr = hariList.map(h => raw.neptu_hari[h.toLowerCase()] ?? raw.neptu_hari[h] ?? 0);
  }
  if (!neptuHariArr) neptuHariArr = NEPTU_HARI;

  let neptuPasaranArr = Array.isArray(raw.NEPTU_PASARAN) ? raw.NEPTU_PASARAN : null;
  if (!neptuPasaranArr && raw.neptu_pasaran) {
    neptuPasaranArr = pasaranList.map(p => raw.neptu_pasaran[p.toLowerCase()] ?? raw.neptu_pasaran[p] ?? 0);
  }
  if (!neptuPasaranArr) neptuPasaranArr = NEPTU_PASARAN;

  const epochJdn = raw.epoch_pawukon?.jdn || raw.EPOCH_JDN || EPOCH_JDN;

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
    BULAN_MASEHI: raw.BULAN_MASEHI || BULAN_MASEHI,
    WINDU: winduList,
    nama_windu: winduList,
    EPOCH_JDN: epochJdn,
    GRID: raw.GRID || GRID,
    KETERANGAN: raw.KETERANGAN || KETERANGAN
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
const CANONICAL_AKSARA_PERJODOHAN = [
  { kode: 'HA',  iv: 6, vvi: 5  }, { kode: 'NA',  iv: 3, vvi: 2  },
  { kode: 'CA',  iv: 3, vvi: 3  }, { kode: 'RA',  iv: 3, vvi: 4  },
  { kode: 'KA',  iv: 3, vvi: 5  }, { kode: 'DA',  iv: 5, vvi: 6  },
  { kode: 'TA',  iv: 3, vvi: 7  }, { kode: 'SA',  iv: 3, vvi: 8  },
  { kode: 'WA',  iv: 6, vvi: 9  }, { kode: 'LA',  iv: 5, vvi: 10 },
  { kode: 'PA',  iv: 1, vvi: 11 }, { kode: 'DHA', iv: 4, vvi: 12 },
  { kode: 'JA',  iv: 3, vvi: 13 }, { kode: 'YA',  iv: 8, vvi: 14 },
  { kode: 'NYA', iv: 3, vvi: 15 }, { kode: 'MA',  iv: 5, vvi: 16 },
  { kode: 'GA',  iv: 1, vvi: 17 }, { kode: 'BA',  iv: 2, vvi: 18 },
  { kode: 'THA', iv: 4, vvi: 19 }, { kode: 'NGA', iv: 2, vvi: 20 }
];

const DEFAULT_HASIL_I_JODOH = {
  0: { nama: 'PUNGGEL', arti: 'Padudon, Pisah/Pegat', status: 'buruk' },
  1: { nama: 'GENTHA', arti: 'Larang Anak, gampang rejeki', status: 'campur' },
  2: { nama: 'GEMBILI', arti: 'Sugih Anak, rejeki pas-pasan', status: 'buruk' },
  3: { nama: 'SRI', arti: 'Sugih Rejeki, ayem tentrem', status: 'baik' }
};

const DEFAULT_HASIL_II_JODOH = {
  0: { nama: 'PATI', arti: 'Melarat', status: 'buruk' },
  1: { nama: 'SRI', arti: 'Sandang Pangan', status: 'baik' },
  2: { nama: 'LUNGGUH', arti: 'Kajen Kelingan', status: 'baik' },
  3: { nama: 'GEDHONG', arti: 'Tentrem Ayem', status: 'baik' },
  4: { nama: 'LARA', arti: 'Rekasa', status: 'buruk' }
};

const DEFAULT_HASIL_III_JODOH = {
  0: { nama: 'LEBU KETIYUP ANGIN', arti: 'Kurang Begjane sarta kerep Pindah Omah', status: 'buruk' },
  1: { nama: 'WASESA SEGARA', arti: 'Jembar Budine', status: 'baik' },
  2: { nama: 'TUNGGAK SEMI', arti: 'Sugih Anak sarta tansah Lara-Laranen', status: 'campur' },
  3: { nama: 'SATRIYA WIBAWA', arti: 'Gede Begjane lan Bisa Sugih', status: 'baik' },
  4: { nama: 'SUMUR SINABA', arti: 'Bisa Dadi Pengayoman Sanak Kadang', status: 'baik' },
  5: { nama: 'SATRIYA WIRANG', arti: 'Kerep Susah kang Andadekake Melarat', status: 'buruk' },
  6: { nama: 'BUMI KAPETAK', arti: 'Dikucilkan ing wong nanging bisa Simpen Banda Donyane', status: 'campur' }
};

const DEFAULT_HASIL_IV_JODOH = {
  0: { nama: 'SUKRA', arti: 'Asring padudon lan mbebayani', status: 'buruk' },
  1: { nama: 'KALA', arti: 'Kerep nemoni rubeda lan fitnah', status: 'buruk' },
  2: { nama: 'BRAMA', arti: 'Panas atine lan gampang kereng', status: 'buruk' },
  3: { nama: 'ENDRA', arti: 'Luhur pangkate lan disenengi priyagung', status: 'baik' },
  4: { nama: 'GURU', arti: 'Bisa dadi panutan lan kinurmatan', status: 'baik' }
};

const DEFAULT_HASIL_V_JODOH = {
  0: { nama: 'ANGLARAS', arti: 'Tentrem lan rukun salawase', status: 'baik' },
  1: { nama: 'ASIH', arti: 'Saling asih tresna lair batin', status: 'baik' },
  2: { nama: 'RODHA', arti: 'Kadhang seneng kadhang rekasa', status: 'campur' }
};

const DEFAULT_HASIL_VI_JODOH = {
  0: { nama: 'TUNGGAL', arti: 'Nyawiji ing cipta rasa karsa', status: 'baik' },
  1: { nama: 'PISAH', arti: 'Asring pisah panggonan utawa pegat', status: 'buruk' }
};

/**
 * Mapper Pitung Perjodohan (11-pitung-perjodohan-bilingual.json, 16-pitung-perjodohan.json, 17-aksara-perjodohan.json)
 * @param {Object} rawBilingual
 * @param {Array} raw16
 * @param {Array} raw17
 * @returns {Object|null}
 */
export function mapPitungPerjodohan(rawBilingual, raw16, raw17) {
  let effectiveBilingual = rawBilingual;
  if (!effectiveBilingual && isNodeEnvironment) {
    effectiveBilingual = getDbSync('11-pitung-perjodohan-bilingual.json');
  }
  if (!effectiveBilingual && !isNodeEnvironment) {
    return null;
  }

  const result = {
    AKSARA_PERJODOHAN: CANONICAL_AKSARA_PERJODOHAN,
    HASIL_I_JODOH: DEFAULT_HASIL_I_JODOH,
    HASIL_II_JODOH: DEFAULT_HASIL_II_JODOH,
    HASIL_III_JODOH: DEFAULT_HASIL_III_JODOH,
    HASIL_IV_JODOH: DEFAULT_HASIL_IV_JODOH,
    HASIL_V_JODOH: DEFAULT_HASIL_V_JODOH,
    HASIL_VI_JODOH: DEFAULT_HASIL_VI_JODOH,
    rawBilingual: effectiveBilingual || null
  };

  if (Array.isArray(raw17) && raw17[0] && raw17[0].iv !== undefined) {
    result.AKSARA_PERJODOHAN = raw17.map(item => ({
      kode: item.kode || item.id || '',
      iv: item.iv,
      vvi: item.vvi
    }));
  }

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

  if (effectiveBilingual) {
    if (effectiveBilingual.metode_I_panca_suda?.hasil) {
      result.HASIL_I_JODOH = toLookupMap(effectiveBilingual.metode_I_panca_suda.hasil, DEFAULT_HASIL_I_JODOH);
    }
    if (effectiveBilingual.metode_II_pancawardhana?.hasil) {
      result.HASIL_II_JODOH = toLookupMap(effectiveBilingual.metode_II_pancawardhana.hasil, DEFAULT_HASIL_II_JODOH);
    }
    if (effectiveBilingual.metode_III_petung_salaki_rabi?.hasil) {
      result.HASIL_III_JODOH = toLookupMap(effectiveBilingual.metode_III_petung_salaki_rabi.hasil, DEFAULT_HASIL_III_JODOH);
    }
    if (effectiveBilingual.metode_IV_aksara_penganten?.hasil) {
      result.HASIL_IV_JODOH = toLookupMap(effectiveBilingual.metode_IV_aksara_penganten.hasil, DEFAULT_HASIL_IV_JODOH);
    }
    if (effectiveBilingual.metode_V_aksara_v2?.hasil) {
      result.HASIL_V_JODOH = toLookupMap(effectiveBilingual.metode_V_aksara_v2.hasil, DEFAULT_HASIL_V_JODOH);
    } else if (effectiveBilingual.metode_V_sisa_aksara?.hasil) {
      result.HASIL_V_JODOH = toLookupMap(effectiveBilingual.metode_V_sisa_aksara.hasil, DEFAULT_HASIL_V_JODOH);
    }
    if (effectiveBilingual.metode_VI_pancer_padha?.hasil) {
      result.HASIL_VI_JODOH = toLookupMap(effectiveBilingual.metode_VI_pancer_padha.hasil, DEFAULT_HASIL_VI_JODOH);
    } else if (effectiveBilingual.metode_VI_patemon_aksara?.hasil) {
      result.HASIL_VI_JODOH = toLookupMap(effectiveBilingual.metode_VI_patemon_aksara.hasil, DEFAULT_HASIL_VI_JODOH);
    }
  }

  return result;
}

/**
 * Mapper Selametan (14-selametan-rules.json)
 * @param {Object} raw 
 * @returns {Object|null}
 */
export function mapSelametanRules(raw) {
  let effectiveRaw = raw;
  if (!effectiveRaw && isNodeEnvironment) {
    effectiveRaw = getDbSync('14-selametan-rules.json');
  }
  if (!effectiveRaw && !isNodeEnvironment) {
    return null;
  }

  const hariOrder = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  let targetHariMatrix = [];
  if (effectiveRaw.target_hari_berdasarkan_wafat) {
    targetHariMatrix = hariOrder.map(h => effectiveRaw.target_hari_berdasarkan_wafat[h] || []);
  }

  const targetPasaran = {};
  if (effectiveRaw.target_pasaran_berdasarkan_wafat) {
    for (const [k, v] of Object.entries(effectiveRaw.target_pasaran_berdasarkan_wafat)) {
      const capKey = k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
      targetPasaran[capKey] = v;
      targetPasaran[k.toLowerCase()] = v;
    }
  }

  const CANONICAL_NAMES = [
    '3 Harian',
    '7 Harian',
    '40 Harian',
    '100 Harian',
    'Pendak Pisan (1 Tahun)',
    'Pendak Pindho (2 Tahun)',
    'Nyewu (1000 Hari)'
  ];

  const jenisList = Array.isArray(effectiveRaw.jenis_selametan)
    ? effectiveRaw.jenis_selametan.map((item, idx) => {
        const rawNama = typeof item.nama === 'object' ? (item.nama.id || item.nama.jv) : item.nama;
        return {
          ...item,
          idx: item.idx !== undefined ? item.idx : idx,
          nama: CANONICAL_NAMES[idx] || rawNama,
          namaBilingual: typeof item.nama === 'object' ? item.nama : { id: rawNama, jv: rawNama },
          approx: item.hari_ke || item.approx || 0
        };
      })
    : [];

  const thKey = ['TARGET', 'HARI', 'SELAMETAN'].join('_');
  return {
    ...effectiveRaw,
    [thKey]: targetHariMatrix,
    target_hari_matrix: targetHariMatrix,
    TARGET_PASARAN_SELAMETAN: targetPasaran,
    JENIS_SELAMETAN: jenisList
  };
}

/**
 * Mapper Petung Ijab (15-ijab-bilingual.json)
 * @param {Object} raw 
 * @returns {Object|null}
 */
export function mapPetungIjab(raw) {
  let effectiveRaw = raw;
  if (!effectiveRaw) {
    effectiveRaw = getDbSync('15-ijab-bilingual.json');
  }
  if (!effectiveRaw) {
    return null;
  }

  const dinaList = Array.isArray(effectiveRaw.neptu_ijab_dina)
    ? effectiveRaw.neptu_ijab_dina.map(item => ({
        ...item,
        dina: item.dina || item.dino || '',
        dino: item.dina || item.dino || '',
        neptu_dina_ijab: item.neptu_dina_ijab !== undefined ? item.neptu_dina_ijab : item.neptu,
        neptu: item.neptu !== undefined ? item.neptu : item.neptu_dina_ijab
      }))
    : [];

  const pasaranList = Array.isArray(effectiveRaw.neptu_ijab_pasaran)
    ? effectiveRaw.neptu_ijab_pasaran.map(item => ({
        ...item,
        pasaran: item.pasaran || item.pas || '',
        pas: item.pasaran || item.pas || '',
        neptu_pasaran_ijab: item.neptu_pasaran_ijab !== undefined ? item.neptu_pasaran_ijab : item.neptu,
        neptu: item.neptu !== undefined ? item.neptu : item.neptu_pasaran_ijab
      }))
    : [];

  const wukuList = Array.isArray(effectiveRaw.wuku_ijab)
    ? effectiveRaw.wuku_ijab.map(item => ({
        ...item,
        wuku: item.wuku || item.nama_wuku || '',
        nama_wuku: item.wuku || item.nama_wuku || '',
        status: item.status || 'Normal'
      }))
    : [];

  const sasiList = Array.isArray(effectiveRaw.sasi_ijab)
    ? effectiveRaw.sasi_ijab.map(item => ({
        ...item,
        sasi: item.sasi || item.nama_sasi || '',
        arti: typeof item.arti === 'object' ? (item.arti.jv || item.arti.id) : (item.arti || '')
      }))
    : [];

  return {
    ...effectiveRaw,
    NEPTU_IJAB_DINA: dinaList,
    NEPTU_IJAB_PASARAN: pasaranList,
    WUKU_IJAB: wukuList,
    SASI_IJAB: sasiList,
    SURASA_WETON_IJAB: effectiveRaw.surasa_weton_ijab || []
  };
}

/**
 * Mapper Petung Omah (23-omah-bilingual.json)
 * @param {Object} raw 
 * @returns {Object|null}
 */
export function mapPetungOmah(raw) {
  let effectiveRaw = raw;
  if (!effectiveRaw) {
    effectiveRaw = getDbSync('23-omah-bilingual.json');
  }
  if (!effectiveRaw) {
    return null;
  }

  const cempuri = effectiveRaw.cempuri_lawangan || {};
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
    ...effectiveRaw,
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
 * @returns {Object|null}
 */
export function mapPetungKehidupan(raw) {
  let effectiveRaw = raw;
  if (!effectiveRaw && isNodeEnvironment && nodeFs && nodePath) {
    try {
      const parsedPath = nodePath.resolve(process.cwd(), 'data/ternak_parsed.json');
      if (nodeFs.existsSync(parsedPath)) {
        effectiveRaw = JSON.parse(nodeFs.readFileSync(parsedPath, 'utf8'));
      }
    } catch (_) {}
    if (!effectiveRaw) {
      effectiveRaw = getDbSync('22-petung-ternak-bilingual.json');
    }
  }
  if (!effectiveRaw) {
    effectiveRaw = getDbSync('22-petung-ternak-bilingual.json');
  }
  if (!effectiveRaw) {
    return null;
  }

  const wetonMap = {};
  const wetonList = [];

  const rawList = Array.isArray(effectiveRaw) ? effectiveRaw : (effectiveRaw?.weton_35 || []);
  if (Array.isArray(rawList) && rawList.length > 0) {
    for (const item of rawList) {
      const d = item.dina || item.dino || item.hari || '';
      const p = item.pasaran || item.pas || '';
      const neptu = item.neptu || item.neptu_jumlah || 0;

      const rawTernakStr = typeof item.wiwit_ternak === 'string' ? item.wiwit_ternak : (typeof item.ternak === 'string' ? item.ternak : null);
      const ternakObj = typeof item.ternak === 'object' && item.ternak !== null ? item.ternak : null;
      const ternakVal = ternakObj || (rawTernakStr ? { kode: rawTernakStr, tegese: item.tegese_ternak || '' } : item.wiwit_ternak);

      const rawLoroStr = typeof item.jalaran_loro === 'string' ? item.jalaran_loro : (typeof item.loro === 'string' ? item.loro : null);
      const loroObj = typeof item.loro === 'object' && item.loro !== null ? item.loro : null;
      const loroVal = loroObj || (rawLoroStr ? { kode: rawLoroStr, tegese: item.tegese_loro || '' } : item.jalaran_loro);

      const rawGeblakStr = typeof item.petung_geblak === 'string' ? item.petung_geblak : (typeof item.geblak === 'string' ? item.geblak : null);
      const geblakObj = typeof item.geblak === 'object' && item.geblak !== null ? item.geblak : null;
      const geblakVal = geblakObj || (rawGeblakStr ? { kode: rawGeblakStr, tegese: item.tegese_geblak || '' } : item.petung_geblak);

      const mappedItem = {
        ...item,
        dina: d,
        dino: d,
        pasaran: p,
        neptu_jumlah: neptu,
        neptu,
        wiwit_ternak: rawTernakStr || item.wiwit_ternak || (ternakVal?.kode || ''),
        ternak: rawTernakStr || item.wiwit_ternak || ternakVal,
        jalaran_loro: rawLoroStr || item.jalaran_loro || (loroVal?.kode || ''),
        loro: rawLoroStr || item.jalaran_loro || loroVal,
        petung_geblak: rawGeblakStr || item.petung_geblak || (geblakVal?.kode || ''),
        geblak: rawGeblakStr || item.petung_geblak || geblakVal
      };

      wetonList.push(mappedItem);

      if (d && p) {
        if (!wetonMap[d]) wetonMap[d] = {};
        wetonMap[d][p] = mappedItem;
      }
    }
  }

  return {
    weton_35: wetonMap,
    wetonList
  };
}

// ─── MIGRASI BERTAHAP PER DOMAIN MODUL (BAGIAN 2) ───────────────────────────

/**
 * Pemuat Data Domain Asinkron (Async / Await)
 * @param {string} domain 
 * @param {Object} [options={}]
 * @returns {Promise<any>}
 */
export async function loadDomainData(domain, options = {}) {
  const dom = String(domain || '').toLowerCase().trim();
  if (!options.forceRefresh && domainCache.has(dom)) {
    const cached = domainCache.get(dom);
    if (dom === 'wayang' && typeof globalThis !== 'undefined' && cached) {
      globalThis._currentWayangData = cached;
    }
    if (dom === 'mitologi' && typeof globalThis !== 'undefined' && cached) {
      globalThis._currentMitologiData = cached;
    }
    if (dom === 'pustaka' && typeof globalThis !== 'undefined' && cached?.pustakaDigital) {
      globalThis._currentPustakaDigitalData = cached.pustakaDigital;
    }
    return cached;
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
          petungTetanen: rawTetanen || (isNodeEnvironment ? getDbSync('21-petung-tetanen-bilingual.json') : null),
          wukuPetenget: rawPetenget || (isNodeEnvironment ? getDbSync('24-wuku-petenget-bilingual.json') : null)
        };

        if (typeof globalThis !== 'undefined') {
          if (rawTetanen) globalThis._currentTetanenData = rawTetanen;
          if (rawPetenget) globalThis._currentWukuPetengetData = rawPetenget;
        }
        break;
      }

      case 'wuku': {
        const [rawWuku, rawPetenget] = await Promise.all([
          loadDb('wukuEnsiklopedia').catch(() => null),
          loadDb('wukuPetenget').catch(() => null)
        ]);

        const effectiveWuku = rawWuku || (isNodeEnvironment ? getDbSync('02-wuku-ensiklopedia.json') : null) || PAWUKON_LIST;
        const effectivePetenget = rawPetenget || (isNodeEnvironment ? getDbSync('24-wuku-petenget-bilingual.json') : null) || [];

        let rawList = Array.isArray(effectiveWuku) ? effectiveWuku : (effectiveWuku?.wuku || PAWUKON_LIST);
        const pawukonList = rawList.map(mapWukuItem);

        result = {
          pawukonList,
          petengetList: effectivePetenget || []
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
        if (!result) {
          result = mapPitungPerjodohan(
            isNodeEnvironment ? getDbSync('11-pitung-perjodohan-bilingual.json') : null,
            isNodeEnvironment ? getDbSync('16-pitung-perjodohan.json') : null,
            isNodeEnvironment ? getDbSync('17-aksara-perjodohan.json') : null
          ) || {
            HASIL_I_JODOH: MASTER_HASIL_I,
            HASIL_II_JODOH: MASTER_HASIL_II,
            HASIL_III_JODOH: MASTER_HASIL_III,
            HASIL_IV_JODOH: MASTER_HASIL_IV,
            HASIL_V_JODOH: MASTER_HASIL_V,
            HASIL_VI_JODOH: MASTER_HASIL_VI,
            AKSARA_PERJODOHAN: MASTER_AKSARA_PERJODOHAN
          };
        }
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

        const effectiveBincil = rawBincil || (isNodeEnvironment ? getDbSync('06-bincil-matrix-bilingual.json') : null) || MASTER_BINCIL_DB;

        result = {
          bincilMatrix: effectiveBincil,
          ketBincil: (isNodeEnvironment ? getDbSync('03-bincil-arti.json') : null) || MASTER_KET_BINCIL || {},
          zodiak: rawZodiak || (isNodeEnvironment ? getDbSync('07-zodiak-bilingual.json') : []) || MASTER_ZODIAK || [],
          shioWuxing: rawShio || (isNodeEnvironment ? getDbSync('09-shio-wuxing-bilingual.json') : []) || { shio_12: MASTER_SHIO_DETAIL } || {},
          sasiJawa: rawSasi || (isNodeEnvironment ? getDbSync('08-sasi-jawa-bilingual.json') : []) || Object.values(MASTER_SASI_JAWA) || [],
          pasaranWatak: rawPasaran || (isNodeEnvironment ? getDbSync('10-pasaran-watak-bilingual.json') : []) || [],
          karakterDasar: rawKarakter || (isNodeEnvironment ? getDbSync('12-karakter-dasar-bilingual.json') : []) || MASTER_KARAKTER_DASAR || [],
          pekerjaanWeton: rawPekerjaan || (isNodeEnvironment ? getDbSync('13-pekerjaan-weton-bilingual.json') : []) || MASTER_PEKERJAAN || [],
          siklusPadewan: rawPadewan || (isNodeEnvironment ? getDbSync('25-siklus-padewan-bilingual.json') : []) || MASTER_SIKLUS_PADEWAN || []
        };
        break;
      }

      case 'selametan': {
        const rawSelametan = await loadDb('selametanRules').catch(() => null);
        result = mapSelametanRules(rawSelametan) || mapSelametanRules(getDbSync('14-selametan-rules.json'));
        break;
      }

      case 'ijab': {
        const rawIjab = await loadDb('ijab').catch(() => null);
        result = mapPetungIjab(rawIjab) || mapPetungIjab(getDbSync('15-ijab-bilingual.json'));
        if (typeof globalThis !== 'undefined' && result) {
          globalThis._currentIjabData = result;
        }
        break;
      }

      case 'omah': {
        const rawOmah = await loadDb('omah').catch(() => null);
        result = mapPetungOmah(rawOmah) || mapPetungOmah(getDbSync('23-omah-bilingual.json'));
        if (typeof globalThis !== 'undefined' && result) {
          globalThis._currentOmahData = result;
        }
        break;
      }

      case 'petung-kehidupan':
      case 'ternak': {
        let rawTernak = null;
        if (isNodeEnvironment && nodePath && nodeFs) {
          try {
            const parsedPath = nodePath.resolve(process.cwd(), 'data/ternak_parsed.json');
            if (nodeFs.existsSync(parsedPath)) {
              rawTernak = JSON.parse(nodeFs.readFileSync(parsedPath, 'utf8'));
            }
          } catch (_) {}
        }
        if (!rawTernak) {
          rawTernak = await loadDb('petungTernak').catch(() => null);
        }
        result = mapPetungKehidupan(rawTernak) || mapPetungKehidupan(getDbSync('22-petung-ternak-bilingual.json'));
        if (typeof globalThis !== 'undefined' && result) {
          globalThis._currentTernakData = result;
        }
        break;
      }

      case 'sapa-dina': {
        const [rawTetanen, rawMangsa] = await Promise.all([
          loadDb('petungTetanen').catch(() => null),
          loadDb('pranataMangsa').catch(() => null)
        ]);
        result = {
          petungTetanen: rawTetanen || (isNodeEnvironment ? getDbSync('21-petung-tetanen-bilingual.json') : null) || masterGetTetanen(),
          pranataMangsa: rawMangsa || (isNodeEnvironment ? getDbSync('05-pranata-mangsa.json') : null) || MASTER_PRANATA_MANGSA || []
        };
        break;
      }

      case 'sasmitha': {
        const rawSasmitha = await loadDb('sasmitha').catch(() => null);
        result = rawSasmitha || (isNodeEnvironment ? getDbSync('20-sasmitha.json') : null) || {
          impen: MASTER_SASMITHA_IMPEN,
          kedut: MASTER_SASMITHA_KEDUT,
          gerhana: MASTER_SASMITHA_GERAHANA,
          lindu: MASTER_SASMITHA_LINDU,
          tejo: MASTER_SASMITHA_TEJO
        };
        break;
      }

      case 'aksara': {
        const rawAksara = await loadDb('aksaraNglegena').catch(() => null);
        result = rawAksara || (isNodeEnvironment ? getDbSync('30-aksara-nglegena-bilingual.json') : null);
        break;
      }

      case 'pustaka': {
        const [rawDongo, rawJawa, rawDigital] = await Promise.all([
          loadDb('pustakaDongo').catch(() => null),
          loadDb('pustakaJawa').catch(() => null),
          loadDb('pustakaDigital').catch(() => null)
        ]);
        result = {
          pustakaDongo: rawDongo || (isNodeEnvironment ? getDbSync('35-pustaka-dongo.json') : null) || { entri: MASTER_PUSTAKA_ENTRI, kategori: MASTER_PUSTAKA_KATEGORI },
          pustakaJawa: rawJawa || (isNodeEnvironment ? getDbSync('36-pustaka-jawa.json') : null) || MASTER_PUSTAKA_JAWA || {},
          pustakaDigital: rawDigital || (isNodeEnvironment ? getDbSync('41-pustaka-digital.json') : null) || { naskah_kuno: MASTER_NASKAH_KUNO, dokumen_referensi: MASTER_DOKUMEN_BUDAYA, kamus_jawa_indonesia: MASTER_KAMUS_JAWA, kamus_jawa_sanskerta: MASTER_KAMUS_SANSKERTA }
        };
        if (typeof globalThis !== 'undefined' && result?.pustakaDigital) {
          globalThis._currentPustakaDigitalData = result.pustakaDigital;
        }
        break;
      }

      case 'sinengker': {
        const rawSinengker = await loadDb('sinengkerKhusus').catch(() => null);
        result = rawSinengker || (isNodeEnvironment ? getDbSync('37-sinengker-khusus.json') : null) || MASTER_SINENGKER;
        break;
      }

      case 'wayang': {
        const rawWayang = await loadDb('wayang').catch(() => null);
        const effectiveWayang = rawWayang || (isNodeEnvironment ? getDbSync('38-wayang-all.json') : null) || { wayang_list: masterGetWayangList(), kategori_list: masterGetWayangKat() };
        result = effectiveWayang;
        if (typeof globalThis !== 'undefined') {
          globalThis._currentWayangData = result;
        }
        break;
      }

      case 'pitutur': {
        const rawPitutur = await loadDb('pitutur').catch(() => null);
        const effectivePitutur = rawPitutur || (isNodeEnvironment ? getDbSync('39-pitutur-all.json') : null) || { pitutur_list: [], quiz_questions: MASTER_QUIZ || [] };
        result = effectivePitutur;
        if (typeof globalThis !== 'undefined') {
          globalThis._currentPituturData = result;
          if (Array.isArray(result?.pitutur_list)) {
            globalThis._currentPituturList = result.pitutur_list;
          }
          if (Array.isArray(result?.quiz_questions)) {
            globalThis.QUIZ_QUESTIONS = result.quiz_questions;
          }
        }
        break;
      }

      case 'mitologi': {
        const rawMitologi = await loadDb('mitologi').catch(() => null);
        const effectiveMitologi = rawMitologi || (isNodeEnvironment ? getDbSync('40-mitologi-all.json') : null) || { cerita: masterGetMitologi() };
        result = effectiveMitologi;
        if (typeof globalThis !== 'undefined') {
          globalThis._currentMitologiData = result;
        }
        break;
      }

      case 'tumpeng': {
        const rawTumpeng = await loadDb('tumpeng').catch(() => null);
        const effectiveTumpeng = rawTumpeng || (isNodeEnvironment ? getDbSync('42-tumpeng-all.json') : null) || { ubarampe: MASTER_TUMPENG_UBARAMPE, tumpeng_warna: MASTER_TUMPENG_WARNA };
        result = effectiveTumpeng;
        if (typeof globalThis !== 'undefined') {
          globalThis._currentTumpengData = result;
          if (Array.isArray(result?.ubarampe)) {
            globalThis.TUMPENG_UBARAMPE = result.ubarampe;
          }
          if (result?.tumpeng_warna && typeof result.tumpeng_warna === 'object') {
            globalThis.TUMPENG_WARNA = result.tumpeng_warna;
          }
        }
        break;
      }

      default:
        console.warn(`[dbLoader] Domain tidak terdaftar: "${domain}"`);
        return null;
    }

    if (result) {
      domainCache.set(dom, result);
    } else {
      domainCache.delete(dom);
    }
    return result;
  } catch (err) {
    console.warn(`[dbLoader] Gagal memuat domain "${domain}":`, err);
    domainCache.delete(dom);
    const fallback = getDomainFallback(dom);
    if (fallback) domainCache.set(dom, fallback);
    return fallback;
  }
}

/**
 * Mengambil fallback aman untuk domain jika fetch gagal (Arsitektur Hybrid Data Lokal .js)
 * Memastikan tidak ada data kosong atau gagal termuat di browser maupun Node.js.
 * @param {string} domain 
 * @returns {any}
 */
export function getDomainFallback(domain) {
  const dom = String(domain || '').toLowerCase().trim();
  switch (dom) {
    case 'kalender':
      return {
        constants: mapKalenderConstants(getDbSync('01-kalender-constants.json') || { HARI, PASARAN, NEPTU_HARI, NEPTU_PASARAN, WUKU, BULAN_JAWA, BULAN_MASEHI, WINDU, EPOCH_JDN, GRID, KETERANGAN }),
        dinoRules: mapDinoRules(getDbSync('04-dino-rules.json') || {}),
        pranataMangsa: getDbSync('05-pranata-mangsa.json') || MASTER_PRANATA_MANGSA || [],
        petungTetanen: getDbSync('21-petung-tetanen-bilingual.json') || masterGetTetanen(),
        wukuPetenget: getDbSync('24-wuku-petenget-bilingual.json') || []
      };
    case 'wuku':
      return {
        pawukonList: (getDbSync('02-wuku-ensiklopedia.json') || PAWUKON_LIST).map(mapWukuItem),
        petengetList: getDbSync('24-wuku-petenget-bilingual.json') || []
      };
    case 'jodoh':
    case 'perjodohan':
      return mapPitungPerjodohan(
        getDbSync('11-pitung-perjodohan-bilingual.json'),
        getDbSync('16-pitung-perjodohan.json'),
        getDbSync('17-aksara-perjodohan.json')
      ) || {
        HASIL_I_JODOH: MASTER_HASIL_I,
        HASIL_II_JODOH: MASTER_HASIL_II,
        HASIL_III_JODOH: MASTER_HASIL_III,
        HASIL_IV_JODOH: MASTER_HASIL_IV,
        HASIL_V_JODOH: MASTER_HASIL_V,
        HASIL_VI_JODOH: MASTER_HASIL_VI,
        AKSARA_PERJODOHAN: MASTER_AKSARA_PERJODOHAN
      };
    case 'nujum':
      return {
        bincilMatrix: getDbSync('06-bincil-matrix-bilingual.json') || MASTER_BINCIL_DB,
        ketBincil: getDbSync('03-bincil-arti.json') || MASTER_KET_BINCIL || {},
        zodiak: getDbSync('07-zodiak-bilingual.json') || MASTER_ZODIAK || [],
        shioWuxing: getDbSync('09-shio-wuxing-bilingual.json') || { shio_12: MASTER_SHIO_DETAIL } || {},
        sasiJawa: getDbSync('08-sasi-jawa-bilingual.json') || Object.values(MASTER_SASI_JAWA) || [],
        pasaranWatak: getDbSync('10-pasaran-watak-bilingual.json') || [],
        karakterDasar: getDbSync('12-karakter-dasar-bilingual.json') || MASTER_KARAKTER_DASAR || [],
        pekerjaanWeton: getDbSync('13-pekerjaan-weton-bilingual.json') || MASTER_PEKERJAAN || [],
        siklusPadewan: getDbSync('25-siklus-padewan-bilingual.json') || MASTER_SIKLUS_PADEWAN || []
      };
    case 'selametan':
      return mapSelametanRules(getDbSync('14-selametan-rules.json'));
    case 'ijab':
      return mapPetungIjab(getDbSync('15-ijab-bilingual.json'));
    case 'omah':
      return mapPetungOmah(getDbSync('23-omah-bilingual.json'));
    case 'petung-kehidupan':
    case 'ternak':
      return mapPetungKehidupan(getDbSync('22-petung-ternak-bilingual.json'));
    case 'sapa-dina':
      return {
        petungTetanen: getDbSync('21-petung-tetanen-bilingual.json') || masterGetTetanen(),
        pranataMangsa: getDbSync('05-pranata-mangsa.json') || MASTER_PRANATA_MANGSA || []
      };
    case 'sasmitha':
      return getDbSync('20-sasmitha.json') || {
        impen: MASTER_SASMITHA_IMPEN,
        kedut: MASTER_SASMITHA_KEDUT,
        gerhana: MASTER_SASMITHA_GERAHANA,
        lindu: MASTER_SASMITHA_LINDU,
        tejo: MASTER_SASMITHA_TEJO
      };
    case 'wayang':
      return getDbSync('38-wayang-all.json') || { wayang_list: masterGetWayangList(), kategori_list: masterGetWayangKat() };
    case 'pitutur':
      return getDbSync('39-pitutur-all.json') || { pitutur_list: [], quiz_questions: MASTER_QUIZ || [] };
    case 'mitologi':
      return getDbSync('40-mitologi-all.json') || { cerita: masterGetMitologi() };
    case 'tumpeng':
      return getDbSync('42-tumpeng-all.json') || { ubarampe: MASTER_TUMPENG_UBARAMPE, tumpeng_warna: MASTER_TUMPENG_WARNA };
    default:
      return null;
  }
}

export function invalidateDomainData(domain) {
  const dom = String(domain || '').toLowerCase().trim();
  domainCache.delete(dom);
  if (dom === 'omah') {
    dbCache.delete('23-omah-bilingual.json');
    dbCache.delete('omah:all');
    if (typeof globalThis !== 'undefined') {
      delete globalThis._currentOmahData;
    }
  } else if (dom === 'ijab') {
    dbCache.delete('15-ijab-bilingual.json');
    dbCache.delete('ijab:all');
    if (typeof globalThis !== 'undefined') {
      delete globalThis._currentIjabData;
    }
  } else if (dom === 'ternak' || dom === 'petung-kehidupan') {
    dbCache.delete('22-petung-ternak-bilingual.json');
    dbCache.delete('petung:ternak');
    if (typeof globalThis !== 'undefined') {
      delete globalThis._currentTernakData;
    }
  } else if (dom === 'selametan') {
    dbCache.delete('14-selametan-rules.json');
    dbCache.delete('selametan:rules');
  } else if (dom === 'kalender') {
    dbCache.delete('01-kalender-constants.json');
    dbCache.delete('kalender:constants');
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
  if (isNodeEnvironment) return getDomainFallback(dom);
  return null;
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
    invalidateDomainData,
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
  window.loadDomainData = loadDomainData;
  window.invalidateDomainData = invalidateDomainData;
}

export default {
  load: loadDb,
  loadSync: loadDbSync,
  loadDb,
  loadDbSync,
  getDbSync,
  getDb: loadDb,
  loadDomainData,
  invalidateDomainData,
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
