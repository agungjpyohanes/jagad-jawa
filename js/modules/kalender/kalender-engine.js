/**
 * Jagad Jawa — Modul Domain: Kalender Engine
 * Pure calculation functions untuk konversi penanggalan Masehi, Hijriah, Jawa (Anno Javanico),
 * Pawukon (siklus 210 hari), Pranata Mangsa agraris, serta evaluasi Dino Ijo / Dino Gede.
 * 
 * Bebas dari ketergantungan DOM (window/document).
 */

import {
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  BULAN_JAWA,
  WINDU,
  WUKU,
  DUNUNGE,
  GRID,
  KETERANGAN,
  KETERANGAN_MAP,
  EPOCH_JDN,
  DINO_GEDE_LIST,
  DINO_IJO_LIST,
  DINO_GEDE_SET,
  DINO_IJO_SET,
  LIBUR_NASIONAL,
  toJDN,
  jdnToIslamic,
  getDayInfo,
  getTanggalJawaLengkap,
  getLiburNasional,
  parseDinoWukuArgs,
  normDinoWukuKey,
  isDinoGede,
  isDinoIjo,
  getDinoWarnaStatus,
  evaluateDino,
  checkDinoGede,
  getKeteranganKodeDetail
} from '../../data/calendar.js';

/**
 * Menghitung jumlah hari dalam bulan Masehi (pure integer arithmetic).
 * @param {number} y Tahun
 * @param {number} m Bulan (1 - 12)
 * @returns {number}
 */
export function getDaysInMonth(y, m) {
  if (m === 2) {
    return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
  }
  return (m === 4 || m === 6 || m === 9 || m === 11) ? 30 : 31;
}

/**
 * Menghitung total neptu dari hari dan pasaran.
 * @param {string|number} hari Nama hari (e.g. "Minggu") atau index (0-6)
 * @param {string|number} pasaran Nama pasaran (e.g. "Legi") atau index (0-4)
 * @returns {number}
 */
export function getNeptu(hari, pasaran) {
  let hIdx = typeof hari === 'number' ? hari : HARI.findIndex(h => h.toLowerCase() === String(hari).toLowerCase());
  let pIdx = typeof pasaran === 'number' ? pasaran : PASARAN.findIndex(p => p.toLowerCase() === String(pasaran).toLowerCase());

  const neptuH = hIdx >= 0 && hIdx < NEPTU_HARI.length ? NEPTU_HARI[hIdx] : 0;
  const neptuP = pIdx >= 0 && pIdx < NEPTU_PASARAN.length ? NEPTU_PASARAN[pIdx] : 0;
  return neptuH + neptuP;
}

/**
 * Master Data 12 Pranata Mangsa lengkap dengan musim tani, candrasangkala, dan pratandha alam.
 */
