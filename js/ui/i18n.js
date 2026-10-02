/**
 * Jagad Jawa — Modul UI: i18n (Internationalization / Dwibahasa)
 * Branch: jawa-v11
 *
 * Tanggung Jawab:
 * 1. Mengatur mode dwibahasa antarmuka (Bahasa Indonesia / 'id' & Basa Jawi / 'jv').
 * 2. Menyimpan preferensi bahasa pengguna di localStorage ('jagad_jawa_lang').
 * 3. ATURAN KETAT MENU UTAMA:
 *    Bagian Menu Navigasi Utama (NAV_DICTIONARY) SELALU dipertahankan tetap dalam
 *    Bahasa Indonesia ('id') meskipun aplikasi sedang berada dalam Mode JV,
 *    agar pengguna tidak bingung saat berpindah menu.
 * 4. KONTEN & DESKRIPSI (CONTENT_DICTIONARY):
 *    - Mode ID: Bahasa Indonesia penuh yang formal, jelas, dan baku.
 *    - Mode JV: Basa Jawi otentik yang luwes, kaya rasa, dan berbobot budaya.
 * 5. Menjaga integritas data matematis:
 *    Semua key kalkulasi (dino, pas, wuku, neptu, formula JDN) 100% tidak diubah.
 */

const STORAGE_KEY = 'jagad_jawa_lang';

/**
 * ─── 1. NAV_DICTIONARY (MENU NAVIGASI UTAMA) ─────────────────────────────────
 * Seluruh string menu navigasi utama aplikasi.
 * Catatan: Objek tetap menyediakan properti .id dan .jv demi backward compatibility
 * dan pengujian unit, namun saat dirender ke DOM di applyLanguage() atau melalui
 * lookup navigasi, label menu ini DIKUNCI tetap dalam Bahasa Indonesia ('id').
 */
