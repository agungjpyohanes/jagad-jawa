/**
 * Jagad Jawa — Modul Domain: Petung Ijab UI
 * Pengendali DOM untuk formulir Petung Ijab (Pernikahan Tradisi Jawa),
 * sinkronisasi penanggalan, dan visualisasi hasil budaya luhur.
 */

import { hitungPetungIjab } from './ijab-engine.js';
import {
  IJAB_WUKU,
  IJAB_SASI,
  IJAB_TAHUN_WINDU,
  IJAB_TANGGAL_JAWA,
  NEPTU_IJAB_DINA,
  NEPTU_IJAB_PASARAN
} from '../../data/ijab-db.js';
import { getTanggalJawaLengkap } from '../kalender/kalender-engine.js';
import { showToast } from '../../ui/toast.js';

const DINA_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN_LIST = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

/**
 * Inisialisasi komponen UI Petung Ijab
 */
export function initIjabUI() {
  populateSelects();
  setupEventListeners();

  // Set default ke hari ini
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateInput = document.getElementById('ijabDatePicker');
  if (dateInput && !dateInput.value) {
    dateInput.value = `${y}-${m}-${d}`;
    syncIjabDariTanggal();
  }
}

function populateSelects() {
  // Dina
  const selDina = document.getElementById('ijabSelDina');
  if (selDina && selDina.children.length <= 1) {
    selDina.innerHTML = DINA_LIST.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  // Pasaran
  const selPasaran = document.getElementById('ijabSelPasaran');
  if (selPasaran && selPasaran.children.length <= 1) {
    selPasaran.innerHTML = PASARAN_LIST.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  // Wuku
  const selWuku = document.getElementById('ijabSelWuku');
  if (selWuku && selWuku.children.length <= 1) {
    selWuku.innerHTML = IJAB_WUKU.map(w => `<option value="${w.wuku}">${w.id}. ${w.wuku} (${w.kanggo_ijab})</option>`).join('');
  }

  // Sasi
  const selSasi = document.getElementById('ijabSelSasi');
  if (selSasi && selSasi.children.length <= 1) {
    selSasi.innerHTML = '<option value="">-- Sedaya / Boten Dipunpilih --</option>' +
      IJAB_SASI.map(s => `<option value="${s.sasi_jawa}">${s.id}. ${s.sasi_jawa}</option>`).join('');
  }

  // Tahun Windu
  const selTahun = document.getElementById('ijabSelTahun');
  if (selTahun && selTahun.children.length <= 1) {
    selTahun.innerHTML = '<option value="">-- Sedaya / Boten Dipunpilih --</option>' +
      IJAB_TAHUN_WINDU.map(t => `<option value="${t.tahun_jawa}">${t.id}. Tahun ${t.tahun_jawa}</option>`).join('');
  }

  // Tanggal Jawa
  const selTglJawa = document.getElementById('ijabSelTglJawa');
  if (selTglJawa && selTglJawa.children.length <= 1) {
    selTglJawa.innerHTML = '<option value="">-- Sedaya / Boten Dipunpilih --</option>' +
      IJAB_TANGGAL_JAWA.map(t => `<option value="${t.tanggal_jawa}">Tanggal ${t.tanggal_jawa} (${t.tegese_status})</option>`).join('');
  }
}

function setupEventListeners() {
  const datePicker = document.getElementById('ijabDatePicker');
  if (datePicker) {
    datePicker.addEventListener('change', syncIjabDariTanggal);
  }

  const btnHitung = document.getElementById('btnHitungIjab');
  if (btnHitung) {
    btnHitung.addEventListener('click', () => hitungIjabDariUI(true));
  }

  const btnReset = document.getElementById('btnResetIjabToday');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      if (datePicker) datePicker.value = `${y}-${m}-${d}`;
      syncIjabDariTanggal();
      showToast('Tanggal kasinkronaken dhateng dinten punika.');
    });
  }

  // Listeners perubahan manual pada select
  ['ijabSelDina', 'ijabSelPasaran', 'ijabSelWuku', 'ijabSelSasi', 'ijabSelTahun', 'ijabSelTglJawa'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => hitungIjabDariUI(false));
    }
  });
}

