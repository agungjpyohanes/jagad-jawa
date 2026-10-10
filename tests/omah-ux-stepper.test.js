import test from 'node:test';
import assert from 'node:assert/strict';

import {
  omahStepper,
  setOmahWizardStep,
  toggleOmahFormMode
} from '../js/modules/omah/omah-ui.js';
import { hitungPetungOmah } from '../js/modules/omah/omah-engine.js';

test('Petung Omah UX - Stepper State Machine & Validasi Tanggal', () => {
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

  // Reset tanggal kosong
  mockDoc.getElementById('omahDatePicker').value = '';

  // Langkah 1 ke 2 tanpa tanggal -> DITOLAK
  const resTo2 = setOmahWizardStep(2, true);
  assert.equal(resTo2, false, 'Harus memblokir ke langkah 2 jika tanggal kosong');
  assert.ok(mockDoc.getElementById('omahDatePicker').focused, 'Input tanggal harus difokuskan');

  // Isi tanggal -> DIIZINKAN ke langkah 2
  mockDoc.getElementById('omahDatePicker').value = '2024-06-20';
  const resTo2Success = setOmahWizardStep(2, true);
  assert.equal(resTo2Success, true);
  assert.equal(mockDoc.getElementById('omahStepContainer2').classList.contains('hidden'), false);

  // Langkah 2 ke 3 -> DIIZINKAN
  const resTo3 = setOmahWizardStep(3, true);
  assert.equal(resTo3, true);
  assert.equal(mockDoc.getElementById('omahStepContainer3').classList.contains('hidden'), false);

  // Navigasi mundur ke langkah 1 -> DIIZINKAN
  const resBack1 = setOmahWizardStep(1, false);
  assert.equal(resBack1, true);
  assert.equal(mockDoc.getElementById('omahStepContainer1').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('omahStepContainer2').classList.contains('hidden'), true);
});

test('Petung Omah UX - Toggle Mode Form Lengkap Power-User', () => {
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
  toggleOmahFormMode();
  assert.equal(mockDoc.getElementById('omahWizardNav').classList.contains('hidden'), true, 'Nav stepper harus disembunyikan di full mode');
  assert.equal(mockDoc.getElementById('omahStepContainer1').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('omahStepContainer2').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('omahStepContainer3').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('labelToggleOmahMode').textContent, 'Mode Stepper Ringkas');

  // Toggle kembali ke Stepper Mode
  toggleOmahFormMode();
  assert.equal(mockDoc.getElementById('omahWizardNav').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('labelToggleOmahMode').textContent, 'Mode Form Lengkap');
});

test('Petung Omah Engine - Non-Regresi: Babon Rumus Set A, B, C & Cempuri Tetap Murni', () => {
  // Bersihkan data mock global jika ada
  delete globalThis._currentOmahData;

  const res = hitungPetungOmah({
    dina: 'Senin',
    pasaran: 'Kliwon',
    arahLawang: 'Timur',
    nomorLawang: 1,
    arahPindah: 'Selatan'
  });

  assert.ok(res);
  assert.equal(res.dina, 'Senin');
  assert.equal(res.pasaran, 'Kliwon');
  // Neptu App: Senin (4) + Kliwon (8) = 12
  assert.equal(res.neptuApp.neptuJumlah, 12);
  // Neptu NB: Senin (4) + Kliwon (8) = 12
  assert.equal(res.neptuNb.neptuJumlah, 12);

  // Set A: 12 mod 4 = sisa 4 (Kapetak) -> Ala
  assert.equal(res.setA.sisa, 4);
  assert.equal(res.setA.nama, 'Kapetak');
  assert.equal(res.setA.status, 'Ala');

  // Set B: 12 mod 5 = sisa 2 (Yasa) -> Becik
  assert.equal(res.setB.sisa, 2);
  assert.equal(res.setB.nama, 'Yasa');
  assert.equal(res.setB.status, 'Becik');

  // Cempuri
  assert.ok(res.cempuri);
  assert.equal(res.cempuri.nomor, 1);
  assert.equal(res.cempuri.positions.length, 9);
});

test('Petung Omah UX - Reset Hari Ini & Date Range / Format Validation', () => {
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

  // Tanggal salah format -> Ditolak validator
  mockDoc.getElementById('omahDatePicker').value = 'invalid-date';
  const resInvalid = setOmahWizardStep(2, true);
  assert.equal(resInvalid, false, 'Format tanggal tidak valid harus ditolak');

  // Tanggal valid -> Diterima
  mockDoc.getElementById('omahDatePicker').value = '2026-10-08';
  const resValid = setOmahWizardStep(2, true);
  assert.equal(resValid, true);
});
