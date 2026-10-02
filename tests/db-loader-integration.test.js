import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  loadDomainData,
  getDomainDataSync,
  getDomainFallback,
  mapWukuItem,
  mapKalenderConstants,
  mapDinoRules,
  mapPitungPerjodohan,
  mapSelametanRules,
  mapPetungIjab,
  mapPetungOmah,
  mapPetungKehidupan,
  loadDb,
  getDbSync
} from '../js/services/dbLoader.js';

import {
  toJDN,
  getDayInfo,
  getNeptu,
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  WUKU,
  EPOCH_JDN
} from '../js/modules/kalender/kalender-engine.js';

describe('jawa-v11: Integrasi Database JSON & dbLoader (Key Mapping & Migrasi Asinkron)', () => {
  it('1. Sinkronisasi Kunci (Key Mapping) wuku: id vs no_wuku, nama vs nama_wuku, dewa vs dewane', () => {
    const rawBilingualWuku = {
      no_wuku: 1,
      nama: { id: 'Sinta', jv: 'Sinta' },
      dewa: { id: 'Sang Hyang Yamadipati', jv: 'Sang Hyang Yamadipati' },
      watek: { id: 'Watak Sinta ID', jv: 'Watek Sinta JV' },
      bilahi: { id: 'Bilahi ID', jv: 'Bilahi JV' }
    };

    const mapped = mapWukuItem(rawBilingualWuku);

    // Kunci lama / legacy dipenuhi
    assert.equal(mapped.no_wuku, 1);
    assert.equal(mapped.nama_wuku, 'Sinta');
    assert.equal(mapped.dewane, 'Sang Hyang Yamadipati');
    assert.equal(mapped.watek_budi_pangerti, 'Watak Sinta ID');
    assert.equal(mapped.bilahi_bebaya, 'Bilahi ID');

    // Kunci baru / properti JSON dipenuhi
    assert.equal(mapped.id, 1);
    assert.equal(typeof mapped.nama, 'object');
    assert.equal(typeof mapped.dewa, 'object');
    assert.equal(mapped.watak, 'Watak Sinta ID');
  });

  it('2. Sinkronisasi Kunci Kalender Constants: array HARI, PASARAN, NEPTU_HARI & map', () => {
    const raw = {
      nama_hari: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      nama_pasaran: ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'],
      neptu_hari: { minggu: 5, senin: 4, selasa: 3, rabu: 7, kamis: 8, jumat: 6, sabtu: 9 },
      neptu_pasaran: { legi: 5, pahing: 9, pon: 7, wage: 4, kliwon: 8 },
      nama_wuku: ['Sinta', 'Landep'],
      nama_bulan_jawa: ['Sura', 'Sapar'],
      nama_windu: ['Alip', 'Ehe'],
      epoch_pawukon: { jdn: 2459456 }
    };

    const mapped = mapKalenderConstants(raw);

    assert.equal(mapped.HARI.length, 7);
    assert.equal(mapped.nama_hari.length, 7);
    assert.equal(mapped.PASARAN.length, 5);
    assert.equal(mapped.nama_pasaran.length, 5);
    assert.deepEqual(mapped.NEPTU_HARI, [5, 4, 3, 7, 8, 6, 9]);
    assert.deepEqual(mapped.NEPTU_PASARAN, [5, 9, 7, 4, 8]);
    assert.equal(mapped.EPOCH_JDN, 2459456);
  });

  it('3. Sinkronisasi Kunci Dino Rules: dino vs hari, pas vs pasaran, wuku vs wukuName', () => {
    const raw = {
      dino_gede: [
        { hari: 'Selasa', pasaran: 'Wage', wuku: 'Sinta' }
      ]
    };

    const mapped = mapDinoRules(raw);
    const item = mapped.dino_gede[0];

    assert.equal(item.hari, 'Selasa');
    assert.equal(item.dino, 'Selasa');
    assert.equal(item.pasaran, 'Wage');
    assert.equal(item.pas, 'Wage');
    assert.equal(item.wuku, 'Sinta');
    assert.equal(item.wukuName, 'Sinta');
  });

  it('4. Sinkronisasi Kunci Petung Kehidupan: dina vs dino, ternak vs wiwit_ternak, loro vs jalaran_loro, geblak vs petung_geblak', () => {
    const raw = [
      {
        dino: 'Minggu',
        pasaran: 'Pon',
        neptu: 12,
        wiwit_ternak: 'Buto',
        jalaran_loro: 'Lepas',
        geblak: 'Asad'
      }
    ];

    const mapped = mapPetungKehidupan(raw);
    const item = mapped.weton_35['Minggu']['Pon'];

    assert.ok(item);
    assert.equal(item.dina, 'Minggu');
    assert.equal(item.dino, 'Minggu');
    assert.equal(item.pasaran, 'Pon');
    assert.equal(item.neptu_jumlah, 12);
    assert.equal(item.ternak, 'Buto');
    assert.equal(item.wiwit_ternak, 'Buto');
    assert.equal(item.loro, 'Lepas');
    assert.equal(item.jalaran_loro, 'Lepas');
    assert.equal(item.geblak, 'Asad');
    assert.equal(item.petung_geblak, 'Asad');
  });

  it('5. Migrasi Asinkron: loadDomainData berhasil memuat domain-domain utama', async () => {
    const domains = [
      'kalender',
      'wuku',
      'jodoh',
      'nujum',
      'selametan',
      'ijab',
      'omah',
      'petung-kehidupan',
      'sapa-dina',
      'sasmitha',
      'aksara',
      'pustaka',
      'sinengker'
    ];

    for (const d of domains) {
      const data = await loadDomainData(d);
      assert.ok(data, `Domain "${d}" harus mengembalikan data yang valid`);
    }
  });

  it('6. Resilience (Zero Blank Guarantee): domain fallback aktif saat domain tak dikenal / gagal', async () => {
    const fallbackUnknown = await loadDomainData('domain_yang_tidak_ada_xyz');
    assert.equal(fallbackUnknown, null);

    const fallbackKalender = getDomainFallback('kalender');
    assert.ok(fallbackKalender);
    assert.ok(fallbackKalender.constants);
    assert.equal(fallbackKalender.constants.HARI.length, 7);

    const syncWuku = getDomainDataSync('wuku');
    assert.ok(syncWuku);
    assert.ok(Array.isArray(syncWuku.pawukonList));
    assert.equal(syncWuku.pawukonList.length, 30);
  });

  it('7. Jaga Keakuratan Rumus (Zero Change): Nilai JDN, Neptu, dan Pawukon 100% konsisten', () => {
    // Epoch patokan 29 Agustus 2021
    const jdnEpoch = toJDN(2021, 8, 29);
    assert.equal(jdnEpoch, EPOCH_JDN);
    assert.equal(jdnEpoch, 2459456);

    const info = getDayInfo(2021, 8, 29);
    assert.equal(HARI[info.weekdayId], 'Minggu');
    assert.equal(PASARAN[info.pasaranId], 'Pahing');
    assert.equal(WUKU[info.wukuId], 'Sinta');

    const neptuMingguPahing = getNeptu('Minggu', 'Pahing');
    assert.equal(neptuMingguPahing, 14);

    const neptuJumatLegi = getNeptu('Jumat', 'Legi');
    assert.equal(neptuJumatLegi, 11);
  });
});
