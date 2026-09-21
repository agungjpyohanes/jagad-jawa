import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hitungPitung7Metode,
  autoDetectAksara,
  getAksaraVal
} from '../js/modules/jodoh/jodoh-engine.js';

test('Jodoh Engine - autoDetectAksara nama calon mempelai', () => {
  const aks = autoDetectAksara('Dewi Shinta');
  assert.equal(aks.depan, 'DA', 'Depan nama D = DA');
  assert.equal(aks.belakang, 'HA', 'Belakang nama A = HA');

  const aks2 = autoDetectAksara('Raden Rama');
  assert.equal(aks2.depan, 'RA', 'Depan R = RA');
  assert.equal(aks2.belakang, 'HA', 'Belakang A = HA');
});

test('Jodoh Engine - getAksaraVal pembobotan metode IV dan V/VI', () => {
  assert.equal(getAksaraVal('HA', 'iv'), 6);
  assert.equal(getAksaraVal('HA', 'vvi'), 5);
  assert.equal(getAksaraVal('NA', 'iv'), 3);
  assert.equal(getAksaraVal('NA', 'vvi'), 2);
});

test('Jodoh Engine - hitungPitung7Metode kalkulasi lengkap 7 metode', () => {
  // Contoh Pasangan:
  // Wanita: Kamis (8) Legi (5) = Neptu 13
  // Pria: Jumat (6) Kliwon (8) = Neptu 14
  // Total Neptu: 27
  const p = {
    nama: 'Dewi Sekartaji',
    hari: 'Kamis',
    pasaran: 'Legi',
    neptu: 13,
    aksaraDepan: 'DA',
    aksaraBelakang: 'JA'
  };
  const l = {
    nama: 'Panji Asmorobangun',
    hari: 'Jumat',
    pasaran: 'Kliwon',
    neptu: 14,
    aksaraDepan: 'PA',
    aksaraBelakang: 'NGA'
  };

  const hasil = hitungPitung7Metode(p, l);

  assert.equal(hasil.totalNeptu, 27);
  assert.equal(hasil.rows.length, 7, 'Harus mencakup 7 metode');

  // Metode I: 27 % 4 = 3 -> SRI (baik)
  assert.equal(hasil.rows[0].h.nama, 'SRI');
  assert.equal(hasil.rows[0].h.status, 'baik');

  // Metode II: 27 % 5 = 2 -> LUNGGUH (baik)
  assert.equal(hasil.rows[1].h.nama, 'LUNGGUH');
  assert.equal(hasil.rows[1].h.status, 'baik');

  // Metode III: 27 % 7 = 6 -> BUMI KAPETAK (campur)
  assert.equal(hasil.rows[2].h.nama, 'BUMI KAPETAK');
  assert.equal(hasil.rows[2].h.status, 'campur');

  // Verifikasi ringkasan statistik
  const { baik, buruk, campur, total, skorKeselarasan } = hasil.summary;
  assert.equal(total, 7);
  assert.equal(baik + buruk + campur, 7);
  assert.ok(skorKeselarasan >= 0 && skorKeselarasan <= 100);
});
