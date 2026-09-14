/**
 * Jagad Jawa — Portal Budaya Luhur Nusantara
 * Modular Entry Point | Jagad Jawa
 * Architecture: ES Modules (data / modules / ui)
 */

import { showToast, copyToClipboard } from './ui/toast.js';
import { switchTab, toggleMobileMenu, printSection } from './ui/navigation.js';
import { playGamelanTone, toggleKetawangPuspawarna, playDalangFX } from './modules/audio.js';
import {
  HARI, NEPTU_HARI, PASARAN, NEPTU_PASARAN, BULAN_MASEHI, BULAN_JAWA, WINDU,
  WUKU, DUNUNGE, GRID, KETERANGAN, getDayInfo
} from './data/calendar.js';
import {
  KARAKTER, PADEWAN, getFaalakiah, getAsesoris,
  PANCASUDA_ARTI, PAARASAN_ARTI, KAMAROKAN_ARTI
} from './data/personality.js';
import {
  AKSARA_PERJODOHAN, HASIL_I_JODOH, HASIL_II_JODOH, HASIL_III_JODOH,
  HASIL_IV_JODOH, HASIL_V_JODOH, HASIL_VI_JODOH
} from './data/marriage.js';
import { TARGET_HARI_SELAMETAN, TARGET_PASARAN_SELAMETAN, JENIS_SELAMETAN } from './data/selametan.js';
import { AKSARA_NGLEGENA } from './data/aksara.js';
import { WAYANG_CHARACTERS } from './data/wayang.js';
import { PITUTUR_LIST, QUIZ_QUESTIONS } from './data/pitutur.js';

// ─── Expose globals for inline HTML handlers ───────────────────────────────
window.switchTab = switchTab;
window.toggleMobileMenu = toggleMobileMenu;
window.printSection = printSection;
window.showToast = showToast;
window.playGamelanTone = playGamelanTone;
window.toggleKetawangPuspawarna = () => toggleKetawangPuspawarna(showToast);
window.playDalangFX = (type) => playDalangFX(type, showToast);

// ─── KALENDER ──────────────────────────────────────────────────────────────
function initKalenderSelects() {
  const sel = document.getElementById('bulanSel');
  if (!sel) return;
  sel.innerHTML = '';
  BULAN_MASEHI.forEach((b, i) => {
    const o = document.createElement('option');
    o.value = i + 1; o.textContent = b;
    sel.appendChild(o);
  });
  const now = new Date();
  sel.value = now.getMonth() + 1;
  const tahunInput = document.getElementById('tahunInput');
  if (tahunInput) tahunInput.value = now.getFullYear();

  const kbox = document.getElementById('keteranganKodeBox');
  if (kbox) {
    kbox.innerHTML = '';
    KETERANGAN.forEach(([k, v]) => {
      const d = document.createElement('div');
      d.innerHTML = `<b class="text-prada font-mono">${k}</b>: ${v}`;
      kbox.appendChild(d);
    });
  }
}

function buildWatermarkKalender() {
  const layer = document.getElementById('calWatermark');
  if (!layer) return;
  layer.innerHTML = '';
  const card = document.getElementById('kalenderCard');
  const w = Math.max(card.scrollWidth, 900);
  const h = Math.max(card.scrollHeight, 600);
  const stepX = 140, stepY = 70;
  const cols = Math.ceil(w / stepX) + 4;
  const rows = Math.ceil(h / stepY) + 4;
  const frag = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = document.createElement('span');
      s.textContent = 'JAGAD JAWA';
      s.style.left = (c * stepX - stepY) + 'px';
      s.style.top = (r * stepY) + 'px';
      frag.appendChild(s);
    }
  }
  layer.appendChild(frag);
}

