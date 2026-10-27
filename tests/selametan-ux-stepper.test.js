import test from 'node:test';
import assert from 'node:assert/strict';

import {
  setSelametanWizardStep,
  applySelametanWizardStepUI,
  toggleAccordionSelametan,
  toggleMilestoneDetail,
  hitungSelametan
} from '../js/modules/selametan/selametan-ui.js';
import {
  hitungSelametanDates,
  TEMPLAT_DONGA_KEYAKINAN,
  SELAMETAN_KULTURAL_DATA
} from '../js/modules/selametan/selametan-engine.js';
import {
  TARGET_HARI_SELAMETAN,
  TARGET_PASARAN_SELAMETAN
} from '../js/data/selametan.js';

test('Selametan UX - Stepper State Machine & Validasi Input Kosong', () => {
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
          focus() { this.focused = true; },
          scrollIntoView() { this.scrolled = true; }
        };
      }
      return elements[id];
    },
    querySelector(selector) {
      if (selector === 'input[name="waktuWafatRadio"]:checked') {
        return elements['waktuWafatSelectedRadio'] || null;
      }
      return null;
    }
  };

  globalThis.document = mockDoc;
  globalThis.window = {
    getLanguage: () => 'id',
    showToast: (msg) => { lastToast = msg; }
  };

  // Reset awal: tgl kosong, radio belum dipilih
  mockDoc.getElementById('tglWafatInput').value = '';
  delete elements['waktuWafatSelectedRadio'];

  // Test 1: Dari langkah 1 mencoba lompat ke langkah 2 dengan tanggal kosong -> DITOLAK
  const resStep2Blocked = setSelametanWizardStep(2, true);
  assert.equal(resStep2Blocked, false, 'Harus memblokir ke langkah 2 jika tanggal wafat kosong');
  assert.ok(mockDoc.getElementById('tglWafatInput').focused, 'Input tanggal harus difokuskan');

  // Test 2: Dari langkah 1 mencoba lompat ke langkah 3 dengan tanggal kosong -> DITOLAK
  const resStep3Blocked = setSelametanWizardStep(3, true);
  assert.equal(resStep3Blocked, false, 'Harus memblokir ke langkah 3 jika tanggal wafat kosong');

  // Test 3: Isi tanggal wafat, lompat ke langkah 2 -> DIIZINKAN
  mockDoc.getElementById('tglWafatInput').value = '2024-01-01';
  const resStep2Allowed = setSelametanWizardStep(2, true);
  assert.equal(resStep2Allowed, true, 'Harus mengizinkan ke langkah 2 setelah tanggal diisi');
  assert.equal(mockDoc.getElementById('selametanStepContainer2').classList.contains('hidden'), false);

  // Test 4: Dari langkah 2 mencoba lompat ke langkah 3 tanpa memilih waktu wafat (radio kosong) -> DITOLAK
  delete elements['waktuWafatSelectedRadio'];
  const resStep3NoRadio = setSelametanWizardStep(3, true);
  assert.equal(resStep3NoRadio, false, 'Harus memblokir ke langkah 3 jika waktu wafat belum dipilih');

  // Test 5: Pilih radio 'siang' lalu coba lompat ke langkah 3 -> DIIZINKAN
  elements['waktuWafatSelectedRadio'] = { value: 'siang' };
  const resStep3WithSiang = setSelametanWizardStep(3, true);
  assert.equal(resStep3WithSiang, true, 'Harus mengizinkan ke langkah 3 saat radio waktu wafat sudah dipilih');
  assert.equal(mockDoc.getElementById('selametanStepContainer3').classList.contains('hidden'), false, 'Container langkah 3 harus tampil');
  assert.equal(mockDoc.getElementById('selametanStepContainer2').classList.contains('hidden'), true, 'Container langkah 2 harus disembunyikan');

  // Test 6: Navigasi mundur ke langkah 1 atau 2 tanpa validasi -> DIIZINKAN
  const resBackTo1 = setSelametanWizardStep(1, false);
  assert.equal(resBackTo1, true);
  assert.equal(mockDoc.getElementById('selametanStepContainer1').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('selametanStepContainer2').classList.contains('hidden'), true);
});

test('Selametan UX - Accordion & Detail Milestone Collapsible Toggle', () => {
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          style: {},
          classList: {
            classes: new Set(['hidden']),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); }
          },
          setAttribute(k, v) { this[k] = v; }
        };
      }
      return elements[id];
    }
  };

  globalThis.document = mockDoc;

  // Setup tombol accordion tabel 7 milestone
  mockDoc.getElementById('rincianSelametanContent').classList.add('hidden');
  toggleAccordionSelametan();
  assert.equal(mockDoc.getElementById('rincianSelametanContent').classList.contains('hidden'), false);
  assert.equal(mockDoc.getElementById('btnToggleAccordionSelametan')['aria-expanded'], 'true');

  toggleAccordionSelametan();
  assert.equal(mockDoc.getElementById('rincianSelametanContent').classList.contains('hidden'), true);
  assert.equal(mockDoc.getElementById('btnToggleAccordionSelametan')['aria-expanded'], 'false');

  // Setup collapsible detail milestone
  mockDoc.getElementById('detail_milestone_0').classList.add('hidden');
  toggleMilestoneDetail('detail_milestone_0');
  assert.equal(mockDoc.getElementById('detail_milestone_0').classList.contains('hidden'), false);

  toggleMilestoneDetail('detail_milestone_0');
  assert.equal(mockDoc.getElementById('detail_milestone_0').classList.contains('hidden'), true);
});