export const NAV_DICTIONARY = {
  // Brand & Header
  brand_subtitle: {
    id: 'Portal Budaya Nusantara',
    jv: 'Portal Budaya Nusantara'
  },
  lang_toggle_badge: {
    id: 'ID',
    jv: 'JV'
  },
  lang_toggle_title: {
    id: 'Ganti Bahasa (Indonesia / Jawa)',
    jv: 'Gantos Basa (Indonesia / Jawi)'
  },

  // Menu Utama & Dropdown
  nav_beranda: {
    id: 'Beranda',
    jv: 'Pambuka'
  },
  nav_wektu: {
    id: 'Waktu & Penanggalan',
    jv: 'Wektu & Penanggalan'
  },
  nav_kalender: {
    id: 'Kalender Jawa',
    jv: 'Kalendher Jawi'
  },
  nav_kalender_sub: {
    id: 'Pasaran, Dino Ala/Becik & Weton',
    jv: 'Pasaran, Dino Ala/Becik & Weton'
  },
  nav_konversi: {
    id: 'Konversi Tanggal',
    jv: 'Komersi Surya Jawi'
  },
  nav_konversi_sub: {
    id: 'Masehi ke Jawa & Pranata Mangsa',
    jv: 'Masehi dhateng Jawi & Pranata Mangsa'
  },
  nav_nujum: {
    id: 'Nujum & Primbon',
    jv: 'Nujum & Primbon'
  },
  nav_nujum_pribadi: {
    id: 'Nujum Pribadi',
    jv: 'Nujum Pribadhi'
  },
  nav_nujum_sub: {
    id: 'Watak Bincil, Faalakiah, & Shio',
    jv: 'Watek Bincil, Faalakiah, & Shio'
  },
  nav_jodoh: {
    id: 'Perjodohan (Pitung)',
    jv: 'Pitung Salaki Rabi'
  },
  nav_jodoh_sub: {
    id: 'Petung Jodoh Salaki Rabi & Neptu',
    jv: 'Petung Jodho Salaki Rabi & Neptu'
  },
  nav_selametan: {
    id: 'Peringatan Wafat',
    jv: 'Pengetan Tilar Donyo'
  },
  nav_selametan_sub: {
    id: 'Selametan Geblak hingga Nyewu',
    jv: 'Selametan Geblak dumugi Nyewu'
  },
  nav_ijab: {
    id: 'Petung Ijab (Palakrama)',
    jv: 'Petung Ijab (Palakrama)'
  },
  nav_ijab_sub: {
    id: 'Neptu Khusus, Wuku, & Surasa',
    jv: 'Neptu Mirunggan, Wuku, & Surasa'
  },
  nav_omah: {
    id: 'Petung Omah & Cempuri',
    jv: 'Petung Griya & Cempuri'
  },
  nav_omah_sub: {
    id: 'Pembangunan, Boyongan, & Lawang',
    jv: 'Pambangunan, Boyongan, & Lawangan'
  },
  nav_ternak: {
    id: 'Petung Kehidupan',
    jv: 'Petung Panguripan'
  },
  nav_ternak_sub: {
    id: 'Ternak, Loro, & Geblak',
    jv: 'Ingon-ingon, Gerah, & Geblak'
  },
  nav_sasmitha: {
    id: 'Sasmitha (Tanda Alam)',
    jv: 'Sasmitha (Pratandha Alam)'
  },
  nav_sasmitha_sub: {
    id: 'Impen, Kedut, Gerhana, Lindu',
    jv: 'Impen, Kedut, Grahana, Lindhu'
  },
  nav_budaya: {
    id: 'Seni & Budaya',
    jv: 'Seni & Kabudayan'
  },
  nav_wuku: {
    id: 'Ensiklopedia 30 Wuku',
    jv: 'Pawukon 30 Wuku'
  },
  nav_wuku_sub: {
    id: 'Pawukon Jawa: Sinta hingga Watugunung',
    jv: 'Pawukon Jawi: Sinta dumugi Watugunung'
  },
  nav_tripurusa: {
    id: 'Telur Jagad (Tripurusa)',
    jv: 'Endhog Wisesa (Tripurusa)'
  },
  nav_tripurusa_sub: {
    id: 'Mitologi Antaga, Ismaya, Manikmaya',
    jv: 'Mitologi Antaga, Ismaya, Manikmaya'
  },
  nav_ensiklo_budaya: {
    id: 'Ensiklopedia Budaya',
    jv: 'Kawruh Kabudayan'
  },
  nav_ensiklo_budaya_sub: {
    id: '6 Bincil, Shio, Zodiak & Neptu',
    jv: '6 Bincil, Shio, Zodiak & Neptu'
  },
  nav_mitologi: {
    id: 'Mitologi Nusantara',
    jv: 'Mitologi Nuswantara'
  },
  nav_mitologi_sub: {
    id: 'Asal-Usul Wuku, Pasaran & Cerita Kuno',
    jv: 'Mulabuka Wuku, Pasaran & Cariyos Kuno'
  },
  nav_gamelan: {
    id: 'Gamelan Maya',
    jv: 'Gamelan Jawa'
  },
  nav_gamelan_sub: {
    id: 'Gamelan Maya Pelog & Slendro',
    jv: 'Gamelan Maya Pelog & Slendro'
  },
  nav_aksara: {
    id: 'Studio Aksara Jawa',
    jv: 'Papan Aksara Jawa'
  },
  nav_aksara_sub: {
    id: 'Papan Ketik & Transliterasi Aksara',
    jv: 'Papan Ketik & Transliterasi Aksara'
  },
  nav_wayang: {
    id: 'Panggung Kelir Wayang',
    jv: 'Panggung Kelir Wayang'
  },
  nav_wayang_sub: {
    id: 'Simulasi Wayang Kulit Interaktif',
    jv: 'Pentas Wayang Kulit Interaktif'
  },
  nav_pitutur: {
    id: 'Pitutur Luhur & Kuis',
    jv: 'Piwulang Luhur & Cangkriman'
  },
  nav_pitutur_sub: {
    id: 'Falsafah Luhur & Uji Wawasan',
    jv: 'Falsafah Luhur & Uji Kawruh'
  },
  nav_pustaka: {
    id: 'Pustaka Digital',
    jv: 'Pustaka Jawa'
  },
  nav_pustaka_sub: {
    id: 'Naskah Kuno, Kamus & Usada',
    jv: 'Serat Kuno, Bausastra & Usada'
  },
  nav_sinengker: {
    id: 'Pustaka Sinengker',
    jv: 'Pustaka Sinengker'
  },
  nav_sinengker_sub: {
    id: 'Kompas Danyang & Aji Wingit',
    jv: 'Kompas Danyang & Aji Wingit'
  }
};

