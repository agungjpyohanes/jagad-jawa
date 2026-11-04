import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEPTU_BAKU_DINA,
  NEPTU_BAKU_PASARAN,
  PASATUAN_MODULO_6,
  KAMUS_SASI_MANTEN,
  BULAN_JELEK_TAHUN_JAWA,
  evaluasiBulanJelekTahunJawa,
  getPakartiTanggalJawa,
  getPakartiSasiJawaKanggoManten,
  getPakartiWukuKanggoIjab,
  hitungHariBaikPernikahan,
  generateKalenderHariBaikRange,
  generateKalenderHariBaikRangeAsync,
  generateDatesList,
  parseDateComponents,
  saringBarisKalender,
  exportKalenderMantenToCsv
} from '../js/modules/kalender-manten/kalender-manten-engine.js';

test('1. Nilai Neptu Baku Dina & Pasaran Ijab', () => {
  // Senin=4, Selasa=1, Rabu=6, Kamis=7, Jumat=3, Sabtu=2, Minggu=5
  assert.equal(NEPTU_BAKU_DINA['Senin'], 4);
  assert.equal(NEPTU_BAKU_DINA['Selasa'], 1);
  assert.equal(NEPTU_BAKU_DINA['Rabu'], 6);
  assert.equal(NEPTU_BAKU_DINA['Kamis'], 7);
  assert.equal(NEPTU_BAKU_DINA['Jumat'], 3);
  assert.equal(NEPTU_BAKU_DINA['Sabtu'], 2);
  assert.equal(NEPTU_BAKU_DINA['Minggu'], 5);

  // Pon=4, Wage=5, Kliwon=6, Legi=2, Pahing=3
  assert.equal(NEPTU_BAKU_PASARAN['Pon'], 4);
  assert.equal(NEPTU_BAKU_PASARAN['Wage'], 5);
  assert.equal(NEPTU_BAKU_PASARAN['Kliwon'], 6);
  assert.equal(NEPTU_BAKU_PASARAN['Legi'], 2);
  assert.equal(NEPTU_BAKU_PASARAN['Pahing'], 3);
});

test('2. Rumus Sisa Modulo 6 Pesatuan Manten + Status Tegese', () => {
  // Sisa 1: Kala Tinantang — Padudon (Ala)
  assert.equal(PASATUAN_MODULO_6[1].nama, 'Kala Tinantang');
  assert.equal(PASATUAN_MODULO_6[1].tegese, 'Padudon');
  assert.equal(PASATUAN_MODULO_6[1].status, 'Ala');

  // Sisa 2: Demang Kanduruan — Susah lan Lara-laranen (Ala)
  assert.equal(PASATUAN_MODULO_6[2].nama, 'Demang Kanduruan');
  assert.equal(PASATUAN_MODULO_6[2].tegese, 'Susah lan Lara-laranen');
  assert.equal(PASATUAN_MODULO_6[2].status, 'Ala');

  // Sisa 3: Sanggar Waringin — Bisa Dadi Pangaubaning Keluwarga (Becik)
  assert.equal(PASATUAN_MODULO_6[3].nama, 'Sanggar Waringin');
  assert.equal(PASATUAN_MODULO_6[3].tegese, 'Bisa Dadi Pangaubaning Keluwarga');
  assert.equal(PASATUAN_MODULO_6[3].status, 'Becik');

  // Sisa 4: Satriya Sinarajo — Becik lan Rahayu (Becik)
  assert.equal(PASATUAN_MODULO_6[4].nama, 'Satriya Sinarajo');
  assert.equal(PASATUAN_MODULO_6[4].tegese, 'Becik lan Rahayu');
  assert.equal(PASATUAN_MODULO_6[4].status, 'Becik');

  // Sisa 5: Macan Ketawan — Kisinan (Ala)
  assert.equal(PASATUAN_MODULO_6[5].nama, 'Macan Ketawan');
  assert.equal(PASATUAN_MODULO_6[5].tegese, 'Kisinan');
  assert.equal(PASATUAN_MODULO_6[5].status, 'Ala');

  // Sisa 0: Nuju Pati — Ala Banget (Ala)
  assert.equal(PASATUAN_MODULO_6[0].nama, 'Nuju Pati');
  assert.equal(PASATUAN_MODULO_6[0].tegese, 'Ala Banget');
  assert.equal(PASATUAN_MODULO_6[0].status, 'Ala');
});

