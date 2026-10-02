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
    id: 'Portal Budaya Nusantara',
    jv: 'Gapura Budaya Nusantara'
  },
  lang_toggle_badge: {
    id: 'ID',
    jv: 'JV'
  },
  lang_toggle_title: {
    id: 'Ganti Bahasa (Indonesia / Jawa)',
    jv: 'Gantos Basa (Indonesia / Jawi)'
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
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      console.warn('[i18n] Failed to save language:', e);
    }
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
      ? 'Basa Jawi aktif (Klik kagem gantos Basa Indonesia)' 
      : 'Bahasa Indonesia aktif (Klik untuk beralih ke Basa Jawa)');
    btn.setAttribute('aria-label', `Mode Bahasa: ${currentLang.toUpperCase()}`);
  });

  // Trigger event jika ada modul yang ingin mendengarkan
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
 * Melakukan toggle bolak-balik antara Bahasa Indonesia dan Basa Jawa
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
 * Menerjemahkan key kamus DICTIONARY ke bahasa aktif
 * @param {string} key
 * @param {'id'|'jv'} [lang]
 * @returns {string}
 */
export function t(key, lang = null) {
  const targetLang = (lang === 'jv' || lang === 'id') ? lang : getLanguage();
  if (DICTIONARY[key] && DICTIONARY[key][targetLang]) {
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
  window.t = t;
}
