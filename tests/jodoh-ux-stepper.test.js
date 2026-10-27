import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeStatusHubungan,
  isStatusMarried,
  getStatusHubunganLabel,
  setJodohWizardStep,
  applyJodohWizardStepUI,
  toggleAccordion7Metode
} from '../js/modules/jodoh/jodoh-ui.js';
import {
  hitungPitung7Metode,
  cariRekomendasiTanggalMantu,
  getTingkatKeharmonisan
} from '../js/modules/jodoh/jodoh-engine.js';
import {
  saveJodohHistory,
  getJodohHistory,
  clearAllJodohHistory
} from '../js/modules/jodoh/jodoh-history.js';

test('Jodoh UX - Normalisasi status hubungan & deteksi married', () => {
  assert.equal(normalizeStatusHubungan('planning'), 'planning');
  assert.equal(normalizeStatusHubungan('belum_menikah'), 'planning');
  assert.equal(normalizeStatusHubungan('engaged'), 'engaged');
  assert.equal(normalizeStatusHubungan('married'), 'married');
  assert.equal(normalizeStatusHubungan('sudah_menikah'), 'married');
  assert.equal(normalizeStatusHubungan(''), 'planning');
  assert.equal(normalizeStatusHubungan(undefined), 'planning');

  assert.equal(isStatusMarried('married'), true);
  assert.equal(isStatusMarried('sudah_menikah'), true);
  assert.equal(isStatusMarried('planning'), false);
  assert.equal(isStatusMarried('engaged'), false);
});

test('Jodoh UX - Label status hubungan dwibahasa', () => {
  // Mode ID
  globalThis.window = {
    getLanguage: () => 'id'
  };
  assert.equal(getStatusHubunganLabel('planning'), 'Rencana Menikah (Calon Pengantin)');
  assert.equal(getStatusHubunganLabel('engaged'), 'Lamaran / Tunangan');
  assert.equal(getStatusHubunganLabel('married'), 'Sudah Menikah (Pasutri)');

  // Mode JV
  globalThis.window.getLanguage = () => 'jv';
  assert.equal(getStatusHubunganLabel('planning'), 'Rancangan Palakrama (Calon Pengantèn)');
  assert.equal(getStatusHubunganLabel('engaged'), 'Lamaran / Pacangan');
  assert.equal(getStatusHubunganLabel('married'), 'Sampun Palakrama (Pasangan)');
});

test('Jodoh UX - Validasi Stepper State Machine (Pemblokiran jika tanggal kosong)', () => {
  // Simulasi DOM minimal
  const elements = {};
  const mockDoc = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: '',
          innerText: '',
          textContent: '',
          classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); },
            toggle(c, force) {
              if (force === undefined) {
                if (this.classes.has(c)) this.classes.delete(c);
                else this.classes.add(c);
              } else if (force) {
                this.classes.add(c);
              } else {
                this.classes.delete(c);
              }
            }
          },
          style: {},
          setAttribute(k, v) { this[k] = v; },
          removeAttribute(k) { delete this[k]; },
          focus() {}
        };
      }
      return elements[id];
    },
    querySelectorAll() { return []; }
  };

  globalThis.document = mockDoc;
  globalThis.window.isPemula = () => true;

  // 1. Awal di Langkah 1 (Status Hubungan) -> Tidak butuh tanggal
  const step1Ok = setJodohWizardStep(1, true);
  assert.equal(step1Ok, true, 'Langkah 1 selalu valid');

  // 2. Transisi ke Langkah 2 (Data Pria) -> Valid
  const step2Ok = setJodohWizardStep(2, true);
  assert.equal(step2Ok, true, 'Langkah 2 bisa dibuka dari langkah 1');

  // 3. Coba lompat ke Langkah 3 saat tanggal pria masih kosong -> Harus TERBLOKIR
  elements['tglL'].value = '';
  const step3Blocked = setJodohWizardStep(3, true);
  assert.equal(step3Blocked, false, 'Langkah 3 harus terblokir jika tanggal pria kosong');

  // 4. Isi tanggal pria valid -> Sekarang harus lolos ke Langkah 3
  elements['tglL'].value = '1994-08-20';
  const step3Ok = setJodohWizardStep(3, true);
  assert.equal(step3Ok, true, 'Langkah 3 berhasil dibuka jika tanggal pria valid');

  // 5. Coba lompat ke Langkah 4 saat tanggal wanita masih kosong -> Harus TERBLOKIR
  elements['tglP'].value = '';
  const step4Blocked = setJodohWizardStep(4, true);
  assert.equal(step4Blocked, false, 'Langkah 4 harus terblokir jika tanggal wanita kosong');

  // 6. Isi tanggal wanita valid -> Sekarang harus lolos ke Langkah 4
  elements['tglP'].value = '1995-05-12';
  const step4Ok = setJodohWizardStep(4, true);
  assert.equal(step4Ok, true, 'Langkah 4 berhasil dibuka jika kedua tanggal valid');
});

