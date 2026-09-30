/**
 * Jagad Jawa — Modul Domain: Kartu Karakter Pusaka Jawa (Branch jawa-v9)
 * Men-generate kartu karakter koleksi berornamen Kasultanan Jawa modern:
 * Metallic gold frame, HP = Neptu, otomatisasi ilustrasi Dewa Pelindung wuku,
 * elemen hari (Bunga, Air, Tanah, Api, Angin), Pranata Mangsa visual,
 * atribut Sasmitho Alam (suara hewan: tekek, asu njegug, dll),
 * nama dinamis, kemampuan/moves, titik mawas diri, arah hoki, dan pitutur luhur.
 *
 * Dilengkapi pengunduhan PNG ramah mobile (HP) & fitur Cetak PDF lengkap.
 */

import { showToast, copyToClipboard } from '../../ui/toast.js';
import { downloadCanvasAsPng, isMobileDevice } from '../../ui/download-helper.js';
import { dewaneIllustrationPath, dewaneLegacyImagePath, resolveWukuDewa } from '../../data/dewa-kanon.js';
import { getPranataMangsaLengkap, getDayInfo } from '../kalender/kalender-engine.js';
import { getZodiakByDate } from '../../data/pranata-zodiak-data.js';

let _cachedNujumData = null;
const _dewaImageCache = new Map();

/**
 * Mengambil cache data Nujum kartu saat ini.
 * @returns {Object|null}
 */
export function getCachedNujumData() {
  return _cachedNujumData;
}

/**
 * Sinkronisasi otomatis dan reset state data Kartu Karakter saat perhitungan Nujum baru dijalankan.
 * Menjamin kartu karakter selalu sinkron 100% dengan data nujum terbaru tanpa data basi.
 * @param {Object} data Hasil kalkulasi Nujum lengkap
 */
export function syncNujumCardData(data) {
  if (!data) return;
  _cachedNujumData = data;
  currentCardOptions = {
    ...DEFAULT_OPTIONS,
    customNama: (data && data.nama && data.nama !== '-') ? data.nama : ''
  };

  if (typeof document !== 'undefined') {
    const inputNama = document.getElementById('pokemonCardNamaInput');
    if (inputNama) {
      inputNama.value = currentCardOptions.customNama;
    }

    const sel = document.getElementById('pokemonCardPresetSelect');
    if (sel) {
      sel.value = '';
    }

    const canvas = document.getElementById('nujumPokemonCardCanvas');
    if (canvas) {
      drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
    }
  }
}

export const DEFAULT_OPTIONS = {
  nama: true,
  tglLahir: true,
  wetonNeptu: true,
  wukuDewa: true,
  tipeKarakter: true,
  kekuatan: true,
  mawasDiri: true,
  arahHoki: true,
  shioZodiak: true,
  pitutur: true,
  elemenHari: true,
  pranataMangsa: true,
  sasmithoAlam: true,
  customNama: ''
};

let currentCardOptions = { ...DEFAULT_OPTIONS };

/**
 * Pemetaan Elemen Hari berdasarkan Pasaran & Saptawara.
 * Bunga (Kembang/Flora), Air (Tirta), Tanah (Bantala), Api (Dahana), Angin/Langit (Akasa).
 * 
 * @param {string} pasaran 
 * @param {string} dino 
 * @returns {Object}
 */
/**
 * Pemetaan Lambang Dina (Elemen Hari Lahir Saptawara) kanon Jawa:
 * - Senin  = Bunga (🌸)
 * - Selasa = Api (🔥)
 * - Rabu   = Daun (🍃)
 * - Kamis  = Angin (💨)
 * - Jumat  = Air (💧)
 * - Sabtu  = Tanah (🌍)
 * - Minggu = Angkasa (✨)
 * 
 * Fleksibel mendukung parameter (dino, pasaran) ataupun (pasaran, dino).
 * 
 * @param {string} [arg1=''] dino atau pasaran
 * @param {string} [arg2=''] pasaran atau dino
 * @returns {Object}
 */
