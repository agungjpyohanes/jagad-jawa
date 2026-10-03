/**
 * Jagad Jawa — Modul Domain: Kalender UI (Enhanced Tahap 2)
 * Pengendali DOM untuk Tampilan Kalender Sultan Agungan,
 * Filter Cerdas (Dino Ijo, Dino Gede, Bookmark), Modal Detail Tanggal Terpadu
 * dengan Pranata Mangsa Agraris, Sistem Bookmark LocalStorage, dan Ekspor Laporan.
 */

import {
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  BULAN_JAWA,
  WUKU,
  DUNUNGE,
  GRID,
  KETERANGAN,
  KETERANGAN_MAP,
  EPOCH_JDN,
  toJDN,
  getDayInfo,
  getTanggalJawaLengkap,
  getLiburNasional,
  getDaysInMonth,
  checkDinoGede,
  getDinoWarnaStatus,
  getKeteranganKodeDetail,
  getPranataMangsaLengkap
} from './kalender-engine.js';

import {
  getBookmarks,
  getBookmarkByDate,
  saveBookmark,
  deleteBookmark,
  KATEGORI_BOOKMARK,
  normalizeDateKey
} from './bookmark-service.js';

import { openWetonShareModal } from './share-card.js';
import { showToast } from '../../ui/toast.js';
import { illustrationPath } from '../../data/dewa-kanon.js';
import { getPetungTetanen } from '../../data/petung-tetanen-db.js';
import { getWukuPetenget } from '../../data/wuku-petenget-db.js';
import { downloadCanvasAsPng } from '../../ui/download-helper.js';
import { getLanguage, getBilingualText, t } from '../../ui/i18n.js';
import { loadDomainData } from '../../services/dbLoader.js';

let currentFilterType = 'all';

export function initKalenderSelects() {
  loadDomainData('kalender').catch((err) => {
    console.warn('[kalender-ui] loadDomainData fallback:', err);
  });

  const sel = document.getElementById('bulanSel');
  if (!sel) return;
  sel.innerHTML = BULAN_MASEHI.map((b, i) => `<option value="${i + 1}">${b}</option>`).join('');
  const now = new Date();
  sel.value = now.getMonth() + 1;
  const tahunInput = document.getElementById('tahunInput');
  if (tahunInput) tahunInput.value = now.getFullYear();

  const kbox = document.getElementById('keteranganKodeBox');
  if (kbox && kbox.children.length === 0) {
    kbox.innerHTML = KETERANGAN.map(([k, v]) => `<div><b class="text-prada font-mono">${k}</b>: ${v}</div>`).join('');
  }
}

/**
 * Reset kalender ke bulan dan tahun aktif saat ini (Current Date / Today)
 */
export function resetKalenderToday() {
  if (typeof document === 'undefined') return;
  const now = new Date();
  const selBulan = document.getElementById('bulanSel');
  const inpTahun = document.getElementById('tahunInput');
  if (selBulan) selBulan.value = now.getMonth() + 1;
  if (inpTahun) inpTahun.value = now.getFullYear();
  renderKalender();
  if (typeof showToast === 'function') {
    showToast('Kalender kasil kabikak malih ing sasi & dinten saiki ✨');
  }
}

export function buildWatermarkKalender() {
  const layer = document.getElementById('calWatermark');
  if (!layer || layer.children.length > 0) return;
  const frag = document.createDocumentFragment();
  const cols = 10, rows = 12;
  const stepX = 140, stepY = 70;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = document.createElement('span');
      s.textContent = 'JAGAD JAWA';
      s.style.left = (c * stepX - stepY) + 'px';
      s.style.top = (r * stepY) + 'px';
      frag.appendChild(s);
    }
  }
  layer.appendChild(frag);
}

