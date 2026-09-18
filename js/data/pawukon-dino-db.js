/**
 * JAGAD JAWA - Master Database Pawukon Dino Gede & Dino Ijo
 * Penulisan 30 Wuku Baku (Sinta s.d. Watugunung)
 */

export const WUKU_LIST = [
  "Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit",
  "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir",
  "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir",
  "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu",
  "Wayang", "Kulawu", "Dukut", "Watugunung"
];

// Helper normalisasi nama wuku
export function normalizeWuku(wuku) {
  if (!wuku) return "";
  const map = {
    "shinto": "Sinta", "sinto": "Sinta",
    "wariagung": "Warigagung",
    "mandhalasia": "Mandasiya",
    "madangkungan": "Medangkungan",
    "mendangkungan": "Medangkungan",
    "manail": "Manahil"
  };
  const key = wuku.trim().toLowerCase();
  return map[key] || (wuku.charAt(0).toUpperCase() + wuku.slice(1).toLowerCase());
}

// 1. DAFTAR DINO GEDE RESMI (71 Entri)
export const DINO_GEDE_DATA = [
  { wuku: "Sinta", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Landep", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Landep", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Wukir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Wukir", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Kurantil", dino: "Senin", pasaran: "Wage" },
  { wuku: "Kurantil", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Tolu", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Tolu", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Warigalit", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Warigalit", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Warigagung", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Warigagung", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Julungwangi", dino: "Senin", pasaran: "Wage" },
  { wuku: "Julungwangi", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Sungsang", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Sungsang", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Galungan", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Galungan", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Galungan", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Kuningan", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Kuningan", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Langkir", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
  { wuku: "Mandasiya", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Julungpujut", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Julungpujut", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Pahang", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Pahang", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Kuruwelut", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Kuruwelut", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Marakeh", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Marakeh", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Tambir", dino: "Senin", pasaran: "Wage" },
  { wuku: "Tambir", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Medangkungan", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Medangkungan", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Medangkungan", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Maktal", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Maktal", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Wuye", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Manahil", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
  { wuku: "Prangbakat", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Bala", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Bala", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Bala", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Wugu", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Wugu", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Wayang", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Kulawu", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Kulawu", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
  { wuku: "Dukut", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Watugunung", dino: "Sabtu", pasaran: "Legi" }
];

// 2. DAFTAR DINO IJO RESMI (74 + 1 Entri Sesuai Master Babon)
export const DINO_IJO_DATA = [
  { wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Landep", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Landep", dino: "Kamis", pasaran: "Pon" },
  { wuku: "Wukir", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Wukir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Wukir", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Wukir", dino: "Sabtu", pasaran: "Pahing" },
  { wuku: "Kurantil", dino: "Senin", pasaran: "Wage" },
  { wuku: "Kurantil", dino: "Jumat", pasaran: "Pon" },
  { wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Tolu", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Warigalit", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Warigagung", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Warigagung", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Julungwangi", dino: "Senin", pasaran: "Wage" },
  { wuku: "Julungwangi", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Sungsang", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Galungan", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Galungan", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Kuningan", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Kuningan", dino: "Kamis", pasaran: "Pon" },
  { wuku: "Langkir", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Langkir", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Langkir", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Langkir", dino: "Sabtu", pasaran: "Pahing" },
  { wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
  { wuku: "Mandasiya", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Mandasiya", dino: "Jumat", pasaran: "Pon" },
  { wuku: "Julungpujut", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Julungpujut", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Pahang", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Kuruwelut", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Kuruwelut", dino: "Kamis", pasaran: "Pon" },
  { wuku: "Marakeh", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Marakeh", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Marakeh", dino: "Sabtu", pasaran: "Pahing" },
  { wuku: "Tambir", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Tambir", dino: "Jumat", pasaran: "Pon" },
  { wuku: "Medangkungan", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Maktal", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Manahil", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Manahil", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Manahil", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Manahil", dino: "Sabtu", pasaran: "Pahing" },
  { wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
  { wuku: "Prangbakat", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Prangbakat", dino: "Jumat", pasaran: "Pon" },
  { wuku: "Bala", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Bala", dino: "Sabtu", pasaran: "Legi" },
  { wuku: "Wugu", dino: "Senin", pasaran: "Pon" },       // Sesuai babon 9.jpeg (28 Sep 2026)
  { wuku: "Wugu", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Wugu", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
  { wuku: "Wayang", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
  { wuku: "Kulawu", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Kulawu", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Kulawu", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Kulawu", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Kulawu", dino: "Sabtu", pasaran: "Pahing" },
  { wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
  { wuku: "Dukut", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Dukut", dino: "Jumat", pasaran: "Pon" },
  { wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Watugunung", dino: "Sabtu", pasaran: "Legi" }
];

// Helper Set untuk O(1) Lookup
const HARI_SET = new Set(['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
const PASARAN_SET = new Set(['legi', 'pahing', 'pon', 'wage', 'kliwon']);

export const makeKey = (wuku, dino, pasaran) => {
  let w = String(wuku || '').trim();
  let d = String(dino || '').trim();
  let p = String(pasaran || '').trim();

  // Dukung input argumen fleksibel jika posisi tertukar
  if (HARI_SET.has(w.toLowerCase()) && !HARI_SET.has(d.toLowerCase())) {
    const tmp = d; d = w; w = tmp;
  }
  if (PASARAN_SET.has(w.toLowerCase()) && !PASARAN_SET.has(p.toLowerCase())) {
    const tmp = p; p = w; w = tmp;
  }
  if (PASARAN_SET.has(d.toLowerCase()) && HARI_SET.has(p.toLowerCase())) {
    const tmp = p; p = d; d = tmp;
  }

  return `${normalizeWuku(w)}_${d}_${p}`.toLowerCase();
};

export const GEDE_SET = new Set(DINO_GEDE_DATA.map(d => makeKey(d.wuku, d.dino, d.pasaran)));
export const IJO_SET = new Set(DINO_IJO_DATA.map(d => makeKey(d.wuku, d.dino, d.pasaran)));

// Tambahkan varian urutan dino_pasaran_wuku untuk kompatibilitas pencarian
DINO_GEDE_DATA.forEach(d => {
  GEDE_SET.add(`${d.dino}_${d.pasaran}_${normalizeWuku(d.wuku)}`.toLowerCase());
});
DINO_IJO_DATA.forEach(d => {
  IJO_SET.add(`${d.dino}_${d.pasaran}_${normalizeWuku(d.wuku)}`.toLowerCase());
});

export function evaluateDino(wuku, dino, pasaran) {
  const key = makeKey(wuku, dino, pasaran);
  const isGede = GEDE_SET.has(key);
  const isIjo = IJO_SET.has(key);
  return {
    isGede,
    isIjo,
    isAbang: !isIjo,
    baseColor: isIjo ? 'green' : 'red'
  };
}

// Browser & CommonJS Export
if (typeof window !== 'undefined') {
  window.WUKU_LIST = WUKU_LIST;
  window.normalizeWuku = normalizeWuku;
  window.DINO_GEDE_DATA = DINO_GEDE_DATA;
  window.DINO_IJO_DATA = DINO_IJO_DATA;
  window.makeKey = makeKey;
  window.GEDE_SET = GEDE_SET;
  window.IJO_SET = IJO_SET;
  window.evaluateDino = evaluateDino;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WUKU_LIST,
    normalizeWuku,
    DINO_GEDE_DATA,
    DINO_IJO_DATA,
    makeKey,
    GEDE_SET,
    IJO_SET,
    evaluateDino
  };
}
