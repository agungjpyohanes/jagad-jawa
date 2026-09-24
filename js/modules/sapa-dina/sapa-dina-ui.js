/**
 * Jagad Jawa — Modul Domain: Sapa Dina UI
 * Renderer kartu "Sapa Dina" (Ringkasan Harian) beserta logika share,
 * LocalStorage state, dan interaksi dismiss/expand.
 *
 * Dependensi:
 *   • sapa-dina-engine.js  — getSapaDinaData()
 *   • ui/toast.js          — showToast, copyToClipboard
 *
 * LocalStorage Keys:
 *   'jagadjawa_sapa_dismissed'  → ISO date string "YYYY-MM-DD"
 *     (Jika value = tanggal hari ini → card ditampilkan dalam mode collapsed)
 */

import { getSapaDinaData } from './sapa-dina-engine.js';
import { showToast, copyToClipboard } from '../../ui/toast.js';

// ─── KONSTANTA ────────────────────────────────────────────────────────────────
const LS_KEY_DISMISSED = 'jagadjawa_sapa_dismissed';

// ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────

/**
 * Cek apakah user sudah dismiss card Sapa Dina hari ini.
 * @returns {boolean}
 */
export function isSapaDinaDismissed() {
  try {
    const stored = localStorage.getItem(LS_KEY_DISMISSED);
    if (!stored) return false;
    const today = new Date();
    const pad = n => String(n).padStart(2, '0');
    const todayIso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    return stored === todayIso;
  } catch {
    return false;
  }
}

/**
 * Simpan state dismiss untuk hari ini.
 * @param {string} isoDate — "YYYY-MM-DD"
 */
function saveDismissState(isoDate) {
  try {
    localStorage.setItem(LS_KEY_DISMISSED, isoDate);
  } catch { /* storage penuh, abaikan */ }
}

/**
 * Hapus state dismiss (untuk "Lihat lagi").
 */
function clearDismissState() {
  try {
    localStorage.removeItem(LS_KEY_DISMISSED);
  } catch { /* abaikan */ }
}

// ─── SHARE HELPERS ────────────────────────────────────────────────────────────

/**
 * Bangun teks share plain-text untuk Sapa Dina.
 * @param {Object} data — SapaDinaPayload
 * @returns {string}
 */
export function buildSapaDinaShareText(data) {
  const { wetonDisplay, neptu, wukuDisplay, pranata, dinoStatus, pitutur, hariTanggalStr, tanggalMasehiStr, petungTetanen } = data;
  return (
    `🌟 *SAPA DINA — JAGAD JAWA* 🌟\n` +
    `_Ringkasan Harian Kalender Jawa_\n\n` +
    `📅 *${hariTanggalStr}*\n` +
    `⭐ *Weton:* ${wetonDisplay}\n` +
    `🔢 *Neptu:* ${neptu} (${data.neptuBreakdown})\n` +
    `🪐 *Wuku:* ${wukuDisplay} (${data.wukuNo}/30)\n` +
    `🌾 *Pranata Mangsa:* ${pranata.nama} — ${pranata.musimTani}\n` +
    (petungTetanen ? `🌱 *Petung Tetanen:* ${petungTetanen.kategoriLabel} (${petungTetanen.kangBecik}) — ${petungTetanen.tegese}\n` : '') +
    `🪶 *Candrasangkala:* "${pranata.candrasangkala}"\n` +
    `${dinoStatus.isIjo ? '🟢' : '🔴'} *Status Dina:* ${dinoStatus.statusText}` +
    `${dinoStatus.specialLabel ? ' · ' + dinoStatus.specialLabel : ''}\n\n` +
    `💬 *Pitutur Luhur Hari Ini:*\n` +
    `"${pitutur.jawa}"\n` +
    `_${pitutur.artiHarfiah}_\n\n` +
    `Jelajahi kalender Jawa & budaya Nusantara:\nhttps://jagad-jawa.vercel.app`
  );
}

