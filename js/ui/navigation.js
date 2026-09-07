// Tab Navigation & Mobile Menu

export function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('block');
  });
  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('block');
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('text-prada', 'bg-sogan-900/80');
      btn.classList.remove('text-sogan-200');
    } else {
      btn.classList.remove('text-prada', 'bg-sogan-900/80');
      btn.classList.add('text-sogan-200');
    }
  });

  if (tabId === 'aksara') {
    // Canvas init will be handled by aksara module
    window.dispatchEvent(new CustomEvent('init-aksara-canvas'));
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

export function printSection(sectionId) {
  window.print();
}
