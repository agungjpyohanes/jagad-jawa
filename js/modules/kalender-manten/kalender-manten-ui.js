/**
 * Jagad Jawa — Controller UI: Kalender Hari Baik Pernikahan (Palakrama)
 * 
 * Pengendali DOM untuk tabel interaktif pencarian dan pemetaan hari baik
 * pernikahan berdasarkan rentang tanggal Masehi dengan 17 kolom kalkulasi,
 * penanda kalender khusus (Dina Gede, Dina Ijo, Dina Abang, Bulan Jelek),
 * spinner pemuatan responsif, lazy/chunked rendering, filter real-time,
 * dan ekspor CSV.
 */

import {
  generateKalenderHariBaikRangeAsync,
  saringBarisKalender,
  exportKalenderMantenToCsv
} from './kalender-manten-engine.js';
import { showToast } from '../../ui/toast.js';

let activeRows = [];
let filteredRows = [];
let isCalculating = false;
let calculationAbortId = 0;

// Filter State
const currentFilters = {
  startDate: '',
  endDate: '',
  status: 'semua',
  hanyaDinaIjo: false,
  hanyaBebasBulanJelek: false,
  hanyaWeekend: false,
  filterPasatuan: 'semua',
  pencarianTeks: ''
};

// Pagination State
let currentPage = 1;
const rowsPerPage = 50;

// Debounce timer untuk input pencarian
let searchDebounceTimer = null;

/**
 * Format Date ke format YYYY-MM-DD
 */
function formatDateToIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Dapatkan rentang tanggal default (hari ini s.d. 1 bulan ke depan)
 */
export function dapatkanRentangDefault() {
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  return {
    startStr: formatDateToIso(today),
    endStr: formatDateToIso(oneMonthLater)
  };
}

/**
 * Tampilkan pesan informatif ramah saat tanggal belum dipilih atau perlu konfirmasi
 */
