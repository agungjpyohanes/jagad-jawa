/**
 * Jagad Jawa — Modul Domain: Pitutur UI (Pitutur Luhur & Kuis Asah Kawruh)
 * Pengendali interaksi kutipan falsafah harian Jawa, transliterasi aksara,
 * tombol salin/bagikan ke WhatsApp, dan runner kuis interaktif kebudayaan.
 */

import { showToast, copyToClipboard } from '../../ui/toast.js';
import { PITUTUR_LIST, QUIZ_QUESTIONS } from '../../data/pitutur.js';

let currentPitutur = null;
let quizQuestionsList = [];
let currentQuizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

/**
 * Mendapatkan daftar pitutur dari data global.
 * @returns {Array<Object>}
 */
export function getPituturList() {
  return PITUTUR_LIST || (typeof window !== 'undefined' && window.PITUTUR_LIST) || 
         (typeof globalThis !== 'undefined' && globalThis.PITUTUR_LIST) || [];
}

/**
 * Mendapatkan daftar soal kuis dari data global.
 * @returns {Array<Object>}
 */
export function getQuizQuestions() {
  return QUIZ_QUESTIONS || (typeof window !== 'undefined' && window.QUIZ_QUESTIONS) || 
         (typeof globalThis !== 'undefined' && globalThis.QUIZ_QUESTIONS) || [];
}

/**
 * Mengacak dan menampilkan kutipan Pitutur Luhur.
 */
export function generateRandomPitutur() {
  const list = getPituturList();
  if (!list || list.length === 0) return;

  const randIdx = Math.floor(Math.random() * list.length);
  currentPitutur = list[randIdx];
  renderPituturCard(currentPitutur);
}

/**
 * Mendapatkan pitutur luhur yang selaras dengan hari ini secara deterministik.
 * @param {Date} [date=new Date()]
 * @returns {Object|null}
 */
export function getPituturHariIni(date = new Date()) {
  const list = getPituturList();
  if (!list || list.length === 0) return null;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const seed = (y * 372) + (m * 31) + d;
  const idx = Math.abs(seed) % list.length;
  return list[idx];
}

/**
 * Menampilkan pitutur luhur hari ini ke kartu UI.
 */
export function generatePituturHariIni() {
  const item = getPituturHariIni();
  if (!item) return;
  currentPitutur = item;
  renderPituturCard(currentPitutur);
  const badgeEl = document.getElementById('pituturSumberBadge');
  if (badgeEl) {
    badgeEl.innerText = `Pitutur Dina Iki · ${item.sumber || 'Falsafah Luhur Jawa'}`;
  }
}

/**
 * Merender konten pitutur ke DOM.
 * @param {Object} item 
 */
export function renderPituturCard(item) {
  if (!item) return;

  const elAksara = document.getElementById('pituturAksaraText');
  if (elAksara) elAksara.innerText = item.aksara || '';

  const elJawa = document.getElementById('pituturJawaText');
  if (elJawa) elJawa.innerText = `"${item.jawa}"`;

  const elArti = document.getElementById('pituturArtiText');
  if (elArti) elArti.innerText = item.artiHarfiah || '';

  const elMakna = document.getElementById('pituturMaknaText');
  if (elMakna) elMakna.innerText = item.makna || '';

  const elSumber = document.getElementById('pituturSumberBadge');
  if (elSumber) elSumber.innerText = item.sumber || 'Falsafah Luhur Jawa';
}

/**
 * Menyalin teks pitutur ke papan klip (clipboard).
 */
export function copyPituturText() {
  if (!currentPitutur) {
    generateRandomPitutur();
  }
  if (!currentPitutur) return;

  const teks = `🪶 PITUTUR LUHUR JAWI\n\n${currentPitutur.aksara}\n"${currentPitutur.jawa}"\n\n📖 Teges: ${currentPitutur.artiHarfiah}\n💡 Makna: ${currentPitutur.makna}\n📚 Sumber: ${currentPitutur.sumber}\n\n— Jagad Jawa (Kebudayaan Luhur Nusantara)`;
  copyToClipboard(teks, 'Pitutur luhur kasil disalin!');
}

/**
 * Membagikan pitutur ke WhatsApp.
 */