test('3. Database Sasi Jelek Miturut Tahun Jawa (Windu)', () => {
  // Alip: Jumadilakir & Sela bakal Kalebo Wisa
  const alipJelek1 = evaluasiBulanJelekTahunJawa('Alip', 'Jumadilakir');
  assert.equal(alipJelek1.isBulanJelek, true);
  assert.match(alipJelek1.keterangan, /Kalebo Wisa/);

  const alipJelek2 = evaluasiBulanJelekTahunJawa('Alip', 'Sela');
  assert.equal(alipJelek2.isBulanJelek, true);

  const alipBebas = evaluasiBulanJelekTahunJawa('Alip', 'Ruwah');
  assert.equal(alipBebas.isBulanJelek, false);

  // Ehe: Bakda Mulud & Pasa (Lara Balung)
  assert.equal(evaluasiBulanJelekTahunJawa('Ehe', 'Bakda Mulud').isBulanJelek, true);
  assert.equal(evaluasiBulanJelekTahunJawa('Ehe', 'Pasa').isBulanJelek, true);

  // Jimawal: Mulud & Besar (Lara Edan)
  assert.equal(evaluasiBulanJelekTahunJawa('Jimawal', 'Mulud').isBulanJelek, true);
  assert.equal(evaluasiBulanJelekTahunJawa('Jimawal', 'Besar').isBulanJelek, true);

  // Je: Sura & Sawal (Keli ing Banyu)
  assert.equal(evaluasiBulanJelekTahunJawa('Je', 'Sura').isBulanJelek, true);
  assert.equal(evaluasiBulanJelekTahunJawa('Je', 'Sawal').isBulanJelek, true);

  // Dal: Ruwah (Lara Basah)
  assert.equal(evaluasiBulanJelekTahunJawa('Dal', 'Ruwah').isBulanJelek, true);

  // Be: Sapar & Rejeb (Lara Rumat)
  assert.equal(evaluasiBulanJelekTahunJawa('Be', 'Sapar').isBulanJelek, true);
  assert.equal(evaluasiBulanJelekTahunJawa('Be', 'Rejeb').isBulanJelek, true);

  // Wawu: Jumadilawal (Prakara Gedhe)
  assert.equal(evaluasiBulanJelekTahunJawa('Wawu', 'Jumadilawal').isBulanJelek, true);

  // Jumakir: Mulud & Besar (Kesinungan Lara)
  assert.equal(evaluasiBulanJelekTahunJawa('Jumakir', 'Mulud').isBulanJelek, true);
  assert.equal(evaluasiBulanJelekTahunJawa('Jumakir', 'Besar').isBulanJelek, true);
});

test('4. Pakarti Tanggal Jawa (1 s.d. 30)', () => {
  const tgl1 = getPakartiTanggalJawa(1);
  assert.equal(tgl1.pakarti, 'Nihil');
  assert.equal(tgl1.status, 'Becik');

  const tgl2 = getPakartiTanggalJawa(2);
  assert.equal(tgl2.pakarti, 'Berhasil');
  assert.equal(tgl2.status, 'Becik');

  const tgl3 = getPakartiTanggalJawa(3);
  assert.equal(tgl3.pakarti, 'Tanpa Hasil');
  assert.equal(tgl3.status, 'Ala');

  const tgl23 = getPakartiTanggalJawa(23);
  assert.equal(tgl23.pakarti, 'Sial');
  assert.equal(tgl23.status, 'Ala');

  const tgl30 = getPakartiTanggalJawa(30);
  assert.equal(tgl30.pakarti, 'Baik Dapat Pijaman');
  assert.equal(tgl30.status, 'Becik');
});