export function getElemenHari(arg1 = '', arg2 = '') {
  const str1 = String(arg1 || '').toLowerCase().trim();
  const str2 = String(arg2 || '').toLowerCase().trim();

  // Pola pencocokan kata kunci hari dalam berbagai bahasa (Indonesia, Jawa, Inggris, numeric)
  const isMatch = (str, pattern) => pattern.test(str);

  const checkDay = (val) => {
    if (typeof val === 'number') {
      if (val === 1) return 'senin';
      if (val === 2) return 'selasa';
      if (val === 3) return 'rabu';
      if (val === 4) return 'kamis';
      if (val === 5) return 'jumat';
      if (val === 6) return 'sabtu';
      if (val === 0 || val === 7) return 'minggu';
    }
    const s = String(val).toLowerCase().trim();
    if (isMatch(s, /\b(senin|monday|mon|senèn|senen)\b/) || s.includes('senin') || s.includes('monday') || s.includes('senèn')) return 'senin';
    if (isMatch(s, /\b(selasa|tuesday|tue|salasa)\b/) || s.includes('selasa') || s.includes('tuesday') || s.includes('salasa')) return 'selasa';
    if (isMatch(s, /\b(rabu|wednesday|wed|rebo)\b/) || s.includes('rabu') || s.includes('wednesday') || s.includes('rebo')) return 'rabu';
    if (isMatch(s, /\b(kamis|thursday|thu|kemis)\b/) || s.includes('kamis') || s.includes('thursday') || s.includes('kemis')) return 'kamis';
    if (isMatch(s, /\b(jumat|friday|fri|jemuwah|jum'at|jumaat)\b/) || s.includes('jumat') || s.includes('friday') || s.includes('jemuwah') || s.includes("jum'at")) return 'jumat';
    if (isMatch(s, /\b(sabtu|saturday|sat|setu)\b/) || s.includes('sabtu') || s.includes('saturday') || s.includes('setu')) return 'sabtu';
    if (isMatch(s, /\b(minggu|sunday|sun|ahad|radite)\b/) || s.includes('minggu') || s.includes('sunday') || s.includes('ahad') || s.includes('radite')) return 'minggu';
    return null;
  };

  const detected = checkDay(str1) || checkDay(str2) || checkDay(arg1) || checkDay(arg2) || 'minggu';

  if (detected === 'senin') {
    return {
      kategori: 'Bunga',
      label: 'Bunga (Sekar / Kusuma)',
      simbol: '🌸',
      warna: '#f472b6',
      badgeBg: 'rgba(244, 114, 182, 0.22)',
      border: '#f472b6',
      filosofi: 'Endah asri, arum wicara, pemicu katresnan lan pepadhang manah.'
    };
  } else if (detected === 'selasa') {
    return {
      kategori: 'Api',
      label: 'Api (Dahana / Geni)',
      simbol: '🔥',
      warna: '#f87171',
      badgeBg: 'rgba(248, 113, 113, 0.22)',
      border: '#f87171',
      filosofi: 'Gagah prawira, padhang krentege, pemicu greget karsa lan semangat.'
    };
  } else if (detected === 'rabu') {
    return {
      kategori: 'Daun',
      label: 'Daun (Ron / Godhong)',
      simbol: '🍃',
      warna: '#4ade80',
      badgeBg: 'rgba(74, 222, 128, 0.22)',
      border: '#4ade80',
      filosofi: 'Ijo royo-royo, seger paring ayom lan ngrembakakaken kabecikan.'
    };
  } else if (detected === 'kamis') {
    return {
      kategori: 'Angin',
      label: 'Angin (Maruta / Bayu)',
      simbol: '💨',
      warna: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.22)',
      border: '#38bdf8',
      filosofi: 'Luwes sumrambah, ngambah pundi kemawon kanthi jembar wawasane.'
    };
  } else if (detected === 'jumat') {
    return {
      kategori: 'Air',
      label: 'Air (Tirta / Banyu)',
      simbol: '💧',
      warna: '#60a5fa',
      badgeBg: 'rgba(96, 165, 250, 0.22)',
      border: '#60a5fa',
      filosofi: 'Manut lakuning ilining toya, resik, adhem nyirep hawa nepsu.'
    };
  } else if (detected === 'sabtu') {
    return {
      kategori: 'Tanah',
      label: 'Tanah (Bantala / Siti)',
      simbol: '🌍',
      warna: '#eab308',
      badgeBg: 'rgba(234, 179, 8, 0.22)',
      border: '#eab308',
      filosofi: 'Kukuh bakuh kados bumi pertiwi, sabar narima, jembar pangapurane.'
    };
  }

  // Minggu / Sunday / Ahad / Radite -> Angkasa
  return {
    kategori: 'Angkasa',
    label: 'Angkasa (Gaggana / Akasa)',
    simbol: '✨',
    warna: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.22)',
    border: '#c084fc',
    filosofi: 'Pusat pancer astakona, wening budine, nggayuh kasampurnan lahir batin.'
  };
}

/**
 * Pemetaan atribut Sasmitho Alam (tanda alam suara hewan & titen tradisi Jawa)
 * selaras dengan weton hari tersebut.
 * 
 * @param {string} dino 
 * @param {string} pasaran 
 * @returns {Object}
 */
export function getSasmithoAlamWeton(dino = '', pasaran = '') {
  const p = String(pasaran).toLowerCase().trim();
  const d = String(dino).toLowerCase().trim();

  // Titen tradisi suara hewan primbon
  if (p === 'pon') {
    return {
      hewan: 'Tekek (Tokek)',
      swara: 'Unine Tekek',
      simbol: '🦎',
      surasa: 'Sida Karya (Gelis Gazul)',
      tegese: 'Pratandha kasembadan rancangan pakaryan sarta panetep rejeki bale wisma.',
      nasihat: 'Tansah tekun makarya lan sabar ngadhepi tantangan.'
    };
  } else if (p === 'pahing') {
    return {
      hewan: 'Asu (Anjing)',
      swara: 'Asu Njegug Wanci Wengi',
      simbol: '🐕',
      surasa: 'Pènget Waspada Ing Ratri',
      tegese: 'Sasmitha pènget mawas dhiri ing wanci dalu, sumingkir saking godha hawa nepsu lan bebaya.',
      nasihat: 'Kukuhana donga pangreksa lan aja gampang kepancing emosi.'
    };
  } else if (p === 'legi') {
    return {
      hewan: 'Manuk Prenjak / Podhang',
      swara: 'Unine Prenjak & Podhang',
      simbol: '🐦',
      surasa: 'Rawuhing Tamu Rahayu',
      tegese: 'Pratandha rawuhing kabar kabingahan, tamu kinasih, sarta pepadhang rejeki lumintu.',
      nasihat: 'Sumringah ing nampa rawuhing paseduluran lan luhurna silaturahmi.'
    };
  } else if (p === 'wage') {
    return {
      hewan: 'Kucing & Jangkrik',
      swara: 'Kucing Ngeong & Jangkrik Ngerik',
      simbol: '🐱',
      surasa: 'Katentreman Wening',
      tegese: 'Sasmitha mangsa anyep, lereming batin, tansah eling marang sedulur papat lima pancer.',
      nasihat: 'Ayemna penggalih, ngadohi pasulayan, lan jaganen karukunan.'
    };
  }

  // Kliwon / Pancer
  return {
    hewan: 'Manuk Kukuk (Beluk) & Gagak',
    swara: 'Manuk Beluk ing Wanci Dalu',
    simbol: '🦉',
    surasa: 'Panyucen Sukma & Ruwat',
    tegese: 'Sasmitha gaib tolak sengkala, ngelingake supados ngedohi pamrih lan ngudi karahayon.',
    nasihat: 'Mantepna pasrah sumarah mring Gusti Kang Maha Kawasa.'
  };
}

/**
 * Mengambil atau memuat gambar Dewa Pelindung wuku secara asinkron dengan caching.
 * @param {number} wukuNo 
 * @param {HTMLCanvasElement} [canvasToRedraw]
 * @param {Object} [dataToRedraw]
 * @param {Object} [optionsToRedraw]
 * @returns {HTMLImageElement|null}
 */
function getOrLoadDewaImage(wukuNo, canvasToRedraw = null, dataToRedraw = null, optionsToRedraw = null) {
  if (typeof Image === 'undefined') return null;
  const no = parseInt(wukuNo, 10) || 1;

  if (_dewaImageCache.has(no)) {
    const cached = _dewaImageCache.get(no);
    return (cached && cached.complete && cached.naturalWidth > 0) ? cached : null;
  }

  // Coba ambil path kanon
  const dewaPath = dewaneIllustrationPath(no) || dewaneLegacyImagePath(no);
  if (!dewaPath) return null;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    _dewaImageCache.set(no, img);
    if (canvasToRedraw && dataToRedraw) {
      drawNujumPokemonCard(canvasToRedraw, dataToRedraw, optionsToRedraw || currentCardOptions);
    }
  };
  img.onerror = () => {
    // Fallback coba path alternatif jika kanon gagal
    const legacyPath = dewaneLegacyImagePath(no);
    if (legacyPath && legacyPath !== dewaPath) {
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = 'anonymous';
      fallbackImg.onload = () => {
        _dewaImageCache.set(no, fallbackImg);
        if (canvasToRedraw && dataToRedraw) {
          drawNujumPokemonCard(canvasToRedraw, dataToRedraw, optionsToRedraw || currentCardOptions);
        }
      };
      fallbackImg.src = legacyPath;
    }
  };
  img.src = dewaPath;
  return null;
}

/**
 * Menggambar Kartu Karakter Koleksi ke HTML5 Canvas.
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} data - Nujum calculation data
 * @param {Object} options - Toggles for attributes
 */
