/**
 * Jagad Jawa — Fitur Nuansa Visual Kelir Wayang & Panggung Blencong
 * Mengaktifkan latar belakang panggung kain kelir wayang kulit tradisional
 * dengan pencahayaan lampu minyak blencong dan ornamen wayang adiluhung.
 */

import { showToast } from './toast.js';

export const KELIR_STORAGE_KEY = 'jagad_jawa_kelir_wayang';

let _memoryKelir = false;

/**
 * Cek apakah nuansa Kelir Wayang sedang aktif.
 * @returns {boolean}
 */
export function isKelirWayangActive() {
  if (typeof localStorage === 'undefined') return _memoryKelir;
  try {
    return localStorage.getItem(KELIR_STORAGE_KEY) === 'true';
  } catch {
    return _memoryKelir;
  }
}

/**
 * Mengatur status aktif nuansa Kelir Wayang.
 * @param {boolean} active 
 * @param {boolean} [notify=false] 
 */
export function setKelirWayang(active, notify = false) {
  const isAct = Boolean(active);
  _memoryKelir = isAct;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KELIR_STORAGE_KEY, String(isAct));
    } catch (e) {
      console.warn('[Kelir] Gagal menyimpan ke localStorage:', e);
    }
  }

  if (typeof document !== 'undefined' && document.body) {
    if (isAct) {
      document.body.classList.add('kelir-wayang-active');
    } else {
      document.body.classList.remove('kelir-wayang-active');
    }
  }

  updateKelirButtons(isAct);

  if (notify) {
    const msg = isAct 
      ? 'Nuansa Panggung Kelir Wayang diaktifkan (Sorot Blencong) 🏮' 
      : 'Nuansa Kelir Wayang dipun leremaken (Latar Kosmik Baku)';
    showToast(msg);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kelir-wayang-changed', { detail: { active: isAct } }));
  }

  return isAct;
}

/**
 * Toggle nuansa Kelir Wayang.
 */
export function toggleKelirWayang() {
  const current = isKelirWayangActive();
  return setKelirWayang(!current, true);
}

/**
 * Update tombol Kelir Wayang di UI.
 * @param {boolean} active 
 */
function updateKelirButtons(active) {
  if (typeof document === 'undefined') return;
  const btn = document.getElementById('kelirToggleBtn');
  const icon = document.getElementById('kelirToggleIcon');
  const text = document.getElementById('kelirToggleText');

  if (btn) {
    if (active) {
      btn.classList.add('bg-amber-700/40', 'border-amber-400', 'text-amber-200');
      btn.classList.remove('border-prada/30');
    } else {
      btn.classList.remove('bg-amber-700/40', 'border-amber-400', 'text-amber-200');
      btn.classList.add('border-prada/30');
    }
  }
  if (icon) {
    icon.className = active ? 'fa-solid fa-masks-theater text-amber-300 animate-pulse' : 'fa-solid fa-masks-theater text-prada';
  }
  if (text) {
    text.textContent = active ? 'Kelir: On' : 'Kelir: Off';
  }

  const mobileBtn = document.getElementById('mobileKelirToggleBtn');
  const mobileText = document.getElementById('mobileKelirToggleText');
  if (mobileText) {
    mobileText.textContent = active ? 'Kelir Wayang: Aktif 🏮' : 'Kelir Wayang: Mati';
  }
}

/**
 * Inisialisasi awal fitur Kelir Wayang.
 */
export function initKelirWayangFeature() {
  const active = isKelirWayangActive();
  setKelirWayang(active, false);

  if (typeof window !== 'undefined') {
    window.toggleKelirWayang = toggleKelirWayang;
    window.isKelirWayangActive = isKelirWayangActive;
    window.setKelirWayang = setKelirWayang;
  }
}
