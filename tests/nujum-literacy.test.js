import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NUJUM_GLOSSARY_CONCEPTS,
  getNujumGlossary,
  getNujumSummaryRingkas,
  DISCLAIMER_ETIS_KULTURAL
} from '../js/modules/nujum/nujum-engine.js';

test('Nujum Literacy - Ensiklopedia & Glosarium Konsep Tradisional (3.1)', () => {
  // Harus memuat minimal 9 konsep kosmologi penting
  assert.ok(NUJUM_GLOSSARY_CONCEPTS.length >= 9, 'Glosarium harus memiliki minimal 9 konsep');

  const requiredConceptIds = [
    'padewan',
    'paringkelan',
    'pandangon',
    'paarasan',
    'pancasuda',
    'kamarokan',
    'faalakiah',
    'sirikan_adhep_omah',
    'karakter_dasar_9'
  ];

  for (const cid of requiredConceptIds) {
    const list = getNujumGlossary(cid);
    assert.ok(Array.isArray(list) && list.length > 0, `Konsep ${cid} harus ditemukan di glosarium`);
    const item = list[0];
    assert.ok(item.istilah, `Konsep ${cid} harus memiliki istilah`);
    assert.ok(item.namaJawa, `Konsep ${cid} harus memiliki nama aksara/jawa`);
    assert.ok(item.deskripsi, `Konsep ${cid} harus memiliki deskripsi`);
    assert.ok(item.filosofi, `Konsep ${cid} harus memiliki muatan filosofi edukatif`);
    assert.ok(item.contoh, `Konsep ${cid} harus memiliki contoh penerapan`);
  }

  // Uji filter kabeh (null)
  const all = getNujumGlossary();
  assert.equal(all.length, NUJUM_GLOSSARY_CONCEPTS.length);
});

test('Nujum Literacy - Mode Ringkas NujumSummaryRingkas (3.2)', () => {
  const summary = getNujumSummaryRingkas({
    nama: 'Dananjaya',
    d: 17,
    m: 8,
    y: 1945,
    tahunHitung: 2026
  });

  assert.ok(summary, 'Ikhtisar ringkas harus terbuat');
  assert.equal(summary.nama, 'Dananjaya');
  assert.equal(summary.dino, 'Jumat');
  assert.equal(summary.pas, 'Legi');
  assert.equal(summary.neptu, 11);
  assert.ok(summary.tipeKarakter, 'Harus memiliki tipe karakter dasar 9 tipe');
  assert.ok(summary.deskripsiKarakter, 'Harus memiliki narasi karakter ringkas');
  assert.ok(Array.isArray(summary.kekuatanUtama), 'Kekuatan utama harus berupa array');
  assert.ok(summary.kekuatanUtama.length > 0, 'Harus ada minimal satu kekuatan utama');
  assert.ok(summary.areaWaspada, 'Harus ada pengingat mawas diri / area waspada');
  assert.ok(summary.arahHoki, 'Harus ada arah hoki');
  assert.ok(summary.sirikanRumah, 'Harus ada pantangan arah rumah');
  assert.ok(summary.faalRingkas, 'Harus ada ringkasan faalakiah nabi');
});

test('Nujum Literacy - Etika & Mawas Diri Kultural (3.5)', () => {
  assert.ok(DISCLAIMER_ETIS_KULTURAL, 'Harus ada disclaimer etis');
  assert.ok(DISCLAIMER_ETIS_KULTURAL.includes('mawas diri'), 'Harus memuat prinsip mawas diri');
  assert.ok(DISCLAIMER_ETIS_KULTURAL.includes('Gusti Ingkang Maha Kuwaos'), 'Harus memuat penghormatan pada Gusti Kang Murbeng Dumadi');
  assert.ok(DISCLAIMER_ETIS_KULTURAL.includes('kearifan lokal'), 'Harus menegaskan posisi sebagai kearifan lokal');
});
