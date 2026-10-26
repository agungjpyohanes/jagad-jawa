/**
 * Jagad Jawa — Modul Domain: Jodoh Engine (Pitung Jawa 7 Metode)
 * Pure calculation functions untuk ramalan perjodohan Jawa berdasarkan
 * neptu weton dan aksara nama kedua mempelai.
 * 
 * Bebas dari ketergantungan DOM.
 */

import {
  AKSARA_PERJODOHAN,
  HASIL_I_JODOH,
  HASIL_II_JODOH,
  HASIL_III_JODOH,
  HASIL_IV_JODOH,
  HASIL_V_JODOH,
  HASIL_VI_JODOH
} from '../../data/marriage.js';
import {
  getNeptu,
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  WUKU,
  getDayInfo,
  isDinoIjo,
  isDinoGede,
  BULAN_MASEHI
} from '../kalender/kalender-engine.js';

/**
 * Disclaimer Etis & Kultural Perjodohan (Tahap 4)
 */
export const DISCLAIMER_ETIS_PERJODOHAN =
  "Paweling Budaya & Literasi Perjodohan: Petungan pitung perjodohan Jawa menika kearifan lokal leluhur minangka pandom tepa slira, mangertosi watak pasangan, sarta sarana ndedonga nyuwun karahayon dhumateng Gusti Kang Murbeng Dumadi. Asiling petungan sanes paugeran mutlak pesthi; lelandhesan baku ing salebeting bebrayan inggih menika kasetyan, gotong-royong, welas asih, lan ikhtiar lahir batin.";

/**
 * Pemetaan Panca Sudha Mantu (Sisa Bagi 5)
 */
export const PANCA_SUDHA_MANTU_DATA = {
  1: {
    predikat: 'Sri',
    kategoriLabel: 'Sri (Kemakmuran & Ayem)',
    makna: 'Rejeki lumintu, ayem tentrem, berkah sandhang pangan, lan gampil anggone mbangun bale wisma.'
  },
  2: {
    predikat: 'Lungguh',
    kategoriLabel: 'Lungguh (Drajat & Kehormatan)',
    makna: 'Pikantuk drajat, kamulyan, kinurmatan dening bebrayan agung, sarta gampil anggone pados pakaryan.'
  },
  3: {
    predikat: 'Gedhong',
    kategoriLabel: 'Gedhong (Kasugihan & Harta)',
    makna: 'Keluberan bandha donya, omah gedhe, lan tentrem uripe ing bebrayan.'
  },
  4: {
    predikat: 'Lara',
    kategoriLabel: 'Lara (Cobaan Raga)',
    makna: 'Rentan lelara utawa cobaan fisik, dipun pantangaken kanggé ijab mantu.'
  },
  0: {
    predikat: 'Pati',
    kategoriLabel: 'Pati (Rubeda Gesang)',
    makna: 'Cobaan urip abot, rubeda sangsara, dipun singkiri kanggé ijab mantu.'
  }
};

const AKSARA_MAP = {
  'A': 'HA', 'B': 'BA', 'C': 'CA', 'D': 'DA', 'E': 'HA', 'F': 'PA',
  'G': 'GA', 'H': 'HA', 'I': 'YA', 'J': 'JA', 'K': 'KA', 'L': 'LA',
  'M': 'MA', 'N': 'NA', 'O': 'HA', 'P': 'PA', 'R': 'RA', 'S': 'SA',
  'T': 'TA', 'U': 'WA', 'W': 'WA', 'Y': 'YA'
};

/**
 * Deteksi aksara depan & belakang dari string nama latin.
 * @param {string} nama 
 * @returns {{ depan: string, belakang: string }}
 */
