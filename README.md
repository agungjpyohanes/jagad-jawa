# Jagad Jawa — Menjelajahi Kebudayaan Luhur Nusantara

**JAGAD JAWA** · Versi 2.0 (`branch: jawa-v2`)  
Portal Kebudayaan Luhur Nusantara, Penanggalan Jawa Sultan Agungan, Nujum Primbon 6 Dimensi Bincil, Pitung Perjodohan, Pawukon, Aksara Jawa, dan Wayang Purwa.

---

## Daftar Isi
1. [Perbedaan Fundamental: jawa-v1 vs jawa-v2](#perbedaan-fundamental-jawa-v1-vs-jawa-v2)
2. [Perilaku yang Dijamin Sama dengan jawa-v1 (Zero Change pada Formula)](#perilaku-yang-dijamin-sama-dengan-jawa-v1)
3. [Struktur Direktori Modern](#struktur-direktori-modern)
4. [Fitur-Fitur Utama](#fitur-fitur-utama)
5. [Cara Menjalankan Secara Lokal](#cara-menjalankan-secara-lokal)
6. [Menjalankan Pengujian Otomatis (Unit Tests)](#menjalankan-pengujian-otomatis-unit-tests)
7. [Checklist Manual QA 15 Menit untuk Rilis](#checklist-manual-qa-15-menit-untuk-rilis)
8. [Panduan Deploy](#panduan-deploy)

---

## Perbedaan Fundamental: jawa-v1 vs jawa-v2

| Aspek | Versi Lama (`jawa-v1`) | Versi Modern (`jawa-v2`) |
| :--- | :--- | :--- |
| **Arsitektur Kode** | Monolitik: 1 berkas `index.html` (147 KB) yang mencampur HTML, CSS, ribuan baris JS, dan basis data JSON dalam satu tag `<script>`. | Modular ES Modules: Pemisahan tegas antara UI (`js/ui/`), Fitur (`js/features/`), Logika domain (`js/modules/`), dan Pure Datasets (`js/data/`). |
| **Konsolidasi Data Nujum** | Fragmentasi data: Terdapat inkonsistensi antara `nujum-master-data.js`, `nujum_database.js`, dan lookup manual. | **Single Source of Truth**: Seluruh modul nujum merujuk ke `js/data/nujum-matrix.js` (210 exact lookup) dengan zero modulo pada 6 dimensi bincil. |
| **Dukungan Offline & PWA** | Tidak ada Service Worker atau manifest; jika internet putus, aset eksternal dan script gagal dimuat. | **Full PWA Ready**: Memiliki `manifest.webmanifest`, ikon vektor, dan `sw.js` yang meng-cache shell, dataset nujum, dan calendar data sehingga bisa diakses **100% offline**. |
| **Layout Kalender Mobile** | Hanya tabel 9 kolom yang terpotong atau harus digeser horizontal lebar di ponsel. | **Mode Ganda**: Pengguna mobile dapat memilih **Mode Tabel (Grid)** atau **Mode List Minggu (Weekly View)** per pekan yang sangat pas di layar smartphone. |
| **Aksesibilitas & Bahasa** | Label antarmuka statis campuran; kontras badge status Ala/Becik beberapa kali kurang terbaca pada latar gelap. | **Toggle Dwibahasa (ID / Jawa)** via `i18n.js` tanpa mutasi key data. Kontras badge Ala (`#b91c1c`) dan Becik (`#15803d`) telah terstandarisasi **WCAG AA (>4.5:1)**. |
| **Fitur Tambahan** | Belum ada riwayat perjodohan, kartu weton gambar, dan sistem penandaan tanggal. | Bookmark tanggal lokal, Generator Share Card Weton (PNG & teks WhatsApp), Selametan Wizard (penanganan Maghrib), dan Audio Synthesizer Gamelan. |

---

## Perilaku yang Dijamin Sama dengan jawa-v1

> [!IMPORTANT]
> **Kaidah Emas `jawa-v2`**: Seluruh formula matematis, siklus penanggalan, dan pemetaan kultural **100% identik** dengan `jawa-v1`. Tidak ada algoritma hitung yang diubah saat online maupun offline.

1. **Perhitungan Bobot Neptu**:
   - **7 Hari**: Minggu (5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9).
   - **5 Pasaran**: Legi (5), Pahing (9), Pon (7), Wage (4), Kliwon (8).
   - **Total Neptu**: Formula `NEPTU_HARI + NEPTU_PASARAN` untuk seluruh 35 kombinasi dino-pasaran, rentang 7 (Selasa Wage) hingga 18 (Sabtu Pahing).
2. **Matriks Bincil 6 Dimensi (`getNujumData`)**:
   - Seluruh 210 kombinasi wuku dan hari-pasaran dipetakan secara **exact lookup** dari matriks kanonis primbon tanpa rumus modulo aproksimasi:
     - **Padewan**: 8 Dewa (Sri, Indra, Guru, Yama, Rudra, Brama, Kala, Uma).
     - **Paringkelan**: 6 Ringkel (Tungle, Aryang, Warukung, Paningron, Uwas, Mawulu).
     - **Padangon**: 8 Dangu (Dadi, Dangu, Jagur, Gigis, Brama, Wogan, Tulus, Wurung).
     - **Paarasan**: 10 Aras (Lakuning Pandhita Sakti, Aras Tuding, Lakuning Banyu, dll.).
     - **Pancasuda**: 7 Laku (Bumi Kapetak, Satria Wibawa, Tunggak Semi, Wasesa Segara, dll.).
     - **Kamarokan**: 2 Status Lintang (Nuju Pati & Kala Tinantang).
3. **7 Kaidah Pitung Perjodohan**:
   - **Metode I (Modulo 4 / Panca Suda)**: Sisa 1 (Gembili), Sisa 2 (Sri), Sisa 3 (Gedhong), Sisa 0 (Lara/Pati).
   - **Metode II (Modulo 5 / Pancawardhana)**: Sri, Lungguh, Dunya, Lara, Pati.
   - **Metode III (Modulo 7 / Petung Salaki Rabi)**: Wasesa Segara, Tunggak Semi, Satria Wibawa, Sumur Sinaba, Satria Wirang, Bumi Kapetak, Lebu Katiyup Angin.
   - **Metode IV s/d VII**: Pembobotan aksara carakan penganten, pancer padha, dan kaidah dina rahayu.
4. **Julian Day Number (JDN) & Epoch Referensi Abadi**:
   - Patokan Abadi: **29 Agustus 2021 = Minggu Pahing, Wuku Sinta (JDN 2459456)**.
   - Sinkronisasi siklus 210 hari Pawukon, 35 hari Wetonan, dan tahun Anno Javanico (AJ) Sultan Agungan terbukti presisi lintas abad (1900 s/d 2200).
5. **Kalkulasi Offline**:
   - Saat offline, Service Worker mengeksekusi pure functions dari berkas JS lokal yang sama persis tanpa mock data dummy.

---

## Struktur Direktori Modern

```
jagad-jawa/
├── index.html                 # Entry point HTML semantik & responsif
├── manifest.webmanifest       # Web App Manifest PWA (standalone, theme-color)
├── sw.js                      # Service Worker cache shell, nujum matrix & kalender
├── css/
│   └── styles.css             # Custom styling (batik motif, print layout, kalender mobile)
├── assets/
│   ├── icon.svg               # Ikon vektor Gunungan & Ceplok Keraton
│   ├── audio/                 # Berkas audio Puspawarna & gamelan
│   └── wayang/                # Ilustrasi tokoh wayang purwa
├── js/
│   ├── main.js                # Orchestrator utama, bootstrap, & SW registration
│   ├── features/              # Feature wiring modules (thin wrappers ke window)
│   │   ├── kalender.js        # Kalender, mode list minggu, bookmark, share card
│   │   ├── nujum.js           # Lazy loading dataset nujum & wuku
│   │   ├── jodoh.js           # Pitung perjodohan & riwayat mantu
│   │   ├── selametan.js       # Pengetan tilar donyo (Geblak s/d Nyewu)
│   │   ├── aksara.js          # Hanacaraka, sandhangan & kuis aksara
│   │   ├── wayang.js          # Wayang purwa & etika kultural
│   │   └── audio.js           # Gamelan synth & sound FX
│   ├── modules/               # Domain logic & antarmuka per modul
│   │   ├── kalender/          # kalender-engine, kalender-ui, bookmark-service, share-card
│   │   ├── nujum/             # nujum-engine, nujum-ui
│   │   ├── jodoh/             # jodoh-engine, jodoh-ui, jodoh-history
│   │   ├── selametan/         # selametan-engine, selametan-ui
│   │   ├── aksara/            # aksara-engine, aksara-ui
│   │   ├── wayang/            # wayang-engine, wayang-ui
│   │   ├── wuku/              # wuku-engine, wuku-ui
│   │   └── budaya/            # tripurusa & ensiklopedia-budaya
│   ├── data/                  # Pure datasets & pure functions (bebas DOM)
│   │   ├── nujum-matrix.js    # Single Source of Truth 210 kombinasi bincil
│   │   ├── calendar.js        # JDN, Wuku, Pasaran, Dino Ijo/Ala, getDayInfo()
│   │   ├── dino-rules.js      # Tabel aturan hari sakral & dino gede
│   │   ├── pawukon.js         # Ensiklopedia lengkap 30 wuku
│   │   ├── personality.js     # Faalakiah 12 Nabi & Asesoris watak
│   │   ├── marriage.js        # Tabel hasil 7 pitung perjodohan
│   │   └── ...                # pitutur, selametan, wayang, tumpeng
│   └── ui/                    # UI Controller generik
│       ├── i18n.js            # Manajer dwibahasa (ID / Jawa)
│       ├── navigation.js      # Navigasi tab, drawer mobile, cetak laporan
│       ├── modal.js           # Modal backdrop & keyboard Escape handler
│       └── toast.js           # Notifikasi toast & clipboard helper
├── tests/                     # Test suite otomatis (Node.js test runner)
│   ├── pure-functions.test.js # Tes referensi matematis baku v1
│   ├── pwa-ux.test.js         # Tes PWA, SW cache, mode list minggu, i18n, kontras badge
│   └── ... (18 berkas tes)    # Cakupan domain lengkap (74 passing unit tests)
└── docs/                      # Dokumentasi teknis & regresi
```

---

## Fitur-Fitur Utama

1. **Beranda & Weton Instan**: Menampilkan penanggalan hari ini secara instan beserta Weton, Neptu, dan Wuku.
2. **Kalender Jawa Sultan Agungan**:
   - Generator kalender bulanan lengkap dengan padanan Masehi, Hijriah, dan Jawa.
   - **Mode Tampilan**: Mode Tabel (Grid) dan Mode List Minggu (Weekly View) responsif mobile.
   - Klasifikasi warna hari: **Dino Ijo (Becik)**, **Dino Abang (Ala)**, dan **Dino Gede (Border Emas & Bintang ★)**.
   - Filter cerdas hari, penyimpanan penanda tanggal (Bookmark), serta ekspor laporan ke PDF dan PNG resolusi tinggi.
   - Modal detail tanggal mendalam: Pranata Mangsa agraris, konversi tahun Jawa, dan generator kartu weton WhatsApp.
3. **Nujum Pribadi & Primbon**:
   - 6 Dimensi Bincil eksak, Faalakiah 12 Nabi & Tolak Balak, Shio & Elemen, Zodiak Jawa, serta Siklus Tahunan umur.
   - Fitur komparasi keselarasan non-jodoh (rekan kerja, mitra bisnis, sahabat).
4. **Pitung Perjodohan**:
   - Evaluasi 7 metode primbon salaki rabi lengkap dengan skor keharmonisan dan rekomendasi 5 tanggal mantu rahayu.
   - Manajemen riwayat perhitungan perjodohan di penyimpanan lokal.
5. **Pengetan Tilar Donyo (Selametan)**:
   - Perhitungan 7 milestone (Geblak, 3 dina, 7 dina, 40 dina, 100 dina, Pendak 1, Pendak 2, Nyewu).
   - Pengalihan hari otomatis jika waktu wafat bakda Maghrib sesuai kaidah Sultan Agungan.
6. **Ensiklopedia 30 Wuku & Budaya**:
   - Rincian mendalam 30 Wuku Pawukon (dewa, pohon, burung, gedung, celaka, dan tolak balak).
   - Modul interaktif Telur Jagad (Tripurusa) dan glosarium konsep tradisional.
7. **Studio Aksara & Kelir Wayang**:
   - Transliterasi dua arah Latin ke Aksara Jawa (sandhangan swara, panyigeg, wyanjana).
   - Virtual Gamelan synthesizer (Pelog & Slendro) dan wayang kulit interaktif.

---

## Cara Menjalankan Secara Lokal

Karena menggunakan **ES Modules**, aplikasi harus dijalankan menggunakan web server lokal:

```bash
# Opsi 1: Menggunakan Python 3
python -m http.server 3000

# Opsi 2: Menggunakan Vite (NPM)
npm install
npm run dev
```

Buka peramban di `http://localhost:3000` (atau port yang ditentukan).

---

## Menjalankan Pengujian Otomatis (Unit Tests)

Jagad Jawa menggunakan test runner bawaan Node.js (`node:test`) tanpa dependensi berat:

```bash
# Menjalankan seluruh 74 unit tests
npm test

# Menjalankan spesifik pengujian PWA & UX
node --test tests/pwa-ux.test.js

# Menjalankan pengujian pure functions patokan abadi
node --test tests/pure-functions.test.js
```

---

## Checklist Manual QA 15 Menit untuk Rilis

Gunakan panduan pengujian end-to-end ini sebelum melakukan merge atau rilis:

| Durasi | Modul yang Diuji | Langkah Pengujian & Kriteria Kelulusan |
| :---: | :--- | :--- |
| **00:00 - 02:00** | **Beranda & Navigasi** | 1. Buka halaman utama; pastikan badge weton hari ini di navbar terisi benar.<br>2. Buka dropdown navigasi desktop (Wektu, Nujum, Budaya) lalu klik salah satu item.<br>3. Perkecil viewport ke ukuran mobile (≤480px); buka drawer menu mobile dan pastikan seluruh link berfungsi. |
| **02:00 - 05:00** | **Kalender Jawa & Mode List** | 1. Ubah bulan & tahun; kalender harus merender hari, pasaran, wuku, dan sasi Jawa.<br>2. Klik tombol **Mode List Minggu**: pastikan tampilan beralih ke daftar vertikal per pekan yang rapi.<br>3. Klik salah satu sel hari: modal detail tanggal harus terbuka menampilkan badge Ala/Becik berkontras tinggi.<br>4. Uji tombol filter: `Sedaya Dina`, `Dino Ijo`, `Dino Gede`, dan `Ditandhai`.<br>5. Simpan 1 catatan bookmark pada tanggal terpilih, pastikan ikon 🔖 muncul di sel. |
| **05:00 - 08:00** | **Nujum & Ensiklopedia Wuku** | 1. Masuk tab **Nujum Pribadi**: masukkan tanggal lahir, klik Hitung Nujum.<br>2. Pastikan 6 dimensi bincil (Padewan, Paringkelan, dll.) tampil lengkap.<br>3. Klik tombol ensiklopedia wuku: modal 30 wuku terbuka, ketik nama wuku (misal: "Sinta") pada kotak pencarian dan periksa deskripsinya. |
| **08:00 - 10:00** | **Pitung Jodoh & Selametan** | 1. Masuk tab **Perjodohan**: masukkan data calon pengantin pria dan wanita, klik hitung.<br>2. Verifikasi 7 metode pitung terisi dan rekomendasi 5 tanggal mantu rahayu muncul.<br>3. Masuk tab **Selametan**: masukkan tanggal wafat, coba switch radio "Siang (Sebelum Maghrib)" vs "Malam (Bakda Maghrib)" — pastikan tanggal geblak bergeser 1 hari saat malam. |
| **10:00 - 12:00** | **Seni Budaya & Audio** | 1. Klik tombol **Ketawang Puspawarna** di navbar: pastikan audio berjalan & equalizer berkedip.<br>2. Masuk tab **Studio Aksara**: ketik teks latin, pastikan aksara Jawa tertransliterasi.<br>3. Masuk tab **Gamelan**: bunyikan beberapa bilah saron dan gong.<br>4. Masuk tab **Wayang**: gerakkan karakter wayang pada kelir virtual. |
| **12:00 - 13:30** | **Aksesibilitas & Dwibahasa** | 1. Klik tombol toggle **ID / JA** di navbar: pastikan seluruh label UI berganti dari Bahasa Indonesia ke Basa Jawa.<br>2. Pastikan key data pada weton/tanggal Jawa **tidak ikut berubah**.<br>3. Periksa kontras teks badge Ala (`#b91c1c`) dan Becik (`#15803d`): teks putih harus tajam dan jelas terbaca. |
| **13:30 - 15:00** | **PWA & Offline Readiness** | 1. Buka Chrome DevTools → Tab **Application** → **Service Workers**: pastikan status *Activated and running* dari `sw.js`.<br>2. Cek bagian **Manifest**: pastikan nama, short name, dan icon terdeteksi.<br>3. Buka tab **Network**, centang mode **Offline**, lalu reload halaman.<br>4. Pastikan aplikasi tetap terbuka normal, kalender dan nujum tetap dapat menghitung weton secara instan tanpa sambungan internet. |

---

## Panduan Deploy

Aplikasi adalah *Single Page Application* statis berbasis ES Modules yang kompatibel penuh dengan penyedia hosting statis:

### Vercel
1. Import repositori GitHub ke [Vercel](https://vercel.com).
2. Framework Preset: **Other** (Static).
3. Root Directory: `.`
4. Konfigurasi `vercel.json` sudah tersedia secara otomatis.

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

© 2026 JAGAD JAWA — Portal Kebudayaan Luhur Nusantara
