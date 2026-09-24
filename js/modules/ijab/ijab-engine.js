/**
 * Jagad Jawa — Engine Petung Ijab (Pernikahan Tradisi Jawa)
 * Berdasarkan manuskrip tradisi pada ijab_petung_cleaned.xlsx
 * 
 * PERHATIAN:
 * Modul ini menggunakan sistem Neptu KHUSUS Ijab, TERPISAH dari Neptu Kalender standar.
 * Dilarang menyamakan neptu ijab dengan neptu watak/pitung harian.
 */

import {
  NEPTU_IJAB_DINA,
  NEPTU_IJAB_PASARAN,
  IJAB_WUKU,
  IJAB_SASI,
  IJAB_TAHUN_WINDU,
  IJAB_WETON,
  KAMUS_SURASA_IJAB,
  IJAB_TANGGAL_JAWA,
  REF_DUA_SISTEM_NEPTU
} from '../../data/ijab-db.js';

// Normalisasi nama teks (lowercase tanpa spasi ekstra)
function norm(str) {
  return String(str || '').trim().toLowerCase();
}

/**
 * Ambil Neptu Ijab untuk Dina (Hari)
 * @param {string} dina - contoh: "Minggu", "Senin", dst.
 * @returns {number|null}
 */
export function getNeptuIjabDina(dina) {
  const target = norm(dina);
  const found = NEPTU_IJAB_DINA.find(d => norm(d.dina) === target);
  return found ? found.neptu_dina_ijab : null;
}

/**
 * Ambil Neptu Ijab untuk Pasaran
 * @param {string} pasaran - contoh: "Legi", "Pahing", dst.
 * @returns {number|null}
 */
export function getNeptuIjabPasaran(pasaran) {
  const target = norm(pasaran);
  const found = NEPTU_IJAB_PASARAN.find(p => norm(p.pasaran) === target);
  return found ? found.neptu_pasaran_ijab : null;
}

/**
 * Hitung jumlah Neptu Ijab
 */
export function hitungNeptuIjab(dina, pasaran) {
  const neptuDina = getNeptuIjabDina(dina);
  const neptuPasaran = getNeptuIjabPasaran(pasaran);
  const jumlah = (neptuDina !== null && neptuPasaran !== null) ? neptuDina + neptuPasaran : null;
  return {
    dina,
    pasaran,
    neptuDina,
    neptuPasaran,
    neptuJumlah: jumlah
  };
}

/**
 * Lookup makna weton Ijab dari database 35 weton
 */
export function getIjabWeton(dina, pasaran) {
  const nDina = norm(dina);
  const nPasaran = norm(pasaran);
  const found = IJAB_WETON.find(w => norm(w.dina) === nDina && norm(w.pasaran) === nPasaran);
  if (!found) return null;
  return { ...found };
}

/**
 * Lookup rekomendasi Wuku untuk Ijab (30 Wuku)
 */
export function getIjabWuku(wukuName) {
  if (!wukuName) return null;
  const nWuku = norm(wukuName);
  const found = IJAB_WUKU.find(w => norm(w.wuku) === nWuku);
  return found ? { ...found } : null;
}

/**
 * Lookup anjuran Sasi Jawa untuk Ijab (12 Sasi)
 */
export function getIjabSasi(sasiName) {
  if (!sasiName) return null;
  const nSasi = norm(sasiName);
  const found = IJAB_SASI.find(s => norm(s.sasi_jawa) === nSasi || norm(s.alias_sumber) === nSasi);
  return found ? { ...found } : null;
}

/**
 * Lookup pengaruh Tahun Jawa Windu untuk Ijab (8 Tahun)
 */
export function getIjabTahunWindu(tahunName) {
  if (!tahunName) return null;
  const nTahun = norm(tahunName);
  const found = IJAB_TAHUN_WINDU.find(t => norm(t.tahun_jawa) === nTahun);
  return found ? { ...found } : null;
}

/**
 * Lookup anjuran Tanggal Jawa (1-30)
 */
export function getIjabTanggalJawa(tanggalNum) {
  const tgl = parseInt(tanggalNum, 10);
  if (isNaN(tgl) || tgl < 1 || tgl > 30) return null;
  const found = IJAB_TANGGAL_JAWA.find(t => t.tanggal_jawa === tgl);
  return found ? { ...found } : null;
}

/**
 * Menghitung keseluruhan Petung Ijab secara komprehensif
 * @param {Object} params
 * @param {string} params.dina - Hari Masehi / Jawa (Minggu..Sabtu)
 * @param {string} params.pasaran - Pasaran (Legi..Kliwon)
 * @param {string} [params.wuku] - Nama Wuku (Sinta..Watugunung)
 * @param {string} [params.sasi] - Sasi Jawa (Sura..Besar)
 * @param {string} [params.tahun] - Tahun Jawa Windu (Alip..Jimakir)
 * @param {number|string} [params.tanggalJawa] - Tanggal Jawa (1..30)
 */
