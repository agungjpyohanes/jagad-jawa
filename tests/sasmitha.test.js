import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SASMITHA_IMPEN,
  SASMITHA_KEDUT,
  SASMITHA_GERAHANA,
  SASMITHA_LINDU,
  SASMITHA_TEJO,
  SASMITHA_MERAPI,
  REF_SASI_JAWA
} from '../js/data/sasmitha-db.js';
import {
  searchImpen,
  getKedutList,
  getGerhanaBySasi,
  getLinduBySasi,
  getTejoList,
  getTejoByArah,
  getMerapiList,
  loadSasmithaDatasetLazy,
  sasmithaSessionCache
} from '../js/modules/sasmitha/sasmitha-engine.js';

test('Sasmitha - Integritas Database 7 Bagian Tradisi (Termasuk Merapi)', () => {
  assert.equal(SASMITHA_IMPEN.length, 99, 'Wajib memuat tepat 99 tafsir impen');
  assert.equal(SASMITHA_KEDUT.length, 74, 'Wajib memuat tepat 74 tanda kedutan');
  assert.equal(SASMITHA_GERAHANA.length, 12, 'Wajib memuat 12 sasi gerhana');
  assert.equal(SASMITHA_LINDU.length, 12, 'Wajib memuat 12 sasi lindu');
  assert.equal(SASMITHA_TEJO.length, 7, 'Wajib memuat 7 arah tejo');
  assert.equal(SASMITHA_MERAPI.length, 4, 'Wajib memuat 4 arah kiblat erupsi Merapi');
  assert.equal(REF_SASI_JAWA.length, 12, 'Wajib memuat 12 sasi rujukan kanon');
});

test('Sasmitha Impen - Pencarian Kata Kunci & Format Kartu', () => {
  const allImpen = searchImpen('');
  assert.equal(allImpen.length, 99);

  // Cari 'bledeg'
  const bledeg = searchImpen('bledeg');
  assert.ok(bledeg.length >= 1);
  assert.ok(bledeg[0].yen_ngimpi.includes('bledeg'));
  assert.ok(bledeg[0].pratanda);

  // Cari 'perang'
  const perang = searchImpen('perang');
  assert.ok(perang.length >= 1);
});

test('Sasmitha Kedut - Filter Kategori & Mode Pemula vs Ahli', () => {
  // Mode Pemula (includeSensitive: false): 74 - 9 = 65
  const pemulaList = getKedutList({ includeSensitive: false });
  assert.equal(pemulaList.length, 65);
  assert.ok(!pemulaList.some(k => k.is_sensitive));

  // Mode Ahli (includeSensitive: true): 74 lengkap
  const ahliList = getKedutList({ includeSensitive: true });
  assert.equal(ahliList.length, 74);
  assert.ok(ahliList.some(k => k.is_sensitive));

  // Filter Kategori: 'Sirah & Pasuryan'
  const sirahList = getKedutList({ kategori: 'Sirah & Pasuryan', includeSensitive: true });
  assert.ok(sirahList.length > 0);
  assert.ok(sirahList.every(k => k.kategori === 'Sirah & Pasuryan'));

  // Pencarian spesifik
  const alis = getKedutList({ query: 'alis', includeSensitive: true });
  assert.ok(alis.length >= 2); // Alis tengen, Alis kiwa
});

test('Sasmitha Gerhana - Rujukan Sasi Jawa Tradisional & Robust Sasi Matching', () => {
  const sura = getGerhanaBySasi('Sura');
  assert.ok(sura);
  assert.ok(sura.ngalamat.includes('Akeh wong pitenah'));

  const besar = getGerhanaBySasi('Besar');
  assert.ok(besar);
  assert.ok(besar.ngalamat.includes('munggah kaji'));

  // Test compound sasi name and alias
  const pasa = getGerhanaBySasi('Pasa');
  assert.ok(pasa);
  assert.equal(pasa.id, 9);

  const pasaCompound = getGerhanaBySasi('Pasa (Siyam)');
  assert.ok(pasaCompound);
  assert.equal(pasaCompound.id, 9);

  const sela = getGerhanaBySasi('Sela (Dulkangidah)');
  assert.ok(sela);
  assert.equal(sela.id, 11);

  const dulkaidah = getGerhanaBySasi('Dulkaidah');
  assert.ok(dulkaidah);
  assert.equal(dulkaidah.id, 11);
});

test('Sasmitha Lindu - Pemisahan Awan vs Wengi & Disclaimer BMKG', () => {
  const linduSuraAwan = getLinduBySasi('Sura', 'awan');
  assert.equal(linduSuraAwan.waktuPilihan, 'Awan');
  assert.equal(linduSuraAwan.ngalamatPilihan, 'Akeh wong pada susah lan prihatin');
  assert.ok(linduSuraAwan.disclaimer_bmkg.includes('BMKG lan BPBD'));

  const linduSuraWengi = getLinduBySasi('Sura', 'wengi');
  assert.equal(linduSuraWengi.waktuPilihan, 'Wengi');
  assert.ok(linduSuraWengi.ngalamatPilihan.includes('Akeh wong mati'));

  // Compound name matching
  const linduPasa = getLinduBySasi('Pasa', 'awan');
  assert.ok(linduPasa);
  assert.equal(linduPasa.id, 9);

  const linduDulkaidah = getLinduBySasi('Dulkaidah', 'awan');
  assert.ok(linduDulkaidah);
  assert.equal(linduDulkaidah.id, 11);
});

test('Sasmitha Tejo - 7 Arah Cahaya Langit', () => {
  const tejoAll = getTejoList();
  assert.equal(tejoAll.length, 7);

  const wetan = getTejoByArah('Wetan');
  assert.ok(wetan);
  assert.equal(wetan.arah_id, 'Timur');
  assert.ok(wetan.ngalamat.includes('sesukan'));
});

test('Sasmitha Merapi - 4 Kiblat Mata Angin & Sumbu Filosofis', () => {
  const merapiList = getMerapiList();
  assert.equal(merapiList.length, 4, 'Wajib memuat 4 arah kiblat Merapi');

  const lor = merapiList.find(m => m.arah_id === 'Utara' || m.arah.includes('Lor'));
  assert.ok(lor);
  assert.equal(lor.simbol, 'Larang Pangan');

  const wetan = merapiList.find(m => m.arah_id === 'Timur' || m.arah.includes('Wetan'));
  assert.ok(wetan);
  assert.equal(wetan.simbol, 'Kemakmuran');

  const kulon = merapiList.find(m => m.arah_id === 'Barat' || m.arah.includes('Kulon'));
  assert.ok(kulon);
  assert.equal(kulon.simbol, 'Kisruh Pemimpin');

  const kidul = merapiList.find(m => m.arah_id === 'Selatan' || m.arah.includes('Kidul'));
  assert.ok(kidul);
  assert.equal(kidul.simbol, 'Huru-Hara');
});

test('Sasmitha Lazy Loading & Cache Memori Sesi (Map)', async () => {
  sasmithaSessionCache.clear();
  assert.equal(sasmithaSessionCache.has('sasmitha:all'), false);

  const loaded = await loadSasmithaDatasetLazy();
  assert.ok(loaded);
  assert.equal(sasmithaSessionCache.has('sasmitha:all'), true);
  assert.equal(sasmithaSessionCache.get('sasmitha:all').merapi.length, 4);
  assert.equal(sasmithaSessionCache.get('sasmitha:all').tejo.length, 7);

  // Cached read instant
  const secondRead = await loadSasmithaDatasetLazy();
  assert.strictEqual(loaded, secondRead, 'Harus mengembalikan instance Map cache yang sama');
});
