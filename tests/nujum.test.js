import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNujumData,
  getFaalakiah,
  namaKeAksaraList
} from '../js/modules/nujum/nujum-engine.js';

test('Nujum Engine - getNujumData 6 Dimensi Bincil', () => {
  // Cek Wuku Sinta, Minggu, Pahing
  const data = getNujumData('Sinta', 'Minggu', 'Pahing');
  assert.ok(data, 'Data nujum harus ditemukan');
  assert.equal(data.found, true);
  assert.ok(data.wuku === 'Shinto' || data.wuku === 'Sinta', 'Wuku harus Shinto/Sinta');
  assert.equal(data.dino, 'Minggu');
  assert.equal(data.pasaran, 'Pahing');

  // Periksa keberadaan 6 dimensi bincil
  assert.ok(data.padewan.nama, 'Harus ada dimensi Padewan');
  assert.ok(data.padewan.arti, 'Harus ada arti Padewan');

  assert.ok(data.paringkelan.nama, 'Harus ada dimensi Paringkelan');
  assert.ok(data.paringkelan.arti, 'Harus ada arti Paringkelan');

  assert.ok(data.pandangon.nama, 'Harus ada dimensi Pandangon');
  assert.ok(data.pandangon.arti, 'Harus ada arti Pandangon');

  assert.ok(data.paarasan.nama, 'Harus ada dimensi Paarasan');
  assert.ok(data.paarasan.arti, 'Harus ada arti Paarasan');

  assert.ok(data.pancasuda.nama, 'Harus ada dimensi Pancasuda');
  assert.ok(data.pancasuda.arti, 'Harus ada arti Pancasuda');

  assert.ok(data.kamarokan.nama, 'Harus ada dimensi Kamarokan');
  assert.ok(data.kamarokan.arti, 'Harus ada arti Kamarokan');

  assert.ok(data.pawukon, 'Harus ada detail pawukon');
});

test('Nujum Engine - namaKeAksaraList transliterasi suku kata', () => {
  const aksara = namaKeAksaraList('Budi');
  assert.deepEqual(aksara, ['BA', 'DA']);

  const aksaraSari = namaKeAksaraList('Sari');
  assert.deepEqual(aksaraSari, ['SA', 'RA']);
});

test('Nujum Engine - getFaalakiah ramalan nabi & tolak balak', () => {
  const faal = getFaalakiah('Agung');
  assert.ok(typeof faal.kode === 'number');
  assert.ok(faal.kode >= 0 && faal.kode < 12);
  assert.ok(faal.nabi, 'Harus memiliki nama Nabi pembina');
  assert.ok(faal.desc, 'Harus memiliki deskripsi dan amalan tolak balak');
  assert.ok(faal.sum > 0, 'Total nilai aksara harus lebih dari 0');
});
