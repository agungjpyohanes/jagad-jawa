/**
 * Jagad Jawa — Feature: Nujum, Pawukon, Glosarium & Lazy Loaders
 * Mengelola subsistem pemuatan dinamis (lazy loading) nujum matrix, pitutur, wuku, dan tumpeng,
 * serta membungkus fungsi UI Nujum dalam thin wrapper yang otomatis memuat modul saat diklik.
 */

const scriptCache = new Map();

/**
 * Dynamic script loader yang mengembalikan Promise dan mencegah duplikasi muatan.
 * @param {string} url 
 * @returns {Promise<void>}
 */
export function loadScript(url) {
  if (typeof document === 'undefined') return Promise.resolve();
  if (scriptCache.has(url)) return scriptCache.get(url);
  const p = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => {
      console.warn(`[loadScript] ${url} diabaikan untuk bundler ES module:`, e);
      resolve();
    };
    document.head.appendChild(s);
  });
  scriptCache.set(url, p);
  return p;
}

let nujumLoaded = false;
export async function ensureNujumLoaded() {
  if (nujumLoaded) return;
  try {
    const [nujumUI, nujumEngine] = await Promise.all([
      import('../modules/nujum/nujum-ui.js'),
      import('../modules/nujum/nujum-engine.js')
    ]);

    if (typeof window !== 'undefined') {
      window.initTahunHitungSelect = nujumUI.initTahunHitungSelect;
      window.onTahunHitungChange = nujumUI.onTahunHitungChange;
      window.updateKepribadianQuickInfo = nujumUI.updateKepribadianQuickInfo;
      window.hitungKepribadianLengkap = nujumUI.hitungKepribadianLengkap;
      window.switchNujumViewMode = nujumUI.switchNujumViewMode;
      window.switchNujumSubTab = nujumUI.switchNujumSubTab;
      window.openGlosariumNujumModal = nujumUI.openGlosariumNujumModal;
      window.closeGlosariumNujumModal = nujumUI.closeGlosariumNujumModal;
      window.renderGlosariumContent = nujumUI.renderGlosariumContent;
      window.hitungKomparasiNonJodoh = nujumUI.hitungKomparasiNonJodoh;
      window.renderKomparasiNonJodoh = nujumUI.renderKomparasiNonJodoh;
      window.printLaporanNujum = nujumUI.printLaporanNujum;
      window.compareNonJodoh = nujumEngine.compareNonJodoh;
      window.getNujumSummaryRingkas = nujumEngine.getNujumSummaryRingkas;
      window.getNujumGlossary = nujumEngine.getNujumGlossary;
      window.DISCLAIMER_ETIS_KULTURAL = nujumEngine.DISCLAIMER_ETIS_KULTURAL;
      window.NUJUM_GLOSSARY_CONCEPTS = nujumEngine.NUJUM_GLOSSARY_CONCEPTS;

      // Unified Nujum Data & Exact Matrix Lookups
      window.getNujumData = nujumEngine.getNujumData;
      window.getNujumFromMatrix = nujumEngine.getNujumFromMatrix;
      window.getNujumFromDatabase = nujumEngine.getNujumFromDatabase;
      window.primbonMatrix = nujumEngine.primbonMatrix;
      window.bincilDatabase = nujumEngine.bincilDatabase;
      window.nujumMatrix = nujumEngine.nujumMatrix;
      window.nujumDatabase = nujumEngine.nujumDatabase;

      // 8 Kartu Analisis Mendalam & Kontrol Interaktif
      window.ubahUmurSiklusTahunan = nujumUI.ubahUmurSiklusTahunan;
      window.updateDocSiklusTahunan = nujumUI.updateDocSiklusTahunan;
      window.updatePalenggahanInteractive = nujumUI.updatePalenggahanInteractive;
      window.salinAksaraFaal = nujumUI.salinAksaraFaal;
      window.updateFaalFromAksaraManual = nujumUI.updateFaalFromAksaraManual;
      window.renderSiklusTahunanCardHtml = nujumUI.renderSiklusTahunanCardHtml;
      window.renderShioElemenCardHtml = nujumUI.renderShioElemenCardHtml;
      window.renderPranataZodiakCardHtml = nujumUI.renderPranataZodiakCardHtml;
      window.renderKarakterDasarCardHtml = nujumUI.renderKarakterDasarCardHtml;
      window.renderWatakDinaPasaranCardHtml = nujumUI.renderWatakDinaPasaranCardHtml;
      window.renderSirikanAdhepOmahCardHtml = nujumUI.renderSirikanAdhepOmahCardHtml;
      window.renderPalenggahanPedamelanCardHtml = nujumUI.renderPalenggahanPedamelanCardHtml;
      window.renderPekerjaanPakartiCardHtml = nujumUI.renderPekerjaanPakartiCardHtml;
      window.buildAksaraSelectOptions = nujumUI.buildAksaraSelectOptions;
      window.LIST_20_AKSARA_CARAKAN = nujumUI.LIST_20_AKSARA_CARAKAN;

      // Fitur Share Kartu Karakter Pokémon TCG & Pusaka Jawa
      window.openNujumPokemonCardModal = nujumUI.openNujumPokemonCardModal;
      window.closeNujumPokemonCardModal = nujumUI.closeNujumPokemonCardModal;
      window.downloadNujumPokemonCardPng = nujumUI.downloadNujumPokemonCardPng;
      window.shareNujumPokemonCard = nujumUI.shareNujumPokemonCard;
      window.onNujumPokemonOptionChange = nujumUI.onNujumPokemonOptionChange;
      window.onNujumPokemonNameInput = nujumUI.onNujumPokemonNameInput;
      window.drawNujumPokemonCard = nujumUI.drawNujumPokemonCard;

      window.openKartuKarakterModal = nujumUI.openKartuKarakterModal;
      window.closeKartuKarakterModal = nujumUI.closeKartuKarakterModal;
      window.downloadKartuKarakterPng = nujumUI.downloadKartuKarakterPng;
      window.shareKartuKarakter = nujumUI.shareKartuKarakter;
      window.drawKartuKarakter = nujumUI.drawKartuKarakter;
      window.generateDraftKartuKarakter = nujumUI.generateDraftKartuKarakter;
      window.generateDraftCard = nujumUI.generateDraftCard;
      window.KARTU_KARAKTER_PRESETS = nujumUI.KARTU_KARAKTER_PRESETS;

      nujumUI.initTahunHitungSelect();
      nujumUI.updateKepribadianQuickInfo();
    }
    nujumLoaded = true;
  } catch (err) {
    console.error('Gagal memuat modul Nujum:', err);
  }
}