test('Selametan UX - Differential Parity: Siang vs Bakda Maghrib & Ketepatan 7 Milestone', () => {
  // Oracle: 1 Januari 2024 (Senin Pahing)
  // Wafat SIANG: Tanggal dasar kalkulasi tetap 1 Jan 2024 -> Geblak: Senin Pahing
  const dataSiang = hitungSelametanDates(2024, 1, 1, 'siang', 'Ki Ageng', 'universal');
  assert.equal(dataSiang.geblak.hari, 'Senin');
  assert.equal(dataSiang.geblak.pasaran, 'Pahing');
  assert.equal(dataSiang.geblak.tanggal, 1);
  assert.equal(dataSiang.items.length, 7);

  // Wafat BAKDA MAGHRIB (Malam): Bergeser +1 hari Jawa (keesokan harinya: 2 Jan 2024 -> Selasa Pon)
  const dataMalam = hitungSelametanDates(2024, 1, 1, 'malam_maghrib', 'Ki Ageng', 'universal');
  assert.equal(dataMalam.geblak.hari, 'Selasa');
  assert.equal(dataMalam.geblak.pasaran, 'Pon');
  assert.equal(dataMalam.geblak.tanggal, 2);
  assert.equal(dataMalam.items.length, 7);

  // Verifikasi 7 Milestone Siang cocok dengan matriks sultan agungan
  // 1. 3 Harian (Nelung dina)
  assert.equal(dataSiang.items[0].targetH, TARGET_HARI_SELAMETAN[1][0]); // Rabu
  assert.equal(dataSiang.items[0].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][0]); // Wage
  // 2. 7 Harian (Mitung dina)
  assert.equal(dataSiang.items[1].targetH, TARGET_HARI_SELAMETAN[1][1]); // Minggu
  assert.equal(dataSiang.items[1].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][1]); // Manis/Legi
  // 3. 40 Harian (Matangpuluh)
  assert.equal(dataSiang.items[2].targetH, TARGET_HARI_SELAMETAN[1][2]); // Jumat
  assert.equal(dataSiang.items[2].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][2]); // Wage
  // 4. 100 Harian (Nyatus)
  assert.equal(dataSiang.items[3].targetH, TARGET_HARI_SELAMETAN[1][3]); // Selasa
  assert.equal(dataSiang.items[3].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][3]); // Pahing
  // 5. Pendak Pisan
  assert.equal(dataSiang.items[4].targetH, TARGET_HARI_SELAMETAN[1][4]);
  assert.equal(dataSiang.items[4].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][4]);
  // 6. Pendak Pindho
  assert.equal(dataSiang.items[5].targetH, TARGET_HARI_SELAMETAN[1][5]);
  assert.equal(dataSiang.items[5].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][5]);
  // 7. Nyewu (1000 dina)
  assert.equal(dataSiang.items[6].targetH, TARGET_HARI_SELAMETAN[1][6]);
  assert.equal(dataSiang.items[6].targetP, TARGET_PASARAN_SELAMETAN['Pahing'][6]);

  // Verifikasi 7 Milestone Malam (Selasa = idx 2, Pon)
  // 1. 3 Harian
  assert.equal(dataMalam.items[0].targetH, TARGET_HARI_SELAMETAN[2][0]); // Kamis
  assert.equal(dataMalam.items[0].targetP, TARGET_PASARAN_SELAMETAN['Pon'][0]); // Kliwon
  // 2. 7 Harian
  assert.equal(dataMalam.items[1].targetH, TARGET_HARI_SELAMETAN[2][1]); // Senin
  assert.equal(dataMalam.items[1].targetP, TARGET_PASARAN_SELAMETAN['Pon'][1]); // Pahing
});

test('Selametan UX - Refleksi Doa Inklusif 6 Keyakinan', () => {
  const keyakinanKeys = Object.keys(TEMPLAT_DONGA_KEYAKINAN);
  assert.ok(keyakinanKeys.includes('universal'));
  assert.ok(keyakinanKeys.includes('islam'));
  assert.ok(keyakinanKeys.includes('kristen'));
  assert.ok(keyakinanKeys.includes('katolik'));
  assert.ok(keyakinanKeys.includes('hindu'));
  assert.ok(keyakinanKeys.includes('buddha'));
  assert.ok(keyakinanKeys.includes('konghucu'));

  keyakinanKeys.forEach(key => {
    const res = hitungSelametanDates(2024, 5, 10, 'siang', 'Fulan', key);
    assert.equal(res.items.length, 7);
    res.items.forEach(item => {
      assert.ok(item.donga && item.donga.length > 5, `Doa untuk keyakinan ${key} harus ada`);
      assert.ok(item.dongaKeyakinanMap[key], `Map doa harus memiliki teks untuk ${key}`);
    });
  });
});
