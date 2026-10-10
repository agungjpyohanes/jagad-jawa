# Migrasi Data Jagad Jawa ke Cloudflare KV & Pages Functions

Dokumen ini mencatat inventaris lengkap, pemetaan dataset, baseline checksum, allowlist canonical keys, status in-memory fallback, dan arsitektur Pages Functions API untuk migrasi data Jagad Jawa dari file JSON statis dan modul `js/data/*.js` ke Cloudflare KV.

---

## 1. Inventaris dan Pemetaan Dataset (Domain, Source, Canonical Key, Consumer)

| Domain / Fitur | Data Source Saat Ini | File Target Lokal | Canonical Key KV | Mapper / Normalizer di `dbLoader.js` | Consumer / Engine | Jalur Akses (Sync/Async) | Existing Tests | Status Migrasi Aktual |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kalender Inti** | `01-kalender-constants.json`, `js/data/calendar.js` | `01-kalender-constants.json` | `kalender:constants` | `mapKalenderConstants` | `kalender-engine.js`, `kalender-ui.js` | Async bootstrap + in-memory cache | `kalender.test.js`, `pure-functions.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pawukon Ensiklopedia** | `02-wuku-ensiklopedia.json`, `js/data/pawukon.js` | `02-wuku-ensiklopedia.json` | `wuku:ensiklopedia` | `mapWukuItem` | `wuku-engine.js`, `wuku-ui.js` | Async (`loadDomainData('wuku')`) | `wuku-encyclopedia.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Nujum Bincil Arti** | `03-bincil-arti.json` | `03-bincil-arti.json` | `bincil:arti` | `extractText`, identity | `nujum-engine.js`, `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Dino Rules** | `04-dino-rules.json`, `js/data/calendar.js` | `04-dino-rules.json` | `dino:rules` | `mapDinoRules` | `kalender-engine.js`, `kalender-ui.js` | Async (`loadDomainData('kalender')`) | `kalender.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pranata Mangsa** | `05-pranata-mangsa.json` | `05-pranata-mangsa.json` | `pranata:mangsa` | identity | `kalender-engine.js`, `sapa-dina-ui.js` | Async (`loadDomainData('kalender')`) | `pranata-mangsa.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Bincil Matrix** | `06-bincil-matrix-bilingual.json`, `js/data/nujum-matrix.js` | `06-bincil-matrix-bilingual.json` | `bincil:matrix` | identity | `nujum-engine.js`, `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js`, `pure-functions.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Zodiak** | `07-zodiak-bilingual.json` | `07-zodiak-bilingual.json` | `zodiak:all` | identity | `nujum-ui.js`, `nujum-share-card.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Sasi Jawa** | `08-sasi-jawa-bilingual.json` | `08-sasi-jawa-bilingual.json` | `sasi:jawa` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Shio & Wu Xing** | `09-shio-wuxing-bilingual.json` | `09-shio-wuxing-bilingual.json` | `shio:wuxing` | identity | `nujum-ui.js`, `ensiklopedia-budaya.js` | Async (`loadDomainData('nujum')`) | `jawa-v9-features.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pasaran Watak** | `10-pasaran-watak-bilingual.json` | `10-pasaran-watak-bilingual.json` | `pasaran:watak` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pitung Perjodohan** | `11-pitung-perjodohan-bilingual.json` | `11-pitung-perjodohan-bilingual.json` | `perjodohan:pitung` | `mapPitungPerjodohan` | `jodoh-engine.js`, `jodoh-ui.js` | Async (`loadDomainData('jodoh')`) | `jodoh.test.js`, `pure-functions.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Karakter Dasar** | `12-karakter-dasar-bilingual.json` | `12-karakter-dasar-bilingual.json` | `karakter:dasar` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pekerjaan Weton** | `13-pekerjaan-weton-bilingual.json` | `13-pekerjaan-weton-bilingual.json` | `pekerjaan:weton` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Selametan Rules** | `14-selametan-rules.json`, `js/data/selametan.js` | `14-selametan-rules.json` | `selametan:rules` | `mapSelametanRules` | `selametan-engine.js`, `selametan-ui.js` | Async (`loadDomainData('selametan')`) | `selametan.test.js`, `selametan-wizard.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Petung Ijab** | `15-ijab-bilingual.json`, `js/data/ijab-db.js` | `15-ijab-bilingual.json` | `ijab:all` | `mapPetungIjab` | `ijab-engine.js`, `ijab-ui.js` | Async (`loadDomainData('ijab')`) | `petung-ijab.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pitung Alt** | `16-pitung-perjodohan.json` | `16-pitung-perjodohan.json` | `perjodohan:pitung-alt` | `mapPitungPerjodohan` | `jodoh-engine.js` | Async (`loadDb('perjodohan:pitung-alt')`) | `jodoh.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Aksara Perjodohan** | `17-aksara-perjodohan.json` | `17-aksara-perjodohan.json` | `aksara:perjodohan` | `mapPitungPerjodohan` | `jodoh-engine.js`, `jodoh-ui.js` | Async (`loadDb('aksara:perjodohan')`) | `jodoh.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Selametan Alt** | `18-selametan-rules.json` | `18-selametan-rules.json` | `selametan:rules-alt` | `mapSelametanRules` | `selametan-engine.js` | Async | `selametan.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Ijab Alt** | `19-ijab.json` | `19-ijab.json` | `ijab:alt` | `mapPetungIjab` | `ijab-engine.js` | Async | `petung-ijab.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Sasmitha** | `20-sasmitha.json`, `js/data/sasmitha-db.js` | `20-sasmitha.json` | `sasmitha:all` | identity | `sasmitha-engine.js`, `sasmitha-ui.js` | Async (`loadDomainData('sasmitha')`) | `sasmitha.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Petung Tetanen** | `21-petung-tetanen-bilingual.json`, `js/data/petung-tetanen-db.js` | `21-petung-tetanen-bilingual.json` | `petung:tetanen` | identity | `kalender-ui.js`, `sapa-dina-engine.js` | Async (`loadDomainData('sapa-dina')`) | `petung-tetanen.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Petung Ternak & Kehidupan** | `22-petung-ternak-bilingual.json`, `js/data/petung-ternak-loro-geblak.js` | `22-petung-ternak-bilingual.json` | `petung:ternak` | `mapPetungKehidupan` | `petung-kehidupan-engine.js`, `petung-kehidupan-ui.js` | Async (`loadDomainData('petung-kehidupan')`) | `petung-ternak-loro-geblak.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Petung Omah** | `23-omah-bilingual.json`, `js/data/omah-db.js` | `23-omah-bilingual.json` | `omah:all` | `mapPetungOmah` | `omah-engine.js`, `omah-ui.js` | Async (`loadDomainData('omah')`) | `petung-omah.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Wuku Petenget** | `24-wuku-petenget-bilingual.json`, `js/data/wuku-petenget-db.js` | `24-wuku-petenget-bilingual.json` | `wuku:petenget` | identity | `kalender-ui.js`, `wuku-engine.js` | Async (`loadDomainData('wuku')`) | `petung-tetanen.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Siklus Padewan** | `25-siklus-padewan-bilingual.json` | `25-siklus-padewan-bilingual.json` | `siklus:padewan` | identity | `padewan-ui.js`, `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `jawa-v9-features.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Palenggahan** | `26-palenggahan-bilingual.json` | `26-palenggahan-bilingual.json` | `palenggahan:all` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Bincil Arti Bilingual** | `27-bincil-arti-bilingual.json` | `27-bincil-arti-bilingual.json` | `bincil:arti-bilingual` | identity | `nujum-engine.js` | Async | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Marriage Hasil Bilingual** | `28-marriage-hasil-bilingual.json` | `28-marriage-hasil-bilingual.json` | `marriage:hasil-bilingual` | identity | `jodoh-engine.js` | Async | `jodoh.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Sasi Jawa Alt** | `29-sasi-jawa-bilingual.json` | `29-sasi-jawa-bilingual.json` | `sasi:jawa-alt` | identity | `nujum-ui.js` | Async | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Aksara Nglegena** | `30-aksara-nglegena-bilingual.json` | `30-aksara-nglegena-bilingual.json` | `aksara:nglegena` | identity | `aksara-engine.js` | Async (`loadDomainData('aksara')`) | `aksara.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Dino Gede** | `31-dino-gede-bilingual.json` | `31-dino-gede-bilingual.json` | `dino:gede` | `mapDinoRules` | `kalender-engine.js` | Async (`loadDomainData('kalender')`) | `kalender.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Sirikan Adhep** | `32-dino-sirikan-adhep-bilingual.json` | `32-dino-sirikan-adhep-bilingual.json` | `sirikan:adhep` | identity | `nujum-ui.js` | Async (`loadDomainData('nujum')`) | `nujum.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Kamus Jawa** | `33-kamus-jawa.json`, `kamus-jawa.json` | `33-kamus-jawa.json` | `kamus:jawa` | identity | `pustaka-ui.js` | Async (`loadDb('kamus:jawa')`) | `jawa-v9-features.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Kamus Sansakerta** | `34-kamus-sansakerta.json`, `kamus-sansakerta.json` | `34-kamus-sansakerta.json` | `kamus:sanskerta` | identity | `pustaka-ui.js` | Async (`loadDb('kamus:sanskerta')`) | `jawa-v9-features.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pustaka Dongo** | `35-pustaka-dongo.json` | `35-pustaka-dongo.json` | `pustaka:dongo` | identity | `pustaka-ui.js`, `pustaka-engine.js` | Async (`loadDomainData('pustaka')`) | `pustaka.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Pustaka Jawa** | `36-pustaka-jawa.json` | `36-pustaka-jawa.json` | `pustaka:jawa` | identity | `pustaka-ui.js` | Async (`loadDomainData('pustaka')`) | `sinengker.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Sinengker Khusus** | `37-sinengker-khusus.json` | `37-sinengker-khusus.json` | `sinengker:khusus` | identity | `sinengker-ui.js`, `sinengker-engine.js` | Async (`loadDomainData('sinengker')`) | `sinengker.test.js` | Remote KV Live (37-key set) + Fallback In-Memory Aktif |
| **Wayang Purwa (Supplemental)** | `38-wayang-all.json`, `js/data/wayang.js` | `38-wayang-all.json` | `wayang:all` | identity | `wayang-engine.js`, `wayang-ui.js` | Async (`loadDomainData('wayang')`) | `differential-parity.test.js` | **Lokal Siap (Belum Diunggah ke Remote KV)** |
| **Pitutur Luhur (Supplemental)** | `39-pitutur-all.json`, `js/data/pitutur.js` | `39-pitutur-all.json` | `pitutur:all` | identity | `pitutur-ui.js` | Async (`loadDomainData('pitutur')`) | `differential-parity.test.js` | **Lokal Siap (Belum Diunggah ke Remote KV)** |
| **Mitologi Nusantara (Supplemental)** | `40-mitologi-all.json`, `js/data/mitologi-nusantara-db.js` | `40-mitologi-all.json` | `mitologi:all` | identity | `mitologi-ui.js` | Async (`loadDomainData('mitologi')`) | `differential-parity.test.js` | **Lokal Siap (Belum Diunggah ke Remote KV)** |
| **Pustaka Digital (Supplemental)** | `41-pustaka-digital.json`, `js/data/pustaka-digital-db.js` | `41-pustaka-digital.json` | `pustaka:digital` | identity | `pustaka-ui.js` | Async (`loadDomainData('pustaka')`) | `differential-parity.test.js` | **Lokal Siap (Belum Diunggah ke Remote KV)** |
| **Tumpeng Tombak Rojo (Supplemental)** | `42-tumpeng-all.json`, `js/data/tumpeng.js` | `42-tumpeng-all.json` | `tumpeng:all` | identity | `sinengker-ui.js`, `tumpeng.js` | Async (`loadDomainData('tumpeng')`) | `differential-parity.test.js` | **Lokal Siap (Belum Diunggah ke Remote KV)** |

