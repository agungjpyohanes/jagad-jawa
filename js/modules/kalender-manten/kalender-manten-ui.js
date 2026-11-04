/**
 * Jagad Jawa — Controller UI: Kalender Hari Baik Pernikahan (Palakrama)
 * 
 * Pengendali DOM untuk tabel interaktif pencarian dan pemetaan hari baik
 * pernikahan berdasarkan rentang tanggal Masehi dengan 17 kolom kalkulasi,
 * penanda kalender khusus (Dina Gede, Dina Ijo, Dina Abang, Bulan Jelek),
 * filter real-time, dan ekspor CSV.
 */

import {
  generateKalenderHariBaikRange,
  saringBarisKalender,
  exportKalenderMantenToCsv
} from './kalender-manten-engine.js';
import { showToast } from '../../ui/toast.js';

let activeRows = [];
let filteredRows = [];

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

/**
 * Inisialisasi awal UI Kalender Hari Baik Pernikahan
 */
export function initKalenderMantenUI() {
  const container = document.getElementById('tab-hari-baik-pernikahan');
  if (!container) return;

  // Set default dates: hari ini s.d. 3 bulan ke depan
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const startStr = formatDateToIso(today);
  const endStr = formatDateToIso(threeMonthsLater);

  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (inputStart && !inputStart.value) inputStart.value = startStr;
  if (inputEnd && !inputEnd.value) inputEnd.value = endStr;

  currentFilters.startDate = inputStart ? inputStart.value : startStr;
  currentFilters.endDate = inputEnd ? inputEnd.value : endStr;

  // Muat data dan render
  muatDanHitungKalender();
}

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

  muatDanHitungKalender();
  showToast(`Rentang tanggal disetel: ${months} bulan kedepan.`);
}

/**
 * Handler ketika tombol atau input tanggal diubah
 */
export function onKalenderDateChange() {
  const inputStart = document.getElementById('kmStartDate');
  const inputEnd = document.getElementById('kmEndDate');

  if (!inputStart?.value || !inputEnd?.value) {
    showToast('Pilih tanggal awal dan akhir terlebih dahulu.');
    return;
  }

  if (new Date(inputStart.value) > new Date(inputEnd.value)) {
    showToast('Tanggal awal tidak boleh melewati tanggal akhir.');
    return;
  }

  currentFilters.startDate = inputStart.value;
  currentFilters.endDate = inputEnd.value;

  muatDanHitungKalender();
}

/**
 * Handler untuk filter cepat status hari baik
 */
