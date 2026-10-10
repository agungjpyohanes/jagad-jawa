import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const port = 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = url.pathname;

  // 1. Static Assets Mapping
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(distDir, relativePath);

  // Jika file fisik ada di dist/
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Headers overrides according to _headers
    const headers = { 'Content-Type': contentType };
    if (pathname === '/sw.js') {
      headers['Content-Type'] = 'application/javascript; charset=utf-8';
      headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
    } else if (pathname === '/manifest.webmanifest') {
      headers['Content-Type'] = 'application/manifest+json; charset=utf-8';
      headers['Cache-Control'] = 'public, max-age=86400';
    } else if (pathname.startsWith('/data/') && pathname.endsWith('.json')) {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400';
    } else if (pathname.startsWith('/assets/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 2. File /data/*.json yang sengaja tidak ditemukan harus 404 (bukan SPA fallback HTML)
  if (pathname.startsWith('/data/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not Found', file: pathname.split('/').pop() }));
    return;
  }

  // 3. SPA Fallback HANYA untuk non-file requests (navigasi)
  if (!pathname.includes('.')) {
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(port, async () => {
  console.log(`🧪 Test Server running on port ${port}...`);

  let failures = 0;

  async function checkUrl(urlPath, validator) {
    try {
      const resp = await fetch(`http://localhost:${port}${urlPath}`);
      await validator(resp);
    } catch (err) {
      console.error(`❌ GAGAL pada ${urlPath}:`, err.message);
      failures++;
    }
  }

  // Uji 1: /sw.js harus 200 dan application/javascript
  await checkUrl('/sw.js', async (res) => {
    if (res.status !== 200) throw new Error(`Status bukan 200: ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/javascript')) throw new Error(`Content-Type bukan JS: ${ct}`);
    const cc = res.headers.get('cache-control') || '';
    if (!cc.includes('must-revalidate')) throw new Error(`Cache-Control sw.js harus must-revalidate: ${cc}`);
    const text = await res.text();
    if (text.includes('<!DOCTYPE html>') || text.includes('<html lang=')) throw new Error('sw.js tertukar dengan index.html SPA fallback!');
    console.log('✔ [TEST] /sw.js berstatus 200 dan ber-Content-Type application/javascript murni');
  });

  // Uji 2: /manifest.webmanifest harus 200 dan application/manifest+json atau application/json
  await checkUrl('/manifest.webmanifest', async (res) => {
    if (res.status !== 200) throw new Error(`Status bukan 200: ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) throw new Error(`Content-Type bukan JSON: ${ct}`);
    const json = await res.json();
    if (!json.name || !json.start_url) throw new Error('manifest.webmanifest tidak lengkap');
    console.log('✔ [TEST] /manifest.webmanifest berstatus 200 dan JSON valid');
  });

  // Uji 3: /data/*.json statis publik harus 200, application/json, dan Cache-Control revalidation
  await checkUrl('/data/01-kalender-constants.json', async (res) => {
    if (res.status !== 200) throw new Error(`Status bukan 200: ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`Content-Type bukan JSON: ${ct}`);
    const cc = res.headers.get('cache-control') || '';
    if (!cc.includes('stale-while-revalidate')) throw new Error(`Cache-Control harus stale-while-revalidate: ${cc}`);
    const json = await res.json();
    if (!json.nama_hari || !json.neptu_hari) throw new Error('Data kalender constants tidak valid');
    console.log('✔ [TEST] /data/01-kalender-constants.json berstatus 200, Content-Type JSON, dan revalidation header valid');
  });

  // Uji 4: /data/missing-file.json yang hilang harus 404 (bukan index.html SPA)
  await checkUrl('/data/99-file-tidak-ada.json', async (res) => {
    if (res.status !== 404) throw new Error(`Data hilang harus 404, didapat: ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`404 data harus JSON, bukan HTML! (${ct})`);
    console.log('✔ [TEST] /data/ missing file menghasilkan 404 JSON, tidak bocor ke index.html SPA fallback');
  });

  // Uji 5: Navigasi rute tanpa ekstensi (SPA) mendapat index.html
  await checkUrl('/kalender', async (res) => {
    if (res.status !== 200) throw new Error(`Status bukan 200: ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) throw new Error(`SPA fallback harus HTML: ${ct}`);
    const text = await res.text();
    if (!text.includes('<!DOCTYPE html>')) throw new Error('SPA fallback bukan index.html valid');
    console.log('✔ [TEST] Navigasi SPA rute mendapat fallback index.html');
  });

  server.close(() => {
    console.log(`\n───────────────────────────────────────────────`);
    if (failures === 0) {
      console.log('✅ SELURUH UJI STATIC ROUTING DIST SUKSES (100% PASS)');
      process.exit(0);
    } else {
      console.error(`❌ DITEMUKAN ${failures} KEGAGALAN UJI ROUTING DIST`);
      process.exit(1);
    }
  });
});