---

## 2. Status Transparansi In-Memory Fallback & Runtime

### Apakah In-Memory Fallback Masih Aktif di Production?
**YA.** Seluruh fallback lokal statis masih aktif dan sengaja dipertahankan di bundle JavaScript browser (`dist/assets/index-*.js`).

### Modul dan Tabel yang Masih Dibundel ke Frontend:
1. `js/data/calendar.js` (konstanta `DINA`, `PASARAN`, `WUKU`, `NEPTU_DINA`, `NEPTU_PASARAN`).
2. `js/data/nujum-matrix.js` (`NUJUM_MATRIX` 210 weton x wuku).
3. `js/data/pawukon.js` (ensiklopedia wuku).
4. `js/data/marriage.js` (tabel hasil perjodohan).
5. `js/data/selametan.js` (tabel aturan pengetan 7 tahapan).
6. `js/data/ijab-db.js` (database ijab neptu).
7. `js/data/omah-db.js` (aturan petung omah & cempuri lawangan).
8. `js/data/petung-ternak-loro-geblak.js` (35 weton petung kehidupan).
9. `js/data/petung-tetanen-db.js` (35 weton petung tetanen).
10. `js/data/wuku-petenget-db.js` (4 pilar wuku petenget).
11. `js/data/sasmitha-db.js`, `pustaka-db.js`, `pustaka-jawa-db.js`, `sinengker-db.js`.
12. Modul supplemental: `wayang.js`, `pitutur.js`, `mitologi-nusantara-db.js`, `pustaka-digital-db.js`, `tumpeng.js`.

