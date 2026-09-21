import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cariRekomendasiTanggalMantu,
  getTingkatKeharmonisan,
  PANCA_SUDHA_MANTU_DATA,
  DISCLAIMER_ETIS_PERJODOHAN
} from '../js/modules/jodoh/jodoh-engine.js';
import { isDinoIjo, isDinoGede } from '../js/modules/kalender/kalender-engine.js';

test('Jodoh Mantu - Rekomendasi 5 Tanggal Mantu Rahayu (Tahap 4.2)', () => {
  const totalNeptuPasangan = 28; // Misal: 14 + 14
  const startDate = '2026-10-01';
  const rekomendasi = cariRekomendasiTanggalMantu(totalNeptuPasangan, startDate, 5);

  assert.ok(Array.isArray(rekomendasi), 'Hasil rekomendasi harus berupa array');
  assert.equal(rekomendasi.length, 5, 'Harus menghasilkan tepat 5 tanggal rekomendasi');

  rekomendasi.forEach((item, idx) => {
    assert.ok(item.dateStr, `Item #${idx + 1} harus memiliki dateStr`);
    assert.ok(item.formattedDate, `Item #${idx + 1} harus memiliki formattedDate`);
    assert.ok(item.dino, `Item #${idx + 1} harus memiliki dino`);
    assert.ok(item.pas, `Item #${idx + 1} harus memiliki pasaran`);
    assert.ok(item.neptuHari > 0, `Item #${idx + 1} harus memiliki neptuHari valid`);

    // Validasi aturan: Harus Dino Ijo
    assert.equal(item.isDinoIjo, true, `Item #${idx + 1} (${item.weton}) harus berstatus Dino Ijo`);
    assert.equal(isDinoIjo(item.dino, item.pas, item.wukuName), true);

    // Validasi aturan: Bukan Dino Gede
    assert.equal(item.isDinoGede, false, `Item #${idx + 1} (${item.weton}) tidak boleh Dino Gede`);
    assert.equal(isDinoGede(item.dino, item.pas, item.wukuName), false);

    // Validasi Panca Sudha Mantu: (totalNeptu + neptuHari) % 5 in [1, 2, 3]
    const sisa = (totalNeptuPasangan + item.neptuHari) % 5;
    assert.equal(item.sisaPancaSudha, sisa, `Sisa Panca Sudha harus sinkron`);
    assert.ok([1, 2, 3].includes(sisa), `Sisa harus Sri (1), Lungguh (2), atau Gedhong (3)`);
    assert.ok(['Sri', 'Lungguh', 'Gedhong'].includes(item.predikat));
    assert.ok(item.kategoriLabel, 'Harus memiliki label kategori mantu');
    assert.ok(item.makna, 'Harus memiliki makna panca sudha mantu');
  });
});

test('Jodoh Mantu - Evaluasi Tingkat Keharmonisan (Tahap 4.1)', () => {
  const tinggi = getTingkatKeharmonisan(86);
  assert.ok(tinggi.predikat.includes('Rahayu Utama'));
  assert.ok(tinggi.badgeClass.includes('emerald'));
  assert.ok(tinggi.saranKultural);

  const sedang = getTingkatKeharmonisan(57);
  assert.ok(sedang.predikat.includes('Madya Rahayu'));
  assert.ok(sedang.badgeClass.includes('amber'));

  const rendah = getTingkatKeharmonisan(28);
  assert.ok(rendah.predikat.includes('Ujian'));
  assert.ok(rendah.badgeClass.includes('rose'));
});

test('Jodoh Mantu - Disclaimer Etis & Kultural Perjodohan (Tahap 4.4)', () => {
  assert.ok(DISCLAIMER_ETIS_PERJODOHAN, 'Harus ada teks disclaimer');
  assert.ok(DISCLAIMER_ETIS_PERJODOHAN.includes('tepa slira'), 'Harus memuat nilai tepa slira');
  assert.ok(DISCLAIMER_ETIS_PERJODOHAN.includes('Gusti Kang Murbeng Dumadi'), 'Harus memuat penghormatan pada Sang Pencipta');
  assert.ok(DISCLAIMER_ETIS_PERJODOHAN.includes('welas asih'), 'Harus menekankan cinta kasih dan ikhtiar');
});
