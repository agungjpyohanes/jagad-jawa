# Struktur Menu dan Database Jagad Jawa

Dokumen ini adalah peta hubungan antara menu yang tampil di aplikasi, modul pemroses, dan database yang digunakan. Sumber menu utama berada di `index.html`, sedangkan perpindahan tab dikendalikan oleh `js/ui/navigation.js`.

## 1. Struktur Menu Utama

```text
Jagad Jawa
├── Beranda
│   └── Sapa Dina
├── Wektu & Penanggalan
│   ├── Kalender Jawa
│   └── Konversi Tanggal Jawa
├── Nujum & Primbon
│   ├── Nujum Pribadi
│   ├── Perjodohan (Pitung)
│   ├── Pengetan Tilar Donyo / Selametan
│   ├── Petung Ijab (Palakrama)
│   ├── Petung Omah & Cempuri
│   ├── Petung Kehidupan / Wiwit Ternak
│   └── Sasmitha (Tanda Alam & Awak)
├── Budaya & Pawukon
│   ├── Ensiklopedia 30 Wuku
│   ├── Telur Jagad (Tripurusa) [Mode Ahli]
│   ├── Ensiklopedia Primbon & Falakiah [Mode Ahli]
│   ├── Mitologi Nusantara
│   ├── Gamelan Jawa
│   └── Tumpeng Tombak Rojo [Mode Ahli]
├── Seni & Sastra
│   ├── Studio Aksara Jawa
│   ├── Panggung Kelir Wayang
│   ├── Pitutur Luhur & Kuis
│   ├── Pustaka Dongo & Usada
│   └── Pustaka Sinengker
└── Laporan & Ekspor Dokumen [Mode Ahli]
```

Menu desktop dan drawer mobile memiliki tab yang sama. Setiap tab mengikuti pola `switchTab('<id>')` dan kontennya memakai elemen `section#tab-<id>`.

## 2. Peta Menu ke Modul dan Database

| Menu / tab | ID tab | Modul utama | Database langsung | Database/shared pendukung |
|---|---|---|---|---|
| Beranda | `beranda` | `modules/sapa-dina/` | Tidak ada database tunggal | `calendar.js`, `pitutur.js`, `petung-tetanen-db.js` |
| Kalender Jawa | `kalender` | `modules/kalender/` | `calendar.js`, `dino-rules.js` | `pawukon.js`, `dewa-kanon.js`, `petung-tetanen-db.js`, `wuku-petenget-db.js`, `bookmark-service.js` |
| Konversi Tanggal Jawa | `tanggal-jawa` | `modules/kalender/` | `calendar.js` | `sasi-jawa-master-data.js`, `pranata-zodiak-data.js`, `pawukon.js` |
| Nujum Pribadi | `kepribadian` | `modules/nujum/` | `nujum-matrix.js` | `pawukon.js`, `personality.js`, `dewa-kanon.js`, `siklus-master-data.js`, `shio-elemen-master-data.js`, `pranata-zodiak-data.js`, `karakter-pekerjaan-master-data.js` |
| Perjodohan | `perjodohan` | `modules/jodoh/` | `marriage.js` | `aksara.js`, `calendar.js`, `jodoh-history.js` dan LocalStorage |
| Selametan | `selametan` | `modules/selametan/` | `selametan.js` | `calendar.js`, `bookmark-service.js` |
| Petung Ijab | `ijab` | `modules/ijab/` | `ijab-db.js` | `calendar.js` sebagai pembanding; neptu ijab tetap terpisah |
| Petung Omah & Cempuri | `omah` | `modules/omah/` | `omah-db.js` | `calendar.js` untuk weton aplikasi |
| Petung Kehidupan / Ternak | `ternak` | `modules/petung-kehidupan/` | `petung-ternak-loro-geblak.js` | `calendar.js`, `petung-tetanen-db.js` |
| Sasmitha | `sasmitha` | `modules/sasmitha/` | `sasmitha-db.js` | Tidak ada database kalkulasi eksternal |
| Ensiklopedia 30 Wuku | `wuku` | `modules/wuku/` | `pawukon.js` | `dewa-kanon.js`, `wuku-petenget-db.js`, aset ilustrasi Wuku/Dewa |
| Telur Jagad / Tripurusa | `tripurusa` | `modules/budaya/tripurusa.js` | Konstanta di modul | Aset `gunungan_tripurusa.jpeg` |
| Ensiklopedia Primbon & Falakiah | `ensiklopedia-budaya` | `modules/budaya/ensiklopedia-budaya.js` | Konten modul | `dewa-kanon.js` |
| Mitologi Nusantara | `mitologi` | Konten pada `index.html` | Tidak ada database terpisah | `pawukon.js` dan referensi budaya pada HTML |
| Gamelan Jawa | `gamelan` | `modules/audio/` | Data nada/alat di modul | `assets/audio/puspowarno.mp3` |
| Studio Aksara Jawa | `aksara` | `modules/aksara/` | `aksara.js` | Tidak ada database eksternal |
| Panggung Kelir Wayang | `wayang` | `modules/wayang/` | `wayang.js` | `assets/wayang/` |
| Pitutur Luhur & Kuis | `pitutur` | `modules/pitutur/` | `pitutur.js` | Tidak ada database eksternal |
| Tumpeng Tombak Rojo | `tumpeng` | `data/tumpeng.js` | `tumpeng.js` | `assets/tumpeng_tumbak rojo_ilustrasi.jpeg` |
| Pustaka Dongo & Usada | `pustaka` | `modules/pustaka/` | `pustaka-db.js`, `pustaka-jawa-db.js` | `database_pustaka_jawa.json`, `pustaka_dongo_jagad_jawa.json` |
| Pustaka Sinengker | `sinengker` | `modules/sinengker/` | `sinengker-db.js` | `database_sinengker_khusus.json`, `assets/kompas_danyang.jpg`, SessionStorage PIN state |
| Laporan | `laporan` | `js/ui/navigation.js` dan modul laporan tiap fitur | Tidak menyimpan database baru | Mengambil hasil dari Kalender, Nujum, Perjodohan, dan Selametan |

