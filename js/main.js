/**
 * Jagad Jawa — Portal Budaya Luhur Nusantara
 * Logika & Engine Utama
 */

// ─── UI / Toast Utility ───────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toastBox');
  if (!toast) return;
  document.getElementById('toastMessage').innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 2800);
}

function copyToClipboard(text, msg) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  const parent = document.body || document.documentElement || (document.getElementById && document.getElementById('hasilKepribadianBox'));
  if (parent && parent.appendChild) {
    parent.appendChild(tempInput);
    if (tempInput.select) tempInput.select();
    if (document.execCommand) document.execCommand('copy');
    if (parent.removeChild) parent.removeChild(tempInput);
  }
  showToast(msg);
}



// ─── Audio Engine ─────────────────────────────────────────────────────────
let audioCtx = null;
let isPuspawarnaPlaying = false;
let puspawarnaInterval = null;
let puspawarnaStep = 0;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playGamelanTone(freq, type = 'saron') {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, now);

    if (type === 'saron') {
      gain1.gain.setValueAtTime(0.7, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    } else if (type === 'bonang') {
      gain1.gain.setValueAtTime(0.8, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      gain2.gain.setValueAtTime(0.35, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    } else if (type === 'gong') {
      gain1.gain.setValueAtTime(1.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
      gain2.gain.setValueAtTime(0.6, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    } else if (type === 'kempul') {
      gain1.gain.setValueAtTime(0.9, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    } else if (type === 'kenong') {
      gain1.gain.setValueAtTime(0.9, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      gain2.gain.setValueAtTime(0.4, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    }

    osc1.connect(gain1); gain1.connect(audioCtx.destination);
    osc2.connect(gain2); gain2.connect(audioCtx.destination);

    osc1.start(now); osc2.start(now);
    osc1.stop(now + 5.0); osc2.stop(now + 5.0);
  } catch (e) {
    console.warn('Audio Web API restricted:', e);
  }
}

const PUSPAWARNA_SLENDRO_PATHE_MANYURA = [
  { freq: 288, type: 'saron' },
  { freq: 324, type: 'saron' },
  { freq: 364, type: 'bonang' },
  { freq: 432, type: 'saron' },
  { freq: 486, type: 'kenong' },
  { freq: 432, type: 'saron' },
  { freq: 364, type: 'saron' },
  { freq: 324, type: 'kempul' },
  { freq: 288, type: 'saron' },
  { freq: 324, type: 'saron' },
  { freq: 432, type: 'saron' },
  { freq: 486, type: 'kenong' },
  { freq: 432, type: 'bonang' },
  { freq: 364, type: 'saron' },
  { freq: 324, type: 'saron' },
  { freq: 216, type: 'gong' }
];

let puspawarnaAudio = null;

window.toggleKetawangPuspawarna = function toggleKetawangPuspawarna(showToastFn = showToast) {
  const btn = document.getElementById('puspawarnaBtn') || document.getElementById('playPuspawarnaBtn');
  const icon = document.getElementById('puspawarnaIcon') || document.getElementById('audioBtnIcon');
  const label = document.getElementById('puspawarnaLabel') || document.getElementById('audioBtnLabel');
  const labelShort = document.getElementById('puspawarnaLabelShort');
  const heroIcon = document.getElementById('heroPlayIcon');
  const eq = document.getElementById('audioEqualizer');

  if (!puspawarnaAudio) {
    const existingEl = document.getElementById('puspawarnaAudioElement');
    if (existingEl) {
      puspawarnaAudio = existingEl;
    } else if (typeof Audio !== 'undefined') {
      puspawarnaAudio = new Audio('assets/audio/puspowarno.mp3');
      puspawarnaAudio.id = 'puspawarnaAudioElement';
      puspawarnaAudio.loop = true;
      if (typeof document !== 'undefined' && document.body) {
        document.body.appendChild(puspawarnaAudio);
      }
    }
    if (puspawarnaAudio) {
      puspawarnaAudio.loop = true;
      puspawarnaAudio.addEventListener('ended', () => {
        isPuspawarnaPlaying = false;
        updatePuspawarnaUI(false);
      });
      puspawarnaAudio.addEventListener('pause', () => {
        isPuspawarnaPlaying = false;
        updatePuspawarnaUI(false);
      });
      puspawarnaAudio.addEventListener('play', () => {
        isPuspawarnaPlaying = true;
        updatePuspawarnaUI(true);
      });
    }
  }

  function updatePuspawarnaUI(playing) {
    if (playing) {
      if (btn) btn.classList.add('playing');
      if (icon) icon.className = 'fa-solid fa-circle-pause text-sm text-prada animate-pulse';
      if (label) label.innerText = 'Nembang Puspawarna...';
      if (labelShort) labelShort.innerText = 'Nembang...';
      if (heroIcon) heroIcon.className = 'fa-solid fa-pause text-2xl text-keraton ml-0';
      if (eq) eq.classList.remove('hidden');
    } else {
      if (btn) btn.classList.remove('playing');
      if (icon) icon.className = 'fa-solid fa-circle-play text-sm text-prada';
      if (label) label.innerText = 'Ketawang Puspawarna';
      if (labelShort) labelShort.innerText = 'Gamelan';
      if (heroIcon) heroIcon.className = 'fa-solid fa-play text-2xl text-keraton ml-1';
      if (eq) eq.classList.add('hidden');
    }
  }

  if (isPuspawarnaPlaying) {
    if (puspawarnaAudio) puspawarnaAudio.pause();
    isPuspawarnaPlaying = false;
    updatePuspawarnaUI(false);
    if (showToastFn) showToastFn('Gendhing Puspawarna dipun leremaken.');
  } else {
    isPuspawarnaPlaying = true;
    if (puspawarnaAudio) {
      const playPromise = puspawarnaAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updatePuspawarnaUI(true);
          if (showToastFn) showToastFn('Nglaras Gendhing Ketawang Puspawarna (Laras Slendro Manyura)...');
        }).catch(err => {
          console.warn('Audio autoplay prevented or error:', err);
          isPuspawarnaPlaying = false;
          updatePuspawarnaUI(false);
          if (showToastFn) showToastFn('Klik malih kanggé miwiti alunan gamelan.');
        });
      } else {
        updatePuspawarnaUI(true);
      }
    } else {
      updatePuspawarnaUI(true);
    }
  }
}

function playDalangFX(type, showToastFn = showToast) {
  try {
    initAudio();
    const now = audioCtx.currentTime;

    if (type === 'kepyak') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.09);
      if (showToastFn) showToastFn('Swanten Kepyak Dalang (Kecrk!)');
    } else if (type === 'dodokan') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
      gain.gain.setValueAtTime(1.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.22);
      if (showToastFn) showToastFn('Dodokan Kotak Wayang (Dhod-dhod!)');
    }
  } catch (e) {
    console.warn('FX Error:', e);
  }
}

// ─── Data Kalender & Pranata Mangsa ─────────────────────────────────────────
const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const NEPTU_HARI = [5,4,3,7,8,6,9];
const PASARAN = ["Legi","Pahing","Pon","Wage","Kliwon"];
const NEPTU_PASARAN = [5,9,7,4,8];
const BULAN_MASEHI = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BULAN_JAWA = ["Sura","Sapar","Mulud","Bakda Mulud","Jumadilawal","Jumadilakhir","Rejeb","Ruwah","Pasa","Sawal","Dulkangidah","Besar"];
const WINDU = ["Alip","Ehe","Jimawal","Je","Dal","Be","Wawu","Jimakir"];

const WUKU = [
  "Sinta","Landep","Wukir","Kurantil","Tolu","Gumbreg","Warigalit","Warigagung",
  "Julungwangi","Sungsang","Galungan","Kuningan","Langkir","Mandasiya","Julungpujut","Pahang",
  "Kuruwelut","Marakeh","Tambir","Medangkungan","Maktal","Wuye","Manahil","Prangbakat","Bala",
  "Wugu","Wayang","Kulawu","Dukut","Watugunung"
];

const DUNUNGE = [
  "Lor Wetan","Kulon","Kidul Wetan","Ngisor","Lor Kulon","Kidul Wetan","Duwur","Lor","Kidul Kulon","Wetan",
  "Lor Wetan","Kulon","Kidul Wetan","Ngisor","Lor Kulon","Kidul","Duwur","Lor","Kidul Kulon","Wetan",
  "Lor Wetan","Kulon","Kidul Wetan","Ngisor","Lor Kulon","Kidul","Duwur","Lor","Kidul Kulon","Wetan"
];

const GRID = [
  [["PS","R",0],["RAT","R",0],["S","R",1],["NS","R",0],["","G",0],["","G",0],["P","R",0]],
  [["RT","R",1],["","G",0],["N","G",0],["WQ","R",0],["","G",0],["P","R",0],["R","R",1]],
  [["","G",0],["N","G",0],["","G",0],["","G",0],["I","G",0],["R","R",1],["","G",0]],
  [["N","R",0],["","G",1],["OP","G",0],["XT","R",0],["R","R",0],["","G",0],["N","R",0]],
  [["","G",1],["P","G",0],["I","G",0],["R","R",1],["P","R",0],["I","G",0],["","G",0]],
  [["P","R",0],["T","G",0],["R","R",1],["N","R",0],["","G",0],["","G",0],["P","R",0]],
  [["T","R",0],["RA","G",0],["N","G",0],["Q","R",0],["W","G",0],["P","R",0],["","G",1]],
  [["RK","G",0],["N","G",0],["","G",0],["","G",0],["I","R",0],["S","G",1],["RS","G",0]],
  [["N","R",0],["","R",1],["OP","R",0],["I","R",0],["","G",0],["R","R",0],["N","R",0]],
  [["","G",1],["P","R",0],["T","R",0],["S","R",0],["RP","R",0],["T","R",0],["","G",0]],
  [["DP","R",0],["DT","R",0],["D","R",1],["XRN","R",0],["","G",0],["","G",0],["P","R",0]],
  [["I","R",1],["","G",0],["RN","R",0],["Q","R",1],["","G",0],["PW","R",0],["S","R",1]],
  [["","G",0],["RAN","R",0],["","G",0],["","G",0],["T","G",0],["","G",1],["","G",0]],
  [["RN","R",0],["","G",1],["OP","R",0],["I","R",0],["","G",0],["","G",0],["RN","R",0]],
  [["","G",1],["P","G",0],["I","R",0],["","G",1],["P","R",0],["RT","R",0],["","G",1]],
  [["P","R",0],["T","R",0],["","G",1],["N","R",0],["R","R",1],["","G",0],["P","R",0]],
  [["KI","R",0],["","G",0],["N","R",0],["RQ","R",1],["","G",0],["P","R",0],["W","R",1]],
  [["","G",0],["N","R",0],["R","G",1],["X","R",0],["I","R",0],["","G",1],["","G",0]],
  [["N","R",0],["RA","R",1],["OP","R",0],["T","R",0],["","G",0],["","R",0],["N","R",0]],
  [["R","R",1],["P","R",0],["I","R",0],["","G",0],["P","R",0],["I","R",0],["R","R",1]],
  [["P","R",0],["I","R",0],["","G",1],["N","R",0],["","G",0],["R","R",0],["","R",0]],
  [["T","R",0],["W","R",0],["N","R",0],["Q","R",1],["R","R",0],["P","R",0],["","G",1]],
  [["","G",0],["N","G",0],["","G",0],["R","R",0],["I","R",0],["","G",1],["","G",0]],
  [["N","R",0],["","G",1],["ROP","R",0],["I","R",0],["","G",0],["","G",0],["N","R",0]],
  [["","G",1],["RAP","R",0],["T","R",0],["X","R",1],["P","R",0],["T","R",0],["","G",0]],
  [["PRK","R",0],["I","R",0],["","G",1],["N","R",0],["","G",1],["","G",0],["RP","R",0]],
  [["I","R",0],["","G",0],["NW","R",0],["Q","R",1],["S","R",0],["RP","R",0],["","G",1]],
  [["","G",0],["N","G",0],["","G",0],["","G",0],["RT","R",0],["","G",1],["","G",0]],
  [["N","R",0],["","G",1],["OP","R",0],["RT","R",0],["","G",0],["","G",0],["N","R",0]],
  [["","G",1],["P","R",0],["RT","R",0],["","G",1],["P","R",0],["I","R",0],["","G",0]]
];

const KETERANGAN = [
  ["S","Tangise Dewi Sinto"],["O","Anggoro Kasih"],["W","Tali Wangke"],["N","Nuju Padu"],
  ["Q","Dino ora kanggonan tanggal"],["R","Ringkel Jalma"],["K","Kala Dite"],["T","Kala Tinantang"],
  ["P","Nuju Pati"],["D","Dungulan"],["A","Sampar Wangke"],["X","Sarik Agung"]
];

function toJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

const ISLAMIC_EPOCH = 1948440;

function jdnToIslamic(jdn) {
  jdn = Math.floor(jdn);
  const n = jdn - ISLAMIC_EPOCH + 10632;
  const cyc = Math.floor(n / 10631);
  const rem0 = n % 10631 + 354;
  const j = Math.floor((10985 - rem0) / 5316) * Math.floor((50 * rem0) / 17719) + Math.floor(rem0 / 5670) * Math.floor((43 * rem0) / 15238);
  const rem2 = rem0 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * rem2) / 709);
  const d = rem2 - Math.floor((709 * m) / 24);
  const y = 30 * cyc + j - 30;
  return [y, m, d];
}

// Epoch Patokan Abadi Kalender Jawa & Pawukon:
// JDN 2459456 = 29 Agustus 2021 (Minggu Pahing, Wuku Sinta - Hari ke-0 dari Siklus Pawukon 210 Hari)
const EPOCH_JDN = 2459456;
const JDN_LEGI_ANCHOR = 2459590; // toJDN(2022, 1, 10) - Senin Legi
const SUN_JDN_ANCHOR = 2459589;  // toJDN(2022, 1, 9)  - Minggu wuku Madangkungan (idx 19)
const WUKU_ANCHOR_IDX = 19;

// Cache O(1) instan untuk hasil perhitungan per tanggal
const DAY_INFO_CACHE = Object.create(null);

function getDayInfo(y, m, d) {
  const key = y * 10000 + m * 100 + d;
  if (DAY_INFO_CACHE[key]) return DAY_INFO_CACHE[key];

  const jdn = toJDN(y, m, d);
  const diffDays = jdn - EPOCH_JDN;
  const weekdayId = ((diffDays % 7) + 7) % 7; // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
  const pasaranId = (((diffDays + 1) % 5) + 5) % 5; // 0 = Legi, 1 = Pahing, 2 = Pon, 3 = Wage, 4 = Kliwon
  const pDay = ((diffDays % 210) + 210) % 210;
  const wukuId = Math.floor(pDay / 7); // 0 = Sinta ... 29 = Watugunung
  const [hy, hm, hd] = jdnToIslamic(jdn);
  const ajYear = hy + 512;

  const result = { jdn, weekdayId, pasaranId, wukuId, hijri: [hd, hm, hy], ajYear };
  DAY_INFO_CACHE[key] = result;
  return result;
}

function getTanggalJawaLengkap(y, m, d) {
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];
  const wukuNo = info.wukuId + 1;

  const tglJawa = info.hijri[0];
  const bulanJawa = BULAN_JAWA[info.hijri[1] - 1] || "-";
  const tahunAJ = info.ajYear;
  
  const TAHUN_SIKLUS_8 = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"];
  const tahunSiklus = TAHUN_SIKLUS_8[((tahunAJ - 1955) % 8 + 8) % 8];
  
  const WINDU_4 = ["Kuntara (Adi)", "Sangara", "Sancaya", "Buntara (Pangsa)"];
  const winduIndex = ((Math.floor((tahunAJ - 1955) / 8) % 4) + 4) % 4;
  const namaWindu = WINDU_4[winduIndex];

  const fullStr = `${tglJawa} ${bulanJawa} ${tahunAJ} AJ (Tahun ${tahunSiklus}, Windu ${namaWindu})`;
  const shortStr = `${tglJawa} ${bulanJawa} ${tahunAJ} AJ`;

  return {
    tglJawa,
    bulanJawa,
    tahunAJ,
    tahunSiklus,
    namaWindu,
    dino,
    pas,
    neptu,
    wukuName,
    wukuNo,
    fullStr,
    shortStr
  };
}
window.getTanggalJawaLengkap = getTanggalJawaLengkap;
window.getDayInfo = getDayInfo;

const LIBUR_NASIONAL = {
  fixed: {
    "1-1": "Tahun Baru Masehi",
    "5-1": "Hari Buruh Internasional",
    "6-1": "Hari Lahir Pancasila",
    "8-17": "Hari Proklamasi Kemerdekaan RI",
    "12-25": "Hari Raya Natal"
  },
  custom: {
    // 2024
    "2024-1-1": "Tahun Baru 2024 Masehi",
    "2024-2-8": "Isra Mi'raj Nabi Muhammad SAW",
    "2024-2-10": "Tahun Baru Imlek 2575 Kongzili",
    "2024-3-11": "Hari Suci Nyepi Tahun Baru Saka 1946",
    "2024-3-29": "Wafat Yesus Kristus (Jumat Agung)",
    "2024-3-31": "Hari Paskah",
    "2024-4-10": "Hari Raya Idul Fitri 1445 H",
    "2024-4-11": "Hari Raya Idul Fitri 1445 H",
    "2024-5-1": "Hari Buruh Internasional",
    "2024-5-9": "Kenaikan Yesus Kristus",
    "2024-5-23": "Hari Raya Waisak 2568 BE",
    "2024-6-1": "Hari Lahir Pancasila",
    "2024-6-17": "Hari Raya Idul Adha 1445 H",
    "2024-7-7": "Tahun Baru Islam 1446 H (1 Sura)",
    "2024-8-17": "Hari Kemerdekaan RI Ke-79",
    "2024-9-16": "Maulid Nabi Muhammad SAW",
    "2024-12-25": "Hari Raya Natal",

    // 2025
    "2025-1-1": "Tahun Baru 2025 Masehi",
    "2025-1-27": "Isra Mi'raj Nabi Muhammad SAW",
    "2025-1-29": "Tahun Baru Imlek 2576 Kongzili",
    "2025-3-29": "Hari Suci Nyepi Tahun Baru Saka 1947",
    "2025-3-31": "Hari Raya Idul Fitri 1446 H",
    "2025-4-1": "Hari Raya Idul Fitri 1446 H",
    "2025-4-18": "Wafat Yesus Kristus",
    "2025-4-20": "Hari Paskah",
    "2025-5-1": "Hari Buruh Internasional",
    "2025-5-12": "Hari Raya Waisak 2569 BE",
    "2025-5-29": "Kenaikan Yesus Kristus",
    "2025-6-1": "Hari Lahir Pancasila",
    "2025-6-7": "Hari Raya Idul Adha 1446 H",
    "2025-6-27": "Tahun Baru Islam 1447 H (1 Sura)",
    "2025-8-17": "Hari Kemerdekaan RI Ke-80",
    "2025-9-5": "Maulid Nabi Muhammad SAW",
    "2025-12-25": "Hari Raya Natal",

    // 2026
    "2026-1-1": "Tahun Baru 2026 Masehi",
    "2026-1-16": "Isra Mi'raj Nabi Muhammad SAW",
    "2026-2-17": "Tahun Baru Imlek 2577 Kongzili",
    "2026-3-19": "Hari Suci Nyepi Tahun Baru Saka 1948",
    "2026-3-20": "Hari Raya Idul Fitri 1447 H",
    "2026-3-21": "Hari Raya Idul Fitri 1447 H",
    "2026-4-3": "Wafat Yesus Kristus",
    "2026-4-5": "Hari Paskah",
    "2026-5-1": "Hari Buruh Internasional",
    "2026-5-14": "Kenaikan Yesus Kristus",
    "2026-5-27": "Hari Raya Idul Adha 1447 H",
    "2026-5-31": "Hari Raya Waisak 2570 BE",
    "2026-6-1": "Hari Lahir Pancasila",
    "2026-6-16": "Tahun Baru Islam 1448 H (1 Sura)",
    "2026-8-17": "Hari Kemerdekaan RI Ke-81",
    "2026-8-25": "Maulid Nabi Muhammad SAW",
    "2026-12-25": "Hari Raya Natal",

    // 2027
    "2027-1-1": "Tahun Baru 2027 Masehi",
    "2027-1-6": "Isra Mi'raj Nabi Muhammad SAW",
    "2027-2-6": "Tahun Baru Imlek 2578 Kongzili",
    "2027-3-9": "Hari Raya Idul Fitri 1448 H",
    "2027-3-10": "Hari Raya Idul Fitri 1448 H",
    "2027-3-26": "Wafat Yesus Kristus",
    "2027-3-28": "Hari Paskah",
    "2027-4-8": "Hari Suci Nyepi Tahun Baru Saka 1949",
    "2027-5-1": "Hari Buruh Internasional",
    "2027-5-6": "Kenaikan Yesus Kristus",
    "2027-5-16": "Hari Raya Idul Adha 1448 H",
    "2027-5-20": "Hari Raya Waisak 2571 BE",
    "2027-6-1": "Hari Lahir Pancasila",
    "2027-6-6": "Tahun Baru Islam 1449 H (1 Sura)",
    "2027-8-15": "Maulid Nabi Muhammad SAW",
    "2027-8-17": "Hari Kemerdekaan RI Ke-82",
    "2027-12-25": "Hari Raya Natal",

    // 2028
    "2028-1-1": "Tahun Baru 2028 Masehi",
    "2028-1-26": "Tahun Baru Imlek 2579 Kongzili",
    "2028-2-24": "Isra Mi'raj Nabi Muhammad SAW",
    "2028-2-27": "Hari Raya Idul Fitri 1449 H",
    "2028-2-28": "Hari Raya Idul Fitri 1449 H",
    "2028-3-26": "Hari Suci Nyepi Tahun Baru Saka 1950",
    "2028-4-14": "Wafat Yesus Kristus",
    "2028-4-16": "Hari Paskah",
    "2028-5-1": "Hari Buruh Internasional",
    "2028-5-5": "Hari Raya Idul Adha 1449 H",
    "2028-5-9": "Hari Raya Waisak 2572 BE",
    "2028-5-25": "Kenaikan Yesus Kristus",
    "2028-5-26": "Tahun Baru Islam 1450 H (1 Sura)",
    "2028-6-1": "Hari Lahir Pancasila",
    "2028-8-4": "Maulid Nabi Muhammad SAW",
    "2028-8-17": "Hari Kemerdekaan RI Ke-83",
    "2028-12-25": "Hari Raya Natal"
  }
};

const LIBUR_FLAT = Object.assign(Object.create(null), LIBUR_NASIONAL.custom, LIBUR_NASIONAL.fixed);

function getLiburNasional(y, m, d) {
  return LIBUR_FLAT[`${y}-${m}-${d}`] || LIBUR_FLAT[`${m}-${d}`] || null;
}

