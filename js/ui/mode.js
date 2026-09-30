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
      textEl.textContent = currentMode === MODE_PEMULA ? 'Ringkas' : 'Lengkap';
    }
    if (textShortEl) {
      textShortEl.textContent = currentMode === MODE_PEMULA ? 'Ringkas' : 'Lengkap';
    }
    if (iconEl && !iconEl.classList.contains('fa-file-pdf')) {
      iconEl.className = currentMode === MODE_PEMULA ? 'fa-solid fa-leaf text-emerald-400 text-xs' : 'fa-solid fa-sliders text-amber-400 text-xs';
    }
    if (btnEl) {
      btnEl.setAttribute('aria-label', currentMode === MODE_PEMULA ? 'Pusat Laporan & Mode: Ringkas' : 'Pusat Laporan & Mode: Lengkap');
      btnEl.setAttribute('title', currentMode === MODE_PEMULA ? 'Pusat Laporan & Mode Ringkas (Klik kanggé mbikak menu)' : 'Pusat Laporan & Mode Lengkap (Klik kanggé mbikak menu)');
    }

    // Perbarui status checkmark di dropdown menu Laporan & Mode
    updateHeaderLaporanMenuUI();

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

/**
 * Buka / tutup dropdown menu terpadu Laporan & Mode di header
 * @param {Event} [event]
 */
export function toggleHeaderLaporanMenu(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const menu = document.getElementById('headerLaporanMenu');
  const btn = document.getElementById('modeToggleBtn');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    updateHeaderLaporanMenuUI();
  } else {
    menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Tutup dropdown menu terpadu Laporan & Mode di header
 */
export function closeHeaderLaporanMenu() {
  const menu = document.getElementById('headerLaporanMenu');
  const btn = document.getElementById('modeToggleBtn');
  if (menu) {
    menu.classList.add('hidden');
  }
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Perbarui indikator visual checkmark pada dropdown menu Laporan & Mode
 */
export function updateHeaderLaporanMenuUI() {
  const current = getMode() || MODE_AHLI;
  const checkPemula = document.getElementById('modeCheckPemula');
  const checkAhli = document.getElementById('modeCheckAhli');

  if (checkPemula) {
    if (current === MODE_PEMULA) {
      checkPemula.classList.remove('hidden');
    } else {
      checkPemula.classList.add('hidden');
    }
  }

  if (checkAhli) {
    if (current === MODE_AHLI) {
      checkAhli.classList.remove('hidden');
    } else {
      checkAhli.classList.add('hidden');
    }
  }
}

/**
 * Aksi cepat cetak laporan dari header
 */
export function cetakLaporanDariHeader() {
  if (typeof window !== 'undefined') {
    if (typeof window.printLaporan === 'function') {
      window.printLaporan('parchment', 'Jagad Jawa — Serat Dokumen Laporan');
    } else if (typeof window.switchTab === 'function') {
      window.switchTab('laporan');
    }
  }
}

// Event listener global untuk menutup dropdown saat klik di luar atau tekan Escape
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const container = document.getElementById('headerLaporanContainer');
    if (container && !container.contains(e.target)) {
      closeHeaderLaporanMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHeaderLaporanMenu();
    }
  });
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
  window.toggleHeaderLaporanMenu = toggleHeaderLaporanMenu;
  window.closeHeaderLaporanMenu = closeHeaderLaporanMenu;
  window.updateHeaderLaporanMenuUI = updateHeaderLaporanMenuUI;
  window.cetakLaporanDariHeader = cetakLaporanDariHeader;
}
