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
  getAsesoris
} from '../../data/personality.js';

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
 * Mengonversi nama Latin ke daftar aksara dasar untuk Faalakiah.
 * @param {string} nama 
 * @returns {string[]}
 */
export function namaKeAksaraList(nama) {
  if (!nama || typeof nama !== "string") return [];
  const bersih = nama.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  if (!bersih) return [];
  const kataArr = bersih.split(/\s+/);
  const hasil = [];

  for (const kata of kataArr) {
    if (!kata) continue;
    const sukuArr = kata.match(/(?:ng|ny|th|dh|[b-df-hj-np-tv-z])?[aeiouéè]?/g) || [];
    for (const suku of sukuArr) {
      if (!suku) continue;
      const mKons = suku.match(/^(ng|ny|th|dh|[b-df-hj-np-tv-z])/);
      const kons = mKons ? mKons[1] : "h";
      const mapKons = {
        "h": "HA", "n": "NA", "c": "CA", "r": "RA", "k": "KA",
        "d": "DA", "t": "TA", "s": "SA", "w": "WA", "l": "LA",
        "p": "PA", "j": "JA", "y": "YA", "m": "MA", "g": "GA", "b": "BA",
        "ny": "NYA", "ng": "NGA", "th": "THA", "dh": "DHA"
      };
      hasil.push(mapKons[kons] || mapKons[kons[0]] || "HA");
    }
  }
  return hasil;
}

const UNICODE_JAWA_TO_FAAL = {
  'ꦲ': 'HA', 'ꦤ': 'NA', 'ꦕ': 'CA', 'ꦫ': 'RA', 'ꦏ': 'KA',
  'ꦢ': 'DA', 'ꦠ': 'TA', 'ꦱ': 'SA', 'ꦮ': 'WA', 'ꦭ': 'LA',
  'ꦥ': 'PA', 'ꦝ': 'DHA', 'ꦗ': 'JA', 'ꦪ': 'YA', 'ꦚ': 'NYA',
  'ꦩ': 'MA', 'ꦒ': 'GA', 'ꦧ': 'BA', 'ꦛ': 'THA', 'ꦔ': 'NGA',
  'ꦟ': 'NA', 'ꦑ': 'KA', 'ꦡ': 'TA', 'ꦰ': 'SA',
  'ꦦ': 'PA', 'ꦘ': 'NYA', 'ꦓ': 'GA', 'ꦨ': 'BA',
  'ꦄ': 'HA', 'ꦅ': 'HA', 'ꦈ': 'HA', 'ꦌ': 'HA', 'ꦎ': 'HA',
  'ꦂ': 'RA', 'ꦁ': 'NGA', 'ꦃ': 'HA',
  'ꦿ': 'RA', 'ꦽ': 'RA', 'ꦾ': 'YA'
};

export function parseAksaraForFaalakiah(text) {
  if (!text || !text.trim()) return [];
  const clean = text.trim();
  const jawaChars = clean.match(/[\uA980-\uA9DF]/g);
  if (jawaChars && jawaChars.length > 0) {
    const list = [];
    for (const ch of jawaChars) {
      if (UNICODE_JAWA_TO_FAAL[ch]) {
        list.push(UNICODE_JAWA_TO_FAAL[ch]);
      }
    }
    if (list.length > 0) return list;
  }
  return namaKeAksaraList(clean);
}

/**
 * Menghitung ramalan Faalakiah dari nama.
 * @param {string} nama 
 * @returns {Object}
 */
export function getFaalakiah(nama) {
  const aksaraList = namaKeAksaraList(nama);
  if (aksaraList.length === 0) {
    return { kode: 0, kodeNormalized: 12, nabi: NABI_FAAL[0], desc: FAAL_DESC[0], aksaraStr: "-", sum: 0 };
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
    sum
  };
}

/**
 * Mengambil data Nujum Bincil dan Pawukon dari master data.
 */
export const getNujumData = masterGetNujumData;

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
 * @param {Object} param0 
 */
export function getNujumSummaryRingkas({ nama = 'Panjenengan', d, m, y, tahunHitung = 2026 }) {
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];

  const kd = hitungKarakterDasarPure(d, m, y);
  const bincil = getNujumData(dino, pas, wukuName);
  const faal = getFaalakiah(nama);

  // Ekstraksi 3 kekuatan utama dari Paarasan, Pandangon, dan Tipe Karakter
  const kekuatanUtama = [
    `${kd.tipe}: ${kd.kekuatan.split(',')[0]}`,
    `Paarasan (${bincil.paarasan.nama}): ${bincil.paarasan.arti.split(',')[0]}`,
    `Pandangon (${bincil.pandangon.nama}): ${bincil.pandangon.arti.split(',')[0]}`
  ];

  const areaWaspada = `Paringkelan ${bincil.paringkelan.nama}: ${bincil.paringkelan.arti}`;

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
    tglMasehiStr: `${d} ${BULAN_MASEHI[m - 1]} ${y}`,
    dino,
    pas,
    neptu,
    wukuName,
    tipeKarakter: kd.tipe,
    deskripsiKarakter: kd.ringkasan,
    kekuatanUtama,
    areaWaspada,
    arahHoki,
    sirikanRumah,
    faalRingkas: `Teladan ${faal.nabi}: ${faal.desc.split('.')[0]}.`
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
export function compareNonJodoh(p1Input, p2Input, relasiType = 'rekan_kerja') {
  const parsePerson = (inp, fallbackName) => {
    let y, m, d;
    if (inp.tglLahir) {
      const parts = String(inp.tglLahir).split(/[-/.]/).map(Number);
      y = parts[0]; m = parts[1]; d = parts[2];
    } else {
      y = inp.y; m = inp.m; d = inp.d;
    }
    const nama = inp.nama && inp.nama.trim() !== '' ? inp.nama.trim() : fallbackName;
    const info = getDayInfo(y, m, d);
    const dino = HARI[info.weekdayId];
    const pas = PASARAN[info.pasaranId];
    const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
    const wukuName = WUKU[info.wukuId];
    const kd = hitungKarakterDasarPure(d, m, y);
    const bincil = getNujumData(dino, pas, wukuName);

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
        padewan: bincil.padewan,
        paringkelan: bincil.paringkelan,
        pandangon: bincil.pandangon,
        paarasan: bincil.paarasan,
        pancasuda: bincil.pancasuda,
        kamarokan: bincil.kamarokan
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
    `Dimensi Pandangon (${person1.bincil.pandangon.nama} & ${person2.bincil.pandangon.nama}) memungkinkan keduanya saling mengoreksi perspektif tanpa mencederai komitmen bersama.`
  ];

  // Analisis Potensi Friksi / Gesekan Komunikasi
  const potensiFriksi = [
    `Perbedaan gaya komunikasi: ${person1.bincil.paarasan.nama} cenderung ${person1.bincil.paarasan.arti.split(',')[0].toLowerCase()}, sedangkan ${person2.bincil.paarasan.nama} cenderung ${person2.bincil.paarasan.arti.split(',')[0].toLowerCase()}.`,
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


