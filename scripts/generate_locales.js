/**
 * Script untuk mengekstrak dan membangun src/locales/id.js dan src/locales/jv.js
 * Memastikan 100% konsistensi kunci antara ID dan JV.
 */
import fs from 'fs';
import path from 'path';
import { DICTIONARY } from '../js/ui/i18n.js';

// Ekstra kunci tambahan untuk memastikan 100% cakupan antarmuka
const EXTRA_KEYS = {
  // ─── BERANDA FLOATING GRID MENU CARDS ─────────────────────────────────────
  menu_card_kalender_title: {
    id: 'Kalender Jawa',
    jv: 'Kalendher Jawi'
  },
  menu_card_kalender_desc: {
    id: 'Masehi, Pasaran, Wuku, Dino Gede, dan status Ala/Becik.',
    jv: 'Masehi, Pasaran, Wuku, Dino Gede, lan status Awon/Becik.'
  },
  menu_card_nujum_title: {
    id: 'Nujum Kepribadian',
    jv: 'Nujum Pribadhi'
  },
  menu_card_nujum_desc: {
    id: 'Bincil, Faalakiah 12 Nabi dari nama, Asesoris, & Karakter.',
    jv: 'Bincil, Faalakiah 12 Nabi saking asma, Asesoris, & Watek.'
  },
  menu_card_jodoh_title: {
    id: 'Pitung Perjodohan',
    jv: 'Pétung Jodho'
  },
  menu_card_jodoh_desc: {
    id: 'Kecocokan 7 metode primbon aksara & neptu jodoh.',
    jv: 'Jumbuhaning 7 metode primbon aksara & neptu jodho.'
  },
  menu_card_selametan_title: {
    id: 'Peringatan Wafat',
    jv: 'Pengetan Tilar Donyo'
  },
  menu_card_selametan_desc: {
    id: 'Peringatan 3, 7, 40, 100, Pendak 1-2, dan Nyewu 1000 hari.',
    jv: 'Pengetan 3, 7, 40, 100, Pendhak 1-2, lan Nyèwu 1000 dinten.'
  },
  menu_card_ijab_title: {
    id: 'Petung Ijab (Palakrama)',
    jv: 'Pétung Ijab (Palakrama)'
  },
  menu_card_ijab_desc: {
    id: 'Sistem Neptu Khusus Ijab, babon wuku, surasa weton, dan sasi.',
    jv: 'Sistem Neptu Mirunggan Ijab, babon wuku, surasa weton, lan sasi.'
  },
  menu_card_omah_title: {
    id: 'Petung Omah & Cempuri',
    jv: 'Pétung Griya & Cempuri'
  },
  menu_card_omah_desc: {
    id: 'Bumi, Kerta, Guru (sisa modulo), 9 cempuri pintu, & larangan arah.',
    jv: 'Bumi, Kerta, Guru (sisa modulo), 9 cempuri lawangan, & sirikan arah.'
  },
  menu_card_ternak_ringkas_title: {
    id: 'Petung Memulai Ternak',
    jv: 'Pétung Wiwit Ingon-ingon'
  },
  menu_card_ternak_lengkap_title: {
    id: 'Petung Kehidupan',
    jv: 'Pétung Panguripan'
  },
  menu_card_ternak_ringkas_desc: {
    id: 'Pedoman memulai ternak hewan peliharaan (Gajah, Suku, Watu, Buto).',
    jv: 'Paugeran wiwit ngingu raja-kaya (Gajah, Suku, Watu, Buto).'
  },
  menu_card_ternak_lengkap_desc: {
    id: 'Memulai ternak, jaluran sakit & obat, serta wiradat 40 hari geblak.',
    jv: 'Wiwit ternak, jaluran gerah & tombo, sarta wiradat 40 dinten geblak.'
  },
  menu_card_sasmitha_ringkas_title: {
    id: 'Sasmitha Mimpi & Kedutan',
    jv: 'Sasmitha Impen & Kedut'
  },
  menu_card_sasmitha_lengkap_title: {
    id: 'Sasmitha (Tanda Alam & Tubuh)',
    jv: 'Sasmitha (Pratandha Alam & Badan)'
  },
  menu_card_sasmitha_ringkas_desc: {
    id: 'Tafsir 99 mimpi & pertanda 74 kedutan bagian tubuh.',
    jv: 'Tapsir 99 impen & pratandha 74 kedutan perangan badan.'
  },
  menu_card_sasmitha_lengkap_desc: {
    id: 'Pengetahuan mimpi, kedutan, gerhana, gempa bumi sasi, & cahaya langit.',
    jv: 'Kawruh impen, kedut, grahana, lindhu sasi, & teja 7 puser arah.'
  },
  menu_card_aksara_title: {
    id: 'Studio Aksara Jawa',
    jv: 'Papan Aksara Jawi'
  },
  menu_card_aksara_desc: {
    id: 'Transliterasi otomatis Latin ke Hanacaraka & kanvas tulis.',
    jv: 'Transliterasi otomatis Latin dhateng Hanacaraka & kanvas nulis.'
  },
  menu_card_wayang_title: {
    id: 'Panggung Kelir Wayang',
    jv: 'Panggung Kelir Wayang'
  },
  menu_card_wayang_desc: {
    id: 'Simulasi pementasan wayang dengan blencong & kepyak.',
    jv: 'Pentas wayang kulit mawi blencong & kepyak.'
  },
  menu_card_gamelan_title: {
    id: 'Gamelan Maya',
    jv: 'Gamelan Jawa'
  },
  menu_card_gamelan_desc: {
    id: 'Tabuh Saron, Bonang, Kempul & Gong (Slendro & Pelog).',
    jv: 'Ungeling Saron, Bonang, Kempul & Gong (Slendro & Pelog).'
  },
  menu_card_pitutur_title: {
    id: 'Pitutur & Kuis Wawasan',
    jv: 'Piwulang & Cangkriman Kawruh'
  },
  menu_card_pitutur_desc: {
    id: 'Falsafah hidup dan kuis wawasan budaya bergelar.',
    jv: 'Falsafah gesang lan cangkriman kawruh budaya mawi gelar.'
  },
  menu_card_tumpeng_title: {
    id: 'Tumpeng Tombak Rojo',
    jv: 'Tumpeng Tombak Rojo'
  },
  menu_card_tumpeng_desc: {
    id: 'Filosofi 5 warna, peta perlengkapan sesaji tolak bala, dan doa keselamatan.',
    jv: 'Filosofi 5 werna, ubarampe sesaji tolak bala, lan donga karaharjan.'
  },

  // ─── HERO TODAY CARD LABELS & AKORDEON ────────────────────────────────────
  hero_pitutur_header: {
    id: 'Pitutur Luhur Hari Ini',
    jv: 'Piwulang Luhur Dinten Punika'
  },
  hero_pitutur_source: {
    id: 'Falsafah Luhur Jawa',
    jv: 'Falsafah Luhur Jawi'
  },
  hero_pranata_header: {
    id: 'Pranata Mangsa',
    jv: 'Pranata Mangsa'
  },
  hero_kala_header: {
    id: 'Dununge Kala (Arah)',
    jv: 'Dununge Kala (Panggonan)'
  },
  hero_kala_sub: {
    id: 'Arah pantangan perjalanan wuku',
    jv: 'Arah sirikan lumampahing wuku'
  },
  hero_tetanen_header: {
    id: 'Petung Tetanen & Palawija',
    jv: 'Pétung Tetanèn & Palawija'
  },
  hero_status_gede: {
    id: 'Hari Besar (Sakral)',
    jv: 'Dino Gede (Sakral)'
  },
  hero_status_becik: {
    id: 'Hari Baik (Rahayu)',
    jv: 'Dina Becik (Rahayu)'
  },
  hero_status_ala: {
    id: 'Hari Pantangan (Waspada)',
    jv: 'Dina Awon (Prayitna)'
  },
  hero_accordion_open: {
    id: 'Buka Rincian Hari Ini & Pitutur',
    jv: 'Bikak Rincian Dinten Punika & Piwulang'
  },
  hero_accordion_close: {
    id: 'Tutup Rincian Hari Ini',
    jv: 'Tutup Rincian Dinten Punika'
  },
  hero_tetanen_becik: {
    id: 'Yang dianjurkan:',
    jv: 'Kang becik:'
  },

  // ─── PETUNG OMAH ──────────────────────────────────────────────────────────
  omah_badge: {
    id: 'Kearifan Arsitektur Tradisional',
    jv: 'Kawruh Arsitektur Tradhisional'
  },
  omah_label_tgl: {
    id: 'Tanggal Mendirikan / Pindahan Rumah',
    jv: 'Tanggal Ngedekake / Boyongan'
  },
  omah_tgl_hint: {
    id: 'Otomatis sinkron Hari, Pasaran, & Bulan Jawa.',
    jv: 'Otomatis sinkron Dina, Pasaran, & Sasi Jawi.'
  },
  omah_label_dina: {
    id: 'Dina',
    jv: 'Dina'
  },
  omah_label_pasaran: {
    id: 'Pasaran',
    jv: 'Pasaran'
  },
  omah_label_arah_lawang: {
    id: 'Arah Hadap Pintu',
    jv: 'Madhep Lawang (Arah)'
  },
  omah_label_params: {
    id: 'Parameter Cempuri, Pindahan & Tanah:',
    jv: 'Paramèter Cempuri, Boyongan & Siti:'
  },
  omah_label_nomor_lawang: {
    id: 'Posisi Pintu (1-9)',
    jv: 'Posisi Lawang (1-9)'
  },
  omah_label_arah_pindah: {
    id: 'Arah Pindah Rumah',
    jv: 'Arah Pindah / Boyongan'
  },
  omah_label_sasi: {
    id: 'Bulan Jawa',
    jv: 'Sasi Jawi'
  },
  omah_label_mangsa: {
    id: 'Pranata Mangsa',
    jv: 'Pranata Mangsa'
  },
  omah_label_lemah: {
    id: 'Karakteristik Tanah',
    jv: 'Ciri Lemah / Siti'
  },
  omah_btn_hitung: {
    id: 'Petung Rumah (Buka Ketentuan)',
    jv: 'Pétung Griya (Babar Padunungan)'
  },
  omah_search_title: {
    id: 'Pencarian Hari Baik Interaktif',
    jv: 'Pados Dinten Sae (Interaktif)'
  },
  omah_search_desc: {
    id: 'Cari tanggal, bulan, dan tahun yang sesuai untuk mendirikan rumah atau boyongan berdasarkan formula Set A, B, dan C.',
    jv: 'Pados tanggal, wulan, lan warsa ingkang trep kanggé ngedekake utawi boyongan adhedhasar formula Set A, B, lan C.'
  },
  omah_search_bulan: {
    id: 'Bulan Masehi',
    jv: 'Wulan Masehi'
  },
  omah_search_tahun: {
    id: 'Tahun Masehi',
    jv: 'Taun Masehi'
  },
  omah_search_filter_badge: {
    id: 'Saring Kalender & Neptu',
    jv: 'Filter Kalendher & Neptu'
  },

  // ─── PETUNG TERNAK & KEHIDUPAN ────────────────────────────────────────────
  ternak_badge_ringkas: {
    id: 'Pedoman Memulai Ternak',
    jv: 'Paugeran Wiwit Ngingu'
  },
  ternak_badge_lengkap: {
    id: 'Petung Kehidupan Sehari-hari',
    jv: 'Pétung Panguripan Padintenan'
  },
  ternak_label_tgl: {
    id: 'Tanggal Peristiwa / Memulai',
    jv: 'Tanggal Kedadosan / Wiwitan'
  },
  ternak_tgl_hint: {
    id: 'Otomatis mendeteksi Hari, Pasaran, dan Neptu.',
    jv: 'Otomatis ndeteksi Dina, Pasaran, lan Neptu.'
  },
  ternak_search_title: {
    id: 'Pencarian Kecocokan Hari (Interaktif)',
    jv: 'Pados Kecocokan Dinten (Interaktif)'
  },
  ternak_search_desc: {
    id: 'Cari tanggal, bulan, dan tahun yang tepat untuk Memulai Ternak, Penyakit, atau Geblak berdasarkan formula 35 weton.',
    jv: 'Pados tanggal, wulan, lan warsa ingkang trep kanggé Wiwit Ternak, Jalaran Loro, utawi Geblak adhedhasar formula weton 35.'
  },
  ternak_search_bidang: {
    id: 'Bidang Petung',
    jv: 'Bidhang Pétung'
  },
  ternak_search_kategori: {
    id: 'Kategori / Kriteria',
    jv: 'Kategori / Paugeran'
  },
  ternak_search_btn: {
    id: 'Cari Hari',
    jv: 'Pados Dinten'
  },
  ternak_opt_ternak: {
    id: 'Memulai Ternak',
    jv: 'Wiwit Ingon-ingon'
  },
  ternak_opt_loro: {
    id: 'Penyebab Sakit',
    jv: 'Jalaran Loro'
  },
  ternak_opt_geblak: {
    id: 'Petung Hari Wafat',
    jv: 'Pétung Geblak'
  },
  ternak_opt_kat_becik: {
    id: 'Hari Baik: Gajah & Suku',
    jv: 'Dina Becik: Gajah & Suku'
  },
  ternak_opt_kat_gajah: {
    id: 'Kategori Gajah (Agung / Luhur)',
    jv: 'Kategori Gajah (Agung / Luhur)'
  },
  ternak_opt_kat_suku: {
    id: 'Kategori Suku (Kaya / Mulia)',
    jv: 'Kategori Suku (Sugih / Mulyo)'
  },
  ternak_opt_kat_watu: {
    id: 'Kategori Watu (Netral / Prihatin)',
    jv: 'Kategori Watu (Netral / Prihatin)'
  },
  ternak_opt_kat_buto: {
    id: 'Kategori Buto (Waspada)',
    jv: 'Kategori Buto (Waspada)'
  },
  ternak_opt_kat_all: {
    id: 'Semua Kategori',
    jv: 'Sedaya Kategori'
  },

  // ─── SASMITHA ─────────────────────────────────────────────────────────────
  sasmitha_badge_ringkas: {
    id: 'Pedoman Pengetahuan Tradisi',
    jv: 'Pitedah Kawruh Adat'
  },
  sasmitha_badge_lengkap: {
    id: 'Sasmitha Tanda Alam & Tubuh',
    jv: 'Sasmitha Pratandha Alam & Raga'
  },

  // ─── STUDIO AKSARA JAWA ───────────────────────────────────────────────────
  aksara_sejarah_badge: {
    id: 'Asal-Usul Carakan Jawa',
    jv: 'Mulabuka Carakan Jawi'
  },
  aksara_sejarah_legend: {
    id: 'Legenda Aji Saka, Dora & Sembada',
    jv: 'Legenda Aji Saka, Dora & Sembada'
  },
  aksara_sejarah_title: {
    id: 'Sejarah Terjadinya 20 Aksara Jawa (Hanacaraka)',
    jv: 'Sejarah Dumadine 20 Aksara Jawa (Hanacaraka)'
  },
  aksara_input_title: {
    id: 'Ketik Teks Latin (Transliterasi Otomatis)',
    jv: 'Ketik Teks Latin (Transliterasi Otomatis)'
  },
  aksara_input_clear: {
    id: 'Hapus Latin',
    jv: 'Busak Latin'
  },
  aksara_input_placeholder: {
    id: 'Ketik teks bahasa Jawa atau Indonesia di sini, contoh: sugeng rawuh wonten jagad jawa...',
    jv: 'Ketik basa Jawa latin ing kene, tuladha: sugeng rawuh wonten jagad jawa...'
  },
  aksara_sample_label: {
    id: 'Contoh Cepat:',
    jv: 'Tuladha Cepet:'
  },
  aksara_output_title: {
    id: 'Hasil Transliterasi & Editor Aksara Jawa',
    jv: 'Asil Transliterasi & Editor Aksara Jawa'
  },
  aksara_output_clear: {
    id: 'Bersihkan',
    jv: 'Resiki'
  },
  aksara_output_copy: {
    id: 'Salin Aksara',
    jv: 'Turun Aksara'
  },
  aksara_output_standard: {
    id: 'Kaidah Kongres Bahasa Jawa & Sastra.org',
    jv: 'Kaidah Kongres Basa Jawa & Sastra.org'
  },
  aksara_keyboard_title: {
    id: 'Papan Ketik Virtual Aksara Jawa',
    jv: 'Papan Ketik Interaktif Aksara Jawa'
  },
  aksara_keyboard_desc: {
    id: 'Klik aksara, pasangan, atau sandhangan untuk menyusun teks secara manual langsung di posisi kursor.',
    jv: 'Klik aksara, pasangan, utawa sandhangan kanggo nyusun teks kanthi manual langsung ing posisi kursor.'
  },

  // ─── GAMELAN MAYA ─────────────────────────────────────────────────────────
  gamelan_badge_music: {
    id: 'Seni Karawitan & Sastra Tembang',
    jv: 'Seni Karawitan & Sastra Tembang'
  },
  gamelan_badge_macapat: {
    id: '11 Tembang Macapat Jawa',
    jv: '11 Tembang Macapat Jawi'
  },
  gamelan_intro_title: {
    id: 'Pengetahuan Dasar Karawitan',
    jv: 'Kawruh Dhasar Karawitan'
  },
  gamelan_macapat_title: {
    id: '11 Tembang Macapat & Aturan',
    jv: '11 Tembang Macapat & Paugeran'
  },
  gamelan_macapat_desc: {
    id: 'Filosofi perjalanan hidup manusia dari benih hingga wafat',
    jv: 'Filosofi lumakuning urip manungsa wiwit wiji nganti puput (pati)'
  },

  // ─── PITUTUR & KUIS ───────────────────────────────────────────────────────
  pitutur_btn_today: {
    id: 'Pitutur Hari Ini',
    jv: 'Piwulang Dinten Punika'
  },
  pitutur_btn_random: {
    id: 'Ganti Pitutur (Acak)',
    jv: 'Gantos Piwulang (Acak)'
  },
  pitutur_btn_copy: {
    id: 'Salin Pitutur',
    jv: 'Turun Piwulang'
  },
  pitutur_btn_share_wa: {
    id: 'Bagikan WhatsApp',
    jv: 'Bagekaken WhatsApp'
  },
  pitutur_quiz_title: {
    id: 'Kuis Wawasan Kebudayaan Jawa',
    jv: 'Kuis Asah Kawruh Kabudayan Jawi'
  },
  pitutur_quiz_desc: {
    id: 'Uji seberapa dalam wawasanmu tentang seni, tradisi, dan sastra Jawa.',
    jv: 'Uji sepira jero kawruh panjenengan bab seni, tradhisi, lan sastra Jawi.'
  },
  pitutur_quiz_soal: {
    id: 'Soal:',
    jv: 'Pitakon:'
  },
  pitutur_quiz_skor: {
    id: 'Skor:',
    jv: 'Biji:'
  }
};

