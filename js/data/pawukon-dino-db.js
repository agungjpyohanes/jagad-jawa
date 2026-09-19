/**
 * JAGAD JAWA - Master Database Pawukon Dino Gede & Dino Ijo
 * Berdasarkan Urutan Baku 1 s.d. 30 (Tabel Dununge Dino lan Wuku Kang Olo)
 */

(function (root) {
  const WUKU_LIST = [
    "Sinta",        // 1
    "Landep",       // 2
    "Wukir",        // 3
    "Kurantil",     // 4
    "Tolu",         // 5
    "Gumbreg",      // 6
    "Warigalit",    // 7
    "Warigagung",   // 8
    "Julungwangi",  // 9
    "Sungsang",     // 10
    "Galungan",     // 11
    "Kuningan",     // 12
    "Langkir",      // 13
    "Mandasiya",    // 14
    "Julungpujut",  // 15
    "Pahang",       // 16
    "Kuruwelut",    // 17
    "Marakeh",      // 18
    "Tambir",       // 19
    "Medangkungan", // 20
    "Maktal",       // 21
    "Wuye",         // 22
    "Manahil",      // 23
    "Prangbakat",   // 24
    "Bala",         // 25
    "Wugu",         // 26
    "Wayang",       // 27
    "Kulawu",       // 28
    "Dukut",        // 29
    "Watugunung"    // 30
  ];

  // Helper normalisasi nama wuku agar selalu cocok dengan urutan baku 1-30
  function normalizeWuku(wuku) {
    if (!wuku) return "";
    const clean = String(wuku).trim().toLowerCase().replace(/[\s\-_]/g, '');
    for (const standard of WUKU_LIST) {
      if (standard.toLowerCase() === clean) return standard;
    }
    // Mapping variasi penulisan lama
    const map = {
      "shinto": "Sinta", "sinto": "Sinta",
      "julungwangi": "Julungwangi",
      "julungpujut": "Julungpujut",
      "madangkungan": "Medangkungan",
      "mendangkungan": "Medangkungan",
      "wariagung": "Warigagung",
      "warigalagung": "Warigagung",
      "manail": "Manahil",
      "watugunung": "Watugunung"
    };
    return map[clean] || WUKU_LIST[0];
  }

  // 1. DATA DINO IJO (Berdasarkan kolom hijau pada tabel Babon - 74 Kombinasi Baku)
  const DINO_IJO_DATA = [
    // 1. Sinta
    { no: 1, wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
    { no: 1, wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
    // 2. Landep
    { no: 2, wuku: "Landep", dino: "Senin", pasaran: "Kliwon" },
    { no: 2, wuku: "Landep", dino: "Kamis", pasaran: "Pon" },
    // 3. Wukir
    { no: 3, wuku: "Wukir", dino: "Minggu", pasaran: "Legi" },
    { no: 3, wuku: "Wukir", dino: "Selasa", pasaran: "Pon" },
    { no: 3, wuku: "Wukir", dino: "Rabu", pasaran: "Wage" },
    { no: 3, wuku: "Wukir", dino: "Sabtu", pasaran: "Pahing" },
    // 4. Kurantil
    { no: 4, wuku: "Kurantil", dino: "Senin", pasaran: "Wage" },
    { no: 4, wuku: "Kurantil", dino: "Jumat", pasaran: "Pon" },
    // 5. Tolu
    { no: 5, wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
    { no: 5, wuku: "Tolu", dino: "Sabtu", pasaran: "Legi" },
    // 6. Gumbreg
    { no: 6, wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
    { no: 6, wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
    // 7. Warigalit
    { no: 7, wuku: "Warigalit", dino: "Sabtu", pasaran: "Kliwon" },
    // 8. Warigagung
    { no: 8, wuku: "Warigagung", dino: "Selasa", pasaran: "Pon" },
    { no: 8, wuku: "Warigagung", dino: "Rabu", pasaran: "Wage" },
    // 9. Julungwangi
    { no: 9, wuku: "Julungwangi", dino: "Senin", pasaran: "Wage" },
    { no: 9, wuku: "Julungwangi", dino: "Kamis", pasaran: "Pahing" },
    // 10. Sungsang
    { no: 10, wuku: "Sungsang", dino: "Minggu", pasaran: "Kliwon" },
    { no: 10, wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
    // 11. Galungan
    { no: 11, wuku: "Galungan", dino: "Kamis", pasaran: "Legi" },
    { no: 11, wuku: "Galungan", dino: "Jumat", pasaran: "Pahing" },
    // 12. Kuningan
    { no: 12, wuku: "Kuningan", dino: "Senin", pasaran: "Kliwon" },
    { no: 12, wuku: "Kuningan", dino: "Kamis", pasaran: "Pon" },
    // 13. Langkir
    { no: 13, wuku: "Langkir", dino: "Minggu", pasaran: "Legi" },
    { no: 13, wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
    { no: 13, wuku: "Langkir", dino: "Rabu", pasaran: "Wage" },
    { no: 13, wuku: "Langkir", dino: "Jumat", pasaran: "Legi" },
    { no: 13, wuku: "Langkir", dino: "Sabtu", pasaran: "Pahing" },
    // 14. Mandasiya
    { no: 14, wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
    { no: 14, wuku: "Mandasiya", dino: "Kamis", pasaran: "Pahing" },
    { no: 14, wuku: "Mandasiya", dino: "Jumat", pasaran: "Pon" },
    // 15. Julungpujut
    { no: 15, wuku: "Julungpujut", dino: "Minggu", pasaran: "Kliwon" },
    { no: 15, wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
    { no: 15, wuku: "Julungpujut", dino: "Sabtu", pasaran: "Legi" },
    // 16. Pahang
    { no: 16, wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
    { no: 16, wuku: "Pahang", dino: "Jumat", pasaran: "Pahing" },
    // 17. Kuruwelut
    { no: 17, wuku: "Kuruwelut", dino: "Senin", pasaran: "Kliwon" },
    { no: 17, wuku: "Kuruwelut", dino: "Kamis", pasaran: "Pon" },
    // 18. Marakeh
    { no: 18, wuku: "Marakeh", dino: "Minggu", pasaran: "Legi" },
    { no: 18, wuku: "Marakeh", dino: "Jumat", pasaran: "Legi" },
    { no: 18, wuku: "Marakeh", dino: "Sabtu", pasaran: "Pahing" },
    // 19. Tambir
    { no: 19, wuku: "Tambir", dino: "Kamis", pasaran: "Pahing" },
    { no: 19, wuku: "Tambir", dino: "Jumat", pasaran: "Pon" },
    // 20. Medangkungan
    { no: 20, wuku: "Medangkungan", dino: "Rabu", pasaran: "Pon" },
    // 21. Maktal
    { no: 21, wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
    { no: 21, wuku: "Maktal", dino: "Kamis", pasaran: "Legi" },
    // 22. Wuye
    { no: 22, wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
    // 23. Manahil
    { no: 23, wuku: "Manahil", dino: "Minggu", pasaran: "Legi" },
    { no: 23, wuku: "Manahil", dino: "Selasa", pasaran: "Pon" },
    { no: 23, wuku: "Manahil", dino: "Jumat", pasaran: "Legi" },
    { no: 23, wuku: "Manahil", dino: "Sabtu", pasaran: "Pahing" },
    // 24. Prangbakat
    { no: 24, wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
    { no: 24, wuku: "Prangbakat", dino: "Kamis", pasaran: "Pahing" },
    { no: 24, wuku: "Prangbakat", dino: "Jumat", pasaran: "Pon" },
    // 25. Bala
    { no: 25, wuku: "Bala", dino: "Minggu", pasaran: "Kliwon" },
    { no: 25, wuku: "Bala", dino: "Sabtu", pasaran: "Legi" },
    // 26. Wugu (Termasuk Senin Pon sesuai kolom hijau tabel master nomor 26)
    { no: 26, wuku: "Wugu", dino: "Senin", pasaran: "Pon" },
    { no: 26, wuku: "Wugu", dino: "Selasa", pasaran: "Wage" },
    { no: 26, wuku: "Wugu", dino: "Kamis", pasaran: "Legi" },
    { no: 26, wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
    // 27. Wayang
    { no: 27, wuku: "Wayang", dino: "Senin", pasaran: "Kliwon" },
    { no: 27, wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
    // 28. Kulawu
    { no: 28, wuku: "Kulawu", dino: "Minggu", pasaran: "Legi" },
    { no: 28, wuku: "Kulawu", dino: "Selasa", pasaran: "Pon" },
    { no: 28, wuku: "Kulawu", dino: "Rabu", pasaran: "Wage" },
    { no: 28, wuku: "Kulawu", dino: "Jumat", pasaran: "Legi" },
    { no: 28, wuku: "Kulawu", dino: "Sabtu", pasaran: "Pahing" },
    // 29. Dukut
    { no: 29, wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
    { no: 29, wuku: "Dukut", dino: "Kamis", pasaran: "Pahing" },
    { no: 29, wuku: "Dukut", dino: "Jumat", pasaran: "Pon" },
    // 30. Watugunung
    { no: 30, wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
    { no: 30, wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" },
    { no: 30, wuku: "Watugunung", dino: "Sabtu", pasaran: "Legi" }
  ];

  // 2. DATA DINO GEDE (71 Kombinasi Sakral Resmi)
  const DINO_GEDE_DATA = [
    { no: 1, wuku: "Sinta", dino: "Selasa", pasaran: "Wage" },
    { no: 1, wuku: "Sinta", dino: "Kamis", pasaran: "Legi" },
    { no: 1, wuku: "Sinta", dino: "Jumat", pasaran: "Pahing" },
    { no: 2, wuku: "Landep", dino: "Rabu", pasaran: "Pahing" },
    { no: 2, wuku: "Landep", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 3, wuku: "Wukir", dino: "Selasa", pasaran: "Pon" },
    { no: 3, wuku: "Wukir", dino: "Jumat", pasaran: "Legi" },
    { no: 4, wuku: "Kurantil", dino: "Senin", pasaran: "Wage" },
    { no: 4, wuku: "Kurantil", dino: "Kamis", pasaran: "Pahing" },
    { no: 5, wuku: "Tolu", dino: "Minggu", pasaran: "Kliwon" },
    { no: 5, wuku: "Tolu", dino: "Rabu", pasaran: "Pon" },
    { no: 5, wuku: "Tolu", dino: "Sabtu", pasaran: "Legi" },
    { no: 6, wuku: "Gumbreg", dino: "Selasa", pasaran: "Wage" },
    { no: 6, wuku: "Gumbreg", dino: "Kamis", pasaran: "Legi" },
    { no: 6, wuku: "Gumbreg", dino: "Jumat", pasaran: "Pahing" },
    { no: 7, wuku: "Warigalit", dino: "Rabu", pasaran: "Pahing" },
    { no: 7, wuku: "Warigalit", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 8, wuku: "Warigagung", dino: "Selasa", pasaran: "Pon" },
    { no: 8, wuku: "Warigagung", dino: "Jumat", pasaran: "Legi" },
    { no: 9, wuku: "Julungwangi", dino: "Senin", pasaran: "Wage" },
    { no: 9, wuku: "Julungwangi", dino: "Kamis", pasaran: "Pahing" },
    { no: 10, wuku: "Sungsang", dino: "Minggu", pasaran: "Kliwon" },
    { no: 10, wuku: "Sungsang", dino: "Rabu", pasaran: "Pon" },
    { no: 10, wuku: "Sungsang", dino: "Sabtu", pasaran: "Legi" },
    { no: 11, wuku: "Galungan", dino: "Selasa", pasaran: "Wage" },
    { no: 11, wuku: "Galungan", dino: "Kamis", pasaran: "Legi" },
    { no: 11, wuku: "Galungan", dino: "Jumat", pasaran: "Pahing" },
    { no: 12, wuku: "Kuningan", dino: "Rabu", pasaran: "Pahing" },
    { no: 12, wuku: "Kuningan", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 13, wuku: "Langkir", dino: "Selasa", pasaran: "Pon" },
    { no: 13, wuku: "Langkir", dino: "Jumat", pasaran: "Legi" },
    { no: 14, wuku: "Mandasiya", dino: "Senin", pasaran: "Wage" },
    { no: 14, wuku: "Mandasiya", dino: "Kamis", pasaran: "Pahing" },
    { no: 15, wuku: "Julungpujut", dino: "Minggu", pasaran: "Kliwon" },
    { no: 15, wuku: "Julungpujut", dino: "Rabu", pasaran: "Pon" },
    { no: 15, wuku: "Julungpujut", dino: "Sabtu", pasaran: "Legi" },
    { no: 16, wuku: "Pahang", dino: "Selasa", pasaran: "Wage" },
    { no: 16, wuku: "Pahang", dino: "Kamis", pasaran: "Legi" },
    { no: 16, wuku: "Pahang", dino: "Jumat", pasaran: "Pahing" },
    { no: 17, wuku: "Kuruwelut", dino: "Rabu", pasaran: "Pahing" },
    { no: 17, wuku: "Kuruwelut", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 18, wuku: "Marakeh", dino: "Selasa", pasaran: "Pon" },
    { no: 18, wuku: "Marakeh", dino: "Jumat", pasaran: "Legi" },
    { no: 19, wuku: "Tambir", dino: "Senin", pasaran: "Wage" },
    { no: 19, wuku: "Tambir", dino: "Kamis", pasaran: "Pahing" },
    { no: 20, wuku: "Medangkungan", dino: "Minggu", pasaran: "Kliwon" },
    { no: 20, wuku: "Medangkungan", dino: "Rabu", pasaran: "Pon" },
    { no: 20, wuku: "Medangkungan", dino: "Sabtu", pasaran: "Legi" },
    { no: 21, wuku: "Maktal", dino: "Selasa", pasaran: "Wage" },
    { no: 21, wuku: "Maktal", dino: "Kamis", pasaran: "Legi" },
    { no: 21, wuku: "Maktal", dino: "Jumat", pasaran: "Pahing" },
    { no: 22, wuku: "Wuye", dino: "Rabu", pasaran: "Pahing" },
    { no: 22, wuku: "Wuye", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 23, wuku: "Manahil", dino: "Selasa", pasaran: "Pon" },
    { no: 24, wuku: "Prangbakat", dino: "Senin", pasaran: "Wage" },
    { no: 24, wuku: "Prangbakat", dino: "Kamis", pasaran: "Pahing" },
    { no: 25, wuku: "Bala", dino: "Minggu", pasaran: "Kliwon" },
    { no: 25, wuku: "Bala", dino: "Rabu", pasaran: "Pon" },
    { no: 25, wuku: "Bala", dino: "Sabtu", pasaran: "Legi" },
    { no: 26, wuku: "Wugu", dino: "Selasa", pasaran: "Wage" },
    { no: 26, wuku: "Wugu", dino: "Kamis", pasaran: "Legi" },
    { no: 26, wuku: "Wugu", dino: "Jumat", pasaran: "Pahing" },
    { no: 27, wuku: "Wayang", dino: "Rabu", pasaran: "Pahing" },
    { no: 27, wuku: "Wayang", dino: "Sabtu", pasaran: "Kliwon" },
    { no: 28, wuku: "Kulawu", dino: "Selasa", pasaran: "Pon" },
    { no: 28, wuku: "Kulawu", dino: "Jumat", pasaran: "Legi" },
    { no: 29, wuku: "Dukut", dino: "Senin", pasaran: "Wage" },
    { no: 29, wuku: "Dukut", dino: "Kamis", pasaran: "Pahing" },
    { no: 30, wuku: "Watugunung", dino: "Minggu", pasaran: "Kliwon" },
    { no: 30, wuku: "Watugunung", dino: "Rabu", pasaran: "Pon" },
    { no: 30, wuku: "Watugunung", dino: "Sabtu", pasaran: "Legi" }
  ];

  // Helper Set untuk O(1) Flexible Key Lookup
  const HARI_SET = new Set(['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
  const PASARAN_SET = new Set(['legi', 'pahing', 'pon', 'wage', 'kliwon']);

  const makeKey = (wuku, dino, pasaran) => {
    let w = String(wuku || '').trim();
    let d = String(dino || '').trim();
    let p = String(pasaran || '').trim();

    // Dukung fleksibilitas jika urutan argumen tertukar (misal: dino, pasaran, wuku)
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

  const GEDE_SET = new Set();
  const IJO_SET = new Set();

  DINO_GEDE_DATA.forEach(d => {
    GEDE_SET.add(makeKey(d.wuku, d.dino, d.pasaran));
    GEDE_SET.add(`${d.dino}_${d.pasaran}_${normalizeWuku(d.wuku)}`.toLowerCase());
  });

  DINO_IJO_DATA.forEach(d => {
    IJO_SET.add(makeKey(d.wuku, d.dino, d.pasaran));
    IJO_SET.add(`${d.dino}_${d.pasaran}_${normalizeWuku(d.wuku)}`.toLowerCase());
  });

  function evaluateDino(wuku, dino, pasaran) {
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

  // Export to Root (Window or Module)
  root.WUKU_LIST = WUKU_LIST;
  root.normalizeWuku = normalizeWuku;
  root.DINO_GEDE_DATA = DINO_GEDE_DATA;
  root.DINO_IJO_DATA = DINO_IJO_DATA;
  root.makeKey = makeKey;
  root.GEDE_SET = GEDE_SET;
  root.IJO_SET = IJO_SET;
  root.evaluateDino = evaluateDino;

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
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));