export function setFilterStatus(status) {
  currentFilters.status = status;
  currentPage = 1;

  // Update visual tab filter tombol
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
 * Handler filter checkbox (Dina Ijo, Bebas Bulan Jelek, Weekend)
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
 * Muat data dari Engine dan hitung rentang tanggal
 */
function muatDanHitungKalender() {
  if (!currentFilters.startDate || !currentFilters.endDate) return;

  try {
    activeRows = generateKalenderHariBaikRange(currentFilters.startDate, currentFilters.endDate);
    currentPage = 1;
    terapkanFilterDanRender();
  } catch (err) {
    console.error('Error kalkulasi Kalender Hari Baik:', err);
    showToast('Gagal menghitung kalender: ' + err.message);
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

  // Deteksi info tahun & kurup periode
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
function renderTabelKalender() {
  const container = document.getElementById('kmTableContainer');
  const countEl = document.getElementById('kmFilteredCount');
  if (countEl) countEl.textContent = `${filteredRows.length} hari ditampilkan (dari total ${activeRows.length})`;

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

  // Buat HTML Tabel 17 Kolom Lengkap
  let rowsHtml = '';
  pagedRows.forEach((row, idx) => {
    const isHighlightBecik = row.statusAkhir === 'Becik Sanget';
    const isRowAla = row.statusAkhir === 'Ala / Pantangan';

    let rowClass = 'hover:bg-sogan-950/60 transition-colors border-b border-sogan-800/60 text-xs';
    if (isHighlightBecik) {
      rowClass += ' bg-emerald-950/20';
    } else if (isRowAla) {
      rowClass += ' bg-rose-950/10 opacity-90';
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
      ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">Becik</span>`
      : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">Ala</span>`;

    // Badge Sasi Kanggo Manten
    const badgeSasiManten = row.statusSasiManten === 'Becik'
      ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">Becik</span>`
      : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700/60">Ala</span>`;

    // Badge Pasatuan Manten Modulo 6
    let badgePasatuan = '';
    if (row.pasatuanManten === 'Sanggar Waringin' || row.pasatuanManten === 'Satriya Sinarajo') {
      badgePasatuan = `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-200 border border-emerald-500/60 shadow-xs">${row.pasatuanManten}</span>`;
    } else if (row.pasatuanManten === 'Nuju Pati') {
      badgePasatuan = `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-950 text-red-200 border border-red-500 shadow-xs">⛔ ${row.pasatuanManten}</span>`;
    } else {
      badgePasatuan = `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-950/70 text-amber-200 border border-amber-600/50 shadow-xs">${row.pasatuanManten}</span>`;
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
      ? `<div class="mt-1"><span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-950 text-rose-300 border border-rose-600" title="${row.bulanJelekWarning}"><i class="fa-solid fa-triangle-exclamation text-[8px] text-rose-400"></i> ${row.akibatBulanJelek || 'Sasi Jelek'}</span></div>`
      : '';

    // Status Rekomendasi Badge
    let badgeStatusAkhir = '';
    if (row.statusAkhir === 'Becik Sanget') {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-900/80 text-emerald-100 border border-emerald-500 shadow-sm"><i class="fa-solid fa-check text-[9px] text-emerald-300"></i> Becik Sanget</span>`;
    } else if (row.statusAkhir === 'Cukup Sae') {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-amber-900/60 text-amber-200 border border-amber-600/60 shadow-xs"><i class="fa-solid fa-minus text-[8px] text-amber-300"></i> Cukup Sae</span>`;
    } else {
      badgeStatusAkhir = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-950 text-rose-200 border border-rose-700 shadow-xs"><i class="fa-solid fa-ban text-[8px] text-rose-400"></i> Pantangan</span>`;
    }

    rowsHtml += `
      <tr class="${rowClass}">
        <!-- 1. Tahun Masehi -->
        <td class="px-3 py-3 font-mono font-medium text-amber-100 text-center whitespace-nowrap">${row.tahunMasehi}</td>

        <!-- 2. Tanggal Masehi -->
        <td class="px-3 py-3 font-mono font-bold text-amber-200 text-center text-sm whitespace-nowrap">${row.tanggalMasehi}</td>

        <!-- 3. Bulan Masehi -->
        <td class="px-3 py-3 text-sogan-200 whitespace-nowrap">${row.bulanMasehi}</td>

        <!-- 4. Tahun Jawa (Windu & Kurup) -->
        <td class="px-3 py-3 whitespace-nowrap">
          <div class="font-bold text-prada">${row.tahunSiklus} <span class="text-[10px] text-sogan-300 font-mono">(${row.tahunAJ} AJ)</span></div>
          <div class="text-[10px] text-sogan-400">${row.namaWindu} · ${row.kurupStr}</div>
        </td>

        <!-- 5. Tanggal Jawa -->
        <td class="px-3 py-3 font-mono font-bold text-amber-300 text-center text-sm whitespace-nowrap">${row.tanggalJawa}</td>

        <!-- 6. Pakarti Tanggal Jawa -->
        <td class="px-3 py-3 text-sogan-200 min-w-[130px]">${row.pakartiTanggalJawa}</td>

        <!-- 7. Keterangan Pakarti Tanggal Jawa -->
        <td class="px-3 py-3 text-center whitespace-nowrap">${badgePakartiTgl}</td>

        <!-- 8. Sasi Jawa -->
        <td class="px-3 py-3 whitespace-nowrap">
          <strong class="text-amber-200 font-semibold block">${row.sasiJawa}</strong>
          ${badgeBulanJelek}
        </td>

        <!-- 9. Pakarti Sasi Jawa Kanggo Manten -->
        <td class="px-3 py-3 min-w-[150px]">
          <div class="text-xs text-sogan-200">${row.pakartiSasiJawaKanggoManten}</div>
          <div class="mt-0.5">${badgeSasiManten}</div>
        </td>

        <!-- 10. Hari -->
        <td class="px-3 py-3 whitespace-nowrap">
          <strong class="text-amber-100 block font-bold">${row.hari}</strong>
          <span class="text-[10px] text-sogan-400 font-mono">Neptu: ${row.neptuDina}</span>
        </td>

        <!-- 11. Pasaran -->
        <td class="px-3 py-3 whitespace-nowrap">
          <strong class="text-amber-200 block font-bold">${row.pasaran}</strong>
          <span class="text-[10px] text-sogan-400 font-mono">Neptu: ${row.neptuPasaran}</span>
          <div class="mt-1 flex items-center gap-1 flex-wrap">
            ${badgeDinaWarna}
            ${badgeGede}
          </div>
        </td>

        <!-- 12. Neptu Dina Pasaran -->
        <td class="px-3 py-3 text-center whitespace-nowrap">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sogan-900 border border-prada/50 text-prada font-mono font-bold text-sm shadow-xs">
            ${row.neptuDinaPasaran}
          </span>
          <div class="text-[9px] text-sogan-400 mt-0.5 font-mono">${row.neptuDina}+${row.neptuPasaran}</div>
        </td>

        <!-- 13. Pasatuan Manten Miturut Neptu Pasaran -->
        <td class="px-3 py-3 whitespace-nowrap">
          ${badgePasatuan}
          <div class="text-[9.5px] text-sogan-400 font-mono mt-0.5">Sisa: ${row.neptuDinaPasaran % 6}</div>
        </td>

        <!-- 14. Tegese Pasatuan Manten -->
        <td class="px-3 py-3 text-sogan-200 min-w-[130px] font-medium">${row.tegesePasatuanManten}</td>

        <!-- 15. Wuku -->
        <td class="px-3 py-3 font-semibold text-amber-200 whitespace-nowrap">${row.wuku}</td>

        <!-- 16. Pakarti Wuku -->
        <td class="px-3 py-3 text-center whitespace-nowrap">${badgeWuku}</td>

        <!-- 17. Keterangan Dina & Aksi -->
        <td class="px-4 py-3 min-w-[280px]">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            ${badgeStatusAkhir}
            <button type="button" onclick="bukaSimulasiIjabTanggal('${row.isoDate}')" class="px-2 py-0.5 rounded bg-sogan-900 hover:bg-prada hover:text-keraton text-prada border border-prada/40 text-[10px] font-semibold transition cursor-pointer shrink-0" title="Buka perhitungan Petung Ijab untuk tanggal ini">
              <i class="fa-solid fa-ring text-[9px] mr-1"></i> Ijab
            </button>
          </div>
          <p class="text-[11px] text-sogan-300 leading-relaxed font-sans">${row.keteranganDina}</p>
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
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">1. Thn Masehi</th>
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">2. Tgl Masehi</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">3. Bln Masehi</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">4. Tahun Jawa (Windu & Kurup)</th>
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">5. Tgl Jawa</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">6. Pakarti Tgl Jawa</th>
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">7. Ket Pakarti</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">8. Sasi Jawa</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">9. Pakarti Sasi Manten</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">10. Hari</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">11. Pasaran</th>
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">12. Neptu Dina Pasaran</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">13. Pasatuan Manten (Mod 6)</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">14. Tegese Pasatuan</th>
            <th class="px-3 py-3 border-r border-sogan-800/80">15. Wuku</th>
            <th class="px-3 py-3 text-center border-r border-sogan-800/80">16. Pakarti Wuku</th>
            <th class="px-4 py-3">17. Keterangan Dina</th>
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
 * Cetak tabel kalender
 */
export function cetakKalenderHariBaik() {
  window.print();
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