/**
 * ─── 2. CONTENT_DICTIONARY (KONTEN, DESKRIPSI, TOOLBAR, & TOMBOL AKSI) ──────
 * Seluruh string antarmuka halaman yang merespons toggle bahasa:
 * - Mode ID: Bahasa Indonesia penuh.
 * - Mode JV: Basa Jawi otentik.
 */
export const CONTENT_DICTIONARY = {
  // Beranda & Hero Section
  hero_badge: {
    id: 'Warisan Adiluhung',
    jv: 'Warisan Adiluhung'
  },
  hero_title: {
    id: 'MENYELAMI KEARIFAN LOKAL',
    jv: 'NYELAMI KAWRUH ADILUHUNG'
  },
  hero_desc: {
    id: 'Menjelajahi Kebudayaan Luhur Nusantara dalam ruang kosmik berestetika adiluhung — komputasi kalender Jawa, primbon petungan, studio aksara, kelir wayang, dan alunan gamelan.',
    jv: 'Njlajah Kabudayan Luhur Nuswantara ing papan kosmis éndah adiluhung — pètungan kalendher Jawi, primbon petung, papan aksara, kelir wayang, lan ungeling gamelan.'
  },
  hero_banner_tag: {
    id: 'Portal Budaya Terpadu · Warisan Luhur Nusantara',
    jv: 'Gapura Budaya Manunggal · Warisan Luhur Nuswantara'
  },
  card_stories_tag: {
    id: 'CERITA',
    jv: 'CARIYOS'
  },
  card_stories_title: {
    id: 'Jelajah Cerita',
    jv: 'Cariyos Leluhur'
  },
  card_stories_desc: {
    id: 'Falsafah hidup, pitutur luhur para leluhur Jawa, serat piwulang, serta panggung kelir wayang purwa.',
    jv: 'Falsafah gesang, piwulang luhur para leluhur Jawi, serat piwulang, sarta panggung kelir wayang purwa.'
  },
  card_stories_action: {
    id: 'Buka Falsafah',
    jv: 'Bikak Falsafah'
  },
  card_archive_tag: {
    id: 'ARSIP',
    jv: 'PUSTAKA'
  },
  card_archive_title: {
    id: 'Arsip Budaya',
    jv: 'Pustaka Budaya'
  },
  card_archive_desc: {
    id: 'Arsip komputasi kalender Jawa, siklus Pranata Mangsa, nujum weton kepribadian, serta petung perjodohan.',
    jv: 'Pustaka komputasi kalendher Jawi, siklus Pranata Mangsa, nujum weton pribadhi, sarta petung perjodohan.'
  },
  card_archive_action: {
    id: 'Buka Arsip',
    jv: 'Bikak Pustaka'
  },
  card_community_tag: {
    id: 'KOMUNITAS',
    jv: 'BEBRAYAN'
  },
  card_community_title: {
    id: 'Pawiyatan Komunitas',
    jv: 'Pawiyatan Bebrayan'
  },
  card_community_desc: {
    id: 'Pembelajaran gamelan maya interaktif, studio transliterasi aksara Hanacaraka, dan ruang pengetahuan budaya.',
    jv: 'Pasinaon gamelan maya interaktif, papan transliterasi aksara Hanacaraka, lan papan kawruh kabudayan.'
  },
  card_community_action: {
    id: 'Masuk Pawiyatan',
    jv: 'Mlebet Pawiyatan'
  },

  // Tombol & Aksi Umum
  btn_back: {
    id: '← Kembali',
    jv: '← Wangsul'
  },
  btn_back_home: {
    id: '← Kembali ke Beranda',
    jv: '← Wangsul dhateng Pambuka'
  },
  btn_close: {
    id: 'Tutup',
    jv: 'Tutup'
  },
  btn_share_weton: {
    id: 'Bagikan Weton',
    jv: 'Andum Weton'
  },
  btn_save_note: {
    id: 'Simpan Catatan',
    jv: 'Simpen Tandha'
  },
  btn_copy: {
    id: 'Salin',
    jv: 'Turun'
  },
  btn_print: {
    id: 'Cetak Laporan',
    jv: 'Cithak Laporan'
  },
  btn_download: {
    id: 'Unduh',
    jv: 'Undhuh'
  },
  btn_download_png: {
    id: 'Unduh Gambar (PNG)',
    jv: 'Undhuh Gambar (PNG)'
  },
  btn_download_pdf: {
    id: 'Ekspor PDF',
    jv: 'Cithak PDF'
  },
  btn_calculate: {
    id: 'Hitung',
    jv: 'Pétung'
  },
  btn_reset: {
    id: 'Atur Ulang',
    jv: 'Wangsulaken'
  },
  btn_reset_today: {
    id: 'Hari Ini',
    jv: 'Dinten Punika'
  },
  btn_search: {
    id: 'Cari',
    jv: 'Padosi'
  },
  btn_see_more: {
    id: 'Lihat Lagi',
    jv: 'Pirsani Malih'
  },
  btn_dismiss: {
    id: 'Tutup Hari Ini',
    jv: 'Tutup Dinten Punika'
  },

  // Kalender Toolbar, Filter, & Hint
  cal_header_title: {
    id: 'Kalender Jawa · Pranata Mangsa',
    jv: 'Kalendher Jawi · Pranata Mangsa'
  },
  cal_header_subtitle: {
    id: 'Dihitung otomatis berbasis siklus Pasaran (5), Wuku (210), dan Tahun Jawa/Hijriah.',
    jv: 'Kaitung otomatis linambaran siklus Pasaran (5), Wuku (210), lan Taun Jawi/Hijriyah.'
  },
  cal_saring_label: {
    id: 'Saring Hari:',
    jv: 'Saring Dina:'
  },
  cal_filter_all: {
    id: 'Semua Hari',
    jv: 'Sedaya Dina'
  },
  cal_filter_ijo: {
    id: 'Hari Baik (Becik)',
    jv: 'Dino Ijo (Becik)'
  },
  cal_filter_gede: {
    id: 'Hari Besar (Dino Gede)',
    jv: 'Dino Gede'
  },
  cal_filter_bookmark: {
    id: 'Tersimpan (Bookmark)',
    jv: 'Ditandhai (Bookmark)'
  },
  cal_btn_print: {
    id: 'Cetak Laporan',
    jv: 'Cithak Laporan'
  },
  cal_btn_download: {
    id: 'Unduh Gambar (PNG)',
    jv: 'Undhuh Gambar (PNG)'
  },
  cal_mode_grid: {
    id: 'Mode Tabel (Grid)',
    jv: 'Modhe Tabel (Grid)'
  },
  cal_mode_list: {
    id: 'Mode List Minggu',
    jv: 'Modhe List Pekan'
  },
  cal_label_bulan: {
    id: 'Pilih Bulan:',
    jv: 'Pilih Sasi:'
  },
  cal_label_tahun: {
    id: 'Tahun Masehi:',
    jv: 'Taun Masehi:'
  },
  cal_click_hint: {
    id: '*Klik kotak tanggal untuk rincian lengkap, tanda catatan, & bagikan weton',
    jv: '*Klik kothak tanggal kanggé rincian jangkep, tandha cathetan, & andum weton'
  },
  cal_wuku_ngisor_hint: {
    id: 'Nomor 4, 14, 24 — kala di bawah, jangan menuju arah tempat wuku!',
    jv: 'Nomor 4, 14, 24 — kala ono ngisor, ojo marani dununge wuku!'
  },

  // Detail Modal Kalender
  modal_dino_gede_title: {
    id: 'HARI BESAR TRADISI',
    jv: 'DINO GEDE'
  },
  modal_dino_gede_desc: {
    id: 'Hari penting dan sakral dalam perhitungan pawukon & penanggalan Jawa.',
    jv: 'Dina wigati lan sakral ing petungan pawukon & penanggalan Jawa.'
  },
  modal_dino_lumrah_title: {
    id: 'HARI BIASA',
    jv: 'DINA LUMRAH'
  },
  modal_dino_lumrah_desc: {
    id: 'Tidak termasuk peringatan Hari Besar khusus.',
    jv: 'Boten klebet pengetan Dino Gede khusus.'
  },
  modal_status_ala_title: {
    id: 'STATUS: HARI BURUK / PANTANGAN',
    jv: 'STATUS: DINA AWON / NAHAS'
  },
  modal_status_ala_desc: {
    id: 'Hari yang dihindari untuk mendirikan rumah, pernikahan, atau bepergian jauh.',
    jv: 'Dina awon tumrap adeg griya, mantu, utawi lelungan tebih.'
  },
  modal_status_becik_title: {
    id: 'STATUS: HARI BAIK / RAHAYU',
    jv: 'STATUS: DINA BECIK / RAHAYU'
  },
  modal_status_becik_desc: {
    id: 'Hari baik untuk berbagai hajat, bepergian, dan memulai pekerjaan.',
    jv: 'Dina becik kanggé maneka warni hajat, lelungan, lan pakaryan.'
  },

  // Sapa Dina Card
  sapa_dina_title: {
    id: 'Sapa Dina — Ringkasan Harian',
    jv: 'Sapa Dina — Ringkesan Padintenan'
  },
  sapa_dina_weton_title: {
    id: 'Weton Pasaran Hari Ini',
    jv: 'Weton Pasaran Dinten Punika'
  },
  sapa_dina_neptu_title: {
    id: 'Perhitungan Neptu',
    jv: 'Pétungan Neptu'
  },
  sapa_dina_status_ijo: {
    id: 'Hari Baik (Rahayu)',
    jv: 'Dina Becik (Rahayu)'
  },
  sapa_dina_status_ala: {
    id: 'Hari Pantangan (Kurang Baik)',
    jv: 'Dina Awon (Sirikan)'
  },
  sapa_dina_status_gede: {
    id: 'Hari Besar Tradisi',
    jv: 'Dina Ageng Tradhisi'
  },
  sapa_dina_pitutur_title: {
    id: 'Falsafah & Nasihat Bijak Harian',
    jv: 'Falsafah & Piwulang Luhur Padintenan'
  },
  sapa_dina_tetanen_title: {
    id: 'Pedoman Bercocok Tanam & Palawija',
    jv: 'Pituduh Tetanèn & Palawija'
  },
  sapa_dina_pranata_title: {
    id: 'Kosmologi Pranata Mangsa',
    jv: 'Kosmologi Pranata Mangsa'
  },

  // Judul & Deskripsi Modul Tab
  tab_nujum_title: {
    id: 'Nujum Kepribadian & Primbon',
    jv: 'Nujum Pribadhi & Kawruh Primbon'
  },
  tab_nujum_desc: {
    id: 'Watak 6 dimensi Bincil, zodiak pranata, shio elemen, watak hari, dan ramalan falakiah.',
    jv: 'Watek 6 dhimènsi Bincil, zodiak pranata, shio élèmèn, watek dinten, lan jangka falakiah.'
  },
  tab_jodoh_title: {
    id: 'Petung Perjodohan (Pitung Jawa)',
    jv: 'Pétung Jodho Salaki Rabi'
  },
  tab_jodoh_desc: {
    id: 'Kesesuaian pernikahan berdasarkan neptu, babon wuku, aksara lintang, dan sisa modulo 4/5/7/8.',
    jv: 'Pangiklasaning jodho salaki rabi linambaran neptu, babon wuku, aksara lintang, lan sisa modulo 4/5/7/8.'
  },
  tab_selametan_title: {
    id: 'Peringatan Wafat (Selametan)',
    jv: 'Pengetan Tilar Donyo (Slametan)'
  },
  tab_selametan_desc: {
    id: 'Perhitungan hari geblak, 3 hari, 7 hari, 40 hari, 100 hari, pendak 1, pendak 2, hingga nyewu (1000 hari).',
    jv: 'Pétungan dinten geblak, 3 dinten, 7 dinten, 40 dinten, 100 dinten, pendhak 1, pendhak 2, dumugi nyewu (1000 dinten).'
  },
  tab_ijab_title: {
    id: 'Petung Ijab (Palakrama)',
    jv: 'Pétung Ijab (Palakrama)'
  },
  tab_ijab_desc: {
    id: 'Sistem Neptu Khusus Ijab, babon wuku pernikahan, surasa weton, dan keselarasan sasi/tahun.',
    jv: 'Sistem Neptu Mirunggan Ijab, babon wuku palakrama, surasa weton, lan jumbuhaning sasi/taun.'
  },
  tab_omah_title: {
    id: 'Petung Omah & Cempuri',
    jv: 'Pétung Griya & Cempuri'
  },
  tab_omah_desc: {
    id: 'Pedoman mendirikan rumah, boyongan, sembilan posisi pintu cempuri, dan larangan arah.',
    jv: 'Paugeran ngedegaken griya, boyongan, sangang posisi lawangan cempuri, sarta sirikan arah.'
  },
  tab_kehidupan_title: {
    id: 'Petung Kehidupan (Ternak, Penyakit, Geblak)',
    jv: 'Pétung Panguripan (Ingon-ingon, Gerah, Geblak)'
  },
  tab_kehidupan_desc: {
    id: 'Pedoman memulai ternak, jaluran penyakit tradisional, dan tata cara penghormatan duka geblak.',
    jv: 'Pituduh wiwit ngingu raja-kaya, jaluran lelara tradhisional, lan tatacara pakurmatan geblak.'
  },
  tab_sasmitha_title: {
    id: 'Sasmitha (Tanda Alam & Tubuh)',
    jv: 'Sasmitha (Pratandha Alam & Badan)'
  },
  tab_sasmitha_desc: {
    id: 'Tafsir mimpi tradisional, makna kedutan anatomi tubuh, gerhana, gempa (lindu), dan teja.',
    jv: 'Tapsir impen tradhisional, tegesing kedutan perangan badan, grahana, lindhu sasi, sarta teja langit.'
  },
  tab_wuku_title: {
    id: 'Ensiklopedia 30 Wuku Nusantara',
    jv: 'Pawukon 30 Wuku Nuswantara'
  },
  tab_wuku_desc: {
    id: 'Jelajahi siklus 30 wuku dari Sinta hingga Watugunung beserta Batara Pelindung dan 4 pilar petenget.',
    jv: 'Njlajahi siklus 30 wuku wiwit Sinta dumugi Watugunung sesarengan Bathara Pangayom lan 4 pilar petenget.'
  },
  tab_aksara_title: {
    id: 'Studio Aksara Jawa',
    jv: 'Papan Aksara Jawi'
  },
  tab_aksara_desc: {
    id: 'Papan ketik digital dan transliterasi instan Latin ke Hanacaraka dengan aturan sandhangan & pasangan.',
    jv: 'Papan ketik digital lan transliterasi cepet Latin dhateng Hanacaraka mawi paugeran sandhangan & pasangan.'
  },
  tab_wayang_title: {
    id: 'Panggung Kelir Wayang Kulit',
    jv: 'Panggung Kelir Wayang Kulit'
  },
  tab_wayang_desc: {
    id: 'Simulasi interaktif pementasan wayang kulit dengan blencong temaram, efek kepyak, dan tokoh wayang.',
    jv: 'Pentas wayang kulit interaktif mawi soroting blencong, kepyak, lan para paraga wayang.'
  }
};

