import test from 'node:test';
import assert from 'node:assert/strict';

import { WizardStepper } from '../js/ui/wizard-stepper.js';
import {
  ijabStepper,
  setIjabWizardStep,
  toggleIjabFormMode,
  periksaPrefillJodoh,
  terapkanPrefillJodohKeIjab
} from '../js/modules/ijab/ijab-ui.js';
import { hitungPetungIjab } from '../js/modules/ijab/ijab-engine.js';

test('WizardStepper - State transitions, progress bar, & boundary limits', () => {
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          style: {},
          classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id'
  };

  const stepper = new WizardStepper({
    namespace: 'test',
    totalSteps: 3,
    steps: {
      1: { labelId: 'Langkah 1', labelJv: 'Langkah 1 Jv' },
      2: { labelId: 'Langkah 2', labelJv: 'Langkah 2 Jv' },
      3: { labelId: 'Langkah 3', labelJv: 'Langkah 3 Jv' }
    },
    onValidateStep: (from, to) => {
      if (to === 3 && from === 1) return false; // tidak boleh loncat
      return true;
    }
  });

  assert.equal(stepper.getCurrentStep(), 1);

  // Pindah ke step 2 -> diizinkan
  const res2 = stepper.goToStep(2);
  assert.equal(res2, true);
  assert.equal(stepper.getCurrentStep(), 2);
  assert.equal(elements['testProgressBar'].style.width, '66.7%');
  assert.equal(elements['testProgressBarContainer']['aria-valuenow'], '2');

  // Coba loncat dari 1 ke 3 -> divalidasi callback
  stepper.goToStep(1, false);
  const resJump = stepper.goToStep(3, true);
  assert.equal(resJump, false, 'Loncat harus dicegah validator');
  assert.equal(stepper.getCurrentStep(), 1);

  // Boundary checks: < 1 atau > 3
  stepper.goToStep(0, false);
  assert.equal(stepper.getCurrentStep(), 1);
  stepper.goToStep(99, false);
  assert.equal(stepper.getCurrentStep(), 3);
});

test('Petung Ijab UX - Stepper State Machine & Validasi Input Kosong', () => {
  const elements = {};
  let lastToast = '';

  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: '',
          style: {},
          classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; },
          focus() { this.focused = true; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: (msg) => { lastToast = msg; }
  };

  // Reset tanggal akad kosong
  mockDoc.getElementById('ijabDatePicker').value = '';

  // Langkah 1 ke 2 tanpa tanggal -> DITOLAK
  const resTo2 = setIjabWizardStep(2, true);
  assert.equal(resTo2, false, 'Harus memblokir ke langkah 2 jika tanggal kosong');
  assert.ok(mockDoc.getElementById('ijabDatePicker').focused, 'Input tanggal harus difokuskan');

  // Isi tanggal akad -> DIIZINKAN ke langkah 2
  mockDoc.getElementById('ijabDatePicker').value = '2024-06-20';
  const resTo2Success = setIjabWizardStep(2, true);
  assert.equal(resTo2Success, true);
  assert.equal(mockDoc.getElementById('ijabStepContainer2').classList.contains('hidden'), false);

  // Langkah 2 ke 3 -> DIIZINKAN
  const resTo3 = setIjabWizardStep(3, true);
  assert.equal(resTo3, true);
  assert.equal(mockDoc.getElementById('ijabStepContainer3').classList.contains('hidden'), false);

  // Navigasi mundur ke langkah 1 -> DIIZINKAN
  const resBack1 = setIjabWizardStep(1, false);
  assert.equal(resBack1, true);
  assert.equal(mockDoc.getElementById('ijabStepContainer1').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('ijabStepContainer2').classList.contains('hidden'), true);
});

