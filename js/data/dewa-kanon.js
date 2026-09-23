/**
 * ============================================================================
 * JAGAD JAWA — js/data/dewa-kanon.js
 * SUMBER KEBENARAN TUNGGAL (Single Source of Truth)
 * Sistem Penamaan Dewa, Batara/Batari & Dewane Wuku Nusantara
 * ============================================================================
 *
 * TIGA SISTEM YANG WAJIB TIDAK DICAMPUR:
 *
 *   1. ASTAWARA_8  — Label pendek hasil matrix nujum bincil (210 baris).
 *                    TANPA gelar Batara/Batari. Contoh: "Sri", "Yamadipati".
 *                    Digunakan di: nujum-matrix.js (field padewan).
 *
 *   2. SIKLUS_12   — 12 padewan atribut siklus tahunan (umur % 12).
 *                    DENGAN gelar Batara/Batari. Contoh: "Batari Durga".
 *                    Digunakan di: siklus-master-data.js.
 *
 *   3. WUKU_DEWA   — Dewa pelindung 30 wuku. Prefix "Sang Hyang …".
 *                    Digunakan di: pawukon.js (field dewane).
 *
 * ATURAN GENDER KANON:
 *   Batari (perempuan) : Durga, Sri, Nagagini
 *   Batara (laki-laki) : semua lainnya
 *
 * ATURAN EJAAN KANON:
 *   Nagagini (bukan Nogogini), Yamadipati (bukan Yomodipati / Nyamadipati),
 *   Kamajaya (bukan Kumajaya / Komojoyo), Guritna (bukan Guretna),
 *   Isworo (bukan Iswara, dalam konteks Jawa modern), Bromo (bukan Brahma
 *   sebagai nama Batara — Brahma hanya alias), Indra (bukan Endra/Endro).
 *
 * FILE INI TIDAK MENGANDUNG LOGIKA KALKULASI.
 * Semua formula neptu, wuku, dan matrix bincil ada di calendar.js &
 * nujum-matrix.js dan TIDAK DIUBAH oleh file ini.
 * ============================================================================
 */

// ─── 1. ASTAWARA 8 ───────────────────────────────────────────────────────────
// Label pendek 8 padewan yang dipakai di kolom "padewan" nujum-matrix.js.
// Urutan dan nilai rotasi matrix TIDAK DIUBAH — hanya memastikan ejaan kanon.

/**
 * @typedef {Object} AstawaraEntry
 * @property {string} slug        - identifier unik lowercase, tanpa spasi/tanda
 * @property {string} label       - nama tampil kanon (TANPA Batara/Batari)
 * @property {string[]} aliases   - ejaan lama / variasi yang masih diakui
 * @property {string} watak       - karakter singkat (dari KET_BINCIL.padewan)
 */

/** @type {AstawaraEntry[]} */
export const ASTAWARA_8 = [
  {
    slug:    'sri',
    label:   'Sri',
    aliases: ['Batari Sri', 'Dewi Sri', 'Batara Sri'],
    watak:   'Welas asih',
    order:   1
  },
  {
    slug:    'indra',
    label:   'Indra',
    aliases: ['Endra', 'Endro', 'Batara Indra', 'Batara Endra'],
    watak:   'Teliti, angkuh',
    order:   2
  },
  {
    slug:    'guru',
    label:   'Guru',
    aliases: ['Batara Guru', 'Sang Hyang Guru'],
    watak:   'Memberi percobaan, lelemeran',
    order:   3
  },
  {
    slug:    'yamadipati',
    label:   'Yamadipati',
    aliases: ['Yomodipati', 'Nyamadipati', 'Yama', 'Batara Yamadipati', 'Batara Yomodipati'],
    watak:   'Pengertian, malas',
    order:   4
  },
  {
    slug:    'rudra',
    label:   'Rudra',
    aliases: ['Batara Rudra', 'Sang Hyang Rudra'],
    watak:   'Berbudi luhur',
    order:   5
  },
  {
    slug:    'brama',
    label:   'Brama',
    aliases: ['Brahma', 'Batara Brama', 'Batara Brahma', 'Sang Hyang Brama'],
    watak:   'Brangasan',
    order:   6
  },
  {
    slug:    'kala',
    label:   'Kala',
    aliases: ['Batara Kala', 'Sang Hyang Kala'],
    watak:   'Serakah, bohong',
    order:   7
  },
  {
    slug:    'uma',
    label:   'Uma',
    aliases: ['Batari Uma', 'Dewi Uma', 'Sang Hyang Uma'],
    watak:   'Welas asih',
    order:   8
  }
];

