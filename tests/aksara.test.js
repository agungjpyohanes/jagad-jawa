import test from 'node:test';
import assert from 'node:assert/strict';
import {
  transliterateLatinToJawa,
  AKSARA_NGLEGENA
} from '../js/modules/aksara/aksara-engine.js';

test('Aksara Engine - Transliterasi suku kata nglegena dasar', () => {
  // hana -> ꦲꦤ
  const resHana = transliterateLatinToJawa('hana');
  assert.equal(resHana, 'ꦲꦤ');

  // cara -> ꦕꦫ
  const resCara = transliterateLatinToJawa('cara');
  assert.equal(resCara, 'ꦕꦫ');

  // data -> ꦢꦠ
  const resData = transliterateLatinToJawa('data');
  assert.equal(resData, 'ꦢꦠ');
});

test('Aksara Engine - Sandhangan Swara (i, u, é, o)', () => {
  // sapa -> ꦱꦥ
  // sapi -> ꦱꦥꦶ (wulu)
  const resSapi = transliterateLatinToJawa('sapi');
  assert.equal(resSapi, 'ꦱꦥꦶ');

  // buku -> ꦧꦸꦏꦸ (suku)
  const resBuku = transliterateLatinToJawa('buku');
  assert.equal(resBuku, 'ꦧꦸꦏꦸ');

  // lele -> ꦭꦺꦭꦺ (taling)
  const resLele = transliterateLatinToJawa('lélé');
  assert.equal(resLele, 'ꦭꦺꦭꦺ');
});

test('Aksara Engine - Sandhangan Panyigeg (-r, -ng, -h, paten)', () => {
  // pasar -> ꦥꦱꦂ (layar)
  const resPasar = transliterateLatinToJawa('pasar');
  assert.equal(resPasar, 'ꦥꦱꦂ');

  // wayang -> ꦮꦪꦁ (cecak)
  const resWayang = transliterateLatinToJawa('wayang');
  assert.equal(resWayang, 'ꦮꦪꦁ');

  // gajah -> ꦒꦗꦃ (wignyan)
  const resGajah = transliterateLatinToJawa('gajah');
  assert.equal(resGajah, 'ꦒꦗꦃ');
});

test('Aksara Engine - Transliterasi Kalimat Real-Time Lengkap', () => {
  // sugeng rawuh -> ꦱꦸꦒꦼꦁ ꦫꦮꦸꦃ
  assert.equal(transliterateLatinToJawa('sugeng rawuh'), 'ꦱꦸꦒꦼꦁ ꦫꦮꦸꦃ');

  // hanacaraka -> ꦲꦤꦕꦫꦏ
  assert.equal(transliterateLatinToJawa('hanacaraka'), 'ꦲꦤꦕꦫꦏ');

  // String kosong
  assert.equal(transliterateLatinToJawa(''), '');
  assert.equal(transliterateLatinToJawa(null), '');
});

test('Studio Aksara UI - Integritas DOM elemen jawaOutput & latinInput di index.html', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

  assert.ok(html.includes('id="latinInput"'), 'index.html harus memuat id="latinInput"');
  assert.ok(html.includes('id="jawaOutput"'), 'index.html harus memuat id="jawaOutput"');
  assert.ok(html.includes('id="charCountLabel"'), 'index.html harus memuat id="charCountLabel"');
  assert.ok(html.includes('convertLatinToJawa()'), 'index.html harus memanggil convertLatinToJawa()');
  assert.ok(html.includes('clearJawaText()'), 'index.html harus memanggil clearJawaText()');
  assert.ok(html.includes('copyJawaText()'), 'index.html harus memanggil copyJawaText()');
  assert.ok(html.includes('setSampleAksara('), 'index.html harus memuat setSampleAksara');
});
