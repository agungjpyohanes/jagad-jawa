/**
 * JAGAD JAWA - Master Database Pawukon Dino Gede & Dino Ijo
 * Berdasarkan Urutan Baku 1 s.d. 30 Sesuai Master Tabel Babon Resmi
 */

export const WUKU_LIST = [
  "Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit",
  "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir",
  "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir",
  "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu",
  "Wayang", "Kulawu", "Dukut", "Watugunung"
];

export function normalizeWuku(wuku) {
  if (!wuku) return "";
  const clean = wuku.trim().toLowerCase();
  for (const standard of WUKU_LIST) {
    if (standard.toLowerCase() === clean) return standard;
  }
  const map = {
    "shinto": "Sinta", "sinto": "Sinta",
    "warigalagung": "Warigagung",
    "julung wangi": "Julungwangi",
    "julung pujut": "Julungpujut",
    "madangkungan": "Medangkungan",
    "watu gunung": "Watugunung"
  };
  return map[clean] || WUKU_LIST[0];
}

// 1. DAFTAR MASTER DINO IJO (Sesuai List Terbaru)
export const DINO_IJO_DATA = [
  // Sinta
  { wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
  // Landep
  { wuku: "Landep", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Landep", dino: "Kamis", pasaran: "Pon" },
  // Wukir
  { wuku: "Wukir", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Wukir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Wukir", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Wukir", dino: "Sabtu", pasaran: "Pahing" },
  // Kurantil
  { wuku: "Kurantil", dino: "Senin", pasaran: "Wage" },
  { wuku: "Kurantil", dino: "Jumat", pasaran: "Pon" },
  // Tolu
  { wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
  // Gumbreg
  { wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
  // Warigagung (Warigalagung)
  { wuku: "Warigagung", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Warigagung", dino: "Kamis", pasaran: "Kliwon" },
  // Sungsang
  { wuku: "Sungsang", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
  // Galungan
  { wuku: "Galungan", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Galungan", dino: "Jumat", pasaran: "Pahing" },
  // Kuningan
  { wuku: "Kuningan", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Kuningan", dino: "Kamis", pasaran: "Pon" },
  // Langkir
  { wuku: "Langkir", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Langkir", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Langkir", dino: "Kamis", pasaran: "Kliwon" },
  { wuku: "Langkir", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Langkir", dino: "Sabtu", pasaran: "Pahing" },
  // Mandasiya
  { wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
  { wuku: "Mandasiya", dino: "Jumat", pasaran: "Pon" },
  // Julungpujut
  { wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Julungpujut", dino: "Sabtu", pasaran: "Legi" },
  // Pahang
  { wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Pahang", dino: "Kamis", pasaran: "Legi" },
  // Kuruwelut
  { wuku: "Kuruwelut", dino: "Senin", pasaran: "Kliwon" },
  { wuku: "Kuruwelut", dino: "Kamis", pasaran: "Pon" },
  // Marakeh
  { wuku: "Marakeh", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Marakeh", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Marakeh", dino: "Kamis", pasaran: "Kliwon" },
  { wuku: "Marakeh", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Marakeh", dino: "Sabtu", pasaran: "Pahing" },
  // Tambir
  { wuku: "Tambir", dino: "Senin", pasaran: "Wage" },
  { wuku: "Tambir", dino: "Jumat", pasaran: "Pon" },
  // Medangkungan
  { wuku: "Medangkungan", dino: "Rabu", pasaran: "Pon" },
  // Maktal
  { wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Maktal", dino: "Kamis", pasaran: "Legi" },
  // Wuye
  { wuku: "Wuye", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
  // Manahil
  { wuku: "Manahil", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Manahil", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Manahil", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Manahil", dino: "Kamis", pasaran: "Kliwon" },
  { wuku: "Manahil", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Manahil", dino: "Sabtu", pasaran: "Pahing" },
  // Prangbakat
  { wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
  { wuku: "Prangbakat", dino: "Jumat", pasaran: "Pon" },
  // Bala
  { wuku: "Bala", dino: "Minggu", pasaran: "Kliwon" },
  // Wugu
  { wuku: "Wugu", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
  // Wayang
  { wuku: "Wayang", dino: "Selasa", pasaran: "Pon" },
  { wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
  // Kulawu
  { wuku: "Kulawu", dino: "Minggu", pasaran: "Legi" },
  { wuku: "Kulawu", dino: "Rabu", pasaran: "Wage" },
  { wuku: "Kulawu", dino: "Kamis", pasaran: "Kliwon" },
  { wuku: "Kulawu", dino: "Jumat", pasaran: "Legi" },
  { wuku: "Kulawu", dino: "Sabtu", pasaran: "Pahing" },
  // Dukut
  { wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
  { wuku: "Dukut", dino: "Jumat", pasaran: "Pon" },
  // Watugunung
  { wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Watugunung", dino: "Sabtu", pasaran: "Legi" }
];

// 2. DAFTAR MASTER DINO GEDE (Sesuai List Terbaru)
export const DINO_GEDE_DATA = [
  // Sinta
  { wuku: "Sinta", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
  // Landep
  { wuku: "Landep", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Landep", dino: "Sabtu", pasaran: "Kliwon" },
  // Wukir
  { wuku: "Wukir", dino: "Senin", pasaran: "Pahing" },
  { wuku: "Wukir", dino: "Selasa", pasaran: "Pon" }, // Termasuk catatan Langkir/Wukir
  // Kurantil
  { wuku: "Kurantil", dino: "Selasa", pasaran: "Kliwon" },
  { wuku: "Kurantil", dino: "Kamis", pasaran: "Pahing" },
  // Tolu
  { wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Tolu", dino: "Rabu", pasaran: "Pon" },
  { wuku: "Tolu", dino: "Sabtu", pasaran: "Legi" },
  // Gumbreg
  { wuku: "Gumbreg", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
  { wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
  // Warigalit
  { wuku: "Warigalit", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Warigalit", dino: "Sabtu", pasaran: "Kliwon" },
  // Warigagung
  { wuku: "Warigagung", dino: "Senin", pasaran: "Pon" },
  // Julungwangi
  { wuku: "Julungwangi", dino: "Senin", pasaran: "Wage" },
  { wuku: "Julungwangi", dino: "Kamis", pasaran: "Pahing" },
  // Sungsang
  { wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
  // Galungan
  { wuku: "Galungan", dino: "Selasa", pasaran: "Wage" },
  // Kuningan
  { wuku: "Kuningan", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Kuningan", dino: "Sabtu", pasaran: "Kliwon" },
  // Langkir
  { wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
  // Mandasiya
  { wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
  { wuku: "Mandasiya", dino: "Kamis", pasaran: "Pahing" },
  // Julungpujut
  { wuku: "Julungpujut", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
  // Pahang
  { wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
  // Kuruwelut
  { wuku: "Kuruwelut", dino: "Rabu", pasaran: "Pahing" },
  // Marakeh
  { wuku: "Marakeh", dino: "Selasa", pasaran: "Pon" },
  // Tambir
  { wuku: "Tambir", dino: "Senin", pasaran: "Wage" },
  { wuku: "Tambir", dino: "Kamis", pasaran: "Pahing" },
  // Medangkungan
  { wuku: "Medangkungan", dino: "Minggu", pasaran: "Kliwon" },
  // Maktal
  { wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Maktal", dino: "Jumat", pasaran: "Pahing" },
  // Wuye
  { wuku: "Wuye", dino: "Kamis", pasaran: "Pahing" },
  { wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
  // Prangbakat
  { wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
  { wuku: "Prangbakat", dino: "Kamis", pasaran: "Pahing" },
  // Bala
  { wuku: "Bala", dino: "Rabu", pasaran: "Pon" },
  // Wugu
  { wuku: "Wugu", dino: "Selasa", pasaran: "Wage" },
  { wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
  // Wayang
  { wuku: "Wayang", dino: "Rabu", pasaran: "Pahing" },
  { wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
  // Dukut
  { wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
  { wuku: "Dukut", dino: "Kamis", pasaran: "Pahing" },
  // Watugunung
  { wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
  { wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" }
];

const makeKey = (wuku, dino, pasaran) => `${normalizeWuku(wuku)}_${dino.trim()}_${pasaran.trim()}`.toLowerCase();

export const GEDE_SET = new Set(DINO_GEDE_DATA.map(d => makeKey(d.wuku, d.dino, d.pasaran)));
export const IJO_SET = new Set(DINO_IJO_DATA.map(d => makeKey(d.wuku, d.dino, d.pasaran)));

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