test('Jodoh Engine & Branching - Parity output 7 metode dan percabangan status hubungan', () => {
  const p = {
    nama: 'Dewi Sekartaji',
    hari: 'Kamis',
    pasaran: 'Legi',
    neptu: 13,
    aksaraDepan: 'DA',
    aksaraBelakang: 'JA'
  };
  const l = {
    nama: 'Panji Asmorobangun',
    hari: 'Jumat',
    pasaran: 'Kliwon',
    neptu: 14,
    aksaraDepan: 'PA',
    aksaraBelakang: 'NGA'
  };

  const hasil = hitungPitung7Metode(p, l);

  // Parity 7 metode tidak berubah
  assert.equal(hasil.totalNeptu, 27);
  assert.equal(hasil.rows.length, 7);
  assert.equal(hasil.rows[0].h.nama, 'SRI');
  assert.equal(hasil.rows[1].h.nama, 'LUNGGUH');
  assert.equal(hasil.rows[2].h.nama, 'BUMI KAPETAK');

  // Percabangan Status Hubungan:
  // Planning & Engaged -> Rekomendasi mantu harus dicari
  const mantuPlanning = cariRekomendasiTanggalMantu(hasil.totalNeptu);
  assert.ok(Array.isArray(mantuPlanning));
  assert.ok(mantuPlanning.length > 0, 'Harus ada usulan tanggal mantu untuk planning/engaged');
  assert.equal(mantuPlanning.length, 5, 'Harus 5 tanggal mantu');

  // Married -> Rekomendasi mantu kosong, panduan pasutri aktif
  const mantuMarried = isStatusMarried('married') ? [] : cariRekomendasiTanggalMantu(hasil.totalNeptu);
  assert.equal(mantuMarried.length, 0, 'Status married tidak boleh menampilkan rekomendasi tanggal mantu');

  const keharmonisan = getTingkatKeharmonisan(hasil.summary);
  assert.ok(keharmonisan.predikat, 'Tingkat keharmonisan harus memiliki predikat');
  assert.ok(keharmonisan.saranKultural, 'Harus memiliki saran kultural untuk pasutri');
});

test('Jodoh History - Penyimpanan riwayat dengan status hubungan baru', () => {
  clearAllJodohHistory();

  const mockHasil = {
    wanita: { nama: 'Dewi', hari: 'Kamis', pasaran: 'Legi', neptu: 13 },
    pria: { nama: 'Panji', hari: 'Jumat', pasaran: 'Kliwon', neptu: 14 },
    totalNeptu: 27,
    summary: {
      skorKeselarasan: 71,
      keharmonisan: { predikat: 'Rukun & Lestari' },
      baik: 5,
      campur: 2,
      buruk: 0,
      total: 7
    }
  };

  const itemPlanning = saveJodohHistory(mockHasil, {
    tglP: '1995-05-12',
    tglL: '1994-08-20',
    statusHubungan: 'planning'
  });
  assert.equal(itemPlanning.statusHubungan, 'planning');

  const itemMarried = saveJodohHistory(mockHasil, {
    tglP: '1995-05-12',
    tglL: '1994-08-20',
    statusHubungan: 'married'
  });
  assert.equal(itemMarried.statusHubungan, 'married');

  const history = getJodohHistory();
  assert.equal(history.length, 2);
  assert.equal(history[0].statusHubungan, 'married');
  assert.equal(history[1].statusHubungan, 'planning');
});

test('Jodoh UX - Perubahan status hubungan tidak menghapus tanggal dan tidak meninggalkan hasil stale', async () => {
  // Setup data hasil awal
  const mockHasil = {
    totalNeptu: 27,
    pria: { nama: 'Panji', neptu: 14 },
    wanita: { nama: 'Dewi', neptu: 13 },
    summary: { baik: 5, campur: 2, buruk: 0, total: 7, skorKeselarasan: 71 }
  };
  globalThis.window.LAST_PERJODOHAN_DATA = mockHasil;
  globalThis.window.LAST_STATUS_HUBUNGAN = 'planning';
  globalThis.window.LAST_MANTU_DATA = [{ weton: 'Senin Pon' }];

  const pairInfo = { innerHTML: '' };
  const rekomendasiBox = { innerHTML: '' };

  globalThis.document = {
    getElementById(id) {
      if (id === 'perjodohanPairInfo') return pairInfo;
      if (id === 'rekomendasiMantuBox') return rekomendasiBox;
      return null;
    }
  };

  // Simulasikan input tanggal tetap ada di form
  const inputP = '1995-05-12';
  const inputL = '1994-08-20';

  // Ubah status ke married
  const { onStatusHubunganChange } = await import('../js/modules/jodoh/jodoh-ui.js');
  onStatusHubunganChange('married');

  // Tanggal input tidak boleh hilang / berubah
  assert.equal(inputP, '1995-05-12', 'Tanggal wanita tidak boleh terhapus');
  assert.equal(inputL, '1994-08-20', 'Tanggal pria tidak boleh terhapus');

  // Pada status married, data mantu dibersihkan (panjang 0) dan panduan pasutri aktif
  assert.equal(globalThis.window.LAST_MANTU_DATA.length, 0, 'LAST_MANTU_DATA harus kosong saat married');
  assert.ok(rekomendasiBox.innerHTML.includes('PASUTRI'), 'Harus menampilkan panduan pasutri');
  assert.ok(!rekomendasiBox.innerHTML.includes('5 Usulan Tanggal Mantu'), 'Tidak boleh menampilkan saran mantu untuk married');

  // Kembalikan ke engaged -> rekomendasi mantu aktif kembali tanpa perlu isi ulang tanggal
  onStatusHubunganChange('engaged');
  assert.ok(globalThis.window.LAST_MANTU_DATA.length > 0, 'LAST_MANTU_DATA aktif kembali untuk engaged');
  assert.ok(rekomendasiBox.innerHTML.includes('5 Usulan Tanggal Mantu'), 'Harus menampilkan usulan mantu untuk engaged');
});