test('5. Pembaruan Kamus 12 Sasi Jawa + Status Tegese', () => {
  // 1. Suro: Rusak ing Tembemburine (Ala)
  const suro = getPakartiSasiJawaKanggoManten('Suro');
  assert.equal(suro.pakarti, 'Rusak ing Tembemburine');
  assert.equal(suro.status, 'Ala');

  // 2. Sapar: Kekurangan lan Sugih Utang (Ala)
  const sapar = getPakartiSasiJawaKanggoManten('Sapar');
  assert.equal(sapar.pakarti, 'Kekurangan lan Sugih Utang');
  assert.equal(sapar.status, 'Ala');

  // 3. Mulud: Mati Salah Siji (Ala)
  const mulud = getPakartiSasiJawaKanggoManten('Mulud');
  assert.equal(mulud.pakarti, 'Mati Salah Siji');
  assert.equal(mulud.status, 'Ala');

  // 4. Bakdomulud: Nemu Ujar Kang Alal ing Tembemburine (Ala)
  const bakdo = getPakartiSasiJawaKanggoManten('Bakdomulud');
  assert.equal(bakdo.pakarti, 'Nemu Ujar Kang Alal ing Tembemburine');
  assert.equal(bakdo.status, 'Ala');

  // 5. Jumadilawal: Kerep Kemalingan lan Kapusan (Ala)
  const jawal = getPakartiSasiJawaKanggoManten('Jumadilawal');
  assert.equal(jawal.pakarti, 'Kerep Kemalingan lan Kapusan');
  assert.equal(jawal.status, 'Ala');

  // 6. Jumadilakir: Sugih Emas Salaka (Becik)
  const jakir = getPakartiSasiJawaKanggoManten('Jumadilakir');
  assert.equal(jakir.pakarti, 'Sugih Emas Salaka');
  assert.equal(jakir.status, 'Becik');

  // 7. Rejeb: Sugih Anak (Netral)
  const rejeb = getPakartiSasiJawaKanggoManten('Rejeb');
  assert.equal(rejeb.pakarti, 'Sugih Anak');
  assert.equal(rejeb.status, 'Netral');

  // 8. Ruwah: Rahayu Sakabehe (Becik)
  const ruwah = getPakartiSasiJawaKanggoManten('Ruwah');
  assert.equal(ruwah.pakarti, 'Rahayu Sakabehe');
  assert.equal(ruwah.status, 'Becik');

  // 9. Pasa: Rahayu Sakabehe (Becik)
  const pasa = getPakartiSasiJawaKanggoManten('Pasa');
  assert.equal(pasa.pakarti, 'Rahayu Sakabehe');
  assert.equal(pasa.status, 'Becik');

  // 10. Sawal: Kekurangan lan Sugih Utang (Ala)
  const sawal = getPakartiSasiJawaKanggoManten('Sawal');
  assert.equal(sawal.pakarti, 'Kekurangan lan Sugih Utang');
  assert.equal(sawal.status, 'Ala');

  // 11. Dulkaidah: Geringen lan Kerep Padudon karo Sanak Kadange (Ala)
  const dulkaidah = getPakartiSasiJawaKanggoManten('Dulkaidah');
  assert.equal(dulkaidah.pakarti, 'Geringen lan Kerep Padudon karo Sanak Kadange');
  assert.equal(dulkaidah.status, 'Ala');

  // 12. Besar: Bisa Sugih lan Nemu Karaharjan (Becik)
  const besar = getPakartiSasiJawaKanggoManten('Besar');
  assert.equal(besar.pakarti, 'Bisa Sugih lan Nemu Karaharjan');
  assert.equal(besar.status, 'Becik');
});

