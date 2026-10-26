/**
 * Jagad Jawa — Feature: Perjodohan (Pitung Jawa 7 Metode & Pawiwahan Mantu)
 * Mengikat logika kalkulasi pitung, antarmuka pemilihan weton, riwayat jodoh, dan rekomendasi mantu ke window.
 */

import {
  hitungPitung7Metode,
  autoDetectAksara,
  getAksaraVal,
  cariRekomendasiTanggalMantu,
  getTingkatKeharmonisan,
  DISCLAIMER_ETIS_PERJODOHAN
} from '../modules/jodoh/jodoh-engine.js';

import {
  initPerjodohanSelects,
  autoDetectAksaraUI,
  autoWetonPerjodohan,
  updateNeptuPerjodohan,
  hitungNujumPerjodohan,
  renderVisualScoreBar,
  renderRekomendasiMantu,
  setMantuRentang,
  toggleMantuHanyaUtama,
  simpanMantuKeBookmark,
  renderRiwayatPerjodohan,
  loadRiwayatPerjodohan,
  hapusRiwayatPerjodohan,
  clearAllRiwayatPerjodohan,
  printLaporanPerjodohan,
  onStatusHubunganChange,
  setJodohWizardStep,
  toggleAccordion7Metode,
  navigateToIjabDariMantu
} from '../modules/jodoh/jodoh-ui.js';

import {
  saveJodohHistory,
  getJodohHistory,
  deleteJodohHistoryItem,
  clearAllJodohHistory
} from '../modules/jodoh/jodoh-history.js';

/**
 * Mengikat fungsi domain Perjodohan ke window untuk kompatibilitas inline HTML
 */
export function wireJodohFeature() {
  if (typeof window === 'undefined') return;

  window.autoDetectAksara = autoDetectAksaraUI;
  window.autoWetonPerjodohan = autoWetonPerjodohan;
  window.updateNeptuPerjodohan = updateNeptuPerjodohan;
  window.hitungNujumPerjodohan = hitungNujumPerjodohan;
  window.initPerjodohanSelects = initPerjodohanSelects;
  window.hitungPitung7Metode = hitungPitung7Metode;
  window.cariRekomendasiTanggalMantu = cariRekomendasiTanggalMantu;
  window.getTingkatKeharmonisan = getTingkatKeharmonisan;
  window.DISCLAIMER_ETIS_PERJODOHAN = DISCLAIMER_ETIS_PERJODOHAN;
  window.renderVisualScoreBar = renderVisualScoreBar;
  window.renderRekomendasiMantu = renderRekomendasiMantu;
  window.setMantuRentang = setMantuRentang;
  window.toggleMantuHanyaUtama = toggleMantuHanyaUtama;
  window.simpanMantuKeBookmark = simpanMantuKeBookmark;
  window.renderRiwayatPerjodohan = renderRiwayatPerjodohan;
  window.loadRiwayatPerjodohan = loadRiwayatPerjodohan;
  window.hapusRiwayatPerjodohan = hapusRiwayatPerjodohan;
  window.clearAllRiwayatPerjodohan = clearAllRiwayatPerjodohan;
  window.printLaporanPerjodohan = printLaporanPerjodohan;
  window.saveJodohHistory = saveJodohHistory;
  window.getJodohHistory = getJodohHistory;
  window.deleteJodohHistoryItem = deleteJodohHistoryItem;
  window.clearAllJodohHistory = clearAllJodohHistory;
  window.onStatusHubunganChange = onStatusHubunganChange;
  window.setJodohWizardStep = setJodohWizardStep;
  window.toggleAccordion7Metode = toggleAccordion7Metode;
  window.navigateToIjabDariMantu = navigateToIjabDariMantu;
}

export {
  hitungPitung7Metode,
  autoDetectAksara,
  getAksaraVal,
  cariRekomendasiTanggalMantu,
  getTingkatKeharmonisan,
  DISCLAIMER_ETIS_PERJODOHAN,
  initPerjodohanSelects,
  autoDetectAksaraUI,
  autoWetonPerjodohan,
  updateNeptuPerjodohan,
  hitungNujumPerjodohan,
  renderVisualScoreBar,
  renderRekomendasiMantu,
  setMantuRentang,
  toggleMantuHanyaUtama,
  simpanMantuKeBookmark,
  renderRiwayatPerjodohan,
  loadRiwayatPerjodohan,
  hapusRiwayatPerjodohan,
  clearAllRiwayatPerjodohan,
  printLaporanPerjodohan,
  saveJodohHistory,
  getJodohHistory,
  deleteJodohHistoryItem,
  clearAllJodohHistory
};
