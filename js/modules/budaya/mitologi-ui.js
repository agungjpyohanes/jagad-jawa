/**
 * Jagad Jawa — Modul Domain: Mitologi Nusantara UI
 * Mengelola kartu pilar mitologi, pembaca ensiklopedia lengkap,
 * dan modal dialog detail cerita mitologis Jawa & Nusantara.
 */

import {
  getAllMitologiNusantara,
  getMitologiById,
  formatMitologiPlainText
} from '../../data/mitologi-nusantara-db.js';

import { showToast, copyToClipboard } from '../../ui/toast.js';
import { getLanguage } from '../../ui/i18n.js';

let activeReadingFontSize = 'normal'; // 'normal' | 'large'

/**
 * Inisialisasi tampilan Mitologi Nusantara di tab-mitologi
 * @param {string} [gridContainerId='mitologiPillarsGrid']
 */
export function initMitologiUI(gridContainerId = 'mitologiPillarsGrid') {
  const grid = document.getElementById(gridContainerId);
  if (!grid) return;

  const isJv = (typeof getLanguage === 'function' ? getLanguage() : 'id') === 'jv';
  const list = getAllMitologiNusantara();

  grid.innerHTML = list.map(item => {
    let iconBg = 'bg-amber-500/20 border-amber-400/50 text-amber-300';
    if (item.warnaTheme === 'purple') iconBg = 'bg-purple-500/20 border-purple-400/50 text-purple-300';
    if (item.warnaTheme === 'emerald') iconBg = 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300';
    if (item.warnaTheme === 'teal') iconBg = 'bg-teal-500/20 border-teal-400/50 text-teal-300';
    if (item.warnaTheme === 'rose') iconBg = 'bg-rose-500/20 border-rose-400/50 text-rose-300';

    const mainTitle = isJv && item.judulJawa ? item.judulJawa : item.judul;
    const btnLabel = isJv ? 'Waos Langkung Jangkep' : 'Baca Lebih Lengkap';

    // Format kategori dwibahasa
    let katLabel = item.kategori;
    if (isJv) {
      if (item.kategori === 'Legenda Pawukon') katLabel = 'Cariyos Pawukon';
      else if (item.kategori === 'Kosmologi & Waktu') katLabel = 'Kosmologi & Wekdal';
      else if (item.kategori === 'Ekologi Tradisional') katLabel = 'Ekologi Tradisional';
      else if (item.kategori === 'Sastra & Aksara') katLabel = 'Sastra & Carakan';
    }

    return `
      <div class="p-6 rounded-3xl bg-gradient-to-b from-[#131724] to-[#0A0D15] border border-sogan-800 hover:border-prada/60 transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between group">
        <div class="space-y-3">
          <!-- Icon & Category -->
          <div class="flex items-center justify-between gap-2">
            <div class="w-12 h-12 rounded-2xl ${iconBg} border flex items-center justify-center text-xl shadow">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-sogan-950 border border-sogan-800 text-[10px] font-mono uppercase tracking-wider text-prada font-bold">
              ${katLabel}
            </span>
          </div>

          <!-- Title & Subtitle -->
          <div>
            <span class="text-xs font-mono text-amber-300/70 block">${item.aksaraJawa}</span>
            <h4 class="font-marcellus text-lg sm:text-xl font-bold text-amber-100 group-hover:text-prada-light transition-colors leading-snug">
              ${mainTitle}
            </h4>
          </div>

          <!-- Ringkasan Teks -->
          <p class="text-xs text-sogan-300 leading-relaxed line-clamp-4">
            ${item.ringkasan}
          </p>

          <!-- Tokoh Utama Pills -->
          ${Array.isArray(item.tokohUtama) ? `
          <div class="pt-2 flex flex-wrap gap-1.5">
            ${item.tokohUtama.map(t => `
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sogan-950/80 border border-sogan-800 text-sogan-300">
                ${t}
              </span>
            `).join('')}
          </div>` : ''}
        </div>

        <!-- Tombol Aksi: Baca Lebih Lengkap -->
        <div class="pt-4 border-t border-sogan-800/80 flex items-center gap-2">
          <button
            onclick="window.openMitologiModal && window.openMitologiModal('${item.id}')"
            class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow transition cursor-pointer">
            <i class="fa-solid fa-book-open"></i>
            <span>${btnLabel}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Buka modal popup detail cerita mitologi lengkap
 * @param {string} topicId 
 */
export function openMitologiModal(topicId) {
  const modal = document.getElementById('modalDetailMitologi');
  const story = getMitologiById(topicId);
  if (!modal || !story) return;

  const isJv = (typeof getLanguage === 'function' ? getLanguage() : 'id') === 'jv';

  const titleEl = document.getElementById('modalMitologiTitle');
  const subEl = document.getElementById('modalMitologiSub');
  const aksaraEl = document.getElementById('modalMitologiAksara');
  const badgeEl = document.getElementById('modalMitologiBadge');
  const bodyEl = document.getElementById('modalMitologiBody');
  const copyBtn = document.getElementById('modalMitologiCopyBtn');

  if (titleEl) titleEl.textContent = isJv && story.judulJawa ? story.judulJawa : story.judul;
  if (subEl) subEl.textContent = isJv ? story.judul : (story.judulJawa || '');
  if (aksaraEl) aksaraEl.textContent = story.aksaraJawa;
  if (badgeEl) {
    let katLabel = story.kategori;
    if (isJv) {
      if (story.kategori === 'Legenda Pawukon') katLabel = 'Cariyos Pawukon';
      else if (story.kategori === 'Kosmologi & Waktu') katLabel = 'Kosmologi & Wekdal';
      else if (story.kategori === 'Ekologi Tradisional') katLabel = 'Ekologi Tradisional';
      else if (story.kategori === 'Sastra & Aksara') katLabel = 'Sastra & Carakan';
    }
    badgeEl.textContent = katLabel;
  }

  if (copyBtn) {
    copyBtn.onclick = () => copyMitologiStory(story.id);
  }

  const ringkasanHeader = isJv ? 'Ringkesan Cariyos:' : 'Ringkasan Cerita:';
  const tokohHeader = isJv ? 'Paraga / Unsur Wigati:' : 'Tokoh / Unsur Utama:';
  const falsafahHeader = isJv ? 'Falsafah & Piwulang Luhur:' : 'Falsafah & Ajaran Luhur:';

  if (bodyEl) {
    bodyEl.innerHTML = `
      <!-- Ringkasan Box -->
      <div class="p-4 sm:p-5 rounded-2xl bg-sogan-950/80 border border-prada/30 space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono font-bold text-prada uppercase tracking-wider">
          <i class="fa-solid fa-circle-info text-amber-400"></i> ${ringkasanHeader}
        </div>
        <p class="text-xs sm:text-sm text-sogan-200 leading-relaxed font-sans">
          ${story.ringkasan}
        </p>
        ${Array.isArray(story.tokohUtama) ? `
        <div class="pt-2 flex items-center gap-2 flex-wrap border-t border-sogan-800/80">
          <span class="text-[11px] text-sogan-400 font-mono">${tokohHeader}</span>
          ${story.tokohUtama.map(t => `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-keraton text-amber-200 border border-sogan-800 font-semibold">${t}</span>`).join('')}
        </div>` : ''}
      </div>

      <!-- Bab-Bab Lengkap -->
      <div class="space-y-6 pt-2">
        ${(story.babList || []).map((bab, idx) => `
          <div class="rounded-2xl bg-keraton/90 border border-sogan-800/80 p-5 sm:p-6 space-y-3 shadow-md">
            <h4 class="font-marcellus text-base sm:text-lg font-bold text-amber-200 border-b border-sogan-800/60 pb-2 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-prada/20 border border-prada/50 text-prada flex items-center justify-center text-xs font-mono font-bold">
                ${idx + 1}
              </span>
              <span>${bab.subjudul}</span>
            </h4>
            <div class="text-xs sm:text-sm text-sogan-100 leading-relaxed space-y-3 font-sans reading-text">
              ${bab.teks.split('\n\n').map(p => `<p class="leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Pesan Moral Box -->
      ${story.pesanMoral ? `
      <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-sogan-950/80 to-keraton border border-prada/40 space-y-2 text-center sm:text-left shadow-lg">
        <div class="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold text-prada uppercase tracking-wider">
          <i class="fa-solid fa-lightbulb text-amber-400"></i> ${falsafahHeader}
        </div>
        <p class="font-marcellus text-sm sm:text-base text-amber-100 font-medium italic leading-relaxed">
          "${story.pesanMoral}"
        </p>
      </div>` : ''}
    `;
  }

  // Tampilkan Modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

/**
 * Tutup modal popup detail cerita mitologi
 */
export function closeMitologiModal() {
  const modal = document.getElementById('modalDetailMitologi');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}

/**
 * Salin isi teks cerita mitologi ke clipboard
 * @param {string} topicId 
 */
export function copyMitologiStory(topicId) {
  const story = getMitologiById(topicId);
  if (!story) return;
  const isJv = (typeof getLanguage === 'function' ? getLanguage() : 'id') === 'jv';
  const text = formatMitologiPlainText(story);
  const msg = isJv
    ? `Cariyos "${story.judulJawa || story.judul}" kasil disalin!`
    : `Cerita "${story.judul}" berhasil disalin!`;
  copyToClipboard(text, msg);
}

/**
 * Toggle ukuran font mode baca
 */
export function toggleMitologiFontSize() {
  const bodyEl = document.getElementById('modalMitologiBody');
  if (!bodyEl) return;
  const isJv = (typeof getLanguage === 'function' ? getLanguage() : 'id') === 'jv';
  if (activeReadingFontSize === 'normal') {
    activeReadingFontSize = 'large';
    bodyEl.classList.add('text-base');
    bodyEl.classList.remove('text-xs');
    showToast(isJv ? 'Mode waos: Font Gedhe (Nyaman)' : 'Mode baca: Font Besar (Nyaman)');
  } else {
    activeReadingFontSize = 'normal';
    bodyEl.classList.remove('text-base');
    bodyEl.classList.add('text-xs');
    showToast(isJv ? 'Mode waos: Font Standar' : 'Mode baca: Font Standar');
  }
}

// Global window bindings untuk interaktivitas instan di browser
if (typeof window !== 'undefined') {
  window.initMitologiUI = initMitologiUI;
  window.openMitologiModal = openMitologiModal;
  window.closeMitologiModal = closeMitologiModal;
  window.copyMitologiStory = copyMitologiStory;
  window.toggleMitologiFontSize = toggleMitologiFontSize;

  // Reaktif re-render saat bahasa diganti
  window.addEventListener('language-changed', () => {
    try {
      initMitologiUI();
    } catch (e) {
      /* ignore */
    }
  });
}
