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
import './ui/navigation.js';
import { showToast, copyToClipboard } from './ui/toast.js';
import { closeAnyActiveModal, initModalListeners } from './ui/modal.js';
import { initI18n, toggleLanguage, setLanguage, getLanguage } from './ui/i18n.js';
import {
  getMode,
  setMode,
  isPemula,
  isAhli,
  hasModePreference,
  applyModeToUI,
  toggleMode,
  showOnboardingModal,
  closeOnboardingModal,
  pilihModeAwal,
  initModeFeature
} from './ui/mode.js';
import { initThemeFeature } from './ui/theme.js';
import { initKelirWayangFeature } from './ui/kelir-wayang.js';

// ─── DOMAIN FEATURES & WIRING ─────────────────────────────────────────────
import { wireKalenderFeature, initQuickTodayBadge } from './features/kalender.js';
import { printLaporanKalender, downloadKalenderPdf, downloadKalenderPng, resetKalenderToday } from './modules/kalender/kalender-ui.js';
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

// ─── SAPA DINA (PHASE II) ───────────────────────────────────────────────────
import { wireSapaDinaFeature, initSapaDina } from './features/sapa-dina.js';

// ─── PETUNG IJAB & PETUNG OMAH (NEW MODULES) ──────────────────────────────
import { initIjabUI, syncIjabDariTanggal, hitungIjabDariUI } from './modules/ijab/ijab-ui.js';
import { initOmahUI, syncOmahDariTanggal, hitungOmahDariUI, cariHariBaikOmahUI, pilihTanggalHasilCariOmah } from './modules/omah/omah-ui.js';

// ─── PETUNG TERNAK, LORO, & GEBLAK (PETUNG KEHIDUPAN) ──────────────────────
import {
  initTernakUI,
  syncTernakDariTanggal,
  hitungTernakDariSelect,
  switchTernakSubtab,
  konfirmasiBukaGeblak,
  cariHariPetungKehidupanUI,
  pilihTanggalHasilCariTernak
} from './modules/petung-kehidupan/petung-kehidupan-ui.js';

// ─── SASMITHA (TANDA ALAM & TUBUH) ────────────────────────────────────────
import {
  initSasmithaUI,
  switchSasmithaSubtab,
  onImpenSearchInput,
  onKedutSearchInput,
  onKedutCategorySelect,
  onGerhanaSasiSelect,
  onLinduSasiSelect,
  onLinduWaktuToggle,
  pilihTitikAnatomiKedut,
  setKedutViewMode
} from './modules/sasmitha/sasmitha-ui.js';

// ─── PUSTAKA DONGO, USADA & KAUTAMAN ──────────────────────────────────────
import {
  initPustakaUI,
  renderPustakaCards,
  switchPustakaKategori,
  onPustakaSearchInput,
  clearPustakaSearch,
  openPustakaReader,
  closePustakaReader,
  onPustakaNameChange,
  copyPustakaCurrentDoa,
  switchPustakaSubtab,
  onKautamanSearch,
  copyKautamanItem,
  onUsadaSearch,
  filterUsadaPenyakit,
  copyUsadaItem,
  copyKalacakraFull
} from './modules/pustaka/pustaka-ui.js';

// ─── PUSTAKA SINENGKER KHUSUS & KOMPAS DANYANG ─────────────────────────────
import {
  initSinengkerUI,
  submitSinengkerPin,
  lockSinengkerUI,
  switchSinengkerSubtab,
  onKompasDanyangSearch,
  setKompasDanyangSample,
  copyKompasDanyangResult,
  copyMendhemAriAri,
  copyUbarampePager,
  copySastraJendra,
  copyBodroSampir,
  copyKasedanJati,
  copyRosoSejati,
  copyAjiMantra,
  copyRuwatanMantra,
  openKompasImageZoomModal,
  closeKompasImageZoomModal,
  switchKompasViewMode
} from './modules/sinengker/sinengker-ui.js';

// ─── MITOLOGI NUSANTARA ───────────────────────────────────────────────────
import {
  initMitologiUI,
  openMitologiModal,
  closeMitologiModal,
  copyMitologiStory,
  toggleMitologiFontSize
} from './modules/budaya/mitologi-ui.js';

