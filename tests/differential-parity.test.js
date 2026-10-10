import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { hitungPitung7Metode } from '../js/modules/jodoh/jodoh-engine.js';
import { hitungSelametanDates } from '../js/modules/selametan/selametan-engine.js';
import { hitungPetungIjab } from '../js/modules/ijab/ijab-engine.js';
import { hitungPetungOmah } from '../js/modules/omah/omah-engine.js';
import { getPetungKehidupanByWeton } from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';
import { loadDomainData } from '../js/services/dbLoader.js';

describe('Tahap F — Differential Parity Testing: Legacy vs Static JSON Data Service', () => {

  it('1. Parity Test Perjodohan: Default Static vs Injected Static JSON Domain Data', async () => {
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

    // Panggilan lama (default static import)
    const legacyResult = hitungPitung7Metode(p, l);

    // Panggilan baru (dengan injected domain data dari dbLoader/KV)
    const domainData = await loadDomainData('jodoh');
    const injectedResult = hitungPitung7Metode(p, l, domainData);

    assert.equal(legacyResult.totalNeptu, injectedResult.totalNeptu);
    assert.equal(legacyResult.rows.length, injectedResult.rows.length);
    for (let i = 0; i < legacyResult.rows.length; i++) {
      assert.equal(legacyResult.rows[i].no, injectedResult.rows[i].no);
      assert.equal(legacyResult.rows[i].h.nama, injectedResult.rows[i].h.nama);
      assert.equal(legacyResult.rows[i].h.status, injectedResult.rows[i].h.status);
    }
  });

  it('2. Parity Test Selametan: Default vs Injected Static JSON Domain Data', async () => {
    const legacy = hitungSelametanDates(2024, 3, 1, 'siang', 'Eyang Broto');
    const domainData = await loadDomainData('selametan');
    const injected = hitungSelametanDates(2024, 3, 1, 'siang', 'Eyang Broto', 'universal', domainData);

    assert.equal(legacy.geblak.hari, injected.geblak.hari);
    assert.equal(legacy.geblak.pasaran, injected.geblak.pasaran);
    assert.equal(legacy.items.length, injected.items.length);
    for (let i = 0; i < legacy.items.length; i++) {
      assert.equal(legacy.items[i].nama, injected.items[i].nama);
      assert.equal(legacy.items[i].targetH, injected.items[i].targetH);
      assert.equal(legacy.items[i].targetP, injected.items[i].targetP);
      assert.equal(legacy.items[i].diffDays, injected.items[i].diffDays);
    }
  });

  it('3. Parity Test Finite Matrix 35 Weton (Petung Ternak & Kehidupan)', async () => {
    const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

    const domainTernak = await loadDomainData('petung-kehidupan');
    assert.ok(domainTernak);

    for (const d of hariList) {
      for (const p of pasaranList) {
        const legacy = getPetungKehidupanByWeton(d, p);
        assert.ok(legacy, `Legacy lookup ${d} ${p} harus ada`);

        const fromDomain = domainTernak.weton_35?.[d]?.[p];
        assert.ok(fromDomain, `Domain lookup ${d} ${p} harus ada`);

        // Verifikasi kesamaan kode dan neptu
        assert.equal(legacy.neptu, fromDomain.neptu_jumlah);
        assert.equal(legacy.ternak.kode, fromDomain.ternak.kode || fromDomain.wiwit_ternak);
        assert.equal(legacy.loro.kode, fromDomain.loro.kode || fromDomain.jalaran_loro);
        assert.equal(legacy.geblak.kode, fromDomain.geblak.kode || fromDomain.petung_geblak);
      }
    }
  });

  it('4. Parity Test Petung Omah & Cempuri Lawangan', async () => {
    const legacy = hitungPetungOmah({
      dina: 'Sabtu',
      pasaran: 'Kliwon',
      arahLawang: 'Timur',
      nomorLawang: 2,
      arahPindah: 'Selatan',
      sasi: 'Sura',
      mangsa: 'Kasa',
      ciriLemahId: 1
    });

    const domainOmah = await loadDomainData('omah');
    assert.ok(domainOmah);
    assert.ok(domainOmah.cempuri_lawangan);
    assert.equal(domainOmah.cempuri_lawangan.timur.length, 9);
    assert.equal(legacy.setA.nama, 'Bumi');
    assert.equal(legacy.setB.nama, 'Yasa');
    assert.equal(legacy.setC.nama, 'Sempoyong');
  });

  it('5. Parity Test Wayang: Static Engine vs Static JSON Domain Data', async () => {
    const { getWayangById, filterWayangList } = await import('../js/modules/wayang/wayang-engine.js');
    const { WAYANG_LIST } = await import('../js/data/wayang.js');
    const domainWayang = await loadDomainData('wayang');
    assert.ok(domainWayang);

    const wayangList = domainWayang.wayang_list || domainWayang;
    assert.equal(wayangList.length, WAYANG_LIST.length);

    // Bandingkan lookup per ID untuk tokoh kunci
    const testIds = ['puntadewa', 'bima', 'arjuna', 'semar', 'batara_guru', 'gunungan'];
    for (const id of testIds) {
      const fromStatic = getWayangById(id);
      const fromInjected = getWayangById(id, domainWayang);
      assert.ok(fromStatic, `Tokoh ${id} harus ada di static`);
      assert.ok(fromInjected, `Tokoh ${id} harus ada di injected domain data`);
      assert.equal(fromStatic.nama, fromInjected.nama);
      assert.equal(fromStatic.kategori, fromInjected.kategori);
      assert.equal(fromStatic.watak, fromInjected.watak);
      assert.equal(fromStatic.pusaka, fromInjected.pusaka);
    }

    // Bandingkan hasil filter kategori
    const pandawaStatic = filterWayangList('Pandawa');
    const pandawaInjected = filterWayangList('Pandawa', '', domainWayang);
    assert.equal(pandawaStatic.length, pandawaInjected.length);
  });

  it('6. Parity Test Pitutur & Kuis: Static vs Static JSON Domain Data', async () => {
    const { PITUTUR_LIST, QUIZ_QUESTIONS } = await import('../js/data/pitutur.js');
    const domainPitutur = await loadDomainData('pitutur');
    assert.ok(domainPitutur);

    const pList = domainPitutur.pitutur_list || [];
    const qList = domainPitutur.quiz_questions || [];

    assert.equal(pList.length, PITUTUR_LIST.length);
    assert.equal(qList.length, QUIZ_QUESTIONS.length);

    // Verifikasi identitas entri pertama & terakhir
    assert.equal(pList[0].jawa, PITUTUR_LIST[0].jawa);
    assert.equal(pList[0].makna, PITUTUR_LIST[0].makna);
    assert.equal(pList[pList.length - 1].jawa, PITUTUR_LIST[PITUTUR_LIST.length - 1].jawa);

    assert.equal(qList[0].q, QUIZ_QUESTIONS[0].q);
    assert.equal(qList[0].correct, QUIZ_QUESTIONS[0].correct);
  });

  it('7. Parity Test Mitologi Nusantara: Static vs Static JSON Domain Data', async () => {
    const { MITOLOGI_NUSANTARA_DATA, getMitologiById, searchMitologiNusantara } = await import('../js/data/mitologi-nusantara-db.js');
    const domainMitologi = await loadDomainData('mitologi');
    assert.ok(domainMitologi);

    const mList = Array.isArray(domainMitologi) ? domainMitologi : (domainMitologi.mitologi_list || []);
    assert.equal(mList.length, MITOLOGI_NUSANTARA_DATA.length);

    for (const item of MITOLOGI_NUSANTARA_DATA) {
      const fromStatic = getMitologiById(item.id);
      const fromInjected = getMitologiById(item.id, domainMitologi);
      assert.ok(fromStatic);
      assert.ok(fromInjected);
      assert.equal(fromStatic.judul, fromInjected.judul);
      assert.equal(fromStatic.kategori, fromInjected.kategori);
      assert.equal(fromStatic.babList.length, fromInjected.babList.length);
    }

    const searchRes = searchMitologiNusantara('watugunung', domainMitologi);
    assert.ok(searchRes.length >= 1);
    assert.equal(searchRes[0].id, 'pawukon');
  });

  it('8. Parity Test Tumpeng Tombak Rojo: Static vs Static JSON Domain Data', async () => {
    const { TUMPENG_UBARAMPE, TUMPENG_WARNA } = await import('../js/data/tumpeng.js');
    const domainTumpeng = await loadDomainData('tumpeng');
    assert.ok(domainTumpeng);

    const ubarampe = domainTumpeng.ubarampe || [];
    assert.equal(ubarampe.length, TUMPENG_UBARAMPE.length);

    for (let i = 0; i < TUMPENG_UBARAMPE.length; i++) {
      assert.equal(ubarampe[i].id, TUMPENG_UBARAMPE[i].id);
      assert.equal(ubarampe[i].nama, TUMPENG_UBARAMPE[i].nama);
      assert.equal(ubarampe[i].simbol, TUMPENG_UBARAMPE[i].simbol);
    }

    if (domainTumpeng.tumpeng_warna) {
      assert.equal(Object.keys(domainTumpeng.tumpeng_warna).length, Object.keys(TUMPENG_WARNA).length);
      assert.equal(domainTumpeng.tumpeng_warna.ijo.nama, TUMPENG_WARNA.ijo.nama);
    }
  });

  it('9. Parity Test Petung Tetanen & Wuku Petenget: Default vs Injected', async () => {
    const { getPetungTetanen, PETUNG_TETANEN_LIST } = await import('../js/data/petung-tetanen-db.js');
    const { getWukuPetenget, WUKU_PETENGET_LIST } = await import('../js/data/wuku-petenget-db.js');

    const domainKalender = await loadDomainData('kalender');
    assert.ok(domainKalender.petungTetanen);
    assert.ok(domainKalender.wukuPetenget);

    // Cek sample weton tetanen
    const tetanenStatic = getPetungTetanen('Senin', 'Pon');
    const tetanenInjected = getPetungTetanen('Senin', 'Pon', domainKalender.petungTetanen);
    assert.equal(tetanenStatic.pilar, tetanenInjected.pilar);
    assert.equal(tetanenStatic.tanaman, tetanenInjected.tanaman);

    // Cek sample wuku petenget
    const wukuStatic = getWukuPetenget(1);
    const wukuInjected = getWukuPetenget(1, domainKalender.wukuPetenget);
    assert.equal(wukuStatic.alaBecik.becik, wukuInjected.alaBecik.becik);
    assert.equal(wukuStatic.alaBecik.ala, wukuInjected.alaBecik.ala);
  });
});