export function drawNujumPokemonCard(canvas, data, options = DEFAULT_OPTIONS, scale = 1) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 750;
  const height = 1050;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  if (typeof ctx.save === 'function') {
    ctx.save();
  }
  if (scale !== 1 && typeof ctx.scale === 'function') {
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  const sr = data.summaryRingkas || {};
  const pwk = data.pwk || {};
  const neptu = data.neptu || 10;
  const wukuNo = data.wukuNo || (pwk.no_wuku ? parseInt(pwk.no_wuku) : 1);
  const wukuName = data.wukuName || pwk.nama_wuku || 'Sinta';
  const dewane = pwk.dewane || 'Sang Hyang Yamadipati';
  // Resolusi Dino & Pasaran (prioritaskan data, atau hitung via getDayInfo jika tersedia d, m, y)
  let dino = data.dino;
  let pas = data.pas;
  if ((!dino || !pas) && data.y && data.m && data.d) {
    try {
      const dayInf = getDayInfo(parseInt(data.y, 10), parseInt(data.m, 10), parseInt(data.d, 10));
      if (dayInf) {
        if (!dino) dino = dayInf.hari;
        if (!pas) pas = dayInf.pasaran;
      }
    } catch {}
  }
  dino = dino || 'Minggu';
  pas = pas || 'Legi';

  // 1. Dapatkan Nama Dinamis
  let resolvedNama = (options.customNama || data.nama || '').trim();
  if (!resolvedNama || resolvedNama === 'Raden Jagad Jawa') {
    const inputEl = document.getElementById('pokemonCardNamaInput');
    const nujumInput = document.getElementById('namaKepribadian') || document.getElementById('nujumNama');
    if (inputEl && inputEl.value.trim()) {
      resolvedNama = inputEl.value.trim();
    } else if (nujumInput && nujumInput.value.trim() && nujumInput.value.trim() !== '-') {
      resolvedNama = nujumInput.value.trim();
    } else {
      resolvedNama = 'SATRIA PINILIH';
    }
  }

  // 2. Data Elemen Hari, Pranata Mangsa & Sasmitho Alam
  const elemenHari = getElemenHari(pas, dino);
  const sasmitho = getSasmithoAlamWeton(dino, pas);
  const dayNum = parseInt(data.d, 10) || 1;
  const monthNum = parseInt(data.m, 10) || 1;
  const pranata = data.mangsaRes || getPranataMangsaLengkap(dayNum, monthNum);

  // ─── 1. BACKGROUND METALLIC & COSMIC KERATON ───
  const outerGrad = ctx.createLinearGradient(0, 0, width, height);
  outerGrad.addColorStop(0, '#f5d77f');
  outerGrad.addColorStop(0.2, '#d4af37');
  outerGrad.addColorStop(0.5, '#aa7c11');
  outerGrad.addColorStop(0.8, '#d4af37');
  outerGrad.addColorStop(1, '#664606');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 28);
  ctx.fill();

  // Dark Inner Body
  const innerMargin = 20;
  const innerWidth = width - innerMargin * 2;
  const innerHeight = height - innerMargin * 2;

  const innerGrad = ctx.createLinearGradient(innerMargin, innerMargin, innerMargin, innerHeight);
  innerGrad.addColorStop(0, '#0e1320');
  innerGrad.addColorStop(0.3, '#141d30');
  innerGrad.addColorStop(0.7, '#181529');
  innerGrad.addColorStop(1, '#080c14');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.roundRect(innerMargin, innerMargin, innerWidth, innerHeight, 20);
  ctx.fill();

  // Subtle border lines
  ctx.strokeStyle = '#eedc9a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(innerMargin + 6, innerMargin + 6, innerWidth - 12, innerHeight - 12);

  // ─── 2. TOP HEADER (NAME + HP / NEPTU) ───
  const headerY = 54;
  const headerX = innerMargin + 16;
  const headerW = innerWidth - 32;

  // Stage indicator badge
  ctx.fillStyle = '#eedc9a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✦ KARTU KARAKTER PUSAKA JAWA · EDISI KASULTANAN NUSANTARA ✦', headerX, headerY - 14);

  // Header Box Bar
  ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
  ctx.beginPath();
  ctx.roundRect(headerX, headerY - 5, headerW, 46, 12);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Nama Karakter (Dinamis Sesuai Input Pengguna dengan Auto-Fit Ukuran Font)
  const nameToRender = (options.nama ? resolvedNama : 'SATRIA PINILIH').toUpperCase().trim();
  const maxNameWidth = options.wetonNeptu ? (headerW - 145) : (headerW - 32);

  let nameFontSize = 23;
  ctx.font = `bold ${nameFontSize}px "Cinzel", "Cinzel Decorative", Georgia, serif`;
  if (typeof ctx.measureText === 'function') {
    while (nameFontSize > 11 && ctx.measureText(nameToRender).width > maxNameWidth) {
      nameFontSize -= 0.5;
      ctx.font = `bold ${nameFontSize}px "Cinzel", "Cinzel Decorative", Georgia, serif`;
    }
  } else if (nameToRender.length > 28) {
    nameFontSize = 14;
    ctx.font = `bold ${nameFontSize}px "Cinzel", "Cinzel Decorative", Georgia, serif`;
  } else if (nameToRender.length > 20) {
    nameFontSize = 17;
    ctx.font = `bold ${nameFontSize}px "Cinzel", "Cinzel Decorative", Georgia, serif`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
  ctx.shadowBlur = 6;
  ctx.fillText(nameToRender, headerX + 16, headerY + 27);
  ctx.shadowBlur = 0;

  // HP = Neptu Pill
  if (options.wetonNeptu) {
    const hpX = headerX + headerW - 16;
    ctx.textAlign = 'right';

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12.5px sans-serif';
    ctx.fillText('HP', hpX - 44, headerY + 25);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px serif';
    ctx.fillText(`${neptu}`, hpX, headerY + 27);

    ctx.beginPath();
    ctx.arc(hpX + 12, headerY + 17, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // ─── 3. SUB-HEADER (ELEMENT & ZODIAK PILLS) ───
  const subY = headerY + 54;
  ctx.textAlign = 'left';

  const typeParts = [];
  if (options.wetonNeptu) typeParts.push(`${dino} ${pas}`);
  if (options.wukuDewa) typeParts.push(`Wuku ${wukuName}`);
  if (options.shioZodiak !== false) {
    const shioNama = data.shioLahirRes?.namaShio || data.shioLahirRes?.shio || data.shio || (sr.shio) || '';
    if (shioNama) {
      typeParts.push(`Shio ${shioNama}`);
    }
    const zodiakNama = data.zodiakRes?.nama || data.zodiak || (sr.zodiak) || (typeof getZodiakByDate === 'function' ? getZodiakByDate(dayNum, monthNum)?.nama : '') || '';
    if (zodiakNama) {
      typeParts.push(`Surya ${zodiakNama}`);
    }
  }

  // Tanggal Lahir di sebelah kanan (jika opsi aktif)
  let tglDisplay = '';
  let rightTextWidth = 0;
  if (options.tglLahir && (sr.tglMasehiStr || data.tglJawaRes)) {
    tglDisplay = sr.tglMasehiStr || `${data.d || dayNum}-${data.m || monthNum}-${data.y || 2026}`;
    ctx.font = 'bold 11px sans-serif';
    rightTextWidth = (typeof ctx.measureText === 'function') ? ctx.measureText(tglDisplay).width : 90;
  }

  const subHeaderText = typeParts.join('  ·  ').toUpperCase();
  const maxSubWidth = headerW - (tglDisplay ? (rightTextWidth + 24) : 8);

  let subFontSize = 11;
  ctx.font = `bold ${subFontSize}px sans-serif`;
  if (typeof ctx.measureText === 'function') {
    while (subFontSize > 8 && ctx.measureText(subHeaderText).width > maxSubWidth) {
      subFontSize -= 0.5;
      ctx.font = `bold ${subFontSize}px sans-serif`;
    }
  }

  ctx.fillStyle = '#94a3b8';
  ctx.fillText(subHeaderText, headerX + 4, subY + 8);

  if (tglDisplay) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(tglDisplay, headerX + headerW - 4, subY + 8);
  }

  // ─── 4. HERO PORTRAIT WINDOW (DEWA PELINDUNG, ELEMEN & PRANATA) ───
  const artY = subY + 16;
  const artH = 346;
  const artW = headerW;

  // Outer Art Frame
  ctx.fillStyle = 'rgba(8, 12, 20, 0.95)';
  ctx.beginPath();
  ctx.roundRect(headerX, artY, artW, artH, 16);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Glow radial center
  const radialGrad = ctx.createRadialGradient(width / 2, artY + artH / 2, 20, width / 2, artY + artH / 2, 200);
  radialGrad.addColorStop(0, 'rgba(212, 175, 55, 0.32)');
  radialGrad.addColorStop(0.55, 'rgba(30, 41, 59, 0.5)');
  radialGrad.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
  ctx.fillStyle = radialGrad;
  ctx.beginPath();
  ctx.roundRect(headerX + 4, artY + 4, artW - 8, artH - 8, 12);
  ctx.fill();

  // Safe portrait image rendering (Otomatisasi Dewa Pelindung Berdasarkan Wuku)
  let imageRendered = false;
  const dewaImg = getOrLoadDewaImage(wukuNo, canvas, data, options);
  const avatarImg = dewaImg || data.avatarImage || data.wayangImage || data.cardImage;

  if (!options.noExternalImages && avatarImg && (typeof avatarImg === 'object' && avatarImg.complete && avatarImg.naturalWidth > 0)) {
    try {
      ctx.save();
      const clipBoxX = headerX + 8;
      const clipBoxY = artY + 8;
      const clipBoxW = artW - 16;
      const clipBoxH = artH - 38;
      ctx.beginPath();
      ctx.roundRect(clipBoxX, clipBoxY, clipBoxW, clipBoxH, 10);
      ctx.clip();

      // Lingkaran Aura Cahaya Ilahi / Keemasan di belakang Dewa Pelindung
      const auraGrad = ctx.createRadialGradient(width / 2, clipBoxY + clipBoxH * 0.52, 15, width / 2, clipBoxY + clipBoxH * 0.52, clipBoxH * 0.48);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      auraGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.16)');
      auraGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(width / 2, clipBoxY + clipBoxH * 0.52, clipBoxH * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // Hitung proporsi gambar dewa secara proporsional, megah, dan estetis
      const imgAspect = avatarImg.naturalWidth / avatarImg.naturalHeight;
      const maxDrawW = clipBoxW - 16;
      const maxDrawH = clipBoxH - 12;
      let drawH = maxDrawH;
      let drawW = drawH * imgAspect;
      if (drawW > maxDrawW) {
        drawW = maxDrawW;
        drawH = drawW / imgAspect;
      }
      const drawX = clipBoxX + (clipBoxW - drawW) / 2;
      const drawY = clipBoxY + (clipBoxH - drawH) / 2;

      ctx.drawImage(avatarImg, drawX, drawY, drawW, drawH);
      ctx.restore();
      imageRendered = true;
    } catch {
      imageRendered = false;
    }
  }

  if (!imageRendered) {
    // Mandala / Astakona ring behind aksara
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width / 2, artY + artH / 2 - 16, 85, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, artY + artH / 2 - 16, 96, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Aksara Jawa Monogram
    const aksara = data.aksaraJawa || 'ꦗꦒꦢ꧀ꦗꦮ';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 44px "Noto Sans Javanese", "Tuladha Jejeg", serif';
    ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
    ctx.shadowBlur = 16;
    ctx.fillText(aksara, width / 2, artY + artH / 2 - 4);
    ctx.shadowBlur = 0;

    // Weton banner inside art
    ctx.fillStyle = '#eedc9a';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    const wetonLabel = options.wetonNeptu ? `✦ ${dino} ${pas} ✦` : '✦ JAGAD JAWA ✦';
    ctx.fillText(wetonLabel, width / 2, artY + artH / 2 + 50);
  }

  // ── ILUSTRASI ELEMEN HARI BADGE (Kiri Atas Hero) ──
  if (options.elemenHari && elemenHari) {
    const elBadgeX = headerX + 12;
    const elBadgeY = artY + 12;
    const elBadgeW = 158;
    const elBadgeH = 34;

    // Background pill with blur glow effect
    ctx.save();
    ctx.fillStyle = elemenHari.badgeBg;
    ctx.beginPath();
    ctx.roundRect(elBadgeX, elBadgeY, elBadgeW, elBadgeH, 10);
    ctx.fill();
    ctx.strokeStyle = elemenHari.border;
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Icon Circle Badge
    const iconCenterX = elBadgeX + 18;
    const iconCenterY = elBadgeY + 17;
    ctx.beginPath();
    ctx.arc(iconCenterX, iconCenterY, 11, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fill();
    ctx.strokeStyle = elemenHari.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emoji / Icon
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(elemenHari.simbol, iconCenterX, iconCenterY + 1);

    // Text Label: Kategori (Jarak lega dari bulatan ikon)
    const textStartX = elBadgeX + 38;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = elemenHari.warna;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(elemenHari.kategori.toUpperCase(), textStartX, elBadgeY + 16);

    // Text Sub-label: DINA
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText(`DINA ${dino.toUpperCase()}`, textStartX, elBadgeY + 27);
    ctx.restore();
  }

  // ── ELEMEN VISUAL PRANATA MANGSA BADGE (Kanan Atas Hero) ──
  if (options.pranataMangsa && pranata) {
    const pmBadgeW = 150;
    const pmBadgeX = headerX + artW - pmBadgeW - 12;
    const pmBadgeY = artY + 12;
    ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
    ctx.beginPath();
    ctx.roundRect(pmBadgeX, pmBadgeY, pmBadgeW, 26, 8);
    ctx.fill();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#5eead4';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'right';
    const pmLabel = pranata.nama ? `🌾 ${pranata.nama.toUpperCase()}` : '🌾 PRANATA MANGSA';
    ctx.fillText(pmLabel, pmBadgeX + pmBadgeW - 8, pmBadgeY + 17);
  }

  // Metadata strip on bottom of art
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.fillRect(headerX + 1, artY + artH - 30, artW - 2, 29);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(headerX, artY + artH - 30);
  ctx.lineTo(headerX + artW, artY + artH - 30);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  const bannerInfo = `DEWANE: ${dewane.toUpperCase()}  ·  WUKU: ${wukuName.toUpperCase()} (${wukuNo}/30)  ·  NEPTU: ${neptu}`;
  ctx.fillText(bannerInfo, width / 2, artY + artH - 11);

  // ─── 5. ABILITIES & MOVES SECTION ───
  let movesY = artY + artH + 14;

  // Ability 1: Tipe Karakter Utama (Passive Ability)
  if (options.tipeKarakter && sr.tipeKarakter) {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.beginPath();
    ctx.roundRect(headerX, movesY, headerW, 58, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`★ KEMAMPUAN UTAMA: ${sr.tipeKarakter.toUpperCase()}`, headerX + 14, movesY + 20);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    const desc = sr.deskripsiKarakter || 'Watak budi luhur, mikul dhuwur mendhem jero.';
    const trimmedDesc = desc.length > 88 ? desc.substring(0, 85) + '...' : desc;
    ctx.fillText(trimmedDesc, headerX + 14, movesY + 41);

    movesY += 66;
  }

  // Moves / Jurus Kekuatan Utama
  if (options.kekuatan && Array.isArray(sr.kekuatanUtama) && sr.kekuatanUtama.length > 0) {
    const moveCount = Math.min(sr.kekuatanUtama.length, 2);
    for (let i = 0; i < moveCount; i++) {
      const moveName = sr.kekuatanUtama[i];
      const movePower = neptu * (10 - i * 2);

      ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.beginPath();
      ctx.roundRect(headerX, movesY, headerW, 44, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Energy icon
      ctx.beginPath();
      ctx.arc(headerX + 22, movesY + 22, 10, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#10b981' : '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(i === 0 ? '⚔' : '✦', headerX + 22, movesY + 26);

      // Move Name
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13.5px serif';
      ctx.fillText(moveName, headerX + 42, movesY + 27);

      // Power Damage
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText(`${movePower}`, headerX + headerW - 16, movesY + 28);

      movesY += 50;
    }
  }

  // ─── 6. ATRIBUT SASMITHO ALAM (Tanda Alam Weton) ───
  if (options.sasmithoAlam && sasmitho) {
    ctx.fillStyle = 'rgba(30, 20, 45, 0.85)';
    ctx.beginPath();
    ctx.roundRect(headerX, movesY, headerW, 52, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.fillText(`${sasmitho.simbol} SASMITHO ALAM (${dino} ${pas}): ${sasmitho.swara.toUpperCase()} — ${sasmitho.surasa}`, headerX + 14, movesY + 20);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 11px sans-serif';
    const sasmithoDesc = `${sasmitho.tegese} ${sasmitho.nasihat}`;
    const trimmedSasmitho = sasmithoDesc.length > 92 ? sasmithoDesc.substring(0, 89) + '...' : sasmithoDesc;
    ctx.fillText(trimmedSasmitho, headerX + 14, movesY + 39);

    movesY += 58;
  }

  // ─── 7. WEAKNESS, RESISTANCE & RETREAT COST BAR (KOTAK ATRIBUT 3 KOLOM) ───
  const barY = movesY + 2;
  const barH = 70;

  // Outer container dengan kontras bingkai emas keraton yang tegas
  ctx.fillStyle = 'rgba(12, 17, 29, 0.96)';
  ctx.beginPath();
  ctx.roundRect(headerX, barY, headerW, barH, 10);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Subtle inner gold border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(headerX + 3, barY + 3, headerW - 6, barH - 6);

  const colW = headerW / 3;

  // Vertical gold divider lines between the 3 columns
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(headerX + colW, barY + 6);
  ctx.lineTo(headerX + colW, barY + barH - 6);
  ctx.moveTo(headerX + colW * 2, barY + 6);
  ctx.lineTo(headerX + colW * 2, barY + barH - 6);
  ctx.stroke();

  // Helper membedah & memformat teks atribut 3 kolom secara utuh & estetis tanpa terpotong '..'
  const parseAttrCol = (type, rawText) => {
    let raw = String(rawText || '').trim();
    if (type === 'weak') {
      // Format Lemah (Mawas Diri)
      if (/^paringkelan\s+/i.test(raw)) {
        // e.g. "Paringkelan Paningron: Iwak (Sato Kewan)"
        const cleaned = raw.replace(/^paringkelan\s+/i, '');
        const colonIdx = cleaned.indexOf(':');
        if (colonIdx !== -1) {
          const namePart = cleaned.substring(0, colonIdx).trim();
          let descPart = cleaned.substring(colonIdx + 1).trim();
          return {
            title: 'LEMAH (MAWAS DIRI)',
            line1: `⚠️ ${namePart}`,
            line2: descPart || 'Waspada Sato Kewan'
          };
        }
        return {
          title: 'LEMAH (MAWAS DIRI)',
          line1: `⚠️ ${cleaned}`,
          line2: 'Tansah Eling & Mawas'
        };
      }
      // Non-paringkelan raw sentence (e.g. preset wayang)
      const colonIdx = raw.indexOf(':');
      if (colonIdx !== -1) {
        return {
          title: 'LEMAH (MAWAS DIRI)',
          line1: `⚠️ ${raw.substring(0, colonIdx).trim()}`,
          line2: raw.substring(colonIdx + 1).trim()
        };
      }
      if (raw.length > 20) {
        const words = raw.split(' ');
        let l1 = '', l2 = '';
        for (const w of words) {
          if ((l1 + ' ' + w).trim().length <= 20) {
            l1 = (l1 + ' ' + w).trim();
          } else {
            l2 = (l2 + ' ' + w).trim();
          }
        }
        return {
          title: 'LEMAH (MAWAS DIRI)',
          line1: `⚠️ ${l1}`,
          line2: l2 || 'Waspada Diri'
        };
      }
      return {
        title: 'LEMAH (MAWAS DIRI)',
        line1: `⚠️ ${raw || 'Waspada Diri'}`,
        line2: 'Tansah Eling & Mawas'
      };
    }

    if (type === 'hoki') {
      // Format Kebal (Arah Hoki)
      let s = raw.replace(/^Arah\s*/i, '').trim();
      const matchParen = s.match(/^(.*?)\s*\((.*?)\)$/);
      if (matchParen) {
        return {
          title: 'KEBAL (ARAH HOKI)',
          line1: `🧭 ${matchParen[1].trim()}`,
          line2: matchParen[2].trim()
        };
      }
      return {
        title: 'KEBAL (ARAH HOKI)',
        line1: `🧭 ${s || 'Kulon / Barat'}`,
        line2: 'Energi Rahayu'
      };
    }

    if (type === 'sirik') {
      // Format Sirikan Lawang
      let s = raw.replace(/^Hindari pintu utama menghadap langsung ke arah\s*/i, '')
                 .replace(/^Hindari pintu utama menghadap\s*/i, '')
                 .replace(/^Hindari menghadap\s*/i, '')
                 .replace(/^Arah\s*/i, '')
                 .trim();
      if (/selatan/i.test(s) || /kidul/i.test(s)) {
        s = 'Kidul (Selatan)';
      } else if (/barat daya/i.test(s) || /kulon kidul/i.test(s)) {
        s = 'Kulon Kidul (Barat Daya)';
      }
      return {
        title: 'SIRIKAN LAWANG',
        line1: `🚫 Adhep ${s || 'Kidul'}`,
        line2: 'Pantangan Lawang Omah'
      };
    }

    return { title: '', line1: raw, line2: '' };
  };

  const weakRaw = options.mawasDiri && sr.areaWaspada ? sr.areaWaspada : 'Paringkelan: Waspada Diri';
  const weakData = parseAttrCol('weak', weakRaw);

  const hokiRaw = options.arahHoki && sr.arahHoki ? sr.arahHoki : 'Kulon / Barat (Ketenteraman)';
  const hokiData = parseAttrCol('hoki', hokiRaw);

  const sirikRaw = sr.sirikanRumah || 'Hindari pintu utama menghadap langsung ke arah Selatan';
  const sirikData = parseAttrCol('sirik', sirikRaw);

  const drawAttrBox = (colIndex, titleColor, attrObj) => {
    const cx = headerX + colW * (colIndex + 0.5);
    ctx.textAlign = 'center';

    // Header Kolom
    ctx.fillStyle = titleColor;
    ctx.font = 'bold 9.5px sans-serif';
    ctx.fillText(attrObj.title, cx, barY + 18);

    // Baris 1 Nilai Utama (Auto-fit font size)
    ctx.fillStyle = '#ffffff';
    let l1Font = 10.5;
    ctx.font = `bold ${l1Font}px sans-serif`;
    const maxValW = colW - 24;
    if (typeof ctx.measureText === 'function') {
      while (l1Font > 8.5 && ctx.measureText(attrObj.line1).width > maxValW) {
        l1Font -= 0.5;
        ctx.font = `bold ${l1Font}px sans-serif`;
      }
    }
    ctx.fillText(attrObj.line1, cx, barY + 38);

    // Baris 2 Keterangan / Detail Utuh (Auto-fit font size)
    ctx.fillStyle = '#cbd5e1';
    let l2Font = 9.5;
    ctx.font = `${l2Font}px sans-serif`;
    if (typeof ctx.measureText === 'function') {
      while (l2Font > 7.5 && ctx.measureText(attrObj.line2).width > maxValW) {
        l2Font -= 0.5;
        ctx.font = `${l2Font}px sans-serif`;
      }
    }
    ctx.fillText(attrObj.line2, cx, barY + 54);
  };

  drawAttrBox(0, '#f87171', weakData);
  drawAttrBox(1, '#38bdf8', hokiData);
  drawAttrBox(2, '#fbbf24', sirikData);

  // ─── 8. FLAVOR TEXT BOX (WEJANGAN LUHUR & FAALAKIAH) ───
  const flavorY = barY + barH + 12;
  const flavorH = 68;

  if (options.pitutur) {
    // Background sogan tua keraton dengan bingkai emas ganda
    ctx.fillStyle = 'rgba(26, 20, 16, 0.95)';
    ctx.beginPath();
    ctx.roundRect(headerX, flavorY, headerW, flavorH, 10);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Garis aksen emas dalam
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(headerX + 3, flavorY + 3, headerW - 6, flavorH - 6);

    // Ornamen wajik emas pojok
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.font = '9px serif';
    ctx.textAlign = 'left';
    ctx.fillText('❖', headerX + 8, flavorY + 16);
    ctx.textAlign = 'right';
    ctx.fillText('❖', headerX + headerW - 8, flavorY + 16);

    // Teks Wejangan
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 12.5px serif';
    const quote = sr.faalRingkas || 'Memayu hayuning bawana, tansah eling lan waspada, lebur dening pangastuti.';
    const trimmedQuote = quote.length > 115 ? quote.substring(0, 112) + '...' : quote;
    ctx.fillText(`"${trimmedQuote}"`, width / 2, flavorY + 30);

    // Subtitle wejangan
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10.5px monospace';
    ctx.fillText('— Wejangan Faalakiah & Budaya Luhur Nusantara —', width / 2, flavorY + 52);
  }

  // ─── 9. COLLECTOR FOOTER & SERIAL ───
  const footY = height - innerMargin - 16;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('★★★★★  PUSAKA KERATON (ULTRA RARE)', headerX, footY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px monospace';
  const serialNo = `#JJ-${String(wukuNo).padStart(2, '0')}/${String(neptu).padStart(2, '0')}`;
  ctx.fillText(`${serialNo} · ILLUS. JAGAD JAWA STUDIO · © 2026`, headerX + headerW, footY);
  if (typeof ctx.restore === 'function') {
    ctx.restore();
  }
}

/**
 * Preset arketipe karakter pewayangan Jawa untuk generator draf kartu koleksi.
 */
export const KARTU_KARAKTER_PRESETS = {
  harjuna: {
    nama: 'Raden Harjuna (Janaka)',
    dino: 'Minggu',
    pas: 'Legi',
    neptu: 10,
    wukuNo: 1,
    wukuName: 'Sinta',
    aksaraJawa: 'ꦲꦂꦗꦸꦤ',
    pwk: {
      no_wuku: 1,
      nama_wuku: 'Sinta',
      dewane: 'Sang Hyang Yamadipati',
      pohon: 'Kendayakan',
      burung: 'Gagak',
      watak_budi_pangerti: 'Kukuh tekade, resik atine, setya marang janjine'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Pinandhita (Danurdara Wicaksana)',
      kekuatanUtama: ['Panah Pasopati', 'Ajian Sepi Angin'],
      areaWaspada: 'Gampang lena marang kasmaran',
      arahHoki: 'Kiblat Wetan (Timur)',
      sirikanRumah: 'Kaler (Utara)',
      faalRingkas: 'Suradira Jayaningrat Lebur Dening Pangastuti'
    }
  },
  werkudara: {
    nama: 'Raden Werkudara (Bima)',
    dino: 'Sabtu',
    pas: 'Kliwon',
    neptu: 17,
    wukuNo: 4,
    wukuName: 'Kurantil',
    aksaraJawa: 'ꦮꦼꦂꦏꦸꦢꦫ',
    pwk: {
      no_wuku: 4,
      nama_wuku: 'Kurantil',
      dewane: 'Sang Hyang Langsur',
      pohon: 'Ingas',
      burung: 'Prajurit',
      watak_budi_pangerti: 'Jujur, luhur budine, tan gigrig ing bebener'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Perkasa (Kukuh Tan Ginggang)',
      kekuatanUtama: ['Kuku Pancanakha', 'Gada Rujakpolo'],
      areaWaspada: 'Gampang duka yen dicedhaki lamis',
      arahHoki: 'Kiblat Kidul (Selatan)',
      sirikanRumah: 'Kulon (Barat)',
      faalRingkas: 'Datan Serik Lamun Ketaman, Datan Susah Lamun Kelangan'
    }
  },
  gatotkaca: {
    nama: 'Raden Gatotkaca',
    dino: 'Jumat',
    pas: 'Pahing',
    neptu: 15,
    wukuNo: 11,
    wukuName: 'Galungan',
    aksaraJawa: 'ꦒꦠꦺꦴꦠ꧀ꦏꦕ',
    pwk: {
      no_wuku: 11,
      nama_wuku: 'Galungan',
      dewane: 'Sang Hyang Kamajaya',
      pohon: 'Tangan',
      burung: 'Bido',
      watak_budi_pangerti: 'Satria pringgondani, setya marang nusa lan bangsa'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Gagah Prawira (Otot Kawat Balung Wesi)',
      kekuatanUtama: ['Kotang Antakusuma', 'Brajamusti'],
      areaWaspada: 'Waspada marang pusaka Kunta Wijayadanu',
      arahHoki: 'Kiblat Lor (Utara)',
      sirikanRumah: 'Kidul (Selatan)',
      faalRingkas: 'Becik Ketitik Ala Ketara'
    }
  },
  srikandi: {
    nama: 'Dewi Srikandi',
    dino: 'Rabu',
    pas: 'Wage',
    neptu: 11,
    wukuNo: 17,
    wukuName: 'Kuruwelut',
    aksaraJawa: 'ꦱꦿꦶꦏꦤ꧀ꦝꦶ',
    pwk: {
      no_wuku: 17,
      nama_wuku: 'Kuruwelut',
      dewane: 'Sang Hyang Wisnu',
      pohon: 'Parijatha',
      burung: 'Sepahan',
      watak_budi_pangerti: 'Prigel, tanggon, wasis ing ulah jemparing'
    },
    summaryRingkas: {
      tipeKarakter: 'Wanita Tama (Prajurit Luhur Ing Budi)',
      kekuatanUtama: ['Jemparing Kasetyan', 'Cakra Pamungkas'],
      areaWaspada: 'Aja kebacut emosi nalika nandhang pambudidaya',
      arahHoki: 'Kiblat Wetan (Timur)',
      sirikanRumah: 'Kulon (Barat)',
      faalRingkas: 'Sapa Sira Sapa Ingsun Tan Wurung Lebur Dening Kasunyatan'
    }
  },
  kresna: {
    nama: 'Prabu Sri Bathara Kresna',
    dino: 'Kamis',
    pas: 'Pon',
    neptu: 15,
    wukuNo: 20,
    wukuName: 'Medangkungan',
    aksaraJawa: 'ꦏꦽꦰ꧀ꦟ',
    pwk: {
      no_wuku: 20,
      nama_wuku: 'Medangkungan',
      dewane: 'Sang Hyang Basuki',
      pohon: 'Randu',
      burung: 'Podhang',
      watak_budi_pangerti: 'Wicaksana, ahli strategi, titising Betara Wisnu'
    },
    summaryRingkas: {
      tipeKarakter: 'Nata Wicaksana (Titising Betara Wisnu)',
      kekuatanUtama: ['Cakra Sudarsana', 'Kembang Wijayakusuma'],
      areaWaspada: 'Aja nganti kabotan momotan pamikir jagad',
      arahHoki: 'Pancer Tengah (Astakona)',
      sirikanRumah: 'Lor Kulon (Barat Laut)',
      faalRingkas: 'Memayu Hayuning Bawana'
    }
  }
};

/**
 * Menghasilkan draf baru kartu karakter berdasarkan preset arketipe atau kustom.
 * @param {string} [presetKey]
 * @returns {Object}
 */
export function generateDraftKartuKarakter(presetKey) {
  let key = presetKey;
  if (!key) {
    const sel = document.getElementById('pokemonCardPresetSelect');
    if (sel && sel.value) key = sel.value;
  }
  if (!key || !KARTU_KARAKTER_PRESETS[key]) {
    key = 'harjuna';
  }

  const presetData = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS[key]));

  // Jika pengguna sudah mengetik nama kustom di input atau Nujum
  const inputNama = document.getElementById('pokemonCardNamaInput');
  const userTyped = inputNama?.value?.trim();
  const nujumTyped = document.getElementById('namaKepribadian')?.value?.trim();

  if (userTyped && userTyped !== 'Raden Harjuna (Janaka)' && userTyped !== 'Raden Werkudara (Bima)') {
    presetData.nama = userTyped;
  } else if (nujumTyped && nujumTyped !== '-') {
    presetData.nama = nujumTyped;
  }

  _cachedNujumData = presetData;
  currentCardOptions.customNama = presetData.nama;

  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (canvas) {
    drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
  }

  if (inputNama) {
    inputNama.value = presetData.nama;
  }

  const sel = document.getElementById('pokemonCardPresetSelect');
  if (sel && sel.value !== key) {
    sel.value = key;
  }

  showToast(`Draf Kartu Karakter "${presetData.nama}" kasil digenerate! ✨`);
  return presetData;
}

/**
 * Buka modal interaktif Kartu Karakter Pusaka untuk Nujum.
 * @param {Object} [data] 
 */
export function openNujumPokemonCardModal(data) {
  if (!data) {
    if (_cachedNujumData) {
      data = _cachedNujumData;
    } else if (typeof window !== 'undefined' && window.lastCalculatedNujumData) {
      data = window.lastCalculatedNujumData;
    } else {
      data = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS.harjuna));
    }
  }

  // Nama Otomatis Sesuai Input Pengguna
  const userTyped = document.getElementById('namaKepribadian')?.value?.trim()
    || document.getElementById('nujumNama')?.value?.trim();
  if (userTyped && userTyped !== '-' && (!data.nama || data.nama === 'Raden Jagad Jawa' || data.nama === 'Raden Harjuna (Janaka)')) {
    data.nama = userTyped;
  }

  _cachedNujumData = data;

  const modal = document.getElementById('modalNujumPokemonCard');
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (!modal || !canvas) return;

  // Sinkronkan nama di input form
  const inputNama = document.getElementById('pokemonCardNamaInput');
  if (inputNama) {
    inputNama.value = data.nama || '';
  }
  currentCardOptions.customNama = data.nama || '';

  // Render awal kartu
  drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);

  // Sinkronkan seluruh checkbox opsi
  const chkMap = {
    chkPokNama: 'nama',
    chkPokTglLahir: 'tglLahir',
    chkPokWetonNeptu: 'wetonNeptu',
    chkPokWukuDewa: 'wukuDewa',
    chkPokTipeKarakter: 'tipeKarakter',
    chkPokKekuatan: 'kekuatan',
    chkPokMawasDiri: 'mawasDiri',
    chkPokArahHoki: 'arahHoki',
    chkPokShioZodiak: 'shioZodiak',
    chkPokElemenHari: 'elemenHari',
    chkPokPranata: 'pranataMangsa',
    chkPokSasmitho: 'sasmithoAlam',
    chkPokPitutur: 'pitutur'
  };
  for (const [id, optKey] of Object.entries(chkMap)) {
    const el = document.getElementById(id);
    if (el) el.checked = currentCardOptions[optKey] !== false;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Tutup modal Kartu Karakter Pusaka.
 */
export function closeNujumPokemonCardModal() {
  const modal = document.getElementById('modalNujumPokemonCard');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Handle perubahan checkbox atribut (Live instant redraw).
 * @param {string} key 
 * @param {boolean} checked 
 */
export function onNujumPokemonOptionChange(key, checked) {
  currentCardOptions[key] = Boolean(checked);
  if (!_cachedNujumData) {
    if (typeof window !== 'undefined' && window.lastCalculatedNujumData) {
      _cachedNujumData = window.lastCalculatedNujumData;
    } else {
      _cachedNujumData = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS.harjuna));
    }
  }
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (canvas && _cachedNujumData) {
    drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
  }
}

/**
 * Handle perubahan nama kustom pada kartu (Live instant redraw).
 * @param {string} val 
 */
export function onNujumPokemonNameInput(val) {
  currentCardOptions.customNama = val;
  if (!_cachedNujumData) {
    if (typeof window !== 'undefined' && window.lastCalculatedNujumData) {
      _cachedNujumData = window.lastCalculatedNujumData;
    } else {
      _cachedNujumData = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS.harjuna));
    }
  }
  _cachedNujumData.nama = val;
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (canvas && _cachedNujumData) {
    drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
  }
}

