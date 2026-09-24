import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PETUNG_TETANEN_LIST,
  PETUNG_TETANEN_MAP,
  getPetungTetanen
} from '../js/data/petung-tetanen-db.js';

import {
  WUKU_PETENGET_LIST,
  WUKU_PETENGET_MAP,
  getWukuPetenget
} from '../js/data/wuku-petenget-db.js';

import {
  getAllWuku,
  getWukuDetailSummary,
  searchWuku,
  searchWukuWithCategory
} from '../js/modules/wuku/wuku-engine.js';

import { getSapaDinaData } from '../js/modules/sapa-dina/sapa-dina-engine.js';
import { buildSapaDinaShareText } from '../js/modules/sapa-dina/sapa-dina-ui.js';
import { toJDN, getDayInfo, getTanggalJawaLengkap, HARI, PASARAN, WUKU } from '../js/modules/kalender/kalender-engine.js';

test('Database Nujum Baru — Petung Tetanen & 4 Pilar Petenget Wuku', async (t) => {

  await t.test('1. Integritas Database Petung Tetanen (35 Dino-Pasaran)', () => {
    assert.equal(PETUNG_TETANEN_LIST.length, 35, 'Total kombinasi Dino-Pasaran harus tepat 35');
    
    // Uji sampel Minggu Pon (uwoh / buah)
    const mingguPon = getPetungTetanen('Minggu', 'Pon');
    assert.ok(mingguPon, 'Minggu Pon harus ditemukan');
    assert.equal(mingguPon.dino, 'Minggu');
    assert.equal(mingguPon.pasaran, 'Pon');
    assert.equal(mingguPon.kangBecik, 'uwoh');
    assert.equal(mingguPon.kategoriLabel, 'Uwoh (Pala Gumantung / Buah-buahan)');
    assert.ok(mingguPon.tegese.length > 5);
    assert.ok(mingguPon.contone.length > 5);
    assert.equal(mingguPon.icon, 'fa-solid fa-apple-whole');

    // Uji sampel Kamis Pahing (oyot / umbi)
    const kamisPahing = getPetungTetanen('Kamis', 'Pahing');
    assert.ok(kamisPahing);
    assert.equal(kamisPahing.kangBecik, 'oyot');
    assert.equal(kamisPahing.icon, 'fa-solid fa-carrot');

    // Uji alias Minggu / Ahad / Sunday dan case-insensitivity
    const ahadPon = getPetungTetanen('Ahad', 'pon');
    assert.ok(ahadPon);
    assert.equal(ahadPon.kangBecik, 'uwoh');

    const sundayPon = getPetungTetanen('Sunday', 'PON');
    assert.ok(sundayPon);
    assert.equal(sundayPon.kangBecik, 'uwoh');

    // Uji 4 kategori agraria ada dalam 35 kombinasi
    const categories = new Set(PETUNG_TETANEN_LIST.map(item => item.kangBecik));
    assert.ok(categories.has('uwoh'), 'Harus memuat kategori uwoh (buah)');
    assert.ok(categories.has('uwit'), 'Harus memuat kategori uwit (pohon/kayu)');
    assert.ok(categories.has('kembang/godhong'), 'Harus memuat kategori kembang/godhong (daun/sayuran)');
    assert.ok(categories.has('oyot'), 'Harus memuat kategori oyot (umbi/akar)');

    // Uji input tidak valid
    assert.equal(getPetungTetanen('InvalidDay', 'Kliwon'), null);
    assert.equal(getPetungTetanen('Senin', 'InvalidPasaran'), null);
  });

  await t.test('2. Integritas Database 4 Pilar Wuku Petenget (30 Wuku)', () => {
    assert.equal(WUKU_PETENGET_LIST.length, 30, 'Total wuku petenget harus tepat 30');

    // Uji Wuku 1 (Sinta)
    const sinta = getWukuPetenget(1);
    assert.ok(sinta, 'Wuku Sinta harus ditemukan');
    assert.equal(sinta.no, 1);
    assert.equal(sinta.wuku, 'Sinta');
    assert.ok(sinta.alaBecik.becik.length > 10, 'Ala-becik becik Sinta harus berisi data');
    assert.ok(sinta.alaBecik.ala.length > 5, 'Ala-becik ala Sinta harus berisi data');
    assert.ok(sinta.nambani.becik.length > 10, 'Nambani Sinta harus berisi data usada');
    assert.ok(sinta.tetanen.ala.length > 5, 'Tetanen ala Sinta harus berisi data sirikan');

    // Uji Wuku 30 (Watugunung)
    const watugunung = getWukuPetenget('Watugunung');
    assert.ok(watugunung, 'Wuku Watugunung harus ditemukan via nama');
    assert.equal(watugunung.no, 30);
    assert.ok(watugunung.alaBecik);
    assert.ok(watugunung.nambani);
    assert.ok(watugunung.pangupajiwa);

    // Uji pencarian case-insensitive & trim
    const landep = getWukuPetenget('   LANDEP  ');
    assert.ok(landep);
    assert.equal(landep.no, 2);

    // Uji input tidak valid
    assert.equal(getWukuPetenget(0), null);
    assert.equal(getWukuPetenget(31), null);
    assert.equal(getWukuPetenget('WukuGhaib'), null);
  });

  await t.test('3. Integrasi Wuku Engine & Search with Category', () => {
    // Ringkasan detail summary memuat 4 pilar petenget
    const summary = getWukuDetailSummary('Sinta');
    assert.ok(summary, 'Summary Sinta harus valid');
    assert.ok(summary.alaBecik, 'Summary harus memuat alaBecik');
    assert.ok(summary.nambani, 'Summary harus memuat nambani');
    assert.ok(summary.pangupajiwa, 'Summary harus memuat pangupajiwa');
    assert.ok(summary.tetanen, 'Summary harus memuat tetanen');
    assert.ok(summary.tetanen.becik, 'Summary harus memuat tetanen.becik');
    assert.ok(summary.tetanen.ala, 'Summary harus memuat tetanen.ala');

    // Search with category filter
    const allResults = searchWukuWithCategory('', 'all');
    assert.equal(allResults.length, 30, 'Filter kategori all tanpa query harus mengembalikan 30 wuku');

    // Filter khusus: nambani
    const nambaniResults = searchWukuWithCategory('ngusadani', 'nambani');
    assert.ok(nambaniResults.length >= 1, 'Pencarian kata ngusadani di nambani harus menemukan hasil');

    // Filter khusus: ala_becik
    const alaBecikResults = searchWukuWithCategory('pedang', 'ala_becik');
    assert.ok(alaBecikResults.length >= 1, 'Pencarian pedang di ala_becik harus menemukan hasil (Landep)');

    // Filter khusus: tetanen
    const tetanenResults = searchWukuWithCategory('pekarangan', 'tetanen');
    assert.ok(tetanenResults.length >= 1, 'Pencarian pekarangan di tetanen harus menemukan hasil');
  });

  await t.test('4. Integrasi Sapa Dina dengan Petung Tetanen & Share Text', () => {
    const testDate = new Date(2026, 8, 24); // 24 September 2026
    const sapaData = getSapaDinaData(testDate);

    assert.ok(sapaData, 'Sapa Dina data harus valid');
    assert.ok(sapaData.petungTetanen, 'Sapa Dina harus memiliki petungTetanen');
    assert.equal(sapaData.petungTetanen.dino, sapaData.hariDisplay);
    assert.equal(sapaData.petungTetanen.pasaran, sapaData.pasaranDisplay);
    assert.ok(sapaData.petungTetanen.kangBecik);
    assert.ok(sapaData.petungTetanen.kategoriLabel);
    assert.ok(sapaData.petungTetanen.tegese);

    // Share Text WhatsApp memuat Petung Tetanen
    const shareText = buildSapaDinaShareText(sapaData);
    assert.ok(shareText.includes('Petung Tetanen'), 'Share text harus menyertakan baris Petung Tetanen');
    assert.ok(shareText.includes(sapaData.petungTetanen.kategoriLabel), 'Share text harus memuat nama kategori');
  });

  await t.test('5. Non-Regresi: Formula Kalender & Pawukon Tetap Murni 100%', () => {
    // Patokan Abadi 29 Agustus 2021 = Minggu Pahing, Wuku Sinta (#1)
    const jdnAnchor = toJDN(2021, 8, 29);
    assert.equal(jdnAnchor, 2459456);

    const dayInfo = getDayInfo(2021, 8, 29);
    assert.equal(dayInfo.weekdayId, 0, 'Harus Minggu');
    assert.equal(dayInfo.pasaranId, 1, 'Harus Pahing');
    assert.equal(dayInfo.wukuId, 0, 'Harus Sinta (#1)');

    const tglJawa = getTanggalJawaLengkap(2021, 8, 29);
    assert.equal(tglJawa.dino, 'Minggu');
    assert.equal(tglJawa.pas, 'Pahing');
    assert.equal(tglJawa.neptu, 14);
    assert.equal(tglJawa.wukuName, 'Sinta');
  });

  await t.test('6. Verifikasi UI Modal Detail Tanggal & Pembersihan Grid Kalender', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    
    // 1. Verifikasi index.html memuat kontainer 5 database baru dalam modal
    const htmlContent = fs.readFileSync(path.resolve('index.html'), 'utf-8');
    assert.ok(htmlContent.includes('id="modalPetungTetanenCard"'), 'Harus memuat container modalPetungTetanenCard');
    assert.ok(htmlContent.includes('id="modalWukuPetengetCard"'), 'Harus memuat container modalWukuPetengetCard');
    assert.ok(htmlContent.includes('id="modalDetailKalender"'), 'Harus memuat modalDetailKalender');
    assert.ok(htmlContent.includes('animate-fade-in'), 'Modal harus memiliki transisi animasi fade-in yang elegan');

    // 2. Verifikasi kalender-ui.js TIDAK menampilkan tulisan kecil "N: " menumpuk di bawah pasaran
    const kalenderUiContent = fs.readFileSync(path.resolve('js/modules/kalender/kalender-ui.js'), 'utf-8');
    // Cek pada blok render grid tabel bulanan (htmlBuffer.push)
    const renderGridSection = kalenderUiContent.slice(kalenderUiContent.indexOf('function renderKalender('), kalenderUiContent.indexOf('function setKalenderViewMode('));
    assert.ok(!renderGridSection.includes('N: ${NEPTU_HARI'), 'Grid kalender bulanan tidak boleh lagi memuat tulisan kecil N: di bawah pasaran');
    
    // 3. Verifikasi kalender-ui.js mengaitkan getWukuPetenget ke modalWukuPetengetCard
    assert.ok(kalenderUiContent.includes('modalWukuPetengetCard'), 'kalender-ui.js harus merender modalWukuPetengetCard');
    assert.ok(kalenderUiContent.includes('getWukuPetenget('), 'kalender-ui.js harus memanggil getWukuPetenget()');
  });

});
