import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import oracle / baseline modules
import {
  toJDN,
  getDayInfo,
  getNeptu,
  getDaysInMonth,
  isDinoGede,
  isDinoIjo,
  getTanggalJawaLengkap,
  HARI,
  PASARAN,
  WUKU
} from '../js/modules/kalender/kalender-engine.js';

import { hitungPitung7Metode } from '../js/modules/jodoh/jodoh-engine.js';
import { hitungSelametanDates } from '../js/modules/selametan/selametan-engine.js';
import { hitungPetungIjab } from '../js/modules/ijab/ijab-engine.js';
import { hitungPetungOmah } from '../js/modules/omah/omah-engine.js';
import {
  getPetungKehidupanByDate,
  getPetungKehidupanByWeton
} from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';
import { getNujumData } from '../js/data/nujum-matrix.js';
import { getFaalakiah, namaKeAksaraList } from '../js/data/personality.js';
import { getPetungTetanen } from '../js/data/petung-tetanen-db.js';
import { getWukuPetenget } from '../js/data/wuku-petenget-db.js';
import { getPawukonDetail } from '../js/data/pawukon.js';

describe('Characterization Baseline Oracle: Preservasi 100% Formula Jagad Jawa', () => {

  it('1. Kalender, Epoch, Kabisat, dan Tanggal Batas', () => {
    // Patokan Epoch JDN
    assert.equal(toJDN(2021, 8, 29), 2459456);

    // Leap year kabisat
    assert.equal(getDaysInMonth(2024, 2), 29);
    assert.equal(getDaysInMonth(2023, 2), 28);
    assert.equal(getDaysInMonth(2000, 2), 29);
    assert.equal(getDaysInMonth(1900, 2), 28);

    // Tanggal batas milenium (1 Jan 2000 = Sabtu Legi)
    const day2000 = getDayInfo(2000, 1, 1);
    assert.equal(HARI[day2000.weekdayId], 'Sabtu');
    assert.equal(PASARAN[day2000.pasaranId], 'Legi');

    // Tanggal 5 Okt 2026
    const day2026 = getDayInfo(2026, 10, 5);
    assert.equal(HARI[day2026.weekdayId], 'Senin');
    assert.equal(PASARAN[day2026.pasaranId], 'Kliwon');

    // Tanggal Jawa lengkap 17 Agustus 2024
    const tglJawa = getTanggalJawaLengkap(2024, 8, 17);
    assert.equal(tglJawa.dino, 'Sabtu');
    assert.equal(tglJawa.pas, 'Legi');
    assert.equal(tglJawa.neptu, 14);
  });

  it('2. Kombinasi Weton Lengkap & Neptu Standar', () => {
    const samples = [
      { h: 'Minggu', p: 'Legi', exp: 10 },
      { h: 'Minggu', p: 'Pahing', exp: 14 },
      { h: 'Minggu', p: 'Pon', exp: 12 },
      { h: 'Minggu', p: 'Wage', exp: 9 },
      { h: 'Minggu', p: 'Kliwon', exp: 13 },
      { h: 'Senin', p: 'Kliwon', exp: 12 },
      { h: 'Selasa', p: 'Wage', exp: 7 },
      { h: 'Rabu', p: 'Legi', exp: 12 },
      { h: 'Kamis', p: 'Pahing', exp: 17 },
      { h: 'Jumat', p: 'Wage', exp: 10 },
      { h: 'Sabtu', p: 'Pahing', exp: 18 }
    ];

    for (const s of samples) {
      assert.equal(getNeptu(s.h, s.p), s.exp, `Neptu ${s.h} ${s.p} harus ${s.exp}`);
    }
  });

  it('3. Perjodohan 7 Metode (Baseline Golden Output)', () => {
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
    assert.equal(hasil.rows.length, 7);
    assert.equal(hasil.rows[0].h.nama, 'SRI');
    assert.equal(hasil.rows[0].h.status, 'baik');
    assert.equal(hasil.rows[1].h.nama, 'LUNGGUH');
    assert.equal(hasil.rows[1].h.status, 'baik');
  });

  it('4. Selametan: Siang vs Malam Bakda Maghrib', () => {
    // Wafat siang
    const resSiang = hitungSelametanDates(2024, 3, 1, 'siang', 'Eyang Broto');
    assert.equal(resSiang.geblak.hari, 'Jumat');
    assert.equal(resSiang.geblak.pasaran, 'Pahing');
    assert.equal(resSiang.geblak.tanggal, 1);
    assert.equal(resSiang.items.length, 7);

    // Wafat malam bakda maghrib (berganti ke esok harinya)
    const resMalam = hitungSelametanDates(2024, 3, 1, 'malam_maghrib', 'Eyang Broto');
    assert.equal(resMalam.geblak.hari, 'Sabtu');
    assert.equal(resMalam.geblak.pasaran, 'Pon');
    assert.equal(resMalam.geblak.tanggal, 2);
    assert.equal(resMalam.items.length, 7);
  });

  it('5. Petung Ijab (Sistem Neptu Khusus & Evaluasi Komprehensif)', () => {
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

  it('6. Petung Omah & Cempuri Lawangan (Modulo 4 & 5)', () => {
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

  it('7. Petung Ternak, Loro, & Geblak', () => {
    const info = getPetungKehidupanByWeton('Minggu', 'Pon');
    assert.ok(info);
    assert.equal(info.dina, 'Minggu');
    assert.equal(info.pasaran, 'Pon');
    assert.equal(info.neptu, 12);
    assert.equal(info.ternak.kode, 'Buto');
    assert.equal(info.loro.kode, 'Lepas');
    assert.equal(info.geblak.kode, 'Asad');

    const byDate = getPetungKehidupanByDate(2026, 10, 5);
    assert.ok(byDate);
    assert.equal(byDate.dina, 'Senin');
    assert.equal(byDate.pasaran, 'Kliwon');
  });

  it('8. Nujum Matrix 6 Dimensi Bincil & Faalakiah', () => {
    const nujum = getNujumData('Sinta', 'Minggu', 'Pahing');
    assert.ok(nujum);
    assert.equal(nujum.padewan.nama, 'Sri');
    assert.equal(nujum.paringkelan.nama, 'Tungle');
    assert.equal(nujum.pandangon.nama, 'Dangu');
    assert.equal(nujum.paarasan.nama, 'Lakuning Rembulan');
    assert.equal(nujum.pancasuda.nama, 'Wasesa Segara');
    assert.equal(nujum.kamarokan.nama, 'Nuju Pati');

    const aksaraList = namaKeAksaraList('Agung');
    assert.ok(Array.isArray(aksaraList));
    assert.ok(aksaraList.length > 0);

    const faal = getFaalakiah('Agung');
    assert.ok(faal);
    assert.equal(typeof faal.sum, 'number');
    assert.equal(faal.sum, 18);
    assert.ok(faal.nabi);
  });

  it('9. Tetanen & 4 Pilar Wuku Petenget', () => {
    const tetanen = getPetungTetanen('Minggu', 'Pon');
    assert.ok(tetanen);
    assert.equal(tetanen.kangBecik, 'uwoh');
    assert.equal(tetanen.kategoriLabel, 'Uwoh (Pala Gumantung / Buah-buahan)');

    const petenget = getWukuPetenget('Sinta');
    assert.ok(petenget);
    assert.equal(petenget.wuku, 'Sinta');
    assert.ok(petenget.alaBecik);
    assert.ok(petenget.pangupajiwa);

    const pawukon = getPawukonDetail(1);
    assert.ok(pawukon);
    assert.equal(pawukon.nama_wuku, 'Sinta');
    assert.equal(pawukon.dewane, 'Sang Hyang Yamadipati');
  });
});
