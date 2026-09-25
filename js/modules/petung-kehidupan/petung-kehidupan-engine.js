/**
 * Jagad Jawa — Engine Petung Kehidupan (Ternak, Loro, & Geblak)
 * Berdasarkan manuskrip tradisi pada petung_ternak_loro_geblak.xlsx
 * 
 * ATURAN BAKU:
 * 1. Menggunakan NEPTU APP standar (bukan neptu ijab).
 * 2. Lookup terpusat pada weton_35[dina][pasaran].
 * 3. Tidak ada pencampuran formula dengan kalender inti atau pawukon.
 */

import {
  weton_35,
  WETON_35_LIST,
  KAMUS_WIWIT_TERNAK,
  KAMUS_JALARAN_LORO,
  KAMUS_GEBLAK,
  lookupWetonTernakLoroGeblak
} from '../../data/petung-ternak-loro-geblak.js';
import { getTanggalJawaLengkap, getDaysInMonth } from '../kalender/kalender-engine.js';

/**
 * Mengambil data petung kehidupan lengkap berdasarkan tanggal Masehi
 * @param {Date|string|number} arg1 - Date object, tanggal YYYY-MM-DD, atau tahun (number)
 * @param {number} [arg2] - Bulan (1-12) jika arg1 number
 * @param {number} [arg3] - Hari (1-31) jika arg1 number
 * @returns {object|null}
 */
export function getPetungKehidupanByDate(arg1, arg2, arg3) {
  let y, m, d;

  if (arg1 instanceof Date) {
    y = arg1.getFullYear();
    m = arg1.getMonth() + 1;
    d = arg1.getDate();
  } else if (typeof arg1 === 'string') {
    const parts = arg1.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      [y, m, d] = parts;
    } else {
      const parsed = new Date(arg1);
      if (!isNaN(parsed.getTime())) {
        y = parsed.getFullYear();
        m = parsed.getMonth() + 1;
        d = parsed.getDate();
      } else {
        return null;
      }
    }
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number') {
    y = arg1;
    m = arg2;
    d = arg3;
  } else {
    const now = new Date();
    y = now.getFullYear();
    m = now.getMonth() + 1;
    d = now.getDate();
  }

  const tglJawa = getTanggalJawaLengkap(y, m, d);
  if (!tglJawa) return null;

  const dina = tglJawa.dino;
  const pasaran = tglJawa.pas;
  const neptu = tglJawa.neptu;

  const dataWeton = lookupWetonTernakLoroGeblak(dina, pasaran);
  if (!dataWeton) return null;

  return {
    date: {
      year: y,
      month: m,
      day: d,
      dateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    },
    tglJawa,
    dina,
    pasaran,
    neptu,
    ternak: dataWeton.ternak,
    loro: dataWeton.loro,
    geblak: dataWeton.geblak
  };
}

/**
 * Mengambil data petung kehidupan langsung berdasarkan nama dina & pasaran
 * @param {string} dina - contoh: "Minggu"
 * @param {string} pasaran - contoh: "Pon"
 * @returns {object|null}
 */
export function getPetungKehidupanByWeton(dina, pasaran) {
  const dataWeton = lookupWetonTernakLoroGeblak(dina, pasaran);
  if (!dataWeton) return null;

  return {
    dina: dataWeton.dina,
    pasaran: dataWeton.pasaran,
    neptu: dataWeton.neptu_jumlah,
    ternak: dataWeton.ternak,
    loro: dataWeton.loro,
    geblak: dataWeton.geblak
  };
}

/**
 * Mencari kecocokan hari pada tanggal, bulan, dan tahun tertentu
 * untuk Petung Kehidupan (Wiwit Ternak, Jalaran Loro, atau Petung Geblak).
 * 
 * @param {Object} options
 * @param {number} options.tahun Tahun Masehi
 * @param {number} options.bulan Bulan Masehi (1 - 12)
 * @param {'ternak' | 'loro' | 'geblak'} [options.jenis='ternak'] Sub-bidang petung kehidupan
 * @param {string} [options.filterKategori='becik'] Filter kategori (misal: 'becik', 'gajah', 'suku', 'watu', 'buto', 'all')
 * @returns {Object}
 */
export function cariHariPetungKehidupan({
  tahun,
  bulan,
  jenis = 'ternak',
  filterKategori = 'becik'
} = {}) {
  const y = parseInt(tahun, 10);
  const m = parseInt(bulan, 10);
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    throw new Error('Tahun lan wulan kedah dipunisi kanthi leres kanggé pados dinten petung kehidupan.');
  }

  const daysCount = getDaysInMonth(y, m);
  const matches = [];

  for (let d = 1; d <= daysCount; d++) {
    const item = getPetungKehidupanByDate(y, m, d);
    if (!item) continue;

    let isMatch = false;
    const f = String(filterKategori || '').toLowerCase().trim();

    if (jenis === 'ternak') {
      const kat = item.ternak.kode || item.ternak.kategori;
      if (f === 'all' || !f) {
        isMatch = true;
      } else if (f === 'becik') {
        isMatch = kat === 'Gajah' || kat === 'Suku';
      } else if (f === 'gajah') {
        isMatch = kat === 'Gajah';
      } else if (f === 'suku') {
        isMatch = kat === 'Suku';
      } else if (f === 'watu') {
        isMatch = kat === 'Watu';
      } else if (f === 'buto') {
        isMatch = kat === 'Buto';
      }
    } else if (jenis === 'loro') {
      const kat = (item.loro.kode || item.loro.kategori || '').toLowerCase();
      isMatch = (f === 'all' || !f) ? true : kat.includes(f);
    } else if (jenis === 'geblak') {
      const kat = (item.geblak.kode || item.geblak.kategori || '').toLowerCase();
      isMatch = (f === 'all' || !f) ? true : kat.includes(f);
    }

    if (isMatch) {
      matches.push({
        tanggal: d,
        bulan: m,
        tahun: y,
        isoDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        dina: item.dina,
        pasaran: item.pasaran,
        neptu: item.neptu,
        tglJawa: item.tglJawa,
        ternak: item.ternak,
        loro: item.loro,
        geblak: item.geblak
      });
    }
  }

  return {
    tahun: y,
    bulan: m,
    jenis,
    filterKategori,
    totalHari: daysCount,
    matches
  };
}

export {
  weton_35,
  WETON_35_LIST,
  KAMUS_WIWIT_TERNAK,
  KAMUS_JALARAN_LORO,
  KAMUS_GEBLAK
};