window.renderKalender = function () {
  const bulan = parseInt(document.getElementById('bulanSel').value);
  const tahun = parseInt(document.getElementById('tahunInput').value);
  const daysInMonth = new Date(Date.UTC(tahun, bulan, 0)).getUTCDate();

  const first = new Date(Date.UTC(tahun, bulan - 1, 1));
  const firstWeekday = first.getUTCDay();
  const gridStart = new Date(first);
  gridStart.setUTCDate(1 - firstWeekday);

  const last = new Date(Date.UTC(tahun, bulan - 1, daysInMonth));
  const lastWeekday = last.getUTCDay();
  const gridEnd = new Date(last);
  gridEnd.setUTCDate(daysInMonth + (6 - lastWeekday));

  const totalDays = Math.round((gridEnd - gridStart) / 86400000) + 1;
  const totalWeeks = totalDays / 7;

  const janInfo = getDayInfo(tahun, 1, 1);
  const cornerHijriYear = janInfo.hijri[2];

  document.getElementById('printTitleKalender').textContent =
    BULAN_MASEHI[bulan - 1].toUpperCase() + ' ' + tahun + '  ·  ' + cornerHijriYear + ' H — Jagad Jawa';

  let html = `<tr class="bg-gradient-to-r from-[#2a3660] to-[#1b2540] text-paper text-white text-center font-bold">
    <td class="p-3 text-prada font-mono text-sm">${tahun}</td>
    <td colspan="7" class="p-3 font-marcellus text-xl tracking-wider text-prada">${BULAN_MASEHI[bulan - 1].toUpperCase()}</td>
    <td class="p-3 text-prada font-mono text-sm">${cornerHijriYear} H</td>
  </tr>`;

  html += `<tr class="bg-[#dfd1ac] font-bold text-center text-[11px] border-b-2 border-prada"><td></td>`;
  HARI.forEach((h, i) => {
    html += `<td class="p-2 ${i === 0 ? 'text-ala' : ''}">${h.toUpperCase()} <span class="bg-black/10 px-1 py-0.5 rounded font-mono text-[10px] ml-1">${NEPTU_HARI[i]}</span></td>`;
  });
  html += `<td></td></tr>`;

  for (let w = 0; w < totalWeeks; w++) {
    const weekStart = new Date(gridStart);
    weekStart.setUTCDate(gridStart.getUTCDate() + w * 7);

    const wInfo = getDayInfo(weekStart.getUTCFullYear(), weekStart.getUTCMonth() + 1, weekStart.getUTCDate());
    const wukuId = wInfo.wukuId;
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);

    let repMonthLabel = '', repYearLabel = '';
    let cellsHtml = '';
    for (let d = 0; d < 7; d++) {
      const cur = new Date(weekStart);
      cur.setUTCDate(weekStart.getUTCDate() + d);
      const inMonth = (cur.getUTCMonth() + 1 === bulan && cur.getUTCFullYear() === tahun);
      if (!inMonth) {
        cellsHtml += '<td class="p-2 bg-black/5 border border-black/10 h-16"></td>';
        continue;
      }
      const info = getDayInfo(cur.getUTCFullYear(), cur.getUTCMonth() + 1, cur.getUTCDate());
      const [code, color, gede] = GRID[wukuId][d];
      const bgCls = color === 'R' ? 'bg-[#a8402f] text-white' : 'bg-[#3c7350] text-white';
      const neptuC = NEPTU_HARI[d] + NEPTU_PASARAN[info.pasaranId];
      if (!repMonthLabel) {
        repMonthLabel = BULAN_JAWA[info.hijri[1] - 1];
        repYearLabel = WINDU[((info.ajYear - 1955) % 8 + 8) % 8] + ' ' + info.ajYear;
      }
      cellsHtml += `<td class="p-1.5 sm:p-2.5 ${bgCls} border border-black/10 h-16 sm:h-20 align-top">
        <div class="flex justify-between items-baseline font-bold font-marcellus text-base sm:text-lg">
          <span>${cur.getUTCDate()}</span>
          <span class="font-mono text-[10px] opacity-80 border-b border-current">${neptuC}</span>
        </div>
        <div class="font-bold text-[11px] sm:text-xs tracking-wide ${gede ? 'text-prada-light font-black drop-shadow' : ''}">${PASARAN[info.pasaranId].toUpperCase()}</div>
        <div class="flex justify-between text-[10px] opacity-85 mt-1 font-mono">
          <span>${info.hijri[0]}</span>
          <span class="font-bold">${code}</span>
        </div>
      </td>`;
    }

    html += `<tr>
      <td class="p-2 text-center align-middle font-bold text-xs bg-[#e8dfc4] border border-black/10 ${isNgisor ? 'bg-[#e8b98f]' : ''}">
        <b class="font-marcellus text-[13px] block">${WUKU[wukuId].toUpperCase()}</b>
        <div class="text-[10px] italic opacity-80">${DUNUNGE[wukuId]}</div>
        ${isNgisor ? '<div class="text-[9px] text-ala font-bold">⚠ ngisor</div>' : ''}
      </td>
      ${cellsHtml}
      <td class="p-2 text-center align-middle font-bold text-xs bg-[#e8dfc4] border border-black/10 ${isNgisor ? 'bg-[#e8b98f]' : ''}">
        <b class="font-marcellus text-[13px] block">${WUKU[wukuId].toUpperCase()}</b>
        <div class="text-[10px] italic opacity-80">${DUNUNGE[wukuId]}</div>
        <div class="text-[9px] font-mono opacity-80 mt-1">${repMonthLabel} ${repYearLabel}</div>
      </td>
    </tr>`;
  }

  document.getElementById('calTable').innerHTML = html;
  buildWatermarkKalender();
};

// ─── KEPRIBADIAN ───────────────────────────────────────────────────────────
function initTahunHitungSelect() {
  const sel = document.getElementById('tahunHitungKepribadian');
  if (!sel) return;
  sel.innerHTML = '';
  for (let y = 1950; y <= 2040; y++) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    if (y === 2026) opt.selected = true;
    sel.appendChild(opt);
  }
}

window.updateKepribadianQuickInfo = function () {
  const tglVal = document.getElementById('tglLahirKepribadian')?.value;
  if (!tglVal) return;
  const [y, m, d] = tglVal.split('-').map(Number);
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];

  document.getElementById('outHariPasaranPribadi').innerText = `${dino} ${pas}`;
  document.getElementById('outNeptuWukuPribadi').innerText = `Neptu ${neptu} · Wuku ${wukuName}`;
};