let pituturLoaded = false;
export async function ensurePituturLoaded() {
  if (pituturLoaded) return;
  try {
    const pituturUI = await import('../modules/pitutur/pitutur-ui.js');
    if (typeof window !== 'undefined') {
      window.generateRandomPitutur = pituturUI.generateRandomPitutur;
      window.generatePituturHariIni = pituturUI.generatePituturHariIni;
      window.getPituturHariIni = pituturUI.getPituturHariIni;
      window.copyPituturText = pituturUI.copyPituturText;
      window.sharePituturWhatsApp = pituturUI.sharePituturWhatsApp;
      window.restartQuiz = pituturUI.restartQuiz;
      window.selectQuizAnswer = pituturUI.selectQuizAnswer;
      window.renderCurrentQuizQuestion = pituturUI.renderCurrentQuizQuestion;
      window.showQuizResult = pituturUI.showQuizResult;

      pituturUI.generatePituturHariIni();
      pituturUI.restartQuiz();
    }
    pituturLoaded = true;
  } catch (err) {
    console.error('Gagal memuat modul Pitutur:', err);
  }
}

let wukuLoaded = false;
export async function ensureWukuLoaded() {
  if (wukuLoaded) return;
  try {
    const [wukuEngine, wukuUI] = await Promise.all([
      import('../modules/wuku/wuku-engine.js'),
      import('../modules/wuku/wuku-ui.js')
    ]);

    if (typeof window !== 'undefined') {
      window.getAllWuku = wukuEngine.getAllWuku;
      window.getWukuByNumber = wukuEngine.getWukuByNumber;
      window.getWukuByName = wukuEngine.getWukuByName;
      window.searchWuku = wukuEngine.searchWuku;
      window.getWukuDetailSummary = wukuEngine.getWukuDetailSummary;

      window.openEnsiklopediaWukuModal = wukuUI.openEnsiklopediaWukuModal;
      window.closeEnsiklopediaWukuModal = wukuUI.closeEnsiklopediaWukuModal;
      window.renderWukuGrid = wukuUI.renderWukuGrid;
      window.filterWukuGrid = wukuUI.filterWukuGrid;
      window.selectWukuDetail = wukuUI.selectWukuDetail;
      window.renderFullWukuPage = wukuUI.renderFullWukuPage;
      window.setWukuCategoryFilter = wukuUI.setWukuCategoryFilter;
    }
    wukuLoaded = true;
  } catch (err) {
    console.error('Gagal memuat modul Wuku:', err);
  }
}

