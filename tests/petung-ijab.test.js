import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNeptuIjabDina,
  getNeptuIjabPasaran,
  hitungNeptuIjab,
  getIjabWeton,
  getIjabWuku,
  getIjabSasi,
  getIjabTahunWindu,
  getIjabTanggalJawa,
  hitungPetungIjab
} from '../js/modules/ijab/ijab-engine.js';
import {
  NEPTU_IJAB_DINA,
  NEPTU_IJAB_PASARAN,
  IJAB_WETON,
  IJAB_WUKU,
  IJAB_SASI
} from '../js/data/ijab-db.js';

test('Petung Ijab - Sistem Neptu Khusus Ijab Terpisah dari Neptu Standar', () => {
  // Verifikasi tabel neptu khusus ijab
  assert.equal(getNeptuIjabDina('Minggu'), 5);
  assert.equal(getNeptuIjabDina('Senin'), 4);
  assert.equal(getNeptuIjabDina('Selasa'), 1); // Bukan 3 seperti kalender standar
  assert.equal(getNeptuIjabDina('Rabu'), 6);   // Bukan 7 seperti kalender standar
  assert.equal(getNeptuIjabDina('Kamis'), 7);  // Bukan 8 seperti kalender standar
  assert.equal(getNeptuIjabDina('Jumat'), 3);  // Bukan 6 seperti kalender standar
  assert.equal(getNeptuIjabDina('Sabtu'), 2);  // Bukan 9 seperti kalender standar

  assert.equal(getNeptuIjabPasaran('Legi'), 2);   // Bukan 5
  assert.equal(getNeptuIjabPasaran('Pahing'), 3); // Bukan 9
  assert.equal(getNeptuIjabPasaran('Pon'), 4);    // Bukan 7
  assert.equal(getNeptuIjabPasaran('Wage'), 5);   // Bukan 4
  assert.equal(getNeptuIjabPasaran('Kliwon'), 6); // Bukan 8
});

test('Petung Ijab - Lookup Weton Ijab & Surasa', () => {
  const wetonMPon = getIjabWeton('Minggu', 'Pon');
  assert.ok(wetonMPon);
  assert.equal(wetonMPon.neptu_jumlah_ijab, 9);
  assert.equal(wetonMPon.surasane_ijab, 'Sanggar Waringin');
  assert.equal(wetonMPon.status_ringkas, 'Becik');

  const wetonSWage = getIjabWeton('Senin', 'Wage');
  assert.ok(wetonSWage);
  assert.equal(wetonSWage.neptu_jumlah_ijab, 9);
  assert.equal(wetonSWage.surasane_ijab, 'Sanggar Waringin');

  // Total 35 kombinasi weton
  assert.equal(IJAB_WETON.length, 35);
});

test('Petung Ijab - Lookup Wuku (30 Wuku)', () => {
  assert.equal(IJAB_WUKU.length, 30);
  const sinta = getIjabWuku('Sinta');
  assert.equal(sinta.kanggo_ijab, 'Becik');
  const landep = getIjabWuku('Landep');
  assert.equal(landep.kanggo_ijab, 'Ala');
});

test('Petung Ijab - Lookup Sasi, Tahun Windu, Tanggal Jawa', () => {
  assert.equal(IJAB_SASI.length, 12);
  const sura = getIjabSasi('Sura');
  assert.ok(sura.kanggo_ijab.includes('Rusak'));

  const alip = getIjabTahunWindu('Alip');
  assert.ok(alip.kanggo_ijab.includes('Kalebo Wisa'));

  const tgl2 = getIjabTanggalJawa(2);
  assert.equal(tgl2.pakarti_tanggal_jawa, 'Berhasil');
  assert.equal(tgl2.tegese_status, 'Becik');
});

test('Petung Ijab - Evaluasi Komprehensif hitungPetungIjab', () => {
  const res = hitungPetungIjab({
    dina: 'Minggu',
    pasaran: 'Pon',
    wuku: 'Sinta',
    sasi: 'Besar',
    tahun: 'Alip',
    tanggalJawa: 2
  });

  assert.equal(res.dina, 'Minggu');
  assert.equal(res.pasaran, 'Pon');
  assert.equal(res.neptuCalc.neptuJumlah, 9);
  assert.equal(res.wetonData.surasane_ijab, 'Sanggar Waringin');
  assert.equal(res.wukuData.kanggo_ijab, 'Becik');
  assert.ok(res.factors.length >= 4);
  assert.ok(res.catatanSistemNeptu.includes('Neptu Khusus Ijab'));
});
