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
