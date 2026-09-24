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
import { isPemula } from '../../ui/mode.js';
import { showToast } from '../../ui/toast.js';

let currentSubtab = 'impen'; // 'impen' | 'kedut' | 'gerhana' | 'lindu' | 'tejo'
let queryImpen = '';
let queryKedut = '';
let activeKedutKategori = '';
let activeGerhanaSasi = 'Sura';
let activeLinduSasi = 'Sura';
let activeLinduWaktu = 'awan';

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
      <span>Mode Ringkas (Pemula): Nampilaken pitedah Impen lan Kedut. Mangga gantos dhateng <strong>Mode Ahli (Lengkap)</strong> kanggé mbikak Sasmitha Gerhana, Lindu, lan Tejo.</span>
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

/**
 * 2. KEDUT (KEDUTAN BADAN)
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
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

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
