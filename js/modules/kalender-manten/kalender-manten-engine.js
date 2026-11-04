/**
 * Jagad Jawa — Engine Kalender Hari Baik Pernikahan (Palakrama)
 * 
 * Mengimplementasikan 17 kolom kalkulasi baku pernikahan Jawa:
 * 1. Tahun Masehi
 * 2. Tanggal Masehi
 * 3. Bulan Masehi
 * 4. Tahun Jawa (Windu & Kurup: Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jumakir)
 * 5. Tanggal Jawa (1 s.d. 30)
 * 6. Pakarti Tanggal Jawa (Nihil, Berhasil, Tanpa Hasil, dll.)
 * 7. Keterangan Pakarti Tanggal Jawa (Ala / Becik)
 * 8. Sasi Jawa (Suro, Sapar, Mulud, s.d. Besar)
 * 9. Pakarti Sasi Jawa Kanggo Manten (Rusak ing Tembemburine, Rahayu Sakabehe, dll.)
 * 10. Hari (Senin s.d. Minggu)
 * 11. Pasaran (Pon, Wage, Kliwon, Legi, Pahing)
 * 12. Neptu Dina Pasaran (Neptu Dina + Neptu Pasaran)
 * 13. Pasatuan Manten Miturut Neptu Pasaran (neptu % 6)
 * 14. Tegese Pasatuan Manten (Makna surasa)
 * 15. Wuku (Sinta s.d. Watugunung)
 * 16. Pakarti Wuku (Becik, Ala, Normal)
 * 17. Keterangan Dina (Analisis komprehensif hari baik)
 * 
 * Serta penanda kalender khusus:
 * - Dina Gede
 * - Dina Ijo
 * - Dina Abang
 * - Kategori Bulan Jelek Tahun Jawa
 */

import {
  getDayInfo,
  getTanggalJawaLengkap,
  BULAN_MASEHI,
  HARI,
  PASARAN,
  WUKU,
  WINDU,
  BULAN_JAWA,
  isDinoGede,
  isDinoIjo,
  getDinoWarnaStatus
} from '../../data/calendar.js';

import {
  NEPTU_IJAB_DINA,
  NEPTU_IJAB_PASARAN,
  IJAB_WUKU,
  IJAB_SASI,
  IJAB_TAHUN_WINDU,
  IJAB_WETON,
  KAMUS_SURASA_IJAB,
  IJAB_TANGGAL_JAWA
} from '../../data/ijab-db.js';

// Nilai Neptu Baku Petung Ijab (Sesuai Spesifikasi Budaya Kasampurnan Jawa)
export const NEPTU_BAKU_DINA = {
  'Senin': 4,
  'Selasa': 1,
  'Rabu': 6,
  'Kamis': 7,
  'Jumat': 3,
  'Sabtu': 2,
  'Minggu': 5
};

export const NEPTU_BAKU_PASARAN = {
  'Pon': 4,
  'Wage': 5,
  'Kliwon': 6,
  'Legi': 2,
  'Pahing': 3
};

// Pemetaan Rumus Sisa Modulo 6 Pesatuan Manten
// Rumus: (Neptu Dina + Neptu Pasaran) % 6
// Sisa 1: Kala Tinantang -> Padudon (Ala)
// Sisa 2: Demang Kanduruan -> Susah lan Lara-laranen (Ala)
// Sisa 3: Sanggar Waringin -> Bisa Dadi Pangaubaning Keluwarga (Becik)
// Sisa 4: Satriya Sinarajo -> Becik lan Rahayu (Becik)
// Sisa 5: Macan Ketawan -> Kisinan (Ala)
// Sisa 0 (atau 6): Nuju Pati -> Ala Banget (Ala)
export const PASATUAN_MODULO_6 = {
  1: {
    nama: 'Kala Tinantang',
    tegese: 'Padudon',
    status: 'Ala',
    badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60'
  },
  2: {
    nama: 'Demang Kanduruan',
    tegese: 'Susah lan Lara-laranen',
    status: 'Ala',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
  },
  3: {
    nama: 'Sanggar Waringin',
    tegese: 'Bisa Dadi Pangaubaning Keluwarga',
    status: 'Becik',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60'
  },
  4: {
    nama: 'Satriya Sinarajo',
    tegese: 'Becik lan Rahayu',
    status: 'Becik',
    badgeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/70'
  },
  5: {
    nama: 'Macan Ketawan',
    tegese: 'Kisinan',
    status: 'Ala',
    badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60'
  },
  0: {
    nama: 'Nuju Pati',
    tegese: 'Ala Banget',
    status: 'Ala',
    badgeClass: 'bg-red-950 text-red-200 border-red-600 font-bold'
  }
};

