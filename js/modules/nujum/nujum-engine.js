/**
 * Jagad Jawa — Modul Domain: Nujum Engine
 * Pure calculation functions untuk Nujum Kepribadian, 6 Dimensi Bincil,
 * Pawukon, dan Faalakiah (ramalan watak dan tolak balak nabi berdasarkan nama).
 * 
 * Bebas dari ketergantungan DOM.
 * jawa-v2 – single source nujum, exact lookup
 */

import {
  KET_BINCIL,
  KET_BINCIL as MASTER_KET_BINCIL,
  bincilDatabase as MASTER_BINCIL_MATRIX,
  getNujumFromMatrix as getNujumResult,
  getNujumData as masterGetNujumData
} from '../../data/nujum-matrix.js';

import {
  BINCIL_BILINGUAL_DATA,
  getBincilArtiBilingual
} from '../../data/bincil-bilingual.js';

import bincilDataJSON from '../../data/27-bincil-arti-bilingual.json' with { type: 'json' };

export const PAARASAN_DATA_JSON = bincilDataJSON?.paarasan ?? bincilDataJSON?.parasan ?? [];

export { BINCIL_BILINGUAL_DATA, getBincilArtiBilingual, bincilDataJSON };

import {
  MASTER_PAWUKON,
  PAWUKON_LIST,
  getPawukonDetail
} from '../../data/pawukon.js';

import {
  KARAKTER,
  AKSARA_FAAL,
  NABI_FAAL,
  FAAL_DESC,
  PADEWAN_DATA,
  PARINGKELAN_DATA,
  PANDANGON_DATA,
  PAARASAN_DATA,
  PANCASUDA_DATA,
  KAMAROKAN_DATA,
  getAsesoris,
  namaKeAksaraList,
  parseAksaraForFaalakiah
} from '../../data/personality.js';

export { namaKeAksaraList, parseAksaraForFaalakiah };

import {
  getDayInfo,
  getTanggalJawaLengkap,
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  WUKU
} from '../kalender/kalender-engine.js';

/**
 * Menghitung ramalan Faalakiah dari nama.
 * @param {string} nama 
 * @returns {Object}
 */
export function getFaalakiah(nama) {
  const aksaraList = namaKeAksaraList(nama);
  if (aksaraList.length === 0) {
    return { kode: 0, kodeNormalized: 12, nabi: NABI_FAAL[0], desc: FAAL_DESC[0], aksaraStr: "-", aksaraHyphenated: "-", sum: 0 };
  }
  let sum = 0;
  for (const ak of aksaraList) sum += (AKSARA_FAAL[ak] || 1);
  const kode = sum % 12;
  const kodeNormalized = (kode === 0) ? 12 : kode;
  return {
    kode,
    kodeNormalized,
    nabi: NABI_FAAL[kode] || NABI_FAAL[kodeNormalized] || NABI_FAAL[0],
    desc: FAAL_DESC[kode] || FAAL_DESC[kodeNormalized] || FAAL_DESC[0],
    aksaraStr: aksaraList.join(" "),
    aksaraHyphenated: aksaraList.map(a => a.toLowerCase()).join(" - "),
    sum
  };
}

export const CANON_WUKU_NAMES = [
  "sinta", "landep", "wukir", "kurantil", "tolu", "gumbreg",
  "warigalit", "warigagung", "julungwangi", "sungsang", "galungan", "kuningan",
  "langkir", "mandasiya", "julungpujut", "pahang", "kuruwelut", "marakeh",
  "tambir", "medangkungan", "maktal", "wuye", "manahil", "prangbakat",
  "bala", "wugu", "wayang", "kulawu", "dukut", "watugunung"
];

export function normalizeHariName(hari) {
  if (!hari) return '';
  const s = String(hari).trim().toLowerCase();
  if (s.includes('minggu') || s.includes('ahad') || s.includes('ngahad')) return 'minggu';
  if (s.includes('senin') || s.includes('senen')) return 'senin';
  if (s.includes('selasa')) return 'selasa';
  if (s.includes('rabu') || s.includes('rebo')) return 'rabu';
  if (s.includes('kamis') || s.includes('kemis')) return 'kamis';
  if (s.includes('jumat') || s.includes("jum'at") || s.includes('jumaat')) return 'jumat';
  if (s.includes('sabtu') || s.includes('setu')) return 'sabtu';
  return s;
}

export function normalizePasaranName(pasaran) {
  if (!pasaran) return '';
  const s = String(pasaran).trim().toLowerCase();
  if (s.includes('legi') || s.includes('manis')) return 'legi';
  if (s.includes('pahing') || s.includes('paing')) return 'pahing';
  if (s.includes('pon') || s.includes('petak')) return 'pon';
  if (s.includes('wage') || s.includes('cemengan')) return 'wage';
  if (s.includes('kliwon') || s.includes('keliwon') || s.includes('asih')) return 'kliwon';
  return s;
}

export function normalizeWukuName(wuku) {
  if (wuku === undefined || wuku === null) return '';
  if (typeof wuku === 'number') {
    if (wuku >= 1 && wuku <= 30) return CANON_WUKU_NAMES[wuku - 1];
    if (wuku >= 0 && wuku <= 29) return CANON_WUKU_NAMES[wuku];
  }
  const s = String(wuku).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const num = parseInt(s, 10);
  if (!isNaN(num)) {
    if (num >= 1 && num <= 30) return CANON_WUKU_NAMES[num - 1];
    if (num >= 0 && num <= 29) return CANON_WUKU_NAMES[num];
  }
  const match = CANON_WUKU_NAMES.find(cw => cw === s || s.includes(cw) || cw.includes(s));
  return match || s;
}

