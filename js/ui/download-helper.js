/**
 * Jagad Jawa — Helper Ekspor & Unduh File (Mobile & Desktop Friendly)
 * Menangani download file teks, naskah kuno, kamus, dan ekspor canvas PNG
 * dengan fallback tangguh untuk peramban mobile (iOS Safari, Android Chrome, WebView).
 */

import { showToast } from './toast.js';

/**
 * Mendeteksi apakah perangkat pengguna adalah mobile / layar sentuh.
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '')
    || (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
}

/**
 * Mengunduh konten string sebagai file teks (.txt / .md / .json).
 * @param {string} filename 
 * @param {string} content 
 * @param {string} [mimeType='text/plain;charset=utf-8']
 */
export function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);

    showToast(`Berkas "${filename}" kasil diundhuh! 📜`);
  } catch (err) {
    console.error('Download text error:', err);
    showToast('Gagal ngundhuh berkas teks. Mangga cobi malih.', 'error');
  }
}

/**
 * Mengunduh HTML5 Canvas sebagai gambar PNG dengan optimasi khusus mobile.
 * Mendukung Web Share API (Save to Photos / Files) pada HP.
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {string} filename 
 * @param {Object} [shareMeta={}]
 * @returns {Promise<boolean>}
 */
export async function downloadCanvasAsPng(canvas, filename, shareMeta = {}) {
  if (!canvas) {
    showToast('Kanvas gambar boten pinanggih.', 'error');
    return false;
  }

  const title = shareMeta.title || 'Jagad Jawa Pusaka';
  const text = shareMeta.text || 'Koleksi Budaya Luhur Nusantara — Jagad Jawa';
  const mobile = isMobileDevice();

  return new Promise((resolve) => {
    // 1. Coba konversi ke Blob (Metode paling stabil di mobile & desktop)
    canvas.toBlob(async (blob) => {
      if (!blob) {
        // Fallback ke dataUrl jika toBlob null (misal tainted canvas)
        fallbackDataUrlDownload(canvas, filename);
        resolve(true);
        return;
      }

      // 2. Jika perangkat Mobile dan mendukung Web Share File API
      if (mobile && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title,
              text
            });
            showToast('Gambar kasil kasimpen / dipun bagikaken! ✨');
            resolve(true);
            return;
          }
        } catch (shareErr) {
          // User cancel/abort tidak perlu tampil error
          if (shareErr.name === 'AbortError') {
            resolve(false);
            return;
          }
          console.warn('Web Share API error, fallback to direct blob download:', shareErr);
        }
      }

      // 3. Standar Blob Download URL
      try {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1500);

        showToast(`Gambar "${filename}" kasil diundhuh! ✨`);
        resolve(true);
      } catch (dlErr) {
        console.error('Blob link error:', dlErr);
        fallbackDataUrlDownload(canvas, filename);
        resolve(true);
      }
    }, 'image/png');
  });
}

/**
 * Fallback download via Data URL
 * @param {HTMLCanvasElement} canvas 
 * @param {string} filename 
 */
function fallbackDataUrlDownload(canvas, filename) {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 500);
    showToast('Gambar kasil diundhuh! ✨');
  } catch (e) {
    console.error('DataURL download failed:', e);
    // Jika benar-benar diblokir (misal standalone webview iOS), buka di jendela baru
    try {
      const win = window.open();
      if (win) {
        win.document.write(`<img src="${canvas.toDataURL('image/png')}" style="max-width:100%; height:auto;" alt="Jagad Jawa"/><p style="font-family:sans-serif; text-align:center; padding:10px;">Tutul lan tahan gambar kanggé nyimpen dhateng Galeri HP Panjenengan.</p>`);
        showToast('Gambar dipun bikak. Tutul & tahan kanggé nyimpen.');
      }
    } catch (popupErr) {
      showToast('Gagal ngundhuh gambar. Cobi tangkap layar (screenshot).', 'error');
    }
  }
}
