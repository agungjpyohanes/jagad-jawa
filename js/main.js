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
import { showToast, copyToClipboard } from './ui/toast.js';
import { closeAnyActiveModal, initModalListeners } from './ui/modal.js';

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

// ─── INITIAL WIRING TO WINDOW (THIN WRAPPERS UNTUK INLINE HTML ONCLICK) ────
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.copyToClipboard = copyToClipboard;
}

wireKalenderFeature();
wireJodohFeature();
wireSelametanFeature();
wireAksaraFeature();
wireWayangFeature();
wireAudioFeature();
wireNujumFeature();

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
    }
  });
}

// ─── BOOTSTRAP INITIAL APPLICATION STATE ──────────────────────────────────
export function bootstrap() {
  if (typeof window.initKalenderSelects === 'function') window.initKalenderSelects();
  if (typeof window.renderKalender === 'function') window.renderKalender();
  initQuickTodayBadge();

  if (typeof window.initPerjodohanSelects === 'function') window.initPerjodohanSelects();
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
  initModalListeners
};
