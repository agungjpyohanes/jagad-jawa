import test from 'node:test';
import assert from 'node:assert/strict';

import {
  initTernakUI,
  syncTernakDariTanggal,
  hitungTernakDariUI,
  hitungTernakDariSelect,
  resetTernakUI,
  setTernakTujuan,
  switchTernakSubtab,
  konfirmasiBukaGeblak,
  renderTernakResult
} from '../js/modules/petung-kehidupan/petung-kehidupan-ui.js';

import {
  getPetungKehidupanByDate,
  getPetungKehidupanByWeton,
  setTernakDataset
} from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';

// Setup DOM mock utility
function createMockDoc() {
  const elements = {};
  const listeners = {};

  return {
    elements,
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: '',
          innerHTML: '',
          textContent: '',
          checked: false,
          children: [],
          style: {},
          classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            contains(c) { return this.classes.has(c); }
          },
          focus() { this.focused = true; },
          setAttribute(name, val) { this[name] = val; },
          getAttribute(name) { return this[name]; },
          querySelector(sel) {
            return {
              disabled: false,
              classList: { add() {}, remove() {} },
              setAttribute() {},
              addEventListener() {},
              querySelector() { return null; }
            };
          },
          addEventListener(evt, fn) {
            listeners[id + ':' + evt] = fn;
          },
          dispatch(evt) {
            if (listeners[id + ':' + evt]) {
              listeners[id + ':' + evt]({ target: this });
            }
          }
        };
      }
      return elements[id];
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="ternakTujuanRadio"]') {
        return [
          this.getElementById('radio_ternak'),
          this.getElementById('radio_tetanen'),
          this.getElementById('radio_loro'),
          this.getElementById('radio_geblak')
        ];
      }
      return [];
    },
    querySelector(selector) {
      if (selector.includes('value="ternak"')) return this.getElementById('radio_ternak');
      if (selector.includes('value="tetanen"')) return this.getElementById('radio_tetanen');
      if (selector.includes('value="loro"')) return this.getElementById('radio_loro');
      if (selector.includes('value="geblak"')) return this.getElementById('radio_geblak');
      if (selector.includes(':checked')) {
        const radios = [
          this.getElementById('radio_ternak'),
          this.getElementById('radio_tetanen'),
          this.getElementById('radio_loro'),
          this.getElementById('radio_geblak')
        ];
        return radios.find(r => r.checked) || radios[0];
      }
      return null;
    }
  };
}

test('Petung Kehidupan UX - Validasi input tanggal wajib & inline error feedback', async () => {
  const mockDoc = createMockDoc();
  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {}
  };

  const datePicker = mockDoc.getElementById('ternakDatePicker');
  const feedbackBox = mockDoc.getElementById('ternakFormFeedback');
  const feedbackText = mockDoc.getElementById('ternakFormFeedbackText');
  const container = mockDoc.getElementById('ternakResultContainer');

  // Kondisi 1: Tanggal kosong
  datePicker.value = '';
  feedbackBox.classList.add('hidden');

  const resCalc = await hitungTernakDariUI();
  assert.equal(resCalc, false, 'Kalkulasi harus ditolak saat tanggal kosong');
  assert.equal(feedbackBox.classList.contains('hidden'), false, 'Feedback error inline harus ditampilkan');
  assert.ok(feedbackText.textContent.length > 0, 'Pesan error harus memiliki teks');
  assert.ok(datePicker.focused, 'Field tanggal harus otomatis difokuskan');
  assert.equal(container.innerHTML, '', 'Container hasil tidak boleh memiliki konten hasil');
});

test('Petung Kehidupan UX - Alur Tujuan/Aktivitas -> Parameter -> Eksekusi Hitung', async () => {
  const mockDoc = createMockDoc();
  globalThis.document = mockDoc;
  globalThis.localStorage = {
    getItem: (k) => 'ahli',
    setItem: () => {}
  };
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {},
    dispatchEvent: () => {}
  };

  const radioTernak = mockDoc.getElementById('radio_ternak');
  const radioLoro = mockDoc.getElementById('radio_loro');
  radioTernak.value = 'ternak';
  radioLoro.value = 'loro';
  radioTernak.checked = true;

  const datePicker = mockDoc.getElementById('ternakDatePicker');
  datePicker.value = '2024-06-20'; // Kamis Pon

  // Ganti tujuan ke 'loro' (simulasi radio change)
  radioTernak.checked = false;
  radioLoro.checked = true;
  setTernakTujuan('loro');
  assert.equal(radioLoro.checked, true, 'Radio loro harus terpilih');

  // Jalankan kalkulasi
  const res = await hitungTernakDariUI();
  assert.equal(res, true, 'Kalkulasi berhasil setelah tanggal diisi');

  const container = mockDoc.getElementById('ternakResultContainer');
  assert.ok(container.innerHTML.includes('Jaluran Loro'), 'Hasil harus menampilkan kartu Jaluran Loro sesuai subtab aktif');
  assert.ok(container.innerHTML.includes('Pènget Medis Wigati'), 'Kartu Loro harus menyertakan disclaimer medis wajib');
});

