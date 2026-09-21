/**
 * Jagad Jawa — Modul Domain: Wayang UI
 * Pengendali interaksi galeri Wayang Purwa, filter kategori,
 * pementasan wayang interaktif, modal detail tokoh wayang,
 * serta penegasan etika alegori moral kesatria (non-stereotipe).
 */

import { WAYANG_LIST, getWayangById } from './wayang-engine.js';
import { showToast } from '../../ui/toast.js';

export const DISCLAIMER_ETIS_WAYANG = 
  "Amanat Etis & Kultural: Paraga wayang purwa punika minangka alegori moral, pralambang budi pakarti luhur, sarta kaca benggala watak kesatria ing salebeting gesang manungsa (kados déné piwulang Asta Brata). Sanès piranti kanggé matesi utawi paring cap stereotip kaku marang kepribadian manungsa adhedhasar weton lair.";

/**
 * Merender spanduk etika alegori moral kesatria wayang.
 */
export function renderWayangEthicsBanner() {
  const container = document.getElementById('wayangEthicsBannerBox');
  if (!container) return;

  container.innerHTML = `
    <div class="p-4 rounded-2xl bg-gradient-to-r from-sogan-950 via-keraton to-wulung border border-prada/40 text-xs shadow-md space-y-1.5">
      <div class="flex items-center gap-2 text-prada font-bold text-[11px] uppercase tracking-wider">
        <i class="fa-solid fa-scale-balanced text-amber-400"></i>
        <span>Etika Kultural &amp; Pralambang Sastra Wayang (Non-Stereotip)</span>
      </div>
      <p class="text-sogan-200 leading-relaxed text-[11.5px]">
        ${DISCLAIMER_ETIS_WAYANG}
      </p>
      <div class="text-[10px] text-sogan-400 italic pt-1 border-t border-sogan-800/80">
        *Saben manungsa nggadhahi daya mardika kanggé manembah, ngudi ngelmu, sarta nukulaken kabecikan ngluwihi petungan dhasar.
      </div>
    </div>
  `;
}

/**
 * Merender daftar seluruh tokoh wayang ke grid.
 */
export function renderWayangGrid() {
  const container = document.getElementById('wayangCharacterGrid');
  if (!container) return;

  renderWayangEthicsBanner();

  container.innerHTML = WAYANG_LIST.map(char => `
    <button onclick="window.selectWayangCharacter('${char.id}')" 
      class="wayang-card-item p-2.5 rounded-xl bg-keraton border border-sogan-800 text-left transition hover:border-prada hover:scale-[1.02] group flex flex-col items-center text-center cursor-pointer"
      data-id="${char.id}" data-kategori="${char.kategori}">
      <div class="w-16 h-20 mb-2 flex items-center justify-center overflow-hidden">
        <img src="${char.gambar}" alt="${char.nama}" class="max-h-full max-w-full object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition duration-200" onerror="this.style.display='none'" />
      </div>
      <div class="w-full">
        <span class="text-[9px] px-1.5 py-0.5 rounded bg-sogan-900 border border-sogan-700 text-prada block truncate mb-1">
          ${char.kategori}
        </span>
        <div class="font-bold text-sogan-100 group-hover:text-prada text-xs truncate" title="${char.nama}">
          ${char.nama.split('(')[0].trim()}
        </div>
        <div class="text-[10px] text-sogan-400 truncate mt-0.5" title="${char.kasatriyan}">
          ${char.kasatriyan.split('(')[0].trim()}
        </div>
      </div>
    </button>
  `).join('');
}

/**
 * Filter tokoh wayang berdasarkan kategori.
 * Mendukung filterWayang dan alias filterWayangCategory.
 * @param {string} kategori 
 */