/**
 * Resolver matriks bincil runtime dari 06-bincil-matrix-bilingual.json
 * Menerima matriks, menormalkan key {wuku}_{hari}_{pasaran}, dan mengembalikan 6 dimensi lengkap.
 * Mengembalikan null jika matriks tidak valid atau baris tidak ditemukan.
 * @param {Object} bincilMatrix
 * @param {string} dino
 * @param {string} pasaran
 * @param {string|number} wuku
 * @returns {Object|null}
 */
export function resolveBincilFromMatrix(bincilMatrix, dino, pasaran, wuku) {
  if (!bincilMatrix || typeof bincilMatrix !== 'object' || Object.keys(bincilMatrix).length === 0) {
    return null;
  }
  const matrix = bincilMatrix;

  const h = normalizeHariName(dino);
  const p = normalizePasaranName(pasaran);
  const w = normalizeWukuName(wuku);

  if (!h || !p || !w) {
    return null;
  }

  const primaryKey = `${w}_${h}_${p}`;
  let row = matrix[primaryKey];

  if (!row) {
    const wukuIdx = CANON_WUKU_NAMES.indexOf(w);
    if (wukuIdx !== -1) {
      const altKey = `${wukuIdx + 1}_${h}_${p}`;
      row = matrix[altKey];
    }
  }

  if (!row && Array.isArray(matrix)) {
    row = matrix.find(item => {
      if (!item) return false;
      const itemW = normalizeWukuName(item.wuku || item.no_wuku);
      const itemH = normalizeHariName(item.hari || item.dino);
      const itemP = normalizePasaranName(item.pasaran || item.pas);
      return itemW === w && itemH === h && itemP === p;
    });
  }

  if (!row) {
    return null;
  }

  const formatDimensi = (dimKey, rawVal) => {
    let namaVal = '';
    let rawArti = null;
    let rawArtiId = null;
    let rawArtiJv = null;
    let rawBilingual = null;

    if (rawVal && typeof rawVal === 'object') {
      namaVal = rawVal.nilai || rawVal.nama || '';
      rawArti = rawVal.arti;
      rawArtiId = rawVal.arti_id;
      rawArtiJv = rawVal.arti_jv;
      rawBilingual = rawVal.artiBilingual;
    } else {
      namaVal = String(rawVal || '').trim();
    }

    const bilingual = getBincilArtiBilingual(dimKey, namaVal);
    const jv = rawArtiJv || bilingual?.jv || (typeof rawArti === 'object' ? rawArti?.jv : null) || (typeof rawArti === 'string' ? rawArti : '') || namaVal;
    const id = rawArtiId || bilingual?.id || (typeof rawArti === 'object' ? rawArti?.id : null) || (typeof rawArti === 'string' ? rawArti : '') || namaVal;
    const artiStr = (typeof rawArti === 'string' && rawArti) ? rawArti : (id || jv || namaVal);

    return {
      nama: namaVal,
      nilai: namaVal,
      arti: artiStr,
      arti_id: id,
      arti_jv: jv,
      artiBilingual: rawBilingual || bilingual || { id, jv }
    };
  };

  const padewan = formatDimensi('padewan', row.padewan);
  const paringkelan = formatDimensi('paringkelan', row.paringkelan);
  const pandangon = formatDimensi('pandangon', row.pandangon);
  const paarasan = formatDimensi('paarasan', row.paarasan ?? row.parasan);
  const pancasuda = formatDimensi('pancasuda', row.pancasuda);
  const kamarokan = formatDimensi('kamarokan', row.kamarokan);

  const wukuDisplay = row.wuku || (w.charAt(0).toUpperCase() + w.slice(1));
  const hariDisplay = row.hari || (h.charAt(0).toUpperCase() + h.slice(1));
  const pasaranDisplay = row.pasaran || (p.charAt(0).toUpperCase() + p.slice(1));
  const noWuku = row.no_wuku || (CANON_WUKU_NAMES.indexOf(w) + 1);

  return {
    found: true,
    no_wuku: noWuku,
    wuku: wukuDisplay,
    hari: hariDisplay,
    dino: hariDisplay,
    pasaran: pasaranDisplay,
    pas: pasaranDisplay,
    padewan,
    paringkelan,
    pandangon,
    paarasan,
    parasan: paarasan,
    pancasuda,
    kamarokan,
    pawukon: (typeof getPawukonDetail === 'function') ? getPawukonDetail(wukuDisplay) : null
  };
}

export const resolveBincil = resolveBincilFromMatrix;

/**
 * Mengambil data Nujum Bincil dan Pawukon dari matriks atau master data.
 */
export function getNujumData(dino, pas, wukuName, maybeMatrix) {
  const matrix = maybeMatrix || (typeof globalThis !== 'undefined' ? globalThis._currentNujumData?.bincilMatrix : null);
  if (matrix) {
    const res = resolveBincilFromMatrix(matrix, dino, pas, wukuName);
    if (res) return res;
  }
  if (typeof masterGetNujumData === 'function') {
    const res = masterGetNujumData(dino, pas, wukuName);
    if (res && (res.found || res.padewan || res.paarasan || res.parasan)) return res;
  }
  return null;
}