export function autoDetectAksara(nama) {
  if (!nama || typeof nama !== 'string') return { depan: 'HA', belakang: 'HA' };
  const clean = nama.trim().replace(/\s+/g, ' ');
  const parts = clean.split(' ');
  if (parts.length === 0 || !parts[0]) return { depan: 'HA', belakang: 'HA' };

  const firstWord = parts[0].toUpperCase();
  const lastWord = parts[parts.length - 1].toUpperCase();

  // Deteksi gugus konsonan ngarep (DHA, THA, NGA, NYA) utawa aksara nglegena tunggal
  let depan = 'HA';
  if (firstWord.startsWith('DHA') || firstWord.startsWith('DH')) depan = 'DHA';
  else if (firstWord.startsWith('THA') || firstWord.startsWith('TH')) depan = 'THA';
  else if (firstWord.startsWith('NGA') || firstWord.startsWith('NG')) depan = 'NGA';
  else if (firstWord.startsWith('NYA') || firstWord.startsWith('NY')) depan = 'NYA';
  else {
    const firstChar = firstWord.charAt(0);
    depan = AKSARA_MAP[firstChar] || 'HA';
  }

  // Deteksi aksara pungkasan (mburi)
  let belakang = 'HA';
  if (lastWord.endsWith('DHA') || lastWord.endsWith('DH')) belakang = 'DHA';
  else if (lastWord.endsWith('THA') || lastWord.endsWith('TH')) belakang = 'THA';
  else if (lastWord.endsWith('NGA') || lastWord.endsWith('NG')) belakang = 'NGA';
  else if (lastWord.endsWith('NYA') || lastWord.endsWith('NY')) belakang = 'NYA';
  else {
    const lastChar = lastWord.slice(-1);
    belakang = AKSARA_MAP[lastChar] || 'HA';
  }

  return { depan, belakang };
}

/**
 * Mendapatkan bobot aksara numerik untuk metode IV dan V/VI.
 * @param {string} code Kode aksara (misal "HA", "NA")
 * @param {'iv'|'vvi'} type Tipe metode aksara
 * @param {Array} [customAksaraList]
 * @returns {number}
 */
export function getAksaraVal(code, type = 'iv', customAksaraList = null) {
  const list = customAksaraList || AKSARA_PERJODOHAN;
  const found = list.find(a => a.kode === code);
  return found ? (type === 'iv' ? found.iv : found.vvi) : 1;
}

/**
 * Hitung Pitung Jawa 7 Metode Perjodohan.
 * @param {Object} p Data calon wanita { nama, hari, pasaran, neptu, aksaraDepan, aksaraBelakang }
 * @param {Object} l Data calon pria { nama, hari, pasaran, neptu, aksaraDepan, aksaraBelakang }
 * @param {Object} [options={}] Optional injected dataset { HASIL_I_JODOH, HASIL_II_JODOH, HASIL_III_JODOH, HASIL_IV_JODOH, HASIL_V_JODOH, HASIL_VI_JODOH, AKSARA_PERJODOHAN }
 * @returns {Object} Hasil perhitungan 7 metode, ringkasan skor, dan evaluasi
 */
