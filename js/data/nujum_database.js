// =========================================================================
// jawa-v2 – single source nujum, exact lookup
// DEPRECATED: Disatukan ke js/data/nujum-matrix.js
// Berkas ini dipertahankan murni sebagai proxy / re-export kompatibilitas legacy.
// =========================================================================

import nujumMatrixPkg, {
  KET_BINCIL,
  PADEWAN_ARTI,
  PARINGKELAN_ARTI,
  PANDANGON_ARTI,
  PAARASAN_ARTI,
  PANCASUDA_ARTI,
  KAMAROKAN_ARTI,
  BINCIL_LIST,
  bincilDatabase,
  primbonMatrix,
  nujumMatrix,
  nujumDatabase,
  CANON_WUKU_LIST,
  normalizeWukuName,
  getNujumData,
  getNujumFromMatrix,
  getNujumFromDatabase
} from './nujum-matrix.js';

(function (root) {
  root.KET_BINCIL = KET_BINCIL;
  root.PADEWAN_ARTI = PADEWAN_ARTI;
  root.PARINGKELAN_ARTI = PARINGKELAN_ARTI;
  root.PANDANGON_ARTI = PANDANGON_ARTI;
  root.PAARASAN_ARTI = PAARASAN_ARTI;
  root.PANCASUDA_ARTI = PANCASUDA_ARTI;
  root.KAMAROKAN_ARTI = KAMAROKAN_ARTI;
  root.BINCIL_LIST = BINCIL_LIST;
  root.bincilDatabase = bincilDatabase;
  root.primbonMatrix = primbonMatrix;
  root.nujumMatrix = nujumMatrix;
  root.nujumDatabase = nujumDatabase;
  root.CANON_WUKU_LIST = CANON_WUKU_LIST;
  root.normalizeWukuName = normalizeWukuName;
  root.getNujumData = getNujumData;
  root.getNujumFromMatrix = getNujumFromMatrix;
  root.getNujumFromDatabase = getNujumFromDatabase;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      KET_BINCIL,
      PADEWAN_ARTI,
      PARINGKELAN_ARTI,
      PANDANGON_ARTI,
      PAARASAN_ARTI,
      PANCASUDA_ARTI,
      KAMAROKAN_ARTI,
      BINCIL_LIST,
      bincilDatabase,
      primbonMatrix,
      nujumMatrix,
      nujumDatabase,
      CANON_WUKU_LIST,
      normalizeWukuName,
      getNujumData,
      getNujumFromMatrix,
      getNujumFromDatabase
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

export {
  KET_BINCIL,
  PADEWAN_ARTI,
  PARINGKELAN_ARTI,
  PANDANGON_ARTI,
  PAARASAN_ARTI,
  PANCASUDA_ARTI,
  KAMAROKAN_ARTI,
  BINCIL_LIST,
  bincilDatabase,
  primbonMatrix,
  nujumMatrix,
  nujumDatabase,
  CANON_WUKU_LIST,
  normalizeWukuName,
  getNujumData,
  getNujumFromMatrix,
  getNujumFromDatabase
};

export default nujumMatrixPkg;
