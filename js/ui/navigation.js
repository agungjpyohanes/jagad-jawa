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

  // Close any open desktop dropdowns upon selection
  closeAllNavDropdowns();

  if (pushState !== false && typeof history !== 'undefined' && history.pushState) {
    history.pushState({ tab: tabId }, '', '#' + tabId);
  }

  if (tabId === 'aksara') {
    // Canvas init will be handled by aksara module
    window.dispatchEvent(new CustomEvent('init-aksara-canvas'));
  }

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

// Global click handler to close dropdowns when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-group')) {
      closeAllNavDropdowns();
    }
  });

  // Tombol Esc menutup semua dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllNavDropdowns();
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
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
  // Listener popstate (tombol back/forward browser & UI)
  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.tab) {
      switchTab(event.state.tab, false);
    } else {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`tab-${hash}`)) {
        switchTab(hash, false);
      } else {
        switchTab('beranda', false);
      }
    }
  });

  // Inisialisasi awal saat dokumen dimuat
  window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`tab-${hash}`)) {
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState({ tab: hash }, '', '#' + hash);
      }
      switchTab(hash, false);
    } else {
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState({ tab: 'beranda' }, '', '#beranda');
      }
    }
  });
}

/**
 * Ekspor / Cetak Dokumen PDF Laporan Resmi
 * @param {'parchment'|'monochrome'} theme Estetika: 'parchment' (Kertas Kuno Keraton) atau 'monochrome'
 * @param {string|null} customTitle Judul dokumen cetak kustom
 */
function printLaporan(theme = 'parchment', customTitle = null) {
  let target = document.getElementById('laporan-cetak-pdf');
  if (!target) {
    window.print();
    return;
  }

  // Format Penamaan Dokumen PDF: Jagad Jawa — [Nama Subjek / Judul Kustom]
  const originalTitle = document.title;
  if (customTitle) {
    document.title = customTitle;
  } else {
    const namaInput = document.getElementById('namaKepribadian')?.value?.trim();
    const namaSubjek = (namaInput && namaInput !== '-') ? namaInput.toUpperCase() : 'SUBJEK';
    document.title = `Jagad Jawa — ${namaSubjek}`;
  }

  // Bersihkan kelas cetak sebelumnya
  document.querySelectorAll('.print-target-active').forEach(el => el.classList.remove('print-target-active'));
  document.body.classList.remove('print-theme-parchment', 'print-theme-monochrome');
  target.classList.remove('theme-parchment', 'theme-monochrome');

  if (theme === 'parchment') {
    document.body.classList.add('print-theme-parchment');
    target.classList.add('theme-parchment');
  } else {
    document.body.classList.add('print-theme-monochrome');
    target.classList.add('theme-monochrome');
  }

  document.body.classList.add('print-mode-active');
  target.classList.add('print-target-active');

  // Berikan sedikit jeda render style sebelum print dialog terbuka
  setTimeout(() => {
    window.print();
  }, 60);

  // Kembalikan judul halaman dan bersihkan state setelah dialog cetak ditutup
  const cleanup = () => {
    document.title = originalTitle;
    document.body.classList.remove('print-mode-active', 'print-theme-parchment', 'print-theme-monochrome');
    target.classList.remove('print-target-active', 'theme-parchment', 'theme-monochrome');
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
  window.navigasiKembali = navigasiKembali;
  window.printLaporan = printLaporan;
  window.printSection = printSection;
  window.downloadElementAsPng = downloadElementAsPng;
  window.toggleNavDropdown = toggleNavDropdown;
  window.closeAllNavDropdowns = closeAllNavDropdowns;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    switchTab,
    toggleMobileMenu,
    navigasiKembali,
    printLaporan,
    printSection,
    downloadElementAsPng,
    toggleNavDropdown,
    closeAllNavDropdowns
  };
}