// Basis Data Resmi Dino Gede & Dino Ijo dari database_nujum CSV
const DINO_GEDE_LIST = [
  ["Selasa","Wage","Sinta"],["Kamis","Legi","Sinta"],["Jumat","Pahing","Sinta"],
  ["Rabu","Pahing","Landep"],["Sabtu","Kliwon","Landep"],["Selasa","Pon","Wukir"],
  ["Jumat","Legi","Wukir"],["Senin","Wage","Kurantil"],["Kamis","Pahing","Kurantil"],
  ["Minggu","Kliwon","Tolu"],["Rabu","Pon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Selasa","Wage","Gumbreg"],["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],
  ["Rabu","Pahing","Warigalit"],["Sabtu","Kliwon","Warigalit"],["Selasa","Pon","Warigagung"],
  ["Jumat","Legi","Warigagung"],["Senin","Wage","Julungwangi"],["Kamis","Pahing","Julungwangi"],
  ["Minggu","Kliwon","Sungsang"],["Rabu","Pon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Selasa","Wage","Galungan"],["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],
  ["Rabu","Pahing","Kuningan"],["Sabtu","Kliwon","Kuningan"],["Selasa","Pon","Langkir"],
  ["Jumat","Legi","Langkir"],["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Kamis","Legi","Pahang"],["Jumat","Pahing","Pahang"],
  ["Rabu","Pahing","Kuruwelut"],["Sabtu","Kliwon","Kuruwelut"],["Selasa","Pon","Marakeh"],
  ["Jumat","Legi","Marakeh"],["Senin","Wage","Tambir"],["Kamis","Pahing","Tambir"],
  ["Minggu","Kliwon","Medangkungan"],["Rabu","Pon","Medangkungan"],["Sabtu","Legi","Medangkungan"],
  ["Selasa","Wage","Maktal"],["Kamis","Legi","Maktal"],["Jumat","Pahing","Maktal"],
  ["Rabu","Pahing","Wuye"],["Sabtu","Kliwon","Wuye"],["Selasa","Pon","Manahil"],
  ["Senin","Wage","Prangbakat"],["Kamis","Pahing","Prangbakat"],["Minggu","Kliwon","Bala"],
  ["Rabu","Pon","Bala"],["Sabtu","Legi","Bala"],["Selasa","Wage","Wugu"],
  ["Kamis","Legi","Wugu"],["Jumat","Pahing","Wugu"],["Rabu","Pahing","Wayang"],
  ["Sabtu","Kliwon","Wayang"],["Selasa","Pon","Kulawu"],["Jumat","Legi","Kulawu"],
  ["Senin","Wage","Dukut"],["Kamis","Pahing","Dukut"],["Minggu","Kliwon","Watugunung"],
  ["Rabu","Pon","Watugunung"],["Sabtu","Legi","Watugunung"]
];

const DINO_IJO_LIST = [
  ["Kamis","Legi","Sinta"],["Jumat","Pahing","Sinta"],["Senin","Kliwon","Landep"],
  ["Kamis","Pon","Landep"],["Minggu","Legi","Wukir"],["Selasa","Pon","Wukir"],
  ["Rabu","Wage","Wukir"],["Sabtu","Pahing","Wukir"],["Senin","Wage","Kurantil"],
  ["Jumat","Pon","Kurantil"],["Minggu","Kliwon","Tolu"],["Sabtu","Legi","Tolu"],
  ["Kamis","Legi","Gumbreg"],["Jumat","Pahing","Gumbreg"],["Sabtu","Kliwon","Warigalit"],
  ["Selasa","Pon","Warigagung"],["Rabu","Wage","Warigagung"],["Senin","Wage","Julungwangi"],
  ["Kamis","Pahing","Julungwangi"],["Minggu","Kliwon","Sungsang"],["Sabtu","Legi","Sungsang"],
  ["Kamis","Legi","Galungan"],["Jumat","Pahing","Galungan"],["Senin","Kliwon","Kuningan"],
  ["Kamis","Pon","Kuningan"],["Minggu","Legi","Langkir"],["Selasa","Pon","Langkir"],
  ["Rabu","Wage","Langkir"],["Jumat","Legi","Langkir"],["Sabtu","Pahing","Langkir"],
  ["Senin","Wage","Mandasiya"],["Kamis","Pahing","Mandasiya"],["Jumat","Pon","Mandasiya"],
  ["Minggu","Kliwon","Julungpujut"],["Rabu","Pon","Julungpujut"],["Sabtu","Legi","Julungpujut"],
  ["Selasa","Wage","Pahang"],["Jumat","Pahing","Pahang"],["Senin","Kliwon","Kuruwelut"],
  ["Kamis","Pon","Kuruwelut"],["Minggu","Legi","Marakeh"],["Jumat","Legi","Marakeh"],
  ["Sabtu","Pahing","Marakeh"],["Kamis","Pahing","Tambir"],["Jumat","Pon","Tambir"],
  ["Rabu","Pon","Medangkungan"],["Selasa","Wage","Maktal"],["Kamis","Legi","Maktal"],
  ["Sabtu","Kliwon","Wuye"],["Minggu","Legi","Manahil"],["Selasa","Pon","Manahil"],
  ["Jumat","Legi","Manahil"],["Sabtu","Pahing","Manahil"],["Senin","Wage","Prangbakat"],
  ["Kamis","Pahing","Prangbakat"],["Jumat","Pon","Prangbakat"],["Minggu","Kliwon","Bala"],
  ["Sabtu","Legi","Bala"],["Senin","Pon","Wugu"],["Selasa","Wage","Wugu"],["Kamis","Legi","Wugu"],
  ["Jumat","Pahing","Wugu"],["Senin","Kliwon","Wayang"],["Sabtu","Kliwon","Wayang"],
  ["Minggu","Legi","Kulawu"],["Selasa","Pon","Kulawu"],["Rabu","Wage","Kulawu"],
  ["Jumat","Legi","Kulawu"],["Sabtu","Pahing","Kulawu"],["Senin","Wage","Dukut"],
  ["Kamis","Pahing","Dukut"],["Jumat","Pon","Dukut"],["Minggu","Kliwon","Watugunung"],
  ["Rabu","Pon","Watugunung"],["Sabtu","Legi","Watugunung"]
];

const HARI_NAMES_MAIN = new Set(['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
const PASARAN_NAMES_MAIN = new Set(['legi', 'pahing', 'pon', 'wage', 'kliwon']);

function parseDinoWukuArgs(a, b, c) {
  let dino = '', pasaran = '', wuku = '';
  if (typeof a === 'object' && a !== null) {
    dino = a.dino || a.hari || '';
    pasaran = a.pasaran || a.pas || '';
    wuku = a.wuku || a.wukuName || '';
  } else if (typeof a === 'string' && (b === undefined || b === null || b === '')) {
    const parts = a.split(/[\s_\-]+/);
    if (parts.length === 3) {
      return parseDinoWukuArgs(parts[0], parts[1], parts[2]);
    }
  } else {
    const args = [String(a || '').trim(), String(b || '').trim(), String(c || '').trim()];
    for (const arg of args) {
      const lower = arg.toLowerCase();
      if (!dino && HARI_NAMES_MAIN.has(lower)) {
        dino = arg;
      } else if (!pasaran && PASARAN_NAMES_MAIN.has(lower)) {
        pasaran = arg;
      } else if (!wuku) {
        wuku = arg;
      }
    }
    if (!wuku && args[2]) wuku = args[2];
    if (!dino && args[0]) dino = args[0];
    if (!pasaran && args[1]) pasaran = args[1];
  }
  return {
    dino: dino.trim(),
    pasaran: pasaran.trim(),
    wuku: wuku.trim().replace(/[\s\-_]/g, '')
  };
}

function normDinoWukuKey(a, b, c) {
  const { dino, pasaran, wuku } = parseDinoWukuArgs(a, b, c);
  const d = dino.toLowerCase();
  const p = pasaran.toLowerCase();
  const w = wuku.toLowerCase()
    .replace(/^shinto$/, 'sinta')
    .replace(/^sinto$/, 'sinta')
    .replace(/^wariagung$/, 'warigagung')
    .replace(/^madangkungan$/, 'medangkungan')
    .replace(/^mendangkungan$/, 'medangkungan')
    .replace(/^manail$/, 'manahil')
    .replace(/^watugunung$/, 'watugunung')
    .replace(/^julungwangi$/, 'julungwangi')
    .replace(/^julungpujut$/, 'julungpujut');
  return `${w}_${d}_${p}`;
}

const DINO_GEDE_SET = new Set();
DINO_GEDE_LIST.forEach(([d, p, w]) => {
  DINO_GEDE_SET.add(normDinoWukuKey(w, d, p));
  DINO_GEDE_SET.add(normDinoWukuKey(d, p, w));
  DINO_GEDE_SET.add(`${String(d).toLowerCase()}_${String(p).toLowerCase()}_${String(w).toLowerCase().replace(/[\s\-_]/g, '')}`);
  DINO_GEDE_SET.add(`${String(w).toLowerCase().replace(/[\s\-_]/g, '')}_${String(d).toLowerCase()}_${String(p).toLowerCase()}`);
});

const DINO_IJO_SET = new Set();
DINO_IJO_LIST.forEach(([d, p, w]) => {
  DINO_IJO_SET.add(normDinoWukuKey(w, d, p));
  DINO_IJO_SET.add(normDinoWukuKey(d, p, w));
  DINO_IJO_SET.add(`${String(d).toLowerCase()}_${String(p).toLowerCase()}_${String(w).toLowerCase().replace(/[\s\-_]/g, '')}`);
  DINO_IJO_SET.add(`${String(w).toLowerCase().replace(/[\s\-_]/g, '')}_${String(d).toLowerCase()}_${String(p).toLowerCase()}`);
});

function isDinoGede(a, b, c) {
  const key = normDinoWukuKey(a, b, c);
  return DINO_GEDE_SET.has(key);
}

function isDinoIjo(a, b, c) {
  const key = normDinoWukuKey(a, b, c);
  return DINO_IJO_SET.has(key);
}

function getDinoWarnaStatus(a, b, c, isMinggu = false, isLibur = false, code = '') {
  let isIjo = false;
  let isGede = false;
  if (typeof window !== 'undefined' && typeof window.evaluateDino === 'function') {
    const evalRes = window.evaluateDino(a, b, c);
    isIjo = evalRes.isIjo;
    isGede = evalRes.isGede;
  } else {
    const key = normDinoWukuKey(a, b, c);
    isIjo = DINO_IJO_SET.has(key);
    isGede = DINO_GEDE_SET.has(key);
  }

  const status = isIjo ? 'ijo' : 'abang';
  const bottomBg = isIjo ? '#16a34a' : '#dc2626'; // Hijau Solid vs Dino Abang
  const bottomBgClass = isIjo ? 'bg-dino-ijo' : 'bg-dino-abang';
  const bottomTextColor = '#ffffff';

  const baseLabel = isIjo ? 'Dino Ijo / Becik' : 'Dina Ala / Kang Olo';
  const label = isGede ? `${baseLabel} · Dino Gede` : baseLabel;

  const cellBorder = isGede ? '#eab308' : (isIjo ? '#86efac' : '#fca5a5');
  const cellBorderStyle = isGede
    ? 'border: 2px solid #eab308; box-shadow: 0 0 10px rgba(234, 179, 8, 0.45);'
    : 'border: 1px solid #cbd5e1;';

  const alaSuffix = code ? `${code} Ala` : 'Ala';
  const baseBadgeText = isIjo ? '✓ Becik' : `▲ ${alaSuffix}`;
  const baseBadgeHtml = isIjo
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#16a34a] text-white shadow-xs" title="Dina Ijo / Becik">✓ Becik</span>'
    : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-[#dc2626] text-white shadow-xs" title="${baseLabel}">▲ ${alaSuffix}</span>`;

  const gedeBadgeText = isGede ? '★ GEDE' : '';
  const gedeBadgeHtml = isGede
    ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-[#eab308] text-amber-950 border border-[#ca8a04] shadow-xs" title="Dino Gede">★ GEDE</span>'
    : '';

  const badgeText = isGede ? `${isIjo ? '✓ Becik' : `▲ ${alaSuffix}`} · ★ GEDE` : baseBadgeText;
  const badgeHtml = isGede ? `${gedeBadgeHtml} ${baseBadgeHtml}` : baseBadgeHtml;

  const cellBg = isIjo ? '#f0fdf4' : '#fef2f2';
  const cellText = isIjo ? '#14532d' : '#7f1d1d';

  return {
    isGede,
    isIjo,
    status,
    bottomBg,
    bottomBgClass,
    bottomTextColor,
    label,
    cellBg,
    cellBorder,
    cellBorderStyle,
    cellText,
    badgeText,
    badgeHtml,
    baseBadgeText,
    baseBadgeHtml,
    gedeBadgeText,
    gedeBadgeHtml
  };
}

function checkDinoGede(wukuId, d, pasaranId, hd, hm) {
  const cell = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ["", "G", 0];
  const code = cell[0] || "";
  const dinoName = HARI[d];
  const pasaranName = PASARAN[pasaranId];
  const wukuName = WUKU[wukuId];

  const normKey = (typeof normDinoWukuKey === 'function') 
    ? normDinoWukuKey(dinoName, pasaranName, wukuName)
    : `${String(dinoName).toLowerCase()}_${String(pasaranName).toLowerCase()}_${String(wukuName).toLowerCase().replace(/[\s\-_]/g, '')}`;
  
  const isCsvGede = (typeof DINO_GEDE_SET !== 'undefined' && DINO_GEDE_SET) ? DINO_GEDE_SET.has(normKey) : false;
  const isGridGede = Boolean(cell[2] === 1);
  const isTandaO = code.includes('O');
  const isAnggaraKasih = (d === 2 && pasaranId === 4) || isTandaO;
  const isJumatKliwon = (d === 5 && pasaranId === 4);
  const isSatuSura = (hd === 1 && hm === 1);

  // Sesuai mandat Two-Layer Logic: Dino Gede murni ditentukan oleh database_nujum - dino_gede.csv
  const isGede = isCsvGede;
  let label = isGede ? "Dino Gede" : "";
  if (isSatuSura) label = "1 Sura (Tahun Baru Jawa)";
  else if (isAnggaraKasih || isTandaO) label = "Anggara Kasih (Selasa Kliwon)";
  else if (isJumatKliwon) label = "Jumat Kliwon (Dina Sakral)";
  else if (isCsvGede) label = "Dino Gede";

  return { isGede, label, isGridGede, isTandaO, isAnggaraKasih, isJumatKliwon, isSatuSura, isCsvGede };
}

const KETERANGAN_MAP = {
  "S": { nama: "Tangise Dewi Sinto", arti: "Dina tangise dewi, prayogi ngati-ati anggone mbudidaya utawa lelungan." },
  "O": { nama: "Anggoro Kasih", arti: "Selasa Kliwon, dina pangasihaning Gusti lan pasucen batin." },
  "W": { nama: "Tali Wangke", arti: "Sirikan ageng; awon kanggé wiwit adeg griya, mantu, utawa lelungan tebih." },
  "N": { nama: "Nuju Padu", arti: "Potensi congkrah / pasulayan; prayogi sabar lan ngedohi pradondi." },
  "Q": { nama: "Dino ora kanggonan tanggal", arti: "Dina lowong/wancak; prayogi boten kanggé hajat ageng." },
  "R": { nama: "Ringkel Jalma", arti: "Sirikan jalma manungsa; prayogi njagi kaselamatan raga." },
  "K": { nama: "Kala Dite", arti: "Kala ing dina Ngahad; prayogi ngati-ati tumrap godha." },
  "T": { nama: "Kala Tinantang", arti: "Kala nantang; watak wanton, prayogi mengker hawa nepsu." },
  "P": { nama: "Nuju Pati", arti: "Sirikan ageng tumrap lelakon anyar utawa bebadan usaha." },
  "D": { nama: "Dungulan", arti: "Watak unggul nanging prayogi ngatos-atos ing tindak-tanduk." },
  "A": { nama: "Sampar Wangke", arti: "Sirikan ageng; prayogi boten kanggé pawiwahan utawa pindah griya." },
  "X": { nama: "Sarik Agung", arti: "Sarik / larangan ageng; prayogi ngedohi hajat wigati." }
};

function getKeteranganKodeDetail(code) {
  if (!code) return [];
  const list = [];
  for (let ch of code) {
    if (KETERANGAN_MAP[ch]) {
      list.push(KETERANGAN_MAP[ch]);
    }
  }
  return list;
}

function evaluateDino(wuku, dino, pasaran) {
  if (typeof window !== 'undefined' && typeof window.evaluateDino === 'function' && window.evaluateDino !== evaluateDino) {
    return window.evaluateDino(wuku, dino, pasaran);
  }
  const key = normDinoWukuKey(wuku, dino, pasaran);
  const isGede = DINO_GEDE_SET.has(key);
  const isIjo = DINO_IJO_SET.has(key);
  return {
    isGede,
    isIjo,
    isAbang: !isIjo,
    baseColor: isIjo ? 'green' : 'red'
  };
}

window.LIBUR_NASIONAL = LIBUR_NASIONAL;
window.getLiburNasional = getLiburNasional;
window.checkDinoGede = checkDinoGede;
window.KETERANGAN_MAP = KETERANGAN_MAP;
window.getKeteranganKodeDetail = getKeteranganKodeDetail;
window.DINO_GEDE_LIST = DINO_GEDE_LIST;
window.DINO_IJO_LIST = DINO_IJO_LIST;
window.DINO_GEDE_SET = DINO_GEDE_SET;
window.DINO_IJO_SET = DINO_IJO_SET;
window.normDinoWukuKey = normDinoWukuKey;
window.isDinoGede = isDinoGede;
window.isDinoIjo = isDinoIjo;
window.getDinoWarnaStatus = getDinoWarnaStatus;
window.evaluateDino = evaluateDino;


// ─── Data Kepribadian & Faalakiah ─────────────────────────────────────────
const KARAKTER = {
  1: "Leader", 2: "Diplomat", 3: "Analisis", 4: "Realis",
  5: "Adventurer", 6: "Idealis", 7: "Edukatif", 8: "Eksekutor", 0: "Entertainer"
};

const PADEWAN = [
  "Batara Suryo", "Batara Bromo", "Batari Durgo", "Batara Asmoro",
  "Batara Isworo", "Batari Nogogini", "Batara Komojoyo", "Batara Sri",
  "Batara Bayu", "Batara Wisnu", "Batara Endro", "Batara Yamadipati"
];

const AKSARA_FAAL = {
  "HA": 1, "NA": 2, "CA": 3, "RA": 4, "KA": 5, "DA": 6, "TA": 7, "SA": 8, "WA": 9, "LA": 10,
  "PA": 11, "DHA": 12, "JA": 13, "YA": 14, "NYA": 15, "MA": 16, "GA": 17, "BA": 18, "THA": 19, "NGA": 20
};

const NABI_FAAL = {
  1: "Nabi Yusuf", 2: "Nabi Ahmad", 3: "Nabi Isa", 4: "Nabi Dawut", 5: "Nabi Soleman",
  6: "Nabi Adam", 7: "Nabi Ibrahim", 8: "Nabi Idris", 9: "Nabi Nuh", 10: "Nabi Musa",
  11: "Nabi Ayub", 0: "Nabi Yunus"
};

const FAAL_DESC = {
  1: "Antuk rahmate Pangeran, agung kaluhurane, pinter bisa nindakake sembarang pagaweyan. Bilahine amarga kapiterane dewe. Tolak: sedekaha WEDUS sakwayahe. Dzikir: YA ALIMU 15x setiap malam.",
  2: "Ora bisa sugih rajabrana, nanging becik atine. Bilahine tansah diudi dening wong supaya rusak nanging ora bisa. Tolak: sedekaha JARIT PUTIH lan ALI-ALI SALOKA. Jangan makan umbi-umbian.",
  3: "Tansah ditresnani lan diwedeni. Tolak: sedekaha BERAS ABANG lan BERAS PUTIH sarta PITIK IRENG MULUS lan PITIK PUTIH MULUS. Larangan: ojo dahar kewan mabur lan endog. Dzikir: YA ROBBI 400x.",
  4: "Akeh begja lan daulate, nanging bandane sarta anake akeh kang ilang. Bilahi dari lawan jenis. Tolak: sedekaha SALOKA bobot 3 aga lan dinar 5 iji. Dzikir: YA KADIRU 100x.",
  5: "Akeh begja lan daulate, sugih donya lan sugih anak. Bilahi karena sering nyidrani janji. Tolak: sedekaha JARIK IRENG saklembar. Larangan: ojo dahar pucukan. Dzikir: YA ALIMU 50x.",
  6: "Akeh begja, antuk kanugrahan, ora kendat rejekine. Anak akeh kang ilang/cacat. Bilahi dari lawan jenis. Tolak: sedekaha KERIS. Larangan: ojo dahar kewan mabur. Dzikir: YA KALKU 90x.",
  7: "Sumadiya manggon ana ing omah ibadah amarga deweke wis nandang bilahine, kabeh banda donyane wis ditinggalke. Tolak: sidekaha EMAS bobot telung aga. Prayoga ojo dahar ENDOG saklawase urip. Dzikir: YA RAHIMU 9x saben wengi.",
  8: "Demen marang kabecikan, binuka ing ngelmu gaib. Becik dadi ahlul ibadah. Sugih anak nanging akeh cacat. Tolak: sidekaha DAGING dicampur BANYU sarta JARIK PUTIH. Larangan: ojo dahar WALANG. Dzikir: YA SALAMU 100x.",
  9: "Agung rahmate, sugih banda untuk dagang/tani. Anak bakal murang sarak. Bilahi dari rabi atau anak. Tolak: sidekaha JARIK BATIK. Larangan: ojo dahar kewan mabur. Dzikir: YA KAFI, YA MUKNIYA 9x.",
  10: "Adoh banget lelakone/pacobane. Asring tapa lan perang nanging ora tahu kalah. Watake ora sabaran. Tolak: sidekaha JARIK PUTIH. Dzikir: YA ROBBI 8x.",
  11: "Tansah nandang lara-laranen. Kabejane tinemu ing buri. Bilahi dari lawan jenis. Tolak: sidekaha GANGSA bobot rong kati. Dzikir: YA MUKYI 8x.",
  0: "Ora sugih banda donya nanging sugih anak. Harta dijaga Naga lan Singa. Tolak: sidekaha TIMAH bobot rong kati lan ALI-ALI SALOKA. Larangan: ojo dahar IWAK ATI. Dzikir: YA KADIRU 100x."
};

// =========================================================================
// BASIS DATA NUJUM PRIBADI (6 DIMENSI BINCIL & PETUNGAN JAWA)
// =========================================================================

// 1. PADEWAN (Astawara / 8 Dewa)
var PADEWAN_DATA = (typeof window !== 'undefined' && window.PADEWAN_DATA) || {
  1: { nama: "Sri", arti: "Welas asih" },
  2: { nama: "Indra", arti: "Teliti, angkuh" },
  3: { nama: "Guru", arti: "Memberi percobaan, lelemeran" },
  4: { nama: "Yamadipati", arti: "Pengertian, malas" },
  5: { nama: "Rudra", arti: "Berbudi luhur" },
  6: { nama: "Brama", arti: "Brangasan" },
  7: { nama: "Kala", arti: "Serakah, bohong" },
  8: { nama: "Uma", arti: "Welas asih" }
};
if (typeof window !== 'undefined') window.PADEWAN_DATA = PADEWAN_DATA;

var PADEWAN_ARTI = (typeof window !== 'undefined' && window.PADEWAN_ARTI) || {
  "Sri": "Welas asih",
  "Indra": "Teliti, angkuh",
  "Guru": "Memberi percobaan, lelemeran",
  "Yamadipati": "Pengertian, malas",
  "Rudra": "Berbudi luhur",
  "Brama": "Brangasan",
  "Kala": "Serakah, bohong",
  "Uma": "Welas asih"
};
if (typeof window !== 'undefined') window.PADEWAN_ARTI = PADEWAN_ARTI;

// 2. PARINGKELAN (Sadwara / 6 Hari)
var PARINGKELAN_DATA = (typeof window !== 'undefined' && window.PARINGKELAN_DATA) || {
  1: { nama: "Tungle", arti: "Tidak tepat janji" },
  2: { nama: "Aryang", arti: "Pelupa" },
  3: { nama: "Wurukung", arti: "Lengah" },
  4: { nama: "Paningron", arti: "Takabur" },
  5: { nama: "Uwas", arti: "Melikan" },
  6: { nama: "Mawulu", arti: "Sering sakit" }
};
if (typeof window !== 'undefined') window.PARINGKELAN_DATA = PARINGKELAN_DATA;

var PARINGKELAN_ARTI = (typeof window !== 'undefined' && window.PARINGKELAN_ARTI) || {
  "Tungle": "Tidak tepat janji",
  "Aryang": "Pelupa",
  "Wurukung": "Lengah",
  "Paningron": "Takabur",
  "Uwas": "Melikan",
  "Mawulu": "Sering sakit"
};
if (typeof window !== 'undefined') window.PARINGKELAN_ARTI = PARINGKELAN_ARTI;

// 3. PANDANGON (Sangawara / 9 Hari)
var PANDANGON_DATA = (typeof window !== 'undefined' && window.PANDANGON_DATA) || {
  1: { nama: "Dangu", arti: "Pendiam, bodoh, kerashati" },
  2: { nama: "Jagur", arti: "Luwes, kuat, irihatin" },
  3: { nama: "Gigis", arti: "Kuat dapat menerima keadaan" },
  4: { nama: "Kerangan", arti: "Teliti, berpendirian" },
  5: { nama: "Nohan", arti: "Welasasih" },
  6: { nama: "Wogan", arti: "Tekun, hemat dan kuat pendiriannya" },
  7: { nama: "Tulus", arti: "Jujur, banyak kemauannya" },
  8: { nama: "Wurung", arti: "Berangasan dan tidak sabaran" },
  9: { nama: "Dadi", arti: "Tidak mau disaingi" }
};
if (typeof window !== 'undefined') window.PANDANGON_DATA = PANDANGON_DATA;

var PANDANGON_ARTI = (typeof window !== 'undefined' && window.PANDANGON_ARTI) || {
  "Dangu": "Pendiam, bodoh, kerashati",
  "Jagur": "Luwes, kuat, irihatin",
  "Gigis": "Kuat dapat menerima keadaan",
  "Kerangan": "Teliti, berpendirian",
  "Nohan": "Welasasih",
  "Wogan": "Tekun, hemat dan kuat pendiriannya",
  "Tulus": "Jujur, banyak kemauannya",
  "Wurung": "Berangasan dan tidak sabaran",
  "Dadi": "Tidak mau disaingi"
};
if (typeof window !== 'undefined') window.PANDANGON_ARTI = PANDANGON_ARTI;

// 4. BINCIL PAARASAN (10 Watak)
var PAARASAN_DATA = (typeof window !== 'undefined' && window.PAARASAN_DATA) || {
  1: { nama: "Aras Tuding", arti: "Pemberani dan terpakai kinerjanya tapi sering mejual perabotnya dan suka mencuri (climut)" },
  2: { nama: "Aras Kembang", arti: "Larang anak tetapi dikasihi banyak orang dan mudah berpikir bekerja serta diluluti orang" },
  3: { nama: "Lakuning Lintang", arti: "Pendiam, rendah hati, betah melek, berdagang dan jual bahasa tidak bisa diarahkan, sering pindah rumah" },
  4: { nama: "Lakuning Rembulan", arti: "Pandai, cekatan, luas pandangannya, diluluti orang, sukses hidupnya tetapi jangan sungkan - sungkan" },
  5: { nama: "Lakuning Srengenge", arti: "Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan" },
  6: { nama: "Lakuning Banyu", arti: "Teguh, rajin, ramah, bisa jadi pemimpin, banyak makan dan selalu bertengkar" },
  7: { nama: "Lakuning Bumi", arti: "Pendiam, pamarah, bodoh, senang selingkuh dan welas asih tidak punya teman/saudara" },
  8: { nama: "Lakuning Geni", arti: "Pemarah, dengki, pemberani, banyak rencana dan untuk perempuan banyak celakanya" },
  9: { nama: "Lakuning Angin", arti: "Pendiam, suka disanjung, tidak teguh dan tawar doanya, sering pindah rumah dan menyenangkan orang" },
  10: { nama: "Aras Pepet", arti: "Pendiam, tajam pikirannya, termasyur karyanya, ada bakat jadi paranormal dan jarang kesampaian cita - citanya" }
};
if (typeof window !== 'undefined') window.PAARASAN_DATA = PAARASAN_DATA;

var PAARASAN_ARTI = (typeof window !== 'undefined' && window.PAARASAN_ARTI) || {
  "Aras Tuding": "Pemberani dan terpakai kinerjanya tapi sering mejual perabotnya dan suka mencuri (climut)",
  "Aras Kembang": "Larang anak tetapi dikasihi banyak orang dan mudah berpikir bekerja serta diluluti orang",
  "Lakuning Lintang": "Pendiam, rendah hati, betah melek, berdagang dan jual bahasa tidak bisa diarahkan, sering pindah rumah",
  "Lakuning Rembulan": "Pandai, cekatan, luas pandangannya, diluluti orang, sukses hidupnya tetapi jangan sungkan - sungkan",
  "Lakuning Srengenge": "Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan",
  "Lakuning Banyu": "Teguh, rajin, ramah, bisa jadi pemimpin, banyak makan dan selalu bertengkar",
  "Lakuning Bumi": "Pendiam, pamarah, bodoh, senang selingkuh dan welas asih tidak punya teman/saudara",
  "Lakuning Geni": "Pemarah, dengki, pemberani, banyak rencana dan untuk perempuan banyak celakanya",
  "Lakuning Angin": "Pendiam, suka disanjung, tidak teguh dan tawar doanya, sering pindah rumah dan menyenangkan orang",
  "Aras Pepet": "Pendiam, tajam pikirannya, termasyur karyanya, ada bakat jadi paranormal dan jarang kesampaian cita - citanya"
};
if (typeof window !== 'undefined') window.PAARASAN_ARTI = PAARASAN_ARTI;

// 5. BINCIL PANCASUDA (7 Watak)
var PANCASUDA_DATA = (typeof window !== 'undefined' && window.PANCASUDA_DATA) || {
  1: { nama: "Wasesa Segara", arti: "Berjiwa besar, pemaaf, dapat menerima masukan baik / jelek dan berwibawa" },
  2: { nama: "Tunggak Semi", arti: "Banyak rejeki, walau dipotong tetap ada rejekinya" },
  3: { nama: "Satriya Wibawa", arti: "Dimanapun selalu berwibawa dan dihormati orang" },
  4: { nama: "Sumur Sinaba", arti: "Menjadi tempat menimba ilmu" },
  5: { nama: "Satriya Wirang", arti: "Dimanapun selalu dipermalukan walau beritikat baikpun dan banyak halangan" },
  6: { nama: "Bumi Kapetak", arti: "Bersih hatinya kuat pendiriannya, malas dan tidak tahan lapar, harus rajin belajar" },
  7: { nama: "Lebu Ketiyup Angin", arti: "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu" }
};
if (typeof window !== 'undefined') window.PANCASUDA_DATA = PANCASUDA_DATA;

var PANCASUDA_ARTI = (typeof window !== 'undefined' && window.PANCASUDA_ARTI) || {
  "Wasesa Segara": "Berjiwa besar, pemaaf, dapat menerima masukan baik / jelek dan berwibawa",
  "Tunggak Semi": "Banyak rejeki, walau dipotong tetap ada rejekinya",
  "Satriya Wibawa": "Dimanapun selalu berwibawa dan dihormati orang",
  "Sumur Sinaba": "Menjadi tempat menimba ilmu",
  "Satriya Wirang": "Dimanapun selalu dipermalukan walau beritikat baikpun dan banyak halangan",
  "Bumi Kapetak": "Bersih hatinya kuat pendiriannya, malas dan tidak tahan lapar, harus rajin belajar",
  "Lebu Ketiyup Angin": "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu",
  "Lebu Katiyup Angin": "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu"
};
if (typeof window !== 'undefined') window.PANCASUDA_ARTI = PANCASUDA_ARTI;

// 6. BINCIL KAMAROKAN (6 Watak)
var KAMAROKAN_DATA = (typeof window !== 'undefined' && window.KAMAROKAN_DATA) || {
  1: { nama: "Nuju Padu", arti: "Jelek, dalam segala hal sering bertengkar apa lagi untuk pernikahan" },
  2: { nama: "Kala Tinantang", arti: "Jelek, selalu kekurangan hidupnya, sering sakit dan besar amarnya" },
  3: { nama: "Sanggar Waringin", arti: "Baik, tentram, bahagia, banyak rejeki, berkembang, terang hatinya, menjadi pelindung" },
  4: { nama: "Mantri Sinarojo", arti: "Baik, tercapai cita-citanya, senang hidupnya, murah sandang-pangan dan banyak anak" },
  5: { nama: "Macan Ketawan", arti: "Cukupan, disegani tetapi juga dijauhi orang, sering kehilangan, ada niat jelek" },
  6: { nama: "Nuju Pati", arti: "Jelek, mampat rejekinya, susah hidupnya, cepat cerai jodohnya, banyak bencana" }
};
if (typeof window !== 'undefined') window.KAMAROKAN_DATA = KAMAROKAN_DATA;

var KAMAROKAN_ARTI = (typeof window !== 'undefined' && window.KAMAROKAN_ARTI) || {
  "Nuju Padu": "Jelek, dalam segala hal sering bertengkar apa lagi untuk pernikahan",
  "Kala Tinantang": "Jelek, selalu kekurangan hidupnya, sering sakit dan besar amarnya",
  "Sanggar Waringin": "Baik, tentram, bahagia, banyak rejeki, berkembang, terang hatinya, menjadi pelindung",
  "Mantri Sinarojo": "Baik, tercapai cita-citanya, senang hidupnya, murah sandang-pangan dan banyak anak",
  "Macan Ketawan": "Cukupan, disegani tetapi juga dijauhi orang, sering kehilangan, ada niat jelek",
  "Nuju Pati": "Jelek, mampat rejekinya, susah hidupnya, cepat cerai jodohnya, banyak bencana"
};
if (typeof window !== 'undefined') window.KAMAROKAN_ARTI = KAMAROKAN_ARTI;

// Urip Kerta-Aji untuk Pancasuda (7 Siklus)
var KERTA_AJI_HARI = [6, 4, 3, 7, 5, 7, 8]; // Minggu=6, Senin=4, Selasa=3, Rabu=7, Kamis=5, Jumat=7, Sabtu=8
var KERTA_AJI_PASARAN = [5, 9, 7, 4, 8]; // Legi=5, Pahing=9, Pon=7, Wage=4, Kliwon=8

// Urip Rakam untuk Kamarokan (6 Siklus)
var RAKAM_HARI = [3, 4, 5, 6, 7, 1, 2]; // Jumat=1, Sabtu=2, Minggu=3, Senin=4, Selasa=5, Rabu=6, Kamis=7
var RAKAM_PASARAN = [2, 3, 4, 5, 1]; // Kliwon=1, Legi=2, Pahing=3, Pon=4, Wage=5

// =========================================================================
// SISTEM MATRIKS LOOKUP TABEL BAKU PRIMBON (primbonMatrix)
// =========================================================================

function getNujumLengkap(wukuId, weekdayId, pasaranId) {
  const hari = HARI[weekdayId];
  const pasaran = PASARAN[pasaranId];
  const wuku = WUKU[wukuId];
  const cleanWuku = String(wuku || '').replace(/\s+/g, '');
  const key = `${hari}${pasaran}_${cleanWuku}`;
  const neptu = (NEPTU_HARI[weekdayId] || 0) + (NEPTU_PASARAN[pasaranId] || 0);

  // Helper untuk sisa
  const getSisa = (dict, name) => {
    if (!dict || !name) return "-";
    const target = String(name).trim().toLowerCase();
    return Object.keys(dict).find(k => (dict[k].nama || '').trim().toLowerCase() === target) || "-";
  };

  // 1. Coba via master data exact lookup (window.getNujumResult)
  const fnGetResult = (typeof getNujumResult === 'function') ? getNujumResult : (typeof window !== 'undefined' ? window.getNujumResult : null);
  const fnGetPawukon = (typeof getPawukonDetail === 'function') ? getPawukonDetail : (typeof getPawukonData === 'function' ? getPawukonData : (typeof window !== 'undefined' ? (window.getPawukonDetail || window.getPawukonData) : null));

  if (fnGetResult) {
    const res = fnGetResult(wuku, hari, pasaran);
    if (res && res.found) {
      return {
        key,
        neptu,
        padewan: {
          nama: res.padewan,
          arti: res.padewan_arti,
          sisa: getSisa(PADEWAN_DATA, res.padewan)
        },
        paringkelan: {
          nama: res.paringkelan,
          arti: res.paringkelan_arti,
          sisa: getSisa(PARINGKELAN_DATA, res.paringkelan)
        },
        pandangon: {
          nama: res.pandangon,
          arti: res.pandangon_arti,
          sisa: getSisa(PANDANGON_DATA, res.pandangon)
        },
        paarasan: {
          nama: res.paarasan,
          arti: res.paarasan_arti,
          sisa: getSisa(PAARASAN_DATA, res.paarasan)
        },
        pancasuda: {
          nama: res.pancasuda,
          arti: res.pancasuda_arti,
          sisa: getSisa(PANCASUDA_DATA, res.pancasuda)
        },
        kamarokan: {
          nama: res.kamarokan,
          arti: res.kamarokan_arti,
          sisa: getSisa(KAMAROKAN_DATA, res.kamarokan)
        },
        pawukon: fnGetPawukon ? fnGetPawukon(wuku) : null
      };
    }
  }

  // 2. Coba via window.getNujumData
  const fnGetData = (typeof getNujumData === 'function') ? getNujumData : (typeof window !== 'undefined' ? window.getNujumData : null);
  const data = fnGetData ? fnGetData(hari, pasaran, wuku) : null;
  if (data && data.found) {
    return {
      key,
      neptu,
      padewan: {
        nama: data.padewan.nama,
        arti: data.padewan.arti,
        sisa: getSisa(PADEWAN_DATA, data.padewan.nama)
      },
      paringkelan: {
        nama: data.paringkelan.nama,
        arti: data.paringkelan.arti,
        sisa: getSisa(PARINGKELAN_DATA, data.paringkelan.nama)
      },
      pandangon: {
        nama: data.pandangon.nama,
        arti: data.pandangon.arti,
        sisa: getSisa(PANDANGON_DATA, data.pandangon.nama)
      },
      paarasan: {
        nama: data.paarasan.nama,
        arti: data.paarasan.arti,
        sisa: getSisa(PAARASAN_DATA, data.paarasan.nama)
      },
      pancasuda: {
        nama: data.pancasuda.nama,
        arti: data.pancasuda.arti,
        sisa: getSisa(PANCASUDA_DATA, data.pancasuda.nama)
      },
      kamarokan: {
        nama: data.kamarokan.nama,
        arti: data.kamarokan.arti,
        sisa: getSisa(KAMAROKAN_DATA, data.kamarokan.nama)
      },
      pawukon: data.pawukon || (fnGetPawukon ? fnGetPawukon(wuku) : null)
    };
  }

  // 3. Fallback ke matriks / database objek langsung
  const matrix = (typeof MASTER_BINCIL_MATRIX !== 'undefined' ? MASTER_BINCIL_MATRIX : null)
    || (typeof bincilDatabase !== 'undefined' ? bincilDatabase : null)
    || (typeof primbonMatrix !== 'undefined' ? primbonMatrix : null)
    || (typeof nujumMatrix !== 'undefined' ? nujumMatrix : null);

  const raw = (typeof getNujumFromMatrix === 'function' ? getNujumFromMatrix(hari, pasaran, wuku) : null)
    || (typeof getNujumFromDatabase === 'function' ? getNujumFromDatabase(hari, pasaran, wuku) : null)
    || (matrix ? (
      matrix[`${String(wuku).toLowerCase()}_${String(hari).toLowerCase()}_${String(pasaran).toLowerCase()}`] ||
      matrix[key] ||
      matrix[`${hari}${pasaran}_${wuku}`] ||
      (cleanWuku === 'Sinta' ? matrix[`${hari}${pasaran}_Shinto`] : null) ||
      (cleanWuku === 'Shinto' ? matrix[`${hari}${pasaran}_Sinta`] : null) ||
      (cleanWuku === 'Medangkungan' ? matrix[`${hari}${pasaran}_Madangkungan`] : null) ||
      (cleanWuku === 'Madangkungan' ? matrix[`${hari}${pasaran}_Medangkungan`] : null) ||
      (cleanWuku === 'Warigagung' ? matrix[`${hari}${pasaran}_Wariagung`] : null)
    ) : null);

  if (raw) {
    const ket = (typeof MASTER_KET_BINCIL !== 'undefined' ? MASTER_KET_BINCIL : null) || (typeof KET_BINCIL !== 'undefined' ? KET_BINCIL : null);
    const getKet = (cat, val) => {
      if (!val || val === '-') return '-';
      if (ket && ket[cat] && ket[cat][String(val).toLowerCase()]) return ket[cat][String(val).toLowerCase()];
      return '-';
    };
    return {
      key,
      neptu,
      padewan: {
        nama: raw.padewan,
        arti: getKet('padewan', raw.padewan) || PADEWAN_ARTI[raw.padewan] || "-",
        sisa: getSisa(PADEWAN_DATA, raw.padewan)
      },
      paringkelan: {
        nama: raw.paringkelan,
        arti: getKet('paringkelan', raw.paringkelan) || PARINGKELAN_ARTI[raw.paringkelan] || "-",
        sisa: getSisa(PARINGKELAN_DATA, raw.paringkelan)
      },
      pandangon: {
        nama: raw.pandangon,
        arti: getKet('pandangon', raw.pandangon) || PANDANGON_ARTI[raw.pandangon] || "-",
        sisa: getSisa(PANDANGON_DATA, raw.pandangon)
      },
      paarasan: {
        nama: raw.paarasan,
        arti: getKet('paarasan', raw.paarasan) || PAARASAN_ARTI[raw.paarasan] || "-",
        sisa: getSisa(PAARASAN_DATA, raw.paarasan)
      },
      pancasuda: {
        nama: raw.pancasuda,
        arti: getKet('pancasuda', raw.pancasuda) || PANCASUDA_ARTI[raw.pancasuda] || "-",
        sisa: getSisa(PANCASUDA_DATA, raw.pancasuda)
      },
      kamarokan: {
        nama: raw.kamarokan,
        arti: getKet('kamarokan', raw.kamarokan) || KAMAROKAN_ARTI[raw.kamarokan] || "-",
        sisa: getSisa(KAMAROKAN_DATA, raw.kamarokan)
      },
      pawukon: fnGetPawukon ? fnGetPawukon(wuku) : null
    };
  }

  return {
    key,
    neptu,
    padewan: { nama: "-", arti: "-", sisa: "-" },
    paringkelan: { nama: "-", arti: "-", sisa: "-" },
    pandangon: { nama: "-", arti: "-", sisa: "-" },
    paarasan: { nama: "-", arti: "-", sisa: "-" },
    pancasuda: { nama: "-", arti: "-", sisa: "-" },
    kamarokan: { nama: "-", arti: "-", sisa: "-" },
    pawukon: fnGetPawukon ? fnGetPawukon(wuku) : null
  };
}
window.getNujumLengkap = getNujumLengkap;

function hitungPadewan(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).padewan;
}

function hitungParingkelan(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).paringkelan;
}

function hitungPandangon(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).pandangon;
}

function hitungPaarasan(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).paarasan;
}

function hitungPancasuda(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).pancasuda;
}

function hitungKamarokan(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).kamarokan;
}

