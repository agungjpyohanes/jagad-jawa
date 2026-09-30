import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderLaporanKalenderPrintHtml,
  printLaporanKalender,
  downloadKalenderPng
} from '../js/modules/kalender/kalender-ui.js';

test('Ekspor Kalender Jawa - Kelengkapan Render Laporan HTML (PDF & PNG)', async (t) => {
  await t.test('1. Menghasilkan struktur Kop Resmi Sultan Agungan lengkap dengan Windu & Pranata Mangsa', () => {
    const html = renderLaporanKalenderPrintHtml(1, 2026, 'parchment');
    assert.ok(html.includes('KALENDER JAWA SULTAN AGUNGAN'), 'Harus memuat judul KALENDER JAWA SULTAN AGUNGAN');
    assert.ok(html.includes('JANUARI 2026 M'), 'Harus memuat bulan Masehi dan tahun 2026 M');
    assert.ok(html.includes('AJ'), 'Harus memuat tahun Anno Javanico (AJ)');
    assert.ok(html.includes('H'), 'Harus memuat tahun Hijriah (H)');
    assert.ok(html.includes('Windu'), 'Harus memuat informasi Siklus Windu');
    assert.ok(html.includes('Pranata Mangsa:'), 'Harus memuat informasi Pranata Mangsa');
  });

  await t.test('2. Menampilkan Peringatan Kritis Kala Wuku Ngisor (Wuku 4, 14, 24)', () => {
    const html = renderLaporanKalenderPrintHtml(1, 2026, 'parchment');
    assert.ok(html.includes('Nomor 4, 14, 24 — kala ono ngisor, ojo marani dununge wuku!'), 'Harus memuat teks peringatan wuku ngisor');
    assert.ok(html.includes('Kurantil'), 'Harus menyebutkan Wuku Kurantil (ke-4)');
    assert.ok(html.includes('Mandasiya'), 'Harus menyebutkan Wuku Mandasiya (ke-14)');
    assert.ok(html.includes('Prangbakat'), 'Harus menyebutkan Wuku Prangbakat (ke-24)');
  });

  await t.test('3. Menampilkan Standarisasi Kode Warna Blok (4 Legenda Warna Lengkap Tanpa Kode Hex Mentah)', () => {
    const html = renderLaporanKalenderPrintHtml(1, 2026, 'parchment');
    assert.ok(html.includes('Blok Hijau Solid'), 'Harus memuat Blok Hijau Solid');
    assert.ok(!html.includes('Blok Hijau Solid (#16a34a)'), 'Tidak boleh memuat kode hex mentah (#16a34a)');
    assert.ok(html.includes('Dino Ijo / Rahayu'), 'Harus memuat keterangan Dino Ijo / Rahayu');
    assert.ok(html.includes('Blok Merah Solid'), 'Harus memuat Blok Merah Solid');
    assert.ok(!html.includes('Blok Merah Solid (#dc2626)'), 'Tidak boleh memuat kode hex mentah (#dc2626)');
    assert.ok(html.includes('Dino Abang / Ala'), 'Harus memuat keterangan Dino Abang / Ala');
    assert.ok(html.includes('Border Emas &amp; Bintang ★') || html.includes('Border Emas & Bintang ★'), 'Harus memuat Border Emas & Bintang ★');
    assert.ok(html.includes('Dino Gede'), 'Harus memuat keterangan Dino Gede');
    assert.ok(html.includes('Tinta Merah Angka Masehi'), 'Harus memuat keterangan Tinta Merah Angka Masehi');
  });

  await t.test('4. Menampilkan Seluruh 12 Kode Hari Tradisional Primbon (S, N, K, D, O, Q, T, A, W, R, P, X)', () => {
    const html = renderLaporanKalenderPrintHtml(1, 2026, 'parchment');
    const kodeList = ['S', 'N', 'K', 'D', 'O', 'Q', 'T', 'A', 'W', 'R', 'P', 'X'];
    for (const kode of kodeList) {
      assert.ok(html.includes(`[${kode}]`), `Harus memuat kode [${kode}]`);
    }

    assert.ok(html.includes('Tangise Dewi Sinto'), 'Harus memuat arti kode S: Tangise Dewi Sinto');
    assert.ok(html.includes('Nuju Padu'), 'Harus memuat arti kode N: Nuju Padu');
    assert.ok(html.includes('Kala Dite'), 'Harus memuat arti kode K: Kala Dite');
    assert.ok(html.includes('Dungulan'), 'Harus memuat arti kode D: Dungulan');
    assert.ok(html.includes('Anggoro Kasih'), 'Harus memuat arti kode O: Anggoro Kasih');
    assert.ok(html.includes('Dino ora kanggonan tanggal'), 'Harus memuat arti kode Q: Dino ora kanggonan tanggal');
    assert.ok(html.includes('Kala Tinantang'), 'Harus memuat arti kode T: Kala Tinantang');
    assert.ok(html.includes('Sampar Wangke'), 'Harus memuat arti kode A: Sampar Wangke');
    assert.ok(html.includes('Tali Wangke'), 'Harus memuat arti kode W: Tali Wangke');
    assert.ok(html.includes('Ringkel Jalma'), 'Harus memuat arti kode R: Ringkel Jalma');
    assert.ok(html.includes('Nuju Pati'), 'Harus memuat arti kode P: Nuju Pati');
    assert.ok(html.includes('Sarik Agung'), 'Harus memuat arti kode X: Sarik Agung');
  });

  await t.test('5. Menampilkan Tabel Grid dengan Struktur Sel 2 Tingkat & Hari Libur', () => {
    const html = renderLaporanKalenderPrintHtml(1, 2026, 'parchment');
    assert.ok(html.includes('Tahun Baru 2026 Masehi'), 'Harus memuat Hari Libur 1 Januari 2026');
    assert.ok(html.includes('Isra Mi\'raj'), 'Harus memuat Isra Mi\'raj Januari 2026');
    assert.ok(html.includes('Paugeran Maca Struktur Sel 2 Tingkat'), 'Harus memuat petunjuk struktur sel');
    assert.ok(html.includes('#16a34a') && html.includes('#dc2626'), 'Harus memuat warna sel blok hijau dan merah');
    assert.ok(html.includes('Paugeran Kasultanan Mataram'), 'Harus memuat colophon resmi kasultanan');
  });

  await t.test('6. Mendukung 3 Tema Terpisah (Parchment, Monochrome, Standard) serta Class kalender-print-page 1-Halaman', () => {
    const htmlParchment = renderLaporanKalenderPrintHtml(8, 2026, 'parchment');
    const htmlMonochrome = renderLaporanKalenderPrintHtml(8, 2026, 'monochrome');
    const htmlStandard = renderLaporanKalenderPrintHtml(8, 2026, 'standard');
    assert.ok(htmlParchment.includes('theme-parchment'), 'Harus menerapkan class theme-parchment');
    assert.ok(htmlMonochrome.includes('theme-monochrome'), 'Harus menerapkan class theme-monochrome');
    assert.ok(htmlStandard.includes('theme-standard'), 'Harus menerapkan class theme-standard');
    assert.ok(htmlParchment.includes('kalender-print-page'), 'Harus memiliki class kalender-print-page untuk 1-page fit');
    assert.ok(htmlStandard.includes('table-layout: fixed'), 'Harus menerapkan table-layout: fixed untuk tabel kaku');
    assert.ok(htmlStandard.includes('<colgroup>'), 'Harus memuat colgroup untuk lebar kolom presisi');
  });

  await t.test('7. Fungsi Export printLaporanKalender, downloadKalenderPdf, dan downloadKalenderPng terdefinisi', async () => {
    const kalenderMod = await import('../js/modules/kalender/kalender-ui.js');
    assert.equal(typeof kalenderMod.printLaporanKalender, 'function');
    assert.equal(typeof kalenderMod.downloadKalenderPdf, 'function');
    assert.equal(typeof kalenderMod.downloadKalenderPng, 'function');
  });

  await t.test('8. Memastikan tata letak tabel lebar eksplisit 1200px portrait bebas distorsi', () => {
    const html = renderLaporanKalenderPrintHtml(8, 2026, 'parchment');
    assert.ok(html.includes('width: 1200px') || html.includes('width: 1120px'), 'Harus menetapkan width 1200px');
    assert.ok(html.includes('table-layout: fixed'), 'Harus menetapkan table-layout: fixed');
    assert.ok(html.includes('print-container'), 'Harus memiliki elemen print-container');
    assert.ok(html.includes('repeat(4, 1fr)'), 'Daftar 12 kode petungan harus ditata dalam 4 kolom seimbang');
  });

  await t.test('9. Fungsi resetKalenderToday terdefinisi dan dapat dipanggil dengan aman', async () => {
    const kalenderMod = await import('../js/modules/kalender/kalender-ui.js');
    assert.equal(typeof kalenderMod.resetKalenderToday, 'function');
    assert.doesNotThrow(() => {
      kalenderMod.resetKalenderToday();
    });
  });

  await t.test('10. Memastikan proporsi kolom Wuku (88px) dan hari (130px) serta padding sel (4px 6px) dan line-height (1.2)', () => {
    const html = renderLaporanKalenderPrintHtml(8, 2026, 'parchment');
    assert.ok(html.includes('width: 88px'), 'Harus menetapkan kolom Wuku sebesar 88px');
    assert.ok(html.includes('width: 130px'), 'Harus menetapkan kolom hari sebesar 130px');
    assert.ok(html.includes('padding: 4px 6px'), 'Harus menerapkan padding 4px 6px pada sel tanggal');
    assert.ok(html.includes('line-height: 1.2'), 'Harus menerapkan line-height 1.2 pada sel tanggal');
    assert.ok(html.includes('vertical-align: middle'), 'Header harus memiliki vertical-align: middle');
  });

  await t.test('11. Verifikasi Standarisasi Tombol Ekspor PDF & Pembersihan Tombol PNG di UI', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const indexPath = path.resolve('index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // 1. Kalender Jawa: Hapus btnDownloadKalenderPng, pertahankan btnPrintKalenderPdf
    assert.ok(!indexHtml.includes('btnDownloadKalenderPng'), 'Tombol btnDownloadKalenderPng harus dihapus dari index.html');
    assert.ok(indexHtml.includes('btnPrintKalenderPdf'), 'Tombol btnPrintKalenderPdf harus ada');
    assert.ok(indexHtml.includes('downloadKalenderPdf(\'parchment\')'), 'Tombol kalender harus memicu downloadKalenderPdf parchment');

    // 2. Selametan: Hanya 1 tombol Ekspor PDF (parchment), hapus monochrome dan png
    assert.ok(indexHtml.includes('btnPrintSelametanParchment'), 'Tombol btnPrintSelametanParchment harus ada');
    assert.ok(!indexHtml.includes('btnPrintSelametanMonochrome'), 'Tombol btnPrintSelametanMonochrome harus dihapus');
    assert.ok(!indexHtml.includes('btnDownloadSelametanPng'), 'Tombol btnDownloadSelametanPng harus dihapus');

    // 3. Jodoh: Hanya 1 tombol Ekspor PDF (parchment), hapus monochrome
    assert.ok(indexHtml.includes('btnPrintPerjodohanParchment'), 'Tombol btnPrintPerjodohanParchment harus ada');
    assert.ok(!indexHtml.includes('btnPrintPerjodohanMonochrome'), 'Tombol btnPrintPerjodohanMonochrome harus dihapus');
  });
});