// Database Sasi Jelek Miturut Tahun Jawa (Windu)
// Sumber: Primbon Betaljemur Adammakna & IJAB_TAHUN_WINDU
export const BULAN_JELEK_TAHUN_JAWA = {
  'Alip': {
    sasiJelekIds: [6, 11], // Jumadilakir (6) & Sela/Dulkangidah (11)
    sasiJelekNames: ['Jumadilakir', 'Jumadilakhir', 'Sela', 'Dulkangidah'],
    keterangan: 'Jumadilakir lan Sela (Dulkangidah) bakal Kalebo Wisa',
    akibat: 'Kalebo Wisa'
  },
  'Ehe': {
    sasiJelekIds: [4, 9], // Bakda Mulud (4) & Pasa/Siyam (9)
    sasiJelekNames: ['Bakda Mulud', 'Bakdomulud', 'Pasa', 'Siyam'],
    keterangan: 'Bakda Mulud lan Pasa (Siyam) bakal kena Lara Balung',
    akibat: 'Kena Lara Balung'
  },
  'Jimawal': {
    sasiJelekIds: [3, 12], // Mulud (3) & Besar (12)
    sasiJelekNames: ['Mulud', 'Besar'],
    keterangan: 'Mulud lan Besar bakal kena lara Edan',
    akibat: 'Kena Lara Edan'
  },
  'Je': {
    sasiJelekIds: [1, 10], // Sura/Suro (1) & Sawal (10)
    sasiJelekNames: ['Sura', 'Suro', 'Sawal'],
    keterangan: 'Sura lan Sawal bakal Keli ing Banyu',
    akibat: 'Keli ing Banyu'
  },
  'Dal': {
    sasiJelekIds: [8], // Ruwah (8)
    sasiJelekNames: ['Ruwah'],
    keterangan: 'Ruwah bakal kena lara Basah',
    akibat: 'Kena Lara Basah'
  },
  'Be': {
    sasiJelekIds: [2, 7], // Sapar (2) & Rejeb (7)
    sasiJelekNames: ['Sapar', 'Rejeb'],
    keterangan: 'Sapar lan Rejeb bakal kena lara Rumat',
    akibat: 'Kena Lara Rumat'
  },
  'Wawu': {
    sasiJelekIds: [5], // Jumadilawal (5)
    sasiJelekNames: ['Jumadilawal'],
    keterangan: 'Jumadilawal bakal kena Prakara kang Gedhe',
    akibat: 'Kena Prakara kang Gedhe'
  },
  'Jumakir': {
    sasiJelekIds: [3, 12], // Mulud (3) & Besar (12)
    sasiJelekNames: ['Mulud', 'Besar'],
    keterangan: 'Mulud lan Besar bakal kesinungan lara',
    akibat: 'Kesinungan Lara'
  },
  'Jimakir': {
    sasiJelekIds: [3, 12],
    sasiJelekNames: ['Mulud', 'Besar'],
    keterangan: 'Mulud lan Besar bakal kesinungan lara',
    akibat: 'Kesinungan Lara'
  }
};

/**
 * Normalisasi string bantu
 */
function normStr(s) {
  return String(s || '').trim().toLowerCase().replace(/[\s\-_]/g, '');
}

/**
 * Cek apakah kombinasi Tahun Jawa dan Sasi Jawa masuk kategori Bulan Jelek
 */
