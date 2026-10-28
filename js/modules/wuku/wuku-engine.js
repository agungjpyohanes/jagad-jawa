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
import { loadDomainData, mapWukuItem, extractText, getBilingualText } from '../../services/dbLoader.js';
import { getWukuPetenget as masterGetWukuPetenget } from '../../data/wuku-petenget-db.js';

let currentPetengetList = (typeof globalThis !== 'undefined' && Array.isArray(globalThis._currentWukuPetengetData)) ? globalThis._currentWukuPetengetData : [];

function getWukuPetenget(wukuNoOrName) {
  if (typeof globalThis !== 'undefined' && typeof globalThis.getWukuPetenget === 'function' && globalThis.getWukuPetenget !== getWukuPetenget && globalThis.getWukuPetenget !== masterGetWukuPetenget) {
    const res = globalThis.getWukuPetenget(wukuNoOrName);
    if (res) return res;
  }
  const active = (typeof globalThis !== 'undefined' && globalThis._currentWukuPetengetData) ? globalThis._currentWukuPetengetData : currentPetengetList;
  return masterGetWukuPetenget(wukuNoOrName, active);
}

let currentWukuList = Array.isArray(PAWUKON_LIST) ? PAWUKON_LIST.map(mapWukuItem) : [];

/**
 * Memuat database ensiklopedia wuku secara asinkron dari dbLoader
 * @returns {Promise<Array<Object>>}
 */
export async function loadWukuData() {
  try {
    const domainData = await loadDomainData('wuku');
    if (domainData && Array.isArray(domainData.pawukonList) && domainData.pawukonList.length > 0) {
      currentWukuList = domainData.pawukonList;
      if (typeof window !== 'undefined') {
        window.PAWUKON_LIST = currentWukuList;
      }
    }
    if (domainData && domainData.petengetList) {
      currentPetengetList = domainData.petengetList;
      if (typeof globalThis !== 'undefined') {
        globalThis._currentWukuPetengetData = domainData.petengetList;
      }
    }
  } catch (err) {
    console.warn('[wuku-engine] loadWukuData fallback:', err);
  }
  return currentWukuList;
}

/**
 * Mendapatkan daftar seluruh 30 wuku.
 * @returns {Array<Object>}
 */