/**
 * ─── 3. DICTIONARY GABUNGAN ─────────────────────────────────────────────────
 * Gabungan NAV_DICTIONARY dan CONTENT_DICTIONARY untuk backward compatibility.
 */
export const DICTIONARY = {
  ...NAV_DICTIONARY,
  ...CONTENT_DICTIONARY
};

let currentLang = 'id';

/**
 * Memeriksa apakah suatu key merupakan bagian dari Menu Navigasi Utama.
 * @param {string} key
 * @returns {boolean}
 */
export function isMenuKey(key) {
  if (!key || typeof key !== 'string') return false;
  return key.startsWith('nav_') || Object.prototype.hasOwnProperty.call(NAV_DICTIONARY, key);
}

/**
 * Mendapatkan bahasa antarmuka saat ini ('id' atau 'jv') dari localStorage.
 * @returns {'id'|'jv'}
 */
export function getLanguage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'id' || saved === 'jv') {
        currentLang = saved;
      }
    } catch {
      // LocalStorage tidak tersedia / di-block, gunakan default 'id'
    }
  }
  return currentLang;
}

/**
 * Menerapkan terjemahan pada seluruh elemen DOM.
 * ATURAN KETAT:
 * Menu Navigasi Utama selalu dikunci tetap dalam Bahasa Indonesia ('id')
 * agar pengguna tidak bingung saat berpindah menu.
 * Konten halaman, deskripsi modul, dan tombol aksi mengikuti mode 'id' atau 'jv'.
 *
 * @param {'id'|'jv'} [lang=currentLang]
 */