// ─── 2. SIKLUS 12 BATARA/BATARI ──────────────────────────────────────────────
// 12 padewan siklus tahunan (umur % 12), DENGAN gelar Batara/Batari.
// Slug membedakan entitas yang namanya mirip dengan Astawara
// (sri12, yamadipati12, endro, dll.) agar tidak tabrakan di map aset ilustrasi.

/**
 * @typedef {Object} Siklus12Entry
 * @property {string}   slug         - identifier unik lowercase
 * @property {number}   order        - 1..12 (sesuai urutan siklus)
 * @property {string}   label        - nama tampil kanon DENGAN gelar Batara/Batari
 * @property {string}   gender       - 'batara' | 'batari'
 * @property {string[]} aliases      - ejaan lama / variasi yang masih diakui
 * @property {string}   dewaRef      - referensi dewa/Sang Hyang terkait (jika ada)
 */

/** @type {Siklus12Entry[]} */
export const SIKLUS_12 = [
  {
    slug:    'suryo',
    order:   1,
    label:   'Batara Suryo',
    gender:  'batara',
    aliases: ['Suryo', 'Surya', 'Batara Surya', 'Sang Hyang Surya', 'Sang Hyang Suryo'],
    dewaRef: 'Sang Hyang Surya'
  },
  {
    slug:    'bromo',
    order:   2,
    label:   'Batara Bromo',
    gender:  'batara',
    aliases: ['Bromo', 'Brahma', 'Batara Brahma', 'Sang Hyang Brahma', 'Sang Hyang Bromo'],
    dewaRef: 'Sang Hyang Brahma'
  },
  {
    slug:    'durga',
    order:   3,
    label:   'Batari Durga',
    gender:  'batari',
    aliases: ['Durga', 'Durgo', 'Batara Durga', 'Batari Durgo', 'Dewi Durga'],
    dewaRef: 'Sang Hyang Batari Durga'
  },
  {
    slug:    'asmoro',
    order:   4,
    label:   'Batara Asmoro',
    gender:  'batara',
    // Catatan: konteks "Asmoro" = aspek asmara dari Kamajaya.
    // Bedakan dari slug 'kamajaya' yang merupakan entitas siklus ke-7.
    aliases: ['Asmoro', 'Asmara', 'Batara Asmara', 'Kamajaya (konteks asmara)',
              'Sang Hyang Asmara', 'Sang Hyang Kamajaya'],
    dewaRef: 'Sang Hyang Asmara'
  },
  {
    slug:    'isworo',
    order:   5,
    label:   'Batara Isworo',
    gender:  'batara',
    aliases: ['Isworo', 'Iswara', 'Batara Iswara', 'Batara Guru (Siwa)',
              'Sang Hyang Iswara', 'Siwa', 'Shiva'],
    dewaRef: 'Sang Hyang Iswara'
  },
  {
    slug:    'nagini',
    order:   6,
    label:   'Batari Nagagini',
    gender:  'batari',
    aliases: ['Nagagini', 'Nogogini', 'Nagini', 'Naga Gini',
              'Batari Nogogini', 'Batari Nagini', 'Batara Nagagini'],
    dewaRef: 'Sang Hyang Batari Nagagini'
  },
  {
    slug:    'kamajaya',
    order:   7,
    label:   'Batara Kamajaya',
    gender:  'batara',
    aliases: ['Kamajaya', 'Komojoyo', 'Kumajaya', 'Batara Komojoyo',
              'Batara Kumajaya', 'Sang Hyang Kamajaya'],
    dewaRef: 'Sang Hyang Kamajaya'
  },
  {
    // Dibedakan dari Astawara 'sri' dengan suffix '12'
    slug:    'sri12',
    order:   8,
    label:   'Batari Sri',
    gender:  'batari',
    aliases: ['Sri', 'Batara Sri', 'Dewi Sri', 'Dewi Kemakmuran',
              'Sang Hyang Sri', 'Sang Hyang Batari Sri'],
    dewaRef: 'Sang Hyang Batari Sri'
  },
  {
    slug:    'bayu',
    order:   9,
    label:   'Batara Bayu',
    gender:  'batara',
    aliases: ['Bayu', 'Batara Bayu', 'Sang Hyang Bayu', 'Dewa Angin'],
    dewaRef: 'Sang Hyang Bayu'
  },
  {
    slug:    'wisnu',
    order:   10,
    label:   'Batara Wisnu',
    gender:  'batara',
    aliases: ['Wisnu', 'Vishnu', 'Batara Vishnu', 'Sang Hyang Wisnu'],
    dewaRef: 'Sang Hyang Wisnu'
  },
  {
    // Dibedakan dari Astawara 'indra' dengan suffix 'endro'
    slug:    'endro',
    order:   11,
    label:   'Batara Endro',
    gender:  'batara',
    aliases: ['Endro', 'Indra', 'Endra', 'Batara Indra', 'Batara Endra',
              'Sang Hyang Indra', 'Sang Hyang Endra'],
    dewaRef: 'Sang Hyang Indra'
  },
  {
    // Dibedakan dari Astawara 'yamadipati' dengan suffix '12'
    slug:    'yamadipati12',
    order:   12,
    label:   'Batara Yamadipati',
    gender:  'batara',
    aliases: ['Yamadipati', 'Yomodipati', 'Nyamadipati', 'Yama',
              'Batara Yomodipati', 'Batara Nyamadipati', 'Sang Hyang Yamadipati'],
    dewaRef: 'Sang Hyang Yamadipati'
  }
];

