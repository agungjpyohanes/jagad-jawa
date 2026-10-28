import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4208;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function createTestServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, BASE_URL);
    let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

describe('Sasmitha Alam Browser E2E - 6 Subtab Navigation & Complete Narratives', () => {
  let server;
  let browser;
  let page;

  before(async () => {
    server = createTestServer();
    await new Promise((resolve) => server.listen(PORT, resolve));
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('Navigasi ke Sasmitha dan memverifikasi seluruh 6 sub-menu berfungsi normal', async () => {
    await page.goto(`${BASE_URL}/#sasmitha`, { waitUntil: 'networkidle0' });

    // Tunggu kontainer sasmitha ter-render
    await page.waitForFunction(() => {
      const c = document.getElementById('sasmithaResultContainer');
      return c && c.children.length > 0;
    }, { timeout: 10000 });

    // 1. Subtab Impen
    const impenCards = await page.evaluate(() => {
      window.switchSasmithaSubtab('impen');
      const input = document.getElementById('impenSearchInput');
      return Boolean(input);
    });
    assert.ok(impenCards, 'Subtab Impen harus menampilkan input pencarian');

    // 2. Subtab Kedut
    const kedutView = await page.evaluate(() => {
      window.switchSasmithaSubtab('kedut');
      const spot = document.getElementById('anatomiSpotlightCard');
      return Boolean(spot);
    });
    assert.ok(kedutView, 'Subtab Kedut harus menampilkan bagan anatomi / spotlight card');

    // 3. Subtab Sasmitha Merapi
    const merapiView = await page.evaluate(() => {
      window.switchSasmithaSubtab('merapi');
      const content = document.getElementById('sasmithaDynamicContent');
      return content && content.innerText.includes('Sasmitha Erupsi & Arah Lahar Gunung Merapi') && content.innerText.includes('Larang Pangan');
    });
    assert.ok(merapiView, 'Subtab Sasmitha Merapi harus menampilkan 4 arah erupsi');

    // 4. Subtab Gerhana
    const gerhanaView = await page.evaluate(() => {
      window.switchSasmithaSubtab('gerhana');
      const content = document.getElementById('sasmithaDynamicContent');
      return content && content.innerText.includes('Gerhana Miturut Sasi Jawa') && content.innerText.includes('Ngalamat Gerhana');
    });
    assert.ok(gerhanaView, 'Subtab Gerhana harus menampilkan narasi gerhana 12 sasi');

    // 5. Subtab Lindu
    const linduView = await page.evaluate(() => {
      window.switchSasmithaSubtab('lindu');
      const content = document.getElementById('sasmithaDynamicContent');
      return content && content.innerText.includes('Sasmitha Lindu Miturut Sasi Jawa') && content.innerText.includes('BMKG');
    });
    assert.ok(linduView, 'Subtab Lindu harus menampilkan narasi lindu dan disclaimer BMKG');

    // 6. Subtab Tejo
    const tejoView = await page.evaluate(() => {
      window.switchSasmithaSubtab('tejo');
      const content = document.getElementById('sasmithaDynamicContent');
      return content && content.innerText.includes('Sasmitha Tejo ing Awang-awang') && content.innerText.includes('Madhep Wetan');
    });
    assert.ok(tejoView, 'Subtab Tejo harus menampilkan 7 kartu arah kiblat');
  });
});
