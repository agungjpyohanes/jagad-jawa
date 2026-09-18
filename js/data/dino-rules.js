/**
 * Jagad Jawa — Kamus Data & Aturan Penandaan Kalender Jawa
 * (Dino Gede, Dino Ijo, & Dino Abang)
 * 
 * Rujukan resmi:
 * - database_nujum - dino_gede.csv (71 kombinasi resmi)
 * - database_nujum - dino_ijo.csv (74 kombinasi resmi)
 * - Primbon Pawukon Keraton Surakarta & Ngayogyakarta Hadiningrat
 */

// 1. Data Master Resmi Dino Gede (71 Pasangan Dino, Pasaran, Wuku)
export const DINO_GEDE_LIST = [
  ["Selasa","Wage","Sinto"],["Kamis","Legi","Sinto"],["Jumat","Pahing","Sinto"],
  ["Rabu","Pahing","Landep"],["Sabtu","Kliwon","Landep"],["Selasa","Pon","Wukir"],
  ["Jumat","Legi","Wukir"],["Senin","Wage","Kurantil"],["Kamis","Pahing","Kurantil"],
  ["Minggu","Kliwon","Tolu"],["Rabu","Pon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Selasa","Wage","Gumbreg"],["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],
  ["Rabu","Pahing","Warigalit"],["Sabtu","Kliwon","Warigalit"],["Selasa","Pon","Wariagung"],
  ["Jumat","Legi","Wariagung"],["Senin","Wage","Julungwangi"],["Kamis","Pahing","Julungwangi"],
  ["Minggu","Kliwon","Sungsang"],["Rabu","Pon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Selasa","Wage","Galungan"],["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],
  ["Rabu","Pahing","Kuningan"],["Sabtu","Kliwon","Kuningan"],["Selasa","Pon","Langkir"],
  ["Jumat","Legi","Langkir"],["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Kamis","Legi","Pahang"],["Jumat","Pahing","Pahang"],
  ["Rabu","Pahing","Kuruwelut"],["Sabtu","Kliwon","Kuruwelut"],["Selasa","Pon","Marakeh"],
  ["Jumat","Legi","Marakeh"],["Senin","Wage","Tambir"],["Kamis","Pahing","Tambir"],
  ["Minggu","Kliwon","Madangkungan"],["Rabu","Pon","Madangkungan"],["Sabtu","Legi","Madangkungan"],
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
  ["Kamis","Legi","Sinto"],["Jumat","Pahing","Sinto"],["Senin","Kliwon","Landep"],
  ["Kamis","Pon","Landep"],["Minggu","Legi","Wukir"],["Selasa","Pon","Wukir"],
  ["Rabu","Wage","Wukir"],["Sabtu","Pahing","Wukir"],["Senin","Wage","Kurantil"],
  ["Jumat","Pon","Kurantil"],["Minggu","Kliwon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],["Sabtu","Kliwon","Warigalit"],
  ["Selasa","Pon","Wariagung"],["Rabu","Wage","Wariagung"],["Senin","Wage","Julungwangi"],
  ["Kamis","Pahing","Julungwangi"],["Minggu","Kliwon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],["Senin","Kliwon","Kuningan"],
  ["Kamis","Pon","Kuningan"],["Minggu","Legi","Langkir"],["Selasa","Pon","Langkir"],
  ["Rabu","Wage","Langkir"],["Jumat","Legi","Langkir"],["Sabtu","Pahing","Langkir"],
  ["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],["Jumat","Pon","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Jumat","Pahing","Pahang"],["Senin","Kliwon","Kuruwelut"],
  ["Kamis","Pon","Kuruwelut"],["Minggu","Legi","Marakeh"],["Jumat","Legi","Marakeh"],
  ["Sabtu","Pahing","Marakeh"],["Kamis","Pahing","Tambir"],["Jumat","Pon","Tambir"],
  ["Rabu","Pon","Madangkungan"],["Selasa","Wage","Maktal"],["Kamis","Legi","Maktal"],
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
    .replace(/^shinto$/, 'sinto')
    .replace(/^wariagung$/, 'warigagung')
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
  } else if (typeof c === 'string' && (c.toLowerCase().startsWith('wuk') || c.toLowerCase().startsWith('sin') || c.toLowerCase().startsWith('lan') || c.toLowerCase().startsWith('tol') || c.toLowerCase().startsWith('gum') || c.toLowerCase().startsWith('sung') || c.toLowerCase().startsWith('gal') || c.toLowerCase().startsWith('kun') || c.toLowerCase().startsWith('lang') || c.toLowerCase().startsWith('man') || c.toLowerCase().startsWith('pah') || c.toLowerCase().startsWith('kur') || c.toLowerCase().startsWith('mar') || c.toLowerCase().startsWith('tam') || c.toLowerCase().startsWith('mad') || c.toLowerCase().startsWith('mak') || c.toLowerCase().startsWith('wuy') || c.toLowerCase().startsWith('prang') || c.toLowerCase().startsWith('bal') || c.toLowerCase().startsWith('wug') || c.toLowerCase().startsWith('way') || c.toLowerCase().startsWith('kul') || c.toLowerCase().startsWith('duk') || c.toLowerCase().startsWith('wat'))) {
    d = a; p = b; w = c;
  } else {
    // Diasumsikan (wuku, hari, pasaran)
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
  } else if (typeof c === 'string' && (c.toLowerCase().startsWith('wuk') || c.toLowerCase().startsWith('sin') || c.toLowerCase().startsWith('lan') || c.toLowerCase().startsWith('tol') || c.toLowerCase().startsWith('gum') || c.toLowerCase().startsWith('sung') || c.toLowerCase().startsWith('gal') || c.toLowerCase().startsWith('kun') || c.toLowerCase().startsWith('lang') || c.toLowerCase().startsWith('man') || c.toLowerCase().startsWith('pah') || c.toLowerCase().startsWith('kur') || c.toLowerCase().startsWith('mar') || c.toLowerCase().startsWith('tam') || c.toLowerCase().startsWith('mad') || c.toLowerCase().startsWith('mak') || c.toLowerCase().startsWith('wuy') || c.toLowerCase().startsWith('prang') || c.toLowerCase().startsWith('bal') || c.toLowerCase().startsWith('wug') || c.toLowerCase().startsWith('way') || c.toLowerCase().startsWith('kul') || c.toLowerCase().startsWith('duk') || c.toLowerCase().startsWith('wat'))) {
    d = a; p = b; w = c;
  } else {
    // Diasumsikan (wuku, hari, pasaran)
    w = a; d = b; p = c;
  }
  return DINO_IJO_SET.has(normDinoWukuKey(d, p, w));
}

/**
 * 5. Evaluasi Status Warna, Badge, dan Label Kalender Jawa
 * 
 * Aturan Penandaan Presisi:
 * - Dino Gede: Badge / Latar Kuning Emas Menyala bertuliskan '★ GEDE' (#d4af37 / #fef08a)
 * - Dino Ijo: Penanda warna Hijau bertuliskan '✓ Becik' (#f0fdf4 / #86efac) jika bukan Minggu/Libur
 * - Dino Abang / Lainnya: Penanda warna Merah ('▲ Ala', '▲ PRK Ala', dll.) serta Hari Minggu & Libur Nasional otomatis Merah
 */
export function getDinoWarnaStatus(dino, pasaran, wuku, isMinggu = false, isLibur = false, code = '') {
  const key = normDinoWukuKey(dino, pasaran, wuku);
  const isGede = DINO_GEDE_SET.has(key);
  const isIjo = !isGede && DINO_IJO_SET.has(key);

  let status = 'abang';
  let label = 'Dina Ala / Kang Olo';
  let cellBg = '#fef2f2';
  let cellBorder = '#fca5a5';
  let cellText = '#7f1d1d';
  
  // Format badge merah: misal '▲ Ala' atau '▲ PRK Ala'
  const alaSuffix = code ? `${code} Ala` : 'Ala';
  let badgeText = `▲ ${alaSuffix}`;
  let badgeHtml = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#dc2626] text-white shadow-xs" title="Dina Ala / Kang Olo">▲ ${alaSuffix}</span>`;

  if (isGede) {
    status = 'gede';
    label = 'Dino Gede';
    cellBg = 'linear-gradient(135deg, #fffbeb 0%, #fef08a 60%, #fde047 100%)';
    cellBorder = '#d4af37';
    cellText = '#451a03';
    badgeText = '★ GEDE';
    badgeHtml = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-[#9a3412] text-white shadow-xs" title="Dino Gede">★ GEDE</span>';
  } else if (isIjo && !isMinggu && !isLibur) {
    status = 'ijo';
    label = 'Dino Ijo / Becik';
    cellBg = '#f0fdf4';
    cellBorder = '#86efac';
    cellText = '#14532d';
    badgeText = '✓ Becik';
    badgeHtml = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#16a34a] text-white shadow-xs" title="Dina Ijo / Becik">✓ Becik</span>';
  } else {
    status = 'abang';
    label = isLibur ? 'Libur Nasional' : (isMinggu ? 'Hari Minggu' : 'Dina Ala / Kang Olo');
    cellBg = '#fef2f2';
    cellBorder = '#fca5a5';
    cellText = '#7f1d1d';
    badgeText = `▲ ${alaSuffix}`;
    badgeHtml = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#dc2626] text-white shadow-xs" title="${label}">▲ ${alaSuffix}</span>`;
  }

  return {
    isGede,
    isIjo,
    status,
    label,
    cellBg,
    cellBorder,
    cellText,
    badgeText,
    badgeHtml
  };
}

// 6. Global Browser & CommonJS Export
if (typeof window !== 'undefined') {
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
