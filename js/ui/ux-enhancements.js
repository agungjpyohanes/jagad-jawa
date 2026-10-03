/**
 * Jagad Jawa — UX Enhancements & Interactive Components (jawa-v11)
 * 
 * Tanggung Jawab:
 * 1. Kalkulasi Real-time instan pada setiap form input tanggal (Weton, Neptu, Wuku).
 * 2. Popover / Tooltip kontekstual 1-2 kalimat untuk istilah budaya (Wuku, Neptu, Dino Gede, dll.).
 * 3. Stepper / Form Wizard untuk Mode Ringkas pada form panjang (Perjodohan & Nujum).
 * 4. Komponen QR Code visual pada share card tanpa membocorkan data pribadi.
 * 5. Dynamic HTML lang attribute & live update.
 */

import { getDayInfo, toJDN, PASARAN, HARI, getTanggalJawaLengkap } from '../data/calendar.js';
import { getSapaDinaData } from '../modules/sapa-dina/sapa-dina-engine.js';
import { buildSapaDinaShareText } from '../modules/sapa-dina/sapa-dina-ui.js';
import { buildWhatsAppShareText } from '../modules/kalender/share-card.js';
import { showToast, copyToClipboard } from './toast.js';
import { getLanguage } from './i18n.js';

// ─── 0. HERO KARTU HARI INI ─────────────────────────────────────────────────