/**
 * Array slug kanon Siklus 12 berurutan:
 * suryo, bromo, durga, asmoro, isworo, nagini, kamajaya, sri, bayu, wisnu, endro, yamadipati
 * @type {string[]}
 */
export const SIKLUS12_SLUGS = [
  'suryo',
  'bromo',
  'durga',
  'asmoro',
  'isworo',
  'nagini',
  'kamajaya',
  'sri',
  'bayu',
  'wisnu',
  'endro',
  'yamadipati'
];

// ─── 3. WUKU_DEWA — 30 DEWANE WUKU ───────────────────────────────────────────
// Format label: "Sang Hyang …"
// Urutan wuku PERSIS sama dengan WUKU di calendar.js (1=Sinta … 30=Watugunung).
// Field 'dewaneSlug' digunakan sebagai key aset ilustrasi.

/**
 * @typedef {Object} WukuDewaEntry
 * @property {number}   no_wuku     - 1..30
 * @property {string}   wuku        - nama wuku kanon (sesuai calendar.js)
 * @property {string}   wukuSlug    - lowercase, tanpa spasi
 * @property {string}   dewane      - nama dewa kanon, format "Sang Hyang …"
 * @property {string}   dewaneSlug  - key untuk aset ilustrasi (lowercase, alphanum+underscore)
 * @property {string[]} aliases     - ejaan lama / variasi yang masih diakui
 */

