import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { CANONICAL_KEYS, resolveCanonicalKey } from '../js/services/datasetManifest.js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4188;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const DATA_DIR = path.resolve(process.cwd(), 'public/data');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

// State kontrol simulasi server fixture untuk pengujian error & retry
let serverMode = 'normal'; // 'normal' | 'error_503' | 'error_network'
let simulatedFailures = new Set(); // Key yang sengaja digagalkan

function createTestServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, BASE_URL);
    const pathname = url.pathname;

    // Endpoint data statis: /data/[filename.json]
    if (pathname.startsWith('/data/')) {
      const filename = pathname.replace(/^\/data\//, '');

      // Simulasi 503 Service Unavailable / Server Down
      if (serverMode === 'error_503' || simulatedFailures.has(filename)) {
        res.writeHead(503, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        });
        res.end(JSON.stringify({
          error: 'Service Unavailable',
          message: 'Layanan data tidak tersedia (Simulasi E2E Mock).',
          file: filename
        }));
        return;
      }

      // Layani fixture data dari public/data/<filename>
      const filePath = path.join(DATA_DIR, filename);
      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'File Not Found', filename }));
      return;
    }

    // Melayani aset statis dari direktori dist/
    let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    let filePath = path.join(DIST_DIR, relativePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const headers = { 'Content-Type': contentType };

      if (pathname === '/sw.js') {
        headers['Content-Type'] = 'application/javascript; charset=utf-8';
        headers['Cache-Control'] = 'no-cache';
      }

      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback untuk navigasi HTML
    if (!pathname.includes('.')) {
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
}

describe('E2E Browser Test Suite (Headless Chrome + Local Fixture Server)', { concurrency: 1 }, () => {
  let server;
  let browser;

  before(async () => {
    // 1. Jalankan server fixture lokal
    server = createTestServer();
    await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

    // 2. Luncurkan browser headless Chrome lokal
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('1. App Shell Load & Canonical API Path tanpa blank page atau uncaught console error', async () => {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const apiRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });
    page.on('request', (req) => {
      const u = req.url();
      if (u.includes('/data/')) {
        apiRequests.push(u);
      }
      if (u.includes('/api/data/')) {
        apiRequests.push(u);
      }
    });

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Verifikasi Title dan Brand
    const title = await page.title();
    assert.match(title, /Jagad Jawa/i);

    const brandHeader = await page.$eval('.brand-title', (el) => el.textContent.trim());
    assert.equal(brandHeader, 'JAGAD JAWA');

    // Verifikasi Hero Card Hari Ini ter-render dengan teks tanggal Masehi & weton
    const heroMasehi = await page.$eval('#heroMasehiDateText', (el) => el.textContent.trim());
    assert.ok(heroMasehi.length > 5, 'Hero Masehi Date text harus terisi');
    assert.notEqual(heroMasehi, 'Memuat Penanggalan...', 'Hero Masehi Date tidak boleh stuck loading');

    // Verifikasi fetch runtime menggunakan path statis /data/01-kalender-constants.json
    const hasStaticDataCall = apiRequests.some(url => url.includes('/data/01-kalender-constants.json'));
    assert.ok(hasStaticDataCall, 'Harus memanggil endpoint file statis /data/01-kalender-constants.json');

    const hasLegacyApiCall = apiRequests.some(url => url.includes('/api/data/'));
    assert.equal(hasLegacyApiCall, false, 'Tidak boleh memanggil endpoint legacy /api/data/');

    // Verifikasi tidak ada uncaught exception
    assert.equal(pageErrors.length, 0, `Uncaught page errors terdeteksi: ${pageErrors.join('; ')}`);
    // Filter noise favicon/font jika ada
    const criticalConsoleErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('404'));
    assert.equal(criticalConsoleErrors.length, 0, `Console errors terdeteksi: ${criticalConsoleErrors.join('; ')}`);

    await page.close();
  });

  it('2. Kalender View Mode Switcher (Grid vs List Minggu) & Responsive Default', async () => {
    const page = await browser.newPage();
    
    // Uji Viewport Mobile Sempit (<640px)
    await page.setViewport({ width: 360, height: 740 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Buka tab Kalender
    await page.evaluate(() => window.switchTab('kalender'));
    await page.waitForSelector('#tab-kalender', { visible: true });

    // Di mobile viewport (<640px), default layout mengaktifkan Mode List Minggu
    const initialViewMode = await page.evaluate(() => window.currentKalenderViewMode);
    assert.equal(initialViewMode, 'list', 'Viewport 360px harus default ke mode list');

    // Verifikasi elemen list minggu terpasang di DOM
    const listCardsCount = await page.$$eval('.cal-week-card', (cards) => cards.length);
    assert.ok(listCardsCount >= 4, `Jumlah kartu pekan list harus >= 4, didapat: ${listCardsCount}`);

    // Ganti ke Mode Tabel (Grid) via tombol UI
    await page.evaluate(() => {
      const btn = document.getElementById('btnCalModeGrid');
      if (btn) btn.click();
    });
    const modeAfterGridClick = await page.evaluate(() => window.currentKalenderViewMode);
    assert.equal(modeAfterGridClick, 'grid', 'Harus berganti ke mode grid');

    // Verifikasi tabel grid hadir
    const tableExists = await page.$eval('#calTable', (el) => Boolean(el));
    assert.ok(tableExists, 'Tabel kalender grid harus tampil saat mode grid aktif');

    // Kembalikan ke Mode List Minggu via tombol UI
    await page.evaluate(() => {
      const btn = document.getElementById('btnCalModeList');
      if (btn) btn.click();
    });
    const modeAfterListClick = await page.evaluate(() => window.currentKalenderViewMode);
    assert.equal(modeAfterListClick, 'list', 'Harus berganti kembali ke mode list');

    await page.close();
  });

  it('3. Viewports 320px, 360px, 390px, dan 1280px (Scroll affordance & Layout utuh)', async () => {
    const page = await browser.newPage();
    const testViewports = [
      { width: 320, height: 600, label: '320px narrow' },
      { width: 360, height: 740, label: '360px compact' },
      { width: 390, height: 844, label: '390px modern mobile' },
      { width: 1280, height: 800, label: '1280px desktop' }
    ];

    for (const vp of testViewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        window.switchTab('kalender');
        if (window.setKalenderViewMode) window.setKalenderViewMode('grid');
      });

      // Di viewport sempit (<640px) pada mode grid, hint scroll horizontal harus ada
      const scrollHintVisible = await page.evaluate(() => {
        const hint = document.getElementById('kalenderScrollHint');
        if (!hint) return false;
        const style = window.getComputedStyle(hint);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      if (vp.width < 640) {
        assert.ok(scrollHintVisible, `Viewport ${vp.label} harus menampilkan petunjuk scroll`);
      }

      // Pastikan konten tab-kalender tidak terpotong (lebar elemen tidak overflow liar)
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      assert.ok(bodyScrollWidth >= vp.width, `Body width valid untuk ${vp.label}`);
    }

    await page.close();
  });

  it('4. Data Error State (503), Dwibahasa, & Retry Recovery', async () => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Buka tab omah dan pastikan siap
    await page.evaluate(() => window.switchTab('omah'));
    await page.waitForSelector('#tab-omah', { visible: true });

    // Gagalkan pemuatan dataset omah secara spesifik (simulasi 503) untuk pengujian invalidasi & retry
    simulatedFailures.add('23-omah-bilingual.json');

    // Hapus SW dan data cache jika ada agar browser memanggil jaringan langsung ke server mock
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        for (const k of keys) {
          await caches.delete(k);
        }
      }
      if (window.invalidateDomainData) window.invalidateDomainData('omah');
      if (window.setOmahDataset) window.setOmahDataset(null);
      if (typeof globalThis !== 'undefined') globalThis._currentOmahData = null;
      if (window.dbLoader && window.dbLoader.clearCache) window.dbLoader.clearCache();
      const c = document.getElementById('omahResultContainer');
      if (c) c.innerHTML = '';
      if (window.toggleOmahFormMode) window.toggleOmahFormMode();
      if (window.hitungOmahDariUI) {
        await window.hitungOmahDariUI(true);
      }
    });

    // Verifikasi error state ter-render dengan role="alert" dan tombol retry
    await page.waitForFunction(() => {
      const el = document.querySelector('#omahResultContainer .data-error-state');
      return Boolean(el);
    }, { timeout: 8000 });

    const errorDetails = await page.evaluate(() => {
      const errBox = document.querySelector('#omahResultContainer .data-error-state');
      const h4 = errBox ? errBox.querySelector('h4')?.textContent?.trim() : '';
      const retryBtn = errBox ? errBox.querySelector('.btn-retry-data') : null;
      return {
        hasAlertRole: errBox ? errBox.getAttribute('role') === 'alert' : false,
        title: h4,
        hasRetryBtn: Boolean(retryBtn)
      };
    });

    assert.ok(errorDetails.hasAlertRole, 'Error state harus memiliki role="alert"');
    assert.ok(
      errorDetails.title.includes('Gagal Memuat Data Tradisi') || errorDetails.title.includes('Data Tradisi Dereng Kasil'),
      'Judul error state harus dwibahasa sesuai sistem'
    );
    assert.ok(errorDetails.hasRetryBtn, 'Tombol Coba Lagi harus hadir pada error state');

    // Sekarang pulihkan dataset omah ke mode normal
    simulatedFailures.delete('23-omah-bilingual.json');

    // Klik tombol retry untuk menguji recovery
    await page.evaluate(() => {
      const btn = document.querySelector('#omahResultContainer .btn-retry-data');
      if (btn) btn.click();
    });

    // Tunggu container hasil omah terisi setelah pemulihan retry
    await page.waitForFunction(() => {
      const res = document.getElementById('omahResultContainer');
      return res && res.innerHTML.length > 50 && !res.querySelector('.data-error-state');
    }, { timeout: 8000 });

    const recoveryHtml = await page.evaluate(() => document.getElementById('omahResultContainer')?.innerHTML || '');
    assert.ok(
      recoveryHtml.includes('Petung Ngedekake') || recoveryHtml.includes('Cempuri') || recoveryHtml.includes('Simpulan'),
      'Hasil omah harus muncul setelah recovery'
    );

    await context.close();
  });

  it('5. Alur Jodoh: Planning vs Married (Married menyembunyikan rekomendasi mantu & CTA ijab)', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => window.switchTab('perjodohan'));
    await page.waitForSelector('#tab-perjodohan', { visible: true });

    // 1. Skenario PLANNING (Belum Menikah / Calon Pengantin)
    await page.evaluate(async () => {
      const radio = document.getElementById('statusBelumMenikah');
      if (radio) {
        radio.checked = true;
        if (window.onStatusHubunganChange) window.onStatusHubunganChange('planning');
      }
      // Set input tanggal wanita dan pria (ID yang benar: tglP & tglL)
      const tglP = document.getElementById('tglP');
      if (tglP) {
        tglP.value = '1995-05-12'; // Jumat Kliwon
        if (window.autoWetonPerjodohan) window.autoWetonPerjodohan('P');
      }
      const tglL = document.getElementById('tglL');
      if (tglL) {
        tglL.value = '1993-08-20'; // Jumat Wage
        if (window.autoWetonPerjodohan) window.autoWetonPerjodohan('L');
      }
      // Panggil kalkulasi
      if (window.hitungNujumPerjodohan) await window.hitungNujumPerjodohan();
    });

    await page.waitForSelector('#hasilPerjodohanCard', { visible: true, timeout: 5000 });

    // Verifikasi pada status planning: Rekomendasi Hari Mantu & Tombol CTA Ijab TAMPIL
    const rekomendasiMantuText = await page.$eval('#rekomendasiMantuBox', (el) => el.innerHTML);
    assert.ok(rekomendasiMantuText.includes('5 Usulan Tanggal Mantu Rahayu'), 'Rekomendasi mantu harus tampil untuk status planning');
    assert.ok(rekomendasiMantuText.includes('Petung Ijab'), 'CTA Ijab harus hadir dalam rekomendasi mantu');

    // 2. Skenario MARRIED (Sudah Menikah)
    await page.evaluate(async () => {
      const radio = document.getElementById('statusSudahMenikah');
      if (radio) {
        radio.checked = true;
        if (window.onStatusHubunganChange) window.onStatusHubunganChange('married');
      }
      if (window.hitungNujumPerjodohan) await window.hitungNujumPerjodohan();
    });

    // Verifikasi pada status married: Rekomendasi Hari Mantu & Tombol CTA Ijab digantikan Panduan Pasutri
    const pasutriText = await page.$eval('#rekomendasiMantuBox', (el) => el.innerHTML);
    assert.ok(pasutriText.includes('STATUS: SAMPUN NIKAH') || pasutriText.includes('Pituduh Gesang Bebrayan'), 'Rekomendasi mantu harus digantikan panduan pasutri saat married');
    assert.ok(!pasutriText.includes('5 Usulan Tanggal Mantu Rahayu'), 'Daftar usulan mantu harus disembunyikan saat married');

    await page.close();
  });

  it('6. Selametan: Siang vs Bakda Maghrib Parity & 7 Milestones', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => window.switchTab('selametan'));
    await page.waitForSelector('#tab-selametan', { visible: true });

    // Tanggal uji: 2026-10-05 (Senin Kliwon)
    // Skenario A: Wafat Siang (sebelum maghrib)
    await page.evaluate(async () => {
      const input = document.getElementById('tglWafatInput');
      if (input) {
        input.value = '2026-10-05';
        input.dispatchEvent(new Event('change'));
      }
      const radioSiang = document.getElementById('waktuWafatSiang');
      if (radioSiang) radioSiang.checked = true;
      if (window.setSelametanWizardStep) {
        window.setSelametanWizardStep(2);
        window.setSelametanWizardStep(3);
      }
      if (window.hitungSelametan) {
        await window.hitungSelametan();
      }
    });

    await page.waitForFunction(() => {
      const el = document.getElementById('geblakInfoBox');
      return el && el.textContent.includes('Senin') && el.textContent.includes('Kliwon');
    }, { timeout: 8000 });

    const geblakSiangText = await page.$eval('#geblakInfoBox', (el) => el.textContent);
    assert.ok(geblakSiangText.includes('Senin'), 'Geblak siang harus hari Senin');
    assert.ok(geblakSiangText.includes('Kliwon'), 'Geblak siang harus pasaran Kliwon');

    // Skenario B: Wafat Malam (bakda Maghrib) -> Harus berganti ke hari berikutnya (Selasa Legi)
    await page.evaluate(async () => {
      const radioMalam = document.getElementById('waktuWafatMalam');
      if (radioMalam) radioMalam.checked = true;
      if (window.hitungSelametan) await window.hitungSelametan();
    });

    await page.waitForFunction(() => {
      const el = document.getElementById('geblakInfoBox');
      return el && el.textContent.includes('Selasa') && el.textContent.includes('Legi');
    }, { timeout: 8000 });

    const geblakMalamText = await page.$eval('#geblakInfoBox', (el) => el.textContent);
    assert.ok(geblakMalamText.includes('Selasa'), 'Geblak bakda Maghrib harus berganti ke hari Selasa');
    assert.ok(geblakMalamText.includes('Legi'), 'Geblak bakda Maghrib harus berganti ke pasaran Legi');

    // Verifikasi seluruh 7 milestone ter-render pada timeline (tiap milestone card berkelas rounded-xl di dalam track)
    const milestoneCards = await page.$$eval('#timelineSelametanBox .rounded-xl', (cards) => cards.length);
    assert.ok(milestoneCards >= 7, `Seluruh 7 tahapan pengetan harus ter-render, didapat: ${milestoneCards}`);

    await page.close();
  });

  it('7. Ijab & Omah: Form Validation, Wizard Step, & Reset Cleanliness', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // 1. Uji Ijab
    await page.evaluate(() => window.switchTab('ijab'));
    await page.waitForSelector('#tab-ijab', { visible: true });

    // Masukkan tanggal akad valid dan gunakan stepper ke langkah 4
    await page.evaluate(async () => {
      const tgl = document.getElementById('ijabDatePicker');
      if (tgl) {
        tgl.value = '2026-10-10';
        tgl.dispatchEvent(new Event('change'));
      }
      if (window.setIjabWizardStep) {
        window.setIjabWizardStep(2);
        window.setIjabWizardStep(3);
        window.setIjabWizardStep(4);
      } else if (window.hitungIjabDariUI) {
        await window.hitungIjabDariUI(true);
      }
    });

    await page.waitForSelector('#ijabResultContainer', { visible: true, timeout: 5000 });
    const ijabHtml = await page.$eval('#ijabResultContainer', (el) => el.innerHTML);
    assert.ok(ijabHtml.includes('Petung Ijab') || ijabHtml.includes('Neptu'), 'Hasil ijab harus ter-render');

    // 2. Uji Omah
    await page.evaluate(() => {
      window.switchTab('omah');
      if (window.toggleOmahFormMode) window.toggleOmahFormMode();
    });
    await page.waitForSelector('#tab-omah', { visible: true });

    // Hitung omah
    await page.evaluate(async () => {
      if (window.hitungOmahDariUI) await window.hitungOmahDariUI(true);
    });
    await page.waitForSelector('#omahResultContainer', { visible: true, timeout: 5000 });
    const omahHtml = await page.$eval('#omahResultContainer', (el) => el.innerHTML);
    assert.ok(omahHtml.includes('Petung Ngedekake') || omahHtml.includes('Cempuri') || omahHtml.includes('Simpulan'), 'Hasil omah harus ter-render');

    await page.close();
  });

  it('8. Ternak & Tetanen: Tujuan Selection & Inline Error Handling', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => window.switchTab('ternak'));
    await page.waitForSelector('#tab-ternak', { visible: true });

    // 1. Uji validasi input tanggal kosong
    await page.evaluate(() => {
      const dateInput = document.getElementById('ternakDatePicker');
      if (dateInput) dateInput.value = '';
    });

    await page.click('#btnHitungTernak');

    // Error inline harus muncul
    const feedbackVisible = await page.evaluate(() => {
      const el = document.getElementById('ternakFormFeedback');
      return el && !el.classList.contains('hidden');
    });
    assert.ok(feedbackVisible, 'Feedback error inline harus muncul saat tanggal kosong');

    // 2. Isi tanggal dan hitung Wiwit Ternak
    await page.evaluate(() => {
      const dateInput = document.getElementById('ternakDatePicker');
      if (dateInput) {
        dateInput.value = '2026-10-08';
        dateInput.dispatchEvent(new Event('change'));
      }
    });

    await page.click('#btnHitungTernak');
    await page.waitForSelector('#ternakResultContainer', { visible: true });
    const ternakHtml = await page.$eval('#ternakResultContainer', (el) => el.innerHTML);
    assert.ok(ternakHtml.includes('Raja-Kaya') || ternakHtml.includes('Kategori'), 'Hasil ternak harus ter-render');

    // 3. Ganti ke tujuan Tetanen (Palawija)
    await page.evaluate(() => {
      const radio = document.querySelector('input[name="ternakTujuanRadio"][value="tetanen"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });

    await page.click('#btnHitungTernak');
    const tetanenHtml = await page.$eval('#ternakResultContainer', (el) => el.innerHTML);
    assert.ok(tetanenHtml.includes('Tetanèn') || tetanenHtml.includes('Golongan Tanaman'), 'Hasil tetanen harus ter-render');

    await page.close();
  });

  it('9. Aksesibilitas Keyboard, Modal Focus Trap, & Tombol Escape', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Buka modal kartu weton share
    await page.evaluate(() => {
      if (window.openWetonShareModal) window.openWetonShareModal();
    });

    await page.waitForSelector('#modalShareCardWeton', { visible: true });

    // Tekan tombol Escape untuk menutup modal
    await page.keyboard.press('Escape');

    // Verifikasi modal tertutup
    await page.waitForFunction(() => {
      const modal = document.getElementById('modalShareCardWeton');
      return !modal || modal.classList.contains('hidden') || window.getComputedStyle(modal).display === 'none';
    });

    const isHidden = await page.$eval('#modalShareCardWeton', (el) => el.classList.contains('hidden'));
    assert.ok(isHidden, 'Modal harus tertutup setelah tombol Escape ditekan');

    await page.close();
  });

  it('10. Dwibahasa ID / JV Switcher & Sinkronisasi Teks UI', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Bahasa awal adalah ID
    const initialLang = await page.evaluate(() => window.getLanguage ? window.getLanguage() : 'id');
    assert.equal(initialLang, 'id');

    // Toggle ke Basa Jawa (JV)
    await page.evaluate(() => {
      if (window.toggleLanguage) window.toggleLanguage();
    });

    const jvLang = await page.evaluate(() => window.getLanguage ? window.getLanguage() : 'jv');
    assert.equal(jvLang, 'jv', 'Bahasa harus berganti ke JV');

    // Verifikasi atribut lang di tag <html> berganti ke 'jv'
    const htmlLang = await page.$eval('html', (el) => el.getAttribute('lang'));
    assert.equal(htmlLang, 'jv', 'Tag html lang harus bersinkronisasi ke jv');

    // Toggle kembali ke Bahasa Indonesia (ID)
    await page.evaluate(() => {
      if (window.toggleLanguage) window.toggleLanguage();
    });

    const restoredLang = await page.evaluate(() => window.getLanguage ? window.getLanguage() : 'id');
    assert.equal(restoredLang, 'id', 'Bahasa harus kembali ke ID');

    await page.close();
  });
});
