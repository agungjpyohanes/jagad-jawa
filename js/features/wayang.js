/**
 * Jagad Jawa — Feature: Wayang Purwa & Etika Kultural
 * Mengikat logika direktori tokoh wayang, galeri visual, drag-and-drop, modal detail, dan etika non-stereotip ke window.
 */

import { getWayangById, filterWayangList } from '../modules/wayang/wayang-engine.js';
import {
  renderWayangGrid,
  filterWayang,
  filterWayangCategory,
  selectWayangCharacter,
  openWayangDetailModal,
  closeWayangDetailModal,
  initWayangDraggable,
  renderWayangEthicsBanner,
  DISCLAIMER_ETIS_WAYANG
} from '../modules/wayang/wayang-ui.js';

/**
 * Mengikat fungsi domain Wayang ke window untuk kompatibilitas inline HTML
 */
export function wireWayangFeature() {
  if (typeof window === 'undefined') return;

  window.renderWayangGrid = renderWayangGrid;
  window.filterWayang = filterWayang;
  window.filterWayangCategory = filterWayangCategory;
  window.selectWayangCharacter = selectWayangCharacter;
  window.openWayangDetailModal = openWayangDetailModal;
  window.closeWayangDetailModal = closeWayangDetailModal;
  window.initWayangDraggable = initWayangDraggable;
  window.renderWayangEthicsBanner = renderWayangEthicsBanner;
  window.DISCLAIMER_ETIS_WAYANG = DISCLAIMER_ETIS_WAYANG;
}

export {
  getWayangById,
  filterWayangList,
  renderWayangGrid,
  filterWayang,
  filterWayangCategory,
  selectWayangCharacter,
  openWayangDetailModal,
  closeWayangDetailModal,
  initWayangDraggable,
  renderWayangEthicsBanner,
  DISCLAIMER_ETIS_WAYANG
};