/** @type {WukuDewaEntry[]} */
export const WUKU_DEWA = [
  {
    no_wuku:    1,
    wuku:       'Sinta',
    wukuSlug:   'sinta',
    dewane:     'Sang Hyang Yamadipati',
    dewaneSlug: 'yamadipati',
    aliases:    ['Sang Hyang Nyamadipati', 'Sang Hyang Yomodipati', 'Nyamadipati', 'Yomodipati']
  },
  {
    no_wuku:    2,
    wuku:       'Landep',
    wukuSlug:   'landep',
    dewane:     'Sang Hyang Mahadewa',
    dewaneSlug: 'mahadewa',
    aliases:    []
  },
  {
    no_wuku:    3,
    wuku:       'Wukir',
    wukuSlug:   'wukir',
    dewane:     'Sang Hyang Mahayekti',
    dewaneSlug: 'mahayekti',
    aliases:    []
  },
  {
    no_wuku:    4,
    wuku:       'Kurantil',
    wukuSlug:   'kurantil',
    dewane:     'Sang Hyang Langsur',
    dewaneSlug: 'langsur',
    aliases:    []
  },
  {
    no_wuku:    5,
    wuku:       'Tolu',
    wukuSlug:   'tolu',
    dewane:     'Sang Hyang Bayu',
    dewaneSlug: 'bayu',
    aliases:    ['Sang Hyang Bayu (Dewa Angin)']
  },
  {
    no_wuku:    6,
    wuku:       'Gumbreg',
    wukuSlug:   'gumbreg',
    dewane:     'Sang Hyang Cakra',
    dewaneSlug: 'cakra',
    aliases:    ['Sang Hyang Cakra (Chakra)']
  },
  {
    no_wuku:    7,
    wuku:       'Warigalit',
    wukuSlug:   'warigalit',
    dewane:     'Sang Hyang Asmara',
    dewaneSlug: 'asmara',
    aliases:    ['Sang Hyang Asmoro', 'Sang Hyang Kamajaya']
  },
  {
    no_wuku:    8,
    wuku:       'Warigagung',
    wukuSlug:   'warigagung',
    dewane:     'Sang Hyang Maharesi',
    dewaneSlug: 'maharesi',
    aliases:    ['Sang Hyang Maha Resi']
  },
  {
    no_wuku:    9,
    wuku:       'Julungwangi',
    wukuSlug:   'julungwangi',
    dewane:     'Sang Hyang Sambu',
    dewaneSlug: 'sambu',
    aliases:    []
  },
  {
    no_wuku:    10,
    wuku:       'Sungsang',
    wukuSlug:   'sungsang',
    dewane:     'Sang Hyang Gana',
    dewaneSlug: 'gana',
    aliases:    ['Sang Hyang Ganesa', 'Ganesha']
  },
  {
    no_wuku:    11,
    wuku:       'Galungan',
    wukuSlug:   'galungan',
    dewane:     'Sang Hyang Kamajaya',
    dewaneSlug: 'kamajaya',
    aliases:    ['Sang Hyang Kumajaya', 'Sang Hyang Komojoyo', 'Kumajaya', 'Komojoyo']
  },
  {
    no_wuku:    12,
    wuku:       'Kuningan',
    wukuSlug:   'kuningan',
    dewane:     'Sang Hyang Indra',
    dewaneSlug: 'indra',
    aliases:    ['Sang Hyang Endra', 'Sang Hyang Endro', 'Endra', 'Endro']
  },
  {
    no_wuku:    13,
    wuku:       'Langkir',
    wukuSlug:   'langkir',
    dewane:     'Sang Hyang Kala',
    dewaneSlug: 'kala',
    aliases:    ['Batara Kala']
  },
  {
    no_wuku:    14,
    wuku:       'Mandasiya',
    wukuSlug:   'mandasiya',
    dewane:     'Sang Hyang Brama',
    dewaneSlug: 'brama',
    aliases:    ['Sang Hyang Brahma', 'Brahma']
  },
  {
    no_wuku:    15,
    wuku:       'Julungpujut',
    wukuSlug:   'julungpujut',
    dewane:     'Sang Hyang Guritna',
    dewaneSlug: 'guritna',
    aliases:    ['Sang Hyang Guretna', 'Guretna', 'Guritna']
  },
  {
    no_wuku:    16,
    wuku:       'Pahang',
    wukuSlug:   'pahang',
    dewane:     'Sang Hyang Tantra',
    dewaneSlug: 'tantra',
    aliases:    []
  },
  {
    no_wuku:    17,
    wuku:       'Kuruwelut',
    wukuSlug:   'kuruwelut',
    dewane:     'Sang Hyang Wisnu',
    dewaneSlug: 'wisnu',
    aliases:    ['Sang Hyang Vishnu']
  },
  {
    no_wuku:    18,
    wuku:       'Marakeh',
    wukuSlug:   'marakeh',
    dewane:     'Sang Hyang Surenggana',
    dewaneSlug: 'surenggana',
    aliases:    ['Sang Hyang Surenggono']
  },
  {
    no_wuku:    19,
    wuku:       'Tambir',
    wukuSlug:   'tambir',
    dewane:     'Sang Hyang Siwah',
    dewaneSlug: 'siwah',
    aliases:    ['Sang Hyang Siwa', 'Siwa', 'Shiva', 'sang Hyang Siwah']
  },
  {
    no_wuku:    20,
    wuku:       'Medangkungan',
    wukuSlug:   'medangkungan',
    dewane:     'Sang Hyang Basuki',
    dewaneSlug: 'basuki',
    aliases:    ['Sang Hyang Wasuki', 'Madangkungan']
  },
  {
    no_wuku:    21,
    wuku:       'Maktal',
    wukuSlug:   'maktal',
    dewane:     'Sang Hyang Sakri',
    dewaneSlug: 'sakri',
    aliases:    []
  },
  {
    no_wuku:    22,
    wuku:       'Wuye',
    wukuSlug:   'wuye',
    dewane:     'Sang Hyang Kuwera',
    dewaneSlug: 'kuwera',
    aliases:    ['Sang Hyang Kuvera', 'Kuvera', 'Kubera']
  },
  {
    no_wuku:    23,
    wuku:       'Manahil',
    wukuSlug:   'manahil',
    dewane:     'Sang Hyang Citragotra',
    dewaneSlug: 'citragotra',
    aliases:    ['Sang Hyang Citragatra']
  },
  {
    no_wuku:    24,
    wuku:       'Prangbakat',
    wukuSlug:   'prangbakat',
    dewane:     'Sang Hyang Bisma',
    dewaneSlug: 'bisma',
    aliases:    ['Sang Hyang Bhisma', 'Bisma', 'Bhisma']
  },
  {
    no_wuku:    25,
    wuku:       'Bala',
    wukuSlug:   'bala',
    dewane:     'Sang Hyang Batari Durga',
    dewaneSlug: 'batari_durga',
    aliases:    ['Batari Durga', 'Durga', 'Dewi Durga']
  },
  {
    no_wuku:    26,
    wuku:       'Wugu',
    wukuSlug:   'wugu',
    dewane:     'Sang Hyang Singajalma',
    dewaneSlug: 'singajalma',
    aliases:    []
  },
  {
    no_wuku:    27,
    wuku:       'Wayang',
    wukuSlug:   'wayang',
    dewane:     'Sang Hyang Batari Sri',
    dewaneSlug: 'batari_sri',
    aliases:    ['Batari Sri', 'Dewi Sri']
  },
  {
    no_wuku:    28,
    wuku:       'Kulawu',
    wukuSlug:   'kulawu',
    dewane:     'Sang Hyang Sadhana',
    dewaneSlug: 'sadhana',
    aliases:    ['Sang Hyang Sadana', 'Sadana']
  },
  {
    no_wuku:    29,
    wuku:       'Dukut',
    wukuSlug:   'dukut',
    dewane:     'Sang Hyang Baruna',
    dewaneSlug: 'baruna',
    aliases:    ['Sang Hyang Varuna', 'Varuna']
  },
  {
    no_wuku:    30,
    wuku:       'Watugunung',
    wukuSlug:   'watugunung',
    dewane:     'Sang Hyang Anantaboga lan Sang Hyang Batari Nagagini',
    dewaneSlug: 'anantaboga_nagagini',
    aliases:    [
      'Sang Hyang Anantaboga', 'Anantaboga', 'Antaboga',
      'Batari Nagagini', 'Nagagini', 'Nogogini',
      'Sang Hyang Batara Nagagini', // ejaan lama di pawukon.js
      'Sang Hyang Nagagini'
    ]
  }
];

