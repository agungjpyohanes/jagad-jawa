/**
 * Jagad Jawa — Modul Domain: Aksara UI
 * Pengendali interaksi papan ketik virtual Hanacaraka, kanvas menulis aksara,
 * dan transliterasi teks interaktif.
 */

import {
  AKSARA_NGLEGENA,
  PASANGAN_MAP,
  SANDHANGAN_SWARA,
  SANDHANGAN_PANYIGEG,
  SANDHANGAN_WYANJANA,
  AKSARA_MURDA,
  AKSARA_SWARA,
  ANGKA_JAWA,
  PADA_JAWA,
  transliterateLatinToJawa
} from './aksara-engine.js';
import { showToast, copyToClipboard } from '../../ui/toast.js';

let currentAksaraKeyboardTab = 'nglegena';
let drawCanvas, drawCtx, isPainting = false;

export function switchAksaraKeyboardTab(tab) {
  currentAksaraKeyboardTab = tab;
  document.querySelectorAll('.aksara-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.className = 'aksara-tab-btn px-4 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md text-xs transition';
    } else {
      btn.className = 'aksara-tab-btn px-4 py-2 rounded-xl bg-sogan-900/80 text-sogan-200 hover:text-prada border border-sogan-800 text-xs transition';
    }
  });
  renderAksaraKeyboardPalette();
}

