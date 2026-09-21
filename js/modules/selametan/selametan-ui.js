/**
 * Jagad Jawa — Modul Domain: Selametan UI
 * Pengendali DOM untuk formulir input tanggal wafat (geblak),
 * visual timeline 7 milestone pengetan tilar donyo,
 * integrasi penandaan kalender (bookmark), dan ekspor PDF resmi.
 */

import { hitungSelametanDates } from './selametan-engine.js';
import { saveBookmark } from '../kalender/bookmark-service.js';
import { showToast } from '../../ui/toast.js';

/**
 * Menghitung dan merender seluruh hasil selametan tilar donyo.
 */
export function hitungSelametan() {
  const inputEl = document.getElementById('tglWafatInput');
  const input = inputEl?.value;
  if (!input) {
    showToast('Pilih tanggal wafat terlebih dahulu.');
    return;
  }

  const [yy, mm, dd] = input.split('-').map(Number);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return;

  // Baca opsi waktu wafat (siang vs malam setelah maghrib)
  const waktuWafatSelect = document.getElementById('waktuWafatSelect');
  const waktuWafat = waktuWafatSelect ? waktuWafatSelect.value : 'siang';

  // Baca input nama almarhum (opsional)
  const namaAlmarhumInput = document.getElementById('namaAlmarhumInput');
  const namaAlmarhum = namaAlmarhumInput ? namaAlmarhumInput.value.trim() : '';

  const data = hitungSelametanDates(yy, mm, dd, waktuWafat, namaAlmarhum);
  const { geblak, items } = data;

  // Render info Geblak
  const geblakBox = document.getElementById('geblakInfoBox');
  if (geblakBox) {
    geblakBox.style.display = 'block';
    const catatanMaghrib = waktuWafat === 'malam_maghrib' 
      ? '<span class="text-amber-400 font-medium block text-[10.5px] mt-1"><i class="fa-solid fa-moon mr-1"></i>Wafat bakda Maghrib: Dina Jawa gantos dhumateng dinten candhakipun.</span>' 
      : '';
    const labelAlmarhum = namaAlmarhum 
      ? `<div class="text-amber-200 font-bold text-xs mb-1"><i class="fa-solid fa-user-tag text-prada mr-1"></i>Almarhum/ah: <span class="text-prada-light">${namaAlmarhum}</span></div>` 
      : '';

    geblakBox.innerHTML = `
      ${labelAlmarhum}
      <span class="text-sogan-400 block text-[11px]">Dina Wafat / Geblak (Petungan Jawi):</span>
      <strong class="text-prada text-sm">${geblak.hari} ${geblak.pasaran}</strong> · ${geblak.tanggalStr} (Neptu ${geblak.neptu})
      ${catatanMaghrib}
    `;
  }

  const subtitle = document.getElementById('selametanSubtitle');
  if (subtitle) {
    subtitle.innerText = `Geblak: ${geblak.hari} ${geblak.pasaran}, ${geblak.tanggalStr} ${namaAlmarhum ? '· Almarhum/ah ' + namaAlmarhum : ''}`;
  }

  // Render tabel standar (kompatibilitas mundur)
  const tbody = document.querySelector('#tabelHasilSelametan tbody');
  if (tbody) {
    tbody.innerHTML = '';
    items.forEach(j => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-sogan-800/60 hover:bg-sogan-900/30';
      tr.innerHTML = `
        <td class="p-2.5 font-bold text-sogan-100">${j.nama}<br><span class="text-[10px] text-sogan-400 font-normal">~${j.approx} dina</span></td>
        <td class="p-2.5 font-bold text-prada">${j.targetH} ${j.targetP}</td>
        <td class="p-2.5 text-sogan-200">${j.dateStr}<br><span class="text-[10px] text-sogan-400">wiwit jam 18.00 sore</span></td>
        <td class="p-2.5 text-emerald-400 font-mono text-[11px]">${j.diffDays} dina saking geblak</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Visual Timeline Milestone
  renderTimelineSelametan(geblak, items, namaAlmarhum);

  // Simpan state terakhir
  window.LAST_SELAMETAN_DATA = {
    death: new Date(Date.UTC(yy, mm - 1, dd)),
    hariWafat: geblak.hari,
    pasaranWafat: geblak.pasaran,
    geblak,
    dd, mm, yy,
    waktuWafat,
    namaAlmarhum,
    items
  };

  // Tampilkan tombol-tombol ekspor
  ['btnPrintSelametan', 'btnPrintSelametanParchment', 'btnPrintSelametanMonochrome', 'btnDownloadSelametanPng'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = 'inline-flex';
  });
}

/**
 * Render visual timeline cards untuk 7 tahapan pengetan.
 * @param {Object} geblak 
 * @param {Array<Object>} items 
 * @param {string} namaAlmarhum 
 */
export function renderTimelineSelametan(geblak, items, namaAlmarhum = '') {
  const container = document.getElementById('timelineSelametanBox');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
        <h4 class="font-marcellus text-base sm:text-lg font-bold text-prada flex items-center gap-2">
          <i class="fa-solid fa-timeline text-amber-400"></i> Visual Timeline 7 Tahapan Pengetan
        </h4>
        <span class="text-[11px] text-sogan-400">Geblak dumugi Nyewu (1000 Dina)</span>
      </div>

      <!-- Timeline Vertical Track -->
      <div class="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-prada before:via-sogan-500 before:to-sogan-800">
        
        <!-- Milestone 0: Geblak / Dina Seda -->
        <div class="relative bg-gradient-to-r from-sogan-950 via-keraton to-wulung p-4 rounded-xl border border-prada/50 shadow-md">
          <div class="absolute -left-[27px] sm:-left-[31px] top-4 w-5 h-5 rounded-full bg-prada border-2 border-keraton flex items-center justify-center text-[9px] text-keraton font-bold shadow">
            0
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sogan-900 border border-prada/40 text-prada font-bold inline-block mb-1">
                Dina Seda / Geblak
              </span>
              <h5 class="text-sm font-bold text-sogan-100">${geblak.hari} ${geblak.pasaran} · <span class="text-prada font-mono">${geblak.tanggalStr}</span></h5>
              <p class="text-[11px] text-sogan-300 mt-0.5">Titik wiwitan petungan salira kundur ing ngarsaning Gusti Kang Akarya Jagad.</p>
            </div>
            <div class="shrink-0">
              <button onclick="window.simpanSelametanKeBookmark('${geblak.tahun}-${String(geblak.bulan).padStart(2, '0')}-${String(geblak.tanggal).padStart(2, '0')}', 'Geblak (Dina Seda)', '${geblak.hari} ${geblak.pasaran}', '${namaAlmarhum}')" 
                class="px-3 py-1.5 rounded-lg bg-sogan-900 hover:bg-sogan-800 border border-prada/40 hover:border-prada text-prada text-[11px] font-medium transition flex items-center gap-1.5 active:scale-95 shadow-sm" title="Simpan tanggal geblak ing Kalender Jawa">
                <i class="fa-regular fa-bookmark"></i> Tandai ing Kalender
              </button>
            </div>
          </div>
        </div>

        <!-- Milestones 1 - 7 -->
        ${items.map((j, idx) => `
          <div class="relative bg-keraton p-4 rounded-xl border border-sogan-800/80 hover:border-sogan-700 transition shadow-sm space-y-2">
            <div class="absolute -left-[27px] sm:-left-[31px] top-4 w-5 h-5 rounded-full bg-sogan-800 border-2 border-sogan-600 flex items-center justify-center text-[9px] text-sogan-200 font-bold shadow">
              ${idx + 1}
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-sogan-800/60 pb-2">
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-sogan-100">${j.nama}</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded bg-sogan-900 text-sogan-300 font-mono">~${j.approx} dina</span>
                  <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 font-mono">+${j.diffDays} dina saking geblak</span>
                </div>
                <div class="text-xs">
                  <strong class="text-prada font-semibold">${j.targetWeton}</strong> · <span class="text-sogan-200">${j.dateStr}</span> <span class="text-[10px] text-sogan-400 italic">(Wiwit bakda Maghrib)</span>
                </div>
              </div>

              <div class="shrink-0 pt-1 sm:pt-0">
                <button onclick="window.simpanSelametanKeBookmark('${j.isoDate}', '${j.nama}', '${j.targetWeton}', '${namaAlmarhum}')" 
                  class="px-3 py-1.5 rounded-lg bg-sogan-950 hover:bg-sogan-900 border border-sogan-700 hover:border-prada text-sogan-200 hover:text-prada text-[11px] font-medium transition flex items-center gap-1.5 active:scale-95 shadow-sm" title="Tandai tanggal pengetan punika ing Kalender Jawa">
                  <i class="fa-regular fa-bookmark"></i> Tandai ing Kalender
                </button>
              </div>
            </div>

            <!-- Rincian Kultural Ubarampe & Makna -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
              <div class="p-2 rounded-lg bg-sogan-950/60 border border-sogan-800/50 space-y-0.5">
                <span class="text-[9.5px] uppercase font-bold text-prada flex items-center gap-1">
                  <i class="fa-solid fa-bowl-rice"></i> Ubarampe Sedekah:
                </span>
                <p class="text-sogan-300 leading-relaxed">${j.ubarampe}</p>
              </div>
              <div class="p-2 rounded-lg bg-sogan-950/60 border border-sogan-800/50 space-y-0.5">
                <span class="text-[9.5px] uppercase font-bold text-amber-300 flex items-center gap-1">
                  <i class="fa-solid fa-hands-praying"></i> Donga &amp; Makna:
                </span>
                <p class="text-sogan-300 leading-relaxed">${j.maknaKultural} <span class="text-sogan-400 block mt-0.5">Donga: <em>${j.donga}</em></span></p>
              </div>
            </div>
          </div>
        `).join('')}

      </div>
    </div>
  `;
}

/**
 * Menyimpan tanggal pengetan selametan ke LocalStorage Bookmark Kalender.
 * @param {string} dateStr Format YYYY-MM-DD
 * @param {string} namaTahap 
 * @param {string} weton 
 * @param {string} namaAlmarhum 
 */
export function simpanSelametanKeBookmark(dateStr, namaTahap, weton, namaAlmarhum = '') {
  if (!dateStr) {
    showToast('Tanggal pengetan mboten valid.');
    return;
  }

  const catatan = `Pengetan ${namaTahap} (${weton})${namaAlmarhum ? ' · Almarhum/ah ' + namaAlmarhum : ''}`;
  saveBookmark(dateStr, 'pengetan_tilar_donyo', catatan);
  showToast(`Tanggal ${namaTahap} (${dateStr}) kasil katandhani ing Kalender Jawa!`);

  // Jika panel bookmark sedang terbuka di kalender, perbarui daftarnya
  if (typeof window.renderBookmarkListPanel === 'function') {
    window.renderBookmarkListPanel();
  }
}

/**
 * Ekspor / Cetak Dokumen Serat Pengetan Tilar Donyo (PDF Resmi).
 * @param {'parchment' | 'monochrome'} theme 
 */
export function printLaporanSelametan(theme = 'parchment') {
  const data = window.LAST_SELAMETAN_DATA;
  if (!data || !data.items || data.items.length === 0) {
    showToast('Hitung pengetan selametan rumiyin sakderengipun nyithak.');
    return;
  }

  const { geblak, items, namaAlmarhum, waktuWafat } = data;
  const isParchment = theme === 'parchment';

  const printArea = document.getElementById('printArea') || (function () {
    const el = document.createElement('div');
    el.id = 'printArea';
    document.body.appendChild(el);
    return el;
  })();

  const bgStyle = isParchment
    ? 'background-color: #fcf8f0; color: #3c1f11; border: 4px double #b87c24;'
    : 'background-color: #ffffff; color: #111827; border: 2px solid #374151;';

  const headerBg = isParchment
    ? 'background: linear-gradient(135deg, #f6ecd2 0%, #edd8a4 100%); border-bottom: 2px solid #b87c24;'
    : 'background: #f3f4f6; border-bottom: 2px solid #111827;';

  printArea.className = 'print-only-container';
  printArea.innerHTML = `
    <div style="${bgStyle} max-width: 800px; margin: 0 auto; padding: 28px; font-family: 'Plus Jakarta Sans', serif; border-radius: 8px;">
      
      <!-- Kop Serat Karaton -->
      <div style="${headerBg} padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <div style="font-family: 'Cinzel Decorative', serif; font-size: 20px; font-weight: 800; letter-spacing: 2px; color: ${isParchment ? '#724117' : '#111827'};">
          SERAT PENGETAN TILAR DONYO
        </div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: ${isParchment ? '#945c1a' : '#4b5563'}; margin-top: 4px;">
          JAGAD JAWA NUSANTARA &bull; KASAMPURNAN SALIRA
        </div>
      </div>

      <!-- Biodata Almarhum & Geblak -->
      <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 18px; font-size: 12px;">
        <div style="flex: 1; padding: 12px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 6px; background: ${isParchment ? '#fffdfa' : '#fafafa'};">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: ${isParchment ? '#b87c24' : '#6b7280'}; display: block;">Identitas Jenazah:</span>
          <div style="font-size: 14px; font-weight: bold; margin-top: 2px;">${namaAlmarhum ? 'Almarhum/ah ' + namaAlmarhum : 'Almarhum / Almarhumah'}</div>
          <div style="color: ${isParchment ? '#724117' : '#374151'}; margin-top: 2px;">
            Wafat: ${geblak.tanggalMasehiAsli || geblak.tanggalStr} ${waktuWafat === 'malam_maghrib' ? '(Bakda Maghrib)' : '(Siang)'}
          </div>
        </div>

        <div style="flex: 1; padding: 12px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 6px; background: ${isParchment ? '#fffdfa' : '#fafafa'};">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: ${isParchment ? '#b87c24' : '#6b7280'}; display: block;">Dina Geblak (Petungan Jawi):</span>
          <div style="font-size: 14px; font-weight: bold; margin-top: 2px; color: ${isParchment ? '#945c1a' : '#111827'};">
            ${geblak.hari} ${geblak.pasaran} (Neptu: ${geblak.neptu})
          </div>
          <div style="color: ${isParchment ? '#724117' : '#374151'}; margin-top: 2px;">
            Surup Pananggalan: ${geblak.tanggalStr}
          </div>
        </div>
      </div>

      <!-- Tabel Jadwal 7 Pengetan -->
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">
        <thead>
          <tr style="background: ${isParchment ? '#edd8a4' : '#e5e7eb'}; text-align: left; text-transform: uppercase;">
            <th style="padding: 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">Pengetan</th>
            <th style="padding: 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">Weton Jawi</th>
            <th style="padding: 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">Tanggal Masehi</th>
            <th style="padding: 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">Ubarampe &amp; Sedekah</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(j => `
            <tr style="border-bottom: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'};">
              <td style="padding: 8px; border: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'}; font-weight: bold;">
                ${j.nama}<br><span style="font-size: 9px; font-weight: normal; color: ${isParchment ? '#945c1a' : '#6b7280'};">+${j.diffDays} dina saking geblak</span>
              </td>
              <td style="padding: 8px; border: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'}; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">
                ${j.targetWeton}
              </td>
              <td style="padding: 8px; border: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'};">
                ${j.dateStr}<br><span style="font-size: 9px; color: ${isParchment ? '#945c1a' : '#6b7280'};">Wiwit jam 18.00 (Maghrib)</span>
              </td>
              <td style="padding: 8px; border: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'}; font-size: 10px;">
                ${j.ubarampe}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Catatan Adat & Tanda Tangan -->
      <div style="font-size: 10.5px; color: ${isParchment ? '#724117' : '#4b5563'}; line-height: 1.5; margin-bottom: 24px; padding: 10px; background: ${isParchment ? '#f6ecd2' : '#f9fafb'}; border-radius: 4px;">
        <strong>Pangeling-eling:</strong> Upacara pengetan tilar donyo lumrahipun kaleksanan ing wayah sonten / bakda Maghrib (jam 18.00) kanthi maos Surat Yasin, Tahlil, saha donga arwah. Mugi sedaya amal kesaenan almarhum/ah tinampi dening Gusti Kang Maha Luhur.
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; border-top: 1px solid ${isParchment ? '#b87c24' : '#d1d5db'}; pt-3;">
        <div>
          <span style="font-size: 9.5px; color: ${isParchment ? '#945c1a' : '#9ca3af'};">Jagad Jawa &bull; Sistem Kasampurnan Petungan Tradisi</span>
        </div>
        <div style="text-align: center;">
          <div style="font-weight: bold; font-family: 'Cinzel Decorative', serif; font-size: 11px;">JAGAD JAWA NUSANTARA</div>
          <div style="height: 36px; display: flex; align-items: center; justify-content: center; font-style: italic; font-size: 9px; color: ${isParchment ? '#b87c24' : '#9ca3af'};">[ Cap Kawruh Resmi ]</div>
          <div style="border-top: 1px solid ${isParchment ? '#b87c24' : '#4b5563'}; padding-top: 2px; font-size: 9.5px;">Serat Pengetan Tilar Donyo</div>
        </div>
      </div>

    </div>
  `;

  window.print();
}

/**
 * Mengunduh tabel kartu selametan dalam format gambar PNG berkualitas tinggi.
 */
export async function downloadSelametanPng() {
  const card = document.getElementById('hasilSelametanCard');
  if (!card) {
    showToast('Tabel pengetan dereng kasedhiyakaken.');
    return;
  }

  if (typeof window.html2canvas !== 'function') {
    showToast('Pustaka html2canvas dereng cumawis.');
    return;
  }

  try {
    showToast('Nyiapaken gambar pengetan tilar donyo...');
    const canvas = await window.html2canvas(card, {
      backgroundColor: '#0f141d',
      scale: 2,
      useCORS: true
    });
    const link = document.createElement('a');
    const tgl = window.LAST_SELAMETAN_DATA?.geblak?.tanggalStr || 'selametan';
    link.download = `pengetan-tilar-donyo-${tgl.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Gambar kasil dipundhuh!');
  } catch (err) {
    console.error('Gagal mengunduh PNG:', err);
    showToast('Gagal ngundhuh gambar pengetan.');
  }
}