/**
 * Bagikan Sapa Dina via Web Share API (fallback: copy to clipboard).
 * @param {Object} data — SapaDinaPayload
 */
export async function shareSapaDina(data) {
  const text = buildSapaDinaShareText(data);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Sapa Dina — ${data.wetonDisplay}`,
        text
      });
      showToast('Sapa Dina berhasil dibagikan! ✨');
    } catch (err) {
      // User membatalkan share — tidak perlu tampil error
      if (err.name !== 'AbortError') {
        copyToClipboard(text, 'Teks Sapa Dina disalin ke clipboard!');
      }
    }
  } else {
    copyToClipboard(text, 'Teks Sapa Dina disalin ke clipboard!');
  }
}

// ─── RENDER HELPERS ───────────────────────────────────────────────────────────

/**
 * Bangun CSS class untuk badge weton besar berdasarkan status dino.
 */
function getDinoTheme(dinoStatus) {
  if (dinoStatus.isGede) {
    return {
      outerGlow: 'shadow-[0_0_28px_rgba(234,179,8,0.25)]',
      border:    'border-yellow-500/60',
      badgeBg:   'bg-yellow-900/40',
      badgeText: 'text-yellow-300',
      badgeBorder: 'border-yellow-500/50',
      icon:      '★',
      iconColor: 'text-yellow-400',
      statusBg:  'bg-gradient-to-r from-yellow-900/50 to-yellow-950/70',
      statusBorder: 'border-yellow-600/40',
      pill:      'bg-yellow-700 text-yellow-100',
    };
  }
  if (dinoStatus.isIjo) {
    return {
      outerGlow: 'shadow-[0_0_28px_rgba(34,197,94,0.12)]',
      border:    'border-emerald-700/40',
      badgeBg:   'bg-emerald-950/40',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-700/40',
      icon:      '✓',
      iconColor: 'text-emerald-400',
      statusBg:  'bg-gradient-to-r from-emerald-950/60 to-emerald-900/30',
      statusBorder: 'border-emerald-700/40',
      pill:      'bg-emerald-700 text-emerald-50',
    };
  }
  // Abang (ala)
  return {
    outerGlow: 'shadow-[0_0_28px_rgba(185,28,28,0.12)]',
    border:    'border-red-800/40',
    badgeBg:   'bg-red-950/40',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-800/40',
    icon:      '▲',
    iconColor: 'text-red-400',
    statusBg:  'bg-gradient-to-r from-red-950/60 to-red-900/20',
    statusBorder: 'border-red-800/30',
    pill:      'bg-red-800 text-red-50',
  };
}

/**
 * Render strip "Sapa Dina sudah dibaca" (mode collapsed).
 * @param {string} containerId
 * @param {Object} data — SapaDinaPayload
 */
function renderCollapsedStrip(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="w-full flex items-center justify-between gap-3 px-4 py-2.5
                rounded-xl border border-prada/20 bg-sogan-950/60
                backdrop-blur-sm text-xs text-sogan-300"
         role="status" aria-label="Sapa Dina sudah dibaca hari ini">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
        <span class="font-semibold text-prada/80 truncate">
          Sapa Dina hari ini:
        </span>
        <span class="text-sogan-200 truncate">
          ${data.wetonDisplay} &middot; Neptu ${data.neptu} &middot; Wuku ${data.wukuDisplay}
        </span>
      </div>
      <button
        onclick="window.expandSapaDina && window.expandSapaDina()"
        class="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg
               border border-prada/30 bg-sogan-900 hover:bg-sogan-800
               text-prada hover:text-prada-light font-semibold transition-all duration-200
               focus:outline-none focus:ring-1 focus:ring-prada/40"
        title="Tampilkan kembali Sapa Dina"
        aria-label="Tampilkan kembali Sapa Dina">
        <i class="fa-solid fa-chevron-down text-[9px]"></i>
        <span>Lihat lagi</span>
      </button>
    </div>
  `;
}

