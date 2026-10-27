/**
 * Jagad Jawa — Modul Domain: Petung Kehidupan UI (Ternak, Loro, & Geblak)
 * Pengendali DOM untuk formulir Petung Kehidupan,
 * sub-tab Wiwit Ternak, Jaluran Loro, dan Petung Geblak (sensitif),
 * serta adaptasi Mode Pemula (Ringkas) vs Mode Ahli (Lengkap).
 */

import { getPetungKehidupanByDate, getPetungKehidupanByWeton, cariHariPetungKehidupan, setTernakDataset } from './petung-kehidupan-engine.js';
import { getTanggalJawaLengkap } from '../kalender/kalender-engine.js';
import { isPemula } from '../../ui/mode.js';
import { showToast } from '../../ui/toast.js';
import { getBilingualText } from '../../ui/i18n.js';
import { loadDomainData } from '../../services/dbLoader.js';
import { renderDataErrorState } from '../../ui/data-error-state.js';
import { getPetungTetanen } from '../../data/petung-tetanen-db.js';

const DINA_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN_LIST = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

let currentActiveSubtab = 'ternak';
let isGeblakUnlocked = false;
let currentResultData = null;

/**
 * Inisialisasi komponen UI Petung Kehidupan
 */
export function initTernakUI() {
  loadDomainData('petung-kehidupan').catch((e) => {
    console.warn('[petung-kehidupan-ui] loadDomainData fallback:', e);
  });
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
    syncTernakDariTanggal(false);
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

  // Search Bulan
  const selSearchBulan = document.getElementById('ternakSearchBulan');
  if (selSearchBulan && selSearchBulan.children.length === 0) {
    const curMonth = new Date().getMonth() + 1;
    const BULAN_NAMES = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    selSearchBulan.innerHTML = BULAN_NAMES.map((name, i) =>
      `<option value="${i + 1}" ${i + 1 === curMonth ? 'selected' : ''}>${i + 1}. ${name}</option>`
    ).join('');
  }

  // Search Tahun
  const selSearchTahun = document.getElementById('ternakSearchTahun');
  if (selSearchTahun && selSearchTahun.children.length === 0) {
    const curYear = new Date().getFullYear();
    let opts = '';
    for (let y = 1950; y <= 2040; y++) {
      opts += `<option value="${y}" ${y === curYear ? 'selected' : ''}>${y} M</option>`;
    }
    selSearchTahun.innerHTML = opts;
  }
}

function setupEventListeners() {
  const datePicker = document.getElementById('ternakDatePicker');
  if (datePicker) {
    datePicker.addEventListener('change', () => {
      // Saat tanggal berubah, perbarui nilai dropdown dina/pasaran otomatis dan bersihkan error
      syncTernakDariTanggal(false);
    });
  }

  const radioTujuan = document.querySelectorAll('input[name="ternakTujuanRadio"]');
  radioTujuan.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const targetSubtab = e.target.value;
      switchTernakSubtab(targetSubtab);
    });
  });

  const btnHitung = document.getElementById('btnHitungTernak');
  if (btnHitung) {
    btnHitung.addEventListener('click', () => {
      hitungTernakDariUI();
    });
  }

  const btnReset = document.getElementById('btnResetTernakToday');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetTernakUI();
    });
  }

  const selDina = document.getElementById('ternakSelDina');
  const selPasaran = document.getElementById('ternakSelPasaran');
  if (selDina) {
    selDina.addEventListener('change', () => {
      sembunyikanFeedbackError();
    });
  }
  if (selPasaran) {
    selPasaran.addEventListener('change', () => {
      sembunyikanFeedbackError();
    });
  }
}

/**
 * Tampilkan pesan kesalahan inline pada formulir Petung Kehidupan
 */
function tampilkanFeedbackError(pesan) {
  const feedbackBox = document.getElementById('ternakFormFeedback');
  const feedbackText = document.getElementById('ternakFormFeedbackText');
  if (feedbackBox && feedbackText) {
    feedbackText.textContent = pesan;
    feedbackBox.classList.remove('hidden');
  }
}

