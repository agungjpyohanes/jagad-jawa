/**
 * Tests: Kanon Dewa/Wuku/Padewan — B1 s.d. B4
 * Stack: Node.js built-in test runner (node --test)
 * Jalankan: npm test  atau  node --test tests/dewa-kanon.test.js
 *
 * ATURAN: Test ini HANYA menguji ejaan label kanon dan alias resolution.
 * Test ini TIDAK boleh mengunci nilai numerik matrix, NEPTU, EPOCH, atau pitung.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeDewaName,
  resolveAstawara,
  resolveSiklus12,
  resolveWukuDewa,
  illustrationPath,
  wukuLegacyImagePath,
  dewaneLegacyImagePath,
  resolvedImagePath,
  ASTAWARA_8,
  SIKLUS_12,
  SIKLUS12_SLUGS,
  WUKU_DEWA
} from '../js/data/dewa-kanon.js';

// ─── ASTAWARA 8 ──────────────────────────────────────────────────────────────
test('Astawara 8 — integritas data', () => {
  assert.equal(ASTAWARA_8.length, 8, 'Harus ada tepat 8 entry Astawara');
  const slugs = ASTAWARA_8.map(e => e.slug);
  assert.deepEqual(slugs, ['sri', 'indra', 'guru', 'yamadipati', 'rudra', 'brama', 'kala', 'uma']);
});

test('Astawara 8 — label tanpa gelar Batara/Batari', () => {
  for (const entry of ASTAWARA_8) {
    assert.ok(
      !entry.label.includes('Batara') && !entry.label.includes('Batari'),
      `Astawara label "${entry.label}" tidak boleh mengandung Batara/Batari`
    );
  }
});

// ─── RESOLVE ASTAWARA (A1) ────────────────────────────────────────────────────
test('resolveAstawara — Sri (astawara) tetap Sri bukan Batari Sri', () => {
  const entry = resolveAstawara('Sri');
  assert.ok(entry, 'Harus ditemukan');
  assert.equal(entry.label, 'Sri', 'Label astawara harus "Sri" tanpa gelar');
  assert.equal(entry.slug, 'sri');
});

test('resolveAstawara — Yamadipati (astawara) tetap Yamadipati', () => {
  const entry = resolveAstawara('Yamadipati');
  assert.ok(entry, 'Harus ditemukan');
  assert.equal(entry.label, 'Yamadipati');
  assert.equal(entry.slug, 'yamadipati');
});

test('resolveAstawara — alias Yomodipati → astawara Yamadipati', () => {
  const entry = resolveAstawara('Yomodipati');
  assert.ok(entry, 'Alias Yomodipati harus resolve');
  assert.equal(entry.label, 'Yamadipati');
});

test('resolveAstawara — alias Nyamadipati → astawara Yamadipati', () => {
  const entry = resolveAstawara('Nyamadipati');
  assert.ok(entry, 'Alias Nyamadipati harus resolve');
  assert.equal(entry.label, 'Yamadipati');
});

// ─── RESOLVE SIKLUS 12 (A2) ──────────────────────────────────────────────────
test('Siklus 12 — integritas 12 entry dengan gender kanon', () => {
  assert.equal(SIKLUS_12.length, 12, 'Harus ada tepat 12 entry Siklus');
  const batariEntries = SIKLUS_12.filter(e => e.gender === 'batari');
  // Batari = Durga (#3), Sri (#8), Nagagini (#6)
  assert.equal(batariEntries.length, 3, 'Harus ada 3 entry bergender Batari');
  const batariLabels = batariEntries.map(e => e.label);
  assert.ok(batariLabels.includes('Batari Durga'), 'Batari Durga harus ada');
  assert.ok(batariLabels.includes('Batari Sri'), 'Batari Sri harus ada');
  assert.ok(batariLabels.includes('Batari Nagagini'), 'Batari Nagagini harus ada');
});

test('resolveSiklus12 — alias Nogogini → Batari Nagagini', () => {
  const entry = resolveSiklus12('Nogogini');
  assert.ok(entry, 'Alias Nogogini harus resolve');
  assert.equal(entry.label, 'Batari Nagagini', `Expected "Batari Nagagini", got "${entry?.label}"`);
  assert.equal(entry.slug, 'nagini');
});

test('resolveSiklus12 — alias Nagagini → Batari Nagagini', () => {
  const entry = resolveSiklus12('Nagagini');
  assert.ok(entry);
  assert.equal(entry.label, 'Batari Nagagini');
});

test('resolveSiklus12 — alias Komojoyo → Batara Kamajaya', () => {
  const entry = resolveSiklus12('Komojoyo');
  assert.ok(entry, 'Alias Komojoyo harus resolve');
  assert.equal(entry.label, 'Batara Kamajaya', `Expected "Batara Kamajaya", got "${entry?.label}"`);
  assert.equal(entry.slug, 'kamajaya');
});

test('resolveSiklus12 — alias Durgo → Batari Durga', () => {
  const entry = resolveSiklus12('Durgo');
  assert.ok(entry, 'Alias Durgo harus resolve');
  assert.equal(entry.label, 'Batari Durga', `Expected "Batari Durga", got "${entry?.label}"`);
});

test('resolveSiklus12 — alias Batara Durga → Batari Durga (gender fix)', () => {
  const entry = resolveSiklus12('Batara Durga');
  assert.ok(entry);
  assert.equal(entry.label, 'Batari Durga');
});

test('resolveSiklus12 — "Batara Sri" (konteks siklus 12) → Batari Sri', () => {
  const entry = resolveSiklus12('Batara Sri');
  assert.ok(entry, 'Batara Sri harus resolve ke Batari Sri di siklus 12');
  assert.equal(entry.label, 'Batari Sri');
  assert.equal(entry.gender, 'batari');
});

test('resolveSiklus12 — by nomor urut 3 → Batari Durga', () => {
  const entry = resolveSiklus12(3);
  assert.ok(entry);
  assert.equal(entry.label, 'Batari Durga');
});

test('resolveSiklus12 — by nomor urut 12 → Batara Yamadipati', () => {
  const entry = resolveSiklus12(12);
  assert.ok(entry);
  assert.equal(entry.label, 'Batara Yamadipati');
});

test('resolveSiklus12 — alias Yomodipati → Batara Yamadipati (konteks siklus12)', () => {
  const entry = resolveSiklus12('Yomodipati');
  assert.ok(entry, 'Alias Yomodipati harus resolve ke siklus12');
  assert.equal(entry.label, 'Batara Yamadipati');
});

// ─── RESOLVE WUKU DEWA (A3) ──────────────────────────────────────────────────
test('Wuku Dewa — integritas 30 entry', () => {
  assert.equal(WUKU_DEWA.length, 30, 'Harus ada tepat 30 entry Wuku Dewa');
  assert.equal(WUKU_DEWA[0].wuku, 'Sinta');
  assert.equal(WUKU_DEWA[29].wuku, 'Watugunung');
});

test('resolveWukuDewa — Sinta (#1) dewane = Sang Hyang Yamadipati', () => {
  const entry = resolveWukuDewa(1);
  assert.ok(entry);
  assert.equal(entry.dewane, 'Sang Hyang Yamadipati');
  assert.ok(entry.aliases.some(a => a.includes('Nyamadipati')), 'Alias Nyamadipati harus ada');
});

test('resolveWukuDewa — alias Nyamadipati → dewane Yamadipati (Sinta)', () => {
  const entry = resolveWukuDewa('Sang Hyang Nyamadipati');
  assert.ok(entry, 'Alias Nyamadipati harus resolve ke wuku Sinta');
  assert.equal(entry.no_wuku, 1);
  assert.equal(entry.dewane, 'Sang Hyang Yamadipati');
});

test('resolveWukuDewa — Galungan (#11) dewane = Sang Hyang Kamajaya', () => {
  const entry = resolveWukuDewa(11);
  assert.ok(entry);
  assert.equal(entry.dewane, 'Sang Hyang Kamajaya');
  assert.ok(entry.aliases.some(a => a.includes('Kumajaya')), 'Alias Kumajaya harus ada');
});

test('resolveWukuDewa — alias Kumajaya → Sang Hyang Kamajaya (Galungan)', () => {
  const entry = resolveWukuDewa('Sang Hyang Kumajaya');
  assert.ok(entry, 'Alias Kumajaya harus resolve');
  assert.equal(entry.dewane, 'Sang Hyang Kamajaya');
});

test('resolveWukuDewa — Kuningan (#12) dewane = Sang Hyang Indra', () => {
  const entry = resolveWukuDewa(12);
  assert.ok(entry);
  assert.equal(entry.dewane, 'Sang Hyang Indra');
  assert.ok(entry.aliases.some(a => a.includes('Endra') || a.includes('Endro')));
});

test('resolveWukuDewa — Julungpujut (#15) dewane = Sang Hyang Guritna', () => {
  const entry = resolveWukuDewa(15);
  assert.ok(entry);
  assert.equal(entry.dewane, 'Sang Hyang Guritna');
  assert.ok(entry.aliases.some(a => a.includes('Guretna')), 'Alias Guretna harus ada');
});

test('resolveWukuDewa — alias Guretna → Sang Hyang Guritna (Julungpujut)', () => {
  const entry = resolveWukuDewa('Sang Hyang Guretna');
  assert.ok(entry, 'Alias Guretna harus resolve');
  assert.equal(entry.dewane, 'Sang Hyang Guritna');
});

test('resolveWukuDewa — Watugunung (#30) dewane = Anantaboga lan Batari Nagagini', () => {
  const entry = resolveWukuDewa(30);
  assert.ok(entry);
  assert.ok(entry.dewane.includes('Anantaboga'), 'Harus mengandung Anantaboga');
  assert.ok(entry.dewane.includes('Batari Nagagini'), 'Harus mengandung Batari Nagagini (bukan Batara)');
  assert.ok(!entry.dewane.includes('Batara Nagagini'), 'Tidak boleh mengandung "Batara Nagagini"');
});

test('resolveWukuDewa — by nama wuku string (case-insensitive)', () => {
  const entry = resolveWukuDewa('galungan');
  assert.ok(entry);
  assert.equal(entry.no_wuku, 11);
});

// ─── normalizeDewaName ────────────────────────────────────────────────────────
test('normalizeDewaName — Nyamadipati → "Yamadipati" (astawara)', () => {
  // Cari di astawara dulu, Yamadipati ada di astawara
  const result = normalizeDewaName('Nyamadipati');
  assert.ok(result.includes('Yamadipati'), `Harus mengandung Yamadipati, dapat: "${result}"`);
});

test('normalizeDewaName — Sang Hyang Kumajaya → Sang Hyang Kamajaya', () => {
  const result = normalizeDewaName('Sang Hyang Kumajaya');
  assert.equal(result, 'Sang Hyang Kamajaya');
});

test('normalizeDewaName — input tidak dikenal dikembalikan apa adanya', () => {
  const input = 'Dewa Tidak Ada';
  const result = normalizeDewaName(input);
  assert.equal(result, input);
});

// ─── ILLUSTRATION PATH ───────────────────────────────────────────────────────
test('illustrationPath — format path JPG absolut yang benar', () => {
  assert.equal(illustrationPath('wuku', 'sinta'), '/assets/illustrations/wuku/sinta.jpg');
  assert.equal(illustrationPath('wuku', 'watugunung'), '/assets/illustrations/wuku/watugunung.jpg');
  assert.equal(illustrationPath('dewane', 'sinta'), '/assets/illustrations/dewane/sinta-dewane.jpg');
  assert.equal(illustrationPath('dewane', 'watugunung'), '/assets/illustrations/dewane/watugunung-dewane.jpg');
  assert.equal(illustrationPath('siklus12', 'durga'), '/assets/illustrations/siklus12/durga.jpg');
  assert.equal(illustrationPath('siklus12', 'endro'), '/assets/illustrations/siklus12/endro.jpg');
  assert.equal(illustrationPath('siklus12', 'sri'), '/assets/illustrations/siklus12/sri.jpg');
  assert.equal(illustrationPath('siklus12', 'sri12'), '/assets/illustrations/siklus12/sri.jpg');
  assert.equal(illustrationPath('siklus12', 'yamadipati'), '/assets/illustrations/siklus12/yamadipati.jpg');
});

test('SIKLUS12_SLUGS — integritas dan urutan 12 slug kanon', () => {
  assert.equal(SIKLUS12_SLUGS.length, 12);
  assert.deepEqual(SIKLUS12_SLUGS, [
    'suryo', 'bromo', 'durga', 'asmoro', 'isworo', 'nagini',
    'kamajaya', 'sri', 'bayu', 'wisnu', 'endro', 'yamadipati'
  ]);
});

test('wukuLegacyImagePath — Sinta → assets/wuku/Sinta.jpg', () => {
  const path = wukuLegacyImagePath(1);
  assert.equal(path, 'assets/wuku/Sinta.jpg');
});

test('dewaneLegacyImagePath — Sinta (#1) → assets/dewa-wuku/Sang Hyang Yamadipati.jpg', () => {
  const path = dewaneLegacyImagePath(1);
  assert.ok(path.includes('Yamadipati'), `Path harus mengandung Yamadipati, dapat: "${path}"`);
});

test('dewaneLegacyImagePath — Kulawu (#28) exception: Sadana bukan Sadhana', () => {
  const path = dewaneLegacyImagePath(28);
  assert.ok(path.includes('Sadana'), 'Path legacy Kulawu harus pakai Sadana (nama file lama)');
});

test('resolvedImagePath — wuku → best = jpg absolut', () => {
  const result = resolvedImagePath('wuku', 1);
  assert.ok(result.best.endsWith('.jpg'), 'Best path untuk wuku harus .jpg');
  assert.equal(result.best, '/assets/illustrations/wuku/sinta.jpg');
});

test('resolvedImagePath — siklus12 → best = jpg absolut', () => {
  const result = resolvedImagePath('siklus12', 3);
  assert.ok(result.best.endsWith('.jpg'), 'Best path untuk siklus12 harus .jpg');
  assert.equal(result.best, '/assets/illustrations/siklus12/durga.jpg');
});

// ─── PEMISAHAN SISTEM (TIDAK BOLEH CAMPUR) ────────────────────────────────────
test('PEMISAHAN: Astawara Sri ≠ Siklus12 Sri', () => {
  const astawara = resolveAstawara('Sri');
  const siklus   = resolveSiklus12('Sri');
  // Sri di astawara: label = 'Sri' (tanpa gelar)
  assert.equal(astawara?.label, 'Sri');
  // Sri di siklus12: label = 'Batari Sri' (dengan Batari)
  assert.equal(siklus?.label, 'Batari Sri');
  // Slug berbeda untuk mencegah tabrakan di map ilustrasi
  assert.equal(astawara?.slug, 'sri');
  assert.equal(siklus?.slug, 'sri12');
});

test('PEMISAHAN: Astawara Yamadipati ≠ Siklus12 Yamadipati', () => {
  const astawara = resolveAstawara('Yamadipati');
  const siklus   = resolveSiklus12('Yamadipati');
  assert.equal(astawara?.label, 'Yamadipati');       // tanpa gelar
  assert.equal(siklus?.label, 'Batara Yamadipati');  // dengan Batara
  assert.equal(astawara?.slug, 'yamadipati');
  assert.equal(siklus?.slug, 'yamadipati12');
});
