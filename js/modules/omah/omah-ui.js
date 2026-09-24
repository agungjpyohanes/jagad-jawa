/**
 * Jagad Jawa — Modul Domain: Petung Omah & Cempuri UI
 * Pengendali DOM untuk formulir Petung Omah (Pembangunan, Pindah Rumah, & Lawangan Cempuri),
 * komparasi dual neptu, serta visualisasi 3 set rumus sisa.
 */

import { hitungPetungOmah, getCempuriLawangan } from './omah-engine.js';
import {
  CEMPURI_ARAH,
  OMAH_MENURUT_SASI,
  OMAH_MENURUT_MANGSA,
  OMAH_PILIH_LEMAH
} from '../../data/omah-db.js';
import { getTanggalJawaLengkap } from '../kalender/kalender-engine.js';
import { showToast } from '../../ui/toast.js';

const DINA_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN_LIST = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const ARAH_LIST = ['Utara', 'Timur', 'Selatan', 'Barat'];

/**
 * Inisialisasi komponen UI Petung Omah
 */
export function initOmahUI() {
  populateSelects();
  setupEventListeners();

  // Set default ke hari ini
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateInput = document.getElementById('omahDatePicker');
  if (dateInput && !dateInput.value) {
    dateInput.value = `${y}-${m}-${d}`;
    syncOmahDariTanggal();
  }
}

function populateSelects() {
  // Dina
  const selDina = document.getElementById('omahSelDina');
  if (selDina && selDina.children.length <= 1) {
    selDina.innerHTML = DINA_LIST.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  // Pasaran
  const selPasaran = document.getElementById('omahSelPasaran');
  if (selPasaran && selPasaran.children.length <= 1) {
    selPasaran.innerHTML = PASARAN_LIST.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  // Arah Lawang
  const selArahLawang = document.getElementById('omahSelArahLawang');
  if (selArahLawang && selArahLawang.children.length <= 1) {
    selArahLawang.innerHTML = ARAH_LIST.map(a => `<option value="${a}">Madhep ${a}</option>`).join('');
  }

  // Nomor Posisi Lawang (1 - 9)
  const selNomorLawang = document.getElementById('omahSelNomorLawang');
  if (selNomorLawang && selNomorLawang.children.length <= 1) {
    let opts = '<option value="">-- Sedaya 9 Posisi --</option>';
    for (let i = 1; i <= 9; i++) {
      opts += `<option value="${i}">Posisi Kaping ${i}</option>`;
    }
    selNomorLawang.innerHTML = opts;
  }

  // Arah Pindah / Boyongan
  const selArahPindah = document.getElementById('omahSelArahPindah');
  if (selArahPindah && selArahPindah.children.length <= 1) {
    selArahPindah.innerHTML = '<option value="">-- Boten Boyongan / Boten Dipunpilih --</option>' +
      ARAH_LIST.map(a => `<option value="${a}">Boyongan Arahe ${a}</option>`).join('');
  }

  // Sasi Jawa
  const selSasi = document.getElementById('omahSelSasi');
  if (selSasi && selSasi.children.length <= 1) {
    selSasi.innerHTML = '<option value="">-- Sedaya / Boten Dipunpilih --</option>' +
      OMAH_MENURUT_SASI.map(s => `<option value="${s.sasi_jawa}">${s.id}. ${s.sasi_jawa}</option>`).join('');
  }

  // Mangsa
  const selMangsa = document.getElementById('omahSelMangsa');
  if (selMangsa && selMangsa.children.length <= 1) {
    selMangsa.innerHTML = '<option value="">-- Sedaya / Boten Dipunpilih --</option>' +
      OMAH_MENURUT_MANGSA.map(m => `<option value="${m.mangsa_kanon}">${m.id}. ${m.mangsa_kanon}</option>`).join('');
  }

  // Ciri Lemah
  const selLemah = document.getElementById('omahSelLemah');
  if (selLemah && selLemah.children.length <= 1) {
    selLemah.innerHTML = '<option value="">-- Boten Dipunpilih --</option>' +
      OMAH_PILIH_LEMAH.map(l => `<option value="${l.id}">${l.id}. ${l.ciri_lemah} (${l.aran})</option>`).join('');
  }
}

function setupEventListeners() {
  const datePicker = document.getElementById('omahDatePicker');
  if (datePicker) {
    datePicker.addEventListener('change', syncOmahDariTanggal);
  }

  const btnHitung = document.getElementById('btnHitungOmah');
  if (btnHitung) {
    btnHitung.addEventListener('click', () => hitungOmahDariUI(true));
  }

  const btnReset = document.getElementById('btnResetOmahToday');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      if (datePicker) datePicker.value = `${y}-${m}-${d}`;
      syncOmahDariTanggal();
      showToast('Tanggal kasinkronaken dhateng dinten punika.');
    });
  }

  // Auto recalculate on change
  ['omahSelDina', 'omahSelPasaran', 'omahSelArahLawang', 'omahSelNomorLawang', 'omahSelArahPindah', 'omahSelSasi', 'omahSelMangsa', 'omahSelLemah'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => hitungOmahDariUI(false));
    }
  });
}