/**
 * Render kartu Sapa Dina penuh (mode expanded).
 * @param {string} containerId
 * @param {Object} data — SapaDinaPayload
 */
function renderExpandedCard(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const theme = getDinoTheme(data.dinoStatus);
  const { wetonDisplay, neptu, neptuBreakdown, wukuDisplay, wukuNo, bulanJawa, tglJawa, tahunAJ, tahunSiklus, namaWindu } = data;
  const { pranata, dinoStatus, pitutur, hariTanggalStr } = data;

  // Potong candrasangkala jika terlalu panjang di mobile
  const candrasangkala = pranata.candrasangkala || '';
  const pratandha = pranata.pratandhaAlam
    ? (pranata.pratandhaAlam.length > 120
        ? pranata.pratandhaAlam.substring(0, 118) + '…'
        : pranata.pratandhaAlam)
    : '';

  container.innerHTML = `
    <!-- Sapa Dina Card -->
    <article
      class="relative w-full rounded-2xl overflow-hidden
             bg-gradient-to-br from-sogan-950/95 via-wulung/90 to-keraton/95
             border border-prada/35 ${theme.outerGlow}
             backdrop-blur-md shadow-2xl"
      role="region"
      aria-label="Sapa Dina — Ringkasan Harian">

      <!-- Dekoratif: Gunungan Sudut -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-[0.05] text-prada pointer-events-none select-none" aria-hidden="true">
        <svg viewBox="0 0 100 120" fill="currentColor" class="w-full h-full">
          <path d="M50 5 C50 5 15 60 10 95 C8 108 20 115 50 115 C80 115 92 108 90 95 C85 60 50 5 50 5 Z
                   M50 25 C58 45 70 70 75 95 C75 95 65 100 50 100 C35 100 25 95 25 95 C30 70 42 45 50 25 Z"/>
        </svg>
      </div>
      <!-- Dekoratif: Bintang Kosmik Kiri Bawah -->
      <div class="absolute bottom-4 left-4 w-20 h-20 opacity-[0.06] text-prada pointer-events-none select-none" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="50" cy="50" r="40" stroke-dasharray="4 4"/>
          <path d="M50 10 C35 35 35 65 50 90 M50 10 C65 35 65 65 50 90"/>
          <path d="M10 50 C35 35 65 35 90 50 M10 50 C35 65 65 65 90 50"/>
          <circle cx="50" cy="50" r="8" fill="rgba(245,197,66,0.3)"/>
        </svg>
      </div>

      <!-- ── HEADER BAR ───────────────────────────────────── -->
      <div class="relative z-10 flex items-center justify-between
                  px-4 sm:px-6 py-3
                  border-b border-prada/20 bg-sogan-950/50">
        <div class="flex items-center gap-2.5">
          <!-- Kawung Emas Kecil -->
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-prada/30 to-sogan-950
                      border border-prada/50 flex items-center justify-center flex-shrink-0
                      shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            <svg class="w-3.5 h-3.5 text-prada" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="24 4 44 24 24 44 4 24" fill="rgba(212,175,55,0.15)"/>
              <circle cx="24" cy="24" r="6" fill="rgba(245,197,66,0.2)" stroke="#f5c542" stroke-width="1.5"/>
              <path d="M24 10 C20 17 20 31 24 38" stroke="#d4af37"/>
              <path d="M10 24 C17 20 31 20 38 24" stroke="#d4af37"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-prada/90">
                ✦ Sapa Dina
              </span>
              <span class="hidden sm:inline font-mono text-[9px] text-prada/50 tracking-wider">
                · Jagad Jawa
              </span>
            </div>
            <div class="text-[11px] text-sogan-300 leading-none mt-0.5">
              ${hariTanggalStr}
            </div>
          </div>
        </div>

        <!-- Tombol Dismiss -->
        <button
          onclick="window.dismissSapaDina && window.dismissSapaDina()"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                 bg-sogan-900/80 hover:bg-sogan-800 border border-sogan-700/60
                 text-sogan-400 hover:text-sogan-200 text-[11px] font-medium
                 transition-all duration-200
                 focus:outline-none focus:ring-1 focus:ring-prada/30"
          title="Tutup Sapa Dina hari ini"
          aria-label="Tutup Sapa Dina hari ini">
          <i class="fa-solid fa-xmark text-[10px]"></i>
          <span class="hidden sm:inline">Tutup hari ini</span>
        </button>
      </div>

      <!-- ── BODY GRID ────────────────────────────────────── -->
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-prada/10">

        <!-- Kolom Kiri: Weton & Kalender Jawa -->
        <div class="px-4 sm:px-6 py-5 space-y-4">

          <!-- Badge Weton Utama -->
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-14 h-14 rounded-2xl
                        bg-gradient-to-br from-prada/20 to-sogan-950
                        border border-prada/50 flex flex-col items-center justify-center
                        shadow-[0_0_16px_rgba(212,175,55,0.2)]">
              <span class="text-prada font-bold text-xl leading-none">
                ${tglJawa}
              </span>
              <span class="text-sogan-400 text-[9px] font-mono leading-none mt-0.5">
                ${bulanJawa}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text leading-tight tracking-wide">
                ${wetonDisplay}
              </h2>
              <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full
                             bg-prada/15 border border-prada/30
                             text-[11px] font-bold text-prada-light font-mono">
                  Neptu ${neptu}
                </span>
                ${dinoStatus.isGede ? `
                <span class="inline-flex items-center px-2 py-0.5 rounded-full
                             bg-yellow-700/30 border border-yellow-500/40
                             text-[10px] font-bold text-yellow-300">
                  ★ Dino Gede
                </span>` : ''}
              </div>
            </div>
          </div>

          <!-- Breakdown Neptu -->
          <div class="px-3 py-2 rounded-xl bg-sogan-900/50 border border-sogan-800/60">
            <div class="font-mono text-[10px] text-prada/70 uppercase tracking-wider mb-1">
              Petung Neptu
            </div>
            <div class="text-[12px] text-sogan-200 font-medium">
              ${neptuBreakdown}
            </div>
          </div>

          <!-- Wuku & Tanggal Jawa -->
          <div class="grid grid-cols-2 gap-3">
            <div class="px-3 py-2.5 rounded-xl bg-sogan-900/40 border border-sogan-800/50">
              <div class="font-mono text-[10px] text-prada/70 uppercase tracking-wider">Wuku</div>
              <div class="text-sm font-bold text-sogan-100 mt-0.5">
                ${wukuDisplay}
                <span class="text-sogan-400 font-normal text-[10px]"> (${wukuNo}/30)</span>
              </div>
            </div>
            <div class="px-3 py-2.5 rounded-xl bg-sogan-900/40 border border-sogan-800/50">
              <div class="font-mono text-[10px] text-prada/70 uppercase tracking-wider">Tahun Jawa</div>
              <div class="text-sm font-bold text-sogan-100 mt-0.5">
                ${tahunAJ} AJ
                <span class="text-sogan-400 font-normal text-[10px]">${tahunSiklus}</span>
              </div>
            </div>
          </div>

          <!-- Status Dino Ijo / Abang -->
          <div class="px-4 py-3 rounded-xl ${theme.statusBg} border ${theme.statusBorder}">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="${theme.iconColor} font-bold text-base">${theme.icon}</span>
                <span class="text-sm font-bold ${theme.badgeText}">
                  ${dinoStatus.label}
                </span>
              </div>
              ${dinoStatus.specialLabel ? `
              <span class="text-[10px] font-semibold text-prada/80 bg-prada/10
                           px-2 py-0.5 rounded-full border border-prada/20">
                ${dinoStatus.specialLabel}
              </span>` : ''}
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Pranata Mangsa + Pitutur Luhur -->
        <div class="px-4 sm:px-6 py-5 space-y-4">

          <!-- Pranata Mangsa -->
          <div class="space-y-2">
            <div class="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-400/80
                        flex items-center gap-1.5">
              <i class="fa-solid fa-leaf text-[9px]"></i>
              Pranata Mangsa
            </div>
            <div class="px-4 py-3 rounded-xl bg-teal-950/30 border border-teal-700/25">
              <div class="text-base font-bold text-teal-200 font-marcellus">
                ${pranata.nama}
              </div>
              <div class="text-[11px] text-teal-400 mt-0.5">
                ${pranata.musimTani}
                <span class="text-sogan-500 mx-1">·</span>
                ${pranata.rentang}
              </div>
              ${candrasangkala ? `
              <div class="mt-2 text-[11px] italic text-sky-300/80 leading-relaxed">
                "${candrasangkala}"
              </div>` : ''}
              ${pratandha ? `
              <div class="mt-1.5 text-[10px] text-sogan-400 leading-relaxed">
                ${pratandha}
              </div>` : ''}
            </div>
          </div>

          ${data.petungTetanen ? `
          <!-- Petung Tetanen Tradisional (CSV Baru) -->
          <div class="space-y-2">
            <div class="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400/80
                        flex items-center gap-1.5">
              <i class="fa-solid fa-wheat-awn text-[9px]"></i>
              Petung Tetanen &amp; Palawija (Weton ${wetonDisplay})
            </div>
            <div class="px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-700/25 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-200 flex items-center">
                  <i class="${data.petungTetanen.icon} mr-1.5 text-emerald-300"></i>
                  <span>Kang Becik: ${data.petungTetanen.kategoriLabel} (${data.petungTetanen.kangBecik})</span>
                </span>
                <span class="text-[9.5px] px-2 py-0.5 rounded ${data.petungTetanen.badgeClass} border font-semibold font-mono">
                  Cocog Ditandur
                </span>
              </div>
              <div class="text-[11px] text-sogan-200 leading-relaxed">
                ${data.petungTetanen.tegese}
              </div>
              <div class="text-[10px] text-emerald-300/90 pt-1 border-t border-emerald-900/40">
                <strong>Tuladha:</strong> ${data.petungTetanen.contone}
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Divider -->
          <div class="border-t border-prada/10"></div>

          <!-- Pitutur Luhur Harian -->
          <div class="space-y-2">
            <div class="font-mono text-[10px] font-bold uppercase tracking-widest text-prada/80
                        flex items-center gap-1.5">
              <i class="fa-solid fa-quote-left text-[9px]"></i>
              Pitutur Luhur Hari Ini
            </div>
            <div class="px-4 py-3.5 rounded-xl
                        bg-gradient-to-br from-sogan-950/80 to-keraton/90
                        border border-prada/20">
              <p class="font-marcellus text-base sm:text-lg text-prada-light italic leading-snug">
                "${pitutur.jawa}"
              </p>
              <p class="text-[11px] text-sogan-300 leading-relaxed mt-2">
                ${pitutur.artiHarfiah}
              </p>
              ${pitutur.sumber ? `
              <p class="text-[10px] text-sogan-500 mt-2 font-mono">
                — ${pitutur.sumber}
              </p>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- ── FOOTER ACTIONS ───────────────────────────────── -->
      <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3
                  px-4 sm:px-6 py-3.5
                  border-t border-prada/15 bg-sogan-950/60">
        <div class="text-[10px] text-sogan-500 font-mono text-center sm:text-left">
          ${tglJawa} ${bulanJawa} ${tahunAJ} AJ &middot; Windu ${namaWindu}
        </div>
        <div class="flex items-center gap-2.5 flex-wrap justify-center">
          <!-- Tombol Share -->
          <button
            onclick="window.shareSapaDinaToday && window.shareSapaDinaToday()"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
                   bg-gradient-to-r from-prada/20 to-sogan-900
                   border border-prada/50 hover:border-prada
                   text-prada hover:text-prada-light text-[12px] font-bold
                   transition-all duration-200 shadow-sm
                   hover:shadow-[0_0_12px_rgba(212,175,55,0.25)]
                   focus:outline-none focus:ring-1 focus:ring-prada/40"
            aria-label="Bagikan Sapa Dina hari ini">
            <i class="fa-solid fa-share-nodes text-[11px]"></i>
            Bagikan Sapa Dina
          </button>
          <!-- Tombol Ke Kalender Jawa -->
          <button
            onclick="typeof switchTab === 'function' && switchTab('kalender')"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
                   bg-sogan-900/80 hover:bg-sogan-800
                   border border-sogan-700/60 hover:border-sogan-600
                   text-sogan-300 hover:text-sogan-100 text-[12px] font-semibold
                   transition-all duration-200
                   focus:outline-none focus:ring-1 focus:ring-prada/30"
            aria-label="Buka Kalender Jawa lengkap">
            <i class="fa-solid fa-calendar-days text-[11px] text-prada"></i>
            Kalender Jawa
          </button>
        </div>
      </div>

    </article>
  `;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/** Cache data hari ini agar share button bisa akses tanpa hitung ulang */
let _cachedSapaDinaData = null;

/**
 * Render kartu Sapa Dina ke dalam container.
 * Secara otomatis memilih mode expanded atau collapsed berdasarkan LocalStorage.
 *
 * @param {string} [containerId='sapa-dina-container']
 * @param {boolean} [forceExpanded=false]
 */
export function renderSapaDina(containerId = 'sapa-dina-container', forceExpanded = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const data = getSapaDinaData();
    _cachedSapaDinaData = data;

    const dismissed = isSapaDinaDismissed();

    if (dismissed && !forceExpanded) {
      renderCollapsedStrip(containerId, data);
    } else {
      renderExpandedCard(containerId, data);
    }
  } catch (err) {
    // Fallback: jika ada error tidak terduga, sembunyikan container
    console.warn('[SapaDina] Gagal merender kartu:', err);
    container.innerHTML = '';
  }
}

/**
 * Dismiss (collapse) Sapa Dina dan simpan state ke LocalStorage.
 * Dipanggil dari tombol "Tutup hari ini" di kartu.
 *
 * @param {string} [containerId='sapa-dina-container']
 */
export function dismissSapaDina(containerId = 'sapa-dina-container') {
  if (!_cachedSapaDinaData) return;
  saveDismissState(_cachedSapaDinaData.isoDate);
  renderCollapsedStrip(containerId, _cachedSapaDinaData);
  showToast('Sapa Dina disimpan. Sampai jumpa besok! 🌙');
}

/**
 * Expand kembali Sapa Dina (hapus state dismiss).
 * Dipanggil dari tombol "Lihat lagi" di strip collapsed.
 *
 * @param {string} [containerId='sapa-dina-container']
 */
export function expandSapaDina(containerId = 'sapa-dina-container') {
  clearDismissState();
  renderSapaDina(containerId, true);
}

/**
 * Bagikan data Sapa Dina hari ini (gunakan cache bila tersedia).
 */
export async function shareSapaDinaToday() {
  const data = _cachedSapaDinaData || getSapaDinaData();
  await shareSapaDina(data);
}

/**
 * Inisialisasi Sapa Dina: render ke container dan daftarkan handler tab-switched.
 * Dipanggil dari bootstrap() di main.js.
 *
 * @param {string} [containerId='sapa-dina-container']
 */
export function initSapaDina(containerId = 'sapa-dina-container') {
  // Render langsung saat init
  renderSapaDina(containerId);

  // Re-render saat user kembali ke tab beranda (misalnya setelah tengah malam)
  if (typeof window !== 'undefined') {
    window.addEventListener('tab-switched', function (e) {
      if (e.detail?.tabId === 'beranda') {
        // Periksa apakah perlu update (hari baru setelah tengah malam)
        renderSapaDina(containerId);
      }
    });
  }
}