export function evaluasiBulanJelekTahunJawa(tahunSiklus, sasiJawaName, sasiId = null) {
  const aturanTahun = BULAN_JELEK_TAHUN_JAWA[tahunSiklus];
  if (!aturanTahun) {
    return {
      isBulanJelek: false,
      keterangan: 'Bebas sasi jelek taun',
      akibat: null
    };
  }

  const nSasi = normStr(sasiJawaName);
  let cocok = false;

  if (sasiId && aturanTahun.sasiJelekIds.includes(sasiId)) {
    cocok = true;
  } else {
    cocok = aturanTahun.sasiJelekNames.some(name => normStr(name) === nSasi || nSasi.includes(normStr(name)));
  }

  if (cocok) {
    return {
      isBulanJelek: true,
      keterangan: aturanTahun.keterangan,
      akibat: aturanTahun.akibat,
      tahun: tahunSiklus
    };
  }

  return {
    isBulanJelek: false,
    keterangan: 'Bebas sasi jelek taun',
    akibat: null
  };
}

/**
 * Ambil Pakarti Tanggal Jawa (1 s.d. 30) dari database
 */
export function getPakartiTanggalJawa(tanggalJawa) {
  const tgl = parseInt(tanggalJawa, 10);
  const found = IJAB_TANGGAL_JAWA.find(t => t.tanggal_jawa === tgl);
  if (found) {
    return {
      tanggalJawa: tgl,
      pakarti: found.pakarti_tanggal_jawa,
      status: found.tegese_status // "Becik" atau "Ala"
    };
  }
  return {
    tanggalJawa: tgl,
    pakarti: 'Nihil',
    status: 'Becik'
  };
}

/**
 * Ambil Pakarti Sasi Jawa Kanggo Manten dari database
 */
export function getPakartiSasiJawaKanggoManten(sasiName, sasiId = null) {
  const nSasi = normStr(sasiName);
  let found = null;
  if (sasiId) {
    found = IJAB_SASI.find(s => s.id === sasiId);
  }
  if (!found) {
    found = IJAB_SASI.find(s => {
      return normStr(s.sasi_jawa) === nSasi || normStr(s.alias_sumber).includes(nSasi) || nSasi.includes(normStr(s.sasi_jawa));
    });
  }

  if (found) {
    const teks = found.kanggo_ijab;
    const isBecik = teks.toLowerCase().includes('rahayu') ||
                    teks.toLowerCase().includes('sugih') ||
                    teks.toLowerCase().includes('karaharjan');
    return {
      sasi: found.sasi_jawa,
      pakarti: teks,
      status: isBecik ? 'Becik' : 'Ala'
    };
  }

  return {
    sasi: sasiName || '-',
    pakarti: 'Ora kacathet',
    status: 'Sedheng'
  };
}

/**
 * Ambil Pakarti Wuku Kanggo Ijab dari database
 */
export function getPakartiWukuKanggoIjab(wukuName) {
  const nWuku = normStr(wukuName);
  const found = IJAB_WUKU.find(w => normStr(w.wuku) === nWuku);
  if (found) {
    return {
      wuku: found.wuku,
      status: found.kanggo_ijab // "Becik", "Ala", "Normal"
    };
  }
  return {
    wuku: wukuName || '-',
    status: 'Normal'
  };
}

/**
 * Hitung data lengkap 17 kolom untuk 1 hari kalender
 * @param {number} y - Tahun Masehi (e.g. 2026)
 * @param {number} m - Bulan Masehi (1 s.d. 12)
 * @param {number} d - Tanggal Masehi (1 s.d. 31)
 */