export function sharePituturWhatsApp() {
  if (!currentPitutur) {
    generateRandomPitutur();
  }
  if (!currentPitutur) return;

  const teks = `🪶 *PITUTUR LUHUR JAWI*\n\n${currentPitutur.aksara}\n_"${currentPitutur.jawa}"_\n\n*Teges:* ${currentPitutur.artiHarfiah}\n*Makna:* ${currentPitutur.makna}\n*Sumber:* ${currentPitutur.sumber}\n\nDibagikan via *Jagad Jawa* — Portal Kebudayaan Luhur Nusantara`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(teks)}`;
  window.open(url, '_blank');
}

// ─── KUIS ASAH KAWRUH KEBUDAYAAN ───────────────────────────────────────────

/**
 * Memulai ulang kuis dari soal pertama.
 */
export function restartQuiz() {
  const allQ = getQuizQuestions();
  if (!allQ || allQ.length === 0) return;

  // Acak urutan 5 soal terpilih
  const shuffled = [...allQ].sort(() => Math.random() - 0.5);
  quizQuestionsList = shuffled.slice(0, 5);
  currentQuizIndex = 0;
  quizScore = 0;
  quizAnswered = false;

  const quizBox = document.getElementById('quizBox');
  const resultBox = document.getElementById('quizResultBox');
  if (quizBox) quizBox.classList.remove('hidden');
  if (resultBox) resultBox.classList.add('hidden');

  renderCurrentQuizQuestion();
}

/**
 * Merender soal kuis yang sedang aktif.
 */
export function renderCurrentQuizQuestion() {
  if (!quizQuestionsList || quizQuestionsList.length === 0) {
    restartQuiz();
    return;
  }

  const q = quizQuestionsList[currentQuizIndex];
  if (!q) {
    showQuizResult();
    return;
  }

  quizAnswered = false;

  const counterEl = document.getElementById('quizCounter');
  if (counterEl) counterEl.innerText = `${currentQuizIndex + 1}/${quizQuestionsList.length}`;

  const scoreEl = document.getElementById('quizScore');
  if (scoreEl) scoreEl.innerText = String(quizScore);

  const questionEl = document.getElementById('quizQuestion');
  if (questionEl) questionEl.innerText = q.q;

  const container = document.getElementById('quizOptionsContainer');
  if (!container) return;

  container.innerHTML = q.opts.map((opt, idx) => `
    <button onclick="window.selectQuizAnswer(${idx})" id="quizOptBtn-${idx}"
      class="quiz-opt-btn p-3.5 rounded-xl bg-keraton border border-sogan-700 hover:border-prada text-sogan-100 hover:text-prada text-xs font-semibold text-left transition active:scale-95 flex items-center gap-3">
      <div class="w-6 h-6 rounded-full bg-sogan-900 border border-sogan-700 flex items-center justify-center text-[11px] font-mono text-prada shrink-0">
        ${String.fromCharCode(65 + idx)}
      </div>
      <span class="flex-1 leading-snug">${opt}</span>
    </button>
  `).join('');
}

/**
 * Menilai pilihan jawaban peserta kuis.
 * @param {number} selectedIdx 
 */
export function selectQuizAnswer(selectedIdx) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = quizQuestionsList[currentQuizIndex];
  if (!q) return;

  const isCorrect = selectedIdx === q.correct;
  if (isCorrect) {
    quizScore += 20; // 5 soal = max 100
  }

  const scoreEl = document.getElementById('quizScore');
  if (scoreEl) scoreEl.innerText = String(quizScore);

  // Beri highlight jawaban
  const selectedBtn = document.getElementById(`quizOptBtn-${selectedIdx}`);
  const correctBtn = document.getElementById(`quizOptBtn-${q.correct}`);

  if (isCorrect) {
    if (selectedBtn) {
      selectedBtn.className = 'quiz-opt-btn p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-semibold text-left flex items-center gap-3 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  } else {
    if (selectedBtn) {
      selectedBtn.className = 'quiz-opt-btn p-3.5 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-xs font-semibold text-left flex items-center gap-3';
    }
    if (correctBtn) {
      correctBtn.className = 'quiz-opt-btn p-3.5 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-semibold text-left flex items-center gap-3 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  }

  // Pindah otomatis ke soal berikutnya setelah 1.2 detik
  setTimeout(() => {
    currentQuizIndex++;
    if (currentQuizIndex < quizQuestionsList.length) {
      renderCurrentQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 1200);
}

/**
 * Menampilkan hasil perolehan skor akhir kuis.
 */
export function showQuizResult() {
  const quizBox = document.getElementById('quizBox');
  const resultBox = document.getElementById('quizResultBox');
  if (quizBox) quizBox.classList.add('hidden');
  if (resultBox) resultBox.classList.remove('hidden');

  const finalScoreEl = document.getElementById('quizFinalScoreText');
  if (finalScoreEl) {
    finalScoreEl.innerText = `Skor pungkasan sampeyan: ${quizScore} / 100`;
  }

  let gelar = 'Pujangga Anom';
  if (quizScore === 100) {
    gelar = 'Gelar: Satria Pinandhita (Linuwih)';
  } else if (quizScore >= 80) {
    gelar = 'Gelar: Empu Kawruh Budaya';
  } else if (quizScore >= 60) {
    gelar = 'Gelar: Cantrik Pawiyatan';
  } else {
    gelar = 'Gelar: Sinau Budi Pekerti';
  }

  const badgeEl = document.getElementById('quizRankBadge');
  if (badgeEl) {
    badgeEl.innerText = gelar;
  }
}