export function hitungPitung7Metode(p, l, options = {}) {
  const lookupI = options.HASIL_I_JODOH || HASIL_I_JODOH;
  const lookupII = options.HASIL_II_JODOH || HASIL_II_JODOH;
  const lookupIII = options.HASIL_III_JODOH || HASIL_III_JODOH;
  const lookupIV = options.HASIL_IV_JODOH || HASIL_IV_JODOH;
  const lookupV = options.HASIL_V_JODOH || HASIL_V_JODOH;
  const lookupVI = options.HASIL_VI_JODOH || HASIL_VI_JODOH;
  const aksaraList = options.AKSARA_PERJODOHAN || AKSARA_PERJODOHAN;

  const neptuP = Number(p.neptu) || getNeptu(p.hari, p.pasaran);
  const neptuL = Number(l.neptu) || getNeptu(l.hari, l.pasaran);

  const akDP = p.aksaraDepan || autoDetectAksara(p.nama).depan;
  const akBP = p.aksaraBelakang || autoDetectAksara(p.nama).belakang;
  const akDL = l.aksaraDepan || autoDetectAksara(l.nama).depan;
  const akBL = l.aksaraBelakang || autoDetectAksara(l.nama).belakang;

  const totalNeptu = neptuP + neptuL;
  const sisaI = totalNeptu % 4;
  const sisaII = totalNeptu % 5;
  const sisaIII = totalNeptu % 7;

  const totalAksaraIV = getAksaraVal(akDP, 'iv', aksaraList) + getAksaraVal(akBP, 'iv', aksaraList) +
                        getAksaraVal(akDL, 'iv', aksaraList) + getAksaraVal(akBL, 'iv', aksaraList);
  const sisaIV = totalAksaraIV % 7;

  const totalAksaraVVI = getAksaraVal(akDP, 'vvi', aksaraList) + getAksaraVal(akDL, 'vvi', aksaraList);
  const sisaV = totalAksaraVVI % 7;
  const sisaVI = totalAksaraVVI % 6;

  const hasilI = lookupI[sisaI] || { nama: '-', arti: '-', status: 'campur' };
  const hasilII = lookupII[sisaII] || { nama: '-', arti: '-', status: 'campur' };
  const hasilIII = lookupIII[sisaIII] || { nama: '-', arti: '-', status: 'campur' };
  const hasilIV = lookupIV[sisaIV] || { nama: '-', arti: '-', status: 'campur' };
  const hasilV = lookupV[sisaV] || { nama: '-', arti: '-', status: 'campur' };
  const hasilVI = lookupVI[sisaVI] || { nama: '-', arti: '-', status: 'campur' };
  const hasilVII = options.HASIL_VII_JODOH || {
    nama: 'Yuwana / Becik',
    arti: 'Kombinasi dina becik rahayu tumraping kulawarga',
    status: 'baik'
  };

  const rows = [
    { no: 'I', namaMetode: 'Sisa Bagi 4', h: hasilI, rumus: `Neptu (${neptuP} + ${neptuL}) = ${totalNeptu} ÷ 4 sisa ${sisaI}` },
    { no: 'II', namaMetode: 'Sisa Bagi 5 (Panca Sudha)', h: hasilII, rumus: `Neptu ${totalNeptu} ÷ 5 sisa ${sisaII}` },
    { no: 'III', namaMetode: 'Sisa Bagi 7 (Sapta Vara)', h: hasilIII, rumus: `Neptu ${totalNeptu} ÷ 7 sisa ${sisaIII}` },
    { no: 'IV', namaMetode: 'Aksara Total Bagi 7', h: hasilIV, rumus: `Aksara total ${totalAksaraIV} ÷ 7 sisa ${sisaIV}` },
    { no: 'V', namaMetode: 'Aksara Depan Bagi 7', h: hasilV, rumus: `Aksara depan (${akDP} + ${akDL}) = ${totalAksaraVVI} ÷ 7 sisa ${sisaV}` },
    { no: 'VI', namaMetode: 'Aksara Depan Bagi 6', h: hasilVI, rumus: `Aksara depan ${totalAksaraVVI} ÷ 6 sisa ${sisaVI}` },
    { no: 'VII', namaMetode: 'Kombinasi Dina & Pasaran (Yuwana/Becik)', h: hasilVII, rumus: `${p.hari || '-'} + ${l.hari || '-'}` }
  ];

  let baik = 0, buruk = 0, campur = 0;
  rows.forEach(r => {
    if (r.h.status === 'baik') baik++;
    else if (r.h.status === 'buruk') buruk++;
    else campur++;
  });

  const skorKeselarasan = Math.round((baik / 7) * 100);
  const keharmonisan = getTingkatKeharmonisan(skorKeselarasan);

  return {
    wanita: { nama: p.nama || 'Calon Pengantin Wanita', hari: p.hari, pasaran: p.pasaran, neptu: neptuP, aksaraDepan: akDP, aksaraBelakang: akBP },
    pria: { nama: l.nama || 'Calon Pengantin Pria', hari: l.hari, pasaran: l.pasaran, neptu: neptuL, aksaraDepan: akDL, aksaraBelakang: akBL },
    totalNeptu,
    rows,
    summary: {
      baik,
      buruk,
      campur,
      total: 7,
      skorKeselarasan,
      keharmonisan
    }
  };
}

/**
 * Mendapatkan taksiran tingkat keharmonisan kearifan lokal berdasarkan skor keselarasan pitung.
 * Mendukung input berupa skor numerik (0-100) atau objek hasil summary pitung.
 * @param {number|Object} skor 
 * @returns {{ predikat: string, tingkat: string, badgeClass: string, deskripsi: string, saranKultural: string }}
 */
