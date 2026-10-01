// generate-all-databases.mjs
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// ============================================
// KONFIGURASI
// ============================================
const DIST_DIR = 'dist/jagad-jawa-database';
const SOURCE_FILES = {
  // CSV Files
  wuku_ensiklopedia: '06_pawukon_ensiklopedia.csv',
  bincil_matrix: '02_bincil_matrix.csv',
  bincil_arti: '02_bincil_arti.csv',
  dino_rules: '03_dino_rules.csv',
  marriage_hasil: '04_marriage_hasil.csv',
  marriage_aksara: '04_marriage_aksara.csv',
  pranata_mangsa: '07_kepribadian_database_nujum_-_pranata_mangsa.csv',
  zodiak: '07_kepribadian_database_nujum_-_zodiak.csv',
  sasi_jawa: '07_kepribadian_database_nujum_-_sasi_jawa.csv',
  pasaran: '07_kepribadian_database_nujum_-_pasaran.csv',
  dina: '07_kepribadian_database_nujum_-_dina.csv',
  karakter_dasar: '07_kepribadian_database_nujum_-_karakter_dasar.csv',
  pekerjaan: '07_kepribadian_database_nujum_-_pekerjaan.csv',
  pakarti_rejeki: '07_kepribadian_database_nujum_-_pakarti_rejeki.csv',
  pakarti_badan: '07_kepribadian_database_nujum_-_pakarti_badan.csv',
  palenggahan: '07_kepribadian_database_nujum_-_palenggahan.csv',
  sirikan_adhep: '07_kepribadian_database_nujum_-_neptu_sirikan_adhep.csv',
  siklus_padewan: '07_kepribadian_database_nujum_-_siklus_padewan.csv',
  siklus_shio: '07_kepribadian_database_nujum_-_siklus_shio.csv',
  tetanen: '07_petung_database_nujum_cleaned_-_petung_tetanen.csv',
  wuku_ala_becik: '07_kepribadian_database_nujum_cleaned_-_wuku_ala_becik.csv',
  wuku_nambani: '07_kepribadian_database_nujum_cleaned_-_wuku_nambani.csv',
  wuku_pangupajiwa: '07_kepribadian_database_nujum_cleaned_-_wuku_pangupajiwa.csv',
  wuku_tetanen: '07_petung_database_nujum_cleaned_-_wuku_tetanen.csv',
  dino_gede: '07_petung_database_nujum_-_dino_gede.csv',
  dino_ijo: '07_petung_database_nujum_-_dino_ijo.csv',
  i18n_ui: '08_i18n_ui.csv',
  aksara_nglegena: '08_aksara_nglegena.csv',
  wayang_list: '08_wayang_list.csv',
  // JSON Files
  omah: '09_omah_parsed.json',
  ijab: '09_ijab_parsed.json',
  ternak: '09_ternak_parsed.json',
  sasmitha: '09_sasmitha_parsed.json',
  sinengker: '09_database_sinengker_khusus.json',
  pustaka: '09_database_pustaka_jawa.json',
  pustaka_dongo: '09_pustaka_dongo_jagad_jawa.json',
  kamus_jawa: '09_kamus-jawa.json',
  kamus_sanskerta: '09_kamus-sansakerta.json'
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const clean = (str) => str ? String(str).trim().replace(/\s+/g, ' ') : '';
const toTitle = (str) => clean(str).toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

// Bilingual helper: jika tidak ada terjemahan ID, pakai placeholder
const bilingual = (jvText, idText = null) => ({
  jv: clean(jvText) || '-',
  id: idText ? clean(idText) : `[Terjemahan ID] ${clean(jvText) || '-'}`
});

// Baca CSV dengan aman
const readCSV = (filename) => {
  try {
    const content = fs.readFileSync(filename, 'utf8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
  } catch (e) {
    console.warn(`  ⚠️  File tidak ditemukan: ${filename}`);
    return [];
  }
};

// Baca JSON dengan aman
const readJSON = (filename) => {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (e) {
    console.warn(`  ⚠️  File tidak ditemukan: ${filename}`);
    return null;
  }
};

// Simpan file JSON
const saveJSON = (filename, data) => {
  const filepath = path.join(DIST_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  ✅ ${filename} (${JSON.stringify(data).length} bytes)`);
};

// ============================================
// MAIN PROCESS
// ============================================
console.log('🚀 Memulai pembuatan database Jagad Jawa...\n');

// Buat folder dist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// ============================================
// 1. KALENDER CONSTANTS
// ============================================
console.log('\n📅 1/33 Kalender Constants...');
const kalenderConstants = {
  neptu_hari: {
    minggu: 5, senin: 4, selasa: 3, rabu: 7, kamis: 8, jumat: 6, sabtu: 9
  },
  neptu_pasaran: {
    legi: 5, pahing: 9, pon: 7, wage: 4, kliwon: 8
  },
  nama_hari: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  nama_pasaran: ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'],
  nama_wuku: ['Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang', 'Galungan', 'Kuningan', 'Langkir', 'Mandasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir', 'Medangkungan', 'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala', 'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'],
  nama_bulan_jawa: ['Sura', 'Sapar', 'Mulud', 'Bakda Mulud', 'Jumadilawal', 'Jumadilakir', 'Rejeb', 'Ruwah', 'Pasa', 'Sawal', 'Sela', 'Besar'],
  nama_windu: ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir'],
  epoch_pawukon: { jdn: 2459456, tanggal: '2021-08-29', keterangan: 'Minggu Pahing Wuku Sinta' }
};
saveJSON('01-kalender-constants.json', kalenderConstants);

// ============================================
// 2. WUKU ENSIKLOPEDIA (30 Wuku)
// ============================================
console.log('\n📜 2/33 Wuku Ensiklopedia...');
const wukuRaw = readCSV(SOURCE_FILES.wuku_ensiklopedia);
const wukuFinal = wukuRaw.map(row => ({
  no_wuku: parseInt(row.no_wuku || row.id, 10),
  nama: bilingual(row.nama_wuku),
  dewa: bilingual(row.dewane),
  watek: bilingual(row.watek_budi_pangerti),
  bilahi: bilingual(row.bilahi_bebaya),
  sesaji: bilingual(row.sesaji_ruwat),
  tindih: clean(row.tindih_ruwat),
  selamatan_sega: bilingual(row.selamatan_sega),
  selamatan_iwak: bilingual(row.selamatan_iwak),
  salawat: clean(row.salawat),
  donga: bilingual(row.donga_slamet),
  pangupaya: bilingual(row.pangupaya_jiwa),
  tamba: bilingual(row.tamba_yen_lara)
}));
saveJSON('02-wuku-ensiklopedia.json', wukuFinal);

// ============================================
// 3. BINCIL MATRIX (210 Kombinasi)
// ============================================
console.log('\n🔢 3/33 Bincil Matrix...');
const bincilRaw = readCSV(SOURCE_FILES.bincil_matrix);
const bincilMatrix = {};
bincilRaw.forEach(row => {
  const key = `${clean(row.wuku).toLowerCase()}_${clean(row.dino).toLowerCase()}_${clean(row.pasaran).toLowerCase()}`;
  if (!bincilMatrix[key]) {
    bincilMatrix[key] = {
      no_wuku: parseInt(row.no_wuku, 10),
      wuku: toTitle(row.wuku),
      hari: toTitle(row.dino),
      pasaran: toTitle(row.pasaran),
      padewan: toTitle(row.padewan),
      paringkelan: toTitle(row.paringkelan),
      pandangon: toTitle(row.pandangon),
      paarasan: toTitle(row.paarasan),
      pancasuda: toTitle(row.pancasuda),
      kamarokan: toTitle(row.kamarokan)
    };
  }
});
saveJSON('03-bincil-matrix.json', bincilMatrix);

// ============================================
// 4. BINCIL ARTI (6 Dimensi)
// ============================================
console.log('\n📖 4/33 Bincil Arti...');
const bincilArtiRaw = readCSV(SOURCE_FILES.bincil_arti);
const bincilArti = { padewan: {}, paringkelan: {}, pandangon: {}, paarasan: {}, pancasuda: {}, kamarokan: {} };
bincilArtiRaw.forEach(row => {
  const dimensi = clean(row.dimensi || row.kategori || '').toLowerCase();
  const nilai = clean(row.nilai || row.nama || '').toLowerCase();
  const arti = clean(row.arti || row.tegese || '');
  if (bincilArti[dimensi] && nilai) {
    bincilArti[dimensi][nilai] = bilingual(arti);
  }
});
saveJSON('04-bincil-arti.json', bincilArti);

// ============================================
// 5. DINO RULES (Gede & Ijo)
// ============================================
console.log('\n🌿 5/33 Dino Rules...');
const dinoGedeRaw = readCSV(SOURCE_FILES.dino_gede);
const dinoIjoRaw = readCSV(SOURCE_FILES.dino_ijo);
const dinoRules = {
  dino_gede: dinoGedeRaw.map(r => ({ hari: toTitle(r.hari || r.dino), pasaran: toTitle(r.pasaran), wuku: toTitle(r.wuku) })),
  dino_ijo: dinoIjoRaw.map(r => ({ hari: toTitle(r.hari || r.dino), pasaran: toTitle(r.pasaran), wuku: toTitle(r.wuku) }))
};
saveJSON('05-dino-rules.json', dinoRules);

// ============================================
// 6. PRANATA MANGSA (12 Mangsa)
// ============================================
console.log('\n🌾 6/33 Pranata Mangsa...');
const pranataRaw = readCSV(SOURCE_FILES.pranata_mangsa);
const pranataFinal = pranataRaw.map(row => ({
  id: parseInt(row.id, 10),
  nama: bilingual(row.nama_mangsa || row.nama),
  candrasangkala: bilingual(row.candrasangkala),
  rentang: clean(row.rentang_tanggal || row.rentang),
  watak: bilingual(row.watak_karakteristik_lahir || row.watak)
}));
saveJSON('06-pranata-mangsa.json', pranataFinal);

// ============================================
// 7. ZODIAK (12 Bintang)
// ============================================
console.log('\n⭐ 7/33 Zodiak...');
const zodiakRaw = readCSV(SOURCE_FILES.zodiak);
const zodiakFinal = zodiakRaw.map(row => ({
  id: parseInt(row.id, 10),
  nama: bilingual(row.nama || row.zodiak),
  rentang: clean(row.rentang),
  elemen: bilingual(row.elemen),
  watak: bilingual(row.watak || row.watak_karakteristik),
  peruntungan: bilingual(row.peruntungan || ''),
  jodoh: clean(row.jodoh || ''),
  karir: bilingual(row.karir || row.profesi || '')
}));
saveJSON('07-zodiak.json', zodiakFinal);

// ============================================
// 8. SASI JAWA (12 Bulan)
// ============================================
console.log('\n🌙 8/33 Sasi Jawa...');
const sasiRaw = readCSV(SOURCE_FILES.sasi_jawa);
const sasiFinal = sasiRaw.map(row => ({
  id: parseInt(row.id, 10),
  sasi_jawa: toTitle(row.sasi_jawa || row.nama),
  padanan_hijriah: clean(row.padanan_hijriah),
  watak: bilingual(row.watak_karakteristik_kelahiran || row.watak)
}));
saveJSON('08-sasi-jawa.json', sasiFinal);

// ============================================
// 9. PASARAN (5 Pasaran)
// ============================================
console.log('\n📆 9/33 Pasaran...');
const pasaranRaw = readCSV(SOURCE_FILES.pasaran);
const pasaranFinal = pasaranRaw.map(row => ({
  nama: toTitle(row.nama_pasaran || row.nama),
  watak_utama: bilingual(row.watak_utama),
  deskripsi: bilingual(row.deskripsi),
  catatan_rejeki: bilingual(row.catatan_rejeki_nasib || row.catatan_rejeki)
}));
saveJSON('09-pasaran.json', pasaranFinal);

// ============================================
// 10. DINA (7 Hari)
// ============================================
console.log('\n☀️ 10/33 Dina...');
const dinaRaw = readCSV(SOURCE_FILES.dina);
const dinaFinal = dinaRaw.map(row => ({
  id: parseInt(row.id, 10),
  nama_masehi: toTitle(row.nama_masehi || row.nama),
  nama_kuno: toTitle(row.nama_kuno),
  neptu: parseInt(row.neptu, 10),
  lambang: bilingual(row.lambang),
  elemen: bilingual(row.elemen),
  warna: bilingual(row.warna),
  watak: bilingual(row.watak || row.watak_karakteristik),
  profesi: bilingual(row.profesi || row.pekerjaan_cocok)
}));
saveJSON('10-dina.json', dinaFinal);

// ============================================
// 11. KARAKTER DASAR (9 Tipe)
// ============================================
console.log('\n🧠 11/33 Karakter Dasar...');
const karakterRaw = readCSV(SOURCE_FILES.karakter_dasar);
const karakterFinal = karakterRaw.map(row => ({
  no: parseInt(row.no || row.id, 10),
  tipe: bilingual(row.tipe || row.nama_karakter),
  ringkasan: bilingual(row.ringkasan || row.deskripsi),
  kekuatan: bilingual(row.kekuatan || row.strength),
  kelemahan: bilingual(row.kelemahan || row.weakness),
  negosiasi: bilingual(row.negosiasi || row.tip_negosiasi),
  sikap: bilingual(row.sikap || row.saran_pengembangan),
  motto: bilingual(row.motto)
}));
saveJSON('11-karakter-dasar.json', karakterFinal);

// ============================================
// 12. PEKERJAAN (35 Weton)
// ============================================
console.log('\n💼 12/33 Pekerjaan Weton...');
const pekerjaanRaw = readCSV(SOURCE_FILES.pekerjaan);
const pekerjaanFinal = pekerjaanRaw.map(row => ({
  dino: toTitle(row.dino_lahir || row.dino),
  pasaran: toTitle(row.pasaran_lahir || row.pasaran),
  pakarti_rejeki: bilingual(row['Pakarti Rejeki'] || row.pakarti_rejeki),
  pakarti_badan: bilingual(row['Pakarti Badan'] || row.pakarti_badan),
  pakaryan: bilingual(row.pakaryan || row.pekerjaan_cocok)
}));
saveJSON('12-pekerjaan-weton.json', pekerjaanFinal);

// ============================================
// 13. PAKARTI REJEKI (3 Tipe)
// ============================================
console.log('\n💰 13/33 Pakarti Rejeki...');
const pakartiRejekiRaw = readCSV(SOURCE_FILES.pakarti_rejeki);
const pakartiRejekiFinal = pakartiRejekiRaw.map(row => ({
  kode: toTitle(row.kode || row.nama),
  arti: bilingual(row.arti || row.tegese)
}));
saveJSON('13-pakarti-rejeki.json', pakartiRejekiFinal);

// ============================================
// 14. PAKARTI BADAN (8 Bagian)
// ============================================
console.log('\n🦴 14/33 Pakarti Badan...');
const pakartiBadanRaw = readCSV(SOURCE_FILES.pakarti_badan);
const pakartiBadanFinal = pakartiBadanRaw.map(row => ({
  kode: toTitle(row.kode || row.bagian),
  arti: bilingual(row.arti || row.tegese)
}));
saveJSON('14-pakarti-badan.json', pakartiBadanFinal);

// ============================================
// 15. PITUNG PERJODOHAN (7 Metode)
// ============================================
console.log('\n💑 15/33 Pitung Perjodohan...');
const marriageRaw = readCSV(SOURCE_FILES.marriage_hasil);
const marriageFinal = {};
marriageRaw.forEach(row => {
  const metode = `metode_${row.metode || row.no_metode}`;
  if (!marriageFinal[metode]) {
    marriageFinal[metode] = { nama: bilingual(`Metode ${row.metode}`), hasil: [] };
  }
  marriageFinal[metode].hasil.push({
    sisa: parseInt(row.sisa, 10),
    nama: bilingual(row.nama),
    arti: bilingual(row.arti),
    status: clean(row.status)
  });
});
saveJSON('15-pitung-perjodohan.json', marriageFinal);

// ============================================
// 16. AKSARA PERJODOHAN (20 Aksara)
// ============================================
console.log('\n🔤 16/33 Aksara Perjodohan...');
const aksaraRaw = readCSV(SOURCE_FILES.marriage_aksara);
const aksaraFinal = aksaraRaw.map(row => ({
  kode: toTitle(row.kode || row.aksara),
  neptu_iv: parseInt(row.iv || row.neptu_iv, 10),
  neptu_vvi: parseInt(row.vvi || row.neptu_vvi, 10)
}));
saveJSON('16-aksara-perjodohan.json', aksaraFinal);

// ============================================
// 17. PETALENGGAHAN (5 Tingkatan)
// ============================================
console.log('\n👑 17/33 Palenggahan...');
const palenggahanRaw = readCSV(SOURCE_FILES.palenggahan);
const palenggahanFinal = palenggahanRaw.map(row => ({
  no: parseInt(row.no || row.id, 10),
  surasa: toTitle(row.surasa),
  arti: bilingual(row.arti || row.tegese)
}));
saveJSON('17-palenggahan.json', palenggahanFinal);

// ============================================
// 18. SIRIKAN ADHEP (Pantangan Arah)
// ============================================
console.log('\n🧭 18/33 Sirikan Adhep...');
const sirikanRaw = readCSV(SOURCE_FILES.sirikan_adhep);
const sirikanFinal = sirikanRaw.map(row => ({
  neptu: (row.neptu || '').split(',').map(n => parseInt(n.trim(), 10)),
  arah: bilingual(row.arah_jawa || row.arah),
  keterangan: bilingual(row.keterangan || row.tegese)
}));
saveJSON('18-sirikan-adhep.json', sirikanFinal);

// ============================================
// 19. SIKLUS PADEWAN (12 Batara)
// ============================================
console.log('\n🔁 19/33 Siklus Padewan...');
const siklusPadewanRaw = readCSV(SOURCE_FILES.siklus_padewan);
const siklusPadewanFinal = siklusPadewanRaw.map(row => ({
  no: parseInt(row.no || row.id, 10),
  nama: bilingual(row.nama || row.batara),
  watak: bilingual(row.watak),
  karier: bilingual(row.karier || row.karir),
  kelemahan: bilingual(row.kelemahan),
  kesehatan: bilingual(row.kesehatan),
  keluarga: bilingual(row.keluarga),
  bahaya: bilingual(row.bahaya),
  solusi: bilingual(row.solusi)
}));
saveJSON('19-siklus-padewan.json', siklusPadewanFinal);

// ============================================
// 20. SIKLUS SHIO (12 Hewan)
// ============================================
console.log('\n🐉 20/33 Siklus Shio...');
const siklusShioRaw = readCSV(SOURCE_FILES.siklus_shio);
const siklusShioFinal = siklusShioRaw.map(row => ({
  no: parseInt(row.no || row.id, 10),
  shio: bilingual(row.shio || row.hewan),
  tegese: bilingual(row.tegese || row.arti)
}));
saveJSON('20-siklus-shio.json', siklusShioFinal);

// ============================================
// 21. PETUNG TETANEN (35 Weton)
// ============================================
console.log('\n🌱 21/33 Petung Tetanen...');
const tetanenRaw = readCSV(SOURCE_FILES.tetanen);
const tetanenFinal = tetanenRaw.map(row => ({
  dino: toTitle(row.dino || row.dino_lahir),
  pasaran: toTitle(row.pasaran || row.pasaran_lahir),
  neptu: parseInt(row.neptu_total || row.neptu, 10),
  kategori: bilingual(row.kang_becik || row.kategori),
  makna: bilingual(row.tegese || row.makna),
  contoh: bilingual(row.contone || row.contoh)
}));
saveJSON('21-petung-tetanen.json', tetanenFinal);

// ============================================
// 22. WUKU PETENGET (Ala/Becik, Nambani, dll)
// ============================================
console.log('\n📚 22/33 Wuku Petenget...');
const wukuAlaBecik = readCSV(SOURCE_FILES.wuku_ala_becik);
const wukuNambani = readCSV(SOURCE_FILES.wuku_nambani);
const wukuPangupajiwa = readCSV(SOURCE_FILES.wuku_pangupajiwa);
const wukuTetanen = readCSV(SOURCE_FILES.wuku_tetanen);

const wukuPetengetFinal = {};
wukuAlaBecik.forEach(row => {
  const nama = toTitle(row.wuku || row.nama_wuku);
  if (!wukuPetengetFinal[nama]) wukuPetengetFinal[nama] = {};
  wukuPetengetFinal[nama].ala_becik = {
    becik: bilingual(row.becik_kanggo || row.becik),
    ala: bilingual(row.ala_kanggo || row.ala)
  };
});
wukuNambani.forEach(row => {
  const nama = toTitle(row.wuku || row.nama_wuku);
  if (!wukuPetengetFinal[nama]) wukuPetengetFinal[nama] = {};
  wukuPetengetFinal[nama].nambani = {
    becik: bilingual(row.becik_kanggo || row.becik),
    ala: bilingual(row.ala_kanggo || row.ala)
  };
});
wukuPangupajiwa.forEach(row => {
  const nama = toTitle(row.wuku || row.nama_wuku);
  if (!wukuPetengetFinal[nama]) wukuPetengetFinal[nama] = {};
  wukuPetengetFinal[nama].pangupajiwa = {
    becik: bilingual(row.becik_kanggo || row.becik),
    ala: bilingual(row.ala_kanggo || row.ala)
  };
});
wukuTetanen.forEach(row => {
  const nama = toTitle(row.wuku || row.nama_wuku);
  if (!wukuPetengetFinal[nama]) wukuPetengetFinal[nama] = {};
  wukuPetengetFinal[nama].tetanen = {
    becik: bilingual(row.becik_kanggo || row.becik),
    ala: bilingual(row.ala_kanggo || row.ala)
  };
});
saveJSON('22-wuku-petenget.json', wukuPetengetFinal);

// ============================================
// 23. IJAB (Pernikahan)
// ============================================
console.log('\n💍 23/33 Petung Ijab...');
const ijabRaw = readJSON(SOURCE_FILES.ijab);
let ijabFinal = {};
if (ijabRaw) {
  ijabFinal = {
    neptu_dina: (ijabRaw.NEPTU_IJAB_DINA || []).map(i => ({ nama: i.dina, neptu: i.neptu_dina_ijab })),
    neptu_pasaran: (ijabRaw.NEPTU_IJAB_PASARAN || []).map(i => ({ nama: i.pasaran, neptu: i.neptu_pasaran_ijab })),
    weton_35: (ijabRaw.IJAB_WETON_35 || []).map(i => ({
      dina: i.dina, pasaran: i.pasaran, neptu: i.neptu_jumlah_ijab,
      surasa: i.surasane_ijab, tegese: bilingual(i.tegese_surasa_ijab), status: i.status_ringkas
    })),
    wuku: (ijabRaw.IJAB_WUKU || []).map(i => ({ wuku: i.wuku, status: i.kanggo_ijab })),
    surasa: (ijabRaw.KAMUS_SURASA_IJAB || []).map(i => ({
      surasa: i.surasane_ijab, arti: bilingual(i.tegese_surasa_ijab), status: i.status_ringkas
    }))
  };
}
saveJSON('23-petung-ijab.json', ijabFinal);

// ============================================
// 24. OMAH (Rumah)
// ============================================
console.log('\n🏠 24/33 Petung Omah...');
const omahRaw = readJSON(SOURCE_FILES.omah);
saveJSON('24-petung-omah.json', omahRaw || {});

// ============================================
// 25. TERNAK, LORO, GEBLAK
// ============================================
console.log('\n🐄 25/33 Petung Ternak...');
const ternakRaw = readJSON(SOURCE_FILES.ternak);
saveJSON('25-petung-ternak.json', ternakRaw || {});

// ============================================
// 26. SASMITHA (Mimpi, Kedut, Alam)
// ============================================
console.log('\n🌠 26/33 Sasmitha...');
const sasmithaRaw = readJSON(SOURCE_FILES.sasmitha);
saveJSON('26-sasmitha.json', sasmithaRaw || {});

// ============================================
// 27. PUSTAKA DONGO
// ============================================
console.log('\n📿 27/33 Pustaka Dongo...');
const pustakaDongoRaw = readJSON(SOURCE_FILES.pustaka_dongo);
saveJSON('27-pustaka-dongo.json', pustakaDongoRaw || {});

// ============================================
// 28. SINENGKER (Kompas Danyang)
// ============================================
console.log('\n🧭 28/33 Sinengker...');
const sinengkerRaw = readJSON(SOURCE_FILES.sinengker);
saveJSON('28-sinengker.json', sinengkerRaw || {});

// ============================================
// 29. KAMUS JAWA
// ============================================
console.log('\n📖 29/33 Kamus Jawa...');
const kamusJawaRaw = readJSON(SOURCE_FILES.kamus_jawa);
saveJSON('29-kamus-jawa.json', kamusJawaRaw || []);

// ============================================
// 30. KAMUS SANSKERTA
// ============================================
console.log('\n🕉️ 30/33 Kamus Sanskerta...');
const kamusSanskertaRaw = readJSON(SOURCE_FILES.kamus_sanskerta);
saveJSON('30-kamus-sanskerta.json', kamusSanskertaRaw || []);

// ============================================
// 31. WAYANG
// ============================================
console.log('\n🎭 31/33 Wayang...');
const wayangRaw = readCSV(SOURCE_FILES.wayang_list);
const wayangFinal = wayangRaw.map(row => ({
  id: clean(row.id),
  nama: bilingual(row.nama || row.name),
  kategori: toTitle(row.kategori),
  watak: bilingual(row.watak),
  kasatriyan: clean(row.kasatriyan),
  pusaka: bilingual(row.pusaka)
}));
saveJSON('31-wayang.json', wayangFinal);

// ============================================
// 32. AKSARA NGLEGENA
// ============================================
console.log('\nꦲ 32/33 Aksara Nglegena...');
const aksaraNglegenaRaw = readCSV(SOURCE_FILES.aksara_nglegena);
const aksaraNglegenaFinal = aksaraNglegenaRaw.map(row => ({
  latin: toTitle(row.latin || row.huruf),
  aksara: clean(row.aksara || row.unicode),
  unicode: clean(row.unicode),
  nama: bilingual(row.nama || row.nama_aksara)
}));
saveJSON('32-aksara-nglegena.json', aksaraNglegenaFinal);

// ============================================
// 33. I18N UI (Lokalisasi Antarmuka)
// ============================================
console.log('\n🌐 33/33 I18N UI...');
const i18nRaw = readCSV(SOURCE_FILES.i18n_ui);
const i18nFinal = {};
i18nRaw.forEach(row => {
  const key = clean(row.key || row.kode);
  if (key) i18nFinal[key] = bilingual(row.id || row.indonesia, row.id || row.indonesia);
});
saveJSON('33-i18n-ui.json', i18nFinal);

// ============================================
// SELESAI!
// ============================================
console.log('\n' + '='.repeat(60));
console.log('🎉 SELESAI! 33 file JSON berhasil dibuat.');
console.log('📁 Lokasi: ' + DIST_DIR);
console.log('='.repeat(60));
console.log('\n💡 LANGKAH SELANJUTNYA:');
console.log('1. Buka folder: ' + DIST_DIR);
console.log('2. Pilih semua file (Ctrl+A)');
console.log('3. Klik kanan → "Compress" / "Send to ZIP"');
console.log('4. File ZIP backup Anda siap!');