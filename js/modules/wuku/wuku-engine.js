/**
 * Jagad Jawa — Modul Domain: Wuku Engine (Ensiklopedia 30 Wuku Pawukon)
 * Pure lookup & filtering logic untuk data 30 Wuku Nusantara.
 * Bebas dari ketergantungan DOM.
 */

import { PAWUKON_LIST, getPawukonData } from '../../data/pawukon.js';

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
  return list.filter(w => {
    return (w.nama_wuku && w.nama_wuku.toLowerCase().includes(q)) ||
           (w.dewane && w.dewane.toLowerCase().includes(q)) ||
           (w.watek_budi_pangerti && w.watek_budi_pangerti.toLowerCase().includes(q)) ||
           (w.bilahi_bebaya && w.bilahi_bebaya.toLowerCase().includes(q)) ||
           (w.pangupaya_jiwa && w.pangupaya_jiwa.toLowerCase().includes(q)) ||
           (w.donga_slamet && w.donga_slamet.toLowerCase().includes(q)) ||
           (String(w.no_wuku) === q);
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

  return {
    no: data.no_wuku,
    nama: data.nama_wuku,
    dewane: data.dewane || '-',
    watak: data.watek_budi_pangerti || '-',
    bilahi: data.bilahi_bebaya || '-',
    sesaji: data.sesaji_ruwat || '-',
    tindih: data.tindih_ruwat || '-',
    sega: data.selamatan_sega || '-',
    iwak: data.selamatan_iwak || '-',
    salawat: data.salawat || '-',
    donga: data.donga_slamet || '-',
    pangupaya: data.pangupaya_jiwa || '-',
    tamba: data.tamba_yen_lara || '-'
  };
}