let tumpengLoaded = false;
export async function ensureTumpengLoaded() {
  if (tumpengLoaded) return;
  try {
    await import('../data/tumpeng.js');
    tumpengLoaded = true;
  } catch (err) {
    console.error('Gagal memuat modul Tumpeng:', err);
  }
}

/**
 * Mengikat thin wrapper Nujum & Wuku ke window yang mendukung auto-loading saat diklik
 */
export function wireNujumFeature() {
  if (typeof window === 'undefined') return;

  // Ensiklopedia 30 Wuku (with auto lazy load)
  const wrapperRenderFullWukuPage = async function () {
    await ensureWukuLoaded();
    if (typeof window.renderFullWukuPage === 'function' && window.renderFullWukuPage !== wrapperRenderFullWukuPage) {
      window.renderFullWukuPage();
    }
  };
  window.renderFullWukuPage = wrapperRenderFullWukuPage;

  const wrapperOpenEnsiklopediaWukuModal = async function (initialWuku) {
    await ensureWukuLoaded();
    if (typeof window.openEnsiklopediaWukuModal === 'function' && window.openEnsiklopediaWukuModal !== wrapperOpenEnsiklopediaWukuModal) {
      window.openEnsiklopediaWukuModal(initialWuku);
    }
  };
  window.openEnsiklopediaWukuModal = wrapperOpenEnsiklopediaWukuModal;

  window.closeEnsiklopediaWukuModal = function () {
    const modal = document.getElementById('modalEnsiklopediaWuku');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  const wrapperFilterWukuGrid = async function (inputElem) {
    await ensureWukuLoaded();
    if (typeof window.filterWukuGrid === 'function' && window.filterWukuGrid !== wrapperFilterWukuGrid) {
      window.filterWukuGrid(inputElem);
    }
  };
  window.filterWukuGrid = wrapperFilterWukuGrid;

  const wrapperSelectWukuDetail = async function (noOrName) {
    await ensureWukuLoaded();
    if (typeof window.selectWukuDetail === 'function' && window.selectWukuDetail !== wrapperSelectWukuDetail) {
      window.selectWukuDetail(noOrName);
    }
  };
  window.selectWukuDetail = wrapperSelectWukuDetail;

  // Nujum wrappers (dengan jaminan lazy load jika diklik langsung)
  const wrapperHitungKepribadian = async function () {
    await ensureNujumLoaded();
    if (typeof window.hitungKepribadianLengkap === 'function' && window.hitungKepribadianLengkap !== wrapperHitungKepribadian) {
      window.hitungKepribadianLengkap();
    }
  };
  window.hitungKepribadianLengkap = wrapperHitungKepribadian;

  const wrapperUpdateQuickInfo = async function () {
    await ensureNujumLoaded();
    if (typeof window.updateKepribadianQuickInfo === 'function' && window.updateKepribadianQuickInfo !== wrapperUpdateQuickInfo) {
      window.updateKepribadianQuickInfo();
    }
  };
  window.updateKepribadianQuickInfo = wrapperUpdateQuickInfo;

  const wrapperOnTahunChange = async function () {
    await ensureNujumLoaded();
    if (typeof window.onTahunHitungChange === 'function' && window.onTahunHitungChange !== wrapperOnTahunChange) {
      window.onTahunHitungChange();
    }
  };
  window.onTahunHitungChange = wrapperOnTahunChange;

  const wrapperSwitchNujumView = async function (mode) {
    await ensureNujumLoaded();
    if (typeof window.switchNujumViewMode === 'function' && window.switchNujumViewMode !== wrapperSwitchNujumView) {
      window.switchNujumViewMode(mode);
    }
  };
  window.switchNujumViewMode = wrapperSwitchNujumView;

  const wrapperSwitchNujumSubTab = async function (tab) {
    await ensureNujumLoaded();
    if (typeof window.switchNujumSubTab === 'function' && window.switchNujumSubTab !== wrapperSwitchNujumSubTab) {
      window.switchNujumSubTab(tab);
    }
  };
  window.switchNujumSubTab = wrapperSwitchNujumSubTab;

  const wrapperOpenGlosarium = async function (conceptId) {
    await ensureNujumLoaded();
    if (typeof window.openGlosariumNujumModal === 'function' && window.openGlosariumNujumModal !== wrapperOpenGlosarium) {
      window.openGlosariumNujumModal(conceptId);
    }
  };
  window.openGlosariumNujumModal = wrapperOpenGlosarium;

  const wrapperCloseGlosarium = async function () {
    await ensureNujumLoaded();
    if (typeof window.closeGlosariumNujumModal === 'function' && window.closeGlosariumNujumModal !== wrapperCloseGlosarium) {
      window.closeGlosariumNujumModal();
    }
  };
  window.closeGlosariumNujumModal = wrapperCloseGlosarium;

  const wrapperRenderGlosarium = async function (filterId) {
    await ensureNujumLoaded();
    if (typeof window.renderGlosariumContent === 'function' && window.renderGlosariumContent !== wrapperRenderGlosarium) {
      window.renderGlosariumContent(filterId);
    }
  };
  window.renderGlosariumContent = wrapperRenderGlosarium;

  const wrapperHitungKomparasi = async function () {
    await ensureNujumLoaded();
    if (typeof window.hitungKomparasiNonJodoh === 'function' && window.hitungKomparasiNonJodoh !== wrapperHitungKomparasi) {
      window.hitungKomparasiNonJodoh();
    }
  };
  window.hitungKomparasiNonJodoh = wrapperHitungKomparasi;

  const wrapperPrintLaporan = async function (theme) {
    await ensureNujumLoaded();
    if (typeof window.printLaporanNujum === 'function' && window.printLaporanNujum !== wrapperPrintLaporan) {
      window.printLaporanNujum(theme);
    }
  };
  window.printLaporanNujum = wrapperPrintLaporan;

  const wrapperOpenPokemonCard = async function (data) {
    await ensureNujumLoaded();
    if (typeof window.openNujumPokemonCardModal === 'function' && window.openNujumPokemonCardModal !== wrapperOpenPokemonCard) {
      window.openNujumPokemonCardModal(data);
    }
  };
  window.openNujumPokemonCardModal = wrapperOpenPokemonCard;
  window.openKartuKarakterModal = wrapperOpenPokemonCard;

  const wrapperGenerateDraft = async function (presetKey) {
    await ensureNujumLoaded();
    if (typeof window.generateDraftKartuKarakter === 'function' && window.generateDraftKartuKarakter !== wrapperGenerateDraft) {
      return window.generateDraftKartuKarakter(presetKey);
    }
  };
  window.generateDraftKartuKarakter = wrapperGenerateDraft;
  window.generateDraftCard = wrapperGenerateDraft;
}