window.hitungKepribadianLengkap = function () {
  const tglVal = document.getElementById('tglLahirKepribadian').value;
  const nama = document.getElementById('namaKepribadian').value.trim() || 'Raden Hamengku';
  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian').value) || 2026;
  const alamatTinggal = document.getElementById('alamatTinggal').value.trim() || 'Soditan';
  const alamatKerja = document.getElementById('alamatKerja').value.trim() || 'Madegondo';

  if (!tglVal) { showToast('Pilih tanggal lahir terlebih dahulu.'); return; }
  const [y, m, d] = tglVal.split('-').map(Number);
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuNo = info.wukuId + 1;
  const wukuName = WUKU[info.wukuId];
  const umur = tahunHitung - y;

  const digitSum = [...String(y) + String(m) + String(d)].reduce((a, c) => a + (+c || 0), 0);
  const karakter = KARAKTER[digitSum % 9] || KARAKTER[0];
  const padewan = PADEWAN[(umur - 1) % 12];

  const bincilPcs = ["Wasesa Segara", "Sumur Sinaba", "Lebu Katiyup Angin", "Satriya Wibawa", "Tunggak Semi", "Satriya Wirang", "Bumi Kapetak"][(info.wukuId * 7 + info.pasaranId * 3) % 7];
  const bincilPaa = ["Lakuning Rembulan", "Aras Tuding", "Lakuning Bumi", "Lakuning Srengenge", "Lakuning Lintang", "Lakuning Banyu", "Lakuning Geni", "Lakuning Angin", "Aras Kembang", "Aras Pepet"][(info.wukuId * 7 + info.weekdayId + info.pasaranId) % 10];
  const bincilKam = ["Sanggar Waringin", "Mantri Sinarojo", "Macan Ketawan", "Nuju Padu", "Kala Tinantang", "Nuju Pati"][(info.wukuId * 7 + info.weekdayId * 2) % 6];

  const faal = getFaalakiah(nama);
  const aseso = getAsesoris(m, d);

  const html = `
    <div class="border-b border-sogan-700 pb-3 flex items-center justify-between">
      <div>
        <span class="text-[10px] font-mono text-prada uppercase">Pawiyatan · Jagad Jawa</span>
        <h3 class="font-marcellus text-lg sm:text-xl font-bold text-prada">${nama.toUpperCase()}</h3>
      </div>
      <div class="text-right">
        <span class="text-[10px] text-sogan-400">Weton & Neptu</span>
        <div class="font-marcellus font-bold text-base text-sogan-100">${dino} ${pas} (${neptu})</div>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-wulung p-3 rounded-xl border border-sogan-800">
      <div><span class="text-sogan-400 block">Wuku:</span><strong>${wukuName} (${wukuNo})</strong></div>
      <div><span class="text-sogan-400 block">Umur:</span><strong>${umur} Tahun</strong></div>
      <div><span class="text-sogan-400 block">Palengahan:</span><strong>${alamatTinggal}</strong></div>
      <div><span class="text-sogan-400 block">Padamelan:</span><strong>${alamatKerja}</strong></div>
    </div>
    <div class="space-y-2">
      <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-1.5"><i class="fa-solid fa-compass"></i> Bincil & Petungan Jawa</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800">
          <span class="text-[10px] text-sogan-400 uppercase">Pancasuda</span>
          <div class="font-bold text-prada">${bincilPcs}</div>
          <p class="text-[10px] text-sogan-300 mt-0.5">${PANCASUDA_ARTI[bincilPcs] || ''}</p>
        </div>
        <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800">
          <span class="text-[10px] text-sogan-400 uppercase">Paarasan</span>
          <div class="font-bold text-prada">${bincilPaa}</div>
          <p class="text-[10px] text-sogan-300 mt-0.5">${PAARASAN_ARTI[bincilPaa] || ''}</p>
        </div>
        <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800">
          <span class="text-[10px] text-sogan-400 uppercase">Kamarokan</span>
          <div class="font-bold text-prada">${bincilKam}</div>
          <p class="text-[10px] text-sogan-300 mt-0.5">${KAMAROKAN_ARTI[bincilKam] || ''}</p>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-1.5"><i class="fa-solid fa-gem"></i> Asesoris & Ageman</h4>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-wulung p-3 rounded-xl border border-sogan-800">
        <div><span class="text-sogan-400 block">Watu Mulia:</span><strong class="text-prada-light">${aseso.watu}</strong></div>
        <div><span class="text-sogan-400 block">Warna Ageman:</span><strong>${aseso.warna}</strong></div>
        <div><span class="text-sogan-400 block">Kembang:</span><strong>${aseso.kembang}</strong></div>
        <div><span class="text-sogan-400 block">Dino Becik:</span><strong>${aseso.dino}</strong></div>
      </div>
    </div>
    <div class="p-3.5 rounded-xl bg-sogan-950 border border-sogan-700 text-xs space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="font-bold text-prada font-marcellus">Faalakiah Asma: ${faal.nabi} (Kode ${faal.kode})</span>
        <span class="text-[10px] font-mono text-sogan-400">Jumlah Aksara: ${faal.sum}</span>
      </div>
      <p class="text-sogan-200 leading-relaxed">${faal.desc}</p>
    </div>
  `;

  document.getElementById('hasilKepribadianBox').innerHTML = html;
  document.getElementById('btnPrintKepribadian').style.display = 'inline-block';
  showToast('Nujum kepribadian kasil kapetung!');
};