// ─── SAPA DINA & NUJUM VISUAL SHARE CARDS ──────────────────────────────────
import {
  openSapaDinaShareModal,
  closeSapaDinaShareModal,
  downloadSapaDinaCardPng,
  shareSapaDinaVisual
} from './modules/sapa-dina/sapa-dina-ui.js';

import {
  openNujumPokemonCardModal,
  closeNujumPokemonCardModal,
  downloadNujumPokemonCardPng,
  shareNujumPokemonCard,
  onNujumPokemonOptionChange,
  onNujumPokemonNameInput,
  generateDraftKartuKarakter,
  drawKartuKarakter,
  openKartuKarakterModal,
  closeKartuKarakterModal,
  downloadKartuKarakterPng,
  shareKartuKarakter
} from './modules/nujum/nujum-share-card.js';

// ─── 12 BATARA-BATARI (PADEWAN SIKLUS) ────────────────────────────────────
import {
  openPadewanModal,
  closePadewanModal,
  selectPadewanCard,
  renderPadewanGrid,
  renderPadewanDetail
} from './modules/budaya/padewan-ui.js';

// ─── INITIAL WIRING TO WINDOW (THIN WRAPPERS UNTUK INLINE HTML ONCLICK) ────
if (typeof window !== 'undefined') {
  window.openPadewanModal = openPadewanModal;
  window.closePadewanModal = closePadewanModal;
  window.selectPadewanCard = selectPadewanCard;
  window.renderPadewanGrid = renderPadewanGrid;
  window.renderPadewanDetail = renderPadewanDetail;

  window.generateDraftKartuKarakter = generateDraftKartuKarakter;
  window.drawKartuKarakter = drawKartuKarakter;
  window.openKartuKarakterModal = openKartuKarakterModal;
  window.closeKartuKarakterModal = closeKartuKarakterModal;
  window.downloadKartuKarakterPng = downloadKartuKarakterPng;
  window.shareKartuKarakter = shareKartuKarakter;
  window.showToast = showToast;
  window.copyToClipboard = copyToClipboard;
  window.toggleLanguage = toggleLanguage;
  window.setLanguage = setLanguage;
  window.getLanguage = getLanguage;
  window.getMode = getMode;
  window.setMode = setMode;
  window.isPemula = isPemula;
  window.isAhli = isAhli;
  window.hasModePreference = hasModePreference;
  window.applyModeToUI = applyModeToUI;
  window.toggleMode = toggleMode;
  window.showOnboardingModal = showOnboardingModal;
  window.closeOnboardingModal = closeOnboardingModal;
  window.pilihModeAwal = pilihModeAwal;

  // Kalender Jawa Export Bindings
  window.printLaporanKalender = printLaporanKalender;
  window.downloadKalenderPdf = downloadKalenderPdf;
  window.downloadKalenderPng = downloadKalenderPng;
  window.resetKalenderToday = resetKalenderToday;

  // Pustaka Dongo, Usada & Kautaman bindings
  window.initPustakaUI = initPustakaUI;
  window.renderPustakaCards = renderPustakaCards;
  window.switchPustakaKategori = switchPustakaKategori;
  window.onPustakaSearchInput = onPustakaSearchInput;
  window.clearPustakaSearch = clearPustakaSearch;
  window.openPustakaReader = openPustakaReader;
  window.closePustakaReader = closePustakaReader;
  window.onPustakaNameChange = onPustakaNameChange;
  window.copyPustakaCurrentDoa = copyPustakaCurrentDoa;
  window.switchPustakaSubtab = switchPustakaSubtab;
  window.onKautamanSearch = onKautamanSearch;
  window.copyKautamanItem = copyKautamanItem;
  window.onUsadaSearch = onUsadaSearch;
  window.filterUsadaPenyakit = filterUsadaPenyakit;
  window.copyUsadaItem = copyUsadaItem;
  window.copyKalacakraFull = copyKalacakraFull;

  // Pustaka Sinengker bindings
  window.initSinengkerUI = initSinengkerUI;
  window.submitSinengkerPin = submitSinengkerPin;
  window.lockSinengkerUI = lockSinengkerUI;
  window.switchSinengkerSubtab = switchSinengkerSubtab;
  window.onKompasDanyangSearch = onKompasDanyangSearch;
  window.setKompasDanyangSample = setKompasDanyangSample;
  window.copyKompasDanyangResult = copyKompasDanyangResult;
  window.copyMendhemAriAri = copyMendhemAriAri;
  window.copyUbarampePager = copyUbarampePager;
  window.copySastraJendra = copySastraJendra;
  window.copyBodroSampir = copyBodroSampir;
  window.copyKasedanJati = copyKasedanJati;
  window.copyRosoSejati = copyRosoSejati;
  window.copyAjiMantra = copyAjiMantra;
  window.copyRuwatanMantra = copyRuwatanMantra;
  window.openKompasImageZoomModal = openKompasImageZoomModal;
  window.closeKompasImageZoomModal = closeKompasImageZoomModal;
  window.switchKompasViewMode = switchKompasViewMode;

  // Mitologi Nusantara bindings
  window.initMitologiUI = initMitologiUI;
  window.openMitologiModal = openMitologiModal;
  window.closeMitologiModal = closeMitologiModal;
  window.copyMitologiStory = copyMitologiStory;
  window.toggleMitologiFontSize = toggleMitologiFontSize;

  // Wuku Category Filter dispatcher
  window.setWukuCategoryFilter = async function(category) {
    await ensureWukuLoaded();
    const wukuUI = await import('./modules/wuku/wuku-ui.js');
    if (wukuUI && typeof wukuUI.setWukuCategoryFilter === 'function') {
      wukuUI.setWukuCategoryFilter(category);
    }
  };

  // Sapa Dina Share bindings
  window.openSapaDinaShareModal = openSapaDinaShareModal;
  window.closeSapaDinaShareModal = closeSapaDinaShareModal;
  window.downloadSapaDinaCardPng = downloadSapaDinaCardPng;
  window.shareSapaDinaVisual = shareSapaDinaVisual;

  // Nujum Pokémon Card bindings
  window.openNujumPokemonCardModal = openNujumPokemonCardModal;
  window.closeNujumPokemonCardModal = closeNujumPokemonCardModal;
  window.downloadNujumPokemonCardPng = downloadNujumPokemonCardPng;
  window.shareNujumPokemonCard = shareNujumPokemonCard;
  window.onNujumPokemonOptionChange = onNujumPokemonOptionChange;
  window.onNujumPokemonNameInput = onNujumPokemonNameInput;

  // Ijab & Omah bindings
  window.initIjabUI = initIjabUI;
  window.syncIjabDariTanggal = syncIjabDariTanggal;
  window.hitungIjabDariUI = hitungIjabDariUI;
  window.initOmahUI = initOmahUI;
  window.syncOmahDariTanggal = syncOmahDariTanggal;
  window.hitungOmahDariUI = hitungOmahDariUI;
  window.cariHariBaikOmahUI = cariHariBaikOmahUI;
  window.pilihTanggalHasilCariOmah = pilihTanggalHasilCariOmah;

  // Ternak, Loro, & Geblak bindings
  window.initTernakUI = initTernakUI;
  window.syncTernakDariTanggal = syncTernakDariTanggal;
  window.hitungTernakDariSelect = hitungTernakDariSelect;
  window.switchTernakSubtab = switchTernakSubtab;
  window.konfirmasiBukaGeblak = konfirmasiBukaGeblak;
  window.cariHariPetungKehidupanUI = cariHariPetungKehidupanUI;
  window.pilihTanggalHasilCariTernak = pilihTanggalHasilCariTernak;

  // Sasmitha bindings
  window.initSasmithaUI = initSasmithaUI;
  window.switchSasmithaSubtab = switchSasmithaSubtab;
  window.onImpenSearchInput = onImpenSearchInput;
  window.onKedutSearchInput = onKedutSearchInput;
  window.onKedutCategorySelect = onKedutCategorySelect;
  window.onGerhanaSasiSelect = onGerhanaSasiSelect;
  window.onLinduSasiSelect = onLinduSasiSelect;
  window.onLinduWaktuToggle = onLinduWaktuToggle;
  window.pilihTitikAnatomiKedut = pilihTitikAnatomiKedut;
  window.setKedutViewMode = setKedutViewMode;
}

