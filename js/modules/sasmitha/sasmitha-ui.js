/**
 * Jagad Jawa — Modul Domain: Sasmitha UI (Tanda Alam & Tubuh)
 * Pengendali DOM untuk modul Sasmitha (Impen, Kedut, Gerhana, Lindu, Tejo),
 * pencarian kata kunci, adaptasi Mode Pemula (Impen + Kedut) vs Mode Ahli (Lengkap),
 * serta banner disclaimer keselamatan BMKG/BPBD.
 */

import {
  searchImpen,
  getKedutList,
  getGerhanaBySasi,
  getLinduBySasi,
  getTejoList,
  REF_SASI_JAWA
} from './sasmitha-engine.js';
import { SASMITHA_KEDUT } from '../../data/sasmitha-db.js';
import { isPemula } from '../../ui/mode.js';
import { showToast } from '../../ui/toast.js';

let currentSubtab = 'impen'; // 'impen' | 'kedut' | 'gerhana' | 'lindu' | 'tejo'
let queryImpen = '';
let queryKedut = '';
let activeKedutKategori = '';
let activeGerhanaSasi = 'Sura';
let activeLinduSasi = 'Sura';
let activeLinduWaktu = 'awan';
let activeKedutViewMode = 'anatomi'; // 'anatomi' | 'kartu'
let selectedAnatomiPointId = 1;

export const TITIK_ANATOMI_KEDUT = [
  // Sirah & Pasuryan (Kanan & Tengah & Kiri)
  { id: 1, label: 'Embun-embun', x: 270, y: 34, textX: 18, textY: 38, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 2, label: 'Bathuk (Dahi)', x: 270, y: 52, textX: 382, textY: 48, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 4, label: 'Alis Tengen', x: 254, y: 68, textX: 18, textY: 66, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 5, label: 'Alis Kiwa', x: 286, y: 68, textX: 382, textY: 74, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 6, label: 'Telapukan Tengen', x: 252, y: 78, textX: 18, textY: 94, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 7, label: 'Telapukan Kiwa', x: 288, y: 78, textX: 382, textY: 102, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 12, label: 'Kuping Tengen', x: 236, y: 78, textX: 18, textY: 122, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 13, label: 'Kuping Kiwa', x: 304, y: 78, textX: 382, textY: 128, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 18, label: 'Irung Tengen', x: 264, y: 88, textX: 18, textY: 150, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 19, label: 'Irung Kiwa', x: 276, y: 88, textX: 382, textY: 154, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 24, label: 'Lambe Duwur', x: 270, y: 98, textX: 18, textY: 178, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },
  { id: 25, label: 'Lambe Ngisor', x: 270, y: 106, textX: 382, textY: 180, arrowDir: 'right', kategori: 'Sirah & Pasuryan' },
  { id: 28, label: 'Gulu Tengen', x: 258, y: 122, textX: 18, textY: 206, arrowDir: 'left', kategori: 'Sirah & Pasuryan' },

  // Asta & Tangan
  { id: 30, label: 'Bau Tengen (Pundak)', x: 198, y: 142, textX: 18, textY: 234, arrowDir: 'left', kategori: 'Asta & Tangan' },
  { id: 31, label: 'Bau Kiwa (Pundak)', x: 342, y: 142, textX: 382, textY: 208, arrowDir: 'right', kategori: 'Asta & Tangan' },
  { id: 32, label: 'Sikut Tengen', x: 165, y: 230, textX: 18, textY: 266, arrowDir: 'left', kategori: 'Asta & Tangan' },
  { id: 33, label: 'Sikut Kiwa', x: 375, y: 230, textX: 382, textY: 242, arrowDir: 'right', kategori: 'Asta & Tangan' },
  { id: 36, label: 'Epek-epek Tengen', x: 140, y: 325, textX: 18, textY: 302, arrowDir: 'left', kategori: 'Asta & Tangan' },
  { id: 37, label: 'Epek-epek Kiwa', x: 400, y: 325, textX: 382, textY: 282, arrowDir: 'right', kategori: 'Asta & Tangan' },
  { id: 40, label: 'Driji Panuduh Tengen', x: 132, y: 355, textX: 18, textY: 338, arrowDir: 'left', kategori: 'Asta & Tangan' },

  // Salira & Dada
  { id: 54, label: 'Dada Tengen', x: 235, y: 185, textX: 18, textY: 374, arrowDir: 'left', kategori: 'Salira & Dada' },
  { id: 55, label: 'Dada Kiwa', x: 305, y: 185, textX: 382, textY: 322, arrowDir: 'right', kategori: 'Salira & Dada' },
  { id: 56, label: 'Lambung Tengen', x: 232, y: 245, textX: 18, textY: 410, arrowDir: 'left', kategori: 'Salira & Dada' },
  { id: 59, label: 'Puser (Pusar)', x: 270, y: 255, textX: 382, textY: 362, arrowDir: 'right', kategori: 'Salira & Dada' },

  // Suku & Sikil
  { id: 67, label: 'Pupu Tengen (Paha)', x: 235, y: 360, textX: 18, textY: 448, arrowDir: 'left', kategori: 'Suku & Sikil' },
  { id: 68, label: 'Pupu Kiwa (Paha)', x: 305, y: 360, textX: 382, textY: 412, arrowDir: 'right', kategori: 'Suku & Sikil' },
  { id: 69, label: 'Jengku Tengen (Lutut)', x: 240, y: 435, textX: 18, textY: 488, arrowDir: 'left', kategori: 'Suku & Sikil' },
  { id: 70, label: 'Jengku Kiwa (Lutut)', x: 300, y: 435, textX: 382, textY: 462, arrowDir: 'right', kategori: 'Suku & Sikil' },
  { id: 71, label: 'Wentis Tengen (Betis)', x: 240, y: 500, textX: 18, textY: 528, arrowDir: 'left', kategori: 'Suku & Sikil' },
  { id: 72, label: 'Wentis Kiwa (Betis)', x: 300, y: 500, textX: 382, textY: 512, arrowDir: 'right', kategori: 'Suku & Sikil' },
  { id: 73, label: 'Tlapakan Tengen', x: 230, y: 580, textX: 18, textY: 574, arrowDir: 'left', kategori: 'Suku & Sikil' },
  { id: 74, label: 'Tlapakan Kiwa', x: 310, y: 580, textX: 382, textY: 566, arrowDir: 'right', kategori: 'Suku & Sikil' }
];

