import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNeptuApp,
  getNeptuNb,
  hitungSetA,
  hitungSetB,
  hitungSetC,
  cekLaranganArahBoyongan,
  getCempuriLawangan,
  getOmahMenurutSasi,
  getOmahMenurutMangsa,
  getOmahPilihLemah,
  hitungPetungOmah
} from '../js/modules/omah/omah-engine.js';
import {
  CEMPURI_LAWANGAN,
  OMAH_PILIH_LEMAH
} from '../js/data/omah-db.js';

test('Petung Omah - Komparasi Neptu App vs Neptu NB', () => {
  // Contoh: Sabtu Kliwon
  const appSK = getNeptuApp('Sabtu', 'Kliwon');
  assert.equal(appSK.neptuDina, 9);
  assert.equal(appSK.neptuPasaran, 8);
  assert.equal(appSK.neptuJumlah, 17);

  const nbSK = getNeptuNb('Sabtu', 'Kliwon');
  assert.equal(nbSK.neptuDina, 8); // NB Sabtu = 8
  assert.equal(nbSK.neptuPasaran, 8);
  assert.equal(nbSK.neptuJumlah, 16);

  // Minggu Legi
  const appML = getNeptuApp('Minggu', 'Legi');
  assert.equal(appML.neptuDina, 5);
  const nbML = getNeptuNb('Minggu', 'Legi');
  assert.equal(nbML.neptuDina, 6); // NB Minggu = 6
});

test('Petung Omah - Petungan Set A, B, dan C', () => {
  // Sabtu Kliwon: Neptu App = 17, Neptu NB = 16
  // Set A: 17 % 4 = 1 -> Bumi (Tetep kukuh sarta rahayu slamet)
  const setA = hitungSetA(17);
  assert.equal(setA.sisa, 1);
  assert.equal(setA.nama, 'Bumi');
  assert.equal(setA.status, 'Becik');

  // Set B: 17 % 5 = 2 -> Yasa (Bisa kuwat)
  const setB = hitungSetB(17);
  assert.equal(setB.sisa, 2);
  assert.equal(setB.nama, 'Yasa');
  assert.equal(setB.status, 'Becik');

  // Set C: 16 % 4 = 4 (sisa 0 -> 4) -> Sempoyong
  const setC = hitungSetC(16);
  assert.equal(setC.sisa, 4);
  assert.equal(setC.nama, 'Sempoyong');
  assert.equal(setC.status, 'Ala');
});

test('Petung Omah - Larangan Arah Boyongan', () => {
  // Neptu 17 masuk kelompok 9, 14, 17 -> Larangan Selatan
  const check17Selatan = cekLaranganArahBoyongan(17, 'Selatan');
  assert.equal(check17Selatan.isProhibited, true);
  assert.ok(check17Selatan.warningText.includes('NGIDUL'));

  const check17Utara = cekLaranganArahBoyongan(17, 'Utara');
  assert.equal(check17Utara.isProhibited, false);
});

test('Petung Omah - Cempuri Lawangan (4 Arah x 9 Posisi)', () => {
  assert.equal(CEMPURI_LAWANGAN.length, 36);
  const timur2 = getCempuriLawangan('Timur', 2);
  assert.ok(timur2.selected);
  assert.equal(timur2.selected.arti, 'Oleh kasugihan');
  assert.equal(timur2.positions.length, 9);
});

test('Petung Omah - Pilihan Lemah (26 Data Karakteristik)', () => {
  assert.equal(OMAH_PILIH_LEMAH.length, 26);
  const lemah1 = getOmahPilihLemah(1);
  assert.equal(lemah1.aran, 'Manik Mulyo');
  assert.ok(lemah1.watak_akibat.includes('Sirna ing lelara'));
  assert.ok(lemah1.sarana_anjuran.includes('sosor bebek'));
});

test('Petung Omah - Evaluasi Komprehensif hitungPetungOmah', () => {
  const res = hitungPetungOmah({
    dina: 'Sabtu',
    pasaran: 'Kliwon',
    arahLawang: 'Timur',
    nomorLawang: 2,
    arahPindah: 'Selatan',
    sasi: 'Sura',
    mangsa: 'Kasa',
    ciriLemahId: 1
  });

  assert.equal(res.neptuApp.neptuJumlah, 17);
  assert.equal(res.neptuNb.neptuJumlah, 16);
  assert.equal(res.setA.nama, 'Bumi');
  assert.equal(res.setB.nama, 'Yasa');
  assert.equal(res.setC.nama, 'Sempoyong');
  assert.equal(res.laranganBoyongan.isProhibited, true);
  assert.ok(res.disclaimer.includes('Pènget Luhur'));
});
