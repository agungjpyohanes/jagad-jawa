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
  const parts = nama.trim().replace(/\s+/g, ' ').split(' ');
  if (parts.length === 0 || !parts[0]) return { depan: 'HA', belakang: 'HA' };

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].slice(-1).toUpperCase();
  return {
    depan: AKSARA_MAP[first] || 'HA',
    belakang: AKSARA_MAP[last] || 'HA'
  };
}

/**
 * Mendapatkan bobot aksara numerik untuk metode IV dan V/VI.
 * @param {string} code Kode aksara (misal "HA", "NA")
 * @param {'iv'|'vvi'} type Tipe metode aksara
 * @returns {number}
 */
export function getAksaraVal(code, type = 'iv') {
  const found = AKSARA_PERJODOHAN.find(a => a.kode === code);
  return found ? (type === 'iv' ? found.iv : found.vvi) : 1;
}

/**
 * Hitung Pitung Jawa 7 Metode Perjodohan.
 * @param {Object} p Data calon wanita { nama, hari, pasaran, neptu, aksaraDepan, aksaraBelakang }
 * @param {Object} l Data calon pria { nama, hari, pasaran, neptu, aksaraDepan, aksaraBelakang }
 * @returns {Object} Hasil perhitungan 7 metode, ringkasan skor, dan evaluasi
 */
export function hitungPitung7Metode(p, l) {
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

  const totalAksaraIV = getAksaraVal(akDP, 'iv') + getAksaraVal(akBP, 'iv') +
                        getAksaraVal(akDL, 'iv') + getAksaraVal(akBL, 'iv');
  const sisaIV = totalAksaraIV % 7;

  const totalAksaraVVI = getAksaraVal(akDP, 'vvi') + getAksaraVal(akDL, 'vvi');
  const sisaV = totalAksaraVVI % 7;
  const sisaVI = totalAksaraVVI % 6;

  const hasilI = HASIL_I_JODOH[sisaI] || { nama: '-', arti: '-', status: 'campur' };
  const hasilII = HASIL_II_JODOH[sisaII] || { nama: '-', arti: '-', status: 'campur' };
  const hasilIII = HASIL_III_JODOH[sisaIII] || { nama: '-', arti: '-', status: 'campur' };
  const hasilIV = HASIL_IV_JODOH[sisaIV] || { nama: '-', arti: '-', status: 'campur' };
  const hasilV = HASIL_V_JODOH[sisaV] || { nama: '-', arti: '-', status: 'campur' };
  const hasilVI = HASIL_VI_JODOH[sisaVI] || { nama: '-', arti: '-', status: 'campur' };
  const hasilVII = { nama: 'Yuwana / Becik', arti: 'Kombinasi dina becik rahayu tumraping kulawarga', status: 'baik' };

  const rows = [
    { no: 'I', namaMetode: 'Sisa Bagi 4', h: hasilI, rumus: `Neptu (${neptuP} + ${neptuL}) = ${totalNeptu} ÷ 4 sisa ${sisaI}` },
    { no: 'II', namaMetode: 'Sisa Bagi 5 (Panca Sudha)', h: hasilII, rumus: `Neptu ${totalNeptu} ÷ 5 sisa ${sisaII}` },
    { no: 'III', namaMetode: 'Sisa Bagi 7 (Sapta Vara)', h: hasilIII, rumus: `Neptu ${totalNeptu} ÷ 7 sisa ${sisaIII}` },
    { no: 'IV', namaMetode: 'Aksara Total Bagi 7', h: hasilIV, rumus: `Aksara total ${totalAksaraIV} ÷ 7 sisa ${sisaIV}` },
    { no: 'V', namaMetode: 'Aksara Depan Bagi 7', h: hasilV, rumus: `Aksara depan (${akDP} + ${akDL}) = ${totalAksaraVVI} ÷ 7 sisa ${sisaV}` },
    { no: 'VI', namaMetode: 'Aksara Depan Bagi 6', h: hasilVI, rumus: `Aksara depan ${totalAksaraVVI} ÷ 6 sisa ${sisaVI}` },
    { no: 'VII', namaMetode: 'Kombinasi Dina & Pasaran', h: hasilVII, rumus: `${p.hari || '-'} + ${l.hari || '-'}` }
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
 * @param {number} skor 
 * @returns {{ predikat: string, badgeClass: string, deskripsi: string, saranKultural: string }}
 */
export function getTingkatKeharmonisan(skor) {
  if (skor >= 70) {
    return {
      predikat: "Rahayu Utama (Sangat Selaras & Berkah)",
      badgeClass: "bg-emerald-950/80 text-emerald-300 border-emerald-500/70",
      deskripsi: "Kombinasi neptu dan aksara kedua mempelai dinaungi dominasi kebajikan, kelimpahan sandhang pangan, dan ketenteraman batin.",
      saranKultural: "Rawat komunikasi yang santun, saling menjaga kehormatan keluarga besar, dan senantiasa bersyukur."
    };
  } else if (skor >= 45) {
    return {
      predikat: "Madya Rahayu (Harmoni Berimbang)",
      badgeClass: "bg-amber-950/80 text-amber-300 border-amber-500/70",
      deskripsi: "Terdapat perpaduan antara aspek kemudahan rezeki dan tantangan dinamika watak yang menuntut kedewasaan bersikap.",
      saranKultural: "Kunci kelanggengan adalah 'tepa slira' (tenggang rasa), musyawarah saat menghadapi ujian, dan saling menguatkan tekad."
    };
  } else {
    return {
      predikat: "Ujian & Ikhtiar Tolak Balak",
      badgeClass: "bg-rose-950/80 text-rose-300 border-rose-500/70",
      deskripsi: "Primbon mengindikasikan potensi gesekan watak atau ujian raga yang membutuhkan keikhlasan serta kesabaran ekstra.",
      saranKultural: "Dianjurkan memperbanyak sedekah, doa keselamatan, serta menggelar doa selamatan tolak balak menjelang hari ijab qobul."
    };
  }
}

/**
 * Mencari 5 tanggal mantu terbaik (rahayu) terdekat.
 * Kriteria:
 * 1. Dino Ijo (hari rahayu / becik).
 * 2. Bukan Dino Gede (hari nahas / sangar).
 * 3. Panca Sudha Mantu: (totalNeptuPasangan + neptuHari) % 5 menghasilkan sisa 1 (Sri), 2 (Lungguh), atau 3 (Gedhong).
 * 
 * @param {number} totalNeptuPasangan 
 * @param {Date|string} [startDate] Tanggal mulai (default: 30 hari ke depan)
 * @param {number} [count=5] Jumlah rekomendasi yang dicari
 * @returns {Array<Object>}
 */
export function cariRekomendasiTanggalMantu(totalNeptuPasangan, startDate = null, count = 5) {
  const tn = Number(totalNeptuPasangan) || 25;
  let curr = startDate ? new Date(startDate) : new Date();
  if (isNaN(curr.getTime())) curr = new Date();

  // Jika tidak ditentukan tanggal mulai secara spesifik, mulai dari 30 hari ke depan untuk waktu persiapan praktis
  if (!startDate) {
    curr.setDate(curr.getDate() + 30);
  }

  const results = [];
  const maxDays = 365; // Cari hingga 1 tahun ke depan

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
        const pancaInfo = PANCA_SUDHA_MANTU_DATA[sisa];
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const namaBulan = BULAN_MASEHI[m - 1];
        const formattedDate = `${dino}, ${d} ${namaBulan} ${y}`;

        results.push({
          dateStr,
          formattedDate,
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
          isDinoGede: false
        });

        if (results.length >= count) break;
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
