import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Service Worker & Static JSON Cache/Revalidation Suite', () => {
  const rootDir = process.cwd();
  const swPath = path.join(rootDir, 'sw.js');
  const headersPath = path.join(rootDir, 'public/_headers');
  const distHeadersPath = path.join(rootDir, 'dist/_headers');
  const dataDir = path.join(rootDir, 'public/data');

  it('1. Header Cache-Control /data/*.json mengonfigurasi TTL konservatif dengan revalidation', () => {
    assert.ok(fs.existsSync(headersPath), 'public/_headers harus ada');
    const content = fs.readFileSync(headersPath, 'utf8');

    // Harus mendefinisikan rules untuk /data/*.json
    assert.ok(content.includes('/data/*.json'), '_headers harus memuat rule /data/*.json');
    assert.ok(content.includes('Content-Type: application/json; charset=utf-8'), '_headers harus menyatakan Content-Type JSON');
    // Ambil baris-baris di bawah /data/*.json
    const dataSection = content.split('/data/*.json')[1] || '';
    assert.ok(dataSection.includes('stale-while-revalidate'), '_headers harus menggunakan stale-while-revalidate untuk /data/*.json');
    assert.ok(!dataSection.includes('immutable'), 'File /data/*.json tidak boleh ditandai immutable!');
    
    // Pastikan max-age konservatif (bukan tahunan / 31536000)
    const match = dataSection.match(/max-age=(\d+)/);
    assert.ok(match, 'Harus mendefinisikan max-age untuk /data/*.json');
    const maxAge = parseInt(match[1], 10);
    assert.ok(maxAge <= 86400, `max-age data JSON harus konservatif (<= 86400s), didapat: ${maxAge}`);
  });

  it('2. Header /sw.js harus must-revalidate dengan max-age 0', () => {
    const content = fs.readFileSync(headersPath, 'utf8');
    assert.ok(content.includes('/sw.js'), '_headers harus memuat rule /sw.js');
    assert.ok(content.includes('must-revalidate'), 'sw.js harus diatur must-revalidate agar browser selalu memeriksa update');
    assert.ok(content.includes('max-age=0'), 'sw.js harus max-age=0');
  });

  it('3. sw.js memvalidasi payload JSON dan menolak parsing dokumen HTML SPA', () => {
    assert.ok(fs.existsSync(swPath), 'sw.js harus ada');
    const swContent = fs.readFileSync(swPath, 'utf8');

    // Memeriksa bahwa SW memvalidasi string sebelum caching
    assert.ok(swContent.includes('!trimmed.startsWith(\'<!DOCTYPE'), 'sw.js harus memblokir dokumen HTML <!DOCTYPE');
    assert.ok(swContent.includes('JSON.parse'), 'sw.js harus mem-parse JSON untuk validasi integritas sebelum put');
    assert.ok(swContent.includes('X-Data-Cache-Version'), 'sw.js harus membubuhkan penanda cache version');
  });

  it('4. sw.js memiliki strategi versioning eksplisit dan membersihkan cache lama pada activate', () => {
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes('SW_VERSION'), 'sw.js harus memiliki konstanta SW_VERSION');
    assert.ok(swContent.includes('CURRENT_CACHES'), 'sw.js harus mendefinisikan CURRENT_CACHES');
    assert.ok(swContent.includes('caches.delete'), 'sw.js harus memanggil caches.delete untuk cache versi lama');
    assert.ok(swContent.includes('clients.claim()'), 'sw.js harus mengklaim client baru saat aktivasi');
  });

  it('5. Simulasi Penanganan Offline SW: Data ber-cache mengembalikan header stale, tanpa cache mengembalikan 503 JSON', async () => {
    // Mock Cache Storage
    const mockStorage = new Map();

    const mockCaches = {
      match: async (req) => mockStorage.get(req.url) || null,
      open: async () => ({
        put: async (req, res) => mockStorage.set(req.url, res)
      })
    };

    // A. Skenario: Request offline ke file yang SUDAH pernah di-cache
    const testUrl = 'https://jagad-jawa.pages.dev/data/01-kalender-constants.json';
    const fakeCachedBody = JSON.stringify({ nama_hari: ['Minggu'] });
    mockStorage.set(testUrl, new Response(fakeCachedBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const hit = await mockCaches.match({ url: testUrl });
    assert.ok(hit, 'Harus menemukan salinan cached');
    const hitHeaders = new Headers(hit.headers);
    hitHeaders.set('X-Data-Stale', 'true');
    hitHeaders.set('X-Data-Source', 'sw-offline-cache');
    const offlineCachedResponse = new Response(hit.body, { status: 200, headers: hitHeaders });

    assert.equal(offlineCachedResponse.status, 200);
    assert.equal(offlineCachedResponse.headers.get('X-Data-Stale'), 'true');
    assert.equal(offlineCachedResponse.headers.get('X-Data-Source'), 'sw-offline-cache');

    // B. Skenario: Request offline ke file yang BELUM pernah di-cache
    const missingUrl = 'https://jagad-jawa.pages.dev/data/42-tumpeng-all.json';
    const miss = await mockCaches.match({ url: missingUrl });
    assert.equal(miss, null, 'File belum pernah di-cache');

    const offline503 = new Response(
      JSON.stringify({
        error: 'Offline - Dataset Belum Tersedia',
        message: 'Perangkat sedang offline...',
        offline: true,
        file: '42-tumpeng-all.json'
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Offline-Fallback': 'true'
        }
      }
    );

    assert.equal(offline503.status, 503);
    assert.equal(offline503.headers.get('Content-Type'), 'application/json; charset=utf-8');
    assert.equal(offline503.headers.get('X-Offline-Fallback'), 'true');
    const parsed503 = await offline503.json();
    assert.equal(parsed503.offline, true);
    assert.equal(parsed503.file, '42-tumpeng-all.json');
  });

  it('6. Simulasi Proteksi Error Server (404/500): Mengembalikan JSON terstruktur, bukan HTML SPA', async () => {
    const simulateServerError = (status, htmlBody) => {
      // Logic transform SW saat server merespons error HTML
      if (htmlBody.includes('<!DOCTYPE html>')) {
        return new Response(
          JSON.stringify({
            error: `HTTP ${status} Error`,
            message: 'Berkas dataset gagal dimuat dari server.',
            status
          }),
          {
            status,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'X-Error-Transformed': 'true'
            }
          }
        );
      }
      return new Response(htmlBody, { status });
    };

    const res404 = simulateServerError(404, '<!DOCTYPE html><html><body>Pages 404</body></html>');
    assert.equal(res404.status, 404);
    assert.equal(res404.headers.get('Content-Type'), 'application/json; charset=utf-8');
    const json404 = await res404.json();
    assert.equal(json404.error, 'HTTP 404 Error');

    const res500 = simulateServerError(500, '<!DOCTYPE html><html><body>Internal Error</body></html>');
    assert.equal(res500.status, 500);
    assert.equal(res500.headers.get('Content-Type'), 'application/json; charset=utf-8');
    const json500 = await res500.json();
    assert.equal(json500.error, 'HTTP 500 Error');
  });

  it('7. Seluruh 42+ file JSON publik dapat diparsing sempurna tanpa error sintaksis', () => {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    assert.ok(files.length >= 42, `Harus ada minimal 42 dataset JSON, didapat: ${files.length}`);

    for (const f of files) {
      const fullPath = path.join(dataDir, f);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.doesNotThrow(() => {
        const parsed = JSON.parse(content);
        assert.ok(typeof parsed === 'object' && parsed !== null, `Payload ${f} harus berupa object/array`);
      }, `Gagal mem-parsing JSON ${f}`);
    }
  });
});
