/**
 * Jagad Jawa — Modul Domain: Padewan UI (12 Batara-Batari)
 * Menampilkan galeri ensiklopedia dan modal detail interaktif untuk 12 Batara/Batari
 * siklus Padewan (watak, karier, kelemahan, kesehatan, keluarga, bahaya, dan solusi).
 */

import { MASTER_SIKLUS_PADEWAN } from '../../data/siklus-master-data.js';

let activePadewanNo = 1;

/**
 * Render daftar kartu 12 Batara-Batari di grid modal.
 * @param {number} [selectedNo=1]
 */
export function renderPadewanGrid(selectedNo = 1) {
  const grid = document.getElementById('gridPadewanList');
  if (!grid) return;

  activePadewanNo = selectedNo;
  const entries = Object.entries(MASTER_SIKLUS_PADEWAN);

  grid.innerHTML = entries.map(([numStr, d]) => {
    const num = parseInt(numStr, 10);
    const isSelected = (num === activePadewanNo);
    const borderCls = isSelected
      ? 'border-2 border-prada bg-gradient-to-r from-amber-950/80 via-keraton to-sogan-950 shadow-[0_0_15px_rgba(212,175,55,0.35)]'
      : 'border border-sogan-800 bg-keraton/60 hover:border-prada/60 hover:bg-keraton/90';

    return `
      <button
        type="button"
        onclick="window.selectPadewanCard && window.selectPadewanCard(${num})"
        class="w-full text-left p-2.5 rounded-xl transition flex items-center gap-3 cursor-pointer ${borderCls}">
        <div class="w-9 h-9 rounded-lg bg-sogan-950 border ${isSelected ? 'border-prada text-amber-300' : 'border-sogan-700 text-sogan-300'} flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-inner">
          ${num}
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-bold text-xs ${isSelected ? 'text-prada-light' : 'text-amber-100'} truncate">
            ${d.nama}
          </div>
          <div class="text-[10px] text-sogan-400 truncate">
            ${d.dewa}
          </div>
        </div>
        <div class="text-[10px] ${isSelected ? 'text-amber-400' : 'text-sogan-400'}">
          <i class="fa-solid fa-chevron-right text-[9px]"></i>
        </div>
      </button>
    `;
  }).join('');
}

/**
 * Render panel detail rincian untuk Batara/Batari yang dipilih.
 * @param {number} no (1..12)
 */
