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
  searchWukuWithCategory,
  getWukuDetailSummary,
  getWukuPetenget,
  illustrationPath
} from './wuku-engine.js';
import {
  SIKLUS12_SLUGS,
  resolveSiklus12
} from '../../data/dewa-kanon.js';
import { MASTER_SIKLUS_PADEWAN } from '../../data/siklus-master-data.js';
import { showToast } from '../../ui/toast.js';

let activeWukuNo = 1;
let currentWukuCategory = 'all';

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
        <div class="w-8 h-11 rounded-lg overflow-hidden border border-prada/30 bg-sogan-950 shrink-0 hidden sm:block shadow-sm">
          <img 
            src="${illustrationPath('wuku', w.nama_wuku)}" 
            alt="${w.nama_wuku}" 
            loading="lazy" 
            decoding="async" 
            class="w-full h-full" 
            style="aspect-ratio: 400/560; object-fit: cover;" 
            onerror="this.onerror=null; this.parentElement.classList.add('hidden');" 
          />
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
 * Mengatur filter kategori nujum (nambani, pangupajiwa, tetanen, ala_becik, all).
 * @param {string} category 
 */
export function setWukuCategoryFilter(category) {
  currentWukuCategory = category || 'all';

  // Sinkronkan styling pill aktif di tab maupun modal
  document.querySelectorAll('.wuku-cat-pill').forEach(btn => {
    const cat = btn.getAttribute('data-cat') || 'all';
    if (cat === currentWukuCategory) {
      btn.classList.remove('bg-sogan-950/80', 'text-sogan-300', 'border-sogan-800');
      btn.classList.add('bg-prada/20', 'text-prada', 'border-prada', 'shadow-[0_0_10px_rgba(212,175,55,0.25)]');
    } else {
      btn.classList.remove('bg-prada/20', 'text-prada', 'border-prada', 'shadow-[0_0_10px_rgba(212,175,55,0.25)]');
      btn.classList.add('bg-sogan-950/80', 'text-sogan-300', 'border-sogan-800');
    }
  });

  filterWukuGrid();
}

/**
 * Filter pencarian wuku saat pengguna mengetik atau mengganti kategori.
 * @param {HTMLInputElement} [inputElem]
 */