export function getTingkatKeharmonisan(skor) {
  let numericScore = 0;
  if (typeof skor === 'object' && skor !== null) {
    if (typeof skor.skorKeselarasan === 'number') {
      numericScore = skor.skorKeselarasan;
    } else {
      const b = Number(skor.baik) || 0;
      const tot = Number(skor.total) || 7;
      numericScore = Math.round((b / tot) * 100);
    }
  } else {
    numericScore = Number(skor) || 0;
  }

  if (numericScore >= 70) {
    return {
      predikat: "Rahayu Utama (Sangat Selaras & Berkah)",
      tingkat: "Rahayu Utama",
      badgeClass: "bg-emerald-950/80 text-emerald-300 border-emerald-500/70",
      deskripsi: "Kombinasi neptu dan aksara kedua mempelai dinaungi dominasi kebajikan, kelimpahan sandhang pangan, dan ketenteraman batin.",
      saranKultural: "Rawat komunikasi yang santun, saling menjaga kehormatan keluarga besar, dan senantiasa bersyukur."
    };
  } else if (numericScore >= 45) {
    return {
      predikat: "Madya Rahayu (Harmoni Berimbang)",
      tingkat: "Madya Rahayu",
      badgeClass: "bg-amber-950/80 text-amber-300 border-amber-500/70",
      deskripsi: "Terdapat perpaduan antara aspek kemudahan rezeki dan tantangan dinamika watak yang menuntut kedewasaan bersikap.",
      saranKultural: "Kunci kelanggengan adalah 'tepa slira' (tenggang rasa), musyawarah saat menghadapi ujian, dan saling menguatkan tekad."
    };
  } else {
    return {
      predikat: "Ujian & Ikhtiar Tolak Balak",
      tingkat: "Ujian & Tolak Balak",
      badgeClass: "bg-rose-950/80 text-rose-300 border-rose-500/70",
      deskripsi: "Primbon mengindikasikan potensi gesekan watak atau ujian raga yang membutuhkan keikhlasan serta kesabaran ekstra.",
      saranKultural: "Dianjurkan memperbanyak sedekah, doa keselamatan, serta menggelar doa selamatan tolak balak menjelang hari ijab qobul."
    };
  }
}

/**
 * Mencari rekomendasi tanggal mantu terbaik (rahayu) miturut tradisi Jawa.
 * Mendukung rentang 1 tahun penuh, tahun berikutnya, serta penanda hari paling utama (Sri).
 * 
 * Kriteria Primbon Tradisi:
 * 1. Dino Ijo (hari rahayu / becik miturut Wuku).
 * 2. Bukan Dino Gede (bebas saking dino nahas / sangar).
 * 3. Panca Sudha Mantu: (totalNeptuPasangan + neptuHari) % 5 menghasilkan sisa 1 (Sri), 2 (Lungguh), atau 3 (Gedhong).
 * 4. Paling Utama: Sisa 1 (Sri) minangka drajat paling utama lambang kemakmuran & sandhang pangan tiada putus.
 * 
 * @param {number} totalNeptuPasangan 
 * @param {Date|string|Object} [startDateOrOptions] Tanggal mulai atau objek opsi { startDate, rentang, tahun, count, hanyaUtama }
 * @param {number} [count=5] Jumlah rekomendasi yang dicari (bila dipanggil dengan signature lama)
 * @returns {Array<Object>}
 */
