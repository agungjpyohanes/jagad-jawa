/**
 * Jagad Jawa — Feature: Audio & Gamelan Pelog/Slendro
 * Mengikat Web Audio API gamelan synthesizer, gending Ketawang Puspawarna, dan sound FX dalang ke window.
 */

import {
  initAudio,
  playGamelanTone,
  playDalangFX,
  toggleKetawangPuspawarna,
  renderGamelanKeys,
  setGamelanLaras,
  hitBonang
} from '../modules/audio/audio.js';

/**
 * Mengikat fungsi domain Audio ke window untuk kompatibilitas inline HTML
 */
export function wireAudioFeature() {
  if (typeof window === 'undefined') return;

  window.initAudio = initAudio;
  window.playGamelanTone = playGamelanTone;
  window.playDalangFX = playDalangFX;
  window.toggleKetawangPuspawarna = toggleKetawangPuspawarna;
  window.renderGamelanKeys = renderGamelanKeys;
  window.setGamelanLaras = setGamelanLaras;
  window.hitBonang = hitBonang;
}

export {
  initAudio,
  playGamelanTone,
  playDalangFX,
  toggleKetawangPuspawarna,
  renderGamelanKeys,
  setGamelanLaras,
  hitBonang
};
