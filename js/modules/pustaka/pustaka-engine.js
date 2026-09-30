/**
 * Jagad Jawa — Modul Domain: Pustaka Engine
 * Menangani pemuatan, pencarian, pemfilteran kategori, dan personalisasi nama
 * untuk Pustaka Dongo, Wirid & Ubarampe Jawa.
 */

import { PUSTAKA_DATA, PUSTAKA_KATEGORI, PUSTAKA_ENTRI, PUSTAKA_DATA_TERSTRUKTUR } from '../../data/pustaka-db.js';
import {
  NASKAH_KUNO_LIST,
  KAMUS_JAWA_INDONESIA,
  KAMUS_JAWA_SANSKERTA,
  DOKUMEN_REFERENSI_BUDAYA
} from '../../data/pustaka-digital-db.js';

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

// ─── 2. FITUR DIGITAL LIBRARY: NASKAH KUNO & BABAD ─────────────────────────

export function getAllNaskahKuno() {
  return [...NASKAH_KUNO_LIST];
}

export function getNaskahKunoById(id) {
  if (!id) return null;
  return NASKAH_KUNO_LIST.find(n => n.id === id) || null;
}

export function searchNaskahKuno(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return getAllNaskahKuno();
  return NASKAH_KUNO_LIST.filter(n =>
    n.judul.toLowerCase().includes(q) ||
    n.pengarang.toLowerCase().includes(q) ||
    n.deskripsi.toLowerCase().includes(q) ||
    n.isiRingkas.toLowerCase().includes(q) ||
    (n.babList && n.babList.some(b => b.namaBab.toLowerCase().includes(q) || b.teksJawa.toLowerCase().includes(q) || b.terjemahan.toLowerCase().includes(q)))
  );
}

export function formatNaskahPlainText(naskah) {
  if (!naskah) return '';
  let out = `📜 ${naskah.judul.toUpperCase()}\n`;
  out += `Panganggit / Pujangga: ${naskah.pengarang} (${naskah.tahun})\n`;
  out += `Kategori: ${naskah.kategori}\n`;
  out += `Deskripsi: ${naskah.deskripsi}\n\n`;
  out += `====================================================\n\n`;

  if (Array.isArray(naskah.babList)) {
    naskah.babList.forEach((bab, idx) => {
      out += `[ ${bab.namaBab} ]\n\n`;
      out += `Teks Basa Jawa:\n${bab.teksJawa}\n\n`;
      out += `Terjemahan Basa Indonesia:\n${bab.terjemahan}\n\n`;
      out += `----------------------------------------------------\n\n`;
    });
  }

  out += `\nKadhudhah saking Pustaka Digital — Jagad Jawa Nusantara\nhttps://jagad-jawa.web.app`;
  return out;
}

// ─── 3. FITUR DIGITAL LIBRARY: KAMUS JAWA-INDONESIA & SANSKERTA ───────────

export function getAllKamusJawaIndo() {
  return [...KAMUS_JAWA_INDONESIA];
}

export function searchKamusJawaIndo(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return getAllKamusJawaIndo();
  return KAMUS_JAWA_INDONESIA.filter(k =>
    k.jawa.toLowerCase().includes(q) ||
    k.krama.toLowerCase().includes(q) ||
    k.id.toLowerCase().includes(q) ||
    k.contoh.toLowerCase().includes(q)
  );
}

export function getAllKamusJawaSanskerta() {
  return [...KAMUS_JAWA_SANSKERTA];
}

export function searchKamusJawaSanskerta(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return getAllKamusJawaSanskerta();
  return KAMUS_JAWA_SANSKERTA.filter(k =>
    k.sanskerta.toLowerCase().includes(q) ||
    k.jawa.toLowerCase().includes(q) ||
    k.makna.toLowerCase().includes(q)
  );
}

export function formatKamusPlainText(list, jenis = 'jawa-indo') {
  if (!Array.isArray(list)) return '';
  let out = `📚 KAMUS ${jenis === 'sanskerta' ? 'JAWA - SANSKERTA' : 'JAWA - INDONESIA'} — JAGAD JAWA\n`;
  out += `Gunggunging Lema / Kosakata: ${list.length} tembung\n`;
  out += `====================================================\n\n`;

  if (jenis === 'sanskerta') {
    list.forEach((item, idx) => {
      out += `${idx + 1}. ${item.sanskerta} ➔ ${item.jawa}\n   Makna: ${item.makna}\n\n`;
    });
  } else {
    list.forEach((item, idx) => {
      out += `${idx + 1}. ${item.jawa} (Krama: ${item.krama}) = ${item.id}\n   Tuladha: "${item.contoh}"\n\n`;
    });
  }

  out += `\nKadhudhah saking Pustaka Digital — Jagad Jawa Nusantara\nhttps://jagad-jawa.web.app`;
  return out;
}