// ─── TAHAP 3: LITERASI BUDAYA & GLOSARIUM KONSEPTUAL ───────────────────────
export const DISCLAIMER_ETIS_KULTURAL =
  "Paweling Budaya & Literasi: Petungan nujum bincil lan pawukon menika wujud kearifan lokal (local wisdom) leluhur Nusantara minangka sarana mawas diri (introspeksi), nepani awak (tepa slira), lan nglestantunaken filsafat adiluhung. Sedaya takdir, jodoh, rejeki, lan umur dumunung wonten ing panguwaosipun Gusti Ingkang Maha Kuwaos. Manungsa wajib ikhtiar lahir batin, ndedonga, sarta ngutamekaken budi pakerti luhur.";

export const NUJUM_GLOSSARY_CONCEPTS = [
  {
    id: "padewan",
    istilah: "Padewan (Astawara)",
    namaJawa: "Asthadewan / Siklus 8 Dewa",
    kategori: "Kosmologi Pawukon",
    siklus: "Daur 8 Hari (Sri, Indra, Guru, Yamadipati, Rudra, Brama, Kala, Uma)",
    deskripsi: "Siklus delapan harian dalam penanggalan Jawa kuno di mana setiap hari dinaungi oleh bathara/dewi pelindung tertentu yang memancarkan pengaruh energi spiritual pada watak lahiriah manusia.",
    filosofi: "Menyadarkan manusia bahwa perjalanan hidup senantiasa diiringi dinamika batin: ada masa kelimpahan (Sri), ketelitian (Indra), ujian (Guru), maupun keteguhan batin (Uma).",
    contoh: "Padewan Sri melambangkan welas asih, kemakmuran sandang-pangan, serta hati yang lapang."
  },
  {
    id: "paringkelan",
    istilah: "Paringkelan (Sadwara)",
    namaJawa: "Sadwara / Ringkel 6 Hari",
    kategori: "Karakter Fisik & Kerentanan",
    siklus: "Daur 6 Hari (Tungle, Aryang, Wurukung, Paningron, Uwas, Mawulu)",
    deskripsi: "Siklus enam harian yang memetakan kecenderungan watak serta titik kerentanan atau kelemahan alamiah manusia terhadap godaan duniawi.",
    filosofi: "Sarana 'eling lan waspada' (ingat dan waspada) agar manusia mengenali sisi rentan dirinya sebelum merugikan orang lain.",
    contoh: "Ringkel Aryang cenderung pelupa dan kurang teliti, sehingga dianjurkan membiasakan mencatat dan berhati-hati."
  },
  {
    id: "pandangon",
    istilah: "Pandangon (Sangawara)",
    namaJawa: "Sangawara / Siklus 9 Pandangan Batin",
    kategori: "Orientasi Batin & Sikap Hidup",
    siklus: "Daur 9 Hari (Dangu, Jagur, Gigis, Kerangan, Nohan, Wogan, Tulus, Wurung, Dadi)",
    deskripsi: "Sembilan watak dasar yang menggambarkan cara seseorang memandang dinamika kehidupan, menghadapi persaingan, dan menyikapi rejeki.",
    filosofi: "Pijakan moral agar manusia memiliki arah batin yang kokoh dan tidak mudah terombang-ambing oleh pujian maupun celaan.",
    contoh: "Pandangon Tulus mencerminkan ketulusan hati, kejujuran budi, serta kemauan yang lurus."
  },
  {
    id: "paarasan",
    istilah: "Paarasan (10 Sifat Kosmis)",
    namaJawa: "Paarasan Lambang Alam",
    kategori: "Watak Pembawaan & Kepemimpinan",
    siklus: "10 Tipologi Kosmologis (Aras Tuding, Aras Kembang, Lakuning Lintang, Lakuning Rembulan, dll.)",
    deskripsi: "Perpaduan energi Saptawara (7 hari) dan Pancawara (5 pasaran) yang mengkristal menjadi sepuluh sifat unsur alam semesta.",
    filosofi: "Setiap insan memancarkan energi alamiah unik: ada yang menyejukkan bagai rembulan, menghangatkan bagai surya, atau menenangkan bagai air mengalir.",
    contoh: "Lakuning Banyu berwatak luwes, ramah, menyejukkan suasana, serta berpotensi besar menjadi pemimpin pengayom."
  },
  {
    id: "pancasuda",
    istilah: "Pancasuda (7 Martabat Nasib)",
    namaJawa: "Pancasuda Pitu",
    kategori: "Perjalanan Nasib & Kedudukan",
    siklus: "7 Simbol (Sri, Lungguh, Gedhong, Lara, Pati, Satriya Wirang, Bumi Kapetak)",
    deskripsi: "Kalkulasi tradisional untuk menelaah ujian hidup, kemuliaan, kehormatan, dan tantangan rejeki yang dihadapi seseorang.",
    filosofi: "Mengajarkan konsep 'Cakra Manggilingan' (roda kehidupan berputar): saat mulia dilarang jumawa, saat diuji harus tabah dan tawakal.",
    contoh: "Lungguh melambangkan kemudahan memperoleh kehormatan, jabatan, atau kepercayaan masyarakat."
  },
  {
    id: "kamarokan",
    istilah: "Kamarokan (Kedudukan Sosial)",
    namaJawa: "Kamarokan Martabat Bebrayan",
    kategori: "Rejeki & Interaksi Sosial",
    siklus: "7 Martabat (Nuju Pati, Kala Tinantang, Dhedhep Semut, Satriya Pinayungan, dll.)",
    deskripsi: "Penelaahan derajat dan perlindungan sosial dalam kehidupan bermasyarakat.",
    filosofi: "Mengingatkan hakikat 'Urip Iku Urup' (hidup memberi manfaat), menjadi pelindung bagi yang lemah.",
    contoh: "Satriya Pinayungan melambangkan sosok berbudi pekerti yang senantiasa dinaungi keselamatan dan disegani kawan maupun lawan."
  },
  {
    id: "faalakiah",
    istilah: "Faalakiah Asma 12 Nabi",
    namaJawa: "Petungan Asma lan Tolak Balak",
    kategori: "Spiritual & Penyelarasan Nama",
    siklus: "Siklus 12 Nabi (Yusuf, Ahmad, Isa, Dawut, Soleman, Adam, Ibrahim, Idris, Nuh, Musa, Ayub, Yunus)",
    deskripsi: "Penghitungan nilai spiritual aksara Jawa pada nama lahir seseorang untuk memperoleh petuah keteladanan para nabi dan anjuran sedekah.",
    filosofi: "'Asma minangka donga' (nama adalah doa). Menuntun manusia agar meneladani akhlak mulia dan rajin bersedekah.",
    contoh: "Faal Nabi Yusuf menganjurkan menjaga kesabaran atas fitnah dan menyucikan hati dengan memperbanyak dzikir."
  },
  {
    id: "sirikan_adhep_omah",
    istilah: "Sirikan Adhep Omah",
    namaJawa: "Pantangan Arah Hadap Griya",
    kategori: "Tata Ruang & Arsitektur Tradisi",
    siklus: "Kiblat Papat Kalima Pancer",
    deskripsi: "Petunjuk arah hadap pintu utama rumah tinggal berdasarkan neptu weton agar selaras dengan aliran angin dan kosmologi tanah.",
    filosofi: "Menciptakan ketenteraman batin (*ayem tentrem*) dalam hunian keluarga melalui harmonisasi orientasi kosmis.",
    contoh: "Weton berneptu tertentu disarankan tidak menghadap kiblat pantangan dan memprioritaskan arah barat atau timur."
  },
  {
    id: "karakter_dasar_9",
    istilah: "Tipologi 9 Karakter Dasar",
    namaJawa: "Karakter Dasar 9 Tipe Jawa",
    kategori: "Psikologi & Potensi Diri",
    siklus: "9 Tipe (Leader, Diplomat, Analisis, Realis, Adventurer, Idealis, Edukatif, Eksekutor, Entertainer)",
    deskripsi: "Tipologi psikologi kepribadian berdasarkan reduksi tanggal lahir Masehi (modulo 9) yang dipadukan dengan kearifan watak Jawa.",
    filosofi: "Konsep 'Empan Papan'—mengetahui kapasitas dan keunikan diri agar mampu menempatkan diri secara bijak dalam pergaulan.",
    contoh: "Tipe Analisis unggul dalam perencanaan konseptual dan ketelitian data, sedangkan Eksekutor tangguh di lapangan."
  }
];

