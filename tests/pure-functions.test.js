/**
 * Jagad Jawa — Unit Test: Pure Functions & Mathematical Formulas (B2)
 * 
 * Menguji pure functions kalender, neptu, exact lookup nujum bincil,
 * dan modulo pitung perjodohan tanpa mocking sembarangan,
 * membandingkan langsung terhadap expected values baku jawa-v1.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  toJDN,
  getDayInfo,
  getNeptu,
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  WUKU,
  EPOCH_JDN
} from '../js/modules/kalender/kalender-engine.js';

import { getNujumData } from '../js/data/nujum-matrix.js';

import {
  HASIL_I_JODOH,
  HASIL_II_JODOH,
  HASIL_III_JODOH
} from '../js/data/marriage.js';

// ─── 1. toJDN & getDayInfo (Fixed Reference Dates vs Jawa-v1 Expected) ─────
test('Pure Functions - toJDN / getDayInfo (Fixed Reference Dates)', () => {
  // Tanggal 1: Patokan Abadi Epoch (29 Agustus 2021)
  const jdnEpoch = toJDN(2021, 8, 29);
  assert.equal(jdnEpoch, EPOCH_JDN);
  assert.equal(jdnEpoch, 2459456);

  const infoEpoch = getDayInfo(2021, 8, 29);
  assert.equal(infoEpoch.weekdayId, 0, '29 Agustus 2021 harus Minggu');
  assert.equal(HARI[infoEpoch.weekdayId], 'Minggu');
  assert.equal(infoEpoch.pasaranId, 1, '29 Agustus 2021 harus Pahing');
  assert.equal(PASARAN[infoEpoch.pasaranId], 'Pahing');
  assert.equal(infoEpoch.wukuId, 0, '29 Agustus 2021 harus Wuku Sinta');
  assert.equal(WUKU[infoEpoch.wukuId], 'Sinta');
  assert.equal(infoEpoch.ajYear, 1955);
  assert.deepEqual(infoEpoch.hijri, [20, 1, 1443]);

  // Tanggal 2: Proklamasi Kemerdekaan RI (17 Agustus 1945)
  const jdnProklamasi = toJDN(1945, 8, 17);
  assert.equal(jdnProklamasi, 2431685);

  const infoProklamasi = getDayInfo(1945, 8, 17);
  assert.equal(infoProklamasi.weekdayId, 5, '17 Agustus 1945 harus Jumat');
  assert.equal(HARI[infoProklamasi.weekdayId], 'Jumat');
  assert.equal(infoProklamasi.pasaranId, 0, '17 Agustus 1945 harus Legi');
  assert.equal(PASARAN[infoProklamasi.pasaranId], 'Legi');
  assert.equal(infoProklamasi.wukuId, 22, '17 Agustus 1945 harus Wuku Manahil');
  assert.equal(WUKU[infoProklamasi.wukuId], 'Manahil');
  assert.equal(infoProklamasi.ajYear, 1876);
  assert.deepEqual(infoProklamasi.hijri, [8, 9, 1364]);

  // Tanggal 3: Pergantian Milenium (1 Januari 2000)
  const jdn2000 = toJDN(2000, 1, 1);
  assert.equal(jdn2000, 2451545);

  const info2000 = getDayInfo(2000, 1, 1);
  assert.equal(info2000.weekdayId, 6, '1 Januari 2000 harus Sabtu');
  assert.equal(HARI[info2000.weekdayId], 'Sabtu');
  assert.equal(info2000.pasaranId, 0, '1 Januari 2000 harus Legi');
  assert.equal(PASARAN[info2000.pasaranId], 'Legi');
  assert.equal(info2000.wukuId, 9, '1 Januari 2000 harus Wuku Sungsang');
  assert.equal(WUKU[info2000.wukuId], 'Sungsang');
  assert.equal(info2000.ajYear, 1932);
  assert.deepEqual(info2000.hijri, [24, 9, 1420]);

  // Tanggal 4: Awal Tahun 2024 (1 Januari 2024)
  const jdn2024 = toJDN(2024, 1, 1);
  assert.equal(jdn2024, 2460311);

  const info2024 = getDayInfo(2024, 1, 1);
  assert.equal(info2024.weekdayId, 1, '1 Januari 2024 harus Senin');
  assert.equal(HARI[info2024.weekdayId], 'Senin');
  assert.equal(info2024.pasaranId, 1, '1 Januari 2024 harus Pahing');
  assert.equal(PASARAN[info2024.pasaranId], 'Pahing');
  assert.equal(info2024.wukuId, 2, '1 Januari 2024 harus Wuku Wukir');
  assert.equal(WUKU[info2024.wukuId], 'Wukir');
  assert.equal(info2024.ajYear, 1957);
  assert.deepEqual(info2024.hijri, [19, 6, 1445]);
});

// ─── 2. Neptu = NEPTU_HARI + NEPTU_PASARAN ────────────────────────────────
test('Pure Functions - neptu = NEPTU_HARI + NEPTU_PASARAN', () => {
  // Verifikasi konstanta bobot hari
  assert.deepEqual(NEPTU_HARI, [5, 4, 3, 7, 8, 6, 9]);
  // Verifikasi konstanta bobot pasaran
  assert.deepEqual(NEPTU_PASARAN, [5, 9, 7, 4, 8]);

  // Uji seluruh 35 kombinasi 7 hari x 5 pasaran
  HARI.forEach((dino, hIdx) => {
    PASARAN.forEach((pas, pIdx) => {
      const expectedNeptu = NEPTU_HARI[hIdx] + NEPTU_PASARAN[pIdx];
      const actualNeptu = getNeptu(dino, pas);
      assert.equal(
        actualNeptu,
        expectedNeptu,
        `Neptu ${dino} ${pas} harus ${expectedNeptu}, didapat ${actualNeptu}`
      );
    });
  });

  // Uji batas ekstrem
  assert.equal(getNeptu('Selasa', 'Wage'), 7, 'Neptu terendah adalah Selasa Wage (3 + 4 = 7)');
  assert.equal(getNeptu('Sabtu', 'Pahing'), 18, 'Neptu tertinggi adalah Sabtu Pahing (9 + 9 = 18)');

  // Uji kombinasi penting
  assert.equal(getNeptu('Minggu', 'Legi'), 10);
  assert.equal(getNeptu('Jumat', 'Kliwon'), 14);
  assert.equal(getNeptu('Rabu', 'Pon'), 14);
  assert.equal(getNeptu('Kamis', 'Wage'), 12);
});

// ─── 3. getNujumData untuk 3 Kombinasi Weton + Wuku (Snapshot 6 Dimensi) ────
test('Pure Functions - getNujumData snapshot 3 kombinasi weton+wuku', () => {
  // Kombinasi 1: Minggu Pahing — Wuku Sinta
  const c1 = getNujumData('Sinta', 'Minggu', 'Pahing');
  assert.ok(c1, 'c1 harus ditemukan');
  assert.equal(c1.found, true);
  assert.equal(c1.padewan.nama, 'Sri');
  assert.equal(c1.paringkelan.nama, 'Tungle');
  assert.equal(c1.pandangon.nama, 'Dangu');
  assert.equal(c1.paarasan.nama, 'Lakuning Rembulan');
  assert.equal(c1.pancasuda.nama, 'Wasesa Segara');
  assert.equal(c1.kamarokan.nama, 'Nuju Pati');

  // Fleksibilitas urutan argumen (hari duluan vs wuku duluan)
  const c1Alt = getNujumData('Minggu', 'Pahing', 'Sinta');
  assert.equal(c1Alt.padewan.nama, c1.padewan.nama);
  assert.equal(c1Alt.pancasuda.nama, c1.pancasuda.nama);

  // Kombinasi 2: Senin Pon — Wuku Sinta
  const c2 = getNujumData('Sinta', 'Senin', 'Pon');
  assert.ok(c2, 'c2 harus ditemukan');
  assert.equal(c2.found, true);
  assert.equal(c2.padewan.nama, 'Indra');
  assert.equal(c2.paringkelan.nama, 'Aryang');
  assert.equal(c2.pandangon.nama, 'Dangu');
  assert.equal(c2.paarasan.nama, 'Aras Tuding');
  assert.equal(c2.pancasuda.nama, 'Sumur Sinaba');
  assert.equal(c2.kamarokan.nama, 'Kala Tinantang');

  // Kombinasi 3: Kamis Wage — Wuku Medangkungan
  const c3 = getNujumData('Medangkungan', 'Kamis', 'Wage');
  assert.ok(c3, 'c3 harus ditemukan');
  assert.equal(c3.found, true);
  assert.equal(c3.padewan.nama, 'Uma');
  assert.equal(c3.paringkelan.nama, 'Mawulu');
  assert.equal(c3.pandangon.nama, 'Dadi');
  assert.equal(c3.paarasan.nama, 'Aras Kembang');
  assert.equal(c3.pancasuda.nama, 'Tunggak Semi');
  assert.equal(c3.kamarokan.nama, 'Nuju Pati');
});

// ─── 4. totalNeptu % 4/5/7 untuk Pitung (Sisa Modulo & Pemetaan Hasil) ──────
test('Pure Functions - totalNeptu % 4/5/7 untuk pitung (sisa modulo)', () => {
  // ── Modulo 4 (Metode I: Sisa bagi 4) ──
  // Sisa 0: PUNGGEL
  // Sisa 1: GENTHA
  // Sisa 2: GEMBILI
  // Sisa 3: SRI
  assert.equal(HASIL_I_JODOH[24 % 4].nama, 'PUNGGEL');
  assert.equal(HASIL_I_JODOH[25 % 4].nama, 'GENTHA');
  assert.equal(HASIL_I_JODOH[26 % 4].nama, 'GEMBILI');
  assert.equal(HASIL_I_JODOH[27 % 4].nama, 'SRI');
  assert.equal(HASIL_I_JODOH[28 % 4].nama, 'PUNGGEL');

  // Status kultural metode I
  assert.equal(HASIL_I_JODOH[0].status, 'buruk');
  assert.equal(HASIL_I_JODOH[1].status, 'campur');
  assert.equal(HASIL_I_JODOH[2].status, 'buruk');
  assert.equal(HASIL_I_JODOH[3].status, 'baik');

  // ── Modulo 5 (Metode II: Sisa bagi 5) ──
  // Sisa 0: PATI
  // Sisa 1: SRI
  // Sisa 2: LUNGGUH
  // Sisa 3: GEDHONG
  // Sisa 4: LARA
  assert.equal(HASIL_II_JODOH[25 % 5].nama, 'PATI');
  assert.equal(HASIL_II_JODOH[26 % 5].nama, 'SRI');
  assert.equal(HASIL_II_JODOH[27 % 5].nama, 'LUNGGUH');
  assert.equal(HASIL_II_JODOH[28 % 5].nama, 'GEDHONG');
  assert.equal(HASIL_II_JODOH[29 % 5].nama, 'LARA');
  assert.equal(HASIL_II_JODOH[30 % 5].nama, 'PATI');

  // Status kultural metode II
  assert.equal(HASIL_II_JODOH[0].status, 'buruk');
  assert.equal(HASIL_II_JODOH[1].status, 'baik');
  assert.equal(HASIL_II_JODOH[2].status, 'baik');
  assert.equal(HASIL_II_JODOH[3].status, 'baik');
  assert.equal(HASIL_II_JODOH[4].status, 'buruk');

  // ── Modulo 7 (Metode III: Sisa bagi 7) ──
  // Sisa 0: LEBU KETIYUP ANGIN
  // Sisa 1: WASESA SEGARA
  // Sisa 2: TUNGGAK SEMI
  // Sisa 3: SATRIYA WIBAWA
  // Sisa 4: SUMUR SINABA
  // Sisa 5: SATRIYA WIRANG
  // Sisa 6: BUMI KAPETAK
  assert.equal(HASIL_III_JODOH[28 % 7].nama, 'LEBU KETIYUP ANGIN');
  assert.equal(HASIL_III_JODOH[29 % 7].nama, 'WASESA SEGARA');
  assert.equal(HASIL_III_JODOH[30 % 7].nama, 'TUNGGAK SEMI');
  assert.equal(HASIL_III_JODOH[31 % 7].nama, 'SATRIYA WIBAWA');
  assert.equal(HASIL_III_JODOH[32 % 7].nama, 'SUMUR SINABA');
  assert.equal(HASIL_III_JODOH[33 % 7].nama, 'SATRIYA WIRANG');
  assert.equal(HASIL_III_JODOH[34 % 7].nama, 'BUMI KAPETAK');

  // Status kultural metode III
  assert.equal(HASIL_III_JODOH[0].status, 'buruk');
  assert.equal(HASIL_III_JODOH[1].status, 'baik');
  assert.equal(HASIL_III_JODOH[2].status, 'campur');
  assert.equal(HASIL_III_JODOH[3].status, 'baik');
  assert.equal(HASIL_III_JODOH[4].status, 'baik');
  assert.equal(HASIL_III_JODOH[5].status, 'buruk');
  assert.equal(HASIL_III_JODOH[6].status, 'campur');
});