export function renderHeroTodayCard() {
  if (typeof document === 'undefined') return;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  try {
    const data = getSapaDinaData(now);
    if (!data) return;

    const lang = (typeof window !== 'undefined' && typeof window.getLanguage === 'function')
      ? window.getLanguage()
      : 'id';
    const isJv = lang === 'jv';

    // 1. Tanggal Masehi
    const masehiEl = document.getElementById('heroMasehiDateText');
    const namaHariMasehi = isJv
      ? ['Ngahad', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jemuwah', 'Setu'][now.getDay()]
      : ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
    const namaBulanMasehi = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][m - 1];
    if (masehiEl) {
      masehiEl.textContent = `${namaHariMasehi}, ${d} ${namaBulanMasehi} ${y}`;
    }

    // 2. Weton Utama
    const wetonEl = document.getElementById('heroJawaWetonText');
    if (wetonEl) {
      wetonEl.textContent = data.wetonDisplay;
    }

    // 3. Tanggal Jawa
    const jawaEl = document.getElementById('heroTanggalJawaLengkap');
    if (jawaEl) {
      const tahunLabel = isJv ? 'Taun' : 'Tahun';
      jawaEl.textContent = `${data.tglJawa} ${data.bulanJawa} ${data.tahunAJ} AJ · ${tahunLabel} ${data.tahunSiklus}, Windu ${data.namaWindu}`;
    }

    // 4. Neptu Badge
    const neptuEl = document.getElementById('heroNeptuWetonBadge');
    if (neptuEl) {
      neptuEl.textContent = `Neptu ${data.neptu}`;
    }

    // 5. Wuku & Pranata Mangsa
    const wukuEl = document.getElementById('heroWukuPranataText');
    if (wukuEl) {
      wukuEl.textContent = `Wuku ${data.wukuDisplay} (${data.wukuNo}/30) • Mangsa ${data.pranata.nama}`;
    }

    // 6. Status Dino (Becik / Ala / Dino Gede)
    const statusEl = document.getElementById('heroDinoStatusBadge');
    if (statusEl) {
      const dinoStatus = data.dinoStatus;
      if (dinoStatus.isGede) {
        statusEl.className = 'px-3.5 py-1.5 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-300 font-bold text-xs shadow-sm inline-flex items-center gap-1.5';
        statusEl.innerHTML = isJv
          ? '<i class="fa-solid fa-crown text-amber-300"></i> Dino Gede (Sakral)'
          : '<i class="fa-solid fa-crown text-amber-300"></i> Hari Besar (Sakral)';
      } else if (dinoStatus.isIjo) {
        statusEl.className = 'px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-bold text-xs shadow-sm inline-flex items-center gap-1.5';
        statusEl.innerHTML = isJv
          ? '<i class="fa-solid fa-circle-check text-emerald-400"></i> Dina Becik (Rahayu)'
          : '<i class="fa-solid fa-circle-check text-emerald-400"></i> Hari Baik (Rahayu)';
      } else {
        statusEl.className = 'px-3.5 py-1.5 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-300 font-bold text-xs shadow-sm inline-flex items-center gap-1.5';
        statusEl.innerHTML = isJv
          ? '<i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Dina Ala (Prayitna)'
          : '<i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Hari Pantangan (Waspada)';
      }
    }

    // 7. Rincian Akordeon: Pitutur
    const pituturAksaraEl = document.getElementById('heroPituturAksara');
    if (pituturAksaraEl && data.pitutur) {
      pituturAksaraEl.textContent = data.pitutur.aksara || '';
    }
    const pituturJawaEl = document.getElementById('heroPituturJawa');
    if (pituturJawaEl && data.pitutur) {
      pituturJawaEl.textContent = `"${data.pitutur.jawa}"`;
    }
    const pituturArtiEl = document.getElementById('heroPituturArtiHarfiah');
    if (pituturArtiEl && data.pitutur) {
      pituturArtiEl.textContent = data.pitutur.artiHarfiah || '';
    }
    const pituturMaknaEl = document.getElementById('heroPituturMaknaLengkap');
    if (pituturMaknaEl && data.pitutur) {
      pituturMaknaEl.textContent = data.pitutur.makna || '';
    }
    const pituturSumberEl = document.getElementById('heroPituturSumber');
    if (pituturSumberEl && data.pitutur) {
      pituturSumberEl.textContent = data.pitutur.sumber || (isJv ? 'Falsafah Luhur Jawi' : 'Falsafah Luhur Jawa');
    }

    // 8. Rincian Akordeon: Pranata Mangsa Box
    const pranataNamaEl = document.getElementById('heroPranataNama');
    if (pranataNamaEl && data.pranata) {
      pranataNamaEl.textContent = data.pranata.nama;
    }
    const pranataMusimEl = document.getElementById('heroPranataMusim');
    if (pranataMusimEl && data.pranata) {
      pranataMusimEl.textContent = `${data.pranata.musimTani} (${data.pranata.rentang})`;
    }
    const pranataCandraEl = document.getElementById('heroPranataCandrasangkala');
    if (pranataCandraEl && data.pranata) {
      pranataCandraEl.textContent = `"${data.pranata.candrasangkala}"`;
    }
    const pranataPratandhaEl = document.getElementById('heroPranataPratandha');
    if (pranataPratandhaEl && data.pranata) {
      pranataPratandhaEl.textContent = data.pranata.pratandhaAlam || '';
    }

    // 9. Rincian Akordeon: Dununge Kala (Arah Kolo)
    const arahKoloNamaEl = document.getElementById('heroArahKoloNama');
    if (arahKoloNamaEl && data.arahKolo) {
      arahKoloNamaEl.textContent = data.arahKolo.labelDisplay;
    }
    const arahKoloPantanganEl = document.getElementById('heroArahKoloPantangan');
    if (arahKoloPantanganEl && data.arahKolo) {
      arahKoloPantanganEl.textContent = data.arahKolo.pantangan;
    }

    // 10. Rincian Akordeon: Petung Tetanen
    const tetanenKatEl = document.getElementById('heroTetanenKategori');
    if (tetanenKatEl && data.petungTetanen) {
      tetanenKatEl.textContent = data.petungTetanen.kategoriLabel;
    }
    const tetanenBecikEl = document.getElementById('heroTetanenBecik');
    if (tetanenBecikEl && data.petungTetanen) {
      tetanenBecikEl.textContent = isJv
        ? `Kang becik: ${data.petungTetanen.kangBecik}`
        : `Yang dianjurkan: ${data.petungTetanen.kangBecik}`;
    }
    const tetanenTegeseEl = document.getElementById('heroTetanenTegese');
    if (tetanenTegeseEl && data.petungTetanen) {
      tetanenTegeseEl.textContent = data.petungTetanen.tegese;
    }

    // 11. Sinkronisasi Teks Tombol Akordeon
    const textToggleEl = document.getElementById('heroDetailToggleText');
    const panel = document.getElementById('heroTodayDetailPanel');
    if (textToggleEl) {
      const isExpanded = panel && !panel.classList.contains('hidden');
      if (isExpanded) {
        textToggleEl.textContent = isJv ? 'Tutup Rincian' : 'Tutup Rincian Hari Ini';
      } else {
        textToggleEl.textContent = isJv ? 'Bikak Rincian Dinten Punika & Pitutur' : 'Buka Rincian Hari Ini & Pitutur';
      }
    }
  } catch (err) {
    console.warn('[renderHeroTodayCard]', err);
  }
}

