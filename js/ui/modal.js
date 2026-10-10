/**
 * Jagad Jawa — UI: Modal Controller & Backdrop Management
 * Mengatur pembukaan, penutupan, event listener backdrop, dan tombol Escape untuk seluruh modal.
 */

export function closeAnyActiveModal() {
  const modalConfigs = [
    { id: 'modalDetailKalender', close: () => { if (typeof window.tutupDetailTanggalJawa === 'function') window.tutupDetailTanggalJawa(); } },
    { id: 'modalShareCardWeton', close: () => { if (typeof window.closeWetonShareModal === 'function') window.closeWetonShareModal(); } },
    { id: 'modalNujumPokemonCard', close: () => { if (typeof window.closeNujumPokemonCardModal === 'function') window.closeNujumPokemonCardModal(); } },
    { id: 'modalPustakaReader', close: () => { if (typeof window.closePustakaReader === 'function') window.closePustakaReader(); } },
    { id: 'modalGlosariumNujum', close: () => { if (typeof window.closeGlosariumNujumModal === 'function') window.closeGlosariumNujumModal(); } },
    { id: 'modalEnsiklopediaWuku', close: () => { if (typeof window.closeEnsiklopediaWukuModal === 'function') window.closeEnsiklopediaWukuModal(); } },
    { id: 'wayangDetailModal', close: () => { if (typeof window.closeWayangDetailModal === 'function') window.closeWayangDetailModal(); } },
    { id: 'modalPilihMode', close: () => { if (typeof window.closeOnboardingModal === 'function') window.closeOnboardingModal(); } }
  ];
  modalConfigs.forEach(({ id, close }) => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      close();
    }
  });
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

export function trapFocusInModal(modalEl, event) {
  if (!modalEl || event.key !== 'Tab') return;
  const focusableEls = modalEl.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusableEls || focusableEls.length === 0) return;

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    }
  } else {
    if (document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }
}

export function initModalListeners() {
  const modalConfigs = [
    { id: 'modalDetailKalender', close: () => { if (typeof window.tutupDetailTanggalJawa === 'function') window.tutupDetailTanggalJawa(); } },
    { id: 'modalShareCardWeton', close: () => { if (typeof window.closeWetonShareModal === 'function') window.closeWetonShareModal(); } },
    { id: 'modalNujumPokemonCard', close: () => { if (typeof window.closeNujumPokemonCardModal === 'function') window.closeNujumPokemonCardModal(); } },
    { id: 'modalPustakaReader', close: () => { if (typeof window.closePustakaReader === 'function') window.closePustakaReader(); } },
    { id: 'modalGlosariumNujum', close: () => { if (typeof window.closeGlosariumNujumModal === 'function') window.closeGlosariumNujumModal(); } },
    { id: 'modalEnsiklopediaWuku', close: () => { if (typeof window.closeEnsiklopediaWukuModal === 'function') window.closeEnsiklopediaWukuModal(); } },
    { id: 'wayangDetailModal', close: () => { if (typeof window.closeWayangDetailModal === 'function') window.closeWayangDetailModal(); } },
    { id: 'modalPilihMode', close: () => { if (typeof window.closeOnboardingModal === 'function') window.closeOnboardingModal(); } }
  ];

  modalConfigs.forEach(({ id, close }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          close();
        }
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          trapFocusInModal(el, e);
        }
      });
    }
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAnyActiveModal();
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.closeAnyActiveModal = closeAnyActiveModal;
  window.trapFocusInModal = trapFocusInModal;
}
