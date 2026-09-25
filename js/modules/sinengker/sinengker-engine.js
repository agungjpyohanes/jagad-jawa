/**
 * Jagad Jawa — Modul Domain: Pustaka Sinengker Engine
 * Menangani sistem verifikasi akses sakral/PIN, kompas danyang resolver,
 * dan retrieval naskah pustaka sinengker.
 */

import { SINENGKER_DATA } from '../../data/sinengker-db.js';

export const SINENGKER_SESSION_KEY = 'jagad_jawa_sinengker_unlocked';
export const VALID_PIN_CODES = ['1757', 'sastrajendra', 'kasampurnan'];

/**
 * Memeriksa apakah akses Pustaka Sinengker saat ini terbuka di session.
 * @returns {boolean}
 */
export function isSinengkerUnlocked() {
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  return window.sessionStorage.getItem(SINENGKER_SESSION_KEY) === 'true';
}

/**
 * Menyetel status akses terbuka atau terkunci.
 * @param {boolean} status 
 */
export function setSinengkerUnlocked(status) {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  if (status) {
    window.sessionStorage.setItem(SINENGKER_SESSION_KEY, 'true');
  } else {
    window.sessionStorage.removeItem(SINENGKER_SESSION_KEY);
  }
}

/**
 * Memvalidasi kode PIN atau kata sandi sakral.
 * Menerima salah satu dari: '1757', 'sastrajendra', 'kasampurnan' (case-insensitive & trimmed).
 * @param {string} inputCode 
 * @returns {boolean}
 */
export function verifySinengkerAccess(inputCode) {
  if (!inputCode) return false;
  const clean = String(inputCode).trim().toLowerCase();
  return VALID_PIN_CODES.includes(clean);
}

/**
 * Normalisasi nama desa/kelurahan dengan membuang prefiks umum.
 * @param {string} raw 
 * @returns {string}
 */
export function cleanKelurahanName(raw = '') {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/^(kelurahan|desa|kel\.|ds\.)\s+/i, '')
    .trim();
}

// Peta aksara unicode Jawa mandiri
const UNICODE_AKSARA_JAWA_MAP = {
  'ꦲ': 'HA', 'ꦤ': 'NA', 'ꦕ': 'CA', 'ꦫ': 'RA', 'ꦏ': 'KA',
  'ꦢ': 'DA', 'ꦠ': 'TA', 'ꦱ': 'SA', 'ꦮ': 'WA', 'ꦭ': 'LA',
  'ꦥ': 'PA', 'ꦝ': 'DHA', 'ꦗ': 'JA', 'ꦪ': 'YA', 'ꦚ': 'NYA',
  'ꦩ': 'MA', 'ꦒ': 'GA', 'ꦧ': 'BA', 'ꦛ': 'THA', 'ꦔ': 'NGA'
};

const AKSARA_LIST = [
  'HA', 'NA', 'CA', 'RA', 'KA',
  'DA', 'TA', 'SA', 'WA', 'LA',
  'PA', 'DHA', 'JA', 'YA', 'NYA',
  'MA', 'GA', 'BA', 'THA', 'NGA'
];

/**
 * Menentukan aksara Jawa awal dan koordinat sudut derajat presisi Kompas Danyang
 * berdasarkan nama desa/kelurahan (Formula 20 Aksara 360° / pergeseran 18° searah jarum jam).
 * 
 * Aturan Matematika 360°:
 * - Titik Acuan: Aksara THA ing arah Lor (Utara) dados titik wiwit (0°), sudut tengah sektor = 9°
 * - Tiap aksara nempati sektor 18° searah jarum jam: THA (9°) → NGA (27°) → HA (45°) → ... → BA (351°)
 * - Penomoran urutan: THA=1, NGA=2, HA=3, NA=4, CA=5, RA=6, KA=7, DA=8, TA=9, SA=10,
 *   WA=11, LA=12, PA=13, DHA=14, JA=15, YA=16, NYA=17, MA=18, GA=19, BA=20
 * 
 * @param {string} namaKelurahan 
 * @returns {Object} Hasil evaluasi kompas danyang presisi 360°
 */