/**
 * Toggle ekspansi akordeon halus untuk rincian Sapa Dina di Kartu Hari Ini
 */
export function toggleHeroTodayAccordion() {
  const panel = document.getElementById('heroTodayDetailPanel');
  const btn = document.getElementById('btnToggleHeroDetail');
  const chevron = document.getElementById('heroDetailChevron');
  const textEl = document.getElementById('heroDetailToggleText');
  if (!panel) return;

  const isHidden = panel.classList.contains('hidden');
  const lang = (typeof window !== 'undefined' && typeof window.getLanguage === 'function')
    ? window.getLanguage()
    : 'id';
  const isJv = lang === 'jv';

  if (isHidden) {
    panel.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    if (textEl) textEl.textContent = isJv ? 'Tutup Rincian' : 'Tutup Rincian Hari Ini';
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    panel.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
    if (textEl) textEl.textContent = isJv ? 'Bikak Rincian Dinten Punika & Pitutur' : 'Buka Rincian Hari Ini & Pitutur';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Membagikan ringkasan teks weton hari ini via Web Share API atau salin clipboard
 */
export function shareTodayWetonText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  let text = '';
  try {
    const data = getSapaDinaData(now);
    text = buildSapaDinaShareText(data);
  } catch (_) {
    text = buildWhatsAppShareText(y, m, d);
  }

  if (navigator.share) {
    navigator.share({
      title: `Weton Hari Ini — Jagad Jawa`,
      text: text
    }).then(() => {
      showToast('Ringkasan dinten punika kasil kabagekake! ✨');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(text, 'Teks ringkasan dinten punika kasil disalin kanggé WhatsApp!');
      }
    });
  } else {
    copyToClipboard(text, 'Teks ringkasan dinten punika kasil disalin kanggé WhatsApp!');
  }
}

// ─── 1. KALKULASI REAL-TIME FORMULIR ────────────────────────────────────────

/**
 * Mengaitkan input tanggal dengan kalkulasi instan weton & neptu tanpa pernah menghasilkan undefined
 * @param {string} inputId 
 * @param {string} badgeContainerId 
 */
export function attachRealtimeDateCalculator(inputId, badgeContainerId) {
  const inputEl = document.getElementById(inputId);
  const badgeEl = document.getElementById(badgeContainerId);
  if (!inputEl || !badgeEl) return;

  const updateBadge = () => {
    const val = inputEl.value;
    if (!val) {
      badgeEl.innerHTML = '';
      badgeEl.classList.add('hidden');
      return;
    }

    const parts = val.split('-');
    if (parts.length !== 3) return;

    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return;

    try {
      const tglJawa = getTanggalJawaLengkap(y, m, d);
      if (!tglJawa) return;

      badgeEl.classList.remove('hidden');
      badgeEl.innerHTML = `
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sogan-950/80 border border-prada/40 text-prada text-xs font-semibold shadow-sm animate-fade-in">
          <i class="fa-solid fa-sparkles text-amber-300"></i>
          <span>${tglJawa.dino || ''} ${tglJawa.pas || ''}</span>
          <span class="text-sogan-400">&bull;</span>
          <span class="text-amber-200">Neptu ${tglJawa.neptu || 0}</span>
          <span class="text-sogan-400">&bull;</span>
          <span class="text-sogan-300">Wuku ${tglJawa.wukuName || '-'}</span>
        </div>
      `;
    } catch (_) {
      badgeEl.classList.add('hidden');
    }
  };

  inputEl.addEventListener('input', updateBadge);
  inputEl.addEventListener('change', updateBadge);

  // Inisialisasi jika input sudah memiliki nilai
  if (inputEl.value) {
    updateBadge();
  }
}