// ─── LOOKUP MAPS (dibangun sekali, immutable) ─────────────────────────────────

/**
 * Map slug → entry untuk lookup O(1).
 * @type {Map<string, AstawaraEntry>}
 */
export const ASTAWARA_BY_SLUG = new Map(
  ASTAWARA_8.map(e => [e.slug, e])
);

/**
 * Map slug → entry untuk Siklus 12.
 * @type {Map<string, Siklus12Entry>}
 */
export const SIKLUS_BY_SLUG = new Map(
  SIKLUS_12.map(e => [e.slug, e])
);

/**
 * Map no_wuku (1..30) → entry WukuDewa.
 * @type {Map<number, WukuDewaEntry>}
 */
export const WUKU_DEWA_BY_NO = new Map(
  WUKU_DEWA.map(e => [e.no_wuku, e])
);

/**
 * Map wukuSlug → entry WukuDewa.
 * @type {Map<string, WukuDewaEntry>}
 */
export const WUKU_DEWA_BY_SLUG = new Map(
  WUKU_DEWA.map(e => [e.wukuSlug, e])
);

// ─── ALIAS RESOLUTION MAPS ────────────────────────────────────────────────────
// Setiap alias (lowercase) dipetakan ke slug kanon.

/** @type {Map<string, string>} alias → slug astawara */
const _astawaraAliasMap = new Map();
ASTAWARA_8.forEach(e => {
  _astawaraAliasMap.set(e.label.toLowerCase(), e.slug);
  _astawaraAliasMap.set(e.slug, e.slug);
  e.aliases.forEach(a => _astawaraAliasMap.set(a.toLowerCase(), e.slug));
});
export const ASTAWARA_ALIAS_MAP = _astawaraAliasMap;

/** @type {Map<string, string>} alias → slug siklus12 */
const _siklus12AliasMap = new Map();
SIKLUS_12.forEach(e => {
  _siklus12AliasMap.set(e.label.toLowerCase(), e.slug);
  _siklus12AliasMap.set(e.slug, e.slug);
  e.aliases.forEach(a => _siklus12AliasMap.set(a.toLowerCase(), e.slug));
});
export const SIKLUS_ALIAS_MAP = _siklus12AliasMap;