### Implikasi Terhadap Klaim Migrasi:
> [!WARNING]
> **Sumber data runtime Jagad Jawa saat ini belum 100% murni KV.**
> - **37 key pertama:** Telah berhasil dialihkan pemanggilan utamanya ke `/api/data/:key` yang membaca dari Cloudflare KV. Jika API merespons dengan sukses (200), data dari KV langsung menggantikan data memori. Namun jika terjadi kegagalan jaringan atau timeout, aplikasi menggunakan in-memory fallback agar pengguna tidak mengalami layar putih (blank screen).
> - **5 key suplemental:** Belum diunggah ke remote KV production. Di production, kelima domain tersebut saat ini masih sepenuhnya bergantung pada file statis JSON Pages (`/data/*.json`) atau bundle fallback JS.
> - **Kesimpulan:** Arsitektur saat ini berstatus **Hybrid / Gradual Migration dengan Resilient Fallback**, bukan migrasi monolitik murni KV.

---

## 3. Emulasi Binding Lokal vs Verifikasi Remote KV

- **`wrangler pages dev dist --kv JAGAD_JAWA_DATA=...`**: Perintah ini menjalankan emulasi Cloudflare Pages Functions secara **LOKAL**. Flag `--kv` pada Wrangler Pages Dev mengikat namespace ke simulator Miniflare lokal. Ini membuktikan bahwa interface API function, deserialisasi JSON, dan allowlist manifest bekerja dengan benar, **tetapi BUKAN merupakan bukti bahwa data live sedang ditarik dari Cloudflare Edge Remote di production**.
- **Pages Preview Production:** Untuk memverifikasi baca remote KV sesungguhnya, diperlukan deployment branch preview di Cloudflare Dashboard dengan binding KV `JAGAD_JAWA_DATA` yang aktif, diikuti verifikasi network request browser pada URL `*.pages.dev`.

