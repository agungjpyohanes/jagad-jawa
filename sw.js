/**
 * Jagad Jawa — Service Worker (PWA Offline Engine)
 * Versi: v3 (Branch: jawa-v11)
 * 
 * Tanggung Jawab:
 * 1. Pre-caching application shell (HTML, CSS, Manifest, Ikon).
 * 2. Caching seluruh modul JS, domain engine baru (sapa-dina, omah, sinengker, pustaka, dll.).
 * 3. Pre-caching database JSON di folder public/data/ dan aset audio/ilustrasi wayang.
 * 4. Menjamin kemampuan offline 100% untuk seluruh modul budaya Nusantara.
 */

const CACHE_NAME = 'jagad-jawa-v3';

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
  './js/ui/mode.js',
  './js/services/dbLoader.js',

  // Feature Wirings
  './js/features/kalender.js',
  './js/features/nujum.js',
  './js/features/jodoh.js',
  './js/features/selametan.js',
  './js/features/aksara.js',
  './js/features/wayang.js',
  './js/features/audio.js',

  // Domain Engine & UI Modules (Lengkap termasuk modul-modul baru)
  './js/modules/kalender/kalender-engine.js',
  './js/modules/kalender/kalender-ui.js',
  './js/modules/kalender/bookmark-service.js',
  './js/modules/kalender/share-card.js',
  './js/modules/kalender/konversi-tanggal.js',
  './js/modules/nujum/nujum-engine.js',
  './js/modules/nujum/nujum-ui.js',
  './js/modules/wuku/wuku-engine.js',
  './js/modules/wuku/wuku-ui.js',
  './js/modules/jodoh/jodoh-engine.js',
  './js/modules/jodoh/jodoh-history.js',
  './js/modules/jodoh/jodoh-ui.js',
  './js/modules/selametan/selametan-engine.js',
  './js/modules/selametan/selametan-ui.js',
  './js/modules/ijab/ijab-engine.js',
  './js/modules/ijab/ijab-ui.js',
  './js/modules/omah/omah-engine.js',
  './js/modules/omah/omah-ui.js',
  './js/modules/petung-kehidupan/petung-kehidupan-engine.js',
  './js/modules/petung-kehidupan/petung-kehidupan-ui.js',
  './js/modules/sapa-dina/sapa-dina-engine.js',
  './js/modules/sapa-dina/sapa-dina-ui.js',
  './js/modules/sasmitha/sasmitha-engine.js',
  './js/modules/sasmitha/sasmitha-ui.js',
  './js/modules/pustaka/pustaka-engine.js',
  './js/modules/pustaka/pustaka-ui.js',
  './js/modules/sinengker/sinengker-engine.js',
  './js/modules/sinengker/sinengker-ui.js',
  './js/modules/aksara/aksara-engine.js',
  './js/modules/aksara/aksara-ui.js',
  './js/modules/wayang/wayang-engine.js',
  './js/modules/wayang/wayang-ui.js',
  './js/modules/audio/audio.js',
  './js/modules/pitutur/pitutur-ui.js',
  './js/modules/budaya/tripurusa.js',
  './js/modules/budaya/padewan-ui.js',
  './js/modules/budaya/ensiklopedia-budaya.js',

  // Master Data & Fallback Scripts
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
  './js/data/tumpeng.js',
  './js/data/ijab-db.js',
  './js/data/omah-db.js',
  './js/data/petung-ternak-loro-geblak.js',
  './js/data/petung-tetanen-db.js',
  './js/data/sasmitha-db.js',
  './js/data/wuku-petenget-db.js',
  './js/data/pustaka-dongo-db.js',
  './js/data/pustaka-jawa-db.js',
  './js/data/sinengker-db.js',

  // Database JSON Files (public/data/)
  './data/01-kalender-constants.json',
  './data/02-wuku-ensiklopedia.json',
  './data/03-bincil-arti.json',
  './data/04-dino-rules.json',
  './data/05-pranata-mangsa.json',
  './data/06-bincil-matrix-bilingual.json',
  './data/07-zodiak-bilingual.json',
  './data/08-sasi-jawa-bilingual.json',
  './data/09-shio-wuxing-bilingual.json',
  './data/10-pasaran-watak-bilingual.json',
  './data/11-pitung-perjodohan-bilingual.json',
  './data/12-karakter-dasar-bilingual.json',
  './data/13-pekerjaan-weton-bilingual.json',
  './data/14-selametan-rules.json',
  './data/15-ijab-bilingual.json',
  './data/16-pitung-perjodohan.json',
  './data/17-aksara-perjodohan.json',
  './data/18-selametan-rules.json',
  './data/19-ijab.json',
  './data/20-sasmitha.json',
  './data/21-petung-tetanen-bilingual.json',
  './data/22-petung-ternak-bilingual.json',
  './data/23-omah-bilingual.json',
  './data/24-wuku-petenget-bilingual.json',
  './data/25-siklus-padewan-bilingual.json',
  './data/26-palenggahan-bilingual.json',
  './data/27-bincil-arti-bilingual.json',
  './data/28-marriage-hasil-bilingual.json',
  './data/29-sasi-jawa-bilingual.json',
  './data/30-aksara-nglegena-bilingual.json',
  './data/31-dino-gede-bilingual.json',
  './data/32-dino-sirikan-adhep-bilingual.json',
  './data/33-kamus-jawa.json',
  './data/34-kamus-sansakerta.json',
  './data/35-pustaka-dongo.json',
  './data/36-pustaka-jawa.json',
  './data/37-sinengker-khusus.json',

  // Audio & Core Illustrations
  './assets/audio/puspowarno.mp3',
  './assets/illustrations/gunungan_tripurusa.jpeg',
  './assets/illustrations/kompas_danyang.jpg',
  './assets/illustrations/tumpeng_tumbak rojo_ilustrasi.jpeg',

  // Wayang Illustrations (25 Karakter Wayang Kulit)
  './assets/illustrations/wayang/abimanyu.png',
  './assets/illustrations/wayang/antareja.png',
  './assets/illustrations/wayang/antasena.png',
  './assets/illustrations/wayang/arjuna.png',
  './assets/illustrations/wayang/bagong.png',
  './assets/illustrations/wayang/batara_bayu.png',
  './assets/illustrations/wayang/batara_guru.png',
  './assets/illustrations/wayang/batara_indra.png',
  './assets/illustrations/wayang/batara_kala.png',
  './assets/illustrations/wayang/batara_kamajaya.png',
  './assets/illustrations/wayang/batara_narada.png',
  './assets/illustrations/wayang/batara_surya.png',
  './assets/illustrations/wayang/batara_wisnu.png',
  './assets/illustrations/wayang/batari_durga.png',
  './assets/illustrations/wayang/bima.png',
  './assets/illustrations/wayang/gareng.png',
  './assets/illustrations/wayang/gatotkaca.png',
  './assets/illustrations/wayang/gunungan.png',
  './assets/illustrations/wayang/irawan.png',
  './assets/illustrations/wayang/nakula.png',
  './assets/illustrations/wayang/petruk.png',
  './assets/illustrations/wayang/puntadewa.png',
  './assets/illustrations/wayang/sadewa.png',
  './assets/illustrations/wayang/semar.png',
  './assets/illustrations/wayang/wisanggeni.png'
];

// 1. Install Event: Cache Core Static Shell, Modules, JSON Data & Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan penanganan per-file agar jika ada 1 aset opsional gagal, sisanya tetap ter-cache
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW v3] Lewati pre-cache (opsional):', url, err);
          })
        )
      );
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Bersihkan Seluruh Cache Versi Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log('[SW v3] Menghapus cache lawas:', k);
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

  // External CDN (FontAwesome, Google Fonts, html2canvas, jsPDF):
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
