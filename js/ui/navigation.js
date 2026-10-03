// Tab Navigation, Mobile Menu, Browser History & PDF Printing

function switchTab(tabId, pushState = true) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('block');
  });
  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('block');
  }

  // Update tab buttons & sublinks
  document.querySelectorAll('.nav-btn, .nav-link, .nav-sublink').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update parent dropdown triggers
  document.querySelectorAll('.nav-dropdown-group').forEach(group => {
    const activeSub = group.querySelector(`.nav-sublink[data-tab="${tabId}"]`);
    const trigger = group.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      if (activeSub) {
        trigger.classList.add('active');
      } else {
        trigger.classList.remove('active');
      }
    }
  });

  // Close any open desktop dropdowns upon selection & close mobile menu
  closeAllNavDropdowns();
  // Update global header back button visibility (hide on beranda, show on subtabs)
  const globalBackBtn = document.getElementById('globalNavBackBtn');
  if (globalBackBtn) {
    if (tabId === 'beranda') {
      globalBackBtn.classList.add('hidden');
      globalBackBtn.classList.remove('inline-flex');
    } else {
      globalBackBtn.classList.remove('hidden');
      globalBackBtn.classList.add('inline-flex');
    }
  }

  if (pushState !== false && typeof history !== 'undefined' && history.pushState) {
    history.pushState({ tab: tabId }, '', '#' + tabId);
  }

  if (tabId === 'aksara') {
    if (typeof window.initAksaraListeners === 'function') window.initAksaraListeners();
    // Canvas init will be handled by aksara module
    window.dispatchEvent(new CustomEvent('init-aksara-canvas'));
  }

  if (tabId === 'tripurusa' && typeof window.renderTripurusaModule === 'function') {
    window.renderTripurusaModule();
  }

  if (tabId === 'ensiklopedia-budaya' && typeof window.renderEnsiklopediaBudayaPage === 'function') {
    window.renderEnsiklopediaBudayaPage();
  }

  if (tabId === 'mitologi' && typeof window.initMitologiUI === 'function') {
    window.initMitologiUI();
  }

  // Perbarui jejak hierarki Breadcrumb bergaya Windows Explorer
  renderBreadcrumb(tabId);

  window.dispatchEvent(new CustomEvent('tab-switched', { detail: { tabId } }));

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleNavDropdown(btn, event) {
  if (event) {
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
  }
  const group = btn.closest('.nav-dropdown-group');
  if (!group) return;
  const menu = group.querySelector('.nav-dropdown-menu');
  if (!menu) return;
  const isOpen = menu.classList.contains('is-open');

  // Tutup dropdown lain terlebih dahulu
  closeAllNavDropdowns();

  if (!isOpen) {
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('dropdown-open');
  }
}

function closeAllNavDropdowns() {
  document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
    menu.classList.remove('is-open');
  });
  document.querySelectorAll('.nav-dropdown-trigger').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('dropdown-open');
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn') || document.querySelector('[onclick*="toggleMobileMenu"]');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = '';
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn') || document.querySelector('[onclick*="toggleMobileMenu"]');
  if (!menu) return;
  const isHidden = menu.classList.toggle('hidden');
  if (btn) {
    btn.setAttribute('aria-expanded', String(!isHidden));
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = isHidden ? '' : 'hidden';
  }
}

// Global click handler to close dropdowns and mobile menu when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-group')) {
      closeAllNavDropdowns();
    }
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleBtn = e.target.closest('#mobileMenuBtn, [onclick*="toggleMobileMenu"]');
    if (mobileMenu && !mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !toggleBtn) {
      closeMobileMenu();
    }
  });

  // Tombol Esc menutup semua dropdown & drawer mobile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllNavDropdowns();
      closeMobileMenu();
    }
  });
}