export function tampilkanPesanPilihRentangTanggal(pesan = 'Silakan pilih rentang tanggal mulai dan selesai terlebih dahulu.') {
  const container = document.getElementById('kmTableContainer');
  const countEl = document.getElementById('kmFilteredCount');
  if (countEl) {
    countEl.innerHTML = `
      <span class="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono">
        <i class="fa-solid fa-circle-info text-amber-400"></i>
        <span>${pesan}</span>
      </span>
    `;
  }
  if (container) {
    container.innerHTML = `
      <div class="p-8 text-center rounded-2xl bg-keraton/90 border border-sogan-800 space-y-4 shadow-xl">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sogan-950 border border-amber-500/40 text-amber-400 shadow-md">
          <i class="fa-solid fa-calendar-day text-xl"></i>
        </div>
        <div class="space-y-1">
          <h4 class="font-marcellus text-base text-amber-200">Rentang Tanggal Belum Ditentukan</h4>
          <p class="text-xs text-sogan-300 max-w-md mx-auto leading-relaxed">${pesan}</p>
        </div>
        <div class="flex items-center justify-center gap-2 flex-wrap pt-2">
          <button type="button" id="kmBtnPromptMulai1Bln" onclick="setKalenderPresetRange(1)" class="px-3.5 py-2 rounded-xl bg-prada hover:bg-amber-400 text-keraton font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5">
            <i class="fa-solid fa-calculator"></i>
            <span>Mulai Hitung (1 Bulan)</span>
          </button>
          <button type="button" id="kmBtnPromptMulai3Bln" onclick="setKalenderPresetRange(3)" class="px-3.5 py-2 rounded-xl bg-sogan-900 hover:bg-sogan-800 border border-sogan-700 hover:border-prada text-amber-200 text-xs font-medium transition cursor-pointer">
            ★ Rekomendasi 3 Bulan
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Terapkan rentang tanggal kustom dari input dan mulai kalkulasi
 */
export function terapkanKalenderKustom() {
  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (!inputStart?.value || !inputEnd?.value) {
    const { startStr, endStr } = dapatkanRentangDefault();
    if (inputStart && !inputStart.value) inputStart.value = startStr;
    if (inputEnd && !inputEnd.value) inputEnd.value = endStr;
    currentFilters.startDate = inputStart ? inputStart.value : startStr;
    currentFilters.endDate = inputEnd ? inputEnd.value : endStr;
  } else {
    currentFilters.startDate = inputStart.value;
    currentFilters.endDate = inputEnd.value;
  }

  updatePresetButtonStyles(null);
  muatDanHitungKalenderAsync();
}

/**
 * Inisialisasi awal UI Kalender Hari Baik Pernikahan
 */
export function initKalenderMantenUI() {
  const container = document.getElementById('tab-hari-baik-pernikahan');
  if (!container) return;

  // Set default dates: hari ini s.d. 1 bulan pertama (agar instan tanpa freeze)
  const { startStr, endStr } = dapatkanRentangDefault();

  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (inputStart && !inputStart.value) inputStart.value = startStr;
  if (inputEnd && !inputEnd.value) inputEnd.value = endStr;

  currentFilters.startDate = inputStart?.value || startStr;
  currentFilters.endDate = inputEnd?.value || endStr;

  // Hubungkan seluruh event listener DOM
  attachKalenderEventListeners();

  // Update visual tombol preset aktif (default 1 bulan)
  updatePresetButtonStyles(1);

  // Muat data kalender secara asinkron (dengan spinner responsif & timeout guard)
  muatDanHitungKalenderAsync();
}

/**
 * Hubungkan event listener langsung ke elemen DOM
 */
export function attachKalenderEventListeners() {
  const container = document.getElementById('tab-hari-baik-pernikahan');
  if (!container || container.dataset.listenersAttached === 'true') return;
  container.dataset.listenersAttached = 'true';

  // 1. Preset Buttons (1 Bulan, 3 Bulan, 6 Bulan, 12 Bulan)
  container.querySelectorAll('[data-preset-months]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const months = parseInt(btn.dataset.presetMonths, 10);
      if (!isNaN(months)) {
        setKalenderPresetRange(months);
      }
    });
  });

  // 2. Status Filter Buttons (Semua, Becik Sanget, Cukup Sae, Pantangan)
  container.querySelectorAll('.km-filter-status-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const status = btn.dataset.status || 'semua';
      setFilterStatus(status);
    });
  });

  // 3. Dropdown Pasatuan Manten
  const selPasatuan = document.getElementById('kmSelPasatuan');
  if (selPasatuan) {
    selPasatuan.addEventListener('change', () => {
      currentFilters.filterPasatuan = selPasatuan.value;
      currentPage = 1;
      terapkanFilterDanRender();
    });
  }

  // 4. Input Pencarian Teks (dengan debounce 120ms)
  const inputSearch = document.getElementById('kmInputSearch');
  if (inputSearch) {
    inputSearch.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentFilters.pencarianTeks = inputSearch.value;
        currentPage = 1;
        terapkanFilterDanRender();
      }, 120);
    });
  }

  // 5. Checkboxes (Dina Ijo, Bebas Bulan Jelek, Weekend)
  const chkDinaIjo = document.getElementById('kmChkDinaIjo');
  if (chkDinaIjo) {
    chkDinaIjo.addEventListener('change', () => {
      currentFilters.hanyaDinaIjo = !!chkDinaIjo.checked;
      currentPage = 1;
      terapkanFilterDanRender();
    });
  }

  const chkBebasBulanJelek = document.getElementById('kmChkBebasBulanJelek');
  if (chkBebasBulanJelek) {
    chkBebasBulanJelek.addEventListener('change', () => {
      currentFilters.hanyaBebasBulanJelek = !!chkBebasBulanJelek.checked;
      currentPage = 1;
      terapkanFilterDanRender();
    });
  }

  const chkWeekend = document.getElementById('kmChkWeekend');
  if (chkWeekend) {
    chkWeekend.addEventListener('change', () => {
      currentFilters.hanyaWeekend = !!chkWeekend.checked;
      currentPage = 1;
      terapkanFilterDanRender();
    });
  }

  // 6. Date Inputs
  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');
  if (inputStart) {
    inputStart.addEventListener('change', onKalenderDateChange);
  }
  if (inputEnd) {
    inputEnd.addEventListener('change', onKalenderDateChange);
  }

  // 7. Reset Button
  const btnReset = document.getElementById('kmBtnResetFilter');
  if (btnReset) {
    btnReset.addEventListener('click', resetSemuaFilter);
  }

  // 8. Export CSV & Cetak
  const btnExport = document.getElementById('kmBtnExportCsv');
  if (btnExport) {
    btnExport.addEventListener('click', unduhKalenderHariBaikCsv);
  }
  const btnPrint = document.getElementById('kmBtnPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', cetakKalenderHariBaik);
  }

  // 9. Tombol Mulai Hitung Kustom
  const btnMulaiHitung = document.getElementById('kmBtnMulaiHitung');
  if (btnMulaiHitung) {
    btnMulaiHitung.addEventListener('click', (e) => {
      e.preventDefault();
      terapkanKalenderKustom();
    });
  }
}

/**
 * Update styling visual tombol preset aktif
 */
function updatePresetButtonStyles(activeMonths) {
  document.querySelectorAll('[data-preset-months]').forEach(btn => {
    const m = parseInt(btn.dataset.presetMonths, 10);
    if (m === activeMonths) {
      btn.classList.add('bg-prada/30', 'text-prada', 'border-prada', 'font-bold');
      btn.classList.remove('bg-sogan-900', 'text-sogan-200', 'border-sogan-700');
    } else {
      btn.classList.remove('bg-prada/30', 'text-prada', 'border-prada', 'font-bold');
      btn.classList.add('bg-sogan-900', 'text-sogan-200', 'border-sogan-700');
    }
  });
}

/**
 * Set preset rentang tanggal (1 bulan, 3 bulan, 6 bulan, 12 bulan)
 */
export function setKalenderPresetRange(months) {
  const today = new Date();
  const targetEnd = new Date();
  targetEnd.setMonth(targetEnd.getMonth() + months);

  const startStr = formatDateToIso(today);
  const endStr = formatDateToIso(targetEnd);

  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (inputStart) inputStart.value = startStr;
  if (inputEnd) inputEnd.value = endStr;

  currentFilters.startDate = startStr;
  currentFilters.endDate = endStr;

  updatePresetButtonStyles(months);
  muatDanHitungKalenderAsync();
}

/**
 * Handler ketika input tanggal diubah manual
 */
export function onKalenderDateChange() {
  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (!inputStart?.value || !inputEnd?.value) {
    currentFilters.startDate = inputStart?.value || '';
    currentFilters.endDate = inputEnd?.value || '';
    tampilkanPesanPilihRentangTanggal('Silakan lengkapi tanggal mulai dan selesai untuk memulai kalkulasi.');
    return;
  }

  if (new Date(inputStart.value) > new Date(inputEnd.value)) {
    showToast('Tanggal awal tidak boleh melewati tanggal akhir.');
    tampilkanPesanPilihRentangTanggal('Tanggal awal tidak boleh melewati tanggal akhir. Silakan periksa kembali rentang tanggal.');
    return;
  }

  currentFilters.startDate = inputStart.value;
  currentFilters.endDate = inputEnd.value;

  // Hapus highlight preset karena user memilih tanggal kustom
  updatePresetButtonStyles(null);

  muatDanHitungKalenderAsync();
}

/**
 * Handler filter cepat status hari baik
 */
export function setFilterStatus(status) {
  currentFilters.status = status;
  currentPage = 1;

  document.querySelectorAll('.km-filter-status-btn').forEach(btn => {
    if (btn.dataset.status === status) {
      btn.classList.add('bg-prada', 'text-keraton', 'font-bold');
      btn.classList.remove('bg-sogan-950/70', 'text-sogan-300', 'border-sogan-800');
    } else {
      btn.classList.remove('bg-prada', 'text-keraton', 'font-bold');
      btn.classList.add('bg-sogan-950/70', 'text-sogan-300', 'border-sogan-800');
    }
  });

  terapkanFilterDanRender();
}

/**
 * Handler filter checkbox & dropdown
 */
export function onFilterCheckboxChange() {
  const chkDinaIjo = document.getElementById('kmChkDinaIjo');
  const chkBebasBulanJelek = document.getElementById('kmChkBebasBulanJelek');
  const chkWeekend = document.getElementById('kmChkWeekend');
  const selPasatuan = document.getElementById('kmSelPasatuan');
  const inputSearch = document.getElementById('kmInputSearch');

  currentFilters.hanyaDinaIjo = !!chkDinaIjo?.checked;
  currentFilters.hanyaBebasBulanJelek = !!chkBebasBulanJelek?.checked;
  currentFilters.hanyaWeekend = !!chkWeekend?.checked;
  currentFilters.filterPasatuan = selPasatuan ? selPasatuan.value : 'semua';
  currentFilters.pencarianTeks = inputSearch ? inputSearch.value : '';

  currentPage = 1;
  terapkanFilterDanRender();
}

/**
 * Handler reset seluruh filter
 */
export function resetSemuaFilter() {
  currentFilters.status = 'semua';
  currentFilters.hanyaDinaIjo = false;
  currentFilters.hanyaBebasBulanJelek = false;
  currentFilters.hanyaWeekend = false;
  currentFilters.filterPasatuan = 'semua';
  currentFilters.pencarianTeks = '';

  const chkDinaIjo = document.getElementById('kmChkDinaIjo');
  const chkBebasBulanJelek = document.getElementById('kmChkBebasBulanJelek');
  const chkWeekend = document.getElementById('kmChkWeekend');
  const selPasatuan = document.getElementById('kmSelPasatuan');
  const inputSearch = document.getElementById('kmInputSearch');

  if (chkDinaIjo) chkDinaIjo.checked = false;
  if (chkBebasBulanJelek) chkBebasBulanJelek.checked = false;
  if (chkWeekend) chkWeekend.checked = false;
  if (selPasatuan) selPasatuan.value = 'semua';
  if (inputSearch) inputSearch.value = '';

  document.querySelectorAll('.km-filter-status-btn').forEach(btn => {
    if (btn.dataset.status === 'semua') {
      btn.classList.add('bg-prada', 'text-keraton', 'font-bold');
      btn.classList.remove('bg-sogan-950/70', 'text-sogan-300', 'border-sogan-800');
    } else {
      btn.classList.remove('bg-prada', 'text-keraton', 'font-bold');
      btn.classList.add('bg-sogan-950/70', 'text-sogan-300', 'border-sogan-800');
    }
  });

  currentPage = 1;
  terapkanFilterDanRender();
  showToast('Seluruh filter telah direset.');
}

/**
 * Tampilkan Spinner Responsif saat perhitungan berlangsung
 */
function tampilkanSpinnerLoading(pesan = 'Menghitung 17 kolom hari baik...') {
  const container = document.getElementById('kmTableContainer');
  const countEl = document.getElementById('kmFilteredCount');

  if (countEl) {
    countEl.innerHTML = `
      <span class="inline-flex items-center gap-1.5 text-xs text-amber-300">
        <i class="fa-solid fa-circle-notch fa-spin text-prada text-xs"></i>
        <span>${pesan}</span>
      </span>
    `;
  }

  if (container && (!activeRows || activeRows.length === 0)) {
    container.innerHTML = `
      <div id="kmLoadingSpinner" class="p-12 text-center rounded-2xl bg-keraton/90 border border-sogan-800 space-y-4 shadow-xl backdrop-blur-md">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sogan-950 border border-prada/40 shadow-lg text-prada">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-amber-400"></i>
        </div>
        <div class="space-y-1">
          <h4 class="font-marcellus text-base text-amber-200">Memuat Kalkulasi Primbon Palakrama</h4>
          <p class="text-xs text-sogan-400 font-mono" id="kmLoadingProgressDetail">${pesan}</p>
        </div>
      </div>
    `;
  }
}

/**
 * Muat data secara asinkron dengan lazy/chunked rendering agar main-thread tidak freeze
 */
export async function muatDanHitungKalenderAsync() {
  // Validasi input tanggal: jika kosong, periksa input DOM atau isi dengan rentang default
  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (!currentFilters.startDate && inputStart?.value) {
    currentFilters.startDate = inputStart.value;
  }
  if (!currentFilters.endDate && inputEnd?.value) {
    currentFilters.endDate = inputEnd.value;
  }

  if (!currentFilters.startDate || !currentFilters.endDate) {
    const { startStr, endStr } = dapatkanRentangDefault();
    if (!currentFilters.startDate) currentFilters.startDate = startStr;
    if (!currentFilters.endDate) currentFilters.endDate = endStr;
    if (inputStart && !inputStart.value) inputStart.value = currentFilters.startDate;
    if (inputEnd && !inputEnd.value) inputEnd.value = currentFilters.endDate;
  }

  if (!currentFilters.startDate || !currentFilters.endDate) {
    isCalculating = false;
    tampilkanPesanPilihRentangTanggal('Silakan pilih rentang tanggal mulai dan selesai terlebih dahulu.');
    return;
  }

  const thisAbortId = ++calculationAbortId;
  isCalculating = true;

  tampilkanSpinnerLoading('Menghitung rentang tanggal...');

  let calculationCompleted = false;

  // Pengaman Timeout 1 detik (1000ms): hentikan loader jika kalkulasi terhambat
  const timeoutGuard = setTimeout(() => {
    if (!calculationCompleted && isCalculating && thisAbortId === calculationAbortId) {
      console.warn('[Kalender Manten] Kalkulasi mencapai batas waktu 1 detik (1000ms). Menghentikan status loader.');
      isCalculating = false;

      if (activeRows && activeRows.length > 0) {
        currentPage = 1;
        terapkanFilterDanRender();
        const countEl = document.getElementById('kmFilteredCount');
        if (countEl) {
          countEl.innerHTML = `<span class="text-xs text-amber-300 font-mono"><i class="fa-solid fa-clock-rotate-left mr-1"></i> Menampilkan ${activeRows.length} hari terhitung</span>`;
        }
      } else {
        tampilkanPesanPilihRentangTanggal('Kalkulasi memerlukan konfirmasi rentang tanggal. Silakan pilih rentang tanggal mulai dan selesai atau klik tombol Mulai Hitung.');
      }
    }
  }, 1000);

  try {
    let firstChunkRendered = false;

    await generateKalenderHariBaikRangeAsync(currentFilters.startDate, currentFilters.endDate, {
      chunkSize: 30, // 30 hari per chunk agar frame rate browser tetap stabil
      onProgress: ({ loaded, total, percent }) => {
        if (thisAbortId !== calculationAbortId) return;

        const countEl = document.getElementById('kmFilteredCount');
        if (countEl && !firstChunkRendered) {
          countEl.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-xs text-amber-300">
              <i class="fa-solid fa-circle-notch fa-spin text-prada text-xs"></i>
              <span>Menghitung: ${loaded} / ${total} hari (${percent}%)</span>
            </span>
          `;
        }

        const detailEl = document.getElementById('kmLoadingProgressDetail');
        if (detailEl) {
          detailEl.textContent = `Menghitung: ${loaded} dari ${total} hari (${percent}%)...`;
        }
      },
      onChunk: (chunkRows, accumulatedRows) => {
        if (thisAbortId !== calculationAbortId) return;

        activeRows = accumulatedRows;

        // Segera render chunk pertama agar pengguna langsung melihat hasil dalam waktu singkat
        if (!firstChunkRendered && accumulatedRows.length >= 30) {
          firstChunkRendered = true;
          currentPage = 1;
          terapkanFilterDanRender();
        }
      }
    });

    calculationCompleted = true;
    clearTimeout(timeoutGuard);

    if (thisAbortId !== calculationAbortId) return;

    isCalculating = false;
    currentPage = 1;
    terapkanFilterDanRender();

  } catch (err) {
    calculationCompleted = true;
    clearTimeout(timeoutGuard);
    console.error('Error kalkulasi Kalender Hari Baik:', err);
    isCalculating = false;
    const container = document.getElementById('kmTableContainer');
    if (container) {
      container.innerHTML = `
        <div class="p-8 text-center rounded-2xl bg-rose-950/40 border border-rose-700/60 text-xs text-rose-200 space-y-2">
          <i class="fa-solid fa-triangle-exclamation text-2xl text-rose-400"></i>
          <p class="font-bold">Gagal menghitung kalender hari baik</p>
          <p class="text-rose-300/80 font-mono text-[11px]">${err.message}</p>
          <div class="pt-2">
            <button type="button" onclick="terapkanKalenderKustom()" class="px-3 py-1.5 rounded-xl bg-sogan-900 hover:bg-sogan-800 border border-sogan-700 text-amber-200 text-xs transition cursor-pointer">
              <i class="fa-solid fa-rotate-right mr-1"></i> Coba Lagi
            </button>
          </div>
        </div>
      `;
    }
  }
}