// ─── PERJODOHAN ────────────────────────────────────────────────────────────
function initPerjodohanSelects() {
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
}

window.autoDetectAksara = function (side) {
  const nama = document.getElementById('nama' + side).value.trim();
  if (!nama) return;
  const parts = nama.replace(/\s+/g, ' ').split(' ');
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].slice(-1).toUpperCase();
  const map = { 'A': 'HA', 'B': 'BA', 'C': 'CA', 'D': 'DA', 'E': 'HA', 'F': 'PA', 'G': 'GA', 'H': 'HA', 'I': 'YA', 'J': 'JA', 'K': 'KA', 'L': 'LA', 'M': 'MA', 'N': 'NA', 'O': 'HA', 'P': 'PA', 'R': 'RA', 'S': 'SA', 'T': 'TA', 'U': 'WA', 'W': 'WA', 'Y': 'YA' };
  document.getElementById('aksaraDepan' + side).value = map[first] || 'HA';
  document.getElementById('aksaraBelakang' + side).value = map[last] || 'HA';
};

window.autoWetonPerjodohan = function (side) {
  const tgl = document.getElementById('tgl' + side).value;
  if (!tgl) return;
  const [y, m, d] = tgl.split('-').map(Number);
  const info = getDayInfo(y, m, d);
  document.getElementById('hari' + side).value = HARI[info.weekdayId];
  document.getElementById('pasaran' + side).value = PASARAN[info.pasaranId];
  window.updateNeptuPerjodohan(side);
};

window.updateNeptuPerjodohan = function (side) {
  const h = document.getElementById('hari' + side).value;
  const p = document.getElementById('pasaran' + side).value;
  const hIdx = HARI.indexOf(h);
  const pIdx = PASARAN.indexOf(p);
  const n = (hIdx >= 0 ? NEPTU_HARI[hIdx] : 0) + (pIdx >= 0 ? NEPTU_PASARAN[pIdx] : 0);
  document.getElementById('neptu' + side + 'Badge').innerText = n;
};

window.hitungNujumPerjodohan = function () {
  const neptuP = parseInt(document.getElementById('neptuPBadge').innerText) || 0;
  const neptuL = parseInt(document.getElementById('neptuLBadge').innerText) || 0;
  const hariP = document.getElementById('hariP').value;
  const hariL = document.getElementById('hariL').value;
  const namaP = document.getElementById('namaP').value || 'Wanita';
  const namaL = document.getElementById('namaL').value || 'Pria';

  const akDP = document.getElementById('aksaraDepanP').value;
  const akBP = document.getElementById('aksaraBelakangP').value;
  const akDL = document.getElementById('aksaraDepanL').value;
  const akBL = document.getElementById('aksaraBelakangL').value;

  const totalNeptu = neptuP + neptuL;
  const sisaI = totalNeptu % 4;
  const sisaII = totalNeptu % 5;
  const sisaIII = totalNeptu % 7;

  const getVal = (code, type) => {
    const found = AKSARA_PERJODOHAN.find(a => a.kode === code);
    return found ? (type === 'iv' ? found.iv : found.vvi) : 1;
  };

  const totalAksaraIV = getVal(akDP, 'iv') + getVal(akBP, 'iv') + getVal(akDL, 'iv') + getVal(akBL, 'iv');
  const sisaIV = totalAksaraIV % 7;
  const totalAksaraVVI = getVal(akDP, 'vvi') + getVal(akDL, 'vvi');
  const sisaV = totalAksaraVVI % 7;
  const sisaVI = totalAksaraVVI % 6;

  const rows = [
    { no: 'I', h: HASIL_I_JODOH[sisaI], rumus: `Neptu ${totalNeptu} ÷ 4 sisa ${sisaI}` },
    { no: 'II', h: HASIL_II_JODOH[sisaII], rumus: `Neptu ${totalNeptu} ÷ 5 sisa ${sisaII}` },
    { no: 'III', h: HASIL_III_JODOH[sisaIII], rumus: `Neptu ${totalNeptu} ÷ 7 sisa ${sisaIII}` },
    { no: 'IV', h: HASIL_IV_JODOH[sisaIV], rumus: `Aksara total ${totalAksaraIV} ÷ 7 sisa ${sisaIV}` },
    { no: 'V', h: HASIL_V_JODOH[sisaV], rumus: `Aksara depan ${totalAksaraVVI} ÷ 7 sisa ${sisaV}` },
    { no: 'VI', h: HASIL_VI_JODOH[sisaVI], rumus: `Aksara depan ${totalAksaraVVI} ÷ 6 sisa ${sisaVI}` },
    { no: 'VII', h: { nama: 'Yuwana / Becik', arti: 'Kombinasi dina becik rahayu', status: 'baik' }, rumus: `${hariP} + ${hariL}` }
  ];

  let tbody = '';
  let baik = 0, buruk = 0, campur = 0;
  rows.forEach(r => {
    if (r.h.status === 'baik') baik++;
    else if (r.h.status === 'buruk') buruk++;
    else campur++;

    const badge = r.h.status === 'baik' ? 'bg-emerald-950 text-emerald-300 border-emerald-500' : (r.h.status === 'buruk' ? 'bg-rose-950 text-rose-300 border-rose-500' : 'bg-amber-950 text-amber-300 border-amber-500');
    const badgeLabel = r.h.status === 'baik' ? '✅ BAIK' : (r.h.status === 'buruk' ? '❌ BURUK' : '• CAMPUR');

    tbody += `<tr class="border-b border-sogan-800/80 hover:bg-sogan-900/30">
      <td class="p-3 font-bold text-prada">${r.no}</td>
      <td class="p-3 font-marcellus font-bold text-sogan-100">${r.h.nama}</td>
      <td class="p-3 text-sogan-200">${r.h.arti} <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${r.rumus}</div></td>
      <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge}">${badgeLabel}</span></td>
    </tr>`;
  });

  document.getElementById('hasilPerjodohanBody').innerHTML = tbody;
  document.getElementById('perjodohanPairInfo').innerHTML = `${namaP} (${neptuP}) · ${namaL} (${neptuL}) · Jumlah Neptu: <strong class="text-prada font-mono">${totalNeptu}</strong>`;
  document.getElementById('ringkasanPerjodohanBox').innerHTML = `
    <div class="font-bold text-prada text-sm">Ringkasan Kecocokan Pitung Jawa:</div>
    <p class="text-sogan-200">Dari 7 perhitungan metode primbon: <strong class="text-emerald-400">${baik} Baik</strong>, <strong class="text-rose-400">${buruk} Kurang Baik</strong>, dan <strong class="text-amber-400">${campur} Campuran</strong>. Hubungan memiliki keharmonisan yang perlu dijaga dengan saling menghargai.</p>
  `;
  document.getElementById('hasilPerjodohanCard').classList.remove('hidden');
  document.getElementById('btnPrintPerjodohan').style.display = 'inline-block';
  showToast('Pitung perjodohan kasil kapetung!');
};