// ─── HIERARKI BREADCRUMB (GAYA WINDOWS EXPLORER) ───────────────────────────
const BREADCRUMB_MAP = {
  'beranda': {
    category: null,
    title: { id: 'Beranda', jv: 'Pambuka' },
    icon: 'fa-solid fa-house',
    sub: null
  },
  'kalender': {
    category: { label: { id: 'Waktu & Penanggalan', jv: 'Wektu & Penanggalan' }, icon: 'fa-solid fa-calendar-days' },
    title: { id: 'Kalender Jawa', jv: 'Kalendher Jawi' },
    icon: 'fa-solid fa-calendar-days',
    sub: { id: 'Pranata Mangsa & Weton', jv: 'Pranata Mangsa & Weton' }
  },
  'tanggal-jawa': {
    category: { label: { id: 'Waktu & Penanggalan', jv: 'Wektu & Penanggalan' }, icon: 'fa-solid fa-calendar-days' },
    title: { id: 'Konversi Tanggal Jawa', jv: 'Konversi Tanggal Jawa' },
    icon: 'fa-solid fa-moon',
    sub: { id: 'Sultan Agungan & Anno Javanico', jv: 'Sultan Agungan & Anno Javanico' }
  },
  'kepribadian': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Nujum Pribadi', jv: 'Nujum Pribadhi' },
    icon: 'fa-solid fa-wand-magic-sparkles',
    sub: { id: '6 Dimensi Bincil & Karakter', jv: '6 Dhimènsi Bincil & Watak' }
  },
  'perjodohan': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Perjodohan (Pitung Jawa)', jv: 'Pitung Salaki Rabi' },
    icon: 'fa-solid fa-heart',
    sub: { id: 'Salaki Rabi & Neptu Pasangan', jv: 'Salaki Rabi & Neptu Penganten' }
  },
  'selametan': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Peringatan Wafat', jv: 'Pengetan Tilar Donyo' },
    icon: 'fa-solid fa-hourglass-half',
    sub: { id: 'Haul Leluhur Geblak - Nyewu', jv: 'Haul Leluhur Geblak - Nyewu' }
  },
  'ijab': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Petung Ijab (Palakrama)', jv: 'Petung Ijab (Palakrama)' },
    icon: 'fa-solid fa-ring',
    sub: { id: 'Neptu Khusus Nikah', jv: 'Neptu Mirunggan Nikah' }
  },
  'omah': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Petung Omah & Cempuri', jv: 'Petung Omah & Cempuri' },
    icon: 'fa-solid fa-house-chimney',
    sub: { id: 'Pembangunan & Lawangan', jv: 'Pambangunan & Lawangan' }
  },
  'ternak': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Petung Kehidupan', jv: 'Petung Panguripan' },
    icon: 'fa-solid fa-paw',
    sub: { id: 'Ternak, Loro, & Geblak', jv: 'Ingon-ingon, Gerah, & Geblak' }
  },
  'sasmitha': {
    category: { label: { id: 'Nujum & Primbon', jv: 'Nujum & Primbon' }, icon: 'fa-solid fa-wand-magic-sparkles' },
    title: { id: 'Sasmitha (Tanda Alam & Tubuh)', jv: 'Sasmitha (Pratandha Alam & Badan)' },
    icon: 'fa-solid fa-eye',
    sub: { id: 'Impen, Kedut, & Fenomena Langit', jv: 'Impen, Kedut, & Pratandha Langit' }
  },
  'wuku': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Ensiklopedia 30 Wuku', jv: 'Pawukon 30 Wuku' },
    icon: 'fa-solid fa-compass',
    sub: { id: 'Pawukon Sinta - Watugunung', jv: 'Pawukon Sinta - Watugunung' }
  },
  'tripurusa': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Telur Jagad (Tripurusa)', jv: 'Endhog Wisesa (Tripurusa)' },
    icon: 'fa-solid fa-egg',
    sub: { id: 'Mitologi Kosmologi Wayang', jv: 'Mitologi Kosmologi Wayang' }
  },
  'ensiklopedia-budaya': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Ensiklopedia Budaya & Primbon', jv: 'Kawruh Kabudayan & Primbon' },
    icon: 'fa-solid fa-book-journal-whills',
    sub: { id: 'Falakiah & Referensi Lengkap', jv: 'Falakiah & Kawruh Jangkep' }
  },
  'mitologi': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Mitologi Nusantara', jv: 'Mitologi Nuswantara' },
    icon: 'fa-solid fa-scroll',
    sub: { id: 'Sastra & Cerita Kuno', jv: 'Sastra & Cariyos Kuna' }
  },
  'gamelan': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Gamelan Maya', jv: 'Gamelan Jawa' },
    icon: 'fa-solid fa-drum',
    sub: { id: 'Karawitan Pelog & Slendro', jv: 'Karawitan Pelog & Slendro' }
  },
  'aksara': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Studio Aksara Jawa', jv: 'Papan Aksara Jawa' },
    icon: 'fa-solid fa-feather-pointed',
    sub: { id: 'Papan Ketik & Transliterasi', jv: 'Papan Ketik & Transliterasi' }
  },
  'wayang': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Panggung Kelir Wayang', jv: 'Panggung Kelir Wayang' },
    icon: 'fa-solid fa-masks-theater',
    sub: { id: 'Wayang Kulit Purwa Surakarta', jv: 'Wayang Kulit Purwa Surakarta' }
  },
  'pitutur': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Pitutur Luhur & Kuis', jv: 'Piwulang Luhur & Cangkriman' },
    icon: 'fa-solid fa-quote-left',
    sub: { id: 'Falsafah Luhur & Uji Wawasan', jv: 'Falsafah Luhur & Uji Kawruh' }
  },
  'pustaka': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Pustaka Digital', jv: 'Pustaka Jawa' },
    icon: 'fa-solid fa-book-bookmark',
    sub: { id: 'Serat Kuno & Usada Tradisi', jv: 'Serat Kuno & Usada Tradhisi' }
  },
  'sinengker': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Pustaka Sinengker', jv: 'Pustaka Sinengker' },
    icon: 'fa-solid fa-shield-halved',
    sub: { id: 'Kompas Danyang 360°', jv: 'Kompas Danyang 360°' }
  },
  'tumpeng': {
    category: { label: { id: 'Seni & Budaya', jv: 'Seni & Kabudayan' }, icon: 'fa-solid fa-masks-theater' },
    title: { id: 'Tumpeng Tombak Rojo', jv: 'Tumpeng Tombak Rojo' },
    icon: 'fa-solid fa-bowl-rice',
    sub: { id: 'Ubarampe Sesaji & Filosofi', jv: 'Ubarampe Sesaji & Filosofi' }
  },
  'laporan': {
    category: { label: { id: 'Laporan & Ekspor', jv: 'Laporan & Cithak' }, icon: 'fa-solid fa-file-pdf' },
    title: { id: 'Pusat Laporan Tradisi Luhur', jv: 'Pusat Serat Laporan Tradhisi Luhur' },
    icon: 'fa-solid fa-file-pdf',
    sub: { id: 'Dokumen Resmi & Piagam', jv: 'Serat Resmi & Piagam' }
  }
};