/**
 * Terapkan filter ke activeRows dan render UI
 */
function terapkanFilterDanRender() {
  filteredRows = saringBarisKalender(activeRows, currentFilters);
  renderSummaryMetrics();
  renderTabelKalender();
}

/**
 * Render Kartu Metrik Ringkasan di atas tabel
 */
function renderSummaryMetrics() {
  const container = document.getElementById('kmSummaryContainer');
  if (!container) return;

  const total = activeRows.length;
  const becikSangetCount = activeRows.filter(r => r.statusAkhir === 'Becik Sanget').length;
  const cukupCount = activeRows.filter(r => r.statusAkhir === 'Cukup Sae').length;
  const pantanganCount = activeRows.filter(r => r.statusAkhir === 'Ala / Pantangan').length;
  const dinaIjoCount = activeRows.filter(r => r.isDinaIjo).length;
  const bulanJelekCount = activeRows.filter(r => r.isBulanJelek).length;

  const pctBecik = total > 0 ? Math.round((becikSangetCount / total) * 100) : 0;

  // Deteksi info tahun & sasi Jawa dalam periode
  const tahunSiklusList = [...new Set(activeRows.map(r => r.tahunSiklus))].join(', ');
  const sasiList = [...new Set(activeRows.map(r => r.sasiJawa))].join(', ');

  container.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
      <!-- 1. Total Hari -->
      <div class="p-3.5 rounded-2xl bg-keraton/90 border border-sogan-800 shadow-sm flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-sogan-400">Total Periode</span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100">${total}</strong>
          <span class="text-[10px] text-sogan-400">Dina</span>
        </div>
        <div class="mt-1 text-[10px] text-sogan-400 truncate" title="${tahunSiklusList}">Tahun: ${tahunSiklusList || '-'}</div>
      </div>

      <!-- 2. Rekomendasi Utama (Becik Sanget) -->
      <div class="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 shadow-md flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <i class="fa-solid fa-crown text-amber-400 text-[10px]"></i> Becik Sanget
        </span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-emerald-200">${becikSangetCount}</strong>
          <span class="text-[10px] font-mono text-emerald-400">${pctBecik}%</span>
        </div>
        <div class="mt-1 text-[10px] text-emerald-300/80">Rekomendasi Utama Akad</div>
      </div>

      <!-- 3. Cukup Sae / Netral -->
      <div class="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-sm flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-amber-300">Cukup Sae</span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">${cukupCount}</strong>
          <span class="text-[10px] text-amber-400">Dina</span>
        </div>
        <div class="mt-1 text-[10px] text-amber-300/80">Netral / Bisa Dipilih</div>
      </div>

      <!-- 4. Pantangan / Disingkiri -->
      <div class="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 shadow-sm flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-rose-300">Pantangan</span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-rose-200">${pantanganCount}</strong>
          <span class="text-[10px] text-rose-400">Dina</span>
        </div>
        <div class="mt-1 text-[10px] text-rose-300/80">Kudu Disingkiri</div>
      </div>

      <!-- 5. Dina Ijo -->
      <div class="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/40 shadow-sm flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-teal-300">Dina Ijo</span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-teal-200">${dinaIjoCount}</strong>
          <span class="text-[10px] text-teal-400">Hari</span>
        </div>
        <div class="mt-1 text-[10px] text-teal-300/80">Pawukon Kasampurnan</div>
      </div>

      <!-- 6. Bulan Jelek Tahun -->
      <div class="p-3.5 rounded-2xl bg-sogan-950/80 border border-prada/30 shadow-sm flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-amber-400">Bulan Jelek Taun</span>
        <div class="mt-2 flex items-baseline justify-between">
          <strong class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100">${bulanJelekCount}</strong>
          <span class="text-[10px] text-sogan-400">Hari</span>
        </div>
        <div class="mt-1 text-[10px] text-sogan-400 truncate" title="${sasiList}">Sasi: ${sasiList || '-'}</div>
      </div>
    </div>
  `;
}

/**
 * Render Tabel Kalender 17 Kolom
 */
/**
 * Render Tabel Kalender Bersih & Minimalis (6 Kolom Utama dengan Perhitungan Lengkap di Belakang Layar)
 * 1. Tanggal Masehi (Tanggal, Bulan, Tahun)
 * 2. Tanggal Jawa (Tanggal, Sasi, Tahun)
 * 3. Dina & Pasaran (beserta Neptu)
 * 4. Wuku
 * 5. Ket. Pakarti Lengkap (Rangkuman pakarti tanggal, sasi, wuku, & pasatuan manten)
 * 6. Kesimpulan Status (Badge status rekomendasi: Becik Sanget, Cukup Sae, utawi Pantangan)
 */
function renderTabelKalender() {
  const container = document.getElementById('kmTableContainer');
  const countEl = document.getElementById('kmFilteredCount');
  
  if (countEl) {
    countEl.textContent = `${filteredRows.length} hari ditampilkan (dari total ${activeRows.length})`;
  }

  if (!container) return;

  if (filteredRows.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center rounded-2xl bg-keraton/70 border border-sogan-800 space-y-3">
        <i class="fa-solid fa-calendar-xmark text-4xl text-sogan-500"></i>
        <h4 class="font-marcellus text-lg text-amber-200">Tidak Ada Hari yang Sesuai Filter</h4>
        <p class="text-xs text-sogan-400 max-w-md mx-auto">Coba atur ulang filter pencarian atau pilih rentang tanggal yang lebih luas untuk melihat rekomendasi hari baik pernikahan.</p>
        <button type="button" onclick="resetSemuaFilter()" class="mt-2 px-4 py-2 rounded-xl bg-sogan-900 border border-prada/50 text-prada hover:bg-sogan-800 text-xs font-semibold cursor-pointer transition">
          Reset Filter
        </button>
      </div>
    `;
    return;
  }

  // Hitung slice pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pagedRows = filteredRows.slice(startIdx, endIdx);

  // Buat HTML Baris Tabel (6 Kolom Minimalis & Bersih)
  let rowsHtml = '';
  pagedRows.forEach((row) => {
    const isHighlightBecik = row.statusAkhir === 'Becik Sanget';
    const isRowAla = row.statusAkhir === 'Ala / Pantangan';

    let rowClass = 'hover:bg-sogan-950/60 transition-colors border-b border-sogan-800/60 text-xs';
    if (isHighlightBecik) {
      rowClass += ' bg-emerald-950/20';
    } else if (isRowAla) {
      rowClass += ' bg-rose-950/10 opacity-95';
    }

    // Badge Dina Gede
    const badgeGede = row.isDinaGede
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50" title="Dina Gede (Hari Besar)"><i class="fa-solid fa-star text-[9px] text-amber-400"></i> Gede</span>`
      : '';

    // Badge Dina Ijo vs Dina Abang
    const badgeDinaWarna = row.isDinaIjo
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#15803d]/30 text-emerald-300 border border-emerald-500/50" title="Dina Ijo (Becik)"><i class="fa-solid fa-circle text-[7px] text-emerald-400"></i> Ijo</span>`
      : `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-rose-300 border border-rose-600/50" title="Dina Abang (Pantangan)"><i class="fa-solid fa-circle text-[7px] text-rose-400"></i> Abang</span>`;

    // Badge Keterangan Pakarti Tanggal (Becik / Ala)
    const badgePakartiTgl = row.keteranganPakartiTanggalJawa === 'Becik'
      ? `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60">Becik</span>`
      : `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-rose-950/90 text-rose-300 border border-rose-700/60">Ala</span>`;

    // Badge Sasi Kanggo Manten (Becik, Netral, Ala)
    let badgeSasiManten = '';
    if (row.statusSasiManten === 'Becik') {
      badgeSasiManten = `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60">Becik</span>`;
    } else if (row.statusSasiManten === 'Netral') {
      badgeSasiManten = `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-600/60">Netral</span>`;
    } else {
      badgeSasiManten = `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-rose-950/90 text-rose-300 border border-rose-700/60">Ala</span>`;
    }

    // Badge Pasatuan Manten Modulo 6
    let badgePasatuanRingkas = '';
    if (row.statusPasatuanManten === 'Becik') {
      badgePasatuanRingkas = `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-emerald-950 text-emerald-200 border border-emerald-600/60">Becik</span>`;
    } else {
      badgePasatuanRingkas = `<span class="inline-flex items-center px-1 py-0.2 rounded text-[9.5px] font-bold bg-rose-950 text-rose-300 border border-rose-700/60">Ala</span>`;
    }

    // Badge Pakarti Wuku
    let badgeWuku = '';
    if (row.pakartiWuku === 'Becik') {
      badgeWuku = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">Becik</span>`;
    } else if (row.pakartiWuku === 'Ala') {
      badgeWuku = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">Ala</span>`;
    } else {
      badgeWuku = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-sogan-950 text-sogan-300 border border-sogan-700">Normal</span>`;
    }

    // Badge Bulan Jelek Tahun Jawa
    const badgeBulanJelek = row.isBulanJelek
      ? `<div class="mt-1"><span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-950 text-rose-300 border border-rose-600" title="${row.bulanJelekWarning}"><i class="fa-solid fa-triangle-exclamation text-[8px] text-rose-400"></i> ${row.akibatBulanJelek || 'Sasi Jelek Taun'}</span></div>`
      : '';

    // Status Rekomendasi Badge Utama
    let badgeStatusAkhir = '';
    if (row.statusAkhir === 'Becik Sanget') {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-emerald-900/80 text-emerald-100 border border-emerald-500 shadow-sm"><i class="fa-solid fa-check text-[9px] text-emerald-300"></i> Becik Sanget</span>`;
    } else if (row.statusAkhir === 'Cukup Sae') {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold bg-amber-900/60 text-amber-200 border border-amber-600/60 shadow-xs"><i class="fa-solid fa-minus text-[8px] text-amber-300"></i> Cukup Sae</span>`;
    } else {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-rose-950 text-rose-200 border border-rose-700 shadow-xs"><i class="fa-solid fa-ban text-[8px] text-rose-400"></i> Pantangan</span>`;
    }

    rowsHtml += `
      <tr class="${rowClass}">
        <!-- 1. Tanggal Masehi (Tanggal, Bulan, Tahun) -->
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="font-bold text-amber-200 text-sm font-mono">${row.tanggalMasehi} ${row.bulanMasehi} ${row.tahunMasehi}</div>
          <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${row.isoDate}</div>
        </td>

        <!-- 2. Tanggal Jawa (Tanggal, Sasi, Tahun) -->
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="font-bold text-prada">${row.tanggalJawa} ${row.sasiJawa} <span class="text-[10.5px] text-sogan-300 font-mono">(${row.tahunAJ} AJ)</span></div>
          <div class="text-[10.5px] text-sogan-400">Tahun ${row.tahunSiklus} · ${row.namaWindu}</div>
          ${badgeBulanJelek}
        </td>

        <!-- 3. Dina & Pasaran (beserta Neptu) -->
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            <strong class="text-amber-100 font-bold text-sm">${row.hari} ${row.pasaran}</strong>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sogan-900 border border-prada/40 text-prada" title="Neptu Dina (${row.neptuDina}) + Pasaran (${row.neptuPasaran}) = ${row.neptuDinaPasaran}">
              Neptu ${row.neptuDinaPasaran}
            </span>
          </div>
          <div class="mt-1 flex items-center gap-1.5 flex-wrap">
            ${badgeDinaWarna}
            ${badgeGede}
          </div>
        </td>

        <!-- 4. Wuku -->
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="font-semibold text-amber-200 text-sm">${row.wuku}</div>
          <div class="mt-0.5">${badgeWuku}</div>
        </td>

        <!-- 5. Ket. Pakarti Lengkap (Rangkuman pakarti tanggal, sasi, wuku, & pasatuan manten) -->
        <td class="px-4 py-3 min-w-[280px]">
          <div class="space-y-1 text-[11px] leading-snug">
            <!-- Pasatuan Manten (Modulo 6) -->
            <div class="flex items-baseline gap-1.5">
              <span class="text-sogan-400 font-mono text-[10px] shrink-0">Pasatuan:</span>
              <strong class="${row.statusPasatuanManten === 'Becik' ? 'text-emerald-200' : 'text-amber-200'}">${row.pasatuanManten}</strong>
              <span class="text-sogan-300 text-[10.5px]">(${row.tegesePasatuanManten})</span>
              <span class="shrink-0">${badgePasatuanRingkas}</span>
            </div>
            <!-- Pakarti Sasi Jawa -->
            <div class="flex items-baseline gap-1.5">
              <span class="text-sogan-400 font-mono text-[10px] shrink-0">Sasi ${row.sasiJawa}:</span>
              <span class="text-sogan-200">${row.pakartiSasiJawaKanggoManten}</span>
              <span class="shrink-0">${badgeSasiManten}</span>
            </div>
            <!-- Pakarti Tanggal Jawa -->
            <div class="flex items-baseline gap-1.5">
              <span class="text-sogan-400 font-mono text-[10px] shrink-0">Tgl ${row.tanggalJawa} Jawa:</span>
              <span class="text-sogan-200">${row.pakartiTanggalJawa}</span>
              <span class="shrink-0">${badgePakartiTgl}</span>
            </div>
          </div>
        </td>

        <!-- 6. Kesimpulan Status & Aksi -->
        <td class="px-4 py-3 whitespace-nowrap text-right">
          <div class="flex flex-col items-end gap-1.5">
            <div>${badgeStatusAkhir}</div>
            <div class="flex items-center gap-1.5 mt-1">
              <button type="button" onclick="bukaModalRincian17Kolom('${row.isoDate}')" class="px-2.5 py-1 rounded-lg bg-sogan-950 hover:bg-sogan-800 text-amber-200 border border-sogan-700 hover:border-prada text-[11px] font-medium transition cursor-pointer flex items-center gap-1 shadow-xs" title="Lihat kalkulasi lengkap 17 kolom">
                <i class="fa-solid fa-list-check text-[9px] text-prada"></i>
                <span>Rincian</span>
              </button>
              <button type="button" onclick="bukaSimulasiIjabTanggal('${row.isoDate}')" class="px-2.5 py-1 rounded-lg bg-sogan-900 hover:bg-prada hover:text-keraton text-prada border border-prada/40 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs" title="Buka Petung Ijab untuk tanggal ini">
                <i class="fa-solid fa-ring text-[9px]"></i>
                <span>Ijab</span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
  });

  // Pagination HTML
  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml = `
      <div class="p-3.5 border-t border-sogan-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-keraton/90">
        <div class="text-sogan-400 text-xs">
          Menampilkan baris <strong>${startIdx + 1}</strong> s.d. <strong>${Math.min(endIdx, filteredRows.length)}</strong> dari <strong>${filteredRows.length}</strong> total baris
        </div>
        <div class="flex items-center gap-1.5 self-end sm:self-auto">
          <button type="button" onclick="pindahHalamanKalender(1)" ${currentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">
            <i class="fa-solid fa-angles-left text-[10px]"></i>
          </button>
          <button type="button" onclick="pindahHalamanKalender(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">
            <i class="fa-solid fa-angle-left text-[10px]"></i>
          </button>
          <span class="px-3 py-1 font-mono font-bold text-prada bg-sogan-950 border border-prada/30 rounded-lg">
            Halaman ${currentPage} / ${totalPages}
          </span>
          <button type="button" onclick="pindahHalamanKalender(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">
            <i class="fa-solid fa-angle-right text-[10px]"></i>
          </button>
          <button type="button" onclick="pindahHalamanKalender(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition">
            <i class="fa-solid fa-angles-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="overflow-x-auto rounded-2xl border border-sogan-800 shadow-xl bg-keraton/90">
      <table class="w-full text-left border-collapse text-xs">
        <thead class="bg-sogan-950/95 border-b border-sogan-700 sticky top-0 z-20 text-[11px] font-mono uppercase tracking-wider text-sogan-300">
          <tr>
            <th class="px-4 py-3 border-r border-sogan-800/80">1. Tanggal Masehi</th>
            <th class="px-4 py-3 border-r border-sogan-800/80">2. Tanggal Jawa</th>
            <th class="px-4 py-3 border-r border-sogan-800/80">3. Dina &amp; Pasaran</th>
            <th class="px-4 py-3 border-r border-sogan-800/80">4. Wuku</th>
            <th class="px-4 py-3 border-r border-sogan-800/80">5. Ket. Pakarti Lengkap</th>
            <th class="px-4 py-3 text-right">6. Kesimpulan Status &amp; Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-sogan-800/40">
          ${rowsHtml}
        </tbody>
      </table>
      ${paginationHtml}
    </div>
  `;
}


/**
 * Pindah Halaman Pagination
 */
export function pindahHalamanKalender(page) {
  currentPage = page;
  renderTabelKalender();
  const el = document.getElementById('kmTableContainer');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Ekspor dataset yang sedang aktif ke CSV
 */
export function unduhKalenderHariBaikCsv() {
  if (!filteredRows || filteredRows.length === 0) {
    showToast('Tidak ada data kalender untuk diekspor.');
    return;
  }

  try {
    const csvContent = exportKalenderMantenToCsv(filteredRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Kalender_Hari_Baik_Pernikahan_${currentFilters.startDate}_sd_${currentFilters.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Berhasil mengunduh tabel kalender hari baik (CSV).');
  } catch (err) {
    console.error('Error unduh CSV:', err);
    showToast('Gagal mengunduh CSV: ' + err.message);
  }
}

/**
 * Cetak Dokumen Ringkasan Eksekutif PDF Kalender Hari Baik Pernikahan
 */
export function cetakKalenderHariBaik() {
  if (!activeRows || activeRows.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Belum ada data kalender yang dimuat untuk dicetak.');
    }
    return;
  }

  const dataset = (filteredRows && filteredRows.length > 0) ? filteredRows : activeRows;
  const totalHari = dataset.length;
  const becikSangetRows = dataset.filter(r => r.statusAkhir === 'Becik Sanget');
  const cukupSaeRows = dataset.filter(r => r.statusAkhir === 'Cukup Sae');
  const pantanganRows = dataset.filter(r => r.statusAkhir === 'Ala / Pantangan');
  const dinaIjoCount = dataset.filter(r => r.isDinaIjo).length;
  const bebasBulanJelekCount = dataset.filter(r => !r.isBulanJelek).length;

  let container = document.getElementById('laporan-cetak-pdf');
  if (!container) {
    container = document.createElement('div');
    container.id = 'laporan-cetak-pdf';
    container.className = 'print-only-document';
    document.body.appendChild(container);
  }

  const tglAwal = currentFilters.startDate || (dataset[0] ? dataset[0].isoDate : '-');
  const tglAkhir = currentFilters.endDate || (dataset[dataset.length - 1] ? dataset[dataset.length - 1].isoDate : '-');

  const sampleBecik = becikSangetRows.slice(0, 18);
  const rowsBecikHtml = sampleBecik.map((r, idx) => `
    <tr style="border-bottom: 1px solid #d4c5a9;">
      <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${idx + 1}</td>
      <td style="padding: 6px 8px; font-weight: bold;">${r.hari} ${r.pasaran}</td>
      <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${r.tanggalMasehi} ${r.bulanMasehi} ${r.tahunMasehi}</td>
      <td style="padding: 6px 8px; text-align: center;">${r.tanggalJawa} ${r.sasiJawa} (${r.tahunSiklus})</td>
      <td style="padding: 6px 8px; text-align: center; font-family: monospace; font-weight: bold;">${r.neptuDinaPasaran}</td>
      <td style="padding: 6px 8px; font-weight: 600; color: #166534;">${r.pasatuanManten}</td>
      <td style="padding: 6px 8px;">${r.tegesePasatuanManten}</td>
      <td style="padding: 6px 8px;">${r.wuku}</td>
    </tr>
  `).join('');

  const bulanJelekDistinct = [...new Set(dataset.filter(r => r.isBulanJelek).map(r => `${r.sasiJawa} (Taun ${r.tahunSiklus}: ${r.akibatBulanJelek || 'Sasi Jelek'})`))];

  container.innerHTML = `
    <div style="padding: 24px 32px; font-family: 'Crimson Pro', 'Georgia', serif; color: #2c1a0e; background: #fffcf7; line-height: 1.5;">
      <!-- KOP KASULTANAN / SERAT PENGET -->
      <div style="text-align: center; border-bottom: 3px double #8a6538; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #8a6538; font-weight: 700;">
          SERAT PENGET PALAKRAMA · JAGAD JAWA
        </div>
        <h1 style="font-size: 22px; margin: 8px 0 4px 0; font-family: 'Cinzel', 'Marcellus', serif; color: #3b2314; letter-spacing: 1px;">
          RINGKASAN EKSEKUTIF HARI BAIK PERNIKAHAN
        </h1>
        <div style="font-size: 12px; font-style: italic; color: #6b4d2e;">
          Petung Baku Pawukon, Modulo 6 Pasatuan Manten, lan Panaliti Sasi Jelek Taun Jawa
        </div>
        <div style="margin-top: 8px; font-size: 11px; font-family: monospace; color: #5a4027;">
          Rentang Analisis: <strong>${tglAwal}</strong> s.d. <strong>${tglAkhir}</strong> (Total: ${totalHari} Hari Dipantau)
        </div>
      </div>

      <!-- METRIK IKHTISAR -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px;">
        <div style="border: 1px solid #166534; background: #f0fdf4; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #166534; font-weight: bold;">Rekomendasi Utama (Becik Sanget)</div>
          <div style="font-size: 24px; font-weight: bold; color: #14532d; margin-top: 4px;">${becikSangetRows.length}</div>
          <div style="font-size: 10px; color: #15803d;">Hari Paling Rahayu</div>
        </div>
        <div style="border: 1px solid #d97706; background: #fffbeb; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #b45309; font-weight: bold;">Cukup Sae (Sedheng / Netral)</div>
          <div style="font-size: 24px; font-weight: bold; color: #92400e; margin-top: 4px;">${cukupSaeRows.length}</div>
          <div style="font-size: 10px; color: #b45309;">Layak Kanthi Cathetan</div>
        </div>
        <div style="border: 1px solid #dc2626; background: #fef2f2; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #b91c1c; font-weight: bold;">Pantangan Pernikahan</div>
          <div style="font-size: 24px; font-weight: bold; color: #991b1b; margin-top: 4px;">${pantanganRows.length}</div>
          <div style="font-size: 10px; color: #b91c1c;">Kudu Disirik / Diendhani</div>
        </div>
        <div style="border: 1px solid #8a6538; background: #faf5ee; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78350f; font-weight: bold;">Bebas Sasi Jelek Taun</div>
          <div style="font-size: 24px; font-weight: bold; color: #78350f; margin-top: 4px;">${bebasBulanJelekCount}</div>
          <div style="font-size: 10px; color: #78350f;">Dina Ijo: ${dinaIjoCount} Hari</div>
        </div>
      </div>

      <!-- PEDOMAN STATUS HARI BAIK -->
      <div style="border: 1px solid #d4c5a9; background: #faf6f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 11px;">
        <div style="font-weight: bold; color: #5a3c1c; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Kaidah Pambiji & Kriteria Status Petung:</div>
        <ul style="margin: 0; padding-left: 18px; color: #422c16;">
          <li><strong>Becik Sanget:</strong> Bebas sasi jelek tahun, Pasatuan Modulo 6 Becik (Sanggar Waringin / Satriya Sinarajo), Sasi Jawa Becik (Jumadilakir, Ruwah, Pasa) utawa Netral (Rejeb), Dina Ijo, Wuku Becik/Normal, lan Pakarti Tanggal Becik.</li>
          <li><strong>Cukup Sae:</strong> Ora kalebu pantangan mutlak, nanging ana unsur sedheng/netral (umpamane Sasi Rejeb "Sugih Anak" kanthi wuku normal).</li>
          <li><strong>Pantangan:</strong> Dina kang kalebu Sasi Jelek Taun Jawa (${bulanJelekDistinct.join(', ') || 'Nihil'}), Pasatuan Nuju Pati (Modulo 6 sisa 0), Wuku Ala, utawa Sasi Ala kanthi dina abang/pantangan pawukon.</li>
        </ul>
      </div>

      <!-- TABEL REKOMENDASI UTAMA HARI BAIK -->
      <div style="margin-bottom: 22px;">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #166534; border-bottom: 2px solid #166534; padding-bottom: 4px; margin-bottom: 8px;">
          Daftar Tanggal Paling Rahayu (Rekomendasi Becik Sanget)
        </h3>
        ${becikSangetRows.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background: #e8f5e9; border-bottom: 2px solid #81c784; text-align: left; color: #1b5e20;">
                <th style="padding: 6px 8px; text-align: center;">No</th>
                <th style="padding: 6px 8px;">Dina & Pasaran</th>
                <th style="padding: 6px 8px; text-align: center;">Tanggal Masehi</th>
                <th style="padding: 6px 8px; text-align: center;">Tanggal & Sasi Jawa</th>
                <th style="padding: 6px 8px; text-align: center;">Neptu</th>
                <th style="padding: 6px 8px;">Pasatuan Manten</th>
                <th style="padding: 6px 8px;">Tegese Pasatuan</th>
                <th style="padding: 6px 8px;">Wuku</th>
              </tr>
            </thead>
            <tbody>
              ${rowsBecikHtml}
            </tbody>
          </table>
          ${becikSangetRows.length > 18 ? `<div style="font-size: 10px; font-style: italic; color: #6b4d2e; margin-top: 6px; text-align: right;">* Menampilkan 18 dari total ${becikSangetRows.length} tanggal rekomendasi utama. Silakan ekspor CSV untuk tabel lengkap.</div>` : ''}
        ` : `
          <div style="padding: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 11px; color: #92400e;">
            Ora ana tanggal kang nggayuh kriteria <em>Becik Sanget</em> ing rentang wektu iki. Panjenengan saged milih tanggal ing kategori <em>Cukup Sae</em> utawi ngambakake rentang wektu padosan.
          </div>
        `}
      </div>

      <!-- KOLOFON & TANDHA ASTHA -->
      <div style="border-top: 1px solid #d4c5a9; padding-top: 14px; margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10.5px; color: #5a4027;">
        <div>
          <div><strong>Jagad Jawa — Sistem Informasi Kasampurnan Budaya Jawa</strong></div>
          <div>Dilaras miturut Primbon Betaljemur Adammakna & Pethikan Pawukon Kasultanan</div>
          <div style="font-family: monospace; font-size: 9.5px; color: #8a6538; margin-top: 3px;">Kacithak: ${new Date().toLocaleString('id-ID')}</div>
        </div>
        <div style="text-align: center; min-width: 160px;">
          <div>Tandha Astha Paniti Petung,</div>
          <div style="margin-top: 36px; border-bottom: 1px solid #5a4027; font-weight: bold;">( ABDI DALEM PENGET )</div>
          <div style="font-size: 9px; color: #78350f;">Pranata Mangsa & Palakrama</div>
        </div>
      </div>
    </div>
  `;

  if (typeof window.printLaporan === 'function') {
    window.printLaporan('parchment', 'Ringkasan Eksekutif Kalender Hari Baik Pernikahan');
  } else {
    window.print();
  }
}

/**
 * Navigasi langsung ke Tab Petung Ijab dengan tanggal terpilih
 */
export function bukaSimulasiIjabTanggal(isoDate) {
  if (typeof window.switchTab === 'function') {
    window.switchTab('ijab');
  }
  setTimeout(() => {
    const dateInput = document.getElementById('ijabDatePicker');
    if (dateInput) {
      dateInput.value = isoDate;
      if (typeof window.syncIjabDariTanggal === 'function') {
        window.syncIjabDariTanggal();
      }
      if (typeof window.setIjabWizardStep === 'function') {
        window.setIjabWizardStep(2);
      }
      showToast(`Tanggal ${isoDate} disinkronkan ke Petung Ijab.`);
    }
  }, 150);
}

// Inisialisasi otomatis jika container sudah ada di DOM
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      attachKalenderEventListeners();
    });
  } else {
    attachKalenderEventListeners();
  }
}