export function getAllWuku() {
  if (currentWukuList && currentWukuList.length > 0) return currentWukuList;
  const list = PAWUKON_LIST || (typeof window !== 'undefined' && window.PAWUKON_LIST) || 
               (typeof globalThis !== 'undefined' && globalThis.PAWUKON_LIST) || [];
  return list.map(mapWukuItem);
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
 * Mencari wuku berdasarkan kata kunci pencarian dan filter kategori petenget.
 * @param {string} [query=''] - Kata kunci pencarian
 * @param {string} [category='all'] - 'all' | 'nambani' | 'pangupajiwa' | 'tetanen' | 'ala_becik'
 * @returns {Array<Object>}
 */
export function searchWukuWithCategory(query = '', category = 'all') {
  let list = getAllWuku();

  // Helper untuk cek apakah pilar nujum memiliki isi petenget non-kosong
  function hasPillarContent(entry) {
    if (!entry) return false;
    const b = getBilingualText(entry.becik).trim();
    const a = getBilingualText(entry.ala).trim();
    return (b !== '' && b !== '-') || (a !== '' && a !== '-');
  }

  // 1. Filter kategori pilar nujum
  if (category && category !== 'all') {
    list = list.filter(w => {
      const p = getWukuPetenget(w.no_wuku);
      if (!p) return false;
      if (category === 'nambani') {
        return hasPillarContent(p.nambani);
      }
      if (category === 'pangupajiwa') {
        return hasPillarContent(p.pangupajiwa);
      }
      if (category === 'tetanen') {
        return hasPillarContent(p.tetanen);
      }
      if (category === 'ala_becik') {
        return hasPillarContent(p.alaBecik || p.ala_becik);
      }
      return true;
    });
  }

  // 2. Filter kata kunci pencarian (bila ada)
  if (!query || typeof query !== 'string' || !query.trim()) {
    return list;
  }
  const q = query.trim().toLowerCase();

  // Resolve alias → term kanon untuk pencarian lebih luas
  const canonicalized = normalizeDewaName(query.trim());
  const qCanon = canonicalized.toLowerCase();

  return list.filter(w => {
    const p = getWukuPetenget(w.no_wuku);
    const petengetText = p ? (
      (getBilingualText(p.alaBecik?.becik || p.ala_becik?.becik) || '') + ' ' +
      (getBilingualText(p.alaBecik?.ala || p.ala_becik?.ala) || '') + ' ' +
      (getBilingualText(p.nambani?.becik) || '') + ' ' +
      (getBilingualText(p.nambani?.ala) || '') + ' ' +
      (getBilingualText(p.pangupajiwa?.becik) || '') + ' ' +
      (getBilingualText(p.pangupajiwa?.ala) || '') + ' ' +
      (getBilingualText(p.tetanen?.becik) || '') + ' ' +
      (getBilingualText(p.tetanen?.ala) || '')
    ).toLowerCase() : '';

    const nama = getBilingualText(w.nama_wuku || w.nama).toLowerCase();
    const dewa = getBilingualText(w.dewane || w.dewa).toLowerCase();
    const watak = getBilingualText(w.watek_budi_pangerti || w.watak || w.watek).toLowerCase();
    const bilahi = getBilingualText(w.bilahi_bebaya || w.bilahi).toLowerCase();
    const pangupaya = getBilingualText(w.pangupaya_jiwa || w.pangupaya).toLowerCase();
    const tamba = getBilingualText(w.tamba_yen_lara || w.tamba).toLowerCase();
    const donga = getBilingualText(w.donga_slamet || w.donga).toLowerCase();

    const baseMatch =
      nama.includes(q) ||
      dewa.includes(q) ||
      watak.includes(q) ||
      bilahi.includes(q) ||
      pangupaya.includes(q) ||
      tamba.includes(q) ||
      donga.includes(q) ||
      petengetText.includes(q) ||
      (String(w.no_wuku || w.no || w.id) === q);

    if (baseMatch) return true;

    if (qCanon !== q) {
      if (nama.includes(qCanon) || dewa.includes(qCanon)) return true;
    }

    const dewaEntry = resolveWukuDewa(w.no_wuku || w.no || w.id);
    if (dewaEntry?.aliases) {
      return dewaEntry.aliases.some(alias => alias.toLowerCase().includes(q));
    }

    return false;
  });
}

/**
 * Mencari wuku berdasarkan kata kunci pencarian (nama wuku, nama dewa, profesi, petenget, dll).
 * @param {string} query 
 * @returns {Array<Object>}
 */
export function searchWuku(query) {
  return searchWukuWithCategory(query, 'all');
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

  // Path gambar kanon (/assets/illustrations/)
  const imageWuku   = illustrationPath('wuku', data.nama_wuku);
  const imageDewane = illustrationPath('dewane', data.nama_wuku);
  const wukuImagePath   = `assets/wuku/${data.nama_wuku}.jpg`;
  const dewaneImagePath = dewaneKanon !== '-'
    ? `assets/dewa-wuku/${dewaneKanon}.jpg`
    : null;
  const wukuIllPath   = imageWuku;
  const dewaneIllPath = imageDewane;

  // ── Perkaya dengan data petenget wuku (Ala-Becik, Nambani, Pangupajiwa, Tetanen) ──
  const petenget = getWukuPetenget(data.no_wuku) || {
    alaBecik: { becik: '-', ala: '-' },
    nambani: { becik: '-', ala: '-' },
    pangupajiwa: { becik: '-', ala: '-' },
    tetanen: { becik: '-', ala: '-' }
  };

  return {
    no:       data.no_wuku || data.no || data.id,
    nama:     getBilingualText(data.nama_wuku || data.nama),
    dewane:        dewaneKanon,
    dewaneKanon,
    dewaneSlug,
    dewaneAliases,
    imageWuku,
    imageDewane,
    wukuImagePath,
    dewaneImagePath,
    wukuIllPath,
    dewaneIllPath,
    watak:    getBilingualText(data.watek_budi_pangerti || data.watak || data.watek) || '-',
    bilahi:   getBilingualText(data.bilahi_bebaya || data.bilahi) || '-',
    sesaji:   getBilingualText(data.sesaji_ruwat || data.sesaji) || '-',
    tindih:   getBilingualText(data.tindih_ruwat || data.tindih) || '-',
    sega:     getBilingualText(data.selamatan_sega || data.sega) || '-',
    iwak:     getBilingualText(data.selamatan_iwak || data.iwak) || '-',
    salawat:  getBilingualText(data.salawat) || '-',
    donga:    getBilingualText(data.donga_slamet || data.donga) || '-',
    pangupaya: getBilingualText(data.pangupaya_jiwa || data.pangupaya) || '-',
    tamba:    getBilingualText(data.tamba_yen_lara || data.tamba) || '-',
    petenget,
    alaBecik: {
      becik: getBilingualText(petenget.alaBecik?.becik || petenget.ala_becik?.becik) || '-',
      ala: getBilingualText(petenget.alaBecik?.ala || petenget.ala_becik?.ala) || '-'
    },
    nambani: {
      becik: getBilingualText(petenget.nambani?.becik) || '-',
      ala: getBilingualText(petenget.nambani?.ala) || '-'
    },
    pangupajiwa: {
      becik: getBilingualText(petenget.pangupajiwa?.becik) || '-',
      ala: getBilingualText(petenget.pangupajiwa?.ala) || '-'
    },
    tetanen: {
      becik: getBilingualText(petenget.tetanen?.becik) || '-',
      ala: getBilingualText(petenget.tetanen?.ala) || '-'
    }
  };
}

/**
 * Re-export resolver dewa-kanon dan petenget wuku.
 */
export {
  resolveWukuDewa,
  illustrationPath,
  dewaneIllustrationPath,
  wukuIllustrationPath,
  normalizeDewaName,
  getWukuPetenget
};
