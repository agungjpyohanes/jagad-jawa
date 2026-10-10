# Inventaris Sumber Data Runtime Jagad Jawa & Status Migrasi KV

Dokumen ini mencatat analisis mendalam untuk **SETIAP** modul data JavaScript (`js/data/*.js`) dan berkas JSON (`public/data/*.json`), memetakan status konsumsi runtime, klasifikasi teknis, canonical KV key, dan transparansi arsitektural.

---

## 1. Klasifikasi Arsitektur

- **Kategori A — Data Lookup / Konten Runtime (Target KV):** Data tabel, matriks, teks naratif, kamus, aturan pengetan yang murni data (tidak mengandung logika/fungsi).
- **Kategori B — Logika / Engine / Normalizer / Helper (Tetap di JavaScript):** Modul yang berisi algoritme murni, matematika astronomi, rumus modulo, SVG path resolver, transliterasi regex, atau komponen UI.
- **Kategori C — Stand-Alone Cultural Dataset (Supplemental Candidate KV):** Dataset kultural yang awalnya berupa modul JS mandiri tetapi telah dibuatkan JSON murni dan manifest canonical key untuk KV.
- **Kategori D — Modul Legacy / Unreferenced:** Modul lama yang tidak lagi diimpor atau dikonsumsi oleh runtime produksi maupun test suite.

---

## 2. Inventaris Lengkap Seluruh Modul di `js/data/*.js` (33 File)

