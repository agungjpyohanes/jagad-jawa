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

/**
 * Menggambar kartu visual Sapa Dina ke HTML5 Canvas.
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} data - SapaDinaPayload
 */
export function drawSapaDinaCardToCanvas(canvas, data) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 800;
  const height = 1000;
  canvas.width = width;
  canvas.height = height;

  // 1. Background Gradient Gelap Keraton
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0c1018');
  grad.addColorStop(0.35, '#131b29');
  grad.addColorStop(0.7, '#19152b');
  grad.addColorStop(1, '#070a0f');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 24);
  ctx.fill();

  // 2. Ornamen Bingkai Emas (Dual Border Keraton)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Ornate Corner Brackets (Sudut Mahkota Keraton)
  const drawCornerFlourish = (cx, cy, flipX, flipY) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = '#f5d77f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, 28);
    ctx.lineTo(4, 4);
    ctx.lineTo(28, 4);
    ctx.stroke();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(9, 22);
    ctx.lineTo(9, 9);
    ctx.lineTo(22, 9);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(14, 14, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCornerFlourish(20, 20, false, false);
  drawCornerFlourish(width - 20, 20, true, false);
  drawCornerFlourish(20, height - 20, false, true);
  drawCornerFlourish(width - 20, height - 20, true, true);

  // 3. Header Kop Keraton
  ctx.fillStyle = '#eedc9a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('✦ KASULTANAN NUSANTARA · JAGAD JAWA ✦', width / 2, 60);

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 28px serif';
  ctx.fillText('SAPA DINA — SERAT PENGETAN RAHINA', width / 2, 92);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(130, 108);
  ctx.lineTo(width - 130, 108);
  ctx.stroke();

  // 4. Tanggal Masehi & Jawa Subheader
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14px sans-serif';
  const tglStr = `${data.hariTanggalStr}  ·  ${data.tglJawa} ${data.bulanJawa} ${data.tahunAJ} AJ (${data.tahunSiklus})`;
  ctx.fillText(tglStr, width / 2, 138);

  // 5. Hero Weton Card Box
  ctx.fillStyle = 'rgba(20, 28, 44, 0.85)';
  ctx.beginPath();
  ctx.roundRect(50, 160, width - 100, 170, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tulisan Weton Utama
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 42px serif';
  ctx.fillText(data.wetonDisplay, width / 2, 225);

  // Badge Neptu & Wuku
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(`Neptu ${data.neptu} (${data.neptuBreakdown})   ·   Wuku ${data.wukuDisplay} (${data.wukuNo}/30)`, width / 2, 264);

  // Status Dino Ijo / Abang Pill
  const isIjo = data.dinoStatus?.isIjo;
  const isGede = data.dinoStatus?.isGede;
  const pillBg = isGede ? 'rgba(234, 179, 8, 0.25)' : (isIjo ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)');
  const pillBorder = isGede ? '#eab308' : (isIjo ? '#22c55e' : '#ef4444');
  const pillText = isGede ? '#fef08a' : (isIjo ? '#86efac' : '#fca5a5');

  ctx.fillStyle = pillBg;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 170, 282, 340, 32, 16);
  ctx.fill();
  ctx.strokeStyle = pillBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = pillText;
  ctx.font = 'bold 13px sans-serif';
  const statusStr = `${data.dinoStatus?.icon || '★'} ${data.dinoStatus?.label || ''}${data.dinoStatus?.specialLabel ? ' · ' + data.dinoStatus.specialLabel : ''}`;
  ctx.fillText(statusStr, width / 2, 303);

  // 6. Pranata Mangsa Section
  let curY = 350;
  ctx.fillStyle = 'rgba(13, 30, 35, 0.85)';
  ctx.beginPath();
  ctx.roundRect(50, curY, width - 100, 155, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('KOSMOLOGI PRANATA MANGSA', width / 2, curY + 28);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 22px serif';
  ctx.fillText(data.pranata?.nama || 'Mangsa Kasa', width / 2, curY + 58);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'italic 13px serif';
  ctx.fillText(`"${data.pranata?.candrasangkala || ''}"`, width / 2, curY + 85);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Mangsa: ${data.pranata?.musimTani || ''}  ·  ${data.pranata?.rentang || ''}`, width / 2, curY + 110);

  const pratandha = `Tandha Alam: ${data.pranata?.pratandhaAlam || ''}`;
  const trimmedPratandha = pratandha.length > 70 ? pratandha.substring(0, 68) + '...' : pratandha;
  ctx.fillText(trimmedPratandha, width / 2, curY + 135);

  curY += 170;

  // 7. Petung Tetanen Box (if available)
  if (data.petungTetanen) {
    ctx.fillStyle = 'rgba(15, 35, 25, 0.85)';
    ctx.beginPath();
    ctx.roundRect(50, curY, width - 100, 115, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PETUNG TETANEN & PALAWIJA', width / 2, curY + 24);

    ctx.fillStyle = '#ecfdf5';
    ctx.font = 'bold 15px serif';
    ctx.fillText(`Kang Becik Ditandur: ${data.petungTetanen.kategoriLabel} (${data.petungTetanen.kangBecik})`, width / 2, curY + 50);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '11px sans-serif';
    const tegese = data.petungTetanen.tegese || '';
    const trimmedTegese = tegese.length > 78 ? tegese.substring(0, 75) + '...' : tegese;
    ctx.fillText(trimmedTegese, width / 2, curY + 74);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Tuladha: ${data.petungTetanen.contone || '-'}`, width / 2, curY + 96);

    curY += 130;
  }

  // 8. Pitutur Luhur Box
  const pituturH = data.petungTetanen ? 175 : 260;
  ctx.fillStyle = 'rgba(32, 27, 20, 0.9)';
  ctx.beginPath();
  ctx.roundRect(50, curY, width - 100, pituturH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('FALSAFAH & PITUTUR LUHUR HARIAN', width / 2, curY + 28);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold italic 20px serif';
  const quoteJawa = `"${data.pitutur?.jawa || 'Urip iku urup.'}"`;
  ctx.fillText(quoteJawa, width / 2, curY + 68);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  const quoteArti = data.pitutur?.artiHarfiah || '';
  const trimmedArti = quoteArti.length > 80 ? quoteArti.substring(0, 77) + '...' : quoteArti;
  ctx.fillText(trimmedArti, width / 2, curY + 102);

  if (data.pitutur?.sumber) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`— ${data.pitutur.sumber}`, width / 2, curY + 134);
  }

  // 9. Watermark Footer
  ctx.fillStyle = '#64748b';
  ctx.font = '11px monospace';
  ctx.fillText('jagad-jawa.web.app · Kasultanan Nusantara · Lestari Budaya Luhur', width / 2, height - 38);
}

