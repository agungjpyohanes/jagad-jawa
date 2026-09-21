/**
 * Jagad Jawa — Feature: Selametan (Pengetan Tilar Donyo)
 * Mengikat logika kalkulasi 7 target haul/pengetan, visual timeline, dan ekspor dokumen ke window.
 */

import { hitungSelametanDates, SELAMETAN_KULTURAL_DATA } from '../modules/selametan/selametan-engine.js';
import {
  hitungSelametan,
  renderTimelineSelametan,
  simpanSelametanKeBookmark,
  printLaporanSelametan,
  downloadSelametanPng
} from '../modules/selametan/selametan-ui.js';

/**
 * Mengikat fungsi domain Selametan ke window untuk kompatibilitas inline HTML
 */
export function wireSelametanFeature() {
  if (typeof window === 'undefined') return;

  window.hitungSelametan = hitungSelametan;
  window.hitungSelametanDates = hitungSelametanDates;
  window.SELAMETAN_KULTURAL_DATA = SELAMETAN_KULTURAL_DATA;
  window.renderTimelineSelametan = renderTimelineSelametan;
  window.simpanSelametanKeBookmark = simpanSelametanKeBookmark;
  window.printLaporanSelametan = printLaporanSelametan;
  window.downloadSelametanPng = downloadSelametanPng;
}

export {
  hitungSelametanDates,
  SELAMETAN_KULTURAL_DATA,
  hitungSelametan,
  renderTimelineSelametan,
  simpanSelametanKeBookmark,
  printLaporanSelametan,
  downloadSelametanPng
};