export const PRANATA_MANGSA_DETAIL = [
  {
    id: 1,
    nama: "Kasa (Kartika)",
    rentang: "22 Juni – 1 Agustus",
    durasiHari: 41,
    candrasangkala: "Sesotya murca ing embanan (Mutiara lepas dari ikatannya)",
    musimTani: "Mangsa Katiga (Kemarau Awal)",
    pratandhaAlam: "Godhong wit-witan padha rontok, lemut ngendhog, hawa anyep garing ing wengi.",
    pakaryanTani: "Ngresiki lahan sawah/tegalan, ngolah palawija (jagung, kedelai, wijen), miwiti panen tembakau.",
    watak: "Berjiwa mandiri, teguh pendirian, dan memiliki harga diri tinggi. Senang kerapian dan keteraturan."
  },
  {
    id: 2,
    nama: "Karo (Puspita)",
    rentang: "2 Agustus – 24 Agustus",
    durasiHari: 23,
    candrasangkala: "Bantala rengka (Bumi merekah)",
    musimTani: "Mangsa Katiga (Puncak Kemarau)",
    pratandhaAlam: "Lemah padha rengka/nelo amarga garing, wit randhu lan pelem wiwit semi mekar.",
    pakaryanTani: "Nandur palawija tahan garing, nyiram wit-witan woh, njaga sumber resapan banyu.",
    watak: "Terbuka, jujur, dan berani bicara apa adanya. Penuh semangat dan pantang menyerah."
  },
  {
    id: 3,
    nama: "Katelu (Manggasri)",
    rentang: "25 Agustus – 17 September",
    durasiHari: 24,
    candrasangkala: "Suta manut ing bapa (Anak patuh pada sang ayah)",
    musimTani: "Mangsa Katiga (Akhir Kemarau)",
    pratandhaAlam: "Ubi lan pala kependhem wiwit ngisi woh, wit gadung mrambat ngrembaka.",
    pakaryanTani: "Panen palawija katiga, ngeduk kenthang, tela, lan pala kependhem.",
    watak: "Berbakti, penuh rasa tanggung jawab, dan teliti dalam bekerja. Tenang dan disiplin."
  },
  {
    id: 4,
    nama: "Kapat (Sitra)",
    rentang: "18 September – 12 Oktober",
    durasiHari: 25,
    candrasangkala: "Waspa kumembeng jroning kalbu (Air mata menggenang di dalam kalbu)",
    musimTani: "Mangsa Labuh (Peralihan Menuju Hujan)",
    pratandhaAlam: "Sumber banyu wiwit asat, wit randhu awoh kapuk mekar, manuk-manuk padha gawe susuh.",
    pakaryanTani: "Mbongkar tegalan, mbakar suket resikan, nyiapake winih pari kang bakal disebar.",
    watak: "Halus perasaannya, mudah berempati, dan memiliki intuisi tajam."
  },
  {
    id: 5,
    nama: "Kalima (Manggala)",
    rentang: "13 Oktober – 8 November",
    durasiHari: 27,
    candrasangkala: "Pancuran mas sumawur ing jagad (Pancuran emas bertabur di dunia)",
    musimTani: "Mangsa Labuh (Hujan Awal)",
    pratandhaAlam: "Udan wiwit tumiba pating jlekethet, wit asem wiwit semi trubus, uler-uler wiwit metu.",
    pakaryanTani: "Ndhedher winih pari (ngurit) ing pategalan, nyiapake saluran irigasi sawah.",
    watak: "Dermawan, suka menolong sesama, dan berpikiran luas."
  },
  {
    id: 6,
    nama: "Kanem (Naya)",
    rentang: "9 November – 21 Desember",
    durasiHari: 43,
    candrasangkala: "Rasa mulya kasuciyan (Rasa mulia kesucian)",
    musimTani: "Mangsa Rendheng (Musim Hujan Aktif)",
    pratandhaAlam: "Udan wiwit deres, woh rambutan lan dhuku mateng, laron padha metu saka njero lemah.",
    pakaryanTani: "Mluku lan nggaru sawah, wiwit ndhudhut winih pari lan nandur pari rendheng.",
    watak: "Bercita-cita luhur, berwibawa, dan senang mencari kebenaran hakiki."
  },
  {
    id: 7,
    nama: "Kapitu (Palguna)",
    rentang: "22 Desember – 2 Februari",
    durasiHari: 43,
    candrasangkala: "Wisa kentas ing maruta (Racun hanyut oleh angin)",
    musimTani: "Mangsa Rendheng (Puncak Hujan)",
    pratandhaAlam: "Puncak mangsa rendheng, kali-kali padha banjir, angin gedhe lan lelara mangsa udan.",
    pakaryanTani: "Nandur pari rampungan, njaga galengan sawah saka luapan banyu, ngontrol ama keong.",
    watak: "Tangguh menghadapi cobaan hidup, berhati bersih, dan cepat memaafkan."
  },
  {
    id: 8,
    nama: "Kawolu (Wisaka)",
    rentang: "3 Februari – 28/29 Februari",
    durasiHari: 26,
    candrasangkala: "Anjrah jroning kayun (Menyebar di dalam kehendak)",
    musimTani: "Mangsa Rendheng (Mereda)",
    pratandhaAlam: "Udan wiwit suda deresé, kucing gandrung, walang sangit wiwit nyerang tetanduran.",
    pakaryanTani: "Matun sawah (ngresiki gulma/suket), pari wiwit mratak meteng (njebul).",
    watak: "Kreatif, banyak gagasan cemerlang, dan luwes bergaul."
  },
  {
    id: 9,
    nama: "Kasanga (Jita)",
    rentang: "1 Maret – 25 Maret",
    durasiHari: 25,
    candrasangkala: "Wedaring wacana mulya (Terucapnya perkataan mulia)",
    musimTani: "Mangsa Mareng (Peralihan ke Kemarau)",
    pratandhaAlam: "Garengpung muni ngerik ing wit-witan, pari wiwit kuning sepuh, jangkrik ngetokake swara.",
    pakaryanTani: "Njaga pari saka ama manuk emprit, nyiapake ani-ani/arit lan papan mepe gabah.",
    watak: "Pandai bertutur kata, bijaksana, dan santun perilakunya."
  },
  {
    id: 10,
    nama: "Kasapuluh (Srawana)",
    rentang: "26 Maret – 18 April",
    durasiHari: 24,
    candrasangkala: "Gedhong mineb jroning kalbu (Gedung terkunci di dalam batin)",
    musimTani: "Mangsa Mareng (Panen Raya)",
    pratandhaAlam: "Udan arang-arang tumiba, manuk-manuk padha ngendhog, kewan ingon padha meteng.",
    pakaryanTani: "Panen raya pari rendheng, mepe gabah ing plataran, nyimpen asil panen ing lumbung.",
    watak: "Penyimpan rahasia yang ulung, cermat berhitung, dan tidak tergesa-gesa."
  },
  {
    id: 11,
    nama: "Desta (Padrawana)",
    rentang: "19 April – 11 Mei",
    durasiHari: 23,
    candrasangkala: "Sotya sinarawedi (Intan permata bersinar mulia)",
    musimTani: "Mangsa Mareng Pungkasan",
    pratandhaAlam: "Manuk podhang ngloloh anak, wit-witan awoh lemu, hawa awan panas sumuk.",
    pakaryanTani: "Panen pari pungkasan, nandur palawija sela (kacang ijo, kedele) ing tilas sawah.",
    watak: "Menawan, cerdas, berdaya pikat tinggi, dan disukai banyak kalangan."
  },
  {
    id: 12,
    nama: "Sadha (Asuji)",
    rentang: "12 Mei – 21 Juni",
    durasiHari: 41,
    candrasangkala: "Tirta sah saking sasana (Air pergi dari tempatnya)",
    musimTani: "Mangsa Mareng nyang Katiga",
    pratandhaAlam: "Hawa wiwit anyep nyenyet ing wanci esuk (mangsa bedhidhing), embun upas tumiba.",
    pakaryanTani: "Ngresiki damen (jerami), ngolah palawija katiga, nyimpen banyu kanggo sumur resapan.",
    watak: "Dinamis, suka merantau atau bepergian, berani mengambil jalan hidup mandiri."
  }
];