| No | File Path | Ukuran (Bytes) | Klasifikasi | Deskripsi Isi & Konsumen Runtime | Canonical KV Key Terkait | Status Runtime Aktual & Posisi Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `js/data/aksara.js` | 10,926 | **B (Engine)** | Mesin transliterasi Latin <-> Hanacaraka, regex pasangan, sandhangan. Dikonsumsi `aksara-engine.js`. | `aksara:nglegena` (glif data) | **Tetap di ESM JS**. Algoritme parsing regex murni. Glif referensi tersedia di KV `aksara:nglegena`. |
| 2 | `js/data/calendar.js` | 27,745 | **B (Engine)** | Algoritme JDN, epoch, rumus modulo, kabisat. Dikonsumsi `kalender-engine.js`, `ux-enhancements.js`. | `kalender:constants` | **Tetap di ESM JS**. Konstanta kalender di memori tetap aktif sebagai fallback resilience jika fetch KV offline. |
| 3 | `js/data/dewa-kanon.js` | 28,762 | **B (Asset Helper)** | Resolver path ilustrasi lokal (`illustrationPath`, `resolveWukuDewa`). Dikonsumsi `wuku-engine.js`, `kalender-ui.js`, `nujum-ui.js`. | Pages Assets (`assets/illustrations/`) | **Tetap di ESM JS**. Merupakan resolver path file SVG/PNG pada Pages Static Assets. |
| 4 | `js/data/dino-rules.js` | 14,099 | **D (Legacy)** | Tabel Dino Gede dan Dino Ijo versi awal. Tidak lagi diimpor langsung oleh runtime mana pun. | `dino:rules`, `dino:gede` | **Legacy Inactive**. Data runtime aktif dilayani oleh `dino:rules` dan `dino:gede`. |
| 5 | `js/data/ijab-db.js` | 22,729 | **A (Data Lookup)** | Database neptu ijab khusus, surasa, petung pernikahan ijab. Dikonsumsi `ijab-engine.js`, `ijab-ui.js`. | `ijab:all` (`15-ijab-bilingual.json`) | **Remote KV Live**. `loadDomainData('ijab')` membaca KV. Fallback JS tetap terbundel di bundle frontend. |
| 6 | `js/data/karakter-pekerjaan-master-data.js` | 42,866 | **A (Data Lookup)** | Data watak 35 weton, palenggahan 5 kedudukan, pekerjaan weton. Dikonsumsi `nujum-ui.js`. | `karakter:dasar`, `pekerjaan:weton`, `palenggahan:all` | **Remote KV Live**. Dimuat via `loadDomainData('nujum')`. Fallback JS terbundel. |
| 7 | `js/data/kawruh-boso.js` | 15,359 | **B (UI Component)** | Kamus interaktif UI dan render tab Kawruh Basa. | `kamus:jawa` | **Tetap di ESM JS**. Kode interaksi DOM. Data kosakata dibaca dari KV `kamus:jawa`. |
| 8 | `js/data/marriage.js` | 4,523 | **A (Data Lookup)** | Tabel hasil 6 metode pitung jodoh tradisional. Dikonsumsi `jodoh-engine.js`. | `perjodohan:pitung` (`11-pitung-perjodohan-bilingual.json`) | **Remote KV Live**. `jodoh-engine.js` disuntikkan data via `loadDomainData('jodoh')`. Fallback JS terbundel. |
| 9 | `js/data/mitologi-nusantara-db.js` | 21,923 | **C (Supplemental)** | Narasi lengkap babad Watugunung, 30 Wuku, Aji Saka, filosofi. Dikonsumsi `mitologi-ui.js`. | `mitologi:all` (`40-mitologi-all.json`) | **Lokal Siap (Pending Upload Remote)**. Fallback JS masih menjadi sumber data utama di production saat ini. |
| 10 | `js/data/nujum-master-data.js` | 3,327 | **D (Legacy)** | Definisi bincil ringkas lama. Tidak diimpor oleh runtime. | `bincil:arti` | **Legacy Inactive**. Digantikan oleh `bincil:arti` dan `bincil:matrix`. |
| 11 | `js/data/nujum-matrix.js` | 201,937 | **A (Data Lookup)** | Matriks 210 weton x wuku nujum kepribadian. Dikonsumsi `nujum-engine.js`. | `bincil:matrix` (`06-bincil-matrix-bilingual.json`) | **Remote KV Live**. `loadDomainData('nujum')` membaca KV. Fallback JS (201 KB) masih ada di bundle untuk ketahanan offline. |
| 12 | `js/data/nujum_database.js` | 2,398 | **D (Legacy)** | Array nama weton lama. Tidak diimpor oleh runtime aktif. | `kalender:constants` | **Legacy Inactive**. Tidak ada dependensi runtime aktif. |
| 13 | `js/data/omah-db.js` | 18,035 | **A (Data Lookup)** | Aturan petung omah (A, B, C), boyongan arah, cempuri lawangan. Dikonsumsi `omah-engine.js`, `omah-ui.js`. | `omah:all` (`23-omah-bilingual.json`) | **Remote KV Live**. `loadDomainData('omah')` membaca KV. Fallback JS terbundel. |
| 14 | `js/data/pawukon-dino-db.js` | 14,605 | **D (Legacy)** | Tabel pawukon alternatif lama. Tidak diimpor oleh runtime. | `wuku:ensiklopedia` | **Legacy Inactive**. Digantikan oleh `02-wuku-ensiklopedia.json`. |
| 15 | `js/data/pawukon.js` | 33,706 | **A (Data Lookup)** | 30 wuku pawukon lengkap, makna, radite hingga tumpak. Dikonsumsi `pawukon`, `wuku-engine.js`. | `wuku:ensiklopedia` (`02-wuku-ensiklopedia.json`) | **Remote KV Live**. `loadDomainData('wuku')` membaca KV. Fallback JS terbundel. |
| 16 | `js/data/personality.js` | 24,954 | **B (Engine / Formula)** | Algoritme ramalan Faalakiah, hitung nabi per nama aksara, tolak balak. Dikonsumsi `nujum-engine.js`. | Murni Algoritme JS | **Tetap di ESM JS**. Perhitungan Faalakiah adalah logika murni yang terikat rumus tradisi. |
| 17 | `js/data/petung-ternak-loro-geblak.js` | 95,281 | **A (Data Lookup)** | 35 weton petung ternak, loro, dan geblak. Dikonsumsi `petung-kehidupan-engine.js`. | `petung:ternak` (`22-petung-ternak-bilingual.json`) | **Remote KV Live**. `loadDomainData('petung-kehidupan')` membaca KV. Fallback JS terbundel. |
| 18 | `js/data/petung-tetanen-db.js` | 19,523 | **A (Data Lookup)** | Database 35 weton 4 pilar tanaman. Dikonsumsi `kalender-ui.js`, `sapa-dina-engine.js`. | `petung:tetanen` (`21-petung-tetanen-bilingual.json`) | **Remote KV Live**. Mendukung data injection KV via `loadDomainData('sapa-dina')`. Fallback JS terbundel. |
| 19 | `js/data/pitutur.js` | 19,836 | **C (Supplemental)** | Bank 30+ pitutur luhur dwibahasa & bank soal kuis budaya. Dikonsumsi `pitutur-ui.js`. | `pitutur:all` (`39-pitutur-all.json`) | **Lokal Siap (Pending Upload Remote)**. Fallback JS masih menjadi sumber data utama di production saat ini. |
| 20 | `js/data/pranata-zodiak-data.js` | 13,905 | **A (Data Lookup)** | Karakteristik 12 Zodiak Barat & penanggalan Pranata Mangsa. Dikonsumsi `nujum-ui.js`. | `zodiak:all`, `pranata:mangsa` | **Remote KV Live**. Dibaca dari KV API via `loadDomainData('nujum')`. Fallback JS terbundel. |
| 21 | `js/data/pustaka-db.js` | 42,176 | **A (Data Lookup)** | Kumpulan 12 doa tradisi (dongo), rajah, mantra. Dikonsumsi `pustaka-engine.js`. | `pustaka:dongo` (`35-pustaka-dongo.json`) | **Remote KV Live**. `loadDomainData('pustaka')` membaca KV. Fallback JS terbundel. |
| 22 | `js/data/pustaka-digital-db.js` | 27,294 | **C (Supplemental)** | Naskah kuno (Wedhatama, Kalatidha, Wulangreh, dll.). Dikonsumsi `pustaka-engine.js`. | `pustaka:digital` (`41-pustaka-digital.json`) | **Lokal Siap (Pending Upload Remote)**. Fallback JS masih menjadi sumber data utama di production saat ini. |
| 23 | `js/data/pustaka-jawa-db.js` | 12,397 | **A (Data Lookup)** | Piwulang luhur, 10 resep usada herbal, rajah Kalacakra. Dikonsumsi `pustaka-ui.js`. | `pustaka:jawa` (`36-pustaka-jawa.json`) | **Remote KV Live**. Dibaca via `loadDomainData('pustaka')`. Fallback JS terbundel. |
| 24 | `js/data/sasi-jawa-master-data.js` | 4,980 | **A (Data Lookup)** | Karakteristik 12 sasi kalender Sultan Agungan. Dikonsumsi `nujum-ui.js`. | `sasi:jawa` (`08-sasi-jawa-bilingual.json`) | **Remote KV Live**. Dibaca via `loadDomainData('nujum')`. Fallback JS terbundel. |
| 25 | `js/data/sasmitha-db.js` | 31,177 | **A (Data Lookup)** | Tafsir 6 pertanda alam (impen, kedut, gerhana, lindu, tejo). Dikonsumsi `sasmitha-engine.js`, `sasmitha-ui.js`. | `sasmitha:all` (`20-sasmitha.json`) | **Remote KV Live**. Dibaca via `loadDomainData('sasmitha')`. Fallback JS terbundel. |
| 26 | `js/data/selametan.js` | 1,358 | **A (Data Lookup)** | Rule target hari pengetan wafat 7 tahapan. Dikonsumsi `selametan-engine.js`. | `selametan:rules` (`14-selametan-rules.json`) | **Remote KV Live**. `selametan-engine.js` disuntikkan data via `loadDomainData('selametan')`. Fallback JS terbundel. |
| 27 | `js/data/shio-elemen-master-data.js` | 8,467 | **A (Data Lookup)** | Karakter 12 shio & siklus 5 elemen Wu Xing. Dikonsumsi `nujum-ui.js`. | `shio:wuxing` (`09-shio-wuxing-bilingual.json`) | **Remote KV Live**. Dibaca via `loadDomainData('nujum')`. Fallback JS terbundel. |
| 28 | `js/data/shio-wuxing-art.js` | 20,636 | **B (UI Generator)** | Generator SVG interaktif untuk simbol elemen Wu Xing & Shio. | Murni Logika Render UI | **Tetap di ESM JS**. Merupakan fungsi pembentuk SVG string dinamis (`getShioSvgIllustration`). |
| 29 | `js/data/siklus-master-data.js` | 15,917 | **A (Data Lookup)** | Siklus Padewan 8 dewa & palenggahan kedudukan. Dikonsumsi `padewan-ui.js`, `nujum-ui.js`. | `siklus:padewan` (`25-siklus-padewan-bilingual.json`) | **Remote KV Live**. Dibaca via `loadDomainData('nujum')`. Fallback JS terbundel. |
| 30 | `js/data/sinengker-db.js` | 35,842 | **A (Data Lookup)** | Kompas Danyang 360°, naskah sakral, pantangan arah. Dikonsumsi `sinengker-engine.js`. | `sinengker:khusus` (`37-sinengker-khusus.json`) | **Remote KV Live**. Dibaca via `loadDomainData('sinengker')`. Fallback JS terbundel. |
| 31 | `js/data/tumpeng.js` | 12,377 | **C (Supplemental)** | 7 ubarampe sesaji Tumpeng Tombak Rojo & filosofi 5 warna. Dikonsumsi `sinengker-ui.js`. | `tumpeng:all` (`42-tumpeng-all.json`) | **Lokal Siap (Pending Upload Remote)**. Fallback JS masih menjadi sumber data utama di production saat ini. |
| 32 | `js/data/wayang.js` | 14,530 | **C (Supplemental)** | Katalog 25+ tokoh wayang purwa, watak, senjata, gambar. Dikonsumsi `wayang-engine.js`. | `wayang:all` (`38-wayang-all.json`) | **Lokal Siap (Pending Upload Remote)**. Fallback JS masih menjadi sumber data utama di production saat ini. |
| 33 | `js/data/wuku-petenget-db.js` | 17,929 | **A (Data Lookup)** | 4 pilar petenget 30 wuku. Dikonsumsi `wuku-engine.js`, `kalender-ui.js`. | `wuku:petenget` (`24-wuku-petenget-bilingual.json`) | **Remote KV Live**. Mendukung data injection via `loadDomainData('wuku')`. Fallback JS terbundel. |

