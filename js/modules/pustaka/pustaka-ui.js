/**
 * Jagad Jawa — Modul Domain: Pustaka UI
 * Pengendali DOM untuk Pustaka Dongo, Wirid, Semedi, Ruwatan & Ubarampe Jawa.
 * Mengintegrasikan Kautamaning Laku, Ramuan Obat Tradisional, dan Aji Rajah Kalacakra.
 * Menyediakan filter kategori, pencarian responsif, pembaca doa interaktif,
 * dan personalisasi nama langsung ke dalam rapalan doa.
 */

import {
  getPustakaKategoriList,
  getPustakaKategoriById,
  getAllPustakaEntri,
  getPustakaEntriById,
  searchPustakaEntri,
  hasNamePlaceholder,
  personalizeDoaLines,
  formatDoaPlainText,
  getPustakaRelatedEntri,
  PLACEHOLDER_NAMA_REGEX
} from './pustaka-engine.js';

import {
  getKautamaningLakuList,
  searchKautamaningLaku,
  getRamuanObatList,
  searchRamuanObat,
  getAjiRajahKalacakra
} from '../../data/pustaka-jawa-db.js';

import { showToast, copyToClipboard } from '../../ui/toast.js';

let currentPustakaSubtab = 'dongo'; // 'dongo' | 'kautaman' | 'usada' | 'kalacakra'
let currentPustakaContainerId = 'pustakaContainer';
let currentKategori = 'kabeh';
let currentSearchQuery = '';
let currentKautamanQuery = '';
let currentUsadaQuery = '';
let currentUsadaPenyakit = 'kabeh';
let activeReaderEntriId = null;
let currentReaderName = '';

/**
 * Mendapatkan tema warna badge berdasarkan kategori.
 * @param {string} kategoriId 
 * @returns {{bg: string, border: string, text: string, icon: string}}
 */
function getKategoriTheme(kategoriId) {
  switch (kategoriId) {
    case 'wirid-harian':
      return { bg: 'bg-emerald-950/60', border: 'border-emerald-600/50', text: 'text-emerald-300', icon: 'fa-sun' };
    case 'sesuci':
      return { bg: 'bg-cyan-950/60', border: 'border-cyan-600/50', text: 'text-cyan-300', icon: 'fa-water' };
    case 'semedi':
      return { bg: 'bg-purple-950/60', border: 'border-purple-600/50', text: 'text-purple-300', icon: 'fa-spa' };
    case 'ruwatan':
      return { bg: 'bg-amber-950/60', border: 'border-amber-600/50', text: 'text-amber-300', icon: 'fa-shield-halved' };
    case 'wulan-suro':
      return { bg: 'bg-rose-950/60', border: 'border-rose-600/50', text: 'text-rose-300', icon: 'fa-moon' };
    default:
      return { bg: 'bg-sogan-900/60', border: 'border-prada/40', text: 'text-prada', icon: 'fa-book-open' };
  }
}

/**
 * Format label bahasa untuk kartu.
 * @param {Array<string>} bahasaList 
 * @returns {string}
 */
function formatBahasaBadges(bahasaList) {
  if (!Array.isArray(bahasaList)) return '';
  return bahasaList.map(b => {
    let lbl = b.toUpperCase();
    if (b === 'jw') lbl = 'Basa Jawa';
    if (b === 'id') lbl = 'Indonesia';
    if (b === 'mantra') lbl = 'Mantra';
    return `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sogan-950 border border-sogan-800 text-sogan-300">${lbl}</span>`;
  }).join(' ');
}

/**
 * Inisialisasi tampilan Pustaka.
 * @param {string} [containerId='pustakaContainer']
 */
