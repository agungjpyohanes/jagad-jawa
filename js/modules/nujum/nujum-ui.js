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

// ─── KANON RESOLVER — dewa-kanon.js ─────────────────────────────────────────
// Digunakan untuk normalize label dewa/wuku di UI sebelum ditampilkan.
// PENTING: resolveAstawara → label A1 (tanpa Batara/Batari)
//          resolveSiklus12 → label A2 (dengan Batara/Batari)
//          TIDAK BOLEH ditampilkan "Batari Sri" sebagai hasil astawara matrix.
import {
  normalizeDewaName,
  resolveAstawara,
  resolveSiklus12,
  resolveWukuDewa,
  dewaneLegacyImagePath,
  wukuLegacyImagePath
} from '../../data/dewa-kanon.js';

import {
  openNujumPokemonCardModal,
  closeNujumPokemonCardModal,
  downloadNujumPokemonCardPng,
  shareNujumPokemonCard,
  onNujumPokemonOptionChange,
  onNujumPokemonNameInput,
  drawNujumPokemonCard,
  openKartuKarakterModal,
  closeKartuKarakterModal,
  downloadKartuKarakterPng,
  shareKartuKarakter,
  drawKartuKarakter,
  generateDraftKartuKarakter,
  generateDraftCard,
  KARTU_KARAKTER_PRESETS
} from './nujum-share-card.js';

if (typeof window !== 'undefined') {
  window.openNujumPokemonCardModal = openNujumPokemonCardModal;
  window.closeNujumPokemonCardModal = closeNujumPokemonCardModal;
  window.downloadNujumPokemonCardPng = downloadNujumPokemonCardPng;
  window.shareNujumPokemonCard = shareNujumPokemonCard;
  window.onNujumPokemonOptionChange = onNujumPokemonOptionChange;
  window.onNujumPokemonNameInput = onNujumPokemonNameInput;
  window.drawNujumPokemonCard = drawNujumPokemonCard;

  window.openKartuKarakterModal = openKartuKarakterModal;
  window.closeKartuKarakterModal = closeKartuKarakterModal;
  window.downloadKartuKarakterPng = downloadKartuKarakterPng;
  window.shareKartuKarakter = shareKartuKarakter;
  window.drawKartuKarakter = drawKartuKarakter;
  window.generateDraftKartuKarakter = generateDraftKartuKarakter;
  window.generateDraftCard = generateDraftCard;
  window.KARTU_KARAKTER_PRESETS = KARTU_KARAKTER_PRESETS;
}

export {
  openNujumPokemonCardModal,
  closeNujumPokemonCardModal,
  downloadNujumPokemonCardPng,
  shareNujumPokemonCard,
  onNujumPokemonOptionChange,
  onNujumPokemonNameInput,
  drawNujumPokemonCard,
  openKartuKarakterModal,
  closeKartuKarakterModal,
  downloadKartuKarakterPng,
  shareKartuKarakter,
  drawKartuKarakter,
  generateDraftKartuKarakter,
  generateDraftCard,
  KARTU_KARAKTER_PRESETS
};

let currentNujumMode = 'ringkas'; // 'ringkas' | 'mendalam'
let lastCalculatedData = null;

export function initTahunHitungSelect() {
  const sel = document.getElementById('tahunHitungKepribadian');
  if (!sel) return;
  const currentVal = sel.value ? parseInt(sel.value) : null;
  const currentYear = new Date().getFullYear();
  sel.innerHTML = '';
  for (let y = 1940; y <= 2050; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = `${y} M`;
    if (currentVal ? (currentVal === y) : (y === currentYear)) {
      opt.selected = true;
    }
    sel.appendChild(opt);
  }
}