/** @type {Map<string, number>} alias (lowercase) → no_wuku */
const _wukuDewaAliasMap = new Map();
WUKU_DEWA.forEach(e => {
  _wukuDewaAliasMap.set(e.dewane.toLowerCase(), e.no_wuku);
  _wukuDewaAliasMap.set(e.dewaneSlug, e.no_wuku);
  e.aliases.forEach(a => _wukuDewaAliasMap.set(a.toLowerCase(), e.no_wuku));
});
export const WUKU_DEWA_ALIAS_MAP = _wukuDewaAliasMap;

// ─── RESOLVER FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Normalisasi sembarang input string → label kanon.
 * Mencari di ketiga sistem secara berurutan; kembalikan string asli jika tidak ditemukan.
 *
 * @param {string} input
 * @returns {string} label kanon atau input semula
 */
export function normalizeDewaName(input) {
  if (!input || typeof input !== 'string') return input;
  const key = input.trim().toLowerCase();

  // Cek Astawara 8
  const aSlug = _astawaraAliasMap.get(key);
  if (aSlug) return ASTAWARA_BY_SLUG.get(aSlug)?.label ?? input;

  // Cek Siklus 12
  const sSlug = _siklus12AliasMap.get(key);
  if (sSlug) return SIKLUS_BY_SLUG.get(sSlug)?.label ?? input;

  // Cek Wuku Dewa
  const wNo = _wukuDewaAliasMap.get(key);
  if (wNo != null) return WUKU_DEWA_BY_NO.get(wNo)?.dewane ?? input;

  return input;
}

/**
 * Resolve input → entry Astawara 8.
 * Menerima slug, label kanon, atau alias.
 *
 * @param {string} input
 * @returns {AstawaraEntry|null}
 */
export function resolveAstawara(input) {
  if (!input) return null;
  const slug = _astawaraAliasMap.get(input.trim().toLowerCase());
  return slug ? (ASTAWARA_BY_SLUG.get(slug) ?? null) : null;
}

/**
 * Resolve input → entry Siklus 12.
 * Menerima slug, label kanon, alias, atau nomor urut (1..12).
 *
 * @param {string|number} input
 * @returns {Siklus12Entry|null}
 */
export function resolveSiklus12(input) {
  if (input == null) return null;

  // Jika angka: lookup by order
  const num = typeof input === 'number' ? input : parseInt(input, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return SIKLUS_12.find(e => e.order === num) ?? null;
  }

  const slug = _siklus12AliasMap.get(String(input).trim().toLowerCase());
  return slug ? (SIKLUS_BY_SLUG.get(slug) ?? null) : null;
}

/**
 * Resolve input → entry Wuku Dewa.
 * Menerima nama wuku (kanon/alias), no_wuku (1..30), nama dewane, atau dewaneSlug.
 *
 * @param {string|number} wukuOrDewa
 * @returns {WukuDewaEntry|null}
 */
export function resolveWukuDewa(wukuOrDewa) {
  if (wukuOrDewa == null) return null;

  // Jika angka: langsung lookup by no_wuku
  const num = typeof wukuOrDewa === 'number' ? wukuOrDewa : parseInt(wukuOrDewa, 10);
  if (!isNaN(num) && num >= 1 && num <= 30) {
    return WUKU_DEWA_BY_NO.get(num) ?? null;
  }

  const key = String(wukuOrDewa).trim().toLowerCase().replace(/[\s\-_]+/g, '');

  // Coba wukuSlug dulu (lebih spesifik)
  const bySlug = WUKU_DEWA_BY_SLUG.get(key);
  if (bySlug) return bySlug;

  // Coba dewane alias
  const wNo = _wukuDewaAliasMap.get(String(wukuOrDewa).trim().toLowerCase());
  if (wNo != null) return WUKU_DEWA_BY_NO.get(wNo) ?? null;

  // Coba wukuSlug tanpa spasi (untuk variasi penulisan wuku)
  for (const entry of WUKU_DEWA) {
    if (entry.wuku.toLowerCase().replace(/[\s\-_]+/g, '') === key) return entry;
    if (entry.wukuSlug === key) return entry;
    // Cek alias wuku (sinto, shinto, kulantir, madangkungan, dll.)
    const wukuAliasMap = {
      'sinto': 'sinta', 'shinto': 'sinta',
      'kulantir': 'kurantil',
      'madangkungan': 'medangkungan', 'mendangkungan': 'medangkungan',
      'wariagung': 'warigagung', 'warigalagung': 'warigagung',
      'julungwangi': 'julungwangi',
      'julungpujut': 'julungpujut',
      'manail': 'manahil',
      'watugunung': 'watugunung'
    };
    if (wukuAliasMap[key] === entry.wukuSlug) return entry;
  }

  return null;
}

