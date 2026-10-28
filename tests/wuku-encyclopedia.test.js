import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllWuku,
  getWukuByNumber,
  getWukuByName,
  searchWuku,
  getWukuDetailSummary
} from '../js/modules/wuku/wuku-engine.js';

test('Ensiklopedia 30 Wuku - Integritas Database', async (t) => {
  await t.test('Harus memuat tepat 30 wuku siklus pawukon', () => {
    const list = getAllWuku();
    assert.equal(list.length, 30, 'Total wuku harus 30');
    assert.equal(list[0].nama_wuku, 'Sinta', 'Wuku pertama harus Sinta');
    assert.equal(list[29].nama_wuku, 'Watugunung', 'Wuku ke-30 harus Watugunung');
  });

  await t.test('Pencarian berdasarkan nomor urut (1 - 30)', () => {
    const w1 = getWukuByNumber(1);
    assert.ok(w1);
    assert.equal(w1.nama_wuku, 'Sinta');

    const w20 = getWukuByNumber(20);
    assert.ok(w20);
    assert.equal(w20.nama_wuku, 'Medangkungan');

    const w30 = getWukuByNumber(30);
    assert.ok(w30);
    assert.equal(w30.nama_wuku, 'Watugunung');

    assert.equal(getWukuByNumber(0), null);
    assert.equal(getWukuByNumber(31), null);
  });

  await t.test('Pencarian berdasarkan nama (case-insensitive & trim)', () => {
    const wLandep = getWukuByName('landep');
    assert.ok(wLandep);
    assert.equal(wLandep.no_wuku, 2);

    const wMandasiya = getWukuByName('  Mandasiya  ');
    assert.ok(wMandasiya);
    assert.equal(wMandasiya.nama_wuku, 'Mandasiya');
  });

  await t.test('Pencarian bebas query (searchWuku)', () => {
    const hasilBrama = searchWuku('Brama');
    assert.ok(hasilBrama.length >= 1, 'Harus menemukan wuku yang berpelindung Hyang Brama');

    const hasilSinta = searchWuku('sinta');
    assert.ok(hasilSinta.some(w => w.nama_wuku === 'Sinta'));
  });

  await t.test('Ringkasan terstruktur getWukuDetailSummary', () => {
    const summary = getWukuDetailSummary('Sinta');
    assert.ok(summary);
    assert.equal(summary.no, 1);
    assert.equal(summary.nama, 'Sinta');
    // Dewane Sinta setelah kanon B1-B3 = 'Sang Hyang Yamadipati' (bukan Nyamadipati)
    assert.ok(summary.dewane.includes('Yamadipati'), `dewane Sinta harus mengandung 'Yamadipati', dapat: ${summary.dewane}`);
    assert.ok(!summary.dewane.includes('Nyamadipati'), 'Nama non-kanon Nyamadipati tidak boleh muncul sebagai label tampil');
    assert.ok(summary.dewane.startsWith('Sang Hyang'), 'dewane harus diawali Sang Hyang');
    assert.ok(summary.sesaji.length > 5);
    assert.ok(summary.tindih.length > 0);
    assert.ok(summary.watak.length > 10);
    assert.ok(summary.bilahi.length > 5);
    assert.ok(summary.tamba.length > 0);
    // Field baru dari B3 enrichment
    assert.equal(summary.dewaneKanon, 'Sang Hyang Yamadipati', 'dewaneKanon harus persis kanon');
    assert.equal(summary.dewaneSlug, 'yamadipati', 'dewaneSlug harus lowercase tanpa spasi');
    assert.ok(Array.isArray(summary.dewaneAliases), 'dewaneAliases harus array');
    assert.ok(summary.dewaneAliases.some(a => a.includes('Nyamadipati')), 'Alias Nyamadipati harus ada di dewaneAliases');
    // Field ilustrasi kanon
    assert.equal(summary.imageWuku, '/assets/illustrations/wuku/sinta.jpg');
    assert.equal(summary.imageDewane, '/assets/illustrations/dewane/sinta-dewane.jpg');
  });

  await t.test('Filter 4 Pilar Pawukon (Nambani, Pangupajiwa, Tetanen, Ala & Becik) memfilter item secara akurat tanpa kosong', async () => {
    const { searchWukuWithCategory } = await import('../js/modules/wuku/wuku-engine.js');
    const all = searchWukuWithCategory('', 'all');
    assert.equal(all.length, 30, 'Kategori all harus memuat 30 wuku');

    const alaBecik = searchWukuWithCategory('', 'ala_becik');
    assert.equal(alaBecik.length, 30, 'Kategori ala_becik harus memuat 30 wuku');

    const nambani = searchWukuWithCategory('', 'nambani');
    assert.ok(nambani.length > 0 && nambani.length <= 30, 'Kategori nambani tidak boleh kosong');
    assert.equal(nambani.length, 18, 'Kategori nambani harus memfilter tepat 18 wuku yang memiliki petenget usada');

    const pangupajiwa = searchWukuWithCategory('', 'pangupajiwa');
    assert.ok(pangupajiwa.length > 0 && pangupajiwa.length <= 30, 'Kategori pangupajiwa tidak boleh kosong');
    assert.equal(pangupajiwa.length, 14, 'Kategori pangupajiwa harus memfilter tepat 14 wuku rejeki');

    const tetanen = searchWukuWithCategory('', 'tetanen');
    assert.ok(tetanen.length > 0 && tetanen.length <= 30, 'Kategori tetanen tidak boleh kosong');
    assert.equal(tetanen.length, 17, 'Kategori tetanen harus memfilter tepat 17 wuku pertanian');
  });
});