/**
 * Sinkronkan nilai formulir dengan tanggal kalender Masehi
 */
export function syncOmahDariTanggal() {
  const dateInput = document.getElementById('omahDatePicker');
  if (!dateInput || !dateInput.value) return;

  const [yy, mm, dd] = dateInput.value.split('-').map(Number);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return;

  try {
    const info = getTanggalJawaLengkap(yy, mm, dd);
    if (info) {
      const selDina = document.getElementById('omahSelDina');
      const selPasaran = document.getElementById('omahSelPasaran');
      const selSasi = document.getElementById('omahSelSasi');

      if (selDina) selDina.value = info.dino;
      if (selPasaran) selPasaran.value = info.pas;
      if (selSasi) selSasi.value = info.bulanJawa;

      hitungOmahDariUI(false);
    }
  } catch (err) {
    console.warn('Gagal sinkron tanggal Jawa kanggé omah:', err);
  }
}

/**
 * Baca input dan jalankan perhitungan Petung Omah & Cempuri
 */
export function hitungOmahDariUI(showNotification = false) {
  const selDina = document.getElementById('omahSelDina');
  const selPasaran = document.getElementById('omahSelPasaran');
  const selArahLawang = document.getElementById('omahSelArahLawang');
  const selNomorLawang = document.getElementById('omahSelNomorLawang');
  const selArahPindah = document.getElementById('omahSelArahPindah');
  const selSasi = document.getElementById('omahSelSasi');
  const selMangsa = document.getElementById('omahSelMangsa');
  const selLemah = document.getElementById('omahSelLemah');

  const dina = selDina?.value;
  const pasaran = selPasaran?.value;
  const arahLawang = selArahLawang?.value || 'Timur';
  const nomorLawang = selNomorLawang?.value ? parseInt(selNomorLawang.value, 10) : null;
  const arahPindah = selArahPindah?.value || null;
  const sasi = selSasi?.value || null;
  const mangsa = selMangsa?.value || null;
  const ciriLemahId = selLemah?.value ? parseInt(selLemah.value, 10) : null;

  if (!dina || !pasaran) {
    if (showNotification) showToast('Piliha Dina lan Pasaran langkung rumiyin.');
    return;
  }

  try {
    const res = hitungPetungOmah({
      dina,
      pasaran,
      arahLawang,
      nomorLawang,
      arahPindah,
      sasi,
      mangsa,
      ciriLemahId
    });
    renderOmahResult(res);
    if (showNotification) {
      showToast(`Petung Omah kanggé ${dina} ${pasaran} sampun kababar.`);
    }
  } catch (err) {
    console.error('Error petung omah:', err);
    if (showNotification) showToast('Wonten kalepatan nalika ngetung: ' + err.message);
  }
}

/**
 * Render hasil Petung Omah ke DOM
 */
