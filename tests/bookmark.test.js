import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  saveBookmark,
  getBookmarks,
  getBookmarkByDate,
  deleteBookmark,
  normalizeDateKey,
  KATEGORI_BOOKMARK
} from '../js/modules/kalender/bookmark-service.js';

describe('Bookmark Service (Tahap 2)', () => {
  beforeEach(() => {
    // Bersihkan semua bookmark sebelum setiap test
    const all = getBookmarks();
    for (const b of all) {
      deleteBookmark(b.dateStr);
    }
  });

  it('harus menormalisasi format tanggal menjadi YYYY-MM-DD', () => {
    assert.strictEqual(normalizeDateKey('2026-9-19'), '2026-09-19');
    assert.strictEqual(normalizeDateKey('2026-09-19'), '2026-09-19');
    assert.strictEqual(normalizeDateKey('2026/1/5'), '2026-01-05');
    assert.strictEqual(normalizeDateKey('2026.12.31'), '2026-12-31');
  });

  it('harus memiliki daftar kategori bookmark yang valid', () => {
    assert.ok(Array.isArray(KATEGORI_BOOKMARK));
    assert.ok(KATEGORI_BOOKMARK.length >= 6);
    const ids = KATEGORI_BOOKMARK.map(k => k.id);
    assert.ok(ids.includes('kelahiran'));
    assert.ok(ids.includes('mantu'));
    assert.ok(ids.includes('pindah'));
    assert.ok(ids.includes('selametan'));
  });

  it('harus dapat menyimpan dan mengambil bookmark', () => {
    const res = saveBookmark({
      y: 2026,
      m: 9,
      d: 19,
      kategori: 'kelahiran',
      catatan: 'Wiyosan Raden Dananjaya',
      weton: 'Setu Wage'
    });

    assert.strictEqual(res.dateStr, '2026-09-19');
    assert.strictEqual(res.catatan, 'Wiyosan Raden Dananjaya');

    const found = getBookmarkByDate('2026-9-19');
    assert.ok(found);
    assert.strictEqual(found.dateStr, '2026-09-19');
    assert.strictEqual(found.kategori, 'kelahiran');
    assert.strictEqual(found.weton, 'Setu Wage');
  });

  it('harus dapat memperbarui catatan bookmark yang sudah ada', () => {
    saveBookmark({
      y: 2026,
      m: 10,
      d: 1,
      kategori: 'mantu',
      catatan: 'Acara Akad',
      weton: 'Kemis Pon'
    });

    saveBookmark({
      y: 2026,
      m: 10,
      d: 1,
      kategori: 'mantu',
      catatan: 'Acara Resepsi & Panggih Penganten',
      weton: 'Kemis Pon'
    });

    const list = getBookmarks();
    const matching = list.filter(b => b.dateStr === '2026-10-01');
    assert.strictEqual(matching.length, 1);
    assert.strictEqual(matching[0].catatan, 'Acara Resepsi & Panggih Penganten');
  });

  it('harus dapat menghapus bookmark berdasarkan tanggal', () => {
    saveBookmark({
      y: 2026,
      m: 11,
      d: 15,
      kategori: 'hajat',
      catatan: 'Buka Toko',
      weton: 'Ahad Kliwon'
    });

    assert.ok(getBookmarkByDate('2026-11-15'));
    const deleted = deleteBookmark('2026-11-15');
    assert.strictEqual(deleted, true);
    assert.strictEqual(getBookmarkByDate('2026-11-15'), null);
  });
});
