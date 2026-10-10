/**
 * Jagad Jawa — Modul Domain: Wayang Engine
 * Pure data lookup & filter functions untuk ensiklopedia karakter Wayang Purwa Gagrag Surakarta.
 * 
 * Bebas dari ketergantungan DOM.
 */

import { WAYANG_MAP, KATEGORI_LIST, getActiveWayangList, getActiveKategoriList } from '../../data/wayang.js';

/**
 * Mencari karakter wayang berdasarkan ID.
 * @param {string} id 
 * @param {Array|Object} [customDataset=null]
 * @returns {Object|null}
 */
export function getWayangById(id, customDataset = null) {
  if (!id) return null;
  const list = getActiveWayangList(customDataset);
  const cleanId = String(id).toLowerCase().trim();
  return list.find(w => w.id && w.id.toLowerCase() === cleanId) || WAYANG_MAP[cleanId] || null;
}

/**
 * Menyaring daftar wayang berdasarkan kategori dan kata kunci pencarian.
 * @param {string} kategori 
 * @param {string} query 
 * @param {Array|Object} [customDataset=null]
 * @returns {Array}
 */
export function filterWayangList(kategori = 'semua', query = '', customDataset = null) {
  let list = getActiveWayangList(customDataset);
  if (kategori && kategori !== 'semua') {
    list = list.filter(w => w.kategori && w.kategori.toLowerCase() === kategori.toLowerCase());
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(w =>
      (w.nama && w.nama.toLowerCase().includes(q)) ||
      (w.watak && w.watak.toLowerCase().includes(q)) ||
      (w.kasatriyan && w.kasatriyan.toLowerCase().includes(q)) ||
      (w.pusaka && w.pusaka.toLowerCase().includes(q))
    );
  }
  return list;
}

export {
  WAYANG_MAP,
  KATEGORI_LIST,
  getActiveWayangList,
  getActiveKategoriList
};