// ─── ILLUSTRATION PATH ────────────────────────────────────────────────────────

/**
 * Kembalikan path absolut aset ilustrasi .jpg kanon.
 * Base URL: /assets/illustrations/
 *
 * Aturan:
 * 1. wuku: /assets/illustrations/wuku/{slug}.jpg (slug = nama wuku lowercase)
 * 2. dewane: /assets/illustrations/dewane/{slug}-dewane.jpg (slug = nama wuku lowercase)
 * 3. siklus12: /assets/illustrations/siklus12/{slug}.jpg (slug kanon: suryo, bromo, durga, asmoro, isworo, nagini, kamajaya, sri, bayu, wisnu, endro, yamadipati)
 *
 * @param {'wuku'|'dewane'|'siklus12'|string} kind - kategori ilustrasi
 * @param {string|number} slug - slug unik (nama wuku, slug dewane, atau slug siklus)
 * @returns {string} path absolut file .jpg (contoh: '/assets/illustrations/dewane/sinta-dewane.jpg')
 *
 * @example
 * illustrationPath('wuku', 'sinta')        // '/assets/illustrations/wuku/sinta.jpg'
 * illustrationPath('dewane', 'sinta')      // '/assets/illustrations/dewane/sinta-dewane.jpg'
 * illustrationPath('siklus12', 'durga')    // '/assets/illustrations/siklus12/durga.jpg'
 * illustrationPath('siklus12', 'endro')    // '/assets/illustrations/siklus12/endro.jpg'
 */
export function illustrationPath(kind, slug) {
  if (!kind || slug == null) return '';
  const raw = String(slug).trim().toLowerCase();

  if (kind === 'wuku') {
    const entry = resolveWukuDewa(slug);
    const wSlug = entry ? entry.wukuSlug : raw.replace(/[^a-z0-9_]/g, '_');
    return `/assets/illustrations/wuku/${wSlug}.jpg`;
  }

  if (kind === 'dewane') {
    const entry = resolveWukuDewa(slug);
    let dSlug = entry ? entry.wukuSlug : raw.replace(/[^a-z0-9_]/g, '_');
    dSlug = dSlug.replace(/-dewane$/, '');
    return `/assets/illustrations/dewane/${dSlug}-dewane.jpg`;
  }

  if (kind === 'siklus12') {
    const entry = resolveSiklus12(slug);
    let sSlug = entry ? entry.slug : raw.replace(/[^a-z0-9_]/g, '_');
    // Normalisasi slug yang memiliki suffix 12 (seperti sri12 -> sri, yamadipati12 -> yamadipati)
    sSlug = sSlug.replace(/12$/, '');
    return `/assets/illustrations/siklus12/${sSlug}.jpg`;
  }

  // Fallback generik
  const safeSlug = raw.replace(/[^a-z0-9_]/g, '_');
  return `/assets/illustrations/${kind}/${safeSlug}.jpg`;
}

/**
 * Convenience: ambil path ilustrasi untuk wuku (by wukuSlug atau no_wuku).
 * @param {string|number} wukuOrNo
 * @returns {string}
 */
export function wukuIllustrationPath(wukuOrNo) {
  const entry = resolveWukuDewa(wukuOrNo);
  if (!entry) return '';
  return illustrationPath('wuku', entry.wukuSlug);
}

/**
 * Convenience: ambil path ilustrasi dewane wuku (by wukuSlug atau no_wuku).
 * @param {string|number} wukuOrNo
 * @returns {string}
 */
export function dewaneIllustrationPath(wukuOrNo) {
  const entry = resolveWukuDewa(wukuOrNo);
  if (!entry) return '';
  return illustrationPath('dewane', entry.wukuSlug);
}

/**
 * Convenience: ambil path ilustrasi padewan Siklus 12 (by slug atau nomor 1..12).
 * @param {string|number} slugOrOrder
 * @returns {string}
 */
export function siklus12IllustrationPath(slugOrOrder) {
  const entry = resolveSiklus12(slugOrOrder);
  if (!entry) return '';
  return illustrationPath('siklus12', entry.slug);
}

/**
 * Convenience: ambil path ilustrasi padewan Astawara 8 (by slug atau label).
 * @param {string} slugOrLabel
 * @returns {string}
 */
