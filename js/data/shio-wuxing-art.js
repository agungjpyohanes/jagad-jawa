/**
 * Jagad Jawa — Aset Vektor Ilustrasi Shio & Teori 5 Elemen (Wu Xing)
 * Menyediakan representasi SVG berornamen keraton & prada emas
 * untuk 12 Shio siklus hewan dan 5 Elemen Wu Xing tanpa risiko broken image.
 */

export const SHIO_EMBLEMS = {
  "Tikus": {
    nama: "Tikus",
    aksara: "ꦕꦸꦫꦸꦠ꧀",
    simbol: "🐀",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Body of Rat -->
      <ellipse cx="50" cy="55" rx="22" ry="16" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <!-- Head -->
      <path d="M68 52 C76 48 80 55 76 60 C70 65 62 60 62 55 Z" fill="#d4af37"/>
      <!-- Ears -->
      <circle cx="62" cy="42" r="7" fill="rgba(212,175,55,0.6)" stroke="#fef08a" stroke-width="1.2"/>
      <circle cx="54" cy="40" r="6" fill="rgba(212,175,55,0.4)" stroke="#fef08a" stroke-width="1"/>
      <!-- Whiskers & Eye -->
      <circle cx="72" cy="52" r="1.8" fill="#ffffff"/>
      <path d="M74 54 L84 52 M74 56 L83 58 M74 58 L82 62" stroke="#fef08a" stroke-width="1"/>
      <!-- Tail -->
      <path d="M28 55 C18 50 16 35 24 30" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">TIKUS (ZI)</text>
    </svg>`
  },
  "Kerbau": {
    nama: "Kerbau",
    aksara: "ꦏꦼꦧꦺꦴ",
    simbol: "🐂",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Horns -->
      <path d="M30 38 C32 20 44 24 50 34 C56 24 68 20 70 38" fill="none" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <!-- Head -->
      <path d="M36 42 Q50 38 64 42 L60 62 Q50 68 40 62 Z" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="2"/>
      <!-- Muzzle -->
      <ellipse cx="50" cy="58" rx="10" ry="7" fill="#d4af37"/>
      <circle cx="46" cy="59" r="1.5" fill="#121722"/>
      <circle cx="54" cy="59" r="1.5" fill="#121722"/>
      <!-- Eyes -->
      <circle cx="42" cy="48" r="2.2" fill="#fef08a"/>
      <circle cx="58" cy="48" r="2.2" fill="#fef08a"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">KERBAU (CHOU)</text>
    </svg>`
  },
  "Macan": {
    nama: "Macan",
    aksara: "ꦩꦕꦤ꧀",
    simbol: "🐅",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Tiger Head -->
      <circle cx="50" cy="50" r="18" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="2"/>
      <!-- Ears -->
      <path d="M35 36 Q38 28 44 34 Z M65 36 Q62 28 56 34 Z" fill="#d4af37" stroke="#fef08a" stroke-width="1"/>
      <!-- Forehead Wang Symbol (王) -->
      <path d="M46 40 L54 40 M47 43 L53 43 M46 46 L54 46 M50 40 L50 46" stroke="#fef08a" stroke-width="1.2"/>
      <!-- Eyes & Snout -->
      <circle cx="43" cy="50" r="2" fill="#fef08a"/>
      <circle cx="57" cy="50" r="2" fill="#fef08a"/>
      <polygon points="50,56 46,53 54,53" fill="#d4af37"/>
      <!-- Stripes -->
      <path d="M34 50 L39 50 M66 50 L61 50 M36 56 L41 54 M64 56 L59 54" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">MACAN (YIN)</text>
    </svg>`
  },
  "Kelinci": {
    nama: "Kelinci",
    aksara: "ꦠꦿꦸꦮꦺꦭꦸ",
    simbol: "🐇",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Long Ears -->
      <ellipse cx="44" cy="30" rx="4.5" ry="14" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <ellipse cx="56" cy="30" rx="4.5" ry="14" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <ellipse cx="44" cy="30" rx="2" ry="9" fill="#f472b6" opacity="0.6"/>
      <ellipse cx="56" cy="30" rx="2" ry="9" fill="#f472b6" opacity="0.6"/>
      <!-- Head & Cheeks -->
      <circle cx="50" cy="52" r="14" fill="rgba(245,197,66,0.25)" stroke="#d4af37" stroke-width="1.8"/>
      <!-- Eyes & Nose -->
      <circle cx="44" cy="50" r="2.2" fill="#fef08a"/>
      <circle cx="56" cy="50" r="2.2" fill="#fef08a"/>
      <circle cx="50" cy="56" r="1.5" fill="#f472b6"/>
      <path d="M47 59 Q50 61 53 59" stroke="#d4af37" stroke-width="1" fill="none"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">KELINCI (MAO)</text>
    </svg>`
  },
  "Naga": {
    nama: "Naga",
    aksara: "ꦤꦒ",
    simbol: "🐉",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Dragon Horns & Crest -->
      <path d="M44 32 L40 22 M56 32 L60 22 M50 30 L50 20" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
      <!-- Dragon Head -->
      <path d="M38 42 Q50 34 62 42 L66 56 Q50 64 34 56 Z" fill="rgba(245,197,66,0.35)" stroke="#d4af37" stroke-width="2"/>
      <!-- Glowing Eyes -->
      <circle cx="44" cy="46" r="3" fill="#fef08a"/>
      <circle cx="56" cy="46" r="3" fill="#fef08a"/>
      <circle cx="44" cy="46" r="1.2" fill="#991b1b"/>
      <circle cx="56" cy="46" r="1.2" fill="#991b1b"/>
      <!-- Dragon Whiskers -->
      <path d="M40 56 Q30 62 26 54 M60 56 Q70 62 74 54" stroke="#fef08a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <!-- Pearl of Wisdom -->
      <circle cx="50" cy="62" r="3" fill="#fff" stroke="#f5c542" stroke-width="1"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">NAGA (CHEN)</text>
    </svg>`
  },
  "Ular": {
    nama: "Ular",
    aksara: "ꦈꦭ",
    simbol: "🐍",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Coiled Body -->
      <path d="M50 65 C32 65 32 46 50 46 C64 46 66 32 52 30 C44 29 40 33 38 36" fill="none" stroke="#d4af37" stroke-width="5" stroke-linecap="round"/>
      <!-- Snake Head -->
      <path d="M52 28 Q58 24 64 28 Q62 34 54 32 Z" fill="#d4af37" stroke="#fef08a" stroke-width="1.5"/>
      <circle cx="58" cy="27" r="1.5" fill="#fef08a"/>
      <!-- Forked Tongue -->
      <path d="M64 29 L70 29 L73 26 M70 29 L73 32" stroke="#f43f5e" stroke-width="1.2" fill="none"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">ULAR (SI)</text>
    </svg>`
  },
  "Kuda": {
    nama: "Kuda",
    aksara: "ꦗꦫꦤ꧀",
    simbol: "🐎",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Mane -->
      <path d="M38 28 Q44 20 48 30 Q54 22 56 34" stroke="#fef08a" stroke-width="2.5" fill="none"/>
      <!-- Horse Head Silhouette -->
      <path d="M42 30 L52 28 L64 44 L56 58 L46 56 L42 42 Z" fill="rgba(245,197,66,0.35)" stroke="#d4af37" stroke-width="2"/>
      <path d="M64 44 L70 54 L62 58 L56 58" fill="#d4af37" stroke="#fef08a" stroke-width="1.5"/>
      <!-- Ear & Eye -->
      <polygon points="46,24 50,30 44,30" fill="#fef08a"/>
      <circle cx="54" cy="38" r="2.2" fill="#fef08a"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">KUDA (WU)</text>
    </svg>`
  },
  "Kambing": {
    nama: "Kambing",
    aksara: "ꦮꦼꦝꦸꦱ꧀",
    simbol: "🐐",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Curved Horns -->
      <path d="M44 38 C36 24 28 32 30 40 M56 38 C64 24 72 32 70 40" stroke="#fef08a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <!-- Head -->
      <polygon points="50,38 60,46 55,62 45,62 40,46" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <!-- Beard -->
      <path d="M47 62 L50 70 L53 62 Z" fill="#fef08a"/>
      <!-- Eyes -->
      <circle cx="45" cy="48" r="2" fill="#fef08a"/>
      <circle cx="55" cy="48" r="2" fill="#fef08a"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">KAMBING (WEI)</text>
    </svg>`
  },
  "Monyet": {
    nama: "Monyet",
    aksara: "ꦏꦼꦛꦺꦏ꧀",
    simbol: "🐒",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Big Ears -->
      <circle cx="34" cy="48" r="8" fill="rgba(212,175,55,0.4)" stroke="#d4af37" stroke-width="1.5"/>
      <circle cx="66" cy="48" r="8" fill="rgba(212,175,55,0.4)" stroke="#d4af37" stroke-width="1.5"/>
      <!-- Head -->
      <circle cx="50" cy="50" r="16" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="2"/>
      <!-- Heart Mask -->
      <path d="M42 46 C42 42 46 42 50 46 C54 42 58 42 58 46 C58 52 50 58 50 58 C50 58 42 52 42 46 Z" fill="#d4af37" opacity="0.6"/>
      <!-- Eyes & Smile -->
      <circle cx="45" cy="47" r="2" fill="#fef08a"/>
      <circle cx="55" cy="47" r="2" fill="#fef08a"/>
      <path d="M47 54 Q50 57 53 54" stroke="#121722" stroke-width="1.2" fill="none"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">MONYET (SHEN)</text>
    </svg>`
  },
  "Ayam": {
    nama: "Ayam",
    aksara: "ꦗꦒꦺꦴ",
    simbol: "🐓",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Crown Comb -->
      <path d="M44 32 C44 24 48 24 50 30 C52 22 56 22 58 30 C60 26 64 28 62 34 Z" fill="#e11d48" stroke="#fef08a" stroke-width="1"/>
      <!-- Head & Beak -->
      <circle cx="48" cy="42" r="11" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <polygon points="56,42 66,45 56,48" fill="#fef08a" stroke="#d4af37" stroke-width="1"/>
      <!-- Wattle -->
      <path d="M54 48 C56 56 50 56 50 50 Z" fill="#e11d48"/>
      <!-- Eye -->
      <circle cx="48" cy="40" r="2" fill="#fef08a"/>
      <!-- Chest Feathers -->
      <path d="M38 52 C38 64 54 66 58 56" fill="none" stroke="#d4af37" stroke-width="2"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">AYAM (YOU)</text>
    </svg>`
  },
  "Anjing": {
    nama: "Anjing",
    aksara: "ꦲꦱꦸ",
    simbol: "🐕",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Floppy Ears -->
      <path d="M36 38 C32 46 34 56 38 56 C40 56 40 48 40 42 Z M64 38 C68 46 66 56 62 56 C60 56 60 48 60 42 Z" fill="#d4af37" stroke="#fef08a" stroke-width="1"/>
      <!-- Head -->
      <circle cx="50" cy="48" r="14" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <!-- Snout & Nose -->
      <ellipse cx="50" cy="54" rx="7" ry="5" fill="#fef08a"/>
      <polygon points="50,53 47,51 53,51" fill="#121722"/>
      <!-- Eyes -->
      <circle cx="45" cy="45" r="2" fill="#121722"/>
      <circle cx="55" cy="45" r="2" fill="#121722"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">ANJING (XU)</text>
    </svg>`
  },
  "Babi": {
    nama: "Babi",
    aksara: "ꦕꦺꦭꦺꦁ",
    simbol: "🐖",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-prada" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(212,175,55,0.12)" stroke="#d4af37" stroke-width="2"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Triangular Ears -->
      <polygon points="36,36 44,30 42,42" fill="#d4af37" stroke="#fef08a" stroke-width="1"/>
      <polygon points="64,36 56,30 58,42" fill="#d4af37" stroke="#fef08a" stroke-width="1"/>
      <!-- Head -->
      <circle cx="50" cy="50" r="16" fill="rgba(245,197,66,0.3)" stroke="#d4af37" stroke-width="1.8"/>
      <!-- Snout with Nostrils -->
      <ellipse cx="50" cy="54" rx="8" ry="6" fill="#f472b6" stroke="#d4af37" stroke-width="1.2"/>
      <ellipse cx="47" cy="54" rx="1.5" ry="2" fill="#831843"/>
      <ellipse cx="53" cy="54" rx="1.5" ry="2" fill="#831843"/>
      <!-- Eyes -->
      <circle cx="43" cy="44" r="2" fill="#fef08a"/>
      <circle cx="57" cy="44" r="2" fill="#fef08a"/>
      <text x="50" y="85" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fef08a">BABI (HAI)</text>
    </svg>`
  }
};

