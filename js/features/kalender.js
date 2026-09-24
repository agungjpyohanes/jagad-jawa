/**
 * Jagad Jawa — Feature: Kalender Jawa, Pranata Mangsa, & Weton
 * Mengikat logika antarmuka, bookmark, share-card, dan fungsi kalkulasi kalender ke namespace global/window.
 */

import {
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  BULAN_JAWA,
  WINDU,
  WUKU,
  DUNUNGE,
  GRID,
  KETERANGAN,
  EPOCH_JDN,
  toJDN,
  jdnToIslamic,
  getDayInfo,
  getTanggalJawaLengkap,
  getLiburNasional,
  getDaysInMonth,
  getNeptu,
  evaluateDino,
  checkDinoGede,
  isDinoGede,
  isDinoIjo,
  getDinoWarnaStatus,
  getKeteranganKodeDetail,
  getPranataMangsaLengkap
} from '../modules/kalender/kalender-engine.js';

import {
  initKalenderSelects,
  buildWatermarkKalender,
  renderKalender,
  bukaDetailTanggalJawa,
  tutupDetailTanggalJawa,
  filterKalender,
  renderKonversiTanggalJawa,
  hitungNujumDariTanggalJawa,
  simpanBookmarkTanggal,
  hapusBookmarkTanggal,
  renderBookmarkListPanel,
  printLaporanKalender,
  downloadKalenderPng,
  setKalenderViewMode,
  toggleKalenderViewMode,
  renderKalenderListView
} from '../modules/kalender/kalender-ui.js';

import {
  saveBookmark,
  deleteBookmark,
  getBookmarks,
  getBookmarkByDate,
  KATEGORI_BOOKMARK
} from '../modules/kalender/bookmark-service.js';

import {
  openWetonShareModal,
  closeWetonShareModal,
  shareWetonViaWhatsApp,
  downloadShareCardPng,
  buildWhatsAppShareText
} from '../modules/kalender/share-card.js';

import { getPetungTetanen } from '../data/petung-tetanen-db.js';
import { getWukuPetenget } from '../data/wuku-petenget-db.js';

/**
 * Inisialisasi Badge Cepat Weton Hari Ini di Navbar/Header
 */
export function initQuickTodayBadge() {
  const today = new Date();
  const info = getDayInfo(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const dino = HARI[info.weekdayId];
  const pas = PASARAN[info.pasaranId];
  const neptu = NEPTU_HARI[info.weekdayId] + NEPTU_PASARAN[info.pasaranId];
  const wukuName = WUKU[info.wukuId];
  const el = document.getElementById('quickTodayWetonText');
  if (el) el.innerText = `${dino} ${pas} (${neptu}) · Wuku ${wukuName}`;
}

/**
 * Mengikat fungsi & konstanta domain Kalender ke window untuk kompatibilitas inline HTML
 */
export function wireKalenderFeature() {
  if (typeof window === 'undefined') return;

  // Konstanta & Engine
  window.HARI = HARI;
  window.NEPTU_HARI = NEPTU_HARI;
  window.PASARAN = PASARAN;
  window.NEPTU_PASARAN = NEPTU_PASARAN;
  window.BULAN_MASEHI = BULAN_MASEHI;
  window.BULAN_JAWA = BULAN_JAWA;
  window.WINDU = WINDU;
  window.WUKU = WUKU;
  window.DUNUNGE = DUNUNGE;
  window.GRID = GRID;
  window.KETERANGAN = KETERANGAN;
  window.EPOCH_JDN = EPOCH_JDN;
  window.toJDN = toJDN;
  window.jdnToIslamic = jdnToIslamic;
  window.getDayInfo = getDayInfo;
  window.getTanggalJawaLengkap = getTanggalJawaLengkap;
  window.getLiburNasional = getLiburNasional;
  window.getDaysInMonth = getDaysInMonth;
  window.getNeptu = getNeptu;
  window.evaluateDino = evaluateDino;
  window.checkDinoGede = checkDinoGede;
  window.isDinoGede = isDinoGede;
  window.isDinoIjo = isDinoIjo;
  window.getDinoWarnaStatus = getDinoWarnaStatus;
  window.getKeteranganKodeDetail = getKeteranganKodeDetail;
  window.getPranataMangsaLengkap = getPranataMangsaLengkap;

  // Kalender UI
  window.initKalenderSelects = initKalenderSelects;
  window.renderKalender = renderKalender;
  window.bukaDetailTanggalJawa = bukaDetailTanggalJawa;
  window.tutupDetailTanggalJawa = tutupDetailTanggalJawa;
  window.filterKalender = filterKalender;
  window.renderKonversiTanggalJawa = renderKonversiTanggalJawa;
  window.hitungNujumDariTanggalJawa = hitungNujumDariTanggalJawa;
  window.simpanBookmarkTanggal = simpanBookmarkTanggal;
  window.hapusBookmarkTanggal = hapusBookmarkTanggal;
  window.renderBookmarkListPanel = renderBookmarkListPanel;
  window.printLaporanKalender = printLaporanKalender;
  window.downloadKalenderPng = downloadKalenderPng;
  window.setKalenderViewMode = setKalenderViewMode;
  window.toggleKalenderViewMode = toggleKalenderViewMode;
  window.renderKalenderListView = renderKalenderListView;

  // Bookmark Service
  window.saveBookmark = saveBookmark;
  window.deleteBookmark = deleteBookmark;
  window.getBookmarks = getBookmarks;
  window.getBookmarkByDate = getBookmarkByDate;
  window.KATEGORI_BOOKMARK = KATEGORI_BOOKMARK;

  // Share Card Weton
  window.openWetonShareModal = openWetonShareModal;
  window.closeWetonShareModal = closeWetonShareModal;
  window.shareWetonViaWhatsApp = shareWetonViaWhatsApp;
  window.downloadShareCardPng = downloadShareCardPng;
  window.buildWhatsAppShareText = buildWhatsAppShareText;

  // Petung Tetanen & Petenget Wuku
  window.getPetungTetanen = getPetungTetanen;
  window.getWukuPetenget = getWukuPetenget;
}

export {
  HARI,
  NEPTU_HARI,
  PASARAN,
  NEPTU_PASARAN,
  BULAN_MASEHI,
  BULAN_JAWA,
  WINDU,
  WUKU,
  DUNUNGE,
  GRID,
  KETERANGAN,
  EPOCH_JDN,
  toJDN,
  jdnToIslamic,
  getDayInfo,
  getTanggalJawaLengkap,
  getLiburNasional,
  getDaysInMonth,
  getNeptu,
  evaluateDino,
  checkDinoGede,
  isDinoGede,
  isDinoIjo,
  getDinoWarnaStatus,
  getKeteranganKodeDetail,
  getPranataMangsaLengkap,
  initKalenderSelects,
  buildWatermarkKalender,
  renderKalender,
  bukaDetailTanggalJawa,
  tutupDetailTanggalJawa,
  filterKalender,
  renderKonversiTanggalJawa,
  hitungNujumDariTanggalJawa,
  simpanBookmarkTanggal,
  hapusBookmarkTanggal,
  renderBookmarkListPanel,
  printLaporanKalender,
  downloadKalenderPng,
  setKalenderViewMode,
  toggleKalenderViewMode,
  renderKalenderListView,
  saveBookmark,
  deleteBookmark,
  getBookmarks,
  getBookmarkByDate,
  KATEGORI_BOOKMARK,
  openWetonShareModal,
  closeWetonShareModal,
  shareWetonViaWhatsApp,
  downloadShareCardPng,
  buildWhatsAppShareText,
  getPetungTetanen,
  getWukuPetenget
};