const KEDUT_CATEGORIES = [
  { id: '', label: 'Sedaya Perangan' },
  { id: 'Sirah & Pasuryan', label: 'Sirah & Pasuryan' },
  { id: 'Asta & Tangan', label: 'Asta & Tangan' },
  { id: 'Salira & Dada', label: 'Salira & Dada' },
  { id: 'Suku & Sikil', label: 'Suku & Sikil' },
  { id: 'Wewengkon Khusus', label: 'Wewengkon Khusus (Sensitif)', ahliOnly: true }
];

/**
 * Inisialisasi komponen UI Sasmitha
 */
export function initSasmithaUI() {
  setupEventListeners();
  renderSasmithaView();
}

function setupEventListeners() {
  // Mode changed listener to auto-adjust view
  if (typeof window !== 'undefined') {
    window.addEventListener('mode-changed', () => {
      if (isPemula() && (currentSubtab === 'gerhana' || currentSubtab === 'lindu' || currentSubtab === 'tejo')) {
        currentSubtab = 'impen';
      }
      renderSasmithaView();
    });
  }
}

/**
 * Ganti sub-tab aktif
 */
export function switchSasmithaSubtab(subtab) {
  if (isPemula() && (subtab === 'gerhana' || subtab === 'lindu' || subtab === 'tejo')) {
    showToast('Sub-menu punika namung cumawis ing Mode Ahli (Lengkap).');
    return;
  }
  currentSubtab = subtab;
  renderSasmithaView();
}

/**
 * Pencarian Impen (Mimpi)
 */
export function onImpenSearchInput(val) {
  queryImpen = val.trim();
  renderImpenContent();
}

/**
 * Pencarian Kedutan
 */
export function onKedutSearchInput(val) {
  queryKedut = val.trim();
  renderKedutContent();
}

/**
 * Ganti filter kategori kedut
 */
export function onKedutCategorySelect(kategori) {
  activeKedutKategori = kategori;
  renderKedutContent();
}

/**
 * Ganti Sasi Gerhana
 */
export function onGerhanaSasiSelect(sasi) {
  activeGerhanaSasi = sasi;
  renderGerhanaContent();
}

/**
 * Ganti Sasi Lindu
 */
export function onLinduSasiSelect(sasi) {
  activeLinduSasi = sasi;
  renderLinduContent();
}

/**
 * Ganti Waktu Lindu (Awan vs Wengi)
 */
export function onLinduWaktuToggle(waktu) {
  activeLinduWaktu = waktu;
  renderLinduContent();
}

/**
 * Render keseluruhan view Sasmitha
 */
export function renderSasmithaView() {
  const container = document.getElementById('sasmithaResultContainer');
  if (!container) return;

  const isModePemulaActive = isPemula();
  if (isModePemulaActive && (currentSubtab === 'gerhana' || currentSubtab === 'lindu' || currentSubtab === 'tejo')) {
    currentSubtab = 'impen';
  }

  // Subtab buttons HTML
  const navTabs = [
    { id: 'impen', icon: 'fa-cloud-moon', label: 'Impen (Mimpi)', pemula: true },
    { id: 'kedut', icon: 'fa-hand-dots', label: 'Kedut (Kedutan)', pemula: true },
    { id: 'merapi', icon: 'fa-mountain-sun', label: 'Sasmitha Merapi', pemula: true },
    { id: 'gerhana', icon: 'fa-circle-half-stroke', label: 'Gerhana', pemula: false },
    { id: 'lindu', icon: 'fa-volcano', label: 'Lindu (Gempa)', pemula: false },
    { id: 'tejo', icon: 'fa-sun', label: 'Tejo (Cahaya Langit)', pemula: false }
  ];

  const subtabsHtml = navTabs.map(t => {
    const isActive = currentSubtab === t.id;
    const activeCls = isActive
      ? 'bg-prada text-keraton font-bold shadow'
      : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';
    const ahliCls = !t.pemula ? 'ahli-only' : '';
    return `
      <button onclick="switchSasmithaSubtab('${t.id}')" class="${ahliCls} px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${activeCls}">
        <i class="fa-solid ${t.icon}"></i>
        <span>${t.label}</span>
      </button>
    `;
  }).join('');

  const pemulaNoticeHtml = `
    <div class="pemula-only p-3 rounded-xl bg-sogan-950/40 border border-sogan-800 text-[11.5px] text-sogan-300 mb-4 flex items-center gap-2.5">
      <i class="fa-solid fa-circle-info text-prada shrink-0"></i>
      <span>Mode Ringkas (Pemula): Nampilaken pitedah Impen, Kedut, lan Sasmitha Merapi. Mangga gantos dhateng <strong>Mode Ahli (Lengkap)</strong> kanggé mbikak Sasmitha Gerhana, Lindu, lan Tejo.</span>
    </div>
  `;

  container.innerHTML = `
    <!-- SUBTABS NAVIGATION -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      ${subtabsHtml}
    </div>

    <!-- NOTICE MODE PEMULA -->
    ${pemulaNoticeHtml}

    <!-- DYNAMIC SECTION CONTAINER -->
    <div id="sasmithaDynamicContent"></div>
  `;

  // Render subtab yang dipilih
  if (currentSubtab === 'impen') renderImpenContent();
  else if (currentSubtab === 'kedut') renderKedutContent();
  else if (currentSubtab === 'merapi') renderMerapiContent();
  else if (currentSubtab === 'gerhana') renderGerhanaContent();
  else if (currentSubtab === 'lindu') renderLinduContent();
  else if (currentSubtab === 'tejo') renderTejoContent();
}

/**
 * 1. IMPEN (MIMPI)
 */
function renderImpenContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const items = searchImpen(queryImpen);

  dynamic.innerHTML = `
    <div class="p-4 sm:p-5 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2">
            <i class="fa-solid fa-cloud-moon text-prada"></i> Sasmitha Impen (99 Piwulang Tafsir)
          </h3>
          <p class="text-xs text-sogan-300 mt-0.5">
            Mawa tetuladan primbon sastra tradisi: "Yèn Ngimpi -> Pratandhané".
          </p>
        </div>
        <div class="text-xs text-sogan-400 font-mono">
          Kasil: <strong class="text-prada font-bold">${items.length}</strong> / 99 impen
        </div>
      </div>

      <!-- SEARCH INPUT -->
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-sogan-400 text-xs"></i>
        <input
          type="text"
          id="impenSearchInput"
          value="${escapeHtml(queryImpen)}"
          placeholder="Pados tembung impen (upami: perang, bledeg, kali, srengenge, lsp)..."
          oninput="onImpenSearchInput(this.value)"
          class="w-full bg-keraton/90 border border-sogan-700 focus:border-prada rounded-xl pl-9 pr-4 py-2 text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-prada transition font-sans"
        />
        ${queryImpen ? `
          <button onclick="onImpenSearchInput(''); document.getElementById('impenSearchInput').value='';" class="absolute right-3 top-2.5 text-sogan-400 hover:text-amber-200 text-xs">
            <i class="fa-solid fa-xmark"></i>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- GRID IMPEN CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      ${items.length === 0 ? `
        <div class="col-span-2 p-8 text-center text-xs text-sogan-400 bg-wulung/40 rounded-2xl border border-sogan-800">
          <i class="fa-solid fa-wind text-2xl mb-2 text-sogan-500 block"></i>
          Boten kepanggih pitedah impen kanthi tembung "<strong>${escapeHtml(queryImpen)}</strong>".
        </div>
      ` : items.map(item => `
        <div class="p-4 rounded-xl bg-wulung/60 border border-sogan-800/80 hover:border-prada/40 transition shadow flex flex-col justify-between group">
          <div>
            <div class="text-[10px] font-mono text-sogan-400 uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>Nomor ${item.id}</span>
              <i class="fa-solid fa-sparkles text-prada/60 group-hover:text-prada transition"></i>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-amber-200 mb-2 leading-snug">
              Yèn ngimpi: <span class="text-prada-light">"${item.yen_ngimpi}"</span>
            </div>
          </div>
          <div class="pt-2.5 border-t border-sogan-800/80 text-xs text-sogan-200 leading-relaxed bg-keraton/40 p-2.5 rounded-lg mt-2">
            <strong class="text-prada text-[11px] block font-mono uppercase mb-0.5">Pratandhané:</strong>
            ${item.pratanda}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function setKedutViewMode(mode) {
  activeKedutViewMode = mode;
  renderKedutContent();
}

export function pilihTitikAnatomiKedut(id) {
  const numId = Number(id);
  selectedAnatomiPointId = numId;
  const item = SASMITHA_KEDUT.find(k => k.id === numId);
  if (!item) return;

  // Update spotlight card if already rendered
  const spotEl = document.getElementById('anatomiSpotlightCard');
  if (spotEl) {
    spotEl.innerHTML = `
      <div class="flex items-center justify-between gap-2 border-b border-prada/30 pb-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-prada text-keraton font-mono font-bold text-xs shadow">
            Nomer ${item.id}
          </span>
          <h4 class="text-sm sm:text-base font-bold text-amber-100">${item.bagian_badan}</h4>
        </div>
        <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-sogan-900 border border-sogan-700 text-prada">${item.kategori}</span>
      </div>
      <div class="text-xs text-sogan-200 leading-relaxed">
        <span class="text-prada font-semibold block text-[11px] uppercase font-mono mb-0.5">Wahanané / Pratandha:</span>
        <p class="text-amber-100 font-serif text-sm bg-keraton/60 p-2.5 rounded-lg border border-sogan-800">${item.wahanane}</p>
      </div>
    `;
  }

  // Highlight list item in the legend column & auto-scroll
  document.querySelectorAll('.anatomi-legend-item').forEach(el => {
    const elId = Number(el.getAttribute('data-point-id'));
    if (elId === numId) {
      el.classList.add('border-prada', 'bg-sogan-900/80', 'ring-1', 'ring-prada');
      el.classList.remove('border-sogan-800/80', 'bg-wulung/60');
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (err) {
        el.scrollIntoView();
      }
    } else {
      el.classList.remove('border-prada', 'bg-sogan-900/80', 'ring-1', 'ring-prada');
      el.classList.add('border-sogan-800/80', 'bg-wulung/60');
    }
  });

  // Re-highlight SVG active node (dot circle, halo, rect badge, text)
  document.querySelectorAll('.anatomi-svg-node').forEach(node => {
    const nodeId = Number(node.getAttribute('data-id'));
    const isTarget = nodeId === numId;
    const circle = node.querySelector('.anatomi-pin-circle');
    const halo = node.querySelector('.anatomi-pin-halo');
    const text = node.querySelector('.anatomi-pin-text');
    const rect = node.querySelector('rect');
    if (circle) {
      circle.setAttribute('fill', isTarget ? '#eab308' : '#d4af37');
      circle.setAttribute('r', isTarget ? '7' : '4.5');
    }
    if (halo) {
      halo.setAttribute('opacity', isTarget ? '0.85' : '0');
    }
    if (text) {
      text.setAttribute('fill', isTarget ? '#fef08a' : '#d4af37');
      text.setAttribute('font-weight', isTarget ? 'bold' : 'normal');
    }
    if (rect) {
      rect.setAttribute('fill', isTarget ? 'rgba(234,179,8,0.35)' : 'rgba(15,20,29,0.75)');
      rect.setAttribute('stroke', isTarget ? '#eab308' : 'rgba(212,175,55,0.4)');
      rect.setAttribute('stroke-width', isTarget ? '1.5' : '1');
    }
  });
}

/**
 * 2. KEDUT (KEDUTAN BADAN & BAGAN ANATOMI SILUET)
 */
function renderKedutContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const isAhli = !isPemula();
  const items = getKedutList({
    query: queryKedut,
    kategori: activeKedutKategori,
    includeSensitive: isAhli
  });

  const activeSpotlight = SASMITHA_KEDUT.find(k => k.id === selectedAnatomiPointId) || SASMITHA_KEDUT[0];

  const viewSwitchHtml = `
    <div class="flex items-center gap-1.5 p-1 bg-sogan-950/80 rounded-xl border border-sogan-800 w-fit mb-3">
      <button onclick="window.setKedutViewMode('anatomi')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${activeKedutViewMode === 'anatomi' ? 'bg-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-amber-100'}">
        <i class="fa-solid fa-person text-sm"></i>
        <span>Bagan Anatomi Siluet Awak</span>
      </button>
      <button onclick="window.setKedutViewMode('kartu')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${activeKedutViewMode === 'kartu' ? 'bg-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-amber-100'}">
        <i class="fa-solid fa-table-cells-large text-sm"></i>
        <span>Dhaptar Sedaya Kartu (74)</span>
      </button>
    </div>
  `;

  if (activeKedutViewMode === 'anatomi') {
    // ─── BAGAN ANATOMI SILUET TUBUH ──────────────────────────────────────────
    dynamic.innerHTML = `
      <div class="space-y-4">
        
        <!-- HEADER & VIEW SWITCH -->
        <div class="p-4 sm:p-5 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2">
                <i class="fa-solid fa-person-rays text-prada"></i> Bagan Anatomi Sasmitha Kedutan Awak
              </h3>
              <p class="text-xs text-sogan-300 mt-0.5">
                Pituduh visual siluet raga manungsa kanthi panah penomoran (<code class="text-prada font-mono">&lt;-- No. X</code>) lan teges wahanané.
              </p>
            </div>
            <div class="text-xs text-sogan-400 font-mono">
              Titik Anatomi: <strong class="text-prada font-bold">${TITIK_ANATOMI_KEDUT.length}</strong> titik utama
            </div>
          </div>
          ${viewSwitchHtml}

          <!-- ACTIVE SPOTLIGHT INSPECTOR -->
          <div id="anatomiSpotlightCard" class="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-sogan-950 via-keraton to-wulung border border-prada/50 shadow-md">
            <div class="flex items-center justify-between gap-2 border-b border-prada/30 pb-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-prada text-keraton font-mono font-bold text-xs shadow">
                  Nomer ${activeSpotlight.id}
                </span>
                <h4 class="text-sm sm:text-base font-bold text-amber-100">${activeSpotlight.bagian_badan}</h4>
              </div>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-sogan-900 border border-sogan-700 text-prada">${activeSpotlight.kategori}</span>
            </div>
            <div class="text-xs text-sogan-200 leading-relaxed">
              <span class="text-prada font-semibold block text-[11px] uppercase font-mono mb-0.5">Wahanané / Pratandha:</span>
              <p class="text-amber-100 font-serif text-sm bg-keraton/60 p-2.5 rounded-lg border border-sogan-800">${activeSpotlight.wahanane}</p>
            </div>
          </div>
        </div>

        <!-- 2-COLUMN DISPLAY: SVG SILUET (KIRI) & KOLOM KETERANGAN (KANAN) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <!-- KOLOM KIRI: SVG SILUET TUBUH DENGAN PANAH NOMOR -->
          <div class="lg:col-span-7 bg-keraton p-4 sm:p-5 rounded-2xl border border-sogan-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div class="w-full flex items-center justify-between text-xs text-sogan-400 border-b border-sogan-800/80 pb-2 mb-2">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-arrow-left text-prada"></i> Perangan Tengen Awak</span>
              <span class="text-[10px] text-prada font-mono uppercase tracking-wider">Siluet Raga Tradisi</span>
              <span class="flex items-center gap-1.5">Perangan Kiwa Awak <i class="fa-solid fa-arrow-right text-prada"></i></span>
            </div>

            <div class="w-full max-w-[540px] aspect-[540/620] relative">
              <svg viewBox="0 0 540 620" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <marker id="arrowLeft" markerWidth="6" markerHeight="6" refX="2" refY="3" orient="auto">
                    <path d="M 6,0 L 0,3 L 6,6 Z" fill="#d4af37" />
                  </marker>
                  <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <path d="M 0,0 L 6,3 L 0,6 Z" fill="#d4af37" />
                  </marker>
                </defs>

                <!-- SILUET DASAR TUBUH MANUSIA (KERATON GOLD CONTOUR) -->
                <g fill="#121824" stroke="#d4af37" stroke-width="1.8" filter="url(#goldGlow)" opacity="0.95">
                  <!-- Kepala & Leher -->
                  <ellipse cx="270" cy="68" rx="30" ry="38" />
                  <path d="M 258,104 Q 256,126 244,136 L 296,136 Q 284,126 282,104 Z" />
                  <!-- Batang Tubuh, Bahu & Lengan -->
                  <path d="M 244,136 L 198,144 Q 185,160 178,210 Q 165,230 152,275 L 136,330 Q 132,350 138,360 Q 146,360 150,345 L 170,290 L 188,245 L 215,245 Q 212,280 220,320 L 260,325 L 270,325 L 280,325 L 320,320 Q 328,280 325,245 L 352,245 L 370,290 L 390,345 Q 394,360 402,360 Q 408,350 404,330 L 388,275 Q 375,230 362,210 Q 355,160 342,144 L 296,136 Z" />
                  <!-- Kaki Tengen (Kanan Pasien / Kiri Gambar) -->
                  <path d="M 220,320 L 222,425 Q 220,440 226,450 L 225,520 Q 222,550 216,575 L 244,582 Q 248,565 248,525 L 254,450 Q 258,440 256,425 L 258,325 Z" />
                  <!-- Kaki Kiwa (Kiri Pasien / Kanan Gambar) -->
                  <path d="M 282,325 L 284,425 Q 282,440 286,450 L 292,525 Q 292,565 296,582 L 324,575 Q 318,550 315,520 L 314,450 Q 320,440 318,425 L 320,320 Z" />
                </g>

                <!-- GARIS KONTUR SENDI DALAM -->
                <g stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="none" pointer-events="none">
                  <path d="M 235,185 Q 270,195 305,185" />
                  <circle cx="270" cy="255" r="3" fill="#d4af37" />
                  <ellipse cx="240" cy="435" rx="10" ry="7" />
                  <ellipse cx="300" cy="435" rx="10" ry="7" />
                </g>

                <!-- TITIK-TITIK & PANAH PENOMORAN (INTERAKTIF) -->
                ${TITIK_ANATOMI_KEDUT.map(p => {
                  const isSelected = p.id === selectedAnatomiPointId;
                  const isLeft = p.arrowDir === 'left';
                  const lineStartX = isLeft ? p.textX + 115 : p.textX - 10;
                  const arrowMarker = isLeft ? 'url(#arrowLeft)' : 'url(#arrowRight)';
                  const labelText = isLeft ? `<-- No. ${p.id}` : `No. ${p.id} -->`;
                  const subLabel = p.label;

                  return `
                    <g class="anatomi-svg-node" data-id="${p.id}" onclick="window.pilihTitikAnatomiKedut(${p.id})" style="cursor: pointer; pointer-events: all;">
                      <!-- Connector Line: dekoratif, tidak menangkap klik -->
                      <line x1="${lineStartX}" y1="${p.textY}" x2="${p.x}" y2="${p.y}" stroke="${isSelected ? '#eab308' : 'rgba(212,175,55,0.5)'}" stroke-width="${isSelected ? '1.8' : '1'}" stroke-dasharray="${isSelected ? 'none' : '3,2'}" pointer-events="none" />
                      
                      <!-- Halo Animation on Active: dekoratif -->
                      <circle class="anatomi-pin-halo" cx="${p.x}" cy="${p.y}" r="10" fill="none" stroke="#eab308" stroke-width="1.5" opacity="${isSelected ? '0.7' : '0'}" pointer-events="none" />
                      
                      <!-- Center Target Circle Pin: interaktif -->
                      <circle class="anatomi-pin-circle transition-all duration-200" cx="${p.x}" cy="${p.y}" r="${isSelected ? '6.5' : '4.5'}" fill="${isSelected ? '#eab308' : '#d4af37'}" stroke="#0b0f17" stroke-width="1.5" pointer-events="all" />
                      
                      <!-- Callout Badge Rect: interaktif -->
                      <rect x="${isLeft ? p.textX : p.textX - 10}" y="${p.textY - 9}" width="${isLeft ? 115 : 115}" height="17" rx="3.5" fill="${isSelected ? 'rgba(234,179,8,0.25)' : 'rgba(15,20,29,0.75)'}" stroke="${isSelected ? '#eab308' : 'rgba(212,175,55,0.4)'}" stroke-width="1" pointer-events="all" />
                      
                      <text class="anatomi-pin-text transition-colors duration-200" x="${isLeft ? p.textX + 4 : p.textX}" y="${p.textY + 3.5}" fill="${isSelected ? '#fef08a' : '#d4af37'}" font-family="monospace" font-size="9" font-weight="${isSelected ? 'bold' : 'normal'}" pointer-events="none">
                        ${labelText}
                      </text>
                      <text x="${isLeft ? p.textX + 50 : p.textX + 46}" y="${p.textY + 3.5}" fill="#e2e8f0" font-family="sans-serif" font-size="7.5" opacity="0.85" pointer-events="none">
                        ${subLabel.length > 9 ? subLabel.slice(0, 9) + '..' : subLabel}
                      </text>
                    </g>
                  `;
                }).join('')}
              </svg>
            </div>

            <span class="text-[10px] text-sogan-400 mt-2 block text-center">
              Klik nomer panah utawi titik bunderan kanggé mbikak teges wahanané.
            </span>
          </div>

          <!-- KOLOM KANAN: DAFTAR KETERANGAN NOMER & ARTI FIRASAT -->
          <div class="lg:col-span-5 bg-keraton p-4 sm:p-5 rounded-2xl border border-sogan-800 shadow-xl space-y-3 flex flex-col h-[650px]">
            <div class="border-b border-sogan-800 pb-2 flex items-center justify-between">
              <div>
                <h4 class="font-marcellus text-sm font-bold text-prada flex items-center gap-1.5">
                  <i class="fa-solid fa-list-ol text-amber-400"></i> Katrangan Nomer &amp; Wahanané
                </h4>
                <p class="text-[10.5px] text-sogan-400">Rincian arti firasat saben nomer titik awak.</p>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sogan-950 text-prada border border-sogan-800">
                ${TITIK_ANATOMI_KEDUT.length} Titik
              </span>
            </div>

            <!-- SCROLLABLE LEGEND LIST -->
            <div class="overflow-y-auto space-y-2 pr-1 flex-1 custom-scrollbar">
              ${TITIK_ANATOMI_KEDUT.map(p => {
                const item = SASMITHA_KEDUT.find(k => k.id === p.id) || { bagian_badan: p.label, wahanane: '-', kategori: p.kategori };
                const isSelected = p.id === selectedAnatomiPointId;
                return `
                  <div onclick="window.pilihTitikAnatomiKedut(${p.id})" 
                    data-point-id="${p.id}"
                    class="anatomi-legend-item p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-1 ${isSelected ? 'border-prada bg-sogan-900/80 shadow-md' : 'border-sogan-800/80 bg-wulung/60 hover:border-prada/40'}">
                    <div class="flex items-center justify-between gap-1">
                      <div class="flex items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isSelected ? 'bg-prada text-keraton' : 'bg-sogan-950 text-amber-300 border border-sogan-700'}">
                          No. ${p.id}
                        </span>
                        <strong class="text-xs text-amber-100">${item.bagian_badan}</strong>
                      </div>
                      <span class="text-[9.5px] text-sogan-400 font-mono">${item.kategori}</span>
                    </div>
                    <div class="text-[11px] text-sogan-300 leading-snug pl-1 border-l-2 ${isSelected ? 'border-prada text-amber-100' : 'border-sogan-700/60'}">
                      ${item.wahanane}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="pt-2 border-t border-sogan-800/80 text-[10.5px] text-sogan-400 flex items-center justify-between">
              <span>Sumber: Sasmitha Gabungan Tradisi</span>
              <button onclick="window.setKedutViewMode('kartu')" class="text-prada hover:underline">
                Buka Seluruh 74 Kedutan →
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    // Direct DOM event bindings for maximum compatibility & zero-blocking clicks
    dynamic.querySelectorAll('.anatomi-svg-node').forEach(node => {
      const id = Number(node.getAttribute('data-id'));
      node.style.cursor = 'pointer';
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        pilihTitikAnatomiKedut(id);
      });
    });

    dynamic.querySelectorAll('.anatomi-legend-item').forEach(item => {
      const id = Number(item.getAttribute('data-point-id'));
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        pilihTitikAnatomiKedut(id);
      });
    });

    return;
  }

  // ─── DAFTAR KARTU LENGKAP (MODE KARTU) ───────────────────────────────────
  const categoriesHtml = KEDUT_CATEGORIES.map(cat => {
    if (cat.ahliOnly && !isAhli) return '';
    const isActive = activeKedutKategori === cat.id;
    const btnCls = isActive
      ? 'bg-prada text-keraton font-bold shadow'
      : 'bg-keraton/70 text-sogan-300 hover:bg-sogan-900 border border-sogan-800';
    return `
      <button onclick="onKedutCategorySelect('${cat.id}')" class="px-3 py-1 rounded-lg text-[11px] transition ${btnCls}">
        ${cat.label}
      </button>
    `;
  }).join('');

  dynamic.innerHTML = `
    <div class="p-4 sm:p-5 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2">
            <i class="fa-solid fa-hand-dots text-prada"></i> Sasmitha Kedut (74 Perangan Salira)
          </h3>
          <p class="text-xs text-sogan-300 mt-0.5">
            Pitedah kedutan perangan awak miturut primbon Jawi.
          </p>
        </div>
        <div class="text-xs text-sogan-400 font-mono">
          Kasil: <strong class="text-prada font-bold">${items.length}</strong> perangan
        </div>
      </div>

      ${viewSwitchHtml}

      <!-- FILTER KATEGORI -->
      <div class="flex flex-wrap items-center gap-1.5 mb-3">
        ${categoriesHtml}
      </div>

      <!-- SEARCH INPUT -->
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-sogan-400 text-xs"></i>
        <input
          type="text"
          id="kedutSearchInput"
          value="${escapeHtml(queryKedut)}"
          placeholder="Pados perangan awak (upami: alis, kuping, lambe, driji, wentis, lsp)..."
          oninput="onKedutSearchInput(this.value)"
          class="w-full bg-keraton/90 border border-sogan-700 focus:border-prada rounded-xl pl-9 pr-4 py-2 text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-prada transition font-sans"
        />
        ${queryKedut ? `
          <button onclick="onKedutSearchInput(''); document.getElementById('kedutSearchInput').value='';" class="absolute right-3 top-2.5 text-sogan-400 hover:text-amber-200 text-xs">
            <i class="fa-solid fa-xmark"></i>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- GRID KEDUT CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      ${items.length === 0 ? `
        <div class="col-span-full p-8 text-center text-xs text-sogan-400 bg-wulung/40 rounded-2xl border border-sogan-800">
          <i class="fa-solid fa-hand text-2xl mb-2 text-sogan-500 block"></i>
          Boten kepanggih perangan kedutan kanthi filter punika.
        </div>
      ` : items.map(kd => `
        <div class="p-3.5 rounded-xl bg-wulung/60 border border-sogan-800/80 hover:border-prada/40 transition shadow flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[10px] font-mono text-prada uppercase tracking-wider">${kd.kategori}</span>
              ${kd.is_sensitive ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40">Khusus</span>' : ''}
            </div>
            <div class="text-xs sm:text-sm font-bold text-amber-100 mb-1.5">
              ${kd.bagian_badan}
            </div>
          </div>
          <div class="pt-2 border-t border-sogan-800/80 text-xs text-sogan-200 leading-relaxed bg-keraton/40 p-2 rounded-lg mt-1">
            <span class="text-[10px] text-sogan-400 font-mono block">Wahanané:</span>
            <span class="font-medium text-prada-light">${kd.wahanane}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 3. GERHANA (GERHANA SASI)
 */
function renderGerhanaContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const data = getGerhanaBySasi(activeGerhanaSasi);

  dynamic.innerHTML = `
    <div class="p-5 sm:p-6 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-prada/10 text-prada border border-prada/30">
            Sasmitha Langit Adat
          </span>
          <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2 mt-0.5">
            <i class="fa-solid fa-circle-half-stroke text-prada"></i> Gerhana Miturut Sasi Jawa
          </h3>
          <p class="text-xs text-sogan-300 mt-0.5">
            Teks tradisi membaca waktu nalika wonten kedadosan gerhana ing 12 sasi Jawi.
          </p>
        </div>
      </div>

      <!-- SASI SELECTOR -->
      <div class="mb-5">
        <label class="block text-xs font-mono text-sogan-300 uppercase tracking-wider mb-2">
          Piliha Sasi Jawa:
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          ${REF_SASI_JAWA.map(s => {
            const isSel = s.sasi_jawa === activeGerhanaSasi;
            const selCls = isSel
              ? 'bg-prada text-keraton font-bold shadow ring-2 ring-prada-light'
              : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900 border border-sogan-800';
            return `
              <button onclick="onGerhanaSasiSelect('${s.sasi_jawa}')" class="p-2 rounded-xl text-xs transition text-center ${selCls}">
                <div class="font-bold">${s.sasi_jawa}</div>
                <div class="text-[9.5px] opacity-75">${s.padanan_hijriah}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- GERHANA DETAIL CARD -->
      ${data ? `
        <div class="p-5 rounded-2xl bg-keraton/70 border border-sogan-700 shadow-lg relative overflow-hidden">
          <div class="text-xs font-mono text-prada uppercase tracking-widest mb-1">
            Sasi: ${data.sasi_jawa}
          </div>
          <div class="text-lg font-cinzel font-bold text-amber-100 mb-3">
            Ngalamat Gerhana ing Sasi ${data.sasi_jawa}
          </div>
          <div class="p-4 rounded-xl bg-wulung/80 border border-sogan-800 text-xs sm:text-sm text-sogan-100 leading-relaxed mb-3">
            <i class="fa-solid fa-quote-left text-prada mr-1.5 opacity-70"></i>
            ${data.ngalamat}
          </div>
          <p class="text-[11px] text-sogan-400 italic">
            *Katrangan: Pitedah punika sastra budaya tradisi leluhur nalika mirsani gerhana rembulan utawi srengéngé minangka sarana mawas dhiri lan manembah marang Hyang Widhi.
          </p>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * 4. LINDU (GEMPA BUMI)
 */
function renderLinduContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const data = getLinduBySasi(activeLinduSasi, activeLinduWaktu);

  dynamic.innerHTML = `
    <!-- MANDATORY FIXED SAFETY DISCLAIMER (BMKG & BPBD) -->
    <div class="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 mb-4 flex items-start gap-3 shadow-lg">
      <i class="fa-solid fa-triangle-exclamation text-rose-400 text-lg mt-0.5 shrink-0"></i>
      <div class="text-xs leading-relaxed">
        <strong class="text-sm font-bold text-rose-300 block mb-1">Pènget Kaslametan Fisik &amp; Mitigasi Bencana:</strong>
        <p class="opacity-90">
          Petung lindu tradisional punika minangka <strong>kearifan kultural / sastra tradisi</strong> kanggé nggugah raos eling lan waspada ing jaman kina, <strong>sanès ramalan utawi deteksi seismik ilmiah</strong>.
        </p>
        <p class="text-[11px] text-rose-300 font-semibold mt-1">
          Kanggé pèngetan lindu resmi, informasi kaseismikan, lan tanggap darurat bencana, tansah tutna pitedah saking <strong>BMKG</strong> lan <strong>BPBD</strong>.
        </p>
      </div>
    </div>

    <div class="p-5 sm:p-6 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-prada/10 text-prada border border-prada/30">
            Sastra Tanda Alam
          </span>
          <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2 mt-0.5">
            <i class="fa-solid fa-volcano text-prada"></i> Sasmitha Lindu Miturut Sasi Jawa
          </h3>
          <p class="text-xs text-sogan-300 mt-0.5">
            Kearifan tradisi Jawa nalika lumampah lindu ing wayah Awan utawi Wengi.
          </p>
        </div>

        <!-- WAKTU TOGGLE (AWAN VS WENGI) -->
        <div class="flex items-center gap-1.5 bg-keraton/80 p-1 rounded-xl border border-sogan-800">
          <button onclick="onLinduWaktuToggle('awan')" class="px-3 py-1 rounded-lg text-xs font-bold transition ${activeLinduWaktu === 'awan' ? 'bg-amber-500 text-keraton shadow' : 'text-sogan-300 hover:text-amber-100'}">
            <i class="fa-solid fa-sun mr-1"></i> Awan
          </button>
          <button onclick="onLinduWaktuToggle('wengi')" class="px-3 py-1 rounded-lg text-xs font-bold transition ${activeLinduWaktu === 'wengi' ? 'bg-indigo-900 text-indigo-100 border border-indigo-500/50 shadow' : 'text-sogan-300 hover:text-amber-100'}">
            <i class="fa-solid fa-moon mr-1"></i> Wengi
          </button>
        </div>
      </div>

      <!-- SASI SELECTOR -->
      <div class="mb-5">
        <label class="block text-xs font-mono text-sogan-300 uppercase tracking-wider mb-2">
          Piliha Sasi Jawa:
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          ${REF_SASI_JAWA.map(s => {
            const isSel = s.sasi_jawa === activeLinduSasi;
            const selCls = isSel
              ? 'bg-prada text-keraton font-bold shadow ring-2 ring-prada-light'
              : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900 border border-sogan-800';
            return `
              <button onclick="onLinduSasiSelect('${s.sasi_jawa}')" class="p-2 rounded-xl text-xs transition text-center ${selCls}">
                <div class="font-bold">${s.sasi_jawa}</div>
                <div class="text-[9.5px] opacity-75">${s.padanan_hijriah}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- LINDU RESULT DETAIL CARD -->
      ${data ? `
        <div class="p-5 rounded-2xl bg-keraton/70 border border-sogan-700 shadow-lg">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-mono text-prada uppercase tracking-widest">
              Sasi ${data.sasi_jawa} · Wayah ${data.waktuPilihan}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${activeLinduWaktu === 'awan' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'}">
              Wayah ${data.waktuPilihan}
            </span>
          </div>
          <div class="text-lg font-cinzel font-bold text-amber-100 mb-3">
            Ngalamat Lindu ing Sasi ${data.sasi_jawa} (${data.waktuPilihan})
          </div>
          <div class="p-4 rounded-xl bg-wulung/80 border border-sogan-800 text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
            <i class="fa-solid fa-quote-left text-prada mr-1.5 opacity-70"></i>
            ${data.ngalamatPilihan}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-keraton/60 border border-sogan-800">
              <span class="text-[10px] text-sogan-400 font-mono block">Ngalamat Wayah Awan:</span>
              <p class="text-sogan-200 mt-0.5 leading-relaxed">${data.ngalamat_awan}</p>
            </div>
            <div class="p-3 rounded-xl bg-keraton/60 border border-sogan-800">
              <span class="text-[10px] text-sogan-400 font-mono block">Ngalamat Wayah Wengi:</span>
              <p class="text-sogan-200 mt-0.5 leading-relaxed">${data.ngalamat_wengi}</p>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * 5. TEJO (CAHAYA LANGIT / HALO)
 */
function renderTejoContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const items = getTejoList();

  dynamic.innerHTML = `
    <div class="p-4 sm:p-5 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-prada/10 text-prada border border-prada/30">
            Fénoména Atmosfér Tradisi
          </span>
          <h3 class="text-base sm:text-lg font-cinzel font-bold text-amber-100 flex items-center gap-2 mt-0.5">
            <i class="fa-solid fa-sun text-prada"></i> Sasmitha Tejo ing Awang-awang (7 Kiblat)
          </h3>
          <p class="text-xs text-sogan-300 mt-0.5">
            Pitedah nalika wonten tejo, kluwung, utawi bianglala ing 7 arah kiblat.
          </p>
        </div>
      </div>
    </div>

    <!-- GRID 7 DIRECTION TEJO CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      ${items.map(t => `
        <div class="p-4 rounded-xl bg-wulung/60 border border-sogan-800/80 hover:border-prada/40 transition shadow flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-950/60 border border-amber-600/40 text-amber-300">
                ${t.arah_id}
              </span>
              <span class="text-[10px] text-sogan-400 font-mono">Arah ${t.id}</span>
            </div>
            <div class="text-base font-cinzel font-bold text-prada mb-1.5">
              Madhep ${t.arah_jawa}
            </div>
          </div>
          <div class="pt-2.5 border-t border-sogan-800/80 text-xs text-sogan-200 leading-relaxed bg-keraton/40 p-2.5 rounded-lg mt-2">
            <strong class="text-prada text-[10.5px] block font-mono uppercase mb-0.5">Ngalamat:</strong>
            ${t.ngalamat}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 6. SASMITHA GUNUNG MERAPI (ERUPSI & ARAH LAHAR)
 */
function renderMerapiContent() {
  const dynamic = document.getElementById('sasmithaDynamicContent');
  if (!dynamic) return;

  const arahMerapiData = [
    {
      arah: 'Lor (Utara)',
      arah_en: 'Utara / Boyolali - Magelang',
      icon: 'fa-arrow-up',
      simbol: 'Larang Pangan',
      warna: 'from-amber-950/70 to-red-950/40 border-amber-600/50',
      badge_col: 'bg-amber-950 border-amber-600/60 text-amber-300',
      teges: 'Nalika lahar utawi lebu kawah Merapi muntah tumuju arah Lor, para winasis Jawa paring sasmitha bilih bakal tumiba mangsa paceklik utawi larang pangan. Palawija asring kambah ama utawi gagal panen, saengga bebrayan agung kedah ngati-ati nyimpen lumbung pari lan ngirit sandhang pangan.'
    },
    {
      arah: 'Wetan (Timur)',
      arah_en: 'Timur / Klaten - Boyolali',
      icon: 'fa-arrow-right',
      simbol: 'Kemakmuran',
      warna: 'from-emerald-950/70 to-teal-950/40 border-emerald-600/50',
      badge_col: 'bg-emerald-950 border-emerald-600/60 text-emerald-300',
      teges: 'Nalika lahar utawi lebu Merapi mili tumuju arah Wetan, sasmitha punika ngemu kabar kabungahan lan kemakmuran (gemah ripah loh jinawi). Awu vulkanik ingkang tumiba bakal nyuburaken siti pasawahan, asil tetanen tikel matikel, sarta para tani manggih rejeki ingkang luber.'
    },
    {
      arah: 'Kulon (Barat)',
      arah_en: 'Barat / Magelang - Sleman Kulon',
      icon: 'fa-arrow-left',
      simbol: 'Kisruh Pemimpin',
      warna: 'from-purple-950/70 to-slate-950/40 border-purple-600/50',
      badge_col: 'bg-purple-950 border-purple-600/60 text-purple-300',
      teges: 'Nalika ilining lahar utawi erupsi tumuju arah Kulon, sasmitha nglambangaken grahita lan pasulayan para panguwasa utawi pamong praja (kisruh pemimpin). Kahanan politik lan kawicaksanan pamarentahan dados gonjang-ganjing, saengga bebrayan dipun-aturi tansah njaga guyub rukun lan mboten gampil kaprabawan kabar fitnah.'
    },
    {
      arah: 'Kidul (Selatan)',
      arah_en: 'Selatan / Sleman - Yogyakarta',
      icon: 'fa-arrow-down',
      simbol: 'Huru-Hara',
      warna: 'from-red-950/80 to-rose-950/50 border-red-600/60',
      badge_col: 'bg-red-950 border-red-600/60 text-red-300',
      teges: 'Nalika erupsi utawi lahar mili tumuju arah Kidul (ngener kutha Ngayogyakarta), punika sasmitha tandha bakal wonten prahara utawi huru-hara (kisruh sosial) ing madyaning bebrayan agung. Kahanan dados panas lan was-was, mrelokaken manah ingkang wening, dedonga memuji dhateng Gusti, lan laku prihatin murih sedaya balak kapuntir dados tentrem.'
    }
  ];

  dynamic.innerHTML = `
    <div class="space-y-6 mb-6">
      <!-- Banner Sasmitha Merapi -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0f12] via-[#140b0e] to-[#090608] border border-amber-600/40 p-6 sm:p-8 shadow-2xl">
        <div class="space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-700/60 text-red-300 text-xs font-mono font-bold tracking-wider uppercase">
              <i class="fa-solid fa-volcano text-amber-400"></i> Sasmitha Gunung Merapi
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-mono font-semibold">
              <i class="fa-solid fa-compass"></i> Poros Sumbu Filosofis
            </span>
          </div>

          <h3 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text">
            Sasmitha Erupsi &amp; Arah Lahar Gunung Merapi
          </h3>
          <p class="text-xs sm:text-sm text-sogan-200 max-w-3xl leading-relaxed">
            Wawasan kawruh kearifan lokal para winasis lan juru kunci Merapi babagan pituduh sasmitha alam nalika kawah Merapi ngedalaken hawa benter, wedhus gembel, sarta aliran lahar dhedhasar papat kiblat mata angin.
          </p>
        </div>
      </div>

      <!-- 4 Kartu Arah Erupsi Merapi -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${arahMerapiData.map(item => `
          <div class="p-5 rounded-2xl bg-gradient-to-br ${item.warna} border shadow-xl flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${item.badge_col} flex items-center gap-1.5">
                  <i class="fa-solid ${item.icon}"></i> ${item.arah}
                </span>
                <span class="text-[11px] font-mono text-sogan-400">${item.arah_en}</span>
              </div>
              <div class="pt-1">
                <span class="text-[10px] font-mono uppercase tracking-wider text-prada font-bold block">Surasa Sasmitha:</span>
                <h4 class="font-marcellus text-xl font-bold text-amber-100">${item.simbol}</h4>
              </div>
              <p class="text-xs text-sogan-200 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                ${item.teges}
              </p>
            </div>
            <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sogan-400">
              <span>Sasmitha Pituduh Kasultanan</span>
              <span class="text-amber-300 font-mono font-semibold">Eling &amp; Waspada</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Sumbu Filosofis & Catatan Kearifan Mitigasi -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-keraton via-wulung to-keraton border border-prada/30 space-y-3 text-xs text-sogan-300 leading-relaxed shadow-lg">
        <div class="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <i class="fa-solid fa-mountain text-prada"></i>
          <span>Sumbu Filosofis &amp; Kearifan Mitigasi Bencana</span>
        </div>
        <p>
          Gunung Merapi minangka salah satunggaling cagak utama ing <strong>Sumbu Filosofis Ngayogyakarta</strong> (Panggung Krapyak – Keraton Ngayogyakarta – Tugu Pal Putih – Gunung Merapi). Ing kapitayan Jawa, Merapi sanes mung redi geni, nanging peparinging Gusti ingkang tansah maringi pituduh dhumateng titah ing bumi supados tansah eling, ngurmati alam, lan manembah mring Kang Akarya Jagad.
        </p>
        <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11.5px] text-amber-200/90 italic">
          <strong class="not-italic text-amber-300 font-mono">Pitedah Luhur:</strong> Sasmitha punika minangka pandom mawas diri sarta kearifan budaya leluhur ingkang selaras kaliyan mitigasi bencana modern saking badan resmi pamarentah (BPPTKG / PVMBG / BMKG).
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