function namaKeAksaraList(nama) {
  const clean = (nama || '').toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const VOKAL = "aiueo";
  const hasil = [];
  const kataList = clean.split(" ");
  for (const kata of kataList) {
    if (!kata) continue;
    let i = 0;
    while (i < kata.length) {
      const c = kata[i];
      if (VOKAL.includes(c)) { hasil.push("HA"); i++; continue; }
      let kons = c;
      let next = kata[i + 1] || "";
      if ((c === "n" && next === "y") || (c === "n" && next === "g") || (c === "d" && next === "h") || (c === "t" && next === "h")) {
        kons = c + next; i += 2;
      } else { i += 1; }
      if (i < kata.length && VOKAL.includes(kata[i])) { i++; if (i < kata.length && VOKAL.includes(kata[i])) i++; }
      else { continue; }
      const mapKons = {
        "h": "HA", "n": "NA", "c": "CA", "r": "RA", "k": "KA", "d": "DA", "t": "TA", "s": "SA",
        "w": "WA", "l": "LA", "p": "PA", "j": "JA", "y": "YA", "m": "MA", "g": "GA", "b": "BA",
        "ny": "NYA", "ng": "NGA", "th": "THA", "dh": "DHA"
      };
      hasil.push(mapKons[kons] || mapKons[kons[0]] || "HA");
    }
  }
  return hasil;
}

function getFaalakiah(nama) {
  const aksaraList = namaKeAksaraList(nama);
  if (aksaraList.length === 0) return { kode: 0, nabi: NABI_FAAL[0], desc: FAAL_DESC[0], aksaraStr: "-", sum: 0 };
  let sum = 0;
  for (const ak of aksaraList) sum += (AKSARA_FAAL[ak] || 1);
  const kode = sum % 12;
  return {
    kode,
    nabi: NABI_FAAL[kode] || NABI_FAAL[0],
    desc: FAAL_DESC[kode] || FAAL_DESC[0],
    aksaraStr: aksaraList.join(" "),
    sum
  };
}

const UNICODE_JAWA_TO_FAAL = {
  'ꦲ': 'HA', 'ꦤ': 'NA', 'ꦕ': 'CA', 'ꦫ': 'RA', 'ꦏ': 'KA',
  'ꦢ': 'DA', 'ꦠ': 'TA', 'ꦱ': 'SA', 'ꦮ': 'WA', 'ꦭ': 'LA',
  'ꦥ': 'PA', 'ꦝ': 'DHA', 'ꦗ': 'JA', 'ꦪ': 'YA', 'ꦚ': 'NYA',
  'ꦩ': 'MA', 'ꦒ': 'GA', 'ꦧ': 'BA', 'ꦛ': 'THA', 'ꦔ': 'NGA',
  // Aksara Murda
  'ꦟ': 'NA', 'ꦑ': 'KA', 'ꦡ': 'TA', 'ꦰ': 'SA',
  'ꦦ': 'PA', 'ꦘ': 'NYA', 'ꦓ': 'GA', 'ꦨ': 'BA',
  // Aksara Swara
  'ꦄ': 'HA', 'ꦅ': 'HA', 'ꦈ': 'HA', 'ꦌ': 'HA', 'ꦎ': 'HA',
  // Sandhangan Panyigeg & Wyanjana
  'ꦂ': 'RA', 'ꦁ': 'NGA', 'ꦃ': 'HA',
  'ꦿ': 'RA', 'ꦽ': 'RA', 'ꦾ': 'YA'
};

function parseAksaraForFaalakiah(text) {
  if (!text || !text.trim()) return [];
  const clean = text.trim();
  const jawaChars = clean.match(/[\uA980-\uA9DF]/g);
  if (jawaChars && jawaChars.length > 0) {
    const list = [];
    for (const ch of jawaChars) {
      if (UNICODE_JAWA_TO_FAAL[ch]) {
        list.push(UNICODE_JAWA_TO_FAAL[ch]);
      }
    }
    if (list.length > 0) return list;
  }
  return namaKeAksaraList(clean);
}

function updateFaalFromAksaraManual(val) {
  const aksaraList = parseAksaraForFaalakiah(val);
  const sumEl = document.getElementById('faalAksaraSum');
  const listEl = document.getElementById('faalAksaraList');
  const headEl = document.getElementById('faalHeading');
  const descEl = document.getElementById('faalDesc');

  if (aksaraList.length === 0) {
    const defaultNabi = NABI_FAAL[0];
    const defaultDesc = FAAL_DESC[0];
    if (headEl) headEl.innerHTML = `Faalakiah Asma: ${defaultNabi} (Kode <span id="faalKode">0</span>)`;
    if (sumEl) sumEl.textContent = '0';
    if (listEl) listEl.textContent = '-';
    if (descEl) descEl.textContent = defaultDesc;

    const docFaalAksara = document.getElementById('doc_faal_aksara');
    const docFaalSumKode = document.getElementById('doc_faal_sum_kode');
    const docFaalNabi = document.getElementById('doc_faal_nabi');
    const docFaalDesc = document.getElementById('doc_faal_desc');
    if (docFaalAksara) docFaalAksara.textContent = '-';
    if (docFaalSumKode) docFaalSumKode.textContent = 'Jumlah: 0 \u2192 Sisa (Kode): 0';
    if (docFaalNabi) docFaalNabi.textContent = defaultNabi;
    if (docFaalDesc) docFaalDesc.textContent = defaultDesc;
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

  const docFaalAksara = document.getElementById('doc_faal_aksara');
  const docFaalSumKode = document.getElementById('doc_faal_sum_kode');
  const docFaalNabi = document.getElementById('doc_faal_nabi');
  const docFaalDesc = document.getElementById('doc_faal_desc');
  if (docFaalAksara) docFaalAksara.textContent = val || '-';
  if (docFaalSumKode) docFaalSumKode.textContent = `Jumlah: ${sum} \u2192 Sisa (Kode): ${kode}`;
  if (docFaalNabi) docFaalNabi.textContent = nabi;
  if (docFaalDesc) docFaalDesc.textContent = desc;
}
window.updateFaalFromAksaraManual = updateFaalFromAksaraManual;

function salinAksaraFaal() {
  const el = document.getElementById('faalAksaraJawaInput');
  const txt = el ? el.value.trim() : '';
  if (!txt) {
    showToast('Aksara Jawa taksih kosong.');
    return;
  }
  copyToClipboard(txt, 'Aksara Jawa kasil dipun salin!');
}
window.salinAksaraFaal = salinAksaraFaal;

function getAsesoris(bulan, tanggal) {
  const data = {
    1: { dino: "Senin, Kamis lan Sabtu", sasi: "Januari lan Februari", lelara: "Kulit, Reumatik, Pencernaan", watu: "Black Onyx, Ruby, Giok", warna: "Biru Laut lan Ijo Tua", kembang: "Melati, Sedap Malam, Leli Putih" },
    2: { dino: "Selasa, Rabu lan Sabtu", sasi: "Februari lan Maret", lelara: "Umum", watu: "Safir Biru, Kalimaya, Amethyst", warna: "Oranye lan Abang Enom", kembang: "Mawar Oranye lan Mawar Abang" },
    3: { dino: "Selasa, Kamis lan Minggu", sasi: "Mei lan Juni", lelara: "Kulit Gatal, Reumatik", watu: "Safir Biru, Jamrud Ijo", warna: "Abu-abu", kembang: "Melati, Leli Putih, Ceplok Piring" },
    4: { dino: "Selasa", sasi: "Desember", lelara: "Mata, Ginjal, Hati", watu: "Kecubung, Intan, Badar Besi", warna: "Abang Tua lan Kuning", kembang: "Mawar Abang lan Leli Kuning" },
    5: { dino: "Rabu lan Jumat", sasi: "November", lelara: "Gulu Kejang, Jantung", watu: "Jamrud Ijo, Safir, Pirus Biru", warna: "Biru Tua, Coklat, Oranye", kembang: "Mawar Oranye, Anyelir, Suplir" },
    6: { dino: "Rabu lan Sabtu", sasi: "Februari", lelara: "Watuk, Mumet", watu: "Aquamarine, Jamrud Ijo", warna: "Putih, Kuning, Biru Enom", kembang: "Melati, Leli Putih, Anggrek" },
    7: { dino: "Senin", sasi: "Februari", lelara: "Weteng, Paru-paru", watu: "Mutiara, Mata Kucing, Biduri Bulan", warna: "Kuning Biru, Coklat", kembang: "Melati, Sedap Malam" },
    8: { dino: "Jumat lan Minggu", sasi: "Maret", lelara: "Mumet, Sendi", watu: "Berlian, Ruby Star, Topas Kuning", warna: "Kuning, Ijo, Oranye", kembang: "Melati, Leli, Anggrek" },
    9: { dino: "Rabu lan Sabtu", sasi: "April lan Agustus", lelara: "Maag, Angel Turu", watu: "Giok, Akik Lapis, Carnelian", warna: "Kuning lan Ijo", kembang: "Melati, Sedap Malam" },
    10: { dino: "Jumat", sasi: "Mei lan Agustus", lelara: "Umum", watu: "Opal, Berlian, Merjan", warna: "Biru lan Abang Anggur", kembang: "Kenanga Kuning, Wijaya Kusuma" },
    11: { dino: "Minggu lan Selasa", sasi: "Agustus", lelara: "Reumatik, Ginjal", watu: "Topas, Kalimaya, Aquamarine", warna: "Abang lan Putih", kembang: "Melati, Anggrek" },
    12: { dino: "Kamis lan Minggu", sasi: "Juli lan Oktober", lelara: "Tenggorokan, Paru-paru", watu: "Berlian, Nilam, Pirus", warna: "Ijo, Oranye, Kuning", kembang: "Melati, Leli Putih, Mawar" }
  };
  let k = 5;
  if ((bulan === 12 && tanggal >= 23) || bulan === 1 || (bulan === 2 && tanggal <= 3)) k = 1;
  else if (bulan === 2 && tanggal >= 4) k = 2;
  else if (bulan === 3 && tanggal <= 26) k = 3;
  else if ((bulan === 3 && tanggal >= 27) || (bulan === 4 && tanggal <= 19)) k = 4;
  else if ((bulan === 4 && tanggal >= 20) || (bulan === 5 && tanggal <= 12)) k = 5;
  else if ((bulan === 5 && tanggal >= 13) || (bulan === 6 && tanggal <= 22)) k = 6;
  else if ((bulan === 6 && tanggal >= 23) || bulan === 7 || (bulan === 8 && tanggal <= 2)) k = 7;
  else if (bulan === 8 && tanggal >= 3 && tanggal <= 25) k = 8;
  else if ((bulan === 8 && tanggal >= 26) || (bulan === 9 && tanggal <= 18)) k = 9;
  else if ((bulan === 9 && tanggal >= 19) || (bulan === 10 && tanggal <= 13)) k = 10;
  else if ((bulan === 10 && tanggal >= 14) || (bulan === 11 && tanggal <= 9)) k = 11;
  else k = 12;
  return data[k];
}

// ─── Data Selametan ───────────────────────────────────────────────────────
const TARGET_HARI_SELAMETAN = [
  ['Selasa', 'Sabtu', 'Kamis', 'Senin', 'Rabu', 'Selasa', "Jumat"],
  ['Rabu', 'Minggu', "Jumat", 'Selasa', 'Kamis', 'Rabu', 'Sabtu'],
  ['Kamis', 'Senin', 'Sabtu', 'Rabu', "Jumat", 'Kamis', 'Minggu'],
  ["Jumat", 'Selasa', 'Minggu', 'Kamis', 'Sabtu', "Jumat", 'Senin'],
  ['Sabtu', 'Rabu', 'Senin', "Jumat", 'Minggu', 'Sabtu', 'Selasa'],
  ['Minggu', 'Kamis', 'Selasa', 'Sabtu', 'Senin', 'Minggu', 'Rabu'],
  ['Senin', "Jumat", 'Rabu', 'Minggu', 'Selasa', 'Senin', 'Kamis']
];

const TARGET_PASARAN_SELAMETAN = {
  'Pahing': ['Wage', 'Pon', 'Legi', 'Legi', 'Kliwon', 'Legi', 'Legi'],
  'Pon':    ['Kliwon', 'Wage', 'Pahing', 'Pahing', 'Legi', 'Pahing', 'Pahing'],
  'Wage':   ['Legi', 'Kliwon', 'Pon', 'Pon', 'Pahing', 'Pon', 'Pon'],
  'Kliwon': ['Pahing', 'Legi', 'Wage', 'Wage', 'Pon', 'Wage', 'Wage'],
  'Legi':   ['Pon', 'Pahing', 'Kliwon', 'Kliwon', 'Wage', 'Kliwon', 'Kliwon']
};

const JENIS_SELAMETAN = [
  { nama: '3 Harian', approx: 3, idx: 0 },
  { nama: '7 Harian', approx: 7, idx: 1 },
  { nama: '40 Harian', approx: 40, idx: 2 },
  { nama: '100 Harian', approx: 100, idx: 3 },
  { nama: 'Pendak Pisan (1 Tahun)', approx: 354, idx: 4 },
  { nama: 'Pendak Pindho (2 Tahun)', approx: 710, idx: 5 },
  { nama: 'Nyewu (1000 Hari)', approx: 1000, idx: 6 }
];



// ─── Expose globals for inline HTML handlers ───────────────────────────────
window.switchTab = (typeof switchTab === 'function') ? switchTab : window.switchTab;
window.toggleMobileMenu = (typeof toggleMobileMenu === 'function') ? toggleMobileMenu : window.toggleMobileMenu;
window.navigasiKembali = (typeof navigasiKembali === 'function') ? navigasiKembali : window.navigasiKembali;
window.printLaporan = (typeof printLaporan === 'function') ? printLaporan : window.printLaporan;
window.printSection = (typeof printSection === 'function') ? printSection : window.printSection;
window.showToast = showToast;
window.getNujumData = (typeof getNujumData === 'function') ? getNujumData : null;
window.getPawukonData = (typeof getPawukonData === 'function') ? getPawukonData : null;
window.playGamelanTone = playGamelanTone;
window.toggleKetawangPuspawarna = (typeof toggleKetawangPuspawarna === 'function') ? toggleKetawangPuspawarna : window.toggleKetawangPuspawarna;
window.playDalangFX = playDalangFX;
window.playGamelanFX = function (typeOrFreq, optType = 'saron') {
  if (typeof typeOrFreq === 'string') {
    if (typeOrFreq === 'kepyak' || typeOrFreq === 'dodokan') {
      playDalangFX(typeOrFreq);
    } else {
      playGamelanTone(typeOrFreq === 'gong' ? 65 : 140, typeOrFreq);
    }
  } else {
    playGamelanTone(typeOrFreq, optType);
  }
};

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

// ─── KALENDER ──────────────────────────────────────────────────────────────
function initKalenderSelects() {
  const sel = document.getElementById('bulanSel');
  if (!sel) return;
  sel.innerHTML = BULAN_MASEHI.map((b, i) => `<option value="${i + 1}">${b}</option>`).join('');
  const now = new Date();
  sel.value = now.getMonth() + 1;
  const tahunInput = document.getElementById('tahunInput');
  if (tahunInput) tahunInput.value = now.getFullYear();

  const kbox = document.getElementById('keteranganKodeBox');
  if (kbox && kbox.children.length === 0) {
    kbox.innerHTML = KETERANGAN.map(([k, v]) => `<div><b class="text-prada font-mono">${k}</b>: ${v}</div>`).join('');
  }
}

function buildWatermarkKalender() {
  const layer = document.getElementById('calWatermark');
  if (!layer || layer.children.length > 0) return; // Prevent layout thrashing on every render
  const frag = document.createDocumentFragment();
  const cols = 10, rows = 12;
  const stepX = 140, stepY = 70;
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

// Days in Gregorian month (pure O(1) integer arithmetic, no Date object)
function getDaysInMonth(y, m) {
  if (m === 2) {
    return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
  }
  return (m === 4 || m === 6 || m === 9 || m === 11) ? 30 : 31;
}

window.renderKalender = function () {
  const selBulan = document.getElementById('bulanSel');
  const inpTahun = document.getElementById('tahunInput');
  const bulan = parseInt(selBulan?.value || (new Date().getMonth() + 1));
  const tahun = parseInt(inpTahun?.value || new Date().getFullYear());

  const daysInMonth = getDaysInMonth(tahun, bulan);
  const firstJDN = toJDN(tahun, bulan, 1);
  const firstWeekday = (firstJDN + 1) % 7; // 0 = Minggu ... 6 = Sabtu
  const gridStartJDN = firstJDN - firstWeekday;
  const totalDays = firstWeekday + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const janInfo = getDayInfo(tahun, 1, 1);
  const cornerHijriYear = janInfo.hijri[2];

  const printTitleEl = document.getElementById('printTitleKalender');
  if (printTitleEl) {
    printTitleEl.textContent =
      BULAN_MASEHI[bulan - 1].toUpperCase() + ' ' + tahun + '  ·  ' + cornerHijriYear + ' H — Jagad Jawa';
  }

  // Single HTML Array Buffer for maximum performance (0 DOM reflow during loop)
  const htmlBuffer = [];

  htmlBuffer.push(`
    <tr class="bg-gradient-to-r from-[#2a3660] via-[#1b2540] to-[#12192c] text-paper text-white text-center font-bold">
      <td class="p-3 text-prada font-mono text-sm">${tahun}</td>
      <td colspan="7" class="p-3 font-marcellus text-xl tracking-wider text-prada">${BULAN_MASEHI[bulan - 1].toUpperCase()}</td>
      <td class="p-3 text-prada font-mono text-sm">${cornerHijriYear} H</td>
    </tr>
    <tr class="bg-[#dfd1ac] font-bold text-center text-[11px] border-b-2 border-prada">
      <td class="p-2 text-sogan-900 font-serif">WUKU</td>
  `);

  for (let i = 0; i < 7; i++) {
    const isMinggu = (i === 0);
    htmlBuffer.push(`
      <td class="p-2 ${isMinggu ? 'text-[#dc2626] font-black' : 'text-sogan-900'}">
        ${HARI[i].toUpperCase()} <span class="bg-black/10 px-1 py-0.5 rounded font-mono text-[10px] ml-1 text-sogan-900">${NEPTU_HARI[i]}</span>
      </td>
    `);
  }

  htmlBuffer.push(`<td class="p-2 text-sogan-900 font-serif">WUKU &amp; SASI</td></tr>`);

  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);
    const wukuName = WUKU[wukuId].toUpperCase();
    const dununge = DUNUNGE[wukuId];

    let repMonthLabel = '', repYearLabel = '';
    const cellsBuffer = [];

    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const dayNum = currentJDN - firstJDN + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        cellsBuffer.push('<td class="p-0.5 sm:p-1 align-top"><div class="h-20 sm:h-24 rounded-lg bg-black/5 border border-black/5"></div></td>');
        continue;
      }

      const info = getDayInfo(tahun, bulan, dayNum);
      const [code, color] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ["", "G", 0];
      const neptuC = NEPTU_HARI[d] + NEPTU_PASARAN[info.pasaranId];

      const liburName = getLiburNasional(tahun, bulan, dayNum);
      const isLibur = Boolean(liburName);
      const isMinggu = (d === 0);
      const isDateRed = isMinggu || isLibur;

      const dinoGedeObj = checkDinoGede(wukuId, d, info.pasaranId, info.hijri[0], info.hijri[1]);
      const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[info.pasaranId], WUKU[wukuId], isMinggu, isLibur, code);
      const isGede = dinoGedeObj.isGede || dinoWarna.isGede;
      const isIjo = dinoWarna.isIjo;

      if (!repMonthLabel) {
        repMonthLabel = BULAN_JAWA[info.hijri[1] - 1] || '';
        repYearLabel = WINDU[((info.ajYear - 1955) % 8 + 8) % 8] + ' ' + info.ajYear;
      }

      const dateNumStyle = isDateRed
        ? 'color: #dc2626; font-weight: 800;'
        : 'color: #0f172a; font-weight: 700;';

      const holidayBanner = isLibur
        ? `<div class="text-[8px] sm:text-[8.5px] font-bold text-[#dc2626] leading-tight truncate mt-0.5 max-w-full" title="${liburName}">🎌 ${liburName}</div>`
        : '';

      const pasaranUpper = PASARAN[info.pasaranId].toUpperCase();
      const neptuPas = NEPTU_PASARAN[info.pasaranId];
      const bulanJawaName = BULAN_JAWA[info.hijri[1] - 1] || '';

      let codeTooltip = '';
      if (code) {
        const details = getKeteranganKodeDetail(code);
        codeTooltip = details.map(item => `${item.nama}: ${item.arti}`).join(' | ');
      }

      const cellOutlineStyle = isGede
        ? 'border: 2px solid #eab308; box-shadow: 0 0 10px rgba(234, 179, 8, 0.45);'
        : 'border: 1px solid #cbd5e1;';

      cellsBuffer.push(`
        <td onclick="showDetailTanggalJawa(${tahun}, ${bulan}, ${dayNum})"
            class="p-0.5 sm:p-1 align-top cursor-pointer select-none transition-all"
            title="Klik untuk rincian ${dayNum} ${BULAN_MASEHI[bulan - 1]} ${tahun} (${HARI[d]} ${PASARAN[info.pasaranId]})">
          <div class="cal-split-card rounded-lg overflow-hidden flex flex-col justify-between h-20 sm:h-24 shadow-sm ${isGede ? 'is-dino-gede' : 'not-dino-gede'}"
               style="${cellOutlineStyle}">
            
            <!-- Tingkat Atas (Latar Putih / Bersih) -->
            <div class="cal-split-top bg-white p-1 sm:p-1.5 flex flex-col justify-between flex-1 border-b border-slate-200/80">
              <div class="flex justify-between items-start">
                <div class="flex items-baseline gap-0.5">
                  <span class="font-marcellus text-lg sm:text-2xl leading-none" style="${dateNumStyle}">${dayNum}</span>
                  ${isGede ? '<span class="text-[#eab308] font-black text-xs sm:text-sm drop-shadow-xs ml-0.5" title="Dino Gede">★</span>' : ''}
                </div>
                <span class="font-mono text-[9px] sm:text-[10.5px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 shadow-xs" title="Neptu Dina (${NEPTU_HARI[d]}) + Pasaran (${neptuPas}) = ${neptuC}">
                  ${neptuC}
                </span>
              </div>
              ${holidayBanner}
            </div>

            <!-- Tingkat Bawah (Latar Warna Solid Hijau atau Merah) -->
            <div class="cal-split-bottom p-1 sm:p-1.5 text-white flex flex-col justify-between gap-0.5 ${dinoWarna.bottomBgClass}"
                 style="background-color: ${dinoWarna.bottomBg};">
              <div class="flex justify-between items-center text-[9.5px] sm:text-[11px] leading-none">
                <div class="font-bold tracking-wide flex items-center gap-0.5 truncate">
                  <span>${pasaranUpper}</span>
                  <span class="opacity-90 font-mono text-[8.5px] sm:text-[9.5px] font-normal">(${neptuPas})</span>
                </div>
                ${code ? `<span class="px-1 py-0.2 rounded bg-black/25 text-white font-mono font-bold text-[8px] sm:text-[9px] tracking-wider flex-shrink-0" title="${codeTooltip}">${code}</span>` : ''}
              </div>
              <div class="flex justify-between items-center text-[8.5px] sm:text-[10px] leading-none opacity-95">
                <span class="truncate font-medium">${info.hijri[0]} ${bulanJawaName}</span>
                ${isGede
                  ? '<span class="px-1 py-0.2 rounded bg-amber-300 text-amber-950 font-extrabold text-[7.5px] sm:text-[8.5px] shadow-xs flex-shrink-0">★ GEDE</span>'
                  : `<span class="text-[7.5px] sm:text-[8.5px] opacity-90 font-semibold flex-shrink-0">${isIjo ? '✓ Becik' : '▲ Ala'}</span>`}
              </div>
            </div>

          </div>
        </td>
      `);
    }

    htmlBuffer.push(`
      <tr>
        <td class="p-2 text-center align-middle font-bold text-xs bg-[#e8dfc4] border border-black/10 ${isNgisor ? 'bg-[#e8b98f]' : ''}">
          <b class="font-marcellus text-[13px] block text-sogan-900">${wukuName}</b>
          <div class="text-[10px] italic text-sogan-700">${dununge}</div>
          ${isNgisor ? '<div class="text-[9px] text-ala font-bold">⚠ ngisor</div>' : ''}
        </td>
        ${cellsBuffer.join('')}
        <td class="p-2 text-center align-middle font-bold text-xs bg-[#e8dfc4] border border-black/10 ${isNgisor ? 'bg-[#e8b98f]' : ''}">
          <b class="font-marcellus text-[13px] block text-sogan-900">${wukuName}</b>
          <div class="text-[10px] italic text-sogan-700">${dununge}</div>
          <div class="text-[9px] font-mono text-sogan-800 mt-1">${repMonthLabel} ${repYearLabel}</div>
        </td>
      </tr>
    `);
  }

  // Single DOM Assignment (Zero Layout Thrashing)
  const calTable = document.getElementById('calTable');
  if (calTable) calTable.innerHTML = htmlBuffer.join('');

  buildWatermarkKalender();
};

