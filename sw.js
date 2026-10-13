/**
 * Jagad Jawa — Service Worker (PWA Offline Engine)
 * Versi: v6 (Cloudflare Pages Static JSON Architecture with Strict Validation)
 * 
 * Tanggung Jawab:
 * 1. Pre-caching core application shell (HTML, Web Manifest, App Icons).
 * 2. Caching dinamis runtime build bundle (/assets/*.js, /assets/*.css).
 * 3. Cache static JSON dataset (/data/*.json) HANYA untuk respons 200 OK yang valid, ber-Content-Type JSON,
 *    dan payload JSON ter-parse dengan benar tanpa format HTML SPA.
 * 4. Cache Versioning & Purge: Membersihkan seluruh cache lama saat update SW secara otomatis.
 * 5. Ketahanan Offline & Transparansi Status:
 *    - Menyajikan dataset tervalidasi jika offline dengan header X-Data-Stale & X-Data-Source.
 *    - Jika dataset belum pernah di-cache dan koneksi offline, mengembalikan 503 JSON terstruktur
 *      (bukan HTML SPA fallback), sehingga UI dapat menampilkan pesan error offline yang jujur & tombol retry.
 */

const SW_VERSION = 'v6';
const SHELL_CACHE_NAME = `jagad-jawa-shell-${SW_VERSION}`;
const DATA_CACHE_NAME = `jagad-jawa-data-${SW_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE_NAME, DATA_CACHE_NAME];

// Aset shell dasar yang di-precache saat instalasi
const PRECACHE_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './assets/icon.svg'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW ${SW_VERSION}] Lewati shell asset opsional:`, url, err);
          })
        )
      );
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Bersihkan Seluruh Cache Versi Lama Milik jagad-jawa-
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k.startsWith('jagad-jawa-') && !CURRENT_CACHES.includes(k))
          .map((k) => {
            console.log(`[SW ${SW_VERSION}] Menghapus cache lawas:`, k);
            return caches.delete(k);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // A. Navigasi SPA: Network-first dengan fallback ke index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('./index.html') || caches.match('./') || caches.match('/');
      })
    );
    return;
  }

  // B. Dataset JSON Statis (/data/*.json)
  if (url.pathname.includes('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          // Hanya cache jika HTTP 200 OK murni dan Content-Type adalah JSON
          if (networkResponse && networkResponse.status === 200) {
            const contentType = (networkResponse.headers.get('content-type') || '').toLowerCase();
            // Pastikan Content-Type menunjukkan JSON dan bukan respon HTML SPA fallback
            const isJsonContentType = contentType.includes('application/json') || contentType.includes('text/json');

            if (!isJsonContentType) {
              console.warn(`[SW ${SW_VERSION}] Content-Type untuk ${url.pathname} bukan JSON ("${contentType}"), lewati caching.`);
              return networkResponse;
            }

            try {
              const cloneForValidation = networkResponse.clone();
              const textContent = await cloneForValidation.text();
              const trimmed = textContent.trim();

              // Verifikasi integritas: tidak boleh diawali tag HTML <!DOCTYPE atau <html
              if (
                !trimmed.startsWith('<!DOCTYPE') &&
                !trimmed.startsWith('<!doctype') &&
                !trimmed.startsWith('<html') &&
                (trimmed.startsWith('{') || trimmed.startsWith('['))
              ) {
                const jsonCheck = JSON.parse(textContent);
                if (jsonCheck && typeof jsonCheck === 'object' && !jsonCheck.error) {
                  const headers = new Headers(networkResponse.headers);
                  headers.set('Content-Type', 'application/json; charset=utf-8');
                  headers.set('X-Data-Cached-At', String(Date.now()));
                  headers.set('X-Data-Cache-Version', DATA_CACHE_NAME);
                  headers.set('X-Data-Source', 'network-fresh');

                  const responseToCache = new Response(textContent, {
                    status: 200,
                    statusText: networkResponse.statusText,
                    headers
                  });

                  const cache = await caches.open(DATA_CACHE_NAME);
                  await cache.put(request, responseToCache);
                }
              } else {
                console.warn(`[SW ${SW_VERSION}] Payload untuk ${url.pathname} bukan format JSON valid, abaikan caching.`);
              }
            } catch (parseErr) {
              console.warn(`[SW ${SW_VERSION}] Respons bukan JSON valid, tidak disimpan ke cache:`, parseErr);
            }
            return networkResponse;
          }

          // Jika server merespons 404, 500, atau error HTTP lainnya,
          // kembalikan JSON error terstruktur jika server mengirimkan HTML
          const errContentType = networkResponse.headers.get('content-type') || '';
          if (errContentType.includes('text/html')) {
            return new Response(
              JSON.stringify({
                error: `HTTP ${networkResponse.status} Error`,
                message: `Berkas dataset ${url.pathname.split('/').pop()} gagal dimuat dari server.`,
                status: networkResponse.status,
                file: url.pathname.split('/').pop()
              }),
              {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'X-Error-Transformed': 'true'
                }
              }
            );
          }

          return networkResponse;
        })
        .catch(async () => {
          // Jaringan offline: Periksa apakah ada salinan tervalidasi di cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            // Berikan penanda header X-Data-Stale agar UI/app mengetahui ini data offline
            const headers = new Headers(cachedResponse.headers);
            headers.set('X-Data-Stale', 'true');
            headers.set('X-Data-Source', 'sw-offline-cache');
            return new Response(cachedResponse.body, {
              status: 200,
              statusText: 'OK (Offline Cache)',
              headers
            });
          }

          // Jika belum pernah tersimpan di cache, kembalikan response 503 JSON terstruktur (BUKAN index.html)
          return new Response(
            JSON.stringify({
              error: 'Offline - Dataset Belum Tersedia',
              message: 'Perangkat sedang offline dan dataset ini belum pernah diunduh sebelumnya. Silakan hubungkan kembali ke internet.',
              offline: true,
              file: url.pathname.split('/').pop()
            }),
            {
              status: 503,
              statusText: 'Service Unavailable (Offline)',
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Offline-Fallback': 'true'
              }
            }
          );
        })
    );
    return;
  }

  // C. Same-Origin Static Assets (/assets/*, CSS, JS, SVG, dll.)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(SHELL_CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // D. External CDN (Fonts, FontAwesome, jsPDF, dll.)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const respCopy = response.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => cache.put(request, respCopy));
          }
          return response;
        })
        .catch(() => {
          return new Response('', { status: 408, statusText: 'Request Timeout / Offline' });
        });
    })
  );
});