---

## 4. Runbook Manual Pemilik Repository (PowerShell Windows)

> [!IMPORTANT]
> **STATUS:** `[BELUM DIJALANKAN - PENDING MANUAL OWNER]`
> Remote KV `JAGAD_JAWA_DATA` telah terverifikasi memiliki 37 key canonical awal.
> **JANGAN gunakan payload 42-key untuk upload**, karena akan menulis ulang (overwrite) 37 key lama yang sudah stabil.
> Gunakan payload supplemental khusus (`wrangler-kv-supplemental-payload.json`) yang tepat berisi 5 key baru.

### Langkah 1: Periksa Sesi Wrangler & Dapatkan Namespace ID
Jalankan di PowerShell:
```powershell
npx wrangler whoami
npx wrangler kv namespace list
```

### Langkah 2: Dry-Run Verifikasi Payload Supplemental
Pastikan payload supplemental hanya berisi 5 key baru dan 0 key lama:
```powershell
npm run kv:dry-run:supplemental
```
Assertion internal akan menggagalkan script jika mendeteksi adanya key dari 37 key lama.

### Langkah 3: Ekspor Payload Supplemental ke File JSON
```powershell
npm run kv:export:supplemental
```
File akan ditulis ke `kv-export/wrangler-kv-supplemental-payload.json` (~90 KB).

