/**
 * Jagad Jawa — Portal Budaya Luhur Nusantara
 * Modular Entry Point & Orchestrator (ES Modules)
 * 
 * Tanggung jawab main.js:
 * 1. Menghubungkan modul-modul fitur domain ke namespace global/window (thin wrappers).
 * 2. Mengorkestrasi pergantian tab (tab-switched) dan lazy loading dataset berat.
 * 3. Menjalankan bootstrap awal (Kalender, badge hari ini, modal listeners).
 */

// ─── UI CORE & MODAL CONTROLLER ───────────────────────────────────────────
import './ui/navigation.js';
import { showToast, copyToClipboard } from './ui/toast.js';
import { closeAnyActiveModal, initModalListeners } from './ui/modal.js';
import { initI18n, toggleLanguage, setLanguage, getLanguage } from './ui/i18n.js';
import {
  getMode,
  setMode,
  isPemula,
  isAhli,
  hasModePreference,
  applyModeToUI,
  toggleMode,
  showOnboardingModal,
  closeOnboardingModal,
  pilihModeAwal,
  initModeFeature
} from './ui/mode.js';

// ─── DOMAIN FEATURES & WIRING ─────────────────────────────────────────────
import { wireKalenderFeature, initQuickTodayBadge } from './features/kalender.js';
import { wireJodohFeature } from './features/jodoh.js';
import { wireSelametanFeature } from './features/selametan.js';
import { wireAksaraFeature } from './features/aksara.js';
import { wireWayangFeature } from './features/wayang.js';
import { wireAudioFeature } from './features/audio.js';
import {
  wireNujumFeature,
  loadScript,
  ensureNujumLoaded,
  ensurePituturLoaded,
  ensureWukuLoaded,
  ensureTumpengLoaded
} from './features/nujum.js';

// ─── SAPA DINA (PHASE II) ───────────────────────────────────────────────────
import { wireSapaDinaFeature, initSapaDina } from './features/sapa-dina.js';

// ─── PETUNG IJAB & PETUNG OMAH (NEW MODULES) ──────────────────────────────
import { initIjabUI, syncIjabDariTanggal, hitungIjabDariUI } from './modules/ijab/ijab-ui.js';
import { initOmahUI, syncOmahDariTanggal, hitungOmahDariUI } from './modules/omah/omah-ui.js';

// ─── PETUNG TERNAK, LORO, & GEBLAK (PETUNG KEHIDUPAN) ──────────────────────
import {
  initTernakUI,
  syncTernakDariTanggal,
  hitungTernakDariSelect,
  switchTernakSubtab,
  konfirmasiBukaGeblak
} from './modules/petung-kehidupan/petung-kehidupan-ui.js';

// ─── SASMITHA (TANDA ALAM & TUBUH) ────────────────────────────────────────
import {
  initSasmithaUI,
  switchSasmithaSubtab,
  onImpenSearchInput,
  onKedutSearchInput,
  onKedutCategorySelect,
  onGerhanaSasiSelect,
  onLinduSasiSelect,
  onLinduWaktuToggle
} from './modules/sasmitha/sasmitha-ui.js';

// ─── INITIAL WIRING TO WINDOW (THIN WRAPPERS UNTUK INLINE HTML ONCLICK) ────
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.copyToClipboard = copyToClipboard;
  window.toggleLanguage = toggleLanguage;
  window.setLanguage = setLanguage;
  window.getLanguage = getLanguage;
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

  // Ijab & Omah bindings
  window.initIjabUI = initIjabUI;
  window.syncIjabDariTanggal = syncIjabDariTanggal;
  window.hitungIjabDariUI = hitungIjabDariUI;
  window.initOmahUI = initOmahUI;
  window.syncOmahDariTanggal = syncOmahDariTanggal;
  window.hitungOmahDariUI = hitungOmahDariUI;

  // Ternak, Loro, & Geblak bindings
  window.initTernakUI = initTernakUI;
  window.syncTernakDariTanggal = syncTernakDariTanggal;
  window.hitungTernakDariSelect = hitungTernakDariSelect;
  window.switchTernakSubtab = switchTernakSubtab;
  window.konfirmasiBukaGeblak = konfirmasiBukaGeblak;

  // Sasmitha bindings
  window.initSasmithaUI = initSasmithaUI;
  window.switchSasmithaSubtab = switchSasmithaSubtab;
  window.onImpenSearchInput = onImpenSearchInput;
  window.onKedutSearchInput = onKedutSearchInput;
  window.onKedutCategorySelect = onKedutCategorySelect;
  window.onGerhanaSasiSelect = onGerhanaSasiSelect;
  window.onLinduSasiSelect = onLinduSasiSelect;
  window.onLinduWaktuToggle = onLinduWaktuToggle;
}

wireKalenderFeature();
wireJodohFeature();
wireSelametanFeature();
wireAksaraFeature();
wireWayangFeature();
wireAudioFeature();
wireNujumFeature();
wireSapaDinaFeature(); // Phase II: Sapa Dina

