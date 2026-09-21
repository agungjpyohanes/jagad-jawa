import test from 'node:test';
import assert from 'node:assert/strict';
import { compareNonJodoh } from '../js/modules/nujum/nujum-engine.js';

test('Nujum Compare - Komparasi Sinergi Relasi Non-Jodoh (Rekan Kerja)', () => {
  const p1 = { nama: 'Raden Bima', tglLahir: '1990-05-15' };
  const p2 = { nama: 'Arjuna', tglLahir: '1992-08-20' };

  const result = compareNonJodoh(p1, p2, 'rekan_kerja');

  assert.ok(result, 'Hasil perbandingan harus ada');
  assert.ok(result.person1, 'Harus ada profil Person 1');
  assert.ok(result.person2, 'Harus ada profil Person 2');
  assert.ok(result.sinergi, 'Harus ada analisis sinergi');
  assert.ok(result.disclaimer, 'Harus menyertakan etika & literasi kultural');

  // Validasi Person 1
  assert.equal(result.person1.nama, 'Raden Bima');
  assert.ok(result.person1.dino);
  assert.ok(result.person1.pas);
  assert.ok(result.person1.neptu > 0);
  assert.ok(result.person1.tipeKarakter);
  assert.ok(result.person1.bincil.padewan.nama);
  assert.ok(result.person1.bincil.paarasan.nama);

  // Validasi Person 2
  assert.equal(result.person2.nama, 'Arjuna');
  assert.ok(result.person2.dino);
  assert.ok(result.person2.pas);
  assert.ok(result.person2.neptu > 0);
  assert.ok(result.person2.tipeKarakter);

  // Validasi Sinergi Relasi (Non-Pernikahan)
  assert.equal(result.sinergi.relasiType, 'rekan_kerja');
  assert.equal(result.sinergi.relasiLabel, 'Rekan Kerja & Kolaborasi Tim');
  assert.ok(typeof result.sinergi.skorKeselarasanRelasi === 'number');
  assert.ok(result.sinergi.skorKeselarasanRelasi >= 0 && result.sinergi.skorKeselarasanRelasi <= 100);

  assert.ok(Array.isArray(result.sinergi.titikTemu), 'Titik temu harus berupa array');
  assert.ok(result.sinergi.titikTemu.length > 0, 'Harus ada minimal satu titik temu komunikasi');

  assert.ok(Array.isArray(result.sinergi.potensiFriksi), 'Potensi friksi harus berupa array');
  assert.ok(result.sinergi.potensiFriksi.length > 0, 'Harus ada panduan mitigasi potensi friksi');

  assert.ok(Array.isArray(result.sinergi.saranTepaSlira), 'Saran tepa slira harus berupa array');
  assert.ok(result.sinergi.saranTepaSlira.length > 0, 'Harus ada anjuran etika kearifan lokal');
});

test('Nujum Compare - Konteks Mitra Bisnis dan Sahabat', () => {
  const p1 = { nama: 'Gatotkaca', tglLahir: '1988-11-10' };
  const p2 = { nama: 'Antasena', tglLahir: '1991-03-25' };

  const resBisnis = compareNonJodoh(p1, p2, 'mitra_bisnis');
  assert.equal(resBisnis.sinergi.relasiType, 'mitra_bisnis');
  assert.equal(resBisnis.sinergi.relasiLabel, 'Mitra Usaha & Rekan Bisnis');
  assert.ok(resBisnis.sinergi.skorKeselarasanRelasi >= 40);

  const resSahabat = compareNonJodoh(p1, p2, 'sahabat');
  assert.equal(resSahabat.sinergi.relasiType, 'sahabat');
  assert.equal(resSahabat.sinergi.relasiLabel, 'Persahabatan & Relasi Sosial');

  const resKeluarga = compareNonJodoh(p1, p2, 'keluarga');
  assert.equal(resKeluarga.sinergi.relasiType, 'keluarga');
  assert.equal(resKeluarga.sinergi.relasiLabel, 'Hubungan Persaudaraan / Keluarga');
});