window.showDetailTanggalJawa = function(y, m, d) {
  const modal = document.getElementById('modalDetailKalender');
  if (!modal) return;

  const info = getDayInfo(y, m, d);
  const tglJawa = getTanggalJawaLengkap(y, m, d);

  // Tanggal Masehi & Hari Libur
  const elTglMasehi = document.getElementById('modalTanggalMasehi');
  if (elTglMasehi) elTglMasehi.textContent = `${d} ${BULAN_MASEHI[m - 1]} ${y} Masehi`;

  const liburName = getLiburNasional(y, m, d);
  const elBadgeLibur = document.getElementById('modalBadgeLibur');
  const elKetLibur = document.getElementById('modalKeteranganLibur');
  if (liburName) {
    if (elBadgeLibur) {
      elBadgeLibur.textContent = 'HARI LIBUR NASIONAL';
      elBadgeLibur.classList.remove('hidden');
    }
    if (elKetLibur) {
      elKetLibur.textContent = `🎌 ${liburName}`;
      elKetLibur.classList.remove('hidden');
    }
  } else {
    if (elBadgeLibur) elBadgeLibur.classList.add('hidden');
    if (elKetLibur) elKetLibur.classList.add('hidden');
  }

  // Weton & Neptu
  const elWetonText = document.getElementById('modalWetonText');
  if (elWetonText) elWetonText.textContent = `${tglJawa.dino} ${tglJawa.pas}`;

  const elNeptuBadge = document.getElementById('modalNeptuBadge');
  if (elNeptuBadge) {
    elNeptuBadge.textContent = `${tglJawa.dino} (${NEPTU_HARI[info.weekdayId]}) + ${tglJawa.pas} (${NEPTU_PASARAN[info.pasaranId]}) = Neptu ${tglJawa.neptu}`;
  }

  // Dino Gede
  const dinoGedeObj = checkDinoGede(info.wukuId, info.weekdayId, info.pasaranId, info.hijri[0], info.hijri[1]);
  const elBoxDinoGede = document.getElementById('modalBoxDinoGede');
  const elIconDinoGede = document.getElementById('modalIconDinoGede');
  const elTitleDinoGede = document.getElementById('modalTitleDinoGede');
  const elDescDinoGede = document.getElementById('modalDescDinoGede');

  if (dinoGedeObj.isGede) {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10';
    if (elIconDinoGede) elIconDinoGede.textContent = '★';
    if (elTitleDinoGede) elTitleDinoGede.textContent = `DINO GEDE: ${dinoGedeObj.label.toUpperCase()}`;
    if (elDescDinoGede) elDescDinoGede.textContent = 'Dina wigati lan sakral ing petungan pawukon & penanggalan Jawa.';
  } else {
    if (elBoxDinoGede) elBoxDinoGede.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-sogan-950/60 border-sogan-800 text-sogan-400';
    if (elIconDinoGede) elIconDinoGede.textContent = '✧';
    if (elTitleDinoGede) elTitleDinoGede.textContent = 'DINA LUMRAH';
    if (elDescDinoGede) elDescDinoGede.textContent = 'Boten klebet pengetan Dino Gede khusus.';
  }

  // Ala / Becik Status (Murni merujuk database_nujum - dino_ijo.csv)
  const [code, color] = GRID[info.wukuId][info.weekdayId];
  const dinoWarna = getDinoWarnaStatus(tglJawa.dino, tglJawa.pas, tglJawa.wukuName, info.weekdayId === 0, Boolean(liburName), code);
  const isBecik = dinoWarna.isIjo;
  const isAla = !isBecik;
  const elBoxAlaBecik = document.getElementById('modalBoxAlaBecik');
  const elIconAlaBecik = document.getElementById('modalIconAlaBecik');
  const elTitleAlaBecik = document.getElementById('modalTitleAlaBecik');
  const elDescAlaBecik = document.getElementById('modalDescAlaBecik');

  if (isAla) {
    if (elBoxAlaBecik) elBoxAlaBecik.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/20';
    if (elIconAlaBecik) elIconAlaBecik.textContent = '▲';
    if (elTitleAlaBecik) elTitleAlaBecik.textContent = `STATUS: ALA / NAHAS (▲ ${code ? code + ' Ala' : 'Ala'})`;
    if (elDescAlaBecik) elDescAlaBecik.textContent = 'Dina awon tumrap adeg griya, mantu, utawi lelungan tebih.';
  } else {
    if (elBoxAlaBecik) elBoxAlaBecik.className = 'p-3 rounded-xl border flex items-center gap-2.5 bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/20';
    if (elIconAlaBecik) elIconAlaBecik.textContent = '✓';
    if (elTitleAlaBecik) elTitleAlaBecik.textContent = `STATUS: BECIK / RAHAYU (✓ Becik)`;
    if (elDescAlaBecik) elDescAlaBecik.textContent = 'Dina becik kanggé maneka warni hajat, lelungan, lan pakaryan.';
  }

  // Sultan Agungan Details
  const elTglSasiJawa = document.getElementById('modalTglSasiJawa');
  if (elTglSasiJawa) elTglSasiJawa.textContent = `${tglJawa.tglJawa} ${tglJawa.bulanJawa}`;

  const elTahunJawa = document.getElementById('modalTahunJawa');
  if (elTahunJawa) elTahunJawa.textContent = `${tglJawa.tahunAJ} AJ (Tahun ${tglJawa.tahunSiklus})`;

  const elWindu = document.getElementById('modalWindu');
  if (elWindu) elWindu.textContent = `Windu ${tglJawa.namaWindu}`;

  const elHijriah = document.getElementById('modalHijriah');
  if (elHijriah) elHijriah.textContent = `${info.hijri[0]} ${BULAN_JAWA[info.hijri[1] - 1] || ''} ${info.hijri[2]} H`;

  // Pawukon
  const elNamaWuku = document.getElementById('modalNamaWuku');
  if (elNamaWuku) elNamaWuku.textContent = `Wuku ${tglJawa.wukuName} (No. ${tglJawa.wukuNo})`;

  const elDunungeWuku = document.getElementById('modalDunungeWuku');
  if (elDunungeWuku) elDunungeWuku.textContent = `${DUNUNGE[info.wukuId]}`;

  const isNgisor = (info.wukuId === 3 || info.wukuId === 13 || info.wukuId === 23);
  const elRingkelWuku = document.getElementById('modalRingkelWuku');
  if (elRingkelWuku) {
    elRingkelWuku.innerHTML = isNgisor ? '<span class="text-rose-400 font-bold">⚠ Ringkel Ngisor (Sirikan)</span>' : 'Lumrah';
  }

  const pwkData = (typeof window !== 'undefined' && window.MASTER_PAWUKON) ? (window.MASTER_PAWUKON[tglJawa.wukuName] || window.MASTER_PAWUKON[tglJawa.wukuNo]) : null;
  const elDewaWuku = document.getElementById('modalDewaWuku');
  if (elDewaWuku) {
    elDewaWuku.textContent = pwkData?.dewa ? `Bathara ${pwkData.dewa}` : (pwkData?.dewanama || '-');
  }

  // Keterangan Kode Pawukon
  const elListKode = document.getElementById('modalListKodeDetail');
  if (elListKode) {
    const kodeList = getKeteranganKodeDetail(code);
    if (kodeList.length > 0) {
      elListKode.innerHTML = kodeList.map(item => `
        <div class="p-2 rounded bg-sogan-900/80 border border-sogan-700/80">
          <strong class="text-amber-300 font-serif">${item.nama}:</strong>
          <span class="text-sogan-200 ml-1">${item.arti}</span>
        </div>
      `).join('');
    } else {
      elListKode.innerHTML = `
        <div class="p-2 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 italic">
          Dina punika boten nandhang kode sirikan tartamtu (Lega &amp; Rahayu).
        </div>
      `;
    }
  }

  // Kosmologi Pranata Mangsa & Zodiak
  const fnPM = (typeof getPranataMangsaByDate === 'function') ? getPranataMangsaByDate : (window.getPranataMangsaByDate || null);
  const pm = fnPM ? fnPM(d, m) : null;
  const elPM = document.getElementById('modalPranataMangsa');
  if (elPM) {
    elPM.textContent = pm ? `${pm.nama} (${pm.rentang}) · "${pm.candrasangkala}"` : '-';
  }

  const fnZod = (typeof getZodiakByDate === 'function') ? getZodiakByDate : (window.getZodiakByDate || null);
  const zod = fnZod ? fnZod(d, m) : null;
  const elZod = document.getElementById('modalZodiak');
  if (elZod) {
    elZod.textContent = zod ? `${zod.nama} (${zod.lambang})` : '-';
  }

  // Tombol Nujum Pribadi
  const btnNujum = document.getElementById('modalBtnHitungNujum');
  if (btnNujum) {
    btnNujum.onclick = function() {
      tutupDetailTanggalJawa();
      const dtStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (typeof hitungNujumDariTanggalJawa === 'function') {
        hitungNujumDariTanggalJawa(dtStr);
      } else if (typeof window.hitungNujumDariTanggalJawa === 'function') {
        window.hitungNujumDariTanggalJawa(dtStr);
      } else if (typeof bukaTab === 'function') {
        bukaTab('tab-kepribadian');
      }
    };
  }

  modal.onclick = function(e) {
    if (e.target === modal) {
      window.tutupDetailTanggalJawa();
    }
  };

  modal.classList.remove('hidden');
};

window.tutupDetailTanggalJawa = function() {
  const modal = document.getElementById('modalDetailKalender');
  if (modal) modal.classList.add('hidden');
};

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.tutupDetailTanggalJawa();
    }
  });
}