// ─── SELAMETAN ─────────────────────────────────────────────────────────────
window.hitungSelametan = function () {
  const input = document.getElementById('tglWafatInput').value;
  if (!input) { showToast('Pilih tanggal wafat terlebih dahulu.'); return; }

  const [yy, mm, dd] = input.split('-').map(Number);
  const death = new Date(Date.UTC(yy, mm - 1, dd));
  const info = getDayInfo(yy, mm, dd);
  const hariWafat = HARI[info.weekdayId];
  const pasaranWafat = PASARAN[info.pasaranId];
  const hariIdx = info.weekdayId;

  document.getElementById('geblakInfoBox').style.display = 'block';
  document.getElementById('geblakInfoBox').innerHTML = `
    <span class="text-sogan-400 block text-[11px]">Dina Wafat / Geblak:</span>
    <strong class="text-prada text-sm">${hariWafat} ${pasaranWafat}</strong> · ${dd} ${BULAN_MASEHI[mm - 1]} ${yy}
  `;
  document.getElementById('selametanSubtitle').innerText = `Geblak: ${hariWafat} ${pasaranWafat}, ${dd} ${BULAN_MASEHI[mm - 1]} ${yy}`;

  const tbody = document.querySelector('#tabelHasilSelametan tbody');
  tbody.innerHTML = '';

  JENIS_SELAMETAN.forEach(j => {
    const targetH = TARGET_HARI_SELAMETAN[hariIdx][j.idx];
    const targetP = TARGET_PASARAN_SELAMETAN[pasaranWafat][j.idx];

    let bestDate = null;
    for (let delta = 0; delta <= 25; delta++) {
      for (const sign of (delta === 0 ? [0] : [1, -1])) {
        const check = new Date(death);
        check.setUTCDate(death.getUTCDate() + j.approx + sign * delta);
        const chkInfo = getDayInfo(check.getUTCFullYear(), check.getUTCMonth() + 1, check.getUTCDate());
        if (HARI[chkInfo.weekdayId] === targetH && PASARAN[chkInfo.pasaranId] === targetP) {
          bestDate = check;
          break;
        }
      }
      if (bestDate) break;
    }

    const tr = document.createElement('tr');
    tr.className = 'border-b border-sogan-800/60 hover:bg-sogan-900/30';
    if (bestDate) {
      const diffDays = Math.round((bestDate - death) / 86400000);
      tr.innerHTML = `
        <td class="p-2.5 font-bold text-sogan-100">${j.nama}<br><span class="text-[10px] text-sogan-400 font-normal">~${j.approx} dina</span></td>
        <td class="p-2.5 font-bold text-prada">${targetH} ${targetP}</td>
        <td class="p-2.5 text-sogan-200">${bestDate.getUTCDate()} ${BULAN_MASEHI[bestDate.getUTCMonth()]} ${bestDate.getUTCFullYear()}<br><span class="text-[10px] text-sogan-400">wiwit jam 18.00 sore</span></td>
        <td class="p-2.5 text-emerald-400 font-mono text-[11px]">${diffDays} dina saking geblak</td>
      `;
    }
    tbody.appendChild(tr);
  });

  document.getElementById('btnPrintSelametan').style.display = 'inline-block';
  showToast('Selametan kasil kapetung!');
};