---

## 3. Ringkasan Status Akhir Setiap Domain Runtime

1. **Domain Kalender, Pawukon, Nujum, Perjodohan, Selametan, Petung Ijab, Petung Omah, Petung Kehidupan, Aksara, Sasmitha, Sinengker, Kamus, Pustaka (37 Keys):**
   - **Status:** **Remote KV Live**.
   - **Kondisi:** Endpoint `/api/data/:key` aktif. Namun, in-memory fallback di `dbLoader.js` dan modul `js/data/*.js` sengaja tetap dibundel di browser oleh Vite untuk menjaga ketersediaan offline.
2. **Domain Wayang Purwa, Pitutur Luhur, Mitologi Nusantara, Pustaka Digital, Tumpeng Tombak Rojo (5 Keys Supplemental):**
   - **Status:** **Lokal Siap / Pending Upload Manual Owner**.
   - **Kondisi:** Data JSON siap di `public/data/`, manifest canonical key aktif, kode UI sudah mendukung async loading, tetapi key BELUM ada di namespace Cloudflare KV Remote. Di production, 5 domain ini masih berjalan dari Pages static JSON asset atau fallback modul JavaScript.
3. **Status Keseluruhan:**
   - **Bukan 100% Murni KV**. Arsitektur saat ini adalah **Hybrid / Transisi Terkendali dengan Fallback Resilience**.
