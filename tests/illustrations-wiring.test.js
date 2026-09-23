/**
 * Tests: Illustration Assets Wiring & Acceptance Criteria Verification
 * Stack: Node.js built-in test runner (node --test)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

import {
  illustrationPath,
  SIKLUS12_SLUGS,
  SIKLUS_12,
  WUKU_DEWA,
  resolveSiklus12,
  resolveWukuDewa
} from '../js/data/dewa-kanon.js';

import {
  getWukuDetailSummary,
  getAllWuku
} from '../js/modules/wuku/wuku-engine.js';

test('Kriteria 1: Fungsi illustrationPath berjalan akurat', () => {
  // Wuku
  assert.equal(illustrationPath('wuku', 'sinta'), '/assets/illustrations/wuku/sinta.jpg');
  assert.equal(illustrationPath('wuku', 'landep'), '/assets/illustrations/wuku/landep.jpg');
  assert.equal(illustrationPath('wuku', 'watugunung'), '/assets/illustrations/wuku/watugunung.jpg');
  assert.equal(illustrationPath('wuku', 'Galungan'), '/assets/illustrations/wuku/galungan.jpg');

  // Dewane
  assert.equal(illustrationPath('dewane', 'sinta'), '/assets/illustrations/dewane/sinta-dewane.jpg');
  assert.equal(illustrationPath('dewane', 'galungan'), '/assets/illustrations/dewane/galungan-dewane.jpg');
  assert.equal(illustrationPath('dewane', 'watugunung'), '/assets/illustrations/dewane/watugunung-dewane.jpg');

  // Siklus 12
  assert.equal(illustrationPath('siklus12', 'suryo'), '/assets/illustrations/siklus12/suryo.jpg');
  assert.equal(illustrationPath('siklus12', 'durga'), '/assets/illustrations/siklus12/durga.jpg');
  assert.equal(illustrationPath('siklus12', 'endro'), '/assets/illustrations/siklus12/endro.jpg');
  assert.equal(illustrationPath('siklus12', 'sri'), '/assets/illustrations/siklus12/sri.jpg');
  assert.equal(illustrationPath('siklus12', 'yamadipati'), '/assets/illustrations/siklus12/yamadipati.jpg');
});

test('Kriteria 2: File Fisik Gambar Tersedia di public/assets/illustrations/', () => {
  const publicDir = path.join(rootDir, 'public', 'assets', 'illustrations');
  assert.ok(fs.existsSync(publicDir), 'Folder public/assets/illustrations harus ada');

  // 30 Wuku
  const allWuku = getAllWuku();
  assert.equal(allWuku.length, 30);
  for (const w of allWuku) {
    const slug = w.nama_wuku.toLowerCase().trim();
    const wukuFile = path.join(publicDir, 'wuku', `${slug}.jpg`);
    assert.ok(fs.existsSync(wukuFile), `File wuku ${slug}.jpg harus ada`);

    const dewaneFile = path.join(publicDir, 'dewane', `${slug}-dewane.jpg`);
    assert.ok(fs.existsSync(dewaneFile), `File dewane ${slug}-dewane.jpg harus ada`);
  }

  // 12 Siklus
  assert.equal(SIKLUS12_SLUGS.length, 12);
  for (const s of SIKLUS12_SLUGS) {
    const siklusFile = path.join(publicDir, 'siklus12', `${s}.jpg`);
    assert.ok(fs.existsSync(siklusFile), `File siklus12 ${s}.jpg harus ada`);
  }
});

test('Kriteria 2: getWukuDetailSummary memuat field imageWuku dan imageDewane (sinta, galungan, watugunung)', () => {
  const testCases = [
    { name: 'Sinta', wukuSlug: 'sinta', dewaneSlug: 'sinta-dewane' },
    { name: 'Galungan', wukuSlug: 'galungan', dewaneSlug: 'galungan-dewane' },
    { name: 'Watugunung', wukuSlug: 'watugunung', dewaneSlug: 'watugunung-dewane' }
  ];

  for (const tc of testCases) {
    const summary = getWukuDetailSummary(tc.name);
    assert.ok(summary, `Summary wuku ${tc.name} harus ada`);
    assert.equal(summary.imageWuku, `/assets/illustrations/wuku/${tc.wukuSlug}.jpg`);
    assert.equal(summary.imageDewane, `/assets/illustrations/dewane/${tc.dewaneSlug}.jpg`);
  }
});

test('Kriteria 3: Grid Siklus 12 memuat 12 Dewa dengan nama kanon yang benar (termasuk endro)', () => {
  assert.deepEqual(SIKLUS12_SLUGS, [
    'suryo', 'bromo', 'durga', 'asmoro', 'isworo', 'nagini',
    'kamajaya', 'sri', 'bayu', 'wisnu', 'endro', 'yamadipati'
  ]);

  const endroEntry = resolveSiklus12('endro');
  assert.ok(endroEntry);
  assert.equal(endroEntry.label, 'Batara Endro', 'Label kanon harus Batara Endro bukan Batara Endra');
  assert.equal(endroEntry.slug, 'endro');

  const durgaEntry = resolveSiklus12('durga');
  assert.equal(durgaEntry.label, 'Batari Durga');

  const sriEntry = resolveSiklus12('sri');
  assert.equal(sriEntry.label, 'Batari Sri');
});

test('Kriteria 4: Template HTML memuat atribut lazy, async, aspect-ratio, dan onerror', () => {
  const wukuUiSrc = fs.readFileSync(path.join(rootDir, 'js', 'modules', 'wuku', 'wuku-ui.js'), 'utf8');
  assert.ok(wukuUiSrc.includes('loading="lazy"'), 'Harus memuat loading="lazy"');
  assert.ok(wukuUiSrc.includes('decoding="async"'), 'Harus memuat decoding="async"');
  assert.ok(wukuUiSrc.includes('aspect-ratio: 400/560;'), 'Harus memuat aspect-ratio: 400/560;');
  assert.ok(wukuUiSrc.includes('object-fit: cover;'), 'Harus memuat object-fit: cover;');
  assert.ok(wukuUiSrc.includes('onerror='), 'Harus memuat handler onerror');

  const ensikloSrc = fs.readFileSync(path.join(rootDir, 'js', 'modules', 'budaya', 'ensiklopedia-budaya.js'), 'utf8');
  assert.ok(ensikloSrc.includes('loading="lazy"'), 'Ensiklopedia budaya harus memuat loading="lazy"');
  assert.ok(ensikloSrc.includes('decoding="async"'), 'Ensiklopedia budaya harus memuat decoding="async"');
  assert.ok(ensikloSrc.includes('aspect-ratio: 400/560;'), 'Ensiklopedia budaya harus memuat aspect-ratio: 400/560;');
  assert.ok(ensikloSrc.includes('onerror='), 'Ensiklopedia budaya harus memuat handler onerror');
});