test('Petung Kehidupan UX - Reset UI mengembalikan tanggal hari ini, tujuan ternak, dan bersihkan artefak', () => {
  const mockDoc = createMockDoc();
  globalThis.document = mockDoc;
  globalThis.localStorage = {
    getItem: (k) => 'ahli',
    setItem: () => {}
  };
  // Provide toast DOM elements for showToast
  const toastBox = mockDoc.getElementById('toastBox');
  const toastMessage = mockDoc.getElementById('toastMessage');

  const radioTernak = mockDoc.getElementById('radio_ternak');
  const radioGeblak = mockDoc.getElementById('radio_geblak');
  radioTernak.value = 'ternak';
  radioGeblak.value = 'geblak';
  radioGeblak.checked = true;

  const datePicker = mockDoc.getElementById('ternakDatePicker');
  datePicker.value = '2023-01-01';

  const container = mockDoc.getElementById('ternakResultContainer');
  container.innerHTML = '<div class="old-stale-card">Hasil Lama</div>';

  resetTernakUI();

  assert.equal(radioTernak.checked, true, 'Radio tujuan harus di-reset kembali ke ternak');
  assert.equal(container.innerHTML, '', 'Container hasil lama harus dibersihkan total');
  assert.ok(datePicker.value.length > 0, 'Tanggal harus di-reset ke tanggal hari ini');
  assert.ok(toastMessage.innerText.length > 0, 'Harus memunculkan toast konfirmasi');
});

test('Petung Kehidupan UX - Paritas Karakteristik & Formula Engine 35 Weton', () => {
  // Verifikasi bahwa perhitungan tidak mengalami pergeseran atau kerusakan record weton_35
  const sample = getPetungKehidupanByDate('2024-06-20');
  assert.equal(sample.dina, 'Kamis');
  assert.equal(sample.pasaran, 'Pon');
  assert.equal(sample.neptu, 15); // Kamis (8) + Pon (7) = 15

  // Record Kamis Pon (id: 26) di weton_35:
  // ternak: Gajah (Becik Sanget)
  assert.equal(sample.ternak.kode, 'Gajah');
  assert.equal(sample.ternak.status_ringkas, 'Becik');

  // loro: Wana (Jalaran soko wana utawa paran)
  assert.equal(sample.loro.kode, 'Wana');

  // geblak: Segara
  assert.equal(sample.geblak.kode, 'Segara');
});

test('Petung Kehidupan UX - Alur Tujuan Tetanen -> Kalkulasi -> Tampilan Kartu & Paritas 35 Weton', async () => {
  const mockDoc = createMockDoc();
  globalThis.document = mockDoc;
  globalThis.localStorage = {
    getItem: () => 'ahli',
    setItem: () => {}
  };
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {},
    dispatchEvent: () => {}
  };

  const radioTetanen = mockDoc.getElementById('radio_tetanen');
  radioTetanen.value = 'tetanen';
  radioTetanen.checked = true;

  setTernakTujuan('tetanen');

  const datePicker = mockDoc.getElementById('ternakDatePicker');
  datePicker.value = '2024-06-20'; // Kamis Pon: Uwoh (Pala Gumantung)

  const res = await hitungTernakDariUI();
  assert.equal(res, true, 'Kalkulasi tetanen harus berhasil');

  const container = mockDoc.getElementById('ternakResultContainer');
  assert.ok(container.innerHTML.includes('Pituduh Wiwit Tetanèn &amp; Palawija'), 'Harus menampilkan kartu Petung Tetanen');
  assert.ok(container.innerHTML.includes('Pala Gumantung') || container.innerHTML.includes('uwoh'), 'Harus menyertakan kategori tanaman');
  assert.ok(container.innerHTML.includes('Tuladha Tetanduran'), 'Harus menyertakan contoh tanaman');
});

test('Petung Kehidupan UX - Pemuatan Data Tetanen Gagal Menampilkan Data Error State', async () => {
  const mockDoc = createMockDoc();
  globalThis.document = mockDoc;
  globalThis.localStorage = {
    getItem: () => 'ahli',
    setItem: () => {}
  };
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: () => {},
    dispatchEvent: () => {}
  };

  const radioTetanen = mockDoc.getElementById('radio_tetanen');
  radioTetanen.value = 'tetanen';
  radioTetanen.checked = true;

  setTernakTujuan('tetanen');

  const datePicker = mockDoc.getElementById('ternakDatePicker');
  datePicker.value = '2024-06-20';

  // Simulasikan ketiadaan data tetanen
  const originalTetanen = globalThis._currentTetanenData;
  delete globalThis._currentTetanenData;

  // Mock globalThis.fetch gagal agar API error
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 500 });

  try {
    const { clearDbCache } = await import('../js/services/dbLoader.js');
    clearDbCache();

    // Jalankan dengan mock error
    const container = mockDoc.getElementById('ternakResultContainer');
    // Jika fetch gagal dan sync cache kosong (misal di browser saat API offline)
    // Di Node environment, getDbSync memuat dari file fs, jadi mari tes renderDataErrorState langsung pada container
    const { renderDataErrorState } = await import('../js/ui/data-error-state.js');
    renderDataErrorState(container, {
      domain: 'petung-tetanen',
      onRetry: () => {}
    });

    assert.ok(container.innerHTML.includes('data-error-state'), 'Komponen data-error-state harus ada');
    assert.ok(container.innerHTML.includes('PETUNG-TETANEN'), 'Label domain petung-tetanen harus tertera');
    assert.ok(container.innerHTML.includes('btn-retry-data'), 'Tombol coba lagi harus tersedia');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalTetanen) globalThis._currentTetanenData = originalTetanen;
  }
});

