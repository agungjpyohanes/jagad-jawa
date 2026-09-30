// Toast Notification Utility

export function showToast(msg) {
  if (typeof document === 'undefined') return;
  const toast = document.getElementById('toastBox');
  if (!toast) return;
  const msgEl = document.getElementById('toastMessage');
  if (msgEl) msgEl.innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 2800);
}

export function copyToClipboard(text, msg) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(msg);
}
