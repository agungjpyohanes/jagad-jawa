/**
 * Jagad Jawa — Engine Petung Omah & Cempuri (Pembangunan, Boyongan, & Lawangan)
 * Disarikan dari petung_omah_cempuri_cleaned.xlsx
 * 
 * Fitur:
 * 1. Komparasi Neptu App Standar vs Neptu NB
 * 2. Petungan Set A (Bumi/Jalmo/Wana/Kapetak - bagi 4)
 * 3. Petungan Set B (Kerta/Yasa/Candi/Rogoh/Sempoyong - bagi 5)
 * 4. Petungan Set C (Guru/Ratu/Rogoh/Sempoyong - bagi 4 ngagem Neptu NB)
 * 5. Larangan Arah Boyongan (Ngalor/Ngetan/Ngidul/Ngulon)
 * 6. Cempuri Lawangan (4 Arah x 9 Posisi)
 * 7. Pilihan Sasi & Mangsa
 * 8. Pilihan Lemah (Ciri Lemah, Aran, Akibat, & Sarana)
 */

import * as omahDb from '../../data/omah-db.js';
import {
  NEPTU_APP_WETON,
  NEPTU_OMAH_NB,
  CEMPURI_ARAH,
  OMAH_SISA4_SET_A,
  OMAH_SISA4_SET_B,
  OMAH_SISA4_SET_C,
  OMAH_RUMUS,
  OMAH_MENURUT_SASI,
  OMAH_MENURUT_MANGSA,
  OMAH_LARANGAN_ARAH_PINDAH,
  OMAH_PILIH_LEMAH
} from '../../data/omah-db.js';
import { getDaysInMonth, getTanggalJawaLengkap } from '../kalender/kalender-engine.js';

const clKey = ['CEMPURI', 'LAWANGAN'].join('_');
let customOmahDataset = null;

export function setOmahDataset(ds) {
  customOmahDataset = ds;
}

export function getActiveOmahDb() {
  const active = (typeof globalThis !== 'undefined' && globalThis._currentOmahData) || customOmahDataset;
  if (active) {
    return {
      NEPTU_APP_WETON: active.neptu_app || active.neptu_app_weton || active.NEPTU_APP_WETON || NEPTU_APP_WETON,
      NEPTU_OMAH_NB: active.neptu_nb || active.neptu_omah_nb || active.NEPTU_OMAH_NB || NEPTU_OMAH_NB,
      CEMPURI_ARAH: active.cempuri_arah || CEMPURI_ARAH,
      cempuri_lawangan: active.cempuri_lawangan || omahDb[clKey],
      OMAH_SISA4_SET_A: active.set_a || active.sisa4_set_a || active.OMAH_SISA4_SET_A || OMAH_SISA4_SET_A,
      OMAH_SISA4_SET_B: active.set_b || active.sisa5_set_b || active.OMAH_SISA4_SET_B || OMAH_SISA4_SET_B,
      OMAH_SISA4_SET_C: active.set_c || active.sisa4_set_c || active.OMAH_SISA4_SET_C || OMAH_SISA4_SET_C,
      OMAH_MENURUT_SASI: active.menurut_sasi || active.omah_menurut_sasi || active.OMAH_MENURUT_SASI || OMAH_MENURUT_SASI,
      OMAH_MENURUT_MANGSA: active.menurut_mangsa || active.omah_menurut_mangsa || active.OMAH_MENURUT_MANGSA || OMAH_MENURUT_MANGSA,
      OMAH_LARANGAN_ARAH_PINDAH: active.larangan_arah || active.larangan_arah_pindah || active.OMAH_LARANGAN_ARAH_PINDAH || OMAH_LARANGAN_ARAH_PINDAH,
      OMAH_PILIH_LEMAH: active.pilih_lemah || active.omah_pilih_lemah || active.OMAH_PILIH_LEMAH || OMAH_PILIH_LEMAH
    };
  }
  return {
    NEPTU_APP_WETON,
    NEPTU_OMAH_NB,
    CEMPURI_ARAH,
    cempuri_lawangan: omahDb[clKey],
    OMAH_SISA4_SET_A,
    OMAH_SISA4_SET_B,
    OMAH_SISA4_SET_C,
    OMAH_MENURUT_SASI,
    OMAH_MENURUT_MANGSA,
    OMAH_LARANGAN_ARAH_PINDAH,
    OMAH_PILIH_LEMAH
  };
}

function norm(str) {
  return String(str || '').trim().toLowerCase();
}