export function hitungHariBaikPernikahan(y, m, d) {
  const dayInfo = getDayInfo(y, m, d);
  const jawaInfo = getTanggalJawaLengkap(y, m, d);

  // 1. Tahun Masehi
  const tahunMasehi = y;
  // 2. Tanggal Masehi
  const tanggalMasehi = d;
  // 3. Bulan Masehi
  const bulanMasehi = BULAN_MASEHI[m - 1] || `${m}`;

  // 4. Tahun Jawa (Windu & Kurup: Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jumakir)
  // Kurup saat ini adalah Kurup Asapon (Salasiyah)
  const tahunSiklus = jawaInfo.tahunSiklus; // e.g. "Be", "Alip", etc.
  const namaWindu = jawaInfo.namaWindu;     // e.g. "Kuntara (Adi)"
  const tahunAJ = jawaInfo.tahunAJ;         // e.g. 1960
  const kurupStr = 'Kurup Asapon';
  const tahunJawaLengkap = `${tahunSiklus} (${namaWindu}, ${kurupStr})`;

  // 5. Tanggal Jawa (1 s.d. 30)
  const tanggalJawa = jawaInfo.tglJawa;

  // 6. Pakarti Tanggal Jawa & 7. Keterangan Pakarti Tanggal Jawa (Ala / Becik)
  const pakartiTgl = getPakartiTanggalJawa(tanggalJawa);
  const pakartiTanggalJawa = pakartiTgl.pakarti;
  const keteranganPakartiTanggalJawa = pakartiTgl.status; // "Becik" atau "Ala"

  // 8. Sasi Jawa (Suro, Sapar, Mulud, s.d. Besar)
  const sasiJawa = jawaInfo.bulanJawa;
  const sasiId = dayInfo.hijri[1]; // 1 s.d. 12

  // 9. Pakarti Sasi Jawa Kanggo Manten
  const pakartiSasi = getPakartiSasiJawaKanggoManten(sasiJawa, sasiId);
  const pakartiSasiJawaKanggoManten = pakartiSasi.pakarti;
  const statusSasiManten = pakartiSasi.status; // "Becik" atau "Ala"

  // 10. Hari (Senin, Selasa, dst.)
  const hari = jawaInfo.dino;

  // 11. Pasaran (Pon, Wage, Kliwon, Legi, Pahing)
  const pasaran = jawaInfo.pas;

  // 12. Neptu Dina Pasaran (Rumus: Neptu Dina + Neptu Pasaran)
  const neptuDina = NEPTU_BAKU_DINA[hari] !== undefined ? NEPTU_BAKU_DINA[hari] : 0;
  const neptuPasaran = NEPTU_BAKU_PASARAN[pasaran] !== undefined ? NEPTU_BAKU_PASARAN[pasaran] : 0;
  const neptuDinaPasaran = neptuDina + neptuPasaran;

  // 13. Pasatuan Manten Miturut Neptu Pasaran & 14. Tegese Pasatuan Manten
  const sisaMod6 = neptuDinaPasaran % 6;
  const pasatuanInfo = PASATUAN_MODULO_6[sisaMod6] || {
    nama: 'Nuju Pati',
    tegese: 'Ala Banget',
    status: 'Ala',
    badgeClass: 'bg-red-950 text-red-200 border-red-600'
  };
  const pasatuanManten = pasatuanInfo.nama;
  const tegesePasatuanManten = pasatuanInfo.tegese;
  const statusPasatuanManten = pasatuanInfo.status; // "Becik" atau "Ala"

  // 15. Wuku (Sinta s.d. Watugunung)
  const wuku = jawaInfo.wukuName;

  // 16. Pakarti Wuku (Becik, Ala, Normal)
  const pakartiWukuObj = getPakartiWukuKanggoIjab(wuku);
  const pakartiWuku = pakartiWukuObj.status; // "Becik", "Ala", "Normal"

  // Penanda Khusus:
  // - Dina Gede
  const isGede = isDinoGede(wuku, hari, pasaran);
  // - Dina Ijo
  const isIjo = isDinoIjo(wuku, hari, pasaran);
  // - Dina Abang (jika bukan Dina Ijo)
  const isAbang = !isIjo;

  // Evaluasi Bulan Jelek Tahun Jawa
  const evaluasiBulanJelek = evaluasiBulanJelekTahunJawa(tahunSiklus, sasiJawa, sasiId);

  // 17. Keterangan Dina:
  // Menggabungkan analisis sasi jelek tahun jawa, pakarti tanggal, wuku, neptu, dan Dina Ijo/Abang/Gede
  const analisis = susunKeteranganDina({
    tahunSiklus,
    sasiJawa,
    evaluasiBulanJelek,
    tanggalJawa,
    pakartiTgl,
    pakartiSasi,
    hari,
    pasaran,
    neptuDina,
    neptuPasaran,
    neptuDinaPasaran,
    pasatuanInfo,
    wuku,
    pakartiWuku,
    isGede,
    isIjo,
    isAbang
  });

  return {
    // 17 Kolom Resmi
    tahunMasehi,
    tanggalMasehi,
    bulanMasehi,
    tahunJawa: tahunJawaLengkap,
    tahunSiklus,
    namaWindu,
    tahunAJ,
    kurupStr,
    tanggalJawa,
    pakartiTanggalJawa,
    keteranganPakartiTanggalJawa,
    sasiJawa,
    pakartiSasiJawaKanggoManten,
    hari,
    pasaran,
    neptuDina,
    neptuPasaran,
    neptuDinaPasaran,
    pasatuanManten,
    tegesePasatuanManten,
    wuku,
    pakartiWuku,
    keteranganDina: analisis.keteranganLengkap,

    // Metadata & Flag Penanda
    isoDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    isDinaGede: isGede,
    isDinaIjo: isIjo,
    isDinaAbang: isAbang,
    isBulanJelek: evaluasiBulanJelek.isBulanJelek,
    bulanJelekWarning: evaluasiBulanJelek.keterangan,
    akibatBulanJelek: evaluasiBulanJelek.akibat,
    statusPasatuanManten,
    statusSasiManten,
    statusAkhir: analisis.statusAkhir, // "Becik Sanget", "Cukup Sae", "Ala / Pantangan"
    warnaBadgeAkhir: analisis.warnaBadgeAkhir,
    alasanStatus: analisis.alasan
  };
}