export function applyLanguage(lang = currentLang) {
  currentLang = (lang === 'jv') ? 'jv' : 'id';

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      console.warn('[i18n] Gagal menyimpan preferensi bahasa di localStorage:', e);
    }
  }

  if (typeof document === 'undefined') return;

  // 1. Perbarui teks seluruh elemen bertanda data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key || !DICTIONARY[key]) return;

    // Aturan Spesifik: Menu Navigasi Utama SELALU dikunci tetap Bahasa Indonesia ('id')
    const targetLang = isMenuKey(key) ? 'id' : currentLang;
    if (DICTIONARY[key][targetLang] !== undefined) {
      el.textContent = DICTIONARY[key][targetLang];
    } else if (DICTIONARY[key].id !== undefined) {
      el.textContent = DICTIONARY[key].id;
    }
  });

  // 2. Perbarui atribut title elemen bertanda data-i18n-title
  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key || !DICTIONARY[key]) return;
    const targetLang = isMenuKey(key) ? 'id' : currentLang;
    const txt = DICTIONARY[key][targetLang] || DICTIONARY[key].id;
    if (txt) el.setAttribute('title', txt);
  });

  // 3. Perbarui atribut placeholder elemen bertanda data-i18n-placeholder
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key || !DICTIONARY[key]) return;
    const targetLang = isMenuKey(key) ? 'id' : currentLang;
    const txt = DICTIONARY[key][targetLang] || DICTIONARY[key].id;
    if (txt) el.setAttribute('placeholder', txt);
  });

  // 4. Update indikator tombol switch bahasa di header & mobile drawer
  const toggleBadges = document.querySelectorAll('.lang-toggle-short, #langToggleBadge');
  toggleBadges.forEach((el) => {
    el.textContent = currentLang === 'jv' ? 'JV' : 'ID';
  });

  const toggleTexts = document.querySelectorAll('.lang-toggle-text');
  toggleTexts.forEach((el) => {
    el.textContent = currentLang === 'jv' ? 'JV (Basa Jawa)' : 'ID (Bhs Indonesia)';
  });

  const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.setAttribute('title', currentLang === 'jv'
      ? 'Mode Basa Jawi aktif (Klik untuk beralih ke Bahasa Indonesia)'
      : 'Mode Bahasa Indonesia aktif (Klik kagem gantos Basa Jawi)');
    btn.setAttribute('aria-label', `Mode Bahasa: ${currentLang.toUpperCase()}`);
  });

  // 5. Picu custom event 'language-changed' agar seluruh modul aktif langsung me-render ulang
  if (typeof window !== 'undefined') {
    window.currentLanguage = currentLang;
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: currentLang } }));
  }
}

