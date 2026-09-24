/**
 * Jagad Jawa — Engine Sasmitha (Tanda Alam & Tubuh)
 * Disarikan dari sasmitha_gabungan.xlsx
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
  REF_SASI_JAWA
} from '../../data/sasmitha-db.js';

function norm(str) {
  return String(str || '').trim().toLowerCase();
}

/**
 * Cari tanda impen (mimpi) berdasarkan kata kunci
 * @param {string} query
 * @returns {Array}
 */
export function searchImpen(query = '') {
  const q = norm(query);
  if (!q) return [...SASMITHA_IMPEN];
  return SASMITHA_IMPEN.filter(im =>
    norm(im.yen_ngimpi).includes(q) || norm(im.pratanda).includes(q)
  );
}

/**
 * Ambil daftar kedutan badan dengan opsi kategori & privasi mode pemula
 * @param {object} options
 * @param {string} [options.query]
 * @param {string} [options.kategori]
 * @param {boolean} [options.includeSensitive]
 * @returns {Array}
 */
export function getKedutList({ query = '', kategori = '', includeSensitive = false } = {}) {
  const q = norm(query);
  const k = norm(kategori);

  return SASMITHA_KEDUT.filter(kd => {
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
 * @returns {object|null}
 */
export function getGerhanaBySasi(sasiName) {
  if (!sasiName) return null;
  const nS = norm(sasiName);
  const found = SASMITHA_GERAHANA.find(g =>
    norm(g.sasi_jawa) === nS ||
    norm(g.alias_sumber) === nS ||
    norm(g.sasi_jawa).includes(nS)
  );
  return found ? { ...found } : null;
}

/**
 * Ambil sasmitha lindu (gempa) menurut sasi Jawa dan waktu (Awan vs Wengi)
 * @param {string} sasiName
 * @param {'awan'|'wengi'} waktu
 * @returns {object|null}
 */
export function getLinduBySasi(sasiName, waktu = 'awan') {
  if (!sasiName) return null;
  const nS = norm(sasiName);
  const isWengi = norm(waktu) === 'wengi';

  const found = SASMITHA_LINDU.find(l =>
    norm(l.sasi_jawa) === nS ||
    norm(l.sasi_jawa).includes(nS)
  );
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
 * @returns {Array}
 */
export function getTejoList() {
  return [...SASMITHA_TEJO];
}

/**
 * Ambil data tejo berdasarkan arah
 * @param {string} arah
 * @returns {object|null}
 */
export function getTejoByArah(arah) {
  if (!arah) return null;
  const nA = norm(arah);
  const found = SASMITHA_TEJO.find(t =>
    norm(t.arah_jawa) === nA ||
    norm(t.arah_id) === nA ||
    norm(t.arah_jawa).includes(nA) ||
    norm(t.arah_id).includes(nA)
  );
  return found ? { ...found } : null;
}

export {
  SASMITHA_IMPEN,
  SASMITHA_KEDUT,
  SASMITHA_GERAHANA,
  SASMITHA_LINDU,
  SASMITHA_TEJO,
  REF_SASI_JAWA
};
