/**
 * Jagad Jawa — Modul Domain: Share Card Weton
 * Generator kartu weton estetis untuk media sosial & WhatsApp viral loop
 * dilengkapi ornamen budaya Nusantara, ringkasan weton, dan petikan pitutur luhur.
 */

import { getDayInfo, getTanggalJawaLengkap, getNeptu, getPranataMangsaLengkap, BULAN_MASEHI } from './kalender-engine.js';
import { showToast, copyToClipboard } from '../../ui/toast.js';

const KUTIPAN_BIJAK = [
  { jawa: "Urip iku urup.", arti: "Hidup itu hendaknya menyala dan memberi manfaat bagi sesama." },
  { jawa: "Sura dira jayaningrat lebur dening pangastuti.", arti: "Segala angkara murka dan kekerasan hati akan lebur oleh kelembutan dan kasih sayang." },
  { jawa: "Memayu hayuning bawana.", arti: "Memperindah dan menjaga keselarasan alam semesta." },
  { jawa: "Aja adigang, adigung, adiguna.", arti: "Jangan menyombongkan kekuatan, kekuasaan, atau kepandaian." },
  { jawa: "Ngluruk tanpa bala, menang tanpa ngasorake.", arti: "Berjuang tanpa mengandalkan massa, menang tanpa merendahkan lawan." },
  { jawa: "Alang-alang dudu aling-aling.", arti: "Rintangan hidup bukanlah penghalang untuk mencapai kemuliaan budi." }
];

export function getCulturalQuote(seed = 0) {
  return KUTIPAN_BIJAK[Math.abs(seed) % KUTIPAN_BIJAK.length];
}

/**
 * Format teks WhatsApp yang rapi dan elegan untuk dibagikan ke keluarga / rekan.
 * @param {number} y 
 * @param {number} m 
 * @param {number} d 
 * @returns {string}
 */
export function buildWhatsAppShareText(y, m, d) {
  const tglJawa = getTanggalJawaLengkap(y, m, d);
  const pm = getPranataMangsaLengkap(d, m);
  const quote = getCulturalQuote(y * 10000 + m * 100 + d);

  const tglMasehiStr = `${d} ${BULAN_MASEHI[m - 1]} ${y}`;

  return `✨ *WETON & PETUNGAN JAWA* ✨\n` +
    `_Kadhudhah lumantar Jagad Jawa — Kasultanan Nusantara_\n\n` +
    `📅 *Tanggal Masehi:* ${tglMasehiStr}\n` +
    `🌟 *Weton:* *${tglJawa.dino} ${tglJawa.pas}*\n` +
    `🔢 *Neptu:* ${tglJawa.neptu} (${tglJawa.dino} + ${tglJawa.pas})\n` +
    `📜 *Penanggalan Jawa:* ${tglJawa.tglJawa} ${tglJawa.bulanJawa} ${tglJawa.tahunAJ} AJ (Tahun ${tglJawa.tahunSiklus})\n` +
    `🪐 *Wuku:* ${tglJawa.wukuName} (${tglJawa.wukuNo}/30)\n` +
    `🌾 *Pranata Mangsa:* ${pm.nama} — _${pm.musimTani}_\n` +
    `🪶 *Candrasangkala:* "${pm.candrasangkala}"\n\n` +
    `💬 *Pitutur Luhur:* \n"${quote.jawa}"\n_${quote.arti}_\n\n` +
    `Telusuri petungan weton lan nujum pribadimu ing:\nhttps://jagad-jawa.web.app`;
}

/**
 * Membuka WhatsApp dengan teks weton siap kirim.
 * @param {number} y 
 * @param {number} m 
 * @param {number} d 
 */
export function shareWetonViaWhatsApp(y, m, d) {
  const text = buildWhatsAppShareText(y, m, d);
  const encoded = encodeURIComponent(text);
  const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(waUrl, '_blank');
  showToast('Membuka WhatsApp untuk membagikan weton...');
}

/**
 * Menggambar Share Card Weton ke HTML5 Canvas secara murni.
 * @param {HTMLCanvasElement} canvas 
 * @param {number} y 
 * @param {number} m 
 * @param {number} d 
 */
