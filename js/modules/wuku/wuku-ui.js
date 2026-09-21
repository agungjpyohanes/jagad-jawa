/**
 * Jagad Jawa — Modul Domain: Wuku UI (Ensiklopedia 30 Wuku Pawukon)
 * Pengendali interaksi DOM untuk modal penjelajah 30 Wuku Nusantara,
 * filter pencarian instan, dan rendering rincian mendalam tiap wuku.
 */

import {
  getAllWuku,
  getWukuByNumber,
  getWukuByName,
  searchWuku,
  getWukuDetailSummary
} from './wuku-engine.js';
import { showToast } from '../../ui/toast.js';

let activeWukuNo = 1;

/**
 * Membuka modal ensiklopedia 30 Wuku Nusantara.
 * @param {string|number} [initialWuku] Nomor atau nama wuku awal yang langsung dibuka
 */
export function openEnsiklopediaWukuModal(initialWuku) {
  const modal = document.getElementById('modalEnsiklopediaWuku');
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }

  renderWukuGrid(getAllWuku());

  if (initialWuku) {
    selectWukuDetail(initialWuku);
  } else {
    selectWukuDetail(activeWukuNo || 1);
  }

  // Fokuskan input pencarian jika ada
  const searchInput = document.getElementById('cariWukuInput');
  if (searchInput) {
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 100);
  }
}

/**
 * Menutup modal ensiklopedia wuku.
 */
