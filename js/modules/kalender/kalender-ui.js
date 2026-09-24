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

let currentFilterType = 'all';

export function initKalenderSelects() {
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
  const dinoGedeObj = checkDinoGede(info.wukuId, info.weekdayId, info.pasaranId, info.hijri[0], info.hijri[1]);
  const elBoxDinoGede = document.getElementById('modalBoxDinoGede');
  const elIconDinoGede = document.getElementById('modalIconDinoGede');
  const elTitleDinoGede = document.getElementById('modalTitleDinoGede');
  const elDescDinoGede = document.getElementById('modalDescDinoGede');

  if (dinoGedeObj.isGede) {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10';
    if (elIconDinoGede) elIconDinoGede.textContent = '★';
    if (elTitleDinoGede) elTitleDinoGede.textContent = `DINO GEDE: ${dinoGedeObj.label.toUpperCase()}`;
    if (elDescDinoGede) elDescDinoGede.textContent = 'Dina wigati lan sakral ing petungan pawukon & penanggalan Jawa.';
  } else {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-sogan-950/60 border-sogan-800 text-sogan-400';
    if (elIconDinoGede) elIconDinoGede.textContent = '✧';
    if (elTitleDinoGede) elTitleDinoGede.textContent = 'DINA LUMRAH';
    if (elDescDinoGede) elDescDinoGede.textContent = 'Boten klebet pengetan Dino Gede khusus.';
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
      elTitleAlaBecik.textContent = `STATUS: ALA / NAHAS (▲ ${code ? code + ' Ala' : 'Ala'})`;
    }
    if (elDescAlaBecik) {
      elDescAlaBecik.className = 'text-[11px] text-red-100 mt-0.5 leading-tight font-medium';
      elDescAlaBecik.textContent = 'Dina awon tumrap adeg griya, mantu, utawi lelungan tebih.';
    }
  } else {
    if (elBoxAlaBecik) elBoxAlaBecik.className = 'p-3.5 rounded-xl border flex items-center gap-3 bg-emerald-950/90 border-emerald-500 text-emerald-50 shadow-lg shadow-emerald-950/30';
    if (elIconAlaBecik) elIconAlaBecik.textContent = '✓';
    if (elTitleAlaBecik) {
      elTitleAlaBecik.className = 'font-bold text-xs uppercase tracking-wide text-emerald-100';
      elTitleAlaBecik.textContent = `STATUS: BECIK / RAHAYU (✓ Becik)`;
    }
    if (elDescAlaBecik) {
      elDescAlaBecik.className = 'text-[11px] text-emerald-100 mt-0.5 leading-tight font-medium';
      elDescAlaBecik.textContent = 'Dina becik kanggé maneka warni hajat, lelungan, lan pakaryan.';
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
export function renderLaporanKalenderPrintHtml(bulan, tahun) {
  const daysInMonth = getDaysInMonth(tahun, bulan);
  const firstJDN = toJDN(tahun, bulan, 1);
  const firstWeekday = (firstJDN + 1) % 7;
  const gridStartJDN = firstJDN - firstWeekday;
  const totalDays = firstWeekday + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const midInfo = getDayInfo(tahun, bulan, Math.min(15, daysInMonth));
  const cornerHijriYear = midInfo?.hijri ? midInfo.hijri[2] : '-';

  const rowsHtml = [];
  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const wukuName = WUKU[wukuId];

    const cellsHtml = [];
    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const dayNum = currentJDN - firstJDN + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        cellsHtml.push('<td style="background-color: #f8f9fa; border: 0.5pt solid #d1d5db; height: 36pt;"></td>');
        continue;
      }

      const info = getDayInfo(tahun, bulan, dayNum);
      const [code] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ["", "G", 0];
      const liburName = getLiburNasional(tahun, bulan, dayNum);
      const isMinggu = (d === 0);
      const isLibur = Boolean(liburName) || isMinggu;
      const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[info.pasaranId], WUKU[wukuId], isMinggu, isLibur, code);
      const tglJawa = getTanggalJawaLengkap(tahun, bulan, dayNum);

      cellsHtml.push(`
        <td style="border: 0.5pt solid #cbd5e1; height: 42pt; vertical-align: top; padding: 2.5pt; background-color: ${dinoWarna.cellBg};">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 8pt; color: ${isLibur ? '#dc2626' : '#1e293b'};">
            <span>${dayNum}</span>
            <span style="font-size: 6.5pt;">${dinoWarna.isIjo ? '✓ Becik' : '▲ Ala'}</span>
          </div>
          <div style="text-align: center; margin-top: 2pt; font-size: 7.5pt; font-weight: bold; color: #475569;">
            ${PASARAN[info.pasaranId]}
          </div>
          <div style="font-size: 6.5pt; text-align: center; color: #64748b; margin-top: 2pt;">
            ${tglJawa.tglJawa} ${tglJawa.bulanJawa}
          </div>
        </td>
      `);
    }

    rowsHtml.push(`
      <tr>
        <td style="border: 0.5pt solid #cbd5e1; text-align: center; font-weight: bold; font-size: 7pt; background-color: #f1f5f9; padding: 2pt;">
          ${wukuName}
        </td>
        ${cellsHtml.join('')}
      </tr>
    `);
  }

  return `
    <div style="padding: 18pt; font-family: 'Times New Roman', serif; color: #0f172a; max-width: 800pt; margin: 0 auto;">
      <!-- KOP KERATON RESMI -->
      <div style="text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 12pt;">
        <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5pt;">KALENDER JAWA SULTAN AGUNGAN</div>
        <div style="font-size: 11pt; font-style: italic; margin-top: 2pt;">${BULAN_MASEHI[bulan - 1].toUpperCase()} ${tahun} M  ·  ${cornerHijriYear} H</div>
        <div style="font-size: 7.5pt; color: #475569; margin-top: 2pt;">Pranata Mangsa, Pawukon, Pasaran &amp; Petungan Dina Kasultanan Surakarta - Ngayogyakarta</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff; font-size: 8pt; font-weight: bold;">
            <th style="padding: 4pt; width: 50pt;">WUKU</th>
            <th style="padding: 4pt; color: #f87171;">AHAD</th>
            <th style="padding: 4pt;">SENIN</th>
            <th style="padding: 4pt;">SELASA</th>
            <th style="padding: 4pt;">RABU</th>
            <th style="padding: 4pt;">KAMIS</th>
            <th style="padding: 4pt;">JUMAT</th>
            <th style="padding: 4pt;">SABTU</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>

      <div style="margin-top: 10pt; font-size: 7pt; color: #64748b; text-align: right; font-style: italic;">
        Kadhudhah otomatis lumantar Platform Budaya Luhur Jagad Jawa · jagad-jawa.web.app
      </div>
    </div>
  `;
}