export function getNujumGlossary(conceptIdOrCategory = null) {
  if (!conceptIdOrCategory) return NUJUM_GLOSSARY_CONCEPTS;
  const q = String(conceptIdOrCategory).toLowerCase().trim();
  return NUJUM_GLOSSARY_CONCEPTS.filter(c =>
    c.id.toLowerCase() === q ||
    c.kategori.toLowerCase().includes(q) ||
    c.istilah.toLowerCase().includes(q)
  );
}

// ─── MASTER TIPOLOGI 9 KARAKTER DASAR ─────────────────────────────────────
export const KARAKTER_DASAR_DATA = {
  1: {
    tipe: "Leader",
    ringkasan: "Berjiwa pemimpin, mandiri, berani mengambil inisiatif dan tanggung jawab.",
    kekuatan: "Kepemimpinan alami, berani memutuskan, visioner, berwibawa.",
    kelemahan: "Terkadang dominan, kurang sabar mendengarkan masukan perlahan."
  },
  2: {
    tipe: "Diplomat",
    ringkasan: "Santun, halus budi pekerti, cinta damai, setia dan tekun menjaga harmoni.",
    kekuatan: "Penengah konflik yang ulung, pendengar empati, memelihara etika sopan santun.",
    kelemahan: "Ragu mengambil keputusan cepat, takut risiko perselisihan terbuka."
  },
  3: {
    tipe: "Analisis",
    ringkasan: "Perfeksionis estetis, analitis, kritis, data-driven, dan menyukai keindahan.",
    kekuatan: "Ketelitian luar biasa, berpikir konseptual matang, penasihat strategi yang tajam.",
    kelemahan: "Sensitif terhadap kritik, sering overthinking dalam bertindak."
  },
  4: {
    tipe: "Realis",
    ringkasan: "Praktis, realistis, berpijak pada fakta konkret dan efisiensi waktu.",
    kekuatan: "Solutif, dapat diandalkan menyelesaikan kendala teknis, menghargai bukti nyata.",
    kelemahan: "Kurang menyukai gagasan abstrak atau imajinasi tanpa bukti awal."
  },
  5: {
    tipe: "Adventurer",
    ringkasan: "Dinamis, menyukai kebebasan, adaptif, cepat belajar dari hal-hal baru.",
    kekuatan: "Energik, ramah pada lingkungan baru, berjiwa bebas, penuh ide kreatif segar.",
    kelemahan: "Cepat bosan pada rutinitas administratif yang monoton."
  },
  6: {
    tipe: "Idealis",
    ringkasan: "Memiliki prinsip hidup kokoh, menjunjung tinggi nilai moral, etika, dan kebenaran.",
    kekuatan: "Integritas batin tinggi, berdedikasi membela keadilan, setia kawan.",
    kelemahan: "Cenderung kaku saat harus berkompromi dengan realitas pragmatis."
  },
  7: {
    tipe: "Edukatif",
    ringkasan: "Berorientasi pada pembinaan, pembagian ilmu, pencerahan, dan pengasuhan sesama.",
    kekuatan: "Sabar membimbing, berwawasan luas, menjadi sumber rujukan nasihat hidup.",
    kelemahan: "Kadang terkesan menggurui atau terlalu teoritis dalam berdiskusi."
  },
  8: {
    tipe: "Eksekutor",
    ringkasan: "Pekerja keras, gigih, berorientasi hasil akhir, tangguh menghadapi beban tugas.",
    kekuatan: "Fokus tinggi pada pencapaian, pantang menyerah sebelum tuntas, disiplin kerja.",
    kelemahan: "Mudah lelah batin jika menuntut orang lain bergerak secepat dirinya."
  },
  9: {
    tipe: "Entertainer",
    ringkasan: "Hangat, komunikatif, menyenangkan orang di sekitarnya, pencair suasana.",
    kekuatan: "Mudah bergaul, menaikkan moral tim, optimis, berjiwa seni tinggi.",
    kelemahan: "Kurang teliti pada detail kecil dan mudah terpengaruh suasana hati."
  }
};