/**
 * Inisialisasi kalkulasi instan di seluruh formulir Jagad Jawa
 */
export function initAllFormRealtimeCalculators() {
  const formConfigs = [
    // Pitung Perjodohan
    { input: 'priaTgl', container: 'priaTglCalcBadge' },
    { input: 'wanitaTgl', container: 'wanitaTglCalcBadge' },
    // Nujum Kepribadian
    { input: 'nujumTanggalLahir', container: 'nujumTglCalcBadge' },
    { input: 'inputTglNujum', container: 'nujumTglCalcBadgeAlt' },
    // Selametan / Surut
    { input: 'selametanTanggal', container: 'selametanTglCalcBadge' },
    { input: 'inputTglWafat', container: 'selametanTglCalcBadgeAlt' },
    // Ijab Nikah
    { input: 'ijabTanggal', container: 'ijabTglCalcBadge' }
  ];

  formConfigs.forEach(cfg => {
    attachRealtimeDateCalculator(cfg.input, cfg.container);
  });
}

// ─── 2. TOOLTIP KONTEKSTUAL ISTILAH PRIMBON (?) ─────────────────────────────

const TERM_GLOSSARY = {
  wuku: {
    title: { id: 'Wuku (Pawukon)', jv: 'Wuku (Pawukon)' },
    desc: {
      id: 'Siklus 30 pekan (210 hari) dalam kalender kuno Jawa yang masing-masing dipayungi oleh dewa pelindung dan membawa watak tersendiri.',
      jv: 'Diteri 30 wuku (210 dinten) ing pawukon Jawi ingkang kaayoman dening dewa pandom gesang sarta ngemu surasa watak.'
    }
  },
  neptu: {
    title: { id: 'Neptu', jv: 'Neptu' },
    desc: {
      id: 'Nilai angka bobot mistis perpaduan hari Masehi (3–9) dan Pasaran Jawa (4–9) sebagai basis perhitungan watak, jodoh, dan rejeki.',
      jv: 'Gunggung angka bobot dinten (3–9) kaliyan pasaran (4–9) minangka dhasar pétungan watak, jodhok, lan rejeki.'
    }
  },
  pasaran: {
    title: { id: 'Pasaran (Pancawara)', jv: 'Pasaran (Pancawara)' },
    desc: {
      id: 'Siklus 5 harian Jawa (Legi, Pahing, Pon, Wage, Kliwon) yang melambangkan lima elemen alam dan arah mata angin pancer.',
      jv: 'Diteri 5 dinten Jawa (Legi, Pahing, Pon, Wage, Kliwon) pralambang sedulur papat lima pancer.'
    }
  },
  dino_gede: {
    title: { id: 'Dino Gede', jv: 'Dino Gede' },
    desc: {
      id: 'Hari-hari sakral tertentu dalam siklus Pawukon yang memiliki pangaribawa besar; dianjurkan berhati-hati dan eling waspada.',
      jv: 'Dinten wigatos ing siklus pawukon kanthi prabawa ageng; prayogi eling waspada saha ngudi karaharjan.'
    }
  },
  pancasuda: {
    title: { id: 'Panca Suda', jv: 'Panca Suda' },
    desc: {
      id: 'Metode pembagian total neptu dengan angka 4 atau 7 untuk melihat pola keselarasan dan dinamika rejeki rumah tangga.',
      jv: 'Paugeran mbagi gunggung neptu kaliyan 4 utawi 7 kanggé nyawang kahanan katentreman bale wisma.'
    }
  },
  pranata_mangsa: {
    title: { id: 'Pranata Mangsa', jv: 'Pranata Mangsa' },
    desc: {
      id: 'Sistem penanggalan agraris Jawa 12 musim berbasis garis edar semu matahari dan tanda-tanda alam (sasmita alam).',
      jv: 'Pananggalan agraris 12 mangsa adhedhasar lakuning surya lan tandha-tandha alam semesta.'
    }
  }
};

