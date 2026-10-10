/**
 * Manifest tunggal pemetaan Canonical Key KV Cloudflare ke nama file JSON lokal.
 * Digunakan bersama oleh:
 * 1. Cloudflare Pages Function (functions/api/data/[name].js) untuk allowlist ketat.
 * 2. dbLoader.js untuk resolving key / alias lokal dan API.
 * 3. Script migrasi / export KV (scripts/kv-export-payload.mjs).
 */

export const CANONICAL_KEYS = {
  'kalender:constants': {
    filename: '01-kalender-constants.json',
    description: 'Konstanta kalender, hari, pasaran, wuku, neptu, dan epoch'
  },
  'wuku:ensiklopedia': {
    filename: '02-wuku-ensiklopedia.json',
    description: 'Ensiklopedia 30 wuku pawukon'
  },
  'bincil:arti': {
    filename: '03-bincil-arti.json',
    description: 'Arti bincil nujum 6 dimensi'
  },
  'dino:rules': {
    filename: '04-dino-rules.json',
    description: 'Aturan dino gede dan dino ijo'
  },
  'pranata:mangsa': {
    filename: '05-pranata-mangsa.json',
    description: 'Pranata mangsa agraris Nusantara'
  },
  'bincil:matrix': {
    filename: '06-bincil-matrix-bilingual.json',
    description: 'Matriks 210 weton x wuku nujum bincil bilingual'
  },
  'zodiak:all': {
    filename: '07-zodiak-bilingual.json',
    description: 'Karakteristik 12 zodiak'
  },
  'sasi:jawa': {
    filename: '08-sasi-jawa-bilingual.json',
    description: 'Karakteristik 12 sasi penanggalan Jawa'
  },
  'shio:wuxing': {
    filename: '09-shio-wuxing-bilingual.json',
    description: 'Shio dan lima elemen Wu Xing'
  },
  'pasaran:watak': {
    filename: '10-pasaran-watak-bilingual.json',
    description: 'Watak 5 pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon)'
  },
  'perjodohan:pitung': {
    filename: '11-pitung-perjodohan-bilingual.json',
    description: 'Pitung perjodohan Jawa metode I - VI bilingual'
  },
  'karakter:dasar': {
    filename: '12-karakter-dasar-bilingual.json',
    description: 'Karakter dasar watak kelahiran'
  },
  'pekerjaan:weton': {
    filename: '13-pekerjaan-weton-bilingual.json',
    description: 'Rekomendasi pekerjaan 35 weton'
  },
  'selametan:rules': {
    filename: '14-selametan-rules.json',
    description: 'Aturan pengetan selametan 7 tahapan'
  },
  'ijab:all': {
    filename: '15-ijab-bilingual.json',
    description: 'Petung ijab pernikahan sistem neptu khusus'
  },
  'perjodohan:pitung-alt': {
    filename: '16-pitung-perjodohan.json',
    description: 'Pitung perjodohan format alternatif'
  },
  'aksara:perjodohan': {
    filename: '17-aksara-perjodohan.json',
    description: 'Pembobotan 20 aksara carakan untuk perjodohan'
  },
  'selametan:rules-alt': {
    filename: '18-selametan-rules.json',
    description: 'Aturan pengetan selametan alternatif'
  },
  'ijab:alt': {
    filename: '19-ijab.json',
    description: 'Petung ijab ringkas alternatif'
  },
  'sasmitha:all': {
    filename: '20-sasmitha.json',
    description: 'Database sasmitha (impen, kedut, gerhana, lindu, tejo)'
  },
  'petung:tetanen': {
    filename: '21-petung-tetanen-bilingual.json',
    description: 'Petung tetanen 35 weton 4 pilar tanaman'
  },
  'petung:ternak': {
    filename: '22-petung-ternak-bilingual.json',
    description: 'Petung ternak, loro, dan geblak 35 weton'
  },
  'omah:all': {
    filename: '23-omah-bilingual.json',
    description: 'Petung omah, cempuri lawangan, dan arah boyongan'
  },
  'wuku:petenget': {
    filename: '24-wuku-petenget-bilingual.json',
    description: 'Petenget wuku 4 pilar tradisi'
  },
  'siklus:padewan': {
    filename: '25-siklus-padewan-bilingual.json',
    description: 'Siklus padewan tahunan'
  },
  'palenggahan:all': {
    filename: '26-palenggahan-bilingual.json',
    description: 'Palenggahan lima kedudukan'
  },
  'bincil:arti-bilingual': {
    filename: '27-bincil-arti-bilingual.json',
    description: 'Arti bincil bilingual lengkap'
  },
  'marriage:hasil-bilingual': {
    filename: '28-marriage-hasil-bilingual.json',
    description: 'Hasil pitung perjodohan kamus lengkap'
  },
  'sasi:jawa-alt': {
    filename: '29-sasi-jawa-bilingual.json',
    description: 'Watak sasi Jawa alternatif'
  },
  'aksara:nglegena': {
    filename: '30-aksara-nglegena-bilingual.json',
    description: 'Aksara nglegena 20 aksara Jawa'
  },
  'dino:gede': {
    filename: '31-dino-gede-bilingual.json',
    description: 'Daftar dino gede pantangan hajatan'
  },
  'sirikan:adhep': {
    filename: '32-dino-sirikan-adhep-bilingual.json',
    description: 'Pantangan arah hadap rumah harian'
  },
  'kamus:jawa': {
    filename: '33-kamus-jawa.json',
    description: 'Kamus Jawa - Indonesia 71 lema utama'
  },
  'kamus:sanskerta': {
    filename: '34-kamus-sansakerta.json',
    description: 'Kamus Jawa - Sanskerta 30 istilah'
  },
  'pustaka:dongo': {
    filename: '35-pustaka-dongo.json',
    description: 'Kumpulan doa dan mantra tradisi Nusantara'
  },
  'pustaka:jawa': {
    filename: '36-pustaka-jawa.json',
    description: 'Pustaka Jawa luhur, piwulang, dan usada herbal'
  },
  'sinengker:khusus': {
    filename: '37-sinengker-khusus.json',
    description: 'Khazanah sinengker dan rajah kalacakra'
  },
  'wayang:all': {
    filename: '38-wayang-all.json',
    description: 'Ensiklopedia tokoh wayang purwa Gagrag Surakarta'
  },
  'pitutur:all': {
    filename: '39-pitutur-all.json',
    description: 'Koleksi pitutur luhur dwibahasa & bank soal kuis'
  },
  'mitologi:all': {
    filename: '40-mitologi-all.json',
    description: 'Mitologi Nusantara & babad pawukon watugunung'
  },
  'pustaka:digital': {
    filename: '41-pustaka-digital.json',
    description: 'Naskah kuno klasik, serat piwulang, dan dokumen budaya'
  },
  'tumpeng:all': {
    filename: '42-tumpeng-all.json',
    description: 'Ubarampe sesaji Tumpeng Tombak Rojo & 5 warna'
  }
};