## 3. Database JavaScript Utama

### Kalender, waktu, dan pawukon

| File | Isi |
|---|---|
| `js/data/calendar.js` | JDN, epoch kalender Jawa, hari, pasaran, neptu, wuku, tanggal Jawa, Dino Ijo/Ala/Gede, dan libur |
| `js/data/dino-rules.js` | Aturan dan klasifikasi kode hari |
| `js/data/pawukon.js` | 30 wuku dan atribut budaya setiap wuku |
| `js/data/pawukon-dino-db.js` | Data petunjuk hari/wuku |
| `js/data/wuku-petenget-db.js` | Empat pilar petenget wuku |
| `js/data/petung-tetanen-db.js` | Petung pertanian berdasarkan 35 kombinasi dino-pasaran |
| `js/data/sasi-jawa-master-data.js` | Data sasi/bulan Jawa |
| `js/data/pranata-zodiak-data.js` | Pemetaan pranata dan zodiak |

### Nujum, primbon, dan kanon nama

| File | Isi |
|---|---|
| `js/data/nujum-matrix.js` | Single source of truth 210 kombinasi weton-wuku untuk 6 dimensi Bincil |
| `js/data/nujum-master-data.js` | Kompatibilitas data nujum lama |
| `js/data/nujum_database.js` | Proxy/re-export kompatibilitas |
| `js/data/personality.js` | Faalakiah, asesoris, dan data watak |
| `js/data/siklus-master-data.js` | Siklus 12 dengan label dan gender kanon |
| `js/data/dewa-kanon.js` | Kanon Astawara 8, Siklus 12, dan Dewane Wuku 30 |
| `js/data/shio-elemen-master-data.js` | Shio dan elemen |
| `js/data/karakter-pekerjaan-master-data.js` | Karakter dasar, pekerjaan, dan pakarti |
| `js/data/marriage.js` | Tabel tujuh metode pitung perjodohan |

### Database petung kehidupan

