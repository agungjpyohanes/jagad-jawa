/**
 * Jagad Jawa — Modul Domain: Petung Kehidupan UI (Ternak, Loro, & Geblak)
 * Pengendali DOM untuk formulir Petung Kehidupan,
 * sub-tab Wiwit Ternak, Jaluran Loro, dan Petung Geblak (sensitif),
 * serta adaptasi Mode Pemula (Ringkas) vs Mode Ahli (Lengkap).
 */

import { getPetungKehidupanByDate, getPetungKehidupanByWeton } from './petung-kehidupan-engine.js';
import { getTanggalJawaLengkap } from '../kalender/kalender-engine.js';
import { isPemula } from '../../ui/mode.js';
import { showToast } from '../../ui/toast.js';

const DINA_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN_LIST = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

let currentActiveSubtab = 'ternak';
let isGeblakUnlocked = false;
let currentResultData = null;

/**
 * Inisialisasi komponen UI Petung Kehidupan
 */
export function initTernakUI() {
  populateSelects();
  setupEventListeners();

  // Set default ke hari ini jika kosong
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateInput = document.getElementById('ternakDatePicker');
  if (dateInput && !dateInput.value) {
    dateInput.value = `${y}-${m}-${d}`;
    syncTernakDariTanggal();
  }
}

function populateSelects() {
  const selDina = document.getElementById('ternakSelDina');
  if (selDina && selDina.children.length <= 1) {
    selDina.innerHTML = DINA_LIST.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  const selPasaran = document.getElementById('ternakSelPasaran');
  if (selPasaran && selPasaran.children.length <= 1) {
    selPasaran.innerHTML = PASARAN_LIST.map(p => `<option value="${p}">${p}</option>`).join('');
  }
}

function setupEventListeners() {
  const datePicker = document.getElementById('ternakDatePicker');
  if (datePicker) {
    datePicker.addEventListener('change', syncTernakDariTanggal);
  }

  const btnReset = document.getElementById('btnResetTernakToday');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      if (datePicker) datePicker.value = `${y}-${m}-${d}`;
      syncTernakDariTanggal();
      showToast('Tanggal kasinkronaken dhateng dinten punika.');
    });
  }

  const selDina = document.getElementById('ternakSelDina');
  const selPasaran = document.getElementById('ternakSelPasaran');
  if (selDina) selDina.addEventListener('change', hitungTernakDariSelect);
  if (selPasaran) selPasaran.addEventListener('change', hitungTernakDariSelect);
}

/**
 * Sinkronkan input tanggal Masehi ke weton
 */
export function syncTernakDariTanggal() {
  const dateInput = document.getElementById('ternakDatePicker');
  if (!dateInput || !dateInput.value) return;

  const res = getPetungKehidupanByDate(dateInput.value);
  if (res) {
    currentResultData = res;
    const selDina = document.getElementById('ternakSelDina');
    const selPasaran = document.getElementById('ternakSelPasaran');
    if (selDina) selDina.value = res.dina;
    if (selPasaran) selPasaran.value = res.pasaran;

    renderTernakResult(res);
  }
}

/**
 * Hitung berdasarkan perubahan dropdown manual Dina & Pasaran
 */
export function hitungTernakDariSelect() {
  const selDina = document.getElementById('ternakSelDina');
  const selPasaran = document.getElementById('ternakSelPasaran');
  const dina = selDina?.value;
  const pasaran = selPasaran?.value;

  if (dina && pasaran) {
    const res = getPetungKehidupanByWeton(dina, pasaran);
    if (res) {
      currentResultData = res;
      renderTernakResult(res);
    }
  }
}

/**
 * Ganti sub-tab aktif: 'ternak' | 'loro' | 'geblak'
 */
export function switchTernakSubtab(subtab) {
  currentActiveSubtab = subtab;
  if (currentResultData) {
    renderTernakResult(currentResultData);
  }
}

/**
 * Konfirmasi buka petung geblak (fitur sensitif)
 */
export function konfirmasiBukaGeblak() {
  isGeblakUnlocked = true;
  if (currentResultData) {
    renderTernakResult(currentResultData);
  }
}

/**
 * Render visualisasi kartu ringkas ke DOM
 */
