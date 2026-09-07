// Engine Audio & Gendhing Ketawang Puspawarna

let audioCtx = null;
let isPuspawarnaPlaying = false;
let puspawarnaInterval = null;
let puspawarnaStep = 0;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playGamelanTone(freq, type = 'saron') {
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
    console.error("Audio error:", e);
  }
}

// Partitur Gendhing Ketawang Puspawarna (Laras Slendro Manyura)
const puspawarnaScore = [
  { b: 293.66, k: 0, g: 0 }, { b: 329.63, k: 329.63, g: 0 },
  { b: 293.66, k: 0, g: 0 }, { b: 261.63, k: 261.63, g: 0 },
  { b: 329.63, k: 0, g: 0 }, { b: 293.66, k: 293.66, g: 0 },
  { b: 440.00, k: 0, g: 0 }, { b: 392.00, k: 392.00, g: 65, kp: 140 },
  { b: 293.66, k: 0, g: 0 }, { b: 329.63, k: 329.63, g: 0 },
  { b: 293.66, k: 0, g: 0 }, { b: 261.63, k: 261.63, g: 0 },
  { b: 329.63, k: 0, g: 0 }, { b: 293.66, k: 293.66, g: 0 },
  { b: 261.63, k: 0, g: 0 }, { b: 440.00, k: 440.00, g: 65, kp: 140 },
  { b: 329.63, k: 0, g: 0 }, { b: 392.00, k: 392.00, g: 0 },
  { b: 329.63, k: 0, g: 0 }, { b: 293.66, k: 293.66, g: 0 },
  { b: 440.00, k: 0, g: 0 }, { b: 392.00, k: 392.00, g: 0 },
  { b: 329.63, k: 0, g: 0 }, { b: 293.66, k: 293.66, g: 65, kp: 140 }
];

export function toggleKetawangPuspawarna(showToast) {
  initAudio();
  isPuspawarnaPlaying = !isPuspawarnaPlaying;

  const btnIcon = document.getElementById('puspawarnaIcon');
  const label = document.getElementById('puspawarnaLabel');
  const heroIcon = document.getElementById('heroPlayIcon');
  const eq = document.getElementById('audioEqualizer');

  if (isPuspawarnaPlaying) {
    btnIcon.className = 'fa-solid fa-circle-pause text-base text-prada';
    label.innerText = 'Nembang Puspawarna...';
    if (heroIcon) heroIcon.className = 'fa-solid fa-pause text-2xl text-keraton ml-0';
    eq.classList.remove('hidden');
    if (showToast) showToast("Memutar Ketawang Puspawarna (Laras Slendro Manyura)");

    puspawarnaStep = 0;
    puspawarnaInterval = setInterval(() => {
      if (!isPuspawarnaPlaying) return;
      const note = puspawarnaScore[puspawarnaStep];
      if (note.b) playGamelanTone(note.b, 'saron');
      if (note.k) playGamelanTone(note.k, 'kenong');
      if (note.kp) playGamelanTone(note.kp, 'kempul');
      if (note.g) playGamelanTone(note.g, 'gong');
      puspawarnaStep = (puspawarnaStep + 1) % puspawarnaScore.length;
    }, 750);
  } else {
    btnIcon.className = 'fa-solid fa-circle-play text-base text-prada';
    label.innerText = 'Ketawang Puspawarna';
    if (heroIcon) heroIcon.className = 'fa-solid fa-play text-2xl text-keraton ml-1';
    eq.classList.add('hidden');
    clearInterval(puspawarnaInterval);
    if (showToast) showToast("Gendhing Puspawarna dipun leremaken.");
  }
}

export function playDalangFX(type, showToast) {
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  if (type === 'kepyak') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.08);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    if (showToast) showToast("Suara Kepyak Dalang");
  } else {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    if (showToast) showToast("Suara Dodokan Kotak");
  }
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(now); osc.stop(now + 0.2);
}