// ─── KALENDER CETAK / PDF EKSPOR ───────────────────────────────────────────
function renderLaporanKalenderPrintHtml(bulan, tahun) {
  const daysInMonth = getDaysInMonth(tahun, bulan);
  const firstJDN = toJDN(tahun, bulan, 1);
  const firstWeekday = (firstJDN + 1) % 7;
  const gridStartJDN = firstJDN - firstWeekday;
  const totalDays = firstWeekday + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const janInfo = getDayInfo(tahun, 1, 1);
  const midInfo = getDayInfo(tahun, bulan, Math.min(15, daysInMonth));
  const cornerHijriYear = midInfo?.hijri ? midInfo.hijri[2] : (janInfo?.hijri ? janInfo.hijri[2] : '-');

  let repMonthLabel = '', repYearLabel = '', repWindu = '';
  const wukusInMonth = [];

  const calRowsHtml = [];
  for (let w = 0; w < totalWeeks; w++) {
    const weekStartJDN = gridStartJDN + w * 7;
    const weekDiff = weekStartJDN - EPOCH_JDN;
    const wukuId = ((Math.floor(weekDiff / 7) % 30) + 30) % 30;
    const isNgisor = (wukuId === 3 || wukuId === 13 || wukuId === 23);

    if (!wukusInMonth.some(item => item.id === wukuId)) {
      wukusInMonth.push({ id: wukuId, nama: WUKU[wukuId], dununge: DUNUNGE[wukuId], isNgisor });
    }

    let rowMonthLabel = '', rowYearLabel = '';
    const cellsHtml = [];

    for (let d = 0; d < 7; d++) {
      const currentJDN = weekStartJDN + d;
      const dayNum = currentJDN - firstJDN + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        cellsHtml.push('<td style="background-color: #f3f4f6; border: 0.5pt solid #d1d5db; height: 36pt;"></td>');
        continue;
      }

      const info = getDayInfo(tahun, bulan, dayNum);
      const [code, color, gede] = (GRID[wukuId] && GRID[wukuId][d]) ? GRID[wukuId][d] : ["", "G", 0];
      const neptuC = NEPTU_HARI[d] + NEPTU_PASARAN[info.pasaranId];

      const liburName = getLiburNasional(tahun, bulan, dayNum);
      const isLibur = Boolean(liburName);
      const isMinggu = (d === 0);
      const isDateRed = isMinggu || isLibur;

      const dinoGedeObj = checkDinoGede(wukuId, d, info.pasaranId, info.hijri[0], info.hijri[1]);
      const dinoWarna = getDinoWarnaStatus(HARI[d], PASARAN[info.pasaranId], WUKU[wukuId], isMinggu, isLibur, code);
      const isGede = dinoGedeObj.isGede || dinoWarna.isGede;
      const isIjo = dinoWarna.isIjo;
      const isAla = !isIjo;

      if (!repMonthLabel && info?.hijri) {
        repMonthLabel = BULAN_JAWA[info.hijri[1] - 1] || '';
        repYearLabel = info.ajYear;
        repWindu = WINDU[((info.ajYear - 1955) % 8 + 8) % 8];
      }
      if (info?.hijri) {
        rowMonthLabel = BULAN_JAWA[info.hijri[1] - 1] || '';
        rowYearLabel = info.ajYear;
      }

      const dateNumColor = isDateRed ? '#dc2626' : '#0f172a';
      const cellBorder = isGede ? '1.5pt solid #eab308' : '0.5pt solid #cbd5e1';
      const bottomBg = dinoWarna.bottomBg; // #16a34a (Hijau Solid) or #dc2626 (Dino Abang)
      const pasaranUpper = PASARAN[info.pasaranId].toUpperCase();
      const neptuPas = NEPTU_PASARAN[info.pasaranId];
      const bulanJawaName = BULAN_JAWA[info.hijri[1] - 1] || '';

      cellsHtml.push(`
        <td style="border: ${cellBorder}; padding: 0; vertical-align: top; height: 38pt; background-color: #ffffff;">
          <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
            <!-- Tingkat Atas (Putih) -->
            <div style="background-color: #ffffff; padding: 2.5pt 3pt 1.5pt 3pt; border-bottom: 0.5pt solid #e2e8f0;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                  <strong style="font-size: 9.5pt; color: ${dateNumColor}; line-height: 1;">${dayNum}</strong>
                  ${isGede ? '<span style="color: #eab308; font-size: 7.5pt; font-weight: bold; margin-left: 1pt;">★</span>' : ''}
                </div>
                <span style="font-size: 6.5pt; font-family: monospace; font-weight: bold; background-color: #f1f5f9; padding: 0.5pt 2pt; border-radius: 2pt; border: 0.5pt solid #cbd5e1;">${neptuC}</span>
              </div>
              ${isLibur ? `<div style="font-size: 5.5pt; color: #dc2626; font-weight: bold; line-height: 1.1; margin-top: 1pt; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${liburName}</div>` : ''}
            </div>
            <!-- Tingkat Bawah (Hijau Solid atau Merah Solid) -->
            <div style="background-color: ${bottomBg}; color: #ffffff; padding: 2pt 3pt; font-size: 6.5pt; display: flex; flex-direction: column; gap: 1pt;">
              <div style="display: flex; justify-content: space-between; align-items: center; line-height: 1;">
                <span style="font-weight: bold;">${pasaranUpper} (${neptuPas})</span>
                ${code ? `<span style="font-family: monospace; font-weight: bold; background-color: rgba(0,0,0,0.25); padding: 0.5pt 1.5pt; border-radius: 1.5pt;">${code}</span>` : ''}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; line-height: 1; opacity: 0.95;">
                <span>${info.hijri ? info.hijri[0] : ''} ${bulanJawaName}</span>
                <span style="font-size: 5.5pt; font-weight: bold;">${isGede ? '★ GEDE' : (isIjo ? '✓ Becik' : '▲ Ala')}</span>
              </div>
            </div>
          </div>
        </td>
      `);
    }

    calRowsHtml.push(`
      <tr>
        <td style="border: 0.5pt solid #d1d5db; background-color: #f9fafb; text-align: center; vertical-align: middle; padding: 3pt 2pt; width: 13%;">
          <strong style="font-size: 8pt; display: block;">${WUKU[wukuId].toUpperCase()}</strong>
          <div style="font-size: 6.5pt; font-style: italic;">${DUNUNGE[wukuId]}</div>
          ${isNgisor ? '<div style="font-size: 6.5pt; font-weight: bold; color: #b91c1c;">(Ngisor)</div>' : ''}
        </td>
        ${cellsHtml.join('')}
        <td style="border: 0.5pt solid #d1d5db; background-color: #f9fafb; text-align: center; vertical-align: middle; padding: 3pt 2pt; width: 13%;">
          <strong style="font-size: 8pt; display: block;">${WUKU[wukuId].toUpperCase()}</strong>
          <div style="font-size: 6.5pt;">${rowMonthLabel} ${rowYearLabel}</div>
        </td>
      </tr>
    `);
  }

  const fnPM = (typeof getPranataMangsaByDate === 'function') ? getPranataMangsaByDate : (window.getPranataMangsaByDate || null);
  const pm1 = fnPM ? fnPM(5, bulan) : null;
  const pm2 = fnPM ? fnPM(25, bulan) : null;
  let pmStr = pm1 ? `${pm1.nama} (${pm1.rentang}) &middot; Candrasangkala: &ldquo;${pm1.candrasangkala}&rdquo;` : '-';
  if (pm2 && pm1 && pm2.nama !== pm1.nama) {
    pmStr += ` & dilanjutkan ${pm2.nama} (${pm2.rentang})`;
  }

  const wukuListStr = wukusInMonth.map(w => `<strong>${w.nama}</strong> (${w.dununge}${w.isNgisor ? ', Ringkel Ngisor' : ''})`).join(' &middot; ');

  return `
    <div class="print-report-wrapper">
      <div class="print-watermark print-doc-watermark watermark-print">Aether Code</div>

      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- KOP DOKUMEN RESMI -->
        <div class="doc-header-kop mb-2 border-b-2 border-black pb-1.5">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-size: 14pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.15em;">JAGAD JAWA</div>
              <div style="font-size: 11pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 2px 0;">ALMANAK &amp; KALENDER JAWA ISLAM</div>
              <div style="font-size: 7.5pt; font-style: italic;">Pawukon, Pasaran, Pranata Mangsa &amp; Petungan Dina Kasultanan Ngayogyakarta - Karaton Surakarta</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 8pt; font-weight: bold;">ARSIP KALENDER</div>
              <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Archival</div>
            </div>
          </div>
        </div>

        <!-- BAGIAN 1: RINCIAN PENANGGALAN BULAN -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 1: RINCIAN PENANGGALAN BULAN</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Bulan &amp; Tahun Masehi</td>
                <td style="width: 28%;"><strong>${BULAN_MASEHI[bulan - 1].toUpperCase()} ${tahun}</strong></td>
                <td class="doc-label-cell">Tahun Hijriah</td>
                <td style="width: 28%;">${cornerHijriYear} Hijriah</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Sasi Jawa &amp; Windu</td>
                <td><strong>${repMonthLabel} ${repYearLabel}</strong> (Windu ${repWindu || '-'})</td>
                <td class="doc-label-cell">Kurup Sultan Agungan</td>
                <td>Asapon / Salasiyah (Alip Selasa Pon)</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pranata Mangsa</td>
                <td colspan="3">${pmStr}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 2: MATRIKS KALENDER & DINA PASARAN -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 2: MATRIKS KALENDER &amp; DINA PASARAN</div>
          <table class="doc-table" style="font-size: 7.5pt; text-align: center;">
            <thead>
              <tr>
                <th style="width: 13%;">Wuku</th>
                <th style="width: 10.5%; color: #dc2626;">Ngahad</th>
                <th style="width: 10.5%;">Senen</th>
                <th style="width: 10.5%;">Selasa</th>
                <th style="width: 10.5%;">Rebo</th>
                <th style="width: 10.5%;">Kemis</th>
                <th style="width: 10.5%;">Jumuah</th>
                <th style="width: 10.5%;">Setu</th>
                <th style="width: 13%;">Wuku &amp; Sasi</th>
              </tr>
            </thead>
            <tbody>
              ${calRowsHtml.join('')}
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 3: ENSIKLOPEDIA WUKU & PETUNJUK DINA -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 3: ENSIKLOPEDIA WUKU &amp; PETUNJUK DINA BULAN INI</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell" style="width: 24%;">Wuku Lumampah</td>
                <td>${wukuListStr}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pedoman &amp; Paugeran</td>
                <td style="font-size: 7.5pt; line-height: 1.4;">
                  Angka ing nginggil nunjukaken tanggal Masehi lan neptu dina (N). Teks tengah nunjukaken pasaran Jawa. Angka ing ngandhap nunjukaken tanggal Jawa/Hijriah sarta status petung (Becik utawi Ala kanggé adeg griya, lelungan, utawi hajat). Gantos dina Jawa kawiwitan nalika surup (jam 18.00 sore).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 8mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>Kalender Jawa ${BULAN_MASEHI[bulan - 1]} ${tahun} &middot; Karaton Surakarta &amp; Kasultanan Ngayogyakarta</span>
          <span>Halaman 1 dari 1 &middot; Aether Code Archival</span>
        </div>
      </div>
    </div>
  `;
}

function printLaporanKalender(theme = 'parchment') {
  const bulan = parseInt(document.getElementById('bulanSel')?.value || 1);
  const tahun = parseInt(document.getElementById('tahunInput')?.value || 2026);
  const printDocHtml = renderLaporanKalenderPrintHtml(bulan, tahun);

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const customTitle = `Jagad Jawa — Kalender ${BULAN_MASEHI[bulan - 1]} ${tahun}`;
  if (typeof printLaporan === 'function') {
    printLaporan(theme, customTitle);
  } else if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}
window.renderLaporanKalenderPrintHtml = renderLaporanKalenderPrintHtml;
window.printLaporanKalender = printLaporanKalender;

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

window.updateKepribadianQuickInfo = function updateKepribadianQuickInfo() {
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

  const tglJawaRes = (typeof getTanggalJawaLengkap === 'function') ? getTanggalJawaLengkap(y, m, d) : null;
  const sasiFn = (typeof getWatakSasiJawa === 'function') ? getWatakSasiJawa : (window.getWatakSasiJawa || null);
  const sasiJawaRes = (sasiFn && tglJawaRes?.bulanJawa) ? sasiFn(tglJawaRes.bulanJawa) : null;

  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian')?.value) || 2026;
  const umur = Math.max(0, tahunHitung - y);
  const siklusFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (window.hitungSiklusTahunan || null);
  const siklusRes = siklusFn ? siklusFn(umur) : null;

  const fnKarakter = (typeof hitungKarakterDasar === 'function') ? hitungKarakterDasar : (window.hitungKarakterDasar || null);
  const karakterRes = fnKarakter ? fnKarakter(d, m, y) : null;

  const fnSirikan = (typeof getSirikanAdhepOmah === 'function') ? getSirikanAdhepOmah : (window.getSirikanAdhepOmah || null);
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
    if (karakterRes && karakterRes.data && karakterRes.data.tipe && karakterRes.data.tipe !== '-') {
      elKarakter.innerText = `Tipe ${karakterRes.noKarakter}: ${karakterRes.data.tipe}`;
    } else {
      elKarakter.innerText = '-';
    }
  }
  if (elSirikan) {
    if (sirikanRes && sirikanRes.pantanganText && sirikanRes.pantanganText !== '-') {
      elSirikan.innerText = `${sirikanRes.pantanganText} (Aman: ${sirikanRes.arahAmanText})`;
    } else if (sirikanRes && sirikanRes.sirikanNeptu !== '-') {
      elSirikan.innerText = `${sirikanRes.sirikanNeptu} (Neptu) · ${sirikanRes.sirikanDina} (Dina)`;
    } else {
      elSirikan.innerText = '-';
    }
  }
}
window.updateKepribadianQuickInfo = (typeof updateKepribadianQuickInfo === 'function') ? updateKepribadianQuickInfo : window.updateKepribadianQuickInfo;

function renderKonversiTanggalJawa(dateVal) {
  let val = dateVal;
  if (!val) {
    const elInput = document.getElementById('inputTanggalJawa');
    val = elInput ? elInput.value : '';
  }
  if (!val) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    val = `${y}-${m}-${d}`;
    const elInput = document.getElementById('inputTanggalJawa');
    if (elInput) elInput.value = val;
  }

  const [y, m, d] = val.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;

  const tglJawa = (typeof getTanggalJawaLengkap === 'function') ? getTanggalJawaLengkap(y, m, d) : null;
  if (!tglJawa) return;
  const fnSasi = (typeof getWatakSasiJawa === 'function') ? getWatakSasiJawa : (window.getWatakSasiJawa || null);
  const sasiJawa = fnSasi ? fnSasi(tglJawa.bulanJawa) : null;
  const mangsa = (typeof getPranataMangsaByDate === 'function') ? getPranataMangsaByDate(d, m) : null;
  const zodiak = (typeof getZodiakByDate === 'function') ? getZodiakByDate(d, m) : null;

  const resContainer = document.getElementById('hasilKonversiTanggalJawa');
  if (!resContainer) return;

  resContainer.innerHTML = `
    <div class="space-y-4">
      <!-- Banner Utama Hasil Konversi -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sogan-950 via-keraton to-wulung border border-prada/40 shadow-2xl space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-700/60 pb-3">
          <div>
            <span class="text-[10px] font-mono text-prada uppercase tracking-widest font-semibold block">HASIL KONVERSI PANANGGALAN JAWA</span>
            <h3 class="font-marcellus text-lg sm:text-2xl font-bold text-prada-light">${d} ${BULAN_MASEHI[m - 1]} ${y} M</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-sogan-900 border border-prada/50 text-prada font-bold text-xs font-mono">
            ${tglJawa.dino} ${tglJawa.pas} (Neptu ${tglJawa.neptu})
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-amber-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Tanggal & Bulan Jawa</span>
            <strong class="font-marcellus text-base sm:text-lg text-amber-300">${tglJawa.tglJawa} ${tglJawa.bulanJawa}</strong>
            ${sasiJawa && sasiJawa.padanan !== '-' ? `<span class="block text-[10px] text-sogan-400 mt-0.5">Padanan: ${sasiJawa.padanan}</span>` : ''}
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-prada/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Tahun Jawa (AJ / Saka)</span>
            <strong class="font-marcellus text-base sm:text-lg text-prada-light">${tglJawa.tahunAJ} AJ (Tahun ${tglJawa.tahunSiklus})</strong>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-teal-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Siklus Windu</span>
            <strong class="font-marcellus text-base sm:text-lg text-teal-300">Windu ${tglJawa.namaWindu}</strong>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/80 border border-rose-500/30">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-0.5">Pawukon (Siklus 210)</span>
            <strong class="font-marcellus text-base sm:text-lg text-rose-300">Wuku ${tglJawa.wukuName} (${tglJawa.wukuNo})</strong>
          </div>
        </div>

        <div class="p-3 bg-sogan-950/90 rounded-xl border border-sogan-800 text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="text-[10px] text-sogan-400 block uppercase">Penanggalan Lengkap Sultan Agungan:</span>
            <span class="font-mono text-xs sm:text-sm font-bold text-prada">${tglJawa.fullStr}</span>
          </div>
          <button onclick="hitungNujumDariTanggalJawa('${val}')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold hover:brightness-110 transition shadow text-xs flex items-center gap-1.5">
            <i class="fa-solid fa-user-astronaut"></i> Hitung Nujum Pribadi &rarr;
          </button>
        </div>
      </div>

      ${sasiJawa && sasiJawa.sasi !== '-' ? `
      <!-- Watak Sasi Jawa Banner -->
      <div class="p-4 bg-keraton rounded-xl border border-teal-800/40 space-y-1.5 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800/80 pb-2">
          <span class="text-[10px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-moon text-teal-400"></i> Watak Sasi Lahir Jawa: ${sasiJawa.sasi}
          </span>
          <span class="px-2 py-0.5 rounded bg-sogan-950 border border-teal-500/30 text-[10px] text-prada font-bold font-mono">
            Padanan Hijriyah: ${sasiJawa.padanan}
          </span>
        </div>
        <p class="text-sogan-100 text-xs sm:text-sm leading-relaxed mt-1 font-medium">
          ${sasiJawa.watak}
        </p>
      </div>
      ` : ''}

      <!-- Detail Parameter Weton & Kosmologi Musim -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 bg-keraton rounded-xl border border-sogan-800 space-y-2">
          <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-2">
            <i class="fa-solid fa-compass text-amber-400"></i> Rincian Neptu & Weton
          </h4>
          <table class="w-full text-[11px] border-collapse">
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Dina (Hari Masehi):</td><td class="font-bold text-sogan-100 text-right py-1">${tglJawa.dino} (Neptu ${NEPTU_HARI[getDayInfo(y, m, d).weekdayId]})</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Pasaran Jawa:</td><td class="font-bold text-sogan-100 text-right py-1">${tglJawa.pas} (Neptu ${NEPTU_PASARAN[getDayInfo(y, m, d).pasaranId]})</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Total Neptu Weton:</td><td class="font-bold text-prada text-right py-1">${tglJawa.neptu}</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Sasi Jawa &amp; Padanan:</td><td class="font-bold text-amber-300 text-right py-1">${tglJawa.bulanJawa} (${sasiJawa ? sasiJawa.padanan : '-'})</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Wuku Siklus 30:</td><td class="font-bold text-sogan-100 text-right py-1">${tglJawa.wukuName} (Ke-${tglJawa.wukuNo})</td></tr>
            <tr class="py-1.5"><td class="text-sogan-400 py-1">Tahun Jawa & Kurup:</td><td class="font-bold text-sogan-100 text-right py-1">Tahun ${tglJawa.tahunSiklus} (${tglJawa.tahunAJ} AJ)</td></tr>
          </table>
        </div>

        <div class="p-4 bg-keraton rounded-xl border border-sogan-800 space-y-2">
          <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-2">
            <i class="fa-solid fa-cloud-sun text-cyan-400"></i> Kosmologi Musim & Surya
          </h4>
          <table class="w-full text-[11px] border-collapse">
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Pranata Mangsa:</td><td class="font-bold text-cyan-300 text-right py-1">${mangsa ? mangsa.nama : '-'}</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Candrasangkala:</td><td class="italic text-sogan-200 text-right py-1">${mangsa ? '&ldquo;' + mangsa.candrasangkala + '&rdquo;' : '-'}</td></tr>
            <tr class="border-b border-sogan-900 py-1.5"><td class="text-sogan-400 py-1">Zodiak Surya:</td><td class="font-bold text-amber-300 text-right py-1">${zodiak ? zodiak.nama + ' (' + zodiak.elemen + ')' : '-'}</td></tr>
            <tr class="py-1.5"><td class="text-sogan-400 py-1">Siklus Windu:</td><td class="font-bold text-teal-300 text-right py-1">Windu ${tglJawa.namaWindu}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;
}
window.renderKonversiTanggalJawa = renderKonversiTanggalJawa;

function hitungNujumDariTanggalJawa(dateVal) {
  const tglInput = document.getElementById('tglLahirKepribadian');
  if (tglInput) {
    tglInput.value = dateVal;
  }
  switchTab('kepribadian');
  if (typeof updateKepribadianQuickInfo === 'function') {
    updateKepribadianQuickInfo();
  }
  if (typeof hitungKepribadianLengkap === 'function') {
    hitungKepribadianLengkap();
  }
}
window.hitungNujumDariTanggalJawa = hitungNujumDariTanggalJawa;


function renderSiklusTahunanCardHtml(umur, baseUmur) {
  if (baseUmur === undefined || baseUmur === null) baseUmur = umur;
  const siklusFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (window.hitungSiklusTahunan || null);
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
            <i class="fa-solid fa-arrows-spin text-prada"></i> Siklus Tahunan: Siklus Padewan & Shio Tahunan
          </h4>
          <p class="text-[11px] text-sogan-300 mt-0.5">
            Dihitung berdasarkan usia (<span class="text-prada font-semibold">${umur} tahun</span> &middot; Rumus: <code class="font-mono text-amber-300">${umur} % 12 = sisa ${umur % 12 === 0 ? 12 : (umur % 12)}</code> &rarr; Siklus Ke-${siklus.siklusNo}). Siklus berganti setiap pertambahan tahun usia.
          </p>
        </div>

        <!-- Tombol Interaktif Stepper Usia -->
        <div class="flex items-center gap-1.5 self-start sm:self-center bg-keraton/90 p-1.5 rounded-xl border border-sogan-700/80 shadow-inner">
          <button type="button" onclick="ubahUmurSiklusTahunan(${prevUmur}, ${baseUmur})" ${umur <= 0 ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-200 hover:text-prada hover:border-prada disabled:opacity-30 disabled:pointer-events-none transition text-xs font-semibold flex items-center gap-1" title="Lihat siklus usia sebelumnya (${prevUmur} tahun)">
            <i class="fa-solid fa-chevron-left text-[10px]"></i> ${prevUmur} Thn
          </button>
          
          <div class="px-3 py-1 bg-sogan-950 rounded-lg border border-prada/40 text-center min-w-[75px]">
            <span class="block text-[9px] uppercase font-bold text-sogan-400">Usia</span>
            <span class="font-bold text-prada text-xs sm:text-sm">${umur} Thn</span>
          </div>

          <button type="button" onclick="ubahUmurSiklusTahunan(${nextUmur}, ${baseUmur})" class="px-2.5 py-1.5 rounded-lg bg-sogan-900 border border-sogan-700 text-sogan-200 hover:text-prada hover:border-prada transition text-xs font-semibold flex items-center gap-1" title="Lihat siklus usia berikutnya (${nextUmur} tahun)">
            ${nextUmur} Thn <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>

          ${!isOriginal ? `
          <button type="button" onclick="ubahUmurSiklusTahunan(${baseUmur}, ${baseUmur})" class="ml-1 px-2.5 py-1.5 rounded-lg bg-becik/30 border border-becik/50 text-emerald-300 hover:bg-becik/50 transition text-xs font-semibold flex items-center gap-1" title="Kembali ke Usia Lahir (${baseUmur} tahun)">
            <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset
          </button>
          ` : ''}
        </div>
      </div>

      <!-- Grid 2 Kolom: Shio Tahunan & Padewan Tahunan -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1">
        
        <!-- KOLOM 1: SIKLUS SHIO TAHUNAN (4 cols) -->
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
              <div class="font-marcellus text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wide">${shio.shio}</div>
              <span class="text-[10px] text-sogan-400 italic">Usia ${umur} Tahun</span>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-sogan-400 uppercase font-semibold block">Tegese & Dinamika Karakter:</span>
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

        <!-- KOLOM 2: SIKLUS PADEWAN TAHUNAN (8 cols) -->
        <div class="lg:col-span-8 bg-keraton/90 p-4 rounded-xl border border-prada/30 space-y-3">
          
          <!-- Banner Dewa Pelindung dengan Visual Wayang -->
          <div class="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-sogan-950/80 border border-sogan-800">
            <div class="w-20 h-28 flex-shrink-0 flex items-center justify-center p-1.5 rounded-lg bg-keraton border border-prada/30 shadow-inner">
              <img src="${pad.gambar || 'assets/wayang/surakarta/gunungan.png'}" alt="${pad.nama}" class="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)]" onerror="this.onerror=null; this.src='assets/wayang/surakarta/gunungan.png';" />
            </div>
            <div class="flex-grow space-y-1 text-center sm:text-left">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
                  Dewa Pelindung Usia ${umur} Thn
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-sogan-900 border border-sogan-700 text-[10px] text-sogan-300">
                  Siklus Padewan #${siklus.siklusNo}
                </span>
              </div>
              <h5 class="font-marcellus text-lg sm:text-xl font-bold gold-gradient-text">${pad.nama}</h5>
              <p class="text-xs text-sogan-300 font-medium">${pad.dewa}</p>
            </div>
          </div>

          <!-- Rincian Parameter Padewan Lengkap -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            
            <!-- Watak Dasar -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-sogan-800 space-y-1">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-masks-theater text-amber-400"></i> Watak Dasar
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.watak}</p>
            </div>

            <!-- Karier & Usaha -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-sogan-800 space-y-1">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-briefcase text-amber-400"></i> Karier & Wiraswasta
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.karier}</p>
            </div>

            <!-- Kelemahan Diri -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-amber-900/40 space-y-1">
              <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-triangle-exclamation text-amber-400"></i> Kelemahan Diri
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.kelemahan}</p>
            </div>

            <!-- Kerentanan Kesehatan -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-rose-900/40 space-y-1">
              <span class="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-heart-pulse text-rose-400"></i> Kerentanan Kesehatan
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.kesehatan}</p>
            </div>

            <!-- Ramalan Jodoh & Keluarga -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-blue-900/40 space-y-1">
              <span class="text-[10px] uppercase font-bold text-blue-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-people-roof text-blue-400"></i> Ramalan Jodoh & Batih (Keluarga)
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.keluarga}</p>
            </div>

            <!-- Ancaman Bahaya -->
            <div class="p-3 rounded-lg bg-sogan-950/70 border border-red-900/40 space-y-1">
              <span class="text-[10px] uppercase font-bold text-red-300 flex items-center gap-1.5 tracking-wider">
                <i class="fa-solid fa-shield-virus text-red-400"></i> Ancaman Bebaya / Bahaya
              </span>
              <p class="text-sogan-200 text-[11px] leading-relaxed">${pad.bahaya}</p>
            </div>

          </div>

          <!-- Nasehat & Ikhtiar Solutif -->
          <div class="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/60 space-y-1">
            <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-hand-holding-heart text-emerald-400"></i> Nasehat & Solusi Ikhtiar
            </span>
            <p class="text-emerald-100/90 text-xs leading-relaxed italic">
              "${pad.solusi}"
            </p>
          </div>

        </div>

      </div>
    </div>
  `;
}

function updateDocSiklusTahunan(umur) {
  const siklusFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (window.hitungSiklusTahunan || null);
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

function ubahUmurSiklusTahunan(newUmur, baseUmur) {
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
window.renderSiklusTahunanCardHtml = renderSiklusTahunanCardHtml;
function renderShioElemenCardHtml(shioData) {
  if (!shioData || !shioData.shio) return '';
  const d = shioData.detail || {};

  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <!-- Header Shio & Elemen Wu Xing -->
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-3 gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
              Zodiak Tionghoa &amp; Teori Wu Xing
            </span>
            <span class="px-2 py-0.5 rounded-full bg-sogan-950 border border-sogan-700 text-[10px] text-sogan-300 font-mono">
              Tahun Lahir: ${shioData.tahun} M
            </span>
          </div>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-yin-yang text-prada"></i> Shio Kelahiran: ${shioData.shio} &middot; Elemen ${shioData.elemenTahun}
          </h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-sogan-400 block uppercase font-bold">Kombinasi Elemen</span>
          <span class="font-marcellus text-base sm:text-lg font-bold gold-gradient-text">${shioData.elemenTetap} &middot; ${shioData.elemenTahun}</span>
        </div>
      </div>

      <!-- Sifat Elemen Wu Xing & Sifat Dasar -->
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

      <!-- Watak Positif & Negatif -->
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

      <!-- Karir, Perjodohan & Pantangan -->
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
window.renderShioElemenCardHtml = renderShioElemenCardHtml;

function renderKarakterDasarCardHtml(karakterRes) {
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
          <span class="font-marcellus text-lg sm:text-xl font-bold gold-gradient-text">${d.tipe}</span>
        </div>
      </div>

      <div class="p-3 bg-keraton/90 rounded-xl border border-sogan-800 space-y-1">
        <span class="text-[10px] text-sogan-400 uppercase font-bold tracking-wider block">Ringkasan Esensi Karakter:</span>
        <p class="text-sogan-100 text-xs sm:text-sm leading-relaxed font-medium">${d.ringkasan}</p>
      </div>

      ${d.kekuatan ? `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <!-- Kekuatan -->
        <div class="p-3 bg-keraton/80 rounded-xl border border-emerald-900/40 space-y-1.5">
          <span class="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-award text-emerald-400"></i> Kekuatan & Potensi Bawaan
          </span>
          <div class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed whitespace-pre-line">${d.kekuatan}</div>
        </div>

        <!-- Kelemahan & Kunci Negosiasi -->
        <div class="p-3 bg-keraton/80 rounded-xl border border-rose-900/40 space-y-2 flex flex-col justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5 tracking-wider mb-1">
              <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Kelemahan & Titik Kritis
            </span>
            <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.kelemahan || '-'}</p>
          </div>
          <div class="pt-2 border-t border-sogan-800/80">
            <span class="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider mb-1">
              <i class="fa-solid fa-handshake text-amber-400"></i> Kunci Pendekatan & Negosiasi
            </span>
            <p class="text-amber-100/90 text-[11px] leading-relaxed italic">${d.negosiasi || '-'}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <!-- Sikap yang Harus Dibangun -->
        <div class="p-3 bg-sogan-950/80 rounded-xl border border-sogan-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
            <i class="fa-solid fa-seedling text-amber-400"></i> Sikap yang Harus Dibangun
          </span>
          <p class="text-sogan-200 text-[11px] sm:text-xs leading-relaxed">${d.sikap || '-'}</p>
        </div>

        <!-- Motto Bawah Sadar -->
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

