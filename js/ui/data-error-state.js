/**
 * Jagad Jawa — Data Error State & Retry UI Helper
 * 
 * Standar komponen UI ketika pemuatan dataset Cloudflare KV via Pages Functions API gagal.
 * Memberikan feedback jelas dwibahasa (ID & JV), aksesibilitas (aria-live="assertive"),
 * tombol coba lagi keyboard-accessible, status loading/disabled saat retry,
 * serta mencegah proses kalkulasi berjalan diam-diam dengan fallback palsu.
 */

import { getLanguage } from './i18n.js';

export const ERROR_MESSAGES = {
  id: {
    title: 'Gagal Memuat Data Tradisi',
    desc: 'Basis data tradisi tidak dapat diakses atau koneksi terputus. Kalkulasi dinonaktifkan demi menjaga kesahihan hasil budaya.',
    retry: 'Coba Lagi',
    retrying: 'Memuat...',
    offline: 'Silakan periksa sambungan internet atau ketersediaan berkas data statis.',
    supplemental: 'Dataset suplemental ini belum dapat dimuat.'
  },
  jv: {
    title: 'Data Tradisi Dereng Kasil Dipunpendhet',
    desc: 'Basis data tradisi mboten saged kapundhut utawi pedhot sambunganipun. Etungan dipun-kendeli supados jumeneng leres paugeranipun.',
    retry: 'Ambali Malih',
    retrying: 'Nengga...',
    offline: 'Kersaa mriksa sambungan internet utawi panyawis berkas data.',
    supplemental: 'Dataset suplemental punika dereng saged dipun-pendhet.'
  }
};

/**
 * Render kartu pesan kesalahan dan tombol coba lagi ke kontainer tujuan
 * @param {string|HTMLElement} container - Elemen atau ID elemen sasaran
 * @param {Object} options
 * @param {string} [options.domain] - Nama domain (misal 'jodoh', 'kalender', 'omah', 'wayang')
 * @param {Function} [options.onRetry] - Callback fungsi coba lagi saat tombol diklik
 * @param {string} [options.customMsg] - Pesan spesifik opsional
 * @param {boolean} [options.isSupplemental] - Apakah key merupakan dataset suplemental yang belum diunggah
 */
export function renderDataErrorState(container, options = {}) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;

  const lang = (typeof getLanguage === 'function' ? getLanguage() : 'id') === 'jv' ? 'jv' : 'id';
  const t = ERROR_MESSAGES[lang];
  const domainLabel = options.domain ? ` [${options.domain.toUpperCase()}]` : '';

  const descriptionText = options.customMsg || 
    (options.isSupplemental ? `${t.desc} (${t.supplemental})` : t.desc);

  el.innerHTML = `
    <div class="data-error-state p-5 sm:p-6 rounded-2xl bg-rose-950/80 border border-rose-600/70 text-rose-100 shadow-xl space-y-3.5 my-3" role="alert" aria-live="assertive">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-900/90 border border-rose-500/60 flex items-center justify-center text-rose-300 text-lg shrink-0 shadow-inner" aria-hidden="true">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="font-marcellus font-bold text-base text-rose-200">
            ${t.title}${domainLabel}
          </h4>
          <p class="text-xs text-rose-200/90 leading-relaxed mt-1">
            ${descriptionText}
          </p>
          <div class="text-[10.5px] text-rose-300/80 italic mt-1.5 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            <span>${t.offline}</span>
          </div>
        </div>
      </div>
      ${typeof options.onRetry === 'function' ? `
        <div class="pt-2 border-t border-rose-900/60 flex justify-end">
          <button type="button" 
            class="btn-retry-data px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition transform active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-rose-950"
            aria-label="${t.retry} ${options.domain ? options.domain : 'data'}">
            <i class="fa-solid fa-rotate-right retry-icon" aria-hidden="true"></i>
            <span class="retry-label">${t.retry}</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;

  if (typeof options.onRetry === 'function') {
    const btn = el.querySelector('.btn-retry-data');
    if (btn) {
      btn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        if (btn.disabled) return;

        // Pasang status loading / disabled saat retry berjalan
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        const icon = btn.querySelector('.retry-icon');
        const label = btn.querySelector('.retry-label');
        if (icon) icon.className = 'fa-solid fa-spinner fa-spin retry-icon';
        if (label) label.textContent = t.retrying;

        try {
          await Promise.resolve(options.onRetry());
        } catch (retryErr) {
          console.warn('[data-error-state] Retry error:', retryErr);
          // Jika masih gagal dan kontainer belum dirombak, kembalikan status
          if (btn.isConnected) {
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            if (icon) icon.className = 'fa-solid fa-rotate-right retry-icon';
            if (label) label.textContent = t.retry;
          }
        }
      });
    }
  }
}
