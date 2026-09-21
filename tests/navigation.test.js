/**
 * Jagad Jawa — Unit Test: Navigation & Tab Integrity (C1 & C2)
 * Memverifikasi integritas seluruh tab id, ketersediaan container tab-content,
 * dan fungsi kendali navigasi / mobile menu.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Navigasi & Menu - Integritas Tab dan Section (C1 & C2)', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Daftar seluruh tab resmi yang wajib ada di Jagad Jawa (C1 & C2)
  const requiredTabs = [
    'beranda',
    'kalender',
    'tanggal-jawa',
    'kepribadian', // Nujum
    'perjodohan',
    'selametan',
    'wuku',        // Ensiklopedia 30 Wuku (C2)
    'gamelan',
    'aksara',
    'wayang',
    'pitutur',
    'tumpeng',
    'laporan'      // Pusat Laporan Keraton PDF (C2)
  ];

  requiredTabs.forEach(tabId => {
    const tabSectionRegex = new RegExp(`id=["']tab-${tabId}["']`, 'i');
    assert.ok(
      tabSectionRegex.test(html),
      `Section tab-${tabId} wajib didefinisikan di index.html`
    );
  });
});

test('Navigasi & Menu - Konsistensi Tombol Navigasi Desktop & Mobile', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Pastikan tombol navigasi utama memuat data-tab yang sesuai
  const keyNavTabs = [
    'beranda',
    'kalender',
    'tanggal-jawa',
    'kepribadian',
    'perjodohan',
    'selametan',
    'wuku',
    'gamelan',
    'aksara',
    'wayang',
    'pitutur',
    'tumpeng',
    'laporan'
  ];

  keyNavTabs.forEach(tab => {
    assert.ok(
      html.includes(`switchTab('${tab}')`),
      `Harus ada pemanggilan switchTab('${tab}') di navigasi desktop atau mobile`
    );
  });

  // Pastikan drawer mobile menu ada
  assert.ok(html.includes('id="mobileMenu"'), 'Drawer mobileMenu wajib ada');
  assert.ok(html.includes('toggleMobileMenu()'), 'Tombol toggleMobileMenu wajib ada');
});

test('Navigasi & Menu - Placeholder Fitur Lanjutan Memuat Tanda Segera', () => {
  const indexPath = path.resolve('index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Sesuai syarat C3: "buat halaman placeholder dengan judul + deskripsi singkat + 'segera' — jangan kosong membingungkan"
  assert.ok(
    html.includes('Segera Hadir'),
    'Halaman placeholder harus memuat tanda "Segera Hadir"'
  );
  assert.ok(
    html.includes('Piagam Weton Aksara Jawa Berpigura Emas'),
    'Placeholder piagam weton harus memuat judul dan deskripsi'
  );
  assert.ok(
    html.includes('Buku Panduan Pawiwahan Mantu (E-Book PDF)'),
    'Placeholder buku mantu harus memuat judul dan deskripsi'
  );
  assert.ok(
    html.includes('Bagan Silsilah &amp; Tarikh Trah Leluhur') || html.includes('Bagan Silsilah & Tarikh Trah Leluhur'),
    'Placeholder silsilah harus memuat judul dan deskripsi'
  );
});
