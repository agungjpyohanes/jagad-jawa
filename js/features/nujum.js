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
  const p = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
  scriptCache.set(url, p);
  return p;
}

let nujumLoaded = false;
export async function ensureNujumLoaded() {
  if (nujumLoaded) return;
  try {
    await Promise.all([
      loadScript('js/data/nujum-matrix.js'),
      loadScript('js/data/siklus-master-data.js'),
      loadScript('js/data/karakter-pekerjaan-master-data.js'),
      loadScript('js/data/shio-elemen-master-data.js'),
      loadScript('js/data/pranata-zodiak-data.js'),
      loadScript('js/data/sasi-jawa-master-data.js'),
      loadScript('js/data/pawukon.js'),
      loadScript('js/data/pawukon-dino-db.js'),
      loadScript('js/data/dino-rules.js')
    ]);
    const nujumUI = await import('../modules/nujum/nujum-ui.js');
    const nujumEngine = await import('../modules/nujum/nujum-engine.js');

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
    await loadScript('js/data/pitutur.js');
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
    await loadScript('js/data/pawukon.js');
    const wukuEngine = await import('../modules/wuku/wuku-engine.js');
    const wukuUI = await import('../modules/wuku/wuku-ui.js');

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
    await loadScript('js/data/tumpeng.js');
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
  window.renderFullWukuPage = async function () {
    await ensureWukuLoaded();
    if (window.renderFullWukuPage && window.renderFullWukuPage !== this) {
      window.renderFullWukuPage();
    }
  };
  window.openEnsiklopediaWukuModal = async function (initialWuku) {
    await ensureWukuLoaded();
    if (window.openEnsiklopediaWukuModal && window.openEnsiklopediaWukuModal !== this) {
      window.openEnsiklopediaWukuModal(initialWuku);
    }
  };
  window.closeEnsiklopediaWukuModal = function () {
    const modal = document.getElementById('modalEnsiklopediaWuku');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };
  window.filterWukuGrid = function () {
    if (window.filterWukuGrid && window.filterWukuGrid !== this) {
      window.filterWukuGrid();
    }
  };
  window.selectWukuDetail = async function (noOrName) {
    await ensureWukuLoaded();
    if (window.selectWukuDetail && window.selectWukuDetail !== this) {
      window.selectWukuDetail(noOrName);
    }
  };

  // Nujum wrappers (dengan jaminan lazy load jika diklik langsung)
  window.hitungKepribadianLengkap = async function () {
    await ensureNujumLoaded();
    if (window.hitungKepribadianLengkap && window.hitungKepribadianLengkap !== this) {
      window.hitungKepribadianLengkap();
    }
  };
  window.updateKepribadianQuickInfo = async function () {
    await ensureNujumLoaded();
    if (window.updateKepribadianQuickInfo && window.updateKepribadianQuickInfo !== this) {
      window.updateKepribadianQuickInfo();
    }
  };
  window.onTahunHitungChange = async function () {
    await ensureNujumLoaded();
    if (window.onTahunHitungChange && window.onTahunHitungChange !== this) {
      window.onTahunHitungChange();
    }
  };
  window.switchNujumViewMode = async function (mode) {
    await ensureNujumLoaded();
    if (window.switchNujumViewMode && window.switchNujumViewMode !== this) {
      window.switchNujumViewMode(mode);
    }
  };
  window.switchNujumSubTab = async function (tab) {
    await ensureNujumLoaded();
    if (window.switchNujumSubTab && window.switchNujumSubTab !== this) {
      window.switchNujumSubTab(tab);
    }
  };
  window.openGlosariumNujumModal = async function (conceptId) {
    await ensureNujumLoaded();
    if (window.openGlosariumNujumModal && window.openGlosariumNujumModal !== this) {
      window.openGlosariumNujumModal(conceptId);
    }
  };
  window.closeGlosariumNujumModal = async function () {
    await ensureNujumLoaded();
    if (window.closeGlosariumNujumModal && window.closeGlosariumNujumModal !== this) {
      window.closeGlosariumNujumModal();
    }
  };
  window.renderGlosariumContent = async function (filterId) {
    await ensureNujumLoaded();
    if (window.renderGlosariumContent && window.renderGlosariumContent !== this) {
      window.renderGlosariumContent(filterId);
    }
  };
  window.hitungKomparasiNonJodoh = async function () {
    await ensureNujumLoaded();
    if (window.hitungKomparasiNonJodoh && window.hitungKomparasiNonJodoh !== this) {
      window.hitungKomparasiNonJodoh();
    }
  };
  window.printLaporanNujum = async function (theme) {
    await ensureNujumLoaded();
    if (window.printLaporanNujum && window.printLaporanNujum !== this) {
      window.printLaporanNujum(theme);
    }
  };
}
