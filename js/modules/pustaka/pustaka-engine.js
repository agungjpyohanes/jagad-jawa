/**
 * Jagad Jawa — Modul Domain: Pustaka Engine
 * Menangani pemuatan, pencarian, pemfilteran kategori, dan personalisasi nama
 * untuk Pustaka Dongo, Wirid & Ubarampe Jawa.
 */

import { PUSTAKA_DATA, PUSTAKA_KATEGORI, PUSTAKA_ENTRI, PUSTAKA_DATA_TERSTRUKTUR } from '../../data/pustaka-db.js';

export const PLACEHOLDER_NAMA_REGEX = /(\.{3,}|…+)/g;

/**
 * Mengambil daftar seluruh kategori pustaka.
 * @returns {Array<{id: string, nama: string, urutan: number, deskripsi: string}>}
 */
export function getPustakaKategoriList() {
  return [...PUSTAKA_KATEGORI].sort((a, b) => a.urutan - b.urutan);
}

/**
 * Mengambil detail kategori berdasarkan ID.
 * @param {string} kategoriId 
 * @returns {Object|null}
 */
export function getPustakaKategoriById(kategoriId) {
  if (!kategoriId) return null;
  return PUSTAKA_KATEGORI.find(k => k.id === kategoriId) || null;
}

/**
 * Mengambil seluruh entri pustaka.
 * @returns {Array<Object>}
 */
export function getAllPustakaEntri() {
  return [...PUSTAKA_ENTRI];
}

/**
 * Mengambil satu entri berdasarkan ID.
 * @param {string} id 
 * @returns {Object|null}
 */
export function getPustakaEntriById(id) {
  if (!id) return null;
  return PUSTAKA_ENTRI.find(e => e.id === id) || null;
}

/**
 * Memeriksa apakah suatu entri atau kumpulan baris memuat titik isian nama pengguna.
 * @param {Object|Array<string>} entriOrBaris 
 * @returns {boolean}
 */
export function hasNamePlaceholder(entriOrBaris) {
  if (!entriOrBaris) return false;
  if (Array.isArray(entriOrBaris)) {
    return entriOrBaris.some(line => PLACEHOLDER_NAMA_REGEX.test(line));
  }
  if (entriOrBaris.bagian && Array.isArray(entriOrBaris.bagian)) {
    return entriOrBaris.bagian.some(b => Array.isArray(b.baris) && b.baris.some(line => PLACEHOLDER_NAMA_REGEX.test(line)));
  }
  return false;
}

/**
 * Filter dan cari entri pustaka berdasarkan kategori dan kata kunci.
 * @param {Object} options
 * @param {string} [options.kategori] - ID kategori atau null/empty untuk semua
 * @param {string} [options.query] - Kata kunci pencarian
 * @returns {Array<Object>}
 */
export function searchPustakaEntri({ kategori = null, query = '' } = {}) {
  let list = [...PUSTAKA_ENTRI];

  if (kategori && kategori !== 'kabeh' && kategori !== 'sedaya') {
    list = list.filter(e => e.kategori === kategori);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(e => {
      // 1. Cek judul & subjudul
      if (e.judul && e.judul.toLowerCase().includes(q)) return true;
      if (e.subjudul && e.subjudul.toLowerCase().includes(q)) return true;
      // 2. Cek ringkasan
      if (e.ringkasan && e.ringkasan.toLowerCase().includes(q)) return true;
      // 3. Cek tag
      if (Array.isArray(e.tag) && e.tag.some(t => t.toLowerCase().includes(q))) return true;
      // 4. Cek teks_cari terindeks
      if (e.teks_cari && e.teks_cari.toLowerCase().includes(q)) return true;
      // 5. Cek baris dalam bagian
      if (Array.isArray(e.bagian)) {
        for (const b of e.bagian) {
          if (b.label && b.label.toLowerCase().includes(q)) return true;
          if (Array.isArray(b.baris) && b.baris.some(line => line.toLowerCase().includes(q))) return true;
        }
      }
      return false;
    });
  }

  return list;
}

/**
 * Personalisasi baris-baris doa dengan mengganti placeholder '………' dengan nama pengguna.
 * @param {Array<string>} barisList 
 * @param {string} namaPengguna 
 * @returns {Array<string>}
 */
export function personalizeDoaLines(barisList, namaPengguna = '') {
  if (!Array.isArray(barisList)) return [];
  const cleanName = namaPengguna ? namaPengguna.trim() : '';

  return barisList.map(line => {
    if (!line) return '';
    if (!cleanName) {
      return line;
    }
    return line.replace(PLACEHOLDER_NAMA_REGEX, cleanName);
  });
}

/**
 * Format teks doa lengkap dalam bentuk plain-text rapi untuk salin clipboard atau share.
 * @param {Object} entri 
 * @param {string} [namaPengguna=''] 
 * @returns {string}
 */
export function formatDoaPlainText(entri, namaPengguna = '') {
  if (!entri) return '';
  const kat = getPustakaKategoriById(entri.kategori);

  let out = `📜 *${entri.judul.toUpperCase()}*\n`;
  if (entri.subjudul) out += `_${entri.subjudul}_\n`;
  if (kat) out += `📁 Kategori: ${kat.nama}\n`;
  if (entri.waktu_pakai) out += `⏱️ Waktu: ${entri.waktu_pakai}\n`;
  if (namaPengguna && namaPengguna.trim()) {
    out += `👤 Diniyatkan Kangge: ${namaPengguna.trim()}\n`;
  }
  out += `\n──────────────────────────────\n\n`;

  if (Array.isArray(entri.bagian)) {
    entri.bagian.forEach((bag, idx) => {
      if (bag.label) {
        out += `▶ *${bag.label}*`;
        if (bag.pengulangan) out += ` (Diwaca ${bag.pengulangan}x)`;
        out += `:\n`;
      }
      const lines = personalizeDoaLines(bag.baris || [], namaPengguna);
      lines.forEach(l => {
        out += `${l}\n`;
      });
      if (bag.petunjuk) {
        out += `_Petunjuk: ${bag.petunjuk}_\n`;
      }
      if (bag.catatan) {
        out += `_Catatan: ${bag.catatan}_\n`;
      }
      out += `\n`;
    });
  }

  if (entri.penutup) {
    out += `✨ *Panutup:* ${entri.penutup}\n\n`;
  }

  out += `Kadhudhah saking Pustaka Jagad Jawa\nhttps://jagad-jawa.web.app`;
  return out;
}

/**
 * Ambil entri-entri terkait beserta alasannya.
 * @param {Object} entri 
 * @returns {Array<{entri: Object, alasan: string}>}
 */
export function getPustakaRelatedEntri(entri) {
  if (!entri || !Array.isArray(entri.terkait)) return [];
  const results = [];
  entri.terkait.forEach(item => {
    const target = getPustakaEntriById(item.id);
    if (target) {
      results.push({ entri: target, alasan: item.alasan });
    }
  });
  return results;
}

export { PUSTAKA_DATA, PUSTAKA_KATEGORI, PUSTAKA_ENTRI, PUSTAKA_DATA_TERSTRUKTUR };
