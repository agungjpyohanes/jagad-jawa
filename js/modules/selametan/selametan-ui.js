/**
 * Jagad Jawa — Modul Domain: Selametan UI
 * Pengendali DOM untuk formulir input tanggal wafat (geblak),
 * visual timeline 7 milestone pengetan tilar donyo,
 * integrasi penandaan kalender (bookmark), dan ekspor PDF resmi.
 */

import { hitungSelametanDates, TEMPLAT_DONGA_KEYAKINAN } from './selametan-engine.js';
import { saveBookmark } from '../kalender/bookmark-service.js';
import { showToast } from '../../ui/toast.js';
import { downloadCanvasAsPng } from '../../ui/download-helper.js';
import { loadDomainData } from '../../services/dbLoader.js';

let currentSelametanKeyakinan = 'universal';

/**
 * Mengganti tradisi/keyakinan doa secara interaktif dari timeline
 * @param {string} keyakinanKey 
 */
export function gantiKeyakinanSelametan(keyakinanKey) {
  if (!TEMPLAT_DONGA_KEYAKINAN[keyakinanKey]) return;
  currentSelametanKeyakinan = keyakinanKey;

  const sel = document.getElementById('keyakinanSelametanSelect');
  if (sel) sel.value = keyakinanKey;

  const data = window.LAST_SELAMETAN_DATA;
  if (data && data.items) {
    data.keyakinan = keyakinanKey;
    data.items.forEach(item => {
      if (item.dongaKeyakinanMap && item.dongaKeyakinanMap[keyakinanKey]) {
        item.donga = item.dongaKeyakinanMap[keyakinanKey];
      }
    });
    renderTimelineSelametan(data.geblak, data.items, data.namaAlmarhum, keyakinanKey);
    const label = TEMPLAT_DONGA_KEYAKINAN[keyakinanKey]?.nama;
    showToast(`Donga kaleresaken dhateng panduan: ${label}`);
  }
}

/**
 * Menghitung dan merender seluruh hasil selametan tilar donyo.
 */
export async function hitungSelametan() {
  try {
    await loadDomainData('selametan');
  } catch (e) {
    console.warn('[selametan-ui] loadDomainData fallback:', e);
  }
  const inputEl = document.getElementById('tglWafatInput');
  if (inputEl && !inputEl.value) {
    inputEl.value = new Date().toISOString().slice(0, 10);
  }
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

  // Baca pilihan keyakinan / templat doa inklusif
  const keyakinanSelect = document.getElementById('keyakinanSelametanSelect');
  const keyakinan = keyakinanSelect ? keyakinanSelect.value : currentSelametanKeyakinan;
  currentSelametanKeyakinan = keyakinan;

  const data = hitungSelametanDates(yy, mm, dd, waktuWafat, namaAlmarhum, keyakinan);
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

  // Tampilkan tombol ekspor PDF
  const btnParchment = document.getElementById('btnPrintSelametanParchment');
  if (btnParchment) btnParchment.style.display = 'inline-flex';
  const btnLegacy = document.getElementById('btnPrintSelametan');
  if (btnLegacy) btnLegacy.style.display = 'inline-flex';
}

/**
 * Render visual timeline cards untuk 7 tahapan pengetan.
 * @param {Object} geblak 
 * @param {Array<Object>} items 
 * @param {string} namaAlmarhum 
 * @param {string} keyakinan
 */
