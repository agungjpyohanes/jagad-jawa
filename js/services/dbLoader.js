/**
 * Jagad Jawa — Centralized Database Loader (Data Service)
 * Branch: jawa-v10
 * 
 * Tanggung Jawab:
 * 1. Menjadi pintu gerbang tunggal pemuatan seluruh 34 database JSON di folder statis `./data/`.
 * 2. Menyediakan sistem caching memori ringan + deduplikasi panggilan asinkron (inflight dedup).
 * 3. Bekerja mulus baik di peramban (Cloudflare Pages / Vite) melalui `fetch()` statis,
 *    maupun di lingkungan unit test Node.js (`node --test`).
 * 4. Menyediakan utility helper resolusi teks dwibahasa (Bilingual: { id, jv }).
 */

import { getLanguage, getBilingualText, resolveBilingualRecord } from '../ui/i18n.js';
export { getBilingualText, resolveBilingualRecord };

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

// Inisialisasi awal sinkron untuk lingkungan Node.js (Unit Test runner)
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
  try {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const { createRequire } = await dynamicImport('node:module');
    const req = createRequire(process.cwd() + '/package.json');
    const fs = req('fs');
    const path = req('path');
    const dataDir = path.resolve(process.cwd(), 'public/data');
    if (fs.existsSync(dataDir)) {
      for (const file of Object.values(DB_FILES)) {
        try {
          const p = path.join(dataDir, file);
          if (fs.existsSync(p)) {
            dbCache.set(file, JSON.parse(fs.readFileSync(p, 'utf8')));
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
 * @param {string|number} key - Nama file, nomor (1-34), atau nama alias
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
      if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
        try {
          const dynamicImport = new Function('specifier', 'return import(specifier)');
          const fs = await dynamicImport('node:fs/promises');
          const path = await dynamicImport('node:path');
          const fullPath = path.resolve(process.cwd(), 'public/data', filename);
          const raw = await fs.readFile(fullPath, 'utf8');
          data = JSON.parse(raw);
        } catch (nodeErr) {
          // Fallback fetch jika didukung
          if (typeof fetch === 'function') {
            const url = getDbUrl(filename);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status} saat membaca ${url}`);
            data = await res.json();
          } else {
            throw nodeErr;
          }
        }
      } else {
        // Lingkungan Browser (Vite / Cloudflare Pages)
        // Bangun daftar kandidat URL resolusi file data secara resilien
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
          // Return null or cached fallback rather than hard crashing UI
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

export function getDbSync(key) {
  const filename = resolveDbFilename(key);
  if (dbCache.has(filename)) return dbCache.get(filename);
  if (isNodeEnvironment) {
    try {
      const require = createRequire(import.meta.url);
      const fs = require('node:fs');
      const path = require('node:path');
      const filePath = path.resolve(process.cwd(), 'public', 'data', filename);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        dbCache.set(filename, data);
        return data;
      }
    } catch (e) {}
  }
  return null;
}

export const loadDbSync = getDbSync;

/**
 * Menyimpan data ke dalam cache secara manual (berguna untuk bootstrap / fallback offline)
 * @param {string|number} key 
 * @param {any} data 
 */
export function setDbCache(key, data) {
  const filename = resolveDbFilename(key);
  dbCache.set(filename, data);
}

/**
 * Menghapus seluruh cache memori
 */
export function clearDbCache() {
  dbCache.clear();
  inflightPromises.clear();
}

/**
 * Preload sekelompok database sekaligus
 * @param {Array<string|number>} keys 
 * @returns {Promise<any[]>}
 */
export async function preloadDatabases(keys) {
  return Promise.all(keys.map(k => loadDb(k)));
}


export default {
  load: loadDb,
  loadSync: loadDbSync,
  loadDb,
  loadDbSync,
  getDbSync,
  getDb: loadDb,
  clearCache: clearDbCache,
  preload: preloadDatabases,
  getBilingualText,
  DB_FILES,
  DB_ALIASES
};
