/**
 * Jagad Jawa — Service Worker (PWA Offline Engine)
 * Branch: jawa-v2
 * 
 * Tanggung Jawab:
 * 1. Pre-caching application shell (HTML, CSS, Manifest, Ikon).
 * 2. Caching seluruh modul JS, engine, dan dataset nujum-matrix, kalender, pawukon.
 * 3. Menjamin kemampuan offline 100% untuk pembacaan weton, kalender, dan kalkulasi nujum
 *    dengan mengeksekusi fungsi lokal yang sama persis (zero formula change).
 */

const CACHE_NAME = 'jagad-jawa-v2-cache-v1';

// Daftar aset inti yang wajib di-precache saat instalasi
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './css/styles.css',

  // UI Core & Orchestrator
  './js/main.js',
  './js/ui/navigation.js',
  './js/ui/modal.js',
  './js/ui/toast.js',
  './js/ui/i18n.js',

  // Feature Wirings
  './js/features/kalender.js',
  './js/features/nujum.js',
  './js/features/jodoh.js',
  './js/features/selametan.js',
  './js/features/aksara.js',
  './js/features/wayang.js',
  './js/features/audio.js',

  // Domain Engine & UI Modules
  './js/modules/kalender/kalender-engine.js',
  './js/modules/kalender/kalender-ui.js',
  './js/modules/kalender/bookmark-service.js',
  './js/modules/kalender/share-card.js',
  './js/modules/nujum/nujum-engine.js',
  './js/modules/nujum/nujum-ui.js',
  './js/modules/wuku/wuku-engine.js',
  './js/modules/wuku/wuku-ui.js',
  './js/modules/jodoh/jodoh-engine.js',
  './js/modules/jodoh/jodoh-history.js',
  './js/modules/jodoh/jodoh-ui.js',
  './js/modules/selametan/selametan-engine.js',
  './js/modules/selametan/selametan-ui.js',
  './js/modules/aksara/aksara-engine.js',
  './js/modules/aksara/aksara-ui.js',
  './js/modules/wayang/wayang-engine.js',
  './js/modules/wayang/wayang-ui.js',
  './js/modules/audio/audio.js',
  './js/modules/pitutur/pitutur-ui.js',
  './js/modules/budaya/tripurusa.js',
  './js/modules/budaya/ensiklopedia-budaya.js',

  // Master Data & Pure Datasets (Vital untuk Offline Calculation)
  './js/data/calendar.js',
  './js/data/dino-rules.js',
  './js/data/nujum-matrix.js',
  './js/data/nujum-master-data.js',
  './js/data/nujum_database.js',
  './js/data/siklus-master-data.js',
  './js/data/karakter-pekerjaan-master-data.js',
  './js/data/shio-elemen-master-data.js',
  './js/data/pranata-zodiak-data.js',
  './js/data/sasi-jawa-master-data.js',
  './js/data/pawukon.js',
  './js/data/pawukon-dino-db.js',
  './js/data/personality.js',
  './js/data/marriage.js',
  './js/data/selametan.js',
  './js/data/aksara.js',
  './js/data/wayang.js',
  './js/data/pitutur.js',
  './js/data/tumpeng.js'
];

// 1. Install Event: Cache Core Static Shell & Data
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan penanganan per-file agar jika ada 1 aset opsional gagal, sisanya tetap ter-cache
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Lewati pre-cache (opsional):', url, err);
          })
        )
      );
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Bersihkan Cache Versi Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log('[SW] Menghapus cache lawas:', k);
            return caches.delete(k);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Stale-While-Revalidate untuk same-origin, Network-First fallback ke cache untuk CDN
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Jika navigasi halaman HTML (SPA navigation fallback ke index.html)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('./index.html') || caches.match('./');
      })
    );
    return;
  }

  // Same-origin assets: Cache-First dengan background revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return networkResponse;
        }).catch((err) => {
          // Jaringan offline, gunakan cachedResponse
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // External CDN (Tailwind, FontAwesome, Google Fonts, html2canvas):
  // Stale-While-Revalidate / Cache-First fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const respCopy = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, respCopy));
        }
        return response;
      }).catch(() => {
        // Jika offline dan belum ter-cache, kembalikan response kosong aman
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