/**
 * Sinkronkan nilai formulir dengan tanggal kalender Masehi
 */
export function syncIjabDariTanggal() {
  const dateInput = document.getElementById('ijabDatePicker');
  if (!dateInput || !dateInput.value) return;

  const [yy, mm, dd] = dateInput.value.split('-').map(Number);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return;

  try {
    const info = getTanggalJawaLengkap(yy, mm, dd);
    if (info) {
      const selDina = document.getElementById('ijabSelDina');
      const selPasaran = document.getElementById('ijabSelPasaran');
      const selWuku = document.getElementById('ijabSelWuku');
      const selSasi = document.getElementById('ijabSelSasi');
      const selTahun = document.getElementById('ijabSelTahun');
      const selTglJawa = document.getElementById('ijabSelTglJawa');

      if (selDina) selDina.value = info.dino;
      if (selPasaran) selPasaran.value = info.pas;
      if (selWuku) selWuku.value = info.wukuName;
      if (selSasi) selSasi.value = info.bulanJawa;
      if (selTahun) selTahun.value = info.tahunSiklus;
      if (selTglJawa) selTglJawa.value = info.tglJawa;

      hitungIjabDariUI(false);
    }
  } catch (err) {
    console.warn('Gagal sinkron tanggal Jawa untuk ijab:', err);
  }
}

/**
 * Baca input dan jalankan perhitungan Petung Ijab
 */
export function hitungIjabDariUI(showNotification = false) {
  const selDina = document.getElementById('ijabSelDina');
  const selPasaran = document.getElementById('ijabSelPasaran');
  const selWuku = document.getElementById('ijabSelWuku');
  const selSasi = document.getElementById('ijabSelSasi');
  const selTahun = document.getElementById('ijabSelTahun');
  const selTglJawa = document.getElementById('ijabSelTglJawa');

  const dina = selDina?.value;
  const pasaran = selPasaran?.value;
  const wuku = selWuku?.value || null;
  const sasi = selSasi?.value || null;
  const tahun = selTahun?.value || null;
  const tanggalJawa = selTglJawa?.value ? parseInt(selTglJawa.value, 10) : null;

  if (!dina || !pasaran) {
    if (showNotification) showToast('Piliha Dina lan Pasaran langkung rumiyin.');
    return;
  }

  try {
    const res = hitungPetungIjab({ dina, pasaran, wuku, sasi, tahun, tanggalJawa });
    renderIjabResult(res);
    if (showNotification) {
      showToast(`Petung Ijab kanggé ${dina} ${pasaran} sampun kawedhar.`);
    }
  } catch (err) {
    console.error('Error petung ijab:', err);
    if (showNotification) showToast('Wonten kalepatan nalika ngetung: ' + err.message);
  }
}

/**
 * Render hasil Petung Ijab ke DOM
 */
