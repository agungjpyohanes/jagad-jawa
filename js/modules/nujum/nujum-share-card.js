/**
 * Jagad Jawa — Modul Domain: Kartu Karakter Pusaka Jawa
 * Men-generate kartu karakter koleksi berornamen Kasultanan Jawa modern:
 * Metallic gold frame, HP = Neptu, elemen pawukon, kemampuan/moves,
 * titik mawas diri (titik waspada), arah energi, dan pitutur luhur.
 */

import { showToast, copyToClipboard } from '../../ui/toast.js';

let _cachedNujumData = null;

const DEFAULT_OPTIONS = {
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
  customNama: ''
};

let currentCardOptions = { ...DEFAULT_OPTIONS };

/**
 * Menggambar Kartu Karakter Koleksi ke HTML5 Canvas.
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} data - Nujum calculation data
 * @param {Object} options - Toggles for attributes
 */
export function drawNujumPokemonCard(canvas, data, options = DEFAULT_OPTIONS) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 750;
  const height = 1050;
  canvas.width = width;
  canvas.height = height;

  const sr = data.summaryRingkas || {};
  const pwk = data.pwk || {};
  const neptu = data.neptu || 10;
  const wukuNo = data.wukuNo || (pwk.no_wuku ? parseInt(pwk.no_wuku) : 1);
  const wukuName = data.wukuName || pwk.nama_wuku || 'Sinta';
  const dewane = pwk.dewane || 'Batara Guru';
  const displayNama = (options.customNama || data.nama || 'Raden Jagad Jawa').trim();

  // ─── 1. BACKGROUND METALLIC & COSMIC KERATON ───
  // Outer frame gradient (Gold metallic sheen)
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
  const innerMargin = 22;
  const innerWidth = width - innerMargin * 2;
  const innerHeight = height - innerMargin * 2;

  const innerGrad = ctx.createLinearGradient(innerMargin, innerMargin, innerMargin, innerHeight);
  innerGrad.addColorStop(0, '#101524');
  innerGrad.addColorStop(0.3, '#141d30');
  innerGrad.addColorStop(0.7, '#19152b');
  innerGrad.addColorStop(1, '#090d15');
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
  const headerY = 56;
  const headerX = innerMargin + 18;
  const headerW = innerWidth - 36;

  // Stage indicator badge
  ctx.fillStyle = '#eedc9a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✦ EDISI PUSAKA KERATON · KARTU KOLEKSI NUSANTARA ✦', headerX, headerY - 14);

  // Header Box Bar
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.beginPath();
  ctx.roundRect(headerX, headerY - 5, headerW, 46, 12);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Nama Karakter
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'left';
  const nameToRender = options.nama ? displayNama : 'SATRIA PINILIH';
  const trimmedName = nameToRender.length > 22 ? nameToRender.substring(0, 20) + '...' : nameToRender;
  ctx.fillText(trimmedName.toUpperCase(), headerX + 16, headerY + 27);

  // HP = Neptu Pill
  if (options.wetonNeptu) {
    const hpX = headerX + headerW - 16;
    ctx.textAlign = 'right';

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('HP', hpX - 44, headerY + 26);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px serif';
    ctx.fillText(`${neptu}`, hpX, headerY + 28);

    // Energy / Jewel Symbol (Astakona gold gem)
    ctx.beginPath();
    ctx.arc(hpX + 12, headerY + 18, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // ─── 3. SUB-HEADER (ELEMENT & ZODIAK PILLS) ───
  let subY = headerY + 54;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';

  const typeParts = [];
  if (options.wetonNeptu) typeParts.push(`${data.dino || ''} ${data.pas || ''}`);
  if (options.wukuDewa) typeParts.push(`Wuku ${wukuName}`);
  if (options.shioZodiak && data.shioLahirRes) typeParts.push(`Shio ${data.shioLahirRes.namaShio || data.shioLahirRes.shio || ''}`);

  ctx.fillStyle = '#94a3b8';
  ctx.fillText(typeParts.join('  ·  ').toUpperCase(), headerX + 4, subY + 8);

  if (options.tglLahir && (sr.tglMasehiStr || data.tglJawaRes)) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cbd5e1';
    const tglDisplay = sr.tglMasehiStr || `${data.d}-${data.m}-${data.y}`;
    ctx.fillText(tglDisplay, headerX + headerW - 4, subY + 8);
  }

  // ─── 4. HERO PORTRAIT WINDOW (CREST & AKSARA JAWA) ───
  const artY = subY + 18;
  const artH = 220;
  const artW = headerW;

  // Outer Art Frame
  ctx.fillStyle = 'rgba(8, 12, 20, 0.95)';
  ctx.beginPath();
  ctx.roundRect(headerX, artY, artW, artH, 16);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glow radial center
  const radialGrad = ctx.createRadialGradient(width / 2, artY + artH / 2, 20, width / 2, artY + artH / 2, 160);
  radialGrad.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
  radialGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.4)');
  radialGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
  ctx.fillStyle = radialGrad;
  ctx.beginPath();
  ctx.roundRect(headerX + 4, artY + 4, artW - 8, artH - 8, 12);
  ctx.fill();

  // Safe portrait image rendering (Wayang / Avatar) with guaranteed fallback
  let imageRendered = false;
  const avatarImg = data.avatarImage || data.wayangImage || data.cardImage;
  if (!options.noExternalImages && avatarImg && (typeof avatarImg === 'object' && avatarImg.complete && avatarImg.naturalWidth > 0)) {
    try {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(headerX + 8, artY + 8, artW - 16, artH - 42, 10);
      ctx.clip();
      ctx.drawImage(avatarImg, width / 2 - 80, artY + 12, 160, artH - 50);
      ctx.restore();
      imageRendered = true;
    } catch (e) {
      imageRendered = false;
    }
  }

  if (!imageRendered) {
    // Mandala / Astakona ring behind aksara
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width / 2, artY + artH / 2 - 12, 68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, artY + artH / 2 - 12, 76, 0, Math.PI * 2);
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Aksara Jawa Monogram
    const aksara = data.aksaraJawa || 'ꦗꦒꦢ꧀ꦗꦮ';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Tuladha Jejeg", "Javanese Text", serif';
    ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
    ctx.shadowBlur = 14;
    ctx.fillText(aksara, width / 2, artY + artH / 2 - 2);
    ctx.shadowBlur = 0; // reset glow
  }

  // Weton banner inside art
  ctx.fillStyle = '#eedc9a';
  ctx.font = 'bold 18px serif';
  const wetonLabel = options.wetonNeptu ? `✦ ${data.dino || ''} ${data.pas || ''} ✦` : '✦ JAGAD JAWA ✦';
  ctx.fillText(wetonLabel, width / 2, artY + artH / 2 + 38);

  // Metadata strip on bottom of art
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(headerX + 1, artY + artH - 30, artW - 2, 29);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(headerX, artY + artH - 30);
  ctx.lineTo(headerX + artW, artY + artH - 30);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  const bannerInfo = `DEWANE: ${dewane.toUpperCase()}  ·  WUKU: ${wukuName.toUpperCase()} (${wukuNo}/30)  ·  NEPTU: ${neptu}`;
  ctx.fillText(bannerInfo, width / 2, artY + artH - 11);

  // ─── 5. ABILITIES & MOVES SECTION ───
  let movesY = artY + artH + 16;

  // Ability 1: Tipe Karakter Utama (Passive Ability)
  if (options.tipeKarakter && sr.tipeKarakter) {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.beginPath();
    ctx.roundRect(headerX, movesY, headerW, 64, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`★ KEMAMPUAN UTAMA: ${sr.tipeKarakter.toUpperCase()}`, headerX + 14, movesY + 22);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    const desc = sr.deskripsiKarakter || 'Watak budi luhur, mikul dhuwur mendhem jero.';
    const trimmedDesc = desc.length > 88 ? desc.substring(0, 85) + '...' : desc;
    ctx.fillText(trimmedDesc, headerX + 14, movesY + 44);

    movesY += 74;
  }

  // Moves / Jurus Kekuatan Utama
  if (options.kekuatan && Array.isArray(sr.kekuatanUtama) && sr.kekuatanUtama.length > 0) {
    const moveCount = Math.min(sr.kekuatanUtama.length, 2);
    for (let i = 0; i < moveCount; i++) {
      const moveName = sr.kekuatanUtama[i];
      const movePower = neptu * (10 - i * 2);

      ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.beginPath();
      ctx.roundRect(headerX, movesY, headerW, 46, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Energy icon
      ctx.beginPath();
      ctx.arc(headerX + 22, movesY + 23, 10, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#10b981' : '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(i === 0 ? '⚔' : '✦', headerX + 22, movesY + 27);

      // Move Name
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px serif';
      ctx.fillText(moveName, headerX + 42, movesY + 28);

      // Power Damage
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${movePower}`, headerX + headerW - 16, movesY + 29);

      movesY += 52;
    }
  }

  // ─── 6. WEAKNESS, RESISTANCE & RETREAT COST BAR ───
  const barY = movesY + 4;
  const barH = 50;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(headerX, barY, headerW, barH, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const colW = headerW / 3;

  // Weakness (Titik Mawas Diri)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('LEMAH (WAWAS DIRI)', headerX + colW * 0.5, barY + 18);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px sans-serif';
  const weakText = options.mawasDiri && sr.areaWaspada ? (sr.areaWaspada.length > 20 ? sr.areaWaspada.substring(0, 18) + '..' : sr.areaWaspada) : 'Waspada x2';
  ctx.fillText(`⚠️ ${weakText}`, headerX + colW * 0.5, barY + 36);

  // Resistance (Arah Hoki)
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('KEBAL (ARAH HOKI)', headerX + colW * 1.5, barY + 18);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px sans-serif';
  const hokiText = options.arahHoki && sr.arahHoki ? sr.arahHoki : 'Kilen / Kulon';
  ctx.fillText(`🧭 ${hokiText}`, headerX + colW * 1.5, barY + 36);

  // Retreat / Sirikan
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('SIRIKAN LAWANG', headerX + colW * 2.5, barY + 18);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px sans-serif';
  const sirikText = sr.sirikanRumah || 'Kaler / Lor';
  ctx.fillText(`🚫 ${sirikText}`, headerX + colW * 2.5, barY + 36);

  // ─── 7. FLAVOR TEXT BOX (PITUTUR / FAAL) ───
  const flavorY = barY + barH + 10;
  const flavorH = 68;

  if (options.pitutur) {
    ctx.fillStyle = 'rgba(28, 25, 23, 0.85)';
    ctx.beginPath();
    ctx.roundRect(headerX, flavorY, headerW, flavorH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde68a';
    ctx.font = 'italic 12px serif';
    const quote = sr.faalRingkas || 'Memayu hayuning bawana, tansah eling lan waspada, lebur dening pangastuti.';
    const trimmedQuote = quote.length > 115 ? quote.substring(0, 112) + '...' : quote;
    ctx.fillText(`"${trimmedQuote}"`, width / 2, flavorY + 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('— Wejangan Faalakiah & Budaya Luhur Nusantara', width / 2, flavorY + 50);
  }

  // ─── 8. COLLECTOR FOOTER & SERIAL ───
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
      dewane: 'Batara Yamadipati',
      pohon: 'Kendayakan',
      burung: 'Gagak',
      watak_budi_pangerti: 'Kukuh tekade, resik atine, setya marang janjine'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Pinandhita (Danurdara Wicaksana)',
      kekuatanUtama: 'Panah Pasopati: Konsentrasi mutlak nembus sakabehing godha rencana',
      titikMawasDiri: 'Gampang lena marang kasmaran, kudu tansah eling lan waspada',
      arahKeberuntungan: 'Kiblat Wetan (Timur) & Pancer Tengah',
      kutipanPitutur: 'Suradira Jayaningrat Lebur Dening Pangastuti'
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
      dewane: 'Batara Langsur',
      pohon: 'Ingas',
      burung: 'Prajurit',
      watak_budi_pangerti: 'Jujur, luhur budine, tan gigrig ing bebener'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Perkasa (Kukuh Tan Ginggang)',
      kekuatanUtama: 'Kuku Pancanakha & Gada Rujakpolo: Karosan tanpa tanding, adil ing bebener',
      titikMawasDiri: 'Gampang duka yen dicedhaki lamis, perbanyak sabar narima',
      arahKeberuntungan: 'Kiblat Kidul (Selatan) & Kulon (Barat)',
      kutipanPitutur: 'Datan Serik Lamun Ketaman, Datan Susah Lamun Kelangan'
    }
  },
  gatotkaca: {
    nama: 'Raden Gatotkaca',
    dino: 'Jumat',
    pas: 'Paing',
    neptu: 15,
    wukuNo: 11,
    wukuName: 'Galungan',
    aksaraJawa: 'ꦒꦠꦺꦴꦠ꧀ꦏꦕ',
    pwk: {
      no_wuku: 11,
      nama_wuku: 'Galungan',
      dewane: 'Batara Kamajaya',
      pohon: 'Tangan',
      burung: 'Bido',
      watak_budi_pangerti: 'Satria pringgondani, setya marang nusa lan bangsa'
    },
    summaryRingkas: {
      tipeKarakter: 'Satria Gagah Prawira (Otot Kawat Balung Wesi)',
      kekuatanUtama: 'Kotang Antakusuma & Brajamusti: Mabur tanpa swiwi, benteng rahayu nagara',
      titikMawasDiri: 'Waspada marang pusaka Kunta Wijayadanu ing wanci wengi',
      arahKeberuntungan: 'Kiblat Lor (Utara) & Angkasa Pancer',
      kutipanPitutur: 'Becik Ketitik Ala Ketara'
    }
  },
  srikandi: {
    nama: 'Dewi Srikandi',
    dino: 'Rebo',
    pas: 'Wage',
    neptu: 11,
    wukuNo: 17,
    wukuName: 'Kuruwelut',
    aksaraJawa: 'ꦱꦿꦶꦏꦤ꧀ꦝꦶ',
    pwk: {
      no_wuku: 17,
      nama_wuku: 'Kuruwelut',
      dewane: 'Batara Wisnu',
      pohon: 'Parijatha',
      burung: 'Sepahan',
      watak_budi_pangerti: 'Prigel, tanggon, wasis ing ulah jemparing'
    },
    summaryRingkas: {
      tipeKarakter: 'Wanita Tama (Prajurit Luhur Ing Budi)',
      kekuatanUtama: 'Jemparing Kasetyan: Prigel, lantip panggraitane lan kendel ing prang',
      titikMawasDiri: 'Aja kebacut emosi nalika nandhang pambudidaya',
      arahKeberuntungan: 'Kiblat Wetan (Timur) & Kidul (Selatan)',
      kutipanPitutur: 'Sapa Sira Sapa Ingsun Tan Wurung Lebur Dening Kasunyatan'
    }
  },
  kresna: {
    nama: 'Prabu Sri Bathara Kresna',
    dino: 'Kemis',
    pas: 'Pon',
    neptu: 15,
    wukuNo: 20,
    wukuName: 'Mada',
    aksaraJawa: 'ꦏꦽꦰ꧀ꦟ',
    pwk: {
      no_wuku: 20,
      nama_wuku: 'Mada',
      dewane: 'Batara Bayu',
      pohon: 'Randu',
      burung: 'Podhang',
      watak_budi_pangerti: 'Wicaksana, ahli strategi, titising Betara Wisnu'
    },
    summaryRingkas: {
      tipeKarakter: 'Nata Wicaksana (Titising Betara Wisnu)',
      kekuatanUtama: 'Senjata Cakra Sudarsana & Kembang Wijayakusuma: Panyinaran gaib & strategi ulung',
      titikMawasDiri: 'Aja nganti kabotan momotan pamikir marang nasib jagad',
      arahKeberuntungan: 'Pancer Tengah & Sedulur Papat Kiblat Lima',
      kutipanPitutur: 'Memayu Hayuning Bawana'
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

  // Jika pengguna sudah mengetik nama kustom di input
  const inputNama = document.getElementById('pokemonCardNamaInput');
  if (inputNama && inputNama.value.trim() && inputNama.value.trim() !== 'Raden Harjuna' && inputNama.value.trim() !== 'Raden Werkudara (Bima)') {
    presetData.nama = inputNama.value.trim();
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
      // Default fallback profil satria Jawa Harjuna dari presets
      data = JSON.parse(JSON.stringify(KARTU_KARAKTER_PRESETS.harjuna));
    }
  }

  _cachedNujumData = data;

  const modal = document.getElementById('modalNujumPokemonCard');
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (!modal || !canvas) return;

  // Sinkronkan nama
  const inputNama = document.getElementById('pokemonCardNamaInput');
  if (inputNama) {
    inputNama.value = data.nama || '';
  }
  currentCardOptions.customNama = data.nama || '';

  // Render awal kartu
  drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);

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
 * Handle perubahan checkbox atribut.
 * @param {string} key 
 * @param {boolean} checked 
 */
export function onNujumPokemonOptionChange(key, checked) {
  currentCardOptions[key] = checked;
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (canvas && _cachedNujumData) {
    drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
  }
}

/**
 * Handle perubahan nama kustom pada kartu.
 * @param {string} val 
 */
export function onNujumPokemonNameInput(val) {
  currentCardOptions.customNama = val;
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (canvas && _cachedNujumData) {
    drawNujumPokemonCard(canvas, _cachedNujumData, currentCardOptions);
  }
}

/**
 * Unduh kartu karakter sebagai file PNG resolusi tinggi.
 */
export function downloadNujumPokemonCardPng() {
  const canvas = document.getElementById('nujumPokemonCardCanvas');
  if (!canvas || !_cachedNujumData) return;

  try {
    const cleanNama = (currentCardOptions.customNama || _cachedNujumData.nama || 'Pusaka')
      .replace(/[^a-zA-Z0-9]/g, '_');
    const dino = _cachedNujumData.dino || '';
    const pas = _cachedNujumData.pas || '';

    let dataUrl;
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (taintErr) {
      console.warn('Canvas tainted by external resource, redraw with vector fallback:', taintErr);
      drawNujumPokemonCard(canvas, _cachedNujumData, { ...currentCardOptions, noExternalImages: true });
      dataUrl = canvas.toDataURL('image/png');
    }

    const link = document.createElement('a');
    link.download = `Kartu-Karakter-Jawa-${cleanNama}-${dino}-${pas}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Kartu Karakter kasil diunduh minangka gambar PNG! ✨');
  } catch (err) {
    console.error('Download error:', err);
    showToast('Gagal ngundhuh gambar kartu. Mangga cobi malih.', 'error');
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
            showToast('Kartu Karakter kasil dibagikaken!');
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

  window.drawKartuKarakter = drawKartuKarakter;
  window.openKartuKarakterModal = openKartuKarakterModal;
  window.closeKartuKarakterModal = closeKartuKarakterModal;
  window.downloadKartuKarakterPng = downloadKartuKarakterPng;
  window.shareKartuKarakter = shareKartuKarakter;
  window.generateDraftKartuKarakter = generateDraftKartuKarakter;
  window.generateDraftCard = generateDraftKartuKarakter;
  window.KARTU_KARAKTER_PRESETS = KARTU_KARAKTER_PRESETS;
}