const CATEGORY_DEFAULT_TAB = {
  'Waktu & Penanggalan': 'kalender',
  'Wektu & Penanggalan': 'kalender',
  'Nujum & Primbon': 'kepribadian',
  'Seni & Budaya': 'wuku',
  'Seni & Kabudayan': 'wuku',
  'Laporan & Ekspor': 'laporan',
  'Laporan & Cithak': 'laporan'
};

/**
 * Resolves the primary default tab for a given category label
 * @param {string|object|null} categoryLabel
 * @returns {string}
 */
function getCategoryDefaultTab(categoryLabel) {
  if (!categoryLabel) return 'beranda';
  const labelStr = typeof categoryLabel === 'object' ? (categoryLabel.id || categoryLabel.jv) : categoryLabel;
  if (CATEGORY_DEFAULT_TAB[labelStr]) {
    return CATEGORY_DEFAULT_TAB[labelStr];
  }
  for (const [key, val] of Object.entries(BREADCRUMB_MAP)) {
    if (val.category) {
      const catStr = typeof val.category.label === 'object' ? (val.category.label.id || val.category.label.jv) : val.category.label;
      if (catStr === labelStr) return key;
    }
  }
  return 'beranda';
}

/**
 * Global handler for breadcrumb item click navigation
 * @param {string} tabId
 */
function handleBreadcrumbNav(tabId) {
  if (tabId && typeof switchTab === 'function') {
    switchTab(tabId);
  }
}

