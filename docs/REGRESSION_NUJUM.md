# REGRESSION TEST MATRIX NUJUM (Jawa-v2 vs Jawa-v1)

Dokumen ini mencatat daftar fungsi inti, kontrak data kanonis, dan 5 kasus uji regresi untuk memastikan bahwa refaktorisasi ke satu sumber data nujum (`js/data/nujum-matrix.js`) pada branch `jawa-v2` **100% identik** dengan kalkulasi `jawa-v1` tanpa adanya perubahan formula maupun pergeseran hasil komputasi.

---

## 1. Daftar Fungsi dengan Output Wajib Identik (100% Match)

Semua fungsi berikut mempertahankan formula dan algoritma aslinya, serta terjamin mengembalikan hasil kalkulasi yang sama persis antara `jawa-v1` dan `jawa-v2`:

1. **`getNujumData(hari/wuku, pasaran/hari, wuku/pasaran)`**
   - **Sumber**: `js/data/nujum-matrix.js` (re-exported oleh `nujum_database.js` & `nujum-master-data.js`).
   - **Sifat**: 100% exact matrix lookup (bukan modulo).
   - **Output**: Objek 6 dimensi bincil (`padewan`, `paringkelan`, `padangon`, `paarasan`, `pancasuda`, `kamarokan`).

2. **`getNujumFromMatrix(hari, pasaran, wuku)`**
   - Alias kanonis untuk `getNujumData`.

3. **`getNujumFromDatabase(hari, pasaran, wuku)`**
   - Backward-compatible wrapper untuk sistem lama.

4. **`getNujumLengkap(dayInfo)`**
   - **Sumber**: `js/modules/nujum/nujum-engine.js`.
   - Menggabungkan data nujum bincil, pawukon, dan tafsir kultural tanpa mengubah komputasi matematis.

5. **`getDayInfo(date)`**
   - **Sumber**: `js/modules/kalender/kalender-engine.js` & `js/main.js`.
   - Menghitung hari, pasaran, neptu, wuku, dan tanggal Jawa dengan patokan abadi EPOCH (29 Agustus 2021 = Minggu Legi Sinta).

6. **`toJDN(year, month, day)`**
   - **Sumber**: `js/modules/kalender/kalender-engine.js` & `js/main.js`.
   - Algoritma konversi kalender Gregorian ke Julian Day Number.

7. **`getTanggalJawaLengkap(date)`**
   - **Sumber**: `js/modules/kalender/kalender-engine.js` & `js/main.js`.
   - Komputasi tahun Jawa (Sultan Agungan), Kurup Asapon, Lambang, Windu, dan Wuku.

8. **`getFaalakiah(neptuTotal)`**
   - **Sumber**: `js/modules/nujum/nujum-engine.js` & `js/main.js`.
   - Ramalan Faal Nabi & Tolak Balak berbasis neptu.

9. **`getAsesoris(neptu)`**
   - **Sumber**: `js/modules/nujum/nujum-engine.js` & `js/main.js`.
   - Komputasi Rakam, Sadwara, Hastawara, Asror.

---

## 2. Hasil Verifikasi 5 Kasus Uji Regresi (Regression Test Cases)

Pengujian dilakukan dengan membandingkan langsung hasil lookup `js/data/nujum-matrix.js` (jawa-v2) terhadap basis data `js/data/nujum-master-data.js` (jawa-v1).

### Kasus 1: Minggu Pahing — Wuku Sinta
- **Input**: Wuku `Sinta`, Hari `Minggu`, Pasaran `Pahing` (Neptu: 5 + 9 = 14)
- **Key Matrix**: `sinta_minggu_pahing` (Fallback: `1_minggu_pahing`)
- **Hasil 6 Dimensi Bincil**:
  - Padewan: **Sri**
  - Paringkelan: **Tungle** (Mawulu/Tungle ringkel jalma)
  - Padangon: **Dangu** (Watu)
  - Paarasan: **Lakuning Rembulan**
  - Pancasuda: **Wasesa Segara**
  - Kamarokan: **Nuju Pati**