test('Petung Ijab UX - Prefill Integrasi Jodoh (Hanya Belum Menikah & Proteksi Married)', () => {
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: '',
          innerHTML: '',
          style: {},
          classList: {
            classes: new Set(['hidden']),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {},
    LAST_PERJODOHAN_DATA: {
      wanita: { nama: 'Dewi Sekar' },
      pria: { nama: 'Raden Panji' },
      totalNeptu: 28
    },
    LAST_MANTU_DATA: [
      {
        dateStr: '2024-10-15',
        formattedDate: '15 Oktober 2024',
        weton: 'Selasa Kliwon',
        predikat: 'Sri'
      }
    ]
  };

  // Case 1: Status = married -> JANGAN tampilkan rekomendasi/banner prefill
  globalThis.window.LAST_STATUS_HUBUNGAN = 'married';
  periksaPrefillJodoh();
  assert.equal(mockDoc.getElementById('ijabJodohPrefillBanner').classList.contains('hidden'), true, 'Status married tidak boleh memicu prefill');

  // Case 2: Status = planning (belum menikah) -> Banner prefill HARUS muncul
  globalThis.window.LAST_STATUS_HUBUNGAN = 'planning';
  periksaPrefillJodoh();
  assert.equal(mockDoc.getElementById('ijabJodohPrefillBanner').classList.contains('hidden'), false, 'Status planning harus memunculkan banner prefill');
  assert.ok(mockDoc.getElementById('ijabJodohPrefillText').innerHTML.includes('Dewi Sekar'));

  // Terapkan prefill -> Tanggal terisi, banner hilang, melangkah ke step 2
  terapkanPrefillJodohKeIjab();
  assert.equal(mockDoc.getElementById('ijabDatePicker').value, '2024-10-15');
  assert.equal(mockDoc.getElementById('ijabJodohPrefillBanner').classList.contains('hidden'), true);
});

test('Petung Ijab UX - Toggle Mode Form Lengkap Power-User', () => {
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          style: {},
          classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {}
  };

  // Mode stepper awal -> toggle ke Mode Form Lengkap
  toggleIjabFormMode();
  assert.equal(mockDoc.getElementById('ijabWizardNav').classList.contains('hidden'), true, 'Nav stepper harus disembunyikan di full mode');
  assert.equal(mockDoc.getElementById('ijabStepContainer1').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('ijabStepContainer2').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('ijabStepContainer3').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('labelToggleIjabMode').textContent, 'Mode Stepper Ringkas');

  // Toggle kembali ke Stepper Mode
  toggleIjabFormMode();
  assert.equal(mockDoc.getElementById('ijabWizardNav').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('labelToggleIjabMode').textContent, 'Mode Form Lengkap');
});

test('Petung Ijab Engine - Non-Regresi: Formula & Sistem Neptu Khusus Tetap Murni', () => {
  // Bersihkan data mock global jika ada
  delete globalThis._currentIjabData;

  // Verifikasi formula tidak termutasi
  const res = hitungPetungIjab({
    dina: 'Senin',
    pasaran: 'Pahing',
    wuku: 'Sinta',
    sasi: 'Sura',
    tahun: 'Alip',
    tanggalJawa: 1
  });

  assert.ok(res);
  assert.equal(res.dina, 'Senin');
  assert.equal(res.pasaran, 'Pahing');
  // Neptu khusus ijab: Senin (4) + Pahing (3) = 7 (Bukan standar 4+9=13!)
  assert.equal(res.neptuCalc.neptuDina, 4);
  assert.equal(res.neptuCalc.neptuPasaran, 3);
  assert.equal(res.neptuCalc.neptuJumlah, 7);
  assert.ok(res.wetonData);
  assert.ok(res.wukuData);
  assert.ok(res.factors.length > 0);
  assert.ok(res.simpulan.status);
});

test('Petung Ijab UX - Reset Hari Ini & Date Range / Format Validation', () => {
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: '',
          innerHTML: '',
          style: {},
          classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; },
          focus() { this.focused = true; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {}
  };

  // Reset stepper ke step 1 terlebih dahulu
  ijabStepper.goToStep(1, false);

  // Tanggal akad salah format (bukan YYYY-MM-DD lengkap) -> Ditolak validator
  mockDoc.getElementById('ijabDatePicker').value = 'abc';
  const resInvalid = setIjabWizardStep(2, true);
  assert.equal(resInvalid, false, 'Format tanggal tidak valid harus ditolak');

  // Tanggal akad valid -> Diterima
  mockDoc.getElementById('ijabDatePicker').value = '2026-10-08';
  const resValid = setIjabWizardStep(2, true);
  assert.equal(resValid, true);
});