export const WUXING_EMBLEMS = {
  "Kayu": {
    nama: "Kayu",
    namaEn: "Wood",
    warna: "#22c55e",
    simbol: "🌲",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-emerald-400" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="2"/>
      <!-- Trunk & Foliage -->
      <rect x="46" y="58" width="8" height="18" fill="#a16207" rx="2"/>
      <polygon points="50,22 66,42 58,42 70,58 30,58 42,42 34,42" fill="rgba(34,197,94,0.4)" stroke="#4ade80" stroke-width="1.8"/>
      <text x="50" y="88" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#86efac">KAYU (WOOD)</text>
    </svg>`
  },
  "Api": {
    nama: "Api",
    namaEn: "Fire",
    warna: "#ef4444",
    simbol: "🔥",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-rose-500" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="2"/>
      <!-- Sacred Flame -->
      <path d="M50 20 C54 32 68 38 68 52 C68 64 58 72 50 72 C42 72 32 64 32 52 C32 40 44 32 44 20 Z" fill="rgba(239,68,68,0.4)" stroke="#f87171" stroke-width="2"/>
      <path d="M50 38 C53 46 60 50 60 58 C60 64 55 68 50 68 C45 68 40 64 40 58 C40 50 47 46 50 38 Z" fill="#fbbf24"/>
      <text x="50" y="88" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fca5a5">API (FIRE)</text>
    </svg>`
  },
  "Tanah": {
    nama: "Tanah",
    namaEn: "Earth",
    warna: "#eab308",
    simbol: "⛰️",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-amber-500" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(234,179,8,0.12)" stroke="#eab308" stroke-width="2"/>
      <!-- Mountain & Gunungan Base -->
      <polygon points="50,26 74,68 26,68" fill="rgba(234,179,8,0.35)" stroke="#fbbf24" stroke-width="2"/>
      <polygon points="50,26 62,68 38,68" fill="#d97706" opacity="0.6"/>
      <text x="50" y="88" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#fde047">TANAH (EARTH)</text>
    </svg>`
  },
  "Logam": {
    nama: "Logam",
    namaEn: "Metal",
    warna: "#94a3b8",
    simbol: "⚔️",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-slate-300" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(148,163,184,0.15)" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Golden Keris / Sword of Metal -->
      <path d="M50 20 L54 48 L58 52 L50 68 L42 52 L46 48 Z" fill="rgba(226,232,240,0.5)" stroke="#f8fafc" stroke-width="1.8"/>
      <circle cx="50" cy="72" r="3" fill="#d4af37"/>
      <!-- Ingot/Coin Motif -->
      <circle cx="50" cy="46" r="6" fill="none" stroke="#d4af37" stroke-width="1.2"/>
      <text x="50" y="88" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#e2e8f0">LOGAM (METAL)</text>
    </svg>`
  },
  "Air": {
    nama: "Air",
    namaEn: "Water",
    warna: "#38bdf8",
    simbol: "💧",
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-sky-400" fill="currentColor">
      <circle cx="50" cy="50" r="44" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>
      <!-- Water Droplet & Ripple -->
      <path d="M50 22 C50 22 66 44 66 56 C66 66 58 72 50 72 C42 72 34 66 34 56 C34 44 50 22 50 22 Z" fill="rgba(56,189,248,0.4)" stroke="#7dd3fc" stroke-width="2"/>
      <path d="M42 54 C42 48 48 42 52 40" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
      <text x="50" y="88" text-anchor="middle" font-size="9" font-family="'Cinzel', serif" font-weight="bold" fill="#bae6fd">AIR (WATER)</text>
    </svg>`
  }
};

/**
 * Mendapatkan ilustrasi SVG untuk Shio.
 * @param {string} shioName 
 * @returns {string} SVG HTML string
 */
export function getShioSvgIllustration(shioName) {
  const norm = String(shioName || '').trim();
  // Alias mapping
  let key = 'Tikus';
  if (/tikus/i.test(norm)) key = 'Tikus';
  else if (/kerbau|sapi/i.test(norm)) key = 'Kerbau';
  else if (/macan|harimau/i.test(norm)) key = 'Macan';
  else if (/kelinci/i.test(norm)) key = 'Kelinci';
  else if (/naga/i.test(norm)) key = 'Naga';
  else if (/ular/i.test(norm)) key = 'Ular';
  else if (/kuda/i.test(norm)) key = 'Kuda';
  else if (/kambing/i.test(norm)) key = 'Kambing';
  else if (/monyet|kera/i.test(norm)) key = 'Monyet';
  else if (/ayam|jago/i.test(norm)) key = 'Ayam';
  else if (/anjing/i.test(norm)) key = 'Anjing';
  else if (/babi/i.test(norm)) key = 'Babi';

  return (SHIO_EMBLEMS[key] && SHIO_EMBLEMS[key].svg) || SHIO_EMBLEMS['Tikus'].svg;
}

/**
 * Mendapatkan ilustrasi SVG untuk elemen Wu Xing.
 * @param {string} elemenName 
 * @returns {string} SVG HTML string
 */
export function getWuXingSvgIllustration(elemenName) {
  const norm = String(elemenName || '').trim();
  let key = 'Kayu';
  if (/kayu|wood/i.test(norm)) key = 'Kayu';
  else if (/api|fire/i.test(norm)) key = 'Api';
  else if (/tanah|earth/i.test(norm)) key = 'Tanah';
  else if (/logam|metal/i.test(norm)) key = 'Logam';
  else if (/air|water/i.test(norm)) key = 'Air';

  return (WUXING_EMBLEMS[key] && WUXING_EMBLEMS[key].svg) || WUXING_EMBLEMS['Kayu'].svg;
}

if (typeof window !== 'undefined') {
  window.SHIO_EMBLEMS = SHIO_EMBLEMS;
  window.WUXING_EMBLEMS = WUXING_EMBLEMS;
  window.getShioSvgIllustration = getShioSvgIllustration;
  window.getWuXingSvgIllustration = getWuXingSvgIllustration;
}