export function cariRekomendasiTanggalMantu(totalNeptuPasangan, startDateOrOptions = null, countLimit = null) {
  const tn = Number(totalNeptuPasangan) || 25;

  let startDate = null;
  let rentang = '1-tahun'; // '1-tahun' | 'tahun-depan'
  let count = 5;
  let tahunKhusus = null;
  let hanyaUtama = false;

  if (startDateOrOptions && typeof startDateOrOptions === 'object' && !(startDateOrOptions instanceof Date)) {
    startDate = startDateOrOptions.startDate || null;
    rentang = startDateOrOptions.rentang || (startDateOrOptions.tahun ? 'tahun-khusus' : '1-tahun');
    count = startDateOrOptions.count || countLimit || 12;
    tahunKhusus = startDateOrOptions.tahun || null;
    hanyaUtama = Boolean(startDateOrOptions.hanyaUtama);
  } else {
    startDate = startDateOrOptions;
    if (countLimit !== null && countLimit !== undefined) {
      count = countLimit;
    } else {
      count = 5;
    }
  }

  let curr;
  let maxDays = 365;

  if (rentang === 'tahun-depan') {
    const nextYear = new Date().getFullYear() + 1;
    curr = new Date(nextYear, 0, 1);
    maxDays = 366;
  } else if (tahunKhusus) {
    curr = new Date(Number(tahunKhusus), 0, 1);
    maxDays = 366;
  } else if (startDate) {
    curr = new Date(startDate);
    if (isNaN(curr.getTime())) curr = new Date();
  } else {
    curr = new Date();
    // Default mulai dari 30 hari ke depan untuk waktu persiapan praktis
    curr.setDate(curr.getDate() + 30);
  }

  const results = [];

  for (let i = 0; i < maxDays; i++) {
    const y = curr.getFullYear();
    const m = curr.getMonth() + 1;
    const d = curr.getDate();

    const info = getDayInfo(y, m, d);
    const dino = HARI[info.weekdayId];
    const pas = PASARAN[info.pasaranId];
    const wukuName = WUKU[info.wukuId];
    const neptuHari = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];

    // Syarat 1 & 2: Harus Dino Ijo dan Bukan Dino Gede
    const dinoIjo = isDinoIjo(dino, pas, wukuName);
    const dinoGede = isDinoGede(dino, pas, wukuName);

    if (dinoIjo && !dinoGede) {
      const totalNeptuMantu = tn + neptuHari;
      const sisa = totalNeptuMantu % 5;

      // Syarat 3: Panca Sudha Mantu = Sri (1), Lungguh (2), atau Gedhong (3)
      if (sisa === 1 || sisa === 2 || sisa === 3) {
        const isPalingUtama = (sisa === 1);
        const isUtama = (sisa === 1 || sisa === 2);

        // Jika opsi hanyaUtama aktif, lewati sisa 2 dan 3
        if (hanyaUtama && !isPalingUtama) {
          curr.setDate(curr.getDate() + 1);
          continue;
        }

        const pancaInfo = PANCA_SUDHA_MANTU_DATA[sisa];
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const namaBulan = BULAN_MASEHI[m - 1];
        const formattedDate = `${dino}, ${d} ${namaBulan} ${y}`;

        const tingkatKeutamaan = isPalingUtama ? 'Paling Utama' : (sisa === 2 ? 'Utama' : 'Sae');
        const badgeUtama = isPalingUtama ? '⭐ Paling Utama (Sri)' : (sisa === 2 ? '✨ Utama (Lungguh)' : '🌿 Sae (Gedhong)');
        const isAkhirPekan = (info.weekdayId === 0 || info.weekdayId === 5 || info.weekdayId === 6);

        results.push({
          dateStr,
          formattedDate,
          year: y,
          month: m,
          day: d,
          dino,
          pas,
          weton: `${dino} ${pas}`,
          wukuName,
          neptuHari,
          totalNeptuMantu,
          sisaPancaSudha: sisa,
          predikat: pancaInfo.predikat,
          kategoriLabel: pancaInfo.kategoriLabel,
          makna: pancaInfo.makna,
          isDinoIjo: true,
          isDinoGede: false,
          isPalingUtama,
          isUtama,
          tingkatKeutamaan,
          badgeUtama,
          isAkhirPekan
        });

        if (count && results.length >= count) break;
      }
    }

    // Maju ke hari berikutnya
    curr.setDate(curr.getDate() + 1);
  }

  return results;
}

export {
  AKSARA_PERJODOHAN,
  HASIL_I_JODOH,
  HASIL_II_JODOH,
  HASIL_III_JODOH,
  HASIL_IV_JODOH,
  HASIL_V_JODOH,
  HASIL_VI_JODOH
};