export function drawWetonCardToCanvas(canvas, y, m, d) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const tglJawa = getTanggalJawaLengkap(y, m, d);
  const pm = getPranataMangsaLengkap(d, m);
  const quote = getCulturalQuote(y * 10000 + m * 100 + d);
  const tglMasehiStr = `${d} ${BULAN_MASEHI[m - 1]} ${y}`;

  const width = 640;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  // 1. Background Gradient Gelap Keraton
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0f141d');
  grad.addColorStop(0.5, '#182030');
  grad.addColorStop(1, '#090d14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornamen Bingkai Emas (Dual Border)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // 3. Header Kop Keraton
  ctx.fillStyle = '#fdf0cd';
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('PAWIYATAN KASULTANAN · JAGAD JAWA', width / 2, 60);

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 24px serif';
  ctx.fillText('KARTU WETON NUSANTARA', width / 2, 92);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 106);
  ctx.lineTo(width - 120, 106);
  ctx.stroke();

  // 4. Tanggal Masehi
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14px sans-serif';
  ctx.fillText(tglMasehiStr, width / 2, 136);

  // 5. Hero Weton Box
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.roundRect(50, 160, width - 100, 150, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tulisan Weton Utama
  ctx.fillStyle = '#f6ecd2';
  ctx.font = 'bold 38px serif';
  ctx.fillText(`${tglJawa.dino} ${tglJawa.pas}`, width / 2, 222);

  // Badge Neptu & Wuku
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Neptu ${tglJawa.neptu}  ·  Wuku ${tglJawa.wukuName}`, width / 2, 260);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${tglJawa.tglJawa} ${tglJawa.bulanJawa} ${tglJawa.tahunAJ} AJ · Windu ${tglJawa.namaWindu}`, width / 2, 288);

  // 6. Section Pranata Mangsa & Musim Tani
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(50, 330, width - 100, 180, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('KOSMOLOGI PRANATA MANGSA', width / 2, 360);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 20px serif';
  ctx.fillText(pm.nama, width / 2, 392);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'italic 13px serif';
  ctx.fillText(`"${pm.candrasangkala}"`, width / 2, 420);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Mangsa: ${pm.musimTani}`, width / 2, 450);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  // Wrap text for pratandha
  const pratandha = `Tandha Alam: ${pm.pratandhaAlam}`;
  ctx.fillText(pratandha.length > 60 ? pratandha.substring(0, 58) + '...' : pratandha, width / 2, 480);

  // 7. Section Pitutur Luhur
  ctx.fillStyle = 'rgba(30, 27, 20, 0.85)';
  ctx.beginPath();
  ctx.roundRect(50, 530, width - 100, 140, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('FALSAFAH & PITUTUR LUHUR', width / 2, 560);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold italic 18px serif';
  ctx.fillText(`"${quote.jawa}"`, width / 2, 595);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  ctx.fillText(quote.arti, width / 2, 630);

  // 8. Footer Watermark & Branding
  ctx.fillStyle = '#64748b';
  ctx.font = '11px monospace';
  ctx.fillText('jagad-jawa.web.app · Lestari Budaya Luhur Nusantara', width / 2, 730);
}

/**
 * Menampilkan modal share card weton.
 * @param {number} y 
 * @param {number} m 
 * @param {number} d 
 */
export function openWetonShareModal(y, m, d) {
  const modal = document.getElementById('modalShareCardWeton');
  const canvas = document.getElementById('shareCardCanvas');
  if (!modal || !canvas) return;

  drawWetonCardToCanvas(canvas, y, m, d);

  const btnWa = document.getElementById('btnShareWetonWA');
  if (btnWa) {
    btnWa.onclick = () => shareWetonViaWhatsApp(y, m, d);
  }

  const btnDownload = document.getElementById('btnDownloadShareCardPng');
  if (btnDownload) {
    btnDownload.onclick = () => downloadShareCardPng(y, m, d);
  }

  const btnCopy = document.getElementById('btnCopyShareText');
  if (btnCopy) {
    btnCopy.onclick = () => {
      const text = buildWhatsAppShareText(y, m, d);
      copyToClipboard(text, 'Teks weton kasil disalin kanggé WhatsApp!');
    };
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

export function closeWetonShareModal() {
  const modal = document.getElementById('modalShareCardWeton');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

export function downloadShareCardPng(y, m, d) {
  const canvas = document.getElementById('shareCardCanvas');
  if (!canvas) return;

  const tglJawa = getTanggalJawaLengkap(y, m, d);
  const link = document.createElement('a');
  link.download = `Weton-${tglJawa.dino}-${tglJawa.pas}-${d}-${m}-${y}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Kartu weton kasil diunduh minangka gambar PNG!');
}
