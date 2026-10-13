/**
 * Jagad Jawa — Canonical Manifest, JSON Schema Validation & Domain Differential Parity Test Suite
 * 
 * Memverifikasi:
 * 1. Seluruh 42 canonical dataset di CANONICAL_KEYS memetakan tepat ke file fisik di public/data/
 * 2. Seluruh file JSON valid, non-empty, dan memenuhi validasi skema runtime
 * 3. Pemetaan alias legacy ke canonical key & filename berfungsi 100%
 * 4. Runtime URL resolver getDbUrl() menghasilkan rujukan /data/*.json dengan benar tanpa /api/data/
 * 5. Eksekusi loadDomainData() untuk setiap domain menghasilkan struktur yang kompatibel tanpa mengubah UI
 * 6. Differential parity terhadap golden baseline untuk setiap formula domain
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CANONICAL_KEYS,
  ALIAS_TO_KEY,
  resolveCanonicalKey,
  getCanonicalFilename
} from '../js/services/datasetManifest.js';

import {
  loadDb,
  loadDomainData,
  getDbUrl,
  resolveDbFilename,
  validateDatasetSchema,
  clearDbCache
} from '../js/services/dbLoader.js';

import {
  hitungSelametanDates
} from '../js/modules/selametan/selametan-engine.js';

import {
  hitungPitung7Metode
} from '../js/modules/jodoh/jodoh-engine.js';

import {
  hitungPetungIjab
} from '../js/modules/ijab/ijab-engine.js';

import {
  hitungPetungOmah
} from '../js/modules/omah/omah-engine.js';

import {
  getPetungKehidupanByDate
} from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';

describe('1. Canonical Manifest & Public JSON Integrity (42 Datasets)', () => {
  const dataDir = path.resolve(process.cwd(), 'public/data');

  it('Harus ada tepat 42 canonical keys terdaftar di manifest', () => {
    const keys = Object.keys(CANONICAL_KEYS);
    assert.equal(keys.length, 42, `Jumlah canonical keys harus tepat 42, ditemukan: ${keys.length}`);
  });

  it('Setiap canonical key memetakan ke file aktual yang ada di public/data/ dan valid JSON', () => {
    for (const [key, meta] of Object.entries(CANONICAL_KEYS)) {
      assert.ok(meta.filename, `Key ${key} harus memiliki nama file`);
      assert.ok(meta.filename.endsWith('.json'), `File untuk ${key} harus berekstensi .json: ${meta.filename}`);

      const fullPath = path.join(dataDir, meta.filename);
      assert.ok(fs.existsSync(fullPath), `File fisik harus ada di public/data: ${meta.filename}`);

      const raw = fs.readFileSync(fullPath, 'utf8');
      assert.ok(raw.length > 20, `File ${meta.filename} tidak boleh kosong`);

      let parsed;
      assert.doesNotThrow(() => {
        parsed = JSON.parse(raw);
      }, `File ${meta.filename} harus merupakan JSON valid`);

      assert.ok(parsed !== null && typeof parsed === 'object', `File ${meta.filename} harus berupa objek atau array JSON`);
      assert.ok(validateDatasetSchema(key, parsed), `File ${meta.filename} harus lolos schema validation untuk key ${key}`);
    }
  });

  it('Helper getCanonicalFilename() menyelesaikan key, alias, dan index numerik dengan tepat', () => {
    assert.equal(getCanonicalFilename('kalender:constants'), '01-kalender-constants.json');
    assert.equal(getCanonicalFilename('01'), '01-kalender-constants.json');
    assert.equal(getCanonicalFilename(1), '01-kalender-constants.json');
    assert.equal(getCanonicalFilename('kalenderConstants'), '01-kalender-constants.json');

    assert.equal(getCanonicalFilename('wuku:ensiklopedia'), '02-wuku-ensiklopedia.json');
    assert.equal(getCanonicalFilename('wukuEnsiklopedia'), '02-wuku-ensiklopedia.json');

    assert.equal(getCanonicalFilename('perjodohan:pitung'), '11-pitung-perjodohan-bilingual.json');
    assert.equal(getCanonicalFilename('selametan:rules'), '14-selametan-rules.json');
    assert.equal(getCanonicalFilename('ijab:all'), '15-ijab-bilingual.json');
    assert.equal(getCanonicalFilename('omah:all'), '23-omah-bilingual.json');
    assert.equal(getCanonicalFilename('petung:ternak'), '22-petung-ternak-bilingual.json');
    assert.equal(getCanonicalFilename('petung:tetanen'), '21-petung-tetanen-bilingual.json');
    assert.equal(getCanonicalFilename('wuku:petenget'), '24-wuku-petenget-bilingual.json');

    // Supplemental datasets (38-42)
    assert.equal(getCanonicalFilename('wayang:all'), '38-wayang-all.json');
    assert.equal(getCanonicalFilename('pitutur:all'), '39-pitutur-all.json');
    assert.equal(getCanonicalFilename('mitologi:all'), '40-mitologi-all.json');
    assert.equal(getCanonicalFilename('pustaka:digital'), '41-pustaka-digital.json');
    assert.equal(getCanonicalFilename('tumpeng:all'), '42-tumpeng-all.json');
  });

  it('Seluruh alias legacy di ALIAS_TO_KEY menyelesaikan ke canonical key & file fisik aktual (tanpa parity sirkular)', () => {
    for (const [alias, canonicalKey] of Object.entries(ALIAS_TO_KEY)) {
      // 1. Pastikan canonical key target benar-benar ada di CANONICAL_KEYS
      assert.ok(
        CANONICAL_KEYS[canonicalKey],
        `Alias "${alias}" menunjuk ke canonicalKey "${canonicalKey}" yang tidak terdaftar di CANONICAL_KEYS`
      );

      // 2. Pastikan resolveCanonicalKey(alias) mengembalikan canonical key yang sama
      const resolved = resolveCanonicalKey(alias);
      assert.equal(
        resolved,
        canonicalKey,
        `resolveCanonicalKey("${alias}") harus menghasilkan "${canonicalKey}", dapat "${resolved}"`
      );

      // 3. Pastikan filename yang dituju benar-benar ada secara fisik di public/data/
      const expectedFilename = CANONICAL_KEYS[canonicalKey].filename;
      const resolvedFilename = getCanonicalFilename(alias);
      assert.equal(
        resolvedFilename,
        expectedFilename,
        `getCanonicalFilename("${alias}") harus menghasilkan "${expectedFilename}"`
      );

      const filePath = path.join(dataDir, expectedFilename);
      assert.ok(
        fs.existsSync(filePath),
        `File fisik tujuan alias "${alias}" (${expectedFilename}) harus eksis di disk`
      );
    }
  });

  it('Membedakan 42 canonical wajib dari file ekstra yang disengaja (kamus-jawa.json, kamus-sansakerta.json)', () => {
    const allJsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();
    const canonicalFilenames = Object.values(CANONICAL_KEYS).map(m => m.filename).sort();

    // Pastikan seluruh 42 canonical wajib ada di folder publik
    for (const cFile of canonicalFilenames) {
      assert.ok(allJsonFiles.includes(cFile), `Canonical wajib ${cFile} harus ada di public/data/`);
    }

    // Identifikasi file ekstra di luar 42 canonical
    const extraFiles = allJsonFiles.filter(f => !canonicalFilenames.includes(f));
    const DELIBERATE_EXTRA_FILES = ['kamus-jawa.json', 'kamus-sansakerta.json'];

    // Validasi bahwa file ekstra yang ada hanyalah file deliberate alias/download historis
    assert.deepEqual(
      extraFiles.sort(),
      DELIBERATE_EXTRA_FILES.sort(),
      `File ekstra di public/data/ harus tepat deliberate extra files: ${DELIBERATE_EXTRA_FILES.join(', ')}`
    );

    // Pastikan file ekstra deliberate tersebut adalah salinan valid dari canonical 33 dan 34
    const kamusJawaRaw = fs.readFileSync(path.join(dataDir, 'kamus-jawa.json'), 'utf8');
    const canon33Raw = fs.readFileSync(path.join(dataDir, '33-kamus-jawa.json'), 'utf8');
    assert.equal(kamusJawaRaw, canon33Raw, 'kamus-jawa.json harus identik dengan 33-kamus-jawa.json');

    const kamusSanskertaRaw = fs.readFileSync(path.join(dataDir, 'kamus-sansakerta.json'), 'utf8');
    const canon34Raw = fs.readFileSync(path.join(dataDir, '34-kamus-sansakerta.json'), 'utf8');
    assert.equal(kamusSanskertaRaw, canon34Raw, 'kamus-sansakerta.json harus identik dengan 34-kamus-sansakerta.json');

    // Pastikan file ekstra yang tidak dikenal tetap ditolak jika disimulasikan
    const simulatedFiles = [...allJsonFiles, 'unexpected-file.json'];
    const unknownFiles = simulatedFiles.filter(f => !canonicalFilenames.includes(f) && !DELIBERATE_EXTRA_FILES.includes(f));
    assert.deepEqual(unknownFiles, ['unexpected-file.json'], 'File ekstra tak dikenal harus terdeteksi dan ditolak');
  });

  it('Mendukung dan memvalidasi tipe root Object maupun Array secara eksplisit, termasuk record bilingual', () => {
    let arrayRootCount = 0;
    let objectRootCount = 0;
    let bilingualRecordCount = 0;

    for (const [key, meta] of Object.entries(CANONICAL_KEYS)) {
      const fullPath = path.join(dataDir, meta.filename);
      const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      if (Array.isArray(parsed)) {
        arrayRootCount++;
        assert.ok(parsed.length > 0, `Array dataset ${meta.filename} tidak boleh kosong`);
        // Periksa apakah item memiliki field bilingual id/jv
        const hasBilingualItem = parsed.some(item => 
          item && typeof item === 'object' && (
            (item.arti && typeof item.arti === 'object' && ('id' in item.arti || 'jv' in item.arti)) ||
            (item.nama && typeof item.nama === 'object' && ('id' in item.nama || 'jv' in item.nama)) ||
            (item.jenis && typeof item.jenis === 'object' && ('id' in item.jenis || 'jv' in item.jenis)) ||
            ('id' in item && 'jv' in item)
          )
        );
        if (hasBilingualItem) bilingualRecordCount++;
      } else if (parsed && typeof parsed === 'object') {
        objectRootCount++;
        assert.ok(Object.keys(parsed).length > 0, `Object dataset ${meta.filename} tidak boleh kosong`);
        // Periksa apakah value memuat bilingual
        const hasBilingualField = Object.values(parsed).some(val =>
          val && typeof val === 'object' && (
            ('id' in val && 'jv' in val) ||
            (val.id && val.jv)
          )
        );
        if (hasBilingualField) bilingualRecordCount++;
      } else {
        assert.fail(`Dataset ${meta.filename} memiliki tipe root tak terduga: ${typeof parsed}`);
      }
    }

    assert.ok(arrayRootCount > 0, `Harus ada dataset dengan root bertipe Array, aktual: ${arrayRootCount}`);
    assert.ok(objectRootCount > 0, `Harus ada dataset dengan root bertipe Object, aktual: ${objectRootCount}`);
    assert.equal(arrayRootCount + objectRootCount, 42, 'Total root Object + Array harus sama dengan 42 canonical keys');
    assert.ok(bilingualRecordCount > 0, `Harus ada dataset yang memuat struktur bilingual id/jv, aktual: ${bilingualRecordCount}`);
  });

  it('Tidak ada file JSON di public/data/ yang memuat rahasia atau PII', () => {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    const secretPatterns = [
      /\bpassword\b/i,
      /\bsecret\b/i,
      /\btoken\b/i,
      /\bapi[_-]?key\b/i,
      /\bbearer\b/i,
      /\bprivkey\b/i,
      /\bcredentials\b/i,
      /\bnik\b/i,
      /\bktp\b/i
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      for (const pat of secretPatterns) {
        assert.equal(
          pat.test(content),
          false,
          `File ${file} tidak boleh memuat kata sensitif ${pat}`
        );
      }
    }
  });

  it('validateDatasetSchema menolak key tak dikenal, JSON rusak/null, dan root/field penting yang salah', () => {
    // 1. Key tak dikenal harus selalu ditolak (mengembalikan false)
    assert.equal(validateDatasetSchema('unknown:canonical-key', { foo: 'bar' }), false);
    assert.equal(validateDatasetSchema('random:key', [1, 2, 3]), false);
    assert.equal(validateDatasetSchema('', {}), false);
    assert.equal(validateDatasetSchema(null, {}), false);

    // 2. Input null/undefined/non-object harus ditolak
    assert.equal(validateDatasetSchema('kalender:constants', null), false);
    assert.equal(validateDatasetSchema('kalender:constants', undefined), false);
    assert.equal(validateDatasetSchema('kalender:constants', 'string'), false);
    assert.equal(validateDatasetSchema('kalender:constants', 123), false);

    // 3. Root salah (Array yang seharusnya Object, atau Object yang seharusnya Array)
    assert.equal(validateDatasetSchema('kalender:constants', [{ HARI: [] }]), false);
    assert.equal(validateDatasetSchema('wuku:ensiklopedia', { not_an_array: true }), false);
    assert.equal(validateDatasetSchema('pranata:mangsa', { id: 1, nama: 'test' }), false);
    assert.equal(validateDatasetSchema('dino:rules', [{ dino_gede: [] }]), false);
    assert.equal(validateDatasetSchema('bincil:matrix', [1, 2, 3]), false);

    // 4. Field penting hilang / salah
    assert.equal(validateDatasetSchema('kalender:constants', { nama_hari: ['Minggu'] }), false); // neptu_hari hilang
    assert.equal(validateDatasetSchema('dino:rules', { dino_gede: [] }), false); // dino_ijo hilang
    assert.equal(validateDatasetSchema('bincil:arti', { padewan: {} }), false); // paringkelan, pancasuda hilang
    assert.equal(validateDatasetSchema('shio:wuxing', { shio_12: [] }), false); // wu_xing_5 hilang
    assert.equal(validateDatasetSchema('pranata:mangsa', [{ durasi_hari: 41 }]), false); // id & nama hilang
    assert.equal(validateDatasetSchema('wuku:ensiklopedia', [{ dewa: 'Sang Hyang' }]), false); // no_wuku & nama hilang
    assert.equal(validateDatasetSchema('perjodohan:pitung', { random: true }), false); // metode_I_panca_suda hilang
    assert.equal(validateDatasetSchema('aksara:nglegena', [{ aksara: 'ꦲ' }]), false); // latin hilang
    assert.equal(validateDatasetSchema('kamus:jawa', [{ jenis: 'kata' }]), false); // kata & jawa hilang
  });
});

describe('2. Runtime URL Resolver & Endpoint Policy', () => {
  it('getDbUrl() harus menghasilkan path /data/*.json dan TIDAK menggunakan /api/data/', () => {
    const url01 = getDbUrl('01-kalender-constants.json');
    assert.ok(url01.includes('data/01-kalender-constants.json'), `URL harus memuat data/01-kalender-constants.json, aktual: ${url01}`);
    assert.ok(!url01.includes('/api/data/'), `URL tidak boleh memuat /api/data/: ${url01}`);

    const url38 = getDbUrl('38-wayang-all.json');
    assert.ok(url38.includes('data/38-wayang-all.json'), `URL harus memuat data/38-wayang-all.json, aktual: ${url38}`);
    assert.ok(!url38.includes('/api/data/'), `URL tidak boleh memuat /api/data/: ${url38}`);
  });

  it('resolveDbFilename() menyelesaikan nomor, alias, dan canonical key ke filename dengan tepat', () => {
    assert.equal(resolveDbFilename(1), '01-kalender-constants.json');
    assert.equal(resolveDbFilename('01'), '01-kalender-constants.json');
    assert.equal(resolveDbFilename('kalenderConstants'), '01-kalender-constants.json');
    assert.equal(resolveDbFilename('dinoRules'), '04-dino-rules.json');
    assert.equal(resolveDbFilename('bincilMatrix'), '06-bincil-matrix-bilingual.json');
    assert.equal(resolveDbFilename('wayang'), '38-wayang-all.json');
    assert.equal(resolveDbFilename('tumpeng'), '42-tumpeng-all.json');
  });
});

describe('3. Pemuatan Asinkron Setiap Domain (loadDomainData Contract Stability)', () => {
  it('Domain kalender termuat utuh dengan struktur constants, dinoRules, pranataMangsa, tetanen, petenget', async () => {
    const res = await loadDomainData('kalender');
    assert.ok(res, 'Hasil kalender tidak boleh null');
    assert.ok(res.constants && Array.isArray(res.constants.HARI), 'constants.HARI harus berupa array');
    assert.equal(res.constants.HARI.length, 7);
    assert.ok(res.dinoRules && Array.isArray(res.dinoRules.dino_gede), 'dinoRules.dino_gede harus array');
    assert.ok(Array.isArray(res.pranataMangsa), 'pranataMangsa harus array');
  });

  it('Domain wuku termuat utuh dengan pawukonList (30 wuku) dan petengetList', async () => {
    const res = await loadDomainData('wuku');
    assert.ok(res, 'Hasil wuku tidak boleh null');
    assert.ok(Array.isArray(res.pawukonList), 'pawukonList harus berupa array');
    assert.equal(res.pawukonList.length, 30, 'pawukonList harus berisi tepat 30 wuku');
    assert.equal(res.pawukonList[0].nama_wuku, 'Sinta');
    assert.equal(res.pawukonList[29].nama_wuku, 'Watugunung');
  });

  it('Domain jodoh / perjodohan termuat dengan 6 metode pitung dan bobot aksara', async () => {
    const res = await loadDomainData('jodoh');
    assert.ok(res, 'Hasil jodoh tidak boleh null');
    assert.ok(Array.isArray(res.AKSARA_PERJODOHAN), 'AKSARA_PERJODOHAN harus array');
    assert.equal(res.AKSARA_PERJODOHAN.length, 20);
    assert.ok(res.HASIL_I_JODOH, 'HASIL_I_JODOH harus terdefinisi');
    assert.ok(res.HASIL_VI_JODOH, 'HASIL_VI_JODOH harus terdefinisi');
  });

  it('Domain nujum termuat dengan bincilMatrix 210 weton dan zodiak / shio / sasi', async () => {
    const res = await loadDomainData('nujum');
    assert.ok(res, 'Hasil nujum tidak boleh null');
    assert.ok(res.bincilMatrix, 'bincilMatrix harus ada');
    assert.ok(Array.isArray(res.zodiak), 'zodiak harus array');
    assert.equal(res.zodiak.length, 12);
  });

  it('Domain selametan termuat dengan target_hari_matrix dan JENIS_SELAMETAN (7 tahapan)', async () => {
    const res = await loadDomainData('selametan');
    assert.ok(res, 'Hasil selametan tidak boleh null');
    assert.ok(Array.isArray(res.target_hari_matrix), 'target_hari_matrix harus array');
    assert.ok(Array.isArray(res.JENIS_SELAMETAN), 'JENIS_SELAMETAN harus array');
    assert.equal(res.JENIS_SELAMETAN.length, 7);
  });

  it('Domain ijab termuat dengan neptu khusus dina, pasaran, wuku, dan sasi', async () => {
    const res = await loadDomainData('ijab');
    assert.ok(res, 'Hasil ijab tidak boleh null');
    assert.ok(Array.isArray(res.NEPTU_IJAB_DINA), 'NEPTU_IJAB_DINA harus array');
    assert.ok(Array.isArray(res.NEPTU_IJAB_PASARAN), 'NEPTU_IJAB_PASARAN harus array');
    assert.ok(Array.isArray(res.WUKU_IJAB), 'WUKU_IJAB harus array');
    assert.ok(Array.isArray(res.SASI_IJAB), 'SASI_IJAB harus array');
  });

  it('Domain omah termuat dengan cempuri_lawangan 4 arah dan omah_sisa', async () => {
    const res = await loadDomainData('omah');
    assert.ok(res, 'Hasil omah tidak boleh null');
    assert.ok(res.cempuri_lawangan, 'cempuri_lawangan harus ada');
    assert.ok(Array.isArray(res.cempuri_lawangan.utara), 'cempuri utara harus array');
    assert.ok(Array.isArray(res.cempuri_lawangan.selatan), 'cempuri selatan harus array');
  });

  it('Domain petung-kehidupan termuat dengan weton_35 map dan wetonList (35 entri)', async () => {
    const res = await loadDomainData('petung-kehidupan');
    assert.ok(res, 'Hasil petung-kehidupan tidak boleh null');
    assert.ok(res.weton_35, 'weton_35 map harus ada');
    assert.ok(Array.isArray(res.wetonList), 'wetonList harus array');
    assert.equal(res.wetonList.length, 35, 'Harus ada 35 kombinasi weton');
  });

  it('Domain supplemental (wayang, pitutur, mitologi, pustaka, tumpeng) termuat utuh', async () => {
    const [wayang, pitutur, mitologi, pustaka, tumpeng] = await Promise.all([
      loadDomainData('wayang'),
      loadDomainData('pitutur'),
      loadDomainData('mitologi'),
      loadDomainData('pustaka'),
      loadDomainData('tumpeng')
    ]);

    assert.ok(wayang && (Array.isArray(wayang.wayang_list) || Array.isArray(wayang)), 'wayang harus valid');
    assert.ok(pitutur && Array.isArray(pitutur.pitutur_list), 'pitutur_list harus valid');
    assert.ok(mitologi && Array.isArray(mitologi), 'mitologi harus array');
    assert.ok(pustaka && pustaka.pustakaDigital, 'pustaka.pustakaDigital harus ada');
    assert.ok(tumpeng && Array.isArray(tumpeng.ubarampe), 'tumpeng.ubarampe harus array');
  });
});

describe('4. Differential Parity Baseline Formula (Zero Calculation Deviation)', () => {
  it('Selametan Parity: Tanggal wafat 2026-10-07 siang vs malam menghasilkan 7 milestone golden dates', () => {
    const siang = hitungSelametanDates(2026, 10, 7, 'siang');
    assert.equal(siang.geblak.tanggal, 7);
    assert.equal(siang.items.length, 7);
    assert.equal(siang.items[0].nama, '3 Harian');

    const malam = hitungSelametanDates(2026, 10, 7, 'malam_maghrib');
    assert.equal(malam.geblak.tanggal, 8);
    assert.equal(malam.items.length, 7);
  });

  it('Perjodohan Parity: Pasangan Neptu 14 dan 15 (Jumlah 29) menghasilkan 7 metode golden result', () => {
    const hasil = hitungPitung7Metode(
      { nama: 'Dewi', hari: 'Minggu', pasaran: 'Pahing', neptu: 14, aksaraDepan: 'DA', aksaraBelakang: 'WA' },
      { nama: 'Raden', hari: 'Jumat', pasaran: 'Pahing', neptu: 15, aksaraDepan: 'RA', aksaraBelakang: 'NA' }
    );
    assert.ok(hasil);
    assert.equal(hasil.totalNeptu, 29);
    assert.equal(hasil.rows.length, 7);
    assert.ok(hasil.rows[0].h.nama);
  });

  it('Ijab Parity: Evaluasi tanggal 2026-10-07 menghasilkan sistem neptu khusus terpisah dari neptu standar', () => {
    const ijabRes = hitungPetungIjab({
      dina: 'Minggu',
      pasaran: 'Pon',
      wuku: 'Sinta',
      sasi: 'Besar',
      tahun: 'Alip',
      tanggalJawa: 2
    });
    assert.ok(ijabRes);
    assert.equal(ijabRes.neptuCalc.neptuJumlah, 9);
    assert.ok(ijabRes.catatanSistemNeptu.includes('Neptu Khusus Ijab'));
  });

  it('Omah Parity: Evaluasi weton kelahiran Sabtu Kliwon menghasilkan Set A, B, C dan arah boyongan', () => {
    const omahRes = hitungPetungOmah({
      dina: 'Sabtu',
      pasaran: 'Kliwon',
      arahLawang: 'Timur',
      nomorLawang: 2,
      arahPindah: 'Selatan'
    });
    assert.ok(omahRes);
    assert.equal(omahRes.setA.nama, 'Bumi');
    assert.equal(omahRes.setB.nama, 'Yasa');
    assert.equal(omahRes.setC.nama, 'Sempoyong');
  });

  it('Petung Kehidupan Parity: Evaluasi tanggal 2026-10-07 menghasilkan klasifikasi ternak, loro, geblak konsisten', () => {
    const ternakRes = getPetungKehidupanByDate(2026, 10, 7);
    assert.ok(ternakRes);
    assert.equal(ternakRes.dina, 'Rabu');
    assert.equal(ternakRes.pasaran, 'Pahing');
    assert.equal(ternakRes.neptu, 16);
    assert.ok(ternakRes.ternak);
    assert.ok(ternakRes.loro);
    assert.ok(ternakRes.geblak);
  });
});