// ─── TAB SWITCHING & LAZY-LOAD ORCHESTRATOR ───────────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('tab-switched', async function (e) {
    const tabId = e.detail?.tabId;
    if (!tabId) return;

    switch (tabId) {
      case 'kepribadian':
        await ensureNujumLoaded();
        break;

      case 'wuku':
        await ensureWukuLoaded();
        if (typeof window.renderFullWukuPage === 'function') {
          window.renderFullWukuPage();
        }
        break;

      case 'perjodohan':
        if (typeof window.initPerjodohanSelects === 'function') {
          window.initPerjodohanSelects();
        }
        break;

      case 'selametan':
        if (typeof window.hitungSelametan === 'function') {
          window.hitungSelametan();
        }
        break;

      case 'ijab':
        if (typeof window.initIjabUI === 'function') {
          window.initIjabUI();
        }
        break;

      case 'omah':
        if (typeof window.initOmahUI === 'function') {
          window.initOmahUI();
        }
        break;

      case 'ternak':
        if (typeof window.initTernakUI === 'function') {
          window.initTernakUI();
        }
        break;

      case 'sasmitha':
        if (typeof window.initSasmithaUI === 'function') {
          window.initSasmithaUI();
        }
        break;

      case 'tanggal-jawa':
        if (typeof window.renderKonversiTanggalJawa === 'function') {
          window.renderKonversiTanggalJawa();
        }
        break;

      case 'gamelan':
        if (typeof window.renderGamelanKeys === 'function') {
          window.renderGamelanKeys();
        }
        break;

      case 'aksara':
        if (typeof window.renderAksaraKeyboardPalette === 'function') window.renderAksaraKeyboardPalette();
        if (typeof window.initDrawingCanvas === 'function') window.initDrawingCanvas();
        if (typeof window.renderSandhanganGuidePanel === 'function') window.renderSandhanganGuidePanel();
        if (typeof window.restartAksaraQuiz === 'function') window.restartAksaraQuiz();
        break;

      case 'wayang':
        if (typeof window.renderWayangGrid === 'function') window.renderWayangGrid();
        if (typeof window.initWayangDraggable === 'function') window.initWayangDraggable();
        if (typeof window.renderWayangEthicsBanner === 'function') window.renderWayangEthicsBanner();
        if (typeof window.selectWayangCharacter === 'function') window.selectWayangCharacter('arjuna');
        break;

      case 'pitutur':
        await ensurePituturLoaded();
        break;

      case 'tumpeng':
        await ensureTumpengLoaded();
        break;

      case 'tripurusa':
        {
          const tripurusaModule = await import('./modules/budaya/tripurusa.js');
          if (tripurusaModule && typeof tripurusaModule.renderTripurusaModule === 'function') {
            tripurusaModule.renderTripurusaModule('tripurusaContentContainer');
          }
        }
        break;

      case 'ensiklopedia-budaya':
        {
          const ensikloModule = await import('./modules/budaya/ensiklopedia-budaya.js');
          if (ensikloModule && typeof ensikloModule.renderEnsiklopediaBudayaPage === 'function') {
            ensikloModule.renderEnsiklopediaBudayaPage('ensiklopediaBudayaContainer');
          }
        }
        break;
    }
  });
}

// ─── SERVICE WORKER REGISTRATION ──────────────────────────────────────────
function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker terdaftar dengan scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Gagal meregistrasi Service Worker:', err);
        });
    });
  }
}

// ─── BOOTSTRAP INITIAL APPLICATION STATE ──────────────────────────────────
export function bootstrap() {
  initI18n();
  initModeFeature();
  registerServiceWorker();

  if (typeof window.initKalenderSelects === 'function') window.initKalenderSelects();
  if (typeof window.renderKalender === 'function') window.renderKalender();
  initQuickTodayBadge();

  // Phase II: Sapa Dina — Ringkasan Harian (inisialisasi setelah kalender)
  initSapaDina('sapa-dina-container');

  if (typeof window.initPerjodohanSelects === 'function') window.initPerjodohanSelects();
  if (typeof window.initIjabUI === 'function') window.initIjabUI();
  if (typeof window.initOmahUI === 'function') window.initOmahUI();
  if (typeof window.initTernakUI === 'function') window.initTernakUI();
  if (typeof window.initSasmithaUI === 'function') window.initSasmithaUI();

  // Inisialisasi dropdown Tahun Hitung Nujum agar selalu terisi sejak awal
  const selTahun = document.getElementById('tahunHitungKepribadian');
  if (selTahun && selTahun.children.length === 0) {
    const curY = new Date().getFullYear();
    for (let y = 1940; y <= 2050; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `${y} M`;
      if (y === curY) opt.selected = true;
      selTahun.appendChild(opt);
    }
  }

  initModalListeners();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
}

// ─── BACKWARD COMPATIBLE EXPORTS ───────────────────────────────────────────
export {
  loadScript,
  ensureNujumLoaded,
  ensurePituturLoaded,
  ensureWukuLoaded,
  ensureTumpengLoaded,
  initQuickTodayBadge,
  closeAnyActiveModal,
  initModalListeners,
  registerServiceWorker,
  initI18n,
  toggleLanguage,
  setLanguage,
  getLanguage,
  getMode,
  setMode,
  isPemula,
  isAhli,
  hasModePreference,
  applyModeToUI,
  toggleMode
};
