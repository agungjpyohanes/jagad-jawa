/**
 * Jagad Jawa — Modul Domain: Pustaka Sinengker UI
 * Pengendali DOM untuk wewengkon naskah sakral, petung kompas danyang,
 * tata cara ubarampe pager gaib, sastra jendra, roso sejati, dan aji mantra.
 * Dilengkapi gerbang proteksi PIN / konfirmasi kultural.
 */

import {
  isSinengkerUnlocked,
  setSinengkerUnlocked,
  verifySinengkerAccess,
  resolveKompasDanyang,
  getPetaAksaraDerajat,
  getKompasDanyangData,
  getMendhemAriAriData,
  getUbarampePagerData,
  getAsenggamaSastraJendraData,
  getBodroSampirData,
  getKasedanJatiData,
  getRosoSejatiData,
  getAjiMantraSinengkerList,
  getRuwatanBataraKalaData
} from './sinengker-engine.js';

import { showToast, copyToClipboard } from '../../ui/toast.js';

let currentSinengkerSubtab = 'kompas'; // 'kompas' | 'ubarampe' | 'kawruh' | 'mantra'
let kompasSearchQuery = 'Gatak'; // Default tuladha saking prompt
let kompasViewMode = 'presisi'; // 'presisi' | 'arsip'
let lastKompasResult = null;

export const KOMPAS_SAMPLES = [
  { name: 'Gatak', label: 'Gatak (333° - GA)' },
  { name: 'Danukusuman', label: 'Danukusuman (135° - DA)' },
  { name: 'Kemlayan', label: 'Kemlayan (117° - KA)' },
  { name: 'Banyumanik', label: 'Banyumanik (351° - BA)' },
  { name: 'Ngemplak', label: 'Ngemplak (27° - NGA)' },
  { name: 'Semarang', label: 'Semarang (171° - SA)' },
  { name: 'Dhadhap', label: 'Dhadhap (243° - DHA)' },
  { name: 'Ambarawa', label: 'Ambarawa (45° - HA)' }
];

/**
 * Memperbarui gaya highlight pada tombol-tombol Tuladha Cepet
 * @param {string} currentQuery 
 */
function updateKompasSampleHighlight(currentQuery) {
  const norm = (currentQuery || '').toLowerCase().trim();
  const buttons = document.querySelectorAll('.kompas-sample-btn');
  buttons.forEach(btn => {
    const sample = (btn.dataset.sample || '').toLowerCase().trim();
    if (sample && norm && (sample === norm || norm.includes(sample))) {
      btn.className = 'kompas-sample-btn px-3 py-1 rounded-lg bg-amber-950/80 border-2 border-prada text-amber-200 text-[11px] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)] transition cursor-pointer';
    } else {
      btn.className = 'kompas-sample-btn px-3 py-1 rounded-lg bg-sogan-950 border border-sogan-800 hover:border-prada/60 text-sogan-300 text-[11px] font-normal transition cursor-pointer';
    }
  });
}

/**
 * Inisialisasi tampilan Pustaka Sinengker.
 * @param {string} [containerId='sinengkerContainer']
 */
export function initSinengkerUI(containerId = 'sinengkerContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Cek apakah akses terbuka atau terkunci
  if (!isSinengkerUnlocked()) {
    renderSinengkerLockedGate(container);
  } else {
    renderSinengkerUnlockedContent(container);
  }
}

/**
 * Render gerbang sakral terkunci (PIN Gate & Sumpah Kultural)
 * @param {HTMLElement} container 
 */
