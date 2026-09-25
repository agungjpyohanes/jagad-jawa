/**
 * Jagad Jawa — Unit Test: Pustaka Dongo, Wirid & Ubarampe (Branch jawa-v5)
 * Memverifikasi integritas database 5 kategori, 12 entri donga,
 * algoritma pencarian responsif, dan personalisasi nama interaktif.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPustakaKategoriList,
  getPustakaKategoriById,
  getAllPustakaEntri,
  getPustakaEntriById,
  searchPustakaEntri,
  hasNamePlaceholder,
  personalizeDoaLines,
  formatDoaPlainText,
  getPustakaRelatedEntri,
  PLACEHOLDER_NAMA_REGEX
} from '../js/modules/pustaka/pustaka-engine.js';

test('Pustaka Engine - Integritas 5 Kategori Tradisi', () => {
  const categories = getPustakaKategoriList();
  assert.equal(categories.length, 5, 'Wajib memuat tepat 5 kategori resmi');

  const expectedIds = ['wirid-harian', 'sesuci', 'semedi', 'ruwatan', 'wulan-suro'];
  expectedIds.forEach(id => {
    const found = getPustakaKategoriById(id);
    assert.ok(found, `Kategori ${id} harus ditemukan`);
    assert.ok(found.nama && found.nama.length > 0, `Kategori ${id} harus memiliki nama valid`);
    assert.ok(found.deskripsi && found.deskripsi.length > 0, `Kategori ${id} harus memiliki deskripsi`);
  });
});

test('Pustaka Engine - Integritas 12 Entri Pustaka Dongo', () => {
  const entries = getAllPustakaEntri();
  assert.equal(entries.length, 12, 'Wajib memuat tepat 12 entri dokumen');

  entries.forEach(e => {
    assert.ok(e.id, 'Setiap entri harus memiliki id unik');
    assert.ok(e.kategori, `Entri ${e.id} harus memiliki kategori`);
    assert.ok(e.judul, `Entri ${e.id} harus memiliki judul`);
    assert.ok(Array.isArray(e.bagian) && e.bagian.length > 0, `Entri ${e.id} harus memiliki minimal 1 perangan bagian`);
    assert.ok(e.teks_cari, `Entri ${e.id} harus memiliki teks_cari terindeks`);
  });
});

test('Pustaka Engine - Pencarian Filter Kategori & Query Bebas', () => {
  // 1. Filter kategori 'sesuci'
  const sesuciList = searchPustakaEntri({ kategori: 'sesuci' });
  assert.ok(sesuciList.length >= 1, 'Kategori sesuci harus memuat minimal 1 doa adus');
  assert.equal(sesuciList[0].id, 'sesuci-badan-adus-keramas');

  // 2. Pencarian kata kunci 'ruwatan'
  const ruwatanList = searchPustakaEntri({ query: 'ruwatan' });
  assert.ok(ruwatanList.length >= 1, 'Pencarian kata kunci ruwatan harus menemukan entri ruwatan');

  // 3. Pencarian kata kunci 'suro'
  const suroList = searchPustakaEntri({ query: 'suro' });
  assert.ok(suroList.length >= 3, 'Pencarian kata kunci suro harus menemukan doa-doa wulan suro');

  // 4. Pencarian kata kunci mantra suku kata
  const mantraList = searchPustakaEntri({ query: 'DOTHO GOBOSO' });
  assert.ok(mantraList.length >= 4, 'Keempat donga semedi dengan formula DOTHO GOBOSO harus ditemukan');
});

test('Pustaka Engine - Deteksi Placeholder Nama (………) & Personalisasi Nama', () => {
  const ruwatan = getPustakaEntriById('ruwatan-weton');
  assert.ok(ruwatan, 'Entri ruwatan-weton harus ada');

  // Cek deteksi placeholder
  const isHasPlaceholder = hasNamePlaceholder(ruwatan);
  assert.equal(isHasPlaceholder, true, 'Ruwatan weton harus terdeteksi memuat titik isian nama');

  // Entri keluarga memuat baris dengan '………'
  const bagianKeluarga = ruwatan.bagian.find(b => b.id === 'keluarga');
  assert.ok(bagianKeluarga, 'Bagian keluarga harus ada di ruwatan-weton');

  const contohBaris = [
    'Niyat Ingsun Angruwat',
    'Kadange ……… Papat Kalima Pancer',
    'Kang Dumunung Aneng Badane ………'
  ];

  // Personalisasi dengan nama 'Raden Mas Dananjaya'
  const namaTest = 'Raden Mas Dananjaya';
  const personalized = personalizeDoaLines(contohBaris, namaTest);

  assert.equal(personalized[0], 'Niyat Ingsun Angruwat');
  assert.equal(personalized[1], 'Kadange Raden Mas Dananjaya Papat Kalima Pancer');
  assert.equal(personalized[2], 'Kang Dumunung Aneng Badane Raden Mas Dananjaya');

  // Jika nama kosong, kembalikan baris asli tanpa eror
  const emptyNameResult = personalizeDoaLines(contohBaris, '');
  assert.equal(emptyNameResult[1], 'Kadange ……… Papat Kalima Pancer');
});

test('Pustaka Engine - Format Plain-Text Rapih untuk Salin Clipboard', () => {
  const entri = getPustakaEntriById('nyingkirake-sengkala-1-suro');
  assert.ok(entri, 'Entri nyingkirake-sengkala-1-suro harus ada');

  const nama = 'Bagus Santoso';
  const text = formatDoaPlainText(entri, nama);

  assert.ok(text.includes('NYINGKIRAKE SENGKALA ING TANGGAL 1 SURO'), 'Harus memuat judul doa');
  assert.ok(text.includes('Bagus Santoso'), 'Harus memuat nama pengguna yang dipersonalisasi');
  assert.ok(text.includes('Raganing Bagus Santoso'), 'Placeholder harus terganti di dalam baris doa');
  assert.ok(text.includes('jagad-jawa.web.app'), 'Harus menyertakan tautan aplikasi');
});

test('Pustaka Engine - Entri Terkait (Cross-Reference)', () => {
  const wiridSuro = getPustakaEntriById('wirid-malem-1-suro');
  assert.ok(wiridSuro);

  const related = getPustakaRelatedEntri(wiridSuro);
  assert.ok(Array.isArray(related) && related.length >= 2, 'Wirid malem 1 suro harus memiliki minimal 2 entri terkait');
  assert.ok(related.some(r => r.entri.id === 'donga-sajroning-wulan-suro'));
});
