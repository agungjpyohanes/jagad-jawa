/**
 * Jagad Jawa — Modul Domain: Jodoh History Service (Tahap 4.3)
 * Pengelolaan riwayat perhitungan perjodohan pasangan menggunakan LocalStorage
 * dengan jaminan 100% privasi lokal dan memori fallback untuk lingkungan testing.
 */

export const STORAGE_KEY_JODOH_HISTORY = 'jagad_jawa_jodoh_history';
export const MAX_JODOH_HISTORY_ITEMS = 20;

// In-memory fallback untuk lingkungan non-browser (Node.js test runner)
let memoryStore = [];

/**
 * Mendapatkan adapter storage aktif (LocalStorage atau in-memory fallback).
 * @returns {Storage|null}
 */
function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

/**
 * Mengambil seluruh riwayat perhitungan pasangan dari penyimpanan lokal.
 * @returns {Array<Object>}
 */
export function getJodohHistory() {
  const storage = getStorage();
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY_JODOH_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Gagal membaca riwayat perjodohan dari LocalStorage:', err);
      return [];
    }
  }
  return [...memoryStore];
}

/**
 * Menyimpan hasil perhitungan pitung pasangan ke dalam riwayat lokal.
 * @param {Object} pitungResult Hasil dari hitungPitung7Metode()
 * @param {Object} [metaInput] Metadata input tambahan { tglP, tglL }
 * @returns {Object} Item riwayat yang tersimpan
 */
export function saveJodohHistory(pitungResult, metaInput = {}) {
  if (!pitungResult || !pitungResult.summary) return null;

  const now = new Date();
  const tglHitungStr = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const id = `jodoh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const item = {
    id,
    timestamp: now.getTime(),
    tglHitungStr,
    wanita: {
      nama: pitungResult.wanita?.nama || 'Calon Pengantin Wanita',
      tglLahir: metaInput.tglP || '',
      hari: pitungResult.wanita?.hari || '',
      pasaran: pitungResult.wanita?.pasaran || '',
      neptu: pitungResult.wanita?.neptu || 0
    },
    pria: {
      nama: pitungResult.pria?.nama || 'Calon Pengantin Pria',
      tglLahir: metaInput.tglL || '',
      hari: pitungResult.pria?.hari || '',
      pasaran: pitungResult.pria?.pasaran || '',
      neptu: pitungResult.pria?.neptu || 0
    },
    totalNeptu: pitungResult.totalNeptu || 0,
    skorKeselarasan: pitungResult.summary.skorKeselarasan || 0,
    predikatKeharmonisan: pitungResult.summary.keharmonisan?.predikat || 'Rahayu',
    statusHubungan: metaInput.statusHubungan || 'belum_menikah',
    summary: {
      baik: pitungResult.summary.baik || 0,
      campur: pitungResult.summary.campur || 0,
      buruk: pitungResult.summary.buruk || 0,
      total: pitungResult.summary.total || 7
    }
  };

  const list = getJodohHistory();
  // Sisipkan di awal daftar (terbaru paling atas)
  const updated = [item, ...list.filter(x => x.id !== id)].slice(0, MAX_JODOH_HISTORY_ITEMS);

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY_JODOH_HISTORY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Gagal menyimpan riwayat perjodohan ke LocalStorage:', err);
    }
  } else {
    memoryStore = updated;
  }

  return item;
}

/**
 * Menghapus satu entri riwayat berdasarkan ID.
 * @param {string} id 
 * @returns {boolean}
 */
export function deleteJodohHistoryItem(id) {
  if (!id) return false;
  const list = getJodohHistory();
  const filtered = list.filter(item => item.id !== id);

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY_JODOH_HISTORY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.warn('Gagal menghapus riwayat perjodohan dari LocalStorage:', err);
      return false;
    }
  } else {
    memoryStore = filtered;
    return true;
  }
}

/**
 * Menghapus seluruh riwayat perhitungan pasangan.
 * @returns {boolean}
 */
export function clearAllJodohHistory() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY_JODOH_HISTORY);
      return true;
    } catch (err) {
      console.warn('Gagal membersihkan riwayat perjodohan:', err);
      return false;
    }
  } else {
    memoryStore = [];
    return true;
  }
}