export function renderAksaraKeyboardPalette() {
  const container = document.getElementById('virtualKeyboardPalette');
  if (!container) return;

  if (currentAksaraKeyboardTab === 'nglegena') {
    container.innerHTML = `
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
        ${Object.entries(AKSARA_NGLEGENA).map(([latin, aksara]) => `
          <button onclick="window.insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
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
          <button onclick="window.insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
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
              <button onclick="window.insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm flex items-center justify-center gap-2">
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
                <button onclick="window.insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm">
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
                <button onclick="window.insertAksaraChar('${item.aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm">
                  <div class="text-prada font-jawa text-lg">${item.aksara}</div>
                  <div class="text-[9px] text-sogan-300 font-medium">${item.latin}</div>
                </button>
              `).join('')}
              <button onclick="window.insertAksaraChar('ꦉ')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm" title="Pa Cerek (re pepet)">
                <div class="text-prada font-jawa text-lg">ꦉ</div>
                <div class="text-[9px] text-sogan-300 font-medium">Pa Cerek</div>
              </button>
              <button onclick="window.insertAksaraChar('ꦊ')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm" title="Nga Lelet (le pepet)">
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
              <button onclick="window.insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
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
              <button onclick="window.insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
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
              <button onclick="window.insertAksaraChar('${aksara}')" class="p-2 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center group active:scale-95 shadow-sm">
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
              <button onclick="window.insertAksaraChar('${item.aksara} ')" class="p-2.5 rounded-xl bg-keraton border border-sogan-800 hover:border-prada hover:bg-sogan-900/60 transition text-center active:scale-95 shadow-sm flex items-center justify-center gap-2">
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

export function convertLatinToJawa() {
  const inputEl = document.getElementById('latinInput');
  const outputEl = document.getElementById('aksaraOutput');
  if (!inputEl || !outputEl) return;

  const latinText = inputEl.value;
  const jawaText = transliterateLatinToJawa(latinText);
  outputEl.textContent = jawaText || 'ꦲꦤꦕꦫꦏ';
}

export function insertAksaraChar(aksara) {
  const inputEl = document.getElementById('latinInput');
  if (!inputEl) return;
  const start = inputEl.selectionStart || inputEl.value.length;
  const end = inputEl.selectionEnd || inputEl.value.length;
  const val = inputEl.value;
  inputEl.value = val.substring(0, start) + aksara + val.substring(end);
  inputEl.selectionStart = inputEl.selectionEnd = start + aksara.length;
  inputEl.focus();
  convertLatinToJawa();
}

export function clearAksaraInput() {
  const inputEl = document.getElementById('latinInput');
  if (inputEl) {
    inputEl.value = '';
    convertLatinToJawa();
  }
}

export function copyAksaraOutput() {
  const outputEl = document.getElementById('aksaraOutput');
  if (outputEl) {
    copyToClipboard(outputEl.textContent || '', 'Aksara kasil disalin!');
  }
}

export function initDrawingCanvas() {
  drawCanvas = document.getElementById('drawingCanvas');
  if (!drawCanvas) return;
  drawCtx = drawCanvas.getContext('2d');

  function resize() {
    const rect = drawCanvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      drawCanvas.width = rect.width;
      drawCanvas.height = rect.height;
      drawCtx.strokeStyle = '#d4af37';
      drawCtx.lineWidth = 4.5;
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
    }
  }
  resize();

  function start(e) {
    isPainting = true;
    draw(e);
  }
  function stop() {
    isPainting = false;
    drawCtx?.beginPath();
  }
  function draw(e) {
    if (!isPainting || !drawCtx) return;
    const rect = drawCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    drawCtx.lineTo(x, y);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
  }

  drawCanvas.addEventListener('mousedown', start);
  drawCanvas.addEventListener('mouseup', stop);
  drawCanvas.addEventListener('mousemove', draw);
  drawCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); });
  drawCanvas.addEventListener('touchend', stop);
  drawCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
}

export function clearCanvas() {
  if (drawCanvas && drawCtx) {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }
}

// ─── PANDUAN VISUAL MATERI SANDHANGAN ─────────────────────────────────────
export const SANDHANGAN_GUIDE_DATA = {
  swara: [
    { nama: 'Wulu', aksara: 'ꦶ', latin: 'i', posisi: 'Ing nginggil aksara', tuladha: 'ꦱꦶꦠꦶ (siti)' },
    { nama: 'Suku', aksara: 'ꦸ', latin: 'u', posisi: 'Ing ngandhap aksara', tuladha: 'ꦧꦸꦏꦸ (buku)' },
    { nama: 'Taling', aksara: 'ꦺ', latin: 'é / è', posisi: 'Ing ngajeng aksara', tuladha: 'ꦱꦺꦠꦺ (sété)' },
    { nama: 'Taling Tarung', aksara: 'ꦺ...ꦴ', latin: 'o', posisi: 'Ngapit aksara', tuladha: 'ꦠꦺꦴꦏꦺꦴ (toko)' },
    { nama: 'Pepet', aksara: 'ꦼ', latin: 'e (lemah)', posisi: 'Ing nginggil aksara', tuladha: 'ꦱꦼꦒ (sega)' }
  ],
  panyigeg: [
    { nama: 'Wignyan', aksara: 'ꦃ', latin: '-h', posisi: 'Sigeg h ing pungkasan', tuladha: 'ꦒꦗꦃ (gajah)' },
    { nama: 'Layar', aksara: 'ꦂ', latin: '-r', posisi: 'Sigeg r ing nginggil aksara', tuladha: 'ꦥꦱꦂ (pasar)' },
    { nama: 'Cecak', aksara: 'ꦁ', latin: '-ng', posisi: 'Sigeg ng ing nginggil aksara', tuladha: 'ꦮꦪꦁ (wayang)' },
    { nama: 'Pangkon', aksara: 'ꦀ / ꧀', latin: 'paten', posisi: 'Paten konsonan ing pungkasan ukara', tuladha: 'ꦧꦥꦏ꧀ (bapak)' }
  ],
  wyanjana: [
    { nama: 'Cakra', aksara: 'ꦿ', latin: '-ra', posisi: 'Nyambung seselan ra ing ngandhap', tuladha: 'ꦏꦿꦶꦢ (krida)' },
    { nama: 'Cakra Keret', aksara: 'ꦽ', latin: '-re', posisi: 'Seselan r + pepet ing ngandhap', tuladha: 'ꦏꦽꦠ (kreta)' },
    { nama: 'Pengkal', aksara: 'ꦾ', latin: '-ya', posisi: 'Nyambung seselan ya ing wingking', tuladha: 'ꦏꦾꦲꦶ (kyai)' }
  ],
  khusus: [
    { nama: 'Pa Cerek', aksara: 'ꦉ', latin: 're', posisi: 'Gantosing Ra dipunpepet', tuladha: 'ꦉꦒ (rega)' },
    { nama: 'Nga Lelet', aksara: 'ꦊ', latin: 'le', posisi: 'Gantosing La dipunpepet', tuladha: 'ꦊꦩꦸ (lemu)' }
  ]
};

/**
 * Merender panel visual panduan sandhangan aksara Jawa.
 */
export function renderSandhanganGuidePanel() {
  const container = document.getElementById('sandhanganGuideContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-5 text-xs">
      
      <!-- Sandhangan Swara -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full bg-sogan-900 border border-prada/40 text-[10px] font-mono uppercase font-bold text-prada">
            1. Sandhangan Swara
          </span>
          <span class="text-[11px] text-sogan-400">Ngowahi swara dhasar "a" dados i, u, é, o, utawi e.</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          ${SANDHANGAN_GUIDE_DATA.swara.map(s => `
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1 text-center hover:border-prada/60 transition shadow-sm">
              <div class="text-2xl text-prada font-jawa py-1">${s.aksara}</div>
              <div class="font-bold text-sogan-100 text-xs">${s.nama} (${s.latin})</div>
              <div class="text-[10px] text-sogan-400 leading-tight">${s.posisi}</div>
              <div class="text-[10px] text-amber-300 font-mono pt-1 border-t border-sogan-900">Tuladha: ${s.tuladha}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sandhangan Panyigeging Wanda -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full bg-sogan-900 border border-prada/40 text-[10px] font-mono uppercase font-bold text-prada">
            2. Sandhangan Panyigeging Wanda
          </span>
          <span class="text-[11px] text-sogan-400">Mateni wanda kanthi ungel konsonan (h, r, ng, utawi paten).</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          ${SANDHANGAN_GUIDE_DATA.panyigeg.map(s => `
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1 text-center hover:border-prada/60 transition shadow-sm">
              <div class="text-2xl text-prada font-jawa py-1">${s.aksara}</div>
              <div class="font-bold text-sogan-100 text-xs">${s.nama} (${s.latin})</div>
              <div class="text-[10px] text-sogan-400 leading-tight">${s.posisi}</div>
              <div class="text-[10px] text-amber-300 font-mono pt-1 border-t border-sogan-900">Tuladha: ${s.tuladha}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sandhangan Wyanjana & Vokal Khusus -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full bg-sogan-900 border border-prada/40 text-[10px] font-mono uppercase font-bold text-prada">
            3. Sandhangan Wyanjana &amp; Fonem Mandiri
          </span>
          <span class="text-[11px] text-sogan-400">Seselan wyanjana semi-vokal (-ra, -re, -ya) sarta Pa Cerek &amp; Nga Lelet.</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          ${[...SANDHANGAN_GUIDE_DATA.wyanjana, ...SANDHANGAN_GUIDE_DATA.khusus].map(s => `
            <div class="p-3 rounded-xl bg-keraton border border-sogan-800 space-y-1 text-center hover:border-prada/60 transition shadow-sm">
              <div class="text-2xl text-prada font-jawa py-1">${s.aksara}</div>
              <div class="font-bold text-sogan-100 text-xs">${s.nama} (${s.latin})</div>
              <div class="text-[10px] text-sogan-400 leading-tight">${s.posisi}</div>
              <div class="text-[10px] text-amber-300 font-mono pt-1 border-t border-sogan-900">Tuladha: ${s.tuladha}</div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// ─── KUIS AKSARA JAWA INTERAKTIF ──────────────────────────────────────────
export const AKSARA_QUIZ_QUESTIONS = [
  {
    q: 'Aksara Jawa "ꦲꦤꦕꦫꦏ" menawi dipunwaos mawi aksara Latin inggih punika...?',
    opts: ['Ha Na Ca Ra Ka', 'Da Ta Sa Wa La', 'Pa Dha Ja Ya Nya', 'Ma Ga Ba Tha Nga'],
    correct: 0,
    penjelasan: 'Ha Na Ca Ra Ka minangka larik kapisan saking 20 aksara nglegena Carakan Jawi.'
  },
  {
    q: 'Sandhangan Swara ingkang ungelipun "u" dipunwastani...?',
    opts: ['Wulu', 'Suku', 'Taling', 'Pepet'],
    correct: 1,
    penjelasan: 'Suku (ꦸ) manggen ing ngandhap aksara kangge ngowahi swara "a" dados "u".'
  },
  {
    q: 'Sandhangan panyigeg wanda kangge mateni aksara kanthi ungel "-r" inggih punika...?',
    opts: ['Wignyan', 'Layar', 'Cecak', 'Pangkon'],
    correct: 1,
    penjelasan: 'Layar (ꦂ) manggen ing nginggil aksara minangka panyigeg ungel konsonan "-r".'
  },
  {
    q: 'Sandhangan Wyanjana kangge nambahi ungel seselan "-ra" (tuladha: "Kridha") dipunwastani...?',
    opts: ['Pengkal', 'Cakra', 'Cakra Keret', 'Cecak'],
    correct: 1,
    penjelasan: 'Cakra (ꦿ) nambahi ungel konsonan seselan "-ra" ing tengahing wanda.'
  },
  {
    q: 'Teks aksara Jawa "ꦱꦸꦫꦧꦪ" menawi dipunwaos inggih punika kutha...?',
    opts: ['Surakarta', 'Surabaya', 'Semarang', 'Sukoharjo'],
    correct: 1,
    penjelasan: 'ꦱꦸ (su) + ꦫ (ra) + ꦧ (ba) + ꦪ (ya) = Surabaya.'
  },
  {
    q: 'Sandhangan ingkang dipun-ginakaken kangge mateni aksara ing pungkasan ukara inggih punika...?',
    opts: ['Pangkon', 'Taling Tarung', 'Wignyan', 'Cecak'],
    correct: 0,
    penjelasan: 'Pangkon (꧀) mateni aksara gesang dados konsonan mati ing pungkasan ukara.'
  },
  {
    q: 'Kangge nyerat ungel "le" ing basa Jawi mboten pareng migunakaken aksara La dipunpepet, nanging kedah ngangge...?',
    opts: ['Pa Cerek', 'Nga Lelet', 'Aksara Murda', 'Aksara Swara'],
    correct: 1,
    penjelasan: 'Nga Lelet (ꦊ) minangka fonem mandiri pangganti La dipunpepet miturut paugeran Sriwedari.'
  },
  {
    q: 'Sandhangan "Wignyan" (ꦃ) minangka panyigeg aksara kanthi ungel...?',
    opts: ['-ng', '-r', '-h', '-k'],
    correct: 2,
    penjelasan: 'Wignyan ngasilaken ungel desah konsonan "-h" ing pungkasan wanda.'
  },
  {
    q: 'Aksara Jawa "ꦩꦔꦤ꧀" dipunwaos...?',
    opts: ['Mangan', 'Macan', 'Madhang', 'Manuk'],
    correct: 0,
    penjelasan: 'ꦩ (ma) + ꦔ (nga) + ꦤ꧀ (na dipangku dados n) = Mangan.'
  },
  {
    q: 'Sandhangan "Taling Tarung" (ꦺ...ꦴ) ngowahi swara dhasar "a" dados swara...?',
    opts: ['i', 'u', 'e', 'o'],
    correct: 3,
    penjelasan: 'Taling Tarung ngapit aksara nglegena kangge ngasilaken swara vokal "o".'
  }
];

let aksaraQuizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  isAnswered: false
};

/**
 * Memulai ulang kuis aksara Jawa.
 */
export function restartAksaraQuiz() {
  // Ambil 5 soal acak dari bank soal aksara
  aksaraQuizState.questions = [...AKSARA_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  aksaraQuizState.currentIndex = 0;
  aksaraQuizState.score = 0;
  aksaraQuizState.isAnswered = false;

  const box = document.getElementById('aksaraQuizBox');
  const res = document.getElementById('aksaraQuizResultBox');
  if (box) box.classList.remove('hidden');
  if (res) res.classList.add('hidden');

  renderAksaraQuizQuestion();
}

/**
 * Merender soal kuis aksara yang aktif.
 */
export function renderAksaraQuizQuestion() {
  const { questions, currentIndex, score } = aksaraQuizState;
  if (!questions || questions.length === 0) {
    restartAksaraQuiz();
    return;
  }

  const q = questions[currentIndex];
  if (!q) {
    showAksaraQuizResult();
    return;
  }

  aksaraQuizState.isAnswered = false;

  const counter = document.getElementById('aksaraQuizCounter');
  if (counter) counter.innerText = `${currentIndex + 1}/${questions.length}`;

  const scoreEl = document.getElementById('aksaraQuizScore');
  if (scoreEl) scoreEl.innerText = String(score);

  const qEl = document.getElementById('aksaraQuizQuestion');
  if (qEl) qEl.innerText = q.q;

  const optContainer = document.getElementById('aksaraQuizOptionsContainer');
  if (!optContainer) return;

  optContainer.innerHTML = q.opts.map((opt, idx) => `
    <button onclick="window.selectAksaraQuizAnswer(${idx})" id="aksaraQuizOpt-${idx}"
      class="p-3.5 rounded-xl bg-keraton border border-sogan-700 hover:border-prada text-sogan-100 hover:text-prada text-xs font-semibold text-left transition flex items-center gap-3 active:scale-95 shadow-sm cursor-pointer">
      <div class="w-6 h-6 rounded-full bg-sogan-900 border border-sogan-700 flex items-center justify-center text-[11px] font-mono text-prada shrink-0">
        ${String.fromCharCode(65 + idx)}
      </div>
      <span class="flex-1 leading-snug font-sans">${opt}</span>
    </button>
  `).join('');

  const noteEl = document.getElementById('aksaraQuizFeedback');
  if (noteEl) noteEl.innerHTML = '';
}

/**
 * Menilai jawaban kuis aksara.
 * @param {number} idx 
 */
export function selectAksaraQuizAnswer(idx) {
  if (aksaraQuizState.isAnswered) return;
  aksaraQuizState.isAnswered = true;

  const q = aksaraQuizState.questions[aksaraQuizState.currentIndex];
  if (!q) return;

  const isCorrect = idx === q.correct;
  if (isCorrect) {
    aksaraQuizState.score += 20;
  }

  const scoreEl = document.getElementById('aksaraQuizScore');
  if (scoreEl) scoreEl.innerText = String(aksaraQuizState.score);

  const selectedBtn = document.getElementById(`aksaraQuizOpt-${idx}`);
  const correctBtn = document.getElementById(`aksaraQuizOpt-${q.correct}`);

  if (isCorrect) {
    if (selectedBtn) selectedBtn.className = 'p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-semibold text-left flex items-center gap-3 shadow';
  } else {
    if (selectedBtn) selectedBtn.className = 'p-3.5 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-xs font-semibold text-left flex items-center gap-3';
    if (correctBtn) correctBtn.className = 'p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-semibold text-left flex items-center gap-3 shadow';
  }

  const noteEl = document.getElementById('aksaraQuizFeedback');
  if (noteEl) {
    noteEl.innerHTML = `
      <div class="p-2.5 rounded-xl ${isCorrect ? 'bg-emerald-950/50 border border-emerald-700/50 text-emerald-300' : 'bg-rose-950/50 border border-rose-700/50 text-rose-300'} text-xs flex items-center gap-2">
        <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-info'} text-sm"></i>
        <span><strong>${isCorrect ? 'Leres!' : 'Kirang Tepat.'}</strong> ${q.penjelasan}</span>
      </div>
    `;
  }

  setTimeout(() => {
    aksaraQuizState.currentIndex++;
    if (aksaraQuizState.currentIndex < aksaraQuizState.questions.length) {
      renderAksaraQuizQuestion();
    } else {
      showAksaraQuizResult();
    }
  }, 1400);
}

/**
 * Menampilkan hasil akhir kuis aksara Jawa.
 */
export function showAksaraQuizResult() {
  const box = document.getElementById('aksaraQuizBox');
  const res = document.getElementById('aksaraQuizResultBox');
  if (box) box.classList.add('hidden');
  if (res) res.classList.remove('hidden');

  const textEl = document.getElementById('aksaraQuizFinalText');
  if (textEl) {
    textEl.innerText = `Skor Panjenengan: ${aksaraQuizState.score} / 100`;
  }

  let rank = 'Penyalin Hanacaraka';
  if (aksaraQuizState.score === 100) rank = 'Gelar: Carik Keraton Linuwih';
  else if (aksaraQuizState.score >= 80) rank = 'Gelar: Juru Serat Sastra';
  else if (aksaraQuizState.score >= 60) rank = 'Gelar: Siswa Sinau Aksara';

  const rankEl = document.getElementById('aksaraQuizRankBadge');
  if (rankEl) rankEl.innerText = rank;
}