/**
 * Menyusun analisis teks komprehensif untuk Kolom 17: Keterangan Dina
 */
function susunKeteranganDina({
  tahunSiklus,
  sasiJawa,
  evaluasiBulanJelek,
  tanggalJawa,
  pakartiTgl,
  pakartiSasi,
  hari,
  pasaran,
  neptuDina,
  neptuPasaran,
  neptuDinaPasaran,
  pasatuanInfo,
  wuku,
  pakartiWuku,
  isGede,
  isIjo,
  isAbang
}) {
  const butir = [];
  let poinNegatif = 0;
  let poinPositif = 0;

  // 1. Bulan Jelek Tahun Jawa
  if (evaluasiBulanJelek.isBulanJelek) {
    poinNegatif += 5; // Bobot sangat berat
    butir.push(`⚠️ Bulan Jelek Tahun ${tahunSiklus}: ${evaluasiBulanJelek.keterangan}`);
  } else {
    poinPositif += 1;
    butir.push(`✓ Bebas sasi jelek tahun (${tahunSiklus})`);
  }

  // 2. Pasatuan Manten (Rumus Modulo 6)
  if (pasatuanInfo.status === 'Becik') {
    poinPositif += 3;
    butir.push(`✓ Pasatuan: ${pasatuanInfo.nama} (${pasatuanInfo.tegese})`);
  } else {
    if (pasatuanInfo.nama === 'Nuju Pati') {
      poinNegatif += 4;
      butir.push(`⛔ Pasatuan: Nuju Pati (Ala Banget)`);
    } else {
      poinNegatif += 2;
      butir.push(`▲ Pasatuan: ${pasatuanInfo.nama} (${pasatuanInfo.tegese})`);
    }
  }

  // 3. Pakarti Tanggal Jawa
  if (pakartiTgl.status === 'Becik') {
    poinPositif += 2;
    butir.push(`✓ Tanggal ${tanggalJawa} Jawa: ${pakartiTgl.pakarti}`);
  } else {
    poinNegatif += 2;
    butir.push(`▲ Tanggal ${tanggalJawa} Jawa: ${pakartiTgl.pakarti}`);
  }

  // 4. Pakarti Sasi Jawa Kanggo Manten
  if (pakartiSasi.status === 'Becik') {
    poinPositif += 2;
    butir.push(`✓ Sasi ${sasiJawa}: ${pakartiSasi.pakarti}`);
  } else {
    poinNegatif += 2;
    butir.push(`▲ Sasi ${sasiJawa}: ${pakartiSasi.pakarti}`);
  }

  // 5. Wuku Kanggo Ijab
  if (pakartiWuku === 'Becik') {
    poinPositif += 2;
    butir.push(`✓ Wuku ${wuku}: Becik kanggé akad`);
  } else if (pakartiWuku === 'Ala') {
    poinNegatif += 3;
    butir.push(`▲ Wuku ${wuku}: Ala kanggé akad`);
  } else {
    butir.push(`• Wuku ${wuku}: Normal/Sedheng`);
  }

  // 6. Penanda Dina Ijo / Abang / Gede
  if (isIjo) {
    poinPositif += 2;
    butir.push(`✓ Dina Ijo (Becik)`);
  } else {
    poinNegatif += 1;
    butir.push(`▲ Dina Abang (Pantangan Pawukon)`);
  }

  if (isGede) {
    butir.push(`★ Dina Gede (Dinten Mirunggan)`);
  }

  // Menentukan Status Akhir Rekomendasi Hari Pernikahan
  let statusAkhir = 'Cukup Sae';
  let warnaBadgeAkhir = 'amber';
  let labelKesimpulan = '';

  if (evaluasiBulanJelek.isBulanJelek || pasatuanInfo.nama === 'Nuju Pati' || poinNegatif >= 6) {
    statusAkhir = 'Ala / Pantangan';
    warnaBadgeAkhir = 'rose';
    labelKesimpulan = '[Pantangan Pernikahan] ' + butir.join(' · ');
  } else if (poinPositif >= 7 && poinNegatif <= 2 && pasatuanInfo.status === 'Becik' && isIjo) {
    statusAkhir = 'Becik Sanget';
    warnaBadgeAkhir = 'emerald';
    labelKesimpulan = '[Rekomendasi Utama / Rahayu] ' + butir.join(' · ');
  } else {
    statusAkhir = 'Cukup Sae';
    warnaBadgeAkhir = 'amber';
    labelKesimpulan = '[Cukup Rahayu / Netral] ' + butir.join(' · ');
  }

  return {
    keteranganLengkap: labelKesimpulan,
    statusAkhir,
    warnaBadgeAkhir,
    alasan: butir
  };
}

