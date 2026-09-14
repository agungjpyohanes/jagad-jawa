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
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
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

function toggleKetawangPuspawarna(showToastFn = showToast) {
  const btn = document.getElementById('playPuspawarnaBtn');
  const icon = document.getElementById('audioBtnIcon');
  const label = document.getElementById('audioBtnLabel');

  if (isPuspawarnaPlaying) {
    clearInterval(puspawarnaInterval);
    isPuspawarnaPlaying = false;
    puspawarnaInterval = null;
    if (btn) btn.classList.remove('playing');
    if (icon) icon.className = 'fa-solid fa-play text-prada';
    if (label) label.innerText = 'Puspawarna';
    if (showToastFn) showToastFn('Gendhing Puspawarna dipun suwun mandheg.');
  } else {
    initAudio();
    isPuspawarnaPlaying = true;
    if (btn) btn.classList.add('playing');
    if (icon) icon.className = 'fa-solid fa-pause text-prada animate-pulse';
    if (label) label.innerText = 'Mungel...';
    if (showToastFn) showToastFn('Nglaras Gendhing Ketawang Puspawarna (Slendro Manyura)...');

    puspawarnaStep = 0;
    const playNextNote = () => {
      const note = PUSPAWARNA_SLENDRO_PATHE_MANYURA[puspawarnaStep % PUSPAWARNA_SLENDRO_PATHE_MANYURA.length];
      playGamelanTone(note.freq, note.type);
      puspawarnaStep++;
    };

    playNextNote();
    puspawarnaInterval = setInterval(playNextNote, 850);
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
  "Shinto","Landep","Wukir","Kurantil","Tolu","Gumbreg","Warigalit","Warigagung",
  "Julung Wangi","Sungsang","Galungan","Kuningan","Langkir","Mandasiya","Julung Pujut","Pahang",
  "Kuruwelut","Marakeh","Tambir","Madangkungan","Maktal","Wuye","Manahil","Prangbakat","Bala",
  "Wugu","Wayang","Kulawu","Dukut","Watu Gunung"
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

const JDN_LEGI_ANCHOR = toJDN(2022, 1, 10);
const SUN_ANCHOR = new Date(Date.UTC(2022, 0, 9));
const WUKU_ANCHOR_IDX = 19;

function getDayInfo(y, m, d) {
  const jdn = toJDN(y, m, d);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const weekdayId = dt.getUTCDay();
  const pasaranId = ((jdn - JDN_LEGI_ANCHOR) % 5 + 5) % 5;
  const sundayOfWeek = new Date(dt);
  sundayOfWeek.setUTCDate(dt.getUTCDate() - weekdayId);
  const weeksDiff = Math.round((sundayOfWeek - SUN_ANCHOR) / (7 * 86400000));
  const wukuId = ((WUKU_ANCHOR_IDX + weeksDiff) % 30 + 30) % 30;
  const [hy, hm, hd] = jdnToIslamic(jdn);
  const ajYear = hy + 512;
  return { jdn, weekdayId, pasaranId, wukuId, hijri: [hd, hm, hy], ajYear };
}

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

const PAARASAN_ARTI = {
  "Aras Tuding": "Pemberani dan terpakai kinerjanya tapi sering menjual perabotnya",
  "Aras Kembang": "Larang anak tetapi dikasihi banyak orang dan mudah bekerja",
  "Lakuning Lintang": "Pendiam, rendah hati, betah melek, sering pindah rumah",
  "Lakuning Rembulan": "Pandai, cekatan, luas pandangannya, diluluti orang, sukses hidupnya",
  "Lakuning Srengenge": "Pengertian, manis bicaranya, kreatif, selalu mengalah",
  "Lakuning Banyu": "Teguh, rajin, ramah, berjiwa pemimpin",
  "Lakuning Bumi": "Pendiam, mudah tersinggung, suka ketenangan dan welas asih",
  "Lakuning Geni": "Pemarah, pemberani, banyak rencana dan teguh pendirian",
  "Lakuning Angin": "Pendiam, suka disanjung, lincah dan menyenangkan orang lain",
  "Aras Pepet": "Pendiam, tajam pikirannya, berbakat mendalami ilmu kebatinan"
};

const PANCASUDA_ARTI = {
  "Wasesa Segara": "Berjiwa besar, pemaaf, berwibawa laksana samudra luas",
  "Tunggak Semi": "Banyak rejeki, walau terpotong tetap bersemi kembali",
  "Satriya Wibawa": "Dimanapun selalu berwibawa dan dihormati sesama",
  "Sumur Sinaba": "Menjadi sumber rujukan dan tempat menimba ilmu kebajikan",
  "Satriya Wirang": "Sering menghadapi ujian kesabaran dan aral rintangan",
  "Bumi Kapetak": "Bersih hatinya, kuat pendiriannya, tahan uji",
  "Lebu Katiyup Angin": "Suka berkelana, berimajinasi luas, cocok untuk perantau"
};

const KAMAROKAN_ARTI = {
  "Sanggar Waringin": "Tentrem, bahagia, banyak rejeki, menjadi pengayom",
  "Mantri Sinarojo": "Tercapai cita-citanya, murah sandang-pangan",
  "Macan Ketawan": "Cukupan, disegani dan dihormati dalam pergaulan",
  "Nuju Padu": "Sering berbeda pendapat, perlu menjaga tutur kata",
  "Kala Tinantang": "Pemberani, menghadapi tantangan hidup dengan tegar",
  "Nuju Pati": "Perlu kehati-hatian dalam mengelola rezeki dan kesehatan"
};

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
  if (!tglVal) {
    const elDino = document.getElementById('outHariPasaranPribadi');
    const elNeptu = document.getElementById('outNeptuWukuPribadi');
    if (elDino) elDino.innerText = '-';
    if (elNeptu) elNeptu.innerText = '-';
    return;
  }
  const [y, m, d] = tglVal.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;
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

  document.getElementById('hasilPerjodohanBody').innerHTML = tbody;
  document.getElementById('perjodohanPairInfo').innerHTML = `${namaP} (${neptuP}) · ${namaL} (${neptuL}) · Jumlah Neptu: <strong class="text-prada font-mono">${totalNeptu}</strong>`;
  document.getElementById('ringkasanPerjodohanBox').innerHTML = `
    <div class="font-bold text-prada text-sm">Ringkasan Kecocokan Pitung Jawa:</div>
    <p class="text-sogan-200">Dari 7 perhitungan metode primbon: <strong class="text-emerald-400">✓ ${baik} Baik</strong>, <strong class="text-amber-400">• ${campur} Campuran</strong>, dan <strong class="text-rose-400">⊗ ${buruk} Kurang Baik</strong>. Hubungan memiliki keharmonisan yang perlu dijaga dengan saling menghargai.</p>
  `;

  const emptyBox = document.getElementById('emptyPerjodohanBox');
  if (emptyBox) emptyBox.classList.add('hidden');
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
};