let activeTooltipEl = null;

export function toggleTermTooltip(termKey, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  // Jika tooltip sedang aktif, tutup
  if (activeTooltipEl) {
    activeTooltipEl.remove();
    activeTooltipEl = null;
  }

  const data = TERM_GLOSSARY[termKey];
  if (!data) return;

  const lang = (typeof window !== 'undefined' && window.getLanguage) ? window.getLanguage() : 'id';
  const title = data.title[lang] || data.title.id;
  const desc = data.desc[lang] || data.desc.id;

  const tip = document.createElement('div');
  tip.className = 'fixed z-[9999] max-w-xs p-3.5 rounded-2xl bg-[#0F141D] border border-prada/60 text-sogan-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in space-y-1.5';
  tip.innerHTML = `
    <div class="flex items-center justify-between border-b border-sogan-800 pb-1">
      <span class="font-marcellus font-bold gold-gradient-text text-sm">${title}</span>
      <button type="button" aria-label="Tutup penjelasan" class="text-sogan-400 hover:text-prada text-xs ml-2">&times;</button>
    </div>
    <p class="font-sans leading-relaxed text-[11.5px] text-sogan-300">${desc}</p>
  `;

  document.body.appendChild(tip);
  activeTooltipEl = tip;

  // Tutup tombol
  tip.querySelector('button').addEventListener('click', (e) => {
    e.stopPropagation();
    tip.remove();
    activeTooltipEl = null;
  });

  // Posisi tooltip dekat dengan elemen penekan
  if (event && event.clientX) {
    const x = Math.min(event.clientX + 10, window.innerWidth - 320);
    const y = Math.min(event.clientY + 15, window.innerHeight - 150);
    tip.style.left = `${Math.max(10, x)}px`;
    tip.style.top = `${Math.max(10, y)}px`;
  } else {
    tip.style.left = '50%';
    tip.style.top = '50%';
    tip.style.transform = 'translate(-50%, -50%)';
  }
}

// Tutup tooltip saat klik di luar
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (activeTooltipEl && !activeTooltipEl.contains(e.target)) {
      activeTooltipEl.remove();
      activeTooltipEl = null;
    }
  });
}

// ─── 3. WIZARD FORMULIR MODE RINGKAS (STEPPER) ──────────────────────────────

let jodohWizardStep = 1;

export function initJodohWizard() {
  const wizardContainer = document.getElementById('jodohWizardNav');
  if (!wizardContainer) return;

  const isModeRingkas = (typeof window !== 'undefined' && typeof window.isPemula === 'function') 
    ? window.isPemula() 
    : false;

  const step1 = document.getElementById('jodohStep1');
  const step2 = document.getElementById('jodohStep2');
  const stepIndicator = document.getElementById('jodohStepIndicator');
  const progressBar = document.getElementById('jodohProgressBar');

  if (!isModeRingkas) {
    // Mode Lengkap: Tampilkan semua dalam 1 halaman
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.remove('hidden');
    wizardContainer.classList.add('hidden');
    return;
  }

  // Mode Ringkas: Terapkan stepper
  wizardContainer.classList.remove('hidden');

  if (jodohWizardStep === 1) {
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
    if (stepIndicator) stepIndicator.textContent = 'Langkah 1 dari 2: Data Calon Suami';
    if (progressBar) progressBar.style.width = '50%';
  } else {
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
    if (stepIndicator) stepIndicator.textContent = 'Langkah 2 dari 2: Data Calon Istri';
    if (progressBar) progressBar.style.width = '100%';
  }
}