/**
 * Unduh kartu karakter sebagai file PNG resolusi tinggi dengan optimasi Mobile HP.
 */
export async function downloadNujumPokemonCardPng() {
  if (!_cachedNujumData) {
    if (typeof window !== 'undefined' && window.lastCalculatedNujumData) {
      _cachedNujumData = window.lastCalculatedNujumData;
    } else {
      _cachedNujumData = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS.harjuna));
    }
  }

  const cleanNama = (currentCardOptions.customNama || _cachedNujumData.nama || 'Pusaka')
    .replace(/[^a-zA-Z0-9]/g, '_');
  const dino = _cachedNujumData.dino || '';
  const pas = _cachedNujumData.pas || '';
  const filename = `Kartu-Karakter-Jawa-${cleanNama}-${dino}-${pas}-HD.png`;

  showToast('Nyiapaken gambar Kartu Karakter Ultra HD (Resolusi Dhuwur)... 🎨');

  // Render pada canvas off-screen beresolusi tinggi 3x (2250 x 3150 px)
  const exportCanvas = document.createElement('canvas');
  drawNujumPokemonCard(exportCanvas, _cachedNujumData, currentCardOptions, 3);

  await downloadCanvasAsPng(exportCanvas, filename, {
    title: `Kartu Karakter Pusaka — ${cleanNama}`,
    text: `Kartu Karakter Pusaka Jawa (${dino} ${pas}) — Jagad Jawa`
  });
}