/**
 * Helper dwibahasa untuk teks label breadcrumb
 */
function getNavBilingualText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  const lang = (typeof window !== 'undefined' && window.getLanguage) ? window.getLanguage() : 'id';
  if (typeof val === 'object') {
    return val[lang] || val.id || val.jv || '';
  }
  return String(val);
}

/**
 * Merender Breadcrumb bergaya Windows Explorer berdasarkan tab aktif dan sub-level opsional
 * @param {string} tabId 
 * @param {string|object|null} subTitle 
 */
function renderBreadcrumb(tabId = 'beranda', subTitle = null) {
  const container = document.getElementById('breadcrumbTrail');
  const summaryEl = document.getElementById('breadcrumbPathSummary');
  if (!container) return;

  const info = BREADCRUMB_MAP[tabId] || {
    category: null,
    title: tabId.charAt(0).toUpperCase() + tabId.slice(1),
    icon: 'fa-solid fa-folder',
    sub: null
  };

  const segments = [];
  const homeLabel = getNavBilingualText({ id: 'Beranda', jv: 'Pambuka' });

  // Root / Home Segment (Selalu ada, bisa diklik untuk pulang ke Beranda)
  segments.push({
    label: homeLabel,
    icon: 'fa-solid fa-house',
    tabId: 'beranda',
    action: () => switchTab('beranda'),
    isCurrent: tabId === 'beranda' && !subTitle
  });

  // Category Level (jika ada grup induknya, misal "Wektu & Penanggalan")
  if (info.category && tabId !== 'beranda') {
    const catLabel = getNavBilingualText(info.category.label);
    const targetCatTab = getCategoryDefaultTab(info.category.label);
    segments.push({
      label: catLabel,
      icon: info.category.icon,
      tabId: targetCatTab,
      action: () => switchTab(targetCatTab),
      isCurrent: false
    });
  }

  // Module / Tab Level
  if (tabId !== 'beranda') {
    const tabLabel = getNavBilingualText(info.title);
    segments.push({
      label: tabLabel,
      icon: info.icon,
      tabId: tabId,
      action: () => switchTab(tabId),
      isCurrent: !subTitle && !info.sub
    });
  }

  // Deep Sub-level (jika ada sub-fitur atau kalkulasi aktif)
  const activeSub = subTitle || info.sub;
  if (activeSub && tabId !== 'beranda') {
    const subLabel = getNavBilingualText(activeSub);
    segments.push({
      label: subLabel,
      icon: 'fa-solid fa-file-lines',
      tabId: tabId,
      action: null,
      isCurrent: true
    });
  }

  // Bangun elemen HTML Breadcrumb bergaya Windows Explorer
  let html = '';
  segments.forEach((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const isClickable = !isLast && typeof seg.action === 'function';

    html += `
      <div class="breadcrumb-item inline-flex items-center gap-1.5 shrink-0 ${isLast ? 'text-prada font-bold' : 'text-sogan-300'}">
        ${idx > 0 ? `<i class="fa-solid fa-chevron-right text-[9px] text-sogan-500 mx-1 select-none opacity-80" aria-hidden="true"></i>` : ''}
        ${isClickable ? `
          <button
            type="button"
            data-breadcrumb-idx="${idx}"
            data-tab="${seg.tabId || ''}"
            onclick="window.handleBreadcrumbNav('${seg.tabId || ''}')"
            class="breadcrumb-btn inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-sogan-300 hover:text-amber-200 hover:bg-sogan-900/90 hover:underline underline-offset-2 decoration-prada/60 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-prada/50 group"
            title="Lompat ke ${seg.label}"
            aria-label="Lompat ke ${seg.label}"
          >
            <i class="${seg.icon} text-[10px] text-sogan-400 group-hover:text-amber-300 transition-colors" aria-hidden="true"></i>
            <span class="font-medium hover:text-amber-200">${seg.label}</span>
          </button>
        ` : `
          <span class="breadcrumb-current inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg ${isLast ? 'bg-prada/15 text-amber-200 border border-prada/30 font-semibold' : 'text-sogan-400'}" ${isLast ? 'aria-current="page"' : ''}>
            <i class="${seg.icon} text-[10px] ${isLast ? 'text-amber-300' : 'text-sogan-500'}" aria-hidden="true"></i>
            <span class="truncate max-w-[200px] sm:max-w-none">${seg.label}</span>
          </span>
        `}
      </div>
    `;
  });

  container.innerHTML = html;

  // Pasang event listener interaktif pada setiap tombol segmen breadcrumb
  container.querySelectorAll('.breadcrumb-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.dataset.breadcrumbIdx, 10);
      const seg = segments[idx];
      if (seg && typeof seg.action === 'function') {
        seg.action();
      } else if (btn.dataset.tab && typeof switchTab === 'function') {
        switchTab(btn.dataset.tab);
      }
    });
  });

  // Update Windows Explorer path summary: JagadJawa:\Wektu\Kalender Jawa
  if (summaryEl) {
    const pathParts = ['JagadJawa:'];
    if (info.category) pathParts.push(getNavBilingualText(info.category.label).split('&')[0].trim());
    if (tabId !== 'beranda') pathParts.push(getNavBilingualText(info.title));
    if (activeSub && tabId !== 'beranda') pathParts.push(getNavBilingualText(activeSub).split('&')[0].trim());
    summaryEl.textContent = pathParts.join('\\');
  }
}

