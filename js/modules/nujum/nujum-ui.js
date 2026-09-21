/**
 * Jagad Jawa — Modul Domain: Nujum UI (Enhanced Tahap 3)
 * Pengendali DOM untuk kartu Nujum Kepribadian, Mode Ringkas vs Mode Mendalam,
 * Glosarium Konseptual Literasi Budaya, Komparasi Non-Jodoh (Side-by-Side),
 * Laporan Resmi Cetak PDF Keraton, dan Disclaimer Etis Kultural.
 * jawa-v2 – single source nujum, exact lookup
 */

import {
  getDayInfo,
  getTanggalJawaLengkap,
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  WUKU
} from '../kalender/kalender-engine.js';

import {
  getNujumData,
  getFaalakiah,
  getAsesoris,
  NUJUM_GLOSSARY_CONCEPTS,
  getNujumGlossary,
  hitungKarakterDasarPure,
  getNujumSummaryRingkas,
  compareNonJodoh,
  DISCLAIMER_ETIS_KULTURAL,
  parseAksaraForFaalakiah,
  NABI_FAAL,
  FAAL_DESC,
  AKSARA_FAAL
} from './nujum-engine.js';

import { showToast, copyToClipboard } from '../../ui/toast.js';
import { transliterateLatinToJawa } from '../aksara/aksara-engine.js';

let currentNujumMode = 'ringkas'; // 'ringkas' | 'mendalam'
let lastCalculatedData = null;

export function initTahunHitungSelect() {
  const sel = document.getElementById('tahunHitungKepribadian');
  if (!sel) return;
  sel.innerHTML = '';
  for (let y = 1950; y <= 2040; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === 2026) opt.selected = true;
    sel.appendChild(opt);
  }
}

export function updateKepribadianQuickInfo() {
  const tglVal = document.getElementById('tglLahirKepribadian')?.value;
  const elTglJawa = document.getElementById('outTanggalJawaPribadi');
  const elHP = document.getElementById('outHariPasaranPribadi');
  const elNW = document.getElementById('outNeptuWukuPribadi');
  const elSiklus = document.getElementById('outSiklusTahunanPribadi');
  const elKarakter = document.getElementById('outKarakterDasarPribadi');
  const elSirikan = document.getElementById('outSirikanAdhepOmahPribadi');

  if (!tglVal) {
    if (elTglJawa) elTglJawa.innerText = '-';
    if (elHP) elHP.innerText = '-';
    if (elNW) elNW.innerText = '-';
    if (elSiklus) elSiklus.innerText = '-';
    if (elKarakter) elKarakter.innerText = '-';
    if (elSirikan) elSirikan.innerText = '-';
    return;
  }
  const [y, m, d] = tglVal.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];

  const tglJawaRes = getTanggalJawaLengkap(y, m, d);
  const sasiFn = (typeof window !== 'undefined' && window.getWatakSasiJawa) ? window.getWatakSasiJawa : null;
  const sasiJawaRes = (sasiFn && tglJawaRes?.bulanJawa) ? sasiFn(tglJawaRes.bulanJawa) : null;

  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value || '2026') || 2026;
  const umur = Math.max(0, tahunHitung - y);
  const siklusFn = (typeof window !== 'undefined' && window.hitungSiklusTahunan) ? window.hitungSiklusTahunan : null;
  const siklusRes = siklusFn ? siklusFn(umur) : null;

  const kd = hitungKarakterDasarPure(d, m, y);

  const fnSirikan = (typeof window !== 'undefined' && window.getSirikanAdhepOmah) ? window.getSirikanAdhepOmah : null;
  const sirikanRes = fnSirikan ? fnSirikan(neptu, dino) : null;

  if (elTglJawa) {
    if (tglJawaRes) {
      const sasiExtra = (sasiJawaRes && sasiJawaRes.padanan !== '-') ? ` · Sasi ${sasiJawaRes.sasi} (${sasiJawaRes.padanan})` : '';
      elTglJawa.innerText = `${tglJawaRes.fullStr}${sasiExtra}`;
    } else {
      elTglJawa.innerText = '-';
    }
  }
  if (elHP) elHP.innerText = `${dino} ${pas}`;
  if (elNW) elNW.innerText = `Neptu ${neptu} · Wuku ${wukuName}`;
  if (elSiklus) {
    if (siklusRes) {
      elSiklus.innerText = `${umur} Thn (Siklus ${siklusRes.siklusNo}: ${siklusRes.shio.shio} · ${siklusRes.padewan.nama})`;
    } else {
      elSiklus.innerText = `${umur} Thn`;
    }
  }
  if (elKarakter) {
    elKarakter.innerText = `Tipe ${kd.noKarakter}: ${kd.tipe}`;
  }
  if (elSirikan) {
    if (sirikanRes && sirikanRes.pantanganText && sirikanRes.pantanganText !== '-') {
      elSirikan.innerText = `${sirikanRes.pantanganText} (Aman: ${sirikanRes.arahAmanText})`;
    } else {
      elSirikan.innerText = (info.weekdayId === 4 || pas === 'Kliwon') ? 'Pantang: Kidul (Aman: Kulon/Lor)' : 'Pantang: Kidul-Kulon (Aman: Wetan/Lor)';
    }
  }
}

/**
 * Beralih Mode Tampilan: Mode Ringkas vs Mode Mendalam (3.2)
 * @param {'ringkas'|'mendalam'} mode 
 */
export function switchNujumViewMode(mode) {
  currentNujumMode = mode;
  if (lastCalculatedData) {
    renderHasilNujumContent();
  }
}

/**
 * Menghitung Nujum Kepribadian Lengkap
 */
export function hitungKepribadianLengkap() {
  const tglVal = document.getElementById('tglLahirKepribadian')?.value;
  if (!tglVal) {
    showToast('Pilih tanggal lahir terlebih dahulu.');
    return;
  }

  const nama = document.getElementById('namaKepribadian')?.value.trim() || 'Raden / Diajeng';
  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value || '2026') || 2026;
  const alamatTinggal = document.getElementById('alamatTinggal')?.value.trim() || '-';
  const alamatKerja = document.getElementById('alamatKerja')?.value.trim() || '-';
  const [y, m, d] = tglVal.split('-').map(Number);
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];
  const umur = Math.max(0, tahunHitung - y);

  const nujumRes = getNujumData(dino, pas, wukuName);
  const faal = getFaalakiah(nama);
  const aseso = getAsesoris(m, d);
  const kd = hitungKarakterDasarPure(d, m, y);
  const summaryRingkas = getNujumSummaryRingkas({ nama, d, m, y, tahunHitung });
  const tglJawaRes = getTanggalJawaLengkap(y, m, d);

  const fnShioByYear = (typeof getShioByYear === 'function') ? getShioByYear : (typeof window !== 'undefined' ? window.getShioByYear : null);
  const shioLahirRes = fnShioByYear ? fnShioByYear(y) : null;

  const fnZodiak = (typeof getZodiakByDate === 'function') ? getZodiakByDate : (typeof window !== 'undefined' ? window.getZodiakByDate : null);
  const zodiakRes = fnZodiak ? fnZodiak(d, m) : null;
  const fnMangsa = (typeof getPranataMangsaByDate === 'function') ? getPranataMangsaByDate : (typeof window !== 'undefined' ? window.getPranataMangsaByDate : null);
  const mangsaRes = fnMangsa ? fnMangsa(d, m) : null;

  const fnKarakter = (typeof hitungKarakterDasar === 'function') ? hitungKarakterDasar : (typeof window !== 'undefined' ? window.hitungKarakterDasar : null);
  const karakterRes = fnKarakter ? fnKarakter(d, m, y) : null;

  const fnWatakDina = (typeof getWatakDina === 'function') ? getWatakDina : (typeof window !== 'undefined' ? window.getWatakDina : null);
  const watakDinaRes = fnWatakDina ? fnWatakDina(dino) : null;
  const fnWatakPasaran = (typeof getWatakPasaran === 'function') ? getWatakPasaran : (typeof window !== 'undefined' ? window.getWatakPasaran : null);
  const watakPasaranRes = fnWatakPasaran ? fnWatakPasaran(pas) : null;

  const fnSasiJawa = (typeof getWatakSasiJawa === 'function') ? getWatakSasiJawa : (typeof window !== 'undefined' ? window.getWatakSasiJawa : null);
  const sasiJawaRes = fnSasiJawa ? fnSasiJawa(tglJawaRes?.bulanJawa) : null;

  const fnSirikan = (typeof getSirikanAdhepOmah === 'function') ? getSirikanAdhepOmah : (typeof window !== 'undefined' ? window.getSirikanAdhepOmah : null);
  const sirikanRes = fnSirikan ? fnSirikan(neptu, dino) : null;

  const fnPalenggahan = (typeof analisisPalenggahan === 'function') ? analisisPalenggahan : (typeof window !== 'undefined' ? window.analisisPalenggahan : null);
  const palenggahanRes = fnPalenggahan ? fnPalenggahan(alamatTinggal, nama) : null;
  const pedamelanRes = fnPalenggahan ? fnPalenggahan(alamatKerja, nama) : null;

  const fnPekerjaan = (typeof getPekerjaanPakarti === 'function') ? getPekerjaanPakarti : (typeof window !== 'undefined' ? window.getPekerjaanPakarti : null);
  const pekerjaanRes = fnPekerjaan ? fnPekerjaan(dino, pas) : null;

  const pwk = nujumRes?.pawukon || (typeof getPawukonData === 'function' ? getPawukonData(wukuName) : (typeof window !== 'undefined' && window.getPawukonData ? window.getPawukonData(wukuName) : null));

  let aksaraJawa = '';
  try {
    if (transliterateLatinToJawa && nama && nama !== '-') {
      aksaraJawa = transliterateLatinToJawa(nama);
    } else if (faal.aksaraStr && faal.aksaraStr !== '-') {
      aksaraJawa = faal.aksaraStr;
    }
  } catch (_) {
    aksaraJawa = (faal.aksaraStr && faal.aksaraStr !== '-') ? faal.aksaraStr : '';
  }

  lastCalculatedData = {
    nama, tglVal, d, m, y, tahunHitung, umur,
    dino, pas, neptu, wukuName, wukuNo: info.wukuId + 1,
    alamatTinggal, alamatKerja,
    nujumRes, faal, aseso, kd, summaryRingkas, tglJawaRes,
    shioLahirRes, zodiakRes, mangsaRes, karakterRes,
    watakDinaRes, watakPasaranRes, sasiJawaRes,
    sirikanRes, palenggahanRes, pedamelanRes, pekerjaanRes, pwk, aksaraJawa
  };

  renderHasilNujumContent();

  // Tampilkan tombol cetak laporan
  const btnParchment = document.getElementById('btnPrintKepribadianParchment');
  const btnMono = document.getElementById('btnPrintKepribadian');
  if (btnParchment) {
    btnParchment.style.display = 'inline-flex';
    btnParchment.onclick = () => printLaporanNujum('parchment');
  }
  if (btnMono) {
    btnMono.style.display = 'inline-flex';
    btnMono.onclick = () => printLaporanNujum('monochrome');
  }

  showToast('Nujum kepribadian kasil kapetung kanthi jangkep!');
}

