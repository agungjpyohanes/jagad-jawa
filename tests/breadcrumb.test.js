/**
 * Jagad Jawa — Unit Test: Breadcrumb Navigation Component
 * Memverifikasi kemampuan interaktif tombol breadcrumb, navigasi hierarki (switchTab),
 * indikator visual hover, dan status segmen aktif.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

test('Breadcrumb Navigation - Segmen Interaktif, Event Listener, & Indikator Hover', async () => {
  // Setup lightweight DOM mock for breadcrumb testing
  const mockTrail = {
    _html: '',
    _buttons: [],
    set innerHTML(val) {
      this._html = val;
      this._buttons = [];
      const btnRegex = /<button[^>]*data-breadcrumb-idx="(\d+)"[^>]*data-tab="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g;
      let match;
      while ((match = btnRegex.exec(this._html)) !== null) {
        const btn = {
          outerHTML: match[0],
          dataset: {
            breadcrumbIdx: match[1],
            tab: match[2]
          },
          listeners: {},
          addEventListener(event, fn) {
            this.listeners[event] = fn;
          },
          click() {
            if (this.listeners['click']) {
              this.listeners['click']({ preventDefault() {} });
            }
          }
        };
        this._buttons.push(btn);
      }
    },
    get innerHTML() {
      return this._html;
    },
    querySelectorAll(selector) {
      if (selector === '.breadcrumb-btn') {
        return this._buttons;
      }
      return [];
    }
  };

  const mockSummary = { textContent: '' };

  global.document = {
    getElementById(id) {
      if (id === 'breadcrumbTrail') return mockTrail;
      if (id === 'breadcrumbPathSummary') return mockSummary;
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    querySelectorAll() {
      return [];
    }
  };

  let currentTab = null;
  global.history = {
    pushState(state) {
      if (state && state.tab) currentTab = state.tab;
    },
    replaceState(state) {
      if (state && state.tab) currentTab = state.tab;
    }
  };

  global.window = {
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent(event) {
      if (event && event.type === 'tab-switched' && event.detail) {
        currentTab = event.detail.tabId;
      }
    },
    location: { hash: '' },
    history: global.history,
    scrollTo() {}
  };

  const { renderBreadcrumb, handleBreadcrumbNav } = await import('../js/ui/navigation.js');

  // ==================== TEST 1: TAB BERANDA ====================
  // Pada beranda, hanya ada 1 segmen aktif (tidak ada tombol interaktif sebelumnya)
  renderBreadcrumb('beranda');
  let buttons = mockTrail.querySelectorAll('.breadcrumb-btn');
  assert.equal(buttons.length, 0, 'Pada tab Beranda tidak boleh ada tombol segmen sebelum terminal');
  assert.ok(mockTrail.innerHTML.includes('breadcrumb-current'), 'Beranda harus memiliki penanda segmen aktif breadcrumb-current');
  assert.ok(mockTrail.innerHTML.includes('Beranda'), 'Beranda harus ditampilkan');

  // ==================== TEST 2: TAB KALENDER JAWA ====================
  // Hierarki: Beranda > Wektu & Penanggalan > Kalender Jawa > Pranata Mangsa & Weton
  renderBreadcrumb('kalender');
  buttons = mockTrail.querySelectorAll('.breadcrumb-btn');

  // Wajib memiliki 3 tombol interaktif (Beranda, Wektu & Penanggalan, Kalender Jawa)
  assert.equal(buttons.length, 3, 'Tab Kalender harus memiliki 3 tombol breadcrumb interaktif');

  // 1. Verifikasi elemen interaktif menggunakan tag button & cursor-pointer
  buttons.forEach(btn => {
    assert.ok(btn.outerHTML.startsWith('<button'), 'Setiap segmen non-terakhir harus menggunakan tag <button>');
    assert.ok(btn.outerHTML.includes('cursor-pointer'), 'Tombol breadcrumb harus memiliki class cursor-pointer');
    assert.ok(btn.outerHTML.includes('hover:underline'), 'Tombol breadcrumb harus memiliki efek hover:underline');
    assert.ok(btn.outerHTML.includes('hover:text-amber-200'), 'Tombol breadcrumb harus memiliki efek perubahan warna teks saat hover');
  });

  // 2. Verifikasi atribut data-tab dan onclick handler
  assert.equal(buttons[0].dataset.tab, 'beranda');
  assert.ok(buttons[0].outerHTML.includes("window.handleBreadcrumbNav('beranda')"));

  assert.equal(buttons[1].dataset.tab, 'kalender'); // Wektu & Penanggalan -> default tab 'kalender'
  assert.ok(buttons[1].outerHTML.includes("window.handleBreadcrumbNav('kalender')"));

  assert.equal(buttons[2].dataset.tab, 'kalender'); // Tab Kalender Jawa
  assert.ok(buttons[2].outerHTML.includes("window.handleBreadcrumbNav('kalender')"));

  // 3. Verifikasi segmen aktif terakhir bukan tombol melainkan span breadcrumb-current
  assert.ok(mockTrail.innerHTML.includes('Pranata Mangsa & Weton'), 'Sub-level Pranata Mangsa harus ditampilkan');
  assert.ok(mockTrail.innerHTML.includes('breadcrumb-current'), 'Item terakhir harus memiliki kelas breadcrumb-current');
  assert.ok(mockTrail.innerHTML.includes('aria-current="page"'), 'Item terakhir harus memiliki atribut aria-current="page"');

  // 4. Verifikasi event listener click memicu fungsi navigasi switchTab
  currentTab = null;
  buttons[0].click(); // Klik Beranda
  assert.equal(currentTab, 'beranda', 'Klik tombol Beranda harus memicu navigasi ke "beranda"');

  currentTab = null;
  buttons[1].click(); // Klik Kategori Wektu
  assert.equal(currentTab, 'kalender', 'Klik tombol kategori Wektu harus memicu navigasi ke "kalender"');

  // ==================== TEST 3: TAB DENGAN KATEGORI LAIN (NUJUM & PRIMBON) ====================
  renderBreadcrumb('perjodohan');
  buttons = mockTrail.querySelectorAll('.breadcrumb-btn');
  assert.equal(buttons.length, 3, 'Tab Perjodohan harus memiliki 3 tombol breadcrumb interaktif');

  // Kategori Nujum & Primbon harus mengarah ke tab landing kepribadian
  assert.equal(buttons[1].dataset.tab, 'kepribadian');
  assert.equal(buttons[2].dataset.tab, 'perjodohan');

  currentTab = null;
  buttons[1].click();
  assert.equal(currentTab, 'kepribadian', 'Klik kategori Nujum & Primbon harus memicu navigasi ke "kepribadian"');

  currentTab = null;
  buttons[2].click();
  assert.equal(currentTab, 'perjodohan', 'Klik tombol tab Perjodohan harus memicu navigasi ke "perjodohan"');

  // ==================== TEST 4: CUSTOM SUBTITLE HIERARKI ====================
  renderBreadcrumb('wuku', 'Wuku Sinta');
  buttons = mockTrail.querySelectorAll('.breadcrumb-btn');
  assert.equal(buttons.length, 3, 'Dengan custom subTitle harus ada 3 tombol breadcrumb');
  assert.ok(mockTrail.innerHTML.includes('Wuku Sinta'), 'Custom subTitle Wuku Sinta harus ditampilkan');
  assert.ok(mockTrail.innerHTML.includes('breadcrumb-current'), 'Custom subTitle harus menjadi segmen aktif terakhir');

  // ==================== TEST 5: FUNGSI HANDLER GLOBAL ====================
  currentTab = null;
  handleBreadcrumbNav('aksara');
  assert.equal(currentTab, 'aksara', 'handleBreadcrumbNav("aksara") harus memicu navigasi ke "aksara"');
});
