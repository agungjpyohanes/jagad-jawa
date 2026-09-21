/**
 * Jagad Jawa — Modul Domain: Jodoh UI (Tahap 4)
 * Pengendali DOM untuk formulir input weton & aksara mempelai,
 * visual score proportion bar, rekomendasi 5 tanggal mantu rahayu,
 * riwayat hitungan pasangan (LocalStorage), dan laporan cetak Kasultanan.
 */

import {
  AKSARA_PERJODOHAN,
  autoDetectAksara,
  hitungPitung7Metode,
  cariRekomendasiTanggalMantu,
  getTingkatKeharmonisan,
  DISCLAIMER_ETIS_PERJODOHAN
} from './jodoh-engine.js';
import {
  saveJodohHistory,
  getJodohHistory,
  deleteJodohHistoryItem,
  clearAllJodohHistory
} from './jodoh-history.js';
import { saveBookmark } from '../kalender/bookmark-service.js';
import { HARI, PASARAN, NEPTU_HARI, NEPTU_PASARAN, getDayInfo } from '../kalender/kalender-engine.js';
import { showToast } from '../../ui/toast.js';

export function initPerjodohanSelects() {
  const selects = ['aksaraDepanP', 'aksaraBelakangP', 'aksaraDepanL', 'aksaraBelakangL'];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '';
    AKSARA_PERJODOHAN.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.kode;
      opt.textContent = `${a.kode} (IV:${a.iv}|V:${a.vvi})`;
      sel.appendChild(opt);
    });
  });

  ['P', 'L'].forEach(side => {
    const hSel = document.getElementById('hari' + side);
    const pSel = document.getElementById('pasaran' + side);
    if (!hSel || !pSel) return;
    hSel.innerHTML = ''; pSel.innerHTML = '';
    HARI.forEach(h => hSel.appendChild(new Option(h, h)));
    PASARAN.forEach(p => pSel.appendChild(new Option(p, p)));
  });

  // Render riwayat perhitungan awal
  renderRiwayatPerjodohan();
}

export function autoDetectAksaraUI(side) {
  const elNama = document.getElementById('nama' + side);
  if (!elNama) return;
  const nama = elNama.value.trim();
  if (!nama) return;

  const res = autoDetectAksara(nama);
  const elDepan = document.getElementById('aksaraDepan' + side);
  const elBelakang = document.getElementById('aksaraBelakang' + side);
  if (elDepan) elDepan.value = res.depan;
  if (elBelakang) elBelakang.value = res.belakang;
}

export function autoWetonPerjodohan(side) {
  const elTgl = document.getElementById('tgl' + side);
  const badge = document.getElementById('neptu' + side + 'Badge');
  if (!elTgl || !elTgl.value) {
    if (badge) badge.innerText = '-';
    return;
  }
  const [y, m, d] = elTgl.value.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;

  const info = getDayInfo(y, m, d);
  const elHari = document.getElementById('hari' + side);
  const elPasaran = document.getElementById('pasaran' + side);
  if (elHari) elHari.value = HARI[info.weekdayId];
  if (elPasaran) elPasaran.value = PASARAN[info.pasaranId];
  updateNeptuPerjodohan(side);
}

export function updateNeptuPerjodohan(side) {
  const elHari = document.getElementById('hari' + side);
  const elPasaran = document.getElementById('pasaran' + side);
  const badge = document.getElementById('neptu' + side + 'Badge');
  if (!elHari || !elPasaran || !badge) return;

  const h = elHari.value;
  const p = elPasaran.value;
  const hIdx = HARI.indexOf(h);
  const pIdx = PASARAN.indexOf(p);
  if (hIdx >= 0 && pIdx >= 0) {
    const n = NEPTU_HARI[hIdx] + NEPTU_PASARAN[pIdx];
    badge.innerText = n;
  } else {
    badge.innerText = '-';
  }
}