function renderSinengkerLockedGate(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto py-8 px-4 text-center space-y-6">
      <!-- Sacred Emblem -->
      <div class="relative inline-block">
        <div class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-red-950 via-[#180a1c] to-black border-2 border-prada/60 flex items-center justify-center text-prada text-4xl shadow-[0_0_40px_rgba(212,175,55,0.25)]">
          <i class="fa-solid fa-shield-halved text-amber-400"></i>
        </div>
        <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-900 border border-prada text-amber-200 flex items-center justify-center text-xs shadow">
          <i class="fa-solid fa-lock"></i>
        </div>
      </div>

      <!-- Header Teks -->
      <div class="space-y-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-mono font-bold tracking-wider uppercase">
          <i class="fa-solid fa-triangle-exclamation text-amber-400"></i> Wewengkon Sinengker Khusus
        </span>
        <h2 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text">
          Pustaka Sinengker
        </h2>
        <p class="text-xs sm:text-sm text-sogan-300 max-w-md mx-auto leading-relaxed">
          Wewengkon punika ngemot serat pingit, kawruh batin sangkan paraning dumadi, ubarampe pager gaib, sarta Petung Kompas Danyang ingkang asipat sakral.
        </p>
      </div>

      <!-- Sumpah Kultural & Pernyataan Niat Luhur -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-[#160c18] to-[#0d0710] border border-red-900/60 text-xs text-sogan-200 leading-relaxed text-left space-y-3 shadow-lg">
        <div class="flex items-center gap-2 text-amber-300 font-bold border-b border-red-900/40 pb-2">
          <i class="fa-solid fa-hands-praying text-amber-400"></i> Sumpah &amp; Tanggung Jawab Kultural:
        </div>
        <blockquote class="italic text-sogan-200 font-marcellus text-sm leading-relaxed border-l-2 border-prada/60 pl-3">
          "Kanthi nyuwun pangestu marang Gusti Kang Maha Kuwasa lan para Leluhur, kawula sumadya nyinau kawruh sinengker kanthi resiking manah, ngunggahake budi pakarti, sarta tanggung jawab lahir batin."
        </blockquote>
        <p class="text-[11px] text-sogan-400">
          Naskah punika namung kagem pitedah kabecikan, pangreksa kulawarga, lan nglestarekaken warisan spiritual leluhur Jawa.
        </p>
      </div>

      <!-- Form Masukan PIN / Sandi -->
      <div class="p-6 rounded-2xl bg-gradient-to-b from-[#121622] to-[#0A0D14] border border-sogan-800 space-y-4 shadow-xl">
        <div class="space-y-1 text-left">
          <label for="sinengkerPinInput" class="block text-xs font-bold text-prada uppercase tracking-wider">
            <i class="fa-solid fa-key mr-1 text-amber-400"></i> Sandi Pambuka Sinengker:
          </label>
          <span class="text-[11px] text-sogan-400 block">
            Ketik sandi keraton utawi konfirmasi rahasia kagem mbikak wewengkon.
          </span>
        </div>

        <div class="relative">
          <input
            type="password"
            id="sinengkerPinInput"
            placeholder="Ketik sandi keraton..."
            onkeydown="if(event.key === 'Enter') window.submitSinengkerPin && window.submitSinengkerPin(this.value)"
            class="w-full pl-4 pr-11 py-3 rounded-xl bg-keraton border border-sogan-700 focus:border-prada text-sm text-sogan-100 placeholder-sogan-500 outline-none transition font-mono tracking-wider text-center"
          />
          <button
            type="button"
            onclick="const inp = document.getElementById('sinengkerPinInput'); if(inp) inp.type = inp.type === 'password' ? 'text' : 'password';"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sogan-400 hover:text-prada transition"
            title="Tingali sandi">
            <i class="fa-solid fa-eye text-xs"></i>
          </button>
        </div>

        <!-- Catatan Kontak Pengembang -->
        <div class="flex items-center gap-2 text-xs text-sogan-400 px-2 py-2 justify-center sm:justify-start bg-sogan-950/60 rounded-xl border border-sogan-800/80">
          <i class="fa-solid fa-circle-info text-amber-400 shrink-0"></i>
          <span class="italic text-sogan-300 text-[11.5px]">Silakan hubungi pengembang untuk mendapatkan password akses.</span>
        </div>

        <!-- Tombol Buka -->
        <button
          type="button"
          onclick="const val = document.getElementById('sinengkerPinInput')?.value; window.submitSinengkerPin && window.submitSinengkerPin(val);"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-800 via-amber-700 to-prada text-keraton font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition cursor-pointer">
          <i class="fa-solid fa-lock-open"></i> Buka Pustaka Sinengker
        </button>
      </div>
    </div>
  `;
}

/**
 * Handle submit PIN Sinengker
 * @param {string} pin 
 */
export function submitSinengkerPin(pin) {
  if (!pin || !pin.trim()) {
    showToast('Nyuwun tulung ketik sandi pambuka.', 'warning');
    return;
  }

  if (verifySinengkerAccess(pin)) {
    setSinengkerUnlocked(true);
    showToast('Pustaka Sinengker Kasampurnan Kasil Binuka!', 'success');
    initSinengkerUI('sinengkerContainer');
  } else {
    showToast('Sandi mboten leres. Mangga cobi malih kanthi teliti.', 'error');
  }
}

/**
 * Kunci kembali Pustaka Sinengker
 */
export function lockSinengkerUI() {
  setSinengkerUnlocked(false);
  showToast('Pustaka Sinengker kasil dipun-kunci malih.', 'info');
  initSinengkerUI('sinengkerContainer');
}

/**
 * Render konten ketika status Pustaka Sinengker sudah terbuka
 * @param {HTMLElement} container 
 */
function renderSinengkerUnlockedContent(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header Sinengker Terbuka -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0f1c] via-[#100b17] to-[#07050d] border border-red-800/60 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
                <i class="fa-solid fa-lock-open text-emerald-400"></i> Sinengker Binuka
              </span>
            </div>
            <h2 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text">
              Pustaka Sinengker
            </h2>
            <p class="text-xs sm:text-sm text-sogan-300 max-w-2xl leading-relaxed">
              Koleksi naskah sakral kasampurnan, petung arah mata angin kompas danyang, ubarampe pager bumi &amp; gandhul, tata laku asenggama sastra jendra, kasedan jati, sarta aji mantra wingit.
            </p>
          </div>

          <!-- Tombol Kunci Kembali -->
          <div class="shrink-0">
            <button
              onclick="window.lockSinengkerUI && window.lockSinengkerUI()"
              class="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-white text-xs font-bold flex items-center gap-2 transition shadow cursor-pointer">
              <i class="fa-solid fa-lock"></i> Kunci Maneh
            </button>
          </div>
        </div>
      </div>

      <!-- Subtab Navigation Bar Sinengker (Multi-Row Wrap) -->
      <div class="flex flex-wrap items-center gap-2 pb-2 border-b border-sogan-800/80">
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('kompas')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'kompas' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-compass"></i> Petung Kompas Danyang
        </button>
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('pustaka')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'pustaka' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-book-bookmark"></i> Pustaka Dongo, Usada &amp; Laku
        </button>
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('tumpeng')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'tumpeng' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-bowl-rice"></i> Tumpeng Tombak Rojo
        </button>
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('ubarampe')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'ubarampe' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-jar"></i> Tata Cara &amp; Ubarampe
        </button>
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('kawruh')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'kawruh' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-yin-yang"></i> Kawruh Batin &amp; Sangkan Paran
        </button>
        <button
          onclick="window.switchSinengkerSubtab && window.switchSinengkerSubtab('mantra')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentSinengkerSubtab === 'mantra' ? 'bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Aji Mantra Sinengker (3)
        </button>
      </div>

      <!-- Container Content Subtab Sinengker -->
      <div id="sinengkerSubtabContent" class="space-y-6">
        <!-- Rendered by renderSinengkerCurrentSubtab() -->
      </div>
    </div>
  `;

  renderSinengkerCurrentSubtab();
}

/**
 * Ganti sub-tab aktif di dalam modul Sinengker
 * @param {'kompas' | 'ruwatan' | 'pustaka' | 'tumpeng' | 'ubarampe' | 'kawruh' | 'mantra'} subtab 
 */
export function switchSinengkerSubtab(subtab) {
  currentSinengkerSubtab = subtab;
  const container = document.getElementById('sinengkerContainer');
  if (container) renderSinengkerUnlockedContent(container);
}

/**
 * Render subtab aktif sinengker
 */
function renderSinengkerCurrentSubtab() {
  const container = document.getElementById('sinengkerSubtabContent');
  if (!container) return;

  switch (currentSinengkerSubtab) {
    case 'ruwatan':
      renderSinengkerRuwatanView(container);
      break;
    case 'pustaka':
      renderSinengkerPustakaView(container);
      break;
    case 'tumpeng':
      renderSinengkerTumpengView(container);
      break;
    case 'ubarampe':
      renderSinengkerUbarampeView(container);
      break;
    case 'kawruh':
      renderSinengkerKawruhView(container);
      break;
    case 'mantra':
      renderSinengkerMantraView(container);
      break;
    case 'kompas':
    default:
      renderSinengkerKompasView(container);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VIEW PETUNG KOMPAS DANYANG (SEARCH & VISUAL COMPASS 360° PRESISI)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Membangun representasi SVG Kompas Presisi 360° kanthi 20 Aksara Jawa
 * lan jarum putar presisi (transform: rotate(Xdeg)).
 */
function buildSvgCompassDial(res, petaList) {
  // 36 Degree Ticks
  let degreeTicks = '';
  for (let d = 0; d < 360; d += 10) {
    const rad = (d * Math.PI) / 180;
    const isCardinal = d % 90 === 0;
    const isInter = d % 45 === 0;
    const rIn = isCardinal ? 146 : (isInter ? 150 : 153);
    const rOut = 158;
    const x1 = (180 + rIn * Math.sin(rad)).toFixed(1);
    const y1 = (180 - rIn * Math.cos(rad)).toFixed(1);
    const x2 = (180 + rOut * Math.sin(rad)).toFixed(1);
    const y2 = (180 - rOut * Math.cos(rad)).toFixed(1);
    const strokeCol = isCardinal ? '#FDE047' : (isInter ? '#F59E0B' : 'rgba(212, 175, 55, 0.4)');
    degreeTicks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeCol}" stroke-width="${isCardinal ? 2 : 1}" />`;
  }

  // 20 Aksara nodes positioned at their precise angles
  const aksaraNodes = petaList.map(item => {
    const angleRad = (item.sudut * Math.PI) / 180;
    const cx = (180 + 122 * Math.sin(angleRad)).toFixed(1);
    const cy = (180 - 122 * Math.cos(angleRad)).toFixed(1);
    const isActive = item.aksara === res.aksara_awal;

    const circleRadius = isActive ? 13.5 : 10.5;
    const circleFill = isActive ? '#991B1B' : '#140F1D';
    const circleStroke = isActive ? '#FDE047' : '#78350F';
    const circleWidth = isActive ? 2.5 : 1.2;
    const textColor = isActive ? '#FEF08A' : '#D4AF37';
    const textWeight = isActive ? '900' : 'bold';
    const glow = isActive ? 'filter="url(#glowAksara)"' : '';

    return `
      <g class="aksara-compass-node ${isActive ? 'active-node' : ''}" id="aksara-node-${item.aksara}" data-aksara="${item.aksara}" data-sudut="${item.sudut}" style="cursor: pointer;" onclick="window.setKompasDanyangSample && window.setKompasDanyangSample('${item.aksara}')">
        <title>${item.aksara} (${item.sudut}°) — ${item.arah_mata_angin}</title>
        ${isActive ? `<line x1="180" y1="180" x2="${cx}" y2="${cy}" stroke="rgba(251, 191, 36, 0.45)" stroke-dasharray="3,3" stroke-width="1.5" />` : ''}
        <circle cx="${cx}" cy="${cy}" r="${circleRadius}" fill="${circleFill}" stroke="${circleStroke}" stroke-width="${circleWidth}" ${glow} />
        <text x="${cx}" y="${Number(cy) - 1.5}" text-anchor="middle" font-size="${isActive ? '11.5' : '10'}" font-weight="${textWeight}" fill="${textColor}" stroke="#000" stroke-width="${isActive ? '1.8' : '1.2'}" paint-order="stroke fill" font-family="monospace">${item.aksara}</text>
        <text x="${cx}" y="${Number(cy) + 8}" text-anchor="middle" font-size="${isActive ? '10.5' : '9'}" fill="${isActive ? '#FDE047' : '#D97706'}" stroke="#000" stroke-width="${isActive ? '1.5' : '1'}" paint-order="stroke fill">${item.aksara_jawa}</text>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 360 360" class="w-full h-full max-w-[340px] max-h-[340px] drop-shadow-2xl mx-auto select-none">
      <defs>
        <!-- Glow Filter -->
        <filter id="glowAksara" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="compassDialBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1F1528" />
          <stop offset="70%" stop-color="#120A18" />
          <stop offset="100%" stop-color="#08040C" />
        </radialGradient>
        <linearGradient id="needleRedPradaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444" />
          <stop offset="50%" stop-color="#B91C1C" />
          <stop offset="100%" stop-color="#7F1D1D" />
        </linearGradient>
        <linearGradient id="needleGoldLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="100%" stop-color="#D4AF37" />
        </linearGradient>
        <linearGradient id="needleHubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FBBF24" />
          <stop offset="50%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#78350F" />
        </linearGradient>
      </defs>

      <!-- Background Dial -->
      <circle cx="180" cy="180" r="172" fill="#0D0712" stroke="#451A03" stroke-width="2" />
      <circle cx="180" cy="180" r="162" fill="url(#compassDialBg)" stroke="#B45309" stroke-width="1.5" />
      <circle cx="180" cy="180" r="158" fill="none" stroke="rgba(212, 175, 55, 0.25)" stroke-dasharray="2, 6" stroke-width="1" />

      <!-- Quadrant Accent Rings -->
      <!-- Lor (North quadrant: blueish) -->
      <path d="M 68 68 A 158 158 0 0 1 292 68" fill="none" stroke="rgba(59, 130, 246, 0.25)" stroke-width="4" />
      <!-- Wetan (East quadrant: golden amber) -->
      <path d="M 292 68 A 158 158 0 0 1 292 292" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="4" />
      <!-- Kidul (South quadrant: emerald) -->
      <path d="M 292 292 A 158 158 0 0 1 68 292" fill="none" stroke="rgba(16, 185, 129, 0.25)" stroke-width="4" />
      <!-- Kulon (West quadrant: purple) -->
      <path d="M 68 292 A 158 158 0 0 1 68 68" fill="none" stroke="rgba(168, 85, 247, 0.25)" stroke-width="4" />

      <!-- Degree Ticks -->
      ${degreeTicks}

      <!-- Subtle Compass Star in Background -->
      <g opacity="0.18">
        <polygon points="180,50 186,174 180,180 174,174" fill="#D4AF37" />
        <polygon points="180,310 186,186 180,180 174,186" fill="#D4AF37" />
        <polygon points="50,180 174,174 180,180 174,186" fill="#D4AF37" />
        <polygon points="310,180 186,174 180,180 186,186" fill="#D4AF37" />
        <polygon points="88,88 175,175 180,180 175,185" fill="#B45309" />
        <polygon points="272,88 185,175 180,180 185,185" fill="#B45309" />
        <polygon points="88,272 175,185 180,180 175,175" fill="#B45309" />
        <polygon points="272,272 185,185 180,180 185,175" fill="#B45309" />
      </g>

      <!-- Inner Track Circle -->
      <circle cx="180" cy="180" r="98" fill="none" stroke="rgba(212, 175, 55, 0.15)" stroke-width="1" />
      <circle cx="180" cy="180" r="70" fill="#110A17" stroke="rgba(180, 83, 9, 0.3)" stroke-width="1" />

      <!-- Cardinal Direction Labels -->
      <text x="180" y="20" text-anchor="middle" font-size="15" font-weight="900" fill="#60A5FA" stroke="#0a0a1a" stroke-width="3" paint-order="stroke fill" font-family="sans-serif">LOR (U)</text>
      <text x="346" y="185" text-anchor="middle" font-size="15" font-weight="900" fill="#FBBF24" stroke="#0a0a1a" stroke-width="3" paint-order="stroke fill" font-family="sans-serif">WETAN (T)</text>
      <text x="180" y="354" text-anchor="middle" font-size="15" font-weight="900" fill="#34D399" stroke="#0a0a1a" stroke-width="3" paint-order="stroke fill" font-family="sans-serif">KIDUL (S)</text>
      <text x="14" y="185" text-anchor="middle" font-size="15" font-weight="900" fill="#C084FC" stroke="#0a0a1a" stroke-width="3" paint-order="stroke fill" font-family="sans-serif">KULON (B)</text>

      <!-- Intercardinal Labels -->
      <text x="282" y="80" text-anchor="middle" font-size="11" font-weight="bold" fill="#D1D5DB" stroke="#0a0a1a" stroke-width="2.5" paint-order="stroke fill" font-family="sans-serif">TL</text>
      <text x="282" y="286" text-anchor="middle" font-size="11" font-weight="bold" fill="#D1D5DB" stroke="#0a0a1a" stroke-width="2.5" paint-order="stroke fill" font-family="sans-serif">TG</text>
      <text x="78" y="286" text-anchor="middle" font-size="11" font-weight="bold" fill="#D1D5DB" stroke="#0a0a1a" stroke-width="2.5" paint-order="stroke fill" font-family="sans-serif">BD</text>
      <text x="78" y="80" text-anchor="middle" font-size="11" font-weight="bold" fill="#D1D5DB" stroke="#0a0a1a" stroke-width="2.5" paint-order="stroke fill" font-family="sans-serif">BL</text>

      <!-- 20 Aksara Jawa Nodes -->
      ${aksaraNodes}

      <!-- Jarum Penunjuk Kompas Presisi (Animasi Rotasi CSS transform: rotate(Xdeg)) -->
      <g id="kompasDanyangNeedle" style="transform-origin: 180px 180px; transform: rotate(${res.sudut}deg); transition: transform 1.2s cubic-bezier(0.34, 1.4, 0.64, 1); pointer-events: none;">
        <!-- Glowing Target Line to Bezel -->
        <line x1="180" y1="180" x2="180" y2="28" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6" />

        <!-- North Pointer (Crimson & Gold Dagger / Keris) -->
        <polygon points="180,26 173,180 180,165 187,180" fill="url(#needleRedPradaGrad)" stroke="#FDE047" stroke-width="0.8" />
        <polygon points="180,26 180,165 187,180" fill="url(#needleGoldLightGrad)" opacity="0.65" />
        
        <!-- Arrow Tip Beacon -->
        <polygon points="180,16 174,30 186,30" fill="#FBBF24" stroke="#78350F" stroke-width="0.6" />
        <circle cx="180" cy="18" r="3.5" fill="#EF4444" stroke="#FFF" stroke-width="1.2" />

        <!-- South Counterweight (Bronze / Charcoal) -->
        <polygon points="180,248 174,180 180,192 186,180" fill="#27272A" stroke="#52525B" stroke-width="0.8" />
        <polygon points="180,248 180,192 186,180" fill="#3F3F46" opacity="0.5" />
        <circle cx="180" cy="242" r="5" fill="#18181B" stroke="#71717A" stroke-width="1.2" />

        <!-- Center Boss / Pivot -->
        <circle cx="180" cy="180" r="17" fill="url(#needleHubGrad)" stroke="#F59E0B" stroke-width="2.5" filter="url(#glowAksara)" />
        <circle cx="180" cy="180" r="12" fill="#1C1917" stroke="#D97706" stroke-width="1.2" />
        <text id="kompasNeedleHubText" x="180" y="184.5" text-anchor="middle" font-size="11" font-weight="bold" fill="#FDE047">${res.aksara_jawa || 'ꦲ'}</text>
      </g>
    </svg>
  `;
}

function renderSinengkerKompasView(container) {
  if (!lastKompasResult) {
    lastKompasResult = resolveKompasDanyang(kompasSearchQuery || 'Gatak');
  }

  const res = lastKompasResult;
  const petaList = getPetaAksaraDerajat();

  // Tentukan badge class berdasarkan sektor
  let arahBadgeClass = 'bg-amber-950/80 border-amber-600 text-amber-300';
  if (res.arah_key === 'lor') arahBadgeClass = 'bg-blue-950/80 border-blue-600 text-blue-300';
  if (res.arah_key === 'wetan') arahBadgeClass = 'bg-amber-950/80 border-amber-600 text-amber-300';
  if (res.arah_key === 'kidul') arahBadgeClass = 'bg-emerald-950/80 border-emerald-600 text-emerald-300';
  if (res.arah_key === 'kulon') arahBadgeClass = 'bg-purple-950/80 border-purple-600 text-purple-300';

  const svgDialHtml = buildSvgCompassDial(res, petaList);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Search Input Kelurahan -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-[#131a26] to-[#0A0D14] border border-sogan-800 space-y-3 shadow-lg">
        <label for="kompasDanyangInput" class="block text-xs font-bold text-prada uppercase tracking-wider flex items-center gap-2">
          <i class="fa-solid fa-map-location-dot text-amber-400"></i> Padosi Arah Kompas Danyang Desa / Kelurahan (Presisi 360°):
        </label>
        
        <div class="flex items-center gap-2 flex-col sm:flex-row">
          <div class="relative flex-1 w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sogan-400">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              type="text"
              id="kompasDanyangInput"
              value="${kompasSearchQuery}"
              oninput="window.onKompasDanyangSearch && window.onKompasDanyangSearch(this.value)"
              placeholder="Ketik asma desa utawi kelurahan (tuladha: Gatak, Danukusuman, Kemlayan, Banyumanik)..."
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-keraton border border-sogan-700 focus:border-prada text-sm text-sogan-100 placeholder-sogan-500 outline-none transition"
            />
          </div>
          <button
            type="button"
            onclick="const val = document.getElementById('kompasDanyangInput')?.value; window.onKompasDanyangSearch && window.onKompasDanyangSearch(val);"
            class="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow transition cursor-pointer shrink-0">
            <i class="fa-solid fa-compass"></i> Hitung Arah Danyang
          </button>
        </div>

        <!-- Quick Sample Badges (Tuladha Cepet) -->
        <div class="flex items-center gap-1.5 flex-wrap text-xs text-sogan-400 pt-1">
          <span class="text-[11px] font-mono text-prada font-bold">Tuladha Cepet:</span>
          ${KOMPAS_SAMPLES.map(s => {
            const isActive = kompasSearchQuery.toLowerCase().trim() === s.name.toLowerCase();
            return `
              <button
                type="button"
                data-sample="${s.name}"
                onclick="window.setKompasDanyangSample && window.setKompasDanyangSample('${s.name}')"
                class="kompas-sample-btn px-3 py-1 rounded-lg ${isActive ? 'bg-amber-950/80 border-2 border-prada text-amber-200 font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-sogan-950 border border-sogan-800 hover:border-prada/60 text-sogan-300 font-normal'} text-[11px] transition cursor-pointer">
                ${s.label}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Main Result Grid (2 Columns: Detail Pitedah on Left, Compass Illustration on Right) -->
      <div id="kompasDanyangContentArea">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Kolom Kiri: Hasil Evaluasi Arah & Pitedah Danyang (7 cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="p-6 rounded-3xl bg-gradient-to-b from-[#131b2c] to-[#0A0D14] border border-prada/60 shadow-xl space-y-4">
            
            <!-- Header Arah & Derajat Presisi -->
            <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
              <div>
                <span class="text-[11px] uppercase font-mono text-sogan-400 block">Asma Kelurahan / Desa:</span>
                <h3 id="panelNamaKelurahan" class="font-marcellus text-2xl font-bold text-prada-light">
                  ${res.nama_bersih}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span id="panelArahBadge" class="px-3.5 py-1.5 rounded-xl border font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 ${arahBadgeClass}">
                  <i class="fa-solid fa-location-arrow"></i> Sektor: ${res.arah_jawa} (${res.arah_id})
                </span>
                <span id="panelDerajatBadge" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950 to-amber-950 border border-prada/80 text-amber-200 font-mono text-sm font-bold shadow-md">
                  ${res.sudut}°
                </span>
              </div>
            </div>

            <!-- Aksara Jawa Pembuka, Urutan & Koordinat Presisi -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-1">
                <span class="text-sogan-400 font-mono text-[10px] uppercase">Aksara Pertama (Carakan):</span>
                <div id="panelAksaraContainer" class="text-base font-bold text-amber-300 flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center font-mono text-xs text-amber-200 font-bold shadow">${res.aksara_awal}</span>
                  <div>
                    <span class="block text-sm">Aksara ${res.aksara_awal} (<strong class="text-prada font-serif">${res.aksara_jawa}</strong>)</span>
                    <span class="text-[10px] font-mono text-sogan-400 font-normal">Urutan kaping ${res.urutan} saking 20</span>
                  </div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-1">
                <span class="text-sogan-400 font-mono text-[10px] uppercase">Koordinat Derajat Presisi 360°:</span>
                <div class="text-xs font-mono font-bold text-sogan-100 pt-1 flex items-center justify-between">
                  <span id="panelArahMataAngin" class="text-amber-300">${res.arah_mata_angin}</span>
                  <span id="panelDerajatText" class="px-2 py-0.5 rounded bg-sogan-950 text-prada border border-sogan-800">${res.sudut}°</span>
                </div>
                <div class="text-[10px] text-sogan-400 pt-0.5">
                  Arah serong pas: ${res.arah_mata_angin_jawa}
                </div>
              </div>
            </div>

            <!-- Watak Spiritual Arah (Poin 4: Deskripsi Watak Spiritual Arahnya) -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-[#1c1322] to-keraton border border-prada/60 text-xs space-y-1.5 shadow-md">
              <div class="flex items-center justify-between">
                <strong class="text-prada block text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-gem text-amber-400"></i> Watak &amp; Sifat Spiritual Arah (Aksara ${res.aksara_awal}):
                </strong>
                <span class="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/50 text-[10px] font-mono text-amber-300">Presisi ${res.sudut}°</span>
              </div>
              <p id="panelWatakSpiritual" class="text-sogan-100 leading-relaxed text-[12px] pt-1">
                ${res.watak_spiritual}
              </p>
            </div>

            <!-- Pitedah Danyang Wewengkon -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-keraton border border-amber-600/40 text-xs space-y-1.5 leading-relaxed">
              <strong class="text-amber-300 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-feather-pointed text-amber-400"></i> Pitedah Danyang Wewengkon:
              </strong>
              <p id="panelDanyangPitedah" class="text-sogan-100">
                ${res.danyang_pitedah}
              </p>
            </div>

            <!-- Sesaji & Ubarampe Pengayoman -->
            <div class="p-3.5 rounded-xl bg-teal-950/40 border border-teal-700/40 text-xs space-y-1">
              <strong class="text-teal-300 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-bowl-food text-teal-400"></i> Ubarampe &amp; Sesaji Pangreksa:
              </strong>
              <p id="panelSesajiUbarampe" class="text-teal-200">
                ${res.sesaji_ubarampe}
              </p>
            </div>

            <!-- Aksara Serumpun Sektor -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-sogan-800/80 text-xs space-y-1">
              <span class="text-sogan-400 font-mono text-[10px] uppercase block">Aksara Serumpun Sektor ${res.arah_jawa}:</span>
              <p id="panelAksaraSerumpun" class="text-sogan-300 text-[11px] font-mono">
                ${res.aksara_seperjuangan}
              </p>
            </div>

            <!-- Action Button Salin -->
            <div class="pt-2">
              <button
                onclick="window.copyKompasDanyangResult && window.copyKompasDanyangResult()"
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sogan-900 to-keraton hover:from-sogan-800 hover:to-sogan-950 border border-prada/60 text-prada font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md">
                <i class="fa-solid fa-copy"></i> Salin Pitedah Kompas Danyang (${res.sudut}°)
              </button>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Piringan & Jarum Kompas Danyang Presisi 360° (5 cols) -->
        <div class="lg:col-span-5 space-y-3">
          <div class="p-5 rounded-3xl bg-gradient-to-b from-[#131b2c] to-[#0A0D14] border border-prada/60 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
            
            <!-- Header Mode Kompas -->
            <div class="flex items-center justify-between w-full border-b border-sogan-800 pb-2.5">
              <span class="text-xs font-bold text-prada uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-compass"></i> Kompas Danyang 360°
              </span>
              <div class="flex items-center gap-1">
                <button
                  onclick="window.switchKompasViewMode && window.switchKompasViewMode('presisi')"
                  class="px-2 py-1 rounded-lg text-[10px] font-mono transition ${kompasViewMode === 'presisi' ? 'bg-amber-600 text-keraton font-bold shadow' : 'bg-sogan-950 text-sogan-400 hover:text-prada'}">
                  Presisi
                </button>
                <button
                  onclick="window.switchKompasViewMode && window.switchKompasViewMode('arsip')"
                  class="px-2 py-1 rounded-lg text-[10px] font-mono transition ${kompasViewMode === 'arsip' ? 'bg-amber-600 text-keraton font-bold shadow' : 'bg-sogan-950 text-sogan-400 hover:text-prada'}">
                  Bagan Asli
                </button>
              </div>
            </div>

            <!-- Frame Kompas Interaktif -->
            ${kompasViewMode === 'presisi' ? `
              <!-- Mode 1: Kompas Vektor Presisi 360° kanthi 20 Aksara & Jarum Putar Halus -->
              <div class="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#100b17] to-black p-3 shadow-2xl border-2 border-prada/60 flex items-center justify-center">
                ${svgDialHtml}
              </div>
            ` : `
              <!-- Mode 2: Bagan Naskah Asli kanthi Jarum Overlay Putar -->
              <div class="relative w-full max-w-[320px] aspect-square rounded-2xl bg-white p-2 shadow-2xl border-2 border-prada/60 group cursor-pointer overflow-visible" onclick="window.openKompasImageZoomModal && window.openKompasImageZoomModal()">
                <img
                  src="./assets/kompas_danyang.jpg"
                  alt="Kompas Danyang Spiritual Jawa"
                  style="transform: rotate(-90deg); image-rendering: crisp-edges; image-rendering: -webkit-optimize-contrast;"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                <!-- Jarum Putar Overlay ing Bagan Asli -->
                <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    id="kompasDanyangNeedleArsip"
                    style="width: 220px; height: 220px; position: absolute; left: 50%; top: 52.7%; transform: translate(-50%, -50%) rotate(${res.sudut}deg); transition: transform 1.2s cubic-bezier(0.34, 1.4, 0.64, 1);">
                    <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-lg">
                      <polygon points="100,16 94,100 100,90 106,100" fill="#EF4444" stroke="#FDE047" stroke-width="1.2" />
                      <circle cx="100" cy="16" r="3" fill="#FDE047" />
                      <polygon points="100,150 95,100 100,108 105,100" fill="#27272A" stroke="#71717A" stroke-width="1" />
                      <circle cx="100" cy="100" r="10" fill="#B45309" stroke="#FDE047" stroke-width="2" />
                      <text x="100" y="103" text-anchor="middle" font-size="8" font-weight="bold" fill="#FFF">${res.aksara_awal}</text>
                    </svg>
                  </div>
                </div>

                <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                  <i class="fa-solid fa-magnifying-glass-plus"></i> Klik Perbesar
                </div>
              </div>
            `}

            <!-- Live Digital Readout HUD (Derajat Presisi & Sektor) -->
            <div class="w-full p-3 rounded-2xl bg-keraton border border-sogan-800 space-y-1.5 shadow-inner">
              <div class="flex items-center justify-center gap-2">
                <span id="kompasDegreeDisplay" class="px-3.5 py-1 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-300 font-mono text-xl sm:text-2xl font-bold tracking-tight shadow">
                  ${res.sudut}°
                </span>
                <span id="kompasDirectionBadge" class="px-2.5 py-1.5 rounded-xl bg-sogan-950 border border-sogan-700 text-sogan-200 font-mono text-xs font-semibold">
                  ${res.arah_mata_angin}
                </span>
              </div>
              <div id="kompasFormulaExplain" class="text-[11px] text-sogan-400 font-mono">
                Aksara <strong>${res.aksara_awal}</strong> (${res.aksara_jawa}) • Urutan <strong>${res.urutan}</strong> / 20 • Sudut tengah sektor <strong>${res.sudut}°</strong> saking THA (9°/Lor)
              </div>
            </div>

            <!-- Petunjuk Visual Filosofis -->
            <div class="text-[11px] text-sogan-400 leading-normal max-w-xs text-center">
              Formula 360°: Total 20 aksara dibagi 360°, saben aksara gadhah amban <strong>18°</strong> muter searah jarum jam saking titik wiwit <strong>THA (0°/Utara)</strong>, sudut tengah sektor THA = <strong>9°</strong>.
            </div>

          </div>
        </div>

      </div>
    </div>
    </div>
  `;
}

/**
 * Handle input pencarian nama kelurahan/desa kompas danyang kanthi animasi lancar
 * @param {string} query 
 */
export function onKompasDanyangSearch(query) {
  kompasSearchQuery = query;
  if (query && query.trim()) {
    lastKompasResult = resolveKompasDanyang(query);
  } else {
    lastKompasResult = resolveKompasDanyang('Gatak');
  }

  const res = lastKompasResult;
  updateKompasSampleHighlight(query);

  // Coba update DOM kanthi animasi CSS transform langsung tanpa re-render total
  const needle = document.getElementById('kompasDanyangNeedle');
  const needleArsip = document.getElementById('kompasDanyangNeedleArsip');
  const degreeDisplay = document.getElementById('kompasDegreeDisplay');
  const directionBadge = document.getElementById('kompasDirectionBadge');
  const formulaExplain = document.getElementById('kompasFormulaExplain');

  const panelNama = document.getElementById('panelNamaKelurahan');
  const panelDerajatBadge = document.getElementById('panelDerajatBadge');
  const panelDerajatText = document.getElementById('panelDerajatText');
  const panelArahBadge = document.getElementById('panelArahBadge');
  const panelAksaraContainer = document.getElementById('panelAksaraContainer');
  const panelArahMataAngin = document.getElementById('panelArahMataAngin');
  const panelWatakSpiritual = document.getElementById('panelWatakSpiritual');
  const panelDanyangPitedah = document.getElementById('panelDanyangPitedah');
  const panelSesajiUbarampe = document.getElementById('panelSesajiUbarampe');
  const panelAksaraSerumpun = document.getElementById('panelAksaraSerumpun');
  const hubText = document.getElementById('kompasNeedleHubText');

  if ((needle || needleArsip || panelNama) && panelWatakSpiritual) {
    // 1. Terapkan rotasi CSS jarum kompas kanthi animasi transisi alus
    if (needle) {
      needle.style.transform = `rotate(${res.sudut}deg)`;
    }
    if (needleArsip) {
      needleArsip.style.transform = `translate(-50%, -50%) rotate(${res.sudut}deg)`;
    }
    if (hubText) {
      hubText.textContent = res.aksara_jawa || 'ꦛ';
    }

    // 2. Perbarui angka HUD dan label
    if (degreeDisplay) degreeDisplay.textContent = `${res.sudut}°`;
    if (directionBadge) directionBadge.textContent = res.arah_mata_angin;
    if (formulaExplain) {
      formulaExplain.innerHTML = `Aksara <strong>${res.aksara_awal}</strong> (${res.aksara_jawa}) • Urutan <strong>${res.urutan}</strong> / 20 • Sudut tengah sektor <strong>${res.sudut}°</strong> saking THA (9°/Lor)`;
    }

    // 3. Perbarui panel hasil kiri
    panelNama.textContent = res.nama_bersih;
    if (panelDerajatBadge) panelDerajatBadge.textContent = `${res.sudut}°`;
    if (panelDerajatText) panelDerajatText.textContent = `${res.sudut}°`;
    if (panelArahMataAngin) panelArahMataAngin.textContent = res.arah_mata_angin;
    if (panelWatakSpiritual) panelWatakSpiritual.textContent = res.watak_spiritual;
    if (panelDanyangPitedah) panelDanyangPitedah.textContent = res.danyang_pitedah;
    if (panelSesajiUbarampe) panelSesajiUbarampe.textContent = res.sesaji_ubarampe;
    if (panelAksaraSerumpun) panelAksaraSerumpun.textContent = res.aksara_seperjuangan;

    if (panelAksaraContainer) {
      panelAksaraContainer.innerHTML = `
        <span class="w-8 h-8 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center font-mono text-xs text-amber-200 font-bold shadow">${res.aksara_awal}</span>
        <div>
          <span class="block text-sm">Aksara ${res.aksara_awal} (<strong class="text-prada font-serif">${res.aksara_jawa}</strong>)</span>
          <span class="text-[10px] font-mono text-sogan-400 font-normal">Urutan kaping ${res.urutan} saking 20</span>
        </div>
      `;
    }

    if (panelArahBadge) {
      let arahBadgeClass = 'bg-amber-950/80 border-amber-600 text-amber-300';
      if (res.arah_key === 'lor') arahBadgeClass = 'bg-blue-950/80 border-blue-600 text-blue-300';
      if (res.arah_key === 'wetan') arahBadgeClass = 'bg-amber-950/80 border-amber-600 text-amber-300';
      if (res.arah_key === 'kidul') arahBadgeClass = 'bg-emerald-950/80 border-emerald-600 text-emerald-300';
      if (res.arah_key === 'kulon') arahBadgeClass = 'bg-purple-950/80 border-purple-600 text-purple-300';
      panelArahBadge.className = `px-3.5 py-1.5 rounded-xl border font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 ${arahBadgeClass}`;
      panelArahBadge.innerHTML = `<i class="fa-solid fa-location-arrow"></i> Sektor: ${res.arah_jawa} (${res.arah_id})`;
    }

    // 4. Perbarui sorotan lingkaran aktif pada SVG dial
    document.querySelectorAll('.aksara-compass-node').forEach(node => {
      const isTarget = node.getAttribute('data-aksara') === res.aksara_awal;
      const circle = node.querySelector('circle');
      const textLatin = node.querySelector('text:first-of-type');
      const textJawa = node.querySelector('text:last-of-type');

      if (isTarget) {
        node.classList.add('active-node');
        if (circle) {
          circle.setAttribute('r', '13.5');
          circle.setAttribute('fill', '#991B1B');
          circle.setAttribute('stroke', '#FDE047');
          circle.setAttribute('stroke-width', '2.5');
          circle.setAttribute('filter', 'url(#glowAksara)');
        }
        if (textLatin) {
          textLatin.setAttribute('fill', '#FEF08A');
          textLatin.setAttribute('font-size', '11.5');
          textLatin.setAttribute('font-weight', '900');
          textLatin.setAttribute('stroke', '#000');
          textLatin.setAttribute('stroke-width', '1.8');
        }
        if (textJawa) {
          textJawa.setAttribute('fill', '#FDE047');
          textJawa.setAttribute('font-size', '10.5');
          textJawa.setAttribute('stroke', '#000');
          textJawa.setAttribute('stroke-width', '1.5');
        }
      } else {
        node.classList.remove('active-node');
        if (circle) {
          circle.setAttribute('r', '10.5');
          circle.setAttribute('fill', '#140F1D');
          circle.setAttribute('stroke', '#78350F');
          circle.setAttribute('stroke-width', '1.2');
          circle.removeAttribute('filter');
        }
        if (textLatin) {
          textLatin.setAttribute('fill', '#D4AF37');
          textLatin.setAttribute('font-size', '10');
          textLatin.setAttribute('font-weight', 'bold');
          textLatin.setAttribute('stroke', '#000');
          textLatin.setAttribute('stroke-width', '1.2');
        }
        if (textJawa) {
          textJawa.setAttribute('fill', '#D97706');
          textJawa.setAttribute('font-size', '9');
          textJawa.setAttribute('stroke', '#000');
          textJawa.setAttribute('stroke-width', '1');
        }
      }
    });

  } else {
    // Re-render jika container durung siyaga
    const container = document.getElementById('sinengkerSubtabContent');
    if (container) {
      renderSinengkerKompasView(container);
      // Kembalikan fokus input supados pangguna saged ngetik tanpa gangguan
      requestAnimationFrame(() => {
        const inp = document.getElementById('kompasDanyangInput');
        if (inp) {
          inp.focus();
          const len = inp.value.length;
          inp.setSelectionRange(len, len);
        }
      });
    }
  }
}

/**
 * Memilih sampel desa cepat
 * @param {string} sampleName 
 */
export function setKompasDanyangSample(sampleName) {
  kompasSearchQuery = sampleName;
  const input = document.getElementById('kompasDanyangInput');
  if (input) input.value = sampleName;
  updateKompasSampleHighlight(sampleName);
  onKompasDanyangSearch(sampleName);
}

/**
 * Ganti mode tampilan visual kompas (Presisi Digital vs Bagan Asli)
 * @param {'presisi' | 'arsip'} mode 
 */
export function switchKompasViewMode(mode) {
  kompasViewMode = mode;
  const container = document.getElementById('sinengkerSubtabContent');
  if (container) renderSinengkerKompasView(container);
}

/**
 * Salin ringkasan hasil evaluasi Kompas Danyang presisi ke clipboard
 */
export function copyKompasDanyangResult() {
  if (!lastKompasResult) return;
  const r = lastKompasResult;

  let text = `🧭 *PETUNG KOMPAS DANYANG: ${r.nama_bersih.toUpperCase()}*\n`;
  text += `──────────────────────────────\n`;
  text += `📍 Koordinat Presisi : ${r.sudut}° (${r.arah_mata_angin})\n`;
  text += `🧭 Sektor Kardinal  : ${r.arah_jawa.toUpperCase()} (${r.arah_id.toUpperCase()})\n`;
  text += `🔤 Aksara Pertama    : Aksara ${r.aksara_awal} (${r.aksara_jawa}) — Urutan ${r.urutan}/20\n`;
  text += `🌿 Aksara Serumpun  : ${r.aksara_seperjuangan}\n`;
  text += `✨ Watak Spiritual  : ${r.watak_spiritual}\n\n`;
  text += `📜 *Pitedah Danyang:*\n${r.danyang_pitedah}\n\n`;
  text += `🍶 *Sesaji & Ubarampe:*\n${r.sesaji_ubarampe}\n\n`;
  text += `Kadhudhah saking Pustaka Sinengker Jagad Jawa (Presisi 360°)\nhttps://jagad-jawa.web.app`;

  copyToClipboard(text, `Pitedah Kompas Danyang ${r.nama_bersih} (${r.sudut}°) kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VIEW TATA CARA & UBARAMPE (MENDHEM ARI-ARI & PAGER GAIB)
// ─────────────────────────────────────────────────────────────────────────────

function renderSinengkerUbarampeView(container) {
  const ariAri = getMendhemAriAriData();
  const pager = getUbarampePagerData();

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Seksi 1: Mendhem Ari-Ari -->
      <div class="rounded-3xl bg-gradient-to-b from-[#151a26] to-[#0A0D14] border border-amber-600/50 p-6 sm:p-7 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-950 border border-amber-600 text-amber-300 flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-jar"></i>
            </div>
            <div>
              <h3 class="font-marcellus text-lg sm:text-xl font-bold text-amber-200">
                ${ariAri.judul}
              </h3>
              <span class="text-xs text-sogan-400 block">${ariAri.deskripsi}</span>
            </div>
          </div>
          <button
            onclick="window.copyMendhemAriAri && window.copyMendhemAriAri()"
            class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Tata Cara
          </button>
        </div>

        <!-- 12 Perlengkapan Ubarampe Grid -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-prada uppercase tracking-wider block">
            <i class="fa-solid fa-list-check mr-1 text-amber-400"></i> 12 Perlengkapan Ubarampe:
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-sogan-200">
            ${ariAri.perlengkapan_ubarampe.map((item, idx) => `
              <div class="flex items-center gap-2 p-2.5 rounded-xl bg-keraton border border-sogan-800">
                <span class="w-5 h-5 rounded-full bg-amber-950 border border-amber-600/50 text-amber-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                  ${idx + 1}
                </span>
                <span class="font-medium">${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tata Cara Pependheman -->
        <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 text-xs leading-relaxed space-y-1">
          <strong class="text-amber-300 block text-xs uppercase tracking-wider">
            <i class="fa-solid fa-hand-holding-heart mr-1 text-amber-400"></i> Tata Cara Pependheman:
          </strong>
          <p class="text-sogan-100">
            ${ariAri.tata_cara}
          </p>
        </div>
      </div>

      <!-- Seksi 2: Ubarampe Pager Gaib (Bumi & Gandhul) -->
      <div class="rounded-3xl bg-gradient-to-b from-[#171224] to-[#0A0D14] border border-red-800/60 p-6 sm:p-7 shadow-xl space-y-5">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-red-950 border border-red-600 text-red-300 flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 class="font-marcellus text-lg sm:text-xl font-bold text-amber-200">
                ${pager.judul}
              </h3>
              <span class="text-xs text-sogan-400 block">${pager.deskripsi}</span>
            </div>
          </div>
          <button
            onclick="window.copyUbarampePager && window.copyUbarampePager()"
            class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Ubarampe Pager
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Pager Bumi -->
          <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2.5">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-1.5">
              <strong class="text-xs text-amber-300 uppercase font-mono">
                <i class="fa-solid fa-mountain text-amber-400 mr-1"></i> Ubarampe Pager Bumi (9):
              </strong>
              <span class="text-[10px] font-mono text-sogan-400">Pangreksa Pekarangan</span>
            </div>
            <ul class="space-y-1.5 text-xs text-sogan-200">
              ${pager.pager_bumi.map((b, i) => `
                <li class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-sogan-950 text-amber-400 font-mono text-[9px] flex items-center justify-center border border-sogan-700">${i + 1}</span>
                  <span>${b}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Pager Gandhul Omah -->
          <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2.5">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-1.5">
              <strong class="text-xs text-amber-300 uppercase font-mono">
                <i class="fa-solid fa-house-shield text-amber-400 mr-1"></i> Pager Gandhul Omah (7):
              </strong>
              <span class="text-[10px] font-mono text-sogan-400">Pangreksa Griya</span>
            </div>
            <ul class="space-y-1.5 text-xs text-sogan-200">
              ${pager.pager_gandhul_omah.map((b, i) => `
                <li class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded bg-sogan-950 text-amber-400 font-mono text-[9px] flex items-center justify-center border border-sogan-700">${i + 1}</span>
                  <span>${b}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Pantek Pager (Kayu & Elemen) -->
        <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 space-y-2">
          <strong class="text-xs font-bold text-prada uppercase tracking-wider block">
            <i class="fa-solid fa-tree mr-1 text-emerald-400"></i> Pantek Pager (Tunggul Kayu):
          </strong>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            ${pager.pantek_pager.map(p => `
              <div class="p-2.5 rounded-xl bg-keraton border border-sogan-800 text-center space-y-1">
                <span class="font-bold text-amber-300 block font-marcellus">${p.kayu || p.elemen}</span>
                ${p.jumlah ? `<span class="text-[10px] font-mono text-sogan-400 px-2 py-0.5 rounded bg-sogan-950 border border-sogan-800">Cacah: ${p.jumlah}</span>` : ''}
                <p class="text-[10px] text-sogan-400 italic">${p.makna || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function copyMendhemAriAri() {
  const ari = getMendhemAriAriData();
  let text = `🏺 *${ari.judul}*\n_${ari.deskripsi}_\n\n`;
  text += `📋 *12 Ubarampe:*\n`;
  ari.perlengkapan_ubarampe.forEach((u, i) => {
    text += `${i + 1}. ${u}\n`;
  });
  text += `\n📜 *Tata Cara:*\n${ari.tata_cara}\n\n`;
  text += `Kadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Tata cara mendhem ari-ari kasil disalin!');
}

export function copyUbarampePager() {
  const pager = getUbarampePagerData();
  let text = `🛡️ *${pager.judul}*\n_${pager.deskripsi}_\n\n`;
  text += `📍 *Pager Bumi (9 Bahan):*\n`;
  pager.pager_bumi.forEach((b, i) => {
    text += `${i + 1}. ${b}\n`;
  });
  text += `\n🏠 *Pager Gandhul Omah (7 Bahan):*\n`;
  pager.pager_gandhul_omah.forEach((b, i) => {
    text += `${i + 1}. ${b}\n`;
  });
  text += `\n🪵 *Pantek Pager:*\n`;
  pager.pantek_pager.forEach(p => {
    text += `- ${p.kayu || p.elemen}${p.jumlah ? ' (' + p.jumlah + ')' : ''}: ${p.makna || ''}\n`;
  });
  text += `\nKadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Ubarampe pager gaib kasil disalin!');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VIEW KAWRUH BATIN & SANGKAN PARAN
// ─────────────────────────────────────────────────────────────────────────────

function renderSinengkerKawruhView(container) {
  const asenggama = getAsenggamaSastraJendraData();
  const bodro = getBodroSampirData();
  const kasedan = getKasedanJatiData();
  const roso = getRosoSejatiData();

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- 1. Ajaran Asenggama & Sastra Jendra -->
      <div class="rounded-3xl bg-gradient-to-b from-[#181122] to-[#0A0D14] border border-amber-600/50 p-6 sm:p-7 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-amber-200">
              ${asenggama.judul}
            </h3>
            <span class="text-xs text-sogan-400 block">${asenggama.deskripsi}</span>
          </div>
          <button onclick="window.copySastraJendra && window.copySastraJendra()" class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Ajaran Saresmi
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- Waktu Larangan -->
          <div class="p-4 rounded-2xl bg-red-950/30 border border-red-900/50 space-y-2">
            <strong class="text-red-300 block uppercase font-mono text-[11px]">
              <i class="fa-solid fa-ban text-red-400 mr-1"></i> Waktu Larangan Asenggama (15):
            </strong>
            <div class="space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              ${asenggama.waktu_larangan_asenggama.map(w => `
                <div class="flex items-center justify-between p-1.5 rounded bg-keraton/70 border border-red-900/30">
                  <span class="font-medium text-sogan-200">${w.waktu}</span>
                  <span class="text-red-300 font-mono text-[11px]">${w.akibat}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Waktu yang Baik -->
          <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 space-y-2">
            <strong class="text-emerald-300 block uppercase font-mono text-[11px]">
              <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> Waktu Senggama Ingkang Sae (3):
            </strong>
            <div class="space-y-1.5">
              ${asenggama.waktu_senggama_yang_baik.map(w => `
                <div class="flex items-center justify-between p-2 rounded-xl bg-keraton/70 border border-emerald-900/30">
                  <span class="font-bold text-amber-300">${w.waktu}</span>
                  <span class="text-emerald-300 font-mono text-xs">${w.manfaat}</span>
                </div>
              `).join('')}
            </div>

            <!-- Mantra Saresmi Sejati -->
            <div class="mt-3 pt-3 border-t border-emerald-900/40 space-y-1.5">
              <strong class="text-amber-300 block text-[11px] uppercase tracking-wider">
                <i class="fa-solid fa-sparkles text-amber-400 mr-1"></i> Mantra Saresmi Sejati (Wejangan Wali Sanga):
              </strong>
              <div class="text-[11px] text-sogan-300 space-y-1 bg-black/40 p-2.5 rounded-lg border border-sogan-800">
                <div class="font-mono text-amber-200">1. Niat Ingsun unggah ing girikumala, angengakake lawang kencana... (Hu Allah 3x)</div>
                <div class="font-mono text-cyan-200">2. Aku lanang sajati anurunake rasa, tumika bumi rachmatullah... (Hu Allah 3x)</div>
                <div class="font-mono text-emerald-200">3. Bismillah niat ingsun mudun saka giri kumala, anginepake lawang kencana... (Hu Allah 3x)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Ajaran Bodro Sampir -->
      <div class="rounded-3xl bg-gradient-to-b from-[#131a26] to-[#0A0D14] border border-cyan-800/50 p-6 sm:p-7 shadow-xl space-y-3">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-cyan-200">
              ${bodro.judul}
            </h3>
            <span class="text-xs text-sogan-400 block">${bodro.deskripsi}</span>
          </div>
          <button onclick="window.copyBodroSampir && window.copyBodroSampir()" class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Bodro Sampir
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-black/50 border border-cyan-900/60 font-mono text-xs text-cyan-100 space-y-1.5 leading-relaxed">
          ${bodro.mantra.map(m => `<div>${m}</div>`).join('')}
        </div>
        <p class="text-[11px] text-sogan-400 italic">
          <i class="fa-solid fa-wind mr-1 text-cyan-400"></i> ${bodro.catatan}
        </p>
      </div>

      <!-- 3. Kasedan Jati -->
      <div class="rounded-3xl bg-gradient-to-b from-[#1a1428] to-[#0A0D14] border border-purple-800/50 p-6 sm:p-7 shadow-xl space-y-3">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-purple-200">
              ${kasedan.judul}
            </h3>
            <span class="text-xs text-sogan-400 block">${kasedan.deskripsi}</span>
          </div>
          <button onclick="window.copyKasedanJati && window.copyKasedanJati()" class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Kasedan Jati
          </button>
        </div>

        <div class="space-y-2 text-xs text-sogan-200 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          ${kasedan.paragraf_ajaran.map((p, i) => `
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 leading-relaxed">
              <span class="font-mono text-purple-300 font-bold mr-1.5">[${i + 1}]</span> ${p}
            </div>
          `).join('')}
        </div>
        <p class="text-[11px] text-sogan-400 italic">
          <i class="fa-solid fa-lungs mr-1 text-purple-400"></i> ${kasedan.catatan}
        </p>
      </div>

      <!-- 4. Roso Sejati & Sarana Praktis -->
      <div class="rounded-3xl bg-gradient-to-b from-[#141b24] to-[#0A0D14] border border-amber-600/50 p-6 sm:p-7 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-amber-200">
              ${roso.judul}
            </h3>
            <span class="text-xs text-sogan-400 block">${roso.deskripsi}</span>
          </div>
          <button onclick="window.copyRosoSejati && window.copyRosoSejati()" class="px-3.5 py-1.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-copy"></i> Salin Sarana Roso Sejati
          </button>
        </div>

        <!-- Gandhewo & Semedi Panetepan -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2">
            <strong class="text-amber-300 font-mono text-xs block uppercase">Bait Gandhewo:</strong>
            <div class="font-marcellus text-amber-100 space-y-0.5 italic">
              ${roso.gandhewo.bait.map(b => `<div>${b}</div>`).join('')}
            </div>
            <div class="pt-2 text-[11px] text-sogan-300 font-mono border-t border-sogan-800/60">
              ${roso.gandhewo.doa.replace('\n', '<br/>')}
            </div>
            <div class="text-[10px] text-sogan-400 font-mono">
              Amalan Panyuwunan: ${roso.gandhewo.amalan.panyuwunan} · Tetombo: ${roso.gandhewo.amalan.tetombo}
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2">
            <strong class="text-amber-300 font-mono text-xs block uppercase">Semedi Panetepan:</strong>
            <p class="text-[11px] text-sogan-400">${roso.semedi_panetepan.deskripsi}</p>
            <div class="p-2.5 rounded-lg bg-black/50 border border-sogan-800 font-mono text-[11px] text-cyan-200 tracking-wider">
              ${roso.semedi_panetepan.bacaan_1}
            </div>
            <div class="p-2.5 rounded-lg bg-black/50 border border-sogan-800 font-mono text-[11px] text-emerald-200 tracking-wider">
              ${roso.semedi_panetepan.bacaan_2}
            </div>
          </div>
        </div>

        <!-- Sarana Praktis Accordion/Grid -->
        <div class="space-y-2 text-xs">
          <strong class="text-prada uppercase tracking-wider block text-[11px]">
            <i class="fa-solid fa-toolbox text-amber-400 mr-1"></i> Koleksi Sarana Praktis &amp; Donga Tradisional:
          </strong>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Dodolan / Warung:</span>
              <p class="text-[11px] text-sogan-300">${roso.sarana_praktis.kanggo_dodolan}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Tolak Udan:</span>
              <p class="text-[11px] text-sogan-300">${roso.sarana_praktis.kanggo_tolak_udan}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Dongo Nenandur:</span>
              <p class="text-[11px] text-sogan-300">${roso.sarana_praktis.dongo_nenandur}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Pengasihan Lian Bangsa:</span>
              <p class="text-[11px] text-sogan-300 font-mono text-cyan-200">${roso.sarana_praktis.pengasihan_lian_bangsa}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Numpak Kendaraan (Darat/Banyu):</span>
              <p class="text-[11px] text-sogan-300">Darat: ${roso.sarana_praktis.numpak_kendaraan.darat}<br/>Banyu: ${roso.sarana_praktis.numpak_kendaraan.banyu}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1">
              <span class="font-bold text-amber-300 block">Pelarisan Usaha:</span>
              <p class="text-[11px] text-sogan-300">${roso.sarana_praktis.kanggo_pelarisan[0]}</p>
            </div>
          </div>
        </div>

        <!-- Mantra Pangedepaning Lelembut -->
        <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 space-y-2">
          <strong class="text-xs font-bold text-prada uppercase tracking-wider block">
            <i class="fa-solid fa-shield text-amber-400 mr-1"></i> Mantra Pangedepaning Lelembut (4 Kiblat + Luhur Ngisor):
          </strong>
          <div class="p-3 rounded-xl bg-black/60 border border-sogan-800 font-mono text-xs text-sogan-200 space-y-1">
            ${roso.mantra_pangedepaning_lelembut.map(l => `<div>${l}</div>`).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}

export function copySastraJendra() {
  const as = getAsenggamaSastraJendraData();
  let text = `📜 *${as.judul}*\n_${as.deskripsi}_\n\n`;
  text += `✨ *Mantra Saresmi Sejati:*\n`;
  text += `Sebelum: ${as.mantra_saresmi_sejati.sebelum_berhubungan.join(' ')}\n\n`;
  text += `Saat Proses: ${as.mantra_saresmi_sejati.saat_proses.join(' ')}\n\n`;
  text += `Setelah Selesai: ${as.mantra_saresmi_sejati.setelah_selesai.join(' ')}\n\n`;
  text += `Kadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Ajaran Sastra Jendra kasil disalin!');
}

export function copyBodroSampir() {
  const b = getBodroSampirData();
  let text = `🌌 *${b.judul}*\n_${b.deskripsi}_\n\n`;
  text += b.mantra.join('\n');
  text += `\n\nCatatan: ${b.catatan}\n\nKadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Mantra Bodro Sampir kasil disalin!');
}

export function copyKasedanJati() {
  const k = getKasedanJatiData();
  let text = `🕊️ *${k.judul}*\n_${k.deskripsi}_\n\n`;
  k.paragraf_ajaran.forEach((p, i) => {
    text += `[${i + 1}] ${p}\n\n`;
  });
  text += `Catatan: ${k.catatan}\n\nKadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Ajaran Kasedan Jati kasil disalin!');
}

export function copyRosoSejati() {
  const r = getRosoSejatiData();
  let text = `✨ *${r.judul}*\n_${r.deskripsi}_\n\n`;
  text += `BAIT GANDHEWO:\n${r.gandhewo.bait.join('\n')}\n\n`;
  text += `DOA:\n${r.gandhewo.doa}\n\n`;
  text += `Kadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Sarana Roso Sejati kasil disalin!');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VIEW AJI MANTRA SINENGKER (3 AJI WINGIT)
// ─────────────────────────────────────────────────────────────────────────────

function renderSinengkerMantraView(container) {
  const mantras = getAjiMantraSinengkerList();

  container.innerHTML = `
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-xs text-sogan-200 flex items-start gap-2.5">
        <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0"></i>
        <div>
          <strong class="text-amber-300">Pitedah Rapalan Mantra Wingit:</strong>
          Mantra punika kagungan pangaribawa batin ingkang ageng. Kedah dipun-rapal kanthi resiking angen-angen, niyat becik pangreksa, lan mboten kepareng kagem tumindak ala.
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${mantras.map(m => `
          <div class="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#191126] to-[#0A0D14] border border-amber-600/50 p-6 shadow-xl space-y-4">
            <div class="space-y-3">
              <!-- Header Mantra -->
              <div class="flex items-center justify-between border-b border-sogan-800 pb-2.5">
                <span class="px-2.5 py-1 rounded-lg bg-red-950 border border-red-700/60 text-red-300 font-mono text-[10px] uppercase font-bold">
                  Aji Sakral
                </span>
                <span class="text-[10px] text-sogan-400 font-mono">Wingit</span>
              </div>

              <h3 class="font-marcellus text-lg font-bold text-amber-200">
                ${m.judul}
              </h3>
              <p class="text-xs text-sogan-400">
                ${m.deskripsi}
              </p>

              <!-- Rapalan Mantra -->
              <div class="p-3.5 rounded-2xl bg-black/60 border border-prada/30 font-mono text-xs text-amber-100 space-y-1 leading-relaxed">
                ${m.bacaan.map(line => `<div>${line}</div>`).join('')}
              </div>

              ${m.catatan ? `
              <div class="text-[11px] text-sogan-400 italic">
                <i class="fa-solid fa-circle-info text-amber-400 mr-1"></i> ${m.catatan}
              </div>` : ''}
            </div>

            <!-- Action Button -->
            <div class="pt-2">
              <button
                onclick="window.copyAjiMantra && window.copyAjiMantra('${m.id}')"
                class="w-full py-2.5 px-3 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
                <i class="fa-solid fa-copy"></i> Salin Rapalan
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function copyAjiMantra(id) {
  const mantras = getAjiMantraSinengkerList();
  const m = mantras.find(x => x.id === id);
  if (!m) return;

  let text = `⚡ *${m.judul}*\n_${m.deskripsi}_\n\n`;
  text += m.bacaan.join('\n');
  if (m.catatan) {
    text += `\n\nCatatan: ${m.catatan}`;
  }
  text += `\n\nKadhudhah saking Pustaka Sinengker Jagad Jawa\nhttps://jagad-jawa.web.app`;

  copyToClipboard(text, `${m.judul} kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4B. VIEW RUWATAN BATARA KALA (MURWAKALA) — KI DALANG MANTEP SOEDHARSONO
// ─────────────────────────────────────────────────────────────────────────────

export function copyRuwatanMantra(id) {
  const data = getRuwatanBataraKalaData();
  const rajah = data?.patang_mantra_rajah?.find(r => r.id === id);
  if (!rajah) return;

  let text = `🛡️ *${rajah.nama.toUpperCase()}*\n`;
  text += `📍 *Posisi:* ${rajah.posisi} (${rajah.titik_anatomi})\n`;
  if (rajah.aksara_jawa) text += `ꦲ *Aksara Jawa:* ${rajah.aksara_jawa}\n`;
  text += `\n*Rapalan / Mantra:*\n`;

  if (Array.isArray(rajah.mantra_teks)) {
    text += rajah.mantra_teks.map(b => `${b.bait} — ${b.werdi}`).join('\n');
  } else {
    text += rajah.mantra_teks;
  }

  text += `\n\n*Werdi Makna:*\n${rajah.werdi_makna}`;
  text += `\n\nKadhudhah saking Ruwatan Batara Kala (Murwakala) - Ki Dalang Mantep Soedharsono\nPustaka Sinengker Jagad Jawa`;

  copyToClipboard(text, `${rajah.nama} kasil dipun-salin!`);
}

/**
 * Render Tampilan Sakral Ruwatan Batara Kala (Murwakala)
 * @param {HTMLElement} container 
 */
function renderSinengkerRuwatanView(container) {
  const ruwatan = getRuwatanBataraKalaData();
  if (!ruwatan) return;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Banner Pengantar Filosofi Ki Mantep Soedharsono -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0d16] via-[#120815] to-[#07040a] border border-amber-600/50 p-6 sm:p-8 shadow-2xl">
        <div class="space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-700/60 text-red-300 text-xs font-mono font-bold tracking-wider uppercase">
              <i class="fa-solid fa-shield-cat text-amber-400"></i> Ruwatan Murwakala
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-mono font-semibold">
              <i class="fa-solid fa-user-tie"></i> Narasumber: ${ruwatan.narasumber}
            </span>
          </div>

          <h3 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text">
            ${ruwatan.judul}
          </h3>
          <p class="text-xs sm:text-sm text-sogan-200 max-w-3xl leading-relaxed">
            ${ruwatan.deskripsi}
          </p>

          <div class="p-4 rounded-2xl bg-black/40 border border-amber-900/60 text-xs text-sogan-200 leading-relaxed space-y-2">
            <span class="text-amber-300 font-bold block flex items-center gap-1.5">
              <i class="fa-solid fa-feather-pointed text-amber-400"></i> Piweling Luhur Filosofi:
            </span>
            <blockquote class="italic text-sogan-300 border-l-2 border-prada/60 pl-3 leading-relaxed">
              "${ruwatan.pengantar_filosofi}"
            </blockquote>
          </div>
        </div>
      </div>

      <!-- Header Patang Mantra Rajah -->
      <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-hand-dots text-amber-400"></i>
          <h4 class="font-marcellus text-lg font-bold text-amber-100">
            Patang (4) Mantra &amp; Rajah Panyucen Sukma
          </h4>
        </div>
        <span class="text-[11px] font-mono text-sogan-400">Bathuk · Tutuk · Dada · Gigir</span>
      </div>

      <!-- Grid 4 Rajah Sakral -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        ${ruwatan.patang_mantra_rajah.map((rajah, idx) => {
          const isKalacakra = rajah.id === 'rajah_kalacakra';
          const isCarakaBalik = rajah.id === 'caraka_balik';

          return `
            <div class="rounded-3xl bg-gradient-to-b from-[#131724] to-[#0A0D15] border border-sogan-800 hover:border-prada/60 transition shadow-xl p-6 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 border-b border-sogan-800/80 pb-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-xl bg-gradient-to-br from-red-900 to-amber-700 text-white font-mono font-bold text-xs flex items-center justify-center shadow">
                      ${idx + 1}
                    </span>
                    <span class="font-bold text-xs text-amber-300 uppercase tracking-wider font-mono">
                      ${rajah.posisi}
                    </span>
                  </div>
                  <span class="text-[10.5px] px-2.5 py-0.5 rounded-full bg-sogan-950 text-sogan-300 border border-sogan-800">
                    ${rajah.titik_anatomi}
                  </span>
                </div>

                <div>
                  <h4 class="font-marcellus text-lg font-bold text-amber-100">${rajah.nama}</h4>
                </div>

                <!-- Aksara Jawa -->
                ${rajah.aksara_jawa ? `
                <div class="p-3 rounded-2xl bg-keraton/90 border border-prada/30 text-center font-jawa text-lg sm:text-xl text-prada tracking-wider shadow-inner">
                  ${rajah.aksara_jawa}
                </div>` : ''}

                <!-- Mantra Teks -->
                <div class="p-4 rounded-2xl bg-black/60 border border-sogan-800/80 space-y-2">
                  <span class="text-[10px] font-mono uppercase text-prada font-bold block tracking-wider">
                    <i class="fa-solid fa-scroll mr-1"></i> Rapalan / Rajah:
                  </span>
                  ${isKalacakra ? `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      ${rajah.mantra_teks.map(b => `
                        <div class="p-2 rounded-xl bg-sogan-950/70 border border-sogan-800">
                          <strong class="text-amber-200 block text-[11px]">${b.bait}</strong>
                          <span class="text-sogan-300 text-[10px] italic leading-tight block mt-0.5">${b.werdi}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : isCarakaBalik ? `
                    <div class="space-y-1.5">
                      <div class="font-mono text-xs text-amber-200 font-bold tracking-wider leading-relaxed">
                        ${rajah.urutan_aksara}
                      </div>
                    </div>
                  ` : `
                    <p class="font-mono text-xs text-amber-100 leading-relaxed italic">
                      "${rajah.mantra_teks}"
                    </p>
                  `}
                </div>

                <!-- Werdi Makna -->
                <div class="p-3.5 rounded-2xl bg-sogan-950/40 border border-sogan-800/60 text-xs text-sogan-300 leading-relaxed space-y-1">
                  <span class="font-bold text-prada text-[11px] block">
                    <i class="fa-solid fa-circle-question mr-1"></i> Werdi &amp; Daya Pangreksa:
                  </span>
                  <p>${rajah.werdi_makna}</p>
                </div>
              </div>

              <!-- Tombol Salin -->
              <div class="pt-2">
                <button
                  type="button"
                  onclick="window.copyRuwatanMantra && window.copyRuwatanMantra('${rajah.id}')"
                  class="w-full py-2.5 px-3 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-prada/40 hover:border-prada text-prada text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
                  <i class="fa-solid fa-copy"></i> Salin Rajah &amp; Makna
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Render Pustaka Dongo, Usada & Laku Jawa di dalam Pustaka Sinengker
 * @param {HTMLElement} container 
 */
async function renderSinengkerPustakaView(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="p-3.5 rounded-2xl bg-sogan-950/70 border border-prada/30 flex items-center justify-between text-xs text-sogan-300">
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-prada"></i>
          Materi Pustaka Dongo, Usada &amp; Laku Jawa terproteksi ing Wewengkon Sinengker.
        </span>
        <span class="text-prada font-mono text-[11px]">Gerbang Kasultanan</span>
      </div>
      <div id="sinengkerEmbeddedPustaka"></div>
    </div>
  `;

  try {
    const pustakaUI = await import('../pustaka/pustaka-ui.js');
    if (pustakaUI && typeof pustakaUI.initPustakaUI === 'function') {
      pustakaUI.initPustakaUI('sinengkerEmbeddedPustaka');
    }
  } catch (err) {
    console.error('Gagal memuat pustaka UI di sinengker:', err);
  }
}

/**
 * Render Tumpeng Tombak Rojo langsung penuh (Full Interactive Display) di dalam Pustaka Sinengker
 * @param {HTMLElement} container 
 */
async function renderSinengkerTumpengView(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Top Title & Badge -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sogan-800/80">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-widest text-prada flex items-center gap-1.5">
            <i class="fa-solid fa-bowl-rice text-amber-400"></i> Seni, Tradisi, &amp; Filosofi Jawa
          </span>
          <h2 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wide">
            Tumpeng Tombak Rojo
          </h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3.5 py-1.5 rounded-full bg-prada/15 border border-prada/50 text-prada text-xs font-bold font-serif flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-shield-halved text-amber-400"></i>
            <span>Sesaji Sakral Tolak Bala Ageng</span>
          </span>
        </div>
      </div>

      <!-- Hero Introduction Banner -->
      <div class="p-6 rounded-3xl bg-gradient-to-r from-[#141A28] via-[#1A1F30] to-[#0E131E] border border-prada/30 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-prada/10 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-4xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sogan-950/80 border border-prada/40 text-[11px] text-prada font-semibold">
            <i class="fa-solid fa-crown text-amber-400"></i> Pusaka Wiwitan Karaton
          </div>
          <h3 class="font-marcellus text-xl sm:text-2xl font-bold text-amber-100 leading-snug">
            Keseimbangan Kiblat Papat Limo Pancer &amp; Ketajaman Spiritual Manungsa
          </h3>
          <p class="text-xs sm:text-sm text-sogan-200 leading-relaxed">
            <strong>Tumpeng Tombak Rojo</strong> (utawi <em>Tumpeng Tumbak Rojo</em>) minangka puncak pralambang sesaji tolak bala ageng wonten ing kabudayan Jawa. Wujudipun wujud lima tumpeng alit panca warna ingkang manunggal ngiteri punjer, kajangkepi pasak <em>Tombak Rojo</em> ing pucuk tumpeng tengah minangka tameng panulak rubeda, panutup sawan, sarta panyuwunan wilujeng lahir batin marang Gusti Kang Maha Kawasa.
          </p>
        </div>
      </div>

      <!-- Interactive Callout Layout: Image with Hotspot Overlays & Detail Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: Interactive Image Canvas (7 cols) -->
        <div class="lg:col-span-7 bg-[#0E131E] p-4 sm:p-5 rounded-3xl border border-prada/40 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-sogan-800/80">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-prada animate-ping"></span>
              <h4 class="font-marcellus text-sm sm:text-base font-bold text-prada">
                Peta Ubarampe &amp; Sesaji Tumpeng Tombak Rojo
              </h4>
            </div>
            <span class="text-[10px] text-sogan-400 italic">Klik angka 1–7 ing ngandhap</span>
          </div>

          <!-- Image Container with Relative Positioning for Hotspots -->
          <div class="relative w-full rounded-2xl overflow-hidden border border-sogan-700/80 bg-black/60 shadow-inner group">
            <img src="assets/tumpeng_tumbak rojo_ilustrasi.jpeg" alt="Ilustrasi Lengkap Tumpeng Tombak Rojo Jawa" class="w-full h-auto object-contain block rounded-2xl" />

            <!-- Hotspot 1: Tumpeng Panca Warna (Tengah) -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(1)" data-hotspot="1" class="tumpeng-hotspot-btn active bg-prada text-keraton border-2 border-amber-200" style="top: 22%; left: 50%;" title="1. Tumpeng Panca Warna (Kiblat Papat Limo Pancer)">
              1
            </button>

            <!-- Hotspot 2: Kembang Setaman & Bawang Putih -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(2)" data-hotspot="2" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 41%; left: 10%;" title="2. Kembang Setaman & Bawang Putih Tunggal">
              2
            </button>

            <!-- Hotspot 3: Kembang Panca Warna / 7 Rupa -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(3)" data-hotspot="3" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 12.5%; left: 74%;" title="3. Kembang Panca Warna / Tujuh Rupa">
              3
            </button>

            <!-- Hotspot 4: Telur Bebek, Koin Gobog, Pala -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(4)" data-hotspot="4" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 34%; left: 74%;" title="4. Telur Bebek, Koin Gobog Kuno, & Pala Kependem">
              4
            </button>

            <!-- Hotspot 5: Rempah Dlingo Bengle & Bubur Putih -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(5)" data-hotspot="5" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 54.5%; left: 74%;" title="5. Rempah Dlingo Bengle & Bubur Putih (Tajin)">
              5
            </button>

            <!-- Hotspot 6: Wedang Kopi Pahit -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(6)" data-hotspot="6" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 70.5%; left: 10.5%;" title="6. Wedang Kopi Pahit (Wedang Cemeng)">
              6
            </button>

            <!-- Hotspot 7: Wedang Teh Manis / Bening -->
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(7)" data-hotspot="7" class="tumpeng-hotspot-btn bg-sogan-900 text-amber-200 border-2 border-prada" style="top: 12.5%; left: 10%;" title="7. Wedang Teh Manis / Wedang Bening">
              7
            </button>
          </div>

          <!-- Horizontal Button Strip for Easy Tap on Touchscreens -->
          <div class="grid grid-cols-7 gap-1.5 pt-1">
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(1)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">1</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Tumpeng</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(2)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">2</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Setaman</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(3)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">3</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">7 Rupa</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(4)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">4</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Gobog</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(5)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">5</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Dlingo</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(6)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">6</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Kopi Pait</span>
            </button>
            <button type="button" onclick="window.selectTumpengHotspot && window.selectTumpengHotspot(7)" class="p-2 rounded-xl bg-sogan-950 border border-prada/30 hover:border-prada text-center transition flex flex-col items-center gap-1 group cursor-pointer">
              <span class="w-6 h-6 rounded-full bg-prada/20 text-prada group-hover:bg-prada group-hover:text-keraton font-bold text-xs flex items-center justify-center">7</span>
              <span class="text-[9px] text-sogan-300 truncate w-full hidden sm:block">Teh Manis</span>
            </button>
          </div>
        </div>

        <!-- Right: Reactive Detail Card (5 cols) -->
        <div id="tumpengDetailCard" class="lg:col-span-5 bg-gradient-to-b from-[#141A28] to-[#0B0F19] p-6 rounded-3xl border border-prada/40 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-sogan-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-prada text-keraton font-mono font-black text-lg flex items-center justify-center shadow-lg shadow-prada/20">
                <span id="tumpengDetailNum">1</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider text-prada">Rincian Ubarampe Sesaji</span>
                <h4 id="tumpengDetailTitle" class="font-marcellus text-lg font-bold gold-gradient-text">
                  Tumpeng Panca Warna (Kiblat Papat Limo Pancer)
                </h4>
              </div>
            </div>
            <i id="tumpengDetailIcon" class="fa-solid fa-bowl-rice text-prada text-xl"></i>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/80 flex items-center justify-between">
              <span class="text-sogan-400">Posisi &amp; Sajian:</span>
              <strong id="tumpengDetailPos" class="text-amber-200">Piring Utama / Tengah · 5 Warna</strong>
            </div>

            <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/80 flex items-center justify-between">
              <span class="text-sogan-400">Simbol &amp; Pralambang:</span>
              <strong id="tumpengDetailSimbol" class="text-prada">Keseimbangan Jagad Gede &amp; Jagad Cilik</strong>
            </div>

            <div class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold text-prada flex items-center gap-1.5 uppercase tracking-wide">
                <i class="fa-solid fa-circle-info"></i> Deskripsi Ubarampe
              </span>
              <p id="tumpengDetailDesc" class="text-sogan-200 leading-relaxed text-xs p-3 rounded-xl bg-sogan-900/40 border border-sogan-800/60">
                Lima tumpeng mini yang disusun mengelilingi pusat. Di puncak tumpeng tengah (hijau) ditancapkan pasak 'Tombak Rojo' berupa bilah lidi dengan cabai merah dan bawang putih tunggal sebagai senjata spiritual penolak bala ageng.
              </p>
            </div>

            <div class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold text-prada flex items-center gap-1.5 uppercase tracking-wide">
                <i class="fa-solid fa-scroll"></i> Makna Filosofis &amp; Spiritual Jawa
              </span>
              <p id="tumpengDetailMakna" class="text-sogan-200 leading-relaxed text-xs p-3 rounded-xl bg-sogan-900/40 border border-sogan-800/60">
                Melambangkan penyelarasan empat anasir semesta (tanah, api, air, udara) dan empat nafsu manusia (mutmainnah, amarah, supiyah, aluamah) yang dipimpin oleh sang Pancer (kesadaran jiwa raga).
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Filosofi 5 Warna Tumpeng Panca Warna (Kiblat Papat Limo Pancer) -->
      <div class="space-y-4 pt-4 border-t border-sogan-800">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-palette text-prada text-sm"></i>
          <h4 class="font-marcellus text-lg font-bold text-prada">
            Filosofi 5 Warna Tumpeng Panca Warna (Kiblat Papat Limo Pancer)
          </h4>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          <!-- 1. Ijo (Pancer / Hayat) -->
          <div class="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/20 via-emerald-600/5 to-transparent border border-emerald-400/60 space-y-2 flex flex-col justify-between shadow-md">
            <div class="space-y-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-emerald-600 text-white border border-emerald-400 inline-block">
                Pancer (Tengah)
              </span>
              <h5 class="font-marcellus text-sm font-bold text-white">Nasi Hijau — Tombak Rojo</h5>
              <p class="text-[11px] text-sogan-300 leading-relaxed">
                Di puncaknya ditancapkan pasak 'Tombak Rojo' (cabai merah dan bawang putih tunggal). Mengikat keempat arah agar manunggal dalam lindungan Gusti.
              </p>
            </div>
            <div class="pt-2 border-t border-emerald-900/40 text-[10px] text-emerald-300/90 font-mono">
              Unsur: Hayat &bull; Sedulur: Raga Pribadi
            </div>
          </div>

          <!-- 2. Putih (Wetan / Mutmainnah) -->
          <div class="p-4 rounded-2xl bg-gradient-to-b from-slate-100/10 via-slate-200/5 to-transparent border border-slate-400/40 space-y-2 flex flex-col justify-between shadow-md">
            <div class="space-y-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-900 border border-slate-300 inline-block">
                Wetan (Timur)
              </span>
              <h5 class="font-marcellus text-sm font-bold text-white">Nasi Putih — Mutmainnah</h5>
              <p class="text-[11px] text-sogan-300 leading-relaxed">
                Menghadap fajar terbit. Hidup diawali niat yang suci, nurani bersih, ketulusan tanpa pamrih dalam mengabdi kepada sesama.
              </p>
            </div>
            <div class="pt-2 border-t border-slate-800/40 text-[10px] text-slate-300/90 font-mono">
              Unsur: Banyu/Hawa &bull; Sedulur: Kakang Kawah
            </div>
          </div>

          <!-- 3. Abang (Kidul / Amarah) -->
          <div class="p-4 rounded-2xl bg-gradient-to-b from-rose-500/15 via-rose-600/5 to-transparent border border-rose-500/50 space-y-2 flex flex-col justify-between shadow-md">
            <div class="space-y-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-rose-500 text-white border border-rose-400 inline-block">
                Kidul (Selatan)
              </span>
              <h5 class="font-marcellus text-sm font-bold text-white">Nasi Merah — Amarah</h5>
              <p class="text-[11px] text-sogan-300 leading-relaxed">
                Lambang energi api yang membakar kebatilan. Nafsu amarah dikendalikan agar menjadi daya dorong membela kebenaran.
              </p>
            </div>
            <div class="pt-2 border-t border-rose-900/40 text-[10px] text-rose-300/90 font-mono">
              Unsur: Geni &bull; Sedulur: Getih
            </div>
          </div>

          <!-- 4. Kuning (Kulon / Supiyah) -->
          <div class="p-4 rounded-2xl bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent border border-amber-400/50 space-y-2 flex flex-col justify-between shadow-md">
            <div class="space-y-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-amber-400 text-amber-950 border border-amber-300 inline-block">
                Kulon (Barat)
              </span>
              <h5 class="font-marcellus text-sm font-bold text-white">Nasi Kuning — Supiyah</h5>
              <p class="text-[11px] text-sogan-300 leading-relaxed">
                Menghadap matahari terbenam. Simbol kematangan, kemakmuran, kemuliaan hidup, dan rezeki lumintu tanpa kesombongan.
              </p>
            </div>
            <div class="pt-2 border-t border-amber-900/40 text-[10px] text-amber-300/90 font-mono">
              Unsur: Angin &bull; Sedulur: Tali Puser
            </div>
          </div>

          <!-- 5. Cemeng (Lor / Aluamah) -->
          <div class="p-4 rounded-2xl bg-gradient-to-b from-zinc-800/30 via-zinc-900/10 to-transparent border border-zinc-600/50 space-y-2 flex flex-col justify-between shadow-md">
            <div class="space-y-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-zinc-800 text-zinc-100 border border-zinc-600 inline-block">
                Lor (Utara)
              </span>
              <h5 class="font-marcellus text-sm font-bold text-white">Nasi Hitam — Aluamah</h5>
              <p class="text-[11px] text-sogan-300 leading-relaxed">
                Kutub ketenangan dan bumi pertiwi. Pengekangan hawa nafsu kedagingan agar jiwa teguh dan tahan menghadapi segala cobaan zaman.
              </p>
            </div>
            <div class="pt-2 border-t border-zinc-800/40 text-[10px] text-zinc-300/90 font-mono">
              Unsur: Bumi/Tanah &bull; Sedulur: Adi Ari-Ari
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Aktifkan hotspot pertama
  if (typeof window.selectTumpengHotspot === 'function') {
    window.selectTumpengHotspot(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODAL ZOOM GAMBAR KOMPAS DANYANG
// ─────────────────────────────────────────────────────────────────────────────

export function openKompasImageZoomModal() {
  let modal = document.getElementById('modalKompasImageZoom');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalKompasImageZoom';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md transition-all duration-300';
    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-[#0e131d] border border-prada/70 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-sogan-800 bg-keraton">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-compass text-prada"></i>
            <span class="font-marcellus text-sm font-bold text-amber-200">Diagram Kompas Danyang Spiritual Jawa</span>
          </div>
          <button onclick="window.closeKompasImageZoomModal && window.closeKompasImageZoomModal()" class="w-8 h-8 rounded-full bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-prada flex items-center justify-center">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="p-4 overflow-visible flex items-center justify-center bg-white">
          <img src="./assets/kompas_danyang.jpg" alt="Kompas Danyang" style="transform: rotate(-90deg); image-rendering: crisp-edges; image-rendering: -webkit-optimize-contrast;" class="max-h-[75vh] w-auto object-contain block mx-auto rounded-xl shadow" />
        </div>
        <div class="px-5 py-3 border-t border-sogan-800 bg-keraton flex items-center justify-between text-xs text-sogan-300">
          <span>Aset Asli: <code class="text-amber-300 font-mono">kompas_danyang.jpg</code></span>
          <button onclick="window.closeKompasImageZoomModal && window.closeKompasImageZoomModal()" class="px-4 py-1.5 rounded-xl bg-sogan-900 border border-prada/40 text-prada font-semibold text-xs">
            Tutup
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function closeKompasImageZoomModal() {
  const modal = document.getElementById('modalKompasImageZoom');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

if (typeof window !== 'undefined') {
  window.initSinengkerUI = initSinengkerUI;
  window.submitSinengkerPin = submitSinengkerPin;
  window.lockSinengkerUI = lockSinengkerUI;
  window.switchSinengkerSubtab = switchSinengkerSubtab;
  window.copyAjiMantra = copyAjiMantra;
  window.copyRuwatanMantra = copyRuwatanMantra;
  window.openKompasImageZoomModal = openKompasImageZoomModal;
  window.closeKompasImageZoomModal = closeKompasImageZoomModal;
}