export function resolveKompasDanyang(namaKelurahan = '') {
  const clean = cleanKelurahanName(namaKelurahan);
  if (!clean) {
    return {
      success: false,
      pesan: 'Asma kelurahan/desa kedah dipun-isi.'
    };
  }

  const lower = clean.toLowerCase();
  const upper = clean.toUpperCase();
  let aksaraAwal = '';

  // 1. Cek jika pengguna langsung memasukkan karakter Aksara Jawa Unicode
  const firstChar = clean.charAt(0);
  if (UNICODE_AKSARA_JAWA_MAP[firstChar]) {
    aksaraAwal = UNICODE_AKSARA_JAWA_MAP[firstChar];
  }
  // 2. Cek jika pengguna langsung mengetik nama aksara (cth: "HA", "GA", "DHA")
  else if (AKSARA_LIST.includes(upper)) {
    aksaraAwal = upper;
  }
  // 3. Cek diftong / digraf 2-karakter khas Jawa (dh, th, ng, ny) serta transliterasi khusus
  else if (lower.startsWith('dha') || lower.startsWith('dh')) {
    aksaraAwal = 'DHA';
  } else if (lower.startsWith('tha') || lower.startsWith('th')) {
    aksaraAwal = 'THA';
  } else if (lower.startsWith('nga') || lower.startsWith('ng')) {
    aksaraAwal = 'NGA';
  } else if (lower.startsWith('nya') || lower.startsWith('ny')) {
    aksaraAwal = 'NYA';
  } else if (lower.startsWith('kh')) {
    aksaraAwal = 'KA';
  } else if (lower.startsWith('sy') || lower.startsWith('sh')) {
    aksaraAwal = 'SA';
  } else {
    // 4. Cek karakter tunggal pertama
    const c = lower.charAt(0);

    // Huruf swara (Vokal) dipun-aksarani kanthi HA
    if (['a', 'i', 'u', 'e', 'o', 'è', 'é'].includes(c)) {
      aksaraAwal = 'HA';
    } else if (c === 'h') {
      aksaraAwal = 'HA';
    } else if (c === 'b') {
      aksaraAwal = 'BA';
    } else if (c === 'n') {
      aksaraAwal = 'NA';
    } else if (c === 'c') {
      aksaraAwal = 'CA';
    } else if (c === 'r') {
      aksaraAwal = 'RA';
    } else if (c === 'k' || c === 'q') {
      aksaraAwal = 'KA';
    } else if (c === 'd') {
      aksaraAwal = 'DA';
    } else if (c === 't') {
      aksaraAwal = 'TA';
    } else if (c === 's') {
      aksaraAwal = 'SA';
    } else if (c === 'w') {
      aksaraAwal = 'WA';
    } else if (c === 'l') {
      aksaraAwal = 'LA';
    } else if (c === 'p' || c === 'f' || c === 'v') {
      aksaraAwal = 'PA';
    } else if (c === 'j' || c === 'z') {
      aksaraAwal = 'JA';
    } else if (c === 'y') {
      aksaraAwal = 'YA';
    } else if (c === 'm') {
      aksaraAwal = 'MA';
    } else if (c === 'g') {
      aksaraAwal = 'GA';
    } else {
      // Default fallback jika huruf asing / simbol
      aksaraAwal = 'HA';
    }
  }

  // Cari letak aksara di dalam array peta_aksara_derajat
  const petaList = SINENGKER_DATA.petung_kompas_danyang.peta_aksara_derajat || [];
  const aksaraItem = petaList.find(item => item.aksara === aksaraAwal) || petaList[0] || {
    urutan: 1,
    aksara: 'HA',
    aksara_jawa: 'ꦲ',
    sudut: 27.5,
    arah_sektor: 'lor',
    arah_sektor_jawa: 'Lor',
    arah_mata_angin: 'Timur Laut (Utara-Timur Laut)',
    arah_mata_angin_jawa: 'Lor-Wetan',
    watak_spiritual: 'Kasantosan, Kateguhan Batin, lan Panguripan Anyar.',
    danyang_pitedah: 'Wewengkon ingkang kapayungan dening Danyang Arah HA gadhah hawa adhem lan santosa.',
    sesaji_ubarampe: 'Sekar setaman telon, jenang petak, toya wening, lan kemenyan madu.'
  };

  const arahKey = aksaraItem.arah_sektor;
  const detailArah = SINENGKER_DATA.petung_kompas_danyang.detail_arah[arahKey] || {
    nama_jawa: aksaraItem.arah_sektor_jawa || 'Lor',
    nama_id: 'Utara',
    simbol: 'U',
    derajat: 0,
    aksara_display: 'Ba, Tha, Nga, Ha'
  };

  return {
    success: true,
    input_asli: namaKelurahan,
    nama_bersih: clean,
    aksara_awal: aksaraItem.aksara,
    aksara_jawa: aksaraItem.aksara_jawa,
    urutan: aksaraItem.urutan,
    sudut: aksaraItem.sudut,
    derajat: aksaraItem.sudut, // Derajat presisi sesuai hasil kalkulasi lingkaran 360°
    derajat_presisi: `${aksaraItem.sudut}°`,
    derajat_kardinal: detailArah.derajat,
    arah_key: arahKey,
    arah_sektor: arahKey,
    arah_jawa: detailArah.nama_jawa,
    arah_id: detailArah.nama_id,
    arah_mata_angin: aksaraItem.arah_mata_angin,
    arah_mata_angin_jawa: aksaraItem.arah_mata_angin_jawa,
    simbol: detailArah.simbol,
    sifat: aksaraItem.watak_spiritual,
    watak_spiritual: aksaraItem.watak_spiritual,
    danyang_pitedah: aksaraItem.danyang_pitedah,
    sesaji_ubarampe: aksaraItem.sesaji_ubarampe,
    aksara_seperjuangan: detailArah.aksara_display,
    gambar_kompas: SINENGKER_DATA.petung_kompas_danyang.gambar_aset,
    detail_aksara: aksaraItem
  };
}

