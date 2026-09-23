import { test, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Mock localStorage and DOM for testing mode module in Node environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.has(key) ? mockStorage.get(key) : null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

// Mock simple DOM elements
const classSet = new Set();
global.document = {
  body: {
    classList: {
      add: (cls) => classSet.add(cls),
      remove: (cls) => classSet.delete(cls),
      contains: (cls) => classSet.has(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (classSet.has(cls)) classSet.delete(cls);
          else classSet.add(cls);
        } else if (force) {
          classSet.add(cls);
        } else {
          classSet.delete(cls);
        }
      }
    },
    style: {}
  },
  getElementById: (id) => {
    return {
      id,
      textContent: '',
      className: '',
      setAttribute: () => {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      }
    };
  }
};

global.window = {
  dispatchEvent: () => {}
};

global.CustomEvent = class CustomEvent {
  constructor(name, detail) {
    this.name = name;
    this.detail = detail;
  }
};

import {
  getMode,
  setMode,
  isPemula,
  isAhli,
  hasModePreference,
  applyModeToUI,
  toggleMode,
  MODE_STORAGE_KEY,
  MODE_PEMULA,
  MODE_AHLI
} from '../js/ui/mode.js';

describe('Fitur Mode Pemula vs Mode Ahli (Ringkas vs Lengkap)', () => {
  beforeEach(() => {
    mockStorage.clear();
    classSet.clear();
  });

  it('getMode() harus mengembalikan null jika belum pernah disimpan di localStorage', () => {
    assert.strictEqual(hasModePreference(), false);
    assert.strictEqual(getMode(), null);
    assert.strictEqual(isPemula(), false);
    assert.strictEqual(isAhli(), false);
  });

  it('setMode("pemula") harus menyimpan ke localStorage dan mengatur state pemula', () => {
    setMode('pemula');
    assert.strictEqual(mockStorage.get(MODE_STORAGE_KEY), 'pemula');
    assert.strictEqual(getMode(), 'pemula');
    assert.strictEqual(isPemula(), true);
    assert.strictEqual(isAhli(), false);
    assert.strictEqual(hasModePreference(), true);
    assert.ok(classSet.has('mode-pemula'));
    assert.ok(!classSet.has('mode-ahli'));
  });

  it('setMode("ahli") harus menyimpan ke localStorage dan mengatur state ahli', () => {
    setMode('ahli');
    assert.strictEqual(mockStorage.get(MODE_STORAGE_KEY), 'ahli');
    assert.strictEqual(getMode(), 'ahli');
    assert.strictEqual(isAhli(), true);
    assert.strictEqual(isPemula(), false);
    assert.strictEqual(hasModePreference(), true);
    assert.ok(classSet.has('mode-ahli'));
    assert.ok(!classSet.has('mode-pemula'));
  });

  it('setMode harus menerima alias "ringkas" sebagai "pemula" dan "lengkap" sebagai "ahli"', () => {
    setMode('ringkas');
    assert.strictEqual(getMode(), 'pemula');
    assert.strictEqual(isPemula(), true);

    setMode('lengkap');
    assert.strictEqual(getMode(), 'ahli');
    assert.strictEqual(isAhli(), true);
  });

  it('toggleMode() harus berganti antara pemula dan ahli secara bergantian', () => {
    setMode('ahli');
    const firstToggle = toggleMode();
    assert.strictEqual(firstToggle, 'pemula');
    assert.strictEqual(getMode(), 'pemula');

    const secondToggle = toggleMode();
    assert.strictEqual(secondToggle, 'ahli');
    assert.strictEqual(getMode(), 'ahli');
  });

  it('applyModeToUI() harus mengaplikasikan class CSS yang tepat ke body', () => {
    applyModeToUI('pemula');
    assert.ok(classSet.has('mode-pemula'));
    assert.ok(!classSet.has('mode-ahli'));

    applyModeToUI('ahli');
    assert.ok(classSet.has('mode-ahli'));
    assert.ok(!classSet.has('mode-pemula'));
  });

  it('CSS styles.css harus mendefinisikan aturan display: none untuk .ahli-only dan .pemula-only', () => {
    const cssPath = path.join(rootDir, 'css', 'styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    assert.ok(css.includes('body.mode-pemula .ahli-only'), 'Harus ada selector body.mode-pemula .ahli-only');
    assert.ok(css.includes('body.mode-ahli .pemula-only'), 'Harus ada selector body.mode-ahli .pemula-only');
    assert.ok(css.includes('display: none !important'), 'Harus menyembunyikan elemen via display: none !important');
  });

  it('index.html harus memuat tombol mode switch dan modal onboarding pemilihan mode awal', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    assert.ok(html.includes('id="modeToggleBtn"'), 'Harus ada tombol id="modeToggleBtn" di navbar');
    assert.ok(html.includes('id="mobileModeToggleBtn"'), 'Harus ada tombol id="mobileModeToggleBtn" di mobile menu');
    assert.ok(html.includes('id="modalPilihMode"'), 'Harus ada modal onboarding id="modalPilihMode"');
    assert.ok(html.includes("pilihModeAwal('pemula')"), 'Modal harus memuat opsi pilihModeAwal pemula');
    assert.ok(html.includes("pilihModeAwal('ahli')"), 'Modal harus memuat opsi pilihModeAwal ahli');
  });

  it('index.html harus menandai fitur-fitur kompleks dengan class ahli-only', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    assert.ok(html.includes('ahli-only'), 'index.html harus menggunakan class ahli-only');
    assert.ok(html.includes('subTabNujumNonJodoh') && html.includes('ahli-only'), 'subTabNujumNonJodoh harus berkelas ahli-only');
    assert.ok(html.includes('btnPrintKepribadianLengkap') && html.includes('ahli-only'), 'btnPrintKepribadianLengkap harus berkelas ahli-only');
    assert.ok(html.includes('btnPrintKalenderParchment') && html.includes('ahli-only'), 'btnPrintKalenderParchment harus berkelas ahli-only');
  });
});