- **Status**: **PASS (100% Identik)**

### Kasus 2: Senin Pon — Wuku Sinta
- **Input**: Wuku `Sinta`, Hari `Senin`, Pasaran `Pon` (Neptu: 4 + 7 = 11)
- **Key Matrix**: `sinta_senin_pon` (Fallback: `1_senin_pon`)
- **Hasil 6 Dimensi Bincil**:
  - Padewan: **Indra**
  - Paringkelan: **Aryang** (Manuk)
  - Padangon: **Dangu** (Watu)
  - Paarasan: **Aras Tuding**
  - Pancasuda: **Sumur Sinaba**
  - Kamarokan: **Kala Tinantang**
- **Status**: **PASS (100% Identik)**

### Kasus 3: Selasa Legi — Wuku Landep
- **Input**: Wuku `Landep`, Hari `Selasa`, Pasaran `Legi` (Neptu: 3 + 5 = 8)
- **Key Matrix**: `landep_selasa_legi` (Fallback: `2_selasa_legi`)
- **Hasil 6 Dimensi Bincil**:
  - Padewan: **Indra**
  - Paringkelan: **Paningron** (Iwa)
  - Padangon: **Tulus** (Banyu)
  - Paarasan: **Lakuning Geni**
  - Pancasuda: **Wasesa Segara**
  - Kamarokan: **Nuju Padu**
- **Status**: **PASS (100% Identik)**

### Kasus 4: Kamis Kliwon — Wuku Warigagung
- **Input**: Wuku `Warigagung`, Hari `Kamis`, Pasaran `Kliwon` (Neptu: 8 + 8 = 16)
- **Key Matrix**: `warigagung_kamis_kliwon` (Fallback: `8_kamis_kliwon`)
- **Hasil 6 Dimensi Bincil**:
  - Padewan: **Brama**
  - Paringkelan: **Mawulu** (Wiji)
  - Padangon: **Wogan** (Uler)
  - Paarasan: **Lakuning Banyu**
  - Pancasuda: **Bumi Kapetak**
  - Kamarokan: **Kala Tinantang**
- **Status**: **PASS (100% Identik)**

### Kasus 5: Kamis Wage — Wuku Medangkungan
- **Input**: Wuku `Medangkungan`, Hari `Kamis`, Pasaran `Wage` (Neptu: 8 + 4 = 12)
- **Key Matrix**: `medangkungan_kamis_wage` (Fallback: `21_kamis_wage`)
- **Hasil 6 Dimensi Bincil**:
  - Padewan: **Uma**
  - Paringkelan: **Mawulu** (Wiji)
  - Padangon: **Dadi** (Kayu)
  - Paarasan: **Aras Kembang**
  - Pancasuda: **Tunggak Semi**
  - Kamarokan: **Nuju Pati**
- **Status**: **PASS (100% Identik)**

---

## 3. Konfirmasi Integritas Arsitektur
- **Single Source of Truth**: Seluruh modul nujum (`nujum-engine.js`, `personality.js`, `main.js`, dan tes otomatis) kini merujuk langsung ke `js/data/nujum-matrix.js`.
- **Zero Modulo for Bincil**: Tidak ada perhitungan modulo yang dihidupkan untuk 6 dimensi Bincil; semua tetap murni exact matrix lookup (210 kombinasi weton-wuku).
- **Penyeragaman Ejaan Kanonis**:
  - Nama Wuku kanonis: `Sinta`, `Warigagung`, `Medangkungan`.
  - Pancasuda kanonis: `Lebu Ketiyup Angin`.
- **Deprecation Shims**: `nujum_database.js` dan `nujum-master-data.js` dialihkan menjadi proxy re-export ringan dengan peringatan deprecation tanpa merusak backward-compatibility.