// Gabungkan kamus yang ada dengan ekstra
const allKeys = { ...DICTIONARY, ...EXTRA_KEYS };

console.log(`Total keys to process: ${Object.keys(allKeys).length}`);

// Bangun objek id dan jv
const idDict = {};
const jvDict = {};

for (const [key, val] of Object.entries(allKeys)) {
  idDict[key] = val.id !== undefined ? val.id : key;
  jvDict[key] = val.jv !== undefined ? val.jv : (val.id !== undefined ? val.id : key);
}

// Tulis src/locales/id.js
const idContent = `/**
 * Jagad Jawa — Kamus Bahasa Indonesia (id)
 * Standar: 100% Bahasa Indonesia baku dengan pelestarian istilah budaya baku (weton, neptu, wuku, pasaran, pranata mangsa, dll).
 */
export const id = ${JSON.stringify(idDict, null, 2)};

export default id;
`;

// Tulis src/locales/jv.js
const jvContent = `/**
 * Jagad Jawa — Bausastra / Kamus Basa Jawi (jv)
 * Standar: 100% Basa Jawi ragam Krama/Madya berbobot budaya tradisional.
 */
export const jv = ${JSON.stringify(jvDict, null, 2)};

export default jv;
`;

const idPath = path.resolve('src/locales/id.js');
const jvPath = path.resolve('src/locales/jv.js');

fs.writeFileSync(idPath, idContent, 'utf8');
fs.writeFileSync(jvPath, jvContent, 'utf8');

console.log(`Berhasil menulis ${idPath} (${Object.keys(idDict).length} keys)`);
console.log(`Berhasil menulis ${jvPath} (${Object.keys(jvDict).length} keys)`);