export function printLaporanKalender(theme = 'monochrome') {
  const bulan = parseInt(document.getElementById('bulanSel')?.value || (new Date().getMonth() + 1));
  const tahun = parseInt(document.getElementById('tahunInput')?.value || new Date().getFullYear());
  const printDocHtml = renderLaporanKalenderPrintHtml(bulan, tahun);

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const customTitle = `Jagad Jawa — Kalender ${BULAN_MASEHI[bulan - 1]} ${tahun}`;
  if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}

export function downloadKalenderPng() {
  const bulanSel = document.getElementById('bulanSel');
  const tahunInput = document.getElementById('tahunInput');
  const bulan = parseInt(bulanSel?.value || (new Date().getMonth() + 1));
  const tahun = parseInt(tahunInput?.value || new Date().getFullYear());
  const namaBulan = BULAN_MASEHI[bulan - 1] || `Bulan-${bulan}`;
  const filename = `Kalender-Jawa-${namaBulan}-${tahun}.png`;

  if (typeof window.downloadElementAsPng === 'function') {
    window.downloadElementAsPng('kalenderCard', filename, '#f4ecd8');
  } else if (typeof window.html2canvas === 'function') {
    const target = document.getElementById('kalenderCard');
    if (!target) return;
    showToast('Sedang memproses gambar kalender resolusi tinggi...');
    window.html2canvas(target, { scale: 2, backgroundColor: '#f4ecd8' }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Gambar kalender kasil diunduh!');
    });
  }
}