/**
 * Cetak Dokumen PDF Resmi Kartu Karakter dengan kelengkapan detail selengkap unduhan PNG di PC.
 * @param {'parchment'|'monochrome'} [theme='parchment']
 */
export function printKartuKarakterPdf(theme = 'parchment') {
  if (!_cachedNujumData) {
    showToast('Data kartu dereng cumawis.');
    return;
  }

  const d = _cachedNujumData;
  const nama = (currentCardOptions.customNama || d.nama || 'SATRIA PINILIH').toUpperCase();
  const dino = d.dino || 'Minggu';
  const pas = d.pas || 'Legi';
  const neptu = d.neptu || 10;
  const wukuName = d.wukuName || d.pwk?.nama_wuku || 'Sinta';
  const wukuNo = d.wukuNo || d.pwk?.no_wuku || 1;
  const dewane = d.pwk?.dewane || 'Sang Hyang Yamadipati';
  const sr = d.summaryRingkas || {};
  const elemen = getElemenHari(pas, dino);
  const sasmitho = getSasmithoAlamWeton(dino, pas);
  const dayNum = parseInt(d.d, 10) || 1;
  const monthNum = parseInt(d.m, 10) || 1;
  const pranata = d.mangsaRes || getPranataMangsaLengkap(dayNum, monthNum);
  const isParchment = (theme === 'parchment');

  const printHtml = `
    <div style="font-family: 'Plus Jakarta Sans', Georgia, serif; max-width: 780px; margin: 0 auto; padding: 24px; color: ${isParchment ? '#2d1808' : '#111827'}; background: ${isParchment ? '#fcf8f0' : '#ffffff'}; border: 2px solid ${isParchment ? '#b87c24' : '#374151'}; border-radius: 12px;">
      
      <!-- Kop Dokumen Cetak Karakter Keraton -->
      <div style="text-align: center; border-bottom: 2px solid ${isParchment ? '#b87c24' : '#111827'}; padding-bottom: 12px; margin-bottom: 18px;">
        <div style="font-family: 'Cinzel Decorative', Georgia, serif; font-size: 15pt; font-weight: bold; letter-spacing: 0.12em; color: ${isParchment ? '#945c1a' : '#111827'};">
          JAGAD JAWA &bull; KASULTANAN NUSANTARA
        </div>
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-top: 3px;">
          SERAT KARTU KARAKTER PUSAKA JAWA
        </div>
        <div style="font-size: 8.5pt; font-style: italic; color: ${isParchment ? '#724117' : '#4b5563'};">
          Transkripsi Weton, Dewa Pelindung Wuku, Elemen Hari, Pranata Mangsa &amp; Sasmitho Alam
        </div>
      </div>

      <!-- Identitas & Parameter Pusaka -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
        <div style="padding: 10px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 8px; background: ${isParchment ? '#f6ecd2' : '#f9fafb'};">
          <div style="font-size: 8pt; text-transform: uppercase; font-weight: bold; color: ${isParchment ? '#724117' : '#6b7280'};">Nama Pemilik Pusaka</div>
          <div style="font-size: 14pt; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">${nama}</div>
          <div style="font-size: 8.5pt; margin-top: 4px; color: ${isParchment ? '#724117' : '#4b5563'};">
            <strong>Weton:</strong> ${dino} ${pas} &middot; <strong>HP / Neptu:</strong> ${neptu} &bull; 
            <strong>Shio:</strong> ${d.shioLahirRes?.namaShio || d.shioLahirRes?.shio || d.shio || sr.shio || '-'} &bull; 
            <strong>Zodiak Surya:</strong> ${d.zodiakRes?.nama || d.zodiak || sr.zodiak || (typeof getZodiakByDate === 'function' ? getZodiakByDate(dayNum, monthNum)?.nama : '') || '-'}
          </div>
        </div>
        <div style="padding: 10px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 8px; background: ${isParchment ? '#f6ecd2' : '#f9fafb'};">
          <div style="font-size: 8pt; text-transform: uppercase; font-weight: bold; color: ${isParchment ? '#724117' : '#6b7280'};">Dewa &amp; Kosmologi Wuku</div>
          <div style="font-size: 12pt; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">Wuku ${wukuName} (${wukuNo}/30)</div>
          <div style="font-size: 9pt; margin-top: 4px;"><strong>Dewa Pelindung:</strong> ${dewane}</div>
        </div>
      </div>

      <!-- Dua Kolom: Elemen Hari & Pranata Mangsa -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
        <div style="padding: 10px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 8px;">
          <div style="font-size: 8.5pt; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">
            ${elemen.simbol} ELEMEN HARI: ${elemen.label.toUpperCase()}
          </div>
          <div style="font-size: 8.5pt; color: ${isParchment ? '#724117' : '#4b5563'}; margin-top: 3px; line-height: 1.4;">
            ${elemen.filosofi}
          </div>
        </div>
        <div style="padding: 10px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 8px;">
          <div style="font-size: 8.5pt; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">
            🌾 PRANATA MANGSA: ${pranata.nama || 'MANGSA KASA'} (${pranata.musimTani || ''})
          </div>
          <div style="font-size: 8.5pt; color: ${isParchment ? '#724117' : '#4b5563'}; margin-top: 3px; line-height: 1.4;">
            <em>"${pranata.candrasangkala || '-'}"</em> &bull; ${pranata.pratandhaAlam || '-'}
          </div>
        </div>
      </div>

      <!-- Sasmitho Alam Weton -->
      <div style="padding: 10px; border: 1px solid ${isParchment ? '#b87c24' : '#9ca3af'}; border-radius: 8px; background: ${isParchment ? '#edd8a4' : '#f3f4f6'}; margin-bottom: 16px;">
        <div style="font-size: 9pt; font-weight: bold; color: ${isParchment ? '#945c1a' : '#111827'};">
          ${sasmitho.simbol} SASMITHO ALAM (${dino} ${pas}): ${sasmitho.swara.toUpperCase()} &mdash; ${sasmitho.surasa}
        </div>
        <div style="font-size: 8.5pt; color: ${isParchment ? '#724117' : '#374151'}; margin-top: 4px; line-height: 1.4;">
          <strong>Makna Titen:</strong> ${sasmitho.tegese}<br/>
          <strong>Paugeran Luhur:</strong> <em>${sasmitho.nasihat}</em>
        </div>
      </div>

      <!-- Kemampuan, Moves & Mawas Diri -->
      <div style="margin-bottom: 16px; border: 1px solid ${isParchment ? '#d5a140' : '#d1d5db'}; border-radius: 8px; overflow: hidden;">
        <div style="background: ${isParchment ? '#f6ecd2' : '#e5e7eb'}; padding: 6px 10px; font-size: 9pt; font-weight: bold;">
          JURUS KEKUATAN &amp; TITIK MAWAS DIRI
        </div>
        <div style="padding: 10px; font-size: 8.5pt; line-height: 1.5;">
          <div><strong>Kemampuan Utama:</strong> ${sr.tipeKarakter || 'Satria Luhur Budi'} &mdash; ${sr.deskripsiKarakter || 'Kukuh tekade, mikul dhuwur mendhem jero.'}</div>
          <div style="margin-top: 4px;"><strong>Jurus Potensi:</strong> ${Array.isArray(sr.kekuatanUtama) ? sr.kekuatanUtama.join(' &bull; ') : 'Kekuatan lahir batin'}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed ${isParchment ? '#d5a140' : '#e5e7eb'};">
            <div style="padding: 6px 8px; background: ${isParchment ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2'}; border-radius: 6px; border-left: 3px solid #ef4444; word-break: break-word;">
              <div style="font-size: 7.5pt; font-weight: bold; color: #dc2626;">LEMAH (MAWAS DIRI)</div>
              <div style="font-size: 8pt; margin-top: 2px; color: ${isParchment ? '#724117' : '#1f2937'};">${sr.areaWaspada || 'Tansah eling lan waspada'}</div>
            </div>
            <div style="padding: 6px 8px; background: ${isParchment ? 'rgba(14, 165, 233, 0.08)' : '#f0f9ff'}; border-radius: 6px; border-left: 3px solid #0284c7; word-break: break-word;">
              <div style="font-size: 7.5pt; font-weight: bold; color: #0284c7;">KEBAL (ARAH HOKI)</div>
              <div style="font-size: 8pt; margin-top: 2px; color: ${isParchment ? '#724117' : '#1f2937'};">${sr.arahHoki || 'Kulon / Barat'}</div>
            </div>
            <div style="padding: 6px 8px; background: ${isParchment ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb'}; border-radius: 6px; border-left: 3px solid #d97706; word-break: break-word;">
              <div style="font-size: 7.5pt; font-weight: bold; color: #d97706;">SIRIKAN LAWANG</div>
              <div style="font-size: 8pt; margin-top: 2px; color: ${isParchment ? '#724117' : '#1f2937'};">${sr.sirikanRumah || 'Adhep Kidul (Selatan)'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wejangan Faalakiah -->
      <div style="padding: 10px; border-left: 3px solid ${isParchment ? '#b87c24' : '#111827'}; background: ${isParchment ? '#f6ecd2' : '#f9fafb'}; font-size: 9pt; font-style: italic; margin-bottom: 20px;">
        "${sr.faalRingkas || 'Memayu hayuning bawana, suradira jayaningrat lebur dening pangastuti.'}"<br/>
        <span style="font-size: 8pt; font-style: normal; color: ${isParchment ? '#724117' : '#6b7280'};">&mdash; Wejangan Pitutur Faalakiah &amp; Kasultanan Jagad Jawa</span>
      </div>

      <!-- Kolofon & Cap Dokumen -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 8.5pt; border-top: 1px solid ${isParchment ? '#d5a140' : '#e5e7eb'}; padding-top: 8px;">
        <div>
          <span style="font-family: monospace; font-size: 7.5pt; color: ${isParchment ? '#724117' : '#6b7280'};">
            #JJ-${String(wukuNo).padStart(2, '0')}/${String(neptu).padStart(2, '0')} &bull; Aether Code Certified
          </span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold;">JAGAD JAWA ARCHIVAL STUDIO</div>
          <div style="font-size: 7.5pt; color: ${isParchment ? '#724117' : '#6b7280'};">Serat Resmi Koleksi Kartu Pusaka</div>
        </div>
      </div>

    </div>
  `;

  let printContainer = document.getElementById('laporan-cetak-pdf');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'laporan-cetak-pdf';
    printContainer.className = 'print-only-document';
    document.body.appendChild(printContainer);
  }
  printContainer.innerHTML = printHtml;

  const customTitle = `Jagad Jawa — Kartu Karakter ${nama} (${dino} ${pas})`;
  if (typeof window.printLaporan === 'function') {
    window.printLaporan(theme, customTitle);
  } else {
    window.print();
  }
}