/**
 * Menentukan Pranata Mangsa lengkap agraris berdasarkan tanggal dan bulan.
 * @param {number} day Tanggal (1 - 31)
 * @param {number} month Bulan (1 - 12)
 * @returns {Object}
 */
export function getPranataMangsaLengkap(day, month) {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  if ((m === 6 && d >= 22) || m === 7 || (m === 8 && d <= 1)) return PRANATA_MANGSA_DETAIL[0]; // Kasa
  if (m === 8 && d >= 2 && d <= 24) return PRANATA_MANGSA_DETAIL[1]; // Karo
  if ((m === 8 && d >= 25) || (m === 9 && d <= 17)) return PRANATA_MANGSA_DETAIL[2]; // Katelu
  if ((m === 9 && d >= 18) || (m === 10 && d <= 12)) return PRANATA_MANGSA_DETAIL[3]; // Kapat
  if ((m === 10 && d >= 13) || (m === 11 && d <= 8)) return PRANATA_MANGSA_DETAIL[4]; // Kalima
  if ((m === 11 && d >= 9) || (m === 12 && d <= 21)) return PRANATA_MANGSA_DETAIL[5]; // Kanem
  if ((m === 12 && d >= 22) || m === 1 || (m === 2 && d <= 2)) return PRANATA_MANGSA_DETAIL[6]; // Kapitu
  if (m === 2 && d >= 3) return PRANATA_MANGSA_DETAIL[7]; // Kawolu
  if (m === 3 && d >= 1 && d <= 25) return PRANATA_MANGSA_DETAIL[8]; // Kasanga
  if ((m === 3 && d >= 26) || (m === 4 && d <= 18)) return PRANATA_MANGSA_DETAIL[9]; // Kasapuluh
  if ((m === 4 && d >= 19) || (m === 5 && d <= 11)) return PRANATA_MANGSA_DETAIL[10]; // Desta
  return PRANATA_MANGSA_DETAIL[11]; // Sadha
}

export {
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  BULAN_JAWA,
  WINDU,
  WUKU,
  DUNUNGE,
  GRID,
  KETERANGAN,
  KETERANGAN_MAP,
  EPOCH_JDN,
  DINO_GEDE_LIST,
  DINO_IJO_LIST,
  DINO_GEDE_SET,
  DINO_IJO_SET,
  LIBUR_NASIONAL,
  toJDN,
  jdnToIslamic,
  getDayInfo,
  getTanggalJawaLengkap,
  getLiburNasional,
  parseDinoWukuArgs,
  normDinoWukuKey,
  isDinoGede,
  isDinoIjo,
  getDinoWarnaStatus,
  evaluateDino,
  checkDinoGede,
  getKeteranganKodeDetail
};