export function onTahunHitungChange() {
  updateKepribadianQuickInfo();
  if (lastCalculatedData) {
    const defaultYear = new Date().getFullYear();
    const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value || `${defaultYear}`) || defaultYear;
    const umur = Math.max(0, tahunHitung - lastCalculatedData.y);
    lastCalculatedData.tahunHitung = tahunHitung;
    lastCalculatedData.umur = umur;
    lastCalculatedData.summaryRingkas = getNujumSummaryRingkas({
      nama: lastCalculatedData.nama,
      d: lastCalculatedData.d,
      m: lastCalculatedData.m,
      y: lastCalculatedData.y,
      tahunHitung
    });
    renderHasilNujumContent();
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

  const defaultYear = new Date().getFullYear();
  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value || `${defaultYear}`) || defaultYear;
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
  const defaultYear = new Date().getFullYear();
  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value || `${defaultYear}`) || defaultYear;
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

  const fnSiklus = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (typeof window !== 'undefined' && window.hitungSiklusTahunan ? window.hitungSiklusTahunan : null);
  const siklusTahunanRes = fnSiklus ? fnSiklus(umur) : null;

  lastCalculatedData = {
    nama, tglVal, d, m, y, tahunHitung, umur,
    dino, pas, neptu, wukuName, wukuNo: info.wukuId + 1,
    alamatTinggal, alamatKerja,
    nujumRes, faal, aseso, kd, summaryRingkas, tglJawaRes,
    shioLahirRes, zodiakRes, mangsaRes, karakterRes,
    watakDinaRes, watakPasaranRes, sasiJawaRes,
    sirikanRes, palenggahanRes, pedamelanRes, pekerjaanRes, pwk, aksaraJawa,
    siklusTahunanRes
  };
  if (typeof window !== 'undefined') {
    window.lastCalculatedNujumData = lastCalculatedData;
  }

  renderHasilNujumContent();

  // Tampilkan tombol cetak laporan untuk Mode Lengkap & Mode Ringkas
  const btnLengkap = document.getElementById('btnPrintKepribadianLengkap');
  const btnRingkas = document.getElementById('btnPrintKepribadianRingkas');
  const btnParchment = document.getElementById('btnPrintKepribadianParchment');
  const btnMono = document.getElementById('btnPrintKepribadian');

  if (btnLengkap) {
    btnLengkap.style.display = 'inline-flex';
    btnLengkap.onclick = () => printLaporanNujum('monochrome', 'lengkap');
  }
  if (btnRingkas) {
    btnRingkas.style.display = 'inline-flex';
    btnRingkas.onclick = () => printLaporanNujum('monochrome', 'ringkas');
  }
  if (btnParchment) {
    btnParchment.style.display = 'inline-flex';
    btnParchment.onclick = () => printLaporanNujum('parchment', currentNujumMode === 'ringkas' ? 'ringkas' : 'lengkap');
  }
  if (btnMono) {
    btnMono.style.display = 'inline-flex';
    btnMono.onclick = () => printLaporanNujum('monochrome', currentNujumMode === 'ringkas' ? 'ringkas' : 'lengkap');
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
          <i class="fa-solid fa-sliders"></i> Mode:
        </span>
        <div class="inline-flex p-1 rounded-lg bg-sogan-950 border border-sogan-800 text-xs">
          <button onclick="window.switchNujumViewMode('ringkas')" class="px-3 py-1.5 rounded-md font-semibold transition ${isRingkas ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-list-check mr-1"></i> Ringkas
          </button>
          <button onclick="window.switchNujumViewMode('mendalam')" class="px-3 py-1.5 rounded-md font-semibold transition ${!isRingkas ? 'bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow' : 'text-sogan-300 hover:text-prada'}">
            <i class="fa-solid fa-book-open mr-1"></i> Mendalam (Primbon)
          </button>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button onclick="window.openNujumPokemonCardModal && window.openNujumPokemonCardModal(window.lastCalculatedNujumData || lastCalculatedData)" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton hover:brightness-110 text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer" title="Bagikan Kartu Karakter Pusaka Jawa">
          <i class="fa-solid fa-id-card-clip"></i> Kartu Karakter
        </button>
        <div class="inline-flex p-0.5 rounded-lg bg-sogan-950 border border-sogan-800 text-xs">
          <button onclick="window.printLaporanNujum('monochrome', 'lengkap')" class="px-2.5 py-1 rounded text-prada hover:bg-sogan-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer" title="Cetak Dokumen Arsip Lengkap 9 Bagian">
            <i class="fa-solid fa-file-lines text-prada"></i> <span class="hidden sm:inline">Cetak Lengkap</span>
          </button>
          <button onclick="window.printLaporanNujum('monochrome', 'ringkas')" class="px-2.5 py-1 rounded text-sogan-200 hover:text-prada hover:bg-sogan-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer" title="Cetak Dokumen Ringkas Transkripsi">
            <i class="fa-solid fa-file-contract text-amber-400"></i> <span class="hidden sm:inline">Cetak Ringkas</span>
          </button>
        </div>
        <button onclick="window.openGlosariumNujumModal()" class="px-3 py-1.5 rounded-lg bg-sogan-900 border border-prada/40 hover:border-prada text-prada text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
          <i class="fa-solid fa-circle-question text-amber-400"></i> Glosarium
        </button>
      </div>
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
              <button onclick="window.openNujumPokemonCardModal && window.openNujumPokemonCardModal(window.lastCalculatedNujumData || lastCalculatedData)" class="mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-[11px] inline-flex items-center gap-1.5 hover:brightness-110 shadow transition cursor-pointer">
                <i class="fa-solid fa-id-card-clip text-[10px]"></i> Kartu Karakter
              </button>
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
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="window.openNujumPokemonCardModal && window.openNujumPokemonCardModal(window.lastCalculatedNujumData || lastCalculatedData)" class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow transition cursor-pointer">
              <i class="fa-solid fa-id-card-clip"></i> Kartu Karakter
            </button>
            <button onclick="window.openWetonShareModal(${data.y}, ${data.m}, ${data.d})" class="px-3.5 py-1.5 rounded-lg bg-sogan-900 border border-prada/40 hover:bg-sogan-800 text-prada text-xs font-semibold flex items-center gap-1.5 transition">
              <i class="fa-solid fa-share-nodes"></i> Bagikan Weton
            </button>
          </div>
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

export function renderPalenggahanPedamelanCardHtml(palenggahanRes, pedamelanRes) {
  const pTinggal = palenggahanRes || {
    namaTempat: '-', namaOrang: '-',
    firstCharTempat: '-', lastCharTempat: '-',
    aksaraFirstTempat: 'HA', aksaraLastTempat: 'HA',
    neptuFirstTempat: 1, neptuLastTempat: 1,
    firstCharOrang: '-', lastCharOrang: '-',
    aksaraFirstOrang: 'HA', aksaraLastOrang: 'HA',
    neptuFirstOrang: 1, neptuLastOrang: 1,
    totalNeptu: 4, noPalenggahan: 4,
    palenggahan: { surasa: 'PANDHITA', tegese: 'Kajen kelingan (Watak mandita, linuhung)' }
  };
  const pKerja = pedamelanRes || {
    namaTempat: '-', namaOrang: '-',
    firstCharTempat: '-', lastCharTempat: '-',
    aksaraFirstTempat: 'HA', aksaraLastTempat: 'HA',
    neptuFirstTempat: 1, neptuLastTempat: 1,
    firstCharOrang: '-', lastCharOrang: '-',
    aksaraFirstOrang: 'HA', aksaraLastOrang: 'HA',
    neptuFirstOrang: 1, neptuLastOrang: 1,
    totalNeptu: 4, noPalenggahan: 4,
    palenggahan: { surasa: 'PANDHITA', tegese: 'Kajen kelingan (Watak mandita, linuhung)' }
  };

  const isTinggalBecik = (pTinggal.noPalenggahan >= 3);
  const isKerjaBecik = (pKerja.noPalenggahan >= 3);

  return `
    <div class="space-y-4 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
            Analisis Palenggahan &amp; Pedamelan
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-map-location-dot text-emerald-400"></i> Keselarasan Papan Palenggahan &amp; Pedamelan
          </h4>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span id="metaPalenggahanSurasa" class="${isTinggalBecik ? 'text-emerald-400' : 'text-amber-400'} font-semibold font-mono">(${pTinggal.palenggahan?.surasa || '-'})</span>
          <span class="text-sogan-500">&bull;</span>
          <span id="metaPedamelanSurasa" class="${isKerjaBecik ? 'text-blue-400' : 'text-amber-400'} font-semibold font-mono">(${pKerja.palenggahan?.surasa || '-'})</span>
        </div>
      </div>

      <p class="text-xs text-sogan-300 leading-relaxed">
        Kalkulasi keselarasan getaran nama orang kaliyan nama wewengkon (kelurahan/desa) panggénan dedunung sarta pedamelan kanthi formula 4 aksara (aksara ngajeng &amp; pungkasan) modulo 5.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 1. Palenggahan (Alamat Tinggal) -->
        <div class="p-4 rounded-xl bg-keraton/90 border border-sogan-800 space-y-3 flex flex-col justify-between">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[11px] font-bold text-prada uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-house-chimney text-amber-400"></i> Papan Palenggahan (Griya)
              </span>
              <span class="text-[10px] text-sogan-400 font-mono">${pTinggal.namaTempat || '-'}</span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Ngajeng Desa:</label>
                <select id="pal_tinggal_depan_desa" onchange="window.updatePalenggahanInteractive('tinggal')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pTinggal.aksaraFirstTempat)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Pungkasan Desa:</label>
                <select id="pal_tinggal_belakang_desa" onchange="window.updatePalenggahanInteractive('tinggal')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pTinggal.aksaraLastTempat)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Ngajeng Nama:</label>
                <select id="pal_tinggal_depan_orang" onchange="window.updatePalenggahanInteractive('tinggal')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pTinggal.aksaraFirstOrang)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Pungkasan Nama:</label>
                <select id="pal_tinggal_belakang_orang" onchange="window.updatePalenggahanInteractive('tinggal')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pTinggal.aksaraLastOrang)}
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] p-2 rounded-lg bg-sogan-950/80 border border-sogan-800 font-mono text-sogan-300">
              <span id="pal_tinggal_formula">Total: <strong>${pTinggal.totalNeptu}</strong></span>
              <span id="pal_tinggal_modulo" class="text-prada">Modulo 5 &rarr; Sisa ${pTinggal.noPalenggahan}</span>
            </div>
          </div>

          <div id="pal_tinggal_surasa_card" class="p-3 rounded-lg ${isTinggalBecik ? 'bg-emerald-950/30 border border-emerald-800/60' : 'bg-amber-950/30 border border-amber-800/60'} space-y-1 transition-all duration-300">
            <div class="flex items-center justify-between">
              <span id="pal_tinggal_surasa_title" class="text-[10px] uppercase font-bold ${isTinggalBecik ? 'text-emerald-300' : 'text-amber-300'}">
                Surasa #${pTinggal.noPalenggahan}: ${pTinggal.palenggahan?.surasa || '-'}
              </span>
              <span id="pal_tinggal_surasa_badge" class="px-2 py-0.5 rounded text-[9px] font-bold ${isTinggalBecik ? 'bg-emerald-900/50 text-emerald-200' : 'bg-amber-900/50 text-amber-200'}">
                ${isTinggalBecik ? 'Kajen Kelingan' : 'Prihatin'}
              </span>
            </div>
            <p id="pal_tinggal_surasa_desc" class="text-[11px] text-sogan-200 leading-relaxed">${pTinggal.palenggahan?.tegese || '-'}</p>
          </div>
        </div>

        <!-- 2. Pedamelan (Alamat Tempat Kerja) -->
        <div class="p-4 rounded-xl bg-keraton/90 border border-sogan-800 space-y-3 flex flex-col justify-between">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[11px] font-bold text-prada uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-briefcase text-blue-400"></i> Papan Pedamelan (Pakaryan)
              </span>
              <span class="text-[10px] text-sogan-400 font-mono">${pKerja.namaTempat || '-'}</span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Ngajeng Kantor:</label>
                <select id="pal_kerja_depan_desa" onchange="window.updatePalenggahanInteractive('kerja')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pKerja.aksaraFirstTempat)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Pungkasan Kantor:</label>
                <select id="pal_kerja_belakang_desa" onchange="window.updatePalenggahanInteractive('kerja')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pKerja.aksaraLastTempat)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Ngajeng Nama:</label>
                <select id="pal_kerja_depan_orang" onchange="window.updatePalenggahanInteractive('kerja')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pKerja.aksaraFirstOrang)}
                </select>
              </div>
              <div>
                <label class="block text-sogan-400 font-medium mb-1">Aksara Pungkasan Nama:</label>
                <select id="pal_kerja_belakang_orang" onchange="window.updatePalenggahanInteractive('kerja')" class="w-full bg-sogan-950 border border-sogan-700 rounded-lg p-1.5 text-sogan-100 text-xs focus:border-prada outline-none">
                  ${buildAksaraSelectOptions(pKerja.aksaraLastOrang)}
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] p-2 rounded-lg bg-sogan-950/80 border border-sogan-800 font-mono text-sogan-300">
              <span id="pal_kerja_formula">Total: <strong>${pKerja.totalNeptu}</strong></span>
              <span id="pal_kerja_modulo" class="text-prada">Modulo 5 &rarr; Sisa ${pKerja.noPalenggahan}</span>
            </div>
          </div>

          <div id="pal_kerja_surasa_card" class="p-3 rounded-lg ${isKerjaBecik ? 'bg-blue-950/30 border border-blue-800/60' : 'bg-amber-950/30 border border-amber-800/60'} space-y-1 transition-all duration-300">
            <div class="flex items-center justify-between">
              <span id="pal_kerja_surasa_title" class="text-[10px] uppercase font-bold ${isKerjaBecik ? 'text-blue-300' : 'text-amber-300'}">
                Surasa #${pKerja.noPalenggahan}: ${pKerja.palenggahan?.surasa || '-'}
              </span>
              <span id="pal_kerja_surasa_badge" class="px-2 py-0.5 rounded text-[9px] font-bold ${isKerjaBecik ? 'bg-blue-900/50 text-blue-200' : 'bg-amber-900/50 text-amber-200'}">
                ${isKerjaBecik ? 'Kajen Kelingan' : 'Prihatin'}
              </span>
            </div>
            <p id="pal_kerja_surasa_desc" class="text-[11px] text-sogan-200 leading-relaxed">${pKerja.palenggahan?.tegese || '-'}</p>
          </div>
        </div>
      </div>

      <!-- Panduan 5 Surasa Palenggahan -->
      <div class="p-3 bg-sogan-950/60 rounded-xl border border-sogan-800/80 text-[11px] text-sogan-300">
        <strong class="text-prada block mb-1 uppercase text-[10px]">Paugeran 5 Surasa Palenggahan:</strong>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[10.5px]">
          <div class="p-1.5 rounded bg-keraton border border-sogan-900"><strong class="text-amber-300">1. Sonya:</strong> Sepi, prihatin, butuh ketenangan batin.</div>
          <div class="p-1.5 rounded bg-keraton border border-sogan-900"><strong class="text-amber-300">2. Agotho:</strong> Asring owah gingsir, perlu adaptasi ageng.</div>
          <div class="p-1.5 rounded bg-keraton border border-emerald-900/40"><strong class="text-emerald-300">3. Gedhong:</strong> Kajen kelingan, rezeki kumpul, becik.</div>
          <div class="p-1.5 rounded bg-keraton border border-emerald-900/40"><strong class="text-emerald-300">4. Pandhita:</strong> Diurmati dening masyarakat, dados panutan.</div>
          <div class="p-1.5 rounded bg-keraton border border-emerald-900/40"><strong class="text-emerald-300">5. Ratu:</strong> Kawibawan luhur, kamulyan, tentrem rahayu.</div>
        </div>
      </div>
    </div>
  `;
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

// ─── TAHAP 3.3: EKSPOR LAPORAN NUJUM LENGKAP & RINGKAS (PDF / CETAK) ────────

/**
 * 1. MODE LENGKAP (Arsip Formal 9 Bagian — Standar Rado Aditya Sejati)
 * Memuat 9 bagian utuh: Identitas, Ensiklopedia Pawukon, 6 Dimensi Bincil,
 * Pranata Mangsa & Zodiak/Shio, Ageman, Karakter Kelahiran, Sirikan Adhep & Palenggahan,
 * Faalakiah Asma, serta Siklus Tahunan.
 */
export function renderLaporanNujumLengkapPrintHtml(d) {
  const nama = (d.nama && d.nama !== '-') ? d.nama.toUpperCase() : 'SUBJEK PETUNGAN';
  const tglFormatted = `${d.d} ${BULAN_MASEHI[d.m - 1] || ''} ${d.y} M`;
  const dino = d.dino || '-';
  const pas = d.pas || '-';
  const neptu = d.neptu || 0;
  const wukuName = d.wukuName || '-';
  const wukuNo = d.wukuNo || '-';
  const umur = d.umur ?? 0;
  const tahunHitung = d.tahunHitung || new Date().getFullYear();
  const alamatTinggal = d.alamatTinggal || '-';
  const alamatKerja = d.alamatKerja || '-';
  const tglJawa = d.tglJawaRes || {};
  const sasiJawa = d.sasiJawaRes || {};
  const pwk = d.pwk || {};
  const aseso = d.aseso || {};
  const pad = d.nujumRes?.padewan || { sisa: '-', nama: '-', arti: '-' };
  const prk = d.nujumRes?.paringkelan || { sisa: '-', nama: '-', arti: '-' };
  const pan = d.nujumRes?.pandangon || { sisa: '-', nama: '-', arti: '-' };
  const paa = d.nujumRes?.paarasan || { sisa: '-', nama: '-', arti: '-' };
  const pcs = d.nujumRes?.pancasuda || { sisa: '-', nama: '-', arti: '-' };
  const kam = d.nujumRes?.kamarokan || { sisa: '-', nama: '-', arti: '-' };
  const mangsaRes = d.mangsaRes || {};
  const zodiakRes = d.zodiakRes || {};
  const shioLahir = d.shioLahirRes || {};
  const karakterRes = d.karakterRes || {};
  const watakDinaRes = d.watakDinaRes || {};
  const watakPasaranRes = d.watakPasaranRes || {};
  const sirikanRes = d.sirikanRes || {};
  const palenggahanRes = d.palenggahanRes || {};
  const pedamelanRes = d.pedamelanRes || {};
  const faal = d.faal || { nabi: '-', sum: 0, kode: 0, desc: '-', aksaraStr: '-' };
  const aksaraJawa = d.aksaraJawa || faal.aksaraStr || '-';
  const fnSiklus = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (typeof window !== 'undefined' && window.hitungSiklusTahunan ? window.hitungSiklusTahunan : null);
  const siklusTahunanRes = d.siklusTahunanRes || (fnSiklus ? fnSiklus(umur) : null);
  const isPalTinggalBecik = (palenggahanRes?.noPalenggahan || 0) >= 3;
  const isPalKerjaBecik = (pedamelanRes?.noPalenggahan || 0) >= 3;

  return `
    <div class="print-report-wrapper">
      <div class="print-watermark print-doc-watermark watermark-print">Aether Code</div>

      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- KOP DOKUMEN RESMI (ARSIP FORMAL GAYA RADO ADITYA SEJATI) -->
        <div class="doc-header-kop mb-2 border-b-2 border-black pb-1.5 flex justify-between items-end">
          <div>
            <div style="font-size: 14pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.15em;">JAGAD JAWA</div>
            <div style="font-size: 11pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 2px 0;">LAPORAN PETUNG NUJUM KEPRIBADIAN (MODE LENGKAP)</div>
            <div style="font-size: 7.5pt; font-style: italic;">Transkripsi Petungan Pawukon, 6 Dimensi Bincil, Faalakiah, Palenggahan &amp; Karakter Kelahiran Kasultanan &amp; Karaton</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 8pt; font-weight: bold;">ARSIP FORMAL PENELITIAN</div>
            <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Archival Standard</div>
          </div>
        </div>

        <!-- BAGIAN 1: PERANGAN PETUNG & IDENTITAS -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 1: PERANGAN PETUNG &amp; IDENTITAS</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Subjek</td>
                <td style="width: 28%;"><strong>${nama}</strong></td>
                <td class="doc-label-cell">Tanggal Lahir (Masehi)</td>
                <td style="width: 28%;">${tglFormatted}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Weton (Dina &amp; Pasaran)</td>
                <td><strong>${dino} ${pas}</strong> (Neptu: ${neptu})</td>
                <td class="doc-label-cell">Tanggal Jawa &amp; Sasi</td>
                <td><strong>${tglJawa?.shortStr || tglJawa?.fullStr || '-'}</strong> (${sasiJawa?.sasi && sasiJawa.sasi !== '-' ? sasiJawa.sasi + ' / ' + sasiJawa.padanan : (tglJawa?.namaWindu ? 'Windu ' + tglJawa.namaWindu : '-')})</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Wuku Kelahiran</td>
                <td>${wukuName} (Wuku Ke-${wukuNo})</td>
                <td class="doc-label-cell">Usia &amp; Tahun Hitung</td>
                <td>${umur} Tahun (Tahun Hitung: ${tahunHitung} M)</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Alamat Tinggal (Kelurahan)</td>
                <td>${alamatTinggal}</td>
                <td class="doc-label-cell">Alamat Tempat Kerja (Kelurahan)</td>
                <td>${alamatKerja}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 2: ENSIKLOPEDIA PAWUKON -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 2: ENSIKLOPEDIA PAWUKON</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Wuku &amp; Dewa</td>
                <td colspan="3"><strong>Wuku ${pwk?.nama_wuku || wukuName} (${pwk?.no_wuku || wukuNo})</strong> &mdash; Dewane: <strong>${pwk?.dewane || '-'}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Budi Pangerti</td>
                <td colspan="3">${pwk?.watek_budi_pangerti || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Bilahi &amp; Bebaya (Pantangan)</td>
                <td colspan="3">${pwk?.bilahi_bebaya || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pangupaya Jiwa (Kiprah Usaha)</td>
                <td colspan="3">${pwk?.pangupaya_jiwa || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Potensi Lelaran &amp; Usada</td>
                <td colspan="3">
                  <strong>Potensi Lelaran:</strong> ${aseso?.lelara || '-'}<br/>
                  <strong>Tamba Yen Lara (Usada Wuku):</strong> <em>${pwk?.tamba_yen_lara || '-'}</em>
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Ruwatan &amp; Donga Slamet</td>
                <td colspan="3">
                  <strong>Donga:</strong> ${pwk?.donga_slamet || '-'} &middot; 
                  <strong>Sesaji:</strong> ${pwk?.sesaji_ruwat || '-'} &middot; 
                  <strong>Tindih:</strong> ${pwk?.tindih_ruwat || '-'}<br/>
                  <strong>Sega &amp; Iwak Selamatan:</strong> ${(pwk?.selamatan_sega && pwk?.selamatan_iwak) ? pwk.selamatan_sega + ' & ' + pwk.selamatan_iwak : (pwk?.selamatan_sega || '-')} &middot; 
                  <strong>Salawat:</strong> ${pwk?.salawat || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 3: BINCIL & PETUNGAN 6 DIMENSI -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 3: BINCIL &amp; PETUNGAN 6 DIMENSI</div>
          <table class="doc-table">
            <thead>
              <tr>
                <th style="width: 22%;">Dimensi Bincil</th>
                <th style="width: 14%;">Siklus</th>
                <th style="width: 24%;">Hasil &amp; Simbol</th>
                <th>Makna &amp; Surasa Petungan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Padewan</strong></td>
                <td>Siklus 8</td>
                <td>Dewa ${pad.sisa}: <strong>${pad.nama}</strong></td>
                <td>${pad.arti}</td>
              </tr>
              <tr>
                <td><strong>Paringkelan</strong></td>
                <td>Siklus 6</td>
                <td>Ringkel ${prk.sisa}: <strong>${prk.nama}</strong></td>
                <td>${prk.arti}</td>
              </tr>
              <tr>
                <td><strong>Pandangon</strong></td>
                <td>Siklus 9</td>
                <td>Dina ${pan.sisa}: <strong>${pan.nama}</strong></td>
                <td>${pan.arti}</td>
              </tr>
              <tr>
                <td><strong>Paarasan</strong></td>
                <td>Siklus 8</td>
                <td>Laku ${paa.sisa}: <strong>${paa.nama}</strong></td>
                <td>${paa.arti}</td>
              </tr>
              <tr>
                <td><strong>Pancasuda</strong></td>
                <td>Siklus 7</td>
                <td>Suda ${pcs.sisa}: <strong>${pcs.nama}</strong></td>
                <td>${pcs.arti}</td>
              </tr>
              <tr>
                <td><strong>Kamarokan</strong></td>
                <td>Siklus 2</td>
                <td>Rupa ${kam.sisa}: <strong>${kam.nama}</strong></td>
                <td>${kam.arti}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 4: PRANATA MANGSA & ZODIAK SURYA -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 4: PRANATA MANGSA &amp; ZODIAK SURYA</div>
          <table class="doc-table mb-1">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">A. Pranata Mangsa (Kosmologi Iklim &amp; Karakter Jawa)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Mangsa &amp; Rentang</td>
                <td style="width: 28%;"><strong>${mangsaRes?.nama || '-'}</strong></td>
                <td class="doc-label-cell">Rentang Waktu</td>
                <td style="width: 28%;">${mangsaRes?.rentang || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Candrasangkala</td>
                <td colspan="3"><em>&ldquo;${mangsaRes?.candrasangkala || '-'}&rdquo;</em></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak &amp; Candra Mangsa</td>
                <td colspan="3">${mangsaRes?.watak || '-'}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table mb-1">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">B. Zodiak Surya (Horoskop Falakiah Barat/Global)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Zodiak &amp; Elemen</td>
                <td style="width: 28%;"><strong>${zodiakRes?.nama || '-'}</strong> (${zodiakRes?.elemen || '-'})</td>
                <td class="doc-label-cell">Rentang Bintang</td>
                <td style="width: 28%;">${zodiakRes?.rentang || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Dasar</td>
                <td colspan="3">${zodiakRes?.watak || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Peruntungan &amp; Resiko</td>
                <td colspan="3">
                  <strong>Peruntungan:</strong> ${zodiakRes?.peruntungan || '-'} &nbsp;|&nbsp; 
                  <strong>Resiko:</strong> ${zodiakRes?.resiko || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Jodoh &amp; Karir Cocok</td>
                <td colspan="3">
                  <strong>Jodoh Serasi:</strong> ${zodiakRes?.jodoh || '-'} &nbsp;|&nbsp; 
                  <strong>Rekomendasi Karir:</strong> ${zodiakRes?.karir || '-'}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">C. Shio Kelahiran &amp; Teori 5 Elemen (Wu Xing)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Shio &amp; Elemen Tahun Lahir</td>
                <td style="width: 28%;"><strong>Shio ${shioLahir?.shio || '-'}</strong> (${shioLahir?.elemenTahun || '-'})</td>
                <td class="doc-label-cell">Elemen Tetap Shio</td>
                <td style="width: 28%;">${shioLahir?.elemenTetap || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Karakteristik Elemen</td>
                <td colspan="3">${shioLahir?.sifatElemen || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Sifat Dasar &amp; Karir</td>
                <td colspan="3">
                  <strong>Sifat Dasar:</strong> ${shioLahir?.detail?.sifatDasar || '-'} &nbsp;|&nbsp; 
                  <strong>Karir:</strong> ${shioLahir?.detail?.karir || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Jodoh &amp; Pantangan</td>
                <td colspan="3">
                  <strong>Jodoh Selaras:</strong> ${shioLahir?.detail?.jodoh || '-'} &nbsp;|&nbsp; 
                  <strong>Pantangan:</strong> ${shioLahir?.detail?.pantangan || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 5: ASESORIS & AGEMAN -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 5: ASESORIS &amp; AGEMAN</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Dino Becik (Hari Baik)</td>
                <td style="width: 28%;">${aseso?.dino || '-'}</td>
                <td class="doc-label-cell">Watu Mulia (Batu Permata)</td>
                <td style="width: 28%;">${aseso?.watu || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Warna Ageman (Pakaian)</td>
                <td>${aseso?.warna || '-'}</td>
                <td class="doc-label-cell">Kembang Pengasihan</td>
                <td>${aseso?.kembang || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 6: KARAKTER DASAR & WATAK LAHIR -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 6: KARAKTER DASAR &amp; WATAK LAHIR</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Karakter Dasar (Tgl Masehi)</td>
                <td colspan="3">
                  <strong>${karakterRes?.data ? 'Tipe #' + karakterRes.noKarakter + ': ' + (karakterRes.data.tipe || karakterRes.data.tipe_karakter || '-') : (d.kd?.tipe ? d.kd.tipe : '-')}</strong><br/>
                  <strong>Ringkasan Karakter:</strong> ${karakterRes?.data ? (karakterRes.data.ringkasan || karakterRes.data.deskripsi_karakter || '-') : (d.kd?.ringkasan || '-')}<br/>
                  ${karakterRes?.data?.kekuatan ? `<strong>Kekuatan &amp; Potensi:</strong> ${karakterRes.data.kekuatan}<br/>` : ''}
                  ${karakterRes?.data?.kelemahan ? `<strong>Kelemahan &amp; Titik Kritis:</strong> ${karakterRes.data.kelemahan} &nbsp;|&nbsp; <strong>Kunci Pendekatan:</strong> ${karakterRes.data.negosiasi || '-'}<br/>` : ''}
                  ${karakterRes?.data?.sikap ? `<strong>Sikap yang Harus Dibangun:</strong> ${karakterRes.data.sikap} &nbsp;|&nbsp; <strong>Motto:</strong> <em>&ldquo;${karakterRes.data.motto || '-'}&rdquo;</em><br/>` : ''}
                  <strong>Profesi Cocok:</strong> ${karakterRes?.data ? (karakterRes.data.profesi || karakterRes.data.rekomendasi_profesi || '-') : (d.kd?.profesi || '-')}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Dina (${dino})</td>
                <td colspan="3">
                  <strong>Lambang:</strong> ${watakDinaRes?.lambang || '-'} &middot; 
                  <strong>Watak Utama:</strong> ${watakDinaRes?.watak_utama || '-'}<br/>
                  <strong>Deskripsi:</strong> ${watakDinaRes?.deskripsi || '-'}<br/>
                  <strong>Rekomendasi Profesi:</strong> ${watakDinaRes?.rekomendasi_profesi || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Pasaran (${pas})</td>
                <td colspan="3">
                  <strong>Lambang:</strong> ${watakPasaranRes?.lambang || '-'} &middot; 
                  <strong>Watak Utama:</strong> ${watakPasaranRes?.watak_utama || '-'}<br/>
                  <strong>Deskripsi:</strong> ${watakPasaranRes?.deskripsi || '-'}<br/>
                  <strong>Rekomendasi Profesi:</strong> ${watakPasaranRes?.rekomendasi_profesi || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 7: SIRIKAN ADHEP & KEDUDUKAN TEMPAT (PALENGGAHAN & PEDAMELAN) -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 7: SIRIKAN ADHEP &amp; KEDUDUKAN TEMPAT (PALENGGAHAN &amp; PEDAMELAN)</div>
          <table class="doc-table mb-1">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">A. Analisis Sirikan Adhep Omah (Pantangan Arah Hadap Rumah)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Berdasarkan Neptu (${sirikanRes?.neptu?.neptu || neptu})</td>
                <td colspan="3">
                  <strong>Pantangan:</strong> ${sirikanRes?.neptu?.pantangan || '-'} &middot; 
                  <strong>Anjuran:</strong> ${sirikanRes?.neptu?.anjuran || '-'} &middot; 
                  <em>${sirikanRes?.neptu?.keterangan || '-'}</em>
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Berdasarkan Hari (${sirikanRes?.dina?.hari || dino})</td>
                <td colspan="3">
                  <strong>Pantangan:</strong> ${sirikanRes?.dina?.pantangan || '-'} &middot; 
                  <strong>Anjuran:</strong> ${sirikanRes?.dina?.anjuran || '-'} &middot; 
                  <em>${sirikanRes?.dina?.keterangan || '-'}</em>
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kesimpulan Arah</td>
                <td colspan="3">
                  <strong>Arah Pantangan:</strong> ${sirikanRes?.pantanganText || (Array.isArray(sirikanRes?.pantanganCombined) ? sirikanRes.pantanganCombined.join(' & ') : '-')} &nbsp;|&nbsp; 
                  <strong>Arah Utama Aman / Dianjurkan:</strong> ${sirikanRes?.arahAmanText || (Array.isArray(sirikanRes?.arahAman) ? sirikanRes.arahAman.join(' & ') : '-')}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">B. Analisis Kedudukan Tempat (Palenggahan &amp; Pedamelan)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Palenggahan (Tinggal)</td>
                <td colspan="3">
                  <strong>Alamat:</strong> ${palenggahanRes?.namaTempat || alamatTinggal}<br/>
                  <strong>Perhitungan:</strong> Total ${palenggahanRes?.totalNeptu || 0} % 5 = Sisa ${palenggahanRes?.noPalenggahan || 0} &nbsp;|&nbsp; 
                  <strong>Surasa:</strong> <strong>${palenggahanRes?.palenggahan?.surasa || '-'}</strong> (${isPalTinggalBecik ? 'Kajen Kelingan / Becik' : 'Prihatin / Rekasa'})<br/>
                  <strong>Makna:</strong> ${palenggahanRes?.palenggahan?.tegese || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pedamelan (Kerja)</td>
                <td colspan="3">
                  <strong>Alamat:</strong> ${pedamelanRes?.namaTempat || alamatKerja}<br/>
                  <strong>Perhitungan:</strong> Total ${pedamelanRes?.totalNeptu || 0} % 5 = Sisa ${pedamelanRes?.noPalenggahan || 0} &nbsp;|&nbsp; 
                  <strong>Surasa:</strong> <strong>${pedamelanRes?.palenggahan?.surasa || '-'}</strong> (${isPalKerjaBecik ? 'Kajen Kelingan / Becik' : 'Prihatin / Rekasa'})<br/>
                  <strong>Makna:</strong> ${pedamelanRes?.palenggahan?.tegese || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 8: FAALAKIAH ASMA -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 8: FAALAKIAH ASMA</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Latin</td>
                <td style="width: 28%;"><strong>${nama}</strong></td>
                <td class="doc-label-cell">Aksara Jawa</td>
                <td style="width: 28%; font-family: 'Noto Sans Javanese', serif; font-size: 11pt;"><span>${aksaraJawa}</span></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Nilai &amp; Sisa Kode</td>
                <td>Jumlah: ${faal?.sum || 0} &rarr; Sisa (Kode): ${faal?.kode || 0}</td>
                <td class="doc-label-cell">Tokoh Perlindungan (Nabi)</td>
                <td><strong>${faal?.nabi || '-'}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Katerangan, Pitutur &amp; Dzikir</td>
                <td colspan="3"><span>${faal?.desc || '-'}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 9: SIKLUS TAHUNAN (PADEWAN & SHIO BERDASARKAN USIA) -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 9: SIKLUS TAHUNAN (PADEWAN &amp; SHIO BERDASARKAN USIA)</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Parameter Usia</td>
                <td style="width: 28%;">${umur} Tahun (Tahun Hitung: ${tahunHitung} M)</td>
                <td class="doc-label-cell">Modulo 12</td>
                <td style="width: 28%;">${umur} % 12 = Sisa ${siklusTahunanRes ? siklusTahunanRes.siklusNo : (umur % 12 === 0 ? 12 : umur % 12)} (Siklus Ke-${siklusTahunanRes ? siklusTahunanRes.siklusNo : (umur % 12 === 0 ? 12 : umur % 12)})</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Siklus Shio Tahunan</td>
                <td colspan="3">
                  <strong>Shio ${siklusTahunanRes?.shio?.shio || '-'}</strong>: ${siklusTahunanRes?.shio?.tegese || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Dewa Pelindung Siklus</td>
                <td colspan="3"><strong>${siklusTahunanRes?.padewan?.dewa || '-'} (${siklusTahunanRes?.padewan?.nama || '-'})</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Siklus Usia</td>
                <td colspan="3">${siklusTahunanRes?.padewan?.watak || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Karier &amp; Wiraswasta</td>
                <td colspan="3">${siklusTahunanRes?.padewan?.karier || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kelemahan &amp; Bahaya</td>
                <td colspan="3">
                  <strong>Kelemahan:</strong> ${siklusTahunanRes?.padewan?.kelemahan || '-'} &nbsp;|&nbsp; 
                  <strong>Bahaya:</strong> ${siklusTahunanRes?.padewan?.bahaya || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kesehatan &amp; Rumah Tangga</td>
                <td colspan="3">
                  <strong>Kesehatan:</strong> ${siklusTahunanRes?.padewan?.kesehatan || '-'} &nbsp;|&nbsp; 
                  <strong>Rumah Tangga:</strong> ${siklusTahunanRes?.padewan?.keluarga || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Ikhtiar &amp; Solusi</td>
                <td colspan="3"><em>${siklusTahunanRes?.padewan?.solusi || '-'}</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- KOLOFON & PENGESAHAN DOKUMEN -->
        <div class="doc-colophon" style="margin-top: 14px; page-break-inside: avoid; break-inside: avoid;">
          <table style="width: 100%; border: none; border-collapse: collapse; font-size: 8pt;">
            <tbody>
              <tr>
                <td style="width: 55%; border: none; vertical-align: top; padding: 4px 6px;">
                  <p style="margin: 0; font-weight: bold;">Catatan Panaliten:</p>
                  <p style="margin: 2px 0 0 0; font-style: italic; font-size: 7.5pt; line-height: 1.35;">
                    Laporan petung punika minangka piwulang luhur kanggé tepa slira, nuntun mawas dhiri, saha mbudidaya ikhtiar lahir batin nggayuh karaharjaning gesang. Kaarsipaken adhedhasar paugeran Primbon Kasultanan Ngayogyakarta saha Karaton Surakarta Hadiningrat.
                  </p>
                </td>
                <td style="width: 45%; border: none; vertical-align: top; text-align: right; padding: 4px 6px;">
                  <p style="margin: 0;">Surakarta &middot; Ngayogyakarta Hadiningrat</p>
                  <p style="margin: 2px 0 0 0; font-weight: bold;">Peneliti Petung Jawa &middot; Jagad Jawa</p>
                  <div style="height: 36px;"></div>
                  <p style="margin: 0; text-decoration: underline; font-weight: bold;">JAGAD JAWA ARCHIVAL RESEARCH</p>
                  <p style="margin: 1px 0 0 0; font-size: 7pt; font-family: monospace;">Aether Code Certified Standard</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE FOOTER -->
        <div class="page-inner-footer" style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>${nama} &middot; Dokumen Penelitian Petungan Jawa (Mode Lengkap)</span>
          <span>Serat Primbon Kasultanan &middot; Aether Code Archival</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 2. MODE RINGKAS (Ikhtisar Transkripsi Cepat — Standar Karolus Yohanes)
 * Memuat ringkasan padat weton, 6 dimensi bincil, faalakiah, sirikan, pakarti & siklus.
 */
export function renderLaporanNujumRingkasPrintHtml(d) {
  const nama = (d.nama && d.nama !== '-') ? d.nama.toUpperCase() : 'SUBJEK PETUNGAN';
  const tglFormatted = `${d.d} ${BULAN_MASEHI[d.m - 1] || ''} ${d.y} M`;
  const dino = d.dino || '-';
  const pas = d.pas || '-';
  const neptu = d.neptu || 0;
  const wukuName = d.wukuName || '-';
  const wukuNo = d.wukuNo || '-';
  const umur = d.umur ?? 0;
  const tahunHitung = d.tahunHitung || new Date().getFullYear();
  const tglJawa = d.tglJawaRes || {};
  const faal = d.faal || { nabi: '-', sum: 0, kode: 0, desc: '-', aksaraStr: '-' };
  const kd = d.kd || {};
  const pad = d.nujumRes?.padewan || { sisa: '-', nama: '-', arti: '-' };
  const prk = d.nujumRes?.paringkelan || { sisa: '-', nama: '-', arti: '-' };
  const pan = d.nujumRes?.pandangon || { sisa: '-', nama: '-', arti: '-' };
  const paa = d.nujumRes?.paarasan || { sisa: '-', nama: '-', arti: '-' };
  const pcs = d.nujumRes?.pancasuda || { sisa: '-', nama: '-', arti: '-' };
  const kam = d.nujumRes?.kamarokan || { sisa: '-', nama: '-', arti: '-' };
  const sirikanRes = d.sirikanRes || {};
  const pekerjaanRes = d.pekerjaanRes || {};
  const mangsaRes = d.mangsaRes || {};
  const shioLahirRes = d.shioLahirRes || {};
  const neptuVal = (typeof sirikanRes?.neptu === 'object' && sirikanRes?.neptu !== null)
    ? (sirikanRes.neptu.neptu ?? sirikanRes.neptu.toString())
    : (sirikanRes?.neptu || neptu);

  return `
    <div class="print-report-wrapper">
      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- KOP DOKUMEN RINGKAS (GAYA TRANSKRIPSI KAROLUS YOHANES) -->
        <div class="doc-header-kop mb-2 border-b-2 border-black pb-1.5 flex justify-between items-end">
          <div>
            <div style="font-size: 13pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 1px 0; letter-spacing: 0.12em;">JAGAD JAWA</div>
            <div style="font-size: 10pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 1px 0;">TRANSKRIPSI IKHTISAR PRIMBON &amp; NUJUM PRIBADI</div>
            <div style="font-size: 7.5pt; font-style: italic;">Ringkasan Inti Weton, 6 Dimensi Bincil, Faalakiah Asma &amp; Karakter Kelahiran</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 8pt; font-weight: bold;">TRANSKRIPSI CEPAT</div>
            <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Certified</div>
          </div>
        </div>

        <!-- BIODATA UTAMA & WETON -->
        <div class="doc-section-block">
          <div class="doc-section-title">1. IDENTITAS &amp; WEKTU LAHIR</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Subjek</td>
                <td style="width: 28%;"><strong>${nama}</strong></td>
                <td class="doc-label-cell">Tanggal Lahir (Masehi)</td>
                <td style="width: 28%;">${tglFormatted}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Weton &amp; Neptu</td>
                <td><strong>${dino} ${pas}</strong> (Neptu: ${neptu})</td>
                <td class="doc-label-cell">Tanggal Jawa &amp; Wuku</td>
                <td><strong>${tglJawa?.shortStr || '-'}</strong> &middot; Wuku: ${wukuName} (${wukuNo}/30)</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Tipe Karakter Masehi</td>
                <td colspan="3"><strong>${kd?.tipe || '-'}</strong> &mdash; ${kd?.ringkasan || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 6 DIMENSI BINCIL JAWA -->
        <div class="doc-section-block">
          <div class="doc-section-title">2. ENEM DIMENSI BINCIL JAWA</div>
          <table class="doc-table">
            <thead>
              <tr>
                <th style="width: 22%;">Dimensi</th>
                <th style="width: 28%;">Nama Lambang</th>
                <th>Makna &amp; Keterangan Surasa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Padewan</strong> (Siklus 8)</td>
                <td>Dewa ${pad.sisa}: <strong>${pad.nama}</strong></td>
                <td>${pad.arti}</td>
              </tr>
              <tr>
                <td><strong>2. Paringkelan</strong> (Siklus 6)</td>
                <td>Ringkel ${prk.sisa}: <strong>${prk.nama}</strong></td>
                <td>${prk.arti}</td>
              </tr>
              <tr>
                <td><strong>3. Pandangon</strong> (Siklus 9)</td>
                <td>Dina ${pan.sisa}: <strong>${pan.nama}</strong></td>
                <td>${pan.arti}</td>
              </tr>
              <tr>
                <td><strong>4. Paarasan</strong> (Siklus 8)</td>
                <td>Laku ${paa.sisa}: <strong>${paa.nama}</strong></td>
                <td>${paa.arti}</td>
              </tr>
              <tr>
                <td><strong>5. Pancasuda</strong> (Siklus 7)</td>
                <td>Suda ${pcs.sisa}: <strong>${pcs.nama}</strong></td>
                <td>${pcs.arti}</td>
              </tr>
              <tr>
                <td><strong>6. Kamarokan</strong> (Siklus 2)</td>
                <td>Rupa ${kam.sisa}: <strong>${kam.nama}</strong></td>
                <td>${kam.arti}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- FAALAKIAH ASMA & NABI -->
        <div class="doc-section-block">
          <div class="doc-section-title">3. FAALAKIAH ASMA 12 NABI &amp; TOLAK BALAK</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Teladan Nabi &amp; Aksara</td>
                <td style="width: 35%;"><strong>${faal.nabi}</strong> (Nilai: ${faal.sum} &rarr; Sisa: ${faal.kode})</td>
                <td class="doc-label-cell">Aksara Jawa</td>
                <td><span style="font-family: 'Noto Sans Javanese', serif; font-size: 10pt;">${faal.aksaraStr || '-'}</span></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Petunjuk &amp; Nasihat Dzikir</td>
                <td colspan="3">${faal.desc}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SIRIKAN ADHEP OMAH -->
        <div class="doc-section-block">
          <div class="doc-section-title">4. PAUGERAN GRIYA: SIRIKAN ADHEP OMAH</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Sirikan Neptu (${neptuVal})</td>
                <td style="width: 30%;"><strong>${sirikanRes?.neptu?.pantangan || sirikanRes?.sirikanNeptu || '-'}</strong></td>
                <td class="doc-label-cell">Sirikan Dina (${dino})</td>
                <td><strong>${sirikanRes?.dina?.pantangan || sirikanRes?.sirikanDina || '-'}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kesimpulan Arah</td>
                <td colspan="3">
                  <strong>Arah Pantangan:</strong> ${sirikanRes?.pantanganText || (Array.isArray(sirikanRes?.pantanganCombined) ? sirikanRes.pantanganCombined.join(' & ') : '-')} &nbsp;|&nbsp; 
                  <strong>Arah Utama Aman / Dianjurkan:</strong> ${sirikanRes?.arahAmanText || (Array.isArray(sirikanRes?.arahAman) ? sirikanRes.arahAman.join(' & ') : '-')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAKARTI REJEKI & SIKLUS TAHUNAN -->
        <div class="doc-section-block">
          <div class="doc-section-title">5. PAKARTI REJEKI &amp; SIKLUS TAHUNAN</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Pakarti Rejeki</td>
                <td style="width: 35%;"><strong>${pekerjaanRes?.pakarti_rejeki || '-'}</strong> (${pekerjaanRes?.arti_rejeki || '-'})</td>
                <td class="doc-label-cell">Pakaryan (Bidang Usaha)</td>
                <td>${pekerjaanRes?.pakaryan || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Siklus Usia ${umur} Th</td>
                <td colspan="3">
                  Siklus Ke-${umur % 12 === 0 ? 12 : (umur % 12)} / 12 (Tahun Hitung: ${tahunHitung} M)
                  ${shioLahirRes?.shio ? `&middot; <strong>Shio:</strong> ${shioLahirRes.shio} (${shioLahirRes.elemenTahun})` : ''}
                  ${mangsaRes?.nama ? `&middot; <strong>Pranata Mangsa:</strong> ${mangsaRes.nama} (<em>&ldquo;${mangsaRes.candrasangkala}&rdquo;</em>)` : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DISCLAIMER ETIS & PENGESAHAN RINGKAS -->
        <div class="doc-colophon" style="margin-top: 10px; page-break-inside: avoid; break-inside: avoid;">
          <table style="width: 100%; border: none; border-collapse: collapse; font-size: 7.5pt;">
            <tbody>
              <tr>
                <td style="width: 60%; border: none; vertical-align: top; padding: 2px 4px;">
                  <p style="margin: 0; font-style: italic; line-height: 1.35;">
                    <strong>Paweling Budaya:</strong> ${DISCLAIMER_ETIS_KULTURAL}
                  </p>
                </td>
                <td style="width: 40%; border: none; vertical-align: top; text-align: right; padding: 2px 4px;">
                  <p style="margin: 0; font-weight: bold;">JAGAD JAWA &middot; TRANSKRIPSI RESMI</p>
                  <div style="height: 20px;"></div>
                  <p style="margin: 0; font-family: monospace; font-size: 7pt;">Aether Code Certified &bull; Ikhtisar Cepat</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE FOOTER -->
        <div class="page-inner-footer" style="margin-top: 8px; display: flex; justify-content: space-between; font-size: 7pt; border-top: 0.5pt solid currentColor; padding-top: 1mm;">
          <span>${nama} &middot; Transkripsi Ringkas Primbon Nujum Pribadi</span>
          <span>Jagad Jawa Archival &middot; www.jagad-jawa.web.app</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Universal print HTML renderer (mendukung mode 'lengkap' atau 'ringkas')
 */
export function renderLaporanNujumPrintHtml(d, mode = 'lengkap') {
  return (mode === 'ringkas')
    ? renderLaporanNujumRingkasPrintHtml(d)
    : renderLaporanNujumLengkapPrintHtml(d);
}

/**
 * Eksekutor Cetak Laporan Nujum Pribadi
 * @param {'monochrome'|'parchment'} theme 
 * @param {'lengkap'|'ringkas'} mode 
 */
export function printLaporanNujum(theme = 'monochrome', mode = 'lengkap') {
  if (!lastCalculatedData) {
    let tglVal = document.getElementById('tglLahirKepribadian')?.value;
    if (!tglVal) {
      const today = new Date();
      tglVal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const inp = document.getElementById('tglLahirKepribadian');
      if (inp) inp.value = tglVal;
    }
    hitungKepribadianLengkap();
  }

  if (!lastCalculatedData) {
    showToast('Hitung nujum terlebih dahulu sebelum mencetak.');
    return;
  }

  const printDocHtml = (mode === 'ringkas')
    ? renderLaporanNujumRingkasPrintHtml(lastCalculatedData)
    : renderLaporanNujumLengkapPrintHtml(lastCalculatedData);

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const modeLabel = (mode === 'ringkas') ? 'Ikhtisar Ringkas' : 'Lengkap 9 Bagian';
  const customTitle = `Jagad Jawa — Nujum ${lastCalculatedData.nama || 'Pribadi'} (${modeLabel})`;
  if (typeof window.printLaporan === 'function' && window.printLaporan !== printLaporanNujum) {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}

export function printLaporanNujumLengkap(theme = 'monochrome') {
  return printLaporanNujum(theme, 'lengkap');
}

export function printLaporanNujumRingkas(theme = 'monochrome') {
  return printLaporanNujum(theme, 'ringkas');
}

// ─── WINDOW EXPOSURE UNTUK INLINE ONCLICK & LEGACY HANDLERS ─────────────────
if (typeof window !== 'undefined') {
  window.initTahunHitungSelect = initTahunHitungSelect;
  window.onTahunHitungChange = onTahunHitungChange;
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
