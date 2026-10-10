import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

/**
 * tests/browser-jodoh-selametan.test.js
 * 
 * Pengujian Browser Lokal Interaksi Jodoh & Selametan:
 * 1. Alur Jodoh:
 *    - Validasi tanggal kedua belah pihak (wanita & pria).
 *    - Navigasi wizard langkah lanjut dan kembali (Langkah 1 -> 2 -> 3 -> 4).
 *    - Planning / engaged menampilkan bagian rekomendasi hari mantu yang tepat.
 *    - Status married tidak menampilkan rekomendasi mantu (menampilkan panduan pasutri).
 *    - Label dan antarmuka bahasa ID vs JV.
 *    - Output kalkulasi sesuai dengan golden baseline characterization (27 neptu, Sri, Lungguh).
 * 
 * 2. Alur Selametan:
 *    - Tanggal wafat wajib diisi (pemblokiran langkah jika kosong).
 *    - Waktu wafat (siang vs bakda Maghrib) wajib dipilih secara eksplisit.
 *    - Hasil 7 milestone muncul lengkap (geblak, 3 dino, 7 dino, 40 dino, 100 dino, pendak 1, pendak 2, nyewu).
 *    - Output kalkulasi sesuai baseline golden characterization (Jumat Pahing utk siang vs Sabtu Pon utk bakda Maghrib).
 *    - Edit/reset/perubahan tanggal/waktu tidak menyisakan data stale.
 *    - Pesan error dan tombol retry muncul saat file JSON data gagal dimuat (503 mock).
 */

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4201;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const DIST_DATA_DIR = path.join(DIST_DIR, 'data');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

let mockedErrorFiles = new Set();

function createTestServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, BASE_URL);
    const pathname = url.pathname;

    // 1. Data Statis: /data/<filename.json> dari dist/data/
    if (pathname.startsWith('/data/')) {
      const filename = pathname.replace(/^\/data\//, '');

      // Mock error untuk file tertentu jika diset
      if (mockedErrorFiles.has(filename)) {
        res.writeHead(503, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        });
        res.end(JSON.stringify({
          error: 'Service Unavailable',
          message: 'Simulasi error 503 untuk pengujian data-error-state',
          file: filename
        }));
        return;
      }

      const filePath = path.join(DIST_DATA_DIR, filename);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Not Found', filename }));
      return;
    }

    // 2. Berkas Statis dist/
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(DIST_DIR, safePath);

    if (pathname === '/') {
      filePath = path.join(DIST_DIR, 'index.html');
    }

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

    // 3. SPA Fallback
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

