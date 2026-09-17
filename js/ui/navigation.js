// Tab Navigation & Mobile Menu

function switchTab(tabId) {
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

function printSection(sectionId) {
  let target = document.getElementById(sectionId);
  if ((sectionId === 'hasilKepribadianBox' || !target) && document.getElementById('laporan-cetak-pdf')) {
    target = document.getElementById('laporan-cetak-pdf');
  }
  if (!target) {
    window.print();
    return;
  }

  // Tag body and target element for specialized print styling
  document.querySelectorAll('.print-target-active').forEach(el => el.classList.remove('print-target-active'));
  document.body.classList.add('print-mode-active');
  target.classList.add('print-target-active');

  // Trigger print
  setTimeout(() => {
    window.print();
  }, 50);

  // Cleanup after print dialog closes
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode-active');
    target.classList.remove('print-target-active');
  }, { once: true });
}

if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
  window.toggleMobileMenu = toggleMobileMenu;
  window.printSection = printSection;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { switchTab, toggleMobileMenu, printSection };
}