// ─── GAMELAN ───────────────────────────────────────────────────────────────
const saronScales = {
  slendro: [
    { note: '1 (Ji)', freq: 261.63, key: '1' }, { note: '2 (Ro)', freq: 293.66, key: '2' },
    { note: '3 (Lu)', freq: 329.63, key: '3' }, { note: '5 (Ma)', freq: 392.00, key: '5' },
    { note: '6 (Nem)', freq: 440.00, key: '6' }, { note: 'i (Ji T)', freq: 523.25, key: '7' },
    { note: 'ż (Ro T)', freq: 587.33, key: '8' }
  ],
  pelog: [
    { note: '1 (Ji)', freq: 261.63, key: '1' }, { note: '2 (Ro)', freq: 280.00, key: '2' },
    { note: '3 (Lu)', freq: 311.13, key: '3' }, { note: '4 (Pat)', freq: 349.23, key: '4' },
    { note: '5 (Ma)', freq: 392.00, key: '5' }, { note: '6 (Nem)', freq: 415.30, key: '6' },
    { note: '7 (Pi)', freq: 493.88, key: '7' }
  ]
};
let currentGamelanLaras = 'slendro';

function renderGamelanKeys() {
  const container = document.getElementById('saronContainer');
  if (!container) return;
  container.innerHTML = '';
  const list = saronScales[currentGamelanLaras];

  list.forEach((item, idx) => {
    const heightPercent = 100 - (idx * 5);
    const keyEl = document.createElement('div');
    keyEl.className = `cursor-pointer flex flex-col justify-between items-center p-2 rounded-lg bg-gradient-to-b from-prada via-sogan-400 to-sogan-700 border border-prada-light shadow-md hover:brightness-110 active:scale-95 transition text-keraton select-none`;
    keyEl.style.height = `${heightPercent}%`;
    keyEl.id = `saron-btn-${idx}`;
    keyEl.innerHTML = `
      <div class="w-2.5 h-2.5 rounded-full bg-keraton border border-prada-light"></div>
      <span class="font-black text-xs sm:text-sm">${item.note}</span>
      <span class="text-[9px] font-mono font-bold bg-black/20 px-1 rounded">[${item.key}]</span>
    `;
    keyEl.onclick = () => {
      playGamelanTone(item.freq, 'saron');
      keyEl.classList.add('hit-anim');
      setTimeout(() => keyEl.classList.remove('hit-anim'), 150);
    };
    container.appendChild(keyEl);
  });
}

window.setGamelanLaras = function (laras) {
  currentGamelanLaras = laras;
  document.getElementById('larasSlendroBtn').className = laras === 'slendro' ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-sogan-700 text-prada' : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-keraton text-sogan-300';
  document.getElementById('larasPelogBtn').className = laras === 'pelog' ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-sogan-700 text-prada' : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-keraton text-sogan-300';
  renderGamelanKeys();
  showToast(`Laras kagantos: ${laras.toUpperCase()}`);
};

window.hitBonang = function (num, freq, el) {
  playGamelanTone(freq, 'bonang');
  if (el) {
    el.classList.add('hit-anim');
    setTimeout(() => el.classList.remove('hit-anim'), 150);
  }
};

// ─── AKSARA ────────────────────────────────────────────────────────────────
window.convertLatinToJawa = function () {
  const input = document.getElementById('latinInput').value.toLowerCase().trim();
  const outputEl = document.getElementById('jawaOutput');
  const countEl = document.getElementById('charCountLabel');

  if (!input) {
    outputEl.innerText = 'ꦲꦤꦕꦫꦏ';
    countEl.innerText = '0 Karakter';
    return;
  }

  function applySandhangan(base, vokal) {
    if (vokal === 'i') return base + 'ꦶ';
    if (vokal === 'u') return base + 'ꦸ';
    if (vokal === 'e') return base + 'ꦼ';
    if (vokal === 'é') return 'ꦺ' + base;
    if (vokal === 'o') return 'ꦺ' + base + 'ꦴ';
    return base;
  }

  let res = '';
  let i = 0;
  while (i < input.length) {
    if (input[i] === ' ') { res += ' '; i++; continue; }
    let threeChar = input.substring(i, i + 3);
    let twoChar = input.substring(i, i + 2);

    if (['nya', 'dha', 'tha', 'nga'].includes(threeChar)) {
      let base = AKSARA_NGLEGENA[threeChar] || 'ꦲ';
      i += 3;
      if (i < input.length && ['a', 'i', 'u', 'e', 'é', 'o'].includes(input[i])) {
        let v = input[i];
        if (v !== 'a') res += applySandhangan(base, v);
        else res += base;
        i++;
      } else res += base;
    } else if (twoChar in AKSARA_NGLEGENA) {
      res += AKSARA_NGLEGENA[twoChar];
      i += 2;
    } else {
      let char = input[i];
      let next = input[i + 1] || '';
      let syl = char + (['a', 'i', 'u', 'e', 'é', 'o'].includes(next) ? next : '');
      if (syl.length === 2) {
        let baseAksara = AKSARA_NGLEGENA[char + 'a'] || 'ꦲ';
        if (syl[1] === 'a') res += baseAksara;
        else res += applySandhangan(baseAksara, syl[1]);
        i += 2;
      } else {
        if (input.substring(i, i + 2) === 'ng') { res += 'ꦁ'; i += 2; }
        else if (char === 'r') { res += 'ꦂ'; i++; }
        else if (char === 'h') { res += 'ꦃ'; i++; }
        else if (AKSARA_NGLEGENA[char + 'a']) { res += AKSARA_NGLEGENA[char + 'a'] + '꧀'; i++; }
        else { res += char; i++; }
      }
    }
  }

  outputEl.innerText = res || 'ꦲꦤꦕꦫꦏ';
  countEl.innerText = `${input.length} Karakter`;
};