/**
 * Sembunyikan pesan kesalahan inline
 */
function sembunyikanFeedbackError() {
  const feedbackBox = document.getElementById('ternakFormFeedback');
  if (feedbackBox) {
    feedbackBox.classList.add('hidden');
  }
}

/**
 * Reset seluruh keadaan formulir dan artefak hasil kalkulasi
 */
export function resetTernakUI() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const datePicker = document.getElementById('ternakDatePicker');
  if (datePicker) {
    datePicker.value = `${y}-${m}-${d}`;
  }

  // Kembalikan pilihan aktivitas ke 'ternak'
  const radioTernak = document.querySelector('input[name="ternakTujuanRadio"][value="ternak"]');
  if (radioTernak) {
    radioTernak.checked = true;
  }
  currentActiveSubtab = 'ternak';
  isGeblakUnlocked = false;
  currentResultData = null;

  // Bersihkan artefak hasil lama
  const container = document.getElementById('ternakResultContainer');
  if (container) {
    container.innerHTML = '';
  }

  sembunyikanFeedbackError();

  // Sinkronkan kembali dina & pasaran sesuai hari ini tanpa memunculkan kartu hasil otomatis
  syncTernakDariTanggal(false);
  showToast('Formulir kasinkronaken dhateng dinten punika.');
}

/**
 * Atur aktivitas tujuan secara terprogram
 */
export function setTernakTujuan(tujuan) {
  if (!['ternak', 'tetanen', 'loro', 'geblak'].includes(tujuan)) return;
  const radio = document.querySelector(`input[name="ternakTujuanRadio"][value="${tujuan}"]`);
  if (radio) {
    radio.checked = true;
  }
  switchTernakSubtab(tujuan);
}

/**
 * Sinkronkan input tanggal Masehi ke weton
 * @param {boolean} triggerRender Bila true, akan langsung merender kartu hasil jika data siap
 */
export async function syncTernakDariTanggal(triggerRender = false) {
  const dateInput = document.getElementById('ternakDatePicker');
  if (!dateInput || !dateInput.value) {
    return;
  }

  sembunyikanFeedbackError();

  const res = getPetungKehidupanByDate(dateInput.value);
  if (res) {
    const selDina = document.getElementById('ternakSelDina');
    const selPasaran = document.getElementById('ternakSelPasaran');
    if (selDina) selDina.value = res.dina;
    if (selPasaran) selPasaran.value = res.pasaran;

    const lockedDina = document.getElementById('ternakLockedDinaText');
    const lockedPasaran = document.getElementById('ternakLockedPasaranText');
    if (lockedDina) lockedDina.textContent = res.dina;
    if (lockedPasaran) lockedPasaran.textContent = `${res.pasaran} (Neptu ${res.neptu || ''})`;
  }

  if (triggerRender) {
    return hitungTernakDariUI();
  }
}

/**
 * Eksekusi hitung utama dari UI dengan validasi lengkap
 */
