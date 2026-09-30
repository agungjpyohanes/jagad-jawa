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
  PLACEHOLDER_NAMA_REGEX,
  getAllNaskahKuno,
  getNaskahKunoById,
  searchNaskahKuno,
  formatNaskahPlainText,
  getAllKamusJawaIndonesia,
  searchKamusJawaIndonesia,
  getAllKamusJawaSanskerta,
  searchKamusJawaSanskerta,
  formatKamusEntryPlainText,
  getAllDokumenReferensi,
  getDokumenReferensiById,
  searchDokumenReferensi,
  formatDokumenReferensiPlainText
} from './pustaka-engine.js';

import {
  getKautamaningLakuList,
  searchKautamaningLaku,
  getRamuanObatList,
  searchRamuanObat,
  getAjiRajahKalacakra
} from '../../data/pustaka-jawa-db.js';

import { showToast, copyToClipboard } from '../../ui/toast.js';
import { downloadTextFile } from '../../ui/download-helper.js';

let currentPustakaSubtab = 'kamus'; // 'kamus' | 'dongo' | 'kautaman' | 'usada' | 'kalacakra' | 'naskah' | 'referensi'
let currentPustakaContainerId = 'pustakaContainer';
let currentKategori = 'kabeh';
let currentSearchQuery = '';
let currentKautamanQuery = '';
let currentUsadaQuery = '';
let currentUsadaPenyakit = 'kabeh';
let currentNaskahQuery = '';
let currentKamusQuery = '';
let currentKamusType = 'jawa-indonesia'; // 'jawa-indonesia' | 'jawa-sanskerta'
let currentReferensiQuery = '';
let activeReaderEntriId = null;
let activeReaderType = 'doa'; // 'doa' | 'naskah' | 'referensi'
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
 * Inisialisasi tampilan Pustaka Digital.
 * Menghadirkan portal komprehensif naskah kuno, kamus Jawa-Indonesia & Sanskerta,
 * dongo & wiridan, kautamaning laku, usada tradisional, kalacakra, lan referensi budaya.
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
      <!-- Header Pustaka Digital -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-prada/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prada/15 border border-prada/50 text-prada text-xs font-mono tracking-wider uppercase font-semibold">
            <i class="fa-solid fa-book-bookmark text-prada-light"></i>
            Pustaka Digital Jagad Jawa
          </div>
          <h2 class="font-marcellus text-2xl sm:text-4xl font-bold gold-gradient-text">
            Pustaka Kawruh Tradisional &amp; Bausastra
          </h2>
          <p class="text-xs sm:text-sm text-sogan-200 max-w-3xl leading-relaxed">
            Koleksi naskah kuno klasik, bausastra kamus Jawa-Indonesia &amp; Sanskerta, rapalan donga &amp; wirid, usada ramuan herbal, 12 kautamaning laku, sarta paugeran kabudayan Nusantara.
          </p>
        </div>
      </div>

      <!-- Subtab Navigation Bar (Pustaka Digital: Kamus, Naskah, Referensi) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-sogan-800/80">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('kamus')"
            class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'kamus' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-spell-check"></i> Kamus Jawa &amp; Sanskerta
          </button>
          <button
            type="button"
            onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('naskah')"
            class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'naskah' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-book-journal-whills"></i> Naskah Kuno Klasik (5)
          </button>
          <button
            type="button"
            onclick="window.switchPustakaSubtab && window.switchPustakaSubtab('referensi')"
            class="px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${currentPustakaSubtab === 'referensi' ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-landmark"></i> Referensi Budaya (3)
          </button>
        </div>
      </div>

      <!-- Info Box Wewengkon Sinengker (Tunggal & Terpadu) -->
      <div class="p-4 rounded-2xl bg-sogan-950/60 border border-prada/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sogan-300 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-xl bg-red-950/80 border border-red-700/60 text-amber-300 flex items-center justify-center shrink-0 text-base shadow">
            <i class="fa-solid fa-shield-halved"></i>
          </span>
          <div class="space-y-0.5">
            <div class="font-bold text-amber-200 text-xs">Panggonan Anyar: Wewengkon Sinengker (Naskah Sakral)</div>
            <p class="leading-relaxed text-[11px] text-sogan-300">
              Modul <strong class="text-amber-100">Dongo &amp; Wirid</strong>, <strong class="text-amber-100">Kautamaning Laku</strong>, <strong class="text-amber-100">Usada &amp; Tamba</strong>, sarta <strong class="text-amber-100">Rajah Kalacakra</strong> sapunika kasimpen rapi wonten ing wewengkon <strong class="text-prada">Sinengker</strong>.
            </p>
          </div>
        </div>
        <button onclick="switchTab('sinengker')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-red-950 to-amber-950 border border-red-700/60 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-2 transition shadow cursor-pointer shrink-0">
          <i class="fa-solid fa-compass text-amber-400"></i>
          <span>Wewengkon Sinengker</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>

      <!-- Container Dinamis Konten Sub-tab -->
      <div id="pustakaSubtabContent" class="space-y-6">
        <!-- Rendered by renderPustakaCurrentSubtab -->
      </div>
    </div>
  `;

  renderPustakaCurrentSubtab();
}

/**
 * Ganti sub-tab aktif di dalam modul Pustaka
 * @param {'kamus' | 'naskah' | 'referensi' | 'dongo' | 'kautaman' | 'usada' | 'kalacakra'} subtab 
 */
export function switchPustakaSubtab(subtab) {
  currentPustakaSubtab = subtab;
  const targetId = (document.getElementById(currentPustakaContainerId) ? currentPustakaContainerId : null) ||
                   (document.getElementById('sinengkerEmbeddedPustaka') ? 'sinengkerEmbeddedPustaka' : 'pustakaContainer');
  initPustakaUI(targetId);
}

/**
 * Helper untuk mengambil kontainer subtab aktif (baik di Pustaka maupun Sinengker)
 */
export function getActivePustakaContainer() {
  return document.getElementById('sinengkerSubtabContent') || document.getElementById('pustakaSubtabContent');
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
    case 'naskah':
      renderPustakaNaskahView(container);
      break;
    case 'referensi':
      renderPustakaReferensiView(container);
      break;
    case 'dongo':
      renderPustakaDongoView(container);
      break;
    case 'kamus':
    default:
      renderPustakaKamusView(container);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VIEW DONGO & WIRIDAN (12 DOKUMEN ASLI)
// ─────────────────────────────────────────────────────────────────────────────

export function renderPustakaDongoView(container) {
  const targetContainer = container || getActivePustakaContainer();
  if (!targetContainer) return;
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

export function renderPustakaKautamanView(container) {
  const targetContainer = container || getActivePustakaContainer();
  if (!targetContainer) return;
  const teachings = searchKautamaningLaku(currentKautamanQuery);

  targetContainer.innerHTML = `
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
  const container = getActivePustakaContainer();
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