### Langkah 4: [MANUAL OWNER PENDING] Upload 5 Key ke Cloudflare KV Remote
> Eksekusi perintah ini hanya jika pemilik repo telah menyetujui pembaruan namespace remote:
```powershell
$NamespaceId = "ab767d14bb984c9cba974962be52b9d8"
npx wrangler kv bulk put kv-export/wrangler-kv-supplemental-payload.json --namespace-id $NamespaceId --remote
```

### Langkah 5: Verifikasi Salah Satu Key Baru di Remote
Verifikasi bahwa key baru telah tersimpan di remote tanpa mencetak seluruh payload:
```powershell
$NamespaceId = "ab767d14bb984c9cba974962be52b9d8"
npx wrangler kv key get "wayang:all" --namespace-id $NamespaceId --remote --text
```

### Langkah 6: Verifikasi Cloudflare Pages Preview (Setelah Binding Aktif)
Setelah 5 key supplemental diunggah dan branch `feat/cloudflare-kv-data-migration` dibuatkan Preview Deployment di Cloudflare Pages:
1. Pastikan binding KV `JAGAD_JAWA_DATA` telah dikonfigurasi pada environment Preview di Dashboard Cloudflare Pages (Settings -> Functions -> KV namespace bindings).
2. Buka URL Preview (`https://<hash>.jagad-jawa.pages.dev`).
3. Buka DevTools Network Tab:
   - Amati request ke `/api/data/wayang%3Aall` dan `/api/data/kalender%3Aconstants`.
   - Pastikan status response adalah `200 OK` dengan header `X-Content-Type-Options: nosniff`.
   - Pastikan tidak ada fallback ke `/data/38-wayang-all.json`.

---

## 5. Cakupan Pengujian & Differential Parity Suite

### Cakupan Parity Saat Ini:
Parity test suite (`tests/differential-parity.test.js`) menguji 9 skenario inti untuk membuktikan kalkulasi matematis/tradisi antara in-memory fallback vs payload KV menghasilkan data identik karakter-per-karakter:
1. **Kalender Neptu & Dino Rules:** Parity antara `01-kalender-constants.json` vs fallback `calendar.js`.
2. **Pawukon Ensiklopedia:** Parity 30 wuku antara `02-wuku-ensiklopedia.json` vs `pawukon.js`.
3. **Nujum Kepribadian (Bincil Matrix):** Parity 210 sel weton x wuku antara `06-bincil-matrix-bilingual.json` vs `nujum-matrix.js`.
4. **Pitung Perjodohan (6 Metode):** Parity formula neptu perjodohan antara `11-pitung-perjodohan-bilingual.json` vs `marriage.js`.
5. **Selametan Pengetan Wafat:** Parity 7 interval pengetan wafat antara `14-selametan-rules.json` vs `selametan.js`.
6. **Petung Omah:** Parity rumus sisa 4 & 5 antara `23-omah-bilingual.json` vs `omah-db.js`.
7. **Petung Ijab:** Parity neptu ijab antara `15-ijab-bilingual.json` vs `ijab-db.js`.
8. **Petung Tetanen & Petenget Wuku:** Parity 35 weton pilar tanaman & 30 wuku petenget.
9. **Kamus & Sasmitha:** Parity dataset lema kamus dan firasat sasmitha.

### Dataset & Fitur yang Belum Masuk ke Parity Suite Otomatis:
- **Transliterasi Aksara Latin-Jawa Dinamis (`js/data/aksara.js`):** Transliterasi berbasis regex dan parser vokal/konsonan yang kompleks.
- **Kompas Danyang 360° Visual Canvas (`js/data/sinengker-db.js`):** Elemen visual canvas rendering yang memerlukan DOM emulasi canvas.
- **SVG Generator Shio-Wu Xing (`js/data/shio-wuxing-art.js`):** Generator grafis SVG murni.
- **Tumpeng Ubarampe Interaktif (`js/data/tumpeng.js`):** Interaksi seleksi visual bahan sesaji.
