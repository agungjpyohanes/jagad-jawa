# KANON DEWA/WUKU/PADEWAN — Jagad Jawa v3

> **Dokumen ini adalah referensi implementasi resmi.**  
> Terakhir diperbarui: 2026-09-23 (jawa-v3, B1–B4)

---

## Tiga Sistem Penamaan (TIDAK BOLEH DICAMPUR)

| Sistem | File Data | Jumlah | Format | Contoh |
|---|---|---|---|---|
| **A1 — Astawara 8** | `nujum-matrix.js` (field `padewan`) | 8 | Label pendek **tanpa** Batara/Batari | `"Sri"`, `"Yamadipati"` |
| **A2 — Siklus 12** | `siklus-master-data.js`, `personality.js` | 12 | **Dengan** Batara/Batari | `"Batari Durga"`, `"Batara Kamajaya"` |
| **A3 — Dewane Wuku** | `pawukon.js` | 30 | Prefix `"Sang Hyang …"` | `"Sang Hyang Yamadipati"` |

### Aturan Gender Kanon (A2)
- **Batari** (perempuan): Durga (#3), Sri (#8), Nagagini (#6)
- **Batara** (laki-laki): semua yang lain

---

## Single Source of Truth: `js/data/dewa-kanon.js`

```
js/data/dewa-kanon.js
├── ASTAWARA_8        — 8 entry A1 + aliases[]
├── SIKLUS_12         — 12 entry A2 + gender + aliases[]
├── WUKU_DEWA         — 30 entry A3 + dewaneSlug + aliases[]
├── Lookup Maps       — ASTAWARA_BY_SLUG, SIKLUS_BY_SLUG, WUKU_DEWA_BY_NO, dll.
├── Resolver          — normalizeDewaName(), resolveAstawara(), resolveSiklus12(), resolveWukuDewa()
├── Illustration Path — illustrationPath(), wukuIllustrationPath(), dewaneIllustrationPath()
└── Legacy Path       — wukuLegacyImagePath(), dewaneLegacyImagePath(), resolvedImagePath()
```

---

## Tabel Koreksi (Non-Kanon → Kanon)

### A2 — Siklus 12 (`siklus-master-data.js`, `personality.js`)

| Order | Sebelum ❌ | Sesudah ✅ | Alasan |
|---|---|---|---|
| #3 | `Batara Durga` / `Batari Durgo` | `Batari Durga` | Gender + ejaan |
| #6 | `Batari Nogogini` | `Batari Nagagini` | Ejaan kanon |
| #7 | `Batara Komojoyo` | `Batara Kamajaya` | Ejaan kanon |
| #8 | `Batara Sri` | `Batari Sri` | Gender (perempuan) |
| #12 | `Batara Yomodipati` | `Batara Yamadipati` | Ejaan kanon |

### A3 — Dewane Wuku (`pawukon.js`)

| Wuku | Sebelum ❌ | Sesudah ✅ | Alasan |
|---|---|---|---|
| Sinta #1 | `Sang Hyang Nyamadipati` | `Sang Hyang Yamadipati` | Ejaan kanon |
| Galungan #11 | `Sang Hyang Kumajaya` | `Sang Hyang Kamajaya` | Ejaan kanon |
| Kuningan #12 | `Sang Hyang Endra` | `Sang Hyang Indra` | Ejaan kanon |
| Julungpujut #15 | `Sang Hyang Guretna` | `Sang Hyang Guritna` | Ejaan kanon |
| Tambir #19 | `sang Hyang Siwah` | `Sang Hyang Siwah` | Kapital |
| Watugunung #30 | `… Batara Nagagini` | `… Batari Nagagini` | Gender (perempuan) |

---

## Alias yang Masih Bisa Digunakan (Input/Pencarian)

Semua nama lama tersimpan di `aliases[]` di `dewa-kanon.js`. Resolver otomatis mengembalikan kanon:

```js
resolveSiklus12('Nogogini').label  // → 'Batari Nagagini'
resolveSiklus12('Komojoyo').label  // → 'Batara Kamajaya'
resolveSiklus12('Durgo').label     // → 'Batari Durga'
resolveWukuDewa('Sang Hyang Nyamadipati').dewane  // → 'Sang Hyang Yamadipati'
resolveWukuDewa('Sang Hyang Kumajaya').dewane     // → 'Sang Hyang Kamajaya'
normalizeDewaName('Guretna')       // → 'Sang Hyang Guritna'
```

---

## Aset Ilustrasi

### Sudah Ada (Legacy)
- `assets/wuku/*.jpg` — 30 file (nama: `{NamaWuku}.jpg`)
- `assets/dewa-wuku/*.jpg` — 30 file (nama: `Sang Hyang XXX.jpg`)

### Placeholder (Belum Ada Gambar)
- `assets/illustrations/siklus12/*.webp` — 12 placeholder
- `assets/illustrations/astawara/*.webp` — 8 placeholder

### Path Convention
```js
illustrationPath('wuku', 'sinta')         // '/assets/illustrations/wuku/sinta.webp'
resolvedImagePath('wuku', 1).best         // 'assets/wuku/Sinta.jpg' ← pakai ini sekarang
resolvedImagePath('siklus12', 3).best     // '/assets/illustrations/siklus12/durga.webp' (placeholder)
```

> [!NOTE]
> File `assets/illustrations/manifest.json` mendokumentasikan status tiap slug.

---

## Wire Architecture

```
dewa-kanon.js (SSOT)
  ↑ export
  ├── personality.js    → re-export semua resolver
  ├── wuku-engine.js    → getWukuDetailSummary() + searchWuku() dengan alias normalize
  └── nujum-ui.js       → import resolver untuk display normalize
       ↑ consumer
       ├── wuku-ui.js          → summary.dewane = kanon dari getWukuDetailSummary()
       └── renderSiklusTahunanCardHtml()  → pad.nama dari hitungSiklusTahunan() (sudah kanon)
```

---

## Larangan Keras (DO NOT)

1. **JANGAN** mengubah EPOCH, NEPTU, pitung, atau isi sel numerik `nujum-matrix.js`
2. **JANGAN** menampilkan `"Batari Sri"` sebagai label output matrix astawara (A1)
3. **JANGAN** mencampur sistem — output nujum bincil pakai A1, siklus 12 pakai A2, wuku detail pakai A3
4. **JANGAN** hardcode nama non-kanon sebagai string default di UI/PDF

---

## Cara Menambah Ilustrasi Baru

1. Upload file `{slug}.webp` ke folder yang sesuai:
   - Wuku: `assets/illustrations/wuku/{wukuSlug}.webp`
   - Dewane: `assets/illustrations/dewane/{dewaneSlug}.webp`
   - Siklus 12: `assets/illustrations/siklus12/{slug}.webp`
   - Astawara 8: `assets/illustrations/astawara/{slug}.webp`
2. Update `assets/illustrations/manifest.json` → ubah `imageStatus` dari `"placeholder"` ke `"ready"`
3. `resolvedImagePath('wuku', slug).best` otomatis memilih `.webp` jika ada, `.jpg` jika tidak

---

## Menjalankan Test

```bash
# Seluruh test
npm test

# Hanya test kanon dewa/wuku
node --test tests/dewa-kanon.test.js

# Hanya test ensiklopedia wuku
node --test tests/wuku-encyclopedia.test.js
```

---

## Checklist DoD (Definition of Done)

- [x] `js/data/dewa-kanon.js` — SSOT dibuat, 3 sistem terpisah
- [x] `js/data/siklus-master-data.js` — 4 koreksi nama (Durga, Nagagini, Kamajaya, Yamadipati)
- [x] `js/data/pawukon.js` — 6 koreksi dewane kanon
- [x] `js/data/personality.js` — 4 koreksi PADEWAN array + re-export resolver
- [x] `js/modules/wuku/wuku-engine.js` — getWukuDetailSummary() enriched + searchWuku() alias-aware
- [x] `js/modules/nujum/nujum-ui.js` — import resolver kanon
- [x] `assets/illustrations/manifest.json` — manifest 4 kategori, semua slug
- [x] `assets/illustrations/{wuku,dewane,siklus12,astawara}/` — folder stubs
- [x] `tests/dewa-kanon.test.js` — 30+ test case alias → kanon
- [x] `tests/wuku-encyclopedia.test.js` — diperbarui untuk kanon baru
- [x] `tests/nujum.test.js` — diperbarui (Shinto → Sinta kanon)
- [x] Zero non-kanon string di path UI/data (grep clean)
- [x] Formula matrix 210 / NEPTU / EPOCH tidak diubah
- [x] Astawara A1 output tidak mengandung "Batari Sri"
