/**
 * Jagad Jawa — UI: Modal Controller & Backdrop Management
 * Mengatur pembukaan, penutupan, event listener backdrop, dan tombol Escape untuk seluruh modal.
 */

export function closeAnyActiveModal() {
  const modalConfigs = [
    { id: 'modalDetailKalender', close: () => { if (typeof window.tutupDetailTanggalJawa === 'function') window.tutupDetailTanggalJawa(); } },
    { id: 'modalShareCardWeton', close: () => { if (typeof window.closeWetonShareModal === 'function') window.closeWetonShareModal(); } },
    { id: 'modalGlosariumNujum', close: () => { if (typeof window.closeGlosariumNujumModal === 'function') window.closeGlosariumNujumModal(); } },
    { id: 'modalEnsiklopediaWuku', close: () => { if (typeof window.closeEnsiklopediaWukuModal === 'function') window.closeEnsiklopediaWukuModal(); } },
    { id: 'wayangDetailModal', close: () => { if (typeof window.closeWayangDetailModal === 'function') window.closeWayangDetailModal(); } }
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

export function initModalListeners() {
  const modalConfigs = [
    { id: 'modalDetailKalender', close: () => { if (typeof window.tutupDetailTanggalJawa === 'function') window.tutupDetailTanggalJawa(); } },
    { id: 'modalShareCardWeton', close: () => { if (typeof window.closeWetonShareModal === 'function') window.closeWetonShareModal(); } },
    { id: 'modalGlosariumNujum', close: () => { if (typeof window.closeGlosariumNujumModal === 'function') window.closeGlosariumNujumModal(); } },
    { id: 'modalEnsiklopediaWuku', close: () => { if (typeof window.closeEnsiklopediaWukuModal === 'function') window.closeEnsiklopediaWukuModal(); } },
    { id: 'wayangDetailModal', close: () => { if (typeof window.closeWayangDetailModal === 'function') window.closeWayangDetailModal(); } }
  ];

  modalConfigs.forEach(({ id, close }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          close();
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
}