export function hitungPetungIjab({ dina, pasaran, wuku, sasi, tahun, tanggalJawa } = {}) {
  if (!dina || !pasaran) {
    throw new Error('Dina lan Pasaran kedah dipuntemtokaken kanggé petung ijab.');
  }

  const neptuCalc = hitungNeptuIjab(dina, pasaran);
  const wetonData = getIjabWeton(dina, pasaran);
  const wukuData = wuku ? getIjabWuku(wuku) : null;
  const sasiData = sasi ? getIjabSasi(sasi) : null;
  const tahunData = tahun ? getIjabTahunWindu(tahun) : null;
  const tanggalData = tanggalJawa ? getIjabTanggalJawa(tanggalJawa) : null;

  // Analisis skor / status sintesis
  let scoreBecik = 0;
  let scoreAla = 0;
  const factors = [];

  if (wetonData) {
    if (wetonData.status_ringkas === 'Becik') {
      scoreBecik += 2;
      factors.push({ label: 'Weton Ijab', status: 'Becik', desc: `${wetonData.surasane_ijab}: ${wetonData.tegese_surasa_ijab}` });
    } else {
      scoreAla += 2;
      factors.push({ label: 'Weton Ijab', status: 'Ala', desc: `${wetonData.surasane_ijab}: ${wetonData.tegese_surasa_ijab}` });
    }
  }

  if (wukuData) {
    if (wukuData.kanggo_ijab === 'Becik') {
      scoreBecik += 2;
      factors.push({ label: 'Wuku ' + wukuData.wuku, status: 'Becik', desc: 'Raos becik kanggé akad/ijab' });
    } else if (wukuData.kanggo_ijab === 'Ala') {
      scoreAla += 2;
      factors.push({ label: 'Wuku ' + wukuData.wuku, status: 'Ala', desc: 'Kirang saé kanggé akad/ijab' });
    } else {
      factors.push({ label: 'Wuku ' + wukuData.wuku, status: 'Sedheng', desc: 'Netral / Sedheng' });
    }
  }

  if (sasiData) {
    const isAla = sasiData.kanggo_ijab.toLowerCase().includes('rusak') ||
                  sasiData.kanggo_ijab.toLowerCase().includes('ala') ||
                  sasiData.kanggo_ijab.toLowerCase().includes('mati') ||
                  sasiData.kanggo_ijab.toLowerCase().includes('utang');
    if (isAla) {
      scoreAla += 1;
      factors.push({ label: 'Sasi ' + sasiData.sasi_jawa, status: 'Ala', desc: sasiData.kanggo_ijab });
    } else {
      scoreBecik += 1;
      factors.push({ label: 'Sasi ' + sasiData.sasi_jawa, status: 'Becik', desc: sasiData.kanggo_ijab });
    }
  }

  if (tanggalData) {
    if (tanggalData.tegese_status === 'Becik') {
      scoreBecik += 1;
      factors.push({ label: `Tanggal ${tanggalData.tanggal_jawa} Jawa`, status: 'Becik', desc: tanggalData.pakarti_tanggal_jawa });
    } else {
      scoreAla += 1;
      factors.push({ label: `Tanggal ${tanggalData.tanggal_jawa} Jawa`, status: 'Ala', desc: tanggalData.pakarti_tanggal_jawa });
    }
  }

  if (tahunData) {
    factors.push({ label: 'Tahun ' + tahunData.tahun_jawa, status: 'Kawigatosan', desc: tahunData.kanggo_ijab });
  }

  let simpulanStatus = 'Sedheng';
  let simpulanBadge = 'Cukup Rahayu';
  let simpulanWarna = 'amber';

  if (scoreBecik >= scoreAla + 2) {
    simpulanStatus = 'Becik';
    simpulanBadge = 'Hanggayuh Rahayu (Becik Sanget)';
    simpulanWarna = 'emerald';
  } else if (scoreAla >= scoreBecik + 2) {
    simpulanStatus = 'Ala';
    simpulanBadge = 'Perlu Kawigatosan / Nyenyuwun Pangestu';
    simpulanWarna = 'rose';
  }

  return {
    dina,
    pasaran,
    neptuCalc,
    wetonData,
    wukuData,
    sasiData,
    tahunData,
    tanggalData,
    factors,
    scoreBecik,
    scoreAla,
    simpulan: {
      status: simpulanStatus,
      badge: simpulanBadge,
      warna: simpulanWarna
    },
    catatanSistemNeptu: 'Petungan punika ngagem paugeran Neptu Khusus Ijab (dina: Ming5, Sen4, Sel1, Rab6, Kam7, Jum3, Sab2 | pasaran: Leg2, Pah3, Pon4, Wag5, Kliw6), boten sami kaliyan neptu kalender/watak padintenan.'
  };
}

export {
  NEPTU_IJAB_DINA,
  NEPTU_IJAB_PASARAN,
  IJAB_WUKU,
  IJAB_SASI,
  IJAB_TAHUN_WINDU,
  IJAB_WETON,
  KAMUS_SURASA_IJAB,
  IJAB_TANGGAL_JAWA,
  REF_DUA_SISTEM_NEPTU
};