test('6. Pakarti Wuku Kanggo Ijab (30 Wuku)', () => {
  assert.equal(getPakartiWukuKanggoIjab('Sinta').status, 'Becik');
  assert.equal(getPakartiWukuKanggoIjab('Landep').status, 'Ala');
  assert.equal(getPakartiWukuKanggoIjab('Julungpujut').status, 'Normal');
  assert.equal(getPakartiWukuKanggoIjab('Watugunung').status, 'Becik');
});

test('7. Struktur Lengkap 17 Kolom & Integrasi Penilaian Hari Baik', () => {
  const res = hitungHariBaikPernikahan(2026, 8, 17);

  // 17 Kolom Wajib
  assert.ok('tahunMasehi' in res);
  assert.ok('tanggalMasehi' in res);
  assert.ok('bulanMasehi' in res);
  assert.ok('tahunJawa' in res);
  assert.ok('tanggalJawa' in res);
  assert.ok('pakartiTanggalJawa' in res);
  assert.ok('keteranganPakartiTanggalJawa' in res);
  assert.ok('sasiJawa' in res);
  assert.ok('pakartiSasiJawaKanggoManten' in res);
  assert.ok('hari' in res);
  assert.ok('pasaran' in res);
  assert.ok('neptuDinaPasaran' in res);
  assert.ok('pasatuanManten' in res);
  assert.ok('tegesePasatuanManten' in res);
  assert.ok('wuku' in res);
  assert.ok('pakartiWuku' in res);
  assert.ok('keteranganDina' in res);

  // Penanda Kalender Khusus
  assert.ok('isDinaGede' in res);
  assert.ok('isDinaIjo' in res);
  assert.ok('isDinaAbang' in res);
  assert.ok('isBulanJelek' in res);
  assert.ok('statusAkhir' in res);
  assert.ok('statusSasiManten' in res);

  assert.equal(res.tahunMasehi, 2026);
  assert.equal(res.tanggalMasehi, 17);
  assert.equal(res.bulanMasehi, 'Agustus');
  assert.equal(typeof res.neptuDinaPasaran, 'number');
  assert.equal(res.neptuDinaPasaran, res.neptuDina + res.neptuPasaran);
  assert.equal(res.tegesePasatuanManten, PASATUAN_MODULO_6[res.neptuDinaPasaran % 6].tegese);

  // Verifikasi bahwa statusSasiManten terikat dengan kamus sasi
  assert.ok(['Becik', 'Netral', 'Ala'].includes(res.statusSasiManten));
  // Status akhir harus salah satu dari 3 kategori resmi
  assert.ok(['Becik Sanget', 'Cukup Sae', 'Ala / Pantangan'].includes(res.statusAkhir));
});

test('8. Penjanaan Rentang Tanggal, Filter, dan Ekspor CSV', () => {
  const rows = generateKalenderHariBaikRange('2026-06-01', '2026-06-30');
  assert.equal(rows.length, 30);

  // Saring hanya hari baik
  const becikRows = saringBarisKalender(rows, { status: 'becik' });
  becikRows.forEach(r => assert.equal(r.statusAkhir, 'Becik Sanget'));

  // Saring hanya weekend
  const weekendRows = saringBarisKalender(rows, { hanyaWeekend: true });
  weekendRows.forEach(r => assert.ok(r.hari === 'Sabtu' || r.hari === 'Minggu'));

  // Ekspor CSV
  const csv = exportKalenderMantenToCsv(rows.slice(0, 5));
  assert.ok(csv.includes('Tahun Masehi'));
  assert.ok(csv.includes('Keterangan Dina'));
});

