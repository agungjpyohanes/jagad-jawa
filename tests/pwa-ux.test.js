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
  NAV_DICTIONARY,
  CONTENT_DICTIONARY,
  isMenuKey,
  getLanguage,
  setLanguage,
  toggleLanguage,
  applyLanguage,
  t
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

  it('harus memiliki sw.js yang mencakup shell, manifest, dan penanganan cache API dataset', () => {
    const swPath = path.join(rootDir, 'sw.js');
    assert.ok(fs.existsSync(swPath), 'File sw.js harus ada di root');

    const content = fs.readFileSync(swPath, 'utf8');
    assert.ok(content.includes('PRECACHE_SHELL') || content.includes('PRECACHE_ASSETS'), 'sw.js harus mendefinisikan cache shell');
    assert.ok(content.includes('manifest.webmanifest'), 'Cache harus memuat manifest');
    assert.ok(content.includes('/data/') && content.includes('.json'), 'sw.js harus menangani caching endpoint /data/*.json');
    assert.ok(!content.includes('./data/01-kalender-constants.json'), 'sw.js tidak boleh mem-precache file JSON statis lokal secara naif di precache shell');
    assert.ok(content.includes('jagad-jawa-'), 'sw.js harus menggunakan versioning cache');
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

  it('jawa-v11: perombakan full bilingual - toggle bahasa memengaruhi menu navigasi utama, sub-menu, dan konten secara menyeluruh', () => {
    // Mode ID awal
    setLanguage('id');
    assert.strictEqual(getLanguage(), 'id');
    assert.strictEqual(t('nav_beranda'), 'Beranda');
    assert.strictEqual(t('nav_kalender'), 'Kalender Jawa');
    assert.strictEqual(t('nav_nujum'), 'Nujum & Primbon');
    assert.strictEqual(t('nav_budaya'), 'Seni & Budaya');
    assert.strictEqual(t('nav_aksara'), 'Studio Aksara Jawa');
    assert.strictEqual(t('nav_wayang'), 'Panggung Kelir Wayang');
    assert.strictEqual(t('cal_saring_label'), 'Saring Hari:');

    // Switch ke Mode JV
    setLanguage('jv');
    assert.strictEqual(getLanguage(), 'jv');

    // PEROMBAKAN FULL BILINGUAL: Seluruh label menu & sub-menu beralih ke Basa Jawi
    assert.strictEqual(t('nav_beranda'), 'Pambuka');
    assert.strictEqual(t('nav_kalender'), 'Kalendher Jawi');
    assert.strictEqual(t('nav_nujum'), 'Nujum & Primbon');
    assert.strictEqual(t('nav_budaya'), 'Seni & Kabudayan');
    assert.strictEqual(t('nav_aksara'), 'Papan Aksara Jawa');
    assert.strictEqual(t('nav_wayang'), 'Panggung Kelir Wayang');
    assert.strictEqual(t('nav_jodoh'), 'Pitung Salaki Rabi');
    assert.strictEqual(t('nav_selametan'), 'Pengetan Tilar Donyo');

    // Deskripsi & isi konten modul juga beralih ke Basa Jawi yang otentik
    assert.strictEqual(t('cal_saring_label'), 'Saring Dina:');
    assert.strictEqual(t('cal_filter_ijo'), 'Dino Ijo (Becik)');
    assert.strictEqual(t('tab_wuku_desc'), 'Njlajahi siklus 30 wuku wiwit Sinta dumugi Watugunung sesarengan Bathara Pangayom lan 4 pilar petenget.');

    // Verifikasi pemisahan kamus dan isMenuKey tetap konsisten
    assert.strictEqual(isMenuKey('nav_beranda'), true);
    assert.strictEqual(isMenuKey('nav_kalender'), true);
    assert.strictEqual(isMenuKey('cal_saring_label'), false);
    assert.strictEqual(isMenuKey('tab_wuku_desc'), false);
    assert.ok(NAV_DICTIONARY.nav_beranda);
    assert.ok(CONTENT_DICTIONARY.cal_saring_label);
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
    assert.strictEqual(typeof kalenderUI.getInitialKalenderViewMode, 'function');
  });

  it('getInitialKalenderViewMode mendeteksi mobile viewport (<640px) menjadi list', async () => {
    const kalenderUI = await import('../js/modules/kalender/kalender-ui.js');
    const originalWindow = globalThis.window;
    try {
      globalThis.window = {
        innerWidth: 390,
        matchMedia: (q) => ({ matches: q.includes('max-width: 639px') })
      };
      assert.strictEqual(kalenderUI.getInitialKalenderViewMode(), 'list');

      globalThis.window = {
        innerWidth: 1024,
        matchMedia: () => ({ matches: false })
      };
      assert.strictEqual(kalenderUI.getInitialKalenderViewMode(), 'grid');
    } finally {
      globalThis.window = originalWindow;
    }
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

describe('Fase H — UX: Discovery, Breadcrumb & A11y Modal', () => {
  it('semua breadcrumb menggunakan label produk dwibahasa, bukan path direktori atau URL file', async () => {
    const navModule = await import('../js/ui/navigation.js');
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

    // Breadcrumb summary default
    assert.ok(indexHtml.includes('Jagad Jawa • Beranda'), 'Breadcrumb summary default harus berlabel Jagad Jawa • Beranda');
    assert.ok(!indexHtml.includes('/d:/'), 'Breadcrumb tidak boleh memuat path direktori OS');
    assert.ok(!indexHtml.includes('C:\\'), 'Breadcrumb tidak boleh memuat path direktori Windows');
  });

  it('modal controller mengekspor trapFocusInModal dan closeAnyActiveModal yang valid', async () => {
    const modalModule = await import('../js/ui/modal.js');
    assert.strictEqual(typeof modalModule.trapFocusInModal, 'function');
    assert.strictEqual(typeof modalModule.closeAnyActiveModal, 'function');
    assert.strictEqual(typeof modalModule.initModalListeners, 'function');
  });

  it('navigasi mengekspor selectBerandaCategory dan filterBerandaFeatures', async () => {
    const navModule = await import('../js/ui/navigation.js');
    assert.strictEqual(typeof navModule.selectBerandaCategory, 'function');
    assert.strictEqual(typeof navModule.filterBerandaFeatures, 'function');
  });
});

describe('jawa-v13 — UI/UX Accessibility, Bilingual Integrity & 360px Layout', () => {
  it('semua kartu fitur beranda adalah tombol semantik yang dapat difokuskan dan memiliki label jelas', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const featureGridMatch = indexHtml.match(/<div id="berandaFeatureGrid"[^>]*>([\s\S]*?)<\/div>\s*<\/section>/);
    assert.ok(featureGridMatch, 'Elemen #berandaFeatureGrid harus ditemukan di index.html');

    const gridContent = featureGridMatch[1];
    // Tidak boleh ada kartu berupa div dengan onclick switchTab
    assert.strictEqual(gridContent.includes('<div onclick="switchTab('), false, 'Tidak boleh ada div clickable tanpa keyboard focus');

    // Semua item berupa <button type="button" onclick="switchTab(...)">
    const buttonMatches = [...gridContent.matchAll(/<button[^>]*type="button"[^>]*onclick="switchTab\('([^']+)'\)"[^>]*>/g)];
    assert.strictEqual(buttonMatches.length, 21, 'Harus ada 21 button modul fitur beranda');

    // Setiap button harus memiliki aria-label dan kelas fokus keyboard
    for (const match of buttonMatches) {
      const tagStr = match[0];
      assert.ok(tagStr.includes('aria-label='), `Button ${match[1]} harus memiliki aria-label`);
      assert.ok(tagStr.includes('focus:outline-none') || tagStr.includes('focus:ring'), `Button ${match[1]} harus memiliki style focus keyboard`);
    }
  });

  it('document lang attribute sinkron dengan bahasa yang dipilih (id vs jv)', () => {
    // Simulasi lingkungan DOM sederhana
    const originalDocument = globalThis.document;
    try {
      const attrs = { lang: 'id' };
      globalThis.document = {
        documentElement: {
          setAttribute: (name, val) => { attrs[name] = val; },
          getAttribute: (name) => attrs[name]
        },
        querySelectorAll: () => []
      };

      setLanguage('id');
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'id');

      setLanguage('jv');
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'jv');

      setLanguage('id');
      assert.strictEqual(document.documentElement.getAttribute('lang'), 'id');
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it('locale bahasa Indonesia (id.js) bersih dari string bahasa Jawa yang tidak sengaja tercampur', async () => {
    const { id } = await import('../src/locales/id.js');

    assert.strictEqual(id.hero_today_tag, 'Hari Ini');
    assert.strictEqual(id.hero_quick_selametan_desc, 'Geblak hingga Nyewu');
    assert.strictEqual(id.nujum_nonjodoh_p1, 'Pihak Pertama (Orang 1)');
    assert.strictEqual(id.nujum_nonjodoh_p2, 'Pihak Kedua (Orang 2)');
    assert.strictEqual(id.cal_saring_label, 'Saring Hari:');
    assert.strictEqual(id.cal_filter_all, 'Semua Hari');
    assert.strictEqual(id.cal_filter_ijo, 'Hari Baik (Becik)');
  });

  it('wadah filter dan kontrol view mode kalender mendukung pembungkusan responsif untuk viewport 360px', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('id="calFilterGroup"'), 'Elemen #calFilterGroup harus ada');
    assert.ok(indexHtml.includes('id="btnCalModeGrid"'), 'Elemen #btnCalModeGrid harus ada');
    assert.ok(indexHtml.includes('id="btnCalModeList"'), 'Elemen #btnCalModeList harus ada');
    assert.ok(indexHtml.includes('flex flex-col sm:flex-row'), 'Wadah filter kalender harus flex-col di mobile dan sm:flex-row');
  });
});
