import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Tahap D & G — Build Integrity & Production Bundle Verification', () => {
  const distDir = path.resolve(process.cwd(), 'dist');
  const distDataDir = path.join(distDir, 'data');
  const assetsDir = path.join(distDir, 'assets');

  it('1. dist/data harus diterbitkan ke build production dan memuat 42 canonical dataset', () => {
    assert.equal(
      fs.existsSync(distDataDir),
      true,
      'Folder dist/data wajib ada di production build untuk menyajikan dataset statis publik'
    );
    const jsonFiles = fs.readdirSync(distDataDir).filter(f => f.endsWith('.json'));
    assert.ok(
      jsonFiles.length >= 42,
      `dist/data harus memuat minimal 42 canonical dataset, aktual: ${jsonFiles.length}`
    );
  });

  it('2. Tidak boleh ada sentinel string dari database fallback di dist/assets/*.js', () => {
    assert.ok(fs.existsSync(assetsDir), 'Folder dist/assets harus ada');

    const chunkAndMapFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js') || f.endsWith('.map'));
    assert.ok(chunkAndMapFiles.length > 0, 'Harus ada file bundle di dist/assets');

    const sentinels = [
      'sinta_minggu_pahing',
      'PETUNG_TETANEN_LIST',
      'WUKU_PETENGET_LIST',
      'CEMPURI_LAWANGAN',
      'WAYANG_LIST',
      'PITUTUR_LIST',
      'TARGET_HARI_SELAMETAN'
    ];

    const violations = [];

    for (const file of chunkAndMapFiles) {
      const fullPath = path.join(assetsDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');

      for (const sentinel of sentinels) {
        if (content.includes(sentinel)) {
          violations.push({ file, sentinel });
        }
      }
    }

    assert.equal(
      violations.length,
      0,
      `Ditemukan kebocoran sentinel di production bundle: ${JSON.stringify(violations)}`
    );
  });

  it('3. Production bundle tidak boleh merujuk ke API endpoint KV /api/data/', () => {
    const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
    let hasApiDataEndpoint = false;

    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
      if (content.includes('/api/data/')) {
        hasApiDataEndpoint = true;
        break;
      }
    }

    assert.equal(
      hasApiDataEndpoint,
      false,
      'Production bundle tidak boleh lagi merujuk endpoint /api/data/ Cloudflare KV'
    );
  });
});
