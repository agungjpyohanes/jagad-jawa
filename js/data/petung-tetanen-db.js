/**
 * JAGAD JAWA - Master Database Petung Tetanen (Pertanian Berdasarkan Weton)
 * Sumber: database_nujum_cleaned - petung_tetanen.csv
 * Menentukan kesesuaian jenis tanaman (Oyot, Uwit, Kembang/Godhong, Uwoh)
 * berdasarkan Dino & Pasaran (35 kombinasi siklus weton).
 */

(function (root) {
  const PETUNG_TETANEN_LIST = [
  {
    "dino": "Minggu",
    "pasaran": "Pon",
    "neptuDino": 5,
    "neptuPasaran": 7,
    "neptuTotal": 12,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Senin",
    "pasaran": "Wage",
    "neptuDino": 4,
    "neptuPasaran": 4,
    "neptuTotal": 8,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Selasa",
    "pasaran": "Kliwon",
    "neptuDino": 3,
    "neptuPasaran": 8,
    "neptuTotal": 11,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Rabu",
    "pasaran": "Legi",
    "neptuDino": 7,
    "neptuPasaran": 5,
    "neptuTotal": 12,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Kamis",
    "pasaran": "Pahing",
    "neptuDino": 8,
    "neptuPasaran": 9,
    "neptuTotal": 17,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Jumat",
    "pasaran": "Pon",
    "neptuDino": 6,
    "neptuPasaran": 7,
    "neptuTotal": 13,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Sabtu",
    "pasaran": "Wage",
    "neptuDino": 9,
    "neptuPasaran": 4,
    "neptuTotal": 13,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Minggu",
    "pasaran": "Kliwon",
    "neptuDino": 5,
    "neptuPasaran": 8,
    "neptuTotal": 13,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Senin",
    "pasaran": "Legi",
    "neptuDino": 4,
    "neptuPasaran": 5,
    "neptuTotal": 9,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Selasa",
    "pasaran": "Pahing",
    "neptuDino": 3,
    "neptuPasaran": 9,
    "neptuTotal": 12,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Rabu",
    "pasaran": "Pon",
    "neptuDino": 7,
    "neptuPasaran": 7,
    "neptuTotal": 14,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Kamis",
    "pasaran": "Wage",
    "neptuDino": 8,
    "neptuPasaran": 4,
    "neptuTotal": 12,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Jumat",
    "pasaran": "Kliwon",
    "neptuDino": 6,
    "neptuPasaran": 8,
    "neptuTotal": 14,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Sabtu",
    "pasaran": "Legi",
    "neptuDino": 9,
    "neptuPasaran": 5,
    "neptuTotal": 14,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Minggu",
    "pasaran": "Pahing",
    "neptuDino": 5,
    "neptuPasaran": 9,
    "neptuTotal": 14,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Senin",
    "pasaran": "Pon",
    "neptuDino": 4,
    "neptuPasaran": 7,
    "neptuTotal": 11,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Selasa",
    "pasaran": "Wage",
    "neptuDino": 3,
    "neptuPasaran": 4,
    "neptuTotal": 7,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Rabu",
    "pasaran": "Kliwon",
    "neptuDino": 7,
    "neptuPasaran": 8,
    "neptuTotal": 15,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Kamis",
    "pasaran": "Legi",
    "neptuDino": 8,
    "neptuPasaran": 5,
    "neptuTotal": 13,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Jumat",
    "pasaran": "Pahing",
    "neptuDino": 6,
    "neptuPasaran": 9,
    "neptuTotal": 15,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Sabtu",
    "pasaran": "Pon",
    "neptuDino": 9,
    "neptuPasaran": 7,
    "neptuTotal": 16,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Minggu",
    "pasaran": "Wage",
    "neptuDino": 5,
    "neptuPasaran": 4,
    "neptuTotal": 9,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Senin",
    "pasaran": "Kliwon",
    "neptuDino": 4,
    "neptuPasaran": 8,
    "neptuTotal": 12,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Selasa",
    "pasaran": "Legi",
    "neptuDino": 3,
    "neptuPasaran": 5,
    "neptuTotal": 8,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Rabu",
    "pasaran": "Pahing",
    "neptuDino": 7,
    "neptuPasaran": 9,
    "neptuTotal": 16,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Kamis",
    "pasaran": "Pon",
    "neptuDino": 8,
    "neptuPasaran": 7,
    "neptuTotal": 15,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Jumat",
    "pasaran": "Wage",
    "neptuDino": 6,
    "neptuPasaran": 4,
    "neptuTotal": 10,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Sabtu",
    "pasaran": "Kliwon",
    "neptuDino": 9,
    "neptuPasaran": 8,
    "neptuTotal": 17,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Minggu",
    "pasaran": "Legi",
    "neptuDino": 5,
    "neptuPasaran": 5,
    "neptuTotal": 10,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Senin",
    "pasaran": "Pahing",
    "neptuDino": 4,
    "neptuPasaran": 9,
    "neptuTotal": 13,
    "kangBecik": "oyot",
    "kategoriLabel": "Oyot (Pala Kependem / Umbi-umbian & Akar)",
    "tegese": "sing ditandur bakal oyote kuat, sing dipanen oyote",
    "contone": "tela, pohong, kentang",
    "icon": "fa-solid fa-carrot",
    "color": "text-yellow-400",
    "badgeClass": "bg-yellow-950/80 border-yellow-600/50 text-yellow-200"
  },
  {
    "dino": "Selasa",
    "pasaran": "Pon",
    "neptuDino": 3,
    "neptuPasaran": 7,
    "neptuTotal": 10,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  },
  {
    "dino": "Rabu",
    "pasaran": "Wage",
    "neptuDino": 7,
    "neptuPasaran": 4,
    "neptuTotal": 11,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Kamis",
    "pasaran": "Kliwon",
    "neptuDino": 8,
    "neptuPasaran": 8,
    "neptuTotal": 16,
    "kangBecik": "uwoh",
    "kategoriLabel": "Uwoh (Pala Gumantung / Buah-buahan)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-apple-whole",
    "color": "text-amber-400",
    "badgeClass": "bg-amber-950/80 border-amber-600/50 text-amber-200"
  },
  {
    "dino": "Jumat",
    "pasaran": "Legi",
    "neptuDino": 6,
    "neptuPasaran": 5,
    "neptuTotal": 11,
    "kangBecik": "kembang/godhong",
    "kategoriLabel": "Kembang & Godhong (Bunga, Daun & Palawija)",
    "tegese": "sing ditandur bakal kembang lan godhonge akeh, sing dipanen kembang utawa godhonge",
    "contone": "mawar, mbako, suruh",
    "icon": "fa-solid fa-spa",
    "color": "text-teal-400",
    "badgeClass": "bg-teal-950/80 border-teal-600/50 text-teal-200"
  },
  {
    "dino": "Sabtu",
    "pasaran": "Pahing",
    "neptuDino": 9,
    "neptuPasaran": 9,
    "neptuTotal": 18,
    "kangBecik": "uwit",
    "kategoriLabel": "Uwit (Pala Katingal / Batang & Pohon Kayu)",
    "tegese": "sing ditandur bakal kuat lan gede kayune, sing dipanen kayune",
    "contone": "jati, pring",
    "icon": "fa-solid fa-tree",
    "color": "text-emerald-400",
    "badgeClass": "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
  }
];

  // Map untuk akses kilat berbasis "Dino_Pasaran" (case-insensitive)
  const PETUNG_TETANEN_MAP = {};
  PETUNG_TETANEN_LIST.forEach(item => {
    const key = (item.dino + '_' + item.pasaran).toLowerCase().replace(/\s+/g, '');
    PETUNG_TETANEN_MAP[key] = item;
    // Tambah variasi nama (misal Ahad & Sunday = Minggu)
    if (item.dino.toLowerCase() === 'minggu') {
      const ahadKey = ('ahad_' + item.pasaran).toLowerCase().replace(/\s+/g, '');
      const sundayKey = ('sunday_' + item.pasaran).toLowerCase().replace(/\s+/g, '');
      PETUNG_TETANEN_MAP[ahadKey] = item;
      PETUNG_TETANEN_MAP[sundayKey] = item;
    }
  });

  /**
   * Mengambil data petung pertanian berdasarkan hari dan pasaran.
   * @param {string} dino - Contoh: "Senin", "Jumat", "Ahad"
   * @param {string} pasaran - Contoh: "Legi", "Pahing", "Pon", "Wage", "Kliwon"
   * @returns {Object|null}
   */
  function getPetungTetanen(dino, pasaran) {
    if (!dino || !pasaran) return null;
    const cleanDino = String(dino).trim().toLowerCase().replace(/\s+/g, '');
    const cleanPas = String(pasaran).trim().toLowerCase().replace(/\s+/g, '');
    const key = cleanDino + '_' + cleanPas;
    if (PETUNG_TETANEN_MAP[key]) return PETUNG_TETANEN_MAP[key];

    // Coba fallback dengan mengganti ahad <-> minggu
    const altDino = (cleanDino === 'ahad') ? 'minggu' : (cleanDino === 'minggu' ? 'ahad' : cleanDino);
    const altKey = altDino + '_' + cleanPas;
    return PETUNG_TETANEN_MAP[altKey] || null;
  }

  root.PETUNG_TETANEN_LIST = PETUNG_TETANEN_LIST;
  root.PETUNG_TETANEN_MAP = PETUNG_TETANEN_MAP;
  root.getPetungTetanen = getPetungTetanen;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PETUNG_TETANEN_LIST,
      PETUNG_TETANEN_MAP,
      getPetungTetanen
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

const _gTetanen = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
export const PETUNG_TETANEN_LIST = _gTetanen.PETUNG_TETANEN_LIST;
export const PETUNG_TETANEN_MAP = _gTetanen.PETUNG_TETANEN_MAP;
export const getPetungTetanen = _gTetanen.getPetungTetanen;

export default {
  PETUNG_TETANEN_LIST: _gTetanen.PETUNG_TETANEN_LIST,
  PETUNG_TETANEN_MAP: _gTetanen.PETUNG_TETANEN_MAP,
  getPetungTetanen: _gTetanen.getPetungTetanen
};
