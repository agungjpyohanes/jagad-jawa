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

// 3. Normalisasi Kunci Pencarian (Dina, Pasaran, Wuku)
export function normDinoWukuKey(dino, pasaran, wuku) {
  const d = String(dino || '').trim().toLowerCase();
  const p = String(pasaran || '').trim().toLowerCase();
  const w = String(wuku || '').trim().toLowerCase()
    .replace(/[\s\-_]/g, '')
    .replace(/^shinto$/, 'sinta')
    .replace(/^sinto$/, 'sinta')
    .replace(/^wariagung$/, 'warigagung')
    .replace(/^madangkungan$/, 'medangkungan')
    .replace(/^mendangkungan$/, 'medangkungan')
    .replace(/^manail$/, 'manahil')
    .replace(/^watugunung$/, 'watugunung')
    .replace(/^julungwangi$/, 'julungwangi')
    .replace(/^julungpujut$/, 'julungpujut');
  return `${d}_${p}_${w}`;
}

// 4. Struktur Set & Lookup Table O(1)
export const DINO_GEDE_SET = new Set(DINO_GEDE_LIST.map(([d, p, w]) => normDinoWukuKey(d, p, w)));
export const DINO_IJO_SET = new Set(DINO_IJO_LIST.map(([d, p, w]) => normDinoWukuKey(d, p, w)));

// Map kamus terpadu
export const DINO_LOOKUP_MAP = Object.create(null);
DINO_GEDE_LIST.forEach(([d, p, w]) => {
  const key = normDinoWukuKey(d, p, w);
  DINO_LOOKUP_MAP[key] = { isGede: true, isIjo: DINO_IJO_SET.has(key) };
});
DINO_IJO_LIST.forEach(([d, p, w]) => {
  const key = normDinoWukuKey(d, p, w);
  if (!DINO_LOOKUP_MAP[key]) {
    DINO_LOOKUP_MAP[key] = { isGede: false, isIjo: true };
  }
});

const HARI_NAMES = new Set(['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);

/**
 * Fungsi pembantu pengecekan fleksibel:
 * Menerima (wuku, hari, pasaran) ATAU (hari, pasaran, wuku) ATAU objek
 */
export function isDinoGede(a, b, c) {
  let d, p, w;
  if (typeof a === 'object' && a !== null) {
    d = a.dino || a.hari;
    p = a.pasaran || a.pas;
    w = a.wuku || a.wukuName;
  } else if (typeof a === 'string' && HARI_NAMES.has(a.trim().toLowerCase())) {
    d = a; p = b; w = c;
  } else {
    w = a; d = b; p = c;
  }
  return DINO_GEDE_SET.has(normDinoWukuKey(d, p, w));
}

export function isDinoIjo(a, b, c) {
  let d, p, w;
  if (typeof a === 'object' && a !== null) {
    d = a.dino || a.hari;
    p = a.pasaran || a.pas;
    w = a.wuku || a.wukuName;
  } else if (typeof a === 'string' && HARI_NAMES.has(a.trim().toLowerCase())) {
    d = a; p = b; w = c;
  } else {
    w = a; d = b; p = c;
  }
  return DINO_IJO_SET.has(normDinoWukuKey(d, p, w));
}

/**
 * 5. Evaluasi Status Warna, Badge, dan Label Kalender Jawa (Dua Tahap / Two-Layer Logic)
 * 
 * Tahap 1: Penentuan Warna Dasar (Dino Ijo vs Dino Abang)
 * - Dino Ijo: Pasangan (Wuku, Dino, Pasaran) tercantum ing database_nujum - dino_ijo.csv -> Warna dasar Hijau ('✓ Becik').
 * - Dino Abang: Sedaya dina ing njawi daptar Dino Ijo kanthi otomatis dados Dino Abang ('▲ Ala').
 * - Angka dinten Minggu lan Prei Nasional wajib abrit.
 * 
 * Tahap 2: Pemberian Penanda Khusus Dino Gede (Overlay / Badge Emas)
 * - Pengecekan mandhiri dhateng database_nujum - dino_gede.csv.
 * - Manawi wonten ing daptar Dino Gede, tambahi penanda khusus '★ GEDE' (aksen emas/kuning kontras).
 * - Dino Gede nempel sae ing Dino Ijo utawi Dino Abang tanpa ngrisak warna dhasaripun.
 */
export function getDinoWarnaStatus(dino, pasaran, wuku, isMinggu = false, isLibur = false, code = '') {
  const key = normDinoWukuKey(dino, pasaran, wuku);
  const isIjo = DINO_IJO_SET.has(key);
  const isGede = DINO_GEDE_SET.has(key);

  // Tahap 1: Penentuan Warna Dasar & Badge Dasar
  const status = isIjo ? 'ijo' : 'abang';
  const baseLabel = isIjo ? 'Dino Ijo / Becik' : 'Dina Ala / Kang Olo';
  
  const alaSuffix = code ? `${code} Ala` : 'Ala';
  const baseBadgeText = isIjo ? '✓ Becik' : `▲ ${alaSuffix}`;
  const baseBadgeHtml = isIjo
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#16a34a] text-white shadow-xs" title="Dina Ijo / Becik">✓ Becik</span>'
    : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#dc2626] text-white shadow-xs" title="${baseLabel}">▲ ${alaSuffix}</span>`;

  let cellBg = isIjo ? '#f0fdf4' : '#fef2f2';
  let cellBorder = isIjo ? '#86efac' : '#fca5a5';
  let cellText = isIjo ? '#14532d' : '#7f1d1d';
  let label = baseLabel;

  // Tahap 2: Penanda Khusus Dino Gede (Overlay / Aksen Emas)
  const gedeBadgeText = isGede ? '★ GEDE' : '';
  const gedeBadgeHtml = isGede
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-[#d97706] text-amber-100 border border-[#b45309] shadow-xs" title="Dino Gede">★ GEDE</span>'
    : '';

  if (isGede) {
    label = `${baseLabel} · Dino Gede`;
    cellBorder = '#d4af37';
    if (isIjo) {
      // Warna dasar hijau tetap dominan, ditambah aksen kilau emas kontras
      cellBg = 'linear-gradient(135deg, #f0fdf4 75%, #fef08a 100%)';
    } else {
      // Warna dasar merah tetap dominan, ditambah aksen kilau emas kontras
      cellBg = 'linear-gradient(135deg, #fef2f2 75%, #fef08a 100%)';
    }
  }

  const badgeText = isGede ? (isIjo ? '★ GEDE · ✓ Becik' : `★ GEDE · ▲ ${alaSuffix}`) : baseBadgeText;
  const badgeHtml = isGede ? `${gedeBadgeHtml} ${baseBadgeHtml}` : baseBadgeHtml;

  return {
    isGede,
    isIjo,
    status,
    label,
    cellBg,
    cellBorder,
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