export function renderPustakaUsadaView(container) {
  const targetContainer = container || getActivePustakaContainer();
  if (!targetContainer) return;
  const allUsada = getRamuanObatList();
  let list = searchRamuanObat(currentUsadaQuery);

  if (currentUsadaPenyakit !== 'kabeh') {
    list = list.filter(item => item.id === currentUsadaPenyakit || item.penyakit.toLowerCase().includes(currentUsadaPenyakit.toLowerCase()));
  }

  targetContainer.innerHTML = `
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
  const container = getActivePustakaContainer();
  if (container) renderPustakaUsadaView(container);
}

export function filterUsadaPenyakit(penyakit) {
  currentUsadaPenyakit = penyakit;
  const container = getActivePustakaContainer();
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

export function renderPustakaKalacakraView(container) {
  const targetContainer = container || getActivePustakaContainer();
  if (!targetContainer) return;
  const rajah = getAjiRajahKalacakra();

  targetContainer.innerHTML = `
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

  activeReaderType = 'doa';
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
  if (activeReaderType === 'naskah') {
    if (activeNaskahId) {
      copyNaskahFull(activeNaskahId);
    }
    return;
  }
  if (activeReaderType === 'referensi') {
    if (activeReferensiId) {
      copyReferensiDoc(activeReferensiId);
    }
    return;
  }

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

// ─────────────────────────────────────────────────────────────────────────────
// 6. VIEW NASKAH KUNO (SERAT & BABAD KLASIK)
// ─────────────────────────────────────────────────────────────────────────────

export function onNaskahSearch(query) {
  currentNaskahQuery = query || '';
  const container = document.getElementById('pustakaSubtabContent');
  if (container && currentPustakaSubtab === 'naskah') {
    renderPustakaNaskahView(container);
  }
}

export function renderPustakaNaskahView(container) {
  const list = searchNaskahKuno(currentNaskahQuery);

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="pustakaNaskahSearchInput"
          value="${currentNaskahQuery}"
          oninput="window.onNaskahSearch && window.onNaskahSearch(this.value)"
          placeholder="Goleki naskah kuno, serat, pupuh, utawa piwulang (tuladha: 'Wedhatama', 'Kalatidha', 'Pangkur', 'budi luhur')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        ${currentNaskahQuery ? `
          <button onclick="window.onNaskahSearch(''); document.getElementById('pustakaNaskahSearchInput').value = '';" class="absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>` : ''}
      </div>

      <!-- Info Row -->
      <div class="flex items-center justify-between text-xs text-sogan-400 px-1">
        <span>Nampilaken <strong class="text-prada-light">${list.length}</strong> Koleksi Naskah Klasik &amp; Serat Luhur</span>
        <span class="text-amber-300/80 font-mono text-[11px]">Transkripsi Naskah Adiluhung Kasultanan</span>
      </div>

      <!-- Grid Cards Naskah Kuno -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${list.map(n => `
          <div class="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#141a29] to-[#0A0D14] border border-sogan-800 hover:border-prada/60 transition-all duration-300 p-5 shadow-lg group">
            <div class="space-y-4">
              <!-- Top Row: Judul & Aksara -->
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-marcellus text-lg font-bold text-amber-100 group-hover:text-prada-light transition">
                    ${n.judul}
                  </h3>
                  <div class="text-xs text-sogan-300 mt-0.5">
                    ${n.subjudul || ''}
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-lg bg-prada/15 border border-prada/40 text-prada text-[11px] font-mono shrink-0">
                  ${n.taun}
                </span>
              </div>

              <!-- Penganggit & Format -->
              <div class="flex flex-wrap items-center gap-2 text-xs text-sogan-300">
                <span class="px-2.5 py-0.5 rounded-full bg-sogan-950 border border-sogan-800 text-[11px] text-amber-200">
                  <i class="fa-solid fa-feather-pointed text-prada mr-1"></i> ${n.penganggit}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-sogan-950 border border-sogan-800 text-[11px] text-sogan-300 font-mono">
                  ${n.format === 'tembang-macapat' ? `${n.pupuh?.length || 0} Pupuh (${n.gunggung_bait || 0} Bait)` : `${n.bab?.length || 0} Bab Teks Klasik`}
                </span>
              </div>

              <!-- Ringkesan Filosofis -->
              <p class="text-xs text-sogan-200 leading-relaxed line-clamp-3">
                ${n.ringkesan}
              </p>

              <!-- Topik Utama Badges -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${(n.topik_utama || []).map(t => `
                  <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950/50 border border-amber-800/40 text-amber-300">
                    #${t}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Action Buttons Footer -->
            <div class="pt-5 mt-4 border-t border-sogan-800/70 flex items-center justify-between gap-2 flex-wrap">
              <button
                onclick="window.openPustakaNaskahReader && window.openPustakaNaskahReader('${n.id}')"
                class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow transition cursor-pointer">
                <i class="fa-solid fa-book-open"></i> Waos Naskah
              </button>
              <div class="flex items-center gap-1.5">
                <button
                  onclick="window.copyNaskahFull && window.copyNaskahFull('${n.id}')"
                  class="p-2 rounded-xl bg-sogan-950 border border-sogan-700 text-sogan-300 hover:text-prada hover:border-prada transition text-xs cursor-pointer"
                  title="Salin Isi Naskah">
                  <i class="fa-solid fa-copy"></i>
                </button>
                <button
                  onclick="window.unduhNaskahKuno && window.unduhNaskahKuno('${n.id}')"
                  class="px-3 py-2 rounded-xl bg-sogan-900 border border-prada/50 text-prada hover:bg-prada/20 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Unduh Teks Naskah (.txt)">
                  <i class="fa-solid fa-download"></i> Unduh TXT
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function openPustakaNaskahReader(naskahId) {
  const modal = document.getElementById('modalPustakaReader');
  if (!modal) return;

  const naskah = getNaskahKunoById(naskahId);
  if (!naskah) return;

  activeReaderType = 'naskah';
  activeNaskahId = naskahId;

  const titleEl = document.getElementById('pustakaReaderTitle');
  const subtitleEl = document.getElementById('pustakaReaderSubtitle');
  const bodyEl = document.getElementById('pustakaReaderBody');
  if (!bodyEl) return;

  if (titleEl) titleEl.textContent = naskah.judul;
  if (subtitleEl) subtitleEl.textContent = `${naskah.subjudul} · Anggitane ${naskah.penganggit} (${naskah.taun})`;

  bodyEl.innerHTML = `
    <div class="space-y-6">
      <!-- Metadata Strip Header -->
      <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-600/50 text-amber-300 font-semibold">
            <i class="fa-solid fa-feather-pointed mr-1"></i> ${naskah.penganggit}
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-keraton border border-sogan-800 text-sogan-300 font-mono">
            Taun: ${naskah.taun}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            onclick="window.unduhNaskahKuno && window.unduhNaskahKuno('${naskah.id}')"
            class="px-3 py-1 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer">
            <i class="fa-solid fa-download"></i> Unduh Naskah (.txt)
          </button>
        </div>
      </div>

      <!-- Ringkasan & Piwulang Luhur -->
      <div class="p-4 rounded-xl bg-keraton border border-sogan-800/80 space-y-2 text-xs leading-relaxed text-sogan-200">
        <strong class="text-prada block font-marcellus text-sm"><i class="fa-solid fa-landmark mr-1.5"></i> Falsafah &amp; Piwulang Luhur:</strong>
        <p>${naskah.ringkesan}</p>
        <div class="pt-2 flex flex-wrap gap-1.5">
          ${(naskah.topik_utama || []).map(t => `
            <span class="px-2 py-0.5 rounded bg-sogan-950 border border-sogan-800 text-[10px] text-amber-300">#${t}</span>
          `).join('')}
        </div>
      </div>

      <!-- Isi Pupuh / Bab -->
      <div class="space-y-5">
        ${naskah.format === 'tembang-macapat' ? (naskah.pupuh || []).map((pup, pIdx) => `
          <div class="rounded-2xl bg-sogan-950/60 border border-sogan-800 p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-sogan-800/80 pb-2.5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-prada block font-semibold">Pupuh ${pIdx + 1}</span>
                <h4 class="font-marcellus text-base font-bold text-amber-200">Pupuh ${pup.nama}</h4>
              </div>
              <span class="text-xs font-mono text-sogan-400 bg-keraton px-2.5 py-1 rounded-md border border-sogan-800">
                ${pup.paugeran || ''}
              </span>
            </div>

            <div class="space-y-3">
              ${(pup.bait_pilihan || []).map(b => `
                <div class="p-4 rounded-xl bg-black/40 border border-prada/20 space-y-3 hover:border-prada/50 transition">
                  <div class="flex items-center justify-between text-[11px] font-mono text-amber-300/80">
                    <span>Bait ${b.pada}</span>
                    <span class="uppercase">${pup.nama}</span>
                  </div>

                  <!-- Teks Tembang -->
                  <div class="pl-3 border-l-2 border-prada/60 space-y-1">
                    ${(b.teks || []).map(line => `
                      <p class="font-marcellus text-sm sm:text-base text-amber-100 leading-relaxed">${line}</p>
                    `).join('')}
                  </div>

                  <!-- Terjemahan / Makna -->
                  <div class="pt-2 text-xs text-sogan-300 leading-relaxed border-t border-sogan-800/60">
                    <strong class="text-teal-300 block mb-0.5">Surasa Makna:</strong>
                    ${b.arti}
                  </div>

                  ${b.makna_filosofis ? `
                    <div class="p-2.5 rounded-lg bg-amber-950/40 border border-amber-700/40 text-[11px] text-amber-200">
                      <strong>Piwulang:</strong> ${b.makna_filosofis}
                    </div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('') : (naskah.bab || []).map((b, bIdx) => `
          <div class="rounded-2xl bg-sogan-950/60 border border-sogan-800 p-5 space-y-3">
            <div class="flex items-center justify-between border-b border-sogan-800/80 pb-2">
              <h4 class="font-marcellus text-base font-bold text-amber-200">Bab ${bIdx + 1}: ${b.irah_irahan}</h4>
            </div>
            <p class="text-xs text-sogan-200 leading-relaxed">${b.isi}</p>
            ${b.makna ? `
              <div class="p-3 rounded-xl bg-teal-950/40 border border-teal-700/40 text-xs text-teal-200">
                <strong>Nilai Sejarah:</strong> ${b.makna}
              </div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function unduhNaskahKuno(naskahId) {
  const n = getNaskahKunoById(naskahId);
  if (!n) {
    showToast('Naskah dereng kapanggih.');
    return;
  }
  const content = formatNaskahPlainText(n);
  const filename = `${n.id}.txt`;
  downloadTextFile(filename, content, 'text/plain;charset=utf-8');
  showToast(`Naskah "${n.judul}" kasil ka-undhuh!`);
}

export function copyNaskahFull(naskahId) {
  const n = getNaskahKunoById(naskahId);
  if (!n) return;
  const content = formatNaskahPlainText(n);
  copyToClipboard(content, `Teks naskah "${n.judul}" kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. VIEW KAMUS JAWA & SANSKERTA
// ─────────────────────────────────────────────────────────────────────────────

export function onKamusSearch(query) {
  currentKamusQuery = query || '';
  const container = document.getElementById('pustakaSubtabContent');
  if (container && currentPustakaSubtab === 'kamus') {
    renderPustakaKamusView(container);
  }
}

export function switchKamusType(type) {
  currentKamusType = type;
  const container = document.getElementById('pustakaSubtabContent');
  if (container && currentPustakaSubtab === 'kamus') {
    renderPustakaKamusView(container);
  }
}

export function renderPustakaKamusView(container) {
  const isSanskerta = (currentKamusType === 'jawa-sanskerta');
  const allJwId = getAllKamusJawaIndonesia();
  const allJwSa = getAllKamusJawaSanskerta();
  const list = isSanskerta ? searchKamusJawaSanskerta(currentKamusQuery) : searchKamusJawaIndonesia(currentKamusQuery);

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="pustakaKamusSearchInput"
          value="${currentKamusQuery}"
          oninput="window.onKamusSearch && window.onKamusSearch(this.value)"
          placeholder="Goleki tembung Jawa, Krama, Indonesia, utawa Sanskerta (tuladha: 'tresna', 'sasmita', 'wicaksana', 'rahayu')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        ${currentKamusQuery ? `
          <button onclick="window.onKamusSearch(''); document.getElementById('pustakaKamusSearchInput').value = '';" class="absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>` : ''}
      </div>

      <!-- Kamus Type Toggle Bar & Download Button -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-sogan-800/80">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onclick="window.switchKamusType && window.switchKamusType('jawa-indonesia')"
            class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${!isSanskerta ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-book"></i> Bausastra Jawa - Indonesia (${allJwId.length})
          </button>
          <button
            type="button"
            onclick="window.switchKamusType && window.switchKamusType('jawa-sanskerta')"
            class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${isSanskerta ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md' : 'bg-sogan-950/70 border border-sogan-800 text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-om"></i> Kamus Jawa - Sanskerta (${allJwSa.length})
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            onclick="window.unduhKamus && window.unduhKamus('${currentKamusType}')"
            class="px-3.5 py-2 rounded-xl bg-sogan-900 border border-prada/50 text-prada hover:bg-prada/20 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Unduh kamus format teks">
            <i class="fa-solid fa-download"></i> Unduh Kamus TXT
          </button>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="flex items-center justify-between text-xs text-sogan-400 px-1">
        <span>Nampilaken <strong class="text-prada-light">${list.length}</strong> Kosakata Tembung</span>
        <span class="text-amber-300/80 font-mono text-[11px]">${isSanskerta ? 'Kawi & Sanskerta Klasik' : 'Undha-usuk Basa Jawa'}</span>
      </div>

      <!-- Vocabulary Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${list.map(item => `
          <div class="rounded-2xl bg-gradient-to-b from-[#121722] to-[#0A0D14] border border-sogan-800 hover:border-prada/50 transition p-4 space-y-3 shadow-md flex flex-col justify-between">
            <div class="space-y-2.5">
              <!-- Top Row: Tembung, Jenis & Aksara -->
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="font-marcellus text-base font-bold text-amber-100">
                    ${item.jawa || item.istilah || item.kata}
                  </h4>
                  ${item.aksara ? `
                    <span class="text-xs font-mono text-amber-300/70 block">${item.aksara}</span>
                  ` : ''}
                </div>
                <div class="flex items-center gap-1 flex-wrap justify-end">
                  ${item.jenis ? `
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 border border-amber-600/40 text-amber-300 shrink-0">
                      ${item.jenis}
                    </span>
                  ` : ''}
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sogan-950 border border-sogan-800 text-prada shrink-0">
                    ${item.kategori || (isSanskerta ? 'Sanskerta' : 'Basa Jawa')}
                  </span>
                </div>
              </div>

              <!-- Undha-usuk or Sanskerta Details -->
              ${!isSanskerta ? `
                <div class="text-[11px] space-y-0.5 text-sogan-300 bg-black/40 p-2.5 rounded-lg border border-sogan-800/60">
                  ${item.ngoko ? `<div><strong>Ngoko:</strong> ${item.ngoko}</div>` : ''}
                  ${item.krama ? `<div><strong>Krama:</strong> ${item.krama}</div>` : ''}
                  ${item.krama_inggil ? `<div><strong>Krama Inggil:</strong> <span class="text-prada-light">${item.krama_inggil}</span></div>` : ''}
                </div>
              ` : `
                <div class="text-[11px] space-y-0.5 text-sogan-300 bg-black/40 p-2.5 rounded-lg border border-sogan-800/60">
                  <div><strong>Tembung Sanskerta:</strong> <span class="text-amber-200 font-semibold">${item.sanskerta}</span></div>
                  ${item.arti_harfiah ? `<div><strong>Arti Harfiah:</strong> ${item.arti_harfiah}</div>` : ''}
                </div>
              `}

              <!-- Terjemahan / Makna Indonesia -->
              <div class="text-xs text-sogan-200 leading-relaxed pt-1">
                <strong class="text-teal-300 block text-[11px] uppercase">Tegese / Arti:</strong>
                ${item.indonesia || item.id || item.arti || item.makna_filosofis || item.makna}
              </div>

              <!-- Conto Ukara / Keterangan -->
              ${(item.conto_ukara || item.contoh) ? `
                <div class="p-2 rounded-lg bg-teal-950/30 border border-teal-800/40 text-[11px] text-teal-200 italic">
                  "${item.conto_ukara || item.contoh}"
                </div>` : ''}
            </div>

            <!-- Card Bottom Action -->
            <div class="pt-2 border-t border-sogan-800/60 flex items-center justify-between text-xs">
              <span class="text-[10px] text-sogan-500 font-mono">Bausastra Jagad Jawa</span>
              <button
                onclick="window.copyKamusWord && window.copyKamusWord('${item.jawa || item.istilah || item.kata}', '${(item.indonesia || item.id || item.arti || item.makna_filosofis || item.makna || '').replace(/'/g, "\\'")}')"
                class="px-2.5 py-1 rounded-lg bg-sogan-950 border border-sogan-800 text-sogan-300 hover:text-prada hover:border-prada transition text-[11px] flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-copy"></i> Salin
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function unduhKamus(type = currentKamusType, format = 'txt') {
  const isSanskerta = (type === 'jawa-sanskerta');
  const items = isSanskerta ? getAllKamusJawaSanskerta() : getAllKamusJawaIndonesia();

  if (format === 'json') {
    const jsonStr = JSON.stringify(items, null, 2);
    const filename = isSanskerta ? `kamus-sansakerta.json` : `kamus-jawa.json`;
    downloadTextFile(filename, jsonStr, 'application/json;charset=utf-8');
    showToast(`File JSON kamus kasil ka-undhuh!`);
    return;
  }

  let text = `================================================================================\n`;
  text += isSanskerta ? `KAMUS JAWA - SANSKERTA (KAWI & FILOSOFI KLASIK)\n` : `BAUSASTRA JAWA - INDONESIA (UNDHA-USUK BASA JAWA)\n`;
  text += `Pustaka Digital Jagad Jawa\n`;
  text += `Gunggung Kosakata: ${items.length} tembung\n`;
  text += `================================================================================\n\n`;

  items.forEach((item, idx) => {
    text += `${idx + 1}. ${formatKamusEntryPlainText(item, isSanskerta ? 'sanskerta' : 'indonesia')}\n\n`;
  });

  const filename = isSanskerta ? `kamus-jawa-sanskerta.txt` : `bausastra-jawa-indonesia.txt`;
  downloadTextFile(filename, text, 'text/plain;charset=utf-8');
  showToast(`Kamus kasil ka-undhuh!`);
}

export function copyKamusWord(kata, makna) {
  const text = `${kata} : ${makna}\n(Bausastra Jagad Jawa)`;
  copyToClipboard(text, `Kosakata "${kata}" kasil disalin!`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. VIEW DOKUMEN REFERENSI BUDAYA
// ─────────────────────────────────────────────────────────────────────────────

export function onReferensiSearch(query) {
  currentReferensiQuery = query || '';
  const container = document.getElementById('pustakaSubtabContent');
  if (container && currentPustakaSubtab === 'referensi') {
    renderPustakaReferensiView(container);
  }
}

export function renderPustakaReferensiView(container) {
  const list = searchDokumenReferensi(currentReferensiQuery);

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sogan-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          id="pustakaReferensiSearchInput"
          value="${currentReferensiQuery}"
          oninput="window.onReferensiSearch && window.onReferensiSearch(this.value)"
          placeholder="Goleki dokumen paugeran (tuladha: 'macapat', 'guru gatra', 'pelog', 'slendro', 'parang rusak')..."
          class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-keraton border border-sogan-700/80 focus:border-prada focus:ring-1 focus:ring-prada/40 text-sm text-sogan-100 placeholder-sogan-500 shadow-inner outline-none transition"
        />
        ${currentReferensiQuery ? `
          <button onclick="window.onReferensiSearch(''); document.getElementById('pustakaReferensiSearchInput').value = '';" class="absolute inset-y-0 right-0 pr-4 flex items-center text-sogan-400 hover:text-prada transition">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>` : ''}
      </div>

      <!-- Info Row -->
      <div class="flex items-center justify-between text-xs text-sogan-400 px-1">
        <span>Nampilaken <strong class="text-prada-light">${list.length}</strong> Dokumen Paugeran Resmi</span>
        <span class="text-amber-300/80 font-mono text-[11px]">Standar Pakem Keraton Surakarta &amp; Yogyakarta</span>
      </div>

      <!-- Grid Cards Dokumen Referensi -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${list.map(doc => `
          <div class="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#131b26] to-[#0A0D14] border border-sogan-800 hover:border-prada/60 transition-all duration-300 p-5 shadow-lg group">
            <div class="space-y-4">
              <!-- Top Row: Icon & Kategori -->
              <div class="flex items-center justify-between gap-2">
                <span class="w-9 h-9 rounded-xl bg-prada/20 border border-prada/50 flex items-center justify-center text-prada text-sm">
                  <i class="fa-solid ${doc.kategori === 'sastra-macapat' ? 'fa-scroll' : doc.kategori === 'karawitan-gamelan' ? 'fa-drum' : 'fa-shirt'}"></i>
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-sogan-950 border border-sogan-800 text-[10px] font-mono text-sogan-300">
                  ${doc.kategori}
                </span>
              </div>

              <!-- Title & Subtitle -->
              <div>
                <h3 class="font-marcellus text-lg font-bold text-amber-100 group-hover:text-prada-light transition">
                  ${doc.judul}
                </h3>
                <div class="text-xs text-sogan-300 mt-0.5">
                  ${doc.subjudul || ''}
                </div>
              </div>

              <!-- Ringkasan -->
              <p class="text-xs text-sogan-200 leading-relaxed line-clamp-3">
                ${doc.ringkasan}
              </p>

              <!-- Fitur Utama Badge -->
              <div class="p-2.5 rounded-xl bg-black/40 border border-sogan-800/80 text-[11px] text-sogan-300 space-y-1">
                ${doc.kategori === 'sastra-macapat' ? `<div><strong>Paugeran:</strong> 11 Pupuh Tembang Lengkap</div>` : ''}
                ${doc.kategori === 'karawitan-gamelan' ? `<div><strong>Laras:</strong> Slendro &amp; Pelog (3 Pathet)</div>` : ''}
                ${doc.kategori === 'busana-batik' ? `<div><strong>Pakem:</strong> Motif Larangan &amp; Busana Adat</div>` : ''}
              </div>
            </div>

            <!-- Action Buttons Footer -->
            <div class="pt-5 mt-4 border-t border-sogan-800/70 flex items-center justify-between gap-2">
              <button
                onclick="window.openPustakaReferensiReader && window.openPustakaReferensiReader('${doc.id}')"
                class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow transition cursor-pointer">
                <i class="fa-solid fa-book-open"></i> Waos Dokumen
              </button>
              <button
                onclick="window.unduhDokumenReferensi && window.unduhDokumenReferensi('${doc.id}')"
                class="px-3 py-2 rounded-xl bg-sogan-900 border border-prada/50 text-prada hover:bg-prada/20 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Unduh Dokumen (.txt)">
                <i class="fa-solid fa-download"></i> Unduh TXT
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function openPustakaReferensiReader(docId) {
  const modal = document.getElementById('modalPustakaReader');
  if (!modal) return;

  const doc = getDokumenReferensiById(docId);
  if (!doc) return;

  activeReaderType = 'referensi';
  activeReferensiId = docId;

  const titleEl = document.getElementById('pustakaReaderTitle');
  const subtitleEl = document.getElementById('pustakaReaderSubtitle');
  const bodyEl = document.getElementById('pustakaReaderBody');
  if (!bodyEl) return;

  if (titleEl) titleEl.textContent = doc.judul;
  if (subtitleEl) subtitleEl.textContent = `${doc.subjudul} · Pakem Tradisi Budaya Jawa`;

  bodyEl.innerHTML = `
    <div class="space-y-6">
      <!-- Metadata Strip Header -->
      <div class="p-4 rounded-2xl bg-sogan-950/80 border border-sogan-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-lg bg-teal-950/70 border border-teal-600/50 text-teal-300 font-semibold">
            <i class="fa-solid fa-landmark mr-1"></i> ${doc.kategori}
          </span>
          <span class="text-sogan-400 font-mono text-[11px]">Pakem Resmi Kasultanan</span>
        </div>
        <button
          onclick="window.unduhDokumenReferensi && window.unduhDokumenReferensi('${doc.id}')"
          class="px-3 py-1 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer">
          <i class="fa-solid fa-download"></i> Unduh Dokumen (.txt)
        </button>
      </div>

      <!-- Ringkasan Dokumen -->
      <div class="p-4 rounded-xl bg-keraton border border-sogan-800/80 space-y-2 text-xs leading-relaxed text-sogan-200">
        <strong class="text-prada block font-marcellus text-sm"><i class="fa-solid fa-circle-info mr-1.5"></i> Ringkasan &amp; Falsafah:</strong>
        <p>${doc.ringkasan}</p>
      </div>

      <!-- Detail Isi Khusus per Kategori -->
      ${doc.kategori === 'sastra-macapat' ? `
        <div class="space-y-4">
          <h4 class="font-marcellus text-base font-bold text-amber-200 border-b border-sogan-800/80 pb-2">
            Paugeran 11 Pupuh Tembang Macapat
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${(doc.pupuh_list || []).map(p => `
              <div class="p-4 rounded-xl bg-sogan-950/70 border border-sogan-800 space-y-2">
                <div class="flex items-center justify-between">
                  <strong class="text-amber-200 font-marcellus text-sm">${p.nama}</strong>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-keraton text-prada border border-sogan-800">
                    ${p.guru_gatra} Gatra
                  </span>
                </div>
                <div class="text-[11px] text-teal-300 font-mono">
                  Paugeran: ${p.guru_wilangan_lagu}
                </div>
                <div class="text-xs text-sogan-300">
                  <strong>Watak:</strong> ${p.watak}
                </div>
                <div class="text-[11px] text-sogan-400 italic">
                  <strong>Fungsi:</strong> ${p.fungsi}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${doc.kategori === 'karawitan-gamelan' ? `
        <div class="space-y-5">
          <h4 class="font-marcellus text-base font-bold text-amber-200 border-b border-sogan-800/80 pb-2">
            Laras, Pathet &amp; Ricikan Gamelan Jawa
          </h4>
          
          <!-- Laras Slendro & Pelog -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-sogan-950/70 border border-sogan-800 space-y-2">
              <h5 class="font-bold text-amber-200 text-sm">Laras Slendro (5 Nada)</h5>
              <p class="text-xs text-sogan-300">${doc.laras?.slendro?.deskripsi || ''}</p>
              <div class="text-xs text-amber-300">Nada: ${(doc.laras?.slendro?.nada || []).join(' - ')}</div>
              <div class="text-xs text-teal-300">Pathet: ${(doc.laras?.slendro?.pathet || []).join(', ')}</div>
            </div>
            <div class="p-4 rounded-xl bg-sogan-950/70 border border-sogan-800 space-y-2">
              <h5 class="font-bold text-amber-200 text-sm">Laras Pelog (7 Nada)</h5>
              <p class="text-xs text-sogan-300">${doc.laras?.pelog?.deskripsi || ''}</p>
              <div class="text-xs text-amber-300">Nada: ${(doc.laras?.pelog?.nada || []).join(' - ')}</div>
              <div class="text-xs text-teal-300">Pathet: ${(doc.laras?.pelog?.pathet || []).join(', ')}</div>
            </div>
          </div>

          <!-- Ricikan Balungan & Panerusan -->
          <div class="space-y-3">
            <h5 class="font-bold text-prada text-sm">Ricikan Instrumen Gamelan:</h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              ${(doc.ricikan || []).map(r => `
                <div class="p-3 rounded-lg bg-black/40 border border-sogan-800 space-y-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-amber-100">${r.nama}</strong>
                    <span class="text-[10px] font-mono text-sogan-400">${r.kelompok}</span>
                  </div>
                  <div class="text-sogan-300 text-[11px]">${r.fungsi}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${doc.kategori === 'busana-batik' ? `
        <div class="space-y-5">
          <h4 class="font-marcellus text-base font-bold text-amber-200 border-b border-sogan-800/80 pb-2">
            Motif Batik Larangan Keraton &amp; Busana Adat
          </h4>

          <!-- Motif Batik Larangan -->
          <div class="space-y-3">
            <h5 class="font-bold text-prada text-sm">Motif Batik Larangan (Awisan Dalem):</h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              ${(doc.motif_larangan || []).map(m => `
                <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-amber-800/50 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <strong class="text-amber-200 text-sm">${m.nama}</strong>
                    <span class="text-[10px] text-amber-400 font-mono">${m.peruntukan}</span>
                  </div>
                  <p class="text-sogan-200 text-xs">${m.filosofi}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Busana Jawi Jangkep -->
          <div class="p-4 rounded-xl bg-sogan-950/70 border border-sogan-800 space-y-2 text-xs">
            <h5 class="font-bold text-prada text-sm">Tata Busana Adat Jawi Jangkep:</h5>
            <p class="text-sogan-300">${doc.busana_adat?.jawi_jangkep?.deskripsi || ''}</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              ${(doc.busana_adat?.jawi_jangkep?.komponen || []).map(c => `
                <div class="p-2 rounded bg-black/50 border border-sogan-800 text-amber-200 text-center">
                  ${c}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function unduhDokumenReferensi(docId) {
  const doc = getDokumenReferensiById(docId);
  if (!doc) {
    showToast('Dokumen dereng kapanggih.');
    return;
  }
  const content = formatDokumenReferensiPlainText(doc);
  const filename = `${doc.id}.txt`;
  downloadTextFile(filename, content, 'text/plain;charset=utf-8');
  showToast(`Dokumen "${doc.judul}" kasil ka-undhuh!`);
}

export function copyReferensiDoc(docId) {
  const doc = getDokumenReferensiById(docId);
  if (!doc) return;
  const content = formatDokumenReferensiPlainText(doc);
  copyToClipboard(content, `Dokumen "${doc.judul}" kasil disalin!`);
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

  // Fitur Anyar: Naskah Kuno, Kamus, & Referensi Budaya
  window.onNaskahSearch = onNaskahSearch;
  window.openPustakaNaskahReader = openPustakaNaskahReader;
  window.unduhNaskahKuno = unduhNaskahKuno;
  window.copyNaskahFull = copyNaskahFull;

  window.onKamusSearch = onKamusSearch;
  window.switchKamusType = switchKamusType;
  window.unduhKamus = unduhKamus;
  window.copyKamusWord = copyKamusWord;

  window.onReferensiSearch = onReferensiSearch;
  window.openPustakaReferensiReader = openPustakaReferensiReader;
  window.unduhDokumenReferensi = unduhDokumenReferensi;
  window.copyReferensiDoc = copyReferensiDoc;
}