/**
 * Mengubah bahasa ke bahasa yang ditentukan
 * @param {'id'|'jv'} lang
 */
export function setLanguage(lang) {
  applyLanguage(lang);
}

/**
 * Melakukan toggle bolak-balik antara Bahasa Indonesia ('id') dan Basa Jawi ('jv')
 * @returns {'id'|'jv'} Bahasa yang aktif sekarang
 */
export function toggleLanguage() {
  const nextLang = currentLang === 'id' ? 'jv' : 'id';
  applyLanguage(nextLang);
  return nextLang;
}

/**
 * Helper Dwibahasa: Membaca teks berdasarkan bahasa aktif ('id' atau 'jv')
 * Mendukung objek berbentuk `{ id: '...', jv: '...' }`, string biasa, angka, array, dsb.
 * @param {string|object|number|Array} val
 * @param {'id'|'jv'} [lang]
 * @returns {string}
 */
export function getBilingualText(val, lang = null) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val.map(item => getBilingualText(item, lang)).join(', ');
  }
  if (typeof val === 'object') {
    const targetLang = (lang === 'jv' || lang === 'id') ? lang : getLanguage();
    if (val[targetLang] !== undefined && val[targetLang] !== null) {
      return getBilingualText(val[targetLang], targetLang);
    }
    if (val.id !== undefined && val.id !== null && typeof val.id === 'string') return val.id;
    if (val.jv !== undefined && val.jv !== null && typeof val.jv === 'string') return val.jv;
    if (val.id !== undefined && val.id !== null) return String(val.id);
    if (val.jv !== undefined && val.jv !== null) return String(val.jv);
  }
  return String(val);
}

