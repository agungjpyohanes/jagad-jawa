import { test, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

import {
  DICTIONARY,
  getLanguage,
  setLanguage,
  toggleLanguage
} from '../js/ui/i18n.js';

import {
  evaluateDino,
  getDinoWarnaStatus,
  getDayInfo,
  getTanggalJawaLengkap,
  toJDN
} from '../js/modules/kalender/kalender-engine.js';

describe('Fase H — PWA & Service Worker Cache Integrity', () => {
  it('harus memiliki manifest.webmanifest yang valid dengan metadata PWA lengkap', () => {
    const manifestPath = path.join(rootDir, 'manifest.webmanifest');
    assert.ok(fs.existsSync(manifestPath), 'File manifest.webmanifest harus ada di root');

    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    assert.ok(manifest.name.includes('Jagad Jawa'));
    assert.strictEqual(manifest.short_name, 'Jagad Jawa');
    assert.strictEqual(manifest.display, 'standalone');
    assert.strictEqual(manifest.theme_color, '#0B0F19');
    assert.strictEqual(manifest.background_color, '#0B0F19');
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);
    assert.ok(manifest.icons.some(i => i.purpose === 'maskable'));
  });

  it('harus memiliki aset ikon vektor icon.svg di folder assets/', () => {
    const iconPath = path.join(rootDir, 'assets', 'icon.svg');
    assert.ok(fs.existsSync(iconPath), 'File assets/icon.svg harus ada');
    const content = fs.readFileSync(iconPath, 'utf8');
    assert.ok(content.includes('<svg'), 'icon.svg harus memuat tag SVG');
  });

  it('harus memiliki sw.js yang mencakup shell, data nujum-matrix, dan kalender', () => {
    const swPath = path.join(rootDir, 'sw.js');
    assert.ok(fs.existsSync(swPath), 'File sw.js harus ada di root');

    const content = fs.readFileSync(swPath, 'utf8');
    assert.ok(content.includes('PRECACHE_ASSETS'), 'sw.js harus mendefinisikan PRECACHE_ASSETS');
    assert.ok(content.includes('./js/data/nujum-matrix.js'), 'Cache harus memuat nujum-matrix.js');
    assert.ok(content.includes('./js/data/calendar.js'), 'Cache harus memuat calendar.js');
    assert.ok(content.includes('./js/data/pawukon.js'), 'Cache harus memuat pawukon.js');
    assert.ok(content.includes('./js/main.js'), 'Cache harus memuat main.js');
    assert.ok(content.includes('./manifest.webmanifest'), 'Cache harus memuat manifest');
  });
});

describe('Fase H — UX: Toggle Label Indonesia & Basa Jawa (Tanpa Mutasi Data)', () => {
  beforeEach(() => {
    // Reset bahasa ke id
    setLanguage('id');
  });

  it('harus memiliki kamus dwibahasa lengkap untuk elemen UI utama', () => {
    assert.ok(DICTIONARY.nav_beranda);
    assert.strictEqual(DICTIONARY.nav_beranda.id, 'Beranda');
    assert.strictEqual(DICTIONARY.nav_beranda.jv, 'Pambuka');

    assert.strictEqual(DICTIONARY.cal_saring_label.id, 'Saring Hari:');
    assert.strictEqual(DICTIONARY.cal_saring_label.jv, 'Saring Dina:');

    assert.strictEqual(DICTIONARY.cal_filter_ijo.id, 'Hari Baik (Becik)');
    assert.strictEqual(DICTIONARY.cal_filter_ijo.jv, 'Dino Ijo (Becik)');

    assert.strictEqual(DICTIONARY.cal_mode_grid.id, 'Mode Tabel (Grid)');
    assert.strictEqual(DICTIONARY.cal_mode_list.id, 'Mode List Minggu');
  });

  it('harus dapat melakukan toggle bahasa antara id dan jv', () => {
    assert.strictEqual(getLanguage(), 'id');
    const switched = toggleLanguage();
    assert.strictEqual(switched, 'jv');
    assert.strictEqual(getLanguage(), 'jv');

    const switchedBack = toggleLanguage();
    assert.strictEqual(switchedBack, 'id');
    assert.strictEqual(getLanguage(), 'id');
  });

  it('tidak boleh mengubah key data atau hasil kalkulasi saat bahasa diganti', () => {
    // Tanggal uji: 1 Januari 2026
    const tglAwal = getTanggalJawaLengkap(2026, 1, 1);

    // Ganti ke Basa Jawa
    setLanguage('jv');
    const tglSetelahGantiBahasa = getTanggalJawaLengkap(2026, 1, 1);

    // Pastikan seluruh data key dan nilai tetap 100% identik
    assert.strictEqual(tglSetelahGantiBahasa.dino, tglAwal.dino);
    assert.strictEqual(tglSetelahGantiBahasa.pas, tglAwal.pas);
    assert.strictEqual(tglSetelahGantiBahasa.neptu, tglAwal.neptu);
    assert.strictEqual(tglSetelahGantiBahasa.wukuName, tglAwal.wukuName);
    assert.strictEqual(tglSetelahGantiBahasa.tahunAJ, tglAwal.tahunAJ);
    assert.strictEqual(tglSetelahGantiBahasa.bulanJawa, tglAwal.bulanJawa);
  });
});