export function renderKalender() {
  const selBulan = document.getElementById('bulanSel');
  const inpTahun = document.getElementById('tahunInput');
  const bulan = parseInt(selBulan?.value || (new Date().getMonth() + 1));
  const tahun = parseInt(inpTahun?.value || new Date().getFullYear());

  const daysInMonth = getDaysInMonth(tahun, bulan);
  const firstJDN = toJDN(tahun, bulan, 1);
  const firstWeekday = (firstJDN + 1) % 7; // 0 = Minggu ... 6 = Sabtu
  const gridStartJDN = firstJDN - firstWeekday;
  const totalDays = firstWeekday + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const janInfo = getDayInfo(tahun, 1, 1);
  const cornerHijriYear = janInfo.hijri[2];

  const printTitleEl = document.getElementById('printTitleKalender');
  if (printTitleEl) {
    printTitleEl.textContent =
      BULAN_MASEHI[bulan - 1].toUpperCase() + ' ' + tahun + '  ·  ' + cornerHijriYear + ' H — Jagad Jawa';
  }

  const htmlBuffer = [];

  htmlBuffer.push(`
    <tr class="bg-gradient-to-r from-[#2a3660] via-[#1b2540] to-[#12192c] text-paper text-white text-center font-bold">
      <td class="p-3 text-prada font-mono text-sm">${tahun}</td>
      <td colspan="7" class="p-3 font-marcellus text-xl tracking-wider text-prada">${BULAN_MASEHI[bulan - 1].toUpperCase()}</td>
      <td class="p-3 text-prada font-mono text-sm">${cornerHijriYear} H</td>
    </tr>
    <tr class="bg-[#dfd1ac] font-bold text-center text-[11px] border-b-2 border-prada">
      <td class="p-2 text-sogan-900 font-serif">WUKU</td>
  `);

  for (let i = 0; i < 7; i++) {
    const isMinggu = (i === 0);
    htmlBuffer.push(`
      <td class="p-2 ${isMinggu ? 'text-[#dc2626] font-black' : 'text-sogan-900'}">
        ${HARI[i].toUpperCase()} <span class="bg-black/10 px-1 py-0.5 rounded font-mono text-[10px] ml-1 text-sogan-900">${NEPTU_HARI[i]}</span>
      </td>
    `);
  }

  htmlBuffer.push(`<td class="p-2 text-sogan-900 font-serif">WUKU &amp; SASI</td></tr>`);

  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);
    const wukuName = WUKU[wukuId].toUpperCase();

    htmlBuffer.push(`
      <tr class="hover:bg-amber-500/5 transition duration-150">
        <td class="wuku-col-cell p-2 text-center align-middle font-bold bg-[#efe4ca] text-sogan-900 border-r border-[#c2b280] select-none">
          <div class="font-serif text-[11px] tracking-wider text-sogan-950">${wukuName}</div>
          <div class="text-[9px] text-[#552e16] font-mono mt-0.5">${wukuId + 1}/30</div>
          <div class="text-[8.5px] text-amber-900 mt-0.5">${DUNUNGE[wukuId]}</div>
          ${isNgisor ? '<div class="text-[8px] font-bold text-red-600 uppercase mt-0.5">⚠️ Ngisor</div>' : ''}
        </td>
    `);

    let sasiSpanText = '';

    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const curDiff = currentJDN - EPOCH_JDN;
      const pasaranId = (((curDiff + 1) % 5) + 5) % 5;
      const dayOffset = currentJDN - firstJDN;
      const dayNum = dayOffset + 1;
      const inMonth = (dayNum >= 1 && dayNum <= daysInMonth);

      const [code, color, gedeFlag] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ['', 'G', 0];

      if (!inMonth) {
        htmlBuffer.push(`
          <td class="h-28 p-1.5 align-top border border-dashed border-[#e2d5b8] bg-black/10 select-none opacity-40">
            <div class="text-[10px] text-sogan-400/50 font-mono text-right">-</div>
          </td>
        `);
      } else {
        const dateObj = getTanggalJawaLengkap(tahun, bulan, dayNum);
        const liburName = getLiburNasional(tahun, bulan, dayNum);
        const isMinggu = (d === 0);
        const isLibur = Boolean(liburName) || isMinggu;

        const info = getDayInfo(tahun, bulan, dayNum);
        const isDinoGedeRes = checkDinoGede(wukuId, d, pasaranId, info.hijri[0], info.hijri[1]);
        const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[pasaranId], WUKU[wukuId], isMinggu, isLibur, code);

        // Bookmark Check
        const dateKey = `${tahun}-${String(bulan).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const bookmark = getBookmarkByDate(dateKey);
        const isBookmarked = Boolean(bookmark);

        if (!sasiSpanText) {
          sasiSpanText = `${dateObj.bulanJawa} ${dateObj.tahunAJ} AJ`;
        }

        const today = new Date();
        const isToday = (today.getFullYear() === tahun && today.getMonth() + 1 === bulan && today.getDate() === dayNum);

        htmlBuffer.push(`
          <td class="cal-day-cell h-24 sm:h-28 p-1.5 align-top border ${dinoWarna.cellBorder} relative cursor-pointer group transition-all duration-200 hover:z-10 hover:shadow-[0_0_14px_rgba(212,175,55,0.35)] hover:border-prada"
              style="background-color: ${dinoWarna.cellBg}; ${dinoWarna.cellBorderStyle}"
              onclick="window.bukaDetailTanggalJawa(${tahun}, ${bulan}, ${dayNum})"
              data-day="${dayNum}" data-is-ijo="${dinoWarna.isIjo}" data-is-gede="${dinoWarna.isGede}" data-is-bookmarked="${isBookmarked}">
            
            ${isToday ? '<div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-prada to-amber-400 animate-pulse"></div>' : ''}
            
            <div class="flex justify-between items-start mb-0.5">
              <div class="flex items-center gap-1">
                <span class="font-mono text-sm font-bold ${isLibur ? 'text-rose-600 font-extrabold' : 'text-sogan-950'}">
                  ${dayNum}
                </span>
                ${liburName ? `<span class="inline-block w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" title="${liburName}"></span>` : ''}
              </div>
              <div class="flex flex-col items-end gap-0.5">
                ${dinoWarna.badgeHtml}
                ${isBookmarked ? `<span class="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold bg-amber-600 text-white shadow-xs" title="${bookmark.catatan || 'Tanggal Ditandai'}">🔖</span>` : ''}
              </div>
            </div>

            <div class="text-center my-3 sm:my-4">
              <span class="font-serif font-bold text-xs sm:text-sm text-sogan-950 tracking-wider block">${PASARAN[pasaranId]}</span>
            </div>

            <div class="absolute inset-x-0 bottom-0 px-1 py-0.5 text-[9px] font-semibold text-center truncate ${dinoWarna.bottomBgClass}"
                 style="background-color: ${dinoWarna.bottomBg}; color: ${dinoWarna.bottomTextColor};">
              ${dateObj.tglJawa} ${dateObj.bulanJawa}
            </div>
          </td>
        `);
      }
    }

    htmlBuffer.push(`
        <td class="wuku-col-cell p-2 text-center align-middle font-bold bg-[#efe4ca] text-sogan-900 border-l border-[#c2b280] select-none">
          <div class="font-serif text-[11px] text-sogan-950">${wukuName}</div>
          <div class="text-[9px] text-[#724117] font-sans mt-0.5 font-bold">${sasiSpanText}</div>
        </td>
      </tr>
    `);
  }

  const tableBody = document.getElementById('kalenderTableBody') || document.getElementById('calTable');
  if (tableBody) {
    tableBody.innerHTML = htmlBuffer.join('');
  }

  // Render Mode List Minggu (Weekly View untuk Mobile & Tablet)
  renderKalenderListView(tahun, bulan, daysInMonth, totalWeeks, gridStartJDN, firstJDN);

  buildWatermarkKalender();
  setKalenderViewMode(currentViewMode);
  applyFilterKalenderUI(currentFilterType);
  renderBookmarkListPanel();
}

let currentViewMode = 'grid';

/**
 * Mengatur mode tampilan kalender: 'grid' (Tabel Bulanan) atau 'list' (List Minggu)
 * @param {'grid'|'list'} mode 
 */
export function setKalenderViewMode(mode) {
  currentViewMode = (mode === 'list') ? 'list' : 'grid';

  const tableContainer = document.getElementById('kalenderTableContainer') || document.getElementById('calTable')?.parentElement;
  const listView = document.getElementById('kalenderListView');
  const btnGrid = document.getElementById('btnCalModeGrid');
  const btnList = document.getElementById('btnCalModeList');

  if (currentViewMode === 'list') {
    if (tableContainer) tableContainer.classList.add('hidden');
    if (listView) listView.classList.remove('hidden');
    if (btnList) {
      btnList.className = 'cal-view-btn px-3 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md text-xs transition flex items-center gap-1.5 cursor-pointer';
    }
    if (btnGrid) {
      btnGrid.className = 'cal-view-btn px-3 py-1.5 rounded-lg bg-sogan-900/80 text-sogan-200 hover:text-prada border border-sogan-800 text-xs transition flex items-center gap-1.5 cursor-pointer';
    }
  } else {
    if (tableContainer) tableContainer.classList.remove('hidden');
    if (listView) listView.classList.add('hidden');
    if (btnGrid) {
      btnGrid.className = 'cal-view-btn px-3 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md text-xs transition flex items-center gap-1.5 cursor-pointer';
    }
    if (btnList) {
      btnList.className = 'cal-view-btn px-3 py-1.5 rounded-lg bg-sogan-900/80 text-sogan-200 hover:text-prada border border-sogan-800 text-xs transition flex items-center gap-1.5 cursor-pointer';
    }
  }

  applyFilterKalenderUI(currentFilterType);
}

/**
 * Toggle antara Mode Tabel Grid dan Mode List Minggu
 */
export function toggleKalenderViewMode() {
  setKalenderViewMode(currentViewMode === 'grid' ? 'list' : 'grid');
}

/**
 * Render Kalender Sultan Agungan dalam Format List Minggu (Sangat nyaman untuk layar smartphone/mobile)
 */
export function renderKalenderListView(tahun, bulan, daysInMonth, totalWeeks, gridStartJDN, firstJDN) {
  const container = document.getElementById('kalenderListView');
  if (!container) return;

  const listBuffer = [];

  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);
    const wukuName = WUKU[wukuId].toUpperCase();

    // Kumpulkan hari-hari yang valid dalam bulan ini
    const validDaysInWeek = [];
    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const dayOffset = currentJDN - firstJDN;
      const dayNum = dayOffset + 1;
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        validDaysInWeek.push({ d, dayNum, currentJDN });
      }
    }

    if (validDaysInWeek.length === 0) continue;

    const firstValidDay = validDaysInWeek[0];
    const firstDateObj = getTanggalJawaLengkap(tahun, bulan, firstValidDay.dayNum);
    const sasiSpanText = `${firstDateObj.bulanJawa} ${firstDateObj.tahunAJ} AJ`;

    listBuffer.push(`
      <div class="cal-week-card">
        <div class="flex flex-wrap items-center justify-between pb-2.5 mb-2.5 border-b border-sogan-800/80 gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="w-6 h-6 rounded-lg bg-sogan-900 border border-prada/40 flex items-center justify-center text-prada font-mono text-xs font-bold shadow-xs">
              ${w + 1}
            </span>
            <div>
              <span class="font-serif font-bold text-amber-200 text-sm tracking-wide">Wuku ${wukuName}</span>
              <span class="text-[10px] text-sogan-400 font-mono ml-1.5">(${wukuId + 1}/30 · ${DUNUNGE[wukuId]})</span>
            </div>
            ${isNgisor ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 border border-rose-500 text-rose-300">⚠️ Sirikan Ngisor</span>' : ''}
          </div>
          <div class="text-[11px] font-mono text-prada font-semibold">
            ${sasiSpanText}
          </div>
        </div>

        <div class="space-y-1.5">
    `);

    for (const { d, dayNum, currentJDN } of validDaysInWeek) {
      const curDiff = currentJDN - EPOCH_JDN;
      const pasaranId = (((curDiff + 1) % 5) + 5) % 5;
      const [code] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ['', 'G', 0];
      const liburName = getLiburNasional(tahun, bulan, dayNum);
      const isMinggu = (d === 0);
      const isLibur = Boolean(liburName) || isMinggu;
      const dateObj = getTanggalJawaLengkap(tahun, bulan, dayNum);
      const info = getDayInfo(tahun, bulan, dayNum);
      const isDinoGedeRes = checkDinoGede(wukuId, d, pasaranId, info.hijri[0], info.hijri[1]);
      const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[pasaranId], WUKU[wukuId], isMinggu, isLibur, code);

      const dateKey = `${tahun}-${String(bulan).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const bookmark = getBookmarkByDate(dateKey);
      const isBookmarked = Boolean(bookmark);

      const today = new Date();
      const isToday = (today.getFullYear() === tahun && today.getMonth() + 1 === bulan && today.getDate() === dayNum);

      listBuffer.push(`
        <div class="cal-day-list-item bg-keraton/90 border ${isToday ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-sogan-800/70'} hover:border-prada/60"
             onclick="window.bukaDetailTanggalJawa(${tahun}, ${bulan}, ${dayNum})"
             data-day="${dayNum}" data-is-ijo="${dinoWarna.isIjo}" data-is-gede="${dinoWarna.isGede}" data-is-bookmarked="${isBookmarked}">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 text-center flex-shrink-0">
              <span class="font-mono text-base font-black ${isLibur ? 'text-rose-400' : 'text-amber-100'}">
                ${dayNum}
              </span>
              <div class="text-[9px] font-mono uppercase ${isLibur ? 'text-rose-400' : 'text-sogan-400'}">
                ${HARI[d].slice(0, 3)}
              </div>
            </div>

            <div class="border-l border-sogan-800/80 pl-3 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-serif font-bold text-xs text-amber-200">${HARI[d]} ${PASARAN[pasaranId]}</span>
                <span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] bg-sogan-950 border border-sogan-800 text-sogan-300">Neptu ${NEPTU_HARI[d] + NEPTU_PASARAN[pasaranId]}</span>
              </div>
              <div class="text-[10px] text-sogan-400 flex items-center gap-2 mt-0.5">
                <span>${dateObj.tglJawa} ${dateObj.bulanJawa}</span>
                ${liburName ? `<span class="text-rose-300 font-bold truncate">★ ${liburName}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 ml-2">
            ${dinoWarna.badgeHtml}
            ${isBookmarked ? '<span class="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-amber-600 text-white shadow-xs">🔖</span>' : ''}
            <i class="fa-solid fa-chevron-right text-sogan-500 text-xs ml-1"></i>
          </div>
        </div>
      `);
    }

    listBuffer.push(`
        </div>
      </div>
    `);
  }

  container.innerHTML = listBuffer.join('');
}

/**
 * Filter Kalender Cerdas: Memfilter tampilan sel hari berdasarkan kriteria
 * @param {'all'|'ijo'|'gede'|'bookmark'} filterType 
 */
export function filterKalender(filterType) {
  currentFilterType = filterType;
  applyFilterKalenderUI(filterType);
}

function applyFilterKalenderUI(filterType) {
  // Update state tombol filter
  document.querySelectorAll('.cal-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filterType) {
      btn.className = 'cal-filter-btn px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md text-xs transition';
    } else {
      btn.className = 'cal-filter-btn px-3.5 py-1.5 rounded-lg bg-sogan-900/80 text-sogan-200 hover:text-prada border border-sogan-800 text-xs transition';
    }
  });

  // 1. Filter pada Mode Grid
  const cells = document.querySelectorAll('.cal-day-cell');
  cells.forEach(cell => {
    const isIjo = cell.getAttribute('data-is-ijo') === 'true';
    const isGede = cell.getAttribute('data-is-gede') === 'true';
    const isBookmarked = cell.getAttribute('data-is-bookmarked') === 'true';

    let match = true;
    if (filterType === 'ijo') match = isIjo;
    else if (filterType === 'gede') match = isGede;
    else if (filterType === 'bookmark') match = isBookmarked;

    if (match) {
      cell.style.opacity = '1';
      cell.style.filter = 'none';
      if (filterType !== 'all') {
        cell.classList.add('ring-2', 'ring-amber-400/80');
      } else {
        cell.classList.remove('ring-2', 'ring-amber-400/80');
      }
    } else {
      cell.style.opacity = '0.22';
      cell.style.filter = 'grayscale(85%)';
      cell.classList.remove('ring-2', 'ring-amber-400/80');
    }
  });

  // 2. Filter pada Mode List Minggu
  const listItems = document.querySelectorAll('.cal-day-list-item');
  listItems.forEach(item => {
    const isIjo = item.getAttribute('data-is-ijo') === 'true';
    const isGede = item.getAttribute('data-is-gede') === 'true';
    const isBookmarked = item.getAttribute('data-is-bookmarked') === 'true';

    let match = true;
    if (filterType === 'ijo') match = isIjo;
    else if (filterType === 'gede') match = isGede;
    else if (filterType === 'bookmark') match = isBookmarked;

    if (match) {
      item.style.display = 'flex';
      item.style.opacity = '1';
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Render Panel Daftar Tanggal Ditandhai (Bookmark) di bawah kalender
 */
export function renderBookmarkListPanel() {
  const container = document.getElementById('bookmarkListContainer');
  if (!container) return;

  const list = getBookmarks();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-sogan-950/40 border border-sogan-800 text-center text-sogan-400 text-xs italic">
        Dereng wonten tanggal wigati ingkang dipun tandhai. Mangga klik tanggal ing kalender kanggé nyimpen catatan wiyosan, mantu, utawi hajat.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      ${list.map(item => {
        const catInfo = KATEGORI_BOOKMARK.find(c => c.id === item.kategori) || KATEGORI_BOOKMARK[5];
        return `
          <div class="p-3 rounded-xl bg-keraton border border-sogan-800 hover:border-prada/60 transition flex items-start justify-between gap-2 text-xs">
            <div class="space-y-1">
              <span class="text-[9px] uppercase font-bold ${catInfo.color} flex items-center gap-1">
                <i class="fa-solid ${catInfo.icon}"></i> ${catInfo.label}
              </span>
              <div class="font-marcellus text-sm font-bold text-prada cursor-pointer hover:underline" onclick="window.bukaDetailTanggalJawa(${item.y}, ${item.m}, ${item.d})">
                ${item.weton || `${item.d}/${item.m}/${item.y}`}
              </div>
              <div class="text-[10px] text-sogan-400 font-mono">${item.d} ${BULAN_MASEHI[item.m - 1] || ''} ${item.y}</div>
              ${item.catatan ? `<p class="text-[11px] text-sogan-200 line-clamp-2 mt-0.5">${item.catatan}</p>` : ''}
            </div>
            <button onclick="window.hapusBookmarkTanggal('${item.dateStr}')" class="text-sogan-400 hover:text-rose-400 p-1.5 transition" title="Hapus catatan">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Membuka Modal Detail Tanggal Jawa Terpadu dengan Pranata Mangsa Agraris
 */
export function bukaDetailTanggalJawa(y, m, d) {
  const modal = document.getElementById('modalDetailKalender');
  if (!modal) return;

  const info = getDayInfo(y, m, d);
  const tglJawa = getTanggalJawaLengkap(y, m, d);
  const liburName = getLiburNasional(y, m, d);
  const pm = getPranataMangsaLengkap(d, m);

  const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const bookmark = getBookmarkByDate(dateKey);

  // 1. Tanggal Masehi
  const elTglMasehi = document.getElementById('modalTglMasehi');
  if (elTglMasehi) {
    elTglMasehi.textContent = `${d} ${BULAN_MASEHI[m - 1]} ${y}`;
  }

  // 2. Libur Nasional
  const elLiburBox = document.getElementById('modalLiburBox');
  const elLiburText = document.getElementById('modalLiburText');
  if (elLiburBox && elLiburText) {
    if (liburName) {
      elLiburBox.style.display = 'block';
      elLiburText.textContent = liburName;
    } else {
      elLiburBox.style.display = 'none';
    }
  }

  // 3. Weton & Neptu
  const elWetonText = document.getElementById('modalWetonText');
  if (elWetonText) elWetonText.textContent = `${tglJawa.dino} ${tglJawa.pas}`;

  const elNeptuBadge = document.getElementById('modalNeptuBadge');
  if (elNeptuBadge) {
    elNeptuBadge.textContent = `${tglJawa.dino} (${NEPTU_HARI[info.weekdayId]}) + ${tglJawa.pas} (${NEPTU_PASARAN[info.pasaranId]}) = Neptu ${tglJawa.neptu}`;
  }

  // 4. Dino Gede Status
  const currentLang = getLanguage();
  const isJv = (currentLang === 'jv');
  const dinoGedeObj = checkDinoGede(info.wukuId, info.weekdayId, info.pasaranId, info.hijri[0], info.hijri[1]);
  const elBoxDinoGede = document.getElementById('modalBoxDinoGede');
  const elIconDinoGede = document.getElementById('modalIconDinoGede');
  const elTitleDinoGede = document.getElementById('modalTitleDinoGede');
  const elDescDinoGede = document.getElementById('modalDescDinoGede');

  if (dinoGedeObj.isGede) {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10';
    if (elIconDinoGede) elIconDinoGede.textContent = '★';
    if (elTitleDinoGede) elTitleDinoGede.textContent = isJv
      ? `DINO GEDE: ${dinoGedeObj.label.toUpperCase()}`
      : `HARI BESAR: ${dinoGedeObj.label.toUpperCase()}`;
    if (elDescDinoGede) elDescDinoGede.textContent = isJv
      ? 'Dina wigati lan sakral ing petungan pawukon & penanggalan Jawa.'
      : 'Hari penting dan sakral dalam perhitungan pawukon & penanggalan Jawa.';
  } else {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-sogan-950/60 border-sogan-800 text-sogan-400';
    if (elIconDinoGede) elIconDinoGede.textContent = '✧';
    if (elTitleDinoGede) elTitleDinoGede.textContent = isJv ? 'DINA LUMRAH' : 'HARI BIASA';
    if (elDescDinoGede) elDescDinoGede.textContent = isJv
      ? 'Boten klebet pengetan Dino Gede khusus.'
      : 'Tidak termasuk peringatan Hari Besar khusus.';
  }

  // 5. Ala / Becik Status
  const [code] = (GRID[info.wukuId] && GRID[info.wukuId][info.weekdayId]) ? GRID[info.wukuId][info.weekdayId] : ['', 'G', 0];
  const dinoWarna = getDinoWarnaStatus(tglJawa.dino, tglJawa.pas, tglJawa.wukuName, info.weekdayId === 0, Boolean(liburName), code);
  const isBecik = dinoWarna.isIjo;
  const isAla = !isBecik;
  const elBoxAlaBecik = document.getElementById('modalBoxAlaBecik');
  const elIconAlaBecik = document.getElementById('modalIconAlaBecik');
  const elTitleAlaBecik = document.getElementById('modalTitleAlaBecik');
  const elDescAlaBecik = document.getElementById('modalDescAlaBecik');

  if (isAla) {
    if (elBoxAlaBecik) elBoxAlaBecik.className = 'p-3.5 rounded-xl border flex items-center gap-3 bg-red-950/90 border-red-500 text-red-50 shadow-lg shadow-red-950/30';
    if (elIconAlaBecik) elIconAlaBecik.textContent = '▲';
    if (elTitleAlaBecik) {
      elTitleAlaBecik.className = 'font-bold text-xs uppercase tracking-wide text-red-100';
      elTitleAlaBecik.textContent = isJv
        ? `STATUS: ALA / NAHAS (▲ ${code ? code + ' Ala' : 'Ala'})`
        : `STATUS: HARI BURUK / PANTANGAN (▲ ${code ? code + ' Buruk' : 'Buruk'})`;
    }
    if (elDescAlaBecik) {
      elDescAlaBecik.className = 'text-[11px] text-red-100 mt-0.5 leading-tight font-medium';
      elDescAlaBecik.textContent = isJv
        ? 'Dina awon tumrap adeg griya, mantu, utawi lelungan tebih.'
        : 'Hari yang dihindari untuk mendirikan rumah, pernikahan, atau bepergian jauh.';
    }
  } else {
    if (elBoxAlaBecik) elBoxAlaBecik.className = 'p-3.5 rounded-xl border flex items-center gap-3 bg-emerald-950/90 border-emerald-500 text-emerald-50 shadow-lg shadow-emerald-950/30';
    if (elIconAlaBecik) elIconAlaBecik.textContent = '✓';
    if (elTitleAlaBecik) {
      elTitleAlaBecik.className = 'font-bold text-xs uppercase tracking-wide text-emerald-100';
      elTitleAlaBecik.textContent = isJv
        ? `STATUS: BECIK / RAHAYU (✓ Becik)`
        : `STATUS: HARI BAIK / RAHAYU (✓ Baik)`;
    }
    if (elDescAlaBecik) {
      elDescAlaBecik.className = 'text-[11px] text-emerald-100 mt-0.5 leading-tight font-medium';
      elDescAlaBecik.textContent = isJv
        ? 'Dina becik kanggé maneka warni hajat, lelungan, lan pakaryan.'
        : 'Hari baik untuk berbagai hajat, bepergian, dan memulai pekerjaan.';
    }
  }

  // 6. Sultan Agungan
  const elTglSasiJawa = document.getElementById('modalTglSasiJawa');
  if (elTglSasiJawa) elTglSasiJawa.textContent = `${tglJawa.tglJawa} ${tglJawa.bulanJawa}`;

  const elTahunJawa = document.getElementById('modalTahunJawa');
  if (elTahunJawa) elTahunJawa.textContent = `${tglJawa.tahunAJ} AJ (Tahun ${tglJawa.tahunSiklus})`;

  const elWindu = document.getElementById('modalWindu');
  if (elWindu) elWindu.textContent = `Windu ${tglJawa.namaWindu}`;

  const elHijriah = document.getElementById('modalHijriah');
  if (elHijriah) elHijriah.textContent = `${info.hijri[0]} ${BULAN_JAWA[info.hijri[1] - 1] || ''} ${info.hijri[2]} H`;

  // 7. Pawukon
  const elNamaWuku = document.getElementById('modalNamaWuku');
  if (elNamaWuku) elNamaWuku.textContent = `Wuku ${tglJawa.wukuName} (No. ${tglJawa.wukuNo})`;

  const elWukuThumb = document.getElementById('modalWukuThumbImg');
  const elWukuThumbWrap = document.getElementById('modalWukuThumbContainer');
  if (elWukuThumb && tglJawa?.wukuName) {
    elWukuThumb.src = illustrationPath('wuku', tglJawa.wukuName);
    elWukuThumb.alt = `Wuku ${tglJawa.wukuName}`;
    if (elWukuThumbWrap) elWukuThumbWrap.classList.remove('hidden');
  }

  const elDunungeWuku = document.getElementById('modalDunungeWuku');
  if (elDunungeWuku) elDunungeWuku.textContent = `${DUNUNGE[info.wukuId]}`;

  const isNgisor = (info.wukuId === 3 || info.wukuId === 13 || info.wukuId === 23);
  const elRingkelWuku = document.getElementById('modalRingkelWuku');
  if (elRingkelWuku) {
    elRingkelWuku.innerHTML = isNgisor ? '<span class="text-rose-400 font-bold">⚠️ Ringkel Ngisor (Sirikan)</span>' : 'Lumrah';
  }

  const pwkData = (typeof window !== 'undefined' && window.MASTER_PAWUKON) ? (window.MASTER_PAWUKON[tglJawa.wukuName] || window.MASTER_PAWUKON[tglJawa.wukuNo]) : null;
  const elDewaWuku = document.getElementById('modalDewaWuku');
  if (elDewaWuku) {
    elDewaWuku.textContent = pwkData?.dewa ? `Bathara ${pwkData.dewa}` : (pwkData?.dewanama || '-');
  }

  // 8. Seksi Pranata Mangsa Agraris Terpadu (2.1)
  const elPMCard = document.getElementById('modalPranataMangsaAgrarisCard');
  if (elPMCard) {
    elPMCard.innerHTML = `
      <div class="p-3.5 rounded-xl bg-teal-950/40 border border-teal-600/40 space-y-2">
        <div class="flex items-center justify-between border-b border-teal-800/60 pb-2">
          <span class="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-seedling"></i> Pranata Mangsa &amp; Musim Tani Tradisional
          </span>
          <span class="text-[9.5px] px-2 py-0.5 rounded bg-teal-900/80 text-teal-200 border border-teal-500/30 font-semibold font-mono">
            ${pm.musimTani}
          </span>
        </div>
        <div class="space-y-1.5 text-[11px]">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <strong class="font-serif text-sm text-prada">${pm.nama}</strong>
            <span class="text-sogan-300 font-mono text-[10px]">${pm.rentang}</span>
          </div>
          <div class="italic text-teal-200 text-[10.5px]">
            &ldquo;${pm.candrasangkala}&rdquo;
          </div>
          <div class="pt-1 border-t border-teal-900/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
            <div>
              <strong class="text-sogan-400 block text-[9.5px] uppercase">Pratandha Alam:</strong>
              <p class="text-sogan-200 mt-0.5 leading-relaxed">${pm.pratandhaAlam}</p>
            </div>
            <div>
              <strong class="text-sogan-400 block text-[9.5px] uppercase">Pakaryan &amp; Laku Tani:</strong>
              <p class="text-sogan-200 mt-0.5 leading-relaxed">${pm.pakaryanTani}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 8.1. Seksi Petung Tetanen Tradisional Berdasarkan Weton (CSV Baru)
  const elTetanenCard = document.getElementById('modalPetungTetanenCard');
  if (elTetanenCard) {
    const petungTani = getPetungTetanen(tglJawa.dino, tglJawa.pas);
    if (petungTani) {
      elTetanenCard.innerHTML = `
        <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
          <div class="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-wheat-awn"></i> Petung Tetanen &amp; Palawija (Weton ${tglJawa.dino} ${tglJawa.pas})
            </span>
            <span class="text-[9.5px] px-2 py-0.5 rounded ${petungTani.badgeClass || 'bg-emerald-900/80 text-emerald-200 border-emerald-500/30'} border font-semibold font-mono flex items-center gap-1.5">
              <i class="${petungTani.icon || 'fa-solid fa-wheat-awn'}"></i>
              <span>Kang Becik: ${petungTani.kategoriLabel} (${petungTani.kangBecik})</span>
            </span>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="text-sogan-200 leading-relaxed text-[11.5px]">
              <strong class="text-emerald-300">Makna &amp; Pituduh:</strong> ${petungTani.tegese}
            </div>
            <div class="pt-1 border-t border-emerald-900/60 text-[10.5px]">
              <strong class="text-sogan-400 block text-[9.5px] uppercase">Tuladha Tetanduran Ingkang Cocog:</strong>
              <p class="text-emerald-200 mt-0.5 leading-relaxed font-medium">${petungTani.contone}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      elTetanenCard.innerHTML = '';
    }
  }

  // 8.2. Seksi 4 Pilar Petenget Wuku (CSV Baru: Ala-Becik, Nambani, Pangupajiwa, Tetanen)
  const elWukuPetengetCard = document.getElementById('modalWukuPetengetCard');
  if (elWukuPetengetCard) {
    const wukuPetenget = getWukuPetenget(tglJawa.wukuNo);
    if (wukuPetenget) {
      elWukuPetengetCard.innerHTML = `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-sogan-950/90 via-wulung/80 to-keraton/90 border border-prada/40 space-y-3 shadow-lg">
          <div class="flex items-center justify-between border-b border-sogan-800/80 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-prada/20 border border-prada/50 flex items-center justify-center text-prada text-xs font-mono font-bold shadow-xs">
                ${tglJawa.wukuNo}
              </span>
              <span class="text-xs uppercase font-bold text-amber-300 tracking-wider">
                Petenget &amp; Pranata Wuku ${tglJawa.wukuName} (4 Pilar Nujum)
              </span>
            </div>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-sogan-900 text-prada border border-prada/30">
              Pawukon 210
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            
            <!-- 1. Ala & Becik Wuku (wuku_ala_becik.csv) -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-sky-800/40 space-y-1.5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase font-bold text-sky-300 flex items-center gap-1.5 tracking-wider">
                  <i class="fa-solid fa-scale-balanced"></i> Ala &amp; Becik Wuku
                </span>
                <span class="text-[8.5px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-700/50 text-sky-300 font-mono">Hajat Dina</span>
              </div>
              <div class="space-y-1 text-[11px]">
                <div>
                  <span class="text-emerald-400 font-medium font-mono text-[9.5px] block">✓ Kang Becik:</span>
                  <p class="text-sogan-200 leading-relaxed">${wukuPetenget.alaBecik?.becik || '-'}</p>
                </div>
                <div class="pt-1 border-t border-sogan-900/60">
                  <span class="text-rose-400 font-medium font-mono text-[9.5px] block">✗ Kang Ala (Sirikan):</span>
                  <p class="text-sogan-300 leading-relaxed">${wukuPetenget.alaBecik?.ala || '-'}</p>
                </div>
              </div>
            </div>

            <!-- 2. Nambani / Usada (wuku_nambani.csv) -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-emerald-800/40 space-y-1.5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
                  <i class="fa-solid fa-mortar-pestle"></i> Nambani (Usada &amp; Jamu)
                </span>
                <span class="text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-300 font-mono">Tamba Lara</span>
              </div>
              <div class="space-y-1 text-[11px]">
                <div>
                  <span class="text-emerald-400 font-medium font-mono text-[9.5px] block">✓ Kang Becik:</span>
                  <p class="text-sogan-200 leading-relaxed">${wukuPetenget.nambani?.becik || '-'}</p>
                </div>
                <div class="pt-1 border-t border-sogan-900/60">
                  <span class="text-rose-400 font-medium font-mono text-[9.5px] block">✗ Kang Ala (Sirikan):</span>
                  <p class="text-sogan-300 leading-relaxed">${wukuPetenget.nambani?.ala || '-'}</p>
                </div>
              </div>
            </div>

            <!-- 3. Pangupajiwa / Rejeki (wuku_pangupajiwa.csv) -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-amber-800/40 space-y-1.5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                  <i class="fa-solid fa-coins"></i> Pangupajiwa (Rejeki &amp; Usaha)
                </span>
                <span class="text-[8.5px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-700/50 text-amber-300 font-mono">Panguripan</span>
              </div>
              <div class="space-y-1 text-[11px]">
                <div>
                  <span class="text-emerald-400 font-medium font-mono text-[9.5px] block">✓ Kang Becik:</span>
                  <p class="text-sogan-200 leading-relaxed">${wukuPetenget.pangupajiwa?.becik || '-'}</p>
                </div>
                <div class="pt-1 border-t border-sogan-900/60">
                  <span class="text-rose-400 font-medium font-mono text-[9.5px] block">✗ Kang Ala (Sirikan):</span>
                  <p class="text-sogan-300 leading-relaxed">${wukuPetenget.pangupajiwa?.ala || '-'}</p>
                </div>
              </div>
            </div>

            <!-- 4. Tetanen Wuku (wuku_tetanen.csv) -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-teal-800/40 space-y-1.5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1.5 tracking-wider">
                  <i class="fa-solid fa-wheat-awn"></i> Tetanen Wuku ${tglJawa.wukuName}
                </span>
                <span class="text-[8.5px] px-1.5 py-0.5 rounded bg-teal-950 border border-teal-700/50 text-teal-300 font-mono">Tetanduran</span>
              </div>
              <div class="space-y-1 text-[11px]">
                <div>
                  <span class="text-emerald-400 font-medium font-mono text-[9.5px] block">✓ Kang Becik Ditandur:</span>
                  <p class="text-sogan-200 leading-relaxed">${wukuPetenget.tetanen?.becik || '-'}</p>
                </div>
                <div class="pt-1 border-t border-sogan-900/60">
                  <span class="text-rose-400 font-medium font-mono text-[9.5px] block">✗ Kang Ala (Sirikan):</span>
                  <p class="text-sogan-300 leading-relaxed">${wukuPetenget.tetanen?.ala || '-'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    } else {
      elWukuPetengetCard.innerHTML = '';
    }
  }

  // 9. Kode Pawukon
  const elListKode = document.getElementById('modalListKodeDetail');
  if (elListKode) {
    const kodeList = getKeteranganKodeDetail(code);
    if (kodeList.length > 0) {
      elListKode.innerHTML = kodeList.map(item => `
        <div class="p-2 rounded bg-sogan-900/80 border border-sogan-700/80">
          <strong class="text-amber-300 font-serif">${item.nama}:</strong>
          <span class="text-sogan-200 ml-1">${item.arti}</span>
        </div>
      `).join('');
    } else {
      elListKode.innerHTML = `
        <div class="p-2 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 italic">
          Dina punika boten nandhang kode sirikan tartamtu (Lega &amp; Rahayu).
        </div>
      `;
    }
  }

  // 10. Form & Status Bookmark (2.3)
  const elBookmarkSection = document.getElementById('modalBookmarkSection');
  if (elBookmarkSection) {
    const currentCat = bookmark?.kategori || 'catatan';
    const currentNote = bookmark?.catatan || '';
    elBookmarkSection.innerHTML = `
      <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-sogan-800 space-y-2.5">
        <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-bookmark text-prada"></i> Tandha Tanggal Wigati (Catatan Lokal)
          </span>
          ${bookmark ? '<span class="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold font-mono">Tersimpan</span>' : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div class="sm:col-span-4">
            <label class="text-[10px] text-sogan-400 block mb-1 font-semibold">Kategori Hajat:</label>
            <select id="modalBookmarkKategori" class="w-full bg-keraton border border-sogan-700 rounded-lg px-2.5 py-1.5 text-sogan-100 outline-none text-xs focus:border-prada">
              ${KATEGORI_BOOKMARK.map(c => `
                <option value="${c.id}" ${c.id === currentCat ? 'selected' : ''}>${c.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="sm:col-span-8">
            <label class="text-[10px] text-sogan-400 block mb-1 font-semibold">Catatan Khusus:</label>
            <input type="text" id="modalBookmarkCatatan" value="${currentNote}" placeholder="Contoh: Wiyosan anak kapisan, Mantu Mbak Sari..." class="w-full bg-keraton border border-sogan-700 rounded-lg px-2.5 py-1.5 text-sogan-100 outline-none text-xs focus:border-prada" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 pt-1">
          ${bookmark ? `
            <button onclick="window.hapusBookmarkTanggal('${dateKey}')" class="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-300 hover:bg-rose-900 text-xs font-semibold transition">
              <i class="fa-solid fa-trash-can mr-1"></i> Hapus
            </button>
          ` : ''}
          <button onclick="window.simpanBookmarkTanggal(${y}, ${m}, ${d})" class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs hover:brightness-110 transition shadow">
            <i class="fa-solid fa-floppy-disk mr-1"></i> ${bookmark ? 'Perbarui Catatan' : 'Simpan Tanggal'}
          </button>
        </div>
      </div>
    `;
  }

  // 11. Tombol Bagikan Weton (2.5)
  const btnShareCard = document.getElementById('modalBtnShareWeton');
  if (btnShareCard) {
    btnShareCard.onclick = function() {
      openWetonShareModal(y, m, d);
    };
  }

  // 12. Tombol Nujum Pribadi
  const btnNujum = document.getElementById('modalBtnHitungNujum');
  if (btnNujum) {
    btnNujum.onclick = function() {
      tutupDetailTanggalJawa();
      if (typeof window.hitungNujumDariTanggalJawa === 'function') {
        window.hitungNujumDariTanggalJawa(dateKey);
      } else if (typeof window.switchTab === 'function') {
        window.switchTab('kepribadian');
      }
    };
  }

  modal.onclick = function(e) {
    if (e.target === modal) {
      tutupDetailTanggalJawa();
    }
  };

  const onModalEsc = function(e) {
    if (e.key === 'Escape') {
      tutupDetailTanggalJawa();
      document.removeEventListener('keydown', onModalEsc);
    }
  };
  document.addEventListener('keydown', onModalEsc);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function tutupDetailTanggalJawa() {
  const modal = document.getElementById('modalDetailKalender');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Simpan catatan bookmark dari modal detail
 */
export function simpanBookmarkModal(y, m, d) {
  const katEl = document.getElementById('modalBookmarkKategori');
  const catEl = document.getElementById('modalBookmarkCatatan');
  const kategori = katEl ? katEl.value : 'catatan';
  const catatan = catEl ? catEl.value : '';

  const tglJawa = getTanggalJawaLengkap(y, m, d);
  const weton = `${tglJawa.dino} ${tglJawa.pas}`;

  saveBookmark({ y, m, d, kategori, catatan, weton });
  showToast(`Tanggal kasil kasimpen minangka ${kategori.toUpperCase()}!`);
  renderKalender();
  bukaDetailTanggalJawa(y, m, d);
}

export const simpanBookmarkTanggal = simpanBookmarkModal;

/**
 * Hapus catatan bookmark
 */
export function hapusBookmarkTanggal(dateStr) {
  deleteBookmark(dateStr);
  showToast('Catatan tanggal wigati kasil kaicalaken.');
  renderKalender();
  tutupDetailTanggalJawa();
}

/**
 * Konversi Tanggal Jawa (Tab Tanggal Jawa)
 */
export function renderKonversiTanggalJawa(dateVal) {
  let val = dateVal;
  if (!val) {
    const elInput = document.getElementById('inputTanggalJawa');
    val = elInput ? elInput.value : '';
  }
  if (!val) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    val = `${y}-${m}-${d}`;
    const elInput = document.getElementById('inputTanggalJawa');
    if (elInput) elInput.value = val;
  }

  const [y, m, d] = val.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;

  const tglJawa = getTanggalJawaLengkap(y, m, d);
  if (!tglJawa) return;
  const pm = getPranataMangsaLengkap(d, m);

  const resContainer = document.getElementById('hasilKonversiTanggalJawa');
  if (!resContainer) return;

  resContainer.innerHTML = `
    <div class="space-y-4">
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 shadow-2xl space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-700/60 pb-3">
          <div>
            <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">HASIL KONVERSI PANANGGALAN JAWA</span>
            <h3 class="font-marcellus text-lg sm:text-2xl font-bold text-prada-light">${d} ${BULAN_MASEHI[m - 1]} ${y} M</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-sogan-900 border border-prada/50 text-prada font-bold text-xs font-mono">
            ${tglJawa.dino} ${tglJawa.pas} (Neptu ${tglJawa.neptu})
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-amber-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Tanggal & Bulan Jawa</span>
            <strong class="font-marcellus text-base sm:text-lg text-amber-300">${tglJawa.tglJawa} ${tglJawa.bulanJawa}</strong>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-prada/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Tahun Jawa (AJ / Saka)</span>
            <strong class="font-marcellus text-base sm:text-lg text-prada-light">${tglJawa.tahunAJ} AJ (Tahun ${tglJawa.tahunSiklus})</strong>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-teal-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Siklus Windu</span>
            <strong class="font-marcellus text-base sm:text-lg text-teal-300">Windu ${tglJawa.namaWindu}</strong>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-rose-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Pawukon (Siklus 210)</span>
            <strong class="font-marcellus text-base sm:text-lg text-rose-300">Wuku ${tglJawa.wukuName} (${tglJawa.wukuNo})</strong>
          </div>
        </div>

        <!-- Pranata Mangsa Agraris Banner -->
        <div class="p-3 bg-teal-950/40 rounded-xl border border-teal-600/40 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="text-[10px] text-teal-300 block uppercase font-bold">Pranata Mangsa & Musim Tani:</span>
            <span class="font-mono text-xs sm:text-sm font-bold text-prada">${pm.nama} (${pm.musimTani}) · &ldquo;${pm.candrasangkala}&rdquo;</span>
          </div>
          <button onclick="window.openWetonShareModal(${y}, ${m}, ${d})" class="px-3 py-1.5 rounded-lg bg-sogan-900 border border-prada/50 text-prada hover:bg-sogan-800 text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-share-nodes"></i> Bagikan Weton
          </button>
        </div>
      </div>
    </div>
  `;
}

export function hitungNujumDariTanggalJawa(dateVal) {
  const tglInput = document.getElementById('tglLahirKepribadian');
  if (tglInput) {
    tglInput.value = dateVal;
  }
  if (typeof window.switchTab === 'function') {
    window.switchTab('kepribadian');
  }
  if (typeof window.updateKepribadianQuickInfo === 'function') {
    window.updateKepribadianQuickInfo();
  }
  if (typeof window.hitungKepribadianLengkap === 'function') {
    window.hitungKepribadianLengkap();
  }
}

// ─── EKSPOR KALENDER (PDF & GAMBAR) ───────────────────────────────────────
export function renderLaporanKalenderPrintHtml(bulan, tahun, theme = 'parchment') {
  const isParchment = (theme === 'parchment');
  const isMonochrome = (theme === 'monochrome');
  const isStandard = (!isParchment && !isMonochrome);

  const daysInMonth = getDaysInMonth(tahun, bulan);
  const firstJDN = toJDN(tahun, bulan, 1);
  const firstWeekday = (firstJDN + 1) % 7;
  const gridStartJDN = firstJDN - firstWeekday;
  const totalDays = firstWeekday + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const midDay = Math.min(15, daysInMonth);
  const midInfo = getDayInfo(tahun, bulan, midDay);
  const cornerHijriYear = midInfo?.hijri ? midInfo.hijri[2] : '-';
  const cornerJawa = getTanggalJawaLengkap(tahun, bulan, midDay);
  const mangsa = (typeof getPranataMangsaLengkap === 'function')
    ? getPranataMangsaLengkap(midDay, bulan)
    : { nama: 'Mangsa Ageng', rentang: '', musimTani: '', candrasangkala: '' };

  const namaBulanMasehi = BULAN_MASEHI[bulan - 1] || `Bulan ${bulan}`;

  // Styling Variables untuk 3 Gaya Visual: Standar, Kertas Kuno, dan Monokrom
  let primaryBg, docBorder, headerUnderline, tableHeaderBg, tableHeaderColor;
  let wukuColBg, cellBorder, cardBg, cardBorder, textPrimary, textMuted;
  let solidBarBecikBg, solidBarAlaBg, badgeBg, badgeText, badgeBorder;
  let wukuNgisorBg, wukuNgisorBorder, wukuNgisorTitleColor, wukuNgisorTextColor;

  if (isParchment) {
    primaryBg = '#fdf8eb';
    docBorder = '3px double #8c6224';
    headerUnderline = '2.5px double #8c6224';
    tableHeaderBg = '#2a1a0c';
    tableHeaderColor = '#fef08a';
    wukuColBg = '#f3ebd4';
    cellBorder = '1px solid #cbb88a';
    cardBg = '#ffffff';
    cardBorder = '1.5px solid #8c6224';
    textPrimary = '#1a0f05';
    textMuted = '#2b1d0c';
    solidBarBecikBg = '#16a34a';
    solidBarAlaBg = '#dc2626';
    badgeBg = '#1a0f05';
    badgeText = '#ffdf00';
    badgeBorder = '1px solid #b87c24';
    wukuNgisorBg = '#fee2e2';
    wukuNgisorBorder = '1.5px solid #dc2626';
    wukuNgisorTitleColor = '#991b1b';
    wukuNgisorTextColor = '#7f1d1d';
  } else if (isMonochrome) {
    primaryBg = '#ffffff';
    docBorder = '2px solid #000000';
    headerUnderline = '2px solid #000000';
    tableHeaderBg = '#000000';
    tableHeaderColor = '#ffffff';
    wukuColBg = '#f8fafc';
    cellBorder = '1px solid #000000';
    cardBg = '#ffffff';
    cardBorder = '1px solid #000000';
    textPrimary = '#000000';
    textMuted = '#374151';
    solidBarBecikBg = '#1e293b';
    solidBarAlaBg = '#475569';
    badgeBg = '#000000';
    badgeText = '#ffffff';
    badgeBorder = '1px solid #000000';
    wukuNgisorBg = '#f8fafc';
    wukuNgisorBorder = '1.5px solid #000000';
    wukuNgisorTitleColor = '#000000';
    wukuNgisorTextColor = '#374151';
  } else {
    // Standar (Warna Asli Bersih Modern pada Kertas Putih)
    primaryBg = '#ffffff';
    docBorder = '2px solid #cbd5e1';
    headerUnderline = '2px solid #3b82f6';
    tableHeaderBg = '#0f172a';
    tableHeaderColor = '#f8fafc';
    wukuColBg = '#f1f5f9';
    cellBorder = '1px solid #cbd5e1';
    cardBg = '#ffffff';
    cardBorder = '1px solid #cbd5e1';
    textPrimary = '#0f172a';
    textMuted = '#475569';
    solidBarBecikBg = '#16a34a';
    solidBarAlaBg = '#dc2626';
    badgeBg = '#0f172a';
    badgeText = '#f8fafc';
    badgeBorder = '1px solid #334155';
    wukuNgisorBg = '#fef2f2';
    wukuNgisorBorder = '1.5px solid #ef4444';
    wukuNgisorTitleColor = '#991b1b';
    wukuNgisorTextColor = '#7f1d1d';
  }

  // Tinggi Sel Adaptif Halaman Penuh (Single-Page Fit A4 Portrait @ 4mm 6mm margin)
  // Dihitung agar seluruh baris tabel mengisi area cetak yang tersedia secara proporsional (~530-550px):
  //   Halaman A4 cetak: 198mm × 289mm (748px × 1092px pada 96dpi)
  //   Konten non-tabel (header+legend+kode+libur+kolofon): ≈ 410px
  //   Tbody: 4 baris: 128px (512px) | 5 baris: 105px (525px) | 6 baris: 88px (528px)
  const cellHeight = (totalWeeks >= 6) ? '88px' : (totalWeeks <= 4) ? '128px' : '105px';

  // 1. Baris Tabel Bulanan
  const rowsHtml = [];
  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const wukuName = WUKU[wukuId];
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);
    const dununge = DUNUNGE[wukuId];

    let weekSasi = '';
    let weekTahunAJ = '';

    const cellsHtml = [];
    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const dayNum = currentJDN - firstJDN + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        cellsHtml.push(`
          <td class="col-day-empty" style="width: 130px; height: ${cellHeight}; border: ${cellBorder}; background-color: ${isParchment ? '#ebe3cf' : (isMonochrome ? '#f8fafc' : '#f1f5f9')}; opacity: 0.45; padding: 4px 6px; line-height: 1.2; vertical-align: top; box-sizing: border-box; overflow: visible; word-wrap: break-word;">
            <div style="height: 100%; min-height: 18px; line-height: 18px; font-size: 10px; color: ${textMuted}; text-align: right; opacity: 0.3;">-</div>
          </td>
        `);
        continue;
      }

      const info = getDayInfo(tahun, bulan, dayNum);
      const [code] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ["", "G", 0];
      const liburName = getLiburNasional(tahun, bulan, dayNum);
      const isMinggu = (d === 0);
      const isLibur = Boolean(liburName) || isMinggu;
      const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[info.pasaranId], WUKU[wukuId], isMinggu, isLibur, code);
      const tglJawa = getTanggalJawaLengkap(tahun, bulan, dayNum);
      const neptuTotal = NEPTU_HARI[d] + NEPTU_PASARAN[info.pasaranId];
      const isDinoGede = dinoWarna.isGede;
      const isIjo = dinoWarna.isIjo;

      if (!weekSasi) {
        weekSasi = tglJawa.bulanJawa;
        weekTahunAJ = `${tglJawa.tahunAJ} AJ`;
      }

      // Dino Gede styling: Gold border accent (Parchment/Standard) atau Bold Black (Monokrom)
      // Selalu gunakan tebal 1px yang sama persis dengan cellBorder agar garis pembatas tabel tidak bergeser
      const cellBorderAccent = isDinoGede
        ? (isMonochrome ? '1px solid #000000' : '1px solid #d97706')
        : cellBorder;

      // Status pill badge padat & anti-meluber
      let statusBadgeHtml = '';
      if (isDinoGede) {
        statusBadgeHtml = `<span style="background-color: ${isMonochrome ? '#e2e8f0' : '#fef08a'}; color: ${isMonochrome ? '#000000' : '#854d0e'}; border: 1px solid ${isMonochrome ? '#000000' : '#ca8a04'}; font-size: 7.5px; font-weight: 800; padding: 1px 3.5px; border-radius: 2px; line-height: 1; white-space: nowrap;">★ GEDE</span>`;
      } else if (isIjo) {
        statusBadgeHtml = `<span style="background-color: ${isMonochrome ? '#ffffff' : '#dcfce7'}; color: ${isMonochrome ? '#000000' : '#15803d'}; border: 1px solid ${isMonochrome ? '#000000' : '#86efac'}; font-size: 7.5px; font-weight: 800; padding: 1px 3.5px; border-radius: 2px; line-height: 1; white-space: nowrap;">✓ Becik</span>`;
      } else {
        statusBadgeHtml = `<span style="background-color: ${isMonochrome ? '#000000' : '#fee2e2'}; color: ${isMonochrome ? '#ffffff' : '#b91c1c'}; border: 1px solid ${isMonochrome ? '#000000' : '#fca5a5'}; font-size: 7.5px; font-weight: 800; padding: 1px 3.5px; border-radius: 2px; line-height: 1; white-space: nowrap;">▲ Ala</span>`;
      }

      const masehiNumColor = isLibur
        ? (isMonochrome ? '#000000' : '#dc2626')
        : (isMonochrome ? '#000000' : '#0f172a');

      const holidayDotColor = isMonochrome ? '#000000' : '#dc2626';
      const pasaranColor = isMonochrome ? '#000000' : '#1e293b';
      const solidBg = isIjo ? solidBarBecikBg : solidBarAlaBg;
      const solidText = '#ffffff';

      cellsHtml.push(`
        <td class="col-day" style="width: 130px; height: ${cellHeight}; vertical-align: top; text-align: left; padding: 4px 6px; line-height: 1.2; box-sizing: border-box; border: ${cellBorderAccent}; background-color: #ffffff; overflow: visible; word-wrap: break-word; overflow-wrap: break-word;">
          <!-- Baris 1: Angka Masehi (kiri) & Status Pill + Neptu (kanan) Bebas Bentrok -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; min-height: 18px; line-height: 18px; margin: 0 0 2px 0; box-sizing: border-box; overflow: visible; word-wrap: break-word;">
            <div style="display: flex; align-items: center; gap: 3px; text-align: left; overflow: visible; word-wrap: break-word;">
              <span style="font-size: 14px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: ${masehiNumColor}; ${isMonochrome && isLibur ? 'text-decoration: underline;' : ''}; line-height: 1;">
                ${dayNum}
              </span>
              ${liburName ? `<span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${holidayDotColor}; flex-shrink: 0;" title="${liburName}"></span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 3px; text-align: right; overflow: visible; word-wrap: break-word;">
              ${statusBadgeHtml}
              <span style="font-size: 8px; color: ${textMuted}; font-family: monospace; font-weight: bold;">N:${neptuTotal}</span>
            </div>
          </div>

          <!-- Baris 2: Jeneng Pasaran & Neptu Pasaran (Center) -->
          <div style="text-align: center; min-height: 16px; line-height: 16px; margin: 0 0 2px 0; overflow: visible; word-wrap: break-word; white-space: normal;">
            <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 11px; font-weight: bold; color: ${pasaranColor}; letter-spacing: 0.2px;">
              ${PASARAN[info.pasaranId]}
            </span>
            <span style="font-size: 8.5px; color: ${textMuted}; font-weight: normal;">(${NEPTU_PASARAN[info.pasaranId]})</span>
          </div>

          <!-- Baris 3: Tanggal Jawa Sultan Agungan (Solid Bar Simetris & Bersih Tanpa Kode Teknis) -->
          <div style="background-color: ${solidBg}; color: ${solidText}; border-radius: 2px; min-height: 18px; line-height: 18px; padding: 1px 4px; font-size: 8.5px; font-weight: bold; text-align: center; box-sizing: border-box; overflow: visible; word-wrap: break-word; white-space: normal; border: 1px solid ${isMonochrome ? '#000000' : 'rgba(0,0,0,0.12)'};">
            <span>${tglJawa.tglJawa} ${tglJawa.bulanJawa}</span>
          </div>
        </td>
      `);
    }

    if (!weekSasi) {
      weekSasi = cornerJawa.bulanJawa;
      weekTahunAJ = `${cornerJawa.tahunAJ} AJ`;
    }

    rowsHtml.push(`
      <tr style="height: ${cellHeight};">
        <td class="col-wuku" style="border: ${cellBorder}; background-color: ${wukuColBg}; padding: 5px 4px; text-align: center; vertical-align: middle; line-height: 1.2; width: 88px; height: ${cellHeight}; box-sizing: border-box; overflow: visible; word-wrap: break-word;">
          <div style="font-family: 'Times New Roman', serif; font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${textPrimary}; line-height: 1.2; overflow: visible; word-wrap: break-word; white-space: normal;">
            ${wukuName}
          </div>
          <div style="font-size: 9px; color: ${textMuted}; font-family: monospace; font-weight: bold; margin-top: 2px; line-height: 1; overflow: visible; word-wrap: break-word;">
            ${wukuId + 1}/30
          </div>
          <div style="font-size: 8px; color: ${isMonochrome ? '#374151' : (isParchment ? '#854d0e' : '#64748b')}; margin-top: 2px; line-height: 1.1; overflow: visible; word-wrap: break-word; white-space: normal;">
            ${dununge}
          </div>
          ${isNgisor ? `<div style="font-size: 8px; font-weight: bold; color: ${isMonochrome ? '#000000' : '#dc2626'}; margin-top: 3px; line-height: 1; overflow: visible; word-wrap: break-word; white-space: normal;">⚠️ Ngisor</div>` : ''}
        </td>
        ${cellsHtml.join('')}
        <td class="col-wuku-sasi" style="border: ${cellBorder}; background-color: ${wukuColBg}; padding: 5px 4px; text-align: center; vertical-align: middle; line-height: 1.2; width: 88px; height: ${cellHeight}; box-sizing: border-box; overflow: visible; word-wrap: break-word;">
          <div style="font-family: 'Times New Roman', serif; font-size: 11px; font-weight: bold; color: ${textPrimary}; line-height: 1.2; overflow: visible; word-wrap: break-word; white-space: normal;">
            ${wukuName}
          </div>
          <div style="font-size: 9px; color: ${isMonochrome ? '#000000' : (isParchment ? '#78350f' : '#0f172a')}; font-weight: bold; margin-top: 2px; line-height: 1.1; overflow: visible; word-wrap: break-word; white-space: normal;">
            ${weekSasi}
          </div>
          <div style="font-size: 8.5px; color: ${textMuted}; font-family: monospace; font-weight: bold; margin-top: 2px; line-height: 1; overflow: visible; word-wrap: break-word; white-space: normal;">
            ${weekTahunAJ}
          </div>
        </td>
      </tr>
    `);
  }

  // 2. Daftar Hari Libur Nasional & Pengetan Bulan Ini
  const holidaysInMonth = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const hName = getLiburNasional(tahun, bulan, d);
    if (hName) {
      const curJdn = toJDN(tahun, bulan, d);
      const dayOfWeek = (curJdn + 1) % 7;
      holidaysInMonth.push({
        dayNum: d,
        dino: HARI[dayOfWeek],
        name: hName
      });
    }
  }

  // 3. Daftar Lengkap 12 Arti Kode Hari Tradisional
  const KODE_HARI_DATA = [
    { code: 'S', name: 'Tangise Dewi Sinto', desc: 'Dina tangise dewi; prayogi ngati-ati anggone mbudidaya utawa lelungan.' },
    { code: 'N', name: 'Nuju Padu', desc: 'Potensi congkrah / pasulayan; prayogi sabar lan ngedohi pradondi.' },
    { code: 'K', name: 'Kala Dite', desc: 'Kala ing dina Ngahad; prayogi ngati-ati tumrap rubeda lan godha.' },
    { code: 'D', name: 'Dungulan', desc: 'Watak unggul nanging prayogi tansah ngatos-atos ing tindak-tanduk.' },
    { code: 'O', name: 'Anggoro Kasih', desc: 'Selasa Kliwon; dina pangasihaning Gusti lan pasucen batin.' },
    { code: 'Q', name: 'Dino ora kanggonan tanggal', desc: 'Dina lowong / wancak; prayogi boten kanggé hajat ageng.' },
    { code: 'T', name: 'Kala Tinantang', desc: 'Kala nantang; watak wanton, prayogi mengker hawa nepsu.' },
    { code: 'A', name: 'Sampar Wangke', desc: 'Sirikan ageng; prayogi boten kanggé pawiwahan utawi pindah griya.' },
    { code: 'W', name: 'Tali Wangke', desc: 'Sirikan ageng; awon kanggé adeg griya, mantu, utawi lelampahan tebih.' },
    { code: 'R', name: 'Ringkel Jalma', desc: 'Sirikan jalma manungsa; prayogi njagi kasarasan lan kaselamatan raga.' },
    { code: 'P', name: 'Nuju Pati', desc: 'Sirikan ageng tumrap lelakon anyar utawi bebadan usaha.' },
    { code: 'X', name: 'Sarik Agung', desc: 'Sarik / larangan ageng; prayogi ngedohi sedaya hajat wigati.' }
  ];

  return `
    <div class="laporan-page kalender-print-page print-container theme-${theme}" style="width: 1200px; min-width: 1120px; max-width: 1200px; padding: 10px 14px; font-family: 'Times New Roman', Georgia, serif; color: ${textPrimary}; background-color: ${primaryBg}; border: ${docBorder}; margin: 0 auto; box-sizing: border-box; overflow: visible; word-wrap: break-word;">
      
      <!-- KOP RESMI TRADISI LUHUR (TEGAK / PORTRAIT) -->
      <div style="border-bottom: ${headerUnderline}; padding: 2px 4px 4px 4px; text-align: center; margin-bottom: 4px; background-color: ${primaryBg};">
        <div style="font-size: 17px; font-weight: 800; font-family: 'Times New Roman', Georgia, serif; letter-spacing: 1.5px; text-transform: uppercase; color: ${isParchment ? '#4a2800' : (isMonochrome ? '#000000' : '#0f172a')}; line-height: 1.15; margin: 0 0 2px 0;">
          KALENDER JAWA SULTAN AGUNGAN
        </div>
        <div style="font-size: 13px; font-weight: 800; font-family: 'Times New Roman', Georgia, serif; color: ${isParchment ? '#7c480e' : (isMonochrome ? '#000000' : '#1e293b')}; margin: 0 0 3px 0; letter-spacing: 0.4px;">
          ${namaBulanMasehi.toUpperCase()} ${tahun} M &nbsp;·&nbsp; ${cornerJawa.bulanJawa.toUpperCase()} ${cornerJawa.tahunAJ} AJ &nbsp;·&nbsp; ${cornerHijriYear} H
        </div>
        <div style="font-size: 9px; font-weight: 600; color: ${textMuted}; margin-top: 1px; line-height: 1.25;">
          Siklus Windu: <strong>Windu ${cornerJawa.namaWindu}</strong> (Taun ${cornerJawa.tahunSiklus}) &nbsp;|&nbsp; 
          Pranata Mangsa: <strong>${mangsa.nama}</strong> (${mangsa.rentang} - ${mangsa.musimTani}) &nbsp;|&nbsp; 
          Candra: <em>"${mangsa.candrasangkala}"</em>
        </div>
      </div>

      <!-- TABEL BULANAN KALENDER SULTAN AGUNGAN (STRUKTUR TABEL STATIS MURNI KHUSUS CETAK) -->
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed; empty-cells: show; text-align: center; margin-bottom: 4px; box-sizing: border-box;">
        <colgroup>
          <col style="width: 88px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 130px;">
          <col style="width: 88px;">
        </colgroup>
        <thead>
          <tr style="background-color: ${tableHeaderBg}; color: ${tableHeaderColor}; font-size: 11px; font-weight: bold; line-height: 1.2; height: 34px;">
            <th style="width: 88px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">WUKU</th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; color: ${isMonochrome ? '#ffffff' : (isParchment ? '#fca5a5' : '#ef4444')} !important; border: ${cellBorder}; box-sizing: border-box;">AHAD <span style="font-size: 9px; opacity: 0.9;">(5)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">SENIN <span style="font-size: 9px; opacity: 0.9;">(4)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">SELASA <span style="font-size: 9px; opacity: 0.9;">(3)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">RABU <span style="font-size: 9px; opacity: 0.9;">(7)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">KAMIS <span style="font-size: 9px; opacity: 0.9;">(8)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">JUMAT <span style="font-size: 9px; opacity: 0.9;">(6)</span></th>
            <th style="width: 130px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">SABTU <span style="font-size: 9px; opacity: 0.9;">(9)</span></th>
            <th style="width: 88px; height: 34px; padding: 7px 4px; text-align: center; vertical-align: middle; line-height: 1.2; border: ${cellBorder}; color: ${tableHeaderColor}; box-sizing: border-box;">WUKU &amp; SASI</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>

      <!-- 1. CATATAN KRITIS: PERINGATAN KALA WUKU NGISOR -->
      <div style="background-color: ${wukuNgisorBg}; border: ${wukuNgisorBorder}; border-radius: 4px; padding: 2.5px 6px; text-align: center; margin-bottom: 3.5px; box-sizing: border-box;">
        <div style="color: ${wukuNgisorTitleColor}; font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">
          ⚠️ PERINGATAN KALA WUKU NGISOR: Nomor 4, 14, 24 — kala ono ngisor, ojo marani dununge wuku!
        </div>
        <div style="color: ${wukuNgisorTextColor}; font-size: 8px; margin-top: 1px; font-style: italic; line-height: 1.2;">
          Wuku Kurantil (ke-4), Mandasiya (ke-14), lan Prangbakat (ke-24). Nalika lumaku ing 3 wuku punika, kala mapan wonten ngandhap (bumi). Awisan ageng kanggé mbikak tanah, adeg pondasi griya, boyongan, utawi lelampahan tumuju arah dununge wuku amargi gampil manggih rubeda.
        </div>
      </div>

      <!-- 2. STANDARISASI KODE WARNA BLOK (LEGENDA WARNA) -->
      <div style="margin-bottom: 3.5px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${textPrimary}; border-bottom: 1px solid ${isMonochrome ? '#000000' : (isParchment ? '#c9b384' : '#cbd5e1')}; padding-bottom: 2px; margin-bottom: 2.5px; text-transform: uppercase; letter-spacing: 0.3px;">
          STANDARISASI KODE WARNA BLOK &amp; WATAK DINA
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
          <!-- Blok Hijau -->
          <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 2.5px 5px; display: flex; align-items: flex-start; gap: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background-color: ${solidBarBecikBg}; border-radius: 2px; border: 1px solid ${isMonochrome ? '#000000' : '#15803d'}; flex-shrink: 0; margin-top: 1px;"></span>
            <div>
              <strong style="color: ${isMonochrome ? '#000000' : '#15803d'}; font-size: 8.5px; display: block; line-height: 1.1;">Blok Hijau Solid</strong>
              <div style="font-size: 8px; font-weight: 800; color: ${textPrimary}; margin-top: 1px;">Dino Ijo / Rahayu</div>
              <div style="font-size: 7px; font-weight: 600; color: ${textMuted}; line-height: 1.15; margin-top: 1px;">Dina becik widada kanggé sedaya hajat, pakaryan, boyongan, lan lelungan.</div>
            </div>
          </div>
          <!-- Blok Merah -->
          <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 2.5px 5px; display: flex; align-items: flex-start; gap: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background-color: ${solidBarAlaBg}; border-radius: 2px; border: 1px solid ${isMonochrome ? '#000000' : '#b91c1c'}; flex-shrink: 0; margin-top: 1px;"></span>
            <div>
              <strong style="color: ${isMonochrome ? '#000000' : '#b91c1c'}; font-size: 8.5px; display: block; line-height: 1.1;">Blok Merah Solid</strong>
              <div style="font-size: 8px; font-weight: 800; color: ${textPrimary}; margin-top: 1px;">Dino Abang / Ala</div>
              <div style="font-size: 7px; font-weight: 600; color: ${textMuted}; line-height: 1.15; margin-top: 1px;">Dina sangar / panyirik; prayogi mawas dhiri lan ngedohi hajat ageng.</div>
            </div>
          </div>
          <!-- Border Emas Dino Gede -->
          <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 2.5px 5px; display: flex; align-items: flex-start; gap: 4px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; border: 1.5px solid ${isMonochrome ? '#000000' : '#eab308'}; background-color: ${isMonochrome ? '#e2e8f0' : '#fef08a'}; border-radius: 2px; color: ${isMonochrome ? '#000000' : '#854d0e'}; font-size: 8px; font-weight: 800; flex-shrink: 0; margin-top: 1px;">★</span>
            <div>
              <strong style="color: ${isMonochrome ? '#000000' : '#a16207'}; font-size: 8.5px; display: block; line-height: 1.1;">Border Emas &amp; Bintang ★</strong>
              <div style="font-size: 8px; font-weight: 800; color: ${textPrimary}; margin-top: 1px;">Dino Gede</div>
              <div style="font-size: 7px; font-weight: 600; color: ${textMuted}; line-height: 1.15; margin-top: 1px;">71 Pasangan Sakral Pawukon Tradisi Leluhur kanthi prabawa ageng, prayogi tirakat.</div>
            </div>
          </div>
          <!-- Tinta Merah Angka Masehi -->
          <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 2.5px 5px; display: flex; align-items: flex-start; gap: 4px;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; background-color: #ffffff; border: 1px solid ${isMonochrome ? '#000000' : '#cbd5e1'}; border-radius: 2px; color: ${isMonochrome ? '#000000' : '#dc2626'}; font-size: 8.5px; font-weight: 800; flex-shrink: 0; margin-top: 1px;">1</span>
            <div>
              <strong style="color: ${isMonochrome ? '#000000' : '#dc2626'}; font-size: 8.5px; display: block; line-height: 1.1;">Tinta Merah Angka Masehi</strong>
              <div style="font-size: 8px; font-weight: 800; color: ${textPrimary}; margin-top: 1px;">Ngahad &amp; Prei Resmi</div>
              <div style="font-size: 7px; font-weight: 600; color: ${textMuted}; line-height: 1.15; margin-top: 1px;">Dina Ngahad saha dinten libur resmi pamarintah utawi pengetan ageng.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. DAFTAR LENGKAP 12 KODE HARI TRADISIONAL (4 Kolom x 3 Baris Proporsional Portrait) -->
      <div style="margin-bottom: 3.5px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${textPrimary}; border-bottom: 1px solid ${isMonochrome ? '#000000' : (isParchment ? '#c9b384' : '#cbd5e1')}; padding-bottom: 2px; margin-bottom: 2.5px; text-transform: uppercase; letter-spacing: 0.3px;">
          DAFTAR 12 KODE DINA PETUNGAN PRIMBON TRADISIONAL
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
          ${KODE_HARI_DATA.map(item => `
            <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 2.5px 4.5px; font-size: 8.5px; line-height: 1.15; box-shadow: ${isParchment ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};">
              <div style="display: flex; align-items: center; gap: 3.5px; margin-bottom: 1.5px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; min-width: 19px; height: 14px; background-color: ${badgeBg}; color: ${badgeText}; font-family: monospace; font-size: 8.5px; font-weight: 800; border-radius: 2px; border: ${badgeBorder}; flex-shrink: 0;">
                  [${item.code}]
                </span>
                <strong style="color: ${textPrimary}; font-size: 8.5px; font-weight: 800; letter-spacing: 0.1px;">
                  ${item.name}
                </strong>
              </div>
              <div style="color: ${textMuted}; font-size: 7.5px; font-weight: 600; line-height: 1.2;">
                ${item.desc}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 4. HARI LIBUR NASIONAL BULAN INI & PEDOMAN SEL 2 TINGKAT -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 3.5px;">
        <!-- Kolom Kiri: Rincian Hari Libur Nasional & Pengetan -->
        <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 3px 6px;">
          <div style="font-size: 9px; font-weight: 800; color: ${textPrimary}; margin-bottom: 2px;">
            📅 Dinten Libur Nasional &amp; Pengetan (${namaBulanMasehi} ${tahun})
          </div>
          ${holidaysInMonth.length > 0 ? `
            <ul style="margin: 0; padding-left: 10px; font-size: 8px; font-weight: 600; color: ${textPrimary}; line-height: 1.25;">
              ${holidaysInMonth.map(h => `
                <li><strong>${h.dayNum} ${namaBulanMasehi} (${h.dino})</strong>: <span style="color: ${isMonochrome ? '#000000' : '#b91c1c'}; font-weight: 700;">${h.name}</span></li>
              `).join('')}
            </ul>
          ` : `
            <div style="font-size: 8px; color: ${textMuted}; font-style: italic;">
              Mboten wonten dinten libur resmi pamarintah ing sasi punika.
            </div>
          `}
        </div>

        <!-- Kolom Kanan: Pedoman Struktur Sel 2 Tingkat -->
        <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: 3px; padding: 3px 6px;">
          <div style="font-size: 9px; font-weight: 800; color: ${textPrimary}; margin-bottom: 2px;">
            📖 Paugeran Maca Struktur Sel 2 Tingkat
          </div>
          <div style="font-size: 7.5px; font-weight: 500; color: ${textMuted}; line-height: 1.2;">
            <div>• <strong>Tingkat Ndhuwur (Putih):</strong> Angka Masehi (abang = Ngahad/Libur), Pratandha Rahayu/Ala, Bintang Dino Gede (★), lan Gunggung Neptu (Dina + Pasaran).</div>
            <div>• <strong>Tingkat Ngisor (Solid):</strong> Latar Hijau Solid (Becik) utawa Merah Solid (Ala), Tanggal &amp; Sasi Jawa Sultan Agungan, saha Kode Watak Primbon [S, N, W, K, lsp].</div>
          </div>
        </div>
      </div>

      <!-- COLOPHON & TITI MANGSA RESMI -->
      <div style="border-top: 1px solid ${isMonochrome ? '#000000' : (isParchment ? '#c9b384' : '#cbd5e1')}; padding-top: 2px; display: flex; justify-content: space-between; align-items: center; font-size: 7.5px; color: ${textMuted};">
        <div>
          Paugeran Kasultanan Mataram - Surakarta &amp; Ngayogyakarta Hadiningrat (Sri Sultan Agung 1555 Saka / 1633 M)
        </div>
        <div style="font-style: italic;">
          Kadhudhah otomatis lumantar Platform Budaya Luhur Jagad Jawa · jagad-jawa.web.app
        </div>
      </div>

    </div>
  `;
}

/**
 * Helper untuk menampilkan status loading visual pada tombol ekspor kalender
 * @param {HTMLElement|null} btn 
 * @param {boolean} isLoading 
 * @param {string} loadingText 
 */
function setButtonLoading(btn, isLoading, loadingText = 'Nyiapaken...') {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.75';
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${loadingText}</span>`;
  } else {
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
    btn.disabled = false;
    btn.style.pointerEvents = '';
    btn.style.opacity = '';
  }
}

/**
 * Helper internal untuk menangkap canvas beresolusi tinggi tanpa terpotong (Anti-Cutoff & High-DPI).
 * Memaksa rasio & dimensi kanvas tetap berbasis A4 Portrait (1240px × 1754px pada skala 1x, 2480px × 3508px pada skala 2x),
 * menyelaraskan skala konten agar muat 100% di dalam lembar tanpa meregang atau melar berlebihan ke bawah.
 * @param {string} fullHtml
 * @param {'parchment'|'monochrome'|'standard'} theme
 * @param {number} [scale=2] Skala rendering kanvas (2x menghasilkan 2480 × 3508 px A4 Portrait 300 DPI)
 * @returns {Promise<HTMLCanvasElement>}
 */
async function captureKalenderCanvas(fullHtml, theme = 'parchment', scale = 2) {
  if (typeof window === 'undefined') {
    throw new Error('Window environment tidak tersedia');
  }

  const html2canvasFn = (typeof window !== 'undefined' && window.html2canvas)
    || (typeof html2canvas === 'function' ? html2canvas : null);

  if (!html2canvasFn) {
    throw new Error('Pustaka html2canvas belum dimuat.');
  }

  const A4_WIDTH = 1240;
  const A4_HEIGHT = 1754;
  const DPI_SCALE = scale || 2;
  const FINAL_WIDTH = A4_WIDTH * DPI_SCALE;
  const FINAL_HEIGHT = A4_HEIGHT * DPI_SCALE;

  const isParchment = (theme === 'parchment');
  const bgColor = isParchment ? '#fdf8eb' : '#ffffff';
  const textColor = isParchment ? '#2b1d0c' : '#0f172a';

  // =========================================================================
  // METODE UTAMA: KONVERSI DARI DOKUMEN PDF DI DALAM HIDDEN IFRAME HEADLESS
  // =========================================================================
  if (typeof document !== 'undefined' && document.body) {
    let iframe = null;
    try {
      iframe = document.createElement('iframe');
      iframe.id = 'kalender-pdf-render-frame';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = `
        position: fixed !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 1240px !important;
        height: 1754px !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        z-index: -99999 !important;
      `;
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const iframeContent = `
          <!DOCTYPE html>
          <html lang="jv">
          <head>
            <meta charset="utf-8">
            <title>Kalender Jawa A4 Portrait</title>
            <style>
              * {
                box-sizing: border-box !important;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              html, body {
                width: 1240px !important;
                height: 1754px !important;
                max-width: 1240px !important;
                max-height: 1754px !important;
                background-color: ${bgColor} !important;
                color: ${textColor} !important;
                font-family: 'Times New Roman', Georgia, serif !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              #a4-page-frame {
                width: 1240px !important;
                height: 1754px !important;
                max-width: 1240px !important;
                max-height: 1754px !important;
                box-sizing: border-box !important;
                background-color: ${bgColor} !important;
                padding: 16px 20px !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: center !important;
                position: relative !important;
              }
              #a4-content-scaler {
                width: 1200px !important;
                box-sizing: border-box !important;
                transform-origin: top center !important;
                overflow: visible !important;
              }
              #printable-calendar-area, #laporan-cetak-pdf {
                width: 1200px !important;
                margin: 0 auto !important;
                padding: 0 !important;
                background-color: ${bgColor} !important;
                overflow: visible !important;
              }
              .kalender-print-page {
                width: 1200px !important;
                max-width: 1200px !important;
                min-width: 1200px !important;
                padding: 8px 12px !important;
                margin: 0 auto !important;
                background-color: ${bgColor} !important;
                overflow: visible !important;
                box-sizing: border-box !important;
              }
              table {
                width: 100% !important;
                table-layout: fixed !important;
                border-collapse: collapse !important;
                empty-cells: show !important;
                margin-bottom: 4px !important;
                overflow: visible !important;
              }
              th, td, div, span, p, strong, li {
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                overflow: visible !important;
                white-space: normal !important;
                text-overflow: clip !important;
              }
              th, td {
                box-sizing: border-box !important;
                height: auto !important;
              }
            </style>
          </head>
          <body class="print-theme-${theme}">
            <div id="a4-page-frame" class="a4-page-capture-frame theme-${theme}">
              <div id="a4-content-scaler">
                <div id="printable-calendar-area">
                  <div id="laporan-cetak-pdf" class="print-only-document theme-${theme}">
                    ${fullHtml}
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        iframeDoc.open();
        iframeDoc.write(iframeContent);
        iframeDoc.close();

        if (iframeDoc.fonts && iframeDoc.fonts.ready) {
          try {
            await iframeDoc.fonts.ready;
          } catch (_) {}
        }
        await new Promise(resolve => setTimeout(resolve, 180));

        // Skalakan konten agar pas secara presisi di dalam tinggi frame A4 (1754px - padding 32px = 1722px)
        const contentScaler = iframeDoc.getElementById('a4-content-scaler');
        if (contentScaler) {
          const naturalHeight = contentScaler.scrollHeight || contentScaler.offsetHeight || 1722;
          const availableHeight = 1722;
          if (naturalHeight > availableHeight) {
            const scaleFit = availableHeight / naturalHeight;
            contentScaler.style.transform = `scale(${scaleFit})`;
          }
        }

        const pageFrame = iframeDoc.getElementById('a4-page-frame') || iframeDoc.body;
        const capturedCanvas = await html2canvasFn(pageFrame, {
          scale: DPI_SCALE,
          useCORS: true,
          allowTaint: true,
          backgroundColor: bgColor,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          width: A4_WIDTH,
          height: A4_HEIGHT,
          windowWidth: A4_WIDTH,
          windowHeight: A4_HEIGHT
        });

        if (capturedCanvas) {
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = FINAL_WIDTH;
          finalCanvas.height = FINAL_HEIGHT;
          const ctx = finalCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, FINAL_WIDTH, FINAL_HEIGHT);
            ctx.drawImage(capturedCanvas, 0, 0, FINAL_WIDTH, FINAL_HEIGHT);
            return finalCanvas;
          }
          return capturedCanvas;
        }
      }
    } catch (iframeErr) {
      console.warn('Iframe A4 Portrait converter fallback to DOM:', iframeErr);
    } finally {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }
  }

  // =========================================================================
  // METODE CADANGAN: DOM TERISOLASI DI DOKUMEN UTAMA DENGAN RASIO A4 PORTRAIT
  // =========================================================================
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (_) {}
  }

  const container = document.createElement('div');
  container.id = 'kalender-export-capture-container';
  container.className = `a4-page-capture-frame theme-${theme}`;
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 1240px;
    min-width: 1240px;
    max-width: 1240px;
    height: 1754px;
    min-height: 1754px;
    max-height: 1754px;
    margin: 0;
    padding: 16px 20px;
    background-color: ${bgColor};
    z-index: -9999;
    visibility: visible;
    pointer-events: none;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-family: 'Times New Roman', Georgia, serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  `;

  const scalerWrapper = document.createElement('div');
  scalerWrapper.id = 'a4-content-scaler';
  scalerWrapper.style.cssText = `
    width: 1200px;
    box-sizing: border-box;
    transform-origin: top center;
    overflow: visible;
  `;
  scalerWrapper.innerHTML = fullHtml;
  container.appendChild(scalerWrapper);
  document.body.appendChild(container);

  const prevScrollX = window.scrollX || window.pageXOffset || 0;
  const prevScrollY = window.scrollY || window.pageYOffset || 0;
  const prevOverflow = document.body.style.overflow;

  document.body.style.overflow = 'hidden';
  if (prevScrollX !== 0 || prevScrollY !== 0) {
    window.scrollTo(0, 0);
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 160));

    const naturalHeight = scalerWrapper.scrollHeight || scalerWrapper.offsetHeight || 1722;
    const availableHeight = 1722;
    if (naturalHeight > availableHeight) {
      const scaleFit = availableHeight / naturalHeight;
      scalerWrapper.style.transform = `scale(${scaleFit})`;
    }

    const capturedCanvas = await html2canvasFn(container, {
      scale: DPI_SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bgColor,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: A4_WIDTH,
      height: A4_HEIGHT,
      windowWidth: A4_WIDTH,
      windowHeight: A4_HEIGHT
    });

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = FINAL_WIDTH;
    finalCanvas.height = FINAL_HEIGHT;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, FINAL_WIDTH, FINAL_HEIGHT);
      ctx.drawImage(capturedCanvas, 0, 0, FINAL_WIDTH, FINAL_HEIGHT);
      return finalCanvas;
    }
    return capturedCanvas;
  } finally {
    document.body.style.overflow = prevOverflow;
    if (prevScrollX !== 0 || prevScrollY !== 0) {
      window.scrollTo(prevScrollX, prevScrollY);
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}


/**
 * Unduh / Cetak Kalender Jawa langsung menggunakan Native Browser Print (window.print())
 * Menghasilkan dokumen cetak / PDF Portrait 1 Halaman Utuh (Fit to 1 Single Page A4)
 * Estetika Kertas Kuno Tradisi Leluhur klasik, teks vektor tajam asli (selectable), margin 10mm, dan posisi center presisi
 * @param {'parchment'|'monochrome'|'standard'} theme 
 */
export async function downloadKalenderPdf(theme = 'parchment') {
  let btnId = 'btnPrintKalenderPdf';
  let labelText = 'Nyiapaken Dialog Cetak...';

  if (theme === 'standard') {
    btnId = 'btnPrintKalenderStandard';
  } else if (theme === 'monochrome') {
    btnId = 'btnPrintKalenderMonochrome';
  }

  const btn = (typeof document !== 'undefined')
    ? (document.getElementById(btnId) || document.getElementById('btnPrintKalenderPdf') || document.getElementById('btnPrintKalenderParchment'))
    : null;
  setButtonLoading(btn, true, labelText);

  try {
    const bulanSel = (typeof document !== 'undefined') ? document.getElementById('bulanSel') : null;
    const tahunInput = (typeof document !== 'undefined') ? document.getElementById('tahunInput') : null;
    const bulan = parseInt(bulanSel?.value || (new Date().getMonth() + 1), 10);
    const tahun = parseInt(tahunInput?.value || new Date().getFullYear(), 10);

    if (typeof showToast === 'function') {
      showToast('Nyiapaken dialog cetak / Simpan PDF native browser... 🖨️');
    }

    // Panggil langsung Native Browser Print dengan isolasi CSS @media print
    executeBrowserPrintFallback(bulan, tahun, theme);
  } finally {
    setButtonLoading(btn, false);
  }
}

/**
 * Dialog cetak browser bawaan (Pure CSS Print Layout)
 * Menampilkan preview cetak browser dengan presisi tata letak vektor tabel kaku
 * @param {number} bulan 
 * @param {number} tahun 
 * @param {'parchment'|'monochrome'|'standard'} theme 
 */
function executeBrowserPrintFallback(bulan, tahun, theme = 'parchment') {
  if (typeof document === 'undefined') return;

  const isParchment = (theme === 'parchment');
  const isMonochrome = (theme === 'monochrome');
  const namaBulan = BULAN_MASEHI[bulan - 1] || `Bulan-${bulan}`;
  let themeSuffix = 'Standar';
  if (isParchment) themeSuffix = 'Kertas-Kuno';
  else if (isMonochrome) themeSuffix = 'Monokrom';

  const customTitle = `Kalender-Jawa-${namaBulan}-${tahun}-${themeSuffix}`;

  // Bungkus dengan #printable-calendar-area agar teknik CSS visibility:hidden dapat berjalan
  // dengan presisi — hanya area kalender ini yang visible saat cetak, semua elemen lain disembunyikan
  let printWrapper = document.getElementById('printable-calendar-area');
  if (!printWrapper) {
    printWrapper = document.createElement('div');
    printWrapper.id = 'printable-calendar-area';
    document.body.appendChild(printWrapper);
  }

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    printWrapper.appendChild(printContainer);
  } else if (printContainer.parentElement !== printWrapper) {
    // Pindahkan ke dalam wrapper jika belum di sana
    printWrapper.appendChild(printContainer);
  }

  printContainer.innerHTML = renderLaporanKalenderPrintHtml(bulan, tahun, theme);

  const prevTitle = document.title;
  document.title = customTitle;

  document.body.classList.add('print-kalender-active', 'print-mode-active');
  document.body.classList.remove('print-theme-parchment', 'print-theme-monochrome', 'print-theme-standard');
  printContainer.classList.add('print-target-active');
  printContainer.classList.remove('theme-parchment', 'theme-monochrome', 'theme-standard');

  if (theme === 'parchment') {
    document.body.classList.add('print-theme-parchment');
    printContainer.classList.add('theme-parchment');
  } else if (theme === 'monochrome') {
    document.body.classList.add('print-theme-monochrome');
    printContainer.classList.add('theme-monochrome');
  } else {
    document.body.classList.add('print-theme-standard');
    printContainer.classList.add('theme-standard');
  }

  const cleanup = () => {
    document.body.classList.remove('print-kalender-active', 'print-mode-active', 'print-theme-parchment', 'print-theme-monochrome', 'print-theme-standard');
    printContainer.classList.remove('print-target-active', 'theme-parchment', 'theme-monochrome', 'theme-standard');
    if (printContainer && printContainer.parentElement !== document.body) {
      document.body.appendChild(printContainer);
    }
    if (printWrapper && printWrapper.parentElement) {
      printWrapper.parentElement.removeChild(printWrapper);
    }
    document.title = prevTitle;
    if (typeof window !== 'undefined') {
      window.removeEventListener('afterprint', cleanup);
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('afterprint', cleanup, { once: true });
    if (typeof window.print === 'function') {
      setTimeout(() => {
        window.print();
      }, 50);
    }
  }
}

/**
 * Fungsi Cetak Kalender menggunakan Print Layout / CSS Print Murni (Native Browser Print)
 * @param {'parchment'|'monochrome'|'standard'} theme 
 */
export async function printLaporanKalender(theme = 'parchment') {
  const btn = (typeof document !== 'undefined')
    ? (document.getElementById('btnPrintKalenderPdf') || document.getElementById('btnPrintKalenderParchment'))
    : null;
  setButtonLoading(btn, true, 'Nyiapaken Dialog Cetak...');

  try {
    const bulanSel = (typeof document !== 'undefined') ? document.getElementById('bulanSel') : null;
    const tahunInput = (typeof document !== 'undefined') ? document.getElementById('tahunInput') : null;
    const bulan = parseInt(bulanSel?.value || (new Date().getMonth() + 1), 10);
    const tahun = parseInt(tahunInput?.value || new Date().getFullYear(), 10);
    executeBrowserPrintFallback(bulan, tahun, theme);
  } finally {
    setButtonLoading(btn, false);
  }
}

export async function downloadKalenderPng() {
  const btn = (typeof document !== 'undefined') ? document.getElementById('btnDownloadKalenderPng') : null;
  setButtonLoading(btn, true, 'Nyiapaken gambar PNG...');

  const bulanSel = (typeof document !== 'undefined') ? document.getElementById('bulanSel') : null;
  const tahunInput = (typeof document !== 'undefined') ? document.getElementById('tahunInput') : null;
  const bulan = parseInt(bulanSel?.value || (new Date().getMonth() + 1), 10);
  const tahun = parseInt(tahunInput?.value || new Date().getFullYear(), 10);
  const namaBulan = BULAN_MASEHI[bulan - 1] || `Bulan-${bulan}`;
  const filename = `Kalender-Jawa-${namaBulan}-${tahun}-Kertas-Kuno.png`;

  if (typeof showToast === 'function') {
    showToast('Nyiapaken gambar PNG kalender resolusi dhuwur... 🎨');
  }

  // Beri kesempatan browser me-render status loading sebelum eksekusi berat
  await new Promise(resolve => setTimeout(resolve, 60));

  const html2canvasFn = (typeof window !== 'undefined' && window.html2canvas)
    || (typeof html2canvas === 'function' ? html2canvas : null);

  if (!html2canvasFn) {
    if (typeof showToast === 'function') {
      showToast('Piranti html2canvas durung cumepak.');
    }
    setButtonLoading(btn, false);
    return;
  }

  let canvas = null;
  try {
    // Gunakan template HTML yang sama persis dengan modul cetak PDF (tema parchment)
    const fullHtml = renderLaporanKalenderPrintHtml(bulan, tahun, 'parchment');
    // Scale 2 = 2480 x 3508 px A4 Portrait 300 DPI High-DPI Scaling tajam & jernih tanpa melar
    canvas = await captureKalenderCanvas(fullHtml, 'parchment', 2);

    // Gunakan downloadCanvasAsPng helper (mendukung Web Share API pada smartphone & Blob download)
    await downloadCanvasAsPng(canvas, filename, {
      title: `Kalender Jawa ${namaBulan} ${tahun}`,
      text: `Kalender Sultan Agungan ${namaBulan} ${tahun} Masehi — Jagad Jawa`
    });
  } catch (err) {
    console.error('Gagal ngundhuh kalender PNG via html2canvas:', err);
    if (typeof showToast === 'function') {
      showToast('Gagal ngundhuh gambar: ' + (err.message || 'Error'));
    }
  } finally {
    if (canvas) {
      canvas.width = 1;
      canvas.height = 1;
    }
    setButtonLoading(btn, false);
  }
}


// Bind langsung ke namespace window agar selalu tersedia secara global untuk handler inline HTML
if (typeof window !== 'undefined') {
  window.renderLaporanKalenderPrintHtml = renderLaporanKalenderPrintHtml;
  window.printLaporanKalender = printLaporanKalender;
  window.downloadKalenderPdf = downloadKalenderPdf;
  window.downloadKalenderPng = downloadKalenderPng;
  window.resetKalenderToday = resetKalenderToday;
}