export function closeEnsiklopediaWukuModal() {
  const modal = document.getElementById('modalEnsiklopediaWuku');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Merender daftar kartu grid 30 wuku (mendukung modal & halaman tab penuh).
 * @param {Array<Object>} list 
 */
export function renderWukuGrid(list) {
  const containerModal = document.getElementById('gridEnsiklopediaWuku');
  const containerTab = document.getElementById('tabWukuGrid');
  const containers = [containerModal, containerTab].filter(Boolean);
  if (containers.length === 0) return;

  if (!list || list.length === 0) {
    const emptyHtml = `
      <div class="col-span-full p-6 text-center text-xs text-sogan-400">
        <i class="fa-solid fa-circle-question text-lg mb-2 text-prada/60 block"></i>
        Mboten wonten wuku ingkang jumbuh kaliyan padosan sampeyan.
      </div>
    `;
    containers.forEach(c => { c.innerHTML = emptyHtml; });
    return;
  }

  const itemsHtml = list.map(w => {
    const isActive = w.no_wuku === activeWukuNo;
    const activeClass = isActive 
      ? 'border-prada bg-prada/15 shadow-[0_0_12px_rgba(212,175,55,0.35)]' 
      : 'border-sogan-800 bg-keraton hover:border-prada/60 hover:bg-sogan-900/40';

    return `
      <button onclick="window.selectWukuDetail(${w.no_wuku})"
        id="wukuCard-${w.no_wuku}"
        class="wuku-card-btn p-2 sm:p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer active:scale-95 ${activeClass}">
        <div class="w-7 h-7 rounded-lg bg-sogan-950 border border-prada/40 flex items-center justify-center font-mono font-bold text-xs text-prada shrink-0">
          ${w.no_wuku}
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-bold text-xs text-sogan-100 truncate">${w.nama_wuku}</div>
          <div class="text-[10px] text-sogan-400 truncate">${w.dewane ? w.dewane.split('(')[0].replace('Sang Hyang', 'SH').trim() : '-'}</div>
        </div>
      </button>
    `;
  }).join('');

  containers.forEach(c => { c.innerHTML = itemsHtml; });
}

/**
 * Filter pencarian wuku saat pengguna mengetik.
 * @param {HTMLInputElement} [inputElem]
 */
export function filterWukuGrid(inputElem) {
  const query = inputElem?.value ?? (document.getElementById('cariWukuInput')?.value || document.getElementById('tabCariWukuInput')?.value || '');
  const filtered = searchWuku(query);
  renderWukuGrid(filtered);
}

/**
 * Memilih dan menampilkan rincian mendalam wuku yang diklik.
 * @param {number|string} noOrName 
 */
export function selectWukuDetail(noOrName) {
  const summary = getWukuDetailSummary(noOrName);
  if (!summary) return;

  activeWukuNo = summary.no;

  // Perbarui styling aktif pada grid kartu di seluruh container
  document.querySelectorAll('.wuku-card-btn').forEach(btn => {
    btn.classList.remove('border-prada', 'bg-prada/15', 'shadow-[0_0_12px_rgba(212,175,55,0.35)]');
    btn.classList.add('border-sogan-800', 'bg-keraton');
  });
  document.querySelectorAll(`[id="wukuCard-${summary.no}"]`).forEach(activeBtn => {
    activeBtn.classList.remove('border-sogan-800', 'bg-keraton');
    activeBtn.classList.add('border-prada', 'bg-prada/15', 'shadow-[0_0_12px_rgba(212,175,55,0.35)]');
  });

  const detailBoxes = [
    document.getElementById('detailEnsiklopediaWukuBox'),
    document.getElementById('tabWukuDetailBox')
  ].filter(Boolean);
  if (detailBoxes.length === 0) return;

  const htmlContent = `
    <div class="space-y-4 text-xs">
      
      <!-- Header Wuku -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sogan-800 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-prada via-sogan-500 to-sogan-900 border border-prada text-keraton font-mono font-black text-lg flex items-center justify-center shadow">
            ${summary.no}
          </div>
          <div>
            <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">WUKU KAPING ${summary.no} SAKING 30</span>
            <h3 class="font-marcellus text-xl sm:text-2xl font-bold gold-gradient-text">${summary.nama}</h3>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-sogan-900 border border-prada/50 text-prada font-medium text-[11px] flex items-center gap-1.5">
            <i class="fa-solid fa-shield-halved text-amber-400"></i> ${summary.dewane}
          </span>
        </div>
      </div>

      <!-- Watak & Bebaya Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        <!-- Watak Budi Pangerti -->
        <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1 tracking-wider">
            <i class="fa-solid fa-feather-pointed"></i> Watak Budi Pangerti
          </span>
          <p class="text-sogan-200 leading-relaxed text-[11.5px]">${summary.watak}</p>
        </div>

        <!-- Bilahi & Bebaya -->
        <div class="p-3.5 rounded-xl bg-keraton border border-amber-900/50 space-y-1">
          <span class="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 tracking-wider">
            <i class="fa-solid fa-triangle-exclamation"></i> Bilahi &amp; Bebaya Kultural
          </span>
          <p class="text-amber-100/90 leading-relaxed text-[11.5px]">${summary.bilahi}</p>
        </div>
      </div>

      <!-- Sesaji Ruwat & Selamatan -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <!-- Sesaji Ruwat -->
        <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/80 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada block tracking-wider">
            <i class="fa-solid fa-fire-burner mr-1"></i> Sesaji Ruwat:
          </span>
          <p class="text-sogan-300 leading-relaxed">${summary.sesaji}</p>
          <div class="text-[10px] text-sogan-400 pt-1 border-t border-sogan-900 mt-1">
            Tindih: <strong class="text-prada font-mono">${summary.tindih}</strong>
          </div>
        </div>

        <!-- Boga Selamatan -->
        <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/80 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada block tracking-wider">
            <i class="fa-solid fa-bowl-rice mr-1"></i> Boga Slametan:
          </span>
          <p class="text-sogan-300 leading-relaxed">${summary.sega}</p>
          <div class="text-[10px] text-sogan-400 pt-1 border-t border-sogan-900 mt-1">
            Iwak: <span class="text-sogan-200">${summary.iwak}</span>
          </div>
        </div>

        <!-- Donga & Herbal -->
        <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/80 space-y-1">
          <span class="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
            <i class="fa-solid fa-leaf mr-1"></i> Jamu &amp; Pangupaya:
          </span>
          <div class="text-sogan-300 leading-relaxed">
            Tamba: <span class="text-emerald-300 font-medium">${summary.tamba}</span>
          </div>
          <div class="text-[10px] text-sogan-400 pt-1 border-t border-sogan-900 mt-1">
            Donga: <strong class="text-prada">${summary.donga}</strong> · Profesi: <em>${summary.pangupaya}</em>
          </div>
        </div>
      </div>

    </div>
  `;

  detailBoxes.forEach(box => {
    box.innerHTML = htmlContent;
  });
}

/**
 * Merender halaman Ensiklopedia Wuku secara penuh (untuk tab wuku mandiri).
 */
export function renderFullWukuPage() {
  renderWukuGrid(getAllWuku());
  selectWukuDetail(activeWukuNo || 1);
}

