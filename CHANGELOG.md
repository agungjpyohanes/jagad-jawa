# Changelog — Jagad Jawa

Semua pembaruan, perbaikan, dan refaktorisasi pada proyek **Jagad Jawa** dicatat dalam berkas ini.

---

## [3.0.0] - 2026-10-02 (Branch: `jawa-v11`)

### Added
- **Integrasi Database Asinkron Terpusat (`dbLoader.js`)**:
  - Pemuatan terpadu 37 file master database JSON dari folder `public/data/` via `loadDomainData(domain)`.
  - Normalizer pemetaan kunci properti (*Key Mapping*) untuk menyelaraskan properti bahasa dan kode (`id` vs `no_wuku`, `nama` vs `nama_wuku`, `dino` vs `dina`, dll.).
  - Mekanisme *Zero Blank Guarantee* menggunakan `getDomainFallback(domain)` dan cache in-memory.
- **Service Worker v3 (`CACHE_NAME = 'jagad-jawa-v3'`)**:
  - Peningkatan versi cache dari v2 ke v3 dengan daftar *precache* komprehensif.
  - Precache mencakup modul domain baru (`sapa-dina`, `omah`, `sinengker`, `pustaka`, `ijab`, dll.), 37 berkas database JSON, audio gamelan Puspawarna, serta 25 ilustrasi wayang kulit.
- **Konsolidasi Tombol Navigasi Kembali Global**:
  - Tombol kembali terpusat (`#globalNavBackBtn`) disematkan pada bar navigasi/header atas dan terhubung langsung ke `navigasiKembali()`.
  - Otomatis tersembunyi saat berada di tab `beranda`, dan aktif tampil saat menjelajahi modul/subtab.
- **Konfigurasi Lokal Tailwind CSS & PostCSS**:
  - Penambahan `tailwind.config.cjs` dan `postcss.config.cjs`.
  - Penambahan `@tailwind base`, `@tailwind components`, dan `@tailwind utilities` pada `css/styles.css`.
  - Pengikisan dependensi CDN eksternal Tailwind dari `index.html`.
- **Rangkaian Pengujian Integrasi (`tests/db-loader-integration.test.js`)**:
  - Memverifikasi sinkronisasi kunci, pemuatan asinkron seluruh domain, ketahanan fallback, serta keaslian 100% rumus hitung matematis.

### Changed
- **Penyatuan dan Koreksi Path Seluruh Aset**:
  - Mengonsolidasi seluruh gambar, wayang kulit, dan berkas audio secara eksklusif ke folder `public/assets/`.
  - Menghapus berkas aset duplikat yang berada di luar direktori `public/`.
  - Memastikan seluruh pemanggilan di komponen kode mengarah ke `/assets/illustrations/` dan `assets/audio/`.
- **Sistem Bilingual (ID & JV)**:
  - Menyempurnakan pemisahan preferensi bahasa pengguna (tersimpan di `localStorage`).
  - Mengunci menu navigasi utama tetap menggunakan Bahasa Indonesia pada mode Basa Jawi untuk menjaga kenyamanan navigasi.
- **Studio Aksara Jawa**:
  - Penyesuaian event listener transliterasi aksara Jawa secara instan (*real-time*).

### Removed
- Menghapus tag CDN eksternal `<script src="https://cdn.tailwindcss.com"></script>` dan konfigurasi inline `tailwind.config` di `index.html`.
- Menghapus seluruh tombol lokal "← Kembali" yang tersebar di dalam komponen modul-modul individual (`tab-kalender`, `tab-tanggal-jawa`, `tab-kepribadian`, `tab-perjodohan`, `tab-selametan`, `tab-gamelan`, `tab-aksara`, `tab-wayang`, `tab-pitutur`, `tab-tumpeng`, `tab-wuku`, `tab-mitologi`, `tab-laporan`).
- Menghapus berkas aset duplikat di root `assets/`.

---

## [2.0.0] - 2026-09-30 (Branch: `jawa-v10`)

### Added
- Penambahan modul domain baru:
  - `Petung Omah` & Cempuri Lawangan 4 Arah.
  - `Petung Ijab` (Palakrama) dengan neptu khusus pernikahan.
  - `Petung Kehidupan` & Tetanen 35 kombinasi weton.
  - `Sapa Dina` inspirasi harian & Pranata Mangsa agraris.
  - `Sasmitha` tafsir impen, kedutan anatomi tubuh, gerhana, lindu, dan tejo.
  - `Pustaka Digital` & `Pustaka Sinengker` (Kompas Danyang 360°).
- Penambahan 25 ilustrasi karakter wayang kulit purwa gagrag Surakarta berformat PNG transparan.
- Penambahan ilustrasi kanon Gunungan Tripurusa, Kompas Danyang, dan Tumpeng Tombak Rojo.
- Peningkatan test suite ke 216 pengujian unit otomatis.

### Changed
- Refaktorisasi struktur komponen ke subdirektori modular di `js/modules/`.
- Standardisasi kontras warna status Dino Ala/Becik sesuai pedoman aksesibilitas WCAG AA.

---

## [1.0.0] - 2026-09-15 (Branch: `jawa-v2`)

### Added
- Migrasi arsitektur dari monolitik `index.html` ke arsitektur modular ES Modules.
- Penataan `Single Source of Truth` Matriks Nujum 6 Dimensi Bincil (`nujum-matrix.js`).
- Implementasi Progressive Web App (PWA) awal dengan Web App Manifest dan Service Worker v2.
- Mode tampilan kalender ganda (Mode Kalender Grid dan Mode List Minggu).
- Generator kartu weton (Share Card PNG) dan WhatsApp Formatter.