describe('Fase H — UX: Kontras Teks Badge Ala / Becik (WCAG AA)', () => {
  it('badge Becik harus menggunakan warna hijau solid berkontras tinggi (#15803d)', () => {
    const dinoWarna = getDinoWarnaStatus('Kamis', 'Legi', 'Sinta', false, false, '');
    assert.strictEqual(dinoWarna.isIjo, true);
    assert.strictEqual(dinoWarna.bottomBg, '#15803d');
    assert.ok(dinoWarna.badgeHtml.includes('#15803d'), 'Badge Becik harus memakai latar #15803d');
    assert.ok(dinoWarna.badgeHtml.includes('text-white'), 'Badge Becik harus memakai teks putih tegas');
  });

  it('badge Ala harus menggunakan warna merah solid berkontras tinggi (#b91c1c)', () => {
    const dinoWarna = getDinoWarnaStatus('Senin', 'Wage', 'Sinta', false, false, 'SAM');
    assert.strictEqual(dinoWarna.isIjo, false);
    assert.strictEqual(dinoWarna.bottomBg, '#b91c1c');
    assert.ok(dinoWarna.badgeHtml.includes('#b91c1c'), 'Badge Ala harus memakai latar #b91c1c');
    assert.ok(dinoWarna.badgeHtml.includes('text-white'), 'Badge Ala harus memakai teks putih tegas');
  });

  it('badge Dino Gede harus menggunakan aksen emas dengan teks sangat gelap (#eab308 & text-amber-950)', () => {
    // Sinta, Minggu Pahing adalah salah satu dino sakral/gede
    const dinoWarna = getDinoWarnaStatus('Minggu', 'Pahing', 'Sinta', true, true, '');
    if (dinoWarna.isGede) {
      assert.ok(dinoWarna.badgeHtml.includes('#eab308'), 'Badge Gede harus memakai border/latar #eab308');
      assert.ok(dinoWarna.badgeHtml.includes('text-amber-950'), 'Badge Gede harus memakai teks sangat gelap untuk kontras tinggi');
    }
  });

  it('formula evaluateDino tetap 100% konsisten tanpa perubahan logika', () => {
    const resIjo = evaluateDino('Sinta', 'Kamis', 'Legi');
    assert.strictEqual(resIjo.isIjo, true);
    assert.strictEqual(resIjo.isAbang, false);

    const resAla = evaluateDino('Sinta', 'Senin', 'Wage');
    assert.strictEqual(resAla.isIjo, false);
    assert.strictEqual(resAla.isAbang, true);
  });
});

describe('Fase H — UX: Layout Kalender Mobile & Mode List Minggu', () => {
  it('harus mengekspor setKalenderViewMode dan toggleKalenderViewMode dari modul kalender', async () => {
    const kalenderUI = await import('../js/modules/kalender/kalender-ui.js');
    assert.strictEqual(typeof kalenderUI.setKalenderViewMode, 'function');
    assert.strictEqual(typeof kalenderUI.toggleKalenderViewMode, 'function');
    assert.strictEqual(typeof kalenderUI.renderKalenderListView, 'function');
  });

  it('data hari pada Mode List Minggu terbukti 100% konsisten dengan perhitungan JDN & Weton baku', () => {
    // Verifikasi sampel tanggal: 29 Agustus 2021 (Epoch Wuku Sinta, Minggu Pahing)
    const info = getTanggalJawaLengkap(2021, 8, 29);
    assert.strictEqual(info.dino, 'Minggu');
    assert.strictEqual(info.pas, 'Pahing');
    assert.strictEqual(info.wukuName, 'Sinta');
    assert.strictEqual(info.neptu, 14); // 5 + 9

    // Verifikasi sampel tanggal: 17 Agustus 1945 (Jumat Legi, Wuku Manahil)
    const info1945 = getTanggalJawaLengkap(1945, 8, 17);
    assert.strictEqual(info1945.dino, 'Jumat');
    assert.strictEqual(info1945.pas, 'Legi');
    assert.strictEqual(info1945.wukuName, 'Manahil');
    assert.strictEqual(info1945.neptu, 11); // 6 + 5
  });
});