/**
 * Modal Rincian Lengkap 17 Kolom Primbon Palakrama
 * Menyajikan seluruh variabel kalkulasi baku tanpa menyumbat tabel antarmuka
 */
export function bukaModalRincian17Kolom(isoDate) {
  const row = activeRows.find(r => r.isoDate === isoDate);
  if (!row) {
    if (typeof showToast === 'function') showToast('Data rincian tanggal tidak ditemukan.');
    return;
  }

  let modal = document.getElementById('modalDetail17KolomManten');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalDetail17KolomManten';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300';
    document.body.appendChild(modal);
  }

  // Status Badge Modal
  let badgeStatusModal = '';
  if (row.statusAkhir === 'Becik Sanget') {
    badgeStatusModal = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-200 border border-emerald-500 shadow-md"><i class="fa-solid fa-check text-emerald-400"></i> Becik Sanget (Rekomendasi Utama)</span>';
  } else if (row.statusAkhir === 'Cukup Sae') {
    badgeStatusModal = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-950 text-amber-200 border border-amber-600 shadow-md"><i class="fa-solid fa-minus text-amber-400"></i> Cukup Sae (Sedheng / Netral)</span>';
  } else {
    badgeStatusModal = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-950 text-rose-200 border border-rose-600 shadow-md"><i class="fa-solid fa-ban text-rose-400"></i> Pantangan Pernikahan</span>';
  }

  // Badge Dina Warna
  const badgeDinaWarna = row.isDinaIjo
    ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60"><i class="fa-solid fa-circle text-[7px] text-emerald-400"></i> Dina Ijo (Rahayu)</span>'
    : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-600/60"><i class="fa-solid fa-circle text-[7px] text-rose-400"></i> Dina Abang (Pantangan Pawukon)</span>';

  // Badge Dina Gede
  const badgeGede = row.isDinaGede
    ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/60"><i class="fa-solid fa-star text-[9px] text-amber-400"></i> Dina Gede (Dinten Mirunggan)</span>'
    : '<span class="text-sogan-400 text-xs">Bukan Dina Gede</span>';

  // Badge Bulan Jelek
  const badgeBulanJelek = row.isBulanJelek
    ? `<div class="p-2.5 rounded-xl bg-rose-950/70 border border-rose-600 text-xs text-rose-200 flex items-start gap-2">
        <i class="fa-solid fa-triangle-exclamation text-rose-400 mt-0.5 shrink-0"></i>
        <div>
          <strong class="font-bold block text-rose-100">⚠️ Peringatan Sasi Jelek Taun ${row.tahunSiklus}:</strong>
          <span>${row.bulanJelekWarning} (Akibat: ${row.akibatBulanJelek || 'Sasi Jelek'})</span>
        </div>
      </div>`
    : `<div class="p-2 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-xs text-emerald-300 flex items-center gap-2">
        <i class="fa-solid fa-check-circle text-emerald-400"></i>
        <span>Bebas sasi jelek taun Jawa (${row.tahunSiklus})</span>
      </div>`;

  modal.innerHTML = `
    <div class="relative w-full max-w-2xl bg-gradient-to-b from-[#121722] to-[#0B0F19] border border-prada/60 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden flex flex-col max-h-[92vh] animate-fade-in">
      <!-- HEADER MODAL -->
      <div class="flex items-center justify-between p-4 sm:p-5 border-b border-sogan-800 bg-sogan-950/80">
        <div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-prada/10 text-prada border border-prada/30">
            Rincian 17 Kolom Baku Primbon Palakrama
          </span>
          <h3 class="text-lg sm:text-xl font-cinzel font-bold text-amber-100 mt-1 flex items-center gap-2">
            <span>${row.hari} ${row.pasaran}</span>
            <span class="text-xs text-sogan-400 font-mono">· ${row.tanggalMasehi} ${row.bulanMasehi} ${row.tahunMasehi}</span>
          </h3>
          <p class="text-xs text-prada font-mono mt-0.5">${row.tanggalJawa} ${row.sasiJawa} ${row.tahunAJ} AJ (${row.tahunSiklus}, ${row.namaWindu})</p>
        </div>
        <button type="button" onclick="tutupModalRincian17Kolom()" class="w-9 h-9 rounded-full bg-sogan-900/80 hover:bg-rose-900/60 border border-sogan-700 hover:border-rose-500 text-sogan-300 hover:text-white flex items-center justify-center transition cursor-pointer" aria-label="Tutup Modal">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- BODY MODAL (Scrollable) -->
      <div class="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
        <!-- Status Akhir Card -->
        <div class="p-3.5 rounded-2xl bg-sogan-950/80 border border-sogan-800 space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-[11px] font-mono uppercase tracking-wider text-sogan-300">Kesimpulan Status:</span>
            ${badgeStatusModal}
          </div>
          <p class="text-xs text-sogan-200 leading-relaxed font-sans bg-keraton/70 p-2.5 rounded-xl border border-sogan-800/80">${row.keteranganDina}</p>
        </div>

        <!-- Peringatan Sasi Jelek Taun -->
        ${badgeBulanJelek}

        <!-- 17 Kolom Lengkap Grid -->
        <div class="space-y-2">
          <h4 class="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 border-b border-sogan-800/80 pb-1.5">
            <i class="fa-solid fa-table-list text-prada"></i>
            <span>Daftar 17 Parameter Resmi Kalkulasi:</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">1. Tahun Masehi:</span>
              <strong class="text-amber-100 font-mono text-sm">${row.tahunMasehi}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">2. Tanggal Masehi:</span>
              <strong class="text-amber-200 font-mono text-sm">${row.tanggalMasehi}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">3. Bulan Masehi:</span>
              <strong class="text-amber-100">${row.bulanMasehi}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">4. Tahun Jawa (Windu & Kurup):</span>
              <strong class="text-prada">${row.tahunJawa}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">5. Tanggal Jawa (1 s.d. 30):</span>
              <strong class="text-amber-200 font-mono text-sm">${row.tanggalJawa}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">6. Pakarti Tanggal Jawa:</span>
              <strong class="text-amber-100">${row.pakartiTanggalJawa}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">7. Keterangan Pakarti Tanggal:</span>
              <strong class="${row.keteranganPakartiTanggalJawa === 'Becik' ? 'text-emerald-300' : 'text-rose-300'}">${row.keteranganPakartiTanggalJawa}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">8. Sasi Jawa:</span>
              <strong class="text-amber-100">${row.sasiJawa}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">9. Pakarti Sasi Kanggo Manten:</span>
              <strong class="text-amber-100 block">${row.pakartiSasiJawaKanggoManten}</strong>
              <span class="text-[10px] text-sogan-400">Status Tegese: <strong class="${row.statusSasiManten === 'Becik' ? 'text-emerald-300' : (row.statusSasiManten === 'Netral' ? 'text-amber-300' : 'text-rose-300')}">${row.statusSasiManten}</strong></span>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">10. Hari (Dina):</span>
              <strong class="text-amber-100">${row.hari}</strong>
              <span class="text-[10px] text-sogan-400 font-mono">(Neptu: ${row.neptuDina})</span>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">11. Pasaran:</span>
              <strong class="text-amber-200">${row.pasaran}</strong>
              <span class="text-[10px] text-sogan-400 font-mono">(Neptu: ${row.neptuPasaran})</span>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">12. Neptu Dina Pasaran:</span>
              <strong class="text-prada font-mono text-base">${row.neptuDinaPasaran}</strong>
              <span class="text-[10px] text-sogan-400 font-mono">(${row.neptuDina} + ${row.neptuPasaran})</span>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">13. Pasatuan Manten (Modulo 6):</span>
              <strong class="${row.statusPasatuanManten === 'Becik' ? 'text-emerald-300' : 'text-rose-300'}">${row.pasatuanManten}</strong>
              <span class="text-[10px] text-sogan-400 font-mono">(Sisa: ${row.neptuDinaPasaran % 6})</span>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">14. Tegese Pasatuan:</span>
              <strong class="text-amber-100">${row.tegesePasatuanManten}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">15. Wuku:</span>
              <strong class="text-amber-200">${row.wuku}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1">
              <span class="text-[10.5px] font-mono text-sogan-400 block">16. Pakarti Wuku Kanggo Ijab:</span>
              <strong class="${row.pakartiWuku === 'Becik' ? 'text-emerald-300' : (row.pakartiWuku === 'Ala' ? 'text-rose-300' : 'text-sogan-200')}">${row.pakartiWuku}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-keraton/70 border border-sogan-800/80 space-y-1 sm:col-span-2">
              <span class="text-[10.5px] font-mono text-sogan-400 block">17. Keterangan Dina Lengkap:</span>
              <p class="text-sogan-200 text-xs leading-relaxed">${row.keteranganDina}</p>
            </div>
          </div>
        </div>

        <!-- Penanda Kalender Khusus -->
        <div class="p-3 rounded-2xl bg-sogan-950/70 border border-sogan-800 space-y-2">
          <span class="text-[10.5px] font-mono uppercase tracking-wider text-sogan-300 block">Penanda Kalender Khusus:</span>
          <div class="flex items-center gap-2 flex-wrap">
            ${badgeDinaWarna}
            ${badgeGede}
          </div>
        </div>
      </div>

      <!-- FOOTER MODAL -->
      <div class="p-4 sm:p-5 border-t border-sogan-800 bg-sogan-950/90 flex items-center justify-between gap-3">
        <button type="button" onclick="tutupModalRincian17Kolom()" class="px-4 py-2 rounded-xl bg-sogan-900 hover:bg-sogan-800 border border-sogan-700 text-sogan-300 hover:text-white text-xs font-semibold transition cursor-pointer">
          Tutup Rincian
        </button>
        <button type="button" onclick="tutupModalRincian17Kolom(); bukaSimulasiIjabTanggal('${row.isoDate}');" class="px-4 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-1.5">
          <i class="fa-solid fa-ring text-[11px]"></i>
          <span>Buka di Petung Ijab</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function tutupModalRincian17Kolom() {
  const modal = document.getElementById('modalDetail17KolomManten');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}


// Window Bindings untuk pemanggilan inline HTML
if (typeof window !== 'undefined') {
  window.initKalenderMantenUI = initKalenderMantenUI;
  window.setKalenderPresetRange = setKalenderPresetRange;
  window.terapkanKalenderKustom = terapkanKalenderKustom;
  window.setFilterStatus = setFilterStatus;
  window.onFilterCheckboxChange = onFilterCheckboxChange;
  window.resetSemuaFilter = resetSemuaFilter;
  window.pindahHalamanKalender = pindahHalamanKalender;
  window.unduhKalenderHariBaikCsv = unduhKalenderHariBaikCsv;
  window.cetakKalenderHariBaik = cetakKalenderHariBaik;
  window.bukaSimulasiIjabTanggal = bukaSimulasiIjabTanggal;
  window.bukaModalRincian17Kolom = bukaModalRincian17Kolom;
  window.tutupModalRincian17Kolom = tutupModalRincian17Kolom;

  // Tutup modal jika tombol Escape ditekan
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tutupModalRincian17Kolom();
    }
  });
}
