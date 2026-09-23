/**
 * Jagad Jawa — Fitur Mode Pemula (Ringkas) vs Mode Ahli (Lengkap)
 * 
 * Tanggung jawab:
 * 1. Mengelola preferensi tampilan user di localStorage key 'jagad_jawa_mode'.
 * 2. Menyediakan API getMode, setMode, isPemula, isAhli, hasModePreference, applyModeToUI.
 * 3. Mengontrol Onboarding Modal pemilihan mode pertama kali.
 */

export const MODE_STORAGE_KEY = 'jagad_jawa_mode';
export const MODE_PEMULA = 'pemula';
export const MODE_AHLI = 'ahli';

/**
 * Membaca mode tampilan tersimpan
 * @returns {'pemula' | 'ahli' | null}
 */
export function getMode() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const val = localStorage.getItem(MODE_STORAGE_KEY);
    if (val === MODE_PEMULA || val === MODE_AHLI) {
      return val;
    }
  } catch (e) {
    console.warn('[Mode] Gagal membaca localStorage:', e);
  }
  return null;
}

/**
 * Menyimpan mode tampilan ke localStorage dan memperbarui UI
 * @param {'pemula' | 'ahli' | 'ringkas' | 'lengkap'} mode
 */
export function setMode(mode) {
  let normalized = mode;
  if (mode === 'ringkas') normalized = MODE_PEMULA;
  if (mode === 'lengkap') normalized = MODE_AHLI;

  if (normalized !== MODE_PEMULA && normalized !== MODE_AHLI) {
    normalized = MODE_AHLI;
  }

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, normalized);
    } catch (e) {
      console.warn('[Mode] Gagal menyimpan ke localStorage:', e);
    }
  }

  applyModeToUI(normalized);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: normalized } }));
  }

  return normalized;
}

/**
 * Mengecek apakah user aktif dalam Mode Pemula (Ringkas)
 * @returns {boolean}
 */
export function isPemula() {
  return getMode() === MODE_PEMULA;
}

/**
 * Mengecek apakah user aktif dalam Mode Ahli (Lengkap)
 * @returns {boolean}
 */
export function isAhli() {
  return getMode() === MODE_AHLI;
}

/**
 * Mengecek apakah user sudah memiliki preferensi tersimpan
 * @returns {boolean}
 */
export function hasModePreference() {
  return getMode() !== null;
}

/**
 * Menerapkan class CSS dan mengupdate status kontrol UI sesuai mode aktif
 * @param {'pemula' | 'ahli'} [targetMode]
 */
export function applyModeToUI(targetMode) {
  const currentMode = targetMode || getMode() || MODE_AHLI;

  if (typeof document !== 'undefined' && document.body) {
    if (currentMode === MODE_PEMULA) {
      document.body.classList.add('mode-pemula');
      document.body.classList.remove('mode-ahli');
    } else {
      document.body.classList.add('mode-ahli');
      document.body.classList.remove('mode-pemula');
    }

    // Perbarui label tombol switcher di Desktop Navbar jika ada
    const textEl = document.getElementById('modeToggleText');
    const textShortEl = document.getElementById('modeToggleTextShort');
    const iconEl = document.getElementById('modeToggleIcon');
    const btnEl = document.getElementById('modeToggleBtn');

    if (textEl) {
      textEl.textContent = currentMode === MODE_PEMULA ? 'Mode: Ringkas' : 'Mode: Lengkap';
    }
    if (textShortEl) {
      textShortEl.textContent = currentMode === MODE_PEMULA ? 'Ringkas' : 'Lengkap';
    }
    if (iconEl) {
      iconEl.className = currentMode === MODE_PEMULA ? 'fa-solid fa-leaf text-emerald-400' : 'fa-solid fa-sliders text-amber-400';
    }
    if (btnEl) {
      btnEl.setAttribute('aria-label', currentMode === MODE_PEMULA ? 'Mode Ringkas aktif. Klik untuk beralih ke Mode Lengkap' : 'Mode Lengkap aktif. Klik untuk beralih ke Mode Ringkas');
      btnEl.setAttribute('title', currentMode === MODE_PEMULA ? 'Mode Ringkas (Klik kanggé ngalih Mode Lengkap)' : 'Mode Lengkap (Klik kanggé ngalih Mode Ringkas)');
    }

    // Perbarui label tombol switcher di Mobile Menu jika ada
    const mobileTextEl = document.getElementById('mobileModeToggleText');
    const mobileBtnEl = document.getElementById('mobileModeToggleBtn');
    if (mobileTextEl) {
      mobileTextEl.textContent = currentMode === MODE_PEMULA ? 'Ringkas (Pemula)' : 'Lengkap (Ahli)';
    }
    if (mobileBtnEl) {
      mobileBtnEl.setAttribute('title', currentMode === MODE_PEMULA ? 'Mode Ringkas' : 'Mode Lengkap');
    }
  }

  return currentMode;
}

/**
 * Toggle beralih antara Mode Pemula dan Mode Ahli
 */
export function toggleMode() {
  const current = getMode() || MODE_AHLI;
  const next = current === MODE_PEMULA ? MODE_AHLI : MODE_PEMULA;
  setMode(next);

  if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
    const msg = next === MODE_PEMULA
      ? 'Mode Ringkas (Pemula) diaktifake. Fitur esensial ditampilake.'
      : 'Mode Lengkap (Ahli) diaktifake. Sedaya fitur primbon jangkep cumawis.';
    window.showToast(msg);
  }

  return next;
}

/**
 * Menampilkan modal onboarding pemilihan mode
 */
export function showOnboardingModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modalPilihMode');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (document.body) {
      document.body.style.overflow = 'hidden';
    }
  }
}

/**
 * Menutup modal onboarding pemilihan mode
 */
export function closeOnboardingModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modalPilihMode');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (document.body) {
      document.body.style.overflow = 'auto';
    }
  }
}

/**
 * Pilihan langsung dari modal onboarding
 * @param {'pemula' | 'ahli'} mode 
 */
export function pilihModeAwal(mode) {
  setMode(mode);
  closeOnboardingModal();
  if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
    const msg = mode === MODE_PEMULA
      ? 'Sugeng rawuh! Mode Ringkas aktif. Panjenengan saged ngowahi ing menu kapan kemawon.'
      : 'Sugeng rawuh! Mode Lengkap (Ahli) aktif. Sedaya fitur primbon jangkep cumawis.';
    window.showToast(msg);
  }
}

/**
 * Inisialisasi awal preferensi mode aplikasi
 */
export function initModeFeature() {
  if (hasModePreference()) {
    applyModeToUI();
  } else {
    // Belum pernah memilih: terapkan mode default visual (ahli) lalu tampilkan modal
    applyModeToUI(MODE_AHLI);
    showOnboardingModal();
  }
}

// Hubungkan ke namespace global / window agar kompatibel dengan pemanggilan inline HTML
if (typeof window !== 'undefined') {
  window.getMode = getMode;
  window.setMode = setMode;
  window.isPemula = isPemula;
  window.isAhli = isAhli;
  window.hasModePreference = hasModePreference;
  window.applyModeToUI = applyModeToUI;
  window.toggleMode = toggleMode;
  window.showOnboardingModal = showOnboardingModal;
  window.closeOnboardingModal = closeOnboardingModal;
  window.pilihModeAwal = pilihModeAwal;
  window.initModeFeature = initModeFeature;
}
