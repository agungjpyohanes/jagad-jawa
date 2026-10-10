import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { CANONICAL_KEYS, ALIAS_TO_KEY, resolveCanonicalKey, getCanonicalFilename } from '../js/services/datasetManifest.js';

describe('Domain Alias & Function Canonical Key Mapping Parity', () => {
  const publicDataDir = path.resolve(process.cwd(), 'public/data');

  // Daftar mapping uji domain UI/engine utama
  const domainTestCases = [
    {
      domain: 'Kalender',
      aliases: ['kalenderConstants', '01-kalender-constants.json', '01', '1'],
      expectedCanonical: 'kalender:constants',
      expectedFile: '01-kalender-constants.json'
    },
    {
      domain: 'Pawukon / Wuku',
      aliases: ['wukuEnsiklopedia', '02-wuku-ensiklopedia.json', '02', '2'],
      expectedCanonical: 'wuku:ensiklopedia',
      expectedFile: '02-wuku-ensiklopedia.json'
    },
    {
      domain: 'Nujum Bincil Matrix',
      aliases: ['bincilMatrix', '06-bincil-matrix-bilingual.json', '06', '6'],
      expectedCanonical: 'bincil:matrix',
      expectedFile: '06-bincil-matrix-bilingual.json'
    },
    {
      domain: 'Perjodohan / Pitung',
      aliases: ['pitungPerjodohan', '11-pitung-perjodohan-bilingual.json', '11'],
      expectedCanonical: 'perjodohan:pitung',
      expectedFile: '11-pitung-perjodohan-bilingual.json'
    },
    {
      domain: 'Selametan',
      aliases: ['selametanRules', '14-selametan-rules.json', '14'],
      expectedCanonical: 'selametan:rules',
      expectedFile: '14-selametan-rules.json'
    },
    {
      domain: 'Petung Ijab',
      aliases: ['ijab', '15-ijab-bilingual.json', '15'],
      expectedCanonical: 'ijab:all',
      expectedFile: '15-ijab-bilingual.json'
    },
    {
      domain: 'Petung Omah',
      aliases: ['omah', '23-omah-bilingual.json', '23'],
      expectedCanonical: 'omah:all',
      expectedFile: '23-omah-bilingual.json'
    },
    {
      domain: 'Petung Kehidupan / Ternak',
      aliases: ['petungTernak', '22-petung-ternak-bilingual.json', '22'],
      expectedCanonical: 'petung:ternak',
      expectedFile: '22-petung-ternak-bilingual.json'
    },
    {
      domain: 'Petung Tetanen',
      aliases: ['petungTetanen', '21-petung-tetanen-bilingual.json', '21'],
      expectedCanonical: 'petung:tetanen',
      expectedFile: '21-petung-tetanen-bilingual.json'
    },
    {
      domain: 'Wuku Petenget',
      aliases: ['wukuPetenget', '24-wuku-petenget-bilingual.json', '24'],
      expectedCanonical: 'wuku:petenget',
      expectedFile: '24-wuku-petenget-bilingual.json'
    },
    {
      domain: 'Sasmitha',
      aliases: ['sasmitha', '20-sasmitha.json', '20'],
      expectedCanonical: 'sasmitha:all',
      expectedFile: '20-sasmitha.json'
    },
    {
      domain: 'Aksara',
      aliases: ['aksaraNglegena', '30-aksara-nglegena-bilingual.json', '30'],
      expectedCanonical: 'aksara:nglegena',
      expectedFile: '30-aksara-nglegena-bilingual.json'
    },
    {
      domain: 'Pustaka Jawa',
      aliases: ['pustakaJawa', '36-pustaka-jawa.json', '36'],
      expectedCanonical: 'pustaka:jawa',
      expectedFile: '36-pustaka-jawa.json'
    },
    {
      domain: 'Sinengker Khusus',
      aliases: ['sinengkerKhusus', '37-sinengker-khusus.json', '37'],
      expectedCanonical: 'sinengker:khusus',
      expectedFile: '37-sinengker-khusus.json'
    },
    {
      domain: 'Wayang Purwa (Supplemental)',
      aliases: ['wayang', '38-wayang-all.json', '38'],
      expectedCanonical: 'wayang:all',
      expectedFile: '38-wayang-all.json'
    },
    {
      domain: 'Pitutur Luhur (Supplemental)',
      aliases: ['pitutur', '39-pitutur-all.json', '39'],
      expectedCanonical: 'pitutur:all',
      expectedFile: '39-pitutur-all.json'
    },
    {
      domain: 'Mitologi Nusantara (Supplemental)',
      aliases: ['mitologi', '40-mitologi-all.json', '40'],
      expectedCanonical: 'mitologi:all',
      expectedFile: '40-mitologi-all.json'
    },
    {
      domain: 'Pustaka Digital (Supplemental)',
      aliases: ['pustakaDigital', '41-pustaka-digital.json', '41'],
      expectedCanonical: 'pustaka:digital',
      expectedFile: '41-pustaka-digital.json'
    },
    {
      domain: 'Tumpeng (Supplemental)',
      aliases: ['tumpeng', '42-tumpeng-all.json', '42'],
      expectedCanonical: 'tumpeng:all',
      expectedFile: '42-tumpeng-all.json'
    }
  ];

  for (const tc of domainTestCases) {
    it(`Domain ${tc.domain}: alias terpetakan ke canonical "${tc.expectedCanonical}" dan file lokal "${tc.expectedFile}" valid`, () => {
      // 1. Verifikasi resolver
      for (const alias of tc.aliases) {
        const resolved = resolveCanonicalKey(alias);
        assert.equal(resolved, tc.expectedCanonical, `Alias "${alias}" harus di-resolve ke "${tc.expectedCanonical}"`);
      }

      // 2. Verifikasi manifest entry
      const manifestEntry = CANONICAL_KEYS[tc.expectedCanonical];
      assert.ok(manifestEntry, `Canonical key "${tc.expectedCanonical}" harus terdaftar di CANONICAL_KEYS`);
      assert.equal(manifestEntry.filename, tc.expectedFile, `Filename untuk "${tc.expectedCanonical}" harus "${tc.expectedFile}"`);

      // 3. Verifikasi file fisik di payload lokal
      const filePath = path.join(publicDataDir, tc.expectedFile);
      assert.ok(fs.existsSync(filePath), `File payload fisik "${tc.expectedFile}" harus ada di ${publicDataDir}`);
    });
  }

  it('Canonical manifest menyelesaikan alias ke canonical key dan static filename secara konsisten', () => {
    for (const tc of domainTestCases) {
      for (const alias of tc.aliases) {
        const canonicalKey = resolveCanonicalKey(alias);
        assert.equal(
          canonicalKey,
          tc.expectedCanonical,
          `Alias "${alias}" harus di-resolve ke canonical key "${tc.expectedCanonical}"`
        );

        const filename = getCanonicalFilename(alias);
        assert.equal(
          filename,
          tc.expectedFile,
          `Alias "${alias}" harus mengembalikan filename statis "${tc.expectedFile}"`
        );
      }
    }
  });
});