// ─── 4. FITUR DIGITAL LIBRARY: DOKUMEN REFERENSI KEBUDAYAAN ──────────────

export function getAllDokumenReferensi() {
  return [...DOKUMEN_REFERENSI_BUDAYA];
}

export function getDokumenReferensiById(id) {
  if (!id) return null;
  return DOKUMEN_REFERENSI_BUDAYA.find(d => d.id === id) || null;
}

export function searchDokumenReferensi(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return getAllDokumenReferensi();
  return DOKUMEN_REFERENSI_BUDAYA.filter(d =>
    d.judul.toLowerCase().includes(q) ||
    d.kategori.toLowerCase().includes(q) ||
    (d.deskripsi && d.deskripsi.toLowerCase().includes(q)) ||
    (d.ringkasan && d.ringkasan.toLowerCase().includes(q)) ||
    (d.kontenTeks && d.kontenTeks.toLowerCase().includes(q))
  );
}

export const getAllKamusJawaIndonesia = getAllKamusJawaIndo;
export const searchKamusJawaIndonesia = searchKamusJawaIndo;

export function formatKamusEntryPlainText(item, type = 'indonesia') {
  if (!item) return '';
  if (type === 'sanskerta') {
    return `${item.sanskerta} ➔ ${item.jawa || item.istilah}\n   Arti: ${item.arti_harfiah || item.makna_filosofis || item.makna}`;
  }
  return `${item.jawa || item.kata} (Krama: ${item.krama || item.krama_inggil || '-'}) = ${item.indonesia || item.id || item.makna}\n   Tuladha: "${item.conto_ukara || item.contoh || '-'}"`;
}

export function formatDokumenReferensiPlainText(doc) {
  if (!doc) return '';
  let out = `📜 ${doc.judul?.toUpperCase() || 'DOKUMEN REFERENSI'}\n`;
  if (doc.subjudul) out += `${doc.subjudul}\n`;
  out += `Kategori: ${doc.kategori || '-'}\n`;
  out += `====================================================\n\n`;
  if (doc.ringkasan || doc.deskripsi) {
    out += `Ringkasan:\n${doc.ringkasan || doc.deskripsi}\n\n`;
  }
  if (doc.kontenTeks) {
    out += `${doc.kontenTeks}\n\n`;
  }
  if (Array.isArray(doc.pupuh_list)) {
    out += `DAFTAR PAUGERAN PUPUH MACAPAT:\n`;
    doc.pupuh_list.forEach((p, idx) => {
      out += `${idx + 1}. ${p.nama} (${p.guru_gatra} Gatra) - ${p.guru_wilangan_lagu}\n   Watak: ${p.watak}\n\n`;
    });
  }
  if (doc.laras) {
    out += `LARAS & PATHET GAMELAN:\n`;
    if (doc.laras.slendro) {
      out += `• Slendro: ${doc.laras.slendro.deskripsi} (Pathet: ${doc.laras.slendro.pathet?.join(', ')})\n`;
    }
    if (doc.laras.pelog) {
      out += `• Pelog: ${doc.laras.pelog.deskripsi} (Pathet: ${doc.laras.pelog.pathet?.join(', ')})\n`;
    }
    out += `\n`;
  }
  if (Array.isArray(doc.motif_larangan)) {
    out += `MOTIF BATIK LARANGAN:\n`;
    doc.motif_larangan.forEach((m, idx) => {
      out += `${idx + 1}. ${m.nama} (${m.peruntukan}): ${m.filosofi}\n`;
    });
    out += `\n`;
  }
  out += `\nKadhudhah saking Pustaka Digital — Jagad Jawa Nusantara\nhttps://jagad-jawa.web.app`;
  return out;
}

export {
  PUSTAKA_DATA,
  PUSTAKA_KATEGORI,
  PUSTAKA_ENTRI,
  PUSTAKA_DATA_TERSTRUKTUR,
  NASKAH_KUNO_LIST,
  KAMUS_JAWA_INDONESIA,
  KAMUS_JAWA_SANSKERTA,
  DOKUMEN_REFERENSI_BUDAYA
};