/**
 * Generate tabel kalkulasi hari baik pernikahan untuk rentang tanggal Masehi
 * @param {string|Date} startDate - Format YYYY-MM-DD atau Date
 * @param {string|Date} endDate - Format YYYY-MM-DD atau Date
 * @param {Object} [filterOptions] - Opsi filter (status, dina ijo, dll.)
 */
export function generateKalenderHariBaikRange(startDate, endDate, filterOptions = {}) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Rentang tanggal tidak valid.');
  }

  // Pastikan rentang maksimal 366 hari untuk menjaga fluiditas browser
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = 366;

  const cur = new Date(start);
  const rows = [];
  let count = 0;

  while (cur <= end && count < maxDays) {
    const y = cur.getFullYear();
    const m = cur.getMonth() + 1;
    const d = cur.getDate();

    const row = hitungHariBaikPernikahan(y, m, d);
    rows.push(row);

    cur.setDate(cur.getDate() + 1);
    count++;
  }

  return rows;
}

/**
 * Filter baris hasil sesuai preferensi pengguna
 */
export function saringBarisKalender(rows, {
  status = 'semua',           // "semua", "becik", "sedheng", "ala"
  hanyaDinaIjo = false,
  hanyaBebasBulanJelek = false,
  hanyaWeekend = false,        // Sabtu & Minggu
  filterPasatuan = 'semua',    // "semua", "Sanggar Waringin", "Satriya Sinarajo", etc.
  pencarianTeks = ''
} = {}) {
  const q = normStr(pencarianTeks);

  return rows.filter(row => {
    // 1. Status Akhir
    if (status === 'becik' && row.statusAkhir !== 'Becik Sanget') return false;
    if (status === 'sedheng' && row.statusAkhir !== 'Cukup Sae') return false;
    if (status === 'ala' && row.statusAkhir !== 'Ala / Pantangan') return false;

    // 2. Dina Ijo
    if (hanyaDinaIjo && !row.isDinaIjo) return false;

    // 3. Bebas Bulan Jelek
    if (hanyaBebasBulanJelek && row.isBulanJelek) return false;

    // 4. Weekend (Sabtu / Minggu)
    if (hanyaWeekend && row.hari !== 'Sabtu' && row.hari !== 'Minggu') return false;

    // 5. Pasatuan Manten
    if (filterPasatuan !== 'semua' && row.pasatuanManten !== filterPasatuan) return false;

    // 6. Pencarian Teks
    if (q) {
      const matchSearch =
        normStr(row.hari).includes(q) ||
        normStr(row.pasaran).includes(q) ||
        normStr(row.wuku).includes(q) ||
        normStr(row.sasiJawa).includes(q) ||
        normStr(row.pasatuanManten).includes(q) ||
        normStr(row.tahunJawa).includes(q) ||
        normStr(row.keteranganDina).includes(q) ||
        row.isoDate.includes(q);
      if (!matchSearch) return false;
    }

    return true;
  });
}