// Global Navigasi Kembali & Browser History Sync
function navigasiKembali() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back();
  } else {
    switchTab('beranda');
  }
}

if (typeof window !== 'undefined') {
  const resolveCurrentHashTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`tab-${hash}`)) {
      return hash;
    }
    return 'beranda';
  };

  // Listener popstate (tombol back/forward browser & UI native navigation)
  window.addEventListener('popstate', function(event) {
    const targetTab = (event.state && event.state.tab && document.getElementById(`tab-${event.state.tab}`))
      ? event.state.tab
      : resolveCurrentHashTab();
    switchTab(targetTab, false);
  });

  // Listener hashchange (sinkronisasi langsung jika URL hash diubah / link routing)
  window.addEventListener('hashchange', function() {
    const tab = resolveCurrentHashTab();
    switchTab(tab, false);
  });

  // Inisialisasi awal saat dokumen dimuat
  const initNavOnLoad = () => {
    const initialTab = resolveCurrentHashTab();
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState({ tab: initialTab }, '', '#' + initialTab);
    }
    switchTab(initialTab, false);

    // Event delegation fallback: tombol data-tab tanpa inline onclick tetap berpindah tab
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('[data-tab]');
      if (tabBtn && !tabBtn.getAttribute('onclick')) {
        const tabId = tabBtn.dataset.tab;
        if (tabId && document.getElementById(`tab-${tabId}`)) {
          switchTab(tabId);
        }
      }
    });
    // Re-render breadcrumb if language changes
    window.addEventListener('language-changed', () => {
      const currentTab = resolveCurrentHashTab();
      renderBreadcrumb(currentTab);
    });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initNavOnLoad);
  } else {
    initNavOnLoad();
  }
}

/**
 * Ekspor / Cetak Dokumen PDF Laporan Resmi
 * @param {'parchment'|'monochrome'} theme Estetika: 'parchment' (Kertas Kuno Tradisi Leluhur) atau 'monochrome'
 * @param {string|null} customTitle Judul dokumen cetak kustom
 */