export function renderTernakResult(data) {
  const container = document.getElementById('ternakResultContainer');
  if (!container) return;

  const { dina, pasaran, neptu, ternak, loro, geblak, date, tglJawa } = data;

  // Header Weton + Neptu Info
  const tglJawaStr = tglJawa ? `${tglJawa.fullStr}` : `${dina} ${pasaran}`;
  const neptuInfo = `${dina} + ${pasaran} = ${neptu} (Neptu App Standar)`;

  // Badge colors for Ternak
  const ternakColors = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40',
    teal: 'bg-teal-950/80 text-teal-300 border-teal-500/50 shadow-teal-950/40',
    stone: 'bg-stone-900/80 text-stone-200 border-stone-600/50 shadow-stone-950/40',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-950/40'
  };
  const ternakBadgeClass = ternakColors[ternak.badge.color] || ternakColors.stone;

  // Render Sub-tabs Buttons
  const isModePemulaActive = isPemula();
  // In Pemula mode, force subtab to 'ternak'
  if (isModePemulaActive) {
    currentActiveSubtab = 'ternak';
  }

  const btnTernakActive = currentActiveSubtab === 'ternak'
    ? 'bg-prada text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  const btnLoroActive = currentActiveSubtab === 'loro'
    ? 'bg-amber-500 text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  const btnGeblakActive = currentActiveSubtab === 'geblak'
    ? 'bg-stone-300 text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  // Subtab navigation HTML
  const subtabsHtml = `
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <!-- 1. Wiwit Ternak (Kabeh mode) -->
      <button onclick="switchTernakSubtab('ternak')" class="px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnTernakActive}">
        <i class="fa-solid fa-cow"></i>
        <span>Wiwit Ternak</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${ternak.kode}</span>
      </button>

      <!-- 2. Jaluran Loro (Ahli Only) -->
      <button onclick="switchTernakSubtab('loro')" class="ahli-only px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnLoroActive}">
        <i class="fa-solid fa-heart-pulse"></i>
        <span>Jaluran Loro</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${loro.kode}</span>
      </button>

      <!-- 3. Petung Geblak (Ahli Only) -->
      <button onclick="switchTernakSubtab('geblak')" class="ahli-only px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnGeblakActive}">
        <i class="fa-solid fa-dove"></i>
        <span>Petung Geblak</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${geblak.kode}</span>
      </button>
    </div>
  `;

  // Notice for Pemula mode
  const pemulaNoticeHtml = `
    <div class="pemula-only p-3 rounded-xl bg-sogan-950/40 border border-sogan-800 text-[11.5px] text-sogan-300 mb-4 flex items-center gap-2.5">
      <i class="fa-solid fa-circle-info text-prada shrink-0"></i>
      <span>Mode Ringkas (Pemula): Nampilaken pitedah Wiwit Ternak kemawon. Mangga gantos dhateng <strong>Mode Ahli (Lengkap)</strong> ing pojok tengen nginggil kanggé mbikak Jaluran Loro &amp; Petung Geblak.</span>
    </div>
  `;

  // Content 1: TERNAK CARD
  const ternakCardHtml = `
    <div class="p-5 sm:p-6 rounded-2xl border ${ternakBadgeClass} backdrop-blur-md shadow-xl relative overflow-hidden mb-4">
      <div class="absolute -right-8 -bottom-8 opacity-10 text-8xl text-prada pointer-events-none">
        <i class="fa-solid fa-cow"></i>
      </div>
      <div class="relative z-10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/30 border border-current">
              Kategori: ${ternak.badge.label}
            </span>
          </div>
          <div class="text-xs text-sogan-200 font-mono">
            Status: <strong class="text-prada-light">${ternak.status_ringkas}</strong>
          </div>
        </div>

        <div class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 mb-2">
          Pituduh Wiwit Ternak: ${ternak.kode}
        </div>
        <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
          ${ternak.tegese}
        </p>

        <div class="p-4 rounded-xl bg-keraton/70 border border-sogan-800 text-xs text-sogan-200">
          <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
            <i class="fa-solid fa-lightbulb"></i> Saran Praktis Pangupakara:
          </div>
          <p class="leading-relaxed text-[11.5px]">${ternak.saran_praktis}</p>
        </div>
      </div>
    </div>
  `;

  // Content 2: LORO CARD
  const loroCardHtml = `
    <div class="p-5 sm:p-6 rounded-2xl bg-wulung/80 border border-amber-600/40 shadow-xl backdrop-blur-md relative overflow-hidden mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-500/40 text-amber-300">
          Jaluran Loro: ${loro.kode}
        </span>
        <span class="text-xs font-mono text-sogan-300">Kearifan Husada Tradisi</span>
      </div>

      <div class="text-xl font-cinzel font-bold text-amber-100 mb-2">
        Surasa &amp; Jalaran: ${loro.kode}
      </div>
      <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
        ${loro.tegese}
      </p>

      <div class="p-4 rounded-xl bg-keraton/70 border border-sogan-800 text-xs mb-4">
        <div class="text-amber-300 font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
          <i class="fa-solid fa-mortar-pestle"></i> Pitedah Tamba Tradisi (Tombone):
        </div>
        <p class="leading-relaxed text-[11.5px] text-sogan-200">${loro.tombone}</p>
      </div>

      <!-- FIXED MANDATORY MEDICAL DISCLAIMER -->
      <div class="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
        <i class="fa-solid fa-triangle-exclamation text-rose-400 mt-0.5 shrink-0 text-sm"></i>
        <div class="leading-relaxed text-[11.5px]">
          <strong class="font-bold text-rose-300 block mb-0.5">Pènget Medis Wigati:</strong>
          ${loro.disclaimer_medis}
        </div>
      </div>
    </div>
  `;

  // Content 3: GEBLAK CARD (With Privacy & Respect Confirmation)
  let geblakCardHtml = '';
  if (!isGeblakUnlocked) {
    geblakCardHtml = `
      <div class="p-6 rounded-2xl bg-wulung/80 border border-sogan-700/60 shadow-xl backdrop-blur-md text-center mb-4">
        <div class="w-12 h-12 rounded-full bg-sogan-950 border border-sogan-700 text-stone-300 flex items-center justify-center mx-auto mb-3 text-lg">
          <i class="fa-solid fa-dove"></i>
        </div>
        <h4 class="text-base font-cinzel font-bold text-amber-100 mb-1">Pakurmatan Duka &amp; Wiradat Suwargi</h4>
        <p class="text-xs text-sogan-300 max-w-md mx-auto leading-relaxed mb-4">
          Petung geblak punika ngewrat pitedah adat tradisi kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga ingkang katilaran. Amargi asipat duka lan sensitif, mangga klik tombol ing ngandhap kanggé mbikak.
        </p>
        <button onclick="konfirmasiBukaGeblak()" type="button" class="px-5 py-2 rounded-xl bg-gradient-to-r from-sogan-700 to-amber-700 hover:from-sogan-600 hover:to-amber-600 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2 mx-auto">
          <i class="fa-solid fa-eye"></i> Lajengaken (Bikak Petung Geblak)
        </button>
      </div>
    `;
  } else {
    geblakCardHtml = `
      <div class="p-5 sm:p-6 rounded-2xl bg-wulung/80 border border-stone-600/40 shadow-xl backdrop-blur-md relative overflow-hidden mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-900/80 border border-stone-500/40 text-stone-200">
            Kategori Geblak: ${geblak.kode}
          </span>
          <span class="text-xs font-mono text-sogan-300">Penghormatan Adat &amp; Wiradat</span>
        </div>

        <div class="text-xl font-cinzel font-bold text-amber-100 mb-2">
          Petung Dinten Geblak: ${geblak.kode}
        </div>
        <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
          ${geblak.tegese}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
            <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
              <i class="fa-solid fa-people-roof"></i> Fokus Ingkang Katilaran:
            </div>
            <p class="leading-relaxed text-[11px] text-sogan-200">${geblak.fokus_ditinggal}</p>
          </div>

          <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
            <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
              <i class="fa-solid fa-hands-praying"></i> Wiradat 40 Dinten:
            </div>
            <p class="leading-relaxed text-[11px] text-sogan-200">${geblak.wiradat_40_dina}</p>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-600/20 text-[11px] text-sogan-300 leading-relaxed italic">
          <i class="fa-solid fa-shield-heart text-prada mr-1"></i> ${geblak.disclaimer_adat}
        </div>
      </div>
    `;
  }

  // Active subtab rendering logic
  let activeContentHtml = ternakCardHtml;
  if (currentActiveSubtab === 'loro') activeContentHtml = loroCardHtml;
  if (currentActiveSubtab === 'geblak') activeContentHtml = geblakCardHtml;

  container.innerHTML = `
    <!-- HERO HEADER TANGGAL & WETON -->
    <div class="p-4 sm:p-5 rounded-2xl bg-keraton/80 border border-sogan-700/60 shadow-lg mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="text-[10px] font-mono uppercase tracking-widest text-prada">Pètungan Dinten Kejadian / Wiwitan</div>
        <h3 class="text-lg sm:text-xl font-cinzel font-bold text-amber-100 flex items-center gap-2 mt-0.5">
          ${dina} ${pasaran}
        </h3>
        <p class="text-xs text-sogan-300 mt-0.5">${tglJawaStr}</p>
      </div>
      <div class="text-left sm:text-right shrink-0">
        <div class="text-[10px] font-mono text-sogan-400 uppercase tracking-widest">Neptu App Standar</div>
        <div class="text-2xl font-extrabold text-prada font-mono">${neptu}</div>
        <div class="text-[10px] text-sogan-400">${dina} (${data.ternak ? lookupNeptuDina(dina) : ''}) + ${pasaran} (${data.ternak ? lookupNeptuPasaran(pasaran) : ''})</div>
      </div>
    </div>

    <!-- SUBTABS SWITCHER -->
    ${subtabsHtml}

    <!-- PEMULA NOTICE -->
    ${pemulaNoticeHtml}

    <!-- ACTIVE CARD CONTENT -->
    ${activeContentHtml}
  `;
}

function lookupNeptuDina(dina) {
  const map = { 'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9 };
  return map[dina] || '';
}

function lookupNeptuPasaran(pasaran) {
  const map = { 'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8 };
  return map[pasaran] || '';
}