export function renderPadewanDetail(no) {
  const box = document.getElementById('detailPadewanBox');
  if (!box) return;

  const data = MASTER_SIKLUS_PADEWAN[no] || MASTER_SIKLUS_PADEWAN[1];
  activePadewanNo = no;

  box.innerHTML = `
    <div class="space-y-4 animate-fade-in text-xs">
      
      <!-- Header Dewa & Gelar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sogan-800 pb-3 bg-keraton/80 p-3.5 rounded-2xl border border-prada/30 shadow">
        <div class="flex items-center gap-3.5">
          <div class="w-16 h-20 rounded-xl bg-sogan-950 border border-prada/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            <img src="${data.gambar || 'assets/wayang/surakarta/gunungan.png'}" alt="${data.nama}" class="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" onerror="this.onerror=null; this.src='assets/wayang/surakarta/gunungan.png';" />
          </div>
          <div>
            <span class="text-[10px] uppercase font-mono tracking-wider text-prada font-bold block">
              Siklus Padewan #${no} &bull; Dewa Pelindung
            </span>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold gold-gradient-text">
              ${data.nama}
            </h3>
            <span class="text-[11px] text-sogan-300 font-medium">${data.dewa}</span>
          </div>
        </div>
        <div class="text-right hidden sm:block">
          <span class="px-2.5 py-1 rounded-full bg-sogan-950 border border-prada/40 text-[10px] text-prada font-mono">
            Siklus Umur % 12 = ${no === 12 ? 0 : no}
          </span>
        </div>
      </div>

      <!-- 1. Watak & Budi Pakarti -->
      <div class="p-3.5 rounded-xl bg-keraton/90 border border-amber-500/30 space-y-1">
        <span class="text-[10.5px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
          <i class="fa-solid fa-feather text-amber-400"></i> Watak &amp; Budi Pakarti
        </span>
        <p class="text-sogan-200 leading-relaxed">${data.watak}</p>
      </div>

      <!-- 2. Grid 2 Kolom: Karier & Kelemahan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3.5 rounded-xl bg-keraton/90 border border-emerald-900/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-briefcase text-emerald-400"></i> Karier &amp; Pakaryan
          </span>
          <p class="text-sogan-200 text-[11.5px] leading-relaxed">${data.karier}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-keraton/90 border border-rose-900/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Kelemahan (Mawas Diri)
          </span>
          <p class="text-sogan-200 text-[11.5px] leading-relaxed">${data.kelemahan}</p>
        </div>
      </div>

      <!-- 3. Grid 2 Kolom: Kesehatan & Keluarga -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3.5 rounded-xl bg-keraton/90 border border-cyan-900/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-cyan-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-heart-pulse text-cyan-400"></i> Kesehatan Raga &amp; Jiwa
          </span>
          <p class="text-sogan-200 text-[11.5px] leading-relaxed">${data.kesehatan}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-keraton/90 border border-pink-900/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-pink-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-house-chimney-user text-pink-400"></i> Keluarga &amp; Palakrama
          </span>
          <p class="text-sogan-200 text-[11.5px] leading-relaxed">${data.keluarga}</p>
        </div>
      </div>

      <!-- 4. Bahaya & Solusi Luhur -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-red-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-skull-crossbones text-red-400"></i> Bebaya &amp; Sengkala
          </span>
          <p class="text-red-100/90 text-[11.5px] leading-relaxed">${data.bahaya}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-amber-950/40 border border-prada/40 space-y-1">
          <span class="text-[10.5px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-shield-halved text-amber-400"></i> Solusi &amp; Tolak Balak
          </span>
          <p class="text-amber-100/90 text-[11.5px] leading-relaxed font-serif italic">${data.solusi}</p>
        </div>
      </div>

    </div>
  `;
}

/**
 * Memilih kartu Batara/Batari dari grid.
 * @param {number} no 
 */
export function selectPadewanCard(no) {
  renderPadewanGrid(no);
  renderPadewanDetail(no);
}

/**
 * Buka modal interaktif 12 Batara-Batari.
 * @param {number|string} [target=1]
 */
export function openPadewanModal(target = 1) {
  const modal = document.getElementById('modalPadewan');
  if (!modal) return;

  let targetNo = 1;
  if (typeof target === 'number') {
    targetNo = (target >= 1 && target <= 12) ? target : 1;
  } else if (typeof target === 'string') {
    const clean = target.toLowerCase().trim();
    for (let i = 1; i <= 12; i++) {
      const d = MASTER_SIKLUS_PADEWAN[i];
      if (d) {
        const nLower = d.nama.toLowerCase();
        const dLower = d.dewa.toLowerCase();
        if (nLower.includes(clean) || dLower.includes(clean) || clean.includes(nLower) || clean.includes(dLower)) {
          targetNo = i;
          break;
        }
      }
    }
  }

  renderPadewanGrid(targetNo);
  renderPadewanDetail(targetNo);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Tutup modal 12 Batara-Batari.
 */
export function closePadewanModal() {
  const modal = document.getElementById('modalPadewan');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

// Global window bindings
if (typeof window !== 'undefined') {
  window.openPadewanModal = openPadewanModal;
  window.closePadewanModal = closePadewanModal;
  window.selectPadewanCard = selectPadewanCard;
  window.renderPadewanGrid = renderPadewanGrid;
  window.renderPadewanDetail = renderPadewanDetail;
}