export function initPustakaUI(containerId = 'pustakaContainer') {
  if (containerId) currentPustakaContainerId = containerId;
  const container = document.getElementById(containerId) ||
                    document.getElementById(currentPustakaContainerId) ||
                    document.getElementById('sinengkerEmbeddedPustaka') ||
                    document.getElementById('pustakaContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header Pustaka -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-prada/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prada/15 border border-prada/50 text-prada text-xs font-mono tracking-wider uppercase font-semibold">
            <i class="fa-solid fa-book-bookmark text-prada-light"></i>
            Koleksi Doa, Wiridan &amp; USADA
          </div>
          <h2 class="font-marcellus text-2xl sm:text-4xl font-bold gold-gradient-text">
            Pustaka Dongo, Usada &amp; Laku Jawa
          </h2>
          <p class="text-xs sm:text-sm text-sogan-200 max-w-3xl leading-relaxed">
            Kumpulan komprehensif rapalan donga harian, adus keramas sesuci badan, semedi sukma sadulur papat kalima pancer, ruwatan weton, 12 kautamaning laku, 10 ramuan usada herbal tradisional, sarta Aji Rajah Kalacakra.
          </p>
        </div>
      </div>

      <!-- Subtab Navigation Bar (Multi-Row Responsive Wrap) -->
      <div class="flex flex-wrap items-center gap-2 pb-2 border-b border-sogan-800/80">
        <button
          type="button"
          onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('dongo')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'dongo' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-scroll"></i> Dongo &amp; Wiridan (12)
        </button>
        <button
          type="button"
          onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('kautaman')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'kautaman' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-feather-pointed"></i> Kautamaning Laku (12)
        </button>
        <button
          type="button"
          onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('usada')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'usada' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-mortar-pestle"></i> Usada &amp; Tamba (10)
        </button>
        <button
          type="button"
          onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('kalacakra')"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'kalacakra' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
          <i class="fa-solid fa-shield-halved"></i> Aji Rajah Kalacakra
        </button>
      </div>

      <!-- Container Subtab Content -->
      <div id="pustakaSubtabContent" class="space-y-6">
        <!-- Dirender oleh renderPustakaCurrentSubtab() -->
      </div>
    </div>
  `;

  renderPustakaCurrentSubtab();
}

/**
 * Ganti sub-tab aktif di dalam modul Pustaka
 * @param {'dongo' | 'kautaman' | 'usada' | 'kalacakra'} subtab 
 */
export function switchPustakaSubtab(subtab) {
  currentPustakaSubtab = subtab;
  const targetId = (document.getElementById(currentPustakaContainerId) ? currentPustakaContainerId : null) ||
                   (document.getElementById('sinengkerEmbeddedPustaka') ? 'sinengkerEmbeddedPustaka' : 'pustakaContainer');
  initPustakaUI(targetId);
}

/**
 * Render konten subtab pustaka aktif
 */
function renderPustakaCurrentSubtab() {
  const container = document.getElementById('pustakaSubtabContent');
  if (!container) return;

  switch (currentPustakaSubtab) {
    case 'kautaman':
      renderPustakaKautamanView(container);
      break;
    case 'usada':
      renderPustakaUsadaView(container);
      break;
    case 'kalacakra':
      renderPustakaKalacakraView(container);
      break;
    case 'dongo':
    default:
      renderPustakaDongoView(container);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VIEW DONGO & WIRIDAN (12 DOKUMEN ASLI)
// ─────────────────────────────────────────────────────────────────────────────

function renderPustakaDongoView(container) {
  const kategoris = getPustakaKategoriList();

  container.innerHTML = `
    <!-- Control Bar: Kategori & Search Bar -->
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="pustakaSearchInput"
          value="${currentSearchQuery}"
          oninput="window.onPustakaSearchInput && window.onPustakaSearchInput(this.value)"
          placeholder="Goleki donga, wirid, niyat, tembung kunci (tuladha: 'ruwatan', 'adus', 'suro', 'legi')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        <button
          id="pustakaSearchClearBtn"
          onclick="window.clearPustakaSearch && window.clearPustakaSearch()"
          class="${currentSearchQuery ? 'block' : 'hidden'} absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition"
          title="Resiki telusuran">
          <i class="fa-solid fa-circle-xmark"></i>
        </button>
      </div>

      <!-- Category Pills Switcher (Multi-Row Wrap) -->
      <div class="flex flex-wrap items-center gap-2 pb-2">
        <button
          onclick="window.switchPustakaKategori && window.switchPustakaKategori('kabeh')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${currentKategori === 'kabeh' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada hover:border-prada/40'}">
          <i class="fa-solid fa-layer-group"></i> Sedaya Kategori (12)
        </button>
        ${kategoris.map(k => {
          const count = getAllPustakaEntri().filter(e => e.kategori === k.id).length;
          const theme = getKategoriTheme(k.id);
          const isActive = (currentKategori === k.id);
          return `
            <button
              onclick="window.switchPustakaKategori && window.switchPustakaKategori('${k.id}')"
              class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${isActive ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada hover:border-prada/40'}">
              <i class="fa-solid ${theme.icon}"></i> ${k.nama} (${count})
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Status Bar & Count -->
    <div id="pustakaStatusRow" class="flex items-center justify-between text-xs text-sogan-400 px-1">
      <!-- Akan diupdate oleh renderPustakaCards -->
    </div>

    <!-- Card Grid Container -->
    <div id="pustakaCardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- Diisi oleh renderPustakaCards -->
    </div>
  `;

  renderPustakaCards();
}

/**
 * Render kartu-kartu entri pustaka ke grid.
 */
export function renderPustakaCards() {
  const grid = document.getElementById('pustakaCardsGrid');
  const statusRow = document.getElementById('pustakaStatusRow');
  if (!grid) return;

  const entries = searchPustakaEntri({
    kategori: currentKategori,
    query: currentSearchQuery
  });

  if (statusRow) {
    const katName = currentKategori === 'kabeh' ? 'Sedaya Kategori' : (getPustakaKategoriById(currentKategori)?.nama || currentKategori);
    statusRow.innerHTML = `
      <div>
        Nampilaken <strong class="text-prada">${entries.length}</strong> donga ing <strong class="text-sogan-200">${katName}</strong>
        ${currentSearchQuery ? ` · Kata kunci: <em class="text-amber-300">"${currentSearchQuery}"</em>` : ''}
      </div>
      ${currentSearchQuery ? `
        <button onclick="window.clearPustakaSearch && window.clearPustakaSearch()" class="text-prada hover:underline font-mono text-[11px]">
          Reset Filter
        </button>` : ''}
    `;
  }

  if (entries.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 px-6 rounded-3xl bg-sogan-950/50 border border-sogan-800 text-center space-y-3">
        <div class="w-14 h-14 mx-auto rounded-full bg-sogan-900/80 border border-prada/30 flex items-center justify-center text-prada text-2xl">
          <i class="fa-solid fa-feather"></i>
        </div>
        <h4 class="font-marcellus text-lg text-sogan-100 font-bold">Mboten Wonten Donga Ingkang Mathuk</h4>
        <p class="text-xs text-sogan-400 max-w-md mx-auto">
          Panyuwunan panjenengan mboten manggihi asil. Cobi gantos tembung kunci utawi pilih Sedaya Kategori.
        </p>
        <button onclick="window.clearPustakaSearch && window.clearPustakaSearch()" class="mt-2 px-4 py-2 rounded-xl bg-sogan-900 border border-prada/50 text-prada text-xs font-semibold hover:bg-sogan-800 transition">
          Tampilaken Sedaya Donga
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = entries.map(entri => {
    const kat = getPustakaKategoriById(entri.kategori);
    const theme = getKategoriTheme(entri.kategori);
    const hasName = hasNamePlaceholder(entri);
    const partsCount = Array.isArray(entri.bagian) ? entri.bagian.length : 1;

    return `
      <article class="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#121722] to-[#0A0D14] border border-sogan-800/80 hover:border-prada/60 transition-all duration-300 p-5 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group">
        <div class="space-y-3.5">
          <!-- Top Row: Kategori & Badges -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${theme.bg} ${theme.border} ${theme.text} border">
              <i class="fa-solid ${theme.icon} text-[10px]"></i>
              ${kat?.nama || entri.kategori}
            </span>
            <div class="flex items-center gap-1.5">
              ${formatBahasaBadges(entri.bahasa)}
            </div>
          </div>

          <!-- Judul & Subjudul -->
          <div>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-sogan-100 group-hover:text-prada transition-colors leading-snug">
              ${entri.judul}
            </h3>
            ${entri.subjudul ? `
              <p class="text-xs text-sogan-400 italic mt-0.5 line-clamp-1">
                ${entri.subjudul}
              </p>` : ''}
          </div>

          <!-- Ringkasan Deskripsi -->
          <p class="text-xs text-sogan-300 leading-relaxed line-clamp-3">
            ${entri.ringkasan || ''}
          </p>

          <!-- Metadata Badges -->
          <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-sogan-800/60 text-[11px] text-sogan-400">
            ${entri.waktu_pakai ? `
              <span class="inline-flex items-center gap-1">
                <i class="fa-regular fa-clock text-prada/70"></i> ${entri.waktu_pakai}
              </span>` : ''}
            <span class="text-sogan-600">·</span>
            <span>${partsCount} Perangan</span>
            ${hasName ? `
              <span class="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-600/40">
                <i class="fa-solid fa-pen-nib"></i> Isian Nama
              </span>` : ''}
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-4 mt-2">
          <button
            onclick="window.openPustakaReader && window.openPustakaReader('${entri.id}')"
            class="w-full py-2.5 px-4 rounded-xl bg-sogan-950 hover:bg-gradient-to-r hover:from-sogan-700 hover:to-prada hover:text-keraton text-prada border border-prada/40 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow cursor-pointer">
            <i class="fa-solid fa-book-open"></i> Waca &amp; Rapal Donga
          </button>
        </div>
      </article>
    `;
  }).join('');
}

export function switchPustakaKategori(katId) {
  currentKategori = katId;
  renderPustakaCards();
}

export function onPustakaSearchInput(val) {
  currentSearchQuery = val;
  const clearBtn = document.getElementById('pustakaSearchClearBtn');
  if (clearBtn) {
    if (val) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }
  renderPustakaCards();
}

export function clearPustakaSearch() {
  currentSearchQuery = '';
  const input = document.getElementById('pustakaSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('pustakaSearchClearBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderPustakaCards();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VIEW KAUTAMANING LAKU (12 PIWULANG MORAL JAWA)
// ─────────────────────────────────────────────────────────────────────────────

function renderPustakaKautamanView(container) {
  const teachings = searchKautamaningLaku(currentKautamanQuery);

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Search Bar Kautaman -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="kautamanSearchInput"
          value="${currentKautamanQuery}"
          oninput="window.onKautamanSearch && window.onKautamanSearch(this.value)"
          placeholder="Goleki piwulang kautamaning laku, tembung kunci (tuladha: 'sarak', 'eling', 'kabecikan', 'prang sabil')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        ${currentKautamanQuery ? `
          <button onclick="window.onKautamanSearch(''); document.getElementById('kautamanSearchInput').value = '';" class="absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>` : ''}
      </div>

      <!-- Info Row -->
      <div class="flex items-center justify-between text-xs text-sogan-400 px-1">
        <span>Nampilaken <strong class="text-prada">${teachings.length}</strong> Butir Piwulang Kautamaning Laku</span>
        <span class="font-mono text-[11px] text-amber-300/80">Filsafat &amp; Budi Pekerti Luhur</span>
      </div>

      <!-- Grid Cards Kautaman -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${teachings.map(item => `
          <div class="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#131926] to-[#0A0D14] border border-sogan-800/90 hover:border-prada/70 transition-all duration-300 p-5 shadow-lg group">
            <div class="space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-feather text-[10px]"></i> Piwulang ${item.id}
                </span>
                <button
                  onclick="window.copyKautamanItem && window.copyKautamanItem(${item.id})"
                  class="text-xs text-sogan-400 hover:text-prada transition flex items-center gap-1 p-1"
                  title="Salin piwulang iki">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>

              <!-- Teks Jawa Filosofis -->
              <blockquote class="font-marcellus text-sm sm:text-base text-amber-100 font-semibold leading-relaxed border-l-2 border-prada/60 pl-3 italic">
                "${item.teks_jawa}"
              </blockquote>

              <!-- Makna Bahasa Indonesia -->
              <div class="pt-2 border-t border-sogan-800/60 text-xs text-sogan-300 leading-relaxed">
                <strong class="text-prada block text-[11px] uppercase tracking-wider mb-1">
                  <i class="fa-solid fa-lightbulb text-amber-400 mr-1"></i> Makna Piwulang:
                </strong>
                ${item.makna}
              </div>
            </div>

            <!-- Footer Action -->
            <div class="pt-4 mt-3">
              <button
                onclick="window.copyKautamanItem && window.copyKautamanItem(${item.id})"
                class="w-full py-2 px-3 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-sogan-800 hover:border-prada/50 text-sogan-200 hover:text-prada text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                <i class="fa-solid fa-copy text-xs"></i> Salin Ajaran
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function onKautamanSearch(query) {
  currentKautamanQuery = query;
  const container = document.getElementById('pustakaSubtabContent');
  if (container) renderPustakaKautamanView(container);
}

export function copyKautamanItem(id) {
  const list = getKautamaningLakuList();
  const item = list.find(x => x.id === id);
  if (!item) return;
  const text = `📜 *KAUTAMANING LAKU — PIWULANG ${item.id}*\n\n"${item.teks_jawa}"\n\n💡 *Makna:*\n${item.makna}\n\nKadhudhah saking Pustaka Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, `Piwulang ${item.id} kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VIEW USADA & TAMBA TRADISIONAL (10 RESEP RAMUAN HERBAL)
// ─────────────────────────────────────────────────────────────────────────────

function renderPustakaUsadaView(container) {
  const allUsada = getRamuanObatList();
  let list = searchRamuanObat(currentUsadaQuery);

  if (currentUsadaPenyakit !== 'kabeh') {
    list = list.filter(item => item.id === currentUsadaPenyakit || item.penyakit.toLowerCase().includes(currentUsadaPenyakit.toLowerCase()));
  }

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Search Bar Usada -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="usadaSearchInput"
          value="${currentUsadaQuery}"
          oninput="window.onUsadaSearch && window.onUsadaSearch(this.value)"
          placeholder="Goleki usada/tamba herbal (tuladha: 'jantung', 'ceplukan', 'kudis', 'fosil', 'ginjal')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        ${currentUsadaQuery ? `
          <button onclick="window.onUsadaSearch(''); document.getElementById('usadaSearchInput').value = '';" class="absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>` : ''}
      </div>

      <!-- Quick Filter Penyakit (Multi-Row Wrap) -->
      <div class="flex flex-wrap items-center gap-2 pb-2">
        <button
          onclick="window.filterUsadaPenyakit && window.filterUsadaPenyakit('kabeh')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${currentUsadaPenyakit === 'kabeh' ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white font-bold shadow' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-emerald-300'}">
          <i class="fa-solid fa-leaf"></i> Sedaya Resep (10)
        </button>
        ${allUsada.map(u => `
          <button
            onclick="window.filterUsadaPenyakit && window.filterUsadaPenyakit('${u.id || u.penyakit}')"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${(currentUsadaPenyakit === (u.id || u.penyakit)) ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white font-bold shadow' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-emerald-300'}">
            <i class="fa-solid fa-capsules text-[10px]"></i> ${u.penyakit}
          </button>
        `).join('')}
      </div>

      <!-- Info Row -->
      <div class="flex items-center justify-between text-xs text-sogan-400 px-1">
        <span>Nampilaken <strong class="text-emerald-400">${list.length}</strong> Resep Usada Tradisional</span>
        <span class="text-amber-300/80 font-mono text-[11px]">Resep Asli Naskah Usada Kasultanan</span>
      </div>

      <!-- Grid Cards Usada -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${list.map(u => `
          <div class="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#101b1e] to-[#0A0D14] border border-teal-900/60 hover:border-emerald-500/60 transition-all duration-300 p-5 shadow-lg group">
            <div class="space-y-4">
              <!-- Top Row: Penyakit Badge -->
              <div class="flex items-center justify-between gap-2">
                <span class="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow">
                  <i class="fa-solid fa-mortar-pestle"></i> ${u.penyakit}
                </span>
                <span class="text-[11px] font-mono text-sogan-400">${u.bahan.length} Bahan</span>
              </div>

              <!-- Daftar Bahan-bahan Herbal -->
              <div class="space-y-2">
                <span class="text-[11px] font-bold text-prada uppercase tracking-wider block">
                  <i class="fa-solid fa-seedling text-emerald-400 mr-1"></i> Racikan Bahan:
                </span>
                <div class="flex flex-wrap gap-1.5">
                  ${u.bahan.map(b => `
                    <span class="px-2.5 py-1 rounded-md text-xs bg-sogan-950/80 border border-sogan-800 text-sogan-200">
                      ${b}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Tata Cara Pengolahan / Keterangan Aplikasi -->
              ${u.keterangan_aplikasi ? `
              <div class="p-3 rounded-xl bg-teal-950/40 border border-teal-700/40 text-xs text-teal-200 leading-relaxed">
                <strong class="text-teal-300 block mb-0.5"><i class="fa-solid fa-hand-holding-medical mr-1"></i> Cara Racik &amp; Pemakaian:</strong>
                ${u.keterangan_aplikasi}
              </div>` : ''}

              <!-- Catatan Khusus -->
              ${u.catatan ? `
              <div class="p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-[11px] text-amber-200 flex items-start gap-2">
                <i class="fa-solid fa-circle-exclamation text-amber-400 mt-0.5 shrink-0"></i>
                <div>
                  <strong>Catatan Khusus:</strong> ${u.catatan}
                </div>
              </div>` : ''}
            </div>

            <!-- Action Button -->
            <div class="pt-4 mt-3">
              <button
                onclick="window.copyUsadaItem && window.copyUsadaItem('${u.penyakit}')"
                class="w-full py-2 px-3 rounded-xl bg-sogan-950 hover:bg-emerald-950/60 border border-teal-800/80 hover:border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                <i class="fa-solid fa-copy text-xs"></i> Salin Resep Usada
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function onUsadaSearch(query) {
  currentUsadaQuery = query;
  const container = document.getElementById('pustakaSubtabContent');
  if (container) renderPustakaUsadaView(container);
}

export function filterUsadaPenyakit(penyakit) {
  currentUsadaPenyakit = penyakit;
  const container = document.getElementById('pustakaSubtabContent');
  if (container) renderPustakaUsadaView(container);
}

export function copyUsadaItem(penyakit) {
  const list = getRamuanObatList();
  const u = list.find(x => x.penyakit === penyakit || x.id === penyakit);
  if (!u) return;

  let text = `🌿 *RESEP USADA TRADISIONAL JAWA: ${u.penyakit}*\n\n`;
  text += `📋 *Racikan Bahan:*\n`;
  u.bahan.forEach((b, i) => {
    text += `${i + 1}. ${b}\n`;
  });
  if (u.keterangan_aplikasi) {
    text += `\n🍶 *Tata Cara Pemakaian:*\n${u.keterangan_aplikasi}\n`;
  }
  if (u.catatan) {
    text += `\n⚠️ *Catatan:* ${u.catatan}\n`;
  }
  text += `\nKadhudhah saking Pustaka Jagad Jawa\nhttps://jagad-jawa.web.app`;

  copyToClipboard(text, `Resep ramuan ${u.penyakit} kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VIEW AJI RAJAH KALACAKRA (8 BAIT MANTRA PEMBALIK SENGKALA)
// ─────────────────────────────────────────────────────────────────────────────

function renderPustakaKalacakraView(container) {
  const rajah = getAjiRajahKalacakra();

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Sacred Intro Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-[#181324] to-[#0A0D14] border border-amber-600/50 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-8 -top-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <i class="fa-solid fa-shield-halved"></i> Rajah Dada Batara Kala &amp; Batara Wisnu
          </div>
          <h3 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text">
            ${rajah.judul}
          </h3>
          <p class="text-xs sm:text-sm text-sogan-200 leading-relaxed max-w-3xl">
            ${rajah.keterangan} ${rajah.filosofi}
          </p>
        </div>
      </div>

      <!-- 8 Bait Mantra Cards in Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${rajah.mantra_bait.map((b, idx) => `
          <div class="rounded-2xl bg-gradient-to-b from-[#181d2a] to-[#0B0F19] border border-amber-600/40 p-5 shadow-lg space-y-3 hover:border-prada transition duration-300">
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-full bg-prada/20 border border-prada/50 text-prada font-bold text-xs flex items-center justify-center font-mono">
                ${idx + 1}
              </span>
              <span class="text-[10px] uppercase font-mono text-amber-300/80 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/40">
                Pembalik Marabahaya
              </span>
            </div>

            <!-- Baris Rapalan Rajah -->
            <div class="p-3 rounded-xl bg-black/50 border border-prada/30 text-center">
              <span class="font-mono text-base sm:text-lg font-bold tracking-widest text-amber-300 block">
                ${b.baris}
              </span>
            </div>

            <!-- Simbol Pembalik & Arti -->
            <div class="flex items-start gap-2.5 pt-1 text-xs text-sogan-200">
              <i class="fa-solid fa-arrows-left-right text-prada mt-0.5 shrink-0"></i>
              <div class="leading-relaxed">
                <strong class="text-prada block text-[11px] uppercase mb-0.5">Surasa Makna:</strong>
                ${b.arti}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Action Button Salin Lengkap -->
      <div class="p-6 rounded-2xl bg-sogan-950/70 border border-prada/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 class="font-marcellus text-base font-bold text-sogan-100">Amalan Sakral Pangruwat Kalacakra</h4>
          <p class="text-xs text-sogan-400">Salin sedaya 8 bait rajah Kalacakra sarta tegese kangge donga pangreksa sengkala.</p>
        </div>
        <button
          onclick="window.copyKalacakraFull && window.copyKalacakraFull()"
          class="px-5 py-3 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow transition cursor-pointer">
          <i class="fa-solid fa-copy"></i> Salin 8 Bait Rajah Lengkap
        </button>
      </div>
    </div>
  `;
}

export function copyKalacakraFull() {
  const rajah = getAjiRajahKalacakra();
  let text = `🛡️ *${rajah.judul}*\n_${rajah.keterangan}_\n\n`;
  text += `8 BAIT MANTRA PEMBALIK SENGKALA:\n`;
  text += `──────────────────────────────\n\n`;

  rajah.mantra_bait.forEach((b, i) => {
    text += `${i + 1}. *${b.baris}*\n   ⇄ ${b.arti}\n\n`;
  });

  text += `Kadhudhah saking Pustaka Jagad Jawa\nhttps://jagad-jawa.web.app`;
  copyToClipboard(text, 'Aji Rajah Kalacakra lengkap kasil disalin!');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODAL PEMBACA DONGO INTERAKTIF (DOA READER)
// ─────────────────────────────────────────────────────────────────────────────

export function openPustakaReader(entriId) {
  const modal = document.getElementById('modalPustakaReader');
  if (!modal) return;

  const entri = getPustakaEntriById(entriId);
  if (!entri) return;

  activeReaderEntriId = entriId;

  if (!currentReaderName) {
    const inputNamaNujum = document.getElementById('namaKepribadian');
    if (inputNamaNujum && inputNamaNujum.value.trim()) {
      currentReaderName = inputNamaNujum.value.trim();
    }
  }

  renderPustakaReaderContent(entri);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function closePustakaReader() {
  const modal = document.getElementById('modalPustakaReader');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

export function onPustakaNameChange(val) {
  currentReaderName = val;
  if (!activeReaderEntriId) return;
  const entri = getPustakaEntriById(activeReaderEntriId);
  if (!entri) return;
  renderPustakaReaderSections(entri, currentReaderName);
}

export function copyPustakaCurrentDoa() {
  if (!activeReaderEntriId) return;
  const entri = getPustakaEntriById(activeReaderEntriId);
  if (!entri) return;

  const text = formatDoaPlainText(entri, currentReaderName);
  copyToClipboard(text, 'Teks donga kasil disalin kanthi jangkep!');
}

function renderPustakaReaderContent(entri) {
  const titleEl = document.getElementById('pustakaReaderTitle');
  const subtitleEl = document.getElementById('pustakaReaderSubtitle');
  const bodyEl = document.getElementById('pustakaReaderBody');
  if (!bodyEl) return;

  const kat = getPustakaKategoriById(entri.kategori);
  const theme = getKategoriTheme(entri.kategori);
  const hasName = hasNamePlaceholder(entri);
  const relatedList = getPustakaRelatedEntri(entri);

  if (titleEl) {
    titleEl.textContent = entri.judul;
  }
  if (subtitleEl) {
    subtitleEl.textContent = `${kat?.nama || entri.kategori}${entri.subjudul ? ' · ' + entri.subjudul : ''}`;
  }

  bodyEl.innerHTML = `
    <div class="space-y-6">
      <!-- Metadata Strip Header -->
      <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-1 rounded-lg ${theme.bg} ${theme.border} ${theme.text} border font-semibold">
            <i class="fa-solid ${theme.icon} mr-1"></i> ${kat?.nama || entri.kategori}
          </span>
          ${formatBahasaBadges(entri.bahasa)}
          ${entri.waktu_pakai ? `
            <span class="px-2.5 py-1 rounded-lg bg-keraton border border-sogan-800 text-sogan-300">
              <i class="fa-regular fa-clock text-prada mr-1"></i> ${entri.waktu_pakai}
            </span>` : ''}
        </div>
        <div class="text-sogan-400 font-mono text-[11px]">
          Sumber: ${entri.sumber_file ? entri.sumber_file.replace('_pocket.docx', '').replace(/_/g, ' ') : 'Serat Kasultanan'}
        </div>
      </div>

      <!-- Ringkasan Konseptual -->
      ${entri.ringkasan ? `
      <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800/80 text-xs text-sogan-200 leading-relaxed">
        <strong class="text-prada block mb-0.5"><i class="fa-solid fa-circle-info mr-1"></i> Surasa / Katrangan:</strong>
        ${entri.ringkasan}
      </div>` : ''}

      <!-- Interactive Name Personalizer -->
      ${hasName ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-sogan-950/60 to-keraton border border-amber-600/40 space-y-2.5 shadow-md">
        <div class="flex items-center justify-between">
          <label for="pustakaInputNamaUser" class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            Personalisasi Asma ing Rapalan Donga:
          </label>
          <span class="text-[10px] text-sogan-400 font-mono">Otomatis ngisi titik ………</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="text"
            id="pustakaInputNamaUser"
            value="${currentReaderName}"
            oninput="window.onPustakaNameChange && window.onPustakaNameChange(this.value)"
            placeholder="Ketik asma panjenengan utawi kulawarga (tuladha: Raden Dananjaya)..."
            class="flex-1 px-3.5 py-2 rounded-xl bg-keraton border border-amber-600/50 focus:border-amber-400 text-xs text-sogan-100 placeholder-sogan-500 outline-none transition"
          />
          ${currentReaderName ? `
          <button
            onclick="window.onPustakaNameChange && window.onPustakaNameChange(''); document.getElementById('pustakaInputNamaUser').value = '';"
            class="px-3 py-2 rounded-xl bg-sogan-900 hover:bg-sogan-800 text-sogan-300 text-xs border border-sogan-700 transition"
            title="Hapus asma">
            Hapus
          </button>` : ''}
        </div>
        <p class="text-[11px] text-sogan-400 leading-normal">
          Nalika asma dipun-ketik, sadaya titik-titik <code class="px-1 py-0.2 bg-sogan-900 text-amber-300 rounded font-mono">………</code> ing teks donga bakal otomatis kaganti lan kacetak kanthi sorot warna emas.
        </p>
      </div>` : ''}

      <!-- Container Bagian-Bagian Donga -->
      <div id="pustakaReaderSectionsContainer" class="space-y-4">
        <!-- Dirender oleh renderPustakaReaderSections -->
      </div>

      <!-- Doa Terkait -->
      ${relatedList.length > 0 ? `
      <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2.5">
        <h4 class="text-xs font-bold text-prada uppercase tracking-wider flex items-center gap-1.5">
          <i class="fa-solid fa-link"></i> Donga &amp; Wirid Gegayutan (Terkait):
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${relatedList.map(item => `
            <button
              onclick="window.openPustakaReader && window.openPustakaReader('${item.entri.id}')"
              class="text-left p-2.5 rounded-xl bg-sogan-950 hover:bg-sogan-900 border border-sogan-800 hover:border-prada/50 transition group">
              <div class="text-xs font-bold text-sogan-200 group-hover:text-prada transition-colors flex items-center justify-between">
                <span>${item.entri.judul}</span>
                <i class="fa-solid fa-chevron-right text-[10px] text-sogan-500 group-hover:text-prada transition-transform group-hover:translate-x-0.5"></i>
              </div>
              <div class="text-[10px] text-sogan-400 mt-0.5">${item.alasan}</div>
            </button>
          `).join('')}
        </div>
      </div>` : ''}
    </div>
  `;

  renderPustakaReaderSections(entri, currentReaderName);
}

function renderPustakaReaderSections(entri, namaUser) {
  const container = document.getElementById('pustakaReaderSectionsContainer');
  if (!container || !Array.isArray(entri.bagian)) return;

  const cleanName = (namaUser || '').trim();

  container.innerHTML = entri.bagian.map((bag, idx) => {
    const isTable = bag.tipe === 'tabel';
    const isMantra = entri.jenis_isi === 'mantra';

    return `
      <div class="rounded-2xl bg-gradient-to-b from-[#141a27] to-[#0d121c] border border-sogan-700/70 overflow-hidden shadow-lg">
        <!-- Section Header -->
        <div class="px-5 py-3 bg-sogan-950/90 border-b border-sogan-800 flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-prada/20 border border-prada/50 text-prada flex items-center justify-center text-xs font-bold font-mono">
              ${idx + 1}
            </span>
            <h4 class="font-marcellus text-sm sm:text-base font-bold text-sogan-100">
              ${bag.label || `Perangan ${idx + 1}`}
            </h4>
          </div>
          <div class="flex items-center gap-2">
            ${bag.pengulangan ? `
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-600/50">
                <i class="fa-solid fa-repeat mr-1"></i> Diwaca ${bag.pengulangan}x
              </span>` : ''}
            ${bag.varian ? `
              <span class="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-sogan-900 text-sogan-300 border border-sogan-800">
                Varian: ${bag.varian}
              </span>` : ''}
          </div>
        </div>

        <!-- Section Lines Body -->
        <div class="p-5 sm:p-6 space-y-3">
          ${isTable ? `
            <div class="divide-y divide-sogan-800/60 rounded-xl overflow-hidden border border-sogan-800 bg-keraton/70">
              ${(bag.baris || []).map((line, lIdx) => {
                const parts = line.split(':');
                if (parts.length === 2) {
                  return `
                    <div class="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-sogan-900/40 transition">
                      <span class="font-bold text-amber-300 font-mono sm:w-1/3">${parts[0].trim()}</span>
                      <span class="text-sogan-100 font-medium sm:w-2/3">${parts[1].trim()}</span>
                    </div>
                  `;
                }
                return `
                  <div class="px-4 py-2.5 text-xs text-sogan-200 hover:bg-sogan-900/40 transition font-medium">
                    ${line}
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="space-y-2.5 text-center sm:text-left">
              ${(bag.baris || []).map(line => {
                let formattedLine = line;

                if (cleanName) {
                  formattedLine = formattedLine.replace(PLACEHOLDER_NAMA_REGEX, `<span class="px-2 py-0.5 rounded bg-gradient-to-r from-prada to-amber-400 text-keraton font-bold shadow-sm inline-block">${cleanName}</span>`);
                } else {
                  formattedLine = formattedLine.replace(PLACEHOLDER_NAMA_REGEX, `<span class="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 font-mono tracking-widest">………</span>`);
                }

                if (isMantra) {
                  return `
                    <p class="font-mono text-xs sm:text-sm text-cyan-200 tracking-wider font-semibold py-0.5">
                      ${formattedLine}
                    </p>
                  `;
                }

                return `
                  <p class="font-marcellus text-sm sm:text-base text-sogan-100 leading-relaxed">
                    ${formattedLine}
                  </p>
                `;
              }).join('')}
            </div>
          `}

          <!-- Petunjuk Pelaksanaan / Tata Cara -->
          ${bag.petunjuk ? `
          <div class="mt-3 p-3 rounded-xl bg-teal-950/40 border border-teal-600/40 text-xs text-teal-200 flex items-start gap-2">
            <i class="fa-solid fa-compass text-teal-400 mt-0.5"></i>
            <div>
              <strong class="text-teal-300">Petunjuk Laku:</strong> ${bag.petunjuk}
            </div>
          </div>` : ''}

          <!-- Catatan / Keterangan -->
          ${bag.catatan ? `
          <div class="mt-2 p-3 rounded-xl bg-sogan-950/70 border border-sogan-800 text-[11px] text-sogan-400 flex items-start gap-2">
            <i class="fa-solid fa-circle-question text-sogan-400 mt-0.5"></i>
            <div>
              ${bag.catatan}
            </div>
          </div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (entri.penutup) {
    container.innerHTML += `
      <div class="p-4 rounded-xl bg-sogan-950/70 border border-prada/30 text-center space-y-1">
        <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">Panutuping Rapalan</span>
        <p class="font-marcellus text-base text-prada-light font-bold">
          ${entri.penutup}
        </p>
      </div>
    `;
  }
}

// Global window bindings untuk interaktivitas instan di browser & embedded components
if (typeof window !== 'undefined') {
  window.initPustakaUI = initPustakaUI;
  window.switchPustakaSubtab = switchPustakaSubtab;
  window.switchPustakaKategori = switchPustakaKategori;
  window.onPustakaSearchInput = onPustakaSearchInput;
  window.clearPustakaSearch = clearPustakaSearch;
  window.openPustakaReader = openPustakaReader;
  window.closePustakaReader = closePustakaReader;
  window.onPustakaNameChange = onPustakaNameChange;
  window.copyPustakaCurrentDoa = copyPustakaCurrentDoa;
  window.onKautamanSearch = onKautamanSearch;
  window.copyKautamanItem = copyKautamanItem;
  window.onUsadaSearch = onUsadaSearch;
  window.filterUsadaPenyakit = filterUsadaPenyakit;
  window.copyUsadaItem = copyUsadaItem;
  window.copyKalacakraFull = copyKalacakraFull;
}

