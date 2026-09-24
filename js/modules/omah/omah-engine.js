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

import {
  NEPTU_APP_WETON,
  NEPTU_OMAH_NB,
  CEMPURI_LAWANGAN,
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

function norm(str) {
  return String(str || '').trim().toLowerCase();
}

/**
 * Ambil Neptu App Standar
 */
export function getNeptuApp(dina, pasaran) {
  const nD = norm(dina);
  const nP = norm(pasaran);
  const rowD = NEPTU_APP_WETON.find(r => r.jenis === 'dina' && norm(r.nama) === nD);
  const rowP = NEPTU_APP_WETON.find(r => r.jenis === 'pasaran' && norm(r.nama) === nP);
  const dVal = rowD ? rowD.neptu : 0;
  const pVal = rowP ? rowP.neptu : 0;
  return {
    dina,
    pasaran,
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
  const nD = norm(dina);
  const nP = norm(pasaran);
  const rowD = NEPTU_OMAH_NB.find(r => r.jenis === 'dina' && norm(r.nama) === nD);
  const rowP = NEPTU_OMAH_NB.find(r => r.jenis === 'pasaran' && norm(r.nama) === nP);
  const dVal = rowD ? rowD.neptu : 0;
  const pVal = rowP ? rowP.neptu : 0;
  return {
    dina,
    pasaran,
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
  const item = OMAH_SISA4_SET_A.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  return {
    ...item,
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
  const item = OMAH_SISA4_SET_B.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  const isBecik = rem === 1 || rem === 2 || rem === 3;
  return {
    ...item,
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
  const item = OMAH_SISA4_SET_C.find(x => x.sisa === rem) || { sisa: rem, nama: 'Unknown', watak: '' };
  const isBecik = rem === 1 || rem === 2;
  return {
    ...item,
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

  for (const rule of OMAH_LARANGAN_ARAH_PINDAH) {
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
  const list = CEMPURI_LAWANGAN.filter(c => norm(c.arah) === nA);
  const num = parseInt(nomor, 10);
  const specific = !isNaN(num) ? list.find(c => c.nomor === num) : null;
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
  const found = OMAH_MENURUT_SASI.find(s => norm(s.sasi_jawa) === nS || norm(s.alias_sumber) === nS);
  return found ? { ...found } : null;
}

/**
 * Ambil petung menurut Pranata Mangsa
 */
export function getOmahMenurutMangsa(mangsaName) {
  if (!mangsaName) return null;
  const nM = norm(mangsaName);
  const found = OMAH_MENURUT_MANGSA.find(m => norm(m.mangsa_kanon) === nM || norm(m.alias_sumber) === nM);
  return found ? { ...found } : null;
}

/**
 * Ambil data pilihan tanah/lemah
 */
export function getOmahPilihLemah(idOrCiri) {
  if (!idOrCiri) return null;
  const asNum = parseInt(idOrCiri, 10);
  if (!isNaN(asNum)) {
    const f = OMAH_PILIH_LEMAH.find(l => l.id === asNum);
    return f ? { ...f } : null;
  }
  const nC = norm(idOrCiri);
  const f = OMAH_PILIH_LEMAH.find(l => norm(l.ciri_lemah).includes(nC) || norm(l.aran).includes(nC));
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

  const neptuApp = getNeptuApp(dina, pasaran);
  const neptuNb = getNeptuNb(dina, pasaran);

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
    dina,
    pasaran,
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

export {
  NEPTU_APP_WETON,
  NEPTU_OMAH_NB,
  CEMPURI_LAWANGAN,
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