/**
 * Buka modal share visual card Sapa Dina.
 * @param {Object} [data=null]
 */
export function openSapaDinaShareModal(data = null) {
  const d = data || _cachedSapaDinaData || getSapaDinaData();
  _cachedSapaDinaData = d;

  const modal = document.getElementById('modalShareSapaDina');
  const canvas = document.getElementById('sapaDinaShareCardCanvas');
  if (!modal || !canvas) return;

  drawSapaDinaCardToCanvas(canvas, d);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Tutup modal share visual card Sapa Dina.
 */
export function closeSapaDinaShareModal() {
  const modal = document.getElementById('modalShareSapaDina');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Unduh gambar kartu visual Sapa Dina sebagai PNG.
 */
export function downloadSapaDinaCardPng() {
  const canvas = document.getElementById('sapaDinaShareCardCanvas');
  if (!canvas || !_cachedSapaDinaData) return;

  const link = document.createElement('a');
  link.download = `SapaDina-${_cachedSapaDinaData.wetonDisplay.replace(/\s+/g, '_')}-${_cachedSapaDinaData.isoDate}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Gambar Sapa Dina kasil diunduh minangka file PNG! ✨');
}

/**
 * Bagikan gambar Sapa Dina via Web Share API atau copy teks.
 */
export async function shareSapaDinaVisual() {
  const canvas = document.getElementById('sapaDinaShareCardCanvas');
  if (!canvas || !_cachedSapaDinaData) return;

  const title = `Sapa Dina — ${_cachedSapaDinaData.wetonDisplay}`;
  const text = buildSapaDinaShareText(_cachedSapaDinaData);

  if (navigator.canShare && canvas.toBlob) {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        shareSapaDina(_cachedSapaDinaData);
        return;
      }
      const file = new File([blob], `SapaDina-${_cachedSapaDinaData.isoDate}.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title,
            text: `Sapa Dina — ${_cachedSapaDinaData.wetonDisplay}\nhttps://jagad-jawa.web.app`,
            files: [file]
          });
          showToast('Gambar Sapa Dina kasil dibagikaken!');
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            shareSapaDina(_cachedSapaDinaData);
          }
          return;
        }
      }
      shareSapaDina(_cachedSapaDinaData);
    }, 'image/png');
  } else {
    shareSapaDina(_cachedSapaDinaData);
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
    <!-- Sapa Dina Card (Royal Keraton Adiluhung) -->
    <article
      class="relative w-full rounded-2xl overflow-hidden
             bg-gradient-to-br from-sogan-950/95 via-wulung/90 to-keraton/95
             border-2 border-prada/40 ring-1 ring-inset ring-prada/20 ${theme.outerGlow}
             backdrop-blur-md shadow-2xl"
      role="region"
      aria-label="Sapa Dina — Ringkasan Harian">

      <!-- Ornamen Pojok Keraton (4 Sudut Tradisi Adiluhung) -->
      <div class="absolute top-2 left-2 w-8 h-8 pointer-events-none text-prada/40 select-none z-20" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M 2 24 L 2 2 L 24 2" />
          <path d="M 6 18 L 6 6 L 18 6" />
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="10" r="1" fill="currentColor"/>
        </svg>
      </div>
      <div class="absolute top-2 right-2 w-8 h-8 pointer-events-none text-prada/40 select-none z-20" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M 30 24 L 30 2 L 8 2" />
          <path d="M 26 18 L 26 6 L 14 6" />
          <circle cx="30" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="22" cy="10" r="1" fill="currentColor"/>
        </svg>
      </div>
      <div class="absolute bottom-2 left-2 w-8 h-8 pointer-events-none text-prada/40 select-none z-20" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M 2 8 L 2 30 L 24 30" />
          <path d="M 6 14 L 6 26 L 18 26" />
          <circle cx="2" cy="30" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="22" r="1" fill="currentColor"/>
        </svg>
      </div>
      <div class="absolute bottom-2 right-2 w-8 h-8 pointer-events-none text-prada/40 select-none z-20" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M 30 8 L 30 30 L 8 30" />
          <path d="M 26 14 L 26 26 L 14 26" />
          <circle cx="30" cy="30" r="1.5" fill="currentColor"/>
          <circle cx="22" cy="22" r="1" fill="currentColor"/>
        </svg>
      </div>

      <!-- Dekoratif: Gunungan Sudut -->
      <div class="absolute top-0 right-0 w-36 h-36 opacity-[0.06] text-prada pointer-events-none select-none" aria-hidden="true">
        <svg viewBox="0 0 100 120" fill="currentColor" class="w-full h-full">
          <path d="M50 5 C50 5 15 60 10 95 C8 108 20 115 50 115 C80 115 92 108 90 95 C85 60 50 5 50 5 Z
                   M50 25 C58 45 70 70 75 95 C75 95 65 100 50 100 C35 100 25 95 25 95 C30 70 42 45 50 25 Z"/>
        </svg>
      </div>
      <!-- Dekoratif: Bintang Kosmik Kiri Bawah -->
      <div class="absolute bottom-4 left-4 w-24 h-24 opacity-[0.07] text-prada pointer-events-none select-none" aria-hidden="true">
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
                  border-b border-prada/20 bg-sogan-950/60 backdrop-blur-sm">
        <div class="flex items-center gap-2.5">
          <!-- Kawung Emas Kecil -->
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-prada/30 to-sogan-950
                      border border-prada/60 flex items-center justify-center flex-shrink-0
                      shadow-[0_0_10px_rgba(212,175,55,0.4)]">
            <svg class="w-3.5 h-3.5 text-prada" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="24 4 44 24 24 44 4 24" fill="rgba(212,175,55,0.2)"/>
              <circle cx="24" cy="24" r="6" fill="rgba(245,197,66,0.25)" stroke="#f5c542" stroke-width="1.5"/>
              <path d="M24 10 C20 17 20 31 24 38" stroke="#d4af37"/>
              <path d="M10 24 C17 20 31 20 38 24" stroke="#d4af37"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-prada/90">
                ✦ Sapa Dina
              </span>
              <span class="hidden sm:inline font-mono text-[9px] text-prada/60 tracking-wider">
                · Kasultanan Jagad Jawa
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
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-prada/15">

        <!-- Kolom Kiri: Weton & Kalender Jawa -->
        <div class="px-4 sm:px-6 py-5 space-y-4">

          <!-- Badge Weton Utama (Royal Keraton Medallion) -->
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-16 h-16 rounded-2xl
                        bg-gradient-to-br from-prada/25 via-sogan-900 to-keraton
                        border-2 border-prada/60 flex flex-col items-center justify-center
                        shadow-[0_0_20px_rgba(212,175,55,0.35)] relative overflow-hidden">
              <span class="text-prada-light font-bold text-2xl leading-none drop-shadow">
                ${tglJawa}
              </span>
              <span class="text-prada/90 text-[10px] font-mono leading-none mt-1 tracking-wider uppercase">
                ${bulanJawa}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-mono text-[10px] uppercase tracking-widest text-prada/70 mb-0.5">Weton Pasaran Dina</div>
              <h2 class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text leading-tight tracking-wide drop-shadow-sm">
                ${wetonDisplay}
              </h2>
              <div class="flex flex-wrap items-center gap-1.5 mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full
                             bg-prada/20 border border-prada/40
                             text-[11px] font-bold text-prada-light font-mono shadow-sm">
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
            <div class="p-4 sm:p-5 rounded-xl
                        bg-gradient-to-br from-sogan-950/90 via-keraton/95 to-sogan-900/90
                        border border-prada/30 shadow-inner relative overflow-hidden">
              <div class="absolute top-1 right-2 text-prada/10 text-3xl font-serif select-none pointer-events-none">”</div>
              <p class="font-marcellus text-base sm:text-lg text-prada-light italic leading-snug drop-shadow-sm">
                "${pitutur.jawa}"
              </p>
              <p class="text-[12px] text-sogan-200 leading-relaxed mt-2.5">
                ${pitutur.artiHarfiah}
              </p>
              ${pitutur.sumber ? `
              <p class="text-[10px] text-prada/70 mt-2 font-mono tracking-wide">
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
          <!-- Tombol Share Visual Card -->
          <button
            onclick="window.openSapaDinaShareModal && window.openSapaDinaShareModal()"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
                   bg-gradient-to-r from-sogan-600 to-prada text-keraton
                   hover:brightness-110 text-[12px] font-bold
                   transition-all duration-200 shadow-md
                   hover:shadow-[0_0_14px_rgba(212,175,55,0.35)]
                   focus:outline-none focus:ring-1 focus:ring-prada"
            aria-label="Bagikan Gambar Kartu Sapa Dina">
            <i class="fa-solid fa-image text-[11px]"></i>
            Bagikan Gambar Kartu
          </button>
          <!-- Tombol Share Teks -->
          <button
            onclick="window.shareSapaDinaToday && window.shareSapaDinaToday()"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
                   bg-sogan-900/90 hover:bg-sogan-800
                   border border-prada/50 hover:border-prada
                   text-prada hover:text-prada-light text-[12px] font-bold
                   transition-all duration-200 shadow-sm
                   focus:outline-none focus:ring-1 focus:ring-prada/40"
            aria-label="Bagikan Teks Sapa Dina">
            <i class="fa-solid fa-share-nodes text-[11px]"></i>
            Bagikan Teks
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
    window.openSapaDinaShareModal = openSapaDinaShareModal;
    window.closeSapaDinaShareModal = closeSapaDinaShareModal;
    window.downloadSapaDinaCardPng = downloadSapaDinaCardPng;
    window.shareSapaDinaVisual = shareSapaDinaVisual;
    window.shareSapaDinaToday = shareSapaDinaToday;

    window.addEventListener('tab-switched', function (e) {
      if (e.detail?.tabId === 'beranda') {
        // Periksa apakah perlu update (hari baru setelah tengah malam)
        renderSapaDina(containerId);
      }
    });
  }
}
