# Jagad Jawa — Menjelajahi Kebudayaan Luhur Nusantara

**JAGAD JAWA** · Versi 3.0 (`branch: jawa-v11`)  
Portal Kebudayaan Luhur Nusantara, Penanggalan Jawa Sultan Agungan, Nujum Primbon 6 Dimensi Bincil, Pitung Perjodohan, Pawukon, Petung Omah & Cempuri, Petung Ijab, Petung Kehidupan & Tetanen, Sasmitha Tanda Alam, Pustaka Digital & Sinengker Sakral, Aksara Jawa, dan Wayang Purwa Gagrag Surakarta.

---

## Daftar Isi
1. [Arsitektur & Evolusi Versi: jawa-v10 & jawa-v11](#arsitektur--evolusi-versi-jawa-v10--jawa-v11)
2. [Kaidah Emas (Zero Change pada Formula Inti)](#kaidah-emas-zero-change-pada-formula-inti)
3. [Struktur Direktori Modern](#struktur-direktori-modern)
4. [Struktur Database JSON & dbLoader Service](#struktur-database-json--dbloader-service)
5. [Fitur-Fitur Unggulan](#fitur-fitur-unggulan)
6. [Panduan Instalasi & Penggunaan Lokal](#panduan-instalasi--penggunaan-lokal)
7. [Menjalankan Pengujian Otomatis (Unit Tests)](#menjalankan-pengujian-otomatis-unit-tests)
8. [Panduan Kompilasi & Build Produksi](#panduan-kompilasi--build-produksi)
9. [Panduan Deploy](#panduan-deploy)

---

## Arsitektur & Evolusi Versi: jawa-v10 & jawa-v11

| Aspek | Versi Lawas (`jawa-v2`) | Arsitektur Mutakhir (`jawa-v10` / `jawa-v11`) |
| :--- | :--- | :--- |
| **Integrasi Database** | Data diimpor statis dari berkas JS (`js/data/*.js`) yang menambah bobot inisial bundle. | **Asinkron & Terpusat (`dbLoader.js`)**: Seluruh 37 berkas master database JSON (`public/data/*.json`) dimuat secara dinamis per domain dengan key-mapping normalizer, memory cache, dan zero-blank fallback. |
| **Sistem Bilingual (i18n)** | Kamus teks terbatas pada sebagian label antarmuka. | **Sistem Dwibahasa Penuh (ID & JV)**: Mendukung Bahasa Indonesia (`id`) dan Basa Jawi (`jv`) tersimpan di `localStorage`. Menu navigasi utama dikunci tetap Bahasa Indonesia agar navigasi konsisten. |
| **Navigasi & Tombol Kembali** | Tombol "← Kembali" tersebar lokal di masing-masing modul sehingga bertumpuk dan tidak seragam. | **Konsolidasi Terpusat**: Seluruh tombol lokal dihapus, digantikan oleh tombol navigasi kembali global di navbar utama yang terhubung langsung ke `navigasiKembali()`. |
| **Styling & CSS Bundler** | Memuat Tailwind CSS melalui CDN eksternal `<script src="https://cdn.tailwindcss.com"></script>`. | **Kompilasi Lokal Vite + PostCSS**: Menggunakan Tailwind CSS lokal via `postcss.config.cjs` & `tailwind.config.cjs`, di-bundle secara efisien saat `npm run build`. |
| **Aset Multimedia** | Struktur aset tersebar di folder `assets/` dan `public/assets/`. | **Penyatuan Eksklusif**: Seluruh aset gambar, ilustrasi wayang, dan audio dikonsolidasi di folder publik `public/assets/` dengan path terverifikasi tanpa *broken link*. |
| **Service Worker PWA** | Versi cache v2 hanya mencakup aset kalender & nujum dasar. | **Service Worker v3 (`CACHE_NAME = 'jagad-jawa-v3'`)**: Precache lengkap mencakup seluruh domain baru (`sapa-dina`, `omah`, `sinengker`, `pustaka`, `ijab`, dll.), berkas JSON data, dan audio. |

---

## Kaidah Emas (Zero Change pada Formula Inti)

> [!IMPORTANT]
> **Preservasi 100% Rumus Matematis & Kultural**: Seluruh kalkulasi inti penanggalan dan primbon tetap mempertahankan nilai matematis orisinalnya tanpa perubahan:
> - **Julian Day Number (JDN)**: Epoch Abadi **29 Agustus 2021 = Minggu Pahing, Wuku Sinta (JDN 2459456)**.
> - **Bobot Neptu**: 7 Hari (Minggu: 5 s.d. Sabtu: 9) dan 5 Pasaran (Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8).
> - **Pawukon**: Siklus 30 wuku (210 hari) dari Sinta hingga Watugunung.
> - **Pitung Perjodohan**: Metode Modulo 4, 5, 7, 8, dan bobot aksara carakan.
> - **Sistem Pergantian Hari**: Kaidah Sultan Agungan jam 18:00 (Surup / Maghrib).

---

## Struktur Direktori Modern

```
jagad-jawa/
├── index.html                 # Entry point HTML semantik & responsif
├── manifest.webmanifest       # Web App Manifest PWA (standalone, theme-color)
├── sw.js                      # Service Worker v3 (PWA Offline Engine)
├── package.json               # Konfigurasi dependensi, scripts & devDependencies
├── postcss.config.cjs         # Konfigurasi PostCSS untuk Tailwind CSS bundler
├── tailwind.config.cjs        # Konfigurasi tema warna Keraton, Sogan, Prada, & Fon Budaya
├── vite.config.js             # Konfigurasi Vite bundler
├── css/
│   └── styles.css             # Entry point styles dengan @tailwind directives & layout khusus
├── public/                    # Direktori publik root untuk aset statis Vite
│   ├── assets/
│   │   ├── audio/             # Ketawang Puspawarna (puspowarno.mp3)
│   │   ├── icon.svg           # Ikon vektor Gunungan & Ceplok Keraton
│   │   └── illustrations/     # Gunungan Tripurusa, Kompas Danyang, Tumpeng, Wayang PNG
│   │       ├── astawara/      # Ilustrasi 8 Astawara
│   │       ├── dewane/        # Ilustrasi dewa wuku
│   │       ├── siklus12/      # Ilustrasi 12 batara siklus padewan
│   │       ├── wayang/        # 25 karakter wayang kulit purwa Surakarta (.png)
│   │       └── wuku/          # 30 kartu visual wuku
│   └── data/                  # 37 Master database JSON bilinggual (01 s/d 37)
├── js/
│   ├── main.js                # Bootstrap aplikasi, preloader database & inisialisasi UI
│   ├── services/
│   │   └── dbLoader.js        # Centralized async JSON Loader, Key Mapper, & Fallbacks
│   ├── ui/                    # UI Orchestrators (Navigation, i18n, Modal, Toast, Mode)
│   ├── features/              # Feature wirings ke window global
│   ├── modules/               # Domain logic & UI per modul budaya:
│   │   ├── kalender/          # Kalender Jawa, Pranata Mangsa, Bookmark, Share Card
│   │   ├── nujum/             # 6 Dimensi Bincil, Faalakiah 12 Nabi, Shio, Watak
│   │   ├── jodoh/             # Pitung Salaki Rabi & riwayat pasangan
│   │   ├── selametan/         # Haul leluhur (Geblak s.d. Nyewu)
│   │   ├── ijab/              # Petung Palakrama & Neptu khusus nikah
│   │   ├── omah/              # Petung griya, cempuri lawangan & boyongan
│   │   ├── petung-kehidupan/  # Petung ternak, loro, geblak 35 weton
│   │   ├── sapa-dina/         # Inspirasi harian agraris, tetanen & petenget
│   │   ├── sasmitha/          # Sasmitha alam, impen, kedut anatomi, gerhana, lindu
│   │   ├── wuku/              # Ensiklopedia 30 wuku & petenget pilar
│   │   ├── aksara/            # Studio Aksara Jawa & transliterasi realtime
│   │   ├── wayang/            # Panggung kelir wayang & tata krama dalang
│   │   ├── pustaka/           # Pustaka dongo, usada usada, & piwulang
│   │   ├── sinengker/         # Pustaka sinengker, proteksi PIN, kompas danyang
│   │   └── budaya/            # Telur Jagad (Tripurusa) & ensiklopedia budaya
│   └── data/                  # Pure datasets & fallback offline resilien
└── tests/                     # Test suite otomatis (Node.js test runner)
```

---

## Struktur Database JSON & dbLoader Service

Pemuatan data dikelola secara tunggal melalui [`js/services/dbLoader.js`](file:///d:/04-JAWA/jagad-jawa/js/services/dbLoader.js):
- **Domain-Driven Asynchronous Loading**: Memanggil `loadDomainData(domain)` untuk domain `kalender`, `wuku`, `jodoh`, `nujum`, `selametan`, `ijab`, `omah`, `petung-kehidupan`, `sapa-dina`, `sasmitha`, `pustaka`, `sinengker`.
- **Key Normalization**: Merekonsiliasi variasi kunci properti JSON (`id` ⟷ `no_wuku`, `nama` ⟷ `nama_wuku`, `dino` ⟷ `dina`, `wiwit_ternak` ⟷ `ternak`, dll.).
- **Zero Blank Resilience**: Bila terjadi kegagalan jaringan atau ketiadaan berkas JSON, fungsi `getDomainFallback()` secara instan mengembalikan data cadangan bawaan tanpa membuat antarmuka menjadi blank.

---

## Fitur-Fitur Unggulan

1. **Kalender Jawa Sultan Agungan & Pranata Mangsa**:
   - Tampilan bulanan lengkap dengan konversi Masehi, Hijriah, dan Saka Jawa (AJ).
   - Mode Tampilan Ganda: Mode Kalender Grid dan Mode List Minggu responsif.
   - Status hari: Dino Ijo (Becik), Dino Abang (Ala), Dino Gede (★), dan Dino Sirikan.
2. **Nujum Pribadi & Primbon 6 Dimensi Bincil**:
   - Analisis Padewan, Paringkelan, Padangon, Paarasan, Pancasuda, dan Kamarokan secara eksak.
3. **Pitung Perjodohan (7 Kaidah Salaki Rabi)**:
   - Evaluasi keselarasan weton calon mempelai beserta 5 rekomendasi tanggal mantu rahayu.
4. **Petung Omah & Petung Ijab**:
   - Penentuan arah hadap rumah, bukaan cempuri lawangan 4 penjuru, dan neptu khusus ijab kabul.
5. **Petung Kehidupan & Tetanen**:
   - Keselarasan bercocok tanam (oyot, uwit, godhong, uwoh) dan panduan memelihara hewan ternak.
6. **Sasmitha (Tanda Alam & Anatomi Tubuh)**:
   - Penafsiran impen (mimpi), titik anatomi kedutan tubuh interaktif, serta pratanda gerhana, lindu, dan tejo.
7. **Pustaka Sinengker & Kompas Danyang**:
   - Akses naskah wingit dengan konfirmasi kultural dan proteksi PIN, disertai kalkulator Kompas Danyang 360°.
8. **Studio Aksara Jawa Real-time**:
   - Papan ketik transliterasi aksara Jawa instan dilengkapi sandhangan swara dan panyigeg.
9. **Panggung Kelir Wayang & Gamelan**:
   - Simulasi pementasan wayang purwa gagrag Surakarta dengan efek suara kepyak/dodokan dan pemutar audio Ketawang Puspawarna.

---

## Panduan Instalasi & Penggunaan Lokal

### Prasyarat
- **Node.js**: Versi 18+ (disarankan Node.js 20 atau 22).
- **NPM**: Versi 9+.

### Langkah-Langkah

1. **Clone & Masuk ke Direktori Proyek**:
   ```bash
   git clone -b jawa-v11 https://github.com/agungjpyohanes/jagad-jawa.git
   cd jagad-jawa
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada `http://localhost:3000`.

---

## Menjalankan Pengujian Otomatis (Unit Tests)

Jagad Jawa dilengkapi rangkaian tes komprehensif menggunakan Node.js Test Runner bawaan (`node:test`):

```bash
# Menjalankan seluruh test suite (216 tests)
npm test

# Menjalankan pengujian integrasi database JSON dbLoader
node tests/db-loader-integration.test.js

# Menjalankan pengujian PWA & Service Worker
node --test tests/pwa-ux.test.js
```

---

## Panduan Kompilasi & Build Produksi

Untuk menghasilkan berkas produksi yang siap didistribusikan:

```bash
npm run build
```

Hasil build akan tersimpan di direktori `dist/` dengan aset CSS (Tailwind lokal), JavaScript chunking, dan Service Worker v3 teroptimasi. Untuk menguji hasil build secara lokal:

```bash
npm run preview
```

---

## Panduan Deploy

Aplikasi merupakan *Single Page Application* (SPA) statis yang siap di-deploy langsung ke penyedia hosting cloud:

### Vercel
1. Hubungkan repositori GitHub ke dashboard Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Root Directory: `.`

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

---

© 2026 JAGAD JAWA — Portal Kebudayaan Luhur Nusantara