wireKalenderFeature();
wireJodohFeature();
wireSelametanFeature();
wireAksaraFeature();
wireWayangFeature();
wireAudioFeature();
wireNujumFeature();
wireSapaDinaFeature(); // Phase II: Sapa Dina

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

      case 'ijab':
        if (typeof window.initIjabUI === 'function') {
          window.initIjabUI();
        }
        break;

      case 'omah':
        if (typeof window.initOmahUI === 'function') {
          window.initOmahUI();
        }
        break;

      case 'ternak':
        if (typeof window.initTernakUI === 'function') {
          window.initTernakUI();
        }
        break;

      case 'sasmitha':
        if (typeof window.initSasmithaUI === 'function') {
          window.initSasmithaUI();
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
        if (typeof window.initAksaraListeners === 'function') window.initAksaraListeners();
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
        try {
          const kawruhMod = await import('./data/kawruh-boso.js');
          if (kawruhMod && typeof kawruhMod.renderKawruhBosoUI === 'function') {
            kawruhMod.renderKawruhBosoUI('kawruhBosoContainer');
          }
        } catch (e) {
          console.error('Gagal inisialisasi Kawruh Basa Jawa:', e);
        }
        break;

      case 'tumpeng':
        await ensureTumpengLoaded();
        break;

      case 'tripurusa':
        {
          const tripurusaModule = await import('./modules/budaya/tripurusa.js');
          if (tripurusaModule && typeof tripurusaModule.renderTripurusaModule === 'function') {
            tripurusaModule.renderTripurusaModule('tripurusaContentContainer');
          }
        }
        break;

      case 'ensiklopedia-budaya':
        {
          const ensikloModule = await import('./modules/budaya/ensiklopedia-budaya.js');
          if (ensikloModule && typeof ensikloModule.renderEnsiklopediaBudayaPage === 'function') {
            ensikloModule.renderEnsiklopediaBudayaPage('ensiklopediaBudayaContainer');
          }
        }
        break;

      case 'pustaka':
        if (typeof window.initPustakaUI === 'function') {
          window.initPustakaUI('pustakaContainer');
        }
        break;

      case 'sinengker':
        if (typeof window.initSinengkerUI === 'function') {
          window.initSinengkerUI('sinengkerContainer');
        }
        break;

      case 'mitologi':
        if (typeof window.initMitologiUI === 'function') {
          window.initMitologiUI('mitologiPillarsGrid');
        }
        break;
    }
  });
}