function printLaporan(theme = 'parchment', customTitle = null) {
  let target = document.getElementById('laporan-cetak-pdf');
  
  // Jika target belum ada di DOM, buat elemen penampung cetak
  if (!target) {
    target = document.createElement('div');
    target.id = 'laporan-cetak-pdf';
    target.className = 'print-only-document';
    document.body.appendChild(target);
  } else if (target.parentElement !== document.body) {
    // Pastikan target adalah anak langsung dari document.body
    document.body.appendChild(target);
  }

  // Bersihkan kelas kalender agar cetak dokumen menggunakan layout dinamis
  document.body.classList.remove('print-kalender-active');

  // Sembunyikan area kalender secara eksplisit jika ada di DOM
  const calArea = document.getElementById('printable-calendar-area');
  const prevCalDisplay = calArea ? calArea.style.display : null;
  if (calArea) {
    calArea.style.display = 'none';
  }

  // Pastikan isi laporan sudah terisi; jika belum, coba trigger cetak nujum
  if (!target.innerHTML || target.innerHTML.trim() === '') {
    if (typeof window.printLaporanNujum === 'function') {
      window.printLaporanNujum(theme);
      return;
    }
  }

  // Format Penamaan Dokumen PDF: Jagad Jawa — [Nama Subjek / Judul Kustom]
  const originalTitle = document.title;
  if (customTitle) {
    document.title = customTitle;
  } else {
    const namaInput = document.getElementById('namaKepribadian')?.value?.trim();
    const namaSubjek = (namaInput && namaInput !== '-') ? namaInput.toUpperCase() : 'SERAT PRIMBON';
    document.title = `Jagad Jawa — ${namaSubjek}`;
  }

  // Bersihkan kelas cetak sebelumnya
  document.querySelectorAll('.print-target-active').forEach(el => el.classList.remove('print-target-active'));
  document.body.classList.remove('print-theme-parchment', 'print-theme-monochrome', 'print-theme-standard');
  target.classList.remove('theme-parchment', 'theme-monochrome', 'theme-standard');

  if (theme === 'parchment') {
    document.body.classList.add('print-theme-parchment');
    target.classList.add('theme-parchment');
  } else if (theme === 'monochrome') {
    document.body.classList.add('print-theme-monochrome');
    target.classList.add('theme-monochrome');
  } else {
    document.body.classList.add('print-theme-standard');
    target.classList.add('theme-standard');
  }

  document.body.classList.add('print-mode-active');
  target.classList.add('print-target-active');

  // Berikan sedikit jeda render style sebelum print dialog terbuka
  setTimeout(() => {
    window.print();
  }, 75);

  // Kembalikan judul halaman dan bersihkan state setelah dialog cetak ditutup
  const cleanup = () => {
    document.title = originalTitle;
    document.body.classList.remove('print-mode-active', 'print-theme-parchment', 'print-theme-monochrome', 'print-theme-standard');
    target.classList.remove('print-target-active', 'theme-parchment', 'theme-monochrome', 'theme-standard');
    if (calArea) {
      calArea.style.display = prevCalDisplay !== null ? prevCalDisplay : '';
    }
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup, { once: true });
}

function printSection(sectionId, theme = 'monochrome') {
  if (sectionId === 'kalenderCard' && typeof window.printLaporanKalender === 'function') {
    window.printLaporanKalender(theme);
    return;
  }
  if (sectionId === 'hasilPerjodohanCard' && typeof window.printLaporanPerjodohan === 'function') {
    window.printLaporanPerjodohan(theme);
    return;
  }
  if (sectionId === 'hasilSelametanCard' && typeof window.printLaporanSelametan === 'function') {
    window.printLaporanSelametan(theme);
    return;
  }

  let target = document.getElementById(sectionId);
  if ((sectionId === 'hasilKepribadianBox' || sectionId === 'laporan-cetak-pdf' || !target) && document.getElementById('laporan-cetak-pdf')) {
    printLaporan(theme || 'monochrome');
    return;
  }
  if (!target) {
    window.print();
    return;
  }

  const originalTitle = document.title;
  let customTitle = originalTitle;
  if (sectionId === 'kalenderCard') customTitle = 'Jagad Jawa — Kalender';
  else if (sectionId === 'hasilPerjodohanCard') customTitle = 'Jagad Jawa — Pitung Perjodohan';
  else if (sectionId === 'hasilSelametanCard') customTitle = 'Jagad Jawa — Pengetan Tilar Donyo';
  document.title = customTitle;

  // Tag body and target element for specialized print styling
  document.querySelectorAll('.print-target-active').forEach(el => el.classList.remove('print-target-active'));
  document.body.classList.add('print-mode-active');
  target.classList.add('print-target-active');

  // Trigger print
  setTimeout(() => {
    window.print();
  }, 50);

  // Cleanup after print dialog closes
  const cleanup = () => {
    document.title = originalTitle;
    document.body.classList.remove('print-mode-active');
    target.classList.remove('print-target-active');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup, { once: true });
}