export function hitungNujumPerjodohan() {
  const neptuPText = document.getElementById('neptuPBadge')?.innerText;
  const neptuLText = document.getElementById('neptuLBadge')?.innerText;
  const neptuP = parseInt(neptuPText || '');
  const neptuL = parseInt(neptuLText || '');

  if (!neptuP || !neptuL || isNaN(neptuP) || isNaN(neptuL)) {
    showToast('Pilih tanggal lahir atau tentukan weton kedua calon pengantin terlebih dahulu.');
    return;
  }

  const hariP = document.getElementById('hariP')?.value || '';
  const hariL = document.getElementById('hariL')?.value || '';
  const pasaranP = document.getElementById('pasaranP')?.value || '';
  const pasaranL = document.getElementById('pasaranL')?.value || '';
  const namaP = document.getElementById('namaP')?.value.trim() || 'Calon Pengantin Wanita';
  const namaL = document.getElementById('namaL')?.value.trim() || 'Calon Pengantin Pria';
  const tglP = document.getElementById('tglP')?.value || '';
  const tglL = document.getElementById('tglL')?.value || '';

  const akDP = document.getElementById('aksaraDepanP')?.value || 'HA';
  const akBP = document.getElementById('aksaraBelakangP')?.value || 'HA';
  const akDL = document.getElementById('aksaraDepanL')?.value || 'HA';
  const akBL = document.getElementById('aksaraBelakangL')?.value || 'HA';

  const hasil = hitungPitung7Metode(
    { nama: namaP, hari: hariP, pasaran: pasaranP, neptu: neptuP, aksaraDepan: akDP, aksaraBelakang: akBP },
    { nama: namaL, hari: hariL, pasaran: pasaranL, neptu: neptuL, aksaraDepan: akDL, aksaraBelakang: akBL }
  );

  // Periksa Status Hubungan (Belum Menikah vs Sudah Menikah)
  const statusEl = document.querySelector('input[name="statusHubunganPerjodohan"]:checked') || document.getElementById('statusHubunganPerjodohan');
  const statusHubungan = statusEl ? statusEl.value : 'belum_menikah';

  // Cari 5 usulan tanggal mantu rahayu (hanya jika belum menikah)
  const mantuList = (statusHubungan === 'belum_menikah') ? cariRekomendasiTanggalMantu(hasil.totalNeptu) : [];

  // Simpan ke riwayat lokal (Tahap 4.3)
  saveJodohHistory(hasil, { tglP, tglL, statusHubungan });

  // Simpan state untuk ekspor PDF
  window.LAST_PERJODOHAN_DATA = hasil;
  window.LAST_MANTU_DATA = mantuList;
  window.LAST_STATUS_HUBUNGAN = statusHubungan;

  // Render Tabel 7 Metode
  let tbody = '';
  hasil.rows.forEach(r => {
    let badgeClass = '';
    let badgeSymbol = '';
    if (r.h.status === 'baik') {
      badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/70';
      badgeSymbol = '✓ BAIK';
    } else if (r.h.status === 'buruk') {
      badgeClass = 'bg-rose-950/80 text-rose-300 border-rose-500/70';
      badgeSymbol = '⊗ BURUK';
    } else {
      badgeClass = 'bg-amber-950/80 text-amber-300 border-amber-500/70';
      badgeSymbol = '• CAMPUR';
    }

    tbody += `
      <tr class="border-b border-sogan-800/80 hover:bg-sogan-900/30">
        <td class="p-3 font-bold text-prada">${r.no}</td>
        <td class="p-3 font-marcellus font-bold text-sogan-100">${r.h.nama}</td>
        <td class="p-3 text-sogan-200">${r.h.arti} <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${r.rumus}</div></td>
        <td class="p-3 text-center"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${badgeClass}">${badgeSymbol}</span></td>
      </tr>
    `;
  });

  const hasilBody = document.getElementById('hasilPerjodohanBody');
  if (hasilBody) hasilBody.innerHTML = tbody;

  const pairInfo = document.getElementById('perjodohanPairInfo');
  if (pairInfo) {
    const statusLabel = (statusHubungan === 'sudah_menikah') ? 'Pasutri (Sampun Nikah)' : 'Calon Penganten';
    pairInfo.innerHTML = `${namaP} (${neptuP}) &middot; ${namaL} (${neptuL}) &bull; Jumlah Neptu: <strong class="text-prada font-mono">${hasil.totalNeptu}</strong> &bull; Status: <span class="text-amber-300 font-semibold">${statusLabel}</span>`;
  }

  // Render Visual Score Bar & Hero Gauge (Tahap 4.1)
  renderVisualScoreBar(hasil.summary);

  // Render Usulan 5 Tanggal Mantu (Belum Menikah) ATAU Panduan Keharmonisan Pasutri (Sudah Menikah)
  if (statusHubungan === 'sudah_menikah') {
    renderPanduanKeharmonisanPasutri(hasil);
  } else {
    renderRekomendasiMantu(mantuList);
  }

  // Render Riwayat Hitungan Pasangan (Tahap 4.3)
  renderRiwayatPerjodohan();

  // Render Disclaimer Etis Perjodohan (Tahap 4.4 / 3.5)
  const disclaimerBox = document.getElementById('disclaimerPerjodohanBox');
  if (disclaimerBox) {
    disclaimerBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-sogan-950/90 border border-sogan-800 text-[11px] text-sogan-300 flex items-start gap-2.5">
        <i class="fa-solid fa-scroll text-prada text-base mt-0.5"></i>
        <div class="space-y-1">
          <strong class="text-prada block font-semibold uppercase text-[10px] tracking-wider">Amanat Budaya &amp; Literasi Mawas Diri:</strong>
          <p class="leading-relaxed italic">${DISCLAIMER_ETIS_PERJODOHAN}</p>
        </div>
      </div>
    `;
  }

  const emptyBox = document.getElementById('emptyPerjodohanBox');
  if (emptyBox) emptyBox.classList.add('hidden');
  const cardBox = document.getElementById('hasilPerjodohanCard');
  if (cardBox) cardBox.classList.remove('hidden');

  ['btnPrintPerjodohan', 'btnPrintPerjodohanParchment', 'btnPrintPerjodohanMonochrome'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = 'inline-flex';
  });

  showToast('Pitung perjodohan kasil kapetung kanthi jangkep!');
}

/**
 * Render visualisasi skor proporsi (Baik - Campur - Buruk) dan hero badge (Tahap 4.1).
 * @param {Object} summary 
 */
export function renderVisualScoreBar(summary) {
  const container = document.getElementById('visualScorePerjodohanBox');
  if (!container) return;

  const baikPct = Math.round((summary.baik / summary.total) * 100);
  const campurPct = Math.round((summary.campur / summary.total) * 100);
  const burukPct = Math.round((summary.buruk / summary.total) * 100);
  const keharmonisan = summary.keharmonisan || getTingkatKeharmonisan(summary.skorKeselarasan);

  container.innerHTML = `
    <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 space-y-4 shadow-lg">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sogan-800 pb-3">
        <div>
          <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">HASIL EVALUASI TINGKAT KEHARMONISAN</span>
          <h3 class="font-marcellus text-lg sm:text-xl font-bold text-prada-light">${keharmonisan.predikat}</h3>
          <p class="text-xs text-sogan-300 mt-0.5">${keharmonisan.deskripsi}</p>
        </div>
        <div class="text-left sm:text-right">
          <div class="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-2xl bg-sogan-900/90 border border-prada/60 shadow">
            <span class="text-2xl sm:text-3xl font-bold font-mono gold-gradient-text">${summary.skorKeselarasan}%</span>
            <span class="text-[10px] text-sogan-400 uppercase font-mono">Keselarasan</span>
          </div>
        </div>
      </div>

      <!-- Segmented Proportion Visual Bar (4.1) -->
      <div class="space-y-1.5">
        <div class="flex flex-wrap justify-between text-[11px] font-mono gap-1">
          <span class="text-emerald-400 font-semibold"><i class="fa-solid fa-circle-check mr-1"></i>${summary.baik} Metode Baik (${baikPct}%)</span>
          <span class="text-amber-400 font-semibold"><i class="fa-solid fa-circle-minus mr-1"></i>${summary.campur} Metode Netral (${campurPct}%)</span>
          <span class="text-rose-400 font-semibold"><i class="fa-solid fa-circle-xmark mr-1"></i>${summary.buruk} Metode Perhatian (${burukPct}%)</span>
        </div>
        <div class="w-full h-3.5 rounded-full overflow-hidden flex bg-sogan-950 border border-sogan-800 p-0.5 shadow-inner">
          ${summary.baik > 0 ? `<div style="width: ${baikPct}%" class="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-l-full transition-all duration-500" title="Metode Baik: ${summary.baik}"></div>` : ''}
          ${summary.campur > 0 ? `<div style="width: ${campurPct}%" class="bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500" title="Metode Campur: ${summary.campur}"></div>` : ''}
          ${summary.buruk > 0 ? `<div style="width: ${burukPct}%" class="bg-gradient-to-r from-rose-600 to-red-500 rounded-r-full transition-all duration-500" title="Metode Perhatian: ${summary.buruk}"></div>` : ''}
        </div>
      </div>

      <!-- Nasihat Kultural & Tepa Slira -->
      <div class="p-3 rounded-xl bg-keraton border border-sogan-800/90 text-xs flex items-start gap-2.5">
        <i class="fa-solid fa-feather text-prada text-sm mt-0.5"></i>
        <div class="space-y-0.5">
          <strong class="text-prada block text-[11px] uppercase tracking-wider">Pandom Batin &amp; Tepa Slira:</strong>
          <span class="text-sogan-200 leading-relaxed italic text-[11.5px]">${keharmonisan.saranKultural}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render panduan keharmonisan dan evaluasi khusus pasangan yang sudah menikah (Pasutri).
 * @param {Object} hasil 
 */
export function renderPanduanKeharmonisanPasutri(hasil) {
  const container = document.getElementById('rekomendasiMantuBox');
  if (!container) return;

  const keharmonisan = getTingkatKeharmonisan(hasil?.summary || { baik: 0, buruk: 0, netral: 0 });
  const totalNeptu = hasil?.totalNeptu || 0;

  container.innerHTML = `
    <div class="p-4 sm:p-6 rounded-2xl bg-wulung border border-emerald-500/40 space-y-4 shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold block px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60">
              <i class="fa-solid fa-house-chimney-window mr-1"></i> STATUS: SAMPUN NIKAH (PASUTRI)
            </span>
          </div>
          <h4 class="font-marcellus text-lg sm:text-xl font-bold text-prada-light mt-1.5">
            Pituduh Gesang Bebrayan &amp; Pangruwating Pasulayan
          </h4>
          <p class="text-[11px] text-sogan-300">
            Panduan kearifan lokal kanggé ngreksa karukunan bale wisma, nyelarasaken watak, sarta ngruwat rubeda.
          </p>
        </div>
        <span class="text-[11px] px-3.5 py-1.5 rounded-full bg-sogan-950 border border-prada/50 text-prada font-mono">
          Neptu Jangkep: ${totalNeptu}
        </span>
      </div>

      <!-- Ringkasan Tingkat Keharmonisan -->
      <div class="p-4 rounded-xl bg-keraton border border-sogan-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-sogan-400 font-mono uppercase font-semibold">Tingkat Karukunan:</span>
          <span class="px-2.5 py-0.5 rounded-full font-bold text-xs ${keharmonisan.badgeClass}">
            ${keharmonisan.tingkat}
          </span>
        </div>
        <p class="text-xs text-sogan-200 leading-relaxed">${keharmonisan.deskripsi}</p>
      </div>

      <!-- Grid 3 Pilar Keharmonisan Rumah Tangga -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <!-- 1. Mitigasi Pasulayan -->
        <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-2">
          <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-shield-heart text-amber-400"></i> Pangruwating Rubeda
          </span>
          <p class="text-sogan-300 text-[11px] leading-relaxed">
            Menawi wonten asil petung ingkang kirang sae, punika boten ateges pepisahan, ananging pepeling supados tansah sabar, ngalah, lan nyuda hawa nepsu.
          </p>
        </div>

        <!-- 2. Laku Pangayoman -->
        <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-2">
          <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-seedling text-emerald-400"></i> Laku Bebrayan
          </span>
          <p class="text-sogan-300 text-[11px] leading-relaxed">
            Nindakaken sedekah weton kanthi tulusing manah, ngraketaken silaturahmi kaliyan tiyang sepuh kakalih, sarta dedonga nyenyuwun sih wilasaning Gusti.
          </p>
        </div>

        <!-- 3. Visi Langgeng -->
        <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 space-y-2">
          <span class="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-infinity text-teal-400"></i> Hayuning Bawana
          </span>
          <p class="text-sogan-300 text-[11px] leading-relaxed">
            Urip bebrayan punika sarana ngasuh katresnan sejati, dados tuladha kautaman tumrap para putra, dumugi kaken-kaken ninen-ninen ing karaharjan.
          </p>
        </div>
      </div>

      <!-- Nasihat Kultural Khusus -->
      <div class="p-3.5 rounded-xl bg-sogan-950/80 border border-prada/30 text-xs text-sogan-300 flex items-start gap-3">
        <i class="fa-solid fa-quote-left text-prada text-base mt-1 flex-shrink-0"></i>
        <div class="space-y-1">
          <strong class="text-prada-light block text-[11px]">Paweling Kagem Pasutri:</strong>
          <p class="text-[11px] leading-relaxed italic text-sogan-200">
            "${keharmonisan.saranKultural}"
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render rekomendasi 5 tanggal mantu terdekat (Tahap 4.2).
 * @param {Array<Object>} mantuList 
 */
export function renderRekomendasiMantu(mantuList) {
  const container = document.getElementById('rekomendasiMantuBox');
  if (!container) return;

  if (!mantuList || mantuList.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-keraton border border-sogan-800 text-center text-xs text-sogan-400">
        Pencarian tanggal rahayu memerlukan perhitungan neptu pasangan terlebih dahulu.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="p-4 sm:p-5 rounded-2xl bg-wulung border border-prada/40 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800 pb-2.5">
        <div>
          <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">REKOMENDASI PAWIWAHAN (4.2)</span>
          <h4 class="font-marcellus text-lg font-bold text-prada-light">5 Usulan Tanggal Mantu Rahayu Terdekat</h4>
          <p class="text-[11px] text-sogan-300">Dipilih miturut kombinasi <strong>Dino Ijo</strong> (hari baik), non-Dino Gede, sarta predikat <strong>Panca Sudha Ijab Mantu</strong> (Sri / Lungguh / Gedhong).</p>
        </div>
        <span class="text-[11px] px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/60 text-teal-300 font-mono">
          <i class="fa-solid fa-calendar-check mr-1"></i> 5 Tanggal Utama
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        ${mantuList.map((m, idx) => `
          <div class="p-3.5 rounded-xl bg-keraton border border-sogan-800 hover:border-prada/60 transition space-y-2.5 flex flex-col justify-between shadow">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sogan-900 border border-sogan-700 text-amber-300 font-bold">
                  Usulan #${idx + 1}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-leaf text-[9px]"></i> Dino Ijo
                </span>
              </div>
              <h5 class="font-marcellus text-sm font-bold text-sogan-100">${m.formattedDate}</h5>
              <div class="text-[11px] text-sogan-400">
                Weton: <strong class="text-prada">${m.weton}</strong> (Neptu: ${m.neptuHari}) &middot; Wuku ${m.wukuName}
              </div>
            </div>

            <div class="p-2 rounded-lg bg-sogan-950/80 border border-sogan-800/80 space-y-1 text-[11px]">
              <div class="flex items-center justify-between">
                <span class="text-sogan-400">Panca Sudha:</span>
                <strong class="text-amber-300">${m.kategoriLabel}</strong>
              </div>
              <p class="text-sogan-300 text-[10.5px] italic leading-tight">${m.makna}</p>
            </div>

            <button onclick="simpanMantuKeBookmark('${m.dateStr}', '${m.weton}', '${m.predikat}')" class="w-full py-1.5 px-2 rounded-lg bg-sogan-900 hover:bg-sogan-800 border border-prada/40 hover:border-prada text-prada text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
              <i class="fa-solid fa-bookmark text-[10px]"></i> Tandai ing Kalender
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Menyimpan tanggal mantu langsung ke LocalStorage Bookmark Kalender.
 * @param {string} dateStr 
 * @param {string} weton 
 * @param {string} predikat 
 */
export function simpanMantuKeBookmark(dateStr, weton, predikat) {
  saveBookmark(dateStr, {
    catatan: `Rencana Ijab Mantu (${predikat}) &middot; Weton: ${weton}`,
    kategori: 'pawiwahan'
  });
  showToast(`Tanggal mantu ${weton} kasil katandha ing kalender!`);
}

/**
 * Render riwayat perhitungan pasangan (Tahap 4.3).
 */
export function renderRiwayatPerjodohan() {
  const container = document.getElementById('riwayatPerjodohanList');
  if (!container) return;

  const history = getJodohHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-sogan-400 text-xs">
        <i class="fa-solid fa-clock-rotate-left text-2xl text-sogan-600 mb-2"></i>
        <p>Dereng wonten riwayat petungan pasangan ingkang kasimpen.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-2 text-xs">
      ${history.map(item => `
        <div class="p-3 rounded-xl bg-keraton border border-sogan-800 flex flex-wrap items-center justify-between gap-2.5 hover:border-prada/50 transition">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <strong class="font-marcellus text-sm text-prada">${item.wanita.nama} &amp; ${item.pria.nama}</strong>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sogan-900 text-amber-300 border border-sogan-700">
                Neptu: ${item.totalNeptu}
              </span>
              ${item.statusHubungan === 'sudah_menikah'
                ? '<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-semibold">Pasutri</span>'
                : '<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 font-semibold">Calon Penganten</span>'}
            </div>
            <div class="text-[11px] text-sogan-400">
              ${item.wanita.hari} ${item.wanita.pasaran} (${item.wanita.neptu}) &middot; ${item.pria.hari} ${item.pria.pasaran} (${item.pria.neptu}) &mdash; Keselarasan: <strong class="text-emerald-400">${item.skorKeselarasan}%</strong> (${item.predikatKeharmonisan})
            </div>
            <span class="text-[10px] font-mono text-sogan-500 block">${item.tglHitungStr}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="loadRiwayatPerjodohan('${item.id}')" class="px-3 py-1.5 rounded-lg bg-sogan-900 border border-prada/50 text-prada hover:bg-prada/20 font-semibold text-xs flex items-center gap-1 transition cursor-pointer">
              <i class="fa-solid fa-arrow-rotate-left"></i> Muat
            </button>
            <button onclick="hapusRiwayatPerjodohan('${item.id}')" class="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 flex items-center justify-center transition cursor-pointer" title="Hapus Riwayat">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Memuat kembali riwayat pasangan ke form input dan langsung menghitung ulang.
 * @param {string} id 
 */
export function loadRiwayatPerjodohan(id) {
  const history = getJodohHistory();
  const item = history.find(x => x.id === id);
  if (!item) return;

  const elNamaP = document.getElementById('namaP');
  const elNamaL = document.getElementById('namaL');
  const elTglP = document.getElementById('tglP');
  const elTglL = document.getElementById('tglL');
  const elHariP = document.getElementById('hariP');
  const elHariL = document.getElementById('hariL');
  const elPasaranP = document.getElementById('pasaranP');
  const elPasaranL = document.getElementById('pasaranL');

  if (elNamaP) elNamaP.value = item.wanita.nama || '';
  if (elNamaL) elNamaL.value = item.pria.nama || '';
  if (elTglP && item.wanita.tglLahir) elTglP.value = item.wanita.tglLahir;
  if (elTglL && item.pria.tglLahir) elTglL.value = item.pria.tglLahir;

  // Pulihkan status hubungan radio button
  if (item.statusHubungan) {
    const radioBelum = document.getElementById('statusBelumMenikah');
    const radioSudah = document.getElementById('statusSudahMenikah');
    if (item.statusHubungan === 'sudah_menikah') {
      if (radioSudah) radioSudah.checked = true;
    } else {
      if (radioBelum) radioBelum.checked = true;
    }
  }

  autoDetectAksaraUI('P');
  autoDetectAksaraUI('L');

  if (elHariP && item.wanita.hari) elHariP.value = item.wanita.hari;
  if (elPasaranP && item.wanita.pasaran) elPasaranP.value = item.wanita.pasaran;
  if (elHariL && item.pria.hari) elHariL.value = item.pria.hari;
  if (elPasaranL && item.pria.pasaran) elPasaranL.value = item.pria.pasaran;

  updateNeptuPerjodohan('P');
  updateNeptuPerjodohan('L');

  hitungNujumPerjodohan();
  showToast('Riwayat pitung kasil dipun muat!');
}

/**
 * Menghapus satu entri riwayat hitungan pasangan.
 * @param {string} id 
 */
export function hapusRiwayatPerjodohan(id) {
  deleteJodohHistoryItem(id);
  renderRiwayatPerjodohan();
  showToast('Entri riwayat pitung kasil dibusak.');
}

/**
 * Membersihkan seluruh riwayat hitungan pasangan.
 */
export function clearAllRiwayatPerjodohan() {
  clearAllJodohHistory();
  renderRiwayatPerjodohan();
  showToast('Sedaya riwayat pitung kasil dibusak.');
}

/**
 * Cetak Laporan Perjodohan Kasultanan Resmi (Tahap 4.4).
 * @param {'parchment'|'monochrome'} theme 
 */
export function printLaporanPerjodohan(theme = 'monochrome') {
  if (!window.LAST_PERJODOHAN_DATA) {
    showToast('Hitung pitung perjodohan terlebih dahulu sebelum mencetak.');
    return;
  }

  const hasil = window.LAST_PERJODOHAN_DATA;
  const mantuList = window.LAST_MANTU_DATA || cariRekomendasiTanggalMantu(hasil.totalNeptu);
  const keharmonisan = hasil.summary.keharmonisan || getTingkatKeharmonisan(hasil.summary.skorKeselarasan);

  let container = document.getElementById('laporan-cetak-pdf');
  if (!container) {
    container = document.createElement('div');
    container.id = 'laporan-cetak-pdf';
    container.className = 'print-only-document';
    document.body.appendChild(container);
  }

  const isParchment = theme === 'parchment';
  container.className = `print-only-document ${isParchment ? 'theme-parchment parchment-theme' : 'theme-monochrome monochrome-theme'}`;

  container.innerHTML = `
    <div class="sheet a4-page space-y-4">
      <!-- Kop Surat Kasultanan Resmi -->
      <div class="kop-surat flex items-center justify-between border-b-2 border-prada pb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full border-2 border-prada flex items-center justify-center font-cinzel text-xl font-bold text-prada">
            ꦗ
          </div>
          <div>
            <h2 class="font-cinzel text-lg font-bold tracking-wider text-prada">JAGAD JAWA &middot; SERAT PITUNG SALAKI RABI</h2>
            <p class="text-[10px] tracking-wide text-sogan-300">Pawiyatan Luhur Budaya Nusantara &bull; Surat Katrangan Petungan Perjodohan Jawa</p>
          </div>
        </div>
        <div class="text-right text-[10px] font-mono text-sogan-400">
          <div>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div>Dokumen Resmi Kasultanan</div>
        </div>
      </div>

      <!-- Profil Kedua Calon Mempelai -->
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg border border-sogan-700 bg-sogan-950/40 space-y-1">
          <span class="text-[10px] font-mono uppercase text-prada font-bold block">Calon Pengantin Wanita (♀)</span>
          <div class="font-bold text-sm text-sogan-100">${hasil.wanita.nama}</div>
          <div class="text-[11px] text-sogan-300">Weton: <strong>${hasil.wanita.hari} ${hasil.wanita.pasaran}</strong> (Neptu: ${hasil.wanita.neptu})</div>
          <div class="text-[10px] text-sogan-400">Aksara: ${hasil.wanita.aksaraDepan} / ${hasil.wanita.aksaraBelakang}</div>
        </div>

        <div class="p-3 rounded-lg border border-sogan-700 bg-sogan-950/40 space-y-1">
          <span class="text-[10px] font-mono uppercase text-prada font-bold block">Calon Pengantin Pria (♂)</span>
          <div class="font-bold text-sm text-sogan-100">${hasil.pria.nama}</div>
          <div class="text-[11px] text-sogan-300">Weton: <strong>${hasil.pria.hari} ${hasil.pria.pasaran}</strong> (Neptu: ${hasil.pria.neptu})</div>
          <div class="text-[10px] text-sogan-400">Aksara: ${hasil.pria.aksaraDepan} / ${hasil.pria.aksaraBelakang}</div>
        </div>
      </div>

      <!-- Ringkasan Skor & Predikat Keharmonisan -->
      <div class="p-3 rounded-lg border border-prada bg-sogan-900/30 flex items-center justify-between text-xs">
        <div>
          <span class="text-[10px] font-mono text-prada uppercase font-bold block">Hasil Evaluasi Keselarasan Pitung</span>
          <div class="font-marcellus text-base font-bold text-sogan-100">${keharmonisan.predikat}</div>
          <div class="text-[11px] text-sogan-300">Total Neptu Gabungan: <strong class="text-prada font-mono">${hasil.totalNeptu}</strong> &bull; Proporsi: ${hasil.summary.baik} Baik, ${hasil.summary.campur} Netral, ${hasil.summary.buruk} Ujian</div>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold font-mono text-prada">${hasil.summary.skorKeselarasan}%</span>
        </div>
      </div>

      <!-- Tabel 7 Metode Pitung Jawa -->
      <div>
        <span class="text-[10px] font-mono text-prada uppercase font-bold tracking-wider block mb-1">Rincian Petungan 7 Metode Primbon Jawa</span>
        <table class="w-full text-xs border border-sogan-700 text-left">
          <thead>
            <tr class="border-b border-sogan-700 bg-sogan-950 text-prada text-[10px] uppercase font-mono">
              <th class="p-2 w-8">No</th>
              <th class="p-2 w-40">Metode &amp; Nama Petung</th>
              <th class="p-2">Arti &amp; Wedharan Falsafah</th>
              <th class="p-2 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            ${hasil.rows.map(r => `
              <tr class="border-b border-sogan-800 text-[11px]">
                <td class="p-2 font-bold text-prada">${r.no}</td>
                <td class="p-2 font-bold">${r.h.nama} <div class="text-[9px] text-sogan-400 font-mono">${r.namaMetode}</div></td>
                <td class="p-2">${r.h.arti} <div class="text-[9px] text-sogan-400 font-mono">${r.rumus}</div></td>
                <td class="p-2 text-center font-bold text-[10px] uppercase">${r.h.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${(window.LAST_STATUS_HUBUNGAN === 'sudah_menikah') ? `
      <!-- Panduan Gesang Bebrayan Pasutri (Sampun Nikah) -->
      <div class="p-3 rounded-lg border border-sogan-700 bg-sogan-950/30 text-[11px] space-y-1">
        <span class="text-[10px] font-mono text-prada uppercase font-bold tracking-wider block">Pituduh Gesang Bebrayan &amp; Pangruwating Pasulayan (Pasutri)</span>
        <p class="text-sogan-200 leading-relaxed italic">"${keharmonisan.saranKultural}"</p>
        <p class="text-[10px] text-sogan-400 mt-1">Urip bebrayan punika sarana ngasuh katresnan sejati, dados tuladha kautaman tumrap para putra, dumugi kaken-kaken ninen-ninen ing karaharjan.</p>
      </div>
      ` : `
      <!-- Usulan 5 Tanggal Mantu Rahayu -->
      <div>
        <span class="text-[10px] font-mono text-prada uppercase font-bold tracking-wider block mb-1">Usulan Tanggal Mantu Rahayu (Dino Ijo &amp; Panca Sudha)</span>
        <div class="grid grid-cols-5 gap-2 text-[10px]">
          ${mantuList.slice(0, 5).map(m => `
            <div class="p-2 rounded border border-sogan-700 bg-sogan-950/30 text-center space-y-0.5">
              <strong class="text-prada block">${m.formattedDate.split(',')[1]?.trim() || m.formattedDate}</strong>
              <span class="text-sogan-200 block font-semibold">${m.weton}</span>
              <span class="text-[9px] px-1.5 py-0.2 rounded bg-sogan-900 border border-sogan-700 text-amber-300 font-mono inline-block">${m.predikat}</span>
            </div>
          `).join('')}
        </div>
      </div>
      `}

      <!-- Disclaimer Etis & Kultural Perjodohan -->
      <div class="p-2.5 rounded-lg border border-sogan-700 bg-sogan-950/50 text-[10px] text-sogan-300 space-y-1">
        <strong class="text-prada block uppercase font-mono tracking-wider">Amanat Kultural &amp; Mawas Diri:</strong>
        <p class="leading-relaxed">${DISCLAIMER_ETIS_PERJODOHAN}</p>
      </div>

      <!-- Tanda Tangan & Cap Pawiyatan -->
      <div class="flex justify-between items-end pt-3 text-[11px] border-t border-sogan-800">
        <div>
          <span class="text-sogan-400 text-[10px]">Mugi Hyang Widhi tansah maringi berkah tentrem ing bebrayan.</span>
        </div>
        <div class="text-center">
          <div class="font-marcellus text-prada font-bold text-xs">JAGAD JAWA NUSANTARA</div>
          <div class="h-10 flex items-center justify-center italic text-sogan-400 text-[10px]">[ Cap Pawiyatan Resmi ]</div>
          <div class="text-[10px] text-sogan-300 border-t border-sogan-700 pt-1">Pawukon &amp; Primbon Adipati</div>
        </div>
      </div>
    </div>
  `;

  const namaPria = hasil.pria?.nama ? hasil.pria.nama.toUpperCase() : 'CALON KELUARGA';
  const namaWanita = hasil.wanita?.nama ? hasil.wanita.nama.toUpperCase() : '';
  const customTitle = `Jagad Jawa — Petung Salaki Rabi ${namaPria}${namaWanita ? ' & ' + namaWanita : ''}`;

  if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}