export function filterWayang(kategori) {
  // Update tombol filter kategori
  document.querySelectorAll('.wayang-filter-btn, .wayang-cat-btn').forEach(btn => {
    const btnCat = btn.dataset.kategori || btn.dataset.cat;
    if (btnCat === kategori) {
      btn.className = btn.className.includes('wayang-cat-btn')
        ? 'wayang-cat-btn px-3 py-1 rounded-full border border-prada bg-prada/20 text-prada font-semibold transition'
        : 'wayang-filter-btn px-4 py-2 rounded-xl bg-gradient-to-r from-sogan-600 to-prada text-keraton font-bold shadow-md text-xs transition';
    } else {
      btn.className = btn.className.includes('wayang-cat-btn')
        ? 'wayang-cat-btn px-3 py-1 rounded-full border border-sogan-700 bg-keraton text-sogan-300 hover:border-prada hover:text-prada transition'
        : 'wayang-filter-btn px-4 py-2 rounded-xl bg-sogan-900/80 text-sogan-200 hover:text-prada border border-sogan-800 text-xs transition';
    }
  });

  const isAll = kategori === 'semua' || kategori === 'all';
  const cards = document.querySelectorAll('.wayang-card-item');
  cards.forEach(card => {
    const cardCat = card.dataset.kategori;
    if (isAll || cardCat === kategori) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

export const filterWayangCategory = filterWayang;

/**
 * Memilih tokoh wayang dan merender rinciannya di panggung kelir.
 * @param {string} id 
 */
export function selectWayangCharacter(id) {
  const data = getWayangById(id);
  if (!data) return;

  // Update gambar boneka di panggung kelir
  const puppetImg = document.querySelector('#puppetVisual img') || document.getElementById('wayangPuppet');
  if (puppetImg) {
    puppetImg.src = data.gambar;
    puppetImg.alt = data.nama;
  }

  // Update nama aktor di bawah wayang
  const actorName = document.getElementById('wayangActorName');
  if (actorName) {
    actorName.innerText = `${data.nama} (${data.kasatriyan})`;
  }

  // Update wadah informasi biodata & kasekten (puppetBioBox atau wayangSelectedDetail)
  const detailBox = document.getElementById('puppetBioBox') || document.getElementById('wayangSelectedDetail');
  if (detailBox) {
    detailBox.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sogan-800 pb-3 gap-2">
          <div>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-sogan-900 border border-sogan-700 text-prada font-semibold uppercase">
              ${data.kategori}
            </span>
            <h4 class="font-marcellus text-xl text-prada font-bold mt-1">${data.nama}</h4>
            <div class="text-xs text-sogan-300 flex items-center gap-1.5 mt-0.5">
              <i class="fa-solid fa-landmark text-amber-400"></i>
              <span>${data.kasatriyan}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.openWayangDetailModal('${data.id}')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sogan-800 to-sogan-900 border border-prada/60 hover:border-prada text-prada text-xs font-semibold flex items-center gap-2 transition shadow hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] active:scale-95">
              <i class="fa-solid fa-circle-info"></i> Amirsani Katrangan Jangkep
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
            <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1 mb-1 tracking-wider">
              <i class="fa-solid fa-feather"></i> Watak &amp; Solah Bowo (Keteladanan Batin)
            </span>
            <p class="text-sogan-200 leading-relaxed">${data.watak}</p>
          </div>
          <div class="p-3 rounded-xl bg-sogan-950/70 border border-sogan-800/90">
            <span class="text-[10px] uppercase font-bold text-prada flex items-center gap-1 mb-1 tracking-wider">
              <i class="fa-solid fa-shield-halved"></i> Pusaka &amp; Aji-Aji
            </span>
            <p class="text-sogan-200 leading-relaxed">${data.pusaka || '-'}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Highlight tombol kartu yang dipilih
  document.querySelectorAll('.wayang-card-item').forEach(btn => {
    if (btn.getAttribute('data-id') === id) {
      btn.classList.add('border-prada', 'bg-prada/15', 'shadow-[0_0_14px_rgba(212,175,55,0.35)]');
      btn.classList.remove('border-sogan-800', 'bg-keraton');
    } else {
      btn.classList.remove('border-prada', 'bg-prada/15', 'shadow-[0_0_14px_rgba(212,175,55,0.35)]');
      btn.classList.add('border-sogan-800', 'bg-keraton');
    }
  });

  if (typeof window.playDalangFX === 'function') {
    window.playDalangFX('kepyak');
  }
}

/**
 * Membuka modal detail lengkap tokoh wayang.
 * @param {string} id 
 */
export function openWayangDetailModal(id) {
  const data = getWayangById(id);
  if (!data) return;

  const modal = document.getElementById('wayangDetailModal');
  if (!modal) return;

  const elNama = document.getElementById('modalWayangNama');
  if (elNama) elNama.innerText = data.nama;
  const elKat = document.getElementById('modalWayangKategori');
  if (elKat) elKat.innerText = data.kategori;
  const elKas = document.getElementById('modalWayangKasatriyan');
  if (elKas) elKas.innerHTML = `<i class="fa-solid fa-landmark text-amber-400 mr-1"></i> ${data.kasatriyan}`;
  const elWat = document.getElementById('modalWayangWatak');
  if (elWat) elWat.innerText = data.watak;
  const elPus = document.getElementById('modalWayangPusaka');
  if (elPus) elPus.innerText = data.pusaka || '-';
  const elPas = document.getElementById('modalWayangPasangan');
  if (elPas) elPas.innerText = data.pasangan || '-';
  const elTung = document.getElementById('modalWayangTunggangan');
  if (elTung) elTung.innerText = data.tunggangan || '-';
  const elAji = document.getElementById('modalWayangAjian');
  if (elAji) elAji.innerText = data.ajian || '-';

  const imgEl = document.getElementById('modalWayangImg');
  if (imgEl) {
    imgEl.src = data.gambar;
    imgEl.alt = data.nama;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Menutup modal detail tokoh wayang.
 */
export function closeWayangDetailModal() {
  const modal = document.getElementById('wayangDetailModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflow = 'auto';
  }
}

/**
 * Menginisialisasi gestur seret wayang di kanvas kelir.
 */
export function initWayangDraggable() {
  const puppet = document.getElementById('wayangPuppet');
  if (!puppet) return;
  let isDragging = false, startX, startY, curX = 0, curY = 0;

  function onStart(e) {
    isDragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX) - curX;
    startY = (e.touches ? e.touches[0].clientY : e.clientY) - curY;
  }
  function onMove(e) {
    if (!isDragging) return;
    curX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    curY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    puppet.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
  }
  function onEnd() { isDragging = false; }

  puppet.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  puppet.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
}
