/**
 * Jagad Jawa — Modul Domain: Bookmark Service
 * Pengelola penyimpanan tanggal penting budaya (wiyosan, mantu, pindah griya, haul, dsb.)
 * berbasis LocalStorage peramban dengan jaminan privasi lokal 100%.
 */

const STORAGE_KEY = 'jagad_jawa_bookmarks';

// In-memory fallback untuk lingkungan pengujian Node.js
let memoryStore = {};

function getStorage() {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return {
    getItem: (key) => memoryStore[key] || null,
    setItem: (key, val) => { memoryStore[key] = String(val); },
    removeItem: (key) => { delete memoryStore[key]; },
    clear: () => { memoryStore = {}; }
  };
}

export const KATEGORI_BOOKMARK = [
  { id: 'kelahiran', label: 'Wiyosan / Kelahiran', icon: 'fa-baby', color: 'text-amber-400' },
  { id: 'mantu', label: 'Pawiwahan / Mantu', icon: 'fa-heart', color: 'text-rose-400' },
  { id: 'pindah', label: 'Pindah Griya / Gedhong', icon: 'fa-house', color: 'text-teal-400' },
  { id: 'selametan', label: 'Pengetan Tilar Donyo / Haul', icon: 'fa-monument', color: 'text-purple-400' },
  { id: 'hajat', label: 'Hajat Wigati / Upacara', icon: 'fa-calendar-check', color: 'text-emerald-400' },
  { id: 'catatan', label: 'Catatan Pribadi', icon: 'fa-bookmark', color: 'text-prada' }
];

/**
 * Mengambil seluruh daftar bookmark yang tersimpan.
 * @returns {Array<Object>}
 */
export function getBookmarks() {
  try {
    const raw = getStorage().getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Gagal membaca bookmark dari LocalStorage:', e);
    return [];
  }
}

/**
 * Mengambil satu bookmark berdasarkan tanggal (format 'YYYY-M-D' atau 'YYYY-MM-DD').
 * @param {string} dateStr 
 * @returns {Object|null}
 */
export function getBookmarkByDate(dateStr) {
  const normKey = normalizeDateKey(dateStr);
  const list = getBookmarks();
  return list.find(b => normalizeDateKey(b.dateStr) === normKey) || null;
}

/**
 * Menyimpan atau memperbarui bookmark tanggal.
 * @param {Object} bookmark 
 * @returns {Object}
 */
export function saveBookmark({ y, m, d, dateStr, kategori = 'catatan', catatan = '', weton = '' }) {
  const list = getBookmarks();
  const key = dateStr || `${y}-${m}-${d}`;
  const normKey = normalizeDateKey(key);

  const existingIdx = list.findIndex(b => normalizeDateKey(b.dateStr) === normKey);
  const entry = {
    id: `bm-${normKey}`,
    dateStr: normKey,
    y: parseInt(y, 10),
    m: parseInt(m, 10),
    d: parseInt(d, 10),
    kategori,
    catatan: catatan.trim(),
    weton,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...entry };
  } else {
    list.push({ ...entry, createdAt: new Date().toISOString() });
  }

  try {
    getStorage().setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Gagal menyimpan bookmark ke LocalStorage:', e);
  }

  return entry;
}

/**
 * Menghapus bookmark berdasarkan tanggal.
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function deleteBookmark(dateStr) {
  const normKey = normalizeDateKey(dateStr);
  const list = getBookmarks();
  const filtered = list.filter(b => normalizeDateKey(b.dateStr) !== normKey);
  if (filtered.length !== list.length) {
    try {
      getStorage().setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Gagal menghapus bookmark dari LocalStorage:', e);
    }
  }
  return false;
}

/**
 * Menormalisasi string tanggal menjadi format 'YYYY-MM-DD'.
 * @param {string} str 
 * @returns {string}
 */
export function normalizeDateKey(str) {
  if (!str) return '';
  const parts = String(str).split(/[-/.]/).map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const [y, m, d] = parts;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(str);
}
