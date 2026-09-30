/**
 * Jagad Jawa — Fitur Tema: Dark Mode & Light Mode (Parchemin & Keraton Night)
 * 
 * Tanggung Jawab:
 * 1. Mengelola preferensi tema di localStorage key 'jagad_jawa_theme'.
 * 2. Sinkronisasi class 'dark' dan 'theme-light' pada documentElement dan body.
 * 3. Memperbarui tombol toggle tema di header desktop dan mobile drawer.
 * 4. Mendukung transisi halus antarmuka tanpa merusak kontras WCAG AA.
 */

import { showToast } from './toast.js';

export const THEME_STORAGE_KEY = 'jagad_jawa_theme';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

let _memoryTheme = THEME_DARK;

/**
 * Membaca tema tersimpan dari localStorage atau default ke Dark Mode.
 * @returns {'dark'|'light'}
 */
export function getTheme() {
  if (typeof localStorage === 'undefined') return _memoryTheme;
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY);
    if (val === THEME_LIGHT || val === THEME_DARK) {
      return val;
    }
  } catch (e) {
    console.warn('[Theme] Gagal membaca localStorage:', e);
  }
  return _memoryTheme;
}

/**
 * Menerapkan tema ke elemen dokumen dan memperbarui status UI.
 * @param {'dark'|'light'} theme 
 * @param {boolean} [notify=false] 
 */
export function setTheme(theme, notify = false) {
  const normalized = (theme === THEME_LIGHT) ? THEME_LIGHT : THEME_DARK;
  _memoryTheme = normalized;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (e) {
      console.warn('[Theme] Gagal menyimpan ke localStorage:', e);
    }
  }

  applyThemeToUI(normalized);

  if (notify) {
    const label = normalized === THEME_LIGHT ? 'Mode Padhang (Light Mode) ☀️' : 'Mode Peteng (Dark Mode) 🌙';
    showToast(`Tema kagantos: ${label}`);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: normalized } }));
  }

  return normalized;
}

/**
 * Toggle antara Dark Mode dan Light Mode.
 */
export function toggleTheme() {
  const current = getTheme();
  const next = (current === THEME_DARK) ? THEME_LIGHT : THEME_DARK;
  return setTheme(next, true);
}

/**
 * Mengaplikasikan class tema ke elemen HTML & Body serta memperbarui tombol toggle.
 * @param {'dark'|'light'} theme 
 */
export function applyThemeToUI(theme) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  const body = document.body;

  if (theme === THEME_LIGHT) {
    html.classList.remove('dark');
    html.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('theme-light');
      body.classList.add('light');
      body.style.backgroundColor = '#fdfaf3';
      body.style.color = '#261608';
    }
  } else {
    html.classList.add('dark');
    html.classList.remove('light');
    if (body) {
      body.classList.add('dark');
      body.classList.remove('theme-light');
      body.classList.remove('light');
      body.style.backgroundColor = '#0B0F19';
      body.style.color = '#FFF';
    }
  }

  updateThemeToggleButtons(theme);
}

/**
 * Memperbarui tampilan ikon dan teks tombol toggle tema.
 * @param {'dark'|'light'} theme 
 */
function updateThemeToggleButtons(theme) {
  const isLight = theme === THEME_LIGHT;

  // 1. Desktop Header Toggle Button
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  const textShort = document.getElementById('themeToggleTextShort');
  const btn = document.getElementById('themeToggleBtn');

  if (icon) {
    icon.className = isLight
      ? 'fa-solid fa-sun text-amber-500 text-sm'
      : 'fa-solid fa-moon text-amber-300 text-sm';
  }
  if (text) {
    text.textContent = isLight ? 'Tema: Padhang' : 'Tema: Peteng';
  }
  if (textShort) {
    textShort.textContent = isLight ? 'Padhang' : 'Peteng';
  }
  if (btn) {
    btn.title = isLight
      ? 'Ganti menyang Mode Peteng (Dark Mode 🌙)'
      : 'Ganti menyang Mode Padhang (Light Mode ☀️)';
    btn.setAttribute('aria-label', btn.title);
  }

  // 2. Mobile Drawer Toggle Button
  const mobileText = document.getElementById('mobileThemeToggleText');
  const mobileIcon = document.getElementById('mobileThemeToggleIcon');
  if (mobileText) {
    mobileText.textContent = isLight ? 'Mode Padhang (Light)' : 'Mode Peteng (Dark)';
  }
  if (mobileIcon) {
    mobileIcon.className = isLight ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-amber-300';
  }
}

/**
 * Inisialisasi awal fitur tema saat bootstrap aplikasi.
 */
export function initThemeFeature() {
  const current = getTheme();
  applyThemeToUI(current);

  if (typeof window !== 'undefined') {
    window.getTheme = getTheme;
    window.setTheme = setTheme;
    window.toggleTheme = toggleTheme;
  }
}
