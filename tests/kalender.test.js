import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toJDN,
  getDayInfo,
  getTanggalJawaLengkap,
  getNeptu,
  evaluateDino,
  checkDinoGede,
  getDaysInMonth,
  HARI,
  PASARAN,
  WUKU,
  EPOCH_JDN
} from '../js/modules/kalender/kalender-engine.js';

test('Kalender Engine - Julian Day Number (toJDN)', () => {
  // Epoch patokan abadi: 29 Agustus 2021 = JDN 2459456
  const epochJDN = toJDN(2021, 8, 29);
  assert.equal(epochJDN, EPOCH_JDN);

  // 1 Januari 2024
  const jdn2024 = toJDN(2024, 1, 1);
  assert.equal(jdn2024, 2460311);
});

test('Kalender Engine - getDayInfo Patokan Abadi (29 Agustus 2021)', () => {
  const info = getDayInfo(2021, 8, 29);
  // Minggu (idx 0), Pahing (idx 1), Wuku Sinta (idx 0)
  assert.equal(info.weekdayId, 0, 'Harus Minggu');
  assert.equal(HARI[info.weekdayId], 'Minggu');
  assert.equal(info.pasaranId, 1, 'Harus Pahing');
  assert.equal(PASARAN[info.pasaranId], 'Pahing');
  assert.equal(info.wukuId, 0, 'Harus Wuku Sinta');
  assert.equal(WUKU[info.wukuId], 'Sinta');
});

test('Kalender Engine - getNeptu calculation', () => {
  // Minggu (5) + Legi (5) = 10
  assert.equal(getNeptu('Minggu', 'Legi'), 10);
  // Jumat (6) + Kliwon (8) = 14
  assert.equal(getNeptu('Jumat', 'Kliwon'), 14);
  // Rebo (7) + Pon (7) = 14
  assert.equal(getNeptu('Rabu', 'Pon'), 14);
  // Sabtu (9) + Pahing (9) = 18 (Neptu tertinggi)
  assert.equal(getNeptu('Sabtu', 'Pahing'), 18);
  // Selasa (3) + Wage (4) = 7 (Neptu terendah)
  assert.equal(getNeptu('Selasa', 'Wage'), 7);
});

test('Kalender Engine - getTanggalJawaLengkap struktur dan konsistensi', () => {
  const tgl = getTanggalJawaLengkap(2024, 8, 17); // HUT RI ke-79
  assert.ok(tgl.dino, 'Harus memiliki nama dino');
  assert.ok(tgl.pas, 'Harus memiliki nama pasaran');
  assert.equal(tgl.neptu, getNeptu(tgl.dino, tgl.pas));
  assert.ok(tgl.wukuName, 'Harus memiliki wuku');
  assert.ok(tgl.tahunAJ > 1900, 'Tahun Anno Javanico harus valid');
  assert.ok(tgl.namaWindu, 'Harus memiliki nama windu');
  assert.ok(tgl.fullStr.includes('AJ'), 'Full string harus memuat tahun AJ');
});

test('Kalender Engine - evaluateDino (Dino Ijo vs Dino Ala)', () => {
  // Kamis Legi di Wuku Sinta adalah Dino Ijo baku
  const resIjo = evaluateDino('Sinta', 'Kamis', 'Legi');
  assert.equal(resIjo.isIjo, true);
  assert.equal(resIjo.isAbang, false);

  // Cek hari umum yang bukan dino ijo
  const resAla = evaluateDino('Sinta', 'Senin', 'Wage');
  assert.equal(resAla.isIjo, false);
  assert.equal(resAla.isAbang, true);
});

test('Kalender Engine - getDaysInMonth kabisat vs non-kabisat', () => {
  assert.equal(getDaysInMonth(2024, 2), 29, 'Tahun 2024 kabisat = 29 hari');
  assert.equal(getDaysInMonth(2023, 2), 28, 'Tahun 2023 non-kabisat = 28 hari');
  assert.equal(getDaysInMonth(2024, 1), 31);
  assert.equal(getDaysInMonth(2024, 4), 30);
});