describe('Browser E2E Interaksi: Jodoh & Selametan (Harness Lokal + Baseline Preservasi)', () => {
  let server;
  let browser;

  before(async () => {
    assert.ok(fs.existsSync(DIST_DIR), 'Folder dist/ harus ada');
    assert.ok(fs.existsSync(DIST_DATA_DIR), 'Folder dist/data/ harus ada');
    assert.ok(fs.existsSync(CHROME_PATH), 'Executable Chrome lokal harus tersedia');

    server = createTestServer();
    await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

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

  // =========================================================================
  // ALUR 1: INTERAKSI PERJODOHAN (PITUNG JAWA 7 METODE & STATUS HUBUNGAN)
  // =========================================================================
  it('Alur Jodoh: Validasi tanggal, navigasi wizard, status planning/engaged vs married, bahasa ID/JV, dan golden baseline output', async () => {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // 1. Pindah ke tab Perjodohan
    await page.evaluate(() => {
      window.switchTab('perjodohan');
    });
    await page.waitForSelector('#tab-perjodohan', { visible: true });

    // Pastikan tab aktif
    const tabActive = await page.$eval('#tab-perjodohan', el => !el.classList.contains('hidden'));
    assert.equal(tabActive, true, 'Tab perjodohan harus aktif');

    // 2. Navigasi Wizard Langkah 1 -> 2 (Status Hubungan ke Data Wanita)
    const step1Ok = await page.evaluate(() => {
      return window.setJodohWizardStep(2, true);
    });
    assert.equal(step1Ok, true, 'Transisi Langkah 1 ke Langkah 2 harus sukses');

    // Coba lompat ke Langkah 3 tanpa mengisi tanggal wanita -> HARUS DITOLAK
    const step3Blocked = await page.evaluate(() => {
      return window.setJodohWizardStep(3, true);
    });
    assert.equal(step3Blocked, false, 'Harus memblokir ke Langkah 3 jika tanggal wanita belum diisi');

    // 3. Input Data Wanita: Kamis Legi (2024-02-29 adalah Kamis Legi: Neptu 13, aksara DA - JA)
    // Berdasarkan baseline: Dewi Sekartaji (Kamis Legi, Neptu 13)
    await page.evaluate(() => {
      const namaP = document.getElementById('namaP');
      if (namaP) namaP.value = 'Dewi Sekartaji';

      const tglP = document.getElementById('tglP');
      if (tglP) {
        tglP.value = '2024-02-29'; // Kamis Legi
        tglP.dispatchEvent(new Event('change'));
      }
      const akDP = document.getElementById('aksaraDepanP');
      if (akDP) akDP.value = 'DA';
      const akBP = document.getElementById('aksaraBelakangP');
      if (akBP) akBP.value = 'JA';
    });

    // Verifikasi neptu wanita terdeteksi 13
    await page.waitForFunction(() => {
      const b = document.getElementById('neptuPBadge');
      return b && b.textContent.trim() === '13';
    }, { timeout: 5000 });

    // Sekarang transisi ke Langkah 3 (Data Pria) -> HARUS DIIZINKAN
    const step3Allowed = await page.evaluate(() => {
      return window.setJodohWizardStep(3, true);
    });
    assert.equal(step3Allowed, true, 'Transisi ke Langkah 3 harus diizinkan setelah tanggal wanita diisi');

    // Coba lompat ke Langkah 4 tanpa mengisi tanggal pria -> HARUS DITOLAK
    const step4Blocked = await page.evaluate(() => {
      return window.setJodohWizardStep(4, true);
    });
    assert.equal(step4Blocked, false, 'Harus memblokir ke Langkah 4 jika tanggal pria belum diisi');

    // 4. Input Data Pria: Jumat Kliwon (2024-03-29 adalah Jumat Kliwon: Neptu 14, aksara PA - NGA)
    // Berdasarkan baseline: Panji Asmorobangun (Jumat Kliwon, Neptu 14)
    await page.evaluate(() => {
      const namaL = document.getElementById('namaL');
      if (namaL) namaL.value = 'Panji Asmorobangun';

      const tglL = document.getElementById('tglL');
      if (tglL) {
        tglL.value = '2024-03-29'; // Jumat Kliwon (6 + 8 = 14)
        tglL.dispatchEvent(new Event('change'));
      }
      if (typeof window.autoWetonPerjodohan === 'function') {
        window.autoWetonPerjodohan('L');
      }
      const akDL = document.getElementById('aksaraDepanL');
      if (akDL) akDL.value = 'PA';
      const akBL = document.getElementById('aksaraBelakangL');
      if (akBL) akBL.value = 'NGA';
    });

    // Verifikasi neptu pria terdeteksi 14
    await page.waitForFunction(() => {
      const b = document.getElementById('neptuLBadge');
      return b && b.textContent.trim() === '14';
    }, { timeout: 8000 });

    // 5. Verifikasi Navigasi Kembali Wizard (Langkah 3 -> 2 -> 1)
    const backTo2 = await page.evaluate(() => window.setJodohWizardStep(2, false));
    assert.equal(backTo2, true, 'Navigasi kembali ke langkah 2 harus sukses');
    const isStep2Visible = await page.evaluate(() => !document.getElementById('jodohStep1').classList.contains('hidden'));
    assert.equal(isStep2Visible, true, 'Container data wanita harus tampak saat di langkah 2');

    const backTo1 = await page.evaluate(() => window.setJodohWizardStep(1, false));
    assert.equal(backTo1, true, 'Navigasi kembali ke langkah 1 harus sukses');
    const isStep1Visible = await page.evaluate(() => !document.getElementById('jodohStepContainer1').classList.contains('hidden'));
    assert.equal(isStep1Visible, true, 'Container status hubungan harus tampak saat di langkah 1');

    // 6. Eksekusi Hitung Nujum Perjodohan (Status Planning / Calon Pengantin)
    await page.evaluate(async () => {
      const radioPlanning = document.getElementById('statusBelumMenikah');
      if (radioPlanning) {
        radioPlanning.checked = true;
        radioPlanning.dispatchEvent(new Event('change'));
      }
      await window.hitungNujumPerjodohan();
      window.setJodohWizardStep(4, false);
    });

    await page.waitForSelector('#hasilPerjodohanCard', { visible: true, timeout: 8000 });

    // Verifikasi Baseline Golden Output:
    // Total Neptu: 13 + 14 = 27
    const pairInfoText = await page.$eval('#perjodohanPairInfo', el => el.textContent);
    assert.ok(pairInfoText.includes('27'), `Total neptu harus 27 (aktual: ${pairInfoText})`);
    assert.ok(pairInfoText.includes('Dewi Sekartaji') && pairInfoText.includes('Panji Asmorobangun'), 'Nama kedua belah pihak harus tampil');

    // Verifikasi Baris 7 Metode (SRI & LUNGGUH) dari baseline
    const tabelHtml = await page.$eval('#hasilPerjodohanBody', el => el.innerHTML);
    assert.ok(tabelHtml.includes('SRI') || tabelHtml.includes('Sri'), 'Metode 1 harus memuat SRI');
    assert.ok(tabelHtml.includes('LUNGGUH') || tabelHtml.includes('Lungguh'), 'Metode 2 harus memuat LUNGGUH');

    // Status Planning: Kotak Rekomendasi Hari Mantu HARUS TAMPIL
    const mantuVisiblePlanning = await page.evaluate(() => {
      const box = document.getElementById('rekomendasiMantuBox');
      return box && (box.innerHTML.includes('Tanggal Mantu') || box.innerHTML.includes('PAWIWAHAN')) && !box.classList.contains('hidden');
    });
    assert.equal(mantuVisiblePlanning, true, 'Status planning harus menampilkan bagian rekomendasi hari mantu');

    // 7. Uji Status Engaged: Bagian Mantu Tetap Tampil
    await page.evaluate(() => {
      const radioEngaged = document.getElementById('statusEngaged');
      if (radioEngaged) {
        radioEngaged.checked = true;
        radioEngaged.dispatchEvent(new Event('change'));
      }
      if (window.onStatusHubunganChange) window.onStatusHubunganChange('engaged');
    });
    const mantuVisibleEngaged = await page.evaluate(() => {
      const box = document.getElementById('rekomendasiMantuBox');
      return box && (box.innerHTML.includes('Tanggal Mantu') || box.innerHTML.includes('PAWIWAHAN')) && !box.classList.contains('hidden');
    });
    assert.equal(mantuVisibleEngaged, true, 'Status engaged harus tetap menampilkan bagian rekomendasi mantu');

    // 8. Uji Status Married: Bagian Rekomendasi Mantu TIDAK BOLEH TAMPIL (Harus berganti panduan pasutri)
    await page.evaluate(() => {
      const radioMarried = document.getElementById('statusSudahMenikah');
      if (radioMarried) {
        radioMarried.checked = true;
        radioMarried.dispatchEvent(new Event('change'));
      }
      if (window.onStatusHubunganChange) window.onStatusHubunganChange('married');
    });
    const mantuVisibleMarried = await page.evaluate(() => {
      const box = document.getElementById('rekomendasiMantuBox');
      const hasMantu = box && box.innerHTML.includes('Rekomendasi Hari Baik Ijab & Mantu');
      const hasPasutri = box && (box.innerHTML.includes('Panduan Keharmonisan Rumah Tangga') || box.innerHTML.includes('Pasutri'));
      return { hasMantu, hasPasutri };
    });
    assert.equal(mantuVisibleMarried.hasMantu, false, 'Status married TIDAK BOLEH menampilkan rekomendasi hari mantu');
    assert.equal(mantuVisibleMarried.hasPasutri, true, 'Status married harus menampilkan panduan keharmonisan pasutri');

    // 9. Uji Bahasa Dwibahasa ID / JV
    // ID:
    const labelId = await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage('id');
      const el = document.querySelector('[data-i18n="jodoh_status_planning"]');
      return el ? el.textContent.trim() : '';
    });
    assert.equal(labelId, 'Rencana Menikah (Calon Pengantin)', 'Label ID harus Rencana Menikah (Calon Pengantin)');

    // JV:
    const labelJv = await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage('jv');
      const el = document.querySelector('[data-i18n="jodoh_status_planning"]');
      return el ? el.textContent.trim() : '';
    });
    assert.equal(labelJv, 'Rancangan Palakrama (Calon Pengantèn)', 'Label JV harus Rancangan Palakrama (Calon Pengantèn)');

    // Kembalikan ke id
    await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage('id');
    });

    await page.close();
  });

  // =========================================================================
  // ALUR 2: INTERAKSI SELAMETAN (PENGETAN TILAR DONYO & 7 MILESTONE)
  // =========================================================================
  it('Alur Selametan: Tanggal wafat wajib, waktu wafat eksplisit, 7 milestone golden output, no stale data on edit, dan pesan error/retry 503', async () => {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // 1. Pindah ke tab Selametan
    await page.evaluate(() => {
      window.switchTab('selametan');
    });
    await page.waitForSelector('#tab-selametan', { visible: true });

    // 2. Validasi Tanggal Wafat Wajib Diisi (Pemblokiran jika kosong)
    const step2Blocked = await page.evaluate(() => {
      const tgl = document.getElementById('tglWafatInput');
      if (tgl) tgl.value = '';
      return window.setSelametanWizardStep(2, true);
    });
    assert.equal(step2Blocked, false, 'Harus memblokir ke langkah 2 jika tanggal wafat kosong');

    // 3. Validasi Waktu Wafat Wajib Dipilih secara Eksplisit
    // Isi tanggal 2024-03-01 tetapi belum pilih radio waktu
    await page.evaluate(() => {
      const tgl = document.getElementById('tglWafatInput');
      if (tgl) tgl.value = '2024-03-01';

      // Pastikan radio tidak tercentang
      const radios = document.querySelectorAll('input[name="waktuWafatRadio"]');
      radios.forEach(r => { r.checked = false; });
    });

    // Langkah 1 ke 2 diizinkan karena tanggal sudah diisi
    const step2Allowed = await page.evaluate(() => {
      return window.setSelametanWizardStep(2, true);
    });
    assert.equal(step2Allowed, true, 'Langkah 2 harus diizinkan setelah tanggal diisi');

    // Coba lompat ke langkah 3 tanpa memilih waktu wafat -> HARUS DITOLAK
    const step3Blocked = await page.evaluate(() => {
      return window.setSelametanWizardStep(3, true);
    });
    assert.equal(step3Blocked, false, 'Harus memblokir ke langkah 3 jika radio waktu wafat belum dipilih eksplisit');

    // 4. Pengujian Golden Baseline: Wafat Siang (2024-03-01 Siang -> Jumat Pahing)
    await page.evaluate(async () => {
      const radioSiang = document.getElementById('waktuWafatSiang');
      if (radioSiang) radioSiang.checked = true;

      const namaEl = document.getElementById('namaAlmarhumInput');
      if (namaEl) namaEl.value = 'Eyang Broto';

      // Pastikan langkah 3 aktif
      window.applySelametanWizardStepUI(3);
      if (typeof window.hitungSelametan === 'function') {
        await window.hitungSelametan();
      }
    });

    await page.waitForFunction(() => {
      const box = document.getElementById('geblakInfoBox');
      return box && box.textContent.includes('Jumat Pahing');
    }, { timeout: 8000 });

    const geblakInfoSiang = await page.$eval('#geblakInfoBox', el => el.textContent);
    assert.ok(geblakInfoSiang.includes('Jumat Pahing'), `Wafat siang harus menghasilkan Jumat Pahing, aktual: ${geblakInfoSiang}`);
    assert.ok(geblakInfoSiang.includes('Eyang Broto'), 'Nama almarhum harus tampil pada info geblak');

    // Verifikasi 7 Milestone tampil lengkap pada visual timeline (7 pengetan + 1 geblak)
    const milestoneCardsSiang = await page.$$eval('#timelineSelametanBox [onclick*="simpanSelametanKeBookmark"]', els => els.length);
    assert.ok(milestoneCardsSiang >= 7, `Harus ada minimal 7 milestone pengetan, aktual: ${milestoneCardsSiang}`);

    // 5. Pengujian Edit & Reset (Mencegah Hasil Stale):
    // Ubah waktu wafat ke 'malam_maghrib' -> Sesuai baseline golden harus berganti ke Sabtu Pon
    await page.evaluate(async () => {
      // Kembali ke langkah 2
      window.setSelametanWizardStep(2, false);

      // Pilih radio bakda Maghrib
      const radioMalam = document.querySelector('input[name="waktuWafatRadio"][value="malam_maghrib"]');
      if (radioMalam) radioMalam.checked = true;

      // Hitung ulang dan terapkan langkah 3
      window.applySelametanWizardStepUI(3);
      await window.hitungSelametan();
    });

    const geblakInfoMalam = await page.$eval('#geblakInfoBox', el => el.textContent);
    assert.ok(geblakInfoMalam.includes('Sabtu Pon'), `Wafat bakda Maghrib harus langsung berganti ke Sabtu Pon tanpa data stale, aktual: ${geblakInfoMalam}`);
    assert.ok(!geblakInfoMalam.includes('Jumat Pahing'), 'Data lama Jumat Pahing tidak boleh tersisa');

    // 6. Pengujian Pesan Error & Retry Saat File JSON Data Gagal Dimuat (503 Mock)
    // Pasang mock kegagalan pada dataset selametan: 14-selametan-rules.json
    mockedErrorFiles.add('14-selametan-rules.json');

    await page.evaluate(async () => {
      // Invalidate cache memori internal dbLoader & browser caches
      if (window.dbLoader && typeof window.dbLoader.clearCache === 'function') {
        window.dbLoader.clearCache();
      }
      if (window.invalidateDomainData) {
        window.invalidateDomainData('selametan');
      }
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        for (const k of keys) {
          if (k.includes('data')) await caches.delete(k);
        }
      }

      // Hitung ulang yang akan memicu kegagalan pemuatan data
      await window.hitungSelametan();
    });

    await page.waitForFunction(() => {
      const el = document.querySelector('#tab-selametan .data-error-state');
      return Boolean(el);
    }, { timeout: 8000 }).catch(async (err) => {
      const dump = await page.evaluate(async () => {
        let loaded = null;
        try {
          loaded = await window.loadDomainData('selametan');
        } catch (e) {
          loaded = 'ERROR: ' + e.message;
        }
        return {
          geblakBoxHtml: document.getElementById('geblakInfoBox')?.innerHTML,
          loadedData: loaded,
          allErrors: Array.from(document.querySelectorAll('.data-error-state')).map(e => e.outerHTML)
        };
      });
      throw new Error(`Wait failed. Diagnostics: ${JSON.stringify(dump)}`);
    });

    const errorStateInfo = await page.evaluate(() => {
      const errEl = document.querySelector('#tab-selametan .data-error-state');
      const title = errEl?.querySelector('h4')?.textContent?.trim() || '';
      const retryBtn = errEl?.querySelector('.btn-retry-data');
      const alertRole = errEl?.getAttribute('role');
      return {
        hasAlertRole: alertRole === 'alert',
        title,
        hasRetryBtn: Boolean(retryBtn)
      };
    });

    assert.ok(errorStateInfo.hasAlertRole, 'Komponen error harus memiliki atribut role="alert"');
    assert.ok(errorStateInfo.hasRetryBtn, 'Komponen error harus menyediakan tombol Coba Lagi / Retry');
    assert.ok(
      errorStateInfo.title.includes('Gagal Memuat Data') || errorStateInfo.title.includes('Data Tradisi Dereng Kasil'),
      'Pesan error harus secara jelas mengindikasikan kegagalan pemuatan data'
    );

    // Bersihkan mock error
    mockedErrorFiles.delete('14-selametan-rules.json');

    // Uji Tombol Retry: Setelah mock dibersihkan, klik tombol retry via event handler pada tab selametan
    await page.evaluate(async () => {
      if (window.invalidateDomainData) {
        window.invalidateDomainData('selametan');
      }
      const retryBtn = document.querySelector('#tab-selametan .data-error-state .btn-retry-data');
      if (retryBtn) {
        retryBtn.click();
      }
      if (typeof window.hitungSelametan === 'function') {
        await window.hitungSelametan();
      }
    });

    await page.waitForFunction(() => {
      const geblakBox = document.getElementById('geblakInfoBox');
      const timelineBox = document.getElementById('timelineSelametanBox');
      const hasGeblak = Boolean(geblakBox && geblakBox.textContent.includes('Sabtu Pon'));
      const hasTimeline = Boolean(timelineBox && timelineBox.textContent.includes('Sabtu Pon'));
      const errorGone = !document.querySelector('#tab-selametan .data-error-state');
      return (hasGeblak || hasTimeline) && errorGone;
    }, { timeout: 8000 });

    const recoveredGeblak = await page.$eval('#geblakInfoBox', el => el.textContent);
    assert.ok(recoveredGeblak.includes('Sabtu Pon'), 'UI harus pulih menampilkan hasil setelah pemuatan data berhasil');

    await page.close();
  });
});