export function renderTimelineSelametan(geblak, items, namaAlmarhum = '', keyakinan = currentSelametanKeyakinan) {
  const container = document.getElementById('timelineSelametanBox');
  if (!container) return;

  const activeKeyInfo = TEMPLAT_DONGA_KEYAKINAN[keyakinan] || TEMPLAT_DONGA_KEYAKINAN['universal'];

  const pillsHtml = Object.keys(TEMPLAT_DONGA_KEYAKINAN).map(kKey => {
    const kData = TEMPLAT_DONGA_KEYAKINAN[kKey];
    const isSelected = kKey === keyakinan;
    const btnCls = isSelected
      ? 'bg-prada text-keraton font-bold shadow'
      : 'bg-keraton/80 text-sogan-300 hover:text-amber-100 hover:bg-sogan-900 border border-sogan-800';
    return `
      <button onclick="window.gantiKeyakinanSelametan('${kKey}')" class="px-2.5 py-1 rounded-lg text-[10.5px] transition flex items-center gap-1 ${btnCls}">
        <span>${kData.nama}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="space-y-4 pt-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sogan-800 pb-2 gap-2">
        <h4 class="font-marcellus text-base sm:text-lg font-bold text-prada flex items-center gap-2">
          <i class="fa-solid fa-timeline text-amber-400"></i> Visual Timeline 7 Tahapan Pengetan
        </h4>
        <span class="text-[11px] text-sogan-400">Geblak dumugi Nyewu (1000 Dina)</span>
      </div>

      <!-- PANDUAN KEYAKINAN & DOA LINTAS AGAMA -->
      <div class="p-3 bg-gradient-to-r from-sogan-950 via-keraton to-wulung rounded-xl border border-prada/30 space-y-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span class="text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
            <i class="fa-solid fa-hands-praying text-prada"></i> Panduan Refleksi &amp; Donga Keyakinan (Inklusif 6 Agama):
          </span>
          <span class="text-[10px] text-sogan-300 italic">${activeKeyInfo.nama}</span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          ${pillsHtml}
        </div>
        <p class="text-[10.5px] text-sogan-300 leading-relaxed border-t border-sogan-800/80 pt-1.5">
          <i class="fa-solid fa-circle-info text-prada/80 mr-1"></i>${activeKeyInfo.deskripsi} Seluruh tahapan tetap menghormati tata nilai luhur tradisi Jawa yang universal.
        </p>
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

            <!-- Rincian Kultural Ubarampe & Makna Inklusif -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
              <div class="p-2.5 rounded-lg bg-sogan-950/60 border border-sogan-800/50 space-y-1">
                <span class="text-[9.5px] uppercase font-bold text-prada flex items-center gap-1">
                  <i class="fa-solid fa-bowl-rice"></i> Ubarampe Sedekah:
                </span>
                <p class="text-sogan-300 leading-relaxed">${j.ubarampe}</p>
                <div class="pt-1 border-t border-sogan-800/60 text-[10px] text-sogan-400">
                  <span class="text-prada/90 font-semibold">Makna Budaya:</span> ${j.maknaKultural}
                </div>
              </div>
              <div class="p-2.5 rounded-lg bg-sogan-950/60 border border-sogan-800/50 space-y-1 flex flex-col justify-between">
                <div>
                  <span class="text-[9.5px] uppercase font-bold text-amber-300 flex items-center gap-1">
                    <i class="fa-solid fa-hands-praying"></i> Donga &amp; Refleksi (${activeKeyInfo.nama}):
                  </span>
                  <p class="text-sogan-200 leading-relaxed font-serif text-[11.5px] mt-0.5">${j.donga}</p>
                </div>
                <div class="pt-1 border-t border-sogan-800/60 flex items-center justify-between text-[10px] text-sogan-400">
                  <span>Opsi templat doa disesuaikan</span>
                  <button onclick="window.gantiKeyakinanSelametan('${keyakinan === 'universal' ? 'islam' : 'universal'}')" class="text-prada hover:underline">
                    Ganti Tradisi ↷
                  </button>
                </div>
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
 * Menggunakan format kertas kuno tradisi luhur seragam dengan data lengkap 7 milestone.
 * @param {'parchment' | 'monochrome'} theme 
 */
export function printLaporanSelametan(theme = 'parchment') {
  let data = window.LAST_SELAMETAN_DATA;
  if (!data || !data.items || data.items.length === 0) {
    if (typeof hitungSelametan === 'function') {
      hitungSelametan();
      data = window.LAST_SELAMETAN_DATA;
    }
  }
  if (!data || !data.items || data.items.length === 0) {
    showToast('Hitung pengetan selametan rumiyin sakderengipun nyithak.');
    return;
  }

  const { geblak, items, namaAlmarhum, waktuWafat } = data;
  const isParchment = theme === 'parchment';
  const activeKeyInfo = (TEMPLAT_DONGA_KEYAKINAN && (TEMPLAT_DONGA_KEYAKINAN[data.keyakinan || currentSelametanKeyakinan] || TEMPLAT_DONGA_KEYAKINAN['universal'])) || {
    nama: 'Universal / Sadaya Keyakinan',
    deskripsi: 'Panduan refleksi luhur sadaya kapitayan.'
  };

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  } else if (printContainer.parentElement !== document.body) {
    document.body.appendChild(printContainer);
  }

  printContainer.className = `print-only-document ${isParchment ? 'theme-parchment parchment-theme' : 'theme-monochrome monochrome-theme'}`;
  printContainer.innerHTML = `
    <div class="print-report-wrapper" style="width: 100%; box-sizing: border-box;">
      <div class="laporan-page ${isParchment ? 'theme-parchment' : 'theme-monochrome'}" style="max-width: 860px; margin: 0 auto; padding: 22px 26px; ${isParchment ? 'background-color: #fdf6e2; color: #2b1d0c; border: 3px double #8c6224; outline: 1.5px solid #d4af37; outline-offset: -6px;' : 'background-color: #ffffff; color: #111827; border: 2px solid #374151;'} border-radius: 4px; position: relative; font-family: 'Times New Roman', Georgia, serif; box-sizing: border-box;">
        
        <span class="corner-tr" aria-hidden="true" style="position: absolute; top: 4px; right: 5px; color: ${isParchment ? '#8c6224' : '#111827'}; font-size: 14pt;">❖</span>
        <span class="corner-bl" aria-hidden="true" style="position: absolute; bottom: 4px; left: 5px; color: ${isParchment ? '#8c6224' : '#111827'}; font-size: 14pt;">❖</span>

        <!-- Kop Serat Tradisi Luhur -->
        <div class="doc-header-kop" style="border-bottom: 2px solid ${isParchment ? '#8c6224' : '#111827'}; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 15pt; font-weight: bold; font-family: 'Cinzel Decorative', Georgia, serif; letter-spacing: 0.12em; color: ${isParchment ? '#724117' : '#111827'}; text-transform: uppercase;">
              JAGAD JAWA &bull; SERAT PENGETAN TILAR DONYO
            </div>
            <div style="font-size: 9pt; font-weight: bold; color: ${isParchment ? '#8c6224' : '#374151'}; text-transform: uppercase; margin-top: 2px;">
              PAWIYATAN KASAMPURNAN SALIRA &bull; JADWAL DINA PENGETAN SELAMETAN
            </div>
            <div style="font-size: 8pt; font-style: italic; color: ${isParchment ? '#5a381e' : '#4b5563'};">
              Pranatan Petungan Adat Sultan Agungan &bull; Panduan Donga Refleksi (${activeKeyInfo.nama})
            </div>
          </div>
          <div style="text-align: right; font-size: 8pt; color: ${isParchment ? '#5a381e' : '#4b5563'};">
            <div style="font-weight: bold; font-family: monospace; color: ${isParchment ? '#724117' : '#111827'};">ARSIP FORMAL KULAWARGA</div>
            <div>Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <!-- Biodata Jenazah & Dina Geblak -->
        <div style="display: flex; gap: 12px; margin-bottom: 14px; font-size: 11px;">
          <div style="flex: 1; padding: 10px 12px; border: 1px solid ${isParchment ? '#d4af37' : '#d1d5db'}; border-radius: 6px; background-color: ${isParchment ? 'rgba(246, 236, 210, 0.6)' : '#fafafa'};">
            <span style="font-size: 8.5pt; font-weight: bold; text-transform: uppercase; color: ${isParchment ? '#8c6224' : '#4b5563'}; letter-spacing: 0.05em; display: block;">Identitas Jenazah:</span>
            <div style="font-size: 13pt; font-weight: bold; color: ${isParchment ? '#2b1d0c' : '#111827'}; margin-top: 2px;">
              ${namaAlmarhum ? 'Almarhum/ah ' + namaAlmarhum : 'Almarhum / Almarhumah'}
            </div>
            <div style="color: ${isParchment ? '#5a381e' : '#374151'}; margin-top: 2px; font-size: 8.5pt;">
              Wafat: ${geblak.tanggalMasehiAsli || geblak.tanggalStr} ${waktuWafat === 'malam_maghrib' ? '(Bakda Maghrib / Surup)' : '(Siang Sakderengipun Maghrib)'}
            </div>
          </div>

          <div style="flex: 1; padding: 10px 12px; border: 1px solid ${isParchment ? '#d4af37' : '#d1d5db'}; border-radius: 6px; background-color: ${isParchment ? 'rgba(246, 236, 210, 0.6)' : '#fafafa'};">
            <span style="font-size: 8.5pt; font-weight: bold; text-transform: uppercase; color: ${isParchment ? '#8c6224' : '#4b5563'}; letter-spacing: 0.05em; display: block;">Dina Geblak (Petungan Jawi):</span>
            <div style="font-size: 13pt; font-weight: bold; color: ${isParchment ? '#724117' : '#111827'}; margin-top: 2px;">
              ${geblak.hari} ${geblak.pasaran} (Neptu: ${geblak.neptu})
            </div>
            <div style="color: ${isParchment ? '#5a381e' : '#374151'}; margin-top: 2px; font-size: 8.5pt;">
              Surup Pananggalan: ${geblak.tanggalStr} ${waktuWafat === 'malam_maghrib' ? '· Dina Jawa gantos' : ''}
            </div>
          </div>
        </div>

        <!-- Tabel 7 Milestone Pengetan Lengkap -->
        <div style="margin-bottom: 12px;">
          <div style="font-size: 8.5pt; font-weight: bold; text-transform: uppercase; color: ${isParchment ? '#724117' : '#111827'}; margin-bottom: 5px; letter-spacing: 0.05em;">
            JADWAL 7 TAHAPAN PENGETAN &amp; UBARAMPE SEDEKAH:
          </div>
          <table class="doc-table" style="width: 100%; border-collapse: collapse; font-size: 8.5pt; border: 1px solid ${isParchment ? '#8c6224' : '#9ca3af'};">
            <thead>
              <tr style="background-color: ${isParchment ? '#edd8a4' : '#e5e7eb'}; color: ${isParchment ? '#724117' : '#111827'}; text-align: left; font-size: 8pt; text-transform: uppercase;">
                <th style="padding: 6px 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'}; width: 14%;">Pengetan</th>
                <th style="padding: 6px 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'}; width: 18%;">Weton Jawi</th>
                <th style="padding: 6px 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'}; width: 18%;">Tanggal Masehi</th>
                <th style="padding: 6px 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'}; width: 26%;">Ubarampe &amp; Makna</th>
                <th style="padding: 6px 8px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'};">Donga &amp; Refleksi</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((j, i) => `
                <tr style="background-color: ${i % 2 === 1 ? (isParchment ? '#f6ecd2' : '#f9fafb') : 'transparent'}; border-bottom: 1px solid ${isParchment ? '#edd8a4' : '#e5e7eb'}; vertical-align: top;">
                  <td style="padding: 6px 8px; border: 1px solid ${isParchment ? '#d4af37' : '#e5e7eb'}; font-weight: bold; color: ${isParchment ? '#724117' : '#111827'};">
                    ${j.nama}
                    <div style="font-size: 7.5pt; font-weight: normal; color: ${isParchment ? '#8c6224' : '#6b7280'};">+${j.diffDays} dina</div>
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid ${isParchment ? '#d4af37' : '#e5e7eb'}; font-weight: bold; color: ${isParchment ? '#2b1d0c' : '#111827'};">
                    ${j.targetWeton}
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid ${isParchment ? '#d4af37' : '#e5e7eb'}; color: ${isParchment ? '#2b1d0c' : '#374151'};">
                    ${j.dateStr}
                    <div style="font-size: 7.5pt; color: ${isParchment ? '#8c6224' : '#6b7280'}; font-style: italic;">wiwit surup / 18.00</div>
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid ${isParchment ? '#d4af37' : '#e5e7eb'}; font-size: 8pt; color: ${isParchment ? '#3c1f11' : '#374151'};">
                    <strong>${j.ubarampe}</strong>
                    <div style="font-size: 7.5pt; color: ${isParchment ? '#5a381e' : '#6b7280'}; margin-top: 2px;">${j.maknaKultural}</div>
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid ${isParchment ? '#d4af37' : '#e5e7eb'}; font-size: 8pt; color: ${isParchment ? '#3c1f11' : '#374151'}; font-style: italic;">
                    "${j.donga}"
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Catatan Adat & Refleksi -->
        <div style="font-size: 8pt; color: ${isParchment ? '#5a381e' : '#4b5563'}; line-height: 1.45; margin-bottom: 12px; padding: 8px 10px; background-color: ${isParchment ? 'rgba(246, 236, 210, 0.7)' : '#f9fafb'}; border: 1px solid ${isParchment ? '#d4af37' : '#d1d5db'}; border-radius: 4px;">
          <strong>Pangeling-eling Adat &amp; Doa Kasampurnan:</strong> Upacara pengetan tilar donyo lumrahipun kaleksanan ing wayah sonten / bakda Maghrib (jam 18.00) minangka pakurmatan saha donga suci katur dhumateng arwah leluhur kanthi panduan tradisi <em>${activeKeyInfo.nama}</em>. Sedekah ubarampe lan kenduri dados sarana silaturahmi sarta ngalap berkah karaharjan tumrap kulawarga ingkang tinilar. Mugi sedaya arwah pikantuk kasampurnan ing Ngarsaning Gusti Kang Akarya Jagad.
        </div>

        <!-- Tanda Tangan & Cap Kasampurnan -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 8.5pt; border-top: 1px solid ${isParchment ? '#8c6224' : '#9ca3af'}; padding-top: 6px;">
          <div>
            <div style="font-size: 7.5pt; color: ${isParchment ? '#8c6224' : '#6b7280'}; font-style: italic;">Jagad Jawa &bull; Sistem Kasampurnan Salira &bull; Pananggalan Adat Tradisi Luhur</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; font-family: 'Cinzel Decorative', Georgia, serif; font-size: 9pt; color: ${isParchment ? '#724117' : '#111827'};">JAGAD JAWA NUSANTARA</div>
            <div style="height: 26px; display: flex; align-items: center; justify-content: center; font-style: italic; font-size: 8pt; color: ${isParchment ? '#8c6224' : '#9ca3af'};">[ Cap Pawiyatan Kasampurnan ]</div>
            <div style="border-top: 1px solid ${isParchment ? '#8c6224' : '#4b5563'}; padding-top: 2px; font-size: 7.5pt; color: ${isParchment ? '#5a381e' : '#4b5563'};">Serat Pengetan Resmi</div>
          </div>
        </div>

      </div>
    </div>
  `;

  const customTitle = `Jagad Jawa — Pengetan Tilar Donyo ${namaAlmarhum ? namaAlmarhum.toUpperCase() : ''}`.trim();
  if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}

/**
 * Mengunduh dokumen formal serat pengetan tilar donyo dalam format PNG resolusi tinggi.
 * Selaras dengan tata letak cetak PDF (lengkap dengan kop, biodata, tabel jadwal, dan cap).
 */
export async function downloadSelametanPng() {
  const data = window.LAST_SELAMETAN_DATA;
  if (!data || !data.geblak) {
    showToast('Tabel pengetan dereng kasedhiyakaken.');
    return;
  }

  if (typeof window.html2canvas !== 'function') {
    showToast('Pustaka html2canvas dereng cumawis.');
    return;
  }

  try {
    showToast('Nyiapaken dokumen formal pengetan tilar donyo (PNG)...');
    
    // Buat container render khusus offscreen
    const offscreen = document.createElement('div');
    offscreen.style.position = 'fixed';
    offscreen.style.left = '-9999px';
    offscreen.style.top = '0';
    offscreen.style.width = '820px';
    offscreen.style.padding = '36px';
    offscreen.style.background = '#fcf8f0';
    offscreen.style.color = '#3c1f11';
    offscreen.style.fontFamily = "'Plus Jakarta Sans', Georgia, serif";
    offscreen.style.border = '4px double #b87c24';
    offscreen.style.borderRadius = '12px';
    offscreen.style.boxSizing = 'border-box';
    offscreen.style.zIndex = '-1000';

    const geblak = data.geblak;
    const items = data.items || [];
    const namaAlmarhum = data.namaAlmarhum || '';
    const waktuWafat = data.waktuWafat || 'siang';

    offscreen.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #b87c24; padding-bottom: 16px; margin-bottom: 22px;">
        <div style="font-family: 'Cinzel Decorative', Georgia, serif; font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #724117;">
          SERAT PENGETAN TILAR DONYO
        </div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #945c1a; margin-top: 4px;">
          JAGAD JAWA NUSANTARA &bull; KASAMPURNAN SALIRA LAN DONGANING LELUHUR
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; gap: 14px; margin-bottom: 20px; font-size: 12.5px;">
        <div style="flex: 1; padding: 12px 14px; border: 1px solid #d5a140; border-radius: 8px; background: #fffdfa;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #b87c24; display: block;">Identitas Jenazah:</span>
          <div style="font-size: 15px; font-weight: bold; color: #2d1808; margin-top: 2px;">
            ${namaAlmarhum ? 'Almarhum/ah ' + namaAlmarhum : 'Almarhum / Almarhumah'}
          </div>
          <div style="color: #724117; margin-top: 3px;">
            Wafat: ${geblak.tanggalMasehiAsli || geblak.tanggalStr} ${waktuWafat === 'malam_maghrib' ? '(Bakda Maghrib)' : '(Siang)'}
          </div>
        </div>

        <div style="flex: 1; padding: 12px 14px; border: 1px solid #d5a140; border-radius: 8px; background: #fffdfa;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #b87c24; display: block;">Dina Geblak (Petungan Jawi):</span>
          <div style="font-size: 15px; font-weight: bold; color: #945c1a; margin-top: 2px;">
            ${geblak.hari} ${geblak.pasaran} (Neptu: ${geblak.neptu})
          </div>
          <div style="color: #724117; margin-top: 3px;">
            Surup Pananggalan: ${geblak.tanggalStr}
          </div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 22px; border: 1px solid #b87c24;">
        <thead>
          <tr style="background: #edd8a4; text-align: left; text-transform: uppercase; color: #5c350b;">
            <th style="padding: 10px; border: 1px solid #b87c24;">Pengetan</th>
            <th style="padding: 10px; border: 1px solid #b87c24;">Weton Jawi</th>
            <th style="padding: 10px; border: 1px solid #b87c24;">Tanggal Masehi</th>
            <th style="padding: 10px; border: 1px solid #b87c24;">Ubarampe &amp; Sedekah</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(j => `
            <tr style="border-bottom: 1px solid #edd8a4; background: #ffffff;">
              <td style="padding: 9px 10px; border: 1px solid #edd8a4; font-weight: bold;">
                ${j.nama}<br><span style="font-size: 9.5px; font-weight: normal; color: #945c1a;">+${j.diffDays} dina saking geblak</span>
              </td>
              <td style="padding: 9px 10px; border: 1px solid #edd8a4; font-weight: bold; color: #945c1a;">
                ${j.targetWeton}
              </td>
              <td style="padding: 9px 10px; border: 1px solid #edd8a4;">
                ${j.dateStr}<br><span style="font-size: 9.5px; color: #724117;">Wiwit jam 18.00 (Maghrib)</span>
              </td>
              <td style="padding: 9px 10px; border: 1px solid #edd8a4; font-size: 10.5px; color: #4a2800;">
                ${j.ubarampe}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="font-size: 11px; color: #724117; line-height: 1.5; margin-bottom: 24px; padding: 12px; background: #f6ecd2; border-radius: 6px; border-left: 3px solid #b87c24;">
        <strong>Pangeling-eling &amp; Refleksi Adat:</strong> Upacara pengetan tilar donyo lumrahipun kaleksanan ing wayah sonten utawi bakda Maghrib (jam 18.00) minangka pangurmatan dhumateng arwah leluhur kanthi panduan doa/refleksi kasampurnan. Mugi sedaya arwah pikantuk pepadhang saha katentreman langgeng ing Ngarsaning Gusti Kang Maha Agung.
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; border-top: 1px solid #b87c24; padding-top: 12px;">
        <div>
          <span style="font-size: 10px; color: #945c1a;">Jagad Jawa &bull; Sistem Kasampurnan Petungan Tradisi Jawi</span>
        </div>
        <div style="text-align: center;">
          <div style="font-weight: bold; font-family: 'Cinzel Decorative', Georgia, serif; font-size: 11px; color: #724117;">JAGAD JAWA NUSANTARA</div>
          <div style="height: 32px; display: flex; align-items: center; justify-content: center; font-style: italic; font-size: 9.5px; color: #b87c24;">[ Cap Kawruh Resmi ]</div>
          <div style="border-top: 1px solid #b87c24; padding-top: 2px; font-size: 10px; color: #5c350b;">Serat Pengetan Tilar Donyo</div>
        </div>
      </div>
    `;

    document.body.appendChild(offscreen);

    const canvas = await window.html2canvas(offscreen, {
      backgroundColor: '#fcf8f0',
      scale: 2,
      useCORS: true
    });

    document.body.removeChild(offscreen);

    const cleanNama = (namaAlmarhum || 'almarhum').replace(/[^a-zA-Z0-9]/g, '_');
    const tgl = geblak.tanggalStr || 'selametan';
    const filename = `Serat-Pengetan-Tilar-Donyo-${cleanNama}-${tgl.replace(/\s+/g, '-')}.png`;
    
    await downloadCanvasAsPng(canvas, filename, {
      title: 'Serat Pengetan Tilar Donyo',
      text: `Serat Resmi Pengetan Tilar Donyo: ${namaAlmarhum || 'Almarhum'} (${tgl})`
    });

    showToast('Dokumen formal pengetan kasil diundhuh! 📜✨');
  } catch (err) {
    console.error('Gagal mengunduh PNG formal:', err);
    showToast('Gagal ngundhuh gambar pengetan.');
  }
}

if (typeof window !== 'undefined') {
  window.gantiKeyakinanSelametan = gantiKeyakinanSelametan;
  window.downloadSelametanPng = downloadSelametanPng;
  window.hitungSelametan = hitungSelametan;
  window.printLaporanSelametan = printLaporanSelametan;
}
