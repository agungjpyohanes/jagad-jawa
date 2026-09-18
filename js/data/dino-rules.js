/**
 * Jagad Jawa — Kamus Data & Aturan Penandaan Kalender Jawa
 * (Dino Gede, Dino Ijo, & Dino Abang)
 * 
 * Rujukan resmi:
 * - database_nujum - dino_gede.csv (71 kombinasi resmi)
 * - database_nujum - dino_ijo.csv (74 kombinasi resmi)
 * - Primbon Pawukon Keraton Surakarta & Ngayogyakarta Hadiningrat
 */

// 0. Daftar Baku 30 Wuku Jawa (Sinta ngantos Watugunung)
export const STANDARD_WUKU_LIST = [
  "Sinta","Landep","Wukir","Kurantil","Tolu","Gumbreg","Warigalit","Warigagung",
  "Julungwangi","Sungsang","Galungan","Kuningan","Langkir","Mandasiya","Julungpujut","Pahang",
  "Kuruwelut","Marakeh","Tambir","Medangkungan","Maktal","Wuye","Manahil","Prangbakat","Bala",
  "Wugu","Wayang","Kulawu","Dukut","Watugunung"
];

// 1. Data Master Resmi Dino Gede (71 Pasangan Dino, Pasaran, Wuku)
export const DINO_GEDE_LIST = [
  ["Selasa","Wage","Sinta"],["Kamis","Legi","Sinta"],["Jumat","Pahing","Sinta"],
  ["Rabu","Pahing","Landep"],["Sabtu","Kliwon","Landep"],["Selasa","Pon","Wukir"],
  ["Jumat","Legi","Wukir"],["Senin","Wage","Kurantil"],["Kamis","Pahing","Kurantil"],
  ["Minggu","Kliwon","Tolu"],["Rabu","Pon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Selasa","Wage","Gumbreg"],["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],
  ["Rabu","Pahing","Warigalit"],["Sabtu","Kliwon","Warigalit"],["Selasa","Pon","Warigagung"],
  ["Jumat","Legi","Warigagung"],["Senin","Wage","Julungwangi"],["Kamis","Pahing","Julungwangi"],
  ["Minggu","Kliwon","Sungsang"],["Rabu","Pon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Selasa","Wage","Galungan"],["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],
  ["Rabu","Pahing","Kuningan"],["Sabtu","Kliwon","Kuningan"],["Selasa","Pon","Langkir"],
  ["Jumat","Legi","Langkir"],["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Kamis","Legi","Pahang"],["Jumat","Pahing","Pahang"],
  ["Rabu","Pahing","Kuruwelut"],["Sabtu","Kliwon","Kuruwelut"],["Selasa","Pon","Marakeh"],
  ["Jumat","Legi","Marakeh"],["Senin","Wage","Tambir"],["Kamis","Pahing","Tambir"],
  ["Minggu","Kliwon","Medangkungan"],["Rabu","Pon","Medangkungan"],["Sabtu","Legi","Medangkungan"],
  ["Selasa","Wage","Maktal"],["Kamis","Legi","Maktal"],["Jumat","Pahing","Maktal"],
  ["Rabu","Pahing","Wuye"],["Sabtu","Kliwon","Wuye"],["Selasa","Pon","Manahil"],
  ["Senin","Wage","Prangbakat"],["Kamis","Pahing","Prangbakat"],["Minggu","Kliwon","Bala"],
  ["Rabu","Pon","Bala"],["Sabtu","Legi","Bala"],["Selasa","Wage","Wugu"],
  ["Kamis","Legi","Wugu"],["Jumat","Pahing","Wugu"],["Rabu","Pahing","Wayang"],
  ["Sabtu","Kliwon","Wayang"],["Selasa","Pon","Kulawu"],["Jumat","Legi","Kulawu"],
  ["Senin","Wage","Dukut"],["Kamis","Pahing","Dukut"],["Minggu","Kliwon","Watugunung"],
  ["Rabu","Pon","Watugunung"],["Sabtu","Legi","Watugunung"]
];

// 2. Data Master Resmi Dino Ijo (74 Pasangan Dino, Pasaran, Wuku)
export const DINO_IJO_LIST = [
  ["Kamis","Legi","Sinta"],["Jumat","Pahing","Sinta"],["Senin","Kliwon","Landep"],
  ["Kamis","Pon","Landep"],["Minggu","Legi","Wukir"],["Selasa","Pon","Wukir"],
  ["Rabu","Wage","Wukir"],["Sabtu","Pahing","Wukir"],["Senin","Wage","Kurantil"],
  ["Jumat","Pon","Kurantil"],["Minggu","Kliwon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],["Sabtu","Kliwon","Warigalit"],
  ["Selasa","Pon","Warigagung"],["Rabu","Wage","Warigagung"],["Senin","Wage","Julungwangi"],
  ["Kamis","Pahing","Julungwangi"],["Minggu","Kliwon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],["Senin","Kliwon","Kuningan"],
  ["Kamis","Pon","Kuningan"],["Minggu","Legi","Langkir"],["Selasa","Pon","Langkir"],
  ["Rabu","Wage","Langkir"],["Jumat","Legi","Langkir"],["Sabtu","Pahing","Langkir"],
  ["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],["Jumat","Pon","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Jumat","Pahing","Pahang"],["Senin","Kliwon","Kuruwelut"],
  ["Kamis","Pon","Kuruwelut"],["Minggu","Legi","Marakeh"],["Jumat","Legi","Marakeh"],
  ["Sabtu","Pahing","Marakeh"],["Kamis","Pahing","Tambir"],["Jumat","Pon","Tambir"],
  ["Rabu","Pon","Medangkungan"],["Selasa","Wage","Maktal"],["Kamis","Legi","Maktal"],
  ["Sabtu","Kliwon","Wuye"],["Minggu","Legi","Manahil"],["Selasa","Pon","Manahil"],
  ["Jumat","Legi","Manahil"],["Sabtu","Pahing","Manahil"],["Senin","Wage","Prangbakat"],
  ["Kamis","Pahing","Prangbakat"],["Jumat","Pon","Prangbakat"],["Minggu","Kliwon","Bala"],
  ["Sabtu","Legi","Bala"],["Selasa","Wage","Wugu"],["Kamis","Legi","Wugu"],
  ["Jumat","Pahing","Wugu"],["Senin","Kliwon","Wayang"],["Sabtu","Kliwon","Wayang"],
  ["Minggu","Legi","Kulawu"],["Selasa","Pon","Kulawu"],["Rabu","Wage","Kulawu"],
  ["Jumat","Legi","Kulawu"],["Sabtu","Pahing","Kulawu"],["Senin","Wage","Dukut"],
  ["Kamis","Pahing","Dukut"],["Jumat","Pon","Dukut"],["Minggu","Kliwon","Watugunung"],
  ["Rabu","Pon","Watugunung"],["Sabtu","Legi","Watugunung"]
];

// 3. Normalisasi Kunci Pencarian Fleksibel (Dina, Pasaran, Wuku / Wuku, Dina, Pasaran)
const HARI_NAMES_SET = new Set(['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
const PASARAN_NAMES_SET = new Set(['legi', 'pahing', 'pon', 'wage', 'kliwon']);

export function parseDinoWukuArgs(a, b, c) {
  let dino = '', pasaran = '', wuku = '';
  if (typeof a === 'object' && a !== null) {
    dino = a.dino || a.hari || '';
    pasaran = a.pasaran || a.pas || '';
    wuku = a.wuku || a.wukuName || '';
  } else if (typeof a === 'string' && (b === undefined || b === null || b === '')) {
    const parts = a.split(/[\s_\-]+/);
    if (parts.length === 3) {
      return parseDinoWukuArgs(parts[0], parts[1], parts[2]);
    }
  } else {
    const args = [String(a || '').trim(), String(b || '').trim(), String(c || '').trim()];
    for (const arg of args) {
      const lower = arg.toLowerCase();
      if (!dino && HARI_NAMES_SET.has(lower)) {
        dino = arg;
      } else if (!pasaran && PASARAN_NAMES_SET.has(lower)) {
        pasaran = arg;
      } else if (!wuku) {
        wuku = arg;
      }
    }
    if (!wuku && args[2]) wuku = args[2];
    if (!dino && args[0]) dino = args[0];
    if (!pasaran && args[1]) pasaran = args[1];
  }
  return {
    dino: dino.trim(),
    pasaran: pasaran.trim(),
    wuku: wuku.trim().replace(/[\s\-_]/g, '')
  };
}

export function normDinoWukuKey(a, b, c) {
  const { dino, pasaran, wuku } = parseDinoWukuArgs(a, b, c);
  const d = dino.toLowerCase();
  const p = pasaran.toLowerCase();
  const w = wuku.toLowerCase()
    .replace(/^shinto$/, 'sinta')
    .replace(/^sinto$/, 'sinta')
    .replace(/^wariagung$/, 'warigagung')
    .replace(/^madangkungan$/, 'medangkungan')
    .replace(/^mendangkungan$/, 'medangkungan')
    .replace(/^manail$/, 'manahil')
    .replace(/^watugunung$/, 'watugunung')
    .replace(/^julungwangi$/, 'julungwangi')
    .replace(/^julungpujut$/, 'julungpujut');
  return `${w}_${d}_${p}`;
}

// 4. Struktur Set & Lookup Table O(1) Abadi
export const DINO_GEDE_SET = new Set();
DINO_GEDE_LIST.forEach(([d, p, w]) => {
  DINO_GEDE_SET.add(normDinoWukuKey(w, d, p));
  DINO_GEDE_SET.add(normDinoWukuKey(d, p, w));
  DINO_GEDE_SET.add(`${String(d).toLowerCase()}_${String(p).toLowerCase()}_${String(w).toLowerCase().replace(/[\s\-_]/g, '')}`);
  DINO_GEDE_SET.add(`${String(w).toLowerCase().replace(/[\s\-_]/g, '')}_${String(d).toLowerCase()}_${String(p).toLowerCase()}`);
});

export const DINO_IJO_SET = new Set();
DINO_IJO_LIST.forEach(([d, p, w]) => {
  DINO_IJO_SET.add(normDinoWukuKey(w, d, p));
  DINO_IJO_SET.add(normDinoWukuKey(d, p, w));
  DINO_IJO_SET.add(`${String(d).toLowerCase()}_${String(p).toLowerCase()}_${String(w).toLowerCase().replace(/[\s\-_]/g, '')}`);
  DINO_IJO_SET.add(`${String(w).toLowerCase().replace(/[\s\-_]/g, '')}_${String(d).toLowerCase()}_${String(p).toLowerCase()}`);
});

// Map kamus terpadu
export const DINO_LOOKUP_MAP = Object.create(null);
DINO_GEDE_LIST.forEach(([d, p, w]) => {
  const key = normDinoWukuKey(w, d, p);
  DINO_LOOKUP_MAP[key] = { isGede: true, isIjo: DINO_IJO_SET.has(key) };
});
DINO_IJO_LIST.forEach(([d, p, w]) => {
  const key = normDinoWukuKey(w, d, p);
  if (!DINO_LOOKUP_MAP[key]) {
    DINO_LOOKUP_MAP[key] = { isGede: false, isIjo: true };
  }
});

/**
 * Fungsi pembantu pengecekan fleksibel:
 * Menerima (wuku, hari, pasaran) ATAU (hari, pasaran, wuku) ATAU objek ATAU string tunggal
 */
export function isDinoGede(a, b, c) {
  const key = normDinoWukuKey(a, b, c);
  return DINO_GEDE_SET.has(key);
}

export function isDinoIjo(a, b, c) {
  const key = normDinoWukuKey(a, b, c);
  return DINO_IJO_SET.has(key);
}

/**
 * 5. Evaluasi Status Warna, Badge, dan Label Kalender Jawa (Dua Tahap / Two-Layer Logic)
 * 
 * Tahap 1: Penentuan Warna Dasar (Dino Ijo vs Dino Abang)
 * - Dino Ijo: Pasangan (Wuku, Dino, Pasaran) tercantum ing database_nujum - dino_ijo.csv -> Blok bawah HIJAU SOLID (#16a34a).
 * - Dino Abang: Sedaya dina ing njawi daptar Dino Ijo kanthi otomatis dados Dino Abang -> Blok bawah DINO ABANG (#dc2626).
 * - Angka dinten Minggu lan Prei Nasional wajib abrit ing tingkat inggil.
 * 
 * Tahap 2: Pemberian Penanda Khusus Dino Gede (Border Emas & Bintang ★)
 * - Pengecekan mandhiri dhateng database_nujum - dino_gede.csv.
 * - Manawi wonten ing daptar Dino Gede, tambahi penanda khusus border emas (border: 2px solid #eab308;) lan bintang ★.
 * - PENTING: Dino Gede TIDAK BOLEH mengubah warna blok bawah menjadi kuning. Blok bawah tetap wajib mempertahankan warna aslinya (Hijau atau Merah).
 */
export function getDinoWarnaStatus(a, b, c, isMinggu = false, isLibur = false, code = '') {
  const key = normDinoWukuKey(a, b, c);
  const isIjo = DINO_IJO_SET.has(key);
  const isGede = DINO_GEDE_SET.has(key);

  // Tahap 1: Penentuan Warna Dasar Blok Bawah
  const status = isIjo ? 'ijo' : 'abang';
  const bottomBg = isIjo ? '#16a34a' : '#dc2626'; // Hijau Solid vs Dino Abang
  const bottomBgClass = isIjo ? 'bg-dino-ijo' : 'bg-dino-abang';
  const bottomTextColor = '#ffffff';

  const baseLabel = isIjo ? 'Dino Ijo / Becik' : 'Dina Ala / Kang Olo';
  const label = isGede ? `${baseLabel} · Dino Gede` : baseLabel;

  // Tahap 2: Penanda Khusus Dino Gede (Border / Outline Emas Bercahaya 2px solid #eab308)
  const cellBorder = isGede ? '#eab308' : (isIjo ? '#86efac' : '#fca5a5');
  const cellBorderStyle = isGede
    ? 'border: 2px solid #eab308; box-shadow: 0 0 10px rgba(234, 179, 8, 0.45);'
    : 'border: 1px solid #cbd5e1;';

  const alaSuffix = code ? `${code} Ala` : 'Ala';
  const baseBadgeText = isIjo ? '✓ Becik' : `▲ ${alaSuffix}`;
  const baseBadgeHtml = isIjo
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#16a34a] text-white shadow-xs" title="Dina Ijo / Becik">✓ Becik</span>'
    : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#dc2626] text-white shadow-xs" title="${baseLabel}">▲ ${alaSuffix}</span>`;

  const gedeBadgeText = isGede ? '★ GEDE' : '';
  const gedeBadgeHtml = isGede
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-[#eab308] text-amber-950 border border-[#ca8a04] shadow-xs" title="Dino Gede">★ GEDE</span>'
    : '';

  const badgeText = isGede ? `${isIjo ? '✓ Becik' : `▲ ${alaSuffix}`} · ★ GEDE` : baseBadgeText;
  const badgeHtml = isGede ? `${gedeBadgeHtml} ${baseBadgeHtml}` : baseBadgeHtml;

  // Latar sel untuk kompatibilitas tampilan lama
  const cellBg = isIjo ? '#f0fdf4' : '#fef2f2';
  const cellText = isIjo ? '#14532d' : '#7f1d1d';

  return {
    isGede,
    isIjo,
    status,
    bottomBg,
    bottomBgClass,
    bottomTextColor,
    label,
    cellBg,
    cellBorder,
    cellBorderStyle,
    cellText,
    badgeText,
    badgeHtml,
    baseBadgeText,
    baseBadgeHtml,
    gedeBadgeText,
    gedeBadgeHtml
  };
}

// 6. Global Browser & CommonJS Export
if (typeof window !== 'undefined') {
  window.STANDARD_WUKU_LIST = STANDARD_WUKU_LIST;
  window.DINO_GEDE_LIST = DINO_GEDE_LIST;
  window.DINO_IJO_LIST = DINO_IJO_LIST;
  window.normDinoWukuKey = normDinoWukuKey;
  window.DINO_GEDE_SET = DINO_GEDE_SET;
  window.DINO_IJO_SET = DINO_IJO_SET;
  window.DINO_LOOKUP_MAP = DINO_LOOKUP_MAP;
  window.isDinoGede = isDinoGede;
  window.isDinoIjo = isDinoIjo;
  window.getDinoWarnaStatus = getDinoWarnaStatus;
  window.DINO_RULES = {
    STANDARD_WUKU_LIST,
    DINO_GEDE_LIST,
    DINO_IJO_LIST,
    normDinoWukuKey,
    DINO_GEDE_SET,
    DINO_IJO_SET,
    DINO_LOOKUP_MAP,
    isDinoGede,
    isDinoIjo,
    getDinoWarnaStatus
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STANDARD_WUKU_LIST,
    DINO_GEDE_LIST,
    DINO_IJO_LIST,
    normDinoWukuKey,
    DINO_GEDE_SET,
    DINO_IJO_SET,
    DINO_LOOKUP_MAP,
    isDinoGede,
    isDinoIjo,
    getDinoWarnaStatus
  };
}