/**
 * Unduh elemen visual sebagai file gambar PNG beresolusi tinggi (Retina 2x)
 * @param {string} elementId ID elemen target yang akan dirasterisasi
 * @param {string} filename Nama file hasil unduhan (.png)
 * @param {string} defaultBg Warna latar belakang kanvas (default: '#0b0f19')
 */
async function downloadElementAsPng(elementId, filename = 'unduhan-jagad-jawa.png', defaultBg = '#0b0f19') {
  if (elementId === 'kalenderCard' && typeof window.downloadKalenderPng === 'function') {
    return window.downloadKalenderPng();
  }

  const element = document.getElementById(elementId);
  if (!element) {
    if (typeof showToast === 'function') {
      showToast('Elemen kalender utawi tabel ora ditemokake.');
    } else if (typeof alert === 'function') {
      alert('Elemen tidak ditemukan.');
    }
    return;
  }

  if (typeof showToast === 'function') {
    showToast('Nyiapaken gambar (PNG) kualitas dhuwur...');
  }

  // Jika html2canvas tersedia dari CDN
  if (typeof html2canvas === 'function') {
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // 2x scale untuk ketajaman retina display
        useCORS: true,
        allowTaint: true,
        backgroundColor: defaultBg,
        logging: false,
        scrollX: 0,
        scrollY: (typeof window !== 'undefined' ? -window.scrollY : 0)
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof showToast === 'function') {
        showToast('Gambar kasil ka-undhuh!');
      }
    } catch (err) {
      console.error('Gagal mengunduh gambar via html2canvas:', err);
      if (typeof showToast === 'function') {
        showToast('Gagal ngundhuh gambar: ' + (err.message || 'Error'));
      }
    }
    return;
  }

  // Fallback jika html2canvas offline/belum siap
  try {
    const clone = element.cloneNode(true);
    const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : { width: 800, height: 600 };
    const width = Math.ceil(rect.width) || 800;
    const height = Math.ceil(rect.height) || 600;

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="background:${defaultBg};width:100%;height:100%;">
            ${clone.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URLObj = (typeof window !== 'undefined' && (window.URL || window.webkitURL)) ? (window.URL || window.webkitURL) : null;
    if (!URLObj) return;
    const blobURL = URLObj.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.fillStyle = defaultBg;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0);
      URLObj.revokeObjectURL(blobURL);

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof showToast === 'function') {
        showToast('Gambar kasil ka-undhuh!');
      }
    };
    image.src = blobURL;
  } catch (e) {
    console.error('Fallback rasterization failed:', e);
    if (typeof showToast === 'function') {
      showToast('Pustaka html2canvas dereng cumawis.');
    }
  }
}

if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.navigasiKembali = navigasiKembali;
  window.printLaporan = printLaporan;
  window.printSection = printSection;
  window.downloadElementAsPng = downloadElementAsPng;
  window.toggleNavDropdown = toggleNavDropdown;
  window.closeAllNavDropdowns = closeAllNavDropdowns;
  window.renderBreadcrumb = renderBreadcrumb;
  window.handleBreadcrumbNav = handleBreadcrumbNav;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    switchTab,
    toggleMobileMenu,
    closeMobileMenu,
    navigasiKembali,
    printLaporan,
    printSection,
    downloadElementAsPng,
    toggleNavDropdown,
    closeAllNavDropdowns,
    renderBreadcrumb,
    handleBreadcrumbNav
  };
}

export {
  switchTab,
  toggleMobileMenu,
  closeMobileMenu,
  navigasiKembali,
  printLaporan,
  printSection,
  downloadElementAsPng,
  toggleNavDropdown,
  closeAllNavDropdowns,
  renderBreadcrumb,
  handleBreadcrumbNav
};

export default {
  switchTab,
  toggleMobileMenu,
  closeMobileMenu,
  navigasiKembali,
  printLaporan,
  printSection,
  downloadElementAsPng,
  toggleNavDropdown,
  closeAllNavDropdowns,
  renderBreadcrumb,
  handleBreadcrumbNav
};