/**
 * Ekspor dataset ke format CSV baku
 */
export function exportKalenderMantenToCsv(rows) {
  const headers = [
    'Tahun Masehi',
    'Tanggal Masehi',
    'Bulan Masehi',
    'Tahun Jawa (Windu & Kurup)',
    'Tanggal Jawa (1-30)',
    'Pakarti Tanggal Jawa',
    'Keterangan Pakarti Tanggal Jawa',
    'Sasi Jawa',
    'Pakarti Sasi Jawa Kanggo Manten',
    'Hari',
    'Pasaran',
    'Neptu Dina Pasaran',
    'Pasatuan Manten Miturut Neptu Pasaran',
    'Tegese Pasatuan Manten',
    'Wuku',
    'Pakarti Wuku',
    'Keterangan Dina',
    'Dina Gede',
    'Dina Ijo',
    'Dina Abang',
    'Bulan Jelek Tahun Jawa',
    'Status Rekomendasi'
  ];

  const escapeCsv = (str) => {
    const s = String(str || '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines = [headers.join(',')];

  rows.forEach(r => {
    const line = [
      r.tahunMasehi,
      r.tanggalMasehi,
      escapeCsv(r.bulanMasehi),
      escapeCsv(r.tahunJawa),
      r.tanggalJawa,
      escapeCsv(r.pakartiTanggalJawa),
      escapeCsv(r.keteranganPakartiTanggalJawa),
      escapeCsv(r.sasiJawa),
      escapeCsv(r.pakartiSasiJawaKanggoManten),
      escapeCsv(r.hari),
      escapeCsv(r.pasaran),
      r.neptuDinaPasaran,
      escapeCsv(r.pasatuanManten),
      escapeCsv(r.tegesePasatuanManten),
      escapeCsv(r.wuku),
      escapeCsv(r.pakartiWuku),
      escapeCsv(r.keteranganDina),
      r.isDinaGede ? 'Ya' : 'Tidak',
      r.isDinaIjo ? 'Ya' : 'Tidak',
      r.isDinaAbang ? 'Ya' : 'Tidak',
      r.isBulanJelek ? escapeCsv(r.bulanJelekWarning) : 'Tidak',
      escapeCsv(r.statusAkhir)
    ];
    lines.push(line.join(','));
  });

  return '\uFEFF' + lines.join('\r\n'); // BOM untuk UTF-8 Excel support
}