window.setSampleAksara = (text) => {
  document.getElementById('latinInput').value = text;
  window.convertLatinToJawa();
};

window.clearAksaraInput = () => {
  document.getElementById('latinInput').value = '';
  window.convertLatinToJawa();
  showToast("Kolom teks aksara sampun dipun resiki.");
};

window.copyJawaText = () => {
  const text = document.getElementById('jawaOutput').innerText;
  copyToClipboard(text, "Aksara Jawa kasil dipun salin!");
};

function renderNglegenaGrid() {
  const container = document.getElementById('nglegenaGrid');
  if (!container) return;
  container.innerHTML = '';
  for (const [latin, aksara] of Object.entries(AKSARA_NGLEGENA)) {
    const btn = document.createElement('button');
    btn.className = 'p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada transition text-center group active:scale-95';
    btn.innerHTML = `
      <div class="text-prada font-jawa text-lg group-hover:scale-110 transition">${aksara}</div>
      <div class="text-[10px] text-sogan-400 font-mono uppercase mt-0.5">${latin}</div>
    `;
    btn.onclick = () => {
      document.getElementById('latinInput').value += latin + ' ';
      window.convertLatinToJawa();
    };
    container.appendChild(btn);
  }
}

// Canvas
let drawCanvas, drawCtx, isPainting = false;

function initDrawingCanvas() {
  drawCanvas = document.getElementById('drawingCanvas');
  if (!drawCanvas) return;
  drawCtx = drawCanvas.getContext('2d');

  function resize() {
    const rect = drawCanvas.getBoundingClientRect();
    drawCanvas.width = rect.width;
    drawCanvas.height = rect.height;
    drawCtx.strokeStyle = '#d4af37';
    drawCtx.lineWidth = 4.5;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
  }
  resize();
  window.addEventListener('resize', resize);

  function start(e) {
    isPainting = true;
    drawCtx.beginPath();
    const { x, y } = getPos(e);
    drawCtx.moveTo(x, y);
  }
  function move(e) {
    if (!isPainting) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
  }
  function end() { isPainting = false; }
  function getPos(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }

  drawCanvas.addEventListener('mousedown', start);
  drawCanvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  drawCanvas.addEventListener('touchstart', start, { passive: false });
  drawCanvas.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', end);
}

window.clearCanvas = () => {
  if (drawCtx && drawCanvas) {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    showToast("Kanvas kasil dipun resiki.");
  }
};

window.downloadCanvasArt = () => {
  if (!drawCanvas) return;
  const a = document.createElement('a');
  a.download = 'Aksara_Jawa_JagadJawa.png';
  a.href = drawCanvas.toDataURL();
  a.click();
  showToast("Gambar aksara kasil dipun undhuh!");
};

window.addEventListener('init-aksara-canvas', initDrawingCanvas);

// ─── WAYANG ────────────────────────────────────────────────────────────────
window.selectWayangCharacter = function (key) {
  const data = WAYANG_CHARACTERS[key];
  if (!data) return;

  document.getElementById('wayangActorName').innerText = data.name;
  document.getElementById('puppetVisual').innerHTML = data.svg;
  document.getElementById('puppetBioBox').innerHTML = `
    <strong class="text-prada font-marcellus text-sm block mb-1">${data.name}</strong>
    ${data.bio}
  `;

  document.querySelectorAll('.wayang-btn').forEach(btn => {
    btn.classList.remove('border-prada');
    btn.classList.add('border-sogan-800');
  });
  if (event && event.currentTarget) event.currentTarget.classList.add('border-prada');

  playDalangFX('kepyak', showToast);
  showToast(`Tokoh wayang katetepaken: ${data.name}`);
};

function initWayangDraggable() {
  const puppet = document.getElementById('wayangPuppet');
  if (!puppet) return;
  let isDragging = false, startX, startY, curX = 0, curY = 0;

  function onStart(e) {
    isDragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX) - curX;
    startY = (e.touches ? e.touches[0].clientY : e.clientY) - curY;
  }
  function onMove(e) {
    if (!isDragging) return;
    curX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    curY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    puppet.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
  }
  function onEnd() { isDragging = false; }

  puppet.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  puppet.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
}

