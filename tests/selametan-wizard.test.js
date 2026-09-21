import test from 'node:test';
import assert from 'node:assert/strict';
import { hitungSelametanDates, SELAMETAN_KULTURAL_DATA } from '../js/modules/selametan/selametan-engine.js';

test('Selametan Wizard - Hitung Siang vs Malam Bakda Maghrib', async (t) => {
  await t.test('Wafat Siang (sebelum maghrib) memakai tanggal Masehi yang sama sebagai Geblak', () => {
    // 2024-03-01 adalah Jumat Pahing
    const res = hitungSelametanDates(2024, 3, 1, 'siang', 'Eyang Broto');
    assert.equal(res.geblak.hari, 'Jumat');
    assert.equal(res.geblak.pasaran, 'Pahing');
    assert.equal(res.geblak.tanggal, 1);
    assert.equal(res.geblak.bulan, 3);
    assert.equal(res.geblak.tahun, 2024);
    assert.equal(res.namaAlmarhum, 'Eyang Broto');
    assert.equal(res.waktuWafat, 'siang');
  });

  await t.test('Wafat Malam (bakda Maghrib) berganti ke hari berikutnya sesuai kaidah Sultan Agungan', () => {
    // 2024-03-01 malam bakda maghrib -> Geblak dihitung Sabtu Pon (2024-03-02)
    const res = hitungSelametanDates(2024, 3, 1, 'malam_maghrib', 'Eyang Broto');
    assert.equal(res.geblak.hari, 'Sabtu');
    assert.equal(res.geblak.pasaran, 'Pon');
    assert.equal(res.geblak.tanggal, 2);
    assert.equal(res.geblak.bulan, 3);
    assert.equal(res.geblak.tahun, 2024);
    assert.equal(res.waktuWafat, 'malam_maghrib');
    assert.equal(res.geblak.tanggalMasehiAsli, '1 Maret 2024');
  });
});

test('Selametan Wizard - Kelengkapan 7 Milestone & Metadata Kultural', (t) => {
  const res = hitungSelametanDates(2016, 2, 19, 'siang', 'Raden Mas Haryo');
  assert.equal(res.items.length, 7, 'Harus menghasilkan tepat 7 tahapan pengetan');

  const [d3, d7, d40, d100, mendhak1, mendhak2, nyewu] = res.items;

  // Verifikasi nama dan target
  assert.equal(d3.nama, '3 Harian');
  assert.equal(d7.nama, '7 Harian');
  assert.equal(d40.nama, '40 Harian');
  assert.equal(d100.nama, '100 Harian');
  assert.equal(mendhak1.nama, 'Pendak Pisan (1 Tahun)');
  assert.equal(mendhak2.nama, 'Pendak Pindho (2 Tahun)');
  assert.equal(nyewu.nama, 'Nyewu (1000 Hari)');

  // Verifikasi kelengkapan metadata kultural
  res.items.forEach(item => {
    assert.ok(item.maknaKultural && item.maknaKultural.length > 10, `${item.nama} harus memiliki makna kultural`);
    assert.ok(item.ubarampe && item.ubarampe.length > 5, `${item.nama} harus memiliki keterangan ubarampe`);
    assert.ok(item.donga && item.donga.length > 3, `${item.nama} harus memiliki keterangan doa tradisi`);
    assert.ok(item.targetH && item.targetP, `${item.nama} harus memiliki target weton`);
    assert.ok(item.diffDays > 0, `${item.nama} harus memiliki selisih hari positif`);
  });

  // Verifikasi dataset kultural mandiri
  assert.equal(SELAMETAN_KULTURAL_DATA.length, 7);
});
