import test from 'node:test';
import assert from 'node:assert/strict';
import {
  saveJodohHistory,
  getJodohHistory,
  deleteJodohHistoryItem,
  clearAllJodohHistory,
  MAX_JODOH_HISTORY_ITEMS
} from '../js/modules/jodoh/jodoh-history.js';

test('Jodoh History Service - Simpan, Ambil, dan Hapus Riwayat (Tahap 4.3)', () => {
  // Bersihkan data awal
  clearAllJodohHistory();
  assert.equal(getJodohHistory().length, 0);

  const mockResult1 = {
    wanita: { nama: 'Dewi Sekartaji', hari: 'Senin', pasaran: 'Kliwon', neptu: 12 },
    pria: { nama: 'Panji Asmarabangun', hari: 'Rabu', pasaran: 'Legi', neptu: 12 },
    totalNeptu: 24,
    rows: [],
    summary: {
      baik: 5,
      campur: 1,
      buruk: 1,
      total: 7,
      skorKeselarasan: 71,
      keharmonisan: { predikat: 'Rahayu Utama' }
    }
  };

  const saved1 = saveJodohHistory(mockResult1, { tglP: '1995-04-10', tglL: '1993-08-15' });
  assert.ok(saved1, 'Item harus berhasil disimpan');
  assert.ok(saved1.id, 'Item harus memiliki ID unik');
  assert.equal(saved1.totalNeptu, 24);
  assert.equal(saved1.wanita.nama, 'Dewi Sekartaji');
  assert.equal(saved1.pria.nama, 'Panji Asmarabangun');
  assert.equal(saved1.wanita.tglLahir, '1995-04-10');

  // Cek list
  let history = getJodohHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].id, saved1.id);

  // Simpan pasangan kedua
  const mockResult2 = {
    wanita: { nama: 'Sinta', hari: 'Minggu', pasaran: 'Pahing', neptu: 14 },
    pria: { nama: 'Rama', hari: 'Kamis', pasaran: 'Wage', neptu: 12 },
    totalNeptu: 26,
    summary: {
      baik: 6,
      campur: 1,
      buruk: 0,
      total: 7,
      skorKeselarasan: 86
    }
  };

  const saved2 = saveJodohHistory(mockResult2);
  history = getJodohHistory();
  assert.equal(history.length, 2);
  // Item terbaru harus di posisi pertama (indeks 0)
  assert.equal(history[0].id, saved2.id);

  // Hapus item pertama
  const delOk = deleteJodohHistoryItem(saved2.id);
  assert.equal(delOk, true);
  history = getJodohHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].id, saved1.id);

  // Bersihkan semua
  clearAllJodohHistory();
  assert.equal(getJodohHistory().length, 0);
});

test('Jodoh History Service - Batas Maksimal Riwayat', () => {
  clearAllJodohHistory();

  for (let i = 1; i <= 25; i++) {
    saveJodohHistory({
      wanita: { nama: `Wanita ${i}`, hari: 'Senin', pasaran: 'Pon', neptu: 11 },
      pria: { nama: `Pria ${i}`, hari: 'Selasa', pasaran: 'Wage', neptu: 7 },
      totalNeptu: 18,
      summary: { baik: 4, campur: 2, buruk: 1, total: 7, skorKeselarasan: 57 }
    });
  }

  const history = getJodohHistory();
  assert.equal(history.length, MAX_JODOH_HISTORY_ITEMS, `Jumlah riwayat tidak boleh melebihi ${MAX_JODOH_HISTORY_ITEMS}`);
  assert.equal(history[0].wanita.nama, 'Wanita 25', 'Item paling baru harus berada di urutan teratas');
});