// ─── SERVICE WORKER REGISTRATION ──────────────────────────────────────────
function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker terdaftar dengan scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Gagal meregistrasi Service Worker:', err);
        });
    });
  }
}

// ─── DATABASE SERVICE (JSON DATABASE LOADER) ──────────────────────────────
import { loadDomainData } from './services/dbLoader.js';

// ─── BOOTSTRAP INITIAL APPLICATION STATE ──────────────────────────────────
export function bootstrap() {
  initI18n();
  initModeFeature();
  registerServiceWorker();

  // Migrasi bertahap dbLoader: trigger pemuatan domain inti secara asinkron
  loadDomainData('kalender').catch((e) => console.warn('[bootstrap] kalender domain fallback:', e));
  loadDomainData('sapa-dina').catch((e) => console.warn('[bootstrap] sapa-dina domain fallback:', e));

  // Pemuatan UI dengan boundary resilien agar halaman tidak pernah blank
  try { if (typeof window.initKalenderSelects === 'function') window.initKalenderSelects(); } catch (e) { console.warn(e); }
  try { if (typeof window.renderKalender === 'function') window.renderKalender(); } catch (e) { console.warn(e); }
  try { initQuickTodayBadge(); } catch (e) { console.warn(e); }

  // Phase II: Sapa Dina — Ringkasan Harian (inisialisasi setelah kalender)
  try { initSapaDina('sapa-dina-container'); } catch (e) { console.warn(e); }

  try { if (typeof window.initPerjodohanSelects === 'function') window.initPerjodohanSelects(); } catch (e) { console.warn(e); }
  try { if (typeof window.initIjabUI === 'function') window.initIjabUI(); } catch (e) { console.warn(e); }
  try { if (typeof window.initOmahUI === 'function') window.initOmahUI(); } catch (e) { console.warn(e); }
  try { if (typeof window.initTernakUI === 'function') window.initTernakUI(); } catch (e) { console.warn(e); }
  try { if (typeof window.initSasmithaUI === 'function') window.initSasmithaUI(); } catch (e) { console.warn(e); }
  try { if (typeof window.initMitologiUI === 'function') window.initMitologiUI(); } catch (e) { console.warn(e); }

  // Inisialisasi Fitur Tema & Kelir Wayang Panggung
  initThemeFeature();
  initKelirWayangFeature();

  // Inisialisasi default tanggal wafat hari ini bila belum terisi
  const tglWafatInput = document.getElementById('tglWafatInput');
  if (tglWafatInput && !tglWafatInput.value) {
    tglWafatInput.value = new Date().toISOString().slice(0, 10);
  }

  // Inisialisasi dropdown Tahun Hitung Nujum agar selalu terisi sejak awal
  const selTahun = document.getElementById('tahunHitungKepribadian');
  if (selTahun && selTahun.children.length === 0) {
    const curY = new Date().getFullYear();
    for (let y = 1940; y <= 2050; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `${y} M`;
      if (y === curY) opt.selected = true;
      selTahun.appendChild(opt);
    }
  }

  // Inisialisasi default tanggal lahir Nujum dengan hari ini bila belum terisi
  const tglLahirKepribadianInput = document.getElementById('tglLahirKepribadian');
  if (tglLahirKepribadianInput && !tglLahirKepribadianInput.value) {
    tglLahirKepribadianInput.value = new Date().toISOString().slice(0, 10);
    if (typeof window.updateKepribadianQuickInfo === 'function') {
      window.updateKepribadianQuickInfo();
    }
  }

  initModalListeners();

  // Reaktif re-render seluruh modul aktif saat preferensi bahasa diubah
  if (typeof window !== 'undefined') {
    window.addEventListener('language-changed', () => {
      if (typeof window.renderKalender === 'function') {
        try { window.renderKalender(); } catch (e) { /* ignore */ }
      }
      if (typeof window.initSapaDina === 'function') {
        try { window.initSapaDina('sapa-dina-container'); } catch (e) { /* ignore */ }
      }
      if (typeof window.hitungNujumPribadi === 'function') {
        const container = document.getElementById('nujumResultContainer');
        if (container && container.innerHTML.trim()) {
          try { window.hitungNujumPribadi(); } catch (e) { /* ignore */ }
        }
      }
      if (typeof window.renderFullWukuPage === 'function') {
        const tabWuku = document.getElementById('tabWuku');
        if (tabWuku && !tabWuku.classList.contains('hidden')) {
          try { window.renderFullWukuPage(); } catch (e) { /* ignore */ }
        }
      }
      if (typeof window.hitungOmahDariUI === 'function') {
        const container = document.getElementById('omahResultContainer');
        if (container && container.innerHTML.trim()) {
          try { window.hitungOmahDariUI(false); } catch (e) { /* ignore */ }
        }
      }
      if (typeof window.hitungIjabDariUI === 'function') {
        const container = document.getElementById('ijabResultContainer');
        if (container && container.innerHTML.trim()) {
          try { window.hitungIjabDariUI(false); } catch (e) { /* ignore */ }
        }
      }
      if (typeof window.syncTernakDariTanggal === 'function') {
        const container = document.getElementById('ternakResultContainer');
        if (container && container.innerHTML.trim()) {
          try { window.syncTernakDariTanggal(); } catch (e) { /* ignore */ }
        }
      }
    });
  }
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
  initModalListeners,
  registerServiceWorker,
  initI18n,
  toggleLanguage,
  setLanguage,
  getLanguage,
  getMode,
  setMode,
  isPemula,
  isAhli,
  hasModePreference,
  applyModeToUI,
  toggleMode
};