/**
 * Mengambil array peta 20 aksara dan derajat kompas
 */
export function getPetaAksaraDerajat() {
  return SINENGKER_DATA.petung_kompas_danyang.peta_aksara_derajat || [];
}

/**
 * Mengambil data komplit Kompas Danyang
 */
export function getKompasDanyangData() {
  return SINENGKER_DATA.petung_kompas_danyang;
}

/**
 * Mengambil data tata cara & ubarampe mendhem ari-ari
 */
export function getMendhemAriAriData() {
  return SINENGKER_DATA.mendhem_ari_ari;
}

/**
 * Mengambil data ubarampe pager bumi & omah
 */
export function getUbarampePagerData() {
  return SINENGKER_DATA.ubarampe_pager;
}

/**
 * Mengambil data ajaran asenggama & sastra jendra
 */
export function getAsenggamaSastraJendraData() {
  return SINENGKER_DATA.ajaran_asenggama_sastra_jendra;
}

/**
 * Mengambil ajaran Bodro Sampir
 */
export function getBodroSampirData() {
  return SINENGKER_DATA.ajaran_bodro_sampir;
}

/**
 * Mengambil ajaran Kasedan Jati
 */
export function getKasedanJatiData() {
  return SINENGKER_DATA.ajaran_kasedan_jati;
}

/**
 * Mengambil ajaran Roso Sejati & sarana praktis
 */
export function getRosoSejatiData() {
  return SINENGKER_DATA.ajaran_roso_sejati;
}

/**
 * Mengambil koleksi aji mantra sinengker (Condo Birowo, Semar Kawak, Waringin Sungsang)
 */
export function getAjiMantraSinengkerList() {
  return [
    {
      id: 'condo-birowo',
      ...SINENGKER_DATA.aji_condo_birowo
    },
    {
      id: 'semar-kawak',
      ...SINENGKER_DATA.aji_semar_kawak
    },
    {
      id: 'waringin-sungsang',
      ...SINENGKER_DATA.aji_waringin_sungsang
    }
  ];
}

/**
 * Mengambil data ajaran sakral Ruwatan Batara Kala (Murwakala)
 */
export function getRuwatanBataraKalaData() {
  return SINENGKER_DATA.ruwatan_batara_kala;
}

export { SINENGKER_DATA };