export function astawaraIllustrationPath(slugOrLabel) {
  const entry = resolveAstawara(slugOrLabel);
  if (!entry) return '';
  return illustrationPath('astawara', entry.slug);
}

// ─── LEGACY PATH HELPERS ──────────────────────────────────────────────────────
// Helper backward compat untuk path gambar lama (sebelum migrasi ke /assets/illustrations/).

/**
 * Ambil path gambar legacy .jpg wuku (sudah ada di assets/wuku/).
 * @param {string|number} wukuOrNo — nama wuku atau no_wuku
 * @returns {string} path relatif ke .jpg, atau '' jika tidak dikenali
 */
export function wukuLegacyImagePath(wukuOrNo) {
  const entry = resolveWukuDewa(wukuOrNo);
  if (!entry) return '';
  return `assets/wuku/${entry.wuku}.jpg`;
}

/**
 * Ambil path gambar legacy .jpg dewane (sudah ada di assets/dewa-wuku/).
 * Menggunakan string dewane kanon sebagai nama file.
 * @param {string|number} wukuOrNo — nama wuku atau no_wuku
 * @returns {string} path relatif ke .jpg, atau '' jika tidak dikenali
 */
export function dewaneLegacyImagePath(wukuOrNo) {
  const entry = resolveWukuDewa(wukuOrNo);
  if (!entry) return '';
  // Khusus Kulawu: file legacy bernama "Sadana" bukan "Sadhana"
  if (entry.no_wuku === 28) return 'assets/dewa-wuku/Sang Hyang Sadana.jpg';
  // Khusus Watugunung: file legacy masih pakai "Batara" bukan "Batari"
  if (entry.no_wuku === 30) return 'assets/dewa-wuku/Sang Hyang Anantaboga lan Sang Hyang Batara Nagagini.jpg';
  return `assets/dewa-wuku/${entry.dewane}.jpg`;
}

/**
 * Resolve path gambar terbaik: .jpg kanon yang tersedia.
 *
 * @param {'wuku'|'dewane'|'siklus12'|'astawara'} kind
 * @param {string|number} slugOrRef — slug, label, atau nomor
 * @returns {{ webp: string, legacy: string|null, best: string, jpg: string }}
 */
export function resolvedImagePath(kind, slugOrRef) {
  const path = illustrationPath(kind, slugOrRef);
  let legacy = null;
  if (kind === 'wuku') legacy = wukuLegacyImagePath(slugOrRef);
  if (kind === 'dewane') legacy = dewaneLegacyImagePath(slugOrRef);

  return {
    jpg: path,
    webp: path,
    legacy,
    best: path
  };
}

// ─── GLOBAL EXPORT (backward compat untuk window/IIFE legacy code) ───────────
if (typeof window !== 'undefined') {
  window.DEWA_KANON = {
    ASTAWARA_8,
    SIKLUS_12,
    SIKLUS12_SLUGS,
    WUKU_DEWA,
    normalizeDewaName,
    resolveAstawara,
    resolveSiklus12,
    resolveWukuDewa,
    illustrationPath,
    wukuIllustrationPath,
    dewaneIllustrationPath,
    siklus12IllustrationPath,
    astawaraIllustrationPath,
    // Legacy path helpers
    wukuLegacyImagePath,
    dewaneLegacyImagePath,
    resolvedImagePath,
    // Lookup maps
    ASTAWARA_BY_SLUG,
    SIKLUS_BY_SLUG,
    WUKU_DEWA_BY_NO,
    WUKU_DEWA_BY_SLUG,
    ASTAWARA_ALIAS_MAP,
    SIKLUS_ALIAS_MAP,
    WUKU_DEWA_ALIAS_MAP
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ASTAWARA_8,
    SIKLUS_12,
    SIKLUS12_SLUGS,
    WUKU_DEWA,
    ASTAWARA_BY_SLUG,
    SIKLUS_BY_SLUG,
    WUKU_DEWA_BY_NO,
    WUKU_DEWA_BY_SLUG,
    ASTAWARA_ALIAS_MAP,
    SIKLUS_ALIAS_MAP,
    WUKU_DEWA_ALIAS_MAP,
    normalizeDewaName,
    resolveAstawara,
    resolveSiklus12,
    resolveWukuDewa,
    illustrationPath,
    wukuIllustrationPath,
    dewaneIllustrationPath,
    siklus12IllustrationPath,
    astawaraIllustrationPath,
    wukuLegacyImagePath,
    dewaneLegacyImagePath,
    resolvedImagePath
  };
}