/**
 * Bagikan kartu karakter via Web Share API atau WhatsApp.
 */
export async function shareNujumPokemonCard() {
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (!canvas || !_cachedNujumData) return;

  const nama = currentCardOptions.customNama || _cachedNujumData.nama || 'Satria Jawa';
  const weton = `${_cachedNujumData.dino || ''} ${_cachedNujumData.pas || ''}`;
  const neptu = _cachedNujumData.neptu || 10;
  const wuku = _cachedNujumData.wukuName || '';

  const title = `Kartu Karakter Pusaka — ${nama} (${weton})`;
  const text = `🎴 *KARTU KARAKTER PUSAKA JAWA* 🎴\n` +
    `👤 *Nama:* ${nama}\n` +
    `⚡ *HP / Neptu:* ${neptu} (${weton})\n` +
    `🪐 *Wuku:* ${wuku}\n` +
    `Cek kartu karakter lan nujum pribadimu ing:\nhttps://jagad-jawa.web.app`;

  // Coba bagikan file gambar jika browser mendukung
  if (navigator.canShare && canvas.toBlob) {
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          shareTextFallback(title, text);
          return;
        }
        const file = new File([blob], `Kartu-Karakter-${nama}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title,
              text,
              files: [file]
            });
            showToast('Kartu Karakter kasil dibagikaken! ✨');
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              shareTextFallback(title, text);
            }
            return;
          }
        }
        shareTextFallback(title, text);
      }, 'image/png');
    } catch {
      shareTextFallback(title, text);
    }
  } else {
    shareTextFallback(title, text);
  }
}

function shareTextFallback(title, text) {
  if (navigator.share) {
    navigator.share({ title, text })
      .then(() => showToast('Teks kartu kasil dibagikaken!'))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(text, 'Teks kartu disalin kanggé media sosial!');
        }
      });
  } else {
    copyToClipboard(text, 'Teks kartu disalin kanggé media sosial!');
  }
}

// ─── ALIAS RESMI BAHASA INDONESIA (KARTU KARAKTER) ───
export const drawKartuKarakter = drawNujumPokemonCard;
export const openKartuKarakterModal = openNujumPokemonCardModal;
export const closeKartuKarakterModal = closeNujumPokemonCardModal;
export const downloadKartuKarakterPng = downloadNujumPokemonCardPng;
export const shareKartuKarakter = shareNujumPokemonCard;
export const generateDraftCard = generateDraftKartuKarakter;

if (typeof window !== 'undefined') {
  window.drawNujumPokemonCard = drawNujumPokemonCard;
  window.openNujumPokemonCardModal = openNujumPokemonCardModal;
  window.closeNujumPokemonCardModal = closeNujumPokemonCardModal;
  window.downloadNujumPokemonCardPng = downloadNujumPokemonCardPng;
  window.shareNujumPokemonCard = shareNujumPokemonCard;
  window.onNujumPokemonOptionChange = onNujumPokemonOptionChange;
  window.onNujumPokemonNameInput = onNujumPokemonNameInput;
  window.printKartuKarakterPdf = printKartuKarakterPdf;

  window.drawKartuKarakter = drawKartuKarakter;
  window.openKartuKarakterModal = openKartuKarakterModal;
  window.closeKartuKarakterModal = closeKartuKarakterModal;
  window.downloadKartuKarakterPng = downloadKartuKarakterPng;
  window.shareKartuKarakter = shareKartuKarakter;
  window.generateDraftKartuKarakter = generateDraftKartuKarakter;
  window.generateDraftCard = generateDraftKartuKarakter;
  window.KARTU_KARAKTER_PRESETS = KARTU_KARAKTER_PRESETS;
  window.syncNujumCardData = syncNujumCardData;
  window.getCachedNujumData = getCachedNujumData;
}
