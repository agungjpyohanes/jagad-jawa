/**
 * Jagad Jawa — Modul Domain: Audio Engine & Gamelan Synthesizer
 * Web Audio API untuk sintesis instrumen gamelan (saron, bonang, gong, kempul, kenong),
 * sound effects dalang (kepyak, dodokan), dan pemutar Gendhing Ketawang Puspawarna.
 */

import { showToast } from '../../ui/toast.js';

let audioCtx = null;
let isPuspawarnaPlaying = false;
let currentGamelanLaras = 'slendro';
let puspawarnaAudio = null;

export const saronScales = {
  slendro: [
    { note: '1 (Ji)', freq: 261.63, key: 'A' },
    { note: '2 (Ro)', freq: 293.66, key: 'S' },
    { note: '3 (Lu)', freq: 329.63, key: 'D' },
    { note: '5 (Ma)', freq: 392.00, key: 'F' },
    { note: '6 (Nem)', freq: 440.00, key: 'G' },
    { note: 'i (Ji Alit)', freq: 523.25, key: 'H' }
  ],
  pelog: [
    { note: '1 (Penunggul)', freq: 246.94, key: 'A' },
    { note: '2 (Gulu)', freq: 277.18, key: 'S' },
    { note: '3 (Dhadha)', freq: 311.13, key: 'D' },
    { note: '4 (Pelog)', freq: 349.23, key: 'F' },
    { note: '5 (Lima)', freq: 369.99, key: 'G' },
    { note: '6 (Nem)', freq: 415.30, key: 'H' },
    { note: '7 (Barang)', freq: 493.88, key: 'J' }
  ]
};

export function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playGamelanTone(freq, type = 'saron') {
  try {
    initAudio();
    if (!audioCtx) return;
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

export function playDalangFX(type, showToastFn = showToast) {
  try {
    initAudio();
    if (!audioCtx) return;
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

export function renderGamelanKeys() {
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

export function setGamelanLaras(laras) {
  currentGamelanLaras = laras;
  const slendroBtn = document.getElementById('larasSlendroBtn');
  const pelogBtn = document.getElementById('larasPelogBtn');
  if (slendroBtn) {
    slendroBtn.className = laras === 'slendro'
      ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-sogan-700 text-prada'
      : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-keraton text-sogan-300';
  }
  if (pelogBtn) {
    pelogBtn.className = laras === 'pelog'
      ? 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-sogan-700 text-prada'
      : 'px-3 py-1.5 rounded-lg text-xs font-bold transition bg-keraton text-sogan-300';
  }
  renderGamelanKeys();
  showToast(`Laras kagantos: ${laras.toUpperCase()}`);
}

export function hitBonang(num, freq, el) {
  playGamelanTone(freq, 'bonang');
  if (el) {
    el.classList.add('hit-anim');
    setTimeout(() => el.classList.remove('hit-anim'), 150);
  }
}

export function toggleKetawangPuspawarna(showToastFn = showToast) {
  const btn = document.getElementById('puspawarnaBtn');
  const btnIcon = document.getElementById('puspawarnaIcon');
  const label = document.getElementById('puspawarnaLabel');
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
      if (btnIcon) btnIcon.className = 'fa-solid fa-circle-pause text-sm text-prada animate-pulse';
      if (label) label.innerText = 'Nembang Puspawarna...';
      if (labelShort) labelShort.innerText = 'Nembang...';
      if (heroIcon) heroIcon.className = 'fa-solid fa-pause text-2xl text-keraton ml-0';
      if (eq) eq.classList.remove('hidden');
    } else {
      if (btn) btn.classList.remove('playing');
      if (btnIcon) btnIcon.className = 'fa-solid fa-circle-play text-sm text-prada';
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
    if (showToastFn) showToastFn("Gendhing Puspawarna dipun leremaken.");
  } else {
    isPuspawarnaPlaying = true;
    if (puspawarnaAudio) {
      const playPromise = puspawarnaAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updatePuspawarnaUI(true);
          if (showToastFn) showToastFn("Nglaras Gendhing Ketawang Puspawarna (Laras Slendro Manyura)...");
        }).catch(err => {
          console.warn('Audio play error:', err);
          isPuspawarnaPlaying = false;
          updatePuspawarnaUI(false);
          if (showToastFn) showToastFn("Puteran audio dipun blokir dening browser. Mangga klik malih.");
        });
      } else {
        updatePuspawarnaUI(true);
      }
    } else {
      updatePuspawarnaUI(true);
    }
  }
}