/**
 * Menyelesaikan seluruh properti dwibahasa `{ id, jv }` dalam objek atau array rekursif.
 * @param {object|Array} record
 * @param {'id'|'jv'} [lang]
 * @returns {object|Array}
 */
export function resolveBilingualRecord(record, lang = null) {
  if (!record || typeof record !== 'object') return record;
  if (Array.isArray(record)) {
    return record.map(item => resolveBilingualRecord(item, lang));
  }
  if (('id' in record || 'jv' in record) && Object.keys(record).every(k => k === 'id' || k === 'jv')) {
    return getBilingualText(record, lang);
  }
  const resolved = {};
  for (const [key, val] of Object.entries(record)) {
    if (val && typeof val === 'object' && ('id' in val || 'jv' in val) && (typeof val.id === 'string' || typeof val.jv === 'string') && Object.keys(val).every(k => k === 'id' || k === 'jv')) {
      resolved[key] = getBilingualText(val, lang);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      resolved[key] = resolveBilingualRecord(val, lang);
    } else if (Array.isArray(val)) {
      resolved[key] = val.map(item => resolveBilingualRecord(item, lang));
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * Menerjemahkan key kamus DICTIONARY ke bahasa aktif.
 * Untuk key menu navigasi (NAV_DICTIONARY / isMenuKey), jika parameter lang
 * tidak ditentukan secara eksplisit, hasilnya selalu dikembalikan dalam Bahasa Indonesia ('id').
 *
 * @param {string} key
 * @param {'id'|'jv'} [lang]
 * @returns {string}
 */
export function t(key, lang = null) {
  const isNav = isMenuKey(key);
  const targetLang = (lang === 'jv' || lang === 'id')
    ? lang
    : (isNav ? 'id' : getLanguage());

  if (DICTIONARY[key] && DICTIONARY[key][targetLang] !== undefined) {
    return DICTIONARY[key][targetLang];
  }
  if (DICTIONARY[key]) {
    return DICTIONARY[key].id || DICTIONARY[key].jv || key;
  }
  return key;
}

/**
 * Inisialisasi awal modul i18n
 */
export function initI18n() {
  const lang = getLanguage();
  applyLanguage(lang);
}

// Window attachments untuk interoperabilitas modul browser & handler inline
if (typeof window !== 'undefined') {
  window.currentLanguage = currentLang;
  window.getLanguage = getLanguage;
  window.setLanguage = setLanguage;
  window.toggleLanguage = toggleLanguage;
  window.applyLanguage = applyLanguage;
  window.getBilingualText = getBilingualText;
  window.resolveBilingualRecord = resolveBilingualRecord;
  window.isMenuKey = isMenuKey;
  window.NAV_DICTIONARY = NAV_DICTIONARY;
  window.CONTENT_DICTIONARY = CONTENT_DICTIONARY;
  window.DICTIONARY = DICTIONARY;
  window.t = t;
}
