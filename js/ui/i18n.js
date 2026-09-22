/**
 * Jagad Jawa — Modul UI: i18n (Internationalization / Dwibahasa)
 * Branch: jawa-v2
 * 
 * Tanggung Jawab:
 * 1. Mengatur toggle bahasa antarmuka (Bahasa Indonesia & Basa Jawa).
 * 2. Menyimpan preferensi bahasa pengguna di localStorage.
 * 3. Menjaga integritas data: HANYA memperbarui representasi label UI visual pada DOM.
 *    Semua key data (dino, pas, wuku, neptu, formula) 100% tidak diubah.
 */

const STORAGE_KEY = 'jagad_jawa_lang';

export const DICTIONARY = {
  // Brand & Header
  brand_subtitle: {
    id: 'Menjelajahi Kebudayaan Luhur Nusantara',
    jv: 'Njlajah Kabudayan Luhur Nuswantara'
  },
  lang_toggle_badge: {
    id: 'ID',
    jv: 'JA'
  },

  // Navigation Links & Dropdowns
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
  nav_gamelan: {
    id: 'Gamelan Maya',
    jv: 'Gamelan Jawa'
  },
  nav_aksara: {
    id: 'Studio Aksara Jawa',
    jv: 'Papan Aksara Jawa'
  },
  nav_wayang: {
    id: 'Kelir Wayang Purwa',
    jv: 'Kelir Wayang Purwa'
  },
  nav_pitutur: {
    id: 'Pitutur & Kuis',
    jv: 'Pitutur & Kuis'
  },

  // Kalender Toolbar & Filter
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

  // Tombol & Modal Umum
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
  }
};

let currentLang = 'id';

/**
 * Mendapatkan bahasa antarmuka saat ini ('id' atau 'jv')
 * @returns {'id'|'jv'}
 */
export function getLanguage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'jv') {
      currentLang = saved;
    }
  }
  return currentLang;
}

/**
 * Menerapkan terjemahan pada seluruh elemen DOM bertanda `data-i18n`
 * @param {'id'|'jv'} lang 
 */
export function applyLanguage(lang = currentLang) {
  currentLang = (lang === 'jv') ? 'jv' : 'id';

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_KEY, currentLang);
  }

  if (typeof document === 'undefined') return;

  // Update seluruh elemen data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (DICTIONARY[key] && DICTIONARY[key][currentLang]) {
      el.textContent = DICTIONARY[key][currentLang];
    }
  });

  // Update teks tombol switch bahasa di navbar
  const toggleBadges = document.querySelectorAll('.lang-toggle-text');
  toggleBadges.forEach((el) => {
    el.textContent = currentLang === 'id' ? 'ID (Bhs Indonesia)' : 'JA (Basa Jawa)';
  });

  const toggleShorts = document.querySelectorAll('.lang-toggle-short');
  toggleShorts.forEach((el) => {
    el.textContent = currentLang.toUpperCase();
  });

  // Trigger event jika ada modul yang ingin mendengarkan
  if (typeof window !== 'undefined') {
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
 * Melakukan toggle bolak-balik antara Bahasa Indonesia dan Basa Jawa
 * @returns {'id'|'jv'} Bahasa yang aktif sekarang
 */
export function toggleLanguage() {
  const nextLang = currentLang === 'id' ? 'jv' : 'id';
  applyLanguage(nextLang);
  return nextLang;
}

/**
 * Inisialisasi awal modul i18n
 */
export function initI18n() {
  const lang = getLanguage();
  applyLanguage(lang);
}
