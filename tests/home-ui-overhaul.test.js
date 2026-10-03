/**
 * Jagad Jawa — Unit Test: Home UI Overhaul & Integrity (jawa-v12)
 * Memverifikasi:
 * 1. Penghapusan blok duplikasi kategori (Stories, Archive, Community) & widget musik di Beranda.
 * 2. Keberadaan kartu Hari Ini terpadu dengan akordeon halus (#heroTodayDetailPanel, #btnToggleHeroDetail).
 * 3. Keberadaan 4 chip aksi cepat (Cek Weton, Petung Jodoh, Hari Baik Ijab, Selametan) yang rapi di bawah kartu.
 * 4. Fungsi kalkulasi weton hari ini & kalkulasi realtime tidak menghasilkan nilai undefined.
 * 5. Tombol bagikan gambar kartu & bagikan teks tersedia dan terhubung.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getSapaDinaData } from '../js/modules/sapa-dina/sapa-dina-engine.js';
import { getTanggalJawaLengkap } from '../js/data/calendar.js';

test('Home UI Overhaul - Pembersihan Duplikasi & Menu Ganda', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Ambil isi khusus tab-beranda
  const berandaMatch = html.match(/<section id="tab-beranda"[\s\S]*?<\/section>/);
  assert.ok(berandaMatch, 'Section tab-beranda harus ada');
  const berandaHtml = berandaMatch[0];

  // 1. Verifikasi kartu kategori Explore Stories, Cultural Archive, Community sudah dihapus dari Beranda
  assert.ok(!berandaHtml.includes('Explore Stories'), 'Explore Stories harus sudah disingkirkan dari Beranda');
  assert.ok(!berandaHtml.includes('Cultural Archive'), 'Cultural Archive harus sudah disingkirkan dari Beranda');
  assert.ok(!berandaHtml.includes('card_stories_tag'), 'card_stories_tag harus sudah disingkirkan dari Beranda');
  assert.ok(!berandaHtml.includes('card_archive_tag'), 'card_archive_tag harus sudah disingkirkan dari Beranda');
  assert.ok(!berandaHtml.includes('card_community_tag'), 'card_community_tag harus sudah disingkirkan dari Beranda');
  assert.ok(!berandaHtml.includes('amber-light-trail-wrap'), 'Amber light trails dekoratif lama harus disingkirkan untuk perampingan');

  // 2. Verifikasi widget musik Ketawang Puspawarna di beranda sudah dihapus (karena sudah ada di header & tab gamelan)
  assert.ok(!berandaHtml.includes('toggleKetawangPuspawarna()'), 'Widget pemutar musik yang menumpuk di beranda harus dihapus');

  // 3. Verifikasi pop-up modal terpisah modalShareSapaDina sudah disatukan dan dihapus dari DOM
  assert.ok(!html.includes('id="modalShareSapaDina"'), 'Modal terpisah modalShareSapaDina harus dihapus');
});

test('Home UI Overhaul - Penyatuan Kartu Hari Ini & Akordeon Sapa Dina', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Verifikasi elemen kartu utama
  assert.ok(html.includes('id="heroTodayCard"'), 'Kartu utama heroTodayCard harus ada');
  assert.ok(html.includes('id="heroMasehiDateText"'), 'Elemen tanggal Masehi harus ada');
  assert.ok(html.includes('id="heroJawaWetonText"'), 'Elemen weton utama harus ada');
  assert.ok(html.includes('id="heroTanggalJawaLengkap"'), 'Elemen tanggal Jawa lengkap harus ada');
  assert.ok(html.includes('id="heroNeptuWetonBadge"'), 'Badge neptu weton harus ada');
  assert.ok(html.includes('id="heroDinoStatusBadge"'), 'Badge status dino harus ada');

  // Verifikasi tombol bagikan gambar & teks
  assert.ok(html.includes('openWetonShareModal()'), 'Tombol bagikan kartu harus ada');
  assert.ok(html.includes('shareTodayWetonText()'), 'Tombol bagikan teks harus ada');

  // Verifikasi tombol toggle akordeon & panel detail
  assert.ok(html.includes('id="btnToggleHeroDetail"'), 'Tombol toggle akordeon harus ada');
  assert.ok(html.includes('toggleHeroTodayAccordion()'), 'Fungsi toggleHeroTodayAccordion harus dipanggil');
  assert.ok(html.includes('id="heroTodayDetailPanel"'), 'Panel detail akordeon harus ada');

  // Verifikasi elemen di dalam panel akordeon
  assert.ok(html.includes('id="heroPituturAksara"'), 'Aksara pitutur harus ada di panel');
  assert.ok(html.includes('id="heroPituturJawa"'), 'Teks Jawa pitutur harus ada di panel');
  assert.ok(html.includes('id="heroPituturArtiHarfiah"'), 'Arti pitutur harus ada di panel');
  assert.ok(html.includes('id="heroPranataNama"'), 'Nama pranata mangsa harus ada di panel');
  assert.ok(html.includes('id="heroArahKoloNama"'), 'Arah Kala harus ada di panel');
  assert.ok(html.includes('id="heroTetanenKategori"'), 'Petung tetanen harus ada di panel');
});

test('Home UI Overhaul - 4 Chip Aksi Cepat Thumb-Friendly', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Verifikasi 4 aksi cepat utama
  assert.ok(html.includes('switchTab(\'kalender\')'), 'Chip Cek Weton harus ada');
  assert.ok(html.includes('switchTab(\'perjodohan\')'), 'Chip Petung Jodoh harus ada');
  assert.ok(html.includes('switchTab(\'ijab\')'), 'Chip Hari Baik Ijab harus ada');
  assert.ok(html.includes('switchTab(\'selametan\')'), 'Chip Selametan harus ada');
});

test('Home UI Overhaul - Kalkulasi Weton & Sapa Dina Bebas Undefined', () => {
  const testDates = [
    new Date(2026, 9, 3),  // Hari ini (Oktober 2026)
    new Date(2025, 0, 1),  // Awal tahun
    new Date(2024, 7, 17), // Kemerdekaan RI
    new Date(2023, 5, 22)  // Titik balik matahari
  ];

  testDates.forEach(date => {
    const sapa = getSapaDinaData(date);
    assert.ok(sapa, 'Data Sapa Dina harus terdefinisi');

    // Pastikan tidak ada properti string yang bernilai 'undefined' atau mengandung 'undefined'
    assert.notEqual(sapa.hariDisplay, undefined);
    assert.notEqual(sapa.pasaranDisplay, undefined);
    assert.notEqual(sapa.wetonDisplay, undefined);
    assert.ok(!sapa.wetonDisplay.includes('undefined'), `Weton tidak boleh memuat undefined: ${sapa.wetonDisplay}`);
    assert.notEqual(sapa.neptu, undefined);
    assert.ok(!isNaN(sapa.neptu), 'Neptu harus angka valid');
    assert.notEqual(sapa.wukuDisplay, undefined);
    assert.ok(!sapa.wukuDisplay.includes('undefined'), 'Wuku tidak boleh memuat undefined');
    assert.notEqual(sapa.bulanJawa, undefined);
    assert.notEqual(sapa.tglJawa, undefined);
    assert.notEqual(sapa.tahunAJ, undefined);
    assert.notEqual(sapa.tahunSiklus, undefined);
    assert.notEqual(sapa.namaWindu, undefined);

    // Pranata & Pitutur
    assert.ok(sapa.pranata.nama, 'Nama pranata mangsa harus valid');
    assert.ok(sapa.pitutur.jawa, 'Pitutur Jawa harus valid');
    assert.ok(sapa.pitutur.artiHarfiah, 'Arti pitutur harus valid');

    // getTanggalJawaLengkap
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const tglJawa = getTanggalJawaLengkap(y, m, d);
    assert.ok(tglJawa.dino, 'Dino tidak boleh kosong');
    assert.ok(tglJawa.pas, 'Pasaran tidak boleh kosong');
    assert.ok(tglJawa.wukuName, 'WukuName tidak boleh kosong');
    assert.ok(typeof tglJawa.neptu === 'number', 'Neptu harus angka');
  });
});