export function filterWukuGrid(inputElem) {
  const query = inputElem?.value ?? (document.getElementById('cariWukuInput')?.value || document.getElementById('tabCariWukuInput')?.value || '');
  const filtered = searchWukuWithCategory(query, currentWukuCategory);
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

      <!-- Galeri Ilustrasi Wuku & Dewane Kanon (Bersandingan) -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 p-3.5 rounded-2xl bg-keraton/70 border border-sogan-800/80 shadow-md">
        <!-- Kartu Gambar Wuku -->
        <div class="flex flex-col items-center space-y-2 text-center">
          <div class="relative w-full max-w-[200px] overflow-hidden rounded-xl border border-prada/40 bg-sogan-950 shadow-lg group">
            <img 
              src="${summary.imageWuku}" 
              alt="Wuku ${summary.nama}" 
              loading="lazy" 
              decoding="async" 
              class="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105" 
              style="aspect-ratio: 400/560; object-fit: cover;" 
              onerror="this.onerror=null; this.parentElement.classList.add('hidden');" 
            />
          </div>
          <div class="space-y-0.5">
            <span class="text-[11px] font-bold text-prada uppercase tracking-wider flex items-center justify-center gap-1">
              <i class="fa-solid fa-compass text-amber-400"></i> ${summary.nama}
            </span>
            <span class="text-[10px] text-sogan-400">Ilustrasi Lambang Wuku</span>
          </div>
        </div>

        <!-- Kartu Gambar Dewane (Interaktif Pop-up Detail Dewa) -->
        <div class="flex flex-col items-center space-y-2 text-center cursor-pointer group" onclick="window.openPadewanDetailModal ? window.openPadewanDetailModal('${summary.dewane}') : (window.openPadewanModal && window.openPadewanModal('${summary.dewane}'))" title="Klik kagem mirsani rincian mendalam Batara Dewane Wuku">
          <div class="relative w-full max-w-[200px] overflow-hidden rounded-xl border border-prada/40 bg-sogan-950 shadow-lg group-hover:border-prada group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">
            <img 
              src="${summary.imageDewane}" 
              alt="${summary.dewane}" 
              loading="lazy" 
              decoding="async" 
              class="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105" 
              style="aspect-ratio: 400/560; object-fit: cover;" 
              onerror="this.onerror=null; this.parentElement.classList.add('hidden');" 
            />
            <div class="absolute bottom-1.5 inset-x-1.5 py-1 px-2 rounded-lg bg-black/80 backdrop-blur-sm border border-prada/30 text-[9.5px] font-mono text-prada font-bold flex items-center justify-center gap-1 opacity-90 group-hover:opacity-100 transition">
              <i class="fa-solid fa-eye text-amber-400"></i> Klik Pop-up 12 Dewa
            </div>
          </div>
          <div class="space-y-0.5 max-w-full">
            <span class="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1 truncate px-1" title="${summary.dewane}">
              <i class="fa-solid fa-shield-halved text-amber-400"></i> ${summary.dewane.replace('Sang Hyang ', 'SH ')}
            </span>
            <span class="text-[10px] text-sogan-400 group-hover:text-amber-200 transition">Dewa Pangayom (Klik Detail)</span>
          </div>
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

      <!-- Seksi Petenget Nujum 4 Pilar (Ala-Becik, Nambani, Pangupajiwa, Tetanen) -->
      <div class="space-y-3 pt-2 border-t border-sogan-800/80">
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-scroll text-prada"></i> Petenget Nujum 4 Pilar Pawukon
          </span>
          <span class="text-[9.5px] font-mono px-2 py-0.5 rounded bg-sogan-900 text-prada border border-prada/30">
            Pituduh Tradisional
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          <!-- 1. Ala & Becik -->
          <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-sky-900/40 space-y-1.5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-sky-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-scale-balanced"></i> Ala &amp; Becik Wuku
              </span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-700/50 text-sky-300 font-mono">Pituduh Dina</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div>
                <span class="text-emerald-400 font-medium font-mono text-[10px] block">✓ Kang Becik:</span>
                <p class="text-sogan-200 leading-relaxed">${summary.alaBecik?.becik || '-'}</p>
              </div>
              <div class="pt-1 border-t border-sogan-900/60">
                <span class="text-rose-400 font-medium font-mono text-[10px] block">✗ Kang Ala (Sirikan):</span>
                <p class="text-sogan-300 leading-relaxed">${summary.alaBecik?.ala || '-'}</p>
              </div>
            </div>
          </div>

          <!-- 2. Nambani / Usada -->
          <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-emerald-900/40 space-y-1.5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-mortar-pestle"></i> Nambani (Usada &amp; Jamu)
              </span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-300 font-mono">Tamba Lara</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div>
                <span class="text-emerald-400 font-medium font-mono text-[10px] block">✓ Kang Becik:</span>
                <p class="text-sogan-200 leading-relaxed">${summary.nambani?.becik || '-'}</p>
              </div>
              <div class="pt-1 border-t border-sogan-900/60">
                <span class="text-rose-400 font-medium font-mono text-[10px] block">✗ Kang Ala (Sirikan):</span>
                <p class="text-sogan-300 leading-relaxed">${summary.nambani?.ala || '-'}</p>
              </div>
            </div>
          </div>

          <!-- 3. Pangupajiwa -->
          <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-amber-900/40 space-y-1.5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-coins"></i> Pangupajiwa (Panguripan)
              </span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-700/50 text-amber-300 font-mono">Rejeki</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div>
                <span class="text-emerald-400 font-medium font-mono text-[10px] block">✓ Kang Becik:</span>
                <p class="text-sogan-200 leading-relaxed">${summary.pangupajiwa?.becik || '-'}</p>
              </div>
              <div class="pt-1 border-t border-sogan-900/60">
                <span class="text-rose-400 font-medium font-mono text-[10px] block">✗ Kang Ala (Sirikan):</span>
                <p class="text-sogan-300 leading-relaxed">${summary.pangupajiwa?.ala || '-'}</p>
              </div>
            </div>
          </div>

          <!-- 4. Tetanen & Palawija -->
          <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-teal-900/40 space-y-1.5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-wheat-awn"></i> Tetanen (Tetanduran)
              </span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-teal-950 border border-teal-700/50 text-teal-300 font-mono">Palawija</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div>
                <span class="text-emerald-400 font-medium font-mono text-[10px] block">✓ Kang Becik Ditandur:</span>
                <p class="text-sogan-200 leading-relaxed">${summary.tetanen?.becik || '-'}</p>
              </div>
              <div class="pt-1 border-t border-sogan-900/60">
                <span class="text-rose-400 font-medium font-mono text-[10px] block">✗ Kang Ala (Sirikan):</span>
                <p class="text-sogan-300 leading-relaxed">${summary.tetanen?.ala || '-'}</p>
              </div>
            </div>
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
 * Merender Grid 12 Padewan Siklus Batara-Batari Kanon.
 * @param {string|HTMLElement} [containerId='tabWukuSiklus12Grid']
 */
export function renderSiklus12Grid(containerId = 'tabWukuSiklus12Grid') {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const html = `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
      ${SIKLUS12_SLUGS.map((slug, idx) => {
        const entry = resolveSiklus12(slug);
        const label = entry ? entry.label : `Batara ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
        const imgUrl = illustrationPath('siklus12', slug);
        const isBatari = entry?.gender === 'batari';
        const genderBadge = isBatari
          ? '<span class="text-[9.5px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold font-mono">Batari</span>'
          : '<span class="text-[9.5px] px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/60 font-semibold font-mono">Batara</span>';

        return `
          <div 
            onclick="window.openPadewanDetailModal && window.openPadewanDetailModal(${idx + 1})"
            class="p-3 rounded-2xl bg-wulung border border-sogan-800 hover:border-prada/80 hover:ring-2 hover:ring-prada/40 hover:scale-[1.03] transition flex flex-col items-center text-center space-y-2 group shadow-md cursor-pointer"
            title="Klik kagem mirsani rincian ${label}">
            <div class="relative w-full overflow-hidden rounded-xl border border-prada/30 bg-sogan-950/70 shadow">
              <img 
                src="${imgUrl}" 
                alt="${label}" 
                loading="lazy" 
                decoding="async" 
                class="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105" 
                style="aspect-ratio: 400/560; object-fit: cover;" 
                onerror="this.onerror=null; this.parentElement.classList.add('opacity-40');" 
              />
              <span class="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-keraton/90 border border-prada/40 text-prada font-mono font-bold text-[10px] flex items-center justify-center shadow">
                ${idx + 1}
              </span>
            </div>
            <div class="w-full space-y-1">
              <div class="font-marcellus text-xs font-bold text-amber-200 group-hover:text-prada transition truncate" title="${label}">
                ${label}
              </div>
              <div class="flex items-center justify-center">
                ${genderBadge}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  container.innerHTML = html;
}

export function openPadewanModal(dewaHighlight = '') {
  let modal = document.getElementById('modalPadewanSiklus12');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalPadewanSiklus12';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md transition-all duration-300';
    document.body.appendChild(modal);
  }

  const highlightNorm = (dewaHighlight || '').toLowerCase().replace('sang hyang', '').trim();

  modal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-gradient-to-b from-[#131826] to-[#0A0D15] border border-prada/60 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
      <div class="flex items-center justify-between px-6 py-4 border-b border-sogan-800 bg-[#0E131E]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-prada/20 border border-prada/60 flex items-center justify-center text-prada text-base shadow">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold gold-gradient-text">12 Padewan Siklus Batara-Batari Kanon</h3>
            <p class="text-xs text-sogan-400">Panguwasa Siklus Penanggalan &amp; Watak Kosmis Jawa (Klik kartu kagem mirsani rincian)</p>
          </div>
        </div>
        <button onclick="window.closePadewanModal && window.closePadewanModal()" class="w-8 h-8 rounded-full bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-prada flex items-center justify-center cursor-pointer transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-4 sm:p-6 overflow-y-auto max-h-[75vh] scrollbar-thin">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
          ${SIKLUS12_SLUGS.map((slug, idx) => {
            const entry = resolveSiklus12(slug);
            const label = entry ? entry.label : `Batara ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
            const imgUrl = illustrationPath('siklus12', slug);
            const isBatari = entry?.gender === 'batari';
            const isMatch = highlightNorm && label.toLowerCase().includes(highlightNorm);
            const genderBadge = isBatari
              ? '<span class="text-[9px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold font-mono">Batari</span>'
              : '<span class="text-[9px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 font-semibold font-mono">Batara</span>';

            return `
              <div 
                onclick="window.openPadewanDetailModal && window.openPadewanDetailModal(${idx + 1})"
                class="p-2.5 sm:p-3 rounded-2xl bg-[#0F1420] border ${isMatch ? 'border-prada ring-2 ring-prada/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-sogan-800/80'} hover:border-prada transition-all duration-200 hover:scale-[1.03] flex flex-col items-center text-center space-y-2 group shadow cursor-pointer"
                title="Klik kagem mirsani rincian ${label}">
                <div class="relative w-full overflow-hidden rounded-xl border border-prada/30 bg-sogan-950/70 shadow">
                  <img 
                    src="${imgUrl}" 
                    alt="${label}" 
                    loading="lazy" 
                    decoding="async" 
                    class="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105" 
                    style="aspect-ratio: 400/560; object-fit: cover;" 
                    onerror="this.onerror=null; this.parentElement.classList.add('opacity-40');" 
                  />
                  <span class="absolute top-1 left-1 w-5 h-5 rounded-md bg-keraton/90 border border-prada/40 text-prada font-mono font-bold text-[9.5px] flex items-center justify-center shadow">
                    ${idx + 1}
                  </span>
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="px-2 py-1 rounded-lg bg-keraton/90 border border-prada/60 text-prada text-[10px] font-bold shadow flex items-center gap-1">
                      <i class="fa-solid fa-eye text-[9px]"></i> Rincian
                    </span>
                  </div>
                </div>
                <div class="w-full space-y-1">
                  <div class="font-marcellus text-xs font-bold text-amber-200 group-hover:text-prada transition truncate" title="${label}">
                    ${label}
                  </div>
                  <div class="flex items-center justify-center">
                    ${genderBadge}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="px-6 py-3 border-t border-sogan-800 bg-[#0E131E] flex items-center justify-between text-xs text-sogan-400">
        <span>Kanon 12 Padewan Suryo dumugi Yamadipati</span>
        <button onclick="window.closePadewanModal && window.closePadewanModal()" class="px-4 py-1.5 rounded-xl bg-sogan-900 border border-prada/40 text-prada font-semibold text-xs hover:bg-sogan-800 transition cursor-pointer">
          Tutup
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

export function closePadewanModal() {
  const modal = document.getElementById('modalPadewanSiklus12');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Membuka pop-up modal rincian mendalam 1 dari 12 Dewa Siklus Padewan.
 * @param {number|string} target - Nomor urut 1..12, slug, atau nama dewa
 */
export function openPadewanDetailModal(target) {
  let order = 1;
  let slug = 'suryo';

  if (typeof target === 'number') {
    order = Math.max(1, Math.min(12, target));
    slug = SIKLUS12_SLUGS[order - 1] || 'suryo';
  } else if (typeof target === 'string') {
    const clean = target.toLowerCase().trim().replace(/^(sang hyang|batara|batari)\s+/, '');
    const idx = SIKLUS12_SLUGS.findIndex(s => s === clean || s.includes(clean));
    if (idx !== -1) {
      order = idx + 1;
      slug = SIKLUS12_SLUGS[idx];
    } else {
      const foundOrder = Object.keys(MASTER_SIKLUS_PADEWAN || {}).find(k => {
        const item = MASTER_SIKLUS_PADEWAN[k];
        return item.nama?.toLowerCase().includes(clean) || item.dewa?.toLowerCase().includes(clean);
      });
      if (foundOrder) {
        order = parseInt(foundOrder, 10);
        slug = SIKLUS12_SLUGS[order - 1] || 'suryo';
      }
    }
  }

  const dewaData = (MASTER_SIKLUS_PADEWAN && MASTER_SIKLUS_PADEWAN[order]) || {};
  const kanonEntry = resolveSiklus12(slug);
  const label = kanonEntry?.label || dewaData.nama || `Batara ${slug}`;
  const dewaGelar = dewaData.dewa || label;
  const isBatari = kanonEntry?.gender === 'batari' || label.startsWith('Batari');
  const imgUrl = illustrationPath('siklus12', slug) || dewaData.gambar;

  let detailModal = document.getElementById('modalPadewanDetail');
  if (!detailModal) {
    detailModal = document.createElement('div');
    detailModal.id = 'modalPadewanDetail';
    detailModal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md transition-all duration-300';
    document.body.appendChild(detailModal);
  }

  detailModal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-gradient-to-b from-[#131826] via-[#0E131E] to-[#080B12] border-2 border-prada/60 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.35)] overflow-hidden flex flex-col max-h-[94vh]">
      <!-- Header Detail Modal -->
      <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sogan-800 bg-[#0E131E]">
        <div class="flex items-center gap-3">
          <button
            type="button"
            onclick="window.closePadewanDetailModal && window.closePadewanDetailModal(); window.openPadewanModal && window.openPadewanModal();"
            class="px-3 py-1.5 rounded-xl bg-sogan-900 border border-prada/40 text-prada text-xs font-semibold hover:bg-sogan-800 transition flex items-center gap-1.5 cursor-pointer"
            title="Wangsul dhateng galeri 12 Padewan">
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            <span class="hidden sm:inline">Galeri 12</span>
          </button>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-keraton border border-prada/40 text-prada font-mono font-bold text-[10px]">
                Siklus ${order} / 12
              </span>
              <span class="text-[9.5px] px-2 py-0.5 rounded-full ${isBatari ? 'bg-rose-950 text-rose-300 border border-rose-800/60' : 'bg-sky-950 text-sky-300 border border-sky-800/60'} font-semibold font-mono">
                ${isBatari ? 'Batari' : 'Batara'}
              </span>
            </div>
            <h3 class="font-marcellus text-lg sm:text-2xl font-bold gold-gradient-text tracking-wide mt-0.5">
              ${label}
            </h3>
          </div>
        </div>
        <button
          onclick="window.closePadewanDetailModal && window.closePadewanDetailModal()"
          class="w-8 h-8 rounded-full bg-sogan-900 border border-sogan-700 text-sogan-300 hover:text-prada flex items-center justify-center cursor-pointer transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Body Modal: 2 Kolom (Gambar Kiri, Rincian Komprehensif Kanan) -->
      <div class="p-5 sm:p-6 overflow-y-auto max-h-[78vh] scrollbar-thin grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        <!-- Kolom Kiri: Kartu Ilustrasi Wayang / Kanon (4 cols) -->
        <div class="md:col-span-4 flex flex-col items-center space-y-3">
          <div class="relative w-full max-w-[240px] overflow-hidden rounded-2xl border-2 border-prada/50 bg-gradient-to-b from-sogan-950 to-keraton p-2 shadow-2xl">
            <img 
              src="${imgUrl}" 
              alt="${label}" 
              class="w-full h-auto rounded-xl object-cover shadow-inner"
              style="aspect-ratio: 400/560;"
              onerror="this.onerror=null; this.src='assets/wayang/surakarta/gunungan.png';"
            />
            <div class="absolute bottom-3 left-3 right-3 text-center px-2 py-1 rounded-xl bg-keraton/90 backdrop-blur-sm border border-prada/40">
              <span class="text-[11px] font-mono text-amber-200 font-bold block truncate">${dewaGelar}</span>
            </div>
          </div>
          <span class="text-[11px] text-sogan-400 font-mono text-center">
            Panguwasa Kanon Tahunan (Usia Modulo 12)
          </span>
        </div>

        <!-- Kolom Kanan: Rincian Lengkap (8 cols) -->
        <div class="md:col-span-8 space-y-3 text-xs leading-relaxed">
          
          <!-- Watak & Sifat Tahunan -->
          <div class="p-4 rounded-2xl bg-[#0F1420] border border-amber-600/30 space-y-1.5 shadow">
            <div class="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono tracking-wider">
              <i class="fa-solid fa-feather-pointed text-amber-400"></i> Watak &amp; Karakter Jiwa:
            </div>
            <p class="text-sogan-100">${dewaData.watak || '-'}</p>
          </div>

          <!-- Karier & Rejeki -->
          <div class="p-4 rounded-2xl bg-[#0F1420] border border-emerald-600/30 space-y-1.5 shadow">
            <div class="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase font-mono tracking-wider">
              <i class="fa-solid fa-coins text-emerald-400"></i> Karier, Pakaryan &amp; Rezeki:
            </div>
            <p class="text-sogan-100">${dewaData.karier || '-'}</p>
          </div>

          <!-- Kelemahan & Kerawanan Bahaya -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-700/40 space-y-1">
              <div class="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] uppercase font-mono">
                <i class="fa-solid fa-triangle-exclamation"></i> Titik Mawas Diri:
              </div>
              <p class="text-sogan-200 text-[11.5px]">${dewaData.kelemahan || '-'}</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-red-950/30 border border-red-700/40 space-y-1">
              <div class="flex items-center gap-1.5 text-red-300 font-bold text-[11px] uppercase font-mono">
                <i class="fa-solid fa-shield-halved"></i> Kerawanan / Bahaya:
              </div>
              <p class="text-sogan-200 text-[11.5px]">${dewaData.bahaya || '-'}</p>
            </div>
          </div>

          <!-- Pasutri & Kasarasan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-700/30 space-y-1">
              <div class="flex items-center gap-1.5 text-pink-300 font-bold text-[11px] uppercase font-mono">
                <i class="fa-solid fa-heart"></i> Jodoh &amp; Rumah Tangga:
              </div>
              <p class="text-sogan-200 text-[11.5px]">${dewaData.keluarga || '-'}</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-700/30 space-y-1">
              <div class="flex items-center gap-1.5 text-teal-300 font-bold text-[11px] uppercase font-mono">
                <i class="fa-solid fa-heart-pulse"></i> Kasarasan (Kesehatan):
              </div>
              <p class="text-sogan-200 text-[11.5px]">${dewaData.kesehatan || '-'}</p>
            </div>
          </div>

          <!-- Piweling Rahayu / Solusi -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-sogan-950 border border-prada/40 space-y-1.5 shadow">
            <div class="flex items-center gap-2 text-prada font-bold text-xs uppercase font-mono tracking-wider">
              <i class="fa-solid fa-circle-check text-amber-400"></i> Piweling Rahayu &amp; Solusi Luhur:
            </div>
            <p class="text-amber-100 italic font-marcellus text-sm leading-relaxed">
              "${dewaData.solusi || '-'}"
            </p>
          </div>

        </div>

      </div>

      <!-- Footer Detail Modal -->
      <div class="px-6 py-3.5 border-t border-sogan-800 bg-[#0E131E] flex items-center justify-between text-xs text-sogan-400">
        <span class="font-mono text-[11px]">Kanon Padewan Siklus Tahunan Jawa</span>
        <button
          onclick="window.closePadewanDetailModal && window.closePadewanDetailModal()"
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs hover:brightness-110 transition cursor-pointer">
          Tutup Rincian
        </button>
      </div>
    </div>
  `;

  detailModal.classList.remove('hidden');
  detailModal.classList.add('flex');
  detailModal.style.display = 'flex';
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function closePadewanDetailModal() {
  const detailModal = document.getElementById('modalPadewanDetail');
  if (detailModal) {
    detailModal.classList.add('hidden');
    detailModal.classList.remove('flex');
    detailModal.style.display = 'none';
  }
  const modal12 = document.getElementById('modalPadewanSiklus12');
  if ((!modal12 || modal12.classList.contains('hidden')) && typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Merender halaman Ensiklopedia Wuku secara penuh (untuk tab wuku mandiri).
 */
export function renderFullWukuPage() {
  renderWukuGrid(getAllWuku());
  selectWukuDetail(activeWukuNo || 1);
}

if (typeof window !== 'undefined') {
  window.renderSiklus12Grid = renderSiklus12Grid;
  window.renderFullWukuPage = renderFullWukuPage;
  window.selectWukuDetail = selectWukuDetail;
  window.filterWukuGrid = filterWukuGrid;
  window.setWukuCategoryFilter = setWukuCategoryFilter;
  window.openEnsiklopediaWukuModal = openEnsiklopediaWukuModal;
  window.closeEnsiklopediaWukuModal = closeEnsiklopediaWukuModal;
  window.openPadewanModal = openPadewanModal;
  window.closePadewanModal = closePadewanModal;
  window.openPadewanDetailModal = openPadewanDetailModal;
  window.closePadewanDetailModal = closePadewanDetailModal;
}


