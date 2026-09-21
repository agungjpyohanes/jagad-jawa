/**
 * Jagad Jawa — Modul Domain: Wayang Engine
 * Pure data lookup & filter functions untuk ensiklopedia karakter Wayang Purwa Gagrag Surakarta.
 * 
 * Bebas dari ketergantungan DOM.
 */

import { WAYANG_LIST, WAYANG_MAP, KATEGORI_LIST } from '../../data/wayang.js';

/**
 * Mencari karakter wayang berdasarkan ID.
 * @param {string} id 
 * @returns {Object|null}
 */
export function getWayangById(id) {
  if (!id) return null;
  return WAYANG_MAP[id.toLowerCase()] || WAYANG_LIST.find(w => w.id === id) || null;
}

/**
 * Menyaring daftar wayang berdasarkan kategori dan kata kunci pencarian.
 * @param {string} kategori 
 * @param {string} query 
 * @returns {Array}
 */
export function filterWayangList(kategori = 'semua', query = '') {
  let list = WAYANG_LIST;
  if (kategori && kategori !== 'semua') {
    list = list.filter(w => w.kategori.toLowerCase() === kategori.toLowerCase());
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(w =>
      w.nama.toLowerCase().includes(q) ||
      w.watak.toLowerCase().includes(q) ||
      w.kasatriyan.toLowerCase().includes(q) ||
      w.pusaka.toLowerCase().includes(q)
    );
  }
  return list;
}

export {
  WAYANG_LIST,
  WAYANG_MAP,
  KATEGORI_LIST
};
