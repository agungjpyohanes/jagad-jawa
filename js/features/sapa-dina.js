/**
 * Jagad Jawa — Feature: Sapa Dina (Ringkasan Harian)
 * Thin wire layer — mengikat fungsi UI + engine ke window namespace
 * agar bisa dipanggil dari inline HTML (onclick) maupun modul lain.
 *
 * Pola konsisten dengan wireKalenderFeature(), wireNujumFeature(), dll.
 */

import {
  renderSapaDina,
  dismissSapaDina,
  expandSapaDina,
  shareSapaDinaToday,
  initSapaDina,
  isSapaDinaDismissed,
  buildSapaDinaShareText
} from '../modules/sapa-dina/sapa-dina-ui.js';

import {
  getSapaDinaData,
  getDayOfYear,
  getPituturHarian
} from '../modules/sapa-dina/sapa-dina-engine.js';

/**
 * Ikat semua fungsi Sapa Dina ke window untuk kompatibilitas inline HTML onclick.
 * Dipanggil dari main.js sebelum bootstrap().
 */
export function wireSapaDinaFeature() {
  if (typeof window === 'undefined') return;

  // UI Functions (dipanggil dari onclick di HTML)
  window.renderSapaDina       = renderSapaDina;
  window.dismissSapaDina      = dismissSapaDina;
  window.expandSapaDina       = expandSapaDina;
  window.shareSapaDinaToday   = shareSapaDinaToday;
  window.isSapaDinaDismissed  = isSapaDinaDismissed;
  window.buildSapaDinaShareText = buildSapaDinaShareText;

  // Engine Functions
  window.getSapaDinaData      = getSapaDinaData;
  window.getDayOfYear         = getDayOfYear;
  window.getPituturHarian     = getPituturHarian;
}

// Re-export untuk konsumsi di main.js
export {
  renderSapaDina,
  dismissSapaDina,
  expandSapaDina,
  shareSapaDinaToday,
  initSapaDina,
  isSapaDinaDismissed,
  buildSapaDinaShareText,
  getSapaDinaData,
  getDayOfYear,
  getPituturHarian
};