export async function hitungTernakDariUI() {
  const dateInput = document.getElementById('ternakDatePicker');
  const container = document.getElementById('ternakResultContainer');

  // 1. Validasi tanggal wajib
  if (!dateInput || !dateInput.value) {
    const errText = getBilingualText({
      id: 'Tanggal peristiwa atau memulai wajib diisi terlebih dahulu.',
      jv: 'Tanggal kedadosan utawi wiwitan kedah dipunisi rumiyin.'
    });
    tampilkanFeedbackError(errText);
    if (dateInput) dateInput.focus();
    return false;
  }

  sembunyikanFeedbackError();

  // Ambil pilihan subtab aktif dari radio jika ada
  const activeRadio = document.querySelector('input[name="ternakTujuanRadio"]:checked');
  if (activeRadio) {
    currentActiveSubtab = activeRadio.value;
  }

  // 2. Muat dataset domain dengan error state jika gagal
  if (currentActiveSubtab === 'tetanen') {
    let tetanenData = null;
    try {
      tetanenData = await loadDomainData('kalender');
      if (!tetanenData?.petungTetanen) {
        tetanenData = await loadDomainData('sapa-dina');
      }
    } catch (e) {
      console.warn('[petung-kehidupan-ui] loadDomainData tetanen error:', e);
    }

    if (!tetanenData || !tetanenData.petungTetanen) {
      if (container) {
        renderDataErrorState(container, {
          domain: 'petung-tetanen',
          onRetry: () => hitungTernakDariUI()
        });
      }
      return false;
    }
    if (typeof globalThis !== 'undefined' && tetanenData.petungTetanen) {
      globalThis._currentTetanenData = tetanenData.petungTetanen;
    }
  } else {
    let ternakData = null;
    try {
      ternakData = await loadDomainData('petung-kehidupan');
    } catch (e) {
      console.warn('[petung-kehidupan-ui] loadDomainData error:', e);
    }

    if (!ternakData) {
      if (container) {
        renderDataErrorState(container, {
          domain: 'petung-kehidupan',
          onRetry: () => hitungTernakDariUI()
        });
      }
      return false;
    }
    setTernakDataset(ternakData);
  }

  // 3. Hitung hasil
  const res = getPetungKehidupanByDate(dateInput.value);
  if (res) {
    currentResultData = res;
    const selDina = document.getElementById('ternakSelDina');
    const selPasaran = document.getElementById('ternakSelPasaran');
    if (selDina) selDina.value = res.dina;
    if (selPasaran) selPasaran.value = res.pasaran;

    renderTernakResult(res);
    return true;
  }
  return false;
}

/**
 * Hitung berdasarkan perubahan dropdown manual Dina & Pasaran
 */
export async function hitungTernakDariSelect() {
  const selDina = document.getElementById('ternakSelDina');
  const selPasaran = document.getElementById('ternakSelPasaran');
  const dina = selDina?.value;
  const pasaran = selPasaran?.value;

  if (!dina || !pasaran) {
    tampilkanFeedbackError(getBilingualText({
      id: 'Dina dan Pasaran wajib dipilih terlebih dahulu.',
      jv: 'Dina lan Pasaran kedah dipunpilih rumiyin.'
    }));
    return false;
  }

  sembunyikanFeedbackError();

  const container = document.getElementById('ternakResultContainer');
  const activeRadio = document.querySelector('input[name="ternakTujuanRadio"]:checked');
  if (activeRadio) {
    currentActiveSubtab = activeRadio.value;
  }

  if (currentActiveSubtab === 'tetanen') {
    let tetanenData = null;
    try {
      tetanenData = await loadDomainData('kalender');
      if (!tetanenData?.petungTetanen) {
        tetanenData = await loadDomainData('sapa-dina');
      }
    } catch (e) {
      console.warn('[petung-kehidupan-ui] loadDomainData tetanen error:', e);
    }

    if (!tetanenData || !tetanenData.petungTetanen) {
      if (container) {
        renderDataErrorState(container, {
          domain: 'petung-tetanen',
          onRetry: () => hitungTernakDariSelect()
        });
      }
      return false;
    }
    if (typeof globalThis !== 'undefined' && tetanenData.petungTetanen) {
      globalThis._currentTetanenData = tetanenData.petungTetanen;
    }
  } else {
    let ternakData = null;
    try {
      ternakData = await loadDomainData('petung-kehidupan');
    } catch (e) {
      console.warn('[petung-kehidupan-ui] loadDomainData error:', e);
    }

    if (!ternakData) {
      if (container) {
        renderDataErrorState(container, {
          domain: 'petung-kehidupan',
          onRetry: () => hitungTernakDariSelect()
        });
      }
      return false;
    }
    setTernakDataset(ternakData);
  }

  const res = getPetungKehidupanByWeton(dina, pasaran);
  if (res) {
    currentResultData = res;
    renderTernakResult(res);
    return true;
  }
  return false;
}