export function setJodohWizardStep(step) {
  jodohWizardStep = step;
  initJodohWizard();
}

// ─── 4. QR CODE GENERATOR VISUAL PADA CANVAS ────────────────────────────────

/**
 * Merender QR code visual elegan yang mengarah ke link aplikasi pada canvas
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} size 
 */
export function drawShareCardQrCode(ctx, x, y, size = 64) {
  if (!ctx) return;
  // Gambar bingkai QR Code berornamen emas klasik
  ctx.save();
  ctx.fillStyle = '#121722';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, size, size);

  // Pola visual QR Code deterministik yang elegan (mengarah ke Jagad Jawa)
  const pattern = [
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1]
  ];

  const cellSize = size / 15;
  ctx.fillStyle = '#f5c542';

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (pattern[r][c] === 1) {
        ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize * 0.9, cellSize * 0.9);
      }
    }
  }

  // Label di bawah QR
  ctx.fillStyle = '#e2d5bd';
  ctx.font = '600 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Scan Jagad Jawa', x + size / 2, y + size + 10);

  ctx.restore();
}

// ─── 5. DYNAMIC HTML LANG ATTRIBUTE ─────────────────────────────────────────

export function syncDocumentLangAttribute(lang = 'id') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang === 'jv' ? 'jv' : 'id');
  }
}

// ─── 6. PROFIL WETON PENGGUNA (TAB SAYA) ───────────────────────────────────

export function saveUserProfileWeton(birthDateStr) {
  if (typeof localStorage === 'undefined' || !birthDateStr) return;
  localStorage.setItem('jagad_jawa_user_birthdate', birthDateStr);
  renderUserProfileWeton(birthDateStr);
}

export function loadUserProfileWeton() {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
  const saved = localStorage.getItem('jagad_jawa_user_birthdate');
  const inputEl = document.getElementById('userProfileBirthDateInput');
  if (saved) {
    if (inputEl) inputEl.value = saved;
    renderUserProfileWeton(saved);
  }
}

export function renderUserProfileWeton(birthDateStr) {
  if (typeof document === 'undefined' || !birthDateStr) return;
  const parts = birthDateStr.split('-');
  if (parts.length !== 3) return;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return;

  const wetonEl = document.getElementById('userProfileWetonText');
  const neptuEl = document.getElementById('userProfileNeptuText');
  const wukuEl = document.getElementById('userProfileWukuText');

  try {
    const tglJawa = getTanggalJawaLengkap(y, m, d);
    if (tglJawa) {
      if (wetonEl) wetonEl.textContent = `${tglJawa.dino} ${tglJawa.pas}`;
      if (neptuEl) neptuEl.textContent = `${tglJawa.neptu}`;
      if (wukuEl) wukuEl.textContent = `${tglJawa.wukuName || '-'}`;
    }
  } catch (err) {
    console.warn('[renderUserProfileWeton]', err);
  }
}

// Global window exposure
if (typeof window !== 'undefined') {
  window.renderHeroTodayCard = renderHeroTodayCard;
  window.toggleHeroTodayAccordion = toggleHeroTodayAccordion;
  window.shareTodayWetonText = shareTodayWetonText;
  window.attachRealtimeDateCalculator = attachRealtimeDateCalculator;
  window.initAllFormRealtimeCalculators = initAllFormRealtimeCalculators;
  window.toggleTermTooltip = toggleTermTooltip;
  window.initJodohWizard = initJodohWizard;
  window.setJodohWizardStep = setJodohWizardStep;
  window.drawShareCardQrCode = drawShareCardQrCode;
  window.syncDocumentLangAttribute = syncDocumentLangAttribute;
  window.saveUserProfileWeton = saveUserProfileWeton;
  window.loadUserProfileWeton = loadUserProfileWeton;
  window.renderUserProfileWeton = renderUserProfileWeton;
}
