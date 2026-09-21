import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hitungSelametanDates,
  TARGET_HARI_SELAMETAN,
  TARGET_PASARAN_SELAMETAN,
  JENIS_SELAMETAN
} from '../js/modules/selametan/selametan-engine.js';

test('Selametan Engine - hitungSelametanDates verifikasi 7 target pengetan', () => {
  // Misal wafat pada: 1 Januari 2024 (Senin Pahing)
  // Senin = weekdayId 1
  const res = hitungSelametanDates(2024, 1, 1);

  assert.ok(res.geblak);
  assert.equal(res.geblak.hari, 'Senin');
  assert.equal(res.geblak.pasaran, 'Pahing');

  assert.equal(res.items.length, 7, 'Harus menghasilkan 7 jadwal peringatan');

  // 1. 3 Harian
  assert.equal(res.items[0].nama, '3 Harian');
  assert.equal(res.items[0].targetH, TARGET_HARI_SELAMETAN[1][0]); // Hari ke-0 dari Senin
  assert.equal(res.items[0].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][0]);

  // 2. 7 Harian
  assert.equal(res.items[1].nama, '7 Harian');
  assert.equal(res.items[1].targetH, TARGET_HARI_SELAMETAN[1][1]);
  assert.equal(res.items[1].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][1]);

  // 3. 40 Harian
  assert.equal(res.items[2].nama, '40 Harian');
  assert.equal(res.items[2].targetH, TARGET_HARI_SELAMETAN[1][2]);
  assert.equal(res.items[2].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][2]);

  // 4. 100 Harian
  assert.equal(res.items[3].nama, '100 Harian');

  // 5. Pendak Pisan (1 Tahun)
  assert.equal(res.items[4].nama, 'Pendak Pisan (1 Tahun)');

  // 6. Pendak Pindho (2 Tahun)
  assert.equal(res.items[5].nama, 'Pendak Pindho (2 Tahun)');

  // 7. Nyewu (1000 Hari)
  assert.equal(res.items[6].nama, 'Nyewu (1000 Hari)');
  assert.ok(res.items[6].diffDays >= 990 && res.items[6].diffDays <= 1010, 'Jarak hari nyewu harus ~1000 hari');
});
