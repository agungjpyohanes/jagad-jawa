// =========================================================================
// jawa-v2 – single source nujum, exact lookup
// DEPRECATED: Disatukan ke js/data/nujum-matrix.js & js/data/pawukon.js
// Berkas ini dipertahankan murni sebagai proxy / re-export kompatibilitas legacy.
// =========================================================================

import nujumMatrixPkg, {
  KET_BINCIL,
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

import pawukonPkg, {
  PAWUKON_LIST,
  pawukonDatabase,
  MASTER_PAWUKON,
  getPawukonData,
  getPawukonDetail
} from './pawukon.js';

const MASTER_KET_BINCIL = KET_BINCIL;
const MASTER_BINCIL_MATRIX = bincilDatabase;
const getNujumResult = getNujumFromMatrix;

(function (root) {
  root.MASTER_KET_BINCIL = MASTER_KET_BINCIL;
  root.MASTER_PAWUKON = MASTER_PAWUKON;
  root.PAWUKON_LIST = PAWUKON_LIST;
  root.MASTER_BINCIL_MATRIX = MASTER_BINCIL_MATRIX;
  root.getNujumResult = getNujumResult;
  root.getPawukonDetail = getPawukonDetail;
  root.getPawukonData = getPawukonData;
  root.getNujumData = getNujumData;
  root.bincilDatabase = bincilDatabase;
  root.primbonMatrix = primbonMatrix;
  root.nujumMatrix = nujumMatrix;
  root.nujumDatabase = nujumDatabase;
  root.pawukonDatabase = pawukonDatabase;
  root.KET_BINCIL = KET_BINCIL;
  root.PADEWAN_ARTI = KET_BINCIL.padewan;
  root.PARINGKELAN_ARTI = KET_BINCIL.paringkelan;
  root.PANDANGON_ARTI = KET_BINCIL.pandangon;
  root.PAARASAN_ARTI = KET_BINCIL.paarasan;
  root.PANCASUDA_ARTI = KET_BINCIL.pancasuda;
  root.KAMAROKAN_ARTI = KET_BINCIL.kamarokan;
  root.CANON_WUKU_LIST = CANON_WUKU_LIST;
  root.normalizeWukuName = normalizeWukuName;
  root.getNujumFromMatrix = getNujumFromMatrix;
  root.getNujumFromDatabase = getNujumFromDatabase;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MASTER_KET_BINCIL,
      MASTER_PAWUKON,
      PAWUKON_LIST,
      MASTER_BINCIL_MATRIX,
      getNujumResult,
      getPawukonDetail,
      getPawukonData,
      getNujumData,
      bincilDatabase,
      primbonMatrix,
      nujumMatrix,
      nujumDatabase,
      pawukonDatabase,
      KET_BINCIL,
      CANON_WUKU_LIST,
      normalizeWukuName,
      getNujumFromMatrix,
      getNujumFromDatabase
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

export {
  MASTER_KET_BINCIL,
  MASTER_PAWUKON,
  PAWUKON_LIST,
  MASTER_BINCIL_MATRIX,
  getNujumResult,
  getPawukonDetail,
  getPawukonData,
  getNujumData,
  bincilDatabase,
  primbonMatrix,
  nujumMatrix,
  nujumDatabase,
  pawukonDatabase,
  KET_BINCIL,
  CANON_WUKU_LIST,
  normalizeWukuName,
  getNujumFromMatrix,
  getNujumFromDatabase
};

export default {
  MASTER_KET_BINCIL,
  MASTER_PAWUKON,
  PAWUKON_LIST,
  MASTER_BINCIL_MATRIX,
  getNujumResult,
  getPawukonDetail,
  getPawukonData,
  getNujumData,
  bincilDatabase,
  primbonMatrix,
  nujumMatrix,
  nujumDatabase,
  pawukonDatabase,
  KET_BINCIL,
  CANON_WUKU_LIST,
  normalizeWukuName,
  getNujumFromMatrix,
  getNujumFromDatabase
};