test('9. Chunked Asynchronous Loading & Memoization Cache', async () => {
  const progressReports = [];
  const chunkReports = [];

  const asyncRows = await generateKalenderHariBaikRangeAsync('2026-11-01', '2026-12-31', {
    chunkSize: 20,
    onProgress: (p) => progressReports.push(p),
    onChunk: (chunk, acc) => chunkReports.push({ chunkSize: chunk.length, accSize: acc.length })
  });

  assert.equal(asyncRows.length, 61);
  assert.ok(progressReports.length > 1, 'Progress reports harus dipanggil bertahap');
  assert.ok(chunkReports.length > 1, 'Chunk reports harus dipanggil bertahap');
  assert.equal(progressReports[progressReports.length - 1].percent, 100);

  // Verifikasi memoization cache (panggilan kedua langsung O(1))
  const cachedDay = hitungHariBaikPernikahan(2026, 11, 4);
  assert.equal(cachedDay.hari, 'Rabu');
  assert.equal(cachedDay.pasaran, 'Kliwon');
});

test('10. Modul UI & Modal Rincian 17 Kolom (Clean & Minimalist 6-Column View)', async () => {
  const uiModule = await import('../js/modules/kalender-manten/kalender-manten-ui.js');
  assert.equal(typeof uiModule.initKalenderMantenUI, 'function');
  assert.equal(typeof uiModule.bukaModalRincian17Kolom, 'function');
  assert.equal(typeof uiModule.tutupModalRincian17Kolom, 'function');
  assert.equal(typeof uiModule.cetakKalenderHariBaik, 'function');
  assert.equal(typeof uiModule.unduhKalenderHariBaikCsv, 'function');
  assert.equal(typeof uiModule.terapkanKalenderKustom, 'function');
  assert.equal(typeof uiModule.tampilkanPesanPilihRentangTanggal, 'function');
  assert.equal(typeof uiModule.dapatkanRentangDefault, 'function');

  const defaultRange = uiModule.dapatkanRentangDefault();
  assert.ok(defaultRange.startStr && defaultRange.endStr);
  assert.ok(new Date(defaultRange.startStr) <= new Date(defaultRange.endStr));
});

test('11. Validasi Input Tanggal Kosong & Perlindungan Infinite Loop', async () => {
  // Input kosong / null / undefined tidak boleh melempar error tak tertangani
  const emptyList1 = generateDatesList('', '');
  assert.deepEqual(emptyList1, []);

  const emptyList2 = generateDatesList(null, null);
  assert.deepEqual(emptyList2, []);

  // Tanggal mulai lebih besar daripada tanggal selesai
  const invalidRange = generateDatesList('2026-12-31', '2026-01-01');
  assert.deepEqual(invalidRange, []);

  // parseDateComponents aman dari input rusak
  const safeComp = parseDateComponents('');
  assert.equal(safeComp.length, 3);
  assert.ok(!isNaN(safeComp[0]) && !isNaN(safeComp[1]) && !isNaN(safeComp[2]));

  // Asynchronous generator aman jika rentang kosong
  const asyncEmpty = await generateKalenderHariBaikRangeAsync('', '');
  assert.deepEqual(asyncEmpty, []);
});

test('12. Validasi Evaluasi Harian Sasi Besar Menghasilkan Status Becik', () => {
  // Bulan Besar pada kalender Jawa tahun 1959 Jimawal (sekitar Mei - Juni 2026)
  // Mari kita cari hari di bulan Mei / Juni 2026 yang jatuh pada sasi Besar
  const range = generateKalenderHariBaikRange('2026-05-15', '2026-06-25');
  const barisBesar = range.filter(r => r.sasiJawa === 'Besar');
  assert.ok(barisBesar.length > 0, 'Harus ditemukan hari-hari yang jatuh pada Sasi Besar');

  barisBesar.forEach(b => {
    assert.equal(b.statusSasiManten, 'Becik', `Status sasi manten untuk Besar harus Becik, ditemukan: ${b.statusSasiManten}`);
    assert.equal(b.pakartiSasiJawaKanggoManten, 'Bisa Sugih lan Nemu Karaharjan');
    assert.ok(b.keteranganDina.includes('Sasi Besar: Bisa Sugih lan Nemu Karaharjan (Becik)'));
  });
});

