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

  document.querySelectorAll('.nav-btn, .nav-link').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

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
 */
function printLaporan(theme = 'parchment') {
  let target = document.getElementById('laporan-cetak-pdf');
  if (!target) {
    window.print();
    return;
  }

  // Format Penamaan Dokumen PDF: Jagad Jawa — [Nama Subjek]
  const namaInput = document.getElementById('namaKepribadian')?.value?.trim();
  const namaSubjek = (namaInput && namaInput !== '-') ? namaInput.toUpperCase() : 'SUBJEK';
  const originalTitle = document.title;
  document.title = `Jagad Jawa — ${namaSubjek}`;

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

if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
  window.toggleMobileMenu = toggleMobileMenu;
  window.navigasiKembali = navigasiKembali;
  window.printLaporan = printLaporan;
  window.printSection = printSection;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { switchTab, toggleMobileMenu, navigasiKembali, printLaporan, printSection };
}
