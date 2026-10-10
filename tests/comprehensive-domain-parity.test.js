import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Import domain engines & pure logic
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
import { getPetungTetanen } from '../js/data/petung-tetanen-db.js';
import { getWukuPetenget } from '../js/data/wuku-petenget-db.js';
import { getPawukonDetail } from '../js/data/pawukon.js';
import { getNujumData } from '../js/data/nujum-matrix.js';
import { namaKeAksaraList } from '../js/data/personality.js';

// Import locale dictionary
import { id } from '../src/locales/id.js';
import { jv } from '../src/locales/jv.js';

describe('Comprehensive Domain Parity & Bilingual Validation Suite', () => {
  const dataDir = path.resolve(process.cwd(), 'public/data');

  function readJson(file) {
    const p = path.join(dataDir, file);
    assert.ok(fs.existsSync(p), `File ${file} harus ada`);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  // 1. Kalender Parity
  it('1. Kalender Parity: JDN, Weton, Neptu, dan Tanggal Batas', () => {
    const constants = readJson('01-kalender-constants.json');
    assert.equal(constants.epoch_pawukon.jdn, 2459456);
    assert.equal(constants.epoch_pawukon.tanggal, '2021-08-29');

    // 17 Agustus 1945 = Jumat Legi
    const d1945 = getDayInfo(1945, 8, 17);
    assert.equal(HARI[d1945.weekdayId], 'Jumat');
    assert.equal(PASARAN[d1945.pasaranId], 'Legi');
    assert.equal(getNeptu('Jumat', 'Legi'), 11);

    // 1 Januari 2000 = Sabtu Legi (Milenium)
    const d2000 = getDayInfo(2000, 1, 1);
    assert.equal(HARI[d2000.weekdayId], 'Sabtu');
    assert.equal(PASARAN[d2000.pasaranId], 'Legi');
    assert.equal(getNeptu('Sabtu', 'Legi'), 14);

    // Kabisat
    assert.equal(getDaysInMonth(2024, 2), 29);
    assert.equal(getDaysInMonth(2023, 2), 28);
  });

  // 2. Wuku Pawukon Parity
  it('2. Wuku Pawukon Parity: 30 Wuku Ensiklopedia & Petenget', () => {
    const ensiklo = readJson('02-wuku-ensiklopedia.json');
    const petenget = readJson('24-wuku-petenget-bilingual.json');

    const wukuList = Array.isArray(ensiklo) ? ensiklo : ensiklo.wuku;
    assert.equal(wukuList.length, 30, 'Harus ada 30 wuku');
    const firstWukuName = typeof wukuList[0].nama === 'object' ? (wukuList[0].nama.id || wukuList[0].nama.jv) : (wukuList[0].nama_wuku || wukuList[0].nama);
    assert.equal(firstWukuName, 'Sinta');
    const lastWukuName = typeof wukuList[29].nama === 'object' ? (wukuList[29].nama.id || wukuList[29].nama.jv) : (wukuList[29].nama_wuku || wukuList[29].nama);
    assert.equal(lastWukuName, 'Watugunung');

    const sintaPetenget = getWukuPetenget('Sinta');
    assert.ok(sintaPetenget);
    assert.equal(sintaPetenget.wuku, 'Sinta');
    assert.ok(sintaPetenget.alaBecik);
  });

  // 3. Nujum Matrix Parity
  it('3. Nujum Matrix Parity: 210 Cell Matrix & Bincil Dimension', () => {
    const matrix = readJson('06-bincil-matrix-bilingual.json');
    assert.ok(typeof matrix === 'object');
    assert.ok(Object.keys(matrix).length >= 30, 'Matriks harus mencakup wuku');

    const nujum = getNujumData('Sinta', 'Minggu', 'Pahing');
    assert.ok(nujum);
    assert.equal(nujum.padewan.nama, 'Sri');
    assert.equal(nujum.paringkelan.nama, 'Tungle');
    assert.equal(nujum.pandangon.nama, 'Dangu');
  });

  // 4. Jodoh 7 Metode Parity
  it('4. Jodoh 7 Metode Parity: Skenario Golden Baseline Pasangan', () => {
    const pitungData = readJson('11-pitung-perjodohan-bilingual.json');
    assert.ok(pitungData.metode_I_panca_suda || pitungData.HASIL_I_JODOH);

    const pengantinW = {
      nama: 'Sekar',
      hari: 'Kamis',
      pasaran: 'Legi',
      neptu: 13,
      aksaraDepan: 'DA',
      aksaraBelakang: 'JA'
    };
    const pengantinP = {
      nama: 'Panji',
      hari: 'Jumat',
      pasaran: 'Kliwon',
      neptu: 14,
      aksaraDepan: 'PA',
      aksaraBelakang: 'NGA'
    };

    const hasil = hitungPitung7Metode(pengantinW, pengantinP);
    assert.equal(hasil.totalNeptu, 27);
    assert.equal(hasil.rows.length, 7);
    assert.equal(hasil.rows[0].h.nama, 'SRI');
    assert.equal(hasil.rows[1].h.nama, 'LUNGGUH');
  });

  // 5. Selametan: Siang vs Bakda Maghrib Parity
  it('5. Selametan Parity: 7 Tahapan Pengetan (Siang vs Bakda Maghrib)', () => {
    const rules = readJson('14-selametan-rules.json');
    assert.ok(rules);

    // Tanggal uji: 1 Maret 2024 (Jumat Pahing)
    // Skenario Siang:
    const siang = hitungSelametanDates(2024, 3, 1, 'siang', 'Almarhum Budi');
    assert.equal(siang.geblak.hari, 'Jumat');
    assert.equal(siang.geblak.pasaran, 'Pahing');
    assert.equal(siang.geblak.tanggal, 1);
    assert.equal(siang.items.length, 7);

    // Skenario Bakda Maghrib (Malam): Berganti ke Sabtu Pon
    const malam = hitungSelametanDates(2024, 3, 1, 'malam_maghrib', 'Almarhum Budi');
    assert.equal(malam.geblak.hari, 'Sabtu');
    assert.equal(malam.geblak.pasaran, 'Pon');
    assert.equal(malam.geblak.tanggal, 2);
    assert.equal(malam.items.length, 7);

    // Verifikasi nama-nama tahapan pengetan
    const expectedStages = ['3 Harian', '7 Harian', '40 Harian', '100 Harian', 'Pendak Pisan', 'Pendak Pindho', 'Nyewu'];
    siang.items.forEach((item, idx) => {
      assert.ok(item.nama.includes(expectedStages[idx]), `Tahap ${idx} harus ${expectedStages[idx]}`);
    });
  });

  // 6. Ijab Parity
  it('6. Petung Ijab Parity: Evaluasi Weton, Wuku, Sasi, dan Neptu Khusus', () => {
    const ijabData = readJson('15-ijab-bilingual.json');
    assert.ok(ijabData.neptu_ijab_dina || ijabData.wuku_ijab);

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
    assert.ok(res.catatanSistemNeptu.includes('Neptu Khusus Ijab'));
  });

  // 7. Omah & Cempuri Lawangan Parity
  it('7. Petung Omah Parity: Modulo 4 & 5 serta Larangan Boyongan', () => {
    const omahData = readJson('23-omah-bilingual.json');
    assert.ok(omahData);

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
    assert.equal(res.laranganBoyongan.isProhibited, true);
  });

  // 8. Petung Ternak & Kehidupan Parity
  it('8. Petung Ternak & Kehidupan Parity: Wiwit Ternak, Loro, dan Geblak', () => {
    const ternakData = readJson('22-petung-ternak-bilingual.json');
    assert.ok(ternakData);

    const weton = getPetungKehidupanByWeton('Minggu', 'Pon');
    assert.equal(weton.ternak.kode, 'Buto');
    assert.equal(weton.loro.kode, 'Lepas');
    assert.equal(weton.geblak.kode, 'Asad');

    const byDate = getPetungKehidupanByDate(2026, 10, 5);
    assert.equal(byDate.dina, 'Senin');
    assert.equal(byDate.pasaran, 'Kliwon');
  });

  // 9. Petung Tetanen Parity
  it('9. Petung Tetanen Parity: 4 Kategori Tanaman Agraris', () => {
    const tetanenData = readJson('21-petung-tetanen-bilingual.json');
    assert.ok(tetanenData);

    const t = getPetungTetanen('Minggu', 'Pon');
    assert.equal(t.kangBecik, 'uwoh');
    assert.equal(t.kategoriLabel, 'Uwoh (Pala Gumantung / Buah-buahan)');
  });

  // 10. Sasmitha Parity
  it('10. Sasmitha Parity: Kategori Impen, Kedut, Graha, Lindu', () => {
    const sasmitha = readJson('20-sasmitha.json');
    assert.ok(sasmitha);
    const keys = Object.keys(sasmitha);
    assert.ok(keys.includes('kedut') || keys.includes('impen') || keys.length >= 3);
  });

  // 11. Aksara Jawa Parity
  it('11. Aksara Jawa Parity: Nglegena & Pasangan Mapping', () => {
    const aksara = readJson('30-aksara-nglegena-bilingual.json');
    assert.ok(aksara);
    const list = Array.isArray(aksara) ? aksara : (aksara.aksara || aksara.nglegena || Object.values(aksara));
    assert.ok(list.length >= 20, 'Harus mencakup minimal 20 aksara Nglegena Carakan');

    const decomposed = namaKeAksaraList('Kartika');
    assert.ok(Array.isArray(decomposed) && decomposed.length > 0);
  });

  // 12. Pustaka Jawa & Dongo Parity
  it('12. Pustaka Parity: Serat Kuno & Doa Tradisi', () => {
    const pustaka = readJson('36-pustaka-jawa.json');
    const dongo = readJson('35-pustaka-dongo.json');
    const digital = readJson('41-pustaka-digital.json');

    assert.ok(pustaka && typeof pustaka === 'object');
    assert.ok(dongo && typeof dongo === 'object');
    assert.ok(digital && typeof digital === 'object');
  });

  // 13. Wayang Purwa Parity
  it('13. Wayang Parity: Tokoh & Karakter Purwa', () => {
    const wayang = readJson('38-wayang-all.json');
    assert.ok(wayang);
    const list = Array.isArray(wayang) ? wayang : wayang.wayang_list;
    assert.ok(Array.isArray(list) && list.length >= 20, 'Dataset wayang harus memuat tokoh wayang purwa');
  });

  // 14. Pitutur Luhur Parity
  it('14. Pitutur Luhur Parity: Falsafah Budaya & Kuis', () => {
    const pitutur = readJson('39-pitutur-all.json');
    assert.ok(pitutur);
    const list = Array.isArray(pitutur) ? pitutur : pitutur.pitutur_list;
    assert.ok(Array.isArray(list) && list.length >= 20, 'Dataset pitutur harus memuat falsafah luhur');
  });

  // 15. Mitologi Nusantara Parity
  it('15. Mitologi Nusantara Parity: Cerita Kuno & Asal-usul Tradisi', () => {
    const mitologi = readJson('40-mitologi-all.json');
    assert.ok(mitologi);
    assert.ok(typeof mitologi === 'object' && Object.keys(mitologi).length > 0);
  });

  // 16. Tumpeng Parity
  it('16. Tumpeng Parity: Filosofi Ubarampe & Makna Warna', () => {
    const tumpeng = readJson('42-tumpeng-all.json');
    assert.ok(tumpeng);
    assert.ok(tumpeng.ubarampe || tumpeng.tumpeng_warna || Array.isArray(tumpeng));
  });

  // 17. Bilingual Parity (ID & JV)
  it('17. Bilingual Parity: Kesejajaran Kamus ID dan JV & Kelengkapan Kunci UI', () => {
    const idKeys = Object.keys(id);
    const jvKeys = Object.keys(jv);

    assert.ok(idKeys.length > 100, 'Kamus ID harus memuat ratusan entri');
    assert.ok(jvKeys.length > 100, 'Kamus JV harus memuat ratusan entri');

    // Setiap kunci ID yang wajib ada di UI harus ada padanannya di JV
    const criticalKeys = [
      'nav_beranda',
      'nav_kalender',
      'nav_nujum',
      'nav_jodoh',
      'nav_selametan',
      'nav_ijab',
      'nav_omah',
      'nav_ternak',
      'nav_sasmitha',
      'nav_wuku',
      'nav_mitologi',
      'nav_wayang',
      'nav_pitutur',
      'nav_pustaka',
      'nav_aksara',
      'mode_ringkas',
      'mode_lengkap'
    ];

    for (const key of criticalKeys) {
      assert.ok(id[key], `Kunci "${key}" harus terdefinisi di id.js`);
      assert.ok(jv[key], `Kunci "${key}" harus terdefinisi di jv.js`);
    }

    // Kunci-kunci yang memang memiliki terjemahan kata berbeda antara ID dan JV
    const differentiatedKeys = [
      'nav_beranda',
      'nav_kalender',
      'nav_jodoh',
      'nav_selametan',
      'nav_ternak',
      'mode_ringkas',
      'mode_lengkap'
    ];

    for (const key of differentiatedKeys) {
      assert.notEqual(id[key], jv[key], `Kunci "${key}" harus memiliki terjemahan unik antara ID dan JV`);
    }
  });
});