/**
 * Ganti sub-tab aktif: 'ternak' | 'loro' | 'geblak'
 */
export function switchTernakSubtab(subtab) {
  currentActiveSubtab = subtab;
  const radio = document.querySelector(`input[name="ternakTujuanRadio"][value="${subtab}"]`);
  if (radio && !radio.checked) {
    radio.checked = true;
  }
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

  const btnTetanenActive = currentActiveSubtab === 'tetanen'
    ? 'bg-emerald-500 text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  const btnLoroActive = currentActiveSubtab === 'loro'
    ? 'bg-amber-500 text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  const btnGeblakActive = currentActiveSubtab === 'geblak'
    ? 'bg-stone-300 text-keraton font-bold shadow'
    : 'bg-keraton/70 text-sogan-200 hover:bg-sogan-900/60 border border-sogan-800';

  // Ambil data tetanen untuk weton ini
  const tetanenInfo = getPetungTetanen(dina, pasaran);

  // Subtab navigation HTML
  const subtabsHtml = `
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <!-- 1. Wiwit Ternak (Kabeh mode) -->
      <button onclick="switchTernakSubtab('ternak')" class="px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnTernakActive}">
        <i class="fa-solid fa-cow"></i>
        <span>Wiwit Ternak</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${ternak.kode}</span>
      </button>

      <!-- 2. Wiwit Tetanen (Kabeh mode) -->
      <button onclick="switchTernakSubtab('tetanen')" class="px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnTetanenActive}">
        <i class="fa-solid fa-wheat-awn"></i>
        <span>Wiwit Tetanèn</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${tetanenInfo ? (tetanenInfo.kangBecik || 'Tani') : 'Tani'}</span>
      </button>

      <!-- 3. Jaluran Loro (Ahli Only) -->
      <button onclick="switchTernakSubtab('loro')" class="ahli-only px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition ${btnLoroActive}">
        <i class="fa-solid fa-heart-pulse"></i>
        <span>Jaluran Loro</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">${loro.kode}</span>
      </button>

      <!-- 4. Petung Geblak (Ahli Only) -->
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
              Kategori: ${getBilingualText(ternak.badge.label)}
            </span>
          </div>
          <div class="text-xs text-sogan-200 font-mono">
            Status: <strong class="text-prada-light">${getBilingualText(ternak.status_ringkas)}</strong>
          </div>
        </div>

        <div class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 mb-2">
          Pituduh Wiwit Ternak: ${getBilingualText(ternak.kode)}
        </div>
        <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
          ${getBilingualText(ternak.tegese)}
        </p>

        <div class="p-4 rounded-xl bg-keraton/70 border border-sogan-800 text-xs text-sogan-200">
          <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
            <i class="fa-solid fa-lightbulb"></i> Saran Praktis Pangupakara:
          </div>
          <p class="leading-relaxed text-[11.5px]">${getBilingualText(ternak.saran_praktis)}</p>
        </div>
      </div>
    </div>
  `;

  // Content 2: LORO CARD
  const loroCardHtml = `
    <div class="p-5 sm:p-6 rounded-2xl bg-wulung/80 border border-amber-600/40 shadow-xl backdrop-blur-md relative overflow-hidden mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-500/40 text-amber-300">
          Jaluran Loro: ${getBilingualText(loro.kode)}
        </span>
        <span class="text-xs font-mono text-sogan-300">Kearifan Husada Tradisi</span>
      </div>

      <div class="text-xl font-cinzel font-bold text-amber-100 mb-2">
        Surasa &amp; Jalaran: ${getBilingualText(loro.kode)}
      </div>
      <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
        ${getBilingualText(loro.tegese)}
      </p>

      <div class="p-4 rounded-xl bg-keraton/70 border border-sogan-800 text-xs mb-4">
        <div class="text-amber-300 font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
          <i class="fa-solid fa-mortar-pestle"></i> Pitedah Tamba Tradisi (Tombone):
        </div>
        <p class="leading-relaxed text-[11.5px] text-sogan-200">${getBilingualText(loro.tombone)}</p>
      </div>

      <!-- FIXED MANDATORY MEDICAL DISCLAIMER -->
      <div class="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
        <i class="fa-solid fa-triangle-exclamation text-rose-400 mt-0.5 shrink-0 text-sm"></i>
        <div class="leading-relaxed text-[11.5px]">
          <strong class="font-bold text-rose-300 block mb-0.5">Pènget Medis Wigati:</strong>
          ${getBilingualText(loro.disclaimer_medis)}
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
            Kategori Geblak: ${getBilingualText(geblak.kode)}
          </span>
          <span class="text-xs font-mono text-sogan-300">Penghormatan Adat &amp; Wiradat</span>
        </div>

        <div class="text-xl font-cinzel font-bold text-amber-100 mb-2">
          Petung Dinten Geblak: ${getBilingualText(geblak.kode)}
        </div>
        <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
          ${getBilingualText(geblak.tegese)}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
            <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
              <i class="fa-solid fa-people-roof"></i> Fokus Ingkang Katilaran:
            </div>
            <p class="leading-relaxed text-[11px] text-sogan-200">${getBilingualText(geblak.fokus_ditinggal)}</p>
          </div>

          <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
            <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
              <i class="fa-solid fa-hands-praying"></i> Wiradat 40 Dinten:
            </div>
            <p class="leading-relaxed text-[11px] text-sogan-200">${getBilingualText(geblak.wiradat_40_dina)}</p>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-600/20 text-[11px] text-sogan-300 leading-relaxed italic">
          <i class="fa-solid fa-shield-heart text-prada mr-1"></i> ${getBilingualText(geblak.disclaimer_adat)}
        </div>
      </div>
    `;
  }

  // Content 2: TETANEN CARD
  let tetanenCardHtml = '';
  if (tetanenInfo) {
    tetanenCardHtml = `
      <div class="p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 shadow-xl backdrop-blur-md relative overflow-hidden mb-4">
        <div class="absolute -right-8 -bottom-8 opacity-10 text-8xl text-emerald-300 pointer-events-none">
          <i class="fa-solid fa-wheat-awn"></i>
        </div>
        <div class="relative z-10">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${tetanenInfo.badgeClass || 'bg-emerald-900/80 text-emerald-200 border-emerald-500/30'} border">
                <i class="${tetanenInfo.icon || 'fa-solid fa-wheat-awn'} mr-1"></i> Kang Becik: ${tetanenInfo.kategoriLabel}
              </span>
            </div>
            <div class="text-xs text-sogan-200 font-mono">
              Golongan: <strong class="text-emerald-300 capitalize">${tetanenInfo.kangBecik}</strong>
            </div>
          </div>

          <div class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 mb-2">
            Pituduh Wiwit Tetanèn &amp; Palawija: ${dina} ${pasaran}
          </div>
          <p class="text-xs sm:text-sm text-sogan-100 leading-relaxed mb-4">
            ${tetanenInfo.tegese}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
              <div class="text-emerald-300 font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
                <i class="fa-solid fa-seedling"></i> Tuladha Tetanduran Ingkang Cocog:
              </div>
              <p class="leading-relaxed text-[11.5px] text-emerald-100 font-medium">${tetanenInfo.contone}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-keraton/70 border border-sogan-800 text-xs">
              <div class="text-prada font-bold flex items-center gap-1.5 mb-1 text-[11.5px] uppercase font-mono">
                <i class="fa-solid fa-sun-plant-wilt"></i> Pranata Budidaya:
              </div>
              <p class="leading-relaxed text-[11.5px] text-sogan-200">
                Pilih dinten nalika oyot, wit, utawa uwoh selaras kaliyan watak dinten weton supados subur lan mupangati.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Active subtab rendering logic
  let activeContentHtml = ternakCardHtml;
  if (currentActiveSubtab === 'tetanen') activeContentHtml = tetanenCardHtml;
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

/**
 * Eksekusi pencarian interaktif kecocokan hari Petung Kehidupan dari UI
 */
export async function cariHariPetungKehidupanUI() {
  const selTahun = document.getElementById('ternakSearchTahun');
  const selBulan = document.getElementById('ternakSearchBulan');
  const selJenis = document.getElementById('ternakSearchJenis');
  const selKategori = document.getElementById('ternakSearchKategori');
  const container = document.getElementById('ternakSearchResultsContainer');

  const tahun = parseInt(selTahun?.value, 10) || new Date().getFullYear();
  const bulan = parseInt(selBulan?.value, 10) || (new Date().getMonth() + 1);
  const jenis = selJenis?.value || currentActiveSubtab || 'ternak';
  const filterKategori = selKategori?.value || 'becik';

  let ternakData = null;
  try {
    ternakData = await loadDomainData('petung-kehidupan');
  } catch (e) {
    console.warn('[petung-kehidupan-ui] loadDomainData error:', e);
  }

  if (!ternakData) {
    if (container) {
      renderDataErrorState(container, {
        domain: 'petung-kehidupan',
        onRetry: () => cariHariPetungKehidupanUI()
      });
    }
    return;
  }
  setTernakDataset(ternakData);

  try {
    const res = cariHariPetungKehidupan({
      tahun,
      bulan,
      jenis,
      filterKategori
    });

    if (!container) return;

    if (res.matches.length === 0) {
      container.innerHTML = `
        <div class="p-6 rounded-xl bg-sogan-950/60 border border-sogan-800 text-center space-y-2">
          <i class="fa-solid fa-calendar-xmark text-amber-500/80 text-2xl"></i>
          <p class="text-xs text-sogan-300">Boten kepanggih dinten ingkang cocog kaliyan kriteria punika ing wulan punika.</p>
          <p class="text-[11px] text-sogan-400">Coba pilih kriteria sanesipun utawi wulan salajengipun.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs text-sogan-300 border-b border-sogan-800/80 pb-2">
          <span>Kasil Pados: <strong class="text-prada font-bold">${res.matches.length} dinten cocog</strong> saking ${res.totalHari} dinten</span>
          <span class="text-[10.5px] text-amber-400/90 font-mono">Wulan ${bulan}/${tahun} (${jenis.toUpperCase()})</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${res.matches.map(m => {
            let badge = '';
            let detail = '';

            if (jenis === 'ternak') {
              const kat = m.ternak.kategori;
              const isBecik = kat === 'Gajah' || kat === 'Suku';
              const color = isBecik ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-amber-950/40 border-amber-600/50 text-amber-300';
              badge = `<span class="text-[10px] font-mono px-2 py-0.5 rounded border ${color} font-bold">${kat}</span>`;
              detail = `
                <div class="text-[11px] text-amber-200/90 font-medium">${m.ternak.kewan}</div>
                <div class="text-[10px] text-sogan-300">${m.ternak.makna}</div>
              `;
            } else if (jenis === 'loro') {
              badge = `<span class="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-600/50 bg-rose-950/40 text-rose-300 font-bold">${m.loro.kategori}</span>`;
              detail = `
                <div class="text-[11px] text-rose-200/90 font-medium">Jalaran: ${m.loro.jalaran}</div>
                <div class="text-[10px] text-sogan-300">Tombo: ${m.loro.tombo_wiradat}</div>
              `;
            } else if (jenis === 'geblak') {
              badge = `<span class="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-600/50 bg-purple-950/40 text-purple-300 font-bold">${m.geblak.kategori}</span>`;
              detail = `
                <div class="text-[11px] text-purple-200/90 font-medium">Watak: ${m.geblak.kategori}</div>
                <div class="text-[10px] text-sogan-300">${m.geblak.wiradat_40_dina}</div>
              `;
            }

            return `
              <div class="p-3.5 rounded-xl bg-keraton/90 border border-sogan-800 hover:border-prada/50 transition shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-1 mb-1">
                    ${badge}
                    <span class="text-[11px] text-sogan-400 font-mono">Neptu ${m.neptu}</span>
                  </div>
                  <h5 class="text-xs sm:text-sm font-bold text-amber-100">
                    ${m.dina} ${m.pasaran} · <span class="text-prada font-mono">${m.tanggal} ${res.bulan}/${res.tahun}</span>
                  </h5>
                  <div class="mt-1.5 p-2 rounded-lg bg-sogan-950/60 border border-sogan-800/60 space-y-1">
                    ${detail}
                  </div>
                </div>

                <div class="pt-2 border-t border-sogan-800/80">
                  <button onclick="window.pilihTanggalHasilCariTernak('${m.isoDate}')" class="w-full py-1.5 px-3 rounded-lg bg-sogan-900 hover:bg-sogan-800 border border-prada/40 hover:border-prada text-prada text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Pilih Tanggal Iki
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    showToast(`Kepanggih ${res.matches.length} dinten.`);
  } catch (err) {
    console.error('Gagal mencari hari petung kehidupan:', err);
    showToast('Gagal pados dinten petung kehidupan.');
  }
}

/**
 * Menerapkan tanggal hasil pencarian ke kalkulator utama Petung Kehidupan
 * @param {string} isoDate YYYY-MM-DD
 */
export function pilihTanggalHasilCariTernak(isoDate) {
  const dateInput = document.getElementById('ternakDatePicker');
  if (dateInput) {
    dateInput.value = isoDate;
    syncTernakDariTanggal();
    const resultCard = document.getElementById('ternakResultContainer');
    if (resultCard) {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(`Tanggal ${isoDate} kasil kapilih kanggé Petung Kehidupan.`);
  }
}


/**
 * Switch antara Mode Input Tanggal (Opsi A) dan Cari Berdasarkan Hari/Pasaran (Opsi B)
 */
export function switchTernakInputMode(mode) {
  const containerTanggal = document.getElementById('ternakModeTanggalContainer');
  const containerWeton = document.getElementById('ternakModeWetonContainer');
  const btnA = document.getElementById('btnTernakModeTanggal');
  const btnB = document.getElementById('btnTernakModeWeton');

  if (mode === 'weton') {
    if (containerTanggal) containerTanggal.classList.add('hidden');
    if (containerWeton) containerWeton.classList.remove('hidden');

    if (btnB) {
      btnB.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-sogan-600 to-prada text-keraton shadow';
    }
    if (btnA) {
      btnA.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sogan-300 hover:text-amber-100 transition flex items-center justify-center gap-1.5';
    }
  } else {
    if (containerWeton) containerWeton.classList.add('hidden');
    if (containerTanggal) containerTanggal.classList.remove('hidden');

    if (btnA) {
      btnA.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-sogan-600 to-prada text-keraton shadow';
    }
    if (btnB) {
      btnB.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sogan-300 hover:text-amber-100 transition flex items-center justify-center gap-1.5';
    }
    syncTernakDariTanggal(false);
  }
}

/**
 * Cari daftar tanggal yang cocok dengan Dina & Pasaran dalam 1 bulan (35 hari) ke depan
 */
export function cariTanggalSesuai1Bulan() {
  const selDina = document.getElementById('ternakSelDina');
  const selPasaran = document.getElementById('ternakSelPasaran');
  const dina = selDina?.value;
  const pasaran = selPasaran?.value;

  if (!dina || !pasaran) {
    showToast('Pilih Dina dan Pasaran terlebih dahulu.');
    return;
  }

  const container = document.getElementById('ternakJadwal1BulanBox');
  if (!container) return;

  const today = new Date();
  const matches = [];

  for (let i = 0; i <= 35; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    const isoDate = `${yStr}-${mStr}-${dStr}`;

    const res = getPetungKehidupanByDate(isoDate);
    if (res && res.dina === dina && res.pasaran === pasaran) {
      matches.push({
        isoDate,
        dateObj: d,
        dina: res.dina,
        pasaran: res.pasaran,
        res
      });
    }
  }

  if (matches.length === 0) {
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="p-3 bg-sogan-950/70 border border-sogan-800 rounded-xl text-center text-xs text-sogan-300">
        Boten kepanggih dinten ${dina} ${pasaran} ing 35 dinten candhakipun.
      </div>
    `;
    return;
  }

  const activeRadio = document.querySelector('input[name="ternakTujuanRadio"]:checked');
  const tujuan = activeRadio ? activeRadio.value : currentActiveSubtab;

  const html = `
    <div class="space-y-2 p-3.5 bg-sogan-950/70 border border-sogan-800 rounded-xl">
      <div class="flex items-center justify-between text-xs pb-1.5 border-b border-sogan-800">
        <span class="font-bold text-prada flex items-center gap-1.5">
          <i class="fa-solid fa-calendar-check text-amber-400"></i> Tanggal ${dina} ${pasaran} (1 Bulan ke Depan):
        </span>
        <span class="text-[11px] text-sogan-400">${matches.length} Tanggal Ditemukan</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        ${matches.map(m => {
          let kategoriLabel = '';
          if (tujuan === 'ternak' && m.res?.ternak) {
            const kat = m.res.ternak.kategori;
            const isGood = kat === 'Gajah' || kat === 'Suku';
            kategoriLabel = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isGood ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50' : 'bg-amber-950 text-amber-300 border border-amber-600/50'}">${kat} (${m.res.ternak.kewan})</span>`;
          } else if (tujuan === 'loro' && m.res?.loro) {
            kategoriLabel = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600/50">Jalaran: ${m.res.loro.kategori}</span>`;
          } else if (tujuan === 'geblak' && m.res?.geblak) {
            kategoriLabel = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-600/50">${m.res.geblak.kategori}</span>`;
          } else if (tujuan === 'tetanen') {
            kategoriLabel = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/50">Tetanèn: Neptu ${m.res?.neptu || ''}</span>`;
          }

          const y = m.dateObj.getFullYear();
          const mo = String(m.dateObj.getMonth() + 1).padStart(2, '0');
          const dt = String(m.dateObj.getDate()).padStart(2, '0');
          const formattedDate = `${dt}-${mo}-${y}`;

          return `
            <div class="p-3 rounded-lg bg-keraton border border-sogan-800 hover:border-prada/50 transition flex flex-col justify-between gap-2 shadow-sm">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <strong class="text-xs text-amber-100 font-bold">${m.dina} ${m.pasaran}</strong>
                  ${kategoriLabel}
                </div>
                <div class="text-[11px] text-prada font-mono">${formattedDate}</div>
              </div>
              <button type="button" onclick="window.pilihTanggalHasilCariTernak('${m.isoDate}')" class="w-full py-1.5 px-3 rounded-lg bg-sogan-900 hover:bg-sogan-850 border border-prada/40 hover:border-prada text-prada text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer">
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Pilih Tanggal Ini &amp; Hitung
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  container.classList.remove('hidden');
}

if (typeof window !== 'undefined') {
  window.switchTernakInputMode = switchTernakInputMode;
  window.cariTanggalSesuai1Bulan = cariTanggalSesuai1Bulan;
  window.hitungTernakDariUI = hitungTernakDariUI;
  window.resetTernakUI = resetTernakUI;
  window.setTernakTujuan = setTernakTujuan;
  window.cariHariPetungKehidupanUI = cariHariPetungKehidupanUI;
  window.pilihTanggalHasilCariTernak = pilihTanggalHasilCariTernak;
}