export function renderOmahResult(data) {
  const container = document.getElementById('omahResultContainer');
  if (!container) return;

  const {
    dina,
    pasaran,
    neptuApp,
    neptuNb,
    setA,
    setB,
    setC,
    laranganBoyongan,
    cempuri,
    sasiData,
    mangsaData,
    lemahData,
    simpulan,
    disclaimer
  } = data;

  const statusBadgeBg = simpulan.color === 'emerald'
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-900/30'
    : (simpulan.color === 'rose'
      ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-900/30'
      : 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-900/30');

  // Render Set Card Helper
  function renderSetCard(title, code, setObj, baseNeptuName, baseNeptuVal, moduloVal) {
    const isBecik = setObj.status === 'Becik';
    const badgeColor = isBecik
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    return `
      <div class="p-4 rounded-xl bg-wulung/70 border border-sogan-700/60 shadow flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase font-mono tracking-wider text-sogan-300">${title}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}">
              ${setObj.status}
            </span>
          </div>
          <div class="text-xl font-cinzel font-bold text-prada mb-1">
            ${setObj.nama}
          </div>
          <p class="text-xs text-sogan-100 leading-relaxed mb-3">
            ${setObj.watak}
          </p>
        </div>
        <div class="pt-2.5 border-t border-sogan-800 text-[10.5px] text-sogan-400 font-mono flex items-center justify-between">
          <span>${baseNeptuName}: ${baseNeptuVal}</span>
          <span class="text-amber-300">${baseNeptuVal} mod ${moduloVal} = sisa ${setObj.sisa}</span>
        </div>
      </div>
    `;
  }

  // Render Cempuri Lawangan Grid (9 posisi)
  let cempuriHtml = '';
  if (cempuri && cempuri.positions) {
    cempuriHtml = `
      <div class="p-5 rounded-2xl bg-wulung/60 border border-sogan-700/60 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 class="text-sm font-cinzel font-bold text-amber-200 flex items-center gap-2">
              <i class="fa-solid fa-door-open text-prada"></i> Cempuri Lawangan — Madhep ${cempuri.arah}
            </h4>
            <p class="text-xs text-sogan-300 mt-0.5">
              Matriks pitedah 9 posisi lawang ingpager cempuri sisih ${cempuri.arah}
            </p>
          </div>
          ${cempuri.selected ? `
            <div class="px-3 py-1 rounded-xl bg-prada/20 border border-prada/50 text-xs text-prada-light font-bold">
              Posisi Kapilih: Kaping ${cempuri.nomor}
            </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${cempuri.positions.map(pos => {
            const isSelected = cempuri.nomor === pos.nomor;
            const highlightCls = isSelected
              ? 'ring-2 ring-prada bg-amber-950/60 border-prada shadow-lg'
              : 'bg-keraton/60 border-sogan-800 hover:border-sogan-600';
            return `
              <div class="p-3 rounded-xl border ${highlightCls} transition flex flex-col justify-between">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-mono font-bold ${isSelected ? 'text-prada-light' : 'text-sogan-300'}">
                    Posisi ${pos.nomor}
                  </span>
                  ${isSelected ? '<span class="text-[10px] text-prada font-bold uppercase tracking-wider"><i class="fa-solid fa-check"></i> Kapilih</span>' : ''}
                </div>
                <div class="text-xs text-sogan-100 font-medium leading-relaxed">
                  ${pos.arti}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Warning Larangan Arah Boyongan
  let laranganBanner = '';
  if (laranganBoyongan.isProhibited) {
    laranganBanner = `
      <div class="p-4 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-200 mb-6 flex items-start gap-3 shadow-lg">
        <i class="fa-solid fa-ban text-rose-400 text-lg mt-0.5 shrink-0"></i>
        <div>
          <strong class="text-sm font-bold text-rose-300 block mb-0.5">Pènget Larangan Arah Boyongan:</strong>
          <p class="text-xs leading-relaxed font-semibold">${laranganBoyongan.warningText}</p>
          <p class="text-[11px] text-rose-300/80 mt-1">Dina punika gadhah cacah neptu ${neptuApp.neptuJumlah}, boten kaparengaken boyongan tumuju arah ${laranganBoyongan.checkedDirection}.</p>
        </div>
      </div>
    `;
  } else if (laranganBoyongan.prohibitedList.length > 0) {
    laranganBanner = `
      <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs mb-6 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <i class="fa-solid fa-compass text-amber-400"></i>
          <span>Larangan Arah Boyongan dinten punika (Neptu ${neptuApp.neptuJumlah}): <strong>${laranganBoyongan.warningText}</strong></span>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- HEADER SIMPULAN -->
    <div class="p-5 sm:p-6 rounded-2xl border ${statusBadgeBg} backdrop-blur-md mb-6 shadow-xl relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 opacity-10 text-8xl text-prada pointer-events-none">
        <i class="fa-solid fa-house-chimney"></i>
      </div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border mb-2 bg-sogan-950/70 border-sogan-700/60 text-amber-300">
            <i class="fa-solid fa-compass-drafting"></i> Asil Petung Ngedekake & Boyongan Omah
          </span>
          <h3 class="text-xl sm:text-2xl font-cinzel font-bold text-amber-100 flex items-center gap-2">
            ${dina} ${pasaran}
          </h3>
          <p class="text-xs text-sogan-200 mt-1 max-w-xl">
            Kahanan Dina: <strong class="text-prada-light font-semibold">${simpulan.badge}</strong> (${simpulan.status})
          </p>
        </div>
        
        <!-- KOMPARASI DUAL NEPTU DI HEADER -->
        <div class="flex items-center gap-4 shrink-0 bg-keraton/60 p-3 rounded-xl border border-sogan-700/60">
          <div class="text-center px-2">
            <div class="text-[10px] text-sogan-400 uppercase font-mono tracking-wider">Neptu App</div>
            <div class="text-2xl font-extrabold text-prada font-mono">${neptuApp.neptuJumlah}</div>
            <div class="text-[9px] text-sogan-400">${neptuApp.neptuDina}+${neptuApp.neptuPasaran}</div>
          </div>
          <div class="h-8 w-px bg-sogan-700"></div>
          <div class="text-center px-2">
            <div class="text-[10px] text-amber-400 uppercase font-mono tracking-wider">Neptu NB</div>
            <div class="text-2xl font-extrabold text-amber-300 font-mono">${neptuNb.neptuJumlah}</div>
            <div class="text-[9px] text-amber-400/80">${neptuNb.neptuDina}+${neptuNb.neptuPasaran}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- BANNER LARANGAN ARAH BOYONGAN -->
    ${laranganBanner}

    <!-- GRID 3 SET RUMUS (SET A, SET B, SET C) -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-xs font-mono uppercase tracking-wider text-sogan-300 flex items-center gap-2">
          <i class="fa-solid fa-shapes text-prada"></i> Tri-Set Rumus Babon Omah (Sisa Modulo)
        </h4>
        <span class="text-[11px] text-sogan-400 font-mono">Bumi · Kerta · Guru</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${renderSetCard('Set A (Sisa 4)', 'set_a', setA, 'Neptu App', neptuApp.neptuJumlah, 4)}
        ${renderSetCard('Set B (Sisa 5)', 'set_b', setB, 'Neptu App', neptuApp.neptuJumlah, 5)}
        ${renderSetCard('Set C (Sisa 4 NB)', 'set_c', setC, 'Neptu NB', neptuNb.neptuJumlah, 4)}
      </div>
    </div>

    <!-- CEMPURI LAWANGAN -->
    ${cempuriHtml}

    <!-- PARAMETER TAMBAHAN: SASI, MANGSA, CIRI LEMAH -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      <!-- SASI JAWA -->
      <div class="p-4 rounded-xl bg-wulung/50 border border-sogan-800">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] text-sogan-400 font-mono">Sasi Jawa</span>
          <span class="text-xs font-bold text-prada">${sasiData?.sasi_jawa || 'Boten Dipilih'}</span>
        </div>
        <div class="text-xs text-amber-200 font-semibold mb-1">
          ${sasiData?.lamun_wulan || '-'}
        </div>
        <div class="text-[11.5px] text-sogan-200 leading-relaxed">
          ${sasiData?.wahanane || 'Pilihan sasi paring pitedah prabawa kanggé griya.'}
        </div>
      </div>

      <!-- PRANATA MANGSA -->
      <div class="p-4 rounded-xl bg-wulung/50 border border-sogan-800">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] text-sogan-400 font-mono">Pranata Mangsa</span>
          <span class="text-xs font-bold text-prada">${mangsaData?.mangsa_kanon || 'Boten Dipilih'}</span>
        </div>
        <div class="text-xs text-amber-200 font-semibold mb-1">
          Ngedekake: <span class="${mangsaData?.ngedekake_omah === 'Becik' ? 'text-emerald-400' : 'text-rose-400'}">${mangsaData?.ngedekake_omah || '-'}</span>
        </div>
        <div class="text-[11.5px] text-sogan-200 leading-relaxed">
          ${mangsaData ? `Mayu: ${mangsaData.mayu_omah} · Pindah: ${mangsaData.pindah_omah}` : 'Pilihan mangsa agraris nyelarasaken kaliyan iklim lan hawa.'}
        </div>
      </div>

      <!-- CIRI LEMAH / TANAH -->
      <div class="p-4 rounded-xl bg-wulung/50 border border-sogan-800">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] text-sogan-400 font-mono">Karakter Lemah</span>
          <span class="text-xs font-bold text-prada">${lemahData?.aran || 'Boten Dipilih'}</span>
        </div>
        <div class="text-xs text-amber-200 font-semibold mb-1">
          ${lemahData?.ciri_lemah || '-'}
        </div>
        <div class="text-[11.5px] text-sogan-200 leading-relaxed">
          ${lemahData ? `${lemahData.watak_akibat}. <span class="text-prada-light">Sarana: ${lemahData.sarana_anjuran}</span>` : 'Pilihan wujud siti mbabar sarana tetuwuhan panulak.'}
        </div>
      </div>

    </div>

    <!-- DISCLAIMER ETIS & BUDAYA -->
    <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
      <i class="fa-solid fa-shield-halved text-amber-400 mt-0.5 shrink-0 text-sm"></i>
      <div>
        <strong class="font-semibold text-prada block mb-1">Pènget Luhur & Tanggung Jawab Kultural:</strong>
        <p class="text-[11.5px] opacity-90">${disclaimer}</p>
        <p class="text-[11px] text-sogan-300 mt-1.5">
          <em>Filosofi:</em> Omah minangka papan dununging raga lan jiwa (cempuri pangayoman). Petung punika ngajak manungsa eling marang harmoni jagad cilik (mikrokosmos) lan jagad gedhe (makrokosmos).
        </p>
      </div>
    </div>
  `;
}