export const CANONICAL_DINA_MAP = {
  minggu: 'Minggu',
  ahad: 'Minggu',
  ngahad: 'Minggu',
  senin: 'Senin',
  senen: 'Senin',
  selasa: 'Selasa',
  salasa: 'Selasa',
  rabu: 'Rabu',
  rebo: 'Rabu',
  kamis: 'Kamis',
  kemis: 'Kamis',
  jumat: 'Jumat',
  "jum'at": 'Jumat',
  jumaat: 'Jumat',
  sabtu: 'Sabtu',
  setu: 'Sabtu'
};

export const CANONICAL_PASARAN_MAP = {
  legi: 'Legi',
  manis: 'Legi',
  pahing: 'Pahing',
  paing: 'Pahing',
  pon: 'Pon',
  wage: 'Wage',
  kliwon: 'Kliwon',
  kasih: 'Kliwon',
  asih: 'Kliwon'
};

export const MASTER_NEPTU_APP = {
  dina: { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 },
  pasaran: { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 }
};

export const MASTER_NEPTU_NB = {
  dina: { Minggu: 6, Senin: 4, Selasa: 3, Rabu: 6, Kamis: 5, Jumat: 7, Sabtu: 8 },
  pasaran: { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 }
};

export function normalizeDina(dina) {
  const n = norm(dina).replace(/['`’]/g, "'");
  return CANONICAL_DINA_MAP[n] || (dina ? String(dina).trim() : '');
}

export function normalizePasaran(pasaran) {
  const n = norm(pasaran);
  return CANONICAL_PASARAN_MAP[n] || (pasaran ? String(pasaran).trim() : '');
}

/**
 * Ambil Neptu App Standar
 */
export function getNeptuApp(dina, pasaran) {
  const cDina = normalizeDina(dina);
  const cPasaran = normalizePasaran(pasaran);
  const nD = norm(cDina);
  const nP = norm(cPasaran);
  const db = getActiveOmahDb();

  let rowD = db.NEPTU_APP_WETON?.find(r => r.jenis === 'dina' && (norm(r.nama) === nD || norm(r.nama) === norm(dina)));
  let rowP = db.NEPTU_APP_WETON?.find(r => r.jenis === 'pasaran' && (norm(r.nama) === nP || norm(r.nama) === norm(pasaran)));

  const dVal = (rowD && typeof rowD.neptu === 'number') ? rowD.neptu : (MASTER_NEPTU_APP.dina[cDina] || 0);
  const pVal = (rowP && typeof rowP.neptu === 'number') ? rowP.neptu : (MASTER_NEPTU_APP.pasaran[cPasaran] || 0);

  return {
    dina: cDina || dina,
    pasaran: cPasaran || pasaran,
    neptuDina: dVal,
    neptuPasaran: pVal,
    neptuJumlah: dVal + pVal,
    sumber: 'Neptu Standar App / Kalender'
  };
}

/**
 * Ambil Neptu NB Tradisi Omah
 */
export function getNeptuNb(dina, pasaran) {
  const cDina = normalizeDina(dina);
  const cPasaran = normalizePasaran(pasaran);
  const nD = norm(cDina);
  const nP = norm(cPasaran);
  const db = getActiveOmahDb();

  let rowD = db.NEPTU_OMAH_NB?.find(r => r.jenis === 'dina' && (norm(r.nama) === nD || norm(r.nama) === norm(dina)));
  let rowP = db.NEPTU_OMAH_NB?.find(r => r.jenis === 'pasaran' && (norm(r.nama) === nP || norm(r.nama) === norm(pasaran)));

  const dVal = (rowD && typeof rowD.neptu === 'number') ? rowD.neptu : (MASTER_NEPTU_NB.dina[cDina] || 0);
  const pVal = (rowP && typeof rowP.neptu === 'number') ? rowP.neptu : (MASTER_NEPTU_NB.pasaran[cPasaran] || 0);

  return {
    dina: cDina || dina,
    pasaran: cPasaran || pasaran,
    neptuDina: dVal,
    neptuPasaran: pVal,
    neptuJumlah: dVal + pVal,
    sumber: 'Neptu NB (Naskah Babon Tradisi Omah)'
  };
}

/**
 * Hitung Petungan Set A: (Neptu App) % 4
 * 1: Bumi (Becik), 2: Jalmo (Ala), 3: Wana (Ala), 4: Kapetak (Ala)
 */
export function hitungSetA(neptuJumlahApp) {
  let rem = neptuJumlahApp % 4;
  if (rem === 0) rem = 4;
  const db = getActiveOmahDb();
  const list = db.OMAH_SISA4_SET_A || OMAH_SISA4_SET_A;
  let item = list?.find(x => x.sisa === rem || (rem === 4 && x.sisa === 0) || String(x.sisa) === String(rem));
  if (!item || !item.nama || item.nama === 'Unknown') {
    item = OMAH_SISA4_SET_A.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  }
  const watakText = (item.watak && typeof item.watak === 'object') ? (item.watak.jv || item.watak.id || '') : (item.watak || '');
  return {
    sisa: rem,
    nama: item.nama,
    watak: watakText,
    status: rem === 1 ? 'Becik' : 'Ala',
    rumus: `${neptuJumlahApp} mod 4 = ${rem}`
  };
}

/**
 * Hitung Petungan Set B: (Neptu App) % 5
 * 1: Kerta, 2: Yasa, 3: Candi, 4: Rogoh, 5: Sempoyong
 */
export function hitungSetB(neptuJumlahApp) {
  let rem = neptuJumlahApp % 5;
  if (rem === 0) rem = 5;
  const db = getActiveOmahDb();
  const list = db.OMAH_SISA4_SET_B || OMAH_SISA4_SET_B;
  let item = list?.find(x => x.sisa === rem || (rem === 5 && x.sisa === 0) || String(x.sisa) === String(rem));
  if (!item || !item.nama || item.nama === 'Unknown') {
    item = OMAH_SISA4_SET_B.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  }
  const watakText = (item.watak && typeof item.watak === 'object') ? (item.watak.jv || item.watak.id || '') : (item.watak || '');
  const isBecik = rem === 1 || rem === 2 || rem === 3;
  return {
    sisa: rem,
    nama: item.nama,
    watak: watakText,
    status: isBecik ? 'Becik' : 'Ala',
    rumus: `${neptuJumlahApp} mod 5 = ${rem}`
  };
}

/**
 * Hitung Petungan Set C: (Neptu NB) % 4
 * 1: Guru, 2: Ratu, 3: Rogoh, 4: Sempoyong
 */
export function hitungSetC(neptuJumlahNb) {
  let rem = neptuJumlahNb % 4;
  if (rem === 0) rem = 4;
  const db = getActiveOmahDb();
  const list = db.OMAH_SISA4_SET_C || OMAH_SISA4_SET_C;
  let item = list?.find(x => x.sisa === rem || (rem === 4 && x.sisa === 0) || String(x.sisa) === String(rem));
  if (!item || !item.nama || item.nama === 'Unknown') {
    item = OMAH_SISA4_SET_C.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  }
  const watakText = (item.watak && typeof item.watak === 'object') ? (item.watak.jv || item.watak.id || '') : (item.watak || '');
  const isBecik = rem === 1 || rem === 2;
  return {
    sisa: rem,
    nama: item.nama,
    watak: watakText,
    status: isBecik ? 'Becik' : 'Ala',
    rumus: `${neptuJumlahNb} (Neptu NB) mod 4 = ${rem}`
  };
}

/**
 * Cek Larangan Arah Boyongan
 */
export function cekLaranganArahBoyongan(neptuJumlahApp, arahPindah) {
  const nArah = arahPindah ? norm(arahPindah) : '';
  const prohibitedList = [];
  let isProhibited = false;
  let activeWarning = null;
  const db = getActiveOmahDb();

  for (const rule of db.OMAH_LARANGAN_ARAH_PINDAH) {
    const numbers = rule.neptu_jumlah_dalam.split(',').map(s => parseInt(s.trim(), 10));
    if (numbers.includes(neptuJumlahApp)) {
      prohibitedList.push(rule);
      if (nArah) {
        if (norm(rule.larangan_arah).includes(nArah) || (nArah === 'utara' && rule.larangan_arah.toLowerCase().includes('utara')) ||
            (nArah === 'timur' && rule.larangan_arah.toLowerCase().includes('timur')) ||
            (nArah === 'selatan' && rule.larangan_arah.toLowerCase().includes('selatan')) ||
            (nArah === 'barat' && rule.larangan_arah.toLowerCase().includes('barat'))) {
          isProhibited = true;
          activeWarning = rule.teks;
        }
      }
    }
  }

  return {
    neptuJumlah: neptuJumlahApp,
    prohibitedList,
    checkedDirection: arahPindah || null,
    isProhibited,
    warningText: activeWarning || (prohibitedList.length > 0 ? prohibitedList.map(p => p.teks).join('; ') : 'Boten wonten larangan arah tartamtu.')
  };
}

/**
 * Ambil data Cempuri Lawangan berdasarkan Arah dan Nomor Posisi (1-9)
 */
export function getCempuriLawangan(arah, nomor) {
  if (!arah) return null;
  const nA = norm(arah);
  let list = [];
  const db = getActiveOmahDb();
  const cLawang = db.cempuri_lawangan || omahDb[clKey];
  if (Array.isArray(cLawang)) {
    list = cLawang.filter(c => norm(c.arah) === nA);
  } else if (cLawang && typeof cLawang === 'object') {
    if (Array.isArray(cLawang[nA])) {
      list = cLawang[nA];
    }
  }
  const num = parseInt(nomor, 10);
  const specific = !isNaN(num) ? list.find(c => c.nomor === num || c.no === num || c.id === num) : null;
  return {
    arah,
    nomor: num || null,
    selected: specific || null,
    positions: list
  };
}

/**
 * Ambil petung menurut Sasi Jawa
 */
export function getOmahMenurutSasi(sasiName) {
  if (!sasiName) return null;
  const nS = norm(sasiName);
  const db = getActiveOmahDb();
  const found = db.OMAH_MENURUT_SASI.find(s => norm(s.sasi_jawa) === nS || norm(s.alias_sumber) === nS);
  return found ? { ...found } : null;
}

/**
 * Ambil petung menurut Pranata Mangsa
 */
export function getOmahMenurutMangsa(mangsaName) {
  if (!mangsaName) return null;
  const nM = norm(mangsaName);
  const db = getActiveOmahDb();
  const found = db.OMAH_MENURUT_MANGSA.find(m => norm(m.mangsa_kanon) === nM || norm(m.alias_sumber) === nM);
  return found ? { ...found } : null;
}

/**
 * Ambil data pilihan tanah/lemah
 */
export function getOmahPilihLemah(idOrCiri) {
  if (!idOrCiri) return null;
  const db = getActiveOmahDb();
  const asNum = parseInt(idOrCiri, 10);
  if (!isNaN(asNum)) {
    const f = db.OMAH_PILIH_LEMAH.find(l => l.id === asNum);
    return f ? { ...f } : null;
  }
  const nC = norm(idOrCiri);
  const f = db.OMAH_PILIH_LEMAH.find(l => norm(l.ciri_lemah).includes(nC) || norm(l.aran).includes(nC));
  return f ? { ...f } : null;
}

/**
 * Hitung Petung Omah & Cempuri Lengkap
 */
export function hitungPetungOmah({
  dina,
  pasaran,
  arahLawang,
  nomorLawang,
  arahPindah,
  sasi,
  mangsa,
  ciriLemahId
} = {}) {
  if (!dina || !pasaran) {
    throw new Error('Dina lan Pasaran kedah dipunisi kanggé ngetung Petung Omah.');
  }

  const canonDina = normalizeDina(dina);
  const canonPasaran = normalizePasaran(pasaran);
  const neptuApp = getNeptuApp(canonDina || dina, canonPasaran || pasaran);
  const neptuNb = getNeptuNb(canonDina || dina, canonPasaran || pasaran);

  const setA = hitungSetA(neptuApp.neptuJumlah);
  const setB = hitungSetB(neptuApp.neptuJumlah);
  const setC = hitungSetC(neptuNb.neptuJumlah);

  const laranganBoyongan = cekLaranganArahBoyongan(neptuApp.neptuJumlah, arahPindah);
  const cempuri = arahLawang ? getCempuriLawangan(arahLawang, nomorLawang) : null;
  const sasiData = sasi ? getOmahMenurutSasi(sasi) : null;
  const mangsaData = mangsa ? getOmahMenurutMangsa(mangsa) : null;
  const lemahData = ciriLemahId ? getOmahPilihLemah(ciriLemahId) : null;

  // Analisis simpulan harmoni
  let positifCount = 0;
  let negatifCount = 0;
  if (setA.status === 'Becik') positifCount++; else negatifCount++;
  if (setB.status === 'Becik') positifCount++; else negatifCount++;
  if (setC.status === 'Becik') positifCount++; else negatifCount++;

  let simpulanText = 'Sedheng / Prayogi';
  let simpulanBadge = 'Perlu Tetimbangan Manah';
  let simpulanColor = 'amber';

  if (positifCount >= 2 && !laranganBoyongan.isProhibited) {
    simpulanText = 'Rahayu Slamet';
    simpulanBadge = 'Dina Prayogi Sanget Kanggé Pembangunan';
    simpulanColor = 'emerald';
  } else if (negatifCount >= 2 || laranganBoyongan.isProhibited) {
    simpulanText = 'Perlu Prayitna';
    simpulanBadge = 'Wonten Pènget / Larangan Khusus';
    simpulanColor = 'rose';
  }

  return {
    dina: canonDina || dina,
    pasaran: canonPasaran || pasaran,
    neptuApp,
    neptuNb,
    setA,
    setB,
    setC,
    laranganBoyongan,
    cempuri,
    sasiData,
    mangsaData,
    lemahData,
    simpulan: {
      status: simpulanText,
      badge: simpulanBadge,
      color: simpulanColor,
      positifCount,
      negatifCount
    },
    disclaimer: 'Pènget Luhur: Petung punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi warisan leluhur, sanès paugeran teknik sipil utawi konstruksi bangunan mutlak. Kanggé karahayon fisik wangunan, tansah utamèkaken pètungan struktur teknik ingkang kuwat lan trep.'
  };
}

/**
 * Mencari hari-hari baik untuk pembangunan, pindah rumah, atau lawangan
 * pada bulan dan tahun tertentu berdasarkan kriteria yang dipilih.
 * 
 * @param {Object} options
 * @param {number} options.tahun Tahun Masehi (misal 2024)
 * @param {number} options.bulan Bulan Masehi (1 - 12)
 * @param {string} [options.kriteria='sedaya_becik'] 'rahayu_slamet' | 'sedaya_becik' | 'set_a_bumi' | 'set_b_becik' | 'set_c_becik' | 'bebas_pantangan'
 * @param {string} [options.arahPindah] Arah pindah/boyongan (Utara/Timur/Selatan/Barat)
 * @param {string} [options.arahLawang='Timur'] Arah lawangan
 * @param {number} [options.nomorLawang] Posisi lawangan (1-9)
 * @returns {Object} { tahun, bulan, totalHari, matches: Array }
 */
export function cariHariBaikOmah({
  tahun,
  bulan,
  kriteria = 'sedaya_becik',
  arahPindah = null,
  arahLawang = 'Timur',
  nomorLawang = null
} = {}) {
  const y = parseInt(tahun, 10);
  const m = parseInt(bulan, 10);
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    throw new Error('Tahun lan wulan kedah dipunisi kanthi leres kanggé pados dinten sae omah.');
  }

  const daysCount = getDaysInMonth(y, m);
  const matches = [];

  for (let d = 1; d <= daysCount; d++) {
    const tglJawa = getTanggalJawaLengkap(y, m, d);
    if (!tglJawa) continue;

    const res = hitungPetungOmah({
      dina: tglJawa.dino,
      pasaran: tglJawa.pas,
      arahLawang,
      nomorLawang,
      arahPindah,
      sasi: tglJawa.bulanJawa
    });

    let isMatch = false;
    switch (kriteria) {
      case 'rahayu_slamet':
        isMatch = res.simpulan.status === 'Rahayu Slamet';
        break;
      case 'set_a_bumi':
        isMatch = res.setA.status === 'Becik'; // Bumi
        break;
      case 'set_b_becik':
        isMatch = res.setB.status === 'Becik'; // Kerta, Yasa, Candi
        break;
      case 'set_c_becik':
        isMatch = res.setC.status === 'Becik'; // Guru, Ratu
        break;
      case 'bebas_pantangan':
        isMatch = !res.laranganBoyongan.isProhibited;
        break;
      case 'sedaya_becik':
      default:
        isMatch = !res.laranganBoyongan.isProhibited && (res.simpulan.status === 'Rahayu Slamet' || res.simpulan.positifCount >= 1);
        break;
    }

    if (isMatch) {
      matches.push({
        tanggal: d,
        bulan: m,
        tahun: y,
        isoDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        tglJawa,
        dina: tglJawa.dino,
        pasaran: tglJawa.pas,
        neptu: res.neptuApp.neptuJumlah,
        neptuNb: res.neptuNb.neptuJumlah,
        setA: res.setA,
        setB: res.setB,
        setC: res.setC,
        simpulan: res.simpulan,
        laranganBoyongan: res.laranganBoyongan
      });
    }
  }

  return {
    tahun: y,
    bulan: m,
    totalHari: daysCount,
    kriteria,
    matches
  };
}

export {
  NEPTU_APP_WETON,
  NEPTU_OMAH_NB,
  CEMPURI_ARAH,
  OMAH_SISA4_SET_A,
  OMAH_SISA4_SET_B,
  OMAH_SISA4_SET_C,
  OMAH_RUMUS,
  OMAH_MENURUT_SASI,
  OMAH_MENURUT_MANGSA,
  OMAH_LARANGAN_ARAH_PINDAH,
  OMAH_PILIH_LEMAH
};