export function renderIjabResult(data) {
  const container = document.getElementById('ijabResultContainer');
  if (!container) return;

  const {
    dina,
    pasaran,
    neptuCalc,
    wetonData,
    wukuData,
    sasiData,
    tahunData,
    tanggalData,
    factors,
    simpulan,
    catatanSistemNeptu
  } = data;

  const statusBadgeBg = simpulan.warna === 'emerald'
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-900/30'
    : (simpulan.warna === 'rose'
      ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-900/30'
      : 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-900/30');

  const wetonBadgeBg = wetonData?.status_ringkas === 'Becik'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

  const wukuBadgeBg = wukuData?.kanggo_ijab === 'Becik'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : (wukuData?.kanggo_ijab === 'Ala' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40');

  // Render factors pills
  const factorsHtml = factors.map(f => {
    const badgeCls = f.status === 'Becik'
      ? 'bg-emerald-900/40 border-emerald-700/60 text-emerald-300'
      : (f.status === 'Ala' ? 'bg-rose-900/40 border-rose-700/60 text-rose-300' : 'bg-amber-900/40 border-amber-700/60 text-amber-300');
    const icon = f.status === 'Becik' ? 'fa-circle-check text-emerald-400' : (f.status === 'Ala' ? 'fa-triangle-exclamation text-rose-400' : 'fa-circle-info text-amber-400');
    return `
      <div class="p-3 rounded-xl border ${badgeCls} flex items-start gap-2.5 bg-keraton/60">
        <i class="fa-solid ${icon} mt-0.5 text-xs"></i>
        <div>
          <div class="text-xs font-bold text-prada">${f.label}</div>
          <div class="text-[11.5px] leading-relaxed opacity-90">${f.desc}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- HEADER SIMPULAN -->
    <div class="p-5 sm:p-6 rounded-2xl border ${statusBadgeBg} backdrop-blur-md mb-6 shadow-xl relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 opacity-10 text-8xl text-prada pointer-events-none">
        <i class="fa-solid fa-ring"></i>
      </div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border mb-2 ${wetonBadgeBg}">
            <i class="fa-solid fa-sparkles"></i> Asil Petung Ijab (Palakrama)
          </span>
          <h3 class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 flex items-center gap-2">
            ${dina} ${pasaran}
            ${wukuData ? `<span class="text-sm font-sans font-normal text-amber-300/80">· Wuku ${wukuData.wuku}</span>` : ''}
          </h3>
          <p class="text-xs text-sogan-200 mt-1 max-w-xl">
            Simpulan Rangkuman: <strong class="text-prada-light font-semibold">${simpulan.badge}</strong>
          </p>
        </div>
        <div class="text-left sm:text-right shrink-0">
          <div class="text-[11px] text-sogan-300 uppercase tracking-widest font-mono">Neptu Ijab</div>
          <div class="text-3xl font-extrabold text-prada font-mono">${neptuCalc.neptuJumlah}</div>
          <div class="text-[10px] text-amber-400/90">${dina} (${neptuCalc.neptuDina}) + ${pasaran} (${neptuCalc.neptuPasaran})</div>
        </div>
      </div>
    </div>

    <!-- GRID UTAMA ASIL PETUNG -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      
      <!-- KARTU WETON & SURASA IJAB -->
      <div class="p-5 rounded-2xl bg-wulung/70 border border-sogan-700/60 shadow-lg flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-mono tracking-wider text-sogan-300 flex items-center gap-2">
              <i class="fa-solid fa-gem text-prada"></i> Surasane Ijab
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${wetonBadgeBg}">
              ${wetonData?.status_ringkas || 'Sedheng'}
            </span>
          </div>
          <div class="text-lg font-cinzel font-bold text-amber-200 mb-1.5">
            ${wetonData?.surasane_ijab || '-'}
          </div>
          <div class="text-xs text-sogan-100 leading-relaxed mb-4">
            ${wetonData?.tegese_surasa_ijab || '-'}
          </div>
        </div>
        <div class="pt-3 border-t border-sogan-800/80 text-[11px] text-sogan-400 flex items-center justify-between">
          <span>Kategori Tradisi</span>
          <span class="text-prada font-medium">Babon Ijab Weton (35 Weton)</span>
        </div>
      </div>

      <!-- KARTU WUKU & KANGGO IJAB -->
      <div class="p-5 rounded-2xl bg-wulung/70 border border-sogan-700/60 shadow-lg flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs uppercase font-mono tracking-wider text-sogan-300 flex items-center gap-2">
              <i class="fa-solid fa-scroll text-amber-400"></i> Wuku Palakrama
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${wukuBadgeBg}">
              ${wukuData?.kanggo_ijab || 'Sedheng'}
            </span>
          </div>
          <div class="text-lg font-cinzel font-bold text-amber-200 mb-1.5">
            ${wukuData ? `Wuku ${wukuData.wuku}` : 'Wuku Boten Dipunpilih'}
          </div>
          <div class="text-xs text-sogan-100 leading-relaxed mb-4">
            ${wukuData?.kanggo_ijab === 'Becik'
              ? 'Wuku punika mratandhani mangsa ingkang saé, rahayu, lan berkah kanggé nglaksanakaken akad/ijab kabul.'
              : (wukuData?.kanggo_ijab === 'Ala'
                ? 'Wuku punika lumrahipun dipunsingkiri kanggé hajatan nikah miturut paugeran tradisi.'
                : 'Wuku punika asipat sedheng/netral. Prayogi dipunjangkepi sarana donga pangayoman.')}
          </div>
        </div>
        <div class="pt-3 border-t border-sogan-800/80 text-[11px] text-sogan-400 flex items-center justify-between">
          <span>Siklus Pawukon</span>
          <span class="text-prada font-medium">${wukuData ? `Urut kaping ${wukuData.id} / 30` : '-'}</span>
        </div>
      </div>
    </div>

    <!-- LAPISAN PARAMETER TAMBAHAN (SASI, TAHUN, TANGGAL JAWA) -->
    <div class="p-5 rounded-2xl bg-wulung/50 border border-sogan-800/80 mb-6">
      <h4 class="text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-3 flex items-center gap-2">
        <i class="fa-solid fa-layer-group"></i> Paramèter Panjampet (Sasi, Windu, Tanggal Jawa)
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        <div class="p-3 rounded-xl bg-keraton/60 border border-sogan-800">
          <div class="text-[11px] text-sogan-400 font-mono">Sasi Jawa:</div>
          <div class="text-sm font-bold text-prada mt-0.5">${sasiData?.sasi_jawa || 'Sedaya / Boten Dipilih'}</div>
          <div class="text-[11px] text-sogan-200 mt-1 leading-normal">
            ${sasiData?.kanggo_ijab || 'Pilihan sasi bakal mbabar wahananing ijab.'}
          </div>
        </div>

        <div class="p-3 rounded-xl bg-keraton/60 border border-sogan-800">
          <div class="text-[11px] text-sogan-400 font-mono">Tahun Jawa (Windu):</div>
          <div class="text-sm font-bold text-prada mt-0.5">${tahunData ? `Tahun ${tahunData.tahun_jawa}` : 'Sedaya / Boten Dipilih'}</div>
          <div class="text-[11px] text-sogan-200 mt-1 leading-normal">
            ${tahunData?.kanggo_ijab || 'Pilihan windu mbabar sasi ingkang kalebo wisa.'}
          </div>
        </div>

        <div class="p-3 rounded-xl bg-keraton/60 border border-sogan-800">
          <div class="text-[11px] text-sogan-400 font-mono">Tanggal Jawa:</div>
          <div class="text-sm font-bold text-prada mt-0.5">${tanggalData ? `Tanggal ${tanggalData.tanggal_jawa}` : 'Sedaya / Boten Dipilih'}</div>
          <div class="text-[11px] text-sogan-200 mt-1 leading-normal">
            ${tanggalData ? `${tanggalData.pakarti_tanggal_jawa} (${tanggalData.tegese_status})` : 'Pilihan tanggal 1-30 mbabar pakarti tanggal.'}
          </div>
        </div>

      </div>
    </div>

    <!-- DAFTAR FAKTOR SINTESIS -->
    <div class="mb-6">
      <h4 class="text-xs font-mono uppercase tracking-wider text-sogan-300 mb-2 flex items-center gap-2">
        <i class="fa-solid fa-list-check text-prada"></i> Rincian Kawigatosan Petung
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${factorsHtml}
      </div>
    </div>

    <!-- CATATAN KHUSUS SISTEM NEPTU & DISCLAIMER ETIS -->
    <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
      <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0 text-sm"></i>
      <div>
        <strong class="font-semibold text-prada block mb-1">Paugeran Neptu Khusus Ijab:</strong>
        <p class="text-[11.5px] opacity-90">${catatanSistemNeptu}</p>
        <p class="text-[11px] text-sogan-300 mt-1.5">
          <em>Pangeling-eling:</em> Petungan punika minangka sarana mangun tata susila lan nyenyuwun sih nugrahaning Gusti Kang Murbeng Dumadi supados brayat énggal tansah manggih karaharjan, guyub rukun, lan bagya mulya.
        </p>
      </div>
    </div>
  `;
}