/**
 * Pure helper untuk menghitung tipe karakter dasar (1-9).
 * @param {number} d 
 * @param {number} m 
 * @param {number} y 
 */
export function hitungKarakterDasarPure(d, m, y) {
  const combined = `${d}${m}${y}`.replace(/\D/g, '');
  const digits = combined.split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const sisa = sum % 9;
  const noKarakter = (sisa === 0) ? 9 : sisa;
  const kd = KARAKTER_DASAR_DATA[noKarakter] || KARAKTER_DASAR_DATA[9];
  return {
    noKarakter,
    tipe: kd.tipe,
    ringkasan: kd.ringkasan,
    kekuatan: kd.kekuatan,
    kelemahan: kd.kelemahan
  };
}

// ─── TAHAP 3.2: RINGKASAN EKSEKUTIF (MODE RINGKAS) ─────────────────────────
/**
 * Menyusun ringkasan eksekutif ramah pemula tanpa jargon rumit.
 * Dilengkapi proteksi null-safety mutlak terhadap parameter data dan properti paarasan/parasan.
 * @param {Object} bincilData
 */
export function getNujumSummaryRingkas(bincilData) {
  // Safety guard absolut
  if (!bincilData || typeof bincilData !== 'object' || Object.keys(bincilData).length === 0) {
    return "Data bincil dan ringkasan belum tersedia.";
  }

  const data = bincilData;

  // Ambil data paarasan dengan fallback berlapis (mendukung 'paarasan' maupun 'parasan')
  const paarasanObj = bincilData.paarasan || bincilData.parasan || {};
  const nilai = paarasanObj.nilai || paarasanObj.nama || "Aras Kembang";
  const arti = paarasanObj.arti || { id: "", jv: "" };
  const artiStr = (typeof arti === 'object' && arti !== null)
    ? (arti.jv || arti.id || '')
    : String(arti || '');

  // Formatted string sesuai formula stabil
  const formattedStr = `Paarasan: ${nilai} - ${artiStr}`;

  // Jika input hanya bincil sederhana atau tanpa konteks perhitungan tanggal
  if (!bincilData.d && !bincilData.y && !bincilData.m && !bincilData.nama && !('data' in bincilData) && !('bincil' in bincilData)) {
    return formattedStr;
  }

  // Ambil data bincil jika dibungkus objek { data, bincil, ... }
  const innerData = bincilData?.data ?? bincilData?.bincil ?? (bincilData?.paarasan || bincilData?.parasan ? bincilData : null);

  const nama = bincilData?.nama || innerData?.nama || 'Panjenengan';
  const d = bincilData?.d ?? innerData?.d ?? 1;
  const m = bincilData?.m ?? innerData?.m ?? 1;
  const y = bincilData?.y ?? innerData?.y ?? 2026;
  const tahunHitung = bincilData?.tahunHitung ?? innerData?.tahunHitung ?? 2026;

  const dateParsed = (typeof parseDateComponents === 'function') ? parseDateComponents(y, m, d) : { y, m, d };
  const info = getDayInfo(dateParsed.y, dateParsed.m, dateParsed.d) || {};
  const dino = bincilData?.dino || bincilData?.hari || innerData?.dino || innerData?.hari || info.hari || info.dino || HARI[info.weekdayId] || 'Kamis';
  const pas = bincilData?.pasaran || bincilData?.pas || innerData?.pasaran || innerData?.pas || info.pasaran || info.pas || PASARAN[info.pasaranId] || 'Pon';
  const neptu = bincilData?.neptu ?? innerData?.neptu ?? (info.neptu !== undefined ? info.neptu : ((NEPTU_HARI[info.weekdayId] ?? 8) + (NEPTU_PASARAN[info.pasaranId] ?? 7)));
  const wukuName = bincilData?.wuku || bincilData?.wukuName || innerData?.wuku || innerData?.wukuName || info.wukuName || WUKU[info.wukuId] || 'Kuruwelut';

  const kd = bincilData?.kd || innerData?.kd || ((typeof hitungKarakterDasarPure === 'function')
    ? hitungKarakterDasarPure(d, m, y)
    : (typeof hitungKarakterDasar === 'function' ? hitungKarakterDasar(d, m, y) : null));
  const kdSafe = kd || { tipe: 'Luhur', kekuatan: 'Kukuh Sentosa', ringkasan: '-' };

  const matrix = bincilData?.bincilMatrix || (typeof globalThis !== 'undefined' ? globalThis._currentNujumData?.bincilMatrix : null);
  const fnGetNujum = (typeof getNujumData === 'function')
    ? getNujumData
    : (typeof window !== 'undefined' && typeof window.getNujumData === 'function' ? window.getNujumData : null);

  const bincilCalculated = matrix
    ? resolveBincilFromMatrix(matrix, dino, pas, wukuName)
    : (fnGetNujum ? fnGetNujum(dino, pas, wukuName) : null);
  const bincil = innerData ?? bincilCalculated ?? {};

  // Ambil paarasan secara aman dengan fallback ke array kosong atau objek kosong
  let rawPaarasan = (paarasanObj && (paarasanObj.nama || paarasanObj.nilai || paarasanObj.arti))
    ? paarasanObj
    : (bincilData?.paarasan ?? bincilData?.parasan ?? innerData?.paarasan ?? innerData?.parasan ?? bincil?.paarasan ?? bincil?.parasan ?? paarasanObj ?? {});
  if (Array.isArray(rawPaarasan)) {
    rawPaarasan = rawPaarasan.find(p => p && (p.nilai || p.nama)) || rawPaarasan[0] || {};
  } else if (typeof rawPaarasan === 'string') {
    rawPaarasan = { nama: rawPaarasan, arti: rawPaarasan };
  }

  const resolvedNilaiPaarasan = rawPaarasan?.nilai || rawPaarasan?.nama || nilai;
  const paarasanBilingual = getBincilArtiBilingual('paarasan', resolvedNilaiPaarasan);
  const resolvedArtiPaarasan = (typeof rawPaarasan.arti === 'object' && rawPaarasan.arti !== null)
    ? rawPaarasan.arti
    : {
        jv: rawPaarasan?.arti_jv || paarasanBilingual?.jv || (typeof rawPaarasan?.arti === 'string' ? rawPaarasan.arti : arti.jv || ''),
        id: rawPaarasan?.arti_id || paarasanBilingual?.id || (typeof rawPaarasan?.arti === 'string' ? rawPaarasan.arti : arti.id || '')
      };

  const finalPaarasanObj = {
    nilai: resolvedNilaiPaarasan,
    nama: resolvedNilaiPaarasan,
    arti: (typeof rawPaarasan?.arti === 'string' && rawPaarasan.arti) ? rawPaarasan.arti : (resolvedArtiPaarasan.id || resolvedArtiPaarasan.jv || 'Aras Kembang'),
    arti_id: resolvedArtiPaarasan.id,
    arti_jv: resolvedArtiPaarasan.jv,
    artiBilingual: paarasanBilingual
  };

  const summaryString = `Paarasan: ${resolvedNilaiPaarasan} - ${resolvedArtiPaarasan.jv || resolvedArtiPaarasan.id || ''}`;

  let rawPandangon = data?.pandangon ?? innerData?.pandangon ?? bincil?.pandangon ?? {};
  if (Array.isArray(rawPandangon)) {
    rawPandangon = rawPandangon.find(p => p && (p.nilai || p.nama)) || rawPandangon[0] || {};
  } else if (typeof rawPandangon === 'string') {
    rawPandangon = { nama: rawPandangon, arti: rawPandangon };
  }
  const pandangonBilingual = getBincilArtiBilingual('pandangon', rawPandangon?.nama || rawPandangon?.nilai || 'Dadi');
  const pandangonObj = {
    nama: rawPandangon?.nama || rawPandangon?.nilai || 'Dadi',
    arti: rawPandangon?.arti || pandangonBilingual?.id || 'Tercapai tujuannya',
    arti_id: rawPandangon?.arti_id || pandangonBilingual?.id,
    arti_jv: rawPandangon?.arti_jv || pandangonBilingual?.jv,
    artiBilingual: rawPandangon?.artiBilingual || pandangonBilingual
  };

  let rawParingkelan = data?.paringkelan ?? innerData?.paringkelan ?? bincil?.paringkelan ?? {};
  if (Array.isArray(rawParingkelan)) {
    rawParingkelan = rawParingkelan.find(p => p && (p.nilai || p.nama)) || rawParingkelan[0] || {};
  } else if (typeof rawParingkelan === 'string') {
    rawParingkelan = { nama: rawParingkelan, arti: rawParingkelan };
  }
  const paringkelanBilingual = getBincilArtiBilingual('paringkelan', rawParingkelan?.nama || rawParingkelan?.nilai || 'Tungle');
  const paringkelanObj = {
    nama: rawParingkelan?.nama || rawParingkelan?.nilai || 'Tungle',
    arti: rawParingkelan?.arti || paringkelanBilingual?.id || 'Daun / tetuwuhan',
    arti_id: rawParingkelan?.arti_id || paringkelanBilingual?.id,
    arti_jv: rawParingkelan?.arti_jv || paringkelanBilingual?.jv,
    artiBilingual: rawParingkelan?.artiBilingual || paringkelanBilingual
  };

  const faal = data?.faal || innerData?.faal || ((typeof getFaalakiah === 'function')
    ? getFaalakiah(nama)
    : (typeof window !== 'undefined' && typeof window.getFaalakiah === 'function' ? window.getFaalakiah(nama) : null));
  const faalSafe = faal || { nabi: 'Yusuf', desc: 'Rupawan dan berwibawa' };

  // Ekstraksi 3 kekuatan utama dari Paarasan, Pandangon, dan Tipe Karakter
  const kekuatanUtama = [
    `${kdSafe?.tipe || '-'}: ${(kdSafe?.kekuatan || '-').split(',')[0]}`,
    `Paarasan (${finalPaarasanObj?.nama || '-' }): ${(finalPaarasanObj?.arti || '-').split(',')[0]}`,
    `Pandangon (${pandangonObj?.nama || '-' }): ${(pandangonObj?.arti || '-').split(',')[0]}`
  ];

  const areaWaspada = `Paringkelan ${paringkelanObj?.nama || '-'}: ${paringkelanObj?.arti || '-'}`;

  // Rekomendasi arah hoki & pantangan rumah berdasarkan dino & pasaran
  const ARAH_HOKI_MAP = {
    "Kliwon": "Pusat & Segala Arah",
    "Legi": "Timur (Kemakmuran)",
    "Pahing": "Selatan (Kejayaan)",
    "Pon": "Barat (Ketenteraman)",
    "Wage": "Utara (Keselamatan)"
  };
  const arahHoki = ARAH_HOKI_MAP[pas] || "Timur & Utara";
  const sirikanRumah = (info.weekdayId === 4 || pas === 'Kliwon')
    ? "Hindari pintu utama menghadap langsung ke arah Selatan"
    : "Hindari pintu utama menghadap langsung ke arah Barat Daya";

  return {
    nama,
    tglMasehiStr: `${d} ${BULAN_MASEHI[m - 1] || 'Wulan'} ${y}`,
    dino,
    pas,
    neptu,
    wukuName,
    tipeKarakter: kdSafe?.tipe || 'Luhur',
    deskripsiKarakter: kdSafe?.ringkasan || '-',
    kekuatanUtama,
    areaWaspada,
    arahHoki,
    sirikanRumah,
    faalRingkas: `Teladan Nabi ${faalSafe?.nabi || 'Yusuf'}: ${(faalSafe?.desc || 'Pribadi berbudi luhur').split('.')[0]}.`,
    summaryText: summaryString,
    paarasanSummary: summaryString,
    nilaiPaarasan: resolvedNilaiPaarasan,
    artiPaarasan: resolvedArtiPaarasan,
    paarasanObj: finalPaarasanObj,
    toString() {
      return summaryString;
    },
    valueOf() {
      return summaryString;
    }
  };
}