function renderWatakDinaPasaranCardHtml(watakDinaRes, watakPasaranRes, sasiJawaRes) {
  if (!watakDinaRes && !watakPasaranRes && !sasiJawaRes) return '';
  const sasiName = sasiJawaRes?.sasi && sasiJawaRes.sasi !== '-' ? sasiJawaRes.sasi : '';
  const titleSasi = sasiName ? ` & Sasi (${sasiName})` : '';
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
        <!-- Dina Card -->
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

        <!-- Pasaran Card -->
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

        <!-- Sasi Jawa Card (Full Width) -->
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

function renderPekerjaanPakartiCardHtml(pekerjaanRes) {
  if (!pekerjaanRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
            Pakarti & Pakaryan Weton
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-briefcase text-prada"></i> Rekomendasi Pekerjaan & Pakarti Rejeki
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Weton: <strong class="text-prada-light">${pekerjaanRes.dino} ${pekerjaanRes.pasaran}</strong>
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <!-- Pakarti Rejeki & Badan -->
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

        <!-- Rekomendasi Pakaryan (Pekerjaan & Bisnis) -->
        <div class="p-3.5 bg-keraton/90 rounded-xl border border-prada/30 flex flex-col justify-between space-y-2">
          <div class="space-y-1.5">
            <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 tracking-wider">
              <i class="fa-solid fa-compass-drafting text-amber-400"></i> Rekomendasi Pakaryan (Bidang Usaha & Karier)
            </span>
            <p class="text-sogan-100 text-xs sm:text-sm leading-relaxed p-3 rounded-lg bg-sogan-950 border border-sogan-800 font-medium">
              ${pekerjaanRes.pakaryan}
            </p>
          </div>
          <p class="text-[10px] text-sogan-400 italic">
            *Berdasarkan petungan Primbon Jawa Pakarti Dino & Pasaran untuk memaksimalkan potensi rezeki dan ketenangan batin.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSirikanAdhepOmahCardHtml(sirikanRes) {
  if (!sirikanRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-bold uppercase tracking-wider">
            Paugeran Griya & Weton
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-compass text-rose-400"></i> Sirikan Adhep Omah (Pantangan Arah Hadap Rumah)
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Neptu ${sirikanRes.neptu} · Dina ${sirikanRes.dino}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <!-- Sirikan Neptu Weton -->
        <div class="p-3.5 bg-keraton/90 rounded-xl border border-rose-900/40 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-rose-300 tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-ban text-rose-400"></i> Sirikan Adhedhasar Neptu
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-rose-500/40 text-[10px] text-rose-300 font-mono">
                Neptu ${sirikanRes.neptu}
              </span>
            </div>
            <p class="text-sogan-300 text-[11px]">Pantangan arah hadap bangunan / lawang ngarep omah:</p>
          </div>
          <div class="p-3 bg-rose-950/40 rounded-lg border border-rose-800/60 text-center">
            <span class="text-[10px] uppercase font-semibold text-rose-300/80 block">Arah Sirikan Neptu:</span>
            <span class="font-marcellus text-lg sm:text-xl font-bold text-rose-300 tracking-wide">${sirikanRes.sirikanNeptu}</span>
          </div>
          <p class="text-[10px] text-sogan-400 italic">
            *Berdasarkan rumus petungan Neptu Weton (${sirikanRes.neptu}) dari Serat Primbon Griya Jawa.
          </p>
        </div>

        <!-- Sirikan Dina (Hari Lahir) -->
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
          <i class="fa-solid fa-circle-info text-prada"></i> Paugeran & Nasehat Griya
        </span>
        <p class="text-sogan-200 text-[11px] leading-relaxed">
          ${sirikanRes.catatan} Apabila kondisi lahan mengharuskan rumah menghadap ke arah sirikan, masyarakat Jawa biasanya menyiasati dengan memiringkan arah pintu utama (lawang kori) atau membuat akses jalan masuk samping agar sirkulasi hawa tidak berhadapan langsung dengan arah pantangan.
        </p>
      </div>
    </div>
  `;
}

const LIST_20_AKSARA_CARAKAN = [
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

function buildAksaraSelectOptions(selectedKode) {
  const current = (selectedKode || 'HA').toUpperCase();
  const list = (typeof LIST_AKSARA_CARAKAN !== 'undefined') ? LIST_AKSARA_CARAKAN : (typeof window !== 'undefined' && window.LIST_AKSARA_CARAKAN ? window.LIST_AKSARA_CARAKAN : LIST_20_AKSARA_CARAKAN);
  return list.map(item => {
    const isSel = item.kode === current ? 'selected' : '';
    return `<option value="${item.kode}" ${isSel}>${item.kode} (${item.neptu})</option>`;
  }).join('');
}

function updatePalenggahanInteractive(type) {
  const prefix = (type === 'kerja') ? 'pal_kerja_' : 'pal_tinggal_';
  const el1 = document.getElementById(prefix + 'depan_desa');
  const el2 = document.getElementById(prefix + 'belakang_desa');
  const el3 = document.getElementById(prefix + 'depan_orang');
  const el4 = document.getElementById(prefix + 'belakang_orang');
  if (!el1 || !el2 || !el3 || !el4) return;

  const lookupAksara = (typeof MASTER_AKSARA_FAAL !== 'undefined') ? MASTER_AKSARA_FAAL : (typeof window !== 'undefined' && window.MASTER_AKSARA_FAAL ? window.MASTER_AKSARA_FAAL : {});
  const lookupPal = (typeof MASTER_PALENGGAHAN !== 'undefined') ? MASTER_PALENGGAHAN : (typeof window !== 'undefined' && window.MASTER_PALENGGAHAN ? window.MASTER_PALENGGAHAN : {});

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
if (typeof window !== 'undefined') {
  window.updatePalenggahanInteractive = updatePalenggahanInteractive;
}

function renderPalenggahanPedamelanCardHtml(palenggahanRes, pedamelanRes) {
  if (!palenggahanRes && !pedamelanRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
            Analisis Aksara Carakan & Tempat
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-location-dot text-emerald-400"></i> Palenggahan & Pedamelan (Analisis Tempat Tinggal & Kerja)
          </h4>
        </div>
        <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
          Metode Neptu Aksara Carakan 4 Huruf (Siklus 5)
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        <!-- Palenggahan (Tempat Tinggal) -->
        <div class="p-4 bg-keraton/90 rounded-xl border border-sogan-800 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[10px] uppercase font-bold text-prada tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-house-chimney text-amber-400"></i> Palenggahan (Tempat Tinggal)
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-prada/40 text-[10px] font-bold text-prada font-mono">
                ${palenggahanRes?.namaTempat && palenggahanRes.namaTempat !== '-' ? palenggahanRes.namaTempat : 'Belum diisi'}
              </span>
            </div>

            ${palenggahanRes && palenggahanRes.namaTempat !== '-' ? `
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[10px] text-sogan-400 px-0.5">
                <span class="font-medium flex items-center gap-1"><i class="fa-solid fa-pen-to-square text-prada/70"></i> Aksara Carakan 4 Huruf:</span>
                <span class="italic text-[9px] text-sogan-400">*Bisa diedit manual</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center bg-sogan-950/80 p-2 rounded-lg border border-sogan-800 text-[10px]">
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Depan Kelurahan (${palenggahanRes.firstCharTempat})</span>
                  <select id="pal_tinggal_depan_desa" onchange="updatePalenggahanInteractive('tinggal')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(palenggahanRes.aksaraFirstTempat)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Belakang Kelurahan (${palenggahanRes.lastCharTempat})</span>
                  <select id="pal_tinggal_belakang_desa" onchange="updatePalenggahanInteractive('tinggal')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(palenggahanRes.aksaraLastTempat)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Depan Orang (${palenggahanRes.firstCharOrang})</span>
                  <select id="pal_tinggal_depan_orang" onchange="updatePalenggahanInteractive('tinggal')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(palenggahanRes.aksaraFirstOrang)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Belakang Orang (${palenggahanRes.lastCharOrang})</span>
                  <select id="pal_tinggal_belakang_orang" onchange="updatePalenggahanInteractive('tinggal')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(palenggahanRes.aksaraLastOrang)}
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded bg-sogan-950 border border-sogan-800">
                <span id="pal_tinggal_formula" class="text-sogan-300">Total: <strong>${palenggahanRes.neptuFirstTempat} + ${palenggahanRes.neptuLastTempat} + ${palenggahanRes.neptuFirstOrang} + ${palenggahanRes.neptuLastOrang} = ${palenggahanRes.totalNeptu}</strong></span>
                <span id="pal_tinggal_modulo" class="text-prada font-mono font-bold">Modulo 5 &rarr; Sisa ${palenggahanRes.noPalenggahan}</span>
              </div>

              <div id="pal_tinggal_surasa_card" class="p-3 rounded-lg ${palenggahanRes.noPalenggahan >= 3 ? 'bg-emerald-950/30 border border-emerald-800/60' : 'bg-amber-950/30 border border-amber-800/60'} space-y-1 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <span id="pal_tinggal_surasa_title" class="text-[10px] uppercase font-bold ${palenggahanRes.noPalenggahan >= 3 ? 'text-emerald-300' : 'text-amber-300'}">
                    Surasa #${palenggahanRes.noPalenggahan}: ${palenggahanRes.palenggahan.surasa}
                  </span>
                  <span id="pal_tinggal_surasa_badge" class="px-2 py-0.5 rounded text-[9px] font-bold ${palenggahanRes.noPalenggahan >= 3 ? 'bg-emerald-900/50 text-emerald-200' : 'bg-amber-900/50 text-amber-200'}">
                    ${palenggahanRes.noPalenggahan >= 3 ? 'Kajen Kelingan' : 'Prihatin'}
                  </span>
                </div>
                <p id="pal_tinggal_surasa_desc" class="text-sogan-100 text-xs font-medium leading-relaxed">${palenggahanRes.palenggahan.tegese}</p>
              </div>
            </div>
            ` : `
            <div class="text-center py-6 text-sogan-400 text-xs">
              Isi Alamat Tinggal pada formulir untuk melihat analisis Palenggahan.
            </div>
            `}
          </div>
        </div>

        <!-- Pedamelan (Tempat Kerja) -->
        <div class="p-4 bg-keraton/90 rounded-xl border border-sogan-800 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between border-b border-sogan-800 pb-2">
              <span class="text-[10px] uppercase font-bold text-prada tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-briefcase text-blue-400"></i> Pedamelan (Tempat Kerja)
              </span>
              <span class="px-2 py-0.5 rounded bg-sogan-950 border border-prada/40 text-[10px] font-bold text-prada font-mono">
                ${pedamelanRes?.namaTempat && pedamelanRes.namaTempat !== '-' ? pedamelanRes.namaTempat : 'Belum diisi'}
              </span>
            </div>

            ${pedamelanRes && pedamelanRes.namaTempat !== '-' ? `
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[10px] text-sogan-400 px-0.5">
                <span class="font-medium flex items-center gap-1"><i class="fa-solid fa-pen-to-square text-prada/70"></i> Aksara Carakan 4 Huruf:</span>
                <span class="italic text-[9px] text-sogan-400">*Bisa diedit manual</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center bg-sogan-950/80 p-2 rounded-lg border border-sogan-800 text-[10px]">
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Depan Kelurahan (${pedamelanRes.firstCharTempat})</span>
                  <select id="pal_kerja_depan_desa" onchange="updatePalenggahanInteractive('kerja')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(pedamelanRes.aksaraFirstTempat)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Belakang Kelurahan (${pedamelanRes.lastCharTempat})</span>
                  <select id="pal_kerja_belakang_desa" onchange="updatePalenggahanInteractive('kerja')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(pedamelanRes.aksaraLastTempat)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Depan Orang (${pedamelanRes.firstCharOrang})</span>
                  <select id="pal_kerja_depan_orang" onchange="updatePalenggahanInteractive('kerja')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(pedamelanRes.aksaraFirstOrang)}
                  </select>
                </div>
                <div class="p-1.5 rounded bg-keraton/80 border border-sogan-800 flex flex-col justify-between space-y-1">
                  <span class="text-[9px] text-sogan-400 block uppercase font-semibold">Belakang Orang (${pedamelanRes.lastCharOrang})</span>
                  <select id="pal_kerja_belakang_orang" onchange="updatePalenggahanInteractive('kerja')" class="aksara-interactive-select w-full bg-sogan-950 border border-sogan-700 hover:border-prada rounded px-1.5 py-1 text-prada font-bold text-[11px] outline-none focus:border-prada cursor-pointer transition">
                    ${buildAksaraSelectOptions(pedamelanRes.aksaraLastOrang)}
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded bg-sogan-950 border border-sogan-800">
                <span id="pal_kerja_formula" class="text-sogan-300">Total: <strong>${pedamelanRes.neptuFirstTempat} + ${pedamelanRes.neptuLastTempat} + ${pedamelanRes.neptuFirstOrang} + ${pedamelanRes.neptuLastOrang} = ${pedamelanRes.totalNeptu}</strong></span>
                <span id="pal_kerja_modulo" class="text-blue-300 font-mono font-bold">Modulo 5 &rarr; Sisa ${pedamelanRes.noPalenggahan}</span>
              </div>

              <div id="pal_kerja_surasa_card" class="p-3 rounded-lg ${pedamelanRes.noPalenggahan >= 3 ? 'bg-emerald-950/30 border border-emerald-800/60' : 'bg-amber-950/30 border border-amber-800/60'} space-y-1 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <span id="pal_kerja_surasa_title" class="text-[10px] uppercase font-bold ${pedamelanRes.noPalenggahan >= 3 ? 'text-emerald-300' : 'text-amber-300'}">
                    Surasa #${pedamelanRes.noPalenggahan}: ${pedamelanRes.palenggahan.surasa}
                  </span>
                  <span id="pal_kerja_surasa_badge" class="px-2 py-0.5 rounded text-[9px] font-bold ${pedamelanRes.noPalenggahan >= 3 ? 'bg-emerald-900/50 text-emerald-200' : 'bg-amber-900/50 text-amber-200'}">
                    ${pedamelanRes.noPalenggahan >= 3 ? 'Kajen Kelingan' : 'Prihatin'}
                  </span>
                </div>
                <p id="pal_kerja_surasa_desc" class="text-sogan-100 text-xs font-medium leading-relaxed">${pedamelanRes.palenggahan.tegese}</p>
              </div>
            </div>
            ` : `
            <div class="text-center py-6 text-sogan-400 text-xs">
              Isi Alamat Tempat Kerja pada formulir untuk melihat analisis Pedamelan.
            </div>
            `}
          </div>
        </div>
      </div>

      <div class="p-3 bg-sogan-950/70 rounded-xl border border-sogan-800 text-[11px] text-sogan-300 leading-relaxed">
        <span class="text-[10px] uppercase font-bold text-prada block mb-0.5">Penjelasan Siklus Palenggahan (1 s.d. 5):</span>
        1: <strong>SONYA</strong> (Rekasa/Prihatin) &middot; 2: <strong>AGOTHO</strong> (Rekasa/Prihatin) &middot; 3: <strong>GEDHONG</strong> (Kajen kelingan / Dihormati) &middot; 4: <strong>PANDHITA</strong> (Kajen kelingan / Mandita) &middot; 5: <strong>RATU</strong> (Kamulyan / Kawibawan Luhur).
      </div>
    </div>
  `;
}

window.renderKarakterDasarCardHtml = renderKarakterDasarCardHtml;
window.renderWatakDinaPasaranCardHtml = renderWatakDinaPasaranCardHtml;
window.renderSirikanAdhepOmahCardHtml = renderSirikanAdhepOmahCardHtml;
window.renderPalenggahanPedamelanCardHtml = renderPalenggahanPedamelanCardHtml;
window.renderPekerjaanPakartiCardHtml = renderPekerjaanPakartiCardHtml;

function renderPranataZodiakCardHtml(mangsaRes, zodiakRes) {
  if (!mangsaRes && !zodiakRes) return '';
  return `
    <div class="space-y-3 bg-wulung p-4 sm:p-5 rounded-2xl border border-prada/30 shadow-xl">
      <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
            Petungan Kosmologi & Musim
          </span>
          <h4 class="font-marcellus font-bold text-prada text-base sm:text-lg mt-1 flex items-center gap-2">
            <i class="fa-solid fa-cloud-sun text-cyan-400"></i> Pranata Mangsa & Zodiak Surya
          </h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] font-mono text-cyan-300/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">
            ${mangsaRes ? mangsaRes.nama : ''} &bull; ${zodiakRes ? zodiakRes.nama : ''}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <!-- Pranata Mangsa -->
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
              <span class="text-[10px] uppercase font-bold text-sogan-400 block mb-1">Candra & Watak Mangsa:</span>
              ${mangsaRes.watak}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Zodiak Surya -->
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

function renderLaporanResmiPetungPrintHtml(dObj) {
  const {
    nama, tglVal, d, m, y, tahunHitung, umur, dino, pas, neptu, info, wukuName, wukuNo,
    alamatTinggal, alamatKerja,
    pad, prk, pan, paa, pcs, kam,
    aseso, sirikanRes, palenggahanRes, pedamelanRes,
    faal, aksaraJawa, pwk,
    siklusTahunanRes, mangsaRes, zodiakRes,
    karakterRes, watakDinaRes, watakPasaranRes, pekerjaanRes,
    tglJawaRes, sasiJawaRes,
    shioLahirRes
  } = dObj;

  const fnShio = (typeof getShioByYear === 'function') ? getShioByYear : (window.getShioByYear || null);
  const shioLahir = shioLahirRes || (fnShio ? fnShio(y) : null);
  const tglJawa = tglJawaRes || ((typeof getTanggalJawaLengkap === 'function') ? getTanggalJawaLengkap(y, m, d) : null);
  const sasiJawa = sasiJawaRes || ((typeof getWatakSasiJawa === 'function' && tglJawa?.bulanJawa) ? getWatakSasiJawa(tglJawa.bulanJawa) : null);
  const tglFormatted = `${d} ${BULAN_MASEHI[m - 1] || ''} ${y}`;
  const isPalTinggalBecik = (palenggahanRes?.noPalenggahan || 0) >= 3;
  const isPalKerjaBecik = (pedamelanRes?.noPalenggahan || 0) >= 3;

  return `
    <div class="print-report-wrapper">
      <!-- Watermark Aether Code (Fixed, Translucent Behind Content) -->
      <div class="print-watermark print-doc-watermark watermark-print">Aether Code</div>

      <!-- ==================== HALAMAN 1 ==================== -->
      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- KOP DOKUMEN RESMI (HALAMAN 1) -->
        <div class="doc-header-kop mb-2 border-b-2 border-black pb-1.5">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-size: 14pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.15em;">JAGAD JAWA</div>
              <div style="font-size: 11pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 2px 0;">LAPORAN PETUNG NUJUM KEPRIBADIAN</div>
              <div style="font-size: 7.5pt; font-style: italic;">Transkripsi Petungan Pawukon, Bincil, Faalakiah, Palenggahan &amp; Karakter Masehi Karaton Surakarta - Ngayogyakarta</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 8pt; font-weight: bold;">ARSIP PENELITIAN</div>
              <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Archival</div>
            </div>
          </div>
        </div>

        <!-- BAGIAN 1: PERANGAN PETUNG & IDENTITAS -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 1: PERANGAN PETUNG &amp; IDENTITAS</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Subjek</td>
                <td style="width: 28%;"><strong>${nama.toUpperCase()}</strong></td>
                <td class="doc-label-cell">Tanggal Lahir (Masehi)</td>
                <td style="width: 28%;">${tglFormatted}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Weton (Dina &amp; Pasaran)</td>
                <td><strong>${dino} ${pas}</strong> (Neptu ${neptu})</td>
                <td class="doc-label-cell">Tanggal Jawa &amp; Sasi</td>
                <td><strong>${tglJawa?.shortStr || '-'}</strong> (${sasiJawa?.sasi && sasiJawa.sasi !== '-' ? sasiJawa.sasi + ' / ' + sasiJawa.padanan : (tglJawa?.namaWindu ? 'Windu ' + tglJawa.namaWindu : '-')})</td>
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
                <td colspan="3"><strong>Wuku ${pwk ? pwk.nama_wuku : wukuName} (${pwk ? pwk.no_wuku : wukuNo})</strong> &mdash; Dewane: <strong>${pwk ? pwk.dewane : '-'}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Budi Pangerti</td>
                <td colspan="3">${pwk ? pwk.watek_budi_pangerti : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Bilahi &amp; Bebaya (Pantangan)</td>
                <td colspan="3">${pwk ? pwk.bilahi_bebaya : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pangupaya Jiwa (Kiprah Usaha)</td>
                <td colspan="3">${pwk ? pwk.pangupaya_jiwa : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Potensi Lelaran &amp; Usada</td>
                <td colspan="3">
                  <strong>Potensi Lelaran:</strong> ${aseso?.lelara || '-'}<br/>
                  <strong>Tamba Yen Lara (Usada Wuku):</strong> <em>${pwk ? pwk.tamba_yen_lara : '-'}</em>
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Ruwatan &amp; Donga Slamet</td>
                <td colspan="3">
                  <strong>Donga:</strong> ${pwk ? pwk.donga_slamet : '-'} &middot; 
                  <strong>Sesaji:</strong> ${pwk ? pwk.sesaji_ruwat : '-'} &middot; 
                  <strong>Tindih:</strong> ${pwk ? pwk.tindih_ruwat : '-'}<br/>
                  <strong>Sega &amp; Iwak Selamatan:</strong> ${pwk ? pwk.selamatan_sega + ' & ' + pwk.selamatan_iwak : '-'} &middot; 
                  <strong>Salawat:</strong> ${pwk ? pwk.salawat : '-'}
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
                <td><strong>Bincil Paarasan</strong></td>
                <td>Siklus 10</td>
                <td>Sisa ${paa.sisa}: <strong>${paa.nama}</strong></td>
                <td>${paa.arti}</td>
              </tr>
              <tr>
                <td><strong>Bincil Pancasuda</strong></td>
                <td>Siklus 7</td>
                <td>Sisa ${pcs.sisa}: <strong>${pcs.nama}</strong></td>
                <td>${pcs.arti}</td>
              </tr>
              <tr>
                <td><strong>Bincil Kamarokan</strong></td>
                <td>Siklus 6</td>
                <td>Sisa ${kam.sisa}: <strong>${kam.nama}</strong></td>
                <td>${kam.arti}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE 1 FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 8mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>${nama.toUpperCase()} &middot; Dokumen Penelitian Petungan Jawa</span>
          <span>Halaman 1 dari 3 &middot; Aether Code Archival</span>
        </div>
      </div>

      <!-- ==================== HALAMAN 2 ==================== -->
      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- PAGE 2 RUNNING HEADER -->
        <div class="page-inner-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 0.5pt solid currentColor; padding-bottom: 1.5mm; margin-bottom: 3.5mm; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">
          <span>JAGAD JAWA</span>
          <span>LAPORAN PETUNG NUJUM KEPRIBADIAN &mdash; JAGAD JAWA</span>
          <span>AETHER CODE ARCHIVAL</span>
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
                <td style="width: 28%;"><strong>${mangsaRes ? mangsaRes.nama : '-'}</strong></td>
                <td class="doc-label-cell">Rentang Waktu</td>
                <td style="width: 28%;">${mangsaRes ? mangsaRes.rentang : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Candrasangkala</td>
                <td colspan="3"><em>&ldquo;${mangsaRes ? mangsaRes.candrasangkala : '-'}&rdquo;</em></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak &amp; Candra Mangsa</td>
                <td colspan="3">${mangsaRes ? mangsaRes.watak : '-'}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" style="text-align: left;">B. Zodiak Surya (Horoskop Falakiah Barat/Global)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="doc-label-cell">Nama Zodiak &amp; Elemen</td>
                <td style="width: 28%;"><strong>${zodiakRes ? zodiakRes.nama : '-'}</strong> (${zodiakRes ? zodiakRes.elemen : '-'})</td>
                <td class="doc-label-cell">Rentang Bintang</td>
                <td style="width: 28%;">${zodiakRes ? zodiakRes.rentang : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Dasar</td>
                <td colspan="3">${zodiakRes ? zodiakRes.watak : '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Peruntungan &amp; Resiko</td>
                <td colspan="3">
                  <strong>Peruntungan:</strong> ${zodiakRes ? zodiakRes.peruntungan : '-'} &nbsp;|&nbsp; 
                  <strong>Resiko:</strong> ${zodiakRes ? zodiakRes.resiko : '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Jodoh &amp; Karir Cocok</td>
                <td colspan="3">
                  <strong>Jodoh Serasi:</strong> ${zodiakRes ? zodiakRes.jodoh : '-'} &nbsp;|&nbsp; 
                  <strong>Rekomendasi Karir:</strong> ${zodiakRes ? zodiakRes.karir : '-'}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table mt-1">
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
                <td style="width: 28%;">${aseso.dino}</td>
                <td class="doc-label-cell">Watu Mulia (Batu Permata)</td>
                <td style="width: 28%;">${aseso.watu}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Warna Ageman (Pakaian)</td>
                <td>${aseso.warna}</td>
                <td class="doc-label-cell">Kembang Pengasihan</td>
                <td>${aseso.kembang}</td>
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
                  <strong>${karakterRes?.data ? 'Tipe #' + karakterRes.noKarakter + ': ' + (karakterRes.data.tipe || karakterRes.data.tipe_karakter) : '-'}</strong><br/>
                  <strong>Ringkasan Karakter:</strong> ${karakterRes?.data ? (karakterRes.data.ringkasan || karakterRes.data.deskripsi_karakter || '-') : '-'}<br/>
                  ${karakterRes?.data?.kekuatan ? `<strong>Kekuatan &amp; Potensi:</strong> ${karakterRes.data.kekuatan}<br/>` : ''}
                  ${karakterRes?.data?.kelemahan ? `<strong>Kelemahan &amp; Titik Kritis:</strong> ${karakterRes.data.kelemahan} &nbsp;|&nbsp; <strong>Kunci Pendekatan &amp; Negosiasi:</strong> ${karakterRes.data.negosiasi || '-'}<br/>` : ''}
                  ${karakterRes?.data?.sikap ? `<strong>Sikap yang Harus Dibangun:</strong> ${karakterRes.data.sikap} &nbsp;|&nbsp; <strong>Motto Bawah Sadar:</strong> <em>&ldquo;${karakterRes.data.motto || '-'}&rdquo;</em><br/>` : ''}
                  <strong>Profesi Cocok:</strong> ${karakterRes?.data ? (karakterRes.data.profesi || karakterRes.data.rekomendasi_profesi || '-') : '-'}
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
              <tr>
                <td class="doc-label-cell">Watak Sasi Jawa (${sasiJawa?.sasi || '-'})</td>
                <td colspan="3">
                  <strong>Sasi Jawa &amp; Padanan:</strong> ${sasiJawa?.sasi || '-'} (${sasiJawa?.padanan || '-'})<br/>
                  <strong>Watak Karakteristik Sasi:</strong> ${sasiJawa?.watak || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pakarti Rejeki &amp; Usaha</td>
                <td colspan="3">
                  <strong>Pakarti Rejeki (${pekerjaanRes?.pakarti_rejeki || '-'}):</strong> ${pekerjaanRes?.arti_rejeki || '-'}<br/>
                  <strong>Pakarti Badan (${pekerjaanRes?.pakarti_badan || '-'}):</strong> ${pekerjaanRes?.arti_badan && pekerjaanRes?.arti_badan !== '-' ? pekerjaanRes.arti_badan : (pekerjaanRes?.pakarti_badan || '-')}<br/>
                  <strong>Rekomendasi Pakaryan:</strong> ${pekerjaanRes?.pakaryan || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE 2 FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 8mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>${nama.toUpperCase()} &middot; Dokumen Penelitian Petungan Jawa</span>
          <span>Halaman 2 dari 3 &middot; Aether Code Archival</span>
        </div>
      </div>

      <!-- ==================== HALAMAN 3 ==================== -->
      <div class="laporan-page">
        <span class="corner-tr" aria-hidden="true">❖</span>
        <span class="corner-bl" aria-hidden="true">❖</span>

        <!-- PAGE 3 RUNNING HEADER -->
        <div class="page-inner-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 0.5pt solid currentColor; padding-bottom: 1.5mm; margin-bottom: 3.5mm; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">
          <span>JAGAD JAWA</span>
          <span>LAPORAN PETUNG NUJUM KEPRIBADIAN &mdash; JAGAD JAWA</span>
          <span>AETHER CODE ARCHIVAL</span>
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
                  <strong>Arah Pantangan:</strong> ${sirikanRes?.pantanganText || sirikanRes?.pantanganCombined?.join(' & ') || '-'} &nbsp;|&nbsp; 
                  <strong>Arah Utama Aman / Dianjurkan:</strong> ${sirikanRes?.arahAmanText || sirikanRes?.arahAman?.join(' & ') || '-'}
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
                  <strong>Aksara:</strong> Depan Kelurahan: ${palenggahanRes?.aksaraFirstTempat || '-'} (${palenggahanRes?.neptuFirstTempat || 0}), Belakang Kelurahan: ${palenggahanRes?.aksaraLastTempat || '-'} (${palenggahanRes?.neptuLastTempat || 0}), Depan Subjek: ${palenggahanRes?.aksaraFirstOrang || '-'} (${palenggahanRes?.neptuFirstOrang || 0}), Belakang Subjek: ${palenggahanRes?.aksaraLastOrang || '-'} (${palenggahanRes?.neptuLastOrang || 0})<br/>
                  <strong>Perhitungan:</strong> <span id="doc_pal_tinggal_formula">Total ${palenggahanRes?.totalNeptu || 0} % 5 = Sisa ${palenggahanRes?.noPalenggahan || 0}</span> &nbsp;|&nbsp; 
                  <strong>Surasa:</strong> <span id="doc_pal_tinggal_surasa"><strong>${palenggahanRes?.palenggahan?.surasa || '-'}</strong> (${isPalTinggalBecik ? 'Kajen Kelingan / Becik' : 'Prihatin / Rekasa'})</span><br/>
                  <strong>Makna:</strong> <span id="doc_pal_tinggal_desc">${palenggahanRes?.palenggahan?.tegese || '-'}</span>
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Pedamelan (Kerja)</td>
                <td colspan="3">
                  <strong>Alamat:</strong> ${pedamelanRes?.namaTempat || alamatKerja}<br/>
                  <strong>Aksara:</strong> Depan Kelurahan: ${pedamelanRes?.aksaraFirstTempat || '-'} (${pedamelanRes?.neptuFirstTempat || 0}), Belakang Kelurahan: ${pedamelanRes?.aksaraLastTempat || '-'} (${pedamelanRes?.neptuLastTempat || 0}), Depan Subjek: ${pedamelanRes?.aksaraFirstOrang || '-'} (${pedamelanRes?.neptuFirstOrang || 0}), Belakang Subjek: ${pedamelanRes?.aksaraLastOrang || '-'} (${pedamelanRes?.neptuLastOrang || 0})<br/>
                  <strong>Perhitungan:</strong> <span id="doc_pal_kerja_formula">Total ${pedamelanRes?.totalNeptu || 0} % 5 = Sisa ${pedamelanRes?.noPalenggahan || 0}</span> &nbsp;|&nbsp; 
                  <strong>Surasa:</strong> <span id="doc_pal_kerja_surasa"><strong>${pedamelanRes?.palenggahan?.surasa || '-'}</strong> (${isPalKerjaBecik ? 'Kajen Kelingan / Becik' : 'Prihatin / Rekasa'})</span><br/>
                  <strong>Makna:</strong> <span id="doc_pal_kerja_desc">${pedamelanRes?.palenggahan?.tegese || '-'}</span>
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
                <td style="width: 28%; font-family: 'Noto Sans Javanese', serif; font-size: 11pt;"><span id="doc_faal_aksara">${aksaraJawa || '-'}</span></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Nilai &amp; Sisa Kode</td>
                <td><span id="doc_faal_sum_kode">Jumlah: ${faal.sum} &rarr; Sisa (Kode): ${faal.kode}</span></td>
                <td class="doc-label-cell">Tokoh Perlindungan (Nabi)</td>
                <td><strong id="doc_faal_nabi">${faal.nabi}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Katerangan, Pitutur &amp; Dzikir</td>
                <td colspan="3"><span id="doc_faal_desc">${faal.desc}</span></td>
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
                <td style="width: 28%;"><span id="doc_siklus_usia">${umur} Tahun</span> (Tahun Hitung: ${tahunHitung} M)</td>
                <td class="doc-label-cell">Modulo 12</td>
                <td style="width: 28%;"><span id="doc_siklus_modulo">${umur} % 12 = Sisa ${siklusTahunanRes ? siklusTahunanRes.siklusNo : (umur % 12 === 0 ? 12 : umur % 12)} (Siklus Ke-${siklusTahunanRes ? siklusTahunanRes.siklusNo : '-'})</span></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Siklus Shio Tahunan</td>
                <td colspan="3" id="doc_siklus_shio">
                  <strong>Shio ${siklusTahunanRes?.shio?.shio || '-'}</strong>: ${siklusTahunanRes?.shio?.tegese || '-'}
                </td>
              </tr>

              <tr>
                <td class="doc-label-cell">Dewa Pelindung Siklus</td>
                <td colspan="3" id="doc_siklus_dewa"><strong>${siklusTahunanRes?.padewan?.dewa || '-'} (${siklusTahunanRes?.padewan?.nama || '-'})</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Watak Siklus Usia</td>
                <td colspan="3" id="doc_siklus_watak">${siklusTahunanRes?.padewan?.watak || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Karier &amp; Wiraswasta</td>
                <td colspan="3" id="doc_siklus_karier">${siklusTahunanRes?.padewan?.karier || '-'}</td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kelemahan &amp; Bahaya</td>
                <td colspan="3" id="doc_siklus_kelemahan">
                  <strong>Kelemahan:</strong> ${siklusTahunanRes?.padewan?.kelemahan || '-'} &nbsp;|&nbsp; 
                  <strong>Bahaya:</strong> ${siklusTahunanRes?.padewan?.bahaya || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Kesehatan &amp; Rumah Tangga</td>
                <td colspan="3" id="doc_siklus_kesehatan">
                  <strong>Kesehatan:</strong> ${siklusTahunanRes?.padewan?.kesehatan || '-'} &nbsp;|&nbsp; 
                  <strong>Rumah Tangga:</strong> ${siklusTahunanRes?.padewan?.keluarga || '-'}
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Ikhtiar &amp; Solusi</td>
                <td colspan="3"><em id="doc_siklus_solusi">${siklusTahunanRes?.padewan?.solusi || '-'}</em></td>
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
                  <p style="margin: 1px 0 0 0; font-size: 7pt; font-family: monospace;">Aether Code Certified</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE 3 FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 8mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>${nama.toUpperCase()} &middot; Dokumen Penelitian Petungan Jawa</span>
          <span>Halaman 3 dari 3 &middot; Aether Code Archival</span>
        </div>
      </div>
    </div>
  `;
}

window.renderPranataZodiakCardHtml = renderPranataZodiakCardHtml;
window.renderLaporanResmiPetungPrintHtml = renderLaporanResmiPetungPrintHtml;

window.hitungKepribadianLengkap = function hitungKepribadianLengkap() {
  const tglVal = document.getElementById('tglLahirKepribadian').value;
  if (!tglVal) { showToast('Pilih tanggal lahir terlebih dahulu.'); return; }

  const nama = document.getElementById('namaKepribadian').value.trim() || '-';
  const tahunHitung = parseInt(document.getElementById('tahunHitungKepribadian').value) || 2026;
  const alamatTinggal = document.getElementById('alamatTinggal').value.trim() || '-';
  const alamatKerja = document.getElementById('alamatKerja').value.trim() || '-';
  const [y, m, d] = tglVal.split('-').map(Number);
  const info = getDayInfo(y, m, d);
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuNo = info.wukuId + 1;
  const wukuName = WUKU[info.wukuId];
  const umur = Math.max(0, tahunHitung - y);
  const siklusTahunanFn = (typeof hitungSiklusTahunan === 'function') ? hitungSiklusTahunan : (window.hitungSiklusTahunan || null);
  const siklusTahunanRes = siklusTahunanFn ? siklusTahunanFn(umur) : null;
  const siklusCardHtml = renderSiklusTahunanCardHtml(umur, umur);

  const fnShioByYear = (typeof getShioByYear === 'function') ? getShioByYear : (window.getShioByYear || null);
  const shioLahirRes = fnShioByYear ? fnShioByYear(y) : null;
  const shioElemenCardHtml = renderShioElemenCardHtml(shioLahirRes);

  const fnZodiak = (typeof getZodiakByDate === 'function') ? getZodiakByDate : (window.getZodiakByDate || null);
  const zodiakRes = fnZodiak ? fnZodiak(d, m) : null;
  const fnMangsa = (typeof getPranataMangsaByDate === 'function') ? getPranataMangsaByDate : (window.getPranataMangsaByDate || null);
  const mangsaRes = fnMangsa ? fnMangsa(d, m) : null;
  const pranataZodiakCardHtml = renderPranataZodiakCardHtml(mangsaRes, zodiakRes);

  const fnKarakter = (typeof hitungKarakterDasar === 'function') ? hitungKarakterDasar : (window.hitungKarakterDasar || null);
  const karakterRes = fnKarakter ? fnKarakter(d, m, y) : null;
  const karakterDasarCardHtml = renderKarakterDasarCardHtml(karakterRes);

  const fnWatakDina = (typeof getWatakDina === 'function') ? getWatakDina : (window.getWatakDina || null);
  const watakDinaRes = fnWatakDina ? fnWatakDina(dino) : null;

  const fnWatakPasaran = (typeof getWatakPasaran === 'function') ? getWatakPasaran : (window.getWatakPasaran || null);
  const watakPasaranRes = fnWatakPasaran ? fnWatakPasaran(pas) : null;

  const tglJawaRes = (typeof getTanggalJawaLengkap === 'function') ? getTanggalJawaLengkap(y, m, d) : null;
  const fnSasiJawa = (typeof getWatakSasiJawa === 'function') ? getWatakSasiJawa : (window.getWatakSasiJawa || null);
  const sasiJawaRes = fnSasiJawa ? fnSasiJawa(tglJawaRes?.bulanJawa) : null;

  const watakDinaPasaranCardHtml = renderWatakDinaPasaranCardHtml(watakDinaRes, watakPasaranRes, sasiJawaRes);

  const fnSirikan = (typeof getSirikanAdhepOmah === 'function') ? getSirikanAdhepOmah : (window.getSirikanAdhepOmah || null);
  const sirikanRes = fnSirikan ? fnSirikan(neptu, dino) : null;
  const sirikanCardHtml = renderSirikanAdhepOmahCardHtml(sirikanRes);

  const fnPalenggahan = (typeof analisisPalenggahan === 'function') ? analisisPalenggahan : (window.analisisPalenggahan || null);
  const palenggahanRes = fnPalenggahan ? fnPalenggahan(alamatTinggal, nama) : null;
  const pedamelanRes = fnPalenggahan ? fnPalenggahan(alamatKerja, nama) : null;
  const palenggahanCardHtml = renderPalenggahanPedamelanCardHtml(palenggahanRes, pedamelanRes);

  const fnPekerjaan = (typeof getPekerjaanPakarti === 'function') ? getPekerjaanPakarti : (window.getPekerjaanPakarti || null);
  const pekerjaanRes = fnPekerjaan ? fnPekerjaan(dino, pas) : null;
  const pekerjaanPakartiCardHtml = renderPekerjaanPakartiCardHtml(pekerjaanRes);

  const digitSum = [...String(y) + String(m) + String(d)].reduce((a, c) => a + (+c || 0), 0);
  const karakter = KARAKTER[digitSum % 9] || KARAKTER[0];
  const nujumRes = getNujumLengkap(info.wukuId, info.weekdayId, info.pasaranId);
  const pad = nujumRes.padewan;
  const prk = nujumRes.paringkelan;
  const pan = nujumRes.pandangon;
  const paa = nujumRes.paarasan;
  const pcs = nujumRes.pancasuda;
  const kam = nujumRes.kamarokan;
  const pwk = nujumRes.pawukon || (typeof getPawukonData === 'function' ? getPawukonData(wukuName) : null);

  const faal = getFaalakiah(nama);
  const fnTranslit = (typeof transliterateLatinToJawa === 'function') ? transliterateLatinToJawa : (typeof window !== 'undefined' ? window.transliterateLatinToJawa : null);
  const aksaraJawa = (fnTranslit && nama !== '-') ? fnTranslit(nama) : (faal.aksaraStr !== '-' ? faal.aksaraStr : '');
  const aseso = getAsesoris(m, d);

  const html = `
    <div class="screen-only-report print-kumudowati-frame space-y-6">
      <!-- KOP RESMI LAPORAN KERATON JAGAD JAWA (TAMPIL DI CETAK & LAYAR) -->
      <div class="print-header-kop border-b-2 border-prada/60 pb-3.5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full border-2 border-prada/70 flex items-center justify-center bg-sogan-950 text-prada text-2xl shadow-inner font-jawa flex-shrink-0">
            ꦗ
          </div>
          <div>
            <span class="text-[10px] font-mono tracking-widest text-prada uppercase block font-semibold">PAWIYATAN KASULTANAN · JAGAD JAWA</span>
            <h3 class="font-marcellus text-base sm:text-xl font-bold text-prada leading-tight">LAPORAN NUJUM KEPRIBADIAN & PETUNGAN JAWA</h3>
            <p class="text-[10px] text-sogan-400 hidden sm:block">Petungan Pawukon, Bincil, Palenggahan, Faalakiah & Paweling Karaton Surakarta - Ngayogyakarta</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="text-[9px] font-mono uppercase text-sogan-400 block">DOKUMEN NUJUM RESMI</span>
          <span class="text-[10px] font-mono text-prada font-bold">Aether Code Archival</span>
        </div>
      </div>

      <!-- METADATA PROFIL SUBJEK -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-wulung p-3.5 rounded-xl border border-sogan-800 print-card-avoid-break">
        <div><span class="text-sogan-400 block text-[10px] uppercase font-semibold">Nama Subjek:</span><strong class="text-prada-light font-marcellus text-sm">${nama.toUpperCase()}</strong></div>
        <div><span class="text-sogan-400 block text-[10px] uppercase font-semibold">Weton & Neptu:</span><strong class="text-sogan-100">${dino} ${pas} (${neptu})</strong></div>
        <div><span class="text-sogan-400 block text-[10px] uppercase font-semibold">Wuku & Umur:</span><strong class="text-sogan-100">${wukuName} (${wukuNo}) · ${umur} Thn</strong></div>
        <div><span class="text-sogan-400 block text-[10px] uppercase font-semibold">Tahun Hitung:</span><strong class="text-amber-300 font-bold">${tahunHitung} M</strong></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-sogan-950/70 p-2.5 rounded-xl border border-sogan-800 print-card-avoid-break">
        <div><span class="text-sogan-400 block text-[10px]">Palenggahan (Tinggal):</span><strong class="text-sogan-200">${alamatTinggal} <span id="metaPalenggahanSurasa" class="text-emerald-400 font-semibold font-mono">${palenggahanRes?.palenggahan?.surasa && palenggahanRes.palenggahan.surasa !== '-' ? `(${palenggahanRes.palenggahan.surasa})` : ''}</span></strong></div>
        <div><span class="text-sogan-400 block text-[10px]">Padamelan (Kerja):</span><strong class="text-sogan-200">${alamatKerja} <span id="metaPedamelanSurasa" class="text-blue-400 font-semibold font-mono">${pedamelanRes?.palenggahan?.surasa && pedamelanRes.palenggahan.surasa !== '-' ? `(${pedamelanRes.palenggahan.surasa})` : ''}</span></strong></div>
      </div>

      <!-- 2. ENSIKLOPEDIA PAWUKON -->
      ${pwk ? `
      <div class="space-y-3 bg-wulung p-4 rounded-xl border border-prada/30 print-card-avoid-break">
        <div class="flex flex-wrap items-center justify-between border-b border-sogan-700/80 pb-2.5 gap-2">
          <h4 class="font-marcellus font-bold text-prada text-sm sm:text-base flex items-center gap-2">
            <i class="fa-solid fa-book-open text-prada"></i> Pawukon Jawa: Wuku ${pwk.nama_wuku} (${pwk.no_wuku})
          </h4>
          <span class="text-[10px] font-mono text-prada/90 bg-sogan-950 px-2.5 py-1 rounded border border-sogan-700/80">Dewane: <strong class="text-prada-light">${pwk.dewane}</strong></span>
        </div>

        <div class="space-y-2.5 text-xs">
          <div class="p-3 bg-keraton/90 rounded-lg border border-sogan-800">
            <span class="text-[10px] text-sogan-400 uppercase font-semibold block mb-1"><i class="fa-solid fa-user-astronaut text-prada/80 mr-1"></i> Watak</span>
            <p class="text-sogan-200 leading-relaxed text-[11px] sm:text-xs">${pwk.watek_budi_pangerti}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="p-3 bg-keraton/90 rounded-lg border border-amber-900/40">
              <span class="text-[10px] text-amber-300 uppercase font-semibold block mb-1"><i class="fa-solid fa-triangle-exclamation mr-1 text-amber-400"></i> Bilahi &amp; Bebaya (Pantangan)</span>
              <p class="text-sogan-200 leading-relaxed text-[11px]">${pwk.bilahi_bebaya}</p>
            </div>

            <div class="p-3 bg-keraton/90 rounded-lg border border-emerald-900/40 space-y-2">
              <div>
                <span class="text-[10px] text-emerald-300 uppercase font-semibold block mb-0.5"><i class="fa-solid fa-briefcase mr-1 text-emerald-400"></i> Pangupaya Jiwa (Kiprah &amp; Pakaryan)</span>
                <p class="text-sogan-200 leading-relaxed text-[11px] font-medium">${pwk.pangupaya_jiwa}</p>
              </div>
              <div class="pt-2 border-t border-sogan-800/80">
                <span class="text-[10px] text-teal-300 uppercase font-semibold block mb-0.5"><i class="fa-solid fa-mortar-pestle mr-1 text-teal-400"></i> Tamba Yen Lara (Jamu/Usada)</span>
                <p class="text-sogan-200 leading-relaxed text-[11px] italic">${pwk.tamba_yen_lara}</p>
              </div>
            </div>
          </div>

          <div class="p-3 bg-sogan-950 rounded-lg border border-sogan-700/70 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-sogan-800/80 pb-1.5">
              <span class="text-[10px] text-prada uppercase font-semibold flex items-center gap-1.5"><i class="fa-solid fa-hands-praying"></i> Donga Slamet &amp; Ruwatan</span>
              <span class="text-[11px] font-marcellus font-bold text-prada-light">Donga: ${pwk.donga_slamet}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[10px] text-sogan-300">
              <div><span class="text-sogan-400 block font-medium">Sesaji Ruwat:</span><span class="text-sogan-200">${pwk.sesaji_ruwat}</span></div>
              <div><span class="text-sogan-400 block font-medium">Tindih Ruwat:</span><span class="text-sogan-200">${pwk.tindih_ruwat}</span></div>
              <div><span class="text-sogan-400 block font-medium">Sega Selamatan:</span><span class="text-sogan-200">${pwk.selamatan_sega}</span></div>
              <div><span class="text-sogan-400 block font-medium">Iwak Selamatan:</span><span class="text-sogan-200">${pwk.selamatan_iwak}</span></div>
              <div><span class="text-sogan-400 block font-medium">Salawat:</span><span class="text-sogan-200">${pwk.salawat}</span></div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- 3. BINCIL & PETUNGAN 6 DIMENSI -->
      <div class="space-y-2 print-card-avoid-break">
        <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-1.5"><i class="fa-solid fa-compass"></i> Bincil &amp; Petungan 6 Dimensi Jawa</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Padewan (Siklus 8)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Dewa ${pad.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${pad.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${pad.arti}</p>
          </div>
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Paringkelan (Siklus 6)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Ringkel ${prk.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${prk.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${prk.arti}</p>
          </div>
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Pandangon (Siklus 9)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Dina ${pan.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${pan.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${pan.arti}</p>
          </div>
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Bincil Paarasan (Siklus 10)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Sisa ${paa.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${paa.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${paa.arti}</p>
          </div>
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Bincil Pancasuda (Siklus 7)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Sisa ${pcs.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${pcs.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${pcs.arti}</p>
          </div>
          <div class="p-2.5 bg-wulung rounded-lg border border-sogan-800 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-sogan-400 uppercase font-semibold">Bincil Kamarokan (Siklus 6)</span>
                <span class="text-[9px] font-mono text-prada/90 bg-sogan-950 px-1.5 py-0.5 rounded border border-sogan-700/60">Sisa ${kam.sisa}</span>
              </div>
              <div class="font-bold text-prada text-sm">${kam.nama}</div>
            </div>
            <p class="text-[10px] text-sogan-300 mt-1.5 leading-relaxed">${kam.arti}</p>
          </div>
        </div>
      </div>

      <!-- 4. PRANATA MANGSA & ZODIAK SURYA -->
      ${pranataZodiakCardHtml}
      ${shioElemenCardHtml}

      <!-- 5. ASESORIS & AGEMAN -->
      <div class="space-y-2 print-card-avoid-break">
        <h4 class="font-marcellus font-bold text-prada text-sm flex items-center gap-1.5"><i class="fa-solid fa-gem"></i> Asesoris &amp; Ageman</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-wulung p-3 rounded-xl border border-sogan-800">
          <div><span class="text-sogan-400 block">Watu Mulia:</span><strong class="text-prada-light">${aseso.watu}</strong></div>
          <div><span class="text-sogan-400 block">Warna Ageman:</span><strong>${aseso.warna}</strong></div>
          <div><span class="text-sogan-400 block">Kembang:</span><strong>${aseso.kembang}</strong></div>
          <div><span class="text-sogan-400 block">Dino Becik:</span><strong>${aseso.dino}</strong></div>
        </div>
      </div>

      <!-- 6. KARAKTER DASAR & WATAK LAHIR -->
      ${karakterDasarCardHtml}
      ${watakDinaPasaranCardHtml}
      ${pekerjaanPakartiCardHtml}

      <!-- 7. SIRIKAN ADHEP & KEDUDUKAN TEMPAT -->
      ${sirikanCardHtml}
      ${palenggahanCardHtml}

      <!-- 8. FAALAKIAH ASMA -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-sogan-950 border border-sogan-700 text-xs space-y-3 print-card-avoid-break">
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
            <button type="button" onclick="salinAksaraFaal()" class="px-2.5 py-1 rounded-lg bg-sogan-900 border border-sogan-700 hover:border-prada text-prada hover:bg-prada/20 text-[11px] font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer" title="Salin Aksara Jawa ke Clipboard">
              <i class="fa-regular fa-copy"></i> Salin Aksara
            </button>
          </div>
          <textarea id="faalAksaraJawaInput" oninput="updateFaalFromAksaraManual(this.value)" rows="2" placeholder="ꦲꦤꦕꦫꦏ..." class="w-full bg-keraton/90 border border-sogan-700 focus:border-prada rounded-xl p-3 text-prada font-jawa text-xl sm:text-2xl leading-relaxed tracking-wider outline-none resize-y min-h-[64px] transition shadow-inner">${aksaraJawa}</textarea>
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

      <!-- 9. SIKLUS TAHUNAN -->
      ${siklusCardHtml}

    <!-- FOOTER DOKUMEN CETAK KERATON -->
    <div class="print-footer text-center pt-4 border-t border-sogan-800 text-[10px] text-sogan-400">
      <p class="font-marcellus text-prada/90 tracking-wider font-semibold">JAGAD JAWA &middot; AETHER CODE ARCHIVAL</p>
      <p class="text-[9px] text-sogan-400 mt-0.5">Dokumen pitungan pawukon & nujum kepribadian adhedhasar serat Primbon & Pawukon Kasultanan Ngayogyakarta & Karaton Surakarta.</p>
    </div>
  </div>
  `;

  const printDocHtml = renderLaporanResmiPetungPrintHtml({
    nama, tglVal, d, m, y, tahunHitung, umur, dino, pas, neptu, info, wukuName, wukuNo,
    alamatTinggal, alamatKerja,
    pad, prk, pan, paa, pcs, kam,
    aseso, sirikanRes, palenggahanRes, pedamelanRes,
    faal, aksaraJawa, pwk,
    siklusTahunanRes, mangsaRes, zodiakRes,
    karakterRes, watakDinaRes, watakPasaranRes, pekerjaanRes,
    tglJawaRes, sasiJawaRes,
    shioLahirRes
  });

  document.getElementById('hasilKepribadianBox').innerHTML = html;

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  if (document.getElementById('btnPrintKepribadian')) {
    document.getElementById('btnPrintKepribadian').style.display = 'inline-flex';
  }
  if (document.getElementById('btnPrintKepribadianParchment')) {
    document.getElementById('btnPrintKepribadianParchment').style.display = 'inline-flex';
  }
  showToast('Nujum kepribadian kasil kapetung!');
}
window.hitungKepribadianLengkap = (typeof hitungKepribadianLengkap === 'function') ? hitungKepribadianLengkap : window.hitungKepribadianLengkap;

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
  if (!tgl) {
    document.getElementById('neptu' + side + 'Badge').innerText = '-';
    return;
  }
  const [y, m, d] = tgl.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;
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
  if (hIdx >= 0 && pIdx >= 0) {
    const n = NEPTU_HARI[hIdx] + NEPTU_PASARAN[pIdx];
    document.getElementById('neptu' + side + 'Badge').innerText = n;
  } else {
    document.getElementById('neptu' + side + 'Badge').innerText = '-';
  }
};

window.hitungNujumPerjodohan = function () {
  const neptuPText = document.getElementById('neptuPBadge').innerText;
  const neptuLText = document.getElementById('neptuLBadge').innerText;
  const neptuP = parseInt(neptuPText);
  const neptuL = parseInt(neptuLText);

  if (!neptuP || !neptuL || isNaN(neptuP) || isNaN(neptuL)) {
    showToast('Pilih tanggal lahir atau tentukan weton kedua calon pengantin terlebih dahulu.');
    return;
  }

  const hariP = document.getElementById('hariP').value;
  const hariL = document.getElementById('hariL').value;
  const namaP = document.getElementById('namaP').value.trim() || 'Calon Pengantin Wanita';
  const namaL = document.getElementById('namaL').value.trim() || 'Calon Pengantin Pria';

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

    tbody += `<tr class="border-b border-sogan-800/80 hover:bg-sogan-900/30">
      <td class="p-3 font-bold text-prada">${r.no}</td>
      <td class="p-3 font-marcellus font-bold text-sogan-100">${r.h.nama}</td>
      <td class="p-3 text-sogan-200">${r.h.arti} <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${r.rumus}</div></td>
      <td class="p-3 text-center"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${badgeClass}">${badgeSymbol}</span></td>
    </tr>`;
  });

  // Simpan data perhitungan terakhir untuk cetak dan ekspor
  window.LAST_PERJODOHAN_DATA = {
    namaP, namaL, neptuP, neptuL, totalNeptu,
    hariP, hariL,
    akDP, akBP, akDL, akBL,
    rows, baik, campur, buruk
  };

  document.getElementById('hasilPerjodohanBody').innerHTML = tbody;
  document.getElementById('perjodohanPairInfo').innerHTML = `${namaP} (${neptuP}) · ${namaL} (${neptuL}) · Jumlah Neptu: <strong class="text-prada font-mono">${totalNeptu}</strong>`;
  document.getElementById('ringkasanPerjodohanBox').innerHTML = `
    <div class="font-bold text-prada text-sm">Ringkasan Kecocokan Pitung Jawa:</div>
    <p class="text-sogan-200">Dari 7 perhitungan metode primbon: <strong class="text-emerald-400">✓ ${baik} Baik</strong>, <strong class="text-amber-400">• ${campur} Campuran</strong>, dan <strong class="text-rose-400">⊗ ${buruk} Kurang Baik</strong>. Hubungan memiliki keharmonisan yang perlu dijaga dengan saling menghargai.</p>
  `;

  const emptyBox = document.getElementById('emptyPerjodohanBox');
  if (emptyBox) emptyBox.classList.add('hidden');
  document.getElementById('hasilPerjodohanCard').classList.remove('hidden');

  if (document.getElementById('btnPrintPerjodohan')) {
    document.getElementById('btnPrintPerjodohan').style.display = 'inline-block';
  }
  if (document.getElementById('btnPrintPerjodohanParchment')) {
    document.getElementById('btnPrintPerjodohanParchment').style.display = 'inline-flex';
  }
  if (document.getElementById('btnPrintPerjodohanMonochrome')) {
    document.getElementById('btnPrintPerjodohanMonochrome').style.display = 'inline-flex';
  }

  showToast('Pitung perjodohan kasil kapetung!');
};

function renderLaporanPerjodohanPrintHtml(data) {
  if (!data) return '';

  let rowsHtml = '';
  data.rows.forEach(r => {
    let badgeText = 'SEDANG';
    let badgeStyle = 'background-color: #fef3c7; color: #92400e; border: 0.5pt solid #f59e0b;';
    if (r.h.status === 'baik') {
      badgeText = 'BECIK / BAIK';
      badgeStyle = 'background-color: #d1fae5; color: #065f46; border: 0.5pt solid #10b981;';
    } else if (r.h.status === 'buruk') {
      badgeText = 'SAMBIKALA';
      badgeStyle = 'background-color: #ffe4e6; color: #9f1239; border: 0.5pt solid #f43f5e;';
    }

    rowsHtml += `
      <tr>
        <td style="text-align: center; font-weight: bold;">${r.no}</td>
        <td><strong>${r.rumus}</strong></td>
        <td><strong>${r.h.nama}</strong></td>
        <td style="line-height: 1.35;">${r.h.arti}</td>
        <td style="text-align: center;">
          <span style="display: inline-block; padding: 1.5px 5px; font-size: 6.5pt; font-weight: bold; border-radius: 3px; ${badgeStyle}">
            ${badgeText}
          </span>
        </td>
      </tr>
    `;
  });

  return `
    <div class="laporan-page">
      <span class="corner-tr">❖</span>
      <span class="corner-bl">❖</span>
      <div class="print-watermark">AETHER CODE</div>

      <div class="page-inner-wrap" style="min-height: 260mm; position: relative; padding-bottom: 12mm;">
        <!-- KOP DOKUMEN -->
        <div class="doc-header-kop">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2pt double currentColor; padding-bottom: 2.5mm; margin-bottom: 3.5mm;">
            <div>
              <div style="font-size: 13pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.15em;">JAGAD JAWA</div>
              <div style="font-size: 10.5pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 2px 0;">SERAT PETUNG SALAKI RABI (NUJUM PERJODOHAN)</div>
              <div style="font-size: 7.5pt; font-style: italic;">Pitung Primbon 7 Metode Karaton Surakarta Hadiningrat &amp; Kasultanan Ngayogyakarta</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 8pt; font-weight: bold;">ARSIP PETUNG</div>
              <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Archival</div>
            </div>
          </div>
        </div>

        <!-- BAGIAN 1: IDENTITAS & WETON CALON PENGANTIN -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 1: IDENTITAS &amp; WETON CALON PENGANTIN</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell" style="width: 22%;">Calon Pengantin Putri</td>
                <td style="width: 28%;"><strong>${data.namaP}</strong> (${data.hariP})</td>
                <td class="doc-label-cell" style="width: 22%;">Neptu Putri</td>
                <td style="width: 28%;"><strong>${data.neptuP}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Calon Pengantin Kakung</td>
                <td><strong>${data.namaL}</strong> (${data.hariL})</td>
                <td class="doc-label-cell">Neptu Kakung</td>
                <td><strong>${data.neptuL}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Gunggung Neptu (Total)</td>
                <td><strong style="font-size: 9pt;">${data.totalNeptu}</strong> (${data.neptuP} + ${data.neptuL})</td>
                <td class="doc-label-cell">Aksara Sandi Pasangan</td>
                <td>P: ${data.akDP || '-'}-${data.akBP || '-'} &middot; L: ${data.akDL || '-'}-${data.akBL || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 2: MATRIKS PETUNGAN KECOCOKAN 7 METODE PRIMBON -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 2: MATRIKS ANALISIS 7 METODE PITUNG JAWA</div>
          <table class="doc-table" style="font-size: 7.5pt;">
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">No</th>
                <th style="width: 23%;">Metode / Rumus Petung</th>
                <th style="width: 20%;">Asil Petungan</th>
                <th style="width: 37%;">Tafsiran / Makna Primbon Jawa</th>
                <th style="width: 15%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 3: RINGKASAN & WEJANGAN BUDI PEKERTI LUHUR -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 3: RINGKASAN &amp; WEJANGAN BUDI PEKERTI LUHUR</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell" style="width: 22%;">Ringkasan Analisis</td>
                <td colspan="3" style="line-height: 1.4;">
                  Saking 7 metode petungan primbon: <strong>${data.baik} Becik (Baik)</strong>, <strong>${data.campur} Sedang (Campuran)</strong>, lan <strong>${data.buruk} Sambikala (Kurang Baik)</strong>.
                </td>
              </tr>
              <tr>
                <td class="doc-label-cell">Piwulang &amp; Paugeran</td>
                <td colspan="3" style="font-size: 7.5pt; line-height: 1.4;">
                  Petungan Jawa minangka sarana ikhtiar lan tepa slira kangge ngudi kaselarasan lair lan batin. Wontene petungan ingkang kirang sae saged kasembadan kanthi tansah nyenyuwun donga marang Gusti Kang Murbeng Dumadi, mranata solah bawa, sabar narima, tresna-tinresnan, sarta nindakaken sedhekah wilujengan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 4mm; left: 0; right: 0; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>Petung Salaki Rabi &middot; Serat Centhini &amp; Primbon Betaljemur Adammakna</span>
          <span>Halaman 1 dari 1 &middot; Aether Code Archival</span>
        </div>
      </div>
    </div>
  `;
}

function printLaporanPerjodohan(theme = 'parchment') {
  if (!window.LAST_PERJODOHAN_DATA) {
    if (typeof showToast === 'function') showToast('Petung perjodohan dereng kalampahan.');
    return;
  }
  const printDocHtml = renderLaporanPerjodohanPrintHtml(window.LAST_PERJODOHAN_DATA);
  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const title = `Jagad Jawa — Petung Perjodohan ${window.LAST_PERJODOHAN_DATA.namaP} & ${window.LAST_PERJODOHAN_DATA.namaL}`;
  if (typeof printLaporan === 'function') {
    printLaporan(theme, title);
  } else if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, title);
  } else {
    window.print();
  }
}
window.renderLaporanPerjodohanPrintHtml = renderLaporanPerjodohanPrintHtml;
window.printLaporanPerjodohan = printLaporanPerjodohan;

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

  const items = [];

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
      const dateStr = `${bestDate.getUTCDate()} ${BULAN_MASEHI[bestDate.getUTCMonth()]} ${bestDate.getUTCFullYear()}`;
      tr.innerHTML = `
        <td class="p-2.5 font-bold text-sogan-100">${j.nama}<br><span class="text-[10px] text-sogan-400 font-normal">~${j.approx} dina</span></td>
        <td class="p-2.5 font-bold text-prada">${targetH} ${targetP}</td>
        <td class="p-2.5 text-sogan-200">${dateStr}<br><span class="text-[10px] text-sogan-400">wiwit jam 18.00 sore</span></td>
        <td class="p-2.5 text-emerald-400 font-mono text-[11px]">${diffDays} dina saking geblak</td>
      `;
      items.push({
        nama: j.nama,
        approx: j.approx,
        targetH,
        targetP,
        bestDate,
        dateStr,
        diffDays
      });
    }
    tbody.appendChild(tr);
  });

  // Simpan data perhitungan terakhir untuk cetak dan ekspor
  window.LAST_SELAMETAN_DATA = {
    death,
    hariWafat,
    pasaranWafat,
    dd,
    mm,
    yy,
    items
  };

  if (document.getElementById('btnPrintSelametan')) {
    document.getElementById('btnPrintSelametan').style.display = 'inline-block';
  }
  if (document.getElementById('btnPrintSelametanParchment')) {
    document.getElementById('btnPrintSelametanParchment').style.display = 'inline-flex';
  }
  if (document.getElementById('btnPrintSelametanMonochrome')) {
    document.getElementById('btnPrintSelametanMonochrome').style.display = 'inline-flex';
  }
  if (document.getElementById('btnDownloadSelametanPng')) {
    document.getElementById('btnDownloadSelametanPng').style.display = 'inline-flex';
  }

  showToast('Selametan kasil kapetung!');
};

function renderLaporanSelametanPrintHtml(data) {
  if (!data) return '';

  let itemsHtml = '';
  data.items.forEach(it => {
    itemsHtml += `
      <tr>
        <td style="font-weight: bold; width: 25%;">
          ${it.nama}<br>
          <span style="font-size: 6.5pt; font-weight: normal; opacity: 0.8;">~${it.approx} dina</span>
        </td>
        <td style="text-align: center; font-weight: bold; width: 22%;">${it.targetH} ${it.targetP}</td>
        <td style="width: 33%; line-height: 1.35;">
          ${it.dateStr}<br>
          <span style="font-size: 6.5pt; opacity: 0.8;">wiwit jam 18.00 sore (surup)</span>
        </td>
        <td style="text-align: center; font-family: monospace; font-size: 7pt; width: 20%;">${it.diffDays} dina</td>
      </tr>
    `;
  });

  return `
    <div class="laporan-page">
      <span class="corner-tr">❖</span>
      <span class="corner-bl">❖</span>
      <div class="print-watermark">AETHER CODE</div>

      <div class="page-inner-wrap" style="min-height: 260mm; position: relative; padding-bottom: 12mm;">
        <!-- KOP DOKUMEN -->
        <div class="doc-header-kop">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2pt double currentColor; padding-bottom: 2.5mm; margin-bottom: 3.5mm;">
            <div>
              <div style="font-size: 13pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.15em;">JAGAD JAWA</div>
              <div style="font-size: 10.5pt; font-weight: bold; font-family: 'Times New Roman', serif; text-transform: uppercase; margin: 2px 0;">SERAT PENGETAN TILAR DONYO (SELAMETAN)</div>
              <div style="font-size: 7.5pt; font-style: italic;">Paugeran Wilujengan Surut Karaton Surakarta Hadiningrat &amp; Kasultanan Ngayogyakarta</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 8pt; font-weight: bold;">ARSIP SELAMETAN</div>
              <div style="font-size: 7.5pt; font-family: monospace;">Aether Code Archival</div>
            </div>
          </div>
        </div>

        <!-- BAGIAN 1: RINCIAN GEBLAK / SURUT -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 1: DINA WAFAT / GEBLAK</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell" style="width: 22%;">Dina &amp; Pasaran Wafat</td>
                <td style="width: 28%;"><strong style="font-size: 9pt;">${data.hariWafat} ${data.pasaranWafat}</strong></td>
                <td class="doc-label-cell" style="width: 22%;">Tanggal Masehi</td>
                <td style="width: 28%;"><strong>${data.dd} ${BULAN_MASEHI[data.mm - 1]} ${data.yy}</strong></td>
              </tr>
              <tr>
                <td class="doc-label-cell">Paugeran Gantos Dina</td>
                <td colspan="3" style="font-size: 7.5pt; line-height: 1.4;">
                  Wiwitan dinten Jawa katetepaken nalika <strong>surup srengenge (jam 18.00 WIB)</strong>. Menawi seda sasampunipun jam 18.00, dipunétang dinten candhakipun. Upacara pengetan wilujengan katindakaken ing wanci dalu sedalu sadurunge utawi pas surup dina kasebat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 2: JADWAL PENGETAN DINA SELAMETAN -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 2: JADWAL TINGKATAN PENGETAN WILUJENGAN DINA</div>
          <table class="doc-table" style="font-size: 7.5pt;">
            <thead>
              <tr>
                <th style="width: 25%;">Tingkatan Pengetan</th>
                <th style="width: 22%; text-align: center;">Dina &amp; Pasaran Jawa</th>
                <th style="width: 33%;">Tanggal Masehi &amp; Wanci</th>
                <th style="width: 20%; text-align: center;">Jarak saking Geblak</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- BAGIAN 3: MAKNA FILOSOFIS & TUNTUNAN DOA -->
        <div class="doc-section-block">
          <div class="doc-section-title">BAGIAN 3: MAKNA FILOSOFIS &amp; TUNTUNAN DOA</div>
          <table class="doc-table">
            <tbody>
              <tr>
                <td class="doc-label-cell" style="width: 22%;">Makna Tradisi</td>
                <td colspan="3" style="font-size: 7.5pt; line-height: 1.4;">
                  Pengetan wilujengan surut minangka wujud bekti luhur, kirim donga tahlil, sarta sedhekah saking para ahli waris supados arwah pinaringan jembar kubure, kaapunten sadaya kalepatanipun, lan pikantuk katentreman swarga ing ngarsanipun Gusti Ingkang Maha Kuwaos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGE FOOTER -->
        <div class="page-inner-footer" style="position: absolute; bottom: 4mm; left: 0; right: 0; display: flex; justify-content: space-between; font-size: 7.5pt; border-top: 0.5pt solid currentColor; padding-top: 1.5mm;">
          <span>Pengetan Tilar Donyo &middot; Tradisi Luhur Karaton &amp; Kasultanan Tanah Jawa</span>
          <span>Halaman 1 dari 1 &middot; Aether Code Archival</span>
        </div>
      </div>
    </div>
  `;
}

function printLaporanSelametan(theme = 'parchment') {
  if (!window.LAST_SELAMETAN_DATA) {
    if (typeof showToast === 'function') showToast('Petung selametan dereng kalampahan.');
    return;
  }
  const printDocHtml = renderLaporanSelametanPrintHtml(window.LAST_SELAMETAN_DATA);
  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printDocHtml;

  const title = `Jagad Jawa — Pengetan Tilar Donyo Geblak ${window.LAST_SELAMETAN_DATA.hariWafat} ${window.LAST_SELAMETAN_DATA.pasaranWafat}`;
  if (typeof printLaporan === 'function') {
    printLaporan(theme, title);
  } else if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, title);
  } else {
    window.print();
  }
}

function downloadKalenderPng() {
  const bulanSel = document.getElementById('bulanSel');
  const tahunInput = document.getElementById('tahunInput');
  const bulan = parseInt(bulanSel?.value || 1);
  const tahun = parseInt(tahunInput?.value || 2026);
  const namaBulan = (typeof BULAN_MASEHI !== 'undefined' && BULAN_MASEHI[bulan - 1]) ? BULAN_MASEHI[bulan - 1] : `Bulan-${bulan}`;
  const filename = `Kalender-Jawa-${namaBulan}-${tahun}.png`;
  if (typeof downloadElementAsPng === 'function') {
    downloadElementAsPng('kalenderCard', filename, '#f4ecd8');
  } else if (typeof window.downloadElementAsPng === 'function') {
    window.downloadElementAsPng('kalenderCard', filename, '#f4ecd8');
  }
}

function downloadSelametanPng() {
  const data = window.LAST_SELAMETAN_DATA;
  let filename = 'Pengetan-Tilar-Donyo.png';
  if (data) {
    filename = `Pengetan-Tilar-Donyo-Geblak-${data.hariWafat}-${data.pasaranWafat}.png`;
  }
  if (typeof downloadElementAsPng === 'function') {
    downloadElementAsPng('hasilSelametanCard', filename, '#0F141D');
  } else if (typeof window.downloadElementAsPng === 'function') {
    window.downloadElementAsPng('hasilSelametanCard', filename, '#0F141D');
  }
}

window.renderLaporanSelametanPrintHtml = renderLaporanSelametanPrintHtml;
window.printLaporanSelametan = printLaporanSelametan;
window.downloadKalenderPng = downloadKalenderPng;
window.downloadSelametanPng = downloadSelametanPng;

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

// ─── AKSARA (ENGINE STANDAR & VIRTUAL KEYBOARD) ───────────────────────────
window.convertLatinToJawa = function () {
  const inputEl = document.getElementById('latinInput');
  const outputEl = document.getElementById('jawaOutput');
  const countEl = document.getElementById('charCountLabel');
  if (!inputEl || !outputEl) return;

  const raw = inputEl.value;
  if (!raw.trim()) {
    outputEl.value = '';
    if (countEl) countEl.innerText = '0 Aksara';
    return;
  }

  const converted = transliterateLatinToJawa(raw);
  outputEl.value = converted;
  window.updateAksaraCharCount();
};

window.updateAksaraCharCount = function () {
  const outputEl = document.getElementById('jawaOutput');
  const countEl = document.getElementById('charCountLabel');
  if (outputEl && countEl) {
    const len = [...outputEl.value].length;
    countEl.innerText = `${len} Aksara`;
  }
};

window.setSampleAksara = (text) => {
  const inputEl = document.getElementById('latinInput');
  if (inputEl) {
    inputEl.value = text;
    window.convertLatinToJawa();
  }
};

window.clearAksaraInput = () => {
  const inputEl = document.getElementById('latinInput');
  if (inputEl) inputEl.value = '';
  window.convertLatinToJawa();
  showToast("Kolom teks Latin sampun dipun resiki.");
};

window.clearJawaText = () => {
  const outputEl = document.getElementById('jawaOutput');
  if (outputEl) outputEl.value = '';
  window.updateAksaraCharCount();
  showToast("Kolom Aksara Jawa kasil dipun resiki.");
};

window.copyJawaText = () => {
  const outputEl = document.getElementById('jawaOutput');
  const text = outputEl ? outputEl.value : '';
  if (!text) {
    showToast("Boten wonten aksara ingkang saged dipun salin.");
    return;
  }
  copyToClipboard(text, "Aksara Jawa kasil dipun salin!");
};

// Virtual Keyboard Logic
let currentAksaraKeyboardTab = 'nglegena';

window.switchAksaraKeyboardTab = function (tab) {
  currentAksaraKeyboardTab = tab;
  document.querySelectorAll('.vk-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tab) {
      btn.className = 'vk-tab-btn px-3 py-1 rounded-full border border-prada bg-prada/20 text-prada font-semibold transition';
    } else {
      btn.className = 'vk-tab-btn px-3 py-1 rounded-full border border-sogan-700 bg-keraton text-sogan-300 hover:border-prada hover:text-prada transition';
    }
  });
  renderAksaraKeyboardPalette();
};

window.insertAksaraChar = function (char) {
  const el = document.getElementById('jawaOutput');
  if (!el) return;
  const start = el.selectionStart !== undefined ? el.selectionStart : el.value.length;
  const end = el.selectionEnd !== undefined ? el.selectionEnd : el.value.length;
  const val = el.value;
  el.value = val.substring(0, start) + char + val.substring(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + char.length;
  window.updateAksaraCharCount();
};

window.handleAksaraBackspace = function () {
  const el = document.getElementById('jawaOutput');
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const val = el.value;
  if (start !== end) {
    el.value = val.substring(0, start) + val.substring(end);
    el.selectionStart = el.selectionEnd = start;
  } else if (start > 0) {
    const chars = [...val];
    let idx = 0;
    let charOffset = 0;
    for (let c of chars) {
      if (idx + c.length >= start) break;
      idx += c.length;
      charOffset++;
    }
    chars.splice(charOffset, 1);
    el.value = chars.join('');
    el.selectionStart = el.selectionEnd = idx;
  }
  el.focus();
  window.updateAksaraCharCount();
};

function renderAksaraKeyboardPalette() {
  const container = document.getElementById('virtualKeyboardPalette');
  if (!container) return;

  if (currentAksaraKeyboardTab === 'nglegena') {
    container.innerHTML = `
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        ${Object.entries(AKSARA_NGLEGENA).map(([latin, aksara]) => `
          <button onclick="insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
            <div class="text-prada font-jawa text-xl group-hover:scale-110 transition">${aksara}</div>
            <div class="text-[10px] text-sogan-400 font-mono uppercase mt-0.5">${latin}</div>
          </button>
        `).join('')}
      </div>
    `;
  } else if (currentAksaraKeyboardTab === 'pasangan') {
    container.innerHTML = `
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        ${Object.entries(PASANGAN_MAP).map(([latin, aksara]) => `
          <button onclick="insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
            <div class="text-amber-300 font-jawa text-xl group-hover:scale-110 transition">${aksara}</div>
            <div class="text-[9px] text-sogan-400 font-mono mt-0.5">pas. ${latin}</div>
          </button>
        `).join('')}
      </div>
    `;
  } else if (currentAksaraKeyboardTab === 'sandhangan') {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Sandhangan Swara</span>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            ${Object.entries(SANDHANGAN_SWARA).map(([key, item]) => `
              <button onclick="insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm flex items-center justify-center gap-2">
                <span class="text-prada font-jawa text-xl">${item.aksara}</span>
                <div class="text-left">
                  <div class="text-xs text-sogan-100 font-semibold">${item.latin}</div>
                  <div class="text-[9px] text-sogan-400">${item.nama.split('(')[0].trim()}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-sogan-800/80">
          <div>
            <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Panyigeg Wanda</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${Object.entries(SANDHANGAN_PANYIGEG).map(([key, item]) => `
                <button onclick="insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm">
                  <div class="text-prada font-jawa text-lg">${item.aksara}</div>
                  <div class="text-[10px] text-sogan-300 font-medium">${item.latin}</div>
                </button>
              `).join('')}
            </div>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Sandhangan Wyanjana & Vokal Khusus</span>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
              ${Object.entries(SANDHANGAN_WYANJANA).map(([key, item]) => `
                <button onclick="insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm">
                  <div class="text-prada font-jawa text-lg">${item.aksara}</div>
                  <div class="text-[9px] text-sogan-300 font-medium">${item.latin}</div>
                </button>
              `).join('')}
              <button onclick="insertAksaraChar('ꦉ')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm" title="Pa Cerek (re pepet)">
                <div class="text-prada font-jawa text-lg">ꦉ</div>
                <div class="text-[9px] text-sogan-300 font-medium">Pa Cerek</div>
              </button>
              <button onclick="insertAksaraChar('ꦊ')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm" title="Nga Lelet (le pepet)">
                <div class="text-prada font-jawa text-lg">ꦊ</div>
                <div class="text-[9px] text-sogan-300 font-medium">Nga Lelet</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentAksaraKeyboardTab === 'murda') {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Aksara Murda (Huruf Kapital Tradisional)</span>
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
            ${Object.entries(AKSARA_MURDA).map(([latin, aksara]) => `
              <button onclick="insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
                <div class="text-prada font-jawa text-xl group-hover:scale-110 transition">${aksara}</div>
                <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${latin}</div>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="pt-2 border-t border-sogan-800/80">
          <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Aksara Swara (Vokal Mandiri)</span>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            ${Object.entries(AKSARA_SWARA).map(([latin, aksara]) => `
              <button onclick="insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
                <div class="text-prada font-jawa text-xl group-hover:scale-110 transition">${aksara}</div>
                <div class="text-[10px] text-sogan-400 font-mono mt-0.5">Swara ${latin}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (currentAksaraKeyboardTab === 'angka') {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Angka Jawa (0 - 9)</span>
          <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
            ${Object.entries(ANGKA_JAWA).map(([latin, aksara]) => `
              <button onclick="insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
                <div class="text-prada font-jawa text-xl group-hover:scale-110 transition">${aksara}</div>
                <div class="text-[10px] text-sogan-400 font-mono mt-0.5">${latin}</div>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="pt-2 border-t border-sogan-800/80">
          <span class="text-[10px] uppercase font-bold text-prada tracking-wider block mb-1.5">Tandha Wacan (Tanda Baca)</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${Object.entries(PADA_JAWA).map(([key, item]) => `
              <button onclick="insertAksaraChar('${item.aksara} ')" class="p-2.5 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm flex items-center justify-center gap-2">
                <span class="text-prada font-jawa text-xl">${item.aksara}</span>
                <span class="text-xs text-sogan-200 font-medium">${item.nama}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
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

// ─── WAYANG (GAGRAG SURAKARTA) ─────────────────────────────────────────────
let currentWayangCategory = 'all';

window.filterWayangCategory = function (category) {
  currentWayangCategory = category;
  document.querySelectorAll('.wayang-cat-btn').forEach(btn => {
    const btnCat = btn.getAttribute('data-cat');
    if (btnCat === category) {
      btn.className = 'wayang-cat-btn px-3 py-1 rounded-full border border-prada bg-prada/20 text-prada font-semibold transition';
    } else {
      btn.className = 'wayang-cat-btn px-3 py-1 rounded-full border border-sogan-700 bg-keraton text-sogan-300 hover:border-prada hover:text-prada transition';
    }
  });

  const cards = document.querySelectorAll('.wayang-card-item');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-kategori');
    if (category === 'all' || cardCat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
};

window.selectWayangCharacter = function (key) {
  const data = WAYANG_CHARACTERS[key];
  if (!data) return;

  // 1. Update Aktor Name & Kelir Stage Image
  const actorNameEl = document.getElementById('wayangActorName');
  if (actorNameEl) actorNameEl.innerText = data.nama || data.name;

  const visualEl = document.getElementById('puppetVisual');
  if (visualEl) {
    visualEl.innerHTML = `
      <img src="${data.gambar}" alt="${data.nama}" class="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-all duration-300 select-none pointer-events-none" onerror="this.onerror=null; this.src='assets/wayang/surakarta/gunungan.png';" />
    `;
  }

  // 2. Update Comprehensive Keraton Bio Card
  const bioBox = document.getElementById('puppetBioBox');
  if (bioBox) {
    bioBox.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sogan-800 pb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-prada/20 border border-prada/50 text-[10px] text-prada font-bold uppercase tracking-wider">
                ${data.kategori}
              </span>
              <span class="text-xs text-sogan-400 flex items-center gap-1.5">
                <i class="fa-solid fa-landmark text-prada text-[11px]"></i> ${data.kasatriyan}
              </span>
            </div>
            <h4 class="font-marcellus text-lg sm:text-xl font-bold gold-gradient-text tracking-wide">${data.nama}</h4>
          </div>
          <div class="text-[11px] text-sogan-400 bg-sogan-950/80 px-3 py-1.5 rounded-lg border border-sogan-800 self-start sm:self-auto">
            <span class="text-prada font-medium">Gagrag:</span> Surakarta Hadiningrat (Solo)
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div class="space-y-2.5">
            <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 mb-1.5 tracking-wider">
                <i class="fa-solid fa-feather-pointed"></i> Watak & Bebudene
              </span>
              <p class="text-sogan-200 leading-relaxed">${data.watak}</p>
            </div>
            <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 mb-1.5 tracking-wider">
                <i class="fa-solid fa-shield-halved"></i> Pusaka & Gegaman
              </span>
              <p class="text-sogan-200 font-medium">${data.pusaka}</p>
            </div>
          </div>

          <div class="space-y-2.5">
            <div class="grid grid-cols-2 gap-2.5">
              <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
                <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1 mb-1 tracking-wider">
                  <i class="fa-solid fa-heart"></i> Pasangan (Garwa)
                </span>
                <p class="text-sogan-200">${data.pasangan || '-'}</p>
              </div>
              <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
                <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1 mb-1 tracking-wider">
                  <i class="fa-solid fa-horse-head"></i> Tunggangan
                </span>
                <p class="text-sogan-200">${data.tunggangan || '-'}</p>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
              <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1.5 mb-1 tracking-wider">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Ajian & Kasekten
              </span>
              <p class="text-sogan-200">${data.ajian || '-'}</p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-sogan-800 flex justify-end">
          <button onclick="openWayangDetailModal('${data.id}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-sogan-800 to-sogan-900 border border-prada/60 hover:border-prada text-prada text-xs font-semibold flex items-center gap-2 transition shadow hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] active:scale-95">
            <i class="fa-solid fa-circle-info"></i> Amirsani Katrangan Jangkep (Detail Lengkap)
          </button>
        </div>
      </div>
    `;
  }

  // 3. Highlight Selected Button in Grid
  document.querySelectorAll('.wayang-card-item').forEach(btn => {
    if (btn.getAttribute('data-id') === key) {
      btn.classList.add('border-prada', 'bg-prada/15', 'shadow-[0_0_14px_rgba(212,175,55,0.35)]');
      btn.classList.remove('border-sogan-800', 'bg-keraton');
    } else {
      btn.classList.remove('border-prada', 'bg-prada/15', 'shadow-[0_0_14px_rgba(212,175,55,0.35)]');
      btn.classList.add('border-sogan-800', 'bg-keraton');
    }
  });

  playDalangFX('kepyak', showToast);
  showToast(`Tokoh wayang katetepaken: ${data.nama}`);
};

window.openWayangDetailModal = function (id) {
  const data = WAYANG_CHARACTERS[id];
  if (!data) return;

  const modal = document.getElementById('wayangDetailModal');
  if (!modal) return;

  document.getElementById('modalWayangNama').innerText = data.nama;
  document.getElementById('modalWayangKategori').innerText = data.kategori;
  document.getElementById('modalWayangKasatriyan').innerHTML = `<i class="fa-solid fa-landmark text-amber-400 mr-1"></i> ${data.kasatriyan}`;
  document.getElementById('modalWayangWatak').innerText = data.watak;
  document.getElementById('modalWayangPusaka').innerText = data.pusaka || '-';
  document.getElementById('modalWayangPasangan').innerText = data.pasangan || '-';
  document.getElementById('modalWayangTunggangan').innerText = data.tunggangan || '-';
  document.getElementById('modalWayangAjian').innerText = data.ajian || '-';

  const imgEl = document.getElementById('modalWayangImg');
  if (imgEl) {
    imgEl.src = data.gambar;
    imgEl.alt = data.nama;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeWayangDetailModal = function () {
  const modal = document.getElementById('wayangDetailModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeWayangDetailModal();
  }
});

function renderWayangGrid() {
  const container = document.getElementById('wayangCharacterGrid');
  if (!container) return;

  container.innerHTML = WAYANG_LIST.map(char => `
    <button onclick="selectWayangCharacter('${char.id}')" 
      class="wayang-card-item p-2.5 rounded-xl bg-keraton border border-sogan-800 text-left transition hover:border-prada hover:scale-[1.02] group flex flex-col items-center text-center cursor-pointer"
      data-id="${char.id}" data-kategori="${char.kategori}">
      <div class="w-16 h-20 mb-2 flex items-center justify-center overflow-hidden">
        <img src="${char.gambar}" alt="${char.nama}" class="max-h-full max-w-full object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition duration-200" onerror="this.style.display='none'" />
      </div>
      <div class="w-full">
        <span class="text-[9px] px-1.5 py-0.5 rounded bg-sogan-900 border border-sogan-700 text-prada block truncate mb-1">
          ${char.kategori}
        </span>
        <div class="font-bold text-sogan-100 group-hover:text-prada text-xs truncate" title="${char.nama}">
          ${char.nama.split('(')[0].trim()}
        </div>
        <div class="text-[10px] text-sogan-400 truncate mt-0.5" title="${char.kasatriyan}">
          ${char.kasatriyan.split('(')[0].trim()}
        </div>
      </div>
    </button>
  `).join('');
}

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
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

window.generateRandomPitutur = function () {
  const idx = Math.floor(Math.random() * PITUTUR_LIST.length);
  const item = PITUTUR_LIST[idx];

  const aksaraEl = document.getElementById('pituturAksaraText');
  const jawaEl = document.getElementById('pituturJawaText');
  const artiEl = document.getElementById('pituturArtiText');
  const maknaEl = document.getElementById('pituturMaknaText');
  const badgeEl = document.getElementById('pituturSumberBadge');

  if (aksaraEl) aksaraEl.innerText = item.aksara || '';
  if (jawaEl) jawaEl.innerText = `"${item.jawa}"`;
  if (artiEl) artiEl.innerText = item.artiHarfiah || item.arti || '';
  if (maknaEl) maknaEl.innerText = item.makna || '';
  if (badgeEl) badgeEl.innerText = item.sumber || 'Falsafah Luhur Jawa';

  showToast("Pitutur luhur enggal sampun kabiak.");
};

window.copyPituturText = function () {
  const aksara = document.getElementById('pituturAksaraText')?.innerText || '';
  const jawa = document.getElementById('pituturJawaText')?.innerText || '';
  const arti = document.getElementById('pituturArtiText')?.innerText || '';
  const makna = document.getElementById('pituturMaknaText')?.innerText || '';
  const text = `${jawa}\n${aksara}\nTeges Harfiah: ${arti}\nMakna: ${makna}`;
  copyToClipboard(text, "Pitutur luhur kasil dipun salin!");
};

const QUESTIONS_PER_SESSION = 5;
let activeQuizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

function initNewQuizSession() {
  activeQuizQuestions = shuffleArray(QUIZ_QUESTIONS).slice(0, QUESTIONS_PER_SESSION);
  quizIndex = 0;
  quizScore = 0;
  const qBox = document.getElementById('quizBox');
  const resBox = document.getElementById('quizResultBox');
  if (qBox) qBox.classList.remove('hidden');
  if (resBox) resBox.classList.add('hidden');
  renderQuiz();
}

function renderQuiz() {
  if (!activeQuizQuestions || activeQuizQuestions.length === 0) {
    initNewQuizSession();
    return;
  }
  const q = activeQuizQuestions[quizIndex];
  document.getElementById('quizCounter').innerText = `${quizIndex + 1}/${activeQuizQuestions.length}`;
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
  const q = activeQuizQuestions[quizIndex];
  const isCorrect = selectedIdx === q.correct;
  const allBtns = document.querySelectorAll('#quizOptionsContainer button');
  allBtns.forEach(b => b.disabled = true);

  const pointsPerQuestion = Math.round(100 / activeQuizQuestions.length);

  if (isCorrect) {
    btnEl.classList.add('bg-emerald-950', 'border-emerald-500', 'text-emerald-200');
    quizScore += pointsPerQuestion;
    document.getElementById('quizScore').innerText = quizScore;
    showToast("Leres sanget! Wangsulan sampeyan trep.");
  } else {
    btnEl.classList.add('bg-rose-950', 'border-rose-500', 'text-rose-200');
    if (allBtns[q.correct]) {
      allBtns[q.correct].classList.add('bg-emerald-950', 'border-emerald-500', 'text-emerald-200');
    }
    showToast("Kirang trep, sinau malih nggih.");
  }

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < activeQuizQuestions.length) {
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
  initNewQuizSession();
};

window.addEventListener('tab-switched', (e) => {
  if (e.detail && e.detail.tabId === 'pitutur') {
    window.generateRandomPitutur();
    if (quizIndex === 0 && quizScore === 0) {
      initNewQuizSession();
    }
  }
});

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
  // Catatan: window.hitungNujumPerjodohan() sengaja tidak dipanggil saat awal agar berada pada clean empty state
  window.hitungSelametan();
  renderGamelanKeys();
  renderAksaraKeyboardPalette();
  window.convertLatinToJawa();
  initWayangDraggable();
  renderWayangGrid();
  window.selectWayangCharacter('arjuna');
  window.generateRandomPitutur();
  initNewQuizSession();
  initQuickTodayBadge();
  if (typeof renderKonversiTanggalJawa === 'function') {
    renderKonversiTanggalJawa();
  }
};

window.addEventListener('tab-switched', function (e) {
  if (e.detail && e.detail.tabId === 'tanggal-jawa') {
    if (typeof renderKonversiTanggalJawa === 'function') {
      renderKonversiTanggalJawa();
    }
  }
});