/**
 * Render Tampilan Hasil Nujum (Mode Ringkas atau Mode Mendalam)
 */
function renderHasilNujumContent() {
  const outBox = document.getElementById('hasilKepribadianBox');
  if (!outBox || !lastCalculatedData) return;

  const data = lastCalculatedData;
  const isRingkas = (currentNujumMode === 'ringkas');

  const modeSwitcherHtml = `
    <!-- Mode Switcher Bar (3.2) -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-keraton border border-sogan-800">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-bold text-prada uppercase tracking-wider flex items-center gap-1.5">
          <i class="fa-solid fa-sliders"></i> Mode Tampilan:
        </span>
        <div class="inline-flex p-1 rounded-lg bg-sogan-950 border border-sogan-800 text-xs">
          <button onclick="window.switchNujumViewMode('ringkas')" class="px-3 py-1.5 rounded-md font-semibold transition ${isRingkas ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-list-check mr-1"></i> Mode Ringkas (Ikhtisar)
          </button>
          <button onclick="window.switchNujumViewMode('mendalam')" class="px-3 py-1.5 rounded-md font-semibold transition ${!isRingkas ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-book-open mr-1"></i> Mode Mendalam (Primbon)
          </button>
        </div>
      </div>
      <button onclick="window.openGlosariumNujumModal()" class="px-3 py-1.5 rounded-lg bg-sogan-900 border border-prada/40 hover:border-prada text-prada text-xs font-semibold flex items-center gap-1.5 transition">
        <i class="fa-solid fa-circle-question text-amber-400"></i> Glosarium Filosofi
      </button>
    </div>
  `;

  let mainContentHtml = '';

  if (isRingkas) {
    // ─── TAMPILAN MODE RINGKAS (RAMAH PEMULA) ─────────────────────────────
    const sr = data.summaryRingkas;
    mainContentHtml = `
      <div class="space-y-4">
        <!-- Hero Summary Card -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 shadow-xl space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800 pb-3">
            <div>
              <span class="text-[10px] font-mono text-prada uppercase tracking-widest block font-semibold">IKHTISAR NUJUM PRIBADI</span>
              <h3 class="font-marcellus text-xl sm:text-2xl font-bold text-prada-light">${data.nama}</h3>
              <span class="text-xs text-sogan-300">${sr.tglMasehiStr} · ${data.tglJawaRes.fullStr}</span>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full bg-sogan-900 border border-prada/50 text-prada font-bold text-xs font-mono inline-block">
                ${data.dino} ${data.pas} · Neptu ${data.neptu}
              </span>
              <span class="block text-[10px] text-sogan-400 font-mono mt-1">Wuku ${data.wukuName} (${data.wukuNo}/30)</span>
            </div>
          </div>

          <!-- Tipe Karakter Utama -->
          <div class="p-3.5 rounded-xl bg-sogan-900/60 border border-amber-500/30">
            <div class="flex items-center justify-between mb-1">
              <strong class="text-amber-300 font-marcellus text-sm sm:text-base flex items-center gap-1.5">
                <i class="fa-solid fa-crown text-amber-400"></i> Tipe Karakter: ${sr.tipeKarakter}
              </strong>
              <span class="text-[10px] text-sogan-400 font-mono">Formula Penjumlahan Lahir</span>
            </div>
            <p class="text-xs text-sogan-200 leading-relaxed">${sr.deskripsiKarakter}</p>
          </div>

          <!-- Grid 3 Kekuatan Utama & 1 Area Waspada -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-star"></i> 3 Potensi &amp; Kekuatan Utama:
              </span>
              <ul class="space-y-1.5 text-[11px] text-emerald-100">
                ${sr.kekuatanUtama.map(k => `<li class="flex items-start gap-1.5"><span class="text-emerald-400">✓</span> <span>${k}</span></li>`).join('')}
              </ul>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
              <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-triangle-exclamation"></i> Titik Mawas Diri (Area Waspada):
              </span>
              <p class="text-[11px] text-amber-100 leading-relaxed">${sr.areaWaspada}</p>
              <div class="pt-1.5 border-t border-amber-800/60 text-[10.5px] text-sogan-300">
                <strong class="text-amber-300">Pantangan Arah Rumah:</strong> ${sr.sirikanRumah}
              </div>
            </div>
          </div>

          <!-- Arah Keberuntungan & Faal Spiritual -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-compass"></i>
              </div>
              <div>
                <strong class="text-teal-300 block text-[11px]">Arah Energi / Rejeki Terbaik:</strong>
                <span class="text-sogan-200 text-xs font-semibold">${sr.arahHoki}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-hands-praying"></i>
              </div>
              <div>
                <strong class="text-purple-300 block text-[11px]">Wejangan Faalakiah Ringkas:</strong>
                <span class="text-sogan-200 text-[11px] line-clamp-2">${sr.faalRingkas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // ─── TAMPILAN MODE MENDALAM (PUSTAKA PRIMBON LENGKAP) ──────────────────
    const bincil = data.nujumRes;
    const faal = data.faal;
    const pwk = data.pwk;

    const siklusCardHtml = renderSiklusTahunanCardHtml(data.umur, data.umur);
    const shioElemenCardHtml = renderShioElemenCardHtml(data.shioLahirRes);
    const pranataZodiakCardHtml = renderPranataZodiakCardHtml(data.mangsaRes, data.zodiakRes);
    const karakterDasarCardHtml = renderKarakterDasarCardHtml(data.karakterRes);
    const watakDinaPasaranCardHtml = renderWatakDinaPasaranCardHtml(data.watakDinaRes, data.watakPasaranRes, data.sasiJawaRes);
    const sirikanCardHtml = renderSirikanAdhepOmahCardHtml(data.sirikanRes);
    const palenggahanCardHtml = renderPalenggahanPedamelanCardHtml(data.palenggahanRes, data.pedamelanRes);
    const pekerjaanPakartiCardHtml = renderPekerjaanPakartiCardHtml(data.pekerjaanRes);

    mainContentHtml = `
      <div class="space-y-4">
        <!-- Banner Nama & Weton Lengkap -->
        <div class="p-4 rounded-2xl bg-sogan-950 border border-prada/40 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div>
            <h3 class="font-marcellus text-xl text-prada font-bold">${data.nama}</h3>
            <span class="text-xs text-sogan-300">${data.dino} ${data.pas} · Neptu ${data.neptu} · Wuku ${data.wukuName} (${data.wukuNo}/30)</span>
          </div>
          <button onclick="window.openWetonShareModal(${data.y}, ${data.m}, ${data.d})" class="px-3.5 py-1.5 rounded-lg bg-sogan-900 border border-prada/40 hover:bg-sogan-800 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
            <i class="fa-solid fa-share-nodes"></i> Bagikan Weton
          </button>
        </div>

        <!-- Ensiklopedia Pawukon -->
        ${pwk ? `
        <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
          <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
            <h4 class="font-marcellus font-bold text-prada text-sm sm:text-base flex items-center gap-2">
              <i class="fa-solid fa-book-open text-prada"></i> Pawukon Jawa: Wuku ${pwk.nama_wuku} (${pwk.no_wuku})
            </h4>
            <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">Dewane: <strong class="text-prada-light">${pwk.dewane}</strong></span>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="p-3 bg-keraton/90 rounded-lg border border-sogan-800">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-1">Candra &amp; Watak Wuku:</span>
              <p class="text-sogan-100 text-xs sm:text-[13px] leading-relaxed font-medium">${pwk.watek_budi_pangerti || pwk.watak || '-'}</p>
            </div>

            <div class="p-3 bg-sogan-950 rounded-lg border border-sogan-700/70 space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800/80 pb-1.5">
                <span class="text-[10px] text-prada uppercase font-semibold flex items-center gap-1.5"><i class="fa-solid fa-hands-praying"></i> Donga Slamet &amp; Ruwatan</span>
                <span class="text-[11px] font-marcellus font-bold text-prada-light">Donga: ${pwk.donga_slamet || '-'}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[10px] text-sogan-300">
                <div><span class="text-sogan-400 block font-medium">Sesaji Ruwat:</span><span class="text-sogan-200">${pwk.sesaji_ruwat || '-'}</span></div>
                <div><span class="text-sogan-400 block font-medium">Tindih Ruwat:</span><span class="text-sogan-200">${pwk.tindih_ruwat || '-'}</span></div>
                <div><span class="text-sogan-400 block font-medium">Sega Selamatan:</span><span class="text-sogan-200">${pwk.selamatan_sega || '-'}</span></div>
                <div><span class="text-sogan-400 block font-medium">Iwak Selamatan:</span><span class="text-sogan-200">${pwk.selamatan_iwak || '-'}</span></div>
                <div><span class="text-sogan-400 block font-medium">Salawat:</span><span class="text-sogan-200">${pwk.salawat || '-'}</span></div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Matriks 6 Dimensi Bincil Lengkap dengan Tombol Edukasi (?) -->
        <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
            <h4 class="font-marcellus text-sm font-bold text-prada flex items-center gap-1.5">
              <i class="fa-solid fa-layer-group text-amber-400"></i> Matriks 6 Dimensi Bincil Jawa
            </h4>
            <span class="text-[10px] text-sogan-400 font-mono">Klik (?) kanggé mirsani tegesing konsep</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <!-- 1. Padewan -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-amber-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">1. Padewan (Astawara)</span>
                <button onclick="window.openGlosariumNujumModal('padewan')" class="text-amber-400 hover:text-amber-200 text-xs" title="Pelajari Padewan">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-amber-300 font-serif text-sm block">${bincil?.padewan?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.padewan?.arti || '-'}</p>
            </div>

            <!-- 2. Paringkelan -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-teal-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">2. Paringkelan (Sadwara)</span>
                <button onclick="window.openGlosariumNujumModal('paringkelan')" class="text-teal-400 hover:text-teal-200 text-xs" title="Pelajari Paringkelan">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-teal-300 font-serif text-sm block">${bincil?.paringkelan?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.paringkelan?.arti || '-'}</p>
            </div>

            <!-- 3. Pandangon -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-cyan-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">3. Pandangon (Sangawara)</span>
                <button onclick="window.openGlosariumNujumModal('pandangon')" class="text-cyan-400 hover:text-cyan-200 text-xs" title="Pelajari Pandangon">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-cyan-300 font-serif text-sm block">${bincil?.pandangon?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.pandangon?.arti || '-'}</p>
            </div>

            <!-- 4. Paarasan -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-indigo-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">4. Paarasan (10 Watak)</span>
                <button onclick="window.openGlosariumNujumModal('paarasan')" class="text-indigo-400 hover:text-indigo-200 text-xs" title="Pelajari Paarasan">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-indigo-300 font-serif text-sm block">${bincil?.paarasan?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.paarasan?.arti || '-'}</p>
            </div>

            <!-- 5. Pancasuda -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-emerald-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">5. Pancasuda (7 Martabat)</span>
                <button onclick="window.openGlosariumNujumModal('pancasuda')" class="text-emerald-400 hover:text-emerald-200 text-xs" title="Pelajari Pancasuda">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-emerald-300 font-serif text-sm block">${bincil?.pancasuda?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.pancasuda?.arti || '-'}</p>
            </div>

            <!-- 6. Kamarokan -->
            <div class="p-3 rounded-xl bg-sogan-950/80 border border-purple-500/30 space-y-1 relative group">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-sogan-400 uppercase font-bold">6. Kamarokan (Sosial)</span>
                <button onclick="window.openGlosariumNujumModal('kamarokan')" class="text-purple-400 hover:text-purple-200 text-xs" title="Pelajari Kamarokan">
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <strong class="text-purple-300 font-serif text-sm block">${bincil?.kamarokan?.nama || '-'}</strong>
              <p class="text-[11px] text-sogan-200 leading-relaxed">${bincil?.kamarokan?.arti || '-'}</p>
            </div>
          </div>
        </div>

        <!-- Faalakiah Asma 12 Nabi (Interaktif dengan Editor Aksara Jawa) -->
        <div class="p-3.5 sm:p-4 rounded-xl bg-sogan-950 border border-sogan-700 text-xs space-y-3 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800/80 pb-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-feather-pointed text-prada"></i>
              <span id="faalHeading" class="font-bold text-prada font-marcellus text-sm sm:text-base">Faalakiah Asma: ${faal.nabi} (Kode <span id="faalKode">${faal.kode}</span>)</span>
            </div>
            <span class="text-[11px] font-mono text-prada/90 bg-keraton px-2.5 py-1 rounded border border-sogan-700/80">Jumlah Aksara: <strong id="faalAksaraSum" class="text-prada-light">${faal.sum}</strong></span>
          </div>

          <!-- Editor Interaktif Aksara Jawa -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="faalAksaraJawaInput" class="text-[10px] uppercase font-semibold text-sogan-400 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-pen-to-square text-prada/80"></i> Aksara Jawa (Dapat Diedit Manual)
              </label>
              <button type="button" onclick="window.salinAksaraFaal()" class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 hover:border-prada text-prada hover:bg-prada/20 text-[11px] font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer" title="Salin Aksara Jawa ke Clipboard">
                <i class="fa-regular fa-copy"></i> Salin Aksara
              </button>
            </div>
            <textarea id="faalAksaraJawaInput" oninput="window.updateFaalFromAksaraManual(this.value)" rows="2" placeholder="ꦲꦤꦕꦫꦏ..." class="w-full bg-keraton/90 border border-sogan-700 focus:border-prada rounded-xl p-3 text-prada font-jawa text-xl sm:text-2xl leading-relaxed tracking-wider outline-none resize-y min-h-[64px] transition shadow-inner">${data.aksaraJawa || ''}</textarea>
            <div class="flex flex-wrap items-center justify-between gap-2 text-[10px] text-sogan-400 px-1">
              <span>Rincian Aksara: <strong id="faalAksaraList" class="font-mono text-sogan-200">${faal.aksaraStr}</strong></span>
              <span class="italic text-[9px] text-sogan-400">*Sunting teks aksara/latin ing nginggil kanggé nganyari petungan Faalakiah kanthi langsung.</span>
            </div>
          </div>

          <div class="p-3 bg-keraton/80 rounded-lg border border-sogan-800">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-1">Katerangan &amp; Pitutur Faalakiah</span>
            <p id="faalDesc" class="text-sogan-200 leading-relaxed text-[11px] sm:text-xs">${faal.desc}</p>
          </div>
        </div>

        <!-- 8 KARTU ANALISIS MENDALAM BUDAYA JAWA -->
        ${pranataZodiakCardHtml}
        ${shioElemenCardHtml}
        ${karakterDasarCardHtml}
        ${watakDinaPasaranCardHtml}
        ${pekerjaanPakartiCardHtml}
        ${sirikanCardHtml}
        ${palenggahanCardHtml}
        ${siklusCardHtml}
      </div>
    `;
  }

  // ─── DISCLAIMER ETIS & KULTURAL BANNER (3.5) ─────────────────────────────
  const disclaimerHtml = `
    <div class="p-4 rounded-xl bg-sogan-950/90 border border-prada/30 text-xs text-sogan-300 flex items-start gap-3 mt-4">
      <div class="w-8 h-8 rounded-full bg-prada/20 text-prada flex items-center justify-center flex-shrink-0 mt-0.5">
        <i class="fa-solid fa-scale-balanced text-sm"></i>
      </div>
      <div>
        <strong class="text-prada block mb-0.5 uppercase tracking-wider text-[11px]">Paweling Budaya &amp; Etika Literasi</strong>
        <p class="text-[11px] leading-relaxed text-sogan-200">${DISCLAIMER_ETIS_KULTURAL}</p>
      </div>
    </div>
  `;

  outBox.innerHTML = `
    <div class="space-y-4">
      ${modeSwitcherHtml}
      ${mainContentHtml}
      ${disclaimerHtml}
    </div>
  `;
  outBox.classList.remove('hidden');
}

// ─── 8 KARTU ANALISIS MENDALAM & INTERAKTIF DOM RENDERING ──────────────────

export function renderSiklusTahunanCardHtml(umur, baseUmur) {
  if (baseUmur === undefined || baseUmur === null) baseUmur = umur;
  const siklusFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (typeof window !== 'undefined' ? window.hitungSiklusTahunan : null);
  const siklus = siklusFn ? siklusFn(umur) : null;
  if (!siklus) return '';

  const pad = siklus.padewan;
  const shio = siklus.shio;
  const prevUmur = Math.max(0, umur - 1);
  const nextUmur = umur + 1;
  const isOriginal = (umur === baseUmur);

  return `
    <div id="containerSiklusTahunan" class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/40 shadow-xl transition-all">
      <!-- Header Siklus Tahunan & Kontrol Interaktif Umur -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sogan-700/80 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
              Siklus 12 Tahunan Dinamis
            </span>
            ${!isOriginal ? `<span class="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] text-amber-300 font-medium"><i class="fa-solid fa-eye mr-1"></i>Peninjauan Usia</span>` : ''}
          </div>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-arrows-spin text-prada"></i> Siklus Tahunan: Siklus Padewan &amp; Shio Tahunan
          </h4>
          <p class="text-[11px] text-sogan-300 mt-0.5">
            Dihitung berdasarkan usia (<span class="text-prada font-semibold">${umur} tahun</span> &middot; Rumus: <code class="font-mono text-amber-300">${umur} % 12 = sisa ${umur % 12 === 0 ? 12 : (umur % 12)}</code> &rarr; Siklus Ke-${siklus.siklusNo}). Siklus berganti setiap pertambahan tahun usia.
          </p>
        </div>

        <!-- Tombol Interaktif Stepper Usia -->
        <div class="flex items-center gap-1.5 self-start sm:self-center bg-keraton/90 p-1.5 rounded-xl border border-sogan-700/80 shadow-inner">
          <button type="button" onclick="window.ubahUmurSiklusTahunan(${prevUmur}, ${baseUmur})" ${umur <= 0 ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-200 hover:text-prada hover:border-prada disabled:opacity-30 disabled:pointer-events-none transition text-xs font-semibold flex items-center gap-1" title="Lihat siklus usia sebelumnya (${prevUmur} tahun)">
            <i class="fa-solid fa-chevron-left text-[10px]"></i> ${prevUmur} Thn
          </button>
          
          <div class="px-3 py-1 bg-sogan-950 rounded-lg border border-prada/40 text-center min-w-[75px]">
            <span class="block text-[9px] uppercase font-bold text-sogan-400">Usia</span>
            <span class="font-bold text-prada text-xs sm:text-sm">${umur} Thn</span>
          </div>

          <button type="button" onclick="window.ubahUmurSiklusTahunan(${nextUmur}, ${baseUmur})" class="px-2.5 py-1.5 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-200 hover:text-prada hover:border-prada transition text-xs font-semibold flex items-center gap-1" title="Lihat siklus usia berikutnya (${nextUmur} tahun)">
            ${nextUmur} Thn <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>

          ${!isOriginal ? `
          <button type="button" onclick="window.ubahUmurSiklusTahunan(${baseUmur}, ${baseUmur})" class="ml-1 px-2.5 py-1.5 rounded-lg bg-becik/30 border border-becik/50 text-emerald-300 hover:bg-becik/50 transition text-xs font-semibold flex items-center gap-1" title="Kembali ke Usia Lahir (${baseUmur} tahun)">
            <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset
          </button>
          ` : ''}
        </div>
      </div>

      <!-- Grid 2 Kolom: Shio Tahunan & Padewan Tahunan -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1">
        
        <!-- KOLOM 1: SIKLUS SHIO TAHUNAN -->
        <div class="lg:col-span-4 bg-keraton/90 p-4 rounded-xl border border-sogan-800 flex flex-col justify-between space-y-3">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-paw text-prada"></i> Siklus Shio Tahunan
              </span>
              <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2 py-0.5 rounded border border-sogan-700/80">
                Siklus ${siklus.siklusNo} / 12
              </span>
            </div>

            <div class="p-3.5 rounded-xl bg-sogan-950/70 border border-amber-500/20 text-center space-y-1">
              <span class="text-[10px] text-amber-300 uppercase font-bold tracking-widest block">Shio Tahunan</span>
              <div class="font-marcellus text-2xl sm:text-3xl font-bold text-amber-300 tracking-wide">${shio.shio}</div>
              <span class="text-[10px] text-sogan-400 italic">Usia ${umur} Tahun</span>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block">Tegese &amp; Dinamika Karakter:</span>
              <p class="text-sogan-200 text-xs leading-relaxed p-3 rounded-lg bg-keraton border border-sogan-900">
                ${shio.tegese}
              </p>
            </div>
          </div>

          <div class="p-2.5 bg-sogan-950/60 rounded-lg border border-sogan-800/80 text-[10px] text-sogan-400 leading-relaxed">
            <i class="fa-solid fa-circle-info text-prada/70 mr-1"></i>
            Menggambarkan iklim peruntungan dan tantangan sikap hidup di usia ${umur} tahun.
          </div>
        </div>

        <!-- KOLOM 2: SIKLUS PADEWAN TAHUNAN -->
        <div class="lg:col-span-8 bg-keraton/90 p-4 rounded-xl border border-prada/30 space-y-3">
          <div class="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-sogan-950/80 border border-sogan-800">
            <div class="w-20 h-28 flex-shrink-0 flex items-center justify-center p-1.5 rounded-lg bg-keraton border border-prada/30 shadow-inner">
              <img src="${pad.gambar || 'assets/wayang/surakarta/gunungan.png'}" alt="${pad.nama}" class="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)]" onerror="this.onerror=null; this.src='assets/wayang/surakarta/gunungan.png';" />
            </div>
            <div class="flex-grow space-y-1 text-center sm:text-left">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="text-[10px] font-mono text-prada/90 bg-sogan-900 px-2 py-0.5 rounded border border-prada/30 font-bold uppercase">
                  Dewa ${pad.dewa}
                </span>
                <span class="text-xs text-sogan-400 font-mono">Usia ${umur} Tahun</span>
              </div>
              <h5 class="font-marcellus text-xl sm:text-2xl font-bold text-prada-light">${pad.nama} (${pad.dewa})</h5>
              <p class="text-xs text-sogan-200 italic leading-relaxed">${pad.watak}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-sogan-950/70 rounded-xl border border-sogan-800 space-y-1.5">
              <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-briefcase text-emerald-400"></i> Karier &amp; Keuangan
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.karier}</p>
            </div>

            <div class="p-3 bg-sogan-950/70 rounded-xl border border-sogan-800 space-y-1.5">
              <span class="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Kelemahan &amp; Bahaya
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed"><strong class="text-rose-400/90">Kelemahan:</strong> ${pad.kelemahan}</p>
              <p class="text-sogan-200 text-[11px] leading-relaxed pt-1 border-t border-sogan-800/80"><strong class="text-amber-400/90">Bahaya:</strong> ${pad.bahaya}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-sogan-950/70 rounded-xl border border-sogan-800 space-y-1.5">
              <span class="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-heart-pulse text-teal-400"></i> Kesehatan &amp; Keluarga
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed"><strong class="text-teal-400/90">Kesehatan:</strong> ${pad.kesehatan}</p>
              <p class="text-sogan-200 text-[11px] leading-relaxed pt-1 border-t border-sogan-800/80"><strong class="text-blue-400/90">Rumah Tangga:</strong> ${pad.keluarga}</p>
            </div>

            <div class="p-3 bg-sogan-950/70 rounded-xl border border-amber-500/30 space-y-1.5">
              <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-lightbulb text-amber-400"></i> Solusi &amp; Mawas Diri
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.solusi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function updateDocSiklusTahunan(umur) {
  const siklusFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (typeof window !== 'undefined' ? window.hitungSiklusTahunan : null);
  const s = siklusFn ? siklusFn(umur) : null;
  if (!s) return;
  const elUsia = document.getElementById('doc_siklus_usia');
  const elModulo = document.getElementById('doc_siklus_modulo');
  const elShio = document.getElementById('doc_siklus_shio');
  const elDewa = document.getElementById('doc_siklus_dewa');
  const elWatak = document.getElementById('doc_siklus_watak');
  const elKarier = document.getElementById('doc_siklus_karier');
  const elKelemahan = document.getElementById('doc_siklus_kelemahan');
  const elKesehatan = document.getElementById('doc_siklus_kesehatan');
  const elSolusi = document.getElementById('doc_siklus_solusi');

  if (elUsia) elUsia.textContent = `${umur} Tahun`;
  if (elModulo) elModulo.textContent = `${umur} % 12 = Sisa ${s.siklusNo} (Siklus Ke-${s.siklusNo})`;
  if (elShio) elShio.innerHTML = `<strong>Shio ${s.shio.shio}</strong>: ${s.shio.tegese}`;
  if (elDewa) elDewa.innerHTML = `<strong>${s.padewan.dewa} (${s.padewan.nama})</strong>`;
  if (elWatak) elWatak.textContent = s.padewan.watak;
  if (elKarier) elKarier.textContent = s.padewan.karier;
  if (elKelemahan) elKelemahan.innerHTML = `<strong>Kelemahan:</strong> ${s.padewan.kelemahan} &nbsp;|&nbsp; <strong>Bahaya:</strong> ${s.padewan.bahaya}`;
  if (elKesehatan) elKesehatan.innerHTML = `<strong>Kesehatan:</strong> ${s.padewan.kesehatan} &nbsp;|&nbsp; <strong>Rumah Tangga:</strong> ${s.padewan.keluarga}`;
  if (elSolusi) elSolusi.textContent = s.padewan.solusi;
}

export function ubahUmurSiklusTahunan(newUmur, baseUmur) {
  const container = document.getElementById('containerSiklusTahunan');
  if (!container) return;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = renderSiklusTahunanCardHtml(newUmur, baseUmur);
  const newElement = tempDiv.firstElementChild;
  if (newElement) {
    container.replaceWith(newElement);
  }
  updateDocSiklusTahunan(newUmur);
}

export function renderShioElemenCardHtml(shioData) {
  if (!shioData || !shioData.shio) return '';
  const d = shioData.detail || {};

  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-3 gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
              Zodiak Tionghoa &amp; Teori Wu Xing
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-sogan-950 border border-sogan-700 text-[10px] text-sogan-300 font-mono">
              Tahun Lahir: ${shioData.tahun} M
            </span>
          </div>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-yin-yang text-prada"></i> Shio Kelahiran: ${shioData.shio} &middot; Elemen ${shioData.elemenTahun}
          </h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-sogan-400 block uppercase font-bold">Kombinasi Elemen</span>
          <span class="font-marcellus text-base sm:text-lg font-bold text-amber-300">${shioData.elemenTetap} &middot; ${shioData.elemenTahun}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-keraton/90 rounded-xl border border-amber-500/30 space-y-1">
          <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-fire-flame-curved text-amber-400"></i> Karakteristik Elemen Tahun (${shioData.elemenTahun})
          </span>
          <p class="text-sogan-200 text-xs leading-relaxed font-medium">${shioData.sifatElemen}</p>
        </div>

        <div class="p-3 bg-keraton/90 rounded-xl border border-prada/30 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-paw text-prada"></i> Sifat Dasar Shio ${shioData.shio}
          </span>
          <p class="text-sogan-200 text-xs leading-relaxed font-medium">${d.sifatDasar || '-'}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-keraton/80 rounded-xl border border-emerald-900/40 space-y-1">
          <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-circle-check text-emerald-400"></i> Watak Positif &amp; Potensi Luhur
          </span>
          <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.positif || '-'}</p>
        </div>

        <div class="p-3 bg-keraton/80 rounded-xl border border-rose-900/40 space-y-1">
          <span class="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Titik Kritis &amp; Sisi Negatif
          </span>
          <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.negatif || '-'}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-sogan-950/80 rounded-xl border border-sogan-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-briefcase text-amber-400"></i> Bidang Karir &amp; Keuangan
          </span>
          <p class="text-sogan-200 text-[11px] leading-relaxed">${d.karir || '-'}</p>
        </div>

        <div class="p-3 bg-sogan-950/80 rounded-xl border border-sogan-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-heart text-prada"></i> Keselarasan Jodoh
          </span>
          <p class="text-sogan-100 text-[11px] font-semibold leading-relaxed">${d.jodoh || '-'}</p>
        </div>

        <div class="p-3 bg-sogan-950/80 rounded-xl border border-rose-900/30 space-y-1">
          <span class="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-ban text-rose-400"></i> Pantangan / Sial
          </span>
          <p class="text-sogan-200 text-[11px] leading-relaxed">${d.pantangan || '-'}</p>
        </div>
      </div>
    </div>
  `;
}

export function renderPranataZodiakCardHtml(mangsaRes, zodiakRes) {
  if (!mangsaRes && !zodiakRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
            Petungan Kosmologi &amp; Musim
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-cloud-sun text-cyan-400"></i> Pranata Mangsa &amp; Zodiak Surya
          </h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] font-mono text-cyan-300/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
            ${mangsaRes ? mangsaRes.nama : ''} &bull; ${zodiakRes ? zodiakRes.nama : ''}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        ${mangsaRes ? `
        <div class="p-4 bg-keraton/90 rounded-xl border border-sogan-800 space-y-2.5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2 mb-2">
              <span class="text-[10px] uppercase font-bold text-prada tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-seedling text-emerald-400"></i> Pranata Mangsa Jawa
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 font-mono">
                ${mangsaRes.rentang}
              </span>
            </div>
            <div class="font-marcellus text-lg font-bold text-prada-light">${mangsaRes.nama}</div>
            <div class="text-[11px] text-amber-300/90 font-serif italic mt-0.5 mb-2">
              &ldquo;${mangsaRes.candrasangkala}&rdquo;
            </div>
            <div class="p-2.5 bg-sogan-950/80 rounded-lg border border-sogan-800 text-xs text-sogan-200 leading-relaxed">
              <span class="text-[10px] uppercase font-bold text-sogan-400 block mb-1">Candra &amp; Watak Mangsa:</span>
              ${mangsaRes.watak}
            </div>
          </div>
        </div>
        ` : ''}

        ${zodiakRes ? `
        <div class="p-4 bg-keraton/90 rounded-xl border border-sogan-800 space-y-2.5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2 mb-2">
              <span class="text-[10px] uppercase font-bold text-prada tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-star-and-crescent text-cyan-400"></i> Zodiak Surya (Falakiah)
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 font-mono">
                ${zodiakRes.rentang}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="font-marcellus text-lg font-bold text-prada-light">${zodiakRes.nama}</div>
              <span class="text-[10px] font-medium text-sogan-300 bg-sogan-950 px-2 py-0.5 rounded border border-sogan-700">${zodiakRes.elemen}</span>
            </div>
            <p class="text-xs text-sogan-200 mt-1 leading-relaxed">${zodiakRes.watak}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div class="p-2 bg-sogan-950/70 rounded border border-emerald-900/40">
              <span class="text-[9px] uppercase font-bold text-emerald-300 block mb-0.5"><i class="fa-solid fa-arrow-trend-up mr-1"></i> Peruntungan</span>
              <span class="text-sogan-200 text-[10px] leading-tight block">${zodiakRes.peruntungan}</span>
            </div>
            <div class="p-2 bg-sogan-950/70 rounded border border-rose-900/40">
              <span class="text-[9px] uppercase font-bold text-rose-300 block mb-0.5"><i class="fa-solid fa-shield-halved mr-1"></i> Resiko</span>
              <span class="text-sogan-200 text-[10px] leading-tight block">${zodiakRes.resiko}</span>
            </div>
            <div class="p-2 bg-sogan-950/70 rounded border border-pink-900/40">
              <span class="text-[9px] uppercase font-bold text-pink-300 block mb-0.5"><i class="fa-solid fa-heart mr-1"></i> Jodoh Serasi</span>
              <span class="text-sogan-200 text-[10px] leading-tight block">${zodiakRes.jodoh}</span>
            </div>
            <div class="p-2 bg-sogan-950/70 rounded border border-blue-900/40">
              <span class="text-[9px] uppercase font-bold text-blue-300 block mb-0.5"><i class="fa-solid fa-briefcase mr-1"></i> Rekomendasi Karir</span>
              <span class="text-sogan-200 text-[10px] leading-tight block">${zodiakRes.karir}</span>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function renderKarakterDasarCardHtml(karakterRes) {
  if (!karakterRes || !karakterRes.data || !karakterRes.data.tipe || karakterRes.data.tipe === '-') return '';
  const d = karakterRes.data;

  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-3 gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
              Analisis Tanggal Lahir Masehi
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-sogan-950 border border-prada/40 text-[10px] text-prada font-mono font-bold">
              Tipe #${karakterRes.noKarakter}
            </span>
          </div>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-brain text-prada"></i> Karakter Dasar: ${d.tipe} (Tipe #${karakterRes.noKarakter})
          </h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-sogan-400 block uppercase font-bold">Kategori Profil</span>
          <span class="font-marcellus text-lg sm:text-xl font-bold text-amber-300">${d.tipe}</span>
        </div>
      </div>

      <div class="p-3 bg-keraton/90 rounded-xl border border-sogan-800 space-y-1">
        <span class="text-[10px] text-sogan-400 uppercase font-bold tracking-wider block">Ringkasan Esensi Karakter:</span>
        <p class="text-sogan-100 text-xs sm:text-sm leading-relaxed font-medium">${d.ringkasan}</p>
      </div>

      ${d.kekuatan ? `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-keraton/80 rounded-xl border border-emerald-900/40 space-y-1.5">
          <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-award text-emerald-400"></i> Kekuatan &amp; Potensi Bawaan
          </span>
          <div class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed whitespace-pre-line">${d.kekuatan}</div>
        </div>

        <div class="p-3 bg-keraton/80 rounded-xl border border-rose-900/40 space-y-2 flex flex-col justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider mb-1">
              <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Kelemahan &amp; Titik Kritis
            </span>
            <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.kelemahan || '-'}</p>
          </div>
          <div class="pt-2 border-t border-sogan-800/80">
            <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider mb-1">
              <i class="fa-solid fa-handshake text-amber-400"></i> Kunci Pendekatan &amp; Negosiasi
            </span>
            <p class="text-amber-100/90 text-[11px] leading-relaxed italic">${d.negosiasi || '-'}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 bg-sogan-950/80 rounded-xl border border-sogan-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-seedling text-amber-400"></i> Sikap yang Harus Dibangun
          </span>
          <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.sikap || '-'}</p>
        </div>

        <div class="p-3 bg-sogan-950/80 rounded-xl border border-prada/30 space-y-1 flex flex-col justify-center">
          <span class="text-[10px] uppercase font-bold text-prada-light flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-quote-left text-prada"></i> Motto Bawah Sadar
          </span>
          <p class="text-prada-light text-[11px] sm:text-xs font-semibold italic">"${d.motto || '-'}"</p>
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

export function renderWatakDinaPasaranCardHtml(watakDinaRes, watakPasaranRes, sasiJawaRes) {
  if (!watakDinaRes && !watakPasaranRes && !sasiJawaRes) return '';
  const sasiName = sasiJawaRes?.sasi && sasiJawaRes.sasi !== '-' ? sasiJawaRes.sasi : '';
  const titleSasi = sasiName ? ` &amp; Sasi (${sasiName})` : '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
            Watak Dina, Pasaran &amp; Sasi Jawa
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-sun text-amber-400"></i> Watak Hari (${watakDinaRes?.dina || '-'}), Pasaran (${watakPasaranRes?.pasaran || '-'})${titleSasi}
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Kombinasi Kosmis Weton &amp; Sasi
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        ${watakDinaRes ? `
        <div class="p-4 bg-keraton/90 rounded-xl border border-amber-900/40 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-calendar-day text-amber-400"></i> Dina: ${watakDinaRes.dina}
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-amber-500/30 text-[10px] text-prada font-bold">
                Lambang: ${watakDinaRes.lambang}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Watak Utama:</span>
              <p class="font-bold text-sogan-100 text-xs">${watakDinaRes.watak_utama}</p>
            </div>
            <div>
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Deskripsi Lengkap:</span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${watakDinaRes.deskripsi}</p>
            </div>
          </div>
          <div class="p-2.5 bg-sogan-950/80 rounded-lg border border-sogan-800">
            <span class="text-[10px] text-emerald-300 uppercase font-bold block mb-0.5 flex items-center gap-1">
              <i class="fa-solid fa-briefcase text-emerald-400"></i> Rekomendasi Profesi Dina:
            </span>
            <p class="text-sogan-200 text-[11px]">${watakDinaRes.rekomendasi_profesi}</p>
          </div>
        </div>
        ` : ''}

        ${watakPasaranRes ? `
        <div class="p-4 bg-keraton/90 rounded-xl border border-blue-900/40 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[10px] uppercase font-bold text-blue-300 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-compass text-blue-400"></i> Pasaran: ${watakPasaranRes.pasaran}
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-blue-500/30 text-[10px] text-prada font-bold">
                Lambang: ${watakPasaranRes.lambang}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Watak Utama:</span>
              <p class="font-bold text-sogan-100 text-xs">${watakPasaranRes.watak_utama}</p>
            </div>
            <div>
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Deskripsi Lengkap:</span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${watakPasaranRes.deskripsi}</p>
            </div>
          </div>
          <div class="p-2.5 bg-sogan-950/80 rounded-lg border border-sogan-800">
            <span class="text-[10px] text-amber-300 uppercase font-bold block mb-0.5 flex items-center gap-1">
              <i class="fa-solid fa-coins text-amber-400"></i> Catatan Rejeki &amp; Nasib:
            </span>
            <p class="text-sogan-200 text-[11px]">${watakPasaranRes.catatan_rejeki_nasib}</p>
          </div>
        </div>
        ` : ''}

        ${sasiJawaRes && sasiJawaRes.sasi !== '-' ? `
        <div class="col-span-1 md:col-span-2 p-4 bg-keraton/90 rounded-xl border border-teal-800/40 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between border-b border-sogan-800 pb-2 gap-2">
            <span class="text-[10px] uppercase font-bold text-teal-300 tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-moon text-teal-400"></i> Watak Sasi Lahir Jawa: ${sasiJawaRes.sasi}
            </span>
            <span class="px-2.5 py-0.5 rounded bg-sogan-950 border border-teal-500/40 text-[10px] text-prada-light font-bold font-mono">
              Padanan Hijriyah: ${sasiJawaRes.padanan}
            </span>
          </div>
          <div>
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-1">Watak Karakteristik Sasi:</span>
            <p class="text-sogan-100 text-xs sm:text-[13px] leading-relaxed font-medium">${sasiJawaRes.watak}</p>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function renderPekerjaanPakartiCardHtml(pekerjaanRes) {
  if (!pekerjaanRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
            Pakarti &amp; Pakaryan Weton
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-briefcase text-prada"></i> Rekomendasi Pekerjaan &amp; Pakarti Rejeki
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Weton: <strong class="text-prada-light">${pekerjaanRes.dino} ${pekerjaanRes.pasaran}</strong>
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3.5 bg-keraton/90 rounded-xl border border-sogan-800 space-y-3 flex flex-col justify-between">
          <div class="grid grid-cols-2 gap-2">
            <div class="p-2.5 rounded-lg bg-sogan-950/80 border border-amber-500/30 text-center">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block">Pakarti Rejeki</span>
              <span class="font-marcellus text-base sm:text-lg font-bold text-amber-300">${pekerjaanRes.pakarti_rejeki}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-sogan-950/80 border border-prada/30 text-center">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block">Pakarti Badan</span>
              <span class="font-marcellus text-base sm:text-lg font-bold text-prada-light">${pekerjaanRes.pakarti_badan}</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="p-2.5 bg-sogan-950/60 rounded-lg border border-sogan-800/80 space-y-1">
              <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-circle-info text-amber-400"></i> Makna Pakarti Rejeki (${pekerjaanRes.pakarti_rejeki})
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed italic">"${pekerjaanRes.arti_rejeki}"</p>
            </div>
            ${pekerjaanRes.arti_badan && pekerjaanRes.arti_badan !== '-' ? `
            <div class="p-2.5 bg-sogan-950/60 rounded-lg border border-prada/30 space-y-1">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-person-rays text-prada"></i> Filosofi Pakarti Badan (${pekerjaanRes.pakarti_badan})
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed italic">"${pekerjaanRes.arti_badan}"</p>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="p-3.5 bg-keraton/90 rounded-xl border border-prada/30 flex flex-col justify-between space-y-2">
          <div class="space-y-1.5">
            <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-compass-drafting text-amber-400"></i> Rekomendasi Pakaryan (Bidang Usaha &amp; Karier)
            </span>
            <p class="text-sogan-100 text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-sogan-950 border border-sogan-800 font-medium">
              ${pekerjaanRes.pakaryan}
            </p>
          </div>
          <p class="text-[10px] text-sogan-400 italic">
            *Berdasarkan petungan Primbon Jawa Pakarti Dino &amp; Pasaran untuk memaksimalkan potensi rezeki dan ketenangan batin.
          </p>
        </div>
      </div>
    </div>
  `;
}

export function renderSirikanAdhepOmahCardHtml(sirikanRes) {
  if (!sirikanRes) return '';
  const neptuVal = (typeof sirikanRes.neptu === 'object' && sirikanRes.neptu !== null)
    ? (sirikanRes.neptu.neptu ?? sirikanRes.neptu.toString())
    : sirikanRes.neptu;

  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-bold uppercase tracking-wider">
            Paugeran Griya &amp; Weton
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-compass text-rose-400"></i> Sirikan Adhep Omah (Pantangan Arah Hadap Rumah)
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Neptu ${neptuVal} &middot; Dina ${sirikanRes.dino}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3.5 bg-keraton/90 rounded-xl border border-rose-900/40 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-rose-300 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-ban text-rose-400"></i> Sirikan Adhedhasar Neptu
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-rose-500/40 text-[10px] text-rose-300 font-mono">
                Neptu ${neptuVal}
              </span>
            </div>
            <p class="text-sogan-300 text-[11px]">Pantangan arah hadap bangunan / lawang ngarep omah:</p>
          </div>
          <div class="p-3 bg-rose-950/40 rounded-lg border border-rose-800/60 text-center">
            <span class="text-[10px] uppercase font-semibold text-rose-300/80 block">Arah Sirikan Neptu:</span>
            <span class="font-marcellus text-lg sm:text-xl font-bold text-rose-300 tracking-wide">${sirikanRes.sirikanNeptu}</span>
          </div>
          <p class="text-[10px] text-sogan-400 italic">
            *Berdasarkan rumus petungan Neptu Weton (${neptuVal}) dari Serat Primbon Griya Jawa.
          </p>
        </div>

        <div class="p-3.5 bg-keraton/90 rounded-xl border border-amber-900/40 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-ban text-amber-400"></i> Sirikan Adhedhasar Dina
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-amber-500/40 text-[10px] text-amber-300 font-mono">
                Dina ${sirikanRes.dino}
              </span>
            </div>
            <p class="text-sogan-300 text-[11px]">Pantangan arah hadap bangunan / lawang ngarep omah:</p>
          </div>
          <div class="p-3 bg-amber-950/40 rounded-lg border border-amber-800/60 text-center">
            <span class="text-[10px] uppercase font-semibold text-amber-300/80 block">Arah Sirikan Dina:</span>
            <span class="font-marcellus text-lg sm:text-xl font-bold text-amber-300 tracking-wide">${sirikanRes.sirikanDina}</span>
          </div>
          <p class="text-[10px] text-sogan-400 italic">
            *Berdasarkan pasuryan hari kelahiran (${sirikanRes.dino}) agar terhindar dari sengkala griya.
          </p>
        </div>
      </div>

      <div class="p-3 bg-sogan-950/70 rounded-xl border border-sogan-800 space-y-1 text-xs">
        <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
          <i class="fa-solid fa-circle-info text-prada"></i> Paugeran &amp; Nasehat Griya
        </span>
        <p class="text-sogan-200 text-[11px] leading-relaxed">
          ${sirikanRes.catatan} Apabila kondisi lahan mengharuskan rumah menghadap ke arah sirikan, masyarakat Jawa biasanya menyiasati dengan memiringkan arah pintu utama (lawang kori) atau membuat akses jalan masuk samping agar sirkulasi hawa tidak berhadapan langsung dengan arah pantangan.
        </p>
      </div>
    </div>
  `;
}

export const LIST_20_AKSARA_CARAKAN = [
  { kode: 'HA', neptu: 1 },
  { kode: 'NA', neptu: 2 },
  { kode: 'CA', neptu: 3 },
  { kode: 'RA', neptu: 4 },
  { kode: 'KA', neptu: 5 },
  { kode: 'DA', neptu: 6 },
  { kode: 'TA', neptu: 7 },
  { kode: 'SA', neptu: 8 },
  { kode: 'WA', neptu: 9 },
  { kode: 'LA', neptu: 10 },
  { kode: 'PA', neptu: 11 },
  { kode: 'DHA', neptu: 12 },
  { kode: 'JA', neptu: 13 },
  { kode: 'YA', neptu: 14 },
  { kode: 'NYA', neptu: 15 },
  { kode: 'MA', neptu: 16 },
  { kode: 'GA', neptu: 17 },
  { kode: 'BA', neptu: 18 },
  { kode: 'THA', neptu: 19 },
  { kode: 'NGA', neptu: 20 }
];

export function buildAksaraSelectOptions(selectedKode) {
  const current = (selectedKode || 'HA').toUpperCase();
  const list = (typeof window !== 'undefined' && window.LIST_AKSARA_CARAKAN) ? window.LIST_AKSARA_CARAKAN : LIST_20_AKSARA_CARAKAN;
  return list.map(item => {
    const isSel = item.kode === current ? 'selected' : '';
    return `<option value="${item.kode}" ${isSel}>${item.kode} (${item.neptu})</option>`;
  }).join('');
}

export function updatePalenggahanInteractive(type) {
  const prefix = (type === 'kerja') ? 'pal_kerja_' : 'pal_tinggal_';
  const el1 = document.getElementById(prefix + 'depan_desa');
  const el2 = document.getElementById(prefix + 'belakang_desa');
  const el3 = document.getElementById(prefix + 'depan_orang');
  const el4 = document.getElementById(prefix + 'belakang_orang');
  if (!el1 || !el2 || !el3 || !el4) return;

  const lookupAksara = (typeof window !== 'undefined' && window.MASTER_AKSARA_FAAL) ? window.MASTER_AKSARA_FAAL : {};
  const lookupPal = (typeof window !== 'undefined' && window.MASTER_PALENGGAHAN) ? window.MASTER_PALENGGAHAN : {};

  const a1 = el1.value;
  const a2 = el2.value;
  const a3 = el3.value;
  const a4 = el4.value;

  const n1 = lookupAksara[a1] !== undefined ? lookupAksara[a1] : 1;
  const n2 = lookupAksara[a2] !== undefined ? lookupAksara[a2] : 1;
  const n3 = lookupAksara[a3] !== undefined ? lookupAksara[a3] : 1;
  const n4 = lookupAksara[a4] !== undefined ? lookupAksara[a4] : 1;

  const total = n1 + n2 + n3 + n4;
  const sisa = total % 5;
  const noPal = (sisa === 0) ? 5 : sisa;
  const palData = lookupPal[noPal] || { surasa: '-', tegese: '-' };

  const elFormula = document.getElementById(prefix + 'formula');
  if (elFormula) {
    elFormula.innerHTML = `Total: <strong>${n1} + ${n2} + ${n3} + ${n4} = ${total}</strong>`;
  }

  const elModulo = document.getElementById(prefix + 'modulo');
  if (elModulo) {
    elModulo.innerHTML = `Modulo 5 &rarr; Sisa ${noPal}`;
  }

  const elCard = document.getElementById(prefix + 'surasa_card');
  const elTitle = document.getElementById(prefix + 'surasa_title');
  const elBadge = document.getElementById(prefix + 'surasa_badge');
  const elDesc = document.getElementById(prefix + 'surasa_desc');

  const isBecik = noPal >= 3;
  if (elCard) {
    elCard.className = `p-3 rounded-lg ${isBecik ? 'bg-emerald-950/30 border border-emerald-800/60' : 'bg-amber-950/30 border border-amber-800/60'} space-y-1 transition-all duration-300`;
  }
  if (elTitle) {
    elTitle.className = `text-[10px] uppercase font-bold ${isBecik ? 'text-emerald-300' : 'text-amber-300'}`;
    elTitle.innerText = `Surasa #${noPal}: ${palData.surasa}`;
  }
  if (elBadge) {
    elBadge.className = `px-2 py-0.5 rounded text-[9px] font-bold ${isBecik ? 'bg-emerald-900/50 text-emerald-200' : 'bg-amber-900/50 text-amber-200'}`;
    elBadge.innerText = isBecik ? 'Kajen Kelingan' : 'Prihatin';
  }
  if (elDesc) {
    elDesc.innerText = palData.tegese;
  }

  const elMeta = document.getElementById(type === 'kerja' ? 'metaPedamelanSurasa' : 'metaPalenggahanSurasa');
  if (elMeta) {
    elMeta.innerText = `(${palData.surasa})`;
    elMeta.className = isBecik ? (type === 'kerja' ? 'text-blue-400 font-semibold font-mono' : 'text-emerald-400 font-semibold font-mono') : 'text-amber-400 font-semibold font-mono';
  }

  const docFormula = document.getElementById(type === 'kerja' ? 'doc_pal_kerja_formula' : 'doc_pal_tinggal_formula');
  if (docFormula) {
    docFormula.textContent = `Total ${n1} + ${n2} + ${n3} + ${n4} = ${total} (Modulo 5 \u2192 Sisa ${noPal})`;
  }
  const docSurasa = document.getElementById(type === 'kerja' ? 'doc_pal_kerja_surasa' : 'doc_pal_tinggal_surasa');
  if (docSurasa) {
    docSurasa.innerHTML = `<strong>${palData.surasa}</strong> (${isBecik ? 'Kajen Kelingan / Becik' : 'Prihatin / Rekasa'})`;
  }
  const docDesc = document.getElementById(type === 'kerja' ? 'doc_pal_kerja_desc' : 'doc_pal_tinggal_desc');
  if (docDesc) {
    docDesc.textContent = palData.tegese;
  }
}

export function updateFaalFromAksaraManual(val) {
  const aksaraList = parseAksaraForFaalakiah(val);
  const sumEl = document.getElementById('faalAksaraSum');
  const listEl = document.getElementById('faalAksaraList');
  const headEl = document.getElementById('faalHeading');
  const descEl = document.getElementById('faalDesc');

  if (aksaraList.length === 0) {
    const defaultNabi = NABI_FAAL[0] || 'Nabi Adam AS';
    const defaultDesc = FAAL_DESC[0] || '-';
    if (headEl) headEl.innerHTML = `Faalakiah Asma: ${defaultNabi} (Kode <span id="faalKode">0</span>)`;
    if (sumEl) sumEl.textContent = '0';
    if (listEl) listEl.textContent = '-';
    if (descEl) descEl.textContent = defaultDesc;
    return;
  }

  let sum = 0;
  for (const ak of aksaraList) {
    sum += (AKSARA_FAAL[ak] || 1);
  }
  const kode = sum % 12;
  const nabi = NABI_FAAL[kode] || NABI_FAAL[0];
  const desc = FAAL_DESC[kode] || FAAL_DESC[0];

  if (headEl) headEl.innerHTML = `Faalakiah Asma: ${nabi} (Kode <span id="faalKode">${kode}</span>)`;
  if (sumEl) sumEl.textContent = String(sum);
  if (listEl) listEl.textContent = aksaraList.join(' ');
  if (descEl) descEl.textContent = desc;
}

export function salinAksaraFaal() {
  const el = document.getElementById('faalAksaraJawaInput');
  const txt = el ? el.value.trim() : '';
  if (!txt) {
    showToast('Aksara Jawa taksih kosong.');
    return;
  }
  copyToClipboard(txt, 'Aksara Jawa kasil dipun salin!');
}

// ─── TAHAP 3.1: GLOSARIUM KONSEPTUAL MODAL ────────────────────────────────
export function openGlosariumNujumModal(conceptId = null) {
  const modal = document.getElementById('modalGlosariumNujum');
  if (!modal) return;

  renderGlosariumContent(conceptId);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function closeGlosariumNujumModal() {
  const modal = document.getElementById('modalGlosariumNujum');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

export function renderGlosariumContent(filterId = null) {
  const container = document.getElementById('glosariumNujumContainer');
  if (!container) return;

  const concepts = filterId ? getNujumGlossary(filterId) : NUJUM_GLOSSARY_CONCEPTS;

  container.innerHTML = `
    <div class="space-y-3.5 text-xs">
      ${concepts.map(c => `
        <div class="p-4 rounded-2xl bg-keraton border border-sogan-800 space-y-2 hover:border-prada/60 transition">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800/80 pb-2">
            <div>
              <span class="text-[10px] font-mono text-prada uppercase font-semibold block">${c.kategori} · ${c.siklus}</span>
              <h4 class="font-marcellus text-base sm:text-lg font-bold text-amber-300">${c.istilah}</h4>
            </div>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-sogan-900 border border-sogan-700 text-sogan-300 font-mono">
              ${c.namaJawa}
            </span>
          </div>
          <p class="text-sogan-200 leading-relaxed text-[11.5px]">${c.deskripsi}</p>
          <div class="p-2.5 rounded-xl bg-sogan-950/80 border border-sogan-800 text-[11px]">
            <strong class="text-prada block mb-0.5 uppercase text-[10px]">Nilai Filosofi &amp; Edukasi:</strong>
            <span class="text-sogan-300 italic">${c.filosofi}</span>
          </div>
          <div class="text-[10.5px] text-sogan-400">
            <span class="font-semibold text-sogan-300">Contoh Penerapan:</span> ${c.contoh}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── TAHAP 3.4: PERBANDINGAN NON-JODOH (SIDE-BY-SIDE SINERGI) ───────────────
export function switchNujumSubTab(tab) {
  const tabPribadi = document.getElementById('subTabNujumPribadi');
  const tabNonJodoh = document.getElementById('subTabNujumNonJodoh');
  const btnPribadi = document.getElementById('btnSubTabNujumPribadi');
  const btnNonJodoh = document.getElementById('btnSubTabNujumNonJodoh');

  if (tab === 'pribadi') {
    tabPribadi?.classList.remove('hidden');
    tabNonJodoh?.classList.add('hidden');
    if (btnPribadi) {
      btnPribadi.className = 'flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow text-center transition';
    }
    if (btnNonJodoh) {
      btnNonJodoh.className = 'flex-1 py-2 px-3 rounded-lg text-sogan-300 hover:text-prada font-semibold text-center transition';
    }
  } else {
    tabPribadi?.classList.add('hidden');
    tabNonJodoh?.classList.remove('hidden');
    if (btnNonJodoh) {
      btnNonJodoh.className = 'flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow text-center transition';
    }
    if (btnPribadi) {
      btnPribadi.className = 'flex-1 py-2 px-3 rounded-lg text-sogan-300 hover:text-prada font-semibold text-center transition';
    }
  }
}

export function hitungKomparasiNonJodoh() {
  const p1Nama = document.getElementById('nonJodohP1Nama')?.value.trim() || 'Rekan 1';
  const p1Tgl = document.getElementById('nonJodohP1Tgl')?.value;
  const p2Nama = document.getElementById('nonJodohP2Nama')?.value.trim() || 'Rekan 2';
  const p2Tgl = document.getElementById('nonJodohP2Tgl')?.value;
  const relasiSel = document.getElementById('nonJodohRelasiSel')?.value || 'rekan_kerja';

  if (!p1Tgl || !p2Tgl) {
    showToast('Pilih tanggal lahir kedua belah pihak terlebih dahulu.');
    return;
  }

  const result = compareNonJodoh(
    { nama: p1Nama, tglLahir: p1Tgl },
    { nama: p2Nama, tglLahir: p2Tgl },
    relasiSel
  );

  renderKomparasiNonJodoh(result);
  showToast('Komparasi sinergi relasi kasil kapetung!');
}

export function renderKomparasiNonJodoh(res) {
  const outBox = document.getElementById('hasilKomparasiNonJodohBox');
  if (!outBox) return;

  const { person1, person2, sinergi } = res;

  outBox.innerHTML = `
    <div class="space-y-4 text-xs">
      <!-- Header Hasil Komparasi & Skor Sinergi -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800 pb-3">
          <div>
            <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">HASIL KOMPARASI RELASI NON-JODOH</span>
            <h3 class="font-marcellus text-lg sm:text-xl font-bold text-prada-light">${sinergi.relasiLabel}</h3>
            <span class="text-xs text-sogan-300">Kombinasi Karakter: <strong>${sinergi.kombinasiKarakter}</strong></span>
          </div>
          <div class="text-right">
            <span class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-700 text-white font-bold text-sm shadow">
              Keselarasan: ${sinergi.skorKeselarasanRelasi}%
            </span>
          </div>
        </div>

        <!-- Tabel Side-by-Side Kedua Belah Pihak -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Kartu Person 1 -->
          <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-1.5">
              <strong class="font-marcellus text-sm text-prada">${person1.nama}</strong>
              <span class="text-[10px] font-mono text-sogan-400">${person1.tglStr}</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div class="flex justify-between"><span class="text-sogan-400">Weton:</span> <strong class="text-sogan-100">${person1.dino} ${person1.pas} (N: ${person1.neptu})</strong></div>
              <div class="flex justify-between"><span class="text-sogan-400">Wuku:</span> <span class="text-sogan-200">${person1.wukuName}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Tipe Karakter:</span> <span class="text-amber-300 font-bold">${person1.tipeKarakter}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Paarasan:</span> <span class="text-indigo-300">${person1.bincil.paarasan.nama}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Pandangon:</span> <span class="text-cyan-300">${person1.bincil.pandangon.nama}</span></div>
            </div>
          </div>

          <!-- Kartu Person 2 -->
          <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-1.5">
              <strong class="font-marcellus text-sm text-prada">${person2.nama}</strong>
              <span class="text-[10px] font-mono text-sogan-400">${person2.tglStr}</span>
            </div>
            <div class="space-y-1 text-[11px]">
              <div class="flex justify-between"><span class="text-sogan-400">Weton:</span> <strong class="text-sogan-100">${person2.dino} ${person2.pas} (N: ${person2.neptu})</strong></div>
              <div class="flex justify-between"><span class="text-sogan-400">Wuku:</span> <span class="text-sogan-200">${person2.wukuName}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Tipe Karakter:</span> <span class="text-amber-300 font-bold">${person2.tipeKarakter}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Paarasan:</span> <span class="text-indigo-300">${person2.bincil.paarasan.nama}</span></div>
              <div class="flex justify-between"><span class="text-sogan-400">Pandangon:</span> <span class="text-cyan-300">${person2.bincil.pandangon.nama}</span></div>
            </div>
          </div>
        </div>

        <!-- Analisis Sinergi & Saran Tepa Slira -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-handshake"></i> Titik Temu Sinergis:
            </span>
            <ul class="space-y-1.5 text-[11px] text-emerald-100">
              ${sinergi.titikTemu.map(t => `<li class="flex items-start gap-1.5"><span class="text-emerald-400">✓</span> <span>${t}</span></li>`).join('')}
            </ul>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
            <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-triangle-exclamation"></i> Potensi Friksi Komunikasi:
            </span>
            <ul class="space-y-1.5 text-[11px] text-amber-100">
              ${sinergi.potensiFriksi.map(f => `<li class="flex items-start gap-1.5"><span class="text-amber-400">▲</span> <span>${f}</span></li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-sogan-950 border border-prada/30 space-y-1.5">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-seedling"></i> Rekomendasi Etika Kolaborasi Jawa (Tepa Slira):
          </span>
          <ul class="space-y-1 text-[11px] text-sogan-200">
            ${sinergi.saranTepaSlira.map(s => `<li class="flex items-start gap-1.5"><span class="text-prada">❖</span> <span>${s}</span></li>`).join('')}
          </ul>
        </div>

        <div class="p-3 rounded-xl bg-keraton border border-sogan-800 text-[10.5px] text-sogan-300">
          <strong class="text-prada block mb-0.5">Catatan Etika Non-Jodoh:</strong>
          Komparasi ini murni disusun sebagai wawasan psikologis tradisi untuk memperkuat kekompakan tim, kemitraan, dan persaudaraan tanpa penilaian keserasian pernikahan.
        </div>
      </div>
    </div>
  `;
}

// ─── TAHAP 3.3: EKSPOR LAPORAN NUJUM LENGKAP (PDF CETAK) ───────────────────
export function renderLaporanNujumPrintHtml(d) {
  const neptuVal = (typeof d.sirikanRes?.neptu === 'object' && d.sirikanRes?.neptu !== null)
    ? (d.sirikanRes.neptu.neptu ?? d.sirikanRes.neptu.toString())
    : (d.sirikanRes?.neptu || d.neptu);

  return `
    <div style="padding: 24pt; font-family: 'Times New Roman', serif; color: #0f172a; max-width: 700pt; margin: 0 auto; line-height: 1.4;">
      <!-- KOP RESMI KERATON -->
      <div style="text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 14pt;">
        <div style="font-size: 14pt; font-weight: bold; letter-spacing: 1.5pt;">JAGAD JAWA &middot; SERAT PRIMBON RESMI</div>
        <div style="font-size: 11pt; font-style: italic; margin-top: 2pt;">Laporan Nujum Kepribadian, 6 Dimensi Bincil &amp; Kosmologi Jawa</div>
        <div style="font-size: 7.5pt; color: #475569; margin-top: 2pt;">Kasultanan Ngayogyakarta Hadiningrat &middot; Karaton Surakarta Hadiningrat</div>
      </div>

      <!-- BIODATA -->
      <table style="width: 100%; font-size: 9pt; margin-bottom: 12pt; border-collapse: collapse;">
        <tr>
          <td style="width: 25%; font-weight: bold; padding: 2pt 0;">Nama Lengkap</td>
          <td style="width: 2%;">:</td>
          <td style="width: 73%;">${d.nama}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 2pt 0;">Tanggal Lahir</td>
          <td>:</td>
          <td>${d.d} ${BULAN_MASEHI[d.m - 1]} ${d.y} M (${d.tglJawaRes.fullStr})</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 2pt 0;">Weton &amp; Neptu</td>
          <td>:</td>
          <td><strong>${d.dino} ${d.pas}</strong> (Neptu: ${d.neptu}) &middot; Wuku: ${d.wukuName} (${d.wukuNo}/30)</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 2pt 0;">Tipe Karakter</td>
          <td>:</td>
          <td><strong>${d.kd.tipe}</strong> &mdash; ${d.kd.ringkasan}</td>
        </tr>
      </table>

      <!-- 6 DIMENSI BINCIL -->
      <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1pt solid #94a3b8; padding-bottom: 2pt;">
        Enem Dimensi Bincil Jawa
      </div>
      <table style="width: 100%; font-size: 8.5pt; border-collapse: collapse; margin-bottom: 12pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="padding: 3pt; border: 0.5pt solid #cbd5e1; width: 25%;">Dimensi</th>
            <th style="padding: 3pt; border: 0.5pt solid #cbd5e1; width: 25%;">Nama Lambang</th>
            <th style="padding: 3pt; border: 0.5pt solid #cbd5e1; width: 50%;">Makna &amp; Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">1. Padewan</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.padewan?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.padewan?.arti || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">2. Paringkelan</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.paringkelan?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.paringkelan?.arti || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">3. Pandangon</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.pandangon?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.pandangon?.arti || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">4. Paarasan</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.paarasan?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.paarasan?.arti || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">5. Pancasuda</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.pancasuda?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.pancasuda?.arti || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1; font-weight: bold;">6. Kamarokan</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.kamarokan?.nama || '-'}</td>
            <td style="padding: 3pt; border: 0.5pt solid #cbd5e1;">${d.nujumRes?.kamarokan?.arti || '-'}</td>
          </tr>
        </tbody>
      </table>

      <!-- FAALAKIAH ASMA -->
      <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1pt solid #94a3b8; padding-bottom: 2pt;">
        Faalakiah Asma 12 Nabi &amp; Tolak Balak
      </div>
      <div style="font-size: 8.5pt; margin-bottom: 12pt; background-color: #f8fafc; padding: 6pt; border: 0.5pt solid #cbd5e1; border-radius: 4pt;">
        <div><strong>Teladan Nabi:</strong> ${d.faal.nabi} (Nilai Aksara: ${d.faal.sum} &middot; Aksara: ${d.faal.aksaraStr})</div>
        <div style="margin-top: 3pt; color: #334155;"><strong>Petunjuk &amp; Nasihat:</strong> ${d.faal.desc}</div>
      </div>

      <!-- SIRIKAN ADHEP OMAH -->
      ${d.sirikanRes ? `
      <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1pt solid #94a3b8; padding-bottom: 2pt;">
        Paugeran Griya: Sirikan Adhep Omah
      </div>
      <table style="width: 100%; font-size: 8.5pt; border-collapse: collapse; margin-bottom: 12pt;">
        <tr>
          <td style="width: 50%; padding: 4pt; border: 0.5pt solid #cbd5e1; background-color: #fff1f2;">
            <div style="font-weight: bold; color: #9f1239; font-size: 8pt;">SIRIKAN NEPTU (${neptuVal}):</div>
            <div style="font-size: 9pt; font-weight: bold;">${d.sirikanRes.sirikanNeptu || '-'}</div>
          </td>
          <td style="width: 50%; padding: 4pt; border: 0.5pt solid #cbd5e1; background-color: #fffbeb;">
            <div style="font-weight: bold; color: #92400e; font-size: 8pt;">SIRIKAN DINA (${d.dino}):</div>
            <div style="font-size: 9pt; font-weight: bold;">${d.sirikanRes.sirikanDina || '-'}</div>
          </td>
        </tr>
      </table>
      ` : ''}

      <!-- PAKARTI & PEKERJAAN -->
      ${d.pekerjaanRes ? `
      <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1pt solid #94a3b8; padding-bottom: 2pt;">
        Rekomendasi Pakarti Rejeki &amp; Pakaryan
      </div>
      <div style="font-size: 8.5pt; margin-bottom: 12pt; background-color: #f8fafc; padding: 6pt; border: 0.5pt solid #cbd5e1; border-radius: 4pt;">
        <div><strong>Pakarti Rejeki:</strong> ${d.pekerjaanRes.pakarti_rejeki} &mdash; <em>"${d.pekerjaanRes.arti_rejeki || '-'}"</em></div>
        <div style="margin-top: 2pt;"><strong>Pakaryan (Bidang Usaha):</strong> ${d.pekerjaanRes.pakaryan || '-'}</div>
      </div>
      ` : ''}

      <!-- SIKLUS TAHUNAN -->
      <div style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1pt solid #94a3b8; padding-bottom: 2pt;">
        Siklus Tahunan (Usia ${d.umur} Tahun)
      </div>
      <div style="font-size: 8.5pt; margin-bottom: 12pt; background-color: #f8fafc; padding: 6pt; border: 0.5pt solid #cbd5e1; border-radius: 4pt;">
        <div><strong>Siklus Usia:</strong> ${d.umur} Tahun (Siklus Ke-${d.umur % 12 === 0 ? 12 : (d.umur % 12)} / 12)</div>
        ${d.shioLahirRes ? `<div style="margin-top: 2pt;"><strong>Shio Kelahiran:</strong> ${d.shioLahirRes.shio} &middot; Elemen ${d.shioLahirRes.elemenTahun}</div>` : ''}
        ${d.mangsaRes ? `<div style="margin-top: 2pt;"><strong>Pranata Mangsa:</strong> ${d.mangsaRes.nama} (${d.mangsaRes.rentang}) &middot; Candra: <em>&ldquo;${d.mangsaRes.candrasangkala}&rdquo;</em></div>` : ''}
      </div>

      <!-- DISCLAIMER RESMI -->
      <div style="margin-top: 14pt; font-size: 7.5pt; color: #475569; border-top: 0.5pt solid #94a3b8; padding-top: 6pt; text-align: justify; font-style: italic;">
        <strong>Paweling Budaya &amp; Literasi:</strong> ${DISCLAIMER_ETIS_KULTURAL}
      </div>
      <div style="text-align: right; font-size: 7pt; color: #64748b; margin-top: 4pt;">
        Kadhudhah otomatis lumantar Platform Budaya Luhur Jagad Jawa &middot; jagad-jawa.web.app
      </div>
    </div>
  `;
}

export function printLaporanNujum(theme = 'parchment') {
  if (!lastCalculatedData) {
    showToast('Hitung nujum terlebih dahulu sebelum mencetak.');
    return;
  }

  const printDocHtml = renderLaporanNujumPrintHtml(lastCalculatedData);
  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const customTitle = `Jagad Jawa — Nujum ${lastCalculatedData.nama}`;
  if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}

// ─── WINDOW EXPOSURE UNTUK INLINE ONCLICK & LEGACY HANDLERS ─────────────────
if (typeof window !== 'undefined') {
  window.initTahunHitungSelect = initTahunHitungSelect;
  window.updateKepribadianQuickInfo = updateKepribadianQuickInfo;
  window.hitungKepribadianLengkap = hitungKepribadianLengkap;
  window.switchNujumViewMode = switchNujumViewMode;
  window.openGlosariumNujumModal = openGlosariumNujumModal;
  window.closeGlosariumNujumModal = closeGlosariumNujumModal;
  window.renderGlosariumContent = renderGlosariumContent;
  window.switchNujumSubTab = switchNujumSubTab;
  window.hitungKomparasiNonJodoh = hitungKomparasiNonJodoh;
  window.renderKomparasiNonJodoh = renderKomparasiNonJodoh;
  window.printLaporanNujum = printLaporanNujum;

  window.renderSiklusTahunanCardHtml = renderSiklusTahunanCardHtml;
  window.updateDocSiklusTahunan = updateDocSiklusTahunan;
  window.ubahUmurSiklusTahunan = ubahUmurSiklusTahunan;
  window.renderShioElemenCardHtml = renderShioElemenCardHtml;
  window.renderPranataZodiakCardHtml = renderPranataZodiakCardHtml;
  window.renderKarakterDasarCardHtml = renderKarakterDasarCardHtml;
  window.renderWatakDinaPasaranCardHtml = renderWatakDinaPasaranCardHtml;
  window.renderSirikanAdhepOmahCardHtml = renderSirikanAdhepOmahCardHtml;
  window.renderPalenggahanPedamelanCardHtml = renderPalenggahanPedamelanCardHtml;
  window.renderPekerjaanPakartiCardHtml = renderPekerjaanPakartiCardHtml;
  window.LIST_20_AKSARA_CARAKAN = LIST_20_AKSARA_CARAKAN;
  window.buildAksaraSelectOptions = buildAksaraSelectOptions;
  window.updatePalenggahanInteractive = updatePalenggahanInteractive;
  window.updateFaalFromAksaraManual = updateFaalFromAksaraManual;
  window.salinAksaraFaal = salinAksaraFaal;
}