| File | Isi |
|---|---|
| `js/data/ijab-db.js` | Neptu khusus ijab, weton, wuku, sasi, tahun windu, tanggal Jawa, dan surasa |
| `js/data/omah-db.js` | Neptu omah, cempuri lawangan, arah pindah, pilihan lemah, dan rumus omah |
| `js/data/petung-ternak-loro-geblak.js` | Petung ternak, loro, dan geblak berdasarkan weton |
| `js/data/selametan.js` | Tujuh milestone pengetan dari Geblak sampai Nyewu |

### Pustaka, bahasa, dan seni

| File | Isi |
|---|---|
| `js/data/sasmitha-db.js` | Impen, kedutan, gerhana, lindu, dan tejo |
| `js/data/pustaka-db.js` | Pustaka dongo dan kategori utamanya |
| `js/data/pustaka-jawa-db.js` | Kautamaning laku, usada, dan Kalacakra |
| `js/data/sinengker-db.js` | Naskah sinengker, kompas Danyang, dan Aji Mantra |
| `js/data/aksara.js` | Aksara Nglegena, pasangan, sandhangan, murda, swara, angka, dan aturan transliterasi |
| `js/data/wayang.js` | Daftar tokoh, kategori, dan metadata etika wayang |
| `js/data/pitutur.js` | Pitutur luhur dan bank soal kuis |
| `js/data/tumpeng.js` | Ubarampe, warna, hotspot, dan filosofi Tumpeng Tombak Rojo |
| `js/data/kawruh-boso.js` | Kosakata/label pendukung Basa Jawa |

## 4. Data Mentah dan Hasil Generasi

```text
data/
├── database_nujum*.csv                 # Sumber data dino, wuku, petung, dan nujum
├── draft_database_nujum*.csv           # Data draft yang belum seluruhnya menjadi modul runtime
├── database_pustaka_jawa.json          # Sumber Pustaka Jawa
├── database_sinengker_khusus.json      # Sumber Pustaka Sinengker
├── pustaka_dongo_jagad_jawa.json       # Sumber Pustaka Dongo
├── ijab_parsed.json                    # Hasil parsing sumber Ijab
├── omah_parsed.json                    # Hasil parsing sumber Omah
├── sasmitha_parsed.json                # Hasil parsing sumber Sasmitha
└── ternak_parsed.json                  # Hasil parsing sumber Petung Ternak
```

File hasil generasi yang digunakan runtime antara lain `ijab-db.js`, `omah-db.js`, `pustaka-db.js`, `pustaka-jawa-db.js`, dan `sinengker-db.js`. Script pembangkitnya berada di `scripts/`.

## 5. Penyimpanan Lokal Pengguna

Selain database statis, aplikasi menyimpan state lokal di browser:

| Key / storage | Kegunaan |
|---|---|
| `jagad_jawa_mode` / LocalStorage | Mode Pemula atau Ahli |
| Key bahasa / LocalStorage | Preferensi Bahasa Indonesia atau Basa Jawa |
| Bookmark kalender / LocalStorage | Tanggal penting dan catatan pengguna |
| Riwayat jodoh / LocalStorage | Riwayat perhitungan perjodohan |
| `sessionStorage` Sinengker | Status akses sesi Pustaka Sinengker |

Database tersebut bersifat lokal dan statis; aplikasi tidak memiliki backend database atau API bisnis. Perhitungan dilakukan di browser melalui engine ES module.

## 6. Aturan Pemeliharaan

1. Data kanon kalender dan nujum harus diubah melalui sumber database yang sesuai, bukan dengan menambahkan nilai langsung di UI.
2. `nujum-matrix.js` adalah sumber utama 210 kombinasi Bincil. File kompatibilitas lama tidak boleh menjadi sumber kedua.
3. Neptu `ijab` berbeda dari neptu Kalender/Omah dan harus tetap dipisahkan.
4. Label Astawara, Siklus 12, dan Dewane Wuku mengikuti pemisahan di `dewa-kanon.js`.
5. Bila menambah menu baru, perbarui tiga tempat: navigasi desktop/mobile, section `tab-*`, dan tabel peta menu di dokumen ini.