// ─── TAHAP 3.4: PERBANDINGAN NON-JODOH (SIDE-BY-SIDE SINERGI RELASI) ────────
const RELASI_LABELS = {
  rekan_kerja: "Rekan Kerja & Kolaborasi Tim",
  mitra_bisnis: "Mitra Usaha & Rekan Bisnis",
  sahabat: "Persahabatan & Relasi Sosial",
  keluarga: "Hubungan Persaudaraan / Keluarga"
};

/**
 * Membandingkan karakter dan energi dua orang secara non-jodoh.
 * @param {Object} p1Input { nama, tglLahir }
 * @param {Object} p2Input { nama, tglLahir }
 * @param {'rekan_kerja'|'mitra_bisnis'|'sahabat'|'keluarga'} relasiType 
 */
export function compareNonJodoh(p1Input, p2Input, relasiType = 'rekan_kerja', options = {}) {
  const bincilMatrix = options?.bincilMatrix || (typeof globalThis !== 'undefined' ? globalThis._currentNujumData?.bincilMatrix : null);
  const parsePerson = (inp, fallbackName) => {
    let y, m, d;
    if (inp.tglLahir) {
      const dateParsed = (typeof parseDateComponents === 'function')
        ? parseDateComponents(inp.tglLahir)
        : null;
      if (dateParsed) {
        y = dateParsed.y; m = dateParsed.m; d = dateParsed.d;
      } else {
        const parts = String(inp.tglLahir).split(/[-/.]/).map(Number);
        if (parts[0] >= 1000) { y = parts[0]; m = parts[1]; d = parts[2]; }
        else { y = parts[2]; m = parts[1]; d = parts[0]; }
      }
    } else {
      y = inp.y; m = inp.m; d = inp.d;
    }
    const nama = inp.nama && inp.nama.trim() !== '' ? inp.nama.trim() : fallbackName;
    const info = getDayInfo(y, m, d) || {};
    const dino = info.hari || info.dino || HARI[info.weekdayId] || 'Kamis';
    const pas = info.pasaran || info.pas || PASARAN[info.pasaranId] || 'Pon';
    const neptu = (info.neptu !== undefined) ? info.neptu : ((NEPTU_HARI[info.weekdayId] ?? 8) + (NEPTU_PASARAN[info.pasaranId] ?? 7));
    const wukuName = info.wukuName || WUKU[info.wukuId] || 'Kuruwelut';
    const kd = hitungKarakterDasarPure(d, m, y);
    const bincil = bincilMatrix
      ? resolveBincilFromMatrix(bincilMatrix, dino, pas, wukuName)
      : getNujumData(dino, pas, wukuName);

    return {
      nama,
      d, m, y,
      tglStr: `${d} ${BULAN_MASEHI[m - 1]} ${y}`,
      dino,
      pas,
      neptu,
      wukuName,
      wukuNo: info.wukuId + 1,
      tipeKarakter: kd.tipe,
      bincil: {
        padewan: bincil?.padewan ?? { nama: 'Guru', arti: 'Pemberi anugerah' },
        paringkelan: bincil?.paringkelan ?? { nama: 'Tungle', arti: 'Daun' },
        pandangon: bincil?.pandangon ?? { nama: 'Dadi', arti: 'Tercapai tujuannya' },
        paarasan: bincil?.paarasan ?? bincil?.parasan ?? { nama: 'Lakuning Srengenge', arti: 'Pengertian' },
        parasan: bincil?.parasan ?? bincil?.paarasan ?? { nama: 'Lakuning Srengenge', arti: 'Pengertian' },
        pancasuda: bincil?.pancasuda ?? { nama: 'Satria Wibawa', arti: 'Luhur' },
        kamarokan: bincil?.kamarokan ?? { nama: 'Mantri Sinarojo', arti: 'Amanah' }
      }
    };
  };

  const person1 = parsePerson(p1Input, "Pihak Kapisan");
  const person2 = parsePerson(p2Input, "Pihak Kaping Kalih");

  // Kalkulasi sinergi relasi (0 - 100)
  // Berdasarkan perbedaan neptu yang seimbang dan kecocokan tipe karakter
  let skor = 75; // Baseline kerja sama yang sehat
  const neptuDiff = Math.abs(person1.neptu - person2.neptu);
  if (neptuDiff <= 4) skor += 10; // Energi neptu berimbang
  else if (neptuDiff >= 10) skor -= 5; // Perlu adaptasi tempo kerja

  if (person1.tipeKarakter === person2.tipeKarakter) {
    skor += 5; // Kesamaan gaya berpikir
  } else {
    // Saling melengkapi (misal Leader + Analisis / Realis + Eksekutor)
    const complementaries = [
      ['Leader', 'Analisis'],
      ['Leader', 'Eksekutor'],
      ['Diplomat', 'Adventurer'],
      ['Realis', 'Idealis'],
      ['Edukatif', 'Entertainer']
    ];
    const isComplementary = complementaries.some(([t1, t2]) =>
      (person1.tipeKarakter === t1 && person2.tipeKarakter === t2) ||
      (person1.tipeKarakter === t2 && person2.tipeKarakter === t1)
    );
    if (isComplementary) skor += 15;
  }

  skor = Math.min(98, Math.max(55, skor));

  // Analisis Titik Temu Sinergis
  const titikTemu = [
    `${person1.nama} (${person1.tipeKarakter}) dan ${person2.nama} (${person2.tipeKarakter}) memiliki kombinasi pendekatan yang saling melengkapi dalam mengawal rencana kerja.`,
    `Energi weton ${person1.dino} ${person1.pas} (Neptu ${person1.neptu}) bersanding selaras dengan ${person2.dino} ${person2.pas} (Neptu ${person2.neptu}), memadukan ketahanan dan keluwesan.`,
    `Dimensi Pandangon (${person1?.bincil?.pandangon?.nama || '-'} & ${person2?.bincil?.pandangon?.nama || '-'}) memungkinkan keduanya saling mengoreksi perspektif tanpa mencederai komitmen bersama.`
  ];

  // Analisis Potensi Friksi / Gesekan Komunikasi
  const potensiFriksi = [
    `Perbedaan gaya komunikasi: ${person1?.bincil?.paarasan?.nama || '-'} cenderung ${(person1?.bincil?.paarasan?.arti || 'pengertian').split(',')[0].toLowerCase()}, sedangkan ${person2?.bincil?.paarasan?.nama || '-'} cenderung ${(person2?.bincil?.paarasan?.arti || 'pengertian').split(',')[0].toLowerCase()}.`,
    `Saat berada di bawah tekanan tenggat waktu, waspadai potensi gesekan antara dorongan cepat dan kebutuhan ketelitian mendalam.`
  ];

  // Saran Tepa Slira (Etika Interpersonal Jawa)
  const saranTepaSlira = [
    "Empan Papan: Bagilah peran secara tegas sesuai keunggulan watak (pihak analitis menyusun konsep, pihak eksekutif memimpin implementasi lapangan).",
    "Ajining Dhiri Dumunung ing Lathi: Terapkan komunikasi terbuka dengan santun, utamakan konfirmasi sebelum mengambil kesimpulan sepihak.",
    "Ngundhuh Wohing Pakarti: Bangun kepercayaan dengan transparansi penuh dalam pembagian tugas dan apresiasi hasil capaian."
  ];

  return {
    person1,
    person2,
    sinergi: {
      relasiType,
      relasiLabel: RELASI_LABELS[relasiType] || RELASI_LABELS.rekan_kerja,
      kombinasiKarakter: `${person1.tipeKarakter} & ${person2.tipeKarakter}`,
      skorKeselarasanRelasi: skor,
      titikTemu,
      potensiFriksi,
      saranTepaSlira
    },
    disclaimer: DISCLAIMER_ETIS_KULTURAL
  };
}

export {
  getNujumFromMatrix,
  getNujumFromDatabase,
  bincilDatabase,
  primbonMatrix,
  nujumMatrix,
  nujumDatabase
} from '../../data/nujum-matrix.js';

export {
  MASTER_KET_BINCIL,
  MASTER_PAWUKON,
  PAWUKON_LIST,
  MASTER_BINCIL_MATRIX,
  getNujumResult,
  getPawukonDetail,
  KARAKTER,
  AKSARA_FAAL,
  NABI_FAAL,
  FAAL_DESC,
  PADEWAN_DATA,
  PARINGKELAN_DATA,
  PANDANGON_DATA,
  PAARASAN_DATA,
  PANCASUDA_DATA,
  KAMAROKAN_DATA,
  getAsesoris
};


