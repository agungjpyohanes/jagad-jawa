# Jagad Jawa — Menjelajahi Kebudayaan Luhur Nusantara

**JAGAD JAWA** · Versi Antigravity Heritage v1.0 (Modular Architecture)

## Struktur Direktori

```
jagad-jawa/
├── index.html              # Entry point (HTML markup only)
├── css/
│   └── styles.css          # Custom CSS (batik, print, animations)
├── js/
│   ├── main.js             # Bootstrap + feature wiring (entry module)
│   ├── data/               # Pure data & pure functions (no DOM)
│   │   ├── calendar.js     # Wuku, Pasaran, JDN, GRID, getDayInfo()
│   │   ├── personality.js  # Faalakiah, Bincil, Asesoris, KARAKTER
│   │   ├── marriage.js     # Pitung Jawa 7 metode hasil
│   │   ├── selametan.js    # Target hari & jenis selametan
│   │   ├── aksara.js       # AKSARA_NGLEGENA mapping
│   │   ├── wayang.js       # Karakter + SVG wayang
│   │   └── pitutur.js      # Pitutur list + quiz questions
│   ├── modules/
│   │   └── audio.js        # Web Audio API (gamelan + Puspawarna + dalang FX)
│   └── ui/
│       ├── toast.js        # Toast + clipboard helpers
│       └── navigation.js   # Tab switch, mobile menu, print
├── vercel.json             # Config deploy Vercel
├── firebase.json           # Config deploy Firebase Hosting
├── .gitignore
└── assets/                 # (reserved)
```

## Prinsip Arsitektur

| Sebelum (Monolitik)              | Sesudah (Modular)                          |
|----------------------------------|--------------------------------------------|
| 1 file HTML 147 KB               | HTML + CSS + banyak ES Module              |
| Semua data + logic di 1 `<script>` | Data terpisah, logic terpisah per domain  |
| Sulit di-test & di-maintain      | Mudah import, tree-shake, unit-test        |
| Global pollution besar           | Explicit `window.xxx` hanya untuk onclick  |

## Cara Menjalankan (Lokal)

Karena memakai **ES Modules**, buka lewat server lokal (bukan `file://`):

```bash
cd jagad-jawa
python3 -m http.server 8080
# Buka http://localhost:8080
```

Atau Live Server / VS Code / **Google Antigravity**.

---

## Deploy ke GitHub + Vercel / Firebase

### 1. Push ke GitHub

```bash
cd jagad-jawa
git init
git add .
git commit -m "feat: Jagad Jawa modular portal budaya"
git branch -M main
git remote add origin https://github.com/USERNAME/jagad-jawa.git
git push -u origin main
```

### 2. Deploy Vercel (paling mudah)

1. Buka [vercel.com](https://vercel.com) → **Import Project** dari GitHub
2. Framework Preset: **Other** / Static
3. Root Directory: biarkan `.` (titik)
4. Deploy → otomatis dapat URL `*.vercel.app`

File `vercel.json` sudah disiapkan.

### 3. Deploy Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # pilih existing project atau buat baru
# Pastikan public directory = .
firebase deploy
```

File `firebase.json` sudah disiapkan.

### Catatan Google Antigravity

Jika mengembangkan lewat Google Antigravity:
- Buka folder `jagad-jawa` sebagai workspace
- Gunakan Live Preview / local server yang mendukung ES Modules
- Semua perubahan di `js/data/`, `js/modules/`, `js/ui/` langsung ter-hot-reload (jika server support)

---

## Fitur yang Tersedia (sama seperti versi monolitik)

1. **Beranda** – Hero + quick weton hari ini  
2. **Kalender Jawa** – Generator bulan + kode Ala/Becik + print  
3. **Nujum Kepribadian** – Bincil, Faalakiah 12 Nabi, Asesoris  
4. **Pitung Perjodohan** – 7 metode primbon  
5. **Selametan Wong Mulih** – 3, 7, 40, 100, Pendak, Nyewu  
6. **Gamelan Maya** – Saron + Bonang + Gong (Slendro/Pelog) + keyboard  
7. **Studio Aksara Jawa** – Transliterasi + bagan + canvas tulis  
8. **Kelir Wayang** – Drag puppet + pilih tokoh + kepyak  
9. **Pitutur & Kuis** – Falsafah acak + kuis 5 soal bergelar  

## Pengembangan Lanjutan

- Bisa diganti ke **React / Vue / Svelte** dengan memindahkan tiap tab menjadi komponen.
- Data di `js/data/` sudah pure → cocok untuk unit test atau backend API.
- Audio engine terisolasi di `modules/audio.js`.

© 2026 JAGAD JAWA — Menjelajahi Kebudayaan Luhur Nusantara
