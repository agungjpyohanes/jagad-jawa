/**
 * Jagad Jawa — Feature: Aksara Jawa & Kuis Budaya
 * Mengikat logika transliterasi Carakan, keyboard virtual, canvas gambar, dan kuis edukasi ke window.
 */

import { transliterateLatinToJawa } from '../modules/aksara/aksara-engine.js';
import {
  switchAksaraKeyboardTab,
  renderAksaraKeyboardPalette,
  convertLatinToJawa,
  insertAksaraChar,
  clearAksaraInput,
  copyAksaraOutput,
  initDrawingCanvas,
  clearCanvas,
  renderSandhanganGuidePanel,
  restartAksaraQuiz,
  renderAksaraQuizQuestion,
  selectAksaraQuizAnswer,
  showAksaraQuizResult,
  SANDHANGAN_GUIDE_DATA,
  AKSARA_QUIZ_QUESTIONS
} from '../modules/aksara/aksara-ui.js';

/**
 * Mengikat fungsi domain Aksara Jawa ke window untuk kompatibilitas inline HTML
 */
export function wireAksaraFeature() {
  if (typeof window === 'undefined') return;

  window.switchAksaraKeyboardTab = switchAksaraKeyboardTab;
  window.renderAksaraKeyboardPalette = renderAksaraKeyboardPalette;
  window.convertLatinToJawa = convertLatinToJawa;
  window.insertAksaraChar = insertAksaraChar;
  window.clearAksaraInput = clearAksaraInput;
  window.copyAksaraOutput = copyAksaraOutput;
  window.initDrawingCanvas = initDrawingCanvas;
  window.clearCanvas = clearCanvas;
  window.transliterateLatinToJawa = transliterateLatinToJawa;
  window.renderSandhanganGuidePanel = renderSandhanganGuidePanel;
  window.restartAksaraQuiz = restartAksaraQuiz;
  window.renderAksaraQuizQuestion = renderAksaraQuizQuestion;
  window.selectAksaraQuizAnswer = selectAksaraQuizAnswer;
  window.showAksaraQuizResult = showAksaraQuizResult;
  window.SANDHANGAN_GUIDE_DATA = SANDHANGAN_GUIDE_DATA;
  window.AKSARA_QUIZ_QUESTIONS = AKSARA_QUIZ_QUESTIONS;
}

export {
  transliterateLatinToJawa,
  switchAksaraKeyboardTab,
  renderAksaraKeyboardPalette,
  convertLatinToJawa,
  insertAksaraChar,
  clearAksaraInput,
  copyAksaraOutput,
  initDrawingCanvas,
  clearCanvas,
  renderSandhanganGuidePanel,
  restartAksaraQuiz,
  renderAksaraQuizQuestion,
  selectAksaraQuizAnswer,
  showAksaraQuizResult,
  SANDHANGAN_GUIDE_DATA,
  AKSARA_QUIZ_QUESTIONS
};