/**
 * Pemetaan dari berbagai bentuk identifier/alias ke canonical KV key.
 */
export const ALIAS_TO_KEY = {
  // Nomor index 2 digit & 1 digit
  '01': 'kalender:constants',
  '1': 'kalender:constants',
  '02': 'wuku:ensiklopedia',
  '2': 'wuku:ensiklopedia',
  '03': 'bincil:arti',
  '3': 'bincil:arti',
  '04': 'dino:rules',
  '4': 'dino:rules',
  '05': 'pranata:mangsa',
  '5': 'pranata:mangsa',
  '06': 'bincil:matrix',
  '6': 'bincil:matrix',
  '07': 'zodiak:all',
  '7': 'zodiak:all',
  '08': 'sasi:jawa',
  '8': 'sasi:jawa',
  '09': 'shio:wuxing',
  '9': 'shio:wuxing',
  '10': 'pasaran:watak',
  '11': 'perjodohan:pitung',
  '12': 'karakter:dasar',
  '13': 'pekerjaan:weton',
  '14': 'selametan:rules',
  '15': 'ijab:all',
  '16': 'perjodohan:pitung-alt',
  '17': 'aksara:perjodohan',
  '18': 'selametan:rules-alt',
  '19': 'ijab:alt',
  '20': 'sasmitha:all',
  '21': 'petung:tetanen',
  '22': 'petung:ternak',
  '23': 'omah:all',
  '24': 'wuku:petenget',
  '25': 'siklus:padewan',
  '26': 'palenggahan:all',
  '27': 'bincil:arti-bilingual',
  '28': 'marriage:hasil-bilingual',
  '29': 'sasi:jawa-alt',
  '30': 'aksara:nglegena',
  '31': 'dino:gede',
  '32': 'sirikan:adhep',
  '33': 'kamus:jawa',
  '34': 'kamus:sanskerta',
  '35': 'pustaka:dongo',
  '36': 'pustaka:jawa',
  '37': 'sinengker:khusus',
  '38': 'wayang:all',
  '39': 'pitutur:all',
  '40': 'mitologi:all',
  '41': 'pustaka:digital',
  '42': 'tumpeng:all',

  // Nama file JSON
  '01-kalender-constants.json': 'kalender:constants',
  '02-wuku-ensiklopedia.json': 'wuku:ensiklopedia',
  '03-bincil-arti.json': 'bincil:arti',
  '04-dino-rules.json': 'dino:rules',
  '05-pranata-mangsa.json': 'pranata:mangsa',
  '06-bincil-matrix-bilingual.json': 'bincil:matrix',
  '07-zodiak-bilingual.json': 'zodiak:all',
  '08-sasi-jawa-bilingual.json': 'sasi:jawa',
  '09-shio-wuxing-bilingual.json': 'shio:wuxing',
  '10-pasaran-watak-bilingual.json': 'pasaran:watak',
  '11-pitung-perjodohan-bilingual.json': 'perjodohan:pitung',
  '12-karakter-dasar-bilingual.json': 'karakter:dasar',
  '13-pekerjaan-weton-bilingual.json': 'pekerjaan:weton',
  '14-selametan-rules.json': 'selametan:rules',
  '15-ijab-bilingual.json': 'ijab:all',
  '16-pitung-perjodohan.json': 'perjodohan:pitung-alt',
  '17-aksara-perjodohan.json': 'aksara:perjodohan',
  '18-selametan-rules.json': 'selametan:rules-alt',
  '19-ijab.json': 'ijab:alt',
  '20-sasmitha.json': 'sasmitha:all',
  '21-petung-tetanen-bilingual.json': 'petung:tetanen',
  '22-petung-ternak-bilingual.json': 'petung:ternak',
  '23-omah-bilingual.json': 'omah:all',
  '24-wuku-petenget-bilingual.json': 'wuku:petenget',
  '25-siklus-padewan-bilingual.json': 'siklus:padewan',
  '26-palenggahan-bilingual.json': 'palenggahan:all',
  '27-bincil-arti-bilingual.json': 'bincil:arti-bilingual',
  '28-marriage-hasil-bilingual.json': 'marriage:hasil-bilingual',
  '29-sasi-jawa-bilingual.json': 'sasi:jawa-alt',
  '30-aksara-nglegena-bilingual.json': 'aksara:nglegena',
  '31-dino-gede-bilingual.json': 'dino:gede',
  '32-dino-sirikan-adhep-bilingual.json': 'sirikan:adhep',
  '33-kamus-jawa.json': 'kamus:jawa',
  '34-kamus-sansakerta.json': 'kamus:sanskerta',
  '35-pustaka-dongo.json': 'pustaka:dongo',
  '36-pustaka-jawa.json': 'pustaka:jawa',
  '37-sinengker-khusus.json': 'sinengker:khusus',
  '38-wayang-all.json': 'wayang:all',
  '39-pitutur-all.json': 'pitutur:all',
  '40-mitologi-all.json': 'mitologi:all',
  '41-pustaka-digital.json': 'pustaka:digital',
  '42-tumpeng-all.json': 'tumpeng:all',
  'kamus-jawa.json': 'kamus:jawa',
  'kamus-sansakerta.json': 'kamus:sanskerta',

  // Alias teks kode modul
  kalenderConstants: 'kalender:constants',
  wukuEnsiklopedia: 'wuku:ensiklopedia',
  bincilArti: 'bincil:arti',
  dinoRules: 'dino:rules',
  pranataMangsa: 'pranata:mangsa',
  bincilMatrix: 'bincil:matrix',
  zodiak: 'zodiak:all',
  sasiJawa: 'sasi:jawa',
  shioWuxing: 'shio:wuxing',
  pasaranWatak: 'pasaran:watak',
  pitungPerjodohan: 'perjodohan:pitung',
  karakterDasar: 'karakter:dasar',
  pekerjaanWeton: 'pekerjaan:weton',
  selametanRules: 'selametan:rules',
  ijab: 'ijab:all',
  pitungPerjodohanAlt: 'perjodohan:pitung-alt',
  aksaraPerjodohan: 'aksara:perjodohan',
  selametanRulesAlt: 'selametan:rules-alt',
  ijabAlt: 'ijab:alt',
  sasmitha: 'sasmitha:all',
  petungTetanen: 'petung:tetanen',
  petungTernak: 'petung:ternak',
  omah: 'omah:all',
  wukuPetenget: 'wuku:petenget',
  siklusPadewan: 'siklus:padewan',
  palenggahan: 'palenggahan:all',
  bincilArtiAlt: 'bincil:arti-bilingual',
  marriageHasil: 'marriage:hasil-bilingual',
  sasiJawaAlt: 'sasi:jawa-alt',
  aksaraNglegena: 'aksara:nglegena',
  dinoGede: 'dino:gede',
  dinoSirikanAdhep: 'sirikan:adhep',
  kamusJawa: 'kamus:jawa',
  kamusSansakerta: 'kamus:sanskerta',
  pustakaDongo: 'pustaka:dongo',
  pustakaJawa: 'pustaka:jawa',
  sinengkerKhusus: 'sinengker:khusus',
  wayang: 'wayang:all',
  pitutur: 'pitutur:all',
  mitologi: 'mitologi:all',
  pustakaDigital: 'pustaka:digital',
  tumpeng: 'tumpeng:all'
};

/**
 * Resolve identifier apa pun ke canonical key KV terdaftar.
 * @param {string|number} id
 * @returns {string|null} Canonical key KV atau null jika tidak dikenal
 */
export function resolveCanonicalKey(id) {
  if (id === null || id === undefined) return null;
  const str = String(id).trim();
  if (CANONICAL_KEYS[str]) return str;
  if (ALIAS_TO_KEY[str]) return ALIAS_TO_KEY[str];
  const pad = str.padStart(2, '0');
  if (ALIAS_TO_KEY[pad]) return ALIAS_TO_KEY[pad];
  return null;
}

/**
 * Mendapatkan filename JSON canonical dari key, alias, atau nomor index
 * @param {string|number} id
 * @returns {string|null}
 */
export function getCanonicalFilename(id) {
  const canonicalKey = resolveCanonicalKey(id);
  if (canonicalKey && CANONICAL_KEYS[canonicalKey]) {
    return CANONICAL_KEYS[canonicalKey].filename;
  }
  return null;
}

