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

export function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

export function printSection(sectionId) {
  window.print();
}
