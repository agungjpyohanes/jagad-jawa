import test from 'node:test';
import assert from 'node:assert/strict';
import {
  weton_35,
  WETON_35_LIST,
  KAMUS_WIWIT_TERNAK,
  KAMUS_JALARAN_LORO,
  KAMUS_GEBLAK,
  lookupWetonTernakLoroGeblak
} from '../js/data/petung-ternak-loro-geblak.js';
import {
  getPetungKehidupanByDate,
  getPetungKehidupanByWeton
} from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';

test('Petung Ternak Loro Geblak - Integritas Database 35 Weton', () => {
  assert.equal(WETON_35_LIST.length, 35, 'Wajib memuat tepat 35 weton');

  const dinaList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  dinaList.forEach(d => {
    assert.ok(weton_35[d], `Dina ${d} wajib ada di weton_35`);
    pasaranList.forEach(p => {
      const row = weton_35[d][p];
      assert.ok(row, `Kombinasi ${d} ${p} wajib ada di weton_35[${d}][${p}]`);
      assert.ok(row.ternak && row.ternak.kode, `Data ternak wajib ada untuk ${d} ${p}`);
      assert.ok(row.loro && row.loro.kode, `Data loro wajib ada untuk ${d} ${p}`);
      assert.ok(row.geblak && row.geblak.kode, `Data geblak wajib ada untuk ${d} ${p}`);
    });
  });
});

test('Petung Ternak Loro Geblak - Menggunakan Neptu App Standar (Bukan Neptu Ijab)', () => {
  // Minggu (5) + Pon (7) = 12 (Bukan sistem ijab di mana Minggu 5 + Pon 4 = 9)
  const rowMPon = lookupWetonTernakLoroGeblak('Minggu', 'Pon');
  assert.equal(rowMPon.neptu_dina, 5);
  assert.equal(rowMPon.neptu_pasaran, 7);
  assert.equal(rowMPon.neptu_jumlah, 12);

  // Sabtu (9) + Kliwon (8) = 17
  const rowSKliwon = lookupWetonTernakLoroGeblak('Sabtu', 'Kliwon');
  assert.equal(rowSKliwon.neptu_dina, 9);
  assert.equal(rowSKliwon.neptu_pasaran, 8);
  assert.equal(rowSKliwon.neptu_jumlah, 17);
});

test('Petung Ternak - 4 Kategori (Gajah, Suku, Watu, Buto)', () => {
  assert.equal(KAMUS_WIWIT_TERNAK.length, 4);

  // Selasa Kliwon -> Gajah (Becik)
  const selKliwon = lookupWetonTernakLoroGeblak('Selasa', 'Kliwon');
  assert.equal(selKliwon.ternak.kode, 'Gajah');
  assert.equal(selKliwon.ternak.status_ringkas, 'Becik');
  assert.equal(selKliwon.ternak.badge.color, 'emerald');

  // Minggu Pon -> Buto (Ala)
  const minPon = lookupWetonTernakLoroGeblak('Minggu', 'Pon');
  assert.equal(minPon.ternak.kode, 'Buto');
  assert.equal(minPon.ternak.status_ringkas, 'Ala');
  assert.equal(minPon.ternak.badge.color, 'amber');
});

test('Petung Loro - 4 Kategori & Disclaimer Medis Baku', () => {
  assert.equal(KAMUS_JALARAN_LORO.length, 4);

  const row = lookupWetonTernakLoroGeblak('Minggu', 'Pon');
  assert.equal(row.loro.kode, 'Lepas');
  assert.ok(row.loro.tegese);
  assert.ok(row.loro.tombone);
  assert.ok(row.loro.disclaimer_medis.includes('sanès diagnosis medis'));
  assert.ok(row.loro.disclaimer_medis.includes('fasilitas kesehatan'));
});

test('Petung Geblak - 4 Kategori & Wiradat 40 Dina Beradab', () => {
  assert.equal(KAMUS_GEBLAK.length, 4);

  const row = lookupWetonTernakLoroGeblak('Selasa', 'Kliwon');
  assert.equal(row.geblak.kode, 'Segara');
  assert.ok(row.geblak.wiradat_40_dina.includes('40 dinten'));
  assert.ok(row.geblak.disclaimer_adat.includes('ngurmati suwargi'));
});

test('Petung Kehidupan Engine - getPetungKehidupanByDate & ByWeton', () => {
  // Tanggal patokan: 2026-09-24 -> Kamis Wage (Neptu 12)
  const dataDate = getPetungKehidupanByDate('2026-09-24');
  assert.ok(dataDate);
  assert.equal(dataDate.dina, 'Kamis');
  assert.equal(dataDate.pasaran, 'Wage');
  assert.equal(dataDate.neptu, 12);
  assert.ok(dataDate.ternak.kode);
  assert.ok(dataDate.loro.kode);
  assert.ok(dataDate.geblak.kode);

  const dataWeton = getPetungKehidupanByWeton('Kamis', 'Wage');
  assert.ok(dataWeton);
  assert.equal(dataWeton.dina, 'Kamis');
  assert.equal(dataWeton.pasaran, 'Wage');
  assert.equal(dataWeton.neptu, 12);
});