// ─── PITUTUR & KUIS ────────────────────────────────────────────────────────
window.generateRandomPitutur = function () {
  const idx = Math.floor(Math.random() * PITUTUR_LIST.length);
  const item = PITUTUR_LIST[idx];
  document.getElementById('pituturJawaText').innerText = item.jawa;
  document.getElementById('pituturArtiText').innerText = item.arti;
  showToast("Pitutur luhur enggal sampun kabiak.");
};

window.copyPituturText = function () {
  const text = document.getElementById('pituturJawaText').innerText + " - " + document.getElementById('pituturArtiText').innerText;
  copyToClipboard(text, "Pitutur luhur kasil dipun salin!");
};

let quizIndex = 0, quizScore = 0;

function renderQuiz() {
  const q = QUIZ_QUESTIONS[quizIndex];
  document.getElementById('quizCounter').innerText = `${quizIndex + 1}/${QUIZ_QUESTIONS.length}`;
  document.getElementById('quizScore').innerText = quizScore;
  document.getElementById('quizQuestion').innerText = q.q;

  const container = document.getElementById('quizOptionsContainer');
  container.innerHTML = '';

  q.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'w-full text-left p-3.5 rounded-xl bg-keraton border border-sogan-800 hover:border-prada text-sogan-100 text-xs sm:text-sm font-medium transition active:scale-95 flex items-center justify-between group';
    btn.innerHTML = `<span>${opt}</span><i class="fa-regular fa-circle text-sogan-600 group-hover:text-prada"></i>`;
    btn.onclick = () => answerQuiz(idx, btn);
    container.appendChild(btn);
  });
}

function answerQuiz(selectedIdx, btnEl) {
  const q = QUIZ_QUESTIONS[quizIndex];
  const isCorrect = selectedIdx === q.correct;
  const allBtns = document.querySelectorAll('#quizOptionsContainer button');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btnEl.classList.add('bg-emerald-950', 'border-emerald-500', 'text-emerald-200');
    quizScore += 20;
    document.getElementById('quizScore').innerText = quizScore;
    showToast("Leres sanget! Wangsulan sampeyan trep.");
  } else {
    btnEl.classList.add('bg-rose-950', 'border-rose-500', 'text-rose-200');
    allBtns[q.correct].classList.add('bg-emerald-950', 'border-emerald-500', 'text-emerald-200');
    showToast("Kirang trep, sinau malih nggih.");
  }

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < QUIZ_QUESTIONS.length) {
      renderQuiz();
    } else {
      document.getElementById('quizBox').classList.add('hidden');
      document.getElementById('quizResultBox').classList.remove('hidden');
      document.getElementById('quizFinalScoreText').innerText = `Skor akhir sampeyan: ${quizScore} / 100`;
      let badge = 'Satria Pinandhita';
      if (quizScore >= 80) badge = 'Pujangga Luhur Budaya';
      else if (quizScore >= 60) badge = 'Ksatria Wasis';
      else badge = 'Siswa Sinau Budaya';
      document.getElementById('quizRankBadge').innerText = `Gelar Capaian: ${badge}`;
    }
  }, 1200);
}

window.restartQuiz = function () {
  quizIndex = 0;
  quizScore = 0;
  document.getElementById('quizBox').classList.remove('hidden');
  document.getElementById('quizResultBox').classList.add('hidden');
  renderQuiz();
};

// ─── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();
  const saronKeys = saronScales[currentGamelanLaras];

  if (k >= '1' && k <= '7') {
    const idx = parseInt(k) - 1;
    if (saronKeys[idx]) {
      playGamelanTone(saronKeys[idx].freq, 'saron');
      const el = document.getElementById(`saron-btn-${idx}`);
      if (el) { el.classList.add('hit-anim'); setTimeout(() => el.classList.remove('hit-anim'), 150); }
    }
  } else if (k === ' ' || k === 'g') {
    playGamelanTone(65, 'gong'); showToast('GONG!');
  } else if (k === 'k') {
    playGamelanTone(140, 'kempul'); showToast('Kempul!');
  } else if (k === 'q') window.hitBonang(1, 523.25, null);
  else if (k === 'w') window.hitBonang(2, 587.33, null);
  else if (k === 'e') window.hitBonang(3, 659.25, null);
  else if (k === 'r') window.hitBonang(5, 783.99, null);
  else if (k === 't') window.hitBonang(6, 880.00, null);
});

// ─── INIT ──────────────────────────────────────────────────────────────────
function initQuickTodayBadge() {
  const today = new Date();
  const info = getDayInfo(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];
  const el = document.getElementById('quickTodayWetonText');
  if (el) el.innerText = `${dino} ${pas} (${neptu}) · Wuku ${wukuName}`;
}

window.onload = function () {
  initKalenderSelects();
  window.renderKalender();
  initTahunHitungSelect();
  window.updateKepribadianQuickInfo();
  initPerjodohanSelects();
  window.hitungNujumPerjodohan();
  window.hitungSelametan();
  renderGamelanKeys();
  renderNglegenaGrid();
  window.convertLatinToJawa();
  initWayangDraggable();
  renderQuiz();
  initQuickTodayBadge();